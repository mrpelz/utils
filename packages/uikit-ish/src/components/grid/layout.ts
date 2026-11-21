import { RefObject, useLayoutEffect, useRef } from 'react';

import { reducedMotionOf } from '../utils/main.js';

// A grid's layout (see main.tsx): its columns and unit for a width, its
// breaks placed while editing, its items gliding as it changes.

/** A width's unit at some columns. */
export const unitOf = (width: number, gap: number, columns: number): number =>
  Math.max(0, (width - (columns - 1) * gap) / columns);

/**
 * A unit's range: from `min` to `max`, stretched to take in `target` (one
 * aimed for outside them still aimed for).
 */
export const unitRangeOf = (
  min: number,
  target: number,
  max: number,
): readonly [number, number] => [Math.min(min, target), Math.max(max, target)];

/**
 * The columns and unit for a width (see the top): the columns whose unit is
 * in range (see `unitRangeOf`) and nearest `target`; none in range, those
 * whose unit is nearest it. Never fewer than `minColumns` (its units
 * shrinking below the range then).
 */
export const layoutOf = (
  width: number,
  gap: number,
  min: number,
  target: number,
  max: number,
  minColumns: number,
): { columns: number; unit: number } => {
  const [low, high] = unitRangeOf(min, target, max);
  const fit = (unit: number) =>
    Math.max(1, Math.floor((width + gap) / (unit + gap)));
  // (How far a unit is from the range, then from the target.)
  const missOf = (unit: number) =>
    [Math.max(0, low - unit, unit - high), Math.abs(unit - target)] as const;
  let columns = 1;
  let best: readonly [number, number] | undefined;
  for (
    let count = Math.max(1, fit(high) - 1);
    count <= fit(low) + 1;
    count += 1
  ) {
    const miss = missOf(unitOf(width, gap, count));
    if (
      best &&
      (miss[0] > best[0] || (miss[0] === best[0] && miss[1] >= best[1]))
    ) {
      continue;
    }

    best = miss;
    columns = count;
  }
  columns = Math.max(columns, minColumns);
  return { columns, unit: unitOf(width, gap, columns) };
};

export const reflowDuration = 300;
export const reflowEasing = 'cubic-bezier(0.32, 0.72, 0, 1)';

// (A tile in its area too (see main.tsx): re-centered in it as it's resized,
// gliding there, within its cell, carried by it.)
// (Not a break: drawn where it's placed at once (its shape by its row's
// layout, see `placeBreaks`), not gliding apart from it.)
const glidingSelector =
  ':scope > [data-grid-part="section"], :scope [data-grid-part="item"], :scope [data-grid-part="spacer"], :scope [data-grid-part="body"]';

/** Its own children in the order they're shown (CSS `order`, else DOM). */
const shownOrder = (container: Element) =>
  Array.from(container.children)
    .filter((element): element is HTMLElement => element instanceof HTMLElement)
    .map((element, index) => ({
      element,
      index,
      order: Number.parseInt(element.style.order || '0', 10) || 0,
    }))
    .toSorted((a, b) => a.order - b.order || a.index - b.index)
    .map(({ element }) => element);

/** A break, or a break to be (a dragged cell's, see edit.ts). */
const isBreak = (element: HTMLElement) =>
  element.dataset.gridPart === 'break' ||
  Object.hasOwn(element.dataset, 'gridBreak');

/** A break's rows (see `Break`). */
const rowsOf = (element: HTMLElement) =>
  Number.parseInt(element.dataset.gridRows ?? '1', 10) || 1;

/**
 * Its fillers: what keeps the rows below a break of more than one row
 * empty (see `placeBreaks`), right after it (in the DOM, in the order
 * shown).
 */
const fills = new WeakMap<HTMLElement, HTMLElement[]>();

/** A break's fillers (none: none). */
export const fillsOf = (element: HTMLElement): readonly HTMLElement[] =>
  fills.get(element) ?? [];

/** A style property set (unset: `undefined`), only if it changes. */
const setStyle = (
  element: HTMLElement,
  property: string,
  value: string | undefined,
) => {
  if (value === undefined) {
    if (element.style.getPropertyValue(property)) {
      element.style.removeProperty(property);
    }
  } else if (element.style.getPropertyValue(property) !== value) {
    element.style.setProperty(property, value);
  }
};

/**
 * A grid's measures (see main.tsx), px: its columns' width (narrower than
 * its rows are tall while editing, its end-of-line column beside them),
 * its rows' (`unit`), the gap, that column's width (none: 0).
 */
export type Metrics = {
  column: number;
  columns: number;
  end: number;
  gap: number;
  /** The most rows a tile has, a break keeps (see `maxTileRows`). */
  maxRows: number;
  unit: number;
};

/** A grid's measures (see `Metrics`), read off its root. */
export const metricsOf = (element: Element): Metrics => {
  const root = element.closest('.uikit-grid-root') ?? element;
  const styles = getComputedStyle(root);
  const value = (property: string, fallback: number) =>
    Number.parseFloat(styles.getPropertyValue(property)) || fallback;
  const unit = value('--uikit-grid-unit', 110);
  return {
    column: value('--uikit-grid-column', unit),
    columns: value('--uikit-grid-columns', 1),
    end: value('--uikit-grid-end', 0),
    gap: value('--uikit-grid-gap', 0),
    maxRows: value('--uikit-grid-max-rows', 3),
    unit,
  };
};

/**
 * A full width's part of the end-of-line column, editing (see
 * `fullClipOf`): its first row's upper half (px, as tall), the rest of it
 * a break's after it (see `breakPlace`).
 */
const fullHalfOf = ({ gap, unit }: Pick<Metrics, 'gap' | 'unit'>) =>
  (unit - gap) / 2;

/** A box, by its edges (px). */
type Rect = { bottom: number; left: number; right: number; top: number };

const rectOf = (element: HTMLElement): Rect => ({
  bottom: element.offsetTop + element.offsetHeight,
  left: element.offsetLeft,
  right: element.offsetLeft + element.offsetWidth,
  top: element.offsetTop,
});

/** An SVG mask's image (a CSS `url()`): its paths, filled or outlined. */
const maskOf = (
  width: number,
  height: number,
  paths: readonly (readonly [path: string, paint: string])[],
) => {
  const size = `width="${String(width)}" height="${String(height)}" viewBox="0 0 ${String(width)} ${String(height)}"`;
  const inner = paths
    .map(([path, paint]) => `<path d="${path}" ${paint}/>`)
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" ${size}>${inner}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

/**
 * A break's shape (see `placeIn`, the CSS), from its first row's start
 * (`from` columns before it) to the grid's end (through its end-of-line
 * column, while editing): its first rows (`stem`, one by default) from
 * where it starts (`top` px down: after a full width, below its part of
 * that column), its rows below from their start, every corner rounded
 * (the inner one too). Mirrored when right to left. An SVG path (px), for
 * a `clip-path` (drawn at once, no image to decode) or a mask.
 */
export const breakPath = (
  { column, gap, unit }: Pick<Metrics, 'column' | 'gap' | 'unit'>,
  {
    from,
    isRtl,
    radius,
    rows,
    stem = 1,
    top = 0,
    width,
  }: {
    from: number;
    isRtl: boolean;
    radius: number;
    rows: number;
    stem?: number;
    top?: number;
    /** Its container's, its end-of-line column's too (px). */
    width: number;
  },
): string => {
  const pitch = unit + gap;
  const height = rows * pitch - gap;
  const start = from * (column + gap);
  const isStem = rows <= stem || start === 0;
  const head = start > 0 ? top : 0;
  const below = stem * pitch;
  // (Its corners no rounder than its narrowest part: a first row only in
  // its end-of-line column, too; its part there, below a full width's.)
  const r = Math.min(
    radius,
    Math.min(column, unit) / 2,
    start > 0 ? (width - start) / 2 : Number.POSITIVE_INFINITY,
    ((isStem ? height : below - gap) - head) / 2,
  );
  const x = (value: number) => String(isRtl ? width - value : value);
  const y = String;
  const arc = (sweep: 0 | 1, ax: number, ay: number) =>
    `A${y(r)} ${y(r)} 0 0 ${String(isRtl ? 1 - sweep : sweep)} ${x(ax)} ${y(ay)}`;
  const box = (left: number) =>
    [
      `M${x(left + r)} ${y(head)}H${x(width - r)}`,
      arc(1, width, head + r),
      `V${y(height - r)}`,
      arc(1, width - r, height),
      `H${x(left + r)}`,
      arc(1, left, height - r),
      `V${y(head + r)}`,
      arc(1, left + r, head),
      'Z',
    ].join('');
  const path = isStem
    ? box(rows <= stem ? start : 0)
    : [
        `M${x(start + r)} ${y(head)}H${x(width - r)}`,
        arc(1, width, head + r),
        `V${y(height - r)}`,
        arc(1, width - r, height),
        `H${x(r)}`,
        arc(1, 0, height - r),
        `V${y(below + r)}`,
        arc(1, r, below),
        `H${x(start - r)}`,
        arc(0, start, below - r),
        `V${y(head + r)}`,
        arc(1, start + r, head),
        'Z',
      ].join('');
  return path;
};

/**
 * A break's resize outline at some rows (see main.tsx, the CSS): its shape
 * (see `breakPath`) as it'd be, through the end-of-line column, filled
 * faintly and edged inside (a mask); where it goes from the break's own
 * box (px).
 */
export const breakOutlineOf = (
  element: HTMLElement,
  rows: number,
): {
  height: number;
  mask: string;
  start: number;
  top: number;
  width: number;
} => {
  const container = element.parentElement;
  const metrics = metricsOf(element);
  const styles = getComputedStyle(element);
  const isNone = Object.hasOwn(element.dataset, 'gridBreakNone');
  // (Its rows in the end-of-line column first (see `breakPlace`): after a
  // full width, below its part of it.)
  const stem = Number(element.dataset.gridBreakStem ?? 1) || 1;
  const head = Object.hasOwn(element.dataset, 'gridBreakAfterFull')
    ? fullHalfOf(metrics) + metrics.gap
    : 0;
  const pitch = metrics.unit + metrics.gap;
  const above = isNone
    ? 0
    : Number.parseFloat(styles.getPropertyValue('--uikit-grid-break-above')) ||
      0;
  const from =
    above > 0 || isNone
      ? metrics.columns
      : Number.parseFloat(styles.getPropertyValue('--uikit-grid-break-from')) ||
        0;
  const width = container?.clientWidth ?? 0;
  const height = rows * pitch - metrics.gap;
  const isRtl = styles.direction === 'rtl';
  const path = breakPath(metrics, {
    from,
    isRtl,
    radius:
      Number.parseFloat(styles.getPropertyValue('--uikit-grid-item-radius')) ||
      24,
    rows,
    stem,
    top: head,
    width,
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${String(width)}" height="${String(height)}"><clipPath id="c"><path d="${path}"/></clipPath><path d="${path}" fill="#000" fill-opacity="0.15"/><path d="${path}" fill="none" stroke="#000" stroke-width="4" clip-path="url(#c)"/></svg>`;
  return {
    height,
    // (From its container's inline start.)
    start: -(isRtl
      ? width - element.offsetLeft - element.offsetWidth
      : element.offsetLeft),
    mask: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
    // (Taking no room: its box from its first row's top (after a full
    // width, below that one's part of the end-of-line column).)
    top: isNone ? -head : -above * pitch,
    width,
  };
};

/** Free columns in a row, one after another (`to`: past the last). */
type Run = { from: number; to: number };

/**
 * A row's free runs (by its middle, px), from a column on, by what's
 * before (their boxes).
 */
const freeRuns = (
  y: number,
  from: number,
  before: readonly HTMLElement[],
  { column: width, columns, gap }: Metrics,
): Run[] => {
  const pitch = width + gap;
  const runs: Run[] = [];
  let start: number | undefined;
  for (let column = from; column <= columns; column += 1) {
    const x = column * pitch + width / 2;
    const isTaken =
      column === columns ||
      before.some(
        (other) =>
          other.offsetTop < y &&
          other.offsetTop + other.offsetHeight > y &&
          other.offsetLeft < x &&
          other.offsetLeft + other.offsetWidth > x,
      );
    if (!isTaken) {
      start ??= column;
      continue;
    }
    if (start === undefined) continue;
    runs.push({ from: start, to: column });
    start = undefined;
  }
  return runs;
};

/** A break's last row kept empty, by its middle (px; see `breakPlace`). */
const keptRows = new WeakMap<HTMLElement, number>();

/** Where a break goes (see `breakPlace`). */
type BreakPlace =
  | {
      /**
       * Rows drawn above it (its first row full: in that row's end-of-line
       * column, see `breakShape`).
       */
      above: number;
      column: string;
      /** Its rows drawn (its first in the row below the one before it). */
      drawn: number;
      fills: Run[];
      from: number;
      /** Where its resize handle goes, by its end (columns on). */
      handle: number;
      /**
       * Where its rows above start (px down): after a full width, below
       * its part of the end-of-line column (see `fullHalfOf`).
       */
      head: number;
      kind: 'cell';
      rest: number;
      /** Where its return sign goes, the same way. */
      sign: number;
    }
  /**
   * Nothing kept empty (no room left in its row, nor in those rows below
   * it that what's before it fills; see `breakPlace`): taking no room;
   * while editing, in its row's end-of-line column, as tall as its rows
   * (its top, its height, px; after a full width, below its part of
   * it).
   */
  | {
      head: number;
      height: number;
      kind: 'none';
      /** The rows filled from their start to their end, from its first. */
      stem: number;
      top: number;
    };

/**
 * Where a break goes: in the row of the one before it (after a break: the
 * row after the last it keeps empty, from its start; first: the row above
 * the first), from the first free unit after it to what's in the way
 * (else its row's end); fillers in that row's other free runs on, and in
 * the rows below it (its rows less one), so what follows starts below it.
 * No room left in that row: in the row below, its rows there and below
 * (one less) kept empty the same way, drawn from that row's end-of-line
 * column (see `breakShape`); one row only, it keeps nothing
 * empty, so it takes no room (drawn in that row's end-of-line column while
 * editing). The same while editing or not. Its sign and handle at its
 * rows' end (in the end-of-line column, where nothing is in the way).
 */
const breakPlace = (
  element: HTMLElement,
  previous: HTMLElement | undefined,
  before: readonly HTMLElement[],
  metrics: Metrics & { origin: number },
): BreakPlace => {
  const pitch = metrics.unit + metrics.gap;
  const rows = rowsOf(element);
  const isCell = previous !== undefined && !isBreak(previous);
  // (After a break: from the row after the last it keeps empty, its rows
  // adding to that one's, as they're merged on Done.)
  let y = metrics.origin - pitch;
  let start = metrics.columns;
  if (previous) {
    const row = previous.offsetTop + metrics.unit / 2;
    y = isCell ? row : (keptRows.get(previous) ?? row) + pitch;
    start = isCell
      ? Math.round(
          (previous.offsetLeft + previous.offsetWidth + metrics.gap) /
            (metrics.column + metrics.gap),
        )
      : 0;
  }
  const below = (from: number, count: number) =>
    Array.from({ length: Math.max(0, count) }, (_, row) =>
      freeRuns(y + (from + row) * pitch, 0, before, metrics),
    ).flat();
  keptRows.set(element, y + (rows - 1) * pitch);
  const isAfterFull = isCell && Object.hasOwn(previous.dataset, 'gridFull');
  const [first, ...rest] = isAfterFull
    ? []
    : freeRuns(y, start, before, metrics);
  if (first) {
    return {
      above: 0,
      column: `${String(first.from + 1)} / ${String(first.to + 1)}`,
      drawn: rows,
      fills: [...rest, ...below(1, rows - 1)],
      from: first.from,
      handle: metrics.columns - first.to,
      head: 0,
      kind: 'cell',
      rest: metrics.columns - first.to,
      sign: metrics.columns - first.to,
    };
  }
  // (No room left in its row (a full width's ends it anyway): in the
  // end-of-line column, down the rows below filled from their start to
  // their end too (a full width's, a tall tile's at its row's end); after
  // a full width, below its part of that column (see `fullHalfOf`). No
  // taller: keeping nothing empty. Taller: the rows after them too, from
  // their first free unit on.)
  const head = isAfterFull ? fullHalfOf(metrics) + metrics.gap : 0;
  let stem = 1;
  while (
    stem < metrics.maxRows &&
    freeRuns(y + stem * pitch, 0, before, metrics).length === 0
  ) {
    stem += 1;
  }
  const [next, ...others] =
    rows > stem ? freeRuns(y + stem * pitch, 0, before, metrics) : [];
  if (!next) {
    keptRows.set(element, y + (stem - 1) * pitch);
    // (First in its container (keeping nothing: one row): shown in its
    // first row's end-of-line column, not above it.)
    return {
      head,
      height: rows * pitch - metrics.gap - head,
      kind: 'none',
      stem,
      top: (previous ? y : y + pitch) - metrics.unit / 2 + head,
    };
  }
  return {
    above: stem,
    column: `${String(next.from + 1)} / ${String(next.to + 1)}`,
    drawn: rows - stem,
    fills: [...others, ...below(stem + 1, rows - stem - 1)],
    from: next.from,
    handle: metrics.columns - next.to,
    head,
    kind: 'cell',
    rest: metrics.columns - next.to,
    sign: metrics.columns - next.to,
  };
};

/**
 * A break's fillers (see `breakPlace`), one row each, right after it (in
 * the DOM; in the order shown, by its own `order`). Kept (`kept`); remade
 * only as they change.
 */
const fillIn = (
  element: HTMLElement,
  runs: readonly Run[],
  kept: Set<HTMLElement>,
) => {
  const own = fills.get(element) ?? [];
  while (own.length > runs.length) own.pop()?.remove();
  while (own.length < runs.length) {
    const fill = document.createElement('div');
    fill.className = 'uikit-grid-break-fill';
    fill.dataset.gridPart = 'break-fill';
    fill.setAttribute('aria-hidden', 'true');
    own.push(fill);
  }
  fills.set(element, own);
  for (const [index, { from, to }] of runs.entries()) {
    const fill = own[index];
    if (!fill) continue;
    kept.add(fill);
    setStyle(fill, 'grid-column', `${String(from + 1)} / ${String(to + 1)}`);
    setStyle(fill, 'order', element.style.order || undefined);
  }
  // (Right after it, in order.)
  let last: Element = element;
  for (const fill of own) {
    if (last.nextElementSibling !== fill) last.after(fill);
    last = fill;
  }
};

/**
 * A break's place (see `breakPlace`) on it: its cell, where it's drawn
 * from and to, its shape (see the CSS). A break to be: faint (`isFaint`).
 */
const styleBreak = (
  element: HTMLElement,
  place: BreakPlace,
  metrics: Metrics & {
    isFaint: boolean;
    isRtl: boolean;
    radius: number;
    width: number;
  },
) => {
  const isNone = place.kind === 'none';
  element.toggleAttribute('data-grid-break-none', isNone);
  // (After a full width: below its part of the end-of-line column, its
  // return sign in the half there, see the CSS; its rows there first.)
  element.toggleAttribute('data-grid-break-after-full', place.head > 0);
  const stem = isNone ? place.stem : place.above;
  if (stem > 0) {
    element.dataset.gridBreakStem = String(stem);
  } else {
    delete element.dataset.gridBreakStem;
  }
  setStyle(
    element,
    '--uikit-grid-break-none-height',
    isNone ? `${String(place.height)}px` : undefined,
  );
  setStyle(
    element,
    '--uikit-grid-break-head',
    isNone || place.head === 0 ? undefined : `${String(place.head)}px`,
  );
  setStyle(
    element,
    '--uikit-grid-break-above',
    isNone || place.above === 0 ? undefined : String(place.above),
  );
  setStyle(element, 'grid-column', isNone ? undefined : place.column);
  setStyle(
    element,
    '--uikit-grid-break-top',
    isNone ? `${String(place.top)}px` : undefined,
  );
  // (Where it starts, and the columns after it: drawn from its row's
  // start to the grid's end, see style.css.)
  setStyle(
    element,
    '--uikit-grid-break-from',
    isNone ? undefined : String(place.from),
  );
  setStyle(
    element,
    '--uikit-grid-break-rest',
    isNone ? undefined : String(place.rest),
  );
  setStyle(
    element,
    '--uikit-grid-break-drawn',
    isNone ? undefined : String(place.drawn),
  );
  setStyle(
    element,
    '--uikit-grid-break-handle',
    isNone ? undefined : String(place.handle),
  );
  setStyle(
    element,
    '--uikit-grid-break-sign',
    isNone ? undefined : String(place.sign),
  );
  setStyle(
    element,
    '--uikit-grid-break-shape',
    isNone
      ? undefined
      : `path("${breakPath(metrics, {
          from: place.above > 0 ? metrics.columns : place.from,
          isRtl: metrics.isRtl,
          radius: metrics.radius,
          rows: place.drawn + place.above,
          stem: Math.max(1, place.above),
          top: place.head,
          width: metrics.width,
        })}")`,
  );
  // (A break to be, of more rows: those below its first fainter.)
  setStyle(
    element,
    '--uikit-grid-break-fade',
    !isNone && metrics.isFaint && place.drawn + place.above > 1
      ? `${String(metrics.unit)}px`
      : undefined,
  );
};

/**
 * A container's breaks placed (see `placeBreaks`), in the order shown, what
 * comes before each measured.
 */
const placeIn = (
  container: HTMLElement,
  metrics: Metrics & { isRtl: boolean; radius: number },
  kept: Set<HTMLElement>,
) => {
  const before: HTMLElement[] = [];
  let previous: HTMLElement | undefined;
  // (Its first row's middle: below its header.)
  const header = container.querySelector<HTMLElement>(
    ':scope > [data-grid-part="header"]',
  );
  const origin =
    (header ? header.offsetTop + header.offsetHeight + metrics.gap : 0) +
    metrics.unit / 2;
  for (const element of shownOrder(container)) {
    const part = element.dataset.gridPart;
    // (Dragged: out of the flow, its placeholder in it; see edit.ts.)
    if (Object.hasOwn(element.dataset, 'gridDragging')) continue;
    if (part === 'break-fill') {
      before.push(element);
      continue;
    }
    if (
      part !== 'item' &&
      part !== 'spacer' &&
      part !== 'break' &&
      part !== 'placeholder'
    ) {
      continue;
    }
    if (isBreak(element)) {
      const place = breakPlace(element, previous, before, {
        ...metrics,
        origin,
      });
      const isNone = place.kind === 'none';
      styleBreak(element, place, {
        ...metrics,
        isFaint: part === 'placeholder',
        width: container.clientWidth,
      });
      fillIn(element, isNone ? [] : place.fills, kept);
      // (Taking no room: not what the next is placed after, nor in the
      // way.)
      if (isNone) {
        previous = element;
        continue;
      }
    }
    before.push(element);
    previous = element;
  }
};

/**
 * A full width's shape, editing (see the CSS): what's past its last
 * column, in the end-of-line column, cut away below its first row's upper
 * half (see `fullHalfOf`), the corners left rounded (the inner one too),
 * on below it. Mirrored when right to left. A `clip-path` (px,
 * for something in it at `offset` from its top left: its hatch, what its
 * tile shows; even-odd: all around it, less the cut).
 */
const fullClipOf = (
  cell: HTMLElement,
  metrics: Metrics & { isRtl: boolean; radius: number },
  [dx, dy]: readonly [number, number] = [0, 0],
) => {
  const width = cell.offsetWidth;
  const height = cell.offsetHeight;
  const half = fullHalfOf(metrics);
  const strip = metrics.end + metrics.gap;
  const last = width - strip;
  const r = Math.min(metrics.radius, strip / 2, half / 2);
  const far = 10_000;
  const x = (value: number) =>
    String((metrics.isRtl ? width - value : value) - dx);
  const y = (value: number) => String(value - dy);
  const arc = (sweep: 0 | 1, ax: number, ay: number) =>
    `A${String(r)} ${String(r)} 0 0 ${String(metrics.isRtl ? 1 - sweep : sweep)} ${x(ax)} ${y(ay)}`;
  const around = `M${x(-far)} ${y(-far)}H${x(width + far)}V${y(height + far)}H${x(-far)}Z`;
  const cut = [
    `M${x(last + r)} ${y(half)}H${x(width - r)}`,
    arc(0, width, half - r),
    // (On past its bottom: no sliver of it left there, its edge however
    // it's rounded to pixels.)
    `H${x(width + far)}V${y(height + far)}H${x(last - r)}V${y(height)}`,
    arc(0, last, height - r),
    `V${y(half + r)}`,
    arc(1, last + r, half),
    'Z',
  ].join('');
  return `path(evenodd, "${around}${cut}")`;
};

/**
 * A full width's shape, editing (see `fullClipOf`), as a closed SVG path
 * (px) of its box at a height: its columns, and its end-of-line column's
 * part, every corner rounded (the inner one too). Mirrored when right to
 * left.
 */
const fullPathOf = (
  metrics: Metrics & { isRtl: boolean; radius: number },
  width: number,
  height: number,
  // (Its edge `inset` px in: the same shape, its outer corners less round,
  // its inner one rounder.)
  inset = 0,
) => {
  const { isRtl } = metrics;
  const half = fullHalfOf(metrics);
  const last = width - metrics.end - metrics.gap;
  const outer = Math.min(metrics.radius, (width - last) / 2, half / 2);
  const r = Math.max(0, outer - inset);
  const ri = outer + inset;
  const [left, top, right, bottom] = [
    inset,
    inset,
    width - inset,
    height - inset,
  ];
  const [notch, column] = [half - inset, last - inset];
  const x = (value: number) => String(isRtl ? width - value : value);
  const arc = (radius: number, sweep: 0 | 1, ax: number, ay: number) =>
    `A${String(radius)} ${String(radius)} 0 0 ${String(isRtl ? 1 - sweep : sweep)} ${x(ax)} ${String(ay)}`;
  return [
    `M${x(left + r)} ${String(top)}H${x(right - r)}`,
    arc(r, 1, right, top + r),
    `V${String(notch - r)}`,
    arc(r, 1, right - r, notch),
    `H${x(column + ri)}`,
    arc(ri, 0, column, notch + ri),
    `V${String(bottom - r)}`,
    arc(r, 1, column - r, bottom),
    `H${x(left + r)}`,
    arc(r, 1, left, bottom - r),
    `V${String(top + r)}`,
    arc(r, 1, left + r, top),
    'Z',
  ].join('');
};

/** A cell's metrics for its full width's shape (see `fullPathOf`). */
const shapeMetricsOf = (cell: HTMLElement) => {
  const styles = getComputedStyle(cell);
  return {
    ...metricsOf(cell),
    isRtl: styles.direction === 'rtl',
    radius:
      Number.parseFloat(styles.getPropertyValue('--uikit-grid-item-radius')) ||
      24,
  };
};

/**
 * A path's edge, inside it, as a mask (a CSS `url()`; `width` px wide, in
 * a box as big), filled faintly too (`fill`, 0: not).
 */
const edgeMaskOf = (
  path: string,
  [width, height]: readonly [number, number],
  { fill = 0, line }: { fill?: number; line: number },
) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${String(width)}" height="${String(height)}"><clipPath id="c"><path d="${path}"/></clipPath>${fill > 0 ? `<path d="${path}" fill="#000" fill-opacity="${String(fill)}"/>` : ''}<path d="${path}" fill="none" stroke="#000" stroke-width="${String(line * 2)}" clip-path="url(#c)"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

/**
 * A full width's resize outline at some rows (see main.tsx, the CSS): its
 * shape as it'd be (see `fullPathOf`; a break's, see `breakOutlineOf`),
 * filled faintly and edged inside (a mask), from its top left (px); none
 * while there's no end-of-line column.
 */
export const fullOutlineOf = (
  cell: HTMLElement,
  rows: number,
): { height: number; mask: string; width: number } | undefined => {
  const metrics = shapeMetricsOf(cell);
  if (metrics.end < 1) return undefined;
  const width = cell.offsetWidth;
  const height = rows * (metrics.unit + metrics.gap) - metrics.gap;
  const path = fullPathOf(metrics, width, height);
  return {
    height,
    mask: edgeMaskOf(path, [width, height], { fill: 0.15, line: 2 }),
    width,
  };
};

/** Cells shaped (see `shapeFulls`), to unshape once they're not. */
const shaped = new WeakMap<HTMLElement, Set<HTMLElement>>();

/** A cell's shapes (see `shapeFulls`) set, or unset (`undefined`). */
const shapeCell = (
  cell: HTMLElement,
  metrics: (Metrics & { isRtl: boolean; radius: number }) | undefined,
) => {
  setStyle(
    cell,
    '--uikit-grid-full-shape',
    metrics ? fullClipOf(cell, metrics) : undefined,
  );
  // (An area's room's edge (see main.tsx, the CSS): in its shape.)
  const size = [cell.offsetWidth, cell.offsetHeight] as const;
  // (Set before it's shown: a full width's, whether it has room or not
  // yet, so an area's edge is in its shape from its first frame.)
  setStyle(
    cell,
    '--uikit-grid-full-edge',
    // (A clip, as the shape's: drawn at once, no image to decode.)
    metrics
      ? `path(evenodd, "${fullPathOf(metrics, ...size)}${fullPathOf(metrics, ...size, 1.5)}")`
      : undefined,
  );
  const body = cell.querySelector<HTMLElement>(
    ':scope > [data-grid-part="body"]',
  );
  if (!body) return;
  setStyle(
    body,
    '--uikit-grid-body-shape',
    metrics
      ? fullClipOf(cell, metrics, [body.offsetLeft, body.offsetTop])
      : undefined,
  );
  // (How far its tile runs past the last column (a full-width tile, one
  // in a trailing corner): its trailing controls in by as much, clear of
  // the cut (see the CSS); its ring only where it'd be in the cut, below
  // its first row's upper half.)
  const strip = metrics ? metrics.end + metrics.gap : 0;
  const overhang = metrics
    ? Math.max(
        0,
        metrics.isRtl
          ? strip - body.offsetLeft
          : body.offsetLeft + body.offsetWidth - (cell.offsetWidth - strip),
      )
    : 0;
  const ring = body.querySelector<HTMLElement>(
    ':scope > .uikit-grid-move-sign',
  );
  const isRingCut =
    metrics !== undefined &&
    body.offsetTop + (ring?.offsetHeight ?? 44) > fullHalfOf(metrics);
  setStyle(
    body,
    '--uikit-grid-body-overhang',
    overhang > 0 ? `${String(overhang)}px` : undefined,
  );
  setStyle(
    body,
    '--uikit-grid-body-overhang-top',
    overhang > 0 && isRingCut ? `${String(overhang)}px` : undefined,
  );
};

/**
 * Its full widths shaped while editing (see `fullClipOf`), else not; one
 * no longer a full width (e.g. its area resized to fixed columns), or no
 * longer in it, unshaped. Shaped: its hatch (an area's room), and what
 * its tile shows (by its tile's place in it): a full-width tile in a
 * full-width area, too, shows past its last column only where its area
 * does (its handle at that column's corner, see the CSS). Not the cell
 * itself, nor its tile: their resize outlines whole (a full width's in
 * its shape, see `fullOutlineOf`).
 */
const shapeFulls = (root: HTMLElement) => {
  const fulls = root.querySelectorAll<HTMLElement>(
    '[data-grid-part="item"][data-grid-full]',
  );
  const before = shaped.get(root) ?? new Set<HTMLElement>();
  const now = new Set(fulls);
  for (const cell of before) {
    if (!now.has(cell)) shapeCell(cell, undefined);
  }
  shaped.set(root, now);
  if (fulls.length === 0) return;
  const styles = getComputedStyle(root);
  const metrics = {
    ...metricsOf(root),
    isRtl: styles.direction === 'rtl',
    radius:
      Number.parseFloat(styles.getPropertyValue('--uikit-grid-item-radius')) ||
      24,
  };
  const isShaped = Object.hasOwn(root.dataset, 'editing') && metrics.end >= 1;
  for (const cell of fulls) {
    shapeCell(cell, isShaped ? metrics : undefined);
  }
};

/**
 * Its breaks as cells (see `breakPlace`): in the order shown, one after
 * another (each placed, the next measured), as tall as their rows (see the
 * CSS); not editing, not drawn (keeping nothing empty: none). Not one
 * dragged.
 * Fillers no longer needed removed.
 */
export const placeBreaks = (root: HTMLElement): void => {
  shapeFulls(root);
  const kept = new Set<HTMLElement>();
  const breaks = Array.from(
    root.querySelectorAll<HTMLElement>(
      '[data-grid-part="break"], [data-grid-break]',
    ),
  );
  for (const element of breaks) {
    if (!Object.hasOwn(element.dataset, 'gridDragging')) continue;
    setStyle(element, 'grid-column', undefined);
    setStyle(element, '--uikit-grid-break-from', undefined);
    setStyle(element, '--uikit-grid-break-rest', undefined);
    setStyle(element, '--uikit-grid-break-shape', undefined);
    setStyle(element, '--uikit-grid-break-fade', undefined);
    setStyle(element, '--uikit-grid-break-drawn', undefined);
    setStyle(element, '--uikit-grid-break-handle', undefined);
    setStyle(element, '--uikit-grid-break-sign', undefined);
    setStyle(element, '--uikit-grid-break-top', undefined);
    setStyle(element, '--uikit-grid-break-above', undefined);
    setStyle(element, '--uikit-grid-break-none-height', undefined);
    setStyle(element, '--uikit-grid-break-head', undefined);
    delete element.dataset.gridBreakNone;
    delete element.dataset.gridBreakAfterFull;
    delete element.dataset.gridBreakStem;
  }
  if (breaks.length > 0) {
    const styles = getComputedStyle(root);
    const metrics = {
      ...metricsOf(root),
      isRtl: styles.direction === 'rtl',
      radius:
        Number.parseFloat(
          styles.getPropertyValue('--uikit-grid-item-radius'),
        ) || 24,
    };
    const containers = new Set(breaks.map((element) => element.parentElement));
    for (const container of containers) {
      if (container) placeIn(container, metrics, kept);
    }
  }
  for (const fill of root.querySelectorAll<HTMLElement>(
    '[data-grid-part="break-fill"]',
  )) {
    if (!kept.has(fill)) fill.remove();
  }
};

/** Its page: the nearest ancestor clipping or scrolling (else none). */
const pages = new WeakMap<HTMLElement, Element | null>();
const pageOf = (root: HTMLElement) => {
  let page = pages.get(root);
  if (page === undefined || (page && !page.contains(root))) {
    page = root.parentElement;
    while (page && getComputedStyle(page).overflowX === 'visible') {
      page = page.parentElement;
    }
    pages.set(root, page);
  }
  return page;
};

const bandProperties = [
  '--uikit-grid-bands',
  '--uikit-grid-bands-end',
  '--uikit-grid-bands-height',
  '--uikit-grid-bands-start',
  '--uikit-grid-bands-top',
];

/** A band's line (px), and how far it's drawn around its rows' boxes. */
const bandLine = 1.5;
const bandOffset = 4;

/**
 * A container's rows' outline, one band, as reading goes (an SVG path, in
 * px): its first row from the grid's start (rounded) on to the trailing
 * edge (`end` past the grid's), the rows between from the leading edge
 * (`start` before the grid's) to the trailing, its last from the leading
 * to the grid's end (rounded); one row: a rounded box. Mirrored when
 * right to left.
 */
const bandsPath = ({
  end,
  isRtl,
  offset,
  pitch,
  radius,
  rows,
  start,
  unit,
  width,
}: {
  end: number;
  isRtl: boolean;
  offset: number;
  pitch: number;
  radius: number;
  rows: number;
  start: number;
  unit: number;
  width: number;
}) => {
  const all = start + width + end;
  // (Around its rows' boxes by `offset` (the image as much past its first
  // and last rows), inside that by half its line; its corners concentric
  // with theirs.)
  const h = bandLine / 2;
  const r = Math.max(0, Math.min(radius, unit / 2) + offset - h);
  const from = Math.max(h, start - offset + h);
  const to = Math.min(all - h, start + width + offset - h);
  const x = (value: number) => String(isRtl ? all - value : value);
  const sweep = (value: 0 | 1) => String(isRtl ? 1 - value : value);
  const arc = (value: 0 | 1, ax: number, ay: number) =>
    `A${String(r)} ${String(r)} 0 0 ${sweep(value)} ${x(ax)} ${String(ay)}`;
  const line = (y: number) => `M${x(0)} ${String(y)}H${x(all)}`;
  const parts: string[] = [];
  for (let row = 0; row < rows; row += 1) {
    const top = row * pitch + h;
    const bottom = row * pitch + unit + 2 * offset - h;
    const isFirst = row === 0;
    const isLast = row === rows - 1;
    if (isFirst && isLast) {
      parts.push(
        `M${x(from + r)} ${String(top)}H${x(to - r)}`,
        arc(1, to, top + r),
        `V${String(bottom - r)}`,
        arc(1, to - r, bottom),
        `H${x(from + r)}`,
        arc(1, from, bottom - r),
        `V${String(top + r)}`,
        arc(1, from + r, top),
      );
    } else if (isFirst) {
      parts.push(
        `M${x(all)} ${String(top)}H${x(from + r)}`,
        arc(0, from, top + r),
        `V${String(bottom - r)}`,
        arc(0, from + r, bottom),
        `H${x(all)}`,
      );
    } else if (isLast) {
      parts.push(
        `M${x(0)} ${String(top)}H${x(to - r)}`,
        arc(1, to, top + r),
        `V${String(bottom - r)}`,
        arc(1, to - r, bottom),
        `H${x(0)}`,
      );
    } else {
      parts.push(line(top), line(bottom));
    }
  }
  return { all, path: parts.join('') };
};

/**
 * Its containers' rows outlined while editing (see `bandsPath`, the CSS):
 * the band's outline (a mask) and where it goes, set on each container;
 * not editing, none.
 */
const placeBands = (root: HTMLElement) => {
  const sections = Array.from(
    root.querySelectorAll<HTMLElement>(':scope > [data-grid-part="section"]'),
  );
  const containers = sections.length > 0 ? sections : [root];
  if (!Object.hasOwn(root.dataset, 'editing')) {
    for (const container of containers) {
      for (const property of bandProperties) {
        setStyle(container, property, undefined);
      }
    }
    return;
  }
  const styles = getComputedStyle(root);
  const value = (property: string, fallback: number) =>
    Number.parseFloat(styles.getPropertyValue(property)) || fallback;
  const gap = value('--uikit-grid-gap', 0);
  const unit = value('--uikit-grid-unit', 1);
  const radius = value('--uikit-grid-item-radius', 24);
  const pitch = unit + gap;
  const isRtl = styles.direction === 'rtl';
  const page = pageOf(root);
  const edge = page?.getBoundingClientRect();
  const left = edge ? edge.left + (page?.clientLeft ?? 0) : 0;
  const right = edge
    ? left + (page?.clientWidth ?? 0)
    : document.documentElement.clientWidth;
  for (const container of containers) {
    const header = container.querySelector<HTMLElement>(
      ':scope > [data-grid-part="header"]',
    );
    const top = header ? header.offsetTop + header.offsetHeight + gap : 0;
    const rows = Math.round((container.clientHeight - top + gap) / pitch);
    if (rows < 1) {
      for (const property of bandProperties) {
        setStyle(container, property, undefined);
      }
      continue;
    }
    const box = container.getBoundingClientRect();
    const before = Math.max(0, Math.floor(box.left - left));
    const after = Math.max(0, Math.floor(right - box.right));
    const start = isRtl ? after : before;
    const end = isRtl ? before : after;
    const width = container.clientWidth;
    // (Around them, clear of the next row's.)
    const offset = Math.max(0, Math.min(bandOffset, gap / 2 - bandLine));
    const height = rows * pitch - gap + 2 * offset;
    const { all, path } = bandsPath({
      end,
      isRtl,
      offset,
      pitch,
      radius,
      rows,
      start,
      unit,
      width,
    });
    setStyle(
      container,
      '--uikit-grid-bands',
      maskOf(all, height, [
        [path, `fill="none" stroke="#000" stroke-width="${String(bandLine)}"`],
      ]),
    );
    setStyle(container, '--uikit-grid-bands-end', `${String(end)}px`);
    setStyle(container, '--uikit-grid-bands-height', `${String(height)}px`);
    setStyle(container, '--uikit-grid-bands-start', `${String(start)}px`);
    setStyle(container, '--uikit-grid-bands-top', `${String(top - offset)}px`);
  }
};

/** (Within a pixel: what's laid out in fractions.) */
const isWithin = (inner: Rect, outer: Rect) =>
  inner.left >= outer.left - 1 &&
  inner.right <= outer.right + 1 &&
  inner.top >= outer.top - 1 &&
  inner.bottom <= outer.bottom + 1;

const isOverlapping = (a: Rect, b: Rect) =>
  a.left < b.right - 1 &&
  b.left < a.right - 1 &&
  a.top < b.bottom - 1 &&
  b.top < a.bottom - 1;

/**
 * The breaks right before and after one, in order (each next to the
 * one before it: merged on Done, see the app's).
 */
const adjacentBreaks = (
  cells: readonly HTMLElement[],
  cell: HTMLElement,
): HTMLElement[] => {
  const at = cells.indexOf(cell);
  const adjacent: HTMLElement[] = [];
  for (const step of [-1, 1]) {
    for (
      let index = at + step;
      cells[index]?.dataset.gridPart === 'break';
      index += step
    ) {
      adjacent.push(cells[index] as HTMLElement);
    }
  }
  return adjacent;
};

/** Where a resize grows a cell to (see `mergedBy`), in its container. */
const grownAreas = (
  cell: HTMLElement,
  columns: number,
  rows: number,
  { column, gap, unit }: Metrics,
): Rect[] => {
  const pitch = unit + gap;
  const own = rectOf(cell);
  if (cell.dataset.gridPart === 'break') {
    // (Its rows as drawn (one less below a full row), to as many more.)
    const drawn = Math.round((cell.offsetHeight + gap) / pitch);
    const shown = rows - rowsOf(cell) + drawn;
    if (shown <= drawn) return [];
    return [
      own,
      {
        bottom: own.top + shown * pitch - gap,
        left: 0,
        right: cell.parentElement?.clientWidth ?? 0,
        top: own.bottom + gap,
      },
    ];
  }
  const width = columns * (column + gap) - gap;
  const isRtl = getComputedStyle(cell).direction === 'rtl';
  return [
    {
      bottom: own.top + rows * pitch - gap,
      left: isRtl ? own.right - width : own.left,
      right: isRtl ? own.right : own.left + width,
      top: own.top,
    },
  ];
};

/**
 * What a cell resized to a size takes in (see `ResizeHandle`): growing,
 * an item or a spacer every spacer it reaches, a break the breaks right
 * before and after it in order; either, the breaks (a break: also the
 * spacers) wholly inside what it grows over (a break's: its fillers too).
 * Items are never taken in: they reflow as usual. An item or a spacer
 * grows right and down from its top leading corner; a break by rows,
 * each a whole row below it. Only what the app can be told of and remove
 * (named, its `dropName`; a remove button in it, see `Grid.RemoveButton`):
 * the app removes what's taken in (told by name), the rest reflows as
 * items do.
 */
/**
 * Whether a cell can be taken in: named (its `dropName`, as the app's
 * told of it) and removable (a remove button in it).
 */
const isRemovable = (cell: HTMLElement) =>
  Object.hasOwn(cell.dataset, 'gridName') &&
  cell.querySelector(':scope > [data-grid-part="remove-button"]') !== null;

export const mergedBy = (
  cell: HTMLElement,
  columns: number,
  rows: number,
): HTMLElement[] => {
  const container = cell.parentElement;
  if (!container) return [];
  const areas = grownAreas(cell, columns, rows, metricsOf(container));
  if (areas.length === 0) return [];
  // (Its cells, in order: what takes room there, by what it belongs to (a
  // break: its fillers too).)
  const cells = Array.from(container.children).filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElement &&
      ['break', 'item', 'spacer'].includes(child.dataset.gridPart ?? '') &&
      !Object.hasOwn(child.dataset, 'gridDragging'),
  );
  const isBreakResized = cell.dataset.gridPart === 'break';
  const merged = new Set<HTMLElement>(
    isBreakResized ? adjacentBreaks(cells, cell) : [],
  );
  // (The break right after it: still ending its row after it, grown or
  // not (in its end-of-line column, then); never taken in.)
  const following = cells[cells.indexOf(cell) + 1];
  const kept =
    !isBreakResized && following?.dataset.gridPart === 'break'
      ? following
      : undefined;
  const isIn = (rect: Rect) => areas.some((area) => isWithin(rect, area));
  const touches = (rect: Rect) =>
    areas.some((area) => isOverlapping(rect, area));
  for (const each of cells) {
    if (each === cell || each === kept || merged.has(each)) continue;
    const part = each.dataset.gridPart;
    const rects = [
      rectOf(each),
      ...(part === 'break' ? fillsOf(each).map((fill) => rectOf(fill)) : []),
    ];
    // (An item or a spacer growing swallows spacers it reaches; anything
    // else, wholly inside it. Items are never taken in: they reflow.)
    const isTaken =
      part === 'spacer' && !isBreakResized
        ? rects.some((rect) => touches(rect))
        : part !== 'item' &&
          !Object.hasOwn(each.dataset, 'gridBreakNone') &&
          rects.every((rect) => isIn(rect));
    if (isTaken) merged.add(each);
  }
  return [...merged].filter((each) => isRemovable(each));
};

/** An element's position in its grid's layout (not its `translate`). */
const layoutPosition = (
  element: HTMLElement,
  root: HTMLElement,
): readonly [number, number] => {
  let x = 0;
  let y = 0;
  for (
    let current: HTMLElement | null = element;
    current && current !== root;
    current = current.offsetParent as HTMLElement | null
  ) {
    x += current.offsetLeft;
    y += current.offsetTop;
  }
  return [x, y] as const;
};

/** The nearest ancestor scrolling vertically, or the document's (as List). */
export const scrollerOf = (element: HTMLElement): Element => {
  for (
    let current = element.parentElement;
    current;
    current = current.parentElement
  ) {
    const { overflowY } = getComputedStyle(current);
    if (
      (overflowY === 'auto' || overflowY === 'scroll') &&
      current.scrollHeight > current.clientHeight
    ) {
      return current;
    }
  }
  return element.ownerDocument.scrollingElement ?? element.ownerDocument.body;
};

/** A scroller's visible top and bottom: its box, less its bars' room. */
export const visibleEdgesOf = (
  scroller: Element,
  root: HTMLElement,
): { bottom: number; top: number } => {
  const isDocument = scroller === scroller.ownerDocument.scrollingElement;
  const { bottom, top } = isDocument
    ? { bottom: window.innerHeight, top: 0 }
    : scroller.getBoundingClientRect();
  const styles = getComputedStyle(root);
  const inset = (name: string) =>
    Number.parseFloat(styles.getPropertyValue(name)) || 0;
  return {
    bottom: bottom - inset('--uikit-viewport-anchor-block-end'),
    top: top + inset('--uikit-viewport-anchor-block-start'),
  };
};

/** An element's top on screen by its layout (not its `translate`). */
const topOf = (element: HTMLElement, root: HTMLElement) =>
  root.getBoundingClientRect().top + layoutPosition(element, root)[1];

/**
 * Whether an element's getting to a new box by itself (a tile, its cell,
 * see reshape.ts): not glided by the reflow meanwhile.
 */
export const isReshaping = (element: HTMLElement): boolean =>
  Object.hasOwn(element.dataset, 'gridReshaping');

/** Keyframes from an offset to none. */
const fromOffset = (x: number, y: number) => [
  { translate: `${String(x)}px ${String(y)}px` },
  { translate: '0 0' },
];

/**
 * An element gliding from where it was (`dx`, `dy` off) to where it is, by
 * a `translate` added to any running one.
 */
const glide = (element: HTMLElement, dx: number, dy: number) => {
  const timing = {
    composite: 'add',
    duration: reflowDuration,
    easing: reflowEasing,
  } as const;
  element.animate(fromOffset(dx, dy), timing);
};

/**
 * Whether a cell stays where it's laid out, not gliding there: the one
 * dragged, one dropped in its area (gliding from where it was let go, see
 * main.tsx); none with reduced motion; nor a tile getting to a new box,
 * nor its cell (drawn there by itself, see reshape.ts).
 */
const isStill = (
  element: HTMLElement,
  dragged: HTMLElement | null,
  isReduced: boolean,
) =>
  element === dragged ||
  Object.hasOwn(element.dataset, 'gridPlaced') ||
  isReduced ||
  isReshaping(element);

/**
 * Its sections and cells gliding from where they were to where they are, as
 * the layout changes (a cell resized, moved, a section's height changing,
 * the columns changing): FLIP, by a `translate` animation added to any
 * running one, a section's carrying its cells (theirs within it). Not the
 * one dragged. Edit mode toggled: what's on screen kept there (see below).
 */
export const useReflow = (
  rootRef: RefObject<HTMLDivElement | null>,
  dragged: RefObject<HTMLElement | null>,
  editing: boolean,
): void => {
  // (What's on screen as last laid out or scrolled: see `editing` below.)
  const anchor = useRef<
    { element: HTMLElement; scrolled: number; top: number } | undefined
  >(undefined);
  const shift = useRef<((dy: number) => void) | undefined>(undefined);
  const keep = useRef<(() => void) | undefined>(undefined);

  useLayoutEffect(() => {
    const { current: root } = rootRef;
    if (!root) return undefined;
    const last = new WeakMap<HTMLElement, readonly [number, number]>();
    const reduce = reducedMotionOf(root);
    const scroller = scrollerOf(root);

    // (The first item shown whole below the scroller's bars, where it is:
    // by its layout, not what's gliding.)
    // (Chosen anew only when scrolled by the user (not by `keep`): the
    // same one kept through a run of layout changes, so it doesn't drift
    // by being swapped for another.)
    let kept = Number.NaN;
    const record = (isChosen = false) => {
      const held = anchor.current?.element;
      let element =
        !isChosen && held?.isConnected && held.offsetParent !== null
          ? held
          : undefined;
      if (!element) {
        const { top } = visibleEdgesOf(scroller, root);
        const shown = Array.from(
          root.querySelectorAll<HTMLElement>('[data-grid-part="item"]'),
        ).filter((each) => each.offsetParent !== null);
        // (The highest seen whole below the bars (the leading one of a
        // row): what's looked at, not one mostly under them; else the first
        // seen at all.)
        const whole = shown
          .map((each) => ({ each, top: topOf(each, root) }))
          .filter((each) => each.top >= top - 1);
        let first: (typeof whole)[number] | undefined;
        for (const each of whole) {
          if (!first || each.top < first.top - 1) first = each;
        }
        element =
          first?.each ??
          shown.find((each) => topOf(each, root) + each.offsetHeight > top);
      }
      anchor.current = element && {
        element,
        scrolled: scroller.scrollTop,
        top: topOf(element, root),
      };
    };

    // (Scrolled by as much (see `editing` below): what's in the grid gliding
    // by where it was on screen, not in the grid.)
    shift.current = (dy) => {
      for (const child of root.children) {
        const element = child as HTMLElement;
        const before = last.get(element);
        if (!before) continue;
        last.set(element, [before[0], before[1] + dy]);
      }
    };

    // (Where everything is, as laid out, nothing gliding.)
    const recordAll = () => {
      for (const element of root.querySelectorAll<HTMLElement>(
        glidingSelector,
      )) {
        if (!element.offsetParent) {
          last.delete(element);
          continue;
        }
        last.set(
          element,
          element.dataset.gridPart === 'section'
            ? layoutPosition(element, root)
            : [element.offsetLeft, element.offsetTop],
        );
      }
    };

    // (Not gliding: until it's measured, and into its first measured
    // layout; while its width changes on the same columns (the units
    // stretching along), what's on screen kept there (see `keep`), where
    // things were kept until it's painted, so columns changing with it
    // glide from where they were shown.)
    let isMeasured = false;
    let width = -1;
    let columns = '';
    let unit = '';
    let settle = 0;
    let isStretching = false;
    // (Its columns changed, not yet painted: what follows in the same frame
    // (e.g. what's in it re-rendered for them) kept on screen too.)
    let isSettling = false;
    let settled = 0;
    let settleTimer = 0;
    const stopSettling = () => {
      cancelAnimationFrame(settle);
      clearTimeout(settleTimer);
    };

    // (What's on screen kept there, its layout changed: scrolled by as much
    // as the first item shown moved, before it's painted; the glide taking
    // that in. However it's scrolled since: by this, or the browser's own
    // anchoring.)
    keep.current = () => {
      const held = anchor.current;
      if (!held?.element.isConnected) return;
      const dy = topOf(held.element, root) - held.top;
      if (Math.abs(dy) >= 0.5) scroller.scrollTop += dy;
      kept = scroller.scrollTop;
      const scrolled = scroller.scrollTop - held.scrolled;
      if (scrolled !== 0) shift.current?.(scrolled);
    };

    const reflow = () => {
      placeBreaks(root);
      placeBands(root);
      const wasMeasured = isMeasured;
      isMeasured = Object.hasOwn(root.dataset, 'gridMeasured');
      const isResized = root.clientWidth !== width;
      width = root.clientWidth;
      const hasColumns =
        root.style.getPropertyValue('--uikit-grid-columns') !== columns;
      columns = root.style.getPropertyValue('--uikit-grid-columns');
      // (Its columns' width too: narrower beside its end-of-line column
      // as it opens, see main.tsx.)
      const unitNow = `${root.style.getPropertyValue('--uikit-grid-unit')}/${root.style.getPropertyValue('--uikit-grid-column')}`;
      const hasUnit = unitNow !== unit;
      unit = unitNow;
      if (!wasMeasured || !isMeasured) {
        recordAll();
        record();
        return;
      }
      // (Stretched on the same columns: what's on screen kept there, nothing
      // gliding.)
      if ((isResized || hasUnit || isStretching) && !hasColumns) {
        keep.current?.();
        record();
        isStretching = true;
        stopSettling();
        // (Once it's painted: after its frame, not in it (its callbacks run
        // before its resizing).)
        settle = requestAnimationFrame(() => {
          settleTimer = window.setTimeout(() => {
            isStretching = false;
            recordAll();
          });
        });
        return;
      }
      stopSettling();
      isStretching = false;
      // (Its columns changed, or just did: what's on screen kept there.)
      if (hasColumns) {
        isSettling = true;
        cancelAnimationFrame(settled);
        settled = requestAnimationFrame(() => {
          isSettling = false;
        });
      }
      if (isSettling) keep.current?.();
      for (const element of root.querySelectorAll<HTMLElement>(
        glidingSelector,
      )) {
        // (Not shown, e.g. a break while not editing: no position to glide
        // from once it is.)
        if (!element.offsetParent) {
          last.delete(element);
          continue;
        }
        // (A section's in the grid; a cell's in its section, which carries
        // it.)
        const position =
          element.dataset.gridPart === 'section'
            ? layoutPosition(element, root)
            : ([element.offsetLeft, element.offsetTop] as const);
        const before = last.get(element);
        last.set(element, position);
        if (!before || isStill(element, dragged.current, reduce.matches)) {
          continue;
        }
        const dx = before[0] - position[0];
        const dy = before[1] - position[1];
        if (dx === 0 && dy === 0) continue;
        glide(element, dx, dy);
      }
      record();
    };

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      // (Scrolled by the user: chosen anew. By `keep`: already recorded;
      // not again before its frame's resizing (a frame's callbacks run
      // before its observers: what they'd read isn't kept yet).)
      if (scroller.scrollTop === kept) return;
      frame = requestAnimationFrame(() => record(true));
    };
    const scrolled =
      scroller === root.ownerDocument.scrollingElement ? window : scroller;
    scrolled.addEventListener('scroll', onScroll, { passive: true });

    reflow();
    const resizeObserver = new ResizeObserver(reflow);
    resizeObserver.observe(root);
    // (Its page's width: its rows' bands run to its edges.)
    const page = pageOf(root);
    if (page) resizeObserver.observe(page);
    const mutationObserver = new MutationObserver(reflow);
    mutationObserver.observe(root, {
      attributeFilter: [
        'data-editing',
        'data-grid-measured',
        'data-size',
        'hidden',
        'style',
      ],
      attributes: true,
      childList: true,
      subtree: true,
    });
    return () => {
      cancelAnimationFrame(frame);
      stopSettling();
      cancelAnimationFrame(settled);
      scrolled.removeEventListener('scroll', onScroll);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      shift.current = undefined;
      keep.current = undefined;
    };
  }, [dragged, rootRef]);

  // (Edit mode toggled: what it shows or hides (sections' end rows, breaks)
  // not moving what's on screen (see `keep`).)
  const isFirst = useRef(true);
  useLayoutEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    keep.current?.();
  }, [editing, rootRef]);
};
