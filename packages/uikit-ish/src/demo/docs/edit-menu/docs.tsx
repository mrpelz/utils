import {
  anchorPositioningRows,
  baseUiRows,
  code,
  PropRow,
  union,
} from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';
import {
  menuPopupRows,
  menuPortalRows,
  menuRootRows,
  menuSubmenuRootRows,
  menuSubmenuTriggerRows,
} from '../menu/docs.js';

// Every part's props (Base UI's, through Menu's, with its descriptions),
// for the parts page (all) and the overview (its key ones).

export const editMenuRootRows: readonly PropRow[] = [
  [
    'open',
    'boolean',
    undefined,
    <>
      Whether the menu is open: the app decides (for example while there’s a
      selection, from{' '}
      <PartLink
        component="edit-menu"
        part="useSelectionAnchor"
      />
      ); it has no trigger.
    </>,
  ],
  [
    'onOpenChange',
    '(open: boolean, eventDetails) => void',
    undefined,
    <>
      Event handler called when the menu is opened or closed. When it closes (an
      action chosen, a press outside, Escape), the app clears what opened it
      (for example the selection anchor).
    </>,
  ],
  [
    'modal',
    'boolean',
    code('false'),
    'Determines if the menu enters a modal state when open. By default, it doesn’t: the page stays interactive, and a press outside reaches it (for example clearing the selection) as it closes the menu.',
  ],
  [
    'size',
    union('compact', 'regular'),
    code(union('regular')),
    <>
      The size class of its menus (for example the{' '}
      <PartLink
        component="edit-menu"
        part="EditMenu.More"
      />{' '}
      button’s): <code>regular</code> (with submenus next to their trigger) or{' '}
      <code>compact</code> (with submenus over it). The capsule is the same
      either way.
    </>,
  ],
  [
    'orientation',
    union('horizontal', 'vertical'),
    code(union('horizontal')),
    'The visual orientation of the menu: its actions in a row, with the left and right arrow keys moving between them.',
  ],
  ...menuRootRows.filter(
    ([name]) =>
      ![
        'size',
        'open',
        'defaultOpen',
        'onOpenChange',
        'modal',
        'handle',
        'triggerId',
        'defaultTriggerId',
        'children',
      ].includes(name),
  ),
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its portal (the capsule), and the content its actions are about (for
      example the text, as a sibling inside it, or elsewhere).
    </>,
  ],
];

export const editMenuPortalRows: readonly PropRow[] = menuPortalRows;

export const editMenuPositionerRows: readonly PropRow[] = [
  [
    'anchor',
    'Element | RefObject<Element> | VirtualElement | (() => …) | null',
    undefined,
    <>
      Where it shows (required): at the selection (
      <PartLink
        component="edit-menu"
        part="useSelectionAnchor"
      />
      ’s anchor), or at an element.
    </>,
  ],
  [
    'side',
    union('block-start', 'block-end'),
    code(union('block-start')),
    'Which side of its anchor it’s on (logical): above it, or below. It moves to the other side to avoid collisions.',
  ],
  [
    'align',
    union('start', 'center', 'end'),
    code(union('center')),
    'How to align the capsule relative to the specified side.',
  ],
  [
    'sideOffset',
    'number | ((data) => number)',
    code('8'),
    'Distance between the anchor and the capsule in pixels.',
  ],
  [
    'collisionPadding',
    'number | { top?, right?, bottom?, left? }',
    code('5'),
    'Additional space to maintain from the edge of the collision boundary. When that’s too narrow for its actions, they scroll in the capsule.',
  ],
  ...anchorPositioningRows.filter(([name]) => name !== 'anchor'),
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const editMenuPopupRows: readonly PropRow[] = menuPopupRows.map(
  (row): PropRow =>
    row[0] === 'children'
      ? [
          row[0],
          row[1],
          row[2],
          <>
            Its{' '}
            <PartLink
              component="edit-menu"
              part="EditMenu.Item"
            />
            s, and optionally an{' '}
            <PartLink
              component="edit-menu"
              part="EditMenu.SubmenuRoot"
            />{' '}
            with the{' '}
            <PartLink
              component="edit-menu"
              part="EditMenu.More"
            />{' '}
            button, last; too many for its width, the actions scroll (a swipe, a
            touch held and dragged to an end, the wheel), snapping with a peek
            of those beyond, faded at the ends.
          </>,
        ]
      : row,
);

export const editMenuItemRows: readonly PropRow[] = [
  [
    'onClick',
    '(event: MouseEvent) => void',
    undefined,
    'The click handler for the action.',
  ],
  [
    'closeOnClick',
    'boolean',
    code('true'),
    'Whether to close the menu when the action is clicked.',
  ],
  [
    'destructive',
    'boolean',
    code('false'),
    'Turns its label red, for example for Delete.',
  ],
  [
    'cursor',
    'string (a CSS cursor)',
    <>
      <code>pointer</code> with a click handler, otherwise or while disabled{' '}
      <code>not-allowed</code>
    </>,
    'The cursor shown while the pointer hovers it.',
  ],
  [
    'disabled',
    'boolean',
    code('false'),
    'Whether the component should ignore user interaction.',
  ],
  [
    'label',
    'string',
    undefined,
    'Overrides the text used for keyboard text navigation. Falls back to the rendered text when not provided.',
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'Its label (14px), with a divider before it (except the first).',
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const editMenuSubmenuRootRows: readonly PropRow[] = menuSubmenuRootRows;

export const editMenuMoreRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    'a chevron',
    'What the 34px circle shows (a chevron, drawn as a stroke).',
  ],
  ['aria-label', 'string', code('More'), 'Its name, since it has no text.'],
  ...menuSubmenuTriggerRows
    .filter(
      ([name]) =>
        !['destructive', 'cursor', 'label', 'children'].includes(name),
    )
    .map((row): PropRow =>
      row[0] === 'openOnHover'
        ? [
            row[0],
            row[1],
            code('false'),
            'Whether the submenu should also open when the button is hovered (not by default: a button, pressed).',
          ]
        : row,
    ),
];

/** `useSelectionAnchor(container)`: its argument. */
export const useSelectionAnchorParameterRows: readonly PropRow[] = [
  [
    'container',
    'HTMLElement | null',
    undefined,
    'The element whose text selections count (for example a paragraph or an article), from a callback ref or state.',
  ],
];

/** `useSelectionAnchor(container)`: what it returns. */
export const useSelectionAnchorRows: readonly PropRow[] = [
  [
    '[0] anchor',
    '{ getBoundingClientRect: () => DOMRect } | null',
    undefined,
    <>
      The selection, as the positioner’s <code>anchor</code>, once it’s made
      (when the pointer is released, or after a pause for keyboard and touch).
      It’s null while there’s none, or while selecting.
    </>,
  ],
  [
    '[1] clear',
    '() => void',
    undefined,
    'Forgets it (for example as the menu closes), while keeping the selection itself.',
  ],
];
