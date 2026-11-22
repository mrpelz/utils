import type { SettingsProviderProps } from '../../../components/index.js';
import {
  commonPropOptions,
  MappedProp,
} from '../../tooling/frame/prop-control.js';

/** A setting left out (inherited from the outer provider), as an option. */
export const inherit = Symbol('inherit');

const inherited = new MappedProp(inherit, '[inherit]');

// Each setting: left out ([inherit]), reset (undefined: the system's, or
// the default), or overridden.
export const propOptionsProvider = {
  colorScheme: [inherited, undefined, 'light', 'dark'] as const,
  contrast: [inherited, undefined, 'standard', 'more'] as const,
  differentiateWithoutColor: [inherited, undefined, false, true] as const,
  reducedMotion: [inherited, undefined, false, true] as const,
  reducedTransparency: [inherited, undefined, false, true] as const,
  textSize: [
    inherited,
    undefined,
    'xSmall',
    'large',
    'xxxLarge',
    'ax3',
  ] as const,
};

/** The parts page's provider: its settings, its element's props. */
export const propOptionsProviderPart = {
  ...propOptionsProvider,
  className: commonPropOptions.className,
  render: [undefined, new MappedProp(<section />, '[<section />]')] as const,
  style: commonPropOptions.style,
};

/** A provider's props as given (those inherited left out, not reset). */
export const given = (props: Record<string, unknown>): SettingsProviderProps =>
  Object.fromEntries(
    Object.entries(props).filter(([, value]) => value !== inherit),
  ) as SettingsProviderProps;

/**
 * The tint demo's app tint (`--uikit-tint`): none (the system blue), or
 * one of a few, each with its more-contrast variant
 * (`--uikit-tint-more-contrast`), given or not.
 */
export const propOptionsTint = {
  tint: [undefined, 'pink', 'indigo', 'teal (custom)'] as const,
  moreContrastVariant: [true, false] as const,
};

/** Each tint: standard, and with more contrast (light, dark). */
export const tints: Readonly<Record<string, readonly [string, string]>> = {
  indigo: [
    'light-dark(rgb(97 85 245), rgb(109 124 255))',
    'light-dark(rgb(86 74 222), rgb(167 170 255))',
  ],
  pink: [
    'light-dark(rgb(255 45 85), rgb(255 55 95))',
    'light-dark(rgb(231 18 77), rgb(255 138 196))',
  ],
  'teal (custom)': [
    'light-dark(rgb(0 128 128), rgb(64 200 200))',
    'light-dark(rgb(0 92 92), rgb(140 230 230))',
  ],
};
