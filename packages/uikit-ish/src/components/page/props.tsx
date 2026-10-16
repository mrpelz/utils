import type { ComponentProps } from 'react';

export type PageRootProps = ComponentProps<'div'> & {
  /**
   * The page background: `grouped` for grouped lists; `plain` for plain lists,
   * and other content.
   * @default 'grouped'
   */
  background?: 'grouped' | 'plain';
};
