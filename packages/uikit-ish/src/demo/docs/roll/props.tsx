/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import type {
  RollChangeEventDetails,
  RollValue,
} from '../../../components/index.js';
import { AddLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  MappedProp,
} from '../../tooling/frame/prop-control.js';

export const hours = Array.from({ length: 24 }, (_, hour) => hour);
export const minutes = Array.from({ length: 60 }, (_, minute) => minute);
export const fruits = [
  'Apple',
  'Banana',
  'Cherry',
  'Durian',
  'Elderberry',
  'Fig',
  'Grape',
] as const;

/** Its parts' own elements (no `render`). */
const propOptionsElement = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
};

export const getPropOptionsColumn = (addLog: AddLog) => ({
  ...propOptionsElement,
  defaultValue: [9, 0, 12, 23, undefined] as const,
  value: [undefined, 9, 17] as const,
  align: [undefined, 'start', 'center', 'end'] as const,
  disabled: [undefined, false, true] as const,
  editable: [true, false, undefined] as const,
  loop: [undefined, false, true] as const,
  'aria-label': ['Hours', 'Start hour'] as const,
  onValueChange: [
    new MappedProp(
      (value: RollValue, { reason }: RollChangeEventDetails) =>
        addLog(`hours: ${String(value)} (${reason})`),
      '[log change]',
    ),
    undefined,
  ] as const,
  onHighlightChange: [
    new MappedProp(
      (value: RollValue, { reason }: RollChangeEventDetails) =>
        addLog(`hours highlighted: ${String(value)} (${reason})`),
      '[log highlight]',
    ),
    undefined,
  ] as const,
});

/** The overview's few: its column's behavior. */
export const propOptionsOverview = {
  editable: [undefined, true] as const,
  loop: [undefined, true] as const,
  align: [undefined, 'start', 'end'] as const,
  disabled: [undefined, true] as const,
};

export const propOptionsItem = {
  ...propOptionsElement,
  disabled: [undefined, false, true] as const,
};

export const propOptionsRoot = propOptionsElement;

export const propOptionsSeparator = propOptionsElement;
