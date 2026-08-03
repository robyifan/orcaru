import { useState, useRef } from 'react';
import {
  X, Upload, Sparkles, ChevronDown, Calendar, Clock, Tag, Plus,
  FileText, Scissors, Star, Wand2, Quote, Share2,
  Instagram, Facebook, Linkedin, Twitter, Youtube, Music2,
  RefreshCw,
} from 'lucide-react';
import { format } from 'date-fns';

// ─── Shared types (mirror of calendar-view types) ────────────────────────────

type ContentType = 'long-form' | 'short-clip' | 'highlight-reel' | 'ai-video' | 'quote-card' | 'social-post';
type Platform = 'instagram' | 'facebook' | 'linkedin' | 'x' | 'tiktok' | 'youtube';
type Status = 'draft' | 'generating' | 'review' | 'approved' | 'published' | 'rejected';

interface CalendarItem {
  id: string;
  title: string;
  date: Date;
  contentType: ContentType;
  funnelStage: 'top' | 'middle' | 'bottom';
  status: Status;
  campaign: string;
  batchId?: string;
  platform?: Platform;
}

// ─── Icon / label maps ───────────────────────────────────────────────────────

const CONTENT_TYPE_ICON_MAP: Record<ContentType, React.ReactElement> = {
  'long-form':      <FileText  className="w-4 h-4" />,
  'short-clip':     <Scissors  className="w-4 h-4" />,
  'highlight-reel': <Star      className="w-4 h-4" />,
  'ai-video':       <Wand2     className="w-4 h-4" />,
  'quote-card':     <Quote     className="w-4 h-4" />,
  'social-post':    <Share2    className="w-4 h-4" />,
};

const CONTENT_TYPE_LABEL: Record<ContentType, string> = {
  'long-form':      'Long Form',
  'short-clip':     'Short Clip',
  'highlight-reel': 'Highlight Reel',
  'ai-video':       'AI Video',
  'quote-card':     'Quote Card',
  'social-post':    'Social Post',
};

const PLATFORM_ICONS: Record<Platform, React.ReactElement> = {
  instagram: <Instagram className="w-3.5 h-3.5" />,
  facebook:  <Facebook  className="w-3.5 h-3.5" />,
  linkedin:  <Linkedin  className="w-3.5 h-3.5" />,
  x:         <Twitter   className="w-3.5 h-3.5" />,
  tiktok:    <Music2    className="w-3.5 h-3.5" />,
  youtube:   <Youtube   className="w-3.5 h-3.5" />,
};

const PLATFORM_LABEL: Record<Platform, string> = {
  instagram: 'Instagram',
  facebook:  'Facebook',
  linkedin:  'LinkedIn',
  x:         'X (Twitter)',
  tiktok:    'TikTok',
  youtube:   'YouTube',
};

const STATUS_OPTIONS: { value: Status; label: string; dot: string }[] = [
  { value: 'draft',      label: 'Draft',      dot: 'bg-muted-foreground' },
  { value: 'generating', label: 'Generating', dot: 'bg-[#3B82F6]' },
  { value: 'review',     label: 'Review',     dot: 'bg-warning' },
  { value: 'approved',   label: 'Approved',   dot: 'bg-success' },
  { value: 'published',  label: 'Published',  dot: 'bg-primary' },
  { value: 'rejected',   label: 'Rejected',   dot: 'bg-destructive' },
];

// ─── Mock post content per type ──────────────────────────────────────────────

const MOCK_POST_CONTENT: Record<ContentType, string> = {
  'long-form': `Control rarely identifies itself honestly.\n\nIt arrives as planning, as responsibility.\n\nIt is fear in different clothing.\n\nControl does not arrive announcing itself as fear. It arrives as planning, as preparation, as responsibility, as taking initiative.\n\nSo we let it run, often for years, without recognizing that the underlying engine is the same contraction fear is — only now externalized, given somewhere to put itself.\n\nGurudev Shri Amritji's line on this is quietly devastating, "When you seek the solution by attempting to change, manage, and control forms, your actions become extrovert; you depend on the undependable world of change."\n\n#IAMYoga #AmritYoga #Fear #Control #Presence #Witnessing #GurudevShriAmritji #ConsciousLiving #InnerFreedom #YogaWisdom #LettingGo`,
  'short-clip': `5 Essential Training Tips for Summer Running\n\n1. Hydrate before you feel thirsty\n2. Run during cooler hours (early morning or late evening)\n3. Wear light, breathable fabrics\n4. Adjust your pace — heat slows everyone down\n5. Listen to your body and take walk breaks when needed\n\n#RunningTips #SummerTraining #Hydration #RunSmart`,
  'highlight-reel': `Best moments from this month's community challenge.\n\nFeaturing incredible performances from runners across 12 cities. Every rep, every mile, every moment of grit captured in one powerful reel.\n\n#CommunityChallenge #RunWithUs #MonthlyHighlights #NeverSettle`,
  'ai-video': `This AI-generated video showcases our summer collection in motion.\n\nScene 1: Athletes training at sunrise\nScene 2: Product close-ups with dynamic transitions\nScene 3: Community run event highlights\nScene 4: Brand message overlay with CTA\n\nDuration: 60 seconds | Style: Cinematic | Music: Upbeat electronic`,
  'quote-card': `"The body achieves what the mind believes."\n\n— Unknown\n\n#Motivation #Mindset #RunningQuotes #BelieveInYourself #TrainHard`,
  'social-post': `Summer training demands summer-ready gear. We've spent months testing, refining, and pushing every fabric and seam so you don't have to think about your kit — only your next rep.\n\nThe Summer Collection is here: lighter, faster, and more durable than ever.\n\nTap to explore and gear up for the season that defines your year.\n\n#SummerCollection #AthleticPerformance #TrainLikeYouMeanIt`,
};

const MOCK_TAGS: Record<ContentType, string[]> = {
  'long-form':      ['IAMYoga', 'Guru', 'YogaWisdom', 'Mindfulness', 'ConsciousLiving'],
  'short-clip':     ['RunningTips', 'SummerTraining', 'Hydration', 'Fitness'],
  'highlight-reel': ['CommunityChallenge', 'Highlights', 'RunWithUs'],
  'ai-video':       ['AIVideo', 'BrandStory', 'Cinematic', 'SummerCollection'],
  'quote-card':     ['Motivation', 'Mindset', 'RunningQuotes'],
  'social-post':    ['SummerCollection', 'AthleticPerformance', 'GearUp'],
};

// ─── PostDetailModal ─────────────────────────────────────────────────────────

interface PostDetailModalProps {
  item: CalendarItem;
  onClose: () => void;
  onSave: (item: CalendarItem) => void;
  onRegenerate: (item: CalendarItem) => void;
}

export function PostDetailModal({ item, onClose, onSave, onRegenerate }: PostDetailModalProps) {
  const [title, setTitle] = useState(item.title);
  const [status, setStatus] = useState<Status>(item.status);
  const [publishDate, setPublishDate] = useState(format(item.date, 'yyyy-MM-dd'));
  const [publishTime, setPublishTime] = useState('15:00');
  const [postContent, setPostContent] = useState(MOCK_POST_CONTENT[item.contentType]);
  const [tags, setTags] = useState<string[]>(MOCK_TAGS[item.contentType]);
  const [tagSearch, setTagSearch] = useState('');
  const [version, setVersion] = useState(3);
  const [showVersionDropdown, setShowVersionDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const contentSubtitle = item.platform
    ? `${PLATFORM_LABEL[item.platform]} ${CONTENT_TYPE_LABEL[item.contentType]}`
    : CONTENT_TYPE_LABEL[item.contentType];

  const currentStatus = STATUS_OPTIONS.find(s => s.value === status)!;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file.name);
  };

  const handleGenerateAI = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 3000);
  };

  const handleAddTag = () => {
    const trimmed = tagSearch.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagSearch('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const filteredTagSuggestions = ['IAMYoga', 'Guru', 'YogaWisdom', 'Mindfulness', 'Fitness', 'Training', 'Motivation', 'SummerCollection']
    .filter(t => t.toLowerCase().includes(tagSearch.toLowerCase()) && !tags.includes(t));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-border w-full"
        style={{ maxWidth: '1100px', height: '85vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-[#0F0F0F] flex-shrink-0">
          {/* Left: icon + title + subtitle */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <span className="text-primary">{CONTENT_TYPE_ICON_MAP[item.contentType]}</span>
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-foreground truncate">{title}</h2>
              <p className="text-xs text-muted-foreground truncate">{contentSubtitle}</p>
            </div>
          </div>

          {/* Right: version + regenerate + status + close */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {/* Version dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowVersionDropdown(v => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary border border-border rounded-lg text-sm text-foreground hover:bg-secondary/70 transition-colors"
              >
                Version {version}
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              {showVersionDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-[#1C1C1C] border border-border rounded-lg shadow-xl py-1 z-50 min-w-[120px]">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button
                      key={v}
                      onClick={() => { setVersion(v); setShowVersionDropdown(false); }}
                      className={`w-full px-3 py-1.5 text-left text-sm hover:bg-secondary/50 transition-colors ${v === version ? 'text-primary font-medium' : 'text-foreground'}`}
                    >
                      Version {v}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Regenerate Content */}
            <button
              onClick={() => onRegenerate(item)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-secondary border border-border rounded-lg text-sm text-foreground hover:bg-secondary/70 transition-colors"
            >
              Regenerate Content
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </button>

            {/* Status dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(v => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary border border-border rounded-lg text-sm text-foreground hover:bg-secondary/70 transition-colors"
              >
                <span className={`w-2 h-2 rounded-full ${currentStatus.dot}`} />
                {currentStatus.label}
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              {showStatusDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-[#1C1C1C] border border-border rounded-lg shadow-xl py-1 z-50 min-w-[160px]">
                  {STATUS_OPTIONS.map(s => (
                    <button
                      key={s.value}
                      onClick={() => { setStatus(s.value); setShowStatusDropdown(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-secondary/50 transition-colors ${s.value === status ? 'text-primary font-medium' : 'text-foreground'}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Close */}
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Body: two-column layout ── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left panel: Preview */}
          <div className="w-[340px] flex-shrink-0 border-r border-border bg-[#0F0F0F] flex flex-col overflow-y-auto">
            <div className="px-5 pt-5 pb-3">
              <h3 className="text-sm font-semibold text-foreground">Preview</h3>
            </div>
            <div className="px-5 pb-5 flex-1 flex flex-col gap-4">
              {/* Preview placeholder area */}
              <div className="flex-1 min-h-[200px] rounded-xl border border-border bg-[#111] flex flex-col items-center justify-center gap-3 p-6">
                {/* Upload Video */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center gap-2 px-6 py-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all group"
                >
                  <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium text-primary">Upload Video</span>
                  <span className="text-xs text-muted-foreground">Click to browse</span>
                </button>
                <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={handleFileUpload} />
                {uploadedFile && (
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">{uploadedFile}</p>
                )}

                {/* Generate AI Video */}
                <button
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="flex flex-col items-center gap-2 px-6 py-4 rounded-xl border-2 border-dashed border-primary/40 hover:border-primary/60 hover:bg-primary/5 transition-all group disabled:opacity-60"
                >
                  <Sparkles className={`w-5 h-5 text-primary ${isGenerating ? 'animate-pulse' : ''}`} />
                  <span className="text-sm font-medium text-primary">Generate AI Video</span>
                  <span className="text-xs text-muted-foreground text-center leading-tight">
                    {isGenerating ? 'Generating…' : 'This will create a video using the post details and references'}
                  </span>
                </button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                This is an approximation of what your post will look like.
              </p>
            </div>
          </div>

          {/* Right panel: Content fields */}
          <div className="flex-1 min-w-0 overflow-y-auto bg-card">
            <div className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Title<span className="text-destructive ml-0.5">*</span></label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#111] border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
                  placeholder="Post title"
                />
              </div>

              {/* Publish Date + Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Publish Date</label>
                  <div className="relative">
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                      type="date"
                      value={publishDate}
                      onChange={e => setPublishDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#111] border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all appearance-none pr-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Publish Time</label>
                  <div className="relative">
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                      type="time"
                      value={publishTime}
                      onChange={e => setPublishTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#111] border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all appearance-none pr-10"
                    />
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Post Content</label>
                <textarea
                  rows={10}
                  value={postContent}
                  onChange={e => setPostContent(e.target.value)}
                  className="w-full px-3.5 py-3 bg-[#111] border border-border rounded-lg text-sm text-foreground leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50 resize-none"
                  placeholder="Write your post content here…"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Tags</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    value={tagSearch}
                    onChange={e => setTagSearch(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#111] border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
                    placeholder="Search tags"
                  />
                  {tagSearch && filteredTagSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-[#1C1C1C] border border-border rounded-lg shadow-xl py-1 z-40 max-h-40 overflow-y-auto">
                      {filteredTagSuggestions.map(t => (
                        <button
                          key={t}
                          onClick={() => { setTags([...tags, t]); setTagSearch(''); }}
                          className="w-full px-3 py-1.5 text-left text-sm text-foreground hover:bg-secondary/50 transition-colors"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Tag pills */}
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary text-xs rounded-lg group"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-primary/50 hover:text-primary transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-border bg-card flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-secondary hover:bg-secondary/70 border border-border rounded-lg text-sm font-medium transition-colors text-foreground"
          >
            Cancel
          </button>
          <div className="flex-1" />
          <button
            onClick={() => { onSave({ ...item, title, status, date: new Date(`${publishDate}T${publishTime}`) }); onClose(); }}
            className="px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
