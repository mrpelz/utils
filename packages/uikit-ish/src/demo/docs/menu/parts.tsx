import '../sheet/style.css';
import './style.css';

import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  Menu,
  Symbol,
  useCreateMenuHandle,
  useTextActionsPrevention,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { codeLabel, useLabelledRef } from '../../tooling/frame/render-code.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import {
  sfFolder,
  sfHeart,
  sfLink,
  sfPencil,
  sfSquareAndArrowUp,
  sfTrash,
} from '../../tooling/icons.js';
import {
  menuBackdropRows,
  menuCheckboxItemRows,
  menuGroupLabelRows,
  menuGroupRows,
  menuHandleRows,
  menuHandleTypeRows,
  menuIconRows,
  menuItemIndicatorRows,
  menuItemRows,
  menuLabelRows,
  menuLinkItemRows,
  menuPopupRows,
  menuPortalRows,
  menuPositionerRows,
  menuQuickActionRows,
  menuQuickActionsRows,
  menuRadioGroupRows,
  menuRadioItemRows,
  menuRootRows,
  menuSeparatorRows,
  menuShortcutRows,
  menuSubmenuRootRows,
  menuSubmenuTriggerRows,
  menuSubtitleRows,
  menuTriggerRows,
} from './docs.js';
import {
  getPropOptionsGuideCheckboxItem,
  getPropOptionsGuideItem,
  getPropOptionsGuideRoot,
  getPropOptionsGuideTrigger,
  getPropOptionsRadioGroup,
  getPropOptionsSubmenuRoot,
  propOptionsElement,
  propOptionsGuideIndicator,
  propOptionsGuideLinkItem,
  propOptionsGuidePortal,
  propOptionsGuideRadioItem,
  propOptionsGuideSeparator,
  propOptionsGuideSubmenuTrigger,
  propOptionsPart,
  propOptionsPopup,
  propOptionsPositioner,
} from './props.js';

/** `Menu.Root`, outlined, with its props. */
const RootPart: FunctionComponent = () => {
  const id = 'menu-parts-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsGuideRoot(addLog), [addLog]),
    { external, isOpen: true, emphasize: 'outline', title: 'Menu.Root' },
  );

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Menu.Root"
    >
      <Viewport.Content>
        <Menu.Root
          key={elementKey}
          {...props}
        >
          <Menu.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal>
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
                  <Menu.Shortcut>⌘R</Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator />
                <Menu.Group>
                  <Menu.GroupLabel>Sort By</Menu.GroupLabel>
                  <Menu.RadioGroup defaultValue="date">
                    <Menu.RadioItem value="date">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem value="name">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator />
                <Menu.CheckboxItem defaultChecked>
                  <Menu.CheckboxItemIndicator />
                  <Menu.Label>Previews</Menu.Label>
                  <Menu.Subtitle>Show file contents</Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger>
                    <Menu.Icon>
                      <Symbol icon={sfFolder} />
                    </Menu.Icon>
                    <Menu.Label>Move to</Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
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
                <Menu.LinkItem href="#">
                  <Menu.Icon>
                    <Symbol icon={sfLink} />
                  </Menu.Icon>
                  <Menu.Label>Help</Menu.Label>
                </Menu.LinkItem>
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
      </Viewport.Content>
    </Component>
  );
};

/** `Menu.Trigger`, outlined, with its props. */
const TriggerPart: FunctionComponent = () => {
  const id = 'menu-parts-trigger';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsGuideTrigger(addLog), [addLog]),
    { external, isOpen: true, emphasize: 'outline', title: 'Menu.Trigger' },
  );
  // Opened by a held press: selecting no text (no browser text menu).
  const trigger = useLabelledRef<HTMLButtonElement>(
    'trigger',
    'HTMLButtonElement',
  );
  const isHeld = props.openOn === 'secondaryClick';
  useTextActionsPrevention(trigger, isHeld);

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      setup={isHeld ? 'useTextActionsPrevention(trigger);' : undefined}
      stage="phone"
      state={[state]}
      title="Menu.Trigger"
    >
      <Viewport.Content>
        <Menu.Root>
          <Menu.Trigger
            ref={trigger}
            {...props}
          >
            <Button.Label>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal>
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
                  <Menu.Shortcut>⌘R</Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator />
                <Menu.Group>
                  <Menu.GroupLabel>Sort By</Menu.GroupLabel>
                  <Menu.RadioGroup defaultValue="date">
                    <Menu.RadioItem value="date">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem value="name">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator />
                <Menu.CheckboxItem defaultChecked>
                  <Menu.CheckboxItemIndicator />
                  <Menu.Label>Previews</Menu.Label>
                  <Menu.Subtitle>Show file contents</Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger>
                    <Menu.Icon>
                      <Symbol icon={sfFolder} />
                    </Menu.Icon>
                    <Menu.Label>Move to</Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
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
                <Menu.LinkItem href="#">
                  <Menu.Icon>
                    <Symbol icon={sfLink} />
                  </Menu.Icon>
                  <Menu.Label>Help</Menu.Label>
                </Menu.LinkItem>
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
      </Viewport.Content>
    </Component>
  );
};

/** `Menu.Portal`, outlined, with its props. */
const PortalPart: FunctionComponent = () => {
  const id = 'menu-parts-portal';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuidePortal, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Menu.Portal',
  });

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Menu.Portal"
    >
      <Viewport.Content>
        <Menu.Root>
          <Menu.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal {...props}>
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
                  <Menu.Shortcut>⌘R</Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator />
                <Menu.Group>
                  <Menu.GroupLabel>Sort By</Menu.GroupLabel>
                  <Menu.RadioGroup defaultValue="date">
                    <Menu.RadioItem value="date">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem value="name">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator />
                <Menu.CheckboxItem defaultChecked>
                  <Menu.CheckboxItemIndicator />
                  <Menu.Label>Previews</Menu.Label>
                  <Menu.Subtitle>Show file contents</Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger>
                    <Menu.Icon>
                      <Symbol icon={sfFolder} />
                    </Menu.Icon>
                    <Menu.Label>Move to</Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
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
                <Menu.LinkItem href="#">
                  <Menu.Icon>
                    <Symbol icon={sfLink} />
                  </Menu.Icon>
                  <Menu.Label>Help</Menu.Label>
                </Menu.LinkItem>
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
      </Viewport.Content>
    </Component>
  );
};

/** `Menu.Backdrop`, outlined, with its props. */
const BackdropPart: FunctionComponent = () => {
  const id = 'menu-parts-backdrop';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPart, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Menu.Backdrop',
  });

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Menu.Backdrop"
    >
      <Viewport.Content>
        <Menu.Root>
          <Menu.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Backdrop {...props} />
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
                  <Menu.Shortcut>⌘R</Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator />
                <Menu.Group>
                  <Menu.GroupLabel>Sort By</Menu.GroupLabel>
                  <Menu.RadioGroup defaultValue="date">
                    <Menu.RadioItem value="date">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem value="name">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator />
                <Menu.CheckboxItem defaultChecked>
                  <Menu.CheckboxItemIndicator />
                  <Menu.Label>Previews</Menu.Label>
                  <Menu.Subtitle>Show file contents</Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger>
                    <Menu.Icon>
                      <Symbol icon={sfFolder} />
                    </Menu.Icon>
                    <Menu.Label>Move to</Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
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
                <Menu.LinkItem href="#">
                  <Menu.Icon>
                    <Symbol icon={sfLink} />
                  </Menu.Icon>
                  <Menu.Label>Help</Menu.Label>
                </Menu.LinkItem>
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
      </Viewport.Content>
    </Component>
  );
};

/** `Menu.Positioner`, outlined, with its props. */
const PositionerPart: FunctionComponent = () => {
  const id = 'menu-parts-positioner';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPositioner, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Menu.Positioner',
  });

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Menu.Positioner"
    >
      <Viewport.Content>
        <Menu.Root>
          <Menu.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner {...props}>
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
                  <Menu.Shortcut>⌘R</Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator />
                <Menu.Group>
                  <Menu.GroupLabel>Sort By</Menu.GroupLabel>
                  <Menu.RadioGroup defaultValue="date">
                    <Menu.RadioItem value="date">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem value="name">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator />
                <Menu.CheckboxItem defaultChecked>
                  <Menu.CheckboxItemIndicator />
                  <Menu.Label>Previews</Menu.Label>
                  <Menu.Subtitle>Show file contents</Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger>
                    <Menu.Icon>
                      <Symbol icon={sfFolder} />
                    </Menu.Icon>
                    <Menu.Label>Move to</Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
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
                <Menu.LinkItem href="#">
                  <Menu.Icon>
                    <Symbol icon={sfLink} />
                  </Menu.Icon>
                  <Menu.Label>Help</Menu.Label>
                </Menu.LinkItem>
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
      </Viewport.Content>
    </Component>
  );
};

/** `Menu.Popup`, outlined, with its props. */
const PopupPart: FunctionComponent = () => {
  const id = 'menu-parts-popup';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPopup, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Menu.Popup',
  });

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Menu.Popup"
    >
      <Viewport.Content>
        <Menu.Root>
          <Menu.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner>
              <Menu.Popup {...props}>
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
                  <Menu.Shortcut>⌘R</Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator />
                <Menu.Group>
                  <Menu.GroupLabel>Sort By</Menu.GroupLabel>
                  <Menu.RadioGroup defaultValue="date">
                    <Menu.RadioItem value="date">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem value="name">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator />
                <Menu.CheckboxItem defaultChecked>
                  <Menu.CheckboxItemIndicator />
                  <Menu.Label>Previews</Menu.Label>
                  <Menu.Subtitle>Show file contents</Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger>
                    <Menu.Icon>
                      <Symbol icon={sfFolder} />
                    </Menu.Icon>
                    <Menu.Label>Move to</Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
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
                <Menu.LinkItem href="#">
                  <Menu.Icon>
                    <Symbol icon={sfLink} />
                  </Menu.Icon>
                  <Menu.Label>Help</Menu.Label>
                </Menu.LinkItem>
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
      </Viewport.Content>
    </Component>
  );
};

/** `Menu.Item`, outlined, with its props. */
const ItemPart: FunctionComponent = () => {
  const id = 'menu-parts-item';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsGuideItem(addLog), [addLog]),
    { external, isOpen: true, emphasize: 'outline', title: 'Menu.Item' },
  );

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Menu.Item"
    >
      <Viewport.Content>
        <Menu.Root>
          <Menu.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal>
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
                <Menu.Item
                  {...props}
                  onClick={() => addLog('Rename clicked')}
                >
                  <Menu.Icon>
                    <Symbol icon={sfPencil} />
                  </Menu.Icon>
                  <Menu.Label>Rename</Menu.Label>
                  <Menu.Shortcut>⌘R</Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator />
                <Menu.Group>
                  <Menu.GroupLabel>Sort By</Menu.GroupLabel>
                  <Menu.RadioGroup defaultValue="date">
                    <Menu.RadioItem value="date">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem value="name">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator />
                <Menu.CheckboxItem defaultChecked>
                  <Menu.CheckboxItemIndicator />
                  <Menu.Label>Previews</Menu.Label>
                  <Menu.Subtitle>Show file contents</Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger>
                    <Menu.Icon>
                      <Symbol icon={sfFolder} />
                    </Menu.Icon>
                    <Menu.Label>Move to</Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
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
                <Menu.LinkItem href="#">
                  <Menu.Icon>
                    <Symbol icon={sfLink} />
                  </Menu.Icon>
                  <Menu.Label>Help</Menu.Label>
                </Menu.LinkItem>
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
      </Viewport.Content>
    </Component>
  );
};

/** `Menu.LinkItem`, outlined, with its props. */
const LinkItemPart: FunctionComponent = () => {
  const id = 'menu-parts-link-item';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuideLinkItem, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Menu.LinkItem',
  });

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Menu.LinkItem"
    >
      <Viewport.Content>
        <Menu.Root>
          <Menu.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal>
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
                  <Menu.Shortcut>⌘R</Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator />
                <Menu.Group>
                  <Menu.GroupLabel>Sort By</Menu.GroupLabel>
                  <Menu.RadioGroup defaultValue="date">
                    <Menu.RadioItem value="date">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem value="name">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator />
                <Menu.CheckboxItem defaultChecked>
                  <Menu.CheckboxItemIndicator />
                  <Menu.Label>Previews</Menu.Label>
                  <Menu.Subtitle>Show file contents</Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger>
                    <Menu.Icon>
                      <Symbol icon={sfFolder} />
                    </Menu.Icon>
                    <Menu.Label>Move to</Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
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
                <Menu.LinkItem {...props}>
                  <Menu.Icon>
                    <Symbol icon={sfLink} />
                  </Menu.Icon>
                  <Menu.Label>Help</Menu.Label>
                </Menu.LinkItem>
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
      </Viewport.Content>
    </Component>
  );
};

/** `Menu.CheckboxItem`, outlined, with its props. */
const CheckboxItemPart: FunctionComponent = () => {
  const id = 'menu-parts-checkbox-item';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsGuideCheckboxItem(addLog), [addLog]),
    {
      external,
      isOpen: true,
      emphasize: 'outline',
      title: 'Menu.CheckboxItem',
    },
  );

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Menu.CheckboxItem"
    >
      <Viewport.Content>
        <Menu.Root key={elementKey}>
          <Menu.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal>
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
                  <Menu.Shortcut>⌘R</Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator />
                <Menu.Group>
                  <Menu.GroupLabel>Sort By</Menu.GroupLabel>
                  <Menu.RadioGroup defaultValue="date">
                    <Menu.RadioItem value="date">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem value="name">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator />
                <Menu.CheckboxItem {...props}>
                  <Menu.CheckboxItemIndicator />
                  <Menu.Label>Previews</Menu.Label>
                  <Menu.Subtitle>Show file contents</Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger>
                    <Menu.Icon>
                      <Symbol icon={sfFolder} />
                    </Menu.Icon>
                    <Menu.Label>Move to</Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
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
                <Menu.LinkItem href="#">
                  <Menu.Icon>
                    <Symbol icon={sfLink} />
                  </Menu.Icon>
                  <Menu.Label>Help</Menu.Label>
                </Menu.LinkItem>
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
      </Viewport.Content>
    </Component>
  );
};

/** `Menu.CheckboxItemIndicator`, outlined, with its props. */
const CheckboxItemIndicatorPart: FunctionComponent = () => {
  const id = 'menu-parts-checkbox-item-indicator';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuideIndicator, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Menu.CheckboxItemIndicator',
  });

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Menu.CheckboxItemIndicator"
    >
      <Viewport.Content>
        <Menu.Root>
          <Menu.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal>
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
                  <Menu.Shortcut>⌘R</Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator />
                <Menu.Group>
                  <Menu.GroupLabel>Sort By</Menu.GroupLabel>
                  <Menu.RadioGroup defaultValue="date">
                    <Menu.RadioItem value="date">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem value="name">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator />
                <Menu.CheckboxItem defaultChecked>
                  <Menu.CheckboxItemIndicator {...props} />
                  <Menu.Label>Previews</Menu.Label>
                  <Menu.Subtitle>Show file contents</Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger>
                    <Menu.Icon>
                      <Symbol icon={sfFolder} />
                    </Menu.Icon>
                    <Menu.Label>Move to</Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
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
                <Menu.LinkItem href="#">
                  <Menu.Icon>
                    <Symbol icon={sfLink} />
                  </Menu.Icon>
                  <Menu.Label>Help</Menu.Label>
                </Menu.LinkItem>
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
      </Viewport.Content>
    </Component>
  );
};

/** `Menu.RadioGroup`, outlined, with its props. */
const RadioGroupPart: FunctionComponent = () => {
  const id = 'menu-parts-radio-group';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsRadioGroup(addLog), [addLog]),
    { external, isOpen: true, emphasize: 'outline', title: 'Menu.RadioGroup' },
  );

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Menu.RadioGroup"
    >
      <Viewport.Content>
        <Menu.Root key={elementKey}>
          <Menu.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal>
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
                  <Menu.Shortcut>⌘R</Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator />
                <Menu.Group>
                  <Menu.GroupLabel>Sort By</Menu.GroupLabel>
                  <Menu.RadioGroup {...props}>
                    <Menu.RadioItem value="date">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem value="name">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator />
                <Menu.CheckboxItem defaultChecked>
                  <Menu.CheckboxItemIndicator />
                  <Menu.Label>Previews</Menu.Label>
                  <Menu.Subtitle>Show file contents</Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger>
                    <Menu.Icon>
                      <Symbol icon={sfFolder} />
                    </Menu.Icon>
                    <Menu.Label>Move to</Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
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
                <Menu.LinkItem href="#">
                  <Menu.Icon>
                    <Symbol icon={sfLink} />
                  </Menu.Icon>
                  <Menu.Label>Help</Menu.Label>
                </Menu.LinkItem>
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
      </Viewport.Content>
    </Component>
  );
};

/** `Menu.RadioItem`, outlined, with its props. */
const RadioItemPart: FunctionComponent = () => {
  const id = 'menu-parts-radio-item';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuideRadioItem, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Menu.RadioItem',
  });

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Menu.RadioItem"
    >
      <Viewport.Content>
        <Menu.Root>
          <Menu.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal>
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
                  <Menu.Shortcut>⌘R</Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator />
                <Menu.Group>
                  <Menu.GroupLabel>Sort By</Menu.GroupLabel>
                  <Menu.RadioGroup defaultValue="date">
                    <Menu.RadioItem
                      {...props}
                      value="date"
                    >
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem value="name">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator />
                <Menu.CheckboxItem defaultChecked>
                  <Menu.CheckboxItemIndicator />
                  <Menu.Label>Previews</Menu.Label>
                  <Menu.Subtitle>Show file contents</Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger>
                    <Menu.Icon>
                      <Symbol icon={sfFolder} />
                    </Menu.Icon>
                    <Menu.Label>Move to</Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
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
                <Menu.LinkItem href="#">
                  <Menu.Icon>
                    <Symbol icon={sfLink} />
                  </Menu.Icon>
                  <Menu.Label>Help</Menu.Label>
                </Menu.LinkItem>
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
      </Viewport.Content>
    </Component>
  );
};

/** `Menu.RadioItemIndicator`, outlined, with its props. */
const RadioItemIndicatorPart: FunctionComponent = () => {
  const id = 'menu-parts-radio-item-indicator';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuideIndicator, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Menu.RadioItemIndicator',
  });

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Menu.RadioItemIndicator"
    >
      <Viewport.Content>
        <Menu.Root>
          <Menu.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal>
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
                  <Menu.Shortcut>⌘R</Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator />
                <Menu.Group>
                  <Menu.GroupLabel>Sort By</Menu.GroupLabel>
                  <Menu.RadioGroup defaultValue="date">
                    <Menu.RadioItem value="date">
                      <Menu.RadioItemIndicator {...props} />
                      <Menu.Label>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem value="name">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator />
                <Menu.CheckboxItem defaultChecked>
                  <Menu.CheckboxItemIndicator />
                  <Menu.Label>Previews</Menu.Label>
                  <Menu.Subtitle>Show file contents</Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger>
                    <Menu.Icon>
                      <Symbol icon={sfFolder} />
                    </Menu.Icon>
                    <Menu.Label>Move to</Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
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
                <Menu.LinkItem href="#">
                  <Menu.Icon>
                    <Symbol icon={sfLink} />
                  </Menu.Icon>
                  <Menu.Label>Help</Menu.Label>
                </Menu.LinkItem>
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
      </Viewport.Content>
    </Component>
  );
};

/** `Menu.SubmenuRoot`, outlined, with its props. */
const SubmenuRootPart: FunctionComponent = () => {
  const id = 'menu-parts-submenu-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsSubmenuRoot(addLog), [addLog]),
    { external, isOpen: true, emphasize: 'outline', title: 'Menu.SubmenuRoot' },
  );

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Menu.SubmenuRoot"
    >
      <Viewport.Content>
        <Menu.Root>
          <Menu.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal>
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
                  <Menu.Shortcut>⌘R</Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator />
                <Menu.Group>
                  <Menu.GroupLabel>Sort By</Menu.GroupLabel>
                  <Menu.RadioGroup defaultValue="date">
                    <Menu.RadioItem value="date">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem value="name">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator />
                <Menu.CheckboxItem defaultChecked>
                  <Menu.CheckboxItemIndicator />
                  <Menu.Label>Previews</Menu.Label>
                  <Menu.Subtitle>Show file contents</Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot {...props}>
                  <Menu.SubmenuTrigger>
                    <Menu.Icon>
                      <Symbol icon={sfFolder} />
                    </Menu.Icon>
                    <Menu.Label>Move to</Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
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
                <Menu.LinkItem href="#">
                  <Menu.Icon>
                    <Symbol icon={sfLink} />
                  </Menu.Icon>
                  <Menu.Label>Help</Menu.Label>
                </Menu.LinkItem>
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
      </Viewport.Content>
    </Component>
  );
};

/** `Menu.SubmenuTrigger`, outlined, with its props. */
const SubmenuTriggerPart: FunctionComponent = () => {
  const id = 'menu-parts-submenu-trigger';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsGuideSubmenuTrigger,
    {
      external,
      isOpen: true,
      emphasize: 'outline',
      title: 'Menu.SubmenuTrigger',
    },
  );

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Menu.SubmenuTrigger"
    >
      <Viewport.Content>
        <Menu.Root>
          <Menu.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal>
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
                  <Menu.Shortcut>⌘R</Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator />
                <Menu.Group>
                  <Menu.GroupLabel>Sort By</Menu.GroupLabel>
                  <Menu.RadioGroup defaultValue="date">
                    <Menu.RadioItem value="date">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem value="name">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator />
                <Menu.CheckboxItem defaultChecked>
                  <Menu.CheckboxItemIndicator />
                  <Menu.Label>Previews</Menu.Label>
                  <Menu.Subtitle>Show file contents</Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger {...props}>
                    <Menu.Icon>
                      <Symbol icon={sfFolder} />
                    </Menu.Icon>
                    <Menu.Label>Move to</Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
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
                <Menu.LinkItem href="#">
                  <Menu.Icon>
                    <Symbol icon={sfLink} />
                  </Menu.Icon>
                  <Menu.Label>Help</Menu.Label>
                </Menu.LinkItem>
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
      </Viewport.Content>
    </Component>
  );
};

/** `Menu.Group`, outlined, with its props. */
const GroupPart: FunctionComponent = () => {
  const id = 'menu-parts-group';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPart, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Menu.Group',
  });

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Menu.Group"
    >
      <Viewport.Content>
        <Menu.Root>
          <Menu.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal>
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
                  <Menu.Shortcut>⌘R</Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator />
                <Menu.Group {...props}>
                  <Menu.GroupLabel>Sort By</Menu.GroupLabel>
                  <Menu.RadioGroup defaultValue="date">
                    <Menu.RadioItem value="date">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem value="name">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator />
                <Menu.CheckboxItem defaultChecked>
                  <Menu.CheckboxItemIndicator />
                  <Menu.Label>Previews</Menu.Label>
                  <Menu.Subtitle>Show file contents</Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger>
                    <Menu.Icon>
                      <Symbol icon={sfFolder} />
                    </Menu.Icon>
                    <Menu.Label>Move to</Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
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
                <Menu.LinkItem href="#">
                  <Menu.Icon>
                    <Symbol icon={sfLink} />
                  </Menu.Icon>
                  <Menu.Label>Help</Menu.Label>
                </Menu.LinkItem>
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
      </Viewport.Content>
    </Component>
  );
};

/** `Menu.GroupLabel`, outlined, with its props. */
const GroupLabelPart: FunctionComponent = () => {
  const id = 'menu-parts-group-label';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPart, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Menu.GroupLabel',
  });

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Menu.GroupLabel"
    >
      <Viewport.Content>
        <Menu.Root>
          <Menu.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal>
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
                  <Menu.Shortcut>⌘R</Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator />
                <Menu.Group>
                  <Menu.GroupLabel {...props}>Sort By</Menu.GroupLabel>
                  <Menu.RadioGroup defaultValue="date">
                    <Menu.RadioItem value="date">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem value="name">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator />
                <Menu.CheckboxItem defaultChecked>
                  <Menu.CheckboxItemIndicator />
                  <Menu.Label>Previews</Menu.Label>
                  <Menu.Subtitle>Show file contents</Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger>
                    <Menu.Icon>
                      <Symbol icon={sfFolder} />
                    </Menu.Icon>
                    <Menu.Label>Move to</Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
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
                <Menu.LinkItem href="#">
                  <Menu.Icon>
                    <Symbol icon={sfLink} />
                  </Menu.Icon>
                  <Menu.Label>Help</Menu.Label>
                </Menu.LinkItem>
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
      </Viewport.Content>
    </Component>
  );
};

/** `Menu.Separator`, outlined, with its props. */
const SeparatorPart: FunctionComponent = () => {
  const id = 'menu-parts-separator';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuideSeparator, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Menu.Separator',
  });

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Menu.Separator"
    >
      <Viewport.Content>
        <Menu.Root>
          <Menu.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal>
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
                  <Menu.Shortcut>⌘R</Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator {...props} />
                <Menu.Group>
                  <Menu.GroupLabel>Sort By</Menu.GroupLabel>
                  <Menu.RadioGroup defaultValue="date">
                    <Menu.RadioItem value="date">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem value="name">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator />
                <Menu.CheckboxItem defaultChecked>
                  <Menu.CheckboxItemIndicator />
                  <Menu.Label>Previews</Menu.Label>
                  <Menu.Subtitle>Show file contents</Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger>
                    <Menu.Icon>
                      <Symbol icon={sfFolder} />
                    </Menu.Icon>
                    <Menu.Label>Move to</Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
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
                <Menu.LinkItem href="#">
                  <Menu.Icon>
                    <Symbol icon={sfLink} />
                  </Menu.Icon>
                  <Menu.Label>Help</Menu.Label>
                </Menu.LinkItem>
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
      </Viewport.Content>
    </Component>
  );
};

/** `Menu.QuickActions`, outlined, with its props. */
const QuickActionsPart: FunctionComponent = () => {
  const id = 'menu-parts-quick-actions';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsElement, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Menu.QuickActions',
  });

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Menu.QuickActions"
    >
      <Viewport.Content>
        <Menu.Root>
          <Menu.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner>
              <Menu.Popup>
                <Menu.QuickActions {...props}>
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
                  <Menu.Shortcut>⌘R</Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator />
                <Menu.Group>
                  <Menu.GroupLabel>Sort By</Menu.GroupLabel>
                  <Menu.RadioGroup defaultValue="date">
                    <Menu.RadioItem value="date">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem value="name">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator />
                <Menu.CheckboxItem defaultChecked>
                  <Menu.CheckboxItemIndicator />
                  <Menu.Label>Previews</Menu.Label>
                  <Menu.Subtitle>Show file contents</Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger>
                    <Menu.Icon>
                      <Symbol icon={sfFolder} />
                    </Menu.Icon>
                    <Menu.Label>Move to</Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
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
                <Menu.LinkItem href="#">
                  <Menu.Icon>
                    <Symbol icon={sfLink} />
                  </Menu.Icon>
                  <Menu.Label>Help</Menu.Label>
                </Menu.LinkItem>
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
      </Viewport.Content>
    </Component>
  );
};

/** `Menu.QuickAction`, outlined, with its props. */
const QuickActionPart: FunctionComponent = () => {
  const id = 'menu-parts-quick-action';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsGuideItem(addLog), [addLog]),
    { external, isOpen: true, emphasize: 'outline', title: 'Menu.QuickAction' },
  );

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Menu.QuickAction"
    >
      <Viewport.Content>
        <Menu.Root>
          <Menu.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner>
              <Menu.Popup>
                <Menu.QuickActions>
                  <Menu.QuickAction
                    {...props}
                    onClick={() => addLog('Share clicked')}
                  >
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
                  <Menu.Shortcut>⌘R</Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator />
                <Menu.Group>
                  <Menu.GroupLabel>Sort By</Menu.GroupLabel>
                  <Menu.RadioGroup defaultValue="date">
                    <Menu.RadioItem value="date">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem value="name">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator />
                <Menu.CheckboxItem defaultChecked>
                  <Menu.CheckboxItemIndicator />
                  <Menu.Label>Previews</Menu.Label>
                  <Menu.Subtitle>Show file contents</Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger>
                    <Menu.Icon>
                      <Symbol icon={sfFolder} />
                    </Menu.Icon>
                    <Menu.Label>Move to</Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
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
                <Menu.LinkItem href="#">
                  <Menu.Icon>
                    <Symbol icon={sfLink} />
                  </Menu.Icon>
                  <Menu.Label>Help</Menu.Label>
                </Menu.LinkItem>
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
      </Viewport.Content>
    </Component>
  );
};

/** `Menu.Icon`, outlined, with its props. */
const IconPart: FunctionComponent = () => {
  const id = 'menu-parts-icon';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsElement, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Menu.Icon',
  });

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Menu.Icon"
    >
      <Viewport.Content>
        <Menu.Root>
          <Menu.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal>
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
                  <Menu.Icon {...props}>
                    <Symbol icon={sfPencil} />
                  </Menu.Icon>
                  <Menu.Label>Rename</Menu.Label>
                  <Menu.Shortcut>⌘R</Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator />
                <Menu.Group>
                  <Menu.GroupLabel>Sort By</Menu.GroupLabel>
                  <Menu.RadioGroup defaultValue="date">
                    <Menu.RadioItem value="date">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem value="name">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator />
                <Menu.CheckboxItem defaultChecked>
                  <Menu.CheckboxItemIndicator />
                  <Menu.Label>Previews</Menu.Label>
                  <Menu.Subtitle>Show file contents</Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger>
                    <Menu.Icon>
                      <Symbol icon={sfFolder} />
                    </Menu.Icon>
                    <Menu.Label>Move to</Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
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
                <Menu.LinkItem href="#">
                  <Menu.Icon>
                    <Symbol icon={sfLink} />
                  </Menu.Icon>
                  <Menu.Label>Help</Menu.Label>
                </Menu.LinkItem>
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
      </Viewport.Content>
    </Component>
  );
};

/** `Menu.Label`, outlined, with its props. */
const LabelPart: FunctionComponent = () => {
  const id = 'menu-parts-label';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsElement, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Menu.Label',
  });

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Menu.Label"
    >
      <Viewport.Content>
        <Menu.Root>
          <Menu.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal>
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
                  <Menu.Label {...props}>Rename</Menu.Label>
                  <Menu.Shortcut>⌘R</Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator />
                <Menu.Group>
                  <Menu.GroupLabel>Sort By</Menu.GroupLabel>
                  <Menu.RadioGroup defaultValue="date">
                    <Menu.RadioItem value="date">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem value="name">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator />
                <Menu.CheckboxItem defaultChecked>
                  <Menu.CheckboxItemIndicator />
                  <Menu.Label>Previews</Menu.Label>
                  <Menu.Subtitle>Show file contents</Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger>
                    <Menu.Icon>
                      <Symbol icon={sfFolder} />
                    </Menu.Icon>
                    <Menu.Label>Move to</Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
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
                <Menu.LinkItem href="#">
                  <Menu.Icon>
                    <Symbol icon={sfLink} />
                  </Menu.Icon>
                  <Menu.Label>Help</Menu.Label>
                </Menu.LinkItem>
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
      </Viewport.Content>
    </Component>
  );
};

/** `Menu.Subtitle`, outlined, with its props. */
const SubtitlePart: FunctionComponent = () => {
  const id = 'menu-parts-subtitle';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsElement, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Menu.Subtitle',
  });

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Menu.Subtitle"
    >
      <Viewport.Content>
        <Menu.Root>
          <Menu.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal>
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
                  <Menu.Shortcut>⌘R</Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator />
                <Menu.Group>
                  <Menu.GroupLabel>Sort By</Menu.GroupLabel>
                  <Menu.RadioGroup defaultValue="date">
                    <Menu.RadioItem value="date">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem value="name">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator />
                <Menu.CheckboxItem defaultChecked>
                  <Menu.CheckboxItemIndicator />
                  <Menu.Label>Previews</Menu.Label>
                  <Menu.Subtitle {...props}>Show file contents</Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger>
                    <Menu.Icon>
                      <Symbol icon={sfFolder} />
                    </Menu.Icon>
                    <Menu.Label>Move to</Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
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
                <Menu.LinkItem href="#">
                  <Menu.Icon>
                    <Symbol icon={sfLink} />
                  </Menu.Icon>
                  <Menu.Label>Help</Menu.Label>
                </Menu.LinkItem>
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
      </Viewport.Content>
    </Component>
  );
};

/** `Menu.Shortcut`, outlined, with its props. */
const ShortcutPart: FunctionComponent = () => {
  const id = 'menu-parts-shortcut';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsElement, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Menu.Shortcut',
  });

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state]}
      title="Menu.Shortcut"
    >
      <Viewport.Content>
        <Menu.Root>
          <Menu.Trigger
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal>
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
                  <Menu.Shortcut {...props}>⌘R</Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator />
                <Menu.Group>
                  <Menu.GroupLabel>Sort By</Menu.GroupLabel>
                  <Menu.RadioGroup defaultValue="date">
                    <Menu.RadioItem value="date">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem value="name">
                      <Menu.RadioItemIndicator />
                      <Menu.Label>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator />
                <Menu.CheckboxItem defaultChecked>
                  <Menu.CheckboxItemIndicator />
                  <Menu.Label>Previews</Menu.Label>
                  <Menu.Subtitle>Show file contents</Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger>
                    <Menu.Icon>
                      <Symbol icon={sfFolder} />
                    </Menu.Icon>
                    <Menu.Label>Move to</Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
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
                <Menu.LinkItem href="#">
                  <Menu.Icon>
                    <Symbol icon={sfLink} />
                  </Menu.Icon>
                  <Menu.Label>Help</Menu.Label>
                </Menu.LinkItem>
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
      </Viewport.Content>
    </Component>
  );
};

// Its trigger and its button, outside the root: made once, here.
const optionsMenu = codeLabel(
  Menu.createHandle(),
  'optionsMenu',
  'const optionsMenu = Menu.createHandle(); // (at module level)',
);

/** `Menu.createHandle`: a trigger outside the root, an imperative open. */
const CreateHandlePart: FunctionComponent = () => {
  const id = 'menu-parts-create-handle';
  const [log, addLog] = useLog();

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      title="Menu.createHandle"
    >
      <Viewport.Content>
        <div className="menu-demo-triggers">
          <Menu.Trigger
            handle={optionsMenu}
            id="menu-parts-options-trigger"
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Options</Button.Label>
          </Menu.Trigger>
          <Button.Root
            variant="borderless"
            onClick={() => optionsMenu.open('menu-parts-options-trigger')}
          >
            <Button.Label>Open Imperatively</Button.Label>
          </Button.Root>
        </div>
        <Menu.Root
          handle={optionsMenu}
          onOpenChange={(isOpen: boolean, { reason }) =>
            addLog(`open change: ${String(isOpen)} (${reason})`)
          }
        >
          <Menu.Portal>
            <Menu.Positioner>
              <Menu.Popup>
                <Menu.Item onClick={() => addLog('Rename clicked')}>
                  <Menu.Icon>
                    <Symbol icon={sfPencil} />
                  </Menu.Icon>
                  <Menu.Label>Rename</Menu.Label>
                </Menu.Item>
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
      </Viewport.Content>
    </Component>
  );
};

/** `useCreateMenuHandle`: two triggers, one menu, its items theirs. */
const UseCreateMenuHandlePart: FunctionComponent = () => {
  const id = 'menu-parts-use-create-menu-handle';
  const [log, addLog] = useLog();
  // Its triggers, outside the root, each with its payload: the file.
  const fileMenu = codeLabel(
    useCreateMenuHandle<{ file: string }>(),
    'fileMenu',
    'const fileMenu = useCreateMenuHandle<{ file: string }>();',
  );

  return (
    <Component
      hasWallpaper
      isInline
      baseUiId="menu"
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      title="useCreateMenuHandle"
    >
      <Viewport.Content>
        <div className="menu-demo-triggers">
          <Menu.Trigger
            handle={fileMenu}
            payload={{ file: 'Notes.txt' }}
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Notes.txt</Button.Label>
          </Menu.Trigger>
          <Menu.Trigger
            handle={fileMenu}
            payload={{ file: 'Photo.jpg' }}
            render={
              <Button.Root
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label>Photo.jpg</Button.Label>
          </Menu.Trigger>
        </div>
        <Menu.Root handle={fileMenu}>
          {({ payload }) => (
            <Menu.Portal>
              <Menu.Positioner>
                <Menu.Popup>
                  <Menu.Group>
                    <Menu.GroupLabel>{payload?.file}</Menu.GroupLabel>
                    <Menu.Item
                      onClick={() => addLog(`share: ${String(payload?.file)}`)}
                    >
                      <Menu.Icon>
                        <Symbol icon={sfSquareAndArrowUp} />
                      </Menu.Icon>
                      <Menu.Label>Share</Menu.Label>
                    </Menu.Item>
                    <Menu.Item
                      destructive
                      onClick={() => addLog(`delete: ${String(payload?.file)}`)}
                    >
                      <Menu.Icon>
                        <Symbol icon={sfTrash} />
                      </Menu.Icon>
                      <Menu.Label>Delete</Menu.Label>
                    </Menu.Item>
                  </Menu.Group>
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          )}
        </Menu.Root>
      </Viewport.Content>
    </Component>
  );
};

/** `/menu/parts`: the root, its trigger, popup, items; its handles. */
export const MenuParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        A root, its trigger, and its popup in a portal and a positioner (Base
        UI’s).
      </li>
      <li>
        In the popup: items (actions, links, toggles, choices, submenus),
        groups, separators, quick actions; each item’s symbol, label, subtitle,
        shortcut.
      </li>
      <li>
        Base UI’s other parts pass through unstyled: <code>Menu.Arrow</code> and{' '}
        <code>Menu.Viewport</code> (these menus have neither), and filtering (
        <code>Menu.FilterRoot</code>, <code>Menu.Input</code>,{' '}
        <code>Menu.List</code>, <code>Menu.Empty</code>, …: these menus have no
        search).
      </li>
    </ul>

    <ul>
      <li>
        <PartLink part="Menu.Root" />
        <ul>
          <li>
            <PartLink part="Menu.Trigger" />
          </li>
          <li>
            <PartLink part="Menu.Portal" />
            <ul>
              <li>
                <PartLink part="Menu.Backdrop" /> (optional)
              </li>
              <li>
                <PartLink part="Menu.Positioner" />
                <ul>
                  <li>
                    <PartLink part="Menu.Popup" />
                    <ul>
                      <li>
                        <PartLink part="Menu.QuickActions" /> (optional)
                        <ul>
                          <li>
                            <PartLink part="Menu.QuickAction" />
                          </li>
                        </ul>
                      </li>
                      <li>
                        <PartLink part="Menu.Group" /> (optional)
                        <ul>
                          <li>
                            <PartLink part="Menu.GroupLabel" />
                          </li>
                        </ul>
                      </li>
                      <li>
                        <PartLink part="Menu.Separator" /> (optional)
                      </li>
                      <li>
                        items
                        <ul>
                          <li>
                            <PartLink part="Menu.Item" />
                          </li>
                          <li>
                            <PartLink part="Menu.LinkItem" />
                          </li>
                          <li>
                            <PartLink part="Menu.CheckboxItem" />
                            <ul>
                              <li>
                                <PartLink part="Menu.CheckboxItemIndicator" />
                              </li>
                            </ul>
                          </li>
                          <li>
                            <PartLink part="Menu.RadioGroup" />
                            <ul>
                              <li>
                                <PartLink part="Menu.RadioItem" />
                                <ul>
                                  <li>
                                    <PartLink part="Menu.RadioItemIndicator" />
                                  </li>
                                </ul>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <PartLink part="Menu.SubmenuRoot" />
                            <ul>
                              <li>
                                <PartLink part="Menu.SubmenuTrigger" />
                              </li>
                              <li>its own portal, positioner and popup</li>
                            </ul>
                          </li>
                          <li>
                            in each item: <PartLink part="Menu.Icon" />,{' '}
                            <PartLink part="Menu.Label" />,{' '}
                            <PartLink part="Menu.Subtitle" />,{' '}
                            <PartLink part="Menu.Shortcut" /> (optional, but a
                            label)
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
        <PartLink part="Menu.createHandle" />
      </li>
      <li>
        <PartLink part="useCreateMenuHandle" />
      </li>
    </ul>

    <Heading
      id="menu-root"
      level={2}
    >
      <code>Menu.Root</code>
    </Heading>
    <ul>
      <li>
        The menu’s state, its trigger and its popup (Base UI’s, as a dialog of
        actions).
      </li>
      <li>
        State: <code>open</code> or <code>defaultOpen</code>,{' '}
        <code>onOpenChange</code> (with why).
      </li>
      <li>
        Size: <code>size</code>, for all its popups: <code>compact</code> (a
        phone’s menu) or <code>regular</code> (a tablet’s).
      </li>
      <li>
        Modal by default: the page doesn’t scroll, outside presses only close
        it.
      </li>
      <li>Renders no element.</li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={menuRootRows} />

    <Heading
      id="menu-trigger"
      level={2}
    >
      <code>Menu.Trigger</code>
    </Heading>
    <ul>
      <li>
        What opens it: by default a press (on touch, as the finger goes down:
        drag on to an item and lift to choose it).
      </li>
      <li>
        <code>openOn=&quot;secondaryClick&quot;</code>: a right click or a touch
        held opens it; a click is the trigger’s own (e.g. a back button’s
        history).
      </li>
      <li>
        Renders a <code>button</code>; usually a <a href="button">Button</a> (
        <code>render</code>).
      </li>
    </ul>
    <TriggerPart />
    <h3>Props</h3>
    <PropsTable rows={menuTriggerRows} />

    <Heading
      id="menu-portal"
      level={2}
    >
      <code>Menu.Portal</code>
    </Heading>
    <ul>
      <li>
        No box of its own (<code>display: contents</code>): rendered into a
        container laid out as a flex column (e.g. a screen), it doesn’t shift
        its content.
      </li>
      <li>
        Renders its positioner into <code>document.body</code> (or its{' '}
        <code>container</code>), above the page.
      </li>
      <li>
        Here: open the menu (its trigger) to see it (one menu opens at a time).
      </li>
    </ul>
    <PortalPart />
    <h3>Props</h3>
    <PropsTable rows={menuPortalRows} />

    <Heading
      id="menu-backdrop"
      level={2}
    >
      <code>Menu.Backdrop</code>
    </Heading>
    <ul>
      <li>
        An element covering the page under the popup (optional; unstyled: these
        menus don’t dim the page).
      </li>
      <li>Not rendered in a submenu.</li>
      <li>
        Here: open the menu (its trigger) to see it (one menu opens at a time).
      </li>
    </ul>
    <BackdropPart />
    <h3>Props</h3>
    <PropsTable rows={menuBackdropRows} />

    <Heading
      id="menu-positioner"
      level={2}
    >
      <code>Menu.Positioner</code>
    </Heading>
    <ul>
      <li>
        Places the popup at its trigger: below it, centered, 8px away; on the
        other side if there’s no room.
      </li>
      <li>
        A submenu’s: compact, below its trigger, over the parent’s items;
        regular, beside it, its first item at the trigger.
      </li>
      <li>Closes the menu once its trigger scrolls out of view.</li>
      <li>
        Here: open the menu (its trigger) to see it (one menu opens at a time).
      </li>
    </ul>
    <PositionerPart />
    <h3>Props</h3>
    <PropsTable rows={menuPositionerRows} />

    <Heading
      id="menu-popup"
      level={2}
    >
      <code>Menu.Popup</code>
    </Heading>
    <ul>
      <li>
        The menu itself: glass (the medium glass), at least 238px wide, scaling
        in from its trigger.
      </li>
      <li>
        Its selection moves between the items (the pointer’s, the keys’), a pill
        concentric with its corners.
      </li>
      <li>Taller than the room for it, it scrolls.</li>
      <li>
        Here: open the menu (its trigger) to see it (one menu opens at a time).
      </li>
    </ul>
    <PopupPart />
    <h3>Props</h3>
    <PropsTable rows={menuPopupRows} />

    <Heading
      id="menu-item"
      level={2}
    >
      <code>Menu.Item</code>
    </Heading>
    <ul>
      <li>
        An action: its <code>onClick</code>; the menu closes after it (
        <code>closeOnClick</code>).
      </li>
      <li>
        Look: <code>destructive</code> (red), <code>disabled</code>; its
        contents laid out: [checkmark] [symbol] label/subtitle [shortcut |
        chevron].
      </li>
      <li>40px high (regular: 36px).</li>
      <li>
        Here: open the menu (its trigger) to see it (one menu opens at a time).
      </li>
    </ul>
    <ItemPart />
    <h3>Props</h3>
    <PropsTable rows={menuItemRows} />

    <Heading
      id="menu-linkitem"
      level={2}
    >
      <code>Menu.LinkItem</code>
    </Heading>
    <ul>
      <li>
        A link (<code>href</code>), as an item: navigates, the menu staying open
        unless <code>closeOnClick</code>.
      </li>
      <li>
        Renders an <code>a</code>.
      </li>
      <li>
        Here: open the menu (its trigger) to see it (one menu opens at a time).
      </li>
    </ul>
    <LinkItemPart />
    <h3>Props</h3>
    <PropsTable rows={menuLinkItemRows} />

    <Heading
      id="menu-checkboxitem"
      level={2}
    >
      <code>Menu.CheckboxItem</code>
    </Heading>
    <ul>
      <li>
        A toggle: <code>checked</code> or <code>defaultChecked</code>,{' '}
        <code>onCheckedChange</code>; the menu stays open.
      </li>
      <li>
        With toggles in a popup, all its items keep a column for the checkmark.
      </li>
      <li>
        Here: open the menu (its trigger) to see it (one menu opens at a time).
      </li>
    </ul>
    <CheckboxItemPart />
    <h3>Props</h3>
    <PropsTable rows={menuCheckboxItemRows} />

    <Heading
      id="menu-checkboxitemindicator"
      level={2}
    >
      <code>Menu.CheckboxItemIndicator</code>
    </Heading>
    <ul>
      <li>
        The checkmark, while checked (drawn as a stroke), at the item’s start.
      </li>
      <li>
        Here: open the menu (its trigger) to see it (one menu opens at a time).
      </li>
    </ul>
    <CheckboxItemIndicatorPart />
    <h3>Props</h3>
    <PropsTable rows={menuItemIndicatorRows} />

    <Heading
      id="menu-radiogroup"
      level={2}
    >
      <code>Menu.RadioGroup</code>
    </Heading>
    <ul>
      <li>
        One choice among its items: <code>value</code> or{' '}
        <code>defaultValue</code>, <code>onValueChange</code>.
      </li>
      <li>
        Usually in a <PartLink part="Menu.Group" /> with a{' '}
        <PartLink part="Menu.GroupLabel" /> (“Sort By”).
      </li>
      <li>
        Here: open the menu (its trigger) to see it (one menu opens at a time).
      </li>
    </ul>
    <RadioGroupPart />
    <h3>Props</h3>
    <PropsTable rows={menuRadioGroupRows} />

    <Heading
      id="menu-radioitem"
      level={2}
    >
      <code>Menu.RadioItem</code>
    </Heading>
    <ul>
      <li>
        One of its group’s choices (<code>value</code>); the menu stays open.
      </li>
      <li>
        Here: open the menu (its trigger) to see it (one menu opens at a time).
      </li>
    </ul>
    <RadioItemPart />
    <h3>Props</h3>
    <PropsTable rows={menuRadioItemRows} />

    <Heading
      id="menu-radioitemindicator"
      level={2}
    >
      <code>Menu.RadioItemIndicator</code>
    </Heading>
    <ul>
      <li>
        The checkmark of the chosen item (radio items are checkmarks too).
      </li>
      <li>
        Here: open the menu (its trigger) to see it (one menu opens at a time).
      </li>
    </ul>
    <RadioItemIndicatorPart />
    <h3>Props</h3>
    <PropsTable rows={menuItemIndicatorRows} />

    <Heading
      id="menu-submenuroot"
      level={2}
    >
      <code>Menu.SubmenuRoot</code>
    </Heading>
    <ul>
      <li>
        A menu within the menu: its <PartLink part="Menu.SubmenuTrigger" /> and
        its own portal, positioner and popup.
      </li>
      <li>
        Compact: it opens over its trigger (which stays, its chevron turned
        down), the parent’s other items fading; regular: beside it.
      </li>
      <li>Renders no element.</li>
      <li>
        Here: open the menu (its trigger) to see it (one menu opens at a time).
      </li>
    </ul>
    <SubmenuRootPart />
    <h3>Props</h3>
    <PropsTable rows={menuSubmenuRootRows} />

    <Heading
      id="menu-submenutrigger"
      level={2}
    >
      <code>Menu.SubmenuTrigger</code>
    </Heading>
    <ul>
      <li>
        An item opening its submenu, a chevron at its end; on hover too (
        <code>openOnHover</code>), by default only regular: compact, its submenu
        covering the menu, it’s pressed (a phone’s menu has no hover).
      </li>
      <li>Regular: while its submenu is open, it keeps the selection.</li>
      <li>
        Here: open the menu (its trigger) to see it (one menu opens at a time).
      </li>
    </ul>
    <SubmenuTriggerPart />
    <h3>Props</h3>
    <PropsTable rows={menuSubmenuTriggerRows} />

    <Heading
      id="menu-group"
      level={2}
    >
      <code>Menu.Group</code>
    </Heading>
    <ul>
      <li>
        A section of items, named by its <PartLink part="Menu.GroupLabel" />{' '}
        (for assistive technology too).
      </li>
      <li>
        Here: open the menu (its trigger) to see it (one menu opens at a time).
      </li>
    </ul>
    <GroupPart />
    <h3>Props</h3>
    <PropsTable rows={menuGroupRows} />

    <Heading
      id="menu-grouplabel"
      level={2}
    >
      <code>Menu.GroupLabel</code>
    </Heading>
    <ul>
      <li>The section’s title, in the secondary label color.</li>
      <li>
        Here: open the menu (its trigger) to see it (one menu opens at a time).
      </li>
    </ul>
    <GroupLabelPart />
    <h3>Props</h3>
    <PropsTable rows={menuGroupLabelRows} />

    <Heading
      id="menu-separator"
      level={2}
    >
      <code>Menu.Separator</code>
    </Heading>
    <ul>
      <li>A hairline between sections, inset 8px.</li>
      <li>
        Here: open the menu (its trigger) to see it (one menu opens at a time).
      </li>
    </ul>
    <SeparatorPart />
    <h3>Props</h3>
    <PropsTable rows={menuSeparatorRows} />

    <Heading
      id="menu-quickactions"
      level={2}
    >
      <code>Menu.QuickActions</code>
    </Heading>
    <ul>
      <li>
        A row of <PartLink part="Menu.QuickAction" />s at the popup’s top, inset
        10px.
      </li>
      <li>
        Here: open the menu (its trigger) to see it (one menu opens at a time).
      </li>
    </ul>
    <QuickActionsPart />
    <h3>Props</h3>
    <PropsTable rows={menuQuickActionsRows} />

    <Heading
      id="menu-quickaction"
      level={2}
    >
      <code>Menu.QuickAction</code>
    </Heading>
    <ul>
      <li>
        An action as a tile: a <PartLink part="Menu.Icon" /> above a{' '}
        <PartLink part="Menu.Label" /> (Share, Favorite).
      </li>
      <li>
        An item (its props), its selection a rounded tile concentric with the
        popup.
      </li>
      <li>
        Here: open the menu (its trigger) to see it (one menu opens at a time).
      </li>
    </ul>
    <QuickActionPart />
    <h3>Props</h3>
    <PropsTable rows={menuQuickActionRows} />

    <Heading
      id="menu-icon"
      level={2}
    >
      <code>Menu.Icon</code>
    </Heading>
    <ul>
      <li>
        An item’s symbol (a <a href="symbol">Symbol</a>), 28px wide, before its
        label (its gap with it gone without one); above a quick action’s label.
      </li>
      <li>
        Here: open the menu (its trigger) to see it (one menu opens at a time).
      </li>
    </ul>
    <IconPart />
    <h3>Props</h3>
    <PropsTable rows={menuIconRows} />

    <Heading
      id="menu-label"
      level={2}
    >
      <code>Menu.Label</code>
    </Heading>
    <ul>
      <li>An item’s text: 17px (regular: 15px).</li>
      <li>
        Here: open the menu (its trigger) to see it (one menu opens at a time).
      </li>
    </ul>
    <LabelPart />
    <h3>Props</h3>
    <PropsTable rows={menuLabelRows} />

    <Heading
      id="menu-subtitle"
      level={2}
    >
      <code>Menu.Subtitle</code>
    </Heading>
    <ul>
      <li>
        A second line below the label, smaller, in the secondary label color.
      </li>
      <li>
        Here: open the menu (its trigger) to see it (one menu opens at a time).
      </li>
    </ul>
    <SubtitlePart />
    <h3>Props</h3>
    <PropsTable rows={menuSubtitleRows} />

    <Heading
      id="menu-shortcut"
      level={2}
    >
      <code>Menu.Shortcut</code>
    </Heading>
    <ul>
      <li>
        A keyboard shortcut at the item’s end (regular): its glyphs each in a
        cell (⌘R).
      </li>
      <li>
        Renders a <code>kbd</code>; shown only, the app handles the keys.
      </li>
      <li>
        Here: open the menu (its trigger) to see it (one menu opens at a time).
      </li>
    </ul>
    <ShortcutPart />
    <h3>Props</h3>
    <PropsTable rows={menuShortcutRows} />

    <Heading
      id="menu-createhandle"
      level={2}
    >
      <code>Menu.createHandle</code>
    </Heading>
    <ul>
      <li>
        A handle linking a menu to its triggers outside its root, and opening or
        closing it imperatively (Base UI’s <code>Menu.createHandle</code>).
      </li>
      <li>
        Made once, outside a component (in one:{' '}
        <PartLink part="useCreateMenuHandle" />
        ).
      </li>
    </ul>
    <CreateHandlePart />
    <h3>Type parameters</h3>
    <PropsTable rows={menuHandleTypeRows} />
    <h3>Returns</h3>
    <PropsTable rows={menuHandleRows} />

    <Heading
      id="usecreatemenuhandle"
      level={2}
    >
      <code>useCreateMenuHandle</code>
    </Heading>
    <ul>
      <li>
        <PartLink part="Menu.createHandle" /> in a component: made once, the
        same for its lifetime.
      </li>
      <li>
        Its triggers pass a <code>payload</code>; the root’s children, a
        function of it, render the menu for the trigger that opened it.
      </li>
    </ul>
    <UseCreateMenuHandlePart />
    <h3>Type parameters</h3>
    <PropsTable rows={menuHandleTypeRows} />
    <h3>Returns</h3>
    <PropsTable rows={menuHandleRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const menuPartsDemos = [
  RootPart,
  TriggerPart,
  PortalPart,
  BackdropPart,
  PositionerPart,
  PopupPart,
  ItemPart,
  LinkItemPart,
  CheckboxItemPart,
  CheckboxItemIndicatorPart,
  RadioGroupPart,
  RadioItemPart,
  RadioItemIndicatorPart,
  SubmenuRootPart,
  SubmenuTriggerPart,
  GroupPart,
  GroupLabelPart,
  SeparatorPart,
  QuickActionsPart,
  QuickActionPart,
  IconPart,
  LabelPart,
  SubtitlePart,
  ShortcutPart,
  CreateHandlePart,
  UseCreateMenuHandlePart,
];
