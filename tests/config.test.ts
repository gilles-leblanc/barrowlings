import { describe, expect, it } from 'vitest'
import config from '../vite.config'

describe('vite config', () => {
  it('uses relative asset paths so dist/ works from any static host or sub-path', () => {
    expect(config.base).toBe('./')
  })
})
