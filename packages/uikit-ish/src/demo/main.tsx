import { ErrorBoundary, LocationProvider, Route, Router } from 'preact-iso';
import { FunctionComponent, useMemo } from 'react';

import * as components from '../components/index.js';
import { ColorScheme as TColorScheme } from '../components/utils/main.js';
import { useColorScheme, useTouchActive } from '../styles.js';
import { publicPath } from './env.js';
import { HigGuidePage } from './hig-guide/main.js';
import {
  AllDemosPage,
  ComponentDemosPage,
  CompositionPage,
  IndexPage,
  InformationArchitecturePage,
  NotFound,
  OverviewPage,
  PartsPage,
} from './pages.js';
import { nameComponents } from './utils/code.js';
import { OptionsProvider } from './utils/options-context.js';
import { useLocalStorage } from './utils/use-local-storage.js';

// (Named for the code shown, see `renderCode`.)
nameComponents(components);

// The forced color scheme (demo option), as the library's `Styles` does.
const ColorScheme: FunctionComponent = () => {
  const [colorScheme] = useLocalStorage<TColorScheme | undefined>(
    'colorScheme',
    undefined,
  );

  useColorScheme(colorScheme);

  return null;
};

// Pressed states on touch (iOS Safari), as the library's `Styles` does.
const TouchActive: FunctionComponent = () => {
  useTouchActive();

  return null;
};

const usePath = (input: string) =>
  useMemo(
    () =>
      publicPath === '/'
        ? input
        : `/${[publicPath.split('/'), input.split('/')]
            .flat()
            .filter((segment) => segment.length)
            .join('/')}`,
    [input],
  );

// Anchor links (`list/parts#list-root`, `hig-guide#rule-g7`): the router
// takes them over (not starting with `#`, because of the document's base) and
// scrolls to the top on another page, not to their anchor; so the anchor's
// element is scrolled to after it: on another page once it's rendered (the
// router's `onRouteChange`), on the same page once the router pushed it.
// Back and forward are left to the browser's scroll restoration.

const scrollToAnchor = () => {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;

  document
    .querySelector(`#${CSS.escape(id)}`)
    ?.scrollIntoView({ behavior: 'smooth' });
};

// An anchor link to another page was followed (until it's rendered).
let anchorFollowed = false;

if (typeof addEventListener === 'function') {
  addEventListener('click', (event) => {
    const link = event
      .composedPath()
      .find((target) => target instanceof HTMLAnchorElement);

    if (!link?.hash || link.origin !== location.origin) return;

    const { pathname } = location;
    anchorFollowed = link.pathname !== pathname;

    // (After the router's own handler, whether it took the link over.)
    setTimeout(() => {
      if (event.defaultPrevented && link.pathname === pathname) {
        scrollToAnchor();
      }
    });
  });
}

const onRouteChange = () => {
  if (!anchorFollowed) return;
  anchorFollowed = false;

  scrollToAnchor();
};

export const Demo: FunctionComponent = () => (
  <LocationProvider>
    <OptionsProvider>
      <ErrorBoundary>
        <ColorScheme />
        <TouchActive />
        <Router onRouteChange={onRouteChange}>
          <Route
            component={IndexPage}
            path={usePath('/')}
          />
          <Route
            component={AllDemosPage}
            path={usePath('/all')}
          />
          <Route
            component={HigGuidePage}
            path={usePath('/hig-guide')}
          />
          <Route
            component={OverviewPage}
            path={usePath('/:id')}
          />
          <Route
            component={PartsPage}
            path={usePath('/:id/parts')}
          />
          <Route
            component={CompositionPage}
            path={usePath('/:id/composition')}
          />
          <Route
            component={InformationArchitecturePage}
            path={usePath('/:id/information-architecture')}
          />
          <Route
            component={ComponentDemosPage}
            path={usePath('/:id/all')}
          />
          <Route
            default
            component={NotFound}
          />
        </Router>
      </ErrorBoundary>
    </OptionsProvider>
  </LocationProvider>
);
