import { FunctionComponent, type ReactNode, useMemo } from 'react';

import {
  Card,
  cardSizes,
  type ControlCardButtonProps,
  type ControlCardChannelProps,
  type ControlCardChannelsProps,
  type ControlCardExpandButtonProps,
  type ControlCardLightProps,
  type ControlCardListProps,
  type ControlCardOpenButtonsProps,
  type ControlCardProgressProps,
  ControlCards,
  type ControlCardSegmentedItemProps,
  type ControlCardSegmentedProps,
  type ControlCardSliderFillProps,
  type ControlCardSliderProps,
  type ControlCardStageListProps,
  type ControlCardStageProps,
  type ControlCardStagesProps,
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
  sfLampFloorFill,
  sfLightbulbFill,
  sfLightStrip2,
  sfLightStrip2Fill,
  sfPower,
  sfSnowflake,
  sfSpeakerFill,
  sfThermometerMedium,
  sfWasher,
  sfWasherFill,
  sfWindowShadeClosed,
} from '../../tooling/icons.js';
import { partPropMaps } from '../part-options.js';
import {
  controlCardsButtonRows,
  controlCardsChannelRows,
  controlCardsChannelsRows,
  controlCardsExpandButtonRows,
  controlCardsLightRows,
  controlCardsListRows,
  controlCardsOpenButtonsRows,
  controlCardsProgressBarRows,
  controlCardsProgressDetailRows,
  controlCardsProgressLabelRows,
  controlCardsProgressRows,
  controlCardsProgressValueRows,
  controlCardsSegmentedItemRows,
  controlCardsSegmentedRows,
  controlCardsSliderFillRows,
  controlCardsSliderRows,
  controlCardsStageListRows,
  controlCardsStageRows,
  controlCardsStagesRows,
  controlCardsStateRows,
  controlCardsSubtitleRows,
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
  type ChannelData,
  fiveChannels,
  getPropOptionsButton,
  getPropOptionsChannel,
  getPropOptionsExpandButton,
  getPropOptionsLight,
  getPropOptionsList,
  getPropOptionsSegmented,
  getPropOptionsSlider,
  getPropOptionsSliderFill,
  getPropOptionsSwitch,
  kelvinColors,
  longStages,
  type ProgressPartData,
  propOptionsChannels,
  propOptionsOpenButtons,
  propOptionsProgress,
  propOptionsProgressBar,
  propOptionsProgressDetail,
  propOptionsProgressLabel,
  propOptionsProgressValue,
  propOptionsSegmentedItem,
  propOptionsStage,
  propOptionsStageList,
  propOptionsStages,
  propOptionsState,
  propOptionsSubtitle,
  propOptionsTrend,
  propOptionsValue,
  type SegmentedOptionData,
  type StageData,
  type StagesPartData,
  washerStages,
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
                box="square"
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

/**
 * A part's children: its control's (a featured part's), else the view's
 * own words.
 */
const childrenOr = (
  props: PartProps[string] | undefined,
  words: ReactNode,
): ReactNode => (props?.children as ReactNode | undefined) ?? words;

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
        <ControlCards.Subtitle
          key={part}
          {...partProps['ControlCards.Subtitle']}
        >
          {childrenOr(partProps['ControlCards.Subtitle'], words.subtitle)}
        </ControlCards.Subtitle>
      );
    }
    if (part === 'value') {
      return (
        <ControlCards.ProgressValue
          key={part}
          {...partProps['ControlCards.ProgressValue']}
        />
      );
    }
    return (
      <ControlCards.ProgressBar
        key={part}
        {...partProps['ControlCards.ProgressBar']}
      >
        <ControlCards.ProgressLabel
          {...partProps['ControlCards.ProgressLabel']}
        >
          {childrenOr(partProps['ControlCards.ProgressLabel'], words.label)}
        </ControlCards.ProgressLabel>
        {words.detail === undefined ? null : (
          <ControlCards.ProgressDetail
            {...partProps['ControlCards.ProgressDetail']}
          >
            {childrenOr(partProps['ControlCards.ProgressDetail'], words.detail)}
          </ControlCards.ProgressDetail>
        )}
      </ControlCards.ProgressBar>
    );
  });

/** A progress card's parts the views set (their words). */
const progressPartsOthers = {
  'ControlCards.ProgressBar': [],
  'ControlCards.ProgressDetail': ['children'],
  'ControlCards.ProgressLabel': ['children'],
  'ControlCards.ProgressValue': [],
  'ControlCards.Subtitle': ['children'],
} as const;

/** The progress view's other cards (small, large): what they set. */
const progressOthers = {
  ...progressPartsOthers,
  'ControlCards.Progress (others)': [
    'active',
    'children',
    'emphasizedIcon',
    'icon',
    'name',
    'value',
  ],
} as const;

const ProgressPart: FunctionComponent = () => (
  <PartView
    id="control-cards-parts-progress"
    options={propOptionsProgress}
    others={progressOthers}
    part="ControlCards.Progress"
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
              {progressPartsOf(parts, partProps, {
                detail: '40 min left',
                label: 'Rinsing',
                subtitle: 'Cotton, 40°',
              })}
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
              name="Dryer"
              value={20}
            >
              {progressPartsOf(['bar'], partProps, {
                label: '48 min',
                subtitle: 'Cotton',
              })}
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
              name="Garage Door"
              value={35}
            >
              {progressPartsOf(['subtitle', 'value', 'bar'], partProps, {
                detail: '6 s left',
                label: 'Opening…',
                subtitle: 'Opened by Alex',
              })}
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

/**
 * A progress part's view's other parts (see `ProgressComposedPart`): the
 * card's, the other parts' (not the featured one: its control's). Each
 * kept as it is (a view's memo's input).
 */
const progressComposedOthers = Object.fromEntries(
  (
    [
      'ControlCards.ProgressBar',
      'ControlCards.ProgressDetail',
      'ControlCards.ProgressLabel',
      'ControlCards.ProgressValue',
      'ControlCards.Subtitle',
    ] as const
  ).map((featured) => [
    featured,
    {
      ...Object.fromEntries(
        Object.entries(progressPartsOthers).filter(
          ([part]) => part !== featured,
        ),
      ),
      'ControlCards.Progress': [
        'active',
        'children',
        'emphasizedIcon',
        'icon',
        'name',
        'value',
      ],
    },
  ]),
) as Record<string, Record<string, readonly string[]>>;

/**
 * A progress part's view (see below): a washer's card, its parts
 * composed, the featured one's props its control's (outlined).
 */
const ProgressComposedPart: FunctionComponent<{
  id: string;
  options: PropMap;
  part:
    | 'ControlCards.ProgressBar'
    | 'ControlCards.ProgressDetail'
    | 'ControlCards.ProgressLabel'
    | 'ControlCards.ProgressValue'
    | 'ControlCards.Subtitle';
}> = ({ id, options, part }) => (
  <PartView
    id={id}
    options={options}
    others={progressComposedOthers[part]}
    part={part}
    tilesOf={(props, partProps) => {
      // (The featured part's props its own control's, the others' their
      // groups'.)
      const composed = { ...partProps, [part]: props };
      return [
        {
          card: (
            <ControlCards.Progress
              {...partProps['ControlCards.Progress']}
              active
              emphasizedIcon={sfWasherFill}
              icon={sfWasher}
              name="Washer"
              value={53}
            >
              {progressPartsOf(['subtitle', 'value', 'bar'], composed, {
                detail: '40 min left',
                label: 'Rinsing',
                subtitle: 'Cotton, 40°',
              })}
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

const ProgressBarPart: FunctionComponent = () => (
  <ProgressComposedPart
    id="control-cards-parts-progress-bar"
    options={propOptionsProgressBar}
    part="ControlCards.ProgressBar"
  />
);

const ProgressLabelPart: FunctionComponent = () => (
  <ProgressComposedPart
    id="control-cards-parts-progress-label"
    options={propOptionsProgressLabel}
    part="ControlCards.ProgressLabel"
  />
);

const ProgressDetailPart: FunctionComponent = () => (
  <ProgressComposedPart
    id="control-cards-parts-progress-detail"
    options={propOptionsProgressDetail}
    part="ControlCards.ProgressDetail"
  />
);

const ProgressValuePart: FunctionComponent = () => (
  <ProgressComposedPart
    id="control-cards-parts-progress-value"
    options={propOptionsProgressValue}
    part="ControlCards.ProgressValue"
  />
);

const SubtitlePart: FunctionComponent = () => (
  <ProgressComposedPart
    id="control-cards-parts-subtitle"
    options={propOptionsSubtitle}
    part="ControlCards.Subtitle"
  />
);

/** A stage list's stages, each with its group's props (see below). */
const stagesOf = (data: readonly StageData[], partProps: PartProps) =>
  data.map(({ label, value }) => (
    <ControlCards.Stage
      key={value}
      {...partProps['ControlCards.Stage']}
      value={value}
    >
      {label}
    </ControlCards.Stage>
  ));

/**
 * A stages card's parts as its views compose them (see
 * `propOptionsStages`'s children): its subtitle, its list of stages.
 */
const stagesPartsOf = (
  parts: readonly StagesPartData[],
  partProps: PartProps,
  stages: ReactNode,
  subtitle: string,
): ReactNode =>
  parts.map((part) =>
    part === 'subtitle' ? (
      <ControlCards.Subtitle
        key={part}
        {...partProps['ControlCards.Subtitle']}
      >
        {childrenOr(partProps['ControlCards.Subtitle'], subtitle)}
      </ControlCards.Subtitle>
    ) : (
      <ControlCards.StageList
        key={part}
        {...partProps['ControlCards.StageList']}
      >
        {stages}
      </ControlCards.StageList>
    ),
  );

/** The stages card's view: its parts, as it composes them. */
const stagesOthers = {
  'ControlCards.Stage': ['children', 'value'],
  'ControlCards.StageList': ['children'],
  'ControlCards.Stages (others)': [
    'active',
    'children',
    'emphasizedIcon',
    'icon',
    'name',
    'tint',
    'value',
  ],
  'ControlCards.Subtitle': ['children'],
} as const;

const StagesPart: FunctionComponent = () => (
  <PartView
    id="control-cards-parts-stages"
    options={propOptionsStages}
    others={stagesOthers}
    part="ControlCards.Stages"
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
              {stagesPartsOf(
                parts,
                partProps,
                stagesOf(washerStages, partProps),
                'Cotton, 40°',
              )}
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
              name="Washer Program"
              tint="var(--color-ui-system-teal)"
              value="rinse"
            >
              {stagesPartsOf(
                ['subtitle', 'list'],
                partProps,
                stagesOf(longStages, partProps),
                'Intensive, ends at 16:05',
              )}
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
              name="Washer Program"
              tint="var(--color-ui-system-teal)"
              value="spin"
            >
              {stagesPartsOf(
                ['subtitle', 'list'],
                partProps,
                stagesOf(washerStages, partProps),
                'Cotton, ends at 14:30',
              )}
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

/** The stage list's view: its card, its stages. */
const stageListOthers = {
  'ControlCards.Stage': ['children', 'value'],
  'ControlCards.Stages': [
    'active',
    'children',
    'emphasizedIcon',
    'icon',
    'name',
    'tint',
    'value',
  ],
} as const;

const StageListPart: FunctionComponent = () => (
  <PartView
    id="control-cards-parts-stage-list"
    options={propOptionsStageList}
    others={stageListOthers}
    part="ControlCards.StageList"
    tilesOf={(props, partProps) => {
      const { children: data, ...list } = props as Omit<
        ControlCardStageListProps,
        'children'
      > & { children: readonly StageData[] };
      return [
        {
          card: (
            <ControlCards.Stages
              {...partProps['ControlCards.Stages']}
              active
              emphasizedIcon={sfWasherFill}
              icon={sfWasher}
              name="Washer Program"
              tint="var(--color-ui-system-teal)"
              value="rinse"
            >
              <ControlCards.StageList {...list}>
                {stagesOf(data, partProps)}
              </ControlCards.StageList>
            </ControlCards.Stages>
          ),
          name: 'Stage list',
          size: '4x1',
          sizes: cardSizes.stagesDisplay,
        },
      ];
    }}
  />
);

/** The stage's view: its card, its list, the list's other stages. */
const stageOthers = {
  'ControlCards.StageList': ['children'],
  'ControlCards.Stages': [
    'active',
    'children',
    'emphasizedIcon',
    'icon',
    'name',
    'tint',
    'value',
  ],
} as const;

const StagePart: FunctionComponent = () => (
  <PartView
    id="control-cards-parts-stage"
    options={propOptionsStage}
    others={stageOthers}
    part="ControlCards.Stage"
    tilesOf={(props, partProps) => [
      {
        card: (
          <ControlCards.Stages
            {...partProps['ControlCards.Stages']}
            active
            emphasizedIcon={sfWasherFill}
            icon={sfWasher}
            name="Washer Program"
            tint="var(--color-ui-system-teal)"
            value="rinse"
          >
            <ControlCards.StageList {...partProps['ControlCards.StageList']}>
              <ControlCards.Stage value="wash">Wash</ControlCards.Stage>
              <ControlCards.Stage {...(props as ControlCardStageProps)} />
              <ControlCards.Stage value="spin">Spin</ControlCards.Stage>
            </ControlCards.StageList>
          </ControlCards.Stages>
        ),
        name: 'Stage',
        size: '2x1',
        sizes: cardSizes.stagesDisplay,
      },
    ]}
  />
);

/**
 * A light's or a card's channels as the views compose them (see
 * `channelsOptions`): each with its group's props.
 */
const channelsOf = (data: readonly ChannelData[], partProps: PartProps) =>
  data.map(({ name, ...channel }) => (
    <ControlCards.Channel
      key={name}
      {...partProps['ControlCards.Channel']}
      name={name}
      {...channel}
    />
  ));

/** What the views set on a channel (its data's). */
const channelFixed = ['colors', 'defaultValue', 'name', 'tint'] as const;

/** The light view's parts, and its second card (large): what it sets. */
const lightOthers = {
  'ControlCards.Channel': channelFixed,
  'ControlCards.Channels': ['children'],
  'ControlCards.Light (others)': ['children', 'emphasizedIcon', 'icon', 'name'],
} as const;

const LightPart: FunctionComponent = () => (
  <PartView
    id="control-cards-parts-light"
    options={getPropOptionsLight}
    others={lightOthers}
    part="ControlCards.Light"
    tilesOf={(props, partProps) => {
      const { children: data, ...card } = props as Omit<
        ControlCardLightProps,
        'children'
      > & { children: readonly ChannelData[] };
      const channels = (
        <ControlCards.Channels {...partProps['ControlCards.Channels']}>
          {channelsOf(data, partProps)}
        </ControlCards.Channels>
      );
      return [
        {
          card: <ControlCards.Light {...card}>{channels}</ControlCards.Light>,
          name: 'Small',
          size: '2x1',
          sizes: cardSizes.binaryControl,
        },
        {
          card: (
            <ControlCards.Light
              {...partProps['ControlCards.Light (others)']}
              emphasizedIcon={sfLightStrip2Fill}
              icon={sfLightStrip2}
              name="Light Strip"
            >
              {channels}
            </ControlCards.Light>
          ),
          name: 'Large',
          size: '2x2',
          sizes: ['2x2'],
        },
      ];
    }}
  />
);

/** A card of the views' own without a value (see `ownCardParts`). */
const { 'Card.Value': _value, ...ownCardPartsNoValue } = ownCardParts;

/** The channels' view: its cards' parts, the wide card's channels too. */
const channelsOthers = {
  ...ownCardPartsNoValue,
  'ControlCards.Channel': channelFixed,
  'ControlCards.Channels (others)': ['children'],
} as const;

const ChannelsPart: FunctionComponent = () => (
  <PartView
    id="control-cards-parts-channels"
    options={propOptionsChannels}
    others={channelsOthers}
    part="ControlCards.Channels"
    tilesOf={(props, partProps) => {
      const { children: data, ...channels } = props as Omit<
        ControlCardChannelsProps,
        'children'
      > & { children: readonly ChannelData[] };
      return [
        {
          card: (
            <Card.Root {...partProps['Card.Root']}>
              <Card.Symbol {...partProps['Card.Symbol']}>
                <Symbol
                  box="square"
                  {...partProps.Symbol}
                  icon={sfLightStrip2Fill}
                />
              </Card.Symbol>
              <Card.Title {...partProps['Card.Title']}>Light Strip</Card.Title>
              <ControlCards.Channels {...channels}>
                {channelsOf(data, partProps)}
              </ControlCards.Channels>
            </Card.Root>
          ),
          name: 'Light Strip',
          size: '2x2',
          sizes: ['2x2'],
        },
        {
          card: (
            <Card.Root {...partProps['Card.Root']}>
              <Card.Symbol {...partProps['Card.Symbol']}>
                <Symbol
                  box="square"
                  {...partProps.Symbol}
                  icon={sfLampFloorFill}
                />
              </Card.Symbol>
              <Card.Title {...partProps['Card.Title']}>Floor Lamp</Card.Title>
              <ControlCards.Channels
                {...partProps['ControlCards.Channels (others)']}
              >
                {channelsOf(fiveChannels, partProps)}
              </ControlCards.Channels>
            </Card.Root>
          ),
          name: 'Wide, five channels',
          size: '4x3',
          sizes: ['4x3'],
        },
      ];
    }}
  />
);

/** The channel's view: its card's parts, its channels, the other one. */
const channelOthers = {
  ...ownCardPartsNoValue,
  'ControlCards.Channel (others)': channelFixed,
  'ControlCards.Channels': ['children'],
} as const;

const ChannelPart: FunctionComponent = () => (
  <PartView
    id="control-cards-parts-channel"
    options={getPropOptionsChannel}
    others={channelOthers}
    part="ControlCards.Channel"
    tilesOf={(props, partProps) => [
      {
        card: (
          <Card.Root {...partProps['Card.Root']}>
            <Card.Symbol {...partProps['Card.Symbol']}>
              <Symbol
                box="square"
                {...partProps.Symbol}
                icon={sfLightbulbFill}
              />
            </Card.Symbol>
            <Card.Title {...partProps['Card.Title']}>Desk Light</Card.Title>
            <ControlCards.Channels {...partProps['ControlCards.Channels']}>
              <ControlCards.Channel {...(props as ControlCardChannelProps)} />
              <ControlCards.Channel
                {...partProps['ControlCards.Channel (others)']}
                colors={kelvinColors}
                defaultValue={0.3}
                name="Temperature"
              />
            </ControlCards.Channels>
          </Card.Root>
        ),
        name: 'Channel',
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
          sizes: cardSizes.summaryDisplay,
        },
      ];
    }}
  />
);

/** The segmented card's view: its items, as it composes them. */
const segmentedOthers = {
  'ControlCards.SegmentedItem': [
    'children',
    'icon',
    'subtitle',
    'tint',
    'value',
  ],
} as const;

const SegmentedPart: FunctionComponent = () => (
  <PartView
    id="control-cards-parts-segmented"
    options={getPropOptionsSegmented}
    others={segmentedOthers}
    part="ControlCards.Segmented"
    tilesOf={(props, partProps) => {
      // (Its items composed from the data its control chose.)
      const { children: data, ...card } = props as Omit<
        ControlCardSegmentedProps,
        'children'
      > & { children: readonly SegmentedOptionData[] };
      return [
        {
          card: (
            <ControlCards.Segmented {...card}>
              {data.map(({ label, value, ...option }) => (
                <ControlCards.SegmentedItem
                  key={value}
                  {...partProps['ControlCards.SegmentedItem']}
                  value={value}
                  {...option}
                >
                  {label}
                </ControlCards.SegmentedItem>
              ))}
            </ControlCards.Segmented>
          ),
          name: 'Segmented',
          openSize: '2x1',
          size: '2x1',
          sizes: cardSizes.choiceControl,
        },
      ];
    }}
  />
);

/** The segmented item's view: its card, the card's other items. */
const segmentedItemOthers = {
  'ControlCards.Segmented': ['defaultValue', 'icon', 'name', 'offValue'],
  'ControlCards.SegmentedItem (others)': ['children', 'icon', 'tint', 'value'],
} as const;

const SegmentedItemPart: FunctionComponent = () => (
  <PartView
    id="control-cards-parts-segmented-item"
    options={propOptionsSegmentedItem}
    others={segmentedItemOthers}
    part="ControlCards.SegmentedItem"
    tilesOf={(props, partProps) => {
      const others = partProps['ControlCards.SegmentedItem (others)'];
      return [
        {
          card: (
            <ControlCards.Segmented
              {...partProps['ControlCards.Segmented']}
              defaultValue="heat"
              icon={sfPower}
              name="Heat Pump"
              offValue="off"
            >
              <ControlCards.SegmentedItem
                {...others}
                icon={sfPower}
                value="off"
              >
                Off
              </ControlCards.SegmentedItem>
              <ControlCards.SegmentedItem
                {...(props as ControlCardSegmentedItemProps)}
              />
              <ControlCards.SegmentedItem
                {...others}
                icon={sfSnowflake}
                tint={cardTints.shade}
                value="cool"
              >
                Cool
              </ControlCards.SegmentedItem>
            </ControlCards.Segmented>
          ),
          name: 'Segmented',
          size: '2x2',
          sizes: cardSizes.choiceControl,
        },
      ];
    }}
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
                box="square"
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
                  box="square"
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
                box="square"
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
            <ul>
              <li>
                <PartLink part="ControlCards.SegmentedItem" /> (one per option)
              </li>
            </ul>
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
        <>
          Something under way, for example a washer’s program. Its symbol and
          title are its own; the rest is composed in it, as the app shows it: a{' '}
          <PartLink part="ControlCards.Subtitle" />, its value (
          <PartLink part="ControlCards.ProgressValue" />
          ), its bar (<PartLink part="ControlCards.ProgressBar" />
          ).
        </>,
        'In tiles a row tall there’s no room for a subtitle or a value beside the bar, so only the bar shows; taller tiles show all three, the value large. It fits every size from 1x1 up.',
        'Without a value, nothing is under way. The app can leave out the bar then and show the state as a subtitle, for example a garage door at rest.',
      ]}
    />
    <Section
      Demo={ProgressBarPart}
      part="ControlCards.ProgressBar"
      rows={controlCardsProgressBarRows}
      bullets={[
        <>
          A pill at the card’s bottom that fills in its tint as far as the
          progress has got. On it, a{' '}
          <PartLink part="ControlCards.ProgressLabel" /> at its start and a{' '}
          <PartLink part="ControlCards.ProgressDetail" /> at its end.
        </>,
        'What’s on it is drawn twice: on the well in the card’s text colors, and on the fill, clipped by it. On the fill it takes dark or light text, whichever has more contrast with the tint, read once and again when the tint or the color scheme changes; its detail is that color, less strong.',
        'It’s Base UI’s progress bar, named as its card, so assistive technology reads it as one. Its words sit beside it and are read as they are.',
      ]}
    />
    <Section
      Demo={ProgressLabelPart}
      part="ControlCards.ProgressLabel"
      rows={controlCardsProgressLabelRows}
      bullets={[
        <>
          Words at the start of a <PartLink part="ControlCards.ProgressBar" />,
          for example its phase. Long words end in an ellipsis before they reach
          its detail.
        </>,
      ]}
    />
    <Section
      Demo={ProgressDetailPart}
      part="ControlCards.ProgressDetail"
      rows={controlCardsProgressDetailRows}
      bullets={[
        <>
          Quieter words at the end of a{' '}
          <PartLink part="ControlCards.ProgressBar" />, for example how long it
          has left.
        </>,
      ]}
    />
    <Section
      Demo={ProgressValuePart}
      part="ControlCards.ProgressValue"
      rows={controlCardsProgressValueRows}
      bullets={[
        <>
          A <PartLink part="ControlCards.Progress" />
          ’s value in words, by its format: a percentage by default. It’s the
          card’s value, so it’s large in a large tile. In tiles a row tall it
          doesn’t show beside the bar.
        </>,
      ]}
    />
    <Section
      Demo={SubtitlePart}
      part="ControlCards.Subtitle"
      rows={controlCardsSubtitleRows}
      bullets={[
        <>
          More words under a card’s title, small and grey, for example a
          program’s name or when it ends. It has a row of its own, so a card can
          show it and a large value together. It goes in a{' '}
          <PartLink part="ControlCards.Progress" /> or a{' '}
          <PartLink part="ControlCards.Stages" />.
        </>,
        'Beside a bar or stages, it shows only in tiles taller than a row, where there’s room for it.',
      ]}
    />
    <Section
      Demo={LightPart}
      part="ControlCards.Light"
      rows={controlCardsLightRows}
      bullets={[
        <>
          A light of several channels, composed in it as a{' '}
          <PartLink part="ControlCards.Channels" /> of{' '}
          <PartLink part="ControlCards.Channel" />
          s. It shows a switch, its symbol in the color its channels make, and
          its brightness. Large (expanded, resized or open above the page), its
          channels show too. A press on its body toggles it, at any size, but
          not a press on its channels.
        </>,
        'Its symbol’s color adds up its amount channels as light does, tinted by any scale channel (for example a brightness by a color temperature), shown at full strength. Its brightness is its strongest amount channel’s share.',
        'Its value’s words are the app’s (getValueText, states). By default it shows its brightness while on and its off word while off.',
        'While it’s small its channels stay mounted, unseen, so it still knows the light they give.',
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
        'A device of a few modes, for example a heat pump’s Off, Heat, Cool and Auto: its options as segments in a well at its bottom, the chosen one raised. Built on Base UI’s RadioGroup, so the arrow keys move between them. A drag along them chooses each option as it reaches it; a touch across them scrolls the page instead.',
        'Whether segments show symbols, labels or both is the app’s choice (optionContent), not its size’s; so is whether they sit side by side or stack (orientation), for example stacked in a wide tile for long labels.',
        'Its tile’s size sets its layout. Across a row, its symbol and title sit on the top line, a segment’s symbol beside its label. Taller, its title and value sit as on any card, a segment’s symbol over its label. One wide and taller, the options stack, each with its symbol over its label, as in a taller tile. At 1x1 it only shows the chosen option and opens above the page to choose.',
        'Options can have a subtitle under their label, in the card’s value color, where there’s room: in tiles taller than a row, and in stacked options only once each option is tall enough for it.',
        'It’s lit while the chosen option isn’t its off option, and its symbol and tint are the chosen option’s.',
      ]}
    />
    <Section
      Demo={SegmentedItemPart}
      part="ControlCards.SegmentedItem"
      rows={controlCardsSegmentedItemRows}
      bullets={[
        'An option of a segmented card, composed in it as Segmented’s items are: its value, its words as its children, and what the card takes from it while it’s chosen (its symbol, its tint, its words as the card’s value).',
        'It tells its card these through context, so it can sit anywhere inside the card. At 1x1, where no options show, it stays mounted, unseen.',
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
          <PartLink part="ControlCards.Subtitle" /> and a{' '}
          <PartLink part="ControlCards.StageList" /> of its stages.
        </>,
        'Wider tiles give more stages room, and in tiles taller than a row its subtitle shows under its name. Never 1x1: too narrow for them.',
      ]}
    />
    <Section
      Demo={StageListPart}
      part="ControlCards.StageList"
      rows={controlCardsStageListRows}
      bullets={[
        <>
          The stages of a <PartLink part="ControlCards.Stages" />, as dots along
          a line at its bottom, their words under them. Those done are checked,
          the current one is in its tint with a ring, those to come are empty.
        </>,
        'It’s an ordered list named as its card, its current stage marked as the current step, so assistive technology reads where it is. It takes no presses of its own.',
      ]}
    />
    <Section
      Demo={StagePart}
      part="ControlCards.Stage"
      rows={controlCardsStageRows}
      bullets={[
        <>
          A stage in a <PartLink part="ControlCards.StageList" />: its value and
          its words. Whether it’s done, current or to come follows from its
          place before or after the card’s current one.
        </>,
      ]}
    />
    <Section
      Demo={ChannelsPart}
      part="ControlCards.Channels"
      rows={controlCardsChannelsRows}
      bullets={[
        <>
          A card’s channels, each a <PartLink part="ControlCards.Channel" /> in
          a well of its own, stacked at its bottom, 6px in from its edges,
          whatever the card’s width. Each takes 42px of height, so a card with
          many channels needs a taller tile: five fit in three rows.
        </>,
        <>
          In a <PartLink part="ControlCards.Light" />, they show only while it’s
          large. Elsewhere, for example in a{' '}
          <PartLink
            component="card"
            part="Card.Root"
          />{' '}
          of the app’s own, they always show.
        </>,
      ]}
    />
    <Section
      Demo={ChannelPart}
      part="ControlCards.Channel"
      rows={controlCardsChannelRows}
      bullets={[
        'Base UI’s slider in a pill-shaped well, its thumb round and kept inside the well at both ends. A drag anywhere on the well sets it, and the arrow keys step it.',
        'A touch is held back until it moves: along the well it’s a drag, across it a scroll of the page, the value untouched. While it’s dragged, the page doesn’t scroll, and its words can’t be selected. A tap sets the value where it lands.',
        'An amount (tint) fills from its start in its tint as far as the thumb’s center. At its least and greatest values the fill slides the rest of the way, to nothing or the whole well. Its thumb shows the light it gives: its tint mixed on black by its share, as light adds up, so 0% is black.',
        'A scale (colors) shows its colors along the well instead of a fill, its thumb the color at its value: for example a color temperature, warm to cool. The colors are the app’s.',
        'Its name sits at its start and its value at its end. When the thumb would cover one of them, that one slides to the other end beside the other, and back once the thumb is clear again.',
        'Each label takes dark or light text by what’s under its center: on the fill, whichever has more contrast with its tint; on the well, the card’s text color; on a scale, by its color there. The colors are read once, and again when they or the color scheme change.',
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
  ProgressBarPart,
  ProgressLabelPart,
  ProgressDetailPart,
  ProgressValuePart,
  SubtitlePart,
  LightPart,
  ListPart,
  SegmentedPart,
  SegmentedItemPart,
  StagesPart,
  StageListPart,
  StagePart,
  ChannelsPart,
  ChannelPart,
  TrendPart,
  ExpandButtonPart,
  OpenButtonsPart,
];
