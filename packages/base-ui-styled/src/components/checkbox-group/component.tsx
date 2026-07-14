import { CommonCheckboxGroup } from './common.js';
import { main } from './variants/main.js';
import { nestedParentCheckbox } from './variants/nested-parent-checkbox.js';
import { parentCheckbox } from './variants/parent-checkbox.js';

export const variants = {
  main,
  parentCheckbox,
  nestedParentCheckbox,
};

export const CheckboxGroup = Object.assign(CommonCheckboxGroup, { variants });

export { CommonCheckboxGroup } from './common.js';
