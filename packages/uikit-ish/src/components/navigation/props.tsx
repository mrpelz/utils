import type { useRender } from '@base-ui/react/use-render';
import type { ComponentProps, ReactElement } from 'react';

export type Role = 'current' | 'hidden' | 'top' | 'under';

/**
 * A page still leaving on its own (popped further while it left, see
 * `Stack`): its key, the page, and its progress as it was handed over.
 */
export type Departing = {
  key: string;
  page: ReactElement;
  progress: number;
};

export type Transition = {
  /** Pages still leaving on their own, the earliest first (above). */
  departing?: Departing[];
  /**
   * Where the upper page starts from (px, signed; e.g. revealed partly, as
   * it starts leaving too), at progress 0; otherwise where it's shown.
   */
  from?: number;
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
   * Called when the top page goes back (swiped back, as it's let go: its
   * pop on from where the swipe left it; or a `Navigation.Back` pressed):
   * the app pops its stack. Not popped, it settles back. Without it (or a
   * `SwipeArea`), pages can't be swiped back.
   */
  onBack?: (eventDetails: NavigationBackEventDetails) => void;
};

/** Its children: the app's stack of pages, bottom to top, each keyed. */
export type NavigationStackProps = ComponentProps<'div'>;

export type NavigationSwipeAreaProps = ComponentProps<'div'> & {
  /**
   * Its width (px): how far from the leading edge a swipe back starts.
   * @default 20
   */
  width?: number;
};

export type NavigationBackProps = useRender.ComponentProps<'button'> & {
  /**
   * Its id as a persistent item (see `Navigation.Persistent`): staying put
   * while its page and the other one moving both have it (e.g. pushed from
   * a page with a back button); `false`, always moving with its page.
   * @default 'back'
   */
  persistentId?: false | string;
};

export type NavigationPersistentProps = useRender.ComponentProps<'div'> & {
  /**
   * Its id: in a transition (pushed, popped, swiped back), while both
   * pages moving have an item of this id, it stays put (the upper page's
   * shown); otherwise, it moves with its page.
   */
  persistentId: string;
};
