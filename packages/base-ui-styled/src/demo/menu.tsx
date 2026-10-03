import { Menu as BaseMenu } from '@base-ui/react/menu';
import { sfLockFill } from '@bradleyhodges/sfsymbols/sfLockFill';
import { sfPinFill } from '@bradleyhodges/sfsymbols/sfPinFill';
import { sfSquare } from '@bradleyhodges/sfsymbols/sfSquare';
import { sfSquareAndArrowUp } from '@bradleyhodges/sfsymbols/sfSquareAndArrowUp';
import { styled } from 'goober';
import { FunctionComponent, useMemo } from 'react';

import { Button, Menu } from '../components/index.js';
import { useLog } from './utils/log.js';
import {
  commonPropOptions,
  Component,
  MappedProp,
  usePropControl,
} from './utils/main.js';
import { SFSymbol } from './utils/symbol.js';

const square = <SFSymbol icon={sfSquare} />;

// Keeps the trigger high in the stage, with room for the menu below it.
const TriggerSpace = styled('div')`
  margin-bottom: 560px;
`;

const propOptionsContent = {
  quickActions: [3, 0, 2] as const,
  icons: [true, false] as const,
  subtitles: [true, false] as const,
  shortcuts: [true, false] as const,
  sections: [true, false] as const,
  submenu: [true, false] as const,
  toggles: ['none', 'checkbox', 'radio'] as const,
} as const;

const propOptionsPositioner = {
  ...commonPropOptions,
  side: [
    undefined,
    'top',
    'right',
    'bottom',
    'left',
    'inline-start',
    'inline-end',
  ] as const,
  align: [undefined, 'start', 'center', 'end'] as const,
  sideOffset: [undefined, 0, 8, 16] as const,
  alignOffset: [undefined, 0, -16, 16] as const,
  sticky: [undefined, false, true] as const,
  disableAnchorTracking: [undefined, false, true] as const,
};

const propOptionsPopup = {
  ...commonPropOptions,
  finalFocus: [undefined, false, true] as const,
};

const propOptionsItem = {
  ...commonPropOptions,
  disabled: [undefined, false, true] as const,
  destructive: [undefined, false, true] as const,
  cursor: [undefined, 'auto', 'pointer', 'copy'] as const,
  closeOnClick: [undefined, false, true] as const,
};

const propOptionsToggleItem = {
  ...commonPropOptions,
  disabled: [undefined, false, true] as const,
  destructive: [undefined, false, true] as const,
  cursor: [undefined, 'auto', 'pointer', 'copy'] as const,
  closeOnClick: [undefined, false, true] as const,
};

const propOptionsIndicator = {
  ...commonPropOptions,
};

const propOptionsSubmenuTrigger = {
  ...commonPropOptions,
  disabled: [undefined, false, true] as const,
  destructive: [undefined, false, true] as const,
  cursor: [undefined, 'auto', 'pointer', 'copy'] as const,
  openOnHover: [undefined, false, true] as const,
  delay: [undefined, 0, 500] as const,
};

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
      () => ({
        size: [
          preset.size,
          ...([undefined, 'compact', 'regular'] as const).filter(
            (size) => size !== preset.size,
          ),
        ],
        defaultOpen: [undefined, false, true] as const,
        open: [undefined, true] as const,
        modal: [undefined, false, true] as const,
        loopFocus: [undefined, false, true] as const,
        disabled: [undefined, false, true] as const,
        highlightItemOnHover: [undefined, false, true] as const,
        onOpenChange: [
          new MappedProp(
            (open: boolean, { reason }: BaseMenu.Root.ChangeEventDetails) =>
              addLog(`open change: ${String(open)}/${reason}`),
            '[log change]',
          ),
          undefined,
        ] as const,
      }),
      [addLog, preset.size],
    ),
    'root',
    true,
  );

  const [controlTrigger, propsTrigger] = usePropControl(
    useMemo(
      () => ({
        ...commonPropOptions,
        disabled: [undefined, false, true] as const,
        openOnHover: [undefined, false, true] as const,
        delay: [undefined, 0, 500] as const,
      }),
      [],
    ),
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

  const itemOptions = useMemo(
    () => ({
      ...propOptionsItem,
      onClick: [
        new MappedProp(() => addLog('item clicked'), '[log click]'),
        undefined,
      ] as const,
    }),
    [addLog],
  );

  const [controlItem, propsItem] = usePropControl(itemOptions, 'item (1st)');

  const [controlDisabledItem, propsDisabledItem] = usePropControl(
    useMemo(
      () => ({ ...propOptionsItem, disabled: [true, false, undefined] }),
      [],
    ),
    'item (disabled)',
  );

  const [controlDestructiveItem, propsDestructiveItem] = usePropControl(
    useMemo(
      () => ({ ...propOptionsItem, destructive: [true, false, undefined] }),
      [],
    ),
    'item (destructive)',
  );

  const [controlCheckboxItem, propsCheckboxItem] = usePropControl(
    useMemo(
      () => ({
        ...propOptionsToggleItem,
        defaultChecked: [true, false, undefined] as const,
        onCheckedChange: [
          new MappedProp(
            (checked: boolean) => addLog(`checked change: ${String(checked)}`),
            '[log change]',
          ),
          undefined,
        ] as const,
      }),
      [addLog],
    ),
    'checkbox items',
  );

  const [controlRadioGroup, propsRadioGroup] = usePropControl(
    useMemo(
      () => ({
        ...commonPropOptions,
        defaultValue: ['first', 'second', undefined] as const,
        disabled: [undefined, false, true] as const,
        onValueChange: [
          new MappedProp(
            (value: unknown) => addLog(`value change: ${String(value)}`),
            '[log change]',
          ),
          undefined,
        ] as const,
      }),
      [addLog],
    ),
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
    useMemo(
      () => ({
        closeParentOnEsc: [undefined, false, true] as const,
        disabled: [undefined, false, true] as const,
        onOpenChange: [
          undefined,
          new MappedProp(
            (open: boolean) => addLog(`submenu open change: ${String(open)}`),
            '[log change]',
          ),
        ] as const,
      }),
      [addLog],
    ),
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
