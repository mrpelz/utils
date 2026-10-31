import {
  createContext,
  forwardRef,
  RefObject,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

import {
  cn,
  PortalContainerContext,
  useForwardedRef,
  withStyle,
} from '../utils/main.js';
import type {
  ViewportAnchorProps,
  ViewportEdge,
  ViewportEdgeEffect,
  ViewportPaddingProps,
} from './props.js';

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
// more), live (e.g. a tab bar collapsing); and, beyond them, the open
// overscroll areas at its edge (`Viewport.Overscroll`'s `open`, kept shown
// past the content's end, e.g. refreshing).

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
  /** An anchor's edge effect, and its tint (see `EdgeEffects`). */
  effect?: ViewportEdgeEffect;
  handle: ViewportAnchorHandle | undefined;
  keyboard?: ViewportAnchorProps['keyboard'];
  /** An anchor, or an open overscroll area (adding to them, see above). */
  kind: 'anchor' | 'overscroll';
  /** Its border box's (the safe area it keeps clear too), for its effect. */
  outer?: number;
  size: number;
  tint?: string;
};

/** An edge's effect, from its anchors (see `useEdgeEffectOf`). */
export type EdgeEffect = {
  effect: Exclude<ViewportEdgeEffect, 'none'>;
  keyboard: ViewportAnchorProps['keyboard'];
  /** The tallest anchor's border box (px). */
  size: number;
  tint: string | undefined;
};

/**
 * A scope's anchors, and who's told of their changes. Their sizes measured
 * by one observer, all at once (told once): one anchor shown as another's
 * hidden (e.g. a tab's panel's bar), never none in between.
 */
const createStore = () => {
  const entries = new Set<Entry>();
  const listeners = new Set<() => void>();
  const notify = () => {
    for (const listener of listeners) listener();
  };

  const measured = new Map<Element, Entry>();
  let observer: ResizeObserver | undefined;
  const onResize = (records: ResizeObserverEntry[]) => {
    let isChanged = false;
    for (const record of records) {
      const entry = measured.get(record.target);
      if (!entry) continue;
      const isBlock =
        entry.edge === 'block-start' || entry.edge === 'block-end';
      const box = record.contentBoxSize[0];
      const border = record.borderBoxSize[0];
      const size = Math.round(
        (isBlock ? box?.blockSize : box?.inlineSize) ?? 0,
      );
      const outer = Math.round(
        (isBlock ? border?.blockSize : border?.inlineSize) ?? 0,
      );
      if (size === entry.size && outer === entry.outer) continue;
      entry.size = size;
      entry.outer = outer;
      isChanged = true;
    }
    if (isChanged) notify();
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
    /** An anchor's element, its size measured into its entry (see above). */
    measure: (element: Element, entry: Entry) => {
      observer ??= new ResizeObserver(onResize);
      measured.set(element, entry);
      observer.observe(element);
      return () => {
        measured.delete(element);
        observer?.unobserve(element);
      };
    },
    notify,
    /** The open overscroll areas' sizes at an edge, added up. */
    room: (edge: ViewportEdge): number => {
      let room = 0;
      for (const entry of entries) {
        if (entry.kind === 'overscroll' && entry.edge === edge) {
          room += entry.size;
        }
      }
      return room;
    },
    /** The tallest anchor's size: at an edge, or linked by the handles. */
    size: (
      edge: ViewportEdge,
      handles: readonly ViewportAnchorHandle[] | undefined,
    ): number => {
      let size = 0;
      for (const entry of entries) {
        if (entry.kind !== 'anchor') continue;
        const isMatch = handles
          ? entry.handle !== undefined && handles.includes(entry.handle)
          : entry.edge === edge;
        if (isMatch) size = Math.max(size, entry.size);
      }
      return size;
    },
    /**
     * An edge's effect (see `useEdgeEffectOf`), as a snapshot (a string,
     * stable while unchanged): as tall as its tallest anchor having one;
     * hard if any is, else soft; tinted by the first tinted one.
     */
    effect: (edge: ViewportEdge): string => {
      let size = -1;
      let effect: ViewportEdgeEffect = 'none';
      let tint: string | undefined;
      let keyboard: ViewportAnchorProps['keyboard'];
      for (const entry of entries) {
        const { effect: entryEffect = 'none' } = entry;
        const hasEffect =
          entry.kind === 'anchor' &&
          entry.edge === edge &&
          entryEffect !== 'none';
        if (!hasEffect) continue;
        if (entryEffect === 'hard' || effect === 'none') effect = entryEffect;
        tint ??= entry.tint;
        const outer = entry.outer ?? 0;
        if (!(outer > size)) {
          continue;
        }

        size = outer;
        keyboard = entry.keyboard;
      }
      return effect === 'none'
        ? ''
        : JSON.stringify({ effect, keyboard, size, tint });
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
 * An anchor's size (its content box's, along its edge's axis), and its
 * edge effect (its style, tint, and how it meets the keyboard), registered
 * in its scope while it's mounted (see above).
 */
export const useAnchorRegistration = (
  ref: RefObject<HTMLElement | null>,
  edge: ViewportEdge,
  handle: ViewportAnchorHandle | undefined,
  { effect, keyboard, tint }: Pick<Entry, 'effect' | 'keyboard' | 'tint'> = {},
): void => {
  const store = useStore();
  // Its entry while registered: its effect updated in place (not
  // registered again, its size measured anew).
  const entryRef = useRef<Entry | undefined>(undefined);

  useLayoutEffect(() => {
    const { current: entry } = entryRef;
    if (!entry) return;
    if (
      entry.effect === effect &&
      entry.keyboard === keyboard &&
      entry.tint === tint
    ) {
      return;
    }
    Object.assign(entry, { effect, keyboard, tint });
    store.notify();
  }, [effect, keyboard, store, tint]);

  useLayoutEffect(() => {
    const { current: element } = ref;
    if (!element) return undefined;
    const entry: Entry = {
      edge,
      effect,
      handle,
      keyboard,
      kind: 'anchor',
      size: 0,
      tint,
    };
    entryRef.current = entry;
    const remove = store.add(entry);
    const unmeasure = store.measure(element, entry);

    return () => {
      unmeasure();
      entryRef.current = undefined;
      remove();
    };
    // (Its effect updated in place, above.)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edge, handle, ref, store]);
};

/**
 * An edge's scroll edge effect in its scope, from its anchors (see
 * `Store.effect`): none without one having it.
 */
export const useEdgeEffectOf = (edge: ViewportEdge): EdgeEffect | undefined => {
  const store = useStore();
  const snapshot = useSyncExternalStore(
    store.subscribe,
    () => store.effect(edge),
    () => '',
  );

  return useMemo(
    () => (snapshot ? (JSON.parse(snapshot) as EdgeEffect) : undefined),
    [snapshot],
  );
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
 * An open overscroll area's size (`size`, px; 0: closed), registered in its
 * scope at its edge (see above): the paddings there make room for it.
 */
export const useOverscrollRoom = (edge: ViewportEdge, size: number): void => {
  const store = useStore();

  useLayoutEffect(
    () =>
      size <= 0
        ? undefined
        : store.add({ edge, handle: undefined, kind: 'overscroll', size }),
    [edge, size, store],
  );
};

/** The room made for the open overscroll areas at an edge (see above). */
const useRoom = (edge: ViewportEdge): number => {
  const store = useStore();

  return useSyncExternalStore(
    store.subscribe,
    () => store.room(edge),
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
    const room = useRoom(edge);
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
            '--uikit-viewport-overscroll-room': `${String(room)}px`,
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
