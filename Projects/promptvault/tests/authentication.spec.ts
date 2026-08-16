import dotenv from 'dotenv';
import path from 'path';

import { test, expect } from '@playwright/test';
import { navigate_signup, register, is_verification_success_visible } from '../pages/sign_up_page';
import { PromptVaultMailTmClient } from '../../../utils/promptvault/mailtm_client';
import { wait_for_loadState } from '../../../base_interactions/utils';

dotenv.config({ path: path.resolve(__dirname, '../.env.pv'), override: true });

// Reset storage state to empty context so this file runs without pre-authentication
test.use({ storageState: { cookies: [], origins: [] } });

// go to sign up page -> sign up -> verify email -> check if the url is 'https://stage.promptvault.us/dashboard' verify this url.
test('PV : SIGNUP PAGE : Sign up and verify email', async ({ page }) => {
  await navigate_signup(page, test, null);
  console.log('NAVIGATING SIGNUP PAGE');

  const client = new PromptVaultMailTmClient();
  const email = await client.create_email();
  console.log('CREATED EMAIL', email);

  await client.get_auth_token();
  await wait_for_loadState(page, test, null, 'domcontentloaded', 1000);
  await register(page, test, null, email.split('@')[0], email, 'Test123@', 'Test123@');
  console.log('REGISTERED');

  await is_verification_success_visible(page, test, null);
  console.log('EMAIL VERIFICATION VISIBLE');

  const verification_url = await client.wait_for_verification_and_get_url();

  await page.goto(verification_url);
  console.log('NAVIGATING TO VERIFICATION URL');
  await wait_for_loadState(page, test, null, 'domcontentloaded', 1000);
  console.log('VERIFIED');
  await expect(page).toHaveURL(/dashboard/);
  console.log('VERIFIED DASHBOARD URL');
});
