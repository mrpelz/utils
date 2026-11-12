import { FunctionComponent, useMemo } from 'react';

import {
  Header,
  List,
  Page,
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
import { partPropMaps } from '../part-options.js';
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Header.LargeTitle': [],
          'List.Content': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': ['listStyle'],
          'List.Section': [],
          'List.Title': [],
          'Toolbar.Root': ['placement'],
          'Toolbar.Title': [],
          'Viewport.BlockStart': [],
          'Viewport.Content': [],
          'Viewport.Padding': ['edge'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      controls={[controlContent, controlRoot, partControls]}
      id={id}
      log={log}
      stage="phone"
      state={[stateContent, stateRoot, partState]}
      title="Page"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Header.Root>
          {content.header ? (
            <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
              <Toolbar.Root
                {...partProps['Toolbar.Root']}
                placement="block-start"
              >
                <Toolbar.Title {...partProps['Toolbar.Title']}>
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
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-start"
            />
            {content.header ? (
              <Header.LargeTitle {...partProps['Header.LargeTitle']}>
                <span>Page</span>
              </Header.LargeTitle>
            ) : null}
            <List.Root
              {...partProps['List.Root']}
              listStyle={content.listStyle}
            >
              <List.Section {...partProps['List.Section']}>
                <List.Group {...partProps['List.Group']}>
                  {Array.from({ length: 30 }, (_, index) => (
                    <List.Item
                      key={index}
                      {...partProps['List.Item']}
                    >
                      <List.Content {...partProps['List.Content']}>
                        <List.Title {...partProps['List.Title']}>
                          Row {index + 1}
                        </List.Title>
                      </List.Content>
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
      </Viewport.Content>
    </Component>
  );
};
