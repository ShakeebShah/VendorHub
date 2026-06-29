const { spawn } = require('node:child_process');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const processes = [];

function run(name, args) {
  const command = process.platform === 'win32' ? 'cmd.exe' : 'npm';
  const commandArgs = process.platform === 'win32'
    ? ['/d', '/s', '/c', 'npm', ...args]
    : args;

  const child = spawn(command, commandArgs, {
    cwd: rootDir,
    stdio: 'inherit',
    shell: false,
    windowsVerbatimArguments: false,
  });

  child.on('exit', (code, signal) => {
    if (signal) return;
    if (code !== 0 && !shuttingDown) {
      console.error(`${name} exited with code ${code}`);
      shutdown(code);
    }
  });

  processes.push(child);
}

let shuttingDown = false;

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of processes) {
    if (!child.killed) child.kill('SIGTERM');
  }

  setTimeout(() => process.exit(code), 300);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

run('backend', ['--prefix', 'src/backend', 'run', 'dev']);
run('frontend', ['--prefix', 'src/frontend', 'run', 'dev']);
