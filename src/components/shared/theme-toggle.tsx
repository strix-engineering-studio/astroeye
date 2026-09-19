"use client"

import { MonitorPlay, Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"
import { useTheme } from "@/components/shared/theme-provider"

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setMounted(true), 0)
    return () => window.clearTimeout(timeoutId)
  }, [])

  if (!mounted) {
    return (
      <button
        type="button"
        className={className ?? "flex items-center gap-1 rounded-full border border-black/10 bg-background/70 p-1 shadow-sm shadow-black/5 backdrop-blur-xl dark:border-white/10"}
        aria-label="Theme"
        title="Theme"
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground/50">
          <Moon className="size-4" />
        </span>
      </button>
    )
  }

  return (
    <div className={className ?? "flex items-center gap-1 rounded-full border border-black/10 bg-background/70 p-1 shadow-sm shadow-black/5 backdrop-blur-xl dark:border-white/10"}>
      <button
        type="button"
        onClick={() => setTheme('system')}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
          theme === 'system'
            ? 'bg-black/10 text-foreground dark:bg-white/10'
            : 'text-foreground/50 hover:text-foreground'
        }`}
        aria-label="System theme"
        aria-pressed={theme === 'system'}
        title="System theme"
      >
        <MonitorPlay className="size-4" />
      </button>

      <button
        type="button"
        onClick={() => setTheme('light')}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
          theme === 'light'
            ? 'bg-black/10 text-foreground dark:bg-white/10'
            : 'text-foreground/50 hover:text-foreground'
        }`}
        aria-label="Light theme"
        aria-pressed={theme === 'light'}
        title="Light theme"
      >
        <Sun className="size-4" />
      </button>

      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
          theme === 'dark'
            ? 'bg-black/10 text-foreground dark:bg-white/10'
            : 'text-foreground/50 hover:text-foreground'
        }`}
        aria-label="Dark theme"
        aria-pressed={theme === 'dark'}
        title="Dark theme"
      >
        <Moon className="size-4" />
      </button>
    </div>
  )
}