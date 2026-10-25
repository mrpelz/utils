import { commonPropOptions } from '../../tooling/frame/prop-control.js';

export const propOptionsRoot = {
  // (Its own element: no `render`.)
  className: commonPropOptions.className,
  style: commonPropOptions.style,
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

/** The parts page's badge: also where it sits. */
export const propOptionsPart = {
  ...propOptionsRoot,
  placement: [undefined, 'corner', 'inline', 'symbol'] as const,
};

/** The overview's: its content and color. */
export const propOptionsOverview = {
  children: propOptionsRoot.children,
  tint: propOptionsRoot.tint,
};

export const propOptionsContent = {
  // The tab bar collapsed: Favorites remains (badged), Recents and Search
  // go (Search's badge with it).
  collapsed: [false, true] as const,
};
