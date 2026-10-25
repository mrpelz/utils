import {
  anchorPositioningRows,
  baseUiRows,
  code,
  elementRows,
  PropRow,
  union,
} from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';

// Every part's props (Base UI's with its descriptions), for the parts page
// (all) and the overview (its key ones).

/** Ours, on every item (and quick action). */
const itemRows: readonly PropRow[] = [
  [
    'destructive',
    'boolean',
    code('false'),
    'Red content (Figma State=Destructive), e.g. Delete.',
  ],
  [
    'cursor',
    'string (a CSS cursor)',
    <>
      <code>pointer</code> with a click handler (toggles, links, submenu
      triggers: always), otherwise or while disabled <code>not-allowed</code>
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
    'Overrides the text used for keyboard text navigation and filtering. Falls back to the rendered text when not provided.',
  ],
];

/** Every item's contents (see `Menu.Icon`, `Menu.Label`, …). */
const itemChildrenRow: PropRow = [
  'children',
  'ReactNode',
  undefined,
  <>
    Its{' '}
    <PartLink
      component="menu"
      part="Menu.Label"
    />{' '}
    (and{' '}
    <PartLink
      component="menu"
      part="Menu.Subtitle"
    />
    ), and optionally a{' '}
    <PartLink
      component="menu"
      part="Menu.Icon"
    />{' '}
    and a{' '}
    <PartLink
      component="menu"
      part="Menu.Shortcut"
    />
    , placed in Figma’s item layout whatever their order.
  </>,
];

export const menuRootRows: readonly PropRow[] = [
  [
    'size',
    union('compact', 'regular'),
    code(union('compact')),
    <>
      The UIKit size class, for all its popups: <code>compact</code> (the
      iPhone’s menu: 40px items, submenus over their trigger) or{' '}
      <code>regular</code> (the iPad’s: 36px items, submenus beside it). E.g.
      from{' '}
      <PartLink
        component="viewport"
        part="useSizeClass"
      />
      .
    </>,
  ],
  ['open', 'boolean', undefined, 'Whether the menu is currently open.'],
  [
    'defaultOpen',
    'boolean',
    code('false'),
    <>
      Whether the menu is initially open. To render a controlled menu, use the{' '}
      <code>open</code> prop instead.
    </>,
  ],
  [
    'onOpenChange',
    '(open: boolean, eventDetails) => void',
    undefined,
    <>
      Event handler called when the menu is opened or closed (with Base UI’s
      event details: the <code>reason</code>, e.g. <code>trigger-press</code>,{' '}
      <code>item-press</code>, <code>outside-press</code>,{' '}
      <code>escape-key</code>).
    </>,
  ],
  [
    'onOpenChangeComplete',
    '(open: boolean) => void',
    undefined,
    'Event handler called after any animations complete when the menu is opened or closed.',
  ],
  [
    'onItemHighlighted',
    '(highlightedItem: HTMLElement | undefined, eventDetails) => void',
    undefined,
    'Callback fired when an item is highlighted or unhighlighted.',
  ],
  [
    'modal',
    'boolean',
    code('true'),
    'Determines if the menu enters a modal state when open: page scroll locked, outside pointer interactions disabled.',
  ],
  [
    'loopFocus',
    'boolean',
    code('true'),
    'Whether to loop keyboard focus back to the first item when the end of the list is reached while using the arrow keys.',
  ],
  [
    'highlightItemOnHover',
    'boolean',
    code('true'),
    <>
      Whether moving the pointer over items should highlight them (the selection
      follows the pointer).
    </>,
  ],
  [
    'disabled',
    'boolean',
    code('false'),
    'Whether the component should ignore user interaction.',
  ],
  [
    'closeParentOnEsc',
    'boolean',
    code('false'),
    'When in a submenu, determines whether pressing the Escape key closes the entire menu, or only the current child menu.',
  ],
  [
    'actionsRef',
    'RefObject<{ close: () => void; unmount: () => void } | null>',
    undefined,
    <>
      A ref to imperative actions: <code>close</code> closes the menu;{' '}
      <code>unmount</code> ends its closing phase after an externally controlled
      closing animation.
    </>,
  ],
  [
    'handle',
    'MenuHandle<Payload>',
    undefined,
    <>
      A handle to associate the menu with triggers (outside it), made by{' '}
      <PartLink
        component="menu"
        part="Menu.createHandle"
      >
        Menu.createHandle()
      </PartLink>{' '}
      (in a component:{' '}
      <PartLink
        component="menu"
        part="useCreateMenuHandle"
      >
        useCreateMenuHandle()
      </PartLink>
      ).
    </>,
  ],
  [
    'triggerId',
    'string | null',
    undefined,
    <>
      ID of the trigger that the menu is associated with (with <code>open</code>
      , for a controlled menu).
    </>,
  ],
  [
    'defaultTriggerId',
    'string | null',
    undefined,
    <>
      ID of the trigger that the menu is associated with (with{' '}
      <code>defaultOpen</code>, for an initially open menu).
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

export const menuSubmenuRootRows: readonly PropRow[] = [
  ['open', 'boolean', undefined, 'Whether the submenu is currently open.'],
  [
    'defaultOpen',
    'boolean',
    code('false'),
    'Whether the submenu is initially open.',
  ],
  [
    'onOpenChange',
    '(open: boolean, eventDetails) => void',
    undefined,
    'Event handler called when the submenu is opened or closed.',
  ],
  [
    'closeParentOnEsc',
    'boolean',
    code('false'),
    'Whether pressing the Escape key closes the entire menu, or only the submenu.',
  ],
  [
    'disabled',
    'boolean',
    code('false'),
    'Whether the component should ignore user interaction.',
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its{' '}
      <PartLink
        component="menu"
        part="Menu.SubmenuTrigger"
      />{' '}
      and its portal (its own positioner and popup). Its size: its root menu’s;
      in an <a href="edit-menu">Edit menu</a>, the iPad’s.
    </>,
  ],
];

export const menuTriggerRows: readonly PropRow[] = [
  [
    'openOn',
    union('click', 'secondaryClick'),
    code(union('click')),
    <>
      What opens the menu: a click, or a secondary click (a right click; a touch
      held, then dragged on to the items), a click then being the trigger’s own
      (UIKit <code>UIButton.menu</code> without{' '}
      <code>showsMenuAsPrimaryAction</code>, e.g. a back button’s history).
    </>,
  ],
  [
    'onSecondaryClick',
    '(event: MouseEvent) => void',
    undefined,
    'Called on a secondary click (a right click, a touch held).',
  ],
  [
    'openOnHover',
    'boolean',
    code('false'),
    'Whether the menu should also open when the trigger is hovered.',
  ],
  [
    'delay',
    'number',
    code('100'),
    <>
      How long to wait before the menu may be opened on hover, in milliseconds
      (with <code>openOnHover</code>).
    </>,
  ],
  [
    'closeDelay',
    'number',
    code('0'),
    <>
      How long to wait before closing the menu that was opened on hover, in
      milliseconds (with <code>openOnHover</code>).
    </>,
  ],
  [
    'disabled',
    'boolean',
    code('false'),
    'Whether the component should ignore user interaction.',
  ],
  [
    'handle',
    'MenuHandle<Payload>',
    undefined,
    <>
      A handle to associate the trigger with a menu (the trigger outside it),
      made by{' '}
      <PartLink
        component="menu"
        part="Menu.createHandle"
      >
        Menu.createHandle()
      </PartLink>
      .
    </>,
  ],
  [
    'payload',
    'Payload',
    undefined,
    'A payload to pass to the menu when it is opened.',
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
            </PartLink>
            .
          </>,
        ]
      : row,
  ),
];

export const menuPortalRows: readonly PropRow[] = [
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

export const menuBackdropRows: readonly PropRow[] = baseUiRows(
  'div',
  'HTMLDivElement',
);

export const menuPositionerRows: readonly PropRow[] = [
  [
    'side',
    union('block-start', 'block-end', 'inline-start', 'inline-end'),
    <>
      <code>{union('block-end')}</code> (a submenu: beside its trigger, compact:
      below it)
    </>,
    'Its side of its anchor (logical); it moves to the other side to avoid collisions.',
  ],
  [
    'align',
    union('start', 'center', 'end'),
    <>
      <code>{union('center')}</code> (a submenu: <code>{union('start')}</code>)
    </>,
    'How to align the popup relative to the specified side.',
  ],
  [
    'sideOffset',
    'number | ((data) => number)',
    <>
      <code>8</code> (a submenu: compact <code>0</code>, regular <code>8</code>)
    </>,
    'Distance between the anchor and the popup in pixels.',
  ],
  [
    'alignOffset',
    'number | ((data) => number)',
    <>
      <code>0</code> (a submenu: compact <code>-8</code>, regular{' '}
      <code>-10</code>: its first item at the trigger)
    </>,
    'Additional offset along the alignment axis in pixels.',
  ],
  [
    'collisionPadding',
    'number | { top?, right?, bottom?, left? }',
    code('5'),
    'Additional space to maintain from the edge of the collision boundary.',
  ],
  ...anchorPositioningRows.filter(([name]) => name !== 'alignOffset'),
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const menuPopupRows: readonly PropRow[] = [
  [
    'finalFocus',
    'boolean | RefObject<HTMLElement | null> | ((closeType) => …)',
    <>its trigger, closed by keys (by a pointer: none; a submenu: Base UI’s)</>,
    <>
      Determines the element to focus when the menu is closed:{' '}
      <code>false</code> none, <code>true</code> Base UI’s default (the trigger
      or previously focused element), an element, or a function of how it
      closed.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'Its items, groups, separators, quick actions; taller than the room for it, it scrolls.',
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const menuItemRows: readonly PropRow[] = [
  [
    'onClick',
    '(event: MouseEvent) => void',
    undefined,
    'The click handler for the menu item (its action).',
  ],
  [
    'closeOnClick',
    'boolean',
    code('true'),
    'Whether to close the menu when the item is clicked.',
  ],
  ...itemRows,
  itemChildrenRow,
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const menuLinkItemRows: readonly PropRow[] = [
  ['href', 'string', undefined, 'The link’s destination.'],
  [
    'closeOnClick',
    'boolean',
    code('false'),
    'Whether to close the menu when the item is clicked.',
  ],
  ...itemRows.filter(([name]) => name !== 'disabled'),
  itemChildrenRow,
  ...baseUiRows('a', 'HTMLAnchorElement'),
];

export const menuCheckboxItemRows: readonly PropRow[] = [
  [
    'checked',
    'boolean',
    undefined,
    <>
      Whether the checkbox item is currently ticked. To render an uncontrolled
      checkbox item, use the <code>defaultChecked</code> prop instead.
    </>,
  ],
  [
    'defaultChecked',
    'boolean',
    code('false'),
    <>
      Whether the checkbox item is initially ticked. To render a controlled
      checkbox item, use the <code>checked</code> prop instead.
    </>,
  ],
  [
    'onCheckedChange',
    '(checked: boolean, eventDetails) => void',
    undefined,
    'Event handler called when the checkbox item is ticked or unticked.',
  ],
  [
    'closeOnClick',
    'boolean',
    code('false'),
    'Whether to close the menu when the item is clicked.',
  ],
  ...itemRows,
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its{' '}
      <PartLink
        component="menu"
        part="Menu.CheckboxItemIndicator"
      />{' '}
      (the checkmark), and an item’s contents (a label, a symbol).
    </>,
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const menuItemIndicatorRows: readonly PropRow[] = [
  [
    'keepMounted',
    'boolean',
    code('false'),
    'Whether to keep the HTML element in the DOM when the item is not checked.',
  ],
  [
    'children',
    'ReactNode',
    'a checkmark',
    'What shows while checked (Figma: 􀆅, drawn as a stroke).',
  ],
  ...baseUiRows('span', 'HTMLSpanElement'),
];

export const menuRadioGroupRows: readonly PropRow[] = [
  [
    'value',
    'any',
    undefined,
    <>
      The controlled value of the radio item that should be currently selected.
      To render an uncontrolled radio group, use the <code>defaultValue</code>{' '}
      prop instead.
    </>,
  ],
  [
    'defaultValue',
    'any',
    undefined,
    <>
      The uncontrolled value of the radio item that should be initially
      selected. To render a controlled radio group, use the <code>value</code>{' '}
      prop instead.
    </>,
  ],
  [
    'onValueChange',
    '(value: any, eventDetails) => void',
    undefined,
    'Function called when the selected value changes.',
  ],
  [
    'disabled',
    'boolean',
    code('false'),
    'Whether the component should ignore user interaction.',
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its{' '}
      <PartLink
        component="menu"
        part="Menu.RadioItem"
      />
      s.
    </>,
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const menuRadioItemRows: readonly PropRow[] = [
  [
    'value',
    'any',
    undefined,
    'Value of the radio item (required): the group’s value when it’s selected.',
  ],
  [
    'closeOnClick',
    'boolean',
    code('false'),
    'Whether to close the menu when the item is clicked.',
  ],
  ...itemRows,
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its{' '}
      <PartLink
        component="menu"
        part="Menu.RadioItemIndicator"
      />{' '}
      (the checkmark), and an item’s contents.
    </>,
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const menuSubmenuTriggerRows: readonly PropRow[] = [
  [
    'openOnHover',
    'boolean',
    code('true'),
    'Whether the submenu should also open when the trigger is hovered.',
  ],
  [
    'delay',
    'number',
    code('100'),
    'How long to wait before the submenu may be opened on hover, in milliseconds.',
  ],
  [
    'closeDelay',
    'number',
    code('0'),
    'How long to wait before closing the submenu that was opened on hover, in milliseconds.',
  ],
  ...itemRows,
  [
    'children',
    'ReactNode',
    undefined,
    'An item’s contents; a chevron after them (compact and open: turned down).',
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const menuGroupRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its{' '}
      <PartLink
        component="menu"
        part="Menu.GroupLabel"
      />{' '}
      and items (e.g. a{' '}
      <PartLink
        component="menu"
        part="Menu.RadioGroup"
      />
      ).
    </>,
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const menuGroupLabelRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'The section’s title (Figma “Section Title”), naming its group.',
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const menuSeparatorRows: readonly PropRow[] = [
  [
    'orientation',
    union('horizontal', 'vertical'),
    code(union('horizontal')),
    'The orientation of the separator.',
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const menuQuickActionsRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its{' '}
      <PartLink
        component="menu"
        part="Menu.QuickAction"
      />
      s (Figma: 2 to 4), in a row at the popup’s top.
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const menuQuickActionRows: readonly PropRow[] = [
  [
    'onClick',
    '(event: MouseEvent) => void',
    undefined,
    'The click handler (its action).',
  ],
  [
    'closeOnClick',
    'boolean',
    code('true'),
    'Whether to close the menu when it is clicked.',
  ],
  ...itemRows,
  [
    'children',
    'ReactNode',
    undefined,
    <>
      A{' '}
      <PartLink
        component="menu"
        part="Menu.Icon"
      />{' '}
      above a{' '}
      <PartLink
        component="menu"
        part="Menu.Label"
      />
      .
    </>,
  ],
  ...baseUiRows('div', 'HTMLDivElement'),
];

export const menuIconRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      A <a href="symbol">Symbol</a> (Body; regular: Subheadline), 28px wide.
    </>,
  ],
  ...elementRows('span', 'HTMLSpanElement'),
];

export const menuLabelRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'The item’s text (17px; regular: 15px).',
  ],
  ...elementRows('span', 'HTMLSpanElement'),
];

export const menuSubtitleRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'A second line below the label, in the secondary label color.',
  ],
  ...elementRows('span', 'HTMLSpanElement'),
];

export const menuShortcutRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      The keyboard shortcut (e.g. <code>⌘C</code>): a string’s glyphs each in a
      14px cell (Figma “_Shortcuts”). Shown only; the app handles the keys.
    </>,
  ],
  ...elementRows('kbd', 'HTMLElement'),
];

/**
 * `Menu.createHandle<Payload>()`, `useCreateMenuHandle<Payload>()`: their
 * type parameter (no arguments).
 */
export const menuHandleTypeRows: readonly PropRow[] = [
  [
    'Payload',
    'type parameter',
    code('unknown'),
    <>
      What its triggers pass the menu as they open it (their{' '}
      <code>payload</code>; the root’s children as a function of it).
    </>,
  ],
];

/** `Menu.createHandle()`, `useCreateMenuHandle()`: what they return. */
export const menuHandleRows: readonly PropRow[] = [
  [
    '(return)',
    'MenuHandle<Payload>',
    undefined,
    <>
      A handle (Base UI’s <code>Menu.Handle</code>): passed to a{' '}
      <PartLink
        component="menu"
        part="Menu.Root"
      />{' '}
      and its{' '}
      <PartLink
        component="menu"
        part="Menu.Trigger"
      />
      s (their <code>handle</code>); from the hook, the same for the component’s
      lifetime.
    </>,
  ],
  [
    '.isOpen',
    'boolean',
    undefined,
    'Whether the menu is currently open (false while no root is attached to the handle).',
  ],
  [
    '.open(triggerId)',
    '(triggerId: string) => void',
    undefined,
    'Opens the menu at the trigger with this id (in an event handler or an effect).',
  ],
  ['.close()', '() => void', undefined, 'Closes the menu.'],
];
