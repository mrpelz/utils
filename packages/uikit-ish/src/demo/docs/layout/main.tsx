import './style.css';

import { sfFolderFill } from '@bradleyhodges/sfsymbols/sfFolderFill';
import { FunctionComponent, useState } from 'react';

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
import { useLayoutControls } from './props.js';

/**
 * A layout (UIKit `UISplitViewController`), regular (e.g. an iPad):
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

  return (
    <Component
      isExpanded
      controls={controls}
      id={id}
      log={log}
      stage="tablet"
      state={state}
      title="Layout"
    >
      <Viewport.Content safeArea="none">
        <Layout.Root {...propsRoot}>
          <Layout.Column
            key={keySidebar}
            {...propsSidebar}
          >
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
            </Header.Root>
          </Layout.Column>
          <Layout.Column
            key={keyList}
            {...propsList}
          >
            <Header.Root>
              <Viewport.BlockStart>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Title>
                    <span>{folder}</span>
                  </Toolbar.Title>
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
