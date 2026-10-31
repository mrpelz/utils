import './style.css';

import { useRender } from '@base-ui/react/use-render';
import { forwardRef } from 'react';

import { cn } from '../utils/main.js';
import type { TypographyProps } from './props.js';

export type {
  TextSize,
  TextColor,
  TextStyle,
  TypographyProps,
} from './props.js';

// Text styles in the label colors, at each text size (the accessibility
// sizes too). The text styles' tokens (`--font-ui-*`) are declared in
// `styles.css` for the default size (Large), and per size in style.css.
//
// Also:
// - Caption 1's emphasized italic is 510, as its emphasized.
// - Accessibility sizes have no tracking.
// - Title 2 at AX2 is 43/51 (as Title 1), Title 3 at AX4 43/51 (as at AX3),
//   Title 2 at Medium 21/28.

/** Text in one of the text styles. */
export const Typography = forwardRef<HTMLElement, TypographyProps>(
  (
    {
      className,
      color,
      textSize: size,
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
        'data-text-size': size,
        'data-emphasized': emphasized ? '' : undefined,
        'data-italic': italic ? '' : undefined,
        'data-text-style': textStyle,
      },
      ref,
      render,
    }),
);
