# ThoughtStream Design System

**Minimal, zen, distraction-free design for contemplative digital experiences.**

## Overview

ThoughtStream is a contemplative design system built for minimalist personal blogs and newsletters. It embraces generous white space as a design element, letting words breathe and ideas settle. The warm, neutral palette recedes behind content, creating a reading experience that feels like a well-set page in a quiet room.

## Core Principles

### Do's
✅ **Let white space dominate** - margins and padding should feel generous and contemplative
✅ **Keep headlines in Libre Baskerville** for literary warmth; never use it for UI labels
✅ **Use #E7E5E4 hairline borders** to separate sections instead of shadows or color blocks
✅ **Set body text at 17px or above** with 1.8 line height for comfortable long-form reading
✅ **Maintain maximum content width of 680px** for body text to preserve optimal reading measure
✅ **Favor vertical rhythm** aligned to the 12px base unit across all spacing decisions

### Don'ts
❌ **Add decorative elements, gradients, or illustrations** that compete with the text
❌ **Use more than two font weights** on a single screen - restraint is the ethos
❌ **Use color to convey meaning alone** - pair with text or icons for accessibility
❌ **Introduce rounded corners** - sharp edges reinforce the clean geometric identity

## Color Palette

### Brand Colors
- **Primary (Stone)**: `#78716C` - anchors UI elements, links, icons
- **Secondary (Sage)**: `#A8A29E` - supporting accents, dividers
- **Tertiary (Warm Black)**: `#1C1917` - emphasis, strong headings

### Surface Colors
- **Background**: `#FAFAF9` - warm white page background
- **Surface**: `#F5F5F4` - card and section backgrounds
- **Surface Raised**: `#EFEDEB` - hover states, subtle callout blocks

### Content Colors
- **Text Primary**: `#1C1917` - body copy, headings
- **Text Secondary**: `#57534E` - bylines, metadata, captions
- **Text Tertiary**: `#A8A29E` - placeholders, disabled labels

### Border Colors
- **Border Subtle**: `#E7E5E4`
- **Border Medium**: `#D6D3D1`
- **Border Strong**: `#A8A29E`

### Semantic Colors
- **Success**: `#65A30D`
- **Warning**: `#CA8A04`
- **Error**: `#DC2626`
- **Info**: `#78716C`

## Typography

### Font Stack
- **Display/Headings**: Libre Baskerville, Georgia, 'Times New Roman', serif
- **UI/Body**: Inter, -apple-system, 'Segoe UI', Helvetica, sans-serif
- **Mono/Code**: Source Code Pro, 'Fira Code', Consolas, monospace

### Type Scale

| Level        | Font              | Size   | Weight | Line Height | Letter Spacing | Usage                        |
|--------------|-------------------|--------|--------|-------------|----------------|------------------------------|
| Display      | Libre Baskerville | 40px   | 700    | 1.2         | -0.02em        | Hero article titles          |
| Headline     | Libre Baskerville | 30px   | 700    | 1.3         | -0.015em       | Post titles                  |
| Subhead      | Libre Baskerville | 22px   | 400    | 1.4         | -0.01em        | Section headings             |
| Body Large   | Inter             | 20px   | 400    | 1.75        | 0              | Featured paragraph, lede     |
| Body         | Inter             | 17px   | 400    | 1.8         | 0              | Default reading text         |
| Body Small   | Inter             | 15px   | 400    | 1.7         | 0              | Sidebar text, footnotes      |
| Caption      | Inter             | 13px   | 400    | 1.5         | 0.01em         | Image captions, dates        |
| Overline     | Inter             | 11px   | 600    | 1.4         | 0.08em         | Category labels              |
| Code         | Source Code Pro   | 15px   | 400    | 1.7         | 0              | Inline code, code blocks     |

## Spacing System

- **Base unit**: 12px
- **Scale**: 12, 24, 36, 48, 60, 72, 96, 120px
- **Component padding**: small (12px), medium (24px), large (48px)
- **Section spacing**: mobile (60px), tablet (84px), desktop (120px)

## Border Radius

ThoughtStream uses **sharp edges only** (0px radius) for all elements except avatars:
- **None/Small/Medium/Large/XL**: 0px
- **Full**: 9999px (avatars only)

## Shadows

**Philosophy**: ThoughtStream is completely flat. No shadows are used. Separation is achieved exclusively through borders and white space.

- **Focus Ring**: `0 0 0 2px #FAFAF9, 0 0 0 4px #78716C`

## Components

### Buttons

**Primary**
- Background: `#78716C`
- Text: `#FAFAF9`
- Border: `1px solid #78716C`
- Padding: 12px 24px
- Font: Inter, 15px, weight 600
- Radius: 0px
- Hover: Background `#57534E`
- Active: Background `#44403C`

**Secondary**
- Background: transparent
- Text: `#78716C`
- Border: `1px solid #D6D3D1`
- Padding: 12px 24px
- Font: Inter, 15px, weight 600
- Radius: 0px
- Hover: Background `#F5F5F4`
- Active: Background `#E7E5E4`

**Ghost**
- Background: transparent
- Text: `#78716C`
- Border: none
- Padding: 12px 24px
- Font: Inter, 15px, weight 600
- Radius: 0px
- Hover: Background `#F5F5F4`
- Active: Background `#E7E5E4`

**Destructive**
- Background: `#DC2626`
- Text: `#FAFAF9`
- Border: `1px solid #DC2626`
- Padding: 12px 24px
- Font: Inter, 15px, weight 600
- Radius: 0px
- Hover: Background `#B91C1C`
- Active: Background `#991B1B`

### Cards

**Default**
- Background: `#FAFAF9`
- Border: `1px solid #E7E5E4`
- Radius: 0px
- Padding: 36px
- Shadow: none
- Hover: Border `#D6D3D1`

**Elevated**
- Background: `#F5F5F4`
- Border: `1px solid #D6D3D1`
- Radius: 0px
- Padding: 36px
- Shadow: none

### Inputs

**Text Input**
- Height: 48px
- Background: `#FAFAF9`
- Border: `1px solid #D6D3D1`
- Radius: 0px
- Padding: 12px 16px
- Font: Inter, 15px, weight 400
- Text color: `#1C1917`
- Placeholder color: `#A8A29E`
- Focus: Border `#78716C`, ring `0 0 0 2px #FAFAF9, 0 0 0 4px #78716C`
- Error: Border `#DC2626`
- Disabled: Background `#F5F5F4`, opacity 0.5

## Usage Examples

### Typography
```jsx
// Heading 1
<h1 className="text-display font-heading font-bold text-text-primary">
  Main Title
</h1>

// Heading 2
<h2 className="text-headline font-heading font-bold text-text-primary">
  Section Title
</h2>

// Body text
<p className="text-body text-text-primary leading-relaxed">
  Body content goes here...
</p>
```

### Buttons
```jsx
import { Button } from "@/components/ui/button"

<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="destructive">Delete</Button>
```

### Cards
```jsx
div className="border border-border-subtle bg-background p-9 hover:border-border-medium">
  Card content
</div>

<div className="border border-border-medium bg-surface p-9">
  Elevated card content
</div>
```

### Layout
```jsx
<div className="max-w-content mx-auto px-6 py-section-desktop">
  <div className="mb-10">
    <h1 className="text-display font-heading font-bold mb-6">Article Title</h1>
    <p className="text-body text-text-primary leading-relaxed">
      Article content...
    </p>
  </div>
</div>
```

## Implementation Notes

1. **Font Loading**: Ensure Libre Baskerville and Inter are properly loaded in your application
2. **Dark Mode**: ThoughtStream is designed primarily for light mode, but includes basic dark mode adaptations
3. **Accessibility**: All interactive elements should have proper focus states and keyboard navigation
4. **Responsive Design**: Use the spacing scale appropriately for different screen sizes

## Migration Guide

If migrating from an existing design system:

1. Replace all rounded corners with sharp edges (0px radius)
2. Update color palette to ThoughtStream colors
3. Replace shadows with borders for separation
4. Adjust typography to use Libre Baskerville for headings and Inter for body
5. Ensure content containers have max-width of 680px for optimal reading
6. Update spacing to use the 12px base unit scale