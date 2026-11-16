/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import {
  cardIcons,
  type GridBreakRows,
  gridIcons,
  GridPlacement,
  GridSize,
  GridSizeChangeDetails,
} from '../../../components/index.js';
import { AddLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  MappedProp,
} from '../../tooling/frame/prop-control.js';
import { sfICircle } from '../../tooling/icons.js';

// Every part's options (its parts page's, see part-options.ts for the other
// demos). The reorder handles and names are the app's wiring, set by each
// view, never controls.

/**
 * A key for a demo's grid: its parts' `default*` props, only read as they
 * mount, so a grid mounts anew when one of them changes.
 */
export const defaultsKey = (
  ...props: readonly (Readonly<Record<string, unknown>> | undefined)[]
): string =>
  JSON.stringify(
    props.flatMap((each) =>
      Object.entries(each ?? {}).filter(([name]) => name.startsWith('default')),
    ),
  );

/** A part rendering its own element: its class name and style. */
const elementOptions = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
};

/** A size change, logged with what it took in. */
const logSize = (addLog: AddLog, name: string) =>
  new MappedProp(
    (size: GridSize, { merged }: GridSizeChangeDetails) =>
      addLog(
        `${name} size: ${size}${merged.length > 0 ? ` (took in ${merged.join(', ')})` : ''}`,
      ),
    '[log change]',
  );

export const propOptionsRoot = {
  ...elementOptions,
  editing: [undefined, false, true] as const,
  dense: [undefined, false, true] as const,
  gap: [undefined, 8, 12, 20] as const,
  maxTileRows: [undefined, 2, 4] as const,
  minColumns: [undefined, 5, 6] as const,
  unitSize: [undefined, 90, 180] as const,
  unitMin: [undefined, 80] as const,
  unitMax: [undefined, 110] as const,
};

/** The root's, editing from the start (a view about editing). */
export const propOptionsRootEditing = {
  ...propOptionsRoot,
  editing: [true, false] as const,
};

export const propOptionsSection = {
  ...elementOptions,
  dense: [undefined, false, true] as const,
};

export const propOptionsHeader = elementOptions;

/** A drop group renders nothing of its own: no options but its wiring. */
export const propOptionsDropGroup = {};

/** An item's size options: its own first, then a few others. */
const sizesOf = (size: GridSize | undefined) => [
  size,
  ...([undefined, '1x1', '2x1', '2x2', '3x2', '4x2'] as const).filter(
    (each) => each !== size,
  ),
];

/** An area's options (see `Grid.Area`). */
export const getPropOptionsArea = (name: string) => (addLog: AddLog) => ({
  defaultSize: [undefined, '3x2', '*x2'] as const,
  size: [undefined, '3x3'] as const,
  supportedSizes: [
    undefined,
    new MappedProp<readonly GridSize[]>(
      ['2x2', '3x2', '*x2', '*x3'],
      '[2x2, 3x2, *x2, *x3]',
    ),
  ] as const,
  onSizeChange: [
    new MappedProp(
      (area: GridSize, { merged }: GridSizeChangeDetails) =>
        addLog(
          `${name} area: ${area}${merged.length > 0 ? ` (took in ${merged.join(', ')})` : ''}`,
        ),
      '[log change]',
    ),
    undefined,
  ] as const,
  defaultPlacement: [undefined, 'top-leading', 'bottom-trailing'] as const,
  placement: [
    undefined,
    'center',
    'top-leading',
    'top-trailing',
    'bottom-leading',
    'bottom-trailing',
  ] as const,
  onPlacementChange: [
    new MappedProp(
      (placement: GridPlacement) => addLog(`${name} placement: ${placement}`),
      '[log change]',
    ),
    undefined,
  ] as const,
  movable: [undefined, true] as const,
});

export const getPropOptionsItem =
  (name: string, defaultSize?: GridSize) => (addLog: AddLog) => ({
    ...elementOptions,
    defaultSize: sizesOf(defaultSize),
    size: [undefined, '1x1', '2x2'] as const,
    supportedSizes: [
      undefined,
      new MappedProp<readonly GridSize[]>(
        ['1x1', '2x1', '2x2'],
        '[1x1, 2x1, 2x2]',
      ),
      new MappedProp<readonly GridSize[]>(['2x1'], '[2x1]'),
      new MappedProp<readonly GridSize[]>(
        ['2x2', '3x2', '4x2'],
        '[2x2, 3x2, 4x2]',
      ),
    ] as const,
    onSizeChange: [logSize(addLog, name), undefined] as const,
    open: [undefined, true, false] as const,
    defaultOpen: [undefined, true] as const,
    onOpenChange: [
      new MappedProp(
        (open: boolean, { reason }: { reason: string }) =>
          addLog(`${name}: ${open ? 'open' : 'close'} (${reason})`),
        '[log]',
      ),
      undefined,
    ] as const,
    openSize: [undefined, '2x2', '3x2'] as const,
    openLabel: [name, undefined] as const,
  });

export const getPropOptionsSpacer =
  (name: string, defaultSize?: GridSize) => (addLog: AddLog) => ({
    ...elementOptions,
    defaultSize: sizesOf(defaultSize),
    size: [undefined, '1x1', '2x1'] as const,
    onSizeChange: [logSize(addLog, name), undefined] as const,
  });

export const getPropOptionsSpawn =
  (name: string, defaultSize?: GridSize) => (addLog: AddLog) => ({
    ...commonPropOptions,
    defaultSize: sizesOf(defaultSize),
    size: [undefined, '1x1', '2x1'] as const,
    onSizeChange: [logSize(addLog, name), undefined] as const,
  });

export const getPropOptionsBreak =
  (name: string, defaultRows?: GridBreakRows) => (addLog: AddLog) => ({
    ...elementOptions,
    defaultRows: [
      defaultRows,
      ...([undefined, 1, 2, 3] as const).filter((rows) => rows !== defaultRows),
    ],
    rows: [undefined, 1, 2] as const,
    onRowsChange: [
      new MappedProp(
        (rows: GridBreakRows, { merged }: GridSizeChangeDetails) =>
          addLog(
            `${name} rows: ${String(rows)}${merged.length > 0 ? ` (took in ${merged.join(', ')})` : ''}`,
          ),
        '[log change]',
      ),
      undefined,
    ] as const,
  });

export const getPropOptionsResizeHandle = (addLog: AddLog) => ({
  ...commonPropOptions,
  onClick: [
    undefined,
    new MappedProp(() => addLog('resize handle: click'), '[log click]'),
  ] as const,
});

export const getPropOptionsCornerButton = (addLog: AddLog) => ({
  ...commonPropOptions,
  icon: [
    new MappedProp(cardIcons.drillIn, '[cardIcons.drillIn]'),
    new MappedProp(cardIcons.expand, '[cardIcons.expand]'),
    new MappedProp(cardIcons.collapse, '[cardIcons.collapse]'),
    new MappedProp(cardIcons.overlay, '[cardIcons.overlay]'),
    new MappedProp(cardIcons.close, '[cardIcons.close]'),
    new MappedProp(gridIcons.remove, '[gridIcons.remove]'),
    new MappedProp(gridIcons.move, '[gridIcons.move]'),
    new MappedProp(gridIcons.addArea, '[gridIcons.addArea]'),
    new MappedProp(gridIcons.resize, '[gridIcons.resize]'),
    new MappedProp(gridIcons.resizeGrow, '[gridIcons.resizeGrow]'),
    new MappedProp(gridIcons.resizeShrink, '[gridIcons.resizeShrink]'),
    new MappedProp(gridIcons.resizeBoth, '[gridIcons.resizeBoth]'),
    new MappedProp(sfICircle, '[info.circle (SF Symbol)]'),
  ] as const,
  corner: [
    undefined,
    'bottom-leading',
    'top-leading',
    'top-trailing',
    'bottom-trailing',
  ] as const,
  mirrored: [undefined, true] as const,
  visible: [undefined, false] as const,
  'aria-label': ['Details', undefined] as const,
  onClick: [
    undefined,
    new MappedProp(() => addLog('corner button: click'), '[log click]'),
  ] as const,
});

export const getPropOptionsRemoveButton = (addLog: AddLog) => ({
  ...commonPropOptions,
  'aria-label': ['Remove Lamp', undefined] as const,
  onClick: [
    undefined,
    new MappedProp(() => addLog('remove button: click'), '[log click]'),
  ] as const,
});

export const getPropOptionsAreaButton = (addLog: AddLog) => ({
  ...commonPropOptions,
  'aria-label': ['Add an area to Lamp', undefined] as const,
  onAdd: [
    new MappedProp(
      (size: GridSize) => addLog(`area button: add ${size}`),
      '[log add]',
    ),
    undefined,
  ] as const,
  supportedSizes: [
    undefined,
    new MappedProp<readonly GridSize[]>(['2x2', '3x2'], '[2x2, 3x2]'),
  ] as const,
  onClick: [
    undefined,
    new MappedProp(() => addLog('area button: click'), '[log click]'),
  ] as const,
});

/** The overview's few: how it lays out, not its plumbing. */
export const propOptionsOverviewRoot = {
  dense: [undefined, true] as const,
  unitSize: [undefined, 80] as const,
  gap: [undefined, 8, 20] as const,
};
