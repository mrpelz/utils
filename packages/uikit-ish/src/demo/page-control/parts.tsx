import { FunctionComponent, useMemo } from 'react';

import { PageControl } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { PropsTable } from '../guide/props-table.js';
import { Heading, PartLink } from '../guide/sections.js';
import { pageControlRows } from './docs.js';
import { getPropOptionsRoot } from './props.js';

/** `PageControl`, outlined, with its props. */
const PageControlPart: FunctionComponent = () => {
  const id = 'page-control-parts-page-control';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    'PageControl',
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
      state={[state]}
      title="PageControl"
    >
      <PageControl
        key={elementKey}
        {...props}
      />
    </Component>
  );
};

/** `/page-control/parts`: the page control, one element. */
export const PageControlParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>One element: its dots (and its glass, its tooltip) are its own.</li>
    </ul>
    <ul>
      <li>
        <PartLink
          component="page-control"
          part="PageControl"
        />
      </li>
    </ul>

    <Heading
      id="pagecontrol"
      level={2}
    >
      <code>PageControl</code>
    </Heading>
    <ul>
      <li>
        A dot per page (<code>count</code>), the current one highlighted.
      </li>
      <li>
        State: <code>value</code> or <code>defaultValue</code>,{' '}
        <code>onValueChange</code> (with why: a press, a drag, a key).
      </li>
      <li>
        Can be <code>disabled</code>.
      </li>
      <li>
        Look: <code>variant</code> (glass or plain), <code>context</code> (the
        glass’ brightness), <code>momentaryTooltip</code> and{' '}
        <code>format</code> (“3 of 8”).
      </li>
      <li>
        Of more than 7 pages, 8 dots show at a time, the outermost shrinking
        towards the pages beyond.
      </li>
      <li>
        Renders a <code>div</code> with the <code>slider</code> role, named
        “Page” (<code>aria-label</code>).
      </li>
    </ul>
    <PageControlPart />
    <h3>Props</h3>
    <PropsTable rows={pageControlRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const pageControlPartsDemos = [PageControlPart];
