// filepath: /d:/cal-frontend-g/cal/frontend-cal/vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './__tests__/vitest.setup.ts',
    globals: true, // Enable global variables like `describe`, `it`, etc.
  },
})