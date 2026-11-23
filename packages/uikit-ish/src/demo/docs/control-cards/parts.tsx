import { FunctionComponent, type ReactNode, useMemo } from 'react';

import {
  Card,
  cardSizes,
  type ControlCardButtonProps,
  type ControlCardChannelsProps,
  type ControlCardExpandButtonProps,
  type ControlCardLightProps,
  type ControlCardListProps,
  type ControlCardOpenButtonsProps,
  type ControlCardProgressProps,
  ControlCards,
  type ControlCardSegmentedProps,
  type ControlCardSliderFillProps,
  type ControlCardSliderProps,
  type ControlCardStateProps,
  type ControlCardSwitchProps,
  type ControlCardTrendProps,
  type ControlCardValueProps,
  Symbol,
} from '../../../components/index.js';
import { cardTints } from '../../tooling/card-kit.js';
import { Component } from '../../tooling/frame/component.js';
import { AddLog, useLog } from '../../tooling/frame/log.js';
import { usePresentation } from '../../tooling/frame/presentation.js';
import {
  type PartProps,
  PropMap,
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink, sectionId } from '../../tooling/guide/sections.js';
import {
  sfDoorGarageClosed,
  sfDoorGarageOpen,
  sfLightStrip2,
  sfLightStrip2Fill,
  sfSpeakerFill,
  sfThermometerMedium,
  sfWindowShadeClosed,
} from '../../tooling/icons.js';
import { partPropMaps } from '../part-options.js';
import {
  controlCardsButtonRows,
  controlCardsChannelsRows,
  controlCardsExpandButtonRows,
  controlCardsLightRows,
  controlCardsListRows,
  controlCardsOpenButtonsRows,
  controlCardsProgressRows,
  controlCardsSegmentedRows,
  controlCardsSliderFillRows,
  controlCardsSliderRows,
  controlCardsStateRows,
  controlCardsSwitchRows,
  controlCardsTrendRows,
  controlCardsValueRows,
} from './docs.js';
import {
  controlCardsStage,
  stageParts,
  type StageTile,
  useStageOpen,
} from './main.js';
import {
  getPropOptionsButton,
  getPropOptionsChannels,
  getPropOptionsExpandButton,
  getPropOptionsLight,
  getPropOptionsList,
  getPropOptionsSegmented,
  getPropOptionsSlider,
  getPropOptionsSliderFill,
  getPropOptionsSwitch,
  propOptionsOpenButtons,
  propOptionsProgress,
  propOptionsState,
  propOptionsTrend,
  propOptionsValue,
} from './props.js';

/** The parts a card of the views' own renders (see the views below). */
const ownCardParts = {
  'Card.Root': [],
  'Card.Symbol': [],
  'Card.Title': [],
  'Card.Value': ['children'],
  Symbol: ['icon'],
} as const;

/**
 * A part's view: its tiles on the stage (see `controlCardsStage`), its
 * featured instance with its props (its control's, outlined); every other
 * part rendered (`others`: by part, the props the view sets on it; a
 * second instance of the featured one as `… (others)`) in a group of its
 * own, the stage's too.
 */
const PartView: FunctionComponent<{
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
  const [control, props, state] = usePropControl(
    useMemo(
      () => (typeof options === 'function' ? options(addLog) : options),
      [addLog, options],
    ),
    { emphasize: 'outline', external, isOpen: true, title: part },
  );
  const [partControls, partProps, partState] = usePartControls(
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
      {controlCardsStage(tilesOf(props, partProps), partProps, open)}
    </Component>
  );
};

const StatePart: FunctionComponent = () => (
  <PartView
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
  <PartView
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
  <PartView
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

/** The slider view's second slider (upright): what it sets. */
const sliderOthers = {
  'ControlCards.Slider (others)': [
    'defaultValue',
    'format',
    'icon',
    'max',
    'min',
    'name',
    'step',
    'tint',
  ],
} as const;

const SliderPart: FunctionComponent = () => (
  <PartView
    id="control-cards-parts-slider"
    options={getPropOptionsSlider}
    others={sliderOthers}
    part="ControlCards.Slider"
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
            max={1}
            min={0}
            name="Blinds"
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

const SliderFillPart: FunctionComponent = () => (
  <PartView
    id="control-cards-parts-slider-fill"
    options={getPropOptionsSliderFill}
    others={ownCardParts}
    part="ControlCards.SliderFill"
    tilesOf={(props, partProps) => [
      {
        card: (
          <Card.Root {...partProps['Card.Root']}>
            <Card.Symbol {...partProps['Card.Symbol']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfThermometerMedium}
              />
            </Card.Symbol>
            <ControlCards.SliderFill
              {...(props as ControlCardSliderFillProps)}
            />
          </Card.Root>
        ),
        name: 'Heating',
        size: '2x2',
        sizes: cardSizes.numericalControl,
      },
    ]}
  />
);

const ButtonPart: FunctionComponent = () => (
  <PartView
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

/** The progress view's second card (large): what it sets. */
const progressOthers = {
  'ControlCards.Progress (others)': [
    'active',
    'emphasizedIcon',
    'icon',
    'name',
    'status',
    'value',
  ],
} as const;

const ProgressPart: FunctionComponent = () => (
  <PartView
    id="control-cards-parts-progress"
    options={propOptionsProgress}
    others={progressOthers}
    part="ControlCards.Progress"
    tilesOf={(props, partProps) => [
      {
        card: (
          <ControlCards.Progress {...(props as ControlCardProgressProps)} />
        ),
        name: 'Wide',
        size: '2x1',
        sizes: cardSizes.numericalDisplay,
      },
      {
        card: (
          <ControlCards.Progress
            {...partProps['ControlCards.Progress (others)']}
            active
            emphasizedIcon={sfDoorGarageOpen}
            icon={sfDoorGarageClosed}
            name="Garage Door"
            status="Opening…"
            value={35}
          />
        ),
        name: 'Large',
        size: '2x2',
        sizes: cardSizes.numericalDisplay,
      },
    ]}
  />
);

/** The light view's second card (large): what it sets. */
const lightOthers = {
  'ControlCards.Light (others)': [
    'channels',
    'defaultValue',
    'emphasizedIcon',
    'icon',
    'name',
  ],
} as const;

const LightPart: FunctionComponent = () => (
  <PartView
    id="control-cards-parts-light"
    options={getPropOptionsLight}
    others={lightOthers}
    part="ControlCards.Light"
    tilesOf={(props, partProps) => [
      {
        card: <ControlCards.Light {...(props as ControlCardLightProps)} />,
        name: 'Small',
        size: '2x1',
        sizes: cardSizes.binaryControl,
      },
      {
        card: (
          <ControlCards.Light
            {...partProps['ControlCards.Light (others)']}
            defaultValue={[1, 0.6, 0.2]}
            emphasizedIcon={sfLightStrip2Fill}
            icon={sfLightStrip2}
            name="Light Strip"
            channels={[
              { label: 'R', name: 'Red', tint: '#ff3b30' },
              { label: 'G', name: 'Green', tint: '#34c759' },
              { label: 'B', name: 'Blue', tint: '#0a84ff' },
            ]}
          />
        ),
        name: 'Large',
        size: '2x2',
        sizes: ['2x2'],
      },
    ]}
  />
);

const ListPart: FunctionComponent = () => (
  <PartView
    id="control-cards-parts-list"
    options={getPropOptionsList}
    part="ControlCards.List"
    tilesOf={(props) => {
      // (Its size by its expansion's `expanded`: the app's, here the
      // controls'; opened above the page, larger.)
      const { expansion } = props as ControlCardListProps;
      return [
        {
          card: <ControlCards.List {...(props as ControlCardListProps)} />,
          name: 'List',
          openSize: '4x3',
          size: expansion?.expanded ? expansion.expandedSize : '2x2',
          sizes: ['2x2', '2x3', '3x3'],
        },
      ];
    }}
  />
);

const SegmentedPart: FunctionComponent = () => (
  <PartView
    id="control-cards-parts-segmented"
    options={getPropOptionsSegmented}
    part="ControlCards.Segmented"
    tilesOf={(props) => [
      {
        card: (
          <ControlCards.Segmented {...(props as ControlCardSegmentedProps)} />
        ),
        name: 'Segmented',
        openSize: '2x1',
        size: '2x1',
        sizes: ['1x1', '2x1', '1x2', '2x2'],
      },
    ]}
  />
);

/** The bars' view: its cards' parts, the second bars' (across) too. */
const channelsOthers = {
  ...ownCardParts,
  'ControlCards.Channels (others)': ['channels', 'value'],
} as const;

const ChannelsPart: FunctionComponent = () => (
  <PartView
    id="control-cards-parts-channels"
    options={getPropOptionsChannels}
    others={channelsOthers}
    part="ControlCards.Channels"
    tilesOf={(props, partProps) => [
      {
        card: (
          <Card.Root {...partProps['Card.Root']}>
            <Card.Symbol {...partProps['Card.Symbol']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfLightStrip2Fill}
              />
            </Card.Symbol>
            <ControlCards.Channels {...(props as ControlCardChannelsProps)} />
            <Card.Title {...partProps['Card.Title']}>Light Strip</Card.Title>
          </Card.Root>
        ),
        name: 'Upright',
        size: '2x2',
        sizes: ['2x2'],
      },
      {
        card: (
          <Card.Root {...partProps['Card.Root']}>
            <ControlCards.Channels
              {...partProps['ControlCards.Channels (others)']}
              value={[0.2, 0.8, 0.5]}
              channels={[
                { label: 'R', name: 'Red', tint: '#ff3b30' },
                { label: 'G', name: 'Green', tint: '#34c759' },
                { label: 'B', name: 'Blue', tint: '#0a84ff' },
              ]}
            />
            <Card.Title {...partProps['Card.Title']}>Light Strip</Card.Title>
          </Card.Root>
        ),
        name: 'Across',
        size: '3x1',
        sizes: ['3x1'],
      },
    ]}
  />
);

const TrendPart: FunctionComponent = () => (
  <PartView
    id="control-cards-parts-trend"
    options={propOptionsTrend}
    others={ownCardParts}
    part="ControlCards.Trend"
    tilesOf={(props, partProps) => [
      {
        card: (
          <Card.Root {...partProps['Card.Root']}>
            <Card.Symbol {...partProps['Card.Symbol']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfThermometerMedium}
              />
            </Card.Symbol>
            <Card.Title {...partProps['Card.Title']}>Outside</Card.Title>
            <Card.Value {...partProps['Card.Value']}>
              12.4 °C
              <ControlCards.Trend {...(props as ControlCardTrendProps)} />
            </Card.Value>
          </Card.Root>
        ),
        name: 'Outside',
        size: '2x1',
        sizes: cardSizes.numericalDisplay,
      },
    ]}
  />
);

const ExpandButtonPart: FunctionComponent = () => (
  <PartView
    id="control-cards-parts-expand-button"
    options={getPropOptionsExpandButton}
    others={ownCardParts}
    part="ControlCards.ExpandButton"
    tilesOf={(props, partProps) => {
      // (Its card's size by `expanded`: the app's, here the controls'.)
      const { collapsedSize, expanded, expandedSize } =
        props as ControlCardExpandButtonProps;
      return [
        {
          card: (
            <Card.Root {...partProps['Card.Root']}>
              <Card.Symbol {...partProps['Card.Symbol']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfThermometerMedium}
                />
              </Card.Symbol>
              <Card.Title {...partProps['Card.Title']}>Heating</Card.Title>
              <Card.Value {...partProps['Card.Value']}>21.5 °C</Card.Value>
              <ControlCards.ExpandButton
                {...(props as ControlCardExpandButtonProps)}
              />
            </Card.Root>
          ),
          name: 'Heating',
          size: expanded ? expandedSize : collapsedSize,
          // (A three wide too, to fit (or not) the columns.)
          sizes: [...cardSizes.numericalDisplay, '3x2'],
        },
      ];
    }}
  />
);

const OpenButtonsPart: FunctionComponent = () => (
  <PartView
    id="control-cards-parts-open-buttons"
    options={propOptionsOpenButtons}
    others={ownCardParts}
    part="ControlCards.OpenButtons"
    tilesOf={(props, partProps) => [
      {
        card: (
          <Card.Root {...partProps['Card.Root']}>
            <Card.Symbol {...partProps['Card.Symbol']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfSpeakerFill}
              />
            </Card.Symbol>
            <Card.Title {...partProps['Card.Title']}>
              Kitchen Speaker
            </Card.Title>
            <Card.Value {...partProps['Card.Value']}>Paused</Card.Value>
            <ControlCards.OpenButtons
              {...(props as ControlCardOpenButtonsProps)}
            />
          </Card.Root>
        ),
        name: 'Speaker',
        openSize: '4x3',
        size: '2x1',
        sizes: cardSizes.binaryControl,
      },
    ]}
  />
);

/** A part's section: its heading, its bullets, its demo, its props. */
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

/** `/control-cards/parts`: each ready-made card, and what they're built of. */
export const ControlCardsParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        Each card is a ready-made{' '}
        <PartLink
          component="card"
          part="Card.Root"
        />{' '}
        with its parts, standing on its own: put it in a{' '}
        <PartLink
          component="grid"
          part="Grid.Item"
        />{' '}
        with the sizes its kind supports.
      </li>
      <li>
        Its other props are its{' '}
        <PartLink
          component="card"
          part="Card.Root"
        />
        ’s, and its children are added after its parts.
      </li>
      <li>
        The other parts are what the cards are built of, for cards of your own.
      </li>
    </ul>
    <ul className="demo-tree">
      <li className="demo-tree-context">
        <PartLink
          component="grid"
          part="Grid.Item"
        />
        <ul>
          <li>
            <PartLink part="ControlCards.State" />,{' '}
            <PartLink part="ControlCards.Switch" />,{' '}
            <PartLink part="ControlCards.Value" />,{' '}
            <PartLink part="ControlCards.Slider" />,{' '}
            <PartLink part="ControlCards.Button" />,{' '}
            <PartLink part="ControlCards.Progress" />,{' '}
            <PartLink part="ControlCards.Light" />
            <ul>
              <li>
                <PartLink part="ControlCards.ExpandButton" /> or{' '}
                <PartLink part="ControlCards.OpenButtons" /> (optional)
              </li>
            </ul>
          </li>
          <li>
            <PartLink part="ControlCards.Segmented" /> (its own corner buttons,
            through its opening prop)
          </li>
          <li>
            <PartLink part="ControlCards.List" /> (its own corner buttons,
            through its opening and expansion props)
          </li>
          <li>
            <span>or your own</span>{' '}
            <PartLink
              component="card"
              part="Card.Root"
            />
            <ul>
              <li>
                <PartLink part="ControlCards.SliderFill" /> or{' '}
                <PartLink part="ControlCards.Channels" />
              </li>
              <li>
                <PartLink
                  component="card"
                  part="Card.Value"
                />
                <ul>
                  <li>
                    <PartLink part="ControlCards.Trend" />
                  </li>
                </ul>
              </li>
              <li>
                <PartLink part="ControlCards.ExpandButton" /> or{' '}
                <PartLink part="ControlCards.OpenButtons" /> (optional)
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
        'Something switched on and off: a switch in its top trailing corner. A press anywhere on the card toggles it. Lit while it’s on.',
      ]}
    />
    <Section
      Demo={ValuePart}
      part="ControlCards.Value"
      rows={controlCardsValueRows}
      bullets={[
        'A number the app shows, formatted with Intl.NumberFormat, large from about 180px. With a trend, an arrow after it.',
      ]}
    />
    <Section
      Demo={SliderPart}
      part="ControlCards.Slider"
      rows={controlCardsSliderRows}
      bullets={[
        <>
          A level set by dragging across the whole card: a{' '}
          <PartLink part="ControlCards.SliderFill" /> with the card’s symbol.
          Across in a wide tile, upright in a tall one.
        </>,
        'Its fill is its tint, opaque. Its label, value and ticks, and the card’s symbol and corner buttons, are drawn twice: on the card, and inside the fill in the text color for the fill’s tone, the ticks there as faint hairlines. Any tint reads.',
        'A brightness keeps its glass dark. With a switch, a click toggles it and a drag sets its level; while it’s off, its fill isn’t drawn: the card is plain off glass, with a dashed line where the fill would end (none at its minimum or maximum), and its value says Off with the level.',
        <>
          Here: to show its switch, set <code>defaultChecked</code> to{' '}
          <code>false</code> (or <code>true</code>). A switch appears whenever
          either <code>checked</code> or <code>defaultChecked</code> is given.
        </>,
      ]}
    />
    <Section
      Demo={SliderFillPart}
      part="ControlCards.SliderFill"
      rows={controlCardsSliderFillRows}
      bullets={[
        <>
          The slider of a <PartLink part="ControlCards.Slider" />, for a card of
          your own: put it among a{' '}
          <PartLink
            component="card"
            part="Card.Root"
          />
          ’s parts, for example only while the card is expanded.
        </>,
        <>
          It registers its fill with the card, so the card’s{' '}
          <PartLink
            component="card"
            part="Card.Symbol"
          />{' '}
          and{' '}
          <PartLink
            component="card"
            part="Card.CornerButton"
          />
          s draw their copies inside it.
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
        'Something under way, for example a washer’s program: a progress bar between its top and its title while there’s a value, beside its title in a wide card one row tall.',
      ]}
    />
    <Section
      Demo={LightPart}
      part="ControlCards.Light"
      rows={controlCardsLightRows}
      bullets={[
        <>
          A light of several channels. Small, a switch, its symbol in the color
          they make, its brightness; a press on it toggles it. Large (expanded,
          resized or open above the page), a bar per channel (
          <PartLink part="ControlCards.Channels" />
          ).
        </>,
      ]}
    />
    <Section
      Demo={ListPart}
      part="ControlCards.List"
      rows={controlCardsListRows}
      bullets={[
        'A summary in rows, for example a room’s or a device’s details, in a well at the card’s bottom: as many rows as fit whole. Their symbols sit under the card’s symbol, their labels where its title starts.',
        'When rows are left out, the last row counts them and expands the card or opens it above the page, showing the corner symbol for that. Expanded, the last row makes it small again. An invisible corner button over that row does the same, so a touch near the corner has a large target. Open, an × in its top trailing corner closes it, clear of its symbol.',
      ]}
    />
    <Section
      Demo={SegmentedPart}
      part="ControlCards.Segmented"
      rows={controlCardsSegmentedRows}
      bullets={[
        'A device of a few modes, for example a heat pump’s Off, Heat, Cool and Auto: its options as segments in a well at its bottom, the chosen one raised. Built on Base UI’s RadioGroup, so the arrow keys move between them.',
        'Its tile’s size sets its layout. Across a row, its symbol and title sit on the top line and the segments show their labels. Taller, its title and value sit as on any card, and each segment shows its symbol over its label. One wide and taller, the options stack. At 1x1 it only shows the chosen option and opens above the page to choose.',
        'It’s lit while the chosen option isn’t its off option, and its symbol and tint are the chosen option’s.',
      ]}
    />
    <Section
      Demo={ChannelsPart}
      part="ControlCards.Channels"
      rows={controlCardsChannelsRows}
      bullets={[
        'Bars between a card’s top and its title, one slider each, 0 to 1: side by side in a tile taller than a row, stacked across in a row.',
        'Upright, each bar’s short name sits on it. Stacked across, the bars are too thin for that, so the names sit beside them at their leading end, in one column, and the bars start together.',
      ]}
    />
    <Section
      Demo={TrendPart}
      part="ControlCards.Trend"
      rows={controlCardsTrendRows}
      bullets={[
        'An arrow after a value, turned by how steeply it changes, named rising, falling or steady.',
      ]}
    />
    <Section
      Demo={ExpandButtonPart}
      part="ControlCards.ExpandButton"
      rows={controlCardsExpandButtonRows}
      bullets={[
        <>
          A{' '}
          <PartLink
            component="card"
            part="Card.CornerButton"
          />{' '}
          expanding its card in place and making it small again: its icon by its
          state, mirrored in a right-to-left layout. The expanded size is the
          app’s.
        </>,
        <>
          It hides while expanding would change nothing: both its sizes come out
          the same in its{' '}
          <PartLink
            component="grid"
            part="Grid.Item"
          />{' '}
          as the grid is now. Its icon shows which way the card goes, so an
          expanded size smaller than the collapsed one shrinks it. To see it
          hide, set the{' '}
          <PartLink
            component="grid"
            part="Grid.Root"
          />{' '}
          unitSize to 180 for two columns, collapsedSize to 2x2 and expandedSize
          to 3x2.
        </>,
      ]}
    />
    <Section
      Demo={OpenButtonsPart}
      part="ControlCards.OpenButtons"
      rows={controlCardsOpenButtonsRows}
      bullets={[
        <>
          Two{' '}
          <PartLink
            component="card"
            part="Card.CornerButton"
          />
          s: one opening its card above the page, one closing it, each shown as
          it applies. They read and set its{' '}
          <PartLink
            component="grid"
            part="Grid.Item"
          />
          ’s <code>open</code>.
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
  SliderFillPart,
  ButtonPart,
  ProgressPart,
  LightPart,
  ListPart,
  SegmentedPart,
  ChannelsPart,
  TrendPart,
  ExpandButtonPart,
  OpenButtonsPart,
];
