import { RefObject, useLayoutEffect } from 'react';

// Scrollers, and what sticks to their edges' bars. Pages scroll on their
// own (`Page.Root`, a sheet's content, the content layer), each registering
// itself: a provider without a `scroller` tracks the one filling its screen
// (see `scrollerUnder`), again as scrollers are registered, resized, shown
// or hidden (e.g. a tab's page shown). Each draws its edges' scroll edge
// effects itself (see `EdgeEffects`), reaching under the edge elements
// stuck to its bars (e.g. a header's accessory).

type BlockEdge = 'block-start' | 'block-end';

const scrollers = new Set<Element>();
/** Who's told of scrollers registered, resized, shown or hidden. */
const scrollerListeners = new Set<() => void>();

const edgeElements = new Map<HTMLElement, BlockEdge>();
/** Who's told of edge elements registered, or resized. */
const edgeElementListeners = new Set<() => void>();

let frame = 0;
let resizeObserver: ResizeObserver | undefined;
let intersectionObserver: IntersectionObserver | undefined;

const isShown = (element: Element) =>
  element.checkVisibility({ visibilityProperty: true });

const rectOf = (element: Element) =>
  element === document.scrollingElement
    ? new DOMRect(0, 0, innerWidth, innerHeight)
    : element.getBoundingClientRect();

const overlap = (a: DOMRect, b: DOMRect) =>
  Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) *
  Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));

/**
 * The shown scroller filling `rect` (within `container`, if given): of
 * nested ones, the innermost (what scrolls there); of others, the one
 * overlapping it most.
 */
export const scrollerUnder = (
  rect: DOMRect,
  container?: Element | null,
): Element | undefined => {
  let best: Element | undefined;
  let bestArea = 0;
  for (const scroller of scrollers) {
    if (!scroller.isConnected || !isShown(scroller)) continue;
    if (container && !container.contains(scroller)) continue;
    const area = overlap(rect, rectOf(scroller));
    if (area <= 0) continue;
    const isBetter =
      !best ||
      best.contains(scroller) ||
      (!scroller.contains(best) && area > bestArea);
    if (!isBetter) continue;
    best = scroller;
    bestArea = area;
  }
  return best;
};

const notify = () => {
  if (frame !== 0) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    for (const listener of scrollerListeners) listener();
  });
};

/** Observing while scrollers are registered; let go of with the last. */
const observe = () => {
  if (resizeObserver) return;
  resizeObserver = new ResizeObserver(notify);
  intersectionObserver = new IntersectionObserver(notify, {
    threshold: [0, 0.5, 1],
  });
  addEventListener('resize', notify);
};

const release = () => {
  if (scrollers.size > 0) return;
  resizeObserver?.disconnect();
  intersectionObserver?.disconnect();
  resizeObserver = undefined;
  intersectionObserver = undefined;
  removeEventListener('resize', notify);
  cancelAnimationFrame(frame);
  frame = 0;
};

/** Registers a scroller (see above), until the returned function. */
export const registerScroller = (element: Element): (() => void) => {
  observe();
  scrollers.add(element);
  resizeObserver?.observe(element);
  intersectionObserver?.observe(element);
  notify();
  return () => {
    scrollers.delete(element);
    resizeObserver?.unobserve(element);
    intersectionObserver?.unobserve(element);
    notify();
    release();
  };
};

/** A scroller (see above), registered while mounted. */
export const useScrollerRegistration = (
  ref: RefObject<Element | null>,
): void => {
  useLayoutEffect(() => {
    const { current: element } = ref;
    return element ? registerScroller(element) : undefined;
  }, [ref]);
};

/**
 * Tells `listener` of scrollers registered, resized, shown or hidden (e.g.
 * for a provider to track the one filling its screen), until the returned
 * function.
 */
export const subscribeScrollers = (listener: () => void): (() => void) => {
  scrollerListeners.add(listener);
  return () => {
    scrollerListeners.delete(listener);
  };
};

/**
 * Whether a registered scroller is within `scroller` (e.g. a page within
 * the content layer: it draws the edge effects, see `EdgeEffects`).
 */
export const holdsScroller = (scroller: Element): boolean =>
  [...scrollers].some(
    (element) => element !== scroller && scroller.contains(element),
  );

/** The edge elements at `edge` within `scroller` (shown). */
export const edgeElementsIn = (
  scroller: Element,
  edge: BlockEdge,
): HTMLElement[] =>
  [...edgeElements]
    .filter(
      ([element, elementEdge]) =>
        elementEdge === edge && scroller.contains(element) && isShown(element),
    )
    .map(([element]) => element);

/**
 * Tells `listener` of edge elements registered, or resized, until the
 * returned function.
 */
export const subscribeEdgeElements = (listener: () => void): (() => void) => {
  edgeElementListeners.add(listener);
  return () => {
    edgeElementListeners.delete(listener);
  };
};

const edgeElementsChanged = () => {
  for (const listener of edgeElementListeners) listener();
};

/**
 * Something sticking to an edge's bar (e.g. a header's accessory, stuck
 * below it): while it's stuck, the edge's effect reaches beyond the bar to
 * cover it too (see `EdgeEffects`). Registered while mounted; at the block
 * start or end.
 */
export const useViewportEdgeElement = (
  ref: RefObject<HTMLElement | null>,
  edge: BlockEdge,
): void => {
  useLayoutEffect(() => {
    const { current: element } = ref;
    if (!element) return undefined;
    edgeElements.set(element, edge);
    const observer = new ResizeObserver(edgeElementsChanged);
    observer.observe(element);
    edgeElementsChanged();
    return () => {
      observer.disconnect();
      edgeElements.delete(element);
      edgeElementsChanged();
    };
  }, [edge, ref]);
};
