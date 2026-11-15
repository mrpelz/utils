/**
 * A tile's dashed outline (a spacer's, an add tile's, a hole's, a stand-in's;
 * see the CSS): an SVG rounded rectangle 1px in from its edges, stroked
 * 2px, its dashes counted by its size in units (`pathLength`), not by its
 * pixels: as its columns stretch or narrow (e.g. the end-of-line column
 * opening), its dashes stretch along, none appearing or vanishing; evenly
 * round it, meeting where they start.
 */

const svgNs = 'http://www.w3.org/2000/svg';

// (A unit and a gap as designed, and the length of a dash and its gap.)
const nominalUnit = 110;
const nominalGap = 12;
const nominalRadius = 24;
/** Its corners' radius, along its line (its own, see the CSS). */
export const dashRadius = nominalRadius - 1;
const period = 11;

/** Dashes round a tile of `columns` by `rows` units. */
export const dashCountOf = (columns: number, rows: number): number => {
  const width = columns * nominalUnit + (columns - 1) * nominalGap;
  const height = rows * nominalUnit + (rows - 1) * nominalGap;
  const perimeter =
    2 * (width + height) - (8 - 2 * Math.PI) * (nominalRadius - 1);
  return Math.max(8, Math.round(perimeter / period));
};

/** An outline's element, as made in the DOM (see `dashCountOf`). */
export const dashesOf = (columns: number, rows: number): SVGSVGElement => {
  const svg = document.createElementNS(svgNs, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('class', 'uikit-grid-dashes');
  const rect = document.createElementNS(svgNs, 'rect');
  rect.setAttribute('height', '100%');
  rect.setAttribute('pathLength', String(dashCountOf(columns, rows)));
  rect.setAttribute('rx', String(dashRadius));
  rect.setAttribute('width', '100%');
  svg.append(rect);
  return svg;
};
