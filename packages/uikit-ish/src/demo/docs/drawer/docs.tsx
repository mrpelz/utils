import {
  baseUiRows,
  code,
  nativeButtonRow,
  PropRow,
  union,
} from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// Every part's props, for the parts page (all) and the overview (its key
// ones).

export const drawerRootRows: readonly PropRow[] = [
  [
    'side',
    union('inline-start', 'inline-end'),
    code(union('inline-start')),
    'The side its popup slides in from, above the content. It hides towards that side, and is swiped back towards it to close.',
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
      Called when the drawer opens or closes, with Base UI’s event details.
      Their <code>reason</code> tells what did it: a swipe, an outside press, or
      a press on a trigger or a close button.
    </>,
  ],
  [
    'onOpenChangeComplete',
    '(open: boolean) => void',
    undefined,
    'Called when the drawer has finished opening or closing, after any animations.',
  ],
  [
    'modal',
    ['boolean', union('trap-focus')].join(' | '),
    code('true'),
    <>
      Whether the drawer is modal while open. With <code>true</code>, focus is
      trapped, the page doesn’t scroll, and the rest of the page can’t be
      pressed. With <code>false</code>, the rest of the page stays usable. With{' '}
      <code>trap-focus</code>, focus is trapped, but the page still scrolls and
      can be pressed.
    </>,
  ],
  [
    'disablePointerDismissal',
    'boolean',
    code('false'),
    'Whether a press outside it (on the dimmed content) is ignored. Swiping it back still closes it.',
  ],
  [
    'actionsRef',
    'RefObject<{ unmount: () => void; close: () => void } | null>',
    undefined,
    <>
      A ref to actions you can call from code. <code>close</code> closes the
      drawer. <code>unmount</code> ends its closing phase, after a closing
      animation you control yourself.
    </>,
  ],
  [
    'handle',
    'DrawerHandle<Payload>',
    undefined,
    <>
      A handle that links the drawer to a trigger outside it (for example in the
      content’s bar), made by{' '}
      <PartLink
        component="drawer"
        part="Drawer.createHandle"
      >
        Drawer.createHandle()
      </PartLink>{' '}
      (inside a component,{' '}
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
      The ID of the trigger the drawer belongs to, for a controlled drawer (with{' '}
      <code>open</code>).
    </>,
  ],
  [
    'defaultTriggerId',
    'string | null',
    undefined,
    <>
      The ID of the trigger the drawer belongs to, for a drawer that starts open
      (with <code>defaultOpen</code>).
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
      and triggers. Or a function of the active trigger’s <code>payload</code>{' '}
      that returns them.
    </>,
  ],
];

export const drawerPopupRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its content, which fills it: for example a{' '}
      <a href={publicUrl('page')}>Page</a> (its own scroll container, keeping
      its own safe area insets) or a <a href={publicUrl('sidebar')}>Sidebar</a>.
    </>,
  ],
  [
    'size',
    'number',
    code('320'),
    'Its size (px), at most its container’s width minus 44px.',
  ],
  [
    'floating',
    'boolean',
    code('false'),
    <>
      Drops its own background and shadow, for content that floats by itself
      (for example a floating <a href={publicUrl('sidebar')}>Sidebar</a>).
    </>,
  ],
  [
    'container',
    'HTMLElement | ShadowRoot | RefObject | null',
    undefined,
    <>
      The element to render the portal into. Without one, it’s the provided one
      (<code>PortalContainerContext</code>), or the body.
    </>,
  ],
  [
    'finalFocus',
    'boolean | RefObject<HTMLElement | null> | (closeType) => …',
    undefined,
    'The element to focus when the drawer closes. By default, its trigger.',
  ],
  [
    'initialFocus',
    'boolean | RefObject<HTMLElement | null> | (openType) => …',
    undefined,
    'The element to focus when the drawer opens. By default, its first focusable element.',
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const drawerSwipeAreaRows: readonly PropRow[] = [
  [
    'width',
    'number',
    code('20'),
    'Its width (px): how far from the drawer’s edge a swipe can start.',
  ],
  [
    'disabled',
    'boolean',
    code('false'),
    'Whether the swipe area is disabled, so the drawer can’t be swiped in.',
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const drawerTriggerRows: readonly PropRow[] = [
  [
    'handle',
    'DrawerHandle<Payload>',
    undefined,
    <>
      A handle that links the trigger to a drawer it’s outside of, made by{' '}
      <PartLink
        component="drawer"
        part="Drawer.createHandle"
      >
        Drawer.createHandle()
      </PartLink>{' '}
      (inside a component,{' '}
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
    'A value passed to the drawer when this trigger opens it.',
  ],
  [
    'id',
    'string',
    undefined,
    <>
      The trigger’s ID. A controlled drawer uses it to name its active trigger
      (the drawer’s <code>triggerId</code>).
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
            {row[3]} For example a{' '}
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
            {row[3]} For example a{' '}
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
      The type of what its triggers pass the drawer as they open it (their{' '}
      <code>payload</code>). The drawer’s children can be a function of it.
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
      A handle (Base UI’s <code>Drawer.Handle</code>). Pass it to a{' '}
      <PartLink
        component="drawer"
        part="Drawer.Root"
      />{' '}
      and its{' '}
      <PartLink
        component="drawer"
        part="Drawer.Trigger"
      />
      s (their <code>handle</code>). From the hook, it’s the same handle for the
      component’s lifetime.
    </>,
  ],
  [
    '.isOpen',
    'boolean',
    undefined,
    'Whether the drawer is open. False while no drawer is attached to the handle.',
  ],
  [
    '.open(triggerId)',
    '(triggerId: string | null) => void',
    undefined,
    'Opens the drawer, optionally as if by a given trigger. Call it in an event handler or an effect.',
  ],
  [
    '.openWithPayload(payload)',
    '(payload: Payload) => void',
    undefined,
    'Opens the drawer with the given payload, without any trigger.',
  ],
  ['.close()', '() => void', undefined, 'Closes the drawer.'],
];
