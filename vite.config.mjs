import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';

import { timestampPlugin } from './vite/viteTimestampPlugin';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: mode === 'production' ? [timestampPlugin(env)] : [],
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    },
    server: {
      port: 3000,
      open: false,
    },
    build: {
      chunkSizeWarningLimit: 1300,
      rollupOptions: {
        plugins: [
          visualizer({
            open: false,
            filename: 'bundle-stats.html',
          }),
        ],
      },
    },
  };
});
