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
