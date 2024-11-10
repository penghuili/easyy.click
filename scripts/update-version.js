const { execSync } = require('child_process');
const newVersion = require('./new-version.json');

require('dotenv').config();

uploadVersionJson(process.env.S3_URL);

if (process.env.DEPLOY_ENV === 'prod') {
  uploadVersionJson(process.env.COM_S3_URL);
  uploadVersionJson(process.env.NOTENOTE_S3_URL);
}

function uploadVersionJson(bucket) {
  if (!newVersion.message) {
    console.log('No new version message found.');
  } else {
    console.log('Uploading version json to S3...');
    const json = `{"version": "${process.env.VERSION}", "changes": "${newVersion.message}", "link": "${newVersion.link}"}`;

    execSync(`echo '${json}' > dist/version.json`);

    execSync(
      `aws s3 cp dist/version.json ${bucket}/version.json --cache-control max-age=0,no-store`
    );

    console.log('Upload version json to S3 completed.');
  }
}
