import { expect, Page } from '@playwright/test';
import { wait_for_loadState } from '../../../base_interactions/utils';

export const EMAIL_FIELD = '';
export const PASSWORD_FIELD = '';
export const LOGIN_BTN = '';
export const SIGN_UP_LINK = '';
export const FORGOT_PASSWORD_LINK = '';
export const EMAIL_ERROR = '';
export const PASSWORD_ERROR = '';
export const GOOGLE_LOGIN_BUTTON = '';

export async function nevigate_login(page: Page, test: any, ai: any) {
  await page.goto(`${process.env.BASE_URL}/login`);
  await wait_for_loadState(page, test, ai, 'networkidle', 5000);
}

export async function login(page: Page, test: any, ai: any, email: string, password: string) {
  await page.locator(EMAIL_FIELD).fill(email);
  await page.locator(PASSWORD_FIELD).fill(password);
  await wait_for_loadState(page, test, ai, 'load', 1000);
  await page.locator(LOGIN_BTN).click();
}

export async function is_email_error_visible(page: Page, test: any, ai: any): Promise<boolean> {
  return await page.locator(EMAIL_ERROR).isVisible();
}

export async function is_password_error_visible(page: Page, test: any, ai: any): Promise<boolean> {
  return await page.locator(PASSWORD_ERROR).isVisible();
}

export async function is_google_login_button_visible(page: Page, test: any, ai: any): Promise<boolean> {
  return await page.locator(GOOGLE_LOGIN_BUTTON).isVisible();
}

export async function click_forgot_password(page: Page, test: any, ai: any) {
  await page.locator(FORGOT_PASSWORD_LINK).click();
  await expect(page).toHaveURL(`${process.env.BASE_URL}/forgot-password`);
}

export async function click_sign_up(page: Page, test: any, ai: any) {
  await page.locator(SIGN_UP_LINK).click();
  await expect(page).toHaveURL(`${process.env.BASE_URL}/register`);
}
