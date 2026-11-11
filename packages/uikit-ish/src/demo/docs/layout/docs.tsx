import { code, elementRows, PropRow } from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// Every part's props, for the parts page (all) and the overview (its key
// ones).

export const layoutRootRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its columns (
      <PartLink
        component="layout"
        part="Layout.Column"
      />
      ), leading to trailing; what’s behind it (e.g. a{' '}
      <PartLink
        component="viewport"
        part="Viewport.Background"
      />
      ) shows where they have no background.
    </>,
  ],
  [
    'hideSeparators',
    'boolean',
    code('false'),
    'Its columns without the hairline between them (e.g. on a picture behind them, where a line would look out of place).',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const layoutColumnRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its content, filling it: e.g. a <a href={publicUrl('page')}>Page</a> (its
      own scroll container), a <a href={publicUrl('navigation')}>Navigation</a>,
      a <a href={publicUrl('sidebar')}>Sidebar</a>. Its fixed layers (e.g. a
      header’s bar) span it, not the screen.
    </>,
  ],
  [
    'defaultSize',
    'number',
    undefined,
    'Its initial size (px, uncontrolled); without a size, it’s flexible (sharing the free space with the other flexible columns).',
  ],
  ['size', 'number', undefined, 'Its size (px, controlled).'],
  ['minSize', 'number', code('240'), 'Its smallest size (px; a list’s).'],
  ['maxSize', 'number', 'none', 'Its largest size (px) when resized.'],
  [
    'resizable',
    'boolean',
    code('false'),
    'Resized by dragging its divider (at its end), or by the arrow keys on it (Shift: further; Home and End: its smallest and largest).',
  ],
  [
    'onSizeChange',
    '(size: number) => void',
    undefined,
    'Called while it’s resized (by its divider).',
  ],
  [
    'floating',
    'boolean',
    code('false'),
    <>
      Floating over the others at the layout’s start (e.g. a{' '}
      <a href={publicUrl('sidebar')}>Sidebar</a>), which span the layout
      underneath it.
    </>,
  ],
  [
    'clearFloating',
    'boolean',
    code('false'),
    'Next to a floating column: its pages’ content (and a Viewport.Content’s) inset by the floating column’s size, their backgrounds (and bars’ edges) running underneath it.',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];
