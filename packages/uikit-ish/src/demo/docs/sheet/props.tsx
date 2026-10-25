/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { AddLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  MappedProp,
} from '../../tooling/frame/prop-control.js';

export const getPropOptionsRoot = (addLog: AddLog) => ({
  defaultOpen: [undefined, false, true] as const,
  disablePointerDismissal: [undefined, false, true] as const,
  onOpenChange: [
    new MappedProp(
      (isOpen: boolean) => addLog(`open change: ${String(isOpen)}`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

export const propOptionsPopup = {
  ...commonPropOptions,
  detent: [undefined, 'large', 'medium'] as const,
  // Its lists are grouped: on the grouped background.
  background: ['grouped', 'plain', undefined] as const,
};

/**
 * The overview's screen (a phone's: compact, a tablet's, or, unset, by the
 * window's size class: Viewport's `useSizeClass`), and where its sheet is
 * portaled: into the screen (the demo frame), or the page's body (`global`:
 * compact by the window).
 */
export const propOptionsOverviewContent = {
  layout: [undefined, 'phone', 'tablet'] as const,
  portal: ['frame', 'global'] as const,
  // The grabber is optional (the header's toolbar where it'd be).
  grabber: [true, false] as const,
};

/** The overview's root: its modality, its dismissal. */
export const propOptionsOverviewRoot = {
  modal: [undefined, false, 'trap-focus'] as const,
  disablePointerDismissal: [undefined, false, true] as const,
};

/** The overview's few: its detent, its dismissal. */
export const propOptionsOverviewPopup = {
  detent: [undefined, 'large', 'medium'] as const,
  // Its lists are grouped: on the grouped background.
  background: ['grouped', 'plain', undefined] as const,
};

/** The root's options in the guide's view (its changes logged). */
export const getPropOptionsGuideRoot = (addLog: AddLog) => ({
  defaultOpen: [undefined, false, true] as const,
  open: [undefined, false, true] as const,
  modal: [undefined, false, 'trap-focus'] as const,
  disablePointerDismissal: [undefined, false, true] as const,
  swipeDirection: [undefined, 'down', 'up', 'left', 'right'] as const,
  snapPoints: [undefined, [0.5, 1] as number[]] as const,
  defaultSnapPoint: [undefined, 0.5, 1] as const,
  snapPoint: [undefined, 0.5, 1] as const,
  snapToSequentialPoints: [undefined, false, true] as const,
  onOpenChange: [
    new MappedProp(
      (isOpen: boolean, { reason }: { reason: string }) =>
        addLog(`open: ${String(isOpen)} (${reason})`),
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
  onSnapPointChange: [
    undefined,
    new MappedProp(
      (snapPoint: number | string | null) =>
        addLog(`snap point: ${String(snapPoint)}`),
      '[log change]',
    ),
  ] as const,
});

export const propOptionsGuidePopup = {
  ...commonPropOptions,
  detent: [undefined, 'large', 'medium'] as const,
  // Its lists are grouped: on the grouped background.
  background: ['grouped', 'plain', undefined] as const,
  compact: [true, false, undefined] as const,
  initialFocus: [undefined, false, true] as const,
  finalFocus: [undefined, false, true] as const,
};

export const propOptionsPart = {
  ...commonPropOptions,
};

/** `Sheet.Header`: its own element (no `render`). */
export const propOptionsHeader = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
};

/** `Sheet.Grabber`: its own element (no `render`), its cursor. */
export const propOptionsGrabber = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
  cursor: [undefined, 'grab', 'ns-resize', 'pointer'] as const,
};
