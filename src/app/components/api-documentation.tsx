import { useState, useEffect } from 'react';
import { 
  Lock, Unlock, CheckCircle2, XCircle, AlertCircle, 
  Play, ChevronRight, ChevronDown, Copy, Check,
  User, LogOut, TestTube, FileJson, Server, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface Endpoint {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  path: string;
  description: string;
  availability: 'available' | 'missing' | 'partial';
  authRequired: boolean;
  parameters?: Parameter[];
  requestBody?: any;
  responseExample?: any;
  notes?: string;
}

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
  loading: boolean;
  error: string | null;
}

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Endpoint Data
const API_ENDPOINTS = {
  authentication: [
    {
      method: 'POST',
      path: '/api/v1/auth/login',
      description: 'Authenticate user with email and password',
      availability: 'available',
      authRequired: false,
      parameters: [],
      requestBody: {
        email: 'user@example.com',
        password: 'password123'
      },
      responseExample: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          email: 'user@example.com',
          name: 'John Doe'
        }
      }
    },
    {
      method: 'POST',
      path: '/api/v1/auth/signup',
      description: 'Register a new user account',
      availability: 'available',
      authRequired: false,
      parameters: [],
      requestBody: {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User'
      },
      responseExample: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 2,
          email: 'newuser@example.com',
          name: 'New User'
        }
      }
    },
    {
      method: 'POST',
      path: '/api/v1/auth/logout',
      description: 'Logout and invalidate current token',
      availability: 'available',
      authRequired: true,
      parameters: [],
      responseExample: {
        message: 'Successfully logged out'
      }
    },
    {
      method: 'POST',
      path: '/api/v1/auth/google',
      description: 'Authenticate with Google OAuth',
      availability: 'available',
      authRequired: false,
      parameters: [],
      requestBody: {
        id_token: 'google_oauth_id_token'
      },
      responseExample: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          email: 'user@gmail.com',
          name: 'Google User'
        }
      }
    }
  ],
  projects: [
    {
      method: 'GET',
      path: '/api/v1/projects',
      description: 'List all projects for authenticated user',
      availability: 'available',
      authRequired: true,
      parameters: [
        { name: 'search', type: 'string', required: false, description: 'Search term for project name', example: 'marketing' },
        { name: 'status', type: 'string', required: false, description: 'Filter by status', example: 'active' },
        { name: 'page', type: 'integer', required: false, description: 'Page number', example: '1' },
        { name: 'per_page', type: 'integer', required: false, description: 'Items per page', example: '20' }
      ],
      responseExample: {
        projects: [
          {
            id: 1,
            name: 'Marketing Campaign',
            domain: 'example.com',
            context: 'Q4 marketing initiative',
            target_audience: 'Small business owners',
            articles_count: 12,
            created_at: '2026-01-15T10:30:00Z'
          }
        ],
        meta: {
          total_count: 5,
          page: 1,
          per_page: 20
        }
      }
    },
    {
      method: 'POST',
      path: '/api/v1/projects',
      description: 'Create a new project',
      availability: 'available',
      authRequired: true,
      parameters: [],
      requestBody: {
        name: 'New Project',
        domain: 'newproject.com',
        context: 'Project description',
        target_audience: 'Target audience description'
      },
      responseExample: {
        project: {
          id: 6,
          name: 'New Project',
          domain: 'newproject.com',
          context: 'Project description',
          target_audience: 'Target audience description',
          articles_count: 0,
          created_at: '2026-08-06T12:00:00Z'
        }
      }
    },
    {
      method: 'GET',
      path: '/api/v1/projects/:id',
      description: 'Get project details',
      availability: 'available',
      authRequired: true,
      parameters: [
        { name: 'id', type: 'integer', required: true, description: 'Project ID', example: '1' }
      ],
      responseExample: {
        project: {
          id: 1,
          name: 'Marketing Campaign',
          domain: 'example.com',
          context: 'Q4 marketing initiative',
          target_audience: 'Small business owners',
          brand_guidelines: 'Use brand colors and logo',
          include_intros: true,
          default_avatar: 'avatar_1',
          articles_count: 12,
          created_at: '2026-01-15T10:30:00Z',
          updated_at: '2026-08-01T15:20:00Z'
        }
      }
    },
    {
      method: 'PATCH',
      path: '/api/v1/projects/:id',
      description: 'Update project details',
      availability: 'available',
      authRequired: true,
      parameters: [
        { name: 'id', type: 'integer', required: true, description: 'Project ID', example: '1' }
      ],
      requestBody: {
        name: 'Updated Project Name',
        context: 'Updated description'
      },
      responseExample: {
        project: {
          id: 1,
          name: 'Updated Project Name',
          domain: 'example.com',
          context: 'Updated description',
          target_audience: 'Small business owners',
          articles_count: 12,
          updated_at: '2026-08-06T12:30:00Z'
        }
      }
    },
    {
      method: 'DELETE',
      path: '/api/v1/projects/:id',
      description: 'Delete a project',
      availability: 'available',
      authRequired: true,
      parameters: [
        { name: 'id', type: 'integer', required: true, description: 'Project ID', example: '1' }
      ],
      responseExample: {
        message: 'Project deleted successfully'
      }
    }
  ],
  resources: [
    {
      method: 'GET',
      path: '/api/v1/resources',
      description: 'List all resources (videos, articles)',
      availability: 'available',
      authRequired: true,
      parameters: [
        { name: 'status', type: 'string', required: false, description: 'Filter by status', example: 'active' },
        { name: 'page', type: 'integer', required: false, description: 'Page number', example: '1' },
        { name: 'per_page', type: 'integer', required: false, description: 'Items per page', example: '20' }
      ],
      responseExample: {
        resources: [
          {
            id: 1,
            title: 'Marketing Video',
            resource_type: 'video',
            url: 'https://example.com/video.mp4',
            status: 'active',
            created_at: '2026-07-01T10:00:00Z'
          }
        ],
        meta: {
          total_count: 15,
          page: 1,
          per_page: 20
        }
      }
    },
    {
      method: 'GET',
      path: '/api/v1/resources/:id',
      description: 'Get resource details',
      availability: 'available',
      authRequired: true,
      parameters: [
        { name: 'id', type: 'integer', required: true, description: 'Resource ID', example: '1' }
      ],
      responseExample: {
        resource: {
          id: 1,
          title: 'Marketing Video',
          resource_type: 'video',
          url: 'https://example.com/video.mp4',
          status: 'active',
          duration: 120,
          thumbnail_url: 'https://example.com/thumb.jpg',
          created_at: '2026-07-01T10:00:00Z',
          updated_at: '2026-07-15T14:30:00Z'
        }
      }
    },
    {
      method: 'POST',
      path: '/api/v1/resources/:id/extract',
      description: 'Extract clips from resource',
      availability: 'available',
      authRequired: true,
      parameters: [
        { name: 'id', type: 'integer', required: true, description: 'Resource ID', example: '1' }
      ],
      responseExample: {
        message: 'Extraction started',
        job_id: 'extract_12345'
      }
    }
  ],
  avatars: [
    {
      method: 'GET',
      path: '/api/v1/avatars',
      description: 'List all avatar profiles',
      availability: 'available',
      authRequired: true,
      parameters: [],
      responseExample: {
        profiles: [
          {
            id: 1,
            name: 'Professional Avatar',
            tone: 'formal',
            level: 'expert',
            description: 'Professional business avatar',
            status: 'active',
            created_at: '2026-06-01T10:00:00Z'
          }
        ]
      }
    },
    {
      method: 'POST',
      path: '/api/v1/avatars',
      description: 'Create a new avatar profile',
      availability: 'available',
      authRequired: true,
      parameters: [],
      requestBody: {
        name: 'New Avatar',
        tone: 'casual',
        level: 'intermediate',
        description: 'Casual friendly avatar'
      },
      responseExample: {
        profile: {
          id: 2,
          name: 'New Avatar',
          tone: 'casual',
          level: 'intermediate',
          description: 'Casual friendly avatar',
          status: 'active',
          created_at: '2026-08-06T12:00:00Z'
        }
      }
    }
  ],
  socialAutomation: [
    {
      method: 'GET',
      path: '/api/v1/sa_accounts',
      description: 'List all social media accounts',
      availability: 'available',
      authRequired: true,
      parameters: [],
      responseExample: {
        accounts: [
          {
            id: 1,
            account_name: 'Marketing Account',
            network: 'instagram',
            profile_name: '@marketing',
            is_connected: true,
            platform: 'Instagram'
          }
        ]
      }
    },
    {
      method: 'POST',
      path: '/api/v1/sa_accounts',
      description: 'Add a new social media account',
      availability: 'available',
      authRequired: true,
      parameters: [],
      requestBody: {
        account_name: 'New Account',
        network: 'youtube',
        profile_name: '@newchannel'
      },
      responseExample: {
        account: {
          id: 2,
          account_name: 'New Account',
          network: 'youtube',
          profile_name: '@newchannel',
          is_connected: false,
          platform: 'YouTube'
        }
      }
    },
    {
      method: 'POST',
      path: '/api/v1/sa_accounts/:id/post_to_ig',
      description: 'Post video to Instagram',
      availability: 'available',
      authRequired: true,
      parameters: [
        { name: 'id', type: 'integer', required: true, description: 'Account ID', example: '1' }
      ],
      requestBody: {
        video_url: 'https://example.com/video.mp4',
        caption: 'Check out our latest video!',
        hashtags: ['#marketing', '#socialmedia']
      },
      responseExample: {
        success: true,
        post_id: 'ig_post_12345',
        post_url: 'https://instagram.com/p/abc123'
      }
    },
    {
      method: 'POST',
      path: '/api/v1/sa_accounts/:id/post_to_youtube',
      description: 'Post video to YouTube',
      availability: 'available',
      authRequired: true,
      parameters: [
        { name: 'id', type: 'integer', required: true, description: 'Account ID', example: '1' }
      ],
      requestBody: {
        video_url: 'https://example.com/video.mp4',
        title: 'Marketing Video',
        description: 'Video description',
        tags: ['marketing', 'business']
      },
      responseExample: {
        success: true,
        video_url: 'https://youtube.com/watch?v=abc123',
        video_id: 'yt_video_12345'
      }
    }
  ],
  campaigns: [
    {
      method: 'GET',
      path: '/api/v1/campaigns',
      description: 'List all campaigns',
      availability: 'missing',
      authRequired: true,
      parameters: [],
      responseExample: {
        campaigns: [
          {
            id: 1,
            name: 'Q4 Campaign',
            duration_weeks: 12,
            start_date: '2026-10-01',
            end_date: '2026-12-31',
            status: 'draft'
          }
        ]
      },
      notes: 'This endpoint is not yet implemented in the Rails API. Required for Orcaru campaign management.'
    }
  ],
  contentItems: [
    {
      method: 'GET',
      path: '/api/v1/content_items',
      description: 'List all content items',
      availability: 'missing',
      authRequired: true,
      parameters: [],
      responseExample: {
        content_items: [
          {
            id: 1,
            content_type: 'long-form',
            platform: 'instagram',
            title: 'Marketing Post',
            status: 'draft'
          }
        ]
      },
      notes: 'This endpoint is not yet implemented in the Rails API. Required for Orcaru content management.'
    }
  ],
  brandKits: [
    {
      method: 'GET',
      path: '/api/v1/brand_kits',
      description: 'List all brand kits',
      availability: 'missing',
      authRequired: true,
      parameters: [],
      responseExample: {
        brand_kits: [
          {
            id: 1,
            name: 'Default Brand Kit',
            primary_color: '#3B82F6',
            secondary_color: '#1E40AF'
          }
        ]
      },
      notes: 'This endpoint is not yet implemented in the Rails API. Required for Orcaru brand management.'
    }
  ],
  audits: [
    {
      method: 'GET',
      path: '/api/v1/audits',
      description: 'List all audits',
      availability: 'missing',
      authRequired: true,
      parameters: [],
      responseExample: {
        audits: [
          {
            id: 1,
            name: 'Social Media Audit',
            platforms: ['instagram', 'youtube'],
            total_posts: 150
          }
        ]
      },
      notes: 'This endpoint is not yet implemented in the Rails API. Required for Orcaru audit functionality.'
    }
  ]
};

// Helper Components
const MethodBadge = ({ method }: { method: string }) => {
  const colors: Record<string, string> = {
    GET: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    POST: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    PATCH: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    PUT: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    DELETE: 'bg-red-500/10 text-red-400 border-red-500/20'
  };

  return (
    <span className={cn(
      'px-2.5 py-1 rounded-md text-xs font-bold border font-mono',
      colors[method] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    )}>
      {method}
    </span>
  );
};

const AvailabilityBadge = ({ status }: { status: string }) => {
  const config: Record<string, { icon: any; color: string; label: string }> = {
    available: { icon: CheckCircle2, color: 'text-emerald-400', label: 'Available' },
    missing: { icon: XCircle, color: 'text-red-400', label: 'Not Implemented' },
    partial: { icon: AlertCircle, color: 'text-amber-400', label: 'Partial' }
  };

  const { icon: Icon, color, label } = config[status] || config.available;

  return (
    <div className={cn('flex items-center gap-1.5 text-xs', color)}>
      <Icon className="w-3.5 h-3.5" />
      <span>{label}</span>
    </div>
  );
};

const JsonViewer = ({ data }: { data: any }) => {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-1.5 rounded-md bg-gray-800/80 hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
      </button>
      <pre className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 overflow-x-auto text-xs font-mono text-gray-300">
        {jsonString}
      </pre>
    </div>
  );
};

// Main Component
export default function ApiDocumentation() {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    user: null,
    loading: false,
    error: null
  });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [selectedCategory, setSelectedCategory] = useState('authentication');
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [testingEndpoint, setTestingEndpoint] = useState<string | null>(null);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('auth_user');
    if (token && user) {
      setAuth({
        isAuthenticated: true,
        token,
        user: JSON.parse(user),
        loading: false,
        error: null
      });
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuth(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Login failed');
      }

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));

      setAuth({
        isAuthenticated: true,
        token: data.token,
        user: data.user,
        loading: false,
        error: null
      });
    } catch (error) {
      setAuth({
        isAuthenticated: false,
        token: null,
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Login failed'
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setAuth({
      isAuthenticated: false,
      token: null,
      user: null,
      loading: false,
      error: null
    });
  };

  const testEndpoint = async (endpoint: Endpoint) => {
    const endpointKey = `${endpoint.method} ${endpoint.path}`;
    setTestingEndpoint(endpointKey);
    setTestResults(prev => ({ ...prev, [endpointKey]: { loading: true } }));

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (endpoint.authRequired && auth.token) {
        headers['Authorization'] = `Bearer ${auth.token}`;
      }

      const options: RequestInit = {
        method: endpoint.method,
        headers
      };

      if (['POST', 'PATCH', 'PUT'].includes(endpoint.method) && endpoint.requestBody) {
        options.body = JSON.stringify(endpoint.requestBody);
      }

      const response = await fetch(`${API_BASE_URL}${endpoint.path}`, options);
      const data = await response.json().catch(() => null);

      setTestResults(prev => ({
        ...prev,
        [endpointKey]: {
          loading: false,
          status: response.status,
          statusText: response.statusText,
          data
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [endpointKey]: {
          loading: false,
          error: error instanceof Error ? error.message : 'Request failed'
        }
      }));
    } finally {
      setTestingEndpoint(null);
    }
  };

  const categories = [
    { id: 'authentication', label: 'Authentication', icon: Lock, count: API_ENDPOINTS.authentication.length },
    { id: 'projects', label: 'Projects', icon: FileJson, count: API_ENDPOINTS.projects.length },
    { id: 'resources', label: 'Resources', icon: Server, count: API_ENDPOINTS.resources.length },
    { id: 'avatars', label: 'Avatars', icon: User, count: API_ENDPOINTS.avatars.length },
    { id: 'socialAutomation', label: 'Social Automation', icon: Zap, count: API_ENDPOINTS.socialAutomation.length },
    { id: 'campaigns', label: 'Campaigns', icon: FileJson, count: API_ENDPOINTS.campaigns.length },
    { id: 'contentItems', label: 'Content Items', icon: FileJson, count: API_ENDPOINTS.contentItems.length },
    { id: 'brandKits', label: 'Brand Kits', icon: FileJson, count: API_ENDPOINTS.brandKits.length },
    { id: 'audits', label: 'Audits', icon: FileJson, count: API_ENDPOINTS.audits.length }
  ];

  const currentEndpoints = API_ENDPOINTS[selectedCategory as keyof typeof API_ENDPOINTS] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <FileJson className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Orcaru API Documentation
                </h1>
                <p className="text-xs text-gray-500">Rails API v1 • Interactive Explorer</p>
              </div>
            </div>

            {/* Auth Status */}
            <div className="flex items-center gap-4">
              {auth.isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <Unlock className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-emerald-400 font-medium">Authenticated</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{auth.user?.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-red-400">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span className="text-sm text-amber-400 font-medium">Not Authenticated</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="col-span-3">
            {/* Login Form */}
            {!auth.isAuthenticated && (
              <div className="mb-6 p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Login to Test API
                </h3>
                <form onSubmit={handleLogin} className="space-y-3">
                  <input
                    type="email"
                    placeholder="Email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    required
                  />
                  {auth.error && (
                    <p className="text-xs text-red-400">{auth.error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={auth.loading}
                    className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
                  >
                    {auth.loading ? 'Logging in...' : 'Login'}
                  </button>
                </form>
              </div>
            )}

            {/* User Info */}
            {auth.isAuthenticated && auth.user && (
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20">
                <h3 className="text-sm font-semibold text-emerald-400 mb-3">Account Data</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">ID:</span>
                    <span className="text-gray-300 font-mono">{auth.user.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span className="text-gray-300">{auth.user.email}</span>
                  </div>
                  {auth.user.name && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name:</span>
                      <span className="text-gray-300">{auth.user.name}</span>
                    </div>
                  )}
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  This data can populate user profile sections across the platform.
                </p>
              </div>
            )}

            {/* Navigation */}
            <nav className="space-y-1">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                API Endpoints
              </h3>
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id;
                const endpoints = API_ENDPOINTS[category.id as keyof typeof API_ENDPOINTS];
                const availableCount = endpoints.filter(e => e.availability === 'available').length;

                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all',
                      isActive
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{category.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-600">{availableCount}/{category.count}</span>
                      <ChevronRight className={cn('w-3.5 h-3.5 transition-transform', isActive && 'rotate-90')} />
                    </div>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="col-span-9">
            <div className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-100">
                    {categories.find(c => c.id === selectedCategory)?.label}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {currentEndpoints.filter(e => e.availability === 'available').length} of {currentEndpoints.length} endpoints available
                  </p>
                </div>
              </div>

              {/* Endpoints List */}
              <div className="space-y-3">
                {currentEndpoints.map((endpoint, idx) => {
                  const endpointKey = `${endpoint.method} ${endpoint.path}`;
                  const isExpanded = expandedEndpoint === endpointKey;
                  const testResult = testResults[endpointKey];

                  return (
                    <div
                      key={idx}
                      className="rounded-xl bg-gray-900/50 border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors"
                    >
                      {/* Endpoint Header */}
                      <button
                        onClick={() => setExpandedEndpoint(isExpanded ? null : endpointKey)}
                        className="w-full px-5 py-4 flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-4">
                          <MethodBadge method={endpoint.method} />
                          <code className="text-sm font-mono text-gray-300">{endpoint.path}</code>
                          <AvailabilityBadge status={endpoint.availability} />
                        </div>
                        <div className="flex items-center gap-3">
                          {endpoint.authRequired && (
                            <div className="flex items-center gap-1 text-xs text-amber-400">
                              <Lock className="w-3 h-3" />
                              <span>Auth</span>
                            </div>
                          )}
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          )}
                        </div>
                      </button>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="px-5 pb-5 space-y-4 border-t border-gray-800 pt-4">
                          <p className="text-sm text-gray-400">{endpoint.description}</p>

                          {/* Parameters */}
                          {endpoint.parameters && endpoint.parameters.length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Parameters
                              </h4>
                              <div className="space-y-2">
                                {endpoint.parameters.map((param, pIdx) => (
                                  <div key={pIdx} className="flex items-start gap-3 text-xs">
                                    <code className="px-2 py-1 rounded bg-gray-800 text-blue-400 font-mono">
                                      {param.name}
                                    </code>
                                    <span className="text-gray-500">{param.type}</span>
                                    {param.required && (
                                      <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px]">
                                        required
                                      </span>
                                    )}
                                    <span className="text-gray-400 flex-1">{param.description}</span>
                                    {param.example && (
                                      <code className="text-gray-600 font-mono">e.g., {param.example}</code>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Request Body */}
                          {endpoint.requestBody && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Request Body
                              </h4>
                              <JsonViewer data={endpoint.requestBody} />
                            </div>
                          )}

                          {/* Response Example */}
                          {endpoint.responseExample && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Response Example
                              </h4>
                              <JsonViewer data={endpoint.responseExample} />
                            </div>
                          )}

                          {/* Notes */}
                          {endpoint.notes && (
                            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                              <p className="text-xs text-amber-400">{endpoint.notes}</p>
                            </div>
                          )}

                          {/* Test Button */}
                          {endpoint.availability === 'available' && (
                            <div className="pt-3 border-t border-gray-800">
                              <button
                                onClick={() => testEndpoint(endpoint)}
                                disabled={testingEndpoint === endpointKey}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
                              >
                                <Play className="w-4 h-4" />
                                {testingEndpoint === endpointKey ? 'Testing...' : 'Test Endpoint'}
                              </button>

                              {/* Test Results */}
                              {testResult && !testResult.loading && (
                                <div className="mt-3 space-y-2">
                                  <div className="flex items-center gap-2 text-xs">
                                    <span className="text-gray-500">Status:</span>
                                    <span className={cn(
                                      'px-2 py-0.5 rounded font-mono',
                                      testResult.status < 400
                                        ? 'bg-emerald-500/10 text-emerald-400'
                                        : 'bg-red-500/10 text-red-400'
                                    )}>
                                      {testResult.status} {testResult.statusText}
                                    </span>
                                  </div>
                                  {testResult.data && (
                                    <JsonViewer data={testResult.data} />
                                  )}
                                  {testResult.error && (
                                    <p className="text-xs text-red-400">{testResult.error}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
