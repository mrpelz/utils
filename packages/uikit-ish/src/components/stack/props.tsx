import type { useRender } from '@base-ui/react/use-render';

/** A stack's direction: a column (`vertical`) or a row (`horizontal`). */
export type StackAxis = 'horizontal' | 'vertical';

/**
 * The space between a stack's children, a step of the library's spacing
 * scale (tokens: `--uikit-spacing-small` 8px, `-medium` 12px, `-large`
 * 16px, `-x-large` 32px).
 */
export type StackSpacing = 'large' | 'medium' | 'small' | 'xLarge';

export type StackProps = useRender.ComponentProps<'div'> & {
  /**
   * Its children across its axis: at its start, center or end, stretched,
   * or (a row) on their text's baseline.
   * @default 'stretch'
   */
  align?: 'baseline' | 'center' | 'end' | 'start' | 'stretch';
  /**
   * Its direction: its children one below another, or side by side.
   * @default 'vertical'
   */
  axis?: StackAxis;
  /**
   * The content margin at its sides (`--uikit-content-margin-inline`,
   * 16px; as a list's groups' inset): e.g. a page's content that isn't a
   * list.
   */
  inset?: boolean;
  /**
   * Its children along its axis: at its start, center or end, or spread
   * (the space between them).
   * @default 'start'
   */
  justify?: 'center' | 'end' | 'spaceBetween' | 'start';
  /**
   * The space between its children.
   * @default 'large'
   */
  spacing?: StackSpacing;
  /** Its children on more lines (a row's) as they don't fit. */
  wrap?: boolean;
};
