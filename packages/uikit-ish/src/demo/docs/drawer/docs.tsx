import {
  baseUiRows,
  code,
  nativeButtonRow,
  PropRow,
  union,
} from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';

// Every part's props, for the parts page (all) and the overview (its key
// ones).

export const drawerRootRows: readonly PropRow[] = [
  [
    'side',
    union('inline-start', 'inline-end'),
    code(union('inline-start')),
    'The side its popup floats over the content from (hidden towards it, swiped back towards it to close).',
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
      A handle to associate the drawer with a trigger (outside it, e.g. in the
      content’s bar), made by{' '}
      <PartLink
        component="drawer"
        part="Drawer.createHandle"
      >
        Drawer.createHandle()
      </PartLink>{' '}
      (in a component:{' '}
      <PartLink
        component="drawer"
        part="useCreateDrawerHandle"
      >
        useCreateDrawerHandle()
      </PartLink>
      ).
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
      Its{' '}
      <PartLink
        component="drawer"
        part="Drawer.SwipeArea"
      />
      ,{' '}
      <PartLink
        component="drawer"
        part="Drawer.Popup"
      />
      , triggers; or a function of the active trigger’s <code>payload</code>.
    </>,
  ],
];

export const drawerPopupRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its content, filling it: e.g. a <a href="page">Page</a> (its own scroll
      container, its safe areas its own), a <a href="sidebar">Sidebar</a>.
    </>,
  ],
  [
    'size',
    'number',
    code('320'),
    'Its size (px), at most its container’s less 44px.',
  ],
  [
    'floating',
    'boolean',
    code('false'),
    <>
      Without a background or shadow of its own: its content floats itself (e.g.
      a floating <a href="sidebar">Sidebar</a>).
    </>,
  ],
  [
    'container',
    'HTMLElement | ShadowRoot | RefObject | null',
    undefined,
    <>
      A parent element to render the portal element into (else the provided one,{' '}
      <code>PortalContainerContext</code>, or the body).
    </>,
  ],
  [
    'finalFocus',
    'boolean | RefObject<HTMLElement | null> | (closeType) => …',
    undefined,
    'Determines the element to focus when the drawer is closed (by default, its trigger).',
  ],
  [
    'initialFocus',
    'boolean | RefObject<HTMLElement | null> | (openType) => …',
    undefined,
    'Determines the element to focus when the drawer is opened (by default, its first tabbable element).',
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const drawerSwipeAreaRows: readonly PropRow[] = [
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

export const drawerTriggerRows: readonly PropRow[] = [
  [
    'handle',
    'DrawerHandle<Payload>',
    undefined,
    <>
      A handle to associate the trigger with a drawer (the trigger outside it),
      made by{' '}
      <PartLink
        component="drawer"
        part="Drawer.createHandle"
      >
        Drawer.createHandle()
      </PartLink>{' '}
      (in a component:{' '}
      <PartLink
        component="drawer"
        part="useCreateDrawerHandle"
      >
        useCreateDrawerHandle()
      </PartLink>
      ).
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
            {row[3]} E.g. a{' '}
            <PartLink
              component="toolbar"
              part="Toolbar.Button"
            >
              {'<Toolbar.Button />'}
            </PartLink>{' '}
            in the content’s bar.
          </>,
        ]
      : row,
  ),
];

export const drawerCloseRows: readonly PropRow[] = [
  nativeButtonRow(true),
  ...baseUiRows('button', 'HTMLButtonElement').map((row): PropRow =>
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
              {'<Toolbar.Button />'}
            </PartLink>{' '}
            in the drawer’s bar (Done).
          </>,
        ]
      : row,
  ),
];

/**
 * `Drawer.createHandle<Payload>()`, `useCreateDrawerHandle<Payload>()`:
 * their type parameter (no arguments).
 */
export const drawerHandleTypeRows: readonly PropRow[] = [
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

/** `Drawer.createHandle()`, `useCreateDrawerHandle()`: what they return. */
export const drawerHandleRows: readonly PropRow[] = [
  [
    '(return)',
    'DrawerHandle<Payload>',
    undefined,
    <>
      A handle (Base UI’s <code>Drawer.Handle</code>): passed to a{' '}
      <PartLink
        component="drawer"
        part="Drawer.Root"
      />{' '}
      and its{' '}
      <PartLink
        component="drawer"
        part="Drawer.Trigger"
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
