import { FunctionComponent, ReactNode } from 'react';

import { PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/settings`'s table: which components follow which setting, and how (as
// the code does: its attributes, hooks and tokens).

/**
 * A component's name, linking to its page (Glass: its glossary term, as it
 * has no page of its own).
 */
const component = (id: string, name: string) => (
  <a href={publicUrl(id === 'glass' ? 'glossary#glass' : id)}>{name}</a>
);

/** The separator before a list's entry: none, a comma, or the last “and”. */
const separatorOf = (index: number, count: number) => {
  if (index === 0) return '';
  return index === count - 1 ? ' and ' : ', ';
};

/** Components' names, linked, in a sentence (“A, B and C”). */
const components = (...entries: readonly (readonly [string, string])[]) =>
  entries.map(([id, name], index) => (
    <span key={id}>
      {separatorOf(index, entries.length)}
      {component(id, name)}
    </span>
  ));

const rows: readonly (readonly [
  setting: string,
  followedBy: ReactNode,
  how: ReactNode,
])[] = [
  [
    'colorScheme',
    'Every component',
    'Its colors are light-dark() pairs, following color-scheme; glass picks its tone by it.',
  ],
  [
    'contrast',
    <>
      Every component;{' '}
      {components(['glass', 'Glass'], ['viewport', 'Viewport'])} especially
    </>,
    'The color tokens (labels, separators, fills, grouped backgrounds, the system colors, your tint) switch to their more-contrast values. Glass turns opaque; the window’s background follows.',
  ],
  [
    'reducedMotion',
    <>
      Every transition;{' '}
      {components(
        ['navigation', 'Navigation'],
        ['list', 'List'],
        ['sheet', 'Sheet'],
        ['grid', 'Grid'],
        ['card', 'Card'],
        ['date-picker', 'Date Picker'],
        ['color-picker', 'Color Picker'],
        ['segmented', 'Segmented'],
        ['viewport', 'Viewport'],
      )}{' '}
      in script
    </>,
    'Everything that would animate changes at once: pushes and pops, rows opening, sheets, tiles moving, month pages, scrolls started in script. What a finger drags still follows it.',
  ],
  [
    'reducedTransparency',
    <>
      {components(['glass', 'Glass'], ['viewport', 'Viewport'])}, and everything
      on glass (bars, menus, popovers, sheets, alerts, buttons)
    </>,
    'Glass turns opaque, and edges under bars turn solid instead of blurring what scrolls beneath.',
  ],
  [
    'differentiateWithoutColor',
    <>
      {components(
        ['switch', 'Switch'],
        ['text-field', 'Text Field'],
        ['date-picker', 'Date Picker'],
      )}
      ; links in{' '}
      {components(
        ['typography', 'Typography'],
        ['list', 'List'],
        ['alert', 'Alert'],
        ['text-field', 'Text Field'],
      )}{' '}
      text
    </>,
    'On/off labels, an error’s exclamation mark, today in bold and dots for text highlights, underlined links.',
  ],
  [
    'textSize',
    <>
      {components(
        ['typography', 'Typography'],
        ['list', 'List'],
        ['menu', 'Menu'],
        ['alert', 'Alert'],
        ['action-sheet', 'Action Sheet'],
        ['text-field', 'Text Field'],
        ['button', 'Button'],
        ['activity-view', 'Activity View'],
        ['header', 'Header'],
        ['slider', 'Slider'],
        ['progress', 'Progress'],
        ['tooltip', 'Tooltip'],
        ['checkbox', 'Checkbox'],
        ['color-picker', 'Color Picker'],
      )}
      ;{' '}
      <PartLink
        component="toolbar"
        part="Toolbar.Title"
      />{' '}
      up to xxLarge
    </>,
    <>
      Text grows with it, and rows with their text. Kept at their size, as their
      text sits in a fixed shape:{' '}
      {components(
        ['tab-bar', 'Tab Bar'],
        ['toolbar', 'Toolbar'],
        ['segmented', 'Segmented'],
        ['switch', 'Switch'],
        ['stepper', 'Stepper'],
        ['roll', 'Roll'],
        ['card', 'Card'],
        ['badge', 'Badge'],
        ['edit-menu', 'Edit Menu'],
      )}
      , a calendar’s days, a sidebar’s toolbar and an activity indicator.
    </>,
  ],
  [
    'boldText',
    'Every component',
    'Every weight is one step heavier (--uikit-font-weight-boost).',
  ],
  [
    'locale and region',
    components(
      ['date-picker', 'Date Picker'],
      ['slider', 'Slider'],
      ['stepper', 'Stepper'],
      ['progress', 'Progress'],
      ['card', 'Card'],
      ['control-cards', 'Control Cards'],
    ),
    'Dates, times, numbers, the first day of the week and the hour cycle, unless a component is given a locale of its own.',
  ],
  [
    'languages',
    'None in the library: its words are yours to translate',
    <>
      Choose your translation with{' '}
      <PartLink
        component="settings"
        part="useLanguage"
      />
      ; a provider that sets them sets <code>lang</code>.
    </>,
  ],
];

/** Which components follow which setting, and how. */
export const SettingsHonoringTable: FunctionComponent = () => (
  <div className="demo-table">
    <table className="settings-honoring-table">
      <thead>
        <tr>
          <th>Setting</th>
          <th>Followed by</th>
          <th>How</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([setting, followedBy, how]) => (
          <tr key={setting}>
            <td>
              <code>{setting}</code>
            </td>
            <td>{followedBy}</td>
            <td>{how}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
