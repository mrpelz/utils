import {
  CSSProperties,
  FunctionComponent,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Button,
  Grid,
  type GridBreakRows,
  type GridSize,
  type GridSizeChangeDetails,
  Menu,
  Page,
  type SymbolIcon,
  Viewport,
} from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePartControls } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import {
  sfPlusRectangle,
  sfRectangleBadgeSparkles,
  sfXmarkRectangle,
} from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import {
  type Device,
  deviceKinds,
  devices,
  deviceSizes,
  rooms,
} from './content.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */

/** A symbol as a mask image (a CSS `url()`), for the grid's signs. */
const maskOf = ({ svgPathData, viewBox }: SymbolIcon) => {
  const paths = svgPathData.map(({ d }) => `<path d="${d}"/>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${paths}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

/** The grid's signs: offered, merging, adding (see the overview). */
const signs = {
  '--uikit-grid-merge-sign': maskOf(sfXmarkRectangle),
  '--uikit-grid-offer-sign': maskOf(sfRectangleBadgeSparkles),
  '--uikit-grid-spawn-sign': maskOf(sfPlusRectangle),
} as CSSProperties;

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

  return (
    <Component
      isExpanded
      isInline
      controls={[partControls]}
      id={id}
      log={log}
      stage="tablet"
      state={[partState]}
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
              {...partProps['Grid.Root']}
              editing={editing}
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
            'Grid.Break': ['dropName', 'onRowsChange', 'reorderHandle', 'rows'],
            'Grid.Item': ['dropName', 'onSizeChange', 'reorderHandle', 'size'],
            'Grid.RemoveButton': ['onClick'],
            'Grid.ResizeHandle': [],
            'Grid.Root': ['editing', 'reorderHandle', 'style'],
            'Grid.Spacer': [
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

  return (
    <Component
      isInline
      controls={[partControls]}
      id={id}
      log={log}
      stage="phone"
      state={[partState]}
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
              {...partProps['Grid.Root']}
              editing={draft !== undefined}
              reorderHandle={handle}
              style={signs}
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
            'Grid.Item': ['dropName', 'onSizeChange', 'size'],
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

  return (
    <Component
      isInline
      controls={[partControls]}
      id={id}
      log={log}
      stage="phone"
      state={[partState]}
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
              {...partProps['Grid.Root']}
              editing={editing}
              style={signs}
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

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['rooms-on-a-tablet', 'Rooms on a tablet'],
  ['holes-and-line-breaks', 'Holes and line breaks'],
  ['adding-and-removing-tiles', 'Adding and removing tiles'],
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
        A tile can be dropped on any empty unit. The handle (with{' '}
        <code>spacers</code> and <code>breaks</code>) then asks for spacers in
        front of it, or a break, so it lands right there and the rest stays put.
        While dragging, the stand-ins it would add show the offer sign.
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
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const gridCompositionDemos = [Rooms, Holes, Adding];
