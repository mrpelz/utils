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
import { publicUrl } from '../../tooling/public-url.js';
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
        Any icon’s outlines, sized like a letter of the text around it (so it
        can stand in for one), in the text’s color. The library ships no icons;
        the demos use SF Symbols.
      </li>
      <li>
        When its host emphasizes it (as a selected tab does), it shows its
        filled variant instead. The app’s state doesn’t pick the icon.
      </li>
      <li>
        It’s what the components use for their symbols: a button’s, a tab’s, a
        row’s image.
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
        For a control’s symbol: a symbol-only button (a{' '}
        <a href={publicUrl('button')}>Button</a>’s icon), a tab (in a{' '}
        <a href={publicUrl('tab-bar')}>Tab Bar</a>), or a row’s image (in a{' '}
        <a href={publicUrl('list')}>List</a>).
      </li>
      <li>For a symbol in text, such as a label’s or a status’.</li>
    </ul>

    <Heading
      id="when-to-use-something-else"
      level={2}
    >
      When to use something else
    </Heading>
    <ul>
      <li>
        A person’s picture: use an <a href={publicUrl('avatar')}>Avatar</a>.
      </li>
      <li>
        A picture of the content (a photo, an illustration): use an image.
      </li>
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
        All its props are on the <a href={publicUrl('symbol/parts')}>Parts</a>{' '}
        page.
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
        It’s decorative, so its glyph is hidden from assistive technology. Name
        what it’s in instead (for example a symbol-only button’s{' '}
        <code>aria-label</code>).
      </li>
      <li>
        When it means something on its own (a status), give it{' '}
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
        It’s as large as an SF Pro letter at the font size (with its side
        bearings), in the text color. Other icons are sized by their units per
        em.
      </li>
      <li>
        In a line of text, its ink is centered on the text’s: half the cap
        height up from the baseline (<code>baselineShift</code>).
      </li>
      <li>
        It has one weight, its outlines’ (Regular, for SF Symbols), whatever the
        text’s weight is, because no stroke thickens it. Its layers keep their
        relative opacities (an SF Symbol’s secondary layer is half as opaque as
        its primary).
      </li>
      <li>
        When emphasized, its <code>emphasizedIcon</code> (for example the filled
        variant) fades in over its icon, as far as its host’s{' '}
        <code>--uikit-symbol-emphasis</code> says (0 to 1, inherited). A
        selected <a href={publicUrl('tab-bar')}>Tab Bar</a> tab, a checked{' '}
        <a href={publicUrl('segmented')}>Segmented</a> item and a selected{' '}
        <a href={publicUrl('sidebar')}>Sidebar</a> row set it. Both icons are
        given, and the host’s state picks one, so an uncontrolled tab bar’s
        symbols follow it.
      </li>
      <li>
        In a glass control, its glyph is blended and scaled with the control’s
        content. What sits on it (a badge) isn’t.
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
        It takes any icon’s outlines: a{' '}
        <PartLink
          component="symbol"
          part="Symbol"
        />{' '}
        takes an object of filled paths in a view box (<code>SymbolIcon</code>).
        The library ships no icons and depends on no icon package.
      </li>
      <li>
        The demos’ icons are SF Symbols, which are Apple’s and licensed for
        Apple platforms only. They’re not part of this library, and not bundled
        with its demos. Each is loaded from unpkg when it’s shown, as a module
        of <code>@bradleyhodges/sfsymbols</code> (whose icons have that shape).
      </li>
      <li>
        In an app that may use them, install the package and import each icon by
        its own path (<code>@bradleyhodges/sfsymbols/sfBell</code>), not from
        the package’s index (which holds every symbol).
      </li>
      <li>
        The package’s own renderer (<code>SFIcon</code>, from{' '}
        <code>@bradleyhodges/sfsymbols-react</code>) draws a bare SVG, a square
        one em tall. It isn’t sized like an SF Pro letter or centered on the
        text, its primary layer is translucent (its paths’ 0.85), a stroke makes
        it heavier, nothing can sit on it, and it has no emphasized variant. A{' '}
        <PartLink
          component="symbol"
          part="Symbol"
        />{' '}
        takes the same icon objects and adds all that.
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
        Every SF Symbol of <code>@bradleyhodges/sfsymbols</code>, each as a{' '}
        <PartLink
          component="symbol"
          part="Symbol"
        />
        . Search by name or category, and click one to copy its import (the
        package’s path, see <a href="#icons">Icons</a>).
      </li>
      <li>
        Also the package’s brand icons (FontAwesome’s, with 512 units to an em:{' '}
        <code>unitsPerEm</code>).
      </li>
      <li>
        They’re not part of the library. They load from unpkg on request: their
        names first (a large download), then each icon as it scrolls into view.
      </li>
    </ul>
    <Catalog />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const symbolOverviewDemos = [LiveView];
