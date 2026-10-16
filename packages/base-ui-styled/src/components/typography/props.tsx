import type { Properties } from 'csstype';

/** UIKit `UIFont.TextStyle`. */
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

/** UIKit `UIContentSizeCategory` (Dynamic Type), `large` by default. */
export type DynamicTypeSize =
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

/** Label colors of the text styles (Figma: the four label colors). */
export type TextColor = 'primary' | 'quaternary' | 'secondary' | 'tertiary';

export type TypographyProps = React.ComponentProps<'span'> & {
  /** The element to render (default: `span`). */
  as?: keyof React.JSX.IntrinsicElements;
  /** Label color (default: inherited). */
  color?: TextColor;
  /** Dynamic Type size of the text and its content (default: inherited). */
  dynamicTypeSize?: DynamicTypeSize;
  /** The style's bold weight (Figma “Emphasized”). */
  emphasized?: boolean;
  italic?: boolean;
  /** The text style (default: `body`). */
  textStyle?: TextStyle;
  textWrap?: Properties['textWrap'];
};
