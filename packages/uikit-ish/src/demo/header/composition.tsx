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
} from '../../components/index.js';
import { CodeView } from '../frame/code-view.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { Contents, Heading, type Section } from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';
import { names } from '../viewport/content.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */

const largeTitleCode = `<Page.Root>
  <Header.Root>
    <Header.Bar>
      <Toolbar.Leading />
      {/* Hidden until the large title scrolls under the bar. */}
      <Toolbar.Title>
        <span>Contacts</span>
      </Toolbar.Title>
      <Toolbar.Trailing>
        <Toolbar.Button aria-label="New contact" shape="circle">…</Toolbar.Button>
      </Toolbar.Trailing>
    </Header.Bar>
    <Header.LargeTitle>
      <span>Contacts</span>
      <Toolbar.Subtitle>29 people</Toolbar.Subtitle>
    </Header.LargeTitle>
  </Header.Root>
  <List.Root>…</List.Root>
</Page.Root>`;

const searchCode = `const [query, setQuery] = useState('');

<Page.Root>
  <Header.Root>
    <Header.Bar>…</Header.Bar>
    <Header.LargeTitle>
      <span>Contacts</span>
    </Header.LargeTitle>
    {/* Scrolling with the large title. */}
    <div className="search">
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
    </div>
  </Header.Root>
  <List.Root>…{/* the rows matching query */}</List.Root>
</Page.Root>`;

const pictureCode = `<Page.Root background="plain">
  <Header.Root>
    {/* Its glass by what's behind it: the picture, then the page. */}
    <Header.Bar context="adaptive">
      <Toolbar.Leading>
        <Toolbar.Button aria-label="Library" shape="circle">…</Toolbar.Button>
      </Toolbar.Leading>
      <Toolbar.Title>
        <span>Album</span>
      </Toolbar.Title>
      <Toolbar.Trailing>
        <Toolbar.Button aria-label="More" shape="circle">…</Toolbar.Button>
      </Toolbar.Trailing>
    </Header.Bar>
  </Header.Root>
  {/* Under the bar (pulled up by its height). */}
  <div className="cover" />
  <List.Root listStyle="plain">…</List.Root>
</Page.Root>`;

const controlCode = `const [filter, setFilter] = useState('all');

<Page.Root>
  <Header.Root>
    <Header.Bar>…</Header.Bar>
    <Header.LargeTitle>
      <span>Inbox</span>
    </Header.LargeTitle>
    <div className="filter">
      <Segmented.Root
        aria-label="Show"
        value={filter}
        onValueChange={setFilter}
      >
        <Segmented.Item value="all">All</Segmented.Item>
        <Segmented.Item value="unread">Unread</Segmented.Item>
        <Segmented.Highlight />
      </Segmented.Root>
    </div>
  </Header.Root>
  <List.Root>…{/* the rows filtered */}</List.Root>
</Page.Root>`;

/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** A page's large title (with a subtitle) scrolling away under its bar. */
const LargeTitle: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      center
      inline
      id="header-composition-large-title"
      log={log}
      title="Header with a large title"
    >
      <div className="header-demo-phone">
        <Page.Root>
          <Header.Root>
            <Header.Bar>
              <Toolbar.Leading />
              <Toolbar.Title>
                <span>Contacts</span>
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
            </Header.Bar>
            <Header.LargeTitle>
              <span>Contacts</span>
              <Toolbar.Subtitle>{names.length} people</Toolbar.Subtitle>
            </Header.LargeTitle>
          </Header.Root>
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
        </Page.Root>
      </div>
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
      center
      inline
      id="header-composition-search"
      title="Header with a search field"
    >
      <div className="header-demo-phone">
        <Page.Root>
          <Header.Root>
            <Header.Bar>
              <Toolbar.Leading />
              <Toolbar.Title>
                <span>Contacts</span>
              </Toolbar.Title>
              <Toolbar.Trailing />
            </Header.Bar>
            <Header.LargeTitle>
              <span>Contacts</span>
            </Header.LargeTitle>
            <div className="header-demo-below">
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
            </div>
          </Header.Root>
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
        </Page.Root>
      </div>
    </Component>
  );
};

/** The bar's glass over a picture at the page's top (adaptive). */
const OverPicture: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      center
      inline
      id="header-composition-picture"
      log={log}
      title="Header over a picture"
    >
      <div className="header-demo-phone">
        <Page.Root background="plain">
          <Header.Root>
            <Header.Bar context="adaptive">
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
            </Header.Bar>
          </Header.Root>
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
        </Page.Root>
      </div>
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
      center
      inline
      id="header-composition-control"
      log={log}
      title="Header with a control"
    >
      <div className="header-demo-phone">
        <Page.Root>
          <Header.Root>
            <Header.Bar>
              <Toolbar.Leading />
              <Toolbar.Title>
                <span>Inbox</span>
              </Toolbar.Title>
              <Toolbar.Trailing />
            </Header.Bar>
            <Header.LargeTitle>
              <span>Inbox</span>
            </Header.LargeTitle>
            <div className="header-demo-below">
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
            </div>
          </Header.Root>
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
        </Page.Root>
      </div>
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
        What follows the large title in the header scrolls with it: a search
        field, a control.
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
        Both sides in the bar (an empty <code>Toolbar.Leading</code> too), so
        its title is centered.
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
        <code>TextField.Search</code> below the large title, in the header (it
        scrolls away with the title), filtering the page.
      </li>
      <li>
        Search sits with the page’s Region (guide{' '}
        <GuideLink to="rule-a11">A11</GuideLink>); on iOS 26 also at the bottom
        (see <a href="toolbar/composition#a-search-field">Toolbar</a>).
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
        Music’s and Photos’: a picture at the page’s top, under the bar (pulled
        up by its height), no large title.
      </li>
      <li>
        The bar’s glass by what’s behind it (
        <code>context=&quot;adaptive&quot;</code>
        ): a dark picture, then the page as it scrolls.
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
        A <a href="segmented">Segmented</a> control below the large title,
        switching what the page lists (All, Unread), scrolling with the title.
      </li>
      <li>
        In the bar instead (staying): see{' '}
        <a href="segmented/composition#in-a-navigation-bar">Segmented</a>.
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
