import './style.css';

import { forwardRef } from 'react';

import { cn, useForwardedRef } from '../utils/main.js';
import { EdgeEffects, useScrollerRegistration } from '../viewport/main.js';
import type { PageRootProps } from './props.js';

export type { PageRootProps } from './props.js';

// A page (after Framework7's `.page` and `.page-content`; UIKit: a view
// controller's root view): what a screen shows, filling its container (a
// `Layout.Column`, a `Navigation.Stack`'s page, the viewport's content),
// scrolling its content on its own (e.g. a `Header` at its start, then
// lists), on the page background (`grouped`: `systemGroupedBackground`, as
// lists of style `insetGrouped` and `grouped` sit on; `plain`:
// `systemBackground`). A scroller (registered: its provider tracks it as it
// fills the screen), drawing its bars' edge effects (see `Viewport`). In a
// column clear of a floating one (see `Layout`), its
// content is inset by that column's size, its background running beneath
// it.

/** A page: its content's scroll container, on the page background. */
const Root = forwardRef<HTMLDivElement, PageRootProps>(
  (
    {
      alwaysBounce = true,
      children,
      className,
      background = 'grouped',
      ...props
    },
    forwardedRef,
  ) => {
    const ref = useForwardedRef(forwardedRef);
    useScrollerRegistration(ref);

    return (
      <div
        ref={ref}
        data-always-bounce={alwaysBounce ? '' : undefined}
        data-background={background}
        data-page-part="root"
        {...props}
        className={cn('uikit-page-root', className)}
        data-viewport-scroller=""
      >
        {children}
        <EdgeEffects scroller={ref} />
      </div>
    );
  },
);

export const Page = {
  Root,
};
