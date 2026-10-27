import { FunctionComponent } from 'react';

import { Symbol, Typography } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { Catalog } from './catalog.js';
import { symbolRows } from './docs.js';
import { propOptionsOverviewSymbol, propOptionsOverviewText } from './props.js';

/** A symbol in a text style: sized, weighted and colored by it. */
const LiveView: FunctionComponent = () => {
  const id = 'symbol-overview';
  const [externalSymbol, externalText] = useProvidedState(id);
  const [controlSymbol, propsSymbol, stateSymbol] = usePropControl(
    propOptionsOverviewSymbol,
    { external: externalSymbol, isOpen: true, title: 'Symbol' },
  );
  const [controlText, propsText, stateText] = usePropControl(
    propOptionsOverviewText,
    { external: externalText, title: 'Typography' },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[controlSymbol, controlText]}
      id={id}
      state={[stateSymbol, stateText]}
      title="Symbol"
    >
      <Typography {...propsText}>
        <Symbol {...propsSymbol} /> Notifications
      </Typography>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['when-to-use-it', 'When to use it'],
  ['when-to-use-something-else', 'When to use something else'],
  ['key-props', 'Key props'],
  ['accessibility', 'Accessibility'],
  ['behavior', 'Behavior'],
  ['all-symbols', 'All symbols'],
];

/** `/symbol`: what a symbol is for, and its props. */
export const SymbolOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        An SF Symbol (or any icon’s outlines), sized as the glyph of the text
        around it (it can stand in for one, as <code>􀋃</code> in Figma), in its
        color and weight.
      </li>
      <li>
        The components’ symbols: a button’s, a tab’s, a row’s image (Figma “􀋃”).
      </li>
    </ul>
    <LiveView />

    <Heading
      id="when-to-use-it"
      level={2}
    >
      When to use it
    </Heading>
    <ul>
      <li>
        A control’s symbol: a symbol-only button (<a href="button">Button</a>’s
        icon), a tab (<a href="tab-bar">Tab bar</a>), a row’s image (
        <a href="list">List</a>).
      </li>
      <li>A symbol in text: a label’s, a status’.</li>
    </ul>

    <Heading
      id="when-to-use-something-else"
      level={2}
    >
      When to use something else
    </Heading>
    <ul>
      <li>
        A person’s picture: an <a href="avatar">Avatar</a>.
      </li>
      <li>A picture of the content (a photo, an illustration): an image.</li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most symbols set.</li>
      <li>
        All its props: <a href="symbol/parts">Parts</a>.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        ['Symbol', pickRows(symbolRows, 'icon', 'baselineShift', 'children')],
      ]}
    />

    <Heading
      id="accessibility"
      level={2}
    >
      Accessibility
    </Heading>
    <ul>
      <li>
        Decorative: its glyph is hidden from assistive technology. Name what
        it’s in instead (a symbol-only button’s <code>aria-label</code>).
      </li>
      <li>
        Meaning something on its own (a status): give it{' '}
        <code>role=&quot;img&quot;</code> and an <code>aria-label</code>.
      </li>
    </ul>

    <Heading
      id="behavior"
      level={2}
    >
      Behavior
    </Heading>
    <ul>
      <li>
        As large as an SF Pro glyph at the font size (with its side bearings),
        in the text color; other icons by their units per em.
      </li>
      <li>
        In a line of text, its ink centered on the text’s: half the cap height
        up from the baseline (<code>baselineShift</code>).
      </li>
      <li>
        As heavy as the text style’s weight: heavier than regular, stroked;
        lighter, thinned.
      </li>
      <li>
        In a glass control, its glyph is blended and scaled with the control’s
        content; what sits on it (a badge) isn’t.
      </li>
    </ul>

    <Heading
      id="all-symbols"
      level={2}
    >
      All symbols
    </Heading>
    <ul>
      <li>
        Every SF Symbol of <code>@bradleyhodges/sfsymbols</code>, each a{' '}
        <PartLink
          component="symbol"
          part="Symbol"
        />
        : search by name, keyword or category; click one to copy its import.
      </li>
      <li>Loaded on request: all of them at once, a large download.</li>
    </ul>
    <Catalog />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const symbolOverviewDemos = [LiveView];
