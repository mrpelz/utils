import { sfFolderFill } from '@bradleyhodges/sfsymbols/sfFolderFill';
import { sfListBullet } from '@bradleyhodges/sfsymbols/sfListBullet';
import { FunctionComponent, useMemo, useState } from 'react';

import {
  Button,
  Drawer,
  Header,
  Layout,
  List,
  Page,
  Symbol,
  Toolbar,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  getPropOptionsGuideColumn,
  propOptionsGuideRoot,
} from '../layout/props.js';
import {
  getPropOptionsRootControlled,
  propOptionsPopup,
  propOptionsSwipeArea,
} from './props.js';

/**
 * A phone's mail (a compact layout): the mailboxes a drawer, controlled
 * (opened by the list's button, closing as a mailbox is chosen), swiped in
 * from its edge too, swiped back (or the dimmed content pressed) to close.
 */
export const DrawerControlledDemo: FunctionComponent = () => {
  const id = 'drawer-controlled';

  const [log, addLog] = useLog();
  const [
    externalDrawer,
    externalSwipeArea,
    externalPopup,
    externalRoot,
    externalList,
    externalDetail,
  ] = useProvidedState(id);

  const [folder, setFolder] = useState('Inbox');
  const [message, setMessage] = useState('Message 1');
  // The drawer (controlled: opened by the list's button, closing as a folder
  // is chosen).
  const [isOpen, setIsOpen] = useState(false);

  const [controlDrawer, propsDrawer, stateDrawer, keyDrawer] = usePropControl(
    useMemo(() => getPropOptionsRootControlled(addLog), [addLog]),
    { external: externalDrawer, isOpen: true, title: 'Drawer.Root' },
  );
  const [controlSwipeArea, propsSwipeArea, stateSwipeArea] = usePropControl(
    propOptionsSwipeArea,
    { external: externalSwipeArea, title: 'Drawer.SwipeArea' },
  );
  const [controlPopup, propsPopup, statePopup] = usePropControl(
    propOptionsPopup,
    { external: externalPopup, title: 'Drawer.Popup' },
  );
  const [controlRoot, propsRoot, stateRoot] = usePropControl(
    propOptionsGuideRoot,
    { external: externalRoot, title: 'Layout.Root' },
  );
  const [controlList, propsList, stateList, keyList] = usePropControl(
    useMemo(
      () => getPropOptionsGuideColumn('list', 320, true, addLog),
      [addLog],
    ),
    { external: externalList, title: 'Layout.Column (list)' },
  );
  const [controlDetail, propsDetail, stateDetail, keyDetail] = usePropControl(
    useMemo(
      () => getPropOptionsGuideColumn('detail', undefined, false, addLog),
      [addLog],
    ),
    { external: externalDetail, title: 'Layout.Column (detail)' },
  );

  return (
    <Component
      id={id}
      log={log}
      setup="const [isOpen, setIsOpen] = useState(false);"
      stage="phone"
      title="Drawer (controlled)"
      controls={[
        controlDrawer,
        controlSwipeArea,
        controlPopup,
        controlRoot,
        controlList,
        controlDetail,
      ]}
      state={[
        stateDrawer,
        stateSwipeArea,
        statePopup,
        stateRoot,
        stateList,
        stateDetail,
      ]}
    >
      <Viewport.Content safeArea="none">
        <Layout.Root {...propsRoot}>
          <Drawer.Root
            key={keyDrawer}
            {...propsDrawer}
            open={isOpen}
            onOpenChange={(isNextOpen: boolean, { reason }) => {
              addLog(`sidebar open: ${String(isNextOpen)} (${reason})`);
              setIsOpen(isNextOpen);
            }}
          >
            <Drawer.SwipeArea {...propsSwipeArea} />
            <Drawer.Popup {...propsPopup}>
              <Header.Root>
                <Viewport.BlockStart>
                  <Toolbar.Root placement="block-start">
                    <Toolbar.Title>
                      <span>Mailboxes</span>
                    </Toolbar.Title>
                  </Toolbar.Root>
                </Viewport.BlockStart>
                <Page.Root>
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
                              setIsOpen(false);
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
                              setIsOpen(false);
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
                              setIsOpen(false);
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
                              setIsOpen(false);
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
              </Header.Root>
            </Drawer.Popup>
          </Drawer.Root>
          <Layout.Column
            key={keyList}
            {...propsList}
          >
            <Header.Root>
              <Viewport.BlockStart>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Leading>
                    <Toolbar.Button
                      aria-label="Show Sidebar"
                      shape="circle"
                      onClick={() => {
                        addLog('show sidebar');
                        setIsOpen(true);
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
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root background="plain">
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
            </Header.Root>
          </Layout.Column>
          <Layout.Column
            key={keyDetail}
            {...propsDetail}
          >
            <Header.Root>
              <Viewport.BlockStart>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Title>
                    <span>{message}</span>
                  </Toolbar.Title>
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Page.Root background="plain">
                <List.Root listStyle="plain">
                  <List.Block>
                    The detail of {message}, in {folder}: as wide as the columns
                    before it leave.
                  </List.Block>
                </List.Root>
              </Page.Root>
            </Header.Root>
          </Layout.Column>
        </Layout.Root>
      </Viewport.Content>
    </Component>
  );
};
