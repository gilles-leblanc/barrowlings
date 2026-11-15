// Theme choice (SPEC-dark-mode-toggle.md). The inline script in index.html mirrors
// `readSavedTheme` + `resolveTheme` in a few lines so a saved theme applies before first paint.

export type Theme = 'light' | 'dark'

/** localStorage key. Keep in sync with the inline script in index.html. */
export const THEME_KEY = 'theme'

/** The part of `Storage` this module needs, so tests can pass a fake. */
export type ThemeStorage = Pick<Storage, 'getItem' | 'setItem'>

function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark'
}

/** A valid saved choice wins; otherwise follow the system setting. */
export function resolveTheme(saved: string | null, systemPrefersDark: boolean): Theme {
  if (isTheme(saved)) return saved
  return systemPrefersDark ? 'dark' : 'light'
}

export function toggleTheme(theme: Theme): Theme {
  return theme === 'dark' ? 'light' : 'dark'
}

/** Never throws: storage can be missing or blocked (private windows, strict settings). */
export function readSavedTheme(storage: ThemeStorage | undefined): string | null {
  try {
    return storage?.getItem(THEME_KEY) ?? null
  } catch {
    return null
  }
}

/** Never throws; if storage is unavailable the choice just isn't remembered. */
export function saveTheme(storage: ThemeStorage | undefined, theme: Theme): void {
  try {
    storage?.setItem(THEME_KEY, theme)
  } catch {
    // Storage blocked: the theme still applies for this visit.
  }
}
