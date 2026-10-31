import type {
  MouseEventHandler,
  PointerEventHandler,
  RefObject,
  TouchEventHandler,
} from 'react';

/** Color schemes that `colorSchemeAttribute` on the root element forces. */
export type ColorScheme = 'dark' | 'light';

/** Where popups are portaled into (as Base UI's portals' `container`). */
export type PortalContainer =
  HTMLElement | ShadowRoot | RefObject<HTMLElement | ShadowRoot | null>;

/** A side, logical (as CSS'): the start or end, along the block or inline axis. */
export type LogicalSide =
  'block-end' | 'block-start' | 'inline-end' | 'inline-start';

export type SecondaryClickProps = {
  /**
   * A secondary click: a right click (or Control-click: the `contextmenu`
   * event, whose menu it replaces), or a touch held for 500ms (a long press;
   * a `contextmenu` pointer event of the touch), whose click then
   * doesn't follow. Not while disabled.
   */
  onSecondaryClick?: MouseEventHandler<HTMLElement>;
};

export type SecondaryClickHandlers = {
  disabled?: boolean;
  onClickCapture?: MouseEventHandler<HTMLElement>;
  onContextMenu?: MouseEventHandler<HTMLElement>;
  onLostPointerCapture?: PointerEventHandler<HTMLElement>;
  onPointerCancel?: PointerEventHandler<HTMLElement>;
  onPointerDown?: PointerEventHandler<HTMLElement>;
  onPointerMove?: PointerEventHandler<HTMLElement>;
  onPointerUp?: PointerEventHandler<HTMLElement>;
};

export type PointerHandler<T extends EventTarget> = PointerEventHandler<T>;

/** A pointer's position (e.g. a pointer event's). */
export type PointerPosition = { clientX: number; clientY: number };

/** A press's lens, shown later (see `delayLens`). */
export type DelayedLens = {
  /** Stops it from showing (the press ended). */
  cancel: () => void;
  isShown: () => boolean;
  /** Shows it at once if the pointer moved far enough (a drag). */
  move: (position: PointerPosition) => void;
};

/** Pointer event handler props returned by `usePointerDrag`. */
export type PointerDragHandlers<T extends EventTarget> = {
  onLostPointerCapture: PointerHandler<T>;
  onPointerCancel: PointerHandler<T>;
  onPointerDown: PointerHandler<T>;
  onPointerMove: PointerHandler<T>;
  onPointerUp: PointerHandler<T>;
  /** Not scrolling while the drag holds its pointer (see `isHolding`). */
  onTouchMove: TouchEventHandler<T>;
};

/** Callbacks of a drag gesture tracked by `usePointerDrag`. */
export type PointerDrag<T extends HTMLElement, State> = {
  /**
   * Called on `pointerup` (`cancelled: false`), or on `pointercancel` and
   * `lostpointercapture` (`cancelled: true`).
   */
  end: (element: T, state: State, isCancelled: boolean) => void;
  /**
   * Whether the drag holds its pointer, so its touch doesn't scroll (e.g.
   * once its lens shows), at a touch's move (its position): asked at once,
   * as only the touch move's own event can stop the scrolling.
   */
  isHolding?: (state: State, position: PointerPosition) => boolean;
  /**
   * Called with the element and the latest pointer event of the drag, at
   * most once per animation frame, and once more before `end`.
   */
  move?: (element: T, state: State, event: PointerEvent) => void;
  /**
   * Called on a primary button `pointerdown`; returns the drag's state, or
   * `undefined` to not start a drag.
   */
  start: (element: T, event: PointerEvent) => State | undefined;
};
