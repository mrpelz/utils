import { CommonField } from './common.js';
import { main } from './variants/main.js';

export const variants = {
  main,
};

export const Field = {
  ...CommonField,
  variants,
};

export { CommonField } from './common.js';
