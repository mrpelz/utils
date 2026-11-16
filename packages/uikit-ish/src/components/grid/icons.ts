import type { SymbolIcon } from '../symbol/main.js';

// The corner icons (see `Grid.CornerButton`): one family of 2px lines with
// round ends, and filled shapes rounded as by a 3.5px round-joined stroke,
// each as its outline (filled, as a `SymbolIcon` is drawn). In a 22px box
// centered where a corner button draws its icon (16.5px in from both of
// its corner's edges), at 1px a unit at the button's icon size (15px, see
// the CSS; `unitsPerEm`). All outlines clockwise, so overlapping ones join.

/** A rounded number, for short paths. */
const n = (value: number) => String(Math.round(value * 1000) / 1000);

type Point = readonly [number, number];

/** A 2px line from `from` to `to`, round ended: its outline. */
const line = ([x1, y1]: Point, [x2, y2]: Point) => {
  const length = Math.hypot(x2 - x1, y2 - y1);
  // (Its side's offset: a unit normal, half the width.)
  const dx = (y2 - y1) / length;
  const dy = -(x2 - x1) / length;
  return [
    `M${n(x1 + dx)} ${n(y1 + dy)}`,
    `L${n(x2 + dx)} ${n(y2 + dy)}`,
    `A1 1 0 0 1 ${n(x2 - dx)} ${n(y2 - dy)}`,
    `L${n(x1 - dx)} ${n(y1 - dy)}`,
    `A1 1 0 0 1 ${n(x1 + dx)} ${n(y1 + dy)}Z`,
  ].join('');
};

/** Lines joined at their ends (round, as their ends are). */
const polyline = (...points: Point[]) =>
  points
    .slice(1)
    .map((point, index) => line(points[index] ?? point, point))
    .join('');

/** A 2px ring around `center`, its line's middle at `radius`. */
const ring = ([x, y]: Point, radius: number) => {
  const outer = radius + 1;
  const inner = radius - 1;
  return [
    `M${n(x + outer)} ${n(y)}`,
    `A${n(outer)} ${n(outer)} 0 1 1 ${n(x - outer)} ${n(y)}`,
    `A${n(outer)} ${n(outer)} 0 1 1 ${n(x + outer)} ${n(y)}Z`,
    // (Its hole: the other way around.)
    `M${n(x + inner)} ${n(y)}`,
    `A${n(inner)} ${n(inner)} 0 1 0 ${n(x - inner)} ${n(y)}`,
    `A${n(inner)} ${n(inner)} 0 1 0 ${n(x + inner)} ${n(y)}Z`,
  ].join('');
};

/**
 * A filled shape (convex), its corners rounded as by a 3.5px stroke of its
 * own: its points (given clockwise on screen, its outer side to the left
 * of each side's way) pushed out by 1.75 along each side, round around
 * each.
 */
const rounded = (...ordered: Point[]) => {
  const radius = 1.75;
  const normals = ordered.map(([x1, y1], index) => {
    const [x2, y2] = ordered[(index + 1) % ordered.length] ?? [x1, y1];
    const length = Math.hypot(x2 - x1, y2 - y1);
    return [(y2 - y1) / length, -(x2 - x1) / length] as const;
  });
  return `${ordered
    .map(([x, y], index) => {
      const [nx, ny] = normals[index] ?? [0, 0];
      const [px, py] = normals[
        (index - 1 + ordered.length) % ordered.length
      ] ?? [0, 0];
      const [x2, y2] = ordered[(index + 1) % ordered.length] ?? [x, y];
      return [
        `${index === 0 ? 'M' : 'L'}${n(x + px * radius)} ${n(y + py * radius)}`,
        `A${n(radius)} ${n(radius)} 0 0 1 ${n(x + nx * radius)} ${n(y + ny * radius)}`,
        `L${n(x2 + nx * radius)} ${n(y2 + ny * radius)}`,
      ].join('');
    })
    .join('')}Z`;
};

/** An icon of the family, one layer. */
const iconOf = (sourceName: string, d: string): SymbolIcon => ({
  sourceName,
  svgPathData: [{ d }],
  unitsPerEm: 15,
  viewBox: '-11 -11 22 22',
});

// The resize arc (bottom trailing): concentric with a 24px corner (its
// center 24px in from the corner's edges, so 7.5 up and back from the
// box's), radius 18 (6px in from the edge, clear of an outline around a
// tile), between its ends' angles.
const arcCenter = -7.5;
const arcRadius = 18;
const arcFrom = Math.atan2(6.1, 14.8);
const arcTo = Math.atan2(14.8, 6.1);
const arcAt = (radius: number, angle: number) =>
  `${n(arcCenter + radius * Math.cos(angle))} ${n(arcCenter + radius * Math.sin(angle))}`;
const arc = [
  `M${arcAt(arcRadius + 1, arcFrom)}`,
  `A${n(arcRadius + 1)} ${n(arcRadius + 1)} 0 0 1 ${arcAt(arcRadius + 1, arcTo)}`,
  `A1 1 0 0 1 ${arcAt(arcRadius - 1, arcTo)}`,
  `A${n(arcRadius - 1)} ${n(arcRadius - 1)} 0 0 0 ${arcAt(arcRadius - 1, arcFrom)}`,
  `A1 1 0 0 1 ${arcAt(arcRadius + 1, arcFrom)}Z`,
].join('');

/**
 * A chevron inside the arc, on its diagonal (`along` from the arc's
 * center), pointing to the bottom trailing corner (`toward` 1) or the top
 * leading one (-1), its arms along the box's edges.
 */
const chevron = (along: number, toward: 1 | -1, arm: number) => {
  const at = arcCenter + along * Math.SQRT1_2;
  const end = at - toward * arm;
  return polyline([end, at], [at, at], [at, end]);
};
// (Its outer tip 5.5 inside the arc.)
const chevronTip = arcRadius - 5.5;

/**
 * The grid's edit-mode icons (see `Grid.CornerButton`): in its controls'
 * corners. `SymbolIcon`s, for a corner button or a `Symbol`.
 */
export const gridIcons = {
  /** Adding an area (the hatching, small; bottom leading). */
  addArea: iconOf(
    'grid.add-area',
    polyline([-5.5, -1.5], [-1.5, -5.5]) +
      polyline([-5.5, 5.5], [5.5, -5.5]) +
      polyline([1.5, 5.5], [5.5, 1.5]),
  ),
  /** Movable (crosshairs: four ticks around an empty middle). */
  move: iconOf(
    'grid.move',
    polyline([0, -3.5], [0, -8]) +
      polyline([0, 3.5], [0, 8]) +
      polyline([-3.5, 0], [-8, 0]) +
      polyline([3.5, 0], [8, 0]),
  ),
  /** Removing (an x). */
  remove: iconOf(
    'grid.remove',
    polyline([-3.5, -3.5], [3.5, 3.5]) + polyline([3.5, -3.5], [-3.5, 3.5]),
  ),
  /** Resizing, to any size (the arc alone; bottom trailing). */
  resize: iconOf('grid.resize', arc),
  /** Resizing, both ways (between its sizes). */
  resizeBoth: iconOf(
    'grid.resize-both',
    arc + chevron(2.5, -1, 3.5) + chevron(chevronTip, 1, 3.5),
  ),
  /** Resizing, growing only. */
  resizeGrow: iconOf('grid.resize-grow', arc + chevron(chevronTip, 1, 4)),
  /** Resizing, shrinking only. */
  resizeShrink: iconOf(
    'grid.resize-shrink',
    arc + chevron(chevronTip - 6, -1, 4),
  ),
} as const;

/**
 * A card's icons outside edit mode (see `Card.CornerButton`): what a press
 * on its corner does. `SymbolIcon`s, as the grid's.
 */
export const cardIcons = {
  /** Closing (an overlay): the grid's x. */
  close: gridIcons.remove,
  /** Making it small again (a triangle pointing to the top leading corner). */
  collapse: iconOf('card.collapse', rounded([-3, 3], [-3, -3], [3, -3])),
  /** Going to a page of its own (a ring). */
  drillIn: iconOf('card.drill-in', ring([0, 0], 4)),
  /** Making it larger in place (a triangle pointing to the bottom trailing corner). */
  expand: iconOf('card.expand', rounded([3, -3], [3, 3], [-3, 3])),
  /** Opening it above the page (a rounded square). */
  overlay: iconOf('card.overlay', rounded([-3, -3], [3, -3], [3, 3], [-3, 3])),
} as const;
