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
import { sfPersonCropCircleFill } from '@bradleyhodges/sfsymbols/sfPersonCropCircleFill';
import { sfPersonFill } from '@bradleyhodges/sfsymbols/sfPersonFill';
import { sfPinFill } from '@bradleyhodges/sfsymbols/sfPinFill';
import { sfSquareAndPencil } from '@bradleyhodges/sfsymbols/sfSquareAndPencil';
import { sfSunMax } from '@bradleyhodges/sfsymbols/sfSunMax';
import { sfSunMin } from '@bradleyhodges/sfsymbols/sfSunMin';
import { sfTagFill } from '@bradleyhodges/sfsymbols/sfTagFill';
import { sfTrashFill } from '@bradleyhodges/sfsymbols/sfTrashFill';
import { sfWifi } from '@bradleyhodges/sfsymbols/sfWifi';
import { Properties } from 'csstype';
import { styled } from 'goober';
import {
  Fragment,
  FunctionComponent,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Button,
  Calendar,
  DatePicker,
  DatePickerOpen,
  List,
  Menu,
  Segmented,
  Slider,
  Stepper,
  Switch,
  TextField,
  TimeRoll,
} from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { commonPropOptions, Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { SFSymbol } from '../utils/symbol.js';
import {
  forwardClick,
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
  propOptionsContent,
  propOptionsCursor,
  propOptionsEdit,
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
  propOptionsText,
} from './props.js';

// Figma “Row with Swipe Actions” colors: leading orange, gray, red;
// trailing purple, indigo, green.
const leadingActions = [
  ['Pin', sfPinFill, 'var(--color-ios-system-orange)'],
  ['Mute', sfBellFill, undefined],
  ['Delete', sfTrashFill, 'var(--color-ios-system-red)'],
] as const;

const trailingActions = [
  ['Tag', sfTagFill, 'var(--color-ios-system-purple)'],
  ['Mail', sfEnvelopeFill, 'var(--color-ios-system-indigo)'],
  ['Done', sfCheckmarkCircleFill, 'var(--color-ios-system-green)'],
] as const;

const selectionOptions = ['Automatic', 'Always', 'Never'] as const;

type Selection = (typeof selectionOptions)[number];

/**
 * A pop-up button: a menu of the options, its trigger a button (the chosen
 * option's label, then chevron.up.chevron.down), closing on choosing.
 */
const PopUp: FunctionComponent<{
  cursor?: Properties['cursor'];
  onValueChange: (value: Selection) => void;
  value: Selection;
}> = ({ cursor, onValueChange, value }) => (
  <Menu.Root>
    <Menu.Trigger render={<Button.Root cursor={cursor} />}>
      <Button.Label>{value}</Button.Label>
      <Button.Symbol>
        <SFSymbol icon={sfChevronUpChevronDown} />
      </Button.Symbol>
    </Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner align="end">
        <Menu.Popup>
          <Menu.RadioGroup
            value={value}
            onValueChange={(next: unknown) => onValueChange(next as Selection)}
          >
            {selectionOptions.map((option) => (
              <Menu.RadioItem
                key={option}
                // A pop-up closes on choosing (iOS).
                closeOnClick
                value={option}
              >
                <Menu.RadioItemIndicator />
                <Menu.Label>{option}</Menu.Label>
              </Menu.RadioItem>
            ))}
          </Menu.RadioGroup>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
);

/**
 * Lists: a settings-like inset grouped list (Figma “Lists and tables”) with
 * a switch, drill-ins, a pop-up (a menu, its trigger a button), an info button, a segmented control,
 * a stepper and a slider, a collapsible section (Base UI Collapsible),
 * buttons and a content block. Rows with a control pass their clicks on to
 * it (`onClick`).
 */
export const ListDemo: FunctionComponent = () => {
  const id = 'list';

  const [log, addLog] = useLog();

  const [
    externalContent,
    externalRoot,
    externalItem,
    externalCollapsible,
    externalTrigger,
  ] = useProvidedState(id);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    '[content]',
    externalContent,
    true,
  );

  const [controlRoot, propsRoot, stateRoot] = usePropControl(
    propOptionsRoot,
    'root',
    externalRoot,
    true,
  );

  const [controlItem, propsItem, stateItem] = usePropControl(
    propOptionsItemFirst,
    'item (1st)',
    externalItem,
    true,
  );

  const [
    controlCollapsible,
    propsCollapsible,
    stateCollapsible,
    RemounterCollapsible,
  ] = usePropControl(
    useMemo(() => getPropOptionsCollapsible(addLog), [addLog]),
    'collapsible',
    externalCollapsible,
  );

  const [controlTrigger, propsTrigger, stateTrigger] = usePropControl(
    propOptionsCursor,
    'collapsible trigger (header)',
    externalTrigger,
  );

  const [selection, setSelection] =
    useState<(typeof selectionOptions)[number]>('Automatic');
  const [favorite, setFavorite] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const image = (icon: Parameters<typeof SFSymbol>[0]['icon'], tint: string) =>
    content.image === 'none' ? null : (
      <List.Image
        variant={content.image}
        style={
          content.image === 'rounded' ? { backgroundColor: tint } : undefined
        }
      >
        <SFSymbol icon={icon} />
      </List.Image>
    );

  return (
    <Component
      stretch
      id={id}
      log={log}
      title="List"
      controls={[
        controlContent,
        controlRoot,
        controlItem,
        controlCollapsible,
        controlTrigger,
      ]}
      stateUrl={useCreateStateUrl(id, [
        stateContent,
        stateRoot,
        stateItem,
        stateCollapsible,
        stateTrigger,
      ])}
    >
      <List.Root {...propsRoot}>
        <List.Section>
          <List.Header>
            {content.supertitle ? (
              <List.Supertitle>Supertitle</List.Supertitle>
            ) : null}
            <List.Title render={<h3 />}>Header</List.Title>
            {content.headerSubtitle ? (
              <List.Subtitle>Subtitle</List.Subtitle>
            ) : null}
            <List.Accessory
              aria-label="Edit"
              render={<button type="button" />}
              onClick={() => addLog('header button clicked')}
            >
              <SFSymbol icon={sfSquareAndPencil} />
            </List.Accessory>
          </List.Header>
          <List.Group>
            <List.Item {...propsItem}>
              {image(sfAirplane, 'var(--color-ios-system-orange)')}
              <List.Title>Airplane Mode</List.Title>
              <Switch.Root
                aria-label="Airplane Mode"
                tint="var(--color-ios-system-orange)"
                onCheckedChange={(checked) =>
                  addLog(`airplane mode: ${checked}`)
                }
              >
                <Switch.Thumb />
              </Switch.Root>
            </List.Item>
            <List.Item>
              {image(sfWifi, 'var(--color-ios-system-blue)')}
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
              {image(sfBellFill, 'var(--color-ios-system-red)')}
              <List.Title
                render={<button />}
                onClick={() => addLog('Notifications clicked')}
              >
                Notifications
              </List.Title>
              <List.Subtitle>Banners, Sounds</List.Subtitle>
              <List.DrillIn />
            </List.Item>
            <List.Item onClick={forwardClick('[aria-haspopup]')}>
              {image(sfPersonFill, 'var(--color-ios-system-gray)')}
              <List.Title>Show Previews</List.Title>
              <PopUp
                value={selection}
                onValueChange={setSelection}
              />
            </List.Item>
            <List.Item
              onClick={({ target }) => {
                if (target instanceof Element && target.closest('button')) {
                  return;
                }
                addLog(`favorite: ${!favorite}`);
                setFavorite(!favorite);
              }}
            >
              {image(sfHeartFill, 'var(--color-ios-system-pink)')}
              <List.Title>Favorite</List.Title>
              <List.Accessory
                aria-label="Info"
                render={<button type="button" />}
                onClick={() => addLog('info clicked')}
              >
                <SFSymbol icon={sfICircle} />
              </List.Accessory>
              {favorite ? <List.Checkmark /> : null}
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
                defaultValue="medium"
                onValueChange={(value) => addLog(`text size: ${String(value)}`)}
              >
                <Segmented.Item value="small">S</Segmented.Item>
                <Segmented.Item value="medium">M</Segmented.Item>
                <Segmented.Item value="large">L</Segmented.Item>
                <Segmented.Highlight />
              </Segmented.Root>
            </List.Item>
            <List.Item>
              <List.Title>Quantity</List.Title>
              <List.Detail>{quantity}</List.Detail>
              <Stepper.Root
                max={10}
                min={0}
                value={quantity}
                onValueChange={(value) => {
                  addLog(`quantity: ${String(value)}`);
                  setQuantity(value ?? 0);
                }}
              >
                <Stepper.Group inputProps={{ 'aria-label': 'Quantity' }}>
                  <Stepper.Decrement />
                  <Stepper.Increment />
                </Stepper.Group>
              </Stepper.Root>
            </List.Item>
            <List.Item>
              <Slider.Root
                aria-label="Brightness"
                defaultValue={60}
                onValueCommitted={(value) =>
                  addLog(`brightness: ${String(value)}`)
                }
              >
                <Slider.Symbol edge="min">
                  <SFSymbol icon={sfSunMin} />
                </Slider.Symbol>
                <Slider.Control>
                  <Slider.Track>
                    <Slider.Indicator />
                    <Slider.Thumb />
                  </Slider.Track>
                </Slider.Control>
                <Slider.Symbol edge="max">
                  <SFSymbol icon={sfSunMax} />
                </Slider.Symbol>
              </Slider.Root>
            </List.Item>
          </List.Group>
          <List.Footer>Footer text, aligned with the rows’ text.</List.Footer>
        </List.Section>

        <RemounterCollapsible>
          <Collapsible.Root
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
              <List.Disclosure />
            </Collapsible.Trigger>
            <Collapsible.Panel render={<List.Group />}>
              {selectionOptions.map((option) => (
                <List.Item key={option}>
                  <List.Title
                    render={<button />}
                    onClick={() => setSelection(option)}
                  >
                    {option}
                  </List.Title>
                  {selection === option ? <List.Checkmark /> : null}
                </List.Item>
              ))}
            </Collapsible.Panel>
          </Collapsible.Root>
        </RemounterCollapsible>

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
 * Every part of a list, once, each with its props: a header, rows of each
 * kind, swipe actions, a collapsible section, a footer and a block (the
 * index: see “List (Index)”, selection: “List (Editing)”).
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
    externalPopUp,
    externalAction,
    externalButton,
    externalCheckbox,
    externalEditButton,
    externalGrabber,
    externalText,
    externalSwipeActions,
    externalSwipeAction,
    externalCollapsible,
    externalTrigger,
    externalPanel,
    externalDisclosure,
    externalFooter,
    externalBlock,
    externalExpandable,
  ] = useProvidedState(id);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsPartsContent,
    '[content]',
    externalContent,
    true,
  );
  const [controlRoot, propsRoot, stateRoot] = usePropControl(
    propOptionsRoot,
    'root',
    externalRoot,
  );
  const [controlSection, propsSection, stateSection] = usePropControl(
    commonPropOptions,
    'section',
    externalSection,
  );
  const [controlHeader, propsHeader, stateHeader] = usePropControl(
    propOptionsHeader,
    'header',
    externalHeader,
    true,
  );
  const [controlSupertitle, propsSupertitle, stateSupertitle] = usePropControl(
    commonPropOptions,
    'supertitle',
    externalSupertitle,
  );
  const [controlGroup, propsGroup, stateGroup] = usePropControl(
    commonPropOptions,
    'group',
    externalGroup,
  );
  const [controlItem, propsItem, stateItem] = usePropControl(
    useMemo(() => getPropOptionsItemFirst(addLog), [addLog]),
    'item (1st)',
    externalItem,
  );
  const [controlImage, propsImage, stateImage] = usePropControl(
    propOptionsImage,
    'image',
    externalImage,
  );
  const [controlTitle, propsTitle, stateTitle] = usePropControl(
    useMemo(() => getPropOptionsTitleFirst(addLog), [addLog]),
    'title (1st)',
    externalTitle,
  );
  const [controlSubtitle, propsSubtitle, stateSubtitle] = usePropControl(
    commonPropOptions,
    'subtitle',
    externalSubtitle,
  );
  const [controlDetail, propsDetail, stateDetail] = usePropControl(
    commonPropOptions,
    'detail',
    externalDetail,
  );
  const [controlDrillIn, propsDrillIn, stateDrillIn] = usePropControl(
    commonPropOptions,
    'drill-in',
    externalDrillIn,
  );
  const [controlAccessory, propsAccessory, stateAccessory] = usePropControl(
    useMemo(() => getPropOptionsAccessory(addLog), [addLog]),
    'accessory',
    externalAccessory,
  );
  const [controlCheckmark, propsCheckmark, stateCheckmark] = usePropControl(
    commonPropOptions,
    'checkmark',
    externalCheckmark,
  );
  const [controlPopUp, propsPopUp, statePopUp] = usePropControl(
    propOptionsCursor,
    'pop-up',
    externalPopUp,
  );
  const [controlAction, propsAction, stateAction] = usePropControl(
    useMemo(() => getPropOptionsAction(addLog), [addLog]),
    'action',
    externalAction,
  );
  const [controlButton, propsButton, stateButton] = usePropControl(
    useMemo(() => getPropOptionsButton(addLog), [addLog]),
    'button',
    externalButton,
  );
  const [controlCheckbox, propsCheckbox, stateCheckbox, RemounterCheckbox] =
    usePropControl(propOptionsCheckbox, 'checkbox', externalCheckbox);
  const [controlEditButton, propsEditButton, stateEditButton] = usePropControl(
    useMemo(() => getPropOptionsEditButton(addLog), [addLog]),
    'edit button',
    externalEditButton,
  );
  const [controlGrabber, propsGrabber, stateGrabber] = usePropControl(
    propOptionsCursor,
    'grabber',
    externalGrabber,
  );
  const [controlText, propsText, stateText] = usePropControl(
    propOptionsText,
    'text',
    externalText,
  );
  const [controlSwipeActions, propsSwipeActions, stateSwipeActions] =
    usePropControl(
      useMemo(() => getPropOptionsSwipeActionsTrailing(addLog), [addLog]),
      'swipe actions (trailing)',
      externalSwipeActions,
      true,
    );
  const [controlSwipeAction, propsSwipeAction, stateSwipeAction] =
    usePropControl(
      useMemo(() => getPropOptionsSwipeActionOutermost(addLog), [addLog]),
      'swipe action (outermost)',
      externalSwipeAction,
    );
  const [
    controlCollapsible,
    propsCollapsible,
    stateCollapsible,
    RemounterCollapsible,
  ] = usePropControl(
    propOptionsCollapsible,
    'collapsible',
    externalCollapsible,
  );
  const [controlTrigger, propsTrigger, stateTrigger] = usePropControl(
    propOptionsCursor,
    'collapsible trigger (header)',
    externalTrigger,
  );
  const [controlPanel, propsPanel, statePanel] = usePropControl(
    propOptionsPanel,
    'collapsible panel',
    externalPanel,
  );
  const [controlDisclosure, propsDisclosure, stateDisclosure] = usePropControl(
    commonPropOptions,
    'disclosure',
    externalDisclosure,
  );
  const [controlFooter, propsFooter, stateFooter] = usePropControl(
    commonPropOptions,
    'footer',
    externalFooter,
  );
  const [controlBlock, propsBlock, stateBlock] = usePropControl(
    propOptionsBlock,
    'block',
    externalBlock,
  );
  const [controlExpandable, propsExpandable, stateExpandable] = usePropControl(
    propOptionsExpandable,
    'expandable',
    externalExpandable,
  );
  // The expandable row, toggled by the row above (unless its control says).
  const [expanded, setExpanded] = useState(false);
  const open = propsExpandable.open ?? expanded;

  const [selection, setSelection] =
    useState<(typeof selectionOptions)[number]>('Automatic');

  return (
    <Component
      stretch
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
        controlPopUp,
        controlAction,
        controlButton,
        controlCheckbox,
        controlEditButton,
        controlGrabber,
        controlText,
        controlSwipeActions,
        controlSwipeAction,
        controlCollapsible,
        controlTrigger,
        controlPanel,
        controlDisclosure,
        controlFooter,
        controlBlock,
        controlExpandable,
      ]}
      stateUrl={useCreateStateUrl(id, [
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
        statePopUp,
        stateAction,
        stateButton,
        stateCheckbox,
        stateEditButton,
        stateGrabber,
        stateText,
        stateSwipeActions,
        stateSwipeAction,
        stateCollapsible,
        stateTrigger,
        statePanel,
        stateDisclosure,
        stateFooter,
        stateBlock,
        stateExpandable,
      ])}
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
              <SFSymbol icon={sfSquareAndPencil} />
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
                <SFSymbol icon={sfWifi} />
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
                <SFSymbol icon={sfICircle} />
              </List.Accessory>
              <List.Checkmark {...propsCheckmark} />
            </List.Item>
            {/* Rows with a single control pass their clicks on to it. */}
            <List.Item onClick={forwardClick('[aria-haspopup]')}>
              <List.Title>Pop-up</List.Title>
              <PopUp
                {...propsPopUp}
                value={selection}
                onValueChange={setSelection}
              />
            </List.Item>
            <List.Item onClick={forwardClick('[data-list-part=action]')}>
              <List.Title>Action</List.Title>
              <List.Action {...propsAction}>Action</List.Action>
            </List.Item>
            <List.Item>
              <List.Button {...propsButton}>Button</List.Button>
            </List.Item>
            <List.Item onClick={forwardClick('[role=checkbox]')}>
              <RemounterCheckbox>
                <List.Checkbox
                  aria-label="Checkbox"
                  {...propsCheckbox}
                />
              </RemounterCheckbox>
              <List.Title>Checkbox, grabber</List.Title>
              <List.Grabber
                aria-label="Reorder"
                {...propsGrabber}
              />
            </List.Item>
            <List.Item>
              <List.EditButton
                aria-label="Edit"
                {...propsEditButton}
              />
              <List.Title>Edit button</List.Title>
              <List.SwipeActions>
                <List.SwipeAction
                  label="Delete"
                  tint="var(--color-ios-system-red)"
                  onClick={() => addLog('delete clicked')}
                >
                  <SFSymbol icon={sfTrashFill} />
                </List.SwipeAction>
              </List.SwipeActions>
            </List.Item>
            <List.Item onClick={() => setExpanded(!open)}>
              <List.Title>Expandable row</List.Title>
              <List.Detail>{open ? 'Shown' : 'Hidden'}</List.Detail>
              <List.Disclosure data-panel-open={open || undefined} />
            </List.Item>
            <List.Expandable
              {...propsExpandable}
              open={open}
            >
              <List.Image variant="rounded">
                <SFSymbol icon={sfWifi} />
              </List.Image>
              <List.Title>Expanded</List.Title>
              <List.Subtitle>
                Shown below the row above, opening and closing in place.
              </List.Subtitle>
            </List.Expandable>
            <List.Item>
              <List.Image variant="circular">
                <SFSymbol icon={sfPersonCropCircleFill} />
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
                side="leading"
              >
                <List.SwipeAction
                  showLabel
                  label="Unread"
                  tint="var(--color-ios-system-blue)"
                  onClick={() => addLog('unread clicked')}
                >
                  <SFSymbol icon={sfEnvelopeOpenFill} />
                </List.SwipeAction>
              </List.SwipeActions>
              <List.SwipeActions {...propsSwipeActions}>
                <List.SwipeAction
                  showLabel
                  label="More"
                  onClick={() => addLog('more clicked')}
                >
                  <SFSymbol icon={sfEllipsis} />
                </List.SwipeAction>
                <List.SwipeAction
                  showLabel
                  label="Flag"
                  tint="var(--color-ios-system-orange)"
                  onClick={() => addLog('flag clicked')}
                >
                  <SFSymbol icon={sfFlagFill} />
                </List.SwipeAction>
                <List.SwipeAction {...propsSwipeAction}>
                  <SFSymbol icon={sfArchiveboxFill} />
                </List.SwipeAction>
              </List.SwipeActions>
            </List.Item>
          </List.Group>
          <List.Footer {...propsFooter}>
            Footer text, aligned with the rows’ text.
          </List.Footer>
        </List.Section>

        <RemounterCollapsible>
          <Collapsible.Root
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
              {selectionOptions.map((option) => (
                <List.Item key={option}>
                  <List.Title
                    render={<button />}
                    onClick={() => setSelection(option)}
                  >
                    {option}
                  </List.Title>
                  {selection === option ? <List.Checkmark /> : null}
                </List.Item>
              ))}
            </Collapsible.Panel>
          </Collapsible.Root>
        </RemounterCollapsible>

        <List.Section>
          <List.Block {...propsBlock}>
            <p>A content block, with text aligned with the rows’ text.</p>
          </List.Block>
        </List.Section>
      </List.Root>
    </Component>
  );
};

type SwipeRow = {
  /** Multi-line (with `Text`). */
  multiLine?: boolean;
  name: string;
  /** Each action's shape (by index), labels shown, text for symbols. */
  shape?: (index: number) => 'circle' | 'roundedRectangle';
  showLabel?: boolean;
  subtitle?: boolean;
  text?: boolean;
};

const swipeRows: readonly SwipeRow[] = [
  { name: 'Regular' },
  { name: 'Tall', subtitle: true },
  { multiLine: true, name: 'Multi-line', showLabel: true, subtitle: true },
  {
    multiLine: true,
    name: 'Rounded rectangles',
    shape: () => 'roundedRectangle',
    showLabel: true,
    subtitle: true,
  },
  // The outermost (Delete, Done) a rounded rectangle, the others circles.
  {
    name: 'Mixed',
    shape: (index) => (index === 2 ? 'roundedRectangle' : 'circle'),
    subtitle: true,
  },
  {
    name: 'Text',
    shape: () => 'roundedRectangle',
    subtitle: true,
    text: true,
  },
];

/**
 * Swipe actions (Figma “Row with Swipe Actions”): regular and tall rows
 * (circles), a multi-line row (labelled), rounded rectangles, both mixed,
 * and text instead of symbols; with actions on both sides, overswipeable
 * either way.
 */
export const ListSwipeDemo: FunctionComponent = () => {
  const id = 'list-swipe';

  const [log, addLog] = useLog();

  const [externalRoot, externalSwipeActions, externalSwipeAction] =
    useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot] = usePropControl(
    propOptionsRoot,
    'root',
    externalRoot,
  );

  const [controlSwipeActions, propsSwipeActions, stateSwipeActions] =
    usePropControl(
      useMemo(() => getPropOptionsSwipeActionsFirstLeading(addLog), [addLog]),
      'swipe actions (1st, leading)',
      externalSwipeActions,
      true,
    );

  const [controlSwipeAction, propsSwipeAction, stateSwipeAction] =
    usePropControl(
      useMemo(() => getPropOptionsSwipeActionFirst(addLog), [addLog]),
      'swipe action (1st)',
      externalSwipeAction,
    );

  const swipeActions = (
    side: 'leading' | 'trailing',
    actions: typeof leadingActions | typeof trailingActions,
    first: boolean,
    { shape, showLabel, text }: SwipeRow,
  ) => (
    <List.SwipeActions
      overswipe
      side={side}
      {...(first ? propsSwipeActions : {})}
    >
      {actions.map(([label, icon, tint], index) => {
        const props: Partial<typeof propsSwipeAction> =
          first && index === 0 ? propsSwipeAction : {};
        // The outermost, by side.
        const outer = side === 'leading' ? 2 - index : index;

        return (
          <List.SwipeAction
            key={label}
            shape={shape?.(outer)}
            showLabel={showLabel}
            onClick={() => addLog(`${label} clicked`)}
            {...props}
            label={props.label ?? label}
            tint={props.tint ?? tint}
          >
            {text ? label : <SFSymbol icon={icon} />}
          </List.SwipeAction>
        );
      })}
    </List.SwipeActions>
  );

  return (
    <Component
      stretch
      controls={[controlRoot, controlSwipeActions, controlSwipeAction]}
      id={id}
      log={log}
      title="List (Swipe Actions)"
      stateUrl={useCreateStateUrl(id, [
        stateRoot,
        stateSwipeActions,
        stateSwipeAction,
      ])}
    >
      <List.Root {...propsRoot}>
        <List.Section>
          <List.Group>
            {swipeRows.map((row, index) => (
              <List.Item key={row.name}>
                <List.Image
                  style={{ backgroundColor: 'var(--color-ios-system-blue)' }}
                  variant="rounded"
                >
                  <SFSymbol icon={sfEnvelopeFill} />
                </List.Image>
                <List.Title
                  render={<button />}
                  onClick={() => addLog(`${row.name} clicked`)}
                >
                  {row.name}
                </List.Title>
                {row.subtitle ? (
                  <List.Subtitle>Swipe either way</List.Subtitle>
                ) : null}
                {row.multiLine ? (
                  <List.Text>
                    Swipe on past the actions to trigger the outermost one, on
                    either side; let go before to keep them open.
                  </List.Text>
                ) : null}
                <List.Detail>Detail</List.Detail>
                <List.DrillIn />
                {swipeActions('leading', leadingActions, index === 0, row)}
                {swipeActions('trailing', trailingActions, false, row)}
              </List.Item>
            ))}
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

const planets = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter'] as const;

/**
 * Editing (UIKit `UITableView` editing): rows reorderable by their grabbers,
 * and, independently, a leading control: delete (opening the trailing
 * swipe actions), insert, or selecting several rows (checkboxes) or one (a
 * Base UI `RadioGroup` rendering the group, with radios).
 */
export const ListEditDemo: FunctionComponent = () => {
  const id = 'list-edit';

  const [log, addLog] = useLog();

  const [
    externalContent,
    externalRoot,
    externalCheckbox,
    externalRadioGroup,
    externalRadio,
    externalEditButton,
    externalGrabber,
  ] = useProvidedState(id);
  const [rows, setRows] = useState<readonly string[]>(planets);
  const added = useRef(0);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsEdit,
    '[content]',
    externalContent,
    true,
  );

  const [controlRoot, propsRoot, stateRoot] = usePropControl(
    propOptionsRoot,
    'root',
    externalRoot,
  );

  const [controlCheckbox, propsCheckbox, stateCheckbox, RemounterCheckbox] =
    usePropControl(
      useMemo(() => getPropOptionsCheckboxFirst(addLog), [addLog]),
      'checkbox (1st)',
      externalCheckbox,
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

  const [controlRadio, propsRadio, stateRadio] = usePropControl(
    propOptionsRadioFirst,
    'radio (1st)',
    externalRadio,
  );

  const [controlEditButton, propsEditButton, stateEditButton] = usePropControl(
    useMemo(() => getPropOptionsEditButtonFirst(addLog), [addLog]),
    'edit button (1st)',
    externalEditButton,
  );

  const [controlGrabber, propsGrabber, stateGrabber] = usePropControl(
    propOptionsCursor,
    'grabber (1st)',
    externalGrabber,
  );

  const prefix = (name: string, first: boolean) => {
    switch (content.prefix) {
      case 'multiple': {
        return first ? (
          <RemounterCheckbox>
            <List.Checkbox
              aria-label={name}
              {...propsCheckbox}
            />
          </RemounterCheckbox>
        ) : (
          <List.Checkbox aria-label={name} />
        );
      }

      case 'single': {
        return (
          <List.Radio
            aria-label={name}
            value={name}
            {...(first ? propsRadio : {})}
          />
        );
      }

      case 'delete':
      case 'delete + insert': {
        return (
          <List.EditButton
            aria-label={`Delete ${name}`}
            {...(first ? propsEditButton : {})}
          />
        );
      }

      case 'insert': {
        return (
          <List.EditButton
            aria-label={`Insert after ${name}`}
            editingStyle="insert"
            onClick={() => {
              added.current += 1;
              const row = `New ${added.current}`;
              addLog(`insert ${row}`);
              setRows((current) =>
                current.toSpliced(current.indexOf(name) + 1, 0, row),
              );
            }}
            {...(first ? propsEditButton : {})}
          />
        );
      }

      default: {
        return null;
      }
    }
  };

  const group = (
    <List.Group
      onReorder={(from, to) => {
        addLog(`reorder: ${from} → ${to}`);
        setRows((current) => {
          const next = [...current];
          const [moved] = next.splice(from, 1);
          // Not past the insert row.
          if (moved) next.splice(Math.min(to, next.length), 0, moved);
          return next;
        });
      }}
    >
      {rows.map((name, index) => (
        <List.Item key={name}>
          {prefix(name, index === 0)}
          <List.Title>{name}</List.Title>
          {content.reorder ? (
            <List.Grabber
              aria-label={`Reorder ${name}`}
              {...(index === 0 ? propsGrabber : {})}
            />
          ) : null}
          <List.SwipeActions overswipe>
            <List.SwipeAction
              label="Delete"
              tint="var(--color-ios-system-red)"
              onClick={() => {
                addLog(`delete ${name}`);
                setRows((current) => current.filter((row) => row !== name));
              }}
            >
              <SFSymbol icon={sfTrashFill} />
            </List.SwipeAction>
          </List.SwipeActions>
        </List.Item>
      ))}
      {content.prefix === 'delete + insert' ? (
        // UIKit: an insert row at the end, deleting the others.
        <List.Item>
          <List.EditButton
            aria-label="Add Planet"
            editingStyle="insert"
            onClick={() => {
              added.current += 1;
              const row = `New ${added.current}`;
              addLog(`insert ${row}`);
              setRows((current) => [...current, row]);
            }}
          />
          <List.Title>Add Planet</List.Title>
        </List.Item>
      ) : null}
    </List.Group>
  );

  return (
    <Component
      stretch
      id={id}
      log={log}
      title="List (Editing)"
      controls={[
        controlContent,
        controlRoot,
        controlCheckbox,
        controlRadioGroup,
        controlRadio,
        controlEditButton,
        controlGrabber,
      ]}
      stateUrl={useCreateStateUrl(id, [
        stateContent,
        stateRoot,
        stateCheckbox,
        stateRadioGroup,
        stateRadio,
        stateEditButton,
        stateGrabber,
      ])}
    >
      <List.Root {...propsRoot}>
        <List.Section>
          <List.Header prominence="nested">
            <List.Title>Planets</List.Title>
            <List.Action
              onClick={() => {
                addLog('reset');
                setRows(planets);
              }}
            >
              Reset
            </List.Action>
          </List.Header>
          {content.prefix === 'single' ? (
            <RemounterRadioGroup>
              <RadioGroup
                aria-label="Planet"
                {...propsRadioGroup}
                render={group}
              />
            </RemounterRadioGroup>
          ) : (
            group
          )}
        </List.Section>
      </List.Root>
    </Component>
  );
};

const events = {
  past: ['Design Review', 'Team Lunch', 'Release 1.2'],
  upcoming: ['Planning', 'Offsite', 'Release 1.3', 'Retrospective'],
} as const;

type EventsView = keyof typeof events;

/**
 * A full-width segmented control switching between two groups of rows (as
 * iOS apps switch views): the segments are radios (Base UI `RadioGroup`),
 * each controlling its group (`aria-controls`), the other one hidden.
 */
export const ListSegmentedDemo: FunctionComponent = () => {
  const id = 'list-segmented';

  const [log, addLog] = useLog();

  const [externalRoot] = useProvidedState(id);
  const [view, setView] = useState<EventsView>('upcoming');

  const [controlRoot, propsRoot, stateRoot] = usePropControl(
    propOptionsRoot,
    'root',
    externalRoot,
  );

  return (
    <Component
      stretch
      controls={[controlRoot]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [stateRoot])}
      title="List (Segmented)"
    >
      <List.Root {...propsRoot}>
        <List.Section>
          {/* Aligned with the groups' edges, not the rows' text. */}
          <List.Block style={{ marginBlockEnd: 16, paddingInline: 0 }}>
            <Segmented.Root
              aria-label="Events"
              value={view}
              onValueChange={(value) => {
                addLog(`view: ${String(value)}`);
                setView(value as EventsView);
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
          {(Object.keys(events) as EventsView[]).map((key) => (
            <List.Group
              key={key}
              aria-label={key === 'upcoming' ? 'Upcoming' : 'Past'}
              hidden={view !== key}
              id={`list-segmented-${key}`}
            >
              {events[key].map((name) => (
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
          ))}
        </List.Section>
      </List.Root>
    </Component>
  );
};

/**
 * A form (Framework7 list inputs): fields as rows, with inline labels, a
 * clear button while editing, a placeholder-only row, validation (an email
 * field's error shows once it's left invalid), dates and times picked in
 * expandable rows (`List.Expandable`), and a textarea.
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

  const [controlRoot, propsRoot, stateRoot] = usePropControl(
    propOptionsRoot,
    'root',
    externalRoot,
  );

  return (
    <Component
      stretch
      controls={[controlRoot]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [stateRoot])}
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
                defaultValue="Kate Bell"
                placeholder="Required"
                onValueChange={(value) => addLog(`name: ${value}`)}
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
          <List.Group>
            {(
              [
                ['starts', 'Starts', starts, setStarts],
                ['ends', 'Ends', ends, setEnds],
              ] as const
            ).map(([key, title, date, setDate]) => {
              const change = (next: Date) => {
                addLog(`${key}: ${next.toLocaleString()}`);
                setDate(next);
              };
              const opened = open?.[0] === key ? open[1] : null;

              // The date's and the time's buttons open their pickers in
              // expandable rows below (as iOS's Calendar), one at a time.
              return (
                <Fragment key={key}>
                  <List.Item>
                    <List.Title>{title}</List.Title>
                    <DatePicker
                      mode="dateAndTime"
                      open={opened}
                      popover={false}
                      value={date}
                      onValueChange={change}
                      onOpenChange={(next) =>
                        setOpen(next ? [key, next] : null)
                      }
                    />
                  </List.Item>
                  <List.Expandable open={opened === 'date'}>
                    <Calendar
                      value={date}
                      onValueChange={change}
                    />
                  </List.Expandable>
                  <List.Expandable open={opened === 'time'}>
                    <TimeRoll
                      value={date}
                      onValueChange={change}
                    />
                  </List.Expandable>
                </Fragment>
              );
            })}
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

const contacts = [
  'Aaron',
  'Abigail',
  'Adrian',
  'Bella',
  'Benjamin',
  'Chloe',
  'Daniel',
  'Dylan',
  'Ella',
  'Emma',
  'Felix',
  'Grace',
  'Hannah',
  'Henry',
  'Isaac',
  'Jack',
  'Julia',
  'Leo',
  'Lily',
  'Mia',
  'Noah',
  'Olivia',
  'Oscar',
  'Ruby',
  'Samuel',
  'Sophie',
  'Theo',
  'William',
  'Zoe',
];

const letters = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'];

// Keeps the index in view while the stage scrolls, centered, above the
// sticky headers.
const IndexSpace = styled('div')`
  position: absolute;
  z-index: 3;
  inset-block: 0;
  inset-inline-end: 0;
`;

// A line at the middle of the stage, the index centered on it (without a
// height, it never reaches the end of its space and moves while scrolling).
const StickyIndex = styled('div')`
  position: sticky;
  top: 50%;
  display: flex;
  height: 0;
  align-items: center;
`;

const Plain = styled('div')`
  position: relative;
`;

/**
 * An index list: a plain list with sticky section titles (Figma “Section
 * Title”, always nested) and an index (Figma “Index Bar”) jumping to them.
 */
export const ListIndexDemo: FunctionComponent = () => {
  const id = 'list-index';

  const [log, addLog] = useLog();

  const [externalRoot, externalHeader, externalIndex, externalIndexItem] =
    useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot] = usePropControl(
    propOptionsRootPlain,
    'root',
    externalRoot,
    true,
  );

  const [controlHeader, propsHeader, stateHeader] = usePropControl(
    commonPropOptions,
    'header',
    externalHeader,
  );

  const [controlIndex, propsIndex, stateIndex] = usePropControl(
    propOptionsIndex,
    'index',
    externalIndex,
    true,
  );

  const [controlIndexItem, propsIndexItem, stateIndexItem] = usePropControl(
    propOptionsCursor,
    'index item',
    externalIndexItem,
  );

  const listRef = useRef<HTMLElement>(null);

  const sections = useMemo(() => {
    const result = new Map<string, string[]>();
    for (const name of contacts) {
      const letter = name.charAt(0);
      result.set(letter, [...(result.get(letter) ?? []), name]);
    }
    return result;
  }, []);

  const jump = useCallback(
    (letter: string) => {
      addLog(`index: ${letter}`);

      // The nearest section at or after the letter.
      const target =
        sections.keys().find((key) => key.localeCompare(letter) >= 0) ??
        sections.keys().toArray().at(-1) ??
        '';
      const section = listRef.current?.querySelector(
        `[data-letter="${CSS.escape(target)}"]`,
      );
      section?.scrollIntoView({ block: 'start' });
    },
    [addLog, sections],
  );

  const rows = (names: string[]): ReactNode =>
    names.map((name) => (
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
            <SFSymbol icon={sfTrashFill} />
          </List.SwipeAction>
        </List.SwipeActions>
      </List.Item>
    ));

  return (
    <Component
      stretch
      controls={[controlRoot, controlHeader, controlIndex, controlIndexItem]}
      id={id}
      log={log}
      title="List (Index)"
      stateUrl={useCreateStateUrl(id, [
        stateRoot,
        stateHeader,
        stateIndex,
        stateIndexItem,
      ])}
    >
      <Plain>
        <List.Root
          ref={listRef}
          {...propsRoot}
        >
          {[...sections].map(([letter, names]) => (
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
              <List.Group>{rows(names)}</List.Group>
            </List.Section>
          ))}
        </List.Root>
        <IndexSpace>
          <StickyIndex>
            <List.Index
              aria-label="Index"
              {...propsIndex}
            >
              {letters.map((letter, index) => (
                <List.IndexItem
                  key={letter}
                  onClick={() => jump(letter)}
                  {...(index === 0 ? propsIndexItem : {})}
                >
                  {letter}
                </List.IndexItem>
              ))}
            </List.Index>
          </StickyIndex>
        </IndexSpace>
      </Plain>
    </Component>
  );
};

const messages = [
  {
    date: '09:41',
    from: 'Kate Bell',
    preview:
      'Hi! The photos from the weekend are finally in the shared album, have a look when you get a chance. Some of them turned out really well.',
    subject: 'Weekend photos',
  },
  {
    date: 'Yesterday',
    from: 'John Appleseed',
    preview:
      'Attached is the agenda for Thursday. Let me know if anything is missing before I send it to everyone else.',
    subject: 'Agenda for Thursday',
  },
  {
    date: 'Monday',
    from: 'Anna Haro',
    preview: 'Thanks, see you there!',
    subject: 'Re: Dinner',
  },
] as const;

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
    'root',
    externalRoot,
    true,
  );

  const [controlText, propsText, stateText] = usePropControl(
    propOptionsText,
    'text',
    externalText,
    true,
  );

  return (
    <Component
      stretch
      controls={[controlRoot, controlText]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [stateRoot, stateText])}
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
                    <SFSymbol icon={sfPersonCropCircleFill} />
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
                    side="leading"
                  >
                    <List.SwipeAction
                      showLabel
                      label="Unread"
                      tint="var(--color-ios-system-blue)"
                      onClick={() => addLog(`unread ${from}`)}
                    >
                      <SFSymbol icon={sfEnvelopeOpenFill} />
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
                      <SFSymbol icon={sfEllipsis} />
                    </List.SwipeAction>
                    <List.SwipeAction
                      showLabel
                      label="Flag"
                      tint="var(--color-ios-system-orange)"
                      onClick={() => addLog(`flag ${from}`)}
                    >
                      <SFSymbol icon={sfFlagFill} />
                    </List.SwipeAction>
                    <List.SwipeAction
                      showLabel
                      label="Archive"
                      tint="var(--color-ios-system-purple)"
                      onClick={() => addLog(`archived ${from}`)}
                    >
                      <SFSymbol icon={sfArchiveboxFill} />
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
