import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite';

import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: '/auth/',
    plugins: [react(), basicSsl(), splitVendorChunkPlugin()],
    server: {
      host: env.HOST,
      https: true,
      port: 443,
      strictPort: true,
      open: true,
    },
    test: {
      globals: true,
      setupFiles: './src/setupTests.ts',
      environment: 'jsdom',
      reporters: ['vitest-sonar-reporter'],
      outputFile: 'test-report.xml',
      coverage: {
        provider: 'v8',
        reporter: ['lcov'],
        exclude: ['src/models/**'],
        reportOnFailure: true,
      },
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
  };
});
