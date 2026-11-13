import {
  baseUiRows,
  code,
  elementRows,
  nativeButtonRow,
  PropRow,
  union,
} from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { glassModeRow } from '../glass-mode.js';

// Every part's props (Base UI's with its descriptions), for the parts page
// (all) and the overview (its key ones).

export const sheetRootRows: readonly PropRow[] = [
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
      event details, for example the <code>reason</code>: <code>swipe</code>{' '}
      when swiped down; <code>eventDetails.cancel()</code> keeps it open).
    </>,
  ],
  [
    'onOpenChangeComplete',
    '(open: boolean) => void',
    undefined,
    'Event handler called after any animations complete when the drawer is opened or closed.',
  ],
  [
    'swipeDirection',
    union('down', 'up', 'left', 'right', 'none'),
    code(union('down')),
    <>
      The direction it’s swiped away in (Base UI’s directions). Its exit then
      follows the flick out through that edge. <code>none</code> is this
      library’s: it can’t be swiped away at all, and only a press outside it,
      Escape or its close button close it.
    </>,
  ],
  [
    'snapPoints',
    '(number | string)[]',
    undefined,
    <>
      Snap points used to position the drawer: fractions of the viewport’s
      height (0–1), pixels (above 1), or <code>px</code>/<code>rem</code>{' '}
      strings. (A sheet’s heights are its <code>detent</code>s.) Leave it out
      with{' '}
      <PartLink
        component="sheet"
        part="Sheet.SnapGroup"
      />
      s inside (this library’s): their ends are then the snap points, measured
      live and named by their <code>value</code>s here and below.
    </>,
  ],
  [
    'defaultSnapPoint',
    'number | string | null',
    undefined,
    <>
      The initial snap point value when uncontrolled, used again each time it
      opens. With snap groups, it’s a group’s <code>value</code>, the lowest by
      default.
    </>,
  ],
  [
    'snapPoint',
    'number | string | null',
    undefined,
    <>
      The currently active snap point (with snap groups, a group’s{' '}
      <code>value</code>). Use with <code>onSnapPointChange</code> to control
      the snap point.
    </>,
  ],
  [
    'onSnapPointChange',
    '(snapPoint: number | string | null, eventDetails) => void',
    undefined,
    <>
      Callback fired when the snap point changes (with snap groups, called with
      a group’s <code>value</code>).
    </>,
  ],
  [
    'snapToSequentialPoints',
    'boolean',
    code('false'),
    'Disables velocity-based snap skipping so drag distance determines the next snap point.',
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
    <>
      Whether to prevent the drawer from closing on outside presses, for example
      while it’s being edited. Swiping it down still closes it, unless its{' '}
      <code>onOpenChange</code> cancels that.
    </>,
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
    'SheetHandle<Payload>',
    undefined,
    <>
      A handle to associate the drawer with a trigger (outside it), made by{' '}
      <PartLink
        component="sheet"
        part="Sheet.createHandle"
      >
        Sheet.createHandle()
      </PartLink>{' '}
      (in a component:{' '}
      <PartLink
        component="sheet"
        part="useCreateSheetHandle"
      >
        useCreateSheetHandle()
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
      Its trigger and its popup, or a function of the active trigger’s{' '}
      <code>payload</code>.
    </>,
  ],
];

export const sheetTriggerRows: readonly PropRow[] = [
  [
    'handle',
    'SheetHandle<Payload>',
    undefined,
    <>
      A handle to associate the trigger with a drawer (the trigger outside it),
      made by{' '}
      <PartLink
        component="sheet"
        part="Sheet.createHandle"
      >
        Sheet.createHandle()
      </PartLink>{' '}
      (in a component:{' '}
      <PartLink
        component="sheet"
        part="useCreateSheetHandle"
      >
        useCreateSheetHandle()
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
    'snapPoint',
    'string',
    undefined,
    <>
      The stop it opens the sheet at (this library’s), for a deep link: a{' '}
      <PartLink
        component="sheet"
        part="Sheet.SnapGroup"
      />
      ’s <code>value</code>. When controlled, the root’s{' '}
      <code>onSnapPointChange</code> is told. Left out, the root’s{' '}
      <code>defaultSnapPoint</code> applies.
    </>,
  ],
  [
    'id',
    'string',
    undefined,
    <>
      ID of the trigger. It also names the active trigger in controlled mode
      (the root’s <code>triggerId</code>).
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
            {row[3]} For example a <a href={publicUrl('button')}>Button</a>’s{' '}
            <PartLink
              component="button"
              part="Button.Root"
            >
              {'<Button.Root />'}
            </PartLink>
            .
          </>,
        ]
      : row,
  ),
];

export const sheetPopupRows: readonly PropRow[] = [
  [
    'detent',
    union('large', 'medium'),
    code(union('large')),
    'Its height on compact widths. large: the whole screen except 10px at the top, opaque. medium: its content’s height, as a floating glass panel.',
  ],
  [
    'compact',
    'boolean',
    'by the window’s width (compact below 768px)',
    'Makes it a sheet from the bottom, with its detent. When it isn’t compact, regular sets what it is.',
  ],
  [
    'regular',
    union('card', 'form'),
    code(union('form')),
    <>
      What it is on a regular width, such as a tablet’s (when it isn’t compact).{' '}
      <code>form</code>: a form sheet in the center, up to 936px by 852px, for
      example for editing. <code>card</code>: a card from the bottom at the
      leading edge, like a regular{' '}
      <PartLink
        component="island"
        part="Island.Root"
      />{' '}
      (375px wide, 10px in, up to 64px below the top). It keeps its detent,
      swiping and snapping, for example over a map.
    </>,
  ],
  [
    'background',
    union('grouped', 'plain'),
    code(union('plain')),
    <>
      Its background, like a page’s (
      <PartLink
        component="page"
        part="Page.Root"
      />
      ’s). <code>grouped</code> suits grouped lists inside: their own background
      turns transparent, and the sheet’s shows around them. <code>plain</code>{' '}
      suits plain lists and other content. It doesn’t apply to the medium
      detent, which is glass.
    </>,
  ],
  [
    'container',
    'HTMLElement | ShadowRoot | RefObject<…> | null',
    <>
      <code>document.body</code>
    </>,
    'Where its portal renders it (Base UI’s Drawer.Portal). If that’s a containing block (for example a transformed element, like the views here), the sheet is fixed to it. Clip it with overflow: clip, not hidden, because otherwise focus moving into the sheet while it’s still below would scroll it.',
  ],
  [
    'initialFocus',
    'boolean | RefObject<HTMLElement | null> | ((openType) => …)',
    undefined,
    <>
      Determines the element to focus when the drawer is opened. By default,
      focus moves to the first tabbable element inside the popup, except when
      the drawer is opened by touch — then the popup itself is focused to avoid
      opening the virtual keyboard. <code>false</code>: do not move focus.
    </>,
  ],
  [
    'finalFocus',
    'boolean | RefObject<HTMLElement | null> | ((closeType) => …)',
    undefined,
    <>
      Determines the element to focus when the drawer is closed. By default: the
      trigger (or the previously focused element). <code>false</code>: do not
      move focus.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      A{' '}
      <PartLink
        component="sheet"
        part="Sheet.Header"
      />{' '}
      and a{' '}
      <PartLink
        component="sheet"
        part="Sheet.Content"
      />
      .
    </>,
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const sheetHeaderRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its grabber (
      <PartLink
        component="sheet"
        part="Sheet.Grabber"
      />
      , optional), then for example a <a href={publicUrl('toolbar')}>Toolbar</a>{' '}
      (with <code>placement=&quot;block-start&quot;</code>) with its title and
      buttons. It sits above the content, which scrolls under it, and the
      content makes room with a{' '}
      <PartLink
        component="viewport"
        part="Viewport.Padding"
      />
      . With only a grabber, it sits above the content too, without a bar. The
      content’s own bars (for example a navigation’s) go below it, treating it
      as the content’s top safe area inset.
    </>,
  ],
  [
    'edgeEffect',
    union('soft', 'hard', 'none'),
    code(union('soft')),
    <>
      Its scroll edge effect, as the content scrolls under it (like a{' '}
      <PartLink
        component="viewport"
        part="Viewport.Anchor"
      />
      ’s). <code>soft</code>: a blur that fades out away from it.{' '}
      <code>hard</code>: a solid backing with a dividing line. <code>none</code>
      : nothing, which is also what a header with only a grabber gets. Whatever
      the sheet’s background, the content fades out under it. It’s fully hidden
      under a share of the header (<code>--uikit-viewport-edge-veil</code>, 0 to
      1; a sheet’s is <code>0.75</code>, heavier than a page’s; set it on the
      popup or above), and shows past it. On a medium sheet’s glass, there’s no
      blur, only the fade.
    </>,
  ],
  [
    'edgeTint',
    'string',
    undefined,
    <>
      A color for its edge effect, shown at rest too (like a{' '}
      <PartLink
        component="viewport"
        part="Viewport.Anchor"
      />
      ’s).
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const sheetGrabberRows: readonly PropRow[] = [
  [
    'cursor',
    'string (a CSS cursor)',
    <>
      <code>grab</code> (<code>grabbing</code> while swiped)
    </>,
    'The cursor shown while the pointer hovers it.',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const sheetSnapGroupRows: readonly PropRow[] = [
  [
    'value',
    'string',
    undefined,
    <>
      Its snap point’s name (required). The sheet snaps to show everything up to
      the group’s end, its header included. The root’s <code>snapPoint</code>,{' '}
      <code>defaultSnapPoint</code> and <code>onSnapPointChange</code> use this
      name.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'What it reveals: the content after the group before it, up to its own end.',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const sheetContentRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      What scrolls, for example a <a href={publicUrl('list')}>List</a>, a form
      or a <a href={publicUrl('navigation')}>Navigation</a>. Under a header with
      more than a grabber, start with a{' '}
      <PartLink
        component="viewport"
        part="Viewport.Padding"
      />{' '}
      (<code>edge=&quot;block-start&quot;</code>) to make room for it.
    </>,
  ],
  glassModeRow,
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const sheetTitleRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'The sheet’s title, which is its accessible name.',
  ],
  ...baseUiRows('h2', 'HTMLHeadingElement'),
];

export const sheetDescriptionRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'What the sheet is for, which is its accessible description.',
  ],
  ...baseUiRows('p', 'HTMLParagraphElement'),
];

export const sheetCloseRows: readonly PropRow[] = [
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
            (Cancel, Done, or a close symbol).
          </>,
        ]
      : row,
  ),
];

/**
 * `Sheet.createHandle<Payload>()`, `useCreateSheetHandle<Payload>()`: their
 * type parameter (no arguments).
 */
export const sheetHandleTypeRows: readonly PropRow[] = [
  [
    'Payload',
    'type parameter',
    code('unknown'),
    <>
      What its triggers pass to the sheet as they open it (their{' '}
      <code>payload</code>). The root’s children can be a function of it.
    </>,
  ],
];

/** `Sheet.createHandle()`, `useCreateSheetHandle()`: what they return. */
export const sheetHandleRows: readonly PropRow[] = [
  [
    '(return)',
    'SheetHandle<Payload>',
    undefined,
    <>
      A handle (Base UI’s <code>Drawer.Handle</code>). Pass it to a{' '}
      <PartLink
        component="sheet"
        part="Sheet.Root"
      />{' '}
      and its{' '}
      <PartLink
        component="sheet"
        part="Sheet.Trigger"
      />
      s (their <code>handle</code>). The hook returns the same one for the
      component’s lifetime.
    </>,
  ],
  [
    '.isOpen',
    'boolean',
    undefined,
    'Whether the sheet is currently open (false while no root is attached to the handle).',
  ],
  [
    '.open(triggerId)',
    '(triggerId: string | null) => void',
    undefined,
    'Opens the sheet, optionally associating it with a trigger (in an event handler or an effect).',
  ],
  [
    '.openWithPayload(payload)',
    '(payload: Payload) => void',
    undefined,
    'Opens the sheet with the given payload, without associating it with any trigger.',
  ],
  ['.close()', '() => void', undefined, 'Closes the sheet.'],
];
