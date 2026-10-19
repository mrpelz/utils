import { FunctionComponent, useMemo, useState } from 'react';

import { Switch } from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { PropsTable } from '../utils/props-table.js';
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
    <p className="demo-lead">
      A switch is a root (the track, and the control people operate) holding its
      thumb (the knob). Both are always needed.
    </p>
    <ul>
      <li>
        <code>Switch.Root</code>
        <ul>
          <li>
            <code>Switch.Thumb</code>
          </li>
        </ul>
      </li>
    </ul>

    <h2>
      <code>Switch.Root</code>
    </h2>
    <p>
      The control and its track: it holds the state (<code>checked</code> or{' '}
      <code>defaultChecked</code>, <code>onCheckedChange</code>), can be{' '}
      <code>disabled</code> or <code>readOnly</code>, and submits with a form (
      <code>name</code>, <code>value</code>, through a hidden input it renders).
      Its look: <code>tint</code> (the track while on), <code>onOffLabels</code>
      , <code>indeterminate</code> and the <code>cursor</code>. It renders a{' '}
      <code>span</code> with the <code>switch</code> role, so give it an
      accessible name.
    </p>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={switchRootRows} />

    <h2>
      <code>Switch.Thumb</code>
    </h2>
    <p>
      The knob, inside the root: it moves with the state and the pointer while
      dragged, and turns into a glass lens while pressed. It takes no props of
      its own beyond styling (<code>className</code>, <code>style</code>,{' '}
      <code>render</code>).
    </p>
    <ThumbPart />
    <h3>Props</h3>
    <PropsTable rows={switchThumbRows} />
  </>
);
