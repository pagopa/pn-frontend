import { defineConfig as defineViteConfig, mergeConfig } from 'vite';
import { configDefaults, defineConfig as defineVitestConfig } from 'vitest/config';

import react from '@vitejs/plugin-react';

const viteConfig = defineViteConfig({
  plugins: [react()],
});

const vitestConfig = defineVitestConfig({
  test: {
    globals: true,
    setupFiles: './src/setupTests.ts',
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, '**/*.a11y.test.ts', '**/*.a11y.test.tsx'],
    reporters: ['vitest-sonar-reporter', 'default'],
    outputFile: 'test-report.xml',
    coverage: {
      provider: 'v8',
      reporter: ['lcov'],
      exclude: ['**/*.a11y.test.ts', '**/*.a11y.test.tsx'],
      reportOnFailure: true,
    },
  },
});

export default mergeConfig(viteConfig, vitestConfig);
