import { FunctionComponent, ReactNode, useMemo, useState } from 'react';

import {
  Button,
  CheckboxGroup,
  DatePicker,
  forwardClick,
  Header,
  List,
  type ListReorderChange,
  Navigation,
  Page,
  Segmented,
  Slider,
  Stepper,
  Switch,
  Symbol,
  Toolbar,
  useCreateDatePickerHandle,
  useCreateReorderHandle,
  Viewport,
} from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  type PartProps,
  usePartControls,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import {
  sfArchiveboxFill,
  sfChevronBackward,
  sfCircleFill,
  sfEllipsis,
  sfEnvelopeBadgeFill,
  sfEnvelopeOpenFill,
  sfFlagFill,
  sfMinus,
  sfPlus,
  sfSunMax,
  sfSunMin,
  sfTrashFill,
} from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import {
  contacts,
  messages,
  planets,
  settings,
  settingsPages,
} from './content.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const settingsCode = `const [minutes, setMinutes] = useState(5);

<Header.Root>
  <Viewport.BlockStart>
    <Toolbar.Root placement="block-start">
      <Toolbar.Title><span>Settings</span></Toolbar.Title>
    </Toolbar.Root>
  </Viewport.BlockStart>
  <Page.Root>
    <Viewport.Padding edge="block-start" />
    <Header.LargeTitle><span>Settings</span></Header.LargeTitle>
    <List.Root>
      <List.Section>
        <List.Group>
          <List.Item onClick={forwardClick('[role=switch]')}>
            <List.Leading>
              <List.Image style={{ backgroundColor: … }} variant="rounded">…</List.Image>
            </List.Leading>
            <List.Content>
              <List.Title>Airplane Mode</List.Title>
            </List.Content>
            <List.Trailing>
              <Switch.Root aria-label="Airplane Mode"><Switch.Thumb /></Switch.Root>
            </List.Trailing>
          </List.Item>
          <List.Item>
            <List.Leading>
              <List.Image …>…</List.Image>
            </List.Leading>
            <List.Content>
              <List.Title render={<button type="button" />} onClick={…}>Wi-Fi</List.Title>
            </List.Content>
            <List.Trailing>
              <List.Detail>Home</List.Detail>
            </List.Trailing>
            <List.Trailing>
              <List.DrillIn />
            </List.Trailing>
          </List.Item>
        </List.Group>
      </List.Section>
      <List.Section>
        <List.Header prominence="nested"><List.Title render={<h3 />}>Display</List.Title></List.Header>
        <List.Group>
          <List.Item>
            <List.Span>
              <Segmented.Root aria-label="Appearance" defaultValue="automatic">…</Segmented.Root>
            </List.Span>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Title>Text Size</List.Title>
            </List.Content>
            <List.Trailing>
              <Segmented.Root aria-label="Text Size" defaultValue="M">…</Segmented.Root>
            </List.Trailing>
          </List.Item>
          <List.Item>
            <List.Span>
              <Slider.Root defaultValue={60}>…</Slider.Root>
            </List.Span>
          </List.Item>
          <List.Item>
            <List.Content>
              <List.Title>Auto-Lock</List.Title>
            </List.Content>
            <List.Trailing>
              <List.Detail>{minutes} min</List.Detail>
            </List.Trailing>
            <List.Trailing>
              <Stepper.Root value={minutes} onValueChange={setMinutes}>…</Stepper.Root>
            </List.Trailing>
          </List.Item>
        </List.Group>
        <List.Footer>…</List.Footer>
      </List.Section>
    </List.Root>
    <Viewport.Padding edge="block-end" />
  </Page.Root>
</Header.Root>`;

const scheduleCode = `const [isScheduled, setIsScheduled] = useState(false);
// It ends once it has started.
const [fromTime, setFromTime] = useState(new Date(2025, 3, 20, 19, 0));
const [toTime, setToTime] = useState(new Date(2025, 3, 20, 23, 0));
const from = useCreateDatePickerHandle();
const to = useCreateDatePickerHandle();

<List.Root>
  <List.Section>
    <List.Group>
      {/* The switch opens the rows below it, together. */}
      <List.CollapsibleRoot open={isScheduled}>
        <List.Item onClick={forwardClick('[role=switch]')}>
          <List.Content>
            <List.Title>Scheduled</List.Title>
          </List.Content>
          <List.Trailing>
            <Switch.Root aria-label="Scheduled" checked={isScheduled} onCheckedChange={setIsScheduled}>
              <Switch.Thumb />
            </Switch.Root>
          </List.Trailing>
        </List.Item>
        <List.CollapsiblePanel>
          {/* One time's roll open at a time. */}
          <List.AccordionRoot>
            <List.AccordionItem value="from">
              {/* The whole row toggles the picker's roll. */}
              <List.Item onClick={forwardClick('[data-date-picker-part=collapsed-button]')}>
                <List.Content>
                  <List.Title>From</List.Title>
                </List.Content>
                <List.Trailing>
                  <DatePicker.Root handle={from} mode="time" value={fromTime} onValueChange={setFromTime} />
                </List.Trailing>
              </List.Item>
              {/* Its time roll, below it (closed with the rows around it). */}
              <DatePicker.Expandable handle={from} />
            </List.AccordionItem>
            <List.AccordionItem value="to">
              <List.Item onClick={forwardClick('[data-date-picker-part=collapsed-button]')}>
                <List.Content>
                  <List.Title>To</List.Title>
                </List.Content>
                <List.Trailing>
                  <DatePicker.Root handle={to} min={fromTime} mode="time" value={toTime} onValueChange={setToTime} />
                </List.Trailing>
              </List.Item>
              <DatePicker.Expandable handle={to} />
            </List.AccordionItem>
          </List.AccordionRoot>
        </List.CollapsiblePanel>
      </List.CollapsibleRoot>
      <List.Item onClick={forwardClick('[role=switch]')}>
        <List.Content>
          <List.Title>Manually Enable Until Tomorrow</List.Title>
        </List.Content>
        <List.Trailing>
          <Switch.Root aria-label="Manually Enable Until Tomorrow">
            <Switch.Thumb />
          </Switch.Root>
        </List.Trailing>
      </List.Item>
    </List.Group>
  </List.Section>
</List.Root>`;

const outlineCode = `// A body of the Solar System, and what orbits it.
type Body = { name: string; orbiting?: Body[] };

const sun: Body = {
  name: 'Sun',
  orbiting: [
    { name: 'Mercury' },
    { name: 'Venus' },
    { name: 'Earth', orbiting: [{ name: 'Moon' }] },
    { name: 'Mars', orbiting: [{ name: 'Phobos' }, { name: 'Deimos' }] },
    {
      name: 'Jupiter',
      orbiting: [{ name: 'Io' }, { name: 'Europa' }, { name: 'Ganymede' }, { name: 'Callisto' }],
    },
  ],
};

// A row at its level; with what orbits it, a collapsible's trigger, its
// orbiters' rows a level deeper in its panel.
const Row = ({ body, level }: { body: Body; level: number }) =>
  body.orbiting ? (
    <List.CollapsibleRoot defaultOpen={level === 0}>
      <List.Item level={level}>
        <List.Content>
          <List.Title render={<List.CollapsibleTrigger />}>{body.name}</List.Title>
        </List.Content>
        <List.Trailing>
          <List.Detail>{body.orbiting.length}</List.Detail>
          <List.Disclosure />
        </List.Trailing>
      </List.Item>
      <List.CollapsiblePanel>
        {body.orbiting.map((orbiter) => (
          <Row key={orbiter.name} body={orbiter} level={level + 1} />
        ))}
      </List.CollapsiblePanel>
    </List.CollapsibleRoot>
  ) : (
    <List.Item level={level}>
      <List.Content>
        <List.Title>{body.name}</List.Title>
      </List.Content>
    </List.Item>
  );

<List.Root>
  <List.Section>
    <List.Group>
      <Row body={sun} level={0} />
    </List.Group>
  </List.Section>
</List.Root>`;

const drillInCode = `// Each page: its title, its rows (title, the page it pushes, detail).
const pages = {
  settings: { title: 'Settings', rows: [['General', 'general']] },
  general: { title: 'General', rows: [['About', 'about'], ['Software Update']] },
  about: { title: 'About', rows: [['Name', undefined, 'My Phone']] },
};
const [keys, setKeys] = useState(['settings']);
const push = (key) => setKeys((current) => [...current, key]);
const pop = () => setKeys((current) => current.slice(0, -1));

<Navigation.Root onBack={pop}>
  <Navigation.SwipeArea />
  <Navigation.Stack>
    {keys.map((key, index) => (
      <Header.Root key={key}>
        <Viewport.BlockStart>
          <Toolbar.Root placement="block-start">
            {/* Each pushed page's back button: staying put between them. */}
            {index > 0 ? (
              <Toolbar.Leading>
                <Navigation.Back aria-label="Back" render={<Toolbar.Button shape="circle" />}>…</Navigation.Back>
              </Toolbar.Leading>
            ) : null}
            <Toolbar.Title><span>{pages[key].title}</span></Toolbar.Title>
          </Toolbar.Root>
        </Viewport.BlockStart>
        <Page.Root>
          <Viewport.Padding edge="block-start" />
          <List.Root>
            <List.Section>
              <List.Group>
                {pages[key].rows.map(([title, page, detail]) => (
                  <List.Item key={title}>
                    <List.Content>
                      {page ? (
                        <List.Title render={<button type="button" />} onClick={() => push(page)}>
                          {title}
                        </List.Title>
                      ) : (
                        <List.Title>{title}</List.Title>
                      )}
                    </List.Content>
                    <List.Trailing>
                      {detail ? <List.Detail>{detail}</List.Detail> : null}
                    </List.Trailing>
                    <List.Trailing>
                      {page ? <List.DrillIn /> : null}
                    </List.Trailing>
                  </List.Item>
                ))}
              </List.Group>
            </List.Section>
          </List.Root>
          <Viewport.Padding edge="block-end" />
        </Page.Root>
      </Header.Root>
    ))}
  </Navigation.Stack>
</Navigation.Root>`;

const editCode = `const [rows, setRows] = useState(['Mercury', 'Venus', 'Earth', 'Mars']);
const [isEditing, setIsEditing] = useState(false);
// Reordering: the app moves its rows (by their dropName).
const reorderRows = useCreateReorderHandle({
  onReorder: (change) => setRows((current) => List.reorder(current, change, (row) => row)),
});
// The list's selection (guide G7: the toolbar reads it).
const [selected, setSelected] = useState([]);

<Viewport.Content>
  <Header.Root>
    <Viewport.BlockStart>
      <Toolbar.Root placement="block-start">
        <Toolbar.Title><span>Planets</span></Toolbar.Title>
        <Toolbar.Trailing>
          <Toolbar.Button prominent={isEditing} onClick={() => setIsEditing(!isEditing)}>
            <Button.Label>{isEditing ? 'Done' : 'Edit'}</Button.Label>
          </Toolbar.Button>
        </Toolbar.Trailing>
      </Toolbar.Root>
    </Viewport.BlockStart>
    <Page.Root>
      <Viewport.Padding edge="block-start" />
      {/* In edit mode, the checkboxes and grabbers slide in. */}
      <List.Root editing={isEditing ? 'both' : 'none'}>
        <List.Section>
          <CheckboxGroup
            value={selected}
            onValueChange={setSelected}
            render={<List.Group reorderHandle={reorderRows} />}
          >
            {rows.map((name) => (
              <List.Item
                key={name}
                dropName={name}
                reorderHandle={reorderRows}
                onClick={isEditing ? forwardClick('[role=checkbox]') : undefined}
              >
                <List.Leading whileEditing="show">
                  <List.Checkbox aria-label={name} value={name} />
                </List.Leading>
                <List.Content>
                  <List.Title>{name}</List.Title>
                </List.Content>
                <List.Trailing whileEditing="show">
                  <List.Grabber aria-label={\`Reorder \${name}\`} />
                </List.Trailing>
                <List.SwipeActions overswipe>…</List.SwipeActions>
              </List.Item>
            ))}
          </CheckboxGroup>
        </List.Section>
      </List.Root>
      <Viewport.Padding edge="block-end" />
    </Page.Root>
  </Header.Root>
</Viewport.Content>
{isEditing ? (
  <Viewport.BlockEnd>
    <Toolbar.Root>
      <Toolbar.Leading />
      <Toolbar.Title><span>{selected.length} Selected</span></Toolbar.Title>
      <Toolbar.Trailing>
        <Toolbar.Button destructive disabled={selected.length === 0} onClick={…}>
          <Button.Label>Delete</Button.Label>
        </Toolbar.Button>
      </Toolbar.Trailing>
    </Toolbar.Root>
  </Viewport.BlockEnd>
) : null}`;

const editButtonsCode = `const [rows, setRows] = useState(['Mercury', 'Venus', 'Earth', 'Mars']);
const [added, setAdded] = useState(0);

<List.Root>
  <List.Section>
    <List.Group>
      {rows.map((name) => (
        <List.Item key={name}>
          <List.Leading>
            {/* Minus: opens the row's Delete (its trailing swipe actions). */}
            <List.SwipeActionsTrigger
              render={
                <List.EditButton aria-label={\`Delete \${name}\`} tint="var(--color-ui-system-red)">
                  <Symbol icon={sfMinus} />
                </List.EditButton>
              }
            />
          </List.Leading>
          <List.Content>
            <List.Title>{name}</List.Title>
          </List.Content>
          {/* Opened by the minus only; swiping closes it. */}
          <List.SwipeActions overswipe allowSwipe="conceal">
            <List.SwipeAction
              label="Delete"
              tint="var(--color-ui-system-red)"
              onClick={() => setRows(rows.filter((row) => row !== name))}
            >
              <Symbol icon={sfTrashFill} />
            </List.SwipeAction>
          </List.SwipeActions>
        </List.Item>
      ))}
      {/* The whole row inserts: its button; the plus its sign. */}
      <List.Item>
        <List.Leading>
          <List.EditButton aria-hidden="true" render={<span />} tint="var(--color-ui-system-green)">
            <Symbol icon={sfPlus} />
          </List.EditButton>
        </List.Leading>
        <List.Content>
          <List.Button
            onClick={() => {
              setRows([...rows, \`Planet \${added + 1}\`]);
              setAdded(added + 1);
            }}
          >
            Add Planet
          </List.Button>
        </List.Content>
      </List.Item>
    </List.Group>
  </List.Section>
</List.Root>`;

const sectionsCode = `const [inner, setInner] = useState([
  ['Mercury', '0.39 AU'], ['Venus', '0.72 AU'], ['Earth', '1 AU'], ['Mars', '1.52 AU'],
]);
const [outer, setOuter] = useState(['Jupiter', 'Saturn', 'Uranus', 'Neptune']);
const reorderInner = useCreateReorderHandle({
  onReorder: (change) => setInner((current) => List.reorder(current, change, ([name]) => name)),
});
const [isInnerEditing, setIsInnerEditing] = useState(false);
const [isOuterEditing, setIsOuterEditing] = useState(false);

<List.Root>
  {/* Reordering: grabbers slide in, details and chevrons out. */}
  <List.Section editing={isInnerEditing ? 'trailing' : 'none'}>
    <List.Header>
      <List.Title>Inner Planets</List.Title>
      <List.Action onClick={() => setIsInnerEditing(!isInnerEditing)}>
        {isInnerEditing ? 'Done' : 'Edit'}
      </List.Action>
    </List.Header>
    <List.Group reorderHandle={reorderInner}>
      {inner.map(([name, distance]) => (
        // Home stays where it is: exempt from its section's edit mode.
        <List.Item
          key={name}
          dropName={name}
          editing={name === 'Earth' ? 'none' : undefined}
          reorderHandle={reorderInner}
        >
          <List.Content>
            <List.Title>{name}</List.Title>
          </List.Content>
          <List.Trailing whileEditing="hide">
            <List.Detail>{distance}</List.Detail>
          </List.Trailing>
          <List.Trailing whileEditing="hide">
            <List.DrillIn />
          </List.Trailing>
          <List.Trailing whileEditing="show">
            <List.Grabber aria-label={\`Reorder \${name}\`} />
          </List.Trailing>
        </List.Item>
      ))}
    </List.Group>
  </List.Section>
  {/* Deleting: minus buttons slide in. */}
  <List.Section editing={isOuterEditing ? 'leading' : 'none'}>
    <List.Header>
      <List.Title>Outer Planets</List.Title>
      <List.Action onClick={() => setIsOuterEditing(!isOuterEditing)}>
        {isOuterEditing ? 'Done' : 'Edit'}
      </List.Action>
    </List.Header>
    <List.Group>
      {outer.map((name) => (
        <List.Item key={name}>
          <List.Leading whileEditing="show">
            <List.EditButton
              aria-label={\`Delete \${name}\`}
              tint="var(--color-ui-system-red)"
              onClick={() => setOuter(outer.filter((row) => row !== name))}
            >
              <Symbol icon={sfMinus} />
            </List.EditButton>
          </List.Leading>
          <List.Content>
            <List.Title>{name}</List.Title>
          </List.Content>
        </List.Item>
      ))}
    </List.Group>
  </List.Section>
</List.Root>`;

const acrossCode = `const initial = {
  inner: ['Mercury', 'Venus', 'Earth', 'Mars'],
  outer: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
  dwarf: ['Ceres', 'Pluto'],
};
const [planets, setPlanets] = useState(initial);
const [isEditing, setIsEditing] = useState(false);
const [selected, setSelected] = useState([]);
// One handle across the sections: the app moves its rows (by their dropName,
// in lists named by their targets' dropName).
const reorderPlanets = useCreateReorderHandle({
  onReorder: (change) =>
    setPlanets((current) => List.reorder(current, change, (name) => name)),
});

const row = (name) => (
  <List.Item key={name} dropName={name} reorderHandle={reorderPlanets}>
    <List.Leading whileEditing="show">
      <List.Checkbox
        aria-label={name}
        checked={selected.includes(name)}
        onCheckedChange={(isChecked) =>
          setSelected((current) =>
            isChecked ? [...current, name] : current.filter((other) => other !== name))}
      />
    </List.Leading>
    <List.Content>
      <List.Title>{name}</List.Title>
    </List.Content>
    <List.Trailing whileEditing="show">
      <List.Grabber
        aria-label={\`Reorder \${name}\`}
        // A selected row's grabber drags all selected rows (it first).
        onPointerDown={() => {
          if (selected.length > 1 && selected.includes(name)) {
            reorderPlanets.grab([name, ...selected.filter((other) => other !== name)]);
          }
        }}
      />
    </List.Trailing>
  </List.Item>
);

<List.Root editing={isEditing ? 'both' : 'none'}>
  <List.Section>
    <List.Header><List.Title>Inner Planets</List.Title></List.Header>
    <List.Group>
      {/* The Sun stays first: its planets' gaps are after it. */}
      <List.Item dropName="Sun" editing="none">
        <List.Content><List.Title>(not a planet) Sun</List.Title></List.Content>
      </List.Item>
      <List.DropGroup dropName="inner" reorderHandle={reorderPlanets}>
        {planets.inner.map(row)}
      </List.DropGroup>
    </List.Group>
  </List.Section>
  <List.Section>
    <List.Header><List.Title>Outer Planets</List.Title></List.Header>
    <List.Group dropName="outer" reorderHandle={reorderPlanets}>
      {planets.outer.map(row)}
    </List.Group>
  </List.Section>
  <List.Section>
    <List.Header><List.Title>Dwarf Planets</List.Title></List.Header>
    <List.Group>
      {planets.dwarf.map(row)}
      {/* Only added to at the end. */}
      <List.DropTarget dropName="dwarf" reorderHandle={reorderPlanets} />
    </List.Group>
  </List.Section>
</List.Root>`;

const inboxCode = `const archive = () => {…};

<List.Root listStyle="plain">
  <List.Section>
    <List.Group>
      <List.Item>
        <List.Leading>
          {/* Unread: a dot in the image's place. */}
          <List.Image
            aria-label="Unread"
            role="img"
            style={{ color: 'var(--color-ui-primary)', fontSize: '10px' }}
          >
            <Symbol icon={sfCircleFill} />
          </List.Image>
        </List.Leading>
        <List.Content>
          <List.Title render={<button type="button" />} onClick={…}>Kate Brown</List.Title>
          <List.Subtitle>Weekend photos</List.Subtitle>
        </List.Content>
        <List.Trailing>
          <List.Detail>10:00</List.Detail>
        </List.Trailing>
        <List.Trailing>
          <List.DrillIn />
        </List.Trailing>
        {/* The preview, across the row (under the date too). */}
        <List.Below>
          <List.Text>Hi! The photos from the weekend …</List.Text>
        </List.Below>
        <List.SwipeActions side="inline-start" overswipe>
          <List.SwipeAction showLabel label="Read" tint="var(--color-ui-system-blue)" onClick={…}>
            <Symbol icon={sfEnvelopeOpenFill} />
          </List.SwipeAction>
        </List.SwipeActions>
        <List.SwipeActions onOverswipe={archive}>
          <List.SwipeAction showLabel label="More" onClick={…}>…</List.SwipeAction>
          <List.SwipeAction showLabel label="Flag" tint="var(--color-ui-system-orange)" onClick={…}>…</List.SwipeAction>
          <List.SwipeAction showLabel label="Archive" tint="var(--color-ui-system-purple)" onClick={archive}>…</List.SwipeAction>
        </List.SwipeActions>
      </List.Item>
    </List.Group>
  </List.Section>
</List.Root>`;

const indexCode = `// The contacts, by their first letter.
const contacts = { A: ['Aaron', 'Abigail'], B: ['Bella', 'Benjamin'], … };

{/* The list scrolling on its own (here: in a box 32rem high), without a
    scroll bar (an overlay scroll bar would cover the index). */}
<div style={{ height: '32rem', overflow: 'auto', scrollbarWidth: 'none' }}>
  <List.Root listStyle="plain">
    {Object.entries(contacts).map(([letter, names]) => (
      <List.Section key={letter} indexValue={letter}>
        <List.Header prominence="nested">
          <List.Title>{letter}</List.Title>
        </List.Header>
        <List.Group>…</List.Group>
      </List.Section>
    ))}
    {/* At the list's end edge, centered on what's in view of it; each
        letter jumps to its section (by its indexValue). */}
    <List.Index aria-label="Index">
      {Object.keys(contacts).map((letter) => (
        <List.IndexItem key={letter}>{letter}</List.IndexItem>
      ))}
    </List.Index>
  </List.Root>
</div>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/**
 * Isotopes by their element (in the periodic table's order): each element
 * its section (its name the heading), its symbol its index value.
 */
const elements: readonly (readonly [
  symbol: string,
  name: string,
  isotopes: readonly (readonly [name: string, isStable: boolean])[],
])[] = [
  [
    'H',
    'Hydrogen',
    [
      ['Protium', true],
      ['Deuterium', true],
      ['Tritium', false],
    ],
  ],
  [
    'He',
    'Helium',
    [
      ['Helium-3', true],
      ['Helium-4', true],
    ],
  ],
  [
    'Li',
    'Lithium',
    [
      ['Lithium-6', true],
      ['Lithium-7', true],
    ],
  ],
  [
    'Be',
    'Beryllium',
    [
      ['Beryllium-9', true],
      ['Beryllium-10', false],
    ],
  ],
  [
    'B',
    'Boron',
    [
      ['Boron-10', true],
      ['Boron-11', true],
    ],
  ],
  [
    'C',
    'Carbon',
    [
      ['Carbon-12', true],
      ['Carbon-13', true],
      ['Carbon-14', false],
    ],
  ],
  [
    'N',
    'Nitrogen',
    [
      ['Nitrogen-14', true],
      ['Nitrogen-15', true],
    ],
  ],
  [
    'O',
    'Oxygen',
    [
      ['Oxygen-16', true],
      ['Oxygen-17', true],
      ['Oxygen-18', true],
    ],
  ],
  ['F', 'Fluorine', [['Fluorine-19', true]]],
  [
    'Ne',
    'Neon',
    [
      ['Neon-20', true],
      ['Neon-21', true],
      ['Neon-22', true],
    ],
  ],
  [
    'Na',
    'Sodium',
    [
      ['Sodium-22', false],
      ['Sodium-23', true],
    ],
  ],
  [
    'Mg',
    'Magnesium',
    [
      ['Magnesium-24', true],
      ['Magnesium-25', true],
      ['Magnesium-26', true],
    ],
  ],
  [
    'Al',
    'Aluminium',
    [
      ['Aluminium-26', false],
      ['Aluminium-27', true],
    ],
  ],
  [
    'Si',
    'Silicon',
    [
      ['Silicon-28', true],
      ['Silicon-29', true],
      ['Silicon-30', true],
    ],
  ],
  [
    'P',
    'Phosphorus',
    [
      ['Phosphorus-31', true],
      ['Phosphorus-32', false],
    ],
  ],
  [
    'S',
    'Sulfur',
    [
      ['Sulfur-32', true],
      ['Sulfur-33', true],
      ['Sulfur-34', true],
    ],
  ],
  [
    'Cl',
    'Chlorine',
    [
      ['Chlorine-35', true],
      ['Chlorine-37', true],
    ],
  ],
  [
    'Ar',
    'Argon',
    [
      ['Argon-36', true],
      ['Argon-38', true],
      ['Argon-40', true],
    ],
  ],
  [
    'K',
    'Potassium',
    [
      ['Potassium-39', true],
      ['Potassium-40', false],
      ['Potassium-41', true],
    ],
  ],
  [
    'Ca',
    'Calcium',
    [
      ['Calcium-40', true],
      ['Calcium-42', true],
      ['Calcium-44', true],
    ],
  ],
];

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const elementsCode = `// Isotopes by their element, in the periodic table's order.
const elements = [
  ['H', 'Hydrogen', [['Protium', true], ['Deuterium', true], ['Tritium', false]]],
  ['He', 'Helium', [['Helium-3', true], ['Helium-4', true]]],
  …
];

<div style={{ height: '32rem', overflow: 'auto', scrollbarWidth: 'none' }}>
  <List.Root listStyle="plain">
    {elements.map(([symbol, name, isotopes]) => (
      // Its symbol its value in the index, its name the heading.
      <List.Section key={symbol} indexValue={symbol}>
        <List.Header prominence="nested">
          <List.Title>{name}</List.Title>
        </List.Header>
        <List.Group>
          {isotopes.map(([isotope, isStable]) => (
            <List.Item key={isotope}>
              <List.Content>
                <List.Title>{isotope}</List.Title>
              </List.Content>
              <List.Trailing>
                <List.Detail>{isStable ? 'Stable' : 'Radioactive'}</List.Detail>
              </List.Trailing>
            </List.Item>
          ))}
        </List.Group>
      </List.Section>
    ))}
    <List.Index aria-label="Elements">
      {elements.map(([symbol]) => (
        <List.IndexItem key={symbol}>{symbol}</List.IndexItem>
      ))}
    </List.Index>
  </List.Root>
</div>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** A small dot in the tint, in the image's place (Mail's unread mark). */
const unreadStyle = { color: 'var(--color-ui-primary)', fontSize: '10px' };

/** A settings page: switches, drill-ins, and controls in rows. */
const SettingsScreen: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [minutes, setMinutes] = useState(5);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Header.LargeTitle': [],
            'List.Content': [],
            'List.Detail': [],
            'List.DrillIn': [],
            'List.Footer': [],
            'List.Group': [],
            'List.Header': ['prominence'],
            'List.Image': ['style', 'variant'],
            'List.Item': ['onClick'],
            'List.Leading': [],
            'List.Root': [],
            'List.Section': [],
            'List.Span': [],
            'List.Title': ['onClick', 'render'],
            'List.Trailing': [],
            'Page.Root': [],
            'Segmented.Highlight': [],
            'Segmented.Item': ['value'],
            'Segmented.Root': ['aria-label', 'defaultValue', 'onValueChange'],
            'Slider.Control': [],
            'Slider.Indicator': [],
            'Slider.Root': ['defaultValue', 'onValueCommitted'],
            'Slider.Symbol': ['edge'],
            'Slider.Thumb': ['aria-label'],
            'Slider.Track': [],
            'Stepper.Decrement': [],
            'Stepper.Group': [],
            'Stepper.Increment': [],
            'Stepper.Input': ['aria-label'],
            'Stepper.Root': ['max', 'min', 'onValueChange', 'value'],
            'Switch.Root': ['aria-label', 'onCheckedChange'],
            'Switch.Thumb': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Viewport.BlockStart': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('list-composition-settings') },
  );

  return (
    <Component
      hasInputGuards
      isInline
      controls={[partControls]}
      id="list-composition-settings"
      log={log}
      screen="flow"
      stage="phone"
      state={[partState]}
      title="List as a settings page"
    >
      <Header.Root>
        <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
          <Toolbar.Root
            {...partProps['Toolbar.Root']}
            placement="block-start"
          >
            <Toolbar.Title {...partProps['Toolbar.Title']}>
              <span>Settings</span>
            </Toolbar.Title>
          </Toolbar.Root>
        </Viewport.BlockStart>
        <Page.Root {...partProps['Page.Root']}>
          <Viewport.Padding
            {...partProps['Viewport.Padding']}
            edge="block-start"
          />
          <Header.LargeTitle {...partProps['Header.LargeTitle']}>
            <span>Settings</span>
          </Header.LargeTitle>

          <List.Root {...partProps['List.Root']}>
            <List.Section {...partProps['List.Section']}>
              <List.Group {...partProps['List.Group']}>
                {settings.map(({ color, detail, icon, title }, index) =>
                  index === 0 ? (
                    <List.Item
                      key={title}
                      {...partProps['List.Item']}
                      onClick={forwardClick('[role=switch]')}
                    >
                      <List.Leading {...partProps['List.Leading']}>
                        <List.Image
                          {...partProps['List.Image']}
                          style={{ backgroundColor: color }}
                          variant="rounded"
                        >
                          <Symbol
                            {...partProps.Symbol}
                            icon={icon}
                          />
                        </List.Image>
                      </List.Leading>
                      <List.Content {...partProps['List.Content']}>
                        <List.Title {...partProps['List.Title']}>
                          {title}
                        </List.Title>
                      </List.Content>
                      <List.Trailing {...partProps['List.Trailing']}>
                        <Switch.Root
                          {...partProps['Switch.Root']}
                          aria-label={title}
                          onCheckedChange={(isChecked: boolean) =>
                            addLog(`${title}: ${String(isChecked)}`)
                          }
                        >
                          <Switch.Thumb {...partProps['Switch.Thumb']} />
                        </Switch.Root>
                      </List.Trailing>
                    </List.Item>
                  ) : (
                    <List.Item
                      key={title}
                      {...partProps['List.Item']}
                    >
                      <List.Leading {...partProps['List.Leading']}>
                        <List.Image
                          {...partProps['List.Image']}
                          style={{ backgroundColor: color }}
                          variant="rounded"
                        >
                          <Symbol
                            {...partProps.Symbol}
                            icon={icon}
                          />
                        </List.Image>
                      </List.Leading>
                      <List.Content {...partProps['List.Content']}>
                        <List.Title
                          {...partProps['List.Title']}
                          render={<button type="button" />}
                          onClick={() => addLog(`${title} clicked`)}
                        >
                          {title}
                        </List.Title>
                      </List.Content>
                      <List.Trailing {...partProps['List.Trailing']}>
                        <List.Detail {...partProps['List.Detail']}>
                          {detail}
                        </List.Detail>
                      </List.Trailing>
                      <List.Trailing {...partProps['List.Trailing']}>
                        <List.DrillIn {...partProps['List.DrillIn']} />
                      </List.Trailing>
                    </List.Item>
                  ),
                )}
              </List.Group>
            </List.Section>
            <List.Section {...partProps['List.Section']}>
              <List.Header
                {...partProps['List.Header']}
                prominence="nested"
              >
                <List.Title
                  {...partProps['List.Title']}
                  render={<h3 />}
                >
                  Display
                </List.Title>
              </List.Header>
              <List.Group {...partProps['List.Group']}>
                <List.Item {...partProps['List.Item']}>
                  <List.Span {...partProps['List.Span']}>
                    <Segmented.Root
                      {...partProps['Segmented.Root']}
                      aria-label="Appearance"
                      defaultValue="automatic"
                      onValueChange={(value: unknown) =>
                        addLog(`appearance: ${String(value)}`)
                      }
                    >
                      <Segmented.Item
                        {...partProps['Segmented.Item']}
                        value="light"
                      >
                        Light
                      </Segmented.Item>
                      <Segmented.Item
                        {...partProps['Segmented.Item']}
                        value="dark"
                      >
                        Dark
                      </Segmented.Item>
                      <Segmented.Item
                        {...partProps['Segmented.Item']}
                        value="automatic"
                      >
                        Automatic
                      </Segmented.Item>
                      <Segmented.Highlight
                        {...partProps['Segmented.Highlight']}
                      />
                    </Segmented.Root>
                  </List.Span>
                </List.Item>
                <List.Item {...partProps['List.Item']}>
                  <List.Content {...partProps['List.Content']}>
                    <List.Title {...partProps['List.Title']}>
                      Text Size
                    </List.Title>
                  </List.Content>
                  <List.Trailing {...partProps['List.Trailing']}>
                    <Segmented.Root
                      {...partProps['Segmented.Root']}
                      aria-label="Text Size"
                      defaultValue="M"
                      onValueChange={(value: unknown) =>
                        addLog(`text size: ${String(value)}`)
                      }
                    >
                      <Segmented.Item
                        {...partProps['Segmented.Item']}
                        value="S"
                      >
                        S
                      </Segmented.Item>
                      <Segmented.Item
                        {...partProps['Segmented.Item']}
                        value="M"
                      >
                        M
                      </Segmented.Item>
                      <Segmented.Item
                        {...partProps['Segmented.Item']}
                        value="L"
                      >
                        L
                      </Segmented.Item>
                      <Segmented.Highlight
                        {...partProps['Segmented.Highlight']}
                      />
                    </Segmented.Root>
                  </List.Trailing>
                </List.Item>
                <List.Item {...partProps['List.Item']}>
                  <List.Span {...partProps['List.Span']}>
                    <Slider.Root
                      {...partProps['Slider.Root']}
                      defaultValue={60}
                      onValueCommitted={(value: number | readonly number[]) =>
                        addLog(`brightness: ${String(value)}`)
                      }
                    >
                      <Slider.Symbol
                        {...partProps['Slider.Symbol']}
                        edge="min"
                      >
                        <Symbol
                          {...partProps.Symbol}
                          icon={sfSunMin}
                        />
                      </Slider.Symbol>
                      <Slider.Control {...partProps['Slider.Control']}>
                        <Slider.Track {...partProps['Slider.Track']}>
                          <Slider.Indicator
                            {...partProps['Slider.Indicator']}
                          />
                          <Slider.Thumb
                            {...partProps['Slider.Thumb']}
                            aria-label="Brightness"
                          />
                        </Slider.Track>
                      </Slider.Control>
                      <Slider.Symbol
                        {...partProps['Slider.Symbol']}
                        edge="max"
                      >
                        <Symbol
                          {...partProps.Symbol}
                          icon={sfSunMax}
                        />
                      </Slider.Symbol>
                    </Slider.Root>
                  </List.Span>
                </List.Item>
                <List.Item {...partProps['List.Item']}>
                  <List.Content {...partProps['List.Content']}>
                    <List.Title {...partProps['List.Title']}>
                      Auto-Lock
                    </List.Title>
                  </List.Content>
                  <List.Trailing {...partProps['List.Trailing']}>
                    <List.Detail {...partProps['List.Detail']}>
                      {minutes} min
                    </List.Detail>
                  </List.Trailing>
                  <List.Trailing {...partProps['List.Trailing']}>
                    <Stepper.Root
                      {...partProps['Stepper.Root']}
                      max={10}
                      min={1}
                      value={minutes}
                      onValueChange={(value: number | null) => {
                        addLog(`auto-lock: ${String(value)}`);
                        setMinutes(value ?? 1);
                      }}
                    >
                      <Stepper.Group {...partProps['Stepper.Group']}>
                        <Stepper.Input
                          {...partProps['Stepper.Input']}
                          aria-label="Auto-Lock"
                        />
                        <Stepper.Decrement
                          {...partProps['Stepper.Decrement']}
                        />
                        <Stepper.Increment
                          {...partProps['Stepper.Increment']}
                        />
                      </Stepper.Group>
                    </Stepper.Root>
                  </List.Trailing>
                </List.Item>
              </List.Group>
              <List.Footer {...partProps['List.Footer']}>
                Settings take effect at once, without a Done button.
              </List.Footer>
            </List.Section>
          </List.Root>
          <Viewport.Padding
            {...partProps['Viewport.Padding']}
            edge="block-end"
          />
        </Page.Root>
      </Header.Root>
    </Component>
  );
};

/**
 * Night Shift's schedule: its switch shows (or hides) the From and To rows
 * together, below it; their time rolls below them in turn.
 */
const Schedule: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [isScheduled, setIsScheduled] = useState(false);
  // It ends once it has started.
  const [fromTime, setFromTime] = useState(() => new Date(2025, 3, 20, 19, 0));
  const [toTime, setToTime] = useState(() => new Date(2025, 3, 20, 23, 0));
  const from = useCreateDatePickerHandle();
  const to = useCreateDatePickerHandle();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'DatePicker.Root': [
              'handle',
              'min',
              'mode',
              'onValueChange',
              'value',
            ],
            'List.AccordionItem': ['value'],
            'List.AccordionRoot': [],
            'List.CollapsiblePanel': [],
            'List.CollapsibleRoot': ['defaultOpen', 'onOpenChange', 'open'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': ['level', 'onClick'],
            'List.Root': ['style'],
            'List.Section': [],
            'List.Title': ['render'],
            'List.Trailing': [],
            'Switch.Root': [
              'Enable',
              'Until',
              'aria-label',
              'checked',
              'onCheckedChange',
            ],
            'Switch.Thumb': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('list-composition-schedule') },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[partControls]}
      id="list-composition-schedule"
      log={log}
      state={[partState]}
      title="List with rows expanding together"
    >
      <List.Root
        {...partProps['List.Root']}
        style={{ width: 'min(402px, 100%)' }}
      >
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <List.CollapsibleRoot
              {...partProps['List.CollapsibleRoot']}
              open={isScheduled}
            >
              <List.Item
                {...partProps['List.Item']}
                onClick={forwardClick('[role=switch]')}
              >
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>
                    Scheduled
                  </List.Title>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  <Switch.Root
                    {...partProps['Switch.Root']}
                    aria-label="Scheduled"
                    checked={isScheduled}
                    onCheckedChange={(isChecked: boolean) => {
                      addLog(`scheduled: ${String(isChecked)}`);
                      setIsScheduled(isChecked);
                    }}
                  >
                    <Switch.Thumb {...partProps['Switch.Thumb']} />
                  </Switch.Root>
                </List.Trailing>
              </List.Item>
              <List.CollapsiblePanel {...partProps['List.CollapsiblePanel']}>
                <List.AccordionRoot {...partProps['List.AccordionRoot']}>
                  <List.AccordionItem
                    {...partProps['List.AccordionItem']}
                    value="from"
                  >
                    <List.Item
                      {...partProps['List.Item']}
                      onClick={forwardClick(
                        '[data-date-picker-part=collapsed-button]',
                      )}
                    >
                      <List.Content {...partProps['List.Content']}>
                        <List.Title {...partProps['List.Title']}>
                          From
                        </List.Title>
                      </List.Content>
                      <List.Trailing {...partProps['List.Trailing']}>
                        <DatePicker.Root
                          {...partProps['DatePicker.Root']}
                          handle={from}
                          mode="time"
                          value={fromTime}
                          onValueChange={(next: Date) => {
                            addLog(`from: ${next.toLocaleTimeString()}`);
                            setFromTime(next);
                          }}
                        />
                      </List.Trailing>
                    </List.Item>
                    <DatePicker.Expandable handle={from} />
                  </List.AccordionItem>
                  <List.AccordionItem
                    {...partProps['List.AccordionItem']}
                    value="to"
                  >
                    <List.Item
                      {...partProps['List.Item']}
                      onClick={forwardClick(
                        '[data-date-picker-part=collapsed-button]',
                      )}
                    >
                      <List.Content {...partProps['List.Content']}>
                        <List.Title {...partProps['List.Title']}>To</List.Title>
                      </List.Content>
                      <List.Trailing {...partProps['List.Trailing']}>
                        <DatePicker.Root
                          {...partProps['DatePicker.Root']}
                          handle={to}
                          min={fromTime}
                          mode="time"
                          value={toTime}
                          onValueChange={(next: Date) => {
                            addLog(`to: ${next.toLocaleTimeString()}`);
                            setToTime(next);
                          }}
                        />
                      </List.Trailing>
                    </List.Item>
                    <DatePicker.Expandable handle={to} />
                  </List.AccordionItem>
                </List.AccordionRoot>
              </List.CollapsiblePanel>
            </List.CollapsibleRoot>
            <List.Item
              {...partProps['List.Item']}
              onClick={forwardClick('[role=switch]')}
            >
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>
                  Manually Enable Until Tomorrow
                </List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <Switch.Root
                  {...partProps['Switch.Root']}
                  aria-label="Manually Enable Until Tomorrow"
                  onCheckedChange={(isChecked: boolean) =>
                    addLog(`manually: ${String(isChecked)}`)
                  }
                >
                  <Switch.Thumb {...partProps['Switch.Thumb']} />
                </Switch.Root>
              </List.Trailing>
            </List.Item>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** A body of the Solar System, and what orbits it. */
type Body = { readonly name: string; readonly orbiting?: readonly Body[] };

const sun: Body = {
  name: 'Sun',
  orbiting: [
    { name: 'Mercury' },
    { name: 'Venus' },
    { name: 'Earth', orbiting: [{ name: 'Moon' }] },
    { name: 'Mars', orbiting: [{ name: 'Phobos' }, { name: 'Deimos' }] },
    {
      name: 'Jupiter',
      orbiting: [
        { name: 'Io' },
        { name: 'Europa' },
        { name: 'Ganymede' },
        { name: 'Callisto' },
      ],
    },
  ],
};

/**
 * A body's row at its level; with what orbits it, a collapsible's trigger,
 * its orbiters' rows a level deeper in its panel.
 */
// (A function, not a component: the code shown has its parts, not a tag.)
const outlineRow = (
  body: Body,
  level: number,
  onOpenChange: (name: string, isOpen: boolean) => void,
  partProps: PartProps = {},
): ReactNode =>
  body.orbiting ? (
    <List.CollapsibleRoot
      key={body.name}
      {...partProps['List.CollapsibleRoot']}
      defaultOpen={level === 0}
      onOpenChange={(isOpen: boolean) => onOpenChange(body.name, isOpen)}
    >
      <List.Item
        {...partProps['List.Item']}
        level={level}
      >
        <List.Content {...partProps['List.Content']}>
          <List.Title
            {...partProps['List.Title']}
            render={
              <List.CollapsibleTrigger
                {...partProps['List.CollapsibleTrigger']}
              />
            }
          >
            {body.name}
          </List.Title>
        </List.Content>
        <List.Trailing {...partProps['List.Trailing']}>
          <List.Detail {...partProps['List.Detail']}>
            {body.orbiting.length}
          </List.Detail>
          <List.Disclosure {...partProps['List.Disclosure']} />
        </List.Trailing>
      </List.Item>
      <List.CollapsiblePanel {...partProps['List.CollapsiblePanel']}>
        {body.orbiting.map((orbiter) =>
          outlineRow(orbiter, level + 1, onOpenChange, partProps),
        )}
      </List.CollapsiblePanel>
    </List.CollapsibleRoot>
  ) : (
    <List.Item
      key={body.name}
      {...partProps['List.Item']}
      level={level}
    >
      <List.Content {...partProps['List.Content']}>
        <List.Title {...partProps['List.Title']}>{body.name}</List.Title>
      </List.Content>
    </List.Item>
  );

/** The Solar System as an outline: bodies, what orbits them, indented. */
const Outline: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.CollapsiblePanel': [],
            'List.CollapsibleRoot': ['defaultOpen', 'onOpenChange'],
            'List.CollapsibleTrigger': [],
            'List.Content': [],
            'List.Detail': [],
            'List.Disclosure': [],
            'List.Group': [],
            'List.Item': ['level'],
            'List.Root': [],
            'List.Section': [],
            'List.Title': ['render'],
            'List.Trailing': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('list-composition-outline') },
  );

  return (
    <Component
      isInline
      controls={[partControls]}
      id="list-composition-outline"
      log={log}
      stage="phone"
      state={[partState]}
      title="List outline"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Viewport.Padding
          {...partProps['Viewport.Padding']}
          edge="block-start"
        />
        <List.Root {...partProps['List.Root']}>
          <List.Section {...partProps['List.Section']}>
            <List.Group {...partProps['List.Group']}>
              {outlineRow(
                sun,
                0,
                (name: string, isOpen: boolean) =>
                  addLog(`${name}: ${isOpen ? 'open' : 'closed'}`),
                partProps,
              )}
            </List.Group>
          </List.Section>
        </List.Root>
        <Viewport.Padding
          {...partProps['Viewport.Padding']}
          edge="block-end"
        />
      </Viewport.Content>
    </Component>
  );
};

/** Settings' pages, drilled into by their rows, in a navigation. */
const DrillIn: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [keys, setKeys] = useState<readonly string[]>(['settings']);
  const push = (key: string) => {
    addLog(`push: ${key}`);
    setKeys((current) => [...current, key]);
  };
  const pop = () => {
    addLog('pop');
    setKeys((current) => current.slice(0, -1));
  };

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'List.Content': [],
            'List.Detail': [],
            'List.DrillIn': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
            'List.Trailing': [],
            'Navigation.Back': ['aria-label', 'render'],
            'Navigation.Root': ['onBack'],
            'Navigation.Stack': [],
            'Navigation.SwipeArea': [],
            'Page.Root': [],
            'Toolbar.Button': ['shape'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Viewport.BlockStart': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('list-composition-drill-in') },
  );

  return (
    <Component
      isInline
      controls={[partControls]}
      id="list-composition-drill-in"
      log={log}
      stage="phone"
      state={[partState]}
      title="List drilling into pages"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Navigation.Root
          {...partProps['Navigation.Root']}
          onBack={pop}
        >
          <Navigation.SwipeArea {...partProps['Navigation.SwipeArea']} />
          <Navigation.Stack {...partProps['Navigation.Stack']}>
            {keys.map((key, index) => {
              const page = settingsPages[key];
              if (!page) return null;

              return (
                <Header.Root key={key}>
                  <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                    <Toolbar.Root
                      {...partProps['Toolbar.Root']}
                      placement="block-start"
                    >
                      {index > 0 ? (
                        <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                          <Navigation.Back
                            {...partProps['Navigation.Back']}
                            aria-label="Back"
                            render={
                              <Toolbar.Button
                                {...partProps['Toolbar.Button']}
                                shape="circle"
                              />
                            }
                          >
                            <Button.Icon {...partProps['Button.Icon']}>
                              <Symbol
                                {...partProps.Symbol}
                                icon={sfChevronBackward}
                              />
                            </Button.Icon>
                          </Navigation.Back>
                        </Toolbar.Leading>
                      ) : null}
                      <Toolbar.Title {...partProps['Toolbar.Title']}>
                        <span>{page.title}</span>
                      </Toolbar.Title>
                    </Toolbar.Root>
                  </Viewport.BlockStart>
                  <Page.Root {...partProps['Page.Root']}>
                    <Viewport.Padding
                      {...partProps['Viewport.Padding']}
                      edge="block-start"
                    />
                    <List.Root {...partProps['List.Root']}>
                      <List.Section {...partProps['List.Section']}>
                        <List.Group {...partProps['List.Group']}>
                          {page.rows.map(([title, target, detail]) => (
                            <List.Item
                              key={title}
                              {...partProps['List.Item']}
                            >
                              <List.Content {...partProps['List.Content']}>
                                {target ? (
                                  <List.Title
                                    {...partProps['List.Title']}
                                    render={<button type="button" />}
                                    onClick={() => push(target)}
                                  >
                                    {title}
                                  </List.Title>
                                ) : (
                                  <List.Title {...partProps['List.Title']}>
                                    {title}
                                  </List.Title>
                                )}
                              </List.Content>
                              <List.Trailing {...partProps['List.Trailing']}>
                                {detail ? (
                                  <List.Detail {...partProps['List.Detail']}>
                                    {detail}
                                  </List.Detail>
                                ) : null}
                              </List.Trailing>
                              <List.Trailing {...partProps['List.Trailing']}>
                                {target ? (
                                  <List.DrillIn
                                    {...partProps['List.DrillIn']}
                                  />
                                ) : null}
                              </List.Trailing>
                            </List.Item>
                          ))}
                        </List.Group>
                      </List.Section>
                    </List.Root>
                    <Viewport.Padding
                      {...partProps['Viewport.Padding']}
                      edge="block-end"
                    />
                  </Page.Root>
                </Header.Root>
              );
            })}
          </Navigation.Stack>
        </Navigation.Root>
      </Viewport.Content>
    </Component>
  );
};

/** Planets, edited: selected, reordered, deleted from a toolbar. */
const EditMode: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [rows, setRows] = useState<readonly string[]>(planets);
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const reorderRows = useCreateReorderHandle({
    onReorder: (change: ListReorderChange) => {
      addLog(
        `reorder: ${String(change.items[0]?.name)} after ${change.target.after ?? '(start)'}`,
      );
      setRows((current) => List.reorder(current, change, (row: string) => row));
    },
  });
  const remove = (names: readonly string[]) => {
    addLog(`delete: ${names.join(', ')}`);
    setRows((current) => current.filter((row) => !names.includes(row)));
    setSelected((current) => current.filter((row) => !names.includes(row)));
  };

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            CheckboxGroup: ['onValueChange', 'render', 'value'],
            Symbol: ['icon'],
            'Button.Label': [],
            'List.Checkbox': ['aria-label', 'value'],
            'List.Content': [],
            'List.Grabber': ['aria-label'],
            'List.Group': ['reorderHandle'],
            'List.Item': ['dropName', 'onClick', 'reorderHandle'],
            'List.Leading': ['whileEditing'],
            'List.Root': ['editing'],
            'List.Section': [],
            'List.SwipeAction': ['label', 'onClick', 'tint'],
            'List.SwipeActions': [],
            'List.Title': [],
            'List.Trailing': ['whileEditing'],
            'Page.Root': [],
            'Toolbar.Button': [
              'destructive',
              'disabled',
              'onClick',
              'prominent',
            ],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
            'Viewport.BlockEnd': [],
            'Viewport.BlockStart': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('list-composition-edit') },
  );

  return (
    <Component
      isInline
      controls={[partControls]}
      id="list-composition-edit"
      log={log}
      stage="phone"
      state={[partState]}
      title="List in edit mode"
    >
      <>
        <Viewport.Content {...partProps['Viewport.Content']}>
          <Header.Root>
            <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
              <Toolbar.Root
                {...partProps['Toolbar.Root']}
                placement="block-start"
              >
                <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                  <Toolbar.Button
                    {...partProps['Toolbar.Button']}
                    onClick={() => {
                      addLog('reset');
                      setRows(planets);
                    }}
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      Reset
                    </Button.Label>
                  </Toolbar.Button>
                </Toolbar.Leading>
                <Toolbar.Title {...partProps['Toolbar.Title']}>
                  <span>Planets</span>
                </Toolbar.Title>
                <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                  <Toolbar.Button
                    {...partProps['Toolbar.Button']}
                    prominent={isEditing}
                    onClick={() => {
                      addLog(isEditing ? 'done' : 'edit');
                      setIsEditing(!isEditing);
                      setSelected([]);
                    }}
                  >
                    <Button.Label {...partProps['Button.Label']}>
                      {isEditing ? 'Done' : 'Edit'}
                    </Button.Label>
                  </Toolbar.Button>
                </Toolbar.Trailing>
              </Toolbar.Root>
            </Viewport.BlockStart>
            <Page.Root {...partProps['Page.Root']}>
              <Viewport.Padding
                {...partProps['Viewport.Padding']}
                edge="block-start"
              />
              <List.Root
                {...partProps['List.Root']}
                editing={isEditing ? 'both' : 'none'}
              >
                <List.Section {...partProps['List.Section']}>
                  <CheckboxGroup
                    {...partProps.CheckboxGroup}
                    value={selected}
                    render={
                      <List.Group
                        {...partProps['List.Group']}
                        reorderHandle={reorderRows}
                      />
                    }
                    onValueChange={(value: string[]) => setSelected(value)}
                  >
                    {rows.map((name) => (
                      <List.Item
                        key={name}
                        {...partProps['List.Item']}
                        dropName={name}
                        reorderHandle={reorderRows}
                        onClick={
                          isEditing
                            ? forwardClick('[role=checkbox]')
                            : undefined
                        }
                      >
                        <List.Leading
                          {...partProps['List.Leading']}
                          whileEditing="show"
                        >
                          <List.Checkbox
                            {...partProps['List.Checkbox']}
                            aria-label={name}
                            value={name}
                          />
                        </List.Leading>
                        <List.Content {...partProps['List.Content']}>
                          <List.Title {...partProps['List.Title']}>
                            {name}
                          </List.Title>
                        </List.Content>
                        <List.Trailing
                          {...partProps['List.Trailing']}
                          whileEditing="show"
                        >
                          <List.Grabber
                            {...partProps['List.Grabber']}
                            aria-label={`Reorder ${name}`}
                          />
                        </List.Trailing>
                        <List.SwipeActions
                          {...partProps['List.SwipeActions']}
                          overswipe
                        >
                          <List.SwipeAction
                            {...partProps['List.SwipeAction']}
                            label="Delete"
                            tint="var(--color-ui-system-red)"
                            onClick={() => remove([name])}
                          >
                            <Symbol
                              {...partProps.Symbol}
                              icon={sfTrashFill}
                            />
                          </List.SwipeAction>
                        </List.SwipeActions>
                      </List.Item>
                    ))}
                  </CheckboxGroup>
                </List.Section>
              </List.Root>
              <Viewport.Padding
                {...partProps['Viewport.Padding']}
                edge="block-end"
              />
            </Page.Root>
          </Header.Root>
        </Viewport.Content>
        {isEditing ? (
          <Viewport.BlockEnd {...partProps['Viewport.BlockEnd']}>
            <Toolbar.Root {...partProps['Toolbar.Root']}>
              <Toolbar.Leading {...partProps['Toolbar.Leading']} />
              <Toolbar.Title {...partProps['Toolbar.Title']}>
                <span>{selected.length} Selected</span>
              </Toolbar.Title>
              <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                <Toolbar.Button
                  {...partProps['Toolbar.Button']}
                  destructive
                  disabled={selected.length === 0}
                  onClick={() => remove(selected)}
                >
                  <Button.Label {...partProps['Button.Label']}>
                    Delete
                  </Button.Label>
                </Toolbar.Button>
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Viewport.BlockEnd>
        ) : null}
      </>
    </Component>
  );
};

/** Planets, deleted by their minus (opening Delete), inserted by a plus. */
const EditButtons: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [rows, setRows] = useState<readonly string[]>(planets.slice(0, 4));
  const [added, setAdded] = useState(0);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Label': [],
            'List.Button': ['onClick'],
            'List.Content': [],
            'List.EditButton': ['aria-hidden', 'aria-label', 'render', 'tint'],
            'List.Group': [],
            'List.Item': [],
            'List.Leading': [],
            'List.Root': [],
            'List.Section': [],
            'List.SwipeAction': ['label', 'onClick', 'tint'],
            'List.SwipeActions': ['allowSwipe', 'overswipe'],
            'List.SwipeActionsTrigger': ['render'],
            'List.Title': [],
            'Page.Root': [],
            'Toolbar.Button': ['onClick'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Viewport.BlockStart': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('list-composition-edit-buttons') },
  );

  return (
    <Component
      isInline
      controls={[partControls]}
      id="list-composition-edit-buttons"
      log={log}
      stage="phone"
      state={[partState]}
      title="List with edit buttons"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Header.Root>
          <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
            <Toolbar.Root
              {...partProps['Toolbar.Root']}
              placement="block-start"
            >
              <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                <Toolbar.Button
                  {...partProps['Toolbar.Button']}
                  onClick={() => {
                    addLog('reset');
                    setRows(planets.slice(0, 4));
                    setAdded(0);
                  }}
                >
                  <Button.Label {...partProps['Button.Label']}>
                    Reset
                  </Button.Label>
                </Toolbar.Button>
              </Toolbar.Leading>
              <Toolbar.Title {...partProps['Toolbar.Title']}>
                <span>Planets</span>
              </Toolbar.Title>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root {...partProps['Page.Root']}>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-start"
            />
            <List.Root {...partProps['List.Root']}>
              <List.Section {...partProps['List.Section']}>
                <List.Group {...partProps['List.Group']}>
                  {rows.map((name) => (
                    <List.Item
                      key={name}
                      {...partProps['List.Item']}
                    >
                      <List.Leading {...partProps['List.Leading']}>
                        <List.SwipeActionsTrigger
                          {...partProps['List.SwipeActionsTrigger']}
                          render={
                            <List.EditButton
                              {...partProps['List.EditButton']}
                              aria-label={`Delete ${name}`}
                              tint="var(--color-ui-system-red)"
                            >
                              <Symbol
                                {...partProps.Symbol}
                                icon={sfMinus}
                              />
                            </List.EditButton>
                          }
                        />
                      </List.Leading>
                      <List.Content {...partProps['List.Content']}>
                        <List.Title {...partProps['List.Title']}>
                          {name}
                        </List.Title>
                      </List.Content>
                      <List.SwipeActions
                        {...partProps['List.SwipeActions']}
                        overswipe
                        allowSwipe="conceal"
                      >
                        <List.SwipeAction
                          {...partProps['List.SwipeAction']}
                          label="Delete"
                          tint="var(--color-ui-system-red)"
                          onClick={() => {
                            addLog(`delete: ${name}`);
                            setRows((current) =>
                              current.filter((row) => row !== name),
                            );
                          }}
                        >
                          <Symbol
                            {...partProps.Symbol}
                            icon={sfTrashFill}
                          />
                        </List.SwipeAction>
                      </List.SwipeActions>
                    </List.Item>
                  ))}
                  {/* The whole row inserts: its button; the plus its sign. */}
                  <List.Item {...partProps['List.Item']}>
                    <List.Leading {...partProps['List.Leading']}>
                      <List.EditButton
                        {...partProps['List.EditButton']}
                        aria-hidden="true"
                        render={<span />}
                        tint="var(--color-ui-system-green)"
                      >
                        <Symbol
                          {...partProps.Symbol}
                          icon={sfPlus}
                        />
                      </List.EditButton>
                    </List.Leading>
                    <List.Content {...partProps['List.Content']}>
                      <List.Button
                        {...partProps['List.Button']}
                        onClick={() => {
                          const name = `Planet ${String(added + 1)}`;
                          addLog(`insert: ${name}`);
                          setRows((current) => [...current, name]);
                          setAdded(added + 1);
                        }}
                      >
                        Add Planet
                      </List.Button>
                    </List.Content>
                  </List.Item>
                </List.Group>
              </List.Section>
            </List.Root>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-end"
            />
          </Page.Root>
        </Header.Root>
      </Viewport.Content>
    </Component>
  );
};

/** An inner planet: its name, its distance from the Sun. */
type InnerPlanet = readonly [string, string];

const innerPlanets = [
  ['Mercury', '0.39 AU'],
  ['Venus', '0.72 AU'],
  ['Earth', '1 AU'],
  ['Mars', '1.52 AU'],
] as const;
const outerPlanets = ['Jupiter', 'Saturn', 'Uranus', 'Neptune'] as const;

/**
 * Two sections in edit modes of their own: one reordering (its details
 * and chevrons making way), one deleting; Earth exempt.
 */
const EditingSections: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [inner, setInner] = useState<readonly InnerPlanet[]>(innerPlanets);
  const [outer, setOuter] = useState<readonly string[]>(outerPlanets);
  const [isInnerEditing, setIsInnerEditing] = useState(false);
  const [isOuterEditing, setIsOuterEditing] = useState(false);
  const reorderInner = useCreateReorderHandle({
    onReorder: (change: ListReorderChange) => {
      addLog(
        `reorder: ${String(change.items[0]?.name)} after ${change.target.after ?? '(start)'}`,
      );
      setInner((current) =>
        List.reorder(current, change, ([name]: InnerPlanet) => name),
      );
    },
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Label': [],
            'List.Action': ['onClick'],
            'List.Content': [],
            'List.Detail': [],
            'List.DrillIn': [],
            'List.EditButton': ['aria-label', 'onClick', 'tint'],
            'List.Grabber': ['aria-label'],
            'List.Group': ['reorderHandle'],
            'List.Header': [],
            'List.Item': ['dropName', 'editing', 'reorderHandle'],
            'List.Leading': ['whileEditing'],
            'List.Root': [],
            'List.Section': ['editing'],
            'List.Title': [],
            'List.Trailing': ['whileEditing'],
            'Page.Root': [],
            'Toolbar.Button': ['onClick'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Viewport.BlockStart': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('list-composition-editing-sections') },
  );

  return (
    <Component
      isInline
      controls={[partControls]}
      id="list-composition-editing-sections"
      log={log}
      stage="phone"
      state={[partState]}
      title="List editing sections separately"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Header.Root>
          <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
            <Toolbar.Root
              {...partProps['Toolbar.Root']}
              placement="block-start"
            >
              <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                <Toolbar.Button
                  {...partProps['Toolbar.Button']}
                  onClick={() => {
                    addLog('reset');
                    setInner(innerPlanets);
                    setOuter(outerPlanets);
                  }}
                >
                  <Button.Label {...partProps['Button.Label']}>
                    Reset
                  </Button.Label>
                </Toolbar.Button>
              </Toolbar.Leading>
              <Toolbar.Title {...partProps['Toolbar.Title']}>
                <span>Planets</span>
              </Toolbar.Title>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root {...partProps['Page.Root']}>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-start"
            />
            <List.Root {...partProps['List.Root']}>
              <List.Section
                {...partProps['List.Section']}
                editing={isInnerEditing ? 'trailing' : 'none'}
              >
                <List.Header {...partProps['List.Header']}>
                  <List.Title {...partProps['List.Title']}>
                    Inner Planets
                  </List.Title>
                  <List.Action
                    {...partProps['List.Action']}
                    onClick={() => {
                      addLog(`inner: ${isInnerEditing ? 'done' : 'edit'}`);
                      setIsInnerEditing(!isInnerEditing);
                    }}
                  >
                    {isInnerEditing ? 'Done' : 'Edit'}
                  </List.Action>
                </List.Header>
                <List.Group
                  {...partProps['List.Group']}
                  reorderHandle={reorderInner}
                >
                  {inner.map(([name, distance]) => (
                    <List.Item
                      key={name}
                      {...partProps['List.Item']}
                      dropName={name}
                      editing={name === 'Earth' ? 'none' : undefined}
                      reorderHandle={reorderInner}
                    >
                      <List.Content {...partProps['List.Content']}>
                        <List.Title {...partProps['List.Title']}>
                          {name}
                        </List.Title>
                      </List.Content>
                      <List.Trailing
                        {...partProps['List.Trailing']}
                        whileEditing="hide"
                      >
                        <List.Detail {...partProps['List.Detail']}>
                          {distance}
                        </List.Detail>
                      </List.Trailing>
                      <List.Trailing
                        {...partProps['List.Trailing']}
                        whileEditing="hide"
                      >
                        <List.DrillIn {...partProps['List.DrillIn']} />
                      </List.Trailing>
                      <List.Trailing
                        {...partProps['List.Trailing']}
                        whileEditing="show"
                      >
                        <List.Grabber
                          {...partProps['List.Grabber']}
                          aria-label={`Reorder ${name}`}
                        />
                      </List.Trailing>
                    </List.Item>
                  ))}
                </List.Group>
              </List.Section>
              <List.Section
                {...partProps['List.Section']}
                editing={isOuterEditing ? 'leading' : 'none'}
              >
                <List.Header {...partProps['List.Header']}>
                  <List.Title {...partProps['List.Title']}>
                    Outer Planets
                  </List.Title>
                  <List.Action
                    {...partProps['List.Action']}
                    onClick={() => {
                      addLog(`outer: ${isOuterEditing ? 'done' : 'edit'}`);
                      setIsOuterEditing(!isOuterEditing);
                    }}
                  >
                    {isOuterEditing ? 'Done' : 'Edit'}
                  </List.Action>
                </List.Header>
                <List.Group {...partProps['List.Group']}>
                  {outer.map((name) => (
                    <List.Item
                      key={name}
                      {...partProps['List.Item']}
                    >
                      <List.Leading
                        {...partProps['List.Leading']}
                        whileEditing="show"
                      >
                        <List.EditButton
                          {...partProps['List.EditButton']}
                          aria-label={`Delete ${name}`}
                          tint="var(--color-ui-system-red)"
                          onClick={() => {
                            addLog(`delete: ${name}`);
                            setOuter((current) =>
                              current.filter((row) => row !== name),
                            );
                          }}
                        >
                          <Symbol
                            {...partProps.Symbol}
                            icon={sfMinus}
                          />
                        </List.EditButton>
                      </List.Leading>
                      <List.Content {...partProps['List.Content']}>
                        <List.Title {...partProps['List.Title']}>
                          {name}
                        </List.Title>
                      </List.Content>
                    </List.Item>
                  ))}
                </List.Group>
              </List.Section>
            </List.Root>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-end"
            />
          </Page.Root>
        </Header.Root>
      </Viewport.Content>
    </Component>
  );
};

/** The Solar System's planets, by section. */
const solarPlanets = {
  inner: ['Mercury', 'Venus', 'Earth', 'Mars'],
  outer: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
  dwarf: ['Ceres', 'Pluto'],
} as const satisfies Record<string, readonly string[]>;

type SolarPlanets = Readonly<
  Record<keyof typeof solarPlanets, readonly string[]>
>;

/**
 * Planets moved across sections by one reorder handle: the Sun pinned
 * first (a drop group after it), a group, a drop target at a group's end;
 * selected rows dragged together.
 */
const AcrossSections: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [bodies, setBodies] = useState<SolarPlanets>(solarPlanets);
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState<readonly string[]>([]);
  const reorderPlanets = useCreateReorderHandle({
    onReorder: (change: ListReorderChange) => {
      const { after = '–', before = '–', name, part } = change.target;
      addLog(
        `reorder: ${change.items.map((item) => String(item.name)).join(', ')} → ${part} ${String(name)}, after ${after}, before ${before}`,
      );
      setBodies((current) =>
        List.reorder(current, change, (planet: string) => planet),
      );
    },
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Label': [],
            'List.Checkbox': ['aria-label', 'checked', 'onCheckedChange'],
            'List.Content': [],
            'List.Grabber': ['aria-label', 'onPointerDown'],
            'List.Group': ['dropName', 'reorderHandle'],
            'List.Header': [],
            'List.Item': ['dropName', 'editing', 'reorderHandle'],
            'List.Leading': ['whileEditing'],
            'List.Root': ['editing'],
            'List.Section': [],
            'List.Title': [],
            'List.Trailing': ['whileEditing'],
            'Page.Root': [],
            'Toolbar.Button': ['onClick', 'prominent'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
            'Viewport.BlockStart': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('list-composition-across-sections') },
  );
  const row = (name: string) => (
    <List.Item
      key={name}
      {...partProps['List.Item']}
      dropName={name}
      reorderHandle={reorderPlanets}
    >
      <List.Leading
        {...partProps['List.Leading']}
        whileEditing="show"
      >
        <List.Checkbox
          {...partProps['List.Checkbox']}
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
      <List.Content {...partProps['List.Content']}>
        <List.Title {...partProps['List.Title']}>{name}</List.Title>
      </List.Content>
      <List.Trailing
        {...partProps['List.Trailing']}
        whileEditing="show"
      >
        <List.Grabber
          {...partProps['List.Grabber']}
          aria-label={`Reorder ${name}`}
          onPointerDown={() => {
            if (selected.length > 1 && selected.includes(name)) {
              reorderPlanets.grab([
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
    <Component
      isInline
      controls={[partControls]}
      id="list-composition-across-sections"
      log={log}
      stage="phone"
      state={[partState]}
      title="List reordering across sections"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Header.Root>
          <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
            <Toolbar.Root
              {...partProps['Toolbar.Root']}
              placement="block-start"
            >
              <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                <Toolbar.Button
                  {...partProps['Toolbar.Button']}
                  onClick={() => {
                    addLog('reset');
                    setBodies(solarPlanets);
                    setSelected([]);
                  }}
                >
                  <Button.Label {...partProps['Button.Label']}>
                    Reset
                  </Button.Label>
                </Toolbar.Button>
              </Toolbar.Leading>
              <Toolbar.Title {...partProps['Toolbar.Title']}>
                <span>Planets</span>
              </Toolbar.Title>
              <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                <Toolbar.Button
                  {...partProps['Toolbar.Button']}
                  prominent={isEditing}
                  onClick={() => {
                    addLog(isEditing ? 'done' : 'edit');
                    setIsEditing(!isEditing);
                    setSelected([]);
                  }}
                >
                  <Button.Label {...partProps['Button.Label']}>
                    {isEditing ? 'Done' : 'Edit'}
                  </Button.Label>
                </Toolbar.Button>
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root {...partProps['Page.Root']}>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-start"
            />
            <List.Root
              {...partProps['List.Root']}
              editing={isEditing ? 'both' : 'none'}
            >
              <List.Section {...partProps['List.Section']}>
                <List.Header {...partProps['List.Header']}>
                  <List.Title {...partProps['List.Title']}>
                    Inner Planets
                  </List.Title>
                </List.Header>
                <List.Group {...partProps['List.Group']}>
                  <List.Item
                    {...partProps['List.Item']}
                    dropName="Sun"
                    editing="none"
                  >
                    <List.Content {...partProps['List.Content']}>
                      <List.Title {...partProps['List.Title']}>
                        (not a planet) Sun
                      </List.Title>
                    </List.Content>
                  </List.Item>
                  <List.DropGroup
                    dropName="inner"
                    reorderHandle={reorderPlanets}
                  >
                    {bodies.inner.map((name) => row(name))}
                  </List.DropGroup>
                </List.Group>
              </List.Section>
              <List.Section {...partProps['List.Section']}>
                <List.Header {...partProps['List.Header']}>
                  <List.Title {...partProps['List.Title']}>
                    Outer Planets
                  </List.Title>
                </List.Header>
                <List.Group
                  {...partProps['List.Group']}
                  dropName="outer"
                  reorderHandle={reorderPlanets}
                >
                  {bodies.outer.map((name) => row(name))}
                </List.Group>
              </List.Section>
              <List.Section {...partProps['List.Section']}>
                <List.Header {...partProps['List.Header']}>
                  <List.Title {...partProps['List.Title']}>
                    Dwarf Planets
                  </List.Title>
                </List.Header>
                <List.Group {...partProps['List.Group']}>
                  {bodies.dwarf.map((name) => row(name))}
                  <List.DropTarget
                    dropName="dwarf"
                    reorderHandle={reorderPlanets}
                  />
                </List.Group>
              </List.Section>
            </List.Root>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-end"
            />
          </Page.Root>
        </Header.Root>
      </Viewport.Content>
    </Component>
  );
};

/** An inbox: unread dots, previews, swipe actions both ways. */
const Inbox: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [archived, setArchived] = useState<readonly string[]>([]);
  const [read, setRead] = useState<readonly string[]>([]);
  const archive = (from: string) => {
    addLog(`archive: ${from}`);
    setArchived((current) => [...current, from]);
  };
  const toggleRead = (from: string) => {
    addLog(`${read.includes(from) ? 'unread' : 'read'}: ${from}`);
    setRead((current) =>
      current.includes(from)
        ? current.filter((name) => name !== from)
        : [...current, from],
    );
  };

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'List.Below': [],
            'List.Content': [],
            'List.Detail': [],
            'List.DrillIn': [],
            'List.Group': [],
            'List.Image': ['aria-label', 'role', 'style'],
            'List.Item': [],
            'List.Leading': [],
            'List.Root': ['listStyle'],
            'List.Section': [],
            'List.Subtitle': [],
            'List.SwipeAction': ['label', 'onClick', 'showLabel', 'tint'],
            'List.SwipeActions': ['onOverswipe', 'overswipe', 'side'],
            'List.Text': [],
            'List.Title': ['onClick', 'render'],
            'List.Trailing': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('list-composition-inbox') },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[partControls]}
      id="list-composition-inbox"
      log={log}
      state={[partState]}
      title="List as an inbox"
    >
      <List.Root
        {...partProps['List.Root']}
        listStyle="plain"
      >
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            {messages
              .filter(({ from }) => !archived.includes(from))
              .map(({ date, from, preview, subject }) => (
                <List.Item
                  key={from}
                  {...partProps['List.Item']}
                >
                  <List.Leading {...partProps['List.Leading']}>
                    {read.includes(from) ? (
                      <List.Image
                        {...partProps['List.Image']}
                        style={unreadStyle}
                      />
                    ) : (
                      <List.Image
                        {...partProps['List.Image']}
                        aria-label="Unread"
                        role="img"
                        style={unreadStyle}
                      >
                        <Symbol
                          {...partProps.Symbol}
                          icon={sfCircleFill}
                        />
                      </List.Image>
                    )}
                  </List.Leading>
                  <List.Content {...partProps['List.Content']}>
                    <List.Title
                      {...partProps['List.Title']}
                      render={<button type="button" />}
                      onClick={() => {
                        addLog(`open: ${from}`);
                        if (!read.includes(from)) toggleRead(from);
                      }}
                    >
                      {from}
                    </List.Title>
                    <List.Subtitle {...partProps['List.Subtitle']}>
                      {subject}
                    </List.Subtitle>
                  </List.Content>
                  <List.Trailing {...partProps['List.Trailing']}>
                    <List.Detail {...partProps['List.Detail']}>
                      {date}
                    </List.Detail>
                  </List.Trailing>
                  <List.Trailing {...partProps['List.Trailing']}>
                    <List.DrillIn {...partProps['List.DrillIn']} />
                  </List.Trailing>
                  <List.Below {...partProps['List.Below']}>
                    <List.Text {...partProps['List.Text']}>{preview}</List.Text>
                  </List.Below>
                  <List.SwipeActions
                    {...partProps['List.SwipeActions']}
                    overswipe
                    side="inline-start"
                  >
                    <List.SwipeAction
                      {...partProps['List.SwipeAction']}
                      showLabel
                      label={read.includes(from) ? 'Unread' : 'Read'}
                      tint="var(--color-ui-system-blue)"
                      onClick={() => toggleRead(from)}
                    >
                      <Symbol
                        {...partProps.Symbol}
                        icon={
                          read.includes(from)
                            ? sfEnvelopeBadgeFill
                            : sfEnvelopeOpenFill
                        }
                      />
                    </List.SwipeAction>
                  </List.SwipeActions>
                  <List.SwipeActions
                    {...partProps['List.SwipeActions']}
                    onOverswipe={() => archive(from)}
                  >
                    <List.SwipeAction
                      {...partProps['List.SwipeAction']}
                      showLabel
                      label="More"
                      onClick={() => addLog(`more: ${from}`)}
                    >
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfEllipsis}
                      />
                    </List.SwipeAction>
                    <List.SwipeAction
                      {...partProps['List.SwipeAction']}
                      showLabel
                      label="Flag"
                      tint="var(--color-ui-system-orange)"
                      onClick={() => addLog(`flag: ${from}`)}
                    >
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfFlagFill}
                      />
                    </List.SwipeAction>
                    <List.SwipeAction
                      {...partProps['List.SwipeAction']}
                      showLabel
                      label="Archive"
                      tint="var(--color-ui-system-purple)"
                      onClick={() => archive(from)}
                    >
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfArchiveboxFill}
                      />
                    </List.SwipeAction>
                  </List.SwipeActions>
                </List.Item>
              ))}
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** Contacts by letter, with an index beside them. */
const Contacts: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Content': [],
            'List.Group': [],
            'List.Header': ['prominence'],
            'List.Index': ['aria-label'],
            'List.IndexItem': ['onClick'],
            'List.Item': [],
            'List.Root': ['listStyle'],
            'List.Section': ['indexValue'],
            'List.Title': ['onClick', 'render'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('list-composition-index') },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[partControls]}
      id="list-composition-index"
      log={log}
      state={[partState]}
      title="List with an index"
    >
      <div className="list-demo-plain">
        <div className="list-demo-scroll">
          <List.Root
            {...partProps['List.Root']}
            listStyle="plain"
          >
            {Object.entries(contacts).map(([letter, names]) => (
              <List.Section
                key={letter}
                {...partProps['List.Section']}
                indexValue={letter}
              >
                <List.Header
                  {...partProps['List.Header']}
                  prominence="nested"
                >
                  <List.Title {...partProps['List.Title']}>{letter}</List.Title>
                </List.Header>
                <List.Group {...partProps['List.Group']}>
                  {names.map((name) => (
                    <List.Item
                      key={name}
                      {...partProps['List.Item']}
                    >
                      <List.Content {...partProps['List.Content']}>
                        <List.Title
                          {...partProps['List.Title']}
                          render={<button type="button" />}
                          onClick={() => addLog(`open: ${name}`)}
                        >
                          {name}
                        </List.Title>
                      </List.Content>
                    </List.Item>
                  ))}
                </List.Group>
              </List.Section>
            ))}
            <List.Index
              {...partProps['List.Index']}
              aria-label="Index"
            >
              {Object.keys(contacts).map((letter) => (
                <List.IndexItem
                  key={letter}
                  {...partProps['List.IndexItem']}
                  onClick={() => addLog(`index: ${letter}`)}
                >
                  {letter}
                </List.IndexItem>
              ))}
            </List.Index>
          </List.Root>
        </div>
      </div>
    </Component>
  );
};

/** Isotopes by element: an index of element symbols, not letters. */
const Elements: FunctionComponent = () => {
  const id = 'list-composition-elements';
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Content': [],
            'List.Detail': [],
            'List.Group': [],
            'List.Header': ['prominence'],
            'List.Index': ['aria-label'],
            'List.IndexItem': ['onClick'],
            'List.Item': [],
            'List.Root': ['listStyle'],
            'List.Section': ['indexValue'],
            'List.Title': [],
            'List.Trailing': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[partControls]}
      id={id}
      log={log}
      state={[partState]}
      title="An index of elements"
    >
      <div className="list-demo-plain">
        <div className="list-demo-scroll">
          <List.Root
            {...partProps['List.Root']}
            listStyle="plain"
          >
            {elements.map(([symbol, name, isotopes]) => (
              <List.Section
                key={symbol}
                {...partProps['List.Section']}
                indexValue={symbol}
              >
                <List.Header
                  {...partProps['List.Header']}
                  prominence="nested"
                >
                  <List.Title {...partProps['List.Title']}>{name}</List.Title>
                </List.Header>
                <List.Group {...partProps['List.Group']}>
                  {isotopes.map(([isotope, isStable]) => (
                    <List.Item
                      key={isotope}
                      {...partProps['List.Item']}
                    >
                      <List.Content {...partProps['List.Content']}>
                        <List.Title {...partProps['List.Title']}>
                          {isotope}
                        </List.Title>
                      </List.Content>
                      <List.Trailing {...partProps['List.Trailing']}>
                        <List.Detail {...partProps['List.Detail']}>
                          {isStable ? 'Stable' : 'Radioactive'}
                        </List.Detail>
                      </List.Trailing>
                    </List.Item>
                  ))}
                </List.Group>
              </List.Section>
            ))}
            <List.Index
              {...partProps['List.Index']}
              aria-label="Elements"
            >
              {elements.map(([symbol]) => (
                <List.IndexItem
                  key={symbol}
                  {...partProps['List.IndexItem']}
                  onClick={() => addLog(`index: ${symbol}`)}
                >
                  {symbol}
                </List.IndexItem>
              ))}
            </List.Index>
          </List.Root>
        </div>
      </div>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['a-settings-page', 'A settings page'],
  ['rows-expanding-together', 'Rows expanding together'],
  ['an-outline', 'An outline'],
  ['drilling-into-pages', 'Drilling into pages'],
  ['edit-mode-and-a-toolbar', 'Edit mode and a toolbar'],
  ['deleting-and-inserting-rows', 'Deleting and inserting rows'],
  ['editing-sections-separately', 'Editing sections separately'],
  ['reordering-across-sections', 'Reordering across sections'],
  ['an-inbox', 'An inbox'],
  ['an-indexed-list', 'An indexed list'],
  ['an-index-of-elements', 'An index of elements'],
];

/** `/list/composition`: lists in pages, navigations, edit modes, inboxes. */
export const ListComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <Heading
      id="a-settings-page"
      level={2}
    >
      A settings page
    </Heading>
    <ul>
      <li>
        As in a settings app: an inset grouped list in a{' '}
        <a href={publicUrl('page')}>Page</a>, under its{' '}
        <a href={publicUrl('header')}>Header</a>.
      </li>
      <li>
        Rows hold the settings’ controls as trailing parts (a{' '}
        <a href={publicUrl('switch')}>Switch</a>, a{' '}
        <a href={publicUrl('segmented')}>Segmented</a> control, a{' '}
        <a href={publicUrl('stepper')}>Stepper</a>), or across the whole row (
        <PartLink
          component="list"
          part="List.Span"
        />
        ): a <a href={publicUrl('segmented')}>Segmented</a> control with its
        options sharing the width, or a <a href={publicUrl('slider')}>Slider</a>{' '}
        between its symbols.
      </li>
      <li>Other rows drill in, with a button title, a detail and a chevron.</li>
      <li>A row with a switch passes its clicks on to it.</li>
      <li>Settings take effect at once.</li>
      <li>
        <strong>Library:</strong> the inset grouped list (
        <PartLink
          component="list"
          part="List.Root"
        />
        ) and its rows’ parts (
        <PartLink
          component="list"
          part="List.Detail"
        />
        ,{' '}
        <PartLink
          component="list"
          part="List.DrillIn"
        />
        ), the controls as trailing parts or across rows (
        <PartLink
          component="list"
          part="List.Span"
        />
        ), and <code>forwardClick</code>.
      </li>
      <li>
        <strong>Demo:</strong> the settings, their values (for example the
        minutes), and logging changes.
      </li>
    </ul>
    <CodeView code={settingsCode} />
    <SettingsScreen />

    <Heading
      id="rows-expanding-together"
      level={2}
    >
      Rows expanding together
    </Heading>
    <ul>
      <li>
        Like a night mode’s schedule: turning on Scheduled slides in its From
        and To rows below it, together. Turning it off slides them out, and the
        rows below follow.
      </li>
      <li>
        Those rows are a{' '}
        <PartLink
          component="list"
          part="List.CollapsiblePanel"
        />{' '}
        among the group’s rows, open while its{' '}
        <PartLink
          component="list"
          part="List.CollapsibleRoot"
        />{' '}
        is (here set by the switch, through <code>open</code>). They have no
        elements of their own, so each row stays a row of the group, with its
        separator, and its corners as the group’s first or last row.
      </li>
      <li>
        Their times open as in a calendar app. Each picker’s button toggles its
        time roll in a row below it (
        <PartLink
          component="date-picker"
          part="DatePicker.Expandable"
        />
        , through a handle), within the rows around it, and closes with them.
      </li>
      <li>
        Only one roll is open at a time. Each time’s row and roll are an{' '}
        <PartLink
          component="list"
          part="List.AccordionItem"
        />{' '}
        of an{' '}
        <PartLink
          component="list"
          part="List.AccordionRoot"
        />
        , so opening one picker closes the other (like Base UI’s Accordion),
        without app state.
      </li>
      <li>
        The schedule ends after it starts: To’s earliest time is From’s (
        <code>min</code>), and earlier times are disabled in its roll.
      </li>
      <li>
        Each time’s row is pressable as a whole, and passes its press on to the
        picker’s button (
        <PartLink
          component="list"
          part="forwardClick"
        />
        ).
      </li>
      <li>
        <strong>Library:</strong> the collapsible rows (
        <PartLink
          component="list"
          part="List.CollapsibleRoot"
        />
        ,{' '}
        <PartLink
          component="list"
          part="List.CollapsiblePanel"
        />
        ), the accordion (
        <PartLink
          component="list"
          part="List.AccordionRoot"
        />
        ,{' '}
        <PartLink
          component="list"
          part="List.AccordionItem"
        />
        ), the switches (
        <PartLink
          component="switch"
          part="Switch.Root"
        />
        ), and the time pickers with their rows (
        <PartLink
          component="date-picker"
          part="DatePicker.Root"
        />
        ,{' '}
        <PartLink
          component="date-picker"
          part="DatePicker.Expandable"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> holding whether it’s scheduled and both times,
        limiting To by From, the rows passing on their presses, and the pickers’
        handles.
      </li>
    </ul>
    <CodeView code={scheduleCode} />
    <Schedule />

    <Heading
      id="an-outline"
      level={2}
    >
      An outline
    </Heading>
    <ul>
      <li>
        A hierarchy, or outline, for example a file manager’s folders. Each
        row’s <code>level</code> (
        <PartLink
          component="list"
          part="List.Item"
        />
        ) indents it by 20px per level, separator included.
      </li>
      <li>
        A row with rows below it in the hierarchy toggles them. Its title is the
        trigger (
        <PartLink
          component="list"
          part="List.CollapsibleTrigger"
        />
        , so the whole row is pressable) of a{' '}
        <PartLink
          component="list"
          part="List.CollapsibleRoot"
        />
        , and its{' '}
        <PartLink
          component="list"
          part="List.Disclosure"
        />{' '}
        turns. The rows one level deeper are in its{' '}
        <PartLink
          component="list"
          part="List.CollapsiblePanel"
        />
        , and close with any panel around them.
      </li>
      <li>
        However deep they go, all rows stay the group’s rows: one card, with its
        corners on the first and last rows shown.
      </li>
      <li>
        <strong>Library:</strong> indenting by <code>level</code>, nesting the
        collapsible rows (
        <PartLink
          component="list"
          part="List.CollapsibleRoot"
        />
        ,{' '}
        <PartLink
          component="list"
          part="List.CollapsibleTrigger"
        />
        ,{' '}
        <PartLink
          component="list"
          part="List.CollapsiblePanel"
        />
        ), and the turning{' '}
        <PartLink
          component="list"
          part="List.Disclosure"
        />
        .
      </li>
      <li>
        <strong>Demo:</strong> the bodies and what orbits them, rendering one
        row per body (recursively, one level deeper each time), the Sun open at
        first, and logging toggles.
      </li>
    </ul>
    <CodeView code={outlineCode} />
    <Outline />

    <Heading
      id="drilling-into-pages"
      level={2}
    >
      Drilling into pages
    </Heading>
    <ul>
      <li>
        Rows with a button title and a{' '}
        <PartLink
          component="list"
          part="List.DrillIn"
        />{' '}
        push a page in a <a href={publicUrl('navigation')}>Navigation</a>.
      </li>
      <li>
        The app keeps the stack (keyed pages in a{' '}
        <PartLink
          component="navigation"
          part="Navigation.Stack"
        />
        ), and the navigation animates between them. The back button stays put,
        in a bar next to the stack.
      </li>
      <li>
        A swipe from the leading edge goes back (<code>onBack</code>).
      </li>
      <li>Rows with a detail and no chevron only show a value.</li>
      <li>
        <strong>Library:</strong> the navigation (
        <PartLink
          component="navigation"
          part="Navigation.Root"
        />
        , with its stack, back button and swipe area), and the rows’ drill-in
        parts.
      </li>
      <li>
        <strong>Demo:</strong> the pages, the stack’s keys (the app’s state),
        and pushing and popping them.
      </li>
    </ul>
    <CodeView code={drillInCode} />
    <DrillIn />

    <Heading
      id="edit-mode-and-a-toolbar"
      level={2}
    >
      Edit mode and a toolbar
    </Heading>
    <ul>
      <li>
        Edit, in the navigation bar, turns on edit mode (
        <PartLink
          component="list"
          part="List.Root"
        />{' '}
        <code>editing</code>).
      </li>
      <li>
        Each row’s{' '}
        <PartLink
          component="list"
          part="List.Checkbox"
        />{' '}
        slides in from its leading edge, and its{' '}
        <PartLink
          component="list"
          part="List.Grabber"
        />{' '}
        from its trailing edge, while the content makes room. Done slides them
        out.
      </li>
      <li>
        The list owns the selection: a{' '}
        <a href={publicUrl('checkbox')}>CheckboxGroup</a> that renders the group
        holds it.
      </li>
      <li>
        The bottom toolbar (in the <a href={publicUrl('viewport')}>Viewport</a>
        ’s block end) reads it to delete the selected rows.
      </li>
      <li>Rows can still be swiped to delete one.</li>
      <li>
        <strong>Library:</strong> edit mode (<code>editing</code>, which slides
        in the rows’{' '}
        <PartLink
          component="list"
          part="List.Checkbox"
        />{' '}
        and{' '}
        <PartLink
          component="list"
          part="List.Grabber"
        />
        ), reordering (with a reorder handle,{' '}
        <PartLink
          component="list"
          part="List.createReorderHandle"
        />
        ), the swipe actions, and the bottom bar (
        <PartLink
          component="viewport"
          part="Viewport.BlockEnd"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> the rows, the edit state and the selection (
        <PartLink
          component="checkbox"
          part="CheckboxGroup"
        />
        ), reordering and deleting them, and the Reset button.
      </li>
    </ul>
    <CodeView code={editCode} />
    <EditMode />

    <Heading
      id="deleting-and-inserting-rows"
      level={2}
    >
      Deleting and inserting rows
    </Heading>
    <ul>
      <li>
        In editing styles, there’s a red minus before each row and a green plus
        before the last one (
        <PartLink
          component="list"
          part="List.EditButton"
        />
        , with its <code>tint</code>).
      </li>
      <li>
        The minus doesn’t delete anything itself. A{' '}
        <PartLink
          component="list"
          part="List.SwipeActionsTrigger"
        />{' '}
        renders it, so it opens the row’s trailing{' '}
        <PartLink
          component="list"
          part="List.SwipeActions"
        />
        , whose Delete removes the row.
      </li>
      <li>
        In edit mode, swiping doesn’t open the actions, but it closes them again
        (<code>allowSwipe=&quot;conceal&quot;</code>), as a press outside the
        row does.
      </li>
      <li>
        The whole insert row is a{' '}
        <PartLink
          component="list"
          part="List.Button"
        />{' '}
        (with the app’s <code>onClick</code>), so pressing it anywhere adds a
        planet. Its plus is only a sign: a{' '}
        <PartLink
          component="list"
          part="List.EditButton"
        />{' '}
        rendered as a <code>span</code>, without a button of its own.
      </li>
      <li>
        <strong>Library:</strong> the edit buttons (
        <PartLink
          component="list"
          part="List.EditButton"
        />
        ), the trigger that opens the row’s actions (
        <PartLink
          component="list"
          part="List.SwipeActionsTrigger"
        />
        ), the swipe actions (
        <PartLink
          component="list"
          part="List.SwipeActions"
        />
        ), and the row-wide button (
        <PartLink
          component="list"
          part="List.Button"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> the rows, naming and adding new planets, deleting
        them, and the Reset button.
      </li>
    </ul>
    <CodeView code={editButtonsCode} />
    <EditButtons />

    <Heading
      id="editing-sections-separately"
      level={2}
    >
      Editing sections separately
    </Heading>
    <ul>
      <li>
        Each section has its own edit mode (
        <PartLink
          component="list"
          part="List.Section"
        />
        ’s <code>editing</code>), toggled by its header’s action. The inner
        planets reorder (<code>trailing</code>, so grabbers slide in), and the
        outer ones delete (<code>leading</code>, so minus buttons slide in).
      </li>
      <li>
        Regular parts make way. Each inner planet’s distance (
        <PartLink
          component="list"
          part="List.Detail"
        />{' '}
        <code>whileEditing=&quot;hide&quot;</code>) and chevron (
        <PartLink
          component="list"
          part="List.DrillIn"
        />
        , hidden by default) slide out as its grabber slides in.
      </li>
      <li>
        Earth stays where it is, because it’s exempt from its section’s mode (
        <PartLink
          component="list"
          part="List.Item"
        />
        ’s <code>editing=&quot;none&quot;</code>). Modes nest from Root to
        Section, Group and Item, each overriding the one around it.
      </li>
      <li>
        <strong>Library:</strong> the edit modes and how they nest (
        <code>editing</code>), the parts sliding in and out (
        <code>whileEditing</code>), reordering (
        <PartLink
          component="list"
          part="List.Grabber"
        />
        ,{' '}
        <PartLink
          component="list"
          part="List.createReorderHandle"
        />
        ), and the edit buttons (
        <PartLink
          component="list"
          part="List.EditButton"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> each section’s edit state, the planets and their
        order, deleting them, and the Reset button.
      </li>
    </ul>
    <CodeView code={sectionsCode} />
    <EditingSections />

    <Heading
      id="reordering-across-sections"
      level={2}
    >
      Reordering across sections
    </Heading>
    <ul>
      <li>
        One reorder handle (
        <PartLink
          component="list"
          part="List.createReorderHandle"
        />
        ; in a component, <code>useCreateReorderHandle</code>) is given to the
        planets’ rows (
        <PartLink
          component="list"
          part="List.Item"
        />{' '}
        <code>reorderHandle</code>, named by <code>dropName</code>) and to where
        they can be dropped, in any section. A row’s{' '}
        <PartLink
          component="list"
          part="List.Grabber"
        />{' '}
        drags it out of its group, the group closes up, and a gap opens where it
        would land, with the groups and sections below making room.
      </li>
      <li>
        Where rows can be dropped is set in JSX:
        <ul>
          <li>
            Inner planets: a{' '}
            <PartLink
              component="list"
              part="List.DropGroup"
            />{' '}
            goes around them (gaps before, between and after its rows, without
            an element of its own), so nothing lands above the Sun, which is a
            row outside it. Once it’s empty, rows can still be dropped back
            below the Sun.
          </li>
          <li>
            Outer planets: the{' '}
            <PartLink
              component="list"
              part="List.Group"
            />{' '}
            gets the handle, which works like a drop group around all its rows.
          </li>
          <li>
            Dwarf planets: there’s only a{' '}
            <PartLink
              component="list"
              part="List.DropTarget"
            />{' '}
            at the group’s end, so rows can only be added there. Once the group
            is empty, it’s still a target.
          </li>
        </ul>
      </li>
      <li>
        On a drop, the handle’s <code>onReorder</code> gets what moved and
        where: the target’s part, its <code>dropName</code>, and the rows{' '}
        <code>after</code> and <code>before</code> the gap. The app keeps its
        planets as lists by section, reordered with{' '}
        <PartLink
          component="list"
          part="List.reorder"
        />
        : the rows are taken out and put after the row before the gap, or into
        an empty section by its name.
      </li>
      <li>
        Several rows can move at once. In edit mode, pressing a selected row’s
        grabber grabs all selected rows (the handle’s <code>grab</code>, by
        their names, with the pressed one first), and they’re dragged together,
        stacked.
      </li>
      <li>
        By keyboard, a focused grabber’s arrow keys move its row to the previous
        or next gap, across sections too, and announce it.
      </li>
      <li>
        <strong>Library:</strong> the handle (
        <PartLink
          component="list"
          part="List.createReorderHandle"
        />
        , with its <code>grab</code>), the targets (
        <PartLink
          component="list"
          part="List.DropGroup"
        />
        ,{' '}
        <PartLink
          component="list"
          part="List.DropTarget"
        />
        ,{' '}
        <PartLink
          component="list"
          part="List.Group"
        />{' '}
        <code>reorderHandle</code>), dragging and moving by keyboard, the
        change’s description, and applying it (
        <PartLink
          component="list"
          part="List.reorder"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> the planets by section, which rows are selected,
        grabbing the selected ones from a grabber, the Reset and Edit buttons,
        and logging changes.
      </li>
    </ul>
    <CodeView code={acrossCode} />
    <AcrossSections />

    <Heading
      id="an-inbox"
      level={2}
    >
      An inbox
    </Heading>
    <ul>
      <li>
        As in a mail app: a plain list of media rows, with a{' '}
        <PartLink
          component="list"
          part="List.Text"
        />{' '}
        preview below the subject. The preview runs across the row in a{' '}
        <PartLink
          component="list"
          part="List.Below"
        />
        , from the sender’s name to the row’s end, under the date too.
      </li>
      <li>An unread dot sits in the image’s place.</li>
      <li>There are swipe actions on both sides, with their labels shown.</li>
      <li>
        Swiping on past the trailing ones archives the message (
        <code>onOverswipe</code>), and the app removes it.
      </li>
      <li>
        <strong>Library:</strong> the media rows (
        <PartLink
          component="list"
          part="List.Subtitle"
        />
        , and{' '}
        <PartLink
          component="list"
          part="List.Text"
        />{' '}
        in a{' '}
        <PartLink
          component="list"
          part="List.Below"
        />{' '}
        aligned with the content), swipe actions on both sides, and overswiping
        (<code>onOverswipe</code>).
      </li>
      <li>
        <strong>Demo:</strong> the messages, their read and archived states, and
        removing archived ones.
      </li>
    </ul>
    <CodeView code={inboxCode} />
    <Inbox />
    <Heading
      id="an-indexed-list"
      level={2}
    >
      An indexed list
    </Heading>
    <ul>
      <li>
        As in a contacts app: a plain list in sections by letter (with sticky
        section titles), and a{' '}
        <PartLink
          component="list"
          part="List.Index"
        />{' '}
        next to it.
      </li>
      <li>
        Pressing or scrubbing over a letter scrolls the list to that letter’s
        section (its <code>indexValue</code>). So dragging across the letters
        scrolls through the list. A letter without contacts jumps to the next
        letter that has some.
      </li>
      <li>
        The list places the index: at its end edge, centered on the part of the
        list in view.
      </li>
      <li>
        The list scrolls on its own here, without a scrollbar, because an
        overlay scrollbar would cover the index.
      </li>
      <li>
        <strong>Library:</strong> the index (
        <PartLink
          component="list"
          part="List.Index"
        />
        ): placing it, pressing and scrubbing over its letters, and jumping to
        their sections; the sticky section headers.
      </li>
      <li>
        <strong>Demo:</strong> the contacts by letter.
      </li>
    </ul>
    <CodeView code={indexCode} />
    <Contacts />

    <Heading
      id="an-index-of-elements"
      level={2}
    >
      An index of elements
    </Heading>
    <ul>
      <li>
        An index doesn’t have to be letters. Here, isotopes are grouped under
        their chemical element: the element’s name heads its section, and its
        symbol (H, He, Li, …) is its key in the index.
      </li>
      <li>
        Each section’s <code>indexValue</code> is its symbol, and each index
        item’s text is the same symbol, so the two match without a{' '}
        <code>value</code> of their own. The sections follow the periodic table,
        not the alphabet: an index jumps by its own order.
      </li>
      <li>
        The same works for groups of letters a language sorts on their own (for
        example “Sch” or “St”), or for any grouping of the app’s.
      </li>
      <li>
        <strong>Library:</strong> the index (
        <PartLink
          component="list"
          part="List.Index"
        />
        ) and its jumps, by value.
      </li>
      <li>
        <strong>Demo:</strong> the elements and their isotopes.
      </li>
    </ul>
    <CodeView code={elementsCode} />
    <Elements />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const listCompositionDemos = [
  SettingsScreen,
  Schedule,
  Outline,
  DrillIn,
  EditMode,
  EditButtons,
  EditingSections,
  AcrossSections,
  Inbox,
  Contacts,
  Elements,
];
