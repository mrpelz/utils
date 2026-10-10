import { sfLockFill } from '@bradleyhodges/sfsymbols/sfLockFill';
import { sfPinFill } from '@bradleyhodges/sfsymbols/sfPinFill';
import { sfSquare } from '@bradleyhodges/sfsymbols/sfSquare';
import { sfSquareAndArrowUp } from '@bradleyhodges/sfsymbols/sfSquareAndArrowUp';
import { styled } from 'goober';
import { forwardRef, FunctionComponent, useMemo, useRef } from 'react';

import { Button, Menu } from '../../components/index.js';
import { useButtonDemo } from '../button/compose.js';
import {
  getPropOptionsRoot as getPropOptionsButtonRoot,
  propOptionsContent as propOptionsButtonContent,
} from '../button/props.js';
import { AddLog, useLog } from '../utils/log.js';
import {
  commonPropOptions,
  Component,
  Remounters,
  usePropControl,
} from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { SFSymbol } from '../utils/symbol.js';
import {
  getPropOptionsCheckboxItems,
  getPropOptionsItem,
  getPropOptionsRadioGroup,
  getPropOptionsRoot,
  getPropOptionsSubmenuRoot,
  getPropOptionsTrigger,
  propOptionsContent,
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

const square = <SFSymbol icon={sfSquare} />;

// The trigger: a button (all of its demo's options), by default glass,
// labelled “Open Menu”.
const triggerContent = {
  ...propOptionsButtonContent,
  label: ['Open Menu', 'Options', undefined] as const,
};

/** The trigger's button's root: glass first; its clicks are the trigger's. */
const getTriggerRoot = (addLog: AddLog) => {
  const root = getPropOptionsButtonRoot(addLog);
  return {
    ...root,
    variant: [
      'glass',
      'glass-prominent',
      'bordered',
      'bordered-prominent',
      'bordered-secondary',
      'borderless',
    ] as const,
    onClick: [undefined, ...root.onClick.filter(Boolean)] as const,
  };
};

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

  const [
    externalContent,
    externalRoot,
    externalTrigger,
    externalPositioner,
    externalPopup,
    externalQuickActions,
    externalQuickAction,
    externalItem,
    externalDisabledItem,
    externalDestructiveItem,
    externalCheckboxItem,
    externalRadioGroup,
    externalRadioItem,
    externalIndicator,
    externalSeparator,
    externalGroup,
    externalGroupLabel,
    externalSubmenuRoot,
    externalSubmenuTrigger,
    externalSubmenuPositioner,
    externalSubmenuPopup,
    externalIcon,
    externalLabel,
    externalSubtitle,
    externalShortcut,
    ...externalButton
  ] = useProvidedState(preset.id);

  const triggerButton = useButtonDemo(externalButton, {
    content: triggerContent,
    prefix: 'trigger button: ',
    root: useMemo(() => getTriggerRoot(addLog), [addLog]),
  });

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    '[content]',
    externalContent,
    true,
  );

  const [controlRoot, propsRoot, stateRoot, RemounterRoot] = usePropControl(
    useMemo(
      () => getPropOptionsRoot(preset.size, addLog),
      [addLog, preset.size],
    ),
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

  const [controlQuickActions, propsQuickActions, stateQuickActions] =
    usePropControl(commonPropOptions, 'quick actions', externalQuickActions);

  const [controlQuickAction, propsQuickAction, stateQuickAction] =
    usePropControl(propOptionsItem, 'quick action (1st)', externalQuickAction);

  const itemOptions = useMemo(() => getPropOptionsItem(addLog), [addLog]);

  const [controlItem, propsItem, stateItem] = usePropControl(
    itemOptions,
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
    controlCheckboxItem,
    propsCheckboxItem,
    stateCheckboxItem,
    RemounterCheckboxItem,
  ] = usePropControl(
    useMemo(() => getPropOptionsCheckboxItems(addLog), [addLog]),
    'checkbox items',
    externalCheckboxItem,
  );

  const [
    controlRadioGroup,
    propsRadioGroup,
    stateRadioGroup,
    RemounterRadioGroup,
  ] = usePropControl(
    useMemo(() => getPropOptionsRadioGroup(addLog), [addLog]),
    'radio group',
    externalRadioGroup,
  );

  const [controlRadioItem, propsRadioItem, stateRadioItem] = usePropControl(
    propOptionsToggleItem,
    'radio items',
    externalRadioItem,
  );

  const [controlIndicator, propsIndicator, stateIndicator] = usePropControl(
    propOptionsIndicator,
    'indicators',
    externalIndicator,
  );

  const [controlSeparator, propsSeparator, stateSeparator] = usePropControl(
    commonPropOptions,
    'separators',
    externalSeparator,
  );

  const [controlGroup, propsGroup, stateGroup] = usePropControl(
    commonPropOptions,
    'groups',
    externalGroup,
  );

  const [controlGroupLabel, propsGroupLabel, stateGroupLabel] = usePropControl(
    commonPropOptions,
    'group labels',
    externalGroupLabel,
  );

  const [
    controlSubmenuRoot,
    propsSubmenuRoot,
    stateSubmenuRoot,
    RemounterSubmenuRoot,
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

  const [controlIcon, propsIcon, stateIcon] = usePropControl(
    commonPropOptions,
    'icons',
    externalIcon,
  );

  const [controlLabel, propsLabel, stateLabel] = usePropControl(
    commonPropOptions,
    'labels',
    externalLabel,
  );

  const [controlSubtitle, propsSubtitle, stateSubtitle] = usePropControl(
    commonPropOptions,
    'subtitles',
    externalSubtitle,
  );

  const [controlShortcut, propsShortcut, stateShortcut] = usePropControl(
    commonPropOptions,
    'shortcuts',
    externalShortcut,
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
        ...triggerButton.controls,
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
      stateUrl={useCreateStateUrl(preset.id, [
        stateContent,
        stateRoot,
        stateTrigger,
        statePositioner,
        statePopup,
        stateQuickActions,
        stateQuickAction,
        stateItem,
        stateDisabledItem,
        stateDestructiveItem,
        stateCheckboxItem,
        stateRadioGroup,
        stateRadioItem,
        stateIndicator,
        stateSeparator,
        stateGroup,
        stateGroupLabel,
        stateSubmenuRoot,
        stateSubmenuTrigger,
        stateSubmenuPositioner,
        stateSubmenuPopup,
        stateIcon,
        stateLabel,
        stateSubtitle,
        stateShortcut,
        ...triggerButton.states,
      ])}
    >
      {/* (Remounted as its parts' defaults change.) */}
      <Remounters
        remounters={[
          RemounterRoot,
          RemounterCheckboxItem,
          RemounterRadioGroup,
          RemounterSubmenuRoot,
        ]}
      >
        <Menu.Root {...propsRoot}>
          <TriggerSpace>
            <Menu.Trigger
              {...propsTrigger}
              render={<Button.Root {...triggerButton.propsRoot} />}
            >
              {triggerButton.children}
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
      </Remounters>
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

// Where the open menu sits in the stage (no trigger: an empty anchor).
const Anchor = styled('span', forwardRef)`
  display: block;
  margin-bottom: 320px;
`;

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
      stateUrl={useCreateStateUrl(id, [stateRoot, statePopup])}
      title="Menu (Open)"
    >
      <Anchor ref={anchorRef} />
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
                  <SFSymbol icon={sfSquareAndArrowUp} />
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
