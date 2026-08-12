import { expect, Page } from '@playwright/test';
import { wait_for_loadState } from '../../../base_interactions/utils';

export const TITLE_INPUT_FIELD = '//input[@placeholder="e.g., Creative Writing Assistant v1"]';
export const DESCRIPTION_INPUT_FIELD =
  '//p[@data-placeholder="Write your prompt here. Use {{variable_name}} for dynamic inputs..."]';
export const SELECT_CAT_DROPDOWN = '//button//span[contains(text(), "Select Category")]';
export const CAT_DROPDOWN_SEARCH = '//input[@placeholder="Search categories..."]';
export const SAVE_BUTTON = '//button[contains(text(), "Save Prompt")]';
export const SUCCESS_MESSAGE = '//p[contains(text(), "Success")]';

export async function SELECT_CAT_FROM_DROPDOWN(page: Page, test: any, ai: any, search_string: string) {
  await page.locator(`//button//span//span[contains(text(), "${search_string}")]`).click();
  await wait_for_loadState(page, test, ai, 'load', 1000);
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
  await wait_for_loadState(page, test, ai, 'load', 1000);
}

export async function is_success_visible(page: Page, test: any, ai: any): Promise<boolean> {
  return await page.locator(SUCCESS_MESSAGE).isVisible();
}
