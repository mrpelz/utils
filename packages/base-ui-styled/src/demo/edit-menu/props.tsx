/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { Menu as BaseMenu } from '@base-ui/react/menu';

import { AddLog } from '../utils/log.js';
import { commonPropOptions, MappedProp } from '../utils/main.js';

export const propOptionsContent = {
  actions: [6, 1, 2, 3, 4, 5] as const,
  more: [true, false] as const,
} as const;

export const propOptionsPositioner = {
  ...commonPropOptions,
  side: [undefined, 'block-start', 'block-end'] as const,
  align: [undefined, 'start', 'center', 'end'] as const,
  sideOffset: [undefined, 0, 8, 16] as const,
  collisionPadding: [undefined, 0, 8, 32] as const,
  alignOffset: [undefined, 0, -16, 16] as const,
};

export const propOptionsItem = {
  ...commonPropOptions,
  disabled: [undefined, false, true] as const,
  destructive: [undefined, false, true] as const,
  cursor: [undefined, 'auto', 'pointer', 'copy'] as const,
  closeOnClick: [undefined, false, true] as const,
};

export const getPropOptionsRoot = (addLog: AddLog) => ({
  open: [undefined, true] as const,
  modal: [false, true, undefined] as const,
  loopFocus: [undefined, false, true] as const,
  onOpenChange: [
    new MappedProp(
      (open: boolean, { reason }: BaseMenu.Root.ChangeEventDetails) =>
        addLog(`open change: ${String(open)}/${reason}`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

export const propOptionsPopup = {
  ...commonPropOptions,
  finalFocus: [undefined, false, true] as const,
};

export const getPropOptionsItems = (addLog: AddLog) => ({
  ...propOptionsItem,
  onClick: [
    new MappedProp(() => addLog('item clicked'), '[log click]'),
    undefined,
  ] as const,
});

export const propOptionsMore = {
  ...commonPropOptions,
  disabled: [undefined, false, true] as const,
  openOnHover: [undefined, false, true] as const,
  cursor: [undefined, 'auto', 'pointer', 'copy'] as const,
};
