import { Collapsible } from '@base-ui/react/collapsible';
import { RadioGroup } from '@base-ui/react/radio-group';
import { ErrorBoundary, LocationProvider, Route, Router } from 'preact-iso';
import { FunctionComponent, useEffect } from 'react';

import * as components from '../../components/index.js';
import { useTouchActive } from '../../styles.js';
import { BackstoryAndFaqPage } from '../docs/pages/backstory-and-faq.js';
import { GettingStartedPage } from '../docs/pages/getting-started.js';
import { TokensPage } from '../docs/tokens/main.js';
import { Ios27BlurPage } from '../ios27-blur/main.js';
import { KitchenSinkPage } from '../kitchen-sink/main.js';
import { nameComponents } from './frame/render-code.js';
import { OptionsProvider } from './frame/state.js';
import {
  AllDemosPage,
  ComponentDemosPage,
  CompositionPage,
  IndexPage,
  NotFound,
  OverviewPage,
  PartsPage,
} from './guide/pages.js';
import { publicUrl } from './public-url.js';
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

// Anchors. On this page (`#…`, or a link to this page with one): the
// browser's (scrolled to, in its history, restored on reload), passed over
// by the router (it'd take over any link with a path: its click listener,
// added after this one, stopped). To another page (`list/parts#…`): the
// router's, which scrolls to the top; the anchor scrolled to once the page
// is rendered (its `onRouteChange`). On load (a reload too): the browser's
// own jump, as the page is parsed, finds the anchor only if prerendered (a
// build; not the watch server's page, rendered on the client), so it's
// scrolled to once the app first rendered (its routes not lazy: the page's
// content rendered then), unless the browser scrolled already (to it, or
// back to where it was, restoring). Content growing above it after (e.g.
// the guide's diagrams): kept in place by the browser's scroll anchoring.
// Back and forward: the browser's scroll restoration.

const scrollToAnchor = () => {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;

  document.querySelector(`#${CSS.escape(id)}`)?.scrollIntoView();
};

// A link's target opening it here (none, or `_self`).
const ownTarget = /^(?:_?self)?$/iu;

// A link to another page with an anchor was followed (until it's rendered).
let isAnchorFollowed = false;

if (typeof addEventListener === 'function') {
  addEventListener('click', (event) => {
    // (Clicks the browser handles itself, as the router leaves them.)
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    ) {
      return;
    }

    const link = event
      .composedPath()
      .find((target) => target instanceof HTMLAnchorElement);
    if (
      !link?.hash ||
      link.origin !== location.origin ||
      !ownTarget.test(link.target) ||
      link.hasAttribute('download')
    ) {
      return;
    }

    // (This page's: the browser's.)
    if (
      link.pathname === location.pathname &&
      link.search === location.search
    ) {
      event.stopImmediatePropagation();
      return;
    }

    isAnchorFollowed = true;
  });
}

const onRouteChange = () => {
  if (!isAnchorFollowed) return;
  isAnchorFollowed = false;

  scrollToAnchor();
};

// On load: the URL's anchor, unless the browser scrolled already (see
// above).
const AnchorOnLoad: FunctionComponent = () => {
  useEffect(() => {
    if (scrollY === 0) scrollToAnchor();
  }, []);

  return null;
};

export const Demo: FunctionComponent = () => (
  <LocationProvider>
    <OptionsProvider>
      <ErrorBoundary>
        <TouchActive />
        <AnchorOnLoad />
        <Router onRouteChange={onRouteChange}>
          <Route
            component={IndexPage}
            path={publicUrl('/')}
          />
          <Route
            component={AllDemosPage}
            path={publicUrl('/all')}
          />
          <Route
            component={KitchenSinkPage}
            path={publicUrl('/kitchen-sink')}
          />
          <Route
            component={Ios27BlurPage}
            path={publicUrl('/ios27-blur/:status?/:variant?')}
          />
          <Route
            component={TokensPage}
            path={publicUrl('/tokens')}
          />
          <Route
            component={GettingStartedPage}
            path={publicUrl('/getting-started')}
          />
          <Route
            component={BackstoryAndFaqPage}
            path={publicUrl('/backstory-and-faq')}
          />
          <Route
            component={OverviewPage}
            path={publicUrl('/:id')}
          />
          <Route
            component={PartsPage}
            path={publicUrl('/:id/parts')}
          />
          <Route
            component={CompositionPage}
            path={publicUrl('/:id/composition')}
          />
          <Route
            component={ComponentDemosPage}
            path={publicUrl('/:id/all')}
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
