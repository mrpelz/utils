import { sfFolderFill } from '@bradleyhodges/sfsymbols/sfFolderFill';
import { sfListBullet } from '@bradleyhodges/sfsymbols/sfListBullet';
import {
  CSSProperties,
  FunctionComponent,
  ReactNode,
  useMemo,
  useState,
} from 'react';

import {
  Button,
  Header,
  Layout,
  List,
  Page,
  Toolbar,
} from '../../components/index.js';
import { screenHeight } from '../page/main.js';
import { useLog } from '../utils/log.js';
import { Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { SFSymbol } from '../utils/symbol.js';
import {
  getPropOptionsColumn,
  propOptionsContent,
  propOptionsContentCompact,
  propOptionsDrawer,
  propOptionsRoot,
} from './props.js';

const folders = ['Inbox', 'Drafts', 'Sent', 'Archive'];

const messages = Array.from(
  { length: 20 },
  (_, index) => `Message ${index + 1}`,
);

// A column's page's header: its title in the bar (and e.g. a button
// before it).
const header = (title: string, leading?: ReactNode) => (
  <Header.Root>
    <Header.Bar>
      {leading === undefined ? null : (
        <Toolbar.Leading>{leading}</Toolbar.Leading>
      )}
      <Toolbar.Title>
        <span>{title}</span>
      </Toolbar.Title>
      {/* (Balancing it: the title centered.) */}
      {leading === undefined ? null : <Toolbar.Trailing />}
    </Header.Bar>
  </Header.Root>
);

/**
 * A layout (UIKit `UISplitViewController`): columns side by side (a
 * sidebar, a list, a detail), each a page of its own; the sidebar and the
 * list resizable by their dividers (or arrow keys on them). Compact (e.g.
 * an iPhone), the sidebar is a drawer: swiped in from its edge (or by the
 * button in the next column's bar), swiped back (or the dimmed content
 * pressed) to close.
 */
const LayoutPreset: FunctionComponent<{
  compact: boolean;
  id: string;
  title: string;
}> = ({ compact, id, title }) => {
  const [log, addLog] = useLog();
  const [folder, setFolder] = useState('Inbox');
  const [message, setMessage] = useState('Message 1');
  // Compact: the drawer (controlled, opened by the button).
  const [open, setOpen] = useState<boolean | undefined>(undefined);

  const [
    externalContent,
    externalRoot,
    externalSidebar,
    externalDrawer,
    externalList,
    externalDetail,
  ] = useProvidedState(id);

  const [controlContent, content, stateContent] = usePropControl(
    compact ? propOptionsContentCompact : propOptionsContent,
    '[content]',
    externalContent,
    true,
  );
  const [controlDrawer, propsDrawer, stateDrawer, RemounterDrawer] =
    usePropControl(
      propOptionsDrawer,
      'column (sidebar): drawer',
      externalDrawer,
    );
  const [controlRoot, propsRoot, stateRoot] = usePropControl(
    propOptionsRoot,
    'root',
    externalRoot,
  );
  const [controlSidebar, propsSidebar, stateSidebar, RemounterSidebar] =
    usePropControl(
      useMemo(
        () => getPropOptionsColumn('sidebar', 280, true, addLog),
        [addLog],
      ),
      'column (sidebar)',
      externalSidebar,
      true,
    );
  const [controlList, propsList, stateList, RemounterList] = usePropControl(
    useMemo(() => getPropOptionsColumn('list', 320, true, addLog), [addLog]),
    'column (list)',
    externalList,
  );
  const [controlDetail, propsDetail, stateDetail, RemounterDetail] =
    usePropControl(
      useMemo(
        () => getPropOptionsColumn('detail', undefined, false, addLog),
        [addLog],
      ),
      'column (detail)',
      externalDetail,
    );

  // Compact: the button showing the sidebar, in the next column's bar.
  const showSidebar = compact ? (
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
  ) : undefined;
  // (Choosing a folder, a message closes the drawer.)
  const close = () => {
    if (compact) setOpen(false);
  };

  return (
    <Component
      stretch
      id={id}
      log={log}
      title={title}
      controls={[
        controlContent,
        controlRoot,
        controlSidebar,
        ...(compact ? [controlDrawer] : []),
        ...(content.columns === 3 ? [controlList] : []),
        controlDetail,
      ]}
      stateUrl={useCreateStateUrl(id, [
        stateContent,
        stateRoot,
        stateSidebar,
        stateDrawer,
        stateList,
        stateDetail,
      ])}
    >
      <Layout.Root
        {...propsRoot}
        compact={compact}
        style={{ height: screenHeight, ...(propsRoot.style as CSSProperties) }}
      >
        <RemounterSidebar>
          <RemounterDrawer>
            <Layout.Column
              {...propsSidebar}
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
              <Page.Root>
                {header('Mailboxes')}
                <List.Root>
                  <List.Section>
                    <List.Group>
                      {folders.map((name) => (
                        <List.Item key={name}>
                          <List.Image variant="symbol">
                            <SFSymbol icon={sfFolderFill} />
                          </List.Image>
                          <List.Title
                            render={<button type="button" />}
                            onClick={() => {
                              addLog(`folder: ${name}`);
                              setFolder(name);
                              close();
                            }}
                          >
                            {name}
                          </List.Title>
                          {name === folder ? <List.Checkmark /> : null}
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                </List.Root>
              </Page.Root>
            </Layout.Column>
          </RemounterDrawer>
        </RemounterSidebar>
        {content.columns === 3 ? (
          <RemounterList>
            <Layout.Column {...propsList}>
              <Page.Root background="plain">
                {header(folder, showSidebar)}
                <List.Root listStyle="plain">
                  <List.Section>
                    <List.Group>
                      {messages.map((name) => (
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
                          {name === message ? <List.Checkmark /> : null}
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                </List.Root>
              </Page.Root>
            </Layout.Column>
          </RemounterList>
        ) : null}
        <RemounterDetail>
          <Layout.Column {...propsDetail}>
            <Page.Root background="plain">
              {header(message, content.columns === 3 ? undefined : showSidebar)}
              <List.Root listStyle="plain">
                <List.Block>
                  The detail of {message}, in {folder}: as wide as the columns
                  before it leave.
                </List.Block>
              </List.Root>
            </Page.Root>
          </Layout.Column>
        </RemounterDetail>
      </Layout.Root>
    </Component>
  );
};

/** The layout, regular (e.g. an iPad): its columns side by side. */
export const LayoutDemo: FunctionComponent = () => (
  <LayoutPreset
    compact={false}
    id="layout"
    title="Layout"
  />
);

/** The layout, compact (e.g. an iPhone): its sidebar a drawer, swiped in. */
export const LayoutCompactDemo: FunctionComponent = () => (
  <LayoutPreset
    compact
    id="layout-compact"
    title="Layout (compact)"
  />
);
