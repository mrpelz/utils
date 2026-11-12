import {
  code,
  elementRows,
  PropRow,
  union,
} from '../../tooling/guide/props-table.js';
import { publicUrl } from '../../tooling/public-url.js';

// Its props, for the parts page (all) and the overview (its key ones).

export const symbolRows: readonly PropRow[] = [
  [
    'icon',
    'SymbolIcon',
    undefined,
    <>
      The icon (required): its outlines, as filled paths in a view box. That’s{' '}
      <code>svgPathData</code> (each path a layer, with its{' '}
      <code>fillOpacity</code> relative to the most opaque one’s),{' '}
      <code>viewBox</code>, and optionally <code>sourceName</code> and{' '}
      <code>unitsPerEm</code> (20 by default, as for SF Symbols). The library
      ships no icons. For example, an SF Symbol from{' '}
      <code>@bradleyhodges/sfsymbols</code> (<code>sfBell</code>) has this shape
      (SF Symbols are Apple’s and licensed for Apple platforms only, and the
      library doesn’t depend on them).
    </>,
  ],
  [
    'emphasizedIcon',
    'SymbolIcon',
    undefined,
    <>
      The icon shown when its host emphasizes it, for example{' '}
      <code>sfBellFill</code> on a selected tab. Both are stacked, and faded by
      the inherited <code>--uikit-symbol-emphasis</code> (0 to 1). It’s set by a
      selected <a href={publicUrl('tab-bar')}>Tab bar</a> tab, a checked{' '}
      <a href={publicUrl('segmented')}>Segmented</a> item and a selected{' '}
      <a href={publicUrl('sidebar')}>Sidebar</a> row; set it in your own CSS for
      others. The app’s state doesn’t pick the icon.
    </>,
  ],
  [
    'baselineShift',
    union('optical', 'none'),
    code(union('optical')),
    <>
      Its place in a line of text: its ink’s center on the text’s (half the cap
      height up from the baseline, as SF Symbols sit with SF Pro), or its ink’s
      bottom on the baseline (<code>none</code>). In a flex or grid container
      (for example a button’s), it has no effect, because the container places
      it.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      What sits on it, for example a <a href={publicUrl('badge')}>Badge</a> (
      <code>placement=&quot;symbol&quot;</code>), which is neither blended nor
      scaled with the glyph.
    </>,
  ],
  ...elementRows('span', 'HTMLSpanElement'),
];
