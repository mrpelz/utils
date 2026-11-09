/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import type { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';

import {
  Button,
  type ColorPickerChangeEventDetails,
  type ColorPickerSavedColorsChangeEventDetails,
  Toolbar,
} from '../../../components/index.js';
import { AddLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  MappedProp,
} from '../../tooling/frame/prop-control.js';

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
  render: [undefined, new MappedProp(<section />, '[<section />]')] as const,
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
  // (Its modes' values, see panel.tsx: across its mode sets.)
  defaultMode: [undefined, 'grid', 'spectrum', 'rgb', 'hsl', 'cmyk'] as const,
  mode: [undefined, 'grid', 'spectrum', 'rgb', 'hsl', 'cmyk'] as const,
  onModeChange: [
    new MappedProp(
      (mode: string, { reason }: BaseRadioGroup.ChangeEventDetails) =>
        addLog(`mode change: ${mode} (${reason})`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

/** The panel's (its element's only). */
export const propOptionsPanel = propOptionsElement;

export const getPropOptionsSwatches = (addLog: AddLog) => ({
  ...propOptionsElement,
  defaultSavedColors: [
    undefined,
    new MappedProp<string[]>(fourteenColors, '[14 colors: 2 pages]'),
  ] as const,
  savedColors: [
    undefined,
    new MappedProp<string[]>(['#FF3B30', '#34C759'], '[red, green]'),
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

export const propOptionsSliders = {
  ...propOptionsElement,
  model: [undefined, 'rgb', 'hsl', 'cmyk'] as const,
  range: [undefined, 'byte', 'percentage'] as const,
};

/** A mode's (its label; its value, the view's it shows). */
export const propOptionsMode = {
  ...propOptionsElement,
  children: ['Spectrum', 'Colors'] as const,
  disabled: [undefined, false, true] as const,
};

/** Parts without props of their own (their element's). */
export const propOptionsPart = propOptionsElement;

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

export const propOptionsSystemColors = propOptionsEyedropper;

/** The code's (its element's; its children: the copy button). */
export const propOptionsCode = propOptionsElement;

/** The named colors' (its element's; its children: its sections). */
export const propOptionsNamed = propOptionsElement;

/** A named color's row: its color (any CSS color's syntax), its label. */
export const propOptionsNamedColor = {
  ...propOptionsElement,
  color: ['#AF52DE', 'oklch(70% 0.2 150)', 'rebeccapurple'] as const,
  children: [undefined, 'Brand purple'] as const,
};

/** The code's copy button: what it renders, disabled, its copies logged. */
export const getPropOptionsCodeCopy = (addLog: AddLog) => ({
  ...propOptionsElement,
  render: [
    undefined,
    new MappedProp(
      <Button.Root
        shape="circle"
        size="small"
        variant="bordered"
      />,
      '[<Button.Root shape="circle" size="small" variant="bordered" />]',
    ),
  ] as const,
  disabled: [undefined, false, true] as const,
  onCodeCopy: [
    new MappedProp((code: string) => addLog(`copy: ${code}`), '[log copy]'),
    undefined,
  ] as const,
});

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
  // In a popover (regular), or a sheet (compact); by default, by the window's
  // size class (see Viewport's `useSizeClass`).
  container: [undefined, 'popover', 'sheet'] as const,
  defaultOpen: [false, true] as const,
};

/** The overview's and the list row's presentation (as `container`). */
export const propOptionsPresentation = {
  presentation: [undefined, 'popover', 'sheet'] as const,
};

/**
 * The overview's: its presentation, which modes (the named colors' too)
 * and the opacity its panel renders (see panel.tsx); RGB's, in which range;
 * the sliders' code row and its copy button, or none; the system colors'
 * button, or none.
 */
export const propOptionsOverviewContent = {
  ...propOptionsPresentation,
  grid: [true, false] as const,
  spectrum: [true, false] as const,
  rgb: ['byte', 'percentage', false] as const,
  hsl: [false, true] as const,
  cmyk: [false, true] as const,
  named: [false, true] as const,
  opacity: [true, false] as const,
  code: [true, false] as const,
  codeCopy: [true, false] as const,
  systemColors: [true, false] as const,
};

/** The overview's few: the picker's mode (its color the demo's). */
export const propOptionsOverview = {
  defaultMode: [undefined, 'spectrum', 'rgb', 'hsl', 'cmyk'] as const,
};
