import { commonPropOptions } from '../utils/main.js';

export const propOptionsRoot = {
  ...commonPropOptions,
  // A count (a digit: a circle), longer, text, or none (a dot).
  children: [3, 67, 999, 'New', undefined] as const,
  // Over the tint: dark, light, or custom.
  textColor: [
    undefined,
    '#000',
    '#fff',
    'var(--color-ios-system-yellow)',
  ] as const,
  tint: [
    undefined,
    'var(--color-ios-system-blue)',
    'var(--color-ios-system-green)',
    'var(--color-ios-system-gray)',
  ] as const,
};

export const propOptionsContent = {
  // The tab bar collapsed: Favorites remains (badged), Recents and Search
  // go (Search's badge with it).
  collapsed: [false, true] as const,
};
