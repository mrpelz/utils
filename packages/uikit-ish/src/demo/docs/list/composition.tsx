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
  forwardClick,
  Header,
  List,
  Navigation,
  Page,
  Segmented,
  Slider,
  Stepper,
  Switch,
  Symbol,
  Toolbar,
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
            <List.Image style={{ backgroundColor: … }} variant="rounded">…</List.Image>
            <List.Title>Airplane Mode</List.Title>
            <Switch.Root aria-label="Airplane Mode"><Switch.Thumb /></Switch.Root>
          </List.Item>
          <List.Item>
            <List.Image …>…</List.Image>
            <List.Title render={<button type="button" />} onClick={…}>Wi-Fi</List.Title>
            <List.Detail>Home</List.Detail>
            <List.DrillIn />
          </List.Item>
        </List.Group>
      </List.Section>
      <List.Section>
        <List.Header prominence="nested"><List.Title render={<h3 />}>Display</List.Title></List.Header>
        <List.Group>
          <List.Item>
            <List.Title>Text Size</List.Title>
            <Segmented.Root aria-label="Text Size" defaultValue="M">…</Segmented.Root>
          </List.Item>
          <List.Item>
            <Slider.Root defaultValue={60}>…</Slider.Root>
          </List.Item>
          <List.Item>
            <List.Title>Auto-Lock</List.Title>
            <List.Detail>{minutes} min</List.Detail>
            <Stepper.Root value={minutes} onValueChange={setMinutes}>…</Stepper.Root>
          </List.Item>
        </List.Group>
        <List.Footer>…</List.Footer>
      </List.Section>
    </List.Root>
    <Viewport.Padding edge="block-end" />
  </Page.Root>
</Header.Root>`;

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
                    {page ? (
                      <List.Title render={<button type="button" />} onClick={() => push(page)}>
                        {title}
                      </List.Title>
                    ) : (
                      <List.Title>{title}</List.Title>
                    )}
                    {detail ? <List.Detail>{detail}</List.Detail> : null}
                    {page ? <List.DrillIn /> : null}
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

const editCode = `const rows = ['Mercury', 'Venus', 'Earth', 'Mars'];
const [isEditing, setIsEditing] = useState(false);
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
            render={<List.Group onReorder={(from, to) => …} />}
          >
            {rows.map((name) => (
              <List.Item
                key={name}
                onClick={isEditing ? forwardClick('[role=checkbox]') : undefined}
              >
                <List.Checkbox aria-label={name} value={name} />
                <List.Title>{name}</List.Title>
                <List.Grabber aria-label={\`Reorder \${name}\`} />
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
          {/* Minus: opens the row's Delete (its trailing swipe actions). */}
          <List.SwipeActionsTrigger
            render={
              <List.EditButton aria-label={\`Delete \${name}\`} tint="var(--color-ios-system-red)">
                <Symbol icon={sfMinus} />
              </List.EditButton>
            }
          />
          <List.Title>{name}</List.Title>
          <List.SwipeActions overswipe>
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
        <List.EditButton aria-hidden="true" render={<span />} tint="var(--color-ios-system-green)">
          <Symbol icon={sfPlus} />
        </List.EditButton>
        <List.Button
          onClick={() => {
            setRows([...rows, \`Planet \${added + 1}\`]);
            setAdded(added + 1);
          }}
        >
          Add Planet
        </List.Button>
      </List.Item>
    </List.Group>
  </List.Section>
</List.Root>`;

const sectionsCode = `const [inner, setInner] = useState([
  ['Mercury', '0.39 AU'], ['Venus', '0.72 AU'], ['Earth', '1 AU'], ['Mars', '1.52 AU'],
]);
const [outer, setOuter] = useState(['Jupiter', 'Saturn', 'Uranus', 'Neptune']);
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
    <List.Group onReorder={(from, to) => setInner(moved(inner, from, to))}>
      {inner.map(([name, distance]) => (
        // Home stays where it is: exempt from its section's edit mode.
        <List.Item key={name} editing={name === 'Earth' ? 'none' : undefined}>
          <List.Title>{name}</List.Title>
          <List.Detail whileEditing="hide">{distance}</List.Detail>
          <List.DrillIn />
          <List.Grabber aria-label={\`Reorder \${name}\`} />
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
          <List.EditButton
            aria-label={\`Delete \${name}\`}
            tint="var(--color-ios-system-red)"
            onClick={() => setOuter(outer.filter((row) => row !== name))}
          >
            <Symbol icon={sfMinus} />
          </List.EditButton>
          <List.Title>{name}</List.Title>
        </List.Item>
      ))}
    </List.Group>
  </List.Section>
</List.Root>`;

const inboxCode = `const archive = () => {…};

<List.Root listStyle="plain">
  <List.Section>
    <List.Group>
      <List.Item>
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
</div>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** A small dot in the tint, in the image's place (Mail's unread mark). */
const unreadStyle = { color: 'var(--color-ios-primary)', fontSize: '10px' };

/** Moves a row (the app's part of reordering, see `List.Group`). */
const moved = <T,>(current: readonly T[], from: number, to: number) => {
  const next = [...current];
  const [row] = next.splice(from, 1);
  if (row) next.splice(to, 0, row);
  return next;
};

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
                      <List.Image
                        style={{ backgroundColor: color }}
                        variant="rounded"
                      >
                        <Symbol icon={icon} />
                      </List.Image>
                      <List.Title>{title}</List.Title>
                      <Switch.Root
                        aria-label={title}
                        onCheckedChange={(isChecked: boolean) =>
                          addLog(`${title}: ${String(isChecked)}`)
                        }
                      >
                        <Switch.Thumb />
                      </Switch.Root>
                    </List.Item>
                  ) : (
                    <List.Item key={title}>
                      <List.Image
                        style={{ backgroundColor: color }}
                        variant="rounded"
                      >
                        <Symbol icon={icon} />
                      </List.Image>
                      <List.Title
                        render={<button type="button" />}
                        onClick={() => addLog(`${title} clicked`)}
                      >
                        {title}
                      </List.Title>
                      <List.Detail>{detail}</List.Detail>
                      <List.DrillIn />
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
                  <List.Title>Text Size</List.Title>
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
                </List.Item>
                <List.Item>
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
                </List.Item>
                <List.Item>
                  <List.Title>Auto-Lock</List.Title>
                  <List.Detail>{minutes} min</List.Detail>
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
                              {detail ? (
                                <List.Detail>{detail}</List.Detail>
                              ) : null}
                              {target ? <List.DrillIn /> : null}
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
                    value={selected}
                    render={
                      <List.Group
                        onReorder={(from: number, to: number) => {
                          addLog(`reorder: ${String(from)} → ${String(to)}`);
                          setRows((current) => moved(current, from, to));
                        }}
                      />
                    }
                    onValueChange={(value: string[]) => setSelected(value)}
                  >
                    {rows.map((name) => (
                      <List.Item
                        key={name}
                        onClick={
                          isEditing
                            ? forwardClick('[role=checkbox]')
                            : undefined
                        }
                      >
                        <List.Checkbox
                          aria-label={name}
                          value={name}
                        />
                        <List.Title>{name}</List.Title>
                        <List.Grabber aria-label={`Reorder ${name}`} />
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
                      <List.Title>{name}</List.Title>
                      <List.SwipeActions overswipe>
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
                    <List.EditButton
                      aria-hidden="true"
                      render={<span />}
                      tint="var(--color-ios-system-green)"
                    >
                      <Symbol icon={sfPlus} />
                    </List.EditButton>
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
                <List.Group
                  onReorder={(from: number, to: number) => {
                    addLog(`reorder: ${String(from)} → ${String(to)}`);
                    setInner((current) => moved(current, from, to));
                  }}
                >
                  {inner.map(([name, distance]) => (
                    <List.Item
                      key={name}
                      editing={name === 'Earth' ? 'none' : undefined}
                    >
                      <List.Title>{name}</List.Title>
                      <List.Detail whileEditing="hide">{distance}</List.Detail>
                      <List.DrillIn />
                      <List.Grabber aria-label={`Reorder ${name}`} />
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
                      <List.Title>{name}</List.Title>
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
                  <List.Title
                    render={<button type="button" />}
                    onClick={() => {
                      addLog(`open: ${from}`);
                      if (!read.includes(from)) toggleRead(from);
                    }}
                  >
                    {from}
                  </List.Title>
                  <List.Detail>{date}</List.Detail>
                  <List.DrillIn />
                  <List.Subtitle>{subject}</List.Subtitle>
                  <List.Text>{preview}</List.Text>
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
                      <List.Title
                        render={<button type="button" />}
                        onClick={() => addLog(`open: ${name}`)}
                      >
                        {name}
                      </List.Title>
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
  ['drilling-into-pages', 'Drilling into pages'],
  ['edit-mode-and-a-toolbar', 'Edit mode and a toolbar'],
  ['deleting-and-inserting-rows', 'Deleting and inserting rows'],
  ['editing-sections-separately', 'Editing sections separately'],
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
        control, a <a href="stepper">Stepper</a>), or as the whole row (a{' '}
        <a href="slider">Slider</a> between its symbols).
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
        ), the controls as trailing parts or whole rows, and{' '}
        <code>forwardClick</code>.
      </li>
      <li>
        <strong>Demo:</strong> the settings, their values (e.g. the minutes) and
        logging changes.
      </li>
    </ul>
    <CodeView code={settingsCode} />
    <SettingsScreen />

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
        sliding in), reordering (<code>onReorder</code>), the swipe actions and
        the bottom bar (
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
        , whose Delete removes the row. Swiping does the same.
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
        , <code>onReorder</code>) and the edit buttons (
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
  DrillIn,
  EditMode,
  EditButtons,
  EditingSections,
  Inbox,
  Contacts,
];
