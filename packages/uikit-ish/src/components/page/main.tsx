import './style.css';

import { forwardRef } from 'react';

import { useGlassMode } from '../glass/main.js';
import { cn, useForwardedRef } from '../utils/main.js';
import { EdgeEffects, useScrollerRegistration } from '../viewport/main.js';
import type { PageRootProps } from './props.js';

export type { PageRootProps } from './props.js';

// A page (after Framework7's `.page` and `.page-content`): what a screen shows, filling its container (a
// `Layout.Column`, a `Navigation.Stack`'s page, the viewport's content),
// scrolling its content on its own (e.g. a `Header` at its start, then
// lists), on the page background (`grouped`: `systemGroupedBackground`, as
// lists of style `insetGrouped` and `grouped` sit on; `plain`:
// `systemBackground`). A scroller (registered: its provider tracks it as it
// fills the screen), drawing its bars' edge effects (see `Viewport`). In a
// column clear of a floating one (see `Layout`), its
// content is inset by that column's size, its background running beneath
// it. Filling (`fill`: e.g. a map under its bars), not a scroller: its
// content filling it, under the bars and the safe area insets, on the page
// background (Framework7's `.page` without its `.page-content`).

/**
 * A page: its content's scroll container (or, `fill`, filled by it), on the
 * page background.
 */
const Root = forwardRef<HTMLDivElement, PageRootProps>(
  (
    {
      alwaysBounce = true,
      children,
      className,
      background = 'grouped',
      fill = false,
      glass = 'auto',
      ...props
    },
    forwardedRef,
  ) => {
    const ref = useForwardedRef(forwardedRef);
    useScrollerRegistration(ref, !fill);
    // (Filled, not a scroller: live, unless told.)
    const glassMode = useGlassMode(
      ref,
      fill && glass === 'auto' ? 'live' : glass,
      alwaysBounce,
    );

    return (
      <div
        ref={ref}
        data-always-bounce={alwaysBounce && !fill ? '' : undefined}
        data-background={background}
        data-fill={fill ? '' : undefined}
        data-glass={glassMode}
        data-page-part="root"
        // (Its text fields kept in view above the keyboard, see Viewport.)
        data-viewport-focus-scroll={fill ? undefined : 'target'}
        {...props}
        className={cn('uikit-page-root', className)}
        data-viewport-scroller={fill ? undefined : ''}
      >
        {children}
        {fill ? null : <EdgeEffects scroller={ref} />}
      </div>
    );
  },
);

export const Page = {
  Root,
};
