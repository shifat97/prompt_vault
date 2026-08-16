import dotenv from 'dotenv';
import path from 'path';

import { expect, Page } from '@playwright/test';
import { wait_for_loadState } from '../../../base_interactions/utils';

export const INVITE_MEMBER_BUTTON = '//button[contains(text(), "Invite Member")]';
export const INVITE_MODAL_TITLE = '//h2[contains(text(), "Invite Member")]';
export const INVITE_MODAL_EMAIL_FIELD = '//input[@id="invite-email"]';
export const ADMIN_ACCESS_BUTTON = '//button//span//span[contains(text(), "Admin")]';
export const MAINTAINER_ACCESS_BUTTON = '//button//span//span[contains(text(), "Maintainer")]';
export const MEMBER_ACCESS_BUTTON = '//button//span//span[contains(text(), "Member")]';
export const SEND_INVITE_BUTTON = '//button[contains(text(), "Send Invite")]';
export const INVITATION_TAB = '//button[contains(text(), "Invitations")]';
export const INVITATION_TAB_SEARCH_FIELD = '//input[@placeholder="Search by email..."]';
export const MEMBER_SEARCH_FIELD = '//input[@placeholder="Search name, email..."]';
export const TRASH_BUTTON = 'svg.lucide-trash2';
export const CANCEL_INVITATION_BUTTON = '//button[contains(text(), "Cancel Invitation")]';
export const INVITATION_SENT_TOAST = '//p[contains(text(), "Invitation sent")]';
export const INVITATION_CANCEL_TOAST = '//p[contains(text(), "Invitation cancelled")]';
export const ACCESS_DENIED = '//h1[contains(text(), "Access Denied")]';

dotenv.config({ path: path.resolve(__dirname, '../.env.pv'), override: true });

export async function navigate_team_detail_page(page: Page, test: any, ai: any, team_id: string) {
  await page.goto(`${process.env.BASE_URL}/teams/${team_id}?tab=members`);
  await wait_for_loadState(page, test, ai, 'load', 5000);
}

export async function click_team_button(page: Page, test: any, ai: any, team_name: string) {
  const team_button = page.locator(`//span[contains(text(), "${team_name}")]`);
  await team_button.click();
  await wait_for_loadState(page, test, ai, 'load', 5000);
}

export async function invite_member(page: Page, test: any, ai: any, email: string, role: string) {
  const invite_member_button = page.locator(INVITE_MEMBER_BUTTON);
  const invite_modal_title = page.locator(INVITE_MODAL_TITLE);
  const invite_modal_email_field = page.locator(INVITE_MODAL_EMAIL_FIELD);
  const admin_access_button = page.locator(ADMIN_ACCESS_BUTTON);
  const maintainer_access_button = page.locator(MAINTAINER_ACCESS_BUTTON);
  const member_access_button = page.locator(MEMBER_ACCESS_BUTTON);
  const send_invite_button = page.locator(SEND_INVITE_BUTTON);

  await expect(invite_member_button).toBeVisible();
  await invite_member_button.click();

  await expect(invite_modal_title).toBeVisible();
  await expect(invite_modal_email_field).toBeVisible();
  await expect(admin_access_button).toBeVisible();
  await expect(maintainer_access_button).toBeVisible();
  await expect(member_access_button).toBeVisible();
  await expect(send_invite_button).toBeVisible();

  await invite_modal_email_field.fill(email);
  if (role === 'admin') {
    await admin_access_button.click();
  } else if (role === 'maintainer') {
    await maintainer_access_button.click();
  } else if (role === 'member') {
    await member_access_button.click();
  }
  await send_invite_button.click();
}

export async function cancel_invitation(page: Page, test: any, ai: any, email: string) {
  const invitation_tab = page.locator(INVITATION_TAB);
  const invitation_tab_search_field = page.locator(INVITATION_TAB_SEARCH_FIELD);
  const trash_button = page.locator(TRASH_BUTTON);
  const cancel_invitation_button = page.locator(CANCEL_INVITATION_BUTTON);

  await expect(invitation_tab).toBeVisible();
  await invitation_tab.click();

  await expect(invitation_tab_search_field).toBeVisible();
  await invitation_tab_search_field.fill(email);

  await expect(trash_button).toBeVisible();
  await trash_button.click();

  await expect(cancel_invitation_button).toBeVisible();
  await cancel_invitation_button.click();
}

export async function is_member_visible(page: Page, test: any, ai: any, email: string) {
  const member_search_field = page.locator(MEMBER_SEARCH_FIELD);
  await expect(member_search_field).toBeVisible();
  await member_search_field.fill(email);

  const member = page.locator(`//p[contains(text(), "${email}")]`);
  await expect(member).toBeVisible();
}

export async function invitation_sent_toast_is_visible(page: Page, test: any, ai: any) {
  const success_toast = page.locator(INVITATION_SENT_TOAST);
  await expect(success_toast).toBeVisible({ timeout: 5000 });
}

export async function invitation_cancel_toast_is_visible(page: Page, test: any, ai: any) {
  const success_toast = page.locator(INVITATION_CANCEL_TOAST);
  await expect(success_toast).toBeVisible({ timeout: 5000 });
}

export async function access_denied_toast_is_visible(page: Page, test: any, ai: any) {
  const success_toast = page.locator(ACCESS_DENIED);
  await expect(success_toast).toBeVisible({ timeout: 5000 });
}
