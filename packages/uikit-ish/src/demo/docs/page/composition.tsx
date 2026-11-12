import { FunctionComponent, useMemo, useState } from 'react';

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
import { usePartControls } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import {
  sfChevronBackward,
  sfFolder,
  sfSquareAndPencil,
} from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { pages } from '../navigation/content.js';
import { partPropMaps } from '../part-options.js';
import { rowTitles, sidebarSections } from '../sidebar/content.js';
import { names } from '../viewport/content.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */

const backgroundsCode = `{/* Grouped lists, on the grouped background (the default). */}
<Header.Root>
  <Viewport.BlockStart>…</Viewport.BlockStart>
  <Page.Root>
    <Viewport.Padding edge="block-start" />
    <List.Root>…</List.Root>
    <Viewport.Padding edge="block-end" />
  </Page.Root>
</Header.Root>

{/* Plain lists and other content, on the plain one. */}
<Header.Root>
  <Viewport.BlockStart>…</Viewport.BlockStart>
  <Page.Root background="plain">
    <Viewport.Padding edge="block-start" />
    <List.Root listStyle="plain">…</List.Root>
    <Viewport.Padding edge="block-end" />
  </Page.Root>
</Header.Root>`;

const stackCode = `const [keys, setKeys] = useState(['settings']);
const pop = () => setKeys((current) => current.slice(0, -1));

<Navigation.Root onBack={pop}>
  <Navigation.SwipeArea />
  <Navigation.Stack>
    {keys.map((key, index) => (
      // Under the top one: hidden, kept (its scroll position too).
      <Header.Root key={key}>
        <Viewport.BlockStart>
          <Toolbar.Root placement="block-start">
            {/* Each pushed page's back button: staying put between them. */}
            {index > 0 ? (
              <Toolbar.Leading>
                <Navigation.Back … />
              </Toolbar.Leading>
            ) : null}
            <Toolbar.Title>…</Toolbar.Title>
          </Toolbar.Root>
        </Viewport.BlockStart>
        <Page.Root>
          <Viewport.Padding edge="block-start" />
          <List.Root>…</List.Root>
          <Viewport.Padding edge="block-end" />
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
        <Viewport.Padding edge="block-start" />
        <List.Root>…</List.Root>
        <Viewport.Padding edge="block-end" />
      </Page.Root>
    </Header.Root>
  </Layout.Column>
</Layout.Root>`;

const viewportCode = `<Viewport.Content>
  <Header.Root>
    <Viewport.BlockStart>
      <Toolbar.Root placement="block-start">…</Toolbar.Root>
    </Viewport.BlockStart>
    <Page.Root>
      <Viewport.Padding edge="block-start" />
      <List.Root>…</List.Root>
      {/* Its end scrolling out from under the bar at the bottom. */}
      <Viewport.Padding edge="block-end" />
    </Page.Root>
  </Header.Root>
</Viewport.Content>
<Viewport.BlockEnd>
  <Toolbar.Root>…</Toolbar.Root>
</Viewport.BlockEnd>`;

/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** A page of grouped lists, on the grouped background (the default). */
const BackgroundGrouped: FunctionComponent = () => {
  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Header.LargeTitle': [],
          'List.Content': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
          'Page.Root': [],
          'Toolbar.Leading': [],
          'Toolbar.Root': ['placement'],
          'Toolbar.Title': [],
          'Toolbar.Trailing': [],
          'Viewport.BlockStart': [],
          'Viewport.Content': [],
          'Viewport.Padding': ['edge'],
        }),
      [],
    ),
    { provided: useProvidedState('page-composition-backgrounds') },
  );
  return (
    <Component
      isInline
      controls={[partControls]}
      id="page-composition-backgrounds"
      stage="phone"
      state={[partState]}
      title="Page, grouped"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Header.Root>
          <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
            <Toolbar.Root
              {...partProps['Toolbar.Root']}
              placement="block-start"
            >
              <Toolbar.Leading {...partProps['Toolbar.Leading']} />
              <Toolbar.Title {...partProps['Toolbar.Title']}>
                <span>Settings</span>
              </Toolbar.Title>
              <Toolbar.Trailing {...partProps['Toolbar.Trailing']} />
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
                  {Object.values(pages)
                    .slice(0, 5)
                    .map(({ title }) => (
                      <List.Item
                        key={title}
                        {...partProps['List.Item']}
                      >
                        <List.Content {...partProps['List.Content']}>
                          <List.Title {...partProps['List.Title']}>
                            {title}
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

/** A page of a plain list, on the plain background. */
const BackgroundPlain: FunctionComponent = () => {
  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Header.LargeTitle': [],
          'List.Content': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': ['listStyle'],
          'List.Section': [],
          'List.Title': [],
          'Page.Root': ['background'],
          'Toolbar.Leading': [],
          'Toolbar.Root': ['placement'],
          'Toolbar.Title': [],
          'Toolbar.Trailing': [],
          'Viewport.BlockStart': [],
          'Viewport.Content': [],
          'Viewport.Padding': ['edge'],
        }),
      [],
    ),
    { provided: useProvidedState('page-composition-backgrounds-plain') },
  );
  return (
    <Component
      isInline
      controls={[partControls]}
      id="page-composition-backgrounds-plain"
      stage="phone"
      state={[partState]}
      title="Page, plain"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Header.Root>
          <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
            <Toolbar.Root
              {...partProps['Toolbar.Root']}
              placement="block-start"
            >
              <Toolbar.Leading {...partProps['Toolbar.Leading']} />
              <Toolbar.Title {...partProps['Toolbar.Title']}>
                <span>Contacts</span>
              </Toolbar.Title>
              <Toolbar.Trailing {...partProps['Toolbar.Trailing']} />
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root
            {...partProps['Page.Root']}
            background="plain"
          >
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-start"
            />
            <Header.LargeTitle {...partProps['Header.LargeTitle']}>
              <span>Contacts</span>
            </Header.LargeTitle>

            <List.Root
              {...partProps['List.Root']}
              listStyle="plain"
            >
              <List.Section {...partProps['List.Section']}>
                <List.Group {...partProps['List.Group']}>
                  {names.slice(0, 12).map((name) => (
                    <List.Item
                      key={name}
                      {...partProps['List.Item']}
                    >
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'List.Content': [],
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
    { provided: useProvidedState('page-composition-stack') },
  );

  return (
    <Component
      isInline
      controls={[partControls]}
      id="page-composition-stack"
      log={log}
      stage="phone"
      state={[partState]}
      title="Pages in a stack"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Navigation.Root
          {...partProps['Navigation.Root']}
          onBack={pop}
        >
          <Navigation.SwipeArea {...partProps['Navigation.SwipeArea']} />
          <Navigation.Stack {...partProps['Navigation.Stack']}>
            {keys.map((key, index) => (
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
                          aria-label={pages[keys[index - 1] ?? '']?.title}
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
                      <span>{pages[key]?.title}</span>
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
                        {pages[key]?.children.map((child) => (
                          <List.Item
                            key={child}
                            {...partProps['List.Item']}
                          >
                            <List.Content {...partProps['List.Content']}>
                              <List.Title
                                {...partProps['List.Title']}
                                render={<button type="button" />}
                                onClick={() => push(child)}
                              >
                                {pages[child]?.title}
                              </List.Title>
                            </List.Content>
                            <List.Trailing {...partProps['List.Trailing']}>
                              <List.DrillIn {...partProps['List.DrillIn']} />
                            </List.Trailing>
                          </List.Item>
                        ))}
                      </List.Group>
                    </List.Section>
                    <List.Section {...partProps['List.Section']}>
                      <List.Group {...partProps['List.Group']}>
                        {names.map((name) => (
                          <List.Item
                            key={name}
                            {...partProps['List.Item']}
                          >
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Header.LargeTitle': [],
            'Layout.Column': ['aria-label', 'defaultSize', 'floating'],
            'Layout.Root': [],
            'List.Content': [],
            'List.Group': [],
            'List.Header': ['prominence'],
            'List.Image': ['variant'],
            'List.Item': ['selected'],
            'List.Leading': [],
            'List.Root': ['listStyle'],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
            'Page.Root': [],
            'Sidebar.Root': ['aria-label'],
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
    { provided: useProvidedState('page-composition-column') },
  );

  return (
    <Component
      isExpanded
      isInline
      controls={[partControls]}
      id="page-composition-column"
      log={log}
      stage="tablet"
      state={[partState]}
      title="Page beside a sidebar"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Layout.Root {...partProps['Layout.Root']}>
          <Layout.Column
            {...partProps['Layout.Column']}
            floating
            aria-label="Sidebar"
            defaultSize={300}
          >
            <Sidebar.Root
              {...partProps['Sidebar.Root']}
              aria-label="Mailboxes"
            >
              <List.Root
                {...partProps['List.Root']}
                listStyle="sidebar"
              >
                {sidebarSections.map(([title, rows]) => (
                  <List.Section
                    key={title}
                    {...partProps['List.Section']}
                  >
                    <List.Header
                      {...partProps['List.Header']}
                      prominence="nested"
                    >
                      <List.Title {...partProps['List.Title']}>
                        {title}
                      </List.Title>
                    </List.Header>
                    <List.Group {...partProps['List.Group']}>
                      {rows.map(([value, rowTitle, icon]) => (
                        <List.Item
                          key={value}
                          {...partProps['List.Item']}
                          selected={selected === value}
                        >
                          <List.Leading {...partProps['List.Leading']}>
                            <List.Image
                              {...partProps['List.Image']}
                              variant="symbol"
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
                              onClick={() => {
                                addLog(`select: ${value}`);
                                setSelected(value);
                              }}
                            >
                              {rowTitle}
                            </List.Title>
                          </List.Content>
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                ))}
              </List.Root>
            </Sidebar.Root>
          </Layout.Column>
          <Layout.Column
            {...partProps['Layout.Column']}
            clearFloating
          >
            <Header.Root>
              <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                <Toolbar.Root
                  {...partProps['Toolbar.Root']}
                  placement="block-start"
                >
                  <Toolbar.Leading {...partProps['Toolbar.Leading']} />
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <span>{rowTitles[selected]}</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing {...partProps['Toolbar.Trailing']} />
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root {...partProps['Page.Root']}>
                <Viewport.Padding
                  {...partProps['Viewport.Padding']}
                  edge="block-start"
                />
                <Header.LargeTitle {...partProps['Header.LargeTitle']}>
                  <span>{rowTitles[selected]}</span>
                </Header.LargeTitle>

                <List.Root {...partProps['List.Root']}>
                  <List.Section {...partProps['List.Section']}>
                    <List.Group {...partProps['List.Group']}>
                      {names.map((name) => (
                        <List.Item
                          key={name}
                          {...partProps['List.Item']}
                        >
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
          </Layout.Column>
        </Layout.Root>
      </Viewport.Content>
    </Component>
  );
};

/** A page in a viewport's content layer, a bottom toolbar over its end. */
const OverAViewport: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Header.LargeTitle': [],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'Page.Root': [],
            'Toolbar.Button': ['aria-label', 'onClick', 'shape'],
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
    { provided: useProvidedState('page-composition-viewport') },
  );

  return (
    <Component
      isInline
      controls={[partControls]}
      id="page-composition-viewport"
      log={log}
      stage="phone"
      state={[partState]}
      title="Page beneath a bottom bar"
    >
      <>
        <Viewport.Content {...partProps['Viewport.Content']}>
          <Header.Root>
            <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
              <Toolbar.Root
                {...partProps['Toolbar.Root']}
                placement="block-start"
              >
                <Toolbar.Leading {...partProps['Toolbar.Leading']} />
                <Toolbar.Title {...partProps['Toolbar.Title']}>
                  <span>Notes</span>
                </Toolbar.Title>
                <Toolbar.Trailing {...partProps['Toolbar.Trailing']} />
              </Toolbar.Root>
            </Viewport.BlockStart>
            <Page.Root {...partProps['Page.Root']}>
              <Viewport.Padding
                {...partProps['Viewport.Padding']}
                edge="block-start"
              />
              <Header.LargeTitle {...partProps['Header.LargeTitle']}>
                <span>Notes</span>
              </Header.LargeTitle>

              <List.Root {...partProps['List.Root']}>
                <List.Section {...partProps['List.Section']}>
                  <List.Group {...partProps['List.Group']}>
                    {names.map((name) => (
                      <List.Item
                        key={name}
                        {...partProps['List.Item']}
                      >
                        <List.Content {...partProps['List.Content']}>
                          <List.Title
                            {...partProps['List.Title']}
                          >{`Note for ${name}`}</List.Title>
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
        <Viewport.BlockEnd {...partProps['Viewport.BlockEnd']}>
          <Toolbar.Root {...partProps['Toolbar.Root']}>
            <Toolbar.Leading {...partProps['Toolbar.Leading']}>
              <Toolbar.Button
                {...partProps['Toolbar.Button']}
                aria-label="Folders"
                shape="circle"
                onClick={() => addLog('Folders clicked')}
              >
                <Button.Icon {...partProps['Button.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfFolder}
                  />
                </Button.Icon>
              </Toolbar.Button>
            </Toolbar.Leading>
            <Toolbar.Title {...partProps['Toolbar.Title']}>
              <span>{names.length} Notes</span>
            </Toolbar.Title>
            <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
              <Toolbar.Button
                {...partProps['Toolbar.Button']}
                aria-label="New note"
                shape="circle"
                onClick={() => addLog('New note clicked')}
              >
                <Button.Icon {...partProps['Button.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfSquareAndPencil}
                  />
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
        A page holds a <a href={publicUrl('header')}>Header</a> and its content
        (lists). A stack, a column or a viewport’s content layer holds the page.
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
        Grouped lists (<code>insetGrouped</code>, <code>grouped</code>) sit on
        the grouped background (the default), as in a settings app.
      </li>
      <li>
        Plain lists and other content sit on the plain background (
        <code>background=&quot;plain&quot;</code>), as in a contacts app.
      </li>
      <li>
        <strong>Library:</strong> the page’s backgrounds (
        <PartLink
          component="page"
          part="Page.Root"
        />{' '}
        <code>background</code>) and the lists’ styles.
      </li>
      <li>
        <strong>Demo:</strong> the rows.
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
        Pages are a{' '}
        <PartLink
          component="navigation"
          part="Navigation.Stack"
        />
        ’s children, one per level, each scrolling on its own. The back button
        sits in each pushed page’s bar and stays put between them.
      </li>
      <li>
        The pages under the top one are hidden but stay mounted. So going back
        finds a page where it was scrolled to (scroll Settings, drill in, and go
        back to see it).
      </li>
      <li>
        <strong>Library:</strong> pages as a navigation stack’s children, kept
        mounted under the top one, keeping their scroll positions.
      </li>
      <li>
        <strong>Demo:</strong> the stack’s keys and the pages.
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
        In a <a href={publicUrl('layout')}>Layout</a> column next to a floating
        one (<code>clearFloating</code>), its content is inset by the sidebar’s
        size, while its background (and its bar’s edge) runs underneath it.
      </li>
      <li>
        Resize the sidebar (its <code>defaultSize</code>, or make it resizable),
        and the inset follows.
      </li>
      <li>
        <strong>Library:</strong> the page kept clear of a floating column (
        <code>clearFloating</code>), with its content inset by the sidebar’s
        size.
      </li>
      <li>
        <strong>Demo:</strong> the sidebar’s rows and the selected one.
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
        In a <a href={publicUrl('viewport')}>Viewport</a>’s content layer, with
        a bottom <a href={publicUrl('toolbar')}>Toolbar</a> floating above the
        page’s end.
      </li>
      <li>
        Its end scrolls out from under the bar, thanks to a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />{' '}
        at the page’s end as tall as the bar. Another one sits at its start, for
        its header’s bar.
      </li>
      <li>
        <strong>Library:</strong> the bottom bar (
        <PartLink
          component="viewport"
          part="Viewport.BlockEnd"
        />
        ) and the paddings that make room for the bars (
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> the page’s rows and the bar’s actions (logged).
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
