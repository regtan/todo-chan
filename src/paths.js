const path = require('path');
const os = require('os');

function getBaseDir() {
  return path.join(os.homedir(), '.local', 'share', 'todotui');
}

function getTasksPath() {
  return path.join(getBaseDir(), 'tasks.json');
}

function getReportsDir() {
  return path.join(getBaseDir(), 'reports');
}

module.exports = {
  getBaseDir,
  getTasksPath,
  getReportsDir,
};
