/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { haptics, RollValue } from '../../components/index.js';
import { AddLog } from '../utils/log.js';
import { commonPropOptions, MappedProp } from '../utils/main.js';

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

export const getPropOptionsColumn = (addLog: AddLog) => ({
  ...commonPropOptions,
  defaultValue: [9, 0, 12, 23, undefined] as const,
  value: [undefined, 9, 17] as const,
  align: [undefined, 'start', 'center', 'end'] as const,
  disabled: [undefined, false, true] as const,
  editable: [true, false, undefined] as const,
  onValueChange: [
    new MappedProp(
      (value: RollValue) => addLog(`hours: ${String(value)}`),
      '[log change]',
    ),
    undefined,
  ] as const,
  onHighlightChange: [
    new MappedProp(() => haptics.tap(), '[haptic tap]'),
    new MappedProp(
      (value: RollValue) => addLog(`hours highlighted: ${String(value)}`),
      '[log highlight]',
    ),
    undefined,
  ] as const,
});

export const propOptionsItem = {
  ...commonPropOptions,
  disabled: [undefined, false, true] as const,
};

export {
  commonPropOptions as propOptionsRoot,
  commonPropOptions as propOptionsSeparator,
} from '../utils/main.js';
