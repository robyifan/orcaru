import { useState, useRef, useEffect } from 'react';
import {
  Plus, Upload, Link as LinkIcon, FileText, Video, Image as ImageIcon,
  Search, Download, Trash2, Clock, ArrowLeft, Play,
  BookOpen, Mic, MoreHorizontal,
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
  posts?: Array<{ name: string; thumbnail?: string }>;
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
    name: 'Yoga Session Recording.mp4',
    type: 'video',
    size: '245 MB',
    uploadedDate: '2 hours ago',
    duration: '45:32',
    thumbnail: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=247&h=136&fit=crop',
    postsCreated: 7,
    posts: [
      { name: 'Instagram Carousel - Wellness Tips', thumbnail: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=100&h=100&fit=crop' },
      { name: 'Instagram Carousel - Wellness Tips', thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=100&h=100&fit=crop' },
      { name: 'LinkedIn Post - Yoga Benefits', thumbnail: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=100&h=100&fit=crop' },
      { name: 'LinkedIn Post - Yoga Benefits', thumbnail: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=100&h=100&fit=crop' },
      { name: 'LinkedIn Post - Yoga Benefits', thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&h=100&fit=crop' },
      { name: 'TikTok Script - Morning Routine', thumbnail: 'https://images.unsplash.com/photo-1493606374434-5ca153e45924?w=100&h=100&fit=crop' },
      { name: 'TikTok Script - Morning Routine', thumbnail: 'https://images.unsplash.com/photo-1482192505345-5655af888cc4?w=100&h=100&fit=crop' },
    ],
    transcribed: true,
    tags: ['yoga', 'wellness', 'tutorial'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    summary: `This 45-minute yoga session covers foundational poses for beginners and intermediate practitioners.`,
    transcription: `[00:00] Welcome to today's yoga session. I'm so glad you're here. Before we begin, let's settle.\n[04:15] Take a deep breath in through your nose and exhale slowly, releasing any morning tension.\n[10:10] We'll start today with three rounds of sun salutations to warm up the body.`
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
    summary: `The Brand Guidelines 2026 document establishes visual and verbal identity standards.`,
    fullText: `BRAND GUIDELINES 2026\nOfficial Brand Identity Standards\n\nSECTION 1 — OUR BRAND STORY`,
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
    summary: `A curated collection of 24 high-performing blog posts from the past 18 months.`,
    fullText: `BLOG POSTS COLLECTION — REFERENCE ARCHIVE\n24 Posts · 18 Months · 12,500 Words`,
  },
  {
    id: '4',
    name: 'Air Max Launch Graphic',
    type: 'image',
    size: '1.8 MB',
    uploadedDate: '3 weeks ago',
    resolution: '2400×1600',
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=247&h=136&fit=crop',
    postsCreated: 7,
    posts: [
      { name: 'Instagram Post - Product Launch', thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop' },
      { name: 'Instagram Post - Sneaker Review', thumbnail: 'https://images.unsplash.com/photo-1505503620051-167631057822?w=100&h=100&fit=crop' },
      { name: 'Twitter Thread - Design Process', thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop' },
      { name: 'LinkedIn Post - Brand Story', thumbnail: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=100&h=100&fit=crop' },
      { name: 'TikTok Script - Unboxing', thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&h=100&fit=crop' },
      { name: 'YouTube Short - Features', thumbnail: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=100&h=100&fit=crop' },
      { name: 'Pinterest Pin - Style Guide', thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop' },
    ],
    transcribed: false,
    tags: ['social', 'launch'],
  },
  {
    id: '5',
    name: 'Yoga Session Recording.mp4',
    type: 'video',
    size: '245 MB',
    uploadedDate: '2 hours ago',
    duration: '45:32',
    thumbnail: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=247&h=136&fit=crop',
    postsCreated: 7,
    users: [
      { name: 'Alex Chen', initials: 'AC', color: '#3B82F6' },
      { name: 'Sarah Kim', initials: 'SK', color: '#10B981' },
      { name: 'Mike Johnson', initials: 'MJ', color: '#F59E0B' },
      { name: 'Lisa Wang', initials: 'LW', color: '#8B5CF6' },
    ],
    transcribed: true,
    tags: ['yoga', 'wellness'],
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
  },
  {
    id: '6',
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
  },
  {
    id: '7',
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
  },
  {
    id: '8',
    name: 'Yoga Session Recording.mp4',
    type: 'video',
    size: '245 MB',
    uploadedDate: '2 hours ago',
    duration: '45:32',
    thumbnail: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=247&h=136&fit=crop',
    postsCreated: 7,
    users: [
      { name: 'Alex Chen', initials: 'AC', color: '#3B82F6' },
      { name: 'Sarah Kim', initials: 'SK', color: '#10B981' },
      { name: 'Mike Johnson', initials: 'MJ', color: '#F59E0B' },
      { name: 'Lisa Wang', initials: 'LW', color: '#8B5CF6' },
    ],
    transcribed: true,
    tags: ['yoga'],
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
    a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
    setOpen(false);
  };

  const downloadHref = (href: string, filename: string) => {
    const a = document.createElement('a');
    a.href = href; a.download = filename; a.target = '_blank'; a.click();
    setOpen(false);
  };

  type MenuItem = { label: string; action: () => void };
  const items: MenuItem[] = [];

  if (resource.transcribed && (resource.transcription || resource.fullText)) {
    items.push({
      label: 'Download Transcription',
      action: () => downloadBlob(resource.name.replace(/\.[^.]+$/, '') + '_transcription.txt', resource.transcription ?? resource.fullText ?? ''),
    });
  }

  if (resource.type === 'video') {
    items.push({ label: 'Download Audio', action: () => downloadHref(resource.videoUrl ?? '#', resource.name.replace(/\.[^.]+$/, '.mp3')) });
    items.push({ label: 'Download Video', action: () => downloadHref(resource.videoUrl ?? '#', resource.name) });
  }

  if (resource.type === 'image' && resource.thumbnail) {
    items.push({ label: 'Download Image', action: () => downloadHref(resource.thumbnail!, resource.name) });
  }

  if (resource.type === 'document' || resource.type === 'text') {
    items.push({ label: 'Download Document', action: () => downloadBlob(resource.name, resource.fullText ?? '') });
  }

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        className="flex items-center justify-center p-1.5 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Download options"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-6 z-30 bg-popover border border-border rounded-xl shadow-2xl min-w-[11rem] py-1.5 overflow-hidden">
          {items.length === 0 ? (
            <p className="px-3 py-2 text-xs text-muted-foreground">No downloads available</p>
          ) : (
            items.map(item => (
              <button key={item.label} onClick={e => { e.stopPropagation(); item.action(); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors text-left">
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

interface Post {
  name: string;
  thumbnail?: string;
  platform: string;
  type: string;
  project: string;
  campaign: string;
  createdAt: string;
  publishDate?: string;
  status: 'Published' | 'In Review' | 'Draft';
}

function ResourceDetail({ resource, onBack }: { resource: Resource; onBack: () => void }) {
  const [textTab, setTextTab] = useState<'transcript' | 'summary'>('transcript');
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

  const downloadBlob = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
  };

  const downloadHref = (href: string, filename: string) => {
    const a = document.createElement('a');
    a.href = href; a.download = filename; a.target = '_blank'; a.click();
  };

  const handleArchive = () => {
    setIsArchived(true);
    setShowArchiveDialog(false);
  };

  const posts: Post[] = resource.posts?.map((post, i) => ({
    name: post.name,
    thumbnail: post.thumbnail,
    platform: ['TikTok', 'Instagram', 'LinkedIn', 'YouTube', 'Twitter', 'Pinterest'][i % 6] ?? 'Instagram',
    type: ['Short Video', 'Carousel', 'Post', 'Shorts', 'Thread', 'Pin'][i % 6] ?? 'Post',
    project: ['Wellness Startup', 'Nike', 'Tech Innovations', 'Fashion Brand', 'Food & Beverage Co', 'B2B SaaS'][i % 6] ?? 'Wellness Startup',
    campaign: ['Summer Launch', 'Brand Campaign', 'Retreat Promo', 'Wellness Series'][i % 4] ?? 'Summer Launch',
    createdAt: ['3 hours ago', '5 hours ago', '1 day ago', '2 days ago', '1 week ago'][i % 5] ?? '3 hours ago',
    publishDate: ['Jun 15', 'Jun 18', 'Jul 5', 'Jul 10'][i % 4] ?? 'Jun 15',
    status: ['Published', 'Published', 'In Review', 'Draft', 'Published'][i % 5] as 'Published' | 'In Review' | 'Draft',
  })) ?? [];

  const statusStyles = {
    Published: 'bg-[#10B981]',
    'In Review': 'bg-[#F59E0B]',
    Draft: 'bg-[#6B7280]',
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-8 py-4 text-sm text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Resources</span>
      </button>

      <div className="flex gap-8 p-8 pb-16">
        <div className="flex-[3]">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-lg bg-[#1a1a1a] border border-[#ffffff14] text-xs font-semibold text-[#51a2ff] uppercase">
              {resource.type}
            </span>
            {resource.transcribed && (
              <span className="px-3 py-1 rounded-lg bg-[#1a1a1a] border border-[#ffffff14] text-xs font-semibold text-[#66b266] uppercase">
                transcribed
              </span>
            )}
            {isArchived && (
              <span className="px-3 py-1 rounded-lg bg-[#1a1a1a] border border-[#ffffff14] text-xs font-semibold text-[#F59E0B] uppercase">
                archived
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-6">{resource.name}</h1>

          <div className="w-full rounded-xl overflow-hidden bg-black mb-8" style={{ aspectRatio: '16/9' }}>
            {resource.type === 'video' && (
              <video
                src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                poster={resource.thumbnail}
                controls
                className="w-full h-full object-cover"
              />
            )}
            {resource.type === 'image' && resource.thumbnail && (
              <img src={resource.thumbnail} alt={resource.name} className="w-full h-full object-cover" />
            )}
            {resource.type === 'document' && (
              <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                <FileText className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
            {resource.type === 'text' && (
              <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                <FileText className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-foreground">Content Created ({posts.length})</h2>
              <p className="text-xs text-muted-foreground">Social media content generated using this resource</p>
            </div>

            <div className="space-y-3">
              {posts.map((post, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-xl hover:bg-[#212121] transition-colors">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    {post.thumbnail ? (
                      <img src={post.thumbnail} alt={post.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#262626] flex items-center justify-center">
                        <span className="text-[10px] text-muted-foreground">{post.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate">{post.name}</h3>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs text-muted-foreground">{post.platform} · {post.type}</span>
                      <span className="px-2 py-0.5 rounded-md bg-[#262626] text-[10px] text-muted-foreground">{post.project}</span>
                      <span className="px-2 py-0.5 rounded-md bg-[#262626] text-[10px] text-muted-foreground">{post.campaign}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{post.createdAt}</span>
                      {post.status === 'Published' && <span>Published {post.publishDate}</span>}
                      {post.status === 'In Review' && <span>Scheduled {post.publishDate}</span>}
                      {post.status === 'Draft' && <span>Draft</span>}
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-semibold text-white flex-shrink-0 ${statusStyles[post.status]}`}>
                    {post.status}
                  </span>
                </div>
              ))}
              {posts.length === 0 && (
                <div className="p-8 bg-[#1a1a1a] rounded-xl text-center">
                  <p className="text-sm text-muted-foreground">No content created</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-[1.3] sticky top-8">
          <div className="bg-[#1a1a1a] rounded-xl p-5">
            {(resource.type === 'video' || resource.type === 'document') && resource.transcribed && (
              <div className="mb-5">
                <div className="flex bg-[#0D0D0D] rounded-lg mb-3">
                  <button
                    onClick={() => setTextTab('transcript')}
                    className={`flex-1 py-2.5 text-xs font-semibold uppercase transition-colors ${textTab === 'transcript' ? 'bg-[#262626] text-foreground rounded-lg' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Transcript
                  </button>
                  <button
                    onClick={() => setTextTab('summary')}
                    className={`flex-1 py-2.5 text-xs font-semibold uppercase transition-colors ${textTab === 'summary' ? 'bg-[#262626] text-foreground rounded-lg' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Summary
                  </button>
                </div>

                <div className="bg-[#0D0D0D] rounded-lg p-4 max-h-52 overflow-y-auto">
                  {textTab === 'transcript' && resource.transcription && (
                    <div className="space-y-3">
                      {resource.transcription.split('\n').map((line, i) => (
                        <p key={i} className="text-xs text-white/80 leading-relaxed">
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                  {textTab === 'summary' && resource.summary && (
                    <p className="text-xs text-white/80 leading-relaxed">
                      {resource.summary}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="mb-5 pt-5 border-t border-[#ffffff14]">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">File size</span>
                  <span className="text-white font-medium">{resource.size}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Uploaded</span>
                  <span className="text-white font-medium">{resource.uploadedDate}</span>
                </div>
                {resource.duration && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white font-medium">{resource.duration}</span>
                  </div>
                )}
                {resource.pageCount && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Pages</span>
                    <span className="text-white font-medium">{resource.pageCount} pages</span>
                  </div>
                )}
                {resource.wordCount && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Words</span>
                    <span className="text-white font-medium">{resource.wordCount.toLocaleString()} words</span>
                  </div>
                )}
                {resource.resolution && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Resolution</span>
                    <span className="text-white font-medium">{resource.resolution}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-5 border-t border-[#ffffff14]">
              <div className="flex flex-col gap-2">
                {resource.transcribed && (resource.transcription || resource.fullText) && (
                  <button onClick={() => downloadBlob(resource.name.replace(/\.[^.]+$/, '') + '_transcription.txt', resource.transcription ?? resource.fullText ?? '')} className="flex items-center gap-3 px-4 py-3 bg-[#262626] hover:bg-[#333333] rounded-lg text-sm font-medium text-white transition-colors text-left">
                    <FileText className="w-4 h-4 text-gray-400" />
                    Download Transcription
                  </button>
                )}
                {resource.type === 'video' && (
                  <>
                    <button onClick={() => downloadHref(resource.videoUrl ?? '#', resource.name.replace(/\.[^.]+$/, '.mp3'))} className="flex items-center gap-3 px-4 py-3 bg-[#262626] hover:bg-[#333333] rounded-lg text-sm font-medium text-white transition-colors text-left">
                      <Mic className="w-4 h-4 text-gray-400" />
                      Download Audio
                    </button>
                    <button onClick={() => downloadHref(resource.videoUrl ?? '#', resource.name)} className="flex items-center gap-3 px-4 py-3 bg-[#262626] hover:bg-[#333333] rounded-lg text-sm font-medium text-white transition-colors text-left">
                      <Video className="w-4 h-4 text-gray-400" />
                      Download Video
                    </button>
                  </>
                )}
                {resource.type === 'image' && resource.thumbnail && (
                  <button onClick={() => downloadHref(resource.thumbnail!, resource.name)} className="flex items-center gap-3 px-4 py-3 bg-[#262626] hover:bg-[#333333] rounded-lg text-sm font-medium text-white transition-colors text-left">
                    <ImageIcon className="w-4 h-4 text-gray-400" />
                    Download Image
                  </button>
                )}
                {(resource.type === 'document' || resource.type === 'text') && (
                  <button onClick={() => downloadBlob(resource.name, resource.fullText ?? '')} className="flex items-center gap-3 px-4 py-3 bg-[#262626] hover:bg-[#333333] rounded-lg text-sm font-medium text-white transition-colors text-left">
                    <FileText className="w-4 h-4 text-gray-400" />
                    Download Document
                  </button>
                )}

                {!isArchived && (
                  <button
                    onClick={() => setShowArchiveDialog(true)}
                    className="flex items-center gap-3 px-4 py-3 bg-[#262626] hover:bg-[#333333] rounded-lg text-sm font-medium text-white transition-colors text-left mt-2"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400" />
                    Archive Resource
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showArchiveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] rounded-xl p-6 max-w-md w-full mx-4 border border-[#ffffff14]">
            <h3 className="text-lg font-semibold text-white mb-2">Archive Resource</h3>
            <p className="text-sm text-gray-400 mb-6">
              This action will archive this resource. It will no longer appear in the main resources list but can be restored later. This is not a permanent deletion.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowArchiveDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleArchive}
                className="px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white text-sm font-medium rounded-lg transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
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
        <div className="px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">Resource Library</h1>
              <p className="text-sm text-muted-foreground">
                Upload files and URLs that can be used as reference for content generation
              </p>
            </div>
            <button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium">
              <Plus className="w-4 h-4" />
              Add Resources
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full pl-11 pr-5 py-2.5 bg-[#1a1a1a] border border-[#ffffff14] rounded-xl text-foreground placeholder:text-muted-foreground text-sm"
              />
            </div>
            <div className="flex items-center gap-2 p-1 bg-[#1a1a1a] rounded-xl border border-[#ffffff14]">
              {[
                { value: 'all', label: 'All' },
                { value: 'video', label: 'Videos' },
                { value: 'document', label: 'Documents' },
                { value: 'image', label: 'Images' },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
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
        </div>
      </div>

      <div className="px-8 py-8">
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, 247px)' }}>
          {filteredResources.map((resource) => {
            const TypeIcon = getTypeIcon(resource.type);
            return (
              <div
                key={resource.id}
                onClick={() => setSelectedResource(resource)}
                className="flex flex-col bg-[#1a1a1a] cursor-pointer"
                style={{ height: '366px' }}
              >
                <div className="relative flex-shrink-0" style={{ height: '136px' }}>
                  {resource.thumbnail ? (
                    <img src={resource.thumbnail} alt={resource.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#262626] flex items-center justify-center">
                      <TypeIcon className="w-10 h-10 text-muted-foreground" />
                    </div>
                  )}
                  {(resource.type === 'image' || resource.type === 'video') && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  )}
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-xl border border-[#2b7fff33] bg-[#2b7fff1a] text-[#51a2ff] text-xs font-medium">
                    {resource.type}
                  </span>
                </div>

                <div className="flex flex-col flex-grow p-4" style={{ rowGap: '12px' }}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground truncate max-w-[210px] leading-5">
                      {resource.name}
                    </h3>
                    <CardMenu resource={resource} />
                  </div>

                  <div className="flex flex-col" style={{ rowGap: '4px' }}>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Size: {resource.size}</span>
                      <span>
                        {resource.duration ??
                          (resource.pageCount ? `${resource.pageCount} pages` : '') ??
                          (resource.wordCount ? `${resource.wordCount.toLocaleString()} words` : '') ??
                          resource.resolution ?? ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-2.5 h-2.5" />
                      <span>Uploaded {resource.uploadedDate}</span>
                    </div>
                  </div>
                </div>

                <div className="relative border-t border-[#ffffff14] bg-[#212121] group" style={{ height: '52px', padding: '11px 16px 12px' }}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      {resource.posts?.slice(0, 4).map((post, index) => (
                        <div
                          key={index}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 border-2 border-[#1a1a1a] overflow-hidden"
                          style={{
                            marginLeft: index > 0 ? '-8px' : '0',
                          }}
                        >
                          {post.thumbnail ? (
                            <img src={post.thumbnail} alt={post.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#333333] flex items-center justify-center">
                              <span className="text-[8px]">{post.name.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                      ))}
                      {resource.posts && resource.posts.length > 4 && (
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 border-2 border-[#1a1a1a] bg-primary ml-[-8px]">
                          +{resource.posts.length - 4}
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <span className={`text-xs font-medium ${resource.postsCreated && resource.postsCreated > 0 ? 'text-primary cursor-pointer hover:text-primary/80' : 'text-muted-foreground'}`}>
                        {resource.postsCreated && resource.postsCreated > 0
                          ? `${resource.postsCreated} posts created`
                          : 'No content created'}
                      </span>
                      {resource.posts && resource.posts.length > 0 && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50" style={{ width: '246px' }}>
                          <div className="bg-[#262626] rounded-lg shadow-lg overflow-hidden" style={{ boxShadow: '0px 4px 12px 0px #00000033' }}>
                            <div className="px-3 py-2.5 space-y-[6px]">
                              {resource.posts.slice(0, 3).map((post, index) => (
                                <div key={index} className="text-xs text-white truncate">
                                  {post.name}
                                </div>
                              ))}
                              {resource.posts.length > 3 && (
                                <div className="text-xs text-[#999999] pt-1 border-t border-[#ffffff14] mt-[6px]">
                                  +{resource.posts.length - 3} more posts
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#262626]" />
                        </div>
                      )}
                    </div>
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
              <p className="text-sm text-muted-foreground mt-1">Upload files or paste URLs to add to your library</p>
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
                  <input type="url" placeholder="https://youtube.com/... or https://your-site.com/..." className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground" />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border flex items-center justify-between">
              <button onClick={() => setShowUploadModal(false)} className="px-6 py-2.5 text-foreground hover:bg-secondary rounded-lg transition-colors">Cancel</button>
              <button onClick={() => setShowUploadModal(false)} className="px-8 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}