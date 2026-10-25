import { FunctionComponent, useState } from 'react';

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
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';
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

const backgroundCode = `<Layout.Root>
  <Layout.Background>
    <img alt="" src="…" />
  </Layout.Background>
  <Layout.Column floating aria-label="Sidebar" defaultSize={300}>
    <Sidebar.Root aria-label="Mailboxes">…</Sidebar.Root>
  </Layout.Column>
  <Layout.Column clearFloating>
    {/* Transparent (the page's and its list's backgrounds): the picture
        shows through. */}
    <Page.Root className="transparent">…</Page.Root>
  </Layout.Column>
</Layout.Root>`;

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

  return (
    <Component
      isExpanded
      isInline
      controls={controls}
      id={id}
      log={log}
      stage="tablet"
      state={state}
      title="Layout of three columns"
    >
      <Viewport.Content safeArea="none">
        <Layout.Root {...propsRoot}>
          <Layout.Column
            key={keyFirst}
            {...propsFirst}
          >
            <Header.Root>
              <Viewport.BlockStart>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Leading />
                  <Toolbar.Title>
                    <span>Mailboxes</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing />
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root>
                <List.Root>
                  {sidebarSections.map(([title, rows]) => (
                    <List.Section key={title}>
                      <List.Group>
                        {rows.map(([value, rowTitle, icon]) => (
                          <List.Item key={value}>
                            <List.Image variant="symbol">
                              <Symbol icon={icon} />
                            </List.Image>
                            <List.Title
                              render={<button type="button" />}
                              onClick={() => {
                                addLog(`mailbox: ${value}`);
                                setMailbox(value);
                              }}
                            >
                              {rowTitle}
                            </List.Title>
                            {mailbox === value ? <List.Checkmark /> : null}
                          </List.Item>
                        ))}
                      </List.Group>
                    </List.Section>
                  ))}
                </List.Root>
              </Page.Root>
            </Header.Root>
          </Layout.Column>
          <Layout.Column
            key={keySecond}
            {...propsSecond}
          >
            <Header.Root>
              <Viewport.BlockStart>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Leading />
                  <Toolbar.Title>
                    <span>{rowTitles[mailbox]}</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing />
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root>
                <List.Root>
                  <List.Section>
                    <List.Group>
                      {names.map((name) => (
                        <List.Item key={name}>
                          <List.Title
                            render={<button type="button" />}
                            onClick={() => {
                              addLog(`message: ${name}`);
                              setMessage(name);
                            }}
                          >
                            {name}
                          </List.Title>
                          {message === name ? <List.Checkmark /> : null}
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                </List.Root>
              </Page.Root>
            </Header.Root>
          </Layout.Column>
          <Layout.Column
            key={keyThird}
            {...propsThird}
          >
            <Header.Root>
              <Viewport.BlockStart>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Leading />
                  <Toolbar.Title>
                    <span>{message}</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing />
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root background="plain">
                <List.Root listStyle="plain">
                  <List.Section>
                    <List.Block>
                      From {message}, in {rowTitles[mailbox]}.
                    </List.Block>
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

  return (
    <Component
      isExpanded
      isInline
      controls={controls}
      diagnostics={`Contacts: ${String(size)}px (240–480)`}
      id={id}
      log={log}
      setup="const [size, setSize] = useState(320);"
      stage="tablet"
      state={state}
      title="Layout with a resizable column"
    >
      <Viewport.Content safeArea="none">
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
          <Layout.Column
            key={keySecond}
            {...propsSecond}
          >
            <Page.Root background="plain" />
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

  return (
    <Component
      isExpanded
      isInline
      controls={controls}
      id={id}
      log={log}
      stage="tablet"
      state={state}
      title="Layout on a background"
    >
      <Viewport.Content safeArea="none">
        <Layout.Root {...propsRoot}>
          <Layout.Background {...propsBackground}>
            <div
              aria-hidden="true"
              className="layout-demo-picture"
            />
          </Layout.Background>
          <Layout.Column
            key={keyFirst}
            aria-label="Sidebar"
            {...propsFirst}
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
          <Layout.Column
            key={keySecond}
            {...propsSecond}
          >
            <Header.Root>
              <Viewport.BlockStart>
                <Toolbar.Root
                  context="adaptive"
                  placement="block-start"
                >
                  <Toolbar.Leading />
                  <Toolbar.Title>
                    <span>{rowTitles[selected]}</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing />
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root className="layout-demo-transparent">
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
        A layout holds columns, each holding a <a href="page">Page</a> (or a{' '}
        <a href="navigation">Navigation</a>, a <a href="sidebar">Sidebar</a>);
        it fills a screen (a <a href="viewport">Viewport</a>’s content layer).
      </li>
      <li>
        Sidebar and split (guide{' '}
        <GuideLink to="shell-b">§7.4, shell B</GuideLink>): sections, a list,
        the selected item.
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
        Mail’s: the mailboxes (fixed), the messages (resizable), the message
        (flexible, taking what’s left).
      </li>
      <li>
        Each a page of its own, scrolling on its own; each at least its{' '}
        <code>minSize</code> (240px, a list’s narrowest).
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
        Its divider dragged, or focused and the arrow keys pressed (Shift:
        further; Home and End: its smallest and largest), between{' '}
        <code>minSize</code> and <code>maxSize</code>.
      </li>
      <li>
        Controlled here (<code>size</code>, <code>onSizeChange</code>): the app
        holds the size (e.g. to keep it).
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
        Columns that don’t fit as drawers, the app’s choice (by the size class):
        see <a href="drawer/composition">Drawer</a>, e.g. an inspector.
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
        A picture behind the columns (
        <PartLink
          component="layout"
          part="Layout.Background"
        />
        ), through a floating sidebar’s glass and a transparent page (its list’s
        background too).
      </li>
      <li>
        The bar’s glass by what’s behind it (
        <code>context=&quot;adaptive&quot;</code>).
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
