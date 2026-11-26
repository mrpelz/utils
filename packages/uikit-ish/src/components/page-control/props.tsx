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
   * How bright the content behind the glass is (`adaptive`: by what's
   * behind it, see `useBackdropTone`).
   * @default the toolbar's, or the color scheme's
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
  /**
   * Its direction: its dots in a row, or in a column (e.g. beside a
   * vertical `Pager`), the first at the top.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /** The current page (controlled; from 0). */
  value?: number;
  /**
   * On glass (e.g. in a `Toolbar`), or plain (over content).
   * @default 'glass'
   */
  variant?: 'glass' | 'plain';
};
