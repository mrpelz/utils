import {
  baseUiRows,
  code,
  elementRows,
  nativeButtonRow,
  PropRow,
  union,
} from '../guide/props-table.js';
import { PartLink } from '../guide/sections.js';

// Every part's props, for the parts page (all) and the overview (its key
// ones).

export const layoutRootRows: readonly PropRow[] = [
  [
    'compact',
    'boolean',
    code('false'),
    <>
      Compact (e.g. on a phone, by its width; the app’s choice): its{' '}
      <PartLink
        component="layout"
        part="Layout.Drawer"
      />
      s’ columns float over the others, hidden until opened.
    </>,
  ],
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
      , a drawer’s in its{' '}
      <PartLink
        component="layout"
        part="Layout.Drawer"
      />
      ), leading to trailing, and optionally a{' '}
      <PartLink
        component="layout"
        part="Layout.Background"
      />
      .
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
      <a href="sidebar">Sidebar</a>. In a{' '}
      <PartLink
        component="layout"
        part="Layout.Drawer"
      />
      , compact: the drawer’s (Base UI’s <code>Drawer.Popup</code>), its size
      its width (or 320px).
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
      compact, in a{' '}
      <PartLink
        component="layout"
        part="Layout.Drawer"
      />
      , without a background or shadow of its own.
    </>,
  ],
  [
    'clearFloating',
    'boolean',
    code('false'),
    'Next to a floating column: its pages’ content inset by the floating column’s size, their backgrounds (and bars’ edges) running underneath it.',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const layoutDrawerRows: readonly PropRow[] = [
  [
    'side',
    union('inline-start', 'inline-end'),
    code(union('inline-start')),
    'Compact: the side its column floats over the others from (hidden towards it, swiped back towards it to close).',
  ],
  ['open', 'boolean', undefined, 'Whether the drawer is currently open.'],
  [
    'defaultOpen',
    'boolean',
    code('false'),
    <>
      Whether the drawer is initially open. To render a controlled drawer, use
      the <code>open</code> prop instead.
    </>,
  ],
  [
    'onOpenChange',
    '(open: boolean, eventDetails) => void',
    undefined,
    <>
      Event handler called when the drawer is opened or closed (with Base UI’s
      event details, e.g. the <code>reason</code>: a swipe, an outside press, a
      trigger’s or a close’s press).
    </>,
  ],
  [
    'onOpenChangeComplete',
    '(open: boolean) => void',
    undefined,
    'Event handler called after any animations complete when the drawer is opened or closed.',
  ],
  [
    'modal',
    ['boolean', union('trap-focus')].join(' | '),
    code('true'),
    <>
      Determines if the drawer enters a modal state when open: <code>true</code>
      , focus is trapped, document page scroll is locked, and pointer
      interactions on outside elements are disabled; <code>false</code>, user
      interaction with the rest of the document is allowed;{' '}
      <code>trap-focus</code>, focus is trapped, but scroll and outside pointer
      interactions remain enabled.
    </>,
  ],
  [
    'disablePointerDismissal',
    'boolean',
    code('false'),
    'Whether to prevent the drawer from closing on outside presses (the dimmed content pressed); swiping it back still closes it.',
  ],
  [
    'actionsRef',
    'RefObject<{ unmount: () => void; close: () => void } | null>',
    undefined,
    <>
      A ref to imperative actions: <code>close</code> closes the drawer;{' '}
      <code>unmount</code> ends its closing phase after an externally controlled
      closing animation.
    </>,
  ],
  [
    'handle',
    'DrawerHandle<Payload>',
    undefined,
    <>
      A handle to associate the drawer with a trigger (outside it, e.g. in
      another column’s bar), made by <code>Layout.createDrawerHandle()</code>{' '}
      (in a component: <code>useCreateDrawerHandle()</code>).
    </>,
  ],
  [
    'triggerId',
    'string | null',
    undefined,
    <>
      ID of the trigger that the drawer is associated with (with{' '}
      <code>open</code>, for a controlled drawer).
    </>,
  ],
  [
    'defaultTriggerId',
    'string | null',
    undefined,
    <>
      ID of the trigger that the drawer is associated with (with{' '}
      <code>defaultOpen</code>, for an initially open drawer).
    </>,
  ],
  [
    'children',
    'ReactNode | ((props: { payload }) => ReactNode)',
    undefined,
    <>
      Its column (a{' '}
      <PartLink
        component="layout"
        part="Layout.Column"
      />
      ), its{' '}
      <PartLink
        component="layout"
        part="Layout.DrawerSwipeArea"
      />
      , triggers; or a function of the active trigger’s <code>payload</code>.
    </>,
  ],
];

export const layoutDrawerSwipeAreaRows: readonly PropRow[] = [
  [
    'width',
    'number',
    code('20'),
    'Its width (px): how far from the drawer’s edge a swipe starts.',
  ],
  [
    'disabled',
    'boolean',
    code('false'),
    'Whether the swipe area is disabled (the drawer isn’t swiped in).',
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const layoutDrawerTriggerRows: readonly PropRow[] = [
  [
    'handle',
    'DrawerHandle<Payload>',
    undefined,
    <>
      A handle to associate the trigger with a drawer (the trigger outside it),
      made by <code>Layout.createDrawerHandle()</code> (in a component:{' '}
      <code>useCreateDrawerHandle()</code>).
    </>,
  ],
  [
    'payload',
    'Payload',
    undefined,
    'A payload to pass to the drawer when it is opened.',
  ],
  [
    'id',
    'string',
    undefined,
    <>
      ID of the trigger: also the active trigger in controlled mode (the
      drawer’s <code>triggerId</code>).
    </>,
  ],
  nativeButtonRow(true),
  ...baseUiRows('button', 'HTMLButtonElement').map((row): PropRow =>
    row[0] === 'render'
      ? [
          row[0],
          row[1],
          row[2],
          <>
            {row[3]} E.g. a <code>{'<Toolbar.Button />'}</code> in the content’s
            bar.
          </>,
        ]
      : row,
  ),
];

export const layoutDrawerCloseRows: readonly PropRow[] = [
  nativeButtonRow(true),
  ...baseUiRows('button', 'HTMLButtonElement').map((row): PropRow =>
    row[0] === 'render'
      ? [
          row[0],
          row[1],
          row[2],
          <>
            {row[3]} E.g. a <code>{'<Toolbar.Button />'}</code> in the drawer’s
            bar (Done).
          </>,
        ]
      : row,
  ),
];

/**
 * `Layout.createDrawerHandle<Payload>()`, `useCreateDrawerHandle<Payload>()`:
 * their type parameter (no arguments).
 */
export const layoutDrawerHandleTypeRows: readonly PropRow[] = [
  [
    'Payload',
    'type parameter',
    code('unknown'),
    <>
      What its triggers pass the drawer as they open it (their{' '}
      <code>payload</code>; the drawer’s children as a function of it).
    </>,
  ],
];

/** `Layout.createDrawerHandle()`, `useCreateDrawerHandle()`: what they return. */
export const layoutDrawerHandleRows: readonly PropRow[] = [
  [
    '(return)',
    'LayoutDrawerHandle<Payload>',
    undefined,
    <>
      A handle (Base UI’s <code>Drawer.Handle</code>): passed to a{' '}
      <PartLink
        component="layout"
        part="Layout.Drawer"
      />{' '}
      and its{' '}
      <PartLink
        component="layout"
        part="Layout.DrawerTrigger"
      />
      s (their <code>handle</code>); from the hook, the same for the component’s
      lifetime.
    </>,
  ],
  [
    '.isOpen',
    'boolean',
    undefined,
    'Whether the drawer is currently open (false while no drawer is attached to the handle).',
  ],
  [
    '.open(triggerId)',
    '(triggerId: string | null) => void',
    undefined,
    'Opens the drawer, optionally associating it with a trigger (in an event handler or an effect).',
  ],
  [
    '.openWithPayload(payload)',
    '(payload: Payload) => void',
    undefined,
    'Opens the drawer with the given payload, without associating it with any trigger.',
  ],
  ['.close()', '() => void', undefined, 'Closes the drawer.'],
];
