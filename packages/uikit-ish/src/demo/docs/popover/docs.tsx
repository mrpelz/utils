import {
  anchorPositioningRows,
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

export const popoverRootRows: readonly PropRow[] = [
  ['open', 'boolean', undefined, 'Whether the popover is currently open.'],
  [
    'defaultOpen',
    'boolean',
    code('false'),
    <>
      Whether the popover is initially open. To render a controlled popover, use
      the <code>open</code> prop instead.
    </>,
  ],
  [
    'onOpenChange',
    '(open: boolean, eventDetails) => void',
    undefined,
    <>
      Event handler called when the popover is opened or closed (with Base UI’s
      event details: the <code>reason</code>, for example{' '}
      <code>trigger-press</code>, <code>outside-press</code>,{' '}
      <code>escape-key</code> or <code>close-press</code>, and the{' '}
      <code>trigger</code> element. <code>eventDetails.cancel()</code> keeps it
      as it is).
    </>,
  ],
  [
    'onOpenChangeComplete',
    '(open: boolean) => void',
    undefined,
    'Event handler called after any animations complete when the popover is opened or closed.',
  ],
  [
    'modal',
    ['boolean', union('trap-focus')].join(' | '),
    code('false'),
    <>
      Determines if the popover enters a modal state when open:{' '}
      <code>true</code>, user interaction is limited to the popover (page scroll
      locked, outside pointer interactions disabled; focus trapped with a{' '}
      <PartLink
        component="popover"
        part="Popover.Close"
      />{' '}
      in it); <code>false</code>, user interaction with the rest of the document
      is allowed; <code>trap-focus</code>, focus is trapped, but scroll and
      outside pointer interactions remain enabled.
    </>,
  ],
  [
    'actionsRef',
    'RefObject<{ unmount: () => void; close: () => void } | null>',
    undefined,
    <>
      A ref to imperative actions: <code>close</code> closes the popover;{' '}
      <code>unmount</code> ends its closing phase after an externally controlled
      closing animation.
    </>,
  ],
  [
    'handle',
    'PopoverHandle<Payload>',
    undefined,
    <>
      A handle to associate the popover with a trigger (outside it), made by{' '}
      <PartLink
        component="popover"
        part="Popover.createHandle"
      >
        Popover.createHandle()
      </PartLink>{' '}
      (in a component:{' '}
      <PartLink
        component="popover"
        part="useCreatePopoverHandle"
      >
        useCreatePopoverHandle()
      </PartLink>
      ).
    </>,
  ],
  [
    'triggerId',
    'string | null',
    undefined,
    <>
      ID of the trigger that the popover is associated with (with{' '}
      <code>open</code>, for a controlled popover).
    </>,
  ],
  [
    'defaultTriggerId',
    'string | null',
    undefined,
    <>
      ID of the trigger that the popover is associated with (with{' '}
      <code>defaultOpen</code>, for an initially open popover).
    </>,
  ],
  [
    'children',
    'ReactNode | ((props: { payload }) => ReactNode)',
    undefined,
    <>
      Its trigger and its portal, or a function of the active trigger’s{' '}
      <code>payload</code>.
    </>,
  ],
];

export const popoverTriggerRows: readonly PropRow[] = [
  [
    'openOnHover',
    'boolean',
    code('false'),
    'Whether the popover should also open when the trigger is hovered.',
  ],
  [
    'delay',
    'number',
    code('300'),
    <>
      How long to wait before the popover may be opened on hover, in
      milliseconds (with <code>openOnHover</code>).
    </>,
  ],
  [
    'closeDelay',
    'number',
    code('0'),
    <>
      How long to wait before closing the popover that was opened on hover, in
      milliseconds (with <code>openOnHover</code>).
    </>,
  ],
  [
    'handle',
    'PopoverHandle<Payload>',
    undefined,
    <>
      A handle to associate the trigger with a popover (the trigger outside it),
      made by{' '}
      <PartLink
        component="popover"
        part="Popover.createHandle"
      >
        Popover.createHandle()
      </PartLink>{' '}
      (in a component:{' '}
      <PartLink
        component="popover"
        part="useCreatePopoverHandle"
      >
        useCreatePopoverHandle()
      </PartLink>
      ).
    </>,
  ],
  [
    'payload',
    'Payload',
    undefined,
    'A payload to pass to the popover when it is opened.',
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

export const popoverPortalRows: readonly PropRow[] = [
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

export const popoverBackdropRows: readonly PropRow[] = baseUiRows(
  'div',
  'HTMLDivElement',
);

export const popoverPositionerRows: readonly PropRow[] = [
  [
    'side',
    union('block-start', 'block-end', 'inline-start', 'inline-end'),
    code(union('block-end')),
    'Which side of its anchor it’s on (logical: above, below, before or after it). It moves to the other side to avoid collisions.',
  ],
  [
    'align',
    union('start', 'center', 'end'),
    'its end in a list row, otherwise centered',
    'How to align the popup relative to the specified side.',
  ],
  [
    'sideOffset',
    'number | ((data) => number)',
    '8px (with an arrow: its tip 8px from its anchor)',
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

export const popoverPopupRows: readonly PropRow[] = [
  [
    'initialFocus',
    'boolean | RefObject<HTMLElement | null> | ((openType) => …)',
    undefined,
    <>
      Determines the element to focus when the popover is opened. By default,
      focus moves to the first tabbable element inside the popup, except when
      the popover is opened by touch — then the popup itself is focused to avoid
      opening the virtual keyboard. <code>false</code>: do not move focus.
    </>,
  ],
  [
    'finalFocus',
    'boolean | RefObject<HTMLElement | null> | ((closeType) => …)',
    undefined,
    <>
      Determines the element to focus when the popover is closed. By default:
      the trigger (or the previously focused element). <code>false</code>: do
      not move focus.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its arrow (
      <PartLink
        component="popover"
        part="Popover.Arrow"
      />
      , optional) and its content: a header (for example a{' '}
      <a href={publicUrl('toolbar')}>Toolbar</a>), a{' '}
      <PartLink
        component="popover"
        part="Popover.Body"
      />{' '}
      when it may scroll.
    </>,
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const popoverArrowRows: readonly PropRow[] = [
  [
    'whenShifted',
    union('hide', 'show'),
    code(union('hide')),
    <>
      What happens when the popover has shifted so far that the arrow can’t
      point at the trigger’s center (Base UI’s <code>data-uncentered</code>), or
      when it covers the trigger (too tall to fit on either side).{' '}
      <code>hide</code> draws none, and keeps the popup as close to the trigger
      as without one. <code>show</code> draws it where Base UI places it.
    </>,
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const popoverHeaderRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its bar: a <a href={publicUrl('toolbar')}>Toolbar</a> (
      <code>placement=&quot;block-start&quot;</code>, a 44px row here) with its
      title (
      <PartLink
        component="popover"
        part="Popover.Title"
      />
      ) and buttons (
      <PartLink
        component="popover"
        part="Popover.Close"
      />
      ). It sits above the body, which scrolls under it and makes room with a{' '}
      <PartLink
        component="viewport"
        part="Viewport.Padding"
      />
      ).
    </>,
  ],
  [
    'edgeEffect',
    union('soft', 'hard', 'none'),
    code(union('soft')),
    <>
      Its scroll edge effect, as the body scrolls under it (like a{' '}
      <PartLink
        component="viewport"
        part="Viewport.Anchor"
      />
      ’s). <code>soft</code>: the body fades out under it, without a blur on the
      popover’s glass. It’s fully hidden under a share of the header (
      <code>--uikit-viewport-edge-veil</code>, 0 to 1; a popover’s is{' '}
      <code>0.75</code>), and shows past it. <code>hard</code>: a solid backing
      with a dividing line. <code>none</code>: nothing.
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

export const popoverBodyRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'What scrolls once the popup reaches its maximum height (the room the viewport has for it).',
  ],
  glassModeRow,
  ...elementRows('div', 'HTMLDivElement'),
];

export const popoverViewportRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'The content to render inside the transition container. Changes to it (another trigger’s content) are animated there.',
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const popoverTitleRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'The popover’s title, which is its accessible name.',
  ],
  ...baseUiRows('h2', 'HTMLHeadingElement').map((row): PropRow =>
    row[0] === 'render'
      ? [
          row[0],
          row[1],
          row[2],
          <>
            {row[3]} For example a <code>{'<span />'}</code> in a{' '}
            <PartLink
              component="toolbar"
              part="Toolbar.Title"
            />
            .
          </>,
        ]
      : row,
  ),
];

export const popoverDescriptionRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'What the popover is for, which is its accessible description.',
  ],
  ...baseUiRows('p', 'HTMLParagraphElement'),
];

export const popoverCloseRows: readonly PropRow[] = [
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
            (with a close symbol, or Done).
          </>,
        ]
      : row,
  ),
];

/**
 * `Popover.createHandle<Payload>()`, `useCreatePopoverHandle<Payload>()`:
 * their type parameter (no arguments).
 */
export const popoverHandleTypeRows: readonly PropRow[] = [
  [
    'Payload',
    'type parameter',
    code('unknown'),
    <>
      What its triggers pass to the popover as they open it (their{' '}
      <code>payload</code>). The root’s children can be a function of it.
    </>,
  ],
];

/** `Popover.createHandle()`, `useCreatePopoverHandle()`: what they return. */
export const popoverHandleRows: readonly PropRow[] = [
  [
    '(return)',
    'PopoverHandle<Payload>',
    undefined,
    <>
      A handle (Base UI’s <code>Popover.Handle</code>). Pass it to a{' '}
      <PartLink
        component="popover"
        part="Popover.Root"
      />{' '}
      and its{' '}
      <PartLink
        component="popover"
        part="Popover.Trigger"
      />
      s (their <code>handle</code>). The hook returns the same one for the
      component’s lifetime.
    </>,
  ],
  [
    '.isOpen',
    'boolean',
    undefined,
    'Whether the popover is currently open (false while no root is attached to the handle).',
  ],
  [
    '.open(triggerId)',
    '(triggerId: string) => void',
    undefined,
    'Opens the popover at the trigger with this id, which must use this handle (in an event handler or an effect).',
  ],
  ['.close()', '() => void', undefined, 'Closes the popover.'],
];
