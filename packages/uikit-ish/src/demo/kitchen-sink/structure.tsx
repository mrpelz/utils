import { FunctionComponent, ReactNode, useState } from 'react';

import {
  Accordion,
  Button,
  Collapsible,
  Drawer,
  type DrawerSide,
  Header,
  Layout,
  List,
  Page,
  PageControl,
  Sidebar,
  Symbol,
  TabBar,
  TextField,
  Toolbar,
  useViewportScroll,
  Viewport,
} from '../../components/index.js';
import {
  sfArchivebox,
  sfArrowshapeTurnUpLeft,
  sfEllipsis,
  sfEnvelopeFill,
  sfFlag,
  sfFolder,
  sfForwardFill,
  sfGearshapeFill,
  sfHeartFill,
  sfMagnifyingglass,
  sfPersonFill,
  sfPhoto,
  sfPlayFill,
  sfSquareAndArrowUp,
  sfSquareAndPencil,
  sfTrash,
  sfTray,
} from '../tooling/icons.js';
import {
  BackButton,
  DrillRow,
  Row,
  Rows,
  Showcase,
  type SinkPage,
  type SinkPages,
  usePush,
} from './shared.js';

// Structure & Navigation: Toolbar, Tab Bar, Page Control, Collapsible,
// Accordion, Drawer, Layout, Sidebar, Navigation, Page, Header, Viewport.

/** A toolbar's symbol button. */
const iconButton = (label: string, icon: typeof sfFolder) => (
  <Toolbar.Button
    aria-label={label}
    disabled={false}
    shape="circle"
  >
    <Button.Icon>
      <Symbol icon={icon} />
    </Button.Icon>
  </Toolbar.Button>
);

const ToolbarContent: FunctionComponent = () => (
  <List.Root>
    <Showcase
      isStacked
      title="Symbols"
    >
      <Toolbar.Root>
        <Toolbar.Leading>
          {iconButton('Folders', sfFolder)}
          {iconButton('Flag', sfFlag)}
          {iconButton('Archive', sfArchivebox)}
        </Toolbar.Leading>
        <Toolbar.Trailing>
          {iconButton('Reply', sfArrowshapeTurnUpLeft)}
          {iconButton('Compose', sfSquareAndPencil)}
        </Toolbar.Trailing>
      </Toolbar.Root>
    </Showcase>
    <Showcase
      isStacked
      title="Text, Prominent"
    >
      <Toolbar.Root>
        <Toolbar.Leading>
          <Toolbar.Button disabled={false}>
            <Button.Label>Edit</Button.Label>
          </Toolbar.Button>
        </Toolbar.Leading>
        <Toolbar.Trailing>
          <Toolbar.Button
            prominent
            disabled={false}
          >
            <Button.Label>Done</Button.Label>
          </Toolbar.Button>
        </Toolbar.Trailing>
      </Toolbar.Root>
      <Toolbar.Root>
        <Toolbar.Leading>
          <Toolbar.Button
            destructive
            disabled={false}
          >
            <Button.Label>Delete</Button.Label>
          </Toolbar.Button>
        </Toolbar.Leading>
        <Toolbar.Trailing>
          <Toolbar.Button
            prominent
            disabled={false}
            tint="var(--color-ui-system-green)"
          >
            <Button.Label>Save</Button.Label>
          </Toolbar.Button>
        </Toolbar.Trailing>
      </Toolbar.Root>
    </Showcase>
    <Showcase
      isStacked
      title="Groups"
    >
      <Toolbar.Root>
        <Toolbar.Leading>
          <Toolbar.Group gap={20}>
            {iconButton('Share', sfSquareAndArrowUp)}
            {iconButton('More', sfEllipsis)}
          </Toolbar.Group>
        </Toolbar.Leading>
        <Toolbar.Trailing>
          <Toolbar.Group prominent>
            {iconButton('Compose', sfSquareAndPencil)}
          </Toolbar.Group>
        </Toolbar.Trailing>
      </Toolbar.Root>
      <Toolbar.Root>
        <Toolbar.Leading>
          <Toolbar.Group
            prominent
            textColor="#000"
            tint="var(--color-ui-system-yellow)"
          >
            {iconButton('Flag', sfFlag)}
            {iconButton('Archive', sfArchivebox)}
          </Toolbar.Group>
        </Toolbar.Leading>
        <Toolbar.Spacer />
        <Toolbar.Trailing>{iconButton('Delete', sfTrash)}</Toolbar.Trailing>
      </Toolbar.Root>
    </Showcase>
    <Showcase
      isStacked
      title="Titles"
    >
      <Toolbar.Root placement="block-start">
        <Toolbar.Leading>{iconButton('Mailboxes', sfTray)}</Toolbar.Leading>
        <Toolbar.Title>
          <span>Inbox</span>
          <Toolbar.Subtitle>12 unread</Toolbar.Subtitle>
        </Toolbar.Title>
        <Toolbar.Trailing>{iconButton('More', sfEllipsis)}</Toolbar.Trailing>
      </Toolbar.Root>
      <Toolbar.Root placement="block-start">
        <Toolbar.Title alignStart>
          <span>Aligned to the Start</span>
        </Toolbar.Title>
        <Toolbar.Trailing>{iconButton('More', sfEllipsis)}</Toolbar.Trailing>
      </Toolbar.Root>
    </Showcase>
    <Showcase
      isStacked
      title="Page Dots"
    >
      <Toolbar.Root>
        <Toolbar.Leading>{iconButton('Folders', sfFolder)}</Toolbar.Leading>
        <PageControl
          count={5}
          defaultValue={1}
        />
        <Toolbar.Trailing>
          {iconButton('Share', sfSquareAndArrowUp)}
        </Toolbar.Trailing>
      </Toolbar.Root>
    </Showcase>
    <List.Section>
      <List.Header>
        <List.Title>On a Picture (Adaptive)</List.Title>
      </List.Header>
      <div className="kitchen-sink-picture">
        <Toolbar.Root context="adaptive">
          <Toolbar.Leading>{iconButton('Photos', sfPhoto)}</Toolbar.Leading>
          <Toolbar.Trailing>
            {iconButton('Share', sfSquareAndArrowUp)}
          </Toolbar.Trailing>
        </Toolbar.Root>
      </div>
    </List.Section>
  </List.Root>
);

const tabs = [
  ['home', 'Home', sfHeartFill],
  ['mail', 'Mail', sfEnvelopeFill],
  ['people', 'People', sfPersonFill],
  ['photos', 'Photos', sfPhoto],
  ['settings', 'Settings', sfGearshapeFill],
] as const;

/** A tab bar (its list alone): its tabs, a search group, an accessory. */
const SampleTabBar: FunctionComponent<{
  accessory?: 'both' | 'collapsed' | 'expanded';
  count: number;
  hasSearch?: boolean;
  isCollapsible?: boolean;
  size?: 'compact' | 'regular';
}> = ({ accessory, count, hasSearch = false, isCollapsible = false, size }) => {
  const [value, setValue] = useState<unknown>('home');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const shown = tabs.slice(0, count);

  return (
    <div className="kitchen-sink-stacked">
      <TabBar.Root
        value={value}
        onValueChange={(next: unknown) => {
          setValue(next);
          if (next === 'search') setIsCollapsed(true);
        }}
      >
        <TabBar.List
          collapsed={isCollapsed}
          size={size}
        >
          <TabBar.Group
            visibleWhenCollapsed={value !== 'search'}
            onClickCapture={() => setIsCollapsed(false)}
          >
            <TabBar.Indicator />
            {shown.map(([tab, label, icon]) => (
              <TabBar.Tab
                key={tab}
                value={tab}
                visibleWhenCollapsed={value === tab}
              >
                <TabBar.Icon>
                  <Symbol icon={icon} />
                </TabBar.Icon>
                <TabBar.Label>{label}</TabBar.Label>
              </TabBar.Tab>
            ))}
          </TabBar.Group>
          {hasSearch ? (
            <TabBar.Group
              visibleWhenCollapsed={value === 'search'}
              onClickCapture={() => setIsCollapsed(false)}
            >
              <TabBar.Indicator />
              <TabBar.Tab
                aria-label="Search"
                value="search"
                visibleWhenCollapsed={value === 'search'}
              >
                <TabBar.Icon>
                  <Symbol icon={sfMagnifyingglass} />
                </TabBar.Icon>
              </TabBar.Tab>
            </TabBar.Group>
          ) : null}
        </TabBar.List>
        {accessory === undefined ? null : (
          <TabBar.Accessory visibleIn={accessory}>
            <span className="kitchen-sink-accessory-title">Not Playing</span>
            <Symbol icon={sfPlayFill} />
            <Symbol icon={sfForwardFill} />
          </TabBar.Accessory>
        )}
      </TabBar.Root>
      {isCollapsible ? (
        <Button.Root
          variant="bordered"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Button.Label>{isCollapsed ? 'Expand' : 'Collapse'}</Button.Label>
        </Button.Root>
      ) : null}
    </div>
  );
};

const TabBarContent: FunctionComponent = () => (
  <List.Root>
    <Rows>
      <DrillRow
        pageKey="tab-bar/app"
        title="In an App (Panels, Collapsing on Scroll)"
      />
    </Rows>
    <Showcase
      isStacked
      title="Tabs"
    >
      {[2, 3, 4, 5].map((count) => (
        <SampleTabBar
          key={count}
          count={count}
        />
      ))}
    </Showcase>
    <Showcase
      isStacked
      title="Collapsing"
    >
      <SampleTabBar
        isCollapsible
        count={4}
      />
    </Showcase>
    <Showcase
      isStacked
      title="Search (Collapsing the Bar)"
    >
      <SampleTabBar
        hasSearch
        count={4}
      />
    </Showcase>
    <Showcase
      isStacked
      title="Accessory"
    >
      <SampleTabBar
        hasSearch
        accessory="both"
        count={3}
      />
    </Showcase>
    <Showcase
      isStacked
      title="Regular (a Tablet's)"
    >
      <SampleTabBar
        count={4}
        size="regular"
      />
    </Showcase>
  </List.Root>
);

/**
 * A tab bar app (a page of its own, its own bars: see `isBare`): its
 * panels, each a page with a large title; its bar at the bottom,
 * collapsing as a page scrolls down.
 */
const TabBarApp: FunctionComponent = () => {
  const [value, setValue] = useState<unknown>('home');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Collapsing as the shown page scrolls down (not at its top), expanding
  // as it scrolls up (the provider's tracked scroller: the page shown).
  useViewportScroll(({ atTop, direction }) =>
    setIsCollapsed(!atTop && direction === 'down'),
  );

  return (
    <TabBar.Root
      value={value}
      onValueChange={(next: unknown) => {
        setValue(next);
        setIsCollapsed(false);
      }}
    >
      {/* Each panel the page (its scroller: filling the stack's frame),
          its header within it, as in the docs' tab bar app. */}
      {tabs.slice(0, 3).map(([tab, label]) => (
        <TabBar.Panel
          key={tab}
          keepMounted
          render={<Page.Root />}
          value={tab}
        >
          <Header.Root>
            <Viewport.BlockStart>
              <Toolbar.Root placement="block-start">
                <Toolbar.Leading>
                  <BackButton />
                </Toolbar.Leading>
                <Toolbar.Title>
                  <span>{label}</span>
                </Toolbar.Title>
              </Toolbar.Root>
            </Viewport.BlockStart>
            <Viewport.Padding edge="block-start" />
            <Header.LargeTitle>
              <span>{label}</span>
            </Header.LargeTitle>
          </Header.Root>
          <List.Root>
            <List.Section>
              <List.Group>
                {Array.from({ length: 30 }, (_, index) => (
                  <Row
                    key={index}
                    title={`${label} ${String(index + 1)}`}
                  />
                ))}
              </List.Group>
            </List.Section>
          </List.Root>
          <Viewport.Padding edge="block-end" />
        </TabBar.Panel>
      ))}
      <Viewport.BlockEnd keyboard="cover">
        <TabBar.List collapsed={isCollapsed}>
          {/* (Collapsed, its selected tab alone; pressed, expanded.) */}
          <TabBar.Group
            visibleWhenCollapsed
            onClickCapture={() => setIsCollapsed(false)}
          >
            <TabBar.Indicator />
            {tabs.slice(0, 3).map(([tab, label, icon]) => (
              <TabBar.Tab
                key={tab}
                value={tab}
                visibleWhenCollapsed={value === tab}
              >
                <TabBar.Icon>
                  <Symbol icon={icon} />
                </TabBar.Icon>
                <TabBar.Label>{label}</TabBar.Label>
              </TabBar.Tab>
            ))}
          </TabBar.Group>
        </TabBar.List>
      </Viewport.BlockEnd>
    </TabBar.Root>
  );
};

const PageControlContent: FunctionComponent = () => {
  const [page, setPage] = useState(2);

  return (
    <List.Root>
      <Showcase
        isStacked
        title="Glass"
      >
        {[3, 5, 8].map((count) => (
          <PageControl
            key={count}
            count={count}
            defaultValue={0}
          />
        ))}
      </Showcase>
      <Showcase
        isStacked
        title="Plain"
      >
        <PageControl
          count={5}
          defaultValue={2}
          variant="plain"
        />
      </Showcase>
      <Showcase
        isStacked
        title={`Its Page, as Text (Tooltip): Page ${String(page + 1)}`}
      >
        <PageControl
          momentaryTooltip
          count={8}
          value={page}
          format={(current: number, count: number) =>
            `Photo ${String(current)} of ${String(count)}`
          }
          onValueChange={(next: number) => setPage(next)}
        />
      </Showcase>
      <Showcase
        isStacked
        title="Disabled"
      >
        <PageControl
          disabled
          count={4}
          defaultValue={1}
        />
      </Showcase>
    </List.Root>
  );
};

const CollapsibleContent: FunctionComponent = () => (
  <List.Root>
    {(
      [
        ['Library', true],
        ['Folders', false],
      ] as const
    ).map(([title, isOpen]) => (
      <Collapsible.Root
        key={title}
        defaultOpen={isOpen}
        render={<List.Section />}
      >
        <Collapsible.Trigger
          nativeButton={false}
          render={<List.Header prominence="nested" />}
        >
          <List.Title>{title}</List.Title>
          <List.Disclosure />
        </Collapsible.Trigger>
        <Collapsible.Panel render={<List.Group />}>
          {['Inbox', 'Favorites', 'Recents'].map((name) => (
            <Row
              key={name}
              title={name}
            />
          ))}
        </Collapsible.Panel>
      </Collapsible.Root>
    ))}
    <Collapsible.Root
      disabled
      render={<List.Section />}
    >
      <Collapsible.Trigger
        nativeButton={false}
        render={<List.Header prominence="nested" />}
      >
        <List.Title>Disabled</List.Title>
        <List.Disclosure />
      </Collapsible.Trigger>
      <Collapsible.Panel render={<List.Group />}>
        <Row title="Never shown" />
      </Collapsible.Panel>
    </Collapsible.Root>
  </List.Root>
);

const accounts = [
  ['icloud', 'iCloud', ['Mail', 'Contacts', 'Calendars']],
  ['work', 'Work', ['Mail', 'Notes']],
  ['home', 'Home', ['Reminders', 'Photos']],
] as const;

/** Sections opening one at a time (or several, `multiple`). */
const AccordionList: FunctionComponent<{ isMultiple?: boolean }> = ({
  isMultiple = false,
}) => (
  <Accordion.Root
    defaultValue={['icloud']}
    multiple={isMultiple}
    render={<List.Root />}
  >
    {accounts.map(([value, title, items]) => (
      <Accordion.Item
        key={value}
        render={<List.Section />}
        value={value}
      >
        <Accordion.Trigger
          nativeButton={false}
          render={<List.Header />}
        >
          <List.Title>{title}</List.Title>
          <List.Disclosure />
        </Accordion.Trigger>
        <Accordion.Panel render={<List.Group />}>
          {items.map((name) => (
            <Row
              key={name}
              title={name}
            />
          ))}
        </Accordion.Panel>
      </Accordion.Item>
    ))}
  </Accordion.Root>
);

const AccordionContent: FunctionComponent = () => (
  <>
    <List.Root>
      <List.Section>
        <List.Header>
          <List.Title>One Open at a Time</List.Title>
        </List.Header>
      </List.Section>
    </List.Root>
    <AccordionList />
    <List.Root>
      <List.Section>
        <List.Header>
          <List.Title>Several Open</List.Title>
        </List.Header>
      </List.Section>
    </List.Root>
    <AccordionList isMultiple />
  </>
);

const contacts = [
  'Aaron',
  'Abigail',
  'Bella',
  'Chloe',
  'Daniel',
  'Ella',
  'Felix',
  'Grace',
];

/** A drawer's contacts (its page's, or a sidebar's rows). */
const contactRows = contacts.map((name) => (
  <Row
    key={name}
    title={name}
  />
));

/**
 * A drawer opened by a button: its own bar (Done) and page; floating, no
 * background of its own, a floating sidebar in it instead.
 */
const SampleDrawer: FunctionComponent<{
  floating?: boolean;
  label: string;
  side?: DrawerSide;
}> = ({ floating = false, label, side }) => (
  <Drawer.Root side={side}>
    <Drawer.Trigger render={<Button.Root variant="bordered" />}>
      <Button.Label>{label}</Button.Label>
    </Drawer.Trigger>
    <Drawer.Popup floating={floating}>
      {floating ? (
        <Sidebar.Root>
          <Sidebar.Toolbar>
            <span />
            <Drawer.Close
              render={
                <Button.Root
                  tint="var(--uikit-glass-content)"
                  variant="borderless"
                />
              }
            >
              <Button.Label>Done</Button.Label>
            </Drawer.Close>
          </Sidebar.Toolbar>
          <List.Root listStyle="sidebar">
            <List.Section>
              <List.Header prominence="nested">
                <List.Title>Contacts</List.Title>
              </List.Header>
              <List.Group>{contactRows}</List.Group>
            </List.Section>
          </List.Root>
        </Sidebar.Root>
      ) : (
        <Header.Root>
          <Viewport.BlockStart>
            <Toolbar.Root placement="block-start">
              <Toolbar.Leading />
              <Toolbar.Title>
                <span>Contacts</span>
              </Toolbar.Title>
              <Toolbar.Trailing>
                <Drawer.Close render={<Toolbar.Button />}>
                  <Button.Label>Done</Button.Label>
                </Drawer.Close>
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root>
            <Viewport.Padding edge="block-start" />
            <List.Root>
              <List.Section>
                <List.Group>{contactRows}</List.Group>
              </List.Section>
            </List.Root>
            <Viewport.Padding edge="block-end" />
          </Page.Root>
        </Header.Root>
      )}
    </Drawer.Popup>
  </Drawer.Root>
);

const DrawerContent: FunctionComponent = () => (
  <List.Root>
    <Showcase title="Sides">
      <SampleDrawer label="Start" />
      <SampleDrawer
        label="End"
        side="inline-end"
      />
    </Showcase>
    <Showcase title="Floating (a Floating Sidebar, No Background of Its Own)">
      <SampleDrawer
        floating
        label="Floating, Start"
      />
      <SampleDrawer
        floating
        label="Floating, End"
        side="inline-end"
      />
    </Showcase>
  </List.Root>
);

/** A box (as high as a tablet's screen, at most) holding a layout. */
const LayoutBox: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => <div className="kitchen-sink-layout-box">{children}</div>;

/**
 * A column's page: its title, a few rows (on the layout's background,
 * `transparent`, showing through). Scrolling on its own, but not a
 * `Page.Root`: a page within the kitchen sink's page, not one the
 * viewport tracks (its edge effects the kitchen sink page's).
 */
const ColumnPage: FunctionComponent<{
  rows?: number;
  title: string;
  transparent?: boolean;
}> = ({ rows = 6, title, transparent = false }) => (
  <div
    className={
      transparent
        ? 'kitchen-sink-column-page kitchen-sink-transparent'
        : 'kitchen-sink-column-page'
    }
  >
    <List.Root>
      <List.Section>
        <List.Header>
          <List.Title>{title}</List.Title>
        </List.Header>
        <List.Group>
          {Array.from({ length: rows }, (_, index) => (
            <Row
              key={index}
              title={`${title} ${String(index + 1)}`}
            />
          ))}
        </List.Group>
      </List.Section>
    </List.Root>
  </div>
);

const LayoutContent: FunctionComponent = () => (
  <List.Root>
    <List.Section>
      <List.Header>
        <List.Title>Three Columns (Resizable)</List.Title>
      </List.Header>
      <LayoutBox>
        <Layout.Root>
          <Layout.Column
            resizable
            aria-label="Folders"
            defaultSize={200}
            maxSize={280}
            minSize={160}
          >
            <ColumnPage title="Folder" />
          </Layout.Column>
          <Layout.Column
            resizable
            aria-label="Notes"
            defaultSize={240}
            maxSize={320}
            minSize={180}
          >
            <ColumnPage title="Note" />
          </Layout.Column>
          <Layout.Column aria-label="Note">
            <ColumnPage
              rows={3}
              title="Line"
            />
          </Layout.Column>
        </Layout.Root>
      </LayoutBox>
    </List.Section>
    <List.Section>
      <List.Header>
        <List.Title>A Floating Column, on a Background</List.Title>
      </List.Header>
      <LayoutBox>
        <Layout.Root>
          <Layout.Background>
            <div
              aria-hidden="true"
              className="kitchen-sink-picture kitchen-sink-fill"
            />
          </Layout.Background>
          <Layout.Column
            floating
            aria-label="Sidebar"
            defaultSize={260}
          >
            <Sidebar.Root>
              <List.Root listStyle="sidebar">
                <List.Section>
                  <List.Group>
                    {['Inbox', 'Drafts', 'Sent'].map((name, index) => (
                      <List.Item
                        key={name}
                        selected={index === 0}
                      >
                        <List.Content>
                          <List.Title render={<button type="button" />}>
                            {index === 0 ? `${name} (selected)` : name}
                          </List.Title>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List.Group>
                </List.Section>
              </List.Root>
            </Sidebar.Root>
          </Layout.Column>
          <Layout.Column clearFloating>
            <ColumnPage
              transparent
              title="Message"
            />
          </Layout.Column>
        </Layout.Root>
      </LayoutBox>
    </List.Section>
  </List.Root>
);

const SidebarContent: FunctionComponent = () => (
  <List.Root>
    <Rows>
      <Row
        subtitle="This app’s own, on a wide screen"
        title="The Components’ Sidebar"
      />
    </Rows>
    <List.Section>
      <List.Header>
        <List.Title>Toolbar, Search, Sections, Nesting</List.Title>
      </List.Header>
      <LayoutBox>
        <Layout.Root>
          <Layout.Column
            floating
            resizable
            aria-label="Sidebar"
            defaultSize={300}
            maxSize={400}
            minSize={260}
          >
            <Sidebar.Root>
              <Sidebar.Toolbar>
                <Button.Root
                  disabled={false}
                  tint="var(--uikit-glass-content)"
                  variant="borderless"
                >
                  <Button.Label>Edit</Button.Label>
                </Button.Root>
                <Sidebar.ToolbarGroup>
                  <Button.Root
                    aria-label="Compose"
                    disabled={false}
                    shape="circle"
                    tint="var(--uikit-glass-content)"
                    variant="borderless"
                  >
                    <Button.Icon>
                      <Symbol icon={sfSquareAndPencil} />
                    </Button.Icon>
                  </Button.Root>
                </Sidebar.ToolbarGroup>
              </Sidebar.Toolbar>
              <TextField.Root>
                <TextField.Frame>
                  <Symbol icon={sfMagnifyingglass} />
                  <TextField.Control
                    aria-label="Search"
                    placeholder="Search"
                    type="search"
                  />
                  <TextField.Clear />
                </TextField.Frame>
              </TextField.Root>
              <List.Root listStyle="sidebar">
                <Collapsible.Root
                  defaultOpen
                  render={<List.Section />}
                >
                  <Collapsible.Trigger
                    nativeButton={false}
                    render={<List.Header prominence="nested" />}
                  >
                    <List.Title>Library</List.Title>
                    <List.Disclosure />
                  </Collapsible.Trigger>
                  <Collapsible.Panel render={<List.Group />}>
                    {['Inbox', 'Favorites'].map((name, index) => (
                      <List.Item
                        key={name}
                        selected={index === 0}
                      >
                        <List.Leading>
                          <List.Image variant="symbol">
                            <Symbol icon={sfTray} />
                          </List.Image>
                        </List.Leading>
                        <List.Content>
                          <List.Title render={<button type="button" />}>
                            {index === 0 ? `${name} (selected)` : name}
                          </List.Title>
                        </List.Content>
                        <List.Trailing>
                          <List.Detail>{index === 0 ? 12 : 3}</List.Detail>
                        </List.Trailing>
                      </List.Item>
                    ))}
                  </Collapsible.Panel>
                </Collapsible.Root>
                <Collapsible.Root
                  defaultOpen
                  render={<List.Section />}
                >
                  <Collapsible.Trigger
                    nativeButton={false}
                    render={<List.Header prominence="nested" />}
                  >
                    <List.Title>Folders</List.Title>
                    <List.Disclosure />
                  </Collapsible.Trigger>
                  <Collapsible.Panel render={<List.Group />}>
                    <List.CollapsibleRoot defaultOpen>
                      <List.Item>
                        <List.Leading>
                          <List.Image variant="symbol">
                            <Symbol icon={sfFolder} />
                          </List.Image>
                        </List.Leading>
                        <List.Content>
                          <List.Title render={<button type="button" />}>
                            Projects
                          </List.Title>
                        </List.Content>
                        <List.Trailing>
                          <List.CollapsibleTrigger
                            aria-label="Projects: nested"
                            render={
                              <List.Accessory
                                render={<button type="button" />}
                              />
                            }
                          >
                            <List.Disclosure />
                          </List.CollapsibleTrigger>
                        </List.Trailing>
                      </List.Item>
                      <List.CollapsiblePanel>
                        {['Design', 'Research'].map((name) => (
                          <List.Item
                            key={name}
                            level={1}
                          >
                            <List.Leading>
                              <List.Image variant="symbol">
                                <Symbol icon={sfFolder} />
                              </List.Image>
                            </List.Leading>
                            <List.Content>
                              <List.Title render={<button type="button" />}>
                                {name}
                              </List.Title>
                            </List.Content>
                          </List.Item>
                        ))}
                      </List.CollapsiblePanel>
                    </List.CollapsibleRoot>
                  </Collapsible.Panel>
                </Collapsible.Root>
              </List.Root>
            </Sidebar.Root>
          </Layout.Column>
          <Layout.Column clearFloating>
            <ColumnPage title="Message" />
          </Layout.Column>
        </Layout.Root>
      </LayoutBox>
    </List.Section>
  </List.Root>
);

/** A level of the navigation's stack, pushing the next (up to five). */
const level = (depth: number): SinkPage => ({
  Content: () => {
    const push = usePush();

    return (
      <List.Root>
        <Rows>
          {depth < 5 ? (
            <List.Item>
              <List.Content>
                <List.Title
                  render={<button type="button" />}
                  onClick={() => push(`navigation/${String(depth + 1)}`)}
                >
                  Level {depth + 1}
                </List.Title>
              </List.Content>
              <List.Trailing>
                <List.DrillIn />
              </List.Trailing>
            </List.Item>
          ) : (
            <Row title="The deepest level" />
          )}
        </Rows>
        <Rows title="Going Back">
          <Row
            subtitle="Its bar’s button, or a swipe from the screen’s edge"
            title="Back"
          />
        </Rows>
      </List.Root>
    );
  },
  title: `Level ${String(depth)}`,
});

const NavigationContent: FunctionComponent = () => (
  <List.Root>
    <Rows title="A Stack, Five Levels Deep">
      <DrillRow
        pageKey="navigation/1"
        title="Level 1"
      />
    </Rows>
    <Rows title="This App">
      <Row
        subtitle="Each component a page, drilled into; on a wide screen, beside the sidebar"
        title="The Components’ Stack"
      />
    </Rows>
  </List.Root>
);

const PageContent: FunctionComponent = () => (
  <List.Root>
    <Rows title="Backgrounds">
      <DrillRow
        pageKey="page/grouped"
        title="Grouped (an Inset Grouped List)"
      />
      <DrillRow
        pageKey="page/plain"
        title="Plain (a Plain List)"
      />
    </Rows>
  </List.Root>
);

/** A page's rows, in a list of a style (by its background). */
const backgroundPage = (
  background: 'grouped' | 'plain',
  title: string,
): SinkPage => ({
  background,
  Content: () => (
    <List.Root listStyle={background === 'plain' ? 'plain' : undefined}>
      <List.Section>
        <List.Group>
          {Array.from({ length: 24 }, (_, index) => (
            <Row
              key={index}
              title={`Row ${String(index + 1)}`}
            />
          ))}
        </List.Group>
      </List.Section>
    </List.Root>
  ),
  title,
});

/** Its search below its large title, sticking below its bar. */
const HeaderContent: FunctionComponent = () => (
  <>
    <Header.Accessory>
      <TextField.Root>
        <TextField.Frame>
          <Symbol icon={sfMagnifyingglass} />
          <TextField.Control
            aria-label="Search"
            enterKeyHint="search"
            placeholder="Search"
            type="search"
          />
          <TextField.Clear />
        </TextField.Frame>
      </TextField.Root>
    </Header.Accessory>
    <List.Root>
      <Rows title="Scroll Up">
        <Row
          subtitle="Fading out under the bar, its title shown in the bar"
          title="The large title"
        />
        <Row
          subtitle="Sticking below the bar, the bar’s blur reaching under it"
          title="The search field"
        />
        {Array.from({ length: 24 }, (_, index) => (
          <Row
            key={index}
            title={`Row ${String(index + 1)}`}
          />
        ))}
      </Rows>
    </List.Root>
  </>
);

export const structurePages: SinkPages = {
  accordion: { Content: AccordionContent, title: 'Accordion' },
  collapsible: { Content: CollapsibleContent, title: 'Collapsible' },
  drawer: { Content: DrawerContent, title: 'Drawer' },
  header: { Content: HeaderContent, title: 'Header' },
  layout: { Content: LayoutContent, title: 'Layout' },
  navigation: { Content: NavigationContent, title: 'Navigation' },
  ...Object.fromEntries(
    [1, 2, 3, 4, 5].map((depth) => [
      `navigation/${String(depth)}`,
      level(depth),
    ]),
  ),
  page: { Content: PageContent, title: 'Page' },
  'page-control': { Content: PageControlContent, title: 'Page Control' },
  'page/grouped': backgroundPage('grouped', 'Grouped'),
  'page/plain': backgroundPage('plain', 'Plain'),
  sidebar: { Content: SidebarContent, title: 'Sidebar' },
  'tab-bar': { Content: TabBarContent, title: 'Tab Bar' },
  'tab-bar/app': { Content: TabBarApp, isBare: true, title: 'In an App' },
  toolbar: { Content: ToolbarContent, title: 'Toolbar' },
};
