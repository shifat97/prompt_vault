import { test, expect } from '@playwright/test';
import { navigate_login, login } from '../pages/login_page';
import { create_cat, navigate_category } from '../pages/category_page';
import {
  navigate_prompt,
  click_view_prompt,
  click_prompt_button,
  search_prompt,
  is_prompt_search_visible,
  is_no_prompt_found_visible,
} from '../pages/prompt_page';
import {
  create_prompt,
  update_prompt,
  click_update_button,
  delete_prompt,
  fill_updated_description,
  is_success_visible,
} from '../pages/prompt_detail_page';
import { LOGIN_DATA, CATEGORY_DATA, PROMPT_DATA } from '../../../test_data/promptvault/data';

test('PV : PROMPT PAGE : CRUD operations on prompt', async ({ page }) => {
  test.setTimeout(90000); // 90s for this test

  await navigate_login(page, test, null);
  console.log('NAVIGATING LOGIN PAGE');
  await login(page, null, null, LOGIN_DATA.email!, LOGIN_DATA.password!);
  console.log('LOGGED IN');
  await expect(page).toHaveURL(/dashboard/);
  console.log('DASHBOARD URL VERIFIED');

  // Create category
  await navigate_category(page, null, null);
  console.log('NAVIGATING CATEGORY PAGE');
  await create_cat(page, null, null, CATEGORY_DATA.name);
  console.log('CATEGORY CREATED');

  // Create prompt
  await navigate_prompt(page, null, null);
  console.log('NAVIGATING PROMPT PAGE');
  await click_prompt_button(page, null, null);
  console.log('CLICKED PROMPT BUTTON');
  await create_prompt(page, null, null, PROMPT_DATA.name, PROMPT_DATA.description, CATEGORY_DATA.name);
  expect(await is_success_visible(page, null, null)).toBe(true);
  console.log('PROMPT CREATED');

  // Search prompt
  await navigate_prompt(page, null, null);
  console.log('NAVIGATING PROMPT PAGE');
  await search_prompt(page, null, null, PROMPT_DATA.name);
  console.log('PROMPT SEARCHED');
  expect(await is_prompt_search_visible(page, null, null, PROMPT_DATA.name)).toBe(true);
  console.log('PROMPT SEARCHED VERIFIED');

  // View prompt
  await click_view_prompt(page, null, null, PROMPT_DATA.name);
  console.log('VIEWED PROMPT');

  // Update prompt
  console.log('EDITING PROMPT');
  await update_prompt(page, null, null, PROMPT_DATA.update_name);
  await fill_updated_description(page, null, null, PROMPT_DATA.description, PROMPT_DATA.update_description);
  await click_update_button(page, null, null);
  expect(await is_success_visible(page, null, null)).toBe(true);
  console.log('PROMPT UPDATED');

  // Delete prompt
  console.log('DELETING PROMPT');
  await delete_prompt(page, null, null, PROMPT_DATA.name);
  expect(await is_success_visible(page, null, null)).toBe(true);
  console.log('PROMPT DELETED');

  await navigate_prompt(page, null, null);
  console.log('NAVIGATING PROMPT PAGE');
  await search_prompt(page, null, null, PROMPT_DATA.name);
  console.log('PROMPT SEARCHED');
  expect(await is_no_prompt_found_visible(page, null, null)).toBe(true);
  console.log('NO PROMPT FOUND VERIFIED');
});
