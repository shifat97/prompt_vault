import { expect, Page } from '@playwright/test';

export const PENDING_REQUEST_TAB = '//button[contains(text(), "Pending Requests")]';
export const ACCEPT_BUTTON = '//button[contains(text(), "Accept")]';
export const ACCEPT_SUCCESS_TOAST = '//p[contains(text(), "Invitation accepted successfully")]';

export async function click_pending_request_button(page: Page, test: any, ai: any) {
  const pending_request_button = page.locator(PENDING_REQUEST_TAB);
  await expect(pending_request_button).toBeVisible();
  await pending_request_button.click();
}

export async function click_accept_button(page: Page, test: any, ai: any) {
  const accept_button = page.locator(ACCEPT_BUTTON).nth(1);
  const confirm_accept_button = page.locator(ACCEPT_BUTTON).nth(2);
  await expect(accept_button).toBeVisible();
  await accept_button.click();
  await expect(confirm_accept_button).toBeVisible();
  await confirm_accept_button.click();
}

export async function invitation_accepted_toast_is_visible(page: Page, test: any, ai: any) {
  const success_toast = page.locator(ACCEPT_SUCCESS_TOAST);
  await expect(success_toast).toBeVisible({ timeout: 5000 });
}
