import './style.css';

import { RadioGroup } from '@base-ui/react/radio-group';
import { FunctionComponent, useMemo, useRef, useState } from 'react';

import {
  Button,
  Collapsible,
  DatePicker,
  forwardClick,
  List,
  type ListReorderChange,
  Menu,
  Segmented,
  Slider,
  Stepper,
  Switch,
  Symbol,
  TextField,
  useCreateDatePickerHandle,
  useCreateReorderHandle,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  sfAirplane,
  sfArchiveboxFill,
  sfBellFill,
  sfCheckmarkCircleFill,
  sfChevronUpChevronDown,
  sfEllipsis,
  sfEnvelopeFill,
  sfEnvelopeOpenFill,
  sfFlagFill,
  sfHeartFill,
  sfICircle,
  sfMinus,
  sfPersonCropCircleFill,
  sfPersonFill,
  sfPinFill,
  sfPlus,
  sfSquareAndPencil,
  sfSunMax,
  sfSunMin,
  sfTagFill,
  sfTrashFill,
  sfWifi,
} from '../../tooling/icons.js';
import { partPropMaps } from '../part-options.js';
import { contacts, messages, planets } from './content.js';
import {
  getPropOptionsAccessory,
  getPropOptionsAction,
  getPropOptionsButton,
  getPropOptionsCheckboxFirst,
  getPropOptionsCollapsible,
  getPropOptionsEditButton,
  getPropOptionsEditButtonFirst,
  getPropOptionsItemFirst,
  getPropOptionsListCollapsibleRoot,
  getPropOptionsRadioGroup,
  getPropOptionsSwipeActionFirst,
  getPropOptionsSwipeActionOutermost,
  getPropOptionsSwipeActionsFirstLeading,
  getPropOptionsSwipeActionsTrailing,
  getPropOptionsTitleFirst,
  propOptionsBlock,
  propOptionsCheckbox,
  propOptionsCollapsible,
  propOptionsCursor,
  propOptionsHeader,
  propOptionsImage,
  propOptionsIndex,
  propOptionsItemFirst,
  propOptionsPanel,
  propOptionsPartsContent,
  propOptionsRadioFirst,
  propOptionsRoot,
  propOptionsRootPlain,
  propOptionsSwipeActionsTrigger,
  propOptionsText,
} from './props.js';

/**
 * Lists: a settings-like inset grouped list with
 * a switch, drill-ins, a pop-up (a menu, its trigger a button), an info
 * button, a segmented control, a stepper and a slider, a collapsible
 * section (Base UI Collapsible), buttons and a content block. Rows with a
 * control pass their clicks on to it (`forwardClick`).
 */
export const ListDemo: FunctionComponent = () => {
  const id = 'list';

  const [log, addLog] = useLog();
  const [externalRoot, externalItem, externalCollapsible, externalTrigger] =
    useProvidedState(id);

  const [previews, setPreviews] = useState('Automatic');
  const [isFavorite, setIsFavorite] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const [controlRoot, propsRoot, stateRoot] = usePropControl(propOptionsRoot, {
    external: externalRoot,
    isOpen: true,
    title: 'List.Root',
  });
  const [controlItem, propsItem, stateItem] = usePropControl(
    propOptionsItemFirst,
    { external: externalItem, isOpen: true, title: 'List.Item (1st)' },
  );
  const [
    controlCollapsible,
    propsCollapsible,
    stateCollapsible,
    keyCollapsible,
  ] = usePropControl(
    useMemo(() => getPropOptionsCollapsible(addLog), [addLog]),
    { external: externalCollapsible, title: 'Collapsible.Root' },
  );
  const [controlTrigger, propsTrigger, stateTrigger] = usePropControl(
    propOptionsCursor,
    { external: externalTrigger, title: 'Collapsible.Trigger (List.Header)' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Header': ['prominence'],
            'List.Item': ['onClick'],
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': ['tint'],
            'Collapsible.Panel': ['render'],
            'Collapsible.Trigger': ['nativeButton', 'render'],
            'List.Accessory': ['aria-label', 'onClick', 'render'],
            'List.Action': ['onClick'],
            'List.Block': [],
            'List.Button': ['destructive', 'onClick'],
            'List.Checkmark': [],
            'List.Content': [],
            'List.Detail': [],
            'List.Disclosure': [],
            'List.DrillIn': [],
            'List.Footer': [],
            'List.Group': [],
            'List.Image': ['style', 'variant'],
            'List.Leading': [],
            'List.Section': [],
            'List.Span': [],
            'List.Subtitle': [],
            'List.Title': ['onClick', 'render'],
            'List.Trailing': [],
            'Menu.Label': [],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': ['align'],
            'Menu.RadioGroup': ['onValueChange', 'value'],
            'Menu.RadioItem': ['closeOnClick', 'value'],
            'Menu.RadioItemIndicator': [],
            'Menu.Root': [],
            'Menu.Trigger': ['render'],
            'Segmented.Highlight': [],
            'Segmented.Item': ['value'],
            'Segmented.Root': ['aria-label', 'defaultValue', 'onValueChange'],
            'Slider.Control': [],
            'Slider.Indicator': [],
            'Slider.Root': ['defaultValue', 'onValueCommitted'],
            'Slider.Symbol': ['edge'],
            'Slider.Thumb': ['aria-label'],
            'Slider.Track': [],
            'Stepper.Decrement': [],
            'Stepper.Group': [],
            'Stepper.Increment': [],
            'Stepper.Input': ['aria-label'],
            'Stepper.Root': ['onValueChange', 'value'],
            'Switch.Root': ['aria-label', 'onCheckedChange', 'tint'],
            'Switch.Thumb': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isStretched
      id={id}
      log={log}
      state={[stateRoot, stateItem, stateCollapsible, stateTrigger, partState]}
      title="List"
      controls={[
        controlRoot,
        controlItem,
        controlCollapsible,
        controlTrigger,
        partControls,
      ]}
    >
      <List.Root {...propsRoot}>
        <List.Section {...partProps['List.Section']}>
          <List.Header {...partProps['List.Header']}>
            <List.Title
              {...partProps['List.Title']}
              render={<h3 />}
            >
              Header
            </List.Title>
            <List.Accessory
              {...partProps['List.Accessory']}
              aria-label="Edit"
              render={<button type="button" />}
              onClick={() => addLog('header button clicked')}
            >
              <Symbol
                {...partProps.Symbol}
                icon={sfSquareAndPencil}
              />
            </List.Accessory>
          </List.Header>
          <List.Group {...partProps['List.Group']}>
            <List.Item {...propsItem}>
              <List.Leading {...partProps['List.Leading']}>
                <List.Image
                  {...partProps['List.Image']}
                  style={{ backgroundColor: 'var(--color-ui-system-orange)' }}
                  variant="rounded"
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfAirplane}
                  />
                </List.Image>
              </List.Leading>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>
                  Airplane Mode
                </List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <Switch.Root
                  {...partProps['Switch.Root']}
                  aria-label="Airplane Mode"
                  tint="var(--color-ui-system-orange)"
                  onCheckedChange={(isChecked: boolean) =>
                    addLog(`airplane mode: ${isChecked}`)
                  }
                >
                  <Switch.Thumb {...partProps['Switch.Thumb']} />
                </Switch.Root>
              </List.Trailing>
            </List.Item>
            <List.Item {...partProps['List.Item']}>
              <List.Leading {...partProps['List.Leading']}>
                <List.Image
                  {...partProps['List.Image']}
                  style={{ backgroundColor: 'var(--color-ui-system-blue)' }}
                  variant="rounded"
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfWifi}
                  />
                </List.Image>
              </List.Leading>
              <List.Content {...partProps['List.Content']}>
                <List.Title
                  {...partProps['List.Title']}
                  render={<button />}
                  onClick={() => addLog('Wi-Fi clicked')}
                >
                  Wi-Fi
                </List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Detail {...partProps['List.Detail']}>Home</List.Detail>
              </List.Trailing>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.DrillIn {...partProps['List.DrillIn']} />
              </List.Trailing>
            </List.Item>
            <List.Item {...partProps['List.Item']}>
              <List.Leading {...partProps['List.Leading']}>
                <List.Image
                  {...partProps['List.Image']}
                  style={{ backgroundColor: 'var(--color-ui-system-red)' }}
                  variant="rounded"
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfBellFill}
                  />
                </List.Image>
              </List.Leading>
              <List.Content {...partProps['List.Content']}>
                <List.Title
                  {...partProps['List.Title']}
                  render={<button />}
                  onClick={() => addLog('Notifications clicked')}
                >
                  Notifications
                </List.Title>
                <List.Subtitle {...partProps['List.Subtitle']}>
                  Banners, Sounds
                </List.Subtitle>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.DrillIn {...partProps['List.DrillIn']} />
              </List.Trailing>
            </List.Item>
            {/* A pop-up button (see “Menu (Pop-up Button)”): gray, in a
                row. */}
            <List.Item
              {...partProps['List.Item']}
              onClick={forwardClick('[aria-haspopup]')}
            >
              <List.Leading {...partProps['List.Leading']}>
                <List.Image
                  {...partProps['List.Image']}
                  style={{ backgroundColor: 'var(--color-ui-system-gray)' }}
                  variant="rounded"
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfPersonFill}
                  />
                </List.Image>
              </List.Leading>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>
                  Show Previews
                </List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <Menu.Root {...partProps['Menu.Root']}>
                  <Menu.Trigger
                    {...partProps['Menu.Trigger']}
                    render={
                      <Button.Root
                        {...partProps['Button.Root']}
                        tint="var(--color-ui-secondary-label)"
                      />
                    }
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      {previews}
                    </Button.Label>
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
                          value={previews}
                          onValueChange={(next: unknown) => {
                            addLog(`show previews: ${String(next)}`);
                            setPreviews(String(next));
                          }}
                        >
                          <Menu.RadioItem
                            {...partProps['Menu.RadioItem']}
                            closeOnClick
                            value="Automatic"
                          >
                            <Menu.RadioItemIndicator
                              {...partProps['Menu.RadioItemIndicator']}
                            />
                            <Menu.Label {...partProps['Menu.Label']}>
                              Automatic
                            </Menu.Label>
                          </Menu.RadioItem>
                          <Menu.RadioItem
                            {...partProps['Menu.RadioItem']}
                            closeOnClick
                            value="Always"
                          >
                            <Menu.RadioItemIndicator
                              {...partProps['Menu.RadioItemIndicator']}
                            />
                            <Menu.Label {...partProps['Menu.Label']}>
                              Always
                            </Menu.Label>
                          </Menu.RadioItem>
                          <Menu.RadioItem
                            {...partProps['Menu.RadioItem']}
                            closeOnClick
                            value="Never"
                          >
                            <Menu.RadioItemIndicator
                              {...partProps['Menu.RadioItemIndicator']}
                            />
                            <Menu.Label {...partProps['Menu.Label']}>
                              Never
                            </Menu.Label>
                          </Menu.RadioItem>
                        </Menu.RadioGroup>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.Root>
              </List.Trailing>
            </List.Item>
            <List.Item
              {...partProps['List.Item']}
              onClick={({ target }) => {
                if (target instanceof Element && target.closest('button')) {
                  return;
                }
                addLog(`favorite: ${!isFavorite}`);
                setIsFavorite(!isFavorite);
              }}
            >
              <List.Leading {...partProps['List.Leading']}>
                <List.Image
                  {...partProps['List.Image']}
                  style={{ backgroundColor: 'var(--color-ui-system-pink)' }}
                  variant="rounded"
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfHeartFill}
                  />
                </List.Image>
              </List.Leading>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>Favorite</List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Accessory
                  {...partProps['List.Accessory']}
                  aria-label="Info"
                  render={<button type="button" />}
                  onClick={() => addLog('info clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfICircle}
                  />
                </List.Accessory>
                {isFavorite ? (
                  <List.Checkmark {...partProps['List.Checkmark']} />
                ) : null}
              </List.Trailing>
            </List.Item>
            <List.Item
              {...partProps['List.Item']}
              onClick={forwardClick('[data-list-part=action]')}
            >
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>Button</List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Action
                  {...partProps['List.Action']}
                  onClick={() => addLog('action clicked')}
                >
                  Button
                </List.Action>
              </List.Trailing>
            </List.Item>
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>Text Size</List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <Segmented.Root
                  {...partProps['Segmented.Root']}
                  aria-label="Text Size"
                  defaultValue="M"
                  onValueChange={(value: unknown) =>
                    addLog(`text size: ${String(value)}`)
                  }
                >
                  <Segmented.Item
                    {...partProps['Segmented.Item']}
                    value="S"
                  >
                    S
                  </Segmented.Item>
                  <Segmented.Item
                    {...partProps['Segmented.Item']}
                    value="M"
                  >
                    M
                  </Segmented.Item>
                  <Segmented.Item
                    {...partProps['Segmented.Item']}
                    value="L"
                  >
                    L
                  </Segmented.Item>
                  <Segmented.Highlight {...partProps['Segmented.Highlight']} />
                </Segmented.Root>
              </List.Trailing>
            </List.Item>
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>Quantity</List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Detail {...partProps['List.Detail']}>
                  {quantity}
                </List.Detail>
              </List.Trailing>
              <List.Trailing {...partProps['List.Trailing']}>
                <Stepper.Root
                  {...partProps['Stepper.Root']}
                  value={quantity}
                  onValueChange={(value: number | null) => {
                    addLog(`quantity: ${String(value)}`);
                    setQuantity(value ?? 0);
                  }}
                >
                  <Stepper.Group {...partProps['Stepper.Group']}>
                    <Stepper.Input
                      {...partProps['Stepper.Input']}
                      aria-label="Quantity"
                    />
                    <Stepper.Decrement {...partProps['Stepper.Decrement']} />
                    <Stepper.Increment {...partProps['Stepper.Increment']} />
                  </Stepper.Group>
                </Stepper.Root>
              </List.Trailing>
            </List.Item>
            <List.Item {...partProps['List.Item']}>
              <List.Span {...partProps['List.Span']}>
                <Slider.Root
                  {...partProps['Slider.Root']}
                  defaultValue={60}
                  onValueCommitted={(value: number | readonly number[]) =>
                    addLog(`brightness: ${String(value)}`)
                  }
                >
                  <Slider.Symbol
                    {...partProps['Slider.Symbol']}
                    edge="min"
                  >
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfSunMin}
                    />
                  </Slider.Symbol>
                  <Slider.Control {...partProps['Slider.Control']}>
                    <Slider.Track {...partProps['Slider.Track']}>
                      <Slider.Indicator {...partProps['Slider.Indicator']} />
                      <Slider.Thumb
                        {...partProps['Slider.Thumb']}
                        aria-label="Brightness"
                      />
                    </Slider.Track>
                  </Slider.Control>
                  <Slider.Symbol
                    {...partProps['Slider.Symbol']}
                    edge="max"
                  >
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfSunMax}
                    />
                  </Slider.Symbol>
                </Slider.Root>
              </List.Span>
            </List.Item>
          </List.Group>
          <List.Footer {...partProps['List.Footer']}>
            Footer text, aligned with the rows’ text.
          </List.Footer>
        </List.Section>

        <Collapsible.Root
          key={keyCollapsible}
          {...propsCollapsible}
          render={<List.Section {...partProps['List.Section']} />}
        >
          <Collapsible.Trigger
            {...partProps['Collapsible.Trigger']}
            nativeButton={false}
            render={
              <List.Header
                prominence="nested"
                {...propsTrigger}
              />
            }
          >
            <List.Title {...partProps['List.Title']}>Collapsible</List.Title>
            <List.Detail {...partProps['List.Detail']}>{previews}</List.Detail>
            <List.Disclosure {...partProps['List.Disclosure']} />
          </Collapsible.Trigger>
          <Collapsible.Panel
            {...partProps['Collapsible.Panel']}
            render={<List.Group {...partProps['List.Group']} />}
          >
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title
                  {...partProps['List.Title']}
                  render={<button />}
                  onClick={() => setPreviews('Automatic')}
                >
                  Automatic
                </List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                {previews === 'Automatic' ? (
                  <List.Checkmark {...partProps['List.Checkmark']} />
                ) : null}
              </List.Trailing>
            </List.Item>
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title
                  {...partProps['List.Title']}
                  render={<button />}
                  onClick={() => setPreviews('Always')}
                >
                  Always
                </List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                {previews === 'Always' ? (
                  <List.Checkmark {...partProps['List.Checkmark']} />
                ) : null}
              </List.Trailing>
            </List.Item>
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title
                  {...partProps['List.Title']}
                  render={<button />}
                  onClick={() => setPreviews('Never')}
                >
                  Never
                </List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                {previews === 'Never' ? (
                  <List.Checkmark {...partProps['List.Checkmark']} />
                ) : null}
              </List.Trailing>
            </List.Item>
          </Collapsible.Panel>
        </Collapsible.Root>

        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Button
                  {...partProps['List.Button']}
                  onClick={() => addLog('action clicked')}
                >
                  Action
                </List.Button>
              </List.Content>
            </List.Item>
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Button
                  {...partProps['List.Button']}
                  destructive
                  onClick={() => addLog('destructive clicked')}
                >
                  Action
                </List.Button>
              </List.Content>
            </List.Item>
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Button
                  {...partProps['List.Button']}
                  disabled
                >
                  Action
                </List.Button>
              </List.Content>
            </List.Item>
          </List.Group>
        </List.Section>

        <List.Section {...partProps['List.Section']}>
          <List.Header
            {...partProps['List.Header']}
            prominence="extraProminent"
          >
            <List.Title
              {...partProps['List.Title']}
              render={<h3 />}
            >
              Content Block
            </List.Title>
          </List.Header>
          <List.Block
            {...partProps['List.Block']}
            strong
          >
            <p>
              Lists and tables present data in one or more columns of rows. A
              content block holds text between them, aligned with the rows.
            </p>
          </List.Block>
          <List.Footer {...partProps['List.Footer']}>
            Blocks can have headers and footers, too.
          </List.Footer>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/**
 * Every part of a list's rows, once, each with its props: a header, rows
 * of each kind, swipe actions, a footer and a block (collapsible sections
 * and expandable rows: see “List (Collapsible)”; the index: “List
 * (Index)”; selection: “List (Editing: Select)”).
 */
export const ListPartsDemo: FunctionComponent = () => {
  const id = 'list-parts';

  const [log, addLog] = useLog();
  const [
    externalContent,
    externalRoot,
    externalSection,
    externalHeader,
    externalSupertitle,
    externalGroup,
    externalItem,
    externalImage,
    externalTitle,
    externalSubtitle,
    externalDetail,
    externalDrillIn,
    externalAccessory,
    externalCheckmark,
    externalAction,
    externalButton,
    externalCheckbox,
    externalEditButton,
    externalGrabber,
    externalText,
    externalSwipeActions,
    externalSwipeAction,
    externalFooter,
    externalBlock,
    externalSwipeActionsTrigger,
  ] = useProvidedState(id);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsPartsContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  const [controlRoot, propsRoot, stateRoot] = usePropControl(propOptionsRoot, {
    external: externalRoot,
    title: 'List.Root',
  });
  const [controlSection, propsSection, stateSection] = usePropControl(
    commonPropOptions,
    { external: externalSection, title: 'List.Section' },
  );
  const [controlHeader, propsHeader, stateHeader] = usePropControl(
    propOptionsHeader,
    { external: externalHeader, isOpen: true, title: 'List.Header' },
  );
  const [controlSupertitle, propsSupertitle, stateSupertitle] = usePropControl(
    commonPropOptions,
    { external: externalSupertitle, title: 'List.Supertitle' },
  );
  const [controlGroup, propsGroup, stateGroup] = usePropControl(
    commonPropOptions,
    { external: externalGroup, title: 'List.Group' },
  );
  const [controlItem, propsItem, stateItem] = usePropControl(
    useMemo(() => getPropOptionsItemFirst(addLog), [addLog]),
    { external: externalItem, title: 'List.Item (1st)' },
  );
  const [controlImage, propsImage, stateImage] = usePropControl(
    propOptionsImage,
    { external: externalImage, title: 'List.Image' },
  );
  const [controlTitle, propsTitle, stateTitle] = usePropControl(
    useMemo(() => getPropOptionsTitleFirst(addLog), [addLog]),
    { external: externalTitle, title: 'List.Title (1st)' },
  );
  const [controlSubtitle, propsSubtitle, stateSubtitle] = usePropControl(
    commonPropOptions,
    { external: externalSubtitle, title: 'List.Subtitle' },
  );
  const [controlDetail, propsDetail, stateDetail] = usePropControl(
    commonPropOptions,
    { external: externalDetail, title: 'List.Detail' },
  );
  const [controlDrillIn, propsDrillIn, stateDrillIn] = usePropControl(
    commonPropOptions,
    { external: externalDrillIn, title: 'List.DrillIn' },
  );
  const [controlAccessory, propsAccessory, stateAccessory] = usePropControl(
    useMemo(() => getPropOptionsAccessory(addLog), [addLog]),
    { external: externalAccessory, title: 'List.Accessory' },
  );
  const [controlCheckmark, propsCheckmark, stateCheckmark] = usePropControl(
    commonPropOptions,
    { external: externalCheckmark, title: 'List.Checkmark' },
  );
  const [controlAction, propsAction, stateAction] = usePropControl(
    useMemo(() => getPropOptionsAction(addLog), [addLog]),
    { external: externalAction, title: 'List.Action' },
  );
  const [controlButton, propsButton, stateButton] = usePropControl(
    useMemo(() => getPropOptionsButton(addLog), [addLog]),
    { external: externalButton, title: 'List.Button' },
  );
  const [controlCheckbox, propsCheckbox, stateCheckbox, keyCheckbox] =
    usePropControl(propOptionsCheckbox, {
      external: externalCheckbox,
      title: 'List.Checkbox',
    });
  const [controlEditButton, propsEditButton, stateEditButton] = usePropControl(
    useMemo(() => getPropOptionsEditButton(addLog), [addLog]),
    { external: externalEditButton, title: 'List.EditButton' },
  );
  const [
    controlSwipeActionsTrigger,
    propsSwipeActionsTrigger,
    stateSwipeActionsTrigger,
  ] = usePropControl(propOptionsSwipeActionsTrigger, {
    external: externalSwipeActionsTrigger,
    title: 'List.SwipeActionsTrigger',
  });
  const [controlGrabber, propsGrabber, stateGrabber] = usePropControl(
    propOptionsCursor,
    { external: externalGrabber, title: 'List.Grabber' },
  );
  const [controlText, propsText, stateText] = usePropControl(propOptionsText, {
    external: externalText,
    title: 'List.Text',
  });
  const [controlSwipeActions, propsSwipeActions, stateSwipeActions] =
    usePropControl(
      useMemo(() => getPropOptionsSwipeActionsTrailing(addLog), [addLog]),
      {
        external: externalSwipeActions,
        isOpen: true,
        title: 'List.SwipeActions (trailing)',
      },
    );
  const [controlSwipeAction, propsSwipeAction, stateSwipeAction] =
    usePropControl(
      useMemo(() => getPropOptionsSwipeActionOutermost(addLog), [addLog]),
      { external: externalSwipeAction, title: 'List.SwipeAction (outermost)' },
    );
  const [controlFooter, propsFooter, stateFooter] = usePropControl(
    commonPropOptions,
    { external: externalFooter, title: 'List.Footer' },
  );
  const [controlBlock, propsBlock, stateBlock] = usePropControl(
    propOptionsBlock,
    { external: externalBlock, title: 'List.Block' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Accessory': ['aria-label', 'onClick', 'render'],
            'List.Detail': [],
            'List.Image': ['variant'],
            'List.Item': ['onClick'],
            'List.Section': [],
            'List.Subtitle': [],
            'List.SwipeAction': ['label', 'onClick', 'showLabel', 'tint'],
            'List.SwipeActions': ['overswipe', 'side'],
            'List.Title': ['render'],
            Symbol: ['icon'],
            'List.Below': [],
            'List.Content': [],
            'List.Leading': [],
            'List.Trailing': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isStretched
      id={id}
      log={log}
      title="List (Parts)"
      controls={[
        controlContent,
        controlRoot,
        controlSection,
        controlHeader,
        controlSupertitle,
        controlGroup,
        controlItem,
        controlImage,
        controlTitle,
        controlSubtitle,
        controlDetail,
        controlDrillIn,
        controlAccessory,
        controlCheckmark,
        controlAction,
        controlButton,
        controlCheckbox,
        controlEditButton,
        controlSwipeActionsTrigger,
        controlGrabber,
        controlText,
        controlSwipeActions,
        controlSwipeAction,
        controlFooter,
        controlBlock,
        partControls,
      ]}
      state={[
        stateContent,
        stateRoot,
        stateSection,
        stateHeader,
        stateSupertitle,
        stateGroup,
        stateItem,
        stateImage,
        stateTitle,
        stateSubtitle,
        stateDetail,
        stateDrillIn,
        stateAccessory,
        stateCheckmark,
        stateAction,
        stateButton,
        stateCheckbox,
        stateEditButton,
        stateGrabber,
        stateText,
        stateSwipeActions,
        stateSwipeAction,
        stateFooter,
        stateBlock,
        stateSwipeActionsTrigger,
        partState,
      ]}
    >
      <List.Root {...propsRoot}>
        <List.Section {...propsSection}>
          <List.Header {...propsHeader}>
            {content.supertitle ? (
              <List.Supertitle {...propsSupertitle}>Supertitle</List.Supertitle>
            ) : null}
            <List.Title
              {...partProps['List.Title']}
              render={<h3 />}
            >
              Header
            </List.Title>
            {content.headerSubtitle ? (
              <List.Subtitle {...partProps['List.Subtitle']}>
                Subtitle
              </List.Subtitle>
            ) : null}
            <List.Accessory
              {...partProps['List.Accessory']}
              aria-label="Edit"
              render={<button type="button" />}
              onClick={() => addLog('header accessory clicked')}
            >
              <Symbol
                {...partProps.Symbol}
                icon={sfSquareAndPencil}
              />
            </List.Accessory>
          </List.Header>
          <List.Group {...propsGroup}>
            <List.Item {...propsItem}>
              <List.Leading {...partProps['List.Leading']}>
                <List.Image
                  {...propsImage}
                  variant={propsImage.variant ?? 'rounded'}
                  style={{
                    backgroundColor: 'var(--color-ui-system-blue)',
                    ...propsImage.style,
                  }}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfWifi}
                  />
                </List.Image>
              </List.Leading>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...propsTitle}>Title</List.Title>
                <List.Subtitle {...propsSubtitle}>Subtitle</List.Subtitle>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Detail {...propsDetail}>Detail</List.Detail>
              </List.Trailing>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.DrillIn {...propsDrillIn} />
              </List.Trailing>
            </List.Item>
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>
                  Accessory, checkmark
                </List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Accessory
                  aria-label="Info"
                  {...propsAccessory}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfICircle}
                  />
                </List.Accessory>
                <List.Checkmark {...propsCheckmark} />
              </List.Trailing>
            </List.Item>
            {/* Rows with a single control pass their clicks on to it. */}
            <List.Item
              {...partProps['List.Item']}
              onClick={forwardClick('[data-list-part=action]')}
            >
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>Action</List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Action {...propsAction}>Action</List.Action>
              </List.Trailing>
            </List.Item>
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Button {...propsButton}>Button</List.Button>
              </List.Content>
            </List.Item>
            <List.Item
              {...partProps['List.Item']}
              onClick={forwardClick('[role=checkbox]')}
            >
              <List.Leading {...partProps['List.Leading']}>
                <List.Checkbox
                  key={keyCheckbox}
                  aria-label="Checkbox"
                  {...propsCheckbox}
                />
              </List.Leading>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>
                  Checkbox, grabber
                </List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Grabber
                  aria-label="Reorder"
                  {...propsGrabber}
                />
              </List.Trailing>
            </List.Item>
            <List.Item {...partProps['List.Item']}>
              <List.Leading {...partProps['List.Leading']}>
                <List.SwipeActionsTrigger
                  {...propsSwipeActionsTrigger}
                  render={
                    <List.EditButton
                      aria-label="Edit"
                      {...propsEditButton}
                    >
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfMinus}
                      />
                    </List.EditButton>
                  }
                />
              </List.Leading>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>
                  Edit button
                </List.Title>
              </List.Content>
              <List.SwipeActions {...partProps['List.SwipeActions']}>
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  label="Delete"
                  tint="var(--color-ui-system-red)"
                  onClick={() => addLog('delete clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfTrashFill}
                  />
                </List.SwipeAction>
              </List.SwipeActions>
            </List.Item>
            <List.Item {...partProps['List.Item']}>
              <List.Leading {...partProps['List.Leading']}>
                <List.Image
                  {...partProps['List.Image']}
                  variant="circular"
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfPersonCropCircleFill}
                  />
                </List.Image>
              </List.Leading>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>
                  Swipe actions
                </List.Title>
                <List.Subtitle {...partProps['List.Subtitle']}>
                  Text, swipe actions
                </List.Subtitle>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Detail {...partProps['List.Detail']}>10:00</List.Detail>
              </List.Trailing>
              <List.Below {...partProps['List.Below']}>
                <List.Text {...propsText}>
                  A multi-line row: body text below the title and subtitle, at
                  most two lines by default. Swipe it either way.
                </List.Text>
              </List.Below>
              <List.SwipeActions
                {...partProps['List.SwipeActions']}
                overswipe
                side="inline-start"
              >
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  showLabel
                  label="Unread"
                  tint="var(--color-ui-system-blue)"
                  onClick={() => addLog('unread clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfEnvelopeOpenFill}
                  />
                </List.SwipeAction>
              </List.SwipeActions>
              <List.SwipeActions {...propsSwipeActions}>
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  showLabel
                  label="More"
                  onClick={() => addLog('more clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfEllipsis}
                  />
                </List.SwipeAction>
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  showLabel
                  label="Flag"
                  tint="var(--color-ui-system-orange)"
                  onClick={() => addLog('flag clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfFlagFill}
                  />
                </List.SwipeAction>
                <List.SwipeAction {...propsSwipeAction}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfArchiveboxFill}
                  />
                </List.SwipeAction>
              </List.SwipeActions>
            </List.Item>
          </List.Group>
          <List.Footer {...propsFooter}>
            Footer text, aligned with the rows’ text.
          </List.Footer>
        </List.Section>

        <List.Section {...partProps['List.Section']}>
          <List.Block {...propsBlock}>
            <p>A content block, with text aligned with the rows’ text.</p>
          </List.Block>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/**
 * A collapsible section (Base UI `Collapsible`: its header the trigger, its
 * group the panel), and an expandable row (`List.CollapsiblePanel`, toggled by
 * the row above it: `List.CollapsibleRoot`, its title the trigger).
 */
export const ListCollapsibleDemo: FunctionComponent = () => {
  const id = 'list-collapsible';

  const [log, addLog] = useLog();
  const [
    externalCollapsible,
    externalTrigger,
    externalPanel,
    externalDisclosure,
    externalListCollapsible,
  ] = useProvidedState(id);

  const [selection, setSelection] = useState('Automatic');

  const [
    controlCollapsible,
    propsCollapsible,
    stateCollapsible,
    keyCollapsible,
  ] = usePropControl(propOptionsCollapsible, {
    external: externalCollapsible,
    isOpen: true,
    title: 'Collapsible.Root',
  });
  const [controlTrigger, propsTrigger, stateTrigger] = usePropControl(
    propOptionsCursor,
    { external: externalTrigger, title: 'Collapsible.Trigger (List.Header)' },
  );
  const [controlPanel, propsPanel, statePanel] = usePropControl(
    propOptionsPanel,
    { external: externalPanel, title: 'Collapsible.Panel (List.Group)' },
  );
  const [controlDisclosure, propsDisclosure, stateDisclosure] = usePropControl(
    commonPropOptions,
    { external: externalDisclosure, title: 'List.Disclosure' },
  );
  const [controlListCollapsible, propsListCollapsible, stateListCollapsible] =
    usePropControl(
      useMemo(() => getPropOptionsListCollapsibleRoot(addLog), [addLog]),
      {
        external: externalListCollapsible,
        isOpen: true,
        title: 'List.CollapsibleRoot',
      },
    );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Disclosure': [],
            Symbol: ['icon'],
            'Collapsible.Trigger': ['nativeButton', 'render'],
            'List.Checkmark': [],
            'List.CollapsiblePanel': [],
            'List.CollapsibleTrigger': [],
            'List.Content': [],
            'List.Detail': [],
            'List.Group': [],
            'List.Image': ['variant'],
            'List.Item': [],
            'List.Leading': [],
            'List.Root': [],
            'List.Section': [],
            'List.Subtitle': [],
            'List.Title': ['onClick', 'render'],
            'List.Trailing': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isStretched
      id={id}
      log={log}
      title="List (Collapsible)"
      controls={[
        controlCollapsible,
        controlTrigger,
        controlPanel,
        controlDisclosure,
        controlListCollapsible,
        partControls,
      ]}
      state={[
        stateCollapsible,
        stateTrigger,
        statePanel,
        stateDisclosure,
        stateListCollapsible,
        partState,
      ]}
    >
      <List.Root {...partProps['List.Root']}>
        <Collapsible.Root
          key={keyCollapsible}
          {...propsCollapsible}
          render={<List.Section {...partProps['List.Section']} />}
        >
          <Collapsible.Trigger
            {...partProps['Collapsible.Trigger']}
            nativeButton={false}
            render={
              <List.Header
                prominence="nested"
                {...propsTrigger}
              />
            }
          >
            <List.Title {...partProps['List.Title']}>Collapsible</List.Title>
            <List.Detail {...partProps['List.Detail']}>{selection}</List.Detail>
            <List.Disclosure {...propsDisclosure} />
          </Collapsible.Trigger>
          <Collapsible.Panel
            {...propsPanel}
            render={<List.Group {...partProps['List.Group']} />}
          >
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title
                  {...partProps['List.Title']}
                  render={<button />}
                  onClick={() => setSelection('Automatic')}
                >
                  Automatic
                </List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                {selection === 'Automatic' ? (
                  <List.Checkmark {...partProps['List.Checkmark']} />
                ) : null}
              </List.Trailing>
            </List.Item>
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title
                  {...partProps['List.Title']}
                  render={<button />}
                  onClick={() => setSelection('Always')}
                >
                  Always
                </List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                {selection === 'Always' ? (
                  <List.Checkmark {...partProps['List.Checkmark']} />
                ) : null}
              </List.Trailing>
            </List.Item>
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title
                  {...partProps['List.Title']}
                  render={<button />}
                  onClick={() => setSelection('Never')}
                >
                  Never
                </List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                {selection === 'Never' ? (
                  <List.Checkmark {...partProps['List.Checkmark']} />
                ) : null}
              </List.Trailing>
            </List.Item>
          </Collapsible.Panel>
        </Collapsible.Root>

        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <List.CollapsibleRoot {...propsListCollapsible}>
              <List.Item {...partProps['List.Item']}>
                <List.Content {...partProps['List.Content']}>
                  <List.Title
                    {...partProps['List.Title']}
                    render={
                      <List.CollapsibleTrigger
                        {...partProps['List.CollapsibleTrigger']}
                      />
                    }
                  >
                    Collapsible row
                  </List.Title>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  <List.Disclosure {...partProps['List.Disclosure']} />
                </List.Trailing>
              </List.Item>
              <List.CollapsiblePanel {...partProps['List.CollapsiblePanel']}>
                <List.Item {...partProps['List.Item']}>
                  <List.Leading {...partProps['List.Leading']}>
                    <List.Image
                      {...partProps['List.Image']}
                      variant="rounded"
                    >
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfWifi}
                      />
                    </List.Image>
                  </List.Leading>
                  <List.Content {...partProps['List.Content']}>
                    <List.Title {...partProps['List.Title']}>
                      Expanded
                    </List.Title>
                    <List.Subtitle {...partProps['List.Subtitle']}>
                      Shown below the row above, opening and closing in place.
                    </List.Subtitle>
                  </List.Content>
                </List.Item>
              </List.CollapsiblePanel>
            </List.CollapsibleRoot>
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>Below</List.Title>
              </List.Content>
            </List.Item>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/**
 * Swipe actions: regular and tall rows
 * (circles), a multi-line row (labelled), rounded rectangles, both mixed,
 * and text instead of symbols; with actions on both sides (leading orange,
 * gray, red; trailing purple, indigo, green), overswipeable either way.
 */
export const ListSwipeDemo: FunctionComponent = () => {
  const id = 'list-swipe';

  const [log, addLog] = useLog();
  const [externalRoot, externalSwipeActions, externalSwipeAction] =
    useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot] = usePropControl(propOptionsRoot, {
    external: externalRoot,
    title: 'List.Root',
  });
  const [controlSwipeActions, propsSwipeActions, stateSwipeActions] =
    usePropControl(
      useMemo(() => getPropOptionsSwipeActionsFirstLeading(addLog), [addLog]),
      {
        external: externalSwipeActions,
        isOpen: true,
        title: 'List.SwipeActions (1st, leading)',
      },
    );
  const [controlSwipeAction, propsSwipeAction, stateSwipeAction] =
    usePropControl(
      useMemo(() => getPropOptionsSwipeActionFirst(addLog), [addLog]),
      { external: externalSwipeAction, title: 'List.SwipeAction (1st)' },
    );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.SwipeAction': [
              'label',
              'onClick',
              'shape',
              'showLabel',
              'tint',
            ],
            'List.SwipeActions': ['overswipe', 'side'],
            Symbol: ['icon'],
            'List.Below': [],
            'List.Content': [],
            'List.Detail': [],
            'List.DrillIn': [],
            'List.Footer': [],
            'List.Group': [],
            'List.Image': ['style', 'variant'],
            'List.Item': [],
            'List.Leading': [],
            'List.Section': [],
            'List.Subtitle': [],
            'List.Text': [],
            'List.Title': ['onClick', 'render'],
            'List.Trailing': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isStretched
      id={id}
      log={log}
      state={[stateRoot, stateSwipeActions, stateSwipeAction, partState]}
      title="List (Swipe Actions)"
      controls={[
        controlRoot,
        controlSwipeActions,
        controlSwipeAction,
        partControls,
      ]}
    >
      <List.Root {...propsRoot}>
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <List.Item {...partProps['List.Item']}>
              <List.Leading {...partProps['List.Leading']}>
                <List.Image
                  {...partProps['List.Image']}
                  style={{ backgroundColor: 'var(--color-ui-system-blue)' }}
                  variant="rounded"
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfEnvelopeFill}
                  />
                </List.Image>
              </List.Leading>
              <List.Content {...partProps['List.Content']}>
                <List.Title
                  {...partProps['List.Title']}
                  render={<button />}
                  onClick={() => addLog('Regular clicked')}
                >
                  Regular
                </List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Detail {...partProps['List.Detail']}>Detail</List.Detail>
              </List.Trailing>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.DrillIn {...partProps['List.DrillIn']} />
              </List.Trailing>
              <List.SwipeActions
                side="inline-start"
                {...propsSwipeActions}
              >
                <List.SwipeAction
                  {...propsSwipeAction}
                  label={propsSwipeAction.label ?? 'Pin'}
                  tint={
                    propsSwipeAction.tint ?? 'var(--color-ui-system-orange)'
                  }
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfPinFill}
                  />
                </List.SwipeAction>
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  label="Mute"
                  onClick={() => addLog('Mute clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfBellFill}
                  />
                </List.SwipeAction>
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  label="Delete"
                  tint="var(--color-ui-system-red)"
                  onClick={() => addLog('Delete clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfTrashFill}
                  />
                </List.SwipeAction>
              </List.SwipeActions>
              <List.SwipeActions
                {...partProps['List.SwipeActions']}
                overswipe
              >
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  label="Tag"
                  tint="var(--color-ui-system-purple)"
                  onClick={() => addLog('Tag clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfTagFill}
                  />
                </List.SwipeAction>
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  label="Mail"
                  tint="var(--color-ui-system-indigo)"
                  onClick={() => addLog('Mail clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfEnvelopeFill}
                  />
                </List.SwipeAction>
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  label="Done"
                  tint="var(--color-ui-system-green)"
                  onClick={() => addLog('Done clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfCheckmarkCircleFill}
                  />
                </List.SwipeAction>
              </List.SwipeActions>
            </List.Item>
            <List.Item {...partProps['List.Item']}>
              <List.Leading {...partProps['List.Leading']}>
                <List.Image
                  {...partProps['List.Image']}
                  style={{ backgroundColor: 'var(--color-ui-system-blue)' }}
                  variant="rounded"
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfEnvelopeFill}
                  />
                </List.Image>
              </List.Leading>
              <List.Content {...partProps['List.Content']}>
                <List.Title
                  {...partProps['List.Title']}
                  render={<button />}
                  onClick={() => addLog('Tall clicked')}
                >
                  Tall
                </List.Title>
                <List.Subtitle {...partProps['List.Subtitle']}>
                  Swipe either way
                </List.Subtitle>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Detail {...partProps['List.Detail']}>Detail</List.Detail>
              </List.Trailing>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.DrillIn {...partProps['List.DrillIn']} />
              </List.Trailing>
              <List.SwipeActions
                {...partProps['List.SwipeActions']}
                overswipe
                side="inline-start"
              >
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  label="Pin"
                  tint="var(--color-ui-system-orange)"
                  onClick={() => addLog('Pin clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfPinFill}
                  />
                </List.SwipeAction>
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  label="Mute"
                  onClick={() => addLog('Mute clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfBellFill}
                  />
                </List.SwipeAction>
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  label="Delete"
                  tint="var(--color-ui-system-red)"
                  onClick={() => addLog('Delete clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfTrashFill}
                  />
                </List.SwipeAction>
              </List.SwipeActions>
              <List.SwipeActions
                {...partProps['List.SwipeActions']}
                overswipe
              >
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  label="Tag"
                  tint="var(--color-ui-system-purple)"
                  onClick={() => addLog('Tag clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfTagFill}
                  />
                </List.SwipeAction>
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  label="Mail"
                  tint="var(--color-ui-system-indigo)"
                  onClick={() => addLog('Mail clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfEnvelopeFill}
                  />
                </List.SwipeAction>
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  label="Done"
                  tint="var(--color-ui-system-green)"
                  onClick={() => addLog('Done clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfCheckmarkCircleFill}
                  />
                </List.SwipeAction>
              </List.SwipeActions>
            </List.Item>
            <List.Item {...partProps['List.Item']}>
              <List.Leading {...partProps['List.Leading']}>
                <List.Image
                  {...partProps['List.Image']}
                  style={{ backgroundColor: 'var(--color-ui-system-blue)' }}
                  variant="rounded"
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfEnvelopeFill}
                  />
                </List.Image>
              </List.Leading>
              <List.Content {...partProps['List.Content']}>
                <List.Title
                  {...partProps['List.Title']}
                  render={<button />}
                  onClick={() => addLog('Multi-line clicked')}
                >
                  Multi-line
                </List.Title>
                <List.Subtitle {...partProps['List.Subtitle']}>
                  Swipe either way
                </List.Subtitle>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Detail {...partProps['List.Detail']}>Detail</List.Detail>
              </List.Trailing>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.DrillIn {...partProps['List.DrillIn']} />
              </List.Trailing>
              <List.Below {...partProps['List.Below']}>
                <List.Text {...partProps['List.Text']}>
                  Swipe on past the actions to trigger the outermost one, on
                  either side; let go before to keep them open.
                </List.Text>
              </List.Below>
              <List.SwipeActions
                {...partProps['List.SwipeActions']}
                overswipe
                side="inline-start"
              >
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  showLabel
                  label="Pin"
                  tint="var(--color-ui-system-orange)"
                  onClick={() => addLog('Pin clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfPinFill}
                  />
                </List.SwipeAction>
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  showLabel
                  label="Mute"
                  onClick={() => addLog('Mute clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfBellFill}
                  />
                </List.SwipeAction>
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  showLabel
                  label="Delete"
                  tint="var(--color-ui-system-red)"
                  onClick={() => addLog('Delete clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfTrashFill}
                  />
                </List.SwipeAction>
              </List.SwipeActions>
              <List.SwipeActions
                {...partProps['List.SwipeActions']}
                overswipe
              >
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  showLabel
                  label="Tag"
                  tint="var(--color-ui-system-purple)"
                  onClick={() => addLog('Tag clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfTagFill}
                  />
                </List.SwipeAction>
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  showLabel
                  label="Mail"
                  tint="var(--color-ui-system-indigo)"
                  onClick={() => addLog('Mail clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfEnvelopeFill}
                  />
                </List.SwipeAction>
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  showLabel
                  label="Done"
                  tint="var(--color-ui-system-green)"
                  onClick={() => addLog('Done clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfCheckmarkCircleFill}
                  />
                </List.SwipeAction>
              </List.SwipeActions>
            </List.Item>
            <List.Item {...partProps['List.Item']}>
              <List.Leading {...partProps['List.Leading']}>
                <List.Image
                  {...partProps['List.Image']}
                  style={{ backgroundColor: 'var(--color-ui-system-blue)' }}
                  variant="rounded"
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfEnvelopeFill}
                  />
                </List.Image>
              </List.Leading>
              <List.Content {...partProps['List.Content']}>
                <List.Title
                  {...partProps['List.Title']}
                  render={<button />}
                  onClick={() => addLog('Rounded rectangles clicked')}
                >
                  Rounded rectangles
                </List.Title>
                <List.Subtitle {...partProps['List.Subtitle']}>
                  Swipe either way
                </List.Subtitle>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Detail {...partProps['List.Detail']}>Detail</List.Detail>
              </List.Trailing>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.DrillIn {...partProps['List.DrillIn']} />
              </List.Trailing>
              <List.Below {...partProps['List.Below']}>
                <List.Text {...partProps['List.Text']}>
                  Swipe on past the actions to trigger the outermost one, on
                  either side; let go before to keep them open.
                </List.Text>
              </List.Below>
              <List.SwipeActions
                {...partProps['List.SwipeActions']}
                overswipe
                side="inline-start"
              >
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  showLabel
                  label="Pin"
                  shape="roundedRectangle"
                  tint="var(--color-ui-system-orange)"
                  onClick={() => addLog('Pin clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfPinFill}
                  />
                </List.SwipeAction>
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  showLabel
                  label="Mute"
                  shape="roundedRectangle"
                  onClick={() => addLog('Mute clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfBellFill}
                  />
                </List.SwipeAction>
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  showLabel
                  label="Delete"
                  shape="roundedRectangle"
                  tint="var(--color-ui-system-red)"
                  onClick={() => addLog('Delete clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfTrashFill}
                  />
                </List.SwipeAction>
              </List.SwipeActions>
              <List.SwipeActions
                {...partProps['List.SwipeActions']}
                overswipe
              >
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  showLabel
                  label="Tag"
                  shape="roundedRectangle"
                  tint="var(--color-ui-system-purple)"
                  onClick={() => addLog('Tag clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfTagFill}
                  />
                </List.SwipeAction>
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  showLabel
                  label="Mail"
                  shape="roundedRectangle"
                  tint="var(--color-ui-system-indigo)"
                  onClick={() => addLog('Mail clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfEnvelopeFill}
                  />
                </List.SwipeAction>
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  showLabel
                  label="Done"
                  shape="roundedRectangle"
                  tint="var(--color-ui-system-green)"
                  onClick={() => addLog('Done clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfCheckmarkCircleFill}
                  />
                </List.SwipeAction>
              </List.SwipeActions>
            </List.Item>
            {/* The outermost (Pin, Done) rounded rectangles, the others
               circles. */}
            <List.Item {...partProps['List.Item']}>
              <List.Leading {...partProps['List.Leading']}>
                <List.Image
                  {...partProps['List.Image']}
                  style={{ backgroundColor: 'var(--color-ui-system-blue)' }}
                  variant="rounded"
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfEnvelopeFill}
                  />
                </List.Image>
              </List.Leading>
              <List.Content {...partProps['List.Content']}>
                <List.Title
                  {...partProps['List.Title']}
                  render={<button />}
                  onClick={() => addLog('Mixed clicked')}
                >
                  Mixed
                </List.Title>
                <List.Subtitle {...partProps['List.Subtitle']}>
                  Swipe either way
                </List.Subtitle>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Detail {...partProps['List.Detail']}>Detail</List.Detail>
              </List.Trailing>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.DrillIn {...partProps['List.DrillIn']} />
              </List.Trailing>
              <List.SwipeActions
                {...partProps['List.SwipeActions']}
                overswipe
                side="inline-start"
              >
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  label="Pin"
                  shape="roundedRectangle"
                  tint="var(--color-ui-system-orange)"
                  onClick={() => addLog('Pin clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfPinFill}
                  />
                </List.SwipeAction>
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  label="Mute"
                  shape="circle"
                  onClick={() => addLog('Mute clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfBellFill}
                  />
                </List.SwipeAction>
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  label="Delete"
                  shape="circle"
                  tint="var(--color-ui-system-red)"
                  onClick={() => addLog('Delete clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfTrashFill}
                  />
                </List.SwipeAction>
              </List.SwipeActions>
              <List.SwipeActions
                {...partProps['List.SwipeActions']}
                overswipe
              >
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  label="Tag"
                  shape="circle"
                  tint="var(--color-ui-system-purple)"
                  onClick={() => addLog('Tag clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfTagFill}
                  />
                </List.SwipeAction>
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  label="Mail"
                  shape="circle"
                  tint="var(--color-ui-system-indigo)"
                  onClick={() => addLog('Mail clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfEnvelopeFill}
                  />
                </List.SwipeAction>
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  label="Done"
                  shape="roundedRectangle"
                  tint="var(--color-ui-system-green)"
                  onClick={() => addLog('Done clicked')}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfCheckmarkCircleFill}
                  />
                </List.SwipeAction>
              </List.SwipeActions>
            </List.Item>
            <List.Item {...partProps['List.Item']}>
              <List.Leading {...partProps['List.Leading']}>
                <List.Image
                  {...partProps['List.Image']}
                  style={{ backgroundColor: 'var(--color-ui-system-blue)' }}
                  variant="rounded"
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfEnvelopeFill}
                  />
                </List.Image>
              </List.Leading>
              <List.Content {...partProps['List.Content']}>
                <List.Title
                  {...partProps['List.Title']}
                  render={<button />}
                  onClick={() => addLog('Text clicked')}
                >
                  Text
                </List.Title>
                <List.Subtitle {...partProps['List.Subtitle']}>
                  Swipe either way
                </List.Subtitle>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Detail {...partProps['List.Detail']}>Detail</List.Detail>
              </List.Trailing>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.DrillIn {...partProps['List.DrillIn']} />
              </List.Trailing>
              <List.SwipeActions
                {...partProps['List.SwipeActions']}
                overswipe
                side="inline-start"
              >
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  label="Pin"
                  shape="roundedRectangle"
                  tint="var(--color-ui-system-orange)"
                  onClick={() => addLog('Pin clicked')}
                >
                  Pin
                </List.SwipeAction>
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  label="Mute"
                  shape="roundedRectangle"
                  onClick={() => addLog('Mute clicked')}
                >
                  Mute
                </List.SwipeAction>
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  label="Delete"
                  shape="roundedRectangle"
                  tint="var(--color-ui-system-red)"
                  onClick={() => addLog('Delete clicked')}
                >
                  Delete
                </List.SwipeAction>
              </List.SwipeActions>
              <List.SwipeActions
                {...partProps['List.SwipeActions']}
                overswipe
              >
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  label="Tag"
                  shape="roundedRectangle"
                  tint="var(--color-ui-system-purple)"
                  onClick={() => addLog('Tag clicked')}
                >
                  Tag
                </List.SwipeAction>
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  label="Mail"
                  shape="roundedRectangle"
                  tint="var(--color-ui-system-indigo)"
                  onClick={() => addLog('Mail clicked')}
                >
                  Mail
                </List.SwipeAction>
                <List.SwipeAction
                  {...partProps['List.SwipeAction']}
                  label="Done"
                  shape="roundedRectangle"
                  tint="var(--color-ui-system-green)"
                  onClick={() => addLog('Done clicked')}
                >
                  Done
                </List.SwipeAction>
              </List.SwipeActions>
            </List.Item>
          </List.Group>
          <List.Footer {...partProps['List.Footer']}>
            Swipe a row to reveal its actions; swipe on past them to trigger the
            outermost.
          </List.Footer>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/**
 * Editing: rows reordered by their grabbers
 * (a reorder handle; the app reorders its rows), deleted by swiping.
 */
export const ListEditDemo: FunctionComponent = () => {
  const id = 'list-edit';

  const [log, addLog] = useLog();
  const [externalRoot, externalGrabber] = useProvidedState(id);

  const [rows, setRows] = useState<readonly string[]>(planets);
  const reorderRows = useCreateReorderHandle({
    onReorder: (change: ListReorderChange) => {
      addLog(
        `reorder: ${String(change.items[0]?.name)} after ${change.target.after ?? '(start)'}`,
      );
      setRows((current) => List.reorder(current, change, (row: string) => row));
    },
  });

  const [controlRoot, propsRoot, stateRoot] = usePropControl(propOptionsRoot, {
    external: externalRoot,
    title: 'List.Root',
  });
  const [controlGrabber, propsGrabber, stateGrabber] = usePropControl(
    propOptionsCursor,
    { external: externalGrabber, isOpen: true, title: 'List.Grabber (1st)' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'List.Grabber (others)': ['aria-label'],
            'List.Action': ['onClick'],
            'List.Content': [],
            'List.Group': ['reorderHandle'],
            'List.Header': ['prominence'],
            'List.Item': ['dropName', 'reorderHandle'],
            'List.Section': [],
            'List.SwipeAction': ['label', 'onClick', 'tint'],
            'List.SwipeActions': [],
            'List.Title': [],
            'List.Trailing': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isStretched
      controls={[controlRoot, controlGrabber, partControls]}
      id={id}
      log={log}
      state={[stateRoot, stateGrabber, partState]}
      title="List (Editing)"
    >
      <List.Root {...propsRoot}>
        <List.Section {...partProps['List.Section']}>
          <List.Header
            {...partProps['List.Header']}
            prominence="nested"
          >
            <List.Title {...partProps['List.Title']}>Planets</List.Title>
            <List.Action
              {...partProps['List.Action']}
              onClick={() => setRows(planets)}
            >
              Reset
            </List.Action>
          </List.Header>
          <List.Group
            {...partProps['List.Group']}
            reorderHandle={reorderRows}
          >
            {rows.map((name, index) => (
              <List.Item
                key={name}
                {...partProps['List.Item']}
                dropName={name}
                reorderHandle={reorderRows}
              >
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>{name}</List.Title>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  <List.Grabber
                    aria-label={`Reorder ${name}`}
                    {...(index === 0
                      ? propsGrabber
                      : partProps['List.Grabber (others)'])}
                  />
                </List.Trailing>
                <List.SwipeActions
                  {...partProps['List.SwipeActions']}
                  overswipe
                >
                  <List.SwipeAction
                    {...partProps['List.SwipeAction']}
                    label="Delete"
                    tint="var(--color-ui-system-red)"
                    onClick={() => {
                      addLog(`delete ${name}`);
                      setRows((current) =>
                        current.filter((row) => row !== name),
                      );
                    }}
                  >
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrashFill}
                    />
                  </List.SwipeAction>
                </List.SwipeActions>
              </List.Item>
            ))}
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/**
 * Deleting rows: each row's edit button
 * opens its trailing swipe actions.
 */
export const ListEditDeleteDemo: FunctionComponent = () => {
  const id = 'list-edit-delete';

  const [log, addLog] = useLog();
  const [externalRoot, externalEditButton] = useProvidedState(id);

  const [rows, setRows] = useState<readonly string[]>(planets);

  const [controlRoot, propsRoot, stateRoot] = usePropControl(propOptionsRoot, {
    external: externalRoot,
    title: 'List.Root',
  });
  const [controlEditButton, propsEditButton, stateEditButton] = usePropControl(
    useMemo(() => getPropOptionsEditButtonFirst(addLog), [addLog]),
    {
      external: externalEditButton,
      isOpen: true,
      title: 'List.EditButton (1st)',
    },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'List.EditButton (others)': ['aria-label', 'tint'],
            'List.Action': ['onClick'],
            'List.Content': [],
            'List.Group': [],
            'List.Header': ['prominence'],
            'List.Item': [],
            'List.Leading': [],
            'List.Section': [],
            'List.SwipeAction': ['label', 'onClick', 'tint'],
            'List.SwipeActions': [],
            'List.SwipeActionsTrigger': ['render'],
            'List.Title': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isStretched
      controls={[controlRoot, controlEditButton, partControls]}
      id={id}
      log={log}
      state={[stateRoot, stateEditButton, partState]}
      title="List (Editing: Delete)"
    >
      <List.Root {...propsRoot}>
        <List.Section {...partProps['List.Section']}>
          <List.Header
            {...partProps['List.Header']}
            prominence="nested"
          >
            <List.Title {...partProps['List.Title']}>Planets</List.Title>
            <List.Action
              {...partProps['List.Action']}
              onClick={() => setRows(planets)}
            >
              Reset
            </List.Action>
          </List.Header>
          <List.Group {...partProps['List.Group']}>
            {rows.map((name, index) => (
              <List.Item
                key={name}
                {...partProps['List.Item']}
              >
                <List.Leading {...partProps['List.Leading']}>
                  <List.SwipeActionsTrigger
                    {...partProps['List.SwipeActionsTrigger']}
                    render={
                      <List.EditButton
                        aria-label={`Delete ${name}`}
                        tint="var(--color-ui-system-red)"
                        {...(index === 0
                          ? propsEditButton
                          : partProps['List.EditButton (others)'])}
                      >
                        <Symbol
                          {...partProps.Symbol}
                          icon={sfMinus}
                        />
                      </List.EditButton>
                    }
                  />
                </List.Leading>
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>{name}</List.Title>
                </List.Content>
                <List.SwipeActions
                  {...partProps['List.SwipeActions']}
                  overswipe
                >
                  <List.SwipeAction
                    {...partProps['List.SwipeAction']}
                    label="Delete"
                    tint="var(--color-ui-system-red)"
                    onClick={() => {
                      addLog(`delete ${name}`);
                      setRows((current) =>
                        current.filter((row) => row !== name),
                      );
                    }}
                  >
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrashFill}
                    />
                  </List.SwipeAction>
                </List.SwipeActions>
              </List.Item>
            ))}
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/**
 * Deleting rows, with an insert row at the end.
 */
export const ListEditInsertDemo: FunctionComponent = () => {
  const id = 'list-edit-insert';

  const [log, addLog] = useLog();
  const [externalRoot] = useProvidedState(id);

  const [rows, setRows] = useState<readonly string[]>(planets);
  const added = useRef(0);

  const [controlRoot, propsRoot, stateRoot] = usePropControl(propOptionsRoot, {
    external: externalRoot,
    title: 'List.Root',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'List.Action': ['onClick'],
            'List.Content': [],
            'List.EditButton': ['aria-label', 'onClick', 'tint'],
            'List.Group': [],
            'List.Header': ['prominence'],
            'List.Item': [],
            'List.Leading': [],
            'List.Section': [],
            'List.SwipeAction': ['label', 'onClick', 'tint'],
            'List.SwipeActions': [],
            'List.SwipeActionsTrigger': ['render'],
            'List.Title': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isStretched
      controls={[controlRoot, partControls]}
      id={id}
      log={log}
      state={[stateRoot, partState]}
      title="List (Editing: Insert)"
    >
      <List.Root {...propsRoot}>
        <List.Section {...partProps['List.Section']}>
          <List.Header
            {...partProps['List.Header']}
            prominence="nested"
          >
            <List.Title {...partProps['List.Title']}>Planets</List.Title>
            <List.Action
              {...partProps['List.Action']}
              onClick={() => setRows(planets)}
            >
              Reset
            </List.Action>
          </List.Header>
          <List.Group {...partProps['List.Group']}>
            {rows.map((name) => (
              <List.Item
                key={name}
                {...partProps['List.Item']}
              >
                <List.Leading {...partProps['List.Leading']}>
                  <List.SwipeActionsTrigger
                    {...partProps['List.SwipeActionsTrigger']}
                    render={
                      <List.EditButton
                        {...partProps['List.EditButton']}
                        aria-label={`Delete ${name}`}
                        tint="var(--color-ui-system-red)"
                      >
                        <Symbol
                          {...partProps.Symbol}
                          icon={sfMinus}
                        />
                      </List.EditButton>
                    }
                  />
                </List.Leading>
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>{name}</List.Title>
                </List.Content>
                <List.SwipeActions
                  {...partProps['List.SwipeActions']}
                  overswipe
                >
                  <List.SwipeAction
                    {...partProps['List.SwipeAction']}
                    label="Delete"
                    tint="var(--color-ui-system-red)"
                    onClick={() => {
                      addLog(`delete ${name}`);
                      setRows((current) =>
                        current.filter((row) => row !== name),
                      );
                    }}
                  >
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfTrashFill}
                    />
                  </List.SwipeAction>
                </List.SwipeActions>
              </List.Item>
            ))}
            <List.Item {...partProps['List.Item']}>
              <List.Leading {...partProps['List.Leading']}>
                <List.EditButton
                  {...partProps['List.EditButton']}
                  aria-label="Add Planet"
                  tint="var(--color-ui-system-green)"
                  onClick={() => {
                    added.current += 1;
                    const row = `New ${added.current}`;
                    addLog(`insert ${row}`);
                    setRows((current) => [...current, row]);
                  }}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfPlus}
                  />
                </List.EditButton>
              </List.Leading>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>Add Planet</List.Title>
              </List.Content>
            </List.Item>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** Selecting several rows: a checkbox before each (`List.Checkbox`). */
export const ListEditSelectDemo: FunctionComponent = () => {
  const id = 'list-edit-select';

  const [log, addLog] = useLog();
  const [externalRoot, externalCheckbox] = useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot] = usePropControl(propOptionsRoot, {
    external: externalRoot,
    title: 'List.Root',
  });
  const [controlCheckbox, propsCheckbox, stateCheckbox, keyCheckbox] =
    usePropControl(
      useMemo(() => getPropOptionsCheckboxFirst(addLog), [addLog]),
      {
        external: externalCheckbox,
        isOpen: true,
        title: 'List.Checkbox (1st)',
      },
    );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Checkbox': ['aria-label'],
            'List.Content': [],
            'List.Group': [],
            'List.Header': ['prominence'],
            'List.Item': ['onClick'],
            'List.Leading': [],
            'List.Section': [],
            'List.Title': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isStretched
      controls={[controlRoot, controlCheckbox, partControls]}
      id={id}
      log={log}
      state={[stateRoot, stateCheckbox, partState]}
      title="List (Editing: Select)"
    >
      <List.Root {...propsRoot}>
        <List.Section {...partProps['List.Section']}>
          <List.Header
            {...partProps['List.Header']}
            prominence="nested"
          >
            <List.Title {...partProps['List.Title']}>Planets</List.Title>
          </List.Header>
          <List.Group {...partProps['List.Group']}>
            {planets.map((name, index) => (
              <List.Item
                key={name}
                {...partProps['List.Item']}
                onClick={forwardClick('[role=checkbox]')}
              >
                <List.Leading {...partProps['List.Leading']}>
                  {index === 0 ? (
                    <List.Checkbox
                      key={keyCheckbox}
                      aria-label={name}
                      {...propsCheckbox}
                    />
                  ) : (
                    <List.Checkbox
                      {...partProps['List.Checkbox']}
                      aria-label={name}
                    />
                  )}
                </List.Leading>
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>{name}</List.Title>
                </List.Content>
              </List.Item>
            ))}
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/**
 * Selecting one row: a radio before each, the group a Base UI `RadioGroup`
 * (rendering the list's group); still reorderable.
 */
export const ListEditSelectSingleDemo: FunctionComponent = () => {
  const id = 'list-edit-select-single';

  const [log, addLog] = useLog();
  const [externalRoot, externalRadioGroup, externalRadio] =
    useProvidedState(id);

  const [rows, setRows] = useState<readonly string[]>(planets);
  const reorderRows = useCreateReorderHandle({
    onReorder: (change: ListReorderChange) => {
      addLog(
        `reorder: ${String(change.items[0]?.name)} after ${change.target.after ?? '(start)'}`,
      );
      setRows((current) => List.reorder(current, change, (row: string) => row));
    },
  });

  const [controlRoot, propsRoot, stateRoot] = usePropControl(propOptionsRoot, {
    external: externalRoot,
    title: 'List.Root',
  });
  const [controlRadioGroup, propsRadioGroup, stateRadioGroup, keyRadioGroup] =
    usePropControl(
      useMemo(() => getPropOptionsRadioGroup(addLog), [addLog]),
      {
        external: externalRadioGroup,
        isOpen: true,
        title: 'RadioGroup (List.Group)',
      },
    );
  const [controlRadio, propsRadio, stateRadio] = usePropControl(
    propOptionsRadioFirst,
    { external: externalRadio, title: 'List.Radio (1st)' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Radio (others)': ['aria-label', 'value'],
            'List.Content': [],
            'List.Grabber': ['aria-label'],
            'List.Group': ['reorderHandle'],
            'List.Header': ['prominence'],
            'List.Item': ['dropName', 'onClick', 'reorderHandle'],
            'List.Leading': [],
            'List.Section': [],
            'List.Title': [],
            'List.Trailing': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isStretched
      controls={[controlRoot, controlRadioGroup, controlRadio, partControls]}
      id={id}
      log={log}
      state={[stateRoot, stateRadioGroup, stateRadio, partState]}
      title="List (Editing: Select One)"
    >
      <List.Root {...propsRoot}>
        <List.Section {...partProps['List.Section']}>
          <List.Header
            {...partProps['List.Header']}
            prominence="nested"
          >
            <List.Title {...partProps['List.Title']}>Planets</List.Title>
          </List.Header>
          <RadioGroup
            key={keyRadioGroup}
            aria-label="Planet"
            {...propsRadioGroup}
            render={
              <List.Group
                {...partProps['List.Group']}
                reorderHandle={reorderRows}
              />
            }
          >
            {rows.map((name, index) => (
              <List.Item
                key={name}
                {...partProps['List.Item']}
                dropName={name}
                reorderHandle={reorderRows}
                onClick={forwardClick('[role=radio]')}
              >
                <List.Leading {...partProps['List.Leading']}>
                  <List.Radio
                    aria-label={name}
                    value={name}
                    {...(index === 0
                      ? propsRadio
                      : partProps['List.Radio (others)'])}
                  />
                </List.Leading>
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>{name}</List.Title>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  <List.Grabber
                    {...partProps['List.Grabber']}
                    aria-label={`Reorder ${name}`}
                  />
                </List.Trailing>
              </List.Item>
            ))}
          </RadioGroup>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/**
 * A full-width segmented control switching between two groups of rows: the
 * segments are radios (Base UI `RadioGroup`),
 * each controlling its group (`aria-controls`), the other one hidden.
 */
export const ListSegmentedDemo: FunctionComponent = () => {
  const id = 'list-segmented';

  const [log, addLog] = useLog();
  const [externalRoot] = useProvidedState(id);

  const [view, setView] = useState('upcoming');

  const [controlRoot, propsRoot, stateRoot] = usePropControl(propOptionsRoot, {
    external: externalRoot,
    title: 'List.Root',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Block': ['style'],
            'List.Content': [],
            'List.DrillIn': [],
            'List.Group': ['aria-label', 'hidden', 'id'],
            'List.Item': [],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
            'List.Trailing': [],
            'Segmented.Highlight': [],
            'Segmented.Item': ['aria-controls', 'value'],
            'Segmented.Root': ['aria-label', 'onValueChange', 'value'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isStretched
      controls={[controlRoot, partControls]}
      id={id}
      log={log}
      state={[stateRoot, partState]}
      title="List (Segmented)"
    >
      <List.Root {...propsRoot}>
        <List.Section {...partProps['List.Section']}>
          {/* Aligned with the groups' edges, not the rows' text. */}
          <List.Block
            {...partProps['List.Block']}
            style={{ marginBlockEnd: 16, paddingInline: 0 }}
          >
            <Segmented.Root
              {...partProps['Segmented.Root']}
              aria-label="Events"
              value={view}
              onValueChange={(value: unknown) => {
                addLog(`view: ${String(value)}`);
                setView(String(value));
              }}
            >
              <Segmented.Item
                {...partProps['Segmented.Item']}
                aria-controls="list-segmented-upcoming"
                value="upcoming"
              >
                Upcoming
              </Segmented.Item>
              <Segmented.Item
                {...partProps['Segmented.Item']}
                aria-controls="list-segmented-past"
                value="past"
              >
                Past
              </Segmented.Item>
              <Segmented.Highlight {...partProps['Segmented.Highlight']} />
            </Segmented.Root>
          </List.Block>
          <List.Group
            {...partProps['List.Group']}
            aria-label="Upcoming"
            hidden={view !== 'upcoming'}
            id="list-segmented-upcoming"
          >
            {['Planning', 'Offsite', 'Release 1.3', 'Retrospective'].map(
              (name) => (
                <List.Item
                  key={name}
                  {...partProps['List.Item']}
                >
                  <List.Content {...partProps['List.Content']}>
                    <List.Title
                      {...partProps['List.Title']}
                      render={<button />}
                      onClick={() => addLog(`${name} clicked`)}
                    >
                      {name}
                    </List.Title>
                  </List.Content>
                  <List.Trailing {...partProps['List.Trailing']}>
                    <List.DrillIn {...partProps['List.DrillIn']} />
                  </List.Trailing>
                </List.Item>
              ),
            )}
          </List.Group>
          <List.Group
            {...partProps['List.Group']}
            aria-label="Past"
            hidden={view !== 'past'}
            id="list-segmented-past"
          >
            {['Design Review', 'Team Lunch', 'Release 1.2'].map((name) => (
              <List.Item
                key={name}
                {...partProps['List.Item']}
              >
                <List.Content {...partProps['List.Content']}>
                  <List.Title
                    {...partProps['List.Title']}
                    render={<button />}
                    onClick={() => addLog(`${name} clicked`)}
                  >
                    {name}
                  </List.Title>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  <List.DrillIn {...partProps['List.DrillIn']} />
                </List.Trailing>
              </List.Item>
            ))}
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/**
 * A form (Framework7 list inputs): fields as rows, with inline labels, a
 * clear button while editing, a placeholder-only row, validation (an email
 * field's error shows once it's left invalid), dates and times picked in
 * expandable rows (`List.CollapsiblePanel`, one picker at a time), and a
 * textarea.
 */
export const ListFormDemo: FunctionComponent = () => {
  const id = 'list-form';

  const [log, addLog] = useLog();
  const [externalRoot] = useProvidedState(id);

  // The rows' pickers, below them (see `DatePicker.Expandable`).
  const startsPicker = useCreateDatePickerHandle();
  const endsPicker = useCreateDatePickerHandle();

  const [controlRoot, propsRoot, stateRoot] = usePropControl(propOptionsRoot, {
    external: externalRoot,
    title: 'List.Root',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'DatePicker.Root': [
              'defaultValue',
              'handle',
              'mode',
              'onValueChange',
            ],
            'List.AccordionItem': ['value'],
            'List.AccordionRoot': [],
            'List.Below': [],
            'List.Content': [],
            'List.Footer': [],
            'List.Group': [],
            'List.Header': ['prominence'],
            'List.Item': [],
            'List.Section': [],
            'List.Span': [],
            'List.Title': [],
            'List.Trailing': [],
            'TextField.Clear': [],
            'TextField.Control': [
              'aria-label',
              'autoComplete',
              'defaultValue',
              'onValueChange',
              'placeholder',
              'render',
              'type',
            ],
            'TextField.Description': [],
            'TextField.Error': ['match'],
            'TextField.Label': [],
            'TextField.Root': ['render', 'validationMode'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isStretched
      controls={[controlRoot, partControls]}
      id={id}
      log={log}
      state={[stateRoot, partState]}
      title="List (Form)"
    >
      <List.Root {...propsRoot}>
        <List.Section {...partProps['List.Section']}>
          <List.Header
            {...partProps['List.Header']}
            prominence="nested"
          >
            <List.Title {...partProps['List.Title']}>Contact</List.Title>
          </List.Header>
          <List.Group {...partProps['List.Group']}>
            <TextField.Root
              {...partProps['TextField.Root']}
              render={<List.Item {...partProps['List.Item']} />}
            >
              <List.Content {...partProps['List.Content']}>
                <TextField.Label {...partProps['TextField.Label']}>
                  Name
                </TextField.Label>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <TextField.Control
                  {...partProps['TextField.Control']}
                  autoComplete="name"
                  defaultValue="Kate Brown"
                  placeholder="Required"
                  onValueChange={(value: string) => addLog(`name: ${value}`)}
                />
                <TextField.Clear {...partProps['TextField.Clear']} />
              </List.Trailing>
            </TextField.Root>
            <TextField.Root
              {...partProps['TextField.Root']}
              render={<List.Item {...partProps['List.Item']} />}
              validationMode="onBlur"
            >
              <List.Content {...partProps['List.Content']}>
                <TextField.Label {...partProps['TextField.Label']}>
                  Email
                </TextField.Label>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <TextField.Control
                  {...partProps['TextField.Control']}
                  placeholder="name@example.com"
                  type="email"
                />
                <TextField.Clear {...partProps['TextField.Clear']} />
              </List.Trailing>
              <List.Below {...partProps['List.Below']}>
                <TextField.Description {...partProps['TextField.Description']}>
                  Used for receipts only.
                </TextField.Description>
                <TextField.Error
                  {...partProps['TextField.Error']}
                  match="typeMismatch"
                >
                  Not an email address.
                </TextField.Error>
              </List.Below>
            </TextField.Root>
            <TextField.Root
              {...partProps['TextField.Root']}
              render={<List.Item {...partProps['List.Item']} />}
            >
              <List.Trailing {...partProps['List.Trailing']}>
                <TextField.Control
                  {...partProps['TextField.Control']}
                  aria-label="Company"
                  placeholder="Company"
                />
                <TextField.Clear {...partProps['TextField.Clear']} />
              </List.Trailing>
            </TextField.Root>
          </List.Group>
        </List.Section>
        <List.Section {...partProps['List.Section']}>
          <List.Header
            {...partProps['List.Header']}
            prominence="nested"
          >
            <List.Title {...partProps['List.Title']}>Event</List.Title>
          </List.Header>
          {/* The date's and the time's buttons open their pickers in
              expandable rows below, one at a time. */}
          <List.Group {...partProps['List.Group']}>
            <List.AccordionRoot {...partProps['List.AccordionRoot']}>
              <List.AccordionItem
                {...partProps['List.AccordionItem']}
                value="starts"
              >
                <List.Item {...partProps['List.Item']}>
                  <List.Content {...partProps['List.Content']}>
                    <List.Title {...partProps['List.Title']}>Starts</List.Title>
                  </List.Content>
                  <List.Trailing {...partProps['List.Trailing']}>
                    <DatePicker.Root
                      {...partProps['DatePicker.Root']}
                      defaultValue={new Date(2025, 3, 20, 10, 0)}
                      handle={startsPicker}
                      mode="dateAndTime"
                      onValueChange={(next: Date) =>
                        addLog(`starts: ${next.toLocaleString()}`)
                      }
                    />
                  </List.Trailing>
                </List.Item>
                <DatePicker.Expandable handle={startsPicker} />
              </List.AccordionItem>
              <List.AccordionItem
                {...partProps['List.AccordionItem']}
                value="ends"
              >
                <List.Item {...partProps['List.Item']}>
                  <List.Content {...partProps['List.Content']}>
                    <List.Title {...partProps['List.Title']}>Ends</List.Title>
                  </List.Content>
                  <List.Trailing {...partProps['List.Trailing']}>
                    <DatePicker.Root
                      {...partProps['DatePicker.Root']}
                      defaultValue={new Date(2025, 3, 21, 18, 0)}
                      handle={endsPicker}
                      mode="dateAndTime"
                      onValueChange={(next: Date) =>
                        addLog(`ends: ${next.toLocaleString()}`)
                      }
                    />
                  </List.Trailing>
                </List.Item>
                <DatePicker.Expandable handle={endsPicker} />
              </List.AccordionItem>
            </List.AccordionRoot>
          </List.Group>
        </List.Section>
        <List.Section {...partProps['List.Section']}>
          <List.Header
            {...partProps['List.Header']}
            prominence="nested"
          >
            <List.Title {...partProps['List.Title']}>Notes</List.Title>
          </List.Header>
          <List.Group {...partProps['List.Group']}>
            <TextField.Root
              {...partProps['TextField.Root']}
              render={<List.Item {...partProps['List.Item']} />}
            >
              <List.Span {...partProps['List.Span']}>
                <TextField.Control
                  {...partProps['TextField.Control']}
                  aria-label="Notes"
                  placeholder="Anything else?"
                  render={<textarea />}
                />
              </List.Span>
            </TextField.Root>
          </List.Group>
          <List.Footer {...partProps['List.Footer']}>
            Fields as list rows, after Framework7.
          </List.Footer>
        </List.Section>
      </List.Root>
    </Component>
  );
};

// Contacts by their initial (the index's sections).

/**
 * An index list: a plain list with sticky section titles (always nested)
 * and an index jumping to them.
 */
export const ListIndexDemo: FunctionComponent = () => {
  const id = 'list-index';

  const [log, addLog] = useLog();
  const [externalRoot, externalHeader, externalIndex, externalIndexItem] =
    useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot] = usePropControl(
    propOptionsRootPlain,
    { external: externalRoot, isOpen: true, title: 'List.Root' },
  );
  const [controlHeader, propsHeader, stateHeader] = usePropControl(
    commonPropOptions,
    { external: externalHeader, title: 'List.Header' },
  );
  const [controlIndex, propsIndex, stateIndex] = usePropControl(
    propOptionsIndex,
    { external: externalIndex, isOpen: true, title: 'List.Index' },
  );
  const [controlIndexItem, propsIndexItem, stateIndexItem] = usePropControl(
    propOptionsCursor,
    { external: externalIndexItem, title: 'List.IndexItem (1st)' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'List.IndexItem (others)': ['onClick'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Section': ['data-letter'],
            'List.SwipeAction': ['label', 'onClick', 'tint'],
            'List.SwipeActions': [],
            'List.Title': ['onClick', 'render'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isStretched
      id={id}
      log={log}
      state={[stateRoot, stateHeader, stateIndex, stateIndexItem, partState]}
      title="List (Index)"
      controls={[
        controlRoot,
        controlHeader,
        controlIndex,
        controlIndexItem,
        partControls,
      ]}
    >
      <div className="list-demo-plain">
        <div className="list-demo-scroll">
          <List.Root {...propsRoot}>
            {Object.entries(contacts).map(([letter, names]) => (
              <List.Section
                key={letter}
                {...partProps['List.Section']}
                indexValue={letter}
              >
                <List.Header
                  prominence="nested"
                  {...propsHeader}
                >
                  <List.Title {...partProps['List.Title']}>{letter}</List.Title>
                </List.Header>
                <List.Group {...partProps['List.Group']}>
                  {names.map((name) => (
                    <List.Item
                      key={name}
                      {...partProps['List.Item']}
                    >
                      <List.Content {...partProps['List.Content']}>
                        <List.Title
                          {...partProps['List.Title']}
                          render={<button />}
                          onClick={() => addLog(`${name} clicked`)}
                        >
                          {name}
                        </List.Title>
                      </List.Content>
                      <List.SwipeActions
                        {...partProps['List.SwipeActions']}
                        overswipe
                      >
                        <List.SwipeAction
                          {...partProps['List.SwipeAction']}
                          label="Delete"
                          tint="var(--color-ui-system-red)"
                          onClick={() => addLog(`delete ${name}`)}
                        >
                          <Symbol
                            {...partProps.Symbol}
                            icon={sfTrashFill}
                          />
                        </List.SwipeAction>
                      </List.SwipeActions>
                    </List.Item>
                  ))}
                </List.Group>
              </List.Section>
            ))}
            {/* At the list's end edge, centered on what's in view of it,
                above the sticky headers; a letter without a section jumps
                to the next one's (see List.Index). */}
            <List.Index {...propsIndex}>
              {[...'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'].map((letter, index) => (
                <List.IndexItem
                  key={letter}
                  onClick={() => addLog(`index: ${letter}`)}
                  {...(index === 0
                    ? propsIndexItem
                    : partProps['List.IndexItem (others)'])}
                >
                  {letter}
                </List.IndexItem>
              ))}
            </List.Index>
          </List.Root>
        </div>
      </div>
    </Component>
  );
};

/**
 * Mail-style rows (Framework7 media list): a plain list whose rows have a
 * title row (sender, date, chevron), a subject (subtitle) and a preview
 * (`Text`), with swipe actions.
 */
export const ListMailDemo: FunctionComponent = () => {
  const id = 'list-mail';

  const [log, addLog] = useLog();

  const [externalRoot, externalText] = useProvidedState(id);
  const [archived, setArchived] = useState<readonly string[]>([]);

  const [controlRoot, propsRoot, stateRoot] = usePropControl(
    propOptionsRootPlain,
    { external: externalRoot, isOpen: true, title: 'List.Root' },
  );

  const [controlText, propsText, stateText] = usePropControl(propOptionsText, {
    external: externalText,
    isOpen: true,
    title: 'List.Text',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'List.Below': [],
            'List.Content': [],
            'List.Detail': [],
            'List.DrillIn': [],
            'List.Group': [],
            'List.Image': ['variant'],
            'List.Item': [],
            'List.Leading': [],
            'List.Section': [],
            'List.Subtitle': [],
            'List.SwipeAction': ['label', 'onClick', 'showLabel', 'tint'],
            'List.SwipeActions': ['onOverswipe', 'overswipe', 'side'],
            'List.Title': ['onClick', 'render'],
            'List.Trailing': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isStretched
      controls={[controlRoot, controlText, partControls]}
      id={id}
      log={log}
      state={[stateRoot, stateText, partState]}
      title="List (Mail)"
    >
      <List.Root {...propsRoot}>
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            {messages
              .filter(({ from }) => !archived.includes(from))
              .map(({ date, from, preview, subject }) => (
                <List.Item
                  key={from}
                  {...partProps['List.Item']}
                >
                  <List.Leading {...partProps['List.Leading']}>
                    <List.Image
                      {...partProps['List.Image']}
                      variant="circular"
                    >
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfPersonCropCircleFill}
                      />
                    </List.Image>
                  </List.Leading>
                  <List.Content {...partProps['List.Content']}>
                    <List.Title
                      {...partProps['List.Title']}
                      render={<button />}
                      onClick={() => addLog(`${from} clicked`)}
                    >
                      {from}
                    </List.Title>
                    <List.Subtitle {...partProps['List.Subtitle']}>
                      {subject}
                    </List.Subtitle>
                  </List.Content>
                  <List.Trailing {...partProps['List.Trailing']}>
                    <List.Detail {...partProps['List.Detail']}>
                      {date}
                    </List.Detail>
                  </List.Trailing>
                  <List.Trailing {...partProps['List.Trailing']}>
                    <List.DrillIn {...partProps['List.DrillIn']} />
                  </List.Trailing>
                  <List.Below {...partProps['List.Below']}>
                    <List.Text {...propsText}>{preview}</List.Text>
                  </List.Below>
                  <List.SwipeActions
                    {...partProps['List.SwipeActions']}
                    overswipe
                    side="inline-start"
                  >
                    <List.SwipeAction
                      {...partProps['List.SwipeAction']}
                      showLabel
                      label="Unread"
                      tint="var(--color-ui-system-blue)"
                      onClick={() => addLog(`unread ${from}`)}
                    >
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfEnvelopeOpenFill}
                      />
                    </List.SwipeAction>
                  </List.SwipeActions>
                  <List.SwipeActions
                    {...partProps['List.SwipeActions']}
                    onOverswipe={() => {
                      addLog(`archived ${from} (overswipe)`);
                      setArchived((current) => [...current, from]);
                    }}
                  >
                    <List.SwipeAction
                      {...partProps['List.SwipeAction']}
                      showLabel
                      label="More"
                      onClick={() => addLog(`more ${from}`)}
                    >
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfEllipsis}
                      />
                    </List.SwipeAction>
                    <List.SwipeAction
                      {...partProps['List.SwipeAction']}
                      showLabel
                      label="Flag"
                      tint="var(--color-ui-system-orange)"
                      onClick={() => addLog(`flag ${from}`)}
                    >
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfFlagFill}
                      />
                    </List.SwipeAction>
                    <List.SwipeAction
                      {...partProps['List.SwipeAction']}
                      showLabel
                      label="Archive"
                      tint="var(--color-ui-system-purple)"
                      onClick={() => addLog(`archived ${from}`)}
                    >
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfArchiveboxFill}
                      />
                    </List.SwipeAction>
                  </List.SwipeActions>
                </List.Item>
              ))}
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};
