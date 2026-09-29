import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { Properties } from 'csstype';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { css, wrap } from './utils.js';

// Source: Apple iOS 26 Figma (“Segmented control”, light and dark
// appearance), with Figma colors mapped to UIKit semantic colors where they
// match: track `tertiarySystemFill`, labels `label`, separators `systemGray`.
// The highlight (`#fff`/`#6c6c71`) has no semantic equivalent.
// Behavior and everything Figma does not specify come from Framework7
// `components/button/button.less` (`.segmented-strong`,
// `.segmented-highlight`) and `button-vars.less` (iOS values): pressed
// background, disabled opacity, transition durations, `z-index`, item
// `min-width` (`--f7-button-min-width`).
// Additions from Konsta UI `shared/classes/SegmentedClasses.js`:
// `width: 100%`, `pointer-events: none` on the highlight.
//
// Deviations:
// - The track height (36px) is a minimum, not a fixed size.
// - Items are laid out in equal grid columns (Figma: flex items with
//   `flex-grow: 1`), so every column fits the widest label when the
//   control sizes to its content.
// - Items (i.e. their pressed background) are fully rounded and, via
//   horizontally offset box shadows, extend as far as the highlight
//   (Figma: 7px radius, no outset).
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
// - `:active` replaces Framework7's JS-driven `.active-state`.

export type SegmentedRootProps = BaseRadioGroup.Props;

const Root = styled(BaseRadioGroup, forwardRef)`
  --styled-segmented-padding-block: 4px;
  --styled-segmented-padding-inline: 8px;
  --styled-segmented-highlight-outset: 4px;

  position: relative;
  display: grid;
  overflow: hidden;
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
`;

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
  font-weight: 510;
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
  }

  &[data-checked]::before,
  &:active::before,
  [data-checked] + input + &::before,
  [role='radio']:active + input + &::before {
    visibility: hidden;
  }

  &:active {
    --styled-pressed-color: rgb(0 0 0 / 7%);

    background-color: var(--styled-pressed-color);
    box-shadow:
      calc(var(--styled-segmented-highlight-outset) * -1) 0 0 0
        var(--styled-pressed-color),
      var(--styled-segmented-highlight-outset) 0 0 0 var(--styled-pressed-color);

    @media (prefers-color-scheme: dark) {
      --styled-pressed-color: rgb(255 255 255 / 4%);
    }
  }

  &[data-checked] {
    font-weight: 590;
  }

  &[data-disabled] {
    opacity: 0.55;
    pointer-events: none;
  }
`;

// Clips the label instead of the (rounded) item, so the item's separator is
// not cut off.
const Label = styled('span')`
  overflow: hidden;
  min-width: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Item = wrap(
  StyledItem,
  ({ children, ...props }: SegmentedItemProps): SegmentedItemProps => ({
    ...props,
    children: <Label>{children}</Label>,
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

const Highlight = styled('div', forwardRef)`
  --styled-num: 1;
  --styled-active: 0;
  --styled-item-width: calc(
    (100% - var(--styled-segmented-padding-inline) * 2) / var(--styled-num)
  );

  position: absolute;
  z-index: 0;
  top: var(--styled-segmented-padding-block);
  display: none;
  width: calc(
    var(--styled-item-width) + var(--styled-segmented-highlight-outset) * 2
  );
  height: calc(100% - var(--styled-segmented-padding-block) * 2);
  border-radius: 20px;
  background-color: #fff;
  box-shadow: 0 2px 20px rgb(0 0 0 / 6%);
  inset-inline-start: calc(
    var(--styled-segmented-padding-inline) - var(
        --styled-segmented-highlight-outset
      ) +
      var(--styled-active) * var(--styled-item-width)
  );
  pointer-events: none;
  transition: 200ms;

  @media (prefers-color-scheme: dark) {
    background-color: #6c6c71;
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
