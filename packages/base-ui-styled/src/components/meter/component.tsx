import { CommonMeter } from './common.js';
import { main } from './variants/main.js';

export const variants = {
  main,
};

export const Meter = {
  ...CommonMeter,
  variants,
};

export { CommonMeter } from './common.js';
