import {
  baseUiRows,
  code,
  elementRows,
  nativeButtonRow,
  PropRow,
  union,
} from '../guide/props-table.js';

// Every part's props (Base UI's with its descriptions), for the parts page
// (all) and the overview (its key ones).

export const sheetRootRows: readonly PropRow[] = [
  ['open', 'boolean', undefined, 'Whether the dialog is currently open.'],
  [
    'defaultOpen',
    'boolean',
    code('false'),
    <>
      Whether the dialog is initially open. To render a controlled dialog, use
      the <code>open</code> prop instead.
    </>,
  ],
  [
    'onOpenChange',
    '(open: boolean, eventDetails) => void',
    undefined,
    <>
      Event handler called when the dialog is opened or closed (with Base UI’s
      event details, e.g. the <code>reason</code>; dragged down: a{' '}
      <code>Close</code>’s).
    </>,
  ],
  [
    'onOpenChangeComplete',
    '(open: boolean) => void',
    undefined,
    'Event handler called after any animations complete when the dialog is opened or closed.',
  ],
  [
    'modal',
    ['boolean', union('trap-focus')].join(' | '),
    code('true'),
    <>
      Determines if the dialog enters a modal state when open: <code>true</code>
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
      Whether to prevent the dialog from closing on outside presses (e.g. while
      edited, iOS’s <code>isModalInPresentation</code>; dragging its header down
      still closes it).
    </>,
  ],
  [
    'actionsRef',
    'RefObject<{ unmount: () => void; close: () => void } | null>',
    undefined,
    <>
      A ref to imperative actions: <code>close</code> closes the dialog;{' '}
      <code>unmount</code> ends its closing phase after an externally controlled
      closing animation.
    </>,
  ],
  [
    'handle',
    'DialogHandle<Payload>',
    undefined,
    <>
      A handle to associate the dialog with a trigger (outside it). Can be
      created with <code>Sheet.createHandle()</code>.
    </>,
  ],
  [
    'triggerId',
    'string | null',
    undefined,
    <>
      ID of the trigger that the dialog is associated with (with{' '}
      <code>open</code>, for a controlled dialog).
    </>,
  ],
  [
    'defaultTriggerId',
    'string | null',
    undefined,
    <>
      ID of the trigger that the dialog is associated with (with{' '}
      <code>defaultOpen</code>, for an initially open dialog).
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
    'DialogHandle<Payload>',
    undefined,
    <>
      A handle to associate the trigger with a dialog. Can be created with{' '}
      <code>Sheet.createHandle()</code>.
    </>,
  ],
  [
    'payload',
    'Payload',
    undefined,
    'A payload to pass to the dialog when it is opened.',
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
    'Where its portal renders it (Base UI’s Dialog.Portal); fixed to it if it’s a containing block (e.g. transformed), as the views here. Clip it with overflow: clip, not hidden: focus moving into the sheet, still below it, would scroll it.',
  ],
  [
    'initialFocus',
    'boolean | RefObject<HTMLElement | null> | ((openType) => …)',
    undefined,
    <>
      Determines the element to focus when the dialog is opened. By default,
      focus moves to the first tabbable element inside the popup, except when
      the dialog is opened by touch — then the popup itself is focused to avoid
      opening the virtual keyboard. <code>false</code>: do not move focus.
    </>,
  ],
  [
    'finalFocus',
    'boolean | RefObject<HTMLElement | null> | ((closeType) => …)',
    undefined,
    <>
      Determines the element to focus when the dialog is closed. By default: the
      trigger (or the previously focused element). <code>false</code>: do not
      move focus.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      A <code>Sheet.Header</code> and a <code>Sheet.Content</code>.
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
