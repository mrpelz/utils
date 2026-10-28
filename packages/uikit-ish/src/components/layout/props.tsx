import type { ComponentProps } from 'react';

export type LayoutColumnProps = ComponentProps<'div'> & {
  /**
   * Next to a floating column (see `floating`): its pages' content inset by
   * the floating column's size (`--uikit-layout-inset-start`), their
   * backgrounds running underneath it.
   */
  clearFloating?: boolean;
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
  /** Called while it's resized (by its divider). */
  onSizeChange?: (size: number) => void;
  /** Resized by dragging its divider (at its end), or by keys on it. */
  resizable?: boolean;
  /** Its size (px, controlled). */
  size?: number;
};

export type LayoutRootProps = ComponentProps<'div'>;
