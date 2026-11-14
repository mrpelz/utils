import {
  CSSProperties,
  FunctionComponent,
  ReactNode,
  useRef,
  useState,
} from 'react';

import {
  Button,
  Grid,
  type GridBreakRows,
  type GridReorderChange,
  type GridSize,
  type GridSizeChangeDetails,
  Header,
  Menu,
  Page,
  Switch,
  type SymbolIcon,
  Toolbar,
  useGridItem,
  Viewport,
} from '../../components/index.js';
import {
  sfPlusRectangle,
  sfRectangleBadgeSparkles,
  sfXmarkRectangle,
} from '../tooling/icons.js';
import { BackButton, type SinkPages } from './shared.js';

// Grid: a home screen of tiles on a picture. Edit in the bar starts edit
// mode: tiles can be dragged within a section and between sections that
// accept them, and resized from their corner. Spacers and breaks can be
// added, moved and removed.

/**
 * A tile shows its name and size (and the size asked for, if the grid gave
 * it a different one). In edit mode its corner resizes it.
 */
const Tile: FunctionComponent<{ label: string }> = ({ label }) => {
  const item = useGridItem();
  return (
    <>
      <div className="kitchen-sink-grid-tile">
        <span>{label}</span>
        <span className="kitchen-sink-grid-tile-size">
          {item?.size}
          {item && item.size !== item.requested ? ` (${item.requested})` : ''}
        </span>
      </div>
      <Grid.ResizeHandle />
    </>
  );
};

/** A symbol as a mask image (a CSS `url()`), for the grid's signs. */
const maskOf = ({ svgPathData, viewBox }: SymbolIcon) => {
  const paths = svgPathData
    .map(
      ({ d, fillOpacity }) =>
        `<path d="${d}"${fillOpacity === undefined ? '' : ` fill-opacity="${String(fillOpacity)}"`}/>`,
    )
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${paths}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

/**
 * The grid's signs (see its CSS): spacers and breaks offered while
 * dragging, sparkling; those a resize takes in, crossed out. (Made once
 * rendered: the symbols are loaded by then.)
 */
const gridSignsOf = () =>
  ({
    '--uikit-grid-merge-sign': maskOf(sfXmarkRectangle),
    '--uikit-grid-offer-sign': maskOf(sfRectangleBadgeSparkles),
    '--uikit-grid-spawn-sign': maskOf(sfPlusRectangle),
  }) as CSSProperties;

/** A section header: its title, a sentence on what to try, its buttons. */
const SectionHeader: FunctionComponent<{
  children?: ReactNode;
  hint?: string;
  title: string;
}> = ({ children, hint, title }) => (
  <Grid.Header className="kitchen-sink-grid-header">
    <span className="kitchen-sink-grid-heading">
      <span className="kitchen-sink-grid-title">{title}</span>
      {hint ? <span className="kitchen-sink-grid-hint">{hint}</span> : null}
    </span>
    {children}
  </Grid.Header>
);

/**
 * A section's dense switch, labeled (unless its title says it). Dense
 * placement is off while editing, so the switch is too.
 */
const DenseSwitch: FunctionComponent<{
  checked: boolean;
  disabled: boolean;
  isLabeled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}> = ({ checked, disabled, isLabeled = true, onCheckedChange }) => (
  <span className="kitchen-sink-grid-dense">
    {isLabeled ? <span aria-hidden="true">Dense</span> : null}
    <Switch.Root
      aria-label="Dense"
      checked={checked}
      disabled={disabled}
      onCheckedChange={onCheckedChange}
    >
      <Switch.Thumb />
    </Switch.Root>
  </span>
);

/** A device: its name, size and supported sizes. */
type Device = {
  /** A camera or a lock, which may also go into Security. */
  isSecure?: boolean;
  name: string;
  size: GridSize;
  supported?: readonly GridSize[];
};

type Room = 'bedroom' | 'kitchen' | 'living' | 'security';

const rooms: readonly { hint?: string; name: Room; title: string }[] = [
  {
    hint: 'Drag tiles within a room or into another one. Cameras and the back door can also go to Security. Some tiles come in more sizes than others.',
    name: 'living',
    title: 'Living Room',
  },
  {
    hint: 'Rooms keep tiles in order and have no breaks, so the back door can only go beside the kettle, not under it. Spacers and Breaks, further down, shows how that works.',
    name: 'kitchen',
    title: 'Kitchen',
  },
  {
    hint: 'Nothing here yet. Drop a tile in.',
    name: 'bedroom',
    title: 'Bedroom',
  },
];

const devicesInitial: Readonly<Record<Room, readonly Device[]>> = {
  bedroom: [],
  kitchen: [
    { name: 'Kettle', size: '1x1', supported: ['1x1'] },
    { name: 'Fridge', size: '1x2', supported: ['1x1', '1x2'] },
    { isSecure: true, name: 'Back Door', size: '1x1', supported: ['1x1'] },
  ],
  living: [
    { name: 'Lights', size: '2x1' },
    { name: 'Thermostat', size: '2x2', supported: ['1x1', '2x2'] },
    { name: 'Blinds', size: '1x1' },
    { name: 'Speaker', size: '1x2', supported: ['1x1', '1x2', '2x2'] },
    { isSecure: true, name: 'Camera', size: '3x2', supported: ['2x2', '3x2'] },
  ],
  security: [
    {
      isSecure: true,
      name: 'Porch Camera',
      size: '2x2',
      supported: ['2x2', '3x2'],
    },
  ],
};

type Scenes = Readonly<Record<'more' | 'pinned', readonly { name: string }[]>>;

const scenesInitial: Scenes = {
  more: [{ name: 'Movie' }, { name: 'Dinner' }, { name: 'Away' }],
  pinned: [{ name: 'Morning' }, { name: 'Night' }],
};

/**
 * The spacers section, saved as it's shown: tiles, spacers and breaks in
 * order, each break with its rows.
 */
type Cell =
  | { kind: 'break'; name: string; rows?: GridBreakRows }
  | { kind: 'item' | 'spacer'; name: string; size?: GridSize };

const cellsInitial: readonly Cell[] = [
  { kind: 'item', name: 'Fan' },
  { kind: 'spacer', name: 'Spacer 1' },
  { kind: 'item', name: 'Heater', size: '1x2' },
  { kind: 'break', name: 'Break 1', rows: 2 },
  { kind: 'item', name: 'Garage', size: '2x1' },
  { kind: 'item', name: 'Gate' },
];

/**
 * Tidied on Done: breaks at the start or end are dropped (nothing before
 * or after them to end a row for), and breaks one after another become
 * the first of them, their rows added up (3 at most).
 */
const tidy = (cells: readonly Cell[]): Cell[] => {
  const first = cells.findIndex(({ kind }) => kind !== 'break');
  const last = cells.findLastIndex(({ kind }) => kind !== 'break');
  const tidied: Cell[] = [];
  for (const cell of first === -1 ? [] : cells.slice(first, last + 1)) {
    const previous = tidied.at(-1);
    if (cell.kind === 'break' && previous?.kind === 'break') {
      const rows = Math.min(3, (previous.rows ?? 1) + (cell.rows ?? 1));
      tidied[tidied.length - 1] = {
        ...previous,
        rows: rows as GridBreakRows,
      };
      continue;
    }
    tidied.push(cell);
  }
  return tidied;
};

/**
 * The garden's tiles: removed, added and resized; Reset brings these back
 * as they were (each with its size: controlled, so it's reset too).
 */
const gardenInitial: readonly { name: string; size: GridSize }[] = [
  { name: 'Sprinkler', size: '1x1' },
  { name: 'Mower', size: '2x1' },
  { name: 'Pool Pump', size: '1x1' },
  { name: 'Path Lights', size: '1x1' },
];

/** What the garden's spawn tile adds, picked from its menu. */
const gardenKinds = ['Sprinkler', 'Path Lights', 'Pond Pump', 'Weather'];

/** Sizes that leave gaps in order, which dense placement fills. */
const denseSizes: readonly GridSize[] = [
  '3x2',
  '3x2',
  '2x1',
  '1x1',
  '2x2',
  '3x1',
  '1x1',
  '2x1',
  '1x1',
];

const every: readonly GridSize[] = [
  '1x1',
  '2x1',
  '3x1',
  '1x2',
  '2x2',
  '3x2',
  '1x3',
  '2x3',
  '3x3',
];

/** The page: a bar with Back and Edit, and the sections below it. */
const GridApp: FunctionComponent = () => {
  const [editing, setEditing] = useState(false);
  const [devices, setDevices] = useState(devicesInitial);
  const [scenes, setScenes] = useState(scenesInitial);
  const [saved, setSaved] = useState(cellsInitial);
  const [gridSigns] = useState(gridSignsOf);
  const [draft, setDraft] = useState<Cell[]>();
  // New spacers and breaks are numbered in the order they're added.
  const added = useRef(1);
  const nameFor = (kind: string) => {
    added.current += 1;
    return `${kind} ${String(added.current)}`;
  };
  // The garden's tiles: removed by their x, added by the spawn tile at the
  // end (before it, so it stays last), reset to how they started.
  const [garden, setGarden] = useState(gardenInitial);
  const gardenHandle = Grid.useCreateReorderHandle({
    onReorder: (change) =>
      setGarden((current) => Grid.reorder(current, change, ({ name }) => name)),
  });
  const addToGarden = (kind: string) => {
    const name = nameFor(kind);
    setGarden((current) => [...current, { name, size: '1x1' }]);
  };
  const resizeInGarden = (
    name: string,
    size: GridSize,
    { merged }: GridSizeChangeDetails,
  ) =>
    setGarden((current) =>
      current
        .filter((tile) => !merged.includes(tile.name))
        .map((tile) => (tile.name === name ? { ...tile, size } : tile)),
    );
  // Each editable section has its own dense switch; only Dense starts on.
  const [dense, setDense] = useState<Record<string, boolean>>({
    dense: true,
  });
  const denseSwitch = (key: string, isLabeled?: boolean) => (
    <DenseSwitch
      checked={dense[key] ?? false}
      disabled={editing}
      isLabeled={isLabeled}
      onCheckedChange={(checked) =>
        setDense((current) => ({ ...current, [key]: checked }))
      }
    />
  );
  const section = useRef<HTMLElement>(null);
  const cells = draft ?? saved;

  // Every room shares one handle. Cameras and locks have a second one that
  // Security accepts. All devices live in one record, keyed by room.
  const moveDevice = (change: GridReorderChange) =>
    setDevices((current) => Grid.reorder(current, change, ({ name }) => name));
  const roomsHandle = Grid.useCreateReorderHandle({ onReorder: moveDevice });
  const securityHandle = Grid.useCreateReorderHandle({
    onReorder: moveDevice,
  });
  const resizeDevice = (name: string, size: GridSize) =>
    setDevices((current) => {
      const next = { ...current };
      for (const room of Object.keys(next) as Room[]) {
        next[room] = next[room].map((device) =>
          device.name === name ? { ...device, size } : device,
        );
      }
      return next;
    });
  const deviceTile = (device: Device) => (
    <Grid.Item
      key={device.name}
      dropName={device.name}
      size={device.size}
      supportedSizes={device.supported}
      reorderHandle={
        device.isSecure ? [roomsHandle, securityHandle] : roomsHandle
      }
      onSizeChange={(size) => resizeDevice(device.name, size)}
    >
      <Tile label={device.name} />
    </Grid.Item>
  );

  // Scenes move between the section's two parts, pinned and the rest.
  const scenesHandle = Grid.useCreateReorderHandle({
    onReorder: (change) =>
      setScenes((current) => Grid.reorder(current, change, ({ name }) => name)),
  });
  const sceneTile = ({ name }: { name: string }) => (
    <Grid.Item
      key={name}
      defaultSize="2x1"
      dropName={name}
      reorderHandle={scenesHandle}
      supportedSizes={['2x1']}
    >
      <Tile label={name} />
    </Grid.Item>
  );

  // The spacers section is edited as a draft and saved on Done. A tile
  // dropped where it only lands with a break or spacers gets them, and a
  // break it's dropped into gets shorter, so everything else stays put.
  const edit = (change: (current: Cell[]) => Cell[]) =>
    setDraft((current) => (current ? change(current) : current));
  const layoutHandle = Grid.useCreateReorderHandle({
    breaks: true,
    onReorder: (change) =>
      edit((current) => [
        ...Grid.reorder(current, change, ({ name }) => name, {
          breakOf: (rows): Cell => ({
            kind: 'break',
            name: nameFor('Break'),
            rows,
          }),
          spacerOf: (size): Cell => ({
            kind: 'spacer',
            name: nameFor('Spacer'),
            size,
          }),
          withRows: (cell, rows) =>
            cell.kind === 'break' ? { ...cell, rows } : cell,
        }),
      ]),
    spacers: true,
  });
  const toggleEditing = () => {
    if (draft) setSaved(tidy(draft));
    setDraft(editing ? undefined : [...saved]);
    setEditing(!editing);
  };
  const addSpacer = () => {
    const name = nameFor('Spacer');
    edit((current) => [...current, { kind: 'spacer', name }]);
  };
  // A new break goes where it first makes a difference: after the first
  // cell with room left in its row. Otherwise it goes at the end.
  const addBreak = () => {
    const shown = Array.from(
      section.current?.querySelectorAll<HTMLElement>('[data-grid-name]') ?? [],
    );
    const width = section.current?.clientWidth ?? 0;
    const at = shown.findIndex(
      (element, index) =>
        element.dataset.gridPart !== 'break' &&
        shown[index + 1]?.dataset.gridPart !== 'break' &&
        element.offsetLeft + element.offsetWidth < width - 1,
    );
    const name = nameFor('Break');
    edit((current) => {
      const next = [...current];
      next.splice(at === -1 ? next.length : at + 1, 0, { kind: 'break', name });
      return next;
    });
  };
  const remove = (name: string) =>
    edit((current) => current.filter((cell) => cell.name !== name));
  // Grown over spacers (a break over the breaks next to it), a cell takes
  // them in: they're removed.
  const resize = (
    name: string,
    size: GridSize,
    { merged }: GridSizeChangeDetails,
  ) =>
    edit((current) =>
      current
        .filter((cell) => !merged.includes(cell.name))
        .map((cell) =>
          cell.name === name && cell.kind !== 'break'
            ? { ...cell, size }
            : cell,
        ),
    );
  const resizeBreak = (
    name: string,
    rows: GridBreakRows,
    { merged }: GridSizeChangeDetails,
  ) =>
    edit((current) =>
      current
        .filter((cell) => !merged.includes(cell.name))
        .map((cell) =>
          cell.name === name && cell.kind === 'break'
            ? { ...cell, rows }
            : cell,
        ),
    );

  return (
    <>
      <Viewport.Background>
        <div
          aria-hidden="true"
          className="demo-picture"
        />
      </Viewport.Background>
      <Header.Root>
        <Viewport.BlockStart>
          <Toolbar.Root placement="block-start">
            <Toolbar.Leading>
              <BackButton />
            </Toolbar.Leading>
            <Toolbar.Title>
              <span>Home</span>
            </Toolbar.Title>
            <Toolbar.Trailing>
              <Toolbar.Button
                prominent={editing}
                onClick={toggleEditing}
              >
                <Button.Label>{editing ? 'Done' : 'Edit'}</Button.Label>
              </Toolbar.Button>
            </Toolbar.Trailing>
          </Toolbar.Root>
        </Viewport.BlockStart>
        <Page.Root
          className="kitchen-sink-grid-page"
          style={gridSigns}
        >
          <Viewport.Padding edge="block-start" />
          <Header.LargeTitle>
            <span>Home</span>
          </Header.LargeTitle>
          <Grid.Root
            className="kitchen-sink-grid"
            editing={editing}
          >
            {rooms.map((room) => (
              <Grid.Section
                key={room.name}
                dense={dense[room.name]}
                dropName={room.name}
                reorderHandle={roomsHandle}
              >
                <SectionHeader
                  hint={room.hint}
                  title={room.title}
                >
                  {denseSwitch(room.name)}
                </SectionHeader>
                {devices[room.name].map((device) => deviceTile(device))}
              </Grid.Section>
            ))}
            <Grid.Section
              dense={dense.security}
              dropName="security"
              reorderHandle={securityHandle}
            >
              <SectionHeader
                hint="Only cameras and locks can go here. Other tiles won't drop in."
                title="Security"
              >
                {denseSwitch('security')}
              </SectionHeader>
              {devices.security.map((device) => deviceTile(device))}
            </Grid.Section>
            <Grid.Section dense={dense.scenes}>
              <SectionHeader
                hint="Pinned scenes come first, then a fixed break, then the rest. Drag scenes between the two parts. They stay in this section and keep their size."
                title="Scenes"
              >
                {denseSwitch('scenes')}
              </SectionHeader>
              <Grid.DropGroup
                dropName="pinned"
                reorderHandle={scenesHandle}
              >
                {scenes.pinned.map((scene) => sceneTile(scene))}
              </Grid.DropGroup>
              <Grid.Break />
              <Grid.DropGroup
                dropName="more"
                reorderHandle={scenesHandle}
              >
                {scenes.more.map((scene) => sceneTile(scene))}
              </Grid.DropGroup>
            </Grid.Section>
            <Grid.Section
              ref={section}
              dense={dense.layout}
              reorderHandle={layoutHandle}
            >
              <SectionHeader
                hint="A spacer leaves a gap, and a break starts a new row. A taller break keeps the rows below it empty too. Drop a tile at the start of a row, or in the empty row at the end, and a break is added to keep it there. Tiles can't leave this section."
                title="Spacers and Breaks"
              >
                <span className="kitchen-sink-grid-header-actions">
                  {editing ? (
                    <>
                      <Button.Root
                        size="small"
                        variant="bordered-prominent"
                        onClick={addBreak}
                      >
                        <Button.Label>Add Break</Button.Label>
                      </Button.Root>
                      <Button.Root
                        size="small"
                        variant="bordered-prominent"
                        onClick={addSpacer}
                      >
                        <Button.Label>Add Spacer</Button.Label>
                      </Button.Root>
                    </>
                  ) : null}
                  {denseSwitch('layout')}
                </span>
              </SectionHeader>
              {cells.map((cell) => {
                if (cell.kind === 'break') {
                  return (
                    <Grid.Break
                      key={cell.name}
                      className="kitchen-sink-grid-spacer"
                      dropName={cell.name}
                      reorderHandle={layoutHandle}
                      rows={cell.rows}
                      onRowsChange={(rows, details) =>
                        resizeBreak(cell.name, rows, details)
                      }
                    >
                      <Grid.RemoveButton onClick={() => remove(cell.name)} />
                      <Grid.ResizeHandle />
                    </Grid.Break>
                  );
                }
                if (cell.kind === 'spacer') {
                  return (
                    <Grid.Spacer
                      key={cell.name}
                      className="kitchen-sink-grid-spacer"
                      dropName={cell.name}
                      reorderHandle={layoutHandle}
                      size={cell.size}
                      onSizeChange={(size, details) =>
                        resize(cell.name, size, details)
                      }
                    >
                      <Grid.RemoveButton onClick={() => remove(cell.name)} />
                      <Grid.ResizeHandle />
                    </Grid.Spacer>
                  );
                }
                return (
                  <Grid.Item
                    key={cell.name}
                    dropName={cell.name}
                    reorderHandle={layoutHandle}
                    size={cell.size}
                    onSizeChange={(size, details) =>
                      resize(cell.name, size, details)
                    }
                  >
                    <Tile label={cell.name} />
                  </Grid.Item>
                );
              })}
            </Grid.Section>
            <Grid.Section
              dense={dense.garden}
              reorderHandle={gardenHandle}
            >
              <SectionHeader
                hint="Remove tiles with their x in edit mode, and add new ones from the dashed tile at the end. Reset puts back the tiles it started with."
                title="Garden"
              >
                <span className="kitchen-sink-grid-header-actions">
                  <Button.Root
                    size="small"
                    variant="bordered-prominent"
                    onClick={() => setGarden(gardenInitial)}
                  >
                    <Button.Label>Reset</Button.Label>
                  </Button.Root>
                  {denseSwitch('garden')}
                </span>
              </SectionHeader>
              {garden.map(({ name, size }) => (
                <Grid.Item
                  key={name}
                  dropName={name}
                  reorderHandle={gardenHandle}
                  size={size}
                  onSizeChange={(next, details) =>
                    resizeInGarden(name, next, details)
                  }
                >
                  <Tile label={name} />
                  <Grid.RemoveButton
                    onClick={() =>
                      setGarden((current) =>
                        current.filter((tile) => tile.name !== name),
                      )
                    }
                  />
                </Grid.Item>
              ))}
              <Menu.Root>
                <Menu.Trigger
                  render={<Grid.Spawn aria-label="Add a device" />}
                />
                <Menu.Portal>
                  <Menu.Positioner>
                    <Menu.Popup>
                      {gardenKinds.map((kind) => (
                        <Menu.Item
                          key={kind}
                          onClick={() => addToGarden(kind)}
                        >
                          <Menu.Label>{kind}</Menu.Label>
                        </Menu.Item>
                      ))}
                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Portal>
              </Menu.Root>
            </Grid.Section>
            <Grid.Section dense={dense.dense}>
              <SectionHeader
                hint="When it's on, later tiles fill the gaps earlier ones leave. It's always off in edit mode. You can resize these tiles but not move them."
                title="Dense"
              >
                {denseSwitch('dense', false)}
              </SectionHeader>
              {denseSizes.map((size, index) => (
                <Grid.Item
                  key={index}
                  defaultSize={size}
                >
                  <Tile label={String(index + 1)} />
                </Grid.Item>
              ))}
            </Grid.Section>
            <Grid.Section>
              <SectionHeader
                hint="One tile in each size. They can't be moved or resized."
                title="Every Size"
              />
              {every.map((size) => (
                <Grid.Item
                  key={size}
                  defaultSize={size}
                  supportedSizes={[size]}
                >
                  <Tile label={size} />
                </Grid.Item>
              ))}
            </Grid.Section>
          </Grid.Root>
          <Viewport.Padding edge="block-end" />
        </Page.Root>
      </Header.Root>
    </>
  );
};

export const gridPages: SinkPages = {
  grid: { Content: GridApp, isBare: true, title: 'Grid' },
};
