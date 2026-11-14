import type { GridBreakRows, GridReorderInsert, GridSize } from './props.js';

// Landing a dragged cell on an empty unit (see edit.ts): what's to be added
// around it (breaks, spacers) and changed (a break's rows) so it lands
// there and the cells after it stay where they are. By the layout without
// it, in units; CSS grid's placement (each cell at the first place it fits
// after the one before it, a break's rows kept empty) followed.

/** What's added (and changed) for a cell to land where it's dropped. */
export type Plan = {
  after: readonly GridReorderInsert[];
  before: readonly GridReorderInsert[];
  /** A break before it, its rows changed. */
  resize?: { element: HTMLElement; rows: GridBreakRows };
};

/** Nothing added or changed. */
export const isEmptyPlan = (plan: Plan | undefined): boolean =>
  !plan ||
  (plan.before.length === 0 && plan.after.length === 0 && !plan.resize);

export const isSamePlan = (
  a: Plan | undefined,
  b: Plan | undefined,
): boolean =>
  isEmptyPlan(a) || isEmptyPlan(b)
    ? isEmptyPlan(a) && isEmptyPlan(b)
    : JSON.stringify([a?.before, a?.after, a?.resize?.rows]) ===
        JSON.stringify([b?.before, b?.after, b?.resize?.rows]) &&
      a?.resize?.element === b?.resize?.element;

/** A cell's place and span, in units (rows from any one). */
export type Unit = {
  column: number;
  columns: number;
  row: number;
  rows: number;
};

/** A cell in its range, in order: where it is (a break: its rows). */
export type PlanCell = {
  /** A break's rows (else none). */
  breakRows?: number;
  element: HTMLElement;
  unit: Unit;
};

type At = { column: number; row: number };

const keyOf = (row: number, column: number) =>
  `${String(row)},${String(column)}`;

const occupy = (taken: Set<string>, unit: Unit) => {
  for (let row = unit.row; row < unit.row + unit.rows; row += 1) {
    for (
      let column = unit.column;
      column < unit.column + unit.columns;
      column += 1
    ) {
      taken.add(keyOf(row, column));
    }
  }
};

const fits = (
  taken: ReadonlySet<string>,
  at: At,
  columns: number,
  rows: number,
  width: number,
) => {
  if (at.column < 0 || at.column + columns > width) return false;
  for (let row = at.row; row < at.row + rows; row += 1) {
    for (let column = at.column; column < at.column + columns; column += 1) {
      if (taken.has(keyOf(row, column))) return false;
    }
  }
  return true;
};

/** Where a span lands, placed after a place (CSS grid's sparse flow). */
const firstFit = (
  taken: ReadonlySet<string>,
  from: At,
  columns: number,
  rows: number,
  width: number,
): At | undefined => {
  for (let row = from.row; row < from.row + 64; row += 1) {
    for (
      let column = row === from.row ? from.column : 0;
      column + columns <= width;
      column += 1
    ) {
      if (fits(taken, { column, row }, columns, rows, width)) {
        return { column, row };
      }
    }
  }
  return undefined;
};

const isAt = (a: At | undefined, b: At) =>
  a?.row === b.row && a.column === b.column;

/**
 * Spacers for a row's free units from one column to another (at most 3
 * wide each), each landing where it's meant to (else none: `undefined`);
 * what they take marked.
 */
const spacersIn = (
  taken: Set<string>,
  row: number,
  from: number,
  to: number,
  width: number,
): GridReorderInsert[] | undefined => {
  const spacers: GridReorderInsert[] = [];
  let cursor: At = { column: from, row };
  let column = from;
  while (column < to) {
    if (taken.has(keyOf(row, column))) {
      column += 1;
      continue;
    }
    let end = column;
    while (end < to && end - column < 3 && !taken.has(keyOf(row, end))) {
      end += 1;
    }
    const columns = end - column;
    if (!isAt(firstFit(taken, cursor, columns, 1, width), { column, row })) {
      return undefined;
    }
    occupy(taken, { column, columns, row, rows: 1 });
    spacers.push({ kind: 'spacer', size: `${columns}x1` as GridSize });
    cursor = { column: end, row };
    column = end;
  }
  return spacers;
};

/** What cells take (breaks' rows free), and what else does. */
const occupancyOf = (
  cells: readonly PlanCell[],
  others: readonly Unit[],
): Set<string> => {
  const taken = new Set<string>();
  for (const cell of cells) {
    if (cell.breakRows === undefined) occupy(taken, cell.unit);
  }
  for (const unit of others) occupy(taken, unit);
  return taken;
};

type Span = { columns: number; rows: number };

/**
 * Before it (see `planAt`): a break or the one before shortened (or
 * lengthened), then spacers left of it in its row, it landing there (else
 * `undefined`); what they take marked.
 */
const beforeOf = (
  previous: PlanCell,
  target: At,
  taken: Set<string>,
  item: Span,
  columns: number,
): Pick<Plan, 'before' | 'resize'> | undefined => {
  const { breakRows } = previous;
  const before: GridReorderInsert[] = [];
  let resize: Plan['resize'];
  let from = previous.unit.column + previous.unit.columns;
  const rows = target.row - previous.unit.row;
  if (rows > 0) {
    if (rows > 3) return undefined;
    if (breakRows === undefined) {
      before.push({ kind: 'break', rows: rows as GridBreakRows });
    } else if (rows !== breakRows) {
      resize = { element: previous.element, rows: rows as GridBreakRows };
    }
    from = 0;
  } else if (rows < 0 || breakRows !== undefined) {
    return undefined;
  }
  const spacers = spacersIn(taken, target.row, from, target.column, columns);
  if (!spacers) return undefined;
  before.push(...spacers);
  const cursor = {
    column: spacers.length > 0 ? target.column : from,
    row: target.row,
  };
  return isAt(firstFit(taken, cursor, item.columns, item.rows, columns), target)
    ? { before, resize }
    : undefined;
};

/**
 * After it (see `planAt`), in a shortened break's rows: spacers right of it
 * up to what's in the way, a break keeping the rest of those rows empty
 * (else `undefined`).
 */
const afterOf = (
  previous: PlanCell,
  target: At,
  { all, taken }: { all: ReadonlySet<string>; taken: Set<string> },
  item: Span,
  columns: number,
): GridReorderInsert[] | undefined => {
  const { breakRows } = previous;
  if (breakRows === undefined) return [];
  const end = previous.unit.row + breakRows;
  if (end <= target.row) return [];
  occupy(taken, { ...target, ...item });
  const additions: GridReorderInsert[] = [];
  const from = target.column + item.columns;
  let stop = from;
  while (stop < columns && !all.has(keyOf(target.row, stop))) stop += 1;
  if (stop < columns && stop > from) {
    const right = spacersIn(taken, target.row, from, stop, columns);
    if (!right) return undefined;
    additions.push(...right);
  }
  additions.push({ kind: 'break', rows: (end - target.row) as GridBreakRows });
  return additions;
};

/**
 * After it (see `planAt`), placed: spacers right of it, so what comes
 * next stays where it is (not drawn into the room it leaves): up to it in
 * its row, else to its row's end (none if that doesn't keep it).
 */
const keepNext = (
  taken: Set<string>,
  target: At,
  item: Span,
  next: PlanCell | undefined,
  columns: number,
): GridReorderInsert[] => {
  if (!next || next.breakRows !== undefined) return [];
  const { unit } = next;
  const lands = (on: ReadonlySet<string>, from: At) =>
    isAt(firstFit(on, from, unit.columns, unit.rows, columns), unit);
  const from = target.column + item.columns;
  if (lands(taken, { column: from, row: target.row })) return [];
  const to = unit.row === target.row ? unit.column : columns;
  const trial = new Set(taken);
  const spacers = spacersIn(trial, target.row, from, to, columns);
  if (!spacers || spacers.length === 0) return [];
  return lands(trial, { column: to, row: target.row }) ? spacers : [];
};

/** Whether a plan needs only what's allowed. */
const isAllowed = (
  plan: Plan,
  { breaks, spacers }: { breaks: boolean; spacers: boolean },
) => {
  const inserts = [...plan.before, ...plan.after];
  return (
    (spacers || inserts.every(({ kind }) => kind !== 'spacer')) &&
    (breaks ||
      (plan.resize === undefined &&
        inserts.every(({ kind }) => kind !== 'break')))
  );
};

/**
 * A cell (its span) landing on a unit (its top left) of its range: the gap
 * (after the cells starting before that unit) and what's added there. By
 * the layout without it: its range's cells, in order (`cells`), what else
 * takes room (`others`). None (`undefined`) if it doesn't fit there, if
 * nothing gets it there, or if that needs what isn't allowed (`allows`).
 *
 * - Before it: a break (a row below the cell before it), or the break
 *   before it shortened (dropped in the rows it keeps empty); spacers in
 *   that row's free units left of it.
 * - After it, in a shortened break's rows: spacers in the free units right
 *   of it up to what's in the way, a break keeping the rest of those rows
 *   empty, so what follows stays. Elsewhere, spacers right of it, if what
 *   comes next would otherwise move into the room it leaves (see
 *   `keepNext`).
 */
export const planAt = ({
  allows,
  cells,
  columns,
  item,
  others,
  target,
}: {
  allows: { breaks: boolean; spacers: boolean };
  cells: readonly PlanCell[];
  columns: number;
  item: Span;
  others: readonly Unit[];
  target: At;
}): { index: number; plan: Plan } | undefined => {
  // (Not on any cell; a break's rows, though, are free.)
  const all = occupancyOf(cells, others);
  if (!fits(all, target, item.columns, item.rows, columns)) return undefined;
  const after = cells.findIndex(
    ({ unit }) =>
      unit.row > target.row ||
      (unit.row === target.row && unit.column >= target.column),
  );
  const index = after === -1 ? cells.length : after;
  const previous = cells[index - 1];
  if (!previous) return undefined;
  // (What's placed before it; where it'd go on from, as it is.)
  const taken = occupancyOf(cells.slice(0, index), others);
  const cursor: At =
    previous.breakRows === undefined
      ? {
          column: previous.unit.column + previous.unit.columns,
          row: previous.unit.row,
        }
      : { column: 0, row: previous.unit.row + previous.breakRows };
  // (Spacers after it, if they keep what comes next where it is.)
  const keep = () => {
    occupy(taken, { ...target, ...item });
    return allows.spacers
      ? keepNext(taken, target, item, cells[index], columns)
      : [];
  };
  if (isAt(firstFit(taken, cursor, item.columns, item.rows, columns), target)) {
    return { index, plan: { after: keep(), before: [] } };
  }
  const before = beforeOf(previous, target, taken, item, columns);
  if (!before) return undefined;
  const additions = afterOf(previous, target, { all, taken }, item, columns);
  if (!additions) return undefined;
  const plan = {
    ...before,
    after: additions.length > 0 ? additions : keep(),
  };
  return isAllowed(plan, allows) ? { index, plan } : undefined;
};
