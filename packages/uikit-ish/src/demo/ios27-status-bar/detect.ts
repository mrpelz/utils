// iOS 27's status bar (see main.tsx): on iOS 27, a Home Screen app under
// the status bar (`black-translucent`) gets a blur at its top, reaching
// down over its top bar's buttons and title, which no element of the
// page's prevents (see ../ios27-blur). Started below the status bar
// instead (`default`: the system's own opaque bar), nothing of it is under
// the status bar, so nothing of it is blurred. The page's head decides
// (see scripts/demo-head.js: before Safari reads the status bar style, as
// the app is added to the Home Screen), and marks the document
// (`data-ios27`), read here: the app's logic as the head's, e.g. a hard top
// edge effect beneath the system's bar.
// (To move into the library as it is.)

/** The document's mark, set by the head (see scripts/demo-head.js). */
export const ios27Attribute = 'data-ios27';

/**
 * Whether the head found iOS 27 (or later): its status bar style then
 * `default`, the page below the status bar.
 */
export const isIos27 = (): boolean =>
  typeof document !== 'undefined' &&
  document.documentElement.hasAttribute(ios27Attribute);
