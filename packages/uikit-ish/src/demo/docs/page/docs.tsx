import {
  code,
  elementRows,
  PropRow,
  union,
} from '../../tooling/guide/props-table.js';
import { publicUrl } from '../../tooling/public-url.js';
import { glassModeRow } from '../glass-mode.js';

// Every part's props, for the parts page (all) and the overview (its key
// ones).

export const pageRootRows: readonly PropRow[] = [
  [
    'background',
    union('grouped', 'plain'),
    code(union('grouped')),
    <>
      The page background. <code>grouped</code> (the grouped background) suits
      grouped lists (<code>insetGrouped</code>, <code>grouped</code>).{' '}
      <code>plain</code> (the system background) suits plain lists and other
      content.
    </>,
  ],
  [
    'alwaysBounce',
    'boolean',
    code('true'),
    <>
      Bounces even when its content fits: it always has at least 1px to scroll.
      A drag on it then rubber-bands the page while the bars stay put, instead
      of moving the document (on iOS, the whole app). <code>false</code>: only
      content taller than it scrolls.
    </>,
  ],
  [
    'fill',
    'boolean',
    code('false'),
    <>
      Lets its content fill it without scrolling, for example a map under its
      bars. It’s then not a scroller: its provider tracks nothing here, and
      there are no edge effects. Its content runs under the bars and the safe
      areas, and keeps clear of their insets itself where it needs to. It still
      sits on the page background.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      What it scrolls (or, with <code>fill</code>, what fills it). For example a{' '}
      <a href={publicUrl('header')}>Header</a>’s large title at its start (below
      the header’s bar), then lists.
    </>,
  ],
  glassModeRow,
  ...elementRows('div', 'HTMLDivElement'),
];
