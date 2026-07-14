import { CommonToggle } from './common.js';
import { main } from './variants/main.js';

export const variants = {
  main,
};

export const Toggle = Object.assign(CommonToggle, { variants });

export { CommonToggle } from './common.js';
