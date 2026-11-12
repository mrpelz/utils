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
    'The contrast: standard, or increased.',
  ],
  [
    'differentiateWithoutColor',
    'boolean',
    code('false'),
    <>
      Shows state with more than color alone: shapes, symbols or labels (for
      example a <a href={publicUrl('switch')}>Switch</a>’s on/off labels). The
      web has no system signal for it.
    </>,
  ],
  [
    'reducedMotion',
    'boolean',
    <>
      the system’s (<code>prefers-reduced-motion: reduce</code>)
    </>,
    'Reduces motion: no slides, zooms or movement. Fades stay.',
  ],
  [
    'reducedTransparency',
    'boolean',
    <>
      the system’s (<code>prefers-reduced-transparency: reduce</code>)
    </>,
    'Reduces transparency: materials become opaque.',
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
      ’s <code>textSize</code>). The web has no system signal for it.
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
    'style',
    'Record<string, string>',
    undefined,
    <>
      The overridden settings, as custom properties (
      <code>--uikit-settings-*</code>) and <code>color-scheme</code>.
    </>,
  ],
];
