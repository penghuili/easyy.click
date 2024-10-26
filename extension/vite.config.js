import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname), // Set the root to /extension
  build: {
    // minify: false,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'),
      },
      output: {
        format: 'es', // Use ES modules for popup
        entryFileNames: '[name].js',
      },
      manualChunks: undefined, // Disable manual chunk splitting
    },
    outDir: resolve(__dirname, '../dist-ext'), // Dist directory for extension files
    emptyOutDir: true,
  },
});
