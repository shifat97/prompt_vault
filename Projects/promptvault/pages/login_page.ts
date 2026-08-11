import { expect, Page } from '@playwright/test';
import { wait_for_loadState } from '../../../base_interactions/utils';

export const EMAIL_FIELD = '//input[@id="email"]';
export const PASSWORD_FIELD = '//input[@id="password"]';
export const LOGIN_BTN = '//button[@type="submit"]';
export const SIGN_UP_LINK = '//a[@href="/register"]';
export const FORGOT_PASSWORD_LINK = '//a[@href="/forgot-password"]';
export const EMAIL_ERROR = '//p[@id="email-error"]';
export const PASSWORD_ERROR = '//p[@id="password-error"]';

export async function navigate_login(page: Page, test: any, ai: any) {
  await page.goto(`${process.env.BASE_URL}/login`);
  await wait_for_loadState(page, test, ai, 'domcontentloaded', 1000);
}

export async function login(page: Page, test: any, ai: any, email: string, password: string) {
  await page.locator(EMAIL_FIELD).fill(email);
  await page.locator(PASSWORD_FIELD).fill(password);
  await page.locator(LOGIN_BTN).click();
  await wait_for_loadState(page, test, ai, 'domcontentloaded', 1000);
}

export async function is_email_error_visible(page: Page, test: any, ai: any): Promise<boolean> {
  return await page.locator(EMAIL_ERROR).isVisible();
}

export async function is_password_error_visible(page: Page, test: any, ai: any): Promise<boolean> {
  return await page.locator(PASSWORD_ERROR).isVisible();
}

export async function click_forgot_password(page: Page, test: any, ai: any) {
  await page.locator(FORGOT_PASSWORD_LINK).click();
  await wait_for_loadState(page, test, ai, 'domcontentloaded', 1000);
  await expect(page).toHaveURL(`${process.env.BASE_URL}/forgot-password`);
}

export async function click_sign_up(page: Page, test: any, ai: any) {
  await page.locator(SIGN_UP_LINK).click();
  await expect(page).toHaveURL(`${process.env.BASE_URL}/register`);
}
