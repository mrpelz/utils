import {
  sfClock,
  sfFolder,
  sfHeart,
  sfPhoto,
  sfTrash,
  sfTray,
} from '../../tooling/icons.js';

// Content for the sidebar's guide pages (see overview.tsx, …). Data only:
// the views write out their lists, so their code shows as it'd be used.

/** A sidebar's row: its value, title, symbol, and count (if any). */
export type SidebarRow = readonly [
  value: string,
  title: string,
  icon: typeof sfTray,
  count?: number,
];

/** The sidebar's sections: their titles and rows. */
export const sidebarSections: readonly (readonly [
  title: string,
  rows: readonly SidebarRow[],
])[] = [
  [
    'Library',
    [
      ['inbox', 'Inbox', sfTray, 12],
      ['favorites', 'Favorites', sfHeart, 3],
      ['recents', 'Recents', sfClock],
    ],
  ],
  [
    'Folders',
    [
      ['projects', 'Projects', sfFolder, 8],
      ['photos', 'Photos', sfPhoto],
      ['trash', 'Trash', sfTrash],
    ],
  ],
];

/** Every row's title, by its value. */
export const rowTitles: Readonly<Record<string, string>> = Object.fromEntries(
  sidebarSections.flatMap(([, rows]) =>
    rows.map(([value, title]) => [value, title]),
  ),
);
