import { defineConfig, loadEnv, mergeConfig, splitVendorChunkPlugin } from 'vite';
import { configDefaults, defineConfig as defineVitestConfig } from 'vitest/config';

import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';

const vitestConfig = defineVitestConfig({
  test: {
    globals: true,
    setupFiles: './src/setupTests.tsx',
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

  const webAppEnv = env.HOST ? env.HOST.split('.')[1] : 'dev'; // the host value is like "cittadini.dev.notifichedigitali.it"

  return mergeConfig(vitestConfig, {
    plugins: [react(), basicSsl(), splitVendorChunkPlugin()],
    server: {
      host: env.HOST,
      port: 443,
      https: true,
      strictPort: true,
      open: true,
      proxy: {
        '^/auth/.*': {
          target: `https://login.${webAppEnv}.notifichedigitali.it`,
          changeOrigin: true,
        },
      },
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
