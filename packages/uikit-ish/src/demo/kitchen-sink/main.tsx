import './style.css';

import { FunctionComponent, ReactNode, useMemo, useState } from 'react';

import {
  Button,
  Collapsible,
  Header,
  Layout,
  List,
  Navigation,
  Page,
  Settings,
  type SettingsValues,
  Sidebar,
  Symbol,
  Toolbar,
  useFocusShiftPrevention,
  useInputZoomPrevention,
  useSizeClass,
  Viewport,
} from '../../components/index.js';
import { catalog, categories, type Category } from '../docs/catalog.js';
import { sfArrowBackward, sfChevronBackward } from '../tooling/icons.js';
import { publicUrl } from '../tooling/public-url.js';
import { ClientOnly } from '../tooling/shared/client-only.js';
import { useRawDocument } from '../tooling/shared/raw-document.js';
import { actionsPages } from './actions.js';
import { choicesPages } from './choices.js';
import { contentPages } from './content.js';
import { foundationsPages } from './foundations.js';
import { presentationPages } from './presentation.js';
import {
  LayoutRootContext,
  PopContext,
  PushContext,
  type SinkPages,
  SinkSettingsContext,
  SinkSwipeAreas,
} from './shared.js';
import { statusPages } from './status.js';
import { structurePages } from './structure.js';
import { viewportPages } from './viewport.js';

// The kitchen sink: every component, each on a page of its own showing
// all it looks like (no frame, controls or prose: as a raw demo is shown).
// Compact (a phone): its index (the components by category) the stack's
// root, drilled into; regular (a tablet), in a sidebar beside the stack.
// A component's page may push pages of its own (see `usePush`).

/** Every page, by key (see `SinkPages`). */
const pages: SinkPages = {
  ...actionsPages,
  ...choicesPages,
  ...contentPages,
  ...foundationsPages,
  ...presentationPages,
  ...structurePages,
  ...viewportPages,
  ...statusPages,
};

const title = 'Kitchen Sink';

/** The components with a page, by category (the catalog's order). */
const sections = (Object.keys(categories) as Category[])
  .map(
    (category) =>
      [
        category,
        catalog.filter(
          (entry) => entry.category === category && entry.id in pages,
        ),
      ] as const,
  )
  .filter(([, entries]) => entries.length > 0);

const firstId = sections[0]?.[1][0]?.id ?? '';

/**
 * Whether it runs as an app of its own (added to the Home Screen, or
 * installed): no documentation around it to go back to.
 */
const isStandalone = () =>
  matchMedia('(display-mode: standalone)').matches ||
  (navigator as { standalone?: boolean }).standalone === true;

/**
 * Back to the documentation's start page: the whole window's (the kitchen
 * sink may be shown in a frame, e.g. a device's on the docs' pages). Not
 * as an app of its own (see `isStandalone`).
 */
const DocsSection: FunctionComponent = () =>
  isStandalone() ? null : (
    <List.Section>
      <List.Group>
        <List.Item>
          <List.Leading>
            <List.Image variant="symbol">
              <Symbol icon={sfArrowBackward} />
            </List.Image>
          </List.Leading>
          <List.Content>
            <List.Title
              render={
                <a
                  href={publicUrl('')}
                  target="_top"
                />
              }
            >
              Back to Documentation
            </List.Title>
          </List.Content>
        </List.Item>
      </List.Group>
    </List.Section>
  );

/** The index (compact: the stack's root page), drilling into a component. */
const Index: FunctionComponent<{ onOpen: (id: string) => void }> = ({
  onOpen,
}) => (
  <List.Root>
    <DocsSection />
    {sections.map(([category, entries]) => (
      <List.Section key={category}>
        <List.Header>
          <List.Title>{categories[category].title}</List.Title>
        </List.Header>
        <List.Group>
          {entries.map((entry) => (
            <List.Item key={entry.id}>
              <List.Content>
                <List.Title
                  render={<button type="button" />}
                  onClick={() => onOpen(entry.id)}
                >
                  {entry.title}
                </List.Title>
              </List.Content>
              <List.Trailing>
                <List.DrillIn />
              </List.Trailing>
            </List.Item>
          ))}
        </List.Group>
      </List.Section>
    ))}
  </List.Root>
);

/** The sidebar (regular): the index, its categories collapsible. */
const Sections: FunctionComponent<{
  onSelect: (id: string) => void;
  selected: string | undefined;
}> = ({ onSelect, selected }) => (
  <Sidebar.Root>
    <List.Root listStyle="sidebar">
      <DocsSection />
      {sections.map(([category, entries]) => (
        <Collapsible.Root
          key={category}
          defaultOpen
          render={<List.Section />}
        >
          <Collapsible.Trigger
            nativeButton={false}
            render={<List.Header prominence="nested" />}
          >
            <List.Title>{categories[category].title}</List.Title>
            <List.Disclosure />
          </Collapsible.Trigger>
          <Collapsible.Panel render={<List.Group />}>
            {entries.map((entry) => (
              <List.Item
                key={entry.id}
                selected={selected === entry.id}
              >
                <List.Content>
                  <List.Title
                    render={<button type="button" />}
                    onClick={() => onSelect(entry.id)}
                  >
                    {entry.title}
                  </List.Title>
                </List.Content>
              </List.Item>
            ))}
          </Collapsible.Panel>
        </Collapsible.Root>
      ))}
    </List.Root>
  </Sidebar.Root>
);

/**
 * A page of the stack: its bar (its back button, unless it's the root; its
 * own items), its large title, its content.
 */
const StackPage: FunctionComponent<{
  back: string | undefined;
  children?: ReactNode;
  pageKey: string;
}> = ({ back, children, pageKey }) => {
  const page = pages[pageKey];
  const pageTitle = page?.title ?? title;
  const Trailing = page?.Trailing;
  const Anchors = page?.Anchors;

  // (Bare: its content its own app, see `isBare`.)
  if (page?.isBare) return <page.Content />;

  return (
    <Header.Root>
      <Viewport.BlockStart
        edgeEffect={page?.edgeEffect}
        edgeTint={page?.edgeTint}
      >
        <Toolbar.Root placement="block-start">
          {back === undefined ? null : (
            <Toolbar.Leading>
              <Navigation.Back
                aria-label={back}
                render={<Toolbar.Button shape="circle" />}
              >
                <Button.Icon>
                  <Symbol icon={sfChevronBackward} />
                </Button.Icon>
              </Navigation.Back>
            </Toolbar.Leading>
          )}
          <Toolbar.Title>
            <span>{pageTitle}</span>
          </Toolbar.Title>
          {Trailing ? <Trailing /> : null}
        </Toolbar.Root>
      </Viewport.BlockStart>
      {Anchors ? <Anchors /> : null}
      {/* (Full bleed: its content filling the screen, under its bar.) */}
      {page?.isFullBleed ? (
        <Page.Root
          fill
          background={page.background}
        >
          <page.Content />
        </Page.Root>
      ) : (
        <Page.Root background={page?.background}>
          <Viewport.Padding
            edge="block-start"
            margin={page?.contentMargin}
          />
          {page?.isLargeTitleHidden ? null : (
            <Header.LargeTitle>
              <span>{pageTitle}</span>
            </Header.LargeTitle>
          )}
          {children ?? (page ? <page.Content /> : null)}
          <Viewport.Padding edge="block-end" />
        </Page.Root>
      )}
    </Header.Root>
  );
};

/** The pages' keys of a stack, and their titles (a page's back label). */
const titleOf = (key: string | undefined) =>
  key === undefined ? undefined : (pages[key]?.title ?? title);

const App: FunctionComponent = () => {
  // iOS: its fields neither zooming the page in, nor shifting it as they're
  // focused (an app's guards, document-wide; see Viewport).
  useInputZoomPrevention();
  useFocusShiftPrevention();
  const isCompact = useSizeClass() === 'compact';
  // Its settings, overriding the system's (set on its Settings page).
  const [settings, setSettings] = useState<Partial<SettingsValues>>({});
  const settingsState = useMemo(
    () => [settings, setSettings] as const,
    [settings],
  );
  // The open component's stack, bottom to top (compact, empty: the index).
  const [stack, setStack] = useState<readonly string[]>([]);
  // (Regular: its layout's root, for the swipe area at the screen's edge.)
  const [layoutRoot, setLayoutRoot] = useState<HTMLDivElement | null>(null);
  // (Regular: a component always open, the first at first.)
  const shown = isCompact || stack.length > 0 ? stack : [firstId];

  const open = (id: string) => setStack([id]);
  const push = (key: string) => setStack([...shown, key]);
  const pop = () => setStack(shown.slice(0, -1));

  // In a browser (not an app of its own), its columns' top inset (see
  // style.css).
  const browserInset = isStandalone()
    ? undefined
    : 'kitchen-sink-browser-inset';

  // (Compact: the index the stack's root.)
  const keys = isCompact ? ['index', ...shown] : shown;
  const stackView = (
    <LayoutRootContext.Provider value={isCompact ? null : layoutRoot}>
      <PushContext.Provider value={push}>
        <PopContext.Provider value={pop}>
          <Navigation.Root onBack={pop}>
            {/* (Not while a page with a stack of its own is on top: its own
            swipe areas, beneath these, take the swipes.) */}
            {pages[keys.at(-1) ?? '']?.hasOwnStack ? null : <SinkSwipeAreas />}
            <Navigation.Stack>
              {/* Each page a navigation page: instant ones (see `isInstant`)
              shown at once, not slid in or out. */}
              {keys.map((key, index) => (
                <Navigation.Page
                  key={key}
                  instant={pages[key]?.isInstant}
                >
                  {key === 'index' ? (
                    <StackPage
                      back={undefined}
                      pageKey={key}
                    >
                      <Index onOpen={open} />
                    </StackPage>
                  ) : (
                    <StackPage
                      back={titleOf(keys[index - 1])}
                      pageKey={key}
                    />
                  )}
                </Navigation.Page>
              ))}
            </Navigation.Stack>
          </Navigation.Root>
        </PopContext.Provider>
      </PushContext.Provider>
    </LayoutRootContext.Provider>
  );

  return (
    <SinkSettingsContext.Provider value={settingsState}>
      <Settings.Provider {...settings}>
        <Viewport.Provider>
          <Viewport.Content>
            {isCompact ? (
              stackView
            ) : (
              <Layout.Root ref={setLayoutRoot}>
                <Layout.Column
                  floating
                  aria-label="Components"
                  className={browserInset}
                  defaultSize={300}
                >
                  <Sections
                    selected={shown[0]}
                    onSelect={open}
                  />
                </Layout.Column>
                <Layout.Column
                  clearFloating
                  className={browserInset}
                >
                  {stackView}
                </Layout.Column>
              </Layout.Root>
            )}
          </Viewport.Content>
        </Viewport.Provider>
      </Settings.Provider>
    </SinkSettingsContext.Provider>
  );
};

/** `/kitchen-sink`: the app, the page's own (see `useRawDocument`). */
export const KitchenSinkPage: FunctionComponent = () => {
  useRawDocument(true, title);

  return (
    <ClientOnly>
      <App />
    </ClientOnly>
  );
};
