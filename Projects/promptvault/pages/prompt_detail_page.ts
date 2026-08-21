import dotenv from 'dotenv';
import path from 'path';

import { expect, Page } from '@playwright/test';
import { wait_for_loadState } from '../../../base_interactions/utils';

export const TITLE_INPUT_FIELD = '//input[@placeholder="e.g., Creative Writing Assistant v1"]';
export const DESCRIPTION_INPUT_FIELD = '//p[@data-placeholder="Write your prompt here. Use {{variable_name}} for dynamic inputs..."]';
export const SELECT_CAT_DROPDOWN = '//button//span[contains(text(), "Select Category")]';
export const CAT_DROPDOWN_SEARCH = '//input[@placeholder="Search categories..."]';
export const SAVE_BUTTON = '//button[contains(text(), "Save Prompt")]';
export const SUCCESS_MESSAGE = '//p[contains(text(), "Success")]';
export const UPDATE_PROMPT_BUTTON = '//button[contains(text(), "Update Prompt")]';
export const DELETE_CONFIRM_BUTTON = '//button[contains(text(), "Cancel")]/following-sibling::button[contains(text(), "Delete")]';
export const EDIT_BUTTON = '//button[contains(text(), "Edit")]';
export const DELETE_BUTTON = '//button[contains(text(), "Delete")]';
export const SELECT_OPTION = '//button[@role="option"]';
export const VIEW_ALL_VERSION_BUTTON = '//a[contains(text(), "View All →")]';
export const RESOTRE_THIS_VERSION = '//button[@title="Restore this version"]';
export const RESTORE_BUTTON = '//button[contains(@class, "bg-amber-500")]';
export const BACK_BUTTON = '//a[@href="/prompts"][contains(text(), "Back")]';

dotenv.config({ path: path.resolve(__dirname, '../.env.pv'), override: true });

export async function navigate_to_prompt_page(page: Page, test: any, ai: any, prompt_id: string) {
  await page.goto(`${process.env.BASE_URL}/prompts/${prompt_id}`);
  await wait_for_loadState(page, test, null, 'load', 1000);
}

export async function click_back_button(page: Page, test: any, ai: any) {
  await page.locator(BACK_BUTTON).click();
}

export async function prompt_title_matched(page: Page, test: any, ai: any, title: string) {
  const title_locator = page.locator(`//h2[contains(text(), "${title}")]`);
  await expect(title_locator).toBeVisible();

  const title_text_content = await title_locator.textContent();
  expect(title_text_content).toEqual(title);
}

export async function fill_updated_description(page: Page, test: any, ai: any, description: string, update_description: string) {
  const desc_field = page.locator(`//p[contains(text(), "${description}")]`);
  await expect(desc_field).toBeVisible();
  await desc_field.fill(update_description);
}

export async function create_prompt(page: Page, test: any, ai: any, title: string, description: string, category: string) {
  const title_field = page.locator(TITLE_INPUT_FIELD);
  const desc_field = page.locator(DESCRIPTION_INPUT_FIELD);
  const select_cat_dropdown = page.locator(SELECT_CAT_DROPDOWN);
  const cat_dropdown_search = page.locator(CAT_DROPDOWN_SEARCH);
  const save_btn = page.locator(SAVE_BUTTON);

  await expect(title_field).toBeVisible();
  await title_field.fill(title);

  await expect(desc_field).toBeVisible();
  await desc_field.fill(description);

  await expect(select_cat_dropdown).toBeVisible();
  await select_cat_dropdown.click();

  await expect(cat_dropdown_search).toBeVisible();
  await cat_dropdown_search.fill(category);

  await page.locator(SELECT_OPTION).click();

  await expect(save_btn).toBeVisible();
  await save_btn.click();
}

export async function update_prompt(page: Page, test: any, ai: any, title: string) {
  const edit_btn = page.locator(EDIT_BUTTON);
  const title_field = page.locator(TITLE_INPUT_FIELD);

  await expect(edit_btn).toBeVisible();
  await edit_btn.click();

  await expect(title_field).toBeVisible();
  await title_field.fill(title);
}

export async function click_update_button(page: Page, test: any, ai: any) {
  const update_btn = page.locator(UPDATE_PROMPT_BUTTON);
  await expect(update_btn).toBeVisible();
  await update_btn.click();
  await wait_for_loadState(page, test, null, 'load', 1000);
}

export async function delete_prompt(page: Page, test: any, ai: any, title: string) {
  const delete_btn = page.locator(DELETE_BUTTON);
  const confirm_btn = page.locator(DELETE_CONFIRM_BUTTON);

  await expect(delete_btn).toBeVisible();
  await delete_btn.click();

  await expect(confirm_btn).toBeVisible();
  await confirm_btn.click();
  await wait_for_loadState(page, test, null, 'load', 1000);
}

export async function is_success_visible(page: Page, test: any, ai: any): Promise<boolean> {
  const success_msg = page.locator(SUCCESS_MESSAGE);
  await wait_for_loadState(page, test, null, 'load', 2000);
  await expect(success_msg).toBeVisible();
  return await success_msg.isVisible();
}

export async function check_is_version_changed(page: Page, test: any, ai: any, title: string, description: string) {
  const title_field = page.locator(`//h2[contains(text(), "${title}")]`);
  const desc_field = page.locator(`//p[contains(text(), "${description}")]`);

  await expect(title_field).toBeVisible();
  await expect(desc_field).toBeVisible();

  const current_title = await title_field.textContent();
  const current_description = await desc_field.textContent();

  expect(current_title).toBe(title);
  expect(current_description).toBe(description);
}

export async function change_version(page: Page, test: any, ai: any) {
  const view_all_version_btn = page.locator(VIEW_ALL_VERSION_BUTTON);
  const restore_this_version_btn = page.locator(RESOTRE_THIS_VERSION);
  const restore_btn = page.locator(RESTORE_BUTTON);

  await expect(view_all_version_btn).toBeVisible();
  await view_all_version_btn.click();
  await wait_for_loadState(page, test, null, 'load', 1000);
  await expect(restore_this_version_btn).toBeVisible();
  await restore_this_version_btn.click();
  await expect(restore_btn).toBeVisible();
  await restore_btn.click();
  await is_success_visible(page, test, null);
}
