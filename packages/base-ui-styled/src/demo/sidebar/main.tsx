import { Collapsible } from '@base-ui/react/collapsible';
import { sfCalendar } from '@bradleyhodges/sfsymbols/sfCalendar';
import { sfClock } from '@bradleyhodges/sfsymbols/sfClock';
import { sfDocument } from '@bradleyhodges/sfsymbols/sfDocument';
import { sfEye } from '@bradleyhodges/sfsymbols/sfEye';
import { sfFolder } from '@bradleyhodges/sfsymbols/sfFolder';
import { sfFolderBadgePlus } from '@bradleyhodges/sfsymbols/sfFolderBadgePlus';
import { sfHeart } from '@bradleyhodges/sfsymbols/sfHeart';
import { sfICircle } from '@bradleyhodges/sfsymbols/sfICircle';
import { sfListBullet } from '@bradleyhodges/sfsymbols/sfListBullet';
import { sfMagnifyingglass } from '@bradleyhodges/sfsymbols/sfMagnifyingglass';
import { sfPerson2 } from '@bradleyhodges/sfsymbols/sfPerson2';
import { sfPhoto } from '@bradleyhodges/sfsymbols/sfPhoto';
import { sfSquareAndPencil } from '@bradleyhodges/sfsymbols/sfSquareAndPencil';
import { sfTextformat } from '@bradleyhodges/sfsymbols/sfTextformat';
import { sfTrash } from '@bradleyhodges/sfsymbols/sfTrash';
import { sfTray } from '@bradleyhodges/sfsymbols/sfTray';
import {
  CSSProperties,
  FunctionComponent,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';

import {
  Button,
  Header,
  Layout,
  List,
  Page,
  Sidebar,
  Switch,
  TextField,
  Toolbar,
} from '../../components/index.js';
import { colorSchemeAttribute } from '../../components/utils.js';
import { forwardClick } from '../list/props.js';
import { screenHeight } from '../page/main.js';
import { useLog } from '../utils/log.js';
import { Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { SFSymbol } from '../utils/symbol.js';
import {
  getPropOptionsSidebarColumn,
  propOptionsContent,
  propOptionsContentColumn,
  propOptionsDrawer,
  propOptionsRoot,
  propOptionsSidebar,
} from './props.js';

type Symbol = Parameters<typeof SFSymbol>[0]['icon'];
type Row = { detail?: string; level?: number; symbol: Symbol; title: string };

const library: Row[] = [
  { detail: '12', symbol: sfTray, title: 'Inbox' },
  { detail: '3', symbol: sfHeart, title: 'Favorites' },
  { symbol: sfClock, title: 'Recents' },
];

const folders: Row[] = [
  { detail: '8', symbol: sfFolder, title: 'Projects' },
  { level: 1, symbol: sfFolder, title: 'Design' },
  { detail: '2', level: 2, symbol: sfDocument, title: 'Drafts' },
  { level: 1, symbol: sfPhoto, title: 'Photos' },
  { symbol: sfTrash, title: 'Trash' },
];

const items = Array.from({ length: 12 }, (_, index) => `Item ${index + 1}`);

// The layout's background: a picture (here, of gradients).
const picture = (
  <div
    aria-hidden="true"
    style={{
      background: [
        'radial-gradient(circle at 20% 30%, #ff9f0a, transparent 40%)',
        'radial-gradient(circle at 75% 20%, #bf5af2, transparent 45%)',
        'radial-gradient(circle at 60% 85%, #30d158, transparent 45%)',
        'linear-gradient(135deg, #0a84ff, #5e5ce6)',
      ].join(', '),
    }}
  />
);

// Whether the page is dark (forced by `colorSchemeAttribute`, or
// preferred), as it changes.
const darkQuery = '(prefers-color-scheme: dark)';
const subscribeScheme = (onChange: () => void) => {
  const media = globalThis.matchMedia(darkQuery);
  media.addEventListener('change', onChange);
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributeFilter: [colorSchemeAttribute],
  });
  return () => {
    media.removeEventListener('change', onChange);
    observer.disconnect();
  };
};
const isDark = () => {
  const forced = document.documentElement.getAttribute(colorSchemeAttribute);
  return forced ? forced === 'dark' : globalThis.matchMedia(darkQuery).matches;
};
const useDark = () => useSyncExternalStore(subscribeScheme, isDark);

const pageBackgrounds = {
  grouped: undefined,
  plain: undefined,
  transparent: { backgroundColor: 'transparent' },
} satisfies Record<string, CSSProperties | undefined>;

/**
 * A sidebar (Figma “Sidebars”, iPadOS 26): a floating glass panel (a
 * `Sidebar`, its list of style `sidebar`) in a `Layout`'s first column.
 * Regular (an iPad), the layout's `floating` column over the others, the
 * content's column clear of it (`clearFloating`: its page's content inset,
 * its background running underneath); compact (an iPhone), a drawer,
 * swiped in from its edge (the layout's).
 */
const SidebarPreset: FunctionComponent<{
  compact: boolean;
  id: string;
  title: string;
}> = ({ compact, id, title }) => {
  const [log, addLog] = useLog();

  const [
    externalContent,
    externalRoot,
    externalColumn,
    externalDrawer,
    externalSidebar,
    externalContentColumn,
  ] = useProvidedState(id);
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    '[content]',
    externalContent,
    true,
  );
  const [controlRoot, propsRoot, stateRoot, RemounterRoot] = usePropControl(
    propOptionsRoot,
    'root',
    externalRoot,
  );
  const [controlColumn, propsColumn, stateColumn, RemounterColumn] =
    usePropControl(
      useMemo(() => getPropOptionsSidebarColumn(addLog), [addLog]),
      'column (sidebar)',
      externalColumn,
    );
  const [controlDrawer, propsDrawer, stateDrawer, RemounterDrawer] =
    usePropControl(
      propOptionsDrawer,
      'column (sidebar): drawer',
      externalDrawer,
    );
  const [controlSidebar, propsSidebar, stateSidebar, RemounterSidebar] =
    usePropControl(propOptionsSidebar, 'sidebar', externalSidebar);
  const [
    controlContentColumn,
    propsContentColumn,
    stateContentColumn,
    RemounterContentColumn,
  ] = usePropControl(
    propOptionsContentColumn,
    'column (content)',
    externalContentColumn,
  );

  const dark = useDark();
  const backgroundContext = dark ? 'background-dim' : 'background-bright';
  const [selected, setSelected] = useState('Inbox');
  const [showHidden, setShowHidden] = useState(false);
  const [sortBy, setSortBy] = useState<'Date' | 'Name'>('Name');
  // Rows with nested ones (by level), collapsed (by their disclosure).
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(new Set());
  // Compact: the drawer (controlled, opened by the button).
  const [open, setOpen] = useState<boolean | undefined>(undefined);

  const row = (
    { detail, level, symbol, title: rowTitle }: Row,
    nested: boolean,
  ) => (
    <List.Item
      key={rowTitle}
      level={level}
      selected={selected === rowTitle}
    >
      {content.editing ? <List.Checkbox aria-label={rowTitle} /> : null}
      <List.Image variant="symbol">
        <SFSymbol icon={symbol} />
      </List.Image>
      <List.Title
        render={<button type="button" />}
        onClick={() => {
          addLog(`select: ${rowTitle}`);
          setSelected(rowTitle);
          // (Compact: the drawer closes.)
          if (compact) setOpen(false);
        }}
      >
        {rowTitle}
      </List.Title>
      {detail === undefined ? null : <List.Detail>{detail}</List.Detail>}
      {/* (Its nested rows: shown, or collapsed.) */}
      {nested ? (
        <List.Accessory
          aria-expanded={!collapsed.has(rowTitle)}
          aria-label={`${rowTitle}: nested`}
          render={<button type="button" />}
          onClick={() => {
            const next = new Set(collapsed);
            if (!next.delete(rowTitle)) next.add(rowTitle);
            addLog(
              `${rowTitle} ${next.has(rowTitle) ? 'collapsed' : 'expanded'}`,
            );
            setCollapsed(next);
          }}
        >
          <List.Disclosure
            data-panel-open={collapsed.has(rowTitle) ? undefined : ''}
          />
        </List.Accessory>
      ) : null}
    </List.Item>
  );

  // Rows shown (not under a collapsed one), whether each has nested ones.
  const shownRows = (rows: Row[]) => {
    const shown: [Row, boolean][] = [];
    let hiddenBelow = Infinity;
    for (const [index, each] of rows.entries()) {
      const level = each.level ?? 0;
      if (level > hiddenBelow) continue;
      hiddenBelow = Infinity;
      const nested = (rows[index + 1]?.level ?? 0) > level;
      shown.push([each, nested]);
      if (nested && collapsed.has(each.title)) hiddenBelow = level;
    }
    return shown;
  };

  // Rows with trailing controls: a switch, a checkmark (choosing), an info
  // button.
  const options = (
    <Collapsible.Root
      defaultOpen
      render={<List.Section />}
    >
      <Collapsible.Trigger
        nativeButton={false}
        render={<List.Header prominence="nested" />}
      >
        <List.Title>Options</List.Title>
        <List.Disclosure />
      </Collapsible.Trigger>
      <Collapsible.Panel render={<List.Group />}>
        <List.Item onClick={forwardClick('[role=switch]')}>
          {content.editing ? <List.Checkbox aria-label="Show Hidden" /> : null}
          <List.Image variant="symbol">
            <SFSymbol icon={sfEye} />
          </List.Image>
          <List.Title>Show Hidden</List.Title>
          <Switch.Root
            aria-label="Show Hidden"
            checked={showHidden}
            onCheckedChange={(next) => {
              addLog(`show hidden: ${String(next)}`);
              setShowHidden(next);
            }}
          >
            <Switch.Thumb />
          </Switch.Root>
        </List.Item>
        {(['Name', 'Date'] as const).map((key) => (
          <List.Item key={key}>
            {content.editing ? (
              <List.Checkbox aria-label={`Sort by ${key}`} />
            ) : null}
            <List.Image variant="symbol">
              <SFSymbol icon={key === 'Name' ? sfTextformat : sfCalendar} />
            </List.Image>
            <List.Title
              render={<button type="button" />}
              onClick={() => {
                addLog(`sort by: ${key}`);
                setSortBy(key);
              }}
            >
              Sort by {key}
            </List.Title>
            {sortBy === key ? <List.Checkmark /> : null}
          </List.Item>
        ))}
        <List.Item>
          {content.editing ? <List.Checkbox aria-label="Shared" /> : null}
          <List.Image variant="symbol">
            <SFSymbol icon={sfPerson2} />
          </List.Image>
          <List.Title
            render={<button type="button" />}
            onClick={() => addLog('select: Shared')}
          >
            Shared
          </List.Title>
          <List.Accessory
            aria-label="Info"
            render={<button type="button" />}
            onClick={() => addLog('shared info')}
          >
            <SFSymbol icon={sfICircle} />
          </List.Accessory>
        </List.Item>
      </Collapsible.Panel>
    </Collapsible.Root>
  );

  const section = (sectionTitle: string, rows: Row[]) => (
    <Collapsible.Root
      defaultOpen
      render={<List.Section />}
    >
      <Collapsible.Trigger
        nativeButton={false}
        render={<List.Header prominence="nested" />}
      >
        <List.Title>{sectionTitle}</List.Title>
        <List.Disclosure />
      </Collapsible.Trigger>
      <Collapsible.Panel render={<List.Group />}>
        {shownRows(rows).map(([each, nested]) => row(each, nested))}
      </Collapsible.Panel>
    </Collapsible.Root>
  );

  // The content's bar over the layout's picture (its page transparent).
  const overPicture =
    content.background === 'picture' &&
    content.pageBackground === 'transparent';

  return (
    <Component
      stretch
      id={id}
      log={log}
      title={title}
      controls={[
        controlContent,
        controlRoot,
        controlColumn,
        ...(compact ? [controlDrawer] : []),
        controlSidebar,
        controlContentColumn,
      ]}
      stateUrl={useCreateStateUrl(id, [
        stateContent,
        stateRoot,
        stateColumn,
        stateDrawer,
        stateSidebar,
        stateContentColumn,
      ])}
    >
      <RemounterRoot>
        <Layout.Root
          {...propsRoot}
          compact={compact}
          style={{
            height: screenHeight,
            ...(propsRoot.style as CSSProperties | undefined),
          }}
        >
          {content.background === 'picture' ? (
            <Layout.Background>{picture}</Layout.Background>
          ) : null}
          <RemounterColumn>
            <RemounterDrawer>
              <Layout.Column
                aria-label="Sidebar"
                {...propsColumn}
                {...(compact
                  ? {
                      ...propsDrawer,
                      open,
                      onOpenChange: (next: boolean) => {
                        addLog(`sidebar open: ${String(next)}`);
                        setOpen(next);
                      },
                    }
                  : {})}
              >
                <RemounterSidebar>
                  <Sidebar.Root {...propsSidebar}>
                    <Sidebar.Toolbar>
                      <Button.Root
                        tint="var(--styled-glass-content)"
                        variant="borderless"
                        onClick={() => addLog('edit')}
                      >
                        <Button.Label>Edit</Button.Label>
                      </Button.Root>
                      <Sidebar.ToolbarGroup>
                        <Button.Root
                          aria-label="New Folder"
                          shape="circle"
                          tint="var(--styled-glass-content)"
                          variant="borderless"
                          onClick={() => addLog('new folder')}
                        >
                          <Button.Symbol>
                            <SFSymbol icon={sfFolderBadgePlus} />
                          </Button.Symbol>
                        </Button.Root>
                        <Button.Root
                          aria-label="Compose"
                          shape="circle"
                          tint="var(--styled-glass-content)"
                          variant="borderless"
                          onClick={() => addLog('compose')}
                        >
                          <Button.Symbol>
                            <SFSymbol icon={sfSquareAndPencil} />
                          </Button.Symbol>
                        </Button.Root>
                      </Sidebar.ToolbarGroup>
                    </Sidebar.Toolbar>
                    <TextField.Root>
                      <TextField.Search>
                        <SFSymbol icon={sfMagnifyingglass} />
                        <TextField.Control
                          aria-label="Search"
                          placeholder="Search"
                          type="search"
                        />
                        <TextField.Clear />
                      </TextField.Search>
                    </TextField.Root>
                    <List.Root listStyle="sidebar">
                      {section('Library', library)}
                      {section('Folders', folders)}
                      {options}
                    </List.Root>
                  </Sidebar.Root>
                </RemounterSidebar>
              </Layout.Column>
            </RemounterDrawer>
          </RemounterColumn>
          <RemounterContentColumn>
            <Layout.Column {...propsContentColumn}>
              <Page.Root
                style={pageBackgrounds[content.pageBackground]}
                background={
                  content.pageBackground === 'grouped' ? 'grouped' : 'plain'
                }
              >
                <Header.Root>
                  {/* Over the layout's picture: glass floating over it. */}
                  <Header.Bar
                    context={overPicture ? backgroundContext : undefined}
                  >
                    {compact ? (
                      <Toolbar.Leading>
                        <Toolbar.Button
                          aria-label="Show Sidebar"
                          shape="circle"
                          onClick={() => {
                            addLog('show sidebar');
                            setOpen(true);
                          }}
                        >
                          <Button.Symbol>
                            <SFSymbol icon={sfListBullet} />
                          </Button.Symbol>
                        </Toolbar.Button>
                      </Toolbar.Leading>
                    ) : null}
                    <Toolbar.Title>
                      <span>{selected}</span>
                    </Toolbar.Title>
                    {/* (Balancing it: the title centered.) */}
                    {compact ? <Toolbar.Trailing /> : null}
                  </Header.Bar>
                  <Header.LargeTitle>
                    <span>{selected}</span>
                  </Header.LargeTitle>
                </Header.Root>
                <List.Root
                  style={
                    content.pageBackground === 'transparent'
                      ? ({
                          '--styled-list-background': 'transparent',
                        } as CSSProperties)
                      : undefined
                  }
                >
                  <List.Section>
                    <List.Group>
                      {items.map((item) => (
                        <List.Item key={item}>
                          <List.Title>{item}</List.Title>
                          <List.Detail>{selected}</List.Detail>
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                </List.Root>
              </Page.Root>
            </Layout.Column>
          </RemounterContentColumn>
        </Layout.Root>
      </RemounterRoot>
    </Component>
  );
};

/** The sidebar, regular (e.g. an iPad): floating over the content. */
export const SidebarDemo: FunctionComponent = () => (
  <SidebarPreset
    compact={false}
    id="sidebar"
    title="Sidebar"
  />
);

/** The sidebar, compact (e.g. an iPhone): a drawer, swiped in. */
export const SidebarCompactDemo: FunctionComponent = () => (
  <SidebarPreset
    compact
    id="sidebar-compact"
    title="Sidebar (compact)"
  />
);
