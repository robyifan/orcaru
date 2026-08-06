import { useState, useEffect } from 'react';
import {
  Lock, Unlock, CheckCircle2, XCircle, AlertCircle,
  Play, ChevronRight, ChevronDown, Copy, Check,
  User, LogOut, FileJson, Server, Zap, Code2,
  ArrowRight, ArrowLeftRight, Eye, EyeOff
} from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Endpoint {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  path: string;
  description: string;
  availability: 'available' | 'missing' | 'partial';
  authRequired: boolean;
  parameters?: Parameter[];
  requestBody?: any;
  currentResponse?: any;
  requiredResponse?: any;
  fieldMapping?: FieldMapping[];
  notes?: string;
}

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
}

interface FieldMapping {
  field: string;
  currentSource: string | null;
  requiredSource: string;
  status: 'match' | 'rename' | 'compute' | 'missing';
  note?: string;
}

interface CategoryStatus {
  label: string;
  status: 'full' | 'partial' | 'missing';
  available: number;
  total: number;
  description: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
  loading: boolean;
  error: string | null;
}

// ─── API Configuration ────────────────────────────────────────────────────────

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://staging.orcaru.com';

// ─── Category Status Definitions ──────────────────────────────────────────────

const CATEGORY_STATUS: Record<string, CategoryStatus> = {
  authentication: {
    label: 'Authentication',
    status: 'full',
    available: 4,
    total: 4,
    description: 'Fully available. Login, signup, logout, and Google OAuth all work.'
  },
  projects: {
    label: 'Projects',
    status: 'partial',
    available: 5,
    total: 5,
    description: 'Endpoints exist but response fields need mapping. Missing: client, campaigns count, contentItems count, accentColor.'
  },
  resources: {
    label: 'Resources',
    status: 'partial',
    available: 3,
    total: 3,
    description: 'Endpoints exist. Response is usable but may need additional fields for Orcaru content type system.'
  },
  avatars: {
    label: 'Writer Profiles / Avatars',
    status: 'partial',
    available: 2,
    total: 2,
    description: 'Endpoints exist. Core fields match but missing: isDefault, createdDate (formatted), usedByContentCount.'
  },
  social_automation: {
    label: 'Social Automation',
    status: 'partial',
    available: 4,
    total: 4,
    description: 'Account management and posting work. Missing: analytics data, post queue integration with Orcaru calendar.'
  },
  campaigns: {
    label: 'Campaigns',
    status: 'missing',
    available: 0,
    total: 1,
    description: 'Not implemented in Rails API. Orcaru needs: name, description, date range, color, content items, funnel distribution.'
  },
  content_items: {
    label: 'Content Items',
    status: 'missing',
    available: 0,
    total: 1,
    description: 'Not implemented. Orcaru needs: topic, type (Blog/Social/Video/Carousel/Email), status, scheduled date, funnel stage.'
  },
  brand_kits: {
    label: 'Brand Kits',
    status: 'missing',
    available: 0,
    total: 1,
    description: 'Not implemented. Orcaru needs: name, description, colors palette, fonts, assets library, timestamps.'
  },
  audits: {
    label: 'Audits',
    status: 'missing',
    available: 0,
    total: 1,
    description: 'Not implemented. Orcaru needs: platform analysis, post metrics, engagement data, funnel breakdown, topic cloud, recommendations.'
  },
  calendar: {
    label: 'Calendar / Scheduling',
    status: 'missing',
    available: 0,
    total: 1,
    description: 'Not implemented. Orcaru needs: events with start/end times, type, status, project/campaign associations.'
  }
};

// ─── Endpoint Data with Current vs Required Responses ─────────────────────────

const API_ENDPOINTS: Record<string, Endpoint[]> = {
  authentication: [
    {
      method: 'POST',
      path: '/api/v1/auth',
      description: 'Authenticate user with email and password',
      availability: 'available',
      authRequired: false,
      requestBody: { email: 'user@example.com', password: 'password123' },
      currentResponse: {
        token: 'eXs7VbneDyC1pTY3GT3hUvQm',
        token_type: 'Bearer',
        user: { id: 45, email: 'hello@pengyilabs.com', name: 'Rob Moya' }
      },
      requiredResponse: {
        token: 'eXs7VbneDyC1pTY3GT3hUvQm',
        token_type: 'Bearer',
        user: { id: 45, email: 'hello@pengyilabs.com', name: 'Rob Moya' }
      },
      fieldMapping: [
        { field: 'token', currentSource: 'response.token', requiredSource: 'response.token', status: 'match' },
        { field: 'user.id', currentSource: 'response.user.id', requiredSource: 'response.user.id', status: 'match' },
        { field: 'user.email', currentSource: 'response.user.email', requiredSource: 'response.user.email', status: 'match' },
        { field: 'user.name', currentSource: 'response.user.name', requiredSource: 'response.user.name', status: 'match' }
      ],
      notes: 'Fully compatible. No changes needed.'
    },
    {
      method: 'POST',
      path: '/api/v1/auth/signup',
      description: 'Create a new user account',
      availability: 'available',
      authRequired: false,
      requestBody: { email: 'new@example.com', password: 'password123', name: 'New User' },
      currentResponse: { token: '...', token_type: 'Bearer', user: { id: 46, email: 'new@example.com', name: 'New User' } },
      requiredResponse: { token: '...', token_type: 'Bearer', user: { id: 46, email: 'new@example.com', name: 'New User' } },
      fieldMapping: [
        { field: 'token', currentSource: 'response.token', requiredSource: 'response.token', status: 'match' },
        { field: 'user', currentSource: 'response.user', requiredSource: 'response.user', status: 'match' }
      ],
      notes: 'Fully compatible. No changes needed.'
    },
    {
      method: 'POST',
      path: '/api/v1/auth/logout',
      description: 'Invalidate the current session token',
      availability: 'available',
      authRequired: true,
      currentResponse: { message: 'Logged out successfully' },
      requiredResponse: { message: 'Logged out successfully' },
      fieldMapping: [
        { field: 'message', currentSource: 'response.message', requiredSource: 'response.message', status: 'match' }
      ],
      notes: 'Fully compatible. No changes needed.'
    },
    {
      method: 'POST',
      path: '/api/v1/auth/google',
      description: 'Authenticate via Google OAuth',
      availability: 'available',
      authRequired: false,
      requestBody: { credential: 'google_id_token_here' },
      currentResponse: { token: '...', token_type: 'Bearer', user: { id: 45, email: 'hello@pengyilabs.com', name: 'Rob Moya' } },
      requiredResponse: { token: '...', token_type: 'Bearer', user: { id: 45, email: 'hello@pengyilabs.com', name: 'Rob Moya' } },
      fieldMapping: [
        { field: 'token', currentSource: 'response.token', requiredSource: 'response.token', status: 'match' },
        { field: 'user', currentSource: 'response.user', requiredSource: 'response.user', status: 'match' }
      ],
      notes: 'Fully compatible. No changes needed.'
    }
  ],

  projects: [
    {
      method: 'GET',
      path: '/api/v1/projects',
      description: 'List all projects with pagination and search',
      availability: 'available',
      authRequired: true,
      parameters: [
        { name: 'search', type: 'string', required: false, description: 'Search by name', example: 'yoga' },
        { name: 'status', type: 'string', required: false, description: 'Filter by status', example: 'active' },
        { name: 'page', type: 'integer', required: false, description: 'Page number', example: '1' },
        { name: 'per_page', type: 'integer', required: false, description: 'Items per page', example: '20' }
      ],
      currentResponse: {
        projects: [
          {
            id: 136,
            profile_name: 'Amrit Yoga',
            project_context: 'yoga institute with over 40 years of teachings',
            project_url: 'amrityoga.org',
            target_audience: 'yoga teachers, new students',
            writing_tone: 'concise and objective',
            writing_level: 'high school audience',
            articles_count: 24,
            created_at: '2026-01-15T10:30:00Z'
          }
        ],
        meta: { total_count: 3, page: 1, per_page: 20 }
      },
      requiredResponse: {
        projects: [
          {
            id: 1,
            name: 'Amrit Yoga Content',
            client: 'Amrit Yoga',
            campaigns: 1,
            contentItems: 24,
            status: 'active',
            lastUpdated: '2 hours ago',
            accentColor: '#D946EF'
          }
        ],
        meta: { total_count: 3, page: 1, per_page: 20 }
      },
      fieldMapping: [
        { field: 'id', currentSource: 'project.id', requiredSource: 'project.id', status: 'match' },
        { field: 'name', currentSource: 'project.profile_name', requiredSource: 'project.name', status: 'rename', note: 'profile_name → name' },
        { field: 'client', currentSource: null, requiredSource: 'project.client', status: 'missing', note: 'Not in API. Derive from profile_name or add to DB.' },
        { field: 'campaigns', currentSource: null, requiredSource: 'project.campaigns', status: 'missing', note: 'Requires Campaigns API endpoint. Count campaigns per project.' },
        { field: 'contentItems', currentSource: 'project.articles_count', requiredSource: 'project.contentItems', status: 'rename', note: 'articles_count → contentItems' },
        { field: 'status', currentSource: null, requiredSource: 'project.status', status: 'missing', note: 'Not in API. Add status field to projects table.' },
        { field: 'lastUpdated', currentSource: 'project.updated_at', requiredSource: 'project.lastUpdated', status: 'rename', note: 'updated_at → lastUpdated (format as relative time)' },
        { field: 'accentColor', currentSource: null, requiredSource: 'project.accentColor', status: 'missing', note: 'Not in API. Add color field or generate from project name.' }
      ],
      notes: 'Core data exists but needs field renaming and 4 missing fields. Most critical: campaigns count requires Campaigns API.'
    },
    {
      method: 'GET',
      path: '/api/v1/projects/:id',
      description: 'Get a single project by ID',
      availability: 'available',
      authRequired: true,
      currentResponse: {
        project: {
          id: 136,
          profile_name: 'Amrit Yoga',
          project_context: 'yoga institute with over 40 years of teachings',
          project_url: 'amrityoga.org',
          target_audience: 'yoga teachers, new students',
          writing_tone: 'concise and objective',
          writing_level: 'high school audience',
          articles_count: 24,
          created_at: '2026-01-15T10:30:00Z',
          updated_at: '2026-08-06T08:00:00Z'
        }
      },
      requiredResponse: {
        project: {
          id: 1,
          name: 'Amrit Yoga Content',
          client: 'Amrit Yoga',
          description: 'yoga institute with over 40 years of teachings',
          campaignCount: 1,
          contentCount: 24,
          status: 'active',
          lastUpdated: '2 hours ago'
        }
      },
      fieldMapping: [
        { field: 'id', currentSource: 'project.id', requiredSource: 'project.id', status: 'match' },
        { field: 'name', currentSource: 'project.profile_name', requiredSource: 'project.name', status: 'rename' },
        { field: 'client', currentSource: null, requiredSource: 'project.client', status: 'missing' },
        { field: 'description', currentSource: 'project.project_context', requiredSource: 'project.description', status: 'rename', note: 'project_context → description' },
        { field: 'campaignCount', currentSource: null, requiredSource: 'project.campaignCount', status: 'missing' },
        { field: 'contentCount', currentSource: 'project.articles_count', requiredSource: 'project.contentCount', status: 'rename' },
        { field: 'status', currentSource: null, requiredSource: 'project.status', status: 'missing' },
        { field: 'lastUpdated', currentSource: 'project.updated_at', requiredSource: 'project.lastUpdated', status: 'rename' }
      ],
      notes: 'Same field mapping issues as list endpoint. project_context maps well to description.'
    },
    {
      method: 'POST',
      path: '/api/v1/projects',
      description: 'Create a new project',
      availability: 'available',
      authRequired: true,
      requestBody: {
        name: 'New Project',
        domain: 'example.com',
        context: 'Project description',
        target_audience: 'Target audience description'
      },
      currentResponse: {
        project: {
          id: 137,
          profile_name: 'New Project',
          project_context: 'Project description',
          project_url: 'example.com',
          target_audience: 'Target audience description',
          articles_count: 0,
          created_at: '2026-08-06T12:00:00Z'
        }
      },
      requiredResponse: {
        project: {
          id: 8,
          name: 'New Project',
          client: 'New Project',
          campaigns: 0,
          contentItems: 0,
          status: 'active',
          lastUpdated: 'just now',
          accentColor: '#3B82F6'
        }
      },
      fieldMapping: [
        { field: 'name', currentSource: 'request.name → project.profile_name', requiredSource: 'project.name', status: 'rename' },
        { field: 'client', currentSource: null, requiredSource: 'project.client', status: 'missing' },
        { field: 'campaigns', currentSource: null, requiredSource: 'project.campaigns', status: 'missing' },
        { field: 'contentItems', currentSource: 'project.articles_count', requiredSource: 'project.contentItems', status: 'rename' },
        { field: 'status', currentSource: null, requiredSource: 'project.status', status: 'missing' },
        { field: 'accentColor', currentSource: null, requiredSource: 'project.accentColor', status: 'missing' }
      ],
      notes: 'Create works but response needs transformation. Consider adding client, status, color fields to projects table.'
    },
    {
      method: 'PATCH',
      path: '/api/v1/projects/:id',
      description: 'Update an existing project',
      availability: 'available',
      authRequired: true,
      requestBody: {
        name: 'Updated Project Name',
        context: 'Updated context'
      },
      currentResponse: {
        project: {
          id: 136,
          profile_name: 'Updated Project Name',
          project_context: 'Updated context',
          articles_count: 24,
          updated_at: '2026-08-06T12:00:00Z'
        }
      },
      requiredResponse: {
        project: {
          id: 1,
          name: 'Updated Project Name',
          client: 'Amrit Yoga',
          campaigns: 1,
          contentItems: 24,
          status: 'active',
          lastUpdated: 'just now',
          accentColor: '#D946EF'
        }
      },
      fieldMapping: [
        { field: 'name', currentSource: 'project.profile_name', requiredSource: 'project.name', status: 'rename' },
        { field: 'client', currentSource: null, requiredSource: 'project.client', status: 'missing' },
        { field: 'campaigns', currentSource: null, requiredSource: 'project.campaigns', status: 'missing' },
        { field: 'contentItems', currentSource: 'project.articles_count', requiredSource: 'project.contentItems', status: 'rename' },
        { field: 'status', currentSource: null, requiredSource: 'project.status', status: 'missing' },
        { field: 'accentColor', currentSource: null, requiredSource: 'project.accentColor', status: 'missing' }
      ],
      notes: 'Update works. Same transformation needed as GET.'
    },
    {
      method: 'DELETE',
      path: '/api/v1/projects/:id',
      description: 'Delete a project',
      availability: 'available',
      authRequired: true,
      currentResponse: { message: 'Project deleted successfully' },
      requiredResponse: { message: 'Project deleted successfully' },
      fieldMapping: [
        { field: 'message', currentSource: 'response.message', requiredSource: 'response.message', status: 'match' }
      ],
      notes: 'Fully compatible. No changes needed.'
    }
  ],

  resources: [
    {
      method: 'GET',
      path: '/api/v1/resources',
      description: 'List all resources with pagination, search, and filters',
      availability: 'available',
      authRequired: true,
      parameters: [
        { name: 'status', type: 'string', required: false, description: 'Filter by status', example: 'active' },
        { name: 'search', type: 'string', required: false, description: 'Search by title or content', example: 'marketing' },
        { name: 'sort', type: 'string', required: false, description: 'Sort field', example: 'created_at' },
        { name: 'direction', type: 'string', required: false, description: 'Sort direction', example: 'desc' },
        { name: 'page', type: 'integer', required: false, description: 'Page number', example: '1' },
        { name: 'per_page', type: 'integer', required: false, description: 'Items per page', example: '12' }
      ],
      currentResponse: {
        resources: [],
        meta: {
          current_page: 1,
          total_pages: 0,
          total_count: 0,
          per_page: 20,
          status_counts: { active: 0, archived: 0, all: 0 }
        }
      },
      requiredResponse: {
        resources: [
          {
            id: 1,
            title: 'Marketing Strategy Video',
            type: 'video',
            url: 'https://example.com/video.mp4',
            status: 'active',
            createdAt: '2026-07-01T10:00:00Z',
            tags: ['marketing', 'strategy'],
            duration: '12:34',
            thumbnailUrl: 'https://example.com/thumb.jpg'
          }
        ],
        meta: { total_count: 1, page: 1, per_page: 12 }
      },
      fieldMapping: [
        { field: 'id', currentSource: 'resource.id', requiredSource: 'resource.id', status: 'match' },
        { field: 'title', currentSource: 'resource.title', requiredSource: 'resource.title', status: 'match' },
        { field: 'type', currentSource: 'resource.resource_type', requiredSource: 'resource.type', status: 'rename', note: 'resource_type → type' },
        { field: 'url', currentSource: 'resource.url', requiredSource: 'resource.url', status: 'match' },
        { field: 'status', currentSource: 'resource.status', requiredSource: 'resource.status', status: 'match' },
        { field: 'createdAt', currentSource: 'resource.created_at', requiredSource: 'resource.createdAt', status: 'rename' },
        { field: 'tags', currentSource: null, requiredSource: 'resource.tags', status: 'missing', note: 'Not in API. Add tags support to resources table.' },
        { field: 'duration', currentSource: null, requiredSource: 'resource.duration', status: 'missing', note: 'Not in API. Add for video resources.' },
        { field: 'thumbnailUrl', currentSource: null, requiredSource: 'resource.thumbnailUrl', status: 'missing', note: 'Not in API. Add for video/image resources.' }
      ],
      notes: 'Core structure is compatible. Missing: tags, duration, thumbnailUrl. These are nice-to-have for the UI.'
    },
    {
      method: 'GET',
      path: '/api/v1/resources/:id',
      description: 'Get a single resource by ID',
      availability: 'available',
      authRequired: true,
      currentResponse: {
        resource: {
          id: 1,
          title: 'Marketing Video',
          resource_type: 'video',
          url: 'https://example.com/video.mp4',
          status: 'active',
          created_at: '2026-07-01T10:00:00Z',
          updated_at: '2026-07-01T10:00:00Z'
        }
      },
      requiredResponse: {
        resource: {
          id: 1,
          title: 'Marketing Strategy Video',
          type: 'video',
          url: 'https://example.com/video.mp4',
          status: 'active',
          createdAt: '2026-07-01T10:00:00Z',
          tags: ['marketing', 'strategy'],
          duration: '12:34',
          thumbnailUrl: 'https://example.com/thumb.jpg'
        }
      },
      fieldMapping: [
        { field: 'id', currentSource: 'resource.id', requiredSource: 'resource.id', status: 'match' },
        { field: 'title', currentSource: 'resource.title', requiredSource: 'resource.title', status: 'match' },
        { field: 'type', currentSource: 'resource.resource_type', requiredSource: 'resource.type', status: 'rename' },
        { field: 'url', currentSource: 'resource.url', requiredSource: 'resource.url', status: 'match' },
        { field: 'status', currentSource: 'resource.status', requiredSource: 'resource.status', status: 'match' },
        { field: 'createdAt', currentSource: 'resource.created_at', requiredSource: 'resource.createdAt', status: 'rename' },
        { field: 'tags', currentSource: null, requiredSource: 'resource.tags', status: 'missing' },
        { field: 'duration', currentSource: null, requiredSource: 'resource.duration', status: 'missing' },
        { field: 'thumbnailUrl', currentSource: null, requiredSource: 'resource.thumbnailUrl', status: 'missing' }
      ],
      notes: 'Same field mapping as list endpoint.'
    },
    {
      method: 'POST',
      path: '/api/v1/resources/:id/extract_clips',
      description: 'Extract clips from a video resource',
      availability: 'available',
      authRequired: true,
      requestBody: {
        clip_count: 5,
        clip_duration: 60
      },
      currentResponse: {
        clips: [
          { id: 1, title: 'Clip 1', start_time: 0, end_time: 60, status: 'processing' }
        ]
      },
      requiredResponse: {
        clips: [
          { id: 1, title: 'Clip 1', start_time: 0, end_time: 60, status: 'processing', type: 'short-clips', funnelStage: 'top' }
        ]
      },
      fieldMapping: [
        { field: 'clips[].id', currentSource: 'clip.id', requiredSource: 'clip.id', status: 'match' },
        { field: 'clips[].title', currentSource: 'clip.title', requiredSource: 'clip.title', status: 'match' },
        { field: 'clips[].start_time', currentSource: 'clip.start_time', requiredSource: 'clip.start_time', status: 'match' },
        { field: 'clips[].end_time', currentSource: 'clip.end_time', requiredSource: 'clip.end_time', status: 'match' },
        { field: 'clips[].status', currentSource: 'clip.status', requiredSource: 'clip.status', status: 'match' },
        { field: 'clips[].type', currentSource: null, requiredSource: 'clip.type', status: 'missing', note: 'Add content type classification (short-clips, carousels, etc.)' },
        { field: 'clips[].funnelStage', currentSource: null, requiredSource: 'clip.funnelStage', status: 'missing', note: 'Add funnel stage classification (top, middle, bottom)' }
      ],
      notes: 'Clip extraction works. Missing type and funnelStage classification for Orcaru content system.'
    }
  ],

  avatars: [
    {
      method: 'GET',
      path: '/api/v1/avatars',
      description: 'List all writer profiles / avatars',
      availability: 'available',
      authRequired: true,
      currentResponse: {
        profiles: [
          {
            id: 1,
            name: 'Professional Avatar',
            tone: 'formal',
            level: 'expert',
            description: 'Business avatar for professional content',
            status: 'active',
            created_at: '2026-06-01T10:00:00Z'
          }
        ],
        total_count: 1
      },
      requiredResponse: {
        profiles: [
          {
            id: 1,
            name: 'Professional Avatar',
            tone: 'formal',
            level: 'expert',
            description: 'Business avatar for professional content',
            isDefault: false,
            createdDate: 'Jun 1, 2026',
            usedByContentCount: 12
          }
        ],
        total_count: 1
      },
      fieldMapping: [
        { field: 'id', currentSource: 'profile.id', requiredSource: 'profile.id', status: 'match' },
        { field: 'name', currentSource: 'profile.name', requiredSource: 'profile.name', status: 'match' },
        { field: 'tone', currentSource: 'profile.tone', requiredSource: 'profile.tone', status: 'match' },
        { field: 'level', currentSource: 'profile.level', requiredSource: 'profile.level', status: 'match' },
        { field: 'description', currentSource: 'profile.description', requiredSource: 'profile.description', status: 'match' },
        { field: 'isDefault', currentSource: null, requiredSource: 'profile.isDefault', status: 'missing', note: 'Add is_default boolean to avatars table.' },
        { field: 'createdDate', currentSource: 'profile.created_at', requiredSource: 'profile.createdDate', status: 'rename', note: 'Format as "Jun 1, 2026" instead of ISO.' },
        { field: 'usedByContentCount', currentSource: null, requiredSource: 'profile.usedByContentCount', status: 'missing', note: 'Compute from content_items table. Count items using this avatar.' }
      ],
      notes: 'Core fields match well. Missing: isDefault flag and usedByContentCount (computable from content associations).'
    },
    {
      method: 'POST',
      path: '/api/v1/avatars',
      description: 'Create a new writer profile / avatar',
      availability: 'available',
      authRequired: true,
      requestBody: {
        name: 'New Avatar',
        tone: 'casual',
        level: 'intermediate',
        description: 'A casual writing style'
      },
      currentResponse: {
        profile: {
          id: 2,
          name: 'New Avatar',
          tone: 'casual',
          level: 'intermediate',
          description: 'A casual writing style',
          status: 'active',
          created_at: '2026-08-06T12:00:00Z'
        }
      },
      requiredResponse: {
        profile: {
          id: 2,
          name: 'New Avatar',
          tone: 'casual',
          level: 'intermediate',
          description: 'A casual writing style',
          isDefault: false,
          createdDate: 'Aug 6, 2026',
          usedByContentCount: 0
        }
      },
      fieldMapping: [
        { field: 'id', currentSource: 'profile.id', requiredSource: 'profile.id', status: 'match' },
        { field: 'name', currentSource: 'profile.name', requiredSource: 'profile.name', status: 'match' },
        { field: 'tone', currentSource: 'profile.tone', requiredSource: 'profile.tone', status: 'match' },
        { field: 'level', currentSource: 'profile.level', requiredSource: 'profile.level', status: 'match' },
        { field: 'description', currentSource: 'profile.description', requiredSource: 'profile.description', status: 'match' },
        { field: 'isDefault', currentSource: null, requiredSource: 'profile.isDefault', status: 'missing' },
        { field: 'createdDate', currentSource: 'profile.created_at', requiredSource: 'profile.createdDate', status: 'rename' },
        { field: 'usedByContentCount', currentSource: null, requiredSource: 'profile.usedByContentCount', status: 'missing' }
      ],
      notes: 'Create works. Same field mapping as GET.'
    }
  ],

  social_automation: [
    {
      method: 'GET',
      path: '/api/v1/sa_accounts',
      description: 'List all connected social media accounts',
      availability: 'available',
      authRequired: true,
      currentResponse: {
        success: true,
        accounts: [
          {
            id: 1,
            account_name: 'Marketing IG',
            network: 'instagram',
            profile_name: '@marketing',
            is_connected: true,
            platform: 'Instagram'
          },
          {
            id: 2,
            account_name: 'Company YouTube',
            network: 'youtube',
            profile_name: '@company',
            is_connected: true,
            platform: 'YouTube'
          }
        ],
        count: 2
      },
      requiredResponse: {
        success: true,
        accounts: [
          {
            id: 1,
            account_name: 'Marketing IG',
            network: 'instagram',
            profile_name: '@marketing',
            is_connected: true,
            platform: 'Instagram',
            followers: '12.5K',
            engagement_rate: '3.2%',
            lastPosted: '2026-08-05T14:00:00Z'
          }
        ],
        count: 2
      },
      fieldMapping: [
        { field: 'accounts[].id', currentSource: 'account.id', requiredSource: 'account.id', status: 'match' },
        { field: 'accounts[].account_name', currentSource: 'account.account_name', requiredSource: 'account.account_name', status: 'match' },
        { field: 'accounts[].network', currentSource: 'account.network', requiredSource: 'account.network', status: 'match' },
        { field: 'accounts[].profile_name', currentSource: 'account.profile_name', requiredSource: 'account.profile_name', status: 'match' },
        { field: 'accounts[].is_connected', currentSource: 'account.is_connected', requiredSource: 'account.is_connected', status: 'match' },
        { field: 'accounts[].platform', currentSource: 'account.platform', requiredSource: 'account.platform', status: 'match' },
        { field: 'accounts[].followers', currentSource: null, requiredSource: 'account.followers', status: 'missing', note: 'Add follower count from platform API sync.' },
        { field: 'accounts[].engagement_rate', currentSource: null, requiredSource: 'account.engagement_rate', status: 'missing', note: 'Add engagement rate from platform API sync.' },
        { field: 'accounts[].lastPosted', currentSource: null, requiredSource: 'account.lastPosted', status: 'missing', note: 'Add last post timestamp from platform API sync.' }
      ],
      notes: 'Account listing works. Missing analytics fields (followers, engagement_rate, lastPosted) that require periodic sync with platform APIs.'
    },
    {
      method: 'POST',
      path: '/api/v1/sa_links',
      description: 'Create a scheduled social media post',
      availability: 'available',
      authRequired: true,
      requestBody: {
        account_id: 1,
        content: 'Post content here',
        scheduled_at: '2026-08-10T14:00:00Z',
        media_urls: ['https://example.com/image.jpg']
      },
      currentResponse: {
        link: {
          id: 1,
          account_id: 1,
          content: 'Post content here',
          scheduled_at: '2026-08-10T14:00:00Z',
          status: 'scheduled',
          created_at: '2026-08-06T12:00:00Z'
        }
      },
      requiredResponse: {
        link: {
          id: 1,
          account_id: 1,
          content: 'Post content here',
          scheduled_at: '2026-08-10T14:00:00Z',
          status: 'scheduled',
          type: 'social-posts',
          funnelStage: 'top',
          campaign_id: 1,
          created_at: '2026-08-06T12:00:00Z'
        }
      },
      fieldMapping: [
        { field: 'link.id', currentSource: 'link.id', requiredSource: 'link.id', status: 'match' },
        { field: 'link.account_id', currentSource: 'link.account_id', requiredSource: 'link.account_id', status: 'match' },
        { field: 'link.content', currentSource: 'link.content', requiredSource: 'link.content', status: 'match' },
        { field: 'link.scheduled_at', currentSource: 'link.scheduled_at', requiredSource: 'link.scheduled_at', status: 'match' },
        { field: 'link.status', currentSource: 'link.status', requiredSource: 'link.status', status: 'match' },
        { field: 'link.type', currentSource: null, requiredSource: 'link.type', status: 'missing', note: 'Add content type classification.' },
        { field: 'link.funnelStage', currentSource: null, requiredSource: 'link.funnelStage', status: 'missing', note: 'Add funnel stage classification.' },
        { field: 'link.campaign_id', currentSource: null, requiredSource: 'link.campaign_id', status: 'missing', note: 'Link to Campaigns API when implemented.' }
      ],
      notes: 'Post scheduling works. Missing Orcaru-specific fields (type, funnelStage, campaign_id) for integration with content system.'
    },
    {
      method: 'POST',
      path: '/api/v1/sa_links/:id/publish',
      description: 'Publish a scheduled post to the social platform',
      availability: 'available',
      authRequired: true,
      currentResponse: {
        link: {
          id: 1,
          status: 'published',
          published_at: '2026-08-10T14:00:00Z',
          platform_post_id: 'ig_post_12345',
          platform_url: 'https://instagram.com/p/abc123'
        }
      },
      requiredResponse: {
        link: {
          id: 1,
          status: 'published',
          published_at: '2026-08-10T14:00:00Z',
          platform_post_id: 'ig_post_12345',
          platform_url: 'https://instagram.com/p/abc123',
          engagement: { likes: 0, comments: 0, shares: 0 }
        }
      },
      fieldMapping: [
        { field: 'link.id', currentSource: 'link.id', requiredSource: 'link.id', status: 'match' },
        { field: 'link.status', currentSource: 'link.status', requiredSource: 'link.status', status: 'match' },
        { field: 'link.published_at', currentSource: 'link.published_at', requiredSource: 'link.published_at', status: 'match' },
        { field: 'link.platform_post_id', currentSource: 'link.platform_post_id', requiredSource: 'link.platform_post_id', status: 'match' },
        { field: 'link.platform_url', currentSource: 'link.platform_url', requiredSource: 'link.platform_url', status: 'match' },
        { field: 'link.engagement', currentSource: null, requiredSource: 'link.engagement', status: 'missing', note: 'Add engagement tracking. Sync from platform APIs periodically.' }
      ],
      notes: 'Publishing works. Missing engagement tracking that requires periodic sync with platform APIs.'
    },
    {
      method: 'GET',
      path: '/api/v1/sa_links',
      description: 'List all scheduled and published posts',
      availability: 'available',
      authRequired: true,
      parameters: [
        { name: 'status', type: 'string', required: false, description: 'Filter by status', example: 'scheduled' },
        { name: 'account_id', type: 'integer', required: false, description: 'Filter by account', example: '1' }
      ],
      currentResponse: {
        links: [
          {
            id: 1,
            account_id: 1,
            content: 'Post content',
            scheduled_at: '2026-08-10T14:00:00Z',
            status: 'scheduled',
            created_at: '2026-08-06T12:00:00Z'
          }
        ],
        meta: { total_count: 1, page: 1, per_page: 20 }
      },
      requiredResponse: {
        links: [
          {
            id: 1,
            account_id: 1,
            content: 'Post content',
            scheduled_at: '2026-08-10T14:00:00Z',
            status: 'scheduled',
            type: 'social-posts',
            funnelStage: 'top',
            campaign_id: 1,
            created_at: '2026-08-06T12:00:00Z'
          }
        ],
        meta: { total_count: 1, page: 1, per_page: 20 }
      },
      fieldMapping: [
        { field: 'links[].id', currentSource: 'link.id', requiredSource: 'link.id', status: 'match' },
        { field: 'links[].account_id', currentSource: 'link.account_id', requiredSource: 'link.account_id', status: 'match' },
        { field: 'links[].content', currentSource: 'link.content', requiredSource: 'link.content', status: 'match' },
        { field: 'links[].scheduled_at', currentSource: 'link.scheduled_at', requiredSource: 'link.scheduled_at', status: 'match' },
        { field: 'links[].status', currentSource: 'link.status', requiredSource: 'link.status', status: 'match' },
        { field: 'links[].type', currentSource: null, requiredSource: 'link.type', status: 'missing' },
        { field: 'links[].funnelStage', currentSource: null, requiredSource: 'link.funnelStage', status: 'missing' },
        { field: 'links[].campaign_id', currentSource: null, requiredSource: 'link.campaign_id', status: 'missing' }
      ],
      notes: 'Post listing works. Same missing fields as create endpoint.'
    }
  ],

  campaigns: [
    {
      method: 'GET',
      path: '/api/v1/campaigns',
      description: 'List all campaigns (NOT IMPLEMENTED)',
      availability: 'missing',
      authRequired: true,
      currentResponse: null,
      requiredResponse: {
        campaigns: [
          {
            id: 1,
            name: 'Summer Collection Launch',
            description: 'Multi-channel campaign promoting new summer athletic wear',
            startDate: '2026-06-01',
            endDate: '2026-08-31',
            color: '#F97316',
            contentItems: [
              { id: 101, topic: 'Summer Collection Teaser', type: 'Social Post', status: 'approved', scheduledDate: '2026-06-01', funnelStage: 'Awareness' }
            ],
            funnelDistribution: { awareness: 40, consideration: 30, decision: 20, retention: 10 }
          }
        ],
        meta: { total_count: 1, page: 1, per_page: 20 }
      },
      fieldMapping: [
        { field: 'campaigns[].id', currentSource: null, requiredSource: 'campaigns[].id', status: 'missing', note: 'New table needed: campaigns' },
        { field: 'campaigns[].name', currentSource: null, requiredSource: 'campaigns[].name', status: 'missing' },
        { field: 'campaigns[].description', currentSource: null, requiredSource: 'campaigns[].description', status: 'missing' },
        { field: 'campaigns[].startDate', currentSource: null, requiredSource: 'campaigns[].start_date', status: 'missing' },
        { field: 'campaigns[].endDate', currentSource: null, requiredSource: 'campaigns[].end_date', status: 'missing' },
        { field: 'campaigns[].color', currentSource: null, requiredSource: 'campaigns[].color', status: 'missing' },
        { field: 'campaigns[].contentItems', currentSource: null, requiredSource: 'content_items (join)', status: 'missing', note: 'Requires content_items table with campaign_id FK' },
        { field: 'campaigns[].funnelDistribution', currentSource: null, requiredSource: 'campaigns[].funnel_distribution (JSON)', status: 'missing', note: 'Compute from content_items funnel stages or store as JSON column' }
      ],
      notes: 'Entirely new feature. Requires: campaigns table, content_items table with campaign_id FK, funnel distribution computation.'
    }
  ],

  content_items: [
    {
      method: 'GET',
      path: '/api/v1/content_items',
      description: 'List all content items (NOT IMPLEMENTED)',
      availability: 'missing',
      authRequired: true,
      currentResponse: null,
      requiredResponse: {
        content_items: [
          {
            id: 1,
            topic: 'Summer Collection Teaser',
            type: 'Social Post',
            status: 'approved',
            scheduledDate: '2026-06-01',
            funnelStage: 'Awareness',
            campaign_id: 1,
            project_id: 136,
            creator: 'Professional Avatar'
          }
        ],
        meta: { total_count: 1, page: 1, per_page: 20 }
      },
      fieldMapping: [
        { field: 'content_items[].id', currentSource: null, requiredSource: 'content_items[].id', status: 'missing', note: 'New table needed: content_items' },
        { field: 'content_items[].topic', currentSource: null, requiredSource: 'content_items[].topic', status: 'missing' },
        { field: 'content_items[].type', currentSource: null, requiredSource: 'content_items[].content_type', status: 'missing', note: 'Enum: Blog Post, Social Post, Short Video, Carousel, Email' },
        { field: 'content_items[].status', currentSource: null, requiredSource: 'content_items[].status', status: 'missing', note: 'Enum: draft, generating, ready-for-review, approved, published, rejected' },
        { field: 'content_items[].scheduledDate', currentSource: null, requiredSource: 'content_items[].scheduled_at', status: 'missing' },
        { field: 'content_items[].funnelStage', currentSource: null, requiredSource: 'content_items[].funnel_stage', status: 'missing', note: 'Enum: Awareness, Consideration, Decision, Retention' },
        { field: 'content_items[].campaign_id', currentSource: null, requiredSource: 'content_items[].campaign_id', status: 'missing', note: 'FK to campaigns table' },
        { field: 'content_items[].project_id', currentSource: null, requiredSource: 'content_items[].project_id', status: 'missing', note: 'FK to projects table' },
        { field: 'content_items[].creator', currentSource: null, requiredSource: 'content_items[].avatar_id (join)', status: 'missing', note: 'FK to avatars table' }
      ],
      notes: 'Entirely new feature. Core entity for Orcaru content system. Requires: content_items table with FKs to projects, campaigns, avatars.'
    }
  ],

  brand_kits: [
    {
      method: 'GET',
      path: '/api/v1/brand_kits',
      description: 'List all brand kits (NOT IMPLEMENTED)',
      availability: 'missing',
      authRequired: true,
      currentResponse: null,
      requiredResponse: {
        brand_kits: [
          {
            id: 1,
            name: 'Amrit Yoga Brand',
            description: 'Brand guidelines for Amrit Yoga content',
            colors: {
              primary: '#D946EF',
              secondary: '#8B5CF6',
              accent: '#06B6D4',
              background: '#FFFFFF',
              text: '#1F2937'
            },
            fonts: {
              heading: 'Inter',
              body: 'Inter',
              accent: 'Playfair Display'
            },
            assets: [
              { id: 1, name: 'Logo', type: 'image', url: 'https://example.com/logo.png' }
            ],
            createdAt: '2026-01-15T10:30:00Z',
            updatedAt: '2026-08-01T14:00:00Z'
          }
        ],
        meta: { total_count: 1, page: 1, per_page: 20 }
      },
      fieldMapping: [
        { field: 'brand_kits[].id', currentSource: null, requiredSource: 'brand_kits[].id', status: 'missing', note: 'New table needed: brand_kits' },
        { field: 'brand_kits[].name', currentSource: null, requiredSource: 'brand_kits[].name', status: 'missing' },
        { field: 'brand_kits[].description', currentSource: null, requiredSource: 'brand_kits[].description', status: 'missing' },
        { field: 'brand_kits[].colors', currentSource: null, requiredSource: 'brand_kits[].colors (JSON)', status: 'missing', note: 'Store as JSON column with color palette' },
        { field: 'brand_kits[].fonts', currentSource: null, requiredSource: 'brand_kits[].fonts (JSON)', status: 'missing', note: 'Store as JSON column with font definitions' },
        { field: 'brand_kits[].assets', currentSource: null, requiredSource: 'brand_kit_assets (join)', status: 'missing', note: 'Separate table for brand assets or JSON array' },
        { field: 'brand_kits[].createdAt', currentSource: null, requiredSource: 'brand_kits[].created_at', status: 'missing' },
        { field: 'brand_kits[].updatedAt', currentSource: null, requiredSource: 'brand_kits[].updated_at', status: 'missing' }
      ],
      notes: 'Entirely new feature. Requires: brand_kits table with JSON columns for colors/fonts, brand_kit_assets table for file uploads.'
    }
  ],

  audits: [
    {
      method: 'GET',
      path: '/api/v1/audits',
      description: 'List all social media audits (NOT IMPLEMENTED)',
      availability: 'missing',
      authRequired: true,
      currentResponse: null,
      requiredResponse: {
        audits: [
          {
            id: 'audit-001',
            name: '@fashionbrand_official Audit',
            handle: '@fashionbrand_official',
            createdAt: '2026-03-15T10:00:00Z',
            dateRange: { start: '2026-01-01', end: '2026-03-31' },
            platforms: [
              { id: 'p1', platform: 'youtube', name: 'YouTube', handle: '@fashionbrand', postsCount: 64, enabled: true, status: 'complete' }
            ],
            totalPosts: 158,
            avgEngagement: '2.4K',
            postsWithCtas: '23%',
            uniqueTopics: 14,
            profileScore: 91,
            followers: '245M',
            growth: '+2.1%',
            engagements: '18.7M',
            funnelBreakdown: { top: 72, middle: 20, bottom: 8 },
            contentTypeDistribution: { 'short-clips': 45, carousels: 32, 'static-posts': 28 },
            topicCloud: [{ name: 'Summer Fashion', size: 'large' }],
            criticalGaps: ['Low bottom-funnel content', 'Missing video content on Instagram'],
            recommendedActions: ['Increase decision-stage content', 'Add Instagram Reels strategy']
          }
        ],
        meta: { total_count: 1, page: 1, per_page: 20 }
      },
      fieldMapping: [
        { field: 'audits[].id', currentSource: null, requiredSource: 'audits[].id', status: 'missing', note: 'New table needed: audits' },
        { field: 'audits[].platforms', currentSource: null, requiredSource: 'audit_platforms (join)', status: 'missing', note: 'Separate table for platform-specific audit data' },
        { field: 'audits[].totalPosts', currentSource: null, requiredSource: 'audits[].total_posts', status: 'missing' },
        { field: 'audits[].avgEngagement', currentSource: null, requiredSource: 'audits[].avg_engagement', status: 'missing' },
        { field: 'audits[].funnelBreakdown', currentSource: null, requiredSource: 'audits[].funnel_breakdown (JSON)', status: 'missing' },
        { field: 'audits[].contentTypeDistribution', currentSource: null, requiredSource: 'audits[].content_type_distribution (JSON)', status: 'missing' },
        { field: 'audits[].topicCloud', currentSource: null, requiredSource: 'audit_topics (join)', status: 'missing', note: 'Separate table for topic analysis' },
        { field: 'audits[].criticalGaps', currentSource: null, requiredSource: 'audits[].critical_gaps (JSON array)', status: 'missing' },
        { field: 'audits[].recommendedActions', currentSource: null, requiredSource: 'audits[].recommended_actions (JSON array)', status: 'missing' }
      ],
      notes: 'Most complex new feature. Requires: audits table, audit_platforms table, audit_topics table. Heavy data aggregation from platform APIs.'
    }
  ],

  calendar: [
    {
      method: 'GET',
      path: '/api/v1/calendar',
      description: 'Get calendar events for content scheduling (NOT IMPLEMENTED)',
      availability: 'missing',
      authRequired: true,
      currentResponse: null,
      requiredResponse: {
        events: [
          {
            id: 1,
            title: 'Summer Collection Teaser',
            start: '2026-06-01T14:00:00Z',
            end: '2026-06-01T15:00:00Z',
            type: 'social-posts',
            status: 'scheduled',
            projectId: 136,
            campaignId: 1,
            accountIds: [1]
          }
        ],
        meta: { total_count: 1, start_date: '2026-06-01', end_date: '2026-06-30' }
      },
      fieldMapping: [
        { field: 'events[].id', currentSource: null, requiredSource: 'calendar_events[].id', status: 'missing', note: 'New table needed: calendar_events' },
        { field: 'events[].title', currentSource: null, requiredSource: 'calendar_events[].title', status: 'missing' },
        { field: 'events[].start', currentSource: null, requiredSource: 'calendar_events[].start_at', status: 'missing' },
        { field: 'events[].end', currentSource: null, requiredSource: 'calendar_events[].end_at', status: 'missing' },
        { field: 'events[].type', currentSource: null, requiredSource: 'calendar_events[].content_type', status: 'missing' },
        { field: 'events[].status', currentSource: null, requiredSource: 'calendar_events[].status', status: 'missing' },
        { field: 'events[].projectId', currentSource: null, requiredSource: 'calendar_events[].project_id', status: 'missing', note: 'FK to projects table' },
        { field: 'events[].campaignId', currentSource: null, requiredSource: 'calendar_events[].campaign_id', status: 'missing', note: 'FK to campaigns table' },
        { field: 'events[].accountIds', currentSource: null, requiredSource: 'calendar_event_accounts (join)', status: 'missing', note: 'Join table for event-account associations' }
      ],
      notes: 'Entirely new feature. Could potentially reuse sa_links scheduled_at data as a starting point, but needs dedicated calendar_events table for full functionality.'
    }
  ]
};

// ─── Helper Components ────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: 'full' | 'partial' | 'missing' }) {
  const config = {
    full: { label: 'Fully Available', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', icon: CheckCircle2 },
    partial: { label: 'Partially Available', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', icon: AlertCircle },
    missing: { label: 'Not Implemented', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', icon: XCircle }
  };
  const c = config[status];
  const Icon = c.icon;
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border', c.bg, c.text, c.border)}>
      <Icon className="w-3.5 h-3.5" />
      {c.label}
    </span>
  );
}

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    POST: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    PATCH: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    DELETE: 'bg-red-500/10 text-red-400 border-red-500/20',
    PUT: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  };
  return (
    <span className={cn('px-2 py-0.5 rounded text-xs font-mono font-bold border', colors[method] || colors.GET)}>
      {method}
    </span>
  );
}

function FieldMappingRow({ mapping }: { mapping: FieldMapping }) {
  const statusConfig = {
    match: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Match', icon: CheckCircle2 },
    rename: { color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Rename', icon: ArrowLeftRight },
    compute: { color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Compute', icon: Zap },
    missing: { color: 'text-red-400', bg: 'bg-red-500/10', label: 'Missing', icon: XCircle }
  };
  const s = statusConfig[mapping.status];
  const Icon = s.icon;

  return (
    <div className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
      <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
        <Icon className={cn('w-3.5 h-3.5', s.color)} />
        <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded', s.bg, s.color)}>{s.label}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-mono text-foreground">{mapping.field}</div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {mapping.currentSource ? (
            <span>From: <code className="text-emerald-400">{mapping.currentSource}</code></span>
          ) : (
            <span className="text-red-400">Not in current API</span>
          )}
          {mapping.note && <span className="ml-2 text-muted-foreground">— {mapping.note}</span>}
        </div>
      </div>
    </div>
  );
}

function JsonViewer({ data, label }: { data: any; label: string }) {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="text-xs font-mono text-foreground bg-background/50 border border-border rounded-lg p-3 overflow-x-auto max-h-64 overflow-y-auto">
        {json}
      </pre>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ApiDocumentation() {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    user: null,
    loading: false,
    error: null
  });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [testingEndpoint, setTestingEndpoint] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [apiStatus, setApiStatus] = useState<'unknown' | 'online' | 'offline'>('unknown');
  const [expandedEndpoints, setExpandedEndpoints] = useState<Set<string>>(new Set());
  const [responseView, setResponseView] = useState<Record<string, 'current' | 'required' | 'both'>>({});

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('auth_user');
    const isDemo = localStorage.getItem('demo_mode') === 'true';
    if (token && user) {
      setAuth({
        isAuthenticated: true,
        token,
        user: JSON.parse(user),
        loading: false,
        error: null
      });
      setDemoMode(isDemo);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuth(prev => ({ ...prev, loading: true, error: null }));

    if (demoMode) {
      localStorage.setItem('auth_token', 'mock_jwt_token_demo_mode');
      localStorage.setItem('auth_user', JSON.stringify({ id: 1, email: 'demo@orcaru.com', name: 'Demo User' }));
      localStorage.setItem('demo_mode', 'true');
      setAuth({
        isAuthenticated: true,
        token: 'mock_jwt_token_demo_mode',
        user: { id: 1, email: 'demo@orcaru.com', name: 'Demo User' },
        loading: false,
        error: null
      });
      setApiStatus('online');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth`, {
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
      localStorage.setItem('demo_mode', 'false');

      setAuth({
        isAuthenticated: true,
        token: data.token,
        user: data.user,
        loading: false,
        error: null
      });
      setApiStatus('online');
    } catch (error) {
      setApiStatus('offline');
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
    localStorage.removeItem('demo_mode');
    setAuth({ isAuthenticated: false, token: null, user: null, loading: false, error: null });
    setTestResults({});
    setApiStatus('unknown');
  };

  const toggleEndpoint = (key: string) => {
    setExpandedEndpoints(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const cycleResponseView = (key: string) => {
    setResponseView(prev => {
      const current = prev[key] || 'current';
      const next = current === 'current' ? 'required' : current === 'required' ? 'both' : 'current';
      return { ...prev, [key]: next };
    });
  };

  const testEndpoint = async (endpoint: Endpoint) => {
    const endpointKey = `${endpoint.method} ${endpoint.path}`;
    setTestingEndpoint(endpointKey);
    setTestResults(prev => ({ ...prev, [endpointKey]: { loading: true } }));

    if (demoMode || endpoint.availability === 'missing') {
      await new Promise(resolve => setTimeout(resolve, 500));
      setTestResults(prev => ({
        ...prev,
        [endpointKey]: {
          loading: false,
          status: endpoint.availability === 'missing' ? 404 : 200,
          statusText: endpoint.availability === 'missing' ? 'Not Implemented (Demo)' : 'OK (Demo)',
          data: endpoint.requiredResponse || { message: 'This endpoint is not yet implemented' },
          isDemo: true
        }
      }));
      setTestingEndpoint(null);
      return;
    }

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (endpoint.authRequired && auth.token) {
        headers['Authorization'] = `Bearer ${auth.token}`;
      }

      const options: RequestInit = { method: endpoint.method, headers };
      if (['POST', 'PATCH', 'PUT'].includes(endpoint.method) && endpoint.requestBody) {
        options.body = JSON.stringify(endpoint.requestBody);
      }

      const response = await fetch(`${API_BASE_URL}${endpoint.path}`, options);
      const data = await response.json().catch(() => null);

      setTestResults(prev => ({
        ...prev,
        [endpointKey]: { loading: false, status: response.status, statusText: response.statusText, data }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [endpointKey]: { loading: false, error: error instanceof Error ? error.message : 'Request failed' }
      }));
    } finally {
      setTestingEndpoint(null);
    }
  };

  const categoryOrder = ['authentication', 'projects', 'resources', 'avatars', 'social_automation', 'campaigns', 'content_items', 'brand_kits', 'audits', 'calendar'];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Code2 className="w-8 h-8 text-primary" />
            API Documentation
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Rails API v1 — Interactive Explorer — Internal Tool
          </p>
        </div>

        {/* Auth Status Bar */}
        <div className="mb-8 p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {auth.isAuthenticated ? (
                <>
                  <Unlock className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm text-foreground font-medium">
                    {demoMode ? 'Demo Mode' : 'Authenticated'}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{auth.user?.email}</span>
                  {demoMode && (
                    <span className="px-2 py-0.5 rounded text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Mock Data
                    </span>
                  )}
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 text-amber-400" />
                  <span className="text-sm text-foreground font-medium">Not Authenticated</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">Login to test protected endpoints</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              {apiStatus === 'offline' && (
                <div className="flex items-center gap-1.5 text-xs text-destructive">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>API Offline</span>
                </div>
              )}
              {auth.isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-destructive" />
                  <span className="text-sm text-destructive">Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Login Form (when not authenticated) */}
        {!auth.isAuthenticated && (
          <div className="mb-8 p-6 rounded-xl bg-card border border-border max-w-md">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Login to Test API
            </h3>
            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={demoMode}
                  onChange={(e) => setDemoMode(e.target.checked)}
                  className="rounded border-border"
                />
                <span>Use demo mode (mock data, no API needed)</span>
              </label>
              {auth.error && <p className="text-xs text-destructive">{auth.error}</p>}
              <button
                type="submit"
                disabled={auth.loading}
                className="w-full px-3 py-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {auth.loading ? 'Logging in...' : demoMode ? 'Enter Demo Mode' : 'Login'}
              </button>
            </form>
          </div>
        )}

        {/* Account Data (when authenticated) */}
        {auth.isAuthenticated && (
          <div className="mb-8 p-6 rounded-xl bg-card border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Account Data
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">ID:</span>
                <span className="ml-2 text-foreground font-mono">{auth.user?.id}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <span className="ml-2 text-foreground">{auth.user?.email}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Name:</span>
                <span className="ml-2 text-foreground">{auth.user?.name}</span>
              </div>
            </div>
          </div>
        )}

        {/* Overview Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {(['full', 'partial', 'missing'] as const).map(status => {
            const categories = Object.values(CATEGORY_STATUS).filter(c => c.status === status);
            const totalAvailable = categories.reduce((sum, c) => sum + c.available, 0);
            const totalEndpoints = categories.reduce((sum, c) => sum + c.total, 0);
            const config = {
              full: { label: 'Fully Available', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
              partial: { label: 'Partially Available', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
              missing: { label: 'Not Implemented', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' }
            };
            const c = config[status];
            return (
              <div key={status} className={cn('p-4 rounded-xl border', c.bg, c.border)}>
                <div className={cn('text-2xl font-bold', c.color)}>{totalAvailable}/{totalEndpoints}</div>
                <div className="text-xs text-muted-foreground mt-1">{c.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{categories.length} categories</div>
              </div>
            );
          })}
        </div>

        {/* API Endpoint Categories */}
        <div className="space-y-8">
          {categoryOrder.map(categoryKey => {
            const category = CATEGORY_STATUS[categoryKey];
            const endpoints = API_ENDPOINTS[categoryKey] || [];

            return (
              <div key={categoryKey} className="rounded-xl border border-border bg-card overflow-hidden">
                {/* Category Header */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-foreground">{category.label}</h2>
                    <StatusBadge status={category.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-muted-foreground">
                      {category.available} of {category.total} endpoints available
                    </span>
                    <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          category.status === 'full' ? 'bg-emerald-500' :
                          category.status === 'partial' ? 'bg-amber-500' : 'bg-red-500'
                        )}
                        style={{ width: `${(category.available / category.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Endpoints */}
                <div className="divide-y divide-border/50">
                  {endpoints.map((endpoint, idx) => {
                    const endpointKey = `${endpoint.method} ${endpoint.path}`;
                    const isExpanded = expandedEndpoints.has(endpointKey);
                    const view = responseView[endpointKey] || 'current';
                    const testResult = testResults[endpointKey];

                    return (
                      <div key={idx} className="p-6">
                        {/* Endpoint Header */}
                        <div
                          className="flex items-center gap-3 cursor-pointer group"
                          onClick={() => toggleEndpoint(endpointKey)}
                        >
                          <MethodBadge method={endpoint.method} />
                          <code className="text-sm font-mono text-foreground flex-1">{endpoint.path}</code>
                          <span className="text-xs text-muted-foreground hidden sm:block">{endpoint.description}</span>
                          <div className="flex items-center gap-2">
                            {endpoint.availability === 'available' && auth.isAuthenticated && (
                              <button
                                onClick={(e) => { e.stopPropagation(); testEndpoint(endpoint); }}
                                disabled={testingEndpoint === endpointKey}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-colors disabled:opacity-50"
                              >
                                {testingEndpoint === endpointKey ? (
                                  <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Play className="w-3 h-3 text-primary" />
                                )}
                                <span className="text-xs font-medium text-primary">Test</span>
                              </button>
                            )}
                            {endpoint.availability === 'missing' && (
                              <span className="px-2 py-1 rounded text-xs bg-red-500/10 text-red-400 border border-red-500/20">
                                Not Implemented
                              </span>
                            )}
                            {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                          </div>
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="mt-4 space-y-4">
                            {/* Description */}
                            <p className="text-sm text-muted-foreground">{endpoint.description}</p>

                            {/* Parameters */}
                            {endpoint.parameters && endpoint.parameters.length > 0 && (
                              <div>
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Parameters</h4>
                                <div className="space-y-1">
                                  {endpoint.parameters.map((param, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm">
                                      <code className="text-xs font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">{param.name}</code>
                                      <span className="text-xs text-muted-foreground">{param.type}</span>
                                      {param.required && <span className="text-xs text-red-400">required</span>}
                                      <span className="text-xs text-muted-foreground">— {param.description}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Request Body */}
                            {endpoint.requestBody && (
                              <div>
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Request Body</h4>
                                <JsonViewer data={endpoint.requestBody} label="Request" />
                              </div>
                            )}

                            {/* Response Comparison */}
                            {endpoint.currentResponse || endpoint.requiredResponse ? (
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Response Comparison</h4>
                                  <button
                                    onClick={() => cycleResponseView(endpointKey)}
                                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    {view === 'current' && <><Eye className="w-3 h-3" /> Current API</>}
                                    {view === 'required' && <><Eye className="w-3 h-3" /> Platform Required</>}
                                    {view === 'both' && <><Eye className="w-3 h-3" /> Side by Side</>}
                                  </button>
                                </div>

                                {(view === 'current' || view === 'both') && endpoint.currentResponse && (
                                  <div className={view === 'both' ? 'mb-3' : ''}>
                                    <JsonViewer data={endpoint.currentResponse} label="Current API Response" />
                                  </div>
                                )}

                                {(view === 'required' || view === 'both') && endpoint.requiredResponse && (
                                  <div className={view === 'both' ? '' : ''}>
                                    <JsonViewer data={endpoint.requiredResponse} label="Platform Required Response" />
                                  </div>
                                )}

                                {view === 'current' && !endpoint.currentResponse && (
                                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                                    <p className="text-sm text-red-400">This endpoint is not implemented. No current response available.</p>
                                  </div>
                                )}
                              </div>
                            ) : null}

                            {/* Field Mapping */}
                            {endpoint.fieldMapping && endpoint.fieldMapping.length > 0 && (
                              <div>
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Field Mapping</h4>
                                <div className="bg-background/50 border border-border rounded-lg p-3">
                                  {endpoint.fieldMapping.map((mapping, i) => (
                                    <FieldMappingRow key={i} mapping={mapping} />
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Notes */}
                            {endpoint.notes && (
                              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <p className="text-xs text-blue-400">{endpoint.notes}</p>
                              </div>
                            )}

                            {/* Test Result */}
                            {testResult && (
                              <div>
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Test Result</h4>
                                <div className={cn(
                                  'p-3 rounded-lg border',
                                  testResult.error ? 'bg-red-500/10 border-red-500/20' :
                                  testResult.isDemo ? 'bg-amber-500/10 border-amber-500/20' :
                                  'bg-emerald-500/10 border-emerald-500/20'
                                )}>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className={cn(
                                      'text-xs font-mono font-bold',
                                      testResult.error ? 'text-red-400' :
                                      testResult.isDemo ? 'text-amber-400' : 'text-emerald-400'
                                    )}>
                                      {testResult.error ? 'ERROR' : `${testResult.status} ${testResult.statusText}`}
                                    </span>
                                    {testResult.isDemo && <span className="text-xs text-amber-400">(Demo)</span>}
                                  </div>
                                  {testResult.data && <JsonViewer data={testResult.data} label="Response" />}
                                  {testResult.error && <p className="text-xs text-red-400">{testResult.error}</p>}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
