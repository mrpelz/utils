import { FunctionComponent, useMemo } from 'react';

import {
  Header,
  List,
  Page,
  Toolbar,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import { names } from '../viewport/content.js';
import { pageRootRows } from './docs.js';
import { propOptionsGuideRoot } from './props.js';

/** `Page.Root`, outlined: a header, a list. */
const RootPart: FunctionComponent = () => {
  const id = 'page-parts-root';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuideRoot, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Page.Root',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'List.Content': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
          'Toolbar.Leading': [],
          'Toolbar.Root': ['placement'],
          'Toolbar.Title': [],
          'Toolbar.Trailing': [],
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
      isInline
      controls={[control, partControls]}
      id={id}
      stage="phone"
      state={[state, partState]}
      title="Page.Root"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Header.Root>
          <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
            <Toolbar.Root
              {...partProps['Toolbar.Root']}
              placement="block-start"
            >
              <Toolbar.Leading {...partProps['Toolbar.Leading']} />
              <Toolbar.Title {...partProps['Toolbar.Title']}>
                <span>Contacts</span>
              </Toolbar.Title>
              <Toolbar.Trailing {...partProps['Toolbar.Trailing']} />
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root {...props}>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-start"
            />
            <List.Root {...partProps['List.Root']}>
              <List.Section {...partProps['List.Section']}>
                <List.Group {...partProps['List.Group']}>
                  {names.map((name) => (
                    <List.Item
                      key={name}
                      {...partProps['List.Item']}
                    >
                      <List.Content {...partProps['List.Content']}>
                        <List.Title {...partProps['List.Title']}>
                          {name}
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

/** `/page/parts`: its one part. */
export const PageParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        One part: the page. It’s the scroll container for its content, or, with{' '}
        <code>fill</code>, filled by it without scrolling.
      </li>
    </ul>
    <ul className="demo-tree">
      <li className="demo-tree-context">
        <PartLink
          component="header"
          part="Header.Root"
        />
        <span> (optional: around it, its bar anchored above it)</span>
        <ul>
          <li>
            <PartLink
              component="page"
              part="Page.Root"
            />
            <ul>
              <li className="demo-tree-context">
                <PartLink
                  component="viewport"
                  part="Viewport.Padding"
                />
                <span>
                  {' '}
                  (at its start and its end: room for the bars there, and the
                  content margin)
                </span>
              </li>
              <li className="demo-tree-context">
                <PartLink
                  component="header"
                  part="Header.LargeTitle"
                />
                <span> (optional)</span>
              </li>
              <li className="demo-tree-context">
                <span>its content (for example lists)</span>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="page-root"
      level={2}
    >
      <code>Page.Root</code>
    </Heading>
    <ul>
      <li>
        Fills its container and scrolls its content, on the page background (
        <code>background</code>).
      </li>
      <li>
        Keeps the safe area insets clear, as padding. The gap to its content,
        and the room for bars, come from its{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />
        s.
      </li>
      <li>
        Next to a floating column, it’s inset at its start (
        <code>--uikit-layout-inset-start</code>, see{' '}
        <a href={publicUrl('layout')}>Layout</a>).
      </li>
      <li>
        With <code>fill</code>, its content fills it and doesn’t scroll, for
        example a map under its bars (like Framework7’s <code>.page</code>{' '}
        without its <code>.page-content</code>). It’s then not a scroller. Its
        content runs under the bars, the safe area insets and a floating column,
        still on the page background, so the page below doesn’t show through as
        it slides in.
      </li>
      <li>
        A text field typed into inside it is scrolled into view above the
        on-screen keyboard (see{' '}
        <PartLink
          component="viewport"
          part="useFocusScroll"
        />
        ), except with <code>fill</code>.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={pageRootRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const pagePartsDemos = [RootPart];
