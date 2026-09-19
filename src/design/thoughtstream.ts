// ThoughtStream Design System
// Minimal, zen, distraction-free design system

// Colors
export const thoughtstreamColors = {
  // Brand Palette
  primary: '#78716C', // Stone
  secondary: '#A8A29E', // Sage
  tertiary: '#1C1917', // Warm Black

  // Surface Palette
  background: '#FAFAF9', // Warm white page background
  surface: '#F5F5F4', // Card and section backgrounds
  surfaceRaised: '#EFEDEB', // Hover states, subtle callout blocks

  // Content Palette
  textPrimary: '#1C1917', // Body copy, headings
  textSecondary: '#57534E', // Bylines, metadata, captions
  textTertiary: '#A8A29E', // Placeholders, disabled labels

  // Border Palette
  borderSubtle: '#E7E5E4',
  borderMedium: '#D6D3D1',
  borderStrong: '#A8A29E',

  // Semantic Colors
  success: '#65A30D',
  warning: '#CA8A04',
  error: '#DC2626',
  info: '#78716C',

  // Focus Ring
  focusRing: '0 0 0 2px #FAFAF9, 0 0 0 4px #78716C'
}

// Typography
export const thoughtstreamTypography = {
  // Font Stack
  fontDisplay: 'Libre Baskerville, Georgia, "Times New Roman", serif',
  fontUI: 'Inter, -apple-system, "Segoe UI", Helvetica, sans-serif',
  fontMono: 'Source Code Pro, "Fira Code", Consolas, monospace',

  // Type Scale
  display: {
    fontFamily: 'Libre Baskerville, Georgia, "Times New Roman", serif',
    fontSize: '40px',
    fontWeight: '700',
    lineHeight: '1.2',
    letterSpacing: '-0.02em'
  },
  headline: {
    fontFamily: 'Libre Baskerville, Georgia, "Times New Roman", serif',
    fontSize: '30px',
    fontWeight: '700',
    lineHeight: '1.3',
    letterSpacing: '-0.015em'
  },
  subhead: {
    fontFamily: 'Libre Baskerville, Georgia, "Times New Roman", serif',
    fontSize: '22px',
    fontWeight: '400',
    lineHeight: '1.4',
    letterSpacing: '-0.01em'
  },
  bodyLarge: {
    fontFamily: 'Inter, -apple-system, "Segoe UI", Helvetica, sans-serif',
    fontSize: '20px',
    fontWeight: '400',
    lineHeight: '1.75',
    letterSpacing: '0'
  },
  body: {
    fontFamily: 'Inter, -apple-system, "Segoe UI", Helvetica, sans-serif',
    fontSize: '17px',
    fontWeight: '400',
    lineHeight: '1.8',
    letterSpacing: '0'
  },
  bodySmall: {
    fontFamily: 'Inter, -apple-system, "Segoe UI", Helvetica, sans-serif',
    fontSize: '15px',
    fontWeight: '400',
    lineHeight: '1.7',
    letterSpacing: '0'
  },
  caption: {
    fontFamily: 'Inter, -apple-system, "Segoe UI", Helvetica, sans-serif',
    fontSize: '13px',
    fontWeight: '400',
    lineHeight: '1.5',
    letterSpacing: '0.01em'
  },
  overline: {
    fontFamily: 'Inter, -apple-system, "Segoe UI", Helvetica, sans-serif',
    fontSize: '11px',
    fontWeight: '600',
    lineHeight: '1.4',
    letterSpacing: '0.08em',
    textTransform: 'uppercase'
  },
  code: {
    fontFamily: 'Source Code Pro, "Fira Code", Consolas, monospace',
    fontSize: '15px',
    fontWeight: '400',
    lineHeight: '1.7',
    letterSpacing: '0'
  }
}

// Spacing
export const thoughtstreamSpacing = {
  baseUnit: '12px',
  scale: ['12px', '24px', '36px', '48px', '60px', '72px', '96px', '120px'],
  componentPadding: {
    small: '12px',
    medium: '24px',
    large: '48px'
  },
  sectionSpacing: {
    mobile: '60px',
    tablet: '84px',
    desktop: '120px'
  }
}

// Border Radius
export const thoughtstreamBorderRadius = {
  none: '0px',
  small: '0px',
  medium: '0px',
  large: '0px',
  xl: '0px',
  full: '9999px' // Only for avatars
}

// Shadows - ThoughtStream is completely flat
export const thoughtstreamShadows = {
  none: 'none',
  subtle: 'none',
  medium: 'none',
  large: 'none',
  overlay: 'none',
  focusRing: '0 0 0 2px #FAFAF9, 0 0 0 4px #78716C'
}

// Components
export const thoughtstreamComponents = {
  button: {
    primary: {
      background: '#78716C',
      text: '#FAFAF9',
      border: '1px solid #78716C',
      padding: '12px 24px',
      font: 'Inter, 15px, weight 600',
      radius: '0px',
      hover: {
        background: '#57534E'
      },
      active: {
        background: '#44403C'
      }
    },
    secondary: {
      background: 'transparent',
      text: '#78716C',
      border: '1px solid #D6D3D1',
      padding: '12px 24px',
      font: 'Inter, 15px, weight 600',
      radius: '0px',
      hover: {
        background: '#F5F5F4'
      },
      active: {
        background: '#E7E5E4'
      }
    },
    ghost: {
      background: 'transparent',
      text: '#78716C',
      border: 'none',
      padding: '12px 24px',
      font: 'Inter, 15px, weight 600',
      radius: '0px',
      hover: {
        background: '#F5F5F4'
      },
      active: {
        background: '#E7E5E4'
      }
    },
    destructive: {
      background: '#DC2626',
      text: '#FAFAF9',
      border: '1px solid #DC2626',
      padding: '12px 24px',
      font: 'Inter, 15px, weight 600',
      radius: '0px',
      hover: {
        background: '#B91C1C'
      },
      active: {
        background: '#991B1B'
      }
    },
    sizes: {
      small: {
        padding: '8px 16px',
        fontSize: '13px'
      },
      medium: {
        padding: '12px 24px',
        fontSize: '15px'
      },
      large: {
        padding: '16px 36px',
        fontSize: '17px'
      }
    }
  },
  card: {
    default: {
      background: '#FAFAF9',
      border: '1px solid #E7E5E4',
      radius: '0px',
      padding: '36px',
      shadow: 'none',
      hover: {
        border: '#D6D3D1'
      }
    },
    elevated: {
      background: '#F5F5F4',
      border: '1px solid #D6D3D1',
      radius: '0px',
      padding: '36px',
      shadow: 'none'
    }
  },
  input: {
    textInput: {
      height: '48px',
      background: '#FAFAF9',
      border: '1px solid #D6D3D1',
      radius: '0px',
      padding: '12px 16px',
      font: 'Inter, 15px, weight 400',
      textColor: '#1C1917',
      placeholderColor: '#A8A29E',
      focus: {
        border: '#78716C',
        ring: '0 0 0 2px #FAFAF9, 0 0 0 4px #78716C'
      },
      error: {
        border: '#DC2626'
      },
      disabled: {
        background: '#F5F5F4',
        opacity: '0.5'
      }
    },
    label: {
      font: 'Inter, 13px, weight 600',
      color: '#57534E',
      marginBottom: '8px'
    },
    helperText: {
      font: 'Inter, 13px, weight 400',
      color: '#A8A29E',
      marginTop: '6px',
      errorColor: '#DC2626'
    }
  }
}

// Design Principles
export const thoughtstreamPrinciples = {
  do: [
    'Let white space dominate - margins and padding should feel generous and contemplative',
    'Keep headlines in Libre Baskerville for literary warmth; never use it for UI labels',
    'Use #E7E5E4 hairline borders to separate sections instead of shadows or color blocks',
    'Set body text at 17px or above with 1.8 line height for comfortable long-form reading',
    'Maintain a maximum content width of 680px for body text to preserve optimal reading measure',
    'Favor vertical rhythm aligned to the 12px base unit across all spacing decisions'
  ],
  dont: [
    'Add decorative elements, gradients, or illustrations that compete with the text',
    'Use more than two font weights on a single screen - restraint is the ethos',
    'Use color to convey meaning alone - pair with text or icons for accessibility',
    'Introduce rounded corners - sharp edges reinforce the clean geometric identity'
  ]
}