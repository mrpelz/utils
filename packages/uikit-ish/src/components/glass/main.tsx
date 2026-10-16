import './style.css';

import {
  createContext,
  FunctionComponent,
  useLayoutEffect,
  useState,
} from 'react';

import type {
  GlassBackgroundProps,
  GlassContext,
  GlassContextValue,
} from './props.js';

export type {
  GlassBackgroundProps,
  GlassContext,
  GlassContextValue,
} from './props.js';

// Liquid Glass building blocks shared by components: glass materials behind
// bars and capsules, and glass lenses (the pressed, magnified state of knobs
// and selections), styled by style.css. Tokens and their sources are in
// `styles.css` (`--glass-ios-*`).

// What's behind: its luminance below this, the glass turns dim; above the
// other, bright; between, it stays (Puppertino's, after Apple's).
const toDim = 0.35;
const toBright = 0.85;

let colorCanvas: CanvasRenderingContext2D | null | undefined;

// An sRGB channel (0 to 255), linear.
const linear = (channel: number) => {
  const value = channel / 255;
  return value <= 0.040_45 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

// The context for what's behind (its luminance), from the last one.
const nextContext = (
  luminance: number,
  last: GlassContext | undefined,
): GlassContext => {
  if (luminance < toDim) return 'background-dim';
  if (luminance > toBright) return 'background-bright';
  return last ?? (luminance < 0.6 ? 'background-dim' : 'background-bright');
};

/** A CSS color's relative luminance (0 to 1) and alpha. */
const luminanceOf = (color: string) => {
  colorCanvas ??= document.createElement('canvas').getContext('2d');
  if (!colorCanvas) return undefined;
  colorCanvas.fillStyle = '#000';
  colorCanvas.fillStyle = color;
  const normalized = colorCanvas.fillStyle;
  const channels = normalized.startsWith('#')
    ? [1, 3, 5].map((index) =>
        Number.parseInt(normalized.slice(index, index + 2), 16),
      )
    : (normalized.match(/[\d.]+/gu) ?? []).map(Number);
  const [red = 0, green = 0, blue = 0, alpha = 1] = channels;
  return {
    alpha,
    luminance:
      0.2126 * linear(red) + 0.7152 * linear(green) + 0.0722 * linear(blue),
  };
};

const colorPattern =
  /(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\([^)]*\)|#[\da-f]{3,8}\b/giu;

// The colors an element's background shows: its color, or its gradients'
// (undefined: an image, unknown; empty: none).
const backgroundColorsOf = (element: Element): string[] | undefined => {
  const { backgroundColor, backgroundImage } = getComputedStyle(element);
  if (backgroundImage.includes('url(')) return undefined;
  return [
    ...(backgroundImage === 'none'
      ? []
      : (backgroundImage.match(colorPattern) ?? [])),
    backgroundColor,
  ].filter((color) => (luminanceOf(color)?.alpha ?? 0) >= 0.3);
};

/** The luminance of what's behind an element (its center and corners). */
const luminanceBehind = (element: Element) => {
  const { bottom, left, right, top } = element.getBoundingClientRect();
  const inset = 4;
  const points = [
    [(left + right) / 2, (top + bottom) / 2],
    [left + inset, top + inset],
    [right - inset, top + inset],
    [left + inset, bottom - inset],
    [right - inset, bottom - inset],
  ];
  const values: number[] = [];
  for (const [x = 0, y = 0] of points) {
    const stack = document.elementsFromPoint(x, y);
    // Below the element (not what's over it, nor the element itself), in
    // paint order (the page's layers, not only its ancestors): the first
    // with a background.
    const at = stack.findIndex((candidate) => element.contains(candidate));
    let colors: string[] | undefined = [];
    for (const candidate of stack.slice(at === -1 ? 0 : at)) {
      if (element.contains(candidate)) continue;
      colors = backgroundColorsOf(candidate);
      if (colors?.length !== 0) break;
    }
    if (!colors) continue;
    for (const color of colors) {
      const value = luminanceOf(color)?.luminance;
      if (value !== undefined) values.push(value);
    }
  }
  return values.length === 0
    ? undefined
    : values.reduce((sum, value) => sum + value, 0) / values.length;
};

/**
 * The glass context to draw with: the given one, or (`adaptive`) one by
 * what's behind the element, sampled as the page scrolls or resizes.
 */
export const useGlassContext = (
  ref: { current: Element | null },
  context: GlassContextValue | undefined,
): GlassContext | undefined => {
  const [sampled, setSampled] = useState<GlassContext | undefined>(undefined);

  useLayoutEffect(() => {
    const { current: element } = ref;
    if (context !== 'adaptive' || !element) return undefined;

    let frame = 0;
    let last: GlassContext | undefined;
    const update = () => {
      frame = 0;
      const luminance = luminanceBehind(element);
      if (luminance === undefined) return;
      const next = nextContext(luminance, last);
      if (next === last) return;
      last = next;
      setSampled(next);
    };
    const schedule = () => {
      frame ||= requestAnimationFrame(update);
    };
    update();
    addEventListener('scroll', schedule, { capture: true, passive: true });
    addEventListener('resize', schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(element);

    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('scroll', schedule, { capture: true });
      removeEventListener('resize', schedule);
      observer.disconnect();
    };
  }, [context, ref]);

  return context === 'adaptive' ? sampled : context;
};

/**
 * The context of the glass bar a component is in (e.g. a `Toolbar`'s), for
 * glass inside it without a context of its own (e.g. a `PageControl`).
 */
export const InheritedGlassContext = createContext<GlassContext | undefined>(
  undefined,
);

/**
 * The glass material of a capsule (blur, fill or tint, and glass effect
 * layers), rendered as the first children of a positioned element that is
 * inside a `glassContext`. The layers stack by document order (no `z-index`,
 * nothing isolated at full opacity), so the backdrop filters and the tint's
 * blend modes reach the content behind; the element's later children must be
 * positioned (or blended) to be drawn above.
 *
 * Tinted glass takes its color from `--uikit-glass-tint` (default:
 * `--glass-ios-tint`). `--uikit-glass-fade` (0 to 1, switched: the layers
 * transition themselves) fades it out: opacity on the element instead would
 * make it a backdrop root (the blur and fill would see nothing behind) and
 * isolate its content's blend modes while fading (WebKit). As a lens (e.g.
 * pressed), `--uikit-glass-scale` scales it up, and `--uikit-glass-pressed` (0
 * to 1) clears the fill and shows the lens' edge.
 */
export const GlassBackground: FunctionComponent<GlassBackgroundProps> = ({
  kind = 'bar',
  tinted = false,
}) => (
  <>
    {kind === 'bar' ? (
      <span
        aria-hidden="true"
        className="uikit-glass-blur"
        data-glass-part="blur"
      />
    ) : (
      // Figma “Button - Liquid Glass” “Blur”: a blurred copy of the shape (2px
      // down, blur(10px)), masked to outside the shape, which is what an outer
      // shadow draws. The masked backdrop blur only shows as a 2px sliver below
      // the shape and is left out.
      <span
        aria-hidden="true"
        className="uikit-glass-halo"
        data-glass-part="halo"
      />
    )}
    {tinted ? (
      // The tint layers are a group with a drop shadow, which isolates their
      // blend modes from the backdrop (Figma export: a filtered group).
      <span
        aria-hidden="true"
        className="uikit-glass-tint-group"
        data-glass-part="tint-group"
      >
        <span
          className="uikit-glass-tint-base"
          data-glass-part="tint-base"
        />
        <span
          className="uikit-glass-tint-saturation"
          data-glass-part="tint-saturation"
        />
        <span
          className="uikit-glass-tint-overlay"
          data-glass-part="tint-overlay"
        />
        <span
          className="uikit-glass-tint"
          data-glass-part="tint"
        />
      </span>
    ) : (
      // The fills (Figma “Fill”) as a backdrop filter and a flat color, without
      // blend modes (see `styles.css`); they clear as a lens (as the slider
      // thumb's knob).
      <span
        aria-hidden="true"
        className="uikit-glass-fill"
        data-glass-part="fill"
      />
    )}
    {tinted ? (
      <span
        aria-hidden="true"
        className="uikit-glass-tinted-effect"
        data-glass-part="tinted-effect"
      />
    ) : (
      // Glass effect (Figma “Glass Effect”, emulated as in Framework7).
      <span
        aria-hidden="true"
        className="uikit-glass-effect"
        data-glass-part="effect"
      />
    )}
    {/* The lens' edge while pressed (as the slider thumb's knob). */}
    <span
      aria-hidden="true"
      className="uikit-glass-lens"
      data-glass-part="lens"
    />
  </>
);
