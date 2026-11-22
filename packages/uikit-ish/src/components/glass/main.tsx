import './style.css';

import {
  createContext,
  FunctionComponent,
  RefObject,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';

import { useSettings } from '../settings/main.js';
import type { ColorScheme } from '../utils/main.js';
import { type BackdropTone, useBackdropTone } from './backdrop.js';
import type {
  GlassBackgroundProps,
  GlassContext,
  GlassContextValue,
  GlassMode,
} from './props.js';

export {
  type BackdropTone,
  type BackdropToneOptions,
  resampleBackdrops,
  toneOfColor,
  useBackdropTone,
} from './backdrop.js';
export {
  type BackdropArea,
  backdropGridOf,
  type BackdropMarkerValue,
  type ImageBackdropMarkerOptions,
  useBackdropMarker,
  useImageBackdropMarker,
} from './marker.js';
export type {
  GlassBackgroundProps,
  GlassContext,
  GlassContextValue,
  GlassMode,
  GlassModeProps,
  GlassSurfaceProps,
} from './props.js';

// Glass building blocks shared by components: glass materials behind
// bars and capsules, and glass lenses (the pressed, magnified state of knobs
// and selections), styled by style.css. Tokens and their sources are in
// `styles.css` (`--glass-ui-*`).

/**
 * The glass context to draw with: the given one, or (`adaptive`) the tone of
 * what's behind the element (see `useBackdropTone`), held for `dwell` ms
 * before it flips (large surfaces); none given, `undefined` (by the color
 * scheme). Reduced transparency or more contrast (opaque glass), never
 * sampled.
 */
export const useGlassContext = (
  ref: { current: Element | null },
  context: GlassContextValue | undefined,
  dwell = 0,
): GlassContext | undefined => {
  const { contrast, reducedTransparency } = useSettings();
  const sampled = useBackdropTone(ref, {
    dwell,
    enabled:
      context === 'adaptive' && !reducedTransparency && contrast !== 'more',
  });
  return context === 'adaptive' ? sampled : context;
};

/** How long a surface's sampled tone holds before it flips (ms). */
const surfaceDwell = 150;

/**
 * A glass surface's color scheme by its `context` (e.g. a sheet's, a
 * card's): bright, light; dim, dark (sampled, `adaptive`: held a moment,
 * see `useGlassContext`); none, `undefined` (the page's). Shown with
 * `data-color-scheme` and `colorSchemeStyle` on its element, and `ColorSchemeScope` around its
 * content (for `useSettings` and portals opened from it).
 */
export const useGlassScheme = (
  ref: { current: Element | null },
  context: GlassContextValue | undefined,
): ColorScheme | undefined => {
  const tone = useGlassContext(ref, context, surfaceDwell);
  if (tone === undefined) return undefined;
  return tone === 'bright' ? 'light' : 'dark';
};

/**
 * An element's style showing a color scheme of its own (for `withStyle`,
 * beside its `data-color-scheme`; none, none).
 */
export const colorSchemeStyle = (
  colorScheme: ColorScheme | undefined,
): Record<string, string> =>
  colorScheme === undefined ? {} : { 'color-scheme': colorScheme };

/**
 * A surface its content's tones are sampled within (e.g. a card's glass,
 * see `useContentTone`): its element; none, not sampled (e.g. while its
 * card's grid is editing, its veil over it).
 */
export const ContentToneScope = createContext<
  { current: Element | null } | undefined
>(undefined);

/**
 * A part's tone on the surface it's on (see `ContentToneScope`): what's
 * painted right behind it there (the surface's glass, a slider's fill),
 * sampled within it, as the surface changes. `undefined` outside one.
 */
export const useContentTone = (
  ref: { current: Element | null },
  enabled = true,
): BackdropTone | undefined => {
  const within = useContext(ContentToneScope);
  return useBackdropTone(ref, {
    enabled: enabled && within !== undefined,
    within,
  });
};

/**
 * A content part's props for its tone (see `useContentTone`): its
 * `data-backdrop-tone` and a color scheme of its own (its text's
 * `light-dark()` colors by it), for `withStyle`.
 */
export const contentToneProps = (
  tone: BackdropTone | undefined,
): { 'data-backdrop-tone'?: BackdropTone; style: Record<string, string> } =>
  tone === undefined
    ? { style: {} }
    : {
        'data-backdrop-tone': tone,
        style: colorSchemeStyle(tone === 'bright' ? 'light' : 'dark'),
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
 * `--glass-ui-tint`). `--uikit-glass-fade` (0 to 1, switched: the layers
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
      // A glass button's blur: a blurred copy of the shape (2px
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
      // blend modes from the backdrop.
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
      // The fills as a backdrop filter and a flat color, without
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
      // Glass effect (its rim and shading, emulated as in Framework7).
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

/** Whether an element can scroll (its content larger than it, either way). */
const canScroll = (element: HTMLElement) =>
  element.scrollHeight > element.clientHeight ||
  element.scrollWidth > element.clientWidth;

/**
 * A scroll container's glass (its `glass` prop, see `GlassModeProps`), as
 * its `data-glass`: `auto` resolved, flat while it can scroll (`bounces`:
 * it does anyway), measured as it or its content resizes; else as given.
 * Internal (Page, the content parts).
 */
export const useGlassMode = (
  ref: RefObject<HTMLElement | null>,
  glass: GlassMode,
  bounces: boolean,
): 'flat' | 'live' => {
  const [scrolls, setScrolls] = useState(false);
  useLayoutEffect(() => {
    const { current: element } = ref;
    if (!element || glass !== 'auto' || bounces) return undefined;

    const measure = () => setScrolls(canScroll(element));
    const resizeObserver = new ResizeObserver(measure);
    // (It and its children: its content's size.)
    const observe = () => {
      resizeObserver.disconnect();
      resizeObserver.observe(element);
      for (const child of element.children) resizeObserver.observe(child);
      measure();
    };
    const mutationObserver = new MutationObserver(observe);
    mutationObserver.observe(element, { childList: true });
    observe();

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [bounces, glass, ref]);

  if (glass !== 'auto') return glass;
  return bounces || scrolls ? 'flat' : 'live';
};
