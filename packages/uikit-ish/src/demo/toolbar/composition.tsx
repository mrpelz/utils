import { sfChevronBackward } from '@bradleyhodges/sfsymbols/sfChevronBackward';
import { sfEllipsis } from '@bradleyhodges/sfsymbols/sfEllipsis';
import { sfFolder } from '@bradleyhodges/sfsymbols/sfFolder';
import { sfListBullet } from '@bradleyhodges/sfsymbols/sfListBullet';
import { sfMagnifyingglass } from '@bradleyhodges/sfsymbols/sfMagnifyingglass';
import { sfMap } from '@bradleyhodges/sfsymbols/sfMap';
import { sfSquareAndArrowUp } from '@bradleyhodges/sfsymbols/sfSquareAndArrowUp';
import { sfSquareAndPencil } from '@bradleyhodges/sfsymbols/sfSquareAndPencil';
import { sfTrash } from '@bradleyhodges/sfsymbols/sfTrash';
import { FunctionComponent, useState } from 'react';

import {
  Button,
  CheckboxGroup,
  forwardClick,
  Header,
  List,
  Page,
  PageControl,
  Symbol,
  TextField,
  Toolbar,
  Viewport,
} from '../../components/index.js';
import { CodeView } from '../frame/code-view.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';
import { messages } from '../list/content.js';
import { names } from '../viewport/content.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */

const navigationCode = `<Page.Root>
  <Header.Root>
    <Header.Bar>
      <Toolbar.Leading>
        <Toolbar.Button aria-label="Back" shape="circle">
          <Button.Icon>
            <Symbol icon={sfChevronBackward} />
          </Button.Icon>
        </Toolbar.Button>
      </Toolbar.Leading>
      <Toolbar.Title>
        <span>Inbox</span>
        <Toolbar.Subtitle>3 unread</Toolbar.Subtitle>
      </Toolbar.Title>
      <Toolbar.Trailing>
        <Toolbar.Group>
          <Toolbar.Button aria-label="Share" shape="circle">…</Toolbar.Button>
          <Toolbar.Button aria-label="More" shape="circle">…</Toolbar.Button>
        </Toolbar.Group>
      </Toolbar.Trailing>
    </Header.Bar>
  </Header.Root>
  <List.Root>…</List.Root>
</Page.Root>`;

const editCode = `const [selected, setSelected] = useState<string[]>([]);
const all = selected.length === messages.length;

<Viewport.Content>
  <List.Root editing>
    <List.Section>
      <CheckboxGroup
        value={selected}
        render={<List.Group />}
        onValueChange={setSelected}
      >
        {messages.map(({ subject }) => (
          <List.Item key={subject} onClick={forwardClick('[role=checkbox]')}>
            <List.Checkbox aria-label={subject} value={subject} />
            <List.Title>{subject}</List.Title>
          </List.Item>
        ))}
      </CheckboxGroup>
    </List.Section>
  </List.Root>
</Viewport.Content>
<Viewport.BlockEnd>
  <Toolbar.Root>
    <Toolbar.Leading>
      <Toolbar.Button
        onClick={() => setSelected(all ? [] : messages.map(({ subject }) => subject))}
      >
        <Button.Label>{all ? 'Deselect All' : 'Select All'}</Button.Label>
      </Toolbar.Button>
    </Toolbar.Leading>
    <Toolbar.Title>
      <span>{selected.length} Selected</span>
    </Toolbar.Title>
    <Toolbar.Trailing>
      <Toolbar.Group disabled={selected.length === 0}>
        <Toolbar.Button aria-label="Move" shape="circle">…</Toolbar.Button>
        <Toolbar.Button aria-label="Delete" destructive shape="circle">…</Toolbar.Button>
      </Toolbar.Group>
    </Toolbar.Trailing>
  </Toolbar.Root>
</Viewport.BlockEnd>`;

const searchCode = `const [query, setQuery] = useState('');

<Viewport.Content>
  <List.Root>…{/* the rows matching query */}</List.Root>
</Viewport.Content>
<Viewport.BlockEnd>
  <Toolbar.Root>
    <Toolbar.Button aria-label="Folders" shape="circle">…</Toolbar.Button>
    {/* Taking the bar's free space. */}
    <TextField.Root style={{ flex: 1 }}>
      <TextField.Search>
        <Symbol icon={sfMagnifyingglass} />
        <TextField.Control
          aria-label="Search"
          placeholder="Search"
          type="search"
          value={query}
          onValueChange={setQuery}
        />
        <TextField.Clear />
      </TextField.Search>
    </TextField.Root>
    <Toolbar.Button aria-label="New contact" shape="circle">…</Toolbar.Button>
  </Toolbar.Root>
</Viewport.BlockEnd>`;

const pagesCode = `const [page, setPage] = useState(0);

<Viewport.Content>…{/* the page */}</Viewport.Content>
<Viewport.BlockEnd>
  <Toolbar.Root>
    <Toolbar.Leading>
      <Toolbar.Button aria-label="Map" shape="circle">…</Toolbar.Button>
    </Toolbar.Leading>
    <PageControl count={cities.length} value={page} onValueChange={setPage} />
    <Toolbar.Trailing>
      <Toolbar.Button aria-label="Cities" shape="circle">…</Toolbar.Button>
    </Toolbar.Trailing>
  </Toolbar.Root>
</Viewport.BlockEnd>`;

/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** Weather's pages: a city each. */
const cities = ['Berlin', 'Lisbon', 'Oslo', 'Tokyo', 'Lima'];

/** A page's navigation bar: back, a title with a subtitle, actions. */
const NavigationBar: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      center
      inline
      id="toolbar-composition-navigation"
      log={log}
      title="Toolbar as a navigation bar"
    >
      <div className="toolbar-demo-screen">
        <Page.Root>
          <Header.Root>
            <Header.Bar>
              <Toolbar.Leading>
                <Toolbar.Button
                  aria-label="Back"
                  shape="circle"
                  onClick={() => addLog('Back clicked')}
                >
                  <Button.Icon>
                    <Symbol icon={sfChevronBackward} />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Leading>
              <Toolbar.Title>
                <span>Inbox</span>
                <Toolbar.Subtitle>{messages.length} unread</Toolbar.Subtitle>
              </Toolbar.Title>
              <Toolbar.Trailing>
                <Toolbar.Group>
                  <Toolbar.Button
                    aria-label="Share"
                    shape="circle"
                    onClick={() => addLog('Share clicked')}
                  >
                    <Button.Icon>
                      <Symbol icon={sfSquareAndArrowUp} />
                    </Button.Icon>
                  </Toolbar.Button>
                  <Toolbar.Button
                    aria-label="More"
                    shape="circle"
                    onClick={() => addLog('More clicked')}
                  >
                    <Button.Icon>
                      <Symbol icon={sfEllipsis} />
                    </Button.Icon>
                  </Toolbar.Button>
                </Toolbar.Group>
              </Toolbar.Trailing>
            </Header.Bar>
          </Header.Root>
          <List.Root>
            <List.Section>
              <List.Group>
                {messages.map(({ from, preview, subject }) => (
                  <List.Item key={subject}>
                    <List.Title>{from}</List.Title>
                    <List.Subtitle>{subject}</List.Subtitle>
                    <List.Text lines={2}>{preview}</List.Text>
                  </List.Item>
                ))}
              </List.Group>
            </List.Section>
          </List.Root>
        </Page.Root>
      </div>
    </Component>
  );
};

/** Edit mode: a list's selection, acted on by a bar at the bottom. */
const EditMode: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [selected, setSelected] = useState<string[]>([]);
  const all = selected.length === messages.length;

  return (
    <Component
      center
      inline
      id="toolbar-composition-edit"
      log={log}
      title="Toolbar in edit mode"
    >
      <div className="toolbar-demo-screen">
        <Viewport.Content>
          <List.Root
            editing
            className="toolbar-demo-list"
          >
            <List.Section>
              <CheckboxGroup
                render={<List.Group />}
                value={selected}
                onValueChange={(value: string[]) => setSelected(value)}
              >
                {messages.map(({ from, subject }) => (
                  <List.Item
                    key={subject}
                    onClick={forwardClick('[role=checkbox]')}
                  >
                    <List.Checkbox
                      aria-label={subject}
                      value={subject}
                    />
                    <List.Title>{subject}</List.Title>
                    <List.Subtitle>{from}</List.Subtitle>
                  </List.Item>
                ))}
              </CheckboxGroup>
            </List.Section>
          </List.Root>
        </Viewport.Content>
        <Viewport.BlockEnd>
          <Toolbar.Root>
            <Toolbar.Leading>
              <Toolbar.Button
                onClick={() =>
                  setSelected(all ? [] : messages.map(({ subject }) => subject))
                }
              >
                <Button.Label>
                  {all ? 'Deselect All' : 'Select All'}
                </Button.Label>
              </Toolbar.Button>
            </Toolbar.Leading>
            <Toolbar.Title>
              <span>{selected.length} Selected</span>
            </Toolbar.Title>
            <Toolbar.Trailing>
              <Toolbar.Group disabled={selected.length === 0}>
                <Toolbar.Button
                  aria-label="Move"
                  shape="circle"
                  onClick={() => addLog(`move: ${selected.join(', ')}`)}
                >
                  <Button.Icon>
                    <Symbol icon={sfFolder} />
                  </Button.Icon>
                </Toolbar.Button>
                <Toolbar.Button
                  destructive
                  aria-label="Delete"
                  shape="circle"
                  onClick={() => addLog(`delete: ${selected.join(', ')}`)}
                >
                  <Button.Icon>
                    <Symbol icon={sfTrash} />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Group>
            </Toolbar.Trailing>
          </Toolbar.Root>
        </Viewport.BlockEnd>
      </div>
    </Component>
  );
};

/** A search field in a bottom bar, filtering the list above it. */
const Search: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [query, setQuery] = useState('');
  const matching = names.filter((name) =>
    name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Component
      center
      inline
      inputGuards
      id="toolbar-composition-search"
      log={log}
      title="Toolbar with a search field"
    >
      <div className="toolbar-demo-screen">
        <Viewport.Content>
          <List.Root className="toolbar-demo-list">
            <List.Section>
              <List.Group>
                {matching.map((name) => (
                  <List.Item key={name}>
                    <List.Title>{name}</List.Title>
                  </List.Item>
                ))}
              </List.Group>
            </List.Section>
          </List.Root>
        </Viewport.Content>
        <Viewport.BlockEnd>
          <Toolbar.Root>
            <Toolbar.Button
              aria-label="Folders"
              shape="circle"
              onClick={() => addLog('Folders clicked')}
            >
              <Button.Icon>
                <Symbol icon={sfFolder} />
              </Button.Icon>
            </Toolbar.Button>
            <TextField.Root style={{ flex: 1 }}>
              <TextField.Search>
                <Symbol icon={sfMagnifyingglass} />
                <TextField.Control
                  aria-label="Search"
                  placeholder="Search"
                  type="search"
                  value={query}
                  onValueChange={(value: string) => setQuery(value)}
                />
                <TextField.Clear />
              </TextField.Search>
            </TextField.Root>
            <Toolbar.Button
              aria-label="New contact"
              shape="circle"
              onClick={() => addLog('New contact clicked')}
            >
              <Button.Icon>
                <Symbol icon={sfSquareAndPencil} />
              </Button.Icon>
            </Toolbar.Button>
          </Toolbar.Root>
        </Viewport.BlockEnd>
      </div>
    </Component>
  );
};

/** Weather's bar: page dots between a button at each side. */
const Pages: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [page, setPage] = useState(0);

  return (
    <Component
      center
      inline
      id="toolbar-composition-pages"
      log={log}
      title="Toolbar with page dots"
    >
      <div className="toolbar-demo-screen">
        <Viewport.Content>
          <List.Root className="toolbar-demo-list">
            <List.Section>
              <List.Block>
                <h2>{cities[page]}</h2>
                <p>
                  Page {page + 1} of {cities.length}: press the dots, or drag
                  across them.
                </p>
              </List.Block>
            </List.Section>
          </List.Root>
        </Viewport.Content>
        <Viewport.BlockEnd>
          <Toolbar.Root>
            <Toolbar.Leading>
              <Toolbar.Button
                aria-label="Map"
                shape="circle"
                onClick={() => addLog('Map clicked')}
              >
                <Button.Icon>
                  <Symbol icon={sfMap} />
                </Button.Icon>
              </Toolbar.Button>
            </Toolbar.Leading>
            <PageControl
              count={cities.length}
              value={page}
              onValueChange={(value: number) => {
                addLog(`page: ${String(value)}`);
                setPage(value);
              }}
            />
            <Toolbar.Trailing>
              <Toolbar.Button
                aria-label="Cities"
                shape="circle"
                onClick={() => addLog('Cities clicked')}
              >
                <Button.Icon>
                  <Symbol icon={sfListBullet} />
                </Button.Icon>
              </Toolbar.Button>
            </Toolbar.Trailing>
          </Toolbar.Root>
        </Viewport.BlockEnd>
      </div>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['a-navigation-bar', 'A navigation bar'],
  ['edit-mode', 'Edit mode'],
  ['a-search-field', 'A search field'],
  ['controls-between-the-capsules', 'Controls between the capsules'],
];

/** `/toolbar/composition`: toolbars with pages, lists, fields, controls. */
export const ToolbarComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A toolbar is a Region (guide,{' '}
        <GuideLink to="primitive-region">§5</GuideLink>): placed at an edge by
        what it’s in, its commands for the content beside it.
      </li>
      <li>
        At the top of a page, its <a href="header">Header</a>’s bar; at the
        bottom of a screen, a <a href="viewport">Viewport</a>’s anchor.
      </li>
    </ul>

    <Heading
      id="a-navigation-bar"
      level={2}
    >
      A navigation bar
    </Heading>
    <ul>
      <li>
        <PartLink
          component="header"
          part="Header.Bar"
        />{' '}
        is a toolbar at the top (<code>placement=&quot;block-start&quot;</code>
        ), sticking to the top of its page’s scroll container.
      </li>
      <li>
        Back at its start, the page’s title (a subtitle below it) centered, the
        page’s actions in a capsule at its end.
      </li>
      <li>
        With a large title, the bar’s title fades in as it scrolls away (see{' '}
        <a href="header">Header</a>).
      </li>
    </ul>
    <CodeView code={navigationCode} />
    <NavigationBar />

    <Heading
      id="edit-mode"
      level={2}
    >
      Edit mode
    </Heading>
    <ul>
      <li>
        Mail’s, while editing: Select All at the start, the count as the title,
        the selection’s commands in a capsule at the end.
      </li>
      <li>
        A disabled capsule (<code>Group</code> <code>disabled</code>) while
        nothing is selected; its buttons stay focusable.
      </li>
      <li>
        A list’s edit mode: see <a href="list/composition">List</a>; a
        viewport’s bottom bar: see <a href="viewport/composition">Viewport</a>.
      </li>
    </ul>
    <CodeView code={editCode} />
    <EditMode />

    <Heading
      id="a-search-field"
      level={2}
    >
      A search field
    </Heading>
    <ul>
      <li>
        iOS 26’s search at the bottom (Mail, Contacts): a{' '}
        <a href="text-field">Text field</a>’s{' '}
        <PartLink
          component="text-field"
          part="TextField.Search"
        />{' '}
        between a button at each end, taking the bar’s free space.
      </li>
      <li>
        Without sides: the field grows (<code>flex: 1</code>), the buttons keep
        their size.
      </li>
      <li>
        Pushed up by the on-screen keyboard with its bar (
        <PartLink
          component="viewport"
          part="Viewport.BlockEnd"
        />
        , <code>keyboard=&quot;push&quot;</code>
        ).
      </li>
    </ul>
    <CodeView code={searchCode} />
    <Search />

    <Heading
      id="controls-between-the-capsules"
      level={2}
    >
      Controls between the capsules
    </Heading>
    <ul>
      <li>
        Between the sides, in a title’s place: a control for the view, e.g.
        Weather’s page dots (a <a href="page-control">Page control</a>),
        centered in the bar.
      </li>
      <li>
        A segmented control in a toolbar: see{' '}
        <a href="segmented/composition#in-a-toolbar">Segmented</a>.
      </li>
    </ul>
    <CodeView code={pagesCode} />
    <Pages />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const toolbarCompositionDemos = [NavigationBar, EditMode, Search, Pages];
