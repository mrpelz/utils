/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { Menu as BaseMenu } from '@base-ui/react/menu';

import { AddLog } from '../frame/log.js';
import { commonPropOptions, MappedProp } from '../frame/prop-control.js';

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

// The guide pages' views (see parts.tsx).

/** `EditMenu.Root` (the parts page's): its props but `open` (the app's). */
export const propOptionsGuideRoot = {
  modal: [undefined, false, true] as const,
  loopFocus: [undefined, false, true] as const,
  highlightItemOnHover: [undefined, false, true] as const,
  disabled: [undefined, false, true] as const,
};

export const propOptionsGuidePortal = {
  ...commonPropOptions,
  keepMounted: [undefined, false, true] as const,
};

export const getPropOptionsGuideItem = (addLog: AddLog) => ({
  ...propOptionsItem,
  label: [undefined, 'Cut selection'] as const,
  onClick: [
    new MappedProp(() => addLog('Cut clicked'), '[log click]'),
    undefined,
  ] as const,
});

export const getPropOptionsGuideSubmenuRoot = (addLog: AddLog) => ({
  closeParentOnEsc: [undefined, false, true] as const,
  disabled: [undefined, false, true] as const,
  onOpenChange: [
    undefined,
    new MappedProp(
      (open: boolean) => addLog(`more open change: ${String(open)}`),
      '[log change]',
    ),
  ] as const,
});

export const propOptionsGuideMore = {
  ...commonPropOptions,
  disabled: [undefined, false, true] as const,
  openOnHover: [undefined, false, true] as const,
  delay: [undefined, 0, 500] as const,
  closeDelay: [undefined, 0, 500] as const,
  'aria-label': [undefined, 'More Actions'] as const,
};
