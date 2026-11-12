import {
  code,
  elementRows,
  PropRow,
  renderRows,
  union,
} from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

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
      , and what should stay still while its pages move: optionally its{' '}
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
      Called when the top page goes back. That’s either a swipe back from the
      leading edge, released past half its width or flung (<code>swipe</code>),
      or a press on a{' '}
      <PartLink
        component="navigation"
        part="Navigation.Back"
      />{' '}
      (<code>back-press</code>). The app then pops its stack. After a swipe,
      it’s called as the swipe is let go, and the pop continues from where the
      swipe left it. If the app doesn’t pop, the page settles back. Without it,
      or without a{' '}
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
      The stack’s pages, from bottom to top, each with a <code>key</code> (for
      example a <a href={publicUrl('page')}>Page</a>, or a{' '}
      <a href={publicUrl('header')}>Header</a> around one; optionally in a{' '}
      <PartLink
        component="navigation"
        part="Navigation.Page"
      />
      , which then gets the key). When the keys are extended, the new top page
      is pushed. When they’re cut back, by one or more, the top page is popped.
      Otherwise, the new top page shows at once.
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const navigationPageRows: readonly PropRow[] = [
  [
    'instant',
    'boolean',
    code('false'),
    <>
      Shows the page at once: it’s pushed and popped without sliding, and can’t
      be swiped back while it’s on top (its{' '}
      <PartLink
        component="navigation"
        part="Navigation.Back"
      />{' '}
      still goes back, at once). For example, for a page whose own scrolling a
      slide would disturb, such as one pulled past its ends (see{' '}
      <PartLink
        component="viewport"
        part="Viewport.Overscroll"
      />
      ).
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      The page (for example a <a href={publicUrl('header')}>Header</a> around a{' '}
      <a href={publicUrl('page')}>Page</a>), rendered as it is, without an
      element of its own.
    </>,
  ],
];

export const navigationSwipeAreaRows: readonly PropRow[] = [
  [
    'width',
    'number',
    code('20'),
    'Its width (px): how far from the leading edge a swipe back can start.',
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
      ). In each page’s bar, it stays put between pages that both have one, and
      slides with a page where only that page has one. <code>false</code> makes
      it always move with its page.
    </>,
  ],
  [
    'disabled',
    'boolean',
    'on the root page',
    <>
      Disables it, so it doesn’t go back. By default, it’s disabled while
      there’s nothing to go back to (one page, or no <code>onBack</code>).
    </>,
  ],
  [
    'onClick',
    '(event: MouseEvent) => void',
    undefined,
    <>
      Called when it’s pressed, before it goes back. Call{' '}
      <code>event.preventDefault()</code> to keep it from going back.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'Its content, for example a back chevron (Button.Icon). Label it with an aria-label: the title of the page below.',
  ],
  ...renderRows('button', 'HTMLButtonElement').map((row): PropRow =>
    row[0] === 'render'
      ? [
          row[0],
          row[1],
          row[2],
          <>
            {row[3]} For example a{' '}
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
      Its id (required). During a transition (a push, a pop, a swipe back),
      while both moving pages have an item with this id, it stays put, showing
      the upper page’s. Otherwise, it moves with its page.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'The item, or its content when render renders the item itself.',
  ],
  ...renderRows('div', 'HTMLDivElement'),
];
