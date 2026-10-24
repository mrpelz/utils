import '../sheet/style.css';
import './style.css';

import { sfEllipsis } from '@bradleyhodges/sfsymbols/sfEllipsis';
import { sfFolder } from '@bradleyhodges/sfsymbols/sfFolder';
import { sfHeart } from '@bradleyhodges/sfsymbols/sfHeart';
import { sfPencil } from '@bradleyhodges/sfsymbols/sfPencil';
import { sfSquareAndArrowUp } from '@bradleyhodges/sfsymbols/sfSquareAndArrowUp';
import { sfTrash } from '@bradleyhodges/sfsymbols/sfTrash';
import { FunctionComponent } from 'react';

import { Button, Menu, Symbol, useSizeClass } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useLabelledRef } from '../frame/render-code.js';
import { useProvidedState } from '../frame/state.js';
import { KeyPropsTable, pickRows } from '../guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../guide/sections.js';
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
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const sizeClass = useSizeClass();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsOverviewRoot, {
    external,
    open: true,
    title: 'Menu.Root',
  });

  return (
    <Component
      center
      expanded
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Menu"
    >
      {/* Its frame by the size: a phone's (compact), an iPad's (regular). */}
      <div
        ref={screen}
        className={
          (props.size ?? sizeClass) === 'regular'
            ? 'demo-tablet demo-centered demo-wallpaper'
            : 'demo-phone demo-centered demo-wallpaper'
        }
      >
        <Menu.Root size={props.size ?? sizeClass}>
          <Menu.Trigger
            aria-label="More"
            render={
              <Button.Root
                shape="circle"
                size="large"
                variant="glass"
              />
            }
          >
            <Button.Icon>
              <Symbol icon={sfEllipsis} />
            </Button.Icon>
          </Menu.Trigger>
          <Menu.Portal container={screen}>
            <Menu.Positioner>
              <Menu.Popup>
                <Menu.QuickActions>
                  <Menu.QuickAction onClick={() => addLog('Share clicked')}>
                    <Menu.Icon>
                      <Symbol icon={sfSquareAndArrowUp} />
                    </Menu.Icon>
                    <Menu.Label>Share</Menu.Label>
                  </Menu.QuickAction>
                  <Menu.QuickAction onClick={() => addLog('Favorite clicked')}>
                    <Menu.Icon>
                      <Symbol icon={sfHeart} />
                    </Menu.Icon>
                    <Menu.Label>Favorite</Menu.Label>
                  </Menu.QuickAction>
                </Menu.QuickActions>
                <Menu.Item onClick={() => addLog('Rename clicked')}>
                  <Menu.Icon>
                    <Symbol icon={sfPencil} />
                  </Menu.Icon>
                  <Menu.Label>Rename</Menu.Label>
                </Menu.Item>
                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger>
                    <Menu.Icon>
                      <Symbol icon={sfFolder} />
                    </Menu.Icon>
                    <Menu.Label>Move to</Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal container={screen}>
                    <Menu.Positioner>
                      <Menu.Popup>
                        <Menu.Item onClick={() => addLog('Documents clicked')}>
                          <Menu.Label>Documents</Menu.Label>
                        </Menu.Item>
                        <Menu.Item onClick={() => addLog('Downloads clicked')}>
                          <Menu.Label>Downloads</Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.Separator />
                <Menu.Item
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <Menu.Icon>
                    <Symbol icon={sfTrash} />
                  </Menu.Icon>
                  <Menu.Label>Delete</Menu.Label>
                </Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </div>
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
        Actions and choices behind a control, in a glass popup at it (UIKit{' '}
        <code>UIMenu</code>; Base UI’s <code>Menu</code>).
      </li>
      <li>
        The iPhone’s menu or the iPad’s (<code>size</code>): its items’ size,
        where its submenus open.
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
        A control’s secondary actions, out of the way: a toolbar’s “More” button
        (Notes, Files).
      </li>
      <li>
        A choice among a few options, shown on its button (a pop-up button: sort
        by, filter).
      </li>
      <li>
        A history or alternatives on a held press (
        <code>openOn=&quot;secondaryClick&quot;</code>: a back button’s pages).
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
        Actions on a piece of content, summoned from it: a{' '}
        <a href="contextual-menu">Contextual menu</a>.
      </li>
      <li>
        Actions on selected text: an <a href="edit-menu">Edit menu</a>.
      </li>
      <li>
        Choices about an action the person just started (Delete, or not): an{' '}
        <a href="action-sheet">Action sheet</a>.
      </li>
      <li>
        A few settings, or a small task: a <a href="popover">Popover</a>.
      </li>
      <li>
        A choice always visible: a <a href="segmented">Segmented</a> control.
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
        All parts’ props: <a href="menu/parts">Parts</a>.
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
        The popup has the <code>menu</code> role, its items{' '}
        <code>menuitem</code>, <code>menuitemcheckbox</code> and{' '}
        <code>menuitemradio</code>; the trigger tells it opens one.
      </li>
      <li>
        A symbol-only trigger needs a name (<code>aria-label</code>, “More”).
      </li>
      <li>
        Keyboard: Enter or Space opens it, the arrow keys move between items
        (and into submenus), typing jumps to an item (its <code>label</code>),
        Escape closes it, focus returning to the trigger.
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
        On touch, it opens as the finger goes down: dragging on to an item and
        lifting chooses it (as iOS’).
      </li>
      <li>
        Compact: 40px items, submenus over their trigger; regular: 36px items,
        submenus beside it (see{' '}
        <PartLink
          component="menu"
          part="Menu.SubmenuRoot"
        />
        ).
      </li>
      <li>
        With toggles, every item keeps a column for the checkmark; a popup
        taller than the room for it scrolls.
      </li>
      <li>It closes once its trigger scrolls out of view.</li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const menuOverviewDemos = [LiveView];
