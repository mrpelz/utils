import { FunctionComponent, useContext, useMemo, useState } from 'react';

import {
  Alert,
  Button,
  Collapsible,
  DatePicker,
  forwardClick,
  List,
  Menu,
  Progress,
  RadioGroup,
  refreshSettings,
  Segmented,
  Settings,
  type SettingsValues,
  Stack,
  Switch,
  Symbol,
  TextField,
  Typography,
  useLanguage,
  useSettings,
} from '../../components/index.js';
import { sfHeartFill, sfSquareAndArrowUp } from '../tooling/icons.js';
import { publicUrl } from '../tooling/public-url.js';
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
    options: [
      ['standard', 'Standard'],
      ['more', 'More'],
    ],
    title: 'Contrast',
  },
  {
    key: 'textSize',
    note: 'System: the system’s, where the browser tells it (Safari), else Large. Text in lists, menus, alerts, fields and buttons grows with it, and rows with their text; bar titles grow up to Extra Extra Large; tab bars, toolbars, segmented controls, steppers, rolls, cards and a calendar’s days keep their size. Typography’s own textSize wins.',
    options: [
      ['xSmall', 'Extra Small'],
      ['small', 'Small'],
      ['medium', 'Medium'],
      ['large', 'Large'],
      ['xLarge', 'Extra Large'],
      ['xxLarge', 'Extra Extra Large'],
      ['xxxLarge', 'Extra Extra Extra Large'],
      ['ax1', 'Accessibility 1'],
      ['ax2', 'Accessibility 2'],
      ['ax3', 'Accessibility 3'],
      ['ax4', 'Accessibility 4'],
      ['ax5', 'Accessibility 5'],
    ],
    title: 'Text Size',
  },
  {
    key: 'boldText',
    note: 'Every weight one step heavier: regular text becomes semibold. No system signal on the web: off unless chosen.',
    options: onOff,
    title: 'Bold Text',
  },
  {
    key: 'reducedMotion',
    note: 'Everything that would animate changes at once. What you drag with your finger still follows it, and a page you swipe back finishes its slide when you let go.',
    options: onOff,
    title: 'Reduce Motion',
  },
  {
    key: 'reducedTransparency',
    options: onOff,
    title: 'Reduce Transparency',
  },
  {
    key: 'differentiateWithoutColor',
    note: 'Switches show on/off labels, errors an exclamation mark, today in the calendar is bold, text highlights get a dot, and links in text are underlined.',
    options: onOff,
    title: 'Differentiate Without Color',
  },
  {
    key: 'languages',
    note: 'Ranked, for choosing translations (see Translation below). System: the browser’s (Safari reports only the first). Dates and numbers use the first one with the region.',
    options: [
      ['en-GB,de', 'English (UK), German'],
      ['en-US,de', 'English (US), German'],
      ['de-DE,en', 'German, English'],
      ['ja', 'Japanese'],
    ],
    title: 'Languages',
  },
  {
    key: 'region',
    note: 'System: guessed from the time zone, which wins over a language’s own region (English (UK) in Germany formats as in Germany). The formatting locale is the first language with this region.',
    options: [
      ['US', 'United States'],
      ['DE', 'Germany'],
      ['JP', 'Japan'],
    ],
    title: 'Region',
  },
];

/** A fixed moment for the samples: 5 February 2026, 3:30 PM. */
const sampleDate = new Date(2026, 1, 5, 15, 30);

/** The week's first day in a locale (0: Sunday), where `Intl` knows it. */
const weekStart = (locale: string) => {
  const info = new Intl.Locale(locale) as Intl.Locale & {
    getWeekInfo?: () => { firstDay: number };
    weekInfo?: { firstDay: number };
  };
  return (info.getWeekInfo?.() ?? info.weekInfo)?.firstDay;
};

/**
 * The locale where it's rendered, and what follows it: numbers, dates,
 * times, the week's first day, and a date picker.
 */
/** An example app's translations (see `LocaleSamples`' Translation). */
const translations = ['en-US', 'en-GB', 'de'] as const;

const LocaleSamples: FunctionComponent = () => {
  const { languages, locale, region } = useSettings();
  // (The example app's translation, for the preferred languages.)
  const translation = useLanguage(translations);
  const rows = useMemo(() => {
    const firstDay = weekStart(locale);
    return [
      ['Languages', languages.join(', ')],
      ['Translation (of en-US, en-GB, de)', translation ?? 'None'],
      ['Formatting Locale', locale],
      ['Region', region ?? 'None'],
      ['Number', new Intl.NumberFormat(locale).format(1_234_567.89)],
      [
        'Date',
        new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(
          sampleDate,
        ),
      ],
      [
        'Time',
        new Intl.DateTimeFormat(locale, { timeStyle: 'short' }).format(
          sampleDate,
        ),
      ],
      [
        'Week Starts On',
        firstDay === undefined
          ? 'Unknown'
          : new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(
              // (February 2026 starts on a Sunday; `firstDay` 7 is Sunday.)
              new Date(2026, 1, 1 + (firstDay % 7)),
            ),
      ],
    ] as const;
  }, [languages, locale, region, translation]);

  return (
    <List.Group>
      {rows.map(([title, value]) => (
        <List.Item key={title}>
          <List.Content>
            <List.Title>{title}</List.Title>
          </List.Content>
          <List.Trailing>
            <List.Detail>{value}</List.Detail>
          </List.Trailing>
        </List.Item>
      ))}
      <List.Item>
        <List.Content>
          <List.Title>Date Picker</List.Title>
        </List.Content>
        <List.Trailing>
          <DatePicker.Root
            defaultValue={sampleDate}
            mode="dateAndTime"
            popoverAlign="end"
          />
        </List.Trailing>
      </List.Item>
    </List.Group>
  );
};

const system = 'system';
const inherited = 'inherited';

/** A setting's value as its option (`on`/`off` for a boolean). */
const optionOf = (value: unknown) => {
  // (A list, e.g. the languages: its entries, comma-separated.)
  if (Array.isArray(value)) return value.join(',');
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
const valueOf = (key: keyof SettingsValues, option: string): unknown => {
  if (key === 'languages') return option.split(',');
  return option === 'on' || option === 'off' ? option === 'on' : option;
};

/** A setting's value, as its option's label (else as it is). */
const labelOf = (
  options: Choice['options'],
  value: SettingsValues[keyof SettingsValues] | undefined,
) => {
  if (value === undefined) return 'None';
  const option = optionOf(value);
  if (option === 'on') return 'On';
  return option === 'off'
    ? 'Off'
    : (options.find(([candidate]) => candidate === option)?.[1] ??
        option.replaceAll(',', ', '));
};

/**
 * Settings' choices: each the system's, an override, or (`isNested`)
 * inherited from the provider around it (left out); a key given as
 * `undefined`, reset to the system's. At each one's heading, the value
 * it falls back to (`shown`): the system's, as the browser reports it,
 * or (nested) the one inherited.
 */
const ChoiceSections: FunctionComponent<{
  isNested?: boolean;
  onChange: (next: Partial<SettingsValues>) => void;
  settings: Partial<SettingsValues>;
  shown: SettingsValues | undefined;
}> = ({ isNested = false, onChange, settings, shown }) =>
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
        [key]: option === system ? undefined : valueOf(key, option),
      });
    };

    return (
      <List.Section key={key}>
        <List.Header>
          <List.Title>{title}</List.Title>
          {shown === undefined ? null : (
            <List.Detail>
              {isNested ? 'Inherited' : 'System'}:{' '}
              {labelOf(options, shown[key])}
            </List.Detail>
          )}
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
  const [settings, setSettings, systemValues] = useContext(SinkSettingsContext);
  const [nested, setNested] = useState<Partial<SettingsValues>>({});
  // (Here, within the kitchen sink's provider: what the nested one
  // inherits.)
  const inheritedValues = useSettings();

  return (
    <>
      <List.Root>
        <ChoiceSections
          settings={settings}
          shown={systemValues}
          onChange={setSettings}
        />
        <List.Section>
          <List.Header>
            <List.Title>Dates and Numbers</List.Title>
          </List.Header>
          <LocaleSamples />
        </List.Section>
        <List.Section>
          <List.Group>
            <List.Item>
              <List.Content>
                <List.Button onClick={refreshSettings}>
                  Read the Time Zone and Text Size Again
                </List.Button>
              </List.Content>
            </List.Item>
          </List.Group>
          <List.Footer>
            The time zone and the text size send no event when they change. The
            kitchen sink reads them again whenever it comes back to the
            foreground, and this button does it right away.
          </List.Footer>
        </List.Section>
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
              shown={inheritedValues}
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
                  <Stack>
                    <Typography textStyle="title2">Title 2</Typography>
                    <Typography
                      color="secondary"
                      textStyle="body"
                    >
                      Body text in the secondary label color.
                    </Typography>
                    <Stack
                      wrap
                      align="center"
                      axis="horizontal"
                    >
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
                    </Stack>
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
                  </Stack>
                </List.Block>
              </List.Section>
              <List.Section>
                <List.Header>
                  <List.Title>Dates and Numbers</List.Title>
                </List.Header>
                <LocaleSamples />
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
                        A switch: its labels without color alone
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
                  <TextField.Root
                    invalid
                    render={<List.Item />}
                  >
                    <List.Content>
                      <TextField.Label>Email</TextField.Label>
                    </List.Content>
                    <List.Trailing>
                      <TextField.Control defaultValue="kate@" />
                    </List.Trailing>
                    <List.Below>
                      <TextField.Error match>
                        Enter a whole email address.
                      </TextField.Error>
                    </List.Below>
                  </TextField.Root>
                </List.Group>
                <List.Footer>
                  A link in text:{' '}
                  <a href={publicUrl('settings')}>the Settings guide</a>.
                </List.Footer>
              </List.Section>
              <List.Section>
                <List.Group>
                  <List.Item>
                    <List.Content>
                      <List.Title>A Menu</List.Title>
                    </List.Content>
                    <List.Trailing>
                      <Menu.Root>
                        <Menu.Trigger render={<Button.Root />}>
                          <Button.Label>Options</Button.Label>
                        </Menu.Trigger>
                        <Menu.Portal>
                          <Menu.Positioner align="end">
                            <Menu.Popup>
                              <Menu.Item>
                                <Menu.Label>Duplicate</Menu.Label>
                              </Menu.Item>
                              <Menu.Item>
                                <Menu.Label>Move</Menu.Label>
                                <Menu.Subtitle>To another folder</Menu.Subtitle>
                              </Menu.Item>
                            </Menu.Popup>
                          </Menu.Positioner>
                        </Menu.Portal>
                      </Menu.Root>
                    </List.Trailing>
                  </List.Item>
                  <List.Item>
                    <List.Content>
                      <List.Title>An Alert</List.Title>
                    </List.Content>
                    <List.Trailing>
                      <Alert.Root>
                        <Alert.Trigger render={<Button.Root />}>
                          <Button.Label>Rename</Button.Label>
                        </Alert.Trigger>
                        <Alert.Popup>
                          <Alert.Header>
                            <Alert.Title>Rename Folder</Alert.Title>
                            <Alert.Description>
                              Enter a name for this folder.
                            </Alert.Description>
                          </Alert.Header>
                          <Alert.Fields>
                            <Alert.Field
                              aria-label="Name"
                              defaultValue="Projects"
                            />
                          </Alert.Fields>
                          <Alert.Actions>
                            <Alert.Action>Cancel</Alert.Action>
                            <Alert.Action variant="primary">Save</Alert.Action>
                          </Alert.Actions>
                        </Alert.Popup>
                      </Alert.Root>
                    </List.Trailing>
                  </List.Item>
                </List.Group>
                <List.Footer>
                  Their popups open outside this provider (portals), at its
                  settings all the same.
                </List.Footer>
              </List.Section>
              <List.Section>
                <List.Group>
                  <List.Item>
                    <List.Span>
                      <DatePicker.Root
                        pickerStyle="inline"
                        highlighted={(date: Date) =>
                          date.getDate() === 12 ? { style: 'text' } : undefined
                        }
                      />
                    </List.Span>
                  </List.Item>
                </List.Group>
                <List.Footer>
                  Today, and the 12th highlighted in the tint.
                </List.Footer>
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
