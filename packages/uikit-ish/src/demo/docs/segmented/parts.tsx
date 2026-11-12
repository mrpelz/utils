import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { FunctionComponent, useMemo } from 'react';

import { Segmented, Symbol } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { AddLog, useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { sfCheckmark } from '../../tooling/icons.js';
import { partPropMaps } from '../part-options.js';
import { periods } from './content.js';
import {
  segmentedHighlightRows,
  segmentedIndicatorRows,
  segmentedItemRows,
  segmentedRootRows,
} from './docs.js';
import {
  getPropOptionsItem,
  getPropOptionsRoot,
  propOptionsHighlight,
  propOptionsIndicator,
} from './props.js';

// Every view writes out its control (three periods, see content.ts), the
// part's props on it (on the first item, or its indicator), so its code
// shows as it'd be used.

const items = periods.slice(0, 3);

const logChange =
  (addLog: AddLog) =>
  (value: unknown, { reason }: BaseRadioGroup.ChangeEventDetails) =>
    addLog(`value change: ${String(value)}/${reason}`);

/** `Segmented.Root`, outlined, with its props. */
const RootPart: FunctionComponent = () => {
  const id = 'segmented-parts-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(
      () => getPropOptionsRoot(addLog, ['day', 'week', 'month']),
      [addLog],
    ),
    { external, isOpen: true, emphasize: 'outline', title: 'Segmented.Root' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Segmented.Highlight': [],
            'Segmented.Item': ['value'],
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
      title="Segmented.Root"
    >
      <Segmented.Root
        key={elementKey}
        aria-label="Period"
        {...props}
      >
        {items.map(([value, label]) => (
          <Segmented.Item
            key={value}
            {...partProps['Segmented.Item']}
            value={value}
          >
            {label}
          </Segmented.Item>
        ))}
        <Segmented.Highlight {...partProps['Segmented.Highlight']} />
      </Segmented.Root>
    </Component>
  );
};

/** `Segmented.Item` (Day), outlined, with its props. */
const ItemPart: FunctionComponent = () => {
  const id = 'segmented-parts-item';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsItem('day', addLog), [addLog]),
    { external, isOpen: true, emphasize: 'outline', title: 'Segmented.Item' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Segmented.Item (others)': ['value'],
            'Segmented.Highlight': [],
            'Segmented.Root': ['aria-label', 'defaultValue', 'onValueChange'],
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
      title="Segmented.Item"
    >
      <Segmented.Root
        key={elementKey}
        {...partProps['Segmented.Root']}
        aria-label="Period"
        defaultValue="day"
        onValueChange={logChange(addLog)}
      >
        {items.map(([value, label], index) => (
          <Segmented.Item
            key={value}
            value={value}
            {...(index === 0 ? props : partProps['Segmented.Item (others)'])}
          >
            {label}
          </Segmented.Item>
        ))}
        <Segmented.Highlight {...partProps['Segmented.Highlight']} />
      </Segmented.Root>
    </Component>
  );
};

/** `Segmented.Highlight`, outlined, with its props. */
const HighlightPart: FunctionComponent = () => {
  const id = 'segmented-parts-highlight';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    propOptionsHighlight,
    {
      external,
      isOpen: true,
      emphasize: 'outline',
      title: 'Segmented.Highlight',
    },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Segmented.Item': ['value'],
            'Segmented.Root': ['aria-label', 'defaultValue', 'onValueChange'],
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
      title="Segmented.Highlight"
    >
      <Segmented.Root
        key={elementKey}
        {...partProps['Segmented.Root']}
        aria-label="Period"
        defaultValue="day"
        onValueChange={logChange(addLog)}
      >
        {items.map(([value, label]) => (
          <Segmented.Item
            key={value}
            {...partProps['Segmented.Item']}
            value={value}
          >
            {label}
          </Segmented.Item>
        ))}
        <Segmented.Highlight {...props} />
      </Segmented.Root>
    </Component>
  );
};

/** `Segmented.Indicator` (a checkmark in each item), outlined, with its props. */
const IndicatorPart: FunctionComponent = () => {
  const id = 'segmented-parts-indicator';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    propOptionsIndicator,
    {
      external,
      isOpen: true,
      emphasize: 'outline',
      title: 'Segmented.Indicator',
    },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Segmented.Highlight': [],
            'Segmented.Item': ['value'],
            'Segmented.Root': ['aria-label', 'defaultValue', 'onValueChange'],
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
      title="Segmented.Indicator"
    >
      <Segmented.Root
        key={elementKey}
        {...partProps['Segmented.Root']}
        aria-label="Period"
        defaultValue="day"
        onValueChange={logChange(addLog)}
      >
        {items.map(([value, label]) => (
          <Segmented.Item
            key={value}
            {...partProps['Segmented.Item']}
            value={value}
          >
            <Segmented.Indicator {...props}>
              <Symbol
                {...partProps.Symbol}
                icon={sfCheckmark}
              />
            </Segmented.Indicator>{' '}
            {label}
          </Segmented.Item>
        ))}
        <Segmented.Highlight {...partProps['Segmented.Highlight']} />
      </Segmented.Root>
    </Component>
  );
};

/** `/segmented/parts`: the track, its items, the highlight. */
export const SegmentedParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>Root: the track, which holds the choice.</li>
      <li>Items: the options.</li>
      <li>Highlight, after them: the selection.</li>
      <li>An item can hold an indicator, rendered while it’s chosen.</li>
    </ul>
    <ul className="demo-tree">
      <li>
        <PartLink
          component="segmented"
          part="Segmented.Root"
        />
        <ul>
          <li>
            <PartLink
              component="segmented"
              part="Segmented.Item"
            />{' '}
            (two or more)
            <ul>
              <li>
                <PartLink
                  component="segmented"
                  part="Segmented.Indicator"
                />{' '}
                (optional)
              </li>
            </ul>
          </li>
          <li>
            <PartLink
              component="segmented"
              part="Segmented.Highlight"
            />{' '}
            (last)
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="segmented-root"
      level={2}
    >
      <code>Segmented.Root</code>
    </Heading>
    <ul>
      <li>Base UI’s radio group, as the track.</li>
      <li>
        Its choice: <code>value</code> or <code>defaultValue</code>, and{' '}
        <code>onValueChange</code>.
      </li>
      <li>
        It can be <code>disabled</code> or <code>readOnly</code>.
      </li>
      <li>
        It submits with a form: <code>name</code>, <code>required</code>.
      </li>
      <li>
        Its separators: <code>hideSeparators</code>.
      </li>
      <li>
        When it’s too narrow for its items, their labels truncate, or the items
        scroll sideways, snapping, with the chosen one in view (
        <code>overflow</code>).
      </li>
      <li>It renders the lens shown while an item is pressed.</li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={segmentedRootRows} />

    <Heading
      id="segmented-item"
      level={2}
    >
      <code>Segmented.Item</code>
    </Heading>
    <ul>
      <li>
        An option, by its <code>value</code>, with its children as its label.
      </li>
      <li>
        It can be <code>disabled</code> or <code>readOnly</code>.
      </li>
      <li>
        Secondary clicks: <code>onSecondaryClick</code>.
      </li>
      <li>
        It reserves width for the chosen (bolder) label, so the control doesn’t
        change size.
      </li>
    </ul>
    <ItemPart />
    <h3>Props</h3>
    <PropsTable rows={segmentedItemRows} />

    <Heading
      id="segmented-highlight"
      level={2}
    >
      <code>Segmented.Highlight</code>
    </Heading>
    <ul>
      <li>The selection, after the items.</li>
      <li>It sits on the chosen item and slides between them.</li>
      <li>
        It’s hidden while none is chosen, and while an item is pressed (the lens
        takes over).
      </li>
      <li>It only takes styling props.</li>
    </ul>
    <HighlightPart />
    <h3>Props</h3>
    <PropsTable rows={segmentedHighlightRows} />

    <Heading
      id="segmented-indicator"
      level={2}
    >
      <code>Segmented.Indicator</code>
    </Heading>
    <ul>
      <li>Base UI’s radio indicator, without styles, inside an item.</li>
      <li>
        It renders while its item is chosen (or always, with{' '}
        <code>keepMounted</code>), for example for a mark next to the label (as
        here).
      </li>
      <li>These segmented controls don’t use it.</li>
    </ul>
    <IndicatorPart />
    <h3>Props</h3>
    <PropsTable rows={segmentedIndicatorRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const segmentedPartsDemos = [
  RootPart,
  ItemPart,
  HighlightPart,
  IndicatorPart,
];
