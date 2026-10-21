import {
  elementRows,
  PropRow,
  renderRows,
  union,
} from '../guide/props-table.js';
import { PartLink } from '../guide/sections.js';

// Every part's props, for the parts page (all) and the overview (its key
// ones).

export const navigationRootRows: readonly PropRow[] = [
  [
    'children',
    'ReactElement[]',
    undefined,
    <>
      The stack’s pages, bottom to top, each with a <code>key</code> (e.g. a{' '}
      <a href="page">Page</a>): keys extended, the new top page is pushed; cut
      back (by one or more), the top page is popped; otherwise, the new top page
      is shown at once.
    </>,
  ],
  [
    'onBack',
    [
      '(eventDetails: { event: Event; reason: ',
      union('back-press', 'swipe'),
      ' }) => void',
    ].join(''),
    undefined,
    <>
      Called when the top page goes back: swiped back from its leading edge
      (released past half its width, or flung; <code>swipe</code>), or a{' '}
      <PartLink
        component="navigation"
        part="Navigation.Back"
      />{' '}
      pressed (<code>back-press</code>): the app pops its stack. Without it,
      pages can’t be swiped back.
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const navigationBackRows: readonly PropRow[] = [
  [
    'disabled',
    'boolean',
    'on the root page',
    <>
      Disabled: not going back. By default, while there’s nothing to go back to
      (one page, or no <code>onBack</code>).
    </>,
  ],
  [
    'onClick',
    '(event: MouseEvent) => void',
    undefined,
    <>
      Called as it’s pressed, before it goes back (
      <code>event.preventDefault()</code>: it doesn’t).
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'Its content: e.g. a back chevron (Button.Icon), labelled by its aria-label (the page below’s title).',
  ],
  ...renderRows('button', 'HTMLButtonElement').map((row): PropRow =>
    row[0] === 'render'
      ? [
          row[0],
          row[1],
          row[2],
          <>
            {row[3]} E.g. a <code>{'<Toolbar.Button shape="circle" />'}</code>{' '}
            in its page’s bar.
          </>,
        ]
      : row,
  ),
];
