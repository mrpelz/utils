import './style.css';

import { FunctionComponent, useMemo, useState } from 'react';

import {
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
import { usePartControls } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { sfFolderFill } from '../../tooling/icons.js';
import { partPropMaps } from '../part-options.js';
import { useLayoutControls } from './props.js';

/**
 * A layout, regular (e.g. a tablet):
 * columns side by side (a sidebar, a list, a detail), each a page of its
 * own; the sidebar and the list resizable by their dividers (or arrow keys
 * on them).
 */
export const LayoutDemo: FunctionComponent = () => {
  const id = 'layout';

  const [log, addLog] = useLog();
  const [folder, setFolder] = useState('Inbox');
  const [message, setMessage] = useState('Message 1');

  const {
    controls,
    keyFirst: keySidebar,
    keySecond: keyList,
    keyThird: keyDetail,
    propsFirst: propsSidebar,
    propsRoot,
    propsSecond: propsList,
    propsThird: propsDetail,
    state,
  } = useLayoutControls(id, addLog, {
    columns: [
      ['sidebar', 280, true],
      ['list', 320, true],
      ['detail', undefined, false],
    ],
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
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isExpanded
      controls={[controls, partControls]}
      id={id}
      log={log}
      stage="tablet"
      state={[...state, partState]}
      title="Layout"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Layout.Root {...propsRoot}>
          <Layout.Column
            key={keySidebar}
            {...propsSidebar}
          >
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
                            }}
                          >
                            Inbox
                          </List.Title>
                        </List.Content>
                        <List.Trailing {...partProps['List.Trailing']}>
                          {folder === 'Inbox' ? (
                            <List.Checkmark {...partProps['List.Checkmark']} />
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
                            }}
                          >
                            Drafts
                          </List.Title>
                        </List.Content>
                        <List.Trailing {...partProps['List.Trailing']}>
                          {folder === 'Drafts' ? (
                            <List.Checkmark {...partProps['List.Checkmark']} />
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
                            }}
                          >
                            Sent
                          </List.Title>
                        </List.Content>
                        <List.Trailing {...partProps['List.Trailing']}>
                          {folder === 'Sent' ? (
                            <List.Checkmark {...partProps['List.Checkmark']} />
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
                            }}
                          >
                            Archive
                          </List.Title>
                        </List.Content>
                        <List.Trailing {...partProps['List.Trailing']}>
                          {folder === 'Archive' ? (
                            <List.Checkmark {...partProps['List.Checkmark']} />
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
          </Layout.Column>
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
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <span>{folder}</span>
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
