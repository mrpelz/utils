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
      Whether the menu is open: the app’s (e.g. while there’s a selection, from{' '}
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
      Event handler called when the menu is opened or closed: closed (an action
      chosen, a press outside, Escape), the app clears what opened it (e.g. the
      selection anchor).
    </>,
  ],
  [
    'modal',
    'boolean',
    code('false'),
    'Determines if the menu enters a modal state when open; by default not: the page stays interactive, a press outside reaching it (e.g. clearing the selection) as it closes the menu.',
  ],
  [
    'size',
    union('compact', 'regular'),
    code(union('regular')),
    <>
      The size class of its menus (e.g. the{' '}
      <PartLink
        component="edit-menu"
        part="EditMenu.More"
      />{' '}
      button’s): <code>regular</code> (their submenus beside their trigger) or{' '}
      <code>compact</code> (their submenus over it). The capsule is the same
      either way.
    </>,
  ],
  [
    'orientation',
    union('horizontal', 'vertical'),
    code(union('horizontal')),
    'The visual orientation of the menu: its actions in a row, the arrow keys left and right moving between them.',
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
      Its portal (the capsule), and the content its actions are about (e.g. the
      text, a sibling inside it, or elsewhere).
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
      What it shows at (required): the selection (
      <PartLink
        component="edit-menu"
        part="useSelectionAnchor"
      />
      ’s anchor), or an element.
    </>,
  ],
  [
    'side',
    union('block-start', 'block-end'),
    code(union('block-start')),
    'Its side of its anchor (logical): above it, or below; it moves to the other side to avoid collisions.',
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
    'Additional space to maintain from the edge of the collision boundary; too narrow for its actions, they scroll in the capsule.',
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
            button, last; too many for its width, the actions scroll (by touch
            drags, the wheel), faded at the ends with more beyond.
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
  ['destructive', 'boolean', code('false'), 'A red label, e.g. Delete.'],
  [
    'cursor',
    'string (a CSS cursor)',
    <>
      <code>pointer</code> with a click handler, otherwise or while disabled{' '}
      <code>not-allowed</code>
    </>,
    'The cursor (where the pointer hovers).',
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
    'Its label (14px), a divider before it (but the first).',
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
  ['aria-label', 'string', code('More'), 'Its name (it has no text).'],
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
    'The element whose text selections count (e.g. a paragraph, an article; from a callback ref or state).',
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
      (the pointer released, or after a pause: keyboard, touch); null while
      there’s none, or while selecting.
    </>,
  ],
  [
    '[1] clear',
    '() => void',
    undefined,
    'Forgets it (e.g. as the menu closes), the selection itself kept.',
  ],
];
