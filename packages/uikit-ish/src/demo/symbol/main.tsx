import { FunctionComponent } from 'react';

import { Symbol } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { propOptionsContent, propOptionsSymbol } from './props.js';

/**
 * An SF Symbol (from `@bradleyhodges/sfsymbols`), sized as the glyph of
 * the text around it, in its color; optionally with a badge on it.
 */
export const SymbolDemo: FunctionComponent = () => {
  const id = 'symbol';

  const [externalSymbol, externalContent] = useProvidedState(id);

  const [controlSymbol, propsSymbol, stateSymbol] = usePropControl(
    propOptionsSymbol,
    { external: externalSymbol, open: true, title: 'symbol' },
  );
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    { external: externalContent, open: true, title: '[content]' },
  );

  return (
    <Component
      center
      controls={[controlSymbol, controlContent]}
      id={id}
      state={[stateSymbol, stateContent]}
      title="Symbol"
    >
      <span style={{ color: content.color, fontSize: content.fontSize }}>
        <Symbol {...propsSymbol} />
      </span>
    </Component>
  );
};
