import { elementRows, PropRow } from '../guide/props-table.js';

// Every part's props, for the parts page (all) and the overview (its key
// ones).

export const navigationRootRows: readonly PropRow[] = [
  [
    'children',
    'ReactElement[]',
    undefined,
    <>
      The stack’s pages, bottom to top, each with a <code>key</code> (e.g. a{' '}
      <a href="page">Page</a>): keys extended, the new top page is pushed; cut
      back (by one or more), the top page is popped; otherwise, the new top page
      is shown at once.
    </>,
  ],
  [
    'onBack',
    '() => void',
    undefined,
    <>
      Called when the top page is swiped back from its leading edge (released
      past half its width, or flung): the app pops its stack. Without it, pages
      can’t be swiped back.
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];
