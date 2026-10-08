import { commonPropOptions } from '../utils/main.js';

/** The demo's content: a large title (or none), its subtitle, the title. */
export const propOptionsContent = {
  largeTitle: [true, false] as const,
  subtitle: [undefined, 'Subtitle'] as const,
  title: ['Inbox', 'A rather long title, truncated'] as const,
} as const;

export const propOptionsBar = {
  ...commonPropOptions,
  context: [undefined, 'bright', 'dim'] as const,
  disabled: [undefined, false, true] as const,
};

export const propOptionsTitle = {
  ...commonPropOptions,
  alignStart: [undefined, false, true] as const,
};

export const propOptionsLargeTitle = {
  ...commonPropOptions,
};
