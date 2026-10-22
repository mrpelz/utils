/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { Button } from '../../components/index.js';
import { AddLog } from '../frame/log.js';
import { commonPropOptions, MappedProp } from '../frame/prop-control.js';

export const getPropOptionsRoot = (addLog: AddLog) => ({
  open: [undefined, true] as const,
  disabled: [undefined, false, true] as const,
  onOpenChange: [
    new MappedProp(
      (open: boolean, { reason }: { reason: string }) =>
        addLog(`open change: ${String(open)} (${reason})`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

/** `Tooltip.Root` (the parts page's): all of its props. */
export const getPropOptionsGuideRoot = (addLog: AddLog) => ({
  ...getPropOptionsRoot(addLog),
  defaultOpen: [undefined, false, true] as const,
  disableHoverablePopup: [undefined, false, true] as const,
  trackCursorAxis: [undefined, 'none', 'x', 'y', 'both'] as const,
  onOpenChangeComplete: [
    undefined,
    new MappedProp(
      (open: boolean) => addLog(`open complete: ${String(open)}`),
      '[log change]',
    ),
  ] as const,
});

export const propOptionsTrigger = {
  delay: [undefined, 0, 600, 1000] as const,
};

/** `Tooltip.Trigger` (the parts page's): a button, its delays. */
export const propOptionsGuideTrigger = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
  render: [
    new MappedProp(
      <Button.Root
        shape="circle"
        size="large"
        variant="glass"
      />,
      '[<Button.Root shape="circle" size="large" variant="glass" />]',
    ),
    undefined,
  ] as const,
  delay: [undefined, 0, 600, 1000] as const,
  closeDelay: [undefined, 0, 500] as const,
  closeOnClick: [undefined, false, true] as const,
  disabled: [undefined, false, true] as const,
};

export const propOptionsProvider = {
  delay: [undefined, 0, 300, 1000] as const,
  closeDelay: [undefined, 0, 500] as const,
  timeout: [undefined, 0, 400, 2000] as const,
};

export const propOptionsPortal = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
  keepMounted: [undefined, false, true] as const,
};

export const propOptionsPositioner = {
  ...commonPropOptions,
  side: [
    undefined,
    'block-start',
    'block-end',
    'inline-start',
    'inline-end',
  ] as const,
  align: [undefined, 'start', 'center', 'end'] as const,
};

/** `Tooltip.Positioner` (the parts page's): all of its props. */
export const propOptionsGuidePositioner = {
  ...propOptionsPositioner,
  sideOffset: [undefined, 0, 24] as const,
  alignOffset: [undefined, 0, 24] as const,
  collisionPadding: [undefined, 8, 32] as const,
  arrowPadding: [undefined, 5, 24] as const,
  sticky: [undefined, false, true] as const,
  positionMethod: [undefined, 'absolute', 'fixed'] as const,
  disableAnchorTracking: [undefined, false, true] as const,
  collisionAvoidance: [
    undefined,
    new MappedProp(
      { align: 'shift', side: 'shift' } as const,
      '[{ side: shift, align: shift }]',
    ),
  ] as const,
  collisionBoundary: [
    undefined,
    new MappedProp(
      { height: 400, width: 400, x: 0, y: 0 },
      '[{ x: 0, y: 0, width: 400, height: 400 }]',
    ),
  ] as const,
};

export const propOptionsContent = {
  text: [
    'Share',
    'A longer tooltip, wrapping onto a second line when it gets wide',
  ] as const,
};

/** The overview's few: where it is. */
export const propOptionsOverviewPositioner = {
  side: [
    undefined,
    'block-start',
    'block-end',
    'inline-start',
    'inline-end',
  ] as const,
  align: [undefined, 'start', 'center', 'end'] as const,
};

export { commonPropOptions as propOptionsPopup } from '../frame/prop-control.js';
