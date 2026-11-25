import {
  Fragment,
  FunctionComponent,
  ReactNode,
  useMemo,
  useState,
} from 'react';

import {
  Grid,
  type GridSize,
  Page,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { AddLog, useLog } from '../../tooling/frame/log.js';
import { usePresentation } from '../../tooling/frame/presentation.js';
import {
  type PartProps,
  type PropMap,
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { gridSigns } from '../../tooling/grid-signs.js';
import { partPropMaps } from '../part-options.js';

// The card part views' stage (Card's building blocks, ControlCards' cards):
// a phone's page of tiles on a picture, each its card, and a part's view
// on it (its featured part's control, every other part's group).

/** A tile on the stage (see `tileStage`): its card and sizes. */
export type StageTile = {
  card: ReactNode;
  /** Its size expanded in place (its item's `expandedSize`; none: none). */
  expandedSize?: GridSize;
  name: string;
  /** Its size opened above the page (none: it doesn't open). */
  openSize?: GridSize;
  size: GridSize;
  sizes: readonly GridSize[];
};

/** Which tile is open above the page (the app's state; see the stage). */
export const useStageOpen = (): readonly [
  string | undefined,
  (name: string, open: boolean) => void,
] => {
  const [opened, setOpened] = useState<string | undefined>(undefined);
  return [opened, (name, open) => setOpened(open ? name : undefined)] as const;
};

/**
 * A phone's page of cards on a picture, in a grid: each tile its card, its
 * size, its supported sizes, expanding in place (its item's own state) and
 * opening above the page where it has a size for that. Its parts' props
 * from `partProps`; its cards mounted anew as `cardKey` changes. A function
 * returning its JSX, called in the demo (not a component): the demo's code
 * shows the parts as written.
 */
export const tileStage = (
  tiles: readonly StageTile[],
  partProps: PartProps,
  [opened, setOpen]: ReturnType<typeof useStageOpen>,
  cardKey = '',
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
        className={['card-demo-page', partProps['Page.Root']?.className]
          .filter(Boolean)
          .join(' ')}
      >
        <Viewport.Padding edge="block-start" />
        <div className="card-demo-content">
          <Grid.Root
            {...partProps['Grid.Root']}
            style={gridSigns(partProps['Grid.Root']?.style)}
          >
            {tiles.map(
              ({ card, expandedSize, name, openSize, size, sizes }) => (
                <Grid.Item
                  key={name}
                  {...partProps['Grid.Item']}
                  dropName={name}
                  expandedSize={expandedSize}
                  size={size}
                  supportedSizes={sizes}
                  {...(openSize && {
                    open: opened === name,
                    openLabel: name,
                    openSize,
                  })}
                  onOpenChange={(open) => setOpen(name, open)}
                >
                  <Fragment key={cardKey}>{card}</Fragment>
                </Grid.Item>
              ),
            )}
          </Grid.Root>
        </div>
        <Viewport.Padding edge="block-end" />
      </Page.Root>
    </Viewport.Content>
  </>
);

/** The parts the stage shows (see `tileStage`), the props it sets. */
export const stageParts = {
  'Grid.Item': [
    'defaultSize',
    'dropName',
    'expandedSize',
    'onOpenChange',
    'open',
    'openLabel',
    'openSize',
    'size',
    'supportedSizes',
  ],
  'Grid.Root': [],
  'Page.Root': [],
  'Viewport.Content': [],
} as const;

/**
 * A part's view: its tiles on the stage (see `tileStage`), its featured
 * instance with its props (its control's, outlined); every other part
 * rendered (`others`: by part, the props the view sets on it; a second
 * instance of the featured one as `… (others)`) in a group of its own, the
 * stage's too. Its cards mounted anew as any control changes (a
 * `default*` prop is read as it mounts).
 */
export const TilePartView: FunctionComponent<{
  id: string;
  options: PropMap | ((addLog: AddLog) => PropMap);
  others?: Record<string, readonly string[]>;
  part: string;
  tilesOf: (
    props: PartProps[string],
    partProps: PartProps,
  ) => readonly StageTile[];
}> = ({ id, options, others, part, tilesOf }) => {
  const [log, addLog] = useLog();
  const open = useStageOpen();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(
      () => (typeof options === 'function' ? options(addLog) : options),
      [addLog, options],
    ),
    { emphasize: 'outline', external, isOpen: true, title: part },
  );
  const [partControls, partProps, partState, partsKey] = usePartControls(
    useMemo(
      () => partPropMaps({ ...stageParts, ...others }, addLog),
      [addLog, others],
    ),
    { provided: useProvidedState(id) },
  );
  const [presentationControl, presentation, presentationState] =
    usePresentation(id);

  return (
    <Component
      isInline
      controls={[presentationControl, control, partControls]}
      id={id}
      log={log}
      stage={presentation}
      state={[state, partState, presentationState]}
      title={part}
    >
      {tileStage(
        tilesOf(props, partProps),
        partProps,
        open,
        `${elementKey}-${partsKey}`,
      )}
    </Component>
  );
};
