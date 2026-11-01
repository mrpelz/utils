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
    'Contrast: the standard one, or increased.',
  ],
  [
    'differentiateWithoutColor',
    'boolean',
    code('false'),
    <>
      State told without color alone: shapes, symbols, labels (e.g. a{' '}
      <a href={publicUrl('switch')}>Switch</a>’s on/off labels). No system
      signal on the web.
    </>,
  ],
  [
    'reducedMotion',
    'boolean',
    <>
      the system’s (<code>prefers-reduced-motion: reduce</code>)
    </>,
    'Motion reduced: no slides, zooms or movement; fades kept.',
  ],
  [
    'reducedTransparency',
    'boolean',
    <>
      the system’s (<code>prefers-reduced-transparency: reduce</code>)
    </>,
    'Transparency reduced: materials opaque.',
  ],
  [
    'textSize',
    'TextSize',
    code(union('large')),
    <>
      The text size (see{' '}
      <PartLink
        component="typography"
        part="Typography"
      />
      ’s <code>textSize</code>). No system signal on the web.
    </>,
  ],
];

export const settingsProviderRows: readonly PropRow[] = [
  ...settingRows.map(([name, type, , description]): PropRow => [
    name,
    type,
    'inherited',
    <>
      {description} Given <code>undefined</code>: reset (the system’s, or the
      default).
    </>,
  ]),
  ['children', 'ReactNode', undefined, 'What the settings are for.'],
  [
    'render',
    'ReactElement | (props, state) => ReactElement',
    undefined,
    'Its element replaced (e.g. a page’s own), its settings on it.',
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
    'The color scheme, where a provider sets one.',
  ],
  [
    'style',
    'Record<string, string>',
    undefined,
    <>
      The overridden settings as custom properties (
      <code>--uikit-settings-*</code>) and <code>color-scheme</code>.
    </>,
  ],
];
