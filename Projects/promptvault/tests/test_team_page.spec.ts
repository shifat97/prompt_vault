import { test, expect } from '@playwright/test';
import { navigate_login, login } from '../pages/login_page';
import { click_new_team_button, create_team, search_team, search_is_visible, update_prompt, delete_prompt, navigate_team } from '../pages/team_page';

import { LOGIN_DATA, TEAM_DATA } from '../../../test_data/promptvault/data';

// Login -> Create Team -> Search -> Update Team -> Search With Update String -> Delete Team -> Verify
test.only('PV : TEAM PAGE : CRUD operations on team', async ({ page }) => {
  await navigate_login(page, test, null);
  console.log('NAVIGATING LOGIN PAGE');
  await login(page, test, null, LOGIN_DATA.email!, LOGIN_DATA.password!);
  console.log('LOGGED IN');
  await expect(page).toHaveURL(/dashboard/);
  console.log('DASHBOARD URL VERIFIED');
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
