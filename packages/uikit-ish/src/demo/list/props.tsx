/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';

import { forwardClick } from '../../components/index.js';
import { AddLog } from '../utils/log.js';
import { commonPropOptions, MappedProp } from '../utils/main.js';

export const cursorOptions = [undefined, 'auto', 'pointer', 'copy'] as const;

export const propOptionsContent = {
  image: ['rounded', 'symbol', 'circular', 'fill', 'none'] as const,
  supertitle: [false, true] as const,
  headerSubtitle: [false, true] as const,
} as const;

export const propOptionsRoot = {
  ...commonPropOptions,
  listStyle: [undefined, 'insetGrouped', 'grouped', 'plain'] as const,
  outline: [undefined, false, true] as const,
};

export const propOptionsHeader = {
  ...commonPropOptions,
  prominence: [undefined, 'nested', 'prominent', 'extraProminent'] as const,
};

export const propOptionsImage = {
  ...commonPropOptions,
  variant: [undefined, 'symbol', 'rounded', 'circular', 'fill'] as const,
};

export const propOptionsBlock = {
  ...commonPropOptions,
  strong: [true, false, undefined] as const,
};

export const propOptionsCheckbox = {
  ...commonPropOptions,
  defaultChecked: [undefined, false, true] as const,
  checked: [undefined, false, true] as const,
  disabled: [undefined, false, true] as const,
  readOnly: [undefined, false, true] as const,
  cursor: cursorOptions,
};

// Rendered as list parts, so without the common `render` option.
export const { className, style } = commonPropOptions;

export const propOptionsCollapsible = {
  className,
  style,
  defaultOpen: [true, false, undefined] as const,
  open: [undefined, false, true] as const,
  disabled: [undefined, false, true] as const,
};

export const propOptionsPanel = {
  className,
  style,
  hiddenUntilFound: [undefined, false, true] as const,
};

export const propOptionsPartsContent = {
  supertitle: [false, true] as const,
  headerSubtitle: [false, true] as const,
} as const;

export const propOptionsEdit = {
  prefix: [
    'none',
    'delete',
    'insert',
    'delete + insert',
    'multiple',
    'single',
  ] as const,
  reorder: [true, false] as const,
} as const;

export const propOptionsItemFirst = {
  ...commonPropOptions,
  cursor: cursorOptions,
  onClick: [
    new MappedProp(forwardClick('[role=switch]'), '[click the switch]'),
    undefined,
  ] as const,
};

export const getPropOptionsCollapsible = (addLog: AddLog) => ({
  ...propOptionsCollapsible,
  onOpenChange: [
    new MappedProp(
      (open: boolean) => addLog(`open change: ${open}`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

export const propOptionsCursor = {
  ...commonPropOptions,
  cursor: cursorOptions,
};

export const propOptionsText = {
  ...commonPropOptions,
  lines: [undefined, 1, 2, 3],
};

export const getPropOptionsSwipeActionsTrailing = (addLog: AddLog) => ({
  ...commonPropOptions,
  overswipe: [true, false, undefined] as const,
  onOverswipe: [
    undefined,
    new MappedProp(() => addLog('overswiped'), '[log overswipe]'),
  ] as const,
});

export const getPropOptionsSwipeActionsFirstLeading = (addLog: AddLog) => ({
  ...commonPropOptions,
  overswipe: [true, false, undefined] as const,
  onOverswipe: [
    undefined,
    new MappedProp(() => addLog('overswiped'), '[log overswipe]'),
  ] as const,
});

export const getPropOptionsSwipeActionFirst = (addLog: AddLog) => ({
  ...commonPropOptions,
  cursor: cursorOptions,
  disabled: [undefined, false, true] as const,
  label: [undefined, 'Custom'] as const,
  shape: [undefined, 'circle', 'roundedRectangle'] as const,
  showLabel: [undefined, false, true] as const,
  // Over the tint: dark, light, or custom.
  textColor: [
    undefined,
    '#000',
    '#fff',
    'var(--color-ios-system-yellow)',
  ] as const,
  tint: [undefined, 'var(--color-ios-system-teal)', '#000'] as const,
  onClick: [
    new MappedProp(() => addLog('swipe action clicked'), '[log click]'),
    undefined,
  ] as const,
});

export const getPropOptionsCheckboxFirst = (addLog: AddLog) => ({
  ...propOptionsCheckbox,
  onCheckedChange: [
    new MappedProp(
      (checked: boolean, { reason }: BaseCheckbox.Root.ChangeEventDetails) =>
        addLog(`checked change: ${checked}/${reason}`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

export const getPropOptionsRadioGroup = (addLog: AddLog) => ({
  className,
  style,
  defaultValue: [undefined, 'Earth'] as const,
  disabled: [undefined, false, true] as const,
  readOnly: [undefined, false, true] as const,
  onValueChange: [
    new MappedProp(
      (value: unknown) => addLog(`value change: ${String(value)}`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

export const propOptionsRadioFirst = {
  ...commonPropOptions,
  cursor: cursorOptions,
  disabled: [undefined, false, true] as const,
  readOnly: [undefined, false, true] as const,
};

export const getPropOptionsEditButtonFirst = (addLog: AddLog) => ({
  ...commonPropOptions,
  cursor: cursorOptions,
  disabled: [undefined, false, true] as const,
  onClick: [
    new MappedProp(() => addLog('edit button clicked'), '[log click]'),
    undefined,
  ] as const,
});

export const propOptionsRootPlain = {
  ...propOptionsRoot,
  listStyle: ['plain', 'insetGrouped', 'grouped', undefined] as const,
};

export const propOptionsIndex = {
  ...commonPropOptions,
  size: [undefined, 'compact', 'regular'] as const,
};

/** A click handler option, logging the part's name. */
export const logClick = (addLog: AddLog, name: string) =>
  new MappedProp(() => addLog(`${name} clicked`), '[log click]');

export const logSecondaryClick = (addLog: AddLog, name: string) =>
  new MappedProp(
    () => addLog(`${name} secondary click`),
    '[log secondary click]',
  );

export const getPropOptionsItemFirst = (addLog: AddLog) => ({
  ...commonPropOptions,
  cursor: cursorOptions,
  onClick: [undefined, logClick(addLog, 'item')] as const,
  onSecondaryClick: [undefined, logSecondaryClick(addLog, 'item')] as const,
});

export const getPropOptionsTitleFirst = (addLog: AddLog) => ({
  ...commonPropOptions,
  cursor: cursorOptions,
  onClick: [logClick(addLog, 'title'), undefined] as const,
  render: [
    new MappedProp(<button />, '[<button />]'),
    undefined,
    new MappedProp(<a href="#list-parts" />, '[<a href="#list-parts" />]'),
    new MappedProp(<main />, '[<main />]'),
  ] as const,
});

export const getPropOptionsAccessory = (addLog: AddLog) => ({
  ...commonPropOptions,
  cursor: cursorOptions,
  onClick: [logClick(addLog, 'accessory'), undefined] as const,
  render: [
    new MappedProp(<button type="button" />, '[<button />]'),
    undefined,
    new MappedProp(<main />, '[<main />]'),
  ] as const,
});

export const getPropOptionsAction = (addLog: AddLog) => ({
  ...commonPropOptions,
  cursor: cursorOptions,
  disabled: [undefined, false, true] as const,
  onClick: [logClick(addLog, 'action'), undefined] as const,
  onSecondaryClick: [undefined, logSecondaryClick(addLog, 'action')] as const,
});

export const getPropOptionsButton = (addLog: AddLog) => ({
  ...commonPropOptions,
  cursor: cursorOptions,
  destructive: [undefined, false, true] as const,
  disabled: [undefined, false, true] as const,
  onClick: [logClick(addLog, 'button'), undefined] as const,
  onSecondaryClick: [undefined, logSecondaryClick(addLog, 'button')] as const,
});

export const getPropOptionsEditButton = (addLog: AddLog) => ({
  ...commonPropOptions,
  cursor: cursorOptions,
  disabled: [undefined, false, true] as const,
  editingStyle: [undefined, 'delete', 'insert'] as const,
  onClick: [logClick(addLog, 'edit button'), undefined] as const,
  onSecondaryClick: [
    undefined,
    logSecondaryClick(addLog, 'edit button'),
  ] as const,
});

export const getPropOptionsSwipeActionOutermost = (addLog: AddLog) => ({
  ...commonPropOptions,
  cursor: cursorOptions,
  disabled: [undefined, false, true] as const,
  label: ['Archive', 'Custom'] as const,
  shape: [undefined, 'circle', 'roundedRectangle'] as const,
  showLabel: [true, false, undefined] as const,
  tint: [
    'var(--color-ios-system-purple)',
    undefined,
    'var(--color-ios-system-teal)',
  ] as const,
  onClick: [logClick(addLog, 'swipe action'), undefined] as const,
  onSecondaryClick: [
    undefined,
    logSecondaryClick(addLog, 'swipe action'),
  ] as const,
});

export const propOptionsExpandable = {
  ...commonPropOptions,
  open: [undefined, false, true] as const,
};

/** The overview's list: its style. */
export const propOptionsOverviewRoot = {
  listStyle: ['insetGrouped', 'grouped', 'plain', 'sidebar'] as const,
};

/** The overview's rows: which parts they show. */
export const propOptionsOverviewContent = {
  image: ['rounded', 'none', 'circular', 'symbol'] as const,
  subtitle: [false, true] as const,
  detail: [true, false] as const,
  trailing: ['drillIn', 'switch', 'checkmark', 'none'] as const,
};

export const propOptionsRootAll = {
  ...propOptionsRoot,
  editing: [false, true, undefined] as const,
  listStyle: [
    undefined,
    'insetGrouped',
    'grouped',
    'plain',
    'sidebar',
  ] as const,
};

export const getPropOptionsGroup = (addLog: AddLog) => ({
  ...commonPropOptions,
  onReorder: [
    new MappedProp(
      (from: number, to: number) => addLog(`reorder: ${from} → ${to}`),
      '[log reorder]',
    ),
    undefined,
  ] as const,
});

export const getPropOptionsItem = (addLog: AddLog) => ({
  ...getPropOptionsItemFirst(addLog),
  selected: [undefined, false, true] as const,
  level: [undefined, 0, 1, 2] as const,
});

export const getPropOptionsExpandableRoot = (addLog: AddLog) => ({
  defaultOpen: [true, false, undefined] as const,
  open: [undefined, false, true] as const,
  onOpenChange: [
    new MappedProp(
      (open: boolean) => addLog(`open change: ${String(open)}`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

export const getPropOptionsExpandableTrigger = (addLog: AddLog) => ({
  ...propOptionsCursor,
  onClick: [undefined, logClick(addLog, 'trigger')] as const,
  onSecondaryClick: [undefined, logSecondaryClick(addLog, 'trigger')] as const,
});

export const getPropOptionsIndexItem = (addLog: AddLog) => ({
  ...propOptionsCursor,
  onClick: [undefined, logClick(addLog, 'index item')] as const,
  onSecondaryClick: [
    undefined,
    logSecondaryClick(addLog, 'index item'),
  ] as const,
});
