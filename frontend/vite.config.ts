import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(() => {
  const VITE_APP_PORT = process.env.VITE_APP_PORT;

  return {
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
