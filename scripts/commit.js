const { exec } = require('child_process');

// Extract the commit message from the command line arguments
const commitMessage = process.argv[2];

// Check if the commit message was provided
if (!commitMessage) {
  console.error('Error: No commit message provided.');
  process.exit(1);
}

// Define the git commands
const gitAdd = 'git add .';
const gitCommit = `git commit -m "${commitMessage}"`;
const gitPush = 'git push';

// Execute the git commands
exec(`${gitAdd} && ${gitCommit} && ${gitPush}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Execution error: ${error}`);
    return;
  }
  console.log(stdout);
  console.error(stderr);
});
