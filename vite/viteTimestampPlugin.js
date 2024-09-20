export function timestampPlugin(env) {
  const assetDir = `${env.TIMESTAMP}/`;

  return {
    name: 'timestamp-plugin',
    config(config) {
      config.build = config.build || {};
      config.build.assetsDir = assetDir;
    },
    generateBundle(options, bundle) {
      for (const fileName in bundle) {
        if (fileName !== 'index.html' && !fileName.startsWith(assetDir)) {
          const newFileName = assetDir + fileName;
          bundle[newFileName] = bundle[fileName];
          delete bundle[fileName];
        }
      }
    },
  };
}
