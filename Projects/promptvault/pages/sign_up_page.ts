import { expect, Page } from '@playwright/test';
import { wait_for_loadState } from '../../../base_interactions/utils';

export const FULLNAME_FIELD = '//input[@id="fullName"]';
export const EMAIL_FIELD = '//input[@id="email"]';
export const PASSWORD_FIELD = '//input[@id="password"]';
export const CONFIEM_PASSWORD_FIELD = '//input[@id="confirmPassword"]';
export const CREATE_ACCOUNT_BTN = '//button[@type="submit"]';
export const TERMS_CHECKBOX = '//input[@type="checkbox"]';
export const TERMS_LINK = '//a[contains(text(), "Terms of Service")]';
export const PRIVACY_LINK = '//a[contains(text(), "Privacy Policy")]';
export const FULL_NAME_ERROR = '//p[@id="fullName-error"]';
export const EMAIL_ERROR = '//p[@id="email-error"]';
export const PASSWORD_ERROR = '//p[@id="password-error"]';
export const CONFIRM_PASSWORD_ERROR = '//p[@id="confirmPassword-error"]';
export const SIGN_IN_LINK = '//a[@href="/login"]';

export async function navigate_signup(page: Page, test: any, ai: any) {
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
