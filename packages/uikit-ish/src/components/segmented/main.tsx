import '../glass/style.css';
import './style.css';

import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { ComponentProps, forwardRef, useEffect } from 'react';

import {
  cn,
  type DelayedLens,
  delayLens,
  edgeScrollDelta,
  frameElapsed,
  isKeyboardFocus,
  useForwardedRef,
  usePointerDrag,
  useSecondaryClick,
} from '../utils/main.js';
import type { SegmentedItemProps, SegmentedRootProps } from './props.js';

export type { SegmentedItemProps, SegmentedRootProps } from './props.js';

// The segmented control, light and dark, in the semantic colors where they
// match: track `tertiarySystemFill`, labels `label`, separators `systemGray`.
// The highlight (`#fff`/`#6c6c71`) has no semantic equivalent.
// Behavior comes from Framework7
// `components/button/button.less` (`.segmented-strong`,
// `.segmented-highlight`) and `button-vars.less` (its iOS theme's values): disabled
// opacity, transition durations, `z-index`, item `min-width`
// (`--f7-button-min-width`).
// Additions from Konsta UI `shared/classes/SegmentedClasses.js`:
// `width: 100%`, `pointer-events: none` on the highlight.
//
// Also:
// - The track height (36px) is a minimum, not a fixed size.
// - Items are laid out in equal grid columns, so every column fits the widest label when the
//   control sizes to its content.
// - Items are fully rounded.
// - The highlight extends 4px on both sides of its item.
// - Separators are drawn at the start of the following item instead of being
//   1px flex items of their own; item labels are wrapped in a span that
//   handles overflow, so the rounded item does not clip its separator.
// - Chained sibling combinators replace Framework7's `:nth-child()`, as Base UI
//   renders a hidden `<input>` next to each radio.
// - The highlight is hidden while no item is checked.
// - The browser's default focus ring is kept (Framework7 removes it), on
//   keyboard focus only (an item focused when pressed matches :focus-visible
//   on touch).
// - Pressing an item (held a moment or dragged; a quick tap only checks it)
//   turns the selection into a glass lens that follows the pointer and
//   checks the closest item on release (Framework7 has no lens here; it's
//   the tab bar's, see `tab-bar/main.tsx`). It replaces Framework7's pressed
//   background. The lens is drawn above the items and outside the track, so
//   the track doesn't clip its content; the highlight clips itself (and its
//   shadow) to the track. Sideways, it grows by at most twice as much as
//   vertically (wide items).
// - Scrolled (`overflow`), its items snap (by their start, a peek of the
//   previous one beside it), and the checked one is scrolled into view (at
//   once when mounted), a peek of the items beyond it beside it.

const scrollerOf = (root: HTMLElement) =>
  root.querySelector<HTMLElement>(':scope > .uikit-segmented-scroller');

const trackOf = (root: HTMLElement) =>
  scrollerOf(root)?.querySelector<HTMLElement>(
    ':scope > .uikit-segmented-track',
  );

/** A press on the control: its lens, the item under it. */
type DragState = {
  /** Scrolling near its ends (scrolled), each frame. */
  frame?: number;
  isMouse: boolean;
  /** A touch scrolling it (moved before its lens showed): no lens. */
  isScrolling?: boolean;
  item?: HTMLElement;
  lens: DelayedLens;
  start: { x: number; y: number };
  x: number;
};

/** A touch moving this far (px) before the lens shows scrolls instead. */
const scrollSlop = 8;

// A touch moved past `scrollSlop` before its lens showed: scrolling, its
// lens never shown.
const yieldToScroll = (
  state: DragState,
  { clientX, clientY }: { clientX: number; clientY: number },
) => {
  if (
    Math.hypot(clientX - state.start.x, clientY - state.start.y) <= scrollSlop
  ) {
    return;
  }
  state.lens.cancel();
  state.isScrolling = true;
};

const isEnabled = (item: HTMLElement) =>
  !Object.hasOwn(item.dataset, 'disabled');

const getItems = (root: HTMLElement) =>
  [...root.querySelectorAll('[role="radio"]')].filter(
    (item): item is HTMLElement => item instanceof HTMLElement,
  );

// Moves the lens to the pointer, clamped to the highlight's range, and
// returns the closest enabled item. The (hidden) highlight follows the lens,
// so it settles from there on release.
const press = (root: HTMLElement, clientX: number) => {
  const items = getItems(root);
  const rects = items.map((item) => item.getBoundingClientRect());
  const candidates = items
    .map((item, index) => ({ item, rect: rects[index] }))
    .filter(
      (candidate): candidate is { item: HTMLElement; rect: DOMRect } =>
        candidate.rect !== undefined && isEnabled(candidate.item),
    );
  const distances = candidates.map(({ rect }) =>
    Math.abs(rect.left + rect.width / 2 - clientX),
  );
  const closest = candidates[distances.indexOf(Math.min(...distances))];
  if (!closest) return undefined;

  const { item, rect } = closest;
  const outset =
    Number.parseFloat(
      getComputedStyle(root).getPropertyValue(
        '--uikit-segmented-highlight-outset',
      ),
    ) || 0;
  const width = rect.width + outset * 2;
  // Within the items, and what's shown of them (scrolled: its scroller's).
  const shown = scrollerOf(root)?.getBoundingClientRect();
  const centerX = Math.max(
    Math.max(
      Math.min(...rects.map(({ left }) => left)),
      shown?.left ?? -Infinity,
    ) -
      outset +
      width / 2,
    Math.min(
      clientX,
      Math.min(
        Math.max(...rects.map(({ right }) => right)),
        shown?.right ?? Infinity,
      ) +
        outset -
        width / 2,
    ),
  );

  // The highlight's start, in its track (scrolled along with the items);
  // the lens', over the root.
  const rootRect = root.getBoundingClientRect();
  const paddingLeft = rootRect.left + root.clientLeft;
  const track = trackOf(root)?.getBoundingClientRect() ?? rootRect;
  const start =
    getComputedStyle(root).direction === 'rtl'
      ? track.right - (centerX + width / 2)
      : centerX - width / 2 - track.left;

  for (const other of items) other.toggleAttribute('data-lens', other === item);

  for (const [property, value] of Object.entries({
    '--uikit-segmented-lens-height': `${rect.height}px`,
    '--uikit-segmented-lens-start': `${start}px`,
    '--uikit-segmented-lens-width': `${width}px`,
    '--uikit-segmented-lens-x': `${centerX - paddingLeft}px`,
    '--uikit-segmented-lens-y': `${rect.top + rect.height / 2 - rootRect.top - root.clientTop}px`,
  })) {
    root.style.setProperty(property, value);
  }

  return item;
};

// Settles the lens on the chosen item (if any) while it fades out, and lets
// the highlight return to the checked item.
const release = (root: HTMLElement, item?: HTMLElement) => {
  if (item) {
    const { left, width } = item.getBoundingClientRect();
    press(root, left + width / 2);
  }

  root.style.removeProperty('--uikit-segmented-lens-move-duration');
  root.style.removeProperty('--uikit-segmented-lens-start');
  root.style.removeProperty('--uikit-segmented-pressed');
  for (const other of getItems(root)) delete other.dataset.lens;
};

// Scrolls the checked item (if any) wholly into its scroller's view, its
// track's padding and a peek of the items beyond it beside it (hinting at
// them); only the scroller, not the page around it. To a snap position
// (items snap by their start, see style.css): the nearest showing it so, so
// snapping doesn't take it out of view again.
const reveal = (root: HTMLElement, behavior: ScrollBehavior) => {
  const scroller = scrollerOf(root);
  const item = root.querySelector('[role="radio"][data-checked]');
  if (!scroller || !item) return;

  const style = getComputedStyle(root);
  const margin = ['--uikit-segmented-padding-inline', '--uikit-segmented-peek']
    .map((property) => Number.parseFloat(style.getPropertyValue(property)) || 0)
    .reduce((sum, value) => sum + value, 0);
  const shown = scroller.getBoundingClientRect();
  const { left, right } = item.getBoundingClientRect();
  const delta =
    left - margin < shown.left
      ? left - margin - shown.left
      : Math.max(0, right + margin - shown.right);
  if (Math.abs(delta) < 1) return;

  // Each item's snap position (its start beside the padding and peek), as a
  // `scrollLeft`; then the first past the target, in its direction.
  const isRtl = style.direction === 'rtl';
  const target = scroller.scrollLeft + delta;
  const positions = getItems(root).map((other) => {
    const rect = other.getBoundingClientRect();
    return isRtl
      ? scroller.scrollLeft + rect.right + margin - shown.right
      : scroller.scrollLeft + rect.left - margin - shown.left;
  });
  const snapped =
    delta > 0
      ? Math.min(...positions.filter((position) => position >= target - 1))
      : Math.max(...positions.filter((position) => position <= target + 1));

  // (To a position, not by a distance: Chrome snaps a `scrollBy` by its
  // direction.)
  const isReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  scroller.scrollTo({
    behavior: isReduced ? 'instant' : behavior,
    left: Number.isFinite(snapped) ? snapped : target,
  });
};

/**
 * The track, containing `Segmented.Item`s and a `Segmented.Highlight`.
 * Renders the glass lens shown while an item is pressed.
 */
const Root = forwardRef<HTMLDivElement, Omit<SegmentedRootProps, 'ref'>>(
  (
    {
      className,
      children,
      hideSeparators,
      onFocus,
      overflow = 'truncate',
      onLostPointerCapture,
      onPointerCancel,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onTouchMove,
      ...props
    },
    forwardedRef,
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const isScrolled = overflow === 'scroll';

    // Scrolled: its checked item in view, at once (mounted), then as it's
    // checked (any way: pressed, by keys, or its `value`).
    useEffect(() => {
      const root = ref.current;
      const track = root && trackOf(root);
      if (!isScrolled || !root || !track) return undefined;

      reveal(root, 'instant');
      const observer = new MutationObserver(() => reveal(root, 'smooth'));
      observer.observe(track, {
        attributeFilter: ['data-checked'],
        subtree: true,
      });

      return () => observer.disconnect();
    }, [isScrolled, ref]);

    const handlers = usePointerDrag<HTMLDivElement, DragState>(
      {
        end: (root, state, isCancelled) => {
          const { frame, item, lens } = state;
          lens.cancel();
          if (frame !== undefined) cancelAnimationFrame(frame);
          // (Snapping again, see `start`.)
          delete root.dataset.edgeScrolling;

          if (!isCancelled && item) {
            if (!Object.hasOwn(item.dataset, 'checked')) item.click();
            item.focus({ preventScroll: true });
          }

          release(root, isCancelled ? undefined : item);
        },
        // Held (its lens shown), the touch doesn't scroll. Scrolled, a touch
        // moving first (before its lens shows) scrolls instead: no lens.
        isHolding: (state, position) => {
          if (isScrolled && !state.isMouse && !state.lens.isShown()) {
            yieldToScroll(state, position);
            return false;
          }
          state.lens.move(position);
          return state.lens.isShown();
        },
        move: (root, state, event) => {
          // (Also by its pointer's moves: Chrome holds a touch's moves back
          // within its slop, past the lens' delay.)
          if (isScrolled && !state.isMouse && !state.lens.isShown()) {
            yieldToScroll(state, event);
          }
          if (state.isScrolling) return;
          if (isScrolled && !state.isMouse && !state.lens.isShown()) return;
          state.lens.move(event);
          state.x = event.clientX;
          state.item = press(root, event.clientX);
        },
        start: (root, event) => {
          if (!(event.target instanceof Element)) return undefined;
          const target = event.target.closest('[role="radio"]');
          if (!(target instanceof HTMLElement) || !isEnabled(target)) {
            return undefined;
          }

          // Place the lens at the pointer without a transition, then let it
          // follow without delay; only opacity and scale animate. Shown a
          // moment later (a quick tap only selects, see `delayLens`).
          root.style.setProperty('--uikit-segmented-lens-move-duration', '0s');
          const item = press(root, event.clientX);
          const lens = delayLens(event, () =>
            root.style.setProperty('--uikit-segmented-pressed', '1'),
          );
          const state: DragState = {
            isMouse: event.pointerType === 'mouse',
            item,
            lens,
            start: { x: event.clientX, y: event.clientY },
            x: event.clientX,
          };

          // Scrolled: held near an end, the lens scrolls its items (as
          // menus' do), choosing what comes under it.
          if (isScrolled) {
            const elapsedOf = frameElapsed();
            state.frame = requestAnimationFrame(function scroll(time) {
              state.frame = requestAnimationFrame(scroll);
              const elapsed = elapsedOf(time);
              const scroller = scrollerOf(root);
              if (!scroller || state.isScrolling) return;
              if (!state.isMouse && !lens.isShown()) return;
              const { left, right } = scroller.getBoundingClientRect();
              const delta = edgeScrollDelta(state.x, left, right, elapsed);
              if (delta === 0) return;
              // (Not snapped back each frame: unsnapped until released.)
              root.dataset.edgeScrolling = '';
              const before = scroller.scrollLeft;
              scroller.scrollLeft += delta;
              if (scroller.scrollLeft !== before) {
                state.item = press(root, state.x);
              }
            });
          }

          return state;
        },
      },
      {
        onLostPointerCapture,
        onPointerCancel,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onTouchMove,
      },
    );

    return (
      <BaseRadioGroup
        ref={ref}
        data-glass-context="auto"
        data-hide-separators={hideSeparators ? '' : undefined}
        data-overflow={overflow}
        // Focused by a pointer (its item pressed, see `end`), no ring.
        onFocus={(event) => {
          onFocus?.(event);
          if (isKeyboardFocus()) {
            delete event.currentTarget.dataset.pointerFocus;
          } else event.currentTarget.dataset.pointerFocus = '';
        }}
        {...props}
        {...handlers}
        className={cn('uikit-segmented-root', className)}
        // Its drags don't swipe a sheet (or drawer) away.
        data-base-ui-swipe-ignore=""
        data-segmented-part="root"
      >
        {/* Its items' viewport (scrolled, overflowing), and their track
           (their columns; the highlight's box). */}
        <div
          className="uikit-segmented-scroller"
          data-segmented-part="scroller"
        >
          <div
            className="uikit-segmented-track"
            data-segmented-part="track"
          >
            {children}
          </div>
        </div>
        {/* Positioned by its center, so it stays under the pointer. */}
        <span
          aria-hidden="true"
          className="uikit-segmented-lens"
          data-segmented-part="lens"
        />
      </BaseRadioGroup>
    );
  },
);

const Item = forwardRef<HTMLElement, Omit<SegmentedItemProps, 'ref'>>(
  ({ children, className, ...props }, ref) => {
    const itemProps = useSecondaryClick(props);

    return (
      <BaseRadio.Root
        ref={ref}
        className={cn('uikit-segmented-item', className)}
        data-segmented-part="item"
        {...itemProps}
      >
        {/* Clips the label instead of the (rounded) item, so the item's
           separator is not cut off. A hidden copy of the label at the checked
           weight, in the same grid cell, reserves its width, so the (equal)
           columns and thus the control don't grow when the widest label gets
           checked. */}
        <span
          className="uikit-segmented-label"
          data-segmented-part="label"
        >
          <span
            className="uikit-segmented-label-text"
            data-segmented-part="label-text"
          >
            {children}
          </span>
          <span
            aria-hidden="true"
            className="uikit-segmented-label-reserve"
            data-segmented-part="label-reserve"
          >
            {children}
          </span>
        </span>
      </BaseRadio.Root>
    );
  },
);

// Clipped to the track (its shadow too): in the highlight's
// own box, an item is as wide as the highlight minus its outsets, and the
// track's edges are that many items (plus padding) away. Framework7
// supports up to 10 buttons: each rule at its end matches when at least
// that many items precede the highlight (or the checked item); rules with
// more combinators are more specific, so the highest match wins.
const Highlight = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('uikit-segmented-highlight', className)}
      data-segmented-part="highlight"
      {...props}
    />
  ),
);

export const Segmented = {
  ...BaseRadio,
  Root,
  Item,
  Highlight,
};
