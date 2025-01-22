import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  optimizeDeps: {
    include: ['ical'],
  },
  build: {
    commonjsOptions: {
      include: [/ical/, /node_modules/]
    }
  },
  base: './',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../")
    }
  },
  plugins: [react()],
});
