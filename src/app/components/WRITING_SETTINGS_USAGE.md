# Writing Settings Section - Usage Guide

## Overview

The `WritingSettingsSection` component provides a reusable interface for managing writing settings across project defaults, campaign settings, and individual content creation. It implements mutually exclusive interaction logic between writer profiles and manual tone/level selection.

## Key Features

1. **Mutually Exclusive Modes**
   - Profile Mode: Writer profile selected → Tone/Level grayed out
   - Manual Mode: Tone/Level selected → Writer Profile grayed out

2. **Visual Feedback**
   - Disabled fields show reduced opacity and "cursor-not-allowed"
   - Helper text explains which mode is active
   - "Clear" button appears next to active selection

3. **Project-Level Protection**
   - Warns when changing profile affects existing drafts
   - Confirmation dialog with two options:
     - Apply to all existing drafts
     - Keep current profile for existing drafts

4. **Context-Specific Help**
   - Different help text for project/campaign/content contexts
   - Clear inheritance hierarchy explanation

## Import

```tsx
import { WritingSettingsSection, WritingSettings } from './components/writing-settings-section';
```

## Usage Examples

### 1. Project Defaults

```tsx
import { useState } from 'react';
import { WritingSettingsSection, WritingSettings } from './components/writing-settings-section';

function ProjectSettings() {
  const [writingSettings, setWritingSettings] = useState<WritingSettings>({
    writerProfile: 'Nike Athletic Team',
    writingTone: null,
    writingLevel: null,
    mode: 'profile',
  });

  const availableProfiles = [
    'Nike Athletic Team',
    'Friendly Customer Support',
    'Technical Documentation',
  ];

  const handleProjectLevelChange = (newProfile: string, applyToExisting: boolean) => {
    console.log(`Updating to "${newProfile}", apply to existing: ${applyToExisting}`);
    // Implement your update logic here
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-base font-semibold text-foreground mb-4">Writing Settings</h3>
      <WritingSettingsSection
        value={writingSettings}
        onChange={setWritingSettings}
        availableProfiles={availableProfiles}
        context="project"
        onProjectLevelChange={handleProjectLevelChange}
        existingDraftCount={47} // Number of existing drafts
      />
    </div>
  );
}
```

### 2. Campaign Settings

```tsx
function CampaignSettings() {
  const [writingSettings, setWritingSettings] = useState<WritingSettings>({
    writerProfile: null,
    writingTone: 'bold',
    writingLevel: 'intermediate',
    mode: 'manual',
  });

  const availableProfiles = ['Profile 1', 'Profile 2'];

  return (
    <WritingSettingsSection
      value={writingSettings}
      onChange={setWritingSettings}
      availableProfiles={availableProfiles}
      context="campaign"
      // No onProjectLevelChange needed for campaign context
      // No existingDraftCount needed for campaign context
    />
  );
}
```

### 3. Individual Content Creation

```tsx
function ContentCreationModal() {
  const [writingSettings, setWritingSettings] = useState<WritingSettings>({
    writerProfile: null,
    writingTone: null,
    writingLevel: null,
    mode: null, // No selection initially
  });

  const availableProfiles = ['Profile 1', 'Profile 2'];

  return (
    <WritingSettingsSection
      value={writingSettings}
      onChange={setWritingSettings}
      availableProfiles={availableProfiles}
      context="content"
    />
  );
}
```

## Props

### `WritingSettingsSectionProps`

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `WritingSettings` | Yes | Current writing settings state |
| `onChange` | `(settings: WritingSettings) => void` | Yes | Callback when settings change |
| `availableProfiles` | `string[]` | Yes | List of available writer profile names |
| `context` | `'project' \| 'campaign' \| 'content'` | Yes | Context where component is used |
| `onProjectLevelChange` | `(newProfile: string, applyToExisting: boolean) => void` | No | Callback for project-level profile changes (only needed for `context="project"`) |
| `existingDraftCount` | `number` | No | Number of existing drafts (only needed for `context="project"`) |

### `WritingSettings` Type

```tsx
interface WritingSettings {
  writerProfile: string | null;
  writingTone: WritingTone | null;
  writingLevel: WritingLevel | null;
  mode: 'profile' | 'manual' | null;
}

type WritingTone =
  | 'professional'
  | 'conversational'
  | 'authoritative'
  | 'friendly'
  | 'empathetic'
  | 'bold'
  | 'casual'
  | 'formal'
  | 'inspirational'
  | 'technical';

type WritingLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
```

## Interaction Logic

### Switching Between Modes

1. **Selecting a Writer Profile:**
   - Sets `mode: 'profile'`
   - Clears `writingTone` and `writingLevel`
   - Disables tone/level dropdowns
   - Shows "Clear" button next to Writer Profile

2. **Selecting Tone or Level:**
   - Sets `mode: 'manual'`
   - Clears `writerProfile`
   - Disables writer profile dropdown
   - Shows "Clear" button next to Tone dropdown

3. **Clearing Selection:**
   - Resets all fields to `null`
   - Sets `mode: null`
   - Enables all dropdowns

### Project-Level Changes

When changing the writer profile at the project level with existing drafts:

1. User selects a new writer profile
2. If `existingDraftCount > 0`, confirmation dialog appears
3. User chooses:
   - **Option 1**: Apply new profile to all existing drafts
   - **Option 2**: Keep current profile for existing drafts, use new for future content
4. `onProjectLevelChange` callback fires with user's choice
5. Parent component implements the update logic

## Context-Specific Help Text

The component automatically shows different help text based on context:

- **Project**: "These settings will be inherited by all new campaigns and content in this project."
- **Campaign**: "These settings will be inherited by all content items in this campaign. Overrides project defaults."
- **Content**: "These settings apply to this content item only. Overrides campaign and project defaults."

## Styling

The component uses your existing design tokens and matches the Orcaru design system:
- Dark mode compatible
- Green primary color (#10B981)
- Proper disabled states with reduced opacity
- Smooth transitions on mode changes
- Clear visual hierarchy

## Current Integration

✅ **Project Settings Panel** - Already integrated
- See `src/app/components/project-settings-panel.tsx`
- Includes project-level change confirmation

🔲 **Campaign Settings** - Ready to integrate
- Add to campaign creation/edit modal
- Use `context="campaign"`

🔲 **Content Creation** - Ready to integrate
- Add to SmartContentCreationModal
- Use `context="content"`

## Demo

To see the component in all three contexts, you can temporarily use the demo component:

```tsx
import { WritingSettingsDemo } from './components/writing-settings-demo';

// Add to your router or app
<WritingSettingsDemo />
```

The demo shows:
- Side-by-side comparison of all three contexts
- Current state display for debugging
- Usage instructions
