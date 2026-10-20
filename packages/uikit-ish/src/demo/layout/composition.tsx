import { sfICircle } from '@bradleyhodges/sfsymbols/sfICircle';
import { sfListBullet } from '@bradleyhodges/sfsymbols/sfListBullet';
import { FunctionComponent, useState } from 'react';

import {
  Button,
  Header,
  Layout,
  List,
  Page,
  Sidebar,
  Symbol,
  Toolbar,
} from '../../components/index.js';
import { CodeView } from '../frame/code-view.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { Contents, Heading, type Section } from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';
import { rowTitles, sidebarSections } from '../sidebar/content.js';
import { names } from '../viewport/content.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */

const threeColumnsCode = `<Layout.Root>
  {/* Fixed: the mailboxes. */}
  <Layout.Column defaultSize={180} minSize={160}>
    <Page.Root>…</Page.Root>
  </Layout.Column>
  {/* Resizable: the messages. */}
  <Layout.Column resizable defaultSize={220} minSize={200}>
    <Page.Root>…</Page.Root>
  </Layout.Column>
  {/* Flexible: the message. */}
  <Layout.Column minSize={140}>
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

const inspectorCode = `<Layout.Root compact>
  <Layout.Column
    drawer="inline-start"
    open={sidebarOpen}
    onOpenChange={setSidebarOpen}
  >
    <Page.Root>…</Page.Root>
  </Layout.Column>
  <Layout.Column>
    <Page.Root>
      <Header.Root>
        <Header.Bar>
          <Toolbar.Leading>
            <Toolbar.Button aria-label="Mailboxes" shape="circle" onClick={() => setSidebarOpen(true)}>…</Toolbar.Button>
          </Toolbar.Leading>
          <Toolbar.Title>…</Toolbar.Title>
          <Toolbar.Trailing>
            <Toolbar.Button aria-label="Info" shape="circle" onClick={() => setInspectorOpen(true)}>…</Toolbar.Button>
          </Toolbar.Trailing>
        </Header.Bar>
      </Header.Root>
      …
    </Page.Root>
  </Layout.Column>
  {/* An inspector, from the trailing edge. */}
  <Layout.Column
    drawer="inline-end"
    open={inspectorOpen}
    onOpenChange={setInspectorOpen}
  >
    <Page.Root>…</Page.Root>
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
  const [log, addLog] = useLog();
  const [mailbox, setMailbox] = useState('inbox');
  const [message, setMessage] = useState(names[0] ?? '');

  return (
    <Component
      center
      inline
      id="layout-composition-three-columns"
      log={log}
      title="Layout of three columns"
    >
      <div className="layout-demo-tablet">
        <Layout.Root>
          <Layout.Column
            defaultSize={180}
            minSize={160}
          >
            <Page.Root>
              <Header.Root>
                <Header.Bar>
                  <Toolbar.Leading />
                  <Toolbar.Title>
                    <span>Mailboxes</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing />
                </Header.Bar>
              </Header.Root>
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
          </Layout.Column>
          <Layout.Column
            resizable
            defaultSize={220}
            minSize={200}
          >
            <Page.Root>
              <Header.Root>
                <Header.Bar>
                  <Toolbar.Leading />
                  <Toolbar.Title>
                    <span>{rowTitles[mailbox]}</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing />
                </Header.Bar>
              </Header.Root>
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
          </Layout.Column>
          <Layout.Column minSize={140}>
            <Page.Root background="plain">
              <Header.Root>
                <Header.Bar>
                  <Toolbar.Leading />
                  <Toolbar.Title>
                    <span>{message}</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing />
                </Header.Bar>
              </Header.Root>
              <List.Root listStyle="plain">
                <List.Section>
                  <List.Block>
                    From {message}, in {rowTitles[mailbox]}.
                  </List.Block>
                </List.Section>
              </List.Root>
            </Page.Root>
          </Layout.Column>
        </Layout.Root>
      </div>
    </Component>
  );
};

/** A list column resized by its divider (controlled), its size below. */
const Resizable: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [size, setSize] = useState(320);

  return (
    <Component
      center
      inline
      id="layout-composition-resizable"
      log={log}
      title="Layout with a resizable column"
    >
      <div className="layout-demo-tablet">
        <Layout.Root>
          <Layout.Column
            resizable
            maxSize={480}
            minSize={240}
            size={size}
            onSizeChange={(next: number) => {
              addLog(`size: ${String(next)}`);
              setSize(next);
            }}
          >
            <Page.Root>
              <Header.Root>
                <Header.Bar>
                  <Toolbar.Leading />
                  <Toolbar.Title>
                    <span>Contacts</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing />
                </Header.Bar>
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
          </Layout.Column>
          <Layout.Column>
            <Page.Root background="plain" />
          </Layout.Column>
        </Layout.Root>
      </div>
      <p className="layout-demo-sizes">Contacts: {size}px (240–480)</p>
    </Component>
  );
};

/** A phone: the mailboxes from the leading edge, an inspector from the other. */
const Inspector: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [mailbox, setMailbox] = useState('inbox');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);

  return (
    <Component
      center
      inline
      id="layout-composition-inspector"
      log={log}
      title="Layout with an inspector"
    >
      <div className="layout-demo-phone">
        <Layout.Root compact>
          <Layout.Column
            drawer="inline-start"
            open={sidebarOpen}
            onOpenChange={(next: boolean) => {
              addLog(`mailboxes open: ${String(next)}`);
              setSidebarOpen(next);
            }}
          >
            <Page.Root>
              <Header.Root>
                <Header.Bar>
                  <Toolbar.Leading />
                  <Toolbar.Title>
                    <span>Mailboxes</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing />
                </Header.Bar>
              </Header.Root>
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
                              setSidebarOpen(false);
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
          </Layout.Column>
          <Layout.Column>
            <Page.Root>
              <Header.Root>
                <Header.Bar>
                  <Toolbar.Leading>
                    <Toolbar.Button
                      aria-label="Mailboxes"
                      shape="circle"
                      onClick={() => setSidebarOpen(true)}
                    >
                      <Button.Icon>
                        <Symbol icon={sfListBullet} />
                      </Button.Icon>
                    </Toolbar.Button>
                  </Toolbar.Leading>
                  <Toolbar.Title>
                    <span>{rowTitles[mailbox]}</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing>
                    <Toolbar.Button
                      aria-label="Info"
                      shape="circle"
                      onClick={() => setInspectorOpen(true)}
                    >
                      <Button.Icon>
                        <Symbol icon={sfICircle} />
                      </Button.Icon>
                    </Toolbar.Button>
                  </Toolbar.Trailing>
                </Header.Bar>
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
          </Layout.Column>
          <Layout.Column
            drawer="inline-end"
            open={inspectorOpen}
            onOpenChange={(next: boolean) => {
              addLog(`info open: ${String(next)}`);
              setInspectorOpen(next);
            }}
          >
            <Page.Root>
              <Header.Root>
                <Header.Bar>
                  <Toolbar.Leading />
                  <Toolbar.Title>
                    <span>Info</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing />
                </Header.Bar>
              </Header.Root>
              <List.Root>
                <List.Section>
                  <List.Group>
                    <List.Item>
                      <List.Title>Mailbox</List.Title>
                      <List.Detail>{rowTitles[mailbox]}</List.Detail>
                    </List.Item>
                    <List.Item>
                      <List.Title>Messages</List.Title>
                      <List.Detail>{names.length}</List.Detail>
                    </List.Item>
                  </List.Group>
                </List.Section>
              </List.Root>
            </Page.Root>
          </Layout.Column>
        </Layout.Root>
      </div>
    </Component>
  );
};

/** A picture behind a floating sidebar and a transparent page. */
const BackgroundBehind: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [selected, setSelected] = useState('inbox');

  return (
    <Component
      center
      inline
      id="layout-composition-background"
      log={log}
      title="Layout on a background"
    >
      <div className="layout-demo-tablet">
        <Layout.Root>
          <Layout.Background>
            <div
              aria-hidden="true"
              className="layout-demo-picture"
            />
          </Layout.Background>
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
            <Page.Root className="layout-demo-transparent">
              <Header.Root>
                <Header.Bar context="adaptive">
                  <Toolbar.Leading />
                  <Toolbar.Title>
                    <span>{rowTitles[selected]}</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing />
                </Header.Bar>
                <Header.LargeTitle>
                  <span>{rowTitles[selected]}</span>
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
          </Layout.Column>
        </Layout.Root>
      </div>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['three-columns', 'Three columns'],
  ['resizing-a-column', 'Resizing a column'],
  ['an-inspector', 'An inspector'],
  ['a-background-behind', 'A background behind'],
];

/** `/layout/composition`: columns of pages, drawers, a background. */
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
        Each a page of its own, scrolling on its own; sized to fit here (Expand
        for a tablet’s width).
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
      id="an-inspector"
      level={2}
    >
      An inspector
    </Heading>
    <ul>
      <li>
        Compact: a drawer at each edge, the mailboxes from the leading one, an
        inspector (Info) from the trailing one; each swiped in from its edge, or
        opened by the bar’s buttons.
      </li>
      <li>Choosing a mailbox closes its drawer (controlled).</li>
    </ul>
    <CodeView code={inspectorCode} />
    <Inspector />

    <Heading
      id="a-background-behind"
      level={2}
    >
      A background behind
    </Heading>
    <ul>
      <li>
        A picture behind the columns (<code>Layout.Background</code>), through a
        floating sidebar’s glass and a transparent page (its list’s background
        too).
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
  Inspector,
  BackgroundBehind,
];
