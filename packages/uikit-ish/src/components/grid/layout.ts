import { RefObject, useLayoutEffect, useRef } from 'react';

// A grid's layout (see main.tsx): its columns and unit for a width, its
// breaks placed while editing, its items gliding as it changes.

/** A width's unit at some columns. */
export const unitOf = (width: number, gap: number, columns: number): number =>
  Math.max(0, (width - (columns - 1) * gap) / columns);

/** The columns and unit for a width (see the top). */
export const layoutOf = (
  width: number,
  gap: number,
  min: number,
  target: number,
  max: number,
): { columns: number; unit: number } => {
  const fit = (unit: number) =>
    Math.max(1, Math.floor((width + gap) / (unit + gap)));
  const most = fit(min);
  let columns = most;
  let best = Number.POSITIVE_INFINITY;
  for (let count = fit(max); count <= most; count += 1) {
    const unit = (width - (count - 1) * gap) / count;
    if (!(unit >= min && unit <= max && Math.abs(unit - target) < best)) {
      continue;
    }

    best = Math.abs(unit - target);
    columns = count;
  }
  return { columns, unit: unitOf(width, gap, columns) };
};

export const reflowDuration = 300;
export const reflowEasing = 'cubic-bezier(0.32, 0.72, 0, 1)';

const itemSelector =
  ':scope [data-grid-part="item"], :scope [data-grid-part="spacer"], :scope [data-grid-part="break"]';

const glidingSelector = `:scope > [data-grid-part="section"], ${itemSelector}`;

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

type Metrics = { columns: number; gap: number; unit: number };

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
 * (`from` columns before it) to the grid's end: its first row from where
 * it starts, its rows below from their start, every corner rounded (the
 * inner one too). Mirrored when right to left. A break to be (`isFaint`,
 * see edit.ts): its rows below its first fainter, its first row drawn in
 * full (`hasFirst`: not when it starts below a full row, its first).
 */
const breakShape = (
  { columns, gap, unit }: Metrics,
  {
    from,
    hasFirst,
    isFaint,
    isRtl,
    radius,
    rows,
  }: {
    from: number;
    hasFirst: boolean;
    isFaint: boolean;
    isRtl: boolean;
    radius: number;
    rows: number;
  },
) => {
  const pitch = unit + gap;
  const width = columns * pitch - gap;
  const height = rows * pitch - gap;
  const r = Math.min(radius, unit / 2);
  const start = from * pitch;
  const x = (value: number) => String(isRtl ? width - value : value);
  const y = String;
  const arc = (sweep: 0 | 1, ax: number, ay: number) =>
    `A${y(r)} ${y(r)} 0 0 ${String(isRtl ? 1 - sweep : sweep)} ${x(ax)} ${y(ay)}`;
  const box = (left: number) =>
    [
      `M${x(left + r)} 0H${x(width - r)}`,
      arc(1, width, r),
      `V${y(height - r)}`,
      arc(1, width - r, height),
      `H${x(left + r)}`,
      arc(1, left, height - r),
      `V${y(r)}`,
      arc(1, left + r, 0),
      'Z',
    ].join('');
  const path =
    rows === 1 || start === 0
      ? box(rows === 1 ? start : 0)
      : [
          `M${x(start + r)} 0H${x(width - r)}`,
          arc(1, width, r),
          `V${y(height - r)}`,
          arc(1, width - r, height),
          `H${x(r)}`,
          arc(1, 0, height - r),
          `V${y(pitch + r)}`,
          arc(1, r, pitch),
          `H${x(start - r)}`,
          arc(0, start, pitch - r),
          `V${y(r)}`,
          arc(1, start + r, 0),
          'Z',
        ].join('');
  if (!isFaint || (rows === 1 && hasFirst)) {
    return maskOf(width, height, [[path, 'fill="#000"']]);
  }
  const first = hasFirst
    ? [
        `M${x(start + r)} 0H${x(width - r)}`,
        arc(1, width, r),
        `V${y(unit)}H${x(start)}V${y(r)}`,
        arc(1, start + r, 0),
        'Z',
      ].join('')
    : undefined;
  return maskOf(width, height, [
    [path, 'fill="#000" fill-opacity="0.35"'],
    ...(first ? [[first, 'fill="#000"'] as const] : []),
  ]);
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
  { columns, gap, unit }: Metrics,
): Run[] => {
  const pitch = unit + gap;
  const runs: Run[] = [];
  let start: number | undefined;
  for (let column = from; column <= columns; column += 1) {
    const x = column * pitch + unit / 2;
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
      column: string;
      /** Its rows drawn (its first in the row below the one before it). */
      drawn: number;
      fills: Run[];
      from: number;
      /**
       * Where its resize handle goes, by its end (columns on): its last
       * row's last free unit, not under what's in the way there.
       */
      handle: number;
      kind: 'cell';
      rest: number;
      /** Where its return sign goes, the same way: its first row's. */
      sign: number;
    }
  /** Nothing kept empty: in the gap below that row, taking no room. */
  | { kind: 'none'; top: number };

/**
 * Where a break goes: in the row of the one before it (after a break: the
 * row after the last it keeps empty, from its start; first: the row above
 * the first), from the first free unit after it to what's in the way
 * (else its row's end); fillers in that row's other free runs on, and in
 * the rows below it (its rows less one), so what follows starts below it.
 * No room left in that row: in the row below, its rows there and below
 * (one less) kept empty the same way; one row only, it keeps nothing
 * empty, so it takes no room (drawn in the gap below that row while
 * editing). The same while editing or not.
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
          (previous.offsetLeft + previous.offsetWidth + metrics.gap) / pitch,
        )
      : 0;
  }
  const below = (from: number, count: number) =>
    Array.from({ length: Math.max(0, count) }, (_, row) =>
      freeRuns(y + (from + row) * pitch, 0, before, metrics),
    ).flat();
  const last = y + (rows - 1) * pitch;
  keptRows.set(element, last);
  const endOf = (row: number, to: number) =>
    (freeRuns(row, 0, before, metrics).at(-1)?.to ?? to) - to;
  const [first, ...rest] = freeRuns(y, start, before, metrics);
  if (first) {
    return {
      column: `${String(first.from + 1)} / ${String(first.to + 1)}`,
      drawn: rows,
      fills: [...rest, ...below(1, rows - 1)],
      from: first.from,
      handle: endOf(last, first.to),
      kind: 'cell',
      rest: metrics.columns - first.to,
      sign: endOf(y, first.to),
    };
  }
  const [next, ...others] =
    rows > 1 ? freeRuns(y + pitch, 0, before, metrics) : [];
  if (!next) {
    keptRows.set(element, y);
    return {
      kind: 'none',
      top: y + metrics.unit / 2 + metrics.gap / 2,
    };
  }
  return {
    column: `${String(next.from + 1)} / ${String(next.to + 1)}`,
    drawn: rows - 1,
    fills: [...others, ...below(2, rows - 2)],
    from: next.from,
    handle: endOf(last, next.to),
    kind: 'cell',
    rest: metrics.columns - next.to,
    sign: endOf(y + pitch, next.to),
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
      element.toggleAttribute('data-grid-break-none', isNone);
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
          : breakShape(metrics, {
              from: place.from,
              hasFirst: place.drawn === rowsOf(element),
              isFaint: part === 'placeholder',
              isRtl: metrics.isRtl,
              radius: metrics.radius,
              rows: place.drawn,
            }),
      );
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
 * Its breaks as cells (see `breakPlace`): in the order shown, one after
 * another (each placed, the next measured), as tall as their rows (see the
 * CSS); not editing, not drawn (keeping nothing empty: none). Not one
 * dragged.
 * Fillers no longer needed removed.
 */
export const placeBreaks = (root: HTMLElement): void => {
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
    setStyle(element, '--uikit-grid-break-drawn', undefined);
    setStyle(element, '--uikit-grid-break-handle', undefined);
    setStyle(element, '--uikit-grid-break-sign', undefined);
    setStyle(element, '--uikit-grid-break-top', undefined);
    delete element.dataset.gridBreakNone;
  }
  if (breaks.length > 0) {
    const styles = getComputedStyle(root);
    const value = (property: string, fallback: number) =>
      Number.parseFloat(styles.getPropertyValue(property)) || fallback;
    const metrics = {
      columns: value('--uikit-grid-columns', 1),
      gap: value('--uikit-grid-gap', 0),
      isRtl: styles.direction === 'rtl',
      radius: value('--uikit-grid-item-radius', 24),
      unit: value('--uikit-grid-unit', 1),
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
  { gap, unit }: { gap: number; unit: number },
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
  const width = columns * pitch - gap;
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
 * each a whole row below it.
 */
export const mergedBy = (
  cell: HTMLElement,
  columns: number,
  rows: number,
): HTMLElement[] => {
  const container = cell.parentElement;
  if (!container) return [];
  const styles = getComputedStyle(container);
  const unit = Number.parseFloat(styles.getPropertyValue('--uikit-grid-unit'));
  if (!(unit > 0)) return [];
  const gap =
    Number.parseFloat(styles.getPropertyValue('--uikit-grid-gap')) || 0;
  const areas = grownAreas(cell, columns, rows, { gap, unit });
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
  const isIn = (rect: Rect) => areas.some((area) => isWithin(rect, area));
  const touches = (rect: Rect) =>
    areas.some((area) => isOverlapping(rect, area));
  for (const each of cells) {
    if (each === cell || merged.has(each)) continue;
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
  return [...merged];
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
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
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
      const hasUnit = root.style.getPropertyValue('--uikit-grid-unit') !== unit;
      unit = root.style.getPropertyValue('--uikit-grid-unit');
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
        if (!before || element === dragged.current || reduce.matches) {
          continue;
        }
        const dx = before[0] - position[0];
        const dy = before[1] - position[1];
        if (dx === 0 && dy === 0) continue;
        element.animate(
          [
            { translate: `${String(dx)}px ${String(dy)}px` },
            { translate: '0 0' },
          ],
          { composite: 'add', duration: reflowDuration, easing: reflowEasing },
        );
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
