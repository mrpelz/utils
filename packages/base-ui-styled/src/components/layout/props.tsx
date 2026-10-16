import type { ComponentProps } from 'react';

export type LayoutColumnProps = ComponentProps<'div'> & {
  /**
   * Next to a floating column (see `floating`): its pages' content inset by
   * the floating column's size (`--styled-layout-inset-start`), their
   * backgrounds running underneath it.
   */
  clearFloating?: boolean;
  /** As a drawer: initially open (uncontrolled). */
  defaultOpen?: boolean;
  /** Its initial size (px, uncontrolled); without a size, it's flexible. */
  defaultSize?: number;
  /**
   * In a compact layout: floating over the others from this side, hidden
   * until opened (swiped in from that edge, or `open`).
   */
  drawer?: 'inline-end' | 'inline-start';
  /**
   * Floating over the others at the layout's start (e.g. a `Sidebar`), which
   * span the layout underneath it (see `clearFloating`); compact, as a
   * drawer without a background or shadow of its own.
   */
  floating?: boolean;
  /** Its largest size (px) when resized (default: none). */
  maxSize?: number;
  /** Its smallest size (px; default: 240, as a list's). */
  minSize?: number;
  /** As a drawer: called as it opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Called while it's resized (by its divider). */
  onSizeChange?: (size: number) => void;
  /** As a drawer: open (controlled). */
  open?: boolean;
  /** Resized by dragging its divider (at its end), or by keys on it. */
  resizable?: boolean;
  /** Its size (px, controlled). */
  size?: number;
};

export type LayoutRootProps = ComponentProps<'div'> & {
  /**
   * Compact (e.g. on an iPhone, by its width): `drawer` columns float over
   * the others, hidden until opened.
   */
  compact?: boolean;
};
