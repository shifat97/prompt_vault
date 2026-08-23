import test, { expect } from '@playwright/test';
import { click_profile, click_profile_nav_menu } from '../pages/header';
import {
  change_password,
  check_updated_info,
  click_update_profile_button,
  fill_update_information,
} from '../pages/profile_page';
import { LOGIN_DATA } from '../../../test_data/promptvault/data';
import { is_password_error_visible, login, navigate_login } from '../pages/login_page';
import { navigate_to_dashboard } from '../pages/dashboard_page';

test('PV : PROFILE PAGE : User profile update and change password', async ({ page, browser }) => {
  const phone = '0179868128' + Math.floor(Math.random() * 10);
  const password = 'Test123456@' + Math.floor(Math.random() * 10000000) / 3 + 3113;

  await navigate_to_dashboard(page, test, null);

  await click_profile(page, test, null);
  await click_profile_nav_menu(page, test, null);
  await click_update_profile_button(page, test, null);
  await fill_update_information(page, test, null, LOGIN_DATA.username!, phone);
  await check_updated_info(page, test, null, LOGIN_DATA.username!, phone);
  await change_password(page, test, null, LOGIN_DATA.password!, password, password);

  // Open a new browser context for the guest user
  const guestContext = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  const guestPage = await guestContext.newPage();

  await navigate_login(guestPage, null, null);
  await login(guestPage, null, null, LOGIN_DATA.email!, LOGIN_DATA.password!);
  await is_password_error_visible(guestPage, test, null);

  await login(guestPage, test, null, LOGIN_DATA.email!, password);
  // 3. Verify successful navigation to dashboard
  await expect(guestPage).toHaveURL(/.*\/dashboard/);
  console.log('✅ Dashboard reached successfully.');

  await click_profile(guestPage, test, null);
  await click_profile_nav_menu(guestPage, test, null);
  await click_update_profile_button(guestPage, test, null);
  await fill_update_information(guestPage, test, null, LOGIN_DATA.username!, phone);
  await check_updated_info(guestPage, test, null, LOGIN_DATA.username!, phone);
  await change_password(guestPage, test, null, password, LOGIN_DATA.password!, LOGIN_DATA.password!);
});
