import './style.css';

import { FunctionComponent } from 'react';

import { Symbol } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { PropsTable } from '../guide/props-table.js';
import { Heading, PartLink } from '../guide/sections.js';
import { symbolRows } from './docs.js';
import { propOptionsSymbol } from './props.js';

/** `Symbol`, outlined, with its props. */
const SymbolPart: FunctionComponent = () => {
  const id = 'symbol-parts-symbol';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsSymbol,
    'Symbol',
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
      title="Symbol"
    >
      <span className="symbol-demo-large">
        <Symbol {...props} />
      </span>
    </Component>
  );
};

/** `/symbol/parts`: the symbol, one element. */
export const SymbolParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>One element: its glyph, and what sits on it.</li>
    </ul>
    <ul>
      <li>
        <PartLink
          component="symbol"
          part="Symbol"
        />
      </li>
    </ul>

    <Heading
      id="symbol"
      level={2}
    >
      <code>Symbol</code>
    </Heading>
    <ul>
      <li>
        Its glyph: <code>icon</code>, sized and colored by its text (font size,
        color), weighted by its text style.
      </li>
      <li>
        Its children sit on it (positioned on the glyph’s box), e.g. a{' '}
        <a href="badge">Badge</a>.
      </li>
      <li>
        Renders a <code>span</code>, its glyph an SVG hidden from assistive
        technology.
      </li>
    </ul>
    <SymbolPart />
    <h3>Props</h3>
    <PropsTable rows={symbolRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const symbolPartsDemos = [SymbolPart];
