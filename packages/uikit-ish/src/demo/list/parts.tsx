import { Collapsible } from '@base-ui/react/collapsible';
import { RadioGroup } from '@base-ui/react/radio-group';
import { sfArchiveboxFill } from '@bradleyhodges/sfsymbols/sfArchiveboxFill';
import { sfEllipsis } from '@bradleyhodges/sfsymbols/sfEllipsis';
import { sfFlagFill } from '@bradleyhodges/sfsymbols/sfFlagFill';
import { sfHeartFill } from '@bradleyhodges/sfsymbols/sfHeartFill';
import { sfICircle } from '@bradleyhodges/sfsymbols/sfICircle';
import { sfPersonCropCircleFill } from '@bradleyhodges/sfsymbols/sfPersonCropCircleFill';
import { sfSquareAndPencil } from '@bradleyhodges/sfsymbols/sfSquareAndPencil';
import { sfTrashFill } from '@bradleyhodges/sfsymbols/sfTrashFill';
import { FunctionComponent, useMemo, useState } from 'react';

import { forwardClick, List, Symbol } from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { commonPropOptions, Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { PropsTable } from '../utils/props-table.js';
import { contacts, messages, planets, settings } from './content.js';
import {
  listAccessoryRows,
  listActionRows,
  listBlockRows,
  listButtonRows,
  listCheckboxRows,
  listCheckmarkRows,
  listDetailRows,
  listDisclosureRows,
  listDrillInRows,
  listEditButtonRows,
  listExpandableRootRows,
  listExpandableRows,
  listExpandableTriggerRows,
  listFooterRows,
  listGrabberRows,
  listGroupRows,
  listHeaderRows,
  listImageRows,
  listIndexItemRows,
  listIndexRows,
  listItemRows,
  listRadioRows,
  listRootRows,
  listSectionRows,
  listSubtitleRows,
  listSupertitleRows,
  listSwipeActionRows,
  listSwipeActionsRows,
  listTextRows,
  listTitleRows,
} from './docs.js';
import {
  getPropOptionsAccessory,
  getPropOptionsAction,
  getPropOptionsButton,
  getPropOptionsCheckboxFirst,
  getPropOptionsEditButton,
  getPropOptionsExpandableRoot,
  getPropOptionsExpandableTrigger,
  getPropOptionsIndexItem,
  getPropOptionsItem,
  getPropOptionsSwipeActionOutermost,
  getPropOptionsSwipeActionsTrailing,
  getPropOptionsTitleFirst,
  propOptionsBlock,
  propOptionsCursor,
  propOptionsExpandable,
  propOptionsHeader,
  propOptionsImage,
  propOptionsIndex,
  propOptionsRadioFirst,
  propOptionsRootAll,
  propOptionsText,
} from './props.js';

// Every view writes out a small list (planets, settings, messages or
// contacts, see content.ts), the part's props on it (on its first row's), so
// its code shows as it'd be used.

const rows = planets.slice(0, 3);

/** Moves a row (the app's part of reordering, see `List.Group`). */
const moved = (current: readonly string[], from: number, to: number) => {
  const next = [...current];
  const [row] = next.splice(from, 1);
  if (row) next.splice(to, 0, row);
  return next;
};

/** `List.Root`, outlined, with its props. */
const RootPart: FunctionComponent = () => {
  const id = 'list-parts-root';
  const [log] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsRootAll,
    'List.Root',
    external,
    true,
    true,
  );

  return (
    <Component
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="List.Root"
    >
      <List.Root {...props}>
        <List.Section>
          <List.Header prominence="nested">
            <List.Title render={<h3 />}>Planets</List.Title>
          </List.Header>
          <List.Group>
            {rows.map((name) => (
              <List.Item key={name}>
                <List.Checkbox aria-label={name} />
                <List.Title>{name}</List.Title>
                <List.Grabber aria-label={`Reorder ${name}`} />
              </List.Item>
            ))}
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.Section`, outlined, with its props. */
const SectionPart: FunctionComponent = () => {
  const id = 'list-parts-section';
  const [log] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    commonPropOptions,
    'List.Section',
    external,
    true,
    true,
  );

  return (
    <Component
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="List.Section"
    >
      <List.Root>
        <List.Section {...props}>
          <List.Header prominence="nested">
            <List.Title render={<h3 />}>Planets</List.Title>
          </List.Header>
          <List.Group>
            {rows.map((name) => (
              <List.Item key={name}>
                <List.Title>{name}</List.Title>
              </List.Item>
            ))}
          </List.Group>
          <List.Footer>The inner planets.</List.Footer>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.Header`, outlined, with its props. */
const HeaderPart: FunctionComponent = () => {
  const id = 'list-parts-header';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsHeader,
    'List.Header',
    external,
    true,
    true,
  );

  return (
    <Component
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="List.Header"
    >
      <List.Root>
        <List.Section>
          <List.Header {...props}>
            <List.Title render={<h3 />}>Planets</List.Title>
            <List.Accessory
              aria-label="Edit"
              render={<button type="button" />}
              onClick={() => addLog('edit clicked')}
            >
              <Symbol icon={sfSquareAndPencil} />
            </List.Accessory>
          </List.Header>
          <List.Group>
            {rows.map((name) => (
              <List.Item key={name}>
                <List.Title>{name}</List.Title>
              </List.Item>
            ))}
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.Group` (reordered by its rows' grabbers), outlined. */
const GroupPart: FunctionComponent = () => {
  const id = 'list-parts-group';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    commonPropOptions,
    'List.Group',
    external,
    true,
    true,
  );
  const [order, setOrder] = useState<readonly string[]>(rows);

  return (
    <Component
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="List.Group"
    >
      <List.Root>
        <List.Section>
          <List.Group
            {...props}
            onReorder={(from: number, to: number) => {
              addLog(`reorder: ${String(from)} → ${String(to)}`);
              setOrder((current) => moved(current, from, to));
            }}
          >
            {order.map((name) => (
              <List.Item key={name}>
                <List.Title>{name}</List.Title>
                <List.Grabber aria-label={`Reorder ${name}`} />
              </List.Item>
            ))}
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.Item` (the first), outlined, with its props. */
const ItemPart: FunctionComponent = () => {
  const id = 'list-parts-item';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsItem(addLog), [addLog]),
    'List.Item',
    external,
    true,
    true,
  );

  return (
    <Component
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="List.Item"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            {rows.map((name, index) => (
              <List.Item
                key={name}
                {...(index === 0 ? props : {})}
              >
                <List.Title>{name}</List.Title>
              </List.Item>
            ))}
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** An expandable row's root (no element), with its props. */
const ExpandableRootPart: FunctionComponent = () => {
  const id = 'list-parts-expandable-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsExpandableRoot(addLog), [addLog]),
    'List.ExpandableRoot',
    external,
    true,
  );

  return (
    <Component
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="List.ExpandableRoot"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            <List.ExpandableRoot
              key={elementKey}
              {...props}
            >
              <List.Item>
                <List.Title render={<List.ExpandableTrigger />}>
                  Repeat
                </List.Title>
                <List.Detail>Daily</List.Detail>
                <List.Disclosure />
              </List.Item>
              <List.Expandable>
                <List.Title>Every day at 9:41</List.Title>
              </List.Expandable>
            </List.ExpandableRoot>
            <List.Item>
              <List.Title>Alert</List.Title>
              <List.Detail>None</List.Detail>
            </List.Item>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.ExpandableTrigger` (the row's title), outlined, with its props. */
const ExpandableTriggerPart: FunctionComponent = () => {
  const id = 'list-parts-expandable-trigger';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsExpandableTrigger(addLog), [addLog]),
    'List.ExpandableTrigger',
    external,
    true,
    true,
  );

  return (
    <Component
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="List.ExpandableTrigger"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            <List.ExpandableRoot defaultOpen>
              <List.Item>
                <List.Title render={<List.ExpandableTrigger {...props} />}>
                  Repeat
                </List.Title>
                <List.Detail>Daily</List.Detail>
                <List.Disclosure />
              </List.Item>
              <List.Expandable>
                <List.Title>Every day at 9:41</List.Title>
              </List.Expandable>
            </List.ExpandableRoot>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.Expandable` (below the row toggling it), outlined. */
const ExpandablePart: FunctionComponent = () => {
  const id = 'list-parts-expandable';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsExpandable,
    'List.Expandable',
    external,
    true,
    true,
  );

  return (
    <Component
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="List.Expandable"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            <List.ExpandableRoot
              defaultOpen
              onOpenChange={(open: boolean) =>
                addLog(`open change: ${String(open)}`)
              }
            >
              <List.Item>
                <List.Title render={<List.ExpandableTrigger />}>
                  Repeat
                </List.Title>
                <List.Detail>Daily</List.Detail>
                <List.Disclosure />
              </List.Item>
              <List.Expandable {...props}>
                <List.Title>Every day at 9:41</List.Title>
              </List.Expandable>
            </List.ExpandableRoot>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.Footer`, outlined, with its props. */
const FooterPart: FunctionComponent = () => {
  const id = 'list-parts-footer';
  const [log] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    commonPropOptions,
    'List.Footer',
    external,
    true,
    true,
  );

  return (
    <Component
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="List.Footer"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            {rows.map((name) => (
              <List.Item key={name}>
                <List.Title>{name}</List.Title>
              </List.Item>
            ))}
          </List.Group>
          <List.Footer {...props}>
            The inner planets, aligned with the rows’ text.
          </List.Footer>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.Block`, outlined, with its props. */
const BlockPart: FunctionComponent = () => {
  const id = 'list-parts-block';
  const [log] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsBlock,
    'List.Block',
    external,
    true,
    true,
  );

  return (
    <Component
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="List.Block"
    >
      <List.Root>
        <List.Section>
          <List.Header prominence="extraProminent">
            <List.Title render={<h3 />}>About</List.Title>
          </List.Header>
          <List.Block {...props}>
            <p>
              The inner planets are rocky; the outer ones are giants of gas and
              ice.
            </p>
          </List.Block>
          <List.Footer>Blocks have headers and footers, too.</List.Footer>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.Title` (the first row's, a button), outlined, with its props. */
const TitlePart: FunctionComponent = () => {
  const id = 'list-parts-title';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsTitleFirst(addLog), [addLog]),
    'List.Title',
    external,
    true,
    true,
  );

  return (
    <Component
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="List.Title"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            {rows.map((name, index) =>
              index === 0 ? (
                <List.Item key={name}>
                  <List.Title {...props}>{name}</List.Title>
                  <List.DrillIn />
                </List.Item>
              ) : (
                <List.Item key={name}>
                  <List.Title>{name}</List.Title>
                </List.Item>
              ),
            )}
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.Subtitle` (the first row's), outlined, with its props. */
const SubtitlePart: FunctionComponent = () => {
  const id = 'list-parts-subtitle';
  const [log] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    commonPropOptions,
    'List.Subtitle',
    external,
    true,
    true,
  );

  return (
    <Component
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="List.Subtitle"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            {settings.map(({ subtitle, title }, index) => (
              <List.Item key={title}>
                <List.Title>{title}</List.Title>
                <List.Subtitle {...(index === 0 ? props : {})}>
                  {subtitle}
                </List.Subtitle>
              </List.Item>
            ))}
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.Supertitle` (in a header), outlined, with its props. */
const SupertitlePart: FunctionComponent = () => {
  const id = 'list-parts-supertitle';
  const [log] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    commonPropOptions,
    'List.Supertitle',
    external,
    true,
    true,
  );

  return (
    <Component
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="List.Supertitle"
    >
      <List.Root>
        <List.Section>
          <List.Header>
            <List.Supertitle {...props}>Solar System</List.Supertitle>
            <List.Title render={<h3 />}>Planets</List.Title>
            <List.Subtitle>The inner ones</List.Subtitle>
          </List.Header>
          <List.Group>
            {rows.map((name) => (
              <List.Item key={name}>
                <List.Title>{name}</List.Title>
              </List.Item>
            ))}
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.Text` (the first message's), outlined, with its props. */
const TextPart: FunctionComponent = () => {
  const id = 'list-parts-text';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsText,
    'List.Text',
    external,
    true,
    true,
  );

  return (
    <Component
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="List.Text"
    >
      <List.Root listStyle="plain">
        <List.Section>
          <List.Group>
            {messages.map(({ date, from, preview, subject }, index) => (
              <List.Item key={from}>
                <List.Title
                  render={<button type="button" />}
                  onClick={() => addLog(`${from} clicked`)}
                >
                  {from}
                </List.Title>
                <List.Detail>{date}</List.Detail>
                <List.DrillIn />
                <List.Subtitle>{subject}</List.Subtitle>
                <List.Text {...(index === 0 ? props : {})}>{preview}</List.Text>
              </List.Item>
            ))}
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.Detail` (the first row's), outlined, with its props. */
const DetailPart: FunctionComponent = () => {
  const id = 'list-parts-detail';
  const [log] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    commonPropOptions,
    'List.Detail',
    external,
    true,
    true,
  );

  return (
    <Component
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="List.Detail"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            {settings.map(({ detail, title }, index) => (
              <List.Item key={title}>
                <List.Title>{title}</List.Title>
                <List.Detail {...(index === 0 ? props : {})}>
                  {detail}
                </List.Detail>
              </List.Item>
            ))}
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.Image` (the first row's), outlined, with its props. */
const ImagePart: FunctionComponent = () => {
  const id = 'list-parts-image';
  const [log] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsImage,
    'List.Image',
    external,
    true,
    true,
  );

  return (
    <Component
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="List.Image"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            {settings.map(({ color, icon, title }, index) => (
              <List.Item key={title}>
                <List.Image
                  style={{ backgroundColor: color }}
                  variant="rounded"
                  {...(index === 0 ? props : {})}
                >
                  <Symbol icon={icon} />
                </List.Image>
                <List.Title>{title}</List.Title>
              </List.Item>
            ))}
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.Accessory` (an info button), outlined, with its props. */
const AccessoryPart: FunctionComponent = () => {
  const id = 'list-parts-accessory';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsAccessory(addLog), [addLog]),
    'List.Accessory',
    external,
    true,
    true,
  );

  return (
    <Component
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="List.Accessory"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            <List.Item>
              <List.Image
                style={{ backgroundColor: 'var(--color-ios-system-pink)' }}
                variant="rounded"
              >
                <Symbol icon={sfHeartFill} />
              </List.Image>
              <List.Title>Favorites</List.Title>
              <List.Accessory
                aria-label="Info"
                {...props}
              >
                <Symbol icon={sfICircle} />
              </List.Accessory>
            </List.Item>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.Checkmark` (the chosen row's), outlined, with its props. */
const CheckmarkPart: FunctionComponent = () => {
  const id = 'list-parts-checkmark';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    commonPropOptions,
    'List.Checkmark',
    external,
    true,
    true,
  );
  const [chosen, setChosen] = useState<string>(planets[0]);

  return (
    <Component
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="List.Checkmark"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            {rows.map((name) => (
              <List.Item key={name}>
                <List.Title
                  render={<button type="button" />}
                  onClick={() => {
                    addLog(`chosen: ${name}`);
                    setChosen(name);
                  }}
                >
                  {name}
                </List.Title>
                {chosen === name ? <List.Checkmark {...props} /> : null}
              </List.Item>
            ))}
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.DrillIn` (the first row's), outlined, with its props. */
const DrillInPart: FunctionComponent = () => {
  const id = 'list-parts-drill-in';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    commonPropOptions,
    'List.DrillIn',
    external,
    true,
    true,
  );

  return (
    <Component
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="List.DrillIn"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            {settings.map(({ detail, title }, index) => (
              <List.Item key={title}>
                <List.Title
                  render={<button type="button" />}
                  onClick={() => addLog(`${title} clicked`)}
                >
                  {title}
                </List.Title>
                <List.Detail>{detail}</List.Detail>
                <List.DrillIn {...(index === 0 ? props : {})} />
              </List.Item>
            ))}
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.Disclosure` (in a collapsible section's header), outlined. */
const DisclosurePart: FunctionComponent = () => {
  const id = 'list-parts-disclosure';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    commonPropOptions,
    'List.Disclosure',
    external,
    true,
    true,
  );

  return (
    <Component
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="List.Disclosure"
    >
      <List.Root>
        <Collapsible.Root
          defaultOpen
          render={<List.Section />}
          onOpenChange={(open: boolean) => addLog(`open: ${String(open)}`)}
        >
          <Collapsible.Trigger
            aria-label="Planets"
            nativeButton={false}
            render={<List.Header prominence="nested" />}
          >
            <List.Title>Planets</List.Title>
            <List.Disclosure {...props} />
          </Collapsible.Trigger>
          <Collapsible.Panel render={<List.Group />}>
            {rows.map((name) => (
              <List.Item key={name}>
                <List.Title>{name}</List.Title>
              </List.Item>
            ))}
          </Collapsible.Panel>
        </Collapsible.Root>
      </List.Root>
    </Component>
  );
};

/** `List.Grabber` (the first row's), outlined, with its props. */
const GrabberPart: FunctionComponent = () => {
  const id = 'list-parts-grabber';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsCursor,
    'List.Grabber',
    external,
    true,
    true,
  );
  const [order, setOrder] = useState<readonly string[]>(rows);

  return (
    <Component
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="List.Grabber"
    >
      <List.Root>
        <List.Section>
          <List.Group
            onReorder={(from: number, to: number) => {
              addLog(`reorder: ${String(from)} → ${String(to)}`);
              setOrder((current) => moved(current, from, to));
            }}
          >
            {order.map((name, index) => (
              <List.Item key={name}>
                <List.Title>{name}</List.Title>
                <List.Grabber
                  aria-label={`Reorder ${name}`}
                  {...(index === 0 ? props : {})}
                />
              </List.Item>
            ))}
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.Action` (in a header), outlined, with its props. */
const ActionPart: FunctionComponent = () => {
  const id = 'list-parts-action';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsAction(addLog), [addLog]),
    'List.Action',
    external,
    true,
    true,
  );

  return (
    <Component
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="List.Action"
    >
      <List.Root>
        <List.Section>
          <List.Header prominence="nested">
            <List.Title render={<h3 />}>Planets</List.Title>
            <List.Action {...props}>See All</List.Action>
          </List.Header>
          <List.Group>
            {rows.map((name) => (
              <List.Item key={name}>
                <List.Title>{name}</List.Title>
              </List.Item>
            ))}
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.Button` (the first row's), outlined, with its props. */
const ButtonPart: FunctionComponent = () => {
  const id = 'list-parts-button';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsButton(addLog), [addLog]),
    'List.Button',
    external,
    true,
    true,
  );

  return (
    <Component
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="List.Button"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            <List.Item>
              <List.Button {...props}>Add Planet</List.Button>
            </List.Item>
            <List.Item>
              <List.Button
                destructive
                onClick={() => addLog('delete all clicked')}
              >
                Delete All
              </List.Button>
            </List.Item>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.Checkbox` (the first row's), outlined, with its props. */
const CheckboxPart: FunctionComponent = () => {
  const id = 'list-parts-checkbox';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsCheckboxFirst(addLog), [addLog]),
    'List.Checkbox',
    external,
    true,
    true,
  );

  return (
    <Component
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="List.Checkbox"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            {rows.map((name, index) => (
              <List.Item
                key={name}
                onClick={forwardClick('[role=checkbox]')}
              >
                {index === 0 ? (
                  <List.Checkbox
                    key={elementKey}
                    aria-label={name}
                    {...props}
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

/** `List.Radio` (the first row's), outlined, with its props. */
const RadioPart: FunctionComponent = () => {
  const id = 'list-parts-radio';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsRadioFirst,
    'List.Radio',
    external,
    true,
    true,
  );

  return (
    <Component
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="List.Radio"
    >
      <List.Root>
        <List.Section>
          <RadioGroup
            aria-label="Planet"
            defaultValue={rows[0]}
            render={<List.Group />}
            onValueChange={(value: unknown) =>
              addLog(`value change: ${String(value)}`)
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
                  {...(index === 0 ? props : {})}
                />
                <List.Title>{name}</List.Title>
              </List.Item>
            ))}
          </RadioGroup>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.EditButton` (the first row's), outlined, with its props. */
const EditButtonPart: FunctionComponent = () => {
  const id = 'list-parts-edit-button';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsEditButton(addLog), [addLog]),
    'List.EditButton',
    external,
    true,
    true,
  );

  return (
    <Component
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="List.EditButton"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            {rows.map((name, index) => (
              <List.Item key={name}>
                <List.EditButton
                  aria-label={`Delete ${name}`}
                  {...(index === 0 ? props : {})}
                />
                <List.Title>{name}</List.Title>
                <List.SwipeActions>
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
      </List.Root>
    </Component>
  );
};

/** `List.SwipeActions` (the first row's), outlined, with its props. */
const SwipeActionsPart: FunctionComponent = () => {
  const id = 'list-parts-swipe-actions';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsSwipeActionsTrailing(addLog), [addLog]),
    'List.SwipeActions',
    external,
    true,
    true,
  );

  return (
    <Component
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="List.SwipeActions"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            {rows.map((name, index) => (
              <List.Item key={name}>
                <List.Title>{name}</List.Title>
                <List.SwipeActions {...(index === 0 ? props : {})}>
                  <List.SwipeAction
                    label="Pin"
                    onClick={() => addLog(`pin ${name}`)}
                  >
                    <Symbol icon={sfFlagFill} />
                  </List.SwipeAction>
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
      </List.Root>
    </Component>
  );
};

/** `List.SwipeAction` (the outermost, Archive), outlined, with its props. */
const SwipeActionPart: FunctionComponent = () => {
  const id = 'list-parts-swipe-action';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsSwipeActionOutermost(addLog), [addLog]),
    'List.SwipeAction',
    external,
    true,
    true,
  );

  return (
    <Component
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="List.SwipeAction"
    >
      <List.Root listStyle="plain">
        <List.Section>
          <List.Group>
            {messages.map(({ date, from, preview, subject }, index) => (
              <List.Item key={from}>
                <List.Image variant="circular">
                  <Symbol icon={sfPersonCropCircleFill} />
                </List.Image>
                <List.Title>{from}</List.Title>
                <List.Detail>{date}</List.Detail>
                <List.Subtitle>{subject}</List.Subtitle>
                <List.Text>{preview}</List.Text>
                <List.SwipeActions overswipe>
                  <List.SwipeAction
                    showLabel
                    label="More"
                    onClick={() => addLog(`more ${from}`)}
                  >
                    <Symbol icon={sfEllipsis} />
                  </List.SwipeAction>
                  {index === 0 ? (
                    <List.SwipeAction {...props}>
                      <Symbol icon={sfArchiveboxFill} />
                    </List.SwipeAction>
                  ) : (
                    <List.SwipeAction
                      showLabel
                      label="Archive"
                      tint="var(--color-ios-system-purple)"
                      onClick={() => addLog(`archive ${from}`)}
                    >
                      <Symbol icon={sfArchiveboxFill} />
                    </List.SwipeAction>
                  )}
                </List.SwipeActions>
              </List.Item>
            ))}
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.Index` (beside a plain list of contacts), outlined. */
const IndexPart: FunctionComponent = () => {
  const id = 'list-parts-index';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsIndex,
    'List.Index',
    external,
    true,
    true,
  );

  return (
    <Component
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="List.Index"
    >
      <div className="list-demo-plain">
        <div
          className="list-demo-scroll"
          id="list-parts-index"
        >
          <List.Root listStyle="plain">
            {Object.entries(contacts).map(([letter, names]) => (
              <List.Section
                key={letter}
                id={`list-parts-index-${letter}`}
              >
                <List.Header prominence="nested">
                  <List.Title>{letter}</List.Title>
                </List.Header>
                <List.Group>
                  {names.map((name) => (
                    <List.Item key={name}>
                      <List.Title>{name}</List.Title>
                    </List.Item>
                  ))}
                </List.Group>
              </List.Section>
            ))}
          </List.Root>
        </div>
        <div className="list-demo-index">
          <List.Index
            aria-label="Index"
            {...props}
          >
            {Object.keys(contacts).map((letter) => (
              <List.IndexItem
                key={letter}
                onClick={() => {
                  addLog(`index: ${letter}`);
                  const list = document.querySelector('#list-parts-index');
                  const section = document.querySelector(
                    `#list-parts-index-${letter}`,
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

/** `List.IndexItem` (A), outlined, with its props. */
const IndexItemPart: FunctionComponent = () => {
  const id = 'list-parts-index-item';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsIndexItem(addLog), [addLog]),
    'List.IndexItem',
    external,
    true,
    true,
  );

  return (
    <Component
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="List.IndexItem"
    >
      <div className="list-demo-plain">
        <div
          className="list-demo-scroll"
          id="list-parts-index-item"
        >
          <List.Root listStyle="plain">
            {Object.entries(contacts).map(([letter, names]) => (
              <List.Section
                key={letter}
                id={`list-parts-index-item-${letter}`}
              >
                <List.Header prominence="nested">
                  <List.Title>{letter}</List.Title>
                </List.Header>
                <List.Group>
                  {names.map((name) => (
                    <List.Item key={name}>
                      <List.Title>{name}</List.Title>
                    </List.Item>
                  ))}
                </List.Group>
              </List.Section>
            ))}
          </List.Root>
        </div>
        <div className="list-demo-index">
          <List.Index aria-label="Index">
            {Object.keys(contacts).map((letter, index) => (
              <List.IndexItem
                key={letter}
                onClick={() => {
                  addLog(`index: ${letter}`);
                  const list = document.querySelector('#list-parts-index-item');
                  const section = document.querySelector(
                    `#list-parts-index-item-${letter}`,
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
                {...(index === 0 ? props : {})}
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

/** `/list/parts`: a list's parts, from the root to its rows' parts. */
export const ListParts: FunctionComponent = () => (
  <>
    <p className="demo-lead">
      A list is a <code>List.Root</code> of sections; a section is a header, a
      group of rows (or a block of text), and a footer. A row is a grid of
      parts: leading (an edit control, an image), its title (and subtitle,
      text), and trailing parts; its swipe actions are revealed by swiping.
    </p>
    <ul>
      <li>
        <code>List.Root</code>
        <ul>
          <li>
            <code>List.Section</code> (one or more)
            <ul>
              <li>
                <code>List.Header</code> (optional):{' '}
                <code>List.Supertitle</code>, <code>List.Title</code>,{' '}
                <code>List.Subtitle</code>, <code>List.Accessory</code>,{' '}
                <code>List.Action</code>, <code>List.Disclosure</code>
              </li>
              <li>
                <code>List.Group</code>, or <code>List.Block</code>
                <ul>
                  <li>
                    <code>List.Item</code> (or <code>List.Expandable</code>, in
                    a <code>List.ExpandableRoot</code> with the row whose{' '}
                    <code>List.ExpandableTrigger</code> toggles it; one or more)
                    <ul>
                      <li>
                        Leading (optional): <code>List.Checkbox</code>,{' '}
                        <code>List.Radio</code> or <code>List.EditButton</code>;{' '}
                        <code>List.Image</code>
                      </li>
                      <li>
                        <code>List.Title</code> (or <code>List.Button</code>),{' '}
                        <code>List.Subtitle</code> (optional),{' '}
                        <code>List.Text</code> (optional)
                      </li>
                      <li>
                        Trailing (optional): <code>List.Detail</code>,{' '}
                        <code>List.Accessory</code>, <code>List.Action</code>,{' '}
                        <code>List.Checkmark</code>, <code>List.DrillIn</code>,{' '}
                        <code>List.Disclosure</code>, <code>List.Grabber</code>,
                        or a control (e.g. a Switch)
                      </li>
                      <li>
                        <code>List.SwipeActions</code> (optional, one per side)
                        <ul>
                          <li>
                            <code>List.SwipeAction</code> (one or more)
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                <code>List.Footer</code> (optional)
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        <code>List.Index</code> (optional, beside a plain list)
        <ul>
          <li>
            <code>List.IndexItem</code> (one per letter)
          </li>
        </ul>
      </li>
    </ul>

    <h2>
      <code>List.Root</code>
    </h2>
    <p>
      The list: its style (<code>listStyle</code>; UIKit{' '}
      <code>UITableView.Style</code>), for all its parts, whether its groups are
      outlined, and whether it’s in edit mode (<code>editing</code>: its rows’
      edit controls and grabbers slide in). It renders a <code>div</code>.
    </p>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={listRootRows} />

    <h2>
      <code>List.Section</code>
    </h2>
    <p>
      A section (a <code>section</code>): an optional <code>Header</code>, a{' '}
      <code>Group</code> of rows (or a <code>Block</code>), an optional{' '}
      <code>Footer</code>; 35px apart.
    </p>
    <SectionPart />
    <h3>Props</h3>
    <PropsTable rows={listSectionRows} />

    <h2>
      <code>List.Header</code>
    </h2>
    <p>
      A section’s header: a title (a heading, by <code>render</code>),
      optionally a supertitle, a subtitle, and trailing parts (an{' '}
      <code>Accessory</code>, an <code>Action</code>). Its{' '}
      <code>prominence</code>: prominent, nested (a plain list’s sticky section
      title), or extra prominent.
    </p>
    <HeaderPart />
    <h3>Props</h3>
    <PropsTable rows={listHeaderRows} />

    <h2>
      <code>List.Group</code>
    </h2>
    <p>
      A section’s rows (a <code>ul</code>), on the rows’ background: inset with
      rounded corners, full width, or plain. Rows with a <code>Grabber</code>{' '}
      reorder within it; it calls <code>onReorder</code>, and the app reorders
      its rows.
    </p>
    <GroupPart />
    <h3>Props</h3>
    <PropsTable rows={listGroupRows} />

    <h2>
      <code>List.Item</code>
    </h2>
    <p>
      A row (an <code>li</code>): a grid of its parts, at least 52px high (68px
      with a subtitle), with a separator. It’s pressable through its title (or a{' '}
      <code>Button</code>), or by its own <code>onClick</code> (e.g.{' '}
      <code>forwardClick</code>); it can be <code>selected</code>, indented (
      <code>level</code>), and swiped for its <code>SwipeActions</code>.
    </p>
    <ItemPart />
    <h3>Props</h3>
    <PropsTable rows={listItemRows} />

    <h2>
      <code>List.ExpandableRoot</code>
    </h2>
    <p>
      An expandable row’s state (<code>defaultOpen</code>, or <code>open</code>{' '}
      and <code>onOpenChange</code>), around the row that toggles it and the{' '}
      <code>Expandable</code>; it renders no element, so they stay its group’s
      children. A <code>List.Disclosure</code> in it turns down while it’s open.
    </p>
    <ExpandableRootPart />
    <h3>Props</h3>
    <PropsTable rows={listExpandableRootRows} />

    <h2>
      <code>List.ExpandableTrigger</code>
    </h2>
    <p>
      A button toggling its root’s row, with <code>aria-expanded</code> and{' '}
      <code>aria-controls</code>; rendered by the row’s title, it makes the row
      pressable.
    </p>
    <ExpandableTriggerPart />
    <h3>Props</h3>
    <PropsTable rows={listExpandableTriggerRows} />

    <h2>
      <code>List.Expandable</code>
    </h2>
    <p>
      A row shown or not, opening and closing in place: e.g. an inline picker
      below the row that toggles it (as iOS’s Calendar). In an{' '}
      <code>ExpandableRoot</code>, by its state; or by its own <code>open</code>
      . Closed, it’s inert. It takes a row’s props, too.
    </p>
    <ExpandablePart />
    <h3>Props</h3>
    <PropsTable rows={listExpandableRows} />

    <h2>
      <code>List.Footer</code>
    </h2>
    <p>
      A section’s footer: text below its group (or block), aligned with the
      rows’ text.
    </p>
    <FooterPart />
    <h3>Props</h3>
    <PropsTable rows={listFooterRows} />

    <h2>
      <code>List.Block</code>
    </h2>
    <p>
      Text in a section instead of rows (Framework7’s content block), aligned
      with the rows’ text; <code>strong</code>, on the rows’ background.
    </p>
    <BlockPart />
    <h3>Props</h3>
    <PropsTable rows={listBlockRows} />

    <h2>
      <code>List.Title</code>
    </h2>
    <p>
      A row’s (or header’s) title, in Body. As a button or link (
      <code>render</code>), it makes the row pressable: its hit area covers the
      row, beneath the trailing controls.
    </p>
    <TitlePart />
    <h3>Props</h3>
    <PropsTable rows={listTitleRows} />

    <h2>
      <code>List.Subtitle</code>
    </h2>
    <p>
      A second line below the title (in a row, making it tall; also in a
      header).
    </p>
    <SubtitlePart />
    <h3>Props</h3>
    <PropsTable rows={listSubtitleRows} />

    <h2>
      <code>List.Supertitle</code>
    </h2>
    <p>A line above a header’s title.</p>
    <SupertitlePart />
    <h3>Props</h3>
    <PropsTable rows={listSupertitleRows} />

    <h2>
      <code>List.Text</code>
    </h2>
    <p>
      Body text below a row’s title and subtitle, making it a media row (as in
      Mail): up to <code>lines</code> lines, ellipsized.
    </p>
    <TextPart />
    <h3>Props</h3>
    <PropsTable rows={listTextRows} />

    <h2>
      <code>List.Detail</code>
    </h2>
    <p>
      A trailing value in the secondary color, e.g. a setting’s current value.
    </p>
    <DetailPart />
    <h3>Props</h3>
    <PropsTable rows={listDetailRows} />

    <h2>
      <code>List.Image</code>
    </h2>
    <p>
      A leading image: a symbol alone, or a symbol or picture in a rounded,
      circular or filled frame (<code>variant</code>), one line high.
    </p>
    <ImagePart />
    <h3>Props</h3>
    <PropsTable rows={listImageRows} />

    <h2>
      <code>List.Accessory</code>
    </h2>
    <p>
      A trailing symbol in the tint color; as a button (<code>render</code>),
      pressable on its own, e.g. an info button.
    </p>
    <AccessoryPart />
    <h3>Props</h3>
    <PropsTable rows={listAccessoryRows} />

    <h2>
      <code>List.Checkmark</code>
    </h2>
    <p>
      A trailing checkmark in the tint color: the chosen row of a list of
      options (as iOS’s settings).
    </p>
    <CheckmarkPart />
    <h3>Props</h3>
    <PropsTable rows={listCheckmarkRows} />

    <h2>
      <code>List.DrillIn</code>
    </h2>
    <p>
      A trailing chevron: the row opens a page (drills in). Hidden from
      assistive technology.
    </p>
    <DrillInPart />
    <h3>Props</h3>
    <PropsTable rows={listDrillInRows} />

    <h2>
      <code>List.Disclosure</code>
    </h2>
    <p>
      A chevron in the tint color, turned down while open: in a header (or row)
      that’s a Base UI <code>Collapsible.Trigger</code>, its group the panel.
      Hidden from assistive technology.
    </p>
    <DisclosurePart />
    <h3>Props</h3>
    <PropsTable rows={listDisclosureRows} />

    <h2>
      <code>List.Grabber</code>
    </h2>
    <p>
      A trailing handle that drags its row to reorder its group (see{' '}
      <code>Group</code>); focused, arrow keys move the row by one.
    </p>
    <GrabberPart />
    <h3>Props</h3>
    <PropsTable rows={listGrabberRows} />

    <h2>
      <code>List.Action</code>
    </h2>
    <p>
      Text in the tint color as a button: trailing in a header (e.g. See All) or
      a row.
    </p>
    <ActionPart />
    <h3>Props</h3>
    <PropsTable rows={listActionRows} />

    <h2>
      <code>List.Button</code>
    </h2>
    <p>
      A row that’s a button: its title in the tint color (or red:{' '}
      <code>destructive</code>), the whole row pressable.
    </p>
    <ButtonPart />
    <h3>Props</h3>
    <PropsTable rows={listButtonRows} />

    <h2>
      <code>List.Checkbox</code>
    </h2>
    <p>
      A <a href="checkbox">Checkbox</a> as a row’s leading edit control:
      selecting several rows. Rows pass their clicks on to it (
      <code>forwardClick</code>).
    </p>
    <CheckboxPart />
    <h3>Props</h3>
    <PropsTable rows={listCheckboxRows} />

    <h2>
      <code>List.Radio</code>
    </h2>
    <p>
      A <a href="checkbox">Radio</a> as a row’s leading edit control: choosing
      one row, its group a Base UI <code>RadioGroup</code> rendering the{' '}
      <code>Group</code>.
    </p>
    <RadioPart />
    <h3>Props</h3>
    <PropsTable rows={listRadioRows} />

    <h2>
      <code>List.EditButton</code>
    </h2>
    <p>
      A leading delete (or insert) button; deleting opens the row’s trailing
      swipe actions, unless its click handler prevents it.
    </p>
    <EditButtonPart />
    <h3>Props</h3>
    <PropsTable rows={listEditButtonRows} />

    <h2>
      <code>List.SwipeActions</code>
    </h2>
    <p>
      A row’s actions on one side, revealed by swiping it (or by focusing them);{' '}
      <code>overswipe</code>: swiping on past them triggers the outermost.
    </p>
    <SwipeActionsPart />
    <h3>Props</h3>
    <PropsTable rows={listSwipeActionsRows} />

    <h2>
      <code>List.SwipeAction</code>
    </h2>
    <p>
      An action: a symbol (or short text) in a circle or rounded rectangle, in
      its <code>tint</code>, named by its <code>label</code> (shown below it
      with <code>showLabel</code>); the actions close after a click.
    </p>
    <SwipeActionPart />
    <h3>Props</h3>
    <PropsTable rows={listSwipeActionRows} />

    <h2>
      <code>List.Index</code>
    </h2>
    <p>
      An index (a <code>nav</code>) of letters in the tint color, beside a plain
      list: pressing or scrubbing over it clicks its items. Placing it (e.g. at
      the page’s edge) is the page’s.
    </p>
    <IndexPart />
    <h3>Props</h3>
    <PropsTable rows={listIndexRows} />

    <h2>
      <code>List.IndexItem</code>
    </h2>
    <p>
      A letter of the index (a button): its click scrolls the app’s list to the
      section.
    </p>
    <IndexItemPart />
    <h3>Props</h3>
    <PropsTable rows={listIndexItemRows} />
  </>
);
