import type { ComponentProps } from 'react';

/**
 * An icon's outlines: filled paths in a view box, e.g. an SF Symbol from
 * `@bradleyhodges/sfsymbols` (`sfBell`; its icons have this shape, no
 * dependency needed; mind Apple's terms for SF Symbols).
 */
export type SymbolIcon = {
  /** Its name (e.g. `bell`), as its `data-symbol`. */
  sourceName?: string;
  /** Its outlines (filled). */
  svgPathData: readonly { d: string }[];
  /**
   * Its view box's units in an em (its size at the font size).
   * @default 20 (SF Symbols' outlines: SF Pro glyphs at 20pt)
   */
  unitsPerEm?: number;
  /** Its view box (`minX minY width height`): its ink's, as SF Symbols'. */
  viewBox: string;
};

export type SymbolProps = ComponentProps<'span'> & {
  /**
   * Its place in a line of text: its ink's center on the text's (its cap
   * height's middle, as SF Symbols set with SF Pro), or its ink's bottom on
   * the baseline. In a flex or grid container (e.g. a button's), none: the
   * container places it.
   * @default 'optical'
   */
  baselineShift?: 'none' | 'optical';
  /** The icon (see `SymbolIcon`), e.g. `sfBell`. */
  icon: SymbolIcon;
};
