/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import { configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), basicSsl()],
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
        exclude: ['**/*.a11y.test.ts', '**/*.a11y.test.tsx', 'src/models/**'],
        reportOnFailure: true,
      },
    },
    server: {
      host: env.HOST,
      https: true,
      port: 443,
    },
    build: {
      outDir: 'build',
      assetsDir: 'static',
      target: 'ES2020',
    },
    preview: {
      port: 443,
    },
  };
});
