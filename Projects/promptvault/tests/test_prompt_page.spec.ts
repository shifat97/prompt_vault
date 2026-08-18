import { test, expect } from '@playwright/test';
import { created_success_toast_is_visible, create_cat, delete_cat, navigate_category } from '../pages/category_page';
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
  change_version,
  check_is_version_changed,
} from '../pages/prompt_detail_page';
import { CATEGORY_DATA, PROMPT_DATA } from '../../../test_data/promptvault/data';

// Create prompt -> Search prompt -> View prompt -> Update prompt -> Delete prompt

test('PV : PROMPT PAGE : CRUD operations on prompt', async ({ page }) => {
  // test.setTimeout(90000); // 90s for this test

  const category_name = CATEGORY_DATA.name;
  const prompt_name = PROMPT_DATA.name;
  const prompt_update_name = PROMPT_DATA.update_name;
  const prompt_description = PROMPT_DATA.description;
  const prompt_update_description = PROMPT_DATA.update_description;

  // Create category
  await navigate_category(page, null, null);
  console.log('NAVIGATING CATEGORY PAGE');
  await create_cat(page, null, null, category_name);
  await created_success_toast_is_visible(page, test, null);
  console.log('CATEGORY CREATED');

  // Create prompt
  await navigate_prompt(page, null, null);
  console.log('NAVIGATING PROMPT PAGE');
  await click_prompt_button(page, null, null);
  console.log('CLICKED PROMPT BUTTON');
  await create_prompt(page, null, null, prompt_name, prompt_description, category_name);
  expect(await is_success_visible(page, null, null)).toBe(true);
  console.log('PROMPT CREATED');

  // Search prompt
  await navigate_prompt(page, null, null);
  console.log('NAVIGATING PROMPT PAGE');
  await search_prompt(page, null, null, prompt_name);
  console.log('PROMPT SEARCHED');
  expect(await is_prompt_search_visible(page, null, null, prompt_name)).toBe(true);
  console.log('PROMPT SEARCHED VERIFIED');

  // View prompt
  await click_view_prompt(page, null, null, prompt_name);
  console.log('VIEWED PROMPT');

  // Update prompt
  console.log('EDITING PROMPT');
  await update_prompt(page, null, null, prompt_update_name);
  await fill_updated_description(page, null, null, prompt_description, prompt_update_description);
  await click_update_button(page, null, null);
  expect(await is_success_visible(page, null, null)).toBe(true);
  console.log('PROMPT UPDATED');

  // Version controll
  const current_page_url = page.url();

  await change_version(page, null, null);
  console.log('VERSION CHANGED');
  await page.goto(current_page_url);
  await check_is_version_changed(page, null, null, prompt_name, prompt_description);
  console.log('VERSION CHANGED VERIFIED');

  // Delete prompt
  console.log('DELETING PROMPT');
  await delete_prompt(page, null, null, prompt_name);
  expect(await is_success_visible(page, null, null)).toBe(true);
  console.log('PROMPT DELETED');

  await navigate_prompt(page, null, null);
  console.log('NAVIGATING PROMPT PAGE');
  await search_prompt(page, null, null, prompt_name);
  console.log('PROMPT SEARCHED');
  expect(await is_no_prompt_found_visible(page, null, null)).toBe(true);
  console.log('NO PROMPT FOUND VERIFIED');

  // Delete category
  await navigate_category(page, null, null);
  console.log('NAVIGATING CATEGORY PAGE');
  await delete_cat(page, null, null, category_name);
  expect(await is_success_visible(page, null, null)).toBe(true);
  console.log('CATEGORY DELETED');
});
