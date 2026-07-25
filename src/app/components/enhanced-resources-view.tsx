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
  transcribed: boolean;
  wordCount?: number;
  duration?: string;
  thumbnail?: string | null;
  tags: string[];
  videoUrl?: string;
  fullText?: string;
  transcription?: string;
  summary?: string;
  usedCount?: number;
}

const RESOURCES: Resource[] = [
  {
    id: '1',
    name: 'Yoga Session Recording.mp4',
    type: 'video',
    size: '245 MB',
    uploadedDate: '2 hours ago',
    transcribed: true,
    wordCount: 3420,
    duration: '45:32',
    thumbnail: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&h=450&fit=crop',
    tags: ['yoga', 'wellness', 'tutorial'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    summary: `This 45-minute yoga session covers foundational poses for beginners and intermediate practitioners. The instructor guides through a complete flow starting with breathing exercises, progressing through sun salutations, warrior sequences, and closing with restorative poses and meditation. Key themes include breath-body connection, alignment principles, and mindfulness throughout movement. The session is suitable for all levels with modifications offered throughout.`,
    transcription: `[00:00] Welcome everyone to today's yoga session. I'm so glad you're here with me. Before we begin, let's take a moment to find our comfortable seated position.

[00:45] Take a deep breath in through the nose... and exhale slowly through the mouth. Feel your spine lengthen with each inhale, and release any tension with each exhale.

[02:10] We'll start today with three rounds of sun salutations to warm up the body. Begin in mountain pose — feet hip-width apart, arms at your sides, gaze forward.

[05:30] Inhale, sweep your arms overhead into upward salute. Exhale, forward fold — bend the knees if needed. Inhale, halfway lift, hands to shins. Exhale, step or hop back to plank.

[08:15] From plank, lower to chaturanga, keeping elbows close to the body. Inhale into upward-facing dog. Exhale into downward-facing dog. Hold here for five breaths.

[12:00] Let's move into our warrior sequence. Step your right foot forward between your hands. Rise up into Warrior One. Feel the strength in your legs, the openness in your chest.

[15:45] Transition to Warrior Two — open your hips to the side, arms extended, gaze over your front fingertips. Hold for five breaths. Feel the power in this pose.

[20:30] Beautiful. Now let's flow into triangle pose. Straighten your front leg, reach your front arm long, then hinge at the hip and lower your hand to your shin or the floor.

[28:00] We'll now move into our floor sequence. Come down to hands and knees for cat-cow. Inhale, drop the belly, lift the gaze — cow pose. Exhale, round the spine to the sky — cat pose.

[35:20] Slowly come to lie on your back. We'll close with a supported bridge pose. Place your feet flat on the mat, hip-width apart. Inhale, press into your feet and lift your hips.

[41:00] Finally, we arrive at savasana — the most important pose of our practice. Allow your body to fully relax into the mat. Let go of any effort. Simply be.

[44:30] Begin to deepen your breath. Gently wiggle your fingers and toes. When you're ready, roll to your right side. Take a moment here before pressing up to seated.

[45:32] Namaste. Thank you for sharing your practice with me today. I'll see you next time.`,
  },
  {
    id: '2',
    name: 'Brand Guidelines 2026.pdf',
    type: 'document',
    size: '2.1 MB',
    uploadedDate: '3 days ago',
    transcribed: true,
    wordCount: 5200,
    thumbnail: null,
    tags: ['brand', 'guidelines'],
    summary: `The Brand Guidelines 2026 document establishes the visual and verbal identity standards for all company communications. It covers logo usage rules, color palette with exact hex values, typography hierarchy using Inter and Playfair Display, photography style, tone of voice principles, and do's and don'ts for brand application across digital and print media. The guidelines emphasize authenticity, inclusivity, and a premium yet accessible aesthetic.`,
    fullText: `BRAND GUIDELINES 2026
Official Brand Identity Standards

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 1 — OUR BRAND STORY

Our brand was founded on the belief that exceptional design and authentic storytelling can move people. Every touchpoint — from a social post to a product package — is an opportunity to reinforce who we are and what we stand for.

We exist to empower creators, athletes, and thinkers to reach their fullest potential. Our visual identity reflects this ambition: bold, clean, and purposeful.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 2 — LOGO USAGE

The primary logo consists of the wordmark accompanied by the emblem. It must always appear in one of three approved configurations:
  • Full lockup (emblem + wordmark) — preferred for most uses
  • Wordmark only — for text-heavy contexts
  • Emblem only — for small-format or icon applications

Minimum size: 24px height for digital, 8mm for print.

Clear space: Maintain a minimum clear space equal to the height of the letter "O" in the wordmark on all sides.

PROHIBITED USES:
  ✗ Do not stretch or distort the logo
  ✗ Do not apply drop shadows or effects
  ✗ Do not use unapproved color variations
  ✗ Do not place on low-contrast backgrounds

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 3 — COLOR PALETTE

PRIMARY COLORS:
  Brand Green    #10B981    RGB(16, 185, 129)
  Off-Black      #0A0A0A    RGB(10, 10, 10)
  White          #FAFAFA    RGB(250, 250, 250)

SECONDARY COLORS:
  Warm Amber     #F59E0B    RGB(245, 158, 11)
  Electric Blue  #3B82F6    RGB(59, 130, 246)
  Coral Red      #EF4444    RGB(239, 68, 68)

USAGE RATIOS:
  Brand Green and Off-Black should comprise 70% of any composition.
  Secondary colors should be used as accents, never as primary backgrounds.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 4 — TYPOGRAPHY

PRIMARY TYPEFACE: Inter
  Used for all body copy, UI elements, captions, and functional text.
  Weights in use: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

DISPLAY TYPEFACE: Playfair Display
  Reserved for headlines, pull quotes, and premium editorial contexts.
  Weights in use: 700 (Bold), 900 (Black)

SCALE:
  Display XL   —  72px / Line height 1.1 / Letter spacing -0.03em
  Display      —  48px / Line height 1.2 / Letter spacing -0.02em
  H1           —  36px / Line height 1.3 / Letter spacing -0.01em
  H2           —  28px / Line height 1.4
  H3           —  22px / Line height 1.5
  Body Large   —  18px / Line height 1.7
  Body         —  16px / Line height 1.6
  Caption      —  12px / Line height 1.5

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 5 — TONE OF VOICE

Our brand voice is: Confident · Human · Purposeful · Inclusive

CONFIDENT but not arrogant. We speak with authority because we know our craft. We don't hedge or over-qualify.

HUMAN but not casual. We sound like a knowledgeable friend, not a corporate brochure — but we maintain professionalism.

PURPOSEFUL but not preachy. Every word earns its place. We have a point of view and express it clearly without lecturing.

INCLUSIVE but not generic. We celebrate diversity and speak to everyone without becoming bland or non-committal.

WRITING PRINCIPLES:
  • Lead with the benefit, not the feature
  • Use active voice
  • Avoid jargon unless writing for a technical audience
  • Short sentences outperform long ones
  • End with a clear call to action when appropriate`,
  },
  {
    id: '3',
    name: 'Previous Blog Posts Collection',
    type: 'text',
    size: '840 KB',
    uploadedDate: '1 week ago',
    transcribed: true,
    wordCount: 12500,
    thumbnail: null,
    tags: ['blog', 'reference'],
    summary: `A curated collection of 24 high-performing blog posts from the past 18 months. Topics span product launches, athlete spotlights, training methodology, nutrition science, and brand culture pieces. The collection reveals consistent themes: personal transformation stories drive the highest engagement, technical content performs best when anchored with real-world examples, and posts with embedded video see 3x longer time-on-page. Average length: 520 words. Top performer: "From Couch to 5K: Maya's Story" with 48,000 views.`,
    fullText: `BLOG POSTS COLLECTION — REFERENCE ARCHIVE
24 Posts · 18 Months · 12,500 Words

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

POST #1 — Published Jan 12, 2025
"Why Your Morning Run Sets the Tone for Everything"
Category: Training · Words: 480

The alarm goes off at 5:47 AM. It's dark outside. Your bed is warm. Every rational part of your brain tells you to stay put. But you lace up anyway. That decision — made before the world wakes up — is the most important choice you'll make all day.

Research from the University of Bristol found that people who exercise in the morning report 41% better mood and 65% higher energy throughout the day compared to non-exercisers. But what the data doesn't capture is the psychological edge: the quiet knowledge that you've already done something hard before breakfast.

The morning run isn't about pace. It's about precedent. When you commit to discomfort early, the rest of the day's challenges feel smaller by comparison. The difficult email becomes easier. The tense meeting becomes manageable. The hard conversation becomes possible.

Here's how to build a morning running habit that sticks...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

POST #2 — Published Feb 3, 2025
"From Couch to 5K: Maya's Story"
Category: Athlete Spotlight · Words: 620 · Views: 48,200

Eighteen months ago, Maya couldn't run to the end of her block without stopping. Today, she finished her first half-marathon in 2:14:33, placing in the top third of her age group.

"I never thought of myself as a runner," she says, sitting across from me at a coffee shop, her calves still carrying the memory of Sunday's race. "I was the person who drove past runners and thought: I could never do that."

What changed? Not talent. Not circumstance. She simply started smaller than she thought possible...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

POST #3 — Published Mar 18, 2025
"The Science Behind Recovery: Why Rest Days Aren't Optional"
Category: Training Science · Words: 540

We've built a culture that glorifies the grind. "No days off" has become a badge of honor. But sports science is unequivocal: without adequate recovery, you're not building fitness — you're accumulating debt.

During exercise, you're creating micro-tears in muscle tissue. The adaptation — the strength gain, the speed improvement — happens during recovery, not during the workout itself. Skip recovery and you skip the gains.

The optimal recovery protocol depends on training volume and intensity, but universal principles apply: 7-9 hours of sleep, adequate protein (1.6-2.2g per kg of bodyweight), active recovery movement, and mental decompression...`,
  },
  {
    id: '4',
    name: 'Product Demo Video',
    type: 'video',
    size: '180 MB',
    uploadedDate: '1 week ago',
    transcribed: true,
    wordCount: 2100,
    duration: '28:15',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
    tags: ['product', 'demo'],
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    summary: `A 28-minute walkthrough of the platform's core features aimed at enterprise decision-makers. Covers onboarding flow, content calendar management, AI generation workflows, team collaboration tools, analytics dashboard, and integration capabilities. The presenter demonstrates three real-world use cases: a solo creator, a marketing team of 5, and an agency managing 12 clients. Strong emphasis on time-savings and ROI metrics throughout.`,
    transcription: `[00:00] Thanks for joining this product demo. Today I'm going to show you how our platform can transform your content operation from reactive to proactive.

[01:30] Let me start with the content calendar — this is where most teams spend the majority of their time. You can see we have a month view here, and every content piece is color-coded by campaign and funnel stage.

[05:00] The AI generation workflow is where things get really interesting. I'll click "Create Content" and select a topic. Watch how the system pulls context from your brand guidelines, previous content, and target audience profile...

[09:45] For teams, the collaboration features are essential. You can assign content to specific writers, set review deadlines, and track approval status all in one place. No more digging through email chains.

[15:20] The analytics dashboard gives you real-time performance data across all your channels. You can see what's working, identify content gaps, and get AI-powered recommendations for your next campaign.

[22:00] Let me show you the integrations panel. We connect natively with HubSpot, Salesforce, WordPress, and all major social platforms. Content published here syncs automatically.

[27:00] To summarize: most teams using our platform report saving 12-15 hours per week on content operations, and see a 40% improvement in content consistency within the first 90 days.

[28:15] Questions? I'm happy to walk through anything in more detail or set up a tailored demo for your specific use case.`,
  },
  {
    id: '5',
    name: 'Instagram Post - Feb Campaign',
    type: 'image',
    size: '1.2 MB',
    uploadedDate: '2 weeks ago',
    transcribed: false,
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=800&fit=crop',
    tags: ['social', 'campaign'],
    usedCount: 7,
  },
  {
    id: '6',
    name: 'Air Max Launch - Hero Graphic',
    type: 'image',
    size: '1.8 MB',
    uploadedDate: '3 weeks ago',
    transcribed: false,
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=450&fit=crop',
    tags: ['social', 'launch'],
    usedCount: 4,
  },
  {
    id: '7',
    name: 'Athlete Portrait - Studio Cut',
    type: 'image',
    size: '2.2 MB',
    uploadedDate: '1 month ago',
    transcribed: false,
    thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=450&fit=crop',
    tags: ['athlete', 'portrait'],
    usedCount: 2,
  },
  {
    id: '8',
    name: 'Summer Drop - Quote Card',
    type: 'image',
    size: '620 KB',
    uploadedDate: '1 month ago',
    transcribed: false,
    thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&h=800&fit=crop',
    tags: ['quote', 'social'],
    usedCount: 0,
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

const MOCK_CAMPAIGNS: Record<string, { name: string; color: string }[]> = {
  '1': [{ name: 'Amrit Yoga Q2', color: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' }],
  '2': [{ name: 'Nike Summer Drop', color: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20' }, { name: 'Brand Awareness Q2', color: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20' }],
  '3': [{ name: 'Retention Drive', color: 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20' }],
  '4': [{ name: 'Nike Summer Drop', color: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20' }],
  '5': [],
};

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

  const campaigns = MOCK_CAMPAIGNS[resource.id] ?? [];

  /* ── LEFT: primary media ────────────────────────────────────────────── */
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

    // document / text — show styled preview
    return (
      <div className="w-full h-full rounded-xl border border-border bg-[#0D0D0D] overflow-hidden flex flex-col">
        {/* fake document chrome */}
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
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 flex-shrink-0 w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Resources
      </button>

      {/* Two-column body */}
      <div className="flex gap-6 flex-1 min-h-0">

        {/* ── LEFT COLUMN ~60% ─────────────────────────────────────────── */}
        <div className="flex-[3] flex flex-col min-h-0 gap-4">
          <MediaPanel />

          {/* Below media: summary (for video/image, show it here) */}
          {resource.summary && (resource.type === 'video' || resource.type === 'image') && (
            <div className="bg-card border border-border rounded-xl p-5 flex-shrink-0">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Summary</p>
              <p className="text-sm text-foreground leading-relaxed">{resource.summary}</p>
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN ~40% ────────────────────────────────────────── */}
        <div className="flex-[2] flex flex-col min-h-0 overflow-y-auto gap-5 pr-1">

          {/* Title + badges */}
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

          {/* Downloads */}
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

          {/* Transcription / content text */}
          {(resource.transcription || resource.fullText) && (
            <div className="flex-shrink-0">
              {/* Tab toggle */}
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

          {/* Metadata */}
          <div className="flex-shrink-0">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Details</p>
            <div className="bg-card border border-border rounded-xl divide-y divide-border">
              {[
                { label: 'File size', value: resource.size },
                { label: 'Uploaded', value: resource.uploadedDate },
                ...(resource.duration ? [{ label: 'Duration', value: resource.duration }] : []),
                ...(resource.wordCount ? [{ label: 'Word count', value: resource.wordCount.toLocaleString() }] : []),
                { label: 'Type', value: resource.type.charAt(0).toUpperCase() + resource.type.slice(1) },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-foreground font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
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

          {/* Associated campaigns */}
          <div className="flex-shrink-0 pb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Associated Campaigns</p>
            {campaigns.length === 0 ? (
              <p className="text-xs text-muted-foreground/60 italic">Not linked to any campaign</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {campaigns.map(c => (
                  <span key={c.name} className={`px-2.5 py-1 rounded-lg border text-xs font-medium ${c.color}`}>
                    {c.name}
                  </span>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Delete action — bottom of right column reached via scroll, but keep accessible */}
      <div className="flex-shrink-0 pt-4 flex justify-end border-t border-border mt-4">
        <button className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
          Delete resource
        </button>
      </div>
    </div>
  );
}


export function EnhancedResourcesView() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

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
      case 'video': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'document':
      case 'text': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'image': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const filteredResources =
    activeFilter === 'all'
      ? RESOURCES
      : RESOURCES.filter((r) =>
          activeFilter === 'document' ? (r.type === 'document' || r.type === 'text') : r.type === activeFilter
        );

  if (selectedResource) {
    return <ResourceDetail resource={selectedResource} onBack={() => setSelectedResource(null)} />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Resource Library</h1>
              <p className="text-muted-foreground">
                Upload files and URLs that can be used as reference for content generation
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              Add Resources
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total Resources', value: RESOURCES.length, icon: FileText },
              { label: 'Transcribed', value: RESOURCES.filter((r) => r.transcribed).length, icon: Clock },
              { label: 'Total Words', value: RESOURCES.reduce((sum, r) => sum + (r.wordCount || 0), 0).toLocaleString(), icon: FileText },
              { label: 'Storage Used', value: '430 MB', icon: Upload },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters & Search */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex items-center gap-2 p-1 bg-card rounded-lg border border-border">
            {[
              { value: 'all', label: 'All', count: RESOURCES.length },
              { value: 'video', label: 'Videos', count: RESOURCES.filter((r) => r.type === 'video').length },
              { value: 'document', label: 'Documents', count: RESOURCES.filter((r) => r.type === 'document' || r.type === 'text').length },
              { value: 'image', label: 'Images', count: RESOURCES.filter((r) => r.type === 'image').length },
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
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
            const TypeIcon = getTypeIcon(resource.type);
            return (
              <div
                key={resource.id}
                onClick={() => setSelectedResource(resource)}
                className="bg-card border border-border rounded-xl hover:shadow-lg hover:shadow-primary/10 transition-all group cursor-pointer hover:border-primary/30 relative"
              >
                {/* Thumbnail/Preview */}
                <div className="relative h-40 bg-secondary overflow-hidden rounded-t-xl">
                  {resource.thumbnail ? (
                    <>
                      <img
                        src={resource.thumbnail}
                        alt={resource.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {resource.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                            <Play className="w-5 h-5 text-white ml-0.5" />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <TypeIcon className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3">
                    <div className={`px-2.5 py-1 rounded-md border text-xs font-medium backdrop-blur-sm ${getTypeColor(resource.type)}`}>
                      {resource.type}
                    </div>
                  </div>

                  {resource.transcribed && (
                    <div className="absolute bottom-3 right-3">
                      <div className="px-2 py-1 bg-success/20 backdrop-blur-sm border border-success/30 rounded-md text-xs text-success font-medium">
                        Transcribed
                      </div>
                    </div>
                  )}

                  {/* Previously-used indicator — images only, usedCount > 0 */}
                  {resource.type === 'image' && (resource.usedCount ?? 0) > 0 && (
                    <div className="absolute top-3 right-3 group/used">
                      <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm border border-white/10 text-white/80 text-[10px] font-semibold cursor-default select-none">
                        <RefreshCw className="w-2.5 h-2.5 flex-shrink-0" />
                        Used {resource.usedCount}×
                      </div>
                      {/* Tooltip */}
                      <div className="pointer-events-none absolute top-full right-0 mt-1.5 z-50 opacity-0 group-hover/used:opacity-100 transition-opacity duration-150">
                        <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
                          <p className="text-xs font-semibold text-foreground">
                            Previously used in {resource.usedCount} content {resource.usedCount === 1 ? 'item' : 'items'}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Reuse is still allowed</p>
                        </div>
                        <div className="absolute right-3 bottom-full w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-border" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Resource Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-foreground truncate text-sm" title={resource.name}>
                      {resource.name}
                    </h3>
                    <CardMenu resource={resource} />
                  </div>

                  <div className="space-y-1.5 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center justify-between">
                      <span>Size: {resource.size}</span>
                      {resource.duration && <span>{resource.duration}</span>}
                    </div>
                    {resource.wordCount && (
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>{resource.wordCount.toLocaleString()} words</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Uploaded {resource.uploadedDate}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {resource.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-secondary rounded-md text-xs text-muted-foreground">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Upload Modal */}
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
    </div>
  );
}
