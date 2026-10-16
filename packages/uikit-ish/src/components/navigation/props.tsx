import type { ComponentProps, ReactElement } from 'react';

export type Role = 'current' | 'hidden' | 'top' | 'under';

export type Transition = {
  /** A popped page, shown while it leaves. */
  leaving?: ReactElement;
  top: string;
  under: string;
};

export type NavigationRootProps = ComponentProps<'div'> & {
  /**
   * Called when the top page is swiped back (popped): the app pops its
   * stack. Without it, pages can't be swiped back.
   */
  onBack?: () => void;
};
