import {
  baseUiRows,
  code,
  elementRows,
  nativeButtonRow,
  PropRow,
  union,
} from '../guide/props-table.js';
import { PartLink } from '../guide/sections.js';

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
      event details, e.g. the <code>reason</code>: <code>swipe</code> when
      swiped down; <code>eventDetails.cancel()</code> keeps it open).
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
    union('down', 'up', 'left', 'right'),
    code(union('down')),
    'The swipe direction used to dismiss the drawer (a sheet’s: down).',
  ],
  [
    'snapPoints',
    '(number | string)[]',
    undefined,
    <>
      Snap points used to position the drawer: fractions of the viewport’s
      height (0–1), pixels (above 1), or <code>px</code>/<code>rem</code>{' '}
      strings. (A sheet’s heights are its <code>detent</code>s.)
    </>,
  ],
  [
    'defaultSnapPoint',
    'number | string | null',
    undefined,
    'The initial snap point value when uncontrolled.',
  ],
  [
    'snapPoint',
    'number | string | null',
    undefined,
    <>
      The currently active snap point. Use with <code>onSnapPointChange</code>{' '}
      to control the snap point.
    </>,
  ],
  [
    'onSnapPointChange',
    '(snapPoint: number | string | null, eventDetails) => void',
    undefined,
    'Callback fired when the snap point changes.',
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
      Whether to prevent the drawer from closing on outside presses (e.g. while
      edited, iOS’s <code>isModalInPresentation</code>; swiping it down still
      closes it, unless its <code>onOpenChange</code> cancels).
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
      <code>Sheet.createHandle()</code> (in a component:{' '}
      <code>useCreateSheetHandle()</code>).
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
      Its trigger and its popup; or a function of the active trigger’s{' '}
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
      made by <code>Sheet.createHandle()</code> (in a component:{' '}
      <code>useCreateSheetHandle()</code>).
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
      ID of the trigger: also the active trigger in controlled mode (the root’s{' '}
      <code>triggerId</code>).
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
            {row[3]} E.g. a <a href="button">Button</a>’s{' '}
            <code>{'<Button.Root />'}</code>.
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
    'Compact: the whole screen but 10px at the top, opaque; or its content’s height, a floating glass panel.',
  ],
  [
    'compact',
    'boolean',
    'by the window’s width (compact below 768px)',
    'A sheet from the bottom (its detent), or not compact, a form sheet, centered (up to 936px by 852px).',
  ],
  [
    'container',
    'HTMLElement | ShadowRoot | RefObject<…> | null',
    <>
      <code>document.body</code>
    </>,
    'Where its portal renders it (Base UI’s Drawer.Portal); fixed to it if it’s a containing block (e.g. transformed), as the views here. Clip it with overflow: clip, not hidden: focus moving into the sheet, still below it, would scroll it.',
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
      Below its grabber: e.g. a <a href="toolbar">Toolbar</a> (its{' '}
      <code>placement=&quot;block-start&quot;</code>), with its title and
      buttons. Without: only the grabber, over the content (its own bars, e.g. a
      navigation’s, below it, as the content’s top safe area inset).
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const sheetContentRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      What scrolls: e.g. a <a href="list">List</a>, a form, a{' '}
      <a href="navigation">Navigation</a>.
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const sheetTitleRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'The sheet’s title: its accessible name.',
  ],
  ...baseUiRows('h2', 'HTMLHeadingElement'),
];

export const sheetDescriptionRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'What the sheet is for: its accessible description.',
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
            {row[3]} E.g. a <code>{'<Toolbar.Button />'}</code> (Cancel, Done,
            its close symbol).
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
      What its triggers pass the sheet as they open it (their{' '}
      <code>payload</code>; the root’s children as a function of it).
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
      A handle (Base UI’s <code>Drawer.Handle</code>): passed to a{' '}
      <PartLink
        component="sheet"
        part="Sheet.Root"
      />{' '}
      and its{' '}
      <PartLink
        component="sheet"
        part="Sheet.Trigger"
      />
      s (their <code>handle</code>); from the hook, the same for the component’s
      lifetime.
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
