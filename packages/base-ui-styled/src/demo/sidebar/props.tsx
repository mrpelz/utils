/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { AddLog } from '../utils/log.js';
import { commonPropOptions, MappedProp } from '../utils/main.js';

export const propOptionsContent = {
  // The layout's background (a picture, or none).
  background: ['picture', 'none'] as const,
  // The content's page background (transparent: the layout's background
  // shows through).
  pageBackground: ['transparent', 'plain', 'grouped'] as const,
  // Selecting rows (Figma “Edit Button”: their selection circles).
  editing: [false, true] as const,
};

export const propOptionsRoot = {
  ...commonPropOptions,
  floating: [true, false] as const,
};

export const getPropOptionsSidebarColumn = (addLog: AddLog) => ({
  ...commonPropOptions,
  defaultSize: [336, 280, 400] as const,
  minSize: [280, undefined, 320] as const,
  maxSize: [480, undefined, 400] as const,
  resizable: [true, false] as const,
  onSizeChange: [
    new MappedProp(
      (size: number) => addLog(`sidebar size: ${String(size)}`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

// Compact: the sidebar column as a drawer.
export const propOptionsDrawer = {
  ...commonPropOptions,
  drawer: ['inline-start', 'inline-end'] as const,
  defaultOpen: [undefined, false, true] as const,
};

export const propOptionsContentColumn = {
  ...commonPropOptions,
  clearFloating: [true, false] as const,
};

export const propOptionsSidebar = {
  ...commonPropOptions,
};
