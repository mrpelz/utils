import { RefObject, useLayoutEffect } from 'react';

import { edgeScrollDelta, frameElapsed } from '../utils/main.js';
import { cellOf, type GridRange, type GridReorderHandle } from './handle.js';
import {
  fillsOf,
  placeBreaks,
  reflowDuration,
  reflowEasing,
  scrollerOf,
  visibleEdgesOf,
} from './layout.js';
import {
  isEmptyPlan,
  isSamePlan,
  type Plan,
  planAt,
  type Unit,
} from './plan.js';
import type {
  GridBreakRows,
  GridReorderChange,
  GridReorderInsert,
  GridReorderReason,
} from './props.js';

// Editing a grid (see main.tsx): its cells (items, spacers, breaks) with a
// reorder handle dragged to a gap among the cells of a range that handle is
// given to (a `Section`'s, the `Root`'s, a `DropGroup`'s), in any section;
// by keyboard, to the gap before or after.
//
// - Lifted: out of the flow (positioned where it was, following the
//   pointer, wherever its section glides or the page scrolls), a
//   placeholder of its size where it'll land (a break's: a unit wide, its
//   rows tall, easier to put where it's to go, gliding there), a hole of its shape where it was
//   (while it's to land a row below: what's around it staying put), the cells
//   shown in order by CSS `order` (the DOM's the app's). Its own click held
//   back. Near the scroller's top or bottom (beside its bars), it scrolls.
// - On the first cell of the row below its last one (or on a section's
//   end row), where the row before would take it back (room at its end): a
//   break stand-in filling that row and those down to it (its rows), the
//   placeholder at the row's start. On an empty unit (a break's rows' too):
//   there, by what's to be added (breaks, spacers: stand-ins) and changed
//   (the break before it shortened, shown so), see plan.ts. Dropped, the
//   change asks for them (`target.addBefore`, `addAfter`, `resize`; its handle's
//   `breaks`, `spacers`).
// - Inertia: the placeholder moves once the pointer has rested on a place a
//   moment, and, once moved, only after the pointer's moved on a little: no
//   back and forth between two places, the cells rearranged under it. Where
//   the cell can't go, the placeholder goes home: released there, the cell
//   goes back.
// - Dropped: the placeholder gone, the cell back in the flow, the handle's
//   `onReorder` (the app moving it, its render before the next frame); the
//   cell (or, moved to another section, its new element, found by name)
//   gliding from where it was held.

/** How far a pointer moves before it's a drag (px). */
export const slop = 4;
/** How long a touch holds still before it drags (ms; a flick scrolls). */
const touchHold = 200;
/** How long a drag rests on a place before the others make room (ms). */
const dragSettle = 120;
/** How far, once they have, it moves on before they do again (units). */
const dragHysteresis = 0.5;

const cellSelector =
  '[data-grid-part="item"], [data-grid-part="spacer"], [data-grid-part="break"]';

/** What's moved (dragged, by keyboard): a cell with a reorder handle. */
const movableOf = (target: EventTarget | null) => {
  const element = (target as Element | null)?.closest?.<HTMLElement>(
    cellSelector,
  );
  return element && Object.hasOwn(element.dataset, 'gridMovable')
    ? element
    : undefined;
};

const byDocument = (a: Node, b: Node) => {
  if (a === b) return 0;
  // eslint-disable-next-line no-bitwise -- a bit mask
  return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING
    ? -1
    : 1;
};

/** A range's cells, shown and in document order, one left out. */
const membersOf = (range: GridRange, without?: HTMLElement) =>
  Array.from(range.members)
    .filter((element) => element !== without && element.isConnected)
    .toSorted(byDocument);

/** Ranges in document order (by their first cell, else their container). */
const inDocumentOrder = (ranges: readonly GridRange[]) =>
  ranges
    .map((range) => ({
      key: membersOf(range)[0] ?? range.container(),
      range,
    }))
    .filter(
      (entry): entry is { key: HTMLElement; range: GridRange } =>
        entry.key !== null,
    )
    .toSorted((a, b) => byDocument(a.key, b.key))
    .map(({ range }) => range);

/**
 * Where it'd land: a gap in a range (what's added there, maybe: see
 * `Plan`), or where it was (`home`).
 */
type Slot =
  | { index: number; plan?: Plan; range: GridRange }
  | { plan?: undefined; range?: undefined };

/** A break of some rows before it, as a plan. */
const breakPlan = (rows: number): Plan => ({
  after: [],
  before: [{ kind: 'break', rows: rows as GridBreakRows }],
});

const isSameSlot = (a: Slot, b: Slot) =>
  a.range === b.range &&
  isSamePlan(a.plan, b.plan) &&
  (a.range === undefined || (b.range && a.index === b.index));

/** The ranges a cell drops in: its handles' (DropGroups first, see `hit`). */
const rangesOf = (handles: readonly GridReorderHandle[]) =>
  [...new Set(handles.flatMap((handle) => [...handle.ranges]))]
    .filter((range) => range.container()?.isConnected)
    .toSorted(
      (a, b) => Number(b.part === 'DropGroup') - Number(a.part === 'DropGroup'),
    );

/** A cell's first handle (by priority) a range takes. */
const handleAt = (item: HTMLElement, range: GridRange) =>
  cellOf
    .get(item)
    ?.handles()
    .find((each) => range.handles().includes(each));

/** The change for a cell dropped at a gap (by its first handle there). */
const changeOf = (
  item: HTMLElement,
  { index, plan, range }: { index: number; plan?: Plan; range: GridRange },
): { change: GridReorderChange; handle: GridReorderHandle } | undefined => {
  const cell = cellOf.get(item);
  const handle = handleAt(item, range);
  if (!cell || !handle) return undefined;
  const nameOf = (element: HTMLElement | undefined) =>
    element && cellOf.get(element)?.name();
  const members = membersOf(range, item);
  let flat = index;
  for (const each of inDocumentOrder([...handle.ranges])) {
    if (each === range) break;
    flat += membersOf(each, item).length + 1;
  }
  const cells = Array.from(handle.cells)
    .filter((element) => element.isConnected)
    .toSorted(byDocument);
  return {
    change: {
      items: [{ index: cells.indexOf(item), name: cell.name() }],
      target: {
        after: nameOf(members[index - 1]),
        before: nameOf(members[index]),
        ...(plan && plan.after.length > 0 && { addAfter: plan.after }),
        ...(plan && plan.before.length > 0 && { addBefore: plan.before }),
        flat,
        index,
        name: range.name(),
        part: range.part,
        ...(plan?.resize && {
          resize: {
            name: cellOf.get(plan.resize.element)?.name() ?? '',
            rows: plan.resize.rows,
          },
        }),
      },
    },
    handle,
  };
};

/** Its gap among its range's cells (if that range takes it), else home. */
const homeOf = (item: HTMLElement, ranges: readonly GridRange[]): Slot => {
  const range = cellOf.get(item)?.range;
  if (!range || !ranges.includes(range)) return {};
  return {
    index: membersOf(range).indexOf(item),
    range,
  };
};

/** Is a point (in its container's coordinates) on an element? */
const isOn = (element: HTMLElement, x: number, y: number) =>
  x >= element.offsetLeft &&
  x <= element.offsetLeft + element.offsetWidth &&
  y >= element.offsetTop &&
  y <= element.offsetTop + element.offsetHeight;

/** A cell's box in its container's layout. */
type Box = { height: number; left: number; top: number; width: number };

/** A cell's box, measured. */
const boxOf = (element: HTMLElement): Box => ({
  height: element.offsetHeight,
  left: element.offsetLeft,
  top: element.offsetTop,
  width: element.offsetWidth,
});

/** A container's cells' boxes (those shown; breaks' fillers too). */
const boxesOf = (container: HTMLElement) =>
  new Map(
    Array.from(container.children)
      .filter(
        (child): child is HTMLElement =>
          child instanceof HTMLElement &&
          (child.matches(cellSelector) ||
            child.dataset.gridPart === 'break-fill') &&
          child.offsetParent !== null,
      )
      .map((child): [HTMLElement, Box] => [child, boxOf(child)]),
  );

/** A grid's columns, gap and unit (see main.tsx). */
type Metrics = { columns: number; gap: number; unit: number };

const metricsOf = (root: HTMLElement): Metrics => {
  const styles = getComputedStyle(root);
  const value = (property: string, fallback: number) =>
    Number.parseFloat(styles.getPropertyValue(property)) || fallback;
  return {
    columns: value('--uikit-grid-columns', 1),
    gap: value('--uikit-grid-gap', 0),
    unit: value('--uikit-grid-unit', 110),
  };
};

/**
 * A trial (see `breakRowsAt`): the cell (or its placeholder) at a gap, no
 * break: where it lands, the cell before it, the bottom of the others.
 */
type Trial = { bottom: number; landing: Box; previous: Box };

/**
 * The rows of a break a gap in a cell's own range needs, so the cell starts
 * a row there (none: 0). The gap: the start of the row below its last one
 * (its first cell there after it), or the range's end (the row below all,
 * and below its last one). Needed: the cell, put there (a `trial`), landing
 * in the row of the cell before it (room at its end). From that row down to
 * the one it's to start, at most 3. Its handle there taking breaks
 * (`breaks`); by a layout of the cell in its place (as lifted). Not for a
 * break.
 */
const breakRowsAt = (
  item: HTMLElement,
  range: GridRange,
  index: number,
  boxes: ReadonlyMap<HTMLElement, Box>,
  { gap, unit }: Metrics,
  trial: (index: number) => Trial | undefined,
): number => {
  if (item.dataset.gridPart === 'break' || !handleAt(item, range)?.breaks) {
    return 0;
  }
  const members = membersOf(range, item);
  const home = boxes.get(item);
  if (!home || !members[index - 1]) return 0;
  // (In rows from its own.)
  const pitch = unit + gap;
  const rowOf = (top: number) => Math.round((top - home.top) / pitch);
  const last = Math.round((home.height + gap) / pitch);
  const nextCell = members[index];
  const next = nextCell && boxes.get(nextCell);
  if (nextCell && (!next || rowOf(next.top) !== last)) return 0;
  const result = trial(index);
  if (!result) return 0;
  const row = rowOf(result.landing.top);
  if (row !== rowOf(result.previous.top)) return 0;
  const start = next
    ? rowOf(next.top)
    : Math.max(last, rowOf(result.bottom + gap));
  const rows = start - row;
  return rows >= 1 && rows <= 3 ? rows : 0;
};

/** Its cells (breaks' fillers too) but one: their bottom (px). */
const bottomOf = (container: HTMLElement, without: readonly HTMLElement[]) =>
  Math.max(
    0,
    ...Array.from(container.children)
      .filter(
        (child): child is HTMLElement =>
          child instanceof HTMLElement &&
          !without.includes(child) &&
          child.offsetParent !== null &&
          (child.matches(cellSelector) ||
            child.dataset.gridPart === 'break-fill'),
      )
      .map((child) => child.offsetTop + child.offsetHeight),
  );

/**
 * A container's children, the dragged cell, placeholders and breaks'
 * fillers (shown after their breaks, see `orderShown`) left out.
 */
const childrenOf = (container: HTMLElement, item: HTMLElement) =>
  Array.from(container.children).filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElement &&
      child !== item &&
      child.dataset.gridPart !== 'placeholder' &&
      child.dataset.gridPart !== 'break-fill',
  );

/**
 * Where the placeholder goes among a container's children (`childrenOf`):
 * before which of them, by index (at home: where the cell was).
 */
const placeholderAt = (
  children: readonly HTMLElement[],
  slot: Slot,
  item: HTMLElement,
  homeAt: number,
) => {
  if (!slot.range) return homeAt;
  const members = membersOf(slot.range, item);
  const next = members[slot.index];
  const previous = members.at(-1);
  if (next) return children.indexOf(next);
  return previous ? children.indexOf(previous) + 1 : children.length;
};

/** The distance from a point to an element (in its container's terms). */
const distanceTo = (element: HTMLElement, x: number, y: number) =>
  Math.hypot(
    Math.max(
      element.offsetLeft - x,
      0,
      x - element.offsetLeft - element.offsetWidth,
    ),
    Math.max(
      element.offsetTop - y,
      0,
      y - element.offsetTop - element.offsetHeight,
    ),
  );

/** A break's return sign (see `Break`, the CSS), on a break to be. */
const breakSign = () => {
  const sign = document.createElement('span');
  sign.className = 'uikit-grid-break-sign';
  sign.setAttribute('aria-hidden', 'true');
  return sign;
};

/**
 * A stand-in for what's to be added (see `Plan`): a break of its rows, a
 * spacer of its size (placeholders, see the CSS).
 */
const standInOf = (insert: GridReorderInsert) => {
  const element = document.createElement('div');
  element.dataset.gridPart = 'placeholder';
  // (Offered: added if it's dropped there; see the CSS.)
  element.dataset.gridOffered = '';
  if (insert.kind === 'break') {
    element.className = 'uikit-grid-placeholder uikit-grid-break-placeholder';
    element.dataset.gridBreak = '';
    element.dataset.gridRows = String(insert.rows);
    element.style.setProperty('--uikit-grid-break-rows', String(insert.rows));
    element.append(breakSign());
    return element;
  }
  const [columns = '1', rows = '1'] = insert.size.split('x');
  element.className = 'uikit-grid-placeholder uikit-grid-spacer-placeholder';
  element.style.setProperty('--uikit-grid-item-columns', columns);
  element.style.setProperty('--uikit-grid-item-rows', rows);
  return element;
};

/**
 * A container's children shown in order (CSS `order`), the placeholder at
 * its slot (else where the cell was; what's to be added around it), the
 * hole where the cell was.
 */
const orderShown = (
  container: HTMLElement,
  {
    added = [[], []],
    hole,
    holeAt,
    item,
    placeholder,
    slot,
  }: {
    /** What's to be added before it, after it (stand-ins). */
    added?: readonly [readonly HTMLElement[], readonly HTMLElement[]];
    hole: HTMLElement | undefined;
    holeAt: number;
    item: HTMLElement;
    placeholder: HTMLElement | undefined;
    slot: Slot;
  },
) => {
  const children = childrenOf(container, item);
  const at = placeholderAt(children, slot, item, holeAt);
  const order: HTMLElement[] = [];
  // (A break's fillers right after it.)
  const push = (element: HTMLElement) =>
    order.push(element, ...fillsOf(element));
  for (let index = 0; index <= children.length; index += 1) {
    if (hole && index === holeAt) push(hole);
    if (placeholder && index === at) {
      for (const each of added[0]) push(each);
      push(placeholder);
      for (const each of added[1]) push(each);
    }
    const child = children[index];
    if (child) push(child);
  }
  for (const [index, child] of order.entries()) {
    child.style.order = String(index);
  }
};

/**
 * Editing (see the top): dragging cells, Alt and an arrow key moving the
 * focused one, clicks in cells held back (not on edit controls).
 */
export const useEditing = (
  rootRef: RefObject<HTMLDivElement | null>,
  dragged: RefObject<HTMLElement | null>,
  editing: boolean,
): void => {
  useLayoutEffect(() => {
    const { current: root } = rootRef;
    if (!root || !editing) return undefined;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');

    let pending:
      | {
          id: number;
          item: HTMLElement;
          ready: boolean;
          start: readonly [number, number];
          timer: number;
        }
      | undefined;
    let drag:
      | {
          /** Where the pointer is. */
          at: readonly [number, number];
          /** Its container's cells without it (see `baseOf`; once). */
          base?: ReadonlyMap<HTMLElement, Box>;
          /** Its container's position as it was lifted (see `follow`). */
          box: readonly [number, number];
          /** Its container's cells as it was lifted (see `breakRowsAt`). */
          boxes: ReadonlyMap<HTMLElement, Box>;
          /** The place it rests on, not yet taken (see `move`). */
          candidate?: Slot;
          /** The containers shown in another order (see `show`). */
          containers: Set<HTMLElement>;
          /** Frames: following, scrolling (see `tick`). */
          frame: number;
          /** A unit where it was, once it's to land elsewhere. */
          hole: HTMLElement;
          /**
           * Where it was: its place among its container's children, its top
           * (its row's, in its container's terms).
           */
          home: {
            at: number;
            container: HTMLElement;
            slot: Slot;
            top: number;
          };
          item: HTMLElement;
          metrics: Metrics;
          /** Where the pointer was as it last took a place (none: yet). */
          movedAt?: readonly [number, number];
          placeholder: HTMLElement;
          ranges: readonly GridRange[];
          /** A break shown with other rows (see `Plan`), as it was. */
          resized?: { element: HTMLElement; rows: string | undefined };
          /** Its offset from the pointer (a break's: shifted, see `begin`). */
          shift: number;
          slot: Slot;
          /** What's to be added (see `Plan`), shown: before it, after it. */
          standIns: [HTMLElement[], HTMLElement[]];
          start: readonly [number, number];
          timer: number;
          /** Trials by gap, in its own range (see `trial`). */
          trials: Map<number, Trial | null>;
          unit: number;
        }
      | undefined;
    let suppressClick = false;
    const scroller = scrollerOf(root);
    const elapsedOf = frameElapsed();

    /** A cell by its name (moved to another section: a new element). */
    const byName = (name: string | undefined) =>
      name === undefined
        ? null
        : root.querySelector<HTMLElement>(
            `[data-grid-name="${CSS.escape(name)}"]`,
          );

    /** What's to be added no longer shown; a break's rows as they were. */
    const reset = () => {
      if (!drag) return;
      for (const each of drag.standIns.flat()) each.remove();
      drag.standIns = [[], []];
      const { resized } = drag;
      if (!resized) return;
      drag.resized = undefined;
      if (resized.rows === undefined) delete resized.element.dataset.gridRows;
      else resized.element.dataset.gridRows = resized.rows;
      resized.element.style.setProperty(
        '--uikit-grid-break-rows',
        resized.rows ?? '1',
      );
    };

    /**
     * The placeholder at a slot (the hole where it was, if it's to land a
     * row below; what's to be added around it, the break before it with
     * other rows: see `Plan`), the cells around them shown in order.
     */
    const show = (slot: Slot) => {
      if (!drag) return;
      reset();
      const { hole, home, item, placeholder, unit } = drag;
      const container = slot.range?.container() ?? home.container;
      const shown = new Set([container, home.container]);
      for (const each of drag.containers) {
        if (shown.has(each)) continue;
        for (const child of each.children) {
          (child as HTMLElement).style.removeProperty('order');
        }
      }
      drag.containers = shown;
      if (placeholder.parentElement !== container) {
        container.append(placeholder);
      }
      const { plan } = slot;
      const added: [HTMLElement[], HTMLElement[]] = [
        plan?.before.map((insert) => standInOf(insert)) ?? [],
        plan?.after.map((insert) => standInOf(insert)) ?? [],
      ];
      container.append(...added.flat());
      drag.standIns = added;
      if (plan?.resize) {
        const { element, rows } = plan.resize;
        drag.resized = { element, rows: element.dataset.gridRows };
        element.dataset.gridRows = String(rows);
        element.style.setProperty('--uikit-grid-break-rows', String(rows));
      }
      const order = (hasHole: boolean) => {
        for (const each of shown) {
          orderShown(each, {
            added: each === container ? added : undefined,
            hole: hasHole && each === home.container ? hole : undefined,
            holeAt: home.at,
            item,
            placeholder: each === container ? placeholder : undefined,
            slot,
          });
        }
        placeBreaks(root);
      };
      // (A hole where it was only while it's to land in a row below it
      // (measured without the hole, which only pushes it on): what's between
      // not moving back into its place. In its row or before, what's between
      // moves into it. In a later section: a row below; an earlier: none.
      // Something added (see `Plan`): none, its row closing up, as it
      // will.)
      hole.remove();
      order(false);
      const isBelow =
        container === home.container
          ? !isSameSlot(slot, home.slot) &&
            isEmptyPlan(slot.plan) &&
            placeholder.offsetTop > home.top + unit / 2
          : byDocument(home.container, container) < 0;
      if (isBelow) {
        home.container.append(hole);
        order(true);
      }
      drag.slot = slot;
    };

    /**
     * It, following the pointer, wherever its container's gone since it was
     * lifted (gliding, scrolled).
     */
    const follow = (at: readonly [number, number]) => {
      if (!drag) return;
      const { box, home, item, shift, start } = drag;
      const { left, top } = home.container.getBoundingClientRect();
      const x = at[0] - start[0] + shift - (left - box[0]);
      const y = at[1] - start[1] - (top - box[1]);
      item.style.translate = `${String(x)}px ${String(y)}px`;
    };

    /**
     * A trial (see `breakRowsAt`): the placeholder at a gap in its own
     * range, no hole, no break, measured; then shown as it was. Once a gap.
     */
    const trial = (index: number): Trial | undefined => {
      if (!drag) return undefined;
      const cached = drag.trials.get(index);
      if (cached !== undefined) return cached ?? undefined;
      const { hole, home, item, placeholder, slot } = drag;
      const previous = home.slot.range
        ? membersOf(home.slot.range, item)[index - 1]
        : undefined;
      if (!home.slot.range || !previous) return undefined;
      reset();
      hole.remove();
      if (placeholder.parentElement !== home.container) {
        home.container.append(placeholder);
      }
      orderShown(home.container, {
        hole: undefined,
        holeAt: home.at,
        item,
        placeholder,
        slot: { index, range: home.slot.range },
      });
      placeBreaks(root);
      const result = {
        bottom: bottomOf(home.container, [item, placeholder]),
        landing: boxOf(placeholder),
        previous: boxOf(previous),
      };
      show(slot);
      drag.trials.set(index, result);
      return result;
    };

    /**
     * On what's shown while dragging (in a container's coordinates): the
     * placeholder (where it is), the hole (back home), what's to be added
     * before it (nothing added there), after it (where it is).
     */
    const shownAt = (
      range: GridRange,
      container: HTMLElement,
      x: number,
      y: number,
    ): Slot | undefined => {
      if (!drag) return undefined;
      const { hole, home, placeholder, slot, standIns } = drag;
      const isIn = (element: HTMLElement) =>
        element.parentElement === container && isOn(element, x, y);
      if (isIn(placeholder) || standIns[1].some((each) => isIn(each))) {
        return slot;
      }
      if (isIn(hole)) return home.slot;
      return slot.range === range && standIns[0].some((each) => isIn(each))
        ? { index: slot.index, range }
        : undefined;
    };

    /**
     * Over a cell (by its index in its range): taking its place, after it if
     * it's where it'd land before it; the start of the row below its own, a
     * break before it (see `breakRowsAt`), unless it's there.
     */
    const overAt = (range: GridRange, over: number): Slot => {
      if (!drag) return {};
      const { boxes, home, item, metrics, slot } = drag;
      const breakRows =
        range === home.slot.range &&
        !(slot.range && !isEmptyPlan(slot.plan) && slot.index === over)
          ? breakRowsAt(item, range, over, boxes, metrics, trial)
          : 0;
      if (breakRows) return { index: over, plan: breakPlan(breakRows), range };
      const isAfter = slot.range === range && slot.index <= over;
      return { index: isAfter ? over + 1 : over, range };
    };

    /**
     * Its container's cells without it (no placeholder, nothing added; see
     * `Plan`), measured once; then shown as it was.
     */
    const baseOf = (): ReadonlyMap<HTMLElement, Box> | undefined => {
      if (!drag) return undefined;
      if (drag.base) return drag.base;
      const { hole, home, item, placeholder, slot } = drag;
      reset();
      hole.remove();
      placeholder.remove();
      orderShown(home.container, {
        hole: undefined,
        holeAt: home.at,
        item,
        placeholder: undefined,
        slot: {},
      });
      placeBreaks(root);
      const base = boxesOf(home.container);
      base.delete(item);
      show(slot);
      drag.base = base;
      return base;
    };

    /**
     * On an empty unit (in a container's coordinates, its own range's; a
     * break's rows' too), it at the units under it (its top left): there,
     * by what's to be added (see `planAt`; its handle's `breaks`,
     * `spacers`). E.g. a cell put under another, beside a taller one.
     */
    const emptyAt = (
      range: GridRange,
      container: HTMLElement,
    ): Slot | undefined => {
      if (!drag || range !== drag.home.slot.range) return undefined;
      const { home, item, metrics } = drag;
      const handle = handleAt(item, range);
      if (
        item.dataset.gridPart === 'break' ||
        (!handle?.breaks && !handle?.spacers)
      ) {
        return undefined;
      }
      const base = baseOf();
      const own = drag.boxes.get(item);
      if (!base || !own) return undefined;
      const pitch = metrics.unit + metrics.gap;
      const unitOf = (box: Box): Unit => ({
        column: Math.round(box.left / pitch),
        columns: Math.round((box.width + metrics.gap) / pitch),
        row: Math.round((box.top - home.top) / pitch),
        rows: Math.round((box.height + metrics.gap) / pitch),
      });
      const members = membersOf(range, item);
      const cells = members
        .filter((element) => base.has(element))
        .map((element) => ({
          // (A break's rows as they are, not as shown.)
          breakRows:
            element.dataset.gridPart === 'break'
              ? Number.parseInt(
                  (drag?.resized?.element === element
                    ? drag.resized.rows
                    : element.dataset.gridRows) ?? '1',
                  10,
                ) || 1
              : undefined,
          element,
          unit: unitOf(base.get(element) as Box),
        }));
      const others = [...base]
        .filter(
          ([element]) =>
            !members.includes(element) &&
            element.dataset.gridPart !== 'break' &&
            element.dataset.gridPart !== 'break-fill',
        )
        .map(([, box]) => unitOf(box));
      // (Where its top left is, as dragged.)
      const at = item.getBoundingClientRect();
      const box = container.getBoundingClientRect();
      const span = unitOf(own);
      const planned = planAt({
        allows: { breaks: handle.breaks, spacers: handle.spacers },
        cells,
        columns: metrics.columns,
        item: { columns: span.columns, rows: span.rows },
        others,
        target: {
          column: Math.round((at.left - box.left) / pitch),
          row: Math.round((at.top - box.top - home.top) / pitch),
        },
      });
      return planned && { ...planned, range };
    };

    /**
     * Where it's taken as being (on screen): its first row's middle, as
     * dragged; wherever it's held, the item's what's placed (not the
     * pointer).
     */
    const anchorOf = (item: HTMLElement): readonly [number, number] => {
      const box = item.getBoundingClientRect();
      const unit = drag?.metrics.unit ?? box.height;
      return [
        box.left + box.width / 2,
        box.top + Math.min(box.height, unit) / 2,
      ] as const;
    };

    /** Where it is (see `anchorOf`): a gap, the one it's at, or none (see `move`). */
    const hit = (at: readonly [number, number]): Slot | undefined => {
      if (!drag) return undefined;
      const { item, ranges } = drag;
      for (const range of ranges) {
        const container = range.container();
        if (!container) continue;
        const box = container.getBoundingClientRect();
        const x = at[0] - box.left;
        const y = at[1] - box.top;
        if (x < 0 || y < 0 || x > box.width || y > box.height) continue;
        const shown = shownAt(range, container, x, y);
        if (shown) return shown;
        const members = membersOf(range, item);
        let over = members.findIndex((element) => isOn(element, x, y));
        const bottom = Math.max(
          0,
          ...members.map((element) => element.offsetTop + element.offsetHeight),
        );
        // (On an empty unit: there, by what's to be added.)
        if (over === -1 && range.part !== 'DropGroup' && y <= bottom) {
          const empty = emptyAt(range, container);
          if (empty) return empty;
        }
        // (Between cells, in a section's gutters: the nearest one.)
        if (over === -1 && range.part !== 'DropGroup' && y <= bottom) {
          const distances = members.map((element) => distanceTo(element, x, y));
          over = distances.indexOf(Math.min(...distances));
        }
        if (over !== -1) return overAt(range, over);
        // (Below its cells (its end row, see the CSS): at its end; a break
        // before it, if it'd otherwise stay in the last row.)
        if (range.part !== 'DropGroup') {
          const breakRows =
            range === drag.home.slot.range
              ? breakRowsAt(
                  item,
                  range,
                  members.length,
                  drag.boxes,
                  drag.metrics,
                  trial,
                )
              : 0;
          return {
            index: members.length,
            plan: breakRows ? breakPlan(breakRows) : undefined,
            range,
          };
        }
      }
      return undefined;
    };

    const move = (at: readonly [number, number]) => {
      if (!drag) return;
      drag.at = at;
      follow(at);
      const { home, movedAt, slot, unit } = drag;
      // (Where it can't go: home, where a release there puts it.)
      const next = hit(anchorOf(drag.item)) ?? home.slot;
      const isAway =
        !movedAt ||
        Math.hypot(at[0] - movedAt[0], at[1] - movedAt[1]) >=
          unit * dragHysteresis;
      if (!isAway || isSameSlot(next, slot)) {
        clearTimeout(drag.timer);
        drag.candidate = undefined;
        return;
      }
      if (drag.candidate && isSameSlot(next, drag.candidate)) return;
      clearTimeout(drag.timer);
      drag.candidate = next;
      drag.timer = window.setTimeout(() => {
        if (!drag?.candidate) return;
        show(drag.candidate);
        drag.candidate = undefined;
        drag.movedAt = drag.at;
      }, dragSettle);
    };

    /**
     * Each frame while dragging: near the scroller's top or bottom,
     * scrolling (and finding its place anew); following.
     */
    const tick = (time: number) => {
      if (!drag) return;
      const { bottom, top } = visibleEdgesOf(scroller, root);
      const delta = edgeScrollDelta(drag.at[1], top, bottom, elapsedOf(time));
      if (delta === 0) {
        follow(drag.at);
      } else {
        const before = scroller.scrollTop;
        scroller.scrollTop += delta;
        if (scroller.scrollTop === before) follow(drag.at);
        else move(drag.at);
      }
      if (drag) drag.frame = requestAnimationFrame(tick);
    };

    const begin = (item: HTMLElement, at: readonly [number, number]) => {
      const cell = cellOf.get(item);
      const container = item.parentElement;
      if (!cell || !container) return;
      const ranges = rangesOf(cell.handles());
      const isBreak = item.dataset.gridPart === 'break';
      const metrics = metricsOf(root);
      const { unit } = metrics;
      const boxes = boxesOf(container);
      const placeholder = document.createElement('div');
      placeholder.className = 'uikit-grid-placeholder';
      placeholder.dataset.gridPart = 'placeholder';
      const hole = document.createElement('div');
      hole.className = 'uikit-grid-placeholder';
      hole.dataset.gridPart = 'placeholder';
      hole.dataset.gridHole = '';
      // (The hole its shape too; a break's: a unit wide, its rows tall, as
      // it's dragged, its hole a unit.)
      const span = (property: string) =>
        item.style.getPropertyValue(property) || '1';
      const columns = isBreak ? '1' : span('--uikit-grid-item-columns');
      const rows = isBreak
        ? (item.dataset.gridRows ?? '1')
        : span('--uikit-grid-item-rows');
      // (A break's: a break to be, placed as one; see layout.ts.)
      if (isBreak) {
        placeholder.classList.add('uikit-grid-break-placeholder');
        placeholder.dataset.gridBreak = '';
        placeholder.dataset.gridRows = rows;
        placeholder.style.setProperty('--uikit-grid-break-rows', rows);
        placeholder.append(breakSign());
      }
      placeholder.style.setProperty('--uikit-grid-item-columns', columns);
      placeholder.style.setProperty('--uikit-grid-item-rows', rows);
      hole.style.setProperty('--uikit-grid-item-columns', columns);
      hole.style.setProperty('--uikit-grid-item-rows', isBreak ? '1' : rows);
      // (Taller than a row: its rows below its first shown fainter, see the
      // CSS.)
      placeholder.toggleAttribute('data-grid-tall', !isBreak && rows !== '1');
      hole.toggleAttribute('data-grid-tall', !isBreak && rows !== '1');
      const { offsetHeight, offsetLeft, offsetTop, offsetWidth } = item;
      // (Its place among the others: as many before it.)
      const after = childrenOf(container, item).findIndex(
        (child) => byDocument(item, child) < 0,
      );
      const home = {
        at: after === -1 ? childrenOf(container, item).length : after,
        container,
        slot: homeOf(item, ranges),
        top: offsetTop,
      };
      const { left, top } = container.getBoundingClientRect();
      drag = {
        at,
        box: [left, top],
        boxes,
        containers: new Set(),
        frame: 0,
        hole,
        home,
        item,
        metrics,
        placeholder,
        ranges,
        shift: 0,
        slot: {},
        standIns: [[], []],
        start: at,
        timer: 0,
        trials: new Map(),
        unit,
      };
      // (Lifted: where it was, out of the flow; see the CSS.)
      dragged.current = item;
      Object.assign(item.style, {
        height: `${String(offsetHeight)}px`,
        left: `${String(offsetLeft)}px`,
        top: `${String(offsetTop)}px`,
        width: `${String(isBreak ? unit : offsetWidth)}px`,
      });
      item.dataset.gridDragging = '';
      show(home.slot);
      drag.frame = requestAnimationFrame(tick);
      if (!isBreak) return;
      // (A break: a unit, the pointer kept on it, gliding there; what moves
      // up into its row's rest not taken at once, as after a move.)
      drag.movedAt = at;
      const grabbed = at[0] - item.getBoundingClientRect().left;
      drag.shift = Math.max(0, grabbed - unit / 2);
      if (reduce.matches) return;
      item.animate(
        [{ width: `${String(offsetWidth)}px` }, { width: `${String(unit)}px` }],
        { duration: reflowDuration, easing: reflowEasing },
      );
      item.animate(
        [{ translate: `${String(-drag.shift)}px 0` }, { translate: '0 0' }],
        { composite: 'add', duration: reflowDuration, easing: reflowEasing },
      );
    };

    /** Dropped (or cancelled): back in the flow, moved, gliding there. */
    const end = (event: Event | undefined, isCancelled: boolean) => {
      if (pending) clearTimeout(pending.timer);
      pending = undefined;
      if (!drag) return;
      // (Released where it can't go: back where it was.)
      const isRefused =
        !isCancelled &&
        event instanceof PointerEvent &&
        hit(anchorOf(drag.item)) === undefined;
      reset();
      const { containers, frame, hole, home, item, placeholder, slot, timer } =
        drag;
      const isBreak = item.dataset.gridPart === 'break';
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      drag = undefined;
      // (Its own click held back, right after its release; no later one.)
      suppressClick = true;
      requestAnimationFrame(() => {
        suppressClick = false;
      });
      const held = item.getBoundingClientRect();
      const name = cellOf.get(item)?.name();
      const moved =
        !isCancelled && !isRefused && slot.range
          ? changeOf(item, slot)
          : undefined;
      placeholder.remove();
      hole.remove();
      for (const container of containers) {
        for (const child of container.children) {
          (child as HTMLElement).style.removeProperty('order');
        }
      }
      for (const property of ['height', 'left', 'top', 'translate', 'width']) {
        item.style.removeProperty(property);
      }
      delete item.dataset.gridDragging;
      placeBreaks(root);
      if (moved && event && !isSameSlot(slot, home.slot)) {
        moved.handle.onReorder?.(moved.change, { event, reason: 'drag' });
      }
      // (The app's render in: its element, maybe a new one, found by name.)
      requestAnimationFrame(() => {
        const element = item.isConnected ? item : byName(name);
        dragged.current = null;
        if (!element || reduce.matches) return;
        const now = element.getBoundingClientRect();
        element.animate(
          [
            {
              translate: `${String(held.left - now.left)}px ${String(held.top - now.top)}px`,
            },
            { translate: '0 0' },
          ],
          { composite: 'add', duration: reflowDuration, easing: reflowEasing },
        );
        if (isBreak && Math.abs(held.width - now.width) > 0.5) {
          element.animate(
            [
              { width: `${String(held.width)}px` },
              { width: `${String(now.width)}px` },
            ],
            { duration: reflowDuration, easing: reflowEasing },
          );
        }
      });
    };

    /** A cell moved by keyboard to the gap before or after (any range). */
    const step = (event: KeyboardEvent, item: HTMLElement, by: number) => {
      const cell = cellOf.get(item);
      if (!cell) return;
      const ranges = inDocumentOrder(rangesOf(cell.handles()));
      const home = homeOf(item, ranges);
      if (!home.range) return;
      // (In its own range, the start of the row below its last one too (or
      // of the row below all), by a break, after the gap there; see
      // `breakRowsAt`.)
      const boxes = item.parentElement
        ? boxesOf(item.parentElement)
        : new Map();
      const metrics = metricsOf(root);
      // (A trial: it shown at the gap, measured, shown in place again.)
      const container = item.parentElement;
      const keyTrial = (index: number): Trial | undefined => {
        const previous = home.range
          ? membersOf(home.range, item)[index - 1]
          : undefined;
        if (!container || !home.range || !previous) return undefined;
        orderShown(container, {
          hole: undefined,
          holeAt: 0,
          item,
          placeholder: item,
          slot: { index, range: home.range },
        });
        placeBreaks(root);
        const result = {
          bottom: bottomOf(container, [item]),
          landing: boxOf(item),
          previous: boxOf(previous),
        };
        for (const child of container.children) {
          (child as HTMLElement).style.removeProperty('order');
        }
        placeBreaks(root);
        return result;
      };
      const gaps = ranges.flatMap((range) =>
        Array.from(
          { length: membersOf(range, item).length + 1 },
          (_, index) => {
            const breakRows =
              range === home.range
                ? breakRowsAt(item, range, index, boxes, metrics, keyTrial)
                : 0;
            return breakRows
              ? [
                  { index, range },
                  { index, plan: breakPlan(breakRows), range },
                ]
              : [{ index, range }];
          },
        ).flat(),
      );
      const at = gaps.findIndex((gap) => isSameSlot(gap, home));
      const gap = gaps[at + by];
      if (at === -1 || !gap) return;
      const moved = changeOf(item, gap);
      if (!moved) return;
      event.preventDefault();
      const reason: GridReorderReason = 'keyboard';
      moved.handle.onReorder?.(moved.change, { event, reason });
      // (Moved to another section: its new element, found by name.)
      const name = cell.name();
      requestAnimationFrame(() =>
        (item.isConnected ? item : byName(name))?.focus(),
      );
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0) return;
      const target = event.target as Element | null;
      // (Not on an edit control, unless a drag from it is its cell's: e.g.
      // a remove button, a finger meant for the cell landing on it.)
      const control = target?.closest<HTMLElement>('[data-grid-edit-control]');
      if (control && !Object.hasOwn(control.dataset, 'gridDragThrough')) return;
      const item = movableOf(target);
      if (!item || !root.contains(item)) return;
      const isTouch = event.pointerType === 'touch';
      pending = {
        id: event.pointerId,
        item,
        ready: !isTouch,
        start: [event.clientX, event.clientY],
        timer: isTouch
          ? window.setTimeout(() => {
              if (pending) pending.ready = true;
            }, touchHold)
          : 0,
      };
    };

    const onPointerMove = (event: PointerEvent) => {
      const at = [event.clientX, event.clientY] as const;
      if (drag) {
        move(at);
        return;
      }
      if (pending?.id !== event.pointerId) return;
      const distance = Math.hypot(
        at[0] - pending.start[0],
        at[1] - pending.start[1],
      );
      if (distance < slop) return;
      // (A touch moving before its hold: a scroll, not a drag.)
      if (!pending.ready) {
        end(event, true);
        return;
      }
      const { item, start } = pending;
      pending = undefined;
      begin(item, start);
      move(at);
    };

    // (A touch dragging: the page not scrolled by it.)
    const onTouchMove = (event: TouchEvent) => {
      if (drag || pending?.ready) event.preventDefault();
    };

    const onPointerUp = (event: PointerEvent) => end(event, false);
    const onPointerCancel = (event: PointerEvent) => end(event, true);

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (target?.closest('[data-grid-edit-control]') && !suppressClick) return;
      suppressClick = false;
      if (target?.closest(cellSelector)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const item = event.target as HTMLElement | null;
      if (!event.altKey || !item || movableOf(item) !== item) return;
      const by = {
        ArrowDown: 1,
        ArrowLeft: -1,
        ArrowRight: 1,
        ArrowUp: -1,
      }[event.key];
      if (by !== undefined) step(event, item, by);
    };

    root.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerCancel);
    root.addEventListener('touchmove', onTouchMove, { passive: false });
    root.addEventListener('click', onClick, { capture: true });
    root.addEventListener('keydown', onKeyDown);

    return () => {
      end(undefined, true);
      root.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
      root.removeEventListener('touchmove', onTouchMove);
      root.removeEventListener('click', onClick, { capture: true });
      root.removeEventListener('keydown', onKeyDown);
    };
  }, [dragged, editing, rootRef]);
};
