const fs = require('fs');
const path = require('path');

const env = process.argv[2];

updateOrAddEnvVariable('.env', 'DEPLOY_ENV', env);
updateOrAddEnvVariable(
  '.env',
  'S3_URL',
  env === 'prod' ? 's3://app.easyy.click' : 's3://dev.easyy.click'
);
updateOrAddEnvVariable(
  '.env',
  'COM_S3_URL',
  env === 'prod' ? 's3://app.easyyclick.com' : 's3://dev-app.easyyclick.com'
);
updateOrAddEnvVariable(
  '.env',
  'NOTENOTE_S3_URL',
  env === 'prod' ? 's3://easyy.notenote.cc' : 's3://dev-easyy.notenote.cc'
);
updateOrAddEnvVariable(
  '.env.production',
  'VITE_EASYY_API_URL',
  env === 'prod' ? 'https://api.peng37.com/easyy' : 'https://api.peng37.com/easyy-test'
);

function updateOrAddEnvVariable(envFile, key, value) {
  const envPath = path.join(__dirname, '..', envFile); // Adjust the path to your .env file
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
