import './style.css';

import { sfChevronUpChevronDown } from '@bradleyhodges/sfsymbols/sfChevronUpChevronDown';
import { sfLockFill } from '@bradleyhodges/sfsymbols/sfLockFill';
import { sfPinFill } from '@bradleyhodges/sfsymbols/sfPinFill';
import { sfSquare } from '@bradleyhodges/sfsymbols/sfSquare';
import { sfSquareAndArrowUp } from '@bradleyhodges/sfsymbols/sfSquareAndArrowUp';
import { FunctionComponent, useMemo, useRef, useState } from 'react';

import { Button, Menu, Symbol } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
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
 * A menu (Base UI Menu, Figma “Menu”): its trigger a `Button` (`render`),
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
    'root',
    externalRoot,
    true,
  );
  const [controlTrigger, propsTrigger, stateTrigger] = usePropControl(
    useMemo(() => getPropOptionsTrigger(addLog), [addLog]),
    'trigger',
    externalTrigger,
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
  const [controlQuickAction, propsQuickAction, stateQuickAction] =
    usePropControl(propOptionsItem, 'quick action (1st)', externalQuickAction);
  const [controlItem, propsItem, stateItem] = usePropControl(
    useMemo(() => getPropOptionsItem(addLog), [addLog]),
    'item (1st)',
    externalItem,
  );
  const [controlDisabledItem, propsDisabledItem, stateDisabledItem] =
    usePropControl(
      propOptionsItemDisabled,
      'item (disabled)',
      externalDisabledItem,
    );
  const [controlDestructiveItem, propsDestructiveItem, stateDestructiveItem] =
    usePropControl(
      propOptionsItemDestructive,
      'item (destructive)',
      externalDestructiveItem,
    );
  const [
    controlSubmenuRoot,
    propsSubmenuRoot,
    stateSubmenuRoot,
    keySubmenuRoot,
  ] = usePropControl(
    useMemo(() => getPropOptionsSubmenuRoot(addLog), [addLog]),
    'submenu root',
    externalSubmenuRoot,
  );
  const [controlSubmenuTrigger, propsSubmenuTrigger, stateSubmenuTrigger] =
    usePropControl(
      propOptionsSubmenuTrigger,
      'submenu trigger',
      externalSubmenuTrigger,
    );
  const [
    controlSubmenuPositioner,
    propsSubmenuPositioner,
    stateSubmenuPositioner,
  ] = usePropControl(
    propOptionsPositioner,
    'submenu positioner',
    externalSubmenuPositioner,
  );
  const [controlSubmenuPopup, propsSubmenuPopup, stateSubmenuPopup] =
    usePropControl(propOptionsPopup, 'submenu popup', externalSubmenuPopup);

  return (
    <Component
      center
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
      ]}
    >
      <Menu.Root
        key={`${keyRoot}-${keySubmenuRoot}`}
        {...propsRoot}
      >
        <div className="menu-demo-trigger-space">
          <Menu.Trigger
            {...propsTrigger}
            render={<Button.Root variant="glass" />}
          >
            <Button.Label>Open Menu</Button.Label>
          </Menu.Trigger>
        </div>
        <Menu.Portal>
          <Menu.Positioner {...propsPositioner}>
            <Menu.Popup {...propsPopup}>
              <Menu.QuickActions>
                <Menu.QuickAction {...propsQuickAction}>
                  <Menu.Icon>
                    <Symbol icon={sfSquareAndArrowUp} />
                  </Menu.Icon>
                  <Menu.Label>Share</Menu.Label>
                </Menu.QuickAction>
                <Menu.QuickAction>
                  <Menu.Icon>
                    <Symbol icon={sfPinFill} />
                  </Menu.Icon>
                  <Menu.Label>Pin</Menu.Label>
                </Menu.QuickAction>
                <Menu.QuickAction destructive>
                  <Menu.Icon>
                    <Symbol icon={sfLockFill} />
                  </Menu.Icon>
                  <Menu.Label>Lock</Menu.Label>
                </Menu.QuickAction>
              </Menu.QuickActions>
              <Menu.Separator />

              <Menu.Item {...propsItem}>
                <Menu.Icon>
                  <Symbol icon={sfSquare} />
                </Menu.Icon>
                <Menu.Label>Action</Menu.Label>
                <Menu.Shortcut>⌘A</Menu.Shortcut>
              </Menu.Item>
              <Menu.Item {...propsDisabledItem}>
                <Menu.Icon>
                  <Symbol icon={sfSquare} />
                </Menu.Icon>
                <Menu.Label>Disabled Action</Menu.Label>
                <Menu.Shortcut>⇧⌘A</Menu.Shortcut>
              </Menu.Item>
              <Menu.Item {...propsDestructiveItem}>
                <Menu.Icon>
                  <Symbol icon={sfSquare} />
                </Menu.Icon>
                <Menu.Label>Delete</Menu.Label>
              </Menu.Item>

              <Menu.Separator />

              <Menu.Item onClick={() => addLog('subtitled item clicked')}>
                <Menu.Icon>
                  <Symbol icon={sfSquare} />
                </Menu.Icon>
                <Menu.Label>Action</Menu.Label>
                <Menu.Subtitle>Subtitle</Menu.Subtitle>
              </Menu.Item>

              <Menu.Separator />
              <Menu.Group>
                <Menu.GroupLabel>Section Title</Menu.GroupLabel>
                <Menu.SubmenuRoot {...propsSubmenuRoot}>
                  <Menu.SubmenuTrigger {...propsSubmenuTrigger}>
                    <Menu.Icon>
                      <Symbol icon={sfSquare} />
                    </Menu.Icon>
                    <Menu.Label>Submenu</Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
                    <Menu.Positioner {...propsSubmenuPositioner}>
                      <Menu.Popup {...propsSubmenuPopup}>
                        <Menu.Item
                          onClick={() => addLog('submenu item clicked')}
                        >
                          <Menu.Icon>
                            <Symbol icon={sfSquare} />
                          </Menu.Icon>
                          <Menu.Label>Submenu Action</Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          onClick={() => addLog('submenu item clicked')}
                        >
                          <Menu.Icon>
                            <Symbol icon={sfSquare} />
                          </Menu.Icon>
                          <Menu.Label>Another Action</Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.Item onClick={() => addLog('item clicked')}>
                  <Menu.Icon>
                    <Symbol icon={sfSquare} />
                  </Menu.Icon>
                  <Menu.Label>Action with a long label</Menu.Label>
                </Menu.Item>
              </Menu.Group>
              <Menu.Separator />
              <Menu.Group>
                <Menu.GroupLabel>Section Title</Menu.GroupLabel>
                <Menu.Item onClick={() => addLog('item clicked')}>
                  <Menu.Icon>
                    <Symbol icon={sfSquare} />
                  </Menu.Icon>
                  <Menu.Label>Action</Menu.Label>
                </Menu.Item>
              </Menu.Group>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </Component>
  );
};

/** The menu in the regular size (iPad): submenus open beside it. */
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
    'root',
    externalRoot,
    true,
  );
  const [controlTrigger, propsTrigger, stateTrigger] = usePropControl(
    useMemo(() => getPropOptionsTrigger(addLog), [addLog]),
    'trigger',
    externalTrigger,
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
  const [controlQuickAction, propsQuickAction, stateQuickAction] =
    usePropControl(propOptionsItem, 'quick action (1st)', externalQuickAction);
  const [controlItem, propsItem, stateItem] = usePropControl(
    useMemo(() => getPropOptionsItem(addLog), [addLog]),
    'item (1st)',
    externalItem,
  );
  const [controlDisabledItem, propsDisabledItem, stateDisabledItem] =
    usePropControl(
      propOptionsItemDisabled,
      'item (disabled)',
      externalDisabledItem,
    );
  const [controlDestructiveItem, propsDestructiveItem, stateDestructiveItem] =
    usePropControl(
      propOptionsItemDestructive,
      'item (destructive)',
      externalDestructiveItem,
    );
  const [
    controlSubmenuRoot,
    propsSubmenuRoot,
    stateSubmenuRoot,
    keySubmenuRoot,
  ] = usePropControl(
    useMemo(() => getPropOptionsSubmenuRoot(addLog), [addLog]),
    'submenu root',
    externalSubmenuRoot,
  );
  const [controlSubmenuTrigger, propsSubmenuTrigger, stateSubmenuTrigger] =
    usePropControl(
      propOptionsSubmenuTrigger,
      'submenu trigger',
      externalSubmenuTrigger,
    );
  const [
    controlSubmenuPositioner,
    propsSubmenuPositioner,
    stateSubmenuPositioner,
  ] = usePropControl(
    propOptionsPositioner,
    'submenu positioner',
    externalSubmenuPositioner,
  );
  const [controlSubmenuPopup, propsSubmenuPopup, stateSubmenuPopup] =
    usePropControl(propOptionsPopup, 'submenu popup', externalSubmenuPopup);

  return (
    <Component
      center
      baseUiId="menu"
      id={id}
      log={log}
      title="Menu (iPad)"
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
            render={<Button.Root variant="glass" />}
          >
            <Button.Label>Open Menu</Button.Label>
          </Menu.Trigger>
        </div>
        <Menu.Portal>
          <Menu.Positioner {...propsPositioner}>
            <Menu.Popup {...propsPopup}>
              <Menu.QuickActions>
                <Menu.QuickAction {...propsQuickAction}>
                  <Menu.Icon>
                    <Symbol icon={sfSquareAndArrowUp} />
                  </Menu.Icon>
                  <Menu.Label>Share</Menu.Label>
                </Menu.QuickAction>
                <Menu.QuickAction>
                  <Menu.Icon>
                    <Symbol icon={sfPinFill} />
                  </Menu.Icon>
                  <Menu.Label>Pin</Menu.Label>
                </Menu.QuickAction>
                <Menu.QuickAction destructive>
                  <Menu.Icon>
                    <Symbol icon={sfLockFill} />
                  </Menu.Icon>
                  <Menu.Label>Lock</Menu.Label>
                </Menu.QuickAction>
              </Menu.QuickActions>
              <Menu.Separator />

              <Menu.Item {...propsItem}>
                <Menu.Icon>
                  <Symbol icon={sfSquare} />
                </Menu.Icon>
                <Menu.Label>Action</Menu.Label>
                <Menu.Shortcut>⌘A</Menu.Shortcut>
              </Menu.Item>
              <Menu.Item {...propsDisabledItem}>
                <Menu.Icon>
                  <Symbol icon={sfSquare} />
                </Menu.Icon>
                <Menu.Label>Disabled Action</Menu.Label>
                <Menu.Shortcut>⇧⌘A</Menu.Shortcut>
              </Menu.Item>
              <Menu.Item {...propsDestructiveItem}>
                <Menu.Icon>
                  <Symbol icon={sfSquare} />
                </Menu.Icon>
                <Menu.Label>Delete</Menu.Label>
              </Menu.Item>

              <Menu.Separator />

              <Menu.Item onClick={() => addLog('subtitled item clicked')}>
                <Menu.Icon>
                  <Symbol icon={sfSquare} />
                </Menu.Icon>
                <Menu.Label>Action</Menu.Label>
                <Menu.Subtitle>Subtitle</Menu.Subtitle>
              </Menu.Item>

              <Menu.Separator />
              <Menu.Group>
                <Menu.GroupLabel>Section Title</Menu.GroupLabel>
                <Menu.SubmenuRoot {...propsSubmenuRoot}>
                  <Menu.SubmenuTrigger {...propsSubmenuTrigger}>
                    <Menu.Icon>
                      <Symbol icon={sfSquare} />
                    </Menu.Icon>
                    <Menu.Label>Submenu</Menu.Label>
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
                    <Menu.Positioner {...propsSubmenuPositioner}>
                      <Menu.Popup {...propsSubmenuPopup}>
                        <Menu.Item
                          onClick={() => addLog('submenu item clicked')}
                        >
                          <Menu.Icon>
                            <Symbol icon={sfSquare} />
                          </Menu.Icon>
                          <Menu.Label>Submenu Action</Menu.Label>
                        </Menu.Item>
                        <Menu.Item
                          onClick={() => addLog('submenu item clicked')}
                        >
                          <Menu.Icon>
                            <Symbol icon={sfSquare} />
                          </Menu.Icon>
                          <Menu.Label>Another Action</Menu.Label>
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
                <Menu.Item onClick={() => addLog('item clicked')}>
                  <Menu.Icon>
                    <Symbol icon={sfSquare} />
                  </Menu.Icon>
                  <Menu.Label>Action with a long label</Menu.Label>
                </Menu.Item>
              </Menu.Group>
              <Menu.Separator />
              <Menu.Group>
                <Menu.GroupLabel>Section Title</Menu.GroupLabel>
                <Menu.Item onClick={() => addLog('item clicked')}>
                  <Menu.Icon>
                    <Symbol icon={sfSquare} />
                  </Menu.Icon>
                  <Menu.Label>Action</Menu.Label>
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
    'root',
    externalRoot,
    true,
  );
  const [
    controlCheckboxItem,
    propsCheckboxItem,
    stateCheckboxItem,
    keyCheckboxItem,
  ] = usePropControl(
    useMemo(() => getPropOptionsCheckboxItems(addLog), [addLog]),
    'checkbox item (1st)',
    externalCheckboxItem,
  );
  const [controlRadioGroup, propsRadioGroup, stateRadioGroup, keyRadioGroup] =
    usePropControl(
      useMemo(() => getPropOptionsRadioGroup(addLog), [addLog]),
      'radio group',
      externalRadioGroup,
    );
  const [controlRadioItem, propsRadioItem, stateRadioItem] = usePropControl(
    propOptionsToggleItem,
    'radio item (1st)',
    externalRadioItem,
  );
  const [controlIndicator, propsIndicator, stateIndicator] = usePropControl(
    propOptionsIndicator,
    'indicator (1st)',
    externalIndicator,
  );

  return (
    <Component
      center
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
      ]}
      state={[
        stateRoot,
        stateCheckboxItem,
        stateRadioGroup,
        stateRadioItem,
        stateIndicator,
      ]}
    >
      <Menu.Root
        key={`${keyRoot}-${keyCheckboxItem}-${keyRadioGroup}`}
        {...propsRoot}
      >
        <div className="menu-demo-trigger-space">
          <Menu.Trigger render={<Button.Root variant="glass" />}>
            <Button.Label>Open Menu</Button.Label>
          </Menu.Trigger>
        </div>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup>
              <Menu.Item onClick={() => addLog('item clicked')}>
                <Menu.Icon>
                  <Symbol icon={sfSquare} />
                </Menu.Icon>
                <Menu.Label>Action</Menu.Label>
              </Menu.Item>

              <Menu.Separator />
              <Menu.CheckboxItem {...propsCheckboxItem}>
                <Menu.CheckboxItemIndicator {...propsIndicator} />
                <Menu.Icon>
                  <Symbol icon={sfSquare} />
                </Menu.Icon>
                <Menu.Label>Checkbox</Menu.Label>
              </Menu.CheckboxItem>
              <Menu.CheckboxItem defaultChecked={false}>
                <Menu.CheckboxItemIndicator />
                <Menu.Icon>
                  <Symbol icon={sfSquare} />
                </Menu.Icon>
                <Menu.Label>Another Checkbox</Menu.Label>
              </Menu.CheckboxItem>

              <Menu.Separator />
              <Menu.RadioGroup {...propsRadioGroup}>
                <Menu.RadioItem
                  value="first"
                  {...propsRadioItem}
                >
                  <Menu.RadioItemIndicator />
                  <Menu.Icon>
                    <Symbol icon={sfSquare} />
                  </Menu.Icon>
                  <Menu.Label>Option first</Menu.Label>
                </Menu.RadioItem>
                <Menu.RadioItem value="second">
                  <Menu.RadioItemIndicator />
                  <Menu.Icon>
                    <Symbol icon={sfSquare} />
                  </Menu.Icon>
                  <Menu.Label>Option second</Menu.Label>
                </Menu.RadioItem>
                <Menu.RadioItem value="third">
                  <Menu.RadioItemIndicator />
                  <Menu.Icon>
                    <Symbol icon={sfSquare} />
                  </Menu.Icon>
                  <Menu.Label>Option third</Menu.Label>
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
 * A pop-up button (UIKit `UIButton` with a menu, e.g. in a list row): a
 * `Button` with the chosen option's label, then chevron.up.chevron.down,
 * opening a menu of options; choosing one closes it.
 */
export const MenuPopUpDemo: FunctionComponent = () => {
  const id = 'menu-pop-up';

  const [log, addLog] = useLog();

  const [value, setValue] = useState('Daily');

  return (
    <Component
      center
      baseUiId="menu"
      id={id}
      log={log}
      title="Menu (Pop-up Button)"
    >
      <div className="menu-demo-trigger-space">
        <Menu.Root>
          <Menu.Trigger render={<Button.Root variant="bordered" />}>
            <Button.Label>{value}</Button.Label>
            <Button.Icon>
              <Symbol icon={sfChevronUpChevronDown} />
            </Button.Icon>
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner align="end">
              <Menu.Popup>
                <Menu.RadioGroup
                  value={value}
                  onValueChange={(next: unknown) => {
                    addLog(`value change: ${String(next)}`);
                    setValue(String(next));
                  }}
                >
                  {/* A pop-up closes on choosing (iOS). */}
                  <Menu.RadioItem
                    closeOnClick
                    value="Daily"
                  >
                    <Menu.RadioItemIndicator />
                    <Menu.Label>Daily</Menu.Label>
                  </Menu.RadioItem>
                  <Menu.RadioItem
                    closeOnClick
                    value="Weekly"
                  >
                    <Menu.RadioItemIndicator />
                    <Menu.Label>Weekly</Menu.Label>
                  </Menu.RadioItem>
                  <Menu.RadioItem
                    closeOnClick
                    value="Monthly"
                  >
                    <Menu.RadioItemIndicator />
                    <Menu.Label>Monthly</Menu.Label>
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
  const anchorRef = useRef<HTMLSpanElement>(null);

  const [externalRoot, externalPopup] = useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot] = usePropControl(
    propOptionsOpenRoot,
    'root',
    externalRoot,
    true,
  );

  const [controlPopup, propsPopup, statePopup] = usePropControl(
    propOptionsPopup,
    'popup',
    externalPopup,
  );

  return (
    <Component
      center
      baseUiId="menu"
      controls={[controlRoot, controlPopup]}
      id={id}
      log={log}
      state={[stateRoot, statePopup]}
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
        <Menu.Portal>
          <Menu.Positioner
            anchor={anchorRef}
            side="block-end"
          >
            <Menu.Popup {...propsPopup}>
              <Menu.Item onClick={() => addLog('Copy clicked')}>
                <Menu.Label>Copy</Menu.Label>
              </Menu.Item>
              <Menu.Item onClick={() => addLog('Share clicked')}>
                <Menu.Label>Share</Menu.Label>
                <Menu.Icon>
                  <Symbol icon={sfSquareAndArrowUp} />
                </Menu.Icon>
              </Menu.Item>
              <Menu.Separator />
              <Menu.Item
                destructive
                onClick={() => addLog('Delete clicked')}
              >
                <Menu.Label>Delete</Menu.Label>
              </Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </Component>
  );
};
