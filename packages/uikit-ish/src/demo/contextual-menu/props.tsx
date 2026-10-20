/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { Menu as BaseMenu } from '@base-ui/react/menu';

import { AddLog } from '../frame/log.js';
import { commonPropOptions, MappedProp } from '../frame/prop-control.js';

/** The demo's content: a preview (or none), the backdrop. */
export const propOptionsContent = {
  preview: [true, false] as const,
  backdrop: [true, false] as const,
} as const;

export const getPropOptionsRoot = (addLog: AddLog) => ({
  size: [undefined, 'compact', 'regular'] as const,
  disabled: [undefined, false, true] as const,
  modal: [undefined, false, true] as const,
  onOpenChange: [
    new MappedProp(
      (open: boolean, { reason }: BaseMenu.Root.ChangeEventDetails) =>
        addLog(`open change: ${open}/${reason}`),
      '[log open change]',
    ),
    undefined,
  ] as const,
});

export const propOptionsTrigger = {
  ...commonPropOptions,
  disabled: [undefined, false, true] as const,
};

export const propOptionsPreview = {
  ...commonPropOptions,
};

export const propOptionsPositioner = {
  ...commonPropOptions,
  align: [undefined, 'start', 'center', 'end'] as const,
  sideOffset: [undefined, 0, 8, 16] as const,
};
