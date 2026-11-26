import './style.css';

import { useRender } from '@base-ui/react/use-render';
import { forwardRef } from 'react';

import { cn } from '../utils/main.js';
import type { StackProps } from './props.js';

export type { StackAxis, StackProps, StackSpacing } from './props.js';

// A stack (as SwiftUI's VStack and HStack): its children one below another
// or side by side, apart by a step of the library's spacing scale (tokens,
// see style.css); the space between siblings explicit, not each
// component's margins. Inset, with the content margin at its sides.

/** Its children in a column or a row, spaced. */
export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      align,
      axis = 'vertical',
      className,
      inset = false,
      justify,
      render,
      spacing = 'large',
      wrap = false,
      ...props
    },
    ref,
  ) =>
    useRender({
      defaultTagName: 'div',
      props: {
        ...props,
        className: cn('uikit-stack', className),
        'data-align': align,
        'data-axis': axis,
        'data-inset': inset ? '' : undefined,
        'data-justify': justify,
        'data-spacing': spacing,
        'data-wrap': wrap ? '' : undefined,
      },
      ref,
      render,
    }),
);
