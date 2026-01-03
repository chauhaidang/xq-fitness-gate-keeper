import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Define __dirname for ESM compatibility (Node.js 20.11.0+)
// Playwright loads this file as ESM at runtime, so import.meta.dirname is available
// @ts-expect-error - TypeScript sees this as CommonJS, but Playwright loads it as ESM
const __dirname = import.meta.dirname;

dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Playwright configuration for API testing POC
 * API tests use request fixture - no browser needed
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // Sequential by default for POC
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Sequential execution for POC
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'reports/test-results.json' }],
  ],
  use: {
    baseURL: process.env.API_BASE_URL || 'http://localhost:8080',
    trace: 'on-first-retry',
    // API tests don't need browser context
  },
  projects: [
    {
      name: 'api-tests',
      testMatch: /.*\.spec\.ts/,
    },
  ],
  // Timeout for each test
  timeout: 60000, // 60 seconds
  // Global setup/teardown can be added here if needed
});

