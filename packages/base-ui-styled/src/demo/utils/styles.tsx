import { createGlobalStyles as createGlobalStyle } from 'goober/global';
import { FunctionComponent } from 'preact';

import { styles } from '../../styles.js';

export const DemoStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    color-scheme: light;
  }

  :root {
    background-color: white;
    color: black;
    font-family: -apple-system, "SF UI Text", "Helvetica Neue", Helvetica, Arial, sans-serif;
    scroll-snap-type: y mandatory;

    @media (prefers-color-scheme: dark) {
      background-color: #0a0a0a;
      color: #fafafa;
    }
  }

  body {
    margin: 0;
  }

  @media (prefers-color-scheme: dark) {
    * {
      color-scheme: dark;
    }
  }

  ${styles}
` as unknown as FunctionComponent;
