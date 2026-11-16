import './style.css';

import { FunctionComponent, ReactNode, useMemo, useState } from 'react';

import {
  Button,
  Grid,
  type GridSize,
  Page,
  Viewport,
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
import { partPropMaps } from '../part-options.js';
import { type CardTile, cardTiles } from './content.js';
import { propOptionsRoot } from './props.js';

/**
 * A phone's page on a picture: Edit and Done, a grid of cards (`tiles`, one
 * of each kind by default; each its kind's sizes, its own size stored),
 * moved and resized in edit mode. Its parts' props from `partProps`.
 */
export const CardsStage: FunctionComponent<{
  addLog: AddLog;
  children?: ReactNode;
  partProps: PartProps;
  tiles?: readonly CardTile[];
}> = ({ addLog, children, partProps, tiles: tilesInitial = cardTiles }) => {
  const [editing, setEditing] = useState(false);
  const [tiles, setTiles] = useState(tilesInitial);
  // (Which are expanded: the app's state, not stored; none while editing.)
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set());
  const toggle = (name: string) => {
    const isExpanded = !expanded.has(name);
    addLog(`${name}: ${isExpanded ? 'expand' : 'collapse'}`);
    const next = new Set(expanded);
    if (isExpanded) next.add(name);
    else next.delete(name);
    setExpanded(next);
  };
  const handle = Grid.useCreateReorderHandle({
    onReorder: (change) => {
      addLog(`move ${String(change.items[0]?.name)}`);
      setTiles((current) => Grid.reorder(current, change, ({ name }) => name));
    },
  });
  const resize = (name: string, size: GridSize) => {
    addLog(`${name} size: ${size}`);
    setExpanded((current) => {
      const next = new Set(current);
      next.delete(name);
      return next;
    });
    setTiles((current) =>
      current.map((tile) => (tile.name === name ? { ...tile, size } : tile)),
    );
  };

  return (
    <>
      <Viewport.Background>
        <div
          aria-hidden="true"
          className="demo-picture"
        />
      </Viewport.Background>
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Page.Root
          {...partProps['Page.Root']}
          className="card-demo-page"
        >
          <Viewport.Padding edge="block-start" />
          <div className="card-demo-content">
            <div className="card-demo-actions">
              <Button.Root
                {...partProps['Button.Root']}
                variant="bordered"
                onClick={() => {
                  addLog(editing ? 'done' : 'edit');
                  // (Edited as stored: expanded ones small again.)
                  if (!editing) setExpanded(new Set());
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
              reorderHandle={handle}
              style={{ ...gridSigns(), ...partProps['Grid.Root']?.style }}
            >
              {tiles.map(
                ({
                  area,
                  Card: CardOf,
                  expandedSize,
                  name,
                  openSize,
                  size,
                  sizes,
                }) => {
                  const isExpanded = expanded.has(name);
                  // (Expanding only where that's larger than it is.)
                  const canExpand =
                    expandedSize !== undefined && expandedSize !== size;
                  return (
                    <Grid.Item
                      key={name}
                      {...partProps['Grid.Item']}
                      dropName={name}
                      openLabel={openSize ? name : undefined}
                      openSize={openSize}
                      reorderHandle={handle}
                      size={isExpanded && expandedSize ? expandedSize : size}
                      supportedSizes={sizes}
                      onSizeChange={(next) => resize(name, next)}
                      onOpenChange={(open, { reason }) =>
                        addLog(
                          `${name}: ${open ? 'open' : 'close'} (${reason})`,
                        )
                      }
                    >
                      <CardOf
                        parts={partProps}
                        expansion={
                          canExpand
                            ? { isExpanded, onToggle: () => toggle(name) }
                            : undefined
                        }
                      />
                      <Grid.ResizeHandle {...partProps['Grid.ResizeHandle']} />
                      {/* (Room around it: expanded, it grows in there.) */}
                      {area ? (
                        <Grid.Area defaultSize={area}>
                          <Grid.ResizeHandle
                            {...partProps['Grid.ResizeHandle']}
                          />
                        </Grid.Area>
                      ) : null}
                    </Grid.Item>
                  );
                },
              )}
            </Grid.Root>
            {children}
          </div>
          <Viewport.Padding edge="block-end" />
        </Page.Root>
      </Viewport.Content>
    </>
  );
};

/** The parts the stage shows (see `CardsStage`), and the props it sets. */
export const stageParts = {
  'Button.Label': [],
  'Button.Root': ['onClick', 'variant'],
  'Grid.Item': [
    'defaultSize',
    'dropName',
    'onOpenChange',
    'onSizeChange',
    'openLabel',
    'openSize',
    'reorderHandle',
    'size',
    'supportedSizes',
  ],
  'Grid.ResizeHandle': [],
  'Grid.Root': ['editing', 'reorderHandle'],
  'Page.Root': [],
  'Viewport.Content': [],
} as const;

/** A phone: one card of each kind in a grid (the root's every prop). */
export const CardDemo: FunctionComponent = () => {
  const id = 'card';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsRoot, {
    external,
    isOpen: true,
    title: 'Card.Root',
  });
  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            ...stageParts,
            'Card.Symbol': [],
            'Card.Title': [],
            'Card.Value': ['children', 'format', 'value'],
            'Card.CornerButton': ['aria-label', 'icon'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      controls={[control, partControls]}
      id={id}
      log={log}
      stage="phone"
      state={[state, partState]}
      title="Card"
    >
      <CardsStage
        addLog={addLog}
        partProps={{ ...partProps, 'Card.Root': props }}
      />
    </Component>
  );
};
