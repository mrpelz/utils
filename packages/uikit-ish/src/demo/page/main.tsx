import './style.css';

import { FunctionComponent } from 'react';

import { Header, List, Page, Toolbar } from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { propOptionsContent, propOptionsRoot } from './props.js';

/**
 * A page (Framework7's `.page`): a screen's scroll container, on the page
 * background (grouped lists: grouped; plain lists: plain), a header at its
 * start.
 */
export const PageDemo: FunctionComponent = () => {
  const id = 'page';
  const [log] = useLog();

  const [externalContent, externalRoot] = useProvidedState(id);

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
    true,
  );

  return (
    <Component
      stretch
      controls={[controlContent, controlRoot]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [stateContent, stateRoot])}
      title="Page"
    >
      <div className="page-demo-screen">
        <Page.Root
          {...propsRoot}
          background={
            propsRoot.background ??
            (content.listStyle === 'plain' ? 'plain' : 'grouped')
          }
        >
          {content.header ? (
            <Header.Root>
              <Header.Bar>
                <Toolbar.Title>
                  <span>Page</span>
                </Toolbar.Title>
              </Header.Bar>
              <Header.LargeTitle>
                <span>Page</span>
              </Header.LargeTitle>
            </Header.Root>
          ) : null}
          <List.Root listStyle={content.listStyle}>
            <List.Section>
              <List.Group>
                {Array.from({ length: 30 }, (_, index) => (
                  <List.Item key={index}>
                    <List.Title>Row {index + 1}</List.Title>
                  </List.Item>
                ))}
              </List.Group>
            </List.Section>
          </List.Root>
        </Page.Root>
      </div>
    </Component>
  );
};
