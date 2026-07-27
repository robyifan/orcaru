import { useState, useRef, useEffect } from 'react';
import {
  Plus, Upload, Link as LinkIcon, FileText, Video, Image as ImageIcon,
  Search, Download, Trash2, Clock, ArrowLeft, Play,
  BookOpen, Mic, MoreHorizontal, RefreshCw,
} from 'lucide-react';

type ResourceType = 'video' | 'document' | 'text' | 'image';

interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  size: string;
  uploadedDate: string;
  duration?: string;
  pageCount?: number;
  wordCount?: number;
  resolution?: string;
  thumbnail?: string | null;
  postsCreated?: number;
  users?: Array<{ name: string; initials: string; color: string }>;
  transcribed: boolean;
  tags: string[];
  videoUrl?: string;
  fullText?: string;
  transcription?: string;
  summary?: string;
}

const RESOURCES: Resource[] = [
  {
    id: '1',
    name: 'Yoga Session Recording...',
    type: 'video',
    size: '245 MB',
    uploadedDate: '2 hours ago',
    duration: '45:32',
    thumbnail: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&h=300&fit=crop',
    postsCreated: 7,
    users: [
      { name: 'Alex Chen', initials: 'AC', color: '#3B82F6' },
      { name: 'Sarah Kim', initials: 'SK', color: '#10B981' },
      { name: 'Mike Johnson', initials: 'MJ', color: '#F59E0B' },
    ],
    transcribed: true,
    tags: ['yoga', 'wellness', 'tutorial'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    summary: `This 45-minute yoga session covers foundational poses for beginners and intermediate practitioners. The instructor guides through a complete flow starting with breathing exercises.`,
    transcription: `[00:00] Welcome everyone to today's yoga session. I'm so glad you're here with me. Before we begin, let's take a moment to find our comfortable seated position.`,
  },
  {
    id: '2',
    name: 'Brand Guidelines 2026.pdf',
    type: 'document',
    size: '2.1 MB',
    uploadedDate: '3 days ago',
    pageCount: 32,
    thumbnail: null,
    postsCreated: 0,
    users: [],
    transcribed: true,
    tags: ['brand', 'guidelines'],
    summary: `The Brand Guidelines 2026 document establishes the visual and verbal identity standards for all company communications.`,
    fullText: `BRAND GUIDELINES 2026\nOfficial Brand Identity Standards\n\nSECTION 1 — OUR BRAND STORY\n\nOur brand was founded on the belief that exceptional design and authentic storytelling can move people.`,
  },
  {
    id: '3',
    name: 'Blog Posts Collection',
    type: 'text',
    size: '840 KB',
    uploadedDate: '1 week ago',
    wordCount: 12500,
    thumbnail: null,
    postsCreated: 0,
    users: [],
    transcribed: true,
    tags: ['blog', 'reference'],
    summary: `A curated collection of 24 high-performing blog posts from the past 18 months. Topics span product launches, athlete spotlights, training methodology.`,
    fullText: `BLOG POSTS COLLECTION — REFERENCE ARCHIVE\n24 Posts · 18 Months · 12,500 Words\n\nPOST #1 — Published Jan 12, 2025\n"Why Your Morning Run Sets the Tone for Everything"\nCategory: Training · Words: 480`,
  },
  {
    id: '4',
    name: 'Air Max Launch Graphic',
    type: 'image',
    size: '1.8 MB',
    uploadedDate: '3 weeks ago',
    resolution: '2400×1600',
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    postsCreated: 7,
    users: [
      { name: 'Alex Chen', initials: 'AC', color: '#3B82F6' },
      { name: 'Sarah Kim', initials: 'SK', color: '#10B981' },
      { name: 'Mike Johnson', initials: 'MJ', color: '#F59E0B' },
    ],
    transcribed: false,
    tags: ['social', 'launch'],
  },
  {
    id: '5',
    name: 'Product Demo Video',
    type: 'video',
    size: '180 MB',
    uploadedDate: '1 week ago',
    duration: '28:15',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    postsCreated: 0,
    users: [],
    transcribed: true,
    tags: ['product', 'demo'],
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    summary: `A 28-minute walkthrough of the platform's core features aimed at enterprise decision-makers.`,
    transcription: `[00:00] Thanks for joining this product demo. Today I'm going to show you how our platform can transform your content operation.`,
  },
  {
    id: '6',
    name: 'Instagram Post - Feb Campaign',
    type: 'image',
    size: '1.2 MB',
    uploadedDate: '2 weeks ago',
    resolution: '1080×1080',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
    postsCreated: 0,
    users: [],
    transcribed: false,
    tags: ['social', 'campaign'],
  },
  {
    id: '7',
    name: 'Athlete Portrait - Studio Cut',
    type: 'image',
    size: '2.2 MB',
    uploadedDate: '1 month ago',
    resolution: '3000×4000',
    thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop',
    postsCreated: 0,
    users: [],
    transcribed: false,
    tags: ['athlete', 'portrait'],
  },
  {
    id: '8',
    name: 'Summer Drop - Quote Card',
    type: 'image',
    size: '620 KB',
    uploadedDate: '1 month ago',
    resolution: '1080×1350',
    thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&h=300&fit=crop',
    postsCreated: 0,
    users: [],
    transcribed: false,
    tags: ['quote', 'social'],
  },
];

function CardMenu({ resource }: { resource: Resource }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const downloadBlob = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const downloadHref = (href: string, filename: string) => {
    const a = document.createElement('a');
    a.href = href;
    a.download = filename;
    a.target = '_blank';
    a.click();
    setOpen(false);
  };

  type MenuItem = { label: string; action: () => void };
  const items: MenuItem[] = [];

  if (resource.transcribed && (resource.transcription || resource.fullText)) {
    items.push({
      label: 'Download Transcription',
      action: () => downloadBlob(
        resource.name.replace(/\.[^.]+$/, '') + '_transcription.txt',
        resource.transcription ?? resource.fullText ?? ''
      ),
    });
  }

  if (resource.type === 'video') {
    items.push({
      label: 'Download Audio',
      action: () => downloadHref(resource.videoUrl ?? '#', resource.name.replace(/\.[^.]+$/, '.mp3')),
    });
    items.push({
      label: 'Download Video',
      action: () => downloadHref(resource.videoUrl ?? '#', resource.name),
    });
  }

  if (resource.type === 'image' && resource.thumbnail) {
    items.push({
      label: 'Download Image',
      action: () => downloadHref(resource.thumbnail!, resource.name),
    });
  }

  if (resource.type === 'document' || resource.type === 'text') {
    items.push({
      label: 'Download Document',
      action: () => downloadBlob(resource.name, resource.fullText ?? ''),
    });
  }

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        className={`
          w-7 h-7 flex items-center justify-center rounded-md transition-colors
          ${open
            ? 'bg-secondary text-foreground'
            : 'text-muted-foreground hover:bg-secondary hover:text-foreground opacity-0 group-hover:opacity-100'}
        `}
        aria-label="Download options"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-30 bg-popover border border-border rounded-xl shadow-2xl min-w-[11rem] py-1.5 overflow-hidden">
          {items.length === 0 ? (
            <p className="px-3 py-2 text-xs text-muted-foreground">No downloads available</p>
          ) : (
            items.map(item => (
              <button
                key={item.label}
                onClick={e => { e.stopPropagation(); item.action(); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors text-left"
              >
                <Download className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                {item.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function ResourceDetail({ resource, onBack }: { resource: Resource; onBack: () => void }) {
  const [textTab, setTextTab] = useState<'transcription' | 'summary'>('transcription');

  const typeColor = {
    video: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    document: 'bg-green-500/10 text-green-400 border-green-500/20',
    text: 'bg-green-500/10 text-green-400 border-green-500/20',
    image: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  }[resource.type] ?? 'bg-gray-500/10 text-gray-400 border-gray-500/20';

  const downloadBlob = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadHref = (href: string, filename: string) => {
    const a = document.createElement('a');
    a.href = href; a.download = filename; a.target = '_blank'; a.click();
  };

  const MediaPanel = () => {
    if (resource.type === 'video') {
      return (
        <div className="w-full bg-black rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
          {resource.videoUrl ? (
            <video src={resource.videoUrl} controls className="w-full h-full object-contain" poster={resource.thumbnail ?? undefined} />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                <Play className="w-7 h-7 text-white ml-1" />
              </div>
              <span className="text-white/50 text-sm">Preview not available</span>
            </div>
          )}
        </div>
      );
    }

    if (resource.type === 'image') {
      return (
        <div className="w-full rounded-xl overflow-hidden bg-secondary/30 flex items-center justify-center" style={{ minHeight: '320px' }}>
          {resource.thumbnail ? (
            <img src={resource.thumbnail} alt={resource.name} className="w-full h-full object-contain" />
          ) : (
            <div className="flex flex-col items-center gap-3 text-muted-foreground py-16">
              <ImageIcon className="w-16 h-16" />
              <span className="text-sm">No preview available</span>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="w-full h-full rounded-xl border border-border bg-[#0D0D0D] overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/30 flex-shrink-0">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium truncate">{resource.name}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <pre className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-sans">
            {resource.fullText}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 flex-shrink-0 w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Resources
      </button>

      <div className="flex gap-6 flex-1 min-h-0">
        <div className="flex-[3] flex flex-col min-h-0 gap-4">
          <MediaPanel />

          {resource.summary && (resource.type === 'video' || resource.type === 'image') && (
            <div className="bg-card border border-border rounded-xl p-5 flex-shrink-0">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Summary</p>
              <p className="text-sm text-foreground leading-relaxed">{resource.summary}</p>
            </div>
          )}
        </div>

        <div className="flex-[2] flex flex-col min-h-0 overflow-y-auto gap-5 pr-1">
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded-md border text-xs font-medium ${typeColor}`}>
                {resource.type}
              </span>
              {resource.transcribed && (
                <span className="px-2.5 py-0.5 rounded-md border text-xs font-medium bg-success/10 text-success border-success/20">
                  Transcribed
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-foreground leading-tight">{resource.name}</h1>
          </div>

          <div className="flex-shrink-0">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Downloads</p>
            <div className="flex flex-col gap-2">
              {resource.transcribed && (resource.transcription || resource.fullText) && (
                <button
                  onClick={() => downloadBlob(resource.name.replace(/\.[^.]+$/, '') + '_transcription.txt', resource.transcription ?? resource.fullText ?? '')}
                  className="flex items-center gap-2.5 px-3 py-2.5 bg-secondary hover:bg-secondary/70 rounded-lg text-sm font-medium transition-colors text-left"
                >
                  <Download className="w-3.5 h-3.5 text-muted-foreground" />
                  Download Transcription
                </button>
              )}
              {resource.type === 'video' && (
                <>
                  <button
                    onClick={() => downloadHref(resource.videoUrl ?? '#', resource.name.replace(/\.[^.]+$/, '.mp3'))}
                    className="flex items-center gap-2.5 px-3 py-2.5 bg-secondary hover:bg-secondary/70 rounded-lg text-sm font-medium transition-colors text-left"
                  >
                    <Download className="w-3.5 h-3.5 text-muted-foreground" />
                    Download Audio
                  </button>
                  <button
                    onClick={() => downloadHref(resource.videoUrl ?? '#', resource.name)}
                    className="flex items-center gap-2.5 px-3 py-2.5 bg-secondary hover:bg-secondary/70 rounded-lg text-sm font-medium transition-colors text-left"
                  >
                    <Download className="w-3.5 h-3.5 text-muted-foreground" />
                    Download Video
                  </button>
                </>
              )}
              {resource.type === 'image' && resource.thumbnail && (
                <button
                  onClick={() => downloadHref(resource.thumbnail!, resource.name)}
                  className="flex items-center gap-2.5 px-3 py-2.5 bg-secondary hover:bg-secondary/70 rounded-lg text-sm font-medium transition-colors text-left"
                >
                  <Download className="w-3.5 h-3.5 text-muted-foreground" />
                  Download Image
                </button>
              )}
              {(resource.type === 'document' || resource.type === 'text') && (
                <button
                  onClick={() => downloadBlob(resource.name, resource.fullText ?? '')}
                  className="flex items-center gap-2.5 px-3 py-2.5 bg-secondary hover:bg-secondary/70 rounded-lg text-sm font-medium transition-colors text-left"
                >
                  <Download className="w-3.5 h-3.5 text-muted-foreground" />
                  Download Document
                </button>
              )}
            </div>
          </div>

          {(resource.transcription || resource.fullText) && (
            <div className="flex-shrink-0">
              {resource.summary && (
                <div className="flex gap-1 p-1 bg-secondary rounded-lg mb-3 w-fit">
                  {([
                    { key: 'transcription' as const, label: resource.type === 'video' ? 'Transcription' : 'Content', icon: Mic },
                    { key: 'summary' as const, label: 'Summary', icon: BookOpen },
                  ]).map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setTextTab(key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        textTab === key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      {label}
                    </button>
                  ))}
                </div>
              )}
              {!resource.summary && (
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                  {resource.type === 'video' ? 'Transcription' : 'Content'}
                </p>
              )}
              <div className="bg-[#0D0D0D] border border-border rounded-xl p-4 max-h-72 overflow-y-auto">
                <pre className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap font-sans">
                  {textTab === 'summary' && resource.summary
                    ? resource.summary
                    : (resource.transcription ?? resource.fullText)}
                </pre>
              </div>
            </div>
          )}

          <div className="flex-shrink-0">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Details</p>
            <div className="bg-card border border-border rounded-xl divide-y divide-border">
              {[
                { label: 'File size', value: resource.size },
                { label: 'Uploaded', value: resource.uploadedDate },
                ...(resource.duration ? [{ label: 'Duration', value: resource.duration }] : []),
                ...(resource.pageCount ? [{ label: 'Pages', value: `${resource.pageCount} pages` }] : []),
                ...(resource.wordCount ? [{ label: 'Word count', value: resource.wordCount.toLocaleString() }] : []),
                ...(resource.resolution ? [{ label: 'Resolution', value: resource.resolution }] : []),
                { label: 'Type', value: resource.type.charAt(0).toUpperCase() + resource.type.slice(1) },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-foreground font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {resource.tags.length > 0 && (
            <div className="flex-shrink-0">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {resource.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-secondary rounded-lg text-xs text-muted-foreground">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex-shrink-0 pb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Content Created</p>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {resource.users?.slice(0, 3).map((user, index) => (
                    <div
                      key={user.name}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 border-2 border-card"
                      style={{
                        backgroundColor: user.color,
                        marginLeft: index > 0 ? '-4px' : '0',
                      }}
                    >
                      {user.initials}
                    </div>
                  ))}
                  {resource.users && resource.users.length > 3 && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 border-2 border-card bg-primary">
                      +{resource.users.length - 3}
                    </div>
                  )}
                </div>
                <span className="text-sm text-foreground font-medium">
                  {resource.postsCreated && resource.postsCreated > 0
                    ? `${resource.postsCreated} posts created`
                    : 'No content created'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="flex-shrink-0 pt-4 flex justify-end border-t border-border mt-4">
        <button className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
          Delete resource
        </button>
      </div>
    </div>
  );
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'video': return Video;
    case 'document':
    case 'text': return FileText;
    case 'image': return ImageIcon;
    default: return FileText;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'video': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'document':
    case 'text': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'image': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'video': return 'video';
    case 'document': return 'document';
    case 'text': return 'text';
    case 'image': return 'image';
    default: return type;
  }
};

export function EnhancedResourcesView() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const filteredResources =
    activeFilter === 'all'
      ? RESOURCES
      : RESOURCES.filter((r) =>
          activeFilter === 'document' ? (r.type === 'document' || r.type === 'text') : r.type === activeFilter
        );

  const filterCounts = {
    all: RESOURCES.length,
    video: RESOURCES.filter((r) => r.type === 'video').length,
    document: RESOURCES.filter((r) => r.type === 'document' || r.type === 'text').length,
    image: RESOURCES.filter((r) => r.type === 'image').length,
  };

  if (selectedResource) {
    return <ResourceDetail resource={selectedResource} onBack={() => setSelectedResource(null)} />;
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="border-b border-border bg-gradient-to-b from-background to-card/30">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">Resource Library</h1>
              <p className="text-sm text-muted-foreground">
                Upload files and URLs that can be used as reference for content generation
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Resources
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground text-sm"
              />
            </div>
            <div className="flex items-center gap-2 p-1 bg-card rounded-lg border border-border">
              {[
                { value: 'all', label: 'All' },
                { value: 'video', label: 'Videos' },
                { value: 'document', label: 'Documents' },
                { value: 'image', label: 'Images' },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeFilter === filter.value
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {filter.label} ({filterCounts[filter.value as keyof typeof filterCounts]})
                </button>
              ))}
            </div>
          </div>

          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground text-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-4 gap-4">
          {filteredResources.map((resource) => {
            const TypeIcon = getTypeIcon(resource.type);
            return (
              <div
                key={resource.id}
                onClick={() => setSelectedResource(resource)}
                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all group cursor-pointer hover:border-primary/30"
              >
                <div className="relative h-36 bg-secondary overflow-hidden">
                  {resource.thumbnail ? (
                    <img
                      src={resource.thumbnail}
                      alt={resource.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <TypeIcon className="w-10 h-10 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-md border text-[10px] font-medium ${getTypeColor(resource.type)}`}>
                      {getTypeLabel(resource.type)}
                    </span>
                    <CardMenu resource={resource} />
                  </div>

                  <h3 className="font-semibold text-foreground text-sm mb-3 line-clamp-2 leading-snug">
                    {resource.name}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>Size: {resource.size}</span>
                    <span>
                      {resource.duration ??
                        resource.pageCount ? `${resource.pageCount} pages` :
                        resource.wordCount ? `${resource.wordCount.toLocaleString()} words` :
                        resource.resolution ?? ''}
                    </span>
                  </div>

                  <div className="text-xs text-muted-foreground/60 mb-4">
                    Uploaded {resource.uploadedDate}
                  </div>

                  <div className="border-t border-border pt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {resource.users?.slice(0, 3).map((user, index) => (
                        <div
                          key={user.name}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 border-2 border-card"
                          style={{
                            backgroundColor: user.color,
                            marginLeft: index > 0 ? '-4px' : '0',
                          }}
                        >
                          {user.initials}
                        </div>
                      ))}
                      {resource.users && resource.users.length > 3 && (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 border-2 border-card bg-primary">
                          +{resource.users.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {resource.postsCreated && resource.postsCreated > 0
                        ? `${resource.postsCreated} posts created`
                        : 'No content created'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">Add Resources</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Upload files or paste URLs to add to your library
              </p>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block mb-3 text-sm font-medium text-foreground">Upload Files</label>
                <label className="border-2 border-dashed border-border rounded-xl p-12 flex flex-col items-center cursor-pointer hover:border-primary/50 transition-colors bg-secondary/30">
                  <input type="file" multiple className="hidden" />
                  <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-foreground mb-2">Drag & drop files or click to browse</p>
                  <p className="text-sm text-muted-foreground">Supports videos, PDFs, documents, images</p>
                </label>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 border-t border-border" />
                <span className="text-sm text-muted-foreground font-medium">OR</span>
                <div className="flex-1 border-t border-border" />
              </div>
              <div>
                <label className="block mb-3 text-sm font-medium text-foreground">Paste URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="url"
                    placeholder="https://youtube.com/... or https://your-site.com/..."
                    className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border flex items-center justify-between">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-6 py-2.5 text-foreground hover:bg-secondary rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-8 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}