import {
  anchorPositioningRows,
  baseUiRows,
  code,
  elementRows,
  PropRow,
  union,
} from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
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
            A handle that opens or closes the menu from code, made by{' '}
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
    code(union('secondaryClick')),
    <>
      What opens the menu. A secondary click (a right click, or a held touch;
      drag on to an item to choose it), while a click stays the trigger’s own
      (for example opening the photo). Or a press too (on touch, as the finger
      goes down). On touch, a held press also selects the trigger’s text and
      shows the browser’s text menu. Unless the text should stay selectable,
      turn that off on the trigger (
      <PartLink
        component="viewport"
        part="useTextActionsPrevention"
      />
      ), as the demos do.
    </>,
  ],
  ...menuTriggerRows.filter(([name]) => name !== 'openOn' && name !== 'handle'),
];

export const contextualMenuPreviewRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'What the menu acts on (for example the photo, larger than its thumbnail), shown in the trigger’s place while the menu is open.',
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
    'A parent element to render the portal element into. It’s also the screen the menu fits in (otherwise, the viewport is).',
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
    'How to align the menu with the trigger. The preview (or the lifted trigger) aligns with it, and both shift to stay on the screen.',
  ],
  [
    'collisionPadding',
    'number | { top?, right?, bottom?, left? }',
    code('5'),
    'Additional space to maintain from the edge of the collision boundary.',
  ],
  ...anchorPositioningRows.filter(
    ([name]) =>
      name !== 'anchor' &&
      name !== 'collisionAvoidance' &&
      name !== 'sideOffset',
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
            A <a href={publicUrl('menu')}>Menu</a>’s contents (
            <PartLink
              component="menu"
              part="Menu.Item"
            />
            s, groups, separators, quick actions); taller than the room below
            the preview, they scroll.
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
      A handle (Base UI’s <code>Menu.Handle</code>). Pass it to a{' '}
      <PartLink
        component="contextual-menu"
        part="ContextualMenu.Root"
      />{' '}
      and its{' '}
      <PartLink
        component="contextual-menu"
        part="ContextualMenu.Trigger"
      />{' '}
      , which stays inside it, because a trigger outside it couldn’t lift. The
      hook returns the same one for the component’s lifetime.
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
