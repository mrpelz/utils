import type { CSSProperties } from 'react';

import type { SymbolIcon } from '../../components/index.js';
import {
  sfPlusRectangle,
  sfRectangleBadgeSparkles,
  sfXmarkRectangle,
} from './icons.js';

// The demos' grid signs (the library draws none of its own: it ships no
// icons): symbols as mask images, in the grid's custom properties.

/** A symbol as a mask image (a CSS `url()`), for the grid's signs. */
export const maskOf = ({ svgPathData, viewBox }: SymbolIcon): string => {
  const paths = svgPathData
    .map(
      ({ d, fillOpacity }) =>
        `<path d="${d}"${fillOpacity === undefined ? '' : ` fill-opacity="${String(fillOpacity)}"`}/>`,
    )
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${paths}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

/**
 * The grid's signs (see its CSS): spacers and breaks offered while
 * dragging, sparkling; those a resize takes in, crossed out; the add
 * tile's plus. (Made while rendering, never at module load: the symbols
 * are filled in once loaded.)
 */
export const gridSigns = (): CSSProperties =>
  ({
    '--uikit-grid-merge-sign': maskOf(sfXmarkRectangle),
    '--uikit-grid-offer-sign': maskOf(sfRectangleBadgeSparkles),
    '--uikit-grid-spawn-sign': maskOf(sfPlusRectangle),
  }) as CSSProperties;
