import {
  code,
  elementRows,
  PropRow,
  union,
} from '../../tooling/guide/props-table.js';

// Every part's props, for the parts page (all) and the overview (its key
// ones).

export const pageRootRows: readonly PropRow[] = [
  [
    'background',
    union('grouped', 'plain'),
    code(union('grouped')),
    <>
      The page background: <code>grouped</code> (UIKit’s grouped background) for
      grouped lists (<code>insetGrouped</code>, <code>grouped</code>);{' '}
      <code>plain</code> (the system background) for plain lists and other
      content.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      What it scrolls: e.g. a <a href="header">Header</a>’s large title at its
      start (below the header’s bar), then lists.
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];
