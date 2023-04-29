/// <reference types="vitest" />
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  root: 'src',
  define: {
    'import.meta.vitest': 'undefined',
  },
  test: {
    root: './',
    globals: true,
    includeSource: [],
    coverage: {
      provider: 'c8',
      reporter: ['text-summary', 'text', 'html'],
    },
    reporters: ['dot'],
    deps: {},
  },
});
