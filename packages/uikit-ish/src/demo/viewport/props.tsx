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
