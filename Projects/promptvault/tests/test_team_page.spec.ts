import { test } from '@playwright/test';
import {
  click_new_team_button,
  create_team,
  search_team,
  search_is_visible,
  update_prompt,
  delete_prompt,
  navigate_team,
} from '../pages/team_page';

import { TEAM_DATA } from '../../../test_data/promptvault/data';

// Login -> Create Team -> Search -> Update Team -> Search With Update String -> Delete Team -> Verify
test('PV : TEAM PAGE : CRUD operations on team', async ({ page }) => {
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
