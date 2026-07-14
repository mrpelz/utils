import { CommonScrollArea } from './common.js';
import { bothScrollbars } from './variants/both-scrollbars.js';
import { gradientScrollFade } from './variants/gradient-scroll-fade.js';
import { main } from './variants/main.js';

export const variants = {
  main,
  bothScrollbars,
  gradientScrollFade,
};

export const ScrollArea = {
  ...CommonScrollArea,
  variants,
};

export { CommonScrollArea } from './common.js';
