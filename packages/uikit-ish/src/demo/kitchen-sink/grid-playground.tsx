import { FunctionComponent, useEffect, useState } from 'react';

import {
  Button,
  Grid,
  type GridBreakRows,
  type GridPlacement,
  type GridReorderChange,
  type GridReorderHandle,
  type GridSize,
  type GridSizeChangeDetails,
  Header,
  Page,
  Toolbar,
  Viewport,
} from '../../components/index.js';
import { gridSigns as gridSignsOf } from '../tooling/grid-signs.js';
import { DenseSwitch, SectionHeader, Tile } from './grid-shared.js';
import { BackButton, type SinkPages } from './shared.js';

// Grid Playground: every grid feature at once, to try and to show. Five
// places in four sections, every tile any size, with or without an area
// (any size, its tile anywhere in it), removable, movable wherever its
// handles allow; spacers and breaks added from each section's header,
// tiles from its add tile. Kept in this browser (local storage) until
// Reset.

/** A tile, a spacer or a break, in one of the places (see `Layout`). */
type Cell =
  | {
      /** Room around its tile (none: its size). */
      area?: GridSize;
      kind: 'tile';
      name: string;
      /** Where its tile sits in its area. */
      placement?: GridPlacement;
      size: GridSize;
      /** Marked: it may go into Starred too. */
      starred?: boolean;
    }
  | { kind: 'break'; name: string; rows?: GridBreakRows }
  | { kind: 'spacer'; name: string; size?: GridSize };

type Tile = Extract<Cell, { kind: 'tile' }>;

/**
 * The places, by their drop names: Open (a section), Pinned and Rest (one
 * section's two drop groups), Only Wide and Starred (sections of their
 * own handles).
 */
type Place = 'open' | 'pinned' | 'rest' | 'starred' | 'wide';

type Layout = Readonly<Record<Place, readonly Cell[]>>;

const places: readonly Place[] = ['open', 'pinned', 'rest', 'wide', 'starred'];

const tile = (
  number: number,
  size: GridSize,
  more: Partial<Omit<Tile, 'kind' | 'name' | 'size'>> = {},
): Tile => ({ kind: 'tile', name: `Tile ${String(number)}`, size, ...more });

/**
 * How it starts: every case worth trying at hand (full widths in full and
 * fixed areas, a tile in a trailing corner of one, breaks of each height
 * after a full width, spacers, a tile that can grow past its row's end).
 */
const layoutInitial: Layout = {
  open: [
    tile(1, '*x1', { area: '*x2', placement: 'center' }),
    tile(2, '2x1', { area: '*x2', placement: 'top-trailing' }),
    tile(3, '*x1', { area: '3x2', placement: 'center' }),
    tile(4, '1x1', { starred: true }),
    { kind: 'spacer', name: 'Spacer 5', size: '1x1' },
    tile(6, '2x2'),
    tile(7, '1x1'),
    tile(8, '*x1'),
    { kind: 'break', name: 'Break 9', rows: 1 },
    tile(10, '*x2'),
    { kind: 'break', name: 'Break 11', rows: 2 },
    tile(12, '*x1'),
    { kind: 'break', name: 'Break 13', rows: 3 },
    tile(14, '1x1'),
    { kind: 'spacer', name: 'Spacer 15', size: '2x1' },
    tile(16, '2x1'),
  ],
  pinned: [tile(17, '2x1'), tile(18, '1x1', { starred: true })],
  rest: [
    tile(19, '1x1'),
    tile(20, '1x2'),
    { kind: 'spacer', name: 'Spacer 21', size: '1x1' },
    tile(22, '1x1'),
  ],
  starred: [
    tile(23, '1x1', { starred: true }),
    tile(24, '2x1', { starred: true }),
  ],
  wide: [tile(25, '2x1'), tile(26, '3x1'), tile(27, '2x2', { area: '3x3' })],
};

const storageKey = 'uikit-ish-kitchen-sink-grid-playground';

/** Its layout as kept (see `storageKey`), if any and whole; else none. */
const kept = (): Layout | undefined => {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '');
    if (
      typeof value === 'object' &&
      value !== null &&
      places.every((place) => Array.isArray((value as Layout)[place]))
    ) {
      return value as Layout;
    }
  } catch {
    // (None kept, or not readable: as it starts.)
  }
  return undefined;
};

const keep = (layout: Layout | undefined) => {
  try {
    if (layout) localStorage.setItem(storageKey, JSON.stringify(layout));
    else localStorage.removeItem(storageKey);
  } catch {
    // (Not kept: this session's only.)
  }
};

/** A name's number (see `nameFor`). */
const trailingNumber = /\d+$/;

/** At least two columns wide (a full width too): it may go into Only Wide. */
const isWide = (size: GridSize) =>
  size.startsWith('*') || Number.parseInt(size, 10) >= 2;

/** Each place's hint and title (Pinned and Rest: one section's). */
const hints = {
  open: 'Anything goes here: tiles from Pinned and the Rest, Only Wide and Starred, spacers and breaks. Add a tile with the dashed tile at the end. The first tiles are full width in areas, or in trailing corners of them; breaks of each height follow full-width tiles.',
  pinned:
    'Two parts with a fixed break between them, each its own drop zone: tiles move between them, and between them and Open.',
  starred:
    'Only starred tiles (★) come in here, or leave for Open and Pinned and the Rest. New ones here are starred.',
  wide: 'Only tiles at least two columns wide come in here. A tile resized narrower here can still leave, but not come back until it’s wide again. New ones here are 2x1.',
} as const;

/** The page: a bar with Back, Reset and Edit, the sections below it. */
const GridPlayground: FunctionComponent = () => {
  const [editing, setEditing] = useState(false);
  const [layout, setLayout] = useState<Layout>(() => kept() ?? layoutInitial);
  const [gridSigns] = useState(gridSignsOf);
  const [dense, setDense] = useState<Readonly<Record<string, boolean>>>({});
  useEffect(() => keep(layout), [layout]);

  // (Numbers go on from the highest yet: new names are new, kept or not.)
  const nameFor = (kind: string) => {
    const highest = Math.max(
      0,
      ...places.flatMap((place) =>
        layout[place].map(({ name }) =>
          Number.parseInt(trailingNumber.exec(name)?.[0] ?? '0', 10),
        ),
      ),
    );
    return `${kind} ${String(highest + 1)}`;
  };
  const change = (each: (cell: Cell) => Cell | undefined) =>
    setLayout((current) => {
      const next = { ...current };
      for (const place of places) {
        next[place] = current[place].flatMap((cell) => {
          const changed = each(cell);
          return changed ? [changed] : [];
        });
      }
      return next;
    });
  const add = (place: Place, cell: Cell) =>
    setLayout((current) => ({
      ...current,
      [place]: [...current[place], cell],
    }));
  const remove = (name: string) =>
    change((cell) => (cell.name === name ? undefined : cell));
  // (Grown over spacers (a break over the breaks next to it), a cell takes
  // them in: they're removed.)
  const resized = (
    name: string,
    { merged }: GridSizeChangeDetails,
    to: (cell: Cell) => Cell,
  ) =>
    change((cell) => {
      if (merged.includes(cell.name)) return undefined;
      return cell.name === name ? to(cell) : cell;
    });
  const changeTile = (name: string, to: Partial<Tile>) =>
    change((cell) =>
      cell.name === name && cell.kind === 'tile' ? { ...cell, ...to } : cell,
    );

  // Every handle offers spacers and breaks where a drop needs them. Every
  // tile has the main one (Open, Pinned and the Rest); a wide one, Only
  // Wide's; a starred one, Starred's.
  const onReorder = (moved: GridReorderChange) =>
    setLayout((current) =>
      Grid.reorder(current, moved, ({ name }) => name, {
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
    );
  const options = { breaks: true, onReorder, spacers: true } as const;
  const mainHandle = Grid.useCreateReorderHandle(options);
  const wideHandle = Grid.useCreateReorderHandle(options);
  const starredHandle = Grid.useCreateReorderHandle(options);
  const placeHandle: Readonly<Record<Place, GridReorderHandle>> = {
    open: mainHandle,
    pinned: mainHandle,
    rest: mainHandle,
    starred: starredHandle,
    wide: wideHandle,
  };
  const handlesOf = (cell: Tile) => [
    mainHandle,
    ...(isWide(cell.size) ? [wideHandle] : []),
    ...(cell.starred ? [starredHandle] : []),
  ];

  const cellOf = (place: Place) => (cell: Cell, index: number) => {
    if (cell.kind === 'break') {
      return (
        <Grid.Break
          key={cell.name}
          className="kitchen-sink-grid-spacer"
          dropName={cell.name}
          reorderHandle={placeHandle[place]}
          rows={cell.rows}
          onRowsChange={(rows, details) =>
            resized(cell.name, details, (each) => ({ ...each, rows }))
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
          reorderHandle={placeHandle[place]}
          size={cell.size}
          onSizeChange={(size, details) =>
            resized(cell.name, details, (each) => ({ ...each, size }))
          }
        >
          <Grid.RemoveButton onClick={() => remove(cell.name)} />
          <Grid.ResizeHandle />
        </Grid.Spacer>
      );
    }
    // (Its place among what's shown: Rest's after Pinned's and the break.)
    const place_ = place === 'rest' ? layout.pinned.length + 1 + index : index;
    return (
      <Grid.Item
        key={cell.name}
        dropName={cell.name}
        reorderHandle={handlesOf(cell)}
        size={cell.size}
        onSizeChange={(size, details) =>
          resized(cell.name, details, (each) => ({ ...each, size }))
        }
      >
        <Tile
          label={cell.starred ? `★ ${cell.name}` : cell.name}
          place={place_}
        />
        <Grid.RemoveButton
          aria-label={`Remove ${cell.name}`}
          onClick={() => remove(cell.name)}
        />
        {cell.area ? (
          <Grid.Area
            movable
            placement={cell.placement}
            size={cell.area}
            onSizeChange={(area) => changeTile(cell.name, { area })}
            onPlacementChange={(placement) =>
              changeTile(cell.name, { placement })
            }
          >
            <Grid.ResizeHandle />
            <Grid.RemoveButton
              aria-label={`Remove the area around ${cell.name}`}
              onClick={() =>
                changeTile(cell.name, { area: undefined, placement: undefined })
              }
            />
          </Grid.Area>
        ) : (
          <Grid.AreaButton
            aria-label={`Add an area around ${cell.name}`}
            onAdd={(area) => changeTile(cell.name, { area })}
          />
        )}
      </Grid.Item>
    );
  };

  /** A section's header: its hint, Add Break and Add Spacer, Dense. */
  const header = (title: string, hint: string, place: Place, key: string) => (
    <SectionHeader
      hint={hint}
      title={title}
    >
      <span className="kitchen-sink-grid-header-actions">
        {editing ? (
          <>
            <Button.Root
              size="small"
              variant="bordered-prominent"
              onClick={() =>
                add(place, {
                  kind: 'break',
                  name: nameFor('Break'),
                  rows: 1,
                })
              }
            >
              <Button.Label>Add Break</Button.Label>
            </Button.Root>
            <Button.Root
              size="small"
              variant="bordered-prominent"
              onClick={() =>
                add(place, {
                  kind: 'spacer',
                  name: nameFor('Spacer'),
                  size: '1x1',
                })
              }
            >
              <Button.Label>Add Spacer</Button.Label>
            </Button.Root>
          </>
        ) : null}
        <DenseSwitch
          checked={dense[key] ?? false}
          disabled={editing}
          onCheckedChange={(checked) =>
            setDense((current) => ({ ...current, [key]: checked }))
          }
        />
      </span>
    </SectionHeader>
  );

  /** A section's add tile: a new tile at its end, at once. */
  const spawn = (place: Place, size: GridSize, starred?: boolean) => (
    <Grid.Spawn
      aria-label="Add a tile"
      size={size}
      onClick={() =>
        add(place, { kind: 'tile', name: nameFor('Tile'), size, starred })
      }
    />
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
              <span>Grid Playground</span>
            </Toolbar.Title>
            <Toolbar.Trailing>
              <Toolbar.Button
                onClick={() => {
                  keep(undefined);
                  setLayout(layoutInitial);
                }}
              >
                <Button.Label>Reset</Button.Label>
              </Toolbar.Button>
              <Toolbar.Button
                prominent={editing}
                onClick={() => {
                  // (On Done, an area stored as big as its tile goes: it
                  // adds nothing.)
                  if (editing) {
                    change((cell) =>
                      cell.kind === 'tile' && cell.area === cell.size
                        ? { ...cell, area: undefined, placement: undefined }
                        : cell,
                    );
                  }
                  setEditing(!editing);
                }}
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
            <span>Grid Playground</span>
          </Header.LargeTitle>
          <Grid.Root
            className="kitchen-sink-grid"
            editing={editing}
          >
            <Grid.Section
              dense={dense.open}
              dropName="open"
              reorderHandle={mainHandle}
            >
              {header('Open', hints.open, 'open', 'open')}
              {layout.open.map(cellOf('open'))}
              {spawn('open', '1x1')}
            </Grid.Section>
            <Grid.Section dense={dense.pinned}>
              {header('Pinned and the Rest', hints.pinned, 'rest', 'pinned')}
              <Grid.DropGroup
                dropName="pinned"
                reorderHandle={mainHandle}
              >
                {layout.pinned.map(cellOf('pinned'))}
              </Grid.DropGroup>
              <Grid.Break />
              <Grid.DropGroup
                dropName="rest"
                reorderHandle={mainHandle}
              >
                {layout.rest.map(cellOf('rest'))}
              </Grid.DropGroup>
              {spawn('rest', '1x1')}
            </Grid.Section>
            <Grid.Section
              dense={dense.wide}
              dropName="wide"
              reorderHandle={wideHandle}
            >
              {header('Only Wide', hints.wide, 'wide', 'wide')}
              {layout.wide.map(cellOf('wide'))}
              {spawn('wide', '2x1')}
            </Grid.Section>
            <Grid.Section
              dense={dense.starred}
              dropName="starred"
              reorderHandle={starredHandle}
            >
              {header('Starred', hints.starred, 'starred', 'starred')}
              {layout.starred.map(cellOf('starred'))}
              {spawn('starred', '1x1', true)}
            </Grid.Section>
          </Grid.Root>
          <Viewport.Padding edge="block-end" />
        </Page.Root>
      </Header.Root>
    </>
  );
};

export const gridPlaygroundPages: SinkPages = {
  'grid/playground': {
    Content: GridPlayground,
    isBare: true,
    title: 'Grid Playground',
  },
};
