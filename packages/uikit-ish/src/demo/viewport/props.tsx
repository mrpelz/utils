import { commonPropOptions } from '../frame/prop-control.js';

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
  safeArea: safeAreas,
};

export const propOptionsBlockEnd = {
  ...elementOptions,
  keyboard: [undefined, 'push', 'cover'] as const,
  safeArea: safeAreas,
};
