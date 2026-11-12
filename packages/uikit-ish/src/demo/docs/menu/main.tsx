import './style.css';

import { FunctionComponent, useMemo, useState } from 'react';

import { Button, Menu, Symbol } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useLabelledRef } from '../../tooling/frame/render-code.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  sfChevronUpChevronDown,
  sfLockFill,
  sfPinFill,
  sfSquare,
  sfSquareAndArrowUp,
} from '../../tooling/icons.js';
import { partPropMaps } from '../part-options.js';
import {
  getPropOptionsCheckboxItems,
  getPropOptionsItem,
  getPropOptionsRadioGroup,
  getPropOptionsRoot,
  getPropOptionsSubmenuRoot,
  getPropOptionsTrigger,
  propOptionsIndicator,
  propOptionsItem,
  propOptionsItemDestructive,
  propOptionsItemDisabled,
  propOptionsOpenRoot,
  propOptionsPopup,
  propOptionsPositioner,
  propOptionsSubmenuTrigger,
  propOptionsToggleItem,
} from './props.js';

/**
 * A menu (Base UI Menu): its trigger a `Button` (`render`),
 * quick actions, items (with symbols, shortcuts, a subtitle), sections and
 * a submenu.
 */
export const MenuDemo: FunctionComponent = () => {
  const id = 'menu';

  const [log, addLog] = useLog();
  const [
    externalRoot,
    externalTrigger,
    externalPositioner,
    externalPopup,
    externalQuickAction,
    externalItem,
    externalDisabledItem,
    externalDestructiveItem,
    externalSubmenuRoot,
    externalSubmenuTrigger,
    externalSubmenuPositioner,
    externalSubmenuPopup,
  ] = useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external: externalRoot, isOpen: true, title: 'root' },
  );
  const [controlTrigger, propsTrigger, stateTrigger] = usePropControl(
    useMemo(() => getPropOptionsTrigger(addLog), [addLog]),
    { external: externalTrigger, title: 'trigger' },
  );
  const [controlPositioner, propsPositioner, statePositioner] = usePropControl(
    propOptionsPositioner,
    { external: externalPositioner, title: 'positioner' },
  );
  const [controlPopup, propsPopup, statePopup] = usePropControl(
    propOptionsPopup,
    { external: externalPopup, title: 'popup' },
  );
  const [controlQuickAction, propsQuickAction, stateQuickAction] =
    usePropControl(propOptionsItem, {
      external: externalQuickAction,
      title: 'quick action (1st)',
    });
  const [controlItem, propsItem, stateItem] = usePropControl(
    useMemo(() => getPropOptionsItem(addLog), [addLog]),
    { external: externalItem, title: 'item (1st)' },
  );
  const [controlDisabledItem, propsDisabledItem, stateDisabledItem] =
    usePropControl(propOptionsItemDisabled, {
      external: externalDisabledItem,
      title: 'item (disabled)',
    });
  const [controlDestructiveItem, propsDestructiveItem, stateDestructiveItem] =
    usePropControl(propOptionsItemDestructive, {
      external: externalDestructiveItem,
      title: 'item (destructive)',
    });
  const [
    controlSubmenuRoot,
    propsSubmenuRoot,
    stateSubmenuRoot,
    keySubmenuRoot,
  ] = usePropControl(
    useMemo(() => getPropOptionsSubmenuRoot(addLog), [addLog]),
    { external: externalSubmenuRoot, title: 'submenu root' },
  );
  const [controlSubmenuTrigger, propsSubmenuTrigger, stateSubmenuTrigger] =
    usePropControl(propOptionsSubmenuTrigger, {
      external: externalSubmenuTrigger,
      title: 'submenu trigger',
    });
  const [
    controlSubmenuPositioner,
    propsSubmenuPositioner,
    stateSubmenuPositioner,
  ] = usePropControl(propOptionsPositioner, {
    external: externalSubmenuPositioner,
    title: 'submenu positioner',
  });
  const [controlSubmenuPopup, propsSubmenuPopup, stateSubmenuPopup] =
    usePropControl(propOptionsPopup, {
      external: externalSubmenuPopup,
      title: 'submenu popup',
    });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Menu.Item': ['onClick'],
            'Menu.QuickAction': ['destructive'],
            Symbol: ['icon'],
            'Button.Label': [],
            'Button.Root': ['variant'],
            'Menu.Group': [],
            'Menu.GroupLabel': [],
            'Menu.Icon': [],
            'Menu.Label': [],
            'Menu.Portal': [],
            'Menu.QuickActions': [],
            'Menu.Separator': [],
            'Menu.Shortcut': [],
            'Menu.Subtitle': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      baseUiId="menu"
      id={id}
      log={log}
      title="Menu"
      controls={[
        controlRoot,
        controlTrigger,
        controlPositioner,
        controlPopup,
        controlQuickAction,
        controlItem,
        controlDisabledItem,
        controlDestructiveItem,
        controlSubmenuRoot,
        controlSubmenuTrigger,
        controlSubmenuPositioner,
        controlSubmenuPopup,
        partControls,
      ]}
      state={[
        stateRoot,
        stateTrigger,
        statePositioner,
        statePopup,
        stateQuickAction,
        stateItem,
        stateDisabledItem,
        stateDestructiveItem,
        stateSubmenuRoot,
        stateSubmenuTrigger,
        stateSubmenuPositioner,
        stateSubmenuPopup,
        partState,
      ]}
    >
      <Menu.Root
        key={`${keyRoot}-${keySubmenuRoot}`}
        {...propsRoot}
      >
        <div className="menu-demo-trigger-space">
          <Menu.Trigger
            {...propsTrigger}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                variant="glass"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Open Menu
            </Button.Label>
          </Menu.Trigger>
        </div>
        <Menu.Portal {...partProps['Menu.Portal']}>
          <Menu.Positioner {...propsPositioner}>
            <Menu.Popup {...propsPopup}>
              <Menu.QuickActions {...partProps['Menu.QuickActions']}>
                <Menu.QuickAction {...propsQuickAction}>
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfSquareAndArrowUp}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Share</Menu.Label>
                </Menu.QuickAction>
                <Menu.QuickAction {...partProps['Menu.QuickAction']}>
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPinFill}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Pin</Menu.Label>
                </Menu.QuickAction>
                <Menu.QuickAction
                  {...partProps['Menu.QuickAction']}
                  destructive
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfLockFill}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Lock</Menu.Label>
                </Menu.QuickAction>
              </Menu.QuickActions>
              <Menu.Separator {...partProps['Menu.Separator']} />

              <Menu.Item {...propsItem}>
                <Menu.Icon {...partProps['Menu.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfSquare}
                  />
                </Menu.Icon>
                <Menu.Label {...partProps['Menu.Label']}>Action</Menu.Label>
                <Menu.Shortcut {...partProps['Menu.Shortcut']}>
                  ⌘A
                </Menu.Shortcut>
              </Menu.Item>
              <Menu.Item {...propsDisabledItem}>
                <Menu.Icon {...partProps['Menu.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfSquare}
                  />
                </Menu.Icon>
                <Menu.Label {...partProps['Menu.Label']}>
                  Disabled Action
                </Menu.Label>
                <Menu.Shortcut {...partProps['Menu.Shortcut']}>
                  ⇧⌘A
                </Menu.Shortcut>
              </Menu.Item>
              <Menu.Item {...propsDestructiveItem}>
                <Menu.Icon {...partProps['Menu.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfSquare}
                  />
                </Menu.Icon>
                <Menu.Label {...partProps['Menu.Label']}>Delete</Menu.Label>
              </Menu.Item>

              <Menu.Separator {...partProps['Menu.Separator']} />

              <Menu.Item
                {...partProps['Menu.Item']}
                onClick={() => addLog('subtitled item clicked')}
              >
                <Menu.Icon {...partProps['Menu.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfSquare}
                  />
                </Menu.Icon>
                <Menu.Label {...partProps['Menu.Label']}>Action</Menu.Label>
                <Menu.Subtitle {...partProps['Menu.Subtitle']}>
                  Subtitle
                </Menu.Subtitle>
              </Menu.Item>

              <Menu.Separator {...partProps['Menu.Separator']} />
              <Menu.Group {...partProps['Menu.Group']}>
                <Menu.GroupLabel {...partProps['Menu.GroupLabel']}>
                  Section Title
                </Menu.GroupLabel>
                <Menu.SubmenuRoot {...propsSubmenuRoot}>
                  <Menu.SubmenuTrigger {...propsSubmenuTrigger}>
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquare}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Submenu
                    </Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal {...partProps['Menu.Portal']}>
                    <Menu.Positioner {...propsSubmenuPositioner}>
                      <Menu.Popup {...propsSubmenuPopup}>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('submenu item clicked')}
                        >
                          <Menu.Icon {...partProps['Menu.Icon']}>
                            <Symbol
                              {...partProps.Symbol}
                              icon={sfSquare}
                            />
                          </Menu.Icon>
                          <Menu.Label {...partProps['Menu.Label']}>
                            Submenu Action
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('submenu item clicked')}
                        >
                          <Menu.Icon {...partProps['Menu.Icon']}>
                            <Symbol
                              {...partProps.Symbol}
                              icon={sfSquare}
                            />
                          </Menu.Icon>
                          <Menu.Label {...partProps['Menu.Label']}>
                            Another Action
                          </Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.Item
                  {...partProps['Menu.Item']}
                  onClick={() => addLog('item clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfSquare}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>
                    Action with a long label
                  </Menu.Label>
                </Menu.Item>
              </Menu.Group>
              <Menu.Separator {...partProps['Menu.Separator']} />
              <Menu.Group {...partProps['Menu.Group']}>
                <Menu.GroupLabel {...partProps['Menu.GroupLabel']}>
                  Section Title
                </Menu.GroupLabel>
                <Menu.Item
                  {...partProps['Menu.Item']}
                  onClick={() => addLog('item clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfSquare}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Action</Menu.Label>
                </Menu.Item>
              </Menu.Group>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </Component>
  );
};

/** The menu in the regular size (regular): submenus open beside it. */
export const MenuRegularDemo: FunctionComponent = () => {
  const id = 'menu-regular';

  const [log, addLog] = useLog();
  const [
    externalRoot,
    externalTrigger,
    externalPositioner,
    externalPopup,
    externalQuickAction,
    externalItem,
    externalDisabledItem,
    externalDestructiveItem,
    externalSubmenuRoot,
    externalSubmenuTrigger,
    externalSubmenuPositioner,
    externalSubmenuPopup,
  ] = useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external: externalRoot, isOpen: true, title: 'root' },
  );
  const [controlTrigger, propsTrigger, stateTrigger] = usePropControl(
    useMemo(() => getPropOptionsTrigger(addLog), [addLog]),
    { external: externalTrigger, title: 'trigger' },
  );
  const [controlPositioner, propsPositioner, statePositioner] = usePropControl(
    propOptionsPositioner,
    { external: externalPositioner, title: 'positioner' },
  );
  const [controlPopup, propsPopup, statePopup] = usePropControl(
    propOptionsPopup,
    { external: externalPopup, title: 'popup' },
  );
  const [controlQuickAction, propsQuickAction, stateQuickAction] =
    usePropControl(propOptionsItem, {
      external: externalQuickAction,
      title: 'quick action (1st)',
    });
  const [controlItem, propsItem, stateItem] = usePropControl(
    useMemo(() => getPropOptionsItem(addLog), [addLog]),
    { external: externalItem, title: 'item (1st)' },
  );
  const [controlDisabledItem, propsDisabledItem, stateDisabledItem] =
    usePropControl(propOptionsItemDisabled, {
      external: externalDisabledItem,
      title: 'item (disabled)',
    });
  const [controlDestructiveItem, propsDestructiveItem, stateDestructiveItem] =
    usePropControl(propOptionsItemDestructive, {
      external: externalDestructiveItem,
      title: 'item (destructive)',
    });
  const [
    controlSubmenuRoot,
    propsSubmenuRoot,
    stateSubmenuRoot,
    keySubmenuRoot,
  ] = usePropControl(
    useMemo(() => getPropOptionsSubmenuRoot(addLog), [addLog]),
    { external: externalSubmenuRoot, title: 'submenu root' },
  );
  const [controlSubmenuTrigger, propsSubmenuTrigger, stateSubmenuTrigger] =
    usePropControl(propOptionsSubmenuTrigger, {
      external: externalSubmenuTrigger,
      title: 'submenu trigger',
    });
  const [
    controlSubmenuPositioner,
    propsSubmenuPositioner,
    stateSubmenuPositioner,
  ] = usePropControl(propOptionsPositioner, {
    external: externalSubmenuPositioner,
    title: 'submenu positioner',
  });
  const [controlSubmenuPopup, propsSubmenuPopup, stateSubmenuPopup] =
    usePropControl(propOptionsPopup, {
      external: externalSubmenuPopup,
      title: 'submenu popup',
    });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Menu.Item': ['onClick'],
            'Menu.QuickAction': ['destructive'],
            Symbol: ['icon'],
            'Button.Label': [],
            'Button.Root': ['variant'],
            'Menu.Group': [],
            'Menu.GroupLabel': [],
            'Menu.Icon': [],
            'Menu.Label': [],
            'Menu.Portal': [],
            'Menu.QuickActions': [],
            'Menu.Separator': [],
            'Menu.Shortcut': [],
            'Menu.Subtitle': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      baseUiId="menu"
      id={id}
      log={log}
      title="Menu (regular)"
      controls={[
        controlRoot,
        controlTrigger,
        controlPositioner,
        controlPopup,
        controlQuickAction,
        controlItem,
        controlDisabledItem,
        controlDestructiveItem,
        controlSubmenuRoot,
        controlSubmenuTrigger,
        controlSubmenuPositioner,
        controlSubmenuPopup,
        partControls,
      ]}
      state={[
        stateRoot,
        stateTrigger,
        statePositioner,
        statePopup,
        stateQuickAction,
        stateItem,
        stateDisabledItem,
        stateDestructiveItem,
        stateSubmenuRoot,
        stateSubmenuTrigger,
        stateSubmenuPositioner,
        stateSubmenuPopup,
        partState,
      ]}
    >
      <Menu.Root
        key={`${keyRoot}-${keySubmenuRoot}`}
        {...propsRoot}
        size="regular"
      >
        <div className="menu-demo-trigger-space">
          <Menu.Trigger
            {...propsTrigger}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                variant="glass"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Open Menu
            </Button.Label>
          </Menu.Trigger>
        </div>
        <Menu.Portal {...partProps['Menu.Portal']}>
          <Menu.Positioner {...propsPositioner}>
            <Menu.Popup {...propsPopup}>
              <Menu.QuickActions {...partProps['Menu.QuickActions']}>
                <Menu.QuickAction {...propsQuickAction}>
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfSquareAndArrowUp}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Share</Menu.Label>
                </Menu.QuickAction>
                <Menu.QuickAction {...partProps['Menu.QuickAction']}>
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfPinFill}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Pin</Menu.Label>
                </Menu.QuickAction>
                <Menu.QuickAction
                  {...partProps['Menu.QuickAction']}
                  destructive
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfLockFill}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Lock</Menu.Label>
                </Menu.QuickAction>
              </Menu.QuickActions>
              <Menu.Separator {...partProps['Menu.Separator']} />

              <Menu.Item {...propsItem}>
                <Menu.Icon {...partProps['Menu.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfSquare}
                  />
                </Menu.Icon>
                <Menu.Label {...partProps['Menu.Label']}>Action</Menu.Label>
                <Menu.Shortcut {...partProps['Menu.Shortcut']}>
                  ⌘A
                </Menu.Shortcut>
              </Menu.Item>
              <Menu.Item {...propsDisabledItem}>
                <Menu.Icon {...partProps['Menu.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfSquare}
                  />
                </Menu.Icon>
                <Menu.Label {...partProps['Menu.Label']}>
                  Disabled Action
                </Menu.Label>
                <Menu.Shortcut {...partProps['Menu.Shortcut']}>
                  ⇧⌘A
                </Menu.Shortcut>
              </Menu.Item>
              <Menu.Item {...propsDestructiveItem}>
                <Menu.Icon {...partProps['Menu.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfSquare}
                  />
                </Menu.Icon>
                <Menu.Label {...partProps['Menu.Label']}>Delete</Menu.Label>
              </Menu.Item>

              <Menu.Separator {...partProps['Menu.Separator']} />

              <Menu.Item
                {...partProps['Menu.Item']}
                onClick={() => addLog('subtitled item clicked')}
              >
                <Menu.Icon {...partProps['Menu.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfSquare}
                  />
                </Menu.Icon>
                <Menu.Label {...partProps['Menu.Label']}>Action</Menu.Label>
                <Menu.Subtitle {...partProps['Menu.Subtitle']}>
                  Subtitle
                </Menu.Subtitle>
              </Menu.Item>

              <Menu.Separator {...partProps['Menu.Separator']} />
              <Menu.Group {...partProps['Menu.Group']}>
                <Menu.GroupLabel {...partProps['Menu.GroupLabel']}>
                  Section Title
                </Menu.GroupLabel>
                <Menu.SubmenuRoot {...propsSubmenuRoot}>
                  <Menu.SubmenuTrigger {...propsSubmenuTrigger}>
                    <Menu.Icon {...partProps['Menu.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfSquare}
                      />
                    </Menu.Icon>
                    <Menu.Label {...partProps['Menu.Label']}>
                      Submenu
                    </Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal {...partProps['Menu.Portal']}>
                    <Menu.Positioner {...propsSubmenuPositioner}>
                      <Menu.Popup {...propsSubmenuPopup}>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('submenu item clicked')}
                        >
                          <Menu.Icon {...partProps['Menu.Icon']}>
                            <Symbol
                              {...partProps.Symbol}
                              icon={sfSquare}
                            />
                          </Menu.Icon>
                          <Menu.Label {...partProps['Menu.Label']}>
                            Submenu Action
                          </Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          {...partProps['Menu.Item']}
                          onClick={() => addLog('submenu item clicked')}
                        >
                          <Menu.Icon {...partProps['Menu.Icon']}>
                            <Symbol
                              {...partProps.Symbol}
                              icon={sfSquare}
                            />
                          </Menu.Icon>
                          <Menu.Label {...partProps['Menu.Label']}>
                            Another Action
                          </Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.Item
                  {...partProps['Menu.Item']}
                  onClick={() => addLog('item clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfSquare}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>
                    Action with a long label
                  </Menu.Label>
                </Menu.Item>
              </Menu.Group>
              <Menu.Separator {...partProps['Menu.Separator']} />
              <Menu.Group {...partProps['Menu.Group']}>
                <Menu.GroupLabel {...partProps['Menu.GroupLabel']}>
                  Section Title
                </Menu.GroupLabel>
                <Menu.Item
                  {...partProps['Menu.Item']}
                  onClick={() => addLog('item clicked')}
                >
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfSquare}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>Action</Menu.Label>
                </Menu.Item>
              </Menu.Group>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </Component>
  );
};

/** Checkbox items, and a radio group: a checkmark column in every item. */
export const MenuTogglesDemo: FunctionComponent = () => {
  const id = 'menu-toggles';

  const [log, addLog] = useLog();
  const [
    externalRoot,
    externalCheckboxItem,
    externalRadioGroup,
    externalRadioItem,
    externalIndicator,
  ] = useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external: externalRoot, isOpen: true, title: 'root' },
  );
  const [
    controlCheckboxItem,
    propsCheckboxItem,
    stateCheckboxItem,
    keyCheckboxItem,
  ] = usePropControl(
    useMemo(() => getPropOptionsCheckboxItems(addLog), [addLog]),
    { external: externalCheckboxItem, title: 'checkbox item (1st)' },
  );
  const [controlRadioGroup, propsRadioGroup, stateRadioGroup, keyRadioGroup] =
    usePropControl(
      useMemo(() => getPropOptionsRadioGroup(addLog), [addLog]),
      { external: externalRadioGroup, title: 'radio group' },
    );
  const [controlRadioItem, propsRadioItem, stateRadioItem] = usePropControl(
    propOptionsToggleItem,
    { external: externalRadioItem, title: 'radio item (1st)' },
  );
  const [controlIndicator, propsIndicator, stateIndicator] = usePropControl(
    propOptionsIndicator,
    { external: externalIndicator, title: 'indicator (1st)' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Menu.CheckboxItem': ['defaultChecked'],
            'Menu.CheckboxItemIndicator': [],
            'Menu.RadioItem': ['value'],
            Symbol: ['icon'],
            'Button.Label': [],
            'Button.Root': ['variant'],
            'Menu.Icon': [],
            'Menu.Item': ['onClick'],
            'Menu.Label': [],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': [],
            'Menu.RadioItemIndicator': [],
            'Menu.Separator': [],
            'Menu.Trigger': ['render'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      baseUiId="menu"
      id={id}
      log={log}
      title="Menu (Toggles)"
      controls={[
        controlRoot,
        controlCheckboxItem,
        controlRadioGroup,
        controlRadioItem,
        controlIndicator,
        partControls,
      ]}
      state={[
        stateRoot,
        stateCheckboxItem,
        stateRadioGroup,
        stateRadioItem,
        stateIndicator,
        partState,
      ]}
    >
      <Menu.Root
        key={`${keyRoot}-${keyCheckboxItem}-${keyRadioGroup}`}
        {...propsRoot}
      >
        <div className="menu-demo-trigger-space">
          <Menu.Trigger
            {...partProps['Menu.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                variant="glass"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>
              Open Menu
            </Button.Label>
          </Menu.Trigger>
        </div>
        <Menu.Portal {...partProps['Menu.Portal']}>
          <Menu.Positioner {...partProps['Menu.Positioner']}>
            <Menu.Popup {...partProps['Menu.Popup']}>
              <Menu.Item
                {...partProps['Menu.Item']}
                onClick={() => addLog('item clicked')}
              >
                <Menu.Icon {...partProps['Menu.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfSquare}
                  />
                </Menu.Icon>
                <Menu.Label {...partProps['Menu.Label']}>Action</Menu.Label>
              </Menu.Item>

              <Menu.Separator {...partProps['Menu.Separator']} />
              <Menu.CheckboxItem {...propsCheckboxItem}>
                <Menu.CheckboxItemIndicator {...propsIndicator} />
                <Menu.Icon {...partProps['Menu.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfSquare}
                  />
                </Menu.Icon>
                <Menu.Label {...partProps['Menu.Label']}>Checkbox</Menu.Label>
              </Menu.CheckboxItem>
              <Menu.CheckboxItem
                {...partProps['Menu.CheckboxItem']}
                defaultChecked={false}
              >
                <Menu.CheckboxItemIndicator
                  {...partProps['Menu.CheckboxItemIndicator']}
                />
                <Menu.Icon {...partProps['Menu.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfSquare}
                  />
                </Menu.Icon>
                <Menu.Label {...partProps['Menu.Label']}>
                  Another Checkbox
                </Menu.Label>
              </Menu.CheckboxItem>

              <Menu.Separator {...partProps['Menu.Separator']} />
              <Menu.RadioGroup {...propsRadioGroup}>
                <Menu.RadioItem
                  value="first"
                  {...propsRadioItem}
                >
                  <Menu.RadioItemIndicator
                    {...partProps['Menu.RadioItemIndicator']}
                  />
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfSquare}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>
                    Option first
                  </Menu.Label>
                </Menu.RadioItem>
                <Menu.RadioItem
                  {...partProps['Menu.RadioItem']}
                  value="second"
                >
                  <Menu.RadioItemIndicator
                    {...partProps['Menu.RadioItemIndicator']}
                  />
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfSquare}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>
                    Option second
                  </Menu.Label>
                </Menu.RadioItem>
                <Menu.RadioItem
                  {...partProps['Menu.RadioItem']}
                  value="third"
                >
                  <Menu.RadioItemIndicator
                    {...partProps['Menu.RadioItemIndicator']}
                  />
                  <Menu.Icon {...partProps['Menu.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfSquare}
                    />
                  </Menu.Icon>
                  <Menu.Label {...partProps['Menu.Label']}>
                    Option third
                  </Menu.Label>
                </Menu.RadioItem>
              </Menu.RadioGroup>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </Component>
  );
};

/**
 * A pop-up button (a button with a menu, e.g. in a list row): a
 * `Button` with the chosen option's label, then chevron.up.chevron.down,
 * opening a menu of options; choosing one closes it.
 */
export const MenuPopUpDemo: FunctionComponent = () => {
  const id = 'menu-pop-up';

  const [log, addLog] = useLog();

  const [value, setValue] = useState('Daily');

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': ['variant'],
            'Menu.Label': [],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': ['align'],
            'Menu.RadioGroup': ['onValueChange', 'value'],
            'Menu.RadioItem': ['closeOnClick', 'value'],
            'Menu.RadioItemIndicator': [],
            'Menu.Root': [],
            'Menu.Trigger': ['render'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      baseUiId="menu"
      controls={[partControls]}
      id={id}
      log={log}
      state={[partState]}
      title="Menu (Pop-up Button)"
    >
      <div className="menu-demo-trigger-space">
        <Menu.Root {...partProps['Menu.Root']}>
          <Menu.Trigger
            {...partProps['Menu.Trigger']}
            render={
              <Button.Root
                {...partProps['Button.Root']}
                variant="bordered"
              />
            }
          >
            <Button.Label {...partProps['Button.Label']}>{value}</Button.Label>
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfChevronUpChevronDown}
              />
            </Button.Icon>
          </Menu.Trigger>
          <Menu.Portal {...partProps['Menu.Portal']}>
            <Menu.Positioner
              {...partProps['Menu.Positioner']}
              align="end"
            >
              <Menu.Popup {...partProps['Menu.Popup']}>
                <Menu.RadioGroup
                  {...partProps['Menu.RadioGroup']}
                  value={value}
                  onValueChange={(next: unknown) => {
                    addLog(`value change: ${String(next)}`);
                    setValue(String(next));
                  }}
                >
                  {/* A pop-up closes on choosing. */}
                  <Menu.RadioItem
                    {...partProps['Menu.RadioItem']}
                    closeOnClick
                    value="Daily"
                  >
                    <Menu.RadioItemIndicator
                      {...partProps['Menu.RadioItemIndicator']}
                    />
                    <Menu.Label {...partProps['Menu.Label']}>Daily</Menu.Label>
                  </Menu.RadioItem>
                  <Menu.RadioItem
                    {...partProps['Menu.RadioItem']}
                    closeOnClick
                    value="Weekly"
                  >
                    <Menu.RadioItemIndicator
                      {...partProps['Menu.RadioItemIndicator']}
                    />
                    <Menu.Label {...partProps['Menu.Label']}>Weekly</Menu.Label>
                  </Menu.RadioItem>
                  <Menu.RadioItem
                    {...partProps['Menu.RadioItem']}
                    closeOnClick
                    value="Monthly"
                  >
                    <Menu.RadioItemIndicator
                      {...partProps['Menu.RadioItemIndicator']}
                    />
                    <Menu.Label {...partProps['Menu.Label']}>
                      Monthly
                    </Menu.Label>
                  </Menu.RadioItem>
                </Menu.RadioGroup>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </div>
    </Component>
  );
};

/**
 * The menu on its own, open: `Menu` is just the menu; a trigger (usually
 * `Menu.Trigger`, rendered as a `Button` by `render`) opens it, as in the
 * other menu demos. Here it's open without one, at an anchor.
 */
export const MenuOpenDemo: FunctionComponent = () => {
  const id = 'menu-open';
  const [log, addLog] = useLog();
  const anchorRef = useLabelledRef<HTMLSpanElement>(
    'anchorRef',
    'HTMLSpanElement',
  );

  const [externalRoot, externalPopup] = useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot] = usePropControl(
    propOptionsOpenRoot,
    { external: externalRoot, isOpen: true, title: 'root' },
  );

  const [controlPopup, propsPopup, statePopup] = usePropControl(
    propOptionsPopup,
    { external: externalPopup, title: 'popup' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Menu.Icon': [],
            'Menu.Item': ['destructive', 'onClick'],
            'Menu.Label': [],
            'Menu.Portal': [],
            'Menu.Positioner': ['anchor', 'side'],
            'Menu.Separator': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      baseUiId="menu"
      controls={[controlRoot, controlPopup, partControls]}
      id={id}
      log={log}
      state={[stateRoot, statePopup, partState]}
      title="Menu (Open)"
    >
      <span
        ref={anchorRef}
        className="menu-demo-anchor"
      />
      {/* Always open. */}
      <Menu.Root
        {...propsRoot}
        open
        modal={false}
      >
        <Menu.Portal {...partProps['Menu.Portal']}>
          <Menu.Positioner
            {...partProps['Menu.Positioner']}
            anchor={anchorRef}
            side="block-end"
          >
            <Menu.Popup {...propsPopup}>
              <Menu.Item
                {...partProps['Menu.Item']}
                onClick={() => addLog('Copy clicked')}
              >
                <Menu.Label {...partProps['Menu.Label']}>Copy</Menu.Label>
              </Menu.Item>
              <Menu.Item
                {...partProps['Menu.Item']}
                onClick={() => addLog('Share clicked')}
              >
                <Menu.Label {...partProps['Menu.Label']}>Share</Menu.Label>
                <Menu.Icon {...partProps['Menu.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfSquareAndArrowUp}
                  />
                </Menu.Icon>
              </Menu.Item>
              <Menu.Separator {...partProps['Menu.Separator']} />
              <Menu.Item
                {...partProps['Menu.Item']}
                destructive
                onClick={() => addLog('Delete clicked')}
              >
                <Menu.Label {...partProps['Menu.Label']}>Delete</Menu.Label>
              </Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </Component>
  );
};
