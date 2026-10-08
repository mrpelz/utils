import { styled } from 'goober';
import {
  forwardRef,
  KeyboardEvent,
  MouseEvent,
  useContext,
  useState,
} from 'react';

import {
  GlassBackground,
  GlassContext,
  glassContext,
  InheritedGlassContext,
} from './glass.js';

// Source: Apple iOS 26 Figma (“Toolbars”: “_Page control”, Dots 1 to 8+,
// BG Context Dim/Bright): a glass capsule, 48px high, 24px from its ends,
// of 8px dots 8px apart; the current page's in the glass' vibrant content
// color, the others in its disabled content color. Of more than 7 pages, 8
// dots show at a time: the dots before and after them (if any) are hinted
// at by the outermost two shrinking (6px and 4px, in 8px and 6px slots).
// Behavior after UIKit's `UIPageControl`: a press on either side of the
// current dot goes to the previous or next page; an adjustable control
// (arrow keys, Home and End).
//
// Deviations:
// - The window of 8 dots moves when the current page would reach a
//   shrunken dot (Figma: the window's states only), the dots resizing
//   (200ms).

/** Pages shown as full dots at most (more: a window of `windowSize`). */
const fullDots = 7;
const windowSize = 8;

export type PageControlProps = Omit<
  React.ComponentProps<'div'>,
  'defaultValue' | 'onChange'
> & {
  /**
   * Brightness of the content behind the glass.
   * @default the toolbar's, or 'bright' (or 'dim' in dark mode)
   */
  context?: GlassContext;
  /** The pages. */
  count: number;
  /** The initially current page (uncontrolled; from 0). */
  defaultValue?: number;
  /** Disables changing the page. */
  disabled?: boolean;
  /** Called with the page to go to (from 0). */
  onValueChange?: (page: number) => void;
  /** The current page (controlled; from 0). */
  value?: number;
};

const StyledRoot = styled<'div', { context?: GlassContext }>('div', forwardRef)`
  ${({ context }) => glassContext(context)}
  --styled-glass-outset: 0px;

  position: relative;
  display: inline-flex;
  min-height: 48px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  border-radius: 100px;
  gap: 8px;
  outline-offset: 2px;
  touch-action: manipulation;
  user-select: none;
  vertical-align: middle;

  &[aria-disabled='true'] {
    pointer-events: none;
  }
`;

// A dot's slot (8px, or 6px for the outermost shrunken one) and its dot,
// above the glass, blended with it as the glass' content.
const Slot = styled('span')`
  position: relative;
  display: flex;
  width: 8px;
  height: 8px;
  align-items: center;
  justify-content: center;
  transition: width 200ms;

  &[data-size='4'] {
    width: 6px;
  }

  & > span {
    width: 8px;
    height: 8px;
    border-radius: 50px;
    background-color: var(--styled-glass-content-disabled);
    mix-blend-mode: var(--styled-glass-content-blend);
    transition-duration: 200ms;
    transition-property: width, height, background-color;
  }

  &[data-size='6'] > span {
    width: 6px;
    height: 6px;
  }

  &[data-size='4'] > span {
    width: 4px;
    height: 4px;
  }

  &[data-current] > span {
    background-color: var(--styled-glass-content);
  }
`;

/**
 * The first page of the window of dots shown (see above), moved from
 * `start` only as far as needed to show `page` as a full dot.
 */
const windowStart = (start: number, page: number, count: number) => {
  if (count <= fullDots) return 0;
  const last = count - windowSize;
  const clamped = Math.min(Math.max(start, 0), last);
  // The first and last full dots of the window.
  const first = clamped > 0 ? clamped + 2 : 0;
  const end =
    clamped < last ? clamped + windowSize - 3 : clamped + windowSize - 1;

  if (page < first) return Math.max(page - 2, 0);
  if (page > end) return Math.min(page - windowSize + 3, last);
  return clamped;
};

/** A dot's size at its place in the window (8, or shrunken: 6 or 4). */
const dotSize = (index: number, start: number, count: number) => {
  if (count <= fullDots) return 8;
  const place = index - start;
  const before = start > 0;
  const after = start + windowSize < count;
  if (before && place === 0) return 4;
  if (before && place === 1) return 6;
  if (after && place === windowSize - 1) return 4;
  if (after && place === windowSize - 2) return 6;
  return 8;
};

/**
 * A page control (UIKit `UIPageControl`): dots of pages, the current one
 * highlighted, on glass (e.g. in a `Toolbar`).
 */
export const PageControl = forwardRef<HTMLDivElement, PageControlProps>(
  (
    {
      'aria-label': ariaLabel = 'Page',
      context,
      count,
      defaultValue = 0,
      disabled = false,
      onClick,
      onKeyDown,
      onValueChange,
      value: valueProp,
      ...props
    },
    ref,
  ) => {
    const inherited = useContext(InheritedGlassContext);
    const [state, setState] = useState(defaultValue);
    const pages = Math.max(0, Math.floor(count));
    const value = Math.min(Math.max(valueProp ?? state, 0), pages - 1);
    // The window's start, kept between renders (it only moves as needed).
    const [start, setStart] = useState(0);
    const nextStart = windowStart(start, value, pages);
    if (nextStart !== start) setStart(nextStart);

    const go = (page: number) => {
      const next = Math.min(Math.max(page, 0), pages - 1);
      if (disabled || next === value) return;
      setState(next);
      onValueChange?.(next);
    };

    // A press before or after the current dot (in reading order).
    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
      onClick?.(event);
      const current = event.currentTarget.querySelector('[data-current]');
      if (!current) return;
      const { left, width } = current.getBoundingClientRect();
      const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
      const after = event.clientX > left + width / 2;
      go(value + (after === rtl ? -1 : 1));
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
      const moves: Record<string, number> = {
        ArrowDown: value - 1,
        ArrowLeft: value + (rtl ? 1 : -1),
        ArrowRight: value + (rtl ? -1 : 1),
        ArrowUp: value + 1,
        End: pages - 1,
        Home: 0,
      };
      const page = moves[event.key];
      if (page === undefined) return;
      event.preventDefault();
      go(page);
    };

    const shown = Array.from(
      { length: Math.min(pages, pages > fullDots ? windowSize : pages) },
      (_, index) => nextStart + index,
    );

    return (
      <StyledRoot
        ref={ref}
        aria-disabled={disabled || undefined}
        aria-label={ariaLabel}
        aria-valuemax={pages}
        aria-valuemin={1}
        aria-valuenow={value + 1}
        aria-valuetext={`${String(value + 1)} of ${String(pages)}`}
        context={context ?? inherited}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <GlassBackground kind="button" />
        {shown.map((page) => (
          <Slot
            key={page}
            aria-hidden="true"
            data-current={page === value ? '' : undefined}
            data-size={dotSize(page, nextStart, pages)}
          >
            <span />
          </Slot>
        ))}
      </StyledRoot>
    );
  },
);
