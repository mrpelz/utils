import { createGlobalStyles as createGlobalStyle } from 'goober/global';
import { FunctionComponent } from 'react';

import { styles } from '../../styles.js';

export const DemoStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    -webkit-touch-callout: none;
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -webkit-user-select: none;
    user-select: none;
  }

  :root {
    background-color: light-dark(white, #0a0a0a);
    color: light-dark(black, #fafafa);
    color-scheme: light dark;
    font-family: -apple-system, "SF Pro", system-ui, "SF UI Text", "Helvetica Neue", Helvetica, Arial, sans-serif;
    scroll-snap-type: y mandatory;
  }

  body {
    margin: 0;
  }

  ${styles}
` as unknown as FunctionComponent;
