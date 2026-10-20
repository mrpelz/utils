/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { AddLog } from '../frame/log.js';
import { commonPropOptions, MappedProp } from '../frame/prop-control.js';

export const getPropOptionsRoot = (addLog: AddLog) => ({
  ...commonPropOptions,
  defaultValue: ['#AF52DE', '#007AFF', '#FF3B3080'] as const,
  onValueChange: [
    new MappedProp(
      (value: string) => addLog(`value change: ${value}`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

export const getPropOptionsPanel = (addLog: AddLog) => ({
  ...commonPropOptions,
  defaultMode: [undefined, 'grid', 'spectrum', 'sliders'] as const,
  defaultSavedColors: [
    undefined,
    new MappedProp<string[]>(
      [
        '#000000',
        '#007AFF',
        '#34C759',
        '#FFCC00',
        '#FF3B30',
        '#7AC6F5',
        '#AF52DE',
        '#5856D6',
        '#FF2D55',
        '#8E8E93',
        '#FF9500',
        '#00C7BE',
        '#A2845E',
        '#30B0C7',
      ],
      '[14 colors: 2 pages]',
    ),
  ] as const,
  onSavedColorsChange: [
    new MappedProp(
      (colors: string[]) => addLog(`saved colors: ${colors.join(', ')}`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

export const propOptionsWell = {
  size: [undefined, 'small', 'large'] as const,
};

export const propOptionsContent = {
  // In a popover (iPad), or a sheet (iPhone).
  container: ['popover', 'sheet'] as const,
  defaultOpen: [false, true] as const,
};
