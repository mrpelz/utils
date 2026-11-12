import { FunctionComponent, useMemo } from 'react';

import { PageControl } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { pageControlRows } from './docs.js';
import { getPropOptionsRoot } from './props.js';

/** `PageControl`, outlined, with its props. */
const PageControlPart: FunctionComponent = () => {
  const id = 'page-control-parts-page-control';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external, isOpen: true, emphasize: 'outline', title: 'PageControl' },
  );

  return (
    <Component
      isCentered
      isInline
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
      <li>One element. Its dots, its glass and its tooltip are its own.</li>
    </ul>
    <ul className="demo-tree">
      <li className="demo-tree-context">
        <PartLink
          component="toolbar"
          part="Toolbar.Root"
        />{' '}
        <span>(between its sides), or over the pages it belongs to</span>
        <ul>
          <li>
            <PartLink
              component="page-control"
              part="PageControl"
            />
          </li>
        </ul>
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
        One dot per page (<code>count</code>), with the current one highlighted.
      </li>
      <li>
        Its state: <code>value</code> or <code>defaultValue</code>, and{' '}
        <code>onValueChange</code> (with the reason: a press, a drag or a key).
      </li>
      <li>
        It can be <code>disabled</code>.
      </li>
      <li>
        Its look: <code>variant</code> (glass or plain), <code>context</code>{' '}
        (how bright it is behind the glass), <code>momentaryTooltip</code> and{' '}
        <code>format</code> (“3 of 8”).
      </li>
      <li>
        With more than 7 pages, 8 dots show at a time, and the outer ones shrink
        toward the pages beyond.
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
