#!/usr/bin/env node
/**
 * XQ Keeper - API Test Suite CLI
 * 
 * Simple wrapper that passes all arguments to Playwright.
 * Supports --base-url option for API URL configuration.
 * 
 * Install: npm install -g @xq-fitness/gate-keeper
 * Usage:   xq-keeper [--base-url=<url>] [playwright-args]
 */

const { spawn } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);

// Handle help
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
XQ Keeper - API Test Suite

Usage:
  xq-keeper [--base-url=<url>] [playwright-args]

Options:
  --base-url=<url>     Set API base URL (default: http://localhost:8080)
  --help, -h           Show this help

Examples:
  xq-keeper
  xq-keeper test --grep "Create Routine"
  xq-keeper --base-url=http://api.example.com test --grep @smoke
  xq-keeper test --project=api-tests --workers=4

Installation:
  npm install -g @xq-fitness/gate-keeper
  `);
  process.exit(0);
}

// Handle version
if (args.includes('--version') || args.includes('-v')) {
  const pkg = require('../package.json');
  console.log(pkg.version);
  process.exit(0);
}

// Extract --base-url if present
let baseUrl = null;
const playwrightArgs = [];
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--base-url' && args[i + 1]) {
    baseUrl = args[i + 1];
    i++; // Skip next arg
    continue;
  }
  if (arg.startsWith('--base-url=')) {
    baseUrl = arg.split('=')[1];
    continue;
  }
  playwrightArgs.push(arg);
}

// Set environment variable
if (baseUrl) {
  process.env.API_BASE_URL = baseUrl;
}

// Default to 'test' if no command specified
if (playwrightArgs.length === 0 || !playwrightArgs[0].match(/^(test|show-report|codegen|install)$/)) {
  playwrightArgs.unshift('test');
}

// Set environment
process.env.API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

// Find Playwright CLI
// Works both in npm global install and local development
const playwrightBin = path.join(__dirname, '../node_modules/.bin/playwright');

// Run Playwright
const proc = spawn(playwrightBin, playwrightArgs, {
  stdio: 'inherit',
  env: process.env,
  cwd: path.resolve(__dirname, '..'),
  shell: process.platform === 'win32',
});

proc.on('exit', (code) => {
  process.exit(code || 0);
});

proc.on('error', (err) => {
  if (err.code === 'ENOENT') {
    console.error('Error: Playwright not found.');
    console.error('Make sure @playwright/test is installed:');
    console.error('  npm install -g @xq-fitness/gate-keeper');
    console.error('Or if installed locally:');
    console.error('  npm install');
  } else {
    console.error('Error running Playwright:', err.message);
  }
  process.exit(1);
});

