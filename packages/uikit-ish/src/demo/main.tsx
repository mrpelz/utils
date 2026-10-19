import { ErrorBoundary, LocationProvider, Route, Router } from 'preact-iso';
import { FunctionComponent } from 'react';

import { useColorScheme } from '../styles.js';
import { DemoIndex as RouteIndex } from './index.js';
import { OptionsProvider, useOptions } from './utils/options-context.js';

// The forced color scheme (demo option), as the library's `Styles` does.
const ColorScheme: FunctionComponent = () => {
  useColorScheme(useOptions().colorScheme);

  return null;
};

const Route404: FunctionComponent = () => '404';

export const Demo: FunctionComponent = () => (
  <LocationProvider>
    <OptionsProvider>
      <ErrorBoundary>
        <ColorScheme />
        <Router>
          <Route
            component={RouteIndex}
            path="/"
          />
          <Route
            component={Route404}
            path="/404"
          />
          <Route
            default
            component={Route404}
          ></Route>
        </Router>
      </ErrorBoundary>
    </OptionsProvider>
  </LocationProvider>
);
