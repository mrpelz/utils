import './style.css';

import { sfBell } from '@bradleyhodges/sfsymbols/sfBell';
import { FunctionComponent } from 'react';

import { Badge, Symbol } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { PropsTable } from '../guide/props-table.js';
import { Heading, PartLink } from '../guide/sections.js';
import { badgeRows } from './docs.js';
import { propOptionsPart } from './props.js';

/** `Badge`, outlined, with its props. */
const BadgePart: FunctionComponent = () => {
  const id = 'badge-parts-badge';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsPart,
    'Badge',
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
      state={[state]}
      title="Badge"
    >
      <span className="badge-demo-host">
        <Symbol icon={sfBell}>
          <Badge {...props} />
        </Symbol>
      </span>
    </Component>
  );
};

/** `/badge/parts`: the badge, one element. */
export const BadgeParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>One element, placed on what it’s in (its parent).</li>
    </ul>
    <ul>
      <li>
        <PartLink
          component="badge"
          part="Badge"
        />
      </li>
    </ul>

    <Heading
      id="badge"
      level={2}
    >
      <code>Badge</code>
    </Heading>
    <ul>
      <li>
        Its content a count or a short text; without any, a dot (by CSS{' '}
        <code>:empty</code>: no whitespace in it).
      </li>
      <li>
        Where: <code>placement</code>, never from its parent. On a symbol (
        <code>symbol</code>: a child of a <a href="symbol">Symbol</a>, its
        smaller size), on its parent’s top end corner (<code>corner</code>: the
        parent positioned, as an <a href="avatar">Avatar</a> is), or in the text
        (<code>inline</code>).
      </li>
      <li>
        Look: <code>tint</code>, <code>textColor</code>.
      </li>
      <li>
        Renders a <code>span</code>, without a role: its text read where it is
        (see <a href="badge#accessibility">Accessibility</a>).
      </li>
    </ul>
    <BadgePart />
    <h3>Props</h3>
    <PropsTable rows={badgeRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const badgePartsDemos = [BadgePart];
