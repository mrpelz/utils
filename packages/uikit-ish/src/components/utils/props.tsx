import type { MouseEventHandler, PointerEventHandler, RefObject } from 'react';

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
   * event, whose menu it replaces), or a touch held for 500ms (iOS: a long
   * press; a `contextmenu` pointer event of the touch), whose click then
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

/** Pointer event handler props returned by `usePointerDrag`. */
export type PointerDragHandlers<T extends EventTarget> = {
  onLostPointerCapture: PointerHandler<T>;
  onPointerCancel: PointerHandler<T>;
  onPointerDown: PointerHandler<T>;
  onPointerMove: PointerHandler<T>;
  onPointerUp: PointerHandler<T>;
};

/** Callbacks of a drag gesture tracked by `usePointerDrag`. */
export type PointerDrag<T extends HTMLElement, State> = {
  /**
   * Called on `pointerup` (`cancelled: false`), or on `pointercancel` and
   * `lostpointercapture` (`cancelled: true`).
   */
  end: (element: T, state: State, isCancelled: boolean) => void;
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
