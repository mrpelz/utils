import { commonPropOptions } from '../../tooling/frame/prop-control.js';

const safeAreas = [undefined, 'all', 'block', 'inline', 'none'] as const;

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
  safeArea: safeAreas,
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
  safeArea: safeAreas,
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
  threshold: [undefined, 0, 8, 50, 200] as const,
};

export const propOptionsContent = {
  ...elementOptions,
  keyboard: [undefined, 'resize', 'overlay'] as const,
  safeArea: safeAreas,
};

export const propOptionsAnchor = {
  ...elementOptions,
  edge: ['block-end', 'block-start', 'inline-start', 'inline-end'] as const,
  keyboard: [undefined, 'push', 'cover'] as const,
  safeArea: safeAreas,
};

export const propOptionsBlockStart = {
  ...elementOptions,
  // (An anchor's, effective at the block end only.)
  keyboard: [undefined, 'push', 'cover'] as const,
  safeArea: safeAreas,
};

export const propOptionsBlockEnd = {
  ...elementOptions,
  keyboard: [undefined, 'push', 'cover'] as const,
  safeArea: safeAreas,
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

export const propOptionsFocusShift = {
  // Its target: the view's fields' frame, or the document.
  target: ['frame', 'document'] as const,
  enabled: [true, false] as const,
};
