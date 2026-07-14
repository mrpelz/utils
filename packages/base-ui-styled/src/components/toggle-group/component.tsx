import { CommonToggleGroup } from './common.js';
import { main } from './variants/main.js';
import { multiple } from './variants/multiple.js';

export const variants = {
  main,
  multiple,
};

export const ToggleGroup = Object.assign(CommonToggleGroup, { variants });

export { CommonToggleGroup } from './common.js';
