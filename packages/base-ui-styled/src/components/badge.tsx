import { styled } from 'goober';
import { ComponentProps, CSSProperties, forwardRef } from 'react';

import { css } from './utils.js';

// Source: Apple iOS 26 Figma (app icons, “_Badge”): a capsule 24px high, at
// least 24px wide (a circle for a digit), 7px from its ends, in system red,
// its text white, 16px/19px regular. Placed after Framework7's badge: on a
// symbol (its element's: a `Button`'s, a `TabBar.Tab`'s), in Framework7's
// size there (16px, its text 10px semibold, 2px from its ends); without
// one, on its element's top end corner; or inline (e.g. a list row's
// detail); any tint.
//
// Deviations:
// - Without content, a dot (10px; Figma, Framework7 have none; e.g. an
//   unread indicator): on a symbol, centered on its top end corner; inline,
//   centered with the text (by its cap height).
// - On a symbol, it starts 5px before its end, 4px above it (Framework7:
//   10px, 2px, for its larger icons: covering less of a symbol).
// - On an element without a symbol, it starts 14px before its end, 6px
//   above it (a dot: inside the corner, 2px from its edges).
// - On a tab collapsing away, it fades with the tab's content (anything in
//   it): no special case.

/** The anchor of a badge on a symbol (see `badgeOnSymbol`). */
export const badgeSymbolAnchor = '--styled-badge-symbol';

/**
 * Declarations for an element with a symbol (`symbol`, a selector of its
 * descendant) and a corner badge (its child; e.g. a `Button`'s root): the
 * badge on the symbol, in its size there.
 */
export const badgeOnSymbol = (symbol: string): string => css`
  anchor-scope: ${badgeSymbolAnchor};

  & ${symbol} {
    anchor-name: ${badgeSymbolAnchor};
  }

  &:has(${symbol}) {
    & > [data-badge='corner'] {
      --styled-badge-height: 16px;
      --styled-badge-font-size: 10px;
      --styled-badge-line-height: 12px;
      --styled-badge-weight: 590;
      --styled-badge-padding: 0 2px;

      inset-block-start: calc(anchor(start) - var(--styled-badge-symbol-y));
      inset-inline-start: calc(anchor(end) - var(--styled-badge-symbol-x));
      position-anchor: ${badgeSymbolAnchor};
    }
  }
`;

export type BadgeProps = ComponentProps<'span'> & {
  /**
   * On its element's symbol (without one, its top end corner; its element
   * positioned, e.g. a `Button`, a `TabBar.Tab`), or inline.
   * @default 'corner'
   */
  placement?: 'corner' | 'inline';
  /**
   * Its text color (e.g. for a light `tint`).
   * @default white
   */
  textColor?: string;
  /**
   * Its color.
   * @default system red
   */
  tint?: string;
};

const StyledBadge = styled('span', forwardRef)`
  /* On a corner: how far above its element, and from its end; on a symbol:
     how far above it, and before its end. */
  --styled-badge-overhang: 6px;
  --styled-badge-inset: 14px;
  --styled-badge-symbol-x: 5px;
  --styled-badge-symbol-y: 4px;

  display: inline-flex;
  min-width: var(--styled-badge-height, 24px);
  height: var(--styled-badge-height, 24px);
  box-sizing: border-box;
  flex: none;
  align-items: center;
  justify-content: center;
  padding: var(--styled-badge-padding, 2.5px 7px);
  border-radius: 100px;
  background-color: var(--styled-badge-tint, var(--color-ios-system-red));
  color: var(--styled-badge-text-color, #fff);
  font-size: var(--styled-badge-font-size, 16px);
  font-variant-numeric: tabular-nums;
  font-weight: var(--styled-badge-weight, 400);
  letter-spacing: 0;
  line-height: var(--styled-badge-line-height, 19px);
  pointer-events: none;
  white-space: nowrap;

  &:empty {
    --styled-badge-overhang: -2px;
    --styled-badge-inset: 12px;
    --styled-badge-symbol-x: 5px;
    --styled-badge-symbol-y: 5px;

    width: 10px;
    min-width: 0;
    height: 10px;
    padding: 0;
  }

  &[data-badge='corner'] {
    position: absolute;
    z-index: 1;
    inset-block-start: calc(-1 * var(--styled-badge-overhang));
    inset-inline-start: calc(100% - var(--styled-badge-inset));
  }

  &[data-badge='inline'] {
    vertical-align: middle;
  }

  /* An inline dot (its baseline its bottom): its center half the cap height
     above the baseline, as the text's. */
  &[data-badge='inline']:empty {
    vertical-align: calc(0.5cap - 5px);
  }
`;

/**
 * A badge (UIKit `badgeValue`): a count (or short text) in a capsule, or,
 * without content, a dot; on the symbol of a button-like element.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ placement = 'corner', style, textColor, tint, ...props }, ref) => (
    <StyledBadge
      ref={ref}
      data-badge={placement}
      style={
        {
          ...(style as CSSProperties | undefined),
          ...(tint !== undefined && { '--styled-badge-tint': tint }),
          ...(textColor !== undefined && {
            '--styled-badge-text-color': textColor,
          }),
        } as CSSProperties
      }
      {...props}
    />
  ),
);
