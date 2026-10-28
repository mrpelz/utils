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

// Source: Apple iOS 26 Figma (“Menus”: “Menu - iPhone”, “Menu - iPad -
// Actions (and Submenus)”, “Items - iPhone/iPad”, “Section Title”,
// “Separator”, “Quick Action”, “_Shortcuts”, Mode=Light and Dark), with the
// destructive color mapped to `systemRed`; the “Medium” glass material and
// the vibrant content colors are tokens in `styles.css`, used via
// `glass/main.tsx` (`glassMedium`).
//
// Menus close when their anchor or popup leaves the viewport (UIKit: when
// the source view scrolls away); popups taller than the space available
// scroll (Framework7 `popover.less`: `.popover-inner`).
//
// Symbols are in the Body (compact) and Subheadline (regular) text styles;
// Figma's labels, subtitles, section titles, shortcuts and quick action labels
// differ from the text styles in line height or tracking, and are kept.
//
// Deviations:
// - The root's `size` (UIKit size class) switches between the iPhone
//   (`compact`) and the iPad (`regular`) menu, for all its popups:
//   - `compact`: 40px items with 17px labels; submenus open over their
//     trigger (which stays visible, its chevron turned down), covering the
//     items below it (Figma “Submenu Open”: chevron.down). Items are inset
//     8px from the popup's edge, as on iPad (Figma: 16px, but no highlighted
//     items).
//   - `regular`: 36px items with 15px labels; submenus open beside their
//     trigger, which shows the selection while open.
// - Popups are at least 238px wide (Figma: 238px).
// - A checkmark column is reserved in all items of a popup containing
//   checkbox or radio items (Figma “Menu has Toggles”).
// - Highlighted items and quick actions (pointer, keyboard) show the
//   selection (Figma: one item or quick action, and the open submenu).
// - The popup's corners are concentric with the item selections (pills,
//   iOS 26 concentric shapes): the pill's radius plus the insets, 28px/30px
//   (compact) and 26px/28px (regular) on the inline/block axes (Figma: 34px);
//   quick actions 10px less (Figma: 20px).
// - While a compact submenu covers its parent, the parent's items but the
//   trigger fade (as on iOS), and the submenu has no background of its own
//   (it's on its parent's glass, whose background it would compound).
// - Quick action symbols are 17px (compact) and 15px (regular), as rendered
//   in the Figma PNG export (Figma CSS: 13px text in 22px and 19px boxes).
// - The checkmark and chevrons are drawn as SVG strokes (Figma: SF Symbols
//   glyphs 􀆅, 􀆊, 􀆈).
// - The popup is Framework7's popover glass (background, backdrop blur and
//   glass effect, see `glassMedium`), not Figma's blended fills, and scales
//   in and out as a Framework7 popover.

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

/**
 * A root menu's `onOpenChange`, not closing it for a press in one of its
 * submenus (in portals): Base UI tells those from presses outside by React's
 * event bubbling through portals, which Preact's portals lack, so it'd close
 * the whole menu, e.g. as a submenu's checkbox item is toggled (internal;
 * Menu's, EditMenu's).
 */
export const useKeepOpenInSubmenus = (
  onOpenChange?: (
    isOpen: boolean,
    details: BaseMenu.Root.ChangeEventDetails,
  ) => void,
): ((isOpen: boolean, details: BaseMenu.Root.ChangeEventDetails) => void) =>
  useCallback(
    (isOpen: boolean, details: BaseMenu.Root.ChangeEventDetails) => {
      const { event, reason } = details;
      if (
        !isOpen &&
        reason === 'outside-press' &&
        event.target instanceof Element &&
        event.target.closest('[role="menu"]') !== null
      ) {
        details.cancel();
        return;
      }
      onOpenChange?.(isOpen, details);
    },
    [onOpenChange],
  );

const Root = <Payload,>({
  onOpenChange,
  size = 'compact',
  ...props
}: MenuRootProps<Payload>): ReactNode => {
  const actionsRef = useRootActions(props.actionsRef);
  const onRootOpenChange = useKeepOpenInSubmenus(onOpenChange);

  return (
    <MenuContext.Provider value={{ actionsRef, orientation: 'vertical', size }}>
      <BaseMenu.Root
        {...props}
        actionsRef={actionsRef}
        onOpenChange={onRootOpenChange}
      />
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
  /** Just opened by hovering (a click then confirms it, see below). */
  isJustHovered: () => boolean;
  press: (press: SubmenuPress) => void;
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
  const submenuActionsRef = useRootActions(actionsRefProp);
  // When hovering opened it (ms, the event's time base), if it did.
  const hoveredOpen = useRef<number | undefined>(undefined);
  const pressed = useRef<SubmenuPress | undefined>(undefined);
  const toggle = useMemo(
    () => ({
      close: () => submenuActionsRef.current?.close(),
      isJustHovered: () =>
        hoveredOpen.current !== undefined &&
        performance.now() - hoveredOpen.current < hoverConfirm,
      press: (press: SubmenuPress) => {
        pressed.current = press;
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

/** A menu's element scrolling its items (itself, unless it marks one). */
const scrollerOf = (menu: HTMLElement) =>
  menu.querySelector<HTMLElement>('[data-menu-part=scroller]') ?? menu;

/**
 * Drags a touch (`pointerId`) over menus' items, from `start` (if given, it
 * hovers the item there right away): the finger hovers the items as a mouse
 * would (see `hover`), so only the item under it is highlighted, and resting
 * on a submenu's item opens the submenu, to drag on into; released, the item
 * there is clicked. Held near an end of a menu that scrolls (either way), the
 * finger scrolls it (as the tab bar's lens does). The touch's own clicks are
 * kept from the items (internal; Menu's trigger, EditMenu).
 */
export const dragOverItems = (
  document: Document,
  pointerId: number,
  start?: { x: number; y: number },
): void => {
  let item: HTMLElement | undefined;
  // The open submenu's item the touch began on, if any (see below).
  let openAtStart: HTMLElement | undefined;
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
    if (item) hover(item, true, finger);
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

    // An open submenu stays open (clicking its item would close it), unless
    // it was already open as the touch began on its item: pressed again, it
    // closes (see `SubmenuTrigger`).
    if (
      item &&
      (!isSubmenuTrigger(item) || !isExpanded(item) || item === openAtStart)
    ) {
      item.click();
    }
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
 * Opens a menu by its trigger (`trigger`) as Base UI does on a mouse down;
 * a touch (`pointerId`) then drags over its items (see `dragOverItems`).
 */
const openByTrigger = (trigger: HTMLElement, pointerId?: number) => {
  const document = trigger.ownerDocument;
  if (trigger.getAttribute('aria-expanded') !== 'true') {
    trigger.dispatchEvent(
      new MouseEvent('mousedown', {
        bubbles: true,
        button: 0,
        cancelable: true,
        view: document.defaultView,
      }),
    );
  }
  if (pointerId === undefined) return;

  // Touch captures the pointer to the trigger; the menu's items are
  // hit-tested instead.
  if (trigger.hasPointerCapture(pointerId)) {
    trigger.releasePointerCapture(pointerId);
  }
  dragOverItems(document, pointerId);
};

/** Opening by a secondary click: the trigger's own mouse down (internal). */
let isOpeningBySecondaryClick = false;

/**
 * Opens the menu as Base UI's trigger does, but on touch already on touch
 * down, as on iOS; dragging on, the item under the finger is highlighted
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
          if (isSecondary) event.preventBaseUIHandler();
        }}
        onMouseDown={(event: BaseUIEvent<ReactMouseEvent<HTMLElement>>) => {
          (onMouseDown as Handler<typeof event>)?.(event);
          if (isSecondary && !isOpeningBySecondaryClick) {
            event.preventBaseUIHandler();
          }
        }}
        onPointerDown={(event: PointerEvent<HTMLElement>) => {
          // Its own, and the secondary click's.
          (
            (triggerProps as { onPointerDown?: unknown })
              .onPointerDown as Handler<typeof event>
          )?.(event);
          if (
            isSecondary ||
            event.pointerType !== 'touch' ||
            event.defaultPrevented
          ) {
            return;
          }

          // No emulated mouse events after the touch: Base UI opens and
          // closes a menu on mouse down. Opens on touch down, as on iOS.
          event.preventDefault();
          openByTrigger(event.currentTarget, event.pointerId);
        }}
      />
    );
  },
);

/**
 * Closes the root menu when an open positioner's anchor (Base UI:
 * `data-anchor-hidden`) or the positioner itself leaves the viewport, as
 * UIKit menus close when their source view scrolls away (internal).
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
      // (Over its parent's items, below its trigger, which stays in view to
      // close it again: not flipped above it; without room, it scrolls.)
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
      if (submenu) {
        return {
          align: 'start',
          alignOffset: -10,
          side: 'inline-end',
          sideOffset: 8,
        };
      }
      return { sideOffset: 8 };
    })();

    return (
      // Compact submenus open below their trigger, over the parent's items,
      // aligned with its popup's edge; regular ones beside it, aligned with its
      // first item; those of a horizontal menu (edit menu) below it, at its
      // end. Above the page's own stacking (e.g. list rows' and segmented
      // items' z-indexes, bars at 10), which would otherwise show through it.
      <BaseMenu.Positioner
        ref={ref}
        {...collision}
        {...props}
        align={props.align ?? defaults.align}
        alignOffset={props.alignOffset ?? defaults.alignOffset}
        className={cn('uikit-menu-positioner', className)}
        data-menu-part="positioner"
        side={positionerSide(side ?? defaults.side)}
        sideOffset={props.sideOffset ?? defaults.sideOffset}
        collisionAvoidance={
          props.collisionAvoidance ?? defaults.collisionAvoidance
        }
      />
    );
  },
);

const highlightSelectors = ['[data-highlighted]', '[data-popup-open]'];

/** The menu's glass popup (Figma “Liquid Glass - Medium”). */
const Popup = forwardRef<HTMLDivElement, Omit<BaseMenu.Popup.Props, 'ref'>>(
  ({ className, children, ...props }, ref) => {
    const { size, submenu } = useContext(MenuContext);
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
        ref={ref}
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

// Figma “Item”: [checkmark] [symbol] label/subtitle [shortcut | chevron]
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
}: Pick<BaseMenu.SubmenuTrigger.Props, 'onClick' | 'onPointerDown'>): {
  onClick: (event: BaseUIEvent<ReactMouseEvent<HTMLElement>>) => void;
  onPointerDown: (event: PointerEvent<HTMLElement>) => void;
} => {
  const toggle = useContext(SubmenuToggleContext);
  type Handler<E> = ((event: E) => void) | undefined;

  return {
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
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      (onPointerDown as Handler<typeof event>)?.(event);
      toggle?.press({
        isOpen: event.currentTarget.getAttribute('aria-expanded') === 'true',
        pointerType: event.pointerType,
      });
    },
  };
};

/** An item opening a submenu, with a chevron (see `useSubmenuToggle`). */
const SubmenuTrigger = forwardRef<
  HTMLElement,
  Omit<BaseMenu.SubmenuTrigger.Props, 'ref'> & ItemProps
>(
  (
    { className, children, destructive, onClick, onPointerDown, ...props },
    ref,
  ) => {
    const { orientation, size } = useContext(MenuContext);
    const handlers = useSubmenuToggle({ onClick, onPointerDown });

    return (
      <BaseMenu.SubmenuTrigger
        ref={ref}
        data-destructive={destructive ? '' : undefined}
        {...handlers}
        // Its submenu covers the parent's items (see `Popup`).
        data-submenu-overlay={
          size === 'compact' && orientation === 'vertical' ? '' : undefined
        }
        {...props}
        className={cn('uikit-menu-item uikit-menu-toggle-cursor', className)}
        data-menu-part="item"
      >
        {children as ReactNode}
        {/* Figma “Submenu” (􀆊 or, compact and open, 􀆈: 15px, 700). */}
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
    // Figma “_Shortcuts”: modifier and key glyphs (e.g. “⌘A”), each centered in
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

// Figma “Separator”: a hairline, inset 8px; on iPad 16px high, 17px before
// a section, 21px after quick actions (iPhone: 21px).
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

// Figma “Section Title”.
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
    // Figma “Quick Actions”: a row of tiles, inset 10px from the popup's edge.
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
  // Figma “Quick Action”: a tile with a symbol above a label, and the
  // selection (“BG”) while highlighted; concentric with the popup, 10px in.
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
    // Figma “Symbol”: 28px wide, hidden (with its gap) when absent.
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
    // Figma “Label and Subtitle”: the text is padded (10px or 9px), not the
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
