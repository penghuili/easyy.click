import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';
import vitePluginImp from 'vite-plugin-imp';

import { timestampPlugin } from './vite/viteTimestampPlugin';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins:
      mode === 'production'
        ? [
            react(),
            vitePluginImp({
              libList: [
                {
                  libName: '@nutui/nutui-react',
                  style: name => {
                    return `@nutui/nutui-react/dist/esm/${name}/style/css`;
                  },
                  replaceOldImport: false,
                  camel2DashComponentName: false,
                },
              ],
            }),
            timestampPlugin(env),
          ]
        : [
            react(),
            vitePluginImp({
              libList: [
                {
                  libName: '@nutui/nutui-react',
                  style: name => {
                    return `@nutui/nutui-react/dist/esm/${name}/style/css`;
                  },
                  replaceOldImport: false,
                  camel2DashComponentName: false,
                },
              ],
            }),
          ],
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
