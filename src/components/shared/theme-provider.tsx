"use client"

import { createContext, useContext, useLayoutEffect, useMemo, useState } from "react"

type Theme = "light" | "dark" | "system"

type ThemeContextValue = {
  theme: Theme
  resolvedTheme: "light" | "dark"
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "dark"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system"
  const storedTheme = window.localStorage.getItem("theme")
  return storedTheme === "light" || storedTheme === "dark" || storedTheme === "system" ? storedTheme : "system"
}

function applyTheme(theme: Theme, resolvedTheme: "light" | "dark") {
  const root = document.documentElement
  root.classList.toggle("dark", resolvedTheme === "dark")
  root.style.colorScheme = resolvedTheme
  root.dataset.theme = theme
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const initialTheme = getStoredTheme()
  const [theme, setThemeState] = useState<Theme>(() => initialTheme)
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => getSystemTheme() === "dark")

  const resolvedTheme: "light" | "dark" = theme === "system" ? (systemPrefersDark ? "dark" : "light") : theme

  useLayoutEffect(() => {
    if (typeof window === "undefined") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    applyTheme(theme, resolvedTheme)
    window.localStorage.setItem("theme", theme)

    const handleChange = () => {
      setSystemPrefersDark(mediaQuery.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, resolvedTheme])

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme: setThemeState,
      toggleTheme: () => setThemeState(resolvedTheme === "dark" ? "light" : "dark"),
    }),
    [resolvedTheme, theme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }

  return context
}