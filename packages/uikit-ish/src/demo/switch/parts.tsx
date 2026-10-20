import { FunctionComponent, useMemo, useState } from 'react';

import { Switch } from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { PropsTable } from '../utils/props-table.js';
import { PartLink } from '../utils/sections.js';
import { switchRootRows, switchThumbRows } from './docs.js';
import { getPropOptionsRoot, propOptionsThumb } from './props.js';

/** `Switch.Root`, outlined, with its props. */
const RootPart: FunctionComponent = () => {
  const id = 'switch-parts-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [pending, setPending] = useState(false);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog, setPending), [addLog]),
    'Switch.Root',
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
      title="Switch.Root"
    >
      <Switch.Root
        key={elementKey}
        aria-label="Example"
        {...props}
        indeterminate={(props.indeterminate as boolean | undefined) ?? pending}
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
  const [control, props, state] = usePropControl(
    propOptionsThumb,
    'Switch.Thumb',
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
      stateUrl={useCreateStateUrl(id, [state])}
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
        <PartLink part="Switch.Root" />
        <ul>
          <li>
            <PartLink part="Switch.Thumb" />
          </li>
        </ul>
      </li>
    </ul>

    <h2 id="switch-root">
      <code>Switch.Root</code>
    </h2>
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

    <h2 id="switch-thumb">
      <code>Switch.Thumb</code>
    </h2>
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
