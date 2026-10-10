import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { styled } from 'goober';
import { forwardRef } from 'react';

import { glassMedium } from './glass.js';
import { popupTransition } from './menu.js';
import { textStyle } from './typography.js';
import { css, LogicalSide, positionerSide, useForwardedRef } from './utils.js';

// No Figma (iOS has no tooltips; Framework7's: a dark panel, white text,
// 4px corners): in iOS 26's language, a capsule of the menus' glass (see
// `Menu`), its text Subheadline in the glass' content color, 6px by 12px
// in (one line: 32px high, its ends round; more: 16px corners); 8px from
// its trigger, above it (by default), scaling in from it (as menus).
//
// Base UI's `Tooltip`: shown on hover (after 300ms, at once between
// tooltips in a `Tooltip.Provider`) and keyboard focus, not on touch (no
// hover there: as on iOS, what it says should also be found otherwise, e.g.
// in a popover). Held open (`open`), anchored to any element (`anchor`), it
// labels something for good, on touch too (e.g. a slider's thumb, a
// progress bar's fill).

export type TooltipTriggerProps = Omit<BaseTooltip.Trigger.Props, 'ref'>;

/** Its trigger, opening it after 300ms (Base UI: 600ms) of hovering. */
const Trigger = forwardRef<HTMLButtonElement, TooltipTriggerProps>(
  ({ delay = 300, ...props }, ref) => {
    const triggerRef = useForwardedRef(ref);

    return (
      <BaseTooltip.Trigger
        ref={triggerRef}
        delay={delay}
        {...props}
      />
    );
  },
);

export type TooltipPositionerProps = Omit<
  BaseTooltip.Positioner.Props,
  'ref' | 'side'
> & {
  /**
   * Its side of its anchor (logical).
   * @default 'block-start'
   */
  side?: LogicalSide;
};

const Positioner = forwardRef<HTMLDivElement, TooltipPositionerProps>(
  ({ collisionPadding = 8, side, sideOffset = 8, ...props }, ref) => (
    <BaseTooltip.Positioner
      ref={ref}
      collisionPadding={collisionPadding}
      side={positionerSide(side)}
      sideOffset={sideOffset}
      {...props}
    />
  ),
);

/** A tooltip's surface (also of labels shown as tooltips, e.g. a slider's). */
export const tooltipSurface = css`
  ${glassMedium()}

  max-width: min(320px, calc(100vw - 16px));
  box-sizing: border-box;
  padding: 6px 12px;
  border-radius: 16px;
  color: var(--styled-glass-content);
  pointer-events: none;
  ${textStyle('subheadline')}
`;

// eslint-disable-next-line prettier/prettier
const Popup = styled<typeof BaseTooltip.Popup, BaseTooltip.Popup.Props>(BaseTooltip.Popup, forwardRef)`
  ${tooltipSurface}
  ${popupTransition}
`;

/**
 * A tooltip (Base UI's `Tooltip`; no UIKit equivalent): a short label in a
 * glass capsule at its trigger, on hover and focus, or held open.
 */
export const Tooltip = {
  ...BaseTooltip,
  Trigger,
  Positioner,
  Popup,
};
