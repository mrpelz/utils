import { FunctionComponent, useRef, useState } from 'react';

import {
  Button,
  Grid,
  type GridBreakRows,
  gridIcons,
  type GridPlacement,
  type GridReorderChange,
  type GridSize,
  type GridSizeChangeDetails,
  Header,
  List,
  Menu,
  Page,
  Toolbar,
  useGridItem,
  Viewport,
} from '../../components/index.js';
import { gridSigns as gridSignsOf } from '../tooling/grid-signs.js';
import { DenseSwitch, SectionHeader, Tile } from './grid-shared.js';
import {
  AdaptiveBarTitle,
  BackButton,
  DrillRow,
  Rows,
  type SinkPages,
} from './shared.js';

// Grid: a home screen of tiles on a picture. Edit in the bar starts edit
// mode: tiles can be dragged within a section and between sections that
// accept them, and resized from their corner. Spacers and breaks can be
// added, moved and removed. Expanding and Opening: tiles changing their
// box by a corner button (larger in place, larger in their area, opened
// above the page), nothing but the grid moving them.

/** A device: its name, size and supported sizes. */
type Device = {
  /** The room it takes, around its tile (none: its size). */
  area?: GridSize;
  /** A camera or a lock, which may also go into Security. */
  isSecure?: boolean;
  name: string;
  /** Where its tile sits in its area (movable there, if it has one). */
  placement?: GridPlacement;
  size: GridSize;
  supported?: readonly GridSize[];
};

type Room = 'bedroom' | 'kitchen' | 'living' | 'security';

const rooms: readonly { hint?: string; name: Room; title: string }[] = [
  {
    hint: 'Drag tiles within a room or into another one. Cameras and the back door can also go to Security. Some tiles come in more sizes than others. Now Playing spans the full width, whatever the columns; the camera is 4x2 where it fits and 3x2 on a phone.',
    name: 'living',
    title: 'Living Room',
  },
  {
    hint: 'Rooms keep tiles in order and have no breaks, so the back door can only go beside the kettle, not under it. Spacers and Breaks, further down, shows how that works. The clock is a small tile in a full-width area of three rows: in edit mode, the outer arc resizes the area, the inner one the tile. Hold the clock itself and drag it to a corner of its area or its middle; hold the hatched room to move it with its area. The hatched corner sign on a tile gives it an area too, and the x on an area takes it away again.',
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
    { area: '*x3', name: 'Clock', size: '1x1', supported: ['1x1', '2x2'] },
    { name: 'Kettle', size: '1x1', supported: ['1x1'] },
    { name: 'Fridge', size: '1x2', supported: ['1x1', '1x2'] },
    { isSecure: true, name: 'Back Door', size: '1x1', supported: ['1x1'] },
  ],
  living: [
    {
      name: 'Now Playing',
      size: '*x1',
      supported: ['2x1', '4x1', '*x1', '*x2'],
    },
    { name: 'Lights', size: '2x1' },
    { name: 'Thermostat', size: '2x2', supported: ['1x1', '2x2'] },
    { name: 'Blinds', size: '1x1' },
    { name: 'Speaker', size: '1x2', supported: ['1x1', '1x2', '2x2'] },
    {
      isSecure: true,
      name: 'Camera',
      size: '4x2',
      supported: ['2x2', '3x2', '4x2'],
    },
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
  { kind: 'item', name: 'Driveway', size: '*x1' },
  { kind: 'break', name: 'Break 2', rows: 2 },
  { kind: 'item', name: 'Mailbox' },
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
/**
 * A tile expanding by its corner button (the app's state: its size, see
 * `ChangingTiles`), hidden while editing (the grid's own controls take
 * the corners then).
 */
const ExpandButton: FunctionComponent<{
  isExpanded: boolean;
  /** Whether it's smaller expanded (its icon the other way around). */
  isShrinking?: boolean;
  label: string;
  onToggle: () => void;
}> = ({ isExpanded, isShrinking = false, label, onToggle }) => {
  const item = useGridItem();
  return (
    <Grid.CornerButton
      mirrored
      aria-expanded={isExpanded}
      aria-label={label}
      icon={isExpanded === isShrinking ? gridIcons.expand : gridIcons.collapse}
      visible={item?.editing !== true}
      onClick={onToggle}
    />
  );
};

/**
 * A tile's buttons opening it above the page and, open, closing it (as a
 * press beside it, or Escape).
 */
const OpenButtons: FunctionComponent<{ label: string }> = ({ label }) => {
  const item = useGridItem();
  const isOpen = item?.open === true;
  return (
    <>
      <Grid.CornerButton
        aria-label={label}
        icon={gridIcons.open}
        visible={!isOpen && item?.editing !== true}
        onClick={() => item?.setOpen(true)}
      />
      <Grid.CornerButton
        aria-label="Close"
        corner="top-leading"
        icon={gridIcons.close}
        visible={isOpen}
        onClick={() => item?.setOpen(false)}
      />
    </>
  );
};

/** A tile that expands: its size and its size expanded (see `ChangingTiles`). */
type Expanding = {
  /** Room around it (`Grid.Area`): its size and where it sits in it. */
  area?: readonly [size: GridSize, placement: GridPlacement];
  expanded: GridSize;
  size: GridSize;
};

const expandingTiles: readonly Expanding[] = [
  { expanded: '2x2', size: '1x1' },
  { expanded: '2x1', size: '1x1' },
  { expanded: '4x2', size: '2x1' },
  { expanded: '2x3', size: '1x2' },
  { expanded: '1x1', size: '3x2' },
];

const areaTiles: readonly Expanding[] = [
  { area: ['3x2', 'center'], expanded: '2x2', size: '1x1' },
  { area: ['4x3', 'top-leading'], expanded: '3x2', size: '1x1' },
  { area: ['4x2', 'bottom-trailing'], expanded: '3x2', size: '2x1' },
  { area: ['3x3', 'top-trailing'], expanded: '2x3', size: '1x2' },
  { area: ['3x3', 'bottom-leading'], expanded: '1x1', size: '3x2' },
  { area: ['2x2', 'center'], expanded: '2x2', size: '1x1' },
];

/** A tile that opens above the page: its size and its open size. */
const openingTiles: readonly { open: GridSize; size: GridSize }[] = [
  { open: '2x2', size: '1x1' },
  { open: '4x3', size: '2x1' },
  { open: '3x4', size: '1x2' },
  { open: '6x4', size: '2x2' },
  { open: '4x2', size: '*x1' },
];

/** A size's units (columns times rows). */
const unitsOf = (size: GridSize) =>
  size
    .split('x')
    .map(Number)
    .reduce((product, each) => product * each, 1);

/** A tile's name by its sizes (unique on the page: its buttons' names too). */
const nameOf = (
  verb: string,
  from: GridSize,
  to: GridSize,
  area?: Expanding['area'],
) => `${verb} ${from} to ${to}${area ? ` in ${area[0]}, ${area[1]}` : ''}`;

/**
 * Tiles changing their box by a corner button: expanding from and to
 * different sizes, in place (their neighbors reflowing) and in areas of
 * different sizes from each of an area's anchors (nothing around them
 * moving), and opening above the page from and to different sizes.
 */
const ChangingTiles: FunctionComponent = () => {
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set());
  const toggle = (name: string) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  const expandingTile = (
    { area, expanded: larger, size }: Expanding,
    place: number,
  ) => {
    const isShrinking = unitsOf(larger) < unitsOf(size);
    const name = nameOf(
      isShrinking ? 'Shrinks' : 'Expands',
      size,
      larger,
      area,
    );
    const isExpanded = expanded.has(name);
    return (
      <Grid.Item
        key={name}
        size={isExpanded ? larger : size}
        supportedSizes={[size, larger]}
      >
        <Tile
          label={name}
          place={place}
        />
        <ExpandButton
          isExpanded={isExpanded}
          isShrinking={isShrinking}
          label={name}
          onToggle={() => toggle(name)}
        />
        {area ? (
          <Grid.Area
            defaultPlacement={area[1]}
            defaultSize={area[0]}
          />
        ) : null}
      </Grid.Item>
    );
  };
  return (
    <>
      <Grid.Section>
        <SectionHeader
          hint="The corner button makes a tile larger in place, or smaller, and back again. The tiles after it reflow. The grid moves the tile; what's in it is laid out at the new size from the start."
          title="Expanding"
        />
        {expandingTiles.map((tile, place) => expandingTile(tile, place))}
      </Grid.Section>
      <Grid.Section>
        <SectionHeader
          hint="These tiles grow within room around them, from the area's middle or one of its corners. Nothing around them moves. Edit mode shows each area hatched."
          title="Expanding in Areas"
        />
        {areaTiles.map((tile, place) => expandingTile(tile, place))}
      </Grid.Section>
      <Grid.Section>
        <SectionHeader
          hint="The corner button opens a tile above the page at its open size, or as much of it as the screen has room for. Its place stays empty meanwhile. The x, a press beside it, or Escape closes it."
          title="Opening"
        />
        {openingTiles.map(({ open, size }, place) => {
          const name = nameOf('Opens', size, open);
          return (
            <Grid.Item
              key={name}
              defaultSize={size}
              openLabel={name}
              openSize={open}
              supportedSizes={[size]}
            >
              <Tile
                label={name}
                place={place}
              />
              <OpenButtons label={name} />
            </Grid.Item>
          );
        })}
      </Grid.Section>
    </>
  );
};

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
  const changeDevice = (name: string, change: Partial<Device>) =>
    setDevices((current) => {
      const next = { ...current };
      for (const room of Object.keys(next) as Room[]) {
        next[room] = next[room].map((device) =>
          device.name === name ? { ...device, ...change } : device,
        );
      }
      return next;
    });
  const deviceTile = (device: Device, place: number) => (
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
      <Tile
        label={device.name}
        place={place}
      />
      {device.area ? (
        <Grid.Area
          movable
          placement={device.placement}
          size={device.area}
          onSizeChange={(area) => changeDevice(device.name, { area })}
          onPlacementChange={(placement) =>
            changeDevice(device.name, { placement })
          }
        >
          <Grid.ResizeHandle />
          <Grid.RemoveButton
            aria-label={`Remove the area around ${device.name}`}
            onClick={() =>
              changeDevice(device.name, {
                area: undefined,
                placement: undefined,
              })
            }
          />
        </Grid.Area>
      ) : (
        <Grid.AreaButton
          aria-label={`Add an area around ${device.name}`}
          onAdd={(area) => changeDevice(device.name, { area })}
        />
      )}
    </Grid.Item>
  );

  // Scenes move between the section's two parts, pinned and the rest.
  const scenesHandle = Grid.useCreateReorderHandle({
    onReorder: (change) =>
      setScenes((current) => Grid.reorder(current, change, ({ name }) => name)),
  });
  const sceneTile = ({ name }: { name: string }, place: number) => (
    <Grid.Item
      key={name}
      defaultSize="2x1"
      dropName={name}
      reorderHandle={scenesHandle}
      supportedSizes={['2x1']}
    >
      <Tile
        label={name}
        place={place}
      />
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
    // (On Done, an area stored as big as its tile goes: it adds nothing.)
    if (editing) {
      setDevices((current) => {
        const next = { ...current };
        for (const room of Object.keys(next) as Room[]) {
          next[room] = next[room].map((device) =>
            device.area === device.size
              ? { ...device, area: undefined, placement: undefined }
              : device,
          );
        }
        return next;
      });
    }
    setDraft(editing ? undefined : [...saved]);
    setEditing(!editing);
  };
  const addSpacer = () => {
    const name = nameFor('Spacer');
    edit((current) => [...current, { kind: 'spacer', name }]);
  };
  // A new break dangles at the end: nothing shifts. Moved, it starts a row
  // where it's put; left there, it's tidied away on Done (see `tidy`).
  const addBreak = () => {
    const name = nameFor('Break');
    edit((current) => [...current, { kind: 'break', name }]);
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
            <AdaptiveBarTitle>
              <span>Home</span>
            </AdaptiveBarTitle>
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
                {devices[room.name].map((device, index) =>
                  deviceTile(device, index),
                )}
              </Grid.Section>
            ))}
            <ChangingTiles />
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
              {devices.security.map((device, index) =>
                deviceTile(device, index),
              )}
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
                {scenes.pinned.map((scene, index) => sceneTile(scene, index))}
              </Grid.DropGroup>
              <Grid.Break />
              <Grid.DropGroup
                dropName="more"
                reorderHandle={scenesHandle}
              >
                {/* (After the pinned ones and the break.) */}
                {scenes.more.map((scene, index) =>
                  sceneTile(scene, scenes.pinned.length + 1 + index),
                )}
              </Grid.DropGroup>
            </Grid.Section>
            <Grid.Section
              dense={dense.layout}
              reorderHandle={layoutHandle}
            >
              <SectionHeader
                hint="A spacer leaves a gap, and a break starts a new row. A taller break keeps the rows below it empty too. Drop a tile on any empty spot, even up to three rows below the last, and the breaks and spacers it needs are added. A break after the full-width tile shows beside it in edit mode; taller than the tile, it keeps the rows below empty. Tiles can't leave this section."
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
              {cells.map((cell, place) => {
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
                    <Tile
                      label={cell.name}
                      place={place}
                    />
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
              {garden.map(({ name, size }, place) => (
                <Grid.Item
                  key={name}
                  dropName={name}
                  reorderHandle={gardenHandle}
                  size={size}
                  onSizeChange={(next, details) =>
                    resizeInGarden(name, next, details)
                  }
                >
                  <Tile
                    label={name}
                    place={place}
                  />
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
                  <Tile
                    label={String(index + 1)}
                    place={index}
                  />
                </Grid.Item>
              ))}
            </Grid.Section>
            <Grid.Section>
              <SectionHeader
                hint="One tile in each size. They can't be moved or resized."
                title="Every Size"
              />
              {every.map((size, place) => (
                <Grid.Item
                  key={size}
                  defaultSize={size}
                  supportedSizes={[size]}
                >
                  <Tile
                    label={size}
                    place={place}
                  />
                </Grid.Item>
              ))}
            </Grid.Section>
          </Grid.Root>
          {/* (Every feature at once, to try and to show: its own page.) */}
          <List.Root className="kitchen-sink-grid-more">
            <Rows>
              <DrillRow
                pageKey="grid/playground"
                title="Grid Playground"
              />
            </Rows>
          </List.Root>
          <Viewport.Padding edge="block-end" />
        </Page.Root>
      </Header.Root>
    </>
  );
};

export const gridPages: SinkPages = {
  grid: { Content: GridApp, isBare: true, title: 'Grid' },
};
