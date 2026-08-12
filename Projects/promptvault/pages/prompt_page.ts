import { expect, Page } from '@playwright/test';
import { wait_for_loadState } from '../../../base_interactions/utils';

export const NEW_PROMPT_BUTTON = '//button[contains(text(), "New Prompt")]';
export const SEARCH_INPUT_FIELD = '//input[@placeholder="Filter by title..."]';
export const COLAB_SHARE_BUTTON = '//button//p[contains(text(), "Collaborative User")]';
export const PUBLIC_SHARE_BUTTON = '//button//p[contains(text(), "Public Access")]';
export const SHARE_SEARCH_INPUT = '//input[@placeholder="Filter by name and email..."]';
export const SHARE_ADD_USER_BUTTON = '//button[@jf-ext-button-ct="add user"]';
export const DELETE_SHARE_BUTTON = '//button[@title="Delete share"]';
export const EDIT_SHARE_BUTTON = '//button[@title="Edit share"]';

export async function navigate_prompt(page: Page, test: any, ai: any) {
  await page.goto(`${process.env.BASE_URL}/prompts`);
  await expect(page).toHaveURL(/prompts/);
  await wait_for_loadState(page, test, ai, 'networkidle', 5000);
}

export async function CLICK_DELETE_PROMPT(page: Page, test: any, ai: any, delete_string: string) {
  await page.locator(`//div[@class="text-right"]//button[@aria-label="Delete ${delete_string}"]`).click();
  await wait_for_loadState(page, test, ai, 'load', 1000);
}

export async function CLICK_EDIT_PROMPT(page: Page, test: any, ai: any, edit_string: string) {
  await page.locator(`//div[@class="text-right"]//a[@aria-label="Edit ${edit_string}"]`).click();
  await wait_for_loadState(page, test, ai, 'load', 1000);
}

export async function CLICK_SHARE_PROMPT(page: Page, test: any, ai: any, prompt_string: string) {
  await page.locator(`//div[@class="text-right"]//button[@aria-label="Share ${prompt_string}"]`).click();
  await wait_for_loadState(page, test, ai, 'load', 1000);
}

export async function click_prompt_button(page: Page, test: any, ai: any) {
  await page.locator(NEW_PROMPT_BUTTON).click();
}
