import { RefObject, useLayoutEffect } from 'react';

// The current scroller (see `useCurrentScroller`): what an app scrolls for
// the user (e.g. to its top, as its status bar is tapped). By layers, not
// by what covers the most (see edge.ts, the page a provider tracks):
// - an overlay open (`overlay`: a popover's body, a sheet's content), the
//   one opened last (registered last), as long as it's open;
// - else a content scrolled from its start (`scrolled`: an island's,
//   scrolled into; again at its start, not current), the one registered
//   last;
// - else the page its provider tracks (see `Provider`).
// Only those shown, within the provider's screen (if it has one).

const overlays: Element[] = [];
const scrolled = new Set<Element>();
const listeners = new Set<() => void>();

const notify = () => {
  for (const listener of listeners) listener();
};

const isShown = (element: Element) =>
  element.isConnected && element.checkVisibility({ visibilityProperty: true });

/**
 * The current scroller's layer within `container` (see above), or none
 * (then the page its provider tracks).
 */
export const currentLayer = (
  container: Element | null | undefined,
): Element | undefined => {
  const isIn = (element: Element) =>
    isShown(element) && (!container || container.contains(element));
  return (
    overlays.findLast((element) => isIn(element)) ??
    [...scrolled].findLast((element) => isIn(element))
  );
};

/** Tells `listener` of layers registered, gone, or scrolled from or back. */
export const subscribeCurrent = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/**
 * `ref`'s element a layer of the current scroller's (see above) while
 * mounted (and `isEnabled`): an overlay's (`overlay`), or a content that's
 * current while scrolled from its start (`scrolled`).
 */
export const useCurrentLayer = (
  ref: RefObject<Element | null>,
  kind: 'overlay' | 'scrolled',
  isEnabled = true,
): void => {
  useLayoutEffect(() => {
    const { current: element } = ref;
    if (!element || !isEnabled) return undefined;
    if (kind === 'overlay') {
      overlays.push(element);
      notify();
      return () => {
        overlays.splice(overlays.indexOf(element), 1);
        notify();
      };
    }
    // (Bounced past its start, negative: at it.)
    const update = () => {
      const isScrolled = element.scrollTop > 0;
      if (isScrolled === scrolled.has(element)) return;
      if (isScrolled) scrolled.add(element);
      else scrolled.delete(element);
      notify();
    };
    update();
    element.addEventListener('scroll', update, { passive: true });
    return () => {
      element.removeEventListener('scroll', update);
      if (scrolled.delete(element)) notify();
    };
  }, [isEnabled, kind, ref]);
};
