"use client"

import { useEffect } from "react"

const themes = [
  {
    name: "Midnight Blue",
    colors: {
      "--background": "#0f172a",
      "--foreground": "#f8fafc",
      "--primary": "#3b82f6",
      "--primary-foreground": "#ffffff",
      "--secondary": "#1e293b",
      "--secondary-foreground": "#cbd5e1",
      "--muted": "#334155",
      "--muted-foreground": "#94a3b8",
      "--accent": "#1e40af",
      "--accent-foreground": "#f1f5f9",
      "--border": "#475569",
      "--input": "#334155",
      "--ring": "#3b82f6",
    },
  },
  {
    name: "Forest Green",
    colors: {
      "--background": "#0f1419",
      "--foreground": "#f0f9ff",
      "--primary": "#10b981",
      "--primary-foreground": "#ffffff",
      "--secondary": "#1f2937",
      "--secondary-foreground": "#d1d5db",
      "--muted": "#374151",
      "--muted-foreground": "#9ca3af",
      "--accent": "#059669",
      "--accent-foreground": "#f0fdf4",
      "--border": "#4b5563",
      "--input": "#374151",
      "--ring": "#10b981",
    },
  },
  {
    name: "Warm Amber",
    colors: {
      "--background": "#1c1917",
      "--foreground": "#fafaf9",
      "--primary": "#f59e0b",
      "--primary-foreground": "#ffffff",
      "--secondary": "#292524",
      "--secondary-foreground": "#d6d3d1",
      "--muted": "#44403c",
      "--muted-foreground": "#a8a29e",
      "--accent": "#d97706",
      "--accent-foreground": "#fffbeb",
      "--border": "#57534e",
      "--input": "#44403c",
      "--ring": "#f59e0b",
    },
  },
  {
    name: "Ocean Teal",
    colors: {
      "--background": "#0c1821",
      "--foreground": "#f0fdfa",
      "--primary": "#14b8a6",
      "--primary-foreground": "#ffffff",
      "--secondary": "#1e2832",
      "--secondary-foreground": "#ccfbf1",
      "--muted": "#2d3748",
      "--muted-foreground": "#99f6e4",
      "--accent": "#0d9488",
      "--accent-foreground": "#f0fdfa",
      "--border": "#4a5568",
      "--input": "#2d3748",
      "--ring": "#14b8a6",
    },
  },
  {
    name: "Royal Purple",
    colors: {
      "--background": "#1e1b4b",
      "--foreground": "#f8fafc",
      "--primary": "#8b5cf6",
      "--primary-foreground": "#ffffff",
      "--secondary": "#312e81",
      "--secondary-foreground": "#e0e7ff",
      "--muted": "#4338ca",
      "--muted-foreground": "#c7d2fe",
      "--accent": "#7c3aed",
      "--accent-foreground": "#f5f3ff",
      "--border": "#6366f1",
      "--input": "#4338ca",
      "--ring": "#8b5cf6",
    },
  },
  {
    name: "Monochrome",
    colors: {
      "--background": "#0a0a0a",
      "--foreground": "#fafafa",
      "--primary": "#ffffff",
      "--primary-foreground": "#0a0a0a",
      "--secondary": "#262626",
      "--secondary-foreground": "#d4d4d4",
      "--muted": "#404040",
      "--muted-foreground": "#a3a3a3",
      "--accent": "#525252",
      "--accent-foreground": "#f5f5f5",
      "--border": "#525252",
      "--input": "#404040",
      "--ring": "#ffffff",
    },
  },
]

export function ThemeSwitcher() {
  useEffect(() => {
    const applyTheme = () => {
      const randomTheme = themes[Math.floor(Math.random() * themes.length)]
      const root = document.documentElement

      Object.entries(randomTheme.colors).forEach(([property, value]) => {
        root.style.setProperty(property, value)
      })
    }

    applyTheme()
  }, [])

  return null
}
