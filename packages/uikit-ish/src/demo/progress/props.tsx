import { commonPropOptions } from '../frame/prop-control.js';

export const propOptionsBar = {
  ...commonPropOptions,
  // (null: indeterminate.)
  value: [40, 0, 10, 90, 100, null] as const,
  tint: [
    undefined,
    'var(--color-ios-system-green)',
    'var(--color-ios-system-orange)',
  ] as const,
};

export const propOptionsBarContent = {
  label: [undefined, 'Downloading'] as const,
  showValue: [false, true] as const,
};

export const propOptionsLabel = {
  ...commonPropOptions,
  placement: [
    undefined,
    'block-start',
    'block-end',
    'inline-start',
    'inline-end',
  ] as const,
};

export const propOptionsValue = {
  ...commonPropOptions,
  placement: [
    undefined,
    'block-start',
    'block-end',
    'inline-start',
    'inline-end',
    'tooltip',
    'momentary-tooltip',
  ] as const,
};

export const propOptionsIndicator = {
  ...commonPropOptions,
  size: [undefined, 'regular', 'small'] as const,
  movement: [undefined, 'stepped', 'rotate', 'fade'] as const,
  animating: [undefined, true, false] as const,
  duration: [undefined, 0.5, 2] as const,
  color: [
    undefined,
    'var(--color-ios-label)',
    'var(--color-ios-primary)',
  ] as const,
  children: [undefined, 'Loading'] as const,
};
