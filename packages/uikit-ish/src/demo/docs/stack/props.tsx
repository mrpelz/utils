import { commonPropOptions } from '../../tooling/frame/prop-control.js';

/** `Stack`: all of its props. */
export const propOptionsStack = {
  ...commonPropOptions,
  axis: [undefined, 'horizontal'] as const,
  spacing: [undefined, 'small', 'medium', 'xLarge'] as const,
  align: [undefined, 'start', 'center', 'end', 'baseline'] as const,
  justify: [undefined, 'center', 'end', 'spaceBetween'] as const,
  wrap: [undefined, true] as const,
  inset: [undefined, true] as const,
};

/** Its children: how many buttons it stacks. */
export const propOptionsContent = {
  count: [3, 2, 6] as const,
};
