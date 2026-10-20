import { code, PropRow, renderRows } from '../guide/props-table.js';
import { toolbarRootRows } from '../toolbar/docs.js';

// Every part's props, for the parts page (all) and the overview (its key
// ones).

export const headerRootRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its <code>Header.Bar</code> and, optionally, its{' '}
      <code>Header.LargeTitle</code> (and what scrolls with the title, e.g. a
      search field). It renders no box of its own (
      <code>display: contents</code>
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
      A toolbar’s content: <code>Toolbar.Leading</code> (e.g. back),{' '}
      <code>Toolbar.Title</code> (fading in as a large title scrolls away),{' '}
      <code>Toolbar.Trailing</code>.
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
      <code>Toolbar.Subtitle</code> below it.
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
