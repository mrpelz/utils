import { FunctionComponent, useMemo, useRef, useState } from 'react';

import {
  Button,
  Grid,
  type GridReorderChange,
  GridReorderHandle,
  useGridItem,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { AddLog, useLog } from '../../tooling/frame/log.js';
import {
  type PartProps,
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import { type Device, devices, deviceSizes } from './content.js';
import {
  gridBreakRows,
  gridCreateReorderHandleRows,
  gridDropGroupRows,
  gridHeaderRows,
  gridItemRows,
  gridRemoveButtonRows,
  gridReorderRows,
  gridResizeHandleRows,
  gridRootRows,
  gridSectionRows,
  gridSpacerRows,
  gridSpawnRows,
  gridUseGridItemRows,
} from './docs.js';
import {
  getPropOptionsBreak,
  getPropOptionsItem,
  getPropOptionsResizeHandle,
  getPropOptionsSpacer,
  getPropOptionsSpawn,
  propOptionsHeader,
  propOptionsRemoveButton,
  propOptionsRootEditing,
  propOptionsSection,
} from './props.js';

// Each part's view: a few of a home's devices as tiles (see content.ts),
// the part's own props on one of them (open and outlined), every other
// part's in a group of its own. Most start in edit mode, where the part
// does its work; Done and Edit toggle it.

/** The living room's devices (the first four) and the kitchen's. */
const livingRoom = devices.filter(({ room }) => room === 'Living Room');
const kitchen = devices.filter(({ room }) => room === 'Kitchen');

/** A move, logged: what moved, after what. */
const logMove = (addLog: AddLog, change: GridReorderChange) =>
  addLog(
    `move ${String(change.items[0]?.name)} after ${change.target.after ?? '–'}${change.target.name ? ` (${change.target.name})` : ''}`,
  );

/** The parts every view's tiles have, and the props it sets on them. */
const sharedParts = {
  'Grid.Item': ['defaultSize', 'dropName', 'reorderHandle', 'supportedSizes'],
  'Grid.ResizeHandle': [],
} as const;

/** The parts of the Edit and Done button (see `editButton`). */
const buttonParts = {
  'Button.Label': [],
  'Button.Root': ['onClick', 'variant'],
} as const;

/** Tiles by room, or by group: what `Grid.reorder` changes. */
type Rooms = Readonly<Record<string, readonly Device[]>>;

/**
 * A device's tile: its name, a resize handle (shown in edit mode), and a
 * remove button if it can be removed.
 */
const deviceItem = (
  { name, size }: Device,
  partProps: PartProps,
  {
    handle,
    onRemove,
  }: { handle?: GridReorderHandle; onRemove?: (name: string) => void } = {},
) => (
  <Grid.Item
    key={name}
    {...partProps['Grid.Item']}
    defaultSize={size}
    dropName={name}
    reorderHandle={handle}
    supportedSizes={deviceSizes}
  >
    <div className="grid-demo-tile">{name}</div>
    {onRemove ? (
      <Grid.RemoveButton
        {...partProps['Grid.RemoveButton']}
        aria-label={`Remove ${name}`}
        onClick={() => onRemove(name)}
      />
    ) : null}
    <Grid.ResizeHandle {...partProps['Grid.ResizeHandle']} />
  </Grid.Item>
);

/** Edit and Done, toggling edit mode. */
const editButton = (
  editing: boolean,
  setEditing: (editing: boolean) => void,
  partProps: PartProps,
  addLog: AddLog,
) => (
  <Button.Root
    {...partProps['Button.Root']}
    variant="bordered"
    onClick={() => {
      addLog(editing ? 'done' : 'edit');
      setEditing(!editing);
    }}
  >
    <Button.Label {...partProps['Button.Label']}>
      {editing ? 'Done' : 'Edit'}
    </Button.Label>
  </Button.Root>
);

/** `Grid.Root`, outlined: the living room's devices, editing. */
const RootPart: FunctionComponent = () => {
  const id = 'grid-parts-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsRootEditing, {
    emphasize: 'outline',
    external,
    isOpen: true,
    title: 'Grid.Root',
  });
  const [order, setOrder] = useState<readonly Device[]>(livingRoom);
  const handle = Grid.useCreateReorderHandle({
    onReorder: (change) => {
      logMove(addLog, change);
      setOrder((current) => Grid.reorder(current, change, ({ name }) => name));
    },
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(() => partPropMaps(sharedParts, addLog), [addLog]),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="Grid.Root"
    >
      <Grid.Root
        {...props}
        reorderHandle={handle}
      >
        {order.map((device) => deviceItem(device, partProps, { handle }))}
      </Grid.Root>
    </Component>
  );
};

/** `Grid.Section`, outlined (the living room's): two rooms, one handle. */
const SectionPart: FunctionComponent = () => {
  const id = 'grid-parts-section';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    propOptionsSection,
    { emphasize: 'outline', external, isOpen: true, title: 'Grid.Section' },
  );
  const [editing, setEditing] = useState(true);
  const [rooms, setRooms] = useState<Rooms>({
    Kitchen: kitchen,
    'Living Room': livingRoom,
  });
  const handle = Grid.useCreateReorderHandle({
    onReorder: (change) => {
      logMove(addLog, change);
      setRooms((current) => Grid.reorder(current, change, ({ name }) => name));
    },
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            ...sharedParts,
            ...buttonParts,
            'Grid.Header': [],
            'Grid.Root': ['editing'],
            'Grid.Section (others)': ['dropName', 'reorderHandle'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="Grid.Section"
    >
      <>
        {editButton(editing, setEditing, partProps, addLog)}
        <Grid.Root
          {...partProps['Grid.Root']}
          editing={editing}
        >
          <Grid.Section
            key={elementKey}
            {...props}
            dropName="Living Room"
            reorderHandle={handle}
          >
            <Grid.Header {...partProps['Grid.Header']}>
              <h3 className="grid-demo-heading">Living Room</h3>
            </Grid.Header>
            {(rooms['Living Room'] ?? []).map((device) =>
              deviceItem(device, partProps, { handle }),
            )}
          </Grid.Section>
          <Grid.Section
            {...partProps['Grid.Section (others)']}
            dropName="Kitchen"
            reorderHandle={handle}
          >
            <Grid.Header {...partProps['Grid.Header']}>
              <h3 className="grid-demo-heading">Kitchen</h3>
            </Grid.Header>
            {(rooms.Kitchen ?? []).map((device) =>
              deviceItem(device, partProps, { handle }),
            )}
          </Grid.Section>
        </Grid.Root>
      </>
    </Component>
  );
};

/** `Grid.Header`, outlined (the living room's): above its section's tiles. */
const HeaderPart: FunctionComponent = () => {
  const id = 'grid-parts-header';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsHeader, {
    emphasize: 'outline',
    external,
    isOpen: true,
    title: 'Grid.Header',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            ...sharedParts,
            'Grid.Header (others)': [],
            'Grid.Root': [],
            'Grid.Section': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="Grid.Header"
    >
      <Grid.Root {...partProps['Grid.Root']}>
        <Grid.Section {...partProps['Grid.Section']}>
          <Grid.Header {...props}>
            <h3 className="grid-demo-heading">Living Room</h3>
          </Grid.Header>
          {livingRoom.map((device) => deviceItem(device, partProps))}
        </Grid.Section>
        <Grid.Section {...partProps['Grid.Section']}>
          <Grid.Header {...partProps['Grid.Header (others)']}>
            <h3 className="grid-demo-heading">Kitchen</h3>
          </Grid.Header>
          {kitchen.map((device) => deviceItem(device, partProps))}
        </Grid.Section>
      </Grid.Root>
    </Component>
  );
};

/**
 * `Grid.DropGroup` (no element, nothing to outline): a section's favorites
 * and the rest, each its own range, tiles moving between them.
 */
const DropGroupPart: FunctionComponent = () => {
  const id = 'grid-parts-drop-group';
  const [log, addLog] = useLog();
  const [editing, setEditing] = useState(true);
  const [groups, setGroups] = useState<Rooms>({
    favorites: livingRoom.slice(0, 2),
    rest: livingRoom.slice(2),
  });
  const handle = Grid.useCreateReorderHandle({
    onReorder: (change) => {
      logMove(addLog, change);
      setGroups((current) => Grid.reorder(current, change, ({ name }) => name));
    },
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            ...sharedParts,
            ...buttonParts,
            'Grid.Break': ['dropName'],
            'Grid.Root': ['editing'],
            'Grid.Section': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[partControls]}
      id={id}
      log={log}
      state={[partState]}
      title="Grid.DropGroup"
    >
      <>
        {editButton(editing, setEditing, partProps, addLog)}
        <Grid.Root
          {...partProps['Grid.Root']}
          editing={editing}
        >
          <Grid.Section {...partProps['Grid.Section']}>
            <Grid.DropGroup
              dropName="favorites"
              reorderHandle={handle}
            >
              {(groups.favorites ?? []).map((device) =>
                deviceItem(device, partProps, { handle }),
              )}
            </Grid.DropGroup>
            <Grid.Break
              {...partProps['Grid.Break']}
              dropName="between"
            />
            <Grid.DropGroup
              dropName="rest"
              reorderHandle={handle}
            >
              {(groups.rest ?? []).map((device) =>
                deviceItem(device, partProps, { handle }),
              )}
            </Grid.DropGroup>
          </Grid.Section>
        </Grid.Root>
      </>
    </Component>
  );
};

/** `Grid.Item`, outlined (the thermostat), editing: its size's options. */
const ItemPart: FunctionComponent = () => {
  const id = 'grid-parts-item';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsItem('Thermostat', '2x2')(addLog), [addLog]),
    { emphasize: 'outline', external, isOpen: true, title: 'Grid.Item' },
  );
  const [editing, setEditing] = useState(true);
  const [order, setOrder] = useState<readonly Device[]>(livingRoom);
  const handle = Grid.useCreateReorderHandle({
    onReorder: (change) => {
      logMove(addLog, change);
      setOrder((current) => Grid.reorder(current, change, ({ name }) => name));
    },
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            ...buttonParts,
            'Grid.ResizeHandle': [],
            'Grid.Item (others)': [
              'defaultSize',
              'dropName',
              'reorderHandle',
              'supportedSizes',
            ],
            'Grid.Root': ['editing', 'reorderHandle'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );
  const others = {
    ...partProps,
    'Grid.Item': partProps['Grid.Item (others)'] ?? {},
  };

  return (
    <Component
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="Grid.Item"
    >
      <>
        {editButton(editing, setEditing, partProps, addLog)}
        <Grid.Root
          {...partProps['Grid.Root']}
          editing={editing}
          reorderHandle={handle}
        >
          {order.map((device) =>
            device.name === 'Thermostat' ? (
              <Grid.Item
                key={`${device.name}-${elementKey}`}
                {...props}
                dropName={device.name}
                reorderHandle={handle}
              >
                <div className="grid-demo-tile">{device.name}</div>
                <Grid.ResizeHandle {...partProps['Grid.ResizeHandle']} />
              </Grid.Item>
            ) : (
              deviceItem(device, others, { handle })
            ),
          )}
        </Grid.Root>
      </>
    </Component>
  );
};

/** `Grid.Spacer`, outlined, editing: a hole after the lamp. */
const SpacerPart: FunctionComponent = () => {
  const id = 'grid-parts-spacer';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsSpacer('Spacer', '2x1')(addLog), [addLog]),
    { emphasize: 'outline', external, isOpen: true, title: 'Grid.Spacer' },
  );
  const [editing, setEditing] = useState(true);
  const [isShown, setIsShown] = useState(true);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            ...sharedParts,
            ...buttonParts,
            'Grid.RemoveButton': ['onClick'],
            'Grid.Root': ['editing'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="Grid.Spacer"
    >
      <>
        {editButton(editing, setEditing, partProps, addLog)}
        <Grid.Root
          {...partProps['Grid.Root']}
          editing={editing}
        >
          {deviceItem(livingRoom[0] as Device, partProps)}
          {isShown ? (
            <Grid.Spacer
              key={elementKey}
              {...props}
            >
              <Grid.RemoveButton
                {...partProps['Grid.RemoveButton']}
                onClick={() => {
                  addLog('remove spacer');
                  setIsShown(false);
                }}
              />
              <Grid.ResizeHandle {...partProps['Grid.ResizeHandle']} />
            </Grid.Spacer>
          ) : null}
          {livingRoom.slice(1).map((device) => deviceItem(device, partProps))}
        </Grid.Root>
      </>
    </Component>
  );
};

/** `Grid.Break`, outlined, editing: after the lamp, its rows resizable. */
const BreakPart: FunctionComponent = () => {
  const id = 'grid-parts-break';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsBreak('Break', 1)(addLog), [addLog]),
    { emphasize: 'outline', external, isOpen: true, title: 'Grid.Break' },
  );
  const [editing, setEditing] = useState(true);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            ...sharedParts,
            ...buttonParts,
            'Grid.Root': ['editing'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="Grid.Break"
    >
      <>
        {editButton(editing, setEditing, partProps, addLog)}
        <Grid.Root
          {...partProps['Grid.Root']}
          editing={editing}
        >
          {deviceItem(livingRoom[0] as Device, partProps)}
          <Grid.Break
            key={elementKey}
            {...props}
          >
            <Grid.ResizeHandle {...partProps['Grid.ResizeHandle']} />
          </Grid.Break>
          {livingRoom.slice(1).map((device) => deviceItem(device, partProps))}
        </Grid.Root>
      </>
    </Component>
  );
};

/** `Grid.Spawn`, outlined: after the tiles, adding a lamp. */
const SpawnPart: FunctionComponent = () => {
  const id = 'grid-parts-spawn';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsSpawn('Spawn', '1x1')(addLog), [addLog]),
    { emphasize: 'outline', external, isOpen: true, title: 'Grid.Spawn' },
  );
  const [added, setAdded] = useState<readonly Device[]>([]);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            ...sharedParts,
            'Grid.Root': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="Grid.Spawn"
    >
      <Grid.Root {...partProps['Grid.Root']}>
        {[...livingRoom.slice(0, 2), ...added].map((device) =>
          deviceItem(device, partProps),
        )}
        <Grid.Spawn
          key={elementKey}
          aria-label="Add a lamp"
          {...props}
          onClick={() => {
            const name = `Lamp ${String(added.length + 2)}`;
            addLog(`add ${name}`);
            setAdded((current) => [
              ...current,
              { name, room: 'Living Room', size: '1x1' },
            ]);
          }}
        />
      </Grid.Root>
    </Component>
  );
};

/** `Grid.ResizeHandle`, outlined (the thermostat's), editing. */
const ResizeHandlePart: FunctionComponent = () => {
  const id = 'grid-parts-resize-handle';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsResizeHandle(addLog), [addLog]),
    {
      emphasize: 'outline',
      external,
      isOpen: true,
      title: 'Grid.ResizeHandle',
    },
  );
  const [editing, setEditing] = useState(true);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            ...sharedParts,
            ...buttonParts,
            'Grid.ResizeHandle (others)': [],
            'Grid.Root': ['editing'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );
  const others = {
    ...partProps,
    'Grid.ResizeHandle': partProps['Grid.ResizeHandle (others)'] ?? {},
  };

  return (
    <Component
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="Grid.ResizeHandle"
    >
      <>
        {editButton(editing, setEditing, partProps, addLog)}
        <Grid.Root
          {...partProps['Grid.Root']}
          editing={editing}
        >
          {livingRoom.map((device) =>
            device.name === 'Thermostat' ? (
              <Grid.Item
                key={device.name}
                {...partProps['Grid.Item']}
                defaultSize={device.size}
                dropName={device.name}
                supportedSizes={deviceSizes}
              >
                <div className="grid-demo-tile">{device.name}</div>
                <Grid.ResizeHandle
                  key={elementKey}
                  {...props}
                />
              </Grid.Item>
            ) : (
              deviceItem(device, others)
            ),
          )}
        </Grid.Root>
      </>
    </Component>
  );
};

/** `Grid.RemoveButton`, outlined (the lamp's), editing; Reset. */
const RemoveButtonPart: FunctionComponent = () => {
  const id = 'grid-parts-remove-button';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    propOptionsRemoveButton,
    {
      emphasize: 'outline',
      external,
      isOpen: true,
      title: 'Grid.RemoveButton',
    },
  );
  const [editing, setEditing] = useState(true);
  const [shown, setShown] = useState<readonly Device[]>(livingRoom);
  const remove = (name: string) => {
    addLog(`remove ${name}`);
    setShown((current) => current.filter((device) => device.name !== name));
  };

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            ...sharedParts,
            ...buttonParts,
            'Grid.RemoveButton (others)': ['aria-label', 'onClick'],
            'Grid.Root': ['editing'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );
  const others = {
    ...partProps,
    'Grid.RemoveButton': partProps['Grid.RemoveButton (others)'] ?? {},
  };

  return (
    <Component
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="Grid.RemoveButton"
    >
      <>
        <div className="grid-demo-actions">
          {editButton(editing, setEditing, partProps, addLog)}
          <Button.Root
            {...partProps['Button.Root']}
            variant="bordered"
            onClick={() => {
              addLog('reset');
              setShown(livingRoom);
            }}
          >
            <Button.Label {...partProps['Button.Label']}>Reset</Button.Label>
          </Button.Root>
        </div>
        <Grid.Root
          {...partProps['Grid.Root']}
          editing={editing}
        >
          {shown.map((device) =>
            device.name === 'Lamp' ? (
              <Grid.Item
                key={device.name}
                {...partProps['Grid.Item']}
                defaultSize={device.size}
                dropName={device.name}
                supportedSizes={deviceSizes}
              >
                <div className="grid-demo-tile">{device.name}</div>
                <Grid.RemoveButton
                  key={elementKey}
                  {...props}
                  onClick={() => remove(device.name)}
                />
                <Grid.ResizeHandle {...partProps['Grid.ResizeHandle']} />
              </Grid.Item>
            ) : (
              deviceItem(device, others, { onRemove: remove })
            ),
          )}
        </Grid.Root>
      </>
    </Component>
  );
};

/** A tile of the app's: a device, a spacer or a break, by its name. */
type Cell =
  | { device: Device; kind: 'device'; name: string }
  | { kind: 'break'; name: string; rows?: 1 | 2 | 3 }
  | { kind: 'spacer'; name: string; size?: Device['size'] };

/**
 * `Grid.createReorderHandle` (in a component: `useCreateReorderHandle`)
 * with spacers and breaks, and `Grid.reorder` making them: tiles dropped
 * where they only land with them get them, so the rest stays put.
 */
const CreateReorderHandlePart: FunctionComponent = () => {
  const id = 'grid-parts-create-reorder-handle';
  const [log, addLog] = useLog();
  const [editing, setEditing] = useState(true);
  const [cells, setCells] = useState<readonly Cell[]>(() =>
    livingRoom.map((device) => ({ device, kind: 'device', name: device.name })),
  );
  // (New spacers' and breaks' names.)
  const made = useRef(0);
  const handle = Grid.useCreateReorderHandle({
    breaks: true,
    onReorder: (change) => {
      logMove(addLog, change);
      for (const insert of [
        ...(change.target.addBefore ?? []),
        ...(change.target.addAfter ?? []),
      ]) {
        addLog(
          `add ${insert.kind === 'break' ? `a break of ${String(insert.rows)}` : `a ${insert.size} spacer`}`,
        );
      }
      setCells((current) =>
        Grid.reorder(current, change, ({ name }) => name, {
          breakOf: (rows) => {
            made.current += 1;
            return {
              kind: 'break',
              name: `Break ${String(made.current)}`,
              rows,
            };
          },
          spacerOf: (size) => {
            made.current += 1;
            return {
              kind: 'spacer',
              name: `Spacer ${String(made.current)}`,
              size,
            };
          },
          withRows: (cell, rows) =>
            cell.kind === 'break' ? { ...cell, rows } : cell,
        }),
      );
    },
    spacers: true,
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            ...sharedParts,
            ...buttonParts,
            'Grid.Break': ['dropName', 'reorderHandle', 'rows'],
            'Grid.Root': ['editing', 'reorderHandle'],
            'Grid.Spacer': ['dropName', 'reorderHandle', 'size'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[partControls]}
      id={id}
      log={log}
      state={[partState]}
      title="Grid.createReorderHandle"
    >
      <>
        {editButton(editing, setEditing, partProps, addLog)}
        <Grid.Root
          {...partProps['Grid.Root']}
          editing={editing}
          reorderHandle={handle}
        >
          {cells.map((cell) => {
            if (cell.kind === 'device') {
              return deviceItem(cell.device, partProps, { handle });
            }
            return cell.kind === 'break' ? (
              <Grid.Break
                key={cell.name}
                {...partProps['Grid.Break']}
                dropName={cell.name}
                reorderHandle={handle}
                rows={cell.rows}
              />
            ) : (
              <Grid.Spacer
                key={cell.name}
                {...partProps['Grid.Spacer']}
                dropName={cell.name}
                reorderHandle={handle}
                size={cell.size}
              />
            );
          })}
        </Grid.Root>
      </>
    </Component>
  );
};

/**
 * The app's card (what an item holds): its name, and its size from
 * `useGridItem`, with the size asked for when the columns made it smaller.
 */
const DeviceCard: FunctionComponent<{ name: string }> = ({ name }) => {
  const item = useGridItem();
  return (
    <div className="grid-demo-tile">
      <span>{name}</span>
      <span className="grid-demo-size">
        {item?.size}
        {item?.isFitted ? ` (asked for ${item.requested})` : ''}
      </span>
    </div>
  );
};

/** `useGridItem`: each tile's card reading its size. */
const UseGridItemPart: FunctionComponent = () => {
  const id = 'grid-parts-use-grid-item';
  const [log, addLog] = useLog();
  const [editing, setEditing] = useState(true);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            ...sharedParts,
            ...buttonParts,
            'Grid.Root': ['editing'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[partControls]}
      id={id}
      log={log}
      state={[partState]}
      title="useGridItem"
    >
      <>
        {editButton(editing, setEditing, partProps, addLog)}
        <Grid.Root
          {...partProps['Grid.Root']}
          editing={editing}
        >
          {devices.map(({ name, size }) => (
            <Grid.Item
              key={name}
              {...partProps['Grid.Item']}
              defaultSize={size}
              dropName={name}
              supportedSizes={deviceSizes}
            >
              <DeviceCard name={name} />
              <Grid.ResizeHandle {...partProps['Grid.ResizeHandle']} />
            </Grid.Item>
          ))}
        </Grid.Root>
      </>
    </Component>
  );
};

/** `/grid/parts`: its root, sections, cells, edit controls and functions. */
export const GridParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        A root holding cells in order, or sections of them. Cells are items,
        spacers, breaks and add tiles. Together they’re called tiles.
      </li>
      <li>
        Each tile’s edit controls go inside it: a resize handle and a remove
        button. They only show in edit mode.
      </li>
      <li>
        Moving tiles takes a reorder handle, which the app makes and gives to
        the tiles and to where they can be dropped, as in a{' '}
        <a href={publicUrl('list')}>List</a>.
      </li>
      <li>
        Most views start in edit mode. Hold a tile for a moment to drag it, or
        focus it and press Alt and an arrow key. Drag a corner arc to resize.
      </li>
    </ul>
    <ul className="demo-tree">
      <li className="demo-tree-context">
        <span>The app’s page, for example </span>
        <PartLink
          component="page"
          part="Page.Root"
        />
        <ul>
          <li>
            <PartLink part="Grid.Root" />
            <ul>
              <li>
                <PartLink part="Grid.Section" /> (optional, several)
                <ul>
                  <li>
                    <PartLink part="Grid.Header" /> (optional)
                  </li>
                  <li>
                    <PartLink part="Grid.DropGroup" /> (optional, no element)
                  </li>
                  <li>
                    <PartLink part="Grid.Item" /> (one per item)
                    <ul>
                      <li className="demo-tree-context">
                        <span>Its content, for example a card</span>
                      </li>
                      <li>
                        <PartLink part="Grid.RemoveButton" /> (optional)
                      </li>
                      <li>
                        <PartLink part="Grid.ResizeHandle" /> (optional)
                      </li>
                    </ul>
                  </li>
                  <li>
                    <PartLink part="Grid.Spacer" /> (optional, its controls
                    inside)
                  </li>
                  <li>
                    <PartLink part="Grid.Break" /> (optional, its controls
                    inside)
                  </li>
                  <li>
                    <PartLink part="Grid.Spawn" /> (optional)
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li className="demo-tree-context">
        <span>The app’s code: </span>
        <PartLink part="Grid.createReorderHandle" />
        <span>, </span>
        <PartLink part="Grid.reorder" />
        <span>, and in what an item holds, </span>
        <PartLink part="useGridItem" />
      </li>
    </ul>

    <Heading
      id="grid-root"
      level={2}
    >
      <code>Grid.Root</code>
    </Heading>
    <ul>
      <li>
        Measures its own width and gets as many columns as fit at{' '}
        <code>unitSize</code>. Units are square, so a row is as tall as a column
        is wide.
      </li>
      <li>
        Keeps its columns while their units stay between <code>unitMin</code>{' '}
        and <code>unitMax</code>, stretching them to fill its width. Past that,
        it changes the columns, and the tiles glide to their new places.
      </li>
      <li>
        Isn’t shown until it has measured, so nothing jumps on first render.
      </li>
      <li>
        <code>editing</code> turns on edit mode for all its tiles. With a{' '}
        <code>reorderHandle</code> of its own, tiles can be dropped among its
        cells.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={gridRootRows} />

    <Heading
      id="grid-section"
      level={2}
    >
      <code>Grid.Section</code>
    </Heading>
    <ul>
      <li>
        A grid of its own, on the root’s columns and units. Sections stack below
        each other with a bigger gap.
      </li>
      <li>
        With a <code>reorderHandle</code>, tiles can be dropped among its cells.
        Give the same handle to several sections to move tiles between them.
      </li>
      <li>
        In edit mode, its rows are drawn as bands, running in from the page’s
        leading edge and out at its trailing edge. That shows the order is one
        line, read row by row.
      </li>
      <li>
        Renders a <code>section</code>.
      </li>
    </ul>
    <SectionPart />
    <h3>Props</h3>
    <PropsTable rows={gridSectionRows} />

    <Heading
      id="grid-header"
      level={2}
    >
      <code>Grid.Header</code>
    </Heading>
    <ul>
      <li>
        Goes across its section’s columns, above its tiles. What’s in it is the
        app’s, for example a heading.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <HeaderPart />
    <h3>Props</h3>
    <PropsTable rows={gridHeaderRows} />

    <Heading
      id="grid-dropgroup"
      level={2}
    >
      <code>Grid.DropGroup</code>
    </Heading>
    <ul>
      <li>
        Part of a section’s cells, as a place of its own to drop into, for
        example favorites first and the rest after them.
      </li>
      <li>
        It renders no element, so its cells stay in the section’s grid. Changes
        name it as their target (<code>dropName</code>).
      </li>
    </ul>
    <DropGroupPart />
    <h3>Props</h3>
    <PropsTable rows={gridDropGroupRows} />

    <Heading
      id="grid-item"
      level={2}
    >
      <code>Grid.Item</code>
    </Heading>
    <ul>
      <li>
        A tile spanning 1 to 3 columns and rows. What’s in it fills it, for
        example a card.
      </li>
      <li>
        Its size is what the user chose (<code>size</code>, stored by the app),
        snapped to what it supports (<code>supportedSizes</code>), and fitted to
        the columns. Only its first row decides where it goes: the rows below
        follow along.
      </li>
      <li>
        In edit mode, with a <code>reorderHandle</code>, it can be dragged after
        holding it for a moment (a quick swipe still scrolls), or moved with Alt
        and an arrow key. A placeholder shows where it’ll land.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <ItemPart />
    <h3>Props</h3>
    <PropsTable rows={gridItemRows} />

    <Heading
      id="grid-spacer"
      level={2}
    >
      <code>Grid.Spacer</code>
    </Heading>
    <ul>
      <li>
        A deliberate hole, as big as an item of its size. It takes room, but
        shows nothing outside edit mode.
      </li>
      <li>
        In edit mode it’s outlined, its edit controls show, and it moves like an
        item.
      </li>
      <li>
        Growing an item or a spacer over a spacer takes it in: the change lists
        it, and the app removes it.
      </li>
      <li>
        Renders a <code>div</code>, hidden from assistive technology outside
        edit mode.
      </li>
    </ul>
    <SpacerPart />
    <h3>Props</h3>
    <PropsTable rows={gridSpacerRows} />

    <Heading
      id="grid-break"
      level={2}
    >
      <code>Grid.Break</code>
    </Heading>
    <ul>
      <li>
        Starts a new row, like a line break in text: the rest of its row stays
        empty. With more <code>rows</code>, the rows below are kept empty too.
      </li>
      <li>
        In edit mode it’s filled from where it starts to its row’s end, with a
        return sign at that end, and the rows it keeps empty below. Right after
        a full row, a one-row break has nothing to keep, so it’s a thin bar in
        the gap.
      </li>
      <li>
        Its resize handle changes its rows. Growing it takes in the breaks next
        to it.
      </li>
      <li>
        Renders a <code>div</code>, hidden from assistive technology outside
        edit mode.
      </li>
    </ul>
    <BreakPart />
    <h3>Props</h3>
    <PropsTable rows={gridBreakRows} />

    <Heading
      id="grid-spawn"
      level={2}
    >
      <code>Grid.Spawn</code>
    </Heading>
    <ul>
      <li>
        A dashed add tile, in and out of edit mode. What adding does, and where
        the new tile goes, is the app’s: its <code>onClick</code>, or a menu it
        triggers (<code>render</code>).
      </li>
      <li>
        It stays put, unless it has a <code>reorderHandle</code>.
      </li>
      <li>
        The sign in its middle is the app’s, a mask in{' '}
        <code>--uikit-grid-spawn-sign</code>.
      </li>
      <li>
        Renders a <code>button</code> named “Add” by default.
      </li>
    </ul>
    <SpawnPart />
    <h3>Props</h3>
    <PropsTable rows={gridSpawnRows} />

    <Heading
      id="grid-resizehandle"
      level={2}
    >
      <code>Grid.ResizeHandle</code>
    </Heading>
    <ul>
      <li>
        An arc in its tile’s bottom trailing corner, in edit mode only, and only
        with another size to go to. A plus or minus beside it says when it can
        only grow or only shrink.
      </li>
      <li>
        Dragged, it outlines the new size from the start. Nothing moves until
        it’s released, and the size changes a little past halfway to the next
        unit. A press without moving changes nothing.
      </li>
      <li>
        While dragged, the spacers (and breaks) it would take in show a sign.
      </li>
      <li>With a key, it steps through the sizes that fit the columns.</li>
      <li>
        Renders a <code>button</code> named “Resize”.
      </li>
    </ul>
    <ResizeHandlePart />
    <h3>Props</h3>
    <PropsTable rows={gridResizeHandleRows} />

    <Heading
      id="grid-removebutton"
      level={2}
    >
      <code>Grid.RemoveButton</code>
    </Heading>
    <ul>
      <li>
        An x in its tile’s top leading corner, in edit mode only. What it
        removes is up to its <code>onClick</code>.
      </li>
      <li>
        A drag that starts on it moves the tile instead: a finger that landed
        there meant the tile.
      </li>
      <li>
        Renders a <code>button</code> named “Remove” by default. Name what it
        removes.
      </li>
    </ul>
    <RemoveButtonPart />
    <h3>Props</h3>
    <PropsTable rows={gridRemoveButtonRows} />

    <Heading
      id="grid-createreorderhandle"
      level={2}
    >
      <code>Grid.createReorderHandle</code>
    </Heading>
    <ul>
      <li>
        A handle the app gives to tiles (their <code>reorderHandle</code>) and
        to where they can be dropped (<PartLink part="Grid.Root" />,{' '}
        <PartLink part="Grid.Section" />, <PartLink part="Grid.DropGroup" />
        ). In a component, use{' '}
        <PartLink part="Grid.createReorderHandle">
          Grid.useCreateReorderHandle
        </PartLink>
        , which makes it once and keeps its options current.
      </li>
      <li>
        With <code>spacers</code> and <code>breaks</code>, a tile lands right
        where it’s dropped: the change asks for spacers in front of it, or a
        break, so nothing else moves. Here every move is logged, with what it
        adds.
      </li>
    </ul>
    <CreateReorderHandlePart />
    <h3>Options</h3>
    <PropsTable rows={gridCreateReorderHandleRows} />

    <Heading
      id="grid-reorder"
      level={2}
    >
      <code>Grid.reorder</code>
    </Heading>
    <ul>
      <li>
        Applies a change to the app’s data and returns the new data: the moved
        tile goes after the target’s <code>after</code> cell, or before its{' '}
        <code>before</code> one.
      </li>
      <li>
        It makes the spacers and breaks the change asks for with the functions
        you pass, and changes a break’s rows. The view above uses it.
      </li>
    </ul>
    <h3>Arguments</h3>
    <PropsTable rows={gridReorderRows} />

    <Heading
      id="usegriditem"
      level={2}
    >
      <code>useGridItem</code>
    </Heading>
    <ul>
      <li>
        For what’s inside an item, such as a card: its size as shown, as asked
        for, and whether the grid is editing. Outside a grid, it’s{' '}
        <code>undefined</code>.
      </li>
      <li>
        A card picks its level of detail from <code>size</code>. Here each card
        prints it, and changes as you resize its tile.
      </li>
    </ul>
    <UseGridItemPart />
    <h3>Returns</h3>
    <PropsTable rows={gridUseGridItemRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const gridPartsDemos = [
  RootPart,
  SectionPart,
  HeaderPart,
  DropGroupPart,
  ItemPart,
  SpacerPart,
  BreakPart,
  SpawnPart,
  ResizeHandlePart,
  RemoveButtonPart,
  CreateReorderHandlePart,
  UseGridItemPart,
];
