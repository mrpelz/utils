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

// Every part's props (Base UI's with its descriptions), for the parts page
// (all) and the overview (its key ones).

export const actionSheetRootRows: readonly PropRow[] = [
  ['open', 'boolean', undefined, 'Whether the action sheet is currently open.'],
  [
    'defaultOpen',
    'boolean',
    code('false'),
    <>
      Whether the action sheet is initially open. To render a controlled action
      sheet, use the <code>open</code> prop instead.
    </>,
  ],
  [
    'onOpenChange',
    '(open: boolean, eventDetails) => void',
    undefined,
    <>
      Event handler called when the action sheet is opened or closed (with Base
      UI’s event details: the <code>reason</code>, for example{' '}
      <code>trigger-press</code>, <code>close-press</code> (an action),{' '}
      <code>outside-press</code> or <code>escape-key</code>, and the{' '}
      <code>trigger</code> element. <code>eventDetails.cancel()</code> keeps it
      as it is).
    </>,
  ],
  [
    'onOpenChangeComplete',
    '(open: boolean) => void',
    undefined,
    'Event handler called after any animations complete when the action sheet is opened or closed.',
  ],
  [
    'modal',
    ['boolean', union('trap-focus')].join(' | '),
    code('true'),
    <>
      Determines if the action sheet enters a modal state when open:{' '}
      <code>true</code>, user interaction is limited to it (page scroll locked,
      outside pointer interactions disabled, and a press outside closes it);{' '}
      <code>false</code>, user interaction with the rest of the document is
      allowed; <code>trap-focus</code>, focus is trapped, but scroll and outside
      pointer interactions remain enabled.
    </>,
  ],
  [
    'actionsRef',
    'RefObject<{ unmount: () => void; close: () => void } | null>',
    undefined,
    <>
      A ref to imperative actions: <code>close</code> closes the action sheet;{' '}
      <code>unmount</code> ends its closing phase after an externally controlled
      closing animation.
    </>,
  ],
  [
    'handle',
    'ActionSheetHandle<Payload>',
    undefined,
    <>
      A handle to associate the action sheet with a trigger (outside it), made
      by{' '}
      <PartLink
        component="action-sheet"
        part="ActionSheet.createHandle"
      >
        ActionSheet.createHandle()
      </PartLink>{' '}
      (in a component:{' '}
      <PartLink
        component="action-sheet"
        part="useCreateActionSheetHandle"
      >
        useCreateActionSheetHandle()
      </PartLink>
      ).
    </>,
  ],
  [
    'triggerId',
    'string | null',
    undefined,
    <>
      ID of the trigger that the action sheet is associated with (with{' '}
      <code>open</code>, for a controlled action sheet).
    </>,
  ],
  [
    'defaultTriggerId',
    'string | null',
    undefined,
    <>
      ID of the trigger that the action sheet is associated with (with{' '}
      <code>defaultOpen</code>, for an initially open action sheet).
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

export const actionSheetTriggerRows: readonly PropRow[] = [
  [
    'handle',
    'ActionSheetHandle<Payload>',
    undefined,
    <>
      A handle to associate the trigger with an action sheet (the trigger
      outside it), made by{' '}
      <PartLink
        component="action-sheet"
        part="ActionSheet.createHandle"
      >
        ActionSheet.createHandle()
      </PartLink>{' '}
      (in a component:{' '}
      <PartLink
        component="action-sheet"
        part="useCreateActionSheetHandle"
      >
        useCreateActionSheetHandle()
      </PartLink>
      ).
    </>,
  ],
  [
    'payload',
    'Payload',
    undefined,
    'A payload to pass to the action sheet when it is opened.',
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

export const actionSheetPopupRows: readonly PropRow[] = [
  [
    'container',
    'HTMLElement | ShadowRoot | RefObject<…> | null',
    <>
      <code>document.body</code>
    </>,
    'Where its portal renders it (Base UI’s Popover.Portal). If that’s a containing block (for example a transformed element, like the views here), its dimmed backdrop fills it, and without a trigger, the sheet sits at its bottom.',
  ],
  [
    'initialFocus',
    'boolean | RefObject<HTMLElement | null> | ((openType) => …)',
    undefined,
    <>
      Determines the element to focus when the action sheet is opened. By
      default, focus moves to its first action, except when it is opened by
      touch — then the popup itself is focused. <code>false</code>: do not move
      focus.
    </>,
  ],
  [
    'finalFocus',
    'boolean | RefObject<HTMLElement | null> | ((closeType) => …)',
    undefined,
    <>
      Determines the element to focus when the action sheet is closed. By
      default: the trigger (or the previously focused element).{' '}
      <code>false</code>: do not move focus.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its{' '}
      <PartLink
        component="action-sheet"
        part="ActionSheet.Header"
      />{' '}
      (optional) and its{' '}
      <PartLink
        component="action-sheet"
        part="ActionSheet.Actions"
      />
      .
    </>,
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const actionSheetHeaderRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its{' '}
      <PartLink
        component="action-sheet"
        part="ActionSheet.Title"
      />{' '}
      and{' '}
      <PartLink
        component="action-sheet"
        part="ActionSheet.Description"
      />{' '}
      (each optional).
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const actionSheetTitleRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'Its title (Headline), which is the sheet’s accessible name.',
  ],
  ...baseUiRows('h2', 'HTMLHeadingElement'),
];

export const actionSheetDescriptionRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'Its message (Body): what the choice is about. It’s the sheet’s accessible description.',
  ],
  ...baseUiRows('p', 'HTMLParagraphElement'),
];

export const actionSheetActionsRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its actions (
      <PartLink
        component="action-sheet"
        part="ActionSheet.Action"
      />
      ), stacked, with a destructive one first.
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const actionSheetActionRows: readonly PropRow[] = [
  [
    'variant',
    union('secondary', 'destructive'),
    code(union('secondary')),
    'Its kind: secondary (in the label’s color) or destructive (red, for example Delete). There’s no primary, because an action sheet has no preferred action.',
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'Its label: what it does, in title case (Delete Photo).',
  ],
  nativeButtonRow(true),
  ...baseUiRows('button', 'HTMLButtonElement'),
];

/**
 * `ActionSheet.createHandle<Payload>()`,
 * `useCreateActionSheetHandle<Payload>()`: their type parameter (no
 * arguments).
 */
export const actionSheetHandleTypeRows: readonly PropRow[] = [
  [
    'Payload',
    'type parameter',
    code('unknown'),
    <>
      What its triggers pass to the action sheet as they open it (their{' '}
      <code>payload</code>). The root’s children can be a function of it.
    </>,
  ],
];

/**
 * `ActionSheet.createHandle()`, `useCreateActionSheetHandle()`: what they
 * return.
 */
export const actionSheetHandleRows: readonly PropRow[] = [
  [
    '(return)',
    'ActionSheetHandle<Payload>',
    undefined,
    <>
      A handle (Base UI’s <code>Popover.Handle</code>). Pass it to an{' '}
      <PartLink
        component="action-sheet"
        part="ActionSheet.Root"
      />{' '}
      and its{' '}
      <PartLink
        component="action-sheet"
        part="ActionSheet.Trigger"
      />
      s (their <code>handle</code>). The hook returns the same one for the
      component’s lifetime.
    </>,
  ],
  [
    '.isOpen',
    'boolean',
    undefined,
    'Whether the action sheet is currently open (false while no root is attached to the handle).',
  ],
  [
    '.open(triggerId)',
    '(triggerId: string) => void',
    undefined,
    'Opens the action sheet at the trigger with this id, which must use this handle (in an event handler or an effect).',
  ],
  ['.close()', '() => void', undefined, 'Closes the action sheet.'],
];
