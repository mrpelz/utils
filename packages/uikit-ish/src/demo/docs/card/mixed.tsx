import { FunctionComponent, type ReactNode, useMemo, useState } from 'react';

import {
  Card,
  cardSizes,
  forwardClick,
  Symbol,
  useGridItem,
} from '../../../components/index.js';
import { cardTints } from '../../tooling/card-kit.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePresentation } from '../../tooling/frame/presentation.js';
import {
  type PartProps,
  usePartControls,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import {
  sfCar,
  sfCarFill,
  sfFan,
  sfFanFill,
  sfLightbulb,
  sfLightbulbFill,
  sfThermometerMedium,
  sfWasher,
  sfWasherFill,
} from '../../tooling/icons.js';
import { partPropMaps } from '../part-options.js';
import { kelvinColors } from './props.js';
import {
  stageParts,
  type StageTile,
  tileStage,
  useStageOpen,
} from './stage.js';

// Card's building blocks together (its composition page): cards no
// ready-made one is, each a few blocks in one card, as an app composes its
// own; the edge cases where blocks meet.

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in a code sample, not interpolations */
export const mixedCode = `// A charger: a switch (lit while on) and its progress, together.
const [isCharging, setIsCharging] = useState(true);
<Card.Root active={isCharging} onClick={forwardClick('[role=switch]')}>
  <Card.Symbol>
    <Symbol box="square" icon={sfCar} emphasizedIcon={sfCarFill} />
  </Card.Symbol>
  <Card.Title>Car</Card.Title>
  <Card.Switch aria-label="Car charging" checked={isCharging} onCheckedChange={setIsCharging} />
  <Card.Progress value={64}>
    <Card.ProgressBar tint="var(--color-ui-system-green)">
      <Card.ProgressLabel>{isCharging ? 'Charging' : 'Paused'}</Card.ProgressLabel>
      <Card.ProgressDetail>1 h 20 min</Card.ProgressDetail>
    </Card.ProgressBar>
  </Card.Progress>
</Card.Root>

// A value with a subtitle and a trend, large.
<Card.Root>
  <Card.Symbol>…</Card.Symbol>
  <Card.Title>Outside</Card.Title>
  <Card.Subtitle>Feels like 10 °C</Card.Subtitle>
  <Card.Value format={celsius} value={12.4}>
    <Card.Trend angle={30} />
  </Card.Value>
</Card.Root>

// Stages, opening above the page (its item's openSize) for its details.
<Card.Root>
  …
  <Card.StageList value="rinse">
    <Card.Stage value="wash">Wash</Card.Stage>
    <Card.Stage value="rinse">Rinse</Card.Stage>
    <Card.Stage value="spin">Spin</Card.Stage>
  </Card.StageList>
  <Card.OpenButton aria-label="Washer details" />
  <Card.CloseButton aria-label="Close" />
</Card.Root>

// A light: small, its value; expanded (its item's expandedSize), its
// channels; a switch either way, a press on its body toggling it.
const isLarge = useGridItem()?.expanded === true;
<Card.Root active={isOn} onClick={…}>
  …
  <Card.Switch aria-label="Desk Light" checked={isOn} onCheckedChange={setIsOn} />
  {isLarge ? (
    <Card.Channels>
      <Card.Channel label="Brightness" defaultValue={70} tint="#ffd1a3" />
      <Card.Channel label="Warmth" colors={kelvinColors} defaultValue={30} />
    </Card.Channels>
  ) : (
    <Card.Value>70%</Card.Value>
  )}
  <Card.ExpandButton aria-label="Desk Light details" />
</Card.Root>

// A fan: a switch and a choice of speeds in one card.
<Card.Root active={isOn} onClick={forwardClick('[role=switch]')}>
  …
  <Card.Switch aria-label="Fan" checked={isOn} onCheckedChange={setIsOn} />
  <Card.Segmented defaultValue="low" disabled={!isOn}>
    <Card.SegmentedItem value="low">Low</Card.SegmentedItem>
    <Card.SegmentedItem value="mid">Mid</Card.SegmentedItem>
    <Card.SegmentedItem value="high">High</Card.SegmentedItem>
  </Card.Segmented>
</Card.Root>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** Its cards' parts, and the props the view sets on them. */
const mixedParts = {
  'Card.Channel': ['colors', 'defaultValue', 'label', 'tint'],
  'Card.Channels': ['children'],
  'Card.CloseButton': ['aria-label'],
  'Card.ExpandButton': ['aria-label'],
  'Card.OpenButton': ['aria-label'],
  'Card.Progress': ['children', 'value'],
  'Card.ProgressBar': ['children', 'tint'],
  'Card.ProgressDetail': ['children'],
  'Card.ProgressLabel': ['children'],
  'Card.Root': ['active', 'onClick'],
  'Card.Segmented': ['children', 'defaultValue', 'disabled'],
  'Card.SegmentedItem': ['children', 'value'],
  'Card.Stage': ['children', 'value'],
  'Card.StageList': ['children', 'value'],
  'Card.Subtitle': ['children'],
  'Card.Switch': ['aria-label', 'checked', 'defaultChecked', 'onCheckedChange'],
  'Card.Symbol': ['tint'],
  'Card.Title': ['children'],
  'Card.Trend': ['angle'],
  'Card.Value': ['children', 'format', 'locale', 'value'],
  Symbol: ['box', 'emphasizedIcon', 'icon'],
} as const;

/** A card's symbol, with its group's props. */
const symbolOf = (
  partProps: PartProps,
  icon: Parameters<typeof Symbol>[0]['icon'],
  emphasizedIcon?: Parameters<typeof Symbol>[0]['icon'],
): ReactNode => (
  <Card.Symbol {...partProps['Card.Symbol']}>
    <Symbol
      {...partProps.Symbol}
      box="square"
      emphasizedIcon={emphasizedIcon}
      icon={icon}
    />
  </Card.Symbol>
);

/** A switch's state, as the app keeps it (see the cards). */
type Switching = readonly [boolean, (isOn: boolean) => void];

/** The charger: a switch and its progress. */
const chargerOf = (
  partProps: PartProps,
  [isOn, setIsOn]: Switching,
): ReactNode => (
  <Card.Root
    {...partProps['Card.Root']}
    active={isOn}
    onClick={forwardClick('[role=switch]')}
  >
    {symbolOf(partProps, sfCar, sfCarFill)}
    <Card.Title {...partProps['Card.Title']}>Car</Card.Title>
    <Card.Switch
      {...partProps['Card.Switch']}
      aria-label="Car charging"
      checked={isOn}
      onCheckedChange={setIsOn}
    />
    <Card.Progress
      {...partProps['Card.Progress']}
      value={64}
    >
      <Card.ProgressBar
        {...partProps['Card.ProgressBar']}
        tint="var(--color-ui-system-green)"
      >
        <Card.ProgressLabel {...partProps['Card.ProgressLabel']}>
          {isOn ? 'Charging' : 'Paused'}
        </Card.ProgressLabel>
        <Card.ProgressDetail {...partProps['Card.ProgressDetail']}>
          1 h 20 min
        </Card.ProgressDetail>
      </Card.ProgressBar>
    </Card.Progress>
  </Card.Root>
);

/** The outside temperature: a subtitle, a value and its trend. */
const outsideOf = (partProps: PartProps): ReactNode => (
  <Card.Root {...partProps['Card.Root']}>
    {symbolOf(partProps, sfThermometerMedium)}
    <Card.Title {...partProps['Card.Title']}>Outside</Card.Title>
    <Card.Subtitle {...partProps['Card.Subtitle']}>
      Feels like 10 °C
    </Card.Subtitle>
    <Card.Value
      {...partProps['Card.Value']}
      format={{ maximumFractionDigits: 1, style: 'unit', unit: 'celsius' }}
      value={12.4}
    >
      <Card.Trend
        {...partProps['Card.Trend']}
        angle={30}
      />
    </Card.Value>
  </Card.Root>
);

/** The washer: its stages, opening above the page for its details. */
const washerOf = (partProps: PartProps): ReactNode => (
  <Card.Root {...partProps['Card.Root']}>
    {symbolOf(partProps, sfWasher, sfWasherFill)}
    <Card.Title {...partProps['Card.Title']}>Washer</Card.Title>
    <Card.StageList
      {...partProps['Card.StageList']}
      value="rinse"
    >
      {(
        [
          ['wash', 'Wash'],
          ['rinse', 'Rinse'],
          ['spin', 'Spin'],
        ] as const
      ).map(([value, label]) => (
        <Card.Stage
          key={value}
          {...partProps['Card.Stage']}
          value={value}
        >
          {label}
        </Card.Stage>
      ))}
    </Card.StageList>
    <Card.OpenButton
      {...partProps['Card.OpenButton']}
      aria-label="Washer details"
    />
    <Card.CloseButton
      {...partProps['Card.CloseButton']}
      aria-label="Close"
    />
  </Card.Root>
);

/**
 * The desk light: small, its value; expanded, its channels (a component,
 * reading its item's expansion).
 */
const DeskLight: FunctionComponent<{
  partProps: PartProps;
  switching: Switching;
}> = ({ partProps, switching: [isOn, setIsOn] }) => {
  const isLarge = useGridItem()?.expanded === true;
  return (
    <Card.Root
      {...partProps['Card.Root']}
      active={isOn}
      // (Its channels' presses theirs, not the switch's: see
      // `forwardClick`.)
      onClick={forwardClick('[role=switch]')}
    >
      <Card.Symbol
        {...partProps['Card.Symbol']}
        tint={cardTints.light}
      >
        <Symbol
          {...partProps.Symbol}
          box="square"
          emphasizedIcon={sfLightbulbFill}
          icon={sfLightbulb}
        />
      </Card.Symbol>
      <Card.Title {...partProps['Card.Title']}>Desk Light</Card.Title>
      <Card.Switch
        {...partProps['Card.Switch']}
        aria-label="Desk Light"
        checked={isOn}
        tint={cardTints.light}
        onCheckedChange={setIsOn}
      />
      {isLarge ? (
        <Card.Channels {...partProps['Card.Channels']}>
          <Card.Channel
            {...partProps['Card.Channel']}
            defaultValue={70}
            label="Brightness"
            tint="#ffd1a3"
          />
          <Card.Channel
            {...partProps['Card.Channel']}
            colors={kelvinColors}
            defaultValue={30}
            label="Warmth"
          />
        </Card.Channels>
      ) : (
        <Card.Value {...partProps['Card.Value']}>
          {isOn ? '70%' : 'Off'}
        </Card.Value>
      )}
      <Card.ExpandButton
        {...partProps['Card.ExpandButton']}
        aria-label="Desk Light details"
      />
    </Card.Root>
  );
};

/** The fan: a switch and a choice of its speeds. */
const fanOf = (partProps: PartProps, [isOn, setIsOn]: Switching): ReactNode => (
  <Card.Root
    {...partProps['Card.Root']}
    active={isOn}
    onClick={forwardClick('[role=switch]')}
  >
    {symbolOf(partProps, sfFan, sfFanFill)}
    <Card.Title {...partProps['Card.Title']}>Fan</Card.Title>
    <Card.Switch
      {...partProps['Card.Switch']}
      aria-label="Fan"
      checked={isOn}
      onCheckedChange={setIsOn}
    />
    <Card.Segmented
      {...partProps['Card.Segmented']}
      defaultValue="low"
      disabled={!isOn}
    >
      {(
        [
          ['low', 'Low'],
          ['mid', 'Mid'],
          ['high', 'High'],
        ] as const
      ).map(([value, label]) => (
        <Card.SegmentedItem
          key={value}
          {...partProps['Card.SegmentedItem']}
          value={value}
        >
          {label}
        </Card.SegmentedItem>
      ))}
    </Card.Segmented>
  </Card.Root>
);

/** Building blocks together: five cards, each a few blocks. */
export const MixedView: FunctionComponent = () => {
  const id = 'card-composition-mixed';
  const [log, addLog] = useLog();
  const open = useStageOpen();
  const charger = useState(true);
  const light = useState(true);
  const fan = useState(true);
  const [partControls, partProps, partState, partsKey] = usePartControls(
    useMemo(
      () => partPropMaps({ ...stageParts, ...mixedParts }, addLog),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );
  const [presentationControl, presentation, presentationState] =
    usePresentation(id);
  const tiles: readonly StageTile[] = [
    {
      card: chargerOf(partProps, charger),
      name: 'Car',
      size: '2x1',
      sizes: cardSizes.progressDisplay,
    },
    {
      card: outsideOf(partProps),
      name: 'Outside',
      size: '2x2',
      sizes: cardSizes.numericalDisplay,
    },
    {
      card: washerOf(partProps),
      name: 'Washer',
      openSize: '4x2',
      size: '4x1',
      sizes: cardSizes.stagesDisplay,
    },
    {
      card: (
        <DeskLight
          partProps={partProps}
          switching={light}
        />
      ),
      expandedSize: '2x2',
      name: 'Desk Light',
      size: '2x1',
      sizes: ['2x1', '2x2'],
    },
    {
      card: fanOf(partProps, fan),
      name: 'Fan',
      size: '2x2',
      sizes: cardSizes.choiceControl,
    },
  ];

  return (
    <Component
      isInline
      controls={[presentationControl, partControls]}
      id={id}
      log={log}
      stage={presentation}
      state={[partState, presentationState]}
      title="Card"
    >
      {tileStage(tiles, partProps, open, partsKey)}
    </Component>
  );
};

/** Its section on the composition page (see composition.tsx). */
export const MixedSection: FunctionComponent = () => (
  <>
    <Heading
      id="building-blocks-together"
      level={2}
    >
      Building blocks together
    </Heading>
    <ul>
      <li>
        Card’s parts can be combined freely, so you can build a card that none
        of the ready-made ones covers. Each part keeps its own place in the
        card’s layout, whatever else the card holds.
      </li>
      <li>
        The car combines a <PartLink part="Card.Switch" /> and a{' '}
        <PartLink part="Card.ProgressBar" />. The card is lit while the switch
        is on, and the bar’s fill keeps its own tint.
      </li>
      <li>
        The outside temperature has a <PartLink part="Card.Subtitle" /> above a
        large <PartLink part="Card.Value" /> with a{' '}
        <PartLink part="Card.Trend" />. The subtitle gets a row of its own.
      </li>
      <li>
        The washer has a <PartLink part="Card.StageList" /> and opens above the
        page with a <PartLink part="Card.OpenButton" />; a{' '}
        <PartLink part="Card.CloseButton" /> closes it. In a tile one row tall,
        the stages end before the button’s corner.
      </li>
      <li>
        The desk light has a <PartLink part="Card.Switch" />. Small, it shows
        its value; expanded with its <PartLink part="Card.ExpandButton" />, it
        shows <PartLink part="Card.Channels" /> instead. A press on the card
        toggles the switch, but a press on a channel only moves the channel. The
        last channel stops short of the button in its corner.
      </li>
      <li>
        The fan has a <PartLink part="Card.Switch" /> and a{' '}
        <PartLink part="Card.Segmented" /> for its speed. Choosing a speed
        doesn’t toggle the switch, and the choice is disabled while the fan is
        off.
      </li>
    </ul>
    <CodeView code={mixedCode} />
    <MixedView />
  </>
);
