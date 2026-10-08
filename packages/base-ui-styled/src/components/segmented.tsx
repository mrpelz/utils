import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { Properties } from 'csstype';
import { styled } from 'goober';
import { forwardRef } from 'react';

import { glassContext } from './glass.js';
import { colorScheme, css, fontWeight, usePointerDrag, wrap } from './utils.js';

// Source: Apple iOS 26 Figma (“Segmented control”, light and dark
// appearance), with Figma colors mapped to UIKit semantic colors where they
// match: track `tertiarySystemFill`, labels `label`, separators `systemGray`.
// The highlight (`#fff`/`#6c6c71`) has no semantic equivalent.
// Behavior and everything Figma does not specify come from Framework7
// `components/button/button.less` (`.segmented-strong`,
// `.segmented-highlight`) and `button-vars.less` (iOS values): disabled
// opacity, transition durations, `z-index`, item `min-width`
// (`--f7-button-min-width`).
// Additions from Konsta UI `shared/classes/SegmentedClasses.js`:
// `width: 100%`, `pointer-events: none` on the highlight.
//
// Deviations:
// - The track height (36px) is a minimum, not a fixed size.
// - Items are laid out in equal grid columns (Figma: flex items with
//   `flex-grow: 1`), so every column fits the widest label when the
//   control sizes to its content.
// - Items are fully rounded (Figma: 7px radius).
// - The highlight extends 4px on both sides of its item (Figma: -4px left,
//   -3.67px right, a rounding artifact of the 117.33px item width).
// - Separators are drawn at the start of the following item instead of being
//   1px flex items of their own; item labels are wrapped in a span that
//   handles overflow, so the rounded item does not clip its separator.
// - Chained sibling combinators replace Framework7's `:nth-child()`, as Base UI
//   renders a hidden `<input>` next to each radio (and goober mis-nests
//   selectors with a functional pseudo-class before `&`).
// - The highlight is hidden while no item is checked.
// - The browser's default focus ring is kept (Framework7 removes it).
// - Pressing an item turns the selection into a glass lens that follows the
//   pointer and checks the closest item on release, as iOS does (Framework7
//   has no lens here; it's the tab bar's, see `tab-bar.tsx`). It replaces
//   Framework7's pressed background. The lens is drawn above the items and
//   outside the track, so the track doesn't clip its content; the highlight
//   clips itself (and its shadow) to the track, as in Figma. Sideways, it
//   grows by at most twice as much as vertically (wide items).

export type SegmentedRootProps = BaseRadioGroup.Props & {
  /** Hides the separators between unselected items. */
  hideSeparators?: boolean;
};

// eslint-disable-next-line prettier/prettier
const StyledRoot = styled<typeof BaseRadioGroup, SegmentedRootProps>(BaseRadioGroup, forwardRef)`
  --styled-segmented-padding-block: 4px;
  --styled-segmented-padding-inline: 8px;
  --styled-segmented-highlight-outset: 4px;

  ${glassContext()}

  position: relative;
  display: grid;
  width: 100%;
  min-height: 36px;
  box-sizing: border-box;
  align-items: center;
  align-self: center;
  padding: var(--styled-segmented-padding-block)
    var(--styled-segmented-padding-inline);
  border-radius: 100px;
  background-color: var(--color-ios-tertiary-system-fill);
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  touch-action: pan-y;

  ${({ hideSeparators }) =>
    hideSeparators
      ? css`
          [role='radio']::before {
            display: none;
          }
        `
      : undefined}
`;

// Positioned by its center, so it stays under the pointer.
const Lens = styled('span')`
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;

  /* Pressed, it grows by the lens' scale of its height, sideways by at
     most twice as much (the scale of its width would be too much for wide
     items); sized, not scaled, so it stays a capsule. */
  width: calc(
    var(--styled-segmented-lens-width, 0px) +
      (var(--glass-ios-lens-scale) - 1) *
      min(
        var(--styled-segmented-lens-width, 0px),
        2 * var(--styled-segmented-lens-height, 0px)
      ) *
      var(--styled-segmented-pressed, 0)
  );
  height: calc(
    var(--styled-segmented-lens-height, 0px) +
      (var(--glass-ios-lens-scale) - 1) *
      var(--styled-segmented-lens-height, 0px) *
      var(--styled-segmented-pressed, 0)
  );
  border-radius: 100px;
  background-color: var(--styled-glass-lens);
  box-shadow: var(--styled-glass-lens-shadow);
  opacity: var(--styled-segmented-pressed, 0);
  pointer-events: none;
  transition-duration:
    var(--styled-segmented-lens-move-duration, var(--glass-ios-lens-duration)),
    var(--glass-ios-lens-duration), var(--glass-ios-lens-duration),
    var(--glass-ios-lens-duration);
  transition-property: translate, opacity, width, height;
  transition-timing-function: ease-out;
  translate: calc(var(--styled-segmented-lens-x, 0px) - 50%)
    calc(var(--styled-segmented-lens-y, 0px) - 50%);
`;

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
        '--styled-segmented-highlight-outset',
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
    '--styled-segmented-lens-height': `${rect.height}px`,
    '--styled-segmented-lens-start': `${start}px`,
    '--styled-segmented-lens-width': `${width}px`,
    '--styled-segmented-lens-x': `${centerX - paddingLeft}px`,
    '--styled-segmented-lens-y': `${rect.top + rect.height / 2 - rootRect.top - root.clientTop}px`,
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

  root.style.removeProperty('--styled-segmented-lens-move-duration');
  root.style.removeProperty('--styled-segmented-lens-start');
  root.style.removeProperty('--styled-segmented-pressed');
  for (const other of getItems(root)) delete other.dataset.lens;
};

/**
 * The track, containing `Segmented.Item`s and a `Segmented.Highlight`.
 * Renders the glass lens shown while an item is pressed.
 */
const Root = forwardRef<HTMLDivElement, SegmentedRootProps>(
  (
    {
      children,
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
        end: (root, state, cancelled) => {
          const { item } = state;

          if (!cancelled && item) {
            if (!Object.hasOwn(item.dataset, 'checked')) item.click();
            item.focus({ preventScroll: true });
          }

          release(root, cancelled ? undefined : item);
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
          root.style.setProperty('--styled-segmented-lens-move-duration', '0s');
          const item = press(root, event.clientX);
          root.getBoundingClientRect();
          root.style.setProperty('--styled-segmented-pressed', '1');

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
      <StyledRoot
        ref={ref}
        {...props}
        {...handlers}
      >
        {children}
        <Lens aria-hidden="true" />
      </StyledRoot>
    );
  },
);

export type SegmentedItemProps = BaseRadio.Root.Props & {
  cursor?: Properties['cursor'];
};

// eslint-disable-next-line prettier/prettier
const StyledItem = styled<typeof BaseRadio.Root, SegmentedItemProps>(BaseRadio.Root, forwardRef)`
  --styled-cursor: attr(cursor type(\<custom-ident\>), pointer);

  position: relative;
  z-index: 1;
  display: flex;
  min-width: 32px;
  box-sizing: border-box;
  align-items: center;
  align-self: stretch;
  justify-content: center;
  padding: 3px 10px;
  border: 0;
  border-radius: 100px;
  margin: 0;
  appearance: none;
  background-color: transparent;
  color: var(--color-ios-label);
  font-family: inherit;
  font-size: 14px;
  ${fontWeight(510)}
  letter-spacing: -0.08px;
  line-height: 18px;
  text-align: center;
  text-transform: none;
  transform: translate3d(0, 0, 0);
  transition-duration: 100ms;
  user-select: none;

  @media (hover: hover) {
    cursor: var(--styled-cursor);
  }

  [role='radio'] ~ &::before {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    border-radius: 0.5px;
    background-color: var(--color-ios-system-gray);
    content: '';
    inset-inline-start: 0;
    opacity: 0.3;
    transition: opacity 200ms;
  }

  /* Next to the checked item, unless the highlight is a lens elsewhere. */
  &[data-checked]::before,
  [data-checked] + input + &::before {
    opacity: calc(0.3 * var(--styled-segmented-pressed, 0));
  }

  /* Next to the lens. */
  &[data-lens]::before,
  [data-lens] + input + &::before {
    visibility: hidden;
  }

  &[data-checked] {
    ${fontWeight(590)}
  }

  &[data-disabled] {
    opacity: 0.55;
    pointer-events: none;
  }
`;

// Clips the label instead of the (rounded) item, so the item's separator is
// not cut off. A hidden copy of the label at the checked weight, in the same
// grid cell, reserves its width, so the (equal) columns and thus the control
// don't grow when the widest label gets checked.
const Label = styled('span')`
  display: grid;
  min-width: 0;
  grid-template-columns: minmax(0, 1fr);
`;

const labelLayer = css`
  overflow: hidden;
  grid-area: 1 / 1;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LabelText = styled('span')`
  ${labelLayer}
`;

const LabelReserve = styled('span')`
  ${labelLayer}
  ${fontWeight(590)}

  visibility: hidden;
`;

const Item = wrap(
  StyledItem,
  ({ children, ...props }: SegmentedItemProps): SegmentedItemProps => ({
    ...props,
    children: (
      <Label>
        <LabelText>{children}</LabelText>
        <LabelReserve aria-hidden="true">{children}</LabelReserve>
      </Label>
    ),
  }),
);

// Framework7 supports up to 10 buttons. Each rule matches when at least
// `count` items precede the highlight (or the checked item); rules with more
// combinators are more specific, so the highest match wins.
const highlightPositions = Array.from({ length: 9 }, (_, index) => index + 1)
  .map(
    (count) => css`
      ${'[role=radio] ~ '.repeat(count + 1)}& {
        --styled-num: ${count + 1};
      }

      ${'[role=radio] ~ '.repeat(count)}[data-checked] ~ & {
        --styled-active: ${count};
      }
    `,
  )
  .join('');

// Clipped to the track (Figma clips the shadow there): in the highlight's
// own box, an item is as wide as the highlight minus its outsets, and the
// track's edges are that many items (plus padding) away.
const highlightClip = (start: string, end: string) => css`
  clip-path: inset(
    calc(var(--styled-segmented-padding-block) * -1) calc(${end} * -1)
      calc(var(--styled-segmented-padding-block) * -1) calc(${start} * -1) round
      100px
  );
`;

const highlightStart =
  '(var(--styled-segmented-padding-inline) - var(--styled-segmented-highlight-outset) + var(--styled-active) * (100% - var(--styled-segmented-highlight-outset) * 2))';

const highlightEnd =
  '(var(--styled-segmented-padding-inline) - var(--styled-segmented-highlight-outset) + (var(--styled-num) - 1 - var(--styled-active)) * (100% - var(--styled-segmented-highlight-outset) * 2))';

const Highlight = styled('div', forwardRef)`
  --styled-num: 1;
  --styled-active: 0;
  --styled-item-width: calc(
    (100% - var(--styled-segmented-padding-inline) * 2) / var(--styled-num)
  );

  ${highlightClip(highlightStart, highlightEnd)}

  position: absolute;
  z-index: 0;
  top: var(--styled-segmented-padding-block);
  display: none;
  width: calc(
    var(--styled-item-width) + var(--styled-segmented-highlight-outset) * 2
  );
  height: calc(100% - var(--styled-segmented-padding-block) * 2);
  border-radius: 20px;
  ${colorScheme(
    css`
      background-color: #fff;
    `,
    css`
      background-color: #6c6c71;
    `,
  )}
  box-shadow: 0 2px 20px rgb(0 0 0 / 6%);
  inset-inline-start: var(
    --styled-segmented-lens-start,
    calc(
      var(--styled-segmented-padding-inline) - var(
          --styled-segmented-highlight-outset
        ) +
        var(--styled-active) * var(--styled-item-width)
    )
  );
  opacity: calc(1 - var(--styled-segmented-pressed, 0));
  pointer-events: none;
  transition: 200ms;

  &:dir(rtl) {
    ${highlightClip(highlightEnd, highlightStart)}
  }

  [data-checked] ~ & {
    display: block;
  }

  ${highlightPositions}
`;

export const Segmented = {
  ...BaseRadio,
  Root,
  Item,
  Highlight,
};
