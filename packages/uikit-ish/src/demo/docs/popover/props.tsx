/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { Button, Toolbar } from '../../../components/index.js';
import { AddLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  MappedProp,
} from '../../tooling/frame/prop-control.js';

export const getPropOptionsRoot = (addLog: AddLog) => ({
  defaultOpen: [undefined, false, true] as const,
  modal: [undefined, false, true, 'trap-focus'] as const,
  onOpenChange: [
    new MappedProp(
      (isOpen: boolean, { reason }: { reason: string }) =>
        addLog(`open change: ${String(isOpen)} (${reason})`),
      '[log change]',
    ),
    undefined,
  ] as const,
  onOpenChangeComplete: [
    undefined,
    new MappedProp(
      (isOpen: boolean) => addLog(`open complete: ${String(isOpen)}`),
      '[log change]',
    ),
  ] as const,
});

/** The overview's few: its modality, its changes logged. */
export const getPropOptionsOverviewRoot = (addLog: AddLog) => ({
  modal: [undefined, true, 'trap-focus'] as const,
  onOpenChange: [
    new MappedProp(
      (isOpen: boolean, { reason }: { reason: string }) =>
        addLog(`open change: ${String(isOpen)} (${reason})`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

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

/** `Popover.Root` (the parts page's): its state, its changes logged. */
export const getPropOptionsGuideRoot = (addLog: AddLog) => ({
  ...getPropOptionsRoot(addLog),
  open: [undefined, false, true] as const,
});

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

/** `Popover.Positioner` (the parts page's): all of its props. */
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
    new MappedProp(
      { fallbackAxisSide: 'none', side: 'none' } as const,
      '[{ side: none, fallbackAxisSide: none }]',
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

/** `Popover.Trigger`: a button, its hover opening. */
export const propOptionsTrigger = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
  render: [
    new MappedProp(
      <Button.Root
        size="large"
        variant="bordered"
      />,
      '[<Button.Root size="large" variant="bordered" />]',
    ),
    undefined,
  ] as const,
  openOnHover: [undefined, false, true] as const,
  delay: [undefined, 0, 1000] as const,
  closeDelay: [undefined, 0, 500] as const,
  nativeButton: [undefined, true] as const,
};

export const propOptionsPortal = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
  keepMounted: [undefined, false, true] as const,
};

/** `Popover.Popup`: its width the demo's class. */
export const propOptionsPopup = {
  ...commonPropOptions,
  className: [
    'popover-demo-popup',
    'popover-demo-popup some-custom--class',
    undefined,
  ] as const,
  initialFocus: [undefined, false, true] as const,
  finalFocus: [undefined, false, true] as const,
};

/** `Popover.Header`, `Popover.Body`: their own elements (no `render`). */
export const propOptionsElement = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
};

/** `Popover.Title`: in a toolbar's title, a `span`. */
export const propOptionsTitle = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
  render: [new MappedProp(<span />, '[<span />]'), undefined] as const,
};

/** `Popover.Close`: a toolbar's close button. */
export const propOptionsClose = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
  render: [
    new MappedProp(
      <Toolbar.Button
        aria-label="Close"
        shape="circle"
      />,
      '[<Toolbar.Button aria-label="Close" shape="circle" />]',
    ),
    undefined,
  ] as const,
  nativeButton: [undefined, true] as const,
};

export const propOptionsContent = {
  arrow: [true, false] as const,
};

/** A popover or a sheet: unset, by the window's size class. */
export const propOptionsPresentation = {
  presentation: [undefined, 'popover', 'sheet'] as const,
};

export { commonPropOptions as propOptionsPart } from '../../tooling/frame/prop-control.js';
