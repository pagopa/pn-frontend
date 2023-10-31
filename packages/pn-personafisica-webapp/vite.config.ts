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