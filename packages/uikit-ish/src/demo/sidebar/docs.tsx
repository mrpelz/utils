import { elementRows, PropRow } from '../guide/props-table.js';

// Every part's props, for the parts page (all) and the overview (its key
// ones).

export const sidebarRootRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its content, top to bottom, scrolling inside it: a{' '}
      <code>Sidebar.Toolbar</code>, a search field (
      <code>TextField.Search</code>), a list (
      <code>List.Root listStyle=&quot;sidebar&quot;</code>).
    </>,
  ],
  [
    'aria-label',
    'string',
    undefined,
    <>
      The navigation landmark’s name (it’s a <code>{'<nav>'}</code>), e.g.
      Mailboxes.
    </>,
  ],
  ...elementRows('nav', 'HTMLElement'),
];

export const sidebarToolbarRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Buttons at its two ends (borderless <a href="button">Button</a>s, in the
      glass’ content color): one at each end, or a{' '}
      <code>Sidebar.ToolbarGroup</code>.
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const sidebarToolbarGroupRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'Buttons at one end of the toolbar, side by side.',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];
