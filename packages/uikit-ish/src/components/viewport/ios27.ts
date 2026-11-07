import { createContext } from 'react';

// iOS 27's status bar: on iOS 27, a Home Screen app under the status bar
// (`apple-mobile-web-app-status-bar-style` `black-translucent`) gets a blur
// at its top, reaching down over its top bar's buttons and title, which no
// element of the page's prevents. Started below the status bar instead
// (`default`: the system's own opaque bar, in the page's background color
// as it loaded), nothing of it is under the status bar. The app's head
// decides (an inline script, before Safari reads the meta tag: by Safari's
// version, `Version/27`, the OS's frozen in the user agent since iOS 26),
// setting the style and marking the document (`data-ios27`), read here.
// Marked, a bar at the screen's top defaults to a hard edge effect, beneath
// the system's bar (see `Anchor`), its backing the status bar's color (see
// edge-effect.tsx).

/** The document's mark, set by the app's head (see above). */
export const ios27Attribute = 'data-ios27';

/**
 * Whether the app's head found iOS 27 (or later, see above): its status
 * bar style then `default`, the page below the status bar.
 */
export const isIos27 = (): boolean =>
  typeof document !== 'undefined' &&
  document.documentElement.hasAttribute(ios27Attribute);

/**
 * Within a popup inset from the screen's top (a sheet's, a popover's, an
 * island's): its bars not at the screen's top, under the status bar
 * (internal, see `Anchor`).
 */
export const ViewportInsetContext = createContext(false);
