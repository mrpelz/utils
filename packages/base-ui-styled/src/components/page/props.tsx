import type { ComponentProps } from 'react';

export type PageRootProps = ComponentProps<'div'> & {
  /**
   * The page background (default: `grouped`, for grouped lists; `plain`:
   * for plain lists, and other content).
   */
  background?: 'grouped' | 'plain';
};
