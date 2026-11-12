import { code, PropRow, renderRows } from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// Every part's props, for the parts page (all) and the overview (its key
// ones).

export const headerRootRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its bar (a{' '}
      <PartLink
        component="toolbar"
        part="Toolbar.Root"
      />{' '}
      at the top, in a{' '}
      <PartLink
        component="viewport"
        part="Viewport.BlockStart"
      />
      , its child) and its page (a{' '}
      <PartLink
        component="page"
        part="Page.Root"
      />
      : its{' '}
      <PartLink
        component="header"
        part="Header.LargeTitle"
      />{' '}
      and{' '}
      <PartLink
        component="header"
        part="Header.Accessory"
      />
      ). Or, inside a page, its bar and those two. It renders no box of its own
      (<code>display: contents</code>).
    </>,
  ],
];

export const headerLargeTitleRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      The title (for example a <code>{'<span>'}</code>), and an optional{' '}
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
      Its heading level (it’s a <code>heading</code>), the page’s top level by
      default.
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
      What stays with the bar, such as a{' '}
      <a href={publicUrl('text-field')}>Text Field</a>’s search field or a{' '}
      <a href={publicUrl('segmented')}>Segmented</a> control. It sits 16px from
      the sides and 8px above the content.
    </>,
  ],
  ...renderRows('div', 'HTMLElement'),
];
