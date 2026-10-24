import '../sheet/style.css';
import './style.css';

import { sfFolder } from '@bradleyhodges/sfsymbols/sfFolder';
import { sfHeart } from '@bradleyhodges/sfsymbols/sfHeart';
import { sfLink } from '@bradleyhodges/sfsymbols/sfLink';
import { sfPencil } from '@bradleyhodges/sfsymbols/sfPencil';
import { sfSquareAndArrowUp } from '@bradleyhodges/sfsymbols/sfSquareAndArrowUp';
import { sfTrash } from '@bradleyhodges/sfsymbols/sfTrash';
import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  Menu,
  Symbol,
  useCreateMenuHandle,
} from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { codeLabel, useLabelledRef } from '../frame/render-code.js';
import { useProvidedState } from '../frame/state.js';
import { PropsTable } from '../guide/props-table.js';
import { Heading, PartLink } from '../guide/sections.js';
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
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsGuideRoot(addLog), [addLog]),
    { external, open: true, outlined: true, title: 'Menu.Root' },
  );

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Menu.Root"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
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
      </div>
    </Component>
  );
};

/** `Menu.Trigger`, outlined, with its props. */
const TriggerPart: FunctionComponent = () => {
  const id = 'menu-parts-trigger';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsGuideTrigger(addLog), [addLog]),
    { external, open: true, outlined: true, title: 'Menu.Trigger' },
  );

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Menu.Trigger"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
        <Menu.Root>
          <Menu.Trigger {...props}>
            <Button.Label>Options</Button.Label>
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
      </div>
    </Component>
  );
};

/** `Menu.Portal`, outlined, with its props. */
const PortalPart: FunctionComponent = () => {
  const id = 'menu-parts-portal';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuidePortal, {
    external,
    open: true,
    outlined: true,
    title: 'Menu.Portal',
  });

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Menu.Portal"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
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
          <Menu.Portal
            container={screen}
            {...props}
          >
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
      </div>
    </Component>
  );
};

/** `Menu.Backdrop`, outlined, with its props. */
const BackdropPart: FunctionComponent = () => {
  const id = 'menu-parts-backdrop';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPart, {
    external,
    open: true,
    outlined: true,
    title: 'Menu.Backdrop',
  });

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Menu.Backdrop"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
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
          <Menu.Portal container={screen}>
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
      </div>
    </Component>
  );
};

/** `Menu.Positioner`, outlined, with its props. */
const PositionerPart: FunctionComponent = () => {
  const id = 'menu-parts-positioner';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPositioner, {
    external,
    open: true,
    outlined: true,
    title: 'Menu.Positioner',
  });

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Menu.Positioner"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
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
          <Menu.Portal container={screen}>
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
      </div>
    </Component>
  );
};

/** `Menu.Popup`, outlined, with its props. */
const PopupPart: FunctionComponent = () => {
  const id = 'menu-parts-popup';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPopup, {
    external,
    open: true,
    outlined: true,
    title: 'Menu.Popup',
  });

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Menu.Popup"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
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
          <Menu.Portal container={screen}>
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
      </div>
    </Component>
  );
};

/** `Menu.Item`, outlined, with its props. */
const ItemPart: FunctionComponent = () => {
  const id = 'menu-parts-item';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsGuideItem(addLog), [addLog]),
    { external, open: true, outlined: true, title: 'Menu.Item' },
  );

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Menu.Item"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
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
      </div>
    </Component>
  );
};

/** `Menu.LinkItem`, outlined, with its props. */
const LinkItemPart: FunctionComponent = () => {
  const id = 'menu-parts-link-item';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuideLinkItem, {
    external,
    open: true,
    outlined: true,
    title: 'Menu.LinkItem',
  });

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Menu.LinkItem"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
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
      </div>
    </Component>
  );
};

/** `Menu.CheckboxItem`, outlined, with its props. */
const CheckboxItemPart: FunctionComponent = () => {
  const id = 'menu-parts-checkbox-item';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsGuideCheckboxItem(addLog), [addLog]),
    { external, open: true, outlined: true, title: 'Menu.CheckboxItem' },
  );

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Menu.CheckboxItem"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
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
      </div>
    </Component>
  );
};

/** `Menu.CheckboxItemIndicator`, outlined, with its props. */
const CheckboxItemIndicatorPart: FunctionComponent = () => {
  const id = 'menu-parts-checkbox-item-indicator';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuideIndicator, {
    external,
    open: true,
    outlined: true,
    title: 'Menu.CheckboxItemIndicator',
  });

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Menu.CheckboxItemIndicator"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
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
      </div>
    </Component>
  );
};

/** `Menu.RadioGroup`, outlined, with its props. */
const RadioGroupPart: FunctionComponent = () => {
  const id = 'menu-parts-radio-group';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsRadioGroup(addLog), [addLog]),
    { external, open: true, outlined: true, title: 'Menu.RadioGroup' },
  );

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Menu.RadioGroup"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
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
      </div>
    </Component>
  );
};

/** `Menu.RadioItem`, outlined, with its props. */
const RadioItemPart: FunctionComponent = () => {
  const id = 'menu-parts-radio-item';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuideRadioItem, {
    external,
    open: true,
    outlined: true,
    title: 'Menu.RadioItem',
  });

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Menu.RadioItem"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
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
      </div>
    </Component>
  );
};

/** `Menu.RadioItemIndicator`, outlined, with its props. */
const RadioItemIndicatorPart: FunctionComponent = () => {
  const id = 'menu-parts-radio-item-indicator';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuideIndicator, {
    external,
    open: true,
    outlined: true,
    title: 'Menu.RadioItemIndicator',
  });

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Menu.RadioItemIndicator"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
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
      </div>
    </Component>
  );
};

/** `Menu.SubmenuRoot`, outlined, with its props. */
const SubmenuRootPart: FunctionComponent = () => {
  const id = 'menu-parts-submenu-root';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsSubmenuRoot(addLog), [addLog]),
    { external, open: true, outlined: true, title: 'Menu.SubmenuRoot' },
  );

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Menu.SubmenuRoot"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
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
      </div>
    </Component>
  );
};

/** `Menu.SubmenuTrigger`, outlined, with its props. */
const SubmenuTriggerPart: FunctionComponent = () => {
  const id = 'menu-parts-submenu-trigger';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsGuideSubmenuTrigger,
    { external, open: true, outlined: true, title: 'Menu.SubmenuTrigger' },
  );

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Menu.SubmenuTrigger"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
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
      </div>
    </Component>
  );
};

/** `Menu.Group`, outlined, with its props. */
const GroupPart: FunctionComponent = () => {
  const id = 'menu-parts-group';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPart, {
    external,
    open: true,
    outlined: true,
    title: 'Menu.Group',
  });

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Menu.Group"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
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
      </div>
    </Component>
  );
};

/** `Menu.GroupLabel`, outlined, with its props. */
const GroupLabelPart: FunctionComponent = () => {
  const id = 'menu-parts-group-label';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPart, {
    external,
    open: true,
    outlined: true,
    title: 'Menu.GroupLabel',
  });

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Menu.GroupLabel"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
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
      </div>
    </Component>
  );
};

/** `Menu.Separator`, outlined, with its props. */
const SeparatorPart: FunctionComponent = () => {
  const id = 'menu-parts-separator';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuideSeparator, {
    external,
    open: true,
    outlined: true,
    title: 'Menu.Separator',
  });

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Menu.Separator"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
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
      </div>
    </Component>
  );
};

/** `Menu.QuickActions`, outlined, with its props. */
const QuickActionsPart: FunctionComponent = () => {
  const id = 'menu-parts-quick-actions';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsElement, {
    external,
    open: true,
    outlined: true,
    title: 'Menu.QuickActions',
  });

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Menu.QuickActions"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
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
          <Menu.Portal container={screen}>
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
      </div>
    </Component>
  );
};

/** `Menu.QuickAction`, outlined, with its props. */
const QuickActionPart: FunctionComponent = () => {
  const id = 'menu-parts-quick-action';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsGuideItem(addLog), [addLog]),
    { external, open: true, outlined: true, title: 'Menu.QuickAction' },
  );

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Menu.QuickAction"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
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
          <Menu.Portal container={screen}>
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
      </div>
    </Component>
  );
};

/** `Menu.Icon`, outlined, with its props. */
const IconPart: FunctionComponent = () => {
  const id = 'menu-parts-icon';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsElement, {
    external,
    open: true,
    outlined: true,
    title: 'Menu.Icon',
  });

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Menu.Icon"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
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
      </div>
    </Component>
  );
};

/** `Menu.Label`, outlined, with its props. */
const LabelPart: FunctionComponent = () => {
  const id = 'menu-parts-label';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsElement, {
    external,
    open: true,
    outlined: true,
    title: 'Menu.Label',
  });

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Menu.Label"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
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
      </div>
    </Component>
  );
};

/** `Menu.Subtitle`, outlined, with its props. */
const SubtitlePart: FunctionComponent = () => {
  const id = 'menu-parts-subtitle';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsElement, {
    external,
    open: true,
    outlined: true,
    title: 'Menu.Subtitle',
  });

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Menu.Subtitle"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
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
      </div>
    </Component>
  );
};

/** `Menu.Shortcut`, outlined, with its props. */
const ShortcutPart: FunctionComponent = () => {
  const id = 'menu-parts-shortcut';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsElement, {
    external,
    open: true,
    outlined: true,
    title: 'Menu.Shortcut',
  });

  return (
    <Component
      center
      inline
      baseUiId="menu"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Menu.Shortcut"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
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
      </div>
    </Component>
  );
};

// Its trigger and its button, outside the root: made once, here.
const optionsMenu = codeLabel(Menu.createHandle(), 'optionsMenu');

/** `Menu.createHandle`: a trigger outside the root, an imperative open. */
const CreateHandlePart: FunctionComponent = () => {
  const id = 'menu-parts-create-handle';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');

  return (
    <Component
      center
      inline
      baseUiId="menu"
      id={id}
      log={log}
      title="Menu.createHandle"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
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
          onOpenChange={(open: boolean, { reason }) =>
            addLog(`open change: ${String(open)} (${reason})`)
          }
        >
          <Menu.Portal container={screen}>
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
      </div>
    </Component>
  );
};

/** `useCreateMenuHandle`: two triggers, one menu, its items theirs. */
const UseCreateMenuHandlePart: FunctionComponent = () => {
  const id = 'menu-parts-use-create-menu-handle';
  const [log, addLog] = useLog();
  const screen = useLabelledRef<HTMLDivElement>('screen');
  // Its triggers, outside the root, each with its payload: the file.
  const fileMenu = codeLabel(
    useCreateMenuHandle<{ file: string }>(),
    'fileMenu',
  );

  return (
    <Component
      center
      inline
      baseUiId="menu"
      id={id}
      log={log}
      title="useCreateMenuHandle"
    >
      <div
        ref={screen}
        className="demo-phone demo-centered demo-wallpaper"
      >
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
            <Menu.Portal container={screen}>
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
      </div>
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
        <code>Menu.Viewport</code> (iOS menus have neither), and filtering (
        <code>Menu.FilterRoot</code>, <code>Menu.Input</code>,{' '}
        <code>Menu.List</code>, <code>Menu.Empty</code>, …: iOS menus have no
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
        Size: <code>size</code>, for all its popups: <code>compact</code> (the
        iPhone’s menu) or <code>regular</code> (the iPad’s).
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
        An element covering the page under the popup (optional; unstyled: iOS
        menus don’t dim the page).
      </li>
      <li>Not rendered in a submenu.</li>
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
      <li>
        Closes the menu once its trigger scrolls out of view (as UIKit’s).
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
        The menu itself: glass (Figma “Liquid Glass - Medium”), at least 238px
        wide, scaling in from its trigger.
      </li>
      <li>
        Its selection moves between the items (the pointer’s, the keys’), a pill
        concentric with its corners.
      </li>
      <li>Taller than the room for it, it scrolls.</li>
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
        contents in Figma’s layout: [checkmark] [symbol] label/subtitle
        [shortcut | chevron].
      </li>
      <li>40px high (regular: 36px).</li>
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
        With toggles in a popup, all its items keep a column for the checkmark
        (Figma “Menu has Toggles”).
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
        The checkmark, while checked (Figma 􀆅, drawn as a stroke), at the item’s
        start.
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
        The checkmark of the chosen item (iOS’ radio items are checkmarks too).
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
        <code>openOnHover</code>).
      </li>
      <li>Regular: while its submenu is open, it keeps the selection.</li>
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
      <li>
        The section’s title (Figma “Section Title”), in the secondary label
        color.
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
      <li>A hairline between sections, inset 8px (Figma “Separator”).</li>
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
        A row of <PartLink part="Menu.QuickAction" />s at the popup’s top (Figma
        “Quick Actions”), inset 10px.
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
        A keyboard shortcut at the item’s end (iPad): its glyphs each in a cell
        (⌘R).
      </li>
      <li>
        Renders a <code>kbd</code>; shown only, the app handles the keys.
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
