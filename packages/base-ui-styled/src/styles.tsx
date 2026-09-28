import { createGlobalStyles as createGlobalStyle } from 'goober/global';
import { FunctionComponent } from 'preact';

import { css } from './components/utils.js';

export const styles = css`
  :root {
    /* Base brand color (overridable) */
    --color-brand-primary: #007aff;

    /* iOS primary */
    --color-ios-primary: var(--k-color-primary, #007aff);
    --color-ios-primary-tint: #3395ff;
    --color-ios-primary-shade: #0062cc;

    /* iOS surfaces */
    --color-ios-light-surface: #efeff4;
    --color-ios-light-surface-1: #fff;
    --color-ios-light-surface-2: #f7f7f8;
    --color-ios-dark-surface: #000;
    --color-ios-dark-surface-1: #1c1c1d;
    --color-ios-dark-surface-2: #121212;

    /* Material light */
    --color-md-light-primary: #6750a4;
    --color-md-light-on-primary: #fff;
    --color-md-light-secondary-container: #e8def8;
    --color-md-light-on-secondary-container: #1d192b;
    --color-md-light-outline: #79747e;

    /* Material dark */
    --color-md-dark-primary: #d0bcff;
    --color-md-dark-on-primary: #381e72;
    --color-md-dark-secondary-container: #4a4458;
    --color-md-dark-on-secondary-container: #e8def8;
    --color-md-dark-outline: #938f99;

    /* Fonts */
    --font-ios: -apple-system, blinkmacsystemfont, 'Segoe UI', sans-serif;
    --font-material: 'Roboto', 'Segoe UI', sans-serif;

    /* Transitions */
    --transition-transform-opacity: transform 0.3s, opacity 0.3s;
    --ease-material-in: cubic-bezier(0.4, 0, 0.2, 1);

    &[dark] {
      --color-ios-primary: var(--k-color-primary, #0a84ff);
      --color-ios-primary-tint: #409cff;
      --color-ios-primary-shade: #0062cc;
      --color-ios-light-surface: #000;
      --color-ios-light-surface-1: #1c1c1d;
      --color-ios-light-surface-2: #121212;
      --color-md-light-primary: var(--color-md-dark-primary);
      --color-md-light-on-primary: var(--color-md-dark-on-primary);
      --color-md-light-secondary-container: var(
        --color-md-dark-secondary-container
      );
      --color-md-light-on-secondary-container: var(
        --color-md-dark-on-secondary-container
      );
      --color-md-light-outline: var(--color-md-dark-outline);
    }
  }
`;

export const Styles = createGlobalStyle(styles) as unknown as FunctionComponent;
