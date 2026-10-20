/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { commonPropOptions, MappedProp } from '../frame/prop-control.js';

/** The root's options; `pop` pops the shown stack (see `NavigationDemo`). */
export const getPropOptionsRoot = (pop: () => void) => ({
  ...commonPropOptions,
  onBack: [new MappedProp(pop, '[pop the stack]'), undefined] as const,
});

// The guide pages' views (see overview.tsx, parts.tsx).

/** The root's options in the guide's views; `pop` pops the stack. */
export const getPropOptionsGuideRoot = (pop: () => void) => ({
  className: commonPropOptions.className,
  style: commonPropOptions.style,
  onBack: [new MappedProp(pop, '[pop the stack]'), undefined] as const,
});

/**
 * The compact-or-regular view's content: a phone's or a tablet's layout, or
 * (unset) by the window's width.
 */
export const propOptionsAdaptiveContent = {
  layout: [undefined, 'phone', 'tablet'] as const,
};
