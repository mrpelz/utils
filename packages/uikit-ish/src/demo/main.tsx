import { ErrorBoundary, LocationProvider, Route, Router } from 'preact-iso';
import { FunctionComponent, useMemo } from 'react';

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

export const Demo: FunctionComponent = () => (
  <LocationProvider>
    <OptionsProvider>
      <ErrorBoundary>
        <ColorScheme />
        <TouchActive />
        <Router>
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
