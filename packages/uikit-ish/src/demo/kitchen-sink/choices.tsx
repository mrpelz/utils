import { FunctionComponent, ReactNode, useState } from 'react';

import {
  Button,
  type CalendarFooter,
  Checkbox,
  CheckboxGroup,
  ColorPicker,
  DatePicker,
  Field,
  Fieldset,
  Form,
  forwardClick,
  List,
  Popover,
  Radio,
  RadioGroup,
  Roll,
  type RollValue,
  Segmented,
  Sheet,
  Slider,
  Stepper,
  Switch,
  Symbol,
  TextField,
  Toolbar,
  useCreateDatePickerHandle,
  useSizeClass,
  Viewport,
} from '../../components/index.js';
import { modesControl, panelParts } from '../docs/color-picker/panel.js';
import {
  sfBold,
  sfEyedropper,
  sfItalic,
  sfListBullet,
  sfMagnifyingglass,
  sfPaintpalette,
  sfPhoto,
  sfSunMax,
  sfSunMin,
  sfUnderline,
  sfXmark,
} from '../tooling/icons.js';
import { DrillRow, Row, Rows, Showcase, type SinkPages } from './shared.js';

// Choices & Input: Form, Date Picker, Color Picker, Roll, Text Field,
// Segmented, Slider, Stepper, Switch, Checkbox.

/** A row whose single control takes its clicks (see `forwardClick`). */
const ControlRow: FunctionComponent<{
  children: ReactNode;
  selector: string;
  subtitle?: string;
  title: string;
}> = ({ children, selector, subtitle, title }) => (
  <List.Item onClick={forwardClick(selector)}>
    <List.Content>
      <List.Title>{title}</List.Title>
      {subtitle === undefined ? null : (
        <List.Subtitle>{subtitle}</List.Subtitle>
      )}
    </List.Content>
    <List.Trailing>{children}</List.Trailing>
  </List.Item>
);

const tints = [
  'var(--color-ui-system-blue)',
  'var(--color-ui-system-orange)',
  'var(--color-ui-system-pink)',
  'var(--color-ui-system-purple)',
];

const SwitchContent: FunctionComponent = () => (
  <List.Root>
    <Showcase title="States">
      <Switch.Root aria-label="Off">
        <Switch.Thumb />
      </Switch.Root>
      <Switch.Root
        defaultChecked
        aria-label="On"
      >
        <Switch.Thumb />
      </Switch.Root>
      <Switch.Root
        indeterminate
        aria-label="Mixed"
      >
        <Switch.Thumb />
      </Switch.Root>
      <Switch.Root
        disabled
        aria-label="Off, disabled"
      >
        <Switch.Thumb />
      </Switch.Root>
      <Switch.Root
        defaultChecked
        disabled
        aria-label="On, disabled"
      >
        <Switch.Thumb />
      </Switch.Root>
    </Showcase>
    <Showcase title="On/Off Labels">
      <Switch.Root
        aria-label="Off, labeled"
        onOffLabels
      >
        <Switch.Thumb />
      </Switch.Root>
      <Switch.Root
        defaultChecked
        aria-label="On, labeled"
        onOffLabels
      >
        <Switch.Thumb />
      </Switch.Root>
    </Showcase>
    <Showcase title="Tints">
      {tints.map((tint) => (
        <Switch.Root
          key={tint}
          defaultChecked
          aria-label={tint}
          tint={tint}
        >
          <Switch.Thumb />
        </Switch.Root>
      ))}
    </Showcase>
    <Rows title="In Rows">
      {(
        [
          ['Airplane Mode', false],
          ['Wi-Fi', true],
          ['Bluetooth', true],
        ] as const
      ).map(([title, isOn]) => (
        <ControlRow
          key={title}
          selector="[role=switch]"
          title={title}
        >
          <Switch.Root
            aria-label={title}
            defaultChecked={isOn}
          >
            <Switch.Thumb />
          </Switch.Root>
        </ControlRow>
      ))}
      <ControlRow
        selector="[role=switch]"
        subtitle="Disabled"
        title="Personal Hotspot"
      >
        <Switch.Root
          disabled
          aria-label="Personal Hotspot"
        >
          <Switch.Thumb />
        </Switch.Root>
      </ControlRow>
    </Rows>
  </List.Root>
);

const CheckboxContent: FunctionComponent = () => (
  <List.Root>
    <Showcase title="Checkbox">
      <Checkbox.Root aria-label="Unchecked" />
      <Checkbox.Root
        defaultChecked
        aria-label="Checked"
      />
      <Checkbox.Root
        indeterminate
        aria-label="Mixed"
      />
      <Checkbox.Root
        disabled
        aria-label="Unchecked, disabled"
      />
      <Checkbox.Root
        defaultChecked
        disabled
        aria-label="Checked, disabled"
      />
    </Showcase>
    <Showcase title="Radio">
      <RadioGroup
        aria-label="Size"
        className="kitchen-sink-showcase"
        defaultValue="m"
      >
        <Radio.Root
          aria-label="Small"
          value="s"
        />
        <Radio.Root
          aria-label="Medium"
          value="m"
        />
        <Radio.Root
          aria-label="Large"
          value="l"
        />
        <Radio.Root
          disabled
          aria-label="Extra large, disabled"
          value="xl"
        />
      </RadioGroup>
    </Showcase>
    <List.Section>
      <List.Header>
        <List.Title>Checkbox Rows, a Parent</List.Title>
      </List.Header>
      <CheckboxGroup
        allValues={['messages', 'mentions', 'reminders']}
        defaultValue={['mentions']}
        render={<List.Group />}
      >
        <List.Item onClick={forwardClick('[role=checkbox]')}>
          <List.Leading>
            <List.Checkbox
              parent
              aria-label="All"
            />
          </List.Leading>
          <List.Content>
            <List.Title>All</List.Title>
          </List.Content>
        </List.Item>
        {(
          [
            ['messages', 'Messages'],
            ['mentions', 'Mentions'],
            ['reminders', 'Reminders'],
          ] as const
        ).map(([value, title]) => (
          <List.Item
            key={value}
            level={1}
            onClick={forwardClick('[role=checkbox]')}
          >
            <List.Leading>
              <List.Checkbox
                aria-label={title}
                value={value}
              />
            </List.Leading>
            <List.Content>
              <List.Title>{title}</List.Title>
            </List.Content>
          </List.Item>
        ))}
      </CheckboxGroup>
    </List.Section>
    <List.Section>
      <List.Header>
        <List.Title>Radio Rows</List.Title>
      </List.Header>
      <RadioGroup
        aria-label="Default account"
        defaultValue="icloud"
        render={<List.Group />}
      >
        {(
          [
            ['icloud', 'iCloud'],
            ['work', 'Work'],
            ['home', 'Home'],
          ] as const
        ).map(([value, title]) => (
          <List.Item
            key={value}
            onClick={forwardClick('[role=radio]')}
          >
            <List.Leading>
              <List.Radio
                aria-label={title}
                value={value}
              />
            </List.Leading>
            <List.Content>
              <List.Title>{title}</List.Title>
            </List.Content>
          </List.Item>
        ))}
      </RadioGroup>
    </List.Section>
  </List.Root>
);

/** A stepper and its value, shown beside it (it shows none). */
const CountedStepper: FunctionComponent<{
  defaultValue: number;
  disabled?: boolean;
  label: string;
  max?: number;
  min?: number;
  step?: number;
}> = ({ defaultValue, disabled, label, max, min, step }) => {
  const [value, setValue] = useState<number | null>(defaultValue);

  return (
    <>
      <List.Detail className="kitchen-sink-value">{value ?? '–'}</List.Detail>
      <Stepper.Root
        disabled={disabled}
        max={max}
        min={min}
        step={step}
        value={value}
        onValueChange={(next: number | null) => setValue(next)}
      >
        <Stepper.Group>
          <Stepper.Input aria-label={label} />
          <Stepper.Decrement />
          <Stepper.Increment />
        </Stepper.Group>
      </Stepper.Root>
    </>
  );
};

const StepperContent: FunctionComponent = () => (
  <List.Root>
    <Rows title="In Rows">
      <Row title="Quantity">
        <CountedStepper
          defaultValue={1}
          label="Quantity"
        />
      </Row>
      <Row
        subtitle="0 to 3: at an end, its button disabled"
        title="Guests"
      >
        <CountedStepper
          defaultValue={0}
          label="Guests"
          max={3}
          min={0}
        />
      </Row>
      <Row
        subtitle="By 5"
        title="Minutes"
      >
        <CountedStepper
          defaultValue={15}
          label="Minutes"
          min={0}
          step={5}
        />
      </Row>
      <Row
        subtitle="Disabled"
        title="Copies"
      >
        <CountedStepper
          disabled
          defaultValue={2}
          label="Copies"
        />
      </Row>
    </Rows>
  </List.Root>
);

/** A slider's control: its track, its fill, its thumbs (one per value). */
const SliderControl: FunctionComponent<{ labels: readonly string[] }> = ({
  labels,
}) => (
  <Slider.Control>
    <Slider.Track>
      <Slider.Indicator />
      {labels.map((label, index) => (
        <Slider.Thumb
          key={label}
          aria-label={label}
          index={labels.length > 1 ? index : undefined}
        />
      ))}
    </Slider.Track>
  </Slider.Control>
);

const placements = [
  'block-start',
  'block-end',
  'inline-start',
  'inline-end',
] as const;

const SliderContent: FunctionComponent = () => (
  <List.Root>
    <Showcase
      isStacked
      title="Slider"
    >
      <Slider.Root defaultValue={40}>
        <SliderControl labels={['Volume']} />
      </Slider.Root>
      <Slider.Root
        defaultValue={70}
        tint="var(--color-ui-system-orange)"
      >
        <SliderControl labels={['Tinted']} />
      </Slider.Root>
      <Slider.Root
        disabled
        defaultValue={30}
      >
        <SliderControl labels={['Disabled']} />
      </Slider.Root>
    </Showcase>
    <Showcase
      isStacked
      title="Symbols"
    >
      <Slider.Root defaultValue={60}>
        <Slider.Symbol edge="min">
          <Symbol icon={sfSunMin} />
        </Slider.Symbol>
        <SliderControl labels={['Brightness']} />
        <Slider.Symbol edge="max">
          <Symbol icon={sfSunMax} />
        </Slider.Symbol>
      </Slider.Root>
    </Showcase>
    <Showcase
      isStacked
      title="Ticks"
    >
      <Slider.Root
        defaultValue={2}
        max={4}
        min={0}
        step={1}
      >
        <Slider.Ticks count={5} />
        <SliderControl labels={['Text size']} />
      </Slider.Root>
    </Showcase>
    <Showcase
      isStacked
      title="Range"
    >
      <Slider.Root defaultValue={[20, 80]}>
        <Slider.Label placement="block-start">Price</Slider.Label>
        <Slider.Value placement="block-start" />
        <SliderControl labels={['Minimum price', 'Maximum price']} />
      </Slider.Root>
    </Showcase>
    <Showcase
      isStacked
      title="Label and Value Placement"
    >
      {placements.map((placement) => (
        <Slider.Root
          key={placement}
          defaultValue={50}
        >
          <Slider.Label placement={placement}>{placement}</Slider.Label>
          <Slider.Value placement={placement} />
          <SliderControl labels={[placement]} />
        </Slider.Root>
      ))}
      {(['tooltip', 'momentary-tooltip'] as const).map((placement) => (
        <Slider.Root
          key={placement}
          defaultValue={50}
        >
          <Slider.Label placement="block-start">{placement}</Slider.Label>
          <Slider.Value placement={placement} />
          <SliderControl labels={[placement]} />
        </Slider.Root>
      ))}
      <Slider.Root
        defaultValue={1}
        max={2}
        min={0.5}
        step={0.25}
      >
        <Slider.Label placement="inline-start">Speed</Slider.Label>
        <SliderControl labels={['Speed']} />
        <Slider.Value placement="inline-end">
          {(formattedValues: readonly string[]) => `${formattedValues[0]}×`}
        </Slider.Value>
      </Slider.Root>
    </Showcase>
    <Rows title="In a Row">
      <List.Item>
        <List.Span>
          <Slider.Root defaultValue={60}>
            <Slider.Symbol edge="min">
              <Symbol icon={sfSunMin} />
            </Slider.Symbol>
            <SliderControl labels={['Brightness']} />
            <Slider.Symbol edge="max">
              <Symbol icon={sfSunMax} />
            </Slider.Symbol>
          </Slider.Root>
        </List.Span>
      </List.Item>
    </Rows>
  </List.Root>
);

const periods = [
  ['d', 'Day'],
  ['w', 'Week'],
  ['m', 'Month'],
  ['y', 'Year'],
] as const;

const SegmentedContent: FunctionComponent = () => (
  <List.Root>
    <Showcase
      isStacked
      title="Segmented"
    >
      <Segmented.Root
        aria-label="Two"
        defaultValue="list"
      >
        <Segmented.Item value="list">List</Segmented.Item>
        <Segmented.Item value="grid">Grid</Segmented.Item>
        <Segmented.Highlight />
      </Segmented.Root>
      <Segmented.Root
        aria-label="Period"
        defaultValue="w"
      >
        {periods.map(([value, label]) => (
          <Segmented.Item
            key={value}
            value={value}
          >
            {label}
          </Segmented.Item>
        ))}
        <Segmented.Highlight />
      </Segmented.Root>
      <Segmented.Root
        hideSeparators
        aria-label="Period, no separators"
        defaultValue="m"
      >
        {periods.map(([value, label]) => (
          <Segmented.Item
            key={value}
            value={value}
          >
            {label}
          </Segmented.Item>
        ))}
        <Segmented.Highlight />
      </Segmented.Root>
      <Segmented.Root
        aria-label="Period, one disabled"
        defaultValue="d"
      >
        {periods.map(([value, label]) => (
          <Segmented.Item
            key={value}
            disabled={value === 'y'}
            value={value}
          >
            {label}
          </Segmented.Item>
        ))}
        <Segmented.Highlight />
      </Segmented.Root>
      <Segmented.Root
        disabled
        aria-label="Disabled"
        defaultValue="list"
      >
        <Segmented.Item value="list">List</Segmented.Item>
        <Segmented.Item value="grid">Grid</Segmented.Item>
        <Segmented.Highlight />
      </Segmented.Root>
    </Showcase>
    <Showcase
      isStacked
      title="Symbols"
    >
      <Segmented.Root
        aria-label="Style"
        defaultValue="bold"
      >
        {(
          [
            ['bold', 'Bold', sfBold],
            ['italic', 'Italic', sfItalic],
            ['underline', 'Underline', sfUnderline],
          ] as const
        ).map(([value, label, icon]) => (
          <Segmented.Item
            key={value}
            aria-label={label}
            value={value}
          >
            <Symbol icon={icon} />
          </Segmented.Item>
        ))}
        <Segmented.Highlight />
      </Segmented.Root>
      <Segmented.Root
        aria-label="View"
        defaultValue="photos"
      >
        <Segmented.Item value="photos">
          <Symbol icon={sfPhoto} /> Photos
        </Segmented.Item>
        <Segmented.Item value="list">
          <Symbol icon={sfListBullet} /> List
        </Segmented.Item>
        <Segmented.Highlight />
      </Segmented.Root>
    </Showcase>
    <Showcase
      isStacked
      title="Too Narrow"
    >
      <Segmented.Root
        aria-label="Truncated"
        defaultValue="0"
      >
        {['Everything', 'Photographs', 'Documents', 'Recordings'].map(
          (label, index) => (
            <Segmented.Item
              key={label}
              value={String(index)}
            >
              {label}
            </Segmented.Item>
          ),
        )}
        <Segmented.Highlight />
      </Segmented.Root>
      <Segmented.Root
        aria-label="Scrolled"
        defaultValue="0"
        overflow="scroll"
      >
        {[
          'Everything',
          'Photographs',
          'Documents',
          'Recordings',
          'Messages',
          'Calendars',
        ].map((label, index) => (
          <Segmented.Item
            key={label}
            value={String(index)}
          >
            {label}
          </Segmented.Item>
        ))}
        <Segmented.Highlight />
      </Segmented.Root>
    </Showcase>
    <Rows title="In a Row">
      <List.Item>
        <List.Span>
          <Segmented.Root
            aria-label="Period"
            defaultValue="d"
          >
            {periods.map(([value, label]) => (
              <Segmented.Item
                key={value}
                value={value}
              >
                {label}
              </Segmented.Item>
            ))}
            <Segmented.Highlight />
          </Segmented.Root>
        </List.Span>
      </List.Item>
    </Rows>
  </List.Root>
);

const TextFieldContent: FunctionComponent = () => (
  <List.Root>
    <Showcase
      isStacked
      title="Frames"
    >
      {(['fill', 'row'] as const).map((variant) => (
        <TextField.Root key={variant}>
          <TextField.Frame variant={variant}>
            <Symbol icon={sfMagnifyingglass} />
            <TextField.Control
              aria-label={`Search (${variant})`}
              enterKeyHint="search"
              placeholder={`Search (${variant})`}
              type="search"
            />
            <TextField.Clear />
          </TextField.Frame>
        </TextField.Root>
      ))}
      <TextField.Root disabled>
        <TextField.Frame>
          <TextField.Control
            aria-label="Disabled"
            placeholder="Disabled"
          />
        </TextField.Frame>
      </TextField.Root>
    </Showcase>
    <Showcase
      isStacked
      title="Clear Button"
    >
      {(['whileEditing', 'unlessEditing', 'always'] as const).map((mode) => (
        <TextField.Root key={mode}>
          <TextField.Frame>
            <TextField.Control
              aria-label={mode}
              defaultValue={`Clear: ${mode}`}
            />
            <TextField.Clear mode={mode} />
          </TextField.Frame>
        </TextField.Root>
      ))}
    </Showcase>
    <List.Section>
      <List.Header>
        <List.Title>In Rows</List.Title>
      </List.Header>
      <List.Group>
        <TextField.Root render={<List.Item />}>
          <List.Content>
            <TextField.Label>Name</TextField.Label>
          </List.Content>
          <List.Trailing>
            <TextField.Control
              autoComplete="name"
              defaultValue="Kate Brown"
              placeholder="Required"
            />
            <TextField.Clear />
          </List.Trailing>
          <List.Below>
            <TextField.Description>As shown to others.</TextField.Description>
          </List.Below>
        </TextField.Root>
        <TextField.Root
          render={<List.Item />}
          validationMode="onBlur"
        >
          <List.Content>
            <TextField.Label>Email</TextField.Label>
          </List.Content>
          <List.Trailing>
            <TextField.Control
              defaultValue="not an address"
              placeholder="name@example.com"
              type="email"
            />
            <TextField.Clear />
          </List.Trailing>
          <List.Below>
            <TextField.Error match="typeMismatch">
              Not an email address.
            </TextField.Error>
          </List.Below>
        </TextField.Root>
        <TextField.Root render={<List.Item />}>
          <List.Content>
            <TextField.Label>Password</TextField.Label>
          </List.Content>
          <List.Trailing>
            <TextField.Control
              autoComplete="new-password"
              placeholder="Required"
              type="password"
            />
          </List.Trailing>
        </TextField.Root>
        <TextField.Root render={<List.Item />}>
          <List.Trailing>
            <TextField.Control
              aria-label="Company"
              placeholder="Company (no label)"
            />
            <TextField.Clear />
          </List.Trailing>
        </TextField.Root>
        <TextField.Root
          disabled
          render={<List.Item />}
        >
          <List.Content>
            <TextField.Label>Account</TextField.Label>
          </List.Content>
          <List.Trailing>
            <TextField.Control defaultValue="Disabled" />
          </List.Trailing>
        </TextField.Root>
      </List.Group>
    </List.Section>
    <List.Section>
      <List.Header>
        <List.Title>Several Lines</List.Title>
      </List.Header>
      <List.Group>
        <TextField.Root render={<List.Item />}>
          <List.Span>
            <TextField.Control
              aria-label="Notes"
              placeholder="Notes"
              render={<textarea />}
            />
          </List.Span>
        </TextField.Root>
      </List.Group>
    </List.Section>
  </List.Root>
);

const fruits = [
  'Apple',
  'Banana',
  'Cherry',
  'Grape',
  'Lemon',
  'Mango',
  'Orange',
  'Peach',
];

const hours = Array.from({ length: 24 }, (_, hour) => hour);
const minutes = Array.from({ length: 60 }, (_, minute) => minute);

const RollContent: FunctionComponent = () => {
  const [fruit, setFruit] = useState<RollValue>('Cherry');
  const [hour, setHour] = useState<RollValue>(7);
  const [minute, setMinute] = useState<RollValue>(30);

  return (
    <List.Root>
      <Showcase
        isStacked
        title={`One Column: ${String(fruit)}`}
      >
        <Roll.Root>
          <Roll.Column
            aria-label="Fruit"
            value={fruit}
            onValueChange={(next: RollValue) => setFruit(next)}
          >
            {fruits.map((name) => (
              <Roll.Item
                key={name}
                disabled={name === 'Grape'}
                value={name}
              />
            ))}
          </Roll.Column>
        </Roll.Root>
      </Showcase>
      <Showcase
        isStacked
        title={`Endless, Typed: ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`}
      >
        <Roll.Root>
          <Roll.Column
            editable
            loop
            aria-label="Hours"
            value={hour}
            onValueChange={(next: RollValue) => setHour(next)}
          >
            {hours.map((value) => (
              <Roll.Item
                key={value}
                value={value}
              >
                {String(value).padStart(2, '0')}
              </Roll.Item>
            ))}
          </Roll.Column>
          <Roll.Separator aria-hidden="true">:</Roll.Separator>
          <Roll.Column
            editable
            loop
            aria-label="Minutes"
            value={minute}
            onValueChange={(next: RollValue) => setMinute(next)}
          >
            {minutes.map((value) => (
              <Roll.Item
                key={value}
                value={value}
              >
                {String(value).padStart(2, '0')}
              </Roll.Item>
            ))}
          </Roll.Column>
        </Roll.Root>
      </Showcase>
      <Showcase
        isStacked
        title="Aligned"
      >
        <Roll.Root>
          {(['end', 'center', 'start'] as const).map((align) => (
            <Roll.Column
              key={align}
              align={align}
              aria-label={align}
              defaultValue="Mango"
            >
              {fruits.map((name) => (
                <Roll.Item
                  key={name}
                  value={name}
                />
              ))}
            </Roll.Column>
          ))}
        </Roll.Root>
      </Showcase>
      <Showcase
        isStacked
        title="Disabled"
      >
        <Roll.Root>
          <Roll.Column
            disabled
            aria-label="Disabled"
            defaultValue="Lemon"
          >
            {fruits.map((name) => (
              <Roll.Item
                key={name}
                value={name}
              />
            ))}
          </Roll.Column>
        </Roll.Root>
      </Showcase>
    </List.Root>
  );
};

/** A fixed day (so the calendar shows the same month each time). */
const example = new Date(2025, 3, 18, 9, 41);

const dayLength = 24 * 60 * 60 * 1000;

/** A day of the example's month (April 2025). */
const april = (date: number) => new Date(2025, 3, date);

/** A page of rows (or anything): in a list. */
const listPage =
  (children: ReactNode): FunctionComponent =>
  () => <List.Root>{children}</List.Root>;

/**
 * An inline calendar on a page of its own (one per page: each renders its
 * month's days, and its adjacent months', which is heavy on iOS); a caption
 * below it, saying what it shows.
 */
const calendarPage =
  (calendar: ReactNode, caption?: string): FunctionComponent =>
  () => (
    <List.Root>
      <List.Section>
        <List.Block strong>{calendar}</List.Block>
        {caption === undefined ? null : <List.Footer>{caption}</List.Footer>}
      </List.Section>
    </List.Root>
  );

const CompactRows: FunctionComponent = () => (
  <Rows>
    {(
      [
        ['Date', 'date'],
        ['Time', 'time'],
        ['Date and Time', 'dateAndTime'],
      ] as const
    ).map(([title, mode]) => (
      <Row
        key={mode}
        title={title}
      >
        <DatePicker.Root
          defaultValue={example}
          mode={mode}
          popoverAlign="end"
        />
      </Row>
    ))}
    <Row
      subtitle="Rounded rectangles, 24 hours"
      title="Alarm"
    >
      <DatePicker.Root
        buttonShape="roundedRectangle"
        defaultValue={example}
        hourCycle="h23"
        mode="dateAndTime"
        popoverAlign="end"
      />
    </Row>
    <Row
      subtitle="12 hours"
      title="Wake Up"
    >
      <DatePicker.Root
        defaultValue={example}
        hourCycle="h12"
        mode="time"
        popoverAlign="end"
      />
    </Row>
    <Row
      subtitle="Disabled"
      title="Due"
    >
      <DatePicker.Root
        disabled
        defaultValue={example}
        popoverAlign="end"
      />
    </Row>
  </Rows>
);

/** Two pickers expanding below their rows, one at a time. */
const ExpandingRows: FunctionComponent = () => {
  const starts = useCreateDatePickerHandle();
  const ends = useCreateDatePickerHandle();

  return (
    <List.Section>
      <List.Group>
        <List.AccordionRoot>
          <List.AccordionItem value="starts">
            <List.Item>
              <List.Content>
                <List.Title>Starts</List.Title>
              </List.Content>
              <List.Trailing>
                <DatePicker.Root
                  defaultValue={example}
                  handle={starts}
                  mode="dateAndTime"
                />
              </List.Trailing>
            </List.Item>
            <DatePicker.Expandable handle={starts} />
          </List.AccordionItem>
          <List.AccordionItem value="ends">
            <List.Item>
              <List.Content>
                <List.Title>Ends</List.Title>
              </List.Content>
              <List.Trailing>
                <DatePicker.Root
                  defaultValue={new Date(2025, 3, 18, 11, 0)}
                  handle={ends}
                  mode="dateAndTime"
                />
              </List.Trailing>
            </List.Item>
            <DatePicker.Expandable handle={ends} />
          </List.AccordionItem>
        </List.AccordionRoot>
      </List.Group>
      <List.Footer>Opening one closes the other.</List.Footer>
    </List.Section>
  );
};

/** Booked days (the example's month's): not selectable. */
const booked = new Set([3, 4, 11, 22, 23, 24]);

/** Days with events: one, two or three dots (by the day). */
const events = (date: Date) => {
  if (date.getMonth() !== 3) return undefined;
  const day = date.getDate();
  if (day % 7 === 0) {
    return [
      { tint: 'var(--color-ui-system-red)' },
      { tint: 'var(--color-ui-system-blue)' },
      { tint: 'var(--color-ui-system-green)' },
    ];
  }
  if (day % 5 === 0) {
    return [
      { tint: 'var(--color-ui-system-orange)' },
      { tint: 'var(--color-ui-system-purple)' },
    ];
  }
  return day % 3 === 0;
};

const pickerPages = [
  ['date-picker/compact', 'Compact, in Rows', listPage(<CompactRows />)],
  ['date-picker/expanding', 'Expanding in Place', listPage(<ExpandingRows />)],
  [
    'date-picker/inline',
    'Inline Date',
    calendarPage(
      <DatePicker.Root
        defaultValue={example}
        pickerStyle="inline"
      />,
    ),
  ],
  [
    'date-picker/inline-time',
    'Inline Date and Time',
    calendarPage(
      <DatePicker.Root
        defaultValue={example}
        mode="dateAndTime"
        pickerStyle="inline"
      />,
      'Its time below the days (its footer’s default).',
    ),
  ],
  [
    'date-picker/range',
    'A Range',
    calendarPage(
      <DatePicker.Root
        range
        defaultValue={{ end: april(22), start: example }}
        pickerStyle="inline"
      />,
      'Press a start, then an end; or drag across the days.',
    ),
  ],
] as const;

const rulePages = [
  [
    'date-picker/bounds',
    'Within Bounds',
    calendarPage(
      <DatePicker.Root
        defaultValue={example}
        max={april(25)}
        min={april(10)}
        pickerStyle="inline"
      />,
      'Only April 10 to 25 can be picked.',
    ),
  ],
  [
    'date-picker/disabled-days',
    'Disabled Days',
    calendarPage(
      <DatePicker.Root
        defaultValue={example}
        pickerStyle="inline"
        isDateDisabled={(date: Date) =>
          date.getDay() === 0 ||
          date.getDay() === 6 ||
          (date.getMonth() === 3 && booked.has(date.getDate()))
        }
      />,
      'Weekends and booked days (April 3, 4, 11, 22 to 24) can’t be picked.',
    ),
  ],
  [
    'date-picker/week',
    'Monday First, Adjacent Months',
    calendarPage(
      <DatePicker.Root
        showAdjacentMonths
        defaultValue={example}
        firstDayOfWeek={1}
        pickerStyle="inline"
      />,
      'The adjacent months’ days, grayed out, show their month when pressed.',
    ),
  ],
  [
    'date-picker/range-rules',
    'A Range with Rules',
    calendarPage(
      <DatePicker.Root
        range
        pickerStyle="inline"
        footer={({ value }: CalendarFooter) => {
          const isMissing =
            value !== null && !(value instanceof Date) && value.end === null;
          return (
            <DatePicker.CalendarMessage variant={isMissing ? 'error' : 'info'}>
              {isMissing
                ? 'Select a stay spanning at least two nights.'
                : 'Stay two to seven nights.'}
            </DatePicker.CalendarMessage>
          );
        }}
        isRangeDisabled={(start: Date, end: Date) => {
          const nights = Math.round(
            (end.getTime() - start.getTime()) / dayLength,
          );
          return nights < 2 || nights > 7;
        }}
      />,
      'Once a start is picked, only ends two to seven nights away can be.',
    ),
  ],
] as const;

const markPages = [
  [
    'date-picker/dots',
    'Dots',
    calendarPage(
      <DatePicker.Root
        defaultValue={example}
        pickerStyle="inline"
        highlighted={(date: Date) =>
          date.getMonth() === 3 && date.getDate() % 3 === 0
        }
      />,
      'Every third day has an event: a dot below it.',
    ),
  ],
  [
    'date-picker/several-dots',
    'Several Dots, Tinted',
    calendarPage(
      <DatePicker.Root
        defaultValue={example}
        highlighted={events}
        pickerStyle="inline"
      />,
      'Days with several events (each its own color): dots side by side.',
    ),
  ],
  [
    'date-picker/circles',
    'Circles',
    calendarPage(
      <DatePicker.Root
        defaultValue={example}
        pickerStyle="inline"
        highlighted={(date: Date) => {
          if (date.getMonth() !== 3) return undefined;
          if (booked.has(date.getDate())) {
            return { style: 'circle', tint: 'var(--color-ui-system-red)' };
          }
          return date.getDate() % 4 === 0 ? { style: 'circle' } : undefined;
        }}
      />,
      'Circles behind days: the tint’s (every fourth day), or red (booked).',
    ),
  ],
  [
    'date-picker/text',
    'Tinted Dates',
    calendarPage(
      <DatePicker.Root
        defaultValue={example}
        pickerStyle="inline"
        highlighted={(date: Date) =>
          date.getMonth() === 3 && [1, 14, 21].includes(date.getDate())
            ? [
                { style: 'text', tint: 'var(--color-ui-system-green)' },
                { tint: 'var(--color-ui-system-green)' },
              ]
            : undefined
        }
      />,
      'Paydays (April 1, 14 and 21): their dates in green, a green dot too.',
    ),
  ],
  [
    'date-picker/weekend',
    'Weekend Days',
    calendarPage(
      <DatePicker.Root
        defaultValue={example}
        highlightedWeekdays={[0, 6]}
        pickerStyle="inline"
      />,
      'Saturdays and Sundays in the secondary label color.',
    ),
  ],
  [
    'date-picker/footer',
    'A Footer of Shortcuts',
    calendarPage(
      <DatePicker.Root
        defaultValue={example}
        mode="dateAndTime"
        pickerStyle="inline"
        footer={(calendar: CalendarFooter) => (
          <>
            <DatePicker.CalendarTimeRow calendar={calendar} />
            <DatePicker.CalendarRow>
              <span aria-hidden="true">Jump to</span>
              <span className="kitchen-sink-showcase">
                <DatePicker.CalendarButton
                  disabled={calendar.disabled}
                  shape={calendar.buttonShape}
                  onClick={() => calendar.select(april(25))}
                >
                  April 25
                </DatePicker.CalendarButton>
                <DatePicker.CalendarButton
                  disabled={calendar.disabled}
                  shape={calendar.buttonShape}
                  onClick={() => calendar.select(new Date(), false)}
                >
                  Today
                </DatePicker.CalendarButton>
                <DatePicker.CalendarButton
                  disabled={calendar.disabled}
                  shape={calendar.buttonShape}
                  onClick={() => calendar.select(new Date(), true)}
                >
                  Now
                </DatePicker.CalendarButton>
              </span>
            </DatePicker.CalendarRow>
          </>
        )}
      />,
      'Its time row, then buttons selecting a date (or now, its time too).',
    ),
  ],
] as const;

const datePickerSections = [
  ['Pickers', pickerPages],
  ['Rules', rulePages],
  ['Marking Days', markPages],
] as const;

/** The pickers' pages, each drilled into (none rendered here: heavy). */
const DatePickerContent: FunctionComponent = () => (
  <List.Root>
    {datePickerSections.map(([title, sectionPages]) => (
      <Rows
        key={title}
        title={title}
      >
        {sectionPages.map(([key, pageTitle]) => (
          <DrillRow
            key={key}
            pageKey={key}
            title={pageTitle}
          />
        ))}
      </Rows>
    ))}
  </List.Root>
);

/** The picker's header: its eyedropper and system colors, its close. */
const pickerHeader = (title: string, close: ReactNode) => (
  <ColorPicker.Header>
    <Toolbar.Root placement="block-start">
      <Toolbar.Leading>
        <ColorPicker.Eyedropper render={<Toolbar.Button shape="circle" />}>
          <Button.Icon>
            <Symbol icon={sfEyedropper} />
          </Button.Icon>
        </ColorPicker.Eyedropper>
        <ColorPicker.SystemColors render={<Toolbar.Button shape="circle" />}>
          <Button.Icon>
            <Symbol icon={sfPaintpalette} />
          </Button.Icon>
        </ColorPicker.SystemColors>
      </Toolbar.Leading>
      <Toolbar.Title>
        <span>{title}</span>
      </Toolbar.Title>
      <Toolbar.Trailing>{close}</Toolbar.Trailing>
    </Toolbar.Root>
  </ColorPicker.Header>
);

const closeIcon = (
  <Button.Icon>
    <Symbol icon={sfXmark} />
  </Button.Icon>
);

/**
 * A color's row: its well opening the picker, in a sheet (compact) or a
 * popover (regular); its modes (the system's, or all).
 */
const ColorRow: FunctionComponent<{
  defaultColor: string;
  modes?: 'all' | 'system';
  title: string;
}> = ({ defaultColor, modes = 'system', title }) => {
  const [color, setColor] = useState(defaultColor);
  const isCompact = useSizeClass() === 'compact';
  const well = (
    <ColorPicker.Well
      aria-label={title}
      color={color}
    />
  );

  return (
    <List.Item>
      <List.Content>
        <List.Title>{title}</List.Title>
        <List.Subtitle>{color}</List.Subtitle>
      </List.Content>
      <List.Trailing>
        {isCompact ? (
          <Sheet.Root>
            <Sheet.Trigger render={well} />
            <ColorPicker.Root
              value={color}
              render={
                <Sheet.Popup
                  compact
                  detent="medium"
                />
              }
              onValueChange={(next: string) => setColor(next)}
            >
              <Sheet.Header>
                <Sheet.Grabber />
                {pickerHeader(
                  title,
                  <Sheet.Close
                    render={
                      <Toolbar.Button
                        aria-label="Close"
                        shape="circle"
                      />
                    }
                  >
                    {closeIcon}
                  </Sheet.Close>,
                )}
                {modesControl(modes)}
              </Sheet.Header>
              <Sheet.Content>
                <Viewport.Padding edge="block-start" />
                <ColorPicker.Panel>
                  {panelParts({ isModesElsewhere: true, modes })}
                </ColorPicker.Panel>
                <Viewport.Padding edge="block-end" />
              </Sheet.Content>
            </ColorPicker.Root>
          </Sheet.Root>
        ) : (
          <Popover.Root>
            <Popover.Trigger render={well} />
            <Popover.Portal>
              <Popover.Positioner align="end">
                <Popover.Popup style={{ width: 'min(402px, 100vw)' }}>
                  <Popover.Arrow />
                  <ColorPicker.Root
                    value={color}
                    onValueChange={(next: string) => setColor(next)}
                  >
                    {pickerHeader(
                      title,
                      <Popover.Close
                        render={
                          <Toolbar.Button
                            aria-label="Close"
                            shape="circle"
                          />
                        }
                      >
                        {closeIcon}
                      </Popover.Close>,
                    )}
                    <ColorPicker.Panel>
                      {panelParts({ modes })}
                    </ColorPicker.Panel>
                  </ColorPicker.Root>
                </Popover.Popup>
              </Popover.Positioner>
            </Popover.Portal>
          </Popover.Root>
        )}
      </List.Trailing>
    </List.Item>
  );
};

const ColorPickerContent: FunctionComponent = () => (
  <List.Root>
    <Showcase title="Wells">
      {['#FF3B30', '#34C759', '#007AFF', '#AF52DE80'].map((color) => (
        <ColorPicker.Well
          key={color}
          aria-label={color}
          color={color}
        />
      ))}
      {['#FF9500', '#5856D6'].map((color) => (
        <ColorPicker.Well
          key={color}
          aria-label={color}
          color={color}
          size="large"
        />
      ))}
    </Showcase>
    <Rows title="Opening the Picker">
      <ColorRow
        defaultColor="#FF9500"
        title="Tint"
      />
      <ColorRow
        defaultColor="#30B0C7"
        modes="all"
        title="Every Mode"
      />
    </Rows>
    <List.Section>
      <List.Header>
        <List.Title>On the Page</List.Title>
      </List.Header>
      <List.Block strong>
        <ColorPicker.Root defaultValue="#34C759">
          <ColorPicker.Panel>
            {panelParts({ modes: 'all', swatches: false })}
          </ColorPicker.Panel>
        </ColorPicker.Root>
      </List.Block>
    </List.Section>
  </List.Root>
);

/** A form as a list (see the docs' Form demo): submitted, its values shown. */
const FormContent: FunctionComponent = () => {
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [submitted, setSubmitted] = useState<string>();
  const birthdayPicker = useCreateDatePickerHandle();

  return (
    <Form
      onFormSubmit={(values: Record<string, unknown>) =>
        setSubmitted(JSON.stringify(values, undefined, 1))
      }
    >
      <List.Root>
        <Fieldset.Root>
          <Fieldset.Legend>
            <List.Title>Contact</List.Title>
          </Fieldset.Legend>
          <List.Group>
            <TextField.Root
              name="name"
              render={<List.Item />}
            >
              <List.Content>
                <TextField.Label>Name</TextField.Label>
              </List.Content>
              <List.Trailing>
                <TextField.Control
                  required
                  autoComplete="name"
                  placeholder="Required"
                />
                <TextField.Clear />
              </List.Trailing>
              <List.Below>
                <TextField.Error>Please enter a name.</TextField.Error>
              </List.Below>
            </TextField.Root>
            <TextField.Root
              name="email"
              render={<List.Item />}
            >
              <List.Content>
                <TextField.Label>Email</TextField.Label>
              </List.Content>
              <List.Trailing>
                <TextField.Control
                  autoComplete="email"
                  placeholder="Email"
                  type="email"
                />
                <TextField.Clear />
              </List.Trailing>
              <List.Below>
                <TextField.Error>
                  Please enter an email address.
                </TextField.Error>
              </List.Below>
            </TextField.Root>
            <TextField.Root
              name="age"
              render={<List.Item />}
            >
              <List.Content>
                <TextField.Label>Age</TextField.Label>
              </List.Content>
              <List.Trailing>
                <TextField.Control
                  inputMode="numeric"
                  max={130}
                  min={0}
                  placeholder="Age"
                  type="number"
                />
                <TextField.Clear />
              </List.Trailing>
              <List.Below>
                <TextField.Error>Between 0 and 130.</TextField.Error>
              </List.Below>
            </TextField.Root>
            <Field.Root
              name="birthday"
              render={<List.Item />}
            >
              <List.Content>
                <List.Title>Birthday</List.Title>
              </List.Content>
              <List.Trailing>
                <DatePicker.Root
                  handle={birthdayPicker}
                  max={new Date()}
                  value={birthday}
                  onValueChange={(next: Date) => setBirthday(next)}
                />
              </List.Trailing>
            </Field.Root>
            <DatePicker.Expandable handle={birthdayPicker} />
          </List.Group>
        </Fieldset.Root>

        <Fieldset.Root>
          <Fieldset.Legend>
            <List.Title>Notifications</List.Title>
          </Fieldset.Legend>
          <Field.Root
            name="notifications"
            render={<div className="kitchen-sink-contents" />}
          >
            <CheckboxGroup
              allValues={['messages', 'mentions', 'reminders']}
              defaultValue={['mentions']}
              render={<List.Group />}
            >
              {(
                [
                  ['messages', 'Messages'],
                  ['mentions', 'Mentions'],
                  ['reminders', 'Reminders'],
                ] as const
              ).map(([value, title]) => (
                <List.Item
                  key={value}
                  onClick={forwardClick('[role=checkbox]')}
                >
                  <List.Leading>
                    <List.Checkbox
                      aria-label={title}
                      value={value}
                    />
                  </List.Leading>
                  <List.Content>
                    <List.Title>{title}</List.Title>
                  </List.Content>
                </List.Item>
              ))}
            </CheckboxGroup>
          </Field.Root>
        </Fieldset.Root>

        <Fieldset.Root>
          <Fieldset.Legend>
            <List.Title>Appearance</List.Title>
          </Fieldset.Legend>
          <Field.Root
            name="appearance"
            render={<div className="kitchen-sink-contents" />}
          >
            <RadioGroup
              defaultValue="automatic"
              render={<List.Group />}
            >
              {(
                [
                  ['light', 'Light'],
                  ['dark', 'Dark'],
                  ['automatic', 'Automatic'],
                ] as const
              ).map(([value, title]) => (
                <List.Item
                  key={value}
                  onClick={forwardClick('[role=radio]')}
                >
                  <List.Leading>
                    <List.Radio
                      aria-label={title}
                      value={value}
                    />
                  </List.Leading>
                  <List.Content>
                    <List.Title>{title}</List.Title>
                  </List.Content>
                </List.Item>
              ))}
            </RadioGroup>
          </Field.Root>
        </Fieldset.Root>

        <List.Section>
          <List.Block style={{ paddingInline: 0 }}>
            <Button.Root
              fill
              size="large"
              type="submit"
              variant="bordered-prominent"
            >
              <Button.Label>Submit</Button.Label>
            </Button.Root>
          </List.Block>
          {submitted === undefined ? null : (
            <List.Footer>
              <pre className="kitchen-sink-submitted">{submitted}</pre>
            </List.Footer>
          )}
        </List.Section>
      </List.Root>
    </Form>
  );
};

export const choicesPages: SinkPages = {
  checkbox: { Content: CheckboxContent, title: 'Checkbox' },
  'color-picker': { Content: ColorPickerContent, title: 'Color Picker' },
  'date-picker': { Content: DatePickerContent, title: 'Date Picker' },
  ...Object.fromEntries(
    datePickerSections.flatMap(([, sectionPages]) =>
      sectionPages.map(([key, title, Content]) => [key, { Content, title }]),
    ),
  ),
  form: { Content: FormContent, title: 'Form' },
  roll: { Content: RollContent, title: 'Roll' },
  segmented: { Content: SegmentedContent, title: 'Segmented' },
  slider: { Content: SliderContent, title: 'Slider' },
  stepper: { Content: StepperContent, title: 'Stepper' },
  switch: { Content: SwitchContent, title: 'Switch' },
  'text-field': { Content: TextFieldContent, title: 'Text Field' },
};
