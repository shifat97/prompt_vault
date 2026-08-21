import { expect, Page } from '@playwright/test';
import { wait_for_loadState } from '../../../base_interactions/utils';

export const PUBLIC_PAGE_SEARCH_INPUT = '//input[@placeholder="Search prompts..."]';

export async function navigate_public_page(page: Page, test: any, ai: any) {
  await page.goto(`${process.env.BASE_URL}/community`);
  await expect(page).toHaveURL(/community/);
}

export async function prompt_title_is_visible(page: Page, test: any, ai: any, title: string) {
  const locator = page.locator(`//a[@title="${title}"]`);
  await expect(locator).toBeVisible();
}

export async function fill_public_search_box(page: Page, test: any, ai: any, search_string: string) {
  const search_input = page.locator(PUBLIC_PAGE_SEARCH_INPUT);
  await expect(search_input).toBeVisible();
  await search_input.fill(search_string);
  await wait_for_loadState(page, test, ai, 'load', 1000);
}
