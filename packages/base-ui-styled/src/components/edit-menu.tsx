import { Menu as BaseMenu } from '@base-ui/react/menu';
import { Properties } from 'csstype';
import { styled } from 'goober';
import {
  forwardRef,
  PointerEvent,
  ReactNode,
  Ref,
  useLayoutEffect,
  useRef,
} from 'react';

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
import { fontWeight, useForwardedRef } from './utils.js';

// Source: Apple iOS 26 Figma (“Menus”: “Edit Menu”, “_Edit Menu Item”,
// Mode=Light and Dark), with the destructive color mapped to `systemRed`;
// the “Medium” glass material and vibrant content colors are tokens in
// `styles.tsx`, used via `glass.tsx` (`glassMedium`).
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
 * at its positioner's `anchor`; it has no visible trigger.
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
const Positioner = forwardRef<
  HTMLDivElement,
  Omit<BaseMenu.Positioner.Props, 'ref'>
>((props, forwardedRef) => {
  const ref = useForwardedRef(forwardedRef);
  useCloseOutOfView(ref);

  return (
    <BaseMenu.Positioner
      ref={ref}
      {...props}
      side={props.side ?? 'top'}
      sideOffset={props.sideOffset ?? 8}
    />
  );
});

// Figma “Edit Menu”: 44px high, actions from 20px, the “more” button 4px
// from the end; at most as wide as the space Base UI's positioner finds.
const StyledPopup = styled(BaseMenu.Popup, forwardRef)`
  ${glassMedium()}
  ${popupTransition}

  position: relative;
  display: flex;
  max-width: var(--available-width);
  min-height: 44px;
  box-sizing: border-box;
  align-items: center;
  padding: 0 4px;
  border-radius: 100px;
  outline: none;
`;

// The actions, in a row; too narrow for them, a scroll container (only
// then: its content blends with the glass otherwise, see Popup), faded at
// its ends. The “more” button is positioned by the popup (beyond the
// scroller's clipping and scrolling), the space at the end kept for it.
const Scroller = styled('div', forwardRef)`
  --styled-edit-menu-fade: to right;

  display: flex;
  min-width: 0;
  flex: 1 1 auto;
  align-items: center;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
  touch-action: none;

  &:dir(rtl) {
    --styled-edit-menu-fade: to left;
  }

  &:has(> [aria-haspopup='menu']) {
    padding-inline-end: 36px;
    scroll-padding-inline-end: 36px;
  }

  &[data-overflowing] {
    overflow: auto hidden;
    mask-image: linear-gradient(
      var(--styled-edit-menu-fade),
      transparent,
      #000 16px,
      #000 calc(100% - 16px),
      transparent
    );

    &:has(> [aria-haspopup='menu']) {
      mask-image: linear-gradient(
        var(--styled-edit-menu-fade),
        transparent,
        #000 16px,
        #000 calc(100% - 52px),
        transparent calc(100% - 36px),
        #000 calc(100% - 36px)
      );
    }
  }
`;

const getRanges = (selection: Selection | null) =>
  selection
    ? Array.from({ length: selection.rangeCount }, (_, index) =>
        selection.getRangeAt(index).cloneRange(),
      )
    : [];

/**
 * Keeps the document's selection while the popup or its items have focus:
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
      if (popup.contains(document.activeElement)) return;
      ranges = getRanges(document.getSelection());
    };

    // On every focus inside, too: highlighting an item focuses it.
    const restore = () => {
      const selection = document.getSelection();
      if (!selection?.isCollapsed || ranges.length === 0) return;

      selection.removeAllRanges();
      for (const range of ranges) selection.addRange(range);
    };

    document.addEventListener('selectionchange', save);
    popup.addEventListener('focusin', restore);
    return () => {
      document.removeEventListener('selectionchange', save);
      popup.removeEventListener('focusin', restore);
    };
  }, [popupRef]);
};

// Marks the scroller while its actions overflow it.
const useOverflow = (scrollerRef: { current: HTMLDivElement | null }) => {
  useLayoutEffect(() => {
    const { current: scroller } = scrollerRef;
    if (!scroller) return undefined;

    const update = () => {
      scroller.toggleAttribute(
        'data-overflowing',
        scroller.scrollWidth > scroller.clientWidth + 1,
      );
    };
    const observer = new ResizeObserver(update);
    observer.observe(scroller);
    const mutations = new MutationObserver(() => {
      for (const child of scroller.children) observer.observe(child);
      update();
    });
    mutations.observe(scroller, { childList: true });
    for (const child of scroller.children) observer.observe(child);

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [scrollerRef]);
};

/** The edit menu's glass capsule (Figma “Liquid Glass”, Medium). */
const Popup = forwardRef<HTMLDivElement, Omit<BaseMenu.Popup.Props, 'ref'>>(
  ({ children, ...props }, forwardedRef) => {
    const ref = useForwardedRef(forwardedRef);
    const scrollerRef = useRef<HTMLDivElement>(null);
    useKeepSelection(ref);
    useOverflow(scrollerRef);

    return (
      <StyledPopup
        ref={ref}
        {...props}
      >
        <Scroller
          ref={scrollerRef}
          {...{ [part]: 'scroller' }}
          onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
            if (event.pointerType !== 'touch' || event.button !== 0) return;
            if (!(event.target instanceof Element)) return;
            const item = event.target.closest('[role^="menuitem"]');
            if (!item || item.matches('[aria-haspopup="menu"]')) return;

            // The drag hovers and clicks the items (see dragOverItems).
            event.preventDefault();
            if (item.hasPointerCapture(event.pointerId)) {
              item.releasePointerCapture(event.pointerId);
            }
            dragOverItems(item.ownerDocument, event.pointerId, {
              x: event.clientX,
              y: event.clientY,
            });
          }}
        >
          {children}
        </Scroller>
      </StyledPopup>
    );
  },
);

// Figma “_Edit Menu Item”: a label with a 1px divider before it (except the
// first), 16px apart; the dividers next to the highlighted action hide.
const StyledItem = styled(BaseMenu.Item, forwardRef)`
  ${actionCursor}

  position: relative;
  display: flex;
  min-height: 36px;
  box-sizing: border-box;
  flex: none;
  align-items: center;
  padding: 0 16px;
  color: var(--styled-glass-content);
  font-size: 15px;
  ${fontWeight(400)}
  letter-spacing: -0.6px;
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

  &[data-highlighted]::before {
    opacity: 1;
  }

  /* Touch: the selection while pressed (no hover highlights) */
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
    top: calc(50% - 9px);
    left: -1px;
    width: 1px;
    height: 18px;
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

// Figma “Menu”: a 36px circle with the selection and a chevron (􀆊, 15px,
// 590).
const StyledMore = styled<
  typeof BaseMenu.SubmenuTrigger,
  Omit<BaseMenu.SubmenuTrigger.Props, 'ref'> & { ref?: Ref<HTMLElement> }
>(BaseMenu.SubmenuTrigger, forwardRef)`
  ${toggleCursor}

  /* At the popup's end (see Scroller) */
  position: absolute;
  top: calc(50% - 18px);
  inset-inline-end: 4px;
  display: flex;
  width: 36px;
  height: 36px;
  flex: none;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--styled-glass-selection);
  color: var(--styled-glass-content);
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
        height="15"
        stroke="currentcolor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
        viewBox="0 0 10 16"
        width="10"
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
