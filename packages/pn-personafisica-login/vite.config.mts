import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv, mergeConfig, splitVendorChunkPlugin } from 'vite';
import { defineConfig as defineVitestConfig } from 'vitest/config';

import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';

const vitestConfig = defineVitestConfig({
  test: {
    globals: true,
    setupFiles: './src/setupTests.tsx',
    environment: 'jsdom',
    reporters: ['vitest-sonar-reporter', 'default'],
    outputFile: 'test-report.xml',
    coverage: {
      provider: 'v8',
      reporter: ['lcov'],
      exclude: ['src/models/**'],
      reportOnFailure: true,
    },
    server: {
      deps: {
        inline: ['@pagopa/mui-italia'],
      },
    },
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return mergeConfig(vitestConfig, {
    base: '/auth/',
    plugins: [
      react(),
      basicSsl(),
      splitVendorChunkPlugin(),
      visualizer({
        // Aggiungi il visualizer
        open: true, // Apre automaticamente il report nel browser dopo la build
        filename: 'build-stats.html', // Nome del file di report
        gzipSize: true, // Mostra la dimensione dopo gzip,
      }),
    ],
    server: {
      host: env.HOST,
      port: 443,
      https: true,
      strictPort: true,
      open: true,
    },
    build: {
      outDir: 'build/auth',
      assetsDir: 'static',
      target: 'ES2020',
      rollupOptions: {
        external: ['**/*.test.tsx', '**/*.test.ts', '**/test-utils.ts', '**/*.mock.ts'],
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
