import { expect, Page } from '@playwright/test';
import { wait_for_loadState } from '../../../base_interactions/utils';

export const FULLNAME_FIELD = '';
export const EMAIL_FIELD = '';
export const PASSWORD_FIELD = '';
export const CONFIEM_PASSWORD_FIELD = '';
export const CREATE_ACCOUNT_BTN = '';
export const TERMS_CHECKBOX = '';
export const TERMS_LINK = '';
export const PRIVACY_LINK = '';
export const FULL_NAME_ERROR = '';
export const EMAIL_ERROR = '';
export const PASSWORD_ERROR = '';
export const CONFIRM_PASSWORD_ERROR = '';

export async function nevigate_signup(page: Page, test: any, ai: any) {
  await page.goto(`${process.env.BASE_URL}/register`);
  await wait_for_loadState(page, test, ai, 'networkidle', 5000);
}

export async function register(page: Page, test: any, ai: any, fullname: string, email: string, password: string, confirm_password: string) {
  await page.locator(FULLNAME_FIELD).fill(fullname);
  await page.locator(EMAIL_FIELD).fill(email);
  await page.locator(PASSWORD_FIELD).fill(password);
  await page.locator(CONFIEM_PASSWORD_FIELD).fill(confirm_password);
  await wait_for_loadState(page, test, ai, 'load', 1000);
  await page.locator(CREATE_ACCOUNT_BTN).click();
}

export async function is_email_error_visible(page: Page, test: any, ai: any): Promise<boolean> {
  return await page.locator(EMAIL_ERROR).isVisible();
}

export async function is_password_error_visible(page: Page, test: any, ai: any): Promise<boolean> {
  return await page.locator(PASSWORD_ERROR).isVisible();
}

export async function is_confirm_password_error_visible(page: Page, test: any, ai: any): Promise<boolean> {
  return await page.locator(CONFIRM_PASSWORD_ERROR).isVisible();
}

export async function click_terms_link(page: Page, test: any, ai: any) {
  await page.locator(TERMS_LINK).click();
  await expect(page).toHaveURL(`${process.env.BASE_URL}/terms-of-service`);
}

export async function click_privacy_link(page: Page, test: any, ai: any) {
  await page.locator(PRIVACY_LINK).click();
  await expect(page).toHaveURL(`${process.env.BASE_URL}/privacy-policy`);
}
