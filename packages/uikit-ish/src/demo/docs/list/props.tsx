/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';

import {
  forwardClick,
  List,
  type ListCollapsibleChangeEventDetails,
  type ListReorderHandle,
} from '../../../components/index.js';
import { AddLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  MappedProp,
} from '../../tooling/frame/prop-control.js';
import { codeLabel } from '../../tooling/frame/render-code.js';

/**
 * The views' swipe actions handle (see `List.createSwipeActionsHandle`): the
 * first row's trailing actions (Mercury's), opened by a trigger outside the
 * list.
 */
export const mercuryActions = codeLabel(
  List.createSwipeActionsHandle(),
  'mercuryActions',
  'const mercuryActions = List.createSwipeActionsHandle(); // (at module level)',
);

/**
 * `List.SwipeActionsTrigger`, in its row: its side (by a handle, see the
 * handle's views).
 */
export const propOptionsSwipeActionsTrigger = {
  ...commonPropOptions,
  side: [undefined, 'inline-end', 'inline-start'] as const,
};

export const cursorOptions = [undefined, 'auto', 'pointer', 'copy'] as const;

/** A list's, a section's or a row's edit mode (see `ListEditing`). */
export const editingOptions = [
  undefined,
  'both',
  'leading',
  'trailing',
  'none',
  'ignore',
] as const;

/** A row part's behavior in edit mode (see `ListWhileEditing`). */
export const whileEditingOptions = [undefined, 'show', 'hide', 'stay'] as const;

/** A row slot's options: its edit mode behavior. */
export const propOptionsSlot = {
  ...commonPropOptions,
  whileEditing: whileEditingOptions,
};

export const propOptionsSection = {
  ...commonPropOptions,
  editing: editingOptions,
};

export const propOptionsContent = {
  image: ['rounded', 'symbol', 'circular', 'fill', 'none'] as const,
  supertitle: [false, true] as const,
  headerSubtitle: [false, true] as const,
} as const;

export const propOptionsRoot = {
  ...commonPropOptions,
  listStyle: [undefined, 'insetGrouped', 'grouped', 'plain'] as const,
  outline: [undefined, false, true] as const,
  dragToSelect: [undefined, false, true] as const,
};

export const propOptionsHeader = {
  ...commonPropOptions,
  prominence: [undefined, 'nested', 'prominent', 'extraProminent'] as const,
  cursor: cursorOptions,
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
  indeterminate: [undefined, false, true] as const,
  disabled: [undefined, false, true] as const,
  readOnly: [undefined, false, true] as const,
  required: [undefined, false, true] as const,
  value: [undefined, 'selected'] as const,
  uncheckedValue: [undefined, 'unselected'] as const,
  parent: [undefined, true] as const,
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
      (isOpen: boolean) => addLog(`open change: ${isOpen}`),
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
  side: [undefined, 'inline-end', 'inline-start'] as const,
  overswipe: [true, false, undefined] as const,
  onOverswipe: [
    undefined,
    new MappedProp(() => addLog('overswiped'), '[log overswipe]'),
  ] as const,
  allowSwipe: [undefined, 'all', 'reveal', 'conceal', 'none'] as const,
});

export const getPropOptionsSwipeActionsFirstLeading = (addLog: AddLog) => ({
  ...commonPropOptions,
  overswipe: [true, false, undefined] as const,
  onOverswipe: [
    undefined,
    new MappedProp(() => addLog('overswiped'), '[log overswipe]'),
  ] as const,
  allowSwipe: [undefined, 'all', 'reveal', 'conceal', 'none'] as const,
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
    'var(--color-ui-system-yellow)',
  ] as const,
  tint: [undefined, 'var(--color-ui-system-teal)', '#000'] as const,
  onClick: [
    new MappedProp(() => addLog('swipe action clicked'), '[log click]'),
    undefined,
  ] as const,
});

export const getPropOptionsCheckboxFirst = (addLog: AddLog) => ({
  ...propOptionsCheckbox,
  onCheckedChange: [
    new MappedProp(
      (isChecked: boolean, { reason }: BaseCheckbox.Root.ChangeEventDetails) =>
        addLog(`checked change: ${isChecked}/${reason}`),
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
  tint: [
    'var(--color-ui-system-red)',
    'var(--color-ui-system-green)',
    undefined,
  ] as const,
  textColor: [undefined, 'var(--color-ui-label)'] as const,
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
  'aria-label': ['Index', 'Contacts by letter'] as const,
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
  tint: [
    'var(--color-ui-system-red)',
    'var(--color-ui-system-green)',
    undefined,
  ] as const,
  textColor: [undefined, 'var(--color-ui-label)'] as const,
  onClick: [logClick(addLog, 'edit button'), undefined] as const,
  onSecondaryClick: [
    undefined,
    logSecondaryClick(addLog, 'edit button'),
  ] as const,
});

/** As above, its click deleting its row (logged), as the view's other rows. */
export const getPropOptionsSwipeActionOutermost = (addLog: AddLog) => ({
  ...commonPropOptions,
  cursor: cursorOptions,
  disabled: [undefined, false, true] as const,
  label: ['Archive', 'Custom'] as const,
  shape: [undefined, 'circle', 'roundedRectangle'] as const,
  showLabel: [true, false, undefined] as const,
  // Over the tint: dark, light, or custom.
  textColor: [
    undefined,
    '#000',
    '#fff',
    'var(--color-ui-system-yellow)',
  ] as const,
  tint: [
    'var(--color-ui-system-purple)',
    undefined,
    'var(--color-ui-system-teal)',
  ] as const,
  onClick: [logClick(addLog, 'swipe action'), undefined] as const,
  onSecondaryClick: [
    undefined,
    logSecondaryClick(addLog, 'swipe action'),
  ] as const,
});

/**
 * `List.Group` in the guide's view: reordering (`handle`: its rows'; its
 * gaps, targets).
 */
export const getPropOptionsGuideGroup = (handle: ListReorderHandle) => ({
  editing: editingOptions,
  ...commonPropOptions,
  reorderHandle: [new MappedProp(handle, '[rows]'), undefined] as const,
  dropName: [undefined, 'planets'] as const,
});

/** `List.DropGroup`, `List.DropTarget`: their handle, their name. */
export const getPropOptionsDropTarget = (
  handle: ListReorderHandle,
  name: string,
) => ({
  reorderHandle: [new MappedProp(handle, '[rows]')] as const,
  dropName: [undefined, name] as const,
});

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
  editing: editingOptions,
  listStyle: [
    undefined,
    'insetGrouped',
    'grouped',
    'plain',
    'sidebar',
  ] as const,
};

export const getPropOptionsItem = (addLog: AddLog) => ({
  ...getPropOptionsItemFirst(addLog),
  selected: [undefined, false, true] as const,
  level: [undefined, 0, 1, 2] as const,
  editing: editingOptions,
});

export const getPropOptionsListCollapsibleRoot = (addLog: AddLog) => ({
  defaultOpen: [true, false, undefined] as const,
  open: [undefined, false, true] as const,
  disabled: [undefined, false, true] as const,
  onOpenChange: [
    new MappedProp(
      (isOpen: boolean, { reason }: ListCollapsibleChangeEventDetails) =>
        addLog(`open change: ${String(isOpen)} (${reason})`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

export const getPropOptionsListAccordionRoot = (addLog: AddLog) => ({
  defaultValue: [['repeat'], [], undefined] as const,
  value: [undefined, [], ['repeat'], ['alert']] as const,
  multiple: [undefined, false, true] as const,
  disabled: [undefined, false, true] as const,
  onValueChange: [
    new MappedProp(
      (value: unknown[], { reason }: ListCollapsibleChangeEventDetails) =>
        addLog(`value change: ${JSON.stringify(value)} (${reason})`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

export const getPropOptionsListAccordionItem = (addLog: AddLog) => ({
  disabled: [undefined, false, true] as const,
  onOpenChange: [
    undefined,
    new MappedProp(
      (isOpen: boolean, { reason }: ListCollapsibleChangeEventDetails) =>
        addLog(`repeat open change: ${String(isOpen)} (${reason})`),
      '[log change]',
    ),
  ] as const,
});

export const getPropOptionsListCollapsibleTrigger = (addLog: AddLog) => ({
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
