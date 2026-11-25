import { parseCssColor } from '../color-picker/color.js';

// Colors for what cards draw on colored surfaces (a fill, a channel): the
// color scheme of text on a color (by APCA), and light added up in linear
// light (see the channels, channels.tsx).

/** APCA's luminance of an sRGB color (0 to 255 each), soft-clamped at black. */
const apcaLuminanceOf = (red: number, green: number, blue: number) => {
  const luminance =
    0.212_672_9 * (red / 255) ** 2.4 +
    0.715_152_2 * (green / 255) ** 2.4 +
    0.072_175 * (blue / 255) ** 2.4;
  return luminance < 0.022
    ? luminance + (0.022 - luminance) ** 1.414
    : luminance;
};

/**
 * APCA's contrast of text on a background (Lc's magnitude, 0 to about 108),
 * by their luminances (see `apcaLuminanceOf`): dark text on light, or light
 * text on dark, each by its own curve.
 */
const apcaContrastOf = (text: number, background: number) => {
  if (background > text) {
    const contrast = (background ** 0.56 - text ** 0.57) * 1.14;
    return contrast < 0.1 ? 0 : (contrast - 0.027) * 100;
  }
  const contrast = (background ** 0.65 - text ** 0.62) * 1.14;
  return contrast > -0.1 ? 0 : -(contrast + 0.027) * 100;
};

const darkText = apcaLuminanceOf(0, 0, 0);
const lightText = apcaLuminanceOf(255, 255, 255);

/**
 * The color scheme of what's drawn on a color (e.g. a fill): dark text (a
 * light scheme) or light text (a dark one), whichever contrasts more with
 * it, by APCA (perceived contrast: e.g. a mid blue, light text, where
 * WCAG's ratio picks dark); unreadable or nearly clear, none.
 */
export const textSchemeOn = (color: string): 'dark' | 'light' | undefined => {
  const parsed = parseCssColor(color);
  if (!parsed || parsed.a < 0.3) return undefined;
  const background = apcaLuminanceOf(parsed.r, parsed.g, parsed.b);
  return apcaContrastOf(darkText, background) >=
    apcaContrastOf(lightText, background)
    ? 'light'
    : 'dark';
};

/** A color's channels, linear light (0 to 1 each). */
export type LinearRgb = readonly [red: number, green: number, blue: number];

/** An sRGB channel (0 to 255), linear (0 to 1). */
const linearChannel = (channel: number) => {
  const value = channel / 255;
  return value <= 0.040_45 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

/** A linear channel (0 to 1), sRGB (0 to 255). */
const encodedChannel = (channel: number) => {
  const value = Math.min(Math.max(channel, 0), 1);
  return Math.round(
    (value <= 0.003_130_8
      ? value * 12.92
      : 1.055 * value ** (1 / 2.4) - 0.055) * 255,
  );
};

/** A computed color in linear light; unreadable, none. */
export const linearOf = (color: string): LinearRgb | undefined => {
  const parsed = parseCssColor(color);
  if (!parsed) return undefined;
  return [
    linearChannel(parsed.r),
    linearChannel(parsed.g),
    linearChannel(parsed.b),
  ];
};

/** Linear light as a CSS color (sRGB). */
export const cssOf = ([red, green, blue]: LinearRgb): string =>
  `rgb(${String(encodedChannel(red))} ${String(encodedChannel(green))} ${String(encodedChannel(blue))})`;

/**
 * Where a share (0 to 1) falls among a scale's colors (evenly spread): the
 * color before it, and how far it is toward the next (0 to 1).
 */
const scaleSegment = (count: number, share: number) => {
  const at = share * (count - 1);
  const index = Math.min(Math.floor(at), count - 2);
  return { index, part: at - index };
};

/**
 * A scale's color at a share (see `scaleSegment`): the two around it mixed
 * in linear light, as CSS (its thumb's).
 */
export const colorAt = (colors: readonly string[], share: number): string => {
  const { index, part } = scaleSegment(colors.length, share);
  return `color-mix(in srgb-linear, ${colors[index + 1] ?? ''} ${String(part * 100)}%, ${colors[index] ?? ''})`;
};

/** A scale's light at a share (see `colorAt`), from its colors' light. */
export const colorAtLinear = (
  colors: readonly LinearRgb[],
  share: number,
): LinearRgb | undefined => {
  const { index, part } = scaleSegment(colors.length, share);
  const from = colors[index];
  const to = colors[index + 1];
  if (!from || !to) return undefined;
  return [
    from[0] + (to[0] - from[0]) * part,
    from[1] + (to[1] - from[1]) * part,
    from[2] + (to[2] - from[2]) * part,
  ];
};
