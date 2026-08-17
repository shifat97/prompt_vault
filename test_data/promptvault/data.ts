import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.pv'), override: true });

export const LOGIN_DATA = {
  email: process.env.TEST_EMAIL,
  password: process.env.TEST_PASSWORD,
};

export const CATEGORY_DATA = {
  name: 'Category ' + Math.floor(Math.random() * 10000) * Math.floor(Math.random() * 10000) + ' data',
  update_string: 'Updated Category ' + Math.floor(Math.random() * 10000) * Math.floor(Math.random() * 10000),
};

export const PROMPT_DATA = {
  name: 'Prompt ' + Math.floor(Math.random() * 10000) * Math.floor(Math.random() * 10000) + ' data',
  description: 'This is a test description',
  update_name: 'Updated Prompt ' + Math.floor(Math.random() * 10000) * Math.floor(Math.random() * 10000),
  update_description: 'This is an updated test description',
};

export const TEAM_DATA = {
  name: 'Team ' + Math.floor(Math.random() * 10000) * Math.floor(Math.random() * 10000),
  description: 'This is a test description',
  update_name: 'Updated Team ' + Math.floor(Math.random() * 10000) * Math.floor(Math.random() * 10000),
  update_description: 'This is an updated test description',
};

export const ADMIN_LOGIN_DATA = {
  email: process.env.ADMIN_USER_EMAIL,
  password: process.env.ADMIN_USER_PASSWORD,
};

export const MAINTAINER_LOGIN_DATA = {
  email: process.env.MAINTAINER_USER_EMAIL,
  password: process.env.MAINTAINER_USER_PASSWORD,
};

export const MEMBER_LOGIN_DATA = {
  email: process.env.MEMBER_USER_EMAIL,
  password: process.env.MEMBER_USER_PASSWORD,
};

export const CANCEL_MEMBER_DATA = {
  email: `msb.reza+${Math.floor(Math.random() * 10000) * Math.floor(Math.random() * 10000)}@asthait.com`,
  password: 'Test1234@',
};
