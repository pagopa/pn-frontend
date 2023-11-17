import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), basicSsl()],
    server: {
      host: env.HOST,
      https: true,
      port: 443,
    },
    test: {
      globals: true,
      setupFiles: './src/setupTests.ts',
      environment: 'jsdom',
      reporters: ['vitest-sonar-reporter', 'default'],
      outputFile: 'test-report.xml',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [ 'src/models/**'],
        reportOnFailure: true,
      },
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
