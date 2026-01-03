import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env file from api-tests-poc directory
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
    baseURL: process.env.API_BASE_URL || 'http://localhost:8080/xq-fitness-write-service/api/v1',
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

