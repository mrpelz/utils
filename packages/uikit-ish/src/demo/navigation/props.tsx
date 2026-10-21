/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import {
  type NavigationBackEventDetails,
  Toolbar,
} from '../../components/index.js';
import { AddLog } from '../frame/log.js';
import { commonPropOptions, MappedProp } from '../frame/prop-control.js';

/** Popping the shown stack (logging why). */
type Pop = (eventDetails: NavigationBackEventDetails) => void;

/** The root's options; `pop` pops the shown stack (see `NavigationDemo`). */
export const getPropOptionsRoot = (pop: Pop) => ({
  ...commonPropOptions,
  onBack: [new MappedProp(pop, '[pop the stack]'), undefined] as const,
});

// The guide pages' views (see overview.tsx, parts.tsx).

/** The root's options in the guide's views; `pop` pops the stack. */
export const getPropOptionsGuideRoot = (pop: Pop) => ({
  className: commonPropOptions.className,
  style: commonPropOptions.style,
  onBack: [new MappedProp(pop, '[pop the stack]'), undefined] as const,
});

/** A back button's options in the guide's views (its presses logged). */
export const getPropOptionsGuideBack = (addLog: AddLog) => ({
  className: commonPropOptions.className,
  style: commonPropOptions.style,
  render: [
    new MappedProp(<Toolbar.Button shape="circle" />, '[<Toolbar.Button />]'),
    new MappedProp(<button type="button" />, '[<button />]'),
  ] as const,
  disabled: [undefined, true] as const,
  onClick: [
    undefined,
    new MappedProp(() => addLog('back clicked'), '[log click]'),
  ] as const,
});

/**
 * The compact-or-regular view's content: a phone's or a tablet's layout, or
 * (unset) by the window's width.
 */
export const propOptionsAdaptiveContent = {
  layout: [undefined, 'phone', 'tablet'] as const,
};
