/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { AddLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  MappedProp,
} from '../../tooling/frame/prop-control.js';

export const propOptionsContent = {
  defaultOpen: [false, true] as const,
  thumbnail: [true, false] as const,
};

// The guide pages' views (see parts.tsx).

/** A part's own element (no `render`). */
export const propOptionsElement = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
};

/** A person's or an action's button. */
export const getPropOptionsButton = (addLog: AddLog) => ({
  ...propOptionsElement,
  disabled: [undefined, false, true] as const,
  onClick: [
    new MappedProp(() => addLog('clicked'), '[log click]'),
    undefined,
  ] as const,
});

/** A row's name (it's a list). */
export const propOptionsRow = {
  ...propOptionsElement,
  'aria-label': ['People', 'Actions', undefined] as const,
};
