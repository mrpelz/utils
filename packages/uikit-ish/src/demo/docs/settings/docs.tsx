import {
  code,
  elementRows,
  PropRow,
  union,
} from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// Its props and values, for the parts page (all) and the overview (its key
// ones).

/** Each setting: its name, its type, its system signal, what it means. */
const settingRows: readonly PropRow[] = [
  [
    'boldText',
    'boolean',
    code('false'),
    <>
      Makes every weight one step heavier: regular text becomes semibold,
      semibold becomes bold. Each weight in the library adds{' '}
      <code>--uikit-font-weight-boost</code> (190 while it’s on), so your own
      styles can follow it the same way. The web has no system signal for it, so
      it’s your app’s own setting.
    </>,
  ],
  [
    'colorScheme',
    union('light', 'dark'),
    <>
      the system’s (<code>prefers-color-scheme</code>)
    </>,
    'The color scheme.',
  ],
  [
    'contrast',
    union('standard', 'more'),
    <>
      the system’s (<code>prefers-contrast: more</code>,{' '}
      <code>forced-colors: active</code>)
    </>,
    'The contrast: standard, or increased. More contrast darkens secondary text, separators, fills and grouped backgrounds (lightens them in dark mode), uses the system colors’ more-contrast variants and your app’s --uikit-tint-more-contrast, if you set one, and makes materials opaque, as reduced transparency does.',
  ],
  [
    'differentiateWithoutColor',
    'boolean',
    code('false'),
    <>
      Shows state with more than color alone.{' '}
      <a href={publicUrl('switch')}>Switch</a>es show their on/off labels, a{' '}
      <a href={publicUrl('text-field')}>Text Field</a>’s error starts with an
      exclamation mark, and a <a href={publicUrl('date-picker')}>Date Picker</a>
      ’s calendar shows today in bold and gives days highlighted by their color
      a dot. Links in the library’s text parts are underlined. The web has no
      system signal for it. When it’s on, underline the links in your own text
      too.
    </>,
  ],
  [
    'languages',
    'readonly string[]',
    <>
      the browser’s (<code>navigator.languages</code>,{' '}
      <code>languagechange</code>; Safari reports only the first)
    </>,
    <>
      The preferred languages, ranked, as language tags (for example{' '}
      <code>en-GB</code>, then <code>de</code>). Use them to choose your app’s
      translation with{' '}
      <PartLink
        component="settings"
        part="useLanguage"
      />{' '}
      or{' '}
      <PartLink
        component="settings"
        part="matchLanguage"
      />
      . A provider that sets them sets <code>lang</code> on its element (the
      first one). Given, they replace an outer provider’s as a whole.
    </>,
  ],
  [
    'locale',
    'string',
    'the first preferred language, with the region',
    <>
      The formatting locale, for dates, times and numbers only, never for
      choosing a translation. Components with a <code>locale</code> prop use it
      unless you give them one. Resolved, it includes the region: an American
      and a British person in Germany both get <code>en-DE</code>, as on their
      phones. To format as in their language’s own country, give a{' '}
      <code>locale</code> (for example <code>en-GB</code>) or a{' '}
      <code>region</code>.
    </>,
  ],
  [
    'reducedMotion',
    'boolean',
    <>
      the system’s (<code>prefers-reduced-motion: reduce</code>)
    </>,
    <>
      Reduces motion: everything that would animate changes at once. Pages,
      sheets, drawers, menus and alerts appear and go without moving or fading,
      and scrolls a component starts jump. What you drag with your finger still
      follows it, and a page you swipe back in a{' '}
      <a href={publicUrl('navigation')}>Navigation</a> finishes its slide when
      you let go.
    </>,
  ],
  [
    'reducedTransparency',
    'boolean',
    <>
      the system’s (<code>prefers-reduced-transparency: reduce</code>)
    </>,
    'Reduces transparency: glass becomes opaque, and the edge under bars turns solid instead of blurring what scrolls beneath. Dimming behind sheets, alerts and drawers stays.',
  ],
  [
    'region',
    'string | undefined',
    <>
      guessed from the time zone (see{' '}
      <PartLink
        component="settings"
        part="refreshSettings"
      />
      )
    </>,
    <>
      The region (for example <code>DE</code>), for the first day of the week,
      the hour cycle and how numbers are written: it goes into the formatting{' '}
      <code>locale</code>. A preferred language’s own region (the{' '}
      <code>GB</code> of <code>en-GB</code>) yields to it, so give one to format
      as somewhere else than the time zone says. A <code>locale</code> you give
      with a region keeps it, unless you give a region too. In UTC, no region is
      guessed.
    </>,
  ],
  [
    'textSize',
    'TextSize',
    <>
      the system’s, where the browser reports it (Safari, through{' '}
      <code>-apple-system-body</code>), else <code>large</code>
    </>,
    <>
      The text size (the same sizes as{' '}
      <PartLink
        component="typography"
        part="Typography"
      />
      ’s <code>textSize</code>, which wins inside it). Text in lists, menus,
      alerts, fields and buttons grows with it, and list rows grow with their
      text. Bar titles grow up to xxLarge and never shrink below large. Parts
      whose text sits in a fixed shape keep their size: tab bars, toolbars,
      segmented controls, switches, steppers, rolls, cards and a calendar’s days
      (see the table on the overview). The system’s size has no event, so it’s
      read when it’s first used and again by{' '}
      <PartLink
        component="settings"
        part="refreshSettings"
      />
      .
    </>,
  ],
];

export const settingsProviderRows: readonly PropRow[] = [
  ...settingRows.map(([name, type, , description]): PropRow => [
    name,
    type,
    'inherited',
    <>
      {description} Given as <code>undefined</code>, it’s reset to the system’s
      value, or the default.
    </>,
  ]),
  ['children', 'ReactNode', undefined, 'What the settings apply to.'],
  [
    'render',
    'ReactElement | (props, state) => ReactElement',
    undefined,
    'Replaces its element (for example with a page’s own). The settings are set on that element.',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

/** `useSettings()`'s values: each setting, resolved (with its default). */
export const settingsValuesRows: readonly PropRow[] = settingRows;

export const settingsPortalPropsRows: readonly PropRow[] = [
  [
    'data-color-scheme',
    union('light', 'dark'),
    undefined,
    'The color scheme, if a provider sets one.',
  ],
  [
    'data-uikit-bold-text',
    union('true', 'false'),
    undefined,
    'Bold text, as where the portal was opened (always).',
  ],
  [
    'data-uikit-contrast',
    union('standard', 'more'),
    undefined,
    'The contrast, if a provider sets it.',
  ],
  [
    'data-uikit-differentiate-without-color',
    union('true', 'false'),
    undefined,
    'Differentiating without color, if a provider sets it.',
  ],
  [
    'data-uikit-reduced-motion',
    union('true', 'false'),
    undefined,
    'Reduce Motion, if a provider sets it.',
  ],
  [
    'data-uikit-reduced-transparency',
    union('true', 'false'),
    undefined,
    'Reduce Transparency, if a provider sets it.',
  ],
  [
    'data-uikit-settings',
    'string',
    undefined,
    'Marks the portal as inside a provider, so the system’s settings apply in it.',
  ],
  [
    'data-uikit-text-size',
    'TextSize',
    undefined,
    'The text size, as where the portal was opened (always).',
  ],
  [
    'lang',
    'string',
    undefined,
    <>
      The first of the <code>languages</code>, if a provider sets them.
    </>,
  ],
];
