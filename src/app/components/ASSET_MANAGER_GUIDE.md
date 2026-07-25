# Asset Manager - Complete Guide

## Overview

The Asset Manager provides three distinct methods for adding visual assets to content items:

1. **Upload** - Traditional file upload with drag-and-drop
2. **Generate with AI** - AI-powered image generation from text descriptions
3. **Use Template** - Pre-designed templates organized by format

## Features

### ✅ Upload
- Drag-and-drop file upload zone
- Multiple file support for carousel content
- File type validation and size limits (10MB)
- Thumbnail previews with file info
- Drag-to-reorder (for carousels)
- Individual file removal
- Supported formats: JPG, PNG, WebP, MP4, PDF, MP3

### ✅ AI Generation
- Text-to-image generation interface
- Descriptive prompt input
- Preview before applying
- "Generate Another" option
- Result inspection and approval
- Note: MVP UI layout ready for AI integration

### ✅ Templates
- Gallery view of saved templates
- Category filtering (Instagram Square, Story, Blog Header, etc.)
- Size information for each template
- Hover preview with dimensions
- Quick template application

### ✅ Preview
- Content-specific preview formats:
  - **Social Post**: Square image with text caption
  - **Blog Post**: Header image with article layout
  - **Carousel**: Multi-image slider with counter
  - **Video Script**: (Custom layout as needed)

## Component API

### Import

```tsx
import { AssetManager } from './components/asset-manager';
```

### Props

```tsx
interface AssetManagerProps {
  contentType: 'blog-post' | 'social-post' | 'carousel' | 'video-script';
  currentAsset: Asset | null;
  onAssetChange: (asset: Asset | null) => void;
  contentText?: string; // For preview display
}

interface Asset {
  id: string;
  source: 'upload' | 'ai-generated' | 'template';
  url: string;
  type: 'image' | 'video' | 'document' | 'audio';
  metadata?: {
    prompt?: string;           // For AI-generated
    templateId?: string;       // For templates
    files?: UploadedFile[];    // For uploads
  };
}
```

## Usage Examples

### Basic Implementation

```tsx
import { useState } from 'react';
import { AssetManager } from './components/asset-manager';

function ContentEditor() {
  const [asset, setAsset] = useState<Asset | null>(null);
  
  return (
    <div className="content-editor">
      <h2>Add Visual Asset</h2>
      
      <AssetManager
        contentType="social-post"
        currentAsset={asset}
        onAssetChange={setAsset}
        contentText="Your content text goes here..."
      />
      
      {asset && (
        <div>
          <p>Asset selected: {asset.source}</p>
          <p>Type: {asset.type}</p>
        </div>
      )}
    </div>
  );
}
```

### Blog Post with Header Image

```tsx
function BlogPostEditor() {
  const [headerImage, setHeaderImage] = useState<Asset | null>(null);
  const [content, setContent] = useState('');
  
  return (
    <div>
      <AssetManager
        contentType="blog-post"
        currentAsset={headerImage}
        onAssetChange={setHeaderImage}
        contentText={content}
      />
    </div>
  );
}
```

### Carousel with Multiple Images

```tsx
function CarouselEditor() {
  const [carouselAssets, setCarouselAssets] = useState<Asset | null>(null);
  
  return (
    <div>
      <AssetManager
        contentType="carousel"
        currentAsset={carouselAssets}
        onAssetChange={setCarouselAssets}
        contentText="Swipe through these amazing tips!"
      />
      
      {/* Carousel supports multiple files */}
      {carouselAssets?.metadata?.files && (
        <p>
          {carouselAssets.metadata.files.length} images uploaded
        </p>
      )}
    </div>
  );
}
```

## User Workflows

### Workflow 1: Upload a File

1. User sees three options: Upload, Generate with AI, Use Template
2. User drags file into upload zone (or clicks to browse)
3. File is validated (size, type)
4. Thumbnail preview appears
5. Preview shows content with asset
6. User can remove and replace if needed

### Workflow 2: Generate with AI

1. User clicks "Generate with AI"
2. Modal opens with text input
3. User describes desired image:
   ```
   "A photo of a woman doing yoga on a beach at sunset, 
   professional photography, soft lighting"
   ```
4. User clicks "Generate Image"
5. Loading state shows (3-second simulation)
6. Generated image appears
7. User can:
   - "Use This Image" → applies to content
   - "Generate Another" → tries different prompt
8. Preview updates with AI-generated image

### Workflow 3: Use Template

1. User clicks "Use Template"
2. Modal opens showing template gallery
3. User filters by category (Instagram Square, Blog Header, etc.)
4. User hovers to see template details
5. User clicks to select template
6. Template applied to content
7. Preview shows template with content text

### Workflow 4: Multiple Files (Carousel)

1. User selects carousel content type
2. Upload zone accepts multiple files
3. Files appear as horizontal thumbnail row
4. User can:
   - Drag thumbnails to reorder
   - Click X to remove individual files
   - Add more files
5. Preview shows first image with "1 / X" counter

## Content Type Behavior

### Social Post (`social-post`)
- Single image/video
- Square preview format
- Caption below image
- Instagram-style layout

### Blog Post (`blog-post`)
- Featured image
- Article header layout
- Title + content preview
- Wide aspect ratio

### Carousel (`carousel`)
- Multiple images supported
- Drag-to-reorder thumbnails
- Swipeable preview
- Image counter (1/5, 2/5, etc.)

### Video Script (`video-script`)
- Single video or image
- Custom preview layout
- Script text integration

## File Validation

### Size Limits
- Maximum: 10MB per file
- Validation occurs on drop/select
- User receives alert if file too large

### Supported Formats

**Images:**
- JPG, JPEG
- PNG
- WebP
- SVG (optional)

**Videos:**
- MP4
- WebM
- MOV

**Documents:**
- PDF
- DOC, DOCX

**Audio:**
- MP3
- WAV
- M4A

### Validation Messages

```tsx
// File too large
"example.jpg exceeds 10MB limit"

// Invalid format
"File type not supported. Please upload JPG, PNG, WebP, MP4, PDF, or MP3"
```

## Asset Display

### Uploaded Files
```tsx
// Single file
<div className="thumbnail">
  <img src={file.url} />
  <div className="info">
    Image • 2.4 MB
  </div>
  <button className="remove">✕</button>
</div>

// Multiple files (carousel)
<div className="thumbnails">
  {files.map(file => (
    <div className="thumbnail" draggable>
      <GripIcon /> {/* Drag handle */}
      <img src={file.url} />
      <button className="remove">✕</button>
    </div>
  ))}
</div>
```

### AI Generated
```tsx
<div className="asset-info">
  <span className="badge">AI Generated</span>
  <p className="prompt">
    Prompt: "A photo of a woman doing yoga on a beach at sunset"
  </p>
</div>
```

### Template
```tsx
<div className="asset-info">
  <span className="badge">Template</span>
  <p className="template-name">
    Minimal Quote • Instagram Square • 1080×1080
  </p>
</div>
```

## Preview System

The preview updates automatically when an asset is selected, showing a realistic representation of the final output.

### Preview Layouts

**Social Post Preview:**
```tsx
<div className="social-preview">
  <div className="image-container">
    <img src={asset.url} />
  </div>
  <div className="caption">
    {contentText}
  </div>
</div>
```

**Blog Post Preview:**
```tsx
<div className="blog-preview">
  <div className="header-image">
    <img src={asset.url} />
  </div>
  <div className="content">
    <h3>Article Title</h3>
    <p>{contentText}</p>
  </div>
</div>
```

**Carousel Preview:**
```tsx
<div className="carousel-preview">
  <div className="image-container">
    <img src={files[0].url} />
    <div className="counter">1 / {files.length}</div>
  </div>
  <div className="caption">
    {contentText}
  </div>
</div>
```

## State Management

### Asset State

```tsx
const [asset, setAsset] = useState<Asset | null>(null);

// When user uploads
setAsset({
  id: '123',
  source: 'upload',
  url: 'blob:...',
  type: 'image',
  metadata: {
    files: [{
      id: '123',
      name: 'photo.jpg',
      size: 2400000,
      type: 'image/jpeg',
      url: 'blob:...',
    }]
  }
});

// When user generates with AI
setAsset({
  id: '456',
  source: 'ai-generated',
  url: 'https://...',
  type: 'image',
  metadata: {
    prompt: 'A photo of a woman doing yoga on a beach at sunset'
  }
});

// When user selects template
setAsset({
  id: '789',
  source: 'template',
  url: 'https://...',
  type: 'image',
  metadata: {
    templateId: 'minimal-quote-1'
  }
});
```

### Clearing Asset

```tsx
// User clicks "Remove" or "Clear All"
setAsset(null);
```

## Integration Points

### Content Creation Modal

```tsx
import { AssetManager } from './components/asset-manager';

function ContentCreationModal({ contentType }) {
  const [asset, setAsset] = useState(null);
  const [content, setContent] = useState('');
  
  return (
    <div className="modal">
      <h2>Create {contentType}</h2>
      
      {/* Content fields */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your content..."
      />
      
      {/* Asset Manager */}
      <AssetManager
        contentType={contentType}
        currentAsset={asset}
        onAssetChange={setAsset}
        contentText={content}
      />
      
      {/* Submit */}
      <button onClick={handleSubmit}>
        Create Content
      </button>
    </div>
  );
}
```

### Content Detail View

```tsx
function ContentDetailView({ contentId }) {
  const [content, setContent] = useState(/* load from API */);
  
  return (
    <div>
      <h1>Edit Content</h1>
      
      {/* Other fields */}
      
      <AssetManager
        contentType={content.type}
        currentAsset={content.asset}
        onAssetChange={(asset) => setContent({ ...content, asset })}
        contentText={content.text}
      />
    </div>
  );
}
```

## Styling & Theme

The component uses your existing Orcaru design tokens:

```css
/* Upload zone */
.upload-zone {
  border: 2px dashed var(--border);
  background: transparent;
  
  &:hover {
    border-color: var(--border-hover);
    background: var(--secondary-30);
  }
  
  &.dragging {
    border-color: var(--primary);
    background: var(--primary-5);
  }
}

/* Asset badges */
.asset-badge {
  background: var(--primary-10);
  color: var(--primary);
  border: 1px solid var(--primary-20);
}

/* Preview container */
.preview {
  background: linear-gradient(
    to bottom right,
    var(--secondary-50),
    var(--secondary-30)
  );
}
```

## AI Integration Notes

The AI generation UI is complete and ready for integration. To connect actual AI:

1. Replace the mock generation function
2. Add your AI API endpoint
3. Handle loading states
4. Process AI responses
5. Error handling for failures

Example integration:

```tsx
const handleGenerate = async (prompt: string) => {
  setIsGenerating(true);
  
  try {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
    
    const { imageUrl } = await response.json();
    setGeneratedUrl(imageUrl);
  } catch (error) {
    console.error('Generation failed:', error);
    alert('Failed to generate image');
  } finally {
    setIsGenerating(false);
  }
};
```

## Files Created

- `asset-manager.tsx` - Main component (800+ lines)
- `asset-manager-demo.tsx` - Demo implementation
- `ASSET_MANAGER_GUIDE.md` - This documentation

## Current Status

✅ Upload functionality - Complete
✅ AI generation UI - Complete (ready for API integration)
✅ Template gallery - Complete
✅ Multi-file support - Complete
✅ Drag-to-reorder - Complete
✅ Preview system - Complete
✅ File validation - Complete

## Next Steps

1. Integrate into content creation modals
2. Connect AI generation API
3. Load user's actual templates from database
4. Add template customization interface
5. Implement file persistence/storage
