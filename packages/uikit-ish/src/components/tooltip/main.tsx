import '../glass/style.css';
import '../typography/style.css';
import './style.css';

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import {
  ComponentProps,
  createContext,
  forwardRef,
  ReactElement,
  RefObject,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';

import { useSettingsPortalProps } from '../settings/main.js';
import {
  cn,
  positionerSide,
  useCollision,
  useForwardedRef,
  usePortalContainer,
} from '../utils/main.js';
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

// A capsule of the menus' glass (Framework7's: a dark panel, white text,
// 4px corners) (see
// `Menu`), its text Subheadline in the glass' content color, 6px by 12px
// in (one line: 32px high, its ends round; more: 16px corners); 8px from
// its trigger, above it (by default), scaling in from it (as menus).
//
// Base UI's `Tooltip`: shown on hover (after 300ms, at once between
// tooltips in a `Tooltip.Provider`) and keyboard focus; on touch (no hover
// there), while its trigger is long-pressed (as iPadOS' toolbar labels:
// shown after 500ms, hidden when lifted, the trigger's tap then not
// taken; see `useLongPress`). Held open (`open`), anchored to any element (`anchor`), it
// labels something for good, on touch too (e.g. a slider's thumb, a
// progress bar's fill).

// Whether its trigger is in a `Provider` (its delay the provider's).
const ProvidedContext = createContext(false);

// Its root's handle (its own, if not given one) and whether it's
// disabled: for its triggers' long press (see `useLongPress`).
const RootContext = createContext<
  { handle: TooltipHandle<unknown>; isDisabled: boolean } | undefined
>(undefined);

/** How long a touch is held before it's a long press, in ms. */
const longPressDelay = 500;
/** How far a touch may move and still be a long press, in px. */
const longPressSlop = 10;

/**
 * On touch, its trigger long-pressed (held `longPressDelay` without moving
 * further than `longPressSlop`, e.g. scrolling), opening it (by its handle);
 * lifted, closing it, the touch's end canceled (no click, nor the mouse
 * events emulated for a tap, which would reopen it as a hover). Moved or
 * lifted before, nothing: the tap is the trigger's.
 */
const useLongPress = (
  ref: RefObject<HTMLElement | null>,
  handle: TooltipHandle<unknown> | undefined,
  triggerId: string,
  isDisabled: boolean,
) => {
  useEffect(() => {
    const { current: trigger } = ref;
    if (!trigger || !handle || isDisabled) return undefined;

    let pointerId: number | undefined;
    let startX = 0;
    let startY = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let isShown = false;
    // Its touch's end after a long press canceled: no mouse events emulated
    // for it (the browser's for a tap: mouseover, mouseenter, which Base UI
    // takes for a hover, reopening it; mousedown, focus, click).
    let isLongPressed = false;
    // A press's listeners (on the window).
    let press = new AbortController();

    const end = () => {
      clearTimeout(timer);
      timer = undefined;
      pointerId = undefined;
      press.abort();
      if (!isShown) return;
      isShown = false;
      handle.close();
    };
    const onPointerDown = (event: PointerEvent) => {
      isLongPressed = false;
      if (event.pointerType !== 'touch' || !event.isPrimary) return;
      end();
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      press = new AbortController();
      const options = { capture: true, signal: press.signal };
      const onEnd = (pointerEvent: PointerEvent) => {
        if (pointerEvent.pointerId === pointerId) end();
      };
      window.addEventListener(
        'pointermove',
        (pointerEvent) => {
          if (pointerEvent.pointerId !== pointerId || isShown) return;
          const distance = Math.hypot(
            pointerEvent.clientX - startX,
            pointerEvent.clientY - startY,
          );
          if (distance > longPressSlop) end();
        },
        options,
      );
      window.addEventListener('pointerup', onEnd, options);
      window.addEventListener('pointercancel', onEnd, options);
      timer = setTimeout(() => {
        timer = undefined;
        isShown = true;
        isLongPressed = true;
        handle.open(triggerId);
      }, longPressDelay);
    };
    // (Android's long press: its context menu, not shown.)
    const onContextMenu = (event: Event) => {
      if (pointerId !== undefined || isShown) event.preventDefault();
    };

    // (Its touch's events, on the element it started on: its trigger.)
    const onTouchEnd = (event: TouchEvent) => {
      if (!isLongPressed) return;
      isLongPressed = false;
      if (event.cancelable) event.preventDefault();
    };

    trigger.addEventListener('pointerdown', onPointerDown);
    trigger.addEventListener('contextmenu', onContextMenu);
    trigger.addEventListener('touchend', onTouchEnd, { passive: false });
    return () => {
      trigger.removeEventListener('pointerdown', onPointerDown);
      trigger.removeEventListener('contextmenu', onContextMenu);
      trigger.removeEventListener('touchend', onTouchEnd);
      end();
    };
  }, [handle, isDisabled, ref, triggerId]);
};

/** Base UI's provider: its tooltips' delays shared (see `Trigger`). */
const Provider = (props: BaseTooltip.Provider.Props): ReactElement => (
  <ProvidedContext.Provider value>
    <BaseTooltip.Provider {...props} />
  </ProvidedContext.Provider>
);

/**
 * Its trigger, opening it after 300ms (Base UI: 600ms) of hovering; in a
 * `Provider`, after the provider's delay; on touch, while long-pressed
 * (see `useLongPress`).
 */
const Trigger = forwardRef<HTMLButtonElement, TooltipTriggerProps>(
  ({ delay, disabled, handle, id, ...props }, ref) => {
    const isProvided = useContext(ProvidedContext);
    const root = useContext(RootContext);
    const triggerRef = useForwardedRef(ref);
    const ownId = useId();
    const triggerId = typeof id === 'string' ? id : ownId;

    useLongPress(
      triggerRef,
      (handle as TooltipHandle<unknown> | undefined) ?? root?.handle,
      triggerId,
      disabled ?? root?.isDisabled ?? false,
    );

    return (
      <BaseTooltip.Trigger
        ref={triggerRef}
        delay={delay ?? (isProvided ? undefined : 300)}
        disabled={disabled}
        handle={handle}
        id={triggerId}
        {...props}
      />
    );
  },
);

const Positioner = forwardRef<HTMLDivElement, TooltipPositionerProps>(
  (
    {
      className,
      collisionBoundary,
      collisionPadding,
      side,
      sideOffset = 8,
      ...props
    },
    ref,
  ) => (
    <BaseTooltip.Positioner
      ref={ref}
      {...useCollision({ collisionBoundary, collisionPadding })}
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
 * Base UI's root, with a handle of its own if not given one (its triggers
 * opening it on a long press, see `Trigger`).
 */
const Root = <Payload,>({
  disabled = false,
  handle,
  ...props
}: BaseTooltip.Root.Props<Payload>): ReactElement => {
  const ownHandle = useCreateTooltipHandle<Payload>();
  const rootHandle = handle ?? ownHandle;
  const value = useMemo(
    () => ({
      handle: rootHandle as TooltipHandle<unknown>,
      isDisabled: disabled,
    }),
    [disabled, rootHandle],
  );

  return (
    <RootContext.Provider value={value}>
      <BaseTooltip.Root
        disabled={disabled}
        handle={rootHandle}
        {...props}
      />
    </RootContext.Provider>
  );
};

/**
 * A tooltip (Base UI's `Tooltip`): a short label in a
 * glass capsule at its trigger, on hover and focus, or held open.
 */
/**
 * Its portal (Base UI's): no box of its own (`display: contents`), so
 * rendered into a container (e.g. a screen laid out as a flex column) it
 * doesn't shift its content.
 */
const Portal = forwardRef<
  HTMLDivElement,
  Omit<BaseTooltip.Portal.Props, 'ref'>
>(({ className, container, ...props }, ref) => (
  <BaseTooltip.Portal
    ref={ref}
    {...useSettingsPortalProps()}
    container={usePortalContainer(container)}
    {...props}
    className={cn('uikit-tooltip-portal', className)}
  />
));

export const Tooltip = {
  ...BaseTooltip,
  Root,
  Provider,
  Portal,
  Trigger,
  Positioner,
  Popup,
  createHandle,
};
