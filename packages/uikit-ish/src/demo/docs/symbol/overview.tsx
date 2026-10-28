import { CSSProperties, FunctionComponent } from 'react';

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
import {
  propOptionsOverviewContent,
  propOptionsOverviewSymbol,
  propOptionsOverviewText,
} from './props.js';

/** A symbol in a text style: sized and colored by it. */
const LiveView: FunctionComponent = () => {
  const id = 'symbol-overview';
  const [externalSymbol, externalText, externalContent] = useProvidedState(id);
  const [controlSymbol, propsSymbol, stateSymbol] = usePropControl(
    propOptionsOverviewSymbol,
    { external: externalSymbol, isOpen: true, title: 'Symbol' },
  );
  const [controlText, propsText, stateText] = usePropControl(
    propOptionsOverviewText,
    { external: externalText, title: 'Typography' },
  );
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsOverviewContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[controlSymbol, controlText, controlContent]}
      id={id}
      state={[stateSymbol, stateText, stateContent]}
      title="Symbol"
    >
      {/* Emphasized as a host would (e.g. a selected tab). */}
      <Typography
        {...propsText}
        style={
          content.emphasized
            ? ({ '--uikit-symbol-emphasis': 1 } as CSSProperties)
            : undefined
        }
      >
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
  ['icons', 'Icons'],
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
        color.
      </li>
      <li>
        Emphasized by its host (a selected tab), its filled variant instead: no
        state of the app’s picks it.
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
        [
          'Symbol',
          pickRows(
            symbolRows,
            'icon',
            'emphasizedIcon',
            'baselineShift',
            'children',
          ),
        ],
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
        One weight, its outlines’ (SF Symbols’: Regular), whatever the text’s:
        no stroke thickens it. Layers at their relative opacities (an SF
        Symbol’s secondary layer half as opaque as its primary).
      </li>
      <li>
        Emphasized, its <code>emphasizedIcon</code> (e.g. the filled variant)
        fades in over its icon, as far as its host’s{' '}
        <code>--uikit-symbol-emphasis</code> (0 to 1, inherited): a selected{' '}
        <a href="tab-bar">Tab bar</a> tab, a checked{' '}
        <a href="segmented">Segmented</a> item, a selected{' '}
        <a href="sidebar">Sidebar</a> row. Both icons are given; the host’s
        state picks one, so an uncontrolled tab bar’s symbols follow it.
      </li>
      <li>
        In a glass control, its glyph is blended and scaled with the control’s
        content; what sits on it (a badge) isn’t.
      </li>
    </ul>

    <Heading
      id="icons"
      level={2}
    >
      Icons
    </Heading>
    <ul>
      <li>
        Any icon’s outlines: a{' '}
        <PartLink
          component="symbol"
          part="Symbol"
        />{' '}
        takes an object of filled paths in a view box (<code>SymbolIcon</code>
        ). The library depends on no icon package.
      </li>
      <li>
        SF Symbols: <code>@bradleyhodges/sfsymbols</code>’ icons have that
        shape. Import each by its own path (
        <code>@bradleyhodges/sfsymbols/sfBell</code>), not the package’s index
        (every symbol). Mind Apple’s terms: SF Symbols are licensed for Apple
        platforms only.
      </li>
      <li>
        The package’s own renderer (<code>SFIcon</code>, from{' '}
        <code>@bradleyhodges/sfsymbols-react</code>) draws a bare SVG, a square
        an em tall: not sized as SF Pro’s glyph, not centered on the text, its
        primary layer translucent (its paths’ 0.85), heavier by a stroke,
        nothing on it, no emphasized variant. A{' '}
        <PartLink
          component="symbol"
          part="Symbol"
        />{' '}
        takes the same icon objects and adds those.
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
      <li>
        Also the package’s brand icons (FontAwesome’s, 512 units to an em:{' '}
        <code>unitsPerEm</code>).
      </li>
      <li>Loaded on request: all of them at once, a large download.</li>
    </ul>
    <Catalog />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const symbolOverviewDemos = [LiveView];
