import { expect, Page } from '@playwright/test';

export const CHANGE_TEAM_DROPDOWN = '//div[@class="relative"]//button[@aria-haspopup="listbox"]';

export async function select_team(page: Page, test: any, ai: any, title: string) {
  const team_list = page.locator(`//button[@title="${title}"]`);
  await expect(team_list).toBeVisible();
  await team_list.click();
}

export async function change_team(page: Page, test: any, ai: any) {
  const change_team_dropdown = page.locator(CHANGE_TEAM_DROPDOWN);
  await change_team_dropdown.click();
}
