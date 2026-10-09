import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { BaseUIEvent } from '@base-ui/react/types';
import { Properties } from 'csstype';
import { styled } from 'goober';
import {
  createContext,
  forwardRef,
  FunctionComponent,
  MouseEvent as ReactMouseEvent,
  PointerEvent,
  ReactNode,
  Ref,
  RefObject,
  useContext,
  useEffect,
  useRef,
} from 'react';

import { glassMedium } from './glass.js';
import {
  css,
  draggingAttribute,
  edgeScrollDelta,
  fontWeight,
  frameElapsed,
  MovingHighlight,
  SecondaryClickProps,
  useForwardedRef,
  useSecondaryClick,
} from './utils.js';

// Source: Apple iOS 26 Figma (“Menus”: “Menu - iPhone”, “Menu - iPad -
// Actions (and Submenus)”, “Items - iPhone/iPad”, “Section Title”,
// “Separator”, “Quick Action”, “_Shortcuts”, Mode=Light and Dark), with the
// destructive color mapped to `systemRed`; the “Medium” glass material and
// the vibrant content colors are tokens in `styles.tsx`, used via
// `glass.tsx` (`glassMedium`).
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

export type Size = 'compact' | 'regular';

const sizeVars: Record<Size, string> = {
  compact: css`
    --styled-menu-inset: 8px;
    --styled-menu-item-padding-block: 10px;
    --styled-menu-icon-size: var(--font-ios-body-size);
    --styled-menu-icon-line-height: var(--font-ios-body-line-height);
    --styled-menu-label-size: 17px;
    --styled-menu-label-line-height: 20px;
    --styled-menu-label-letter-spacing: -0.43px;
    --styled-menu-subtitle-line-height: 18px;
    --styled-menu-separator-height: 21px;
    --styled-menu-separator-height-section: 21px;
    --styled-menu-separator-height-quick-actions: 21px;
    --styled-menu-pill: 20px;
    --styled-menu-title-padding: 4px 8px 10px;
    --styled-menu-title-size: 13px;
    --styled-menu-quick-padding: 6px 4px;
    --styled-menu-quick-gap: 4px;
    --styled-menu-quick-symbol-line-height: 22px;
  `,
  regular: css`
    --styled-menu-inset: 8px;
    --styled-menu-item-padding-block: 9px;
    --styled-menu-icon-size: var(--font-ios-subheadline-size);
    --styled-menu-icon-line-height: var(--font-ios-subheadline-line-height);
    --styled-menu-label-size: 15px;
    --styled-menu-label-line-height: 18px;
    --styled-menu-label-letter-spacing: 0.2px;
    --styled-menu-subtitle-line-height: 16px;
    --styled-menu-separator-height: 16px;
    --styled-menu-separator-height-section: 17px;
    --styled-menu-separator-height-quick-actions: 21px;
    --styled-menu-pill: 18px;
    --styled-menu-title-padding: 5px 8px 7px;
    --styled-menu-title-size: 12px;
    --styled-menu-quick-padding: 9px 4px 6px;
    --styled-menu-quick-gap: 1px;
    --styled-menu-quick-symbol-line-height: 19px;
  `,
};

/** Marks a menu's internal parts (e.g. EditMenu's scroller). */
export const part = 'data-menu-part';

type MenuContextValue = {
  /** The root menu's actions (closing it). */
  actionsRef?: RefObject<BaseMenu.Root.Actions | null>;
  /** The menu's orientation (edit menus: horizontal). */
  orientation: 'horizontal' | 'vertical';
  size: Size;
  /** Inside a submenu: its parent's orientation. */
  submenu?: 'horizontal' | 'vertical';
};

/** Shared by `Menu` and `EditMenu` (internal). */
export const MenuContext = createContext<MenuContextValue>({
  orientation: 'vertical',
  size: 'compact',
});

export type MenuRootProps = BaseMenu.Root.Props & {
  /** UIKit size class: `compact` (iPhone, default) or `regular` (iPad). */
  size?: Size;
};

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

const Root = ({ size = 'compact', ...props }: MenuRootProps): ReactNode => {
  const actionsRef = useRootActions(props.actionsRef);

  return (
    <MenuContext.Provider value={{ actionsRef, orientation: 'vertical', size }}>
      <BaseMenu.Root
        {...props}
        actionsRef={actionsRef}
      />
    </MenuContext.Provider>
  );
};

const SubmenuRoot = (props: BaseMenu.SubmenuRoot.Props): ReactNode => {
  const { actionsRef, orientation, size } = useContext(MenuContext);

  return (
    <MenuContext.Provider
      value={{
        actionsRef,
        orientation: 'vertical',
        // Menus of edit menus are iPad menus, as they open beside/below.
        size: orientation === 'horizontal' ? 'regular' : size,
        submenu: orientation,
      }}
    >
      <BaseMenu.SubmenuRoot {...props} />
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

/** A dragging finger, and its last movement (never none). */
type Finger = { movementX: number; movementY: number; x: number; y: number };

/**
 * Hovers an element (or stops hovering it) as a mouse would: Base UI
 * highlights an item a mouse hovers (and opens its submenu), and removes the
 * highlight when the mouse leaves it.
 */
const hover = (
  element: HTMLElement,
  entering: boolean,
  { movementX, movementY, x, y }: Finger,
) => {
  const types = entering
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

// Keeps a (trusted) click from its target.
const keepTrustedClick = (click: MouseEvent) => {
  if (!click.isTrusted) return;
  click.preventDefault();
  click.stopPropagation();
};

/** A menu's element scrolling its items (itself, unless it marks one). */
const scrollerOf = (menu: HTMLElement) =>
  menu.querySelector<HTMLElement>(`[${CSS.escape(part)}='scroller']`) ?? menu;

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
    // the drag's to make.
    document.addEventListener('click', keepTrustedClick, { capture: true });
    setTimeout(() => {
      document.removeEventListener('click', keepTrustedClick, {
        capture: true,
      });
    }, 500);

    // An open submenu stays open (clicking its item would close it).
    if (item && (!isSubmenuTrigger(item) || !isExpanded(item))) item.click();
  };

  for (const type of [...types, ...boundaryTypes]) {
    document.addEventListener(type, listener, { capture: true });
  }
  if (start) {
    finger = { movementX: 1, movementY: 1, ...start };
    update();
  }
};

type TriggerProps = Omit<BaseMenu.Trigger.Props, 'ref'> &
  SecondaryClickProps & {
    /**
     * What opens the menu: a click (default), or a secondary click (a right
     * click, or a touch held, then dragged on to the items; see
     * `useSecondaryClick`), a click then being the trigger's own (e.g. a
     * back button's, its menu the history; UIKit `UIButton.menu` without
     * `showsMenuAsPrimaryAction`, or a context menu).
     */
    openOn?: 'click' | 'secondaryClick';
  };

// Touch: no scrolling from the trigger, so it can be dragged from (opening
// on a click; otherwise, until held).
// (Its ref type doesn't match `forwardRef`'s, as with other Base UI triggers.)
const StyledTrigger = styled(BaseMenu.Trigger, forwardRef)<{
  openOn?: TriggerProps['openOn'];
}>`
  touch-action: ${({ openOn }) =>
    openOn === 'secondaryClick' ? 'manipulation' : 'none'};
` as unknown as FunctionComponent<
  Omit<TriggerProps, 'onSecondaryClick'> & { ref?: Ref<HTMLElement> }
>;

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
let openingBySecondaryClick = false;

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
    const secondary = openOn === 'secondaryClick';
    type Handler<E> = ((event: E) => void) | undefined;
    // A secondary click (or a handler for it) opens the menu.
    const triggerProps = useSecondaryClick({
      ...props,
      onSecondaryClick: secondary
        ? (event: ReactMouseEvent<HTMLElement>) => {
            props.onSecondaryClick?.(event);
            openingBySecondaryClick = true;
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
              openingBySecondaryClick = false;
            }
          }
        : props.onSecondaryClick,
    });

    return (
      <StyledTrigger
        ref={ref}
        {...triggerProps}
        openOn={openOn}
        // A click is the trigger's own (Base UI opens on mouse down, or on
        // a click by keys).
        onClick={(event: BaseUIEvent<ReactMouseEvent<HTMLElement>>) => {
          (onClick as Handler<typeof event>)?.(event);
          if (secondary) event.preventBaseUIHandler();
        }}
        onMouseDown={(event: BaseUIEvent<ReactMouseEvent<HTMLElement>>) => {
          (onMouseDown as Handler<typeof event>)?.(event);
          if (secondary && !openingBySecondaryClick) {
            event.preventBaseUIHandler();
          }
        }}
        onPointerDown={(event: PointerEvent<HTMLElement>) => {
          // Its own, and the secondary click's.
          (
            (triggerProps as { onPointerDown?: unknown })
              .onPointerDown as Handler<typeof event>
          )?.(event);
          if (secondary) return;
          if (event.pointerType !== 'touch' || event.defaultPrevented) return;

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
 * Closes the root menu when a positioner's anchor (Base UI:
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

    const close = () => actionsRef?.current?.close();

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

// Compact submenus open below their trigger, over the parent's items,
// aligned with its popup's edge; regular ones beside it, aligned with its
// first item; those of a horizontal menu (edit menu) below it, at its end.
// Above the page's own stacking (e.g. list rows' and segmented items'
// z-indexes, bars at 10), which would otherwise show through it.
const StyledPositioner = styled(BaseMenu.Positioner, forwardRef)`
  z-index: 100;
`;

const Positioner = forwardRef<
  HTMLDivElement,
  Omit<BaseMenu.Positioner.Props, 'ref'>
>((props, forwardedRef) => {
  const { size, submenu } = useContext(MenuContext);
  const ref = useForwardedRef(forwardedRef);
  useCloseOutOfView(ref);

  const defaults = ((): Pick<
    BaseMenu.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset'
  > => {
    if (submenu === 'horizontal') {
      return { align: 'end', alignOffset: -4, side: 'bottom', sideOffset: 12 };
    }
    if (submenu && size === 'compact') {
      return {
        align: 'start',
        alignOffset: -8,
        side: 'bottom',
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
    <StyledPositioner
      ref={ref}
      {...props}
      align={props.align ?? defaults.align}
      alignOffset={props.alignOffset ?? defaults.alignOffset}
      side={props.side ?? defaults.side}
      sideOffset={props.sideOffset ?? defaults.sideOffset}
    />
  );
});

/**
 * Opening and closing transition of a glass popup: it scales in from its
 * anchor, and out (Framework7 `popover-ios.less`: `.popover.modal-in`,
 * `.modal-out`).
 */
export const popupTransition = css`
  transform-origin: var(--transform-origin);
  transition-duration: 400ms;
  transition-property: opacity, scale;
  transition-timing-function: cubic-bezier(0, 1, 0.2, 1.05);

  &[data-starting-style] {
    scale: 0;
  }

  &[data-ending-style] {
    opacity: 0;
    scale: 0;
    transition-duration: 300ms;
  }
`;

const StyledPopup = styled(BaseMenu.Popup, forwardRef)<{
  overlay: boolean;
  size: Size;
}>`
  ${({ size }) => sizeVars[size]}
  ${glassMedium()}
  ${popupTransition}
  --styled-menu-toggle-space: 0px;
  --styled-menu-padding-block: 10px;
  --styled-menu-radius-inline: calc(
    var(--styled-menu-pill) + var(--styled-menu-inset)
  );
  --styled-menu-radius-block: calc(
    var(--styled-menu-pill) + var(--styled-menu-padding-block)
  );

  position: relative;
  display: flex;
  min-width: 238px;
  max-height: var(--available-height);
  box-sizing: border-box;
  flex-direction: column;
  padding: var(--styled-menu-padding-block) var(--styled-menu-inset);
  border-radius: var(--styled-menu-radius-inline) /
    var(--styled-menu-radius-block);
  outline: none;
  overflow-y: auto;

  ${({ overlay }) =>
    overlay
      ? [
          'min-width: max(238px, var(--anchor-width) + 2 * var(--styled-menu-inset));',
          // On its parent's glass: no background of its own to compound
          // (&&: over the color scheme's glass declarations).
          '&& {',
          'background-color: transparent;',
          '}',
        ].join('\n')
      : ''}

  &:has([role='menuitemcheckbox'], [role='menuitemradio']) {
    --styled-menu-toggle-space: 28px;
  }

  /* While a compact submenu covers it, all but its trigger fade (iOS). */
  & > *,
  & > [role='group'] > * {
    transition: opacity 200ms;
  }

  &:has(> [data-submenu-overlay][data-popup-open]) > :not([data-popup-open]),
  &:has(> [role='group'] > [data-submenu-overlay][data-popup-open])
    > :not([role='group']),
  &:has(> [role='group'] > [data-submenu-overlay][data-popup-open])
    > [role='group']
    > :not([data-popup-open]) {
    opacity: 0.2;
  }
`;

const highlightSelectors = ['[data-highlighted]', '[data-popup-open]'];

/** The menu's glass popup (Figma “Liquid Glass - Medium”). */
const Popup = forwardRef<HTMLDivElement, Omit<BaseMenu.Popup.Props, 'ref'>>(
  ({ children, ...props }, ref) => {
    const { size, submenu } = useContext(MenuContext);

    return (
      <StyledPopup
        ref={ref}
        // Compact submenus cover their parent's items: as wide as its popup.
        overlay={submenu === 'vertical' && size === 'compact'}
        size={size}
        {...props}
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
      </StyledPopup>
    );
  },
);

// Figma “Selection”: a pill.
const selection = css`
  &::before {
    position: absolute;
    border-radius: 100px;
    background-color: var(--styled-glass-selection);
    content: '';
    inset: 0;
    opacity: 0;
  }
`;

// Figma “Item”: [checkmark] [symbol] label/subtitle [shortcut | chevron].
type CursorProps = { disabled?: boolean; onClick?: unknown };

const cursorDeclarations = (fallback: string) =>
  [
    `--styled-cursor: attr(cursor type(<custom-ident>), ${fallback});`,
    '@media (hover: hover) { cursor: var(--styled-cursor); }',
  ].join('\n');

/**
 * The cursor of an item doing something only with a click handler, as
 * `Button`: a `cursor` prop, or `pointer` with a click handler, `not-allowed`
 * without one or while disabled (internal).
 */
export const actionCursor = ({ disabled, onClick }: CursorProps): string =>
  cursorDeclarations(disabled || !onClick ? 'not-allowed' : 'pointer');

/**
 * The cursor of an item always doing something (toggles, links, submenu
 * triggers): a `cursor` prop, or `pointer`, `not-allowed` while disabled
 * (internal).
 */
export const toggleCursor = ({ disabled }: CursorProps): string =>
  cursorDeclarations(disabled ? 'not-allowed' : 'pointer');

const item = css`
  ${selection}

  position: relative;
  display: grid;
  box-sizing: border-box;
  align-items: center;
  padding: 0 8px;
  color: var(--styled-glass-content);
  grid-template-columns: auto minmax(0, 1fr) auto;
  mix-blend-mode: var(--styled-glass-content-blend);
  outline: none;
  padding-inline-start: calc(8px + var(--styled-menu-toggle-space));
  user-select: none;

  /* Highlighted (or its submenu open), the popup's moving selection (see
     Popup). Touch: the selection while pressed (no hover highlights). */
  &:active:not([data-disabled]) {
    &::before {
      opacity: 1;
    }
  }

  &[data-disabled] {
    --styled-glass-content: var(--styled-glass-content-disabled);
    --styled-glass-content-secondary: var(--styled-glass-content-disabled);
  }

  &[data-destructive]:not([data-disabled]) {
    --styled-glass-content: var(--color-ios-system-red);

    mix-blend-mode: normal;
  }
`;

type ItemProps = {
  /**
   * Default: `pointer` with a click handler (toggles, links, submenu
   * triggers: always), otherwise or while disabled `not-allowed`.
   */
  cursor?: Properties['cursor'];
  /** Red content (Figma State=Destructive). */
  destructive?: boolean;
};

const destructiveProps = (destructive?: boolean) =>
  destructive ? { 'data-destructive': '' } : {};

const StyledItem = styled(BaseMenu.Item, forwardRef)`
  ${item}
  ${actionCursor}
`;

const Item = forwardRef<
  HTMLElement,
  Omit<BaseMenu.Item.Props, 'ref'> & ItemProps
>(({ destructive, ...props }, ref) => (
  <StyledItem
    ref={ref}
    {...destructiveProps(destructive)}
    {...props}
  />
));

const StyledLinkItem = styled(BaseMenu.LinkItem, forwardRef)`
  ${item}
  ${toggleCursor}

  text-decoration: none;
`;

const LinkItem = forwardRef<
  Element,
  Omit<BaseMenu.LinkItem.Props, 'ref'> & ItemProps
>(({ destructive, ...props }, ref) => (
  <StyledLinkItem
    ref={ref}
    {...destructiveProps(destructive)}
    {...props}
  />
));

const StyledCheckboxItem = styled(BaseMenu.CheckboxItem, forwardRef)`
  ${item}
  ${toggleCursor}
`;

const CheckboxItem = forwardRef<
  HTMLElement,
  Omit<BaseMenu.CheckboxItem.Props, 'ref'> & ItemProps
>(({ destructive, ...props }, ref) => (
  <StyledCheckboxItem
    ref={ref}
    {...destructiveProps(destructive)}
    {...props}
  />
));

const StyledRadioItem = styled<
  typeof BaseMenu.RadioItem,
  Omit<BaseMenu.RadioItem.Props, 'ref'> & { ref?: Ref<HTMLElement> }
>(BaseMenu.RadioItem, forwardRef)`
  ${item}
  ${toggleCursor}
`;

const RadioItem = forwardRef<
  HTMLElement,
  Omit<BaseMenu.RadioItem.Props, 'ref'> & ItemProps
>(({ destructive, ...props }, ref) => (
  <StyledRadioItem
    ref={ref}
    {...destructiveProps(destructive)}
    {...props}
  />
));

// Figma “Checkmark” (􀆅, 17px, 590), in the reserved checkmark column.
const indicator = css`
  position: absolute;
  top: 50%;
  left: 8px;
  display: flex;
  width: 24px;
  height: 22px;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  translate: 0 -50%;
`;

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

const StyledCheckboxItemIndicator = styled(
  BaseMenu.CheckboxItemIndicator,
  forwardRef,
)`
  ${indicator}
`;

const CheckboxItemIndicator = forwardRef<
  HTMLSpanElement,
  Omit<BaseMenu.CheckboxItemIndicator.Props, 'ref'>
>(({ children, ...props }, ref) => (
  <StyledCheckboxItemIndicator
    ref={ref}
    {...props}
  >
    {children ?? <Checkmark />}
  </StyledCheckboxItemIndicator>
));

const StyledRadioItemIndicator = styled(
  BaseMenu.RadioItemIndicator,
  forwardRef,
)`
  ${indicator}
`;

const RadioItemIndicator = forwardRef<
  HTMLSpanElement,
  Omit<BaseMenu.RadioItemIndicator.Props, 'ref'>
>(({ children, ...props }, ref) => (
  <StyledRadioItemIndicator
    ref={ref}
    {...props}
  >
    {children ?? <Checkmark />}
  </StyledRadioItemIndicator>
));

// Figma “Submenu” (􀆊 or, compact and open, 􀆈: 15px, 700).
const Chevron = styled('span')`
  display: flex;
  width: 14px;
  min-height: 20px;
  align-items: center;
  justify-content: center;
  grid-column: 3;
  grid-row: 1 / span 2;
  margin-inline-start: 4px;
  transition: rotate 200ms;

  [data-popup-open] > & {
    rotate: var(--styled-menu-chevron-open-rotation);
  }
`;

const StyledSubmenuTrigger = styled(BaseMenu.SubmenuTrigger, forwardRef)<{
  size: Size;
}>`
  ${item}
  ${toggleCursor}
  --styled-menu-chevron-open-rotation: ${({ size }) =>
    size === 'compact' ? '90deg' : '0deg'};
`;

/** An item opening a submenu, with a chevron. */
const SubmenuTrigger = forwardRef<
  HTMLElement,
  Omit<BaseMenu.SubmenuTrigger.Props, 'ref'> & ItemProps
>(({ children, destructive, ...props }, ref) => {
  const { orientation, size } = useContext(MenuContext);

  return (
    <StyledSubmenuTrigger
      ref={ref}
      size={size}
      // Its submenu covers the parent's items (see `Popup`).
      {...(size === 'compact' && orientation === 'vertical'
        ? { 'data-submenu-overlay': '' }
        : {})}
      {...destructiveProps(destructive)}
      {...props}
    >
      {children as ReactNode}
      <Chevron aria-hidden="true">
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
      </Chevron>
    </StyledSubmenuTrigger>
  );
});

// Figma “Symbol”: 28px wide, hidden (with its gap) when absent.
const StyledIcon = styled('span', forwardRef)`
  display: flex;
  width: 28px;
  min-height: var(--styled-menu-icon-line-height);
  align-items: center;
  justify-content: center;
  font-size: var(--styled-menu-icon-size);
  ${fontWeight(400)}
  grid-column: 1;
  grid-row: 1 / span 2;
  line-height: var(--styled-menu-icon-line-height);
  margin-inline-end: 4px;
`;

// Figma “Label and Subtitle”: the text is padded (10px or 9px), not the
// item, whose symbol is taller than the label.
const StyledLabel = styled('span', forwardRef)`
  padding: var(--styled-menu-item-padding-block) 0;
  font-size: var(--styled-menu-label-size);
  ${fontWeight(400)}
  grid-column: 2;
  grid-row: 1;
  letter-spacing: var(--styled-menu-label-letter-spacing);
  line-height: var(--styled-menu-label-line-height);
  padding-inline-start: 4px;
`;

const StyledSubtitle = styled('span', forwardRef)`
  padding-bottom: var(--styled-menu-item-padding-block);
  margin-top: calc(2px - var(--styled-menu-item-padding-block));
  color: var(--styled-glass-content-secondary);
  font-size: 13px;
  ${fontWeight(400)}
  grid-column: 2;
  grid-row: 2;
  line-height: var(--styled-menu-subtitle-line-height);
  padding-inline-start: 4px;
`;

// Figma “_Shortcuts”: modifier and key glyphs (e.g. “⌘A”), each centered in
// a 14px cell, 1px apart.
const StyledShortcut = styled('kbd', forwardRef)`
  display: flex;
  color: var(--styled-glass-content-secondary);
  font-family: inherit;
  font-feature-settings: 'ss15';
  font-size: 15px;
  ${fontWeight(510)}
  gap: 1px;
  grid-column: 3;
  grid-row: 1 / span 2;
  line-height: 20px;
  margin-inline-start: 4px;

  & > span {
    min-width: 14px;
    text-align: center;
  }
`;

const Shortcut = forwardRef<HTMLElement, React.ComponentProps<'kbd'>>(
  ({ children, ...props }, ref) => (
    <StyledShortcut
      ref={ref}
      {...props}
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
    </StyledShortcut>
  ),
);

// Figma “Separator”: a hairline, inset 8px; on iPad 16px high, 17px before
// a section, 21px after quick actions (iPhone: 21px).
const StyledSeparator = styled(BaseMenu.Separator, forwardRef)`
  display: flex;
  height: var(--styled-menu-separator-height);
  flex: none;
  align-items: center;
  padding: 0 8px;

  &:has(+ [role='group']) {
    height: var(--styled-menu-separator-height-section);
  }

  [${part}='quick-actions'] + & {
    height: var(--styled-menu-separator-height-quick-actions);
  }

  &::before {
    height: 1px;
    flex: 1;
    background-color: var(--styled-glass-separator);
    content: '';
    mix-blend-mode: var(--styled-glass-content-blend);
  }
`;

const Separator = StyledSeparator;

// Figma “Section Title”.
const GroupLabel = styled(BaseMenu.GroupLabel, forwardRef)`
  padding: var(--styled-menu-title-padding);
  color: var(--styled-glass-content-disabled);
  font-size: var(--styled-menu-title-size);
  ${fontWeight(510)}
  letter-spacing: -0.08px;
  line-height: 15px;
  mix-blend-mode: var(--styled-glass-content-blend);
`;

// Figma “Quick Actions”: a row of tiles, inset 10px from the popup's edge.
const StyledQuickActions = styled('div', forwardRef)`
  display: flex;
  flex: none;
  gap: 6px;
  margin-inline: calc(10px - var(--styled-menu-inset));
`;

const QuickActions = forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  (props, ref) => (
    <StyledQuickActions
      ref={ref}
      {...{ [part]: 'quick-actions' }}
      {...props}
    />
  ),
);

// Figma “Quick Action”: a tile with a symbol above a label, and the
// selection (“BG”) while highlighted; concentric with the popup, 10px in.
const StyledQuickAction = styled(BaseMenu.Item, forwardRef)`
  ${actionCursor}

  position: relative;
  display: flex;
  min-width: 0;
  flex: 1 1 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--styled-menu-quick-padding);
  border-radius: calc(var(--styled-menu-radius-inline) - 10px) /
    calc(var(--styled-menu-radius-block) - 10px);
  color: var(--styled-glass-content);
  gap: var(--styled-menu-quick-gap);
  mix-blend-mode: var(--styled-glass-content-blend);
  outline: none;
  user-select: none;

  &::before {
    position: absolute;
    border-radius: inherit;
    background-color: var(--styled-glass-selection);
    content: '';
    inset: 0;
    opacity: 0;
  }

  /* Highlighted, the popup's moving selection (see Popup). Touch: the
     selection while pressed (no hover highlights). */
  &:active:not([data-disabled]) {
    &::before {
      opacity: 1;
    }
  }

  &[data-disabled] {
    --styled-glass-content: var(--styled-glass-content-disabled);
  }

  &[data-destructive]:not([data-disabled]) {
    --styled-glass-content: var(--color-ios-system-red);

    mix-blend-mode: normal;
  }

  & > [${part}='icon'] {
    width: auto;
    height: var(--styled-menu-quick-symbol-line-height);
    min-height: 0;
    margin: 0;
    line-height: var(--styled-menu-quick-symbol-line-height);
  }

  & > [${part}='label'] {
    overflow: hidden;
    max-width: 100%;
    padding: 0;
    font-size: 12px;
    ${fontWeight(510)}
    letter-spacing: normal;
    line-height: 18px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const QuickAction = forwardRef<
  HTMLElement,
  Omit<BaseMenu.Item.Props, 'ref'> & ItemProps
>(({ destructive, ...props }, ref) => (
  <StyledQuickAction
    ref={ref}
    {...destructiveProps(destructive)}
    {...props}
  />
));

type SpanProps = React.ComponentProps<'span'>;

const Icon = forwardRef<HTMLSpanElement, SpanProps>((props, ref) => (
  <StyledIcon
    ref={ref}
    {...{ [part]: 'icon' }}
    {...props}
  />
));

const Label = forwardRef<HTMLSpanElement, SpanProps>((props, ref) => (
  <StyledLabel
    ref={ref}
    {...{ [part]: 'label' }}
    {...props}
  />
));

const Subtitle = forwardRef<HTMLSpanElement, SpanProps>((props, ref) => (
  <StyledSubtitle
    ref={ref}
    {...{ [part]: 'subtitle' }}
    {...props}
  />
));

/** The menu's trigger (also of `ContextualMenu`). */
export { Trigger as MenuTrigger };

export const Menu = {
  ...BaseMenu,
  Root,
  SubmenuRoot,
  Trigger,
  Positioner,
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
