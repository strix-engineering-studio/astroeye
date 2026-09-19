# Strix

Strix Product Engineering Studio is a premium engineering-led company site focused on discovery, product systems, backend architecture, mobile experiences, AI-enabled workflows, and long-term technical partnership.

## Getting Started

Run the development server:

```bash
pnpm dev
```

Open <http://localhost:3000> in your browser.

## Project Notes

- The homepage is composed from shared sections in `components/sections/home-sections.tsx`.
- Design tokens, palette, and theme surfaces live in `app/globals.css`.
- Shared content, navigation, and case-study data live in `lib/site.ts`.
- Intake forms submit to `app/api/contact/route.ts`.
- The site uses Space Grotesk for headings, Manrope for body copy, and Geist Mono for code surfaces.

## Deployment

The site is designed for a dark-first premium presentation with a light theme fallback through the built-in toggle.
