import {
  ComponentProps,
  createContext,
  FunctionComponent,
  ReactNode,
  useContext,
} from 'react';

import {
  Button,
  List,
  Navigation,
  type SettingsValues,
  Symbol,
  Toolbar,
  type Viewport,
} from '../../components/index.js';
import { sfChevronBackward } from '../tooling/icons.js';

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
  isStacked?: boolean;
  title?: string;
}> = ({ children, isStacked = false, title }) => (
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

/** The back button of a bare page's own bar (see `isBare`). */
export const BackButton: FunctionComponent = () => (
  <Navigation.Back
    aria-label="Back"
    render={<Toolbar.Button shape="circle" />}
  >
    <Button.Icon>
      <Symbol icon={sfChevronBackward} />
    </Button.Icon>
  </Navigation.Back>
);
