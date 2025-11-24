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
    exclude: configDefaults.exclude,
    reporters: ['vitest-sonar-reporter', 'default'],
    outputFile: 'test-report.xml',
    coverage: {
      provider: 'v8',
      reporter: ['lcov'],
      reportOnFailure: true,
    },
    server: {
      deps: {
        inline: ['@pagopa/mui-italia'],
      },
    },
  },
});

export default mergeConfig(viteConfig, vitestConfig);
