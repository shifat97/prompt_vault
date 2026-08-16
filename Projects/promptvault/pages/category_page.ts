import dotenv from 'dotenv';
import path from 'path';

import { expect, Page } from '@playwright/test';
import { wait_for_loadState } from '../../../base_interactions/utils';

export const NEW_CAT_BTN = '//button[contains(text(), "New Category")]';
export const CAT_SEARCH_FIELD = '//input[@type="search"]';
export const CAT_NAME_FILED = '//input[@id="name"]';
export const SAVE_UPDATE_BUTTON = '//button[@type="submit"]';
export const DELETE_BUTTON = '//button[contains(text(), "Delete")]';
export const NOT_CAT_FOUND_TEXT = '//div[@style="min-width: 740px;"]//div[contains(text(), "No categories found.")]';
export const CREATED_SUCCESS_TOAST = '//p[contains(text(), "Category created")]';
export const DELETED_SUCCESS_TOAST = '//p[contains(text(), "Category deleted")]';
export const UPDATED_SUCCESS_TOAST = '//p[contains(text(), "Category updated")]';

dotenv.config({ path: path.resolve(__dirname, '../.env.pv'), override: true });

export async function CLICK_DELETE_CATEGORY(page: Page, test: any, ai: any, delete_string: string) {
  await page.locator(`//div[@class="text-right"]//button[@title="Delete ${delete_string}"]`).click();
  await wait_for_loadState(page, test, null, 'load', 1000);
}

export async function CLICK_EDIT_CATEGORY(page: Page, test: any, ai: any, edit_string: string) {
  console.log('DEBUG: ', edit_string);
  await page.locator(`//div[@class="text-right"]//button[@title="Edit ${edit_string}"]`).click();
  await wait_for_loadState(page, test, null, 'load', 1000);
}

export async function CHOOSE_CAT_COLOR(page: Page, test: any, ai: any): Promise<string> {
  const color_list = [
    'Violet',
    'Indigo',
    'Blue',
    'Sky',
    'Teal',
    'Emerald',
    'Lime',
    'Amber',
    'Orange',
    'Rose',
    'Pink',
    'Fuchsia',
    'Slate',
    'Stone',
  ];
  const choose_random_color = color_list[Math.floor(Math.random() * color_list.length)];
  return `//button[@title="${choose_random_color}"]`;
}

export async function navigate_category(page: Page, test: any, ai: any) {
  await page.goto(`${process.env.BASE_URL}/categories`);
  await wait_for_loadState(page, test, ai, 'load', 5000);
  await expect(page).toHaveURL(/categories/);
}

export async function created_success_toast_is_visible(page: Page, test: any, ai: any) {
  const success_toast = page.locator(CREATED_SUCCESS_TOAST);
  await expect(success_toast).toBeVisible({ timeout: 5000 });
}

export async function deleted_success_toast_is_visible(page: Page, test: any, ai: any) {
  const success_toast = page.locator(DELETED_SUCCESS_TOAST);
  await expect(success_toast).toBeVisible({ timeout: 5000 });
}

export async function updated_success_toast_is_visible(page: Page, test: any, ai: any) {
  const success_toast = page.locator(UPDATED_SUCCESS_TOAST);
  await expect(success_toast).toBeVisible({ timeout: 5000 });
}

export async function create_cat(page: Page, test: any, ai: any, cat_name: string) {
  const new_cat_button = page.locator(NEW_CAT_BTN);
  const cat_name_field = page.locator(CAT_NAME_FILED);
  const save_update_button = page.locator(SAVE_UPDATE_BUTTON);

  await expect(new_cat_button).toBeVisible();
  await new_cat_button.click();

  await expect(cat_name_field).toBeVisible();
  await cat_name_field.fill(cat_name);
  await page.locator(await CHOOSE_CAT_COLOR(page, test, ai)).click();

  await expect(save_update_button).toBeVisible();
  await save_update_button.click();
}

export async function update_cat(page: Page, test: any, ai: any, edit_string: string, update_string: string) {
  const cat_name_field = page.locator(CAT_NAME_FILED);
  const update_button = page.locator(SAVE_UPDATE_BUTTON);

  await CLICK_EDIT_CATEGORY(page, test, ai, edit_string);
  await expect(cat_name_field).toBeVisible();
  await cat_name_field.fill(update_string);
  await expect(update_button).toBeVisible();
  await update_button.click();
}

export async function delete_cat(page: Page, test: any, ai: any, delete_string: string) {
  const delete_button = page.locator(DELETE_BUTTON);

  await CLICK_DELETE_CATEGORY(page, test, ai, delete_string);
  await expect(delete_button).toBeVisible();
  await delete_button.click();
}

export async function search_cat(page: Page, test: any, ai: any, search_text: string) {
  const cat_search_field = page.locator(CAT_SEARCH_FIELD);
  const search_result = page.locator(`//p[contains(text(), "${search_text}")]`);

  await expect(cat_search_field).toBeVisible();
  await cat_search_field.fill(search_text);
  await expect(search_result).toBeVisible();
  await cat_search_field.clear();
}

export async function is_not_cat_found_text_visible(page: Page, test: any, ai: any, search_text: string) {
  const cat_search_field = page.locator(CAT_SEARCH_FIELD);
  const no_cat_found_text = page.locator(NOT_CAT_FOUND_TEXT);

  await expect(cat_search_field).toBeVisible();
  await cat_search_field.fill(search_text);

  await no_cat_found_text.isVisible();
}
