import { sfPhoto } from '@bradleyhodges/sfsymbols/sfPhoto';
import { sfSquareAndArrowUp } from '@bradleyhodges/sfsymbols/sfSquareAndArrowUp';
import { sfTrash } from '@bradleyhodges/sfsymbols/sfTrash';
import { styled } from 'goober';
import { FunctionComponent, useMemo } from 'react';

import { Button, ContextualMenu } from '../../components/index.js';
import { buttonControlCount, useButtonDemo } from '../button/compose.js';
import {
  getPropOptionsRoot as getPropOptionsButtonRoot,
  propOptionsContent as propOptionsButtonContent,
} from '../button/props.js';
import {
  getPropOptionsItem as getPropOptionsMenuItem,
  propOptionsItemDestructive as propOptionsMenuItemDestructive,
  propOptionsPopup as propOptionsMenuPopup,
} from '../menu/props.js';
import { AddLog, useLog } from '../utils/log.js';
import {
  commonPropOptions,
  Component,
  MappedProp,
  usePropControl,
} from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { SFSymbol } from '../utils/symbol.js';
import {
  getPropOptionsRoot,
  propOptionsContent,
  propOptionsPositioner,
  propOptionsPreview,
  propOptionsTrigger,
} from './props.js';

// A photo (its own size, as an image's), what the menu acts on.
const Photo = styled('div')`
  display: grid;
  padding: 72px 96px;
  border-radius: 16px;
  background-image: linear-gradient(
    135deg,
    var(--color-ios-system-orange),
    var(--color-ios-system-pink)
  );
  color: #fff;
  font-size: 48px;
  place-items: center;
`;

// The trigger: a button (its demo's props), “Photo” with a photo symbol,
// bordered first; its clicks are the trigger's.
const triggerContent = {
  ...propOptionsButtonContent,
  label: ['Photo', 'Image', undefined] as const,
  symbol: [
    new MappedProp(<SFSymbol icon={sfPhoto} />, '[photo]'),
    undefined,
  ] as const,
};

const getTriggerRoot = (addLog: AddLog) => {
  const root = getPropOptionsButtonRoot(addLog);
  return {
    ...root,
    variant: [
      'bordered',
      'bordered-prominent',
      'bordered-secondary',
      'borderless',
      'glass',
      'glass-prominent',
    ] as const,
    onClick: [undefined, ...root.onClick.filter(Boolean)] as const,
  };
};

// The share item: the menu demo's item's props, its clicks logged as it.
const getShareItem = (addLog: AddLog) => ({
  ...getPropOptionsMenuItem(addLog),
  onClick: [
    new MappedProp(() => addLog('Share clicked'), '[log click]'),
    undefined,
  ] as const,
});

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
    ...externalComposed
  ] = useProvidedState(id);

  // Composed: the trigger's button, the menu's parts (their demos' props).
  const triggerButton = useButtonDemo(
    externalComposed.slice(0, buttonControlCount),
    {
      content: triggerContent,
      prefix: 'trigger button: ',
      root: useMemo(() => getTriggerRoot(addLog), [addLog]),
    },
  );
  const [
    externalPopup,
    externalItem,
    externalDestructiveItem,
    externalSeparator,
    externalIcon,
    externalLabel,
  ] = externalComposed.slice(buttonControlCount);
  const [controlPopup, propsPopup, statePopup] = usePropControl(
    propOptionsMenuPopup,
    'popup',
    externalPopup,
  );
  const [controlItem, propsItem, stateItem] = usePropControl(
    useMemo(() => getShareItem(addLog), [addLog]),
    'item (share)',
    externalItem,
  );
  const [controlDestructiveItem, propsDestructiveItem, stateDestructiveItem] =
    usePropControl(
      propOptionsMenuItemDestructive,
      'item (delete)',
      externalDestructiveItem,
    );
  const [controlSeparator, propsSeparator, stateSeparator] = usePropControl(
    commonPropOptions,
    'separator',
    externalSeparator,
  );
  const [controlIcon, propsIcon, stateIcon] = usePropControl(
    commonPropOptions,
    'icon',
    externalIcon,
  );
  const [controlLabel, propsLabel, stateLabel] = usePropControl(
    commonPropOptions,
    'label',
    externalLabel,
  );

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    '[content]',
    externalContent,
    true,
  );

  const [controlRoot, propsRoot, stateRoot, RemounterRoot] = usePropControl(
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

  const action = (label: string) => () => addLog(`${label} clicked`);

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
        ...triggerButton.controls,
        controlPreview,
        controlPositioner,
        controlPopup,
        controlItem,
        controlDestructiveItem,
        controlSeparator,
        controlIcon,
        controlLabel,
      ]}
      stateUrl={useCreateStateUrl(id, [
        stateContent,
        stateRoot,
        stateTrigger,
        statePreview,
        statePositioner,
        ...triggerButton.states,
        statePopup,
        stateItem,
        stateDestructiveItem,
        stateSeparator,
        stateIcon,
        stateLabel,
      ])}
    >
      <RemounterRoot>
        <ContextualMenu.Root {...propsRoot}>
          <ContextualMenu.Trigger
            {...propsTrigger}
            render={<Button.Root {...triggerButton.propsRoot} />}
          >
            {triggerButton.children}
          </ContextualMenu.Trigger>
          {content.preview ? (
            <ContextualMenu.Preview {...propsPreview}>
              <Photo aria-label="Photo">
                <SFSymbol icon={sfPhoto} />
              </Photo>
            </ContextualMenu.Preview>
          ) : null}
          <ContextualMenu.Portal>
            {content.backdrop ? <ContextualMenu.Backdrop /> : null}
            <ContextualMenu.Positioner {...propsPositioner}>
              <ContextualMenu.Popup {...propsPopup}>
                <ContextualMenu.Item {...propsItem}>
                  <ContextualMenu.Label {...propsLabel}>
                    Share
                  </ContextualMenu.Label>
                  <ContextualMenu.Icon {...propsIcon}>
                    <SFSymbol icon={sfSquareAndArrowUp} />
                  </ContextualMenu.Icon>
                </ContextualMenu.Item>
                <ContextualMenu.Item onClick={action('Copy')}>
                  <ContextualMenu.Label>Copy</ContextualMenu.Label>
                </ContextualMenu.Item>
                <ContextualMenu.Separator {...propsSeparator} />
                <ContextualMenu.Item
                  {...propsDestructiveItem}
                  onClick={action('Delete')}
                >
                  <ContextualMenu.Label>Delete</ContextualMenu.Label>
                  <ContextualMenu.Icon>
                    <SFSymbol icon={sfTrash} />
                  </ContextualMenu.Icon>
                </ContextualMenu.Item>
              </ContextualMenu.Popup>
            </ContextualMenu.Positioner>
          </ContextualMenu.Portal>
        </ContextualMenu.Root>
      </RemounterRoot>
    </Component>
  );
};
