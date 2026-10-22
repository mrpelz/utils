import './style.css';

import { forwardRef } from 'react';

import { cn, withStyle } from '../utils/main.js';
import type { BadgeProps } from './props.js';

export type { BadgePlacement, BadgeProps } from './props.js';

// Source: Apple iOS 26 Figma (app icons, “_Badge”): a capsule 24px high, at
// least 24px wide (a circle for a digit), 7px from its ends, in system red,
// its text white, 16px/19px regular. Placed after Framework7's badge: on a
// symbol (`placement` 'symbol', a child of a `Symbol`, e.g. in a
// `Button.Icon` or `TabBar.Icon`), in Framework7's size there (16px, its
// text 10px semibold, 2px from its ends); on its element's top end corner
// (e.g. an `Avatar`'s); or inline (e.g. a list row's detail); any tint.
//
// Deviations:
// - Without content, a dot (10px; Figma, Framework7 have none; e.g. an
//   unread indicator): on a symbol, centered on its top end corner; inline,
//   centered with the text (by its cap height).
// - On a symbol, it starts 5px before its end, 4px above it (Framework7:
//   10px, 2px, for its larger icons: covering less of a symbol).
// - On an element's corner, it starts 14px before its end, 6px above it (a
//   dot: inside the corner, 2px from its edges).
// - On a symbol, it's neither blended nor scaled with it (e.g. a glass
//   button's vibrant content, see `Symbol`).
// - On a tab collapsing away, it fades with its symbol: no special case.

/**
 * A badge (UIKit `badgeValue`): a count (or short text) in a capsule, or,
 * without content, a dot; on a `Symbol` (its child), an element's corner,
 * or inline (`placement`).
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { className, placement = 'corner', style, textColor, tint, ...props },
    ref,
  ) => (
    <span
      ref={ref}
      data-badge={placement}
      style={withStyle(
        {
          '--uikit-badge-text-color': textColor,
          '--uikit-badge-tint': tint,
        },
        style,
      )}
      {...props}
      className={cn('uikit-badge', className)}
    />
  ),
);
