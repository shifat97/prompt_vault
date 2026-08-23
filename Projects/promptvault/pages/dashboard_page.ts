import { expect, Page } from '@playwright/test';
import { wait_for_loadState } from '../../../base_interactions/utils';

export async function navigate_to_dashboard(page: Page, test: any, ai: any) {
  await page.goto(process.env.BASE_URL + '/dashboard');
  await wait_for_loadState(page, test, ai, 'load', 2000);
}
