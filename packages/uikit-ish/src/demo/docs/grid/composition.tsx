import { FunctionComponent, useMemo, useRef, useState } from 'react';

import {
  Button,
  Grid,
  type GridBreakRows,
  gridIcons,
  type GridPlacement,
  type GridSize,
  type GridSizeChangeDetails,
  Menu,
  Page,
  useGridItem,
  Viewport,
} from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePresentation } from '../../tooling/frame/presentation.js';
import { usePartControls } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { gridSigns } from '../../tooling/grid-signs.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import {
  type Device,
  deviceKinds,
  devices,
  deviceSizes,
  rooms,
} from './content.js';
import { defaultsKey } from './props.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */

// Rooms on a tablet.

const roomsCode = `// The app's card (here just the device's name).
const DeviceCard = ({ name }) => <div className="device-card">{name}</div>;

const rooms = ['Living Room', 'Kitchen', 'Garden'];
const [byRoom, setByRoom] = useState({
  'Living Room': [
    { name: 'Lamp', size: '1x1' },
    { name: 'Thermostat', size: '2x2' },
    …
  ],
  Kitchen: […],
  Garden: […],
});
const [editing, setEditing] = useState(false);
const handle = Grid.useCreateReorderHandle({
  onReorder: (change) =>
    setByRoom((current) => Grid.reorder(current, change, ({ name }) => name)),
});
const resize = (name, size) =>
  setByRoom((current) =>
    Object.fromEntries(
      Object.entries(current).map(([room, devices]) => [
        room,
        devices.map((device) =>
          device.name === name ? { ...device, size } : device,
        ),
      ]),
    ),
  );

<Button.Root variant="bordered" onClick={() => setEditing(!editing)}>
  <Button.Label>{editing ? 'Done' : 'Edit'}</Button.Label>
</Button.Root>
<Grid.Root editing={editing}>
  {rooms.map((room) => (
    <Grid.Section
      key={room}
      aria-labelledby={\`room-\${room}\`}
      dropName={room}
      reorderHandle={handle}
    >
      <Grid.Header>
        <h3 id={\`room-\${room}\`}>{room}</h3>
      </Grid.Header>
      {byRoom[room].map(({ name, size }) => (
        <Grid.Item
          key={name}
          dropName={name}
          reorderHandle={handle}
          size={size}
          supportedSizes={['1x1', '2x1', '1x2', '2x2', '3x2']}
          onSizeChange={(next) => resize(name, next)}
        >
          <DeviceCard name={name} />
          <Grid.ResizeHandle />
        </Grid.Item>
      ))}
    </Grid.Section>
  ))}
</Grid.Root>`;

/** A tablet: rooms as sections, tiles moved between them, sizes stored. */
const Rooms: FunctionComponent = () => {
  const id = 'grid-composition-rooms';
  const [log, addLog] = useLog();
  const [editing, setEditing] = useState(false);
  const [byRoom, setByRoom] = useState<
    Readonly<Record<string, readonly Device[]>>
  >(() =>
    Object.fromEntries(
      rooms.map((room) => [
        room,
        devices.filter((device) => device.room === room),
      ]),
    ),
  );
  const handle = Grid.useCreateReorderHandle({
    onReorder: (change) => {
      addLog(
        `move ${String(change.items[0]?.name)} to ${String(change.target.name)}`,
      );
      setByRoom((current) => Grid.reorder(current, change, ({ name }) => name));
    },
  });
  const resize = (name: string, size: GridSize) => {
    addLog(`${name} size: ${size}`);
    setByRoom((current) =>
      Object.fromEntries(
        Object.entries(current).map(([room, list]) => [
          room,
          list.map((device) =>
            device.name === name ? { ...device, size } : device,
          ),
        ]),
      ),
    );
  };

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Label': [],
            'Button.Root': ['onClick', 'variant'],
            'Grid.Header': [],
            'Grid.Item': [
              'defaultSize',
              'dropName',
              'onSizeChange',
              'reorderHandle',
              'size',
              'supportedSizes',
            ],
            'Grid.ResizeHandle': [],
            'Grid.Root': ['editing'],
            'Grid.Section': ['dropName', 'reorderHandle'],
            'Page.Root': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  const [presentationControl, presentation, presentationState] =
    usePresentation(id);

  return (
    <Component
      isExpanded
      isInline
      controls={[presentationControl, partControls]}
      id={id}
      log={log}
      stage={presentation}
      state={[partState, presentationState]}
      title="Grid"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Page.Root {...partProps['Page.Root']}>
          <Viewport.Padding
            {...partProps['Viewport.Padding']}
            edge="block-start"
          />
          <div className="grid-demo-content">
            <div className="grid-demo-actions">
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
            </div>
            <Grid.Root
              key={defaultsKey(...Object.values(partProps))}
              {...partProps['Grid.Root']}
              editing={editing}
              style={gridSigns(partProps['Grid.Root']?.style)}
            >
              {rooms.map((room) => (
                <Grid.Section
                  key={room}
                  aria-labelledby={`${id}-${room}`}
                  {...partProps['Grid.Section']}
                  dropName={room}
                  reorderHandle={handle}
                >
                  <Grid.Header {...partProps['Grid.Header']}>
                    <h3
                      className="grid-demo-heading"
                      id={`${id}-${room}`}
                    >
                      {room}
                    </h3>
                  </Grid.Header>
                  {(byRoom[room] ?? []).map(({ name, size }) => (
                    <Grid.Item
                      key={name}
                      {...partProps['Grid.Item']}
                      dropName={name}
                      reorderHandle={handle}
                      size={size}
                      supportedSizes={deviceSizes}
                      onSizeChange={(next) => resize(name, next)}
                    >
                      <div className="grid-demo-tile">{name}</div>
                      <Grid.ResizeHandle {...partProps['Grid.ResizeHandle']} />
                    </Grid.Item>
                  ))}
                </Grid.Section>
              ))}
            </Grid.Root>
          </div>
          <Viewport.Padding
            {...partProps['Viewport.Padding']}
            edge="block-end"
          />
        </Page.Root>
      </Viewport.Content>
    </Component>
  );
};

// Holes and line breaks.

/** A tile of the app's: a device, a spacer or a break, by its name. */
type Cell =
  | { kind: 'break'; name: string; rows?: GridBreakRows }
  | { kind: 'device'; name: string; size: GridSize }
  | { kind: 'spacer'; name: string; size?: GridSize };

const cellsInitial: readonly Cell[] = [
  { kind: 'device', name: 'Lamp', size: '1x1' },
  { kind: 'spacer', name: 'Spacer 1', size: '1x1' },
  { kind: 'device', name: 'Blinds', size: '1x1' },
  { kind: 'break', name: 'Break 1', rows: 1 },
  { kind: 'device', name: 'Thermostat', size: '2x2' },
  { kind: 'device', name: 'Speaker', size: '2x1' },
  { kind: 'device', name: 'Kettle', size: '1x1' },
];

/**
 * Cleaned up on Done: no breaks at the start or end, breaks in a row
 * merged into one (at most 3 rows).
 */
const tidy = (cells: readonly Cell[]): readonly Cell[] => {
  const first = cells.findIndex(({ kind }) => kind !== 'break');
  const last = cells.findLastIndex(({ kind }) => kind !== 'break');
  const tidied: Cell[] = [];
  for (const cell of first === -1 ? [] : cells.slice(first, last + 1)) {
    const previous = tidied.at(-1);
    if (cell.kind === 'break' && previous?.kind === 'break') {
      const rows = Math.min(3, (previous.rows ?? 1) + (cell.rows ?? 1));
      tidied[tidied.length - 1] = { ...previous, rows: rows as GridBreakRows };
      continue;
    }
    tidied.push(cell);
  }
  return tidied;
};

const holesCode = `// The app's card (here just the device's name).
const DeviceCard = ({ name }) => <div className="device-card">{name}</div>;

// A symbol as a mask image (a CSS url()), for the grid's signs.
const maskOf = ({ svgPathData, viewBox }) => {
  const paths = svgPathData.map(({ d }) => \`<path d="\${d}"/>\`).join('');
  const svg = \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="\${viewBox}">\${paths}</svg>\`;
  return \`url("data:image/svg+xml,\${encodeURIComponent(svg)}")\`;
};

// Cleaned up on Done: no breaks at the start or end, breaks in a row
// merged into one.
const tidy = (cells) => {
  const first = cells.findIndex(({ kind }) => kind !== 'break');
  const last = cells.findLastIndex(({ kind }) => kind !== 'break');
  const tidied = [];
  for (const cell of first === -1 ? [] : cells.slice(first, last + 1)) {
    const previous = tidied.at(-1);
    if (cell.kind === 'break' && previous?.kind === 'break') {
      const rows = Math.min(3, (previous.rows ?? 1) + (cell.rows ?? 1));
      tidied[tidied.length - 1] = { ...previous, rows };
    } else {
      tidied.push(cell);
    }
  }
  return tidied;
};

let count = 0;
const newName = () => \`cell-\${++count}\`;

const [saved, setSaved] = useState([
  { kind: 'device', name: 'Lamp', size: '1x1' },
  { kind: 'spacer', name: 'Spacer 1', size: '1x1' },
  { kind: 'device', name: 'Blinds', size: '1x1' },
  { kind: 'break', name: 'Break 1', rows: 1 },
  …
]);
const [draft, setDraft] = useState();
const cells = draft ?? saved;
const edit = (change) => setDraft((current) => current && change(current));
const handle = Grid.useCreateReorderHandle({
  breaks: true,
  spacers: true,
  onReorder: (change) =>
    edit((current) =>
      Grid.reorder(current, change, ({ name }) => name, {
        breakOf: (rows) => ({ kind: 'break', name: newName(), rows }),
        spacerOf: (size) => ({ kind: 'spacer', name: newName(), size }),
        withRows: (cell, rows) => ({ ...cell, rows }),
      }),
    ),
});
// Resized: its size, and what it took in removed.
const resize = (name, size, { merged }) =>
  edit((current) =>
    current
      .filter((cell) => !merged.includes(cell.name))
      .map((cell) => (cell.name === name ? { ...cell, size } : cell)),
  );
const remove = (name) =>
  edit((current) => current.filter((cell) => cell.name !== name));
const toggle = () => {
  if (draft) setSaved(tidy(draft));
  setDraft(draft ? undefined : saved);
};

<Button.Root variant="bordered" onClick={toggle}>
  <Button.Label>{draft ? 'Done' : 'Edit'}</Button.Label>
</Button.Root>
<Grid.Root
  editing={Boolean(draft)}
  reorderHandle={handle}
  style={{
    '--uikit-grid-offer-sign': maskOf(sfRectangleBadgeSparkles),
    '--uikit-grid-merge-sign': maskOf(sfXmarkRectangle),
  }}
>
  {cells.map((cell) =>
    cell.kind === 'break' ? (
      <Grid.Break
        key={cell.name}
        dropName={cell.name}
        reorderHandle={handle}
        rows={cell.rows}
        onRowsChange={(rows, details) => resize(cell.name, rows, details)}
      >
        <Grid.RemoveButton onClick={() => remove(cell.name)} />
        <Grid.ResizeHandle />
      </Grid.Break>
    ) : cell.kind === 'spacer' ? (
      <Grid.Spacer
        key={cell.name}
        dropName={cell.name}
        reorderHandle={handle}
        size={cell.size}
        onSizeChange={(size, details) => resize(cell.name, size, details)}
      >
        <Grid.RemoveButton onClick={() => remove(cell.name)} />
        <Grid.ResizeHandle />
      </Grid.Spacer>
    ) : (
      <Grid.Item
        key={cell.name}
        dropName={cell.name}
        reorderHandle={handle}
        size={cell.size}
        onSizeChange={(size, details) => resize(cell.name, size, details)}
      >
        <DeviceCard name={cell.name} />
        <Grid.ResizeHandle />
      </Grid.Item>
    ),
  )}
</Grid.Root>`;

/**
 * A phone: a draft of the tiles while editing (saved, cleaned up, on Done),
 * spacers and breaks added by moves, moved, resized and removed.
 */
const Holes: FunctionComponent = () => {
  const id = 'grid-composition-holes';
  const [log, addLog] = useLog();
  const [saved, setSaved] = useState(cellsInitial);
  const [draft, setDraft] = useState<readonly Cell[] | undefined>(undefined);
  const cells = draft ?? saved;
  const made = useRef(1);
  const newName = (kind: string) => {
    made.current += 1;
    return `${kind} ${String(made.current)}`;
  };
  const edit = (change: (current: readonly Cell[]) => readonly Cell[]) =>
    setDraft((current) => current && change(current));
  const handle = Grid.useCreateReorderHandle({
    breaks: true,
    onReorder: (change) => {
      addLog(
        `move ${String(change.items[0]?.name)} after ${change.target.after ?? '–'}`,
      );
      edit((current) =>
        Grid.reorder(current, change, ({ name }) => name, {
          breakOf: (rows): Cell => ({
            kind: 'break',
            name: newName('Break'),
            rows,
          }),
          spacerOf: (size): Cell => ({
            kind: 'spacer',
            name: newName('Spacer'),
            size,
          }),
          withRows: (cell, rows) =>
            cell.kind === 'break' ? { ...cell, rows } : cell,
        }),
      );
    },
    spacers: true,
  });
  const resize = (
    name: string,
    change: { rows: GridBreakRows } | { size: GridSize },
    { merged }: GridSizeChangeDetails,
  ) => {
    addLog(
      `${name}: ${'rows' in change ? `${String(change.rows)} rows` : change.size}${merged.length > 0 ? `, took in ${merged.join(', ')}` : ''}`,
    );
    edit((current) =>
      current
        .filter((cell) => !merged.includes(cell.name))
        .map((cell) => (cell.name === name ? { ...cell, ...change } : cell)),
    );
  };
  const remove = (name: string) => {
    addLog(`remove ${name}`);
    edit((current) => current.filter((cell) => cell.name !== name));
  };

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Label': [],
            'Button.Root': ['onClick', 'variant'],
            'Grid.Break': [
              'defaultRows',
              'dropName',
              'onRowsChange',
              'reorderHandle',
              'rows',
            ],
            'Grid.Item': [
              'defaultSize',
              'dropName',
              'onSizeChange',
              'reorderHandle',
              'size',
            ],
            'Grid.RemoveButton': ['onClick'],
            'Grid.ResizeHandle': [],
            'Grid.Root': ['editing', 'reorderHandle', 'style'],
            'Grid.Spacer': [
              'defaultSize',
              'dropName',
              'onSizeChange',
              'reorderHandle',
              'size',
            ],
            'Page.Root': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  const [presentationControl, presentation, presentationState] =
    usePresentation(id);

  return (
    <Component
      isInline
      controls={[presentationControl, partControls]}
      id={id}
      log={log}
      stage={presentation}
      state={[partState, presentationState]}
      title="Grid"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Page.Root {...partProps['Page.Root']}>
          <Viewport.Padding
            {...partProps['Viewport.Padding']}
            edge="block-start"
          />
          <div className="grid-demo-content">
            <div className="grid-demo-actions">
              <Button.Root
                {...partProps['Button.Root']}
                variant="bordered"
                onClick={() => {
                  addLog(draft ? 'done' : 'edit');
                  if (draft) setSaved(tidy(draft));
                  setDraft(draft ? undefined : saved);
                }}
              >
                <Button.Label {...partProps['Button.Label']}>
                  {draft ? 'Done' : 'Edit'}
                </Button.Label>
              </Button.Root>
            </div>
            <Grid.Root
              key={defaultsKey(...Object.values(partProps))}
              {...partProps['Grid.Root']}
              editing={draft !== undefined}
              reorderHandle={handle}
              style={gridSigns(partProps['Grid.Root']?.style)}
            >
              {cells.map((cell) => {
                if (cell.kind === 'break') {
                  return (
                    <Grid.Break
                      key={cell.name}
                      {...partProps['Grid.Break']}
                      dropName={cell.name}
                      reorderHandle={handle}
                      rows={cell.rows}
                      onRowsChange={(rows, details) =>
                        resize(cell.name, { rows }, details)
                      }
                    >
                      <Grid.RemoveButton
                        {...partProps['Grid.RemoveButton']}
                        onClick={() => remove(cell.name)}
                      />
                      <Grid.ResizeHandle {...partProps['Grid.ResizeHandle']} />
                    </Grid.Break>
                  );
                }
                return cell.kind === 'spacer' ? (
                  <Grid.Spacer
                    key={cell.name}
                    {...partProps['Grid.Spacer']}
                    dropName={cell.name}
                    reorderHandle={handle}
                    size={cell.size}
                    onSizeChange={(size, details) =>
                      resize(cell.name, { size }, details)
                    }
                  >
                    <Grid.RemoveButton
                      {...partProps['Grid.RemoveButton']}
                      onClick={() => remove(cell.name)}
                    />
                    <Grid.ResizeHandle {...partProps['Grid.ResizeHandle']} />
                  </Grid.Spacer>
                ) : (
                  <Grid.Item
                    key={cell.name}
                    {...partProps['Grid.Item']}
                    dropName={cell.name}
                    reorderHandle={handle}
                    size={cell.size}
                    onSizeChange={(size, details) =>
                      resize(cell.name, { size }, details)
                    }
                  >
                    <div className="grid-demo-tile">{cell.name}</div>
                    <Grid.ResizeHandle {...partProps['Grid.ResizeHandle']} />
                  </Grid.Item>
                );
              })}
            </Grid.Root>
          </div>
          <Viewport.Padding
            {...partProps['Viewport.Padding']}
            edge="block-end"
          />
        </Page.Root>
      </Viewport.Content>
    </Component>
  );
};

// Adding and removing tiles.

/** The tiles to start with, and to reset to (sizes included). */
const startingTiles: readonly { name: string; size: GridSize }[] = [
  { name: 'Sprinkler', size: '1x1' },
  { name: 'Gate', size: '2x1' },
  { name: 'Path Lights', size: '1x1' },
];

const addingCode = `// The app's card (here just the device's name).
const DeviceCard = ({ name }) => <div className="device-card">{name}</div>;

const startingTiles = [
  { name: 'Sprinkler', size: '1x1' },
  { name: 'Gate', size: '2x1' },
  { name: 'Path Lights', size: '1x1' },
];
let count = 0;
const newName = (kind) => \`\${kind} \${++count}\`;

const [tiles, setTiles] = useState(startingTiles);
const [editing, setEditing] = useState(false);
const add = (kind) =>
  setTiles((current) => [...current, { name: newName(kind), size: '1x1' }]);
const remove = (name) =>
  setTiles((current) => current.filter((tile) => tile.name !== name));
const resize = (name, size) =>
  setTiles((current) =>
    current.map((tile) => (tile.name === name ? { ...tile, size } : tile)),
  );

<Button.Root variant="bordered" onClick={() => setEditing(!editing)}>
  <Button.Label>{editing ? 'Done' : 'Edit'}</Button.Label>
</Button.Root>
<Button.Root variant="bordered" onClick={() => setTiles(startingTiles)}>
  <Button.Label>Reset</Button.Label>
</Button.Root>
<Grid.Root
  editing={editing}
  // (maskOf: see Holes and line breaks.)
  style={{ '--uikit-grid-spawn-sign': maskOf(sfPlusRectangle) }}
>
  {tiles.map(({ name, size }) => (
    <Grid.Item
      key={name}
      dropName={name}
      size={size}
      onSizeChange={(next) => resize(name, next)}
    >
      <DeviceCard name={name} />
      <Grid.RemoveButton
        aria-label={\`Remove \${name}\`}
        onClick={() => remove(name)}
      />
      <Grid.ResizeHandle />
    </Grid.Item>
  ))}
  <Menu.Root>
    <Menu.Trigger render={<Grid.Spawn aria-label="Add a device" />} />
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup>
          {['Lamp', 'Switch', 'Sensor'].map((kind) => (
            <Menu.Item key={kind} onClick={() => add(kind)}>
              <Menu.Label>{kind}</Menu.Label>
            </Menu.Item>
          ))}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</Grid.Root>`;

/**
 * A phone: a garden's tiles, an add tile opening a menu of devices, remove
 * buttons in edit mode, Reset bringing the tiles back as they were.
 */
const Adding: FunctionComponent = () => {
  const id = 'grid-composition-adding';
  const [log, addLog] = useLog();
  const [tiles, setTiles] = useState(startingTiles);
  const [editing, setEditing] = useState(false);
  const made = useRef(0);
  const add = (kind: string) => {
    made.current += 1;
    const name = `${kind} ${String(made.current)}`;
    addLog(`add ${name}`);
    setTiles((current) => [...current, { name, size: '1x1' }]);
  };
  const remove = (name: string) => {
    addLog(`remove ${name}`);
    setTiles((current) => current.filter((tile) => tile.name !== name));
  };
  const resize = (name: string, size: GridSize) => {
    addLog(`${name} size: ${size}`);
    setTiles((current) =>
      current.map((tile) => (tile.name === name ? { ...tile, size } : tile)),
    );
  };

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Label': [],
            'Button.Root': ['onClick', 'variant'],
            'Grid.Item': ['defaultSize', 'dropName', 'onSizeChange', 'size'],
            'Grid.RemoveButton': ['aria-label', 'onClick'],
            'Grid.ResizeHandle': [],
            'Grid.Root': ['editing', 'style'],
            'Grid.Spawn': ['aria-label'],
            'Menu.Item': ['onClick'],
            'Menu.Label': [],
            'Menu.Popup': [],
            'Menu.Portal': [],
            'Menu.Positioner': [],
            'Menu.Root': [],
            'Menu.Trigger': ['render'],
            'Page.Root': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  const [presentationControl, presentation, presentationState] =
    usePresentation(id);

  return (
    <Component
      isInline
      controls={[presentationControl, partControls]}
      id={id}
      log={log}
      stage={presentation}
      state={[partState, presentationState]}
      title="Grid"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Page.Root {...partProps['Page.Root']}>
          <Viewport.Padding
            {...partProps['Viewport.Padding']}
            edge="block-start"
          />
          <div className="grid-demo-content">
            <div className="grid-demo-actions">
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
              <Button.Root
                {...partProps['Button.Root']}
                variant="bordered"
                onClick={() => {
                  addLog('reset');
                  setTiles(startingTiles);
                }}
              >
                <Button.Label {...partProps['Button.Label']}>
                  Reset
                </Button.Label>
              </Button.Root>
            </div>
            <Grid.Root
              key={defaultsKey(...Object.values(partProps))}
              {...partProps['Grid.Root']}
              editing={editing}
              style={gridSigns(partProps['Grid.Root']?.style)}
            >
              {tiles.map(({ name, size }) => (
                <Grid.Item
                  key={name}
                  {...partProps['Grid.Item']}
                  dropName={name}
                  size={size}
                  onSizeChange={(next) => resize(name, next)}
                >
                  <div className="grid-demo-tile">{name}</div>
                  <Grid.RemoveButton
                    {...partProps['Grid.RemoveButton']}
                    aria-label={`Remove ${name}`}
                    onClick={() => remove(name)}
                  />
                  <Grid.ResizeHandle {...partProps['Grid.ResizeHandle']} />
                </Grid.Item>
              ))}
              <Menu.Root {...partProps['Menu.Root']}>
                <Menu.Trigger
                  {...partProps['Menu.Trigger']}
                  render={
                    <Grid.Spawn
                      {...partProps['Grid.Spawn']}
                      aria-label="Add a device"
                    />
                  }
                />
                <Menu.Portal {...partProps['Menu.Portal']}>
                  <Menu.Positioner {...partProps['Menu.Positioner']}>
                    <Menu.Popup {...partProps['Menu.Popup']}>
                      {deviceKinds.map((kind) => (
                        <Menu.Item
                          key={kind}
                          {...partProps['Menu.Item']}
                          onClick={() => add(kind)}
                        >
                          <Menu.Label {...partProps['Menu.Label']}>
                            {kind}
                          </Menu.Label>
                        </Menu.Item>
                      ))}
                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Portal>
              </Menu.Root>
            </Grid.Root>
          </div>
          <Viewport.Padding
            {...partProps['Viewport.Padding']}
            edge="block-end"
          />
        </Page.Root>
      </Viewport.Content>
    </Component>
  );
};

// Room around a tile.

/** A clock in room of its own, among the living room's tiles. */
const roomTilesInitial: readonly {
  area?: GridSize;
  name: string;
  placement?: GridPlacement;
  size: GridSize;
}[] = [
  { name: 'Lamp', size: '1x1' },
  { area: '*x3', name: 'Clock', size: '1x1' },
  { name: 'Blinds', size: '1x1' },
  { name: 'Speaker', size: '2x1' },
];

const roomCode = `// The app's card (here just the device's name).
const DeviceCard = ({ name }) => <div className="device-card">{name}</div>;

const [tiles, setTiles] = useState([
  { name: 'Lamp', size: '1x1' },
  { area: '*x3', name: 'Clock', size: '1x1' },
  { name: 'Blinds', size: '1x1' },
  { name: 'Speaker', size: '2x1' },
]);
const [editing, setEditing] = useState(false);
const change = (name, values) =>
  setTiles((current) =>
    current.map((tile) => (tile.name === name ? { ...tile, ...values } : tile)),
  );
// On Done, an area stored as big as its tile goes: it adds nothing.
const toggleEditing = () => {
  if (editing) {
    setTiles((current) =>
      current.map(({ area, placement, ...tile }) =>
        area === tile.size ? tile : { ...tile, area, placement },
      ),
    );
  }
  setEditing(!editing);
};

<Button.Root variant="bordered" onClick={toggleEditing}>
  <Button.Label>{editing ? 'Done' : 'Edit'}</Button.Label>
</Button.Root>
<Grid.Root editing={editing}>
  {tiles.map(({ area, name, placement, size }) => (
    <Grid.Item
      key={name}
      dropName={name}
      size={size}
      supportedSizes={['1x1', '2x1', '2x2']}
      onSizeChange={(next) => change(name, { size: next })}
    >
      <DeviceCard name={name} />
      <Grid.ResizeHandle />
      {area ? (
        // Room around the tile: its own size, the tile's place in it, and
        // its own controls, in its corners.
        <Grid.Area
          movable
          placement={placement}
          size={area}
          onPlacementChange={(next) => change(name, { placement: next })}
          onSizeChange={(next) => change(name, { area: next })}
        >
          <Grid.ResizeHandle />
          <Grid.RemoveButton
            aria-label={\`Remove the area around \${name}\`}
            onClick={() => change(name, { area: undefined, placement: undefined })}
          />
        </Grid.Area>
      ) : (
        <Grid.AreaButton
          aria-label={\`Add an area around \${name}\`}
          onAdd={(next) => change(name, { area: next })}
        />
      )}
    </Grid.Item>
  ))}
</Grid.Root>`;

/**
 * A tablet: a clock, small, in a full-width area of three rows; its
 * area and its size resized on their own, it moved within its area (to
 * its middle or a corner), all stored.
 */
const Room: FunctionComponent = () => {
  const id = 'grid-composition-room';
  const [log, addLog] = useLog();
  const [tiles, setTiles] = useState(roomTilesInitial);
  const [editing, setEditing] = useState(false);
  const change = (
    name: string,
    values:
      | { area: GridSize | undefined; placement?: undefined }
      | { placement: GridPlacement }
      | { size: GridSize },
  ) => {
    addLog(
      `${name} ${Object.entries(values)
        .map(([key, value]) => `${key}: ${String(value)}`)
        .join(', ')}`,
    );
    setTiles((current) =>
      current.map((tile) =>
        tile.name === name ? { ...tile, ...values } : tile,
      ),
    );
  };

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Label': [],
            'Button.Root': ['onClick', 'variant'],
            'Grid.Item': [
              'defaultSize',
              'dropName',
              'onSizeChange',
              'size',
              'supportedSizes',
            ],
            'Grid.Area': [
              'defaultPlacement',
              'defaultSize',
              'movable',
              'onPlacementChange',
              'onSizeChange',
              'placement',
              'size',
            ],
            'Grid.AreaButton': ['aria-label', 'onAdd'],
            'Grid.RemoveButton': ['aria-label', 'onClick'],
            'Grid.ResizeHandle': [],
            'Grid.Root': ['editing'],
            'Page.Root': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  const [presentationControl, presentation, presentationState] =
    usePresentation(id);

  return (
    <Component
      isExpanded
      isInline
      controls={[presentationControl, partControls]}
      id={id}
      log={log}
      stage={presentation}
      state={[partState, presentationState]}
      title="Grid"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Page.Root {...partProps['Page.Root']}>
          <Viewport.Padding
            {...partProps['Viewport.Padding']}
            edge="block-start"
          />
          <div className="grid-demo-content">
            <div className="grid-demo-actions">
              <Button.Root
                {...partProps['Button.Root']}
                variant="bordered"
                onClick={() => {
                  addLog(editing ? 'done' : 'edit');
                  // (On Done, an area stored as big as its tile goes.)
                  if (editing) {
                    setTiles((current) =>
                      current.map((tile) => {
                        if (tile.area !== tile.size) return tile;
                        addLog(`${tile.name} area: removed (as big as it)`);
                        return { name: tile.name, size: tile.size };
                      }),
                    );
                  }
                  setEditing(!editing);
                }}
              >
                <Button.Label {...partProps['Button.Label']}>
                  {editing ? 'Done' : 'Edit'}
                </Button.Label>
              </Button.Root>
            </div>
            <Grid.Root
              key={defaultsKey(...Object.values(partProps))}
              {...partProps['Grid.Root']}
              editing={editing}
              style={gridSigns(partProps['Grid.Root']?.style)}
            >
              {tiles.map(({ area, name, placement, size }) => (
                <Grid.Item
                  key={name}
                  {...partProps['Grid.Item']}
                  dropName={name}
                  size={size}
                  supportedSizes={['1x1', '2x1', '2x2']}
                  onSizeChange={(next) => change(name, { size: next })}
                >
                  <div className="grid-demo-tile">{name}</div>
                  <Grid.ResizeHandle {...partProps['Grid.ResizeHandle']} />
                  {area ? (
                    <Grid.Area
                      {...partProps['Grid.Area']}
                      movable
                      placement={placement}
                      size={area}
                      onSizeChange={(next) => change(name, { area: next })}
                      onPlacementChange={(next) =>
                        change(name, { placement: next })
                      }
                    >
                      <Grid.ResizeHandle {...partProps['Grid.ResizeHandle']} />
                      <Grid.RemoveButton
                        {...partProps['Grid.RemoveButton']}
                        aria-label={`Remove the area around ${name}`}
                        onClick={() =>
                          change(name, {
                            area: undefined,
                            placement: undefined,
                          })
                        }
                      />
                    </Grid.Area>
                  ) : (
                    <Grid.AreaButton
                      {...partProps['Grid.AreaButton']}
                      aria-label={`Add an area around ${name}`}
                      onAdd={(next) => change(name, { area: next })}
                    />
                  )}
                </Grid.Item>
              ))}
            </Grid.Root>
          </div>
          <Viewport.Padding
            {...partProps['Viewport.Padding']}
            edge="block-end"
          />
        </Page.Root>
      </Viewport.Content>
    </Component>
  );
};

// Expanding in place.

const expandingCode = `// The app's card (here just the device's name).
const DeviceCard = ({ name }) => <div className="device-card">{name}</div>;

// Which tiles are expanded: the app's state.
const [expanded, setExpanded] = useState([]);
const toggle = (name) =>
  setExpanded((current) =>
    current.includes(name)
      ? current.filter((each) => each !== name)
      : [...current, name],
  );

<Grid.Root>
  {tiles.map(({ area, expandedSize, name, size }) => {
    const isExpanded = expanded.includes(name);
    return (
      <Grid.Item
        key={name}
        size={isExpanded ? expandedSize : size}
        supportedSizes={[size, expandedSize]}
      >
        <DeviceCard name={name} />
        <Grid.CornerButton
          mirrored
          aria-expanded={isExpanded}
          aria-label={\`\${name} details\`}
          icon={isExpanded ? gridIcons.collapse : gridIcons.expand}
          onClick={() => toggle(name)}
        />
        {/* Room around it: it grows in there, nothing else moving. */}
        {area ? <Grid.Area size={area} /> : null}
      </Grid.Item>
    );
  })}
</Grid.Root>`;

/** The tiles that expand (see `Expanding`): their sizes, an area. */
const expandingTiles: readonly {
  area?: GridSize;
  expandedSize: GridSize;
  name: string;
  size: GridSize;
}[] = [
  { expandedSize: '2x2', name: 'Heating', size: '1x1' },
  { expandedSize: '2x1', name: 'Lamp', size: '1x1' },
  { area: '3x2', expandedSize: '2x2', name: 'Clock', size: '1x1' },
  { expandedSize: '4x2', name: 'Speaker', size: '2x1' },
];

/**
 * A tablet: tiles expanding in place by a corner button (the app's state:
 * their sizes), their neighbors reflowing; one in an area, growing in it.
 */
const Expanding: FunctionComponent = () => {
  const id = 'grid-composition-expanding';
  const [log, addLog] = useLog();
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set());
  const toggle = (name: string) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      addLog(`${name} ${next.has(name) ? 'expanded' : 'small again'}`);
      return next;
    });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Grid.Area': ['size'],
            'Grid.CornerButton': [
              'aria-expanded',
              'aria-label',
              'icon',
              'mirrored',
              'onClick',
            ],
            'Grid.Item': ['size', 'supportedSizes'],
            'Grid.Root': [],
            'Page.Root': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  const [presentationControl, presentation, presentationState] =
    usePresentation(id);

  return (
    <Component
      isExpanded
      isInline
      controls={[presentationControl, partControls]}
      id={id}
      log={log}
      stage={presentation}
      state={[partState, presentationState]}
      title="Grid"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Page.Root {...partProps['Page.Root']}>
          <Viewport.Padding
            {...partProps['Viewport.Padding']}
            edge="block-start"
          />
          <div className="grid-demo-content">
            <Grid.Root
              key={defaultsKey(...Object.values(partProps))}
              {...partProps['Grid.Root']}
              style={gridSigns(partProps['Grid.Root']?.style)}
            >
              {expandingTiles.map(({ area, expandedSize, name, size }) => {
                const isExpanded = expanded.has(name);
                return (
                  <Grid.Item
                    key={name}
                    {...partProps['Grid.Item']}
                    size={isExpanded ? expandedSize : size}
                    supportedSizes={[size, expandedSize]}
                  >
                    <div className="grid-demo-tile">{name}</div>
                    <Grid.CornerButton
                      {...partProps['Grid.CornerButton']}
                      mirrored
                      aria-expanded={isExpanded}
                      aria-label={`${name} details`}
                      icon={isExpanded ? gridIcons.collapse : gridIcons.expand}
                      onClick={() => toggle(name)}
                    />
                    {area ? (
                      <Grid.Area
                        {...partProps['Grid.Area']}
                        size={area}
                      />
                    ) : null}
                  </Grid.Item>
                );
              })}
            </Grid.Root>
          </div>
          <Viewport.Padding
            {...partProps['Viewport.Padding']}
            edge="block-end"
          />
        </Page.Root>
      </Viewport.Content>
    </Component>
  );
};

// Opening above the page.

const openingCode = `// The app's card: its own buttons open and close it.
const CameraCard = ({ name }) => {
  const item = useGridItem();
  return (
    <div className="device-card">
      {name}
      <Grid.CornerButton
        aria-label={name}
        icon={gridIcons.open}
        visible={!item.open}
        onClick={() => item.setOpen(true)}
      />
      <Grid.CornerButton
        aria-label="Close"
        corner="top-leading"
        icon={gridIcons.close}
        visible={item.open}
        onClick={() => item.setOpen(false)}
      />
    </div>
  );
};

<Grid.Root>
  <Grid.Item defaultSize="1x1">
    <DeviceCard name="Lamp" />
  </Grid.Item>
  {/* Open state its own (uncontrolled), told as it changes. */}
  <Grid.Item
    defaultSize="2x1"
    openLabel="Front Door Camera"
    openSize="4x3"
    onOpenChange={(open, { reason }) => console.log(open, reason)}
  >
    <CameraCard name="Front Door Camera" />
  </Grid.Item>
  <Grid.Item defaultSize="1x1">
    <DeviceCard name="Blinds" />
  </Grid.Item>
</Grid.Root>`;

/**
 * Its buttons opening its tile above the page and closing it, by its
 * item's state (`useGridItem`).
 */
const OpenButtons: FunctionComponent<{
  cornerProps?: Record<string, unknown>;
  name: string;
}> = ({ cornerProps, name }) => {
  const item = useGridItem();
  const isOpen = item?.open === true;
  return (
    <>
      <Grid.CornerButton
        {...cornerProps}
        aria-label={name}
        icon={gridIcons.open}
        visible={!isOpen}
        onClick={() => item?.setOpen(true)}
      />
      <Grid.CornerButton
        {...cornerProps}
        aria-label="Close"
        corner="top-leading"
        icon={gridIcons.close}
        visible={isOpen}
        onClick={() => item?.setOpen(false)}
      />
    </>
  );
};

/**
 * A tablet: a camera's tile opening above the page by its corner button,
 * at its open size, its own state (uncontrolled); closed by its x, a press
 * beside it, or Escape (the log says how).
 */
const Opening: FunctionComponent = () => {
  const id = 'grid-composition-opening';
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Grid.CornerButton': [
              'aria-label',
              'corner',
              'icon',
              'onClick',
              'visible',
            ],
            'Grid.Item': [
              'defaultOpen',
              'defaultSize',
              'onOpenChange',
              'open',
              'openLabel',
              'openSize',
            ],
            'Grid.Root': [],
            'Page.Root': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  const [presentationControl, presentation, presentationState] =
    usePresentation(id);

  return (
    <Component
      isExpanded
      isInline
      controls={[presentationControl, partControls]}
      id={id}
      log={log}
      stage={presentation}
      state={[partState, presentationState]}
      title="Grid"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Page.Root {...partProps['Page.Root']}>
          <Viewport.Padding
            {...partProps['Viewport.Padding']}
            edge="block-start"
          />
          <div className="grid-demo-content">
            <Grid.Root
              key={defaultsKey(...Object.values(partProps))}
              {...partProps['Grid.Root']}
              style={gridSigns(partProps['Grid.Root']?.style)}
            >
              <Grid.Item defaultSize="1x1">
                <div className="grid-demo-tile">Lamp</div>
              </Grid.Item>
              <Grid.Item
                defaultSize="2x1"
                openLabel="Front Door Camera"
                openSize="4x3"
                {...partProps['Grid.Item']}
                onOpenChange={(open, details) => {
                  addLog(`${open ? 'opened' : 'closed'} (${details.reason})`);
                  partProps['Grid.Item']?.onOpenChange?.(open, details);
                }}
              >
                <div className="grid-demo-tile">Front Door Camera</div>
                <OpenButtons
                  cornerProps={partProps['Grid.CornerButton']}
                  name="Front Door Camera"
                />
              </Grid.Item>
              <Grid.Item defaultSize="1x1">
                <div className="grid-demo-tile">Blinds</div>
              </Grid.Item>
            </Grid.Root>
          </div>
          <Viewport.Padding
            {...partProps['Viewport.Padding']}
            edge="block-end"
          />
        </Page.Root>
      </Viewport.Content>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['rooms-on-a-tablet', 'Rooms on a tablet'],
  ['holes-and-line-breaks', 'Holes and line breaks'],
  ['adding-and-removing-tiles', 'Adding and removing tiles'],
  ['room-around-a-tile', 'Room around a tile'],
  ['expanding-in-place', 'Expanding in place'],
  ['opening-above-the-page', 'Opening above the page'],
];

/** `/grid/composition`: rooms, holes and breaks, adding and removing. */
export const GridComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A grid goes in a page (a <a href={publicUrl('page')}>Page</a>, in a{' '}
        <a href={publicUrl('viewport')}>Viewport</a>’s content layer). It fills
        the page’s width and scrolls with it.
      </li>
      <li>
        What goes in its items is the app’s, usually a card. The examples use a
        plain tile with the device’s name, written as a <code>DeviceCard</code>{' '}
        in the code.
      </li>
      <li>
        The app owns the data: the tiles’ order, their sizes, and what’s added
        and removed. The grid reports changes and never keeps positions.
      </li>
    </ul>

    <Heading
      id="rooms-on-a-tablet"
      level={2}
    >
      Rooms on a tablet
    </Heading>
    <ul>
      <li>
        A home’s devices by room, each room a <PartLink part="Grid.Section" />{' '}
        with its heading in a <PartLink part="Grid.Header" />. The section is
        named by its heading (<code>aria-labelledby</code>).
      </li>
      <li>
        One reorder handle for all rooms, so devices move between them. The
        change names the room a device was dropped in, and{' '}
        <PartLink part="Grid.reorder" /> moves it in the app’s data by room.
      </li>
      <li>
        Sizes are controlled: each device’s size is stored with it. The same
        data shows 3 columns on a phone and more on a tablet.
      </li>
      <li>
        <strong>Library:</strong> sections on shared columns, moving between
        them with one handle, <PartLink part="Grid.reorder" /> for data by
        section, resizing by <PartLink part="Grid.ResizeHandle" />.
      </li>
      <li>
        <strong>Demo:</strong> the devices by room with their sizes, edit mode
        and the Edit button.
      </li>
    </ul>
    <CodeView code={roomsCode} />
    <Rooms />

    <Heading
      id="holes-and-line-breaks"
      level={2}
    >
      Holes and line breaks
    </Heading>
    <ul>
      <li>
        A tile can be dropped on any empty unit, and as many rows below the last
        one as <code>maxTileRows</code> (3). The handle (with{' '}
        <code>spacers</code> and <code>breaks</code>) then asks for a break of
        as many rows and spacers in front of it, so it lands right there and the
        rest stays put. While dragging, the stand-ins it would add show the
        offer sign.
      </li>
      <li>
        Spacers and breaks have their own remove buttons and resize handles. A
        tile that grows over a spacer takes it in, shown by the merge sign while
        the handle is held. The app removes what the change lists as{' '}
        <code>merged</code>.
      </li>
      <li>
        Edit mode works on a draft. Cleaning up waits until Done, because breaks
        at the start or end, or breaks in a row, can be steps on the way to the
        layout the user wants. On Done, breaks at the start and end are dropped,
        and breaks in a row become one.
      </li>
      <li>
        The signs are the app’s. Here they’re SF Symbols turned into mask images
        (<code>maskOf</code> draws a symbol’s paths into an SVG data URL).
      </li>
      <li>
        <strong>Library:</strong> spacers and breaks asked for by a move (
        <PartLink part="Grid.createReorderHandle" />
        ), made by <PartLink part="Grid.reorder" />, merging on resize ( the
        change’s <code>merged</code>), the signs’ custom properties.
      </li>
      <li>
        <strong>Demo:</strong> the draft and the cleanup on Done, the names of
        new spacers and breaks, the sign images.
      </li>
    </ul>
    <CodeView code={holesCode} />
    <Holes />

    <Heading
      id="adding-and-removing-tiles"
      level={2}
    >
      Adding and removing tiles
    </Heading>
    <ul>
      <li>
        An add tile (<PartLink part="Grid.Spawn" />) at the end opens a{' '}
        <a href={publicUrl('menu')}>Menu</a> of devices: it’s the menu’s trigger
        (<code>render</code>). It works in and out of edit mode.
      </li>
      <li>
        In edit mode, each tile gets a <PartLink part="Grid.RemoveButton" />{' '}
        named after it. Reset brings the tiles back as they were, sizes
        included, because the sizes are controlled.
      </li>
      <li>
        <strong>Library:</strong> the add tile and its sign, the remove buttons.
      </li>
      <li>
        <strong>Demo:</strong> the tiles, what adding makes and where it goes,
        removing, Reset.
      </li>
    </ul>
    <CodeView code={addingCode} />
    <Adding />

    <Heading
      id="room-around-a-tile"
      level={2}
    >
      Room around a tile
    </Heading>
    <ul>
      <li>
        An item’s area (a <PartLink part="Grid.Area" /> in it) is the room it
        takes in the layout. Its tile sits in the middle of it by default, truly
        centered even off the unit lines, or in one of its corners (the area’s{' '}
        <code>placement</code>). Here a small clock gets a full-width area of
        three rows: an empty row above it, one below it, and room to its sides.
      </li>
      <li>
        In edit mode, the room is hatched. Two arcs resize it: the outer one, in
        the area’s corner (a <PartLink part="Grid.ResizeHandle" /> in the area),
        resizes the area, and the inner one, on the tile, resizes the tile
        within it. Resizing the tile moves nothing else. Dragging its arc out of
        the area (for this full-width area, into the end-of-line column) steps
        it to its next size up, even where its placement keeps it at that edge.
        In edit mode, a tile in a corner sits a little in from it, so the area’s
        crosshairs and arc stay free. Shrinking the area below the tile shows
        the tile smaller too, and its stored size stays.
      </li>
      <li>
        The clock’s area is <code>movable</code>, shown by the crosshairs on it:
        in edit mode, hold it and drag it to the middle or a corner of its area.
        Where it would land is outlined in its shape. Holding the hatched room
        instead moves the whole item. With the clock focused, the arrow keys
        step it through the five places.
      </li>
      <li>
        In edit mode, the hatching sign in a tile’s bottom leading corner (
        <PartLink part="Grid.AreaButton" />) suggests an area one column wider,
        and the app renders a <PartLink part="Grid.Area" /> of that size, the
        tile centered in it. The x on the area’s own corner (a{' '}
        <PartLink part="Grid.RemoveButton" /> in the area) takes it away again:
        the app stops rendering it, and the tile keeps its size. On Done, the
        app also drops an area stored as big as its tile, since it adds nothing.
      </li>
      <li>
        On a narrower grid, the area gives way first, then the tile fits in it.
        Both are stored with the item, and an item without an area works as
        before.
      </li>
      <li>
        <strong>Library:</strong> areas (<PartLink part="Grid.Area" />: its{' '}
        <code>size</code>, <code>onSizeChange</code>), placing and moving the
        tile in them (<code>placement</code>, <code>onPlacementChange</code>,{' '}
        <code>movable</code>), hatching, controls acting on the area they’re in
        (<PartLink part="Grid.ResizeHandle" />,{' '}
        <PartLink part="Grid.RemoveButton" />
        ), the suggested area (<PartLink part="Grid.AreaButton" />
        ).
      </li>
      <li>
        <strong>Demo:</strong> the tiles with their areas, placements and sizes,
        adding and removing areas in that data, edit mode and the Edit button.
      </li>
    </ul>
    <CodeView code={roomCode} />
    <Room />

    <Heading
      id="expanding-in-place"
      level={2}
    >
      Expanding in place
    </Heading>
    <ul>
      <li>
        Expanding a tile is the app changing its size. A{' '}
        <PartLink part="Grid.CornerButton" /> asks for the other size, and the
        app keeps which tiles are expanded in its own state, apart from the
        sizes the user chose. Here that state isn’t stored, so tiles are small
        again after a reload.
      </li>
      <li>
        The button’s icon comes from the same state:{' '}
        <PartLink part="gridIcons" />
        ’s <code>expand</code> while it’s small, <code>collapse</code> while
        it’s expanded. It’s <code>mirrored</code>, since the triangle points to
        a corner, and says its state with <code>aria-expanded</code>.
      </li>
      <li>
        The tile moves and resizes to its new box, and the tiles after it
        reflow. What’s in the tile is laid out at its new size from the start;
        moving what’s in it from where it was is the app’s (see{' '}
        <PartLink part="useGridItemLayout" />
        ).
      </li>
      <li>
        The clock has room around it (a <PartLink part="Grid.Area" />
        ), so it grows from the middle of its area and nothing around it moves.
      </li>
      <li>
        <strong>Library:</strong> the tile getting to its new box, the reflow,
        the corner button and its icons.
      </li>
      <li>
        <strong>Demo:</strong> which tiles are expanded and their sizes.
      </li>
    </ul>
    <CodeView code={expandingCode} />
    <Expanding />

    <Heading
      id="opening-above-the-page"
      level={2}
    >
      Opening above the page
    </Heading>
    <ul>
      <li>
        An item opens above the page (its <code>open</code>), its tile lifted to
        the middle of the screen at its <code>openSize</code>, or as much of it
        as the screen has room for. Its place in the grid stays empty and
        nothing reflows.
      </li>
      <li>
        The tile’s own buttons open and close it, through{' '}
        <PartLink part="useGridItem" />
        ’s <code>open</code> and <code>setOpen</code>: <code>gridIcons</code>’s{' '}
        <code>open</code> while it’s closed, its x (<code>close</code>) in the
        top leading corner while it’s open. Each is hidden while the other
        shows.
      </li>
      <li>
        Open, it’s a modal dialog named by <code>openLabel</code>. A press
        beside it or Escape closes it too, and so does edit mode starting.{' '}
        <code>onOpenChange</code> says why, shown in the log.
      </li>
      <li>
        Here the open state is the item’s own (<code>defaultOpen</code>); the
        app can control it with <code>open</code> instead.
      </li>
      <li>
        <strong>Library:</strong> lifting the tile and putting it back, the
        dimmed page, focus and Escape, the reasons.
      </li>
      <li>
        <strong>Demo:</strong> the buttons and what’s logged.
      </li>
    </ul>
    <CodeView code={openingCode} />
    <Opening />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const gridCompositionDemos = [
  Rooms,
  Holes,
  Adding,
  Room,
  Expanding,
  Opening,
];
