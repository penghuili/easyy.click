import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname), // Set the root to /extension
  build: {
    rollupOptions: {
      input: {
        sw: resolve(__dirname, 'src/sw.js'),
      },
      output: {
        format: 'iife',
        entryFileNames: 'sw.js',
        inlineDynamicImports: true,
      },
    },
    outDir: resolve(__dirname, 'dist-sw'), // Dist directory for extension files
    emptyOutDir: true,
  },
});
