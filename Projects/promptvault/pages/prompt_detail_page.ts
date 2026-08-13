import { expect, Page } from '@playwright/test';
import { wait_for_loadState } from '../../../base_interactions/utils';

export const TITLE_INPUT_FIELD = '//input[@placeholder="e.g., Creative Writing Assistant v1"]';
export const DESCRIPTION_INPUT_FIELD =
  '//p[@data-placeholder="Write your prompt here. Use {{variable_name}} for dynamic inputs..."]';
export const SELECT_CAT_DROPDOWN = '//button//span[contains(text(), "Select Category")]';
export const CAT_DROPDOWN_SEARCH = '//input[@placeholder="Search categories..."]';
export const SAVE_BUTTON = '//button[contains(text(), "Save Prompt")]';
export const SUCCESS_MESSAGE = '//p[contains(text(), "Success")]';
export const UPDATE_PROMPT_BUTTON = '//button[contains(text(), "Update Prompt")]';
export const DELETE_CONFIRM_BUTTON =
  '//button[contains(text(), "Cancel")]/following-sibling::button[contains(text(), "Delete")]';
export const EDIT_BUTTON = '//button[contains(text(), "Edit")]';
export const DELETE_BUTTON = '//button[contains(text(), "Delete")]';

export async function SELECT_CAT_FROM_DROPDOWN(page: Page, test: any, ai: any, search_string: string) {
  await page.locator(`//button//span//span[contains(text(), "${search_string}")]`).click();
  await wait_for_loadState(page, test, ai, 'load', 3000, 60000);
}

export async function fill_updated_description(
  page: Page,
  test: any,
  ai: any,
  description: string,
  update_description: string,
) {
  await page.locator(`//p[contains(text(), "${description}")]`).fill(update_description);
}

export async function create_prompt(
  page: Page,
  test: any,
  ai: any,
  title: string,
  description: string,
  category: string,
) {
  await page.locator(TITLE_INPUT_FIELD).fill(title);
  await page.locator(DESCRIPTION_INPUT_FIELD).fill(description);
  await page.locator(SELECT_CAT_DROPDOWN).click();
  await page.locator(CAT_DROPDOWN_SEARCH).fill(category);
  await SELECT_CAT_FROM_DROPDOWN(page, test, ai, category);
  await page.locator(SAVE_BUTTON).click();
  await wait_for_loadState(page, test, ai, 'load', 3000, 60000);
}

export async function update_prompt(page: Page, test: any, ai: any, title: string) {
  await page.locator(EDIT_BUTTON).click();
  await wait_for_loadState(page, test, ai, 'load', 3000, 60000);
  await page.locator(TITLE_INPUT_FIELD).fill(title);
}

export async function click_update_button(page: Page, test: any, ai: any) {
  await page.locator(UPDATE_PROMPT_BUTTON).click();
  await wait_for_loadState(page, test, ai, 'load', 3000, 60000);
}

export async function delete_prompt(page: Page, test: any, ai: any, title: string) {
  await page.locator(DELETE_BUTTON).click();
  await page.locator(DELETE_CONFIRM_BUTTON).click();
  await wait_for_loadState(page, test, ai, 'load', 3000, 60000);
}

export async function is_success_visible(page: Page, test: any, ai: any): Promise<boolean> {
  return await page.locator(SUCCESS_MESSAGE).isVisible();
}
