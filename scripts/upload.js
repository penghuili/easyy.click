const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const timestamp = new Date()
  .toISOString()
  .replace(/[^0-9]/g, '')
  .slice(0, 14);
const version = timestamp.slice(2, 12);

updateOrAddEnvVariable('TIMESTAMP', timestamp);
updateOrAddEnvVariable('VITE_VERSION', version);

require('dotenv').config();

buildApp();

uploadStatic();

uploadIndex();

if (!process.env.DISABLE_VERSION_JSON) {
  uploadVersionJson();
}

deleteOldVersion();

function updateOrAddEnvVariable(key, value) {
  const envPath = path.join(__dirname, '..', '.env.production'); // Adjust the path to your .env file
  let envContents = fs.readFileSync(envPath, 'utf-8');
  let lines = envContents.split('\n');

  let found = false;
  lines = lines.map(line => {
    const [currentKey] = line.split('=');
    if (currentKey === key) {
      found = true;
      return `${key}=${value}`;
    }
    return line;
  });

  if (!found) {
    lines.push(`${key}=${value}`);
  }

  // Filter out any empty lines
  lines = lines.filter(line => line.trim() !== '');

  fs.writeFileSync(envPath, lines.join('\n'));
}

function buildApp() {
  console.log('Building the app...');
  execSync(`npm run build`);
  console.log('Build app completed.');
}

function uploadStatic() {
  console.log('Uploading assets to S3...');
  execSync(
    `aws s3 sync dist/${timestamp} ${process.env.S3_URL}/${timestamp} --cache-control max-age=31536000,public`
  );
  console.log('Upload assets to S3 completed.');
}

function uploadIndex() {
  console.log('Uploading index.html to S3...');
  execSync(
    `aws s3 cp dist/index.html ${process.env.S3_URL}/index.html --cache-control max-age=0,no-store`
  );
  console.log('Upload index.html to S3 completed.');
}

function uploadVersionJson() {
  console.log('Uploading version json to S3...');
  const newVersionMessage = process.argv[2];
  const json = newVersionMessage
    ? `{"version": "${version}", "changes": "${newVersionMessage}"}`
    : `{"version": "${version}"}`;

  execSync(`echo '${json}' > dist/version.json`);

  execSync(
    `aws s3 cp dist/version.json ${process.env.S3_URL}/version.json --cache-control max-age=0,no-store`
  );

  if (newVersionMessage) {
    const dbItem = {
      id: { S: 'admin' },
      sortKey: { S: `version_${version}` },
      version: { S: version },
      changes: { S: newVersionMessage },
    };
    execSync(
      `aws dynamodb put-item --table-name ${process.env.DYNAMODB_TABLE} --item "${JSON.stringify(
        dbItem
      ).replace(/"/g, '\\"')}"`
    );
  }

  console.log('Upload version json to S3 completed.');
}

function deleteOldVersion() {
  console.log('Deleting old versions ...');
  // Retrieve the list of folder names (versions) from S3
  const command = `aws s3 ls ${process.env.S3_URL} --recursive | awk '{print $4}' | grep '/' | cut -d/ -f1 | uniq`;
  const result = execSync(command).toString();
  // Split the result into an array, filter out 'index.html' and other non-versioned entries, and then sort
  const versions = result
    .split('\n')
    .filter(v => v && v !== 'index.html' && /^\d{14}$/.test(v))
    .sort();
  // If there are more than 10 versions, remove the oldest ones
  if (versions.length > 10) {
    const toDelete = versions.slice(0, versions.length - 10); // Keep the last 10

    toDelete.forEach(version => {
      console.log(`Deleting version: ${version}`);
      execSync(`aws s3 rm ${process.env.S3_URL}/${version} --recursive`);
    });
    console.log('Deleting old versions completed.');
  } else {
    console.log('No old versions to delete.');
  }
}
