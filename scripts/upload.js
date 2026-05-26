const { execSync } = require('child_process');

require('dotenv').config();

buildApp();

deployApp(process.env.S3_URL);

if (process.env.DEPLOY_ENV === 'prod') {
  deployApp(process.env.COM_S3_URL);
  deployApp(process.env.NOTENOTE_S3_URL);
}

function deployApp(bucket) {
  console.log(`Deploying app to ${bucket} ...`);

  uploadStatic(bucket);

  uploadIndex(bucket);

  uploadSW(bucket);

  deleteOldVersion(bucket);

  console.log(`Deploy app to ${bucket} completed.`);
}

function buildApp() {
  console.log('Building the app...');
  execSync(`npm run build`);
  console.log('Build app completed.');
}

function uploadStatic(bucket) {
  console.log('Uploading assets to S3...');
  execSync(
    `aws s3 sync dist/${process.env.TIMESTAMP} ${bucket}/${process.env.TIMESTAMP} --cache-control max-age=31536000,public`
  );
  console.log('Upload assets to S3 completed.');
}

function uploadIndex(bucket) {
  console.log('Uploading index.html to S3...');
  execSync(`aws s3 cp dist/index.html ${bucket}/index.html --cache-control max-age=0,no-store`);
  console.log('Upload index.html to S3 completed.');
}

function uploadSW(bucket) {
  console.log('Uploading sw.js to S3...');
  execSync(`aws s3 cp dist-sw/sw.js ${bucket}/sw.js --cache-control max-age=0,no-store`);
  execSync(
    `aws s3 cp dist/manifest.json ${bucket}/manifest.json --cache-control max-age=0,no-store`
  );
  console.log('Upload sw.js to S3 completed.');
}

function deleteOldVersion(bucket) {
  console.log('Deleting old versions ...');
  const result = execSync(`aws s3 ls ${bucket} --recursive`).toString();
  const versions = [
    ...new Set(
      result
        .split(/\r?\n/)
        .map(line => line.trim().split(/\s+/).pop())
        .filter(Boolean)
        .map(key => key.split('/')[0])
        .filter(version => /^\d{14}$/.test(version))
    ),
  ].sort();
  // If there are more than 10 versions, remove the oldest ones
  if (versions.length > 10) {
    const toDelete = versions.slice(0, versions.length - 10); // Keep the last 10

    toDelete.forEach(version => {
      console.log(`Deleting version: ${version}`);
      execSync(`aws s3 rm ${bucket}/${version} --recursive`);
    });
    console.log('Deleting old versions completed.');
  } else {
    console.log('No old versions to delete.');
  }
}
