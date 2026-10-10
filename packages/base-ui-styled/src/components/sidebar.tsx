import { styled } from 'goober';
import { ComponentProps, forwardRef } from 'react';

import { glassMedium } from './glass.js';
import { colorScheme } from './utils.js';

// Source: Apple iOS 26 Figma (“Sidebars”: “Sidebar”, iPadOS 26): a floating
// panel of glass (Figma “Liquid Glass - Large”), its corners 20px, 11px
// from its top, 16px from its sides, 10px from its bottom; its content e.g.
// a toolbar (Figma “Sidebar Toolbar”: borderless buttons, Body, symbols
// 510, the trailing ones 24px apart; 20px above what follows), a search field (`TextField.Search`: 44px high, on the
// secondary fill) and a list (`List.Root` of style `sidebar`: capsule
// rows, sections without a shape of their own), scrolling inside it. Put
// it in a `Layout` column (`floating`: over the other columns; compact: a
// drawer, swiped in), which places and sizes it.
//
// Deviations:
// - The glass is the menus' (`glassMedium`: as Figma's large glass, a fill
//   and a soft glow, without its blend modes), 8px from the column's edges
//   (Figma: the sidebar alone); in dark mode, a light rim and a glow
//   outside it (the glass' inner shadow would look inset).

const StyledRoot = styled('nav', forwardRef)`
  ${glassMedium()}
  ${colorScheme(
    // Its selection's fill (selected and pressed rows, pressed toolbar
    // buttons; Figma: #ededed over its glass).
    `--styled-sidebar-selection: rgb(0 0 0 / 7%);
     --styled-search-fill: rgb(0 0 0 / 7%);`,
    // Dark: floating (a light rim, a glow outside; the glass' dark inner
    // bands would make the large panel look inset, user).
    `--styled-sidebar-selection: rgb(255 255 255 / 12%);
    --styled-search-fill: rgb(255 255 255 / 12%);
    box-shadow:
      inset 0 0 0 1px rgb(255 255 255 / 15%),
      0 0 25px rgb(0 0 0 / 30%);`,
  )}
  /* Its search field (see TextField.Search): Figma's fill blended with the
     glass (plus-darker, plus-lighter in dark mode) as a flat color; its
     symbol and placeholder in the glass' secondary content color (#999). */
  --styled-search-height: 44px;
  --styled-search-padding: 11px;
  --styled-search-gap: 8px;

  display: flex;
  overflow: auto;
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
  flex-direction: column;
  padding: 11px 16px 10px;
  border-radius: 20px;
  margin: var(--styled-sidebar-margin, 8px);
  color: var(--color-ios-label);
  overscroll-behavior: contain;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  & [data-text-field-part='search'] {
    color: var(--styled-glass-content-secondary);
  }

  & [data-text-field-part='search'] input::placeholder {
    color: var(--styled-glass-content-secondary);
  }

  /* Its list: no room after its last section. */
  & > [data-list-part='root'] > :last-child {
    margin-block-end: 0;
  }
`;

/**
 * A sidebar (Figma “Sidebar”, iPadOS 26): a floating glass panel, its
 * content (e.g. a `TextField.Search`, a `List.Root` of style `sidebar`)
 * scrolling inside it; in a `Layout` column (see there).
 */
const Root = forwardRef<HTMLElement, ComponentProps<'nav'>>((props, ref) => (
  <StyledRoot
    ref={ref}
    data-sidebar-part="root"
    {...props}
  />
));

// Figma “Toolbar - Top” (its window controls left out): its parts at its
// ends, their content at the sidebar's (16px in); 54px from the panel's
// top to what follows (Figma: 11px, a 23px row, 20px). Its buttons' shapes
// (highlights) evenly 8px from the panel's top and sides, as nested shapes
// are (text buttons 8px in, symbols as circles).
const Toolbar = styled('div', forwardRef)`
  --styled-button-plain-size: var(--font-ios-body-size);
  --styled-button-plain-line-height: var(--font-ios-body-line-height);
  --styled-button-plain-tracking: var(--font-ios-body-tracking);
  --styled-button-plain-symbol-weight: 510;
  --styled-button-plain-padding-inline: 8px;
  --styled-button-plain-background-pressed: var(--styled-sidebar-selection);

  display: flex;
  min-height: 34px;
  flex: none;
  align-items: center;
  justify-content: space-between;
  margin-block-start: -3px;
  margin-inline: -8px;
  padding-block-end: 10px;
`;

// Its buttons at one end (Figma “Trailing”: symbols' 28px boxes 24px
// apart; here, 34px circles 18px apart).
const ToolbarGroup = styled('div', forwardRef)`
  display: flex;
  align-items: center;
  gap: 18px;
`;

export const Sidebar = {
  Root,
  Toolbar,
  ToolbarGroup,
};
