import { FunctionComponent, useMemo } from 'react';

import { Roll } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { PropsTable } from '../guide/props-table.js';
import { Heading, PartLink } from '../guide/sections.js';
import {
  rollColumnRows,
  rollItemRows,
  rollRootRows,
  rollSeparatorRows,
} from './docs.js';
import {
  fruits,
  getPropOptionsColumn,
  hours,
  minutes,
  propOptionsItem,
  propOptionsRoot,
  propOptionsSeparator,
} from './props.js';

/** `Roll.Root`, outlined, with its props. */
const RootPart: FunctionComponent = () => {
  const id = 'roll-parts-root';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsRoot,
    'Roll.Root',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      inputGuards
      controls={[control]}
      id={id}
      state={[state]}
      title="Roll.Root"
    >
      <Roll.Root {...props}>
        <Roll.Column
          aria-label="Fruit"
          defaultValue="Cherry"
        >
          {fruits.map((fruit) => (
            <Roll.Item
              key={fruit}
              value={fruit}
            />
          ))}
        </Roll.Column>
      </Roll.Root>
    </Component>
  );
};

/** `Roll.Column`, outlined, with its props (hours). */
const ColumnPart: FunctionComponent = () => {
  const id = 'roll-parts-column';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsColumn(addLog), [addLog]),
    'Roll.Column',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      inputGuards
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Roll.Column"
    >
      <Roll.Root>
        <Roll.Column
          key={elementKey}
          {...props}
        >
          {hours.map((hour) => (
            <Roll.Item
              key={hour}
              value={hour}
            />
          ))}
        </Roll.Column>
      </Roll.Root>
    </Component>
  );
};

/** `Roll.Item`, outlined (Durian), with its props. */
const ItemPart: FunctionComponent = () => {
  const id = 'roll-parts-item';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsItem,
    'Roll.Item (Durian)',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      inputGuards
      controls={[control]}
      id={id}
      state={[state]}
      title="Roll.Item"
    >
      <Roll.Root>
        <Roll.Column
          aria-label="Fruit"
          defaultValue="Cherry"
        >
          {fruits.map((fruit) => (
            <Roll.Item
              key={fruit}
              value={fruit}
              {...(fruit === 'Durian' ? props : {})}
            />
          ))}
        </Roll.Column>
      </Roll.Root>
    </Component>
  );
};

/** `Roll.Separator`, outlined, with its props (between hours, minutes). */
const SeparatorPart: FunctionComponent = () => {
  const id = 'roll-parts-separator';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsSeparator,
    'Roll.Separator',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      inputGuards
      controls={[control]}
      id={id}
      state={[state]}
      title="Roll.Separator"
    >
      <Roll.Root>
        <Roll.Column
          aria-label="Hours"
          defaultValue={9}
        >
          {hours.map((hour) => (
            <Roll.Item
              key={hour}
              value={hour}
            />
          ))}
        </Roll.Column>
        <Roll.Separator
          aria-hidden="true"
          {...props}
        >
          :
        </Roll.Separator>
        <Roll.Column
          aria-label="Minutes"
          defaultValue={41}
        >
          {minutes.map((minute) => (
            <Roll.Item
              key={minute}
              value={minute}
            >
              {String(minute).padStart(2, '0')}
            </Roll.Item>
          ))}
        </Roll.Column>
      </Roll.Root>
    </Component>
  );
};

/** `/roll/parts`: the wheel, its columns, rows and separators. */
export const RollParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>Root: the wheel, the band across its center.</li>
      <li>Column: a list of rows, scrolled to select one.</li>
      <li>Item: a row.</li>
      <li>Separator: text between columns (optional).</li>
    </ul>
    <ul>
      <li>
        <PartLink
          component="roll"
          part="Roll.Root"
        />
        <ul>
          <li>
            <PartLink
              component="roll"
              part="Roll.Column"
            />
            <ul>
              <li>
                <PartLink
                  component="roll"
                  part="Roll.Item"
                />
              </li>
            </ul>
          </li>
          <li>
            <PartLink
              component="roll"
              part="Roll.Separator"
            />{' '}
            (optional)
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="roll-root"
      level={2}
    >
      <code>Roll.Root</code>
    </Heading>
    <ul>
      <li>The wheel (216px high): its columns side by side, centered.</li>
      <li>The band behind its center marks the selected rows.</li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={rollRootRows} />

    <Heading
      id="roll-column"
      level={2}
    >
      <code>Roll.Column</code>
    </Heading>
    <ul>
      <li>
        Rows on a cylinder, scrolled natively (touch, wheel, momentum) or
        dragged with a mouse, snapping to them; settled, the centered row is
        selected.
      </li>
      <li>
        State: <code>value</code> or <code>defaultValue</code>,{' '}
        <code>onValueChange</code> (with why), <code>onHighlightChange</code>.
      </li>
      <li>
        <code>editable</code> (typed values), <code>loop</code> (endless),{' '}
        <code>align</code>, <code>disabled</code>.
      </li>
      <li>
        Renders a <code>div</code> (its frame) around a <code>div</code> with
        the <code>listbox</code> role: name it (<code>aria-label</code>).
      </li>
    </ul>
    <ColumnPart />
    <h3>Props</h3>
    <PropsTable rows={rollColumnRows} />

    <Heading
      id="roll-item"
      level={2}
    >
      <code>Roll.Item</code>
    </Heading>
    <ul>
      <li>
        A row: its <code>value</code>, shown as text unless given children.
      </li>
      <li>
        Pressed, its column scrolls to it. <code>disabled</code>: shown, but the
        column moves on from it.
      </li>
      <li>
        Renders a <code>div</code> with the <code>option</code> role.
      </li>
    </ul>
    <ItemPart />
    <h3>Props</h3>
    <PropsTable rows={rollItemRows} />

    <Heading
      id="roll-separator"
      level={2}
    >
      <code>Roll.Separator</code>
    </Heading>
    <ul>
      <li>Text between columns, at the band (e.g. a time’s “:”).</li>
      <li>
        Renders a <code>div</code>; hide it from assistive tech (
        <code>aria-hidden</code>) when it only decorates.
      </li>
    </ul>
    <SeparatorPart />
    <h3>Props</h3>
    <PropsTable rows={rollSeparatorRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const rollPartsDemos = [RootPart, ColumnPart, ItemPart, SeparatorPart];
