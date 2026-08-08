import { expect, Page } from '@playwright/test';
import { wait_for_loadState } from '../../../base_interactions/utils';

export const NEW_PROMPT_BUTTON = '';
export const SEARCH_INPUT_FIELD = '';

export async function navigate_category(page: Page, test: any, ai: any) {
  await page.goto(`${process.env.BASE_URL}/prompts`);
  await expect(page).toHaveURL(/prompts/);
  await wait_for_loadState(page, test, ai, 'networkidle', 5000);
}

export async function delete_prompt(page: Page, test: any, ai: any, delete_string: string) {
  await page.locator(`//div[@class="text-right"]//button[@title="Delete ${delete_string}"]`).click();
}

export async function edit_prompt(page: Page, test: any, ai: any, edit_string: string) {
  await page.locator(`//div[@class="text-right"]//button[@title="Edit ${edit_string}"]`).click();
}
