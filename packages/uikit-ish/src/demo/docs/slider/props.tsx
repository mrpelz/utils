/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */
import { Slider as BaseSlider } from '@base-ui/react/slider';

import { Symbol } from '../../../components/index.js';
import { AddLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  MappedProp,
} from '../../tooling/frame/prop-control.js';
import {
  sfHareFill,
  sfSpeakerFill,
  sfSpeakerWave3Fill,
  sfSunMax,
  sfSunMin,
  sfTortoiseFill,
} from '../../tooling/icons.js';

export const propOptionsContent = {
  thumbs: [1, 2] as const,
  ticks: [0, 6, 11] as const,
  minSymbol: [
    undefined,
    new MappedProp(<Symbol icon={sfTortoiseFill} />, '[tortoise.fill]'),
    new MappedProp(<Symbol icon={sfSpeakerFill} />, '[speaker.fill]'),
    new MappedProp(<Symbol icon={sfSunMin} />, '[sun.min]'),
    'A',
  ] as const,
  maxSymbol: [
    undefined,
    new MappedProp(<Symbol icon={sfHareFill} />, '[hare.fill]'),
    new MappedProp(
      <Symbol icon={sfSpeakerWave3Fill} />,
      '[speaker.wave.3.fill]',
    ),
    new MappedProp(<Symbol icon={sfSunMax} />, '[sun.max]'),
    'A',
  ] as const,
  label: [undefined, 'Volume'] as const,
  value: [false, true] as const,
} as const;

export const propOptionsRoot = {
  ...commonPropOptions,
  defaultValue: [
    50,
    0,
    100,
    new MappedProp<number[]>([25, 75], '[25, 75]'),
  ] as const,
  value: [
    undefined,
    30,
    new MappedProp<number[]>([10, 90], '[10, 90]'),
  ] as const,
  min: [undefined, 0, 20] as const,
  max: [undefined, 100, 80] as const,
  step: [undefined, 1, 10] as const,
  largeStep: [undefined, 10, 25] as const,
  minStepsBetweenValues: [3, undefined, 0, 10] as const,
  locale: [undefined, 'en-US', 'de-DE', 'ar-EG'] as const,
  format: [
    undefined,
    new MappedProp<Intl.NumberFormatOptions>(
      { minimumFractionDigits: 1 },
      '[{ minimumFractionDigits: 1 }]',
    ),
    new MappedProp<Intl.NumberFormatOptions>(
      { currency: 'EUR', style: 'currency' },
      '[{ style: currency, currency: EUR }]',
    ),
  ] as const,
  disabled: [undefined, false, true] as const,
  orientation: [undefined, 'horizontal', 'vertical'] as const,
  // (Labelled by an element of the page's: its section's heading.)
  'aria-labelledby': [undefined, 'slider-root'] as const,
  thumbAlignment: [undefined, 'center', 'edge', 'edge-client-only'] as const,
  thumbCollisionBehavior: [undefined, 'push', 'swap', 'none'] as const,
  cursor: [undefined, 'auto', 'pointer', 'copy'] as const,
  tint: [
    undefined,
    'var(--color-ui-system-orange)',
    'var(--color-ui-system-green)',
  ] as const,
};

export const propOptionsLabel = {
  ...commonPropOptions,
  placement: [
    undefined,
    'inline-start',
    'inline-end',
    'block-start',
    'block-end',
  ] as const,
};

export const propOptionsValue = {
  ...commonPropOptions,
  placement: [
    undefined,
    'inline-start',
    'inline-end',
    'block-start',
    'block-end',
    'tooltip',
    'momentary-tooltip',
  ] as const,
  children: [
    undefined,
    new MappedProp(
      (formattedValues: readonly string[]) => formattedValues.join(' – '),
      '[join with –]',
    ),
  ] as const,
};

export const propOptionsThumb = {
  ...commonPropOptions,
  tabIndex: [undefined, 0, -1] as const,
  disabled: [undefined, false, true] as const,
};

export const getPropOptionsRoot = (addLog: AddLog) => ({
  ...propOptionsRoot,
  onValueChange: [
    undefined,
    new MappedProp(
      (
        value: number | readonly number[],
        { reason }: BaseSlider.Root.ChangeEventDetails,
      ) => addLog(`value change: ${String(value)}/${reason}`),
      '[log change]',
    ),
  ] as const,
  onValueCommitted: [
    new MappedProp(
      (
        value: number | readonly number[],
        { reason }: BaseSlider.Root.CommitEventDetails,
      ) => addLog(`value committed: ${String(value)}/${reason}`),
      '[log commit]',
    ),
    undefined,
  ] as const,
});

export const getPropOptionsMinSymbol = (addLog: AddLog) => ({
  // (Its own element: no `render`.)
  className: commonPropOptions.className,
  style: commonPropOptions.style,
  edge: ['min', 'max'] as const,
  onClick: [
    undefined,
    new MappedProp(
      () => addLog('min symbol clicked (custom onClick)'),
      '[log click]',
    ),
  ] as const,
});

export const getPropOptionsMaxSymbol = (addLog: AddLog) => ({
  ...commonPropOptions,
  edge: ['max', 'min'] as const,
  onClick: [
    undefined,
    new MappedProp(
      () => addLog('max symbol clicked (custom onClick)'),
      '[log click]',
    ),
  ] as const,
});

export const getPropOptionsThumb = (addLog: AddLog) => ({
  ...propOptionsThumb,
  onBlur: [
    undefined,
    new MappedProp(() => addLog('thumb blur'), '[log blur]'),
  ] as const,
  onFocus: [
    undefined,
    new MappedProp(() => addLog('thumb focus'), '[log focus]'),
  ] as const,
  onKeyDown: [
    undefined,
    new MappedProp(
      ({ key }: KeyboardEvent) => addLog(`thumb key down: ${key}`),
      '[log key down]',
    ),
  ] as const,
  inputRef: [
    undefined,
    new MappedProp(
      (element: HTMLInputElement | null) =>
        addLog(`thumb input ref: ${element?.type ?? 'null'}`),
      '[log ref]',
    ),
  ] as const,
});

/** The overview's look: the ends' symbols (see content.ts), and ticks. */
export const propOptionsOverviewContent = {
  symbols: ['brightness', 'speed', undefined] as const,
  ticks: [0, 6, 11] as const,
};

export const propOptionsTicks = {
  // (Its own element: no `render`.)
  className: commonPropOptions.className,
  style: commonPropOptions.style,
  count: [11, 6, 3] as const,
};

/** The guide's thumb (the first of two): its labels, its index. */
export const getPropOptionsGuideThumb = (addLog: AddLog) => ({
  ...getPropOptionsThumb(addLog),
  index: [0, undefined, 1] as const,
  'aria-label': ['Minimum brightness', undefined] as const,
  'aria-labelledby': [undefined, 'slider-thumb'] as const,
  getAriaLabel: [
    undefined,
    new MappedProp(
      (index: number) => `Brightness ${String(index + 1)}`,
      '[Brightness 1]',
    ),
  ] as const,
  'aria-valuetext': [undefined, 'a quarter'] as const,
  getAriaValueText: [
    undefined,
    new MappedProp(
      (formattedValue: string) => `${formattedValue} percent`,
      '[25 percent]',
    ),
  ] as const,
});
