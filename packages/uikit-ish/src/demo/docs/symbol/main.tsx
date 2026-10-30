import { FunctionComponent } from 'react';

import { Symbol } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { propOptionsContent, propOptionsSymbol } from './props.js';

/**
 * An icon (an SF Symbol: not the library's, loaded from unpkg, see
 * tooling/icons.ts), sized as the glyph of the text around it, in its
 * color; optionally with a badge on it.
 */
export const SymbolDemo: FunctionComponent = () => {
  const id = 'symbol';

  const [externalSymbol, externalContent] = useProvidedState(id);

  const [controlSymbol, propsSymbol, stateSymbol] = usePropControl(
    propOptionsSymbol,
    { external: externalSymbol, isOpen: true, title: 'symbol' },
  );
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );

  return (
    <Component
      isCentered
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
