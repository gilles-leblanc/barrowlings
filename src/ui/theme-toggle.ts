import { readSavedTheme, resolveTheme, saveTheme, toggleTheme, type Theme, type ThemeStorage } from '../rules/theme'

/** Accessing `window.localStorage` itself can throw when storage is blocked. */
function browserStorage(): ThemeStorage | undefined {
  try {
    return window.localStorage
  } catch {
    return undefined
  }
}

function currentTheme(): Theme {
  const applied = document.documentElement.dataset.theme
  if (applied === 'light' || applied === 'dark') return applied // set by the inline script in index.html
  return resolveTheme(readSavedTheme(browserStorage()), window.matchMedia('(prefers-color-scheme: dark)').matches)
}

function apply(button: HTMLButtonElement, theme: Theme): void {
  document.documentElement.dataset.theme = theme
  button.setAttribute('aria-pressed', String(theme === 'dark'))
}

/** "Dark mode" toggle button (WAI-ARIA toggle button: fixed label, aria-pressed carries the state). */
export function initThemeToggle(button: HTMLButtonElement): void {
  let theme = currentTheme()
  apply(button, theme)
  button.addEventListener('click', () => {
    theme = toggleTheme(theme)
    apply(button, theme)
    saveTheme(browserStorage(), theme)
  })
}
