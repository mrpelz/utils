import { code, elementRows, PropRow, union } from '../guide/props-table.js';

// Every part's props, for the parts page (all) and the overview (its key
// ones).

export const layoutRootRows: readonly PropRow[] = [
  [
    'compact',
    'boolean',
    code('false'),
    <>
      Compact (e.g. on a phone, by its width; the app’s choice):{' '}
      <code>drawer</code> columns float over the others, hidden until opened.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its columns (<code>Layout.Column</code>), leading to trailing, and
      optionally a <code>Layout.Background</code>.
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const layoutBackgroundRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'Behind the columns, filling the layout: its children layered, each filling it (images and videos covering it).',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const layoutColumnRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its content, filling it: e.g. a <a href="page">Page</a> (its own scroll
      container), a <a href="navigation">Navigation</a>, a{' '}
      <a href="sidebar">Sidebar</a>.
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
      <a href="sidebar">Sidebar</a>), which span the layout underneath it;
      compact, as a drawer without a background or shadow of its own.
    </>,
  ],
  [
    'clearFloating',
    'boolean',
    code('false'),
    'Next to a floating column: its pages’ content inset by the floating column’s size, their backgrounds (and bars’ edges) running underneath it.',
  ],
  [
    'drawer',
    union('inline-start', 'inline-end'),
    undefined,
    'In a compact layout: floating over the others from this side, hidden until opened (swiped in from that edge, or opened by its open prop).',
  ],
  [
    'defaultOpen',
    'boolean',
    code('false'),
    'As a drawer: initially open (uncontrolled).',
  ],
  ['open', 'boolean', undefined, 'As a drawer: open (controlled).'],
  [
    'onOpenChange',
    '(open: boolean) => void',
    undefined,
    'As a drawer: called as it opens or closes (swiped, or the dimmed content pressed).',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];
