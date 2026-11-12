import './style.css';

import { FunctionComponent } from 'react';

import { Symbol } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { symbolRows } from './docs.js';
import { propOptionsSymbol } from './props.js';

/** `Symbol`, outlined, with its props. */
const SymbolPart: FunctionComponent = () => {
  const id = 'symbol-parts-symbol';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsSymbol, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Symbol',
  });

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      state={[state]}
      title="Symbol"
    >
      {/* In a line of text (see its baseline shift). */}
      <span className="symbol-demo-large">
        <Symbol {...props} /> Inbox
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
    <ul className="demo-tree">
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
        Its glyph: <code>icon</code> (any icon’s outlines, for example an SF
        Symbol’s), sized and colored by its text (font size, color), in its one
        weight.
      </li>
      <li>
        When emphasized, it shows its <code>emphasizedIcon</code> instead (for
        example the filled variant), as far as its host sets{' '}
        <code>--uikit-symbol-emphasis</code>. Here, it’s set on the symbol
        itself (<code>style</code>).
      </li>
      <li>
        In a line of text, its ink is centered on the text’s (
        <code>baselineShift</code>), or sits on the baseline. Here, it’s next to
        a word.
      </li>
      <li>
        Its children sit on it (positioned on the glyph’s box), for example a{' '}
        <a href={publicUrl('badge')}>Badge</a>.
      </li>
      <li>
        Renders a <code>span</code>, with its glyph as an SVG hidden from
        assistive technology.
      </li>
    </ul>
    <SymbolPart />
    <h3>Props</h3>
    <PropsTable rows={symbolRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const symbolPartsDemos = [SymbolPart];
