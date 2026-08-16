import { defineConfig, devices, type Project } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables dynamically based on PROJECT_NAME
const projectName = process.env.PROJECT_NAME || 'promptvault';
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, `Projects/${projectName}/.env.*`), override: true });

const deviceType = process.env.DEVICE_TYPE || 'desktop';

const projects: Project[] = [];

// Dynamic Path to auth storage file based on PROJECT_NAME (supports all projects under Projects/)
const authStateFile = `playwright/.auth/${projectName}_user.json`;

// Setup Project: Runs auth.setup.ts before main tests
projects.push({
  name: 'setup',
  testMatch: /.*\.setup\.ts/,
});

// Configure device project with dependencies & storageState
if (deviceType === 'mobile') {
  projects.push({
    name: 'Android Chrome',
    dependencies: ['setup'], // Ensures setup project runs first
    use: {
      ...devices['Pixel 5'],
      storageState: authStateFile, // Reuse saved authentication state
    },
  });
} else if (deviceType === 'ios') {
  projects.push({
    name: 'iPhone Safari',
    dependencies: ['setup'], // Ensures setup project runs first
    use: {
      ...devices['iPhone 12'],
      viewport: { width: 390, height: 844 }, // exact iPhone 12 CSS viewport
      storageState: authStateFile, // Reuse saved authentication state
    },
  });
} else {
  projects.push({
    name: 'Desktop Chrome',
    dependencies: ['setup'], // Ensures setup project runs first
    use: {
      ...devices['Desktop Chrome'],
      storageState: authStateFile, // Reuse saved authentication state
    },
  });
}

const traceMode = (process.env.TRACE as 'on' | 'off' | 'retain-on-failure' | 'on-first-retry') || 'retain-on-failure';

export default defineConfig({
  timeout: 0,
  fullyParallel: true,
  retries: Number(process.env.RETRIES) || 0,
  workers: Number(process.env.WORKERS) || 1,
  testDir: `./Projects/${process.env.PROJECT_NAME || 'promptvault'}`,
  testMatch: '**/*.spec.ts',
  reporter: 'html',
  use: {
    headless: !!process.env.CI,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: Number(process.env.ACTION_TIMEOUT) || 15000,
    navigationTimeout: Number(process.env.NAV_TIMEOUT) || 30000,
    launchOptions: {
      slowMo: 0,
    },
    trace: traceMode,
    acceptDownloads: true,
  },
  projects,
});
