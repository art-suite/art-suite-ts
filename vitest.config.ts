import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [
      '**/dist/**',
      '**/coverage/**',
      '**/node_modules/**',
      '**/vitest.config.ts'
    ],
    coverage: {
      exclude: [
        '**/dist/**',
        '**/coverage/**',
        '**/node_modules/**',
        '**/vitest.config.ts',
        '**/src/index.ts'
      ]
    }
  }
})