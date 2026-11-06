import { FunctionComponent, useState } from 'react';

import {
  Button,
  type ColorScheme,
  forwardClick,
  List,
  Progress,
  RadioGroup,
  Segmented,
  Settings,
  type SettingsContrast,
  Switch,
  Symbol,
  type TextSize,
  Typography,
} from '../../components/index.js';
import { sfHeartFill, sfSquareAndArrowUp } from '../tooling/icons.js';
import { type SinkPages } from './shared.js';

// Foundations: Settings (its overrides, for what's within a provider).

/** A choice of a setting's: the system's (`undefined`), or an override. */
const ChoiceSection: FunctionComponent<{
  onChange: (value: string) => void;
  options: readonly (readonly [value: string, label: string])[];
  title: string;
  value: string;
}> = ({ onChange, options, title, value }) => (
  <List.Section>
    <List.Header>
      <List.Title>{title}</List.Title>
    </List.Header>
    <RadioGroup
      aria-label={title}
      render={<List.Group />}
      value={value}
      onValueChange={(next: unknown) => onChange(String(next))}
    >
      {options.map(([option, label]) => (
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
  </List.Section>
);

/** A switch's row (its setting on, off, or the system's: `undefined`). */
const ToggleRow: FunctionComponent<{
  onChange: (value: boolean) => void;
  title: string;
  value: boolean;
}> = ({ onChange, title, value }) => (
  <List.Item onClick={forwardClick('[role=switch]')}>
    <List.Content>
      <List.Title>{title}</List.Title>
    </List.Content>
    <List.Trailing>
      <Switch.Root
        aria-label={title}
        checked={value}
        onCheckedChange={(next: boolean) => onChange(next)}
      >
        <Switch.Thumb />
      </Switch.Root>
    </List.Trailing>
  </List.Item>
);

const system = 'system';

const SettingsContent: FunctionComponent = () => {
  const [colorScheme, setColorScheme] = useState(system);
  const [contrast, setContrast] = useState(system);
  const [textSize, setTextSize] = useState(system);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [reducedTransparency, setReducedTransparency] = useState(false);
  const [differentiate, setDifferentiate] = useState(false);

  return (
    <>
      <List.Root>
        <ChoiceSection
          title="Color Scheme"
          value={colorScheme}
          options={[
            [system, 'System'],
            ['light', 'Light'],
            ['dark', 'Dark'],
          ]}
          onChange={setColorScheme}
        />
        <ChoiceSection
          title="Contrast"
          value={contrast}
          options={[
            [system, 'System'],
            ['standard', 'Standard'],
            ['more', 'More'],
          ]}
          onChange={setContrast}
        />
        <ChoiceSection
          title="Text Size"
          value={textSize}
          options={[
            [system, 'Default'],
            ['small', 'Small'],
            ['xLarge', 'Extra Large'],
            ['ax2', 'Accessibility 2'],
          ]}
          onChange={setTextSize}
        />
        <List.Section>
          <List.Header>
            <List.Title>Overrides (On), or the System’s (Off)</List.Title>
          </List.Header>
          <List.Group>
            <ToggleRow
              title="Reduce Motion"
              value={reducedMotion}
              onChange={setReducedMotion}
            />
            <ToggleRow
              title="Reduce Transparency"
              value={reducedTransparency}
              onChange={setReducedTransparency}
            />
            <ToggleRow
              title="Differentiate Without Color"
              value={differentiate}
              onChange={setDifferentiate}
            />
          </List.Group>
        </List.Section>

        <List.Section>
          <List.Header>
            <List.Title>Within the Provider</List.Title>
          </List.Header>
        </List.Section>
      </List.Root>
      <Settings.Provider
        render={<div className="kitchen-sink-settings" />}
        {...(colorScheme === system
          ? {}
          : { colorScheme: colorScheme as ColorScheme })}
        {...(contrast === system
          ? {}
          : { contrast: contrast as SettingsContrast })}
        {...(textSize === system ? {} : { textSize: textSize as TextSize })}
        {...(reducedMotion ? { reducedMotion } : {})}
        {...(reducedTransparency ? { reducedTransparency } : {})}
        {...(differentiate ? { differentiateWithoutColor: differentiate } : {})}
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
                    style={{ backgroundColor: 'var(--color-ui-system-red)' }}
                    variant="rounded"
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
    </>
  );
};

export const foundationsPages: SinkPages = {
  settings: { Content: SettingsContent, title: 'Settings' },
};
