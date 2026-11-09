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
