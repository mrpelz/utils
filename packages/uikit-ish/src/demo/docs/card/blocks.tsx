import { FunctionComponent, type ReactNode } from 'react';

import {
  Card,
  type CardChannelProps,
  type CardChannelsProps,
  type CardCloseButtonProps,
  type CardExpandButtonProps,
  type CardOpenButtonProps,
  type CardProgressProps,
  type CardRowProps,
  type CardRowsProps,
  type CardSegmentedItemProps,
  type CardSegmentedProps,
  cardSizes,
  type CardSliderProps,
  type CardStageListProps,
  type CardStageProps,
  type CardSubtitleProps,
  type CardTrendProps,
  Symbol,
  type SymbolIcon,
} from '../../../components/index.js';
import { cardTints } from '../../tooling/card-kit.js';
import type { PartProps } from '../../tooling/frame/prop-control.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink, sectionId } from '../../tooling/guide/sections.js';
import {
  sfDoorGarageOpen,
  sfHouseFill,
  sfLampFloorFill,
  sfLightbulbFill,
  sfLightStrip2Fill,
  sfPower,
  sfSnowflake,
  sfSpeakerFill,
  sfThermometerMedium,
  sfWasher,
  sfWasherFill,
  sfWindowShadeClosed,
} from '../../tooling/icons.js';
import {
  cardChannelRows,
  cardChannelsRows,
  cardCloseButtonRows,
  cardExpandButtonRows,
  cardOpenButtonRows,
  cardProgressBarRows,
  cardProgressDetailRows,
  cardProgressLabelRows,
  cardProgressRows,
  cardProgressValueRows,
  cardRowRows,
  cardRowsRows,
  cardSegmentedItemRows,
  cardSegmentedRows,
  cardSliderRows,
  cardStageListRows,
  cardStageRows,
  cardSubtitleRows,
  cardTrendRows,
} from './docs.js';
import {
  type ChannelData,
  fiveChannels,
  getPropOptionsChannel,
  getPropOptionsChannels,
  getPropOptionsCloseButton,
  getPropOptionsExpandButton,
  getPropOptionsOpenButton,
  getPropOptionsRow,
  getPropOptionsRows,
  getPropOptionsSegmented,
  getPropOptionsSlider,
  heatPumpOptions,
  kelvinColors,
  longStages,
  type ProgressPartData,
  propOptionsProgress,
  propOptionsProgressBar,
  propOptionsProgressDetail,
  propOptionsProgressLabel,
  propOptionsProgressValue,
  propOptionsSegmentedItem,
  propOptionsStage,
  propOptionsStageList,
  propOptionsSubtitle,
  propOptionsTrend,
  type RowData,
  type SegmentedOptionData,
  type StageData,
} from './props.js';
import { TilePartView } from './stage.js';

// Card's building blocks' views (its parts page, see parts.tsx): each on
// cards composed of Card's parts, as an app composes its own.

/**
 * What the views set on a value showing words (its children: a number's
 * format and locale, and a number, would do nothing).
 */
const valueFixed = ['children', 'format', 'locale', 'value'] as const;

/** A card's own parts, as the views compose them (see `shellOf`). */
const shellParts = {
  'Card.Root': [],
  'Card.Symbol': [],
  'Card.Title': ['children'],
  Symbol: ['box', 'icon'],
} as const;

/**
 * A card of the views' own: its root, its symbol, its title, then what's
 * composed in it (each with its group's props). A function, not a
 * component: the demo's code shows the parts as written.
 */
const shellOf = (
  partProps: PartProps,
  { icon, title }: { icon: SymbolIcon; title: string },
  children: ReactNode,
): ReactNode => (
  <Card.Root {...partProps['Card.Root']}>
    <Card.Symbol {...partProps['Card.Symbol']}>
      <Symbol
        {...partProps.Symbol}
        box="square"
        icon={icon}
      />
    </Card.Symbol>
    <Card.Title {...partProps['Card.Title']}>{title}</Card.Title>
    {children}
  </Card.Root>
);

/**
 * A progress's parts as its views compose them (see `propOptionsProgress`'s
 * children): each with its group's props (the featured one's, its
 * control's), its words the view's.
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
          {(partProps['Card.ProgressLabel']?.children as ReactNode) ??
            words.label}
        </Card.ProgressLabel>
        {words.detail === undefined ? null : (
          <Card.ProgressDetail {...partProps['Card.ProgressDetail']}>
            {(partProps['Card.ProgressDetail']?.children as ReactNode) ??
              words.detail}
          </Card.ProgressDetail>
        )}
      </Card.ProgressBar>
    );
  });

/** A progress's parts the views compose, the props they set. */
const progressParts = {
  'Card.Progress': ['children', 'value'],
  'Card.ProgressBar': ['children'],
  'Card.ProgressDetail': [],
  'Card.ProgressLabel': [],
  'Card.ProgressValue': [],
  'Card.Subtitle': ['children'],
} as const;

/** Its parts the views set, without the featured one's (its control's). */
const othersBut = (
  featured: string,
  parts: Record<string, readonly string[]>,
): Record<string, readonly string[]> =>
  Object.fromEntries(
    Object.entries({ ...shellParts, ...parts }).filter(
      ([part]) => part !== featured,
    ),
  );

/** A washer's card (see the progress parts' views), 2x2. */
const washerOf = (partProps: PartProps): ReactNode =>
  shellOf(
    partProps,
    { icon: sfWasherFill, title: 'Washer' },
    <Card.Progress
      {...partProps['Card.Progress']}
      value={53}
    >
      {progressPartsOf(['subtitle', 'value', 'bar'], partProps, {
        detail: '40 min left',
        label: 'Rinsing',
        subtitle: 'Cotton, 40°',
      })}
    </Card.Progress>,
  );

const SubtitlePart: FunctionComponent = () => (
  <TilePartView
    id="card-parts-subtitle"
    options={propOptionsSubtitle}
    part="Card.Subtitle"
    others={othersBut('Card.Subtitle', {
      ...progressParts,
      'Card.Subtitle (others)': ['children'],
      'Card.Trend': ['angle'],
      'Card.Value': valueFixed,
    })}
    tilesOf={(props, partProps) => [
      {
        card: shellOf(
          partProps,
          { icon: sfThermometerMedium, title: 'Outside' },
          <>
            <Card.Subtitle {...(props as CardSubtitleProps)} />
            <Card.Value {...partProps['Card.Value']}>
              12.4 °C
              <Card.Trend
                {...partProps['Card.Trend']}
                angle={30}
              />
            </Card.Value>
          </>,
        ),
        name: 'Outside',
        size: '2x2',
        sizes: cardSizes.numericalDisplay,
      },
      {
        card: shellOf(
          partProps,
          { icon: sfWasherFill, title: 'Washer' },
          <Card.Progress
            {...partProps['Card.Progress']}
            value={53}
          >
            <Card.Subtitle {...partProps['Card.Subtitle (others)']}>
              Cotton, 40°
            </Card.Subtitle>
            {progressPartsOf(['value', 'bar'], partProps, {
              detail: '40 min left',
              label: 'Rinsing',
              subtitle: '',
            })}
          </Card.Progress>,
        ),
        name: 'Washer',
        size: '2x2',
        sizes: cardSizes.progressDisplay,
      },
    ]}
  />
);

const TrendPart: FunctionComponent = () => (
  <TilePartView
    id="card-parts-trend"
    options={propOptionsTrend}
    part="Card.Trend"
    others={othersBut('Card.Trend', {
      'Card.Trend (others)': ['angle'],
      'Card.Value': valueFixed,
    })}
    tilesOf={(props, partProps) => [
      {
        card: shellOf(
          partProps,
          { icon: sfThermometerMedium, title: 'Outside' },
          <Card.Value {...partProps['Card.Value']}>
            12.4 °C
            <Card.Trend {...(props as CardTrendProps)} />
          </Card.Value>,
        ),
        name: 'Outside',
        size: '2x1',
        sizes: cardSizes.numericalDisplay,
      },
      {
        card: shellOf(
          partProps,
          { icon: sfThermometerMedium, title: 'Living Room' },
          <Card.Value {...partProps['Card.Value']}>
            21.5 °C
            <Card.Trend
              {...partProps['Card.Trend (others)']}
              angle={-45}
            />
          </Card.Value>,
        ),
        name: 'Living Room',
        size: '2x2',
        sizes: cardSizes.numericalDisplay,
      },
    ]}
  />
);

const SliderPart: FunctionComponent = () => (
  <TilePartView
    id="card-parts-slider"
    options={getPropOptionsSlider}
    part="Card.Slider"
    others={{
      'Card.Root': [],
      'Card.Slider (others)': [
        'defaultValue',
        'format',
        'label',
        'step',
        'tint',
      ],
      'Card.Symbol': [],
      Symbol: ['box', 'icon'],
    }}
    tilesOf={(props, partProps) => [
      {
        card: (
          <Card.Root {...partProps['Card.Root']}>
            <Card.Symbol {...partProps['Card.Symbol']}>
              <Symbol
                {...partProps.Symbol}
                box="square"
                icon={sfThermometerMedium}
              />
            </Card.Symbol>
            <Card.Slider {...(props as CardSliderProps)} />
          </Card.Root>
        ),
        name: 'Heating',
        size: '2x2',
        sizes: cardSizes.numericalControl,
      },
      {
        card: (
          <Card.Root {...partProps['Card.Root']}>
            <Card.Symbol {...partProps['Card.Symbol']}>
              <Symbol
                {...partProps.Symbol}
                box="square"
                icon={sfWindowShadeClosed}
              />
            </Card.Symbol>
            <Card.Slider
              {...partProps['Card.Slider (others)']}
              defaultValue={50}
              format={{ maximumFractionDigits: 0, style: 'percent' }}
              label="Blinds"
              step={25}
              tint={cardTints.shade}
            />
          </Card.Root>
        ),
        name: 'Blinds',
        size: '1x2',
        sizes: cardSizes.numericalControl,
      },
    ]}
  />
);

const ProgressPart: FunctionComponent = () => (
  <TilePartView
    id="card-parts-progress"
    options={propOptionsProgress}
    part="Card.Progress"
    others={othersBut('Card.Progress', {
      ...progressParts,
      'Card.Progress (others)': ['children', 'value'],
    })}
    tilesOf={(props, partProps) => {
      const { children: parts, ...progress } = props as Omit<
        CardProgressProps,
        'children'
      > & { children: readonly ProgressPartData[] };
      return [
        {
          card: shellOf(
            partProps,
            { icon: sfWasherFill, title: 'Washer' },
            <Card.Progress {...progress}>
              {progressPartsOf(parts, partProps, {
                detail: '40 min left',
                label: 'Rinsing',
                subtitle: 'Cotton, 40°',
              })}
            </Card.Progress>,
          ),
          name: 'Washer',
          size: '2x2',
          sizes: cardSizes.progressDisplay,
        },
        {
          card: shellOf(
            partProps,
            { icon: sfWasher, title: 'Dryer' },
            <Card.Progress
              {...partProps['Card.Progress (others)']}
              value={20}
            >
              {progressPartsOf(['bar'], partProps, {
                label: '48 min',
                subtitle: '',
              })}
            </Card.Progress>,
          ),
          name: 'Dryer',
          size: '1x1',
          sizes: cardSizes.progressDisplay,
        },
        {
          card: shellOf(
            partProps,
            { icon: sfDoorGarageOpen, title: 'Garage Door' },
            <Card.Progress
              {...partProps['Card.Progress (others)']}
              value={35}
            >
              {progressPartsOf(['subtitle', 'bar'], partProps, {
                detail: '6 s left',
                label: 'Opening…',
                subtitle: 'Opened by Alex',
              })}
            </Card.Progress>,
          ),
          name: 'Garage Door',
          size: '2x1',
          sizes: cardSizes.progressDisplay,
        },
      ];
    }}
  />
);

/** A progress part's view (see below): a washer's card, its parts composed. */
const ProgressComposedPart: FunctionComponent<{
  id: string;
  options: Parameters<typeof TilePartView>[0]['options'];
  part:
    | 'Card.ProgressBar'
    | 'Card.ProgressDetail'
    | 'Card.ProgressLabel'
    | 'Card.ProgressValue';
}> = ({ id, options, part }) => (
  <TilePartView
    id={id}
    options={options}
    others={othersBut(part, progressParts)}
    part={part}
    tilesOf={(props, partProps) => [
      {
        card: washerOf({ ...partProps, [part]: props }),
        name: 'Washer',
        size: '2x2',
        sizes: cardSizes.progressDisplay,
      },
    ]}
  />
);

const ProgressValuePart: FunctionComponent = () => (
  <ProgressComposedPart
    id="card-parts-progress-value"
    options={propOptionsProgressValue}
    part="Card.ProgressValue"
  />
);

const ProgressBarPart: FunctionComponent = () => (
  <ProgressComposedPart
    id="card-parts-progress-bar"
    options={propOptionsProgressBar}
    part="Card.ProgressBar"
  />
);

const ProgressLabelPart: FunctionComponent = () => (
  <ProgressComposedPart
    id="card-parts-progress-label"
    options={propOptionsProgressLabel}
    part="Card.ProgressLabel"
  />
);

const ProgressDetailPart: FunctionComponent = () => (
  <ProgressComposedPart
    id="card-parts-progress-detail"
    options={propOptionsProgressDetail}
    part="Card.ProgressDetail"
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

const StageListPart: FunctionComponent = () => (
  <TilePartView
    id="card-parts-stage-list"
    options={propOptionsStageList}
    part="Card.StageList"
    others={othersBut('Card.StageList', {
      'Card.Stage': ['children', 'value'],
      'Card.StageList (others)': ['children', 'value'],
      'Card.Subtitle': ['children'],
    })}
    tilesOf={(props, partProps) => {
      const { children: data, ...list } = props as Omit<
        CardStageListProps,
        'children'
      > & { children: readonly StageData[] };
      return [
        {
          card: shellOf(
            partProps,
            { icon: sfWasherFill, title: 'Washer Program' },
            <Card.StageList {...list}>
              {stagesOf(data, partProps)}
            </Card.StageList>,
          ),
          name: 'Washer Program',
          size: '4x1',
          sizes: cardSizes.stagesDisplay,
        },
        {
          card: shellOf(
            partProps,
            { icon: sfWasherFill, title: 'Dishwasher' },
            <>
              <Card.Subtitle {...partProps['Card.Subtitle']}>
                Intensive, ends at 16:05
              </Card.Subtitle>
              <Card.StageList
                {...partProps['Card.StageList (others)']}
                value="spin"
              >
                {stagesOf(longStages, partProps)}
              </Card.StageList>
            </>,
          ),
          name: 'Dishwasher',
          size: '4x2',
          sizes: cardSizes.stagesDisplay,
        },
      ];
    }}
  />
);

const StagePart: FunctionComponent = () => (
  <TilePartView
    id="card-parts-stage"
    options={propOptionsStage}
    part="Card.Stage"
    others={othersBut('Card.Stage', {
      'Card.Stage (others)': ['children', 'value'],
      'Card.StageList': ['children', 'value'],
    })}
    tilesOf={(props, partProps) => [
      {
        card: shellOf(
          partProps,
          { icon: sfWasherFill, title: 'Washer Program' },
          <Card.StageList
            {...partProps['Card.StageList']}
            value="rinse"
          >
            <Card.Stage
              {...partProps['Card.Stage (others)']}
              value="wash"
            >
              Wash
            </Card.Stage>
            <Card.Stage {...(props as CardStageProps)} />
            <Card.Stage
              {...partProps['Card.Stage (others)']}
              value="spin"
            >
              Spin
            </Card.Stage>
          </Card.StageList>,
        ),
        name: 'Washer Program',
        size: '2x1',
        sizes: cardSizes.stagesDisplay,
      },
    ]}
  />
);

/** Channels as the views compose them (each with its group's props). */
const channelsOf = (data: readonly ChannelData[], partProps: PartProps) =>
  data.map(({ label, ...channel }) => (
    <Card.Channel
      key={label}
      {...partProps['Card.Channel']}
      label={label}
      {...channel}
    />
  ));

/** What the views set on a channel (its data's). */
const channelFixed = ['colors', 'defaultValue', 'label', 'tint'] as const;

const ChannelsPart: FunctionComponent = () => (
  <TilePartView
    id="card-parts-channels"
    options={getPropOptionsChannels}
    part="Card.Channels"
    others={othersBut('Card.Channels', {
      'Card.Channel': channelFixed,
      'Card.Channels (others)': ['children'],
    })}
    tilesOf={(props, partProps) => {
      const { children: data, ...channels } = props as Omit<
        CardChannelsProps,
        'children'
      > & { children: readonly ChannelData[] };
      return [
        {
          card: shellOf(
            partProps,
            { icon: sfLightStrip2Fill, title: 'Light Strip' },
            <Card.Channels {...channels}>
              {channelsOf(data, partProps)}
            </Card.Channels>,
          ),
          name: 'Light Strip',
          size: '2x2',
          sizes: ['2x2'],
        },
        {
          card: shellOf(
            partProps,
            { icon: sfLampFloorFill, title: 'Floor Lamp' },
            <Card.Channels {...partProps['Card.Channels (others)']}>
              {channelsOf(fiveChannels, partProps)}
            </Card.Channels>,
          ),
          name: 'Floor Lamp',
          size: '4x3',
          sizes: ['4x3'],
        },
      ];
    }}
  />
);

const ChannelPart: FunctionComponent = () => (
  <TilePartView
    id="card-parts-channel"
    options={getPropOptionsChannel}
    part="Card.Channel"
    others={othersBut('Card.Channel', {
      'Card.Channel (others)': channelFixed,
      'Card.Channels': ['children'],
    })}
    tilesOf={(props, partProps) => [
      {
        card: shellOf(
          partProps,
          { icon: sfLightbulbFill, title: 'Desk Light' },
          <Card.Channels {...partProps['Card.Channels']}>
            <Card.Channel {...(props as CardChannelProps)} />
            <Card.Channel
              {...partProps['Card.Channel (others)']}
              colors={kelvinColors}
              defaultValue={30}
              label="Temperature"
            />
          </Card.Channels>,
        ),
        name: 'Desk Light',
        size: '2x2',
        sizes: ['2x2'],
      },
    ]}
  />
);

/** A choice's options (each with its group's props). */
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

/** What the views set on an option (its data's). */
const optionFixed = [
  'children',
  'disabled',
  'icon',
  'subtitle',
  'tint',
  'value',
] as const;

const SegmentedPart: FunctionComponent = () => (
  <TilePartView
    id="card-parts-segmented"
    options={getPropOptionsSegmented}
    part="Card.Segmented"
    others={othersBut('Card.Segmented', {
      'Card.Segmented (others)': ['children', 'defaultValue'],
      'Card.SegmentedItem': optionFixed,
      'Card.Value': valueFixed,
    })}
    tilesOf={(props, partProps) => {
      const { children: data, ...choice } = props as Omit<
        CardSegmentedProps,
        'children'
      > & { children: readonly SegmentedOptionData[] };
      return [
        {
          card: shellOf(
            partProps,
            { icon: sfPower, title: 'Heat Pump' },
            <Card.Segmented {...choice}>
              {optionsOf(data, partProps)}
            </Card.Segmented>,
          ),
          name: 'Heat Pump',
          size: '2x1',
          sizes: cardSizes.choiceControl,
        },
        {
          card: shellOf(
            partProps,
            { icon: sfSnowflake, title: 'Air Conditioner' },
            <>
              <Card.Value {...partProps['Card.Value']}>Cooling</Card.Value>
              <Card.Segmented
                {...partProps['Card.Segmented (others)']}
                defaultValue="cool"
              >
                {optionsOf(heatPumpOptions, partProps)}
              </Card.Segmented>
            </>,
          ),
          name: 'Air Conditioner',
          size: '2x2',
          sizes: cardSizes.choiceControl,
        },
      ];
    }}
  />
);

const SegmentedItemPart: FunctionComponent = () => (
  <TilePartView
    id="card-parts-segmented-item"
    options={propOptionsSegmentedItem}
    part="Card.SegmentedItem"
    others={othersBut('Card.SegmentedItem', {
      'Card.Segmented': ['children', 'defaultValue'],
      'Card.SegmentedItem (others)': ['children', 'icon', 'tint', 'value'],
    })}
    tilesOf={(props, partProps) => [
      {
        card: shellOf(
          partProps,
          { icon: sfPower, title: 'Heat Pump' },
          <Card.Segmented
            {...partProps['Card.Segmented']}
            defaultValue="heat"
          >
            <Card.SegmentedItem
              {...partProps['Card.SegmentedItem (others)']}
              icon={sfPower}
              value="off"
            >
              Off
            </Card.SegmentedItem>
            <Card.SegmentedItem {...(props as CardSegmentedItemProps)} />
            <Card.SegmentedItem
              {...partProps['Card.SegmentedItem (others)']}
              icon={sfSnowflake}
              tint={cardTints.shade}
              value="cool"
            >
              Cool
            </Card.SegmentedItem>
          </Card.Segmented>,
        ),
        name: 'Heat Pump',
        size: '2x2',
        sizes: cardSizes.choiceControl,
      },
    ]}
  />
);

/** A card's rows (each with its group's props). */
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

/** What the views set on a row (its data's). */
const rowFixed = ['children', 'icon', 'onClick', 'value'] as const;

const RowsPart: FunctionComponent = () => (
  <TilePartView
    id="card-parts-rows"
    options={getPropOptionsRows}
    part="Card.Rows"
    others={othersBut('Card.Rows', {
      'Card.CloseButton': ['aria-label'],
      'Card.Row': rowFixed,
    })}
    tilesOf={(props, partProps) => {
      const { children: data, ...rows } = props as Omit<
        CardRowsProps,
        'children'
      > & { children: readonly RowData[] };
      return [
        {
          card: shellOf(
            partProps,
            { icon: sfHouseFill, title: 'Living Room' },
            <Card.Rows {...rows}>{rowsOf(data, partProps)}</Card.Rows>,
          ),
          // (Expanded at first: its last row makes it small again (its
          // lessLabel); small, it expands it.)
          defaultExpanded: true,
          expandedSize: '3x3',
          name: 'Living Room',
          size: '2x2',
          sizes: cardSizes.summaryDisplay,
        },
        {
          card: shellOf(
            partProps,
            { icon: sfHouseFill, title: 'Kitchen' },
            <>
              {/* (The same rows: rows left out, its last row counting
                  them (its getMoreLabel), opening it above the page.) */}
              <Card.Rows {...rows}>{rowsOf(data, partProps)}</Card.Rows>
              <Card.CloseButton
                {...partProps['Card.CloseButton']}
                aria-label="Close"
              />
            </>,
          ),
          // (Rows left out: its last row opens it above the page.)
          name: 'Kitchen',
          openSize: '4x3',
          size: '2x2',
          sizes: cardSizes.summaryDisplay,
        },
      ];
    }}
  />
);

const RowPart: FunctionComponent = () => (
  <TilePartView
    id="card-parts-row"
    options={getPropOptionsRow}
    part="Card.Row"
    others={othersBut('Card.Row', {
      'Card.Row (others)': rowFixed,
      // (Two rows, both fitting: no last row of its own.)
      'Card.Rows': ['children', 'getMoreLabel', 'lessLabel'],
    })}
    tilesOf={(props, partProps) => [
      {
        card: shellOf(
          partProps,
          { icon: sfHouseFill, title: 'Living Room' },
          <Card.Rows {...partProps['Card.Rows']}>
            <Card.Row {...(props as CardRowProps)} />
            <Card.Row
              {...partProps['Card.Row (others)']}
              icon={sfThermometerMedium}
              value="21.5 °C"
            >
              Temperature
            </Card.Row>
          </Card.Rows>,
        ),
        name: 'Living Room',
        size: '2x2',
        sizes: cardSizes.summaryDisplay,
      },
    ]}
  />
);

/** A temperature's card's parts (see the corner buttons' views). */
const temperatureOf = (partProps: PartProps, children: ReactNode) =>
  shellOf(
    partProps,
    { icon: sfThermometerMedium, title: 'Heating' },
    <>
      <Card.Value {...partProps['Card.Value']}>21.5 °C</Card.Value>
      {children}
    </>,
  );

const ExpandButtonPart: FunctionComponent = () => (
  <TilePartView
    id="card-parts-expand-button"
    options={getPropOptionsExpandButton}
    others={othersBut('Card.ExpandButton', { 'Card.Value': valueFixed })}
    part="Card.ExpandButton"
    tilesOf={(props, partProps) => [
      {
        card: temperatureOf(
          partProps,
          <Card.ExpandButton {...(props as CardExpandButtonProps)} />,
        ),
        expandedSize: '2x2',
        name: 'Heating',
        size: '2x1',
        sizes: [...cardSizes.numericalDisplay, '3x2'],
      },
    ]}
  />
);

/** A speaker's card's parts (see the open and close buttons' views). */
const speakerOf = (partProps: PartProps, children: ReactNode) =>
  shellOf(
    partProps,
    { icon: sfSpeakerFill, title: 'Kitchen Speaker' },
    <>
      <Card.Value {...partProps['Card.Value']}>Paused</Card.Value>
      {children}
    </>,
  );

const OpenButtonPart: FunctionComponent = () => (
  <TilePartView
    id="card-parts-open-button"
    options={getPropOptionsOpenButton}
    part="Card.OpenButton"
    others={othersBut('Card.OpenButton', {
      'Card.CloseButton': ['aria-label'],
      'Card.Value': valueFixed,
    })}
    tilesOf={(props, partProps) => [
      {
        card: speakerOf(
          partProps,
          <>
            <Card.OpenButton {...(props as CardOpenButtonProps)} />
            <Card.CloseButton
              {...partProps['Card.CloseButton']}
              aria-label="Close"
            />
          </>,
        ),
        name: 'Kitchen Speaker',
        openSize: '4x3',
        size: '2x1',
        sizes: cardSizes.binaryControl,
      },
    ]}
  />
);

const CloseButtonPart: FunctionComponent = () => (
  <TilePartView
    id="card-parts-close-button"
    options={getPropOptionsCloseButton}
    part="Card.CloseButton"
    others={othersBut('Card.CloseButton', {
      'Card.OpenButton': ['aria-label'],
      'Card.Value': valueFixed,
    })}
    tilesOf={(props, partProps) => [
      {
        card: speakerOf(
          partProps,
          <>
            <Card.OpenButton
              {...partProps['Card.OpenButton']}
              aria-label="Kitchen Speaker details"
            />
            <Card.CloseButton {...(props as CardCloseButtonProps)} />
          </>,
        ),
        name: 'Kitchen Speaker',
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

/** The building blocks' sections, on Card's parts page (see parts.tsx). */
export const CardBlockSections: FunctionComponent = () => (
  <>
    <Section
      Demo={SubtitlePart}
      part="Card.Subtitle"
      rows={cardSubtitleRows}
      bullets={[
        'More words under a card’s title, small and grey, for example a program’s name or when it ends. It has a row of its own, so a card can show it and a large value together.',
        'Beside a progress bar, stages or channels, it shows only in tiles taller than a row, where there’s room for it.',
        <>
          Renders a <code>span</code>.
        </>,
      ]}
    />
    <Section
      Demo={TrendPart}
      part="Card.Trend"
      rows={cardTrendRows}
      bullets={[
        <>
          An arrow after a number, in its <PartLink part="Card.Value" />, turned
          by how steeply the value changes. Assistive technology reads rising,
          falling or steady.
        </>,
        'It turns to a new angle by its own transform, so it can turn in a scroller.',
        <>
          Renders a <code>span</code>.
        </>,
      ]}
    />
    <Section
      Demo={SliderPart}
      part="Card.Slider"
      rows={cardSliderRows}
      bullets={[
        <>
          A slider filling its card, for a level set by dragging across the
          whole card. It’s a{' '}
          <PartLink
            component="slider"
            part="Slider.Root"
          />
          , across in a wide tile and upright in a tall one (see{' '}
          <PartLink part="useCardOrientation" />
          ).
        </>,
        <>
          Its fill is its tint, opaque. Its label, value and ticks, and the
          card’s <PartLink part="Card.Symbol" /> and{' '}
          <PartLink part="Card.CornerButton" />
          s, are drawn twice: on the card, and inside the fill in the text color
          for the fill’s tone. Any tint reads.
        </>,
        'With onPress, a press on it does that instead (for example toggling the card’s switch), and a drag sets its value. A touch moving across it scrolls the page.',
        <>
          Its value’s words are its children (a function, as Base UI’s
          Slider.Value), and what assistive technology reads is its
          getAriaValueText.
        </>,
      ]}
    />
    <Section
      Demo={ProgressPart}
      part="Card.Progress"
      rows={cardProgressRows}
      bullets={[
        <>
          A card’s progress, for example a washer’s run: its value and range and
          how it’s put in words, as Base UI’s Progress.Root. Its parts are
          composed in it, as the app shows them: its value in words (
          <PartLink part="Card.ProgressValue" />
          ), its bar (<PartLink part="Card.ProgressBar" />
          ).
        </>,
        'It renders no element of its own, so its parts are laid out as the card’s. In tiles a row tall there’s no room for a subtitle or a value beside the bar, so only the bar shows; it fits every size from 1x1 up.',
        'Its value null means nothing is under way: its bar is empty and its value shows nothing. The app can leave out the bar then and show the state as a subtitle, for example a garage door at rest.',
      ]}
    />
    <Section
      Demo={ProgressValuePart}
      part="Card.ProgressValue"
      rows={cardProgressValueRows}
      bullets={[
        <>
          A <PartLink part="Card.Progress" />
          ’s value in words, by its format: a percentage by default. It’s the
          card’s value, so it’s large in a large tile. In tiles a row tall it
          doesn’t show beside the bar.
        </>,
        <>
          Renders a <code>span</code>.
        </>,
      ]}
    />
    <Section
      Demo={ProgressBarPart}
      part="Card.ProgressBar"
      rows={cardProgressBarRows}
      bullets={[
        <>
          A pill at the card’s bottom that fills in its tint as far as its{' '}
          <PartLink part="Card.Progress" /> has got. On it, a{' '}
          <PartLink part="Card.ProgressLabel" /> at its start and a{' '}
          <PartLink part="Card.ProgressDetail" /> at its end.
        </>,
        'What’s on it is drawn twice: on the well in the card’s text colors, and on the fill, clipped by it. On the fill it takes dark or light text, whichever has more contrast with the tint, read once and again when the tint or the color scheme changes; its detail is that color, less strong.',
        <>
          It holds Base UI’s progress bar, named by the card’s{' '}
          <PartLink part="Card.Title" /> (or its aria-label), so assistive
          technology reads it as one. Its words sit beside it and are read as
          they are.
        </>,
        <>
          Renders a <code>div</code>.
        </>,
      ]}
    />
    <Section
      Demo={ProgressLabelPart}
      part="Card.ProgressLabel"
      rows={cardProgressLabelRows}
      bullets={[
        <>
          Words at the start of a <PartLink part="Card.ProgressBar" />, for
          example its phase. Long words end in an ellipsis before they reach its
          detail.
        </>,
        <>
          Renders a <code>span</code>, twice: on the well, and on the fill (its
          ref the well’s).
        </>,
      ]}
    />
    <Section
      Demo={ProgressDetailPart}
      part="Card.ProgressDetail"
      rows={cardProgressDetailRows}
      bullets={[
        <>
          Quieter words at the end of a <PartLink part="Card.ProgressBar" />,
          for example how long it has left.
        </>,
        <>
          Renders a <code>span</code>, twice, as a label.
        </>,
      ]}
    />
    <Section
      Demo={StageListPart}
      part="Card.StageList"
      rows={cardStageListRows}
      bullets={[
        'A run of stages in order, for example a washer’s program, as dots along a line at the card’s bottom, their words under them. Those done are checked, the current one (its value) is in its tint with a ring, those to come are empty. Wider tiles give more stages room; never 1x1, too narrow for them.',
        <>
          It’s an ordered list named by the card’s{' '}
          <PartLink part="Card.Title" />, its current stage marked as the
          current step, so assistive technology reads where it is. It takes no
          presses of its own.
        </>,
        <>
          Renders an <code>ol</code>.
        </>,
      ]}
    />
    <Section
      Demo={StagePart}
      part="Card.Stage"
      rows={cardStageRows}
      bullets={[
        <>
          A stage in a <PartLink part="Card.StageList" />: its value and its
          words. Whether it’s done, current or to come follows from its place
          before or after its list’s current one.
        </>,
        <>
          Renders an <code>li</code>.
        </>,
      ]}
    />
    <Section
      Demo={ChannelsPart}
      part="Card.Channels"
      rows={cardChannelsRows}
      bullets={[
        <>
          A card’s channels, each a <PartLink part="Card.Channel" /> in a well
          of its own, stacked at its bottom, 6px in from its edges, whatever the
          card’s width. Each takes 42px of height, so a card with many channels
          needs a taller tile: five fit in three rows.
        </>,
        'The light they make together is told by onLightChange: the amounts added up as light does, tinted by any scale (for example a brightness by a color temperature), at full strength, and its brightness (the strongest amount’s share). A ready-made light card shows it as its symbol’s color.',
        <>
          In a{' '}
          <PartLink
            component="control-cards"
            part="ControlCards.Light"
          />{' '}
          they show only while it’s large; in a card of the app’s own, always. A
          press on them is theirs: the card doesn’t show its press tint.
        </>,
        <>
          Renders a <code>div</code>.
        </>,
      ]}
    />
    <Section
      Demo={ChannelPart}
      part="Card.Channel"
      rows={cardChannelRows}
      bullets={[
        'Base UI’s slider in a pill-shaped well, its thumb round and kept inside the well at both ends. A drag anywhere on the well sets it, and the arrow keys step it.',
        'A touch is held back until it moves: along the well it’s a drag, across it a scroll of the page, the value untouched. While it’s dragged, the page doesn’t scroll, and its words can’t be selected. A tap sets the value where it lands.',
        'An amount (tint) fills from its start in its tint as far as the thumb’s center. At its least and greatest values the fill slides the rest of the way, to nothing or the whole well. Its thumb shows the light it gives: its tint mixed on black by its share, as light adds up, so 0% is black.',
        'A scale (colors) shows its colors along the well instead of a fill, its thumb the color at its value: for example a color temperature, warm to cool. The colors are the app’s; give it a range too, for example min 2200 and max 6500.',
        'Its label sits at its start and its value at its end. When the thumb would cover one of them, that one slides to the other end beside the other, and back once the thumb is clear again. If the thumb would cover it there too, it stays where it is. Each takes dark or light text by what’s under its center.',
      ]}
    />
    <Section
      Demo={SegmentedPart}
      part="Card.Segmented"
      rows={cardSegmentedRows}
      bullets={[
        'A choice of a few, for example a heat pump’s modes: its options as segments in a well at the card’s bottom, the chosen one raised. It’s Base UI’s RadioGroup, so the arrow keys move between them. A drag along them chooses each option as it reaches it; a touch across them scrolls the page instead.',
        'Its tile’s size sets its layout. Across a row, the card’s symbol and title sit on the top line, a segment’s symbol beside its label. Taller, the card’s title and value sit as on any card, a segment’s symbol over its label. One wide and taller, the options stack. At 1x1 they’re hidden: the card can open above the page to show them.',
        <>
          It’s named by the card’s <PartLink part="Card.Title" />. In a{' '}
          <PartLink
            component="control-cards"
            part="ControlCards.Segmented"
          />
          , the card’s symbol, tint and value follow the chosen option.
        </>,
        <>
          Renders a <code>div</code>.
        </>,
      ]}
    />
    <Section
      Demo={SegmentedItemPart}
      part="Card.SegmentedItem"
      rows={cardSegmentedItemRows}
      bullets={[
        <>
          An option of a <PartLink part="Card.Segmented" />, a Base UI Radio:
          its value, its words as its children, its symbol, a subtitle where
          there’s room.
        </>,
        'It tells its choice what it shows, so a ready-made card can show the chosen one’s symbol and words. At 1x1, where no options show, it stays mounted, unseen.',
      ]}
    />
    <Section
      Demo={RowsPart}
      part="Card.Rows"
      rows={cardRowsRows}
      bullets={[
        'A summary in rows, for example a room’s, in a well at the card’s bottom: as many rows as fit whole. Their symbols sit under the card’s symbol, their labels where its title starts.',
        <>
          When rows are left out, its last row counts them and expands the tile
          (its{' '}
          <PartLink
            component="grid"
            part="Grid.Item"
          />
          ’s expandedSize) or opens it above the page (an item with an
          openSize), showing the corner symbol for that. Expanded, the last row
          makes it small again. An invisible corner button over that row does
          the same, so a touch near the corner has a large target.
        </>,
      ]}
    />
    <Section
      Demo={RowPart}
      part="Card.Row"
      rows={cardRowRows}
      bullets={[
        <>
          A row of a <PartLink part="Card.Rows" />: its symbol, its label, its
          value. With onClick, it’s pressed anywhere on it, for example to go to
          a page of its own, and shows a chevron after its value.
        </>,
      ]}
    />
    <Section
      Demo={ExpandButtonPart}
      part="Card.ExpandButton"
      rows={cardExpandButtonRows}
      bullets={[
        <>
          A <PartLink part="Card.CornerButton" /> expanding its card in place
          and making it small again: its{' '}
          <PartLink
            component="grid"
            part="Grid.Item"
          />
          ’s expansion (its expandedSize, its expanded), controlled or the
          item’s own. Its icon shows which way the card goes, mirrored in a
          right-to-left layout.
        </>,
        'It hides while expanding would change nothing: both sizes come out the same as the grid is now, for example with too few columns. To see it hide, set the grid’s unitSize to 180 for two columns.',
      ]}
    />
    <Section
      Demo={OpenButtonPart}
      part="Card.OpenButton"
      rows={cardOpenButtonRows}
      bullets={[
        <>
          A <PartLink part="Card.CornerButton" /> opening its card above the
          page: its{' '}
          <PartLink
            component="grid"
            part="Grid.Item"
          />
          ’s open. Hidden while it’s open.
        </>,
      ]}
    />
    <Section
      Demo={CloseButtonPart}
      part="Card.CloseButton"
      rows={cardCloseButtonRows}
      bullets={[
        <>
          A <PartLink part="Card.CornerButton" /> closing its card opened above
          the page, in its top trailing corner, clear of its symbol. Shown only
          while it’s open.
        </>,
      ]}
    />
  </>
);

/** The building blocks' live views (see parts.tsx's demos). */
export const cardBlockDemos = [
  SubtitlePart,
  TrendPart,
  SliderPart,
  ProgressPart,
  ProgressValuePart,
  ProgressBarPart,
  ProgressLabelPart,
  ProgressDetailPart,
  StageListPart,
  StagePart,
  ChannelsPart,
  ChannelPart,
  SegmentedPart,
  SegmentedItemPart,
  RowsPart,
  RowPart,
  ExpandButtonPart,
  OpenButtonPart,
  CloseButtonPart,
];
