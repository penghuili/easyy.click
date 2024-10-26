import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname), // Set the root to /extension
  build: {
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'background.js'),
      },
      output: {
        format: 'iife',
        entryFileNames: 'background.js',
        inlineDynamicImports: true,
      },
    },
    outDir: resolve(__dirname, '../dist-ext-bg'), // Dist directory for extension files
    emptyOutDir: true,
  },
});
