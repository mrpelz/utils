import { FunctionComponent } from 'react';

import {
  Header,
  List,
  Page,
  Toolbar,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
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
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  const [controlRoot, propsRoot, stateRoot] = usePropControl(propOptionsRoot, {
    external: externalRoot,
    isOpen: true,
    title: 'root',
  });

  return (
    <Component
      controls={[controlContent, controlRoot]}
      id={id}
      log={log}
      stage="phone"
      state={[stateContent, stateRoot]}
      title="Page"
    >
      <Viewport.Content>
        <Header.Root>
          {content.header ? (
            <Viewport.BlockStart>
              <Toolbar.Root placement="block-start">
                <Toolbar.Title>
                  <span>Page</span>
                </Toolbar.Title>
              </Toolbar.Root>
            </Viewport.BlockStart>
          ) : null}
          <Page.Root
            {...propsRoot}
            background={
              propsRoot.background ??
              (content.listStyle === 'plain' ? 'plain' : 'grouped')
            }
          >
            {/* (Without the bar: none.) */}
            <Viewport.Padding edge="block-start" />
            {content.header ? (
              <Header.LargeTitle>
                <span>Page</span>
              </Header.LargeTitle>
            ) : null}
            <List.Root listStyle={content.listStyle}>
              <List.Section>
                <List.Group>
                  {Array.from({ length: 30 }, (_, index) => (
                    <List.Item key={index}>
                      <List.Content>
                        <List.Title>Row {index + 1}</List.Title>
                      </List.Content>
                    </List.Item>
                  ))}
                </List.Group>
              </List.Section>
            </List.Root>
            <Viewport.Padding edge="block-end" />
          </Page.Root>
        </Header.Root>
      </Viewport.Content>
    </Component>
  );
};
