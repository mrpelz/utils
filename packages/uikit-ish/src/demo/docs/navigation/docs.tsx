import {
  code,
  elementRows,
  PropRow,
  renderRows,
  union,
} from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';

// Every part's props, for the parts page (all) and the overview (its key
// ones).

export const navigationRootRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its{' '}
      <PartLink
        component="navigation"
        part="Navigation.Stack"
      />
      , and what stays while its pages move: optionally its{' '}
      <PartLink
        component="navigation"
        part="Navigation.SwipeArea"
      />
      , a bar with its{' '}
      <PartLink
        component="navigation"
        part="Navigation.Back"
      />{' '}
      (a{' '}
      <PartLink
        component="toolbar"
        part="Toolbar.Root"
      />{' '}
      in a{' '}
      <PartLink
        component="viewport"
        part="Viewport.BlockStart"
      />
      ).
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
      pressed (<code>back-press</code>): the app pops its stack. Without it (or
      a{' '}
      <PartLink
        component="navigation"
        part="Navigation.SwipeArea"
      />
      ), pages can’t be swiped back.
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const navigationStackRows: readonly PropRow[] = [
  [
    'children',
    'ReactElement[]',
    undefined,
    <>
      The stack’s pages, bottom to top, each with a <code>key</code> (e.g. a{' '}
      <a href="page">Page</a>, or a <a href="header">Header</a> around one):
      keys extended, the new top page is pushed; cut back (by one or more), the
      top page is popped; otherwise, the new top page is shown at once.
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const navigationSwipeAreaRows: readonly PropRow[] = [
  [
    'width',
    'number',
    code('20'),
    'Its width (px): how far from the leading edge a swipe back starts.',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const navigationBackRows: readonly PropRow[] = [
  [
    'persistentId',
    'string | false',
    code(union('back')),
    <>
      Its id as a persistent item (see{' '}
      <PartLink
        component="navigation"
        part="Navigation.Persistent"
      />
      ): in each page’s bar, staying put between pages that both have one,
      sliding with a page where only it has one; <code>false</code>, always
      moving with its page.
    </>,
  ],
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
            {row[3]} E.g. a{' '}
            <PartLink
              component="toolbar"
              part="Toolbar.Button"
            >
              {'<Toolbar.Button shape="circle" />'}
            </PartLink>{' '}
            in each pushed page’s bar.
          </>,
        ]
      : row,
  ),
];

export const navigationPersistentRows: readonly PropRow[] = [
  [
    'persistentId',
    'string',
    undefined,
    <>
      Its id (required): in a transition (pushed, popped, swiped back), while
      both moving pages have an item of this id, it stays put (the upper page’s
      shown); otherwise it moves with its page.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'The item, or its content (rendering the item itself, by its render).',
  ],
  ...renderRows('div', 'HTMLDivElement'),
];
