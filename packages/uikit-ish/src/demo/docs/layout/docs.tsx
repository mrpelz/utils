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
      ), from leading to trailing. Where they have no background, what’s behind
      the layout shows (for example a{' '}
      <PartLink
        component="viewport"
        part="Viewport.Background"
      />
      ).
    </>,
  ],
  [
    'hideSeparators',
    'boolean',
    code('false'),
    'Removes the hairline between its columns, for example over a picture behind them, where a line would look out of place.',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const layoutColumnRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its content, which fills it: for example a{' '}
      <a href={publicUrl('page')}>Page</a> (its own scroll container), a{' '}
      <a href={publicUrl('navigation')}>Navigation</a> or a{' '}
      <a href={publicUrl('sidebar')}>Sidebar</a>. Fixed layers inside it, such
      as a header’s bar, span the column, not the screen.
    </>,
  ],
  [
    'defaultSize',
    'number',
    undefined,
    'Its initial size (px, uncontrolled). Without a size, it’s flexible and shares the free space with the other flexible columns.',
  ],
  ['size', 'number', undefined, 'Its size (px, controlled).'],
  [
    'defaultOpen',
    'boolean',
    code('true'),
    'Whether it’s open at first (uncontrolled).',
  ],
  [
    'open',
    'boolean',
    code('true'),
    <>
      Whether it’s open (controlled). Closed, it slides out of the layout: a
      floating column off its edge, others at their size, the columns beside
      them taking their place, so its content is never squeezed. It keeps its
      size for when it opens again, and it’s inert and hidden once out. The
      columns beside it follow, a <code>clearFloating</code> one’s inset with
      it. It’s the app’s state: the app’s own buttons open and close it.
    </>,
  ],
  [
    'minSize',
    'number',
    code('240'),
    'Its smallest size (px), the width of a list.',
  ],
  ['maxSize', 'number', 'none', 'Its largest size (px) when resized.'],
  [
    'resizable',
    'boolean',
    code('false'),
    'Lets the user resize it by dragging its divider (at its end), or with the arrow keys on it. Shift moves further, Home and End go to its smallest and largest size.',
  ],
  [
    'onSizeChange',
    '(size: number) => void',
    undefined,
    'Called while it’s resized with its divider.',
  ],
  [
    'floating',
    'boolean',
    code('false'),
    <>
      Floats above the others at the layout’s start (for example a{' '}
      <a href={publicUrl('sidebar')}>Sidebar</a>). The others span the layout
      underneath it.
    </>,
  ],
  [
    'clearFloating',
    'boolean',
    code('false'),
    'For the column next to a floating one: its pages’ content (and a Viewport.Content’s) is inset by the floating column’s size, while their backgrounds and bars’ edges run underneath it.',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];
