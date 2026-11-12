/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */

// The demo's page head (see webpack.config.js): its icons and web app
// manifest (src/demo/assets: icon.svg, its variants made by scripts/icons.js,
// copied by `output.copy`), as a Home Screen app too.

import { splashes } from './icons-devices.js';

/**
 * Its assets' URL (under the site's public path, ending in a slash, as the
 * page has no base: see src/demo/tooling/public-url.ts).
 *
 * @param {string} publicPath
 */
const assetsUrl = (publicPath) => `${publicPath}assets/`;

/**
 * Its meta tags (HtmlWebpackPlugin's `meta`): the page under the device's
 * safe area insets (the notch, the home indicator: in
 * `env(safe-area-inset-*)`, kept clear by the library, see styles.css, and
 * the guide's layout); a Home Screen app, its status bar over the page; the
 * browser's chrome in the system background.
 */
export const meta = {
  'apple-mobile-web-app-status-bar-style': 'black-translucent',
  'apple-mobile-web-app-title': 'uikit-ish',
  'mobile-web-app-capable': 'yes',
  'theme-color-dark': {
    content: '#000000',
    media: '(prefers-color-scheme: dark)',
    name: 'theme-color',
  },
  'theme-color-light': {
    content: '#FFFFFF',
    media: '(prefers-color-scheme: light)',
    name: 'theme-color',
  },
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
};

/**
 * Its status bar on iOS 27 (or later, see src/components/viewport/ios27.ts
 * and the guide's iOS 27 page): `default`, the page below the status bar
 * (under it, iOS 27 blurs the top bar), the document marked
 * (`data-ios27`, for the library). Its web app manifest, unless it shows
 * an app of its own: a demo raw
 * (`#id=…&raw=true` on a demos' page, see
 * src/demo/tooling/frame/component.tsx), or the kitchen sink
 * (`/kitchen-sink`, see src/demo/kitchen-sink/main.tsx). Added to the
 * Home Screen, that's its own app (no manifest: its start the current URL,
 * not the demo's start page; its name the demo's id, or the kitchen
 * sink's title), as Safari reads the
 * head once, as the page loads. (A script, run as the head's parsed: before
 * Safari reads it.)
 *
 * @param {string} publicPath
 * @returns {string}
 */
export const manifest = (publicPath) => `<script>(() => {
  // (iOS 27 or later: by Safari's version, the OS's frozen in the user agent
  // since iOS 26; an iPad's as a Mac's, with touch.)
  const agent = navigator.userAgent;
  const isIos =
    ['iPhone', 'iPad', 'iPod'].some((device) => agent.includes(device)) ||
    (agent.includes('Macintosh') && navigator.maxTouchPoints > 1);
  const version = Number(agent.split('Version/')[1]?.split('.')[0]);
  if (isIos && version >= 27) {
    document.documentElement.setAttribute('data-ios27', '');
    document
      .querySelector('meta[name=apple-mobile-web-app-status-bar-style]')
      ?.setAttribute('content', 'default');
  }
  const fragment = new URLSearchParams(location.hash.slice(1));
  const option = (key) => {
    try {
      return JSON.parse(fragment.get(key) ?? 'null');
    } catch {
      return null;
    }
  };
  const isAt = (path) =>
    [path, path + '/'].some((end) => location.pathname.endsWith(end));
  const id = option('id');
  const name =
    option('raw') === true && typeof id === 'string' && isAt('/all')
      ? id
      : isAt('/kitchen-sink')
        ? 'Kitchen Sink'
        : undefined;
  if (name !== undefined) {
    document.title = name;
    document
      .querySelector('meta[name=apple-mobile-web-app-title]')
      ?.setAttribute('content', name);
    return;
  }
  const link = document.createElement('link');
  link.rel = 'manifest';
  link.href = '${assetsUrl(publicPath)}manifest.webmanifest';
  document.head.append(link);
})();</script>`;

/**
 * Its links: the icons, the splash screens.
 *
 * @param {string} publicPath
 * @returns {string}
 */
export const links = (publicPath) => {
  const assets = assetsUrl(publicPath);

  return [
    `<link rel="icon" type="image/svg+xml" href="${assets}icon-rounded.svg">`,
    `<link rel="icon" type="image/png" sizes="196x196" href="${assets}favicon-196.png">`,
    `<link rel="apple-touch-icon" href="${assets}apple-icon-180.png">`,
    ...splashes().map(
      ({ file, media }) =>
        `<link rel="apple-touch-startup-image" href="${assets}${file}" media="${media}">`,
    ),
  ].join('');
};
