import { CommonMenubar } from './common.js';
import { main } from './variants/main.js';

export const variants = {
  main,
};

export const Menubar = Object.assign(CommonMenubar, { variants });

export { CommonMenubar } from './common.js';
