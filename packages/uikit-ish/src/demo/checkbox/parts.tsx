import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { sfHeartFill } from '@bradleyhodges/sfsymbols/sfHeartFill';
import { FunctionComponent, useMemo } from 'react';

import {
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Symbol,
} from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { PropsTable } from '../guide/props-table.js';
import { Heading, PartLink } from '../guide/sections.js';
import {
  checkboxGroupRows,
  checkboxIndicatorRows,
  checkboxRootRows,
  radioGroupRows,
  radioIndicatorRows,
  radioRootRows,
} from './docs.js';
import {
  getPropOptionsCheckbox,
  getPropOptionsCheckboxGroup,
  getPropOptionsRadioGroup,
  propOptionsIndicator,
  propOptionsRadio,
} from './props.js';

// Every view writes out its circles, the part's props on it (on the first
// radio, its indicator, or the group), so its code shows as it'd be used.

// Ways to be contacted: value, label.
const contacts = [
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['mail', 'Mail'],
] as const;

/** `Checkbox.Root`, outlined, with its props. */
const CheckboxRootPart: FunctionComponent = () => {
  const id = 'checkbox-parts-checkbox-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsCheckbox(addLog), [addLog]),
    { external, open: true, outlined: true, title: 'Checkbox.Root' },
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Checkbox.Root"
    >
      <Checkbox.Root
        key={elementKey}
        aria-label="Selected"
        {...props}
      />
    </Component>
  );
};

/** `Checkbox.Indicator` (a heart, instead of the checkmark), outlined. */
const CheckboxIndicatorPart: FunctionComponent = () => {
  const id = 'checkbox-parts-checkbox-indicator';
  const [log] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    propOptionsIndicator,
    { external, open: true, outlined: true, title: 'Checkbox.Indicator' },
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Checkbox.Indicator"
    >
      <Checkbox.Root
        key={elementKey}
        defaultChecked
        aria-label="Favorite"
      >
        <Checkbox.Indicator {...props}>
          <Symbol icon={sfHeartFill} />
        </Checkbox.Indicator>
      </Checkbox.Root>
    </Component>
  );
};

/** `Radio.Root` (Email's), outlined, with its props. */
const RadioRootPart: FunctionComponent = () => {
  const id = 'checkbox-parts-radio-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(propOptionsRadio, {
    external,
    open: true,
    outlined: true,
    title: 'Radio.Root',
  });

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Radio.Root"
    >
      <RadioGroup
        key={elementKey}
        aria-label="Contact by"
        className="checkbox-demo-group"
        defaultValue="email"
        onValueChange={(
          value: unknown,
          { reason }: BaseRadioGroup.ChangeEventDetails,
        ) => addLog(`value change: ${String(value)}/${reason}`)}
      >
        {contacts.map(([value, label], index) => (
          <label
            key={value}
            className="checkbox-demo-option"
          >
            <Radio.Root
              value={value}
              {...(index === 0 ? props : {})}
            />
            {label}
          </label>
        ))}
      </RadioGroup>
    </Component>
  );
};

/** `Radio.Indicator` (a heart, instead of the checkmark), outlined. */
const RadioIndicatorPart: FunctionComponent = () => {
  const id = 'checkbox-parts-radio-indicator';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    propOptionsIndicator,
    { external, open: true, outlined: true, title: 'Radio.Indicator' },
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Radio.Indicator"
    >
      <RadioGroup
        key={elementKey}
        aria-label="Contact by"
        className="checkbox-demo-group"
        defaultValue="email"
        onValueChange={(
          value: unknown,
          { reason }: BaseRadioGroup.ChangeEventDetails,
        ) => addLog(`value change: ${String(value)}/${reason}`)}
      >
        {contacts.map(([value, label]) => (
          <label
            key={value}
            className="checkbox-demo-option"
          >
            <Radio.Root value={value}>
              <Radio.Indicator {...props}>
                <Symbol icon={sfHeartFill} />
              </Radio.Indicator>
            </Radio.Root>
            {label}
          </label>
        ))}
      </RadioGroup>
    </Component>
  );
};

/** `CheckboxGroup`, outlined, with a parent checkbox. */
const CheckboxGroupPart: FunctionComponent = () => {
  const id = 'checkbox-parts-checkbox-group';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsCheckboxGroup(addLog), [addLog]),
    { external, open: true, outlined: true, title: 'CheckboxGroup' },
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="CheckboxGroup"
    >
      <CheckboxGroup
        key={elementKey}
        aria-label="Notify by"
        {...props}
      >
        <div className="checkbox-demo-group">
          <label className="checkbox-demo-option">
            <Checkbox.Root parent />
            All
          </label>
          {contacts.map(([value, label]) => (
            <label
              key={value}
              className="checkbox-demo-option"
            >
              <Checkbox.Root value={value} />
              {label}
            </label>
          ))}
        </div>
      </CheckboxGroup>
    </Component>
  );
};

/** `RadioGroup`, outlined, with its props. */
const RadioGroupPart: FunctionComponent = () => {
  const id = 'checkbox-parts-radio-group';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsRadioGroup(addLog), [addLog]),
    { external, open: true, outlined: true, title: 'RadioGroup' },
  );

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="RadioGroup"
    >
      <RadioGroup
        key={elementKey}
        aria-label="Contact by"
        {...props}
      >
        <div className="checkbox-demo-group">
          {contacts.map(([value, label]) => (
            <label
              key={value}
              className="checkbox-demo-option"
            >
              <Radio.Root value={value} />
              {label}
            </label>
          ))}
        </div>
      </RadioGroup>
    </Component>
  );
};

/** `/checkbox/parts`: checkboxes, radios, their indicators and groups. */
export const CheckboxParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        A{' '}
        <PartLink
          component="checkbox"
          part="Checkbox.Root"
        />{' '}
        or a{' '}
        <PartLink
          component="checkbox"
          part="Radio.Root"
        />
        , showing its indicator (a checkmark, or a dash while mixed) while
        ticked.
      </li>
      <li>
        Radios share a value in a{' '}
        <PartLink
          component="checkbox"
          part="RadioGroup"
        />
        .
      </li>
      <li>
        Checkboxes can share one in a{' '}
        <PartLink
          component="checkbox"
          part="CheckboxGroup"
        />
        , with a parent checkbox for all.
      </li>
    </ul>
    <ul>
      <li>
        <PartLink
          component="checkbox"
          part="Checkbox.Root"
        />
        <ul>
          <li>
            <PartLink
              component="checkbox"
              part="Checkbox.Indicator"
            />{' '}
            (by default: a checkmark and a dash)
          </li>
        </ul>
      </li>
      <li>
        <PartLink
          component="checkbox"
          part="RadioGroup"
        />
        <ul>
          <li>
            <PartLink
              component="checkbox"
              part="Radio.Root"
            />{' '}
            (two or more)
            <ul>
              <li>
                <PartLink
                  component="checkbox"
                  part="Radio.Indicator"
                />{' '}
                (by default: a checkmark)
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        <PartLink
          component="checkbox"
          part="CheckboxGroup"
        />{' '}
        (optional)
        <ul>
          <li>
            <PartLink
              component="checkbox"
              part="Checkbox.Root"
            />{' '}
            (a <code>parent</code>, and children)
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="checkbox-root"
      level={2}
    >
      <code>Checkbox.Root</code>
    </Heading>
    <ul>
      <li>Base UI’s checkbox, as a selection circle.</li>
      <li>
        Ticked or not: <code>checked</code> or <code>defaultChecked</code>,{' '}
        <code>onCheckedChange</code>.
      </li>
      <li>
        Mixed: <code>indeterminate</code> (a dash).
      </li>
      <li>
        Can be <code>disabled</code> or <code>readOnly</code>.
      </li>
      <li>
        Submits with a form through a hidden input: <code>name</code>,{' '}
        <code>value</code>.
      </li>
      <li>
        Renders a <code>span</code>.
      </li>
    </ul>
    <CheckboxRootPart />
    <h3>Props</h3>
    <PropsTable rows={checkboxRootRows} />

    <Heading
      id="checkbox-indicator"
      level={2}
    >
      <code>Checkbox.Indicator</code>
    </Heading>
    <ul>
      <li>What the circle shows while ticked or mixed.</li>
      <li>Default (no children): the checkmark and the dash.</li>
      <li>As the root’s child: its own content instead (here, a heart).</li>
    </ul>
    <CheckboxIndicatorPart />
    <h3>Props</h3>
    <PropsTable rows={checkboxIndicatorRows} />

    <Heading
      id="radio-root"
      level={2}
    >
      <code>Radio.Root</code>
    </Heading>
    <ul>
      <li>
        Base UI’s radio, as a selection circle, by its <code>value</code>, in a{' '}
        <PartLink
          component="checkbox"
          part="RadioGroup"
        />
        .
      </li>
      <li>Chosen while the group’s value is its own.</li>
      <li>
        Can be <code>disabled</code> or <code>readOnly</code>.
      </li>
    </ul>
    <RadioRootPart />
    <h3>Props</h3>
    <PropsTable rows={radioRootRows} />

    <Heading
      id="radio-indicator"
      level={2}
    >
      <code>Radio.Indicator</code>
    </Heading>
    <ul>
      <li>What the radio shows while chosen.</li>
      <li>Default: the checkmark. As the root’s child: its own content.</li>
    </ul>
    <RadioIndicatorPart />
    <h3>Props</h3>
    <PropsTable rows={radioIndicatorRows} />

    <Heading
      id="checkboxgroup"
      level={2}
    >
      <code>CheckboxGroup</code>
    </Heading>
    <ul>
      <li>Base UI’s, as is.</li>
      <li>
        Checkboxes sharing one value: the names (<code>value</code>s) of those
        ticked.
      </li>
      <li>
        With <code>allValues</code>: a <code>parent</code> checkbox ticks or
        unticks all, mixed while only some are ticked.
      </li>
    </ul>
    <CheckboxGroupPart />
    <h3>Props</h3>
    <PropsTable rows={checkboxGroupRows} />

    <Heading
      id="radiogroup"
      level={2}
    >
      <code>RadioGroup</code>
    </Heading>
    <ul>
      <li>Base UI’s, as is.</li>
      <li>Radios sharing one value: the chosen radio’s.</li>
      <li>
        Submits with a form by its <code>name</code>.
      </li>
      <li>
        Renders a <code>div</code> (or, by <code>render</code>, e.g. a list’s
        group).
      </li>
    </ul>
    <RadioGroupPart />
    <h3>Props</h3>
    <PropsTable rows={radioGroupRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const checkboxPartsDemos = [
  CheckboxRootPart,
  CheckboxIndicatorPart,
  RadioRootPart,
  RadioIndicatorPart,
  CheckboxGroupPart,
  RadioGroupPart,
];
