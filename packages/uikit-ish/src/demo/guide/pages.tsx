import { useRoute } from 'preact-iso';
import { FunctionComponent, ReactNode } from 'react';

import {
  catalog,
  type CatalogEntry,
  catalogEntry,
  categories,
  type Category,
} from '../catalog.js';
import { useOptions } from '../frame/state.js';
import { guideHref } from '../hig-guide/link.js';
import { ClientOnly } from '../shared/client-only.js';
import { VirtualList } from '../shared/virtual-list.js';
import {
  Breadcrumb,
  EntryContext,
  type EntryInfo,
  type Tab,
  Tabs,
} from './nav.js';
import { PagePathContext } from './sections.js';

// (Links are relative to the document's base: the demo's public path.)

const entryInfo = (entry: CatalogEntry): EntryInfo => ({
  baseUiId: entry.baseUiId,
  categoryTitle: categories[entry.category].title,
  framework7Id: entry.framework7Id,
  hasComposition: entry.Composition !== undefined,
  hasInformationArchitecture: entry.InformationArchitecture !== undefined,
  hasParts: entry.Parts !== undefined,
  higId: entry.higId,
  id: entry.id,
  title: entry.title,
});

/**
 * Components' demos, one after another, each with its component's settings
 * and headers (see nav.tsx); client only (see `ClientOnly`: prerendered, an
 * empty shell), mounted while near the screen (see `VirtualList`).
 */
const EntryDemos: FunctionComponent<{ entries: readonly CatalogEntry[] }> = ({
  entries,
}) => {
  const { raw } = useOptions();

  return (
    <ClientOnly>
      <VirtualList
        snap={!raw}
        items={entries.flatMap((entry) => {
          const info = entryInfo(entry);
          return entry.demos.map((Demo, index) => (
            <EntryContext.Provider
              key={index}
              value={info}
            >
              <Demo />
            </EntryContext.Provider>
          ));
        })}
      />
    </ClientOnly>
  );
};

/** A component's page of prose (overview, parts). */
const ComponentShell: FunctionComponent<{
  children: ReactNode;
  entry: CatalogEntry;
  tab: Exclude<Tab, 'all'>;
}> = ({ children, entry, tab }) => {
  const info = entryInfo(entry);
  return (
    <EntryContext.Provider value={info}>
      <div className="demo-page">
        <Breadcrumb entry={info} />
        <h1 className="demo-page-title">{entry.title}</h1>
        <Tabs
          entry={info}
          tab={tab}
        />
        <PagePathContext.Provider
          value={tab === 'overview' ? entry.id : `${entry.id}/${tab}`}
        >
          <div className="demo-prose">{children}</div>
        </PagePathContext.Provider>
      </div>
    </EntryContext.Provider>
  );
};

export const NotFound: FunctionComponent = () => (
  <div className="demo-page demo-prose">
    <h1 className="demo-page-title">Not found</h1>
    <p>
      No such page. See <a href="./">the index</a> of components.
    </p>
  </div>
);

const useCatalogEntry = () => catalogEntry(useRoute().params.id ?? '');

/** A component's page of prose: its catalog entry's, or a pointer to its demos. */
const GuidePage: FunctionComponent<{
  content: 'Composition' | 'InformationArchitecture' | 'Overview' | 'Parts';
  /** What the page is (“No … yet”). */
  label: string;
  tab: Exclude<Tab, 'all'>;
}> = ({ content, label, tab }) => {
  const entry = useCatalogEntry();
  if (!entry) return <NotFound />;
  const Content = entry[content];

  return (
    <ComponentShell
      entry={entry}
      tab={tab}
    >
      {Content ? (
        <Content />
      ) : (
        <p>
          No {label} yet: see <a href={`${entry.id}/all`}>all demos</a>.
        </p>
      )}
    </ComponentShell>
  );
};

/** `/:id`: introduction, use and props, with a live view. */
export const OverviewPage: FunctionComponent = () => (
  <GuidePage
    content="Overview"
    label="overview"
    tab="overview"
  />
);

/** `/:id/parts`: each part, outlined, with its own props. */
export const PartsPage: FunctionComponent = () => (
  <GuidePage
    content="Parts"
    label="parts page"
    tab="parts"
  />
);

/** `/:id/composition`: how it combines with other components. */
export const CompositionPage: FunctionComponent = () => (
  <GuidePage
    content="Composition"
    label="composition page"
    tab="composition"
  />
);

/** `/:id/information-architecture`: where it sits in Apple's information architecture. */
export const InformationArchitecturePage: FunctionComponent = () => (
  <GuidePage
    content="InformationArchitecture"
    label="information architecture page"
    tab="information-architecture"
  />
);

/** `/:id/all`: the component's comprehensive demos (headed each). */
export const ComponentDemosPage: FunctionComponent = () => {
  const entry = useCatalogEntry();
  return entry ? <EntryDemos entries={[entry]} /> : <NotFound />;
};

/** `/all`: every demo, one after another (also what the tests open). */
export const AllDemosPage: FunctionComponent = () => (
  <EntryDemos entries={catalog} />
);

/** `/`: the components by category, each with its summary. */
export const IndexPage: FunctionComponent = () => (
  <div className="demo-page demo-prose">
    <h1 className="demo-page-title">uikit-ish</h1>
    <p className="demo-lead">
      iOS 26 (UIKit) components for the web, built on Base UI: Apple&apos;s
      Figma kit and Human Interface Guidelines, with Framework7&apos;s behavior
      where they leave off.
    </p>
    <nav className="demo-index-links">
      <a href={guideHref()}>
        <strong>HIG composition guide</strong>
        <span>
          How Apple’s components fit together, their shared traits, and a
          re-slicing into primitives: what this index’s groups and the
          components’ information architecture pages are after.
        </span>
      </a>
      <a href="all">
        <strong>All demos</strong>
        <span>
          Every component’s comprehensive demos, one after another on one page.
        </span>
      </a>
    </nav>
    <p>The components, grouped by what they&apos;re for:</p>
    {(Object.keys(categories) as Category[]).map((category) => (
      <section
        key={category}
        className="demo-index-category"
      >
        <h2>{categories[category].title}</h2>
        <p>{categories[category].description}</p>
        <ul className="demo-index-cards">
          {catalog
            .filter((entry) => entry.category === category)
            .toSorted((a, b) => a.title.localeCompare(b.title))
            .map((entry) => (
              <li
                key={entry.id}
                className="demo-index-card"
              >
                <h3>
                  <a href={entry.id}>{entry.title}</a>
                </h3>
                <p>{entry.summary ?? ''}</p>
                <span className="demo-index-card-links">
                  {entry.Overview ? <a href={entry.id}>overview</a> : null}
                  {entry.Parts ? <a href={`${entry.id}/parts`}>parts</a> : null}
                  {entry.Composition ? (
                    <a href={`${entry.id}/composition`}>composition</a>
                  ) : null}
                  {entry.InformationArchitecture ? (
                    <a href={`${entry.id}/information-architecture`}>
                      information architecture
                    </a>
                  ) : null}
                  <a href={`${entry.id}/all`}>
                    {entry.demos.length === 1
                      ? 'demo'
                      : `${String(entry.demos.length)} demos`}
                  </a>
                </span>
              </li>
            ))}
        </ul>
      </section>
    ))}
  </div>
);
