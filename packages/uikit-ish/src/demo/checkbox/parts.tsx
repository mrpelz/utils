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
import { useLog } from '../utils/log.js';
import { Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { PropsTable } from '../utils/props-table.js';
import { PartLink } from '../utils/sections.js';
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

const contactValues = contacts.map(([value]) => value);

/** `Checkbox.Root`, outlined, with its props. */
const CheckboxRootPart: FunctionComponent = () => {
  const id = 'checkbox-parts-checkbox-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsCheckbox(addLog), [addLog]),
    'Checkbox.Root',
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
    'Checkbox.Indicator',
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
  const [control, props, state, elementKey] = usePropControl(
    propOptionsRadio,
    'Radio.Root',
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
    'Radio.Indicator',
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
    'CheckboxGroup',
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
      title="CheckboxGroup"
    >
      <CheckboxGroup
        key={elementKey}
        allValues={contactValues}
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
    'RadioGroup',
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
        A <code>Checkbox.Root</code> or a <code>Radio.Root</code>, showing its
        indicator (a checkmark, or a dash while mixed) while ticked.
      </li>
      <li>
        Radios share a value in a <code>RadioGroup</code>.
      </li>
      <li>
        Checkboxes can share one in a <code>CheckboxGroup</code>, with a parent
        checkbox for all.
      </li>
    </ul>
    <ul>
      <li>
        <PartLink part="Checkbox.Root" />
        <ul>
          <li>
            <PartLink part="Checkbox.Indicator" /> (by default: a checkmark and
            a dash)
          </li>
        </ul>
      </li>
      <li>
        <PartLink part="RadioGroup" />
        <ul>
          <li>
            <PartLink part="Radio.Root" /> (two or more)
            <ul>
              <li>
                <PartLink part="Radio.Indicator" /> (by default: a checkmark)
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        <PartLink part="CheckboxGroup" /> (optional)
        <ul>
          <li>
            <PartLink part="Checkbox.Root" /> (a <code>parent</code>, and
            children)
          </li>
        </ul>
      </li>
    </ul>

    <h2 id="checkbox-root">
      <code>Checkbox.Root</code>
    </h2>
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

    <h2 id="checkbox-indicator">
      <code>Checkbox.Indicator</code>
    </h2>
    <ul>
      <li>What the circle shows while ticked or mixed.</li>
      <li>Default (no children): the checkmark and the dash.</li>
      <li>As the root’s child: its own content instead (here, a heart).</li>
    </ul>
    <CheckboxIndicatorPart />
    <h3>Props</h3>
    <PropsTable rows={checkboxIndicatorRows} />

    <h2 id="radio-root">
      <code>Radio.Root</code>
    </h2>
    <ul>
      <li>
        Base UI’s radio, as a selection circle, by its <code>value</code>, in a{' '}
        <code>RadioGroup</code>.
      </li>
      <li>Chosen while the group’s value is its own.</li>
      <li>
        Can be <code>disabled</code> or <code>readOnly</code>.
      </li>
    </ul>
    <RadioRootPart />
    <h3>Props</h3>
    <PropsTable rows={radioRootRows} />

    <h2 id="radio-indicator">
      <code>Radio.Indicator</code>
    </h2>
    <ul>
      <li>What the radio shows while chosen.</li>
      <li>Default: the checkmark. As the root’s child: its own content.</li>
    </ul>
    <RadioIndicatorPart />
    <h3>Props</h3>
    <PropsTable rows={radioIndicatorRows} />

    <h2 id="checkboxgroup">
      <code>CheckboxGroup</code>
    </h2>
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

    <h2 id="radiogroup">
      <code>RadioGroup</code>
    </h2>
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
