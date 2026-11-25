import { FunctionComponent, type ReactNode } from 'react';

import {
  Card,
  cardSizes,
  type ControlCardButtonProps,
  type ControlCardLightProps,
  type ControlCardListProps,
  type ControlCardProgressProps,
  ControlCards,
  type ControlCardSegmentedProps,
  type ControlCardSliderProps,
  type ControlCardStagesProps,
  type ControlCardStateProps,
  type ControlCardSwitchProps,
  type ControlCardValueProps,
} from '../../../components/index.js';
import { cardTints } from '../../tooling/card-kit.js';
import type { PartProps } from '../../tooling/frame/prop-control.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink, sectionId } from '../../tooling/guide/sections.js';
import {
  sfDoorGarageClosed,
  sfDoorGarageOpen,
  sfWasher,
  sfWasherFill,
  sfWindowShadeClosed,
} from '../../tooling/icons.js';
import {
  type ChannelData,
  fiveChannels,
  longStages,
  type RowData,
  type SegmentedOptionData,
  type StageData,
  washerStages,
} from '../card/props.js';
import { TilePartView } from '../card/stage.js';
import {
  controlCardsButtonRows,
  controlCardsLightRows,
  controlCardsListRows,
  controlCardsProgressRows,
  controlCardsSegmentedRows,
  controlCardsSliderRows,
  controlCardsStagesRows,
  controlCardsStateRows,
  controlCardsSwitchRows,
  controlCardsValueRows,
} from './docs.js';
import {
  getPropOptionsButton,
  getPropOptionsLight,
  getPropOptionsList,
  getPropOptionsSlider,
  getPropOptionsSwitch,
  type ProgressPartData,
  propOptionsProgress,
  propOptionsSegmented,
  propOptionsStages,
  propOptionsState,
  propOptionsValue,
  type StagesPartData,
} from './props.js';

// ControlCards' parts page: each ready-made card, its Card parts composed
// in it as an app composes them (see Card's parts page for each).

const StatePart: FunctionComponent = () => (
  <TilePartView
    id="control-cards-parts-state"
    options={propOptionsState}
    part="ControlCards.State"
    tilesOf={(props) => [
      {
        card: <ControlCards.State {...(props as ControlCardStateProps)} />,
        name: 'State',
        size: '2x1',
        sizes: cardSizes.binaryDisplay,
      },
    ]}
  />
);

const SwitchPart: FunctionComponent = () => (
  <TilePartView
    id="control-cards-parts-switch"
    options={getPropOptionsSwitch}
    part="ControlCards.Switch"
    tilesOf={(props) => [
      {
        card: <ControlCards.Switch {...(props as ControlCardSwitchProps)} />,
        name: 'Switch',
        size: '2x1',
        sizes: cardSizes.binaryControl,
      },
    ]}
  />
);

const ValuePart: FunctionComponent = () => (
  <TilePartView
    id="control-cards-parts-value"
    options={propOptionsValue}
    part="ControlCards.Value"
    tilesOf={(props) => [
      {
        card: <ControlCards.Value {...(props as ControlCardValueProps)} />,
        name: 'Value',
        size: '2x2',
        sizes: cardSizes.numericalDisplay,
      },
    ]}
  />
);

const SliderPart: FunctionComponent = () => (
  <TilePartView
    id="control-cards-parts-slider"
    options={getPropOptionsSlider}
    part="ControlCards.Slider"
    others={{
      'ControlCards.Slider (others)': [
        'defaultValue',
        'format',
        'icon',
        'label',
        'max',
        'min',
        'step',
        'tint',
      ],
    }}
    tilesOf={(props, partProps) => [
      {
        card: <ControlCards.Slider {...(props as ControlCardSliderProps)} />,
        name: 'Across',
        size: '3x1',
        sizes: cardSizes.numericalControl,
      },
      {
        card: (
          <ControlCards.Slider
            {...partProps['ControlCards.Slider (others)']}
            defaultValue={0.5}
            format={{ maximumFractionDigits: 0, style: 'percent' }}
            icon={sfWindowShadeClosed}
            label="Blinds"
            max={1}
            min={0}
            step={0.25}
            tint={cardTints.shade}
          />
        ),
        name: 'Upright',
        size: '1x2',
        sizes: cardSizes.numericalControl,
      },
    ]}
  />
);

const ButtonPart: FunctionComponent = () => (
  <TilePartView
    id="control-cards-parts-button"
    options={getPropOptionsButton}
    part="ControlCards.Button"
    tilesOf={(props) => [
      {
        card: <ControlCards.Button {...(props as ControlCardButtonProps)} />,
        name: 'Button',
        size: '2x1',
        sizes: cardSizes.binaryControl,
      },
    ]}
  />
);

/**
 * A progress card's parts as its view composes them (see
 * `propOptionsProgress`'s children): each with its group's props.
 */
const progressPartsOf = (
  parts: readonly ProgressPartData[],
  partProps: PartProps,
  words: { detail?: string; label: string; subtitle: string },
): ReactNode =>
  parts.map((part) => {
    if (part === 'subtitle') {
      return (
        <Card.Subtitle
          key={part}
          {...partProps['Card.Subtitle']}
        >
          {words.subtitle}
        </Card.Subtitle>
      );
    }
    if (part === 'value') {
      return (
        <Card.ProgressValue
          key={part}
          {...partProps['Card.ProgressValue']}
        />
      );
    }
    return (
      <Card.ProgressBar
        key={part}
        {...partProps['Card.ProgressBar']}
      >
        <Card.ProgressLabel {...partProps['Card.ProgressLabel']}>
          {words.label}
        </Card.ProgressLabel>
        {words.detail === undefined ? null : (
          <Card.ProgressDetail {...partProps['Card.ProgressDetail']}>
            {words.detail}
          </Card.ProgressDetail>
        )}
      </Card.ProgressBar>
    );
  });

const ProgressPart: FunctionComponent = () => (
  <TilePartView
    id="control-cards-parts-progress"
    options={propOptionsProgress}
    part="ControlCards.Progress"
    others={{
      'Card.Progress': ['children', 'value'],
      'Card.ProgressBar': ['children'],
      'Card.ProgressDetail': ['children'],
      'Card.ProgressLabel': ['children'],
      'Card.ProgressValue': [],
      'Card.Subtitle': ['children'],
      'ControlCards.Progress (others)': [
        'active',
        'children',
        'emphasizedIcon',
        'icon',
        'label',
      ],
    }}
    tilesOf={(props, partProps) => {
      const { children: parts, ...card } = props as Omit<
        ControlCardProgressProps,
        'children'
      > & { children: readonly ProgressPartData[] };
      const others = partProps['ControlCards.Progress (others)'];
      return [
        {
          card: (
            <ControlCards.Progress {...card}>
              <Card.Progress
                {...partProps['Card.Progress']}
                value={53}
              >
                {progressPartsOf(parts, partProps, {
                  detail: '40 min left',
                  label: 'Rinsing',
                  subtitle: 'Cotton, 40°',
                })}
              </Card.Progress>
            </ControlCards.Progress>
          ),
          name: 'Wide',
          size: '2x1',
          sizes: cardSizes.progressDisplay,
        },
        {
          card: (
            <ControlCards.Progress
              {...others}
              active
              emphasizedIcon={sfWasherFill}
              icon={sfWasher}
              label="Dryer"
            >
              <Card.Progress
                {...partProps['Card.Progress']}
                value={20}
              >
                {progressPartsOf(['bar'], partProps, {
                  label: '48 min',
                  subtitle: 'Cotton',
                })}
              </Card.Progress>
            </ControlCards.Progress>
          ),
          name: 'Small',
          size: '1x1',
          sizes: cardSizes.progressDisplay,
        },
        {
          card: (
            <ControlCards.Progress
              {...others}
              active
              emphasizedIcon={sfDoorGarageOpen}
              icon={sfDoorGarageClosed}
              label="Garage Door"
            >
              <Card.Progress
                {...partProps['Card.Progress']}
                value={35}
              >
                {progressPartsOf(['subtitle', 'value', 'bar'], partProps, {
                  detail: '6 s left',
                  label: 'Opening…',
                  subtitle: 'Opened by Alex',
                })}
              </Card.Progress>
            </ControlCards.Progress>
          ),
          name: 'Large',
          size: '2x2',
          sizes: cardSizes.progressDisplay,
        },
      ];
    }}
  />
);

/** A stage list's stages, each with its group's props. */
const stagesOf = (data: readonly StageData[], partProps: PartProps) =>
  data.map(({ label, value }) => (
    <Card.Stage
      key={value}
      {...partProps['Card.Stage']}
      value={value}
    >
      {label}
    </Card.Stage>
  ));

/**
 * A stages card's parts as its views compose them (see
 * `propOptionsStages`'s children): its subtitle, its list of stages.
 */
const stagesPartsOf = (
  parts: readonly StagesPartData[],
  partProps: PartProps,
  {
    current,
    stages,
    subtitle,
  }: { current: string; stages: readonly StageData[]; subtitle: string },
): ReactNode =>
  parts.map((part) =>
    part === 'subtitle' ? (
      <Card.Subtitle
        key={part}
        {...partProps['Card.Subtitle']}
      >
        {subtitle}
      </Card.Subtitle>
    ) : (
      <Card.StageList
        key={part}
        {...partProps['Card.StageList']}
        value={current}
      >
        {stagesOf(stages, partProps)}
      </Card.StageList>
    ),
  );

const StagesPart: FunctionComponent = () => (
  <TilePartView
    id="control-cards-parts-stages"
    options={propOptionsStages}
    part="ControlCards.Stages"
    others={{
      'Card.Stage': ['children', 'value'],
      'Card.StageList': ['children', 'value'],
      'Card.Subtitle': ['children'],
      'ControlCards.Stages (others)': [
        'active',
        'children',
        'emphasizedIcon',
        'icon',
        'label',
        'tint',
      ],
    }}
    tilesOf={(props, partProps) => {
      const { children: parts, ...card } = props as Omit<
        ControlCardStagesProps,
        'children'
      > & { children: readonly StagesPartData[] };
      const others = partProps['ControlCards.Stages (others)'];
      return [
        {
          card: (
            <ControlCards.Stages {...card}>
              {stagesPartsOf(parts, partProps, {
                current: 'rinse',
                stages: washerStages,
                subtitle: 'Cotton, 40°',
              })}
            </ControlCards.Stages>
          ),
          name: 'Stages',
          size: '2x1',
          sizes: cardSizes.stagesDisplay,
        },
        {
          card: (
            <ControlCards.Stages
              {...others}
              active
              emphasizedIcon={sfWasherFill}
              icon={sfWasher}
              label="Washer Program"
              tint="var(--color-ui-system-teal)"
            >
              {stagesPartsOf(['subtitle', 'list'], partProps, {
                current: 'rinse',
                stages: longStages,
                subtitle: 'Intensive, ends at 16:05',
              })}
            </ControlCards.Stages>
          ),
          name: 'More stages',
          size: '4x1',
          sizes: cardSizes.stagesDisplay,
        },
        {
          card: (
            <ControlCards.Stages
              {...others}
              active
              emphasizedIcon={sfWasherFill}
              icon={sfWasher}
              label="Washer Program"
              tint="var(--color-ui-system-teal)"
            >
              {stagesPartsOf(['subtitle', 'list'], partProps, {
                current: 'spin',
                stages: washerStages,
                subtitle: 'Cotton, ends at 14:30',
              })}
            </ControlCards.Stages>
          ),
          name: 'Large',
          size: '2x2',
          sizes: cardSizes.stagesDisplay,
        },
      ];
    }}
  />
);

/** A light's channels as the views compose them (each its group's props). */
const channelsOf = (data: readonly ChannelData[], partProps: PartProps) =>
  data.map(({ label, ...channel }) => (
    <Card.Channel
      key={label}
      {...partProps['Card.Channel']}
      label={label}
      {...channel}
    />
  ));

const LightPart: FunctionComponent = () => (
  <TilePartView
    id="control-cards-parts-light"
    options={getPropOptionsLight}
    part="ControlCards.Light"
    others={{
      'Card.Channel': ['colors', 'defaultValue', 'label', 'tint'],
      'Card.Channels': ['children'],
      'Card.ExpandButton': ['aria-label'],
      'ControlCards.Light (others)': [
        'children',
        'defaultChecked',
        'emphasizedIcon',
        'icon',
        'label',
      ],
    }}
    tilesOf={(props, partProps) => {
      const { children: data, ...card } = props as Omit<
        ControlCardLightProps,
        'children'
      > & { children: readonly ChannelData[] };
      return [
        {
          card: (
            <ControlCards.Light {...card}>
              <Card.Channels {...partProps['Card.Channels']}>
                {channelsOf(data, partProps)}
              </Card.Channels>
              <Card.ExpandButton
                {...partProps['Card.ExpandButton']}
                aria-label="Light Strip details"
              />
            </ControlCards.Light>
          ),
          // (Its channels shown expanded: its corner button.)
          expandedSize: '2x2',
          name: 'Small',
          size: '2x1',
          sizes: ['2x1', '2x2'],
        },
        {
          card: (
            <ControlCards.Light
              {...partProps['ControlCards.Light (others)']}
              defaultChecked
              emphasizedIcon={card.emphasizedIcon}
              icon={card.icon}
              label="Floor Lamp"
            >
              <Card.Channels {...partProps['Card.Channels']}>
                {channelsOf(fiveChannels, partProps)}
              </Card.Channels>
            </ControlCards.Light>
          ),
          name: 'Large, five channels',
          size: '4x3',
          sizes: ['4x3'],
        },
      ];
    }}
  />
);

/** A list card's rows (each with its group's props). */
const rowsOf = (data: readonly RowData[], partProps: PartProps): ReactNode =>
  data.map(({ label, ...row }) => (
    <Card.Row
      key={label}
      {...partProps['Card.Row']}
      {...row}
    >
      {label}
    </Card.Row>
  ));

const ListPart: FunctionComponent = () => (
  <TilePartView
    id="control-cards-parts-list"
    options={getPropOptionsList}
    part="ControlCards.List"
    others={{
      'Card.CloseButton': ['aria-label'],
      'Card.ExpandButton': ['aria-label'],
      'Card.Row': ['children', 'icon', 'onClick', 'value'],
      'Card.Rows': ['children'],
    }}
    tilesOf={(props, partProps) => {
      const { children: data, ...card } = props as Omit<
        ControlCardListProps,
        'children'
      > & { children: readonly RowData[] };
      return [
        {
          card: (
            <ControlCards.List {...card}>
              <Card.Rows {...partProps['Card.Rows']}>
                {rowsOf(data, partProps)}
              </Card.Rows>
              {/* (No rows: its corner button expands it instead.) */}
              {data.length === 0 ? (
                <Card.ExpandButton
                  {...partProps['Card.ExpandButton']}
                  aria-label="Living Room details"
                />
              ) : null}
            </ControlCards.List>
          ),
          expandedSize: '3x3',
          name: 'Expanding',
          size: '2x2',
          sizes: cardSizes.summaryDisplay,
        },
        {
          card: (
            <ControlCards.List {...card}>
              <Card.Rows {...partProps['Card.Rows']}>
                {rowsOf(data, partProps)}
              </Card.Rows>
              <Card.CloseButton
                {...partProps['Card.CloseButton']}
                aria-label="Close"
              />
            </ControlCards.List>
          ),
          name: 'Opening',
          openSize: '4x3',
          size: '2x1',
          sizes: cardSizes.summaryDisplay,
        },
      ];
    }}
  />
);

/** A segmented card's options (each with its group's props). */
const optionsOf = (
  data: readonly SegmentedOptionData[],
  partProps: PartProps,
): ReactNode =>
  data.map(({ label, value, ...option }) => (
    <Card.SegmentedItem
      key={value}
      {...partProps['Card.SegmentedItem']}
      value={value}
      {...option}
    >
      {label}
    </Card.SegmentedItem>
  ));

const SegmentedPart: FunctionComponent = () => (
  <TilePartView
    id="control-cards-parts-segmented"
    options={propOptionsSegmented}
    part="ControlCards.Segmented"
    others={{
      'Card.CloseButton': ['aria-label'],
      'Card.OpenButton': ['aria-label'],
      'Card.Segmented': ['children'],
      'Card.SegmentedItem': [
        'children',
        'disabled',
        'icon',
        'subtitle',
        'tint',
        'value',
      ],
    }}
    tilesOf={(props, partProps) => {
      const { children: data, ...card } = props as Omit<
        ControlCardSegmentedProps,
        'children'
      > & { children: readonly SegmentedOptionData[] };
      const choice = (
        <Card.Segmented
          defaultValue={data[1]?.value}
          {...partProps['Card.Segmented']}
        >
          {optionsOf(data, partProps)}
        </Card.Segmented>
      );
      return [
        {
          card: (
            <ControlCards.Segmented {...card}>{choice}</ControlCards.Segmented>
          ),
          name: 'Across',
          size: '2x1',
          sizes: cardSizes.choiceControl,
        },
        {
          card: (
            <ControlCards.Segmented {...card}>
              {choice}
              {/* (At 1x1, its options hidden: opened above the page.) */}
              <Card.OpenButton
                {...partProps['Card.OpenButton']}
                aria-label="Modes"
              />
              <Card.CloseButton
                {...partProps['Card.CloseButton']}
                aria-label="Close"
              />
            </ControlCards.Segmented>
          ),
          name: '1x1',
          openSize: '2x2',
          size: '1x1',
          sizes: cardSizes.choiceControl,
        },
      ];
    }}
  />
);

/** A card's section: its heading, its bullets, its demo, its props. */
const Section: FunctionComponent<{
  Demo: FunctionComponent;
  bullets: readonly ReactNode[];
  part: string;
  rows: Parameters<typeof PropsTable>[0]['rows'];
}> = ({ Demo, bullets, part, rows }) => (
  <>
    {/* (Its id the part's, as `PartLink` links it.) */}
    <Heading
      id={sectionId(part)}
      level={2}
    >
      <code>{part}</code>
    </Heading>
    <ul>
      {bullets.map((bullet, index) => (
        <li key={index}>{bullet}</li>
      ))}
    </ul>
    <Demo />
    <h3>Props</h3>
    <PropsTable rows={rows} />
  </>
);

/** A Card part, linked on Card's parts page. */
const cardPart = (part: string) => (
  <PartLink
    component="card"
    part={part}
  />
);

/** `/control-cards/parts`: each ready-made card. */
export const ControlCardsParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        Each card is a ready-made {cardPart('Card.Root')} with Card’s parts,
        standing on its own: put it in a{' '}
        <PartLink
          component="grid"
          part="Grid.Item"
        />{' '}
        with the sizes its kind supports.
      </li>
      <li>
        Its label and symbol are its own props; its other props are its{' '}
        {cardPart('Card.Root')}’s. Its children are added after its parts: the
        parts it’s composed of where it has them (a progress, stages, channels,
        rows, a choice), and corner buttons.
      </li>
      <li>
        For a card of your own, compose Card’s parts directly (see{' '}
        {cardPart('Card.Root')}
        ’s parts page).
      </li>
    </ul>
    <ul className="demo-tree">
      <li className="demo-tree-context">
        <PartLink
          component="grid"
          part="Grid.Item"
        />{' '}
        <span>(its expandedSize and openSize for the corner buttons)</span>
        <ul>
          <li>
            <PartLink part="ControlCards.State" />,{' '}
            <PartLink part="ControlCards.Switch" />,{' '}
            <PartLink part="ControlCards.Value" />,{' '}
            <PartLink part="ControlCards.Slider" />,{' '}
            <PartLink part="ControlCards.Button" />
            <ul>
              <li>
                {cardPart('Card.ExpandButton')}, {cardPart('Card.OpenButton')},{' '}
                {cardPart('Card.CloseButton')} (optional)
              </li>
            </ul>
          </li>
          <li>
            <PartLink part="ControlCards.Progress" />
            <ul>
              <li>
                {cardPart('Card.Progress')}
                <ul>
                  <li>
                    {cardPart('Card.Subtitle')},{' '}
                    {cardPart('Card.ProgressValue')} (optional)
                  </li>
                  <li>
                    {cardPart('Card.ProgressBar')}
                    <ul>
                      <li>
                        {cardPart('Card.ProgressLabel')},{' '}
                        {cardPart('Card.ProgressDetail')}
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            <PartLink part="ControlCards.Stages" />
            <ul>
              <li>{cardPart('Card.Subtitle')} (optional)</li>
              <li>
                {cardPart('Card.StageList')}
                <ul>
                  <li>{cardPart('Card.Stage')} (several)</li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            <PartLink part="ControlCards.Light" />
            <ul>
              <li>
                {cardPart('Card.Channels')}
                <ul>
                  <li>{cardPart('Card.Channel')} (several)</li>
                </ul>
              </li>
              <li>{cardPart('Card.ExpandButton')} (optional)</li>
            </ul>
          </li>
          <li>
            <PartLink part="ControlCards.List" />
            <ul>
              <li>
                {cardPart('Card.Rows')}
                <ul>
                  <li>{cardPart('Card.Row')} (several)</li>
                </ul>
              </li>
              <li>
                {cardPart('Card.ExpandButton')}, {cardPart('Card.CloseButton')}{' '}
                (optional)
              </li>
            </ul>
          </li>
          <li>
            <PartLink part="ControlCards.Segmented" />
            <ul>
              <li>
                {cardPart('Card.Segmented')}
                <ul>
                  <li>{cardPart('Card.SegmentedItem')} (several)</li>
                </ul>
              </li>
              <li>
                {cardPart('Card.OpenButton')}, {cardPart('Card.CloseButton')}{' '}
                (optional)
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>

    <Section
      Demo={StatePart}
      part="ControlCards.State"
      rows={controlCardsStateRows}
      bullets={[
        'A state the app shows, for example a door open or closed. Lit while it’s active, its symbol emphasized, its value the state’s words.',
      ]}
    />
    <Section
      Demo={SwitchPart}
      part="ControlCards.Switch"
      rows={controlCardsSwitchRows}
      bullets={[
        <>
          Something switched on and off: a {cardPart('Card.Switch')} in its top
          trailing corner. A press anywhere on the card toggles it. Lit while
          it’s on.
        </>,
      ]}
    />
    <Section
      Demo={ValuePart}
      part="ControlCards.Value"
      rows={controlCardsValueRows}
      bullets={[
        <>
          A number the app shows, formatted with Intl.NumberFormat, large from
          about 180px. With a trend, a {cardPart('Card.Trend')} after it.
        </>,
      ]}
    />
    <Section
      Demo={SliderPart}
      part="ControlCards.Slider"
      rows={controlCardsSliderRows}
      bullets={[
        <>
          A level set by dragging across the whole card: a{' '}
          {cardPart('Card.Slider')} with the card’s symbol. Across in a wide
          tile, upright in a tall one.
        </>,
        'A brightness keeps its glass dark. With a switch, a click toggles it and a drag sets its level; while it’s off, its fill isn’t drawn: the card is plain off glass, with a dashed line where the fill would end (none at its minimum or maximum), and its value says Off with the level.',
        <>
          Here: to show its switch, set <code>defaultChecked</code> to{' '}
          <code>false</code> (or <code>true</code>). A switch appears whenever
          either <code>checked</code> or <code>defaultChecked</code> is given.
        </>,
      ]}
    />
    <Section
      Demo={ButtonPart}
      part="ControlCards.Button"
      rows={controlCardsButtonRows}
      bullets={[
        'Something done once, for example a doorbell rung or all lights off. A press lights it up for a moment, and it fades back; the app can flash it the same way.',
      ]}
    />
    <Section
      Demo={ProgressPart}
      part="ControlCards.Progress"
      rows={controlCardsProgressRows}
      bullets={[
        <>
          Something under way, for example a washer’s program. Its symbol and
          title are its own; the rest is composed in it, as the app shows it: a{' '}
          {cardPart('Card.Progress')} holding a {cardPart('Card.Subtitle')}, its
          value ({cardPart('Card.ProgressValue')}) and its bar (
          {cardPart('Card.ProgressBar')}).
        </>,
        'Its tint is its symbol’s and its bar’s fill. In tiles a row tall only the bar shows; taller tiles show all three, the value large. It fits every size from 1x1 up.',
      ]}
    />
    <Section
      Demo={StagesPart}
      part="ControlCards.Stages"
      rows={controlCardsStagesRows}
      bullets={[
        <>
          A run of stages in order, for example a washer’s program: shown, not
          chosen. Its symbol and title are its own; composed in it are a{' '}
          {cardPart('Card.Subtitle')} and a {cardPart('Card.StageList')} of its
          stages, its current stage the list’s value.
        </>,
        'Its tint is its symbol’s and its stages’. Wider tiles give more stages room, and in tiles taller than a row its subtitle shows under its title. Never 1x1: too narrow for them.',
      ]}
    />
    <Section
      Demo={LightPart}
      part="ControlCards.Light"
      rows={controlCardsLightRows}
      bullets={[
        <>
          A light of several channels, composed in it as a{' '}
          {cardPart('Card.Channels')} of {cardPart('Card.Channel')}s. It shows a
          switch, its symbol in the color its channels make, and its brightness.
          Large (expanded, resized or open above the page), its channels show
          too. A press on its body toggles it, at any size, but not a press on
          its channels.
        </>,
        'Its value’s words are the app’s (getValueText, states). By default it shows its brightness while on and its off word while off.',
        'While it’s small its channels stay mounted, unseen, so it still knows the light they give.',
      ]}
    />
    <Section
      Demo={ListPart}
      part="ControlCards.List"
      rows={controlCardsListRows}
      bullets={[
        <>
          A summary in rows, for example a room’s or a device’s details: its{' '}
          {cardPart('Card.Rows')} in a well at the card’s bottom, as many as fit
          whole, its status under its title.
        </>,
        <>
          When rows are left out, the last row counts them and expands the tile
          (its{' '}
          <PartLink
            component="grid"
            part="Grid.Item"
          />
          ’s expandedSize) or opens it above the page (an openSize). Here: the
          first expands, the second opens; with no rows, a{' '}
          {cardPart('Card.ExpandButton')} expands it instead.
        </>,
      ]}
    />
    <Section
      Demo={SegmentedPart}
      part="ControlCards.Segmented"
      rows={controlCardsSegmentedRows}
      bullets={[
        <>
          A device of a few modes, for example a heat pump’s Off, Heat, Cool and
          Auto: its {cardPart('Card.Segmented')} of options, laid out by its
          tile’s size. Its symbol, tint and value are the chosen option’s; it’s
          lit while the chosen option isn’t its off option.
        </>,
        <>
          At 1x1 its options are hidden: a press on it (or its{' '}
          {cardPart('Card.OpenButton')}) opens it above the page, its tile’s
          openSize given.
        </>,
      ]}
    />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const controlCardsPartsDemos = [
  StatePart,
  SwitchPart,
  ValuePart,
  SliderPart,
  ButtonPart,
  ProgressPart,
  StagesPart,
  LightPart,
  ListPart,
  SegmentedPart,
];
