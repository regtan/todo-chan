const blessed = require('@blessed/neo-blessed');
const { createTask, loadTasks, saveTasks, toggleTask } = require('./storage');

async function runTui() {
  const screen = blessed.screen({
    smartCSR: true,
    title: 'todotui',
  });

  const tasks = await loadTasks();

  const header = blessed.box({
    top: 0,
    left: 0,
    width: '100%',
    height: 1,
    content: 'todotui - a:Add d:Toggle x:Delete r:Refresh q:Quit',
    style: { fg: 'white', bg: 'blue' },
  });

  const list = blessed.list({
    top: 1,
    left: 0,
    width: '100%',
    height: '100%-2',
    keys: true,
    vi: true,
    mouse: true,
    border: 'line',
    style: {
      selected: { bg: 'green', fg: 'black' },
    },
    scrollbar: {
      ch: ' ',
      track: { bg: 'grey' },
      style: { inverse: true },
    },
  });

  const footer = blessed.box({
    bottom: 0,
    left: 0,
    width: '100%',
    height: 1,
    content: 'Ready',
    style: { fg: 'white', bg: 'blue' },
  });

  const prompt = blessed.prompt({
    parent: screen,
    border: 'line',
    height: 7,
    width: '50%',
    top: 'center',
    left: 'center',
    label: ' Add Task ',
    tags: true,
    hidden: true,
  });

  screen.append(header);
  screen.append(list);
  screen.append(footer);

  function setStatus(message) {
    footer.setContent(message);
    screen.render();
  }

  function formatTask(task) {
    const status = task.done ? '[x]' : '[ ]';
    return `${status} ${task.title}`;
  }

  function refreshList() {
    list.setItems(tasks.map(formatTask));
    if (tasks.length > 0) {
      list.select(Math.min(list.selected ?? 0, tasks.length - 1));
    }
    screen.render();
  }

  async function persistTasks() {
    await saveTasks(tasks);
  }

  async function addTask() {
    prompt.input('New task:', '', async (error, value) => {
      if (error) {
        setStatus(`Error: ${error.message}`);
        return;
      }
      const trimmed = (value || '').trim();
      if (!trimmed) {
        setStatus('Task title is empty.');
        return;
      }
      tasks.push(createTask(trimmed));
      await persistTasks();
      refreshList();
      setStatus('Task added.');
    });
  }

  async function toggleSelected() {
    if (tasks.length === 0) {
      setStatus('No tasks to toggle.');
      return;
    }
    const index = list.selected ?? 0;
    tasks[index] = toggleTask(tasks[index]);
    await persistTasks();
    refreshList();
    setStatus('Task toggled.');
  }

  async function deleteSelected() {
    if (tasks.length === 0) {
      setStatus('No tasks to delete.');
      return;
    }
    const index = list.selected ?? 0;
    tasks.splice(index, 1);
    await persistTasks();
    refreshList();
    setStatus('Task deleted.');
  }

  screen.key(['q', 'C-c'], () => process.exit(0));
  screen.key(['a'], addTask);
  screen.key(['d'], toggleSelected);
  screen.key(['x'], deleteSelected);
  screen.key(['r'], () => {
    refreshList();
    setStatus('Refreshed.');
  });

  refreshList();
  list.focus();
  screen.render();
}

module.exports = {
  runTui,
};
