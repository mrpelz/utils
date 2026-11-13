/**
 * Brightness of the content behind a glass surface: a plain page (`bright`,
 * `dim`), or a background of the app's, e.g. a picture
 * (`background-bright`, `background-dim`: floating over it).
 */
export type GlassContext =
  'background-bright' | 'background-dim' | 'bright' | 'dim';

/**
 * A glass context, or `adaptive`: `background-bright` or `background-dim`,
 * by the brightness of what's behind the glass (sampled as it scrolls or
 * resizes; small glass, see `useGlassContext`).
 */
export type GlassContextValue = GlassContext | 'adaptive';

export type GlassBackgroundProps = {
  /**
   * `bar` (e.g. a tab bar): backdrop blur. `button` (a glass button): a halo
   * instead of the backdrop blur.
   */
  kind?: 'bar' | 'button';
  /** Tint layers instead of the fill (tinted glass). */
  tinted?: boolean;
};

/** A scroll container's glass (see `GlassModeProps`). */
export type GlassMode = 'auto' | 'flat' | 'live';

/** A scroll container's `glass` prop (Page, content parts). */
export type GlassModeProps = {
  /**
   * The glass in it (e.g. glass buttons, text fields): `live`, blurring
   * what's behind (backdrop filters, isolated, blended); `flat`, opaque,
   * drawn over its background (`--uikit-glass-backdrop`) as the live glass
   * would look, without backdrop filters, isolation or blend modes; `auto`,
   * flat while it can scroll (its content larger than it, or bouncing
   * anyway: `alwaysBounce`), else live. Flat for glass in content that
   * scrolls: on iOS, live glass there ends the scroll's glides (see the
   * docs' iOS Quirks). A live one within a flat one is live again.
   * @default 'auto'
   */
  glass?: GlassMode;
};
