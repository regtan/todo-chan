# todotui

Terminal UI (TUI) todo manager with JSON persistence and daily markdown reports.

## Installation

```bash
npm install -g todotui
```

Or for local development:

```bash
npm link
```

## Usage

Launch the TUI:

```bash
todotui
```

Generate a daily report:

```bash
todotui report
```

Generate a report for a specific date:

```bash
todotui report 2024-01-01
```

## TUI Controls

- `a` add a task
- `d` toggle done
- `x` delete task
- `r` refresh view
- `q` quit

Tasks and reports are stored under `~/.local/share/todotui/`.
