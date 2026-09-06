# pomodoro-timer-cli

[![Live Demo](https://img.shields.io/badge/Live_Demo-pomodoro.satyamsethi.dpdns.org-3b82f6?style=for-the-badge&logo=cloudflare&logoColor=white)](https://pomodoro.satyamsethi.dpdns.org)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-Deployment-F38020?style=for-the-badge&logo=cloudflarepages&logoColor=white)](https://pomodoro-timer-cli.pages.dev)

A minimal, zero-dependency interactive Pomodoro timer for terminal and browser featuring real-time progress indicators, pause/resume, customizable intervals, and audio alerts.

## 🌐 Live Demo

- **Primary Custom Domain**: [https://pomodoro.satyamsethi.dpdns.org](https://pomodoro.satyamsethi.dpdns.org)
- **Cloudflare Pages Direct**: [https://pomodoro-timer-cli.pages.dev](https://pomodoro-timer-cli.pages.dev)

## What it does

Runs Pomodoro productivity intervals directly in your terminal or via a sleek, responsive browser UI. Cycles between focus periods, short breaks, and long breaks with progress animations and chime notifications.

## Features

- **Interactive Web App**: Responsive circular progress ring, customizable timers, cycle counters, and Web Audio chimes.
- **Zero dependencies**: Pure Node.js and vanilla HTML5/CSS3.
- **Terminal CLI Mode**: Dynamic ASCII progress bar with hotkeys (`[Space]`, `[s]`, `[q]`).
- **Configurable durations**: Adjust work, short break, and long break intervals on the fly.

## Setup

Requires Node.js (v14+). No external packages.

```bash
cd pomodoro-timer-cli
```

## Run command

### Launch Web UI
```bash
node index.js --web
# Open http://localhost:3000
```
*(Or simply open `index.html` in your browser)*

### Terminal CLI
```bash
node index.js --work 25 --break 5 --cycles 4
```

## Example usage

```bash
# Launch web dashboard on port 8080
node index.js --web 8080

# 50m work, 10m break in CLI
node index.js -w 50 -b 10 -l 20 -c 4
```
