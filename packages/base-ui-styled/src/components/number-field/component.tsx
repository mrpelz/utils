import { CommonNumberField } from './common.js';
import { main } from './variants/main.js';

export const variants = {
  main,
};

export const NumberField = {
  ...CommonNumberField,
  variants,
};

export { CommonNumberField, numberFieldStepperStyles } from './common.js';
