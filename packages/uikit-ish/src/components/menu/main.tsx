import '../glass/style.css';
import './style.css';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { BaseUIEvent } from '@base-ui/react/types';
import {
  ComponentProps,
  createContext,
  forwardRef,
  MouseEvent as ReactMouseEvent,
  PointerEvent,
  ReactNode,
  Ref,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  cn,
  draggingAttribute,
  edgeScrollDelta,
  frameElapsed,
  MovingHighlight,
  positionerSide,
  useCollision,
  useForwardedRef,
  useGrowAvoidance,
  usePortalContainer,
  useSecondaryClick,
} from '../utils/main.js';
import type {
  Finger,
  ItemProps,
  MenuContextValue,
  MenuHandle,
  MenuPositionerProps,
  MenuRootProps,
  SpanProps,
  TriggerProps,
} from './props.js';

export type {
  MenuHandle,
  MenuPositionerProps,
  MenuRootProps,
  Size,
  TriggerProps as MenuTriggerProps,
} from './props.js';

// Menus (compact and regular): items, section titles, separators, quick
// actions and shortcuts, light and dark, with the destructive color mapped
// to `systemRed`; the “Medium” glass material and the vibrant content
// colors are tokens in `styles.css`, used via `glass/main.tsx`
// (`glassMedium`).
//
// Menus close when their anchor or popup leaves the viewport; popups taller
// than the space beside their trigger grow over it (see
// `useGrowAvoidance`), scrolling only taller than the screen (Framework7
// `popover.less`: `.popover-inner`).
//
// Symbols are in the Body (compact) and Subheadline (regular) text styles;
// labels, subtitles, section titles, shortcuts and quick action labels
// differ from the text styles in line height or tracking.
//
// Also:
// - The root's `size` (a size class) switches between the phone
//   (`compact`) and the tablet (`regular`) menu, for all its popups:
//   - `compact`: 40px items with 17px labels; submenus open over their
//     trigger (which stays visible, its chevron turned down; without room
//     below it, covered), covering the items below it; a press outside one
//     closes it alone. Items are inset 8px from the popup's edge.
//   - `regular`: 36px items with 15px labels; submenus open beside their
//     trigger, which shows the selection while open.
// - Popups are at least 238px wide.
// - A checkmark column is reserved in all items of a popup containing
//   checkbox or radio items.
// - Highlighted items and quick actions (pointer, keyboard) show the
//   selection.
// - The popup's corners are concentric with the item selections (pills):
//   the pill's radius plus the insets, 28px/30px (compact) and 26px/28px
//   (regular) on the inline/block axes; quick actions 10px less.
// - While a compact submenu covers its parent, the parent's items but the
//   trigger fade, and the submenu has no background of its own (it's on its
//   parent's glass, whose background it would compound).
// - Quick action symbols are 17px (compact) and 15px (regular).
// - The checkmark and chevrons are drawn as SVG strokes.
// - The popup is Framework7's popover glass (background, backdrop blur and
//   glass effect, see `glassMedium`), and scales in and out as a Framework7
//   popover.

/** Shared by `Menu` and `EditMenu` (internal). */
export const MenuContext = createContext<MenuContextValue>({
  orientation: 'vertical',
  size: 'compact',
});

/**
 * The root menu's actions (`actionsRef`, or an own one), for positioners to
 * close it (internal).
 */
export const useRootActions = (
  actionsRef?: RefObject<BaseMenu.Root.Actions | null>,
): RefObject<BaseMenu.Root.Actions | null> => {
  const ownActionsRef = useRef<BaseMenu.Root.Actions | null>(null);

  return actionsRef ?? ownActionsRef;
};

/** Sets a (forwarded) ref, a callback or an object. */
const assignRef = <T,>(ref: Ref<T> | undefined, value: T | null) => {
  if (typeof ref === 'function') ref(value);
  else if (ref) (ref as { current: T | null }).current = value;
};

/** An open submenu (see `OpenSubmenus`). */
type OpenSubmenu = {
  close: () => void;
  /** Whether a press's target is in it (its popup, its trigger). */
  contains: (target: Node) => boolean;
};

/**
 * The open submenus a press outside closes one by one (innermost first),
 * not the whole menu: compact ones (covering their parents), or, `all`,
 * every one (an edit menu's; internal, see `useSubmenuOutsidePress`,
 * `useKeepOpenInSubmenus`).
 */
export type OpenSubmenus = {
  add: (submenu: OpenSubmenu) => void;
  all: boolean;
  /**
   * The submenu a press outside closes (the innermost, the press outside
   * it), decided once per press (Base UI tells each open menu of it, a
   * mouse's press twice: its `pointerdown`, then its `mousedown`).
   */
  closing: (event: Event) => OpenSubmenu | undefined;
  innermost: () => OpenSubmenu | undefined;
  remove: (close: () => void) => void;
};

/** Whether `event` is `decided`'s press (itself, or its `mousedown`). */
const isSamePress = (decided: Event, event: Event) =>
  decided === event ||
  (decided.type === 'pointerdown' &&
    event.type === 'mousedown' &&
    decided.target === event.target);

export const createOpenSubmenus = (all = false): OpenSubmenus => {
  let open: OpenSubmenu[] = [];
  let decided: { event: Event; submenu?: OpenSubmenu } | undefined;
  return {
    add: (submenu) => {
      open = [...open.filter(({ close }) => close !== submenu.close), submenu];
    },
    all,
    closing: (event) => {
      if (!decided || !isSamePress(decided.event, event)) {
        const innermost = open.at(-1);
        const { target } = event;
        decided = {
          event,
          submenu:
            innermost && target instanceof Node && !innermost.contains(target)
              ? innermost
              : undefined,
        };
      }
      return decided.submenu;
    },
    innermost: () => open.at(-1),
    remove: (close) => {
      open = open.filter((submenu) => submenu.close !== close);
    },
  };
};

/** The root's open submenus (internal; Menu's, EditMenu's). */
export const OpenSubmenusContext = createContext<OpenSubmenus | undefined>(
  undefined,
);

/** How long after a stopped press its following events are too (ms). */
const pressTail = 600;

/**
 * An open submenu (see `OpenSubmenus`), a press outside it (on the menus
 * it covers, the page, or a modal menu's backdrop) closes it alone, as the
 * pointer is released, doing nothing else: the whole press stopped and its
 * defaults prevented (e.g. a mouse's keeping the page's selection), at the
 * window, capturing: before Base UI's own listeners, which close menus by
 * pointer type, iOS' taps on a backdrop differently (it sends them no
 * mouse events), and before the page's (internal, see `Root`).
 */
export const useSubmenuOutsidePress = (submenus: OpenSubmenus): void => {
  useEffect(() => {
    // The press stopped (its pointer), and when it ended: its mouse events,
    // touches and click follow (each browser in its order).
    let pointerId: number | undefined;
    let endedAt = Number.NEGATIVE_INFINITY;

    const stop = (event: Event) => {
      if (event.cancelable) event.preventDefault();
      event.stopPropagation();
    };

    const onPointerDown = (event: globalThis.PointerEvent) => {
      const open = submenus.innermost();
      const { target } = event;
      pointerId =
        open && target instanceof Node && !open.contains(target)
          ? event.pointerId
          : undefined;
      if (pointerId !== undefined) stop(event);
    };

    const onPointerUp = (event: globalThis.PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      pointerId = undefined;
      endedAt = event.timeStamp;
      stop(event);
      submenus.innermost()?.close();
    };

    const onPointerCancel = (event: globalThis.PointerEvent) => {
      if (event.pointerId === pointerId) pointerId = undefined;
    };

    const onFollowing = (event: Event) => {
      if (pointerId !== undefined || event.timeStamp - endedAt < pressTail) {
        stop(event);
      }
    };

    const listeners: [string, (event: Event) => void][] = [
      ['pointerdown', onPointerDown as (event: Event) => void],
      ['pointerup', onPointerUp as (event: Event) => void],
      ['pointercancel', onPointerCancel as (event: Event) => void],
      ...['mousedown', 'mouseup', 'click', 'touchstart', 'touchend'].map(
        (type): [string, (event: Event) => void] => [type, onFollowing],
      ),
    ];
    for (const [type, listener] of listeners) {
      addEventListener(type, listener, { capture: true, passive: false });
    }
    return () => {
      for (const [type, listener] of listeners) {
        removeEventListener(type, listener, { capture: true });
      }
    };
  }, [submenus]);
};

/**
 * A root menu's `onOpenChange`, not closing it for a press in one of its
 * submenus (in portals): Base UI tells those from presses outside by React's
 * event bubbling through portals, which Preact's portals lack, so it'd close
 * the whole menu, e.g. as a submenu's checkbox item is toggled (internal;
 * Menu's, EditMenu's). A compact submenu open, a press outside it (on its
 * parent's items, or outside the menu) closes it alone (its trigger's own,
 * see `useSubmenuToggle`).
 */
export const useKeepOpenInSubmenus = (
  onOpenChange?: (
    isOpen: boolean,
    details: BaseMenu.Root.ChangeEventDetails,
  ) => void,
  submenus?: OpenSubmenus,
): ((isOpen: boolean, details: BaseMenu.Root.ChangeEventDetails) => void) =>
  useCallback(
    (isOpen: boolean, details: BaseMenu.Root.ChangeEventDetails) => {
      const { event, reason } = details;
      const target = event.target instanceof Element ? event.target : null;
      if (!isOpen && reason === 'outside-press' && target) {
        const closing = submenus?.closing(event);
        if (closing) {
          details.cancel();
          closing.close();
          return;
        }
        if (target.closest('[role="menu"]') !== null) {
          details.cancel();
          return;
        }
      }
      onOpenChange?.(isOpen, details);
    },
    [submenus, onOpenChange],
  );

const Root = <Payload,>({
  onOpenChange,
  size = 'compact',
  ...props
}: MenuRootProps<Payload>): ReactNode => {
  const actionsRef = useRootActions(props.actionsRef);
  const [submenus] = useState(() => createOpenSubmenus());
  useSubmenuOutsidePress(submenus);
  const onRootOpenChange = useKeepOpenInSubmenus(onOpenChange, submenus);

  return (
    <MenuContext.Provider value={{ actionsRef, orientation: 'vertical', size }}>
      <OpenSubmenusContext.Provider value={submenus}>
        <BaseMenu.Root
          {...props}
          actionsRef={actionsRef}
          onOpenChange={onRootOpenChange}
        />
      </OpenSubmenusContext.Provider>
    </MenuContext.Provider>
  );
};

// A click this soon (ms) after hovering opened a submenu means to open it
// (it was on its way), not to close it.
const hoverConfirm = 400;

type SubmenuPress = { isOpen: boolean; pointerType: string };

/**
 * A submenu's own actions and how it opened, for its trigger to close it
 * when pressed again (internal, see `SubmenuTrigger`).
 */
type SubmenuToggle = {
  close: () => void;
  /** Whether a press's target is in it (its popup, its trigger). */
  contains: (target: Node) => boolean;
  /** Just opened by hovering (a click then confirms it, see below). */
  isJustHovered: () => boolean;
  press: (press: SubmenuPress) => void;
  /** Its popup's and its trigger's elements (see `contains`). */
  setPopup: (popup: HTMLElement | null) => void;
  setTrigger: (trigger: HTMLElement | null) => void;
  /** The last press (once). */
  takePress: () => SubmenuPress | undefined;
};

const SubmenuToggleContext = createContext<SubmenuToggle | undefined>(
  undefined,
);

const SubmenuRoot = ({
  actionsRef: actionsRefProp,
  onOpenChange,
  ...props
}: BaseMenu.SubmenuRoot.Props): ReactNode => {
  const { actionsRef, orientation, size } = useContext(MenuContext);
  const submenus = useContext(OpenSubmenusContext);
  const submenuActionsRef = useRootActions(actionsRefProp);
  // When hovering opened it (ms, the event's time base), if it did.
  const hoveredOpen = useRef<number | undefined>(undefined);
  const pressed = useRef<SubmenuPress | undefined>(undefined);
  const popupRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const toggle = useMemo<SubmenuToggle>(
    () => ({
      close: () => submenuActionsRef.current?.close(),
      contains: (target: Node) =>
        (popupRef.current?.contains(target) ?? false) ||
        (triggerRef.current?.contains(target) ?? false),
      isJustHovered: () =>
        hoveredOpen.current !== undefined &&
        performance.now() - hoveredOpen.current < hoverConfirm,
      press: (press: SubmenuPress) => {
        pressed.current = press;
      },
      setPopup: (popup: HTMLElement | null) => {
        popupRef.current = popup;
      },
      setTrigger: (trigger: HTMLElement | null) => {
        triggerRef.current = trigger;
      },
      takePress: () => {
        const press = pressed.current;
        pressed.current = undefined;
        return press;
      },
    }),
    [submenuActionsRef],
  );

  return (
    <MenuContext.Provider
      value={{
        actionsRef,
        orientation: 'vertical',
        // (An edit menu's: its `size`.)
        size,
        submenu: orientation,
      }}
    >
      <SubmenuToggleContext.Provider value={toggle}>
        <BaseMenu.SubmenuRoot
          {...props}
          actionsRef={submenuActionsRef}
          onOpenChange={(
            isOpen: boolean,
            details: BaseMenu.SubmenuRoot.ChangeEventDetails,
          ) => {
            hoveredOpen.current =
              isOpen && details.reason === 'trigger-hover'
                ? performance.now()
                : undefined;
            // Open, the innermost (see `OpenSubmenus`): compact ones
            // (covering their parent), or all (an edit menu's); a press
            // outside closes the innermost alone.
            const isCompact = size === 'compact' && orientation === 'vertical';
            const isTracked = submenus && (submenus.all || isCompact);
            if (
              isTracked &&
              !isOpen &&
              details.reason === 'outside-press' &&
              submenus.closing(details.event)?.close !== toggle.close
            ) {
              details.cancel();
              return;
            }
            if (isTracked) {
              if (isOpen) {
                submenus.add({
                  close: toggle.close,
                  contains: toggle.contains,
                });
              } else {
                submenus.remove(toggle.close);
              }
            }
            onOpenChange?.(isOpen, details);
          }}
        />
      </SubmenuToggleContext.Provider>
    </MenuContext.Provider>
  );
};

/**
 * The enabled menu item at a point, in the topmost menu there (also beneath
 * a modal menu's backdrop; not of a menu a submenu covers).
 */
const menuItemAt = (x: number, y: number) => {
  for (const element of document.elementsFromPoint(x, y)) {
    if (!element.closest('[role="menu"]')) continue;

    const item = element.closest('[role^="menuitem"]');
    return item instanceof HTMLElement && !item.matches('[data-disabled]')
      ? item
      : undefined;
  }

  return undefined;
};

const isSubmenuTrigger = (item: HTMLElement) =>
  item.getAttribute('aria-haspopup') === 'menu';

const isExpanded = (item: HTMLElement) =>
  item.getAttribute('aria-expanded') === 'true';

/**
 * Hovers an element (or stops hovering it) as a mouse would: Base UI
 * highlights an item a mouse hovers (and opens its submenu), and removes the
 * highlight when the mouse leaves it.
 */
const hover = (
  element: HTMLElement,
  isEntering: boolean,
  { movementX, movementY, x, y }: Finger,
) => {
  const types = isEntering
    ? (['over', 'enter', 'move'] as const)
    : (['out', 'leave'] as const);

  for (const type of types) {
    // At the finger: Base UI keeps submenus open by the pointer's path,
    // and ignores moves without movement in WebKit.
    const init = {
      bubbles: type !== 'enter' && type !== 'leave',
      clientX: x,
      clientY: y,
      movementX,
      movementY,
    };
    element.dispatchEvent(
      // (`PointerEvent` is React's type here.)
      new globalThis.PointerEvent(`pointer${type}`, {
        ...init,
        pointerType: 'mouse',
      }),
    );
    element.dispatchEvent(new MouseEvent(`mouse${type}`, init));
  }
};

/** The menu at a point (the topmost there). */
const menuAt = (x: number, y: number) =>
  document
    .elementsFromPoint(x, y)
    .map((element) => element.closest<HTMLElement>('[role="menu"]'))
    .find(Boolean);

const pixels = (value: string) => Number.parseFloat(value) || 0;

// How far (px) a finger moves before it's dragging (see `dragOverItems`).
const dragSlop = 10;

// Keeps a touch from scrolling (dragging over menus).
const keepScroll = (event: TouchEvent) => {
  if (event.cancelable) event.preventDefault();
};

// The mouse events a touch emulates after it ends: iOS WebKit sends its
// mouse down and up (which Base UI's trigger toggles its menu on, closing
// it again) despite the pointer down's `preventDefault`, then its click.
const emulatedTypes = ['mousedown', 'mouseup', 'click'] as const;

// Keeps a (trusted) emulated mouse event from its target.
const keepTrustedMouse = (event: MouseEvent) => {
  if (!event.isTrusted) return;
  event.preventDefault();
  event.stopPropagation();
};

/**
 * How long (ms) a finger rests on a submenu's item before it opens (see
 * `dragOverItems`): longer than Base UI's hover delay, so a submenu that
 * opens on hover (regular) has by then.
 */
const submenuDwell = 300;

/** A press's click (see `dragOverItems`). */
const pressClick = (item: HTMLElement) => {
  // (Not `click()`'s: Base UI takes a click without a click count for a
  // screen reader's, highlighting a submenu's first item as it opens.)
  item.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: 1,
      view: item.ownerDocument.defaultView,
    }),
  );
};

/** A menu's element scrolling its items (itself, unless it marks one). */
const scrollerOf = (menu: HTMLElement) =>
  menu.querySelector<HTMLElement>('[data-menu-part=scroller]') ?? menu;

/**
 * Drags a touch (`pointerId`) over menus' items, from `start` (if given, it
 * hovers the item there right away): the finger hovers the items as a mouse
 * would (see `hover`), so only the item under it is highlighted, and resting
 * on a submenu's item opens the submenu (by hover, or else pressed after
 * `submenuDwell`), to drag on into; released, the item
 * there is clicked. Held near an end of a menu that scrolls (either way), the
 * finger scrolls it (as the tab bar's lens does). The touch's own clicks are
 * kept from the items (internal; Menu's trigger, EditMenu). Released outside
 * every menu after dragging (moved past `dragSlop`, or over a menu), it calls
 * `onReleaseOutside` (e.g. closing the menu, as Base UI does for a mouse
 * pressed on the trigger and released elsewhere).
 */
export const dragOverItems = (
  document: Document,
  pointerId: number,
  start?: { x: number; y: number },
  onReleaseOutside?: (x: number, y: number) => void,
): void => {
  let item: HTMLElement | undefined;
  // The open submenu's item the touch began on, if any (see below).
  let openAtStart: HTMLElement | undefined;
  // Resting on a submenu's item that hover doesn't open (compact): opening
  // it (see `submenuDwell`).
  let dwell: ReturnType<typeof setTimeout> | undefined;
  let isFirst = true;
  const types = ['pointermove', 'pointerup', 'pointercancel'] as const;
  // The touch's boundary events, kept from Base UI as its moves are.
  const boundaryTypes = [
    'pointerover',
    'pointerout',
    'pointerenter',
    'pointerleave',
  ] as const;
  let finger: Finger | undefined;
  // Where the finger first moved, and whether it has dragged since.
  let origin: { x: number; y: number } | undefined;
  let hasDragged = false;
  // The menu the finger was last over, which it scrolls beyond its ends.
  let menu: HTMLElement | undefined;
  document.documentElement.setAttribute(draggingAttribute, '');
  // No scrolling while dragging (e.g. from a trigger held: see `Trigger`).
  document.addEventListener('touchmove', keepScroll, {
    capture: true,
    passive: false,
  });

  const update = () => {
    if (!finger) return;

    menu = menuAt(finger.x, finger.y) ?? menu;
    origin ??= { x: finger.x, y: finger.y };
    hasDragged ||=
      menu !== undefined ||
      Math.hypot(finger.x - origin.x, finger.y - origin.y) > dragSlop;
    const next = menuItemAt(finger.x, finger.y);
    if (isFirst) {
      isFirst = false;
      if (next && isSubmenuTrigger(next) && isExpanded(next)) {
        openAtStart = next;
      }
    }
    if (next === item) return;

    // Leaving an open submenu's item (into it) resets the submenu's
    // highlight in Base UI: it stays hovered, as the submenu is.
    if (item && !(isSubmenuTrigger(item) && isExpanded(item))) {
      hover(item, false, finger);
    }
    item = next;
    clearTimeout(dwell);
    if (!item) return;
    hover(item, true, finger);
    if (isSubmenuTrigger(item) && !isExpanded(item)) {
      const rested = item;
      dwell = setTimeout(() => {
        if (rested === item && !isExpanded(rested)) pressClick(rested);
      }, submenuDwell);
    }
  };

  const elapsedOf = frameElapsed();
  let frame = requestAnimationFrame(function scroll(time) {
    frame = requestAnimationFrame(scroll);
    const elapsed = elapsedOf(time);
    if (!finger || !menu?.isConnected) return;

    // Its ends are inside its scroll padding (e.g. EditMenu's “more”).
    const scroller = scrollerOf(menu);
    const { bottom, left, right, top } = scroller.getBoundingClientRect();
    const style = getComputedStyle(scroller);
    const { scrollLeft, scrollTop } = scroller;
    if (scroller.scrollWidth > scroller.clientWidth) {
      scroller.scrollLeft += edgeScrollDelta(
        finger.x,
        left + pixels(style.scrollPaddingLeft),
        right - pixels(style.scrollPaddingRight),
        elapsed,
      );
    }
    if (scroller.scrollHeight > scroller.clientHeight) {
      scroller.scrollTop += edgeScrollDelta(
        finger.y,
        top + pixels(style.scrollPaddingTop),
        bottom - pixels(style.scrollPaddingBottom),
        elapsed,
      );
    }
    // The items moved under the finger.
    if (
      scroller.scrollLeft !== scrollLeft ||
      scroller.scrollTop !== scrollTop
    ) {
      update();
    }
  });

  // Released: the item there clicked; dragged out of the menus and released
  // there, nothing chosen.
  const release = ({ clientX: x, clientY: y }: globalThis.PointerEvent) => {
    if (!item) {
      if (hasDragged && !menuAt(x, y)) onReleaseOutside?.(x, y);
      return;
    }

    // An open submenu stays open (clicking its item would close it), unless
    // it was already open as the touch began on its item: pressed again, it
    // closes (see `SubmenuTrigger`).
    if (!isSubmenuTrigger(item) || !isExpanded(item) || item === openAtStart) {
      pressClick(item);
    }
  };

  const listener = (pointerEvent: globalThis.PointerEvent) => {
    // Not the drag's own (synthetic) hovering.
    if (!pointerEvent.isTrusted) return;
    if (pointerEvent.pointerId !== pointerId) return;
    if (
      pointerEvent.type === 'pointermove' ||
      (boundaryTypes as readonly string[]).includes(pointerEvent.type)
    ) {
      // The drag hovers the items itself (Base UI ends hovering on
      // touch moves, and as the touch leaves elements).
      pointerEvent.stopPropagation();
      if (pointerEvent.type !== 'pointermove') return;

      const x = pointerEvent.clientX;
      const y = pointerEvent.clientY;
      finger = {
        // At least a pixel, also when only scrolling moves the items.
        movementX: x - (finger?.x ?? x) || 1,
        movementY: y - (finger?.y ?? y) || 1,
        x,
        y,
      };
      update();
      return;
    }

    cancelAnimationFrame(frame);
    clearTimeout(dwell);
    for (const type of [...types, ...boundaryTypes]) {
      document.removeEventListener(type, listener, { capture: true });
    }
    document.documentElement.removeAttribute(draggingAttribute);
    document.removeEventListener('touchmove', keepScroll, { capture: true });
    if (pointerEvent.type !== 'pointerup') return;

    // The touch's own click (on the element touched, if released there) is
    // the drag's to make; its emulated mouse down and up, nobody's.
    for (const type of emulatedTypes) {
      document.addEventListener(type, keepTrustedMouse, { capture: true });
    }
    setTimeout(() => {
      for (const type of emulatedTypes) {
        document.removeEventListener(type, keepTrustedMouse, {
          capture: true,
        });
      }
    }, 500);

    release(pointerEvent);
  };

  for (const type of [...types, ...boundaryTypes]) {
    document.addEventListener(type, listener, { capture: true });
  }
  if (start) {
    finger = { movementX: 1, movementY: 1, ...start };
    update();
  }
};

/**
 * Presses a menu's trigger as a mouse does (Base UI opens, or closes, its
 * menu on a mouse down).
 */
const pressTrigger = (trigger: HTMLElement) => {
  trigger.dispatchEvent(
    new MouseEvent('mousedown', {
      bubbles: true,
      button: 0,
      cancelable: true,
      // (A press, not a screen reader's: Base UI takes a mouse down
      // without a click count for one, highlighting the first item.)
      detail: 1,
      view: trigger.ownerDocument.defaultView,
    }),
  );
};

/**
 * Opens a menu by its trigger (`trigger`) as Base UI does on a mouse down;
 * a touch (`pointerId`) then drags over its items (see `dragOverItems`).
 */
const openByTrigger = (trigger: HTMLElement, pointerId?: number) => {
  const document = trigger.ownerDocument;
  if (trigger.getAttribute('aria-expanded') !== 'true') pressTrigger(trigger);
  if (pointerId === undefined) return;

  // Touch captures the pointer to the trigger; the menu's items are
  // hit-tested instead.
  if (trigger.hasPointerCapture(pointerId)) {
    trigger.releasePointerCapture(pointerId);
  }
  // Dragged out and released elsewhere (also back on the trigger): closed,
  // as Base UI closes it for a mouse.
  dragOverItems(document, pointerId, undefined, () => {
    if (trigger.getAttribute('aria-expanded') === 'true') pressTrigger(trigger);
  });
};

/** Opening by a secondary click: the trigger's own mouse down (internal). */
let isOpeningBySecondaryClick = false;

/**
 * Opens the menu as Base UI's trigger does, but on touch already on touch
 * down; dragging on, the item under the finger is highlighted
 * and chosen where it's released, as Base UI does for the mouse (pressing
 * the trigger, releasing on an item): the finger hovers the items as a
 * mouse would, so only the item under it is highlighted, and resting on a
 * submenu's item opens the submenu, to drag on into. Held near an end of a
 * menu that scrolls, the finger scrolls it (as the tab bar's lens does).
 */
const Trigger = forwardRef<HTMLElement, TriggerProps>(
  ({ onClick, onMouseDown, openOn, ...props }, ref) => {
    const isSecondary = openOn === 'secondaryClick';
    type Handler<E> = ((event: E) => void) | undefined;
    // Pressed by a touch (opened or closed on its touch down, see below):
    // its emulated mouse down and click aren't Base UI's (which would open
    // the menu again; iOS emulates them after a tap, not after a drag).
    const isTouchPress = useRef(false);
    // A secondary click (or a handler for it) opens the menu.
    const triggerProps = useSecondaryClick({
      ...props,
      onSecondaryClick: isSecondary
        ? (event: ReactMouseEvent<HTMLElement>) => {
            props.onSecondaryClick?.(event);
            isOpeningBySecondaryClick = true;
            try {
              // A touch held (a `contextmenu` pointer event): dragged on.
              const { nativeEvent } = event as { nativeEvent?: Event };
              const native = nativeEvent ?? (event as unknown as Event);
              openByTrigger(
                event.currentTarget,
                native instanceof globalThis.PointerEvent &&
                  native.pointerType === 'touch'
                  ? native.pointerId
                  : undefined,
              );
            } finally {
              isOpeningBySecondaryClick = false;
            }
          }
        : props.onSecondaryClick,
    });

    return (
      // Touch: no scrolling from the trigger, so it can be dragged from
      // (opening on a click; otherwise, until held).
      <BaseMenu.Trigger
        // (Base UI's ref type, a union with its own callbacks, takes no
        // forwarded ref.)
        ref={ref as never}
        {...triggerProps}
        className={cn('uikit-menu-trigger', triggerProps.className)}
        data-menu-part="trigger"
        data-open-on={openOn}
        // A click is the trigger's own (Base UI opens on mouse down, or on
        // a click by keys).
        onClick={(event: BaseUIEvent<ReactMouseEvent<HTMLElement>>) => {
          (onClick as Handler<typeof event>)?.(event);
          if (isSecondary || isTouchPress.current) event.preventBaseUIHandler();
          isTouchPress.current = false;
        }}
        onMouseDown={(event: BaseUIEvent<ReactMouseEvent<HTMLElement>>) => {
          (onMouseDown as Handler<typeof event>)?.(event);
          if (
            (isSecondary && !isOpeningBySecondaryClick) ||
            (isTouchPress.current && event.isTrusted)
          ) {
            event.preventBaseUIHandler();
          }
        }}
        onPointerDown={(event: BaseUIEvent<PointerEvent<HTMLElement>>) => {
          // Its own, and the secondary click's.
          (
            (triggerProps as { onPointerDown?: unknown })
              .onPointerDown as Handler<typeof event>
          )?.(event);
          isTouchPress.current = false;
          if (event.pointerType !== 'touch') return;
          // (Not Base UI's own: iOS' touches have no size, which it takes
          // for a screen reader's, highlighting the first item.)
          event.preventBaseUIHandler();
          if (isSecondary || event.defaultPrevented) return;

          // No emulated mouse events after the touch: Base UI opens and
          // closes a menu on mouse down. Opens on touch down; open, closes
          // (as Base UI's mouse down does).
          event.preventDefault();
          isTouchPress.current = true;
          if (event.currentTarget.getAttribute('aria-expanded') === 'true') {
            pressTrigger(event.currentTarget);
            return;
          }
          openByTrigger(event.currentTarget, event.pointerId);
        }}
        onPointerEnter={(event: BaseUIEvent<PointerEvent<HTMLElement>>) => {
          (
            (triggerProps as { onPointerEnter?: unknown })
              .onPointerEnter as Handler<typeof event>
          )?.(event);
          // (Not Base UI's own on touch, see below.)
          if (event.pointerType === 'touch') event.preventBaseUIHandler();
        }}
      />
    );
  },
);

/**
 * Closes the root menu when an open positioner's anchor (Base UI:
 * `data-anchor-hidden`) or the positioner itself leaves the viewport, as
 * Menus close when their source view scrolls away (internal).
 */
export const useCloseOutOfView = (
  positionerRef: RefObject<HTMLDivElement | null>,
): void => {
  const { actionsRef } = useContext(MenuContext);

  useEffect(() => {
    const { current: positioner } = positionerRef;
    if (!positioner) return undefined;

    // Only while its own popup is open: a submenu's positioner, hidden as
    // the submenu closes (e.g. the pointer moving back to its menu's
    // items), doesn't close the root menu.
    const close = () => {
      if (!Object.hasOwn(positioner.dataset, 'open')) return;
      actionsRef?.current?.close();
    };

    const mutationObserver = new MutationObserver(() => {
      if (Object.hasOwn(positioner.dataset, 'anchorHidden')) close();
    });
    mutationObserver.observe(positioner, {
      attributeFilter: ['data-anchor-hidden'],
    });

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      if (entry && !entry.isIntersecting) close();
    });
    intersectionObserver.observe(positioner);

    return () => {
      mutationObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [actionsRef, positionerRef]);
};

const Positioner = forwardRef<HTMLDivElement, MenuPositionerProps>(
  (
    { className, collisionBoundary, collisionPadding, side, ...props },
    forwardedRef,
  ) => {
    const { size, submenu } = useContext(MenuContext);
    const ref = useForwardedRef(forwardedRef);
    const collision = useCollision({ collisionBoundary, collisionPadding });
    useCloseOutOfView(ref);

    const defaults = ((): Pick<
      MenuPositionerProps,
      'align' | 'alignOffset' | 'collisionAvoidance' | 'side' | 'sideOffset'
    > => {
      if (submenu === 'horizontal') {
        return {
          align: 'end',
          alignOffset: -4,
          side: 'block-end',
          sideOffset: 12,
        };
      }
      // (Over its parent's items, below its trigger: not flipped above it;
      // without room, shifted up over it, see `useGrowAvoidance`.)
      if (submenu && size === 'compact') {
        return {
          align: 'start',
          alignOffset: -8,
          collisionAvoidance: {
            align: 'shift',
            fallbackAxisSide: 'none',
            side: 'none',
          },
          side: 'block-end',
          sideOffset: 0,
        };
      }
      // (On its axis: flipped at most, else shifted, not beside its trigger
      // instead, see `useGrowAvoidance`.)
      if (submenu) {
        return {
          align: 'start',
          alignOffset: -10,
          collisionAvoidance: { fallbackAxisSide: 'none' },
          side: 'inline-end',
          sideOffset: 8,
        };
      }
      return {
        collisionAvoidance: { fallbackAxisSide: 'none' },
        sideOffset: 8,
      };
    })();
    // Growing rather than scrolling (unless its own is given).
    const [grow, growRef] = useGrowAvoidance(defaults.collisionAvoidance, ref);

    return (
      // Compact submenus open below their trigger, over the parent's items,
      // aligned with its popup's edge; regular ones beside it, aligned with its
      // first item; those of a horizontal menu (edit menu) below it, at its
      // end. Above the page's own stacking (e.g. list rows' and segmented
      // items' z-indexes, bars at 10), which would otherwise show through it.
      <BaseMenu.Positioner
        ref={growRef}
        {...collision}
        {...props}
        align={props.align ?? defaults.align}
        alignOffset={props.alignOffset ?? defaults.alignOffset}
        className={cn('uikit-menu-positioner', className)}
        collisionAvoidance={props.collisionAvoidance ?? grow}
        data-menu-part="positioner"
        side={positionerSide(side ?? defaults.side)}
        sideOffset={props.sideOffset ?? defaults.sideOffset}
      />
    );
  },
);

const highlightSelectors = ['[data-highlighted]', '[data-popup-open]'];

/** The menu's glass popup (the medium glass). */
const Popup = forwardRef<HTMLDivElement, Omit<BaseMenu.Popup.Props, 'ref'>>(
  ({ className, children, ...props }, ref) => {
    const { size, submenu } = useContext(MenuContext);
    // A submenu's: its element, for presses outside it (see `OpenSubmenus`).
    const toggle = useContext(SubmenuToggleContext);
    const popupRef = useCallback(
      (element: HTMLDivElement | null) => {
        if (submenu) toggle?.setPopup(element);
        assignRef(ref, element);
      },
      [ref, submenu, toggle],
    );
    // Closed by keys, focus returns to its trigger; otherwise (a pointer:
    // an item, outside) it doesn't (Chrome would ring it: the popup took
    // focus by script, e.g. opened through a list row). Submenus: as Base
    // UI does.
    const finalFocus = submenu
      ? undefined
      : (closeType: string) => closeType === 'keyboard';
    // Compact submenus cover their parent's items: as wide as its popup.
    const isOverlay = submenu === 'vertical' && size === 'compact';

    return (
      <BaseMenu.Popup
        ref={popupRef}
        data-overlay={isOverlay ? '' : undefined}
        data-size={size}
        {...props}
        data-menu-part="popup"
        finalFocus={props.finalFocus ?? finalFocus}
        className={cn(
          'uikit-menu-popup uikit-glass-medium uikit-popup-transition',
          className,
        )}
      >
        {children}
        {/* The selection, moving between items: the highlighted one, or
            (regular) the trigger of the open submenu (compact submenus
            cover it). */}
        <MovingHighlight
          selectors={
            size === 'compact'
              ? highlightSelectors.slice(0, 1)
              : highlightSelectors
          }
        />
      </BaseMenu.Popup>
    );
  },
);

// An item: [checkmark] [symbol] label/subtitle [shortcut | chevron]
// (see style.css).

const Item = forwardRef<
  HTMLElement,
  Omit<BaseMenu.Item.Props, 'ref'> & ItemProps
>(({ className, destructive, ...props }, ref) => (
  <BaseMenu.Item
    ref={ref}
    data-clickable={props.onClick ? '' : undefined}
    data-destructive={destructive ? '' : undefined}
    {...props}
    className={cn('uikit-menu-item uikit-menu-action-cursor', className)}
    data-menu-part="item"
  />
));

const LinkItem = forwardRef<
  Element,
  Omit<BaseMenu.LinkItem.Props, 'ref'> & ItemProps
>(({ className, destructive, ...props }, ref) => (
  <BaseMenu.LinkItem
    ref={ref}
    data-destructive={destructive ? '' : undefined}
    {...props}
    data-menu-part="item"
    className={cn(
      'uikit-menu-item uikit-menu-toggle-cursor uikit-menu-link-item',
      className,
    )}
  />
));

const CheckboxItem = forwardRef<
  HTMLElement,
  Omit<BaseMenu.CheckboxItem.Props, 'ref'> & ItemProps
>(({ className, destructive, ...props }, ref) => (
  <BaseMenu.CheckboxItem
    ref={ref}
    data-destructive={destructive ? '' : undefined}
    {...props}
    className={cn('uikit-menu-item uikit-menu-toggle-cursor', className)}
    data-menu-part="item"
  />
));

const RadioItem = forwardRef<
  HTMLElement,
  Omit<BaseMenu.RadioItem.Props, 'ref'> & ItemProps
>(({ className, destructive, ...props }, ref) => (
  <BaseMenu.RadioItem
    ref={ref}
    data-destructive={destructive ? '' : undefined}
    {...props}
    className={cn('uikit-menu-item uikit-menu-toggle-cursor', className)}
    data-menu-part="item"
  />
));

const Checkmark = () => (
  <svg
    aria-hidden="true"
    fill="none"
    height="0.8em"
    stroke="currentcolor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2.2"
    viewBox="0 0 16 16"
    width="0.8em"
  >
    <path d="M2.5 8.5l3.8 3.8L13.5 3.5" />
  </svg>
);

const CheckboxItemIndicator = forwardRef<
  HTMLSpanElement,
  Omit<BaseMenu.CheckboxItemIndicator.Props, 'ref'>
>(({ className, children, ...props }, ref) => (
  <BaseMenu.CheckboxItemIndicator
    ref={ref}
    {...props}
    className={cn('uikit-menu-checkbox-item-indicator', className)}
    data-menu-part="checkbox-item-indicator"
  >
    {children ?? <Checkmark />}
  </BaseMenu.CheckboxItemIndicator>
));

const RadioItemIndicator = forwardRef<
  HTMLSpanElement,
  Omit<BaseMenu.RadioItemIndicator.Props, 'ref'>
>(({ className, children, ...props }, ref) => (
  <BaseMenu.RadioItemIndicator
    ref={ref}
    {...props}
    className={cn('uikit-menu-radio-item-indicator', className)}
    data-menu-part="radio-item-indicator"
  >
    {children ?? <Checkmark />}
  </BaseMenu.RadioItemIndicator>
));

/**
 * A submenu trigger's handlers: pressed again, it closes its open submenu
 * (a compact submenu covers its parent's other items); a mouse's click just
 * as hovering opened it keeps it open (internal; `SubmenuTrigger`'s,
 * EditMenu's `More`'s).
 */
export const useSubmenuToggle = ({
  onClick,
  onPointerDown,
  onPointerEnter,
  ref,
}: Pick<
  BaseMenu.SubmenuTrigger.Props,
  'onClick' | 'onPointerDown' | 'onPointerEnter'
> & { ref?: Ref<HTMLElement> }): {
  onClick: (event: BaseUIEvent<ReactMouseEvent<HTMLElement>>) => void;
  onPointerDown: (event: BaseUIEvent<PointerEvent<HTMLElement>>) => void;
  onPointerEnter: (event: BaseUIEvent<PointerEvent<HTMLElement>>) => void;
  ref: (element: HTMLElement | null) => void;
} => {
  const toggle = useContext(SubmenuToggleContext);
  type Handler<E> = ((event: E) => void) | undefined;
  // Its element, for presses outside its submenu (see `OpenSubmenus`).
  const triggerRef = useCallback(
    (element: HTMLElement | null) => {
      toggle?.setTrigger(element);
      assignRef(ref, element);
    },
    [ref, toggle],
  );

  return {
    ref: triggerRef,
    onClick: (event: BaseUIEvent<ReactMouseEvent<HTMLElement>>) => {
      (onClick as Handler<typeof event>)?.(event);
      if (!toggle) return;
      const pressed = toggle.takePress();
      // Open before this press (not by it), or by keys (no press).
      const wasOpen =
        pressed?.isOpen ??
        event.currentTarget.getAttribute('aria-expanded') === 'true';
      if (!wasOpen) return;
      if (toggle.isJustHovered() && pressed?.pointerType === 'mouse') return;
      event.preventBaseUIHandler();
      toggle.close();
    },
    onPointerDown: (event: BaseUIEvent<PointerEvent<HTMLElement>>) => {
      (onPointerDown as Handler<typeof event>)?.(event);
      // (Not Base UI's own on touch: iOS' touches have no size, which it
      // takes for a screen reader's, highlighting the first item.)
      if (event.pointerType === 'touch') event.preventBaseUIHandler();
      toggle?.press({
        isOpen: event.currentTarget.getAttribute('aria-expanded') === 'true',
        pointerType: event.pointerType,
      });
    },
    onPointerEnter: (event: BaseUIEvent<PointerEvent<HTMLElement>>) => {
      (onPointerEnter as Handler<typeof event>)?.(event);
      // (Not Base UI's own on touch, see above.)
      if (event.pointerType === 'touch') event.preventBaseUIHandler();
    },
  };
};

/** An item opening a submenu, with a chevron (see `useSubmenuToggle`). */
const SubmenuTrigger = forwardRef<
  HTMLElement,
  Omit<BaseMenu.SubmenuTrigger.Props, 'ref'> & ItemProps
>(
  (
    {
      className,
      children,
      destructive,
      onClick,
      onPointerDown,
      onPointerEnter,
      openOnHover,
      ...props
    },
    ref,
  ) => {
    const { orientation, size } = useContext(MenuContext);
    const isOverlay = size === 'compact' && orientation === 'vertical';
    const handlers = useSubmenuToggle({
      onClick,
      onPointerDown,
      onPointerEnter,
      ref,
    });

    return (
      <BaseMenu.SubmenuTrigger
        data-destructive={destructive ? '' : undefined}
        {...handlers}
        // Its submenu covers the parent's items (see `Popup`).
        data-submenu-overlay={isOverlay ? '' : undefined}
        // Covering, pressed, not hovered, by default (a compact menu: no
        // hover; Base UI ignores clicks on a hover-opened one, so leaving it
        // would close it); otherwise Base UI's.
        openOnHover={openOnHover ?? (isOverlay ? false : undefined)}
        {...props}
        className={cn('uikit-menu-item uikit-menu-toggle-cursor', className)}
        data-menu-part="item"
      >
        {children as ReactNode}
        {/* A chevron (right or, compact and open, down: 15px, 700). */}
        <span
          aria-hidden="true"
          className="uikit-menu-chevron"
          data-menu-part="chevron"
        >
          <svg
            fill="none"
            height="15"
            stroke="currentcolor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.4"
            viewBox="0 0 10 16"
            width="10"
          >
            <path d="M2.5 2.5L8 8l-5.5 5.5" />
          </svg>
        </span>
      </BaseMenu.SubmenuTrigger>
    );
  },
);

const Shortcut = forwardRef<HTMLElement, ComponentProps<'kbd'>>(
  ({ className, children, ...props }, ref) => (
    // Shortcuts: modifier and key glyphs (e.g. “⌘A”), each centered in
    // a 14px cell, 1px apart.
    <kbd
      ref={ref}
      {...props}
      className={cn('uikit-menu-shortcut', className)}
      data-menu-part="shortcut"
    >
      {typeof children === 'string'
        ? Array.from(children, (glyph, index) => (
            <span
              // Glyphs of a string, only ever replaced as a whole.

              key={index}
            >
              {glyph}
            </span>
          ))
        : children}
    </kbd>
  ),
);

// A separator: a hairline, inset 8px; regular, 16px high, 17px before a
// section, 21px after quick actions (compact: 21px).
const StyledSeparator = forwardRef<
  HTMLDivElement,
  Omit<ComponentProps<typeof BaseMenu.Separator>, 'ref'>
>(({ className, ...props }, ref) => (
  <BaseMenu.Separator
    ref={ref}
    className={cn('uikit-menu-separator', className)}
    data-menu-part="separator"
    {...props}
  />
));

const Separator = StyledSeparator;

// A section title.
const GroupLabel = forwardRef<
  HTMLDivElement,
  Omit<ComponentProps<typeof BaseMenu.GroupLabel>, 'ref'>
>(({ className, ...props }, ref) => (
  <BaseMenu.GroupLabel
    ref={ref}
    className={cn('uikit-menu-group-label', className)}
    data-menu-part="group-label"
    {...props}
  />
));

const QuickActions = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    // Quick actions: a row of tiles, inset 10px from the popup's edge.
    <div
      ref={ref}
      data-menu-part="quick-actions"
      {...props}
      className={cn('uikit-menu-quick-actions', className)}
    />
  ),
);

const QuickAction = forwardRef<
  HTMLElement,
  Omit<BaseMenu.Item.Props, 'ref'> & ItemProps
>(({ className, destructive, ...props }, ref) => (
  // A quick action: a tile with a symbol above a label, and the
  // selection while highlighted; concentric with the popup, 10px in.
  <BaseMenu.Item
    ref={ref}
    data-clickable={props.onClick ? '' : undefined}
    data-destructive={destructive ? '' : undefined}
    {...props}
    data-menu-part="quick-action"
    className={cn(
      'uikit-menu-quick-action uikit-menu-action-cursor',
      className,
    )}
  />
));

const Icon = forwardRef<HTMLSpanElement, SpanProps>(
  ({ className, ...props }, ref) => (
    // A symbol: 28px wide, hidden (with its gap) when absent.
    <span
      ref={ref}
      data-menu-part="icon"
      {...props}
      className={cn('uikit-menu-icon', className)}
    />
  ),
);

const Label = forwardRef<HTMLSpanElement, SpanProps>(
  ({ className, ...props }, ref) => (
    // A label and subtitle: the text is padded (10px or 9px), not the
    // item, whose symbol is taller than the label.
    <span
      ref={ref}
      data-menu-part="label"
      {...props}
      className={cn('uikit-menu-label', className)}
    />
  ),
);

const Subtitle = forwardRef<HTMLSpanElement, SpanProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      data-menu-part="subtitle"
      {...props}
      className={cn('uikit-menu-subtitle', className)}
    />
  ),
);

/**
 * A handle linking a menu to its triggers outside it (detached), and
 * opening or closing it imperatively (Base UI's `Menu.createHandle`): pass
 * it to the root's and the triggers' `handle` (in a component, see
 * `useCreateMenuHandle`).
 */
const createHandle = <Payload = unknown,>(): MenuHandle<Payload> =>
  BaseMenu.createHandle<Payload>();

/** `Menu.createHandle`, in a component: made once, for its lifetime. */
export const useCreateMenuHandle = <
  Payload = unknown,
>(): MenuHandle<Payload> => {
  const [handle] = useState(() => createHandle<Payload>());
  return handle;
};

/** The menu's trigger (also of `ContextualMenu`). */
export { Trigger as MenuTrigger };

/**
 * Its portal (Base UI's): no box of its own (\`display: contents\`), so
 * rendered into a container (e.g. a screen laid out as a flex column) it
 * doesn't shift its content.
 */
const Portal = forwardRef<HTMLDivElement, Omit<BaseMenu.Portal.Props, 'ref'>>(
  ({ className, container, ...props }, ref) => (
    <BaseMenu.Portal
      ref={ref}
      container={usePortalContainer(container)}
      {...props}
      className={cn('uikit-menu-portal', className)}
    />
  ),
);

export const Menu = {
  ...BaseMenu,
  Root,
  Portal,
  SubmenuRoot,
  Trigger,
  Positioner,
  createHandle,
  Popup,
  Item,
  LinkItem,
  CheckboxItem,
  CheckboxItemIndicator,
  RadioItem,
  RadioItemIndicator,
  SubmenuTrigger,
  Separator,
  GroupLabel,
  QuickActions,
  QuickAction,
  Icon,
  Label,
  Subtitle,
  Shortcut,
};
