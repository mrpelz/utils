import type { ComponentProps } from 'react';

import type { GlassContextValue } from '../glass/main.js';

/** Why the page changes (Base UI's slider reasons). */
export type PageControlChangeEventDetails = {
  event: Event;
  reason: 'drag' | 'keyboard' | 'track-press';
};

export type PageControlProps = Omit<
  ComponentProps<'div'>,
  'defaultValue' | 'onChange'
> & {
  /**
   * Brightness of the content behind the glass (`adaptive`: by what's
   * behind it).
   * @default the toolbar's, or 'bright' (or 'dim' in dark mode)
   */
  context?: GlassContextValue;
  /** The pages. */
  count: number;
  /** The initially current page (uncontrolled; from 0). */
  defaultValue?: number;
  /** Disables changing the page. */
  disabled?: boolean;
  /**
   * The current page as text (its accessible value, and its tooltip's).
   * @default '3 of 8'
   */
  format?: (page: number, count: number) => string;
  /**
   * The current page (see `format`) in a tooltip above it while it's
   * hovered, pressed or focused by keyboard.
   */
  momentaryTooltip?: boolean;
  /**
   * Called with the page to go to (from 0), and why (Base UI's slider
   * reasons): a press beside the current dot, a drag, or a key.
   */
  onValueChange?: (
    page: number,
    eventDetails: PageControlChangeEventDetails,
  ) => void;
  /** The current page (controlled; from 0). */
  value?: number;
  /**
   * On glass (e.g. in a `Toolbar`), or plain (over content).
   * @default 'glass'
   */
  variant?: 'glass' | 'plain';
};
