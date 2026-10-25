import {
  anchorPositioningRows,
  baseUiRows,
  code,
  elementRows,
  PropRow,
  union,
} from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';
import { menuPopupRows, menuRootRows, menuTriggerRows } from '../menu/docs.js';

// Every part's props (Base UI's, through Menu's, with its descriptions),
// for the parts page (all) and the overview (its key ones).

export const contextualMenuRootRows: readonly PropRow[] = menuRootRows.map(
  (row): PropRow => {
    switch (row[0]) {
      case 'handle': {
        return [
          row[0],
          'ContextualMenuHandle<Payload>',
          row[2],
          <>
            A handle opening or closing the menu imperatively, made by{' '}
            <PartLink
              component="contextual-menu"
              part="ContextualMenu.createHandle"
            >
              ContextualMenu.createHandle()
            </PartLink>{' '}
            (in a component:{' '}
            <PartLink
              component="contextual-menu"
              part="useCreateContextualMenuHandle"
            >
              useCreateContextualMenuHandle()
            </PartLink>
            ); its trigger inside the root, to lift.
          </>,
        ];
      }
      case 'children': {
        return [
          row[0],
          row[1],
          row[2],
          <>
            Its{' '}
            <PartLink
              component="contextual-menu"
              part="ContextualMenu.Trigger"
            />
            , optionally a{' '}
            <PartLink
              component="contextual-menu"
              part="ContextualMenu.Preview"
            />
            , and its portal (the menu).
          </>,
        ];
      }
      default: {
        return row;
      }
    }
  },
);

export const contextualMenuTriggerRows: readonly PropRow[] = [
  [
    'openOn',
    union('click', 'secondaryClick'),
    code(union('click')),
    <>
      What opens the menu: a press (on touch, as the finger goes down; drag on
      to an item to choose it), or a secondary click (a right click, a touch
      held), a click then being the trigger’s own (e.g. opening the photo).
    </>,
  ],
  ...menuTriggerRows.filter(([name]) => name !== 'openOn' && name !== 'handle'),
];

export const contextualMenuPreviewRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'What the menu acts on (e.g. the photo, larger than its thumbnail), shown in the trigger’s place while the menu is open.',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const contextualMenuPortalRows: readonly PropRow[] = [
  [
    'container',
    'HTMLElement | ShadowRoot | RefObject<…> | null',
    <>
      <code>document.body</code>
    </>,
    'A parent element to render the portal element into; also the screen the trigger lifts within (else the viewport).',
  ],
  [
    'keepMounted',
    'boolean',
    code('false'),
    'Whether to keep the portal mounted in the DOM while the popup is hidden.',
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const contextualMenuBackdropRows: readonly PropRow[] = baseUiRows(
  'div',
  'HTMLDivElement',
);

export const contextualMenuPositionerRows: readonly PropRow[] = [
  [
    'align',
    union('start', 'center', 'end'),
    code(union('center')),
    'How to align the menu with the trigger (or preview), which aligns with it; shifted to stay in the viewport.',
  ],
  [
    'sideOffset',
    'number | ((data) => number)',
    code('8'),
    'Distance between the lifted trigger (or preview) and the menu in pixels.',
  ],
  [
    'collisionPadding',
    'number | { top?, right?, bottom?, left? }',
    code('5'),
    'Additional space to maintain from the edge of the collision boundary.',
  ],
  ...anchorPositioningRows.filter(
    ([name]) => name !== 'anchor' && name !== 'collisionAvoidance',
  ),
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const contextualMenuPopupRows: readonly PropRow[] = menuPopupRows.map(
  (row): PropRow =>
    row[0] === 'children'
      ? [
          row[0],
          row[1],
          row[2],
          <>
            A <a href="menu">Menu</a>’s contents (
            <PartLink
              component="menu"
              part="Menu.Item"
            />
            s, groups, separators, quick actions); taller than the viewport with
            the trigger, they scroll together.
          </>,
        ]
      : row,
);

/** `ContextualMenu.createHandle()`, its hook: what they return. */
export const contextualMenuHandleRows: readonly PropRow[] = [
  [
    '(return)',
    'ContextualMenuHandle<Payload>',
    undefined,
    <>
      A handle (Base UI’s <code>Menu.Handle</code>): passed to a{' '}
      <PartLink
        component="contextual-menu"
        part="ContextualMenu.Root"
      />{' '}
      and its{' '}
      <PartLink
        component="contextual-menu"
        part="ContextualMenu.Trigger"
      />{' '}
      (inside it: a trigger outside it couldn’t lift); from the hook, the same
      for the component’s lifetime.
    </>,
  ],
  ['.isOpen', 'boolean', undefined, 'Whether the menu is currently open.'],
  [
    '.open(triggerId)',
    '(triggerId: string) => void',
    undefined,
    'Opens the menu at the trigger with this id, lifting it.',
  ],
  ['.close()', '() => void', undefined, 'Closes the menu.'],
];

export { menuHandleTypeRows as contextualMenuHandleTypeRows } from '../menu/docs.js';
