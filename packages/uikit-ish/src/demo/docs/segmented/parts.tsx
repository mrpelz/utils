import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { sfCheckmark } from '@bradleyhodges/sfsymbols/sfCheckmark';
import { FunctionComponent, useMemo } from 'react';

import { Segmented, Symbol } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { AddLog, useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
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

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
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
            value={value}
          >
            {label}
          </Segmented.Item>
        ))}
        <Segmented.Highlight />
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

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Segmented.Item"
    >
      <Segmented.Root
        key={elementKey}
        aria-label="Period"
        defaultValue="day"
        onValueChange={logChange(addLog)}
      >
        {items.map(([value, label], index) => (
          <Segmented.Item
            key={value}
            value={value}
            {...(index === 0 ? props : {})}
          >
            {label}
          </Segmented.Item>
        ))}
        <Segmented.Highlight />
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

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Segmented.Highlight"
    >
      <Segmented.Root
        key={elementKey}
        aria-label="Period"
        defaultValue="day"
        onValueChange={logChange(addLog)}
      >
        {items.map(([value, label]) => (
          <Segmented.Item
            key={value}
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

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Segmented.Indicator"
    >
      <Segmented.Root
        key={elementKey}
        aria-label="Period"
        defaultValue="day"
        onValueChange={logChange(addLog)}
      >
        {items.map(([value, label]) => (
          <Segmented.Item
            key={value}
            value={value}
          >
            <Segmented.Indicator {...props}>
              <Symbol icon={sfCheckmark} />
            </Segmented.Indicator>{' '}
            {label}
          </Segmented.Item>
        ))}
        <Segmented.Highlight />
      </Segmented.Root>
    </Component>
  );
};

/** `/segmented/parts`: the track, its items, the highlight. */
export const SegmentedParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>Root: the track, holding the choice.</li>
      <li>Items: the options.</li>
      <li>Highlight, after them: the selection.</li>
      <li>An item can hold an indicator, rendered while it’s chosen.</li>
    </ul>
    <ul>
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
        Choice: <code>value</code> or <code>defaultValue</code>,{' '}
        <code>onValueChange</code>.
      </li>
      <li>
        Can be <code>disabled</code> or <code>readOnly</code>.
      </li>
      <li>
        Submits with a form: <code>name</code>, <code>required</code>.
      </li>
      <li>
        Separators: <code>hideSeparators</code>.
      </li>
      <li>Renders the lens shown while an item is pressed.</li>
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
        An option, by its <code>value</code>; its children its label.
      </li>
      <li>
        Can be <code>disabled</code> or <code>readOnly</code>.
      </li>
      <li>
        Secondary clicks: <code>onSecondaryClick</code>.
      </li>
      <li>
        Width reserved for the chosen (bolder) label: the control doesn’t change
        size.
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
      <li>On the chosen item, sliding between them.</li>
      <li>
        Hidden while none is chosen, and while an item is pressed (the lens
        takes over).
      </li>
      <li>Takes only styling.</li>
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
      <li>Base UI’s radio indicator, unstyled, inside an item.</li>
      <li>
        Rendered while its item is chosen (always, with <code>keepMounted</code>
        ), e.g. for a mark beside the label (here).
      </li>
      <li>Not used by iOS’s segmented controls.</li>
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
