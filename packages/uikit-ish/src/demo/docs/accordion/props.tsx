/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { AddLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  MappedProp,
} from '../../tooling/frame/prop-control.js';

// (Their `render` is what they are: the list, a section, its header, its
// group.)
const elementOptions = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
};

export const getPropOptionsRoot = (addLog: AddLog) => ({
  ...elementOptions,
  defaultValue: [['icloud'], [], undefined] as const,
  value: [undefined, [], ['icloud'], ['work']] as const,
  multiple: [undefined, false, true] as const,
  disabled: [undefined, false, true] as const,
  keepMounted: [undefined, false, true] as const,
  hiddenUntilFound: [undefined, false, true] as const,
  onValueChange: [
    new MappedProp(
      (value: unknown[], { reason }: { reason: string }) =>
        addLog(`value change: ${JSON.stringify(value)} (${reason})`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

export const getPropOptionsItem = (addLog: AddLog) => ({
  ...elementOptions,
  disabled: [undefined, false, true] as const,
  onOpenChange: [
    undefined,
    new MappedProp(
      (isOpen: boolean, { reason }: { reason: string }) =>
        addLog(`iCloud open change: ${String(isOpen)} (${reason})`),
      '[log change]',
    ),
  ] as const,
});

export const propOptionsTrigger = elementOptions;

export const propOptionsPanel = {
  ...elementOptions,
  keepMounted: [undefined, false, true] as const,
  hiddenUntilFound: [undefined, false, true] as const,
};
