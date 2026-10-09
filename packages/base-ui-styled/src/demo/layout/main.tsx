import { sfFolderFill } from '@bradleyhodges/sfsymbols/sfFolderFill';
import { CSSProperties, FunctionComponent, useMemo, useState } from 'react';

import { Header, Layout, List, Page, Toolbar } from '../../components/index.js';
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
  propOptionsRoot,
} from './props.js';

const folders = ['Inbox', 'Drafts', 'Sent', 'Archive'];

const messages = Array.from(
  { length: 20 },
  (_, index) => `Message ${index + 1}`,
);

// A column's page's header: its title in the bar.
const header = (title: string) => (
  <Header.Root>
    <Header.Bar>
      <Toolbar.Title>
        <span>{title}</span>
      </Toolbar.Title>
    </Header.Bar>
  </Header.Root>
);

/**
 * A layout (UIKit `UISplitViewController`): columns side by side (a
 * sidebar, a list, a detail), each a page of its own; the sidebar and the
 * list resizable by their dividers (or arrow keys on them).
 */
export const LayoutDemo: FunctionComponent = () => {
  const id = 'layout';
  const [log, addLog] = useLog();
  const [folder, setFolder] = useState('Inbox');
  const [message, setMessage] = useState('Message 1');

  const [
    externalContent,
    externalRoot,
    externalSidebar,
    externalList,
    externalDetail,
  ] = useProvidedState(id);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    '[content]',
    externalContent,
    true,
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
  const [controlDetail, propsDetail, stateDetail] = usePropControl(
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
      title="Layout"
      controls={[
        controlContent,
        controlRoot,
        controlSidebar,
        ...(content.columns === 3 ? [controlList] : []),
        controlDetail,
      ]}
      stateUrl={useCreateStateUrl(id, [
        stateContent,
        stateRoot,
        stateSidebar,
        stateList,
        stateDetail,
      ])}
    >
      <Layout.Root
        {...propsRoot}
        style={{ height: screenHeight, ...(propsRoot.style as CSSProperties) }}
      >
        <RemounterSidebar>
          <Layout.Column {...propsSidebar}>
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
        </RemounterSidebar>
        {content.columns === 3 ? (
          <RemounterList>
            <Layout.Column {...propsList}>
              <Page.Root background="plain">
                {header(folder)}
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
        <Layout.Column {...propsDetail}>
          <Page.Root background="plain">
            {header(message)}
            <List.Root listStyle="plain">
              <List.Block>
                The detail of {message}, in {folder}: as wide as the columns
                before it leave.
              </List.Block>
            </List.Root>
          </Page.Root>
        </Layout.Column>
      </Layout.Root>
    </Component>
  );
};
