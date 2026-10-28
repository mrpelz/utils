import './style.css';

import { useRender } from '@base-ui/react/use-render';
import { forwardRef } from 'react';

import { cn } from '../utils/main.js';
import type { TypographyProps } from './props.js';

export type {
  DynamicTypeSize,
  TextColor,
  TextStyle,
  TypographyProps,
} from './props.js';

// Source: Apple iOS 26 Figma (“Typography”: “Text styles” in the label
// colors, “Dynamic Type”, “Dynamic Type – Accessibility Sizes”); HIG
// (Typography). The text styles' tokens (`--font-ios-*`) are declared in
// `styles.css` for the default size (Large), and per size in style.css.
//
// Deviations:
// - Caption 1's emphasized italic is 510 (Figma: 508), as its emphasized.
// - Accessibility sizes have no tracking (Figma: none given).
// - Figma's values are kept where they look off: Title 2 at AX2 (43/51, as
//   Title 1) and Title 3 at AX4 (43/51, as at AX3), Title 2 at Medium
//   (21/28).

/** Text in one of the text styles (UIKit `UIFont.TextStyle`). */
export const Typography = forwardRef<HTMLElement, TypographyProps>(
  (
    {
      className,
      color,
      dynamicTypeSize: size,
      emphasized,
      italic,
      render,
      textStyle,
      ...props
    },
    ref,
  ) =>
    useRender({
      defaultTagName: 'span',
      props: {
        ...props,
        className: cn('uikit-typography', className),
        'data-color': color,
        'data-dynamic-type-size': size,
        'data-emphasized': emphasized ? '' : undefined,
        'data-italic': italic ? '' : undefined,
        'data-text-style': textStyle,
      },
      ref,
      render,
    }),
);
