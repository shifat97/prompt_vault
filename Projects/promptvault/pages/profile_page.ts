import { expect, Page } from '@playwright/test';
import { wait_for_loadState } from '../../../base_interactions/utils';

export const UPDATE_PROFILE_BUTTON = '//button[contains(text(), "Update Profile")]';
export const PROFILE_NAME_INPUT = '//input[@id="name"]';
export const PROFILE_PHONE_INPUT = '//input[@id="phone"]';
export const SAVE_CHANGES_BUTTON = '//button[contains(text(), "Save Changes")]';
export const FULL_NAME = '//p[text()="Full Name"]/following-sibling::p';
export const PHONE_NUMBER = '//p[text()="Phone Number"]/following-sibling::p';

export const CURRENT_PASSWORD = '//input[@id="currentPassword"]';
export const NEW_PASSWORD = '//input[@id="newPassword"]';
export const CONFIRM_PASSWORD = '//input[@id="confirmNewPassword"]';
export const UPDATE_PASSWORD = '//button[text()="Update Password"]';

export async function click_update_profile_button(page: Page, test: any, ai: any) {
  const update_profile_button = page.locator(UPDATE_PROFILE_BUTTON).nth(0);
  await expect(update_profile_button).toBeVisible();
  await update_profile_button.click();
}

export async function fill_update_information(page: Page, test: any, ai: any, name: string, phone: string) {
  const profile_name_input = page.locator(PROFILE_NAME_INPUT);
  const profile_phone_input = page.locator(PROFILE_PHONE_INPUT);
  const save_changes_button = page.locator(SAVE_CHANGES_BUTTON);

  await expect(profile_name_input).toBeVisible();
  await profile_name_input.fill(name);

  await expect(profile_phone_input).toBeVisible();
  await profile_phone_input.fill(phone);

  await expect(save_changes_button).toBeVisible();
  await save_changes_button.click();
}

export async function check_updated_info(page: Page, test: any, ai: any, name: string, phone: string) {
  const full_name = page.locator(FULL_NAME);
  const phone_number = page.locator(PHONE_NUMBER);

  await expect(full_name).toBeVisible();
  await expect(full_name).toHaveText(name);

  await expect(phone_number).toBeVisible();
  await expect(phone_number).toHaveText(phone);
}

export async function change_password(
  page: Page,
  test: any,
  ai: any,
  current_password: string,
  new_password: string,
  confirm_password: string,
) {
  const current_password_input = page.locator(CURRENT_PASSWORD);
  const new_password_input = page.locator(NEW_PASSWORD);
  const confirm_password_input = page.locator(CONFIRM_PASSWORD);
  const update_password_button = page.locator(UPDATE_PASSWORD);

  await expect(current_password_input).toBeVisible();
  await current_password_input.fill(current_password);

  await expect(new_password_input).toBeVisible();
  await new_password_input.fill(new_password);

  await expect(confirm_password_input).toBeVisible();
  await confirm_password_input.fill(confirm_password);

  await expect(update_password_button).toBeVisible();
  await update_password_button.click();
  await wait_for_loadState(page, null, null, 'load', 2000);
}
