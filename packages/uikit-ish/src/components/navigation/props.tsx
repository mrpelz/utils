import type { useRender } from '@base-ui/react/use-render';
import type { ComponentProps, ReactElement } from 'react';

export type Role = 'current' | 'hidden' | 'top' | 'under';

export type Transition = {
  /** A popped page, shown while it leaves. */
  leaving?: ReactElement;
  top: string;
  under: string;
};

/** Why the top page goes back: swiped, or a `Back` pressed. */
export type NavigationBackEventDetails = {
  event: Event;
  reason: 'back-press' | 'swipe';
};

export type NavigationRootProps = ComponentProps<'div'> & {
  /**
   * Called when the top page goes back (swiped back, its transition done;
   * or a `Navigation.Back` pressed): the app pops its stack. Without it,
   * pages can't be swiped back.
   */
  onBack?: (eventDetails: NavigationBackEventDetails) => void;
};

export type NavigationBackProps = useRender.ComponentProps<'button'>;
