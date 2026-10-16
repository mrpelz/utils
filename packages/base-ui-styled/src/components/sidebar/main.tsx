import '../glass/style.css';
import './style.css';

import { ComponentProps, forwardRef } from 'react';

import { cn } from '../utils/main.js';

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

/**
 * A sidebar (Figma “Sidebar”, iPadOS 26): a floating glass panel, its
 * content (e.g. a `TextField.Search`, a `List.Root` of style `sidebar`)
 * scrolling inside it; in a `Layout` column (see there).
 */
const Root = forwardRef<HTMLElement, ComponentProps<'nav'>>((props, ref) => (
  <nav
    ref={ref}
    data-sidebar-part="root"
    {...props}
    className={cn('bus-sidebar-root bus-glass-medium', props.className)}
  />
));

// Figma “Toolbar - Top” (its window controls left out): its parts at its
// ends, their content at the sidebar's (16px in); 54px from the panel's
// top to what follows (Figma: 11px, a 23px row, 20px). Its buttons' shapes
// (highlights) evenly 8px from the panel's top and sides, as nested shapes
// are (text buttons 8px in, symbols as circles).
const Toolbar = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('bus-sidebar-toolbar', className)}
      {...props}
    />
  ),
);

// Its buttons at one end (Figma “Trailing”: symbols' 28px boxes 24px
// apart; here, 34px circles 18px apart).
const ToolbarGroup = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('bus-sidebar-toolbar-group', className)}
      {...props}
    />
  ),
);

export const Sidebar = {
  Root,
  Toolbar,
  ToolbarGroup,
};
