import { test, expect } from '@playwright/test';
import { created_success_toast_is_visible, create_cat, delete_cat, navigate_category } from '../pages/category_page';
import {
  navigate_prompt,
  click_view_prompt,
  click_prompt_button,
  search_prompt,
  is_prompt_search_visible,
  is_no_prompt_found_visible,
  click_share_prompt,
  click_share_modal_add_button,
  fill_share_input_field,
  share_is_visible,
  click_shared_with_me_tab,
  delete_share,
  no_shared_prompt_found_is_visible,
  delete_from_prompt_page,
  click_shared_prompt,
  edit_with_shared_user,
  click_public_access_button,
  click_generate_link_button,
} from '../pages/prompt_page';
import {
  navigate_to_prompt_page,
  create_prompt,
  update_prompt,
  click_update_button,
  delete_prompt,
  fill_updated_description,
  is_success_visible,
  change_version,
  check_is_version_changed,
  click_back_button,
  prompt_title_matched,
} from '../pages/prompt_detail_page';
import { CATEGORY_DATA, PROMPT_DATA, ADMIN_LOGIN_DATA, MAINTAINER_LOGIN_DATA } from '../../../test_data/promptvault/data';
import { login, navigate_login } from '../pages/login_page';
import { fill_public_search_box, navigate_public_page, prompt_title_is_visible } from '../pages/public_page';

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

test('PV : PROMPT PAGE : Create prompt -> Share prompt with view access -> Login with shared user -> Check shared with me tab', async ({ page, browser }) => {
  const category_name = CATEGORY_DATA.name;
  const prompt_name = PROMPT_DATA.name;
  const prompt_description = PROMPT_DATA.description;

  await navigate_category(page, null, null);
  console.log('NAVIGATING CATEGORY PAGE');
  await create_cat(page, null, null, category_name);
  await created_success_toast_is_visible(page, test, null);
  console.log('CATEGORY CREATED');

  await navigate_prompt(page, null, null);
  console.log('NAVIGATING PROMPT PAGE');
  await click_prompt_button(page, null, null);
  console.log('CLICKED PROMPT BUTTON');
  await create_prompt(page, null, null, prompt_name, prompt_description, category_name);
  expect(await is_success_visible(page, null, null)).toBe(true);
  console.log('PROMPT CREATED');

  await click_back_button(page, null, null);
  console.log('CLICKING BACK BUTTON');

  await click_share_prompt(page, null, null, prompt_name);
  await click_share_modal_add_button(page, null, null);
  await fill_share_input_field(page, null, null, ADMIN_LOGIN_DATA.email!, false);
  await click_share_modal_add_button(page, null, null);

  // Open a new browser context for the guest user
  const guestContext = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  const guestPage = await guestContext.newPage();

  await navigate_login(guestPage, null, null);
  await login(guestPage, null, null, ADMIN_LOGIN_DATA.email!, ADMIN_LOGIN_DATA.password!);

  await navigate_prompt(guestPage, null, null);
  await click_shared_with_me_tab(guestPage, null, null);
  await share_is_visible(guestPage, null, null, prompt_name);
  console.log('SHARE IS VISIBLE');

  // await page.pause();

  await navigate_prompt(page, null, null);
  await click_share_prompt(page, null, null, prompt_name);
  await delete_share(page, null, null);

  await navigate_prompt(guestPage, null, null);
  await click_shared_with_me_tab(guestPage, null, null);

  // Delete prompt
  await navigate_prompt(page, null, null);
  console.log('DELETING PROMPT');
  await delete_from_prompt_page(page, null, null, prompt_name);
  expect(await is_success_visible(page, null, null)).toBe(true);
  console.log('PROMPT DELETED');

  // Delete category
  await navigate_category(page, null, null);
  console.log('NAVIGATING CATEGORY PAGE');
  await delete_cat(page, null, null, category_name);
  expect(await is_success_visible(page, null, null)).toBe(true);
  console.log('CATEGORY DELETED');
});

test('PV : PROMPT PAGE : Create prompt -> Share prompt with edit access -> Login with shared user -> Check shared with me tab -> Click prompt -> Edit prompt -> Check', async ({ page, browser }) => {
  const category_name = CATEGORY_DATA.name;
  const prompt_name = PROMPT_DATA.name;
  const prompt_description = PROMPT_DATA.description;
  const updated_prompt_name = PROMPT_DATA.update_name + ' by shared user';

  await navigate_category(page, null, null);
  console.log('NAVIGATING CATEGORY PAGE');
  await create_cat(page, null, null, category_name);
  await created_success_toast_is_visible(page, test, null);
  console.log('CATEGORY CREATED');

  await navigate_prompt(page, null, null);
  console.log('NAVIGATING PROMPT PAGE');
  await click_prompt_button(page, null, null);
  console.log('CLICKED PROMPT BUTTON');
  await create_prompt(page, null, null, prompt_name, prompt_description, category_name);
  expect(await is_success_visible(page, null, null)).toBe(true);
  console.log('PROMPT CREATED');

  // extract the id from url
  await page.waitForURL(/prompts/);
  const prompt_id = page.url().split('prompts/')[1].split('?')[0];
  console.log(prompt_id);

  await click_back_button(page, null, null);
  console.log('CLICKING BACK BUTTON');

  await click_share_prompt(page, null, null, prompt_name);
  await click_share_modal_add_button(page, null, null);
  await fill_share_input_field(page, null, null, ADMIN_LOGIN_DATA.email!, true);
  await click_share_modal_add_button(page, null, null);

  // Open a new browser context for the guest user
  const guestContext = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  const guestPage = await guestContext.newPage();

  await navigate_login(guestPage, null, null);
  await login(guestPage, null, null, ADMIN_LOGIN_DATA.email!, ADMIN_LOGIN_DATA.password!);

  await navigate_prompt(guestPage, null, null);
  await click_shared_with_me_tab(guestPage, null, null);
  await share_is_visible(guestPage, null, null, prompt_name);
  console.log('SHARE IS VISIBLE');

  // Edit/Update flow starts from here
  await click_shared_prompt(guestPage, null, null, prompt_name);
  await edit_with_shared_user(guestPage, null, null);
  await update_prompt(guestPage, null, null, updated_prompt_name);
  await click_update_button(guestPage, null, null);
  expect(await is_success_visible(guestPage, null, null)).toBe(true);
  console.log('PROMPT UPDATED BY SHARED USER');

  // await page.pause();

  await navigate_prompt(page, null, null);
  await click_share_prompt(page, null, null, updated_prompt_name);
  await delete_share(page, null, null);

  await navigate_prompt(guestPage, null, null);
  await click_shared_with_me_tab(guestPage, null, null);

  await navigate_to_prompt_page(page, null, null, prompt_id);
  await prompt_title_matched(page, null, null, updated_prompt_name);

  // Delete prompt
  await navigate_prompt(page, null, null);
  console.log('DELETING PROMPT');
  await delete_from_prompt_page(page, null, null, updated_prompt_name);
  expect(await is_success_visible(page, null, null)).toBe(true);
  console.log('PROMPT DELETED');

  // Delete category
  await navigate_category(page, null, null);
  console.log('NAVIGATING CATEGORY PAGE');
  await delete_cat(page, null, null, category_name);
  expect(await is_success_visible(page, null, null)).toBe(true);
  console.log('CATEGORY DELETED');
});

test('Go to prompt page -> Share prompt with public access -> Login as random user -> Check if visible in public prompt page -> Check if prompt can be accessed', async ({ page, browser }) => {
  const category_name = CATEGORY_DATA.name;
  const prompt_name = PROMPT_DATA.name;
  const prompt_description = PROMPT_DATA.description;

  const guest_email = MAINTAINER_LOGIN_DATA.email;
  const guest_password = MAINTAINER_LOGIN_DATA.password;

  await navigate_category(page, null, null);
  console.log('NAVIGATING CATEGORY PAGE');
  await create_cat(page, null, null, category_name);
  await created_success_toast_is_visible(page, test, null);
  console.log('CATEGORY CREATED');

  await navigate_prompt(page, null, null);
  console.log('NAVIGATING PROMPT PAGE');
  await click_prompt_button(page, null, null);
  console.log('CLICKED PROMPT BUTTON');
  await create_prompt(page, null, null, prompt_name, prompt_description, category_name);
  expect(await is_success_visible(page, null, null)).toBe(true);
  console.log('PROMPT CREATED');

  // extract the id from url
  await page.waitForURL(/prompts/);
  const prompt_id = page.url().split('prompts/')[1].split('?')[0];
  console.log(prompt_id);

  await click_back_button(page, null, null);
  console.log('CLICKING BACK BUTTON');

  await click_share_prompt(page, null, null, prompt_name);
  await click_share_modal_add_button(page, null, null);
  await click_public_access_button(page, null, null);
  await click_generate_link_button(page, null, null);

  // Open a new browser context for the guest user
  const guestContext = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  const guestPage = await guestContext.newPage();

  await navigate_login(guestPage, null, null);
  await login(guestPage, null, null, guest_email!, guest_password!);

  await navigate_public_page(guestPage, null, null);
  await fill_public_search_box(guestPage, null, null, prompt_name);
  await prompt_title_is_visible(guestPage, null, null, prompt_name);
  console.log('PROMPT IS VISIBLE');

  await navigate_to_prompt_page(guestPage, null, null, prompt_id);
  await prompt_title_matched(guestPage, null, null, prompt_name);
  console.log('PROMPT IS ACCESSIBLE');

  // Delete prompt
  await navigate_prompt(page, null, null);
  console.log('DELETING PROMPT');
  await delete_from_prompt_page(page, null, null, prompt_name);
  expect(await is_success_visible(page, null, null)).toBe(true);
  console.log('PROMPT DELETED');

  // Delete category
  await navigate_category(page, null, null);
  console.log('NAVIGATING CATEGORY PAGE');
  await delete_cat(page, null, null, category_name);
  expect(await is_success_visible(page, null, null)).toBe(true);
  console.log('CATEGORY DELETED');
});
