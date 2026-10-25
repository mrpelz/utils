/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { AddLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  MappedProp,
} from '../../tooling/frame/prop-control.js';

export const propOptionsContent = {
  // The layout's background (a picture, or none).
  background: ['picture', 'none'] as const,
  // The content's page background (transparent: the layout's background
  // shows through).
  pageBackground: ['transparent', 'plain', 'grouped'] as const,
};

export const propOptionsRoot = {
  ...commonPropOptions,
};

export const getPropOptionsSidebarColumn = (addLog: AddLog) => ({
  ...commonPropOptions,
  floating: [true, false] as const,
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
  side: ['inline-start', 'inline-end'] as const,
  disablePointerDismissal: [undefined, true] as const,
  modal: [undefined, false, 'trap-focus'] as const,
};

export const propOptionsContentColumn = {
  ...commonPropOptions,
  clearFloating: [true, false] as const,
};

export const propOptionsSidebar = {
  ...commonPropOptions,
};

// The guide pages' views (see overview.tsx, parts.tsx): each part's props,
// outlined by default (its own element's class name and style; it has no
// `render`).
export const propOptionsPart = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
};

export const propOptionsGuideRoot = {
  ...propOptionsPart,
  'aria-label': ['Mailboxes', 'Folders'] as const,
};

/**
 * The floating-or-a-drawer view's content: a phone's or a tablet's layout,
 * or (unset) by the window's width.
 */
export const propOptionsAdaptiveContent = {
  layout: [undefined, 'phone', 'tablet'] as const,
};
