import '../glass/style.css';
import './style.css';

import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { ComponentProps, forwardRef } from 'react';

import { cn, usePointerDrag, useSecondaryClick } from '../utils/main.js';
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
// - The browser's default focus ring is kept (Framework7 removes it).
// - Pressing an item turns the selection into a glass lens that follows the
//   pointer and checks the closest item on release (Framework7 has no lens
//   here; it's the tab bar's, see `tab-bar/main.tsx`). It replaces
//   Framework7's pressed background. The lens is drawn above the items and
//   outside the track, so the track doesn't clip its content; the highlight
//   clips itself (and its shadow) to the track. Sideways, it
//   grows by at most twice as much as vertically (wide items).

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
  const centerX = Math.max(
    Math.min(...rects.map(({ left }) => left)) - outset + width / 2,
    Math.min(
      clientX,
      Math.max(...rects.map(({ right }) => right)) + outset - width / 2,
    ),
  );

  const rootRect = root.getBoundingClientRect();
  const paddingLeft = rootRect.left + root.clientLeft;
  const start =
    getComputedStyle(root).direction === 'rtl'
      ? paddingLeft + root.clientWidth - (centerX + width / 2)
      : centerX - width / 2 - paddingLeft;

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
      onLostPointerCapture,
      onPointerCancel,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      ...props
    },
    ref,
  ) => {
    const handlers = usePointerDrag<HTMLDivElement, { item?: HTMLElement }>(
      {
        end: (root, state, isCancelled) => {
          const { item } = state;

          if (!isCancelled && item) {
            if (!Object.hasOwn(item.dataset, 'checked')) item.click();
            item.focus({ preventScroll: true });
          }

          release(root, isCancelled ? undefined : item);
        },
        move: (root, state, event) => {
          state.item = press(root, event.clientX);
        },
        start: (root, event) => {
          if (!(event.target instanceof Element)) return undefined;
          const target = event.target.closest('[role="radio"]');
          if (!(target instanceof HTMLElement) || !isEnabled(target)) {
            return undefined;
          }

          // Place the lens at the pointer without a transition, then let it
          // follow without delay; only opacity and scale animate.
          root.style.setProperty('--uikit-segmented-lens-move-duration', '0s');
          const item = press(root, event.clientX);
          root.getBoundingClientRect();
          root.style.setProperty('--uikit-segmented-pressed', '1');

          return { item };
        },
      },
      {
        onLostPointerCapture,
        onPointerCancel,
        onPointerDown,
        onPointerMove,
        onPointerUp,
      },
    );

    return (
      <BaseRadioGroup
        ref={ref}
        data-glass-context="auto"
        data-hide-separators={hideSeparators ? '' : undefined}
        {...props}
        {...handlers}
        className={cn('uikit-segmented-root', className)}
        data-segmented-part="root"
      >
        {children}
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
