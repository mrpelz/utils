/* eslint-disable unicorn/prefer-ternary */
import './style.css';

import {
  Children,
  ComponentProps,
  createContext,
  CSSProperties,
  FocusEvent,
  forwardRef,
  Fragment,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  ReactNode,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { cn, useForwardedRef } from '../utils/main.js';
import type {
  ColumnContextValue,
  Drag,
  Entry,
  RollColumnProps,
  RollItemProps,
  RollValue,
} from './props.js';

export type { RollColumnProps, RollItemProps, RollValue } from './props.js';

// Source: Framework7 (`picker.js`, `picker-ios.less`, `picker-vars.less`),
// after UIKit's `UIPickerView`: a wheel of columns, the selected row in a
// band across them.
//
// A roll (UIKit `UIPickerView`): `Root` holds `Column`s of `Item`s and,
// between them, `Separator`s (e.g. “:”). Columns scroll natively (touch,
// wheel, momentum), snapping to their rows; dragged with a mouse, they
// follow it; when settled, the centered row is selected. The rows turn on a
// cylinder (Framework7: 110px radius, 1200px perspective), fading towards
// its edges, by a scroll-driven animation (without one: flat). A column is a
// listbox: arrow keys, Page Up/Down and Home/End move its selection, and a
// press on a row scrolls to it. Disabled rows (e.g. days past a maximum)
// can be scrolled (or dragged, or pressed) to; settled on one a moment, a
// column moves to the nearest enabled row (as iOS), unless scrolled on.
//
// `editable` columns (e.g. numbers) take typed values: pressing their
// selected row (or typing a digit while focused) shows a numeric text field
// in its place (as iOS's time wheels); entered, the row matching the text
// (its text, or its number) is selected.
//
// Deviations:
// - Rows are 34px (Framework7: 36px), their text 22px (Framework7: 20px),
//   in a 216px wheel (UIKit's `UIPickerView` height; Framework7: 260px).
// - The band is `tertiarySystemFill` with 8px corners, 8px from the sides.
// - Columns don't loop (iOS's time wheels do).

/** Row height and wheel height (see above; also in style.css). */
const itemHeight = 34;
const height = 216;

/** Scroll settles after this long without scrolling (without `scrollend`). */
const settleDelay = 120;

/** Settled on a disabled row, a column moves on after this long. */
const rejectDelay = 400;

const digit = /^\d$/;

/** A row's scroll position, centered. */
const topOf = (element: HTMLElement) =>
  element.offsetTop - (height - element.offsetHeight) / 2;

const ColumnContext = createContext<ColumnContextValue | undefined>(undefined);

// Rows of a looping column's copies of its rows (see `Column` `loop`).
const CopyContext = createContext(false);

// A looping column's copies before (and after) its rows: at least two, and
// at least 60 rows, so inertial scrolling (several flicks in a row, too)
// doesn't reach their end before the column settles (and moves back to its
// rows, unseen).
const copiesOf = (rows: number) =>
  Math.max(2, Math.ceil(60 / Math.max(rows, 1)));

// Figma none (see Source): the wheel, the band behind its center.
const Root = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('uikit-roll-root', className)}
      data-roll-part="root"
      {...props}
    />
  ),
);

// Figma none: text between columns (e.g. “:”), at the band.
const Separator = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('uikit-roll-separator', className)}
      data-roll-part="separator"
      {...props}
    />
  ),
);

const Column = forwardRef<HTMLDivElement, RollColumnProps>(
  (
    {
      className,
      align = 'center',
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      defaultValue,
      disabled = false,
      editable = false,
      loop = false,
      onHighlightChange,
      onValueChange,
      style,
      value: valueProp,
      ...props
    },
    ref,
  ) => {
    const scrollerRef = useForwardedRef<HTMLDivElement>(ref);
    const entries = useMemo(() => new WeakMap<Element, Entry>(), []);
    const [state, setState] = useState(defaultValue);
    const value = valueProp ?? state;
    const [editing, setEditing] = useState<string | undefined>(undefined);
    const listId = useId();

    const latest = useRef({ onHighlightChange, onValueChange, value });
    useLayoutEffect(() => {
      latest.current = { onHighlightChange, onValueChange, value };
    });

    const internal = useRef({
      drag: undefined as Drag | undefined,
      highlighted: undefined as number | undefined,
      mounted: false,
      /** The direction last scrolled in (1: down, -1: up). */
      direction: 1,
      /** The scroll position last seen (for `direction`). */
      position: 0,
      /** Moving on from a disabled row (see `settle`). */
      reject: undefined as ReturnType<typeof setTimeout> | undefined,
      /**
       * The row scrolled to (by `scrollToIndex`): until it's reached, the
       * column doesn't settle (a smooth scroll can be interrupted, e.g. by
       * another, or by focusing); the user scrolling clears it.
       */
      target: undefined as number | undefined,
      timeout: undefined as ReturnType<typeof setTimeout> | undefined,
    });

    const items = () =>
      [
        ...(scrollerRef.current?.querySelectorAll<HTMLElement>(
          '[data-roll-part=item]',
        ) ?? []),
      ].filter((element) => entries.has(element));

    // The rows themselves (a looping column's, not its copies): their first
    // index, and how many.
    const originals = () => {
      const rows = items();
      const first = rows.findIndex(
        (row) => !Object.hasOwn(row.dataset, 'rollCopy'),
      );
      const count = rows.filter(
        (row) => !Object.hasOwn(row.dataset, 'rollCopy'),
      ).length;
      return { count, first: Math.max(first, 0) };
    };

    // A row's own index (a copy's: the row it copies).
    const ownIndex = (index: number) => {
      const { count, first } = originals();
      if (count === 0) return index;
      return first + ((((index - first) % count) + count) % count);
    };

    // The row at the center.
    const centered = () => {
      const { current: scroller } = scrollerRef;
      const rows = items();
      if (!scroller || rows.length === 0) return -1;

      const index = Math.round(scroller.scrollTop / itemHeight);
      return Math.min(Math.max(index, 0), rows.length - 1);
    };

    const scrollToIndex = (index: number, smooth: boolean) => {
      const { current: scroller } = scrollerRef;
      const row = items()[index];
      if (!scroller || !row) return;

      internal.current.target = index;
      const top = topOf(row);
      // Already there: as if scrolled there (to settle).
      if (Math.abs(scroller.scrollTop - top) < 1) {
        scroller.dispatchEvent(new Event('scroll'));
        return;
      }
      scroller.scrollTo({ behavior: smooth ? 'smooth' : 'instant', top });
    };

    // The nearest enabled row to `index` (searching both ways, first in
    // `direction`: 1 down, -1 up).
    const nearestEnabled = (index: number, direction = -1) => {
      const rows = items();
      for (let distance = 0; distance < rows.length; distance += 1) {
        for (const candidate of [
          index + distance * direction,
          index - distance * direction,
        ]) {
          const row = rows[candidate];
          if (row && !entries.get(row)?.disabled) return candidate;
        }
      }
      return -1;
    };

    const commit = (next: RollValue) => {
      if (Object.is(next, latest.current.value)) return;
      setState(next);
      latest.current.onValueChange?.(next);
    };

    const settle = () => {
      const { drag } = internal.current;
      clearTimeout(internal.current.timeout);
      if (drag) return;

      const index = centered();
      const { target } = internal.current;
      if (target !== undefined) {
        // Not there yet: on (again).
        if (target !== index) {
          scrollToIndex(target, true);
          return;
        }
        internal.current.target = undefined;
      }

      // Settled on a copy (looping): to its row, unseen.
      const own = ownIndex(index);
      const { current: scroller } = scrollerRef;
      if (own !== index && scroller) {
        scroller.scrollTop += (own - index) * itemHeight;
        internal.current.position = scroller.scrollTop;
        return;
      }

      const row = items()[index];
      const entry = row ? entries.get(row) : undefined;
      if (!entry) return;

      // A moment later (scrolled on meanwhile: not), to the nearest
      // enabled row.
      if (entry.disabled) {
        clearTimeout(internal.current.reject);
        internal.current.reject = setTimeout(() => {
          if (internal.current.drag || centered() !== index) return;
          // Onwards, as scrolled (not back: scrolled on row by row, the
          // column would never pass it).
          const enabled = nearestEnabled(index, internal.current.direction);
          if (enabled !== -1 && enabled !== index) scrollToIndex(enabled, true);
        }, rejectDelay);
        return;
      }

      // Snapping off while dragged with a mouse.
      scrollerRef.current?.style.removeProperty('scroll-snap-type');
      commit(entry.value);
    };

    // The selected row at the center: at once when mounted, scrolling
    // when changed later (unless already there, e.g. scrolled to).
    useLayoutEffect(() => {
      const rows = items();
      const index = rows.findIndex(
        (row) =>
          !Object.hasOwn(row.dataset, 'rollCopy') &&
          Object.is(entries.get(row)?.value, value),
      );
      if (index === -1 || internal.current.drag) return;
      if (index !== centered() || !internal.current.mounted) {
        scrollToIndex(index, internal.current.mounted);
      }
      internal.current.mounted = true;
      // eslint-disable-next-line react-hooks/exhaustive-deps -- by value
    }, [value]);

    useEffect(() => {
      const { current: scroller } = scrollerRef;
      if (!scroller) return undefined;

      const onScroll = () => {
        const { scrollTop } = scroller;
        if (scrollTop !== internal.current.position) {
          internal.current.direction = Math.sign(
            scrollTop - internal.current.position,
          );
          internal.current.position = scrollTop;
        }
        const index = centered();
        if (index !== internal.current.highlighted) {
          internal.current.highlighted = index;
          const row = items()[index];
          const entry = row ? entries.get(row) : undefined;
          if (entry && internal.current.mounted) {
            latest.current.onHighlightChange?.(entry.value);
          }
        }

        clearTimeout(internal.current.reject);
        clearTimeout(internal.current.timeout);
        internal.current.timeout = setTimeout(settle, settleDelay);
      };

      // The user scrolling.
      const onInput = () => {
        internal.current.target = undefined;
      };

      const { current: refs } = internal;
      scroller.addEventListener('scroll', onScroll, { passive: true });
      scroller.addEventListener('scrollend', settle);
      for (const type of ['pointerdown', 'touchstart', 'wheel'] as const) {
        scroller.addEventListener(type, onInput, { passive: true });
      }
      return () => {
        clearTimeout(refs.reject);
        clearTimeout(refs.timeout);
        scroller.removeEventListener('scroll', onScroll);
        scroller.removeEventListener('scrollend', settle);
        for (const type of ['pointerdown', 'touchstart', 'wheel'] as const) {
          scroller.removeEventListener(type, onInput);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps -- once
    }, []);

    // Moves the selection by `rows` (skipping disabled ones).
    const step = (rows: number) => {
      const all = items();
      let index = centered();
      const direction = Math.sign(rows);
      for (let left = Math.abs(rows); left > 0;) {
        const next = index + direction;
        if (next < 0 || next >= all.length) break;
        index = next;
        const row = all[index];
        if (row && !entries.get(row)?.disabled) left -= 1;
      }
      scrollToIndex(nearestEnabled(index), true);
    };

    const startEditing = (text: string) => {
      if (!editable || disabled) return;
      setEditing(text);
    };

    // The typed value: the row whose text (or number) it is.
    // Once per edit (entered, then left: blurred).
    const editingRef = useRef(false);
    useLayoutEffect(() => {
      editingRef.current = editing !== undefined;
    }, [editing]);

    const enter = (text: string) => {
      if (!editingRef.current) return;
      editingRef.current = false;
      setEditing(undefined);
      const trimmed = text.trim();
      if (trimmed === '') return;

      const number = Number(trimmed);
      const index = items().findIndex((row) => {
        const entry = entries.get(row);
        if (
          !entry ||
          entry.disabled ||
          Object.hasOwn(row.dataset, 'rollCopy')
        ) {
          return false;
        }
        if (row.textContent?.trim().toLowerCase() === trimmed.toLowerCase()) {
          return true;
        }
        return (
          !Number.isNaN(number) &&
          Number(entry.value) === number &&
          String(entry.value).trim() !== ''
        );
      });
      const row = items()[index];
      const entry = row ? entries.get(row) : undefined;
      if (!entry) return;

      scrollToIndex(index, true);
      commit(entry.value);
    };

    // Looping, copies of the rows before and after them.
    const copies = loop ? (
      <CopyContext.Provider value>
        {Array.from(
          { length: copiesOf(Children.count(children)) },
          (_, index) => (
            <Fragment key={index}>{children}</Fragment>
          ),
        )}
      </CopyContext.Provider>
    ) : null;

    const idOf = (row: RollValue) =>
      `${listId}-${encodeURIComponent(String(row))}`;

    const context = useMemo<ColumnContextValue>(
      () => ({
        editing: editing !== undefined,
        entries,
        idOf,
        select: (element) => {
          if (internal.current.drag?.moved || disabled) return;
          const index = items().indexOf(element);
          if (index === -1) return;
          if (index === centered() && editable) {
            startEditing(element.textContent ?? '');
            return;
          }
          scrollToIndex(index, true);
        },
        selected: value,
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps -- the latest
      [disabled, editable, editing, entries, listId, value],
    );

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      const moves: Record<string, () => void> = {
        ArrowDown: () => step(1),
        ArrowUp: () => step(-1),
        End: () => {
          const { count, first } = originals();
          scrollToIndex(nearestEnabled(first + count - 1), true);
        },
        Enter: () =>
          startEditing(items()[centered()]?.textContent?.trim() ?? ''),
        Home: () => scrollToIndex(nearestEnabled(originals().first, 1), true),
        PageDown: () => step(5),
        PageUp: () => step(-5),
      };
      const move = moves[event.key];
      if (move) {
        event.preventDefault();
        move();
        return;
      }
      if (editable && digit.test(event.key)) {
        event.preventDefault();
        startEditing(event.key);
      }
    };

    // Mouse drags (touch scrolls natively): the column follows, then
    // glides on (by the last 100ms) to the nearest row.
    const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'touch' || event.button !== 0 || disabled) {
        return;
      }
      const { currentTarget } = event;
      internal.current.drag = {
        moved: false,
        pointerId: event.pointerId,
        samples: [{ time: event.timeStamp, y: event.clientY }],
        startTop: currentTarget.scrollTop,
        startY: event.clientY,
      };
    };

    const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
      const { drag } = internal.current;
      if (drag?.pointerId !== event.pointerId) return;

      const { currentTarget } = event;
      const moved = event.clientY - drag.startY;
      if (!drag.moved) {
        if (Math.abs(moved) < 4) return;
        drag.moved = true;
        currentTarget.setPointerCapture(event.pointerId);
        currentTarget.style.scrollSnapType = 'none';
        currentTarget.dataset.dragging = '';
      }

      currentTarget.scrollTop = drag.startTop - moved;
      drag.samples.push({ time: event.timeStamp, y: event.clientY });
      drag.samples = drag.samples.filter(
        ({ time }) => event.timeStamp - time < 100,
      );
    };

    const onPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
      const { drag } = internal.current;
      if (drag?.pointerId !== event.pointerId) return;

      const { currentTarget } = event;
      delete currentTarget.dataset.dragging;
      // Clicks after a drag are ignored (see `select`), until the next.
      setTimeout(() => {
        if (internal.current.drag === drag) internal.current.drag = undefined;
      });
      if (!drag.moved) {
        internal.current.drag = undefined;
        return;
      }

      const [first] = drag.samples;
      const velocity =
        first && event.timeStamp > first.time
          ? (event.clientY - first.y) / (event.timeStamp - first.time)
          : 0;
      const target = currentTarget.scrollTop - velocity * 150;
      const count = items().length;
      const index = Math.min(
        Math.max(Math.round(target / itemHeight), 0),
        count - 1,
      );
      internal.current.drag = { ...drag, moved: true, pointerId: -1 };
      scrollToIndex(index, true);
      setTimeout(() => {
        internal.current.drag = undefined;
      });
    };

    return (
      <ColumnContext.Provider value={context}>
        {/* The column and its typed value's field (see Column). */}
        <div
          {...props}
          className={cn('uikit-roll-column-frame', className)}
          data-roll-part="column"
          style={
            {
              '--uikit-roll-align': align,
              ...(typeof style === 'object' && style),
            } as CSSProperties
          }
        >
          <div
            ref={scrollerRef}
            aria-disabled={disabled || undefined}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            className="uikit-roll-scroller"
            data-roll-part="scroller"
            id={listId}
            role="listbox"
            style={disabled ? { overflow: 'hidden' } : undefined}
            tabIndex={disabled ? -1 : 0}
            aria-activedescendant={
              value === undefined ? undefined : idOf(value)
            }
            onKeyDown={onKeyDown}
            onLostPointerCapture={onPointerEnd}
            onPointerCancel={onPointerEnd}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
          >
            {loop ? (
              <>
                {copies}
                {children}
                {copies}
              </>
            ) : (
              children
            )}
          </div>
          {editing === undefined ? null : (
            // The typed value's field, over the selected row.
            <input
              ref={(element: HTMLInputElement | null) => {
                // Once (preact doesn't focus `autoFocus` elements).
                if (
                  element &&
                  element.ownerDocument.activeElement !== element
                ) {
                  element.focus();
                  element.select();
                }
              }}
              aria-label={ariaLabel}
              className="uikit-roll-edit-field"
              data-roll-part="edit-field"
              defaultValue={editing}
              enterKeyHint="done"
              inputMode="numeric"
              onBlur={(event: FocusEvent<HTMLInputElement>) =>
                enter(event.currentTarget.value)
              }
              onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  enter(event.currentTarget.value);
                  scrollerRef.current?.focus();
                }
                if (event.key === 'Escape') {
                  event.preventDefault();
                  editingRef.current = false;
                  setEditing(undefined);
                  scrollerRef.current?.focus();
                }
              }}
            />
          )}
        </div>
      </ColumnContext.Provider>
    );
  },
);

/** A row (an option of its column). */
const Item = forwardRef<HTMLDivElement, RollItemProps>(
  (
    { className, children, disabled = false, onClick, value, ...props },
    ref,
  ) => {
    const context = useContext(ColumnContext);
    const copy = useContext(CopyContext);
    const elementRef = useForwardedRef<HTMLDivElement>(ref);

    useLayoutEffect(() => {
      const { current: element } = elementRef;
      if (element) context?.entries.set(element, { disabled, value });
    });

    const selected = Object.is(context?.selected, value);

    return (
      // Snapped untransformed (snap areas are transformed boxes); its text
      // turns (see `uikit-roll-turn`, style.css).
      <div
        ref={elementRef}
        aria-disabled={disabled || undefined}
        aria-selected={selected}
        data-editing={(selected && !copy && context?.editing) || undefined}
        id={copy ? undefined : context?.idOf(value)}
        role="option"
        {...props}
        aria-hidden={copy || undefined}
        className={cn('uikit-roll-item', className)}
        data-roll-copy={copy ? '' : undefined}
        data-roll-part="item"
        onClick={(event: MouseEvent<HTMLDivElement>) => {
          (
            onClick as ((event: MouseEvent<HTMLDivElement>) => void) | undefined
          )?.(event);
          if (!event.defaultPrevented) context?.select(event.currentTarget);
        }}
      >
        <span>{(children as ReactNode) ?? String(value)}</span>
      </div>
    );
  },
);

export const Roll = {
  Root,
  Column,
  Item,
  Separator,
};
