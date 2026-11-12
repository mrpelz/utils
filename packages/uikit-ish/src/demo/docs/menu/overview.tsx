import '../sheet/style.css';
import './style.css';

import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  Menu,
  Symbol,
  useSizeClass,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import {
  sfEllipsis,
  sfFolder,
  sfHeart,
  sfPencil,
  sfSquareAndArrowUp,
  sfTrash,
} from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import {
  menuItemRows,
  menuPositionerRows,
  menuRootRows,
  menuTriggerRows,
} from './docs.js';
import { propOptionsOverviewRoot } from './props.js';

/** A file's actions behind a “More” button, sized by the window. */
const LiveView: FunctionComponent = () => {
  const id = 'menu-overview';
  const [log, addLog] = useLog();
  const sizeClass = useSizeClass();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsOverviewRoot, {
    external,
    isOpen: true,
    title: 'Menu.Root',
  });

  // Its device by the size: a phone (compact), a tablet (regular).
  const stage = (props.size ?? sizeClass) === 'regular' ? 'tablet' : 'phone';

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Root': ['shape', 'size', 'variant'],
            'Menu.Icon': [],
            'Menu.Item': ['destructive', 'onClick'],
            'Menu.Label': [],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': [],
            'Menu.QuickAction': ['onClick'],
            'Menu.QuickActions': [],
            'Menu.Root': ['size'],
            'Menu.Separator': [],
            'Menu.SubmenuRoot': [],
            'Menu.SubmenuTrigger': [],
            'Menu.Trigger': ['aria-label', 'render'],
            'Viewport.Content': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasWallpaper
      isExpanded
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage={stage}
      state={[state, partState]}
      title="Menu"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Menu.Root
          {...partProps['Menu.Root']}
          size={props.size ?? sizeClass}
        >
          <Menu.Trigger
            {...partProps['Menu.Trigger']}
            aria-label="More"
            render={
              <Button.Root
                {...partProps['Button.Root']}
                shape="circle"
                size="large"
                variant="glass"
              />
            }
          >
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfEllipsis}
              />
            </Button.Icon>
          </Menu.Trigger>
          <Menu.Portal {...partProps['Menu.Portal']}>
            <Menu.Positioner {...partProps['Menu.Positioner']}>
              <Menu.Popup {...partProps['Menu.Popup']}>
                <Menu.QuickActions {...partProps['Menu.QuickActions']}>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Share clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquareAndArrowUp}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>Share</Menu.Label>
                  </Menu.QuickAction>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Favorite clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfHeart}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Favorite
                    </Menu.Label>
                  </Menu.QuickAction>
                </Menu.QuickActions>
                <Menu.Item
                  {...partProps['Menu.Item']}
                  onClick={() => addLog('Rename clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPencil}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Rename</Menu.Label>
                </Menu.Item>
                <Menu.SubmenuRoot {...partProps['Menu.SubmenuRoot']}>
                  <Menu.SubmenuTrigger {...partProps['Menu.SubmenuTrigger']}>
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfFolder}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Move to
                    </Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal {...partProps['Menu.Portal']}>
                    <Menu.Positioner {...partProps['Menu.Positioner']}>
                      <Menu.Popup {...partProps['Menu.Popup']}>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Documents clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Documents
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Downloads clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Downloads
                          </Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Item
                  {...partProps['Menu.Item']}
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrash}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Delete</Menu.Label>
                </Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </Viewport.Content>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['when-to-use-it', 'When to use it'],
  ['when-to-use-something-else', 'When to use something else'],
  ['key-props', 'Key props'],
  ['accessibility', 'Accessibility'],
  ['behavior', 'Behavior'],
];

/** `/menu`: what a menu is for, and its props. */
export const MenuOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Actions and choices behind a control, in a glass popup at that control.
        It’s Base UI’s <code>Menu</code>.
      </li>
      <li>
        It comes as a phone’s menu or a tablet’s (<code>size</code>), which sets
        its items’ size and where its submenus open.
      </li>
    </ul>
    <LiveView />

    <Heading
      id="when-to-use-it"
      level={2}
    >
      When to use it
    </Heading>
    <ul>
      <li>
        For a control’s secondary actions, kept out of the way, such as behind a
        toolbar’s “More” button.
      </li>
      <li>
        For a choice among a few options, shown on its button (a pop-up button
        for sorting or filtering).
      </li>
      <li>
        For a history or alternatives on a held press (
        <code>openOn=&quot;secondaryClick&quot;</code>), such as a back button’s
        pages.
      </li>
    </ul>

    <Heading
      id="when-to-use-something-else"
      level={2}
    >
      When to use something else
    </Heading>
    <ul>
      <li>
        Actions on a piece of content, summoned from it: use a{' '}
        <a href={publicUrl('contextual-menu')}>Contextual Menu</a>.
      </li>
      <li>
        Actions on selected text: use an{' '}
        <a href={publicUrl('edit-menu')}>Edit Menu</a>.
      </li>
      <li>
        Choices about an action someone just started (Delete, or not): use an{' '}
        <a href={publicUrl('action-sheet')}>Action Sheet</a>.
      </li>
      <li>
        A few settings, or a small task: use a{' '}
        <a href={publicUrl('popover')}>Popover</a>.
      </li>
      <li>
        A choice that’s always visible: use a{' '}
        <a href={publicUrl('segmented')}>Segmented</a> control.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most menus set.</li>
      <li>
        All props of all parts are on the{' '}
        <a href={publicUrl('menu/parts')}>Parts</a> page.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        ['Menu.Root', pickRows(menuRootRows, 'size', 'onOpenChange')],
        ['Menu.Trigger', pickRows(menuTriggerRows, 'openOn', 'render')],
        ['Menu.Positioner', pickRows(menuPositionerRows, 'side', 'align')],
        [
          'Menu.Item',
          pickRows(menuItemRows, 'onClick', 'destructive', 'disabled'),
        ],
      ]}
    />

    <Heading
      id="accessibility"
      level={2}
    >
      Accessibility
    </Heading>
    <ul>
      <li>
        The popup has the <code>menu</code> role, and its items are{' '}
        <code>menuitem</code>, <code>menuitemcheckbox</code> and{' '}
        <code>menuitemradio</code>. The trigger says that it opens a menu.
      </li>
      <li>
        A symbol-only trigger needs a name (<code>aria-label</code>, for example
        “More”).
      </li>
      <li>
        Enter or Space opens it, the arrow keys move between items (and into
        submenus), and typing jumps to an item (by its <code>label</code>).
        Escape closes it, and focus returns to the trigger.
      </li>
      <li>
        Its scale-in doesn’t follow <code>prefers-reduced-motion</code>.
      </li>
    </ul>

    <Heading
      id="behavior"
      level={2}
    >
      Behavior
    </Heading>
    <ul>
      <li>
        On touch, it opens as the finger goes down, so dragging on to an item
        and lifting chooses it.
      </li>
      <li>
        Compact menus have 40px items, with submenus over their trigger. Regular
        ones have 36px items, with submenus next to it (see{' '}
        <PartLink
          component="menu"
          part="Menu.SubmenuRoot"
        />
        ).
      </li>
      <li>
        With toggles, every item keeps a column for the checkmark. A popup
        taller than the room next to its trigger grows over it (flipped if it
        fits on the other side, otherwise shifted). Only when it’s taller than
        the screen does it scroll. A compact submenu without room below its
        trigger covers it, and a press outside it closes only the submenu.
      </li>
      <li>It closes once its trigger scrolls out of view.</li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const menuOverviewDemos = [LiveView];
