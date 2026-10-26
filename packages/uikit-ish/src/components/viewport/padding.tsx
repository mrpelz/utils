import {
  createContext,
  forwardRef,
  RefObject,
  useContext,
  useLayoutEffect,
  useState,
  useSyncExternalStore,
} from 'react';

import {
  cn,
  PortalContainerContext,
  useForwardedRef,
  withStyle,
} from '../utils/main.js';
import type { ViewportEdge, ViewportPaddingProps } from './props.js';

// Padding for the anchors (see `Padding`): the content layer (or a page in
// it) scrolls under the anchors floating over it, so its content needs room
// at its ends to scroll out from under them, and the content margin beyond
// (the gap between content and its container's edge: the library's, not
// the content's own, so components never space themselves). Anchors measure their size
// (their content's: without the safe area insets they keep clear, which
// scrollers keep clear themselves) and register it in their scope: where
// they're fixed to, the screen (the window, or a device's frame: the
// provided portal container), or an element containing fixed layers (a
// `Layout.Column`, a sheet's or drawer's popup: see `ViewportScopeContext`).
// A `Padding` in the same scope is as high as the tallest anchor at its
// edge, or the tallest of the anchors linked to it by their handles (one or
// more), live (e.g. a tab bar collapsing).

/**
 * An anchor, by a handle (`Viewport.createAnchorHandle`, in a component
 * `useCreateViewportAnchorHandle`): given to it (`handle`), and to the
 * paddings (`anchor`, alone or among others) following it.
 */
export class ViewportAnchorHandle {}

/** A handle to link paddings to an anchor, made once (see above). */
export const createAnchorHandle = (): ViewportAnchorHandle =>
  new ViewportAnchorHandle();

/** `Viewport.createAnchorHandle`, in a component: made once, for its lifetime. */
export const useCreateViewportAnchorHandle = (): ViewportAnchorHandle => {
  const [handle] = useState(createAnchorHandle);

  return handle;
};

/**
 * Where anchors are fixed to (their containing block's element, or a key
 * standing for it), for what's within: e.g. a `Layout.Column`, a sheet's
 * popup. Unset: the provided portal container (a device's frame), or the
 * window.
 */
export const ViewportScopeContext = createContext<object | undefined>(
  undefined,
);

type Entry = {
  edge: ViewportEdge;
  handle: ViewportAnchorHandle | undefined;
  size: number;
};

/** A scope's anchors, and who's told of their changes. */
const createStore = () => {
  const entries = new Set<Entry>();
  const listeners = new Set<() => void>();
  const notify = () => {
    for (const listener of listeners) listener();
  };

  return {
    add: (entry: Entry) => {
      entries.add(entry);
      notify();
      return () => {
        entries.delete(entry);
        notify();
      };
    },
    notify,
    /** The tallest anchor's size: at an edge, or linked by the handles. */
    size: (
      edge: ViewportEdge,
      handles: readonly ViewportAnchorHandle[] | undefined,
    ): number => {
      let size = 0;
      for (const entry of entries) {
        const isMatch = handles
          ? entry.handle !== undefined && handles.includes(entry.handle)
          : entry.edge === edge;
        if (isMatch) size = Math.max(size, entry.size);
      }
      return size;
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
};

type Store = ReturnType<typeof createStore>;

const stores = new WeakMap<object, Store>();
const windowScope = {};

/** The store of the scope it's in (see `ViewportScopeContext`). */
const useStore = (): Store => {
  const scope = useContext(ViewportScopeContext);
  const portalContainer = useContext(PortalContainerContext);
  const key = scope ?? portalContainer ?? windowScope;
  let store = stores.get(key);
  if (!store) {
    store = createStore();
    stores.set(key, store);
  }
  return store;
};

/**
 * An anchor's size (its content box's, along its edge's axis), registered
 * in its scope while it's mounted (see above).
 */
export const useAnchorRegistration = (
  ref: RefObject<HTMLElement | null>,
  edge: ViewportEdge,
  handle: ViewportAnchorHandle | undefined,
): void => {
  const store = useStore();

  useLayoutEffect(() => {
    const { current: element } = ref;
    if (!element) return undefined;
    const isBlock = edge === 'block-start' || edge === 'block-end';
    const entry: Entry = { edge, handle, size: 0 };
    const remove = store.add(entry);

    const observer = new ResizeObserver(([record]) => {
      const box = record?.contentBoxSize[0];
      const size = Math.round(
        (isBlock ? box?.blockSize : box?.inlineSize) ?? 0,
      );
      if (size === entry.size) return;
      entry.size = size;
      store.notify();
    });
    observer.observe(element);

    return () => {
      observer.disconnect();
      remove();
    };
  }, [edge, handle, ref, store]);
};

/**
 * The size (px) of the tallest anchor at an edge in its scope, or of the
 * tallest of those linked by the handles (one, or several); 0 without one,
 * and for none (`null`: no anchors followed, e.g. a padding's margin alone).
 */
export const useAnchorSize = (
  edge: ViewportEdge,
  handle?: ViewportAnchorHandle | readonly ViewportAnchorHandle[] | null,
): number => {
  const store = useStore();
  const handles: readonly ViewportAnchorHandle[] | undefined =
    handle === undefined
      ? undefined
      : ([] as readonly ViewportAnchorHandle[]).concat(handle ?? []);

  return useSyncExternalStore(
    store.subscribe,
    () => store.size(edge, handles),
    () => 0,
  );
};

/**
 * The scroll container a padding is in: its nearest ancestor scrolling
 * along its edge's axis (or the document's).
 */
const scrollerOf = (element: HTMLElement, edge: ViewportEdge): HTMLElement => {
  const isBlock = edge === 'block-start' || edge === 'block-end';
  for (
    let parent = element.parentElement;
    parent && parent !== document.body;
    parent = parent.parentElement
  ) {
    const { overflowX, overflowY } = getComputedStyle(parent);
    const overflow = isBlock ? overflowY : overflowX;
    if (overflow === 'auto' || overflow === 'scroll') return parent;
  }
  return document.documentElement;
};

/**
 * Its scroll container's scroll padding at its edge: its own padding there
 * (the safe area it keeps clear) and the padding's height, so focus moving
 * and `scrollIntoView` stop clear of the anchors, not behind them; while
 * mounted.
 */
const useScrollPadding = (
  ref: RefObject<HTMLElement | null>,
  edge: ViewportEdge,
): void => {
  useLayoutEffect(() => {
    const { current: element } = ref;
    if (!element) return undefined;
    const scroller = scrollerOf(element, edge);
    const property = `scroll-padding-${edge}`;
    const paddingProperty = `padding-${edge}`;
    let value = '';

    const update = () => {
      const inset =
        Number.parseFloat(
          getComputedStyle(scroller).getPropertyValue(paddingProperty),
        ) || 0;
      value = `${String(Math.round(inset + element.offsetHeight))}px`;
      scroller.style.setProperty(property, value);
    };
    // (Its height changing, or the scroller's padding: e.g. the keyboard.)
    const observer = new ResizeObserver(update);
    observer.observe(element);
    observer.observe(scroller);

    return () => {
      observer.disconnect();
      if (scroller.style.getPropertyValue(property) === value) {
        scroller.style.removeProperty(property);
      }
    };
  }, [edge, ref]);
};

/**
 * A scroll container's content edge (e.g. at a page's start, below its bar;
 * at its end, above a tab bar): room for the anchors there, as high as the
 * tallest of them in its scope (`edge`), or of the anchors linked to it
 * (`anchor`: their handles, one or several), live; and the content margin
 * beyond them (the library's gap, see style.css; `margin` overrides it).
 * Following none (`anchor={null}`), it's the margin alone: a gap of the
 * app's, whatever anchors are in its scope.
 * Its scroll container's scroll padding follows it (see `useScrollPadding`).
 */
export const Padding = forwardRef<HTMLDivElement, ViewportPaddingProps>(
  (
    { anchor, className, edge = 'block-start', margin, style, ...props },
    forwardedRef,
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const size = useAnchorSize(edge, anchor);
    useScrollPadding(ref, edge);

    return (
      <div
        ref={ref}
        data-edge={edge}
        style={withStyle(
          {
            '--uikit-viewport-padding-margin':
              typeof margin === 'number' ? `${String(margin)}px` : margin,
            '--uikit-viewport-padding-size': `${String(size)}px`,
          },
          style,
        )}
        {...props}
        className={cn('uikit-viewport-padding', className)}
        data-viewport-part="padding"
      />
    );
  },
);
