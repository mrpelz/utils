import { code, PropRow, renderRows } from '../guide/props-table.js';
import { PartLink } from '../guide/sections.js';
import { toolbarRootRows } from '../toolbar/docs.js';

// Every part's props, for the parts page (all) and the overview (its key
// ones).

export const headerRootRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its{' '}
      <PartLink
        component="header"
        part="Header.Bar"
      />{' '}
      and, optionally, its{' '}
      <PartLink
        component="header"
        part="Header.LargeTitle"
      />{' '}
      and{' '}
      <PartLink
        component="header"
        part="Header.Accessory"
      />
      . It renders no box of its own (<code>display: contents</code>
      ), so the bar sticks to the top of the whole scroll container.
    </>,
  ],
];

/** A top `Toolbar.Root` (its placement fixed). */
export const headerBarRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      A toolbar’s content:{' '}
      <PartLink
        component="toolbar"
        part="Toolbar.Leading"
      />{' '}
      (e.g. back),{' '}
      <PartLink
        component="toolbar"
        part="Toolbar.Title"
      />{' '}
      (fading in as a large title scrolls away),{' '}
      <PartLink
        component="toolbar"
        part="Toolbar.Trailing"
      />
      .
    </>,
  ],
  ...toolbarRootRows.filter(([name]) => name !== 'placement'),
];

export const headerLargeTitleRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      The title (e.g. a <code>{'<span>'}</code>), and an optional{' '}
      <PartLink
        component="toolbar"
        part="Toolbar.Subtitle"
      />{' '}
      below it.
    </>,
  ],
  [
    'aria-level',
    'number',
    code('1'),
    <>
      Its heading level (it’s a <code>heading</code>): the page’s.
    </>,
  ],
  ...renderRows('div', 'HTMLElement'),
];

export const headerAccessoryRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      What stays with the bar: a <a href="text-field">Text field</a>’s search
      field, a <a href="segmented">Segmented</a> control (16px from the sides,
      8px above the content).
    </>,
  ],
  ...renderRows('div', 'HTMLElement'),
];
