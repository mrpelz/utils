/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { Menu as BaseMenu } from '@base-ui/react/menu';

import { Button } from '../../components/index.js';
import { AddLog } from '../frame/log.js';
import { commonPropOptions, MappedProp } from '../frame/prop-control.js';

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
  sideOffset: [undefined, 0, 8, 16] as const,
  collisionPadding: [undefined, 0, 8, 32] as const,
  alignOffset: [undefined, 0, -16, 16] as const,
  sticky: [undefined, false, true] as const,
  disableAnchorTracking: [undefined, false, true] as const,
};

/** The open menu's root (always open, see `MenuOpenDemo`). */
export const propOptionsOpenRoot = {
  size: [undefined, 'compact', 'regular'] as const,
};

export const propOptionsPopup = {
  ...commonPropOptions,
  finalFocus: [undefined, false, true] as const,
};

export const propOptionsItem = {
  ...commonPropOptions,
  disabled: [undefined, false, true] as const,
  destructive: [undefined, false, true] as const,
  cursor: [undefined, 'auto', 'pointer', 'copy'] as const,
  closeOnClick: [undefined, false, true] as const,
};

export const propOptionsToggleItem = {
  ...commonPropOptions,
  disabled: [undefined, false, true] as const,
  destructive: [undefined, false, true] as const,
  cursor: [undefined, 'auto', 'pointer', 'copy'] as const,
  closeOnClick: [undefined, false, true] as const,
};

export const propOptionsIndicator = {
  ...commonPropOptions,
};

export const propOptionsSubmenuTrigger = {
  ...commonPropOptions,
  disabled: [undefined, false, true] as const,
  destructive: [undefined, false, true] as const,
  cursor: [undefined, 'auto', 'pointer', 'copy'] as const,
  openOnHover: [undefined, false, true] as const,
  delay: [undefined, 0, 500] as const,
};

// With `openOn="secondaryClick"`, a click is the trigger's own (logged).
export const getPropOptionsTrigger = (addLog: AddLog) => ({
  ...commonPropOptions,
  disabled: [undefined, false, true] as const,
  openOnHover: [undefined, false, true] as const,
  delay: [undefined, 0, 500] as const,
  openOn: [undefined, 'click', 'secondaryClick'] as const,
  onClick: [
    new MappedProp(() => addLog('trigger clicked'), '[log click]'),
    undefined,
  ] as const,
  onSecondaryClick: [
    undefined,
    new MappedProp(
      () => addLog('trigger secondary click'),
      '[log secondary click]',
    ),
  ] as const,
});

export const propOptionsItemDisabled = {
  ...propOptionsItem,
  disabled: [true, false, undefined],
};

export const propOptionsItemDestructive = {
  ...propOptionsItem,
  destructive: [true, false, undefined],
};

export const getPropOptionsCheckboxItems = (addLog: AddLog) => ({
  ...propOptionsToggleItem,
  defaultChecked: [true, false, undefined] as const,
  onCheckedChange: [
    new MappedProp(
      (checked: boolean) => addLog(`checked change: ${String(checked)}`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

export const getPropOptionsRadioGroup = (addLog: AddLog) => ({
  ...commonPropOptions,
  defaultValue: ['first', 'second', undefined] as const,
  disabled: [undefined, false, true] as const,
  onValueChange: [
    new MappedProp(
      (value: unknown) => addLog(`value change: ${String(value)}`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

export const getPropOptionsSubmenuRoot = (addLog: AddLog) => ({
  closeParentOnEsc: [undefined, false, true] as const,
  disabled: [undefined, false, true] as const,
  onOpenChange: [
    undefined,
    new MappedProp(
      (open: boolean) => addLog(`submenu open change: ${String(open)}`),
      '[log change]',
    ),
  ] as const,
});

export const getPropOptionsRoot = (addLog: AddLog) => ({
  defaultOpen: [undefined, false, true] as const,
  open: [undefined, true] as const,
  modal: [undefined, false, true] as const,
  loopFocus: [undefined, false, true] as const,
  disabled: [undefined, false, true] as const,
  highlightItemOnHover: [undefined, false, true] as const,
  onOpenChange: [
    new MappedProp(
      (open: boolean, { reason }: BaseMenu.Root.ChangeEventDetails) =>
        addLog(`open change: ${String(open)}/${reason}`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

export const getPropOptionsItem = (addLog: AddLog) => ({
  ...propOptionsItem,
  onClick: [
    new MappedProp(() => addLog('item clicked'), '[log click]'),
    undefined,
  ] as const,
});

// The guide pages' views (see overview.tsx, parts.tsx, composition.tsx).

/** `Menu.Root` (the parts page's): all of its props. */
export const getPropOptionsGuideRoot = (addLog: AddLog) => ({
  size: [undefined, 'compact', 'regular'] as const,
  ...getPropOptionsRoot(addLog),
  closeParentOnEsc: [undefined, false, true] as const,
  onOpenChangeComplete: [
    undefined,
    new MappedProp(
      (open: boolean) => addLog(`open complete: ${String(open)}`),
      '[log change]',
    ),
  ] as const,
  onItemHighlighted: [
    undefined,
    new MappedProp(
      (item: HTMLElement | undefined) =>
        addLog(`highlighted: ${item?.textContent ?? 'none'}`),
      '[log highlight]',
    ),
  ] as const,
});

/** `Menu.Trigger` (the parts page's): a button, and how it opens. */
export const getPropOptionsGuideTrigger = (addLog: AddLog) => ({
  ...getPropOptionsTrigger(addLog),
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
  closeDelay: [undefined, 0, 500] as const,
});

export const propOptionsGuidePortal = {
  ...commonPropOptions,
  keepMounted: [undefined, false, true] as const,
};

/** Parts with only Base UI's common props (or an element's own). */
export const propOptionsPart = { ...commonPropOptions };

export const propOptionsElement = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
};

export const getPropOptionsGuideItem = (addLog: AddLog) => ({
  ...getPropOptionsItem(addLog),
  label: [undefined, 'Rename file'] as const,
});

export const propOptionsGuideLinkItem = {
  ...propOptionsToggleItem,
  href: ['#', 'https://example.com'] as const,
  label: [undefined, 'Help'] as const,
};

export const getPropOptionsGuideCheckboxItem = (addLog: AddLog) => ({
  ...getPropOptionsCheckboxItems(addLog),
  label: [undefined, 'Previews'] as const,
});

export const propOptionsGuideIndicator = {
  ...commonPropOptions,
  keepMounted: [undefined, false, true] as const,
};

export const propOptionsGuideRadioItem = {
  ...propOptionsToggleItem,
  label: [undefined, 'By date'] as const,
};

export const propOptionsGuideSubmenuTrigger = {
  ...propOptionsSubmenuTrigger,
  closeDelay: [undefined, 0, 500] as const,
  label: [undefined, 'Move to'] as const,
};

export const propOptionsGuideSeparator = {
  ...commonPropOptions,
  orientation: [undefined, 'horizontal', 'vertical'] as const,
};

/** The overview's: the size class (by the window's, or set). */
export const propOptionsOverviewRoot = {
  size: [undefined, 'compact', 'regular'] as const,
};
