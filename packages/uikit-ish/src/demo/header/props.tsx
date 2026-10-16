import { commonPropOptions } from '../utils/main.js';

export const propOptionsBar = {
  ...commonPropOptions,
  context: [
    undefined,
    'bright',
    'dim',
    'background-bright',
    'background-dim',
  ] as const,
  disabled: [undefined, false, true] as const,
};

export const propOptionsTitle = {
  ...commonPropOptions,
  alignStart: [undefined, false, true] as const,
};

export const propOptionsLargeTitle = {
  ...commonPropOptions,
};
