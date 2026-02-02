const fs = require('fs/promises');
const path = require('path');
const { getBaseDir, getTasksPath } = require('./paths');

async function ensureBaseDir() {
  await fs.mkdir(getBaseDir(), { recursive: true });
}

async function loadTasks() {
  try {
    const content = await fs.readFile(getTasksPath(), 'utf8');
    const tasks = JSON.parse(content);
    return Array.isArray(tasks) ? tasks : [];
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function saveTasks(tasks) {
  await ensureBaseDir();
  const tempPath = `${getTasksPath()}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(tasks, null, 2), 'utf8');
  await fs.rename(tempPath, getTasksPath());
}

function createTask(title) {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title,
    done: false,
    createdAt: new Date().toISOString(),
  };
}

function toggleTask(task) {
  return {
    ...task,
    done: !task.done,
    updatedAt: new Date().toISOString(),
  };
}

module.exports = {
  loadTasks,
  saveTasks,
  createTask,
  toggleTask,
};
