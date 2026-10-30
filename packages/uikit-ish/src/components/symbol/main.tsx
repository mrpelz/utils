import './style.css';

import { forwardRef } from 'react';

import { cn, withStyle } from '../utils/main.js';
import type { SymbolIcon, SymbolProps } from './props.js';

export type { SymbolIcon, SymbolProps } from './props.js';

// An icon's outlines (e.g. an SF Symbol's; the library ships none), sized
// like the SF Pro glyph at the current font size, so it can stand in for
// one. Its outlines are filled as given (SF Symbols': the Regular weight
// only, whatever its host's font weight), its layers at their relative
// opacities.
//
// Emphasized (e.g. a selected tab's), it shows its `emphasizedIcon` (e.g.
// the filled variant) instead: both glyphs stacked, faded by
// `--uikit-symbol-emphasis` (0 to 1, inherited: set by its host, e.g. on
// its selected state; see styles.css), so no state of the app's needs to
// pick the icon.
//
// Its children (e.g. a `Badge`) sit on it: the glyphs alone are blended
// and scaled by its host (`--uikit-symbol-blend`, `--uikit-symbol-scale`,
// e.g. a glass button's vibrant content), so they stay solid.

// In a line of text, its ink's center on the text's: half the cap height up
// from the baseline (`baselineShift`, see style.css).
//
// SF Symbols' paths are SF Pro glyphs at 20pt (e.g. `circle` is 19.92 wide,
// the glyph's ink box 0.996em): other icons give their own units.
const defaultUnitsPerEm = 20;

/** An icon's size (em), from its view box. */
const sizeOf = ({ unitsPerEm = defaultUnitsPerEm, viewBox }: SymbolIcon) => {
  const [width = 0, height = 0] = viewBox.split(' ').slice(2).map(Number);
  return { height: height / unitsPerEm, width: width / unitsPerEm };
};

// An icon's glyph: its layers, each at its opacity relative to the most
// opaque one's.
const Glyph = ({
  icon,
  variant,
}: {
  icon: SymbolIcon;
  variant?: 'emphasized' | 'regular';
}) => {
  const { height, width } = sizeOf(icon);
  const opacity = Math.max(
    ...icon.svgPathData.map(({ fillOpacity = 1 }) => fillOpacity),
  );

  return (
    // (An element of its own: Chrome keeps a scaled SVG root's overflow,
    // e.g. in a scroller, once it's unscaled.)
    <span
      className="uikit-symbol-glyph"
      data-symbol-part="glyph"
      data-variant={variant}
    >
      <svg
        aria-hidden="true"
        fill="currentcolor"
        height={`${String(height)}em`}
        viewBox={icon.viewBox}
        width={`${String(width)}em`}
      >
        {icon.svgPathData.map(({ d, fillOpacity = 1 }, index) => (
          <path
            key={index}
            d={d}
            fillOpacity={
              fillOpacity === opacity ? undefined : fillOpacity / opacity
            }
          />
        ))}
      </svg>
    </span>
  );
};

/** An icon's outlines (e.g. an SF Symbol's), with e.g. a `Badge`. */
export const Symbol = forwardRef<HTMLSpanElement, SymbolProps>(
  (
    {
      baselineShift = 'optical',
      children,
      className,
      emphasizedIcon,
      icon,
      style,
      ...props
    },
    ref,
  ) => (
    <span
      ref={ref}
      data-baseline-shift={baselineShift}
      data-symbol={icon.sourceName}
      style={withStyle(
        { '--uikit-symbol-height': `${String(sizeOf(icon).height)}em` },
        style,
      )}
      {...props}
      className={cn('uikit-symbol', className)}
    >
      {emphasizedIcon ? (
        <>
          <Glyph
            icon={icon}
            variant="regular"
          />
          <Glyph
            icon={emphasizedIcon}
            variant="emphasized"
          />
        </>
      ) : (
        <Glyph icon={icon} />
      )}
      {children}
    </span>
  ),
);
