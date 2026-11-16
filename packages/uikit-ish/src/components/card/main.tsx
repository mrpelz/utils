import '../glass/style.css';
import '../switch/style.css';
import '../slider/style.css';
import '../grid/style.css';
import './style.css';

import { useRender } from '@base-ui/react/use-render';
import {
  forwardRef,
  type MouseEvent,
  type RefObject,
  useLayoutEffect,
  useRef,
} from 'react';

import {
  Grid,
  gridResizeEvent,
  reflowDuration,
  reflowEasing,
  useGridItem,
} from '../grid/main.js';
import { cn, useForwardedRef } from '../utils/main.js';
import type {
  CardCornerButtonProps,
  CardOrientation,
  CardRootProps,
  CardSizes,
  CardSymbolProps,
  CardTitleProps,
  CardValueProps,
} from './props.js';

export type {
  CardCornerButtonProps,
  CardOrientation,
  CardRootProps,
  CardSizes,
  CardSymbolProps,
  CardTitleProps,
  CardValueProps,
} from './props.js';

// Cards: a surface for what an app shows or controls in a grid's tile (a
// `Grid.Item`'s, nested in it), or on its own. Glass (the Sidebar's and
// Islands' medium material, its colors by what's behind); its parts laid
// out by its own size (container queries), more shown the larger it is.
//
// Also:
// - In edit mode (its item's grid's), its content is inert (presses go to
//   the grid: held, it's dragged) and veiled, so the grid's corner symbols
//   read on it. The veil lifts (and those symbols fade with it) while a
//   tile's dragged or resized, on every card of the grid, so they show
//   their content as the grid changes; a resized tile's outline shows as
//   ever.
// - A `Switch` in it is styled by it (smaller, in its top trailing
//   corner), its state the card's whole background: on, bright (its text
//   dark), off, its glass. A press on the card toggles it as a row's does
//   (`forwardClick`).
// - A `Slider` in it is styled by it: its whole surface the track, the
//   fill the background (its ticks across it), no knob; horizontal or
//   vertical by the tile's shape (see `useCardOrientation`). Its label and
//   value laid out as a card's title and value.
// - A binary card's state also shows as its brightness (`active`: a
//   display's, e.g. a lock locked; a control's, its switch on). Pressable
//   as a whole (an `onClick`), it shows it: hovered, pressed. A display
//   without one doesn't.
// - A corner button (`Card.CornerButton`, a `Grid.CornerButton`) does
//   what's more to it: expanding it in place (the app's size for it),
//   opening it above the page, going to a page of its own; its icon one of
//   `cardIcons` or the app's. Shown outside edit mode only (the grid's own
//   controls take the corners then).
// - Its size changing (expanded, opened above the page, resized), it
//   moves there: its glass resized with the grid (`useResizing`), its
//   parts laid out at the new size at once, in a frame of their own, and
//   gliding there (`useMovingParts`); their fonts sized anew over as long
//   (style.css). The app's content only lays itself out by the card's
//   size; what it adds or takes away shows or goes as the card's edge
//   passes.

/** The tile's shape (its item's effective size): wide, horizontal. */
export const useCardOrientation = (): CardOrientation => {
  const item = useGridItem();
  if (!item) return 'horizontal';
  const [columns = '1', rows = '1'] = item.size.split('x');
  return columns === '*' || Number(columns) >= Number(rows)
    ? 'horizontal'
    : 'vertical';
};

/**
 * The sizes the library's kinds of cards support, for their items'
 * `supportedSizes`: a binary display or control (a state, a switch), a
 * numerical display (a value) or control (a slider: never square, so it
 * has a direction).
 */
export const cardSizes: CardSizes = {
  binaryControl: ['1x1', '2x1'],
  binaryDisplay: ['1x1', '2x1'],
  numericalControl: ['2x1', '3x1', '1x2', '1x3'],
  numericalDisplay: ['1x1', '2x1', '2x2'],
};

/** A part's place in its card (its box, from its frame's top left). */
type Place = { height: number; left: number; top: number; width: number };

/**
 * Its parts that move (see `useMovingParts`): what's laid out in it (not
 * its corner buttons, in its corners).
 */
const movingParts =
  ':scope > .uikit-card-layout > [data-card-part]:not([data-card-part="corner-button"])';

/**
 * Its parts' places in its frame, by their part (`data-card-part`): what
 * they show (their content's box: a part's own may span more, e.g. a
 * title's across its column, a symbol's two rows), as laid out (by their
 * offsets: not where they're gliding, see `useMovingParts`).
 */
const placesOf = (frame: HTMLElement) => {
  const places = new Map<string, Place>();
  const range = document.createRange();
  for (const part of frame.querySelectorAll<HTMLElement>(movingParts)) {
    const name = part.dataset.cardPart;
    if (!name || part.offsetParent === null) continue;
    range.selectNodeContents(part);
    const shown = range.getBoundingClientRect();
    const box = part.getBoundingClientRect();
    const isEmpty = shown.width === 0 && shown.height === 0;
    places.set(name, {
      height: isEmpty ? part.offsetHeight : shown.height,
      left: part.offsetLeft + (isEmpty ? 0 : shown.left - box.left),
      top: part.offsetTop + (isEmpty ? 0 : shown.top - box.top),
      width: isEmpty ? part.offsetWidth : shown.width,
    });
  }
  return places;
};

/** Whether motion is reduced (none then: everything at once). */
const isReduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Where a part was, on one axis, in a frame of another size: its distance
 * to the nearer of the frame's edges kept (e.g. a symbol at its top
 * leading corner stays there, a title at its bottom stays as far from
 * it): its offset from where it's laid out now (`to`).
 */
const shiftOf = (
  [fromStart, fromSize, fromFrame]: readonly [number, number, number],
  [toStart, toSize, toFrame]: readonly [number, number, number],
) => {
  const toEnd = fromFrame - fromStart - fromSize;
  return fromStart <= toEnd
    ? fromStart - toStart
    : toFrame - toEnd - (toStart + toSize);
};

/** A part's glide (see `glide`): its animation's id, the offset it's from. */
const glideId = 'uikit-card-glide';
const offsets = new WeakMap<Animation, readonly [number, number]>();

/**
 * A part gliding from where it was (`from`, in a frame of `[fromWidth,
 * fromHeight]`) to where it is (`to`, in `[width, height]`), by its
 * distances to the nearer edges (see `shiftOf`): by a `translate`, from
 * where it shows (laid out anew again, e.g. each frame opened above the
 * page, gliding on from where it is); its font's size changing by itself
 * (see style.css).
 */
const glide = (
  part: HTMLElement,
  [from, to]: readonly [Place, Place],
  [fromWidth, fromHeight, width, height]: readonly [
    number,
    number,
    number,
    number,
  ],
) => {
  const dx = shiftOf(
    [from.left, from.width, fromWidth],
    [to.left, to.width, width],
  );
  const dy = shiftOf(
    [from.top, from.height, fromHeight],
    [to.top, to.height, height],
  );
  if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
  // (From where it shows now (a glide running: its offset, what's left of
  // it by its eased progress), by as much more; that glide replaced. Not
  // added to, nor read from its computed style: on iOS, either dropped the
  // running offset, its parts jumping.)
  let x = 0;
  let y = 0;
  for (const animation of part.getAnimations()) {
    if (animation.id !== glideId) continue;
    const { progress } = animation.effect?.getComputedTiming() ?? {};
    const offset = offsets.get(animation);
    if (offset && typeof progress === 'number') {
      x += offset[0] * (1 - progress);
      y += offset[1] * (1 - progress);
    }
    animation.cancel();
  }
  const animation = part.animate(
    [
      { translate: `${String(x + dx)}px ${String(y + dy)}px` },
      { translate: '0 0' },
    ],
    { duration: reflowDuration, easing: reflowEasing, id: glideId },
  );
  offsets.set(animation, [x + dx, y + dy]);
};

/**
 * Its parts gliding to where they're laid out anew, as the grid's reflow
 * glides (its timing; see `glide`): its frame's size changed (its tile
 * resized, opened above the page), or it rendered something else (e.g. a
 * corner button shown, its symbol moving). Parts new to it, or gone,
 * aren't moved: they show (or not) as its edge passes them.
 */
const useMovingParts = (rootRef: RefObject<HTMLElement | null>) => {
  const check = useRef<(() => void) | undefined>(undefined);
  useLayoutEffect(() => {
    // (Its frame: the size it's laid out at, see `useResizing`.)
    const frame = rootRef.current?.querySelector<HTMLElement>(
      ':scope > .uikit-card-frame',
    );
    if (!frame) return undefined;
    let places = placesOf(frame);
    let size = [frame.offsetWidth, frame.offsetHeight] as const;
    check.current = () => {
      const next = [frame.offsetWidth, frame.offsetHeight] as const;
      // (Not laid out (e.g. lifted out of its grid, not sized yet, see
      // Grid's overlay): its last places kept, for when it is.)
      if (!next[0] || !next[1]) return;
      const before = places;
      const previous = size;
      places = placesOf(frame);
      size = next;
      if (isReduced() || !previous[0] || !previous[1]) return;
      for (const part of frame.querySelectorAll<HTMLElement>(movingParts)) {
        const from = before.get(part.dataset.cardPart ?? '');
        const to = places.get(part.dataset.cardPart ?? '');
        if (!from || !to) continue;
        glide(part, [from, to], [...previous, ...next]);
      }
    };
    const observer = new ResizeObserver(() => check.current?.());
    observer.observe(frame);
    // (Resized by its grid (lifted above the page): told in that frame, its
    // parts gliding from it on; the observer's, on iOS, came too late,
    // laid out anew and painted before they glided.)
    const body = frame.closest<HTMLElement>('[data-grid-part="body"]');
    const onResize = () => check.current?.();
    body?.addEventListener(gridResizeEvent, onResize);
    return () => {
      observer.disconnect();
      body?.removeEventListener(gridResizeEvent, onResize);
      check.current = undefined;
    };
  }, [rootRef]);
  // (Rendered anew: laid out anew, maybe, its size the same.)
  useLayoutEffect(() => {
    check.current?.();
  });
};

/**
 * Its tile resized (its item's size changing, not editing, as the grid
 * reflows; e.g. expanded in place): its glass from its old size to its new
 * one, with the grid's reflow (its timing; its tile's body glided to its
 * new place by the grid, e.g. centered in its area), above what's around
 * it and out of its tile's bounds meanwhile. Its box the larger of the two
 * sizes, shown from the old one to the new (a rounded clip, from its top
 * leading corner); its parts laid out at the new size at once (its frame,
 * which they glide in, see `useMovingParts`).
 */
const useResizing = (
  rootRef: RefObject<HTMLElement | null>,
  size: string | undefined,
  isEditing: boolean,
) => {
  const last = useRef<readonly [number, number] | undefined>(undefined);
  useLayoutEffect(() => {
    const { current: root } = rootRef;
    if (!root || size === undefined) return undefined;
    const to = [root.offsetWidth, root.offsetHeight] as const;
    const from = last.current;
    last.current = to;
    // (Editing, resized as tiles are: outlined, then at once.)
    if (
      !from ||
      isEditing ||
      (from[0] === to[0] && from[1] === to[1]) ||
      isReduced()
    ) {
      return undefined;
    }
    const width = Math.max(from[0], to[0]);
    const height = Math.max(from[1], to[1]);
    const { style } = root;
    style.width = `${String(width)}px`;
    style.height = `${String(height)}px`;
    root.dataset.cardResizing = '';
    const frame = root.querySelector<HTMLElement>(':scope > .uikit-card-frame');
    frame?.style.setProperty('width', `${String(to[0])}px`);
    frame?.style.setProperty('height', `${String(to[1])}px`);
    const radius =
      Number.parseFloat(getComputedStyle(root).borderTopLeftRadius) || 0;
    const isRtl = getComputedStyle(root).direction === 'rtl';
    const clipOf = ([w, h]: readonly [number, number]) => {
      const across = `${String(width - w)}px`;
      const down = `${String(height - h)}px`;
      return isRtl
        ? `inset(0 0 ${down} ${across} round ${String(radius)}px)`
        : `inset(0 ${across} ${down} 0 round ${String(radius)}px)`;
    };
    const animation = root.animate(
      [{ clipPath: clipOf(from) }, { clipPath: clipOf(to) }],
      { duration: reflowDuration, easing: reflowEasing },
    );
    const settle = () => {
      for (const property of ['width', 'height']) {
        style.removeProperty(property);
        frame?.style.removeProperty(property);
      }
      delete root.dataset.cardResizing;
    };
    animation.addEventListener('finish', settle);
    return () => {
      animation.cancel();
      settle();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- by its size only
  }, [rootRef, size]);
};

/**
 * The card: its glass, its parts on it; bright while `active` (or a switch
 * in it is on); pressable as a whole with an `onClick` (its feedback, see
 * style.css); in a grid's tile (its item's), inert and veiled while
 * editing (see the top).
 */
const Root = forwardRef<HTMLDivElement, CardRootProps>(
  (
    { active = false, children, className, onClick, render, ...props },
    forwardedRef,
  ) => {
    const item = useGridItem();
    const isEditing = item?.editing === true;
    const ref = useForwardedRef(forwardedRef);
    // (Resized, its box and its parts moving there: see above.)
    useResizing(ref, item?.size, isEditing);
    useMovingParts(ref);
    return useRender({
      defaultTagName: 'div',
      props: {
        ...props,
        // (Its parts on a layout of its own, in a frame: what its size
        // queries ask, see style.css; resized, the new size at once.)
        children: (
          <div className="uikit-card-frame">
            <div className="uikit-card-layout">{children}</div>
          </div>
        ),
        className: cn(
          'uikit-card-root uikit-glass-medium uikit-glass-panel',
          className,
        ),
        'data-active': active ? '' : undefined,
        'data-card-part': 'root',
        // (Pressed as a whole: its feedback, see style.css.)
        'data-pressable': onClick ? '' : undefined,
        'data-editing': isEditing ? '' : undefined,
        inert: isEditing || undefined,
        onClick,
      },
      ref,
      render,
    });
  },
);

/** Its symbol (e.g. a `Symbol`), at its top leading corner. */
const CardSymbol = forwardRef<HTMLSpanElement, CardSymbolProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      {...props}
      className={cn('uikit-card-symbol', className)}
      data-card-part="symbol"
    />
  ),
);

/** What it is (e.g. a device's name), above its value. */
const Title = forwardRef<HTMLSpanElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      {...props}
      className={cn('uikit-card-title', className)}
      data-card-part="title"
    />
  ),
);

/** The document's language, if it says (none: the runtime's default). */
const documentLocale = () =>
  typeof document === 'undefined'
    ? undefined
    : document.documentElement.lang || undefined;

/**
 * Its value: a number formatted as the app says (`format`, `locale`:
 * `Intl.NumberFormat`'s), or what's given instead (e.g. a state).
 */
const Value = forwardRef<HTMLSpanElement, CardValueProps>(
  ({ children, className, format, locale, value, ...props }, ref) => (
    <span
      ref={ref}
      {...props}
      className={cn('uikit-card-value', className)}
      data-card-part="value"
    >
      {value === undefined
        ? children
        : new Intl.NumberFormat(locale ?? documentLocale(), format).format(
            value,
          )}
    </span>
  ),
);

/**
 * A button in its corner (see `Grid.CornerButton`): shown while its grid
 * isn't editing (faded out, inert, while it is; and as `visible` says). A
 * press on it is its own, not the card's (e.g. not toggling a switch in
 * it, see `forwardClick`).
 */
const CornerButton = forwardRef<HTMLButtonElement, CardCornerButtonProps>(
  ({ className, onClick, visible = true, ...props }, ref) => {
    const isEditing = useGridItem()?.editing === true;
    return (
      <Grid.CornerButton
        ref={ref}
        className={cn('uikit-card-corner-button', className)}
        data-card-part="corner-button"
        visible={visible && !isEditing}
        {...props}
        onClick={(event: MouseEvent<HTMLButtonElement>) => {
          event.stopPropagation();
          onClick?.(event);
        }}
      />
    );
  },
);

export const Card = {
  CornerButton,
  Root,
  Symbol: CardSymbol,
  Title,
  Value,
};
