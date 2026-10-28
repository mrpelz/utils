import { FunctionComponent, useMemo, useState } from 'react';

import { Switch } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { switchRootRows, switchThumbRows } from './docs.js';
import { getPropOptionsRoot, propOptionsThumb } from './props.js';

/** `Switch.Root`, outlined, with its props. */
const RootPart: FunctionComponent = () => {
  const id = 'switch-parts-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [isPending, setIsPending] = useState(false);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog, setIsPending), [addLog]),
    { external, isOpen: true, emphasize: 'outline', title: 'Switch.Root' },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Switch.Root"
    >
      <Switch.Root
        key={elementKey}
        aria-label="Example"
        {...props}
        indeterminate={
          (props.indeterminate as boolean | undefined) ?? isPending
        }
      >
        <Switch.Thumb />
      </Switch.Root>
    </Component>
  );
};

/** `Switch.Thumb`, outlined, with its props. */
const ThumbPart: FunctionComponent = () => {
  const id = 'switch-parts-thumb';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsThumb, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Switch.Thumb',
  });

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      state={[state]}
      title="Switch.Thumb"
    >
      <Switch.Root
        defaultChecked
        aria-label="Example"
      >
        <Switch.Thumb {...props} />
      </Switch.Root>
    </Component>
  );
};

/** `/switch/parts`: the root and its thumb. */
export const SwitchParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>Root: the track, the control people operate.</li>
      <li>Thumb: the knob.</li>
      <li>Both always needed.</li>
    </ul>
    <ul>
      <li>
        <PartLink
          component="switch"
          part="Switch.Root"
        />
        <ul>
          <li>
            <PartLink
              component="switch"
              part="Switch.Thumb"
            />
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="switch-root"
      level={2}
    >
      <code>Switch.Root</code>
    </Heading>
    <ul>
      <li>The control and its track.</li>
      <li>
        State: <code>checked</code> or <code>defaultChecked</code>,{' '}
        <code>onCheckedChange</code>.
      </li>
      <li>
        Can be <code>disabled</code> or <code>readOnly</code>.
      </li>
      <li>
        Submits with a form: <code>name</code>, <code>value</code> (through a
        hidden input it renders).
      </li>
      <li>
        Look: <code>tint</code> (the track while on), <code>onOffLabels</code>,{' '}
        <code>indeterminate</code>, <code>cursor</code>.
      </li>
      <li>
        Renders a <code>span</code> with the <code>switch</code> role: give it
        an accessible name.
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={switchRootRows} />

    <Heading
      id="switch-thumb"
      level={2}
    >
      <code>Switch.Thumb</code>
    </Heading>
    <ul>
      <li>The knob, inside the root.</li>
      <li>Moves with the state, and with the pointer while dragged.</li>
      <li>Pressed: a glass lens.</li>
      <li>
        No props of its own beyond styling (<code>className</code>,{' '}
        <code>style</code>, <code>render</code>).
      </li>
    </ul>
    <ThumbPart />
    <h3>Props</h3>
    <PropsTable rows={switchThumbRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const switchPartsDemos = [RootPart, ThumbPart];
