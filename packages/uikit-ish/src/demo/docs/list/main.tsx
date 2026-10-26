import './style.css';

import { Collapsible } from '@base-ui/react/collapsible';
import { RadioGroup } from '@base-ui/react/radio-group';
import { sfAirplane } from '@bradleyhodges/sfsymbols/sfAirplane';
import { sfArchiveboxFill } from '@bradleyhodges/sfsymbols/sfArchiveboxFill';
import { sfBellFill } from '@bradleyhodges/sfsymbols/sfBellFill';
import { sfCheckmarkCircleFill } from '@bradleyhodges/sfsymbols/sfCheckmarkCircleFill';
import { sfChevronUpChevronDown } from '@bradleyhodges/sfsymbols/sfChevronUpChevronDown';
import { sfEllipsis } from '@bradleyhodges/sfsymbols/sfEllipsis';
import { sfEnvelopeFill } from '@bradleyhodges/sfsymbols/sfEnvelopeFill';
import { sfEnvelopeOpenFill } from '@bradleyhodges/sfsymbols/sfEnvelopeOpenFill';
import { sfFlagFill } from '@bradleyhodges/sfsymbols/sfFlagFill';
import { sfHeartFill } from '@bradleyhodges/sfsymbols/sfHeartFill';
import { sfICircle } from '@bradleyhodges/sfsymbols/sfICircle';
import { sfMinus } from '@bradleyhodges/sfsymbols/sfMinus';
import { sfPersonCropCircleFill } from '@bradleyhodges/sfsymbols/sfPersonCropCircleFill';
import { sfPersonFill } from '@bradleyhodges/sfsymbols/sfPersonFill';
import { sfPinFill } from '@bradleyhodges/sfsymbols/sfPinFill';
import { sfPlus } from '@bradleyhodges/sfsymbols/sfPlus';
import { sfSquareAndPencil } from '@bradleyhodges/sfsymbols/sfSquareAndPencil';
import { sfSunMax } from '@bradleyhodges/sfsymbols/sfSunMax';
import { sfSunMin } from '@bradleyhodges/sfsymbols/sfSunMin';
import { sfTagFill } from '@bradleyhodges/sfsymbols/sfTagFill';
import { sfTrashFill } from '@bradleyhodges/sfsymbols/sfTrashFill';
import { sfWifi } from '@bradleyhodges/sfsymbols/sfWifi';
import { FunctionComponent, useMemo, useRef, useState } from 'react';

import {
  Button,
  DatePicker,
  DatePickerOpen,
  forwardClick,
  List,
  Menu,
  Segmented,
  Slider,
  Stepper,
  Switch,
  Symbol,
  TextField,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
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
  propOptionsExpandable,
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
 * Lists: a settings-like inset grouped list (Figma “Lists and tables”) with
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

  return (
    <Component
      hasInputGuards
      isStretched
      controls={[controlRoot, controlItem, controlCollapsible, controlTrigger]}
      id={id}
      log={log}
      state={[stateRoot, stateItem, stateCollapsible, stateTrigger]}
      title="List"
    >
      <List.Root {...propsRoot}>
        <List.Section>
          <List.Header>
            <List.Title render={<h3 />}>Header</List.Title>
            <List.Accessory
              aria-label="Edit"
              render={<button type="button" />}
              onClick={() => addLog('header button clicked')}
            >
              <Symbol icon={sfSquareAndPencil} />
            </List.Accessory>
          </List.Header>
          <List.Group>
            <List.Item {...propsItem}>
              <List.Image
                style={{ backgroundColor: 'var(--color-ios-system-orange)' }}
                variant="rounded"
              >
                <Symbol icon={sfAirplane} />
              </List.Image>
              <List.Title>Airplane Mode</List.Title>
              <Switch.Root
                aria-label="Airplane Mode"
                tint="var(--color-ios-system-orange)"
                onCheckedChange={(isChecked: boolean) =>
                  addLog(`airplane mode: ${isChecked}`)
                }
              >
                <Switch.Thumb />
              </Switch.Root>
            </List.Item>
            <List.Item>
              <List.Image
                style={{ backgroundColor: 'var(--color-ios-system-blue)' }}
                variant="rounded"
              >
                <Symbol icon={sfWifi} />
              </List.Image>
              <List.Title
                render={<button />}
                onClick={() => addLog('Wi-Fi clicked')}
              >
                Wi-Fi
              </List.Title>
              <List.Detail>Home</List.Detail>
              <List.DrillIn />
            </List.Item>
            <List.Item>
              <List.Image
                style={{ backgroundColor: 'var(--color-ios-system-red)' }}
                variant="rounded"
              >
                <Symbol icon={sfBellFill} />
              </List.Image>
              <List.Title
                render={<button />}
                onClick={() => addLog('Notifications clicked')}
              >
                Notifications
              </List.Title>
              <List.Subtitle>Banners, Sounds</List.Subtitle>
              <List.DrillIn />
            </List.Item>
            {/* A pop-up button (see “Menu (Pop-up Button)”): gray, in a
                row. */}
            <List.Item onClick={forwardClick('[aria-haspopup]')}>
              <List.Image
                style={{ backgroundColor: 'var(--color-ios-system-gray)' }}
                variant="rounded"
              >
                <Symbol icon={sfPersonFill} />
              </List.Image>
              <List.Title>Show Previews</List.Title>
              <Menu.Root>
                <Menu.Trigger
                  render={
                    <Button.Root tint="var(--color-ios-secondary-label)" />
                  }
                >
                  <Button.Label>{previews}</Button.Label>
                  <Button.Icon>
                    <Symbol icon={sfChevronUpChevronDown} />
                  </Button.Icon>
                </Menu.Trigger>
                <Menu.Portal>
                  <Menu.Positioner align="end">
                    <Menu.Popup>
                      <Menu.RadioGroup
                        value={previews}
                        onValueChange={(next: unknown) => {
                          addLog(`show previews: ${String(next)}`);
                          setPreviews(String(next));
                        }}
                      >
                        <Menu.RadioItem
                          closeOnClick
                          value="Automatic"
                        >
                          <Menu.RadioItemIndicator />
                          <Menu.Label>Automatic</Menu.Label>
                        </Menu.RadioItem>
                        <Menu.RadioItem
                          closeOnClick
                          value="Always"
                        >
                          <Menu.RadioItemIndicator />
                          <Menu.Label>Always</Menu.Label>
                        </Menu.RadioItem>
                        <Menu.RadioItem
                          closeOnClick
                          value="Never"
                        >
                          <Menu.RadioItemIndicator />
                          <Menu.Label>Never</Menu.Label>
                        </Menu.RadioItem>
                      </Menu.RadioGroup>
                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Portal>
              </Menu.Root>
            </List.Item>
            <List.Item
              onClick={({ target }) => {
                if (target instanceof Element && target.closest('button')) {
                  return;
                }
                addLog(`favorite: ${!isFavorite}`);
                setIsFavorite(!isFavorite);
              }}
            >
              <List.Image
                style={{ backgroundColor: 'var(--color-ios-system-pink)' }}
                variant="rounded"
              >
                <Symbol icon={sfHeartFill} />
              </List.Image>
              <List.Title>Favorite</List.Title>
              <List.Accessory
                aria-label="Info"
                render={<button type="button" />}
                onClick={() => addLog('info clicked')}
              >
                <Symbol icon={sfICircle} />
              </List.Accessory>
              {isFavorite ? <List.Checkmark /> : null}
            </List.Item>
            <List.Item onClick={forwardClick('[data-list-part=action]')}>
              <List.Title>Button</List.Title>
              <List.Action onClick={() => addLog('action clicked')}>
                Button
              </List.Action>
            </List.Item>
            <List.Item>
              <List.Title>Text Size</List.Title>
              <Segmented.Root
                aria-label="Text Size"
                defaultValue="M"
                onValueChange={(value: unknown) =>
                  addLog(`text size: ${String(value)}`)
                }
              >
                <Segmented.Item value="S">S</Segmented.Item>
                <Segmented.Item value="M">M</Segmented.Item>
                <Segmented.Item value="L">L</Segmented.Item>
                <Segmented.Highlight />
              </Segmented.Root>
            </List.Item>
            <List.Item>
              <List.Title>Quantity</List.Title>
              <List.Detail>{quantity}</List.Detail>
              <Stepper.Root
                value={quantity}
                onValueChange={(value: number | null) => {
                  addLog(`quantity: ${String(value)}`);
                  setQuantity(value ?? 0);
                }}
              >
                <Stepper.Group>
                  <Stepper.Input aria-label="Quantity" />
                  <Stepper.Decrement />
                  <Stepper.Increment />
                </Stepper.Group>
              </Stepper.Root>
            </List.Item>
            <List.Item>
              <Slider.Root
                defaultValue={60}
                onValueCommitted={(value: number | readonly number[]) =>
                  addLog(`brightness: ${String(value)}`)
                }
              >
                <Slider.Symbol edge="min">
                  <Symbol icon={sfSunMin} />
                </Slider.Symbol>
                <Slider.Control>
                  <Slider.Track>
                    <Slider.Indicator />
                    <Slider.Thumb aria-label="Brightness" />
                  </Slider.Track>
                </Slider.Control>
                <Slider.Symbol edge="max">
                  <Symbol icon={sfSunMax} />
                </Slider.Symbol>
              </Slider.Root>
            </List.Item>
          </List.Group>
          <List.Footer>Footer text, aligned with the rows’ text.</List.Footer>
        </List.Section>

        <Collapsible.Root
          key={keyCollapsible}
          {...propsCollapsible}
          render={<List.Section />}
        >
          <Collapsible.Trigger
            nativeButton={false}
            render={
              <List.Header
                prominence="nested"
                {...propsTrigger}
              />
            }
          >
            <List.Title>Collapsible</List.Title>
            <List.Detail>{previews}</List.Detail>
            <List.Disclosure />
          </Collapsible.Trigger>
          <Collapsible.Panel render={<List.Group />}>
            <List.Item>
              <List.Title
                render={<button />}
                onClick={() => setPreviews('Automatic')}
              >
                Automatic
              </List.Title>
              {previews === 'Automatic' ? <List.Checkmark /> : null}
            </List.Item>
            <List.Item>
              <List.Title
                render={<button />}
                onClick={() => setPreviews('Always')}
              >
                Always
              </List.Title>
              {previews === 'Always' ? <List.Checkmark /> : null}
            </List.Item>
            <List.Item>
              <List.Title
                render={<button />}
                onClick={() => setPreviews('Never')}
              >
                Never
              </List.Title>
              {previews === 'Never' ? <List.Checkmark /> : null}
            </List.Item>
          </Collapsible.Panel>
        </Collapsible.Root>

        <List.Section>
          <List.Group>
            <List.Item>
              <List.Button onClick={() => addLog('action clicked')}>
                Action
              </List.Button>
            </List.Item>
            <List.Item>
              <List.Button
                destructive
                onClick={() => addLog('destructive clicked')}
              >
                Action
              </List.Button>
            </List.Item>
            <List.Item>
              <List.Button disabled>Action</List.Button>
            </List.Item>
          </List.Group>
        </List.Section>

        <List.Section>
          <List.Header prominence="extraProminent">
            <List.Title render={<h3 />}>Content Block</List.Title>
          </List.Header>
          <List.Block strong>
            <p>
              Lists and tables present data in one or more columns of rows. A
              content block holds text between them, aligned with the rows.
            </p>
          </List.Block>
          <List.Footer>Blocks can have headers and footers, too.</List.Footer>
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
      ]}
    >
      <List.Root {...propsRoot}>
        <List.Section {...propsSection}>
          <List.Header {...propsHeader}>
            {content.supertitle ? (
              <List.Supertitle {...propsSupertitle}>Supertitle</List.Supertitle>
            ) : null}
            <List.Title render={<h3 />}>Header</List.Title>
            {content.headerSubtitle ? (
              <List.Subtitle>Subtitle</List.Subtitle>
            ) : null}
            <List.Accessory
              aria-label="Edit"
              render={<button type="button" />}
              onClick={() => addLog('header accessory clicked')}
            >
              <Symbol icon={sfSquareAndPencil} />
            </List.Accessory>
          </List.Header>
          <List.Group {...propsGroup}>
            <List.Item {...propsItem}>
              <List.Image
                {...propsImage}
                variant={propsImage.variant ?? 'rounded'}
                style={{
                  backgroundColor: 'var(--color-ios-system-blue)',
                  ...propsImage.style,
                }}
              >
                <Symbol icon={sfWifi} />
              </List.Image>
              <List.Title {...propsTitle}>Title</List.Title>
              <List.Subtitle {...propsSubtitle}>Subtitle</List.Subtitle>
              <List.Detail {...propsDetail}>Detail</List.Detail>
              <List.DrillIn {...propsDrillIn} />
            </List.Item>
            <List.Item>
              <List.Title>Accessory, checkmark</List.Title>
              <List.Accessory
                aria-label="Info"
                {...propsAccessory}
              >
                <Symbol icon={sfICircle} />
              </List.Accessory>
              <List.Checkmark {...propsCheckmark} />
            </List.Item>
            {/* Rows with a single control pass their clicks on to it. */}
            <List.Item onClick={forwardClick('[data-list-part=action]')}>
              <List.Title>Action</List.Title>
              <List.Action {...propsAction}>Action</List.Action>
            </List.Item>
            <List.Item>
              <List.Button {...propsButton}>Button</List.Button>
            </List.Item>
            <List.Item onClick={forwardClick('[role=checkbox]')}>
              <List.Checkbox
                key={keyCheckbox}
                aria-label="Checkbox"
                {...propsCheckbox}
              />
              <List.Title>Checkbox, grabber</List.Title>
              <List.Grabber
                aria-label="Reorder"
                {...propsGrabber}
              />
            </List.Item>
            <List.Item>
              <List.SwipeActionsTrigger
                {...propsSwipeActionsTrigger}
                render={
                  <List.EditButton
                    aria-label="Edit"
                    {...propsEditButton}
                  >
                    <Symbol icon={sfMinus} />
                  </List.EditButton>
                }
              />
              <List.Title>Edit button</List.Title>
              <List.SwipeActions>
                <List.SwipeAction
                  label="Delete"
                  tint="var(--color-ios-system-red)"
                  onClick={() => addLog('delete clicked')}
                >
                  <Symbol icon={sfTrashFill} />
                </List.SwipeAction>
              </List.SwipeActions>
            </List.Item>
            <List.Item>
              <List.Image variant="circular">
                <Symbol icon={sfPersonCropCircleFill} />
              </List.Image>
              <List.Title>Swipe actions</List.Title>
              <List.Detail>09:41</List.Detail>
              <List.Subtitle>Text, swipe actions</List.Subtitle>
              <List.Text {...propsText}>
                A multi-line row: body text below the title and subtitle, at
                most two lines by default. Swipe it either way.
              </List.Text>
              <List.SwipeActions
                overswipe
                side="inline-start"
              >
                <List.SwipeAction
                  showLabel
                  label="Unread"
                  tint="var(--color-ios-system-blue)"
                  onClick={() => addLog('unread clicked')}
                >
                  <Symbol icon={sfEnvelopeOpenFill} />
                </List.SwipeAction>
              </List.SwipeActions>
              <List.SwipeActions {...propsSwipeActions}>
                <List.SwipeAction
                  showLabel
                  label="More"
                  onClick={() => addLog('more clicked')}
                >
                  <Symbol icon={sfEllipsis} />
                </List.SwipeAction>
                <List.SwipeAction
                  showLabel
                  label="Flag"
                  tint="var(--color-ios-system-orange)"
                  onClick={() => addLog('flag clicked')}
                >
                  <Symbol icon={sfFlagFill} />
                </List.SwipeAction>
                <List.SwipeAction {...propsSwipeAction}>
                  <Symbol icon={sfArchiveboxFill} />
                </List.SwipeAction>
              </List.SwipeActions>
            </List.Item>
          </List.Group>
          <List.Footer {...propsFooter}>
            Footer text, aligned with the rows’ text.
          </List.Footer>
        </List.Section>

        <List.Section>
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
 * group the panel), and an expandable row (`List.Expandable`, toggled by
 * the row above it: `List.ExpandableRoot`, its title the trigger).
 */
export const ListCollapsibleDemo: FunctionComponent = () => {
  const id = 'list-collapsible';

  const [log, addLog] = useLog();
  const [
    externalCollapsible,
    externalTrigger,
    externalPanel,
    externalDisclosure,
    externalExpandable,
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
  const [controlExpandable, propsExpandable, stateExpandable] = usePropControl(
    propOptionsExpandable,
    { external: externalExpandable, isOpen: true, title: 'List.Expandable' },
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
        controlExpandable,
      ]}
      state={[
        stateCollapsible,
        stateTrigger,
        statePanel,
        stateDisclosure,
        stateExpandable,
      ]}
    >
      <List.Root>
        <Collapsible.Root
          key={keyCollapsible}
          {...propsCollapsible}
          render={<List.Section />}
        >
          <Collapsible.Trigger
            nativeButton={false}
            render={
              <List.Header
                prominence="nested"
                {...propsTrigger}
              />
            }
          >
            <List.Title>Collapsible</List.Title>
            <List.Detail>{selection}</List.Detail>
            <List.Disclosure {...propsDisclosure} />
          </Collapsible.Trigger>
          <Collapsible.Panel
            {...propsPanel}
            render={<List.Group />}
          >
            <List.Item>
              <List.Title
                render={<button />}
                onClick={() => setSelection('Automatic')}
              >
                Automatic
              </List.Title>
              {selection === 'Automatic' ? <List.Checkmark /> : null}
            </List.Item>
            <List.Item>
              <List.Title
                render={<button />}
                onClick={() => setSelection('Always')}
              >
                Always
              </List.Title>
              {selection === 'Always' ? <List.Checkmark /> : null}
            </List.Item>
            <List.Item>
              <List.Title
                render={<button />}
                onClick={() => setSelection('Never')}
              >
                Never
              </List.Title>
              {selection === 'Never' ? <List.Checkmark /> : null}
            </List.Item>
          </Collapsible.Panel>
        </Collapsible.Root>

        <List.Section>
          <List.Group>
            <List.ExpandableRoot
              onOpenChange={(isOpen: boolean) => addLog(`expanded: ${isOpen}`)}
            >
              <List.Item>
                <List.Title render={<List.ExpandableTrigger />}>
                  Expandable row
                </List.Title>
                <List.Disclosure />
              </List.Item>
              <List.Expandable {...propsExpandable}>
                <List.Image variant="rounded">
                  <Symbol icon={sfWifi} />
                </List.Image>
                <List.Title>Expanded</List.Title>
                <List.Subtitle>
                  Shown below the row above, opening and closing in place.
                </List.Subtitle>
              </List.Expandable>
            </List.ExpandableRoot>
            <List.Item>
              <List.Title>Below</List.Title>
            </List.Item>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/**
 * Swipe actions (Figma “Row with Swipe Actions”): regular and tall rows
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

  return (
    <Component
      isStretched
      controls={[controlRoot, controlSwipeActions, controlSwipeAction]}
      id={id}
      log={log}
      state={[stateRoot, stateSwipeActions, stateSwipeAction]}
      title="List (Swipe Actions)"
    >
      <List.Root {...propsRoot}>
        <List.Section>
          <List.Group>
            <List.Item>
              <List.Image
                style={{ backgroundColor: 'var(--color-ios-system-blue)' }}
                variant="rounded"
              >
                <Symbol icon={sfEnvelopeFill} />
              </List.Image>
              <List.Title
                render={<button />}
                onClick={() => addLog('Regular clicked')}
              >
                Regular
              </List.Title>
              <List.Detail>Detail</List.Detail>
              <List.DrillIn />
              <List.SwipeActions
                side="inline-start"
                {...propsSwipeActions}
              >
                <List.SwipeAction
                  {...propsSwipeAction}
                  label={propsSwipeAction.label ?? 'Pin'}
                  tint={
                    propsSwipeAction.tint ?? 'var(--color-ios-system-orange)'
                  }
                >
                  <Symbol icon={sfPinFill} />
                </List.SwipeAction>
                <List.SwipeAction
                  label="Mute"
                  onClick={() => addLog('Mute clicked')}
                >
                  <Symbol icon={sfBellFill} />
                </List.SwipeAction>
                <List.SwipeAction
                  label="Delete"
                  tint="var(--color-ios-system-red)"
                  onClick={() => addLog('Delete clicked')}
                >
                  <Symbol icon={sfTrashFill} />
                </List.SwipeAction>
              </List.SwipeActions>
              <List.SwipeActions overswipe>
                <List.SwipeAction
                  label="Tag"
                  tint="var(--color-ios-system-purple)"
                  onClick={() => addLog('Tag clicked')}
                >
                  <Symbol icon={sfTagFill} />
                </List.SwipeAction>
                <List.SwipeAction
                  label="Mail"
                  tint="var(--color-ios-system-indigo)"
                  onClick={() => addLog('Mail clicked')}
                >
                  <Symbol icon={sfEnvelopeFill} />
                </List.SwipeAction>
                <List.SwipeAction
                  label="Done"
                  tint="var(--color-ios-system-green)"
                  onClick={() => addLog('Done clicked')}
                >
                  <Symbol icon={sfCheckmarkCircleFill} />
                </List.SwipeAction>
              </List.SwipeActions>
            </List.Item>
            <List.Item>
              <List.Image
                style={{ backgroundColor: 'var(--color-ios-system-blue)' }}
                variant="rounded"
              >
                <Symbol icon={sfEnvelopeFill} />
              </List.Image>
              <List.Title
                render={<button />}
                onClick={() => addLog('Tall clicked')}
              >
                Tall
              </List.Title>
              <List.Subtitle>Swipe either way</List.Subtitle>
              <List.Detail>Detail</List.Detail>
              <List.DrillIn />
              <List.SwipeActions
                overswipe
                side="inline-start"
              >
                <List.SwipeAction
                  label="Pin"
                  tint="var(--color-ios-system-orange)"
                  onClick={() => addLog('Pin clicked')}
                >
                  <Symbol icon={sfPinFill} />
                </List.SwipeAction>
                <List.SwipeAction
                  label="Mute"
                  onClick={() => addLog('Mute clicked')}
                >
                  <Symbol icon={sfBellFill} />
                </List.SwipeAction>
                <List.SwipeAction
                  label="Delete"
                  tint="var(--color-ios-system-red)"
                  onClick={() => addLog('Delete clicked')}
                >
                  <Symbol icon={sfTrashFill} />
                </List.SwipeAction>
              </List.SwipeActions>
              <List.SwipeActions overswipe>
                <List.SwipeAction
                  label="Tag"
                  tint="var(--color-ios-system-purple)"
                  onClick={() => addLog('Tag clicked')}
                >
                  <Symbol icon={sfTagFill} />
                </List.SwipeAction>
                <List.SwipeAction
                  label="Mail"
                  tint="var(--color-ios-system-indigo)"
                  onClick={() => addLog('Mail clicked')}
                >
                  <Symbol icon={sfEnvelopeFill} />
                </List.SwipeAction>
                <List.SwipeAction
                  label="Done"
                  tint="var(--color-ios-system-green)"
                  onClick={() => addLog('Done clicked')}
                >
                  <Symbol icon={sfCheckmarkCircleFill} />
                </List.SwipeAction>
              </List.SwipeActions>
            </List.Item>
            <List.Item>
              <List.Image
                style={{ backgroundColor: 'var(--color-ios-system-blue)' }}
                variant="rounded"
              >
                <Symbol icon={sfEnvelopeFill} />
              </List.Image>
              <List.Title
                render={<button />}
                onClick={() => addLog('Multi-line clicked')}
              >
                Multi-line
              </List.Title>
              <List.Subtitle>Swipe either way</List.Subtitle>
              <List.Text>
                Swipe on past the actions to trigger the outermost one, on
                either side; let go before to keep them open.
              </List.Text>
              <List.Detail>Detail</List.Detail>
              <List.DrillIn />
              <List.SwipeActions
                overswipe
                side="inline-start"
              >
                <List.SwipeAction
                  showLabel
                  label="Pin"
                  tint="var(--color-ios-system-orange)"
                  onClick={() => addLog('Pin clicked')}
                >
                  <Symbol icon={sfPinFill} />
                </List.SwipeAction>
                <List.SwipeAction
                  showLabel
                  label="Mute"
                  onClick={() => addLog('Mute clicked')}
                >
                  <Symbol icon={sfBellFill} />
                </List.SwipeAction>
                <List.SwipeAction
                  showLabel
                  label="Delete"
                  tint="var(--color-ios-system-red)"
                  onClick={() => addLog('Delete clicked')}
                >
                  <Symbol icon={sfTrashFill} />
                </List.SwipeAction>
              </List.SwipeActions>
              <List.SwipeActions overswipe>
                <List.SwipeAction
                  showLabel
                  label="Tag"
                  tint="var(--color-ios-system-purple)"
                  onClick={() => addLog('Tag clicked')}
                >
                  <Symbol icon={sfTagFill} />
                </List.SwipeAction>
                <List.SwipeAction
                  showLabel
                  label="Mail"
                  tint="var(--color-ios-system-indigo)"
                  onClick={() => addLog('Mail clicked')}
                >
                  <Symbol icon={sfEnvelopeFill} />
                </List.SwipeAction>
                <List.SwipeAction
                  showLabel
                  label="Done"
                  tint="var(--color-ios-system-green)"
                  onClick={() => addLog('Done clicked')}
                >
                  <Symbol icon={sfCheckmarkCircleFill} />
                </List.SwipeAction>
              </List.SwipeActions>
            </List.Item>
            <List.Item>
              <List.Image
                style={{ backgroundColor: 'var(--color-ios-system-blue)' }}
                variant="rounded"
              >
                <Symbol icon={sfEnvelopeFill} />
              </List.Image>
              <List.Title
                render={<button />}
                onClick={() => addLog('Rounded rectangles clicked')}
              >
                Rounded rectangles
              </List.Title>
              <List.Subtitle>Swipe either way</List.Subtitle>
              <List.Text>
                Swipe on past the actions to trigger the outermost one, on
                either side; let go before to keep them open.
              </List.Text>
              <List.Detail>Detail</List.Detail>
              <List.DrillIn />
              <List.SwipeActions
                overswipe
                side="inline-start"
              >
                <List.SwipeAction
                  showLabel
                  label="Pin"
                  shape="roundedRectangle"
                  tint="var(--color-ios-system-orange)"
                  onClick={() => addLog('Pin clicked')}
                >
                  <Symbol icon={sfPinFill} />
                </List.SwipeAction>
                <List.SwipeAction
                  showLabel
                  label="Mute"
                  shape="roundedRectangle"
                  onClick={() => addLog('Mute clicked')}
                >
                  <Symbol icon={sfBellFill} />
                </List.SwipeAction>
                <List.SwipeAction
                  showLabel
                  label="Delete"
                  shape="roundedRectangle"
                  tint="var(--color-ios-system-red)"
                  onClick={() => addLog('Delete clicked')}
                >
                  <Symbol icon={sfTrashFill} />
                </List.SwipeAction>
              </List.SwipeActions>
              <List.SwipeActions overswipe>
                <List.SwipeAction
                  showLabel
                  label="Tag"
                  shape="roundedRectangle"
                  tint="var(--color-ios-system-purple)"
                  onClick={() => addLog('Tag clicked')}
                >
                  <Symbol icon={sfTagFill} />
                </List.SwipeAction>
                <List.SwipeAction
                  showLabel
                  label="Mail"
                  shape="roundedRectangle"
                  tint="var(--color-ios-system-indigo)"
                  onClick={() => addLog('Mail clicked')}
                >
                  <Symbol icon={sfEnvelopeFill} />
                </List.SwipeAction>
                <List.SwipeAction
                  showLabel
                  label="Done"
                  shape="roundedRectangle"
                  tint="var(--color-ios-system-green)"
                  onClick={() => addLog('Done clicked')}
                >
                  <Symbol icon={sfCheckmarkCircleFill} />
                </List.SwipeAction>
              </List.SwipeActions>
            </List.Item>
            {/* The outermost (Pin, Done) rounded rectangles, the others
               circles. */}
            <List.Item>
              <List.Image
                style={{ backgroundColor: 'var(--color-ios-system-blue)' }}
                variant="rounded"
              >
                <Symbol icon={sfEnvelopeFill} />
              </List.Image>
              <List.Title
                render={<button />}
                onClick={() => addLog('Mixed clicked')}
              >
                Mixed
              </List.Title>
              <List.Subtitle>Swipe either way</List.Subtitle>
              <List.Detail>Detail</List.Detail>
              <List.DrillIn />
              <List.SwipeActions
                overswipe
                side="inline-start"
              >
                <List.SwipeAction
                  label="Pin"
                  shape="roundedRectangle"
                  tint="var(--color-ios-system-orange)"
                  onClick={() => addLog('Pin clicked')}
                >
                  <Symbol icon={sfPinFill} />
                </List.SwipeAction>
                <List.SwipeAction
                  label="Mute"
                  shape="circle"
                  onClick={() => addLog('Mute clicked')}
                >
                  <Symbol icon={sfBellFill} />
                </List.SwipeAction>
                <List.SwipeAction
                  label="Delete"
                  shape="circle"
                  tint="var(--color-ios-system-red)"
                  onClick={() => addLog('Delete clicked')}
                >
                  <Symbol icon={sfTrashFill} />
                </List.SwipeAction>
              </List.SwipeActions>
              <List.SwipeActions overswipe>
                <List.SwipeAction
                  label="Tag"
                  shape="circle"
                  tint="var(--color-ios-system-purple)"
                  onClick={() => addLog('Tag clicked')}
                >
                  <Symbol icon={sfTagFill} />
                </List.SwipeAction>
                <List.SwipeAction
                  label="Mail"
                  shape="circle"
                  tint="var(--color-ios-system-indigo)"
                  onClick={() => addLog('Mail clicked')}
                >
                  <Symbol icon={sfEnvelopeFill} />
                </List.SwipeAction>
                <List.SwipeAction
                  label="Done"
                  shape="roundedRectangle"
                  tint="var(--color-ios-system-green)"
                  onClick={() => addLog('Done clicked')}
                >
                  <Symbol icon={sfCheckmarkCircleFill} />
                </List.SwipeAction>
              </List.SwipeActions>
            </List.Item>
            <List.Item>
              <List.Image
                style={{ backgroundColor: 'var(--color-ios-system-blue)' }}
                variant="rounded"
              >
                <Symbol icon={sfEnvelopeFill} />
              </List.Image>
              <List.Title
                render={<button />}
                onClick={() => addLog('Text clicked')}
              >
                Text
              </List.Title>
              <List.Subtitle>Swipe either way</List.Subtitle>
              <List.Detail>Detail</List.Detail>
              <List.DrillIn />
              <List.SwipeActions
                overswipe
                side="inline-start"
              >
                <List.SwipeAction
                  label="Pin"
                  shape="roundedRectangle"
                  tint="var(--color-ios-system-orange)"
                  onClick={() => addLog('Pin clicked')}
                >
                  Pin
                </List.SwipeAction>
                <List.SwipeAction
                  label="Mute"
                  shape="roundedRectangle"
                  onClick={() => addLog('Mute clicked')}
                >
                  Mute
                </List.SwipeAction>
                <List.SwipeAction
                  label="Delete"
                  shape="roundedRectangle"
                  tint="var(--color-ios-system-red)"
                  onClick={() => addLog('Delete clicked')}
                >
                  Delete
                </List.SwipeAction>
              </List.SwipeActions>
              <List.SwipeActions overswipe>
                <List.SwipeAction
                  label="Tag"
                  shape="roundedRectangle"
                  tint="var(--color-ios-system-purple)"
                  onClick={() => addLog('Tag clicked')}
                >
                  Tag
                </List.SwipeAction>
                <List.SwipeAction
                  label="Mail"
                  shape="roundedRectangle"
                  tint="var(--color-ios-system-indigo)"
                  onClick={() => addLog('Mail clicked')}
                >
                  Mail
                </List.SwipeAction>
                <List.SwipeAction
                  label="Done"
                  shape="roundedRectangle"
                  tint="var(--color-ios-system-green)"
                  onClick={() => addLog('Done clicked')}
                >
                  Done
                </List.SwipeAction>
              </List.SwipeActions>
            </List.Item>
          </List.Group>
          <List.Footer>
            Swipe a row to reveal its actions; swipe on past them to trigger the
            outermost.
          </List.Footer>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/**
 * Editing (UIKit `UITableView` editing): rows reordered by their grabbers
 * (the group's `onReorder`; the app reorders its rows), deleted by swiping.
 */
export const ListEditDemo: FunctionComponent = () => {
  const id = 'list-edit';

  const [log, addLog] = useLog();
  const [externalRoot, externalGrabber] = useProvidedState(id);

  const [rows, setRows] = useState<readonly string[]>(planets);

  const [controlRoot, propsRoot, stateRoot] = usePropControl(propOptionsRoot, {
    external: externalRoot,
    title: 'List.Root',
  });
  const [controlGrabber, propsGrabber, stateGrabber] = usePropControl(
    propOptionsCursor,
    { external: externalGrabber, isOpen: true, title: 'List.Grabber (1st)' },
  );

  return (
    <Component
      isStretched
      controls={[controlRoot, controlGrabber]}
      id={id}
      log={log}
      state={[stateRoot, stateGrabber]}
      title="List (Editing)"
    >
      <List.Root {...propsRoot}>
        <List.Section>
          <List.Header prominence="nested">
            <List.Title>Planets</List.Title>
            <List.Action onClick={() => setRows(planets)}>Reset</List.Action>
          </List.Header>
          <List.Group
            onReorder={(from, to) => {
              addLog(`reorder: ${from} → ${to}`);
              setRows((current) => {
                const next = [...current];
                const [moved] = next.splice(from, 1);
                if (moved) next.splice(to, 0, moved);
                return next;
              });
            }}
          >
            {rows.map((name, index) => (
              <List.Item key={name}>
                <List.Title>{name}</List.Title>
                <List.Grabber
                  aria-label={`Reorder ${name}`}
                  {...(index === 0 ? propsGrabber : {})}
                />
                <List.SwipeActions overswipe>
                  <List.SwipeAction
                    label="Delete"
                    tint="var(--color-ios-system-red)"
                    onClick={() => {
                      addLog(`delete ${name}`);
                      setRows((current) =>
                        current.filter((row) => row !== name),
                      );
                    }}
                  >
                    <Symbol icon={sfTrashFill} />
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
 * Deleting rows (UIKit editing style `.delete`): each row's edit button
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

  return (
    <Component
      isStretched
      controls={[controlRoot, controlEditButton]}
      id={id}
      log={log}
      state={[stateRoot, stateEditButton]}
      title="List (Editing: Delete)"
    >
      <List.Root {...propsRoot}>
        <List.Section>
          <List.Header prominence="nested">
            <List.Title>Planets</List.Title>
            <List.Action onClick={() => setRows(planets)}>Reset</List.Action>
          </List.Header>
          <List.Group>
            {rows.map((name, index) => (
              <List.Item key={name}>
                <List.SwipeActionsTrigger
                  render={
                    <List.EditButton
                      aria-label={`Delete ${name}`}
                      tint="var(--color-ios-system-red)"
                      {...(index === 0 ? propsEditButton : {})}
                    >
                      <Symbol icon={sfMinus} />
                    </List.EditButton>
                  }
                />
                <List.Title>{name}</List.Title>
                <List.SwipeActions overswipe>
                  <List.SwipeAction
                    label="Delete"
                    tint="var(--color-ios-system-red)"
                    onClick={() => {
                      addLog(`delete ${name}`);
                      setRows((current) =>
                        current.filter((row) => row !== name),
                      );
                    }}
                  >
                    <Symbol icon={sfTrashFill} />
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
 * Deleting rows, with an insert row at the end (UIKit: editing style
 * `.insert` on the last row).
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

  return (
    <Component
      isStretched
      controls={controlRoot}
      id={id}
      log={log}
      state={[stateRoot]}
      title="List (Editing: Insert)"
    >
      <List.Root {...propsRoot}>
        <List.Section>
          <List.Header prominence="nested">
            <List.Title>Planets</List.Title>
            <List.Action onClick={() => setRows(planets)}>Reset</List.Action>
          </List.Header>
          <List.Group>
            {rows.map((name) => (
              <List.Item key={name}>
                <List.SwipeActionsTrigger
                  render={
                    <List.EditButton
                      aria-label={`Delete ${name}`}
                      tint="var(--color-ios-system-red)"
                    >
                      <Symbol icon={sfMinus} />
                    </List.EditButton>
                  }
                />
                <List.Title>{name}</List.Title>
                <List.SwipeActions overswipe>
                  <List.SwipeAction
                    label="Delete"
                    tint="var(--color-ios-system-red)"
                    onClick={() => {
                      addLog(`delete ${name}`);
                      setRows((current) =>
                        current.filter((row) => row !== name),
                      );
                    }}
                  >
                    <Symbol icon={sfTrashFill} />
                  </List.SwipeAction>
                </List.SwipeActions>
              </List.Item>
            ))}
            <List.Item>
              <List.EditButton
                aria-label="Add Planet"
                tint="var(--color-ios-system-green)"
                onClick={() => {
                  added.current += 1;
                  const row = `New ${added.current}`;
                  addLog(`insert ${row}`);
                  setRows((current) => [...current, row]);
                }}
              >
                <Symbol icon={sfPlus} />
              </List.EditButton>
              <List.Title>Add Planet</List.Title>
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

  return (
    <Component
      isStretched
      controls={[controlRoot, controlCheckbox]}
      id={id}
      log={log}
      state={[stateRoot, stateCheckbox]}
      title="List (Editing: Select)"
    >
      <List.Root {...propsRoot}>
        <List.Section>
          <List.Header prominence="nested">
            <List.Title>Planets</List.Title>
          </List.Header>
          <List.Group>
            {planets.map((name, index) => (
              <List.Item
                key={name}
                onClick={forwardClick('[role=checkbox]')}
              >
                {index === 0 ? (
                  <List.Checkbox
                    key={keyCheckbox}
                    aria-label={name}
                    {...propsCheckbox}
                  />
                ) : (
                  <List.Checkbox aria-label={name} />
                )}
                <List.Title>{name}</List.Title>
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

  return (
    <Component
      isStretched
      controls={[controlRoot, controlRadioGroup, controlRadio]}
      id={id}
      log={log}
      state={[stateRoot, stateRadioGroup, stateRadio]}
      title="List (Editing: Select One)"
    >
      <List.Root {...propsRoot}>
        <List.Section>
          <List.Header prominence="nested">
            <List.Title>Planets</List.Title>
          </List.Header>
          <RadioGroup
            key={keyRadioGroup}
            aria-label="Planet"
            {...propsRadioGroup}
            render={
              <List.Group
                onReorder={(from, to) => {
                  addLog(`reorder: ${from} → ${to}`);
                  setRows((current) => {
                    const next = [...current];
                    const [moved] = next.splice(from, 1);
                    if (moved) next.splice(to, 0, moved);
                    return next;
                  });
                }}
              />
            }
          >
            {rows.map((name, index) => (
              <List.Item
                key={name}
                onClick={forwardClick('[role=radio]')}
              >
                <List.Radio
                  aria-label={name}
                  value={name}
                  {...(index === 0 ? propsRadio : {})}
                />
                <List.Title>{name}</List.Title>
                <List.Grabber aria-label={`Reorder ${name}`} />
              </List.Item>
            ))}
          </RadioGroup>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/**
 * A full-width segmented control switching between two groups of rows (as
 * iOS apps switch views): the segments are radios (Base UI `RadioGroup`),
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

  return (
    <Component
      isStretched
      controls={controlRoot}
      id={id}
      log={log}
      state={[stateRoot]}
      title="List (Segmented)"
    >
      <List.Root {...propsRoot}>
        <List.Section>
          {/* Aligned with the groups' edges, not the rows' text. */}
          <List.Block style={{ marginBlockEnd: 16, paddingInline: 0 }}>
            <Segmented.Root
              aria-label="Events"
              value={view}
              onValueChange={(value: unknown) => {
                addLog(`view: ${String(value)}`);
                setView(String(value));
              }}
            >
              <Segmented.Item
                aria-controls="list-segmented-upcoming"
                value="upcoming"
              >
                Upcoming
              </Segmented.Item>
              <Segmented.Item
                aria-controls="list-segmented-past"
                value="past"
              >
                Past
              </Segmented.Item>
              <Segmented.Highlight />
            </Segmented.Root>
          </List.Block>
          <List.Group
            aria-label="Upcoming"
            hidden={view !== 'upcoming'}
            id="list-segmented-upcoming"
          >
            {['Planning', 'Offsite', 'Release 1.3', 'Retrospective'].map(
              (name) => (
                <List.Item key={name}>
                  <List.Title
                    render={<button />}
                    onClick={() => addLog(`${name} clicked`)}
                  >
                    {name}
                  </List.Title>
                  <List.DrillIn />
                </List.Item>
              ),
            )}
          </List.Group>
          <List.Group
            aria-label="Past"
            hidden={view !== 'past'}
            id="list-segmented-past"
          >
            {['Design Review', 'Team Lunch', 'Release 1.2'].map((name) => (
              <List.Item key={name}>
                <List.Title
                  render={<button />}
                  onClick={() => addLog(`${name} clicked`)}
                >
                  {name}
                </List.Title>
                <List.DrillIn />
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
 * expandable rows (`List.Expandable`, one picker at a time), and a
 * textarea.
 */
export const ListFormDemo: FunctionComponent = () => {
  const id = 'list-form';

  const [log, addLog] = useLog();
  const [externalRoot] = useProvidedState(id);

  const [starts, setStarts] = useState(() => new Date(2025, 3, 20, 9, 41));
  const [ends, setEnds] = useState(() => new Date(2025, 3, 21, 18, 0));
  // The open picker: of which row, the date's or the time's.
  const [open, setOpen] = useState<
    readonly ['ends' | 'starts', DatePickerOpen] | null
  >(null);

  const [controlRoot, propsRoot, stateRoot] = usePropControl(propOptionsRoot, {
    external: externalRoot,
    title: 'List.Root',
  });

  const startsOpen = open?.[0] === 'starts' ? open[1] : null;
  const endsOpen = open?.[0] === 'ends' ? open[1] : null;

  return (
    <Component
      isStretched
      controls={controlRoot}
      id={id}
      log={log}
      state={[stateRoot]}
      title="List (Form)"
    >
      <List.Root {...propsRoot}>
        <List.Section>
          <List.Header prominence="nested">
            <List.Title>Contact</List.Title>
          </List.Header>
          <List.Group>
            <TextField.Root render={<List.Item />}>
              <TextField.Label>Name</TextField.Label>
              <TextField.Control
                autoComplete="name"
                defaultValue="Kate Bell"
                placeholder="Required"
                onValueChange={(value: string) => addLog(`name: ${value}`)}
              />
              <TextField.Clear />
            </TextField.Root>
            <TextField.Root
              render={<List.Item />}
              validationMode="onBlur"
            >
              <TextField.Label>Email</TextField.Label>
              <TextField.Control
                placeholder="name@example.com"
                type="email"
              />
              <TextField.Clear />
              <TextField.Description>
                Used for receipts only.
              </TextField.Description>
              <TextField.Error match="typeMismatch">
                Not an email address.
              </TextField.Error>
            </TextField.Root>
            <TextField.Root render={<List.Item />}>
              <TextField.Control
                aria-label="Company"
                placeholder="Company"
              />
              <TextField.Clear />
            </TextField.Root>
          </List.Group>
        </List.Section>
        <List.Section>
          <List.Header prominence="nested">
            <List.Title>Event</List.Title>
          </List.Header>
          {/* The date's and the time's buttons open their pickers in
              expandable rows below (as iOS's Calendar). */}
          <List.Group>
            <List.Item>
              <List.Title>Starts</List.Title>
              <DatePicker.Root
                mode="dateAndTime"
                open={startsOpen}
                popover={false}
                value={starts}
                onOpenChange={(next) => setOpen(next ? ['starts', next] : null)}
                onValueChange={(next: Date) => {
                  addLog(`starts: ${next.toLocaleString()}`);
                  setStarts(next);
                }}
              />
            </List.Item>
            <List.Expandable open={startsOpen === 'date'}>
              <DatePicker.Calendar
                value={starts}
                onValueChange={setStarts}
              />
            </List.Expandable>
            <List.Expandable open={startsOpen === 'time'}>
              <DatePicker.TimeRoll
                value={starts}
                onValueChange={setStarts}
              />
            </List.Expandable>
            <List.Item>
              <List.Title>Ends</List.Title>
              <DatePicker.Root
                mode="dateAndTime"
                open={endsOpen}
                popover={false}
                value={ends}
                onOpenChange={(next) => setOpen(next ? ['ends', next] : null)}
                onValueChange={(next: Date) => {
                  addLog(`ends: ${next.toLocaleString()}`);
                  setEnds(next);
                }}
              />
            </List.Item>
            <List.Expandable open={endsOpen === 'date'}>
              <DatePicker.Calendar
                value={ends}
                onValueChange={setEnds}
              />
            </List.Expandable>
            <List.Expandable open={endsOpen === 'time'}>
              <DatePicker.TimeRoll
                value={ends}
                onValueChange={setEnds}
              />
            </List.Expandable>
          </List.Group>
        </List.Section>
        <List.Section>
          <List.Header prominence="nested">
            <List.Title>Notes</List.Title>
          </List.Header>
          <List.Group>
            <TextField.Root render={<List.Item />}>
              <TextField.Control
                aria-label="Notes"
                placeholder="Anything else?"
                render={<textarea />}
              />
            </TextField.Root>
          </List.Group>
          <List.Footer>Fields as list rows, after Framework7.</List.Footer>
        </List.Section>
      </List.Root>
    </Component>
  );
};

// Contacts by their initial (the index's sections).

/**
 * An index list: a plain list with sticky section titles (Figma “Section
 * Title”, always nested) and an index (Figma “Index Bar”) jumping to them.
 */
export const ListIndexDemo: FunctionComponent = () => {
  const id = 'list-index';

  const [log, addLog] = useLog();
  const [externalRoot, externalHeader, externalIndex, externalIndexItem] =
    useProvidedState(id);

  const listRef = useRef<HTMLDivElement>(null);

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

  return (
    <Component
      isStretched
      controls={[controlRoot, controlHeader, controlIndex, controlIndexItem]}
      id={id}
      log={log}
      state={[stateRoot, stateHeader, stateIndex, stateIndexItem]}
      title="List (Index)"
    >
      <div className="list-demo-plain">
        <div
          ref={listRef}
          className="list-demo-scroll"
        >
          <List.Root {...propsRoot}>
            {Object.entries(contacts).map(([letter, names]) => (
              <List.Section
                key={letter}
                data-letter={letter}
              >
                <List.Header
                  prominence="nested"
                  {...propsHeader}
                >
                  <List.Title>{letter}</List.Title>
                </List.Header>
                <List.Group>
                  {names.map((name) => (
                    <List.Item key={name}>
                      <List.Title
                        render={<button />}
                        onClick={() => addLog(`${name} clicked`)}
                      >
                        {name}
                      </List.Title>
                      <List.SwipeActions overswipe>
                        <List.SwipeAction
                          label="Delete"
                          tint="var(--color-ios-system-red)"
                          onClick={() => addLog(`delete ${name}`)}
                        >
                          <Symbol icon={sfTrashFill} />
                        </List.SwipeAction>
                      </List.SwipeActions>
                    </List.Item>
                  ))}
                </List.Group>
              </List.Section>
            ))}
          </List.Root>
        </div>
        {/* At the list's edge, centered on its visible height (not
            scrolling with it), above the sticky headers. */}
        <div className="list-demo-index">
          <List.Index {...propsIndex}>
            {[...'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'].map((letter, index) => (
              <List.IndexItem
                key={letter}
                onClick={() => {
                  addLog(`index: ${letter}`);
                  // The nearest section at or after the letter.
                  const target =
                    Object.keys(contacts).find(
                      (key) => key.localeCompare(letter) >= 0,
                    ) ?? 'Z';
                  const { current: list } = listRef;
                  const section = list?.querySelector(
                    `[data-letter="${CSS.escape(target)}"]`,
                  );
                  if (!list || !section) return;
                  // The section at the top of the list (its own scroll
                  // container; the page stays).
                  list.scrollTo({
                    top:
                      list.scrollTop +
                      section.getBoundingClientRect().top -
                      list.getBoundingClientRect().top,
                  });
                }}
                {...(index === 0 ? propsIndexItem : {})}
              >
                {letter}
              </List.IndexItem>
            ))}
          </List.Index>
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

  return (
    <Component
      isStretched
      controls={[controlRoot, controlText]}
      id={id}
      log={log}
      state={[stateRoot, stateText]}
      title="List (Mail)"
    >
      <List.Root {...propsRoot}>
        <List.Section>
          <List.Group>
            {messages
              .filter(({ from }) => !archived.includes(from))
              .map(({ date, from, preview, subject }) => (
                <List.Item key={from}>
                  <List.Image variant="circular">
                    <Symbol icon={sfPersonCropCircleFill} />
                  </List.Image>
                  <List.Title
                    render={<button />}
                    onClick={() => addLog(`${from} clicked`)}
                  >
                    {from}
                  </List.Title>
                  <List.Detail>{date}</List.Detail>
                  <List.DrillIn />
                  <List.Subtitle>{subject}</List.Subtitle>
                  <List.Text {...propsText}>{preview}</List.Text>
                  <List.SwipeActions
                    overswipe
                    side="inline-start"
                  >
                    <List.SwipeAction
                      showLabel
                      label="Unread"
                      tint="var(--color-ios-system-blue)"
                      onClick={() => addLog(`unread ${from}`)}
                    >
                      <Symbol icon={sfEnvelopeOpenFill} />
                    </List.SwipeAction>
                  </List.SwipeActions>
                  <List.SwipeActions
                    onOverswipe={() => {
                      addLog(`archived ${from} (overswipe)`);
                      setArchived((current) => [...current, from]);
                    }}
                  >
                    <List.SwipeAction
                      showLabel
                      label="More"
                      onClick={() => addLog(`more ${from}`)}
                    >
                      <Symbol icon={sfEllipsis} />
                    </List.SwipeAction>
                    <List.SwipeAction
                      showLabel
                      label="Flag"
                      tint="var(--color-ios-system-orange)"
                      onClick={() => addLog(`flag ${from}`)}
                    >
                      <Symbol icon={sfFlagFill} />
                    </List.SwipeAction>
                    <List.SwipeAction
                      showLabel
                      label="Archive"
                      tint="var(--color-ios-system-purple)"
                      onClick={() => addLog(`archived ${from}`)}
                    >
                      <Symbol icon={sfArchiveboxFill} />
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
