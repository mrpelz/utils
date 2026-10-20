import { createContext, FunctionComponent, ReactNode, useContext } from 'react';

import { EntryContext } from './nav.js';

// Anchors on the guide pages: their sections (headings with ids) listed at
// the top, and part names linking to their sections.

/** A part's section's id: `List.Accessory` → `list-accessory`. */
export const sectionId = (text: string): string =>
  text
    .toLowerCase()
    .replaceAll(/[^\da-z]+/gu, '-')
    .replaceAll(/^-|-$/gu, '');

/** A section of a page: its heading's id, and its title. */
export type Section = readonly [id: string, title: ReactNode];

/** The current page's path (for its anchors' links; see `ComponentShell`). */
export const PagePathContext = createContext('');

/** A page's sections, listed at its top, linking to their headings. */
export const Contents: FunctionComponent<{
  sections: readonly Section[];
}> = ({ sections }) => {
  const path = useContext(PagePathContext);

  return (
    <nav
      aria-label="Sections"
      className="demo-contents"
    >
      <ul>
        {sections.map(([id, title]) => (
          <li key={id}>
            <a href={`${path}#${id}`}>{title}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

/**
 * A part's name in a parts page's tree (`<code>`), linking to its section
 * on the component's parts page.
 */
export const PartLink: FunctionComponent<{ part: string }> = ({ part }) => {
  const entry = useContext(EntryContext);

  return (
    <a href={`${entry?.id ?? ''}/parts#${sectionId(part)}`}>
      <code>{part}</code>
    </a>
  );
};
