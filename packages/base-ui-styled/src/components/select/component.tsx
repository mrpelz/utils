import { CommonSelect } from './common.js';
import { grouped } from './variants/grouped.js';
import { main } from './variants/main.js';
import { multipleSelection } from './variants/multiple-selection.js';
import { objectValues } from './variants/object-values.js';

export const variants = {
  main,
  multipleSelection,
  objectValues,
  grouped,
};

export const Select = {
  ...CommonSelect,
  variants,
};

export { CommonSelect } from './common.js';
