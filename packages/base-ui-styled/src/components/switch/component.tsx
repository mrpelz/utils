import { CommonSwitch } from './common.js';
import { main } from './variants/main.js';

export const variants = {
  main,
};

export const Switch = {
  ...CommonSwitch,
  variants,
};

export { CommonSwitch } from './common.js';
