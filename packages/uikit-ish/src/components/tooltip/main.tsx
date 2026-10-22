import '../glass/style.css';
import '../typography/style.css';
import './style.css';

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import {
  ComponentProps,
  createContext,
  forwardRef,
  ReactElement,
  useContext,
  useState,
} from 'react';

import { cn, positionerSide, useForwardedRef } from '../utils/main.js';
import type {
  TooltipHandle,
  TooltipPositionerProps,
  TooltipTriggerProps,
} from './props.js';

export type {
  TooltipHandle,
  TooltipPositionerProps,
  TooltipTriggerProps,
} from './props.js';

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

// Whether its trigger is in a `Provider` (its delay the provider's).
const ProvidedContext = createContext(false);

/** Base UI's provider: its tooltips' delays shared (see `Trigger`). */
const Provider = (props: BaseTooltip.Provider.Props): ReactElement => (
  <ProvidedContext.Provider value>
    <BaseTooltip.Provider {...props} />
  </ProvidedContext.Provider>
);

/**
 * Its trigger, opening it after 300ms (Base UI: 600ms) of hovering; in a
 * `Provider`, after the provider's delay.
 */
const Trigger = forwardRef<HTMLButtonElement, TooltipTriggerProps>(
  ({ delay, ...props }, ref) => {
    const provided = useContext(ProvidedContext);
    const triggerRef = useForwardedRef(ref);

    return (
      <BaseTooltip.Trigger
        ref={triggerRef}
        delay={delay ?? (provided ? undefined : 300)}
        {...props}
      />
    );
  },
);

const Positioner = forwardRef<HTMLDivElement, TooltipPositionerProps>(
  (
    { className, collisionPadding = 8, side, sideOffset = 8, ...props },
    ref,
  ) => (
    <BaseTooltip.Positioner
      ref={ref}
      collisionPadding={collisionPadding}
      side={positionerSide(side)}
      sideOffset={sideOffset}
      {...props}
      className={cn('uikit-tooltip-positioner', className)}
    />
  ),
);

const Popup = forwardRef<
  HTMLDivElement,
  Omit<ComponentProps<typeof BaseTooltip.Popup>, 'ref'>
>(({ className, ...props }, ref) => (
  <BaseTooltip.Popup
    ref={ref}
    data-tooltip-part="popup"
    className={cn(
      'uikit-tooltip-popup uikit-tooltip-surface uikit-glass-medium uikit-popup-transition',
      className,
    )}
    {...props}
  />
));

/**
 * A handle linking a tooltip to its triggers outside it, and opening or
 * closing it imperatively (Base UI's `Tooltip.createHandle`): pass it to
 * the root's and the triggers' `handle` (in a component, see
 * `useCreateTooltipHandle`).
 */
const createHandle = <Payload = unknown,>(): TooltipHandle<Payload> =>
  BaseTooltip.createHandle<Payload>();

/** `Tooltip.createHandle`, in a component: made once, for its lifetime. */
export const useCreateTooltipHandle = <
  Payload = unknown,
>(): TooltipHandle<Payload> => {
  const [handle] = useState(() => createHandle<Payload>());
  return handle;
};

/**
 * A tooltip (Base UI's `Tooltip`; no UIKit equivalent): a short label in a
 * glass capsule at its trigger, on hover and focus, or held open.
 */
export const Tooltip = {
  ...BaseTooltip,
  Provider,
  Trigger,
  Positioner,
  Popup,
  createHandle,
};
