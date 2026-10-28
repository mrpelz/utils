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

/**
 * A link to a section of the page at `path` (the index's: empty), never
 * just `#…`: the router leaves those to the browser, without a smooth scroll
 * (see main.tsx).
 */
const sectionHref = (path: string, id: string): string =>
  `${path || './'}#${id}`;

/** A section's heading, anchored (`id`), with a link to itself. */
export const Heading: FunctionComponent<{
  children: ReactNode;
  id: string;
  level: 2 | 3 | 4;
}> = ({ children, id, level }) => {
  const path = useContext(PagePathContext);
  const Tag = `h${String(level)}` as 'h2';

  return (
    <Tag id={id}>
      {children}{' '}
      <a
        aria-label="Link to this section"
        className="demo-anchor"
        href={sectionHref(path, id)}
      >
        #
      </a>
    </Tag>
  );
};

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
            <a href={sectionHref(path, id)}>{title}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

/**
 * A part's name in a parts page's tree (`<code>`), linking to its section
 * on the component's parts page; or code using the part (`children`, e.g.
 * `List.Item selected`), linking there all the same.
 */
export const PartLink: FunctionComponent<{
  /** The code shown, if not the part's name. */
  children?: string;
  /** Another component's (its id: its route), e.g. `toolbar`. */
  component?: string;
  part: string;
}> = ({ children, component, part }) => {
  const entry = useContext(EntryContext);

  return (
    <a href={`${component ?? entry?.id ?? ''}/parts#${sectionId(part)}`}>
      <code>{children ?? part}</code>
    </a>
  );
};
