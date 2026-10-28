import { sfChevronBackward } from '@bradleyhodges/sfsymbols/sfChevronBackward';
import { sfEllipsis } from '@bradleyhodges/sfsymbols/sfEllipsis';
import { sfMagnifyingglass } from '@bradleyhodges/sfsymbols/sfMagnifyingglass';
import { sfSquareAndPencil } from '@bradleyhodges/sfsymbols/sfSquareAndPencil';
import { FunctionComponent, useState } from 'react';

import {
  Button,
  Header,
  List,
  Page,
  Segmented,
  Symbol,
  TextField,
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
import { names } from '../viewport/content.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */

const largeTitleCode = `<Header.Root>
  <Viewport.BlockStart>
    <Toolbar.Root placement="block-start">
      <Toolbar.Leading />
      {/* Hidden until the large title scrolls under the bar. */}
      <Toolbar.Title>
        <span>Contacts</span>
        <Toolbar.Subtitle>29 people</Toolbar.Subtitle>
      </Toolbar.Title>
      <Toolbar.Trailing>
        <Toolbar.Button aria-label="New contact" shape="circle">…</Toolbar.Button>
      </Toolbar.Trailing>
    </Toolbar.Root>
  </Viewport.BlockStart>
  <Page.Root>
    <Viewport.Padding edge="block-start" />
    <Header.LargeTitle>
      <span>Contacts</span>
      <Toolbar.Subtitle>29 people</Toolbar.Subtitle>
    </Header.LargeTitle>
    <List.Root>…</List.Root>
    <Viewport.Padding edge="block-end" />
  </Page.Root>
</Header.Root>`;

const searchCode = `const [query, setQuery] = useState('');

<Header.Root>
  <Viewport.BlockStart>
    <Toolbar.Root placement="block-start">…</Toolbar.Root>
  </Viewport.BlockStart>
  <Page.Root>
    <Viewport.Padding edge="block-start" />
    <Header.LargeTitle>
      <span>Contacts</span>
    </Header.LargeTitle>
    {/* Scrolling with the large title, then staying below the bar. */}
    <Header.Accessory>
      <TextField.Root>
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
    </Header.Accessory>
    <List.Root>…{/* the rows matching query */}</List.Root>
    <Viewport.Padding edge="block-end" />
  </Page.Root>
</Header.Root>`;

const pictureCode = `<Header.Root>
  <Viewport.BlockStart>
    <Toolbar.Root placement="block-start" context="adaptive">
      <Toolbar.Leading>
        <Toolbar.Button aria-label="Library" shape="circle">…</Toolbar.Button>
      </Toolbar.Leading>
      <Toolbar.Title>
        <span>Album</span>
      </Toolbar.Title>
      <Toolbar.Trailing>
        <Toolbar.Button aria-label="More" shape="circle">…</Toolbar.Button>
      </Toolbar.Trailing>
    </Toolbar.Root>
  </Viewport.BlockStart>
  <Page.Root background="plain">
    {/* Under the bar: no padding for it. */}
    <div className="cover" />
    <List.Root listStyle="plain">…</List.Root>
    <Viewport.Padding edge="block-end" />
  </Page.Root>
</Header.Root>`;

const controlCode = `const [filter, setFilter] = useState('all');

<Header.Root>
  <Viewport.BlockStart>
    <Toolbar.Root placement="block-start">…</Toolbar.Root>
  </Viewport.BlockStart>
  <Page.Root>
    <Viewport.Padding edge="block-start" />
    <Header.LargeTitle>
      <span>Inbox</span>
    </Header.LargeTitle>
    <Header.Accessory>
      <Segmented.Root
        aria-label="Show"
        value={filter}
        onValueChange={setFilter}
      >
        <Segmented.Item value="all">All</Segmented.Item>
        <Segmented.Item value="unread">Unread</Segmented.Item>
        <Segmented.Highlight />
      </Segmented.Root>
    </Header.Accessory>
    <List.Root>…{/* the rows filtered */}</List.Root>
    <Viewport.Padding edge="block-end" />
  </Page.Root>
</Header.Root>`;

/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/**
 * A page's large title (with a subtitle) scrolling away under its bar, the
 * bar's title (with its subtitle) fading in.
 */
const LargeTitle: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      isInline
      id="header-composition-large-title"
      log={log}
      stage="phone"
      title="Header with a large title"
    >
      <Viewport.Content safeArea="none">
        <Header.Root>
          <Viewport.BlockStart>
            <Toolbar.Root placement="block-start">
              <Toolbar.Leading />
              <Toolbar.Title>
                <span>Contacts</span>
                <Toolbar.Subtitle>{names.length} people</Toolbar.Subtitle>
              </Toolbar.Title>
              <Toolbar.Trailing>
                <Toolbar.Button
                  aria-label="New contact"
                  shape="circle"
                  onClick={() => addLog('New contact clicked')}
                >
                  <Button.Icon>
                    <Symbol icon={sfSquareAndPencil} />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root>
            <Viewport.Padding edge="block-start" />
            <Header.LargeTitle>
              <span>Contacts</span>
              <Toolbar.Subtitle>{names.length} people</Toolbar.Subtitle>
            </Header.LargeTitle>

            <List.Root>
              <List.Section>
                <List.Group>
                  {names.map((name) => (
                    <List.Item key={name}>
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

/** A search field below the large title, filtering the page's rows. */
const Search: FunctionComponent = () => {
  const [query, setQuery] = useState('');
  const matching = names.filter((name) =>
    name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Component
      hasInputGuards
      isInline
      id="header-composition-search"
      stage="phone"
      title="Header with a search field"
    >
      <Viewport.Content safeArea="none">
        <Header.Root>
          <Viewport.BlockStart>
            <Toolbar.Root placement="block-start">
              <Toolbar.Leading />
              <Toolbar.Title>
                <span>Contacts</span>
              </Toolbar.Title>
              <Toolbar.Trailing />
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root>
            <Viewport.Padding edge="block-start" />
            <Header.LargeTitle>
              <span>Contacts</span>
            </Header.LargeTitle>
            <Header.Accessory>
              <TextField.Root>
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
            </Header.Accessory>

            <List.Root>
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
            <Viewport.Padding edge="block-end" />
          </Page.Root>
        </Header.Root>
      </Viewport.Content>
    </Component>
  );
};

/** The bar's glass over a picture at the page's top (adaptive). */
const OverPicture: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      isInline
      id="header-composition-picture"
      log={log}
      stage="phone"
      title="Header over a picture"
    >
      <Viewport.Content safeArea="none">
        <Header.Root>
          <Viewport.BlockStart>
            <Toolbar.Root
              context="adaptive"
              placement="block-start"
            >
              <Toolbar.Leading>
                <Toolbar.Button
                  aria-label="Library"
                  shape="circle"
                  onClick={() => addLog('Back clicked')}
                >
                  <Button.Icon>
                    <Symbol icon={sfChevronBackward} />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Leading>
              <Toolbar.Title>
                <span>Album</span>
              </Toolbar.Title>
              <Toolbar.Trailing>
                <Toolbar.Button
                  aria-label="More"
                  shape="circle"
                  onClick={() => addLog('More clicked')}
                >
                  <Button.Icon>
                    <Symbol icon={sfEllipsis} />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root background="plain">
            <div
              aria-hidden="true"
              className="header-demo-picture"
            />
            <List.Root listStyle="plain">
              <List.Section>
                <List.Group>
                  {names.slice(0, 16).map((name, index) => (
                    <List.Item key={name}>
                      <List.Title>{`${String(index + 1)}. ${name}`}</List.Title>
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

/** A segmented control below the large title, filtering the page's rows. */
const ControlBelow: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [filter, setFilter] = useState('all');
  // (Every third one, unread.)
  const shown =
    filter === 'all' ? names : names.filter((_, index) => index % 3 === 0);

  return (
    <Component
      isInline
      id="header-composition-control"
      log={log}
      stage="phone"
      title="Header with a control"
    >
      <Viewport.Content safeArea="none">
        <Header.Root>
          <Viewport.BlockStart>
            <Toolbar.Root placement="block-start">
              <Toolbar.Leading />
              <Toolbar.Title>
                <span>Inbox</span>
              </Toolbar.Title>
              <Toolbar.Trailing />
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root>
            <Viewport.Padding edge="block-start" />
            <Header.LargeTitle>
              <span>Inbox</span>
            </Header.LargeTitle>
            <Header.Accessory>
              <Segmented.Root
                aria-label="Show"
                value={filter}
                onValueChange={(value) => {
                  addLog(`show: ${String(value)}`);
                  setFilter(String(value));
                }}
              >
                <Segmented.Item value="all">All</Segmented.Item>
                <Segmented.Item value="unread">Unread</Segmented.Item>
                <Segmented.Highlight />
              </Segmented.Root>
            </Header.Accessory>

            <List.Root>
              <List.Section>
                <List.Group>
                  {shown.map((name) => (
                    <List.Item key={name}>
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

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['a-large-title', 'A large title'],
  ['a-search-field', 'A search field'],
  ['over-a-picture', 'Over a picture'],
  ['a-control-below-the-title', 'A control below the title'],
];

/** `/header/composition`: headers with titles, fields, pictures. */
export const HeaderComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A header sits at the start of a <a href="page">Page</a>; its bar holds a{' '}
        <a href="toolbar">Toolbar</a>’s parts.
      </li>
      <li>
        What stays with the bar follows the large title, in an accessory: a
        search field, a control.
      </li>
      <li>
        In a stack: see{' '}
        <a href="navigation/composition#large-titles">Navigation</a>.
      </li>
    </ul>

    <Heading
      id="a-large-title"
      level={2}
    >
      A large title
    </Heading>
    <ul>
      <li>
        The page’s title, large, with a subtitle; as it scrolls under the bar,
        the bar’s own title fades in.
      </li>
      <li>
        The bar’s title with its subtitle too (Title and Subtitle, two lines):
        both fade in together.
      </li>
      <li>
        Its title centered, with or without sides (here an empty{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Leading"
        />
        ).
      </li>
      <li>
        <strong>Library:</strong> the large title (
        <PartLink
          component="header"
          part="Header.LargeTitle"
        />
        ) handing over to the bar’s title as it scrolls, and the bar’s title and
        subtitle (
        <PartLink
          component="toolbar"
          part="Toolbar.Subtitle"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> the titles and the page’s rows.
      </li>
    </ul>
    <CodeView code={largeTitleCode} />
    <LargeTitle />

    <Heading
      id="a-search-field"
      level={2}
    >
      A search field
    </Heading>
    <ul>
      <li>
        Mail’s and Contacts’: a <a href="text-field">Text field</a>’s{' '}
        <PartLink
          component="text-field"
          part="TextField.Search"
        />{' '}
        in the header’s{' '}
        <PartLink
          component="header"
          part="Header.Accessory"
        />
        , filtering the page: below the large title, scrolling with it, then
        staying below the bar.
      </li>
      <li>
        Search sits with the page’s Region (guide{' '}
        <GuideLink to="rule-a11">A11</GuideLink>); on iOS 26 also at the bottom
        (see <a href="toolbar/composition#a-search-field">Toolbar</a>).
      </li>
      <li>
        <strong>Library:</strong> the header’s accessory (
        <PartLink
          component="header"
          part="Header.Accessory"
        />
        ) scrolling, then staying below the bar, and the search field (
        <PartLink
          component="text-field"
          part="TextField.Search"
        />
        ,{' '}
        <PartLink
          component="text-field"
          part="TextField.Clear"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> the query (the app’s state) and filtering the
        rows by it.
      </li>
    </ul>
    <CodeView code={searchCode} />
    <Search />

    <Heading
      id="over-a-picture"
      level={2}
    >
      Over a picture
    </Heading>
    <ul>
      <li>
        Music’s and Photos’: a picture at the page’s top, under the bar (no{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />{' '}
        for it), no large title.
      </li>
      <li>
        The bar’s glass by what’s behind it (
        <code>context=&quot;adaptive&quot;</code>
        ): a dark picture, then the page as it scrolls.
      </li>
      <li>
        <strong>Library:</strong> the bar’s adaptive glass (
        <code>context=&quot;adaptive&quot;</code>) over what’s behind it.
      </li>
      <li>
        <strong>Demo:</strong> the picture at the page’s top and the page’s
        rows.
      </li>
    </ul>
    <CodeView code={pictureCode} />
    <OverPicture />

    <Heading
      id="a-control-below-the-title"
      level={2}
    >
      A control below the title
    </Heading>
    <ul>
      <li>
        A <a href="segmented">Segmented</a> control in the header’s{' '}
        <PartLink
          component="header"
          part="Header.Accessory"
        />
        , switching what the page lists (All, Unread): scrolling with the large
        title, then staying below the bar.
      </li>
      <li>
        In the bar instead, in place of its title: see{' '}
        <a href="segmented/composition#in-a-navigation-bar">Segmented</a>.
      </li>
      <li>
        <strong>Library:</strong> the header’s accessory and the{' '}
        <PartLink
          component="segmented"
          part="Segmented.Root"
        />{' '}
        in it.
      </li>
      <li>
        <strong>Demo:</strong> the filter (the app’s state) and the rows it
        shows.
      </li>
    </ul>
    <CodeView code={controlCode} />
    <ControlBelow />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const headerCompositionDemos = [
  LargeTitle,
  Search,
  OverPicture,
  ControlBelow,
];
