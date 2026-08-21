import { test, expect } from '@playwright/test';
import { click_new_team_button, create_team, search_team, search_is_visible, update_team, delete_team, navigate_team } from '../pages/team_page';
import { created_success_toast_is_visible, create_cat, navigate_category, delete_cat, deleted_success_toast_is_visible } from '../pages/category_page';
import { navigate_prompt, click_prompt_button, search_prompt, is_prompt_search_visible, click_view_prompt, is_no_prompt_found_visible } from '../pages/prompt_page';
import { create_prompt, update_prompt, delete_prompt, fill_updated_description, click_update_button, is_success_visible } from '../pages/prompt_detail_page';

import { select_team, change_team } from '../pages/header';

import { TEAM_DATA, PROMPT_DATA, CATEGORY_DATA } from '../../../test_data/promptvault/data';

// Create Team -> Search -> Update Team -> Search Updated String -> Delete Team
test('PV : TEAM PAGE : Perform full CRUD lifecycle and search verification on Team', async ({ page }) => {
  const team_name = TEAM_DATA.name;
  const team_update_name = TEAM_DATA.update_name;
  const team_description = TEAM_DATA.description;
  const team_update_description = TEAM_DATA.update_description;

  await navigate_team(page, test, null);
  console.log('NAVIGATING TEAM PAGE');
  await click_new_team_button(page, test, null);
  console.log('NEW TEAM BUTTON CLICKED');
  await create_team(page, test, null, team_name, team_description);
  console.log('TEAM CREATED');
  await search_team(page, test, null, team_name);
  console.log('TEAM SEARCHED');
  await search_is_visible(page, test, null, team_name);
  console.log('SEARCH IS SHOWING');
  await update_team(page, test, null, team_update_name, team_update_description, team_name);
  console.log('TEAM UPDATED');
  await search_team(page, test, null, team_update_name);
  console.log('TEAM SEARCHED WITH UPDATE STRING');
  await search_is_visible(page, test, null, team_update_name);
  console.log('SEARCH IS SHOWING WITH UPDATED STRING');
  await delete_team(page, test, null, team_update_name);
  console.log('TEAM DELETED');
});

/* 
  Create Team -> Switch Team in Category Page -> Create Category -> Switch Team in Prompt Page ->
  Create, Update, & Delete Prompt -> Delete Category -> Delete Team
*/
test('PV : TEAM PAGE : End-to-end CRUD workflow across Team, Category, and Prompt entities', async ({ page }) => {
  const category_name = CATEGORY_DATA.name;
  const team_name = TEAM_DATA.name;
  const team_description = TEAM_DATA.description;
  const prompt_name = PROMPT_DATA.name;
  const prompt_update_name = PROMPT_DATA.update_name;
  const prompt_description = PROMPT_DATA.description;
  const prompt_update_description = PROMPT_DATA.update_description;

  await navigate_team(page, test, null);
  console.log('NAVIGATING TEAM PAGE');
  await click_new_team_button(page, test, null);
  console.log('NEW TEAM BUTTON CLICKED');
  await create_team(page, test, null, team_name, team_description);
  console.log('TEAM CREATED');

  // Nevigate to category page
  await navigate_category(page, test, null);
  console.log('NAVIGATING CATEGORY PAGE');

  await change_team(page, null, null);
  console.log('TEAM DROPDOWN CLICKED');
  await select_team(page, null, null, team_name);
  console.log('TEAM SELECTED');

  await create_cat(page, null, null, category_name);
  console.log('CATEGORY CREATED');
  await created_success_toast_is_visible(page, test, null);
  console.log('SUCCESS TOAST VERIFIED');

  await navigate_prompt(page, null, null);
  console.log('NAVIGATING PROMPT PAGE');

  await change_team(page, null, null);
  console.log('TEAM DROPDOWN CLICKED');
  await select_team(page, null, null, team_name);
  console.log('TEAM SELECTED');

  await click_prompt_button(page, null, null);
  console.log('CLICKED PROMPT BUTTON');
  await create_prompt(page, null, null, prompt_name, prompt_description, category_name);
  expect(await is_success_visible(page, null, null)).toBe(true);
  console.log('PROMPT CREATED');

  await navigate_prompt(page, null, null);
  console.log('NAVIGATING PROMPT PAGE');

  await change_team(page, null, null);
  console.log('TEAM DROPDOWN CLICKED');
  await select_team(page, null, null, team_name);
  console.log('TEAM SELECTED');

  // await search_prompt(page, null, null, prompt_name);
  // console.log('PROMPT SEARCHED');
  // expect(await is_prompt_search_visible(page, null, null, prompt_name)).toBe(true);
  // console.log('PROMPT SEARCHED VERIFIED');

  await click_view_prompt(page, null, null, prompt_name);
  console.log('VIEW PROMPT CLICKED');

  // Update prompt
  console.log('EDITING PROMPT');
  await update_prompt(page, null, null, prompt_update_name);
  await fill_updated_description(page, null, null, prompt_description, prompt_update_description);
  await click_update_button(page, null, null);
  expect(await is_success_visible(page, null, null)).toBe(true);
  console.log('PROMPT UPDATED');

  // Delete prompt
  console.log('DELETING PROMPT');
  await delete_prompt(page, null, null, prompt_name);
  expect(await is_success_visible(page, null, null)).toBe(true);
  console.log('PROMPT DELETED');

  // Verify prompt delete
  await navigate_prompt(page, null, null);
  console.log('NAVIGATING PROMPT PAGE');

  await change_team(page, null, null);
  console.log('TEAM DROPDOWN CLICKED');
  await select_team(page, null, null, team_name);
  console.log('TEAM SELECTED');

  await search_prompt(page, null, null, prompt_name);
  console.log('PROMPT SEARCHED');
  expect(await is_no_prompt_found_visible(page, null, null)).toBe(true);
  console.log('NO PROMPT FOUND VERIFIED');

  // Verify category delete
  await navigate_category(page, null, null);
  console.log('NAVIGATING CATEGORY PAGE');

  await change_team(page, test, null);
  console.log('TEAM DROPDOWN CLICKED');
  await select_team(page, test, null, team_name);
  console.log('TEAM SELECTED');

  await delete_cat(page, test, null, category_name);
  await deleted_success_toast_is_visible(page, test, null);
  console.log('CATEGORY DELETED');

  // Verify team delete
  await navigate_team(page, null, null);
  console.log('NAVIGATING TEAM PAGE');

  await search_team(page, test, null, team_name);
  console.log('TEAM SEARCHED');
  await search_is_visible(page, test, null, team_name);
  console.log('SEARCH IS SHOWING');
  await delete_team(page, test, null, team_name);
  console.log('TEAM DELETED');
});
