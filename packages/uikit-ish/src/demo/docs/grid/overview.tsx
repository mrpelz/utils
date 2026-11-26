import { FunctionComponent, useMemo, useState } from 'react';

import {
  Button,
  Grid,
  type GridSize,
  Page,
  Stack,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePresentation } from '../../tooling/frame/presentation.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { gridSigns } from '../../tooling/grid-signs.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import { type Device, devices, deviceSizes, rooms } from './content.js';
import {
  gridBreakRows,
  gridItemRows,
  gridRootRows,
  gridSpacerRows,
} from './docs.js';
import { defaultsKey, propOptionsOverviewRoot } from './props.js';

/**
 * A phone: a home's devices by room, Edit and Done above them; in edit
 * mode, tiles moved within and between rooms and resized (their sizes the
 * app's, stored).
 */
const LiveView: FunctionComponent = () => {
  const id = 'grid-overview';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsOverviewRoot, {
    external,
    isOpen: true,
    title: 'Grid.Root',
  });
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
    usePresentation(id, true);

  return (
    <Component
      isInline
      controls={[presentationControl, control, partControls]}
      id={id}
      log={log}
      stage={presentation}
      state={[state, partState, presentationState]}
      title="Grid"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Page.Root {...partProps['Page.Root']}>
          <Viewport.Padding
            {...partProps['Viewport.Padding']}
            edge="block-start"
          />
          <Stack
            inset
            className="grid-demo-content"
          >
            <Stack
              wrap
              axis="horizontal"
              spacing="small"
            >
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
            </Stack>
            <Grid.Root
              key={defaultsKey(props, ...Object.values(partProps))}
              {...props}
              editing={editing}
              style={gridSigns()}
            >
              {rooms.map((room) => (
                <Grid.Section
                  key={room}
                  {...partProps['Grid.Section']}
                  dropName={room}
                  reorderHandle={handle}
                >
                  <Grid.Header {...partProps['Grid.Header']}>
                    <h3 className="grid-demo-heading">{room}</h3>
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
          </Stack>
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
  ['when-to-use-it', 'When to use it'],
  ['when-to-use-something-else', 'When to use something else'],
  ['key-props', 'Key props'],
  ['accessibility', 'Accessibility'],
  ['behavior', 'Behavior'],
];

/** `/grid`: what a grid is for, and its props. */
export const GridOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Tiles on square units, like a home screen or a control center. Each item
        spans any number of columns and rows, up to the grid’s columns and{' '}
        <code>maxTileRows</code> (3), or the full width (<code>*x1</code>,{' '}
        <code>*x2</code>, …).
      </li>
      <li>
        The app stores the tiles’ order and each item’s size, and nothing else.
        Where a tile lands follows from the order and the grid’s width.
      </li>
      <li>
        In edit mode, tiles are dragged to another place and resized from their
        corner. Spacers leave a hole, and breaks start a new row.
      </li>
      <li>Tap Edit, then hold a tile for a moment and drag it.</li>
    </ul>
    <LiveView />

    <Heading
      id="when-to-use-it"
      level={2}
    >
      When to use it
    </Heading>
    <ul>
      <li>
        For a dashboard of controls the user arranges themselves, such as a
        smart home’s devices or an app’s widgets.
      </li>
      <li>
        For tiles of a few sizes that should fill any width, from a phone (3
        columns) to a wide tablet, without a layout per device.
      </li>
    </ul>

    <Heading
      id="when-to-use-something-else"
      level={2}
    >
      When to use something else
    </Heading>
    <ul>
      <li>
        Rows of data, such as settings or messages: use a{' '}
        <a href={publicUrl('list')}>List</a>. It can be reordered too.
      </li>
      <li>
        Columns side by side, such as a sidebar and a detail: use a{' '}
        <a href={publicUrl('layout')}>Layout</a>.
      </li>
      <li>
        Pages of content swiped through: use a{' '}
        <a href={publicUrl('page-control')}>Page Control</a>.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most grids set, across the parts.</li>
      <li>
        All props of all parts are on the{' '}
        <a href={publicUrl('grid/parts')}>Parts</a> page.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        [
          'Grid.Root',
          pickRows(
            gridRootRows,
            'editing',
            'dense',
            'unitSize',
            'minColumns',
            'maxTileRows',
          ),
        ],
        [
          'Grid.Item',
          pickRows(
            gridItemRows,
            'size',
            'supportedSizes',
            'onSizeChange',
            'reorderHandle',
            'dropName',
          ),
        ],
        ['Grid.Spacer', pickRows(gridSpacerRows, 'size')],
        ['Grid.Break', pickRows(gridBreakRows, 'rows')],
      ]}
    />

    <Heading
      id="accessibility"
      level={2}
    >
      Accessibility
    </Heading>
    <ul>
      <li>
        Its parts have no roles of their own: it isn’t an ARIA grid, and arrow
        keys don’t move focus between tiles. A section is a <code>section</code>
        ; give it a name with <code>aria-labelledby</code> pointing at its
        heading.
      </li>
      <li>
        Tiles are read in their order. That’s the order they’re shown in, unless{' '}
        <code>dense</code> fills earlier holes with later tiles.
      </li>
      <li>
        In edit mode, every tile with a reorder handle is focusable. Alt and an
        arrow key move it: Left and Up one place earlier, Right and Down one
        place later.
      </li>
      <li>
        The edit controls are buttons: “Resize” (Enter or Space steps to the
        next size), “Remove”, “Add area” (
        <PartLink part="Grid.AreaButton" />) and, for{' '}
        <PartLink part="Grid.Spawn" />, “Add”. Give the remove and add buttons
        names that say what they act on, for example “Remove the area around
        Clock”.
      </li>
      <li>
        Spacers and breaks are hidden from assistive technology outside edit
        mode. In edit mode, taps on what’s in a tile are held back, except on
        its edit controls.
      </li>
      <li>With reduced motion, tiles move to their new places at once.</li>
    </ul>

    <Heading
      id="behavior"
      level={2}
    >
      Behavior
    </Heading>
    <ul>
      <li>
        The grid measures its own width. It gets as many columns as fit at{' '}
        <code>unitSize</code> (110px), and stretches the units to fill the
        width. A phone gets 3 columns. Units are square.
      </li>
      <li>
        Tiles are placed in order, row by row. One that doesn’t fit the rest of
        a row starts the next and leaves a hole. With <code>dense</code>, later
        tiles fill those holes. Only a tile’s first row decides where it goes.
      </li>
      <li>
        It never gets fewer columns than <code>minColumns</code> (3). Its units
        shrink instead.
      </li>
      <li>
        An item’s size snaps to its <code>supportedSizes</code>. If that’s wider
        than the columns, the widest supported size that fits is shown, so a 4x2
        card that also supports 3x2 shows as 3x2 on a phone. Each item must
        support a size that fits <code>minColumns</code>; otherwise the console
        warns. The stored size doesn’t change when the grid gets narrower.
      </li>
      <li>
        When the width changes, the columns stay while their units fit between{' '}
        <code>unitMin</code> and <code>unitMax</code>. Then they change, and the
        tiles glide to their new places in one move. What’s on screen stays
        where it was.
      </li>
      <li>
        In edit mode, a touch held for a moment picks a tile up (a quick swipe
        still scrolls). A placeholder shows where it’ll land, decided by the
        tile’s first row, not by the finger. Near the screen’s edges, the page
        scrolls along.
      </li>
      <li>
        Resizing outlines the new size while the handle is held, and changes it
        when it’s released. Growing over spacers takes them in. A tap on the
        handle steps to the next size; holding it without moving does nothing.
      </li>
      <li>
        In edit mode, a narrow column follows the last one (its width in{' '}
        <code>--uikit-grid-end-width</code>, a third of a unit by default), and
        the other columns get narrower to make room; rows keep their height.
        Breaks run into it, and a break with no room left in its row shows there
        as a narrow tile.
      </li>
      <li>
        A tile at a row’s end that supports a size one column wider can be
        resized into that column: the outline moves to where the tile will land
        in the row below, and dragging on grows it further in the same move.
        Dragged back, the outline returns to the row above once the tile fits
        there again.
      </li>
      <li>
        A full-width tile reaches into that column in the upper half of its
        first row, unlike a tile exactly as wide as the columns. A tile at a
        row’s start that supports the full width becomes full width when resized
        into it. A break after a full-width tile shows below that half, as many
        rows down as it’s tall. Only a break taller than the tile changes the
        layout: it keeps the rows below the tile empty.
      </li>
      <li>
        An item can take more room than its tile shows: a{' '}
        <PartLink part="Grid.Area" /> in it. The tile sits in its middle by
        default or in a corner (its <code>placement</code>), and the room is
        hatched in edit mode, with the area’s own controls in its corners. A{' '}
        <code>movable</code> tile shows crosshairs and can be dragged to another
        of those places. In edit mode, a tile in a corner sits 24px in from it (
        <code>--uikit-grid-corner-inset</code>), off the area’s own controls.
        Dragging the tile’s handle out of the area steps it to its next size up,
        even when its placement keeps it at that edge; dragging further grows it
        more (see{' '}
        <a href={publicUrl('grid/composition#room-around-a-tile')}>
          Room around a tile
        </a>
        ).
      </li>
      <li>
        Entering and leaving edit mode keeps what’s on screen in place, though
        spacers and breaks appear and disappear.
      </li>
      <li>
        A tile can expand in place (an item’s <code>expanded</code>, to its{' '}
        <code>expandedSize</code>) or open above the page (its <code>open</code>
        ), usually from a <PartLink part="Grid.CornerButton" /> in it. Either
        way it moves and resizes to its new box, what’s in it laid out at the
        new size from the start; <PartLink part="useGridItemLayout" /> tells
        what’s in it, to move its own parts along (see{' '}
        <a href={publicUrl('grid/composition#expanding-in-place')}>
          Expanding in place
        </a>{' '}
        and{' '}
        <a href={publicUrl('grid/composition#opening-above-the-page')}>
          Opening above the page
        </a>
        ).
      </li>
      <li>
        In edit mode, the grid draws its own corner symbols as plain lines: an x
        to remove, crosshairs on tiles that can be moved, and the resize arc.
        Inside the arc, a chevron shows where the tile can go: towards the top
        leading corner when it can only shrink, towards the bottom trailing one
        when it can only grow, both ways when it has sizes either side. A tile
        that takes any size shows the arc alone, unless it’s at the smallest or
        largest size, for example a full width with the most rows: then one way.
        Where there’s no fill under them (spacers, add tiles, the hatched room),
        they get a faint backing. The signs on offered and merging spacers and
        breaks, and on <PartLink part="Grid.Spawn" />, are the app’s: masks in{' '}
        <code>--uikit-grid-offer-sign</code>,{' '}
        <code>--uikit-grid-merge-sign</code> and{' '}
        <code>--uikit-grid-spawn-sign</code>. Without them, nothing is drawn
        (see{' '}
        <a href={publicUrl('grid/composition#holes-and-line-breaks')}>
          Composition
        </a>
        ).
      </li>
      <li>It mirrors in right-to-left languages.</li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const gridOverviewDemos = [LiveView];
