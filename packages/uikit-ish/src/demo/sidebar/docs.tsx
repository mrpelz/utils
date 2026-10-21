import { elementRows, PropRow } from '../guide/props-table.js';
import { PartLink } from '../guide/sections.js';

// Every part's props, for the parts page (all) and the overview (its key
// ones).

export const sidebarRootRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its content, top to bottom, scrolling inside it: a{' '}
      <PartLink
        component="sidebar"
        part="Sidebar.Toolbar"
      />
      , a search field (
      <PartLink
        component="text-field"
        part="TextField.Search"
      />
      ), a list (
      <PartLink
        component="list"
        part="List.Root"
      >
        List.Root listStyle=&quot;sidebar&quot;
      </PartLink>
      ).
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
      <PartLink
        component="sidebar"
        part="Sidebar.ToolbarGroup"
      />
      .
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
