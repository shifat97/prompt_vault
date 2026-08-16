import { expect, Page } from '@playwright/test';

export const CHANGE_TEAM_DROPDOWN = '//div[@class="relative"]//button[@aria-haspopup="listbox"]';
export const PROFILE_BUTTON = '//div[@class="relative "]//button[@aria-haspopup="true"]';
export const LOGOUT_BUTTON = '//button[contains(text(), "Logout")]';

export async function select_team(page: Page, test: any, ai: any, title: string) {
  const team_list = page.locator(`//button[@title="${title}"]`);
  await expect(team_list).toBeVisible();
  await team_list.click();
}

export async function change_team(page: Page, test: any, ai: any) {
  const change_team_dropdown = page.locator(CHANGE_TEAM_DROPDOWN);
  await change_team_dropdown.click();
}

export async function click_profile(page: Page, test: any, ai: any) {
  const profile_button = page.locator(PROFILE_BUTTON);
  await expect(profile_button).toBeVisible();
  await profile_button.click();
}

export async function logout(page: Page, test: any, ai: any) {
  const logout_button = page.locator(LOGOUT_BUTTON);
  await expect(logout_button).toBeVisible();
  await logout_button.click();
}
