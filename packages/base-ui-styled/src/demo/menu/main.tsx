import { sfLockFill } from '@bradleyhodges/sfsymbols/sfLockFill';
import { sfPinFill } from '@bradleyhodges/sfsymbols/sfPinFill';
import { sfSquare } from '@bradleyhodges/sfsymbols/sfSquare';
import { sfSquareAndArrowUp } from '@bradleyhodges/sfsymbols/sfSquareAndArrowUp';
import { styled } from 'goober';
import { FunctionComponent, useMemo } from 'react';

import { Button, Menu } from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { commonPropOptions, Component, usePropControl } from '../utils/main.js';
import { SFSymbol } from '../utils/symbol.js';
import {
  getPropOptionsCheckboxItems,
  getPropOptionsItem,
  getPropOptionsRadioGroup,
  getPropOptionsRoot,
  getPropOptionsSubmenuRoot,
  propOptionsContent,
  propOptionsIndicator,
  propOptionsItem,
  propOptionsItemDestructive,
  propOptionsItemDisabled,
  propOptionsPopup,
  propOptionsPositioner,
  propOptionsSubmenuTrigger,
  propOptionsToggleItem,
  propOptionsTrigger,
} from './props.js';

const square = <SFSymbol icon={sfSquare} />;

// Keeps the trigger high in the stage, with room for the menu below it.
const TriggerSpace = styled('div')`
  margin-bottom: 560px;
`;

type Preset = {
  id: string;
  size?: 'compact' | 'regular';
  title: string;
};

const MenuDemoBase: FunctionComponent<{ preset: Preset }> = ({ preset }) => {
  const [log, addLog] = useLog();

  const [controlContent, content] = usePropControl(
    propOptionsContent,
    '[content]',
    true,
  );

  const [controlRoot, propsRoot, RemounterRoot] = usePropControl(
    useMemo(
      () => getPropOptionsRoot(preset.size, addLog),
      [addLog, preset.size],
    ),
    'root',
    true,
  );

  const [controlTrigger, propsTrigger] = usePropControl(
    propOptionsTrigger,
    'trigger',
  );

  const [controlPositioner, propsPositioner] = usePropControl(
    propOptionsPositioner,
    'positioner',
  );

  const [controlPopup, propsPopup] = usePropControl(propOptionsPopup, 'popup');

  const [controlQuickActions, propsQuickActions] = usePropControl(
    commonPropOptions,
    'quick actions',
  );

  const [controlQuickAction, propsQuickAction] = usePropControl(
    propOptionsItem,
    'quick action (1st)',
  );

  const itemOptions = useMemo(() => getPropOptionsItem(addLog), [addLog]);

  const [controlItem, propsItem] = usePropControl(itemOptions, 'item (1st)');

  const [controlDisabledItem, propsDisabledItem] = usePropControl(
    propOptionsItemDisabled,
    'item (disabled)',
  );

  const [controlDestructiveItem, propsDestructiveItem] = usePropControl(
    propOptionsItemDestructive,
    'item (destructive)',
  );

  const [controlCheckboxItem, propsCheckboxItem] = usePropControl(
    useMemo(() => getPropOptionsCheckboxItems(addLog), [addLog]),
    'checkbox items',
  );

  const [controlRadioGroup, propsRadioGroup] = usePropControl(
    useMemo(() => getPropOptionsRadioGroup(addLog), [addLog]),
    'radio group',
  );

  const [controlRadioItem, propsRadioItem] = usePropControl(
    propOptionsToggleItem,
    'radio items',
  );

  const [controlIndicator, propsIndicator] = usePropControl(
    propOptionsIndicator,
    'indicators',
  );

  const [controlSeparator, propsSeparator] = usePropControl(
    commonPropOptions,
    'separators',
  );

  const [controlGroup, propsGroup] = usePropControl(
    commonPropOptions,
    'groups',
  );

  const [controlGroupLabel, propsGroupLabel] = usePropControl(
    commonPropOptions,
    'group labels',
  );

  const [controlSubmenuRoot, propsSubmenuRoot] = usePropControl(
    useMemo(() => getPropOptionsSubmenuRoot(addLog), [addLog]),
    'submenu root',
  );

  const [controlSubmenuTrigger, propsSubmenuTrigger] = usePropControl(
    propOptionsSubmenuTrigger,
    'submenu trigger',
  );

  const [controlSubmenuPositioner, propsSubmenuPositioner] = usePropControl(
    propOptionsPositioner,
    'submenu positioner',
  );

  const [controlSubmenuPopup, propsSubmenuPopup] = usePropControl(
    propOptionsPopup,
    'submenu popup',
  );

  const [controlIcon, propsIcon] = usePropControl(commonPropOptions, 'icons');

  const [controlLabel, propsLabel] = usePropControl(
    commonPropOptions,
    'labels',
  );

  const [controlSubtitle, propsSubtitle] = usePropControl(
    commonPropOptions,
    'subtitles',
  );

  const [controlShortcut, propsShortcut] = usePropControl(
    commonPropOptions,
    'shortcuts',
  );

  const icon = content.icons ? (
    <Menu.Icon {...propsIcon}>{square}</Menu.Icon>
  ) : null;

  const label = (text: string) => (
    <Menu.Label {...propsLabel}>{text}</Menu.Label>
  );

  const shortcut = (keys: string) =>
    content.shortcuts ? (
      <Menu.Shortcut {...propsShortcut}>{keys}</Menu.Shortcut>
    ) : null;

  const quickActions = [
    { icon: sfSquareAndArrowUp, label: 'Share' },
    { icon: sfPinFill, label: 'Pin' },
    { destructive: true, icon: sfLockFill, label: 'Lock' },
  ].slice(0, content.quickActions);

  return (
    <Component
      center
      baseUiId="menu"
      id={preset.id}
      log={log}
      title={preset.title}
      controls={[
        controlContent,
        controlRoot,
        controlTrigger,
        controlPositioner,
        controlPopup,
        controlQuickActions,
        controlQuickAction,
        controlItem,
        controlDisabledItem,
        controlDestructiveItem,
        controlCheckboxItem,
        controlRadioGroup,
        controlRadioItem,
        controlIndicator,
        controlSeparator,
        controlGroup,
        controlGroupLabel,
        controlSubmenuRoot,
        controlSubmenuTrigger,
        controlSubmenuPositioner,
        controlSubmenuPopup,
        controlIcon,
        controlLabel,
        controlSubtitle,
        controlShortcut,
      ]}
    >
      <RemounterRoot>
        <Menu.Root {...propsRoot}>
          <TriggerSpace>
            <Menu.Trigger
              {...propsTrigger}
              render={<Button.Root variant="glass" />}
            >
              <Button.Label>Open Menu</Button.Label>
            </Menu.Trigger>
          </TriggerSpace>
          <Menu.Portal>
            <Menu.Positioner {...propsPositioner}>
              <Menu.Popup {...propsPopup}>
                {quickActions.length > 0 ? (
                  <>
                    <Menu.QuickActions {...propsQuickActions}>
                      {quickActions.map(
                        ({ destructive, icon: symbol, label: text }, index) => (
                          <Menu.QuickAction
                            key={text}
                            destructive={destructive}
                            {...(index === 0 ? propsQuickAction : {})}
                          >
                            <Menu.Icon {...propsIcon}>
                              <SFSymbol icon={symbol} />
                            </Menu.Icon>
                            {label(text)}
                          </Menu.QuickAction>
                        ),
                      )}
                    </Menu.QuickActions>
                    <Menu.Separator {...propsSeparator} />
                  </>
                ) : null}

                <Menu.Item {...propsItem}>
                  {icon}
                  {label('Action')}
                  {shortcut('⌘A')}
                </Menu.Item>
                <Menu.Item {...propsDisabledItem}>
                  {icon}
                  {label('Disabled Action')}
                  {shortcut('⇧⌘A')}
                </Menu.Item>
                <Menu.Item {...propsDestructiveItem}>
                  {icon}
                  {label('Delete')}
                </Menu.Item>

                <Menu.Separator {...propsSeparator} />

                <Menu.Item {...propsItem}>
                  {icon}
                  {label('Action')}
                  {content.subtitles ? (
                    <Menu.Subtitle {...propsSubtitle}>Subtitle</Menu.Subtitle>
                  ) : null}
                </Menu.Item>

                {content.toggles === 'checkbox' ? (
                  <>
                    <Menu.Separator {...propsSeparator} />
                    {['Checkbox', 'Another Checkbox'].map((text, index) => (
                      <Menu.CheckboxItem
                        key={text}
                        {...propsCheckboxItem}
                        {...(index === 0 ? {} : { defaultChecked: false })}
                      >
                        <Menu.CheckboxItemIndicator {...propsIndicator} />
                        {icon}
                        {label(text)}
                      </Menu.CheckboxItem>
                    ))}
                  </>
                ) : null}

                {content.toggles === 'radio' ? (
                  <>
                    <Menu.Separator {...propsSeparator} />
                    <Menu.RadioGroup {...propsRadioGroup}>
                      {['first', 'second', 'third'].map((value) => (
                        <Menu.RadioItem
                          key={value}
                          value={value}
                          {...propsRadioItem}
                        >
                          <Menu.RadioItemIndicator {...propsIndicator} />
                          {icon}
                          {label(`Option ${value}`)}
                        </Menu.RadioItem>
                      ))}
                    </Menu.RadioGroup>
                  </>
                ) : null}

                {content.sections ? (
                  <>
                    <Menu.Separator {...propsSeparator} />
                    <Menu.Group {...propsGroup}>
                      <Menu.GroupLabel {...propsGroupLabel}>
                        Section Title
                      </Menu.GroupLabel>
                      {content.submenu ? (
                        <Menu.SubmenuRoot {...propsSubmenuRoot}>
                          <Menu.SubmenuTrigger {...propsSubmenuTrigger}>
                            {icon}
                            {label('Submenu')}
                          </Menu.SubmenuTrigger>
                          <Menu.Portal>
                            <Menu.Positioner {...propsSubmenuPositioner}>
                              <Menu.Popup {...propsSubmenuPopup}>
                                <Menu.Item {...propsItem}>
                                  {icon}
                                  {label('Submenu Action')}
                                </Menu.Item>
                                <Menu.Item {...propsItem}>
                                  {icon}
                                  {label('Another Action')}
                                </Menu.Item>
                              </Menu.Popup>
                            </Menu.Positioner>
                          </Menu.Portal>
                        </Menu.SubmenuRoot>
                      ) : null}
                      <Menu.Item {...propsItem}>
                        {icon}
                        {label('Action with a long label')}
                      </Menu.Item>
                    </Menu.Group>
                    <Menu.Separator {...propsSeparator} />
                    <Menu.Group {...propsGroup}>
                      <Menu.GroupLabel {...propsGroupLabel}>
                        Section Title
                      </Menu.GroupLabel>
                      <Menu.Item {...propsItem}>
                        {icon}
                        {label('Action')}
                      </Menu.Item>
                    </Menu.Group>
                  </>
                ) : null}
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </RemounterRoot>
    </Component>
  );
};

export const MenuDemo: FunctionComponent = () => (
  <MenuDemoBase preset={{ id: 'menu', title: 'Menu' }} />
);

export const MenuRegularDemo: FunctionComponent = () => (
  <MenuDemoBase
    preset={{ id: 'menu-regular', size: 'regular', title: 'Menu (iPad)' }}
  />
);
