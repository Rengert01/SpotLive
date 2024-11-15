import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = {
    ...process.env,
    ...loadEnv(mode, path.resolve(__dirname, '../')),
  };

  const VITE_APP_PORT = process.env.VITE_APP_PORT;

  const env = loadEnv(mode, process.cwd(), '');

  return {
    envDir: '',
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: true,
      port: parseInt(VITE_APP_PORT ?? '3000'),
      watch: {
        usePolling: true,
      },
    },
  };
});
