/**
 * The tone of glass: for content behind it that's bright (light glass) or
 * dim (dark glass).
 */
export type GlassContext = 'bright' | 'dim';

/**
 * A glass context, or `adaptive`: by the tone of what's behind the glass
 * (sampled as it scrolls or resizes, see `useBackdropTone`).
 */
export type GlassContextValue = GlassContext | 'adaptive';

/** A glass surface's props (a sidebar's, a sheet's, a card's, a menu's). */
export type GlassSurfaceProps = {
  /**
   * How bright the content behind it is: bright, light glass; dim, dark
   * glass (`adaptive`: by what's behind it, held a moment before it flips,
   * see `useBackdropTone`). Its content follows, in the color scheme of its
   * glass (light, dark), as do menus and popovers opened from it.
   * @default the color scheme's
   */
  context?: GlassContextValue;
};

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
