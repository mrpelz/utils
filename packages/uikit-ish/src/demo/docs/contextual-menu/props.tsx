/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { Menu as BaseMenu } from '@base-ui/react/menu';

import { AddLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  MappedProp,
} from '../../tooling/frame/prop-control.js';

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
      (isOpen: boolean, { reason }: BaseMenu.Root.ChangeEventDetails) =>
        addLog(`open change: ${isOpen}/${reason}`),
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
};

// The guide pages' views (see parts.tsx).

/** `ContextualMenu.Preview`: its own element (no `render`). */
export const propOptionsGuidePreview = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
};

export const propOptionsGuidePortal = {
  ...commonPropOptions,
  keepMounted: [undefined, false, true] as const,
};

export const propOptionsGuideBackdrop = { ...commonPropOptions };

export const propOptionsGuidePositioner = {
  ...propOptionsPositioner,
  collisionPadding: [undefined, 0, 16] as const,
};
