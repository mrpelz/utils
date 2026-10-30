import '../sheet/style.css';
import './style.css';

import { FunctionComponent, useState } from 'react';

import {
  EditMenu,
  Menu,
  useSelectionAnchor,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
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

  return (
    <Component
      isInline
      baseUiId="menu"
      id="edit-menu-overview"
      log={log}
      screen="centered"
      stage="phone"
      title="Edit menu"
    >
      <Viewport.Content>
        <EditMenu.Root
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
          <EditMenu.Portal>
            <EditMenu.Positioner anchor={selection ?? text}>
              <EditMenu.Popup>
                <EditMenu.Item onClick={() => addLog('Cut clicked')}>
                  Cut
                </EditMenu.Item>
                <EditMenu.Item onClick={() => addLog('Copy clicked')}>
                  Copy
                </EditMenu.Item>
                <EditMenu.Item onClick={() => addLog('Paste clicked')}>
                  Paste
                </EditMenu.Item>
                <EditMenu.SubmenuRoot>
                  <EditMenu.More />
                  <EditMenu.Portal>
                    <Menu.Positioner>
                      <Menu.Popup>
                        <Menu.Item onClick={() => addLog('Look Up clicked')}>
                          <Menu.Label>Look Up</Menu.Label>
                        </Menu.Item>
                        <Menu.Item onClick={() => addLog('Translate clicked')}>
                          <Menu.Label>Translate</Menu.Label>
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
        Actions on a selection (Cut, Copy, Paste, …) in a horizontal glass
        capsule above it.
      </li>
      <li>
        Opened by the app at an anchor: the selection (
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
        Actions on selected text: the standard editing ones, and the app’s own
        (Look Up, Translate, Share).
      </li>
      <li>
        A few actions on an element the person picked (an image: Copy, Share).
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
        Actions on an item of content, with a preview: a{' '}
        <a href="contextual-menu">Contextual menu</a>.
      </li>
      <li>
        Actions behind a control: a <a href="menu">Menu</a>.
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
        All parts’ props: <a href="edit-menu/parts">Parts</a>.
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
        The capsule has the <code>menu</code> role, its actions{' '}
        <code>menuitem</code>; the arrow keys left and right move between them,
        Escape closes it.
      </li>
      <li>
        The “more” button is named “More” (<code>aria-label</code>).
      </li>
      <li>
        Opened without a trigger: keyboard users need another way to the same
        actions (e.g. shortcuts).
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
        Above its anchor, 8px away (below if there’s no room); not modal: a
        press outside reaches the page (e.g. clearing the selection) as it
        closes the menu.
      </li>
      <li>
        Too many actions for its width: they scroll, faded at the ends; touch
        drags highlight the action under the finger, lifting chooses it.
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
