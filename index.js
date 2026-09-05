#!/usr/bin/env node
const readline = require('readline');

// ANSI Colors
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const GRAY = '\x1b[90m';

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    work: 25,
    breakTime: 5,
    longBreak: 15,
    cycles: 4,
    testMode: false,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--work' || arg === '-w') {
      options.work = parseFloat(args[++i]) || options.work;
    } else if (arg === '--break' || arg === '-b') {
      options.breakTime = parseFloat(args[++i]) || options.breakTime;
    } else if (arg === '--long-break' || arg === '-l') {
      options.longBreak = parseFloat(args[++i]) || options.longBreak;
    } else if (arg === '--cycles' || arg === '-c') {
      options.cycles = parseInt(args[++i], 10) || options.cycles;
    } else if (arg === '--test') {
      options.testMode = true;
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    }
  }

  return options;
}

function showHelp() {
  console.log(`
${BOLD}Pomodoro Timer CLI${RESET}
A minimal, zero-dependency productivity timer for your terminal.

${BOLD}Usage:${RESET}
  node index.js [options]

${BOLD}Options:${RESET}
  -w, --work <min>        Work duration in minutes (default: 25)
  -b, --break <min>       Short break duration in minutes (default: 5)
  -l, --long-break <min>  Long break duration in minutes (default: 15)
  -c, --cycles <count>    Number of cycles before long break (default: 4)
  --test                  Quick sanity test run (1-second intervals)
  -h, --help              Display this help message

${BOLD}Controls during timer:${RESET}
  [Space]  Pause / Resume
  [s]      Skip to next phase
  [q]      Quit
`);
}

function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function createProgressBar(percent, width = 30) {
  const completed = Math.round(width * percent);
  const remaining = width - completed;
  const bar = '█'.repeat(completed) + '░'.repeat(remaining);
  return `[${bar}] ${Math.round(percent * 100)}%`;
}

class PomodoroTimer {
  constructor(options) {
    this.options = options;
    this.currentCycle = 1;
    this.currentPhase = 'WORK'; // 'WORK', 'BREAK', 'LONG_BREAK'
    this.isPaused = false;
    this.totalDuration = 0;
    this.remainingSeconds = 0;
    this.timerId = null;
    this.completedPomodoros = 0;
  }

  start() {
    this.setupKeypress();
    this.initPhase('WORK');
  }

  initPhase(phase) {
    this.currentPhase = phase;
    let minutes = this.options.work;

    if (phase === 'BREAK') {
      minutes = this.options.breakTime;
    } else if (phase === 'LONG_BREAK') {
      minutes = this.options.longBreak;
    }

    this.totalDuration = Math.max(1, Math.round(minutes * (this.options.testMode ? 1 : 60)));
    this.remainingSeconds = this.totalDuration;

    this.render();
    this.runLoop();
  }

  setupKeypress() {
    if (process.stdin.isTTY) {
      readline.emitKeypressEvents(process.stdin);
      process.stdin.setRawMode(true);
      process.stdin.on('keypress', (str, key) => {
        if (!key) return;
        if (key.name === 'q' || (key.ctrl && key.name === 'c')) {
          this.stop();
          console.log(`\n${YELLOW}Session stopped. Completed Pomodoros: ${this.completedPomodoros}${RESET}\n`);
          process.exit(0);
        } else if (key.name === 'space') {
          this.togglePause();
        } else if (key.name === 's') {
          this.nextPhase();
        }
      });
    }
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    this.render();
  }

  runLoop() {
    if (this.timerId) clearInterval(this.timerId);
    const intervalMs = this.options.testMode ? 100 : 1000;

    this.timerId = setInterval(() => {
      if (this.isPaused) return;

      this.remainingSeconds--;
      this.render();

      if (this.remainingSeconds <= 0) {
        clearInterval(this.timerId);
        this.onPhaseComplete();
      }
    }, intervalMs);
  }

  onPhaseComplete() {
    // Ring terminal bell
    process.stdout.write('\x07');

    if (this.currentPhase === 'WORK') {
      this.completedPomodoros++;
      if (this.currentCycle % this.options.cycles === 0) {
        this.initPhase('LONG_BREAK');
      } else {
        this.initPhase('BREAK');
      }
    } else {
      if (this.currentPhase === 'LONG_BREAK') {
        this.currentCycle = 1;
      } else {
        this.currentCycle++;
      }
      this.initPhase('WORK');
    }
  }

  nextPhase() {
    if (this.timerId) clearInterval(this.timerId);
    this.onPhaseComplete();
  }

  stop() {
    if (this.timerId) clearInterval(this.timerId);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
  }

  render() {
    const percent = Math.min(1, Math.max(0, (this.totalDuration - this.remainingSeconds) / this.totalDuration));
    const timeStr = formatTime(this.remainingSeconds);
    const progress = createProgressBar(percent);

    let phaseColor = CYAN;
    let phaseLabel = '💼 WORK TIME';
    if (this.currentPhase === 'BREAK') {
      phaseColor = GREEN;
      phaseLabel = '☕ SHORT BREAK';
    } else if (this.currentPhase === 'LONG_BREAK') {
      phaseColor = YELLOW;
      phaseLabel = '🌴 LONG BREAK';
    }

    const pauseIndicator = this.isPaused ? ` ${RED}[PAUSED]${RESET}` : '';

    if (process.stdout.isTTY) {
      readline.cursorTo(process.stdout, 0);
      readline.clearLine(process.stdout, 0);
      process.stdout.write(
        `${phaseColor}${BOLD}${phaseLabel}${RESET} | Cycle ${this.currentCycle}/${this.options.cycles} | ${BOLD}${timeStr}${RESET} ${progress}${pauseIndicator} `
      );
    } else {
      // Non-interactive fallback
      console.log(`[${this.currentPhase}] Cycle: ${this.currentCycle} | Time Left: ${timeStr} | Pomodoros: ${this.completedPomodoros}`);
    }
  }
}

function startWebServer(port = 3000) {
  const http = require('http');
  const fs = require('fs');
  const path = require('path');
  const htmlPath = path.join(__dirname, 'index.html');

  const server = http.createServer((req, res) => {
    if (fs.existsSync(htmlPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(fs.readFileSync(htmlPath));
    } else {
      res.writeHead(404);
      res.end('Web UI not found');
    }
  });

  server.listen(port, () => {
    console.log(`Pomodoro Timer Web UI running at http://localhost:${port}`);
  });
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--web')) {
    const portIndex = args.indexOf('--web');
    const port = parseInt(args[portIndex + 1], 10) || 3000;
    startWebServer(port);
    return;
  }

  const options = parseArgs();
  if (options.help) {
    showHelp();
    return;
  }

  console.log(`\n${BOLD}🍅 Pomodoro Timer CLI${RESET}`);
  console.log(`${GRAY}Work: ${options.work}m | Break: ${options.breakTime}m | Long Break: ${options.longBreak}m | Cycles: ${options.cycles}${RESET}`);
  console.log(`${GRAY}Press [Space] to pause, [s] to skip, [q] to quit${RESET}\n`);

  const timer = new PomodoroTimer(options);
  timer.start();

  if (options.testMode) {
    setTimeout(() => {
      timer.stop();
      console.log(`\n${GREEN}✓ Sanity test completed successfully.${RESET}`);
      process.exit(0);
    }, 500);
  }
}

if (require.main === module) {
  main();
}

module.exports = { PomodoroTimer, formatTime, createProgressBar };
