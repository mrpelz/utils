import './style.css';

import { FunctionComponent, ReactNode, useMemo, useState } from 'react';

import {
  Button,
  Grid,
  type GridReorderHandle,
  type GridSize,
  Page,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { AddLog, useLog } from '../../tooling/frame/log.js';
import { usePresentation } from '../../tooling/frame/presentation.js';
import {
  type PartProps,
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { codeLabel } from '../../tooling/frame/render-code.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { gridSigns } from '../../tooling/grid-signs.js';
import { partPropMaps } from '../part-options.js';
import {
  type CardContext,
  cardOf,
  type CardStates,
  cardStatesInitial,
  type CardTile,
  cardTiles,
  partsOfTiles,
} from './content.js';
import { propOptionsRoot } from './props.js';

/**
 * A phone's page of cards (see `cardsStage`): its tiles (one of each kind
 * by default; each its kind's sizes, its own size stored), edit mode, the
 * expanded ones (the app's state, not stored; its items make them small
 * again as editing starts), the opened one, the cards' own state. The
 * demo's, as an app keeps it.
 */
export type CardsStageState = {
  editing: boolean;
  expanded: ReadonlySet<string>;
  handle: GridReorderHandle;
  opened: string | undefined;
  /** A tile resized in edit mode. */
  resize: (name: string, size: GridSize) => void;
  /** Sets a card's state (see `CardContext`). */
  set: CardContext['set'];
  /** Expands a tile, or makes it small again (its item's change). */
  setExpanded: (name: string, expanded: boolean, reason?: string) => void;
  /** Opens a tile above the page, or closes it. */
  setOpen: (name: string, open: boolean, reason?: string) => void;
  states: CardStates;
  tiles: readonly CardTile[];
  /** Edit and Done. */
  toggleEditing: () => void;
};

export const useCardsStage = (
  addLog: AddLog,
  tilesInitial: readonly CardTile[] = cardTiles,
): CardsStageState => {
  const [editing, setEditing] = useState(false);
  const [tiles, setTiles] = useState(tilesInitial);
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set());
  const [opened, setOpened] = useState<string | undefined>(undefined);
  const [states, setStates] = useState(cardStatesInitial);
  const handle = Grid.useCreateReorderHandle({
    onReorder: (change) => {
      addLog(`move ${String(change.items[0]?.name)}`);
      setTiles((current) => Grid.reorder(current, change, ({ name }) => name));
    },
  });
  // (Shown by name in the code, as an app defines it.)
  codeLabel(
    handle,
    'handle',
    `const handle = Grid.useCreateReorderHandle({
  onReorder: (change) =>
    setTiles((current) => Grid.reorder(current, change, ({ name }) => name)),
});`,
  );

  return {
    editing,
    expanded,
    handle,
    opened,
    set: (key, value) => {
      addLog(`${key}: ${String(value)}`);
      setStates((current) => ({ ...current, [key]: value }));
    },
    setExpanded: (name: string, isExpanded: boolean, reason?: string) => {
      addLog(
        `${name}: ${isExpanded ? 'expand' : 'collapse'}${reason ? ` (${reason})` : ''}`,
      );
      setExpanded((current) => {
        const next = new Set(current);
        if (isExpanded) next.add(name);
        else next.delete(name);
        return next;
      });
    },
    setOpen: (name: string, open: boolean, reason?: string) => {
      addLog(
        `${name}: ${open ? 'open' : 'close'}${reason ? ` (${reason})` : ''}`,
      );
      setOpened(open ? name : undefined);
    },
    resize: (name: string, size: GridSize) => {
      addLog(`${name} size: ${size}`);
      setTiles((current) =>
        current.map((tile) => (tile.name === name ? { ...tile, size } : tile)),
      );
    },
    states,
    tiles,
    toggleEditing: () => {
      addLog(editing ? 'done' : 'edit');
      setEditing(!editing);
    },
  };
};

/**
 * A phone's page on a picture: Edit and Done, a grid of cards, moved and
 * resized in edit mode (see `useCardsStage`). Its parts' props from
 * `partProps`. A function returning its JSX, called in the demo (not a
 * component): the demo's code shows the parts as written.
 */
export const cardsStage = (
  stage: CardsStageState,
  partProps: PartProps,
  /** A tile's card's parts' props, if not `partProps` (by its name). */
  partsOf: (name: string) => PartProps = () => partProps,
): ReactNode => (
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
        // (With its control's class, if any.)
        className={['card-demo-page', partProps['Page.Root']?.className]
          .filter(Boolean)
          .join(' ')}
      >
        <Viewport.Padding edge="block-start" />
        <div className="card-demo-content">
          <div className="card-demo-actions">
            <Button.Root
              {...partProps['Button.Root']}
              variant="bordered"
              onClick={stage.toggleEditing}
            >
              <Button.Label {...partProps['Button.Label']}>
                {stage.editing ? 'Done' : 'Edit'}
              </Button.Label>
            </Button.Root>
          </div>
          <Grid.Root
            {...partProps['Grid.Root']}
            editing={stage.editing}
            reorderHandle={stage.handle}
            style={gridSigns(partProps['Grid.Root']?.style)}
          >
            {stage.tiles.map(
              ({ area, expandedSize, kind, name, openSize, size, sizes }) => {
                // (Expanding: the app's state, its item's expanded size;
                // its card's button shown only where that changes its
                // size, at these columns too, see `Card.ExpandButton`.)
                const isExpanded = stage.expanded.has(name);
                const shown = isExpanded && expandedSize ? expandedSize : size;
                const isOpen = stage.opened === name;
                return (
                  <Grid.Item
                    key={name}
                    {...partProps['Grid.Item']}
                    dropName={name}
                    // (Opening only where it has a size for that: the
                    // others' as their controls set them.)
                    {...(openSize && {
                      open: isOpen,
                      openLabel: name,
                      openSize,
                    })}
                    expanded={expandedSize ? isExpanded : undefined}
                    expandedSize={expandedSize}
                    reorderHandle={stage.handle}
                    size={size}
                    supportedSizes={sizes}
                    onSizeChange={(next) => stage.resize(name, next)}
                    onExpandedChange={(next, { reason }) =>
                      stage.setExpanded(name, next, reason)
                    }
                    onOpenChange={(open, { reason }) =>
                      stage.setOpen(name, open, reason)
                    }
                  >
                    {cardOf(kind, {
                      canExpand: expandedSize !== undefined,
                      isOpen,
                      parts: partsOf(name),
                      set: stage.set,
                      size: shown,
                      states: stage.states,
                    })}
                    <Grid.ResizeHandle {...partProps['Grid.ResizeHandle']} />
                    {/* (Room around it: expanded, it grows in there.) */}
                    {area ? (
                      <Grid.Area
                        {...partProps['Grid.Area']}
                        defaultSize={area}
                      >
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
        </div>
        <Viewport.Padding edge="block-end" />
      </Page.Root>
    </Viewport.Content>
  </>
);

/** The parts the stage shows (see `cardsStage`), and the props it sets. */
export const stageParts = {
  'Button.Label': [],
  'Button.Root': ['onClick', 'variant'],
  'Grid.Item': [
    'defaultOpen',
    'defaultSize',
    'dropName',
    'expanded',
    'expandedSize',
    'onExpandedChange',
    'onOpenChange',
    'onSizeChange',
    'open',
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

/** Parts' groups but the root's (featured, its own control). */
const withoutRoot = ({
  'Card.Root': _root,
  ...others
}: Record<string, readonly string[]>) => others;

/** A phone: one card of each kind in a grid (the root's every prop). */
export const CardDemo: FunctionComponent = () => {
  const id = 'card';
  const [log, addLog] = useLog();
  const stage = useCardsStage(addLog);
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
          // (Every part its cards render; its root's its own control.)
          { ...stageParts, ...withoutRoot(partsOfTiles(cardTiles)) },
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
      controls={[presentationControl, control, partControls]}
      id={id}
      log={log}
      stage={presentation}
      state={[state, partState, presentationState]}
      title="Card"
    >
      {cardsStage(stage, { ...partProps, 'Card.Root': props })}
    </Component>
  );
};
