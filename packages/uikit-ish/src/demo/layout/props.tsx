/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { AddLog } from '../frame/log.js';
import { commonPropOptions, MappedProp } from '../frame/prop-control.js';

// Compact: the sidebar column as a drawer.
export const propOptionsDrawer = {
  ...commonPropOptions,
  drawer: ['inline-start', 'inline-end'] as const,
  defaultOpen: [undefined, false, true] as const,
};

export const propOptionsRoot = {
  ...commonPropOptions,
};

/** A column's options; `defaultSize` first (`undefined`: flexible). */
export const getPropOptionsColumn = (
  name: string,
  defaultSize: number | undefined,
  resizable: boolean,
  addLog: AddLog,
) => ({
  ...commonPropOptions,
  defaultSize: [
    defaultSize,
    ...[undefined, 280, 360].filter((size) => size !== defaultSize),
  ],
  size: [undefined, 320] as const,
  minSize: [undefined, 200, 280] as const,
  maxSize: [undefined, 400, 480] as const,
  resizable: [resizable, !resizable] as const,
  onSizeChange: [
    new MappedProp(
      (size: number) => addLog(`${name} size: ${String(size)}`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

// The guide pages' views (see overview.tsx, parts.tsx): each part's props,
// outlined by default (its own element's class name and style; it has no
// `render`).
const elementOptions = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
};

export const propOptionsGuideRoot = {
  ...elementOptions,
  compact: [undefined, false, true] as const,
};

export const propOptionsGuideBackground = elementOptions;

/** A column's options in the guide's views (see `getPropOptionsColumn`). */
export const getPropOptionsGuideColumn = (
  name: string,
  defaultSize: number | undefined,
  resizable: boolean,
  addLog: AddLog,
) => {
  const { render: _render, ...options } = getPropOptionsColumn(
    name,
    defaultSize,
    resizable,
    addLog,
  );
  return options;
};
