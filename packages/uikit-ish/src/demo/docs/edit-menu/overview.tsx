import '../sheet/style.css';
import './style.css';

import { FunctionComponent, useMemo, useState } from 'react';

import {
  EditMenu,
  Menu,
  useSelectionAnchor,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePartControls } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import {
  editMenuItemRows,
  editMenuPositionerRows,
  editMenuRootRows,
} from './docs.js';

/** A note's text: selected, the actions above the selection. */
const LiveView: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [text, setText] = useState<HTMLElement | null>(null);
  const [selection, clearSelection] = useSelectionAnchor(text);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'EditMenu.Item': ['onClick'],
            'EditMenu.More': [],
            'EditMenu.Popup': [],
            'EditMenu.Portal': [],
            'EditMenu.Positioner': ['anchor'],
            'EditMenu.Root': ['onOpenChange', 'open'],
            'EditMenu.SubmenuRoot': [],
            'Menu.Item': ['onClick'],
            'Menu.Label': [],
            'Menu.Popup': [],
            'Menu.Positioner': [],
            'Viewport.Content': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('edit-menu-overview') },
  );

  return (
    <Component
      isInline
      baseUiId="menu"
      controls={[partControls]}
      id="edit-menu-overview"
      log={log}
      screen="centered"
      stage="phone"
      state={[partState]}
      title="Edit menu"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <EditMenu.Root
          {...partProps['EditMenu.Root']}
          open={selection !== null}
          onOpenChange={(isOpen: boolean) => {
            if (!isOpen) clearSelection();
          }}
        >
          <p
            ref={setText}
            className="edit-menu-demo-text"
          >
            Select some of this text: the edit menu shows above the selection,
            with its actions, more of them behind the chevron.
          </p>
          <EditMenu.Portal {...partProps['EditMenu.Portal']}>
            <EditMenu.Positioner
              {...partProps['EditMenu.Positioner']}
              anchor={selection ?? text}
            >
              <EditMenu.Popup {...partProps['EditMenu.Popup']}>
                <EditMenu.Item
                  {...partProps['EditMenu.Item']}
                  onClick={() => addLog('Cut clicked')}
                >
                  Cut
                </EditMenu.Item>
                <EditMenu.Item
                  {...partProps['EditMenu.Item']}
                  onClick={() => addLog('Copy clicked')}
                >
                  Copy
                </EditMenu.Item>
                <EditMenu.Item
                  {...partProps['EditMenu.Item']}
                  onClick={() => addLog('Paste clicked')}
                >
                  Paste
                </EditMenu.Item>
                <EditMenu.SubmenuRoot {...partProps['EditMenu.SubmenuRoot']}>
                  <EditMenu.More {...partProps['EditMenu.More']} />
                  <EditMenu.Portal {...partProps['EditMenu.Portal']}>
                    <Menu.Positioner {...partProps['Menu.Positioner']}>
                      <Menu.Popup {...partProps['Menu.Popup']}>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Look Up clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Look Up
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Translate clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Translate
                          </Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </EditMenu.Portal>
                </EditMenu.SubmenuRoot>
              </EditMenu.Popup>
            </EditMenu.Positioner>
          </EditMenu.Portal>
        </EditMenu.Root>
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

/** `/edit-menu`: what an edit menu is for, and its props. */
export const EditMenuOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Actions on a selection (Cut, Copy, Paste and so on) in a horizontal
        glass capsule above it.
      </li>
      <li>
        The app opens it at an anchor: the selection (
        <PartLink
          component="edit-menu"
          part="useSelectionAnchor"
        />
        ), or an element.
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
        For actions on selected text: the standard editing ones, and the app’s
        own (Look Up, Translate, Share).
      </li>
      <li>
        For a few actions on an element someone picked (an image: Copy, Share).
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
        Actions on an item of content, with a preview: use a{' '}
        <a href={publicUrl('contextual-menu')}>Contextual Menu</a>.
      </li>
      <li>
        Actions behind a control: use a <a href={publicUrl('menu')}>Menu</a>.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most edit menus set.</li>
      <li>
        All props of all parts are on the{' '}
        <a href={publicUrl('edit-menu/parts')}>Parts</a> page.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        ['EditMenu.Root', pickRows(editMenuRootRows, 'open', 'onOpenChange')],
        [
          'EditMenu.Positioner',
          pickRows(editMenuPositionerRows, 'anchor', 'side'),
        ],
        ['EditMenu.Item', pickRows(editMenuItemRows, 'onClick', 'destructive')],
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
        The capsule has the <code>menu</code> role, and its actions are{' '}
        <code>menuitem</code>s. The left and right arrow keys move between them,
        and Escape closes it.
      </li>
      <li>
        The “more” button is named “More” (<code>aria-label</code>).
      </li>
      <li>
        It opens without a trigger, so keyboard users need another way to the
        same actions (for example shortcuts).
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
        It sits above its anchor, 8px away (or below it, without room). It isn’t
        modal, so a press outside reaches the page (for example clearing the
        selection) as it closes the menu.
      </li>
      <li>
        When there are too many actions for its width, they scroll, faded at the
        ends, and come to rest on an action, with a peek of those beyond. A
        swipe pans them. A held touch, then dragged, highlights the action under
        the finger, and lifting chooses it.
      </li>
      <li>
        It keeps the selection while it has focus, and closes once its anchor
        scrolls out of view.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const editMenuOverviewDemos = [LiveView];
