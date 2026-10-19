import { ErrorBoundary, LocationProvider, Route, Router } from 'preact-iso';
import { FunctionComponent } from 'react';

import * as components from '../components/index.js';
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
import { OptionsProvider, useOptions } from './utils/options-context.js';

// (Named for the code shown, see `renderCode`.)
nameComponents(components);

// The forced color scheme (demo option), as the library's `Styles` does.
const ColorScheme: FunctionComponent = () => {
  useColorScheme(useOptions().colorScheme);

  return null;
};

// Pressed states on touch (iOS Safari), as the library's `Styles` does.
const TouchActive: FunctionComponent = () => {
  useTouchActive();

  return null;
};

export const Demo: FunctionComponent = () => (
  <LocationProvider scope={publicPath === '/' ? undefined : publicPath}>
    <OptionsProvider>
      <ErrorBoundary>
        <ColorScheme />
        <TouchActive />
        <Router>
          <Route
            component={IndexPage}
            path="/"
          />
          <Route
            component={AllDemosPage}
            path="/all"
          />
          <Route
            component={HigGuidePage}
            path="/hig-guide"
          />
          <Route
            component={OverviewPage}
            path="/:id"
          />
          <Route
            component={PartsPage}
            path="/:id/parts"
          />
          <Route
            component={CompositionPage}
            path="/:id/composition"
          />
          <Route
            component={InformationArchitecturePage}
            path="/:id/information-architecture"
          />
          <Route
            component={ComponentDemosPage}
            path="/:id/all"
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
