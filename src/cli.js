const { runTui } = require('./tui');
const { generateDailyReport } = require('./report');

function printHelp() {
  console.log(`todotui - terminal todo manager

Usage:
  todotui             Launch TUI
  todotui report      Generate today's report
  todotui report DATE Generate report for YYYY-MM-DD
  todotui --help      Show help
`);
}

async function run(args) {
  const [command, ...rest] = args;

  if (!command || command === 'tui') {
    await runTui();
    return;
  }

  if (command === '--help' || command === '-h' || command === 'help') {
    printHelp();
    return;
  }

  if (command === 'report') {
    try {
      const reportPath = await generateDailyReport(rest[0]);
      console.log(`Report saved to ${reportPath}`);
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
    return;
  }

  console.error(`Unknown command: ${command}`);
  printHelp();
  process.exitCode = 1;
}

module.exports = {
  run,
};
