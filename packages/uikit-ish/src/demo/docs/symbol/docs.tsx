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
      <code>svgPathData</code>, <code>viewBox</code>; optionally{' '}
      <code>sourceName</code>, and <code>unitsPerEm</code>: 20 by default, SF
      Symbols’). E.g. an SF Symbol from <code>@bradleyhodges/sfsymbols</code> (
      <code>sfBell</code>): its icons have this shape, no dependency of the
      library’s (mind Apple’s terms for SF Symbols).
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
