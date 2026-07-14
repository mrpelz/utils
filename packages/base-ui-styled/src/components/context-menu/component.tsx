import { CommonContextMenu } from './common.js';
import { main } from './variants/main.js';
import { nestedMenu } from './variants/nested-menu.js';

export const variants = {
  main,
  nestedMenu,
};

export const ContextMenu = {
  ...CommonContextMenu,
  variants,
};

export { CommonContextMenu } from './common.js';
