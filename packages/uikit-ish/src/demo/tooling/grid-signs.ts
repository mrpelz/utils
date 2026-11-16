import type { CSSProperties } from 'react';

import type { SymbolIcon } from '../../components/index.js';
import { codeLabel } from './frame/render-code.js';
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

/** How the code shown defines them (see `gridSigns`). */
const definition = `// The grid's signs: symbols as mask images (CSS url()s).
const gridSigns = {
  '--uikit-grid-merge-sign': 'url(…)',
  '--uikit-grid-offer-sign': 'url(…)',
  '--uikit-grid-spawn-sign': 'url(…)',
};`;

/**
 * The grid's signs (see its CSS): spacers and breaks offered while
 * dragging, sparkling; those a resize takes in, crossed out; the add
 * tile's plus; with `style` (e.g. a demo's outline). (Made while
 * rendering, never at module load: the symbols are filled in once
 * loaded.) Shown in the code by name, not their data URLs.
 */
export const gridSigns = (style?: CSSProperties): CSSProperties => {
  const extra = Object.entries(style ?? {}).map(
    ([key, value]) => `${key}: ${JSON.stringify(value)}`,
  );
  return codeLabel(
    {
      '--uikit-grid-merge-sign': maskOf(sfXmarkRectangle),
      '--uikit-grid-offer-sign': maskOf(sfRectangleBadgeSparkles),
      '--uikit-grid-spawn-sign': maskOf(sfPlusRectangle),
      ...style,
    } as CSSProperties,
    extra.length > 0 ? `{ ...gridSigns, ${extra.join(', ')} }` : 'gridSigns',
    definition,
  );
};
