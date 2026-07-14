import { CommonAvatar } from './common.js';
import { main } from './variants/main.js';

export const variants = {
  main,
};

export const Avatar = {
  ...CommonAvatar,
  variants,
};

export { CommonAvatar } from './common.js';
