import { FunctionComponent, useMemo, useState } from 'react';

import { Switch } from '../../../components/index.js';
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Switch.Thumb': [],
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
        <Switch.Thumb {...partProps['Switch.Thumb']} />
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Switch.Root': ['aria-label', 'defaultChecked'],
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
      state={[state, partState]}
      title="Switch.Thumb"
    >
      <Switch.Root
        {...partProps['Switch.Root']}
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
      <li>Both are always needed.</li>
    </ul>
    <ul className="demo-tree">
      <li className="demo-tree-context">
        <PartLink
          component="list"
          part="List.Trailing"
        />{' '}
        <span>
          (optional: at a list row’s end, the row passing its clicks on with
        </span>{' '}
        <PartLink
          component="list"
          part="forwardClick"
        />
        <span>)</span>
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
      </li>
    </ul>

    <Heading
      id="switch-root"
      level={2}
    >
      <code>Switch.Root</code>
    </Heading>
    <ul>
      <li>The control, and its track.</li>
      <li>
        Its state: <code>checked</code> or <code>defaultChecked</code>, and{' '}
        <code>onCheckedChange</code>.
      </li>
      <li>
        It can be <code>disabled</code> or <code>readOnly</code>.
      </li>
      <li>
        It submits with a form, through a hidden input it renders:{' '}
        <code>name</code>, <code>value</code>.
      </li>
      <li>
        Its look: <code>tint</code> (the track while on),{' '}
        <code>onOffLabels</code>, <code>indeterminate</code> and{' '}
        <code>cursor</code>.
      </li>
      <li>
        Renders a <code>span</code> with the <code>switch</code> role. Give it
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
      <li>It moves with the state, and with the pointer while dragged.</li>
      <li>While pressed, it’s a glass lens.</li>
      <li>
        It has no props of its own beyond styling (<code>className</code>,{' '}
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
