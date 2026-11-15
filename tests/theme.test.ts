import { describe, expect, it } from 'vitest'
import { readSavedTheme, resolveTheme, saveTheme, THEME_KEY, toggleTheme, type ThemeStorage } from '../src/rules/theme'

function memoryStorage(initial: Record<string, string> = {}): ThemeStorage & { data: Record<string, string> } {
  const data = { ...initial }
  return {
    data,
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = value
    },
  }
}

const throwingStorage: ThemeStorage = {
  getItem: () => {
    throw new Error('SecurityError: storage blocked')
  },
  setItem: () => {
    throw new Error('QuotaExceededError')
  },
}

describe('resolveTheme', () => {
  it('uses a saved choice over the system setting', () => {
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
  })

  it('follows the system setting when nothing is saved', () => {
    expect(resolveTheme(null, true)).toBe('dark')
    expect(resolveTheme(null, false)).toBe('light')
  })

  it('ignores an unrecognised saved value', () => {
    expect(resolveTheme('purple', true)).toBe('dark')
    expect(resolveTheme('', false)).toBe('light')
  })
})

describe('toggleTheme', () => {
  it('returns the other theme', () => {
    expect(toggleTheme('light')).toBe('dark')
    expect(toggleTheme('dark')).toBe('light')
  })
})

describe('saved theme storage', () => {
  it('saves and reads back the choice', () => {
    const storage = memoryStorage()
    saveTheme(storage, 'dark')
    expect(storage.data[THEME_KEY]).toBe('dark')
    expect(readSavedTheme(storage)).toBe('dark')
  })

  it('reads null when nothing is saved', () => {
    expect(readSavedTheme(memoryStorage())).toBeNull()
  })

  it('reads null and saves nothing, without throwing, when storage is blocked', () => {
    expect(readSavedTheme(throwingStorage)).toBeNull()
    expect(() => saveTheme(throwingStorage, 'dark')).not.toThrow()
  })

  it('reads null and saves nothing when there is no storage at all', () => {
    expect(readSavedTheme(undefined)).toBeNull()
    expect(() => saveTheme(undefined, 'light')).not.toThrow()
  })
})
