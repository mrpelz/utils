import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { FunctionComponent, useMemo } from 'react';

import {
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Symbol,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { sfHeartFill } from '../../tooling/icons.js';
import { partPropMaps } from '../part-options.js';
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
    { external, isOpen: true, emphasize: 'outline', title: 'Checkbox.Root' },
  );

  return (
    <Component
      isCentered
      isInline
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
    {
      external,
      isOpen: true,
      emphasize: 'outline',
      title: 'Checkbox.Indicator',
    },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'Checkbox.Root': ['aria-label', 'defaultChecked'],
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
      log={log}
      state={[state, partState]}
      title="Checkbox.Indicator"
    >
      <Checkbox.Root
        key={elementKey}
        {...partProps['Checkbox.Root']}
        defaultChecked
        aria-label="Favorite"
      >
        <Checkbox.Indicator {...props}>
          <Symbol
            {...partProps.Symbol}
            icon={sfHeartFill}
          />
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
    isOpen: true,
    emphasize: 'outline',
    title: 'Radio.Root',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          RadioGroup: [
            'aria-label',
            'className',
            'defaultValue',
            'onValueChange',
          ],
          'Radio.Root (others)': ['value'],
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
      log={log}
      state={[state, partState]}
      title="Radio.Root"
    >
      <RadioGroup
        key={elementKey}
        {...partProps.RadioGroup}
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
              {...(index === 0 ? props : partProps['Radio.Root (others)'])}
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
    { external, isOpen: true, emphasize: 'outline', title: 'Radio.Indicator' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            RadioGroup: [
              'aria-label',
              'className',
              'defaultValue',
              'onValueChange',
            ],
            Symbol: ['icon'],
            'Radio.Root': ['value'],
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
      title="Radio.Indicator"
    >
      <RadioGroup
        key={elementKey}
        {...partProps.RadioGroup}
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
            <Radio.Root
              {...partProps['Radio.Root']}
              value={value}
            >
              <Radio.Indicator {...props}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfHeartFill}
                />
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
    { external, isOpen: true, emphasize: 'outline', title: 'CheckboxGroup' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Checkbox.Root': ['parent', 'value'],
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
      title="CheckboxGroup"
    >
      <CheckboxGroup
        key={elementKey}
        aria-label="Notify by"
        {...props}
      >
        <div className="checkbox-demo-group">
          <label className="checkbox-demo-option">
            <Checkbox.Root
              {...partProps['Checkbox.Root']}
              parent
            />
            All
          </label>
          {contacts.map(([value, label]) => (
            <label
              key={value}
              className="checkbox-demo-option"
            >
              <Checkbox.Root
                {...partProps['Checkbox.Root']}
                value={value}
              />
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
    { external, isOpen: true, emphasize: 'outline', title: 'RadioGroup' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Radio.Root': ['value'],
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
              <Radio.Root
                {...partProps['Radio.Root']}
                value={value}
              />
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
        , which shows its indicator (a checkmark, or a dash while mixed) while
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
        , with a parent checkbox for all of them.
      </li>
    </ul>
    <ul className="demo-tree">
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
        Whether it’s ticked: <code>checked</code> or <code>defaultChecked</code>
        , and <code>onCheckedChange</code>.
      </li>
      <li>
        Mixed: <code>indeterminate</code> (a dash).
      </li>
      <li>
        It can be <code>disabled</code> or <code>readOnly</code>.
      </li>
      <li>
        It submits with a form, through a hidden input: <code>name</code>,{' '}
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
      <li>By default (without children), the checkmark and the dash.</li>
      <li>With children, it shows its own content instead (here, a heart).</li>
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
      <li>It’s chosen while the group’s value is its own.</li>
      <li>
        It can be <code>disabled</code> or <code>readOnly</code>.
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
      <li>What the radio shows while it’s chosen.</li>
      <li>By default, the checkmark. With children, its own content.</li>
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
      <li>Base UI’s, as it is.</li>
      <li>
        Checkboxes that share one value: the names (<code>value</code>s) of
        those that are ticked.
      </li>
      <li>
        With <code>allValues</code>, a <code>parent</code> checkbox ticks or
        unticks all of them, and is mixed while only some are ticked.
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
      <li>Base UI’s, as it is.</li>
      <li>Radios that share one value: the chosen radio’s.</li>
      <li>
        It submits with a form under its <code>name</code>.
      </li>
      <li>
        Renders a <code>div</code>, or another element through{' '}
        <code>render</code> (for example a list’s group).
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
