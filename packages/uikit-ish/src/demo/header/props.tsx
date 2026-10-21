import { commonPropOptions } from '../frame/prop-control.js';

export const propOptionsBar = {
  ...commonPropOptions,
  context: [
    undefined,
    'bright',
    'dim',
    'background-bright',
    'background-dim',
    'adaptive',
  ] as const,
  disabled: [undefined, false, true] as const,
  loopFocus: [undefined, false, true] as const,
  orientation: [undefined, 'horizontal', 'vertical'] as const,
};

export const propOptionsTitle = {
  ...commonPropOptions,
  alignStart: [undefined, false, true] as const,
};

export const propOptionsLargeTitle = {
  ...commonPropOptions,
  'aria-level': [undefined, 1, 2] as const,
};

// The guide pages' views (see overview.tsx, parts.tsx).

/** The overview's header: a large title (or the bar's only), a subtitle. */
export const propOptionsOverviewContent = {
  largeTitle: [true, false] as const,
  subtitle: [false, true] as const,
};
