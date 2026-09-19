// ThoughtStream Design System Utilities
// Provides easy access to ThoughtStream design tokens and components

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Core design tokens
export const thoughtstream = {
  colors: {
    primary: "#78716C",
    secondary: "#A8A29E",
    tertiary: "#1C1917",
    background: "#FAFAF9",
    surface: "#F5F5F4",
    surfaceRaised: "#EFEDEB",
    textPrimary: "#1C1917",
    textSecondary: "#57534E",
    textTertiary: "#A8A29E",
    borderSubtle: "#E7E5E4",
    borderMedium: "#D6D3D1",
    borderStrong: "#A8A29E",
    success: "#65A30D",
    warning: "#CA8A04",
    error: "#DC2626",
    info: "#78716C",
  },
  
  spacing: {
    base: "12px",
    sm: "12px",
    md: "24px",
    lg: "48px",
    xl: "60px",
    "2xl": "84px",
    "3xl": "120px",
  },
  
  fonts: {
    heading: "Libre Baskerville, Georgia, 'Times New Roman', serif",
    body: "Inter, -apple-system, 'Segoe UI', Helvetica, sans-serif",
    mono: "Source Code Pro, 'Fira Code', Consolas, monospace",
  },
  
  contentWidth: "680px",
}

// Utility function to merge ThoughtStream classes
export function ts(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// Component generators
export function buttonClasses(variant: "primary" | "secondary" | "ghost" | "destructive" = "primary") {
  const base = "inline-flex items-center justify-center border font-medium transition-all outline-none select-none"
  
  const variants = {
    primary: "bg-primary text-background border-primary hover:bg-opacity-90 active:bg-opacity-80",
    secondary: "bg-transparent text-primary border-border-medium hover:bg-surface active:bg-surface-raised",
    ghost: "bg-transparent text-primary border-none hover:bg-surface active:bg-surface-raised",
    destructive: "bg-error text-background border-error hover:bg-opacity-90 active:bg-opacity-80",
  }
  
  return ts(base, variants[variant], "px-4 py-2 text-sm")
}

export function cardClasses(elevated: boolean = false) {
  const base = "border"
  const elevatedBase = elevated ? "bg-surface border-border-medium" : "bg-background border-border-subtle"
  return ts(base, elevatedBase, "p-9")
}

export function inputClasses() {
  return ts(
    "h-12 bg-background border border-border-medium px-4 py-3 text-sm",
    "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
  )
}

// Typography utilities
export function headingClasses(level: 1 | 2 | 3 | 4 = 1) {
  const classes = {
    1: "text-display font-heading font-bold",
    2: "text-headline font-heading font-bold",
    3: "text-subhead font-heading",
    4: "text-body-large font-heading",
  }
  return ts(classes[level], "text-text-primary mb-6")
}

export function bodyClasses(size: "default" | "large" | "small" = "default") {
  const classes = {
    default: "text-body",
    large: "text-body-large",
    small: "text-body-small",
  }
  return ts(classes[size], "text-text-primary leading-relaxed")
}

// Layout utilities
export function contentContainer() {
  return ts("max-w-content mx-auto px-6")
}

export function sectionSpacing() {
  return ts("py-section-desktop md:py-section-tablet sm:py-section-mobile")
}