import { sfArchiveboxFill } from '@bradleyhodges/sfsymbols/sfArchiveboxFill';
import { sfChevronBackward } from '@bradleyhodges/sfsymbols/sfChevronBackward';
import { sfCircleFill } from '@bradleyhodges/sfsymbols/sfCircleFill';
import { sfEllipsis } from '@bradleyhodges/sfsymbols/sfEllipsis';
import { sfEnvelopeBadgeFill } from '@bradleyhodges/sfsymbols/sfEnvelopeBadgeFill';
import { sfEnvelopeOpenFill } from '@bradleyhodges/sfsymbols/sfEnvelopeOpenFill';
import { sfFlagFill } from '@bradleyhodges/sfsymbols/sfFlagFill';
import { sfMinus } from '@bradleyhodges/sfsymbols/sfMinus';
import { sfPlus } from '@bradleyhodges/sfsymbols/sfPlus';
import { sfSunMax } from '@bradleyhodges/sfsymbols/sfSunMax';
import { sfSunMin } from '@bradleyhodges/sfsymbols/sfSunMin';
import { sfTrashFill } from '@bradleyhodges/sfsymbols/sfTrashFill';
import { FunctionComponent, useState } from 'react';

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
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';
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
  about: { title: 'About', rows: [['Name', undefined, 'iPhone']] },
};
const [keys, setKeys] = useState(['settings']);
const push = (key) => setKeys((current) => [...current, key]);
const pop = () => setKeys((current) => current.slice(0, -1));

<Navigation.Root onBack={pop}>
  <Navigation.SwipeArea />
  {/* The back button: staying while the pages move. */}
  <Viewport.BlockStart>
    <Toolbar.Root placement="block-start">
      <Toolbar.Leading>
        {keys.length > 1 ? (
          <Navigation.Back aria-label="Back" render={<Toolbar.Button shape="circle" />}>…</Navigation.Back>
        ) : null}
      </Toolbar.Leading>
    </Toolbar.Root>
  </Viewport.BlockStart>
  <Navigation.Stack>
    {keys.map((key) => (
      <Header.Root key={key}>
        <Viewport.BlockStart>
          <Toolbar.Root placement="block-start">
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

<Viewport.Content safeArea="none">
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
                <List.EditButton aria-label={\`Delete \${name}\`} tint="var(--color-ios-system-red)">
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
              tint="var(--color-ios-system-red)"
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
          <List.EditButton aria-hidden="true" render={<span />} tint="var(--color-ios-system-green)">
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
              tint="var(--color-ios-system-red)"
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
        <List.Span>
          {/* Unread: a dot in the image's place. */}
          <List.Image
            aria-label="Unread"
            role="img"
            style={{ color: 'var(--color-ios-primary)', fontSize: '10px' }}
          >
            <Symbol icon={sfCircleFill} />
          </List.Image>
          <List.Title render={<button type="button" />} onClick={…}>Kate Bell</List.Title>
          <List.Detail>09:41</List.Detail>
          <List.DrillIn />
          <List.Subtitle>Weekend photos</List.Subtitle>
          <List.Text>Hi! The photos from the weekend …</List.Text>
          <List.SwipeActions side="inline-start" overswipe>
            <List.SwipeAction showLabel label="Read" tint="var(--color-ios-system-blue)" onClick={…}>
              <Symbol icon={sfEnvelopeOpenFill} />
            </List.SwipeAction>
          </List.SwipeActions>
          <List.SwipeActions onOverswipe={archive}>
            <List.SwipeAction showLabel label="More" onClick={…}>…</List.SwipeAction>
            <List.SwipeAction showLabel label="Flag" tint="var(--color-ios-system-orange)" onClick={…}>…</List.SwipeAction>
            <List.SwipeAction showLabel label="Archive" tint="var(--color-ios-system-purple)" onClick={archive}>…</List.SwipeAction>
          </List.SwipeActions>
        </List.Item>
      </List.Group>
    </List.Section>
  </List.Root>`;

const indexCode = `// The contacts, by their first letter.
  const contacts = { A: ['Aaron', 'Abigail'], B: ['Bella', 'Benjamin'], … };
  
  {/* The list and its index in one cell, as high as the index at least. */}
  <div style={{ display: 'grid', minHeight: '32rem' }}>
    {/* The list fills it, scrolling on its own, without a scroll bar (an
        overlay scroll bar would cover the index). */}
    <div
      id="contacts"
      style={{
        gridArea: '1 / 1',
        height: 0,
        minHeight: '100%',
        overflow: 'auto',
        scrollbarWidth: 'none',
      }}
    >
      <List.Root listStyle="plain">
        {Object.entries(contacts).map(([letter, names]) => (
          <List.Section key={letter} id={\`contacts-\${letter}\`}>
            <List.Header prominence="nested">
              <List.Title>{letter}</List.Title>
            </List.Header>
            <List.Group>…</List.Group>
          </List.Section>
        ))}
      </List.Root>
    </div>
    {/* At the list's edge, centered on its visible height. */}
          <div
      style={{
        alignSelf: 'center',
        gridArea: '1 / 1',
        justifySelf: 'end',
        position: 'relative',
        zIndex: 3,
      }}
    >
      <List.Index aria-label="Index">
        {Object.keys(contacts).map((letter) => (
          <List.IndexItem
            key={letter}
            onClick={() => {
              // The section at the top of the list.
              const list = document.querySelector('#contacts');
              const section = document.querySelector(\`#contacts-\${letter}\`);
              if (!list || !section) return;
              list.scrollTo({
                top: list.scrollTop + section.getBoundingClientRect().top - list.getBoundingClientRect().top,
              });
            }}
          >
            {letter}
          </List.IndexItem>
        ))}
      </List.Index>
    </div>
        </List.Span>
</div>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** A small dot in the tint, in the image's place (Mail's unread mark). */
const unreadStyle = { color: 'var(--color-ios-primary)', fontSize: '10px' };

/** A settings page: switches, drill-ins, and controls in rows. */
const SettingsScreen: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [minutes, setMinutes] = useState(5);

  return (
    <Component
      hasInputGuards
      isInline
      id="list-composition-settings"
      log={log}
      screen="flow"
      stage="phone"
      title="List as a settings page"
    >
      <Header.Root>
        <Viewport.BlockStart>
          <Toolbar.Root placement="block-start">
            <Toolbar.Title>
              <span>Settings</span>
            </Toolbar.Title>
          </Toolbar.Root>
        </Viewport.BlockStart>
        <Page.Root>
          <Viewport.Padding edge="block-start" />
          <Header.LargeTitle>
            <span>Settings</span>
          </Header.LargeTitle>

          <List.Root>
            <List.Section>
              <List.Group>
                {settings.map(({ color, detail, icon, title }, index) =>
                  index === 0 ? (
                    <List.Item
                      key={title}
                      onClick={forwardClick('[role=switch]')}
                    >
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
                      <List.Trailing>
                        <Switch.Root
                          aria-label={title}
                          onCheckedChange={(isChecked: boolean) =>
                            addLog(`${title}: ${String(isChecked)}`)
                          }
                        >
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Trailing>
                    </List.Item>
                  ) : (
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
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => addLog(`${title} clicked`)}
                        >
                          {title}
                        </List.Title>
                      </List.Content>
                      <List.Trailing>
                        <List.Detail>{detail}</List.Detail>
                      </List.Trailing>
                      <List.Trailing>
                        <List.DrillIn />
                      </List.Trailing>
                    </List.Item>
                  ),
                )}
              </List.Group>
            </List.Section>
            <List.Section>
              <List.Header prominence="nested">
                <List.Title render={<h3 />}>Display</List.Title>
              </List.Header>
              <List.Group>
                <List.Item>
                  <List.Span>
                    <Segmented.Root
                      aria-label="Appearance"
                      defaultValue="automatic"
                      onValueChange={(value: unknown) =>
                        addLog(`appearance: ${String(value)}`)
                      }
                    >
                      <Segmented.Item value="light">Light</Segmented.Item>
                      <Segmented.Item value="dark">Dark</Segmented.Item>
                      <Segmented.Item value="automatic">
                        Automatic
                      </Segmented.Item>
                      <Segmented.Highlight />
                    </Segmented.Root>
                  </List.Span>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <List.Title>Text Size</List.Title>
                  </List.Content>
                  <List.Trailing>
                    <Segmented.Root
                      aria-label="Text Size"
                      defaultValue="M"
                      onValueChange={(value: unknown) =>
                        addLog(`text size: ${String(value)}`)
                      }
                    >
                      <Segmented.Item value="S">S</Segmented.Item>
                      <Segmented.Item value="M">M</Segmented.Item>
                      <Segmented.Item value="L">L</Segmented.Item>
                      <Segmented.Highlight />
                    </Segmented.Root>
                  </List.Trailing>
                </List.Item>
                <List.Item>
                  <List.Span>
                    <Slider.Root
                      defaultValue={60}
                      onValueCommitted={(value: number | readonly number[]) =>
                        addLog(`brightness: ${String(value)}`)
                      }
                    >
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
                  <List.Content>
                    <List.Title>Auto-Lock</List.Title>
                  </List.Content>
                  <List.Trailing>
                    <List.Detail>{minutes} min</List.Detail>
                  </List.Trailing>
                  <List.Trailing>
                    <Stepper.Root
                      max={10}
                      min={1}
                      value={minutes}
                      onValueChange={(value: number | null) => {
                        addLog(`auto-lock: ${String(value)}`);
                        setMinutes(value ?? 1);
                      }}
                    >
                      <Stepper.Group>
                        <Stepper.Input aria-label="Auto-Lock" />
                        <Stepper.Decrement />
                        <Stepper.Increment />
                      </Stepper.Group>
                    </Stepper.Root>
                  </List.Trailing>
                </List.Item>
              </List.Group>
              <List.Footer>
                Settings take effect at once, without a Done button.
              </List.Footer>
            </List.Section>
          </List.Root>
          <Viewport.Padding edge="block-end" />
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

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      id="list-composition-schedule"
      log={log}
      title="List with rows expanding together"
    >
      <List.Root style={{ width: 'min(402px, 100%)' }}>
        <List.Section>
          <List.Group>
            <List.CollapsibleRoot open={isScheduled}>
              <List.Item onClick={forwardClick('[role=switch]')}>
                <List.Content>
                  <List.Title>Scheduled</List.Title>
                </List.Content>
                <List.Trailing>
                  <Switch.Root
                    aria-label="Scheduled"
                    checked={isScheduled}
                    onCheckedChange={(isChecked: boolean) => {
                      addLog(`scheduled: ${String(isChecked)}`);
                      setIsScheduled(isChecked);
                    }}
                  >
                    <Switch.Thumb />
                  </Switch.Root>
                </List.Trailing>
              </List.Item>
              <List.CollapsiblePanel>
                <List.AccordionRoot>
                  <List.AccordionItem value="from">
                    <List.Item
                      onClick={forwardClick(
                        '[data-date-picker-part=collapsed-button]',
                      )}
                    >
                      <List.Content>
                        <List.Title>From</List.Title>
                      </List.Content>
                      <List.Trailing>
                        <DatePicker.Root
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
                  <List.AccordionItem value="to">
                    <List.Item
                      onClick={forwardClick(
                        '[data-date-picker-part=collapsed-button]',
                      )}
                    >
                      <List.Content>
                        <List.Title>To</List.Title>
                      </List.Content>
                      <List.Trailing>
                        <DatePicker.Root
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
            <List.Item onClick={forwardClick('[role=switch]')}>
              <List.Content>
                <List.Title>Manually Enable Until Tomorrow</List.Title>
              </List.Content>
              <List.Trailing>
                <Switch.Root
                  aria-label="Manually Enable Until Tomorrow"
                  onCheckedChange={(isChecked: boolean) =>
                    addLog(`manually: ${String(isChecked)}`)
                  }
                >
                  <Switch.Thumb />
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
const OutlineRow: FunctionComponent<{
  readonly body: Body;
  readonly level: number;
  readonly onOpenChange: (name: string, isOpen: boolean) => void;
}> = ({ body, level, onOpenChange }) =>
  body.orbiting ? (
    <List.CollapsibleRoot
      defaultOpen={level === 0}
      onOpenChange={(isOpen: boolean) => onOpenChange(body.name, isOpen)}
    >
      <List.Item level={level}>
        <List.Content>
          <List.Title render={<List.CollapsibleTrigger />}>
            {body.name}
          </List.Title>
        </List.Content>
        <List.Trailing>
          <List.Detail>{body.orbiting.length}</List.Detail>
          <List.Disclosure />
        </List.Trailing>
      </List.Item>
      <List.CollapsiblePanel>
        {body.orbiting.map((orbiter) => (
          <OutlineRow
            key={orbiter.name}
            body={orbiter}
            level={level + 1}
            onOpenChange={onOpenChange}
          />
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

/** The Solar System as an outline: bodies, what orbits them, indented. */
const Outline: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      isInline
      id="list-composition-outline"
      log={log}
      stage="phone"
      title="List outline"
    >
      <Viewport.Content>
        <Viewport.Padding edge="block-start" />
        <List.Root>
          <List.Section>
            <List.Group>
              <OutlineRow
                body={sun}
                level={0}
                onOpenChange={(name: string, isOpen: boolean) =>
                  addLog(`${name}: ${isOpen ? 'open' : 'closed'}`)
                }
              />
            </List.Group>
          </List.Section>
        </List.Root>
        <Viewport.Padding edge="block-end" />
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

  return (
    <Component
      isInline
      id="list-composition-drill-in"
      log={log}
      stage="phone"
      title="List drilling into pages"
    >
      <Viewport.Content safeArea="none">
        <Navigation.Root onBack={pop}>
          <Navigation.SwipeArea />
          <Viewport.BlockStart>
            <Toolbar.Root placement="block-start">
              <Toolbar.Leading>
                {keys.length > 1 ? (
                  <Navigation.Back
                    aria-label="Back"
                    render={<Toolbar.Button shape="circle" />}
                  >
                    <Button.Icon>
                      <Symbol icon={sfChevronBackward} />
                    </Button.Icon>
                  </Navigation.Back>
                ) : null}
              </Toolbar.Leading>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Navigation.Stack>
            {keys.map((key) => {
              const page = settingsPages[key];
              if (!page) return null;

              return (
                <Header.Root key={key}>
                  <Viewport.BlockStart>
                    <Toolbar.Root placement="block-start">
                      <Toolbar.Title>
                        <span>{page.title}</span>
                      </Toolbar.Title>
                    </Toolbar.Root>
                  </Viewport.BlockStart>
                  <Page.Root>
                    <Viewport.Padding edge="block-start" />
                    <List.Root>
                      <List.Section>
                        <List.Group>
                          {page.rows.map(([title, target, detail]) => (
                            <List.Item key={title}>
                              <List.Content>
                                {target ? (
                                  <List.Title
                                    render={<button type="button" />}
                                    onClick={() => push(target)}
                                  >
                                    {title}
                                  </List.Title>
                                ) : (
                                  <List.Title>{title}</List.Title>
                                )}
                              </List.Content>
                              <List.Trailing>
                                {detail ? (
                                  <List.Detail>{detail}</List.Detail>
                                ) : null}
                              </List.Trailing>
                              <List.Trailing>
                                {target ? <List.DrillIn /> : null}
                              </List.Trailing>
                            </List.Item>
                          ))}
                        </List.Group>
                      </List.Section>
                    </List.Root>
                    <Viewport.Padding edge="block-end" />
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

  return (
    <Component
      isInline
      id="list-composition-edit"
      log={log}
      stage="phone"
      title="List in edit mode"
    >
      <>
        <Viewport.Content safeArea="none">
          <Header.Root>
            <Viewport.BlockStart>
              <Toolbar.Root placement="block-start">
                <Toolbar.Leading>
                  <Toolbar.Button
                    onClick={() => {
                      addLog('reset');
                      setRows(planets);
                    }}
                  >
                    <Button.Label>Reset</Button.Label>
                  </Toolbar.Button>
                </Toolbar.Leading>
                <Toolbar.Title>
                  <span>Planets</span>
                </Toolbar.Title>
                <Toolbar.Trailing>
                  <Toolbar.Button
                    prominent={isEditing}
                    onClick={() => {
                      addLog(isEditing ? 'done' : 'edit');
                      setIsEditing(!isEditing);
                      setSelected([]);
                    }}
                  >
                    <Button.Label>{isEditing ? 'Done' : 'Edit'}</Button.Label>
                  </Toolbar.Button>
                </Toolbar.Trailing>
              </Toolbar.Root>
            </Viewport.BlockStart>
            <Page.Root>
              <Viewport.Padding edge="block-start" />
              <List.Root editing={isEditing ? 'both' : 'none'}>
                <List.Section>
                  <CheckboxGroup
                    render={<List.Group reorderHandle={reorderRows} />}
                    value={selected}
                    onValueChange={(value: string[]) => setSelected(value)}
                  >
                    {rows.map((name) => (
                      <List.Item
                        key={name}
                        dropName={name}
                        reorderHandle={reorderRows}
                        onClick={
                          isEditing
                            ? forwardClick('[role=checkbox]')
                            : undefined
                        }
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
                        <List.Trailing whileEditing="show">
                          <List.Grabber aria-label={`Reorder ${name}`} />
                        </List.Trailing>
                        <List.SwipeActions overswipe>
                          <List.SwipeAction
                            label="Delete"
                            tint="var(--color-ios-system-red)"
                            onClick={() => remove([name])}
                          >
                            <Symbol icon={sfTrashFill} />
                          </List.SwipeAction>
                        </List.SwipeActions>
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
              <Toolbar.Title>
                <span>{selected.length} Selected</span>
              </Toolbar.Title>
              <Toolbar.Trailing>
                <Toolbar.Button
                  destructive
                  disabled={selected.length === 0}
                  onClick={() => remove(selected)}
                >
                  <Button.Label>Delete</Button.Label>
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

  return (
    <Component
      isInline
      id="list-composition-edit-buttons"
      log={log}
      stage="phone"
      title="List with edit buttons"
    >
      <Viewport.Content safeArea="none">
        <Header.Root>
          <Viewport.BlockStart>
            <Toolbar.Root placement="block-start">
              <Toolbar.Leading>
                <Toolbar.Button
                  onClick={() => {
                    addLog('reset');
                    setRows(planets.slice(0, 4));
                    setAdded(0);
                  }}
                >
                  <Button.Label>Reset</Button.Label>
                </Toolbar.Button>
              </Toolbar.Leading>
              <Toolbar.Title>
                <span>Planets</span>
              </Toolbar.Title>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root>
            <Viewport.Padding edge="block-start" />
            <List.Root>
              <List.Section>
                <List.Group>
                  {rows.map((name) => (
                    <List.Item key={name}>
                      <List.Leading>
                        <List.SwipeActionsTrigger
                          render={
                            <List.EditButton
                              aria-label={`Delete ${name}`}
                              tint="var(--color-ios-system-red)"
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
                          tint="var(--color-ios-system-red)"
                          onClick={() => {
                            addLog(`delete: ${name}`);
                            setRows((current) =>
                              current.filter((row) => row !== name),
                            );
                          }}
                        >
                          <Symbol icon={sfTrashFill} />
                        </List.SwipeAction>
                      </List.SwipeActions>
                    </List.Item>
                  ))}
                  {/* The whole row inserts: its button; the plus its sign. */}
                  <List.Item>
                    <List.Leading>
                      <List.EditButton
                        aria-hidden="true"
                        render={<span />}
                        tint="var(--color-ios-system-green)"
                      >
                        <Symbol icon={sfPlus} />
                      </List.EditButton>
                    </List.Leading>
                    <List.Content>
                      <List.Button
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
            <Viewport.Padding edge="block-end" />
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

  return (
    <Component
      isInline
      id="list-composition-editing-sections"
      log={log}
      stage="phone"
      title="List editing sections separately"
    >
      <Viewport.Content safeArea="none">
        <Header.Root>
          <Viewport.BlockStart>
            <Toolbar.Root placement="block-start">
              <Toolbar.Leading>
                <Toolbar.Button
                  onClick={() => {
                    addLog('reset');
                    setInner(innerPlanets);
                    setOuter(outerPlanets);
                  }}
                >
                  <Button.Label>Reset</Button.Label>
                </Toolbar.Button>
              </Toolbar.Leading>
              <Toolbar.Title>
                <span>Planets</span>
              </Toolbar.Title>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root>
            <Viewport.Padding edge="block-start" />
            <List.Root>
              <List.Section editing={isInnerEditing ? 'trailing' : 'none'}>
                <List.Header>
                  <List.Title>Inner Planets</List.Title>
                  <List.Action
                    onClick={() => {
                      addLog(`inner: ${isInnerEditing ? 'done' : 'edit'}`);
                      setIsInnerEditing(!isInnerEditing);
                    }}
                  >
                    {isInnerEditing ? 'Done' : 'Edit'}
                  </List.Action>
                </List.Header>
                <List.Group reorderHandle={reorderInner}>
                  {inner.map(([name, distance]) => (
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
                        <List.Grabber aria-label={`Reorder ${name}`} />
                      </List.Trailing>
                    </List.Item>
                  ))}
                </List.Group>
              </List.Section>
              <List.Section editing={isOuterEditing ? 'leading' : 'none'}>
                <List.Header>
                  <List.Title>Outer Planets</List.Title>
                  <List.Action
                    onClick={() => {
                      addLog(`outer: ${isOuterEditing ? 'done' : 'edit'}`);
                      setIsOuterEditing(!isOuterEditing);
                    }}
                  >
                    {isOuterEditing ? 'Done' : 'Edit'}
                  </List.Action>
                </List.Header>
                <List.Group>
                  {outer.map((name) => (
                    <List.Item key={name}>
                      <List.Leading whileEditing="show">
                        <List.EditButton
                          aria-label={`Delete ${name}`}
                          tint="var(--color-ios-system-red)"
                          onClick={() => {
                            addLog(`delete: ${name}`);
                            setOuter((current) =>
                              current.filter((row) => row !== name),
                            );
                          }}
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
            </List.Root>
            <Viewport.Padding edge="block-end" />
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

  const row = (name: string) => (
    <List.Item
      key={name}
      dropName={name}
      reorderHandle={reorderPlanets}
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
      id="list-composition-across-sections"
      log={log}
      stage="phone"
      title="List reordering across sections"
    >
      <Viewport.Content safeArea="none">
        <Header.Root>
          <Viewport.BlockStart>
            <Toolbar.Root placement="block-start">
              <Toolbar.Leading>
                <Toolbar.Button
                  onClick={() => {
                    addLog('reset');
                    setBodies(solarPlanets);
                    setSelected([]);
                  }}
                >
                  <Button.Label>Reset</Button.Label>
                </Toolbar.Button>
              </Toolbar.Leading>
              <Toolbar.Title>
                <span>Planets</span>
              </Toolbar.Title>
              <Toolbar.Trailing>
                <Toolbar.Button
                  prominent={isEditing}
                  onClick={() => {
                    addLog(isEditing ? 'done' : 'edit');
                    setIsEditing(!isEditing);
                    setSelected([]);
                  }}
                >
                  <Button.Label>{isEditing ? 'Done' : 'Edit'}</Button.Label>
                </Toolbar.Button>
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root>
            <Viewport.Padding edge="block-start" />
            <List.Root editing={isEditing ? 'both' : 'none'}>
              <List.Section>
                <List.Header>
                  <List.Title>Inner Planets</List.Title>
                </List.Header>
                <List.Group>
                  <List.Item
                    dropName="Sun"
                    editing="none"
                  >
                    <List.Content>
                      <List.Title>(not a planet) Sun</List.Title>
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
              <List.Section>
                <List.Header>
                  <List.Title>Outer Planets</List.Title>
                </List.Header>
                <List.Group
                  dropName="outer"
                  reorderHandle={reorderPlanets}
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
                    reorderHandle={reorderPlanets}
                  />
                </List.Group>
              </List.Section>
            </List.Root>
            <Viewport.Padding edge="block-end" />
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

  return (
    <Component
      isInline
      isStretched
      id="list-composition-inbox"
      log={log}
      title="List as an inbox"
    >
      <List.Root listStyle="plain">
        <List.Section>
          <List.Group>
            {messages
              .filter(({ from }) => !archived.includes(from))
              .map(({ date, from, preview, subject }) => (
                <List.Item key={from}>
                  <List.Leading>
                    {read.includes(from) ? (
                      <List.Image style={unreadStyle} />
                    ) : (
                      <List.Image
                        aria-label="Unread"
                        role="img"
                        style={unreadStyle}
                      >
                        <Symbol icon={sfCircleFill} />
                      </List.Image>
                    )}
                  </List.Leading>
                  <List.Content>
                    <List.Title
                      render={<button type="button" />}
                      onClick={() => {
                        addLog(`open: ${from}`);
                        if (!read.includes(from)) toggleRead(from);
                      }}
                    >
                      {from}
                    </List.Title>
                    <List.Subtitle>{subject}</List.Subtitle>
                    <List.Text>{preview}</List.Text>
                  </List.Content>
                  <List.Trailing>
                    <List.Detail>{date}</List.Detail>
                  </List.Trailing>
                  <List.Trailing>
                    <List.DrillIn />
                  </List.Trailing>
                  <List.SwipeActions
                    overswipe
                    side="inline-start"
                  >
                    <List.SwipeAction
                      showLabel
                      label={read.includes(from) ? 'Unread' : 'Read'}
                      tint="var(--color-ios-system-blue)"
                      onClick={() => toggleRead(from)}
                    >
                      <Symbol
                        icon={
                          read.includes(from)
                            ? sfEnvelopeBadgeFill
                            : sfEnvelopeOpenFill
                        }
                      />
                    </List.SwipeAction>
                  </List.SwipeActions>
                  <List.SwipeActions onOverswipe={() => archive(from)}>
                    <List.SwipeAction
                      showLabel
                      label="More"
                      onClick={() => addLog(`more: ${from}`)}
                    >
                      <Symbol icon={sfEllipsis} />
                    </List.SwipeAction>
                    <List.SwipeAction
                      showLabel
                      label="Flag"
                      tint="var(--color-ios-system-orange)"
                      onClick={() => addLog(`flag: ${from}`)}
                    >
                      <Symbol icon={sfFlagFill} />
                    </List.SwipeAction>
                    <List.SwipeAction
                      showLabel
                      label="Archive"
                      tint="var(--color-ios-system-purple)"
                      onClick={() => archive(from)}
                    >
                      <Symbol icon={sfArchiveboxFill} />
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

  return (
    <Component
      isInline
      isStretched
      id="list-composition-index"
      log={log}
      title="List with an index"
    >
      <div className="list-demo-plain">
        <div
          className="list-demo-scroll"
          id="contacts"
        >
          <List.Root listStyle="plain">
            {Object.entries(contacts).map(([letter, names]) => (
              <List.Section
                key={letter}
                id={`contacts-${letter}`}
              >
                <List.Header prominence="nested">
                  <List.Title>{letter}</List.Title>
                </List.Header>
                <List.Group>
                  {names.map((name) => (
                    <List.Item key={name}>
                      <List.Content>
                        <List.Title
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
          </List.Root>
        </div>
        <div className="list-demo-index">
          <List.Index aria-label="Index">
            {Object.keys(contacts).map((letter) => (
              <List.IndexItem
                key={letter}
                onClick={() => {
                  addLog(`index: ${letter}`);
                  const list = document.querySelector('#contacts');
                  const section = document.querySelector(`#contacts-${letter}`);
                  if (!list || !section) return;
                  // The section at the top of the list (its own scroll
                  // container; the page stays).
                  list.scrollTo({
                    top:
                      list.scrollTop +
                      section.getBoundingClientRect().top -
                      list.getBoundingClientRect().top,
                  });
                }}
              >
                {letter}
              </List.IndexItem>
            ))}
          </List.Index>
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
        As iOS’s Settings: an inset grouped list in a <a href="page">Page</a>,
        under its <a href="header">Header</a>.
      </li>
      <li>
        Rows hold settings’ controls as trailing parts (a{' '}
        <a href="switch">Switch</a>, a <a href="segmented">Segmented</a>{' '}
        control, a <a href="stepper">Stepper</a>), or across the whole row (
        <PartLink
          component="list"
          part="List.Span"
        />
        : a <a href="segmented">Segmented</a> control’s options sharing its
        width, a <a href="slider">Slider</a> between its symbols).
      </li>
      <li>Others drill in (a button title, a detail, a chevron).</li>
      <li>A row with a switch passes its clicks on to it.</li>
      <li>
        Settings take effect at once (guide{' '}
        <GuideLink to="commit-model">§8.2, commit model</GuideLink>).
      </li>
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
        <strong>Demo:</strong> the settings, their values (e.g. the minutes) and
        logging changes.
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
        As Night Shift’s schedule: turning on Scheduled slides in its From and
        To rows below it, together; turning it off slides them out, the rows
        below following.
      </li>
      <li>
        The rows are a{' '}
        <PartLink
          component="list"
          part="List.CollapsiblePanel"
        />{' '}
        among the group’s rows, open as its{' '}
        <PartLink
          component="list"
          part="List.CollapsibleRoot"
        />{' '}
        is (here by the switch, <code>open</code>), without elements of their
        own: each row stays a row of the group (its separator, its corners as
        the group’s first or last).
      </li>
      <li>
        Their times open as in iOS’s Calendar: each picker’s button toggles its
        time roll in a row below it (
        <PartLink
          component="date-picker"
          part="DatePicker.Expandable"
        />
        , by a handle), within the rows around, closed with them.
      </li>
      <li>
        One roll at a time: each time’s row and roll are an{' '}
        <PartLink
          component="list"
          part="List.AccordionItem"
        />{' '}
        of an{' '}
        <PartLink
          component="list"
          part="List.AccordionRoot"
        />
        ; opening one picker closes the other (as Base UI’s Accordion), no app
        state.
      </li>
      <li>
        It ends once it has started: To’s earliest time is From’s (
        <code>min</code>), earlier ones disabled in its roll.
      </li>
      <li>
        Each time’s row is pressable as a whole, its press forwarded to the
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
        ) and the time pickers with their rows (
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
        limiting To by From, the rows forwarding their presses, and the pickers’
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
        A hierarchy (as UIKit’s outlines, e.g. Files’ folders): each row’s{' '}
        <code>level</code> (
        <PartLink
          component="list"
          part="List.Item"
        />
        ) indents it 20px a level, its separator with it.
      </li>
      <li>
        A row with rows below it in the hierarchy toggles them: its title is the
        trigger (
        <PartLink
          component="list"
          part="List.CollapsibleTrigger"
        />
        , the whole row pressable) of a{' '}
        <PartLink
          component="list"
          part="List.CollapsibleRoot"
        />
        , its{' '}
        <PartLink
          component="list"
          part="List.Disclosure"
        />{' '}
        turning; the rows a level deeper are in its{' '}
        <PartLink
          component="list"
          part="List.CollapsiblePanel"
        />
        , closed with any panel around them.
      </li>
      <li>
        All rows stay the group’s rows, however deep: one card, its corners on
        the first and last rows shown.
      </li>
      <li>
        <strong>Library:</strong> indenting by <code>level</code>, the
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
        ) nesting, and the turning{' '}
        <PartLink
          component="list"
          part="List.Disclosure"
        />
        .
      </li>
      <li>
        <strong>Demo:</strong> the bodies and what orbits them, rendering a row
        per body (recursively, its level one deeper), the Sun open at first, and
        logging toggles.
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
        push a page in a <a href="navigation">Navigation</a>.
      </li>
      <li>
        The app keeps the stack (keyed pages, in a{' '}
        <PartLink
          component="navigation"
          part="Navigation.Stack"
        />
        ); the navigation transitions between them, the back button staying (in
        a bar beside the stack).
      </li>
      <li>
        A swipe from the leading edge pops (<code>onBack</code>).
      </li>
      <li>Rows with a detail and no chevron only show a value.</li>
      <li>
        <strong>Library:</strong> the navigation (
        <PartLink
          component="navigation"
          part="Navigation.Root"
        />
        , its stack, back button and swipe area) and the rows’ drill-in parts.
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
        Edit (in the navigation bar): edit mode (
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
        slides in from its leading edge, its{' '}
        <PartLink
          component="list"
          part="List.Grabber"
        />{' '}
        from its trailing edge; the content makes room. Done slides them out.
      </li>
      <li>
        The list owns the selection: a <a href="checkbox">CheckboxGroup</a>{' '}
        rendering the group holds it.
      </li>
      <li>
        The bottom toolbar (in the <a href="viewport">Viewport</a>’s block end)
        reads it, to delete the selected rows (guide{' '}
        <GuideLink to="rule-g7">G7</GuideLink>).
      </li>
      <li>Rows still swipe to delete one.</li>
      <li>
        <strong>Library:</strong> edit mode (<code>editing</code>: the rows’{' '}
        <PartLink
          component="list"
          part="List.Checkbox"
        />{' '}
        and{' '}
        <PartLink
          component="list"
          part="List.Grabber"
        />{' '}
        sliding in), reordering (a reorder handle:{' '}
        <PartLink
          component="list"
          part="List.createReorderHandle"
        />
        ), the swipe actions and the bottom bar (
        <PartLink
          component="viewport"
          part="Viewport.BlockEnd"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> the rows, the edit state and selection (
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
        As UIKit’s editing styles: a red minus before each row, a green plus
        before the last (
        <PartLink
          component="list"
          part="List.EditButton"
        />
        , its <code>tint</code>).
      </li>
      <li>
        The minus deletes nothing itself: rendered by a{' '}
        <PartLink
          component="list"
          part="List.SwipeActionsTrigger"
        />
        , it opens the row’s trailing{' '}
        <PartLink
          component="list"
          part="List.SwipeActions"
        />
        , whose Delete removes the row.
      </li>
      <li>
        As in UIKit’s edit mode, swiping doesn’t open it, but closes it again (
        <code>allowSwipe=&quot;conceal&quot;</code>), as a press outside the row
        does.
      </li>
      <li>
        The whole insert row is a{' '}
        <PartLink
          component="list"
          part="List.Button"
        />{' '}
        (its <code>onClick</code>, the app’s): pressing it anywhere adds a
        planet. Its plus is a sign only, a{' '}
        <PartLink
          component="list"
          part="List.EditButton"
        />{' '}
        rendered as a <code>span</code> (no button of its own).
      </li>
      <li>
        <strong>Library:</strong> the edit buttons (
        <PartLink
          component="list"
          part="List.EditButton"
        />
        ), the trigger opening the row’s actions (
        <PartLink
          component="list"
          part="List.SwipeActionsTrigger"
        />
        ), the swipe actions (
        <PartLink
          component="list"
          part="List.SwipeActions"
        />
        ) and the row-wide button (
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
        Each section its own edit mode (
        <PartLink
          component="list"
          part="List.Section"
        />
        ’s <code>editing</code>), toggled by its header’s action: the inner
        planets reorder (<code>trailing</code>: grabbers sliding in), the outer
        ones delete (<code>leading</code>: minus buttons sliding in).
      </li>
      <li>
        Regular parts make way: each inner planet’s distance (
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
        Earth stays where it is: exempt from its section’s mode (
        <PartLink
          component="list"
          part="List.Item"
        />
        ’s <code>editing=&quot;none&quot;</code>). Modes nest: Root, Section,
        Group, Item, each overriding the one around it.
      </li>
      <li>
        <strong>Library:</strong> the edit modes and their nesting (
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
        ) and the edit buttons (
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
        , in a component <code>useCreateReorderHandle</code>) given to the
        planets’ rows (
        <PartLink
          component="list"
          part="List.Item"
        />{' '}
        <code>reorderHandle</code>, named by <code>dropName</code>) and to where
        they can be dropped, in any section: a row’s{' '}
        <PartLink
          component="list"
          part="List.Grabber"
        />{' '}
        drags it out of its group, the group closing up, a gap opening where it
        would land (the groups and sections below making room).
      </li>
      <li>
        Where they can be dropped is placed as JSX:
        <ul>
          <li>
            Inner planets: a{' '}
            <PartLink
              component="list"
              part="List.DropGroup"
            />{' '}
            around them (gaps before, between and after its rows, no element of
            its own), so nothing lands above the Sun, a row outside it; emptied,
            rows can be dropped back below the Sun.
          </li>
          <li>
            Outer planets: the{' '}
            <PartLink
              component="list"
              part="List.Group"
            />{' '}
            given the handle (as a drop group around all its rows).
          </li>
          <li>
            Dwarf planets: only a{' '}
            <PartLink
              component="list"
              part="List.DropTarget"
            />{' '}
            at the group’s end, so they’re only added to there; emptied, it’s
            still a target.
          </li>
        </ul>
      </li>
      <li>
        Dropped, the handle’s <code>onReorder</code> gets what moved and where
        (the target’s part, its <code>dropName</code>, and the rows{' '}
        <code>after</code> and <code>before</code> the gap); the app’s planets
        are lists by section, reordered by{' '}
        <PartLink
          component="list"
          part="List.reorder"
        />{' '}
        (the rows taken out, put after the row before the gap; into an empty
        section by its name).
      </li>
      <li>
        Several at once: in edit mode, pressing a selected row’s grabber grabs
        all selected rows (the handle’s <code>grab</code>, by their names, the
        pressed one first), dragged together, stacked.
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
        , its <code>grab</code>), the targets (
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
        As Mail: a plain list of media rows, a{' '}
        <PartLink
          component="list"
          part="List.Text"
        />{' '}
        preview below the subject.
      </li>
      <li>An unread dot in the image’s place.</li>
      <li>Swipe actions on both sides, labels shown.</li>
      <li>
        Swiping on past the trailing ones archives the message (
        <code>onOverswipe</code>); the app removes it.
      </li>
      <li>
        <strong>Library:</strong> the media rows (
        <PartLink
          component="list"
          part="List.Subtitle"
        />
        ,{' '}
        <PartLink
          component="list"
          part="List.Text"
        />
        ), swipe actions on both sides and overswiping (<code>onOverswipe</code>
        ).
      </li>
      <li>
        <strong>Demo:</strong> the messages, their read and archived state, and
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
        As Contacts: a plain list in sections by letter (sticky section titles),
        a{' '}
        <PartLink
          component="list"
          part="List.Index"
        />{' '}
        beside it.
      </li>
      <li>
        Pressing or scrubbing over a letter clicks it; the app scrolls its list
        to the section, so dragging across the letters scrolls through the list.
      </li>
      <li>
        Placing the index is the page’s: here, at the list’s edge, centered on
        its visible height.
      </li>
      <li>
        The list scrolls on its own, without a scroll bar (an overlay scroll bar
        would cover the index).
      </li>
      <li>
        <strong>Library:</strong> the index (
        <PartLink
          component="list"
          part="List.Index"
        />
        ): pressing and scrubbing over its letters, and the sticky section
        headers.
      </li>
      <li>
        <strong>Demo:</strong> the contacts by letter, scrolling to a letter’s
        section, and placing the index.
      </li>
    </ul>
    <CodeView code={indexCode} />
    <Contacts />
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
];
