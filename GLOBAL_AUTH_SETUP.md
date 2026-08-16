# Global Authentication Setup Guide for PromptVault

This guide provides step-by-step instructions to implement Playwright Global Authentication (Storage State) for `Projects/promptvault`.

Using global authentication saves browser state (cookies, localStorage, session storage) after logging in **once**, and reuses that state across all tests. This significantly speeds up test execution and reduces repetitive login code.

---

## 1. Project Structure Analysis

Currently, the `promptvault` project uses procedural helper functions for page interactions and environment configuration:

- **Environment Config:** `Projects/promptvault/.env.pv` contains `BASE_URL`, `TEST_EMAIL`, and `TEST_PASSWORD`.
- **Test Data Loader:** `test_data/promptvault/data.ts` loads environment variables into `LOGIN_DATA`.
- **Page Functions:** `Projects/promptvault/pages/login_page.ts` provides `navigate_login(page, test, ai)` and `login(page, test, ai, email, password)`.
- **Test Files:** Tests such as `test_team_page.spec.ts` and `test_category_page.spec.ts` currently call `navigate_login` and `login` manually inside every test.

---

## 2. Implementation Steps

### Step 1: Ignore Auth Storage Directory in `.gitignore`

Authentication state files store sensitive session tokens and cookies. Add the `.auth` directory to `.gitignore`.

Open `.gitignore` and add:

```gitignore
# Playwright Auth state files
playwright/.auth/
```

---

### Step 2: Create Auth Setup Spec File

Create a new file at `Projects/promptvault/tests/auth.setup.ts`.

```typescript
import { test as setup, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { navigate_login, login } from '../pages/login_page';
import { LOGIN_DATA } from '../../../test_data/promptvault/data';

// Load environment variables for promptvault
dotenv.config({ path: path.resolve(__dirname, '../.env.pv'), override: true });

const projectName = process.env.PROJECT_NAME || 'promptvault';
const authFile = `playwright/.auth/${projectName}_user.json`;

setup('authenticate promptvault user', async ({ page }) => {
  console.log('🔒 Performing global authentication for PromptVault...');

  // 1. Navigate to login page
  await navigate_login(page, setup, null);

  // 2. Perform login using configured credentials
  const email = LOGIN_DATA.email || process.env.TEST_EMAIL!;
  const password = LOGIN_DATA.password || process.env.TEST_PASSWORD!;
  await login(page, setup, null, email, password);

  // 3. Verify successful navigation to dashboard
  await expect(page).toHaveURL(/.*\/dashboard/);
  console.log('✅ Dashboard reached successfully.');

  // 4. Save storage state (cookies, localStorage, etc.)
  await page.context().storageState({ path: authFile });
  console.log(`💾 Auth state saved to ${authFile}`);
});
```

---

### Step 3: Configure `playwright.config.ts`

Create or update `playwright.config.ts` in the root directory (`d:\Workspace\playwright_automation\playwright.config.ts`) to include project setup dependencies alongside your organization's dynamic device configuration:

```typescript
import { defineConfig, devices, type Project } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables dynamically based on PROJECT_NAME
const projectName = process.env.PROJECT_NAME || 'promptvault';
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, `Projects/${projectName}/.env.pv`), override: true });

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
  testMatch: ['**/*.spec.ts', '**/*.setup.ts'],
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
```

---

### Step 4: Refactor Test Files to Reuse Saved State

Now that browser sessions start already logged in, you can remove manual login calls from tests like `test_team_page.spec.ts` and `test_category_page.spec.ts`.

#### Example: Refactored `Projects/promptvault/tests/test_team_page.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { click_new_team_button, create_team, search_team, search_is_visible, update_prompt, delete_prompt, navigate_team } from '../pages/team_page';
import { TEAM_DATA } from '../../../test_data/promptvault/data';

test('PV : TEAM PAGE : CRUD operations on team', async ({ page }) => {
  // Directly navigate to Team Page because user is already authenticated!
  await navigate_team(page, test, null);
  console.log('NAVIGATING TEAM PAGE');

  await click_new_team_button(page, test, null);
  console.log('NEW TEAM BUTTON CLICKED');

  await create_team(page, test, null, TEAM_DATA.name, TEAM_DATA.description);
  console.log('TEAM CREATED');

  await search_team(page, test, null, TEAM_DATA.name);
  console.log('TEAM SEARCHED');

  await search_is_visible(page, test, null, TEAM_DATA.name);
  console.log('SEARCH IS SHOWING');

  await update_prompt(page, test, null, TEAM_DATA.update_name, TEAM_DATA.update_description);
  console.log('TEAM UPDATED');

  await search_team(page, test, null, TEAM_DATA.update_name);
  console.log('TEAM SEARCHED WITH UPDATE STRING');

  await search_is_visible(page, test, null, TEAM_DATA.update_name);
  console.log('SEARCH IS SHOWING WITH UPDATED STRING');

  await delete_prompt(page, test, null);
  console.log('TEAM DELETED');
});
```

#### Example: Refactored `Projects/promptvault/tests/test_category_page.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { create_cat, is_not_cat_found_text_visible, navigate_category, search_cat, update_cat, delete_cat } from '../pages/category_page';
import { CATEGORY_DATA } from '../../../test_data/promptvault/data';

test('PV : CATEGORY PAGE : CRUD operations on category', async ({ page }) => {
  // Directly navigate to Category Page because user is already authenticated!
  await navigate_category(page, test, null);
  console.log('NAVIGATING CATEGORY PAGE');

  await create_cat(page, test, null, CATEGORY_DATA.name);
  console.log('CATEGORY CREATED');

  await search_cat(page, test, null, CATEGORY_DATA.name);
  console.log('CATEGORY SEARCHED');

  await update_cat(page, test, null, CATEGORY_DATA.name, CATEGORY_DATA.update_string);
  console.log('CATEGORY UPDATED');

  await search_cat(page, test, null, CATEGORY_DATA.update_string);
  console.log('CATEGORY SEARCHED WITH UPDATED STRING');

  await delete_cat(page, test, null, CATEGORY_DATA.update_string);
  console.log('CATEGORY DELETED');

  expect(await is_not_cat_found_text_visible(page, test, null, CATEGORY_DATA.update_string)).toBe(true);
  console.log('CATEGORY DELETED VERIFIED');
});
```

---

## 3. How to Run the Tests

To run the tests with global authentication:

```bash
npm run test:pv
```

When triggered:

1. Playwright will first execute `auth.setup.ts` under the `setup` project.
2. `auth.setup.ts` logs in and saves session data to `playwright/.auth/<PROJECT_NAME>_user.json` (e.g. `playwright/.auth/promptvault_user.json`).
3. Playwright will then run the main test suite under the `promptvault` project using the pre-authenticated state!

---

## 4. Bypassing Global Auth for Specific Tests (e.g., Login Tests)

For tests that explicitly verify the **Login Page itself** (such as negative testing, form validation, invalid credentials, or logout flows), you must start with a clean, unauthenticated browser context.

Playwright provides two approaches:

### Option 1: File-Level Reset using `test.use()` (Recommended)

At the top of your login test file (e.g., `Projects/promptvault/tests/test_login.spec.ts`), reset `storageState` to empty cookies and origins:

```typescript
import { test, expect } from '@playwright/test';
import { navigate_login, login } from '../pages/login_page';

// 💡 Reset storage state to empty context so this file runs without pre-authentication
test.use({ storageState: { cookies: [], origins: [] } });

test('PV : LOGIN PAGE : Verify invalid login credentials', async ({ page }) => {
  await navigate_login(page, test, null);
  await login(page, test, null, 'invalid@example.com', 'wrongpassword');

  // Verify error banner is visible
  await expect(page.locator('.error-message')).toBeVisible();
});
```

### Option 2: Config-Level Separation in `playwright.config.ts`

Alternatively, you can configure an unauthenticated project in `playwright.config.ts` specifically for login tests that skips the setup dependency:

```typescript
// Project for testing login / registration pages (unauthenticated)
projects.push({
  name: 'unauthenticated-tests',
  testMatch: /.*login\.spec\.ts/,
  use: {
    storageState: { cookies: [], origins: [] }, // Empty state
  },
});
```
