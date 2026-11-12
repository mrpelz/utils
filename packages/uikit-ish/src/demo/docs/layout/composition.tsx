import { FunctionComponent, useMemo, useState } from 'react';

import {
  Header,
  Layout,
  List,
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
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import { rowTitles, sidebarSections } from '../sidebar/content.js';
import { names } from '../viewport/content.js';
import { useLayoutControls } from './props.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */

const threeColumnsCode = `<Layout.Root>
  {/* Fixed: the mailboxes. */}
  <Layout.Column defaultSize={240}>
    <Page.Root>…</Page.Root>
  </Layout.Column>
  {/* Resizable: the messages. */}
  <Layout.Column resizable defaultSize={280}>
    <Page.Root>…</Page.Root>
  </Layout.Column>
  {/* Flexible: the message (at least minSize, 240px, as all). */}
  <Layout.Column>
    <Page.Root background="plain">…</Page.Root>
  </Layout.Column>
</Layout.Root>`;

const resizableCode = `const [size, setSize] = useState(320);

<Layout.Root>
  <Layout.Column
    resizable
    maxSize={480}
    minSize={240}
    size={size}
    onSizeChange={setSize}
  >
    <Page.Root>…</Page.Root>
  </Layout.Column>
  <Layout.Column>
    <Page.Root background="plain">…</Page.Root>
  </Layout.Column>
</Layout.Root>`;

const backgroundCode = `<Viewport.Background>
  <img alt="" src="…" />
</Viewport.Background>
<Viewport.Content>
  {/* On the picture: no line between the columns. */}
  <Layout.Root hideSeparators>
    <Layout.Column floating aria-label="Sidebar" defaultSize={300}>
      <Sidebar.Root aria-label="Mailboxes">…</Sidebar.Root>
    </Layout.Column>
    <Layout.Column clearFloating>
      {/* Transparent (the page's and its list's backgrounds): the picture
          shows through. */}
      <Page.Root className="transparent">…</Page.Root>
    </Layout.Column>
  </Layout.Root>
</Viewport.Content>`;

/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** Mail on a tablet: mailboxes, messages (resizable), the message. */
const ThreeColumns: FunctionComponent = () => {
  const id = 'layout-composition-three-columns';
  const [log, addLog] = useLog();
  const [mailbox, setMailbox] = useState('inbox');
  const [message, setMessage] = useState(names[0] ?? '');
  const {
    controls,
    keyFirst,
    keySecond,
    keyThird,
    propsFirst,
    propsRoot,
    propsSecond,
    propsThird,
    state,
  } = useLayoutControls(id, addLog, {
    columns: [
      ['mailboxes', 240, false],
      ['messages', 280, true],
      ['message', undefined, false],
    ],
    isClosed: true,
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'List.Block': [],
            'List.Checkmark': [],
            'List.Content': [],
            'List.Group': [],
            'List.Image': ['variant'],
            'List.Item': [],
            'List.Leading': [],
            'List.Root': ['listStyle'],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
            'List.Trailing': [],
            'Page.Root': ['background'],
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
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isExpanded
      isInline
      controls={[controls, partControls]}
      id={id}
      log={log}
      stage="tablet"
      state={[...state, partState]}
      title="Layout of three columns"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Layout.Root {...propsRoot}>
          <Layout.Column
            key={keyFirst}
            {...propsFirst}
          >
            <Header.Root>
              <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                <Toolbar.Root
                  {...partProps['Toolbar.Root']}
                  placement="block-start"
                >
                  <Toolbar.Leading {...partProps['Toolbar.Leading']} />
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <span>Mailboxes</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing {...partProps['Toolbar.Trailing']} />
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root {...partProps['Page.Root']}>
                <Viewport.Padding
                  {...partProps['Viewport.Padding']}
                  edge="block-start"
                />
                <List.Root {...partProps['List.Root']}>
                  {sidebarSections.map(([title, rows]) => (
                    <List.Section
                      key={title}
                      {...partProps['List.Section']}
                    >
                      <List.Group {...partProps['List.Group']}>
                        {rows.map(([value, rowTitle, icon]) => (
                          <List.Item
                            key={value}
                            {...partProps['List.Item']}
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
                                  addLog(`mailbox: ${value}`);
                                  setMailbox(value);
                                }}
                              >
                                {rowTitle}
                              </List.Title>
                            </List.Content>
                            <List.Trailing {...partProps['List.Trailing']}>
                              {mailbox === value ? (
                                <List.Checkmark
                                  {...partProps['List.Checkmark']}
                                />
                              ) : null}
                            </List.Trailing>
                          </List.Item>
                        ))}
                      </List.Group>
                    </List.Section>
                  ))}
                </List.Root>
                <Viewport.Padding
                  {...partProps['Viewport.Padding']}
                  edge="block-end"
                />
              </Page.Root>
            </Header.Root>
          </Layout.Column>
          <Layout.Column
            key={keySecond}
            {...propsSecond}
          >
            <Header.Root>
              <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                <Toolbar.Root
                  {...partProps['Toolbar.Root']}
                  placement="block-start"
                >
                  <Toolbar.Leading {...partProps['Toolbar.Leading']} />
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <span>{rowTitles[mailbox]}</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing {...partProps['Toolbar.Trailing']} />
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
                      {names.map((name) => (
                        <List.Item
                          key={name}
                          {...partProps['List.Item']}
                        >
                          <List.Content {...partProps['List.Content']}>
                            <List.Title
                              {...partProps['List.Title']}
                              render={<button type="button" />}
                              onClick={() => {
                                addLog(`message: ${name}`);
                                setMessage(name);
                              }}
                            >
                              {name}
                            </List.Title>
                          </List.Content>
                          <List.Trailing {...partProps['List.Trailing']}>
                            {message === name ? (
                              <List.Checkmark
                                {...partProps['List.Checkmark']}
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
          </Layout.Column>
          <Layout.Column
            key={keyThird}
            {...propsThird}
          >
            <Header.Root>
              <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                <Toolbar.Root
                  {...partProps['Toolbar.Root']}
                  placement="block-start"
                >
                  <Toolbar.Leading {...partProps['Toolbar.Leading']} />
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <span>{message}</span>
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
                <List.Root
                  {...partProps['List.Root']}
                  listStyle="plain"
                >
                  <List.Section {...partProps['List.Section']}>
                    <List.Block {...partProps['List.Block']}>
                      From {message}, in {rowTitles[mailbox]}.
                    </List.Block>
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

/** A list column resized by its divider (controlled), its size below. */
const Resizable: FunctionComponent = () => {
  const id = 'layout-composition-resizable';
  const [log, addLog] = useLog();
  const [size, setSize] = useState(320);
  const { controls, keySecond, propsFirst, propsRoot, propsSecond, state } =
    useLayoutControls(id, addLog, {
      columns: [
        [
          'contacts',
          320,
          true,
          { isControlled: true, maxSize: 480, minSize: 240 },
        ],
        ['contact', undefined, false],
      ],
      isClosed: true,
    });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
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
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isExpanded
      isInline
      controls={[controls, partControls]}
      diagnostics={`Contacts: ${String(size)}px (240–480)`}
      id={id}
      log={log}
      setup="const [size, setSize] = useState(320);"
      stage="tablet"
      state={[...state, partState]}
      title="Layout with a resizable column"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Layout.Root {...propsRoot}>
          <Layout.Column
            {...propsFirst}
            size={size}
            onSizeChange={(next: number) => {
              addLog(`size: ${String(next)}`);
              setSize(next);
            }}
          >
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
              <Page.Root {...partProps['Page.Root']}>
                <Viewport.Padding
                  {...partProps['Viewport.Padding']}
                  edge="block-start"
                />
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
          <Layout.Column
            key={keySecond}
            {...propsSecond}
          >
            <Page.Root
              {...partProps['Page.Root']}
              background="plain"
            />
          </Layout.Column>
        </Layout.Root>
      </Viewport.Content>
    </Component>
  );
};

/** A picture behind a floating sidebar and a transparent page. */
const BackgroundBehind: FunctionComponent = () => {
  const id = 'layout-composition-background';
  const [log, addLog] = useLog();
  const [selected, setSelected] = useState('inbox');
  const {
    controls,
    keyFirst,
    keySecond,
    propsBackground,
    propsFirst,
    propsRoot,
    propsSecond,
    state,
  } = useLayoutControls(id, addLog, {
    columns: [
      ['sidebar', 300, false, { isFloating: true }],
      ['mailbox', undefined, false, { isClearFloating: true }],
    ],
    hasBackground: true,
    isClosed: true,
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Header.LargeTitle': [],
            'List.Content': [],
            'List.Group': [],
            'List.Header': ['prominence'],
            'List.Image': ['variant'],
            'List.Item': ['selected'],
            'List.Leading': [],
            'List.Root': ['listStyle'],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
            'Page.Root': ['className'],
            'Sidebar.Root': ['aria-label'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['context', 'placement'],
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
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isExpanded
      isInline
      controls={[controls, partControls]}
      id={id}
      log={log}
      stage="tablet"
      state={[...state, partState]}
      title="Layout on a background"
    >
      <Viewport.Background {...propsBackground}>
        <div
          aria-hidden="true"
          className="demo-picture"
        />
      </Viewport.Background>
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Layout.Root
          {...propsRoot}
          // (On the picture: no line between the columns, unless set.)
          hideSeparators={propsRoot.hideSeparators ?? true}
        >
          <Layout.Column
            key={keyFirst}
            aria-label="Sidebar"
            {...propsFirst}
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
            key={keySecond}
            {...propsSecond}
          >
            <Header.Root>
              <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                <Toolbar.Root
                  {...partProps['Toolbar.Root']}
                  context="adaptive"
                  placement="block-start"
                >
                  <Toolbar.Leading {...partProps['Toolbar.Leading']} />
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <span>{rowTitles[selected]}</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing {...partProps['Toolbar.Trailing']} />
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root
                {...partProps['Page.Root']}
                className="layout-demo-transparent"
              >
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

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['three-columns', 'Three columns'],
  ['resizing-a-column', 'Resizing a column'],
  ['on-a-phone', 'On a phone'],
  ['a-background-behind', 'A background behind'],
];

/** `/layout/composition`: columns of pages, a background. */
export const LayoutComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A layout holds columns, and each column holds a{' '}
        <a href={publicUrl('page')}>Page</a> (or a{' '}
        <a href={publicUrl('navigation')}>Navigation</a>, or a{' '}
        <a href={publicUrl('sidebar')}>Sidebar</a>). The layout fills a screen,
        inside a <a href={publicUrl('viewport')}>Viewport</a>’s content layer.
      </li>
      <li>
        A sidebar and a split view: sections, a list, and the selected item.
      </li>
    </ul>

    <Heading
      id="three-columns"
      level={2}
    >
      Three columns
    </Heading>
    <ul>
      <li>
        As in a mail app: the mailboxes (fixed), the messages (resizable) and
        the message (flexible, taking the rest).
      </li>
      <li>
        Each column is a page of its own and scrolls on its own. None gets
        narrower than its <code>minSize</code> (240px, the narrowest a list
        should be).
      </li>
      <li>
        <strong>Library:</strong> the layout’s columns (
        <PartLink
          component="layout"
          part="Layout.Column"
        />
        : fixed, resizable and flexible, each at least its <code>minSize</code>
        ).
      </li>
      <li>
        <strong>Demo:</strong> the mailboxes and messages, the selected mailbox
        and message, and the columns’ prop controls.
      </li>
    </ul>
    <CodeView code={threeColumnsCode} />
    <ThreeColumns />

    <Heading
      id="resizing-a-column"
      level={2}
    >
      Resizing a column
    </Heading>
    <ul>
      <li>
        Drag its divider, or focus it and press the arrow keys (Shift moves
        further, Home and End go to its smallest and largest size). It stays
        between <code>minSize</code> and <code>maxSize</code>.
      </li>
      <li>
        It’s controlled here (<code>size</code>, <code>onSizeChange</code>): the
        app holds the size, for example to remember it.
      </li>
      <li>
        <strong>Library:</strong> resizing by the divider or its keys, within{' '}
        <code>minSize</code> and <code>maxSize</code>, controlled by{' '}
        <code>size</code> and <code>onSizeChange</code>.
      </li>
      <li>
        <strong>Demo:</strong> holding the size, for example to remember it.
      </li>
    </ul>
    <CodeView code={resizableCode} />
    <Resizable />

    <Heading
      id="on-a-phone"
      level={2}
    >
      On a phone
    </Heading>
    <ul>
      <li>
        Columns that don’t fit can become drawers, if the app chooses so by the
        size class. For example an inspector (see{' '}
        <a href={publicUrl('drawer/composition')}>Drawer</a>).
      </li>
    </ul>

    <Heading
      id="a-background-behind"
      level={2}
    >
      A background behind
    </Heading>
    <ul>
      <li>
        A picture behind the layout (
        <PartLink
          component="viewport"
          part="Viewport.Background"
        />
        ) shows through a floating sidebar’s glass and through a transparent
        page, including its list’s background.
      </li>
      <li>
        The bar’s glass adapts to what’s behind it (
        <code>context=&quot;adaptive&quot;</code>).
      </li>
      <li>
        <strong>Library:</strong> the screen’s background layer behind the
        layout (
        <PartLink
          component="viewport"
          part="Viewport.Background"
        />
        ), the floating sidebar’s glass (
        <PartLink
          component="sidebar"
          part="Sidebar.Root"
        />
        ) and the bar’s adaptive glass.
      </li>
      <li>
        <strong>Demo:</strong> the picture, the sidebar’s rows and the selected
        one.
      </li>
    </ul>
    <CodeView code={backgroundCode} />
    <BackgroundBehind />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const layoutCompositionDemos = [
  ThreeColumns,
  Resizable,
  BackgroundBehind,
];
