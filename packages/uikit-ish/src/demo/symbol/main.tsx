import { FunctionComponent } from 'react';

import { Symbol } from '../../components/index.js';
import { Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
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
    'symbol',
    externalSymbol,
    true,
  );
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    '[content]',
    externalContent,
    true,
  );

  return (
    <Component
      center
      controls={[controlSymbol, controlContent]}
      id={id}
      stateUrl={useCreateStateUrl(id, [stateSymbol, stateContent])}
      title="Symbol"
    >
      <span style={{ color: content.color, fontSize: content.fontSize }}>
        <Symbol {...propsSymbol} />
      </span>
    </Component>
  );
};
