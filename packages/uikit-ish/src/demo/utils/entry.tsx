import { createContext, FunctionComponent, useContext } from 'react';

const BASE_UI_DOCS = 'https://base-ui.com/react/components';
const FRAMEWORK7_DOCS = 'https://framework7.io/react';
const HIG = 'https://developer.apple.com/design/human-interface-guidelines';

// (Links are relative to the document's base: the demo's public path.)

/** The component a page or demo is about (see the catalog). */
export type EntryInfo = {
  baseUiId?: string;
  categoryTitle: string;
  framework7Id?: string;
  /** Has a composition page (`/:id/composition`). */
  hasComposition: boolean;
  /** Has an information architecture page (`/:id/information-architecture`). */
  hasInformationArchitecture: boolean;
  /** Has a parts page (`/:id/parts`). */
  hasParts: boolean;
  higId?: string;
  id: string;
  title: string;
};

export type Tab =
  'all' | 'composition' | 'information-architecture' | 'overview' | 'parts';

/**
 * The component the demos within are about: their settings (stage,
 * backdrop, …) are its, shared by its pages; their headers link to them.
 */
export const EntryContext = createContext<EntryInfo | undefined>(undefined);

export const useEntry = (): EntryInfo | undefined => useContext(EntryContext);

/** Where a page is: the index, the category, and (in a demo) the component. */
export const Breadcrumb: FunctionComponent<{
  entry: EntryInfo;
  /** Ending at the component (a demo's), not its category (a page's). */
  withComponent?: boolean;
}> = ({ entry, withComponent = false }) => (
  <nav className="demo-page-nav">
    <a href="./">uikit-ish</a> › {entry.categoryTitle}
    {withComponent ? (
      <>
        {' › '}
        <a href={entry.id}>{entry.title}</a>
      </>
    ) : null}
  </nav>
);

/** A component's pages, and its documentation elsewhere. */
export const Tabs: FunctionComponent<{
  /** The Base UI component (default: the component's). */
  baseUiId?: string;
  entry: EntryInfo;
  tab: Tab;
}> = ({ baseUiId = undefined, entry, tab }) => {
  const docs = baseUiId ?? entry.baseUiId;
  // (Without an overview, its page is a placeholder pointing to the demos.)
  const tabs: [Tab, string, string][] = [['overview', 'Overview', entry.id]];
  if (entry.hasParts) tabs.push(['parts', 'Parts', `${entry.id}/parts`]);
  if (entry.hasComposition) {
    tabs.push(['composition', 'Composition', `${entry.id}/composition`]);
  }
  if (entry.hasInformationArchitecture) {
    tabs.push([
      'information-architecture',
      'Information architecture',
      `${entry.id}/information-architecture`,
    ]);
  }
  tabs.push(['all', 'All demos', `${entry.id}/all`]);

  return (
    <nav className="demo-page-tabs">
      {tabs.map(([id, label, href]) => (
        <a
          key={id}
          aria-current={id === tab ? 'page' : undefined}
          href={href}
        >
          {label}
        </a>
      ))}
      <span className="demo-page-links">
        {docs ? (
          <a
            href={`${BASE_UI_DOCS}/${docs}`}
            rel="noreferrer"
            target="_blank"
          >
            Base UI
          </a>
        ) : null}
        {entry.framework7Id ? (
          <a
            href={`${FRAMEWORK7_DOCS}/${entry.framework7Id}.html`}
            rel="noreferrer"
            target="_blank"
          >
            Framework7
          </a>
        ) : null}
        {entry.higId ? (
          <a
            href={`${HIG}/${entry.higId}`}
            rel="noreferrer"
            target="_blank"
          >
            Apple HIG
          </a>
        ) : null}
      </span>
    </nav>
  );
};
