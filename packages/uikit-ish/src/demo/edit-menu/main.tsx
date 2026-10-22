import './style.css';

import { FunctionComponent, useMemo, useState } from 'react';

import { EditMenu, Menu, useSelectionAnchor } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import {
  propOptionsPopup as propOptionsMenuPopup,
  propOptionsPositioner as propOptionsMenuPositioner,
} from '../menu/props.js';
import {
  getPropOptionsItems,
  getPropOptionsRoot,
  propOptionsMore,
  propOptionsPopup,
  propOptionsPositioner,
} from './props.js';

/**
 * An edit menu (UIKit `UIEditMenuInteraction`): opened above a text
 * selection (`useSelectionAnchor`), its actions in a glass capsule, more
 * of them behind the chevron (`EditMenu.More`, a submenu).
 */
export const EditMenuDemo: FunctionComponent = () => {
  const id = 'edit-menu';

  const [log, addLog] = useLog();
  const [
    externalRoot,
    externalPositioner,
    externalPopup,
    externalItem,
    externalMore,
    externalSubmenuPositioner,
    externalSubmenuPopup,
  ] = useProvidedState(id);

  const [text, setText] = useState<HTMLElement | null>(null);
  const [selection, clearSelection] = useSelectionAnchor(text);

  const [controlRoot, propsRoot, stateRoot, elementKey] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    'root',
    externalRoot,
    true,
  );
  const [controlPositioner, propsPositioner, statePositioner] = usePropControl(
    propOptionsPositioner,
    'positioner',
    externalPositioner,
  );
  const [controlPopup, propsPopup, statePopup] = usePropControl(
    propOptionsPopup,
    'popup',
    externalPopup,
  );
  const [controlItem, propsItem, stateItem] = usePropControl(
    useMemo(() => getPropOptionsItems(addLog), [addLog]),
    'item (1st)',
    externalItem,
  );
  const [controlMore, propsMore, stateMore] = usePropControl(
    propOptionsMore,
    'more',
    externalMore,
  );
  const [
    controlSubmenuPositioner,
    propsSubmenuPositioner,
    stateSubmenuPositioner,
  ] = usePropControl(
    propOptionsMenuPositioner,
    'more positioner',
    externalSubmenuPositioner,
  );
  const [controlSubmenuPopup, propsSubmenuPopup, stateSubmenuPopup] =
    usePropControl(propOptionsMenuPopup, 'more popup', externalSubmenuPopup);

  const { onOpenChange, open, ...rootProps } = propsRoot;

  return (
    <Component
      center
      baseUiId="menu"
      id={id}
      log={log}
      title="Edit Menu"
      controls={[
        controlRoot,
        controlPositioner,
        controlPopup,
        controlItem,
        controlMore,
        controlSubmenuPositioner,
        controlSubmenuPopup,
      ]}
      state={[
        stateRoot,
        statePositioner,
        statePopup,
        stateItem,
        stateMore,
        stateSubmenuPositioner,
        stateSubmenuPopup,
      ]}
    >
      <EditMenu.Root
        key={elementKey}
        {...rootProps}
        open={open ?? selection !== null}
        onOpenChange={(
          ...args: Parameters<NonNullable<typeof onOpenChange>>
        ) => {
          onOpenChange?.(...args);
          if (!args[0]) clearSelection();
        }}
      >
        <p
          ref={setText}
          className="edit-menu-demo-text"
        >
          Select some of this text to show the edit menu above the selection. It
          holds the actions for the selection, and more of them behind the
          chevron.
        </p>
        <EditMenu.Portal>
          <EditMenu.Positioner
            anchor={selection ?? text}
            {...propsPositioner}
          >
            <EditMenu.Popup {...propsPopup}>
              <EditMenu.Item {...propsItem}>Cut</EditMenu.Item>
              <EditMenu.Item onClick={() => addLog('Copy clicked')}>
                Copy
              </EditMenu.Item>
              <EditMenu.Item onClick={() => addLog('Paste clicked')}>
                Paste
              </EditMenu.Item>
              <EditMenu.Item
                destructive
                onClick={() => addLog('Delete clicked')}
              >
                Delete
              </EditMenu.Item>
              <EditMenu.Item onClick={() => addLog('Replace… clicked')}>
                Replace…
              </EditMenu.Item>
              <EditMenu.Item onClick={() => addLog('AutoFill clicked')}>
                AutoFill
              </EditMenu.Item>
              <EditMenu.SubmenuRoot>
                <EditMenu.More {...propsMore} />
                <EditMenu.Portal>
                  <Menu.Positioner {...propsSubmenuPositioner}>
                    <Menu.Popup {...propsSubmenuPopup}>
                      <Menu.Item onClick={() => addLog('Look Up clicked')}>
                        <Menu.Label>Look Up</Menu.Label>
                      </Menu.Item>
                      <Menu.Item onClick={() => addLog('Translate clicked')}>
                        <Menu.Label>Translate</Menu.Label>
                      </Menu.Item>
                      <Menu.Item onClick={() => addLog('Share… clicked')}>
                        <Menu.Label>Share…</Menu.Label>
                      </Menu.Item>
                    </Menu.Popup>
                  </Menu.Positioner>
                </EditMenu.Portal>
              </EditMenu.SubmenuRoot>
            </EditMenu.Popup>
          </EditMenu.Positioner>
        </EditMenu.Portal>
      </EditMenu.Root>
    </Component>
  );
};
