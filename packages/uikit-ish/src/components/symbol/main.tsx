import './style.css';

import { forwardRef, useId } from 'react';

import { cn, withStyle } from '../utils/main.js';
import type { SymbolProps } from './props.js';

export type { SymbolIcon, SymbolProps } from './props.js';

// An SF Symbol, sized like the SF Pro glyph at the current font size, so it
// can stand in for one (e.g. `􀋃` in Figma). Its weight follows the font
// weight its host sets (see `fontWeight`): heavier than regular, stroked;
// lighter, masked by its own outline stroked as much
// (`--uikit-symbol-thinning`, in its units), which takes as much off its
// edges.
//
// Its children (e.g. a `Badge`) sit on it: the glyph alone is blended and
// scaled by its host (`--uikit-symbol-blend`, `--uikit-symbol-scale`,
// e.g. a glass button's vibrant content), so they stay solid.

// In a line of text, its ink's center on the text's: half the cap height up
// from the baseline (`baselineShift`, see style.css).
//
// SF Symbols' paths are SF Pro glyphs at 20pt (e.g. `circle` is 19.92 wide,
// the glyph's ink box 0.996em): other icons give their own units.
const defaultUnitsPerEm = 20;

// Room for strokes beyond the view box (in its units, see `fontWeight`).
const bleed = 2;

/** An icon (e.g. an SF Symbol), with e.g. a `Badge`. */
export const Symbol = forwardRef<HTMLSpanElement, SymbolProps>(
  (
    { baselineShift = 'optical', children, className, icon, style, ...props },
    ref,
  ) => {
    const mask = `uikit-symbol-${useId().replaceAll(/[^\w-]/gu, '')}`;
    const unitsPerEm = icon.unitsPerEm ?? defaultUnitsPerEm;
    const [width = 0, height = 0] = icon.viewBox
      .split(' ')
      .slice(2)
      .map(Number);
    const paths = icon.svgPathData.map(({ d }) => d);

    return (
      <span
        ref={ref}
        data-baseline-shift={baselineShift}
        data-symbol={icon.sourceName}
        style={withStyle(
          { '--uikit-symbol-height': `${String(height / unitsPerEm)}em` },
          style,
        )}
        {...props}
        className={cn('uikit-symbol', className)}
      >
        {/* (An element of its own: Chrome keeps a scaled SVG root's
            overflow, e.g. in a scroller, once it's unscaled.) */}
        <span
          className="uikit-symbol-glyph"
          data-symbol-part="glyph"
        >
          <svg
            aria-hidden="true"
            fill="currentcolor"
            height={`${String(height / unitsPerEm)}em`}
            viewBox={icon.viewBox}
            width={`${String(width / unitsPerEm)}em`}
          >
            <mask
              height={height + 2 * bleed}
              id={mask}
              maskUnits="userSpaceOnUse"
              style={{ maskType: 'luminance' }}
              width={width + 2 * bleed}
              x={-bleed}
              y={-bleed}
            >
              {/* Its shape (stroked: heavier), its edges taken off (lighter).
               */}
              {paths.map((d, index) => (
                <path
                  key={index}
                  d={d}
                  fill="#fff"
                  stroke="#fff"
                />
              ))}
              {/* (Unresolved, it takes nothing off: not the symbol's stroke.)
               */}
              <g style={{ strokeWidth: 0 }}>
                {paths.map((d, index) => (
                  <path
                    key={index}
                    d={d}
                    fill="none"
                    stroke="#000"
                    style={{
                      strokeWidth: 'var(--uikit-symbol-thinning, 0px)',
                    }}
                  />
                ))}
              </g>
            </mask>
            {/* Its color through it (not its own paths: their edges' coverage
                would count twice, thinning every symbol). */}
            <rect
              fill="currentcolor"
              height={height + 2 * bleed}
              mask={`url(#${mask})`}
              width={width + 2 * bleed}
              x={-bleed}
              y={-bleed}
            />
          </svg>
        </span>
        {children}
      </span>
    );
  },
);
