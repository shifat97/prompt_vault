import { expect, Page } from '@playwright/test';
import { wait_for_loadState } from '../../../base_interactions/utils';

export const NEW_CAT_BTN = '//button[contains(text(), "New Category")]';
export const CAT_SEARCH_FIELD = '//input[@type="search"]';
export const CAT_NAME_FILED = '//input[@id="name"]';
export const SAVE_UPDATE_BUTTON = '//button[@type="submit"]';
export const DELETE_BUTTON = '//button[contains(text(), "Delete")]';
export const NOT_CAT_FOUND_TEXT = '//div[@style="min-width: 740px;"]//div[contains(text(), "No categories found.")]';

export async function CLICK_DELETE_PROMPT(page: Page, test: any, ai: any, delete_string: string) {
  await page.locator(`//div[@class="text-right"]//button[@title="Delete ${delete_string}"]`).click();
  await wait_for_loadState(page, test, null, 'load', 1000);
}

export async function CLICK_EDIT_PROMPT(page: Page, test: any, ai: any, edit_string: string) {
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

export async function create_cat(page: Page, test: any, ai: any, cat_name: string) {
  await page.locator(NEW_CAT_BTN).click();
  await page.locator(CAT_NAME_FILED).fill(cat_name);
  await page.locator(await CHOOSE_CAT_COLOR(page, test, ai)).click();
  await wait_for_loadState(page, test, ai, 'load', 1000);
  await page.locator(SAVE_UPDATE_BUTTON).click();
}

export async function update_cat(page: Page, test: any, ai: any, edit_string: string, update_string: string) {
  await CLICK_EDIT_PROMPT(page, test, ai, edit_string);
  await page.locator(CAT_NAME_FILED).fill(update_string);
  await page.locator(SAVE_UPDATE_BUTTON).click();
}

export async function delete_cat(page: Page, test: any, ai: any, delete_string: string) {
  await CLICK_DELETE_PROMPT(page, test, ai, delete_string);
  await page.locator(DELETE_BUTTON).click();
}

export async function search_cat(page: Page, test: any, ai: any, search_text: string) {
  await page.locator(CAT_SEARCH_FIELD).fill(search_text);
  await wait_for_loadState(page, test, ai, 'load', 1000);
  await expect(page.locator(`//p[contains(text(), "${search_text}")]`)).toBeVisible();
  await page.locator(CAT_SEARCH_FIELD).clear();
  await wait_for_loadState(page, test, ai, 'load', 1000);
}

export async function is_not_cat_found_text_visible(
  page: Page,
  test: any,
  ai: any,
  search_text: string,
): Promise<boolean> {
  await page.locator(CAT_SEARCH_FIELD).fill(search_text);
  await wait_for_loadState(page, test, ai, 'load', 1000);
  return await page.locator(NOT_CAT_FOUND_TEXT).isVisible();
}
