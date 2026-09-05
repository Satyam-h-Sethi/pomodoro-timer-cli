# pomodoro-timer-cli

A minimal, zero-dependency interactive Pomodoro timer for your terminal featuring real-time ASCII progress bars, pause/resume, and customizable cycle tracking.

## What it does

Runs standard or customized Pomodoro productivity intervals directly in the terminal, automatically cycling between focus periods, short breaks, and long breaks with live progress bars and audio bell notifications.

## Features

- **Zero dependencies**: Pure Node.js standard library.
- **Interactive controls**:
  - `[Space]` — Pause / Resume
  - `[s]` — Skip current phase
  - `[q]` — Quit and show summary
- **Dynamic ASCII progress bar**: Displays elapsed percentages and remaining time.
- **Configurable intervals**: Customize work duration, break duration, long break duration, and cycles.

## Setup

Requires Node.js (v14+). No dependencies to install.

```bash
cd pomodoro-timer-cli
```

## Run command

```bash
node index.js
```

Or start with custom durations:
```bash
node index.js --work 50 --break 10 --cycles 4
```

## Example usage

```bash
# Start standard 25m work / 5m break session
node index.js

# Start 45m work, 15m short break, 30m long break every 3 cycles
node index.js -w 45 -b 15 -l 30 -c 3

# View help
node index.js --help
```
