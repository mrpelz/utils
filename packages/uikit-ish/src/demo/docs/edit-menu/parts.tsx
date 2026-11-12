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
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
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
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="EditMenu.Root"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'EditMenu.Portal (others)': [],
            'EditMenu.Item': ['onClick'],
            'EditMenu.More': [],
            'EditMenu.Popup': [],
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
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="EditMenu.Portal"
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
          <EditMenu.Portal {...props}>
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
                  <EditMenu.Portal {...partProps['EditMenu.Portal (others)']}>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'EditMenu.Item': ['onClick'],
            'EditMenu.More': [],
            'EditMenu.Popup': [],
            'EditMenu.Portal': [],
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
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="EditMenu.Positioner"
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
              anchor={selection ?? text}
              {...props}
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'EditMenu.Item': ['onClick'],
            'EditMenu.More': [],
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
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="EditMenu.Popup"
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
              <EditMenu.Popup {...props}>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'EditMenu.Item (others)': ['onClick'],
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
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="EditMenu.Item"
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
                <EditMenu.Item {...props}>Cut</EditMenu.Item>
                <EditMenu.Item
                  {...partProps['EditMenu.Item (others)']}
                  onClick={() => addLog('Copy clicked')}
                >
                  Copy
                </EditMenu.Item>
                <EditMenu.Item
                  {...partProps['EditMenu.Item (others)']}
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
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="EditMenu.SubmenuRoot"
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
                <EditMenu.SubmenuRoot {...props}>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'EditMenu.Item': ['onClick'],
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
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="EditMenu.More"
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
                  <EditMenu.More {...props} />
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

/** `useSelectionAnchor`: the selection as the anchor. */
const UseSelectionAnchorPart: FunctionComponent = () => {
  const id = 'edit-menu-parts-use-selection-anchor';
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
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      baseUiId="menu"
      controls={[partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[partState]}
      title="useSelectionAnchor"
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

/** `/edit-menu/parts`: a capsule of actions at a selection. */
export const EditMenuParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        A <a href={publicUrl('menu')}>Menu</a> in a horizontal glass capsule,
        opened by the app at an anchor (a selection), without a trigger.
      </li>
      <li>
        Its own parts are the root, the positioner, the capsule, its actions and
        the “more” button. The “more” submenu is a Menu’s positioner and popup.
      </li>
      <li>
        There are no handles, because there’s no trigger to open it at (the app
        opens it with <code>open</code>).
      </li>
    </ul>
    <ul className="demo-tree">
      <li>
        <PartLink
          component="edit-menu"
          part="EditMenu.Root"
        />
        <ul>
          <li className="demo-tree-context">
            <span>the content its actions are about (for example text)</span>
          </li>
          <li>
            <PartLink
              component="edit-menu"
              part="EditMenu.Portal"
            />
            <ul>
              <li>
                <PartLink
                  component="edit-menu"
                  part="EditMenu.Positioner"
                />
                <ul>
                  <li>
                    <PartLink
                      component="edit-menu"
                      part="EditMenu.Popup"
                    />
                    <ul>
                      <li>
                        <PartLink
                          component="edit-menu"
                          part="EditMenu.Item"
                        />
                      </li>
                      <li>
                        <PartLink
                          component="edit-menu"
                          part="EditMenu.SubmenuRoot"
                        />{' '}
                        (optional)
                        <ul>
                          <li>
                            <PartLink
                              component="edit-menu"
                              part="EditMenu.More"
                            />
                          </li>
                          <li>
                            <PartLink
                              component="edit-menu"
                              part="EditMenu.Portal"
                            />
                            <ul>
                              <li className="demo-tree-context">
                                <PartLink
                                  component="menu"
                                  part="Menu.Positioner"
                                />{' '}
                                <span>→</span>{' '}
                                <PartLink
                                  component="menu"
                                  part="Menu.Popup"
                                />{' '}
                                <span>→</span>{' '}
                                <PartLink
                                  component="menu"
                                  part="Menu.Item"
                                />
                                <span>s</span>
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
        </ul>
      </li>
      <li>
        <PartLink
          component="edit-menu"
          part="useSelectionAnchor"
        />{' '}
        (a hook: the selection as an anchor)
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
        Holds the menu’s state. The app opens it (<code>open</code>), for
        example while there’s a selection. An action, a press outside or Escape
        closes it (<code>onOpenChange</code>).
      </li>
      <li>
        It isn’t modal by default. The page stays interactive, and a press
        outside reaches it (for example clearing the selection).
      </li>
      <li>
        Its actions sit in a row (<code>orientation</code>), and the left and
        right arrow keys move between them.
      </li>
      <li>
        Renders no element. Base UI’s positioning needs a trigger, so it renders
        a hidden, inert one.
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
        A <a href={publicUrl('menu')}>Menu</a>’s portal (
        <PartLink
          component="menu"
          part="Menu.Portal"
        />
        ): into <code>document.body</code>, or its <code>container</code>,
        without a box of its own.
      </li>
      <li>It also goes around the “more” submenu.</li>
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
        away, or below it without room.
      </li>
      <li>
        It’s never wider than its collision boundary. When that’s too narrow for
        its actions, they scroll in the capsule.
      </li>
      <li>It closes the menu once its anchor scrolls out of view.</li>
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
        The capsule: glass, 42px tall, with its actions starting 20px in and the
        “more” button at its end.
      </li>
      <li>
        When there are too many actions, they scroll. A swipe pans them, and
        they keep going when flung. A held touch, then dragged, highlights the
        one under the finger, and holding it near an end keeps scrolling.
        They’re faded at the ends where there are more, and come to rest on an
        action, with a peek of those beyond each end.
      </li>
      <li>
        It keeps the selection while it has focus (WebKit would clear it).
      </li>
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
        An action: its label (14px), with a divider before it (except the
        first). The dividers next to the highlighted action are hidden.
      </li>
      <li>
        Its look: <code>destructive</code> and <code>disabled</code>.
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
        , whose submenu is a regular menu below the capsule.
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
        The “more” button: a 34px circle with a chevron, named “More”. It opens
        the submenu, on hover too.
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
        <code>anchor</code>, once it’s made: when the pointer is released, or
        after a pause (keyboard, touch).
      </li>
      <li>
        Changes that keep the range (for example when it’s restored after the
        menu took focus) are ignored. Presses that don’t change it (for example
        outside the text) only clear it.
      </li>
      <li>
        Returns the anchor (null while there’s none) and a function that clears
        it (for example as the menu closes).
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
