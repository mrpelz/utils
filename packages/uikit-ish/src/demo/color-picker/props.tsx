/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import type { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';

import {
  type ColorPickerChangeEventDetails,
  type ColorPickerMode,
  type ColorPickerSavedColorsChangeEventDetails,
  Toolbar,
} from '../../components/index.js';
import { AddLog } from '../frame/log.js';
import { commonPropOptions, MappedProp } from '../frame/prop-control.js';

/** Its parts' own elements (no `render`). */
const propOptionsElement = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
};

const fourteenColors = [
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
];

export const getPropOptionsRoot = (addLog: AddLog) => ({
  ...propOptionsElement,
  defaultValue: ['#AF52DE', '#007AFF', '#FF3B3080'] as const,
  value: [undefined, '#34C759'] as const,
  onValueChange: [
    new MappedProp(
      (value: string, { reason }: ColorPickerChangeEventDetails) =>
        addLog(`value change: ${value} (${reason})`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

export const getPropOptionsPanel = (addLog: AddLog) => ({
  ...propOptionsElement,
  defaultMode: [undefined, 'grid', 'spectrum', 'sliders'] as const,
  mode: [undefined, 'grid', 'spectrum', 'sliders'] as const,
  defaultSavedColors: [
    undefined,
    new MappedProp<string[]>(fourteenColors, '[14 colors: 2 pages]'),
  ] as const,
  savedColors: [
    undefined,
    new MappedProp<string[]>(['#FF3B30', '#34C759'], '[red, green]'),
  ] as const,
  onModeChange: [
    new MappedProp(
      (mode: ColorPickerMode, { reason }: BaseRadioGroup.ChangeEventDetails) =>
        addLog(`mode change: ${mode} (${reason})`),
      '[log change]',
    ),
    undefined,
  ] as const,
  onSavedColorsChange: [
    new MappedProp(
      (
        colors: string[],
        { reason }: ColorPickerSavedColorsChangeEventDetails,
      ) => addLog(`saved colors (${reason}): ${colors.join(', ')}`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

export const propOptionsHeader = propOptionsElement;

export const propOptionsEyedropper = {
  ...propOptionsElement,
  render: [
    new MappedProp(
      <Toolbar.Button shape="circle" />,
      '[<Toolbar.Button shape="circle" />]',
    ),
    undefined,
  ] as const,
  disabled: [undefined, false, true] as const,
};

/** The main demo's well (its color the picked one). */
export const propOptionsWell = {
  size: [undefined, 'small', 'large'] as const,
};

/** The parts page's well: all its props. */
export const propOptionsGuideWell = {
  ...propOptionsElement,
  ...propOptionsWell,
  color: [undefined, '#AF52DE', '#007AFF80'] as const,
};

export const propOptionsContent = {
  // In a popover (iPad), or a sheet (iPhone).
  container: ['popover', 'sheet'] as const,
  defaultOpen: [false, true] as const,
};

/** The overview's few: the panel's view (its color the demo's). */
export const propOptionsOverview = {
  defaultMode: [undefined, 'spectrum', 'sliders'] as const,
};
