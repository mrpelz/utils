import { FunctionComponent, useMemo } from 'react';

import { Collapsible, List } from '../../../components/index.js';
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
import { partPropMaps } from '../part-options.js';
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
const rows = (partProps: PartProps = {}) => (
  <>
    <List.Item {...partProps['List.Item']}>
      <List.Content {...partProps['List.Content']}>
        <List.Title {...partProps['List.Title']}>Proxy</List.Title>
      </List.Content>
      <List.Trailing {...partProps['List.Trailing']}>
        <List.Detail {...partProps['List.Detail']}>Off</List.Detail>
      </List.Trailing>
    </List.Item>
    <List.Item {...partProps['List.Item']}>
      <List.Content {...partProps['List.Content']}>
        <List.Title {...partProps['List.Title']}>DNS</List.Title>
      </List.Content>
      <List.Trailing {...partProps['List.Trailing']}>
        <List.Detail {...partProps['List.Detail']}>Automatic</List.Detail>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Collapsible.Panel': ['render'],
            'Collapsible.Trigger': ['nativeButton', 'render'],
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
      title="Collapsible.Root"
    >
      <List.Root
        {...partProps['List.Root']}
        style={{ width: 'min(402px, 100%)' }}
      >
        <Collapsible.Root
          key={elementKey}
          render={<List.Section {...partProps['List.Section']} />}
          {...props}
        >
          <Collapsible.Trigger
            {...partProps['Collapsible.Trigger']}
            nativeButton={false}
            render={<List.Header {...partProps['List.Header']} />}
          >
            <List.Title {...partProps['List.Title']}>Advanced</List.Title>
            <List.Disclosure {...partProps['List.Disclosure']} />
          </Collapsible.Trigger>
          <Collapsible.Panel
            {...partProps['Collapsible.Panel']}
            render={<List.Group {...partProps['List.Group']} />}
          >
            {rows(partProps)}
          </Collapsible.Panel>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Collapsible.Panel': ['render'],
          'Collapsible.Root': ['defaultOpen', 'render'],
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
      title="Collapsible.Trigger"
    >
      <List.Root
        {...partProps['List.Root']}
        style={{ width: 'min(402px, 100%)' }}
      >
        <Collapsible.Root
          {...partProps['Collapsible.Root']}
          defaultOpen
          render={<List.Section {...partProps['List.Section']} />}
        >
          <Collapsible.Trigger
            nativeButton={false}
            render={<List.Header {...partProps['List.Header']} />}
            {...props}
          >
            <List.Title {...partProps['List.Title']}>Advanced</List.Title>
            <List.Disclosure {...partProps['List.Disclosure']} />
          </Collapsible.Trigger>
          <Collapsible.Panel
            {...partProps['Collapsible.Panel']}
            render={<List.Group {...partProps['List.Group']} />}
          >
            {rows(partProps)}
          </Collapsible.Panel>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Collapsible.Root': ['defaultOpen', 'render'],
          'Collapsible.Trigger': ['nativeButton', 'render'],
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
      title="Collapsible.Panel"
    >
      <List.Root
        {...partProps['List.Root']}
        style={{ width: 'min(402px, 100%)' }}
      >
        <Collapsible.Root
          {...partProps['Collapsible.Root']}
          defaultOpen
          render={<List.Section {...partProps['List.Section']} />}
        >
          <Collapsible.Trigger
            {...partProps['Collapsible.Trigger']}
            nativeButton={false}
            render={<List.Header {...partProps['List.Header']} />}
          >
            <List.Title {...partProps['List.Title']}>Advanced</List.Title>
            <List.Disclosure {...partProps['List.Disclosure']} />
          </Collapsible.Trigger>
          <Collapsible.Panel
            key={elementKey}
            render={<List.Group {...partProps['List.Group']} />}
            {...props}
          >
            {rows(partProps)}
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
        Base UI’s parts: the root, a trigger and the panel. Each renders what it
        collapses (<code>render</code>).
      </li>
    </ul>
    <ul className="demo-tree">
      <li className="demo-tree-context">
        <PartLink
          component="list"
          part="List.Root"
        />{' '}
        <span>(here)</span>
        <ul>
          <li>
            <PartLink
              component="collapsible"
              part="Collapsible.Root"
            />{' '}
            (here rendering a{' '}
            <PartLink
              component="list"
              part="List.Section"
            />
            )
            <ul>
              <li>
                <PartLink
                  component="collapsible"
                  part="Collapsible.Trigger"
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
              <li>
                <PartLink
                  component="collapsible"
                  part="Collapsible.Panel"
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
      id="collapsible-root"
      level={2}
    >
      <code>Collapsible.Root</code>
    </Heading>
    <ul>
      <li>
        Holds its state: <code>defaultOpen</code>, or <code>open</code> and{' '}
        <code>onOpenChange</code>, and <code>disabled</code>.
      </li>
      <li>
        Renders a <code>div</code>, or what it’s given. Here, a{' '}
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
        A button that toggles it. It sets <code>aria-expanded</code>,{' '}
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
    <PropsTable rows={collapsibleTriggerRows} />

    <Heading
      id="collapsible-panel"
      level={2}
    >
      <code>Collapsible.Panel</code>
    </Heading>
    <ul>
      <li>
        What it collapses. Its height and opacity transition (300ms), using Base
        UI’s <code>--collapsible-panel-height</code> and its starting and ending
        styles.
      </li>
      <li>
        While closed, it’s removed, or hidden with <code>keepMounted</code> or{' '}
        <code>hiddenUntilFound</code>.
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
    <PropsTable rows={collapsiblePanelRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const collapsiblePartsDemos = [RootPart, TriggerPart, PanelPart];
