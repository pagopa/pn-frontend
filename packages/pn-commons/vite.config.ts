/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';

import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react()],
    test: {
      globals: true,
      setupFiles: './src/setupTests.ts',
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, '**/*.a11y.test.ts', '**/*.a11y.test.tsx'],
      reporters: ['vitest-sonar-reporter', 'default'],
      outputFile: 'test-report.xml',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: ['**/*.a11y.test.ts', '**/*.a11y.test.tsx'],
        reportOnFailure: true,
      },
    }
  };
});
