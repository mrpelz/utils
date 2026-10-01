import { IconDefinition } from '@bradleyhodges/sfsymbols-react/types';
import SFIcon from '@bradleyhodges/sfsymbols-react/unstyled';
import { FunctionComponent } from 'react';

// The catalogue's paths are SF Pro glyphs at 20pt (e.g. `circle` is 19.92
// wide, the glyph's ink box 0.996em).
const UNITS_PER_EM = 20;

/**
 * An SF Symbol, sized like the SF Pro glyph at the current font size, so it
 * can stand in for one (e.g. `􀋃` in Figma). The components stroke it by their
 * font weight (see `fontWeight`).
 */
export const SFSymbol: FunctionComponent<{ icon: IconDefinition }> = ({
  icon,
}) => {
  const [width = 0, height = 0] = icon.viewBox.split(' ').slice(2).map(Number);

  return (
    <SFIcon
      // The catalogue's paths are 85 % opaque, glyphs aren't.
      fillOpacity={1}
      height={`${height / UNITS_PER_EM}em`}
      icon={icon}
      // Strokes (see `fontWeight`) extend beyond the view box; the margin is
      // the glyph's side bearing (SF Pro: `circle` 0.087em, `magnifyingglass`
      // 0.112em, `star.fill` 0.096em).
      style={{ marginInline: '0.1em', overflow: 'visible' }}
      width={`${width / UNITS_PER_EM}em`}
    />
  );
};
