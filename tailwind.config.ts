import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ThoughtStream Colors
      colors: {
        // Brand Palette
        primary: '#78716C', // Stone
        secondary: '#A8A29E', // Sage
        tertiary: '#1C1917', // Warm Black

        // Surface Palette
        background: '#FAFAF9', // Warm white page background
        surface: '#F5F5F4', // Card and section backgrounds
        'surface-raised': '#EFEDEB', // Hover states, subtle callout blocks

        // Content Palette
        'text-primary': '#1C1917', // Body copy, headings
        'text-secondary': '#57534E', // Bylines, metadata, captions
        'text-tertiary': '#A8A29E', // Placeholders, disabled labels

        // Border Palette
        'border-subtle': '#E7E5E4',
        'border-medium': '#D6D3D1',
        'border-strong': '#A8A29E',

        // Semantic Colors
        success: '#65A30D',
        warning: '#CA8A04',
        error: '#DC2626',
        info: '#78716C',
      },

      // ThoughtStream Typography
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Helvetica', 'sans-serif'],
        serif: ['Libre Baskerville', 'Georgia', 'Times New Roman', 'serif'],
        mono: ['Source Code Pro', 'Fira Code', 'Consolas', 'monospace'],
        heading: ['Libre Baskerville', 'Georgia', 'Times New Roman', 'serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Helvetica', 'sans-serif'],
      },

      // ThoughtStream Spacing - 12px base unit
      spacing: {
        '0': '0px',
        '1': '12px', // 1 unit
        '2': '24px', // 2 units
        '3': '36px', // 3 units
        '4': '48px', // 4 units
        '5': '60px', // 5 units
        '6': '72px', // 6 units
        '8': '96px', // 8 units
        '10': '120px', // 10 units
      },

      // ThoughtStream Border Radius - sharp edges only
      borderRadius: {
        'none': '0px',
        'sm': '0px',
        'md': '0px',
        'lg': '0px',
        'xl': '0px',
        '2xl': '0px',
        '3xl': '0px',
        'full': '9999px', // Only for avatars
      },

      // ThoughtStream Typography Scale
      fontSize: {
        'display': ['40px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline': ['30px', { lineHeight: '1.3', letterSpacing: '-0.015em', fontWeight: '700' }],
        'subhead': ['22px', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '400' }],
        'body-large': ['20px', { lineHeight: '1.75', fontWeight: '400' }],
        'body': ['17px', { lineHeight: '1.8', fontWeight: '400' }],
        'body-small': ['15px', { lineHeight: '1.7', fontWeight: '400' }],
        'caption': ['13px', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '400' }],
        'overline': ['11px', { lineHeight: '1.4', letterSpacing: '0.08em', fontWeight: '600' }],
        'code': ['15px', { lineHeight: '1.7', fontWeight: '400' }],
      },

      // ThoughtStream Content Width
      maxWidth: {
        'content': '680px',
      },
    },
  },
  plugins: [],
}

export default config