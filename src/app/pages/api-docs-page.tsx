import { useState, useEffect } from 'react';
import ApiDocumentation from '../components/api-documentation';
import { Code2, ListTodo, ExternalLink, Lock, LogOut } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

// Password from environment variable (not hardcoded in codebase)
const DOCS_PASSWORD = import.meta.env.VITE_API_DOCS_PASSWORD;
const AUTH_STORAGE_KEY = 'api-docs-auth';

interface FieldChange {
  field: string;
  from: string;
  to: string;
  note?: string;
}

interface ApiInfo {
  endpoint: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  repoFile?: string;
  categoryKey?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  apiInfo?: ApiInfo;
  fieldChanges?: FieldChange[];
}

interface Phase {
  phase: string;
  priority: string;
  tasks: Task[];
}

const MIGRATION_TASKS: Phase[] = [
  {
    phase: 'Phase 1: Foundation & Authentication',
    priority: 'HIGH',
    tasks: [
      {
        id: 'AUTH-001',
        title: 'Verify JWT authentication flow',
        description: 'Test login, signup, logout, and Google OAuth endpoints',
        status: 'pending',
        apiInfo: { endpoint: '/api/v1/auth', method: 'POST', repoFile: 'app/controllers/api/v1/auth_controller.rb', categoryKey: 'authentication' },
      },
      {
        id: 'AUTH-002',
        title: 'Implement auth token storage',
        description: 'Store JWT token in localStorage and attach to all API requests',
        status: 'pending',
      },
      {
        id: 'AUTH-003',
        title: 'Create auth context/hook',
        description: 'Build useAuth hook for managing authentication state across the app',
        status: 'pending',
      },
    ],
  },
  {
    phase: 'Phase 2: Projects Integration',
    priority: 'HIGH',
    tasks: [
      {
        id: 'PROJ-001',
        title: 'Map Projects API to Orcaru model',
        description: 'Transform API response fields to match Orcaru frontend expectations',
        status: 'pending',
        apiInfo: { endpoint: '/api/v1/projects', method: 'GET', repoFile: 'app/controllers/api/v1/projects_controller.rb', categoryKey: 'projects' },
        fieldChanges: [
          { field: 'name', from: 'project.profile_name', to: 'project.name' },
          { field: 'client', from: '(not in API)', to: 'project.client', note: 'Add client field to projects table or derive from profile_name' },
          { field: 'campaigns', from: '(not in API)', to: 'project.campaigns (count)', note: 'Requires Campaigns API. Count campaigns per project.' },
          { field: 'contentItems', from: 'project.articles_count', to: 'project.contentItems' },
          { field: 'status', from: '(not in API)', to: 'project.status', note: 'Add status field (active/paused/completed) to projects table' },
          { field: 'lastUpdated', from: 'project.updated_at (ISO)', to: 'project.lastUpdated (relative time, e.g. "2 hours ago")' },
          { field: 'accentColor', from: '(not in API)', to: 'project.accentColor', note: 'Add color field or generate from project name hash' },
        ],
      },
      {
        id: 'PROJ-002',
        title: 'Implement Projects list view',
        description: 'Connect ProjectsDashboard to GET /api/v1/projects',
        status: 'pending',
        apiInfo: { endpoint: '/api/v1/projects', method: 'GET', repoFile: 'app/controllers/api/v1/projects_controller.rb', categoryKey: 'projects' },
      },
      {
        id: 'PROJ-003',
        title: 'Implement Project detail view',
        description: 'Connect ProjectView to GET /api/v1/projects/:id',
        status: 'pending',
        apiInfo: { endpoint: '/api/v1/projects/:id', method: 'GET', repoFile: 'app/controllers/api/v1/projects_controller.rb', categoryKey: 'projects' },
      },
      {
        id: 'PROJ-004',
        title: 'Add project creation',
        description: 'Connect project creation modal to POST /api/v1/projects',
        status: 'pending',
        apiInfo: { endpoint: '/api/v1/projects', method: 'POST', repoFile: 'app/controllers/api/v1/projects_controller.rb', categoryKey: 'projects' },
      },
    ],
  },
  {
    phase: 'Phase 3: Resources Integration',
    priority: 'HIGH',
    tasks: [
      {
        id: 'RES-001',
        title: 'Map Resources API to Orcaru model',
        description: 'Transform resource response fields to match Orcaru frontend expectations',
        status: 'pending',
        apiInfo: { endpoint: '/api/v1/resources', method: 'GET', repoFile: 'app/controllers/api/v1/resources_controller.rb', categoryKey: 'resources' },
        fieldChanges: [
          { field: 'type', from: 'resource.resource_type', to: 'resource.type' },
          { field: 'createdAt', from: 'resource.created_at (ISO)', to: 'resource.createdAt (formatted)' },
          { field: 'tags', from: '(not in API)', to: 'resource.tags (array)', note: 'Add tags support to resources table' },
          { field: 'duration', from: '(not in API)', to: 'resource.duration', note: 'Add for video/audio resources' },
          { field: 'thumbnailUrl', from: '(not in API)', to: 'resource.thumbnailUrl', note: 'Add for video/image resources' },
        ],
      },
      {
        id: 'RES-002',
        title: 'Implement Resources list view',
        description: 'Connect EnhancedResourcesView to GET /api/v1/resources',
        status: 'pending',
        apiInfo: { endpoint: '/api/v1/resources', method: 'GET', repoFile: 'app/controllers/api/v1/resources_controller.rb', categoryKey: 'resources' },
      },
      {
        id: 'RES-003',
        title: 'Implement resource upload',
        description: 'Connect resource upload to POST /api/v1/resources with FormData',
        status: 'pending',
        apiInfo: { endpoint: '/api/v1/resources', method: 'POST', repoFile: 'app/controllers/api/v1/resources_controller.rb', categoryKey: 'resources' },
      },
    ],
  },
  {
    phase: 'Phase 4: Writer Profiles (Avatars)',
    priority: 'MEDIUM',
    tasks: [
      {
        id: 'AV-001',
        title: 'Map Avatars API to Orcaru model',
        description: 'Transform avatar response fields to match Orcaru frontend expectations',
        status: 'pending',
        apiInfo: { endpoint: '/api/v1/avatars', method: 'GET', repoFile: 'app/controllers/api/v1/avatars_controller.rb', categoryKey: 'avatars' },
        fieldChanges: [
          { field: 'isDefault', from: '(not in API)', to: 'profile.isDefault (boolean)', note: 'Add is_default boolean to avatars table' },
          { field: 'createdDate', from: 'profile.created_at (ISO)', to: 'profile.createdDate (formatted, e.g. "Jun 1, 2026")' },
          { field: 'usedByContentCount', from: '(not in API)', to: 'profile.usedByContentCount (number)', note: 'Compute from content_items table. Count items using this avatar.' },
        ],
      },
      {
        id: 'AV-002',
        title: 'Implement Writer Profiles view',
        description: 'Connect WriterProfilesView to GET /api/v1/avatars',
        status: 'pending',
        apiInfo: { endpoint: '/api/v1/avatars', method: 'GET', repoFile: 'app/controllers/api/v1/avatars_controller.rb', categoryKey: 'avatars' },
      },
    ],
  },
  {
    phase: 'Phase 5: Social Automation',
    priority: 'MEDIUM',
    tasks: [
      {
        id: 'SA-001',
        title: 'Map SA Accounts API',
        description: 'Add missing analytics fields to social accounts response',
        status: 'pending',
        apiInfo: { endpoint: '/api/v1/sa_accounts', method: 'GET', repoFile: 'app/controllers/api/v1/sa_accounts_controller.rb', categoryKey: 'social_automation' },
        fieldChanges: [
          { field: 'followers', from: '(not in API)', to: 'account.followers (string, e.g. "12.5K")', note: 'Add follower count from platform API sync' },
          { field: 'engagement_rate', from: '(not in API)', to: 'account.engagement_rate (string, e.g. "3.2%")', note: 'Add engagement rate from platform API sync' },
          { field: 'lastPosted', from: '(not in API)', to: 'account.lastPosted (ISO datetime)', note: 'Add last post timestamp from platform API sync' },
        ],
      },
      {
        id: 'SA-002',
        title: 'Implement social accounts view',
        description: 'Connect to GET /api/v1/sa_accounts',
        status: 'pending',
        apiInfo: { endpoint: '/api/v1/sa_accounts', method: 'GET', repoFile: 'app/controllers/api/v1/sa_accounts_controller.rb', categoryKey: 'social_automation' },
      },
      {
        id: 'SA-003',
        title: 'Implement post scheduling',
        description: 'Connect calendar to /api/v1/sa_links for scheduling',
        status: 'pending',
        apiInfo: { endpoint: '/api/v1/sa_links', method: 'GET', repoFile: 'app/controllers/api/v1/sa_links_controller.rb', categoryKey: 'social_automation' },
        fieldChanges: [
          { field: 'type', from: '(not in API)', to: 'link.type (e.g. "social-posts")', note: 'Add content type classification' },
          { field: 'funnelStage', from: '(not in API)', to: 'link.funnelStage (e.g. "top")', note: 'Add funnel stage classification' },
          { field: 'campaign_id', from: '(not in API)', to: 'link.campaign_id (FK)', note: 'Link to Campaigns API when implemented' },
        ],
      },
    ],
  },
  {
    phase: 'Phase 6: Campaigns (New Feature)',
    priority: 'MEDIUM',
    tasks: [
      {
        id: 'CAMP-001',
        title: 'Design campaigns database schema',
        description: 'Create campaigns table with required fields',
        status: 'pending',
        fieldChanges: [
          { field: 'name', from: '(new table)', to: 'campaigns.name (string)' },
          { field: 'description', from: '(new table)', to: 'campaigns.description (text)' },
          { field: 'startDate', from: '(new table)', to: 'campaigns.start_date (date)' },
          { field: 'endDate', from: '(new table)', to: 'campaigns.end_date (date)' },
          { field: 'color', from: '(new table)', to: 'campaigns.color (string, hex)' },
          { field: 'funnelDistribution', from: '(new table)', to: 'campaigns.funnel_distribution (JSON: {awareness, consideration, decision, retention})' },
        ],
      },
      {
        id: 'CAMP-002',
        title: 'Implement campaigns API endpoints',
        description: 'Build CRUD endpoints for /api/v1/campaigns',
        status: 'pending',
        apiInfo: { endpoint: '/api/v1/campaigns', method: 'GET', categoryKey: 'campaigns' },
      },
      {
        id: 'CAMP-003',
        title: 'Implement Campaigns view',
        description: 'Connect CampaignsView to campaigns API',
        status: 'pending',
        apiInfo: { endpoint: '/api/v1/campaigns', method: 'GET', categoryKey: 'campaigns' },
      },
    ],
  },
  {
    phase: 'Phase 7: Content Items (New Feature)',
    priority: 'MEDIUM',
    tasks: [
      {
        id: 'CI-001',
        title: 'Design content_items database schema',
        description: 'Create content_items table with required fields and foreign keys',
        status: 'pending',
        fieldChanges: [
          { field: 'topic', from: '(new table)', to: 'content_items.topic (string)' },
          { field: 'type', from: '(new table)', to: 'content_items.content_type (enum: Blog Post, Social Post, Short Video, Carousel, Email)' },
          { field: 'status', from: '(new table)', to: 'content_items.status (enum: draft, generating, ready-for-review, approved, published, rejected)' },
          { field: 'scheduledDate', from: '(new table)', to: 'content_items.scheduled_at (datetime)' },
          { field: 'funnelStage', from: '(new table)', to: 'content_items.funnel_stage (enum: Awareness, Consideration, Decision, Retention)' },
          { field: 'campaign_id', from: '(new table)', to: 'content_items.campaign_id (FK to campaigns)' },
          { field: 'project_id', from: '(new table)', to: 'content_items.project_id (FK to projects)' },
          { field: 'creator', from: '(new table)', to: 'content_items.avatar_id (FK to avatars, join for name)' },
        ],
      },
      {
        id: 'CI-002',
        title: 'Implement content items API endpoints',
        description: 'Build CRUD endpoints for /api/v1/content_items',
        status: 'pending',
        apiInfo: { endpoint: '/api/v1/content_items', method: 'GET', categoryKey: 'content_items' },
      },
      {
        id: 'CI-003',
        title: 'Implement content creation flow',
        description: 'Connect SmartContentCreationModal to content items API',
        status: 'pending',
        apiInfo: { endpoint: '/api/v1/content_items', method: 'POST', categoryKey: 'content_items' },
      },
    ],
  },
  {
    phase: 'Phase 8: Brand Kits (New Feature)',
    priority: 'LOW',
    tasks: [
      {
        id: 'BK-001',
        title: 'Design brand_kits database schema',
        description: 'Create brand_kits table with JSON columns for flexible data',
        status: 'pending',
        fieldChanges: [
          { field: 'name', from: '(new table)', to: 'brand_kits.name (string)' },
          { field: 'description', from: '(new table)', to: 'brand_kits.description (text)' },
          { field: 'colors', from: '(new table)', to: 'brand_kits.colors (JSON: {primary, secondary, accent, background, text})' },
          { field: 'fonts', from: '(new table)', to: 'brand_kits.fonts (JSON: {heading, body, accent})' },
          { field: 'assets', from: '(new table)', to: 'brand_kit_assets (join table: id, name, type, url)' },
        ],
      },
      {
        id: 'BK-002',
        title: 'Implement brand kits API endpoints',
        description: 'Build CRUD endpoints for /api/v1/brand_kits',
        status: 'pending',
        apiInfo: { endpoint: '/api/v1/brand_kits', method: 'GET', categoryKey: 'brand_kits' },
      },
      {
        id: 'BK-003',
        title: 'Implement Brand Guidelines view',
        description: 'Connect BrandGuidelinesManager to brand kits API',
        status: 'pending',
        apiInfo: { endpoint: '/api/v1/brand_kits', method: 'GET', categoryKey: 'brand_kits' },
      },
    ],
  },
  {
    phase: 'Phase 9: Audits (New Feature)',
    priority: 'LOW',
    tasks: [
      {
        id: 'AUD-001',
        title: 'Design audits database schema',
        description: 'Create audits, audit_platforms, audit_topics tables',
        status: 'pending',
        fieldChanges: [
          { field: 'platforms', from: '(new table)', to: 'audit_platforms (join: platform, handle, postsCount, enabled, status)' },
          { field: 'totalPosts', from: '(new table)', to: 'audits.total_posts (integer)' },
          { field: 'avgEngagement', from: '(new table)', to: 'audits.avg_engagement (string, e.g. "2.4K")' },
          { field: 'funnelBreakdown', from: '(new table)', to: 'audits.funnel_breakdown (JSON: {top, middle, bottom})' },
          { field: 'contentTypeDistribution', from: '(new table)', to: 'audits.content_type_distribution (JSON: {short-clips, carousels, ...})' },
          { field: 'topicCloud', from: '(new table)', to: 'audit_topics (join: name, size)' },
          { field: 'criticalGaps', from: '(new table)', to: 'audits.critical_gaps (JSON array)' },
          { field: 'recommendedActions', from: '(new table)', to: 'audits.recommended_actions (JSON array)' },
        ],
      },
      {
        id: 'AUD-002',
        title: 'Implement audits API endpoints',
        description: 'Build CRUD endpoints for /api/v1/audits with platform data aggregation',
        status: 'pending',
        apiInfo: { endpoint: '/api/v1/audits', method: 'GET', categoryKey: 'audits' },
      },
      {
        id: 'AUD-003',
        title: 'Implement Audits view',
        description: 'Connect AuditsView, AuditWizard, AuditResults to audits API',
        status: 'pending',
        apiInfo: { endpoint: '/api/v1/audits', method: 'GET', categoryKey: 'audits' },
      },
    ],
  },
  {
    phase: 'Phase 10: Calendar (New Feature)',
    priority: 'LOW',
    tasks: [
      {
        id: 'CAL-001',
        title: 'Design calendar_events database schema',
        description: 'Create calendar_events table with scheduling fields',
        status: 'pending',
        fieldChanges: [
          { field: 'title', from: '(new table)', to: 'calendar_events.title (string)' },
          { field: 'start', from: '(new table)', to: 'calendar_events.start_at (datetime)' },
          { field: 'end', from: '(new table)', to: 'calendar_events.end_at (datetime)' },
          { field: 'type', from: '(new table)', to: 'calendar_events.content_type (string)' },
          { field: 'status', from: '(new table)', to: 'calendar_events.status (string)' },
          { field: 'projectId', from: '(new table)', to: 'calendar_events.project_id (FK to projects)' },
          { field: 'campaignId', from: '(new table)', to: 'calendar_events.campaign_id (FK to campaigns)' },
          { field: 'accountIds', from: '(new table)', to: 'calendar_event_accounts (join table)' },
        ],
      },
      {
        id: 'CAL-002',
        title: 'Implement calendar API endpoints',
        description: 'Build CRUD endpoints for /api/v1/calendar',
        status: 'pending',
        apiInfo: { endpoint: '/api/v1/calendar', method: 'GET', categoryKey: 'calendar' },
      },
      {
        id: 'CAL-003',
        title: 'Implement Calendar view',
        description: 'Connect CalendarView to calendar API',
        status: 'pending',
        apiInfo: { endpoint: '/api/v1/calendar', method: 'GET', categoryKey: 'calendar' },
      },
    ],
  },
];

function FieldTransformations({ changes }: { changes: FieldChange[] }) {
  // Build current and recommended objects from field changes
  const currentObj: Record<string, any> = {};
  const recommendedObj: Record<string, any> = {};

  changes.forEach((change) => {
    const isMissing = change.from === '(not in API)' || change.from === '(new table)';
    
    if (!isMissing) {
      // Extract the field path and value from the "from" string
      const match = change.from.match(/^[\w.]+\.(\w+)(?:\s+\((.+)\))?$/);
      if (match) {
        const [, field, note] = match;
        currentObj[field] = note || '...';
      } else {
        currentObj[change.from] = '...';
      }
    }

    // Parse the "to" string to build recommended structure
    const toMatch = change.to.match(/^[\w.]+\.(\w+)(?:\s+\((.+)\))?$/);
    if (toMatch) {
      const [, field, type] = toMatch;
      recommendedObj[field] = type || '...';
    } else {
      recommendedObj[change.to] = '...';
    }
  });

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div className="bg-background/50 border border-border rounded-lg p-4">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Current API Response</h5>
        <pre className="text-xs font-mono text-foreground overflow-x-auto">
          <code>{JSON.stringify(currentObj, null, 2)}</code>
        </pre>
      </div>
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <h5 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Recommended Format</h5>
        <pre className="text-xs font-mono text-foreground overflow-x-auto">
          <code>{JSON.stringify(recommendedObj, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!DOCS_PASSWORD) {
      setError('Access configuration missing. Please contact support.');
      return;
    }
    
    if (password === DOCS_PASSWORD) {
      localStorage.setItem(AUTH_STORAGE_KEY, 'authenticated');
      onLogin();
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-card border border-border rounded-xl shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Restricted Access</h1>
          <p className="text-sm text-muted-foreground text-center">
            This section contains sensitive Pangea API documentation. Please enter the access password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Access Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Enter password"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Authenticate
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-border">
          <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
            ← Back to Platform
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ApiDocsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'api' | 'tasks'>('api');

  useEffect(() => {
    const auth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (auth === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  const totalTasks = MIGRATION_TASKS.reduce((sum, phase) => sum + phase.tasks.length, 0);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="sticky top-0 h-screen w-64 border-r border-border bg-background flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Code2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Orcaru API</h1>
              <p className="text-xs text-muted-foreground">Documentation & Migration</p>
            </div>
          </div>
          <a href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Platform
          </a>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('api')}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
              activeTab === 'api' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            <Code2 className="w-4 h-4" />
            API Documentation
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
              activeTab === 'tasks' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            <ListTodo className="w-4 h-4" />
            Migration Tasks
            <span className="ml-auto px-2 py-0.5 rounded-full text-xs bg-background/20">{totalTasks}</span>
          </button>
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {activeTab === 'api' ? (
            <ApiDocumentation />
          ) : (
            <div className="space-y-6">
              {MIGRATION_TASKS.map((phase) => {
                const priorityColor =
                  phase.priority === 'HIGH'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : phase.priority === 'MEDIUM'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20';

                return (
                  <div key={phase.phase} className="rounded-xl bg-card border border-border overflow-hidden">
                    <div className="p-6 border-b border-border">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-foreground">{phase.phase}</h3>
                        <span className={cn('px-3 py-1 rounded-full text-xs font-medium border', priorityColor)}>
                          {phase.priority}
                        </span>
                      </div>
                    </div>

                    <div className="divide-y divide-border/50">
                      {phase.tasks.map((task) => (
                        <div key={task.id} className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{task.id}</code>
                                <h4 className="text-sm font-semibold text-foreground">{task.title}</h4>
                              </div>
                              <p className="text-sm text-muted-foreground">{task.description}</p>
                              
                              {task.apiInfo && (
                                <div className="flex items-center gap-3 mt-2 text-xs flex-wrap">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-muted-foreground">API:</span>
                                    <button
                                      onClick={() => {
                                        setActiveTab('api');
                                        setTimeout(() => {
                                          const element = document.getElementById(`category-${task.apiInfo?.categoryKey}`);
                                          if (element) {
                                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                          }
                                        }, 100);
                                      }}
                                      className="font-mono text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                                    >
                                      <span className="px-1.5 py-0.5 bg-primary/10 rounded">{task.apiInfo.method}</span>
                                      <span>{task.apiInfo.endpoint}</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </button>
                                  </div>
                                  {task.apiInfo.repoFile && (
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono text-muted-foreground">File:</span>
                                      <code className="font-mono text-muted-foreground bg-background px-2 py-0.5 rounded">
                                        {task.apiInfo.repoFile}
                                      </code>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            <span className="px-2 py-1 rounded text-xs bg-background border border-border ml-4 shrink-0">{task.status}</span>
                          </div>

                          {task.fieldChanges && task.fieldChanges.length > 0 && (
                            <FieldTransformations changes={task.fieldChanges} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
