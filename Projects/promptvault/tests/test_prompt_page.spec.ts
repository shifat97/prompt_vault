import { test, expect } from '@playwright/test';
import { navigate_login, login } from '../pages/login_page';
import { create_cat, navigate_category } from '../pages/category_page';
import { navigate_prompt, click_prompt_button } from '../pages/prompt_page';
import { create_prompt, is_success_visible } from '../pages/prompt_detail_page';
import { LOGIN_DATA, CATEGORY_DATA, PROMPT_DATA } from '../../../test_data/promptvault/data';

test('PV : PROMPT PAGE : CRUD operations on prompt', async ({ page }) => {
  // Sing in -> Verify dashboard url -> Go to cat page -> Create cat -> Go to prompt page -> Click click_prompt_button -> create_prompt
  await navigate_login(page, test, null);
  console.log('NAVIGATING LOGIN PAGE');
  await login(page, test, null, LOGIN_DATA.email!, LOGIN_DATA.password!);
  console.log('LOGGED IN');
  await expect(page).toHaveURL(/dashboard/);
  console.log('DASHBOARD URL VERIFIED');
  await navigate_category(page, test, null);
  console.log('NAVIGATING CATEGORY PAGE');
  await create_cat(page, test, null, CATEGORY_DATA.name);
  console.log('CATEGORY CREATED');
  await navigate_prompt(page, test, null);
  console.log('NAVIGATING PROMPT PAGE');
  await click_prompt_button(page, test, null);
  console.log('CLICKED PROMPT BUTTON');
  await create_prompt(page, test, null, PROMPT_DATA.name, PROMPT_DATA.description, CATEGORY_DATA.name);
  console.log('PROMPT CREATED');
  expect(await is_success_visible(page, test, null)).toBe(true);
});
