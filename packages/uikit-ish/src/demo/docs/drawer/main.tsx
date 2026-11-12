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
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { sfFolderFill, sfListBullet } from '../../tooling/icons.js';
import {
  getPropOptionsGuideColumn,
  propOptionsGuideRoot,
} from '../layout/props.js';
import { partPropMaps } from '../part-options.js';
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
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
            'Toolbar.Button': ['aria-label', 'onClick', 'shape'],
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
        partControls,
      ]}
      state={[
        stateDrawer,
        stateSwipeArea,
        statePopup,
        stateRoot,
        stateList,
        stateDetail,
        partState,
      ]}
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
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
                <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                  <Toolbar.Root
                    {...partProps['Toolbar.Root']}
                    placement="block-start"
                  >
                    <Toolbar.Title {...partProps['Toolbar.Title']}>
                      <span>Mailboxes</span>
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
                        <List.Item {...partProps['List.Item']}>
                          <List.Leading {...partProps['List.Leading']}>
                            <List.Image
                              {...partProps['List.Image']}
                              variant="symbol"
                            >
                              <Symbol
                                {...partProps.Symbol}
                                icon={sfFolderFill}
                              />
                            </List.Image>
                          </List.Leading>
                          <List.Content {...partProps['List.Content']}>
                            <List.Title
                              {...partProps['List.Title']}
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
                          </List.Content>
                          <List.Trailing {...partProps['List.Trailing']}>
                            {folder === 'Inbox' ? (
                              <List.Checkmark
                                {...partProps['List.Checkmark']}
                              />
                            ) : null}
                          </List.Trailing>
                        </List.Item>
                        <List.Item {...partProps['List.Item']}>
                          <List.Leading {...partProps['List.Leading']}>
                            <List.Image
                              {...partProps['List.Image']}
                              variant="symbol"
                            >
                              <Symbol
                                {...partProps.Symbol}
                                icon={sfFolderFill}
                              />
                            </List.Image>
                          </List.Leading>
                          <List.Content {...partProps['List.Content']}>
                            <List.Title
                              {...partProps['List.Title']}
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
                          </List.Content>
                          <List.Trailing {...partProps['List.Trailing']}>
                            {folder === 'Drafts' ? (
                              <List.Checkmark
                                {...partProps['List.Checkmark']}
                              />
                            ) : null}
                          </List.Trailing>
                        </List.Item>
                        <List.Item {...partProps['List.Item']}>
                          <List.Leading {...partProps['List.Leading']}>
                            <List.Image
                              {...partProps['List.Image']}
                              variant="symbol"
                            >
                              <Symbol
                                {...partProps.Symbol}
                                icon={sfFolderFill}
                              />
                            </List.Image>
                          </List.Leading>
                          <List.Content {...partProps['List.Content']}>
                            <List.Title
                              {...partProps['List.Title']}
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
                          </List.Content>
                          <List.Trailing {...partProps['List.Trailing']}>
                            {folder === 'Sent' ? (
                              <List.Checkmark
                                {...partProps['List.Checkmark']}
                              />
                            ) : null}
                          </List.Trailing>
                        </List.Item>
                        <List.Item {...partProps['List.Item']}>
                          <List.Leading {...partProps['List.Leading']}>
                            <List.Image
                              {...partProps['List.Image']}
                              variant="symbol"
                            >
                              <Symbol
                                {...partProps.Symbol}
                                icon={sfFolderFill}
                              />
                            </List.Image>
                          </List.Leading>
                          <List.Content {...partProps['List.Content']}>
                            <List.Title
                              {...partProps['List.Title']}
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
                          </List.Content>
                          <List.Trailing {...partProps['List.Trailing']}>
                            {folder === 'Archive' ? (
                              <List.Checkmark
                                {...partProps['List.Checkmark']}
                              />
                            ) : null}
                          </List.Trailing>
                        </List.Item>
                      </List.Group>
                    </List.Section>
                  </List.Root>
                  <Viewport.Padding
                    {...partProps['Viewport.Padding']}
                    edge="block-end"
                  />
                </Page.Root>
              </Header.Root>
            </Drawer.Popup>
          </Drawer.Root>
          <Layout.Column
            key={keyList}
            {...propsList}
          >
            <Header.Root>
              <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                <Toolbar.Root
                  {...partProps['Toolbar.Root']}
                  placement="block-start"
                >
                  <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                    <Toolbar.Button
                      {...partProps['Toolbar.Button']}
                      aria-label="Show Sidebar"
                      shape="circle"
                      onClick={() => {
                        addLog('show sidebar');
                        setIsOpen(true);
                      }}
                    >
                      <Button.Icon {...partProps['Button.Icon']}>
                        <Symbol
                          {...partProps.Symbol}
                          icon={sfListBullet}
                        />
                      </Button.Icon>
                    </Toolbar.Button>
                  </Toolbar.Leading>
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <span>{folder}</span>
                  </Toolbar.Title>
                  {/* (Balancing it: the title centered.) */}
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
                    <List.Group {...partProps['List.Group']}>
                      {Array.from(
                        { length: 20 },
                        (_, index) => `Message ${index + 1}`,
                      ).map((name) => (
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
                            {name === message ? (
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
            key={keyDetail}
            {...propsDetail}
          >
            <Header.Root>
              <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                <Toolbar.Root
                  {...partProps['Toolbar.Root']}
                  placement="block-start"
                >
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <span>{message}</span>
                  </Toolbar.Title>
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
                  <List.Block {...partProps['List.Block']}>
                    The detail of {message}, in {folder}: as wide as the columns
                    before it leave.
                  </List.Block>
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
