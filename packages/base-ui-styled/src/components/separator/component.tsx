import { CommonSeparator } from './common.js';
import { main } from './variants/main.js';

export const variants = {
  main,
};

export const Separator = Object.assign(CommonSeparator, { variants });

export { CommonSeparator } from './common.js';
