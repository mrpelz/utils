import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { Collapsible } from '@base-ui/react/collapsible';
import { sfAirplane } from '@bradleyhodges/sfsymbols/sfAirplane';
import { sfBellFill } from '@bradleyhodges/sfsymbols/sfBellFill';
import { sfCheckmarkCircleFill } from '@bradleyhodges/sfsymbols/sfCheckmarkCircleFill';
import { sfEnvelopeFill } from '@bradleyhodges/sfsymbols/sfEnvelopeFill';
import { sfHeartFill } from '@bradleyhodges/sfsymbols/sfHeartFill';
import { sfICircle } from '@bradleyhodges/sfsymbols/sfICircle';
import { sfPersonFill } from '@bradleyhodges/sfsymbols/sfPersonFill';
import { sfPinFill } from '@bradleyhodges/sfsymbols/sfPinFill';
import { sfSquareAndPencil } from '@bradleyhodges/sfsymbols/sfSquareAndPencil';
import { sfTagFill } from '@bradleyhodges/sfsymbols/sfTagFill';
import { sfTrashFill } from '@bradleyhodges/sfsymbols/sfTrashFill';
import { sfWifi } from '@bradleyhodges/sfsymbols/sfWifi';
import { styled } from 'goober';
import {
  FunctionComponent,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

import { List, Menu, Switch } from '../components/index.js';
import {
  commonPropOptions,
  Component,
  MappedProp,
  useLog,
  usePropControl,
} from './utils/main.js';
import { SFSymbol } from './utils/symbol.js';

const cursorOptions = [undefined, 'auto', 'pointer', 'copy'] as const;

const propOptionsContent = {
  editing: ['none', 'select', 'delete', 'insert'] as const,
  image: ['rounded', 'symbol', 'circular', 'fill', 'none'] as const,
  supertitle: [false, true] as const,
  headerSubtitle: [false, true] as const,
} as const;

const propOptionsRoot = {
  ...commonPropOptions,
  listStyle: [undefined, 'insetGrouped', 'grouped', 'plain'] as const,
};

const propOptionsHeader = {
  ...commonPropOptions,
  prominence: [undefined, 'nested', 'prominent', 'extraProminent'] as const,
};

const propOptionsImage = {
  ...commonPropOptions,
  variant: [undefined, 'symbol', 'rounded', 'circular', 'fill'] as const,
};

const propOptionsBlock = {
  ...commonPropOptions,
  strong: [true, false, undefined] as const,
};

const propOptionsCheckbox = {
  ...commonPropOptions,
  defaultChecked: [undefined, false, true] as const,
  checked: [undefined, false, true] as const,
  disabled: [undefined, false, true] as const,
  readOnly: [undefined, false, true] as const,
  cursor: cursorOptions,
};

// Rendered as list parts, so without the common `render` option.
const { className, style } = commonPropOptions;

const propOptionsCollapsible = {
  className,
  style,
  defaultOpen: [true, false, undefined] as const,
  open: [undefined, false, true] as const,
  disabled: [undefined, false, true] as const,
};

const propOptionsPanel = {
  className,
  style,
  hiddenUntilFound: [undefined, false, true] as const,
};

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

/**
 * Lists: a settings-like inset grouped list with every part (Figma “Lists
 * and tables”), headers, footers, a content block, swipe actions, a
 * collapsible section (Base UI Collapsible), a pop-up (Menu) and a switch.
 */
export const ListDemo: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [controlContent, content] = usePropControl(
    propOptionsContent,
    '[content]',
    true,
  );

  const [controlRoot, propsRoot] = usePropControl(
    propOptionsRoot,
    'root',
    true,
  );
  const [controlSection, propsSection] = usePropControl(
    commonPropOptions,
    'section (1st)',
  );
  const [controlHeader, propsHeader] = usePropControl(
    propOptionsHeader,
    'header (1st)',
    true,
  );
  const [controlSupertitle, propsSupertitle] = usePropControl(
    commonPropOptions,
    'supertitle',
  );
  const [controlGroup, propsGroup] = usePropControl(
    commonPropOptions,
    'group (1st)',
  );
  const [controlItem, propsItem] = usePropControl(
    commonPropOptions,
    'item (1st)',
  );
  const [controlImage, propsImage] = usePropControl(
    propOptionsImage,
    'image (1st)',
  );

  const [controlTitle, propsTitle] = usePropControl(
    useMemo(
      () => ({
        ...commonPropOptions,
        cursor: cursorOptions,
        onClick: [
          new MappedProp(() => addLog('title clicked'), '[log click]'),
          undefined,
        ] as const,
        render: [
          new MappedProp(<button />, '[<button />]'),
          undefined,
          new MappedProp(<a href="#list" />, '[<a href="#list" />]'),
          new MappedProp(<main />, '[<main />]'),
        ] as const,
      }),
      [addLog],
    ),
    'title (2nd)',
  );

  const [controlSubtitle, propsSubtitle] = usePropControl(
    commonPropOptions,
    'subtitle (1st)',
  );
  const [controlDetail, propsDetail] = usePropControl(
    commonPropOptions,
    'detail (1st)',
  );
  const [controlDrillIn, propsDrillIn] = usePropControl(
    commonPropOptions,
    'drill-in (1st)',
  );

  const [controlAccessory, propsAccessory] = usePropControl(
    useMemo(
      () => ({
        ...commonPropOptions,
        cursor: cursorOptions,
        onClick: [
          new MappedProp(() => addLog('accessory clicked'), '[log click]'),
          undefined,
        ] as const,
        render: [
          new MappedProp(<button type="button" />, '[<button />]'),
          undefined,
          new MappedProp(<main />, '[<main />]'),
        ] as const,
      }),
      [addLog],
    ),
    'accessory (1st)',
  );

  const [controlCheckmark, propsCheckmark] = usePropControl(
    commonPropOptions,
    'checkmark',
  );

  const [controlPopUp, propsPopUp] = usePropControl(
    useMemo(() => ({ ...commonPropOptions, cursor: cursorOptions }), []),
    'pop-up',
  );

  const [controlAction, propsAction] = usePropControl(
    useMemo(
      () => ({
        ...commonPropOptions,
        cursor: cursorOptions,
        disabled: [undefined, false, true] as const,
        onClick: [
          new MappedProp(() => addLog('action clicked'), '[log click]'),
          undefined,
        ] as const,
      }),
      [addLog],
    ),
    'action',
  );

  const [controlSwipeActions, propsSwipeActions] = usePropControl(
    useMemo(
      () => ({
        ...commonPropOptions,
        overswipe: [true, false, undefined] as const,
      }),
      [],
    ),
    'swipe actions (1st, leading)',
  );

  const [controlSwipeAction, propsSwipeAction] = usePropControl(
    useMemo(
      () => ({
        ...commonPropOptions,
        cursor: cursorOptions,
        disabled: [undefined, false, true] as const,
        label: [undefined, 'Custom'] as const,
        tint: [undefined, 'var(--color-ios-system-teal)', '#000'] as const,
        onClick: [
          new MappedProp(() => addLog('swipe action clicked'), '[log click]'),
          undefined,
        ] as const,
      }),
      [addLog],
    ),
    'swipe action (1st)',
  );

  const [controlCheckbox, propsCheckbox, RemounterCheckbox] = usePropControl(
    useMemo(
      () => ({
        ...propOptionsCheckbox,
        onCheckedChange: [
          new MappedProp(
            (
              checked: boolean,
              { reason }: BaseCheckbox.Root.ChangeEventDetails,
            ) => addLog(`checked change: ${checked}/${reason}`),
            '[log change]',
          ),
          undefined,
        ] as const,
      }),
      [addLog],
    ),
    'checkbox (1st)',
  );

  const [controlEditButton, propsEditButton] = usePropControl(
    useMemo(
      () => ({
        ...commonPropOptions,
        cursor: cursorOptions,
        disabled: [undefined, false, true] as const,
        onClick: [
          new MappedProp(() => addLog('edit button clicked'), '[log click]'),
          undefined,
        ] as const,
      }),
      [addLog],
    ),
    'edit button (1st)',
  );

  const [controlGrabber, propsGrabber] = usePropControl(
    useMemo(() => ({ ...commonPropOptions, cursor: cursorOptions }), []),
    'grabber (1st)',
  );

  const [controlCollapsible, propsCollapsible, RemounterCollapsible] =
    usePropControl(
      useMemo(
        () => ({
          ...propOptionsCollapsible,
          onOpenChange: [
            new MappedProp(
              (open: boolean) => addLog(`open change: ${open}`),
              '[log change]',
            ),
            undefined,
          ] as const,
        }),
        [addLog],
      ),
      'collapsible',
    );

  const [controlPanel, propsPanel] = usePropControl(
    propOptionsPanel,
    'collapsible panel',
  );

  const [controlDisclosure, propsDisclosure] = usePropControl(
    commonPropOptions,
    'disclosure',
  );

  const [controlButton, propsButton] = usePropControl(
    useMemo(
      () => ({
        ...commonPropOptions,
        cursor: cursorOptions,
        destructive: [undefined, false, true] as const,
        disabled: [undefined, false, true] as const,
        onClick: [
          new MappedProp(() => addLog('button clicked'), '[log click]'),
          undefined,
        ] as const,
      }),
      [addLog],
    ),
    'button (1st)',
  );

  const [controlFooter, propsFooter] = usePropControl(
    commonPropOptions,
    'footer (1st)',
  );
  const [controlBlock, propsBlock] = usePropControl(propOptionsBlock, 'block');

  const [selection, setSelection] =
    useState<(typeof selectionOptions)[number]>('Automatic');

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

  const edit = (first: boolean) => {
    switch (content.editing) {
      case 'select': {
        return first ? (
          <RemounterCheckbox>
            <List.Checkbox {...propsCheckbox} />
          </RemounterCheckbox>
        ) : (
          <List.Checkbox />
        );
      }

      case 'delete':
      case 'insert': {
        return (
          <List.EditButton
            aria-label={content.editing === 'delete' ? 'Delete' : 'Insert'}
            editingStyle={content.editing}
            {...(first ? propsEditButton : {})}
          />
        );
      }

      default: {
        return null;
      }
    }
  };

  const swipeActions = (
    side: 'leading' | 'trailing',
    actions: typeof leadingActions | typeof trailingActions,
    first: boolean,
  ) => (
    <List.SwipeActions
      side={side}
      {...(first ? propsSwipeActions : {})}
    >
      {actions.map(([label, icon, tint], index) => {
        const props: Partial<typeof propsSwipeAction> =
          first && index === 0 ? propsSwipeAction : {};

        return (
          <List.SwipeAction
            key={label}
            onClick={() => addLog(`${label} clicked`)}
            {...props}
            label={props.label ?? label}
            tint={props.tint ?? tint}
          >
            <SFSymbol icon={icon} />
          </List.SwipeAction>
        );
      })}
    </List.SwipeActions>
  );

  return (
    <Component
      stretch
      id="list"
      log={log}
      title="List"
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
        controlSwipeActions,
        controlSwipeAction,
        controlCheckbox,
        controlEditButton,
        controlGrabber,
        controlCollapsible,
        controlPanel,
        controlDisclosure,
        controlButton,
        controlFooter,
        controlBlock,
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
              onClick={() => addLog('header button clicked')}
            >
              <SFSymbol icon={sfSquareAndPencil} />
            </List.Accessory>
          </List.Header>
          <List.Group {...propsGroup}>
            <List.Item {...propsItem}>
              {edit(false)}
              <List.Image
                {...propsImage}
                style={{
                  ...(content.image === 'rounded' && {
                    backgroundColor: 'var(--color-ios-system-orange)',
                  }),
                  ...propsImage.style,
                }}
                variant={
                  propsImage.variant ??
                  (content.image === 'none' ? undefined : content.image)
                }
              >
                <SFSymbol icon={sfAirplane} />
              </List.Image>
              <List.Title>Airplane Mode</List.Title>
              <Switch.Root
                aria-label="Airplane Mode"
                onCheckedChange={(checked) =>
                  addLog(`airplane mode: ${checked}`)
                }
              >
                <Switch.Thumb />
              </Switch.Root>
            </List.Item>
            <List.Item>
              {edit(false)}
              {image(sfWifi, 'var(--color-ios-system-blue)')}
              <List.Title {...propsTitle}>Wi-Fi</List.Title>
              <List.Detail {...propsDetail}>Home</List.Detail>
              <List.DrillIn {...propsDrillIn} />
            </List.Item>
            <List.Item>
              {edit(false)}
              {image(sfBellFill, 'var(--color-ios-system-red)')}
              <List.Title
                render={<button />}
                onClick={() => addLog('Notifications clicked')}
              >
                Notifications
              </List.Title>
              <List.Subtitle {...propsSubtitle}>Banners, Sounds</List.Subtitle>
              <List.DrillIn />
            </List.Item>
            <List.Item>
              {edit(false)}
              {image(sfPersonFill, 'var(--color-ios-system-gray)')}
              <List.Title>Show Previews</List.Title>
              <Menu.Root>
                <Menu.Trigger render={<List.PopUp {...propsPopUp} />}>
                  {selection}
                </Menu.Trigger>
                <Menu.Portal>
                  <Menu.Positioner align="end">
                    <Menu.Popup>
                      <Menu.RadioGroup
                        value={selection}
                        onValueChange={(value: unknown) =>
                          setSelection(
                            value as (typeof selectionOptions)[number],
                          )
                        }
                      >
                        {selectionOptions.map((option) => (
                          <Menu.RadioItem
                            key={option}
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
            </List.Item>
            <List.Item>
              {edit(false)}
              {image(sfHeartFill, 'var(--color-ios-system-pink)')}
              <List.Title>Favorite</List.Title>
              <List.Accessory
                aria-label="Info"
                {...propsAccessory}
              >
                <SFSymbol icon={sfICircle} />
              </List.Accessory>
              <List.Checkmark {...propsCheckmark} />
            </List.Item>
            <List.Item>
              {edit(false)}
              <List.Title>Button</List.Title>
              <List.Action {...propsAction}>Button</List.Action>
            </List.Item>
          </List.Group>
          <List.Footer {...propsFooter}>
            Footer text, aligned with the rows’ text.
          </List.Footer>
        </List.Section>

        <List.Section>
          <List.Header prominence="nested">
            <List.Title>Swipe Actions</List.Title>
          </List.Header>
          <List.Group>
            {(['Regular', 'Tall'] as const).map((height, index) => (
              <List.Item key={height}>
                {edit(index === 0)}
                {image(sfEnvelopeFill, 'var(--color-ios-system-blue)')}
                <List.Title
                  render={<button />}
                  onClick={() => addLog(`${height} clicked`)}
                >
                  {height}
                </List.Title>
                {height === 'Tall' ? (
                  <List.Subtitle>Swipe either way</List.Subtitle>
                ) : null}
                <List.Detail>Detail</List.Detail>
                <List.DrillIn />
                {content.editing === 'none' ? null : (
                  <List.Grabber
                    aria-label="Reorder"
                    {...(index === 0 ? propsGrabber : {})}
                  />
                )}
                {swipeActions('leading', leadingActions, index === 0)}
                {swipeActions('trailing', trailingActions, false)}
              </List.Item>
            ))}
          </List.Group>
        </List.Section>

        <RemounterCollapsible>
          <Collapsible.Root
            {...propsCollapsible}
            render={<List.Section />}
          >
            <Collapsible.Trigger
              nativeButton={false}
              render={<List.Header prominence="nested" />}
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
          <List.Group>
            <List.Item>
              <List.Button {...propsButton}>Action</List.Button>
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
          <List.Block {...propsBlock}>
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
  const [log, addLog] = useLog();

  const [controlRoot, propsRoot] = usePropControl(
    useMemo(
      () => ({
        ...propOptionsRoot,
        listStyle: ['plain', 'insetGrouped', 'grouped', undefined] as const,
      }),
      [],
    ),
    'root',
    true,
  );

  const [controlHeader, propsHeader] = usePropControl(
    commonPropOptions,
    'header',
  );

  const [controlIndex, propsIndex] = usePropControl(
    useMemo(
      () => ({
        ...commonPropOptions,
        size: [undefined, 'compact', 'regular'] as const,
      }),
      [],
    ),
    'index',
    true,
  );

  const [controlIndexItem, propsIndexItem] = usePropControl(
    useMemo(() => ({ ...commonPropOptions, cursor: cursorOptions }), []),
    'index item',
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
      id="list-index"
      log={log}
      title="List (Index)"
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
