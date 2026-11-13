import '../glass/style.css';
import './style.css';

import { forwardRef, useState } from 'react';

import { cn } from '../utils/main.js';
import { useSizeClass, ViewportScopeContext } from '../viewport/main.js';
import type {
  SidebarRootProps,
  SidebarToolbarGroupProps,
  SidebarToolbarProps,
} from './props.js';

export type {
  SidebarRootProps,
  SidebarToolbarGroupProps,
  SidebarToolbarProps,
} from './props.js';

// A sidebar: a floating panel of glass, its corners 20px, 11px from
// its top, 16px from its sides, 10px from its bottom; its content e.g. a
// toolbar (borderless buttons, Body, symbols 510, the
// trailing ones 24px apart; 20px above what follows), a search field
// (`TextField.Frame`: 44px high, on the secondary fill) and a list
// (`List.Root` of style `sidebar`: capsule rows, sections without a shape of
// their own), scrolling inside it. Put it in a `Layout` column (`floating`:
// over the other columns; compact: a drawer, swiped in), which places and sizes
// it. Its toolbar staying at its top while its list scrolls: a page in a
// header (`Header.Root`: the toolbar in a `Viewport.BlockStart`, the list
// in a `Page.Root`, a search field in a `Header.Accessory`), as a screen's;
// it's their screen (their containing block, their scope, its padding
// their safe area insets).
//
// Also:
// - The glass is the menus' (`glassMedium`: a fill and a soft glow, without
//   blend modes), 10px from the column's sides; its top at the top inset,
//   as a page's bar's buttons are (a back button's top: iPadOS 26's,
//   measured); its bottom 5px into the bottom inset (10px from the edge at
//   least), in a regular width 8px from the screen's bottom and from its
//   sides, as an `Island`'s (the home indicator over it); in dark mode, a light rim and a glow outside it (the glass' inner
//   shadow would look inset).

/**
 * A sidebar: a floating glass panel, its
 * content (e.g. a `TextField.Frame`, a `List.Root` of style `sidebar`)
 * scrolling inside it; in a `Layout` column (see there).
 */
const Root = forwardRef<HTMLElement, SidebarRootProps>(
  ({ className, ...props }, ref) => {
    // (Regular: beside the pages' anchored bars and islands, its bottom
    // theirs, see style.css.)
    const isRegular = useSizeClass() === 'regular';
    // Its bars' scope (holding a page in a header: see style.css), its own:
    // fixed to it, not adding to the column's.
    const [scope] = useState(() => ({}));
    return (
      <ViewportScopeContext.Provider value={scope}>
        <nav
          ref={ref}
          data-regular={isRegular ? '' : undefined}
          data-sidebar-part="root"
          {...props}
          className={cn(
            'uikit-sidebar-root uikit-glass-medium uikit-glass-panel',
            className,
          )}
        />
      </ViewportScopeContext.Provider>
    );
  },
);

// Its toolbar: its parts at its ends, their content at the sidebar's (16px
// in); 54px from the panel's top to what follows. Its buttons' shapes
// (highlights) evenly 8px from the panel's top and sides, as nested shapes
// are (text buttons 8px in, symbols as circles).
const Toolbar = forwardRef<HTMLDivElement, SidebarToolbarProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('uikit-sidebar-toolbar', className)}
      data-sidebar-part="toolbar"
      {...props}
    />
  ),
);

// Its buttons at one end: 34px circles 18px apart.
const ToolbarGroup = forwardRef<HTMLDivElement, SidebarToolbarGroupProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('uikit-sidebar-toolbar-group', className)}
      data-sidebar-part="toolbar-group"
      {...props}
    />
  ),
);

export const Sidebar = {
  Root,
  Toolbar,
  ToolbarGroup,
};
