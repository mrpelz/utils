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
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import {
  editMenuItemRows,
  editMenuMoreRows,
  editMenuPopupRows,
  editMenuPortalRows,
  editMenuPositionerRows,
  editMenuRootRows,
  editMenuSubmenuRootRows,
  useSelectionAnchorParameterRows,
  useSelectionAnchorRows,
} from './docs.js';
import {
  getPropOptionsGuideItem,
  getPropOptionsGuideSubmenuRoot,
  propOptionsGuideMore,
  propOptionsGuidePortal,
  propOptionsGuideRoot,
  propOptionsPopup,
  propOptionsPositioner,
} from './props.js';

/** `EditMenu.Root`, outlined, with its props. */
const RootPart: FunctionComponent = () => {
  const id = 'edit-menu-parts-root';
  const [log, addLog] = useLog();
  const [text, setText] = useState<HTMLElement | null>(null);
  const [selection, clearSelection] = useSelectionAnchor(text);
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuideRoot, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'EditMenu.Root',
  });

  return (
    <Component
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="EditMenu.Root"
    >
      <Viewport.Content>
        <EditMenu.Root
          {...props}
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

/** `EditMenu.Portal`, outlined, with its props. */
const PortalPart: FunctionComponent = () => {
  const id = 'edit-menu-parts-portal';
  const [log, addLog] = useLog();
  const [text, setText] = useState<HTMLElement | null>(null);
  const [selection, clearSelection] = useSelectionAnchor(text);
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuidePortal, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'EditMenu.Portal',
  });

  return (
    <Component
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="EditMenu.Portal"
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
          <EditMenu.Portal {...props}>
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

/** `EditMenu.Positioner`, outlined, with its props. */
const PositionerPart: FunctionComponent = () => {
  const id = 'edit-menu-parts-positioner';
  const [log, addLog] = useLog();
  const [text, setText] = useState<HTMLElement | null>(null);
  const [selection, clearSelection] = useSelectionAnchor(text);
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPositioner, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'EditMenu.Positioner',
  });

  return (
    <Component
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="EditMenu.Positioner"
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
            <EditMenu.Positioner
              anchor={selection ?? text}
              {...props}
            >
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

/** `EditMenu.Popup`, outlined, with its props. */
const PopupPart: FunctionComponent = () => {
  const id = 'edit-menu-parts-popup';
  const [log, addLog] = useLog();
  const [text, setText] = useState<HTMLElement | null>(null);
  const [selection, clearSelection] = useSelectionAnchor(text);
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPopup, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'EditMenu.Popup',
  });

  return (
    <Component
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="EditMenu.Popup"
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
              <EditMenu.Popup {...props}>
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

/** `EditMenu.Item`, outlined, with its props. */
const ItemPart: FunctionComponent = () => {
  const id = 'edit-menu-parts-item';
  const [log, addLog] = useLog();
  const [text, setText] = useState<HTMLElement | null>(null);
  const [selection, clearSelection] = useSelectionAnchor(text);
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsGuideItem(addLog), [addLog]),
    { external, isOpen: true, emphasize: 'outline', title: 'EditMenu.Item' },
  );

  return (
    <Component
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="EditMenu.Item"
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
                <EditMenu.Item {...props}>Cut</EditMenu.Item>
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

/** `EditMenu.SubmenuRoot`, outlined, with its props. */
const SubmenuRootPart: FunctionComponent = () => {
  const id = 'edit-menu-parts-submenu-root';
  const [log, addLog] = useLog();
  const [text, setText] = useState<HTMLElement | null>(null);
  const [selection, clearSelection] = useSelectionAnchor(text);
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsGuideSubmenuRoot(addLog), [addLog]),
    {
      external,
      isOpen: true,
      emphasize: 'outline',
      title: 'EditMenu.SubmenuRoot',
    },
  );

  return (
    <Component
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="EditMenu.SubmenuRoot"
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
                <EditMenu.SubmenuRoot {...props}>
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

/** `EditMenu.More`, outlined, with its props. */
const MorePart: FunctionComponent = () => {
  const id = 'edit-menu-parts-more';
  const [log, addLog] = useLog();
  const [text, setText] = useState<HTMLElement | null>(null);
  const [selection, clearSelection] = useSelectionAnchor(text);
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuideMore, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'EditMenu.More',
  });

  return (
    <Component
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="EditMenu.More"
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
                  <EditMenu.More {...props} />
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

/** `useSelectionAnchor`: the selection as the anchor. */
const UseSelectionAnchorPart: FunctionComponent = () => {
  const id = 'edit-menu-parts-use-selection-anchor';
  const [log, addLog] = useLog();
  const [text, setText] = useState<HTMLElement | null>(null);
  const [selection, clearSelection] = useSelectionAnchor(text);

  return (
    <Component
      isInline
      baseUiId="menu"
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      title="useSelectionAnchor"
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

/** `/edit-menu/parts`: a capsule of actions at a selection. */
export const EditMenuParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        A <a href="menu">Menu</a> in a horizontal glass capsule, opened by the
        app at an anchor (a selection): no trigger.
      </li>
      <li>
        Its own parts: the root, the positioner, the capsule, its actions and
        the “more” button; the “more” submenu is a Menu’s positioner and popup.
      </li>
      <li>
        No handles: there’s no trigger to open it at (the app opens it,
        <code>open</code>).
      </li>
    </ul>
    <ul>
      <li>
        <PartLink part="EditMenu.Root" />
        <ul>
          <li>the content its actions are about (e.g. text)</li>
          <li>
            <PartLink part="EditMenu.Portal" />
            <ul>
              <li>
                <PartLink part="EditMenu.Positioner" />
                <ul>
                  <li>
                    <PartLink part="EditMenu.Popup" />
                    <ul>
                      <li>
                        <PartLink part="EditMenu.Item" />
                      </li>
                      <li>
                        <PartLink part="EditMenu.SubmenuRoot" /> (optional)
                        <ul>
                          <li>
                            <PartLink part="EditMenu.More" />
                          </li>
                          <li>
                            <PartLink part="EditMenu.Portal" />:
                            <PartLink
                              component="menu"
                              part="Menu.Positioner"
                            />
                            ,
                            <PartLink
                              component="menu"
                              part="Menu.Popup"
                            />
                            ,
                            <PartLink
                              component="menu"
                              part="Menu.Item"
                            />
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        <PartLink part="useSelectionAnchor" />
      </li>
    </ul>

    <Heading
      id="editmenu-root"
      level={2}
    >
      <code>EditMenu.Root</code>
    </Heading>
    <ul>
      <li>
        The menu’s state: opened by the app (<code>open</code>), e.g. while
        there’s a selection; closed by an action, a press outside or Escape (
        <code>onOpenChange</code>).
      </li>
      <li>
        Not modal by default: the page stays interactive, a press outside
        reaching it (e.g. clearing the selection).
      </li>
      <li>
        Its actions in a row (<code>orientation</code>): the arrow keys left and
        right move between them.
      </li>
      <li>
        Renders no element (Base UI’s positioning needs a trigger: it renders a
        hidden, inert one).
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={editMenuRootRows} />

    <Heading
      id="editmenu-portal"
      level={2}
    >
      <code>EditMenu.Portal</code>
    </Heading>
    <ul>
      <li>
        A <a href="menu">Menu</a>’s portal (
        <PartLink
          component="menu"
          part="Menu.Portal"
        />
        ): into <code>document.body</code>, or its <code>container</code>,
        without a box of its own.
      </li>
      <li>Also around the “more” submenu.</li>
    </ul>
    <PortalPart />
    <h3>Props</h3>
    <PropsTable rows={editMenuPortalRows} />

    <Heading
      id="editmenu-positioner"
      level={2}
    >
      <code>EditMenu.Positioner</code>
    </Heading>
    <ul>
      <li>
        Places the capsule above its <code>anchor</code> (the selection), 8px
        away; below it if there’s no room.
      </li>
      <li>
        Never wider than its collision boundary: too narrow for its actions,
        they scroll in the capsule.
      </li>
      <li>Closes the menu once its anchor scrolls out of view.</li>
    </ul>
    <PositionerPart />
    <h3>Props</h3>
    <PropsTable rows={editMenuPositionerRows} />

    <Heading
      id="editmenu-popup"
      level={2}
    >
      <code>EditMenu.Popup</code>
    </Heading>
    <ul>
      <li>
        The capsule: glass, 42px high, its actions from 20px, the “more” button
        at its end.
      </li>
      <li>
        Too many actions: they scroll (touch drags highlight the one under the
        finger, held near an end scrolling on), faded at the ends with more
        beyond.
      </li>
      <li>Keeps the selection while it has focus (WebKit would clear it).</li>
    </ul>
    <PopupPart />
    <h3>Props</h3>
    <PropsTable rows={editMenuPopupRows} />

    <Heading
      id="editmenu-item"
      level={2}
    >
      <code>EditMenu.Item</code>
    </Heading>
    <ul>
      <li>
        An action: its label (14px), a divider before it (but the first), the
        dividers next to the highlighted action hidden.
      </li>
      <li>
        Look: <code>destructive</code>, <code>disabled</code>.
      </li>
    </ul>
    <ItemPart />
    <h3>Props</h3>
    <PropsTable rows={editMenuItemRows} />

    <Heading
      id="editmenu-submenuroot"
      level={2}
    >
      <code>EditMenu.SubmenuRoot</code>
    </Heading>
    <ul>
      <li>
        Further actions behind the “more” button: a{' '}
        <PartLink
          component="menu"
          part="Menu.SubmenuRoot"
        />
        , its submenu a regular menu below the capsule.
      </li>
    </ul>
    <SubmenuRootPart />
    <h3>Props</h3>
    <PropsTable rows={editMenuSubmenuRootRows} />

    <Heading
      id="editmenu-more"
      level={2}
    >
      <code>EditMenu.More</code>
    </Heading>
    <ul>
      <li>
        The “more” button: a 34px circle with a chevron, named “More”, opening
        the submenu (also on hover).
      </li>
    </ul>
    <MorePart />
    <h3>Props</h3>
    <PropsTable rows={editMenuMoreRows} />

    <Heading
      id="useselectionanchor"
      level={2}
    >
      <code>useSelectionAnchor</code>
    </Heading>
    <ul>
      <li>
        The text selection in an element, as the positioner’s{' '}
        <code>anchor</code>, once it’s made: the pointer released, or after a
        pause (keyboard, touch).
      </li>
      <li>
        Changes keeping the range (e.g. restored after the menu took focus) are
        ignored; presses not changing it (e.g. outside the text) only clear it.
      </li>
      <li>
        Returns the anchor (null while there’s none) and a function clearing it
        (e.g. as the menu closes).
      </li>
    </ul>
    <UseSelectionAnchorPart />
    <h3>Parameters</h3>
    <PropsTable rows={useSelectionAnchorParameterRows} />
    <h3>Returns</h3>
    <PropsTable rows={useSelectionAnchorRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const editMenuPartsDemos = [
  RootPart,
  PortalPart,
  PositionerPart,
  PopupPart,
  ItemPart,
  SubmenuRootPart,
  MorePart,
  UseSelectionAnchorPart,
];
