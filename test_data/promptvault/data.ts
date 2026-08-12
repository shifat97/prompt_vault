import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.pv'), override: true });

export const LOGIN_DATA = {
  email: process.env.TEST_EMAIL,
  password: process.env.TEST_PASSWORD,
};

export const CATEGORY_DATA = {
  name: 'Category ' + Math.floor(Math.random() * 1000),
  update_string: 'Updated Category ' + Math.floor(Math.random() * 1000),
};

export const PROMPT_DATA = {
  name: 'Prompt ' + Math.floor(Math.random() * 1000),
  update_string: 'Updated Prompt ' + Math.floor(Math.random() * 1000),
  description: 'This is a test description',
};
