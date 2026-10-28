import '../glass/style.css';
import '../menu/style.css';
import './style.css';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import {
  dragOverItems,
  Menu,
  MenuContext,
  useCloseOutOfView,
  useKeepOpenInSubmenus,
  useRootActions,
  useSubmenuToggle,
} from '../menu/main.js';
import {
  cn,
  MovingHighlight,
  positionerSide,
  useForwardedRef,
} from '../utils/main.js';
import type {
  EditMenuPositionerProps,
  EditMenuRootProps,
  ItemProps,
} from './props.js';

export type { EditMenuPositionerProps, EditMenuRootProps } from './props.js';

// Source: Apple iOS 26 Figma (“Menus”: “Edit Menu”, “_Edit Menu Item”,
// Mode=Light and Dark), with the destructive color mapped to `systemRed`; the
// “Medium” glass material and vibrant content colors are tokens in
// `styles.css`, used via `glass/style.css` (`uikit-glass-medium`). Its metrics
// are iOS 26's own edit menu's, measured on an iPhone (see Deviations).
//
// A Base UI menu in a horizontal glass capsule (UIKit `UIEditMenuInteraction`):
// its actions are items, and `EditMenu.More` opens a submenu (a `Menu` popup)
// with further actions. It's opened by the app (`open`) at an anchor (the
// positioner's `anchor`, e.g. a selection), not by a trigger.
//
// It closes when its anchor or capsule leaves the viewport (see `Menu`).
//
// It never overflows its collision boundary (the viewport, or the positioner's
// `collisionBoundary`): too narrow for its actions, they scroll within the
// capsule, the “more” button staying at its end. Touches drag over the actions
// (no native scrolling), highlighting the one under the finger and choosing it
// on release; held near an end, they scroll the actions (as the tab bar's lens
// and menus do).
//
// Deviations:
// - More actions open in a menu below the capsule, an iPad (`regular`) menu
//   (UIKit: pages of the capsule).
// - Highlighted actions (pointer, keyboard) show the selection, as the “more”
//   button does (Figma: no highlighted actions).
// - The chevron is an SVG stroke (Figma: SF Symbols glyph 􀆊).
// - Metrics of iOS 26's own edit menu (measured): 42px high, 14px labels, 16px
//   dividers, a 34px “more” button (Figma: 44px, 15px, 18px, 36px).
// - The capsule is Framework7's popover glass, as the menu's popup (see
//   `Menu`).

/**
 * An edit menu: controlled by `open` (e.g. when a selection is made), shown
 * at its positioner's `anchor`; it has no visible trigger. It isn't modal
 * (by default): the page stays interactive, and pressing outside of it
 * reaches the page (e.g. clearing the selection) as it closes the menu.
 */
const Root = <Payload,>({
  children,
  onOpenChange,
  orientation = 'horizontal',
  size = 'regular',
  ...props
}: EditMenuRootProps<Payload>): ReactNode => {
  const actionsRef = useRootActions(props.actionsRef);
  const onRootOpenChange = useKeepOpenInSubmenus(onOpenChange);

  return (
    // (Its menus' size, see `Menu.SubmenuRoot`.)
    <MenuContext.Provider value={{ actionsRef, orientation, size }}>
      <BaseMenu.Root
        modal={false}
        orientation={orientation}
        {...props}
        actionsRef={actionsRef}
        onOpenChange={onRootOpenChange}
      >
        <BaseMenu.Trigger
          aria-hidden="true"
          nativeButton={false}
          tabIndex={-1}
          render={
            // Base UI positions a menu only for a trigger element; an edit menu
            // opens at its anchor (e.g. a selection) instead, and pressing its
            // content (e.g. to select text) must not open it. It's an inert,
            // hidden element.
            <span className="uikit-edit-menu-hidden-trigger" />
          }
        />
        {children as ReactNode}
      </BaseMenu.Root>
    </MenuContext.Provider>
  );
};

const Positioner = forwardRef<HTMLDivElement, EditMenuPositionerProps>(
  ({ className, side = 'block-start', ...props }, forwardedRef) => {
    const ref = useForwardedRef(forwardedRef);
    useCloseOutOfView(ref);

    return (
      // Positions the capsule above its anchor (e.g. a text selection). */
      // Above the page's own stacking (e.g. list rows' and segmented items'
      // z-indexes, bars at 10), which would otherwise show through it.
      <BaseMenu.Positioner
        ref={ref}
        {...props}
        className={cn('uikit-edit-menu-positioner', className)}
        data-edit-menu-part="positioner"
        side={positionerSide(side)}
        sideOffset={props.sideOffset ?? 8}
      />
    );
  },
);

const getRanges = (selection: Selection | null) =>
  selection
    ? Array.from({ length: selection.rangeCount }, (_, index) =>
        selection.getRangeAt(index).cloneRange(),
      )
    : [];

const inMenu = (target: EventTarget | null) =>
  target instanceof Element && target.closest('[role="menu"]') !== null;

/**
 * Keeps the document's selection while the popup, its submenus or their
 * items have focus:
 * Base UI focuses the popup on opening and items when highlighted, and
 * WebKit clears a selection when focus moves outside of it, which would take
 * the edit menu's anchor away (internal).
 */
const useKeepSelection = (popupRef: { current: HTMLDivElement | null }) => {
  useLayoutEffect(() => {
    const { current: popup } = popupRef;
    if (!popup) return undefined;

    const document = popup.ownerDocument;
    let ranges = getRanges(document.getSelection());

    // Selections made while the popup isn't focused (its own focusing
    // changes it asynchronously, too late for the restore).
    const save = () => {
      if (inMenu(document.activeElement)) return;
      ranges = getRanges(document.getSelection());
    };

    // On every focus inside, too: highlighting an item focuses it.
    const restore = () => {
      const selection = document.getSelection();
      if (!selection?.isCollapsed || ranges.length === 0) return;

      selection.removeAllRanges();
      for (const range of ranges) selection.addRange(range);
    };

    // Submenus too (in portals).
    const onFocusIn = ({ target }: FocusEvent) => {
      if (inMenu(target)) restore();
    };

    document.addEventListener('selectionchange', save);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      document.removeEventListener('selectionchange', save);
      document.removeEventListener('focusin', onFocusIn);
    };
  }, [popupRef]);
};

// Marks the scroller while its actions overflow it, and whether there are
// more of them before or after those in view: its first and last actions
// fully in view, or not (the “more” button's space excluded).
const useOverflow = (scrollerRef: { current: HTMLDivElement | null }) => {
  useLayoutEffect(() => {
    const { current: scroller } = scrollerRef;
    const actions = scroller?.parentElement;
    if (!scroller || !actions) return undefined;

    const hidden = new Set<Element>();
    let observer: IntersectionObserver | undefined;
    let ends: Element[] = [];

    const update = () => {
      const [first, last] = ends;
      const isBefore = first !== undefined && hidden.has(first);
      const isAfter = last !== undefined && hidden.has(last);
      actions.toggleAttribute('data-before', isBefore);
      actions.toggleAttribute('data-after', isAfter);
      actions.toggleAttribute('data-overflowing', isBefore || isAfter);
    };

    const observe = () => {
      observer?.disconnect();
      hidden.clear();
      // Not the “more” button, positioned by the popup (also before Base UI
      // marks it as a submenu trigger).
      const items = [...scroller.children].filter(
        (child) => getComputedStyle(child).position !== 'absolute',
      );
      ends = [items[0], items.at(-1)].filter((end) => end !== undefined);

      observer = new IntersectionObserver(
        (entries) => {
          for (const { intersectionRatio, target } of entries) {
            if (intersectionRatio < 0.99) {
              hidden.add(target);
            } else {
              hidden.delete(target);
            }
          }
          update();
        },
        { root: scroller, threshold: [0, 0.99, 1] },
      );
      for (const end of new Set(ends)) observer.observe(end);
    };
    observe();

    const mutations = new MutationObserver(observe);
    mutations.observe(scroller, { childList: true });

    return () => {
      observer?.disconnect();
      mutations.disconnect();
    };
  }, [scrollerRef]);
};

/**
 * Touches in the edit menu and its submenus drag over their items (see
 * `dragOverItems`): no tap reaches the page, which would clear the
 * selection (iOS), so even the “more” button opens by the drag (hovered,
 * or clicked on release).
 */
const useTouchDrag = (popupRef: { current: HTMLDivElement | null }) => {
  useLayoutEffect(() => {
    const { current: popup } = popupRef;
    if (!popup) return undefined;

    const document = popup.ownerDocument;

    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (
        event.pointerType !== 'touch' ||
        !event.isPrimary ||
        !inMenu(event.target)
      ) {
        return;
      }

      event.preventDefault();
      if (event.target instanceof Element) {
        const { target } = event;
        if (target.hasPointerCapture(event.pointerId)) {
          target.releasePointerCapture(event.pointerId);
        }
      }
      dragOverItems(document, event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });
    };

    const onTouchStart = (event: TouchEvent) => {
      if (inMenu(event.target) && event.cancelable) event.preventDefault();
    };

    document.addEventListener('pointerdown', onPointerDown, { capture: true });
    document.addEventListener('touchstart', onTouchStart, {
      capture: true,
      passive: false,
    });
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, {
        capture: true,
      });
      document.removeEventListener('touchstart', onTouchStart, {
        capture: true,
      });
    };
  }, [popupRef]);
};

const highlightSelectors = [':scope > [data-highlighted]:not([aria-haspopup])'];

/** The edit menu's glass capsule (Figma “Liquid Glass”, Medium). */
const Popup = forwardRef<HTMLDivElement, Omit<BaseMenu.Popup.Props, 'ref'>>(
  ({ className, children, ...props }, forwardedRef) => {
    const ref = useForwardedRef(forwardedRef);
    const scrollerRef = useRef<HTMLDivElement>(null);
    useKeepSelection(ref);
    useOverflow(scrollerRef);
    useTouchDrag(ref);

    return (
      // iOS 26 (measured): 42px high, actions from 20px, the “more” button 4px
      // from the end; at most as wide as the space Base UI's positioner finds.
      <BaseMenu.Popup
        ref={ref}
        {...props}
        data-edit-menu-part="popup"
        className={cn(
          'uikit-edit-menu-popup uikit-glass-medium uikit-popup-transition',
          className,
        )}
      >
        {/* The actions, faded at the ends with more actions beyond (see
           useOverflow), the space at the end kept for the “more” button: it's
           positioned by the popup (beyond the scroller's clipping and
           scrolling), so actions never scroll beneath it, but the fades' mask
           covers it, too. */}
        <div
          className="uikit-edit-menu-actions"
          data-edit-menu-part="actions"
        >
          {/* The actions' row; too narrow for them, a scroll container (only
             then: its content blends with the glass otherwise, see Popup). */}
          <div
            ref={scrollerRef}
            className="uikit-edit-menu-scroller"
            data-menu-part="scroller"
          >
            {children}
            {/* The selection, moving between actions (not the “more”
                circle, which shows its own). */}
            <MovingHighlight selectors={highlightSelectors} />
          </div>
        </div>
      </BaseMenu.Popup>
    );
  },
);

const Item = forwardRef<
  HTMLElement,
  Omit<BaseMenu.Item.Props, 'ref'> & ItemProps
>(({ className, children, destructive, ...props }, ref) => (
  // Figma “_Edit Menu Item” (iOS 26's metrics): a label with a 16px high, 1px
  // divider before it (except the first), 16px apart; the dividers next to the
  // highlighted action hide.
  <BaseMenu.Item
    ref={ref}
    data-clickable={props.onClick ? '' : undefined}
    data-destructive={destructive ? '' : undefined}
    {...props}
    className={cn('uikit-edit-menu-item uikit-menu-action-cursor', className)}
    data-edit-menu-part="item"
  >
    <span>{children as ReactNode}</span>
  </BaseMenu.Item>
));

/**
 * The “more” button, opening a submenu with further actions: place it in an
 * `EditMenu.SubmenuRoot`, followed by an `EditMenu.Portal` with the submenu
 * (a `Menu`'s positioner and popup).
 */
const More = forwardRef<
  HTMLElement,
  Omit<BaseMenu.SubmenuTrigger.Props, 'ref'>
>(({ className, children, onClick, onPointerDown, ...props }, ref) => (
  // Figma “Menu” (iOS 26's metrics): a 34px circle with the selection and a
  // chevron (􀆊, 14px, 590). Pressed again, it closes its menu.
  <BaseMenu.SubmenuTrigger
    ref={ref}
    aria-label="More"
    {...useSubmenuToggle({ onClick, onPointerDown })}
    {...props}
    className={cn('uikit-edit-menu-more uikit-menu-toggle-cursor', className)}
    data-edit-menu-part="more"
  >
    {(children as ReactNode) ?? (
      <svg
        aria-hidden="true"
        fill="none"
        height="14"
        stroke="currentcolor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
        viewBox="0 0 10 16"
        width="9"
      >
        <path d="M2.5 2.5L8 8l-5.5 5.5" />
      </svg>
    )}
  </BaseMenu.SubmenuTrigger>
));

/** A text selection as a positioner's anchor (see `useSelectionAnchor`). */
export type SelectionAnchor = { getBoundingClientRect: () => DOMRect };

/**
 * The text selection in `container` once it's made, as an anchor for the
 * edit menu's positioner (null while there's none, or while selecting):
 * once the pointer is released, or after a pause (keyboard, touch:
 * selecting by touch cancels the pointer, the selection handles don't use
 * it). Selection changes keeping the range (e.g. restored after the menu's
 * focusing cleared it, in WebKit) are ignored, and so are presses not
 * changing it (e.g. outside the text): they only clear it. The second
 * value clears it (e.g. when the menu closes).
 *
 * @example
 * const [text, setText] = useState<HTMLElement | null>(null);
 * const [selection, clearSelection] = useSelectionAnchor(text);
 * <EditMenu.Root open={selection !== null} onOpenChange={(open) => { if (!open) clearSelection(); }}>
 *   <p ref={setText}>…</p>
 *   <EditMenu.Portal>
 *     <EditMenu.Positioner anchor={selection}>…
 */
export const useSelectionAnchor = (
  container: HTMLElement | null,
): [anchor: SelectionAnchor | null, clear: () => void] => {
  const [anchor, setAnchor] = useState<SelectionAnchor | null>(null);

  useEffect(() => {
    let isSelecting = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let shown: Range | null = null;
    let isChanged = false;

    const current = () => {
      const documentSelection = document.getSelection();
      const range =
        documentSelection && documentSelection.rangeCount > 0
          ? documentSelection.getRangeAt(0)
          : null;

      return range &&
        !range.collapsed &&
        container?.contains(range.commonAncestorContainer)
        ? range.cloneRange()
        : null;
    };

    const isShown = (range: Range | null) =>
      shown !== null &&
      range !== null &&
      range.compareBoundaryPoints(Range.START_TO_START, shown) === 0 &&
      range.compareBoundaryPoints(Range.END_TO_END, shown) === 0;

    const hide = () => {
      shown = null;
      setAnchor(null);
    };

    const update = () => {
      const range = current();
      shown = range;
      setAnchor(
        range
          ? { getBoundingClientRect: () => range.getBoundingClientRect() }
          : null,
      );
    };

    const onPointerDown = ({ target }: PointerEvent) => {
      // Pressing a menu keeps it.
      if (target instanceof Element && target.closest('[role=menu]')) return;

      isSelecting = true;
      isChanged = false;
      hide();
    };

    const onPointerUp = () => {
      if (!isSelecting) return;
      isSelecting = false;
      if (isChanged) update();
    };

    const onPointerCancel = () => {
      isSelecting = false;
    };

    const onSelectionChange = () => {
      if (isSelecting) isChanged = true;
      if (isSelecting || isShown(current())) return;

      clearTimeout(timeout);
      hide();
      timeout = setTimeout(update, 500);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointercancel', onPointerCancel);
    document.addEventListener('selectionchange', onSelectionChange);
    return () => {
      clearTimeout(timeout);
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('pointercancel', onPointerCancel);
      document.removeEventListener('selectionchange', onSelectionChange);
    };
  }, [container]);

  const clear = useCallback(() => setAnchor(null), []);

  return [anchor, clear];
};

// Base UI's menu parts but its handles: an edit menu has no trigger to open
// at (the app opens it, `open`).
const { createHandle: _createHandle, ...menuParts } = BaseMenu;

export const EditMenu = {
  ...menuParts,
  Root,
  // A menu's (its submenu's: an iPad menu, see `Menu`).
  Portal: Menu.Portal,
  SubmenuRoot: Menu.SubmenuRoot,
  Positioner,
  Popup,
  Item,
  More,
};
