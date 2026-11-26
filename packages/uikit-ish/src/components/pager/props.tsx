import type { useRender } from '@base-ui/react/use-render';

/** A pager's direction: pages side by side, or one below another. */
export type PagerOrientation = 'horizontal' | 'vertical';

/** Why its page changed: scrolled (a finger, a trackpad, the mouse), or a key. */
export type PagerChangeEventDetails = {
  event: Event;
  reason: 'keyboard' | 'swipe';
};

export type PagerRootProps = Omit<
  useRender.ComponentProps<'div'>,
  'defaultValue' | 'onChange'
> & {
  /** The initially current page (uncontrolled; from 0). */
  defaultValue?: number;
  /**
   * Called with the page mostly in view (from 0) as it's scrolled, and why;
   * not while it's scrolled to a `value` set by the app.
   */
  onValueChange?: (page: number, eventDetails: PagerChangeEventDetails) => void;
  /**
   * Its direction: pages side by side (swiped sideways), or one below
   * another (swiped up and down; it needs a height, e.g. its container's).
   * @default 'horizontal'
   */
  orientation?: PagerOrientation;
  /**
   * The current page (controlled; from 0). Set by the app (e.g. a page
   * control's), it's scrolled to (at once, motion reduced).
   */
  value?: number;
};

export type PagerPageProps = useRender.ComponentProps<'div'> & {
  /**
   * Its accessible name.
   * @default its place, e.g. '2 of 5'
   */
  'aria-label'?: string;
};
