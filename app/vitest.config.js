import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['tests/setup.js']
  },
  esbuild: {
    jsx: 'automatic',
    jsxDev: false,
    jsxImportSource: 'react'
  }
});
