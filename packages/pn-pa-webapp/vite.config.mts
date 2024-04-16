import { defineConfig, loadEnv, mergeConfig, splitVendorChunkPlugin } from 'vite';
import { configDefaults, defineConfig as defineVitestConfig } from 'vitest/config';

import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';

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
      exclude: ['src/models/**'],
      reportOnFailure: true,
    },
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return mergeConfig(vitestConfig, {
    plugins: [react(), basicSsl(), splitVendorChunkPlugin()],
    server: {
      host: env.HOST,
      https: true,
      port: 443,
      strictPort: true,
      open: true,
    },
    build: {
      outDir: 'build',
      assetsDir: 'static',
      target: 'ES2020',
      rollupOptions: {
        external: ['**/*.test.tsx', '**/*.test.ts', '**/test-utils.tsx', '**/*.mock.ts'],
      },
    },
    preview: {
      port: 443,
      host: env.HOST,
      https: true,
    },
    // Exclude the test and the mock folders from being processed by Vite
    exclude: ['**/__test__/**', '**/__mocks__/**'],
  });
});
