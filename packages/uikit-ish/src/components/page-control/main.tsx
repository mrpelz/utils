/* eslint-disable unicorn/prefer-ternary */
import '../tooltip/style.css';
import '../glass/style.css';
import './style.css';

import {
  forwardRef,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  useContext,
  useRef,
  useState,
} from 'react';

import {
  GlassBackground,
  InheritedGlassContext,
  useGlassContext,
} from '../glass/main.js';
import { cn, useForwardedRef } from '../utils/main.js';
import type { PageControlProps } from './props.js';

export type { PageControlProps } from './props.js';

// Source: Apple iOS 26 Figma (“Toolbars”: “_Page control”, Dots 1 to 8+,
// BG Context Dim/Bright): a glass capsule, 48px high, 24px from its ends,
// of 8px dots 8px apart; the current page's in the glass' vibrant content
// color, the others in its disabled content color. Of more than 7 pages, 8
// dots show at a time: the dots before and after them (if any) are hinted
// at by the outermost two shrinking (6px and 4px, in 8px and 6px slots).
// Behavior after UIKit's `UIPageControl`: a press on either side of the
// current dot goes to the previous or next page; dragged along (scrubbing,
// UIKit's continuous interaction), a page per dot passed; an adjustable
// control (arrow keys, Home and End).
//
// Its plain variant: Figma “Page Controls” (UIKit's, over content): a
// capsule 24px high, 12px from its ends, the current page's dot in the
// label color, the others in it at 30%, without glass.
//
// Deviations:
// - The window of 8 dots moves when the current page would reach a
//   shrunken dot (Figma: the window's states only), the dots resizing
//   (200ms).
// - Optionally, the current page (“3 of 8”) in a tooltip (see `Tooltip`)
//   8px above it while it's hovered, pressed or focused by keyboard
//   (`momentaryTooltip`).

/** Pages shown as full dots at most (more: a window of `windowSize`). */
const fullDots = 7;
const windowSize = 8;

const defaultFormat = (page: number, count: number) =>
  `${String(page + 1)} of ${String(count)}`;

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
 * highlighted, on glass (e.g. in a `Toolbar`), or plain.
 */
export const PageControl = forwardRef<HTMLDivElement, PageControlProps>(
  (
    {
      className,
      'aria-label': ariaLabel = 'Page',
      context,
      count,
      defaultValue = 0,
      disabled = false,
      format = defaultFormat,
      momentaryTooltip = false,
      onClick,
      onKeyDown,
      onPointerCancel,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onValueChange,
      value: valueProp,
      variant = 'glass',
      ...props
    },
    forwardedRef,
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const inherited = useContext(InheritedGlassContext);
    const resolved = useGlassContext(ref, context);
    const [state, setState] = useState(defaultValue);
    const [pressed, setPressed] = useState(false);
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

    // Scrubbing: from where it was pressed, a page per dot (16px: a dot and
    // its gap) passed; once it's moved, its click doesn't page.
    const scrub = useRef<
      { page: number; scrubbed: boolean; x: number } | undefined
    >(undefined);
    const scrubbed = useRef(false);

    // A press before or after the current dot (in reading order).
    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
      onClick?.(event);
      if (scrubbed.current) {
        scrubbed.current = false;
        return;
      }
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

    // Pressed (also by touch, which doesn't hover): its tooltip shown.
    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
      onPointerDown?.(event);
      setPressed(true);
      scrubbed.current = false;
      if (disabled || event.button !== 0) return;
      scrub.current = { page: value, scrubbed: false, x: event.clientX };
      event.currentTarget.setPointerCapture(event.pointerId);
    };
    const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
      onPointerMove?.(event);
      const from = scrub.current;
      if (!from) return;
      const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
      const dx = (event.clientX - from.x) * (rtl ? -1 : 1);
      if (!from.scrubbed && Math.abs(dx) < 4) return;
      from.scrubbed = true;
      go(from.page + Math.round(dx / 16));
    };
    const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
      onPointerUp?.(event);
      setPressed(false);
      scrubbed.current = scrub.current?.scrubbed ?? false;
      scrub.current = undefined;
    };
    const handlePointerCancel = (event: PointerEvent<HTMLDivElement>) => {
      onPointerCancel?.(event);
      setPressed(false);
      scrub.current = undefined;
    };

    const valueText = format(value, pages);

    const shown = Array.from(
      { length: Math.min(pages, pages > fullDots ? windowSize : pages) },
      (_, index) => nextStart + index,
    );

    return (
      <div
        ref={ref}
        aria-disabled={disabled || undefined}
        aria-label={ariaLabel}
        aria-valuemax={pages}
        aria-valuemin={1}
        aria-valuenow={value + 1}
        aria-valuetext={valueText}
        data-glass-context={resolved ?? inherited ?? 'auto'}
        data-pressed={pressed ? '' : undefined}
        data-variant={variant}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onPointerCancel={handlePointerCancel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        {...props}
        className={cn('uikit-page-control-root', className)}
        data-page-control-part="root"
      >
        {variant === 'glass' ? <GlassBackground kind="button" /> : null}
        {shown.map((page) => (
          // A dot's slot (8px, or 6px for the outermost shrunken one) and its
          // dot, above the glass, blended with it as the glass' content.
          <span
            key={page}
            aria-hidden="true"
            className="uikit-page-control-slot"
            data-current={page === value ? '' : undefined}
            data-page-control-part="slot"
            data-size={dotSize(page, nextStart, pages)}
          >
            <span />
          </span>
        ))}
        {momentaryTooltip ? (
          <span
            aria-hidden="true"
            className="uikit-page-control-tooltip uikit-tooltip-surface uikit-glass-medium"
            data-page-control-part="tooltip"
          >
            {valueText}
          </span>
        ) : null}
      </div>
    );
  },
);
