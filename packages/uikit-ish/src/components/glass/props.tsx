/**
 * Brightness of the content behind a glass surface: a plain page (`bright`,
 * `dim`; Figma's glass), or a background of the app's, e.g. a picture
 * (`background-bright`, `background-dim`: floating over it).
 */
export type GlassContext =
  'background-bright' | 'background-dim' | 'bright' | 'dim';

/**
 * A glass context, or `adaptive`: `background-bright` or `background-dim`,
 * by the brightness of what's behind the glass (sampled as it scrolls or
 * resizes; Apple's small glass, see `useGlassContext`).
 */
export type GlassContextValue = GlassContext | 'adaptive';

export type GlassBackgroundProps = {
  /**
   * `bar` (Figma “Tab Bar”): backdrop blur. `button` (Figma “Button - Liquid
   * Glass”): a halo instead of the backdrop blur.
   */
  kind?: 'bar' | 'button';
  /** Tint layers instead of the fill (Figma “Tinted”). */
  tinted?: boolean;
};
