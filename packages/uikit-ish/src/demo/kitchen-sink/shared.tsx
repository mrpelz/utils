import {
  ComponentProps,
  createContext,
  FunctionComponent,
  ReactNode,
  useContext,
} from 'react';
import { createPortal } from 'react-dom';

import {
  Button,
  List,
  Navigation,
  type SettingsValues,
  Symbol,
  Toolbar,
  useSizeClass,
  type Viewport,
} from '../../components/index.js';
import {
  sfChevronBackward,
  sfInsetFilledLeadingthirdRectangle,
} from '../tooling/icons.js';

// The kitchen sink's pages (see main.tsx) and what they share.

/** A page: its title, its content (below its large title), its bar's. */
export type SinkPage = {
  /**
   * Its anchors (e.g. a `Viewport.Anchor` at an inline edge): beside its
   * bar, outside its scrolling page.
   */
  Anchors?: FunctionComponent;
  /** Its content (in its `Page.Root`, below its large title). */
  Content: FunctionComponent;
  /** Its bar's trailing items (in a `Toolbar.Trailing`). */
  Trailing?: FunctionComponent;
  /** The page background (as `Page.Root`'s). */
  background?: 'grouped' | 'plain';
  /**
   * The gap between its bar and its content (as `Viewport.Padding`'s
   * `margin`; e.g. 0, for a plain list's headers right below the bar).
   */
  contentMargin?: number | string;
  /** Its bar's edge effect, and its tint (as `Viewport.BlockStart`'s). */
  edgeEffect?: ComponentProps<typeof Viewport.BlockStart>['edgeEffect'];
  edgeTint?: string;
  /**
   * A stack of its own (a `Navigation.Root`): swiped back within it, not
   * out of it (the kitchen sink's swipe area left out while it's on top;
   * its root's back button leaving it, see navigation.tsx).
   */
  hasOwnStack?: boolean;
  /**
   * Its content alone (its own bars, pages, e.g. a tab bar app's): none of
   * the page's (its bar, its large title, its scrolling page).
   */
  isBare?: boolean;
  /**
   * Its content filling the screen, under its bar (e.g. a map): no
   * scrolling page, no large title.
   */
  isFullBleed?: boolean;
  /**
   * Pushed and popped at once, not slid in or out, nor swiped back (see
   * `Navigation.Page` `instant`): e.g. a page pulled past its ends.
   */
  isInstant?: boolean;
  /** Without a large title (its bar's title alone). */
  isLargeTitleHidden?: boolean;
  title: string;
};

/** Pages by key: a component's by its catalog id, its own as `id/…`. */
export type SinkPages = Readonly<Record<string, SinkPage>>;

/** Pushes a page (by its key) on the current stack. */
export const PushContext = createContext<(key: string) => void>(
  () => undefined,
);

export const usePush = (): ((key: string) => void) => useContext(PushContext);

/**
 * Pops the current stack's top page: e.g. from a stack of a page's own,
 * at its root (its own back buttons going back within it).
 */
export const PopContext = createContext<() => void>(() => undefined);

export const usePop = (): (() => void) => useContext(PopContext);

/**
 * The layout's root, beside the sidebar (regular; else `null`): for the
 * stacks' swipe areas at the screen's edge (see `SinkSwipeAreas`).
 */
export const LayoutRootContext = createContext<HTMLElement | null>(null);

/**
 * The sidebar shown, and showing or hiding it (regular; else `undefined`):
 * the app's state, the sidebar's column `open` (see Layout). Its toolbar's
 * button hides it; a page bar's (persistent, see `StackPage`) shows it
 * again.
 */
type SidebarOpen = readonly [boolean, (open: boolean) => void];
export const SidebarOpenContext = createContext<SidebarOpen | undefined>(
  undefined,
);

/**
 * A stack's swipe areas (in its `Navigation.Root`). Beside the sidebar
 * (regular, see `LayoutRootContext`): two (inline styles: the library's
 * layer wins over the kitchen sink's). One at the page's leading edge,
 * past the sidebar (the column it's in starts beneath it). One at the
 * screen's edge, over the sidebar (in the layout's root, above its
 * floating column: a thumb's swipe from the edge; the sidebar's rows start
 * further in), while the stack is shown (`isActive`: e.g. its tab's).
 * Otherwise (a phone): the one, as it is.
 */
export const SinkSwipeAreas: FunctionComponent<{ isActive?: boolean }> = ({
  isActive = true,
}) => {
  const layoutRoot = useContext(LayoutRootContext);

  return (
    <>
      <Navigation.SwipeArea
        style={
          layoutRoot
            ? { insetInlineStart: 'var(--uikit-layout-inset-start, 0px)' }
            : undefined
        }
      />
      {layoutRoot && isActive
        ? createPortal(
            <Navigation.SwipeArea style={{ zIndex: 4 }} />,
            layoutRoot,
          )
        : null}
    </>
  );
};

/**
 * The kitchen sink's settings: its provider's overrides (around the app,
 * see main.tsx; a key left out, the system's), set on its Settings page.
 */
export type SinkSettings = readonly [
  settings: Partial<SettingsValues>,
  setSettings: (next: Partial<SettingsValues>) => void,
];

export const SinkSettingsContext = createContext<SinkSettings>([
  {},
  () => undefined,
]);

/**
 * A section of things side by side (wrapping), on a stage (a background of
 * its own: shown, not placed in a list), titled; `stacked`, one below
 * another (e.g. bars).
 */
export const Showcase: FunctionComponent<{
  children: ReactNode;
  footer?: ReactNode;
  isStacked?: boolean;
  title?: string;
}> = ({ children, footer, isStacked = false, title }) => (
  <List.Section>
    {title === undefined ? null : (
      <List.Header>
        <List.Title>{title}</List.Title>
      </List.Header>
    )}
    <div
      className={`kitchen-sink-stage ${isStacked ? 'kitchen-sink-stacked' : 'kitchen-sink-showcase'}`}
    >
      {children}
    </div>
    {footer === undefined ? null : <List.Footer>{footer}</List.Footer>}
  </List.Section>
);

/** A section of rows, titled. */
export const Rows: FunctionComponent<{
  children: ReactNode;
  footer?: ReactNode;
  title?: string;
}> = ({ children, footer, title }) => (
  <List.Section>
    {title === undefined ? null : (
      <List.Header>
        <List.Title>{title}</List.Title>
      </List.Header>
    )}
    <List.Group>{children}</List.Group>
    {footer === undefined ? null : <List.Footer>{footer}</List.Footer>}
  </List.Section>
);

/** A row: a title, and what it trails with. */
export const Row: FunctionComponent<{
  children?: ReactNode;
  leading?: ReactNode;
  subtitle?: ReactNode;
  title: ReactNode;
}> = ({ children, leading, subtitle, title }) => (
  <List.Item>
    {leading === undefined ? null : <List.Leading>{leading}</List.Leading>}
    <List.Content>
      <List.Title>{title}</List.Title>
      {subtitle === undefined ? null : (
        <List.Subtitle>{subtitle}</List.Subtitle>
      )}
    </List.Content>
    {children === undefined ? null : <List.Trailing>{children}</List.Trailing>}
  </List.Item>
);

/** A row drilling into a page (by its key, see `usePush`). */
export const DrillRow: FunctionComponent<{
  pageKey: string;
  title: string;
}> = ({ pageKey, title }) => {
  const push = usePush();

  return (
    <List.Item>
      <List.Content>
        <List.Title
          render={<button type="button" />}
          onClick={() => push(pageKey)}
        >
          {title}
        </List.Title>
      </List.Content>
      <List.Trailing>
        <List.DrillIn />
      </List.Trailing>
    </List.Item>
  );
};

/**
 * A page bar's button showing the sidebar, while it's hidden (regular, see
 * `SidebarOpenContext`): persistent, staying put as its stack's pages
 * change (each page's top bar has it, nested stacks' too).
 */
export const ShowSidebarButton: FunctionComponent = () => {
  const sidebar = useContext(SidebarOpenContext);
  if (sidebar === undefined || sidebar[0]) return null;

  return (
    <Navigation.Persistent
      aria-label="Show Sidebar"
      persistentId="show-sidebar"
      render={<Toolbar.Button shape="circle" />}
      onClick={() => sidebar[1](true)}
    >
      <Button.Icon>
        <Symbol icon={sfInsetFilledLeadingthirdRectangle} />
      </Button.Icon>
    </Navigation.Persistent>
  );
};

/**
 * The leading buttons of a bare page's own top bar (see `isBare`): the
 * sidebar's (see `ShowSidebarButton`), its back button (compact only: its
 * stack's root otherwise, nothing to go back to; see main.tsx).
 */
export const BackButton: FunctionComponent = () => {
  const isCompact = useSizeClass() === 'compact';

  return (
    <>
      <ShowSidebarButton />
      {isCompact ? (
        <Navigation.Back
          aria-label="Back"
          render={<Toolbar.Button shape="circle" />}
        >
          <Button.Icon>
            <Symbol icon={sfChevronBackward} />
          </Button.Icon>
        </Navigation.Back>
      ) : null}
    </>
  );
};
