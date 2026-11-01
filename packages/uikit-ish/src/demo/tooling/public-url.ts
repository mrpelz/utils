import { publicPath } from './env.js';

/**
 * A path on the site (a route's, as written: `list/parts#list-root`; the
 * index's `./`; an asset's, e.g. `assets/icon.svg`) under its public path
 * (the build's prefix, ending in a slash, e.g. GitLab Pages' `/<project>/`;
 * `/` without, see webpack.config.js), as
 * the routes are (see main.tsx's `usePath`): absolute, as the page has no
 * base (its own anchors, `#…`, its own).
 */
export const publicUrl = (pathOnSite: string): string =>
  `${publicPath}${pathOnSite.replace(/^\.?\//u, '')}`;
