import './style.css';

import { sfFolderFill } from '@bradleyhodges/sfsymbols/sfFolderFill';
import { sfListBullet } from '@bradleyhodges/sfsymbols/sfListBullet';
import { FunctionComponent, useMemo, useState } from 'react';

import {
  Button,
  Header,
  Layout,
  List,
  Page,
  Symbol,
  Toolbar,
} from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import {
  getPropOptionsColumn,
  propOptionsDrawer,
  propOptionsDrawerSwipeArea,
  propOptionsRoot,
} from './props.js';

/**
 * A layout (UIKit `UISplitViewController`), regular (e.g. an iPad):
 * columns side by side (a sidebar, a list, a detail), each a page of its
 * own; the sidebar and the list resizable by their dividers (or arrow keys
 * on them).
 */
export const LayoutDemo: FunctionComponent = () => {
  const id = 'layout';

  const [log, addLog] = useLog();
  const [externalRoot, externalSidebar, externalList, externalDetail] =
    useProvidedState(id);

  const [folder, setFolder] = useState('Inbox');
  const [message, setMessage] = useState('Message 1');

  const [controlRoot, propsRoot, stateRoot] = usePropControl(
    propOptionsRoot,
    'root',
    externalRoot,
  );
  const [controlSidebar, propsSidebar, stateSidebar, keySidebar] =
    usePropControl(
      useMemo(
        () => getPropOptionsColumn('sidebar', 280, true, addLog),
        [addLog],
      ),
      'column (sidebar)',
      externalSidebar,
      true,
    );

  const [controlList, propsList, stateList, keyList] = usePropControl(
    useMemo(() => getPropOptionsColumn('list', 320, true, addLog), [addLog]),
    'column (list)',
    externalList,
  );
  const [controlDetail, propsDetail, stateDetail, keyDetail] = usePropControl(
    useMemo(
      () => getPropOptionsColumn('detail', undefined, false, addLog),
      [addLog],
    ),
    'column (detail)',
    externalDetail,
  );

  return (
    <Component
      stretch
      controls={[controlRoot, controlSidebar, controlList, controlDetail]}
      id={id}
      log={log}
      state={[stateRoot, stateSidebar, stateList, stateDetail]}
      title="Layout"
    >
      <div className="layout-demo-screen">
        <Layout.Root {...propsRoot}>
          <Layout.Column
            key={keySidebar}
            {...propsSidebar}
          >
            <Page.Root>
              <Header.Root>
                <Header.Bar>
                  <Toolbar.Title>
                    <span>Mailboxes</span>
                  </Toolbar.Title>
                </Header.Bar>
              </Header.Root>
              <List.Root>
                <List.Section>
                  <List.Group>
                    <List.Item>
                      <List.Image variant="symbol">
                        <Symbol icon={sfFolderFill} />
                      </List.Image>
                      <List.Title
                        render={<button type="button" />}
                        onClick={() => {
                          addLog('folder: Inbox');
                          setFolder('Inbox');
                        }}
                      >
                        Inbox
                      </List.Title>
                      {folder === 'Inbox' ? <List.Checkmark /> : null}
                    </List.Item>
                    <List.Item>
                      <List.Image variant="symbol">
                        <Symbol icon={sfFolderFill} />
                      </List.Image>
                      <List.Title
                        render={<button type="button" />}
                        onClick={() => {
                          addLog('folder: Drafts');
                          setFolder('Drafts');
                        }}
                      >
                        Drafts
                      </List.Title>
                      {folder === 'Drafts' ? <List.Checkmark /> : null}
                    </List.Item>
                    <List.Item>
                      <List.Image variant="symbol">
                        <Symbol icon={sfFolderFill} />
                      </List.Image>
                      <List.Title
                        render={<button type="button" />}
                        onClick={() => {
                          addLog('folder: Sent');
                          setFolder('Sent');
                        }}
                      >
                        Sent
                      </List.Title>
                      {folder === 'Sent' ? <List.Checkmark /> : null}
                    </List.Item>
                    <List.Item>
                      <List.Image variant="symbol">
                        <Symbol icon={sfFolderFill} />
                      </List.Image>
                      <List.Title
                        render={<button type="button" />}
                        onClick={() => {
                          addLog('folder: Archive');
                          setFolder('Archive');
                        }}
                      >
                        Archive
                      </List.Title>
                      {folder === 'Archive' ? <List.Checkmark /> : null}
                    </List.Item>
                  </List.Group>
                </List.Section>
              </List.Root>
            </Page.Root>
          </Layout.Column>
          <Layout.Column
            key={keyList}
            {...propsList}
          >
            <Page.Root background="plain">
              <Header.Root>
                <Header.Bar>
                  <Toolbar.Title>
                    <span>{folder}</span>
                  </Toolbar.Title>
                </Header.Bar>
              </Header.Root>
              <List.Root listStyle="plain">
                <List.Section>
                  <List.Group>
                    {Array.from(
                      { length: 20 },
                      (_, index) => `Message ${index + 1}`,
                    ).map((name) => (
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
          <Layout.Column
            key={keyDetail}
            {...propsDetail}
          >
            <Page.Root background="plain">
              <Header.Root>
                <Header.Bar>
                  <Toolbar.Title>
                    <span>{message}</span>
                  </Toolbar.Title>
                </Header.Bar>
              </Header.Root>
              <List.Root listStyle="plain">
                <List.Block>
                  The detail of {message}, in {folder}: as wide as the columns
                  before it leave.
                </List.Block>
              </List.Root>
            </Page.Root>
          </Layout.Column>
        </Layout.Root>
      </div>
    </Component>
  );
};

/**
 * The layout, compact (e.g. an iPhone): the sidebar is a drawer, swiped in
 * from its edge (or by the button in the next column's bar), swiped back
 * (or the dimmed content pressed) to close.
 */
export const LayoutCompactDemo: FunctionComponent = () => {
  const id = 'layout-compact';

  const [log, addLog] = useLog();
  const [
    externalRoot,
    externalSidebar,
    externalDrawer,
    externalSwipeArea,
    externalList,
    externalDetail,
  ] = useProvidedState(id);

  const [folder, setFolder] = useState('Inbox');
  const [message, setMessage] = useState('Message 1');
  // The drawer (controlled: opened by the list's button, closing as a folder
  // is chosen).
  const [open, setOpen] = useState(false);

  const [controlRoot, propsRoot, stateRoot] = usePropControl(
    propOptionsRoot,
    'root',
    externalRoot,
  );
  const [controlSidebar, propsSidebar, stateSidebar, keySidebar] =
    usePropControl(
      useMemo(
        () => getPropOptionsColumn('sidebar', 280, true, addLog),
        [addLog],
      ),
      'column (sidebar)',
      externalSidebar,
      true,
    );
  const [controlDrawer, propsDrawer, stateDrawer, keyDrawer] = usePropControl(
    propOptionsDrawer,
    'drawer',
    externalDrawer,
    true,
  );
  const [controlSwipeArea, propsSwipeArea, stateSwipeArea] = usePropControl(
    propOptionsDrawerSwipeArea,
    'drawer swipe area',
    externalSwipeArea,
  );
  const [controlList, propsList, stateList, keyList] = usePropControl(
    useMemo(() => getPropOptionsColumn('list', 320, true, addLog), [addLog]),
    'column (list)',
    externalList,
  );
  const [controlDetail, propsDetail, stateDetail, keyDetail] = usePropControl(
    useMemo(
      () => getPropOptionsColumn('detail', undefined, false, addLog),
      [addLog],
    ),
    'column (detail)',
    externalDetail,
  );

  return (
    <Component
      stretch
      id={id}
      log={log}
      title="Layout (compact)"
      controls={[
        controlRoot,
        controlSidebar,
        controlDrawer,
        controlSwipeArea,
        controlList,
        controlDetail,
      ]}
      state={[
        stateRoot,
        stateSidebar,
        stateDrawer,
        stateSwipeArea,
        stateList,
        stateDetail,
      ]}
    >
      <div className="layout-demo-screen">
        <Layout.Root
          {...propsRoot}
          compact
        >
          <Layout.Drawer
            key={keyDrawer}
            {...propsDrawer}
            open={open}
            onOpenChange={(next: boolean, { reason }) => {
              addLog(`sidebar open: ${String(next)} (${reason})`);
              setOpen(next);
            }}
          >
            <Layout.DrawerSwipeArea {...propsSwipeArea} />
            <Layout.Column
              key={keySidebar}
              {...propsSidebar}
            >
              <Page.Root>
                <Header.Root>
                  <Header.Bar>
                    <Toolbar.Title>
                      <span>Mailboxes</span>
                    </Toolbar.Title>
                  </Header.Bar>
                </Header.Root>
                <List.Root>
                  <List.Section>
                    <List.Group>
                      <List.Item>
                        <List.Image variant="symbol">
                          <Symbol icon={sfFolderFill} />
                        </List.Image>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('folder: Inbox');
                            setFolder('Inbox');
                            // (The drawer closes.)
                            setOpen(false);
                          }}
                        >
                          Inbox
                        </List.Title>
                        {folder === 'Inbox' ? <List.Checkmark /> : null}
                      </List.Item>
                      <List.Item>
                        <List.Image variant="symbol">
                          <Symbol icon={sfFolderFill} />
                        </List.Image>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('folder: Drafts');
                            setFolder('Drafts');
                            // (The drawer closes.)
                            setOpen(false);
                          }}
                        >
                          Drafts
                        </List.Title>
                        {folder === 'Drafts' ? <List.Checkmark /> : null}
                      </List.Item>
                      <List.Item>
                        <List.Image variant="symbol">
                          <Symbol icon={sfFolderFill} />
                        </List.Image>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('folder: Sent');
                            setFolder('Sent');
                            // (The drawer closes.)
                            setOpen(false);
                          }}
                        >
                          Sent
                        </List.Title>
                        {folder === 'Sent' ? <List.Checkmark /> : null}
                      </List.Item>
                      <List.Item>
                        <List.Image variant="symbol">
                          <Symbol icon={sfFolderFill} />
                        </List.Image>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => {
                            addLog('folder: Archive');
                            setFolder('Archive');
                            // (The drawer closes.)
                            setOpen(false);
                          }}
                        >
                          Archive
                        </List.Title>
                        {folder === 'Archive' ? <List.Checkmark /> : null}
                      </List.Item>
                    </List.Group>
                  </List.Section>
                </List.Root>
              </Page.Root>
            </Layout.Column>
          </Layout.Drawer>
          <Layout.Column
            key={keyList}
            {...propsList}
          >
            <Page.Root background="plain">
              <Header.Root>
                <Header.Bar>
                  <Toolbar.Leading>
                    <Toolbar.Button
                      aria-label="Show Sidebar"
                      shape="circle"
                      onClick={() => {
                        addLog('show sidebar');
                        setOpen(true);
                      }}
                    >
                      <Button.Icon>
                        <Symbol icon={sfListBullet} />
                      </Button.Icon>
                    </Toolbar.Button>
                  </Toolbar.Leading>
                  <Toolbar.Title>
                    <span>{folder}</span>
                  </Toolbar.Title>
                  {/* (Balancing it: the title centered.) */}
                  <Toolbar.Trailing />
                </Header.Bar>
              </Header.Root>
              <List.Root listStyle="plain">
                <List.Section>
                  <List.Group>
                    {Array.from(
                      { length: 20 },
                      (_, index) => `Message ${index + 1}`,
                    ).map((name) => (
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
          <Layout.Column
            key={keyDetail}
            {...propsDetail}
          >
            <Page.Root background="plain">
              <Header.Root>
                <Header.Bar>
                  <Toolbar.Title>
                    <span>{message}</span>
                  </Toolbar.Title>
                </Header.Bar>
              </Header.Root>
              <List.Root listStyle="plain">
                <List.Block>
                  The detail of {message}, in {folder}: as wide as the columns
                  before it leave.
                </List.Block>
              </List.Root>
            </Page.Root>
          </Layout.Column>
        </Layout.Root>
      </div>
    </Component>
  );
};
