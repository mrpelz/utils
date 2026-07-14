import { CommonRadio, CommonRadioGroup } from './common.js';
import { groupMain, main } from './variants/main.js';

export const variants = {
  main,
};

export const groupVariants = {
  main: groupMain,
};

export const Radio = {
  ...CommonRadio,
  variants,
};

export const RadioGroup = Object.assign(CommonRadioGroup, {
  variants: groupVariants,
});

export { CommonRadio, CommonRadioGroup } from './common.js';
