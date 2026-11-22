import type { ComponentProps, PointerEvent } from 'react';

/** Why a column opened or closed (see `onOpenChange`). */
export type LayoutColumnOpenChangeDetails = {
  /** What it was: its divider dragged (see `closeOnDrag`). */
  event: PointerEvent<HTMLDivElement>;
  reason: 'divider-drag';
};

export type LayoutColumnProps = ComponentProps<'div'> & {
  /**
   * Next to a floating column (see `floating`): its pages' content (and a
   * `Viewport.Content`'s, its bars') inset by the floating column's size
   * (`--uikit-layout-inset-start`), their backgrounds running underneath
   * it.
   */
  clearFloating?: boolean;
  /**
   * Resizable, closed by dragging its divider past half its `minSize` (held
   * at its `minSize` until then); dragged back within the same drag, open
   * again. Closed, it keeps the size it had as the drag started. Opened
   * again by the app (see `open`).
   * @default false
   */
  closeOnDrag?: boolean;
  /**
   * Initially open (uncontrolled, see `open`).
   * @default true
   */
  defaultOpen?: boolean;
  /** Its initial size (px, uncontrolled); without a size, it's flexible. */
  defaultSize?: number;
  /**
   * Floating over the others at the layout's start (e.g. a `Sidebar`), which
   * span the layout underneath it (see `clearFloating`).
   */
  floating?: boolean;
  /**
   * Its largest size (px) when resized.
   * @default none
   */
  maxSize?: number;
  /**
   * Its smallest size (px).
   * @default 240 (a list's)
   */
  minSize?: number;
  /**
   * Called as it's opened or closed by its divider (see `closeOnDrag`):
   * controlled (see `open`), the app's to follow.
   */
  onOpenChange?: (
    open: boolean,
    details: LayoutColumnOpenChangeDetails,
  ) => void;
  /** Called while it's resized (by its divider). */
  onSizeChange?: (size: number) => void;
  /**
   * Open (controlled): closed, it slides out of the layout (a floating
   * one off its edge, the others at their size, the columns beside them
   * taking their place), keeping its size for when it opens again; inert,
   * hidden once out. The columns beside it follow (a `clearFloating`
   * one's inset with it). The app's state, its buttons its own (no
   * handle: see the guide).
   * @default true
   */
  open?: boolean;
  /** Resized by dragging its divider (at its end), or by keys on it. */
  resizable?: boolean;
  /** Its size (px, controlled). */
  size?: number;
};

export type LayoutRootProps = ComponentProps<'div'> & {
  /**
   * Whether a hairline shows between its columns (off, e.g., on a picture
   * behind them, where a line would look out of place).
   * @default true
   */
  separators?: boolean;
};
