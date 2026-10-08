import { Menu as BaseMenu } from '@base-ui/react/menu';
import { Properties } from 'csstype';
import { styled } from 'goober';
import { forwardRef, ReactNode, Ref, useLayoutEffect, useRef } from 'react';

import { glassMedium } from './glass.js';
import {
  actionCursor,
  dragOverItems,
  MenuContext,
  MenuRootProps,
  part,
  popupTransition,
  toggleCursor,
  useCloseOutOfView,
  useRootActions,
} from './menu.js';
import { fontWeight, MovingHighlight, useForwardedRef } from './utils.js';

// Source: Apple iOS 26 Figma (“Menus”: “Edit Menu”, “_Edit Menu Item”,
// Mode=Light and Dark), with the destructive color mapped to `systemRed`;
// the “Medium” glass material and vibrant content colors are tokens in
// `styles.tsx`, used via `glass.tsx` (`glassMedium`). Its metrics are iOS
// 26's own edit menu's, measured on an iPhone (see Deviations).
//
// A Base UI menu in a horizontal glass capsule (UIKit `UIEditMenuInteraction`):
// its actions are items, and `EditMenu.More` opens a submenu (a `Menu` popup)
// with further actions. It's opened by the app (`open`) at an anchor (the
// positioner's `anchor`, e.g. a selection), not by a trigger.
//
// It closes when its anchor or capsule leaves the viewport (see `Menu`).
//
// It never overflows its collision boundary (the viewport, or the
// positioner's `collisionBoundary`): too narrow for its actions, they scroll
// within the capsule, the “more” button staying at its end. Touches drag
// over the actions (no native scrolling), highlighting the one under the
// finger and choosing it on release; held near an end, they scroll the
// actions (as the tab bar's lens and menus do).
//
// Deviations:
// - More actions open in a menu below the capsule, an iPad (`regular`)
//   menu (UIKit: pages of the capsule).
// - Highlighted actions (pointer, keyboard) show the selection, as the “more”
//   button does (Figma: no highlighted actions).
// - The chevron is an SVG stroke (Figma: SF Symbols glyph 􀆊).
// - Metrics of iOS 26's own edit menu (measured): 42px high, 14px labels,
//   16px dividers, a 34px “more” button (Figma: 44px, 15px, 18px, 36px).
// - The capsule is Framework7's popover glass, as the menu's popup (see
//   `Menu`).

// Base UI positions a menu only for a trigger element; an edit menu opens
// at its anchor (e.g. a selection) instead, and pressing its content (e.g.
// to select text) must not open it. It's an inert, hidden element.
const HiddenTrigger = styled('span', forwardRef)`
  position: absolute;
  overflow: hidden;
  width: 0;
  height: 0;
  pointer-events: none;
`;

/**
 * An edit menu: controlled by `open` (e.g. when a selection is made), shown
 * at its positioner's `anchor`; it has no visible trigger. It isn't modal
 * (by default): the page stays interactive, and pressing outside of it
 * reaches the page (e.g. clearing the selection) as it closes the menu.
 */
const Root = ({
  children,
  orientation = 'horizontal',
  size = 'compact',
  ...props
}: MenuRootProps): ReactNode => {
  const actionsRef = useRootActions(props.actionsRef);

  return (
    <MenuContext.Provider value={{ actionsRef, orientation, size }}>
      <BaseMenu.Root
        modal={false}
        orientation={orientation}
        {...props}
        actionsRef={actionsRef}
      >
        <BaseMenu.Trigger
          aria-hidden="true"
          nativeButton={false}
          render={<HiddenTrigger />}
          tabIndex={-1}
        />
        {children as ReactNode}
      </BaseMenu.Root>
    </MenuContext.Provider>
  );
};

/** Positions the capsule above its anchor (e.g. a text selection). */
// Above the page's own stacking (e.g. list rows' and segmented items'
// z-indexes, bars at 10), which would otherwise show through it.
const StyledPositioner = styled(BaseMenu.Positioner, forwardRef)`
  z-index: 100;
`;

const Positioner = forwardRef<
  HTMLDivElement,
  Omit<BaseMenu.Positioner.Props, 'ref'>
>((props, forwardedRef) => {
  const ref = useForwardedRef(forwardedRef);
  useCloseOutOfView(ref);

  return (
    <StyledPositioner
      ref={ref}
      {...props}
      side={props.side ?? 'top'}
      sideOffset={props.sideOffset ?? 8}
    />
  );
});

// iOS 26 (measured): 42px high, actions from 20px, the “more” button 4px
// from the end; at most as wide as the space Base UI's positioner finds.
const StyledPopup = styled(BaseMenu.Popup, forwardRef)`
  ${glassMedium()}
  ${popupTransition}

  position: relative;
  display: flex;
  max-width: var(--available-width);
  min-height: 42px;
  box-sizing: border-box;
  align-items: center;
  padding: 0 4px;
  border-radius: 100px;
  outline: none;
`;

// The actions, faded at the ends with more actions beyond (see
// useOverflow), the space at the end kept for the “more” button: it's
// positioned by the popup (beyond the scroller's clipping and scrolling), so
// actions never scroll beneath it, but the fades' mask covers it, too.
const Actions = styled('div', forwardRef)`
  --styled-edit-menu-fade: to right;
  --styled-edit-menu-fade-start: 0px;
  --styled-edit-menu-fade-end: 0px;
  --styled-edit-menu-more: 0px;

  display: flex;
  min-width: 0;
  flex: 1 1 auto;
  padding-inline-end: var(--styled-edit-menu-more);

  &:dir(rtl) {
    --styled-edit-menu-fade: to left;
  }

  &:has(> * > [aria-haspopup='menu']) {
    --styled-edit-menu-more: 34px;
  }

  &[data-before] {
    --styled-edit-menu-fade-start: 16px;
  }

  &[data-after] {
    --styled-edit-menu-fade-end: 16px;
  }

  &[data-overflowing] {
    mask-image: linear-gradient(
      var(--styled-edit-menu-fade),
      transparent,
      #000 var(--styled-edit-menu-fade-start),
      #000
        calc(
          100% - var(--styled-edit-menu-more) - var(--styled-edit-menu-fade-end)
        ),
      transparent calc(100% - var(--styled-edit-menu-more)),
      #000 calc(100% - var(--styled-edit-menu-more))
    );
  }
`;

// The actions' row; too narrow for them, a scroll container (only then: its
// content blends with the glass otherwise, see Popup).
const Scroller = styled('div', forwardRef)`
  display: flex;
  min-width: 0;
  flex: 1 1 auto;
  align-items: center;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
  touch-action: none;

  [data-overflowing] > & {
    overflow: auto hidden;
  }
`;

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
      const before = first !== undefined && hidden.has(first);
      const after = last !== undefined && hidden.has(last);
      actions.toggleAttribute('data-before', before);
      actions.toggleAttribute('data-after', after);
      actions.toggleAttribute('data-overflowing', before || after);
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
      if (event.pointerType !== 'touch' || !event.isPrimary) return;
      if (!inMenu(event.target)) return;

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
  ({ children, ...props }, forwardedRef) => {
    const ref = useForwardedRef(forwardedRef);
    const scrollerRef = useRef<HTMLDivElement>(null);
    useKeepSelection(ref);
    useOverflow(scrollerRef);
    useTouchDrag(ref);

    return (
      <StyledPopup
        ref={ref}
        {...props}
      >
        <Actions>
          <Scroller
            ref={scrollerRef}
            {...{ [part]: 'scroller' }}
          >
            {children}
            {/* The selection, moving between actions (not the “more”
                circle, which shows its own). */}
            <MovingHighlight selectors={highlightSelectors} />
          </Scroller>
        </Actions>
      </StyledPopup>
    );
  },
);

// Figma “_Edit Menu Item” (iOS 26's metrics): a label with a 16px high, 1px
// divider before it (except the first), 16px apart; the dividers next to the
// highlighted action hide.
const StyledItem = styled(BaseMenu.Item, forwardRef)`
  ${actionCursor}

  position: relative;
  display: flex;
  min-height: 34px;
  box-sizing: border-box;
  flex: none;
  align-items: center;
  padding: 0 16px;
  color: var(--styled-glass-content);
  font-size: 14px;
  ${fontWeight(400)}
  letter-spacing: -0.15px;
  line-height: 18px;
  mix-blend-mode: var(--styled-glass-content-blend);
  outline: none;
  user-select: none;
  white-space: nowrap;

  &::before {
    position: absolute;
    border-radius: 100px;
    background-color: var(--styled-glass-selection);
    content: '';
    inset: 0;
    opacity: 0;
  }

  /* Highlighted, the scroller's moving selection (see Popup). Touch: the
     selection while pressed (no hover highlights). */
  &:active:not([data-disabled]) {
    &::before {
      opacity: 1;
    }
  }

  & + & {
    margin-inline-start: 1px;
  }

  & + &::after {
    position: absolute;
    top: calc(50% - 8px);
    left: -1px;
    width: 1px;
    height: 16px;
    background-color: var(--styled-glass-divider);
    content: '';
    transition: opacity 200ms;
  }

  /* Hidden next to the highlighted action, as in Segmented. */
  &[data-highlighted]::after,
  &[data-highlighted] + &::after,
  &:active::after,
  &:active + &::after {
    opacity: 0;
  }

  &[data-disabled] {
    --styled-glass-content: var(--styled-glass-content-disabled);
  }

  &[data-destructive]:not([data-disabled]) {
    --styled-glass-content: var(--color-ios-system-red);

    mix-blend-mode: normal;
  }

  & > * {
    position: relative;
  }
`;

type ItemProps = {
  /**
   * Default: `pointer` with a click handler, otherwise or while disabled
   * `not-allowed`.
   */
  cursor?: Properties['cursor'];
  /** Red label (Figma State=Destructive). */
  destructive?: boolean;
};

const Item = forwardRef<
  HTMLElement,
  Omit<BaseMenu.Item.Props, 'ref'> & ItemProps
>(({ children, destructive, ...props }, ref) => (
  <StyledItem
    ref={ref}
    {...(destructive ? { 'data-destructive': '' } : {})}
    {...props}
  >
    <span>{children as ReactNode}</span>
  </StyledItem>
));

// Figma “Menu” (iOS 26's metrics): a 34px circle with the selection and a
// chevron (􀆊, 14px, 590).
const StyledMore = styled<
  typeof BaseMenu.SubmenuTrigger,
  Omit<BaseMenu.SubmenuTrigger.Props, 'ref'> & { ref?: Ref<HTMLElement> }
>(BaseMenu.SubmenuTrigger, forwardRef)`
  ${toggleCursor}

  /* At the popup's end (see Actions) */
  position: absolute;
  top: calc(50% - 17px);
  display: flex;
  width: 34px;
  height: 34px;
  flex: none;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--styled-glass-selection);
  color: var(--styled-glass-content);
  inset-inline-end: 4px;
  mix-blend-mode: var(--styled-glass-content-blend);
  outline: none;

  &[data-highlighted],
  &[data-popup-open],
  &:active {
    filter: brightness(0.95);
  }

  & > svg {
    translate: 1px 0;
  }
`;

/**
 * The “more” button, opening a submenu with further actions: place it in a
 * `Menu.SubmenuRoot`, followed by a `Menu.Portal` with the submenu.
 */
const More = forwardRef<
  HTMLElement,
  Omit<BaseMenu.SubmenuTrigger.Props, 'ref'>
>(({ children, ...props }, ref) => (
  <StyledMore
    ref={ref}
    aria-label="More"
    {...props}
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
  </StyledMore>
));

export const EditMenu = {
  ...BaseMenu,
  Root,
  Positioner,
  Popup,
  Item,
  More,
};
