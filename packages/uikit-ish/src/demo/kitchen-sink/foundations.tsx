import { FunctionComponent, useContext, useState } from 'react';

import {
  Button,
  Collapsible,
  forwardClick,
  List,
  Progress,
  RadioGroup,
  Segmented,
  Settings,
  type SettingsValues,
  Switch,
  Symbol,
  Typography,
} from '../../components/index.js';
import { sfHeartFill, sfSquareAndArrowUp } from '../tooling/icons.js';
import { type SinkPages, SinkSettingsContext } from './shared.js';

// Foundations: Settings (the kitchen sink's, overriding the system's; a
// nested provider's, overriding those).

/** A setting's choice: its options, besides the system's (and inherited). */
type Choice = {
  key: keyof SettingsValues;
  /** Not honored by the library yet: why (a note below it). */
  note?: string;
  options: readonly (readonly [value: string, label: string])[];
  title: string;
};

const notYet =
  'The library doesn’t follow this one yet. Its components follow the system’s setting instead.';

const onOff = [
  ['on', 'On'],
  ['off', 'Off'],
] as const;

const choices: readonly Choice[] = [
  {
    key: 'colorScheme',
    options: [
      ['light', 'Light'],
      ['dark', 'Dark'],
    ],
    title: 'Color Scheme',
  },
  {
    key: 'contrast',
    note: notYet,
    options: [
      ['standard', 'Standard'],
      ['more', 'More'],
    ],
    title: 'Contrast',
  },
  {
    key: 'textSize',
    note: 'The library doesn’t follow this one yet. Typography takes its text size as a prop of its own (textSize).',
    options: [
      ['small', 'Small'],
      ['xLarge', 'Extra Large'],
      ['ax2', 'Accessibility 2'],
    ],
    title: 'Text Size',
  },
  {
    key: 'reducedMotion',
    note: notYet,
    options: onOff,
    title: 'Reduce Motion',
  },
  {
    key: 'reducedTransparency',
    note: notYet,
    options: onOff,
    title: 'Reduce Transparency',
  },
  {
    key: 'differentiateWithoutColor',
    note: notYet,
    options: onOff,
    title: 'Differentiate Without Color',
  },
];

const system = 'system';
const inherited = 'inherited';

/** A setting's value as its option (`on`/`off` for a boolean). */
const optionOf = (value: unknown) => {
  if (typeof value !== 'boolean') return String(value);
  return value ? 'on' : 'off';
};

/** A setting's option: its own (as `undefined`, the system's), or none. */
const chosen = (
  settings: Partial<SettingsValues>,
  key: keyof SettingsValues,
  isNested: boolean,
) => {
  if (!Object.hasOwn(settings, key)) return isNested ? inherited : system;
  return settings[key] === undefined ? system : optionOf(settings[key]);
};

/** An option as its setting's value. */
const valueOf = (option: string): unknown =>
  option === 'on' || option === 'off' ? option === 'on' : option;

/**
 * Settings' choices: each the system's, an override, or (`isNested`)
 * inherited from the provider around it (left out); a key given as
 * `undefined`, reset to the system's.
 */
const ChoiceSections: FunctionComponent<{
  isNested?: boolean;
  onChange: (next: Partial<SettingsValues>) => void;
  settings: Partial<SettingsValues>;
}> = ({ isNested = false, onChange, settings }) =>
  choices.map(({ key, note, options, title }) => {
    const value = chosen(settings, key, isNested);
    const all = [
      ...(isNested ? [[inherited, 'Inherited'] as const] : []),
      [system, 'System'] as const,
      ...options,
    ];
    const choose = (option: string) => {
      const { [key]: _, ...rest } = settings;
      if (option === inherited || (option === system && !isNested)) {
        onChange(rest);
        return;
      }
      onChange({
        ...rest,
        [key]: option === system ? undefined : valueOf(option),
      });
    };

    return (
      <List.Section key={key}>
        <List.Header>
          <List.Title>{title}</List.Title>
        </List.Header>
        <RadioGroup
          aria-label={title}
          render={<List.Group />}
          value={value}
          onValueChange={(next: unknown) => choose(String(next))}
        >
          {all.map(([option, label]) => (
            <List.Item
              key={option}
              onClick={forwardClick('[role=radio]')}
            >
              <List.Leading>
                <List.Radio
                  aria-label={label}
                  value={option}
                />
              </List.Leading>
              <List.Content>
                <List.Title>{label}</List.Title>
              </List.Content>
            </List.Item>
          ))}
        </RadioGroup>
        {note === undefined ? null : <List.Footer>{note}</List.Footer>}
      </List.Section>
    );
  });

/**
 * The kitchen sink's settings (for all of it), and a nested provider's
 * (overriding those, for its samples).
 */
const SettingsContent: FunctionComponent = () => {
  const [settings, setSettings] = useContext(SinkSettingsContext);
  const [nested, setNested] = useState<Partial<SettingsValues>>({});

  return (
    <>
      <List.Root>
        <ChoiceSections
          settings={settings}
          onChange={setSettings}
        />
      </List.Root>
      <Collapsible.Root>
        <List.Root>
          <List.Section>
            <Collapsible.Trigger
              nativeButton={false}
              render={<List.Header />}
            >
              <List.Title>A Nested Provider (Overriding These)</List.Title>
              <List.Disclosure />
            </Collapsible.Trigger>
          </List.Section>
        </List.Root>
        <Collapsible.Panel>
          <List.Root>
            <ChoiceSections
              isNested
              settings={nested}
              onChange={setNested}
            />
          </List.Root>
          <Settings.Provider
            render={<div className="kitchen-sink-settings" />}
            {...nested}
          >
            <List.Root>
              <List.Section>
                <List.Block strong>
                  <div className="kitchen-sink-stacked">
                    <Typography textStyle="title2">Title 2</Typography>
                    <Typography
                      color="secondary"
                      textStyle="body"
                    >
                      Body text in the secondary label color.
                    </Typography>
                    <div className="kitchen-sink-showcase">
                      <Button.Root
                        disabled={false}
                        variant="bordered-prominent"
                      >
                        <Button.Label>Prominent</Button.Label>
                      </Button.Root>
                      <Button.Root
                        disabled={false}
                        variant="bordered"
                      >
                        <Button.Label>Bordered</Button.Label>
                      </Button.Root>
                      <Button.Root
                        aria-label="Share"
                        disabled={false}
                        shape="circle"
                        variant="glass"
                      >
                        <Button.Icon>
                          <Symbol icon={sfSquareAndArrowUp} />
                        </Button.Icon>
                      </Button.Root>
                    </div>
                    <Progress.Root value={null}>
                      <Progress.Label>Syncing</Progress.Label>
                      <Progress.Track>
                        <Progress.Indicator />
                      </Progress.Track>
                    </Progress.Root>
                    <Segmented.Root
                      aria-label="Period"
                      defaultValue="w"
                    >
                      <Segmented.Item value="d">Day</Segmented.Item>
                      <Segmented.Item value="w">Week</Segmented.Item>
                      <Segmented.Item value="m">Month</Segmented.Item>
                      <Segmented.Highlight />
                    </Segmented.Root>
                  </div>
                </List.Block>
              </List.Section>
              <List.Section>
                <List.Group>
                  <List.Item onClick={forwardClick('[role=switch]')}>
                    <List.Leading>
                      <List.Image
                        variant="rounded"
                        style={{
                          backgroundColor: 'var(--color-ui-system-red)',
                        }}
                      >
                        <Symbol icon={sfHeartFill} />
                      </List.Image>
                    </List.Leading>
                    <List.Content>
                      <List.Title>Favorites</List.Title>
                      <List.Subtitle>
                        A switch: its labels with color off
                      </List.Subtitle>
                    </List.Content>
                    <List.Trailing>
                      <Switch.Root
                        defaultChecked
                        aria-label="Favorites"
                      >
                        <Switch.Thumb />
                      </Switch.Root>
                    </List.Trailing>
                  </List.Item>
                </List.Group>
              </List.Section>
            </List.Root>
          </Settings.Provider>
        </Collapsible.Panel>
      </Collapsible.Root>
    </>
  );
};

export const foundationsPages: SinkPages = {
  settings: { Content: SettingsContent, title: 'Settings' },
};
