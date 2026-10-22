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

export const alertRootRows: readonly PropRow[] = [
  ['open', 'boolean', undefined, 'Whether the alert dialog is currently open.'],
  [
    'defaultOpen',
    'boolean',
    code('false'),
    <>
      Whether the alert dialog is initially open. To render a controlled alert
      dialog, use the <code>open</code> prop instead.
    </>,
  ],
  [
    'onOpenChange',
    '(open: boolean, eventDetails) => void',
    undefined,
    <>
      Event handler called when the alert dialog is opened or closed (with Base
      UI’s event details: the <code>reason</code>, e.g.{' '}
      <code>trigger-press</code>, <code>close-press</code> (an action),{' '}
      <code>escape-key</code>; <code>eventDetails.cancel()</code> keeps it as it
      is).
    </>,
  ],
  [
    'onOpenChangeComplete',
    '(open: boolean) => void',
    undefined,
    'Event handler called after any animations complete when the alert dialog is opened or closed.',
  ],
  [
    'actionsRef',
    'RefObject<{ unmount: () => void; close: () => void } | null>',
    undefined,
    <>
      A ref to imperative actions: <code>close</code> closes the alert dialog;{' '}
      <code>unmount</code> ends its closing phase after an externally controlled
      closing animation.
    </>,
  ],
  [
    'handle',
    'AlertHandle<Payload>',
    undefined,
    <>
      A handle to associate the alert with a trigger (outside it), made by{' '}
      <PartLink
        component="alert"
        part="Alert.createHandle"
      >
        Alert.createHandle()
      </PartLink>{' '}
      (in a component:{' '}
      <PartLink
        component="alert"
        part="useCreateAlertHandle"
      >
        useCreateAlertHandle()
      </PartLink>
      ).
    </>,
  ],
  [
    'triggerId',
    'string | null',
    undefined,
    <>
      ID of the trigger that the alert dialog is associated with (with{' '}
      <code>open</code>, for a controlled alert).
    </>,
  ],
  [
    'defaultTriggerId',
    'string | null',
    undefined,
    <>
      ID of the trigger that the alert dialog is associated with (with{' '}
      <code>defaultOpen</code>, for an initially open alert).
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

export const alertTriggerRows: readonly PropRow[] = [
  [
    'handle',
    'AlertHandle<Payload>',
    undefined,
    <>
      A handle to associate the trigger with an alert (the trigger outside it),
      made by{' '}
      <PartLink
        component="alert"
        part="Alert.createHandle"
      >
        Alert.createHandle()
      </PartLink>{' '}
      (in a component:{' '}
      <PartLink
        component="alert"
        part="useCreateAlertHandle"
      >
        useCreateAlertHandle()
      </PartLink>
      ).
    </>,
  ],
  [
    'payload',
    'Payload',
    undefined,
    'A payload to pass to the alert dialog when it is opened.',
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

export const alertPopupRows: readonly PropRow[] = [
  [
    'container',
    'HTMLElement | ShadowRoot | RefObject<…> | null',
    <>
      <code>document.body</code>
    </>,
    'Where its portal renders it (Base UI’s AlertDialog.Portal); centered in it, and its dimmed backdrop filling it, if it’s a containing block (e.g. transformed), as the views here.',
  ],
  [
    'initialFocus',
    'boolean | RefObject<HTMLElement | null> | ((openType) => …)',
    undefined,
    <>
      Determines the element to focus when the alert dialog is opened. By
      default, focus moves to the first tabbable element inside the popup (its
      first field, or its first action), except when it is opened by touch —
      then the popup itself is focused to avoid opening the virtual keyboard.{' '}
      <code>false</code>: do not move focus.
    </>,
  ],
  [
    'finalFocus',
    'boolean | RefObject<HTMLElement | null> | ((closeType) => …)',
    undefined,
    <>
      Determines the element to focus when the alert dialog is closed. By
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
        component="alert"
        part="Alert.Header"
      />
      , its{' '}
      <PartLink
        component="alert"
        part="Alert.Fields"
      />{' '}
      (optional), its{' '}
      <PartLink
        component="alert"
        part="Alert.Actions"
      />
      .
    </>,
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const alertHeaderRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its{' '}
      <PartLink
        component="alert"
        part="Alert.Title"
      />{' '}
      and{' '}
      <PartLink
        component="alert"
        part="Alert.Description"
      />{' '}
      (optional).
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const alertTitleRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'Its title (Headline): the alert’s accessible name.',
  ],
  ...baseUiRows('h2', 'HTMLHeadingElement'),
];

export const alertDescriptionRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'Its message (Body): the alert’s accessible description.',
  ],
  ...baseUiRows('p', 'HTMLParagraphElement'),
];

export const alertFieldsRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its text fields (
      <PartLink
        component="alert"
        part="Alert.Field"
      />
      ), between separators.
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const alertFieldRows: readonly PropRow[] = [
  [
    'value',
    'string | number | string[]',
    undefined,
    'The value of the input. Use when controlled.',
  ],
  [
    'defaultValue',
    'string | number | string[]',
    undefined,
    'The default value of the input. Use when uncontrolled.',
  ],
  [
    'onValueChange',
    '(value: string, eventDetails) => void',
    undefined,
    'Callback fired when the value changes. Use when controlled.',
  ],
  [
    'placeholder',
    'string',
    undefined,
    <>
      Its placeholder; without a label, name it (<code>aria-label</code>).
    </>,
  ],
  ...baseUiRows('input', 'HTMLInputElement'),
];

export const alertActionsRows: readonly PropRow[] = [
  [
    'stacked',
    'boolean',
    'with more than two actions',
    'Its actions stacked, full width; otherwise side by side (two). UIKit stacks more than two itself, as this does; stack two whose labels don’t fit side by side.',
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its actions (
      <PartLink
        component="alert"
        part="Alert.Action"
      />
      ): side by side, the cancel first; stacked, the cancel last.
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const alertActionRows: readonly PropRow[] = [
  [
    'variant',
    union('secondary', 'primary', 'destructive'),
    code(union('secondary')),
    'Its kind (Figma “Type”): secondary (on a gray fill, e.g. Cancel), primary (in the tint, the default action), destructive (red text, e.g. Delete).',
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'Its label: a verb or short phrase (Delete, Save), title case.',
  ],
  nativeButtonRow(true),
  ...baseUiRows('button', 'HTMLButtonElement'),
];

/**
 * `Alert.createHandle<Payload>()`, `useCreateAlertHandle<Payload>()`: their
 * type parameter (no arguments).
 */
export const alertHandleTypeRows: readonly PropRow[] = [
  [
    'Payload',
    'type parameter',
    code('unknown'),
    <>
      What its triggers pass the alert as they open it (their{' '}
      <code>payload</code>; the root’s children as a function of it).
    </>,
  ],
];

/** `Alert.createHandle()`, `useCreateAlertHandle()`: what they return. */
export const alertHandleRows: readonly PropRow[] = [
  [
    '(return)',
    'AlertHandle<Payload>',
    undefined,
    <>
      A handle (Base UI’s <code>AlertDialog.Handle</code>): passed to an{' '}
      <PartLink
        component="alert"
        part="Alert.Root"
      />{' '}
      and its{' '}
      <PartLink
        component="alert"
        part="Alert.Trigger"
      />
      s (their <code>handle</code>); from the hook, the same for the component’s
      lifetime.
    </>,
  ],
  [
    '.isOpen',
    'boolean',
    undefined,
    'Whether the alert is currently open (false while no root is attached to the handle).',
  ],
  [
    '.open(triggerId)',
    '(triggerId: string | null) => void',
    undefined,
    'Opens the alert, optionally associating it with a trigger (in an event handler or an effect): e.g. after a failed save.',
  ],
  [
    '.openWithPayload(payload)',
    '(payload: Payload) => void',
    undefined,
    'Opens the alert with the given payload, without associating it with any trigger.',
  ],
  ['.close()', '() => void', undefined, 'Closes the alert.'],
];
