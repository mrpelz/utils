import { keyframes, styled } from 'goober';
import {
  ComponentProps,
  createContext,
  CSSProperties,
  FocusEvent,
  forwardRef,
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

import { textStyle } from './typography.js';
import { css, useForwardedRef } from './utils.js';

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
// can be scrolled over; settled on one, a column moves to the nearest
// enabled row (as iOS).
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

export type RollValue = number | string;

const part = 'data-roll-part';

/** Row height, wheel height and the cylinder's radius (see above). */
const itemHeight = 34;
const height = 216;
const radius = 110;

/** Scroll settles after this long without scrolling (without `scrollend`). */
const settleDelay = 120;

// The rows' turn on the cylinder, by their progress through the column
// (`view()`: 0 entering at the bottom, 1 leaving at the top): its angle
// from the row's distance to the center, the row moved to where the
// cylinder shows it (closer to the center, further away), fading.
const turn = keyframes(
  Array.from({ length: 41 }, (_, step) => {
    const progress = step / 40;
    const distance = (0.5 - progress) * (height + itemHeight);
    const angle = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, distance / radius),
    );
    const offsetY = radius * Math.sin(angle) - distance;
    const offsetZ = radius * (Math.cos(angle) - 1);

    return `${(progress * 100).toFixed(1)}% {
      opacity: ${Math.max(0, Math.cos(angle)).toFixed(3)};
      transform: perspective(1200px) translate3d(0, ${offsetY.toFixed(2)}px, ${offsetZ.toFixed(2)}px) rotateX(${((-angle * 180) / Math.PI).toFixed(2)}deg);
    }`;
  }).join('\n'),
);

type Entry = { disabled: boolean; value: RollValue };

const digit = /^\d$/;

/** A row's scroll position, centered. */
const topOf = (element: HTMLElement) =>
  element.offsetTop - (height - element.offsetHeight) / 2;

type ColumnContextValue = {
  editing: boolean;
  entries: WeakMap<Element, Entry>;
  /** The id of a row by its value. */
  idOf: (value: RollValue) => string;
  select: (element: HTMLElement) => void;
  selected: RollValue | undefined;
};

const ColumnContext = createContext<ColumnContextValue | undefined>(undefined);

// Figma none (see Source): the wheel, the band behind its center.
const Root = styled('div', forwardRef)`
  position: relative;
  display: flex;
  height: ${height}px;
  justify-content: center;
  color: var(--color-ios-label);
  ${textStyle('body')}
  user-select: none;

  &::before {
    position: absolute;
    top: ${(height - itemHeight) / 2}px;
    height: ${itemHeight}px;
    border-radius: 8px;
    background-color: var(--color-ios-tertiary-system-fill);
    content: '';
    inset-inline: 8px;
    pointer-events: none;
  }
`;

// The column and its typed value's field (see Column).
const ColumnFrame = styled('div', forwardRef)`
  position: relative;
  display: grid;
  min-width: 0;
`;

const Scroller = styled('div', forwardRef)`
  position: relative;
  overflow: hidden auto;
  height: ${height}px;
  box-sizing: border-box;
  border-radius: 8px;
  outline: none;
  overscroll-behavior: contain;
  padding-block: ${(height - itemHeight) / 2}px;
  scroll-snap-type: y mandatory;
  scrollbar-width: none;

  @media (hover: hover) {
    cursor: grab;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  &:focus-visible {
    outline: 2px solid var(--color-ios-primary);
    outline-offset: -2px;
  }

  &[data-dragging] {
    cursor: grabbing;
  }
`;

const rowText = css`
  font-size: 22px;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.26px;
  line-height: ${itemHeight}px;
`;

// Snapped untransformed (snap areas are transformed boxes); its text turns
// (see `turn`).
const StyledItem = styled('div', forwardRef)`
  height: ${itemHeight}px;
  box-sizing: border-box;
  padding-inline: 12px;
  ${rowText}
  scroll-snap-align: center;
  text-align: var(--styled-roll-align, center);
  white-space: nowrap;

  /* Hugging its text: turned around its own center (in wide columns, text
     far from the center of a full-width row would lean). */
  & > span {
    display: inline-block;
    animation: ${turn} linear both;
    animation-timeline: view();
  }

  &[aria-disabled='true'] {
    color: var(--color-ios-tertiary-label);
  }

  &[data-editing] {
    visibility: hidden;
  }
`;

// The typed value's field, over the selected row.
const EditField = styled('input', forwardRef)`
  position: absolute;
  top: ${(height - itemHeight) / 2}px;
  width: 100%;
  height: ${itemHeight}px;
  box-sizing: border-box;
  padding: 0 12px;
  border: 0;
  margin: 0;
  appearance: none;
  background: none;
  caret-color: var(--color-ios-primary);
  color: var(--color-ios-primary);
  font-family: inherit;
  ${rowText}
  outline: none;
  text-align: var(--styled-roll-align, center);
`;

// Figma none: text between columns (e.g. “:”), at the band.
const Separator = styled('div', forwardRef)`
  display: grid;
  align-items: center;
  ${rowText}
  pointer-events: none;
`;

export type RollColumnProps = Omit<
  ComponentProps<'div'>,
  'defaultValue' | 'onChange' | 'ref'
> & {
  /** The rows' alignment (default: `center`). */
  align?: 'center' | 'end' | 'start';
  /** The initially selected value (uncontrolled). */
  defaultValue?: RollValue;
  /** Disables the column: it can't be scrolled or focused. */
  disabled?: boolean;
  /**
   * Pressing the selected row (or typing a digit) enters a value as text
   * (a numeric keyboard; see above).
   */
  editable?: boolean;
  /** Called as rows pass the center while scrolling (e.g. for haptics). */
  onHighlightChange?: (value: RollValue) => void;
  /** Called with the newly selected value, once the column settled. */
  onValueChange?: (value: RollValue) => void;
  /** The selected value (controlled). */
  value?: RollValue;
};

type Drag = {
  moved: boolean;
  pointerId: number;
  samples: { time: number; y: number }[];
  startTop: number;
  startY: number;
};

const Column = forwardRef<HTMLDivElement, RollColumnProps>(
  (
    {
      align = 'center',
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      defaultValue,
      disabled = false,
      editable = false,
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
          `[${CSS.escape(part)}='item']`,
        ) ?? []),
      ].filter((element) => entries.has(element));

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

    // The nearest enabled row to `index` (searching both ways).
    const nearestEnabled = (index: number) => {
      const rows = items();
      for (let distance = 0; distance < rows.length; distance += 1) {
        for (const candidate of [index - distance, index + distance]) {
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

      const row = items()[index];
      const entry = row ? entries.get(row) : undefined;
      if (!entry) return;

      if (entry.disabled) {
        const enabled = nearestEnabled(index);
        if (enabled !== -1 && enabled !== index) scrollToIndex(enabled, true);
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
      const index = rows.findIndex((row) =>
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
        const index = centered();
        if (index !== internal.current.highlighted) {
          internal.current.highlighted = index;
          const row = items()[index];
          const entry = row ? entries.get(row) : undefined;
          if (entry && internal.current.mounted) {
            latest.current.onHighlightChange?.(entry.value);
          }
        }

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
        if (!entry || entry.disabled) return false;
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
        End: () => scrollToIndex(nearestEnabled(items().length - 1), true),
        Enter: () =>
          startEditing(items()[centered()]?.textContent?.trim() ?? ''),
        Home: () => scrollToIndex(nearestEnabled(0), true),
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
      scrollToIndex(nearestEnabled(index), true);
      setTimeout(() => {
        internal.current.drag = undefined;
      });
    };

    return (
      <ColumnContext.Provider value={context}>
        <ColumnFrame
          {...props}
          {...{ [part]: 'column' }}
          style={
            {
              '--styled-roll-align': align,
              ...(typeof style === 'object' && style),
            } as CSSProperties
          }
        >
          <Scroller
            ref={scrollerRef}
            aria-disabled={disabled || undefined}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
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
            {children}
          </Scroller>
          {editing === undefined ? null : (
            <EditField
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
        </ColumnFrame>
      </ColumnContext.Provider>
    );
  },
);

export type RollItemProps = Omit<ComponentProps<'div'>, 'ref'> & {
  /** Shown, but not selectable (the column moves on from it). */
  disabled?: boolean;
  /** The row's value (its text by default). */
  value: RollValue;
};

/** A row (an option of its column). */
const Item = forwardRef<HTMLDivElement, RollItemProps>(
  ({ children, disabled = false, onClick, value, ...props }, ref) => {
    const context = useContext(ColumnContext);
    const elementRef = useForwardedRef<HTMLDivElement>(ref);

    useLayoutEffect(() => {
      const { current: element } = elementRef;
      if (element) context?.entries.set(element, { disabled, value });
    });

    const selected = Object.is(context?.selected, value);

    return (
      <StyledItem
        ref={elementRef}
        aria-disabled={disabled || undefined}
        aria-selected={selected}
        data-editing={(selected && context?.editing) || undefined}
        id={context?.idOf(value)}
        role="option"
        {...props}
        {...{ [part]: 'item' }}
        onClick={(event: MouseEvent<HTMLDivElement>) => {
          (
            onClick as ((event: MouseEvent<HTMLDivElement>) => void) | undefined
          )?.(event);
          if (!event.defaultPrevented) context?.select(event.currentTarget);
        }}
      >
        <span>{(children as ReactNode) ?? String(value)}</span>
      </StyledItem>
    );
  },
);

export const Roll = {
  Root,
  Column,
  Item,
  Separator,
};
