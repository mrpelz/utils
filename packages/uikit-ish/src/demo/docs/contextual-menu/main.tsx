import '../sheet/style.css';
import './style.css';

import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  ContextualMenu,
  Symbol,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { sfPhoto, sfSquareAndArrowUp, sfTrash } from '../../tooling/icons.js';
import {
  getPropOptionsItem as getPropOptionsMenuItem,
  propOptionsItemDestructive as propOptionsMenuItemDestructive,
  propOptionsPopup as propOptionsMenuPopup,
} from '../menu/props.js';
import {
  getPropOptionsRoot,
  propOptionsContent,
  propOptionsPositioner,
  propOptionsPreview,
  propOptionsTrigger,
} from './props.js';

/**
 * A contextual menu: opening, the
 * trigger turns into a preview of the photo the menu acts on, the menu
 * below it (shifted as far as they need to fit).
 */
export const ContextualMenuDemo: FunctionComponent = () => {
  const id = 'contextual-menu';

  const [log, addLog] = useLog();
  const [
    externalContent,
    externalRoot,
    externalTrigger,
    externalPreview,
    externalPositioner,
    externalPopup,
    externalItem,
    externalDestructiveItem,
  ] = useProvidedState(id);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  const [controlRoot, propsRoot, stateRoot, elementKey] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external: externalRoot, isOpen: true, title: 'root' },
  );
  const [controlTrigger, propsTrigger, stateTrigger] = usePropControl(
    propOptionsTrigger,
    { external: externalTrigger, title: 'trigger' },
  );
  const [controlPreview, propsPreview, statePreview] = usePropControl(
    propOptionsPreview,
    { external: externalPreview, title: 'preview' },
  );
  const [controlPositioner, propsPositioner, statePositioner] = usePropControl(
    propOptionsPositioner,
    { external: externalPositioner, title: 'positioner' },
  );
  const [controlPopup, propsPopup, statePopup] = usePropControl(
    propOptionsMenuPopup,
    { external: externalPopup, title: 'popup' },
  );
  const [controlItem, propsItem, stateItem] = usePropControl(
    useMemo(() => getPropOptionsMenuItem(addLog), [addLog]),
    { external: externalItem, title: 'item (share)' },
  );
  const [controlDestructiveItem, propsDestructiveItem, stateDestructiveItem] =
    usePropControl(propOptionsMenuItemDestructive, {
      external: externalDestructiveItem,
      title: 'item (delete)',
    });

  return (
    <Component
      hasWallpaper
      baseUiId="menu"
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      title="Contextual Menu"
      controls={[
        controlContent,
        controlRoot,
        controlTrigger,
        controlPreview,
        controlPositioner,
        controlPopup,
        controlItem,
        controlDestructiveItem,
      ]}
      state={[
        stateContent,
        stateRoot,
        stateTrigger,
        statePreview,
        statePositioner,
        statePopup,
        stateItem,
        stateDestructiveItem,
      ]}
    >
      <Viewport.Content>
        <ContextualMenu.Root
          key={elementKey}
          {...propsRoot}
        >
          <ContextualMenu.Trigger
            {...propsTrigger}
            render={<Button.Root variant="bordered" />}
          >
            <Button.Icon>
              <Symbol icon={sfPhoto} />
            </Button.Icon>
            <Button.Label>Photo</Button.Label>
          </ContextualMenu.Trigger>
          {content.preview ? (
            <ContextualMenu.Preview {...propsPreview}>
              <div
                aria-label="Photo"
                className="contextual-menu-demo-photo"
              >
                <Symbol icon={sfPhoto} />
              </div>
            </ContextualMenu.Preview>
          ) : null}
          <ContextualMenu.Portal>
            {content.backdrop ? <ContextualMenu.Backdrop /> : null}
            <ContextualMenu.Positioner {...propsPositioner}>
              <ContextualMenu.Popup {...propsPopup}>
                <ContextualMenu.Item {...propsItem}>
                  <ContextualMenu.Label>Share</ContextualMenu.Label>
                  <ContextualMenu.Icon>
                    <Symbol icon={sfSquareAndArrowUp} />
                  </ContextualMenu.Icon>
                </ContextualMenu.Item>
                <ContextualMenu.Item onClick={() => addLog('Copy clicked')}>
                  <ContextualMenu.Label>Copy</ContextualMenu.Label>
                </ContextualMenu.Item>
                <ContextualMenu.Separator />
                <ContextualMenu.Item
                  {...propsDestructiveItem}
                  onClick={() => addLog('Delete clicked')}
                >
                  <ContextualMenu.Label>Delete</ContextualMenu.Label>
                  <ContextualMenu.Icon>
                    <Symbol icon={sfTrash} />
                  </ContextualMenu.Icon>
                </ContextualMenu.Item>
              </ContextualMenu.Popup>
            </ContextualMenu.Positioner>
          </ContextualMenu.Portal>
        </ContextualMenu.Root>
      </Viewport.Content>
    </Component>
  );
};
