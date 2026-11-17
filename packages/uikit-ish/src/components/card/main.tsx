import '../glass/style.css';
import '../switch/style.css';
import '../slider/style.css';
import '../grid/style.css';
import './style.css';

import { useRender } from '@base-ui/react/use-render';
import { forwardRef, type MouseEvent, type RefObject } from 'react';

import {
  Grid,
  type GridItemLayoutChange,
  startWithFrame,
  useGridItem,
  useGridItemLayout,
} from '../grid/main.js';
import { cn, useForwardedRef } from '../utils/main.js';
import type {
  CardCornerButtonProps,
  CardOrientation,
  CardRootProps,
  CardSizes,
  CardSymbolProps,
  CardTitleProps,
  CardValueProps,
} from './props.js';

export type {
  CardCornerButtonProps,
  CardOrientation,
  CardRootProps,
  CardSizes,
  CardSymbolProps,
  CardTitleProps,
  CardValueProps,
} from './props.js';

// Cards: a surface for what an app shows or controls in a grid's tile (a
// `Grid.Item`'s, nested in it), or on its own. Glass (the Sidebar's and
// Islands' medium material, its colors by what's behind); its parts laid
// out by its own size (container queries), more shown the larger it is.
//
// Also:
// - In edit mode (its item's grid's), its content is inert (presses go to
//   the grid: held, it's dragged) and veiled, so the grid's corner symbols
//   read on it. The veil lifts (and those symbols fade with it) while a
//   tile's dragged or resized, on every card of the grid, so they show
//   their content as the grid changes; a resized tile's outline shows as
//   ever.
// - A `Switch` in it is styled by it (smaller, in its top trailing
//   corner), its state the card's whole background: on, bright (its text
//   dark), off, its glass. A press on the card toggles it as a row's does
//   (`forwardClick`).
// - A `Slider` in it is styled by it: its whole surface the track, the
//   fill the background (its ticks across it), no knob; horizontal or
//   vertical by the tile's shape (see `useCardOrientation`). Its label and
//   value laid out as a card's title and value.
// - A binary card's state also shows as its brightness (`active`: a
//   display's, e.g. a lock locked; a control's, its switch on). Pressable
//   as a whole (an `onClick`), it shows it: hovered, pressed. A display
//   without one doesn't.
// - A corner button (`Card.CornerButton`, a `Grid.CornerButton`) does
//   what's more to it: expanding it in place (the app's size for it),
//   opening it above the page, going to a page of its own; its icon one of
//   `gridIcons` or the app's. Shown outside edit mode only (the grid's own
//   controls take the corners then).
// - Its tile getting to a new box (expanded, collapsed, opened above the
//   page, closed; see Grid's reshape.ts): its glass resized with it (not
//   stretched, clipping what's in it), its parts laid out at the new size
//   at once (its frame, at the size it's getting to); its corner buttons
//   staying in their corners as its edges move (`useCornersFollowing`).
//   The rest of its parts stay where they're laid out: moving them from
//   where they were is the app's (e.g. by an animation library, see
//   `useGridItemLayout`).

/** The tile's shape (its item's effective size): wide, horizontal. */
export const useCardOrientation = (): CardOrientation => {
  const item = useGridItem();
  if (!item) return 'horizontal';
  const [columns = '1', rows = '1'] = item.size.split('x');
  return columns === '*' || Number(columns) >= Number(rows)
    ? 'horizontal'
    : 'vertical';
};

/**
 * The sizes the library's kinds of cards support, for their items'
 * `supportedSizes`: a binary display or control (a state, a switch), a
 * numerical display (a value) or control (a slider: never square, so it
 * has a direction).
 */
export const cardSizes: CardSizes = {
  binaryControl: ['1x1', '2x1'],
  binaryDisplay: ['1x1', '2x1'],
  numericalControl: ['2x1', '3x1', '1x2', '1x3'],
  numericalDisplay: ['1x1', '2x1', '2x2'],
};

/** Its corner buttons' animations' id (see `useCornersFollowing`). */
const cornerId = 'uikit-card-corner';

/**
 * Its corner buttons following its corners as its tile gets to a new box
 * (see the top): laid out in its frame, at the size it's getting to, each
 * at its trailing or bottom edge moved by as much as its glass's edge is
 * off it, by its tile's timing (a translate added to any of its own).
 */
const useCornersFollowing = (rootRef: RefObject<HTMLElement | null>) => {
  useGridItemLayout({
    onAfterChange: ({ duration, easing, from, to }: GridItemLayoutChange) => {
      const root = rootRef.current;
      if (!root) return;
      const isRtl = getComputedStyle(root).direction === 'rtl';
      const across = isRtl ? to.width - from.width : from.width - to.width;
      const down = from.height - to.height;
      for (const button of root.querySelectorAll<HTMLElement>(
        ':scope > .uikit-card-frame > .uikit-card-layout > .uikit-card-corner-button',
      )) {
        for (const animation of button.getAnimations()) {
          if (animation.id === cornerId) animation.cancel();
        }
        // (Which edge it's at: by where it's laid out, in its frame.)
        const center = button.offsetLeft + button.offsetWidth / 2;
        const isAtEnd = center > to.width / 2 !== isRtl;
        const isAtBottom =
          button.offsetTop + button.offsetHeight / 2 > to.height / 2;
        const x = isAtEnd ? across : 0;
        const y = isAtBottom ? down : 0;
        if (x === 0 && y === 0) continue;
        // (With its tile: from the next frame, see Grid's reshape.ts.)
        startWithFrame(
          button.animate(
            [
              { translate: `${String(x)}px ${String(y)}px` },
              { translate: '0 0' },
            ],
            { composite: 'add', duration, easing, id: cornerId },
          ),
        );
      }
    },
  });
};

/**
 * The card: its glass, its parts on it; bright while `active` (or a switch
 * in it is on); pressable as a whole with an `onClick` (its feedback, see
 * style.css); in a grid's tile (its item's), inert and veiled while
 * editing (see the top).
 */
const Root = forwardRef<HTMLDivElement, CardRootProps>(
  (
    { active = false, children, className, onClick, render, ...props },
    forwardedRef,
  ) => {
    const item = useGridItem();
    const isEditing = item?.editing === true;
    const ref = useForwardedRef(forwardedRef);
    useCornersFollowing(ref);
    return useRender({
      defaultTagName: 'div',
      props: {
        ...props,
        // (Its parts on a layout of its own, in a frame: what its size
        // queries ask, see style.css.)
        children: (
          <div className="uikit-card-frame">
            <div className="uikit-card-layout">{children}</div>
          </div>
        ),
        className: cn(
          'uikit-card-root uikit-glass-medium uikit-glass-panel',
          className,
        ),
        'data-active': active ? '' : undefined,
        'data-card-part': 'root',
        // (Pressed as a whole: its feedback, see style.css.)
        'data-pressable': onClick ? '' : undefined,
        'data-editing': isEditing ? '' : undefined,
        inert: isEditing || undefined,
        onClick,
      },
      ref,
      render,
    });
  },
);

/** Its symbol (e.g. a `Symbol`), at its top leading corner. */
const CardSymbol = forwardRef<HTMLSpanElement, CardSymbolProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      {...props}
      className={cn('uikit-card-symbol', className)}
      data-card-part="symbol"
    />
  ),
);

/** What it is (e.g. a device's name), above its value. */
const Title = forwardRef<HTMLSpanElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      {...props}
      className={cn('uikit-card-title', className)}
      data-card-part="title"
    />
  ),
);

/** The document's language, if it says (none: the runtime's default). */
const documentLocale = () =>
  typeof document === 'undefined'
    ? undefined
    : document.documentElement.lang || undefined;

/**
 * Its value: a number formatted as the app says (`format`, `locale`:
 * `Intl.NumberFormat`'s), or what's given instead (e.g. a state).
 */
const Value = forwardRef<HTMLSpanElement, CardValueProps>(
  ({ children, className, format, locale, value, ...props }, ref) => (
    <span
      ref={ref}
      {...props}
      className={cn('uikit-card-value', className)}
      data-card-part="value"
    >
      {value === undefined
        ? children
        : new Intl.NumberFormat(locale ?? documentLocale(), format).format(
            value,
          )}
    </span>
  ),
);

/**
 * A button in its corner (see `Grid.CornerButton`): shown while its grid
 * isn't editing (faded out, inert, while it is; and as `visible` says). A
 * press on it is its own, not the card's (e.g. not toggling a switch in
 * it, see `forwardClick`).
 */
const CornerButton = forwardRef<HTMLButtonElement, CardCornerButtonProps>(
  ({ className, onClick, visible = true, ...props }, ref) => {
    const isEditing = useGridItem()?.editing === true;
    return (
      <Grid.CornerButton
        ref={ref}
        className={cn('uikit-card-corner-button', className)}
        data-card-part="corner-button"
        visible={visible && !isEditing}
        {...props}
        onClick={(event: MouseEvent<HTMLButtonElement>) => {
          event.stopPropagation();
          onClick?.(event);
        }}
      />
    );
  },
);

export const Card = {
  CornerButton,
  Root,
  Symbol: CardSymbol,
  Title,
  Value,
};
