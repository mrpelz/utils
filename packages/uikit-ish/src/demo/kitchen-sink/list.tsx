import { FunctionComponent, useState } from 'react';

import {
  CheckboxGroup,
  forwardClick,
  List,
  type ListEditing,
  type ListStyle,
  RadioGroup,
  Sidebar,
  Slider,
  Symbol,
  useCreateReorderHandle,
  useCreateSwipeActionsHandle,
} from '../../components/index.js';
import { contacts, planets, settings } from '../docs/list/content.js';
import {
  sfArchiveboxFill,
  sfBellFill,
  sfCheckmarkCircleFill,
  sfEllipsis,
  sfEnvelopeOpenFill,
  sfFlagFill,
  sfFolder,
  sfICircle,
  sfMinus,
  sfPersonCropCircleFill,
  sfPinFill,
  sfPlus,
  sfSquareAndPencil,
  sfSunMax,
  sfSunMin,
  sfTagFill,
  sfTrashFill,
  sfWifi,
} from '../tooling/icons.js';
import { DrillRow, type SinkPages } from './shared.js';

// List: its rows' every part (the component's page), and pages of its own:
// each list style, swipe actions, editing, expanding rows, an index.

const stylePages = [
  ['list/inset-grouped', 'Inset Grouped'],
  ['list/grouped', 'Grouped'],
  ['list/plain', 'Plain'],
  ['list/sidebar', 'Sidebar'],
  ['list/outline', 'Inset Grouped, Outlined'],
  ['list/outline-plain', 'Plain, Outlined'],
] as const;

const featurePages = [
  ['list/swipe', 'Swipe Actions'],
  ['list/editing', 'Editing'],
  ['list/reordering', 'Reordering'],
  ['list/expanding', 'Expanding Rows'],
  ['list/index', 'Index'],
] as const;

/** A settings row: its colored symbol, title, detail, drilling in. */
const SettingsRows: FunctionComponent<{ hasSubtitle?: boolean }> = ({
  hasSubtitle = false,
}) =>
  settings.map(({ color, detail, icon, subtitle, title }) => (
    <List.Item key={title}>
      <List.Leading>
        <List.Image
          style={{ backgroundColor: color }}
          variant="rounded"
        >
          <Symbol icon={icon} />
        </List.Image>
      </List.Leading>
      <List.Content>
        <List.Title render={<button type="button" />}>{title}</List.Title>
        {hasSubtitle ? <List.Subtitle>{subtitle}</List.Subtitle> : null}
      </List.Content>
      <List.Trailing>
        <List.Detail>{detail}</List.Detail>
      </List.Trailing>
      <List.Trailing>
        <List.DrillIn />
      </List.Trailing>
    </List.Item>
  ));

/** The same sections, in a list of a style (and outlined, or not). */
const StyledList: FunctionComponent<{
  isOutlined?: boolean;
  listStyle: ListStyle;
}> = ({ isOutlined = false, listStyle }) => (
  <List.Root
    listStyle={listStyle}
    outline={isOutlined}
  >
    <List.Section>
      <List.Header>
        <List.Title>Prominent Header</List.Title>
      </List.Header>
      <List.Group>
        <SettingsRows />
      </List.Group>
      <List.Footer>A footer, aligned with the rows’ text.</List.Footer>
    </List.Section>
    <List.Section>
      <List.Header prominence="nested">
        <List.Title>Nested Header</List.Title>
      </List.Header>
      <List.Group>
        <SettingsRows hasSubtitle />
      </List.Group>
    </List.Section>
    <List.Section>
      <List.Header prominence="extraProminent">
        <List.Title>Extra Prominent Header</List.Title>
      </List.Header>
      <List.Group>
        {planets.map((name, index) => (
          <List.Item
            key={name}
            selected={index === 1}
          >
            <List.Leading>
              <List.Image>
                <Symbol icon={sfFolder} />
              </List.Image>
            </List.Leading>
            <List.Content>
              <List.Title render={<button type="button" />}>
                {index === 1 ? `${name} (selected)` : name}
              </List.Title>
            </List.Content>
            <List.Trailing>
              <List.Detail>{index + 1}</List.Detail>
            </List.Trailing>
          </List.Item>
        ))}
      </List.Group>
    </List.Section>
    <List.Section>
      <List.Block strong>
        <p>
          A strong content block: inset and outlined as the list’s groups are.
        </p>
      </List.Block>
    </List.Section>
  </List.Root>
);

const ListContent: FunctionComponent = () => (
  <List.Root>
    <List.Section>
      <List.Header>
        <List.Title>Styles</List.Title>
      </List.Header>
      <List.Group>
        {stylePages.map(([key, title]) => (
          <DrillRow
            key={key}
            pageKey={key}
            title={title}
          />
        ))}
      </List.Group>
    </List.Section>
    <List.Section>
      <List.Header>
        <List.Title>More</List.Title>
      </List.Header>
      <List.Group>
        {featurePages.map(([key, title]) => (
          <DrillRow
            key={key}
            pageKey={key}
            title={title}
          />
        ))}
      </List.Group>
    </List.Section>

    <List.Section>
      <List.Header>
        <List.Supertitle>Supertitle</List.Supertitle>
        <List.Title>Header</List.Title>
        <List.Subtitle>Its subtitle</List.Subtitle>
        <List.Accessory
          aria-label="Edit"
          render={<button type="button" />}
        >
          <Symbol icon={sfSquareAndPencil} />
        </List.Accessory>
      </List.Header>
      <List.Group>
        <List.Item>
          <List.Content>
            <List.Title>Title</List.Title>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            <List.Title>Title</List.Title>
            <List.Subtitle>Subtitle</List.Subtitle>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            <List.Title>Title</List.Title>
            <List.Subtitle>Subtitle</List.Subtitle>
            <List.Text>
              Text below the title and subtitle, at most two lines by default:
              longer text is cut off with an ellipsis at the end of the second
              line, as this is. It goes on long enough to be cut off on a
              tablet’s wide rows too, where two lines hold a good deal more than
              on a phone, so the ellipsis shows whichever device it’s read on,
              and nothing of this last sentence is left to see.
            </List.Text>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            <List.Title>One line of text</List.Title>
            <List.Text lines={1}>
              Text at most one line long: whatever doesn’t fit on it, even on a
              tablet’s wide rows, is cut off with an ellipsis at the end of the
              line instead of wrapping onto a second one.
            </List.Text>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            <List.Title>Detail</List.Title>
          </List.Content>
          <List.Trailing>
            <List.Detail>Detail</List.Detail>
          </List.Trailing>
        </List.Item>
        <List.Item>
          <List.Content>
            <List.Title render={<button type="button" />}>Drill-in</List.Title>
          </List.Content>
          <List.Trailing>
            <List.Detail>Detail</List.Detail>
          </List.Trailing>
          <List.Trailing>
            <List.DrillIn />
          </List.Trailing>
        </List.Item>
        <List.Item selected>
          <List.Content>
            <List.Title render={<button type="button" />}>
              A row (selected)
            </List.Title>
          </List.Content>
        </List.Item>
      </List.Group>
      <List.Footer>A footer, aligned with the rows’ text.</List.Footer>
    </List.Section>

    <List.Section>
      <List.Header>
        <List.Title>Images</List.Title>
      </List.Header>
      <List.Group>
        <List.Item>
          <List.Leading>
            <List.Image variant="symbol">
              <Symbol icon={sfFolder} />
            </List.Image>
          </List.Leading>
          <List.Content>
            <List.Title>Symbol</List.Title>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Leading>
            <List.Image
              style={{ backgroundColor: 'var(--color-ui-system-blue)' }}
              variant="rounded"
            >
              <Symbol icon={sfWifi} />
            </List.Image>
          </List.Leading>
          <List.Content>
            <List.Title>Rounded</List.Title>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Leading>
            <List.Image variant="circular">
              <Symbol icon={sfPersonCropCircleFill} />
            </List.Image>
          </List.Leading>
          <List.Content>
            <List.Title>Circular</List.Title>
            <List.Subtitle>With a subtitle</List.Subtitle>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Leading>
            <List.Image
              style={{ backgroundColor: 'var(--color-ui-system-red)' }}
              variant="fill"
            >
              <Symbol icon={sfBellFill} />
            </List.Image>
          </List.Leading>
          <List.Content>
            <List.Title>Fill</List.Title>
          </List.Content>
        </List.Item>
      </List.Group>
    </List.Section>

    <List.Section>
      <List.Header>
        <List.Title>Accessories</List.Title>
      </List.Header>
      <List.Group>
        <List.Item>
          <List.Content>
            <List.Title>Accessory, checkmark</List.Title>
          </List.Content>
          <List.Trailing>
            <List.Accessory
              aria-label="Info"
              render={<button type="button" />}
            >
              <Symbol icon={sfICircle} />
            </List.Accessory>
            <List.Checkmark />
          </List.Trailing>
        </List.Item>
        <List.Item onClick={forwardClick('[data-list-part=action]')}>
          <List.Content>
            <List.Title>Action</List.Title>
          </List.Content>
          <List.Trailing>
            <List.Action>Action</List.Action>
          </List.Trailing>
        </List.Item>
        <List.Item>
          <List.Content>
            <List.Button>Button</List.Button>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            <List.Button destructive>Destructive Button</List.Button>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            <List.Button disabled>Disabled Button</List.Button>
          </List.Content>
        </List.Item>
      </List.Group>
    </List.Section>

    <List.Section>
      <List.Header>
        <List.Title>Across and Below</List.Title>
      </List.Header>
      <List.Group>
        <List.Item>
          <List.Span>
            <Slider.Root defaultValue={60}>
              <Slider.Symbol edge="min">
                <Symbol icon={sfSunMin} />
              </Slider.Symbol>
              <Slider.Control>
                <Slider.Track>
                  <Slider.Indicator />
                  <Slider.Thumb aria-label="Brightness" />
                </Slider.Track>
              </Slider.Control>
              <Slider.Symbol edge="max">
                <Symbol icon={sfSunMax} />
              </Slider.Symbol>
            </Slider.Root>
          </List.Span>
        </List.Item>
        <List.Item>
          <List.Leading>
            <List.Image variant="circular">
              <Symbol icon={sfPersonCropCircleFill} />
            </List.Image>
          </List.Leading>
          <List.Content>
            <List.Title>Anna Hall</List.Title>
          </List.Content>
          <List.Trailing>
            <List.Detail>10:00</List.Detail>
          </List.Trailing>
          <List.Below>
            <List.Text>
              A line below the row’s own, across it: here, a message’s preview
              text.
            </List.Text>
          </List.Below>
        </List.Item>
      </List.Group>
    </List.Section>

    <List.Section>
      <List.Header>
        <List.Title>Hierarchy</List.Title>
      </List.Header>
      <List.Group>
        {[0, 1, 2, 3].map((level) => (
          <List.Item
            key={level}
            level={level}
          >
            <List.Leading>
              <List.Image>
                <Symbol icon={sfFolder} />
              </List.Image>
            </List.Leading>
            <List.Content>
              <List.Title>Level {level}</List.Title>
            </List.Content>
          </List.Item>
        ))}
      </List.Group>
    </List.Section>

    <List.Section>
      <List.Block>
        <p>A content block, its text aligned with the rows’.</p>
      </List.Block>
    </List.Section>
    <List.Section>
      <List.Block strong>
        <p>A strong content block, on the rows’ background.</p>
      </List.Block>
    </List.Section>
  </List.Root>
);

/** Swipe actions, every way: sides, labels, shapes, swiping allowed. */
const SwipeContent: FunctionComponent = () => {
  const handle = useCreateSwipeActionsHandle();
  const [rows, setRows] = useState<readonly string[]>(planets);

  return (
    <List.Root>
      <List.Section>
        <List.Header>
          <List.Title>Sides</List.Title>
        </List.Header>
        <List.Group>
          <List.Item>
            <List.Content>
              <List.Title>Trailing</List.Title>
            </List.Content>
            <List.SwipeActions>
              <List.SwipeAction label="More">
                <Symbol icon={sfEllipsis} />
              </List.SwipeAction>
              <List.SwipeAction
                label="Flag"
                tint="var(--color-ui-system-orange)"
              >
                <Symbol icon={sfFlagFill} />
              </List.SwipeAction>
              <List.SwipeAction
                label="Archive"
                tint="var(--color-ui-system-purple)"
              >
                <Symbol icon={sfArchiveboxFill} />
              </List.SwipeAction>
            </List.SwipeActions>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Title>Leading</List.Title>
            </List.Content>
            <List.SwipeActions side="inline-start">
              <List.SwipeAction
                label="Pin"
                tint="var(--color-ui-system-orange)"
              >
                <Symbol icon={sfPinFill} />
              </List.SwipeAction>
              <List.SwipeAction label="Mute">
                <Symbol icon={sfBellFill} />
              </List.SwipeAction>
            </List.SwipeActions>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Title>Both, overswiped</List.Title>
            </List.Content>
            <List.SwipeActions
              overswipe
              side="inline-start"
            >
              <List.SwipeAction
                label="Done"
                tint="var(--color-ui-system-green)"
              >
                <Symbol icon={sfCheckmarkCircleFill} />
              </List.SwipeAction>
            </List.SwipeActions>
            <List.SwipeActions overswipe>
              <List.SwipeAction
                label="Tag"
                tint="var(--color-ui-system-indigo)"
              >
                <Symbol icon={sfTagFill} />
              </List.SwipeAction>
              <List.SwipeAction
                label="Delete"
                tint="var(--color-ui-system-red)"
              >
                <Symbol icon={sfTrashFill} />
              </List.SwipeAction>
            </List.SwipeActions>
          </List.Item>
        </List.Group>
      </List.Section>

      <List.Section>
        <List.Header>
          <List.Title>Labels and Shapes</List.Title>
        </List.Header>
        <List.Group>
          <List.Item>
            <List.Leading>
              <List.Image variant="circular">
                <Symbol icon={sfPersonCropCircleFill} />
              </List.Image>
            </List.Leading>
            <List.Content>
              <List.Title>Labeled</List.Title>
              <List.Subtitle>Swipe either way</List.Subtitle>
              <List.Text>
                A multi-line row has room for its actions’ labels below them.
              </List.Text>
            </List.Content>
            <List.SwipeActions
              overswipe
              side="inline-start"
            >
              <List.SwipeAction
                showLabel
                label="Unread"
                tint="var(--color-ui-system-blue)"
              >
                <Symbol icon={sfEnvelopeOpenFill} />
              </List.SwipeAction>
            </List.SwipeActions>
            <List.SwipeActions>
              <List.SwipeAction
                showLabel
                label="More"
              >
                <Symbol icon={sfEllipsis} />
              </List.SwipeAction>
              <List.SwipeAction
                showLabel
                label="Flag"
                tint="var(--color-ui-system-orange)"
              >
                <Symbol icon={sfFlagFill} />
              </List.SwipeAction>
            </List.SwipeActions>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Title>Circles</List.Title>
            </List.Content>
            <List.SwipeActions>
              <List.SwipeAction
                label="Flag"
                shape="circle"
                tint="var(--color-ui-system-orange)"
              >
                <Symbol icon={sfFlagFill} />
              </List.SwipeAction>
              <List.SwipeAction
                label="Delete"
                shape="circle"
                tint="var(--color-ui-system-red)"
              >
                <Symbol icon={sfTrashFill} />
              </List.SwipeAction>
            </List.SwipeActions>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Title>Rounded rectangles</List.Title>
            </List.Content>
            <List.SwipeActions>
              <List.SwipeAction
                label="Flag"
                shape="roundedRectangle"
                tint="var(--color-ui-system-orange)"
              >
                <Symbol icon={sfFlagFill} />
              </List.SwipeAction>
              <List.SwipeAction
                label="Delete"
                shape="roundedRectangle"
                tint="var(--color-ui-system-red)"
              >
                <Symbol icon={sfTrashFill} />
              </List.SwipeAction>
            </List.SwipeActions>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Title>Text</List.Title>
            </List.Content>
            <List.SwipeActions>
              <List.SwipeAction
                label="Delete"
                tint="var(--color-ui-system-red)"
              >
                Delete
              </List.SwipeAction>
            </List.SwipeActions>
          </List.Item>
        </List.Group>
      </List.Section>

      <List.Section>
        <List.Header>
          <List.Title>Opened by a Button</List.Title>
        </List.Header>
        <List.Group>
          <List.Item>
            <List.Content>
              <List.Title>Its own trigger</List.Title>
            </List.Content>
            <List.Trailing>
              <List.SwipeActionsTrigger
                aria-label="Actions"
                render={<List.Accessory render={<button type="button" />} />}
              >
                <Symbol icon={sfEllipsis} />
              </List.SwipeActionsTrigger>
            </List.Trailing>
            <List.SwipeActions allowSwipe="conceal">
              <List.SwipeAction
                label="Delete"
                tint="var(--color-ui-system-red)"
              >
                <Symbol icon={sfTrashFill} />
              </List.SwipeAction>
            </List.SwipeActions>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Title>A handle’s (not swiped)</List.Title>
            </List.Content>
            <List.SwipeActions
              allowSwipe="none"
              handle={handle}
            >
              <List.SwipeAction
                label="Archive"
                tint="var(--color-ui-system-purple)"
              >
                <Symbol icon={sfArchiveboxFill} />
              </List.SwipeAction>
            </List.SwipeActions>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.SwipeActionsTrigger
                handle={handle}
                render={<List.Button />}
              >
                Show the Row Above’s Actions
              </List.SwipeActionsTrigger>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Title>Revealed only (closed by a press)</List.Title>
            </List.Content>
            <List.SwipeActions allowSwipe="reveal">
              <List.SwipeAction label="More">
                <Symbol icon={sfEllipsis} />
              </List.SwipeAction>
            </List.SwipeActions>
          </List.Item>
        </List.Group>
      </List.Section>

      <List.Section>
        <List.Header>
          <List.Title>Deleted by Overswiping</List.Title>
          <List.Action onClick={() => setRows(planets)}>Reset</List.Action>
        </List.Header>
        <List.Group>
          {rows.map((name) => (
            <List.Item key={name}>
              <List.Content>
                <List.Title>{name}</List.Title>
              </List.Content>
              <List.SwipeActions overswipe>
                <List.SwipeAction
                  label="Delete"
                  tint="var(--color-ui-system-red)"
                  onClick={() =>
                    setRows((current) => current.filter((row) => row !== name))
                  }
                >
                  <Symbol icon={sfTrashFill} />
                </List.SwipeAction>
              </List.SwipeActions>
            </List.Item>
          ))}
        </List.Group>
      </List.Section>
    </List.Root>
  );
};

const editingModes: readonly ListEditing[] = [
  'none',
  'leading',
  'trailing',
  'both',
];

/** Editing: its modes, selecting, reordering, deleting and inserting. */
const EditingContent: FunctionComponent = () => {
  const [editing, setEditing] = useState<ListEditing>('both');
  const [rows, setRows] = useState<readonly string[]>(planets);
  const [selected, setSelected] = useState<string[]>([]);
  const [deletable, setDeletable] = useState<readonly string[]>(planets);
  const [added, setAdded] = useState(0);
  const reorder = useCreateReorderHandle({
    onReorder: (change) =>
      setRows((current) => List.reorder(current, change, (row) => row)),
  });
  const isEditing = editing !== 'none';

  return (
    <List.Root editing={editing}>
      <List.Section editing="ignore">
        <List.Header>
          <List.Title>Edit Mode</List.Title>
        </List.Header>
        <RadioGroup
          aria-label="Edit mode"
          render={<List.Group />}
          value={editing}
          onValueChange={(value: ListEditing) => setEditing(value)}
        >
          {editingModes.map((mode) => (
            <List.Item
              key={mode}
              onClick={forwardClick('[role=radio]')}
            >
              <List.Leading>
                <List.Radio
                  aria-label={mode}
                  value={mode}
                />
              </List.Leading>
              <List.Content>
                <List.Title>{mode}</List.Title>
              </List.Content>
            </List.Item>
          ))}
        </RadioGroup>
      </List.Section>

      <List.Section>
        <List.Header prominence="nested">
          <List.Title>
            Selected {selected.length} of {rows.length}
          </List.Title>
          <List.Action
            onClick={() => {
              setRows(planets);
              setSelected([]);
            }}
          >
            Reset
          </List.Action>
        </List.Header>
        <CheckboxGroup
          render={<List.Group reorderHandle={reorder} />}
          value={selected}
          onValueChange={(value: string[]) => setSelected(value)}
        >
          {rows.map((name) => (
            <List.Item
              key={name}
              dropName={name}
              reorderHandle={reorder}
              onClick={isEditing ? forwardClick('[role=checkbox]') : undefined}
            >
              <List.Leading whileEditing="show">
                <List.Checkbox
                  aria-label={name}
                  value={name}
                />
              </List.Leading>
              <List.Content>
                <List.Title>{name}</List.Title>
              </List.Content>
              <List.Trailing whileEditing="hide">
                <List.DrillIn />
              </List.Trailing>
              <List.Trailing whileEditing="show">
                <List.Grabber aria-label={`Reorder ${name}`} />
              </List.Trailing>
            </List.Item>
          ))}
        </CheckboxGroup>
        <List.Footer>
          Drag along the checkboxes to select several rows.
        </List.Footer>
      </List.Section>

      <List.Section editing="ignore">
        <List.Header prominence="nested">
          <List.Title>Edit Buttons</List.Title>
          <List.Action
            onClick={() => {
              setDeletable(planets);
              setAdded(0);
            }}
          >
            Reset
          </List.Action>
        </List.Header>
        <List.Group>
          {deletable.map((name) => (
            <List.Item key={name}>
              <List.Leading>
                <List.SwipeActionsTrigger
                  render={
                    <List.EditButton
                      aria-label={`Delete ${name}`}
                      tint="var(--color-ui-system-red)"
                    >
                      <Symbol icon={sfMinus} />
                    </List.EditButton>
                  }
                />
              </List.Leading>
              <List.Content>
                <List.Title>{name}</List.Title>
              </List.Content>
              <List.SwipeActions
                overswipe
                allowSwipe="conceal"
              >
                <List.SwipeAction
                  label="Delete"
                  tint="var(--color-ui-system-red)"
                  onClick={() =>
                    setDeletable((current) =>
                      current.filter((row) => row !== name),
                    )
                  }
                >
                  <Symbol icon={sfTrashFill} />
                </List.SwipeAction>
              </List.SwipeActions>
            </List.Item>
          ))}
          <List.Item>
            <List.Leading>
              <List.EditButton
                aria-hidden="true"
                render={<span />}
                tint="var(--color-ui-system-green)"
              >
                <Symbol icon={sfPlus} />
              </List.EditButton>
            </List.Leading>
            <List.Content>
              <List.Button
                onClick={() => {
                  setDeletable((current) => [
                    ...current,
                    `Planet ${String(added + 1)}`,
                  ]);
                  setAdded(added + 1);
                }}
              >
                Add Planet
              </List.Button>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Leading>
              <List.EditButton aria-label="Gray (default)">
                <Symbol icon={sfMinus} />
              </List.EditButton>
            </List.Leading>
            <List.Content>
              <List.Title>Gray (default)</List.Title>
            </List.Content>
          </List.Item>
        </List.Group>
      </List.Section>
    </List.Root>
  );
};

/** The Solar System's bodies, by section. */
const solarPlanets = {
  dwarf: ['Ceres', 'Pluto'],
  inner: ['Mercury', 'Venus', 'Earth', 'Mars'],
  outer: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
} as const satisfies Record<string, readonly string[]>;

type SolarPlanets = Readonly<
  Record<keyof typeof solarPlanets, readonly string[]>
>;

/**
 * Reordering across sections by one handle, into deliberate drop zones:
 * the Sun pinned first (a drop group after it), a group's gaps, a drop
 * target at a group's end; selected rows dragged together.
 */
const ReorderingContent: FunctionComponent = () => {
  const [bodies, setBodies] = useState<SolarPlanets>(solarPlanets);
  const [isEditing, setIsEditing] = useState(true);
  const [selected, setSelected] = useState<readonly string[]>([]);
  const reorder = useCreateReorderHandle({
    onReorder: (change) =>
      setBodies((current) =>
        List.reorder(current, change, (planet: string) => planet),
      ),
  });

  const row = (name: string) => (
    <List.Item
      key={name}
      dropName={name}
      reorderHandle={reorder}
    >
      <List.Leading whileEditing="show">
        <List.Checkbox
          aria-label={name}
          checked={selected.includes(name)}
          onCheckedChange={(isChecked: boolean) =>
            setSelected((current) =>
              isChecked
                ? [...current, name]
                : current.filter((other) => other !== name),
            )
          }
        />
      </List.Leading>
      <List.Content>
        <List.Title>{name}</List.Title>
      </List.Content>
      <List.Trailing whileEditing="show">
        <List.Grabber
          aria-label={`Reorder ${name}`}
          onPointerDown={() => {
            // (A selected row grabbed: all of them, it first.)
            if (selected.length > 1 && selected.includes(name)) {
              reorder.grab([
                name,
                ...selected.filter((other) => other !== name),
              ]);
            }
          }}
        />
      </List.Trailing>
    </List.Item>
  );

  return (
    <List.Root editing={isEditing ? 'both' : 'none'}>
      <List.Section>
        <List.Header>
          <List.Title>Inner Planets</List.Title>
          <List.Action
            onClick={() => {
              setBodies(solarPlanets);
              setSelected([]);
            }}
          >
            Reset
          </List.Action>
          <List.Action
            onClick={() => {
              setIsEditing(!isEditing);
              setSelected([]);
            }}
          >
            {isEditing ? 'Done' : 'Edit'}
          </List.Action>
        </List.Header>
        <List.Group>
          <List.Item
            dropName="Sun"
            editing="none"
          >
            <List.Content>
              <List.Title>Sun (pinned)</List.Title>
            </List.Content>
          </List.Item>
          <List.DropGroup
            dropName="inner"
            reorderHandle={reorder}
          >
            {bodies.inner.map((name) => row(name))}
          </List.DropGroup>
        </List.Group>
      </List.Section>
      <List.Section>
        <List.Header>
          <List.Title>Outer Planets</List.Title>
        </List.Header>
        <List.Group
          dropName="outer"
          reorderHandle={reorder}
        >
          {bodies.outer.map((name) => row(name))}
        </List.Group>
      </List.Section>
      <List.Section>
        <List.Header>
          <List.Title>Dwarf Planets</List.Title>
        </List.Header>
        <List.Group>
          {bodies.dwarf.map((name) => row(name))}
          <List.DropTarget
            dropName="dwarf"
            reorderHandle={reorder}
          />
        </List.Group>
        <List.Footer>
          There’s a drop target only at this group’s end. Select several rows,
          then drag one of them to move them all.
        </List.Footer>
      </List.Section>
    </List.Root>
  );
};

const accordionItems = [
  ['repeat', 'Repeat', 'Never'],
  ['alert', 'Alert', 'None'],
  ['travel', 'Travel Time', 'None'],
] as const;

/** Rows opening rows below them: collapsible, nested, and as accordions. */
const ExpandingContent: FunctionComponent = () => (
  <List.Root>
    <List.Section>
      <List.Header>
        <List.Title>Collapsible</List.Title>
      </List.Header>
      <List.Group>
        <List.CollapsibleRoot>
          <List.Item>
            <List.Content>
              <List.Title render={<List.CollapsibleTrigger />}>
                Collapsible row
              </List.Title>
            </List.Content>
            <List.Trailing>
              <List.Disclosure />
            </List.Trailing>
          </List.Item>
          <List.CollapsiblePanel>
            {settings.map(({ color, icon, title }) => (
              <List.Item key={title}>
                <List.Leading>
                  <List.Image
                    style={{ backgroundColor: color }}
                    variant="rounded"
                  >
                    <Symbol icon={icon} />
                  </List.Image>
                </List.Leading>
                <List.Content>
                  <List.Title>{title}</List.Title>
                </List.Content>
              </List.Item>
            ))}
          </List.CollapsiblePanel>
        </List.CollapsibleRoot>
        <List.CollapsibleRoot disabled>
          <List.Item>
            <List.Content>
              <List.Title render={<List.CollapsibleTrigger />}>
                Disabled
              </List.Title>
            </List.Content>
            <List.Trailing>
              <List.Disclosure />
            </List.Trailing>
          </List.Item>
          <List.CollapsiblePanel>
            <List.Item>
              <List.Content>
                <List.Title>Never shown</List.Title>
              </List.Content>
            </List.Item>
          </List.CollapsiblePanel>
        </List.CollapsibleRoot>
      </List.Group>
    </List.Section>

    <List.Section>
      <List.Header>
        <List.Title>Nested</List.Title>
      </List.Header>
      <List.Group>
        <List.CollapsibleRoot defaultOpen>
          <List.Item>
            <List.Leading>
              <List.Image>
                <Symbol icon={sfFolder} />
              </List.Image>
            </List.Leading>
            <List.Content>
              <List.Title>Projects</List.Title>
            </List.Content>
            <List.Trailing>
              <List.CollapsibleTrigger
                aria-label="Projects: nested"
                render={<List.Accessory render={<button type="button" />} />}
              >
                <List.Disclosure />
              </List.CollapsibleTrigger>
            </List.Trailing>
          </List.Item>
          <List.CollapsiblePanel>
            <List.CollapsibleRoot defaultOpen>
              <List.Item level={1}>
                <List.Leading>
                  <List.Image>
                    <Symbol icon={sfFolder} />
                  </List.Image>
                </List.Leading>
                <List.Content>
                  <List.Title>Design</List.Title>
                </List.Content>
                <List.Trailing>
                  <List.CollapsibleTrigger
                    aria-label="Design: nested"
                    render={
                      <List.Accessory render={<button type="button" />} />
                    }
                  >
                    <List.Disclosure />
                  </List.CollapsibleTrigger>
                </List.Trailing>
              </List.Item>
              <List.CollapsiblePanel>
                {['Icons', 'Colors'].map((name) => (
                  <List.Item
                    key={name}
                    level={2}
                  >
                    <List.Leading>
                      <List.Image>
                        <Symbol icon={sfFolder} />
                      </List.Image>
                    </List.Leading>
                    <List.Content>
                      <List.Title>{name}</List.Title>
                    </List.Content>
                  </List.Item>
                ))}
              </List.CollapsiblePanel>
            </List.CollapsibleRoot>
            <List.Item level={1}>
              <List.Leading>
                <List.Image>
                  <Symbol icon={sfFolder} />
                </List.Image>
              </List.Leading>
              <List.Content>
                <List.Title>Research</List.Title>
              </List.Content>
            </List.Item>
          </List.CollapsiblePanel>
        </List.CollapsibleRoot>
      </List.Group>
    </List.Section>

    {/* (Several open: see the Accordion's page.) */}
    <List.Section>
      <List.Header>
        <List.Title>Accordion, One Open</List.Title>
      </List.Header>
      <List.Group>
        <List.AccordionRoot>
          {accordionItems.map(([value, title, detail]) => (
            <List.AccordionItem
              key={value}
              value={value}
            >
              <List.Item>
                <List.Content>
                  <List.Title render={<List.AccordionTrigger />}>
                    {title}
                  </List.Title>
                </List.Content>
                <List.Trailing>
                  <List.Detail>{detail}</List.Detail>
                </List.Trailing>
              </List.Item>
              <List.AccordionPanel>
                {['None', 'Daily', 'Weekly'].map((option) => (
                  <List.Item key={option}>
                    <List.Content>
                      <List.Title>{option}</List.Title>
                    </List.Content>
                    {option === 'None' ? (
                      <List.Trailing>
                        <List.Checkmark />
                      </List.Trailing>
                    ) : null}
                  </List.Item>
                ))}
              </List.AccordionPanel>
            </List.AccordionItem>
          ))}
        </List.AccordionRoot>
      </List.Group>
    </List.Section>
  </List.Root>
);

const letters = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'];

/**
 * Contacts by letter, a plain list's sticky headers; its index at its end
 * edge, centered between the page's bars (see List.Index).
 */
const IndexContent: FunctionComponent = () => (
  <List.Root listStyle="plain">
    {Object.entries(contacts).map(([letter, names]) => (
      <List.Section
        key={letter}
        indexValue={letter}
      >
        <List.Header prominence="nested">
          <List.Title>{letter}</List.Title>
        </List.Header>
        <List.Group>
          {names.map((name, index) => (
            <List.Item key={name}>
              <List.Content>
                <List.Title>{name}</List.Title>
                {letter === 'A' && index === 0 ? (
                  <List.Text>
                    The bar above has a hard edge effect on an opaque backing
                    (the page’s background), so rows don’t show through it.
                  </List.Text>
                ) : null}
              </List.Content>
            </List.Item>
          ))}
        </List.Group>
      </List.Section>
    ))}
    <List.Index aria-label="Index">
      {letters.map((letter) => (
        <List.IndexItem key={letter}>{letter}</List.IndexItem>
      ))}
    </List.Index>
  </List.Root>
);

export const listPages: SinkPages = {
  list: { Content: ListContent, title: 'List' },
  'list/editing': { Content: EditingContent, title: 'Editing' },
  'list/expanding': { Content: ExpandingContent, title: 'Expanding Rows' },
  'list/grouped': {
    Content: () => <StyledList listStyle="grouped" />,
    title: 'Grouped',
  },
  'list/index': {
    background: 'plain',
    // (Its first header right below its bar.)
    contentMargin: 0,
    // (Its bar opaque: rows not showing through it, see `IndexContent`.)
    edgeEffect: 'hard',
    edgeTint: 'var(--color-ui-system-background)',
    isLargeTitleHidden: true,
    Content: IndexContent,
    title: 'Index',
  },
  'list/inset-grouped': {
    Content: () => <StyledList listStyle="insetGrouped" />,
    title: 'Inset Grouped',
  },
  'list/outline': {
    Content: () => (
      <StyledList
        isOutlined
        listStyle="insetGrouped"
      />
    ),
    title: 'Outlined',
  },
  'list/outline-plain': {
    background: 'plain',
    Content: () => (
      <StyledList
        isOutlined
        listStyle="plain"
      />
    ),
    title: 'Plain, Outlined',
  },
  'list/plain': {
    background: 'plain',
    Content: () => <StyledList listStyle="plain" />,
    title: 'Plain',
  },
  'list/reordering': { Content: ReorderingContent, title: 'Reordering' },
  'list/sidebar': {
    // (On a sidebar's glass, as it's shown: in a Sidebar.Root.)
    Content: () => (
      <Sidebar.Root style={{ '--uikit-sidebar-margin': '16px' }}>
        <StyledList listStyle="sidebar" />
      </Sidebar.Root>
    ),
    title: 'Sidebar',
  },
  'list/swipe': { Content: SwipeContent, title: 'Swipe Actions' },
};
