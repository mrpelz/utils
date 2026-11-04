import { useRoute } from 'preact-iso';
import { FunctionComponent, ReactNode } from 'react';

import {
  catalog,
  type CatalogEntry,
  catalogEntry,
  categories,
  type Category,
} from '../../docs/catalog.js';
import { useOptions } from '../frame/state.js';
import { publicUrl } from '../public-url.js';
import { ClientOnly } from '../shared/client-only.js';
import { VirtualList } from '../shared/virtual-list.js';
import {
  Breadcrumb,
  EntryContext,
  type EntryInfo,
  type Tab,
  Tabs,
} from './nav.js';
import { Contents, Heading, PagePathContext } from './sections.js';

// (Links under the site's public path: see `publicUrl`, env.ts.)

const entryInfo = (entry: CatalogEntry): EntryInfo => ({
  baseUiId: entry.baseUiId,
  category: entry.category,
  categoryTitle: categories[entry.category].title,
  framework7Id: entry.framework7Id,
  hasComposition: entry.Composition !== undefined,
  hasParts: entry.Parts !== undefined,
  id: entry.id,
  title: entry.title,
});

/**
 * Components' demos, one after another, each with its component's settings
 * and headers (see nav.tsx); client only (see `ClientOnly`: prerendered, an
 * empty shell), mounted while near the screen (see `VirtualList`). Raw, as
 * they are: the one shown alone (see frame/component.tsx).
 */
const EntryDemos: FunctionComponent<{ entries: readonly CatalogEntry[] }> = ({
  entries,
}) => {
  const { raw } = useOptions();

  const demos = entries.flatMap((entry) => {
    const info = entryInfo(entry);
    return entry.demos.map((Demo, index) => (
      <EntryContext.Provider
        key={`${entry.id}-${String(index)}`}
        value={info}
      >
        <Demo />
      </EntryContext.Provider>
    ));
  });

  return <ClientOnly>{raw ? demos : <VirtualList items={demos} />}</ClientOnly>;
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
    <h1 className="demo-page-title">Not Found</h1>
    <p>
      No such page. See <a href={publicUrl('./')}>the index</a> of components.
    </p>
  </div>
);

const useCatalogEntry = () => catalogEntry(useRoute().params.id ?? '');

/** A component's page of prose: its catalog entry's, or a pointer to its demos. */
const GuidePage: FunctionComponent<{
  content: 'Composition' | 'Overview' | 'Parts';
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
          No {label} yet: see{' '}
          <a href={publicUrl(`${entry.id}/all`)}>all demos</a>.
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
    <header className="demo-index-header">
      {/* Its icon (see demo/assets/icon.svg): a switch, on, approximately. */}
      <img
        alt=""
        className="demo-index-icon"
        src={publicUrl('assets/icon-rounded.svg')}
      />
      <h1 className="demo-page-title">uikit-ish</h1>
    </header>
    <p className="demo-lead">
      App components for the web, touch first, built on Base UI, with
      Framework7&apos;s behavior as a reference.
    </p>
    <nav className="demo-index-links">
      <a href={publicUrl('getting-started')}>
        <strong>Getting Started</strong>
        <span>
          Installing the library, React or Preact, the globals an app needs, how
          its components nest, and running it as a PWA.
        </span>
      </a>
      <a href={publicUrl('backstory-and-faq')}>
        <strong>Backstory &amp; FAQ</strong>
        <span>Why this exists, and questions people ask.</span>
      </a>
      <a href={publicUrl('kitchen-sink')}>
        <strong>Kitchen Sink</strong>
        <span>
          The components in an app, nested as an app nests them, as a raw demo:
          no frame, no controls, no prose.
        </span>
      </a>
      <a href={publicUrl('all')}>
        <strong>All Demos</strong>
        <span>
          Every component’s comprehensive demos, one after another on one page.
        </span>
      </a>
    </nav>
    <p>
      No icons ship with the library. The demos show SF Symbols, which are
      Apple’s and licensed for Apple platforms only: they are not part of the
      library or its dependencies, and the demos load each from unpkg as they’re
      shown. <a href={publicUrl('symbol#icons')}>Symbol</a> draws any icon’s
      outlines.
    </p>
    <p>The components, grouped by what they&apos;re for:</p>
    <Contents
      sections={(Object.keys(categories) as Category[]).map((category) => [
        category,
        categories[category].title,
      ])}
    />
    {(Object.keys(categories) as Category[]).map((category) => (
      <section
        key={category}
        className="demo-index-category"
      >
        <Heading
          id={category}
          level={2}
        >
          {categories[category].title}
        </Heading>
        <p>{categories[category].description}</p>
        <ul className="demo-index-cards">
          {category === 'foundations' ? (
            <li className="demo-index-card">
              <h3>
                <a href={publicUrl('tokens')}>Design Tokens</a>
              </h3>
              <p>
                The library’s colors, text styles and materials, live, as its
                stylesheet sets them.
              </p>
            </li>
          ) : null}
          {catalog
            // (In the catalog's order: by how deep they typically nest.)
            .filter((entry) => entry.category === category)
            .map((entry) => (
              <li
                key={entry.id}
                className="demo-index-card"
              >
                <h3>
                  <a href={publicUrl(entry.id)}>{entry.title}</a>
                </h3>
                <p>{entry.summary ?? ''}</p>
                <span className="demo-index-card-links">
                  {entry.Overview ? (
                    <a href={publicUrl(entry.id)}>Overview</a>
                  ) : null}
                  {entry.Parts ? (
                    <a href={publicUrl(`${entry.id}/parts`)}>Parts</a>
                  ) : null}
                  {entry.Composition ? (
                    <a href={publicUrl(`${entry.id}/composition`)}>
                      Composition
                    </a>
                  ) : null}
                  <a href={publicUrl(`${entry.id}/all`)}>
                    {entry.demos.length === 1
                      ? 'Demo'
                      : `${String(entry.demos.length)} Demos`}
                  </a>
                </span>
              </li>
            ))}
        </ul>
      </section>
    ))}
  </div>
);
