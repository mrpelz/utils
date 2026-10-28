import { FunctionComponent, useMemo } from 'react';

import { Accordion, List } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
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
const icloudRows = (
  <>
    <List.Item>
      <List.Content>
        <List.Title>Inbox</List.Title>
      </List.Content>
      <List.Trailing>
        <List.Detail>12</List.Detail>
      </List.Trailing>
    </List.Item>
    <List.Item>
      <List.Content>
        <List.Title>Sent</List.Title>
      </List.Content>
    </List.Item>
  </>
);

/** The Work account's section (an item as is). */
const work = (
  <Accordion.Item
    render={<List.Section />}
    value="work"
  >
    <Accordion.Trigger
      nativeButton={false}
      render={<List.Header />}
    >
      <List.Title>Work</List.Title>
      <List.Disclosure />
    </Accordion.Trigger>
    <Accordion.Panel render={<List.Group />}>
      <List.Item>
        <List.Content>
          <List.Title>Inbox</List.Title>
        </List.Content>
        <List.Trailing>
          <List.Detail>3</List.Detail>
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

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Accordion.Root"
    >
      <Accordion.Root
        key={elementKey}
        render={<List.Root style={{ width: 'min(402px, 100%)' }} />}
        {...props}
      >
        <Accordion.Item
          render={<List.Section />}
          value="icloud"
        >
          <Accordion.Trigger
            nativeButton={false}
            render={<List.Header />}
          >
            <List.Title>iCloud</List.Title>
            <List.Disclosure />
          </Accordion.Trigger>
          <Accordion.Panel render={<List.Group />}>
            {icloudRows}
          </Accordion.Panel>
        </Accordion.Item>
        {work}
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

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Accordion.Item"
    >
      <Accordion.Root
        defaultValue={['icloud']}
        render={<List.Root style={{ width: 'min(402px, 100%)' }} />}
      >
        <Accordion.Item
          render={<List.Section />}
          value="icloud"
          {...props}
        >
          <Accordion.Trigger
            nativeButton={false}
            render={<List.Header />}
          >
            <List.Title>iCloud</List.Title>
            <List.Disclosure />
          </Accordion.Trigger>
          <Accordion.Panel render={<List.Group />}>
            {icloudRows}
          </Accordion.Panel>
        </Accordion.Item>
        {work}
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

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      state={[state]}
      title="Accordion.Trigger"
    >
      <Accordion.Root
        defaultValue={['icloud']}
        render={<List.Root style={{ width: 'min(402px, 100%)' }} />}
      >
        <Accordion.Item
          render={<List.Section />}
          value="icloud"
        >
          <Accordion.Trigger
            nativeButton={false}
            render={<List.Header />}
            {...props}
          >
            <List.Title>iCloud</List.Title>
            <List.Disclosure />
          </Accordion.Trigger>
          <Accordion.Panel render={<List.Group />}>
            {icloudRows}
          </Accordion.Panel>
        </Accordion.Item>
        {work}
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

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      state={[state]}
      title="Accordion.Panel"
    >
      <Accordion.Root
        defaultValue={['icloud']}
        render={<List.Root style={{ width: 'min(402px, 100%)' }} />}
      >
        <Accordion.Item
          render={<List.Section />}
          value="icloud"
        >
          <Accordion.Trigger
            nativeButton={false}
            render={<List.Header />}
          >
            <List.Title>iCloud</List.Title>
            <List.Disclosure />
          </Accordion.Trigger>
          <Accordion.Panel
            key={elementKey}
            render={<List.Group />}
            {...props}
          >
            {icloudRows}
          </Accordion.Panel>
        </Accordion.Item>
        {work}
      </Accordion.Root>
    </Component>
  );
};

/** `/accordion/parts`: its parts (Base UI's). */
export const AccordionParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        Base UI’s parts: its root, its items, each a trigger (in a header) and a
        panel; each rendering what it collapses (<code>render</code>).
      </li>
    </ul>
    <ul>
      <li>
        <PartLink
          component="accordion"
          part="Accordion.Root"
        />
        <ul>
          <li>
            <PartLink
              component="accordion"
              part="Accordion.Item"
            />{' '}
            (one or more)
            <ul>
              <li>
                <PartLink
                  component="accordion"
                  part="Accordion.Header"
                />{' '}
                (optional, a heading around the trigger)
                <ul>
                  <li>
                    <PartLink
                      component="accordion"
                      part="Accordion.Trigger"
                    />
                  </li>
                </ul>
              </li>
              <li>
                <PartLink
                  component="accordion"
                  part="Accordion.Panel"
                />
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
        Which items are open: <code>defaultValue</code>, or <code>value</code>{' '}
        and <code>onValueChange</code> (arrays of their <code>value</code>s);
        one at a time unless <code>multiple</code>.
      </li>
      <li>
        Renders a <code>div</code>, or what it’s given: here the{' '}
        <a href="list">List</a> (
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
        One collapsible, named by its <code>value</code>: here a{' '}
        <PartLink
          component="list"
          part="List.Section"
        />{' '}
        (iCloud’s).
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
        A heading (<code>h3</code>) around its item’s trigger, for pages read by
        their headings.
      </li>
      <li>
        In a list, the trigger is the section’s{' '}
        <PartLink
          component="list"
          part="List.Header"
        />{' '}
        itself: no header part (as in these demos).
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
        A button toggling its item: <code>aria-expanded</code>,{' '}
        <code>aria-controls</code>, <code>data-panel-open</code> (a{' '}
        <PartLink
          component="list"
          part="List.Disclosure"
        />{' '}
        in it turning down).
      </li>
      <li>
        Here a{' '}
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
        What its item collapses, its height and opacity transitioning (300ms;
        Base UI’s <code>--accordion-panel-height</code>, starting and ending
        styles).
      </li>
      <li>
        Here a{' '}
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
