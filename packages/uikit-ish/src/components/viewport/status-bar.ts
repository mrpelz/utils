import { useEffect, useLayoutEffect, useRef } from 'react';

// Status bar taps (iOS, a Home Screen app). The page gets no touch in the
// status bar: tapped, iOS scrolls the document to its top itself, and
// nothing else. An app laid out in layers (see `Provider`: its content
// scrolling, its document not) has nothing there to scroll. So, while
// tracked: its document 1px taller than the screen (see style.css:
// `data-uikit-viewport-status-bar`), scrolled to 1px (parked); scrolled to
// its top without a finger down, that's a tap (passed on), parked again.
// Any other scroll of it (e.g. a drag reaching it): parked again, at rest.
// Not outside a Home Screen app (in Safari, a document's scroll moves its
// toolbars); not for an app whose document scrolls itself (iOS's tap works
// there as it is; parked, it'd be held at 1px: see `Provider`, which
// doesn't then). (Not judged by the document's height: in a Home Screen
// app, iOS's layout viewport may be short by the status bar's height,
// WebKit bug 301108, its range then more than its 1px all the same.) A modal's scroll lock
// (Base UI's, on the document) undone meanwhile (see style.css): else no
// 1px for iOS to scroll.
// (A touch's end caught on what it touched, too: removed meanwhile, e.g. a
// page's back button, its page gone, its end doesn't reach the window, and
// a finger would count down still, every scroll ignored.)

/** The document's marker while tracked (see style.css). */
const statusBarAttribute = 'data-uikit-viewport-status-bar';

const listeners = new Set<(event: Event) => void>();
let stop: (() => void) | undefined;

/** Whether this is an iOS Home Screen app (see above). */
const isHomeScreenApp = () =>
  typeof navigator !== 'undefined' &&
  (navigator as { standalone?: boolean }).standalone === true;

/** Parked: scrolled to its 1px (see above). */
const park = () => scrollTo({ behavior: 'instant', top: 1 });

const start = () => {
  const root = document.documentElement;
  root.setAttribute(statusBarAttribute, '');
  let touches = 0;
  const onTouch = (event: TouchEvent) => {
    touches = event.touches.length;
    if (touches === 0 && Math.round(scrollY) !== 1) park();
  };
  const onTouchStart = (event: TouchEvent) => {
    onTouch(event);
    const { target } = event;
    if (!target) return;
    const onEnd = (end: Event) => {
      target.removeEventListener('touchend', onEnd);
      target.removeEventListener('touchcancel', onEnd);
      if (end instanceof TouchEvent) onTouch(end);
    };
    target.addEventListener('touchend', onEnd);
    target.addEventListener('touchcancel', onEnd);
  };
  const onScroll = (event: Event) => {
    if (touches > 0) return;
    if (scrollY < 0.5) {
      for (const listener of listeners) listener(event);
      park();
    } else if (scrollY > 1.5) {
      park();
    }
  };
  // (Once laid out 1px taller.)
  const frame = requestAnimationFrame(park);
  const options = { capture: true, passive: true };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('touchstart', onTouchStart, options);
  addEventListener('touchend', onTouch, options);
  addEventListener('touchcancel', onTouch, options);
  return () => {
    cancelAnimationFrame(frame);
    removeEventListener('scroll', onScroll);
    removeEventListener('touchstart', onTouchStart, { capture: true });
    removeEventListener('touchend', onTouch, { capture: true });
    removeEventListener('touchcancel', onTouch, { capture: true });
    root.removeAttribute(statusBarAttribute);
    if (Math.round(scrollY) === 1) scrollTo({ behavior: 'instant', top: 0 });
  };
};

/**
 * Calls `onTap` as the status bar is tapped (see above: iOS, a Home Screen
 * app; elsewhere, never; not for an app whose document scrolls itself),
 * until the returned function. Several at once share it (each called).
 */
export const trackStatusBarTaps = (
  onTap: (event: Event) => void,
): (() => void) => {
  if (!isHomeScreenApp()) return () => undefined;
  listeners.add(onTap);
  stop ??= start();
  return () => {
    listeners.delete(onTap);
    if (listeners.size > 0) return;
    stop?.();
    stop = undefined;
  };
};

/** `trackStatusBarTaps`, while mounted (and `enabled`): its latest `onTap`. */
export const useStatusBarTaps = (
  onTap: (event: Event) => void,
  enabled = true,
): void => {
  const latest = useRef(onTap);
  useLayoutEffect(() => {
    latest.current = onTap;
  });
  useEffect(
    () =>
      enabled
        ? trackStatusBarTaps((event) => latest.current(event))
        : undefined,
    [enabled],
  );
};
