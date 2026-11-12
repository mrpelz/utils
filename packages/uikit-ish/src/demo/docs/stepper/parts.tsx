import { FunctionComponent, useMemo } from 'react';

import { Stepper } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { partPropMaps } from '../part-options.js';
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
    { external, isOpen: true, emphasize: 'outline', title: 'Stepper.Root' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Stepper.Decrement': [],
            'Stepper.Group': [],
            'Stepper.Increment': [],
            'Stepper.Input': ['aria-label'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="Stepper.Root"
    >
      <Stepper.Root
        key={elementKey}
        {...props}
      >
        <Stepper.Group {...partProps['Stepper.Group']}>
          <Stepper.Input
            {...partProps['Stepper.Input']}
            aria-label="Quantity"
          />
          <Stepper.Decrement {...partProps['Stepper.Decrement']} />
          <Stepper.Increment {...partProps['Stepper.Increment']} />
        </Stepper.Group>
      </Stepper.Root>
    </Component>
  );
};

/** `Stepper.Group`, outlined, with its props. */
const GroupPart: FunctionComponent = () => {
  const id = 'stepper-parts-group';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGroup, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Stepper.Group',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Stepper.Decrement': [],
          'Stepper.Increment': [],
          'Stepper.Input': ['aria-label'],
          'Stepper.Root': ['defaultValue'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Stepper.Group"
    >
      <Stepper.Root
        {...partProps['Stepper.Root']}
        defaultValue={5}
      >
        <Stepper.Group {...props}>
          <Stepper.Input
            {...partProps['Stepper.Input']}
            aria-label="Quantity"
          />
          <Stepper.Decrement {...partProps['Stepper.Decrement']} />
          <Stepper.Increment {...partProps['Stepper.Increment']} />
        </Stepper.Group>
      </Stepper.Root>
    </Component>
  );
};

/** `Stepper.Input`, outlined (hidden: its outline marks where it is). */
const InputPart: FunctionComponent = () => {
  const id = 'stepper-parts-input';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsInput, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Stepper.Input',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Stepper.Decrement': [],
          'Stepper.Group': [],
          'Stepper.Increment': [],
          'Stepper.Root': ['defaultValue'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Stepper.Input"
    >
      <Stepper.Root
        {...partProps['Stepper.Root']}
        defaultValue={5}
      >
        <Stepper.Group {...partProps['Stepper.Group']}>
          <Stepper.Input {...props} />
          <Stepper.Decrement {...partProps['Stepper.Decrement']} />
          <Stepper.Increment {...partProps['Stepper.Increment']} />
        </Stepper.Group>
      </Stepper.Root>
    </Component>
  );
};

/** `Stepper.Decrement`, outlined, with its props. */
const DecrementPart: FunctionComponent = () => {
  const id = 'stepper-parts-decrement';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsHalf, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Stepper.Decrement',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Stepper.Group': [],
          'Stepper.Increment': [],
          'Stepper.Input': ['aria-label'],
          'Stepper.Root': ['defaultValue'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Stepper.Decrement"
    >
      <Stepper.Root
        {...partProps['Stepper.Root']}
        defaultValue={5}
      >
        <Stepper.Group {...partProps['Stepper.Group']}>
          <Stepper.Input
            {...partProps['Stepper.Input']}
            aria-label="Quantity"
          />
          <Stepper.Decrement {...props} />
          <Stepper.Increment {...partProps['Stepper.Increment']} />
        </Stepper.Group>
      </Stepper.Root>
    </Component>
  );
};

/** `Stepper.Increment`, outlined, with its props. */
const IncrementPart: FunctionComponent = () => {
  const id = 'stepper-parts-increment';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsHalf, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Stepper.Increment',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Stepper.Decrement': [],
          'Stepper.Group': [],
          'Stepper.Input': ['aria-label'],
          'Stepper.Root': ['defaultValue'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Stepper.Increment"
    >
      <Stepper.Root
        {...partProps['Stepper.Root']}
        defaultValue={5}
      >
        <Stepper.Group {...partProps['Stepper.Group']}>
          <Stepper.Input
            {...partProps['Stepper.Input']}
            aria-label="Quantity"
          />
          <Stepper.Decrement {...partProps['Stepper.Decrement']} />
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
      <li>Root: the number field, with its value and range.</li>
      <li>Group: the capsule, which holds the input and the halves.</li>
      <li>Input: the value, visually hidden (no value is shown).</li>
      <li>Decrement and Increment: the halves, “−” and “+”.</li>
      <li>All of them are needed.</li>
    </ul>
    <ul className="demo-tree">
      <li className="demo-tree-context">
        <PartLink
          component="list"
          part="List.Trailing"
        />{' '}
        <span>(optional: at a list row’s end, after a</span>{' '}
        <PartLink
          component="list"
          part="List.Detail"
        />{' '}
        <span>showing the value)</span>
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
        Its state: <code>value</code> or <code>defaultValue</code>,{' '}
        <code>onValueChange</code> (with the reason: a half, a key, the wheel),
        and <code>onValueCommitted</code>.
      </li>
      <li>
        Its range and steps: <code>min</code> and <code>max</code> (a half is
        disabled at its end), <code>step</code> (with <code>smallStep</code> and{' '}
        <code>largeStep</code> for Alt and Shift), and <code>snapOnStep</code>.
      </li>
      <li>
        It can be <code>disabled</code>, <code>readOnly</code> or{' '}
        <code>required</code>, and submits with a form under its{' '}
        <code>name</code>.
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
      <li>The capsule: the two halves, with a separator between them.</li>
      <li>
        With keyboard focus (on its input), it gets a ring. Pressing it shows
        none.
      </li>
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
        The value, in a visually hidden input. It’s what the keyboard focuses
        (the arrow keys step it), and what assistive technology reads, as a spin
        button.
      </li>
      <li>
        Name it (<code>aria-label</code>) after what it counts, because the
        stepper has no visible label of its own.
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
      <li>The leading half: “−”, one step down.</li>
      <li>
        Held, it keeps stepping. It’s disabled at <code>min</code>, or by its
        own <code>disabled</code>.
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
      <li>The trailing half: “+”, one step up.</li>
      <li>
        Held, it keeps stepping. It’s disabled at <code>max</code>, or by its
        own <code>disabled</code>.
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
        These are re-exported as they are, without styles (see{' '}
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
        <code>Stepper.ScrubArea</code> and <code>Stepper.ScrubAreaCursor</code>:
        for dragging across a label to change the value, which this stepper
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
