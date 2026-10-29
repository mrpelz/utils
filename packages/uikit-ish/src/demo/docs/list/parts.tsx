import { RadioGroup } from '@base-ui/react/radio-group';
import { sfArchiveboxFill } from '@bradleyhodges/sfsymbols/sfArchiveboxFill';
import { sfEllipsis } from '@bradleyhodges/sfsymbols/sfEllipsis';
import { sfFlagFill } from '@bradleyhodges/sfsymbols/sfFlagFill';
import { sfHeartFill } from '@bradleyhodges/sfsymbols/sfHeartFill';
import { sfICircle } from '@bradleyhodges/sfsymbols/sfICircle';
import { sfMinus } from '@bradleyhodges/sfsymbols/sfMinus';
import { sfPersonCropCircleFill } from '@bradleyhodges/sfsymbols/sfPersonCropCircleFill';
import { sfPlus } from '@bradleyhodges/sfsymbols/sfPlus';
import { sfSquareAndPencil } from '@bradleyhodges/sfsymbols/sfSquareAndPencil';
import { sfTrashFill } from '@bradleyhodges/sfsymbols/sfTrashFill';
import { FunctionComponent, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Button,
  Collapsible,
  forwardClick,
  List,
  type ListReorderChange,
  type ListReorderHandle,
  Slider,
  Switch,
  Symbol,
  useCreateReorderHandle,
  useCreateSwipeActionsHandle,
} from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { codeLabel } from '../../tooling/frame/render-code.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { contacts, messages, planets, settings } from './content.js';
import {
  forwardClickRows,
  listAccessoryRows,
  listAccordionItemRows,
  listAccordionRootRows,
  listActionRows,
  listBelowRows,
  listBlockRows,
  listButtonRows,
  listCheckboxRows,
  listCheckmarkRows,
  listCollapsiblePanelRows,
  listCollapsibleRootRows,
  listCollapsibleTriggerRows,
  listContentRows,
  listDetailRows,
  listDisclosureRows,
  listDrillInRows,
  listDropGroupRows,
  listDropTargetRows,
  listEditButtonRows,
  listFooterRows,
  listGrabberRows,
  listGroupRows,
  listHeaderRows,
  listImageRows,
  listIndexItemRows,
  listIndexRows,
  listItemRows,
  listLeadingRows,
  listRadioRows,
  listReorderHandleRows,
  listReorderRows,
  listRootRows,
  listSectionRows,
  listSpanRows,
  listSubtitleRows,
  listSupertitleRows,
  listSwipeActionRows,
  listSwipeActionsHandleRows,
  listSwipeActionsRows,
  listSwipeActionsTriggerRows,
  listTextRows,
  listTitleRows,
  listTrailingRows,
} from './docs.js';
import {
  getPropOptionsAccessory,
  getPropOptionsAction,
  getPropOptionsButton,
  getPropOptionsCheckboxFirst,
  getPropOptionsDropTarget,
  getPropOptionsEditButton,
  getPropOptionsGuideGroup,
  getPropOptionsIndexItem,
  getPropOptionsItem,
  getPropOptionsListAccordionItem,
  getPropOptionsListAccordionRoot,
  getPropOptionsListCollapsibleRoot,
  getPropOptionsListCollapsibleTrigger,
  getPropOptionsSwipeActionOutermost,
  getPropOptionsSwipeActionsTrailing,
  getPropOptionsTitleFirst,
  mercuryActions,
  propOptionsBlock,
  propOptionsCursor,
  propOptionsHeader,
  propOptionsImage,
  propOptionsIndex,
  propOptionsRadioFirst,
  propOptionsRootAll,
  propOptionsSection,
  propOptionsSlot,
  propOptionsSwipeActionsTrigger,
  propOptionsText,
} from './props.js';

// Every view writes out a small list (planets, settings, messages or
// contacts, see content.ts), the part's props on it (on its first row's), so
// its code shows as it'd be used.

const rows = planets.slice(0, 3);

// The first row's parts' labels and values (theirs, or others).
const propOptionsGrabber = {
  ...propOptionsCursor,
  'aria-label': [`Reorder ${rows[0] ?? ''}`, 'Move'] as const,
  tabIndex: [undefined, -1, 0] as const,
};
const propOptionsRadio = {
  ...propOptionsRadioFirst,
  value: [rows[0] ?? '', 'Pluto'] as const,
  required: [undefined, false, true] as const,
};

/** `List.Root`, outlined, with its props. */
const RootPart: FunctionComponent = () => {
  const id = 'list-parts-root';
  const [log] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsRootAll, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'List.Root',
  });

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
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
                <List.Leading>
                  <List.Checkbox aria-label={name} />
                </List.Leading>
                <List.Content>
                  <List.Title>{name}</List.Title>
                </List.Content>
                <List.Trailing>
                  <List.Grabber aria-label={`Reorder ${name}`} />
                </List.Trailing>
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
  const [control, props, state] = usePropControl(propOptionsSection, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'List.Section',
  });

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
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
                <List.Content>
                  <List.Title>{name}</List.Title>
                </List.Content>
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
  const [control, props, state] = usePropControl(propOptionsHeader, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'List.Header',
  });

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
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
                <List.Content>
                  <List.Title>{name}</List.Title>
                </List.Content>
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
  const [order, setOrder] = useState<readonly string[]>(rows);
  const reorderRows = useCreateReorderHandle({
    onReorder: (change: ListReorderChange) => {
      addLog(
        `reorder: ${String(change.items[0]?.name)} after ${change.target.after ?? '(start)'}`,
      );
      setOrder((current) =>
        List.reorder(current, change, (row: string) => row),
      );
    },
  });
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsGuideGroup(reorderRows), [reorderRows]),
    { external, isOpen: true, emphasize: 'outline', title: 'List.Group' },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="List.Group"
    >
      <List.Root>
        <List.Section>
          <List.Group {...props}>
            {order.map((name) => (
              <List.Item
                key={name}
                dropName={name}
                reorderHandle={reorderRows}
              >
                <List.Content>
                  <List.Title>{name}</List.Title>
                </List.Content>
                <List.Trailing>
                  <List.Grabber aria-label={`Reorder ${name}`} />
                </List.Trailing>
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
    { external, isOpen: true, emphasize: 'outline', title: 'List.Item' },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
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
                <List.Content>
                  <List.Title>{name}</List.Title>
                </List.Content>
              </List.Item>
            ))}
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** A collapsible's root (no element), with its props. */
const CollapsibleRootPart: FunctionComponent = () => {
  const id = 'list-parts-collapsible-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsListCollapsibleRoot(addLog), [addLog]),
    { external, title: 'List.CollapsibleRoot' },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="List.CollapsibleRoot"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            <List.CollapsibleRoot
              key={elementKey}
              {...props}
            >
              <List.Item>
                <List.Content>
                  <List.Title render={<List.CollapsibleTrigger />}>
                    Repeat
                  </List.Title>
                </List.Content>
                <List.Trailing>
                  <List.Detail>Daily</List.Detail>
                  <List.Disclosure />
                </List.Trailing>
              </List.Item>
              <List.CollapsiblePanel>
                <List.Item>
                  <List.Content>
                    <List.Title>Every day at 9:41</List.Title>
                  </List.Content>
                </List.Item>
              </List.CollapsiblePanel>
            </List.CollapsibleRoot>
            <List.Item>
              <List.Content>
                <List.Title>Alert</List.Title>
              </List.Content>
              <List.Trailing>
                <List.Detail>None</List.Detail>
              </List.Trailing>
            </List.Item>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.CollapsibleTrigger` (the row's title), outlined, with its props. */
const CollapsibleTriggerPart: FunctionComponent = () => {
  const id = 'list-parts-collapsible-trigger';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsListCollapsibleTrigger(addLog), [addLog]),
    {
      external,
      isOpen: true,
      emphasize: 'outline',
      title: 'List.CollapsibleTrigger',
    },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="List.CollapsibleTrigger"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            <List.CollapsibleRoot defaultOpen>
              <List.Item>
                <List.Content>
                  <List.Title render={<List.CollapsibleTrigger {...props} />}>
                    Repeat
                  </List.Title>
                </List.Content>
                <List.Trailing>
                  <List.Detail>Daily</List.Detail>
                  <List.Disclosure />
                </List.Trailing>
              </List.Item>
              <List.CollapsiblePanel>
                <List.Item>
                  <List.Content>
                    <List.Title>Every day at 9:41</List.Title>
                  </List.Content>
                </List.Item>
              </List.CollapsiblePanel>
            </List.CollapsibleRoot>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.CollapsiblePanel` (two rows below the row toggling them). */
const CollapsiblePanelPart: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      isInline
      isStretched
      id="list-parts-collapsible-panel"
      log={log}
      title="List.CollapsiblePanel"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            <List.CollapsibleRoot
              defaultOpen
              onOpenChange={(isOpen: boolean) =>
                addLog(`open change: ${String(isOpen)}`)
              }
            >
              <List.Item>
                <List.Content>
                  <List.Title render={<List.CollapsibleTrigger />}>
                    Repeat
                  </List.Title>
                </List.Content>
                <List.Trailing>
                  <List.Detail>Daily</List.Detail>
                  <List.Disclosure />
                </List.Trailing>
              </List.Item>
              <List.CollapsiblePanel>
                <List.Item>
                  <List.Content>
                    <List.Title>Every day at 9:41</List.Title>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <List.Title>Ends</List.Title>
                  </List.Content>
                  <List.Trailing>
                    <List.Detail>Never</List.Detail>
                  </List.Trailing>
                </List.Item>
              </List.CollapsiblePanel>
            </List.CollapsibleRoot>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** An alarm's settings, one open at a time: its rows (no element). */
const accordionRows = (
  <>
    <List.AccordionItem value="repeat">
      <List.Item>
        <List.Content>
          <List.Title render={<List.AccordionTrigger />}>Repeat</List.Title>
        </List.Content>
        <List.Trailing>
          <List.Detail>Daily</List.Detail>
          <List.Disclosure />
        </List.Trailing>
      </List.Item>
      <List.AccordionPanel>
        <List.Item>
          <List.Content>
            <List.Title>Every day at 9:41</List.Title>
          </List.Content>
        </List.Item>
      </List.AccordionPanel>
    </List.AccordionItem>
    <List.AccordionItem value="alert">
      <List.Item>
        <List.Content>
          <List.Title render={<List.AccordionTrigger />}>Alert</List.Title>
        </List.Content>
        <List.Trailing>
          <List.Detail>None</List.Detail>
          <List.Disclosure />
        </List.Trailing>
      </List.Item>
      <List.AccordionPanel>
        <List.Item>
          <List.Content>
            <List.Title>5 minutes before</List.Title>
          </List.Content>
        </List.Item>
      </List.AccordionPanel>
    </List.AccordionItem>
  </>
);

/** `List.AccordionRoot` (no element), with its props. */
const AccordionRootPart: FunctionComponent = () => {
  const id = 'list-parts-accordion-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsListAccordionRoot(addLog), [addLog]),
    { external, title: 'List.AccordionRoot' },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="List.AccordionRoot"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            <List.AccordionRoot
              key={elementKey}
              {...props}
            >
              {accordionRows}
            </List.AccordionRoot>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.AccordionItem` (Repeat's, no element), with its props. */
const AccordionItemPart: FunctionComponent = () => {
  const id = 'list-parts-accordion-item';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsListAccordionItem(addLog), [addLog]),
    { external, title: 'List.AccordionItem' },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="List.AccordionItem"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            <List.AccordionRoot defaultValue={['repeat']}>
              <List.AccordionItem
                value="repeat"
                {...props}
              >
                <List.Item>
                  <List.Content>
                    <List.Title render={<List.AccordionTrigger />}>
                      Repeat
                    </List.Title>
                  </List.Content>
                  <List.Trailing>
                    <List.Detail>Daily</List.Detail>
                    <List.Disclosure />
                  </List.Trailing>
                </List.Item>
                <List.AccordionPanel>
                  <List.Item>
                    <List.Content>
                      <List.Title>Every day at 9:41</List.Title>
                    </List.Content>
                  </List.Item>
                </List.AccordionPanel>
              </List.AccordionItem>
              <List.AccordionItem value="alert">
                <List.Item>
                  <List.Content>
                    <List.Title render={<List.AccordionTrigger />}>
                      Alert
                    </List.Title>
                  </List.Content>
                  <List.Trailing>
                    <List.Detail>None</List.Detail>
                    <List.Disclosure />
                  </List.Trailing>
                </List.Item>
                <List.AccordionPanel>
                  <List.Item>
                    <List.Content>
                      <List.Title>5 minutes before</List.Title>
                    </List.Content>
                  </List.Item>
                </List.AccordionPanel>
              </List.AccordionItem>
            </List.AccordionRoot>
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
  const [control, props, state] = usePropControl(commonPropOptions, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'List.Footer',
  });

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="List.Footer"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            {rows.map((name) => (
              <List.Item key={name}>
                <List.Content>
                  <List.Title>{name}</List.Title>
                </List.Content>
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
  const [control, props, state] = usePropControl(propOptionsBlock, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'List.Block',
  });

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
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
    { external, isOpen: true, emphasize: 'outline', title: 'List.Title' },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="List.Title"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            {rows.map((name, index) =>
              index === 0 ? (
                <List.Item key={name}>
                  <List.Content>
                    <List.Title {...props}>{name}</List.Title>
                  </List.Content>
                  <List.Trailing>
                    <List.DrillIn />
                  </List.Trailing>
                </List.Item>
              ) : (
                <List.Item key={name}>
                  <List.Content>
                    <List.Title>{name}</List.Title>
                  </List.Content>
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
  const [control, props, state] = usePropControl(commonPropOptions, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'List.Subtitle',
  });

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="List.Subtitle"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            {settings.map(({ subtitle, title }, index) => (
              <List.Item key={title}>
                <List.Content>
                  <List.Title>{title}</List.Title>
                  <List.Subtitle {...(index === 0 ? props : {})}>
                    {subtitle}
                  </List.Subtitle>
                </List.Content>
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
  const [control, props, state] = usePropControl(commonPropOptions, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'List.Supertitle',
  });

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
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
                <List.Content>
                  <List.Title>{name}</List.Title>
                </List.Content>
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
  const [control, props, state] = usePropControl(propOptionsText, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'List.Text',
  });

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="List.Text"
    >
      <List.Root listStyle="plain">
        <List.Section>
          <List.Group>
            {messages.map(({ date, from, preview, subject }, index) => (
              <List.Item key={from}>
                <List.Content>
                  <List.Title
                    render={<button type="button" />}
                    onClick={() => addLog(`${from} clicked`)}
                  >
                    {from}
                  </List.Title>
                  <List.Subtitle>{subject}</List.Subtitle>
                  <List.Text {...(index === 0 ? props : {})}>
                    {preview}
                  </List.Text>
                </List.Content>
                <List.Trailing>
                  <List.Detail>{date}</List.Detail>
                </List.Trailing>
                <List.Trailing>
                  <List.DrillIn />
                </List.Trailing>
              </List.Item>
            ))}
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** A slot part's demo: a row with it, outlined, with its props. */
const useSlotControl = (
  id: string,
  title: string,
  options: typeof commonPropOptions | typeof propOptionsSlot,
) => {
  const [external] = useProvidedState(id);
  return usePropControl(options, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title,
  });
};

/** `List.Leading`: a spinner before the first row's content. */
const LeadingPart: FunctionComponent = () => {
  const id = 'list-parts-leading';
  const [log] = useLog();
  const [control, props, state] = useSlotControl(
    id,
    'List.Leading',
    propOptionsSlot,
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="List.Leading"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            <List.Item>
              <List.Leading {...props}>
                <ActivityIndicator
                  aria-label="Syncing"
                  size="small"
                />
              </List.Leading>
              <List.Content>
                <List.Title>Syncing</List.Title>
              </List.Content>
            </List.Item>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.Content`: the first row's text. */
const ContentPart: FunctionComponent = () => {
  const id = 'list-parts-content';
  const [log] = useLog();
  const [control, props, state] = useSlotControl(
    id,
    'List.Content',
    commonPropOptions,
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="List.Content"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            <List.Item>
              <List.Content {...props}>
                <List.Title>Mercury</List.Title>
                <List.Subtitle>Closest to the Sun</List.Subtitle>
              </List.Content>
            </List.Item>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.Trailing`: a switch after the first row's content. */
const TrailingPart: FunctionComponent = () => {
  const id = 'list-parts-trailing';
  const [log, addLog] = useLog();
  const [control, props, state] = useSlotControl(
    id,
    'List.Trailing',
    propOptionsSlot,
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="List.Trailing"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            <List.Item onClick={forwardClick('[role=switch]')}>
              <List.Content>
                <List.Title>Airplane Mode</List.Title>
              </List.Content>
              <List.Trailing {...props}>
                <Switch.Root
                  aria-label="Airplane Mode"
                  onCheckedChange={(isChecked: boolean) =>
                    addLog(`airplane mode: ${String(isChecked)}`)
                  }
                >
                  <Switch.Thumb />
                </Switch.Root>
              </List.Trailing>
            </List.Item>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.Span`: a slider across the first row. */
const SpanPart: FunctionComponent = () => {
  const id = 'list-parts-span';
  const [log] = useLog();
  const [control, props, state] = useSlotControl(
    id,
    'List.Span',
    commonPropOptions,
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="List.Span"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            <List.Item>
              <List.Span {...props}>
                <Slider.Root defaultValue={50}>
                  <Slider.Control>
                    <Slider.Track>
                      <Slider.Indicator />
                      <Slider.Thumb aria-label="Volume" />
                    </Slider.Track>
                  </Slider.Control>
                </Slider.Root>
              </List.Span>
            </List.Item>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.Below`: a line under the first row's. */
const BelowPart: FunctionComponent = () => {
  const id = 'list-parts-below';
  const [log] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    { ...commonPropOptions, hidden: [undefined, false, true] as const },
    { external, isOpen: true, emphasize: 'outline', title: 'List.Below' },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="List.Below"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            <List.Item>
              <List.Content>
                <List.Title>Backup</List.Title>
              </List.Content>
              <List.Trailing>
                <List.Detail>On</List.Detail>
              </List.Trailing>
              <List.Below {...props}>
                <List.Subtitle>Last backup: yesterday, 21:04</List.Subtitle>
              </List.Below>
            </List.Item>
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
  const [control, props, state] = usePropControl(commonPropOptions, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'List.Detail',
  });

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="List.Detail"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            {settings.map(({ detail, title }, index) => (
              <List.Item key={title}>
                <List.Content>
                  <List.Title>{title}</List.Title>
                </List.Content>
                <List.Trailing>
                  <List.Detail {...(index === 0 ? props : {})}>
                    {detail}
                  </List.Detail>
                </List.Trailing>
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
  const [control, props, state] = usePropControl(propOptionsImage, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'List.Image',
  });

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="List.Image"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            {settings.map(({ color, icon, title }, index) => (
              <List.Item key={title}>
                <List.Leading>
                  <List.Image
                    style={{ backgroundColor: color }}
                    variant="rounded"
                    {...(index === 0 ? props : {})}
                  >
                    <Symbol icon={icon} />
                  </List.Image>
                </List.Leading>
                <List.Content>
                  <List.Title>{title}</List.Title>
                </List.Content>
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
    { external, isOpen: true, emphasize: 'outline', title: 'List.Accessory' },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="List.Accessory"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            <List.Item>
              <List.Leading>
                <List.Image
                  style={{ backgroundColor: 'var(--color-ios-system-pink)' }}
                  variant="rounded"
                >
                  <Symbol icon={sfHeartFill} />
                </List.Image>
              </List.Leading>
              <List.Content>
                <List.Title>Favorites</List.Title>
              </List.Content>
              <List.Trailing>
                <List.Accessory
                  aria-label="Info"
                  {...props}
                >
                  <Symbol icon={sfICircle} />
                </List.Accessory>
              </List.Trailing>
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
  const [control, props, state] = usePropControl(commonPropOptions, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'List.Checkmark',
  });
  const [chosen, setChosen] = useState<string>(planets[0]);

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="List.Checkmark"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            {rows.map((name) => (
              <List.Item key={name}>
                <List.Content>
                  <List.Title
                    render={<button type="button" />}
                    onClick={() => {
                      addLog(`chosen: ${name}`);
                      setChosen(name);
                    }}
                  >
                    {name}
                  </List.Title>
                </List.Content>
                <List.Trailing>
                  {chosen === name ? <List.Checkmark {...props} /> : null}
                </List.Trailing>
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
  const [control, props, state] = usePropControl(commonPropOptions, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'List.DrillIn',
  });

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="List.DrillIn"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            {settings.map(({ detail, title }, index) => (
              <List.Item key={title}>
                <List.Content>
                  <List.Title
                    render={<button type="button" />}
                    onClick={() => addLog(`${title} clicked`)}
                  >
                    {title}
                  </List.Title>
                </List.Content>
                <List.Trailing>
                  <List.Detail>{detail}</List.Detail>
                </List.Trailing>
                <List.Trailing>
                  <List.DrillIn {...(index === 0 ? props : {})} />
                </List.Trailing>
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
  const [control, props, state] = usePropControl(commonPropOptions, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'List.Disclosure',
  });

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="List.Disclosure"
    >
      <List.Root>
        <Collapsible.Root
          defaultOpen
          render={<List.Section />}
          onOpenChange={(isOpen: boolean) => addLog(`open: ${String(isOpen)}`)}
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
                <List.Content>
                  <List.Title>{name}</List.Title>
                </List.Content>
              </List.Item>
            ))}
          </Collapsible.Panel>
        </Collapsible.Root>
      </List.Root>
    </Component>
  );
};

/** A row with a grabber, reordered by a handle (for the parts below). */
const ReorderRow: FunctionComponent<{
  readonly handle: ListReorderHandle;
  readonly name: string;
}> = ({ handle, name }) => (
  <List.Item
    dropName={name}
    reorderHandle={handle}
  >
    <List.Content>
      <List.Title>{name}</List.Title>
    </List.Content>
    <List.Trailing>
      <List.Grabber aria-label={`Reorder ${name}`} />
    </List.Trailing>
  </List.Item>
);

/** `List.DropGroup`: Venus to Mars reordered among themselves only. */
const DropGroupPart: FunctionComponent = () => {
  const id = 'list-parts-drop-group';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [order, setOrder] = useState<readonly string[]>(planets.slice(1, 4));
  const reorderRows = useCreateReorderHandle({
    onReorder: (change: ListReorderChange) => {
      addLog(
        `reorder: ${String(change.items[0]?.name)} after ${change.target.after ?? '–'} (${change.target.part} ${String(change.target.name)})`,
      );
      setOrder((current) =>
        List.reorder(current, change, (row: string) => row),
      );
    },
  });
  const [control, props, state] = usePropControl(
    useMemo(
      () => getPropOptionsDropTarget(reorderRows, 'middle'),
      [reorderRows],
    ),
    { external, isOpen: true, title: 'List.DropGroup' },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="List.DropGroup"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            <List.Item dropName="Mercury">
              <List.Content>
                <List.Title>Mercury</List.Title>
              </List.Content>
            </List.Item>
            <List.DropGroup {...props}>
              {order.map((name) => (
                <ReorderRow
                  key={name}
                  handle={reorderRows}
                  name={name}
                />
              ))}
            </List.DropGroup>
            <List.Item dropName="Jupiter">
              <List.Content>
                <List.Title>Jupiter</List.Title>
              </List.Content>
            </List.Item>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** `List.DropTarget`: rows moved to the top only. */
const DropTargetPart: FunctionComponent = () => {
  const id = 'list-parts-drop-target';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [order, setOrder] = useState<readonly string[]>(rows);
  const reorderRows = useCreateReorderHandle({
    onReorder: (change: ListReorderChange) => {
      addLog(
        `reorder: ${String(change.items[0]?.name)} before ${change.target.before ?? '–'} (${change.target.part} ${String(change.target.name)})`,
      );
      setOrder((current) =>
        List.reorder(current, change, (row: string) => row),
      );
    },
  });
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsDropTarget(reorderRows, 'top'), [reorderRows]),
    { external, isOpen: true, title: 'List.DropTarget' },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="List.DropTarget"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            <List.DropTarget {...props} />
            {order.map((name) => (
              <ReorderRow
                key={name}
                handle={reorderRows}
                name={name}
              />
            ))}
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/**
 * `List.createReorderHandle`: the planets' handle, its rows grabbed and
 * moved by buttons (imperatively), or dragged.
 */
const CreateReorderHandlePart: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [order, setOrder] = useState<readonly string[]>(planets);
  const [reorderPlanets] = useState(() =>
    codeLabel(
      List.createReorderHandle({
        onReorder: (change: ListReorderChange) => {
          addLog(
            `reorder (${change.items.map((item) => String(item.name)).join(', ')}) after ${change.target.after ?? '–'}`,
          );
          setOrder((current) =>
            List.reorder(current, change, (row: string) => row),
          );
        },
      }),
      'reorderPlanets',
      'const [reorderPlanets] = useState(() => List.createReorderHandle({ onReorder: … }));',
    ),
  );

  return (
    <Component
      isInline
      isStretched
      id="list-parts-create-reorder-handle"
      log={log}
      title="List.createReorderHandle"
    >
      <>
        <Button.Root
          variant="bordered"
          onClick={() => reorderPlanets.grab(['Venus', 'Earth'])}
        >
          <Button.Label>Grab Venus and Earth</Button.Label>
        </Button.Root>
        <Button.Root
          variant="bordered"
          onClick={() => reorderPlanets.move('previous')}
        >
          <Button.Label>Move Up</Button.Label>
        </Button.Root>
        <Button.Root
          variant="bordered"
          onClick={() => reorderPlanets.move('next')}
        >
          <Button.Label>Move Down</Button.Label>
        </Button.Root>
        <Button.Root
          variant="bordered"
          onClick={() => reorderPlanets.drop()}
        >
          <Button.Label>Drop</Button.Label>
        </Button.Root>
        <Button.Root
          variant="bordered"
          onClick={() => reorderPlanets.cancel()}
        >
          <Button.Label>Cancel</Button.Label>
        </Button.Root>
        <List.Root>
          <List.Section>
            <List.Group reorderHandle={reorderPlanets}>
              {order.map((name) => (
                <ReorderRow
                  key={name}
                  handle={reorderPlanets}
                  name={name}
                />
              ))}
            </List.Group>
          </List.Section>
        </List.Root>
      </>
    </Component>
  );
};

/** `useCreateReorderHandle`: the handle made in the component. */
const UseCreateReorderHandlePart: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [order, setOrder] = useState<readonly string[]>(rows);
  const reorderRows = codeLabel(
    useCreateReorderHandle({
      onReorder: (change: ListReorderChange) => {
        addLog(
          `reorder: ${String(change.items[0]?.name)} after ${change.target.after ?? '–'}`,
        );
        setOrder((current) =>
          List.reorder(current, change, (row: string) => row),
        );
      },
    }),
    'reorderRows',
    'const reorderRows = useCreateReorderHandle({ onReorder: … });',
  );

  return (
    <Component
      isInline
      isStretched
      id="list-parts-use-create-reorder-handle"
      log={log}
      title="useCreateReorderHandle"
    >
      <List.Root>
        <List.Section>
          <List.Group reorderHandle={reorderRows}>
            {order.map((name) => (
              <ReorderRow
                key={name}
                handle={reorderRows}
                name={name}
              />
            ))}
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

const reorderCode = `const [planets, setPlanets] = useState({ inner: ['Mercury', 'Venus'], outer: ['Jupiter'] });
const reorderPlanets = useCreateReorderHandle({
  onReorder: (change) =>
    setPlanets((current) => List.reorder(current, change, (name) => name)),
});`;

/** `List.Grabber` (the first row's), outlined, with its props. */
const GrabberPart: FunctionComponent = () => {
  const id = 'list-parts-grabber';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGrabber, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'List.Grabber',
  });
  const [order, setOrder] = useState<readonly string[]>(rows);
  const reorderRows = useCreateReorderHandle({
    onReorder: (change: ListReorderChange) => {
      addLog(
        `reorder: ${String(change.items[0]?.name)} after ${change.target.after ?? '(start)'}`,
      );
      setOrder((current) =>
        List.reorder(current, change, (row: string) => row),
      );
    },
  });

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="List.Grabber"
    >
      <List.Root>
        <List.Section>
          <List.Group reorderHandle={reorderRows}>
            {order.map((name, index) => (
              <List.Item
                key={name}
                dropName={name}
                reorderHandle={reorderRows}
              >
                <List.Content>
                  <List.Title>{name}</List.Title>
                </List.Content>
                <List.Trailing>
                  {index === 0 ? (
                    <List.Grabber {...props} />
                  ) : (
                    <List.Grabber aria-label={`Reorder ${name}`} />
                  )}
                </List.Trailing>
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
    { external, isOpen: true, emphasize: 'outline', title: 'List.Action' },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
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
                <List.Content>
                  <List.Title>{name}</List.Title>
                </List.Content>
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
    { external, isOpen: true, emphasize: 'outline', title: 'List.Button' },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="List.Button"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            <List.Item>
              <List.Content>
                <List.Button {...props}>Add Planet</List.Button>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Content>
                <List.Button
                  destructive
                  onClick={() => addLog('delete all clicked')}
                >
                  Delete All
                </List.Button>
              </List.Content>
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
    { external, isOpen: true, emphasize: 'outline', title: 'List.Checkbox' },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
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
                <List.Leading>
                  {index === 0 ? (
                    <List.Checkbox
                      key={elementKey}
                      aria-label={name}
                      {...props}
                    />
                  ) : (
                    <List.Checkbox aria-label={name} />
                  )}
                </List.Leading>
                <List.Content>
                  <List.Title>{name}</List.Title>
                </List.Content>
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
  const [control, props, state] = usePropControl(propOptionsRadio, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'List.Radio',
  });

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
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
                <List.Leading>
                  {index === 0 ? (
                    <List.Radio
                      aria-label={name}
                      {...props}
                    />
                  ) : (
                    <List.Radio
                      aria-label={name}
                      value={name}
                    />
                  )}
                </List.Leading>
                <List.Content>
                  <List.Title>{name}</List.Title>
                </List.Content>
              </List.Item>
            ))}
          </RadioGroup>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/**
 * `List.EditButton` (the first row's), outlined: deleting rows (a minus in
 * red), and an insert row adding one (a plus in green).
 */
const EditButtonPart: FunctionComponent = () => {
  const id = 'list-parts-edit-button';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsEditButton(addLog), [addLog]),
    { external, isOpen: true, emphasize: 'outline', title: 'List.EditButton' },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="List.EditButton"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            {rows.map((name, index) => (
              <List.Item key={name}>
                <List.Leading>
                  <List.EditButton
                    aria-label={`Delete ${name}`}
                    tint="var(--color-ios-system-red)"
                    onClick={() => addLog(`edit button: delete ${name}`)}
                    {...(index === 0 ? props : {})}
                  >
                    <Symbol icon={sfMinus} />
                  </List.EditButton>
                </List.Leading>
                <List.Content>
                  <List.Title>{name}</List.Title>
                </List.Content>
              </List.Item>
            ))}
            <List.Item>
              <List.Leading>
                <List.EditButton
                  aria-label="Add Planet"
                  tint="var(--color-ios-system-green)"
                  onClick={() => addLog('edit button: add planet')}
                >
                  <Symbol icon={sfPlus} />
                </List.EditButton>
              </List.Leading>
              <List.Content>
                <List.Title>Add Planet</List.Title>
              </List.Content>
            </List.Item>
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
    {
      external,
      isOpen: true,
      emphasize: 'outline',
      title: 'List.SwipeActions',
    },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="List.SwipeActions"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            {rows.map((name, index) => (
              <List.Item key={name}>
                <List.Content>
                  <List.Title>{name}</List.Title>
                </List.Content>
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

/**
 * `List.SwipeActionsTrigger` (the first row's), outlined: opening its row's
 * actions on its side (Pin leading, Delete trailing).
 */
const SwipeActionsTriggerPart: FunctionComponent = () => {
  const id = 'list-parts-swipe-actions-trigger';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsSwipeActionsTrigger,
    {
      external,
      isOpen: true,
      emphasize: 'outline',
      title: 'List.SwipeActionsTrigger',
    },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="List.SwipeActionsTrigger"
    >
      <List.Root>
        <List.Section>
          <List.Group>
            {rows.map((name, index) => (
              <List.Item key={name}>
                <List.Leading>
                  {index === 0 ? (
                    <List.SwipeActionsTrigger
                      {...props}
                      render={
                        <List.EditButton
                          aria-label={`Delete ${name}`}
                          tint="var(--color-ios-system-red)"
                        >
                          <Symbol icon={sfMinus} />
                        </List.EditButton>
                      }
                    />
                  ) : (
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
                  )}
                </List.Leading>
                <List.Content>
                  <List.Title>{name}</List.Title>
                </List.Content>
                <List.SwipeActions side="inline-start">
                  <List.SwipeAction
                    label="Pin"
                    onClick={() => addLog(`pin ${name}`)}
                  >
                    <Symbol icon={sfFlagFill} />
                  </List.SwipeAction>
                </List.SwipeActions>
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

/**
 * `List.createSwipeActionsHandle`: Mercury's actions by a module-level
 * handle, opened by a trigger outside the list, closed imperatively.
 */
const CreateSwipeActionsHandlePart: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      isInline
      isStretched
      id="list-parts-create-swipe-actions-handle"
      log={log}
      title="List.createSwipeActionsHandle"
    >
      <>
        <List.SwipeActionsTrigger
          handle={mercuryActions}
          render={<Button.Root variant="bordered" />}
        >
          <Button.Label>Show Mercury’s Actions</Button.Label>
        </List.SwipeActionsTrigger>
        <Button.Root
          variant="bordered"
          onClick={() => mercuryActions.close()}
        >
          <Button.Label>Close Them</Button.Label>
        </Button.Root>
        <List.Root>
          <List.Section>
            <List.Group>
              {rows.map((name, index) => (
                <List.Item key={name}>
                  <List.Content>
                    <List.Title>{name}</List.Title>
                  </List.Content>
                  <List.SwipeActions
                    handle={index === 0 ? mercuryActions : undefined}
                  >
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
      </>
    </Component>
  );
};

/**
 * `useCreateSwipeActionsHandle`: the same, the handle made in the
 * component.
 */
const UseCreateSwipeActionsHandlePart: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const mercuryRowActions = codeLabel(
    useCreateSwipeActionsHandle(),
    'mercuryRowActions',
    'const mercuryRowActions = useCreateSwipeActionsHandle();',
  );

  return (
    <Component
      isInline
      isStretched
      id="list-parts-use-create-swipe-actions-handle"
      log={log}
      title="useCreateSwipeActionsHandle"
    >
      <>
        <List.SwipeActionsTrigger
          handle={mercuryRowActions}
          render={<Button.Root variant="bordered" />}
        >
          <Button.Label>Show Mercury’s Actions</Button.Label>
        </List.SwipeActionsTrigger>
        <List.Root>
          <List.Section>
            <List.Group>
              {rows.map((name, index) => (
                <List.Item key={name}>
                  <List.Content>
                    <List.Title>{name}</List.Title>
                  </List.Content>
                  <List.SwipeActions
                    handle={index === 0 ? mercuryRowActions : undefined}
                  >
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
      </>
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
    { external, isOpen: true, emphasize: 'outline', title: 'List.SwipeAction' },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="List.SwipeAction"
    >
      <List.Root listStyle="plain">
        <List.Section>
          <List.Group>
            {messages.map(({ date, from, preview, subject }, index) => (
              <List.Item key={from}>
                <List.Leading>
                  <List.Image variant="circular">
                    <Symbol icon={sfPersonCropCircleFill} />
                  </List.Image>
                </List.Leading>
                <List.Content>
                  <List.Title>{from}</List.Title>
                  <List.Subtitle>{subject}</List.Subtitle>
                  <List.Text>{preview}</List.Text>
                </List.Content>
                <List.Trailing>
                  <List.Detail>{date}</List.Detail>
                </List.Trailing>
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
  const [control, props, state] = usePropControl(propOptionsIndex, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'List.Index',
  });

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
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
                      <List.Content>
                        <List.Title>{name}</List.Title>
                      </List.Content>
                    </List.Item>
                  ))}
                </List.Group>
              </List.Section>
            ))}
          </List.Root>
        </div>
        <div className="list-demo-index">
          <List.Index {...props}>
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
    { external, isOpen: true, emphasize: 'outline', title: 'List.IndexItem' },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
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
                      <List.Content>
                        <List.Title>{name}</List.Title>
                      </List.Content>
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

const forwardClickCode = `<List.Item onClick={forwardClick('[role=switch]')}>
  <List.Content>
    <List.Title>Wi-Fi</List.Title>
  </List.Content>
  <List.Trailing>
    <Switch.Root aria-label="Wi-Fi">
      <Switch.Thumb />
    </Switch.Root>
  </List.Trailing>
</List.Item>`;

/** `/list/parts`: a list's parts, from the root to its rows' parts. */
export const ListParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        A{' '}
        <PartLink
          component="list"
          part="List.Root"
        />{' '}
        of sections.
      </li>
      <li>
        A section: a header, a group of rows (or a block of text), a footer.
      </li>
      <li>
        A row: a grid of parts; leading (an edit control, an image), its title
        (and subtitle, text), trailing parts.
      </li>
      <li>A row’s swipe actions: revealed by swiping.</li>
    </ul>
    <ul>
      <li>
        <PartLink
          component="list"
          part="List.Root"
        />
        <ul>
          <li>
            <PartLink
              component="list"
              part="List.Section"
            />{' '}
            (one or more)
            <ul>
              <li>
                <PartLink
                  component="list"
                  part="List.Header"
                />{' '}
                (optional):{' '}
                <PartLink
                  component="list"
                  part="List.Supertitle"
                />
                ,{' '}
                <PartLink
                  component="list"
                  part="List.Title"
                />
                ,{' '}
                <PartLink
                  component="list"
                  part="List.Subtitle"
                />
                ,{' '}
                <PartLink
                  component="list"
                  part="List.Accessory"
                />
                ,{' '}
                <PartLink
                  component="list"
                  part="List.Action"
                />
                ,{' '}
                <PartLink
                  component="list"
                  part="List.Disclosure"
                />
              </li>
              <li>
                <PartLink
                  component="list"
                  part="List.Group"
                />
                , or{' '}
                <PartLink
                  component="list"
                  part="List.Block"
                />
                <ul>
                  <li>
                    <PartLink
                      component="list"
                      part="List.Item"
                    />{' '}
                    (or{' '}
                    <PartLink
                      component="list"
                      part="List.CollapsiblePanel"
                    />
                    , in a{' '}
                    <PartLink
                      component="list"
                      part="List.CollapsibleRoot"
                    />{' '}
                    with the row whose{' '}
                    <PartLink
                      component="list"
                      part="List.CollapsibleTrigger"
                    />{' '}
                    toggles it; or, one open at a time, of an{' '}
                    <PartLink
                      component="list"
                      part="List.AccordionItem"
                    />{' '}
                    (its{' '}
                    <PartLink
                      component="list"
                      part="List.AccordionTrigger"
                    />
                    ,{' '}
                    <PartLink
                      component="list"
                      part="List.AccordionPanel"
                    />
                    ) in an{' '}
                    <PartLink
                      component="list"
                      part="List.AccordionRoot"
                    />
                    ; one or more)
                    <ul>
                      <li>
                        <PartLink
                          component="list"
                          part="List.Leading"
                        />{' '}
                        (optional, one or more: before the content)
                        <ul>
                          <li>
                            <PartLink
                              component="list"
                              part="List.Checkbox"
                            />
                            ,{' '}
                            <PartLink
                              component="list"
                              part="List.Radio"
                            />{' '}
                            or{' '}
                            <PartLink
                              component="list"
                              part="List.EditButton"
                            />
                            ;{' '}
                            <PartLink
                              component="list"
                              part="List.Image"
                            />
                            ; or any element (e.g. an ActivityIndicator)
                          </li>
                        </ul>
                      </li>
                      <li>
                        <PartLink
                          component="list"
                          part="List.Content"
                        />{' '}
                        (its text, taking the rest of the line)
                        <ul>
                          <li>
                            <PartLink
                              component="list"
                              part="List.Title"
                            />{' '}
                            (or{' '}
                            <PartLink
                              component="list"
                              part="List.Button"
                            />
                            ),{' '}
                            <PartLink
                              component="list"
                              part="List.Subtitle"
                            />{' '}
                            (optional),{' '}
                            <PartLink
                              component="list"
                              part="List.Text"
                            />{' '}
                            (optional)
                          </li>
                        </ul>
                      </li>
                      <li>
                        <PartLink
                          component="list"
                          part="List.Trailing"
                        />{' '}
                        (optional, one or more: after the content)
                        <ul>
                          <li>
                            <PartLink
                              component="list"
                              part="List.Detail"
                            />
                            ,{' '}
                            <PartLink
                              component="list"
                              part="List.Accessory"
                            />
                            ,{' '}
                            <PartLink
                              component="list"
                              part="List.Action"
                            />
                            ,{' '}
                            <PartLink
                              component="list"
                              part="List.Checkmark"
                            />
                            ,{' '}
                            <PartLink
                              component="list"
                              part="List.DrillIn"
                            />
                            ,{' '}
                            <PartLink
                              component="list"
                              part="List.Disclosure"
                            />
                            ,{' '}
                            <PartLink
                              component="list"
                              part="List.Grabber"
                            />
                            ; or any element (e.g. a Switch)
                          </li>
                        </ul>
                      </li>
                      <li>
                        Or{' '}
                        <PartLink
                          component="list"
                          part="List.Span"
                        />{' '}
                        (across the line, in place of the above: e.g. a Slider)
                      </li>
                      <li>
                        <PartLink
                          component="list"
                          part="List.Below"
                        />{' '}
                        (optional: a line under it, e.g. a field’s messages)
                      </li>
                      <li>
                        <PartLink
                          component="list"
                          part="List.SwipeActions"
                        />{' '}
                        (optional, one per side)
                        <ul>
                          <li>
                            <PartLink
                              component="list"
                              part="List.SwipeAction"
                            />{' '}
                            (one or more)
                          </li>
                        </ul>
                      </li>
                      <li>
                        <PartLink
                          component="list"
                          part="List.SwipeActionsTrigger"
                        />{' '}
                        (optional: opening the row’s actions, e.g. rendering its{' '}
                        <PartLink
                          component="list"
                          part="List.EditButton"
                        />
                        )
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                <PartLink
                  component="list"
                  part="List.Footer"
                />{' '}
                (optional)
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        <PartLink
          component="list"
          part="List.Index"
        />{' '}
        (optional, beside a plain list)
        <ul>
          <li>
            <PartLink
              component="list"
              part="List.IndexItem"
            />{' '}
            (one per letter)
          </li>
        </ul>
      </li>
      <li>
        <PartLink
          component="list"
          part="forwardClick"
        />{' '}
        (a helper: a row’s click handler)
      </li>
      <li>
        Swipe actions handles (optional: a row’s actions’ <code>handle</code>,
        its triggers’):
        <ul>
          <li>
            <PartLink
              component="list"
              part="List.createSwipeActionsHandle"
            />{' '}
            (at module level), or
          </li>
          <li>
            <PartLink
              component="list"
              part="useCreateSwipeActionsHandle"
            />{' '}
            (in a component)
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="list-root"
      level={2}
    >
      <code>List.Root</code>
    </Heading>
    <ul>
      <li>The list.</li>
      <li>
        Style, for all its parts: <code>listStyle</code> (UIKit{' '}
        <code>UITableView.Style</code>).
      </li>
      <li>Whether its groups are outlined.</li>
      <li>
        Edit mode: <code>editing</code>, by side (leading edit controls,
        trailing grabbers, both, none, or not managed), the default its
        sections, groups and rows override; their parts follow by their{' '}
        <code>whileEditing</code>. Sections editing separately:{' '}
        <a href="list/composition#editing-sections-separately">
          Editing sections separately
        </a>
        .
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={listRootRows} />

    <Heading
      id="list-section"
      level={2}
    >
      <code>List.Section</code>
    </Heading>
    <ul>
      <li>
        A section (a <code>section</code>).
      </li>
      <li>
        An optional{' '}
        <PartLink
          component="list"
          part="List.Header"
        >
          Header
        </PartLink>
        , a{' '}
        <PartLink
          component="list"
          part="List.Group"
        >
          Group
        </PartLink>{' '}
        of rows (or a{' '}
        <PartLink
          component="list"
          part="List.Block"
        >
          Block
        </PartLink>
        ), an optional{' '}
        <PartLink
          component="list"
          part="List.Footer"
        >
          Footer
        </PartLink>
        .
      </li>
      <li>35px apart.</li>
    </ul>
    <SectionPart />
    <h3>Props</h3>
    <PropsTable rows={listSectionRows} />

    <Heading
      id="list-header"
      level={2}
    >
      <code>List.Header</code>
    </Heading>
    <ul>
      <li>A section’s header.</li>
      <li>
        A title (a heading, by <code>render</code>); optionally a supertitle, a
        subtitle, trailing parts (an{' '}
        <PartLink
          component="list"
          part="List.Accessory"
        >
          Accessory
        </PartLink>
        , an{' '}
        <PartLink
          component="list"
          part="List.Action"
        >
          Action
        </PartLink>
        ).
      </li>
      <li>
        <code>prominence</code>: prominent, nested (a plain list’s sticky
        section title), extra prominent.
      </li>
    </ul>
    <HeaderPart />
    <h3>Props</h3>
    <PropsTable rows={listHeaderRows} />

    <Heading
      id="list-group"
      level={2}
    >
      <code>List.Group</code>
    </Heading>
    <ul>
      <li>
        A section’s rows (a <code>ul</code>), on the rows’ background.
      </li>
      <li>Inset with rounded corners, full width, or plain.</li>
      <li>
        Given a reorder handle (
        <PartLink
          component="list"
          part="List.createReorderHandle"
        />
        ), its rows’ gaps are targets: rows of the handle (dragged by their{' '}
        <PartLink
          component="list"
          part="List.Grabber"
        >
          Grabber
        </PartLink>
        ) can be dropped before, between and after them; the handle’s{' '}
        <code>onReorder</code> is called, the app reorders its rows.
      </li>
    </ul>
    <GroupPart />
    <h3>Props</h3>
    <PropsTable rows={listGroupRows} />

    <Heading
      id="list-dropgroup"
      level={2}
    >
      <code>List.DropGroup</code>
    </Heading>
    <ul>
      <li>
        A range of rows whose gaps are targets of its reorder handles (as a{' '}
        <PartLink
          component="list"
          part="List.Group"
        />{' '}
        given one): before, between and after its rows.
      </li>
      <li>
        No element of its own: placed around some of a group’s rows, they stay
        the group’s (its separators, its corners); the rows around it aren’t
        targets. Only an empty, hidden element marks where it is: emptied, it’s
        still a target there.
      </li>
      <li>
        Here: Mercury and Jupiter stay where they are; Venus to Mars are
        reordered between them.
      </li>
    </ul>
    <DropGroupPart />
    <h3>Props</h3>
    <PropsTable rows={listDropGroupRows} />

    <Heading
      id="list-droptarget"
      level={2}
    >
      <code>List.DropTarget</code>
    </Heading>
    <ul>
      <li>
        A gap rows of its reorder handles can be dropped into, where it’s placed
        among a group’s rows (an empty, hidden element only marking it).
      </li>
      <li>Here: the only target, at the top: rows can only be moved there.</li>
    </ul>
    <DropTargetPart />
    <h3>Props</h3>
    <PropsTable rows={listDropTargetRows} />

    <Heading
      id="list-item"
      level={2}
    >
      <code>List.Item</code>
    </Heading>
    <ul>
      <li>
        A row (an <code>li</code>): its slots in a line, with a separator.
      </li>
      <li>At least 52px high (68px with a subtitle).</li>
      <li>
        Pressable through its title (or a{' '}
        <PartLink
          component="list"
          part="List.Button"
        >
          Button
        </PartLink>
        ), or by its own <code>onClick</code> (e.g.{' '}
        <PartLink part="forwardClick" />
        ).
      </li>
      <li>
        Can be <code>selected</code>, indented (<code>level</code>), swiped for
        its{' '}
        <PartLink
          component="list"
          part="List.SwipeActions"
        >
          SwipeActions
        </PartLink>
        .
      </li>
    </ul>
    <ItemPart />
    <h3>Props</h3>
    <PropsTable rows={listItemRows} />

    <Heading
      id="list-collapsibleroot"
      level={2}
    >
      <code>List.CollapsibleRoot</code>
    </Heading>
    <ul>
      <li>
        Rows’ state, as Base UI’s <code>Collapsible.Root</code>:{' '}
        <code>defaultOpen</code>, or <code>open</code> and{' '}
        <code>onOpenChange</code> (with Base UI’s reasons);{' '}
        <code>disabled</code>.
      </li>
      <li>
        Around the row toggling it and the{' '}
        <PartLink
          component="list"
          part="List.CollapsiblePanel"
        >
          CollapsiblePanel
        </PartLink>
        .
      </li>
      <li>Renders no element: they stay its group’s children.</li>
      <li>
        A{' '}
        <PartLink
          component="list"
          part="List.Disclosure"
        />{' '}
        in it turns down while open.
      </li>
    </ul>
    <CollapsibleRootPart />
    <h3>Props</h3>
    <PropsTable rows={listCollapsibleRootRows} />

    <Heading
      id="list-collapsibletrigger"
      level={2}
    >
      <code>List.CollapsibleTrigger</code>
    </Heading>
    <ul>
      <li>
        A button toggling its root’s rows (Base UI’s{' '}
        <code>Collapsible.Trigger</code>): <code>aria-expanded</code>,{' '}
        <code>aria-controls</code> (its panel’s rows), and{' '}
        <code>data-panel-open</code>.
      </li>
      <li>Rendered by the row’s title: makes the row pressable.</li>
    </ul>
    <CollapsibleTriggerPart />
    <h3>Props</h3>
    <PropsTable rows={listCollapsibleTriggerRows} />

    <Heading
      id="list-collapsiblepanel"
      level={2}
    >
      <code>List.CollapsiblePanel</code>
    </Heading>
    <ul>
      <li>
        Rows shown or not (Base UI’s <code>Collapsible.Panel</code>), opening
        and closing in place together, e.g. an inline picker below the row
        toggling them (iOS’s Calendar).
      </li>
      <li>
        A container of{' '}
        <PartLink
          component="list"
          part="List.Item"
        />
        s placed among the group’s rows, without an element of its own: each
        stays a row of the group (its separator, its corners as the group’s
        first or last).
      </li>
      <li>
        Open as its{' '}
        <PartLink
          component="list"
          part="List.CollapsibleRoot"
        >
          CollapsibleRoot
        </PartLink>{' '}
        (or{' '}
        <PartLink
          component="list"
          part="List.AccordionItem"
        />
        ) is; in another’s rows, closed with them.
      </li>
      <li>Closed: its rows are inert.</li>
      <li>Here: two rows, opened by the trigger row above them.</li>
    </ul>
    <CollapsiblePanelPart />
    <h3>Props</h3>
    <PropsTable rows={listCollapsiblePanelRows} />

    <Heading
      id="list-accordionroot"
      level={2}
    >
      <code>List.AccordionRoot</code>
    </Heading>
    <ul>
      <li>
        Collapsibles, one open at a time (unless <code>multiple</code>), as Base
        UI’s <code>Accordion.Root</code>: its{' '}
        <PartLink
          component="list"
          part="List.AccordionItem"
        />
        s, by their <code>value</code>.
      </li>
      <li>
        State: <code>defaultValue</code>, or <code>value</code> and{' '}
        <code>onValueChange</code> (arrays of the items open);{' '}
        <code>disabled</code>.
      </li>
      <li>Renders no element: its items’ rows stay its group’s children.</li>
      <li>
        A{' '}
        <PartLink
          component="date-picker"
          part="DatePicker.Root"
        />{' '}
        with a <code>handle</code> in an item opens and closes with it (its{' '}
        <PartLink
          component="date-picker"
          part="DatePicker.Expandable"
        />
        ’s rows: see{' '}
        <a href="list/composition#rows-expanding-together">
          Rows expanding together
        </a>
        ).
      </li>
      <li>Here: an alarm’s Repeat and Alert, each opening below its row.</li>
    </ul>
    <AccordionRootPart />
    <h3>Props</h3>
    <PropsTable rows={listAccordionRootRows} />

    <Heading
      id="list-accordionitem"
      level={2}
    >
      <code>List.AccordionItem</code>
    </Heading>
    <ul>
      <li>
        A collapsible of its root (Base UI’s <code>Accordion.Item</code>), open
        as the root holds, by its <code>value</code>: its trigger and panel as a{' '}
        <PartLink
          component="list"
          part="List.CollapsibleRoot"
        />
        ’s.
      </li>
      <li>Renders no element.</li>
      <li>Here: Repeat’s (with Alert’s after it).</li>
    </ul>
    <AccordionItemPart />
    <h3>Props</h3>
    <PropsTable rows={listAccordionItemRows} />

    <Heading
      id="list-accordiontrigger"
      level={2}
    >
      <code>List.AccordionTrigger</code>
    </Heading>
    <ul>
      <li>
        Base UI’s name in an accordion for{' '}
        <PartLink
          component="list"
          part="List.CollapsibleTrigger"
        />
        : the same part (its props, there), toggling its{' '}
        <PartLink
          component="list"
          part="List.AccordionItem"
        />
        .
      </li>
    </ul>

    <Heading
      id="list-accordionpanel"
      level={2}
    >
      <code>List.AccordionPanel</code>
    </Heading>
    <ul>
      <li>
        Base UI’s name in an accordion for{' '}
        <PartLink
          component="list"
          part="List.CollapsiblePanel"
        />
        : the same part (its props, there), its{' '}
        <PartLink
          component="list"
          part="List.AccordionItem"
        />
        ’s rows.
      </li>
    </ul>

    <Heading
      id="list-footer"
      level={2}
    >
      <code>List.Footer</code>
    </Heading>
    <ul>
      <li>
        A section’s footer: text below its group (or block), aligned with the
        rows’ text.
      </li>
      <li>
        Or its actions: buttons alone in it, 16px below the group, stacked and
        centered, as wide as the group at most (a <code>fill</code>{' '}
        <a href="button">Button</a> spanning it). A section can have both: a
        footer of text, then one of actions. The gap is the list’s, not the
        buttons’ (see{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />{' '}
        for the gap at a scroll container’s end).
      </li>
    </ul>
    <FooterPart />
    <h3>Props</h3>
    <PropsTable rows={listFooterRows} />

    <Heading
      id="list-block"
      level={2}
    >
      <code>List.Block</code>
    </Heading>
    <ul>
      <li>
        Text in a section instead of rows (Framework7’s content block), aligned
        with the rows’ text.
      </li>
      <li>
        <code>strong</code>: on the rows’ background.
      </li>
    </ul>
    <BlockPart />
    <h3>Props</h3>
    <PropsTable rows={listBlockRows} />

    <Heading
      id="list-leading"
      level={2}
    >
      <code>List.Leading</code>
    </Heading>
    <ul>
      <li>
        A slot before a row’s content: what’s in it in a line (edit controls, an
        image, any element); several per row.
      </li>
      <li>
        In edit mode, sliding in (<code>whileEditing=&quot;show&quot;</code>,
        e.g. edit controls’) or out (<code>hide</code>), as it says; unset, it
        stays, whatever it holds.
      </li>
    </ul>
    <LeadingPart />
    <h3>Props</h3>
    <PropsTable rows={listLeadingRows} />

    <Heading
      id="list-content"
      level={2}
    >
      <code>List.Content</code>
    </Heading>
    <ul>
      <li>
        A row’s text: its
        <PartLink
          component="list"
          part="List.Title"
        />
        ,
        <PartLink
          component="list"
          part="List.Subtitle"
        />
        ,
        <PartLink
          component="list"
          part="List.Text"
        />
        (or a
        <PartLink
          component="list"
          part="List.Button"
        />
        , a field’s label), taking the rest of the line; every row has one, or a
        <PartLink
          component="list"
          part="List.Span"
        />
        .
      </li>
      <li>
        Its separator starts where it does (anchored to it, moving with it).
      </li>
    </ul>
    <ContentPart />
    <h3>Props</h3>
    <PropsTable rows={listContentRows} />

    <Heading
      id="list-trailing"
      level={2}
    >
      <code>List.Trailing</code>
    </Heading>
    <ul>
      <li>
        A slot after a row’s content: what’s in it in a line, 16px apart
        (details, chevrons, a grabber, any element, e.g. a
        <a href="switch">Switch</a>); several per row.
      </li>
      <li>
        In edit mode, sliding in (<code>whileEditing=&quot;show&quot;</code>,
        e.g. a grabber’s) or out (<code>hide</code>, e.g. a chevron’s), as it
        says; unset, it stays, whatever it holds.
      </li>
    </ul>
    <TrailingPart />
    <h3>Props</h3>
    <PropsTable rows={listTrailingRows} />

    <Heading
      id="list-span"
      level={2}
    >
      <code>List.Span</code>
    </Heading>
    <ul>
      <li>
        Content across a row’s whole line, in place of the others (e.g. a
        <a href="slider">Slider</a>, a <a href="segmented">Segmented</a>
        control, an inline calendar).
      </li>
    </ul>
    <SpanPart />
    <h3>Props</h3>
    <PropsTable rows={listSpanRows} />

    <Heading
      id="list-below"
      level={2}
    >
      <code>List.Below</code>
    </Heading>
    <ul>
      <li>
        A line under a row’s line, across it (e.g. a field’s description and
        error, a status, a message’s preview); last in its row.
      </li>
      <li>
        It starts where the row’s content does (after its leading parts, e.g. an
        image; measured, also as edit mode moves it), and runs to the row’s end,
        under its trailing parts too.
      </li>
      <li>
        Hidden (<code>hidden</code>), it collapses: growing and shrinking as
        it’s shown and hidden, kept rendered.
      </li>
    </ul>
    <BelowPart />
    <h3>Props</h3>
    <PropsTable rows={listBelowRows} />

    <Heading
      id="list-title"
      level={2}
    >
      <code>List.Title</code>
    </Heading>
    <ul>
      <li>A row’s (or header’s) title, in Body.</li>
      <li>
        As a button or link (<code>render</code>): makes the row pressable; its
        hit area covers the row, beneath the trailing controls.
      </li>
    </ul>
    <TitlePart />
    <h3>Props</h3>
    <PropsTable rows={listTitleRows} />

    <Heading
      id="list-subtitle"
      level={2}
    >
      <code>List.Subtitle</code>
    </Heading>
    <ul>
      <li>
        A second line below the title: in a row (making it tall), or a header.
      </li>
    </ul>
    <SubtitlePart />
    <h3>Props</h3>
    <PropsTable rows={listSubtitleRows} />

    <Heading
      id="list-supertitle"
      level={2}
    >
      <code>List.Supertitle</code>
    </Heading>
    <ul>
      <li>A line above a header’s title.</li>
    </ul>
    <SupertitlePart />
    <h3>Props</h3>
    <PropsTable rows={listSupertitleRows} />

    <Heading
      id="list-text"
      level={2}
    >
      <code>List.Text</code>
    </Heading>
    <ul>
      <li>Body text below a row’s title and subtitle: a media row (Mail).</li>
      <li>
        Up to <code>lines</code> lines, ellipsized.
      </li>
    </ul>
    <TextPart />
    <h3>Props</h3>
    <PropsTable rows={listTextRows} />

    <Heading
      id="list-detail"
      level={2}
    >
      <code>List.Detail</code>
    </Heading>
    <ul>
      <li>
        A trailing value in the secondary color, e.g. a setting’s current value.
      </li>
    </ul>
    <DetailPart />
    <h3>Props</h3>
    <PropsTable rows={listDetailRows} />

    <Heading
      id="list-image"
      level={2}
    >
      <code>List.Image</code>
    </Heading>
    <ul>
      <li>A leading image, one line high.</li>
      <li>
        A symbol alone, or a symbol or picture in a rounded, circular or filled
        frame (<code>variant</code>).
      </li>
    </ul>
    <ImagePart />
    <h3>Props</h3>
    <PropsTable rows={listImageRows} />

    <Heading
      id="list-accessory"
      level={2}
    >
      <code>List.Accessory</code>
    </Heading>
    <ul>
      <li>A trailing symbol in the tint color.</li>
      <li>
        As a button (<code>render</code>): pressable on its own, e.g. an info
        button.
      </li>
    </ul>
    <AccessoryPart />
    <h3>Props</h3>
    <PropsTable rows={listAccessoryRows} />

    <Heading
      id="list-checkmark"
      level={2}
    >
      <code>List.Checkmark</code>
    </Heading>
    <ul>
      <li>
        A trailing checkmark in the tint color: the chosen row of a list of
        options (iOS’s settings).
      </li>
    </ul>
    <CheckmarkPart />
    <h3>Props</h3>
    <PropsTable rows={listCheckmarkRows} />

    <Heading
      id="list-drillin"
      level={2}
    >
      <code>List.DrillIn</code>
    </Heading>
    <ul>
      <li>A trailing chevron: the row opens a page (drills in).</li>
      <li>Hidden from assistive technology.</li>
    </ul>
    <DrillInPart />
    <h3>Props</h3>
    <PropsTable rows={listDrillInRows} />

    <Heading
      id="list-disclosure"
      level={2}
    >
      <code>List.Disclosure</code>
    </Heading>
    <ul>
      <li>A chevron in the tint color, turned down while open.</li>
      <li>
        In a header (or row) that’s a Base UI <code>Collapsible.Trigger</code>;
        its group the panel.
      </li>
      <li>Hidden from assistive technology.</li>
    </ul>
    <DisclosurePart />
    <h3>Props</h3>
    <PropsTable rows={listDisclosureRows} />

    <Heading
      id="list-grabber"
      level={2}
    >
      <code>List.Grabber</code>
    </Heading>
    <ul>
      <li>
        A trailing handle dragging its row (given a reorder handle,{' '}
        <PartLink
          component="list"
          part="List.Item"
        />
        ’s <code>reorderHandle</code>) to its handle’s targets.
      </li>
      <li>
        Focused: arrow keys move the row to the previous or next target (across
        groups too), announced.
      </li>
    </ul>
    <GrabberPart />
    <h3>Props</h3>
    <PropsTable rows={listGrabberRows} />

    <Heading
      id="list-createreorderhandle"
      level={2}
    >
      <code>List.createReorderHandle</code>
    </Heading>
    <ul>
      <li>
        A reordering: given to the rows it moves (
        <PartLink
          component="list"
          part="List.Item"
        />
        ’s <code>reorderHandle</code>, named by their <code>dropName</code>) and
        to where they can be dropped (
        <PartLink
          component="list"
          part="List.Group"
        />
        ,{' '}
        <PartLink
          component="list"
          part="List.DropGroup"
        />
        ,{' '}
        <PartLink
          component="list"
          part="List.DropTarget"
        />
        ), anywhere in the list; its <code>onReorder</code> tells the app what
        moved and where.
      </li>
      <li>
        A row can be given several (its <code>reorderHandle</code> an array, by
        priority), as can a target: dropped where several are targets, the row’s
        first one there is called.
      </li>
      <li>
        The app grabs rows itself (<code>grab</code>, by their names: e.g.
        several selected ones, dragged together by one of their grabbers), and
        moves them (<code>move</code>, <code>drop</code>, <code>cancel</code>).
      </li>
      <li>
        Here: made once in the component’s state (in a component, rather{' '}
        <PartLink
          component="list"
          part="useCreateReorderHandle"
        />
        ), Venus and Earth grabbed and moved by the buttons.
      </li>
    </ul>
    <CreateReorderHandlePart />
    <h3>Options, returns</h3>
    <PropsTable rows={listReorderHandleRows} />

    <Heading
      id="usecreatereorderhandle"
      level={2}
    >
      <code>useCreateReorderHandle</code>
    </Heading>
    <ul>
      <li>
        <PartLink
          component="list"
          part="List.createReorderHandle"
        />{' '}
        in a component: made once, for its lifetime, its options the latest.
      </li>
    </ul>
    <UseCreateReorderHandlePart />
    <h3>Options, returns</h3>
    <PropsTable rows={listReorderHandleRows} />

    <Heading
      id="list-reorder"
      level={2}
    >
      <code>List.reorder</code>
    </Heading>
    <ul>
      <li>
        Applies a reorder handle’s change to the app’s rows: a list, or lists by
        their group’s (or drop group’s) <code>dropName</code>, e.g. one per
        section.
      </li>
      <li>
        By names, not indexes: the moved rows taken out, put after the row
        before the gap (rows the app doesn’t hold, e.g. a pinned one, taken as
        those around), or into an empty list by its name.
      </li>
    </ul>
    <CodeView code={reorderCode} />
    <h3>Arguments and return</h3>
    <PropsTable rows={listReorderRows} />

    <Heading
      id="list-action"
      level={2}
    >
      <code>List.Action</code>
    </Heading>
    <ul>
      <li>
        Text in the tint color as a button: trailing in a header (e.g. See All)
        or a row.
      </li>
    </ul>
    <ActionPart />
    <h3>Props</h3>
    <PropsTable rows={listActionRows} />

    <Heading
      id="list-button"
      level={2}
    >
      <code>List.Button</code>
    </Heading>
    <ul>
      <li>A row that’s a button: the whole row pressable.</li>
      <li>
        Its title in the tint color, or red (<code>destructive</code>).
      </li>
    </ul>
    <ButtonPart />
    <h3>Props</h3>
    <PropsTable rows={listButtonRows} />

    <Heading
      id="list-checkbox"
      level={2}
    >
      <code>List.Checkbox</code>
    </Heading>
    <ul>
      <li>
        A <a href="checkbox">Checkbox</a> as a row’s leading edit control:
        selecting several rows.
      </li>
      <li>
        Rows pass their clicks on to it (<PartLink part="forwardClick" />
        ).
      </li>
    </ul>
    <CheckboxPart />
    <h3>Props</h3>
    <PropsTable rows={listCheckboxRows} />

    <Heading
      id="list-radio"
      level={2}
    >
      <code>List.Radio</code>
    </Heading>
    <ul>
      <li>
        A <a href="checkbox">Radio</a> as a row’s leading edit control: choosing
        one row.
      </li>
      <li>
        Its group: a Base UI{' '}
        <PartLink
          component="checkbox"
          part="RadioGroup"
        />{' '}
        rendering the{' '}
        <PartLink
          component="list"
          part="List.Group"
        >
          Group
        </PartLink>
        .
      </li>
    </ul>
    <RadioPart />
    <h3>Props</h3>
    <PropsTable rows={listRadioRows} />

    <Heading
      id="list-editbutton"
      level={2}
    >
      <code>List.EditButton</code>
    </Heading>
    <ul>
      <li>
        A leading button: a symbol (its child) in a circle of its{' '}
        <code>tint</code> (UIKit’s editing styles: deleting in red, inserting in
        green), doing what the app gives it (<code>onClick</code>).
      </li>
      <li>
        Opening the row’s swipe actions instead: rendered by a{' '}
        <PartLink
          component="list"
          part="List.SwipeActionsTrigger"
        />{' '}
        (its <code>render</code>).
      </li>
      <li>
        Here: a minus on each row, a plus on an insert row; clicks logged.
        Deleting and inserting for real:{' '}
        <a href="list/composition#deleting-and-inserting-rows">
          Deleting and inserting rows
        </a>
        .
      </li>
    </ul>
    <EditButtonPart />
    <h3>Props</h3>
    <PropsTable rows={listEditButtonRows} />

    <Heading
      id="list-swipeactions"
      level={2}
    >
      <code>List.SwipeActions</code>
    </Heading>
    <ul>
      <li>
        A row’s actions on one side, revealed by swiping it (or by focusing
        them).
      </li>
      <li>
        <code>overswipe</code>: swiping on past them triggers the outermost.
      </li>
      <li>
        <code>allowSwipe</code>: what the user does to them, swiping or
        focusing, opening and closing, only one of them, or neither (then opened
        and closed by a{' '}
        <PartLink
          component="list"
          part="List.SwipeActionsTrigger"
        />{' '}
        or their handle only).
      </li>
    </ul>
    <SwipeActionsPart />
    <h3>Props</h3>
    <PropsTable rows={listSwipeActionsRows} />

    <Heading
      id="list-swipeactionstrigger"
      level={2}
    >
      <code>List.SwipeActionsTrigger</code>
    </Heading>
    <ul>
      <li>
        Opens swipe actions when clicked (Base UI’s triggers’ shape): in a row,
        the row’s own on its <code>side</code>; by a <code>handle</code>, those
        of any row, from anywhere.
      </li>
      <li>
        Opening them, it moves focus to the first of them (as Base UI’s triggers
        to their popups): next for the keyboard, though they come before the row
        in the document.
      </li>
      <li>
        Renders a button, or what it’s given (<code>render</code>): e.g. a{' '}
        <PartLink
          component="list"
          part="List.EditButton"
        />{' '}
        (the delete sign), a{' '}
        <PartLink
          component="button"
          part="Button.Root"
        />{' '}
        outside the list.
      </li>
      <li>
        Here: each row’s sign; Pin on the leading side, Delete on the trailing
        (switch the first’s <code>side</code>). From outside the row, by a
        handle: see{' '}
        <PartLink
          component="list"
          part="List.createSwipeActionsHandle"
        />
        .
      </li>
    </ul>
    <SwipeActionsTriggerPart />
    <h3>Props</h3>
    <PropsTable rows={listSwipeActionsTriggerRows} />

    <Heading
      id="list-createswipeactionshandle"
      level={2}
    >
      <code>List.createSwipeActionsHandle</code>
    </Heading>
    <ul>
      <li>
        A handle naming a row’s swipe actions (on one side): given to them (
        <PartLink
          component="list"
          part="List.SwipeActions"
        />
        ’s <code>handle</code>) and to the triggers opening them from outside
        the row (
        <PartLink
          component="list"
          part="List.SwipeActionsTrigger"
        />
        ’s), or used imperatively (<code>open()</code>, <code>close()</code>,{' '}
        <code>isOpen</code>).
      </li>
      <li>
        Made once, e.g. at a module’s top level (in a component:{' '}
        <PartLink
          component="list"
          part="useCreateSwipeActionsHandle"
        />
        ). Not needed for a trigger in the row.
      </li>
      <li>
        Here: Mercury’s actions, opened by a trigger above the list, closed by a
        button calling <code>close()</code>.
      </li>
    </ul>
    <CreateSwipeActionsHandlePart />
    <h3>Returns</h3>
    <PropsTable rows={listSwipeActionsHandleRows} />

    <Heading
      id="usecreateswipeactionshandle"
      level={2}
    >
      <code>useCreateSwipeActionsHandle</code>
    </Heading>
    <ul>
      <li>
        <PartLink
          component="list"
          part="List.createSwipeActionsHandle"
        />{' '}
        in a component: made once, for its lifetime.
      </li>
    </ul>
    <UseCreateSwipeActionsHandlePart />
    <h3>Returns</h3>
    <PropsTable rows={listSwipeActionsHandleRows} />

    <Heading
      id="list-swipeaction"
      level={2}
    >
      <code>List.SwipeAction</code>
    </Heading>
    <ul>
      <li>
        An action: a symbol (or short text) in a circle or rounded rectangle, in
        its <code>tint</code>.
      </li>
      <li>
        Named by its <code>label</code>; shown below it with{' '}
        <code>showLabel</code>.
      </li>
      <li>The actions close after a click.</li>
    </ul>
    <SwipeActionPart />
    <h3>Props</h3>
    <PropsTable rows={listSwipeActionRows} />

    <Heading
      id="list-index"
      level={2}
    >
      <code>List.Index</code>
    </Heading>
    <ul>
      <li>
        An index (a <code>nav</code>) of letters in the tint color, beside a
        plain list.
      </li>
      <li>Pressing or scrubbing over it clicks its items.</li>
      <li>Placing it (e.g. at the page’s edge) is the page’s.</li>
    </ul>
    <IndexPart />
    <h3>Props</h3>
    <PropsTable rows={listIndexRows} />

    <Heading
      id="list-indexitem"
      level={2}
    >
      <code>List.IndexItem</code>
    </Heading>
    <ul>
      <li>
        A letter of the index (a button): its click scrolls the app’s list to
        the section.
      </li>
    </ul>
    <IndexItemPart />
    <h3>Props</h3>
    <PropsTable rows={listIndexItemRows} />

    <Heading
      id="forwardclick"
      level={2}
    >
      <code>forwardClick</code>
    </Heading>
    <ul>
      <li>
        A row’s click handler passing the click on to the control in it, as iOS
        rows do: pressing a switch’s row toggles the switch (see{' '}
        <PartLink part="List.Checkbox" />, <PartLink part="List.Radio" />
        ).
      </li>
      <li>
        As the click it is: a pointer’s or a keyboard’s (a control’s{' '}
        <code>click()</code> would be a keyboard’s, so menus would open with
        their first item highlighted); the control’s own clicks aren’t passed on
        again.
      </li>
    </ul>
    <CodeView code={forwardClickCode} />
    <h3>Arguments and return</h3>
    <PropsTable rows={forwardClickRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const listPartsDemos = [
  RootPart,
  SectionPart,
  HeaderPart,
  GroupPart,
  DropGroupPart,
  DropTargetPart,
  ItemPart,
  CollapsibleRootPart,
  CollapsibleTriggerPart,
  CollapsiblePanelPart,
  AccordionRootPart,
  AccordionItemPart,
  LeadingPart,
  ContentPart,
  TrailingPart,
  SpanPart,
  BelowPart,
  FooterPart,
  BlockPart,
  TitlePart,
  SubtitlePart,
  SupertitlePart,
  TextPart,
  DetailPart,
  ImagePart,
  AccessoryPart,
  CheckmarkPart,
  DrillInPart,
  DisclosurePart,
  GrabberPart,
  CreateReorderHandlePart,
  UseCreateReorderHandlePart,
  ActionPart,
  ButtonPart,
  CheckboxPart,
  RadioPart,
  EditButtonPart,
  SwipeActionsPart,
  SwipeActionsTriggerPart,
  CreateSwipeActionsHandlePart,
  UseCreateSwipeActionsHandlePart,
  SwipeActionPart,
  IndexPart,
  IndexItemPart,
];
