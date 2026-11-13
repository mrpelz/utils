import './style.css';

import {
  forwardRef,
  KeyboardEvent,
  PointerEvent,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { cn, useForwardedRef, withStyle } from '../utils/main.js';
import { ViewportScopeContext } from '../viewport/main.js';
import type { LayoutColumnProps, LayoutRootProps } from './props.js';

export type { LayoutColumnProps, LayoutRootProps } from './props.js';

// Layouts: columns side by
// side, filling their container (e.g. `Viewport.Content`): a sidebar, a list, a
// detail; each its own scroll container (put a `Page` in it). A column takes a
// size (the app's, in px; between `minSize` and `maxSize`), or shares the free
// space with the other flexible ones; a `resizable` one is resized by dragging
// its divider (or arrow keys on it). Columns are divided by a hairline in
// `separator`.
//
// Compact (e.g. on a phone, by the size class, `useSizeClass`: the app's
// choice), a column can be a `Drawer` instead (e.g. a sidebar), over the
// others from its side, hidden until opened: the app renders one or the
// other.
//
// Floating (a column's `floating`, e.g. for a `Sidebar`), a column
// floats over the others at the layout's start, which span the whole layout
// underneath it; a column next to it can keep its content clear of it
// (`clearFloating`: its pages' content and its bars' inset by the floating
// column's size, their backgrounds running underneath it).
//
// Behind it all, where columns have no background of their own, what's
// behind the layout: e.g. a `Viewport.Background` (the screen's), or the
// app's own (its root's CSS background, an element behind it).
//
// Each column is the containing block of its fixed layers (e.g. a header's
// bar, in a `Viewport.BlockStart`): they span it, not the screen.
//
// Open or closed (`open`, the app's state; e.g. a sidebar hidden by a
// button in its toolbar, shown again by one in the content's bars):
// closed, a column slides out (a floating one off its edge; the others at
// their size, by a negative margin, the columns beside them taking their
// place, their content never squeezed), keeping its size for when it opens
// again; inert, and hidden once out. A `clearFloating` column's inset
// follows a floating one's slide frame by frame (`useFloatingSize`).
// Transitions only while a column opens or closes (`data-transitioning`
// on the root, until its own have finished), not as it's first laid out,
// nor resized; then its layout's scrollers are drawn anew
// (`repaintScrollers`).
//
// Also:
// - Resizable.

/** How far an arrow key resizes (Shift: further). */
const keyStep = 10;
const keyStepLarge = 50;

// Leading to trailing: wider towards the end (right to left: the left).
const towardsEnd = (element: HTMLElement) =>
  getComputedStyle(element).direction === 'rtl' ? -1 : 1;

const clamp = (size: number, min: number, max: number) =>
  Math.min(Math.max(size, min), max);

/**
 * How much of a floating column shows in its layout (px): as it slides
 * in or out, its visible part.
 */
const visibleSize = (column: HTMLElement, root: HTMLElement) => {
  const own = column.getBoundingClientRect();
  const layout = root.getBoundingClientRect();
  return Math.max(
    0,
    Math.round(
      towardsEnd(root) === 1
        ? own.right - layout.left
        : layout.right - own.left,
    ),
  );
};

/**
 * Publishes a floating column's size (regular) as
 * `--uikit-layout-floating-size` on its layout, as it changes (e.g.
 * resized), for the columns clear of it; closed, none. Opening or closing,
 * its visible part, frame by frame, until its slide has finished: the
 * columns clear of it following it. (Not a transition of a registered,
 * inherited property: see the docs' iOS Quirks, moving values and memory.
 * This one, inherited by a whole column, moves only while a sidebar opens
 * or closes, a few hundred milliseconds now and then, not on every
 * navigation.)
 */
const useFloatingSize = (
  columnRef: { current: HTMLDivElement | null },
  isFloating: boolean,
  isOpen: boolean,
) => {
  const wasOpen = useRef(isOpen);
  useLayoutEffect(() => {
    const { current: column } = columnRef;
    const root = column?.parentElement;
    if (!column || !root || !isFloating) return undefined;

    const property = '--uikit-layout-floating-size';
    const publish = (size: number) =>
      root.style.setProperty(property, `${String(size)}px`);

    let frame = 0;
    const settle = () => {
      frame = 0;
      if (isOpen) publish(column.getBoundingClientRect().width);
      else publish(0);
    };
    if (wasOpen.current === isOpen) {
      if (!isOpen) publish(0);
    } else {
      wasOpen.current = isOpen;
      // (After the style change starts its slide.)
      const follow = () => {
        if (column.getAnimations().length === 0) {
          settle();
          return;
        }
        publish(visibleSize(column, root));
        frame = requestAnimationFrame(follow);
      };
      frame = requestAnimationFrame(follow);
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      // (Not while it slides: followed, see above.)
      if (!isOpen || frame) return;
      publish(entry?.borderBoxSize[0]?.inlineSize ?? 0);
    });
    resizeObserver.observe(column);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      root.style.removeProperty(property);
    };
  }, [columnRef, isFloating, isOpen]);
};

/**
 * Its scrollers (pages, content layers) drawn anew, once a column has
 * opened or closed: iOS keeps the tiles it drew ahead of what's shown, off
 * screen, as they were before (e.g. the content beside a sidebar hidden,
 * inset as it was, for good). Each given a layer of its own for two frames
 * (`will-change`), its tiles then drawn afresh: at rest, after the slide
 * (not during a scroll, see iOS Quirks: layers changing under one).
 */
const repaintScrollers = (root: HTMLElement) => {
  const scrollers = Array.from(
    root.querySelectorAll<HTMLElement>(
      '.uikit-page-root, .uikit-viewport-content',
    ),
  );
  for (const scroller of scrollers) scroller.style.willChange = 'transform';
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      for (const scroller of scrollers) {
        scroller.style.removeProperty('will-change');
      }
    }),
  );
};

/**
 * Opening or closing (not as it's first laid out): its layout marked
 * transitioning (`data-transitioning`) until its own transitions have
 * finished (none, e.g. with reduced motion: at once). Closing, a column
 * that isn't floating keeps its size as it moves out (`--uikit-layout-
 * column-closing-size`, see style.css): its size as last laid out
 * open (observed; not measured then, which would lay it out closed before
 * it's marked, its change not transitioned).
 */
const useOpenTransition = (
  columnRef: { current: HTMLDivElement | null },
  isOpen: boolean,
) => {
  const openSize = useRef<number | undefined>(undefined);
  useLayoutEffect(() => {
    const { current: column } = columnRef;
    if (!column || !isOpen) return undefined;
    const resizeObserver = new ResizeObserver(([entry]) => {
      openSize.current = entry?.borderBoxSize[0]?.inlineSize;
    });
    resizeObserver.observe(column);
    return () => resizeObserver.disconnect();
  }, [columnRef, isOpen]);

  const wasOpen = useRef(isOpen);
  useLayoutEffect(() => {
    const { current: column } = columnRef;
    const root = column?.parentElement;
    if (!column || !root || wasOpen.current === isOpen) return undefined;
    wasOpen.current = isOpen;

    root.toggleAttribute('data-transitioning', true);
    if (!isOpen && openSize.current !== undefined) {
      column.style.setProperty(
        '--uikit-layout-column-closing-size',
        `${String(openSize.current)}px`,
      );
    }
    let isCancelled = false;
    // (After the style change starts them.)
    const frame = requestAnimationFrame(() => {
      Promise.allSettled(
        column.getAnimations().map(({ finished }) => finished),
      ).then(() => {
        if (isCancelled) return;
        delete root.dataset.transitioning;
        if (isOpen) {
          column.style.removeProperty('--uikit-layout-column-closing-size');
        }
        repaintScrollers(root);
      });
    });

    return () => {
      isCancelled = true;
      cancelAnimationFrame(frame);
      delete root.dataset.transitioning;
    };
  }, [columnRef, isOpen]);
};

/** A column side by side: sized (resizable), or sharing the free space. */
const Column = forwardRef<HTMLDivElement, LayoutColumnProps>(
  (
    {
      className,
      children,
      clearFloating = false,
      defaultOpen = true,
      defaultSize,
      floating = false,
      maxSize = Infinity,
      minSize = 240,
      onSizeChange,
      open: controlledOpen,
      resizable = false,
      size: controlledSize,
      style,
      ...props
    },
    forwardedRef,
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const [ownOpen] = useState(defaultOpen);
    const isOpen = controlledOpen ?? ownOpen;
    useFloatingSize(ref, floating, isOpen);
    useOpenTransition(ref, isOpen);
    const [ownSize, setOwnSize] = useState(defaultSize);
    const size = controlledSize ?? ownSize;
    const dragRef = useRef<
      { pointerId: number; size: number; x: number } | undefined
    >(undefined);
    const [isDragging, setIsDragging] = useState(false);

    const resize = (next: number) => {
      const clamped = clamp(Math.round(next), minSize, maxSize);
      setOwnSize(clamped);
      onSizeChange?.(clamped);
    };

    // Its current size: the given one, or (flexible) as laid out.
    const sizeOf = (divider: HTMLElement) =>
      size ?? divider.parentElement?.getBoundingClientRect().width ?? minSize;

    const columnStyle = withStyle(
      {
        '--uikit-layout-column-flex':
          size === undefined ? undefined : `0 0 ${String(size)}px`,
        '--uikit-layout-column-size':
          size === undefined ? undefined : `${String(size)}px`,
        '--uikit-layout-column-max': Number.isFinite(maxSize)
          ? `${String(maxSize)}px`
          : undefined,
        '--uikit-layout-column-min': `${String(minSize)}px`,
      },
      style,
    );

    // Its anchors' scope: fixed to it (`contain: layout`, see Viewport.Padding).
    const [scope] = useState(() => ({}));

    return (
      <ViewportScopeContext.Provider value={scope}>
        <div
          ref={ref}
          data-clear-floating={clearFloating ? '' : undefined}
          data-closed={isOpen ? undefined : ''}
          data-floating={floating ? '' : undefined}
          data-layout-part="column"
          data-resizable={resizable ? '' : undefined}
          inert={!isOpen}
          style={columnStyle}
          {...props}
          className={cn('uikit-layout-column', className)}
        >
          {children}
          {resizable ? (
            // The divider at a resizable column's end: a 10px hit area over the
            // hairline (a keyboard-focusable separator).
            <div
              aria-orientation="vertical"
              aria-valuemax={Number.isFinite(maxSize) ? maxSize : undefined}
              aria-valuemin={minSize}
              aria-valuenow={size}
              className="uikit-layout-divider"
              data-dragging={isDragging ? '' : undefined}
              data-layout-part="divider"
              role="separator"
              tabIndex={0}
              onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
                const step = event.shiftKey ? keyStepLarge : keyStep;
                const direction = towardsEnd(event.currentTarget);
                const current = sizeOf(event.currentTarget);
                const sizes: Record<string, number> = {
                  ArrowLeft: current - step * direction,
                  ArrowRight: current + step * direction,
                  End: maxSize,
                  Home: minSize,
                };
                const next = sizes[event.key];
                if (next === undefined || !Number.isFinite(next)) return;
                event.preventDefault();
                resize(next);
              }}
              onLostPointerCapture={() => {
                dragRef.current = undefined;
                setIsDragging(false);
              }}
              onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
                if (event.button !== 0) return;
                event.preventDefault();
                event.currentTarget.setPointerCapture(event.pointerId);
                dragRef.current = {
                  pointerId: event.pointerId,
                  size: sizeOf(event.currentTarget),
                  x: event.clientX,
                };
                setIsDragging(true);
              }}
              onPointerMove={(event: PointerEvent<HTMLDivElement>) => {
                const { current: drag } = dragRef;
                if (drag?.pointerId !== event.pointerId) return;
                const moved =
                  (event.clientX - drag.x) * towardsEnd(event.currentTarget);
                resize(drag.size + moved);
              }}
            />
          ) : null}
        </div>
      </ViewportScopeContext.Provider>
    );
  },
);

/**
 * A layout: its columns side by side (floating ones over the others),
 * what's behind it showing where they have no background.
 */
const Root = forwardRef<HTMLDivElement, LayoutRootProps>(
  ({ className, hideSeparators = false, ...props }, ref) => (
    <div
      ref={ref}
      data-hide-separators={hideSeparators ? '' : undefined}
      data-layout-part="root"
      {...props}
      className={cn('uikit-layout-root', className)}
    />
  ),
);

export const Layout = {
  Root,
  Column,
};
