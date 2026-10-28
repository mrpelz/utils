import { FunctionComponent, useMemo } from 'react';

import { Collapsible, List } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import {
  collapsiblePanelRows,
  collapsibleRootRows,
  collapsibleTriggerRows,
} from './docs.js';
import {
  getPropOptionsRoot,
  propOptionsPanel,
  propOptionsTrigger,
} from './props.js';

/** The section's rows (the panel's content). */
const rows = (
  <>
    <List.Item>
      <List.Content>
        <List.Title>Proxy</List.Title>
      </List.Content>
      <List.Trailing>
        <List.Detail>Off</List.Detail>
      </List.Trailing>
    </List.Item>
    <List.Item>
      <List.Content>
        <List.Title>DNS</List.Title>
      </List.Content>
      <List.Trailing>
        <List.Detail>Automatic</List.Detail>
      </List.Trailing>
    </List.Item>
  </>
);

/** `Collapsible.Root` (the section), outlined, with its props. */
const RootPart: FunctionComponent = () => {
  const id = 'collapsible-parts-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    {
      external,
      isOpen: true,
      emphasize: 'outline',
      title: 'Collapsible.Root',
    },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Collapsible.Root"
    >
      <List.Root style={{ width: 'min(402px, 100%)' }}>
        <Collapsible.Root
          key={elementKey}
          render={<List.Section />}
          {...props}
        >
          <Collapsible.Trigger
            nativeButton={false}
            render={<List.Header />}
          >
            <List.Title>Advanced</List.Title>
            <List.Disclosure />
          </Collapsible.Trigger>
          <Collapsible.Panel render={<List.Group />}>{rows}</Collapsible.Panel>
        </Collapsible.Root>
      </List.Root>
    </Component>
  );
};

/** `Collapsible.Trigger` (the header), outlined, with its props. */
const TriggerPart: FunctionComponent = () => {
  const id = 'collapsible-parts-trigger';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsTrigger, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Collapsible.Trigger',
  });

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      state={[state]}
      title="Collapsible.Trigger"
    >
      <List.Root style={{ width: 'min(402px, 100%)' }}>
        <Collapsible.Root
          defaultOpen
          render={<List.Section />}
        >
          <Collapsible.Trigger
            nativeButton={false}
            render={<List.Header />}
            {...props}
          >
            <List.Title>Advanced</List.Title>
            <List.Disclosure />
          </Collapsible.Trigger>
          <Collapsible.Panel render={<List.Group />}>{rows}</Collapsible.Panel>
        </Collapsible.Root>
      </List.Root>
    </Component>
  );
};

/** `Collapsible.Panel` (the group), outlined, with its props. */
const PanelPart: FunctionComponent = () => {
  const id = 'collapsible-parts-panel';
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(propOptionsPanel, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Collapsible.Panel',
  });

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      state={[state]}
      title="Collapsible.Panel"
    >
      <List.Root style={{ width: 'min(402px, 100%)' }}>
        <Collapsible.Root
          defaultOpen
          render={<List.Section />}
        >
          <Collapsible.Trigger
            nativeButton={false}
            render={<List.Header />}
          >
            <List.Title>Advanced</List.Title>
            <List.Disclosure />
          </Collapsible.Trigger>
          <Collapsible.Panel
            key={elementKey}
            render={<List.Group />}
            {...props}
          >
            {rows}
          </Collapsible.Panel>
        </Collapsible.Root>
      </List.Root>
    </Component>
  );
};

/** `/collapsible/parts`: its three parts (Base UI's). */
export const CollapsibleParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        Base UI’s parts: its root, a trigger, the panel; each rendering what it
        collapses (<code>render</code>).
      </li>
    </ul>
    <ul>
      <li>
        <PartLink
          component="collapsible"
          part="Collapsible.Root"
        />
        <ul>
          <li>
            <PartLink
              component="collapsible"
              part="Collapsible.Trigger"
            />
          </li>
          <li>
            <PartLink
              component="collapsible"
              part="Collapsible.Panel"
            />
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="collapsible-root"
      level={2}
    >
      <code>Collapsible.Root</code>
    </Heading>
    <ul>
      <li>
        Its state: <code>defaultOpen</code>, or <code>open</code> and{' '}
        <code>onOpenChange</code>; <code>disabled</code>.
      </li>
      <li>
        Renders a <code>div</code>, or what it’s given: here a{' '}
        <PartLink
          component="list"
          part="List.Section"
        />
        .
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={collapsibleRootRows} />

    <Heading
      id="collapsible-trigger"
      level={2}
    >
      <code>Collapsible.Trigger</code>
    </Heading>
    <ul>
      <li>
        A button toggling it: <code>aria-expanded</code>,{' '}
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
    <PropsTable rows={collapsibleTriggerRows} />

    <Heading
      id="collapsible-panel"
      level={2}
    >
      <code>Collapsible.Panel</code>
    </Heading>
    <ul>
      <li>
        What it collapses, its height and opacity transitioning (300ms; Base
        UI’s <code>--collapsible-panel-height</code>, starting and ending
        styles).
      </li>
      <li>
        Closed, removed (or hidden: <code>keepMounted</code>,{' '}
        <code>hiddenUntilFound</code>).
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
    <PropsTable rows={collapsiblePanelRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const collapsiblePartsDemos = [RootPart, TriggerPart, PanelPart];
