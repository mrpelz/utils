/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { AddLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  MappedProp,
} from '../../tooling/frame/prop-control.js';

// (Their `render` is what they are: a section, its header, its group.)
const elementOptions = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
};

export const getPropOptionsRoot = (addLog: AddLog) => ({
  ...elementOptions,
  defaultOpen: [true, false, undefined] as const,
  open: [undefined, false, true] as const,
  disabled: [undefined, false, true] as const,
  onOpenChange: [
    new MappedProp(
      (isOpen: boolean, { reason }: { reason: string }) =>
        addLog(`open change: ${String(isOpen)} (${reason})`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

export const propOptionsTrigger = elementOptions;

export const propOptionsPanel = {
  ...elementOptions,
  keepMounted: [undefined, false, true] as const,
  hiddenUntilFound: [undefined, false, true] as const,
};
