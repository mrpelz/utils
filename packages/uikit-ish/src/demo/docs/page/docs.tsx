import {
  code,
  elementRows,
  PropRow,
  union,
} from '../../tooling/guide/props-table.js';
import { publicUrl } from '../../tooling/public-url.js';

// Every part's props, for the parts page (all) and the overview (its key
// ones).

export const pageRootRows: readonly PropRow[] = [
  [
    'background',
    union('grouped', 'plain'),
    code(union('grouped')),
    <>
      The page background: <code>grouped</code> (the grouped background) for
      grouped lists (<code>insetGrouped</code>, <code>grouped</code>);{' '}
      <code>plain</code> (the system background) for plain lists and other
      content.
    </>,
  ],
  [
    'alwaysBounce',
    'boolean',
    code('true'),
    <>
      Bouncing even when its content fits: it has at least 1px to scroll, so a
      drag on it is its own (rubber-banding the page, the bars staying), not the
      document’s (on iOS, moving the whole app). <code>false</code>: only
      content taller than it scrolls.
    </>,
  ],
  [
    'fill',
    'boolean',
    code('false'),
    <>
      Its content filling it, not scrolled (e.g. a map under its bars): not a
      scroller (its provider tracks none here; no edge effects), its content
      running under the bars and the safe areas (their insets its own, to keep
      clear of where it needs to), on the page background all the same.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      What it scrolls (or, <code>fill</code>, what fills it): e.g. a{' '}
      <a href={publicUrl('header')}>Header</a>’s large title at its start (below
      the header’s bar), then lists.
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];
