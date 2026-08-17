import { test, expect } from '@playwright/test';
import {
  click_new_team_button,
  create_team,
  search_team,
  search_is_visible,
  navigate_team,
  delete_team,
} from '../pages/team_page';
import {
  navigate_team_detail_page,
  invite_member,
  cancel_invitation,
  click_team_button,
  invitation_sent_toast_is_visible,
  invitation_cancel_toast_is_visible,
  access_denied_toast_is_visible,
  search_member_tab,
  click_member_tab,
  member_removed_toast_is_visible,
  remove_member,
} from '../pages/team_detail_page';

import { navigate_login, login } from '../pages/login_page';
import { click_community_link } from '../pages/sidebar';
import {
  click_pending_request_button,
  click_accept_button,
  invitation_accepted_toast_is_visible,
} from '../pages/community_page';
import {
  ADMIN_LOGIN_DATA,
  MAINTAINER_LOGIN_DATA,
  MEMBER_LOGIN_DATA,
  TEAM_DATA,
  CANCEL_MEMBER_DATA,
} from '../../../test_data/promptvault/data';

let team_name: string = '';
let team_id: string = '';

test.describe.serial('PV : TEAM DETAIL PAGE', () => {
  test('Create team -> Invite admin user -> Accepet invite -> Check access', async ({ page, browser }) => {
    team_name = TEAM_DATA.name + ' admin';
    const team_description = TEAM_DATA.description;
    const invite_admin_user_email = ADMIN_LOGIN_DATA.email;
    const invite_admin_user_password = ADMIN_LOGIN_DATA.password!;

    await navigate_team(page, null, null);
    await click_new_team_button(page, null, null);
    await create_team(page, null, null, team_name, team_description);
    await search_team(page, null, null, team_name);
    await search_is_visible(page, null, null, team_name);
    await search_team(page, null, null, '');

    await click_team_button(page, null, null, team_name);

    // extract the id from url
    await page.waitForURL(/teams/);
    team_id = page.url().split('teams/')[1].split('?')[0];
    console.log(team_id);

    await invite_member(page, null, null, invite_admin_user_email!, 'admin');
    await invitation_sent_toast_is_visible(page, null, null);

    // Open a new browser context for the guest user
    const guestContext = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const guestPage = await guestContext.newPage();

    await navigate_login(guestPage, null, null);
    await login(guestPage, null, null, invite_admin_user_email!, invite_admin_user_password!);

    await click_community_link(guestPage, null, null);
    await click_pending_request_button(guestPage, null, null);
    await click_accept_button(guestPage, null, null);
    await invitation_accepted_toast_is_visible(guestPage, null, null);

    await navigate_team_detail_page(guestPage, null, null, team_id);
    await search_member_tab(guestPage, null, null, invite_admin_user_email!);

    await guestContext.close();
  });

  test('Invite maintainer user -> Check access', async ({ page, browser }) => {
    const invite_maintainer_user_email = MAINTAINER_LOGIN_DATA.email;
    const invite_maintainer_user_password = MAINTAINER_LOGIN_DATA.password!;

    await navigate_team(page, null, null);
    await search_team(page, null, null, team_name);
    await search_is_visible(page, null, null, team_name);
    await search_team(page, null, null, '');

    await click_team_button(page, null, null, team_name);

    // Use the created team id from url
    await page.waitForURL(/teams/);
    console.log(team_id);

    await invite_member(page, null, null, invite_maintainer_user_email!, 'maintainer');
    await invitation_sent_toast_is_visible(page, null, null);

    // Open a new browser context for the guest user
    const guestContext = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const guestPage = await guestContext.newPage();

    await navigate_login(guestPage, null, null);
    await login(guestPage, null, null, invite_maintainer_user_email!, invite_maintainer_user_password!);

    await click_community_link(guestPage, null, null);
    await click_pending_request_button(guestPage, null, null);
    await click_accept_button(guestPage, null, null);
    await invitation_accepted_toast_is_visible(guestPage, null, null);

    await navigate_team_detail_page(guestPage, null, null, team_id);
    await access_denied_toast_is_visible(guestPage, null, null);

    await guestContext.close();
  });

  test('Invite member user -> Check access', async ({ page, browser }) => {
    const invite_member_user_email = MEMBER_LOGIN_DATA.email;
    const invite_member_user_password = MEMBER_LOGIN_DATA.password!;

    await navigate_team(page, null, null);
    await search_team(page, null, null, team_name);
    await search_is_visible(page, null, null, team_name);
    await search_team(page, null, null, '');

    await click_team_button(page, null, null, team_name);

    // Use the created team id from url
    await page.waitForURL(/teams/);
    console.log(team_id);

    await invite_member(page, null, null, invite_member_user_email!, 'member');
    await invitation_sent_toast_is_visible(page, null, null);

    // Open a new browser context for the guest user
    const guestContext = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const guestPage = await guestContext.newPage();

    await navigate_login(guestPage, null, null);
    await login(guestPage, null, null, invite_member_user_email!, invite_member_user_password!);

    await click_community_link(guestPage, null, null);
    await click_pending_request_button(guestPage, null, null);
    await click_accept_button(guestPage, null, null);
    await invitation_accepted_toast_is_visible(guestPage, null, null);

    await navigate_team_detail_page(guestPage, null, null, team_id);
    await access_denied_toast_is_visible(guestPage, null, null);

    await guestContext.close();
  });

  test('Invite user with any role -> Cancel invite -> Cannot access', async ({ page }) => {
    const invite_member_user_email = CANCEL_MEMBER_DATA.email;

    await navigate_team(page, null, null);

    await search_team(page, null, null, team_name);
    await search_is_visible(page, null, null, team_name);
    await search_team(page, null, null, '');

    await click_team_button(page, null, null, team_name);

    await invite_member(page, null, null, invite_member_user_email!, 'member');
    await invitation_sent_toast_is_visible(page, null, null);

    await cancel_invitation(page, null, null, invite_member_user_email!);
    await invitation_cancel_toast_is_visible(page, null, null);

    await click_member_tab(page, null, null);
    await search_member_tab(page, null, null, invite_member_user_email!, true);
  });

  test('Login as admin -> Remove member -> Search maintainer -> Remove maintainer -> Search member', async ({
    page,
  }) => {
    const invite_maintainer_user_email = MAINTAINER_LOGIN_DATA.email;
    const invite_member_user_email = MEMBER_LOGIN_DATA.email;

    await navigate_team(page, null, null);

    await search_team(page, null, null, team_name);
    await search_is_visible(page, null, null, team_name);
    await search_team(page, null, null, '');

    await click_team_button(page, null, null, team_name);

    await click_member_tab(page, null, null);
    await search_member_tab(page, null, null, invite_member_user_email!);

    await remove_member(page, null, null, invite_member_user_email!);
    await member_removed_toast_is_visible(page, null, null);
    await search_member_tab(page, null, null, invite_member_user_email!, true);

    await search_member_tab(page, null, null, invite_maintainer_user_email!);

    await remove_member(page, null, null, invite_maintainer_user_email!);
    await member_removed_toast_is_visible(page, null, null);
    await search_member_tab(page, null, null, invite_maintainer_user_email!, true);

    await navigate_team(page, null, null);
    await search_team(page, null, null, team_name);
    await search_is_visible(page, null, null, team_name);
    await delete_team(page, null, null, team_name);
  });
});
