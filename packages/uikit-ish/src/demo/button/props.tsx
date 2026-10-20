/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { sfChevronUpChevronDown } from '@bradleyhodges/sfsymbols/sfChevronUpChevronDown';
import { sfHeartFill } from '@bradleyhodges/sfsymbols/sfHeartFill';
import { sfPlus } from '@bradleyhodges/sfsymbols/sfPlus';

import { Symbol } from '../../components/index.js';
import { AddLog } from '../frame/log.js';
import { commonPropOptions, MappedProp } from '../frame/prop-control.js';

export const propOptionsContent = {
  symbol: [
    undefined,
    new MappedProp(<Symbol icon={sfHeartFill} />, '[heart.fill]'),
    new MappedProp(<Symbol icon={sfPlus} />, '[plus]'),
    new MappedProp(
      <Symbol icon={sfChevronUpChevronDown} />,
      '[chevron.up.chevron.down]',
    ),
  ] as const,
  label: ['Button', undefined, 'Long button label'] as const,
  // A pop-up button: the label, then the symbol.
  order: ['symbolFirst', 'labelFirst'] as const,
} as const;

export const propOptionsRoot = {
  ...commonPropOptions,
  disabled: [undefined, false, true] as const,
  focusableWhenDisabled: [undefined, false, true] as const,
  cursor: [undefined, 'auto', 'pointer', 'copy'] as const,
  variant: [
    undefined,
    'borderless',
    'bordered',
    'bordered-secondary',
    'bordered-prominent',
    'glass',
    'glass-prominent',
  ] as const,
  size: [undefined, 'small', 'medium', 'large'] as const,
  shape: [undefined, 'capsule', 'circle', 'roundedRectangle'] as const,
  destructive: [undefined, false, true] as const,
  // Over the tint: dark, light, or custom.
  textColor: [
    undefined,
    '#000',
    '#fff',
    'var(--color-ios-system-indigo)',
  ] as const,
  tint: [
    undefined,
    'var(--color-ios-system-yellow)',
    'var(--color-ios-system-gray)',
    '#000',
  ] as const,
  fill: [undefined, false, true] as const,
  context: [
    undefined,
    'bright',
    'dim',
    'background-bright',
    'background-dim',
  ] as const,
};

export const propOptionsMatrix = {
  destructive: [false, true] as const,
  context: [
    undefined,
    'bright',
    'dim',
    'background-bright',
    'background-dim',
  ] as const,
};

export const getPropOptionsRoot = (addLog: AddLog) => ({
  ...propOptionsRoot,
  onClick: [
    new MappedProp(() => addLog('button has been clicked'), '[log click]'),
    undefined,
  ] as const,
  onSecondaryClick: [
    undefined,
    new MappedProp(
      () => addLog('button secondary click'),
      '[log secondary click]',
    ),
  ] as const,
});
