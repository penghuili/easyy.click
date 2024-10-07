const { execSync } = require('child_process');

const lib = process.argv[2];

execSync(`rm -rf src/shared && mkdir src/shared`);
execSync(`cp -a ../private-sharedjs/lib/js src/shared/js`);
execSync(`cp -a ../private-sharedjs/lib/browser src/shared/browser`);
if (lib === 'radix') {
  execSync(`cp -a ../private-sharedjs/lib/radix src/shared/radix`);
} else if (lib === 'semi') {
  execSync(`cp -a ../private-sharedjs/lib/semi src/shared/semi`);
}
// execSync(
//   `rm -f scripts/upload.js && cp -a ../private-sharedjs/scripts/upload.js scripts/upload.js`
// );
