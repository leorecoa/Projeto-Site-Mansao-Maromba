import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ quiet: true });
const defaultBaseUrl = 'http://127.0.0.1:5173';
const baseUrl = process.env.PLAYWRIGHT_BASE_URL || defaultBaseUrl;
const baseUrlConfig = new URL(baseUrl);
const webHost = baseUrlConfig.hostname;
const webPort = baseUrlConfig.port || '5173';
const userStorageStatePath = path.resolve(process.cwd(), 'tests/e2e/.auth/user.json');
const hasUserStorageState = fs.existsSync(userStorageStatePath);

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60000,

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: baseUrl,
    trace: 'on-first-retry',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  webServer: {
    command: `npm run dev -- --host ${webHost} --port ${webPort} --strictPort`,
    url: baseUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(hasUserStorageState ? { storageState: 'tests/e2e/.auth/user.json' } : {}),
      },
      dependencies: ['setup'],
    },
  ],
});
