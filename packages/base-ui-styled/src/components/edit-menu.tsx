import { Menu as BaseMenu } from '@base-ui/react/menu';
import { Properties } from 'csstype';
import { styled } from 'goober';
import { forwardRef, ReactNode, Ref } from 'react';

import { glassMedium } from './glass.js';
import {
  actionCursor,
  MenuContext,
  MenuRootProps,
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
// from the end.
const StyledPopup = styled(BaseMenu.Popup, forwardRef)`
  ${glassMedium()}
  ${popupTransition}

  position: relative;
  display: flex;
  min-height: 44px;
  box-sizing: border-box;
  align-items: center;
  padding: 0 4px;
  border-radius: 100px;
  outline: none;
`;

/** The edit menu's glass capsule (Figma “Liquid Glass”, Medium). */
const Popup = forwardRef<HTMLDivElement, Omit<BaseMenu.Popup.Props, 'ref'>>(
  ({ children, ...props }, ref) => (
    <StyledPopup
      ref={ref}
      {...props}
    >
      {children}
    </StyledPopup>
  ),
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
    mix-blend-mode: var(--styled-glass-selection-blend);
    opacity: 0;
  }

  &[data-highlighted]::before {
    opacity: 1;
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
  &[data-highlighted] + &::after {
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
  &[data-popup-open] {
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
