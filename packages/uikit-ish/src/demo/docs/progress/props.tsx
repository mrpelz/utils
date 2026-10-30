import {
  commonPropOptions,
  MappedProp,
} from '../../tooling/frame/prop-control.js';

export const propOptionsBar = {
  ...commonPropOptions,
  // (null: indeterminate.)
  value: [40, 0, 10, 90, 100, null] as const,
  tint: [
    undefined,
    'var(--color-ui-system-green)',
    'var(--color-ui-system-orange)',
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
  display: [
    undefined,
    'animate',
    'freeze',
    'reset',
    'finish',
    'finish-and-hide',
    'none',
  ] as const,
  progress: [undefined, 0.25, 0.5, -0.25, 1.5] as const,
  duration: [undefined, 0.5, 2] as const,
  synchronized: [undefined, false, true] as const,
  color: [
    undefined,
    'var(--color-ui-label)',
    'var(--color-ui-primary)',
  ] as const,
  children: [undefined, 'Loading'] as const,
};

/** `Progress.Root` (the parts page's): all of its props. */
export const propOptionsGuideRoot = {
  ...propOptionsBar,
  min: [undefined, 0, 20] as const,
  max: [undefined, 100, 200] as const,
  synchronized: [undefined, false, true] as const,
  format: [
    undefined,
    new MappedProp<Intl.NumberFormatOptions>(
      { style: 'unit', unit: 'megabyte' },
      '[megabytes]',
    ),
  ] as const,
  locale: [undefined, 'en-US', 'de-DE'] as const,
  getAriaValueText: [
    undefined,
    new MappedProp(
      (formattedValue: string) => `${formattedValue} downloaded`,
      '[… downloaded]',
    ),
  ] as const,
};

/** `Progress.Track`, `Progress.Indicator`: their own props only. */
export const propOptionsPart = { ...commonPropOptions };

/** `Progress.Label` (the parts page's). */
export const propOptionsGuideLabel = {
  ...propOptionsLabel,
  children: ['Downloading', 'Installing Update'] as const,
};

/** `Progress.Value` (the parts page's). */
export const propOptionsGuideValue = {
  ...propOptionsValue,
  children: [
    undefined,
    new MappedProp(
      (formattedValue: string | null) => `${String(formattedValue)} done`,
      '[… done]',
    ),
  ] as const,
};

/** The overview's: the bar's value and where its value is. */
export const propOptionsOverviewRoot = {
  value: propOptionsBar.value,
  tint: propOptionsBar.tint,
};

export const propOptionsOverviewValue = {
  placement: propOptionsValue.placement,
};
