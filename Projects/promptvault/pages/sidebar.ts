import { expect, Page } from '@playwright/test';

export const COMMUNITY_LINK = '//a[@href="/community"]';

export async function click_community_link(page: Page, test: any, ai: any) {
  const community_link = page.locator(COMMUNITY_LINK);
  await expect(community_link).toBeVisible();
  await community_link.click();
}
