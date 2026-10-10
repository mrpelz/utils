/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { Slider as BaseSlider } from '@base-ui/react/slider';
import { sfHareFill } from '@bradleyhodges/sfsymbols/sfHareFill';
import { sfSpeakerFill } from '@bradleyhodges/sfsymbols/sfSpeakerFill';
import { sfSpeakerWave3Fill } from '@bradleyhodges/sfsymbols/sfSpeakerWave3Fill';
import { sfSunMax } from '@bradleyhodges/sfsymbols/sfSunMax';
import { sfSunMin } from '@bradleyhodges/sfsymbols/sfSunMin';
import { sfTortoiseFill } from '@bradleyhodges/sfsymbols/sfTortoiseFill';

import { AddLog } from '../utils/log.js';
import { commonPropOptions, MappedProp } from '../utils/main.js';
import { SFSymbol } from '../utils/symbol.js';

export const propOptionsContent = {
  thumbs: [1, 2] as const,
  ticks: [0, 6, 11] as const,
  minSymbol: [
    undefined,
    new MappedProp(<SFSymbol icon={sfTortoiseFill} />, '[tortoise.fill]'),
    new MappedProp(<SFSymbol icon={sfSpeakerFill} />, '[speaker.fill]'),
    new MappedProp(<SFSymbol icon={sfSunMin} />, '[sun.min]'),
    'A',
  ] as const,
  maxSymbol: [
    undefined,
    new MappedProp(<SFSymbol icon={sfHareFill} />, '[hare.fill]'),
    new MappedProp(
      <SFSymbol icon={sfSpeakerWave3Fill} />,
      '[speaker.wave.3.fill]',
    ),
    new MappedProp(<SFSymbol icon={sfSunMax} />, '[sun.max]'),
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
  thumbAlignment: [undefined, 'center', 'edge', 'edge-client-only'] as const,
  thumbCollisionBehavior: [undefined, 'push', 'swap', 'none'] as const,
  cursor: [undefined, 'auto', 'pointer', 'copy'] as const,
  tint: [
    undefined,
    'var(--color-ios-system-orange)',
    'var(--color-ios-system-green)',
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
  ...commonPropOptions,
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
