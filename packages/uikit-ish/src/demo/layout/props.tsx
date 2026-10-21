/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { Toolbar } from '../../components/index.js';
import { AddLog } from '../frame/log.js';
import { commonPropOptions, MappedProp } from '../frame/prop-control.js';

// Compact: the sidebar column's drawer, its swipe area.
export const propOptionsDrawer = {
  side: ['inline-start', 'inline-end'] as const,
  disablePointerDismissal: [undefined, true] as const,
  modal: [undefined, false, 'trap-focus'] as const,
};

export const propOptionsDrawerSwipeArea = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
  width: [undefined, 44] as const,
  disabled: [undefined, true] as const,
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
  floating: [undefined, true] as const,
  clearFloating: [undefined, true] as const,
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

/** A drawer's options in the guide's views (its changes logged). */
export const getPropOptionsGuideDrawer = (addLog: AddLog) => ({
  side: ['inline-start', 'inline-end'] as const,
  defaultOpen: [undefined, true] as const,
  open: [undefined, false, true] as const,
  disablePointerDismissal: [undefined, true] as const,
  modal: [undefined, false, 'trap-focus'] as const,
  onOpenChange: [
    new MappedProp(
      (open: boolean, { reason }: { reason: string }) =>
        addLog(`open: ${String(open)} (${reason})`),
      '[log change]',
    ),
    undefined,
  ] as const,
  onOpenChangeComplete: [
    undefined,
    new MappedProp(
      (open: boolean) => addLog(`open complete: ${String(open)}`),
      '[log change]',
    ),
  ] as const,
});

export const propOptionsGuideDrawerSwipeArea = {
  ...elementOptions,
  render: commonPropOptions.render,
  width: [undefined, 44] as const,
  disabled: [undefined, true] as const,
};

/** A drawer's trigger: a bar's button, or a plain one. */
export const propOptionsGuideDrawerTrigger = {
  ...elementOptions,
  render: [
    new MappedProp(<Toolbar.Button shape="circle" />, '[<Toolbar.Button />]'),
    new MappedProp(<button type="button" />, '[<button />]'),
  ] as const,
};

/** A drawer's close: its bar's Done, or a plain button. */
export const propOptionsGuideDrawerClose = {
  ...elementOptions,
  render: [
    new MappedProp(
      <Toolbar.Button prominent />,
      '[<Toolbar.Button prominent />]',
    ),
    new MappedProp(<button type="button" />, '[<button />]'),
  ] as const,
};

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
