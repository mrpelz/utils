import { FunctionComponent, useMemo } from 'react';

import { Stepper } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { PropsTable } from '../guide/props-table.js';
import { Heading, PartLink } from '../guide/sections.js';
import {
  stepperGroupRows,
  stepperHalfRows,
  stepperInputRows,
  stepperRootRows,
} from './docs.js';
import {
  getPropOptionsGuideRoot,
  propOptionsGroup,
  propOptionsHalf,
  propOptionsInput,
} from './props.js';

/** `Stepper.Root`, outlined, with its props. */
const RootPart: FunctionComponent = () => {
  const id = 'stepper-parts-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsGuideRoot(addLog), [addLog]),
    'Stepper.Root',
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
      title="Stepper.Root"
    >
      <Stepper.Root
        key={elementKey}
        {...props}
      >
        <Stepper.Group>
          <Stepper.Input aria-label="Quantity" />
          <Stepper.Decrement />
          <Stepper.Increment />
        </Stepper.Group>
      </Stepper.Root>
    </Component>
  );
};

/** `Stepper.Group`, outlined, with its props. */
const GroupPart: FunctionComponent = () => {
  const id = 'stepper-parts-group';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsGroup,
    'Stepper.Group',
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
      title="Stepper.Group"
    >
      <Stepper.Root defaultValue={5}>
        <Stepper.Group {...props}>
          <Stepper.Input aria-label="Quantity" />
          <Stepper.Decrement />
          <Stepper.Increment />
        </Stepper.Group>
      </Stepper.Root>
    </Component>
  );
};

/** `Stepper.Input`, outlined (hidden: its outline marks where it is). */
const InputPart: FunctionComponent = () => {
  const id = 'stepper-parts-input';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsInput,
    'Stepper.Input',
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
      title="Stepper.Input"
    >
      <Stepper.Root defaultValue={5}>
        <Stepper.Group>
          <Stepper.Input {...props} />
          <Stepper.Decrement />
          <Stepper.Increment />
        </Stepper.Group>
      </Stepper.Root>
    </Component>
  );
};

/** `Stepper.Decrement`, outlined, with its props. */
const DecrementPart: FunctionComponent = () => {
  const id = 'stepper-parts-decrement';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsHalf,
    'Stepper.Decrement',
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
      title="Stepper.Decrement"
    >
      <Stepper.Root defaultValue={5}>
        <Stepper.Group>
          <Stepper.Input aria-label="Quantity" />
          <Stepper.Decrement {...props} />
          <Stepper.Increment />
        </Stepper.Group>
      </Stepper.Root>
    </Component>
  );
};

/** `Stepper.Increment`, outlined, with its props. */
const IncrementPart: FunctionComponent = () => {
  const id = 'stepper-parts-increment';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsHalf,
    'Stepper.Increment',
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
      title="Stepper.Increment"
    >
      <Stepper.Root defaultValue={5}>
        <Stepper.Group>
          <Stepper.Input aria-label="Quantity" />
          <Stepper.Decrement />
          <Stepper.Increment {...props} />
        </Stepper.Group>
      </Stepper.Root>
    </Component>
  );
};

/** `/stepper/parts`: the field, its capsule, its input and halves. */
export const StepperParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>Root: the number field, its value and range.</li>
      <li>Group: the capsule, holding the input and the halves.</li>
      <li>Input: the value, visually hidden (UIKit shows none).</li>
      <li>Decrement, Increment: the halves, “−” and “+”.</li>
      <li>All needed.</li>
    </ul>
    <ul>
      <li>
        <PartLink
          component="stepper"
          part="Stepper.Root"
        />
        <ul>
          <li>
            <PartLink
              component="stepper"
              part="Stepper.Group"
            />
            <ul>
              <li>
                <PartLink
                  component="stepper"
                  part="Stepper.Input"
                />
              </li>
              <li>
                <PartLink
                  component="stepper"
                  part="Stepper.Decrement"
                />
              </li>
              <li>
                <PartLink
                  component="stepper"
                  part="Stepper.Increment"
                />
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="stepper-root"
      level={2}
    >
      <code>Stepper.Root</code>
    </Heading>
    <ul>
      <li>The field (Base UI’s number field), around the capsule.</li>
      <li>
        State: <code>value</code> or <code>defaultValue</code>,{' '}
        <code>onValueChange</code> (with why: a half, a key, the wheel),{' '}
        <code>onValueCommitted</code>.
      </li>
      <li>
        Range and steps: <code>min</code>, <code>max</code> (a half disables at
        its end), <code>step</code> (<code>smallStep</code>,{' '}
        <code>largeStep</code> with alt and shift), <code>snapOnStep</code>.
      </li>
      <li>
        Can be <code>disabled</code>, <code>readOnly</code> or{' '}
        <code>required</code>; submits with a form by its <code>name</code>.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={stepperRootRows} />

    <Heading
      id="stepper-group"
      level={2}
    >
      <code>Stepper.Group</code>
    </Heading>
    <ul>
      <li>The capsule: the two halves, a separator between them.</li>
      <li>Focused by keyboard (its input), a ring around it; pressed, none.</li>
      <li>
        Renders a <code>div</code> with the <code>group</code> role.
      </li>
    </ul>
    <GroupPart />
    <h3>Props</h3>
    <PropsTable rows={stepperGroupRows} />

    <Heading
      id="stepper-input"
      level={2}
    >
      <code>Stepper.Input</code>
    </Heading>
    <ul>
      <li>
        The value, in a visually hidden input: what the keyboard focuses (arrow
        keys step) and assistive tech reads, a spin button.
      </li>
      <li>
        Name it (<code>aria-label</code>) by what it counts: the stepper has no
        visible label of its own.
      </li>
      <li>
        Renders an <code>input</code>.
      </li>
    </ul>
    <InputPart />
    <h3>Props</h3>
    <PropsTable rows={stepperInputRows} />

    <Heading
      id="stepper-decrement"
      level={2}
    >
      <code>Stepper.Decrement</code>
    </Heading>
    <ul>
      <li>The leading half: “−”, a step down.</li>
      <li>
        Held, it repeats. Disabled at <code>min</code>, or by its own{' '}
        <code>disabled</code>.
      </li>
      <li>
        Renders a <code>button</code>.
      </li>
    </ul>
    <DecrementPart />
    <h3>Props</h3>
    <PropsTable rows={stepperHalfRows('−')} />

    <Heading
      id="stepper-increment"
      level={2}
    >
      <code>Stepper.Increment</code>
    </Heading>
    <ul>
      <li>The trailing half: “+”, a step up.</li>
      <li>
        Held, it repeats. Disabled at <code>max</code>, or by its own{' '}
        <code>disabled</code>.
      </li>
      <li>
        Renders a <code>button</code>.
      </li>
    </ul>
    <IncrementPart />
    <h3>Props</h3>
    <PropsTable rows={stepperHalfRows('+')} />

    <Heading
      id="base-ui-s-other-parts"
      level={2}
    >
      Base UI’s other parts
    </Heading>
    <ul>
      <li>
        Re-exported as they are (unstyled; see{' '}
        <a
          href="https://base-ui.com/react/components/number-field"
          rel="noreferrer"
          target="_blank"
        >
          Base UI’s Number Field
        </a>
        ):
      </li>
      <li>
        <code>Stepper.ScrubArea</code>, <code>Stepper.ScrubAreaCursor</code>:
        dragging across a label to change the value, which UIKit’s stepper
        doesn’t do.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const stepperPartsDemos = [
  RootPart,
  GroupPart,
  InputPart,
  DecrementPart,
  IncrementPart,
];
