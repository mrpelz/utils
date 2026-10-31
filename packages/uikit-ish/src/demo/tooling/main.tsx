import { Collapsible } from '@base-ui/react/collapsible';
import { RadioGroup } from '@base-ui/react/radio-group';
import { ErrorBoundary, LocationProvider, Route, Router } from 'preact-iso';
import { FunctionComponent, useMemo } from 'react';

import * as components from '../../components/index.js';
import { useTouchActive } from '../../styles.js';
import { HigGuidePage } from '../docs/hig-guide/main.js';
import { KitchenSinkPage } from '../kitchen-sink/main.js';
import { publicPath } from './env.js';
import { nameComponents } from './frame/render-code.js';
import { OptionsProvider } from './frame/state.js';
import {
  AllDemosPage,
  ComponentDemosPage,
  CompositionPage,
  IndexPage,
  InformationArchitecturePage,
  NotFound,
  OverviewPage,
  PartsPage,
} from './guide/pages.js';
import { startClock } from './shared/clock.js';
import { startStatusBarTaps } from './shared/status-bar.js';

// (Named for the code shown, see `renderCode`: the library's components,
// then Base UI's used in demos as they are.)
nameComponents(components);
nameComponents({ Collapsible, RadioGroup });

startClock();
startStatusBarTaps();

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

// Content above the anchor may still grow as it's scrolled to (e.g. the
// guide's diagrams, rendered on the client): the scroll is aimed at it again
// on every resize, until the person scrolls themselves (or for a while).

const settling = 3000;
const userScroll = ['keydown', 'pointerdown', 'touchstart', 'wheel'] as const;

let stopFollowing: (() => void) | undefined;

const scrollToAnchor = () => {
  stopFollowing?.();

  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;

  const target = document.querySelector(`#${CSS.escape(id)}`);
  if (!target) return;

  const scroll = () => target.scrollIntoView({ behavior: 'smooth' });
  scroll();

  const observer = new ResizeObserver(scroll);
  observer.observe(document.documentElement);

  let timeout: ReturnType<typeof setTimeout> | undefined;
  const stop = () => {
    observer.disconnect();
    clearTimeout(timeout);
    for (const type of userScroll) removeEventListener(type, stop);
    stopFollowing = undefined;
  };
  timeout = setTimeout(stop, settling);
  for (const type of userScroll) {
    addEventListener(type, stop, { passive: true });
  }

  stopFollowing = stop;
};

// An anchor link to another page was followed (until it's rendered).
let isAnchorFollowed = false;

if (typeof addEventListener === 'function') {
  addEventListener('click', (event) => {
    const link = event
      .composedPath()
      .find((target) => target instanceof HTMLAnchorElement);

    if (!link?.hash || link.origin !== location.origin) return;

    const { pathname } = location;
    isAnchorFollowed = link.pathname !== pathname;

    // (After the router's own handler, whether it took the link over.)
    setTimeout(() => {
      if (event.defaultPrevented && link.pathname === pathname) {
        scrollToAnchor();
      }
    });
  });
}

const onRouteChange = () => {
  if (!isAnchorFollowed) return;
  isAnchorFollowed = false;

  scrollToAnchor();
};

export const Demo: FunctionComponent = () => (
  <LocationProvider>
    <OptionsProvider>
      <ErrorBoundary>
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
            component={KitchenSinkPage}
            path={usePath('/kitchen-sink')}
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
