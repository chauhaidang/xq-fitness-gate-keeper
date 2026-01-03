#!/usr/bin/env node
/**
 * XQ Keeper - API Test Suite CLI
 * 
 * Simple wrapper that passes all arguments to Playwright.
 * API base URL can be configured via API_BASE_URL environment variable.
 * 
 * Install: npm install -g @xq-fitness/gate-keeper
 * Usage:   xq-keeper [playwright-args]
 *          API_BASE_URL=http://api.example.com xq-keeper test
 */

const { spawn } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);

// Handle help
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
XQ Keeper - API Test Suite

Usage:
  xq-keeper [playwright-args]

Options:
  --help, -h           Show this help

Examples:
  xq-keeper
  xq-keeper test --grep "Create Routine"
  xq-keeper test --project=api-tests --workers=4
  xq-keeper test --grep @smoke

Environment Variables:
  API_BASE_URL         API base URL (default: http://localhost:8080)

Examples with environment variable:
  API_BASE_URL=http://api.example.com xq-keeper test --grep @smoke

Installation:
  npm install -g @chauhaidang/gate-keeper
  `);
  process.exit(0);
}

// Handle version
if (args.includes('--version') || args.includes('-v')) {
  const pkg = require('../package.json');
  console.log(pkg.version);
  process.exit(0);
}

// All arguments are passed to Playwright
const playwrightArgs = args;

// Default to 'test' if no command specified
if (playwrightArgs.length === 0 || !playwrightArgs[0].match(/^(test|show-report|codegen|install)$/)) {
  playwrightArgs.unshift('test');
}

// Set environment variable with default fallback
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

