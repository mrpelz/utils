import { CommonProgress } from './common.js';
import { main } from './variants/main.js';

export const variants = {
  main,
};

export const Progress = {
  ...CommonProgress,
  variants,
};

export { CommonProgress } from './common.js';
