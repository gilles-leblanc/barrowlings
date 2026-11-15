import { defineConfig } from 'vitest/config'

export default defineConfig({
  base: './',
  test: {
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/rules/**/*.ts'],
      reporter: ['text'],
      // SPEC.md › testing strategy: 100% of src/rules/ lines.
      thresholds: { lines: 100 },
    },
  },
})
