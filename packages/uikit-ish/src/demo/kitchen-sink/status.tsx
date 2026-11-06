import { FunctionComponent, useEffect, useState } from 'react';

import {
  ActivityIndicator,
  type ActivityIndicatorDisplay,
  Avatar,
  Badge,
  Button,
  List,
  Progress,
  type ProgressPlacement,
  Symbol,
  Toolbar,
} from '../../components/index.js';
import {
  sfBell,
  sfEnvelope,
  sfEnvelopeFill,
  sfTray,
} from '../tooling/icons.js';
import { Row, Rows, Showcase, type SinkPages } from './shared.js';

// Status: Progress (bars, activity indicators), Badge.

const placements: readonly ProgressPlacement[] = [
  'block-start',
  'block-end',
  'inline-start',
  'inline-end',
];

/** A bar advancing on its own (restarted by its button). */
const Advancing: FunctionComponent = () => {
  const [done, setDone] = useState(0);
  useEffect(() => {
    if (done >= 12) return undefined;
    const timeout = setTimeout(() => setDone(done + 1), 500);
    return () => clearTimeout(timeout);
  }, [done]);

  return (
    <>
      <Progress.Root
        max={12}
        value={done}
      >
        <Progress.Label>Importing Photos</Progress.Label>
        <Progress.Value>
          {(formattedValue: string | null, value: number | null) =>
            `${String(value)} of 12`
          }
        </Progress.Value>
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>
      <Button.Root
        variant="bordered"
        onClick={() => setDone(0)}
      >
        <Button.Label>Restart</Button.Label>
      </Button.Root>
    </>
  );
};

const displays: readonly ActivityIndicatorDisplay[] = [
  'animate',
  'freeze',
  'finish',
  'reset',
  'finish-and-hide',
  'none',
];

/** An activity indicator, its display chosen by buttons. */
const Displays: FunctionComponent = () => {
  const [display, setDisplay] = useState<ActivityIndicatorDisplay>('animate');

  return (
    <>
      <div className="kitchen-sink-showcase">
        <ActivityIndicator display={display}>Loading</ActivityIndicator>
      </div>
      <div className="kitchen-sink-showcase">
        {displays.map((value) => (
          <Button.Root
            key={value}
            size="small"
            variant={value === display ? 'bordered-prominent' : 'bordered'}
            onClick={() => setDisplay(value)}
          >
            <Button.Label>{value}</Button.Label>
          </Button.Root>
        ))}
      </div>
    </>
  );
};

const ProgressContent: FunctionComponent = () => (
  <List.Root>
    <Showcase
      isStacked
      title="Determinate"
    >
      {[0, 30, 70, 100].map((value) => (
        <Progress.Root
          key={value}
          value={value}
        >
          <Progress.Label>Downloading</Progress.Label>
          <Progress.Value />
          <Progress.Track>
            <Progress.Indicator />
          </Progress.Track>
        </Progress.Root>
      ))}
    </Showcase>
    <Showcase
      isStacked
      title="Indeterminate"
    >
      <Progress.Root value={null}>
        <Progress.Label>Preparing (synchronized)</Progress.Label>
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>
      <Progress.Root value={null}>
        <Progress.Label>Preparing (synchronized)</Progress.Label>
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>
      <Progress.Root
        synchronized={false}
        value={null}
      >
        <Progress.Label>Preparing (on its own)</Progress.Label>
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>
    </Showcase>
    <Showcase
      isStacked
      title="Tints"
    >
      {[
        'var(--color-ui-system-green)',
        'var(--color-ui-system-orange)',
        'var(--color-ui-system-pink)',
        'var(--color-ui-label)',
      ].map((tint) => (
        <Progress.Root
          key={tint}
          aria-label="Syncing"
          tint={tint}
          value={60}
        >
          <Progress.Track>
            <Progress.Indicator />
          </Progress.Track>
        </Progress.Root>
      ))}
    </Showcase>
    <Showcase
      isStacked
      title="Label Placement"
    >
      {placements.map((placement) => (
        <Progress.Root
          key={placement}
          value={40}
        >
          <Progress.Label placement={placement}>{placement}</Progress.Label>
          <Progress.Track>
            <Progress.Indicator />
          </Progress.Track>
        </Progress.Root>
      ))}
    </Showcase>
    <Showcase
      isStacked
      title="Value Placement"
    >
      {[...placements, 'tooltip', 'momentary-tooltip'].map((placement) => (
        <Progress.Root
          key={placement}
          value={40}
        >
          <Progress.Label>{placement}</Progress.Label>
          <Progress.Value
            placement={placement as ProgressPlacement | 'tooltip'}
          />
          <Progress.Track>
            <Progress.Indicator />
          </Progress.Track>
        </Progress.Root>
      ))}
    </Showcase>
    <Showcase
      isStacked
      title="Counting"
    >
      <Advancing />
    </Showcase>
    <Showcase title="Activity Indicator">
      {(['stepped', 'rotate', 'fade'] as const).map((movement) => (
        <ActivityIndicator
          key={movement}
          aria-label={movement}
          movement={movement}
        />
      ))}
      {(['stepped', 'rotate', 'fade'] as const).map((movement) => (
        <ActivityIndicator
          key={movement}
          aria-label={`${movement}, small`}
          movement={movement}
          size="small"
        />
      ))}
    </Showcase>
    <Showcase title="Colors and Speeds">
      <ActivityIndicator
        aria-label="Blue"
        color="var(--color-ui-system-blue)"
      />
      <ActivityIndicator
        aria-label="Red"
        color="var(--color-ui-system-red)"
      />
      <ActivityIndicator
        aria-label="Fast"
        duration={0.5}
      />
      <ActivityIndicator
        aria-label="Slow"
        duration={2}
      />
      <ActivityIndicator
        aria-label="On its own"
        synchronized={false}
      />
    </Showcase>
    <Showcase title="Labeled">
      <ActivityIndicator>Loading</ActivityIndicator>
      <ActivityIndicator size="small">Checking for Update</ActivityIndicator>
    </Showcase>
    <Showcase title="At Rest, Turned">
      {[0, 0.25, 0.5, 0.75].map((progress) => (
        <ActivityIndicator
          key={progress}
          aria-label={`${String(progress * 100)}%`}
          display="reset"
          progress={progress}
        />
      ))}
      {[0, 0.25, 0.5, 0.75].map((progress) => (
        <ActivityIndicator
          key={progress}
          aria-label={`${String(progress * 100)}%, rotating`}
          display="reset"
          movement="rotate"
          progress={progress}
        />
      ))}
    </Showcase>
    <Showcase
      isStacked
      title="Display"
    >
      <Displays />
    </Showcase>
    <Rows title="In Rows">
      <Row title="Software Update">
        <List.Detail>
          <ActivityIndicator
            aria-label="Checking for Update"
            size="small"
          />
        </List.Detail>
      </Row>
      <List.Item>
        <List.Span className="kitchen-sink-row-bar">
          <Progress.Root value={45}>
            <Progress.Label>Backup</Progress.Label>
            <Progress.Value />
            <Progress.Track>
              <Progress.Indicator />
            </Progress.Track>
          </Progress.Root>
        </List.Span>
      </List.Item>
    </Rows>
  </List.Root>
);

const counts = ['1', '9', '12', '99', '999+'];

const tints: readonly [tint: string | undefined, textColor?: string][] = [
  [undefined],
  ['var(--color-ui-system-blue)'],
  ['var(--color-ui-system-green)'],
  ['var(--color-ui-system-orange)'],
  ['var(--color-ui-system-gray)'],
  ['var(--color-ui-system-yellow)', '#000'],
];

const BadgeTrailing: FunctionComponent = () => (
  <Toolbar.Trailing>
    <Toolbar.Button
      aria-label="Mail, 12 unread"
      disabled={false}
      shape="circle"
    >
      <Button.Icon>
        <Symbol icon={sfEnvelopeFill}>
          <Badge placement="symbol">12</Badge>
        </Symbol>
      </Button.Icon>
    </Toolbar.Button>
  </Toolbar.Trailing>
);

const BadgeContent: FunctionComponent = () => (
  <List.Root>
    <Showcase title="On an Avatar">
      {counts.map((count) => (
        <Avatar.Root
          key={count}
          aria-label={`Jane Doe, ${count} unread`}
          size={50}
        >
          <Avatar.Fallback>JA</Avatar.Fallback>
          <Badge>{count}</Badge>
        </Avatar.Root>
      ))}
      <Avatar.Root
        aria-label="Kate Brown, unread"
        size={50}
      >
        <Avatar.Fallback>KB</Avatar.Fallback>
        <Badge />
      </Avatar.Root>
    </Showcase>
    <Showcase title="Tints">
      {tints.map(([tint, textColor]) => (
        <Avatar.Root
          key={tint ?? 'red'}
          aria-label="3 unread"
          size={50}
        >
          <Avatar.Fallback>AH</Avatar.Fallback>
          <Badge
            textColor={textColor}
            tint={tint}
          >
            3
          </Badge>
        </Avatar.Root>
      ))}
    </Showcase>
    <Showcase title="On a Symbol">
      {[sfBell, sfEnvelope, sfTray].map((icon, index) => (
        <Button.Root
          key={icon.sourceName ?? index}
          aria-label={`${counts[index] ?? ''} new`}
          disabled={false}
          shape="circle"
          variant={index === 0 ? 'borderless' : 'bordered'}
        >
          <Button.Icon>
            <Symbol icon={icon}>
              <Badge placement="symbol">{counts[index]}</Badge>
            </Symbol>
          </Button.Icon>
        </Button.Root>
      ))}
      <Button.Root
        aria-label="New"
        disabled={false}
        shape="circle"
        variant="glass"
      >
        <Button.Icon>
          <Symbol icon={sfBell}>
            <Badge placement="symbol" />
          </Symbol>
        </Button.Icon>
      </Button.Root>
    </Showcase>
    <Showcase title="Inline">
      {counts.map((count) => (
        <Badge
          key={count}
          placement="inline"
        >
          {count}
        </Badge>
      ))}
      <Badge
        placement="inline"
        tint="var(--color-ui-system-blue)"
      >
        New
      </Badge>
    </Showcase>
    <Rows title="In Rows">
      {(
        [
          ['Inbox', '12'],
          ['Updates', '1'],
          ['Archive', '999+'],
        ] as const
      ).map(([title, count]) => (
        <List.Item key={title}>
          <List.Content>
            <List.Title render={<button type="button" />}>{title}</List.Title>
          </List.Content>
          <List.Trailing>
            <List.Detail>
              <Badge placement="inline">{count}</Badge>
            </List.Detail>
          </List.Trailing>
          <List.Trailing>
            <List.DrillIn />
          </List.Trailing>
        </List.Item>
      ))}
    </Rows>
  </List.Root>
);

export const statusPages: SinkPages = {
  badge: { Content: BadgeContent, title: 'Badge', Trailing: BadgeTrailing },
  progress: { Content: ProgressContent, title: 'Progress' },
};
