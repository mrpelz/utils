import { FunctionComponent, useMemo } from 'react';

import { Accordion, List } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  type PartProps,
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import {
  accordionHeaderRows,
  accordionItemRows,
  accordionPanelRows,
  accordionRootRows,
  accordionTriggerRows,
} from './docs.js';
import {
  getPropOptionsItem,
  getPropOptionsRoot,
  propOptionsPanel,
  propOptionsTrigger,
} from './props.js';

/** iCloud's mailboxes (its panel's rows). */
const icloudRows = (partProps: PartProps = {}) => (
  <>
    <List.Item {...partProps['List.Item']}>
      <List.Content {...partProps['List.Content']}>
        <List.Title {...partProps['List.Title']}>Inbox</List.Title>
      </List.Content>
      <List.Trailing {...partProps['List.Trailing']}>
        <List.Detail {...partProps['List.Detail']}>12</List.Detail>
      </List.Trailing>
    </List.Item>
    <List.Item {...partProps['List.Item']}>
      <List.Content {...partProps['List.Content']}>
        <List.Title {...partProps['List.Title']}>Sent</List.Title>
      </List.Content>
    </List.Item>
  </>
);

/** The Work account's section (an item as is). */
const work = (partProps: PartProps = {}) => (
  <Accordion.Item
    {...partProps['Accordion.Item']}
    render={<List.Section {...partProps['List.Section']} />}
    value="work"
  >
    <Accordion.Trigger
      {...partProps['Accordion.Trigger']}
      nativeButton={false}
      render={<List.Header {...partProps['List.Header']} />}
    >
      <List.Title {...partProps['List.Title']}>Work</List.Title>
      <List.Disclosure {...partProps['List.Disclosure']} />
    </Accordion.Trigger>
    <Accordion.Panel
      {...partProps['Accordion.Panel']}
      render={<List.Group {...partProps['List.Group']} />}
    >
      <List.Item {...partProps['List.Item']}>
        <List.Content {...partProps['List.Content']}>
          <List.Title {...partProps['List.Title']}>Inbox</List.Title>
        </List.Content>
        <List.Trailing {...partProps['List.Trailing']}>
          <List.Detail {...partProps['List.Detail']}>3</List.Detail>
        </List.Trailing>
      </List.Item>
    </Accordion.Panel>
  </Accordion.Item>
);

/** `Accordion.Root`, outlined, with its props. */
const RootPart: FunctionComponent = () => {
  const id = 'accordion-parts-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external, isOpen: true, emphasize: 'outline', title: 'Accordion.Root' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Accordion.Item': ['render', 'value'],
            'Accordion.Panel': ['render'],
            'Accordion.Trigger': ['nativeButton', 'render'],
            'List.Content': [],
            'List.Detail': [],
            'List.Disclosure': [],
            'List.Group': [],
            'List.Header': [],
            'List.Item': [],
            'List.Root': ['style'],
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
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="Accordion.Root"
    >
      <Accordion.Root
        key={elementKey}
        render={
          <List.Root
            {...partProps['List.Root']}
            style={{ width: 'min(402px, 100%)' }}
          />
        }
        {...props}
      >
        <Accordion.Item
          {...partProps['Accordion.Item']}
          render={<List.Section {...partProps['List.Section']} />}
          value="icloud"
        >
          <Accordion.Trigger
            {...partProps['Accordion.Trigger']}
            nativeButton={false}
            render={<List.Header {...partProps['List.Header']} />}
          >
            <List.Title {...partProps['List.Title']}>iCloud</List.Title>
            <List.Disclosure {...partProps['List.Disclosure']} />
          </Accordion.Trigger>
          <Accordion.Panel
            {...partProps['Accordion.Panel']}
            render={<List.Group {...partProps['List.Group']} />}
          >
            {icloudRows(partProps)}
          </Accordion.Panel>
        </Accordion.Item>
        {work(partProps)}
      </Accordion.Root>
    </Component>
  );
};

/** `Accordion.Item`, outlined, with its props. */
const ItemPart: FunctionComponent = () => {
  const id = 'accordion-parts-item';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsItem(addLog), [addLog]),
    { external, isOpen: true, emphasize: 'outline', title: 'Accordion.Item' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Accordion.Item': ['render', 'value'],
            'Accordion.Panel': ['render'],
            'Accordion.Root': ['defaultValue', 'render'],
            'Accordion.Trigger': ['nativeButton', 'render'],
            'List.Content': [],
            'List.Detail': [],
            'List.Disclosure': [],
            'List.Group': [],
            'List.Header': [],
            'List.Item': [],
            'List.Root': ['style'],
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
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="Accordion.Item"
    >
      <Accordion.Root
        {...partProps['Accordion.Root']}
        defaultValue={['icloud']}
        render={
          <List.Root
            {...partProps['List.Root']}
            style={{ width: 'min(402px, 100%)' }}
          />
        }
      >
        <Accordion.Item
          render={<List.Section {...partProps['List.Section']} />}
          value="icloud"
          {...props}
        >
          <Accordion.Trigger
            {...partProps['Accordion.Trigger']}
            nativeButton={false}
            render={<List.Header {...partProps['List.Header']} />}
          >
            <List.Title {...partProps['List.Title']}>iCloud</List.Title>
            <List.Disclosure {...partProps['List.Disclosure']} />
          </Accordion.Trigger>
          <Accordion.Panel
            {...partProps['Accordion.Panel']}
            render={<List.Group {...partProps['List.Group']} />}
          >
            {icloudRows(partProps)}
          </Accordion.Panel>
        </Accordion.Item>
        {work(partProps)}
      </Accordion.Root>
    </Component>
  );
};

/** `Accordion.Trigger`, outlined, with its props. */
const TriggerPart: FunctionComponent = () => {
  const id = 'accordion-parts-trigger';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsTrigger, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Accordion.Trigger',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Accordion.Item': ['render', 'value'],
          'Accordion.Panel': ['render'],
          'Accordion.Root': ['defaultValue', 'render'],
          'Accordion.Trigger': ['nativeButton', 'render'],
          'List.Content': [],
          'List.Detail': [],
          'List.Disclosure': [],
          'List.Group': [],
          'List.Header': [],
          'List.Item': [],
          'List.Root': ['style'],
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
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Accordion.Trigger"
    >
      <Accordion.Root
        {...partProps['Accordion.Root']}
        defaultValue={['icloud']}
        render={
          <List.Root
            {...partProps['List.Root']}
            style={{ width: 'min(402px, 100%)' }}
          />
        }
      >
        <Accordion.Item
          {...partProps['Accordion.Item']}
          render={<List.Section {...partProps['List.Section']} />}
          value="icloud"
        >
          <Accordion.Trigger
            nativeButton={false}
            render={<List.Header {...partProps['List.Header']} />}
            {...props}
          >
            <List.Title {...partProps['List.Title']}>iCloud</List.Title>
            <List.Disclosure {...partProps['List.Disclosure']} />
          </Accordion.Trigger>
          <Accordion.Panel
            {...partProps['Accordion.Panel']}
            render={<List.Group {...partProps['List.Group']} />}
          >
            {icloudRows(partProps)}
          </Accordion.Panel>
        </Accordion.Item>
        {work(partProps)}
      </Accordion.Root>
    </Component>
  );
};

/** `Accordion.Panel`, outlined, with its props. */
const PanelPart: FunctionComponent = () => {
  const id = 'accordion-parts-panel';
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(propOptionsPanel, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Accordion.Panel',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Accordion.Item': ['render', 'value'],
          'Accordion.Panel': ['render'],
          'Accordion.Root': ['defaultValue', 'render'],
          'Accordion.Trigger': ['nativeButton', 'render'],
          'List.Content': [],
          'List.Detail': [],
          'List.Disclosure': [],
          'List.Group': [],
          'List.Header': [],
          'List.Item': [],
          'List.Root': ['style'],
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
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Accordion.Panel"
    >
      <Accordion.Root
        {...partProps['Accordion.Root']}
        defaultValue={['icloud']}
        render={
          <List.Root
            {...partProps['List.Root']}
            style={{ width: 'min(402px, 100%)' }}
          />
        }
      >
        <Accordion.Item
          {...partProps['Accordion.Item']}
          render={<List.Section {...partProps['List.Section']} />}
          value="icloud"
        >
          <Accordion.Trigger
            {...partProps['Accordion.Trigger']}
            nativeButton={false}
            render={<List.Header {...partProps['List.Header']} />}
          >
            <List.Title {...partProps['List.Title']}>iCloud</List.Title>
            <List.Disclosure {...partProps['List.Disclosure']} />
          </Accordion.Trigger>
          <Accordion.Panel
            key={elementKey}
            render={<List.Group {...partProps['List.Group']} />}
            {...props}
          >
            {icloudRows(partProps)}
          </Accordion.Panel>
        </Accordion.Item>
        {work(partProps)}
      </Accordion.Root>
    </Component>
  );
};

/** `/accordion/parts`: its parts (Base UI's). */
export const AccordionParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        Base UI’s parts: the root, and its items, each with a trigger (in a
        header) and a panel. Each part renders what it collapses (
        <code>render</code>).
      </li>
    </ul>
    <ul className="demo-tree">
      <li>
        <PartLink
          component="accordion"
          part="Accordion.Root"
        />{' '}
        (here rendering a{' '}
        <PartLink
          component="list"
          part="List.Root"
        />
        )
        <ul>
          <li>
            <PartLink
              component="accordion"
              part="Accordion.Item"
            />{' '}
            (one or more; here each rendering a{' '}
            <PartLink
              component="list"
              part="List.Section"
            />
            )
            <ul>
              <li>
                <PartLink
                  component="accordion"
                  part="Accordion.Header"
                />{' '}
                (optional: a heading around the trigger; not in a list)
                <ul>
                  <li>
                    <PartLink
                      component="accordion"
                      part="Accordion.Trigger"
                    />{' '}
                    (here rendering a{' '}
                    <PartLink
                      component="list"
                      part="List.Header"
                    />
                    )
                    <ul>
                      <li className="demo-tree-context">
                        <PartLink
                          component="list"
                          part="List.Title"
                        />{' '}
                        <span>and</span>{' '}
                        <PartLink
                          component="list"
                          part="List.Disclosure"
                        />
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                <PartLink
                  component="accordion"
                  part="Accordion.Panel"
                />{' '}
                (here rendering a{' '}
                <PartLink
                  component="list"
                  part="List.Group"
                />
                )
                <ul>
                  <li className="demo-tree-context">
                    <span>its rows (</span>
                    <PartLink
                      component="list"
                      part="List.Item"
                    />
                    <span>s)</span>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="accordion-root"
      level={2}
    >
      <code>Accordion.Root</code>
    </Heading>
    <ul>
      <li>
        Holds which items are open: <code>defaultValue</code>, or{' '}
        <code>value</code> and <code>onValueChange</code> (arrays of the items’{' '}
        <code>value</code>s). One is open at a time, unless{' '}
        <code>multiple</code> is set.
      </li>
      <li>
        Renders a <code>div</code>, or what it’s given. Here, the{' '}
        <a href={publicUrl('list')}>List</a> (
        <PartLink
          component="list"
          part="List.Root"
        />
        ).
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={accordionRootRows} />

    <Heading
      id="accordion-item"
      level={2}
    >
      <code>Accordion.Item</code>
    </Heading>
    <ul>
      <li>
        One collapsible, named by its <code>value</code>. Here, a{' '}
        <PartLink
          component="list"
          part="List.Section"
        />{' '}
        for one account.
      </li>
    </ul>
    <ItemPart />
    <h3>Props</h3>
    <PropsTable rows={accordionItemRows} />

    <Heading
      id="accordion-header"
      level={2}
    >
      <code>Accordion.Header</code>
    </Heading>
    <ul>
      <li>
        A heading (<code>h3</code>) around its item’s trigger, for people who
        navigate a page by its headings.
      </li>
      <li>
        In a list, the trigger is the section’s{' '}
        <PartLink
          component="list"
          part="List.Header"
        />{' '}
        itself, without a header part, as in these demos.
      </li>
    </ul>
    <h3>Props</h3>
    <PropsTable rows={accordionHeaderRows} />

    <Heading
      id="accordion-trigger"
      level={2}
    >
      <code>Accordion.Trigger</code>
    </Heading>
    <ul>
      <li>
        A button that toggles its item. It sets <code>aria-expanded</code>,{' '}
        <code>aria-controls</code> and <code>data-panel-open</code> (which turns
        a{' '}
        <PartLink
          component="list"
          part="List.Disclosure"
        />{' '}
        inside it down).
      </li>
      <li>
        Here, it renders a{' '}
        <PartLink
          component="list"
          part="List.Header"
        />{' '}
        (<code>nativeButton=&#123;false&#125;</code>).
      </li>
    </ul>
    <TriggerPart />
    <h3>Props</h3>
    <PropsTable rows={accordionTriggerRows} />

    <Heading
      id="accordion-panel"
      level={2}
    >
      <code>Accordion.Panel</code>
    </Heading>
    <ul>
      <li>
        What its item collapses. Its height and opacity transition (300ms),
        using Base UI’s <code>--accordion-panel-height</code> and its starting
        and ending styles.
      </li>
      <li>
        Here, it renders a{' '}
        <PartLink
          component="list"
          part="List.Group"
        />
        .
      </li>
    </ul>
    <PanelPart />
    <h3>Props</h3>
    <PropsTable rows={accordionPanelRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const accordionPartsDemos = [RootPart, ItemPart, TriggerPart, PanelPart];
