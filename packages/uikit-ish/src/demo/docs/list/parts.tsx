import { RadioGroup } from '@base-ui/react/radio-group';
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
  type PartProps,
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { codeLabel } from '../../tooling/frame/render-code.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import {
  sfArchiveboxFill,
  sfEllipsis,
  sfFlagFill,
  sfHeartFill,
  sfICircle,
  sfMinus,
  sfPersonCropCircleFill,
  sfPlus,
  sfSquareAndPencil,
  sfTrashFill,
} from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
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
  propOptionsBelow,
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'List.Checkbox': ['aria-label'],
          'List.Content': [],
          'List.Grabber': ['aria-label'],
          'List.Group': [],
          'List.Header': ['prominence'],
          'List.Item': [],
          'List.Leading': [],
          'List.Section': [],
          'List.Title': ['render'],
          'List.Trailing': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.Root"
    >
      <List.Root {...props}>
        <List.Section {...partProps['List.Section']}>
          <List.Header
            {...partProps['List.Header']}
            prominence="nested"
          >
            <List.Title
              {...partProps['List.Title']}
              render={<h3 />}
            >
              Planets
            </List.Title>
          </List.Header>
          <List.Group {...partProps['List.Group']}>
            {rows.map((name) => (
              <List.Item
                key={name}
                {...partProps['List.Item']}
              >
                <List.Leading {...partProps['List.Leading']}>
                  <List.Checkbox
                    {...partProps['List.Checkbox']}
                    aria-label={name}
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'List.Content': [],
          'List.Footer': [],
          'List.Group': [],
          'List.Header': ['prominence'],
          'List.Item': [],
          'List.Root': [],
          'List.Title': ['render'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.Section"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...props}>
          <List.Header
            {...partProps['List.Header']}
            prominence="nested"
          >
            <List.Title
              {...partProps['List.Title']}
              render={<h3 />}
            >
              Planets
            </List.Title>
          </List.Header>
          <List.Group {...partProps['List.Group']}>
            {rows.map((name) => (
              <List.Item
                key={name}
                {...partProps['List.Item']}
              >
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>{name}</List.Title>
                </List.Content>
              </List.Item>
            ))}
          </List.Group>
          <List.Footer {...partProps['List.Footer']}>
            The inner planets.
          </List.Footer>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'List.Accessory': ['aria-label', 'onClick', 'render'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': ['render'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.Header"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Header {...props}>
            <List.Title
              {...partProps['List.Title']}
              render={<h3 />}
            >
              Planets
            </List.Title>
            <List.Accessory
              {...partProps['List.Accessory']}
              aria-label="Edit"
              render={<button type="button" />}
              onClick={() => addLog('edit clicked')}
            >
              <Symbol
                {...partProps.Symbol}
                icon={sfSquareAndPencil}
              />
            </List.Accessory>
          </List.Header>
          <List.Group {...partProps['List.Group']}>
            {rows.map((name) => (
              <List.Item
                key={name}
                {...partProps['List.Item']}
              >
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Content': [],
            'List.Grabber': ['aria-label'],
            'List.Item': ['dropName', 'reorderHandle'],
            'List.Root': [],
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
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.Group"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Group {...props}>
            {order.map((name) => (
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
                    {...partProps['List.Grabber']}
                    aria-label={`Reorder ${name}`}
                  />
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Item (others)': [],
            'List.Content': [],
            'List.Group': [],
            'List.Root': [],
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
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.Item"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            {rows.map((name, index) => (
              <List.Item
                key={name}
                {...(index === 0 ? props : partProps['List.Item (others)'])}
              >
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

/** A collapsible's root (no element), with its props. */
const CollapsibleRootPart: FunctionComponent = () => {
  const id = 'list-parts-collapsible-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsListCollapsibleRoot(addLog), [addLog]),
    { external, title: 'List.CollapsibleRoot' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.CollapsiblePanel': [],
            'List.CollapsibleTrigger': [],
            'List.Content': [],
            'List.Detail': [],
            'List.Disclosure': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': ['render'],
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
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.CollapsibleRoot"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <List.CollapsibleRoot
              key={elementKey}
              {...props}
            >
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
                    Repeat
                  </List.Title>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  <List.Detail {...partProps['List.Detail']}>Daily</List.Detail>
                  <List.Disclosure {...partProps['List.Disclosure']} />
                </List.Trailing>
              </List.Item>
              <List.CollapsiblePanel {...partProps['List.CollapsiblePanel']}>
                <List.Item {...partProps['List.Item']}>
                  <List.Content {...partProps['List.Content']}>
                    <List.Title {...partProps['List.Title']}>
                      Every day at 10:00
                    </List.Title>
                  </List.Content>
                </List.Item>
              </List.CollapsiblePanel>
            </List.CollapsibleRoot>
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>Alert</List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Detail {...partProps['List.Detail']}>None</List.Detail>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.CollapsiblePanel': [],
            'List.CollapsibleRoot': [],
            'List.Content': [],
            'List.Detail': [],
            'List.Disclosure': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': ['render'],
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
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.CollapsibleTrigger"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <List.CollapsibleRoot
              {...partProps['List.CollapsibleRoot']}
              defaultOpen
            >
              <List.Item {...partProps['List.Item']}>
                <List.Content {...partProps['List.Content']}>
                  <List.Title
                    {...partProps['List.Title']}
                    render={<List.CollapsibleTrigger {...props} />}
                  >
                    Repeat
                  </List.Title>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  <List.Detail {...partProps['List.Detail']}>Daily</List.Detail>
                  <List.Disclosure {...partProps['List.Disclosure']} />
                </List.Trailing>
              </List.Item>
              <List.CollapsiblePanel {...partProps['List.CollapsiblePanel']}>
                <List.Item {...partProps['List.Item']}>
                  <List.Content {...partProps['List.Content']}>
                    <List.Title {...partProps['List.Title']}>
                      Every day at 10:00
                    </List.Title>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.CollapsiblePanel': [],
            'List.CollapsibleRoot': ['defaultOpen', 'onOpenChange'],
            'List.CollapsibleTrigger': [],
            'List.Content': [],
            'List.Detail': [],
            'List.Disclosure': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': ['render'],
            'List.Trailing': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('list-parts-collapsible-panel') },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[partControls]}
      id="list-parts-collapsible-panel"
      log={log}
      state={[partState]}
      title="List.CollapsiblePanel"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <List.CollapsibleRoot
              {...partProps['List.CollapsibleRoot']}
              defaultOpen
              onOpenChange={(isOpen: boolean) =>
                addLog(`open change: ${String(isOpen)}`)
              }
            >
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
                    Repeat
                  </List.Title>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  <List.Detail {...partProps['List.Detail']}>Daily</List.Detail>
                  <List.Disclosure {...partProps['List.Disclosure']} />
                </List.Trailing>
              </List.Item>
              <List.CollapsiblePanel {...partProps['List.CollapsiblePanel']}>
                <List.Item {...partProps['List.Item']}>
                  <List.Content {...partProps['List.Content']}>
                    <List.Title {...partProps['List.Title']}>
                      Every day at 10:00
                    </List.Title>
                  </List.Content>
                </List.Item>
                <List.Item {...partProps['List.Item']}>
                  <List.Content {...partProps['List.Content']}>
                    <List.Title {...partProps['List.Title']}>Ends</List.Title>
                  </List.Content>
                  <List.Trailing {...partProps['List.Trailing']}>
                    <List.Detail {...partProps['List.Detail']}>
                      Never
                    </List.Detail>
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
const accordionRows = (partProps: PartProps = {}) => (
  <>
    <List.AccordionItem
      {...partProps['List.AccordionItem']}
      value="repeat"
    >
      <List.Item {...partProps['List.Item']}>
        <List.Content {...partProps['List.Content']}>
          <List.Title
            {...partProps['List.Title']}
            render={
              <List.AccordionTrigger {...partProps['List.AccordionTrigger']} />
            }
          >
            Repeat
          </List.Title>
        </List.Content>
        <List.Trailing {...partProps['List.Trailing']}>
          <List.Detail {...partProps['List.Detail']}>Daily</List.Detail>
          <List.Disclosure {...partProps['List.Disclosure']} />
        </List.Trailing>
      </List.Item>
      <List.AccordionPanel {...partProps['List.AccordionPanel']}>
        <List.Item {...partProps['List.Item']}>
          <List.Content {...partProps['List.Content']}>
            <List.Title {...partProps['List.Title']}>
              Every day at 10:00
            </List.Title>
          </List.Content>
        </List.Item>
      </List.AccordionPanel>
    </List.AccordionItem>
    <List.AccordionItem
      {...partProps['List.AccordionItem']}
      value="alert"
    >
      <List.Item {...partProps['List.Item']}>
        <List.Content {...partProps['List.Content']}>
          <List.Title
            {...partProps['List.Title']}
            render={
              <List.AccordionTrigger {...partProps['List.AccordionTrigger']} />
            }
          >
            Alert
          </List.Title>
        </List.Content>
        <List.Trailing {...partProps['List.Trailing']}>
          <List.Detail {...partProps['List.Detail']}>None</List.Detail>
          <List.Disclosure {...partProps['List.Disclosure']} />
        </List.Trailing>
      </List.Item>
      <List.AccordionPanel {...partProps['List.AccordionPanel']}>
        <List.Item {...partProps['List.Item']}>
          <List.Content {...partProps['List.Content']}>
            <List.Title {...partProps['List.Title']}>
              5 minutes before
            </List.Title>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.AccordionItem': ['value'],
            'List.AccordionPanel': [],
            'List.AccordionTrigger': [],
            'List.Content': [],
            'List.Detail': [],
            'List.Disclosure': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': ['render'],
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
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.AccordionRoot"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <List.AccordionRoot
              key={elementKey}
              {...props}
            >
              {accordionRows(partProps)}
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.AccordionItem (others)': ['value'],
            'List.AccordionPanel': [],
            'List.AccordionRoot': ['defaultValue'],
            'List.AccordionTrigger': [],
            'List.Content': [],
            'List.Detail': [],
            'List.Disclosure': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': ['render'],
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
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.AccordionItem"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <List.AccordionRoot
              {...partProps['List.AccordionRoot']}
              defaultValue={['repeat']}
            >
              <List.AccordionItem
                value="repeat"
                {...props}
              >
                <List.Item {...partProps['List.Item']}>
                  <List.Content {...partProps['List.Content']}>
                    <List.Title
                      {...partProps['List.Title']}
                      render={
                        <List.AccordionTrigger
                          {...partProps['List.AccordionTrigger']}
                        />
                      }
                    >
                      Repeat
                    </List.Title>
                  </List.Content>
                  <List.Trailing {...partProps['List.Trailing']}>
                    <List.Detail {...partProps['List.Detail']}>
                      Daily
                    </List.Detail>
                    <List.Disclosure {...partProps['List.Disclosure']} />
                  </List.Trailing>
                </List.Item>
                <List.AccordionPanel {...partProps['List.AccordionPanel']}>
                  <List.Item {...partProps['List.Item']}>
                    <List.Content {...partProps['List.Content']}>
                      <List.Title {...partProps['List.Title']}>
                        Every day at 10:00
                      </List.Title>
                    </List.Content>
                  </List.Item>
                </List.AccordionPanel>
              </List.AccordionItem>
              <List.AccordionItem
                {...partProps['List.AccordionItem (others)']}
                value="alert"
              >
                <List.Item {...partProps['List.Item']}>
                  <List.Content {...partProps['List.Content']}>
                    <List.Title
                      {...partProps['List.Title']}
                      render={
                        <List.AccordionTrigger
                          {...partProps['List.AccordionTrigger']}
                        />
                      }
                    >
                      Alert
                    </List.Title>
                  </List.Content>
                  <List.Trailing {...partProps['List.Trailing']}>
                    <List.Detail {...partProps['List.Detail']}>
                      None
                    </List.Detail>
                    <List.Disclosure {...partProps['List.Disclosure']} />
                  </List.Trailing>
                </List.Item>
                <List.AccordionPanel {...partProps['List.AccordionPanel']}>
                  <List.Item {...partProps['List.Item']}>
                    <List.Content {...partProps['List.Content']}>
                      <List.Title {...partProps['List.Title']}>
                        5 minutes before
                      </List.Title>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'List.Content': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.Footer"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            {rows.map((name) => (
              <List.Item
                key={name}
                {...partProps['List.Item']}
              >
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>{name}</List.Title>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'List.Footer': [],
          'List.Header': ['prominence'],
          'List.Root': [],
          'List.Section': [],
          'List.Title': ['render'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.Block"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Header
            {...partProps['List.Header']}
            prominence="extraProminent"
          >
            <List.Title
              {...partProps['List.Title']}
              render={<h3 />}
            >
              About
            </List.Title>
          </List.Header>
          <List.Block {...props}>
            <p>
              The inner planets are rocky; the outer ones are giants of gas and
              ice.
            </p>
          </List.Block>
          <List.Footer {...partProps['List.Footer']}>
            Blocks have headers and footers, too.
          </List.Footer>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Title (others)': [],
            'List.Content': [],
            'List.DrillIn': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
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
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.Title"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            {rows.map((name, index) =>
              index === 0 ? (
                <List.Item
                  key={name}
                  {...partProps['List.Item']}
                >
                  <List.Content {...partProps['List.Content']}>
                    <List.Title {...props}>{name}</List.Title>
                  </List.Content>
                  <List.Trailing {...partProps['List.Trailing']}>
                    <List.DrillIn {...partProps['List.DrillIn']} />
                  </List.Trailing>
                </List.Item>
              ) : (
                <List.Item
                  key={name}
                  {...partProps['List.Item']}
                >
                  <List.Content {...partProps['List.Content']}>
                    <List.Title {...partProps['List.Title (others)']}>
                      {name}
                    </List.Title>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'List.Subtitle (others)': [],
          'List.Content': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.Subtitle"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            {settings.map(({ subtitle, title }, index) => (
              <List.Item
                key={title}
                {...partProps['List.Item']}
              >
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>{title}</List.Title>
                  <List.Subtitle
                    {...(index === 0
                      ? props
                      : partProps['List.Subtitle (others)'])}
                  >
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'List.Content': [],
          'List.Group': [],
          'List.Header': [],
          'List.Item': [],
          'List.Root': [],
          'List.Section': [],
          'List.Subtitle': [],
          'List.Title': ['render'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.Supertitle"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Header {...partProps['List.Header']}>
            <List.Supertitle {...props}>Solar System</List.Supertitle>
            <List.Title
              {...partProps['List.Title']}
              render={<h3 />}
            >
              Planets
            </List.Title>
            <List.Subtitle {...partProps['List.Subtitle']}>
              The inner ones
            </List.Subtitle>
          </List.Header>
          <List.Group {...partProps['List.Group']}>
            {rows.map((name) => (
              <List.Item
                key={name}
                {...partProps['List.Item']}
              >
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Text (others)': [],
            'List.Below': [],
            'List.Content': [],
            'List.Detail': [],
            'List.DrillIn': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': ['listStyle'],
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
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.Text"
    >
      <List.Root
        {...partProps['List.Root']}
        listStyle="plain"
      >
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            {messages.map(({ date, from, preview, subject }, index) => (
              <List.Item
                key={from}
                {...partProps['List.Item']}
              >
                <List.Content {...partProps['List.Content']}>
                  <List.Title
                    {...partProps['List.Title']}
                    render={<button type="button" />}
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
                  <List.Text
                    {...(index === 0 ? props : partProps['List.Text (others)'])}
                  >
                    {preview}
                  </List.Text>
                </List.Below>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          ActivityIndicator: ['aria-label', 'size'],
          'List.Content': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.Leading"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <List.Item {...partProps['List.Item']}>
              <List.Leading {...props}>
                <ActivityIndicator
                  {...partProps.ActivityIndicator}
                  aria-label="Syncing"
                  size="small"
                />
              </List.Leading>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>Syncing</List.Title>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'List.Group': [],
          'List.Item': [],
          'List.Root': [],
          'List.Section': [],
          'List.Subtitle': [],
          'List.Title': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.Content"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <List.Item {...partProps['List.Item']}>
              <List.Content {...props}>
                <List.Title {...partProps['List.Title']}>Mercury</List.Title>
                <List.Subtitle {...partProps['List.Subtitle']}>
                  Closest to the Sun
                </List.Subtitle>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Content': [],
            'List.Group': [],
            'List.Item': ['onClick'],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'Switch.Root': ['aria-label', 'onCheckedChange'],
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
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.Trailing"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <List.Item
              {...partProps['List.Item']}
              onClick={forwardClick('[role=switch]')}
            >
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>
                  Airplane Mode
                </List.Title>
              </List.Content>
              <List.Trailing {...props}>
                <Switch.Root
                  {...partProps['Switch.Root']}
                  aria-label="Airplane Mode"
                  onCheckedChange={(isChecked: boolean) =>
                    addLog(`airplane mode: ${String(isChecked)}`)
                  }
                >
                  <Switch.Thumb {...partProps['Switch.Thumb']} />
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'List.Group': [],
          'List.Item': [],
          'List.Root': [],
          'List.Section': [],
          'Slider.Control': [],
          'Slider.Indicator': [],
          'Slider.Root': ['defaultValue'],
          'Slider.Thumb': ['aria-label'],
          'Slider.Track': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.Span"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <List.Item {...partProps['List.Item']}>
              <List.Span {...props}>
                <Slider.Root
                  {...partProps['Slider.Root']}
                  defaultValue={50}
                >
                  <Slider.Control {...partProps['Slider.Control']}>
                    <Slider.Track {...partProps['Slider.Track']}>
                      <Slider.Indicator {...partProps['Slider.Indicator']} />
                      <Slider.Thumb
                        {...partProps['Slider.Thumb']}
                        aria-label="Volume"
                      />
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
  const [control, props, state] = usePropControl(propOptionsBelow, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'List.Below',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'List.Content': [],
          'List.Detail': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': [],
          'List.Section': [],
          'List.Subtitle': [],
          'List.Title': [],
          'List.Trailing': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.Below"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>Backup</List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Detail {...partProps['List.Detail']}>On</List.Detail>
              </List.Trailing>
              <List.Below {...props}>
                <List.Subtitle {...partProps['List.Subtitle']}>
                  Last backup: yesterday, 21:04
                </List.Subtitle>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'List.Detail (others)': [],
          'List.Content': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
          'List.Trailing': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.Detail"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            {settings.map(({ detail, title }, index) => (
              <List.Item
                key={title}
                {...partProps['List.Item']}
              >
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>{title}</List.Title>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  <List.Detail
                    {...(index === 0
                      ? props
                      : partProps['List.Detail (others)'])}
                  >
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'List.Image (others)': ['style', 'variant'],
          'List.Content': [],
          'List.Group': [],
          'List.Item': [],
          'List.Leading': [],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.Image"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            {settings.map(({ color, icon, title }, index) => (
              <List.Item
                key={title}
                {...partProps['List.Item']}
              >
                <List.Leading {...partProps['List.Leading']}>
                  <List.Image
                    style={{ backgroundColor: color }}
                    variant="rounded"
                    {...(index === 0
                      ? props
                      : partProps['List.Image (others)'])}
                  >
                    <Symbol
                      {...partProps.Symbol}
                      icon={icon}
                    />
                  </List.Image>
                </List.Leading>
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>{title}</List.Title>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'List.Content': [],
            'List.Group': [],
            'List.Image': ['style', 'variant'],
            'List.Item': [],
            'List.Leading': [],
            'List.Root': [],
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
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.Accessory"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <List.Item {...partProps['List.Item']}>
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
                <List.Title {...partProps['List.Title']}>Favorites</List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Accessory
                  aria-label="Info"
                  {...props}
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfICircle}
                  />
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
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
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.Checkmark"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            {rows.map((name) => (
              <List.Item
                key={name}
                {...partProps['List.Item']}
              >
                <List.Content {...partProps['List.Content']}>
                  <List.Title
                    {...partProps['List.Title']}
                    render={<button type="button" />}
                    onClick={() => {
                      addLog(`chosen: ${name}`);
                      setChosen(name);
                    }}
                  >
                    {name}
                  </List.Title>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.DrillIn (others)': [],
            'List.Content': [],
            'List.Detail': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
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
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.DrillIn"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            {settings.map(({ detail, title }, index) => (
              <List.Item
                key={title}
                {...partProps['List.Item']}
              >
                <List.Content {...partProps['List.Content']}>
                  <List.Title
                    {...partProps['List.Title']}
                    render={<button type="button" />}
                    onClick={() => addLog(`${title} clicked`)}
                  >
                    {title}
                  </List.Title>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  <List.Detail {...partProps['List.Detail']}>
                    {detail}
                  </List.Detail>
                </List.Trailing>
                <List.Trailing {...partProps['List.Trailing']}>
                  <List.DrillIn
                    {...(index === 0
                      ? props
                      : partProps['List.DrillIn (others)'])}
                  />
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Collapsible.Panel': ['render'],
            'Collapsible.Root': ['defaultOpen', 'onOpenChange', 'render'],
            'Collapsible.Trigger': ['aria-label', 'nativeButton', 'render'],
            'List.Content': [],
            'List.Group': [],
            'List.Header': ['prominence'],
            'List.Item': [],
            'List.Root': [],
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
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.Disclosure"
    >
      <List.Root {...partProps['List.Root']}>
        <Collapsible.Root
          {...partProps['Collapsible.Root']}
          defaultOpen
          render={<List.Section {...partProps['List.Section']} />}
          onOpenChange={(isOpen: boolean) => addLog(`open: ${String(isOpen)}`)}
        >
          <Collapsible.Trigger
            {...partProps['Collapsible.Trigger']}
            aria-label="Planets"
            nativeButton={false}
            render={
              <List.Header
                {...partProps['List.Header']}
                prominence="nested"
              />
            }
          >
            <List.Title {...partProps['List.Title']}>Planets</List.Title>
            <List.Disclosure {...props} />
          </Collapsible.Trigger>
          <Collapsible.Panel
            {...partProps['Collapsible.Panel']}
            render={<List.Group {...partProps['List.Group']} />}
          >
            {rows.map((name) => (
              <List.Item
                key={name}
                {...partProps['List.Item']}
              >
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>{name}</List.Title>
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
// (A function, not a component: the code shown has its parts, not a tag.)
const reorderRow = (
  handle: ListReorderHandle,
  name: string,
  partProps: PartProps = {},
) => (
  <List.Item
    key={name}
    {...partProps['List.Item']}
    dropName={name}
    reorderHandle={handle}
  >
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Content': [],
            'List.Grabber': ['aria-label'],
            'List.Group': [],
            'List.Item': ['dropName', 'reorderHandle'],
            'List.Root': [],
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
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.DropGroup"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <List.Item
              {...partProps['List.Item']}
              dropName="Mercury"
            >
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>Mercury</List.Title>
              </List.Content>
            </List.Item>
            <List.DropGroup {...props}>
              {order.map((name) => reorderRow(reorderRows, name, partProps))}
            </List.DropGroup>
            <List.Item
              {...partProps['List.Item']}
              dropName="Jupiter"
            >
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>Jupiter</List.Title>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Content': [],
            'List.Grabber': ['aria-label'],
            'List.Group': [],
            'List.Item': ['dropName', 'reorderHandle'],
            'List.Root': [],
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
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.DropTarget"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <List.DropTarget {...props} />
            {order.map((name) => reorderRow(reorderRows, name, partProps))}
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Label': [],
            'Button.Root': ['onClick', 'variant'],
            'List.Content': [],
            'List.Grabber': ['aria-label'],
            'List.Group': ['reorderHandle'],
            'List.Item': ['dropName', 'reorderHandle'],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'List.Trailing': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('list-parts-create-reorder-handle') },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[partControls]}
      id="list-parts-create-reorder-handle"
      log={log}
      state={[partState]}
      title="List.createReorderHandle"
    >
      <>
        <Button.Root
          {...partProps['Button.Root']}
          variant="bordered"
          onClick={() => reorderPlanets.grab(['Venus', 'Earth'])}
        >
          <Button.Label {...partProps['Button.Label']}>
            Grab Venus and Earth
          </Button.Label>
        </Button.Root>
        <Button.Root
          {...partProps['Button.Root']}
          variant="bordered"
          onClick={() => reorderPlanets.move('previous')}
        >
          <Button.Label {...partProps['Button.Label']}>Move Up</Button.Label>
        </Button.Root>
        <Button.Root
          {...partProps['Button.Root']}
          variant="bordered"
          onClick={() => reorderPlanets.move('next')}
        >
          <Button.Label {...partProps['Button.Label']}>Move Down</Button.Label>
        </Button.Root>
        <Button.Root
          {...partProps['Button.Root']}
          variant="bordered"
          onClick={() => reorderPlanets.drop()}
        >
          <Button.Label {...partProps['Button.Label']}>Drop</Button.Label>
        </Button.Root>
        <Button.Root
          {...partProps['Button.Root']}
          variant="bordered"
          onClick={() => reorderPlanets.cancel()}
        >
          <Button.Label {...partProps['Button.Label']}>Cancel</Button.Label>
        </Button.Root>
        <List.Root {...partProps['List.Root']}>
          <List.Section {...partProps['List.Section']}>
            <List.Group
              {...partProps['List.Group']}
              reorderHandle={reorderPlanets}
            >
              {order.map((name) => reorderRow(reorderPlanets, name, partProps))}
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Content': [],
            'List.Grabber': ['aria-label'],
            'List.Group': ['reorderHandle'],
            'List.Item': ['dropName', 'reorderHandle'],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'List.Trailing': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('list-parts-use-create-reorder-handle') },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[partControls]}
      id="list-parts-use-create-reorder-handle"
      log={log}
      state={[partState]}
      title="useCreateReorderHandle"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Group
            {...partProps['List.Group']}
            reorderHandle={reorderRows}
          >
            {order.map((name) => reorderRow(reorderRows, name, partProps))}
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Grabber (others)': ['aria-label'],
            'List.Content': [],
            'List.Group': ['reorderHandle'],
            'List.Item': ['dropName', 'reorderHandle'],
            'List.Root': [],
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
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.Grabber"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Group
            {...partProps['List.Group']}
            reorderHandle={reorderRows}
          >
            {order.map((name, index) => (
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
                  {index === 0 ? (
                    <List.Grabber {...props} />
                  ) : (
                    <List.Grabber
                      {...partProps['List.Grabber (others)']}
                      aria-label={`Reorder ${name}`}
                    />
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Content': [],
            'List.Group': [],
            'List.Header': ['prominence'],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': ['render'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.Action"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Header
            {...partProps['List.Header']}
            prominence="nested"
          >
            <List.Title
              {...partProps['List.Title']}
              render={<h3 />}
            >
              Planets
            </List.Title>
            <List.Action {...props}>See All</List.Action>
          </List.Header>
          <List.Group {...partProps['List.Group']}>
            {rows.map((name) => (
              <List.Item
                key={name}
                {...partProps['List.Item']}
              >
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

/** `List.Button` (the first row's), outlined, with its props. */
const ButtonPart: FunctionComponent = () => {
  const id = 'list-parts-button';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsButton(addLog), [addLog]),
    { external, isOpen: true, emphasize: 'outline', title: 'List.Button' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Button (others)': ['destructive', 'onClick'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.Button"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Button {...props}>Add Planet</List.Button>
              </List.Content>
            </List.Item>
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Button
                  {...partProps['List.Button (others)']}
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Checkbox (others)': ['aria-label'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': ['onClick'],
            'List.Leading': [],
            'List.Root': [],
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
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.Checkbox"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            {rows.map((name, index) => (
              <List.Item
                key={name}
                {...partProps['List.Item']}
                onClick={forwardClick('[role=checkbox]')}
              >
                <List.Leading {...partProps['List.Leading']}>
                  {index === 0 ? (
                    <List.Checkbox
                      key={elementKey}
                      aria-label={name}
                      {...props}
                    />
                  ) : (
                    <List.Checkbox
                      {...partProps['List.Checkbox (others)']}
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            RadioGroup: [
              'aria-label',
              'defaultValue',
              'onValueChange',
              'render',
            ],
            'List.Radio (others)': ['aria-label', 'value'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': ['onClick'],
            'List.Leading': [],
            'List.Root': [],
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
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.Radio"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <RadioGroup
            {...partProps.RadioGroup}
            aria-label="Planet"
            defaultValue={rows[0]}
            render={<List.Group {...partProps['List.Group']} />}
            onValueChange={(value: unknown) =>
              addLog(`value change: ${String(value)}`)
            }
          >
            {rows.map((name, index) => (
              <List.Item
                key={name}
                {...partProps['List.Item']}
                onClick={forwardClick('[role=radio]')}
              >
                <List.Leading {...partProps['List.Leading']}>
                  {index === 0 ? (
                    <List.Radio
                      aria-label={name}
                      {...props}
                    />
                  ) : (
                    <List.Radio
                      {...partProps['List.Radio (others)']}
                      aria-label={name}
                      value={name}
                    />
                  )}
                </List.Leading>
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>{name}</List.Title>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'List.EditButton (others)': ['aria-label', 'onClick', 'tint'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Leading': [],
            'List.Root': [],
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
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.EditButton"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            {rows.map((name, index) => (
              <List.Item
                key={name}
                {...partProps['List.Item']}
              >
                <List.Leading {...partProps['List.Leading']}>
                  <List.EditButton
                    aria-label={`Delete ${name}`}
                    tint="var(--color-ui-system-red)"
                    onClick={() => addLog(`edit button: delete ${name}`)}
                    {...(index === 0
                      ? props
                      : partProps['List.EditButton (others)'])}
                  >
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfMinus}
                    />
                  </List.EditButton>
                </List.Leading>
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>{name}</List.Title>
                </List.Content>
              </List.Item>
            ))}
            <List.Item {...partProps['List.Item']}>
              <List.Leading {...partProps['List.Leading']}>
                <List.EditButton
                  {...partProps['List.EditButton (others)']}
                  aria-label="Add Planet"
                  tint="var(--color-ui-system-green)"
                  onClick={() => addLog('edit button: add planet')}
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'List.SwipeActions (others)': [],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.SwipeAction': ['label', 'onClick', 'tint'],
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
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.SwipeActions"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            {rows.map((name, index) => (
              <List.Item
                key={name}
                {...partProps['List.Item']}
              >
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>{name}</List.Title>
                </List.Content>
                <List.SwipeActions
                  {...(index === 0
                    ? props
                    : partProps['List.SwipeActions (others)'])}
                >
                  <List.SwipeAction
                    {...partProps['List.SwipeAction']}
                    label="Pin"
                    onClick={() => addLog(`pin ${name}`)}
                  >
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfFlagFill}
                    />
                  </List.SwipeAction>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'List.SwipeActionsTrigger (others)': ['render'],
            'List.Content': [],
            'List.EditButton': ['aria-label', 'tint'],
            'List.Group': [],
            'List.Item': [],
            'List.Leading': [],
            'List.Root': [],
            'List.Section': [],
            'List.SwipeAction': ['label', 'onClick', 'tint'],
            'List.SwipeActions': ['side'],
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
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.SwipeActionsTrigger"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            {rows.map((name, index) => (
              <List.Item
                key={name}
                {...partProps['List.Item']}
              >
                <List.Leading {...partProps['List.Leading']}>
                  {index === 0 ? (
                    <List.SwipeActionsTrigger
                      {...props}
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
                  ) : (
                    <List.SwipeActionsTrigger
                      {...partProps['List.SwipeActionsTrigger (others)']}
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
                  )}
                </List.Leading>
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>{name}</List.Title>
                </List.Content>
                <List.SwipeActions
                  {...partProps['List.SwipeActions']}
                  side="inline-start"
                >
                  <List.SwipeAction
                    {...partProps['List.SwipeAction']}
                    label="Pin"
                    onClick={() => addLog(`pin ${name}`)}
                  >
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfFlagFill}
                    />
                  </List.SwipeAction>
                </List.SwipeActions>
                <List.SwipeActions {...partProps['List.SwipeActions']}>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Label': [],
            'Button.Root': ['onClick', 'variant'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.SwipeAction': ['label', 'onClick', 'tint'],
            'List.SwipeActions': ['handle'],
            'List.SwipeActionsTrigger': ['handle', 'render'],
            'List.Title': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('list-parts-create-swipe-actions-handle') },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[partControls]}
      id="list-parts-create-swipe-actions-handle"
      log={log}
      state={[partState]}
      title="List.createSwipeActionsHandle"
    >
      <>
        <List.SwipeActionsTrigger
          {...partProps['List.SwipeActionsTrigger']}
          handle={mercuryActions}
          render={
            <Button.Root
              {...partProps['Button.Root']}
              variant="bordered"
            />
          }
        >
          <Button.Label {...partProps['Button.Label']}>
            Show Mercury’s Actions
          </Button.Label>
        </List.SwipeActionsTrigger>
        <Button.Root
          {...partProps['Button.Root']}
          variant="bordered"
          onClick={() => mercuryActions.close()}
        >
          <Button.Label {...partProps['Button.Label']}>Close Them</Button.Label>
        </Button.Root>
        <List.Root {...partProps['List.Root']}>
          <List.Section {...partProps['List.Section']}>
            <List.Group {...partProps['List.Group']}>
              {rows.map((name, index) => (
                <List.Item
                  key={name}
                  {...partProps['List.Item']}
                >
                  <List.Content {...partProps['List.Content']}>
                    <List.Title {...partProps['List.Title']}>{name}</List.Title>
                  </List.Content>
                  <List.SwipeActions
                    {...partProps['List.SwipeActions']}
                    handle={index === 0 ? mercuryActions : undefined}
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Label': [],
            'Button.Root': ['variant'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.SwipeAction': ['label', 'onClick', 'tint'],
            'List.SwipeActions': ['handle'],
            'List.SwipeActionsTrigger': ['handle', 'render'],
            'List.Title': [],
          },
          addLog,
        ),
      [addLog],
    ),
    {
      provided: useProvidedState('list-parts-use-create-swipe-actions-handle'),
    },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[partControls]}
      id="list-parts-use-create-swipe-actions-handle"
      log={log}
      state={[partState]}
      title="useCreateSwipeActionsHandle"
    >
      <>
        <List.SwipeActionsTrigger
          {...partProps['List.SwipeActionsTrigger']}
          handle={mercuryRowActions}
          render={
            <Button.Root
              {...partProps['Button.Root']}
              variant="bordered"
            />
          }
        >
          <Button.Label {...partProps['Button.Label']}>
            Show Mercury’s Actions
          </Button.Label>
        </List.SwipeActionsTrigger>
        <List.Root {...partProps['List.Root']}>
          <List.Section {...partProps['List.Section']}>
            <List.Group {...partProps['List.Group']}>
              {rows.map((name, index) => (
                <List.Item
                  key={name}
                  {...partProps['List.Item']}
                >
                  <List.Content {...partProps['List.Content']}>
                    <List.Title {...partProps['List.Title']}>{name}</List.Title>
                  </List.Content>
                  <List.SwipeActions
                    {...partProps['List.SwipeActions']}
                    handle={index === 0 ? mercuryRowActions : undefined}
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'List.SwipeAction (others)': [
              'label',
              'onClick',
              'showLabel',
              'tint',
            ],
            'List.Below': [],
            'List.Content': [],
            'List.Detail': [],
            'List.Group': [],
            'List.Image': ['variant'],
            'List.Item': [],
            'List.Leading': [],
            'List.Root': ['listStyle'],
            'List.Section': [],
            'List.Subtitle': [],
            'List.SwipeActions': [],
            'List.Text': [],
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
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.SwipeAction"
    >
      <List.Root
        {...partProps['List.Root']}
        listStyle="plain"
      >
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            {messages.map(({ date, from, preview, subject }, index) => (
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
                  <List.Title {...partProps['List.Title']}>{from}</List.Title>
                  <List.Subtitle {...partProps['List.Subtitle']}>
                    {subject}
                  </List.Subtitle>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  <List.Detail {...partProps['List.Detail']}>
                    {date}
                  </List.Detail>
                </List.Trailing>
                <List.Below {...partProps['List.Below']}>
                  <List.Text {...partProps['List.Text']}>{preview}</List.Text>
                </List.Below>
                <List.SwipeActions
                  {...partProps['List.SwipeActions']}
                  overswipe
                >
                  <List.SwipeAction
                    {...partProps['List.SwipeAction (others)']}
                    showLabel
                    label="More"
                    onClick={() => addLog(`more ${from}`)}
                  >
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfEllipsis}
                    />
                  </List.SwipeAction>
                  {index === 0 ? (
                    <List.SwipeAction {...props}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfArchiveboxFill}
                      />
                    </List.SwipeAction>
                  ) : (
                    <List.SwipeAction
                      {...partProps['List.SwipeAction (others)']}
                      showLabel
                      label="Archive"
                      tint="var(--color-ui-system-purple)"
                      onClick={() => addLog(`archive ${from}`)}
                    >
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfArchiveboxFill}
                      />
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Content': [],
            'List.Group': [],
            'List.Header': ['prominence'],
            'List.IndexItem': ['onClick'],
            'List.Item': [],
            'List.Root': ['listStyle'],
            'List.Section': ['indexValue'],
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
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.Index"
    >
      <div className="list-demo-plain">
        <div className="list-demo-scroll">
          <List.Root
            {...partProps['List.Root']}
            listStyle="plain"
          >
            {Object.entries(contacts).map(([letter, names]) => (
              <List.Section
                key={letter}
                {...partProps['List.Section']}
                indexValue={letter}
              >
                <List.Header
                  {...partProps['List.Header']}
                  prominence="nested"
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
                        <List.Title {...partProps['List.Title']}>
                          {name}
                        </List.Title>
                      </List.Content>
                    </List.Item>
                  ))}
                </List.Group>
              </List.Section>
            ))}
            <List.Index {...props}>
              {Object.keys(contacts).map((letter) => (
                <List.IndexItem
                  key={letter}
                  {...partProps['List.IndexItem']}
                  onClick={() => addLog(`index: ${letter}`)}
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

/** `List.IndexItem` (A), outlined, with its props. */
const IndexItemPart: FunctionComponent = () => {
  const id = 'list-parts-index-item';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsIndexItem(addLog), [addLog]),
    { external, isOpen: true, emphasize: 'outline', title: 'List.IndexItem' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.IndexItem (others)': ['onClick'],
            'List.Content': [],
            'List.Group': [],
            'List.Header': ['prominence'],
            'List.Index': ['aria-label'],
            'List.Item': [],
            'List.Root': ['listStyle'],
            'List.Section': ['indexValue'],
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
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="List.IndexItem"
    >
      <div className="list-demo-plain">
        <div className="list-demo-scroll">
          <List.Root
            {...partProps['List.Root']}
            listStyle="plain"
          >
            {Object.entries(contacts).map(([letter, names]) => (
              <List.Section
                key={letter}
                {...partProps['List.Section']}
                indexValue={letter}
              >
                <List.Header
                  {...partProps['List.Header']}
                  prominence="nested"
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
                        <List.Title {...partProps['List.Title']}>
                          {name}
                        </List.Title>
                      </List.Content>
                    </List.Item>
                  ))}
                </List.Group>
              </List.Section>
            ))}
            <List.Index
              {...partProps['List.Index']}
              aria-label="Index"
            >
              {Object.keys(contacts).map((letter, index) => (
                <List.IndexItem
                  key={letter}
                  onClick={() => addLog(`index: ${letter}`)}
                  {...(index === 0
                    ? props
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
        holds sections.
      </li>
      <li>
        A section has a header, a group of rows (or a block of text), and a
        footer.
      </li>
      <li>
        A row is a grid of parts: leading parts (an edit control, an image), its
        title (with a subtitle and text), and trailing parts.
      </li>
      <li>A row’s swipe actions are revealed by swiping it.</li>
    </ul>
    <ul className="demo-tree">
      <li className="demo-tree-context">
        <PartLink
          component="page"
          part="Page.Root"
        />{' '}
        <span>(or a</span>{' '}
        <PartLink
          component="sheet"
          part="Sheet.Content"
        />
        <span>, a</span>{' '}
        <PartLink
          component="sidebar"
          part="Sidebar.Root"
        />
        <span>, …)</span>
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
                        (one or more)
                        <ul>
                          <li>
                            <PartLink
                              component="list"
                              part="List.Leading"
                            />{' '}
                            (optional, one or more, before the content)
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
                                , or{' '}
                                <PartLink
                                  component="list"
                                  part="List.Image"
                                />
                              </li>
                              <li className="demo-tree-context">
                                <span>or any element, for example an</span>{' '}
                                <PartLink
                                  component="progress"
                                  part="ActivityIndicator"
                                />
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
                            (optional, one or more, after the content)
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
                              </li>
                              <li className="demo-tree-context">
                                <span>or any element, for example a</span>{' '}
                                <PartLink
                                  component="switch"
                                  part="Switch.Root"
                                />
                              </li>
                            </ul>
                          </li>
                          <li>
                            Or a{' '}
                            <PartLink
                              component="list"
                              part="List.Span"
                            />{' '}
                            (across the line, in place of the above)
                            <ul>
                              <li className="demo-tree-context">
                                <span>for example a</span>{' '}
                                <PartLink
                                  component="slider"
                                  part="Slider.Root"
                                />
                              </li>
                            </ul>
                          </li>
                          <li>
                            <PartLink
                              component="list"
                              part="List.Below"
                            />{' '}
                            (optional: a line under it, for example a field’s
                            messages)
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
                            (optional: opens the row’s actions, for example
                            rendering its{' '}
                            <PartLink
                              component="list"
                              part="List.EditButton"
                            />
                            )
                          </li>
                        </ul>
                      </li>
                      <li>
                        Rows that open and close: a{' '}
                        <PartLink
                          component="list"
                          part="List.CollapsibleRoot"
                        />{' '}
                        around the row whose{' '}
                        <PartLink
                          component="list"
                          part="List.CollapsibleTrigger"
                        />{' '}
                        toggles them and its{' '}
                        <PartLink
                          component="list"
                          part="List.CollapsiblePanel"
                        />
                        . Or, one open at a time, an{' '}
                        <PartLink
                          component="list"
                          part="List.AccordionRoot"
                        />{' '}
                        around{' '}
                        <PartLink
                          component="list"
                          part="List.AccordionItem"
                        />
                        s (with their{' '}
                        <PartLink
                          component="list"
                          part="List.AccordionTrigger"
                        />{' '}
                        and{' '}
                        <PartLink
                          component="list"
                          part="List.AccordionPanel"
                        />
                        )
                      </li>
                      <li>
                        Drop targets for reordering (optional):{' '}
                        <PartLink
                          component="list"
                          part="List.DropGroup"
                        />
                        ,{' '}
                        <PartLink
                          component="list"
                          part="List.DropTarget"
                        />
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
            (optional, next to a plain list)
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
        </ul>
      </li>
      <li>
        Helpers:{' '}
        <PartLink
          component="list"
          part="forwardClick"
        />{' '}
        (a row’s click handler) and{' '}
        <PartLink
          component="list"
          part="List.reorder"
        />{' '}
        (applying a reorder)
      </li>
      <li>
        Reorder handles (optional: given to rows and their drop targets):{' '}
        <PartLink
          component="list"
          part="List.createReorderHandle"
        />{' '}
        (at module level), or{' '}
        <PartLink
          component="list"
          part="useCreateReorderHandle"
        />{' '}
        (in a component)
      </li>
      <li>
        Swipe actions handles (optional: given to a row’s actions and their
        triggers):{' '}
        <PartLink
          component="list"
          part="List.createSwipeActionsHandle"
        />{' '}
        (at module level), or{' '}
        <PartLink
          component="list"
          part="useCreateSwipeActionsHandle"
        />{' '}
        (in a component)
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
        Its style, for all its parts: <code>listStyle</code>.
      </li>
      <li>Whether its groups are outlined.</li>
      <li>
        Its edit mode: <code>editing</code>, by side (leading edit controls,
        trailing grabbers, both, none, or not managed). It’s the default that
        its sections, groups and rows override, and their parts follow it by
        their <code>whileEditing</code>. For sections that edit separately, see{' '}
        <a href={publicUrl('list/composition#editing-sections-separately')}>
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
        It holds an optional{' '}
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
        ), and an optional{' '}
        <PartLink
          component="list"
          part="List.Footer"
        >
          Footer
        </PartLink>
        .
      </li>
      <li>Sections are 35px apart.</li>
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
        It holds a title (rendered as a heading with <code>render</code>), and
        optionally a supertitle, a subtitle, and trailing parts (an{' '}
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
        section title), or extra prominent.
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
        ), the gaps between its rows become drop targets. Rows of that handle
        (dragged by their{' '}
        <PartLink
          component="list"
          part="List.Grabber"
        >
          Grabber
        </PartLink>
        ) can be dropped before, between and after them. The handle’s{' '}
        <code>onReorder</code> is called, and the app reorders its rows.
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
        A range of rows whose gaps are drop targets for its reorder handles
        (like a{' '}
        <PartLink
          component="list"
          part="List.Group"
        />{' '}
        given one): before, between and after its rows.
      </li>
      <li>
        It has no element of its own. Placed around some of a group’s rows,
        those rows stay the group’s (with its separators and corners), and the
        rows around it aren’t targets. Only an empty, hidden element marks where
        it is, so even once emptied, it’s still a target there.
      </li>
      <li>
        Here, Mercury and Jupiter stay where they are, and Venus to Mars can be
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
        A gap that rows of its reorder handles can be dropped into, wherever
        it’s placed among a group’s rows. Only an empty, hidden element marks
        it.
      </li>
      <li>
        Here, it’s the only target, at the top, so rows can only be moved there.
      </li>
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
      <li>At least 52px tall (68px with a subtitle).</li>
      <li>
        It’s pressable through its title (or a{' '}
        <PartLink
          component="list"
          part="List.Button"
        >
          Button
        </PartLink>
        ), or through its own <code>onClick</code> (for example with{' '}
        <PartLink part="forwardClick" />
        ).
      </li>
      <li>
        It can be <code>selected</code>, indented (<code>level</code>), and
        swiped for its{' '}
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
        Holds the state of rows that open and close, like Base UI’s{' '}
        <code>Collapsible.Root</code>: <code>defaultOpen</code>, or{' '}
        <code>open</code> and <code>onOpenChange</code> (with Base UI’s
        reasons), and <code>disabled</code>.
      </li>
      <li>
        It goes around the row that toggles it and the{' '}
        <PartLink
          component="list"
          part="List.CollapsiblePanel"
        >
          CollapsiblePanel
        </PartLink>
        .
      </li>
      <li>It renders no element, so those rows stay its group’s children.</li>
      <li>
        A{' '}
        <PartLink
          component="list"
          part="List.Disclosure"
        />{' '}
        inside it turns down while open.
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
        A button that toggles its root’s rows (Base UI’s{' '}
        <code>Collapsible.Trigger</code>), with <code>aria-expanded</code>,{' '}
        <code>aria-controls</code> (its panel’s rows) and{' '}
        <code>data-panel-open</code>.
      </li>
      <li>The row’s title renders it, which makes the row pressable.</li>
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
        Rows that show or hide (Base UI’s <code>Collapsible.Panel</code>),
        opening and closing in place together. For example an inline picker
        below the row that toggles it, as in a calendar app.
      </li>
      <li>
        It holds{' '}
        <PartLink
          component="list"
          part="List.Item"
        />
        s placed among the group’s rows, without an element of its own. Each
        stays a row of the group, with its separator, and its corners as the
        group’s first or last row.
      </li>
      <li>
        It’s open while its{' '}
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
        ) is. Inside another panel’s rows, it closes with them.
      </li>
      <li>While closed, its rows are inert.</li>
      <li>Here, it holds two rows, opened by the trigger row above them.</li>
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
        Collapsibles of which one is open at a time (unless{' '}
        <code>multiple</code> is set), like Base UI’s{' '}
        <code>Accordion.Root</code>. It holds its{' '}
        <PartLink
          component="list"
          part="List.AccordionItem"
        />
        s, by their <code>value</code>.
      </li>
      <li>
        Its state: <code>defaultValue</code>, or <code>value</code> and{' '}
        <code>onValueChange</code> (arrays of the open items), and{' '}
        <code>disabled</code>.
      </li>
      <li>
        It renders no element, so its items’ rows stay its group’s children.
      </li>
      <li>
        A{' '}
        <PartLink
          component="date-picker"
          part="DatePicker.Root"
        />{' '}
        with a <code>handle</code> in an item opens and closes with it (with its{' '}
        <PartLink
          component="date-picker"
          part="DatePicker.Expandable"
        />
        ’s rows; see{' '}
        <a href={publicUrl('list/composition#rows-expanding-together')}>
          Rows expanding together
        </a>
        ).
      </li>
      <li>Here, an alarm’s Repeat and Alert each open below their row.</li>
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
        One collapsible of its root (Base UI’s <code>Accordion.Item</code>),
        open whenever the root says so, by its <code>value</code>. Its trigger
        and panel work like a{' '}
        <PartLink
          component="list"
          part="List.CollapsibleRoot"
        />
        ’s.
      </li>
      <li>Renders no element.</li>
      <li>Here, Repeat’s (with Alert’s after it).</li>
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
        Base UI’s name, in an accordion, for{' '}
        <PartLink
          component="list"
          part="List.CollapsibleTrigger"
        />
        . It’s the same part (its props are there), and it toggles its{' '}
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
        Base UI’s name, in an accordion, for{' '}
        <PartLink
          component="list"
          part="List.CollapsiblePanel"
        />
        . It’s the same part (its props are there), holding its{' '}
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
        Or its actions: buttons on their own in it, 16px below the group,
        stacked and centered, at most as wide as the group (a <code>fill</code>{' '}
        <a href={publicUrl('button')}>Button</a> spans it). A section can have
        both: a footer of text, then one of actions. The gap is the list’s, not
        the buttons’ (see{' '}
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
        <code>strong</code> puts it on the rows’ background.
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
        A slot before a row’s content, with what’s in it in a line (edit
        controls, an image, any element). A row can have several.
      </li>
      <li>
        In edit mode, it slides in (<code>whileEditing=&quot;show&quot;</code>,
        as for edit controls) or out (<code>hide</code>), as it says. Unset, it
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
        A row’s text: its{' '}
        <PartLink
          component="list"
          part="List.Title"
        />
        ,{' '}
        <PartLink
          component="list"
          part="List.Subtitle"
        />{' '}
        and{' '}
        <PartLink
          component="list"
          part="List.Text"
        />{' '}
        (or a{' '}
        <PartLink
          component="list"
          part="List.Button"
        />
        , or a field’s label), taking the rest of the line. Every row has one,
        or a{' '}
        <PartLink
          component="list"
          part="List.Span"
        />
        .
      </li>
      <li>
        The row’s separator starts where it does, anchored to it and moving with
        it.
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
        A slot after a row’s content, with what’s in it in a line, 16px apart
        (details, chevrons, a grabber, or any element, for example a{' '}
        <a href={publicUrl('switch')}>Switch</a>). A row can have several.
      </li>
      <li>
        In edit mode, it slides in (<code>whileEditing=&quot;show&quot;</code>,
        as for a grabber) or out (<code>hide</code>, as for a chevron), as it
        says. Unset, it stays, whatever it holds.
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
        Content across a row’s whole line, in place of the other slots, for
        example a <a href={publicUrl('slider')}>Slider</a>, a{' '}
        <a href={publicUrl('segmented')}>Segmented</a> control or an inline
        calendar.
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
        A line under a row’s line, across it, for example a field’s description
        and error, a status, or a message’s preview. It comes last in its row.
      </li>
      <li>
        It starts where the row’s content does (after its leading parts, such as
        an image; it’s measured, also as edit mode moves it), and runs to the
        row’s end, under its trailing parts too.
      </li>
      <li>
        When <code>hidden</code>, it collapses. It grows and shrinks as it’s
        shown and hidden, and stays rendered.
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
      <li>A row’s (or a header’s) title, in Body.</li>
      <li>
        Rendered as a button or link (<code>render</code>), it makes the row
        pressable. Its hit area covers the row, beneath the trailing controls.
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
        A second line below the title, in a row (which makes it taller) or in a
        header.
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
      <li>
        Body text below a row’s title and subtitle, for example a message’s
        preview. In a{' '}
        <PartLink
          component="list"
          part="List.Below"
        />
        , as in a mail app’s message rows, it runs under the row’s trailing
        parts too (its time, say).
      </li>
      <li>
        It shows up to <code>lines</code> lines, then truncates.
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
        A trailing value in the secondary color, for example a setting’s current
        value.
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
      <li>A leading image, one line tall.</li>
      <li>
        A symbol on its own, or a symbol or picture in a rounded, circular or
        filled frame (<code>variant</code>).
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
        Rendered as a button (<code>render</code>), it’s pressable on its own,
        for example as an info button.
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
        A trailing checkmark in the label color (black, or white in dark mode),
        marking the chosen row of a list of options, as in a settings app.
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
      <li>A trailing chevron, for a row that opens a page (drills in).</li>
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
      <li>
        A chevron in the tint color (gray in a{' '}
        <a href={publicUrl('sidebar')}>Sidebar</a>), turned down while open.
      </li>
      <li>
        It goes in a header (or row) that’s a Base UI{' '}
        <code>Collapsible.Trigger</code>, with its group as the panel.
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
        A trailing handle that drags its row to its reorder handle’s targets
        (the row needs one:{' '}
        <PartLink
          component="list"
          part="List.Item"
        />
        ’s <code>reorderHandle</code>).
      </li>
      <li>
        With focus, the arrow keys move the row to the previous or next target
        (across groups too), and announce it.
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
        A reordering. It’s given to the rows it moves (
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
        ), anywhere in the list. Its <code>onReorder</code> tells the app what
        moved, and where.
      </li>
      <li>
        A row can have several (its <code>reorderHandle</code> as an array, by
        priority), and so can a target. When a row is dropped where several are
        targets, the row’s first one there is called.
      </li>
      <li>
        The app can grab rows itself (<code>grab</code>, by their names, for
        example several selected rows dragged together by one of their
        grabbers), and move them (<code>move</code>, <code>drop</code>,{' '}
        <code>cancel</code>).
      </li>
      <li>
        Here, it’s made once in the component’s state (in a component,{' '}
        <PartLink
          component="list"
          part="useCreateReorderHandle"
        />{' '}
        is the better choice), and the buttons grab and move Venus and Earth.
      </li>
    </ul>
    <CreateReorderHandlePart />
    <h3>Options, Returns</h3>
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
        in a component: made once, for the component’s lifetime, always with the
        latest options.
      </li>
    </ul>
    <UseCreateReorderHandlePart />
    <h3>Options, Returns</h3>
    <PropsTable rows={listReorderHandleRows} />

    <Heading
      id="list-reorder"
      level={2}
    >
      <code>List.reorder</code>
    </Heading>
    <ul>
      <li>
        Applies a reorder handle’s change to the app’s rows: one list, or
        several lists by their group’s (or drop group’s) <code>dropName</code>,
        for example one per section.
      </li>
      <li>
        It works by names, not indexes. The moved rows are taken out and put
        after the row before the gap (rows the app doesn’t hold, such as a
        pinned one, count as the rows around them), or into an empty list by its
        name.
      </li>
    </ul>
    <CodeView code={reorderCode} />
    <h3>Arguments and Return</h3>
    <PropsTable rows={listReorderRows} />

    <Heading
      id="list-action"
      level={2}
    >
      <code>List.Action</code>
    </Heading>
    <ul>
      <li>
        Text in the tint color, as a button, trailing in a header (for example
        See All) or in a row.
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
      <li>A row that’s a button, so the whole row is pressable.</li>
      <li>
        Its title is in the tint color, or red (<code>destructive</code>).
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
        A <a href={publicUrl('checkbox')}>Checkbox</a> as a row’s leading edit
        control, for selecting several rows.
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
        A <a href={publicUrl('checkbox')}>Radio</a> as a row’s leading edit
        control, for choosing one row.
      </li>
      <li>
        Its group is a Base UI{' '}
        <PartLink
          component="checkbox"
          part="RadioGroup"
        />{' '}
        that renders the{' '}
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
        <code>tint</code> (in editing styles, red for deleting and green for
        inserting). It does what the app gives it (<code>onClick</code>).
      </li>
      <li>
        Or it opens the row’s swipe actions instead, when a{' '}
        <PartLink
          component="list"
          part="List.SwipeActionsTrigger"
        />{' '}
        renders it (through its <code>render</code>).
      </li>
      <li>
        Here, there’s a minus on each row and a plus on an insert row, with the
        clicks logged. For deleting and inserting for real, see{' '}
        <a href={publicUrl('list/composition#deleting-and-inserting-rows')}>
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
        A row’s actions on one side, revealed by swiping the row (or by focusing
        them).
      </li>
      <li>
        <code>overswipe</code>: swiping on past them triggers the outermost one.
      </li>
      <li>
        <code>allowSwipe</code>: what people can do to them, by swiping or
        focusing: open and close them, only one of the two, or neither. With
        neither, only a{' '}
        <PartLink
          component="list"
          part="List.SwipeActionsTrigger"
        />{' '}
        or their handle opens and closes them.
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
        Opens swipe actions when clicked, shaped like Base UI’s triggers. In a
        row, it opens the row’s own actions on its <code>side</code>. With a{' '}
        <code>handle</code>, it opens those of any row, from anywhere.
      </li>
      <li>
        When it opens them, it moves focus to the first one (like Base UI’s
        triggers do for their popups), so they come next for the keyboard, even
        though they come before the row in the document.
      </li>
      <li>
        Renders a button, or what it’s given (<code>render</code>), for example
        a{' '}
        <PartLink
          component="list"
          part="List.EditButton"
        />{' '}
        (the delete sign), or a{' '}
        <PartLink
          component="button"
          part="Button.Root"
        />{' '}
        outside the list.
      </li>
      <li>
        Here, it’s each row’s sign: Pin on the leading side, and Delete on the
        trailing side (switch the first row’s <code>side</code>). To open them
        from outside the row, through a handle, see{' '}
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
        A handle that names a row’s swipe actions on one side. Give it to them (
        <PartLink
          component="list"
          part="List.SwipeActions"
        />
        ’s <code>handle</code>) and to the triggers that open them from outside
        the row (
        <PartLink
          component="list"
          part="List.SwipeActionsTrigger"
        />
        ’s), or use it from code (<code>open()</code>, <code>close()</code>,{' '}
        <code>isOpen</code>).
      </li>
      <li>
        Make it once, for example at a module’s top level (in a component, use{' '}
        <PartLink
          component="list"
          part="useCreateSwipeActionsHandle"
        />
        ). A trigger inside the row doesn’t need one.
      </li>
      <li>
        Here, a trigger above the list opens Mercury’s actions, and a button
        calling <code>close()</code> closes them.
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
        in a component: made once, for the component’s lifetime.
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
        It’s named by its <code>label</code>, which shows below it with{' '}
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
        An index (a <code>nav</code>) of short keys in the tint color, usually
        letters, beside a plain list.
      </li>
      <li>
        It goes in the list’s{' '}
        <PartLink
          component="list"
          part="List.Root"
        />
        , after the sections, and the list places it. It sits at the list’s end
        edge (in its inset, if it has one), above the sticky headers. It’s
        centered on the list, or on the part of it in view, between the scroll
        container’s bars.
      </li>
      <li>Pressing or scrubbing over it clicks its items.</li>
      <li>
        It needs a view at least as tall as itself. Taller than the view of its
        scroll container, it’s clipped there, and the items beyond the view
        can’t be reached.
      </li>
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
        A key of the index (a button), its <code>value</code> its text unless
        given.
      </li>
      <li>
        Chosen, it scrolls its list to the{' '}
        <PartLink
          component="list"
          part="List.Section"
        />{' '}
        whose <code>indexValue</code> it is (or a row’s, see{' '}
        <PartLink
          component="list"
          part="List.Item"
        />
        ), to the top of the view. Without one, it jumps to the section of the
        next item after it that has one, in the index’s own order: so letters
        without contacts still work, and so do groups that don’t sort as their
        letters do.
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
        A row’s click handler that passes the click on to the control inside it,
        as native rows do: pressing a switch’s row toggles the switch (see{' '}
        <PartLink part="List.Checkbox" />, <PartLink part="List.Radio" />
        ).
      </li>
      <li>
        It passes the click on as the kind it is, a pointer’s or a keyboard’s.
        (A control’s <code>click()</code> would count as a keyboard’s, so menus
        would open with their first item highlighted.) The control’s own clicks
        aren’t passed on again.
      </li>
    </ul>
    <CodeView code={forwardClickCode} />
    <h3>Arguments and Return</h3>
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
