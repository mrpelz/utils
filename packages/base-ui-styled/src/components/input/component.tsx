import { CommonInput, Label } from './common.js';
import { main } from './variants/main.js';

export const variants = {
  main,
};

export const Input = Object.assign(CommonInput, { Label, variants });

export { CommonInput, Label } from './common.js';
