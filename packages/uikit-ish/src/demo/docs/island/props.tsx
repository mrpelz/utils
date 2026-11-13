/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { AddLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  MappedProp,
} from '../../tooling/frame/prop-control.js';

/** A stop chosen by the user, logged (its name). */
const logSnapPointChange = (addLog: AddLog) =>
  [
    new MappedProp(
      (snapPoint: string) => addLog(`snap point: ${snapPoint}`),
      '[log change]',
    ),
    undefined,
  ] as const;

/** `Island.Root`: its stops (its groups' names), its element. */
export const getPropOptionsRoot = (addLog: AddLog) => ({
  className: commonPropOptions.className,
  style: commonPropOptions.style,
  defaultSnapPoint: [undefined, 'header', 'peek', 'details', 'all'] as const,
  snapPoint: [undefined, 'header', 'peek', 'details', 'all'] as const,
  onSnapPointChange: logSnapPointChange(addLog),
});

/** The overview's root: where it starts, its changes logged. */
export const getPropOptionsOverviewRoot = (addLog: AddLog) => ({
  defaultSnapPoint: ['peek', 'header', 'details', 'all', undefined] as const,
  onSnapPointChange: logSnapPointChange(addLog),
});

/** A sliver's root: where it starts (its sliver: the most map). */
export const getPropOptionsSliverRoot = (addLog: AddLog) => ({
  defaultSnapPoint: ['sliver', 'header', 'peek', 'all', undefined] as const,
  onSnapPointChange: logSnapPointChange(addLog),
});

/** A part rendering an element of its own: its class name, its style. */
export const propOptionsPart = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
};

/** Its scrolling content's (a part's, see `propOptionsPart`): its glass too. */
export const propOptionsScrollContent = {
  ...propOptionsPart,
  glass: [undefined, 'auto', 'flat', 'live'] as const,
};

/** `Island.Grabber`: its element, its cursor. */
export const propOptionsGrabber = {
  ...propOptionsPart,
  cursor: [undefined, 'grab', 'ns-resize', 'pointer'] as const,
};

/** `Island.SnapGroup`: its element, its name. */
export const propOptionsSnapGroup = {
  ...propOptionsPart,
  value: ['peek', 'summary'] as const,
};
