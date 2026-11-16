import { FunctionComponent, useMemo, useRef, useState } from 'react';

import {
  Button,
  Grid,
  type GridBreakRows,
  type GridReorderChange,
  GridReorderHandle,
  type GridSize,
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
import { gridSigns } from '../../tooling/grid-signs.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import { type Device, devices, deviceSizes } from './content.js';
import {
  gridAreaButtonRows,
  gridAreaRows,
  gridBreakRows,
  gridCornerButtonRows,
  gridCreateReorderHandleRows,
  gridDropGroupRows,
  gridHeaderRows,
  gridIconsRows,
  gridItemRows,
  gridRemoveButtonRows,
  gridReorderRows,
  gridResizeHandleRows,
  gridRootRows,
  gridSectionRows,
  gridSpacerRows,
  gridSpawnRows,
  gridUseGridAreaRows,
  gridUseGridItemRows,
} from './docs.js';
import {
  defaultsKey,
  getPropOptionsArea,
  getPropOptionsAreaButton,
  getPropOptionsBreak,
  getPropOptionsCornerButton,
  getPropOptionsItem,
  getPropOptionsRemoveButton,
  getPropOptionsResizeHandle,
  getPropOptionsSpacer,
  getPropOptionsSpawn,
  propOptionsHeader,
  propOptionsRootEditing,
  propOptionsSection,
} from './props.js';

// Each part's view: a few of a home's devices as tiles (see content.ts),
// the part's own props on one of them (open and outlined), every other
// part's in a group of its own. Most start in edit mode, where the part
// does its work; Done and Edit toggle it.

/** The living room's devices and the kitchen's. */
const livingRoom = devices.filter(({ room }) => room === 'Living Room');
const kitchen = devices.filter(({ room }) => room === 'Kitchen');

/**
 * The living room for a spacer's or break's view: a 1x1 tile first (the
 * part right after it, beside it in its row), the full-width one last.
 */
const [besidePart, ...afterPart] = livingRoom.toSorted(
  (a, b) =>
    Number(b.name === 'Lamp') - Number(a.name === 'Lamp') ||
    Number(a.size.startsWith('*')) - Number(b.size.startsWith('*')),
) as [Device, ...Device[]];

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
      <div className="grid-demo-content">
        <Grid.Root
          key={defaultsKey(props, ...Object.values(partProps))}
          {...props}
          reorderHandle={handle}
          style={{ ...gridSigns(), ...props.style }}
        >
          {order.map((device) => deviceItem(device, partProps, { handle }))}
        </Grid.Root>
      </div>
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
      <div className="grid-demo-content">
        {editButton(editing, setEditing, partProps, addLog)}
        <Grid.Root
          key={defaultsKey(...Object.values(partProps))}
          {...partProps['Grid.Root']}
          editing={editing}
          style={{ ...gridSigns(), ...partProps['Grid.Root']?.style }}
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
      </div>
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
  const [editing, setEditing] = useState(false);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            ...sharedParts,
            ...buttonParts,
            'Grid.Header (others)': [],
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
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="Grid.Header"
    >
      <div className="grid-demo-content">
        {editButton(editing, setEditing, partProps, addLog)}
        <Grid.Root
          key={defaultsKey(...Object.values(partProps))}
          {...partProps['Grid.Root']}
          editing={editing}
          style={{ ...gridSigns(), ...partProps['Grid.Root']?.style }}
        >
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
      </div>
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
      <div className="grid-demo-content">
        {editButton(editing, setEditing, partProps, addLog)}
        <Grid.Root
          key={defaultsKey(...Object.values(partProps))}
          {...partProps['Grid.Root']}
          editing={editing}
          style={{ ...gridSigns(), ...partProps['Grid.Root']?.style }}
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
      </div>
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
      <div className="grid-demo-content">
        {editButton(editing, setEditing, partProps, addLog)}
        <Grid.Root
          key={defaultsKey(...Object.values(partProps))}
          {...partProps['Grid.Root']}
          editing={editing}
          reorderHandle={handle}
          style={{ ...gridSigns(), ...partProps['Grid.Root']?.style }}
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
      </div>
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
      <div className="grid-demo-content">
        {editButton(editing, setEditing, partProps, addLog)}
        <Grid.Root
          key={defaultsKey(...Object.values(partProps))}
          {...partProps['Grid.Root']}
          editing={editing}
          style={{ ...gridSigns(), ...partProps['Grid.Root']?.style }}
        >
          {deviceItem(besidePart, partProps)}
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
          {afterPart.map((device) => deviceItem(device, partProps))}
        </Grid.Root>
      </div>
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
      <div className="grid-demo-content">
        {editButton(editing, setEditing, partProps, addLog)}
        <Grid.Root
          key={defaultsKey(...Object.values(partProps))}
          {...partProps['Grid.Root']}
          editing={editing}
          style={{ ...gridSigns(), ...partProps['Grid.Root']?.style }}
        >
          {deviceItem(besidePart, partProps)}
          <Grid.Break
            key={elementKey}
            {...props}
          >
            <Grid.ResizeHandle {...partProps['Grid.ResizeHandle']} />
          </Grid.Break>
          {afterPart.map((device) => deviceItem(device, partProps))}
        </Grid.Root>
      </div>
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
  const [editing, setEditing] = useState(false);

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
      title="Grid.Spawn"
    >
      <div className="grid-demo-content">
        {editButton(editing, setEditing, partProps, addLog)}
        <Grid.Root
          key={defaultsKey(...Object.values(partProps))}
          {...partProps['Grid.Root']}
          editing={editing}
          style={{ ...gridSigns(), ...partProps['Grid.Root']?.style }}
        >
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
      </div>
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
            ...buttonParts,
            'Grid.Item': sharedParts['Grid.Item'],
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
      <div className="grid-demo-content">
        {editButton(editing, setEditing, partProps, addLog)}
        <Grid.Root
          key={defaultsKey(...Object.values(partProps))}
          {...partProps['Grid.Root']}
          editing={editing}
          style={{ ...gridSigns(), ...partProps['Grid.Root']?.style }}
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
      </div>
    </Component>
  );
};

/**
 * `Grid.CornerButton`, outlined (the lamp's): not editing, shown (as an
 * app's, hidden while editing unless `visible` says otherwise).
 */
const CornerButtonPart: FunctionComponent = () => {
  const id = 'grid-parts-corner-button';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsCornerButton(addLog), [addLog]),
    {
      emphasize: 'outline',
      external,
      isOpen: true,
      title: 'Grid.CornerButton',
    },
  );
  const [editing, setEditing] = useState(false);
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
      title="Grid.CornerButton"
    >
      <div className="grid-demo-content">
        <div className="grid-demo-actions">
          {editButton(editing, setEditing, partProps, addLog)}
        </div>
        <Grid.Root
          {...partProps['Grid.Root']}
          editing={editing}
          style={{ ...gridSigns(), ...partProps['Grid.Root']?.style }}
        >
          {livingRoom.map((device) =>
            device.name === 'Lamp' ? (
              <Grid.Item
                key={device.name}
                {...partProps['Grid.Item']}
                defaultSize={device.size}
                dropName={device.name}
                supportedSizes={deviceSizes}
              >
                <div className="grid-demo-tile">{device.name}</div>
                <Grid.CornerButton
                  key={elementKey}
                  {...props}
                  // (An app's: shown while the grid isn't editing.)
                  visible={props.visible ?? !editing}
                />
                <Grid.ResizeHandle {...partProps['Grid.ResizeHandle']} />
              </Grid.Item>
            ) : (
              deviceItem(device, partProps)
            ),
          )}
        </Grid.Root>
      </div>
    </Component>
  );
};

/** `Grid.RemoveButton`, outlined (the lamp's), editing; Reset. */
const RemoveButtonPart: FunctionComponent = () => {
  const id = 'grid-parts-remove-button';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsRemoveButton(addLog), [addLog]),
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
      <div className="grid-demo-content">
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
          key={defaultsKey(...Object.values(partProps))}
          {...partProps['Grid.Root']}
          editing={editing}
          style={{ ...gridSigns(), ...partProps['Grid.Root']?.style }}
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
                  onClick={() => {
                    props.onClick?.();
                    remove(device.name);
                  }}
                />
                <Grid.ResizeHandle {...partProps['Grid.ResizeHandle']} />
              </Grid.Item>
            ) : (
              deviceItem(device, others, { onRemove: remove })
            ),
          )}
        </Grid.Root>
      </div>
    </Component>
  );
};

/**
 * `Grid.Area`, outlined (the lamp's), editing: room around the lamp, its
 * size its own (uncontrolled), resized and removed by its own controls,
 * added back by a `Grid.AreaButton`.
 */
const AreaPart: FunctionComponent = () => {
  const id = 'grid-parts-area';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsArea('Lamp')(addLog), [addLog]),
    {
      emphasize: 'outline',
      external,
      isOpen: true,
      title: 'Grid.Area',
    },
  );
  const [editing, setEditing] = useState(true);
  // (Whether the lamp has its area: removed and added back by the app.)
  const [added, setAdded] = useState<GridSize | undefined>('3x1');

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            ...sharedParts,
            ...buttonParts,
            'Grid.AreaButton': ['onAdd'],
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
      title="Grid.Area"
    >
      <div className="grid-demo-content">
        <div className="grid-demo-actions">
          {editButton(editing, setEditing, partProps, addLog)}
        </div>
        <Grid.Root
          key={defaultsKey(props, ...Object.values(partProps))}
          {...partProps['Grid.Root']}
          editing={editing}
          style={{ ...gridSigns(), ...partProps['Grid.Root']?.style }}
        >
          {livingRoom.map((device) =>
            device.name === 'Lamp' ? (
              <Grid.Item
                key={device.name}
                {...partProps['Grid.Item']}
                defaultSize={device.size}
                dropName={device.name}
                supportedSizes={deviceSizes}
              >
                <div className="grid-demo-tile">{device.name}</div>
                <Grid.ResizeHandle {...partProps['Grid.ResizeHandle']} />
                {added ? (
                  <Grid.Area
                    key={elementKey}
                    {...props}
                    defaultSize={props.defaultSize ?? added}
                  >
                    <Grid.ResizeHandle {...partProps['Grid.ResizeHandle']} />
                    <Grid.RemoveButton
                      {...partProps['Grid.RemoveButton']}
                      aria-label="Remove the area around Lamp"
                      onClick={() => {
                        addLog('Lamp area: removed');
                        setAdded(undefined);
                      }}
                    />
                  </Grid.Area>
                ) : (
                  <Grid.AreaButton
                    {...partProps['Grid.AreaButton']}
                    aria-label="Add an area around Lamp"
                    onAdd={(size) => {
                      addLog(`Lamp area: added ${size}`);
                      setAdded(size);
                    }}
                  />
                )}
              </Grid.Item>
            ) : (
              deviceItem(device, partProps)
            ),
          )}
        </Grid.Root>
      </div>
    </Component>
  );
};

/**
 * `Grid.AreaButton`, outlined (the lamp's), editing: an area added around
 * the lamp (the app's: a `Grid.Area` of the size it's given), removed by
 * the x on it.
 */
const AreaButtonPart: FunctionComponent = () => {
  const id = 'grid-parts-area-button';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsAreaButton(addLog), [addLog]),
    {
      emphasize: 'outline',
      external,
      isOpen: true,
      title: 'Grid.AreaButton',
    },
  );
  const [editing, setEditing] = useState(true);
  const [area, setArea] = useState<GridSize | undefined>(undefined);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            ...sharedParts,
            ...buttonParts,
            'Grid.Area': ['onSizeChange', 'size'],
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
      title="Grid.AreaButton"
    >
      <div className="grid-demo-content">
        <div className="grid-demo-actions">
          {editButton(editing, setEditing, partProps, addLog)}
        </div>
        <Grid.Root
          key={defaultsKey(...Object.values(partProps))}
          {...partProps['Grid.Root']}
          editing={editing}
          style={{ ...gridSigns(), ...partProps['Grid.Root']?.style }}
        >
          {livingRoom.map((device) =>
            device.name === 'Lamp' ? (
              <Grid.Item
                key={device.name}
                {...partProps['Grid.Item']}
                defaultSize={device.size}
                dropName={device.name}
                supportedSizes={deviceSizes}
              >
                <div className="grid-demo-tile">{device.name}</div>
                <Grid.ResizeHandle {...partProps['Grid.ResizeHandle']} />
                {area ? (
                  <Grid.Area
                    {...partProps['Grid.Area']}
                    size={area}
                    onSizeChange={setArea}
                  >
                    <Grid.ResizeHandle {...partProps['Grid.ResizeHandle']} />
                    <Grid.RemoveButton
                      {...partProps['Grid.RemoveButton']}
                      aria-label="Remove the area around Lamp"
                      onClick={() => {
                        addLog('Lamp area: removed');
                        setArea(undefined);
                      }}
                    />
                  </Grid.Area>
                ) : (
                  <Grid.AreaButton
                    key={elementKey}
                    {...props}
                    onAdd={(size) => {
                      props.onAdd?.(size);
                      setArea(size);
                    }}
                  />
                )}
              </Grid.Item>
            ) : (
              deviceItem(device, partProps)
            ),
          )}
        </Grid.Root>
      </div>
    </Component>
  );
};

/** A tile of the app's: a device, a spacer or a break, by its name. */
type Cell =
  | { device: Device; kind: 'device'; name: string }
  | { kind: 'break'; name: string; rows?: GridBreakRows }
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
  // (A spacer and a break to start with: theirs to move, their props'.)
  const [cells, setCells] = useState<readonly Cell[]>(() => {
    const [first, ...rest] = livingRoom.map((device): Cell => ({
      device,
      kind: 'device',
      name: device.name,
    }));
    return [
      ...(first ? [first] : []),
      { kind: 'spacer', name: 'Spacer 0', size: '1x1' },
      ...rest.slice(0, 2),
      { kind: 'break', name: 'Break 0', rows: 1 },
      ...rest.slice(2),
    ];
  });
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
            'Grid.Break': ['defaultRows', 'dropName', 'reorderHandle', 'rows'],
            'Grid.Root': ['editing', 'reorderHandle'],
            'Grid.Spacer': ['defaultSize', 'dropName', 'reorderHandle', 'size'],
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
      <div className="grid-demo-content">
        {editButton(editing, setEditing, partProps, addLog)}
        <Grid.Root
          key={defaultsKey(...Object.values(partProps))}
          {...partProps['Grid.Root']}
          editing={editing}
          reorderHandle={handle}
          style={{ ...gridSigns(), ...partProps['Grid.Root']?.style }}
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
      </div>
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
      <div className="grid-demo-content">
        {editButton(editing, setEditing, partProps, addLog)}
        <Grid.Root
          key={defaultsKey(...Object.values(partProps))}
          {...partProps['Grid.Root']}
          editing={editing}
          style={{ ...gridSigns(), ...partProps['Grid.Root']?.style }}
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
      </div>
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
                      <li>
                        <PartLink part="Grid.AreaButton" /> (optional)
                      </li>
                      <li>
                        <PartLink part="Grid.CornerButton" /> (optional,
                        several)
                      </li>
                      <li>
                        <PartLink part="Grid.Area" /> (optional, no element)
                        <ul>
                          <li>
                            <PartLink part="Grid.ResizeHandle" /> (optional)
                          </li>
                          <li>
                            <PartLink part="Grid.RemoveButton" /> (optional)
                          </li>
                        </ul>
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
        Never gets fewer columns than <code>minColumns</code>: its units shrink
        below <code>unitMin</code> instead.
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
        In edit mode, a narrow end-of-line column follows the last column, and
        the columns get narrower to make room. Breaks run into it. A full-width
        tile reaches into it only in the upper half of its first row, and a
        break after it shows below that.
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
        A tile spanning some columns and rows (up to the grid’s columns and{' '}
        <code>maxTileRows</code>), or the full width whatever the columns (
        <code>*x2</code>), which starts a row of its own. What’s in it fills it,
        for example a card.
      </li>
      <li>
        Its size is what the user chose (<code>size</code>, stored by the app),
        snapped to what it supports (<code>supportedSizes</code>), and fitted to
        the columns. Only its first row decides where it goes: the rows below
        follow along.
      </li>
      <li>
        What’s in it goes in its tile (an inner element), which it fills. With a{' '}
        <PartLink part="Grid.Area" /> in it, the item takes more room than its
        tile shows, and its tile sits in that room.
      </li>
      <li>
        In edit mode, with a <code>reorderHandle</code>, it shows crosshairs in
        its top trailing corner and can be dragged after holding it for a moment
        (a quick swipe still scrolls), or moved with Alt and an arrow key. A
        placeholder shows where it’ll land.
      </li>
      <li>
        Opened (<code>open</code>, or <PartLink part="useGridItem" />
        ’s <code>setOpen</code>), its tile moves to the middle of the screen and
        grows to <code>openSize</code>, over the dimmed page, without being
        mounted anew. A faint stand-in keeps its place, so nothing in the grid
        moves. It’s a modal dialog named <code>openLabel</code>: focus moves
        into it and stays there, and a press beside it or Escape closes it.
        Starting edit mode closes it too.
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
        In edit mode it’s filled from where it starts to its row’s end and on
        into the end-of-line column, with a return sign at that end, and the
        rows it keeps empty below. With no room left in its row, it shows as a
        narrow tile in the end-of-line column. After a full-width tile, its rows
        count from that tile’s first row. It shows in the end-of-line column
        below the tile’s part of it, as many rows down as it’s tall. No taller
        than the tile, it keeps nothing empty and has only its resize handle
        there. Taller, it keeps the rows below the tile empty too.
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
        Its controls (for example a <PartLink part="Grid.ResizeHandle" />) and a{' '}
        <PartLink part="Grid.Area" /> go beside its button, not in it.
      </li>
      <li>
        Its button, named “Add” by default, fills its tile; <code>render</code>{' '}
        and the other props go to it.
      </li>
    </ul>
    <SpawnPart />
    <h3>Props</h3>
    <PropsTable rows={gridSpawnRows} />

    <Heading
      id="grid-cornerbutton"
      level={2}
    >
      <code>Grid.CornerButton</code>
    </Heading>
    <ul>
      <li>
        A button in a corner of its tile, a 44px target there. Its icon sits
        16.5px in from both of the corner’s edges, in the tile’s text color.
      </li>
      <li>
        The grid’s own controls are corner buttons:{' '}
        <PartLink part="Grid.RemoveButton" />,{' '}
        <PartLink part="Grid.ResizeHandle" /> and{' '}
        <PartLink part="Grid.AreaButton" />, shown while the grid is in edit
        mode. An app’s, for example a card’s{' '}
        <PartLink
          component="card"
          part="Card.CornerButton"
        />
        , are shown while it isn’t, so the two never share a corner.
      </li>
      <li>
        Its icon is a <code>SymbolIcon</code>: one of{' '}
        <PartLink part="gridIcons" /> or{' '}
        <PartLink
          component="card"
          part="cardIcons"
        />
        , or an app’s own, for example an SF Symbol.
      </li>
      <li>
        Hidden (<code>visible</code> off), it fades out by its color and can’t
        be pressed or focused.
      </li>
      <li>
        Where there’s no fill under it (a spacer, an area’s hatched room), its
        icon gets a faint backing.
      </li>
      <li>
        Renders a <code>button</code>. Give it a name that says what it does.
      </li>
    </ul>
    <CornerButtonPart />
    <h3>Props</h3>
    <PropsTable rows={gridCornerButtonRows} />

    <Heading
      id="gridicons"
      level={2}
    >
      <code>gridIcons</code>
    </Heading>
    <ul>
      <li>
        The grid’s edit-mode icons, as <code>SymbolIcon</code>s for a{' '}
        <PartLink part="Grid.CornerButton" /> or a{' '}
        <PartLink
          component="symbol"
          part="Symbol"
        />
        . Plain 2px lines with round ends, drawn as filled outlines.
      </li>
      <li>
        Each is drawn in a 22px square around where a corner button puts its
        icon, at the corner icons’ size (15px).
      </li>
    </ul>
    <PropsTable rows={gridIconsRows} />

    <Heading
      id="grid-resizehandle"
      level={2}
    >
      <code>Grid.ResizeHandle</code>
    </Heading>
    <ul>
      <li>
        An arc in its tile’s bottom trailing corner, in edit mode only, and only
        with another size to go to. A chevron inside it points to the top
        leading corner when the tile can only shrink, to the bottom trailing one
        when it can only grow, and both ways when it has sizes either side. With
        no <code>supportedSizes</code> (any size), the arc is alone, unless the
        tile is at the smallest or largest size it can be, for example a full
        width with the most rows: then it shows the one way it can go.
      </li>
      <li>
        Dragged, it outlines the new size from the start. Nothing moves until
        it’s released, and the size changes a little past halfway to the next
        unit. A quick tap steps to the next size, and a press held without
        moving changes nothing.
      </li>
      <li>
        Dragged into the end-of-line column, a tile at a row’s end that supports
        a size one column wider is outlined where it’ll land in the row below;
        one at a row’s start that supports the full width becomes full width.
      </li>
      <li>
        While dragged, the spacers (and breaks) it would take in show a sign.
      </li>
      <li>
        In a <PartLink part="Grid.Area" />, it resizes the area, from the area’s
        corner. In an item’s tile when the item has an area, it resizes the tile
        within the area, and nothing else moves. Dragged out of the area past
        its trailing or bottom edge (for a full-width area, into the end-of-line
        column), the tile steps to its next size up, wherever its placement
        keeps it, and dragged further it grows more.
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
        In a <PartLink part="Grid.Area" />, it sits on the area’s top leading
        corner. Its <code>onClick</code> removes the area: the app stops
        rendering it, and the tile keeps its size.
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
      id="grid-areabutton"
      level={2}
    >
      <code>Grid.AreaButton</code>
    </Heading>
    <ul>
      <li>
        Three diagonal strokes, the hatching in small, in its tile’s bottom
        leading corner. It shows in edit mode only, and only on an item without
        an area.
      </li>
      <li>
        Pressed, it calls <code>onAdd</code> with an area one column wider than
        the tile, as tall; the app then renders a <PartLink part="Grid.Area" />{' '}
        of that size, its tile centered in it. A tile as wide as the grid gets a
        row more instead. If it can’t grow either way, or no supported size
        holds it, the button doesn’t show. The nearest larger supported size is
        taken when that exact one isn’t supported.
      </li>
      <li>
        A <PartLink part="Grid.RemoveButton" /> in the area takes it away again:
        an x on the area’s own top leading corner.
      </li>
      <li>
        Renders a <code>button</code> named “Add area” by default.
      </li>
    </ul>
    <AreaButtonPart />
    <h3>Props</h3>
    <PropsTable rows={gridAreaButtonRows} />

    <Heading
      id="grid-area"
      level={2}
    >
      <code>Grid.Area</code>
    </Heading>
    <ul>
      <li>
        Room around an item’s tile (or an add tile’s): the room the item takes
        in the layout, at least its tile’s size. The rest is hatched in edit
        mode. Its presence is the item having an area: without one, the item
        takes the room of its tile.
      </li>
      <li>
        Its size works like an item’s (<code>size</code>,{' '}
        <code>supportedSizes</code>, <code>onSizeChange</code>). On a narrower
        grid it gives way first, then the tile fits in it.
      </li>
      <li>
        Its tile sits in its middle by default, truly centered even off the unit
        lines, or in a corner (<code>placement</code>). In edit mode, a tile in
        a corner sits 24px in from it (<code>--uikit-grid-corner-inset</code>),
        off the area’s own controls.
      </li>
      <li>
        A <code>movable</code> tile shows crosshairs in its top trailing corner
        in edit mode, and is held and dragged to the middle or a corner, or
        stepped there with the arrow keys while it has focus. A hold on the
        hatched room moves the whole item.
      </li>
      <li>
        Its controls go in it: a <PartLink part="Grid.ResizeHandle" /> resizes
        the area from its bottom trailing corner, a{' '}
        <PartLink part="Grid.RemoveButton" /> on its top leading corner removes
        it. What’s in it can read it with <code>useGridArea</code>, as{' '}
        <PartLink part="useGridItem" /> reads the item.
      </li>
      <li>
        When the tile fills its area, their corners meet and the tile’s controls
        are the ones shown. Its resize handle resizes the tile first: shrinking
        it opens room around it, and growing it grows the area along to the
        smallest of its sizes that fits. A hold on the tile moves the whole
        item, as it can’t move inside its area.
      </li>
      <li>It renders no element of its own.</li>
    </ul>
    <AreaPart />
    <h3>Props</h3>
    <PropsTable rows={gridAreaRows} />
    <h3>
      <code>useGridArea</code> returns
    </h3>
    <PropsTable rows={gridUseGridAreaRows} />

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
        prints it, and changes as you resize its tile. On a grid of 3 columns,
        the 4x2 camera shows as 3x2 and says what it asked for.
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
  CornerButtonPart,
  ResizeHandlePart,
  RemoveButtonPart,
  AreaPart,
  AreaButtonPart,
  CreateReorderHandlePart,
  UseGridItemPart,
];
