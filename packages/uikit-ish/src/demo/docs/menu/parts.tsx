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
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
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
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'Menu.CheckboxItem': [],
            'Menu.CheckboxItemIndicator': [],
            'Menu.Group': [],
            'Menu.GroupLabel': [],
            'Menu.Icon': [],
            'Menu.Item': ['destructive', 'onClick'],
            'Menu.Label': [],
            'Menu.LinkItem': ['href'],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': [],
            'Menu.QuickAction': ['onClick'],
            'Menu.QuickActions': [],
            'Menu.RadioGroup': ['defaultValue'],
            'Menu.RadioItem': ['value'],
            'Menu.RadioItemIndicator': [],
            'Menu.Separator': [],
            'Menu.Shortcut': [],
            'Menu.SubmenuRoot': [],
            'Menu.SubmenuTrigger': [],
            'Menu.Subtitle': [],
            'Menu.Trigger': ['render'],
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
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Menu.Root"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Menu.Root
          key={elementKey}
          {...props}
        >
          <Menu.Trigger
            {...partProps['Menu.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal {...partProps['Menu.Portal']}>
            <Menu.Positioner {...partProps['Menu.Positioner']}>
              <Menu.Popup {...partProps['Menu.Popup']}>
                <Menu.QuickActions {...partProps['Menu.QuickActions']}>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Share clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquareAndArrowUp}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>Share</Menu.Label>
                  </Menu.QuickAction>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Favorite clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfHeart}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Favorite
                    </Menu.Label>
                  </Menu.QuickAction>
                </Menu.QuickActions>
                <Menu.Item
                  {...partProps['Menu.Item']}
                  onClick={() => addLog('Rename clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPencil}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Rename</Menu.Label>
                  <Menu.Shortcut {...partProps['Menu.Shortcut']}>
                    ⌘R
                  </Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Group {...partProps['Menu.Group']}>
                  <Menu.GroupLabel {...partProps['Menu.GroupLabel']}>
                    Sort By
                  </Menu.GroupLabel>
                  <Menu.RadioGroup
                    {...partProps['Menu.RadioGroup']}
                    defaultValue="date"
                  >
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="date"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="name"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.CheckboxItem
                  {...partProps['Menu.CheckboxItem']}
                  defaultChecked
                >
                  <Menu.CheckboxItemIndicator
                    {...partProps['Menu.CheckboxItemIndicator']}
                  />
                  <Menu.Label {...partProps['Menu.Label']}>Previews</Menu.Label>
                  <Menu.Subtitle {...partProps['Menu.Subtitle']}>
                    Show file contents
                  </Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot {...partProps['Menu.SubmenuRoot']}>
                  <Menu.SubmenuTrigger {...partProps['Menu.SubmenuTrigger']}>
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfFolder}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Move to
                    </Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal {...partProps['Menu.Portal']}>
                    <Menu.Positioner {...partProps['Menu.Positioner']}>
                      <Menu.Popup {...partProps['Menu.Popup']}>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Documents clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Documents
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Downloads clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Downloads
                          </Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.LinkItem
                  {...partProps['Menu.LinkItem']}
                  href="#"
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfLink}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Help</Menu.Label>
                </Menu.LinkItem>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Item
                  {...partProps['Menu.Item']}
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrash}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Delete</Menu.Label>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Label': [],
            'Menu.CheckboxItem': [],
            'Menu.CheckboxItemIndicator': [],
            'Menu.Group': [],
            'Menu.GroupLabel': [],
            'Menu.Icon': [],
            'Menu.Item': ['destructive', 'onClick'],
            'Menu.Label': [],
            'Menu.LinkItem': ['href'],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': [],
            'Menu.QuickAction': ['onClick'],
            'Menu.QuickActions': [],
            'Menu.RadioGroup': ['defaultValue'],
            'Menu.RadioItem': ['value'],
            'Menu.RadioItemIndicator': [],
            'Menu.Root': [],
            'Menu.Separator': [],
            'Menu.Shortcut': [],
            'Menu.SubmenuRoot': [],
            'Menu.SubmenuTrigger': [],
            'Menu.Subtitle': [],
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
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      setup={isHeld ? 'useTextActionsPrevention(trigger);' : undefined}
      stage="phone"
      state={[state, partState]}
      title="Menu.Trigger"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Menu.Root {...partProps['Menu.Root']}>
          <Menu.Trigger
            ref={trigger}
            {...props}
          >
            <Button.Label {...partProps['Button.Label']}>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal {...partProps['Menu.Portal']}>
            <Menu.Positioner {...partProps['Menu.Positioner']}>
              <Menu.Popup {...partProps['Menu.Popup']}>
                <Menu.QuickActions {...partProps['Menu.QuickActions']}>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Share clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquareAndArrowUp}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>Share</Menu.Label>
                  </Menu.QuickAction>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Favorite clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfHeart}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Favorite
                    </Menu.Label>
                  </Menu.QuickAction>
                </Menu.QuickActions>
                <Menu.Item
                  {...partProps['Menu.Item']}
                  onClick={() => addLog('Rename clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPencil}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Rename</Menu.Label>
                  <Menu.Shortcut {...partProps['Menu.Shortcut']}>
                    ⌘R
                  </Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Group {...partProps['Menu.Group']}>
                  <Menu.GroupLabel {...partProps['Menu.GroupLabel']}>
                    Sort By
                  </Menu.GroupLabel>
                  <Menu.RadioGroup
                    {...partProps['Menu.RadioGroup']}
                    defaultValue="date"
                  >
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="date"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="name"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.CheckboxItem
                  {...partProps['Menu.CheckboxItem']}
                  defaultChecked
                >
                  <Menu.CheckboxItemIndicator
                    {...partProps['Menu.CheckboxItemIndicator']}
                  />
                  <Menu.Label {...partProps['Menu.Label']}>Previews</Menu.Label>
                  <Menu.Subtitle {...partProps['Menu.Subtitle']}>
                    Show file contents
                  </Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot {...partProps['Menu.SubmenuRoot']}>
                  <Menu.SubmenuTrigger {...partProps['Menu.SubmenuTrigger']}>
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfFolder}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Move to
                    </Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal {...partProps['Menu.Portal']}>
                    <Menu.Positioner {...partProps['Menu.Positioner']}>
                      <Menu.Popup {...partProps['Menu.Popup']}>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Documents clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Documents
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Downloads clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Downloads
                          </Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.LinkItem
                  {...partProps['Menu.LinkItem']}
                  href="#"
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfLink}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Help</Menu.Label>
                </Menu.LinkItem>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Item
                  {...partProps['Menu.Item']}
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrash}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Delete</Menu.Label>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Menu.Portal (others)': [],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'Menu.CheckboxItem': [],
            'Menu.CheckboxItemIndicator': [],
            'Menu.Group': [],
            'Menu.GroupLabel': [],
            'Menu.Icon': [],
            'Menu.Item': ['destructive', 'onClick'],
            'Menu.Label': [],
            'Menu.LinkItem': ['href'],
            'Menu.Popup': [],
            'Menu.Positioner': [],
            'Menu.QuickAction': ['onClick'],
            'Menu.QuickActions': [],
            'Menu.RadioGroup': ['defaultValue'],
            'Menu.RadioItem': ['value'],
            'Menu.RadioItemIndicator': [],
            'Menu.Root': [],
            'Menu.Separator': [],
            'Menu.Shortcut': [],
            'Menu.SubmenuRoot': [],
            'Menu.SubmenuTrigger': [],
            'Menu.Subtitle': [],
            'Menu.Trigger': ['render'],
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
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Menu.Portal"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Menu.Root {...partProps['Menu.Root']}>
          <Menu.Trigger
            {...partProps['Menu.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal {...props}>
            <Menu.Positioner {...partProps['Menu.Positioner']}>
              <Menu.Popup {...partProps['Menu.Popup']}>
                <Menu.QuickActions {...partProps['Menu.QuickActions']}>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Share clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquareAndArrowUp}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>Share</Menu.Label>
                  </Menu.QuickAction>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Favorite clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfHeart}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Favorite
                    </Menu.Label>
                  </Menu.QuickAction>
                </Menu.QuickActions>
                <Menu.Item
                  {...partProps['Menu.Item']}
                  onClick={() => addLog('Rename clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPencil}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Rename</Menu.Label>
                  <Menu.Shortcut {...partProps['Menu.Shortcut']}>
                    ⌘R
                  </Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Group {...partProps['Menu.Group']}>
                  <Menu.GroupLabel {...partProps['Menu.GroupLabel']}>
                    Sort By
                  </Menu.GroupLabel>
                  <Menu.RadioGroup
                    {...partProps['Menu.RadioGroup']}
                    defaultValue="date"
                  >
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="date"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="name"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.CheckboxItem
                  {...partProps['Menu.CheckboxItem']}
                  defaultChecked
                >
                  <Menu.CheckboxItemIndicator
                    {...partProps['Menu.CheckboxItemIndicator']}
                  />
                  <Menu.Label {...partProps['Menu.Label']}>Previews</Menu.Label>
                  <Menu.Subtitle {...partProps['Menu.Subtitle']}>
                    Show file contents
                  </Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot {...partProps['Menu.SubmenuRoot']}>
                  <Menu.SubmenuTrigger {...partProps['Menu.SubmenuTrigger']}>
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfFolder}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Move to
                    </Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal {...partProps['Menu.Portal (others)']}>
                    <Menu.Positioner {...partProps['Menu.Positioner']}>
                      <Menu.Popup {...partProps['Menu.Popup']}>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Documents clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Documents
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Downloads clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Downloads
                          </Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.LinkItem
                  {...partProps['Menu.LinkItem']}
                  href="#"
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfLink}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Help</Menu.Label>
                </Menu.LinkItem>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Item
                  {...partProps['Menu.Item']}
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrash}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Delete</Menu.Label>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'Menu.CheckboxItem': [],
            'Menu.CheckboxItemIndicator': [],
            'Menu.Group': [],
            'Menu.GroupLabel': [],
            'Menu.Icon': [],
            'Menu.Item': ['destructive', 'onClick'],
            'Menu.Label': [],
            'Menu.LinkItem': ['href'],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': [],
            'Menu.QuickAction': ['onClick'],
            'Menu.QuickActions': [],
            'Menu.RadioGroup': ['defaultValue'],
            'Menu.RadioItem': ['value'],
            'Menu.RadioItemIndicator': [],
            'Menu.Root': [],
            'Menu.Separator': [],
            'Menu.Shortcut': [],
            'Menu.SubmenuRoot': [],
            'Menu.SubmenuTrigger': [],
            'Menu.Subtitle': [],
            'Menu.Trigger': ['render'],
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
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Menu.Backdrop"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Menu.Root {...partProps['Menu.Root']}>
          <Menu.Trigger
            {...partProps['Menu.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal {...partProps['Menu.Portal']}>
            <Menu.Backdrop {...props} />
            <Menu.Positioner {...partProps['Menu.Positioner']}>
              <Menu.Popup {...partProps['Menu.Popup']}>
                <Menu.QuickActions {...partProps['Menu.QuickActions']}>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Share clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquareAndArrowUp}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>Share</Menu.Label>
                  </Menu.QuickAction>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Favorite clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfHeart}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Favorite
                    </Menu.Label>
                  </Menu.QuickAction>
                </Menu.QuickActions>
                <Menu.Item
                  {...partProps['Menu.Item']}
                  onClick={() => addLog('Rename clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPencil}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Rename</Menu.Label>
                  <Menu.Shortcut {...partProps['Menu.Shortcut']}>
                    ⌘R
                  </Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Group {...partProps['Menu.Group']}>
                  <Menu.GroupLabel {...partProps['Menu.GroupLabel']}>
                    Sort By
                  </Menu.GroupLabel>
                  <Menu.RadioGroup
                    {...partProps['Menu.RadioGroup']}
                    defaultValue="date"
                  >
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="date"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="name"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.CheckboxItem
                  {...partProps['Menu.CheckboxItem']}
                  defaultChecked
                >
                  <Menu.CheckboxItemIndicator
                    {...partProps['Menu.CheckboxItemIndicator']}
                  />
                  <Menu.Label {...partProps['Menu.Label']}>Previews</Menu.Label>
                  <Menu.Subtitle {...partProps['Menu.Subtitle']}>
                    Show file contents
                  </Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot {...partProps['Menu.SubmenuRoot']}>
                  <Menu.SubmenuTrigger {...partProps['Menu.SubmenuTrigger']}>
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfFolder}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Move to
                    </Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal {...partProps['Menu.Portal']}>
                    <Menu.Positioner {...partProps['Menu.Positioner']}>
                      <Menu.Popup {...partProps['Menu.Popup']}>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Documents clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Documents
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Downloads clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Downloads
                          </Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.LinkItem
                  {...partProps['Menu.LinkItem']}
                  href="#"
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfLink}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Help</Menu.Label>
                </Menu.LinkItem>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Item
                  {...partProps['Menu.Item']}
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrash}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Delete</Menu.Label>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Menu.Positioner (others)': [],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'Menu.CheckboxItem': [],
            'Menu.CheckboxItemIndicator': [],
            'Menu.Group': [],
            'Menu.GroupLabel': [],
            'Menu.Icon': [],
            'Menu.Item': ['destructive', 'onClick'],
            'Menu.Label': [],
            'Menu.LinkItem': ['href'],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.QuickAction': ['onClick'],
            'Menu.QuickActions': [],
            'Menu.RadioGroup': ['defaultValue'],
            'Menu.RadioItem': ['value'],
            'Menu.RadioItemIndicator': [],
            'Menu.Root': [],
            'Menu.Separator': [],
            'Menu.Shortcut': [],
            'Menu.SubmenuRoot': [],
            'Menu.SubmenuTrigger': [],
            'Menu.Subtitle': [],
            'Menu.Trigger': ['render'],
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
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Menu.Positioner"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Menu.Root {...partProps['Menu.Root']}>
          <Menu.Trigger
            {...partProps['Menu.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal {...partProps['Menu.Portal']}>
            <Menu.Positioner {...props}>
              <Menu.Popup {...partProps['Menu.Popup']}>
                <Menu.QuickActions {...partProps['Menu.QuickActions']}>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Share clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquareAndArrowUp}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>Share</Menu.Label>
                  </Menu.QuickAction>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Favorite clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfHeart}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Favorite
                    </Menu.Label>
                  </Menu.QuickAction>
                </Menu.QuickActions>
                <Menu.Item
                  {...partProps['Menu.Item']}
                  onClick={() => addLog('Rename clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPencil}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Rename</Menu.Label>
                  <Menu.Shortcut {...partProps['Menu.Shortcut']}>
                    ⌘R
                  </Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Group {...partProps['Menu.Group']}>
                  <Menu.GroupLabel {...partProps['Menu.GroupLabel']}>
                    Sort By
                  </Menu.GroupLabel>
                  <Menu.RadioGroup
                    {...partProps['Menu.RadioGroup']}
                    defaultValue="date"
                  >
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="date"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="name"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.CheckboxItem
                  {...partProps['Menu.CheckboxItem']}
                  defaultChecked
                >
                  <Menu.CheckboxItemIndicator
                    {...partProps['Menu.CheckboxItemIndicator']}
                  />
                  <Menu.Label {...partProps['Menu.Label']}>Previews</Menu.Label>
                  <Menu.Subtitle {...partProps['Menu.Subtitle']}>
                    Show file contents
                  </Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot {...partProps['Menu.SubmenuRoot']}>
                  <Menu.SubmenuTrigger {...partProps['Menu.SubmenuTrigger']}>
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfFolder}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Move to
                    </Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal {...partProps['Menu.Portal']}>
                    <Menu.Positioner {...partProps['Menu.Positioner (others)']}>
                      <Menu.Popup {...partProps['Menu.Popup']}>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Documents clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Documents
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Downloads clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Downloads
                          </Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.LinkItem
                  {...partProps['Menu.LinkItem']}
                  href="#"
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfLink}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Help</Menu.Label>
                </Menu.LinkItem>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Item
                  {...partProps['Menu.Item']}
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrash}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Delete</Menu.Label>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Menu.Popup (others)': [],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'Menu.CheckboxItem': [],
            'Menu.CheckboxItemIndicator': [],
            'Menu.Group': [],
            'Menu.GroupLabel': [],
            'Menu.Icon': [],
            'Menu.Item': ['destructive', 'onClick'],
            'Menu.Label': [],
            'Menu.LinkItem': ['href'],
            'Menu.Portal': [],
            'Menu.Positioner': [],
            'Menu.QuickAction': ['onClick'],
            'Menu.QuickActions': [],
            'Menu.RadioGroup': ['defaultValue'],
            'Menu.RadioItem': ['value'],
            'Menu.RadioItemIndicator': [],
            'Menu.Root': [],
            'Menu.Separator': [],
            'Menu.Shortcut': [],
            'Menu.SubmenuRoot': [],
            'Menu.SubmenuTrigger': [],
            'Menu.Subtitle': [],
            'Menu.Trigger': ['render'],
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
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Menu.Popup"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Menu.Root {...partProps['Menu.Root']}>
          <Menu.Trigger
            {...partProps['Menu.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal {...partProps['Menu.Portal']}>
            <Menu.Positioner {...partProps['Menu.Positioner']}>
              <Menu.Popup {...props}>
                <Menu.QuickActions {...partProps['Menu.QuickActions']}>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Share clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquareAndArrowUp}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>Share</Menu.Label>
                  </Menu.QuickAction>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Favorite clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfHeart}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Favorite
                    </Menu.Label>
                  </Menu.QuickAction>
                </Menu.QuickActions>
                <Menu.Item
                  {...partProps['Menu.Item']}
                  onClick={() => addLog('Rename clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPencil}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Rename</Menu.Label>
                  <Menu.Shortcut {...partProps['Menu.Shortcut']}>
                    ⌘R
                  </Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Group {...partProps['Menu.Group']}>
                  <Menu.GroupLabel {...partProps['Menu.GroupLabel']}>
                    Sort By
                  </Menu.GroupLabel>
                  <Menu.RadioGroup
                    {...partProps['Menu.RadioGroup']}
                    defaultValue="date"
                  >
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="date"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="name"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.CheckboxItem
                  {...partProps['Menu.CheckboxItem']}
                  defaultChecked
                >
                  <Menu.CheckboxItemIndicator
                    {...partProps['Menu.CheckboxItemIndicator']}
                  />
                  <Menu.Label {...partProps['Menu.Label']}>Previews</Menu.Label>
                  <Menu.Subtitle {...partProps['Menu.Subtitle']}>
                    Show file contents
                  </Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot {...partProps['Menu.SubmenuRoot']}>
                  <Menu.SubmenuTrigger {...partProps['Menu.SubmenuTrigger']}>
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfFolder}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Move to
                    </Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal {...partProps['Menu.Portal']}>
                    <Menu.Positioner {...partProps['Menu.Positioner']}>
                      <Menu.Popup {...partProps['Menu.Popup (others)']}>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Documents clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Documents
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Downloads clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Downloads
                          </Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.LinkItem
                  {...partProps['Menu.LinkItem']}
                  href="#"
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfLink}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Help</Menu.Label>
                </Menu.LinkItem>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Item
                  {...partProps['Menu.Item']}
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrash}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Delete</Menu.Label>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Menu.Item (others)': ['destructive', 'onClick'],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'Menu.CheckboxItem': [],
            'Menu.CheckboxItemIndicator': [],
            'Menu.Group': [],
            'Menu.GroupLabel': [],
            'Menu.Icon': [],
            'Menu.Label': [],
            'Menu.LinkItem': ['href'],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': [],
            'Menu.QuickAction': ['onClick'],
            'Menu.QuickActions': [],
            'Menu.RadioGroup': ['defaultValue'],
            'Menu.RadioItem': ['value'],
            'Menu.RadioItemIndicator': [],
            'Menu.Root': [],
            'Menu.Separator': [],
            'Menu.Shortcut': [],
            'Menu.SubmenuRoot': [],
            'Menu.SubmenuTrigger': [],
            'Menu.Subtitle': [],
            'Menu.Trigger': ['render'],
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
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Menu.Item"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Menu.Root {...partProps['Menu.Root']}>
          <Menu.Trigger
            {...partProps['Menu.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal {...partProps['Menu.Portal']}>
            <Menu.Positioner {...partProps['Menu.Positioner']}>
              <Menu.Popup {...partProps['Menu.Popup']}>
                <Menu.QuickActions {...partProps['Menu.QuickActions']}>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Share clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquareAndArrowUp}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>Share</Menu.Label>
                  </Menu.QuickAction>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Favorite clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfHeart}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Favorite
                    </Menu.Label>
                  </Menu.QuickAction>
                </Menu.QuickActions>
                <Menu.Item
                  {...props}
                  onClick={() => addLog('Rename clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPencil}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Rename</Menu.Label>
                  <Menu.Shortcut {...partProps['Menu.Shortcut']}>
                    ⌘R
                  </Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Group {...partProps['Menu.Group']}>
                  <Menu.GroupLabel {...partProps['Menu.GroupLabel']}>
                    Sort By
                  </Menu.GroupLabel>
                  <Menu.RadioGroup
                    {...partProps['Menu.RadioGroup']}
                    defaultValue="date"
                  >
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="date"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="name"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.CheckboxItem
                  {...partProps['Menu.CheckboxItem']}
                  defaultChecked
                >
                  <Menu.CheckboxItemIndicator
                    {...partProps['Menu.CheckboxItemIndicator']}
                  />
                  <Menu.Label {...partProps['Menu.Label']}>Previews</Menu.Label>
                  <Menu.Subtitle {...partProps['Menu.Subtitle']}>
                    Show file contents
                  </Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot {...partProps['Menu.SubmenuRoot']}>
                  <Menu.SubmenuTrigger {...partProps['Menu.SubmenuTrigger']}>
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfFolder}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Move to
                    </Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal {...partProps['Menu.Portal']}>
                    <Menu.Positioner {...partProps['Menu.Positioner']}>
                      <Menu.Popup {...partProps['Menu.Popup']}>
                        <Menu.Item
                          {...partProps['Menu.Item (others)']}
                          onClick={() => addLog('Documents clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Documents
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          {...partProps['Menu.Item (others)']}
                          onClick={() => addLog('Downloads clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Downloads
                          </Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.LinkItem
                  {...partProps['Menu.LinkItem']}
                  href="#"
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfLink}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Help</Menu.Label>
                </Menu.LinkItem>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Item
                  {...partProps['Menu.Item (others)']}
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrash}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Delete</Menu.Label>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'Menu.CheckboxItem': [],
            'Menu.CheckboxItemIndicator': [],
            'Menu.Group': [],
            'Menu.GroupLabel': [],
            'Menu.Icon': [],
            'Menu.Item': ['destructive', 'onClick'],
            'Menu.Label': [],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': [],
            'Menu.QuickAction': ['onClick'],
            'Menu.QuickActions': [],
            'Menu.RadioGroup': ['defaultValue'],
            'Menu.RadioItem': ['value'],
            'Menu.RadioItemIndicator': [],
            'Menu.Root': [],
            'Menu.Separator': [],
            'Menu.Shortcut': [],
            'Menu.SubmenuRoot': [],
            'Menu.SubmenuTrigger': [],
            'Menu.Subtitle': [],
            'Menu.Trigger': ['render'],
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
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Menu.LinkItem"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Menu.Root {...partProps['Menu.Root']}>
          <Menu.Trigger
            {...partProps['Menu.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal {...partProps['Menu.Portal']}>
            <Menu.Positioner {...partProps['Menu.Positioner']}>
              <Menu.Popup {...partProps['Menu.Popup']}>
                <Menu.QuickActions {...partProps['Menu.QuickActions']}>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Share clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquareAndArrowUp}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>Share</Menu.Label>
                  </Menu.QuickAction>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Favorite clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfHeart}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Favorite
                    </Menu.Label>
                  </Menu.QuickAction>
                </Menu.QuickActions>
                <Menu.Item
                  {...partProps['Menu.Item']}
                  onClick={() => addLog('Rename clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPencil}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Rename</Menu.Label>
                  <Menu.Shortcut {...partProps['Menu.Shortcut']}>
                    ⌘R
                  </Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Group {...partProps['Menu.Group']}>
                  <Menu.GroupLabel {...partProps['Menu.GroupLabel']}>
                    Sort By
                  </Menu.GroupLabel>
                  <Menu.RadioGroup
                    {...partProps['Menu.RadioGroup']}
                    defaultValue="date"
                  >
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="date"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="name"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.CheckboxItem
                  {...partProps['Menu.CheckboxItem']}
                  defaultChecked
                >
                  <Menu.CheckboxItemIndicator
                    {...partProps['Menu.CheckboxItemIndicator']}
                  />
                  <Menu.Label {...partProps['Menu.Label']}>Previews</Menu.Label>
                  <Menu.Subtitle {...partProps['Menu.Subtitle']}>
                    Show file contents
                  </Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot {...partProps['Menu.SubmenuRoot']}>
                  <Menu.SubmenuTrigger {...partProps['Menu.SubmenuTrigger']}>
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfFolder}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Move to
                    </Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal {...partProps['Menu.Portal']}>
                    <Menu.Positioner {...partProps['Menu.Positioner']}>
                      <Menu.Popup {...partProps['Menu.Popup']}>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Documents clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Documents
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Downloads clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Downloads
                          </Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.LinkItem {...props}>
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfLink}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Help</Menu.Label>
                </Menu.LinkItem>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Item
                  {...partProps['Menu.Item']}
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrash}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Delete</Menu.Label>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'Menu.CheckboxItemIndicator': [],
            'Menu.Group': [],
            'Menu.GroupLabel': [],
            'Menu.Icon': [],
            'Menu.Item': ['destructive', 'onClick'],
            'Menu.Label': [],
            'Menu.LinkItem': ['href'],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': [],
            'Menu.QuickAction': ['onClick'],
            'Menu.QuickActions': [],
            'Menu.RadioGroup': ['defaultValue'],
            'Menu.RadioItem': ['value'],
            'Menu.RadioItemIndicator': [],
            'Menu.Root': [],
            'Menu.Separator': [],
            'Menu.Shortcut': [],
            'Menu.SubmenuRoot': [],
            'Menu.SubmenuTrigger': [],
            'Menu.Subtitle': [],
            'Menu.Trigger': ['render'],
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
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Menu.CheckboxItem"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Menu.Root
          key={elementKey}
          {...partProps['Menu.Root']}
        >
          <Menu.Trigger
            {...partProps['Menu.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal {...partProps['Menu.Portal']}>
            <Menu.Positioner {...partProps['Menu.Positioner']}>
              <Menu.Popup {...partProps['Menu.Popup']}>
                <Menu.QuickActions {...partProps['Menu.QuickActions']}>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Share clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquareAndArrowUp}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>Share</Menu.Label>
                  </Menu.QuickAction>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Favorite clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfHeart}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Favorite
                    </Menu.Label>
                  </Menu.QuickAction>
                </Menu.QuickActions>
                <Menu.Item
                  {...partProps['Menu.Item']}
                  onClick={() => addLog('Rename clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPencil}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Rename</Menu.Label>
                  <Menu.Shortcut {...partProps['Menu.Shortcut']}>
                    ⌘R
                  </Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Group {...partProps['Menu.Group']}>
                  <Menu.GroupLabel {...partProps['Menu.GroupLabel']}>
                    Sort By
                  </Menu.GroupLabel>
                  <Menu.RadioGroup
                    {...partProps['Menu.RadioGroup']}
                    defaultValue="date"
                  >
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="date"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="name"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.CheckboxItem {...props}>
                  <Menu.CheckboxItemIndicator
                    {...partProps['Menu.CheckboxItemIndicator']}
                  />
                  <Menu.Label {...partProps['Menu.Label']}>Previews</Menu.Label>
                  <Menu.Subtitle {...partProps['Menu.Subtitle']}>
                    Show file contents
                  </Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot {...partProps['Menu.SubmenuRoot']}>
                  <Menu.SubmenuTrigger {...partProps['Menu.SubmenuTrigger']}>
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfFolder}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Move to
                    </Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal {...partProps['Menu.Portal']}>
                    <Menu.Positioner {...partProps['Menu.Positioner']}>
                      <Menu.Popup {...partProps['Menu.Popup']}>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Documents clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Documents
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Downloads clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Downloads
                          </Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.LinkItem
                  {...partProps['Menu.LinkItem']}
                  href="#"
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfLink}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Help</Menu.Label>
                </Menu.LinkItem>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Item
                  {...partProps['Menu.Item']}
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrash}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Delete</Menu.Label>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'Menu.CheckboxItem': [],
            'Menu.Group': [],
            'Menu.GroupLabel': [],
            'Menu.Icon': [],
            'Menu.Item': ['destructive', 'onClick'],
            'Menu.Label': [],
            'Menu.LinkItem': ['href'],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': [],
            'Menu.QuickAction': ['onClick'],
            'Menu.QuickActions': [],
            'Menu.RadioGroup': ['defaultValue'],
            'Menu.RadioItem': ['value'],
            'Menu.RadioItemIndicator': [],
            'Menu.Root': [],
            'Menu.Separator': [],
            'Menu.Shortcut': [],
            'Menu.SubmenuRoot': [],
            'Menu.SubmenuTrigger': [],
            'Menu.Subtitle': [],
            'Menu.Trigger': ['render'],
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
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Menu.CheckboxItemIndicator"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Menu.Root {...partProps['Menu.Root']}>
          <Menu.Trigger
            {...partProps['Menu.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal {...partProps['Menu.Portal']}>
            <Menu.Positioner {...partProps['Menu.Positioner']}>
              <Menu.Popup {...partProps['Menu.Popup']}>
                <Menu.QuickActions {...partProps['Menu.QuickActions']}>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Share clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquareAndArrowUp}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>Share</Menu.Label>
                  </Menu.QuickAction>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Favorite clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfHeart}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Favorite
                    </Menu.Label>
                  </Menu.QuickAction>
                </Menu.QuickActions>
                <Menu.Item
                  {...partProps['Menu.Item']}
                  onClick={() => addLog('Rename clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPencil}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Rename</Menu.Label>
                  <Menu.Shortcut {...partProps['Menu.Shortcut']}>
                    ⌘R
                  </Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Group {...partProps['Menu.Group']}>
                  <Menu.GroupLabel {...partProps['Menu.GroupLabel']}>
                    Sort By
                  </Menu.GroupLabel>
                  <Menu.RadioGroup
                    {...partProps['Menu.RadioGroup']}
                    defaultValue="date"
                  >
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="date"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="name"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.CheckboxItem
                  {...partProps['Menu.CheckboxItem']}
                  defaultChecked
                >
                  <Menu.CheckboxItemIndicator {...props} />
                  <Menu.Label {...partProps['Menu.Label']}>Previews</Menu.Label>
                  <Menu.Subtitle {...partProps['Menu.Subtitle']}>
                    Show file contents
                  </Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot {...partProps['Menu.SubmenuRoot']}>
                  <Menu.SubmenuTrigger {...partProps['Menu.SubmenuTrigger']}>
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfFolder}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Move to
                    </Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal {...partProps['Menu.Portal']}>
                    <Menu.Positioner {...partProps['Menu.Positioner']}>
                      <Menu.Popup {...partProps['Menu.Popup']}>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Documents clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Documents
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Downloads clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Downloads
                          </Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.LinkItem
                  {...partProps['Menu.LinkItem']}
                  href="#"
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfLink}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Help</Menu.Label>
                </Menu.LinkItem>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Item
                  {...partProps['Menu.Item']}
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrash}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Delete</Menu.Label>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'Menu.CheckboxItem': [],
            'Menu.CheckboxItemIndicator': [],
            'Menu.Group': [],
            'Menu.GroupLabel': [],
            'Menu.Icon': [],
            'Menu.Item': ['destructive', 'onClick'],
            'Menu.Label': [],
            'Menu.LinkItem': ['href'],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': [],
            'Menu.QuickAction': ['onClick'],
            'Menu.QuickActions': [],
            'Menu.RadioItem': ['value'],
            'Menu.RadioItemIndicator': [],
            'Menu.Root': [],
            'Menu.Separator': [],
            'Menu.Shortcut': [],
            'Menu.SubmenuRoot': [],
            'Menu.SubmenuTrigger': [],
            'Menu.Subtitle': [],
            'Menu.Trigger': ['render'],
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
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Menu.RadioGroup"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Menu.Root
          key={elementKey}
          {...partProps['Menu.Root']}
        >
          <Menu.Trigger
            {...partProps['Menu.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal {...partProps['Menu.Portal']}>
            <Menu.Positioner {...partProps['Menu.Positioner']}>
              <Menu.Popup {...partProps['Menu.Popup']}>
                <Menu.QuickActions {...partProps['Menu.QuickActions']}>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Share clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquareAndArrowUp}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>Share</Menu.Label>
                  </Menu.QuickAction>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Favorite clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfHeart}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Favorite
                    </Menu.Label>
                  </Menu.QuickAction>
                </Menu.QuickActions>
                <Menu.Item
                  {...partProps['Menu.Item']}
                  onClick={() => addLog('Rename clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPencil}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Rename</Menu.Label>
                  <Menu.Shortcut {...partProps['Menu.Shortcut']}>
                    ⌘R
                  </Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Group {...partProps['Menu.Group']}>
                  <Menu.GroupLabel {...partProps['Menu.GroupLabel']}>
                    Sort By
                  </Menu.GroupLabel>
                  <Menu.RadioGroup {...props}>
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="date"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="name"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.CheckboxItem
                  {...partProps['Menu.CheckboxItem']}
                  defaultChecked
                >
                  <Menu.CheckboxItemIndicator
                    {...partProps['Menu.CheckboxItemIndicator']}
                  />
                  <Menu.Label {...partProps['Menu.Label']}>Previews</Menu.Label>
                  <Menu.Subtitle {...partProps['Menu.Subtitle']}>
                    Show file contents
                  </Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot {...partProps['Menu.SubmenuRoot']}>
                  <Menu.SubmenuTrigger {...partProps['Menu.SubmenuTrigger']}>
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfFolder}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Move to
                    </Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal {...partProps['Menu.Portal']}>
                    <Menu.Positioner {...partProps['Menu.Positioner']}>
                      <Menu.Popup {...partProps['Menu.Popup']}>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Documents clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Documents
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Downloads clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Downloads
                          </Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.LinkItem
                  {...partProps['Menu.LinkItem']}
                  href="#"
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfLink}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Help</Menu.Label>
                </Menu.LinkItem>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Item
                  {...partProps['Menu.Item']}
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrash}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Delete</Menu.Label>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Menu.RadioItem (others)': ['value'],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'Menu.CheckboxItem': [],
            'Menu.CheckboxItemIndicator': [],
            'Menu.Group': [],
            'Menu.GroupLabel': [],
            'Menu.Icon': [],
            'Menu.Item': ['destructive', 'onClick'],
            'Menu.Label': [],
            'Menu.LinkItem': ['href'],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': [],
            'Menu.QuickAction': ['onClick'],
            'Menu.QuickActions': [],
            'Menu.RadioGroup': ['defaultValue'],
            'Menu.RadioItemIndicator': [],
            'Menu.Root': [],
            'Menu.Separator': [],
            'Menu.Shortcut': [],
            'Menu.SubmenuRoot': [],
            'Menu.SubmenuTrigger': [],
            'Menu.Subtitle': [],
            'Menu.Trigger': ['render'],
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
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Menu.RadioItem"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Menu.Root {...partProps['Menu.Root']}>
          <Menu.Trigger
            {...partProps['Menu.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal {...partProps['Menu.Portal']}>
            <Menu.Positioner {...partProps['Menu.Positioner']}>
              <Menu.Popup {...partProps['Menu.Popup']}>
                <Menu.QuickActions {...partProps['Menu.QuickActions']}>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Share clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquareAndArrowUp}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>Share</Menu.Label>
                  </Menu.QuickAction>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Favorite clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfHeart}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Favorite
                    </Menu.Label>
                  </Menu.QuickAction>
                </Menu.QuickActions>
                <Menu.Item
                  {...partProps['Menu.Item']}
                  onClick={() => addLog('Rename clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPencil}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Rename</Menu.Label>
                  <Menu.Shortcut {...partProps['Menu.Shortcut']}>
                    ⌘R
                  </Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Group {...partProps['Menu.Group']}>
                  <Menu.GroupLabel {...partProps['Menu.GroupLabel']}>
                    Sort By
                  </Menu.GroupLabel>
                  <Menu.RadioGroup
                    {...partProps['Menu.RadioGroup']}
                    defaultValue="date"
                  >
                    <Menu.RadioItem
                      {...props}
                      value="date"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem (others)']}
                      value="name"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.CheckboxItem
                  {...partProps['Menu.CheckboxItem']}
                  defaultChecked
                >
                  <Menu.CheckboxItemIndicator
                    {...partProps['Menu.CheckboxItemIndicator']}
                  />
                  <Menu.Label {...partProps['Menu.Label']}>Previews</Menu.Label>
                  <Menu.Subtitle {...partProps['Menu.Subtitle']}>
                    Show file contents
                  </Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot {...partProps['Menu.SubmenuRoot']}>
                  <Menu.SubmenuTrigger {...partProps['Menu.SubmenuTrigger']}>
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfFolder}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Move to
                    </Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal {...partProps['Menu.Portal']}>
                    <Menu.Positioner {...partProps['Menu.Positioner']}>
                      <Menu.Popup {...partProps['Menu.Popup']}>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Documents clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Documents
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Downloads clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Downloads
                          </Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.LinkItem
                  {...partProps['Menu.LinkItem']}
                  href="#"
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfLink}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Help</Menu.Label>
                </Menu.LinkItem>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Item
                  {...partProps['Menu.Item']}
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrash}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Delete</Menu.Label>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Menu.RadioItemIndicator (others)': [],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'Menu.CheckboxItem': [],
            'Menu.CheckboxItemIndicator': [],
            'Menu.Group': [],
            'Menu.GroupLabel': [],
            'Menu.Icon': [],
            'Menu.Item': ['destructive', 'onClick'],
            'Menu.Label': [],
            'Menu.LinkItem': ['href'],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': [],
            'Menu.QuickAction': ['onClick'],
            'Menu.QuickActions': [],
            'Menu.RadioGroup': ['defaultValue'],
            'Menu.RadioItem': ['value'],
            'Menu.Root': [],
            'Menu.Separator': [],
            'Menu.Shortcut': [],
            'Menu.SubmenuRoot': [],
            'Menu.SubmenuTrigger': [],
            'Menu.Subtitle': [],
            'Menu.Trigger': ['render'],
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
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Menu.RadioItemIndicator"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Menu.Root {...partProps['Menu.Root']}>
          <Menu.Trigger
            {...partProps['Menu.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal {...partProps['Menu.Portal']}>
            <Menu.Positioner {...partProps['Menu.Positioner']}>
              <Menu.Popup {...partProps['Menu.Popup']}>
                <Menu.QuickActions {...partProps['Menu.QuickActions']}>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Share clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquareAndArrowUp}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>Share</Menu.Label>
                  </Menu.QuickAction>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Favorite clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfHeart}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Favorite
                    </Menu.Label>
                  </Menu.QuickAction>
                </Menu.QuickActions>
                <Menu.Item
                  {...partProps['Menu.Item']}
                  onClick={() => addLog('Rename clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPencil}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Rename</Menu.Label>
                  <Menu.Shortcut {...partProps['Menu.Shortcut']}>
                    ⌘R
                  </Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Group {...partProps['Menu.Group']}>
                  <Menu.GroupLabel {...partProps['Menu.GroupLabel']}>
                    Sort By
                  </Menu.GroupLabel>
                  <Menu.RadioGroup
                    {...partProps['Menu.RadioGroup']}
                    defaultValue="date"
                  >
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="date"
                    >
                      <Menu.RadioItemIndicator {...props} />
                      <Menu.Label {...partProps['Menu.Label']}>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="name"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator (others)']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.CheckboxItem
                  {...partProps['Menu.CheckboxItem']}
                  defaultChecked
                >
                  <Menu.CheckboxItemIndicator
                    {...partProps['Menu.CheckboxItemIndicator']}
                  />
                  <Menu.Label {...partProps['Menu.Label']}>Previews</Menu.Label>
                  <Menu.Subtitle {...partProps['Menu.Subtitle']}>
                    Show file contents
                  </Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot {...partProps['Menu.SubmenuRoot']}>
                  <Menu.SubmenuTrigger {...partProps['Menu.SubmenuTrigger']}>
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfFolder}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Move to
                    </Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal {...partProps['Menu.Portal']}>
                    <Menu.Positioner {...partProps['Menu.Positioner']}>
                      <Menu.Popup {...partProps['Menu.Popup']}>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Documents clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Documents
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Downloads clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Downloads
                          </Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.LinkItem
                  {...partProps['Menu.LinkItem']}
                  href="#"
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfLink}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Help</Menu.Label>
                </Menu.LinkItem>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Item
                  {...partProps['Menu.Item']}
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrash}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Delete</Menu.Label>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'Menu.CheckboxItem': [],
            'Menu.CheckboxItemIndicator': [],
            'Menu.Group': [],
            'Menu.GroupLabel': [],
            'Menu.Icon': [],
            'Menu.Item': ['destructive', 'onClick'],
            'Menu.Label': [],
            'Menu.LinkItem': ['href'],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': [],
            'Menu.QuickAction': ['onClick'],
            'Menu.QuickActions': [],
            'Menu.RadioGroup': ['defaultValue'],
            'Menu.RadioItem': ['value'],
            'Menu.RadioItemIndicator': [],
            'Menu.Root': [],
            'Menu.Separator': [],
            'Menu.Shortcut': [],
            'Menu.SubmenuTrigger': [],
            'Menu.Subtitle': [],
            'Menu.Trigger': ['render'],
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
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Menu.SubmenuRoot"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Menu.Root {...partProps['Menu.Root']}>
          <Menu.Trigger
            {...partProps['Menu.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal {...partProps['Menu.Portal']}>
            <Menu.Positioner {...partProps['Menu.Positioner']}>
              <Menu.Popup {...partProps['Menu.Popup']}>
                <Menu.QuickActions {...partProps['Menu.QuickActions']}>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Share clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquareAndArrowUp}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>Share</Menu.Label>
                  </Menu.QuickAction>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Favorite clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfHeart}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Favorite
                    </Menu.Label>
                  </Menu.QuickAction>
                </Menu.QuickActions>
                <Menu.Item
                  {...partProps['Menu.Item']}
                  onClick={() => addLog('Rename clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPencil}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Rename</Menu.Label>
                  <Menu.Shortcut {...partProps['Menu.Shortcut']}>
                    ⌘R
                  </Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Group {...partProps['Menu.Group']}>
                  <Menu.GroupLabel {...partProps['Menu.GroupLabel']}>
                    Sort By
                  </Menu.GroupLabel>
                  <Menu.RadioGroup
                    {...partProps['Menu.RadioGroup']}
                    defaultValue="date"
                  >
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="date"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="name"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.CheckboxItem
                  {...partProps['Menu.CheckboxItem']}
                  defaultChecked
                >
                  <Menu.CheckboxItemIndicator
                    {...partProps['Menu.CheckboxItemIndicator']}
                  />
                  <Menu.Label {...partProps['Menu.Label']}>Previews</Menu.Label>
                  <Menu.Subtitle {...partProps['Menu.Subtitle']}>
                    Show file contents
                  </Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot {...props}>
                  <Menu.SubmenuTrigger {...partProps['Menu.SubmenuTrigger']}>
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfFolder}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Move to
                    </Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal {...partProps['Menu.Portal']}>
                    <Menu.Positioner {...partProps['Menu.Positioner']}>
                      <Menu.Popup {...partProps['Menu.Popup']}>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Documents clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Documents
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Downloads clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Downloads
                          </Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.LinkItem
                  {...partProps['Menu.LinkItem']}
                  href="#"
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfLink}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Help</Menu.Label>
                </Menu.LinkItem>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Item
                  {...partProps['Menu.Item']}
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrash}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Delete</Menu.Label>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'Menu.CheckboxItem': [],
            'Menu.CheckboxItemIndicator': [],
            'Menu.Group': [],
            'Menu.GroupLabel': [],
            'Menu.Icon': [],
            'Menu.Item': ['destructive', 'onClick'],
            'Menu.Label': [],
            'Menu.LinkItem': ['href'],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': [],
            'Menu.QuickAction': ['onClick'],
            'Menu.QuickActions': [],
            'Menu.RadioGroup': ['defaultValue'],
            'Menu.RadioItem': ['value'],
            'Menu.RadioItemIndicator': [],
            'Menu.Root': [],
            'Menu.Separator': [],
            'Menu.Shortcut': [],
            'Menu.SubmenuRoot': [],
            'Menu.Subtitle': [],
            'Menu.Trigger': ['render'],
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
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Menu.SubmenuTrigger"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Menu.Root {...partProps['Menu.Root']}>
          <Menu.Trigger
            {...partProps['Menu.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal {...partProps['Menu.Portal']}>
            <Menu.Positioner {...partProps['Menu.Positioner']}>
              <Menu.Popup {...partProps['Menu.Popup']}>
                <Menu.QuickActions {...partProps['Menu.QuickActions']}>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Share clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquareAndArrowUp}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>Share</Menu.Label>
                  </Menu.QuickAction>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Favorite clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfHeart}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Favorite
                    </Menu.Label>
                  </Menu.QuickAction>
                </Menu.QuickActions>
                <Menu.Item
                  {...partProps['Menu.Item']}
                  onClick={() => addLog('Rename clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPencil}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Rename</Menu.Label>
                  <Menu.Shortcut {...partProps['Menu.Shortcut']}>
                    ⌘R
                  </Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Group {...partProps['Menu.Group']}>
                  <Menu.GroupLabel {...partProps['Menu.GroupLabel']}>
                    Sort By
                  </Menu.GroupLabel>
                  <Menu.RadioGroup
                    {...partProps['Menu.RadioGroup']}
                    defaultValue="date"
                  >
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="date"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="name"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.CheckboxItem
                  {...partProps['Menu.CheckboxItem']}
                  defaultChecked
                >
                  <Menu.CheckboxItemIndicator
                    {...partProps['Menu.CheckboxItemIndicator']}
                  />
                  <Menu.Label {...partProps['Menu.Label']}>Previews</Menu.Label>
                  <Menu.Subtitle {...partProps['Menu.Subtitle']}>
                    Show file contents
                  </Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot {...partProps['Menu.SubmenuRoot']}>
                  <Menu.SubmenuTrigger {...props}>
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfFolder}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Move to
                    </Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal {...partProps['Menu.Portal']}>
                    <Menu.Positioner {...partProps['Menu.Positioner']}>
                      <Menu.Popup {...partProps['Menu.Popup']}>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Documents clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Documents
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Downloads clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Downloads
                          </Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.LinkItem
                  {...partProps['Menu.LinkItem']}
                  href="#"
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfLink}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Help</Menu.Label>
                </Menu.LinkItem>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Item
                  {...partProps['Menu.Item']}
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrash}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Delete</Menu.Label>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'Menu.CheckboxItem': [],
            'Menu.CheckboxItemIndicator': [],
            'Menu.GroupLabel': [],
            'Menu.Icon': [],
            'Menu.Item': ['destructive', 'onClick'],
            'Menu.Label': [],
            'Menu.LinkItem': ['href'],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': [],
            'Menu.QuickAction': ['onClick'],
            'Menu.QuickActions': [],
            'Menu.RadioGroup': ['defaultValue'],
            'Menu.RadioItem': ['value'],
            'Menu.RadioItemIndicator': [],
            'Menu.Root': [],
            'Menu.Separator': [],
            'Menu.Shortcut': [],
            'Menu.SubmenuRoot': [],
            'Menu.SubmenuTrigger': [],
            'Menu.Subtitle': [],
            'Menu.Trigger': ['render'],
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
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Menu.Group"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Menu.Root {...partProps['Menu.Root']}>
          <Menu.Trigger
            {...partProps['Menu.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal {...partProps['Menu.Portal']}>
            <Menu.Positioner {...partProps['Menu.Positioner']}>
              <Menu.Popup {...partProps['Menu.Popup']}>
                <Menu.QuickActions {...partProps['Menu.QuickActions']}>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Share clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquareAndArrowUp}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>Share</Menu.Label>
                  </Menu.QuickAction>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Favorite clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfHeart}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Favorite
                    </Menu.Label>
                  </Menu.QuickAction>
                </Menu.QuickActions>
                <Menu.Item
                  {...partProps['Menu.Item']}
                  onClick={() => addLog('Rename clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPencil}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Rename</Menu.Label>
                  <Menu.Shortcut {...partProps['Menu.Shortcut']}>
                    ⌘R
                  </Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Group {...props}>
                  <Menu.GroupLabel {...partProps['Menu.GroupLabel']}>
                    Sort By
                  </Menu.GroupLabel>
                  <Menu.RadioGroup
                    {...partProps['Menu.RadioGroup']}
                    defaultValue="date"
                  >
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="date"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="name"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.CheckboxItem
                  {...partProps['Menu.CheckboxItem']}
                  defaultChecked
                >
                  <Menu.CheckboxItemIndicator
                    {...partProps['Menu.CheckboxItemIndicator']}
                  />
                  <Menu.Label {...partProps['Menu.Label']}>Previews</Menu.Label>
                  <Menu.Subtitle {...partProps['Menu.Subtitle']}>
                    Show file contents
                  </Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot {...partProps['Menu.SubmenuRoot']}>
                  <Menu.SubmenuTrigger {...partProps['Menu.SubmenuTrigger']}>
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfFolder}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Move to
                    </Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal {...partProps['Menu.Portal']}>
                    <Menu.Positioner {...partProps['Menu.Positioner']}>
                      <Menu.Popup {...partProps['Menu.Popup']}>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Documents clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Documents
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Downloads clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Downloads
                          </Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.LinkItem
                  {...partProps['Menu.LinkItem']}
                  href="#"
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfLink}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Help</Menu.Label>
                </Menu.LinkItem>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Item
                  {...partProps['Menu.Item']}
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrash}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Delete</Menu.Label>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'Menu.CheckboxItem': [],
            'Menu.CheckboxItemIndicator': [],
            'Menu.Group': [],
            'Menu.Icon': [],
            'Menu.Item': ['destructive', 'onClick'],
            'Menu.Label': [],
            'Menu.LinkItem': ['href'],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': [],
            'Menu.QuickAction': ['onClick'],
            'Menu.QuickActions': [],
            'Menu.RadioGroup': ['defaultValue'],
            'Menu.RadioItem': ['value'],
            'Menu.RadioItemIndicator': [],
            'Menu.Root': [],
            'Menu.Separator': [],
            'Menu.Shortcut': [],
            'Menu.SubmenuRoot': [],
            'Menu.SubmenuTrigger': [],
            'Menu.Subtitle': [],
            'Menu.Trigger': ['render'],
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
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Menu.GroupLabel"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Menu.Root {...partProps['Menu.Root']}>
          <Menu.Trigger
            {...partProps['Menu.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal {...partProps['Menu.Portal']}>
            <Menu.Positioner {...partProps['Menu.Positioner']}>
              <Menu.Popup {...partProps['Menu.Popup']}>
                <Menu.QuickActions {...partProps['Menu.QuickActions']}>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Share clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquareAndArrowUp}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>Share</Menu.Label>
                  </Menu.QuickAction>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Favorite clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfHeart}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Favorite
                    </Menu.Label>
                  </Menu.QuickAction>
                </Menu.QuickActions>
                <Menu.Item
                  {...partProps['Menu.Item']}
                  onClick={() => addLog('Rename clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPencil}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Rename</Menu.Label>
                  <Menu.Shortcut {...partProps['Menu.Shortcut']}>
                    ⌘R
                  </Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Group {...partProps['Menu.Group']}>
                  <Menu.GroupLabel {...props}>Sort By</Menu.GroupLabel>
                  <Menu.RadioGroup
                    {...partProps['Menu.RadioGroup']}
                    defaultValue="date"
                  >
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="date"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="name"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.CheckboxItem
                  {...partProps['Menu.CheckboxItem']}
                  defaultChecked
                >
                  <Menu.CheckboxItemIndicator
                    {...partProps['Menu.CheckboxItemIndicator']}
                  />
                  <Menu.Label {...partProps['Menu.Label']}>Previews</Menu.Label>
                  <Menu.Subtitle {...partProps['Menu.Subtitle']}>
                    Show file contents
                  </Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot {...partProps['Menu.SubmenuRoot']}>
                  <Menu.SubmenuTrigger {...partProps['Menu.SubmenuTrigger']}>
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfFolder}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Move to
                    </Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal {...partProps['Menu.Portal']}>
                    <Menu.Positioner {...partProps['Menu.Positioner']}>
                      <Menu.Popup {...partProps['Menu.Popup']}>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Documents clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Documents
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Downloads clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Downloads
                          </Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.LinkItem
                  {...partProps['Menu.LinkItem']}
                  href="#"
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfLink}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Help</Menu.Label>
                </Menu.LinkItem>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Item
                  {...partProps['Menu.Item']}
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrash}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Delete</Menu.Label>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Menu.Separator (others)': [],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'Menu.CheckboxItem': [],
            'Menu.CheckboxItemIndicator': [],
            'Menu.Group': [],
            'Menu.GroupLabel': [],
            'Menu.Icon': [],
            'Menu.Item': ['destructive', 'onClick'],
            'Menu.Label': [],
            'Menu.LinkItem': ['href'],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': [],
            'Menu.QuickAction': ['onClick'],
            'Menu.QuickActions': [],
            'Menu.RadioGroup': ['defaultValue'],
            'Menu.RadioItem': ['value'],
            'Menu.RadioItemIndicator': [],
            'Menu.Root': [],
            'Menu.Shortcut': [],
            'Menu.SubmenuRoot': [],
            'Menu.SubmenuTrigger': [],
            'Menu.Subtitle': [],
            'Menu.Trigger': ['render'],
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
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Menu.Separator"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Menu.Root {...partProps['Menu.Root']}>
          <Menu.Trigger
            {...partProps['Menu.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal {...partProps['Menu.Portal']}>
            <Menu.Positioner {...partProps['Menu.Positioner']}>
              <Menu.Popup {...partProps['Menu.Popup']}>
                <Menu.QuickActions {...partProps['Menu.QuickActions']}>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Share clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquareAndArrowUp}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>Share</Menu.Label>
                  </Menu.QuickAction>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Favorite clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfHeart}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Favorite
                    </Menu.Label>
                  </Menu.QuickAction>
                </Menu.QuickActions>
                <Menu.Item
                  {...partProps['Menu.Item']}
                  onClick={() => addLog('Rename clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPencil}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Rename</Menu.Label>
                  <Menu.Shortcut {...partProps['Menu.Shortcut']}>
                    ⌘R
                  </Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator {...props} />
                <Menu.Group {...partProps['Menu.Group']}>
                  <Menu.GroupLabel {...partProps['Menu.GroupLabel']}>
                    Sort By
                  </Menu.GroupLabel>
                  <Menu.RadioGroup
                    {...partProps['Menu.RadioGroup']}
                    defaultValue="date"
                  >
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="date"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="name"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator {...partProps['Menu.Separator (others)']} />
                <Menu.CheckboxItem
                  {...partProps['Menu.CheckboxItem']}
                  defaultChecked
                >
                  <Menu.CheckboxItemIndicator
                    {...partProps['Menu.CheckboxItemIndicator']}
                  />
                  <Menu.Label {...partProps['Menu.Label']}>Previews</Menu.Label>
                  <Menu.Subtitle {...partProps['Menu.Subtitle']}>
                    Show file contents
                  </Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot {...partProps['Menu.SubmenuRoot']}>
                  <Menu.SubmenuTrigger {...partProps['Menu.SubmenuTrigger']}>
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfFolder}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Move to
                    </Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal {...partProps['Menu.Portal']}>
                    <Menu.Positioner {...partProps['Menu.Positioner']}>
                      <Menu.Popup {...partProps['Menu.Popup']}>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Documents clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Documents
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Downloads clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Downloads
                          </Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.LinkItem
                  {...partProps['Menu.LinkItem']}
                  href="#"
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfLink}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Help</Menu.Label>
                </Menu.LinkItem>
                <Menu.Separator {...partProps['Menu.Separator (others)']} />
                <Menu.Item
                  {...partProps['Menu.Item']}
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrash}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Delete</Menu.Label>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'Menu.CheckboxItem': [],
            'Menu.CheckboxItemIndicator': [],
            'Menu.Group': [],
            'Menu.GroupLabel': [],
            'Menu.Icon': [],
            'Menu.Item': ['destructive', 'onClick'],
            'Menu.Label': [],
            'Menu.LinkItem': ['href'],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': [],
            'Menu.QuickAction': ['onClick'],
            'Menu.RadioGroup': ['defaultValue'],
            'Menu.RadioItem': ['value'],
            'Menu.RadioItemIndicator': [],
            'Menu.Root': [],
            'Menu.Separator': [],
            'Menu.Shortcut': [],
            'Menu.SubmenuRoot': [],
            'Menu.SubmenuTrigger': [],
            'Menu.Subtitle': [],
            'Menu.Trigger': ['render'],
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
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Menu.QuickActions"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Menu.Root {...partProps['Menu.Root']}>
          <Menu.Trigger
            {...partProps['Menu.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal {...partProps['Menu.Portal']}>
            <Menu.Positioner {...partProps['Menu.Positioner']}>
              <Menu.Popup {...partProps['Menu.Popup']}>
                <Menu.QuickActions {...props}>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Share clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquareAndArrowUp}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>Share</Menu.Label>
                  </Menu.QuickAction>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Favorite clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfHeart}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Favorite
                    </Menu.Label>
                  </Menu.QuickAction>
                </Menu.QuickActions>
                <Menu.Item
                  {...partProps['Menu.Item']}
                  onClick={() => addLog('Rename clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPencil}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Rename</Menu.Label>
                  <Menu.Shortcut {...partProps['Menu.Shortcut']}>
                    ⌘R
                  </Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Group {...partProps['Menu.Group']}>
                  <Menu.GroupLabel {...partProps['Menu.GroupLabel']}>
                    Sort By
                  </Menu.GroupLabel>
                  <Menu.RadioGroup
                    {...partProps['Menu.RadioGroup']}
                    defaultValue="date"
                  >
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="date"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="name"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.CheckboxItem
                  {...partProps['Menu.CheckboxItem']}
                  defaultChecked
                >
                  <Menu.CheckboxItemIndicator
                    {...partProps['Menu.CheckboxItemIndicator']}
                  />
                  <Menu.Label {...partProps['Menu.Label']}>Previews</Menu.Label>
                  <Menu.Subtitle {...partProps['Menu.Subtitle']}>
                    Show file contents
                  </Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot {...partProps['Menu.SubmenuRoot']}>
                  <Menu.SubmenuTrigger {...partProps['Menu.SubmenuTrigger']}>
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfFolder}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Move to
                    </Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal {...partProps['Menu.Portal']}>
                    <Menu.Positioner {...partProps['Menu.Positioner']}>
                      <Menu.Popup {...partProps['Menu.Popup']}>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Documents clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Documents
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Downloads clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Downloads
                          </Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.LinkItem
                  {...partProps['Menu.LinkItem']}
                  href="#"
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfLink}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Help</Menu.Label>
                </Menu.LinkItem>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Item
                  {...partProps['Menu.Item']}
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrash}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Delete</Menu.Label>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Menu.QuickAction (others)': ['onClick'],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'Menu.CheckboxItem': [],
            'Menu.CheckboxItemIndicator': [],
            'Menu.Group': [],
            'Menu.GroupLabel': [],
            'Menu.Icon': [],
            'Menu.Item': ['destructive', 'onClick'],
            'Menu.Label': [],
            'Menu.LinkItem': ['href'],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': [],
            'Menu.QuickActions': [],
            'Menu.RadioGroup': ['defaultValue'],
            'Menu.RadioItem': ['value'],
            'Menu.RadioItemIndicator': [],
            'Menu.Root': [],
            'Menu.Separator': [],
            'Menu.Shortcut': [],
            'Menu.SubmenuRoot': [],
            'Menu.SubmenuTrigger': [],
            'Menu.Subtitle': [],
            'Menu.Trigger': ['render'],
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
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Menu.QuickAction"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Menu.Root {...partProps['Menu.Root']}>
          <Menu.Trigger
            {...partProps['Menu.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal {...partProps['Menu.Portal']}>
            <Menu.Positioner {...partProps['Menu.Positioner']}>
              <Menu.Popup {...partProps['Menu.Popup']}>
                <Menu.QuickActions {...partProps['Menu.QuickActions']}>
                  <Menu.QuickAction
                    {...props}
                    onClick={() => addLog('Share clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquareAndArrowUp}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>Share</Menu.Label>
                  </Menu.QuickAction>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction (others)']}
                    onClick={() => addLog('Favorite clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfHeart}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Favorite
                    </Menu.Label>
                  </Menu.QuickAction>
                </Menu.QuickActions>
                <Menu.Item
                  {...partProps['Menu.Item']}
                  onClick={() => addLog('Rename clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPencil}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Rename</Menu.Label>
                  <Menu.Shortcut {...partProps['Menu.Shortcut']}>
                    ⌘R
                  </Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Group {...partProps['Menu.Group']}>
                  <Menu.GroupLabel {...partProps['Menu.GroupLabel']}>
                    Sort By
                  </Menu.GroupLabel>
                  <Menu.RadioGroup
                    {...partProps['Menu.RadioGroup']}
                    defaultValue="date"
                  >
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="date"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="name"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.CheckboxItem
                  {...partProps['Menu.CheckboxItem']}
                  defaultChecked
                >
                  <Menu.CheckboxItemIndicator
                    {...partProps['Menu.CheckboxItemIndicator']}
                  />
                  <Menu.Label {...partProps['Menu.Label']}>Previews</Menu.Label>
                  <Menu.Subtitle {...partProps['Menu.Subtitle']}>
                    Show file contents
                  </Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot {...partProps['Menu.SubmenuRoot']}>
                  <Menu.SubmenuTrigger {...partProps['Menu.SubmenuTrigger']}>
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfFolder}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Move to
                    </Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal {...partProps['Menu.Portal']}>
                    <Menu.Positioner {...partProps['Menu.Positioner']}>
                      <Menu.Popup {...partProps['Menu.Popup']}>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Documents clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Documents
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Downloads clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Downloads
                          </Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.LinkItem
                  {...partProps['Menu.LinkItem']}
                  href="#"
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfLink}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Help</Menu.Label>
                </Menu.LinkItem>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Item
                  {...partProps['Menu.Item']}
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrash}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Delete</Menu.Label>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Menu.Icon (others)': [],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'Menu.CheckboxItem': [],
            'Menu.CheckboxItemIndicator': [],
            'Menu.Group': [],
            'Menu.GroupLabel': [],
            'Menu.Item': ['destructive', 'onClick'],
            'Menu.Label': [],
            'Menu.LinkItem': ['href'],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': [],
            'Menu.QuickAction': ['onClick'],
            'Menu.QuickActions': [],
            'Menu.RadioGroup': ['defaultValue'],
            'Menu.RadioItem': ['value'],
            'Menu.RadioItemIndicator': [],
            'Menu.Root': [],
            'Menu.Separator': [],
            'Menu.Shortcut': [],
            'Menu.SubmenuRoot': [],
            'Menu.SubmenuTrigger': [],
            'Menu.Subtitle': [],
            'Menu.Trigger': ['render'],
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
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Menu.Icon"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Menu.Root {...partProps['Menu.Root']}>
          <Menu.Trigger
            {...partProps['Menu.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal {...partProps['Menu.Portal']}>
            <Menu.Positioner {...partProps['Menu.Positioner']}>
              <Menu.Popup {...partProps['Menu.Popup']}>
                <Menu.QuickActions {...partProps['Menu.QuickActions']}>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Share clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon (others)']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquareAndArrowUp}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>Share</Menu.Label>
                  </Menu.QuickAction>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Favorite clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon (others)']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfHeart}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Favorite
                    </Menu.Label>
                  </Menu.QuickAction>
                </Menu.QuickActions>
                <Menu.Item
                  {...partProps['Menu.Item']}
                  onClick={() => addLog('Rename clicked')}
                >
                  <Menu.Icon {...props}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPencil}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Rename</Menu.Label>
                  <Menu.Shortcut {...partProps['Menu.Shortcut']}>
                    ⌘R
                  </Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Group {...partProps['Menu.Group']}>
                  <Menu.GroupLabel {...partProps['Menu.GroupLabel']}>
                    Sort By
                  </Menu.GroupLabel>
                  <Menu.RadioGroup
                    {...partProps['Menu.RadioGroup']}
                    defaultValue="date"
                  >
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="date"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="name"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.CheckboxItem
                  {...partProps['Menu.CheckboxItem']}
                  defaultChecked
                >
                  <Menu.CheckboxItemIndicator
                    {...partProps['Menu.CheckboxItemIndicator']}
                  />
                  <Menu.Label {...partProps['Menu.Label']}>Previews</Menu.Label>
                  <Menu.Subtitle {...partProps['Menu.Subtitle']}>
                    Show file contents
                  </Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot {...partProps['Menu.SubmenuRoot']}>
                  <Menu.SubmenuTrigger {...partProps['Menu.SubmenuTrigger']}>
                    <Menu.Icon {...partProps['Menu.Icon (others)']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfFolder}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Move to
                    </Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal {...partProps['Menu.Portal']}>
                    <Menu.Positioner {...partProps['Menu.Positioner']}>
                      <Menu.Popup {...partProps['Menu.Popup']}>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Documents clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Documents
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Downloads clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Downloads
                          </Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.LinkItem
                  {...partProps['Menu.LinkItem']}
                  href="#"
                >
                  <Menu.Icon {...partProps['Menu.Icon (others)']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfLink}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Help</Menu.Label>
                </Menu.LinkItem>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Item
                  {...partProps['Menu.Item']}
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon (others)']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrash}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Delete</Menu.Label>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Menu.Label (others)': [],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'Menu.CheckboxItem': [],
            'Menu.CheckboxItemIndicator': [],
            'Menu.Group': [],
            'Menu.GroupLabel': [],
            'Menu.Icon': [],
            'Menu.Item': ['destructive', 'onClick'],
            'Menu.LinkItem': ['href'],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': [],
            'Menu.QuickAction': ['onClick'],
            'Menu.QuickActions': [],
            'Menu.RadioGroup': ['defaultValue'],
            'Menu.RadioItem': ['value'],
            'Menu.RadioItemIndicator': [],
            'Menu.Root': [],
            'Menu.Separator': [],
            'Menu.Shortcut': [],
            'Menu.SubmenuRoot': [],
            'Menu.SubmenuTrigger': [],
            'Menu.Subtitle': [],
            'Menu.Trigger': ['render'],
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
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Menu.Label"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Menu.Root {...partProps['Menu.Root']}>
          <Menu.Trigger
            {...partProps['Menu.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal {...partProps['Menu.Portal']}>
            <Menu.Positioner {...partProps['Menu.Positioner']}>
              <Menu.Popup {...partProps['Menu.Popup']}>
                <Menu.QuickActions {...partProps['Menu.QuickActions']}>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Share clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquareAndArrowUp}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label (others)']}>
                      Share
                    </Menu.Label>
                  </Menu.QuickAction>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Favorite clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfHeart}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label (others)']}>
                      Favorite
                    </Menu.Label>
                  </Menu.QuickAction>
                </Menu.QuickActions>
                <Menu.Item
                  {...partProps['Menu.Item']}
                  onClick={() => addLog('Rename clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPencil}
                    />
                  </Menu.Icon>
                  <Menu.Label {...props}>Rename</Menu.Label>
                  <Menu.Shortcut {...partProps['Menu.Shortcut']}>
                    ⌘R
                  </Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Group {...partProps['Menu.Group']}>
                  <Menu.GroupLabel {...partProps['Menu.GroupLabel']}>
                    Sort By
                  </Menu.GroupLabel>
                  <Menu.RadioGroup
                    {...partProps['Menu.RadioGroup']}
                    defaultValue="date"
                  >
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="date"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label (others)']}>
                        Date
                      </Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="name"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label (others)']}>
                        Name
                      </Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.CheckboxItem
                  {...partProps['Menu.CheckboxItem']}
                  defaultChecked
                >
                  <Menu.CheckboxItemIndicator
                    {...partProps['Menu.CheckboxItemIndicator']}
                  />
                  <Menu.Label {...partProps['Menu.Label (others)']}>
                    Previews
                  </Menu.Label>
                  <Menu.Subtitle {...partProps['Menu.Subtitle']}>
                    Show file contents
                  </Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot {...partProps['Menu.SubmenuRoot']}>
                  <Menu.SubmenuTrigger {...partProps['Menu.SubmenuTrigger']}>
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfFolder}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label (others)']}>
                      Move to
                    </Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal {...partProps['Menu.Portal']}>
                    <Menu.Positioner {...partProps['Menu.Positioner']}>
                      <Menu.Popup {...partProps['Menu.Popup']}>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Documents clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label (others)']}>
                            Documents
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Downloads clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label (others)']}>
                            Downloads
                          </Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.LinkItem
                  {...partProps['Menu.LinkItem']}
                  href="#"
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfLink}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label (others)']}>
                    Help
                  </Menu.Label>
                </Menu.LinkItem>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Item
                  {...partProps['Menu.Item']}
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrash}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label (others)']}>
                    Delete
                  </Menu.Label>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'Menu.CheckboxItem': [],
            'Menu.CheckboxItemIndicator': [],
            'Menu.Group': [],
            'Menu.GroupLabel': [],
            'Menu.Icon': [],
            'Menu.Item': ['destructive', 'onClick'],
            'Menu.Label': [],
            'Menu.LinkItem': ['href'],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': [],
            'Menu.QuickAction': ['onClick'],
            'Menu.QuickActions': [],
            'Menu.RadioGroup': ['defaultValue'],
            'Menu.RadioItem': ['value'],
            'Menu.RadioItemIndicator': [],
            'Menu.Root': [],
            'Menu.Separator': [],
            'Menu.Shortcut': [],
            'Menu.SubmenuRoot': [],
            'Menu.SubmenuTrigger': [],
            'Menu.Trigger': ['render'],
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
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Menu.Subtitle"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Menu.Root {...partProps['Menu.Root']}>
          <Menu.Trigger
            {...partProps['Menu.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal {...partProps['Menu.Portal']}>
            <Menu.Positioner {...partProps['Menu.Positioner']}>
              <Menu.Popup {...partProps['Menu.Popup']}>
                <Menu.QuickActions {...partProps['Menu.QuickActions']}>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Share clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquareAndArrowUp}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>Share</Menu.Label>
                  </Menu.QuickAction>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Favorite clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfHeart}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Favorite
                    </Menu.Label>
                  </Menu.QuickAction>
                </Menu.QuickActions>
                <Menu.Item
                  {...partProps['Menu.Item']}
                  onClick={() => addLog('Rename clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPencil}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Rename</Menu.Label>
                  <Menu.Shortcut {...partProps['Menu.Shortcut']}>
                    ⌘R
                  </Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Group {...partProps['Menu.Group']}>
                  <Menu.GroupLabel {...partProps['Menu.GroupLabel']}>
                    Sort By
                  </Menu.GroupLabel>
                  <Menu.RadioGroup
                    {...partProps['Menu.RadioGroup']}
                    defaultValue="date"
                  >
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="date"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="name"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.CheckboxItem
                  {...partProps['Menu.CheckboxItem']}
                  defaultChecked
                >
                  <Menu.CheckboxItemIndicator
                    {...partProps['Menu.CheckboxItemIndicator']}
                  />
                  <Menu.Label {...partProps['Menu.Label']}>Previews</Menu.Label>
                  <Menu.Subtitle {...props}>Show file contents</Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot {...partProps['Menu.SubmenuRoot']}>
                  <Menu.SubmenuTrigger {...partProps['Menu.SubmenuTrigger']}>
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfFolder}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Move to
                    </Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal {...partProps['Menu.Portal']}>
                    <Menu.Positioner {...partProps['Menu.Positioner']}>
                      <Menu.Popup {...partProps['Menu.Popup']}>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Documents clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Documents
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Downloads clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Downloads
                          </Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.LinkItem
                  {...partProps['Menu.LinkItem']}
                  href="#"
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfLink}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Help</Menu.Label>
                </Menu.LinkItem>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Item
                  {...partProps['Menu.Item']}
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrash}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Delete</Menu.Label>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'Menu.CheckboxItem': [],
            'Menu.CheckboxItemIndicator': [],
            'Menu.Group': [],
            'Menu.GroupLabel': [],
            'Menu.Icon': [],
            'Menu.Item': ['destructive', 'onClick'],
            'Menu.Label': [],
            'Menu.LinkItem': ['href'],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': [],
            'Menu.QuickAction': ['onClick'],
            'Menu.QuickActions': [],
            'Menu.RadioGroup': ['defaultValue'],
            'Menu.RadioItem': ['value'],
            'Menu.RadioItemIndicator': [],
            'Menu.Root': [],
            'Menu.Separator': [],
            'Menu.SubmenuRoot': [],
            'Menu.SubmenuTrigger': [],
            'Menu.Subtitle': [],
            'Menu.Trigger': ['render'],
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
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[control, partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[state, partState]}
      title="Menu.Shortcut"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Menu.Root {...partProps['Menu.Root']}>
          <Menu.Trigger
            {...partProps['Menu.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>Options</Button.Label>
          </Menu.Trigger>
          <Menu.Portal {...partProps['Menu.Portal']}>
            <Menu.Positioner {...partProps['Menu.Positioner']}>
              <Menu.Popup {...partProps['Menu.Popup']}>
                <Menu.QuickActions {...partProps['Menu.QuickActions']}>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Share clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquareAndArrowUp}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>Share</Menu.Label>
                  </Menu.QuickAction>
                  <Menu.QuickAction
                    {...partProps['Menu.QuickAction']}
                    onClick={() => addLog('Favorite clicked')}
                  >
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfHeart}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Favorite
                    </Menu.Label>
                  </Menu.QuickAction>
                </Menu.QuickActions>
                <Menu.Item
                  {...partProps['Menu.Item']}
                  onClick={() => addLog('Rename clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPencil}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Rename</Menu.Label>
                  <Menu.Shortcut {...props}>⌘R</Menu.Shortcut>
                </Menu.Item>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Group {...partProps['Menu.Group']}>
                  <Menu.GroupLabel {...partProps['Menu.GroupLabel']}>
                    Sort By
                  </Menu.GroupLabel>
                  <Menu.RadioGroup
                    {...partProps['Menu.RadioGroup']}
                    defaultValue="date"
                  >
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="date"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Date</Menu.Label>
                    </Menu.RadioItem>
                    <Menu.RadioItem
                      {...partProps['Menu.RadioItem']}
                      value="name"
                    >
                      <Menu.RadioItemIndicator
                        {...partProps['Menu.RadioItemIndicator']}
                      />
                      <Menu.Label {...partProps['Menu.Label']}>Name</Menu.Label>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.Group>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.CheckboxItem
                  {...partProps['Menu.CheckboxItem']}
                  defaultChecked
                >
                  <Menu.CheckboxItemIndicator
                    {...partProps['Menu.CheckboxItemIndicator']}
                  />
                  <Menu.Label {...partProps['Menu.Label']}>Previews</Menu.Label>
                  <Menu.Subtitle {...partProps['Menu.Subtitle']}>
                    Show file contents
                  </Menu.Subtitle>
                </Menu.CheckboxItem>
                <Menu.SubmenuRoot {...partProps['Menu.SubmenuRoot']}>
                  <Menu.SubmenuTrigger {...partProps['Menu.SubmenuTrigger']}>
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfFolder}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Move to
                    </Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal {...partProps['Menu.Portal']}>
                    <Menu.Positioner {...partProps['Menu.Positioner']}>
                      <Menu.Popup {...partProps['Menu.Popup']}>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Documents clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Documents
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('Downloads clicked')}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            Downloads
                          </Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.LinkItem
                  {...partProps['Menu.LinkItem']}
                  href="#"
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfLink}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Help</Menu.Label>
                </Menu.LinkItem>
                <Menu.Separator {...partProps['Menu.Separator']} />
                <Menu.Item
                  {...partProps['Menu.Item']}
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrash}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Delete</Menu.Label>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Label': [],
            'Button.Root': ['onClick', 'size', 'variant'],
            'Menu.Icon': [],
            'Menu.Item': ['destructive', 'onClick'],
            'Menu.Label': [],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': [],
            'Menu.Root': ['handle', 'onOpenChange'],
            'Menu.Trigger': ['handle', 'id', 'render'],
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
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[partState]}
      title="Menu.createHandle"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <div className="menu-demo-triggers">
          <Menu.Trigger
            {...partProps['Menu.Trigger']}
            handle={optionsMenu}
            id="menu-parts-options-trigger"
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>Options</Button.Label>
          </Menu.Trigger>
          <Button.Root
            {...partProps['Button.Root']}
            variant="borderless"
            onClick={() => optionsMenu.open('menu-parts-options-trigger')}
          >
            <Button.Label {...partProps['Button.Label']}>
              Open Imperatively
            </Button.Label>
          </Button.Root>
        </div>
        <Menu.Root
          {...partProps['Menu.Root']}
          handle={optionsMenu}
          onOpenChange={(isOpen: boolean, { reason }) =>
            addLog(`open change: ${String(isOpen)} (${reason})`)
          }
        >
          <Menu.Portal {...partProps['Menu.Portal']}>
            <Menu.Positioner {...partProps['Menu.Positioner']}>
              <Menu.Popup {...partProps['Menu.Popup']}>
                <Menu.Item
                  {...partProps['Menu.Item']}
                  onClick={() => addLog('Rename clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPencil}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Rename</Menu.Label>
                </Menu.Item>
                <Menu.Item
                  {...partProps['Menu.Item']}
                  destructive
                  onClick={() => addLog('Delete clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrash}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Delete</Menu.Label>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'Menu.Group': [],
            'Menu.GroupLabel': [],
            'Menu.Icon': [],
            'Menu.Item': ['destructive', 'onClick'],
            'Menu.Label': [],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': [],
            'Menu.Root': ['handle'],
            'Menu.Trigger': ['handle', 'payload', 'render'],
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
      hasWallpaper
      isInline
      baseUiId="menu"
      controls={[partControls]}
      id={id}
      log={log}
      screen="centered"
      stage="phone"
      state={[partState]}
      title="useCreateMenuHandle"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <div className="menu-demo-triggers">
          <Menu.Trigger
            {...partProps['Menu.Trigger']}
            handle={fileMenu}
            payload={{ file: 'Notes.txt' }}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Notes.txt
            </Button.Label>
          </Menu.Trigger>
          <Menu.Trigger
            {...partProps['Menu.Trigger']}
            handle={fileMenu}
            payload={{ file: 'Photo.jpg' }}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                size="large"
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Photo.jpg
            </Button.Label>
          </Menu.Trigger>
        </div>
        <Menu.Root
          {...partProps['Menu.Root']}
          handle={fileMenu}
        >
          {({ payload }) => (
            <Menu.Portal {...partProps['Menu.Portal']}>
              <Menu.Positioner {...partProps['Menu.Positioner']}>
                <Menu.Popup {...partProps['Menu.Popup']}>
                  <Menu.Group {...partProps['Menu.Group']}>
                    <Menu.GroupLabel {...partProps['Menu.GroupLabel']}>
                      {payload?.file}
                    </Menu.GroupLabel>
                    <Menu.Item
                      {...partProps['Menu.Item']}
                      onClick={() => addLog(`share: ${String(payload?.file)}`)}
                    >
                      <Menu.Icon {...partProps['Menu.Icon']}>
                        <Symbol
                          {...partProps.Symbol}
                          icon={sfSquareAndArrowUp}
                        />
                      </Menu.Icon>
                      <Menu.Label {...partProps['Menu.Label']}>
                        Share
                      </Menu.Label>
                    </Menu.Item>
                    <Menu.Item
                      {...partProps['Menu.Item']}
                      destructive
                      onClick={() => addLog(`delete: ${String(payload?.file)}`)}
                    >
                      <Menu.Icon {...partProps['Menu.Icon']}>
                        <Symbol
                          {...partProps.Symbol}
                          icon={sfTrash}
                        />
                      </Menu.Icon>
                      <Menu.Label {...partProps['Menu.Label']}>
                        Delete
                      </Menu.Label>
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
        groups, separators and quick actions. Each item has a symbol, a label, a
        subtitle and a shortcut.
      </li>
      <li>
        Base UI’s other parts pass through without styles:{' '}
        <code>Menu.Arrow</code> and <code>Menu.Viewport</code> (these menus have
        neither), and the filtering parts (<code>Menu.FilterRoot</code>,{' '}
        <code>Menu.Input</code>, <code>Menu.List</code>, <code>Menu.Empty</code>{' '}
        and so on; these menus have no search).
      </li>
    </ul>

    <ul className="demo-tree">
      <li>
        <PartLink
          component="menu"
          part="Menu.Root"
        />
        <ul>
          <li>
            <PartLink
              component="menu"
              part="Menu.Trigger"
            />
          </li>
          <li>
            <PartLink
              component="menu"
              part="Menu.Portal"
            />
            <ul>
              <li>
                <PartLink
                  component="menu"
                  part="Menu.Backdrop"
                />{' '}
                (optional)
              </li>
              <li>
                <PartLink
                  component="menu"
                  part="Menu.Positioner"
                />
                <ul>
                  <li>
                    <PartLink
                      component="menu"
                      part="Menu.Popup"
                    />
                    <ul>
                      <li>
                        <PartLink
                          component="menu"
                          part="Menu.QuickActions"
                        />{' '}
                        (optional)
                        <ul>
                          <li>
                            <PartLink
                              component="menu"
                              part="Menu.QuickAction"
                            />
                          </li>
                        </ul>
                      </li>
                      <li>
                        <PartLink
                          component="menu"
                          part="Menu.Group"
                        />{' '}
                        (optional)
                        <ul>
                          <li>
                            <PartLink
                              component="menu"
                              part="Menu.GroupLabel"
                            />
                          </li>
                        </ul>
                      </li>
                      <li>
                        <PartLink
                          component="menu"
                          part="Menu.Separator"
                        />{' '}
                        (optional)
                      </li>
                      <li>
                        Items:
                        <ul>
                          <li>
                            <PartLink
                              component="menu"
                              part="Menu.Item"
                            />
                          </li>
                          <li>
                            <PartLink
                              component="menu"
                              part="Menu.LinkItem"
                            />
                          </li>
                          <li>
                            <PartLink
                              component="menu"
                              part="Menu.CheckboxItem"
                            />
                            <ul>
                              <li>
                                <PartLink
                                  component="menu"
                                  part="Menu.CheckboxItemIndicator"
                                />
                              </li>
                            </ul>
                          </li>
                          <li>
                            <PartLink
                              component="menu"
                              part="Menu.RadioGroup"
                            />
                            <ul>
                              <li>
                                <PartLink
                                  component="menu"
                                  part="Menu.RadioItem"
                                />
                                <ul>
                                  <li>
                                    <PartLink
                                      component="menu"
                                      part="Menu.RadioItemIndicator"
                                    />
                                  </li>
                                </ul>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <PartLink
                              component="menu"
                              part="Menu.SubmenuRoot"
                            />
                            <ul>
                              <li>
                                <PartLink
                                  component="menu"
                                  part="Menu.SubmenuTrigger"
                                />
                              </li>
                              <li>its own portal, positioner and popup</li>
                            </ul>
                          </li>
                          <li>
                            In each item:{' '}
                            <PartLink
                              component="menu"
                              part="Menu.Icon"
                            />
                            ,{' '}
                            <PartLink
                              component="menu"
                              part="Menu.Label"
                            />
                            ,{' '}
                            <PartLink
                              component="menu"
                              part="Menu.Subtitle"
                            />{' '}
                            and{' '}
                            <PartLink
                              component="menu"
                              part="Menu.Shortcut"
                            />{' '}
                            (all optional except the label)
                            <ul>
                              <li className="demo-tree-context">
                                <PartLink
                                  component="symbol"
                                  part="Symbol"
                                />{' '}
                                <span>(in the icon)</span>
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
          component="menu"
          part="Menu.createHandle"
        />{' '}
        (a menu’s handle, for its triggers outside it)
        <ul>
          <li>
            <PartLink
              component="menu"
              part="useCreateMenuHandle"
            />{' '}
            (the same, in a component)
          </li>
        </ul>
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
        Holds the menu’s state for its trigger and its popup (Base UI’s, as a
        dialog of actions).
      </li>
      <li>
        Its state: <code>open</code> or <code>defaultOpen</code>, and{' '}
        <code>onOpenChange</code> (with the reason).
      </li>
      <li>
        Its <code>size</code>, for all its popups: <code>compact</code> (a
        phone’s menu) or <code>regular</code> (a tablet’s).
      </li>
      <li>
        It’s modal by default: the page doesn’t scroll, and outside presses only
        close it.
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
        What opens it. By default, that’s a press (on touch, as the finger goes
        down, so you can drag on to an item and lift to choose it).
      </li>
      <li>
        With <code>openOn=&quot;secondaryClick&quot;</code>, a right click or a
        held touch opens it, and a click stays the trigger’s own (for example a
        back button with a history).
      </li>
      <li>
        Renders a <code>button</code>. Usually a{' '}
        <a href={publicUrl('button')}>Button</a> (<code>render</code>).
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
        It has no box of its own (<code>display: contents</code>), so rendering
        it into a container laid out as a flex column (such as a screen) doesn’t
        shift that container’s content.
      </li>
      <li>
        Renders its positioner into <code>document.body</code> (or its{' '}
        <code>container</code>), above the page.
      </li>
      <li>
        Here: open the menu with its trigger to see it. One menu opens at a
        time.
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
        An element covering the page under the popup (optional). It has no
        styles, since these menus don’t dim the page.
      </li>
      <li>It isn’t rendered in a submenu.</li>
      <li>
        Here: open the menu with its trigger to see it. One menu opens at a
        time.
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
        Places the popup at its trigger: below it, centered, 8px away. Without
        room, it goes to the other side.
      </li>
      <li>
        A submenu’s goes below its trigger, over the parent’s items, when
        compact, and next to it, with its first item at the trigger, when
        regular.
      </li>
      <li>It closes the menu once its trigger scrolls out of view.</li>
      <li>
        Here: open the menu with its trigger to see it. One menu opens at a
        time.
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
        The menu itself, in the medium glass. It’s at least 238px wide and at
        most 280px (compact) or 320px (regular), with longer labels wrapping. It
        scales in from its trigger.
      </li>
      <li>
        Its selection moves between the items (by pointer or by keys), as a pill
        concentric with its corners.
      </li>
      <li>When it’s taller than the room it has, it scrolls.</li>
      <li>
        Here: open the menu with its trigger to see it. One menu opens at a
        time.
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
        An action: its <code>onClick</code>. The menu closes after it (
        <code>closeOnClick</code>).
      </li>
      <li>
        Its look: <code>destructive</code> (red) and <code>disabled</code>. Its
        contents are laid out as [checkmark] [symbol] label/subtitle [shortcut
        or chevron].
      </li>
      <li>40px tall (36px when regular).</li>
      <li>
        Here: open the menu with its trigger to see it. One menu opens at a
        time.
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
        A link (<code>href</code>) as an item. It navigates, and the menu stays
        open unless <code>closeOnClick</code> is set.
      </li>
      <li>
        Renders an <code>a</code>.
      </li>
      <li>
        Here: open the menu with its trigger to see it. One menu opens at a
        time.
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
        A toggle: <code>checked</code> or <code>defaultChecked</code>, and{' '}
        <code>onCheckedChange</code>. The menu stays open.
      </li>
      <li>
        With toggles in a popup, all its items keep a column for the checkmark.
      </li>
      <li>
        Here: open the menu with its trigger to see it. One menu opens at a
        time.
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
        The checkmark while checked (drawn as a stroke), at the item’s start.
      </li>
      <li>
        Here: open the menu with its trigger to see it. One menu opens at a
        time.
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
        <code>defaultValue</code>, and <code>onValueChange</code>.
      </li>
      <li>
        Usually in a <PartLink part="Menu.Group" /> with a{' '}
        <PartLink part="Menu.GroupLabel" /> (“Sort By”).
      </li>
      <li>
        Here: open the menu with its trigger to see it. One menu opens at a
        time.
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
        One of its group’s choices (<code>value</code>). The menu stays open.
      </li>
      <li>
        Here: open the menu with its trigger to see it. One menu opens at a
        time.
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
        The checkmark of the chosen item (radio items use checkmarks too).
      </li>
      <li>
        Here: open the menu with its trigger to see it. One menu opens at a
        time.
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
        A menu inside the menu: its <PartLink part="Menu.SubmenuTrigger" />, and
        its own portal, positioner and popup.
      </li>
      <li>
        When compact, it opens over its trigger, which stays with its chevron
        turned down, while the parent’s other items fade. When regular, it opens
        next to it.
      </li>
      <li>Renders no element.</li>
      <li>
        Here: open the menu with its trigger to see it. One menu opens at a
        time.
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
        An item that opens its submenu, with a chevron at its end. Hovering
        opens it too (<code>openOnHover</code>), by default only when regular.
        When compact, its submenu covers the menu, so it has to be pressed (a
        phone’s menu has no hover).
      </li>
      <li>When regular, it keeps the selection while its submenu is open.</li>
      <li>
        Here: open the menu with its trigger to see it. One menu opens at a
        time.
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
        Here: open the menu with its trigger to see it. One menu opens at a
        time.
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
        Here: open the menu with its trigger to see it. One menu opens at a
        time.
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
        Here: open the menu with its trigger to see it. One menu opens at a
        time.
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
        Here: open the menu with its trigger to see it. One menu opens at a
        time.
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
        It’s an item (with an item’s props), and its selection is a rounded tile
        concentric with the popup.
      </li>
      <li>
        Here: open the menu with its trigger to see it. One menu opens at a
        time.
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
        An item’s symbol (a <a href={publicUrl('symbol')}>Symbol</a>), 28px
        wide, before its label (without one, the gap goes too). In a quick
        action, it sits above the label.
      </li>
      <li>
        Here: open the menu with its trigger to see it. One menu opens at a
        time.
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
      <li>An item’s text: 17px (15px when regular).</li>
      <li>
        Here: open the menu with its trigger to see it. One menu opens at a
        time.
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
        Here: open the menu with its trigger to see it. One menu opens at a
        time.
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
        A keyboard shortcut at the item’s end (when regular), with each glyph in
        a cell (⌘R).
      </li>
      <li>
        Renders a <code>kbd</code>. It’s only shown; the app handles the keys.
      </li>
      <li>
        Here: open the menu with its trigger to see it. One menu opens at a
        time.
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
        A handle that links a menu to its triggers outside its root, and opens
        or closes it from code (Base UI’s <code>Menu.createHandle</code>).
      </li>
      <li>
        Make it once, outside a component (inside one, use{' '}
        <PartLink part="useCreateMenuHandle" />
        ).
      </li>
    </ul>
    <CreateHandlePart />
    <h3>Type Parameters</h3>
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
        same for the component’s lifetime.
      </li>
      <li>
        Its triggers pass a <code>payload</code>, and the root’s children, as a
        function of it, render the menu for the trigger that opened it.
      </li>
    </ul>
    <UseCreateMenuHandlePart />
    <h3>Type Parameters</h3>
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
