import { Viewport } from '../../../components/index.js';
import {
  commonPropOptions,
  MappedProp,
} from '../../tooling/frame/prop-control.js';
import { codeLabel } from '../../tooling/frame/render-code.js';

const safeAreas = [undefined, 'all', 'block', 'inline', 'none'] as const;
// (The content layer's: also `auto`, its default, by what it holds.)
const contentSafeAreas = [
  undefined,
  'auto',
  'all',
  'block',
  'inline',
  'none',
] as const;

// Each anchor (and the content layer) is off by default: they float over
// the whole page.
export const propOptionsTop = {
  shown: [false, true] as const,
  safeArea: safeAreas,
};

export const propOptionsBottom = {
  shown: [false, true] as const,
  keyboard: [undefined, 'push', 'cover'] as const,
  safeArea: safeAreas,
};

export const propOptionsSide = {
  shown: [false, true] as const,
  safeArea: safeAreas,
};

export const propOptionsLayer = {
  shown: [false, true] as const,
  keyboard: [undefined, 'resize', 'overlay'] as const,
  alwaysBounce: [undefined, true, false] as const,
  safeArea: contentSafeAreas,
};

// The guide pages' views (see overview.tsx, parts.tsx): each part's props,
// outlined by default (its own element's class name and style; it has no
// `render`).
const elementOptions = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
};

export const propOptionsOverviewContent = {
  keyboard: [undefined, 'resize', 'overlay'] as const,
  alwaysBounce: [undefined, true, false] as const,
  safeArea: contentSafeAreas,
};

export const propOptionsOverviewBlockStart = {
  shown: [true, false] as const,
  safeArea: safeAreas,
};

export const propOptionsOverviewBlockEnd = {
  shown: [true, false] as const,
  keyboard: [undefined, 'push', 'cover'] as const,
  safeArea: safeAreas,
};

export const propOptionsProvider = {
  // (Unset: the provided portal container, e.g. a frame's screen; null: the
  // window.)
  screen: [undefined, null] as const,
};

/** The scroll hooks' options (`useViewportScroll`, `useScrollDirection`). */
export const propOptionsScrollOptions = {
  threshold: [undefined, 0, 8, 50, 200] as const,
};

export const propOptionsContent = {
  ...elementOptions,
  keyboard: [undefined, 'resize', 'overlay'] as const,
  alwaysBounce: [undefined, true, false] as const,
  safeArea: contentSafeAreas,
};

/**
 * The views' anchor handles (see `Viewport.createAnchorHandle`): an
 * anchor's `handle`, a padding's `anchor` (each view's own, in its screen):
 * a bar's, a toast's (the handle's view).
 */
export const barAnchor = codeLabel(
  Viewport.createAnchorHandle(),
  'barAnchor',
  'const barAnchor = Viewport.createAnchorHandle(); // (at module level)',
);

export const toastAnchor = codeLabel(
  Viewport.createAnchorHandle(),
  'toastAnchor',
  'const toastAnchor = Viewport.createAnchorHandle(); // (at module level)',
);

const handleOptions = [
  undefined,
  new MappedProp(barAnchor, '[barAnchor]'),
] as const;

/** An anchor's edge effect, and a tint (red: recording; blue: a state). */
const edgeEffects = [undefined, 'soft', 'hard', 'none'] as const;
const edgeTints = [
  undefined,
  'rgb(255 59 48 / 35%)',
  'rgb(0 122 255 / 30%)',
] as const;

export const propOptionsAnchor = {
  ...elementOptions,
  edge: ['block-end', 'block-start', 'inline-start', 'inline-end'] as const,
  edgeEffect: edgeEffects,
  edgeTint: edgeTints,
  handle: handleOptions,
  keyboard: [undefined, 'push', 'cover'] as const,
  safeArea: safeAreas,
};

export const propOptionsBlockStart = {
  ...elementOptions,
  edgeEffect: edgeEffects,
  edgeTint: edgeTints,
  handle: handleOptions,
  // (An anchor's, effective at the block end only.)
  keyboard: [undefined, 'push', 'cover'] as const,
  safeArea: safeAreas,
};

export const propOptionsBlockEnd = {
  ...elementOptions,
  edgeEffect: edgeEffects,
  edgeTint: edgeTints,
  handle: handleOptions,
  keyboard: [undefined, 'push', 'cover'] as const,
  safeArea: safeAreas,
};

/**
 * A view's padding at the content's end (overlaid); `edge` first. (Its
 * bars by edge: linking them, see the handle's view.)
 */
export const propOptionsPaddingEnd = {
  ...elementOptions,
  edge: ['block-end', 'block-start'] as const,
  anchor: [undefined, null] as const,
  margin: [undefined, 0, 32] as const,
};

/** The overscroll area's view: past the content's start, or its end. */
export const propOptionsOverscroll = {
  ...elementOptions,
  edge: [undefined, 'block-end'] as const,
  anchor: [undefined, null] as const,
  open: [undefined, true, false] as const,
  safeArea: safeAreas,
};

/** A view's padding at the content's start. */
export const propOptionsPaddingStart = {
  ...elementOptions,
  edge: [undefined, 'block-end'] as const,
  anchor: [undefined, null] as const,
  margin: [undefined, 0, 32] as const,
};

/** The padding's view's content: its bottom bar, one row or two. */
export const propOptionsPaddingContent = {
  rows: [1, 2] as const,
};

/**
 * The handle's view: its end padding by the toolbar alone, by the toolbar
 * and the toast (the taller), or by edge (all at the bottom: the same).
 */
export const propOptionsHandlePadding = {
  ...elementOptions,
  edge: ['block-end'] as const,
  anchor: [
    new MappedProp(barAnchor, '[barAnchor]'),
    new MappedProp([barAnchor, toastAnchor], '[[barAnchor, toastAnchor]]'),
    undefined,
    null,
  ] as const,
  margin: [undefined, 0, 32] as const,
};

/**
 * `useElementVisibility`'s options (`scroller`: the view's box, or none: the
 * viewport).
 */
export const propOptionsElementVisibility = {
  scroller: ['box', 'viewport'] as const,
  threshold: [0, 0.5, 1] as const,
  rootMargin: ['0px', '-40px', '40px'] as const,
};

/** `useElementGeometry`'s options (as above). */
export const propOptionsElementGeometry = {
  scroller: ['box', 'viewport'] as const,
};

/** The input guards' hooks' arguments (see parts.tsx). */
export const propOptionsInputZoom = {
  enabled: [true, false] as const,
};

export const propOptionsTextActions = {
  enabled: [true, false] as const,
};

export const propOptionsFocusShift = {
  // Its target: the view's fields' frame, or the document.
  target: ['frame', 'document'] as const,
  enabled: [true, false] as const,
};
