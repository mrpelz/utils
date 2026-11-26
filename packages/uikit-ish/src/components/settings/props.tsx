import type { useRender } from '@base-ui/react/use-render';

import type { TextSize } from '../typography/main.js';
import type { ColorScheme } from '../utils/main.js';

/** Contrast: the standard one, or increased. */
export type SettingsContrast = 'more' | 'standard';

/** The settings, resolved (see `useSettings`). */
export type SettingsValues = {
  /**
   * Bold text: every weight one step heavier. No system signal on the web
   * (the app's own setting).
   */
  boldText: boolean;
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
   * The preferred languages, ranked (language tags, e.g. `['en-GB',
   * 'de']`): for choosing the app's translations (see `matchLanguage`,
   * `useLanguage`), and a provider's `lang` (its first). System: the
   * browser's (`navigator.languages`; Safari reports only the first).
   * Given, it replaces an outer provider's as a whole.
   */
  languages: readonly string[];
  /**
   * The formatting locale, for `Intl` only (dates, times, numbers, the
   * week's first day, the hour cycle), never for choosing translations
   * (see `languages`): a language tag with its region (see `region`), e.g.
   * `en-DE`. Unless given: the first preferred language, its region the
   * given one, else the time zone's, else its own (so `languages`' region
   * yields to the time zone's). Given (e.g. `en-GB`), as it is, unless
   * `region` is given too.
   */
  locale: string;
  /**
   * Motion reduced: everything that would animate changes at once (no
   * slides, zooms or fades); what a finger drags still follows it (system:
   * `prefers-reduced-motion: reduce`).
   */
  reducedMotion: boolean;
  /**
   * Transparency reduced: materials opaque (system:
   * `prefers-reduced-transparency: reduce`).
   */
  reducedTransparency: boolean;
  /**
   * The region (ISO 3166-1, e.g. `DE`), for the locale's conventions: the
   * first day of the week, the hour cycle, how numbers are written.
   * System: guessed from the time zone (see `refreshSettings`); none for
   * UTC.
   */
  region: string | undefined;
  /**
   * The text size (system: where the browser reports it, Safari's
   * `-apple-system-body`; else large).
   */
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
  'data-uikit-bold-text'?: 'false' | 'true';
  'data-uikit-contrast'?: SettingsContrast;
  'data-uikit-differentiate-without-color'?: 'false' | 'true';
  'data-uikit-reduced-motion'?: 'false' | 'true';
  'data-uikit-reduced-transparency'?: 'false' | 'true';
  'data-uikit-settings'?: '';
  'data-uikit-text-size'?: TextSize;
  lang?: string;
};
