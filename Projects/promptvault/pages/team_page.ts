import dotenv from 'dotenv';
import path from 'path';

import { expect, Page } from '@playwright/test';
import { wait_for_loadState } from '../../../base_interactions/utils';

export const NEW_TEAM_BUTTON = '//button[@type="button"]';
export const CREATE_TEAM_MODAL_TITLE = '//h2[contains(text(), "Create Team")]';
export const UPDATE_TEAM_MODAL_TITLE = '//h2[contains(text(), "Update Team")]';
export const MODAL_NAME_FIELD = '//input[@id="name"]';
export const MODAL_DESCRIPTION_FIELD = '//textarea[@id="description"]';
export const MODAL_SAVE_BUTTON = '//button[@type="submit"]';
export const SEARCH_TEAM = '//input[@placeholder="Search teams..."]';
export const EDIT_TEAM_BUTTON = 'svg.lucide-pencil';
export const DELETE_TEAM_BUTTON = 'svg.lucide-trash2';
export const DELETE_CONFIRM_BUTTON = '//button[contains(text(), "Delete")]';
export const DELETE_CONFIRM_TITLE = '//h2[@id="confirm-title"]';
export const EMPTY_TEAM_STRING = `//div[contains(text(), "You don't own any teams yet.")]`;
export const CREATED_SUCCESS_TOAST = '//p[contains(text(), "Team created")]';
export const DELETED_SUCCESS_TOAST = '//p[contains(text(), "Team deleted")]';
export const UPDATED_SUCCESS_TOAST = '//p[contains(text(), "Team updated")]';

export async function navigate_team(page: Page, test: any, ai: any) {
  await page.goto(`${process.env.BASE_URL}/teams`);
  await wait_for_loadState(page, test, ai, 'load', 5000);
  await expect(page).toHaveURL(/teams/);
}

export async function click_new_team_button(page: Page, test: any, ai: any) {
  const btn = page.locator(NEW_TEAM_BUTTON).nth(1);
  await expect(btn).toBeVisible();
  await btn.click();
}

export async function created_success_toast_is_visible(page: Page, test: any, ai: any) {
  const success_toast = page.locator(CREATED_SUCCESS_TOAST);
  await expect(success_toast).toBeVisible({ timeout: 5000 });
}

export async function deleted_success_toast_is_visible(page: Page, test: any, ai: any) {
  const success_toast = page.locator(DELETED_SUCCESS_TOAST);
  await expect(success_toast).toBeVisible({ timeout: 5000 });
}

export async function updated_success_toast_is_visible(page: Page, test: any, ai: any) {
  const success_toast = page.locator(UPDATED_SUCCESS_TOAST);
  await expect(success_toast).toBeVisible({ timeout: 5000 });
}

export async function empty_team_string_is_visible(page: Page, test: any, ai: any) {
  const empty_string = page.locator(EMPTY_TEAM_STRING);
  await expect(empty_string).toBeVisible();
}

export async function search_is_visible(page: Page, test: any, ai: any, search_string: string) {
  const searched_title = page.locator(`//span[@title="${search_string}"]`);
  await expect(searched_title).toBeVisible();
}

export async function create_team(page: Page, test: any, ai: any, team_name: string, team_description: string) {
  const modal_title = page.locator(CREATE_TEAM_MODAL_TITLE);
  const name = page.locator(MODAL_NAME_FIELD);
  const description = page.locator(MODAL_DESCRIPTION_FIELD);
  const save_button = page.locator(MODAL_SAVE_BUTTON);

  await expect(modal_title).toBeVisible();
  await expect(name).toBeVisible();
  await expect(description).toBeVisible();
  await expect(save_button).toBeVisible();

  await name.fill(team_name);
  await description.fill(team_description);
  await save_button.click();
  await created_success_toast_is_visible(page, test, ai);
}

export async function search_team(page: Page, test: any, ai: any, search_string: string) {
  const search_box = page.locator(SEARCH_TEAM);

  await expect(search_box).toBeVisible();
  await search_box.fill(search_string);
}

export async function update_team(page: Page, test: any, ai: any, team_name: string, description: string) {
  const edit_button = page.locator(EDIT_TEAM_BUTTON).nth(1);
  const update_modal_title = page.locator(UPDATE_TEAM_MODAL_TITLE);
  const modal_name_field = page.locator(MODAL_NAME_FIELD);
  const modal_description_field = page.locator(MODAL_DESCRIPTION_FIELD);
  const modal_update_button = page.locator(MODAL_SAVE_BUTTON);

  await expect(edit_button).toBeVisible();
  await edit_button.click();

  await expect(update_modal_title).toBeVisible();
  await expect(modal_name_field).toBeVisible();
  await expect(modal_description_field).toBeVisible();
  await expect(modal_update_button).toBeVisible();

  await modal_name_field.clear();
  await modal_description_field.clear();

  await modal_name_field.fill(team_name);
  await modal_description_field.fill(description);
  await modal_update_button.click();
  await updated_success_toast_is_visible(page, test, ai);
}

export async function delete_team(page: Page, test: any, ai: any) {
  const delete_button = page.locator(DELETE_TEAM_BUTTON).nth(1);
  const delete_confirm_title = page.locator(DELETE_CONFIRM_TITLE);
  const delete_confirm_button = page.locator(DELETE_CONFIRM_BUTTON);

  await expect(delete_button).toBeVisible();
  await delete_button.click();

  await expect(delete_confirm_title).toBeVisible();
  await expect(delete_confirm_button).toBeVisible();

  await delete_confirm_button.click();
  await deleted_success_toast_is_visible(page, test, ai);
}
