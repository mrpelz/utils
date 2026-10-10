import { IconDefinition } from '@bradleyhodges/sfsymbols-react/types';
import { FunctionComponent, useId } from 'react';

// The catalogue's paths are SF Pro glyphs at 20pt (e.g. `circle` is 19.92
// wide, the glyph's ink box 0.996em).
const UNITS_PER_EM = 20;

// Room for strokes beyond the view box (in its units, see `fontWeight`).
const bleed = 2;

/**
 * An SF Symbol, sized like the SF Pro glyph at the current font size, so it
 * can stand in for one (e.g. `􀋃` in Figma). The components weigh it by
 * their font weight (see `fontWeight`): heavier than regular, stroked;
 * lighter, masked by its own outline stroked as much (`--styled-symbol-
 * thinning`, in its units), which takes as much off its edges.
 */
export const SFSymbol: FunctionComponent<{ icon: IconDefinition }> = ({
  icon,
}) => {
  const mask = `sf-symbol-${useId().replaceAll(/[^\w-]/gu, '')}`;
  const [width = 0, height = 0] = icon.viewBox.split(' ').slice(2).map(Number);
  const paths = icon.svgPathData.map(({ d }) => d);

  return (
    <svg
      aria-hidden="true"
      fill="currentcolor"
      height={`${String(height / UNITS_PER_EM)}em`}
      // Strokes (see `fontWeight`) extend beyond the view box; the margin is
      // the glyph's side bearing (SF Pro: `circle` 0.087em, `magnifyingglass`
      // 0.112em, `star.fill` 0.096em).
      style={{ marginInline: '0.1em', overflow: 'visible' }}
      viewBox={icon.viewBox}
      width={`${String(width / UNITS_PER_EM)}em`}
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
        {/* Its shape (stroked: heavier), its edges taken off (lighter). */}
        {paths.map((d, index) => (
          <path
            key={index}
            d={d}
            fill="#fff"
            stroke="#fff"
          />
        ))}
        {/* (Unresolved, it takes nothing off: not the symbol's stroke.) */}
        <g style={{ strokeWidth: 0 }}>
          {paths.map((d, index) => (
            <path
              key={index}
              d={d}
              fill="none"
              stroke="#000"
              style={{ strokeWidth: 'var(--styled-symbol-thinning, 0px)' }}
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
  );
};
