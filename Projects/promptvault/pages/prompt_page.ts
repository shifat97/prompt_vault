import dotenv from 'dotenv';
import path from 'path';

import { expect, Page } from '@playwright/test';
import { wait_for_loadState } from '../../../base_interactions/utils';

export const NEW_PROMPT_BUTTON = '//button[contains(text(), "New Prompt")]';
export const SEARCH_INPUT_FIELD = '//input[@placeholder="Filter by title..."]';
export const COLAB_SHARE_BUTTON = '//button//p[contains(text(), "Collaborative User")]';
export const PUBLIC_SHARE_BUTTON = '//button//p[contains(text(), "Public Access")]';
export const SHARE_SEARCH_INPUT = '//input[@placeholder="Filter by title..."]';
export const SHARE_ADD_USER_BUTTON = '//button[@jf-ext-button-ct="add user"]';
export const DELETE_SHARE_BUTTON = '//button[@title="Delete share"]';
export const EDIT_SHARE_BUTTON = '//button[@title="Edit share"]';
export const NO_PROMP_FOUND = '//div[contains(text(), "No prompts found.")]';

dotenv.config({ path: path.resolve(__dirname, '../.env.pv'), override: true });

export async function click_delete_prompt(page: Page, test: any, ai: any, delete_string: string) {
  const delete_btn = page.locator(`//div[@class="text-right"]//button[@aria-label="Delete ${delete_string}"]`);
  await expect(delete_btn).toBeVisible();
  await delete_btn.click();
  await wait_for_loadState(page, test, null, 'load', 1000);
}

export async function click_edit_prompt(page: Page, test: any, ai: any, edit_string: string) {
  const edit_btn = page.locator(`//div[@class="text-right"]//a[@aria-label="Edit ${edit_string}"]`);
  await expect(edit_btn).toBeVisible();
  await edit_btn.click();
  await wait_for_loadState(page, test, null, 'load', 1000);
}

export async function click_view_prompt(page: Page, test: any, ai: any, view_string: string) {
  const view_btn = page.locator(`//div[@class="text-right"]//a[@aria-label="View ${view_string}"]`);
  await expect(view_btn).toBeVisible();
  await view_btn.click();
  await wait_for_loadState(page, test, null, 'load', 1000);
}

export async function click_share_prompt(page: Page, test: any, ai: any, prompt_string: string) {
  const share_btn = page.locator(`//div[@class="text-right"]//button[@aria-label="Share ${prompt_string}"]`);
  await expect(share_btn).toBeVisible();
  await share_btn.click();
  await wait_for_loadState(page, test, null, 'load', 1000);
}

export async function is_prompt_search_visible(
  page: Page,
  test: any,
  ai: any,
  search_string: string,
): Promise<boolean> {
  const search_result = page.locator(`//p[@title="${search_string}"]`);
  await expect(search_result).toBeVisible();
  return await search_result.isVisible();
}

export async function is_no_prompt_found_visible(page: Page, test: any, ai: any): Promise<boolean> {
  const no_prompt_found = page.locator(NO_PROMP_FOUND).nth(1);
  await expect(no_prompt_found).toBeVisible();
  return await no_prompt_found.isVisible();
}

export async function navigate_prompt(page: Page, test: any, ai: any) {
  await page.goto(`${process.env.BASE_URL}/prompts`);
  await wait_for_loadState(page, test, ai, 'load', 5000);
  await expect(page).toHaveURL(/prompts/);
}

export async function click_prompt_button(page: Page, test: any, ai: any) {
  const new_prompt_btn = page.locator(NEW_PROMPT_BUTTON);
  await expect(new_prompt_btn).toBeVisible();
  await new_prompt_btn.click();
}

export async function search_prompt(page: Page, test: any, ai: any, search_string: string) {
  const search_input = page.locator(SEARCH_INPUT_FIELD);
  await expect(search_input).toBeVisible();
  await search_input.fill(search_string);
  await wait_for_loadState(page, test, null, 'load', 1000);
}
