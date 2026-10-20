import './style.css';

import { sfPhoto } from '@bradleyhodges/sfsymbols/sfPhoto';
import { sfSquareAndArrowUp } from '@bradleyhodges/sfsymbols/sfSquareAndArrowUp';
import { sfTrash } from '@bradleyhodges/sfsymbols/sfTrash';
import { FunctionComponent, useMemo } from 'react';

import { Button, ContextualMenu, Symbol } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useCreateStateUrl, useProvidedState } from '../frame/state.js';
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
 * A contextual menu (UIKit `UIContextMenuInteraction`): opening, the
 * trigger lifts (as far as the menu needs to fit below it), turning into a
 * preview of the photo the menu acts on.
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
    '[content]',
    externalContent,
    true,
  );
  const [controlRoot, propsRoot, stateRoot, elementKey] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    'root',
    externalRoot,
    true,
  );
  const [controlTrigger, propsTrigger, stateTrigger] = usePropControl(
    propOptionsTrigger,
    'trigger',
    externalTrigger,
  );
  const [controlPreview, propsPreview, statePreview] = usePropControl(
    propOptionsPreview,
    'preview',
    externalPreview,
  );
  const [controlPositioner, propsPositioner, statePositioner] = usePropControl(
    propOptionsPositioner,
    'positioner',
    externalPositioner,
  );
  const [controlPopup, propsPopup, statePopup] = usePropControl(
    propOptionsMenuPopup,
    'popup',
    externalPopup,
  );
  const [controlItem, propsItem, stateItem] = usePropControl(
    useMemo(() => getPropOptionsMenuItem(addLog), [addLog]),
    'item (share)',
    externalItem,
  );
  const [controlDestructiveItem, propsDestructiveItem, stateDestructiveItem] =
    usePropControl(
      propOptionsMenuItemDestructive,
      'item (delete)',
      externalDestructiveItem,
    );

  return (
    <Component
      center
      baseUiId="menu"
      id={id}
      log={log}
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
      stateUrl={useCreateStateUrl(id, [
        stateContent,
        stateRoot,
        stateTrigger,
        statePreview,
        statePositioner,
        statePopup,
        stateItem,
        stateDestructiveItem,
      ])}
    >
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
    </Component>
  );
};
