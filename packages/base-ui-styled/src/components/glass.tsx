import { styled } from 'goober';
import { FunctionComponent } from 'react';

import { css } from './utils.js';

// Liquid Glass building blocks shared by components: glass materials behind
// bars and capsules, and glass lenses (the pressed, magnified state of knobs
// and selections). Tokens and their sources are in `styles.tsx`
// (`--glass-ios-*`).

/** Brightness of the content behind a glass surface. */
export type GlassContext = 'bright' | 'dim';

const tint = 'var(--styled-glass-tint, var(--glass-ios-tint))';

// Glass effect of tinted glass: Framework7 `fab-vars.less`
// (`--f7-glass-shadow-fab`, light for bright, dark for dim), mixed with the
// element's tint, so it's declared here instead of as a global token.
const tintedShadow: Record<GlassContext, string> = {
  bright: [
    'inset -3px -3px 0 -3.5px #fff',
    'inset 3px 3px 0 -3.5px #fff',
    'inset 0 0 0 0.5px rgb(255 255 255 / 50%)',
    `inset 3px 3px 10px -2px ${tint}`,
    `inset -3px -3px 10px -2px ${tint}`,
    'inset 0 0 5px 1px #fff',
    '0 0 15px 4px rgb(0 0 0 / 20%)',
  ].join(', '),
  dim: [
    `inset 3px 3px 0 -3.5px ${tint}`,
    `inset -3px -3px 0 -3.5px ${tint}`,
    'inset -0.5px -0.5px 0 rgb(255 255 255 / 50%)',
    'inset 0.5px 0.5px 0 rgb(255 255 255 / 10%)',
    'inset -3px 3px 0 -3.5px rgb(255 255 255 / 25%)',
    `inset 0 -5px 0 -3.5px color-mix(in oklab, ${tint} 50%, transparent 10%)`,
    `inset 0 -5px 5px color-mix(in oklab, ${tint} 50%, transparent 10%)`,
    '0 0 15px 4px rgb(0 0 0 / 20%)',
  ].join(', '),
};

const contextVars = (context: GlassContext) => css`
  --styled-glass-blur: var(--glass-ios-${context}-blur);
  --styled-glass-fill-bottom: var(--glass-ios-${context}-fill-bottom);
  --styled-glass-fill-bottom-blend: var(
    --glass-ios-${context}-fill-bottom-blend
  );
  --styled-glass-fill-middle: var(--glass-ios-${context}-fill-middle);
  --styled-glass-fill-top: var(--glass-ios-${context}-fill-top);
  --styled-glass-fill-top-blend: var(--glass-ios-${context}-fill-top-blend);
  --styled-glass-fill-opacity: var(--glass-ios-${context}-fill-opacity);
  --styled-glass-content: var(--glass-ios-${context}-content);
  --styled-glass-content-blend: var(--glass-ios-${context}-content-blend);
  --styled-glass-content-disabled: var(--glass-ios-${context}-content-disabled);
  --styled-glass-content-prominent: var(
    --glass-ios-${context}-content-prominent
  );
  --styled-glass-content-prominent-blend: var(
    --glass-ios-${context}-content-prominent-blend
  );
  --styled-glass-content-prominent-disabled: var(
    --glass-ios-${context}-content-prominent-disabled
  );
  --styled-glass-selection: var(--glass-ios-${context}-selection);
  --styled-glass-selection-blend: var(--glass-ios-${context}-selection-blend);
  --styled-glass-shadow: var(--glass-ios-${context}-shadow);
  --styled-glass-shadow-tinted: ${tintedShadow[context]};
  --styled-glass-lens: var(--glass-ios-${context}-lens);
  --styled-glass-lens-shadow: var(--glass-ios-${context}-lens-shadow);
`;

/**
 * Declares the `--styled-glass-*` custom properties for the given context,
 * used by `GlassBackground` and by glass content (vibrant text, selections,
 * lenses). Without a context, it follows the color scheme (bright, or dim in
 * dark mode).
 */
export const glassContext = (context?: GlassContext): string =>
  context
    ? contextVars(context)
    : css`
        ${contextVars('bright')}

        @media (prefers-color-scheme: dark) {
          ${contextVars('dim')}
        }
      `;

/**
 * Scale of a glass lens: 1 at rest, `--glass-ios-lens-scale` while pressed.
 *
 * @param pressed CSS expression from 0 (rest) to 1 (pressed)
 */
export const glassLensScale = (pressed: string): string =>
  `calc(1 + (var(--glass-ios-lens-scale) - 1) * ${pressed})`;

// Figma “BG”: the glass extends `--styled-glass-outset` (4px for bars)
// beyond its element.
const glassBox = css`
  position: absolute;
  border-radius: 1000px;
  inset: calc(var(--styled-glass-outset, 4px) * -1);
  pointer-events: none;
`;

// As a lens (`--styled-glass-scale`), a layer scales up around the element's
// content. Unscaled layers have no `scale`, which would make them stacking
// contexts and isolate the blend modes of their children.
const lensLayer = css`
  scale: var(--styled-glass-scale, none);
  transition-duration: var(--glass-ios-lens-duration);
  transition-property: scale, opacity;
`;

const glassLayer = css`
  ${glassBox}
  ${lensLayer}
`;

const Blur = styled('span')`
  ${glassLayer}

  backdrop-filter: saturate(180%) blur(20px);
  background-color: var(--styled-glass-blur);
  opacity: 0.67;
`;

// Figma “Button - Liquid Glass” “Blur”: a blurred copy of the shape (2px
// down, blur(10px)), masked to outside the shape, which is what an outer
// shadow draws. The masked backdrop blur only shows as a 2px sliver below
// the shape and is left out.
const Halo = styled('span')`
  ${glassLayer}

  box-shadow: 0 2px 20px var(--styled-glass-blur);
  opacity: 0.67;
`;

// The opacity applies to the fills as a group (isolating their blend modes
// from the backdrop when below 1), as in the Figma “Fill” layer. The group is
// never scaled or faded (which would isolate the fills at full opacity too);
// its fills are, and they clear as a lens (as the slider thumb's knob).
const Fill = styled('span')`
  ${glassBox}

  opacity: var(--styled-glass-fill-opacity);
`;

const fillLayer = css`
  position: absolute;
  border-radius: inherit;
  inset: 0;
`;

const lensFillLayer = css`
  ${fillLayer}
  ${lensLayer}

  opacity: calc(1 - var(--styled-glass-pressed, 0));
`;

const FillBottom = styled('span')`
  ${lensFillLayer}

  background-color: var(--styled-glass-fill-bottom);
  mix-blend-mode: var(--styled-glass-fill-bottom-blend);
`;

const FillMiddle = styled('span')`
  ${lensFillLayer}

  background-color: var(--styled-glass-fill-middle);
`;

const FillTop = styled('span')`
  ${lensFillLayer}

  background-color: var(--styled-glass-fill-top);
  mix-blend-mode: var(--styled-glass-fill-top-blend);
`;

// The tint layers are a group with a drop shadow, which isolates their blend
// modes from the backdrop (Figma export: a filtered group).
const TintGroup = styled('span')`
  ${glassLayer}

  box-shadow: var(--glass-ios-tint-shadow);
  isolation: isolate;
`;

const TintBase = styled('span')`
  ${fillLayer}

  background-color: var(--glass-ios-tint-base);
`;

const TintSaturation = styled('span')`
  ${fillLayer}

  background-color: var(--glass-ios-tint-saturation);
  mix-blend-mode: saturation;
`;

const TintOverlay = styled('span')`
  ${fillLayer}

  background-color: var(--glass-ios-tint-overlay);
  mix-blend-mode: overlay;
`;

const Tint = styled('span')`
  ${fillLayer}

  background-color: ${tint};
  mix-blend-mode: var(--glass-ios-tint-blend);
`;

// Glass effect (Figma “Glass Effect”, emulated as in Framework7).
const Effect = styled('span')`
  ${glassLayer}

  box-shadow: var(--styled-glass-shadow);
`;

const TintedEffect = styled('span')`
  ${glassLayer}

  box-shadow: var(--styled-glass-shadow-tinted);
`;

// The lens' edge while pressed (as the slider thumb's knob).
const Lens = styled('span')`
  ${glassLayer}

  box-shadow: var(--styled-glass-lens-shadow);
  opacity: var(--styled-glass-pressed, 0);
`;

export type GlassBackgroundProps = {
  /**
   * `bar` (Figma “Tab Bar”): backdrop blur. `button` (Figma “Button - Liquid
   * Glass”): a halo instead of the backdrop blur.
   */
  kind?: 'bar' | 'button';
  /** Tint layers instead of the fill (Figma “Tinted”). */
  tinted?: boolean;
};

/**
 * The glass material of a capsule (blur, fill or tint, and glass effect
 * layers), rendered as the first children of a positioned element that is
 * inside a `glassContext`. The layers stack by document order (no `z-index`,
 * nothing isolated at full opacity), so the blur and blend modes reach the
 * content behind; the element's later children must be positioned (or
 * blended) to be drawn above.
 *
 * Tinted glass takes its color from `--styled-glass-tint` (default:
 * `--glass-ios-tint`). As a lens (e.g. pressed), `--styled-glass-scale` scales
 * it up, and `--styled-glass-pressed` (0 to 1) clears the fill and shows the
 * lens' edge.
 */
export const GlassBackground: FunctionComponent<GlassBackgroundProps> = ({
  kind = 'bar',
  tinted = false,
}) => (
  <>
    {kind === 'bar' ? <Blur aria-hidden="true" /> : <Halo aria-hidden="true" />}
    {tinted ? (
      <TintGroup aria-hidden="true">
        <TintBase />
        <TintSaturation />
        <TintOverlay />
        <Tint />
      </TintGroup>
    ) : (
      <Fill aria-hidden="true">
        <FillBottom />
        <FillMiddle />
        <FillTop />
      </Fill>
    )}
    {tinted ? (
      <TintedEffect aria-hidden="true" />
    ) : (
      <Effect aria-hidden="true" />
    )}
    <Lens aria-hidden="true" />
  </>
);

/**
 * Declarations for a `::before` pseudo-element drawing the tinted glow behind
 * a pressed glass lens (Framework7 `toggle-ios.less`, `range-ios.less`:
 * `.toggle-icon::before`, `.range-knob::before`).
 *
 * @param color the glow's color, at 75% opacity
 * @param opacity CSS expression from 0 (rest) to 1 (pressed)
 */
export const glassLensGlow = (color: string, opacity: string): string => css`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1px;
  height: 1px;
  margin: -0.5px 0 0 -0.5px;
  box-shadow: 0 0 40px 15px color-mix(in srgb, ${color} 75%, transparent);
  content: '';
  opacity: ${opacity};
  transition-duration: var(--glass-ios-lens-duration);
`;
