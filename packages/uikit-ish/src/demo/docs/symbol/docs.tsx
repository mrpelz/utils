import {
  code,
  elementRows,
  PropRow,
  union,
} from '../../tooling/guide/props-table.js';

// Its props, for the parts page (all) and the overview (its key ones).

export const symbolRows: readonly PropRow[] = [
  [
    'icon',
    'SymbolIcon',
    undefined,
    <>
      The icon (required): its outlines, filled paths in a view box (
      <code>svgPathData</code>, each a layer, its <code>fillOpacity</code>{' '}
      relative to the most opaque one’s; <code>viewBox</code>; optionally{' '}
      <code>sourceName</code>, and <code>unitsPerEm</code>: 20 by default, SF
      Symbols’). The library ships no icons: e.g. an SF Symbol from{' '}
      <code>@bradleyhodges/sfsymbols</code> (<code>sfBell</code>) has this shape
      (Apple’s, licensed for Apple platforms only; no dependency of the
      library’s).
    </>,
  ],
  [
    'emphasizedIcon',
    'SymbolIcon',
    undefined,
    <>
      The icon shown when its host emphasizes it, e.g. <code>sfBellFill</code>{' '}
      on a selected tab: both stacked, faded by the inherited{' '}
      <code>--uikit-symbol-emphasis</code> (0 to 1). Set by a selected{' '}
      <a href="tab-bar">Tab bar</a> tab, a checked{' '}
      <a href="segmented">Segmented</a> item and a selected{' '}
      <a href="sidebar">Sidebar</a> row; set it in your own CSS for others. No
      state of the app’s picks the icon.
    </>,
  ],
  [
    'baselineShift',
    union('optical', 'none'),
    code(union('optical')),
    <>
      Its place in a line of text: its ink’s center on the text’s (half its cap
      height up from the baseline, as SF Symbols set with SF Pro), or its ink’s
      bottom on the baseline (<code>none</code>). In a flex or grid container
      (e.g. a button’s), no effect: the container places it.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      What sits on it, e.g. a <a href="badge">Badge</a> (
      <code>placement=&quot;symbol&quot;</code>): neither blended nor scaled
      with the glyph.
    </>,
  ],
  ...elementRows('span', 'HTMLSpanElement'),
];
