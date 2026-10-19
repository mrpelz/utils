import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { sfCheckmark } from '@bradleyhodges/sfsymbols/sfCheckmark';
import { FunctionComponent, useMemo } from 'react';

import { Segmented, Symbol } from '../../components/index.js';
import { AddLog, useLog } from '../utils/log.js';
import { Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { PropsTable } from '../utils/props-table.js';
import { Contents, PartLink, type Section } from '../utils/sections.js';
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
    'Segmented.Root',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
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
    'Segmented.Item',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
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
    'Segmented.Highlight',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
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
    'Segmented.Indicator',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
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

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['segmented-root', 'Segmented.Root'],
  ['segmented-item', 'Segmented.Item'],
  ['segmented-highlight', 'Segmented.Highlight'],
  ['segmented-indicator', 'Segmented.Indicator'],
];

/** `/segmented/parts`: the track, its items, the highlight. */
export const SegmentedParts: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <p className="demo-lead">
      A segmented control is a root (the track, holding the choice) with its
      items (the options) and, after them, the highlight (the selection). An
      item can hold an indicator, rendered while it’s chosen.
    </p>
    <ul>
      <li>
        <PartLink part="Segmented.Root" />
        <ul>
          <li>
            <PartLink part="Segmented.Item" /> (two or more)
            <ul>
              <li>
                <PartLink part="Segmented.Indicator" /> (optional)
              </li>
            </ul>
          </li>
          <li>
            <PartLink part="Segmented.Highlight" /> (last)
          </li>
        </ul>
      </li>
    </ul>

    <h2 id="segmented-root">
      <code>Segmented.Root</code>
    </h2>
    <p>
      Base UI’s radio group, as the track: it holds the choice (
      <code>value</code> or <code>defaultValue</code>,{' '}
      <code>onValueChange</code>), can be <code>disabled</code> or{' '}
      <code>readOnly</code>, submits with a form (<code>name</code>,{' '}
      <code>required</code>), and hides its separators (
      <code>hideSeparators</code>). It renders the lens shown while an item is
      pressed.
    </p>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={segmentedRootRows} />

    <h2 id="segmented-item">
      <code>Segmented.Item</code>
    </h2>
    <p>
      An option, by its <code>value</code>, its children its label: can be{' '}
      <code>disabled</code> or <code>readOnly</code>, and take secondary clicks
      (<code>onSecondaryClick</code>). Its width is reserved for the chosen
      (bolder) label, so the control doesn’t change size.
    </p>
    <ItemPart />
    <h3>Props</h3>
    <PropsTable rows={segmentedItemRows} />

    <h2 id="segmented-highlight">
      <code>Segmented.Highlight</code>
    </h2>
    <p>
      The selection, after the items: on the chosen item, sliding between them,
      hidden while none is chosen and while an item is pressed (as the lens
      takes over). It takes only styling.
    </p>
    <HighlightPart />
    <h3>Props</h3>
    <PropsTable rows={segmentedHighlightRows} />

    <h2 id="segmented-indicator">
      <code>Segmented.Indicator</code>
    </h2>
    <p>
      Base UI’s radio indicator, unstyled, inside an item: rendered while its
      item is chosen (always, with <code>keepMounted</code>), e.g. for a mark
      beside the label, as here. iOS’s segmented controls don’t use one.
    </p>
    <IndicatorPart />
    <h3>Props</h3>
    <PropsTable rows={segmentedIndicatorRows} />
  </>
);
