import type { useRender } from '@base-ui/react/use-render';

import type { TextSize } from '../typography/main.js';
import type { ColorScheme } from '../utils/main.js';

/** Contrast: the standard one, or increased. */
export type SettingsContrast = 'more' | 'standard';

/** The settings, resolved (see `useSettings`). */
export type SettingsValues = {
  /** The color scheme (system: `prefers-color-scheme`). */
  colorScheme: ColorScheme;
  /**
   * Contrast (system: `prefers-contrast: more`, or `forced-colors:
   * active`).
   */
  contrast: SettingsContrast;
  /**
   * State told without color alone: shapes, symbols, labels (e.g. a
   * switch's on/off labels). No system signal on the web.
   */
  differentiateWithoutColor: boolean;
  /**
   * Motion reduced: no slides, zooms or movement, fades kept (system:
   * `prefers-reduced-motion: reduce`).
   */
  reducedMotion: boolean;
  /**
   * Transparency reduced: materials opaque (system:
   * `prefers-reduced-transparency: reduce`).
   */
  reducedTransparency: boolean;
  /** The text size. No system signal on the web. */
  textSize: TextSize;
};

/**
 * A provider's settings: each given, an override (for what's within it);
 * given as `undefined`, reset (the system's, or the default, whatever an
 * outer provider set); left out, its outer provider's.
 */
export type SettingsProviderProps = Partial<SettingsValues> &
  useRender.ComponentProps<'div'>;

/** A portal's props for the settings of where it's opened (see `Portal`s). */
export type SettingsPortalProps = {
  'data-color-scheme'?: ColorScheme;
  style?: Record<string, string>;
};
