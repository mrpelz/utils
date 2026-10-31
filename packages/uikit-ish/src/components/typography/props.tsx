import type { useRender } from '@base-ui/react/use-render';

/** A text style. */
export type TextStyle =
  | 'body'
  | 'callout'
  | 'caption1'
  | 'caption2'
  | 'footnote'
  | 'headline'
  | 'largeTitle'
  | 'subheadline'
  | 'title1'
  | 'title2'
  | 'title3';

/** A text size (the accessibility sizes too), `large` by default. */
export type TextSize =
  | 'ax1'
  | 'ax2'
  | 'ax3'
  | 'ax4'
  | 'ax5'
  | 'large'
  | 'medium'
  | 'small'
  | 'xLarge'
  | 'xSmall'
  | 'xxLarge'
  | 'xxxLarge';

/** Label colors of the text styles (the four label colors). */
export type TextColor = 'primary' | 'quaternary' | 'secondary' | 'tertiary';

export type TypographyProps = useRender.ComponentProps<'span'> & {
  /**
   * Label color.
   * @default inherited
   */
  color?: TextColor;
  /** The style's bold weight (emphasized). */
  emphasized?: boolean;
  italic?: boolean;
  /**
   * Text size of the text and its content.
   * @default inherited
   */
  textSize?: TextSize;
  /**
   * The text style.
   * @default 'body'
   */
  textStyle?: TextStyle;
};
