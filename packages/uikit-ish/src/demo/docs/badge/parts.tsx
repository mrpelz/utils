import './style.css';

import { FunctionComponent, useMemo } from 'react';

import { Badge, Symbol } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { sfBell } from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import { badgeRows } from './docs.js';
import { propOptionsPart } from './props.js';

/** `Badge`, outlined, with its props. */
const BadgePart: FunctionComponent = () => {
  const id = 'badge-parts-badge';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPart, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Badge',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(() => partPropMaps({ Symbol: ['icon'] }), []),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Badge"
    >
      <span className="badge-demo-host">
        <Symbol
          {...partProps.Symbol}
          icon={sfBell}
        >
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
    <ul className="demo-tree">
      <li className="demo-tree-context">
        <PartLink
          component="symbol"
          part="Symbol"
        />
        <span>, an</span>{' '}
        <PartLink
          component="avatar"
          part="Avatar.Root"
        />
        <span>, or a list row’s</span>{' '}
        <PartLink
          component="list"
          part="List.Trailing"
        />
        <ul>
          <li>
            <PartLink
              component="badge"
              part="Badge"
            />
          </li>
        </ul>
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
        Its content is a count or a short text. Without any, it’s a dot (by CSS{' '}
        <code>:empty</code>, so no whitespace inside).
      </li>
      <li>
        Its place comes from <code>placement</code>, never from its parent: on a
        symbol (<code>symbol</code>, as a child of a{' '}
        <a href={publicUrl('symbol')}>Symbol</a>, at its smaller size), on its
        parent’s top end corner (<code>corner</code>, with the parent
        positioned, as an <a href={publicUrl('avatar')}>Avatar</a> is), or in
        the text (<code>inline</code>).
      </li>
      <li>
        Its look: <code>tint</code> and <code>textColor</code>.
      </li>
      <li>
        Renders a <code>span</code> without a role, so its text is read where it
        is (see <a href={publicUrl('badge#accessibility')}>Accessibility</a>).
      </li>
    </ul>
    <BadgePart />
    <h3>Props</h3>
    <PropsTable rows={badgeRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const badgePartsDemos = [BadgePart];
