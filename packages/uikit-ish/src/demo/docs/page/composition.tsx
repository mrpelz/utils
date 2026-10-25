import { sfChevronBackward } from '@bradleyhodges/sfsymbols/sfChevronBackward';
import { sfFolder } from '@bradleyhodges/sfsymbols/sfFolder';
import { sfSquareAndPencil } from '@bradleyhodges/sfsymbols/sfSquareAndPencil';
import { FunctionComponent, useState } from 'react';

import {
  Button,
  Header,
  Layout,
  List,
  Navigation,
  Page,
  Sidebar,
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
import { pages } from '../navigation/content.js';
import { rowTitles, sidebarSections } from '../sidebar/content.js';
import { names } from '../viewport/content.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */

const backgroundsCode = `{/* Grouped lists, on the grouped background (the default). */}
<Header.Root>
  <Viewport.BlockStart>…</Viewport.BlockStart>
  <Page.Root>
    <List.Root>…</List.Root>
  </Page.Root>
</Header.Root>

{/* Plain lists and other content, on the plain one. */}
<Header.Root>
  <Viewport.BlockStart>…</Viewport.BlockStart>
  <Page.Root background="plain">
    <List.Root listStyle="plain">…</List.Root>
  </Page.Root>
</Header.Root>`;

const stackCode = `<Navigation.Root onBack={pop}>
  <Navigation.SwipeArea />
  {/* The back button: staying while the pages move. */}
  <Viewport.BlockStart>
    <Toolbar.Root placement="block-start">
      <Toolbar.Leading>
        {keys.length > 1 ? <Navigation.Back … /> : null}
      </Toolbar.Leading>
    </Toolbar.Root>
  </Viewport.BlockStart>
  <Navigation.Stack>
    {keys.map((key) => (
      // Under the top one: hidden, kept (its scroll position too).
      <Header.Root key={key}>
        <Viewport.BlockStart>…</Viewport.BlockStart>
        <Page.Root>
          <List.Root>…</List.Root>
        </Page.Root>
      </Header.Root>
    ))}
  </Navigation.Stack>
</Navigation.Root>`;

const columnCode = `<Layout.Root>
  <Layout.Column floating aria-label="Sidebar" defaultSize={300}>
    <Sidebar.Root aria-label="Mailboxes">…</Sidebar.Root>
  </Layout.Column>
  {/* Its page's content inset by the sidebar's size, its background
      (and its bar's edge) running underneath it. */}
  <Layout.Column clearFloating>
    <Header.Root>
      <Viewport.BlockStart>…</Viewport.BlockStart>
      <Page.Root>
        <List.Root>…</List.Root>
      </Page.Root>
    </Header.Root>
  </Layout.Column>
</Layout.Root>`;

const viewportCode = `<Viewport.Content safeArea="none">
  <Header.Root>
    <Viewport.BlockStart>
      <Toolbar.Root placement="block-start">…</Toolbar.Root>
    </Viewport.BlockStart>
    <Page.Root>
      {/* Clear of the bar over the page's end (anchors don't inset it). */}
      <List.Root className="clear-end">…</List.Root>
    </Page.Root>
  </Header.Root>
</Viewport.Content>
<Viewport.BlockEnd>
  <Toolbar.Root>…</Toolbar.Root>
</Viewport.BlockEnd>`;

/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** A page of grouped lists, on the grouped background (the default). */
const BackgroundGrouped: FunctionComponent = () => (
  <Component
    isInline
    id="page-composition-backgrounds"
    stage="phone"
    title="Page, grouped"
  >
    <Viewport.Content safeArea="none">
      <Header.Root>
        <Viewport.BlockStart>
          <Toolbar.Root placement="block-start">
            <Toolbar.Leading />
            <Toolbar.Title>
              <span>Settings</span>
            </Toolbar.Title>
            <Toolbar.Trailing />
          </Toolbar.Root>
        </Viewport.BlockStart>
        <Page.Root>
          <Header.LargeTitle>
            <span>Settings</span>
          </Header.LargeTitle>

          <List.Root>
            <List.Section>
              <List.Group>
                {Object.values(pages)
                  .slice(0, 5)
                  .map(({ title }) => (
                    <List.Item key={title}>
                      <List.Title>{title}</List.Title>
                    </List.Item>
                  ))}
              </List.Group>
            </List.Section>
          </List.Root>
        </Page.Root>
      </Header.Root>
    </Viewport.Content>
  </Component>
);

/** A page of a plain list, on the plain background. */
const BackgroundPlain: FunctionComponent = () => (
  <Component
    isInline
    id="page-composition-backgrounds-plain"
    stage="phone"
    title="Page, plain"
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
        <Page.Root background="plain">
          <Header.LargeTitle>
            <span>Contacts</span>
          </Header.LargeTitle>

          <List.Root listStyle="plain">
            <List.Section>
              <List.Group>
                {names.slice(0, 12).map((name) => (
                  <List.Item key={name}>
                    <List.Title>{name}</List.Title>
                  </List.Item>
                ))}
              </List.Group>
            </List.Section>
          </List.Root>
        </Page.Root>
      </Header.Root>
    </Viewport.Content>
  </Component>
);

/** Pages in a stack: scroll one, push, pop: it's where it was. */
const InAStack: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [keys, setKeys] = useState(['settings']);
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
      id="page-composition-stack"
      log={log}
      stage="phone"
      title="Pages in a stack"
    >
      <Viewport.Content safeArea="none">
        <Navigation.Root onBack={pop}>
          <Navigation.SwipeArea />
          <Viewport.BlockStart>
            <Toolbar.Root placement="block-start">
              <Toolbar.Leading>
                {keys.length > 1 ? (
                  <Navigation.Back
                    aria-label={pages[keys.at(-2) ?? '']?.title}
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
            {keys.map((key) => (
              <Header.Root key={key}>
                <Viewport.BlockStart>
                  <Toolbar.Root placement="block-start">
                    <Toolbar.Title>
                      <span>{pages[key]?.title}</span>
                    </Toolbar.Title>
                  </Toolbar.Root>
                </Viewport.BlockStart>
                <Page.Root>
                  <List.Root>
                    <List.Section>
                      <List.Group>
                        {pages[key]?.children.map((child) => (
                          <List.Item key={child}>
                            <List.Title
                              render={<button type="button" />}
                              onClick={() => push(child)}
                            >
                              {pages[child]?.title}
                            </List.Title>
                            <List.DrillIn />
                          </List.Item>
                        ))}
                      </List.Group>
                    </List.Section>
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
              </Header.Root>
            ))}
          </Navigation.Stack>
        </Navigation.Root>
      </Viewport.Content>
    </Component>
  );
};

/** A page beside a floating sidebar: inset, its background beneath it. */
const InAColumn: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [selected, setSelected] = useState('inbox');

  return (
    <Component
      isExpanded
      isInline
      id="page-composition-column"
      log={log}
      stage="tablet"
      title="Page beside a sidebar"
    >
      <Viewport.Content safeArea="none">
        <Layout.Root>
          <Layout.Column
            floating
            aria-label="Sidebar"
            defaultSize={300}
          >
            <Sidebar.Root aria-label="Mailboxes">
              <List.Root listStyle="sidebar">
                {sidebarSections.map(([title, rows]) => (
                  <List.Section key={title}>
                    <List.Header prominence="nested">
                      <List.Title>{title}</List.Title>
                    </List.Header>
                    <List.Group>
                      {rows.map(([value, rowTitle, icon]) => (
                        <List.Item
                          key={value}
                          selected={selected === value}
                        >
                          <List.Image variant="symbol">
                            <Symbol icon={icon} />
                          </List.Image>
                          <List.Title
                            render={<button type="button" />}
                            onClick={() => {
                              addLog(`select: ${value}`);
                              setSelected(value);
                            }}
                          >
                            {rowTitle}
                          </List.Title>
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                ))}
              </List.Root>
            </Sidebar.Root>
          </Layout.Column>
          <Layout.Column clearFloating>
            <Header.Root>
              <Viewport.BlockStart>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Leading />
                  <Toolbar.Title>
                    <span>{rowTitles[selected]}</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing />
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root>
                <Header.LargeTitle>
                  <span>{rowTitles[selected]}</span>
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
              </Page.Root>
            </Header.Root>
          </Layout.Column>
        </Layout.Root>
      </Viewport.Content>
    </Component>
  );
};

/** A page in a viewport's content layer, a bottom toolbar over its end. */
const OverAViewport: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      isInline
      id="page-composition-viewport"
      log={log}
      stage="phone"
      title="Page beneath a bottom bar"
    >
      <>
        <Viewport.Content safeArea="none">
          <Header.Root>
            <Viewport.BlockStart>
              <Toolbar.Root placement="block-start">
                <Toolbar.Leading />
                <Toolbar.Title>
                  <span>Notes</span>
                </Toolbar.Title>
                <Toolbar.Trailing />
              </Toolbar.Root>
            </Viewport.BlockStart>
            <Page.Root>
              <Header.LargeTitle>
                <span>Notes</span>
              </Header.LargeTitle>

              <List.Root className="page-demo-clear-end">
                <List.Section>
                  <List.Group>
                    {names.map((name) => (
                      <List.Item key={name}>
                        <List.Title>{`Note for ${name}`}</List.Title>
                      </List.Item>
                    ))}
                  </List.Group>
                </List.Section>
              </List.Root>
            </Page.Root>
          </Header.Root>
        </Viewport.Content>
        <Viewport.BlockEnd>
          <Toolbar.Root>
            <Toolbar.Leading>
              <Toolbar.Button
                aria-label="Folders"
                shape="circle"
                onClick={() => addLog('Folders clicked')}
              >
                <Button.Icon>
                  <Symbol icon={sfFolder} />
                </Button.Icon>
              </Toolbar.Button>
            </Toolbar.Leading>
            <Toolbar.Title>
              <span>{names.length} Notes</span>
            </Toolbar.Title>
            <Toolbar.Trailing>
              <Toolbar.Button
                aria-label="New note"
                shape="circle"
                onClick={() => addLog('New note clicked')}
              >
                <Button.Icon>
                  <Symbol icon={sfSquareAndPencil} />
                </Button.Icon>
              </Toolbar.Button>
            </Toolbar.Trailing>
          </Toolbar.Root>
        </Viewport.BlockEnd>
      </>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['grouped-or-plain', 'Grouped or plain'],
  ['pages-in-a-stack', 'Pages in a stack'],
  ['beside-a-sidebar', 'Beside a sidebar'],
  ['beneath-a-bottom-bar', 'Beneath a bottom bar'],
];

/** `/page/composition`: pages, in what holds them. */
export const PageComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A page holds a <a href="header">Header</a> and its content (lists); it’s
        held by a stack, a column, a viewport’s content layer.
      </li>
      <li>
        A Surface holding Regions and a Collection (guide,{' '}
        <GuideLink to="section-6-containment">§6</GuideLink>).
      </li>
    </ul>

    <Heading
      id="grouped-or-plain"
      level={2}
    >
      Grouped or plain
    </Heading>
    <ul>
      <li>
        Grouped lists (<code>insetGrouped</code>, <code>grouped</code>) on the
        grouped background (the default): Settings’.
      </li>
      <li>
        Plain lists and other content on the plain background (
        <code>background=&quot;plain&quot;</code>): Contacts’.
      </li>
    </ul>
    <CodeView code={backgroundsCode} />
    <BackgroundGrouped />
    <BackgroundPlain />

    <Heading
      id="pages-in-a-stack"
      level={2}
    >
      Pages in a stack
    </Heading>
    <ul>
      <li>
        A{' '}
        <PartLink
          component="navigation"
          part="Navigation.Stack"
        />
        ’s children, one per level, each scrolling on its own; the back button
        in a bar that stays, beside the stack.
      </li>
      <li>
        Under the top one: hidden, kept mounted, so popping back finds it where
        it was scrolled to (scroll Settings, drill in, go back).
      </li>
    </ul>
    <CodeView code={stackCode} />
    <InAStack />

    <Heading
      id="beside-a-sidebar"
      level={2}
    >
      Beside a sidebar
    </Heading>
    <ul>
      <li>
        In a <a href="layout">Layout</a> column clear of a floating one (
        <code>clearFloating</code>): its content inset by the sidebar’s size,
        its background (and its bar’s edge) running underneath it.
      </li>
      <li>
        Resize the sidebar (its <code>defaultSize</code>, or resizable): the
        inset follows.
      </li>
    </ul>
    <CodeView code={columnCode} />
    <InAColumn />

    <Heading
      id="beneath-a-bottom-bar"
      level={2}
    >
      Beneath a bottom bar
    </Heading>
    <ul>
      <li>
        In a <a href="viewport">Viewport</a>’s content layer, a bottom{' '}
        <a href="toolbar">Toolbar</a> floating over the page’s end.
      </li>
      <li>
        The page keeps its end clear of the bar (anchors don’t inset it): its
        last list padded (here, a class of the app’s).
      </li>
    </ul>
    <CodeView code={viewportCode} />
    <OverAViewport />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const pageCompositionDemos = [
  BackgroundGrouped,
  BackgroundPlain,
  InAStack,
  InAColumn,
  OverAViewport,
];
