import { test, expect } from '@playwright/test';
import { navigate_login, login } from '../pages/login_page';
import {
  success_toast_is_visible,
  create_cat,
  is_not_cat_found_text_visible,
  navigate_category,
  search_cat,
  update_cat,
  delete_cat,
} from '../pages/category_page';

import { LOGIN_DATA, CATEGORY_DATA } from '../../../test_data/promptvault/data';

// Login -> Create Category -> Search -> Update Category -> Search With Update String -> Delete Category -> Verify
test.only('PV : CATEGORY PAGE : CRUD operations on category', async ({ page }) => {
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
  await success_toast_is_visible(page, test, null);
  console.log('SUCCESS TOAST VERIFIED');
  await search_cat(page, test, null, CATEGORY_DATA.name);
  console.log('CATEGORY SEARCHED');
  await update_cat(page, test, null, CATEGORY_DATA.name, CATEGORY_DATA.update_string);
  console.log('CATEGORY UPDATED');
  await search_cat(page, test, null, CATEGORY_DATA.update_string);
  console.log('CATEGORY SEARCHED WITH UPDATED STRING');
  await delete_cat(page, test, null, CATEGORY_DATA.update_string);
  console.log('CATEGORY DELETED');
  await is_not_cat_found_text_visible(page, test, null, CATEGORY_DATA.update_string);
  console.log('NOT FOUND TEXT VERIFIED');
});
