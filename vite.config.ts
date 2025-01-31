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
    },
    chunkSizeWarningLimit: 1000, // Increase warning threshold
    rollupOptions: {
      output: {
        manualChunks: {
          'framer-motion': ['framer-motion'],
          'randomized-elements': ['./src/components/RandomizedElements.tsx'],
          // Other large libraries or groups of modules
        }
      }
    },
    // Optional: Enable compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
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
