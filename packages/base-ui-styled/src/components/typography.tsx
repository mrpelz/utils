import { Properties } from 'csstype';
import { styled } from 'goober';
import { forwardRef } from 'react';

import { css, fontWeight } from './utils.js';

// Source: Apple iOS 26 Figma (“Typography”: “Text styles” in the label
// colors, “Dynamic Type”, “Dynamic Type – Accessibility Sizes”); HIG
// (Typography). The text styles' tokens (`--font-ios-*`) are declared in
// `styles.tsx` for the default size (Large), from the table below.
//
// Deviations:
// - Caption 1's emphasized italic is 510 (Figma: 508), as its emphasized.
// - Accessibility sizes have no tracking (Figma: none given).
// - Figma's values are kept where they look off: Title 2 at AX2 (43/51, as
//   Title 1) and Title 3 at AX4 (43/51, as at AX3), Title 2 at Medium
//   (21/28).

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

const tokenNames: Record<TextStyle, string> = {
  body: 'body',
  callout: 'callout',
  caption1: 'caption1',
  caption2: 'caption2',
  footnote: 'footnote',
  headline: 'headline',
  largeTitle: 'large-title',
  subheadline: 'subheadline',
  title1: 'title1',
  title2: 'title2',
  title3: 'title3',
};

/** Font size, line height and tracking (px). */
type Metrics = [size: number, lineHeight: number, tracking: number];

// Figma “Dynamic Type” and “Dynamic Type – Accessibility Sizes”.
const dynamicTypeSizes: Record<DynamicTypeSize, Record<TextStyle, Metrics>> = {
  xSmall: {
    largeTitle: [31, 38, 0.37],
    title1: [25, 31, 0.15],
    title2: [19, 23, -0.45],
    title3: [17, 22, -0.43],
    headline: [14, 19, -0.15],
    body: [14, 19, -0.15],
    callout: [13, 18, -0.08],
    subheadline: [12, 16, 0],
    footnote: [12, 16, 0],
    caption1: [11, 13, 0.06],
    caption2: [11, 13, 0.06],
  },
  small: {
    largeTitle: [32, 39, 0.41],
    title1: [26, 32, 0.22],
    title2: [20, 24, -0.45],
    title3: [18, 23, -0.44],
    headline: [15, 20, -0.23],
    body: [15, 20, -0.23],
    callout: [14, 19, -0.15],
    subheadline: [13, 18, -0.08],
    footnote: [12, 16, 0],
    caption1: [11, 13, 0.06],
    caption2: [11, 13, 0.06],
  },
  medium: {
    largeTitle: [33, 40, 0.4],
    title1: [27, 33, 0.29],
    title2: [21, 28, -0.36],
    title3: [19, 24, -0.45],
    headline: [16, 21, -0.31],
    body: [16, 21, -0.31],
    callout: [15, 20, -0.23],
    subheadline: [14, 19, -0.15],
    footnote: [12, 16, 0],
    caption1: [11, 13, 0.06],
    caption2: [11, 13, 0.06],
  },
  large: {
    largeTitle: [34, 41, 0.4],
    title1: [28, 34, 0.38],
    title2: [22, 28, -0.26],
    title3: [20, 25, -0.45],
    headline: [17, 22, -0.43],
    body: [17, 22, -0.43],
    callout: [16, 21, -0.31],
    subheadline: [15, 20, -0.23],
    footnote: [13, 18, -0.08],
    caption1: [12, 16, 0],
    caption2: [11, 13, 0.06],
  },
  xLarge: {
    largeTitle: [36, 43, 0.37],
    title1: [30, 36, 0.4],
    title2: [24, 30, 0.07],
    title3: [22, 28, 0],
    headline: [19, 24, -0.45],
    body: [19, 24, -0.45],
    callout: [18, 23, -0.44],
    subheadline: [17, 22, -0.43],
    footnote: [15, 20, -0.23],
    caption1: [14, 19, -0.15],
    caption2: [13, 18, -0.08],
  },
  xxLarge: {
    largeTitle: [38, 46, 0.37],
    title1: [32, 39, 0.41],
    title2: [26, 32, 0.22],
    title3: [24, 30, 0.07],
    headline: [21, 26, -0.36],
    body: [21, 26, -0.36],
    callout: [20, 24, -0.45],
    subheadline: [19, 24, -0.45],
    footnote: [17, 22, -0.43],
    caption1: [16, 21, -0.31],
    caption2: [15, 20, -0.23],
  },
  xxxLarge: {
    largeTitle: [40, 48, 0.37],
    title1: [34, 41, 0.4],
    title2: [28, 34, 0.38],
    title3: [26, 32, 0.22],
    headline: [23, 29, -0.1],
    body: [23, 29, -0.1],
    callout: [22, 28, -0.26],
    subheadline: [21, 28, -0.36],
    footnote: [19, 24, -0.45],
    caption1: [18, 23, -0.44],
    caption2: [17, 22, -0.43],
  },
  ax1: {
    largeTitle: [44, 52, 0],
    title1: [38, 46, 0],
    title2: [34, 41, 0],
    title3: [31, 38, 0],
    headline: [28, 34, 0],
    body: [28, 34, 0],
    callout: [26, 32, 0],
    subheadline: [25, 31, 0],
    footnote: [23, 29, 0],
    caption1: [22, 28, 0],
    caption2: [20, 25, 0],
  },
  ax2: {
    largeTitle: [48, 57, 0],
    title1: [43, 51, 0],
    title2: [43, 51, 0],
    title3: [37, 44, 0],
    headline: [33, 40, 0],
    body: [33, 40, 0],
    callout: [32, 39, 0],
    subheadline: [30, 37, 0],
    footnote: [27, 33, 0],
    caption1: [26, 32, 0],
    caption2: [24, 30, 0],
  },
  ax3: {
    largeTitle: [52, 61, 0],
    title1: [48, 57, 0],
    title2: [44, 52, 0],
    title3: [43, 51, 0],
    headline: [40, 48, 0],
    body: [40, 48, 0],
    callout: [38, 46, 0],
    subheadline: [36, 43, 0],
    footnote: [33, 40, 0],
    caption1: [32, 39, 0],
    caption2: [29, 35, 0],
  },
  ax4: {
    largeTitle: [56, 66, 0],
    title1: [53, 62, 0],
    title2: [50, 59, 0],
    title3: [43, 51, 0],
    headline: [47, 56, 0],
    body: [47, 56, 0],
    callout: [44, 52, 0],
    subheadline: [42, 50, 0],
    footnote: [38, 46, 0],
    caption1: [37, 44, 0],
    caption2: [34, 41, 0],
  },
  ax5: {
    largeTitle: [60, 70, 0],
    title1: [58, 68, 0],
    title2: [56, 66, 0],
    title3: [55, 65, 0],
    headline: [53, 62, 0],
    body: [53, 62, 0],
    callout: [51, 60, 0],
    subheadline: [49, 58, 0],
    footnote: [44, 52, 0],
    caption1: [43, 51, 0],
    caption2: [40, 48, 0],
  },
};

/**
 * Declares the text styles' size, line height and tracking tokens
 * (`--font-ios-<style>-size`, `-line-height`, `-tracking`) for a Dynamic
 * Type size, e.g. for a subtree (the default, `large`, is in `styles.tsx`).
 */
export const dynamicTypeSize = (size: DynamicTypeSize): string =>
  Object.entries(dynamicTypeSizes[size])
    .map(([style, [fontSize, lineHeight, tracking]]) => {
      const name = tokenNames[style as TextStyle];

      return [
        `--font-ios-${name}-size: ${fontSize}px;`,
        `--font-ios-${name}-line-height: ${lineHeight}px;`,
        `--font-ios-${name}-tracking: ${tracking}px;`,
      ].join('\n');
    })
    .join('\n');

/**
 * Declarations for a text style (Figma “Typography”: size, line height,
 * tracking, weight), from the `--font-ios-*` tokens.
 *
 * @param style the text style
 * @param options `emphasized` (Figma “Emphasized”: the style's bold
 *   weight), `italic`
 */
export const textStyle = (
  style: TextStyle,
  { emphasized = false, italic = false } = {},
): string => {
  const name = tokenNames[style];

  return css`
    font-size: var(--font-ios-${name}-size);
    ${fontWeight(
      `var(--font-ios-${name}-weight${emphasized ? '-emphasized' : ''})`,
    )}
    font-style: ${italic ? 'italic' : 'normal'};
    letter-spacing: var(--font-ios-${name}-tracking);
    line-height: var(--font-ios-${name}-line-height);
  `;
};

/** Label colors of the text styles (Figma: the four label colors). */
export type TextColor = 'primary' | 'quaternary' | 'secondary' | 'tertiary';

const textColors: Record<TextColor, string> = {
  primary: 'var(--color-ios-label)',
  quaternary: 'var(--color-ios-quaternary-label)',
  secondary: 'var(--color-ios-secondary-label)',
  tertiary: 'var(--color-ios-tertiary-label)',
};

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

const StyledTypography = styled('span', forwardRef)<TypographyProps>`
  ${({ dynamicTypeSize: size }) => (size ? dynamicTypeSize(size) : '')}
  ${({ emphasized, italic, textStyle: style = 'body' }) =>
    textStyle(style, { emphasized, italic })}
  ${({ color }) => (color ? `color: ${textColors[color]};` : '')}

  margin: 0;
`;

/** Text in one of the text styles (UIKit `UIFont.TextStyle`). */
export const Typography = StyledTypography;
