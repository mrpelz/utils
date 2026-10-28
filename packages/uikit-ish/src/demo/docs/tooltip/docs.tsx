import {
  anchorPositioningRows,
  baseUiRows,
  code,
  PropRow,
  union,
} from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';

// Every part's props (Base UI's with its descriptions), for the parts page
// (all) and the overview (its key ones).

export const tooltipRootRows: readonly PropRow[] = [
  ['open', 'boolean', undefined, 'Whether the tooltip is currently open.'],
  [
    'defaultOpen',
    'boolean',
    code('false'),
    <>
      Whether the tooltip is initially open. To render a controlled tooltip, use
      the <code>open</code> prop instead.
    </>,
  ],
  [
    'onOpenChange',
    '(open: boolean, eventDetails) => void',
    undefined,
    <>
      Event handler called when the tooltip is opened or closed (with Base UI’s
      event details: the <code>reason</code>, e.g. <code>trigger-hover</code>,{' '}
      <code>trigger-focus</code>, <code>trigger-press</code>,{' '}
      <code>escape-key</code>).
    </>,
  ],
  [
    'onOpenChangeComplete',
    '(open: boolean) => void',
    undefined,
    'Event handler called after any animations complete when the tooltip is opened or closed.',
  ],
  [
    'disabled',
    'boolean',
    code('false'),
    'Whether the tooltip is disabled (it doesn’t open; its trigger still works).',
  ],
  [
    'disableHoverablePopup',
    'boolean',
    code('false'),
    'Whether the tooltip contents can be hovered without closing the tooltip (true: they can’t).',
  ],
  [
    'trackCursorAxis',
    union('none', 'x', 'y', 'both'),
    code(union('none')),
    'Determines which axis the tooltip should track the cursor on.',
  ],
  [
    'actionsRef',
    'RefObject<{ unmount: () => void; close: () => void } | null>',
    undefined,
    <>
      A ref to imperative actions: <code>close</code> closes the tooltip;{' '}
      <code>unmount</code> ends its closing phase after an externally controlled
      closing animation.
    </>,
  ],
  [
    'handle',
    'TooltipHandle<Payload>',
    undefined,
    <>
      A handle to associate the tooltip with triggers (outside it), made by{' '}
      <PartLink
        component="tooltip"
        part="Tooltip.createHandle"
      >
        Tooltip.createHandle()
      </PartLink>{' '}
      (in a component:{' '}
      <PartLink
        component="tooltip"
        part="useCreateTooltipHandle"
      >
        useCreateTooltipHandle()
      </PartLink>
      ).
    </>,
  ],
  [
    'triggerId',
    'string | null',
    undefined,
    <>
      ID of the trigger that the tooltip is associated with (with{' '}
      <code>open</code>, for a controlled tooltip).
    </>,
  ],
  [
    'defaultTriggerId',
    'string | null',
    undefined,
    <>
      ID of the trigger that the tooltip is associated with (with{' '}
      <code>defaultOpen</code>, for an initially open tooltip).
    </>,
  ],
  [
    'children',
    'ReactNode | ((props: { payload }) => ReactNode)',
    undefined,
    <>
      Its trigger and its portal; or a function of the active trigger’s{' '}
      <code>payload</code>.
    </>,
  ],
];

export const tooltipTriggerRows: readonly PropRow[] = [
  [
    'delay',
    'number',
    <>
      <code>300</code> (in a{' '}
      <PartLink
        component="tooltip"
        part="Tooltip.Provider"
      />
      , its <code>delay</code>)
    </>,
    'How long to wait before opening the tooltip on hover, in milliseconds (Base UI: 600).',
  ],
  [
    'closeDelay',
    'number',
    code('0'),
    'How long to wait before closing the tooltip, in milliseconds.',
  ],
  [
    'closeOnClick',
    'boolean',
    code('true'),
    'Whether the tooltip should close when this trigger is clicked.',
  ],
  [
    'disabled',
    'boolean',
    code('false'),
    <>
      If <code>true</code>, the tooltip will not open when interacting with this
      trigger (the trigger itself isn’t disabled: pass its <code>disabled</code>{' '}
      through <code>render</code>).
    </>,
  ],
  [
    'handle',
    'TooltipHandle<Payload>',
    undefined,
    <>
      A handle to associate the trigger with a tooltip (the trigger outside it),
      made by{' '}
      <PartLink
        component="tooltip"
        part="Tooltip.createHandle"
      >
        Tooltip.createHandle()
      </PartLink>
      .
    </>,
  ],
  [
    'payload',
    'Payload',
    undefined,
    'A payload to pass to the tooltip when it is opened.',
  ],
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
            </PartLink>{' '}
            (the control it’s about).
          </>,
        ]
      : row,
  ),
];

export const tooltipProviderRows: readonly PropRow[] = [
  [
    'delay',
    'number',
    code('600'),
    'How long to wait before opening a tooltip on hover, in milliseconds (its triggers’, unless their own).',
  ],
  [
    'closeDelay',
    'number',
    code('0'),
    'How long to wait before closing a tooltip, in milliseconds.',
  ],
  [
    'timeout',
    'number',
    code('400'),
    'Another tooltip will open instantly if the previous tooltip is closed within this timeout, in milliseconds.',
  ],
  ['children', 'ReactNode', undefined, 'Its tooltips (e.g. a toolbar’s).'],
];

export const tooltipPortalRows: readonly PropRow[] = [
  [
    'keepMounted',
    'boolean',
    code('false'),
    'Whether to keep the portal mounted in the DOM while the popup is hidden.',
  ],
  [
    'container',
    'HTMLElement | ShadowRoot | RefObject<…> | null',
    <>
      <code>document.body</code>
    </>,
    'A parent element to render the portal element into.',
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const tooltipPositionerRows: readonly PropRow[] = [
  [
    'side',
    union('block-start', 'block-end', 'inline-start', 'inline-end'),
    code(union('block-start')),
    'Its side of its anchor (logical: above, below, before, after it); it moves to the other side to avoid collisions.',
  ],
  [
    'align',
    union('start', 'center', 'end'),
    code(union('center')),
    'How to align the popup relative to the specified side.',
  ],
  [
    'sideOffset',
    'number | ((data) => number)',
    code('8'),
    'Distance between the anchor and the popup in pixels; or a function of the anchor’s and positioner’s dimensions, its side and alignment.',
  ],
  [
    'collisionPadding',
    'number | { top?, right?, bottom?, left? }',
    code('8'),
    'Additional space to maintain from the edge of the collision boundary.',
  ],
  ...anchorPositioningRows,
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const tooltipPopupRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'Its text: a few words (Subheadline), wrapping past 320px.',
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

/**
 * `Tooltip.createHandle<Payload>()`, `useCreateTooltipHandle<Payload>()`:
 * their type parameter (no arguments).
 */
export const tooltipHandleTypeRows: readonly PropRow[] = [
  [
    'Payload',
    'type parameter',
    code('unknown'),
    <>
      What its triggers pass the tooltip as they open it (their{' '}
      <code>payload</code>; the root’s children as a function of it).
    </>,
  ],
];

/** `Tooltip.createHandle()`, `useCreateTooltipHandle()`: what they return. */
export const tooltipHandleRows: readonly PropRow[] = [
  [
    '(return)',
    'TooltipHandle<Payload>',
    undefined,
    <>
      A handle (Base UI’s <code>Tooltip.Handle</code>): passed to a{' '}
      <PartLink
        component="tooltip"
        part="Tooltip.Root"
      />{' '}
      and its{' '}
      <PartLink
        component="tooltip"
        part="Tooltip.Trigger"
      />
      s (their <code>handle</code>); from the hook, the same for the component’s
      lifetime.
    </>,
  ],
  [
    '.isOpen',
    'boolean',
    undefined,
    'Whether the tooltip is currently open (false while no root is attached to the handle).',
  ],
  [
    '.open(triggerId)',
    '(triggerId: string) => void',
    undefined,
    'Opens the tooltip at the trigger with this id (in an event handler or an effect).',
  ],
  ['.close()', '() => void', undefined, 'Closes the tooltip.'],
];
