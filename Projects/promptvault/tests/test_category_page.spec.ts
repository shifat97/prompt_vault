import { test } from '@playwright/test';
import {
  created_success_toast_is_visible,
  deleted_success_toast_is_visible,
  updated_success_toast_is_visible,
  create_cat,
  is_not_cat_found_text_visible,
  navigate_category,
  search_cat,
  update_cat,
  delete_cat,
} from '../pages/category_page';

import { CATEGORY_DATA } from '../../../test_data/promptvault/data';

// Create Category -> Search -> Update Category -> Verify Updated Search -> Delete Category -> Verify Not Found State
test('PV : CATEGORY PAGE : Perform full CRUD lifecycle and search verification on Category', async ({ page }) => {
  const category_name = CATEGORY_DATA.name;
  const update_category_name = CATEGORY_DATA.update_string;

  await navigate_category(page, test, null);
  console.log('NAVIGATING CATEGORY PAGE');
  await create_cat(page, test, null, category_name);
  console.log('CATEGORY CREATED');
  await created_success_toast_is_visible(page, test, null);
  console.log('SUCCESS TOAST VERIFIED');
  await search_cat(page, test, null, category_name);
  console.log('CATEGORY SEARCHED');
  await update_cat(page, test, null, category_name, update_category_name);
  await updated_success_toast_is_visible(page, test, null);
  console.log('CATEGORY UPDATED');
  await search_cat(page, test, null, update_category_name);
  console.log('CATEGORY SEARCHED WITH UPDATED STRING');
  await delete_cat(page, test, null, update_category_name);
  await deleted_success_toast_is_visible(page, test, null);
  console.log('CATEGORY DELETED');
  await is_not_cat_found_text_visible(page, test, null, update_category_name);
  console.log('NOT FOUND TEXT VERIFIED');
});
