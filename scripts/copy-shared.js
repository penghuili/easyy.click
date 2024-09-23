const { execSync } = require('child_process');

const lib = process.argv[2];

execSync(`rm -rf src/shared && mkdir src/shared`);
execSync(`cp -a ../private-sharedjs/lib/js src/shared/js`);
execSync(`cp -a ../private-sharedjs/lib/browser src/shared/browser`);
if (lib === 'radix') {
  execSync(`cp -a ../private-sharedjs/lib/radix src/shared/radix`);
} else if (lib === 'nutui') {
  execSync(`cp -a ../private-sharedjs/lib/nutui src/shared/nutui`);
}
execSync(
  `rm -f scripts/upload.js && cp -a ../private-sharedjs/scripts/upload.js scripts/upload.js`
);
