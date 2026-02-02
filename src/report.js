const fs = require('fs/promises');
const path = require('path');
const { loadTasks } = require('./storage');
const { getReportsDir } = require('./paths');

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDate(value) {
  if (!value) {
    return new Date();
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }
  return parsed;
}

async function generateDailyReport(dateInput) {
  const date = parseDate(dateInput);
  const tasks = await loadTasks();
  const done = tasks.filter((task) => task.done);
  const pending = tasks.filter((task) => !task.done);

  const lines = [
    `# Daily Report (${formatDate(date)})`,
    '',
    `- Total tasks: ${tasks.length}`,
    `- Done: ${done.length}`,
    `- Pending: ${pending.length}`,
    '',
    '## Done',
    '',
    ...done.map((task) => `- ${task.title}`),
    '',
    '## Pending',
    '',
    ...pending.map((task) => `- ${task.title}`),
    '',
  ];

  await fs.mkdir(getReportsDir(), { recursive: true });
  const filename = `${formatDate(date)}.md`;
  const reportPath = path.join(getReportsDir(), filename);
  await fs.writeFile(reportPath, lines.join('\n'), 'utf8');

  return reportPath;
}

module.exports = {
  generateDailyReport,
};
