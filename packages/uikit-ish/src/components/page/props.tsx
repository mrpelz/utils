import type { ComponentProps } from 'react';

export type PageRootProps = ComponentProps<'div'> & {
  /**
   * Bouncing even when its content fits (UIKit's `alwaysBounceVertical`):
   * at least 1px to scroll, so a drag on it is its own (rubber-banding
   * here, the bars staying), not the document's (on iOS, moving the whole
   * app). Off: only content taller than it scrolls.
   * @default true
   */
  alwaysBounce?: boolean;
  /**
   * The page background: `grouped` for grouped lists; `plain` for plain lists,
   * and other content.
   * @default 'grouped'
   */
  background?: 'grouped' | 'plain';
};
