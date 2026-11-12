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
  useCreateDrawerHandle,
  useSizeClass,
  Viewport,
} from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { codeLabel } from '../../tooling/frame/render-code.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { sfICircle, sfListBullet } from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import {
  getPropOptionsGuideColumn,
  propOptionsGuideRoot,
} from '../layout/props.js';
import { partPropMaps } from '../part-options.js';
import { rowTitles, sidebarSections } from '../sidebar/content.js';
import { names } from '../viewport/content.js';
import { useDrawerControls } from './props.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */

const inspectorCode = `const [mailbox, setMailbox] = useState('inbox');
// Their triggers, in the content's bar (outside the drawers).
const mailboxesDrawer = useCreateDrawerHandle();
const inspectorDrawer = useCreateDrawerHandle();

<Layout.Root>
  <Drawer.Root handle={mailboxesDrawer} side="inline-start">
    <Drawer.SwipeArea />
    <Drawer.Popup>
      <Page.Root>
        …
        {/* Chosen: its drawer closes. */}
        <List.Title
          render={<Drawer.Close />}
          onClick={() => setMailbox('inbox')}
        >
          Inbox
        </List.Title>
        …
        <Viewport.Padding edge="block-end" />
      </Page.Root>
    </Drawer.Popup>
  </Drawer.Root>
  <Layout.Column>
    <Header.Root>
      <Viewport.BlockStart>
        <Toolbar.Root placement="block-start">
          <Toolbar.Leading>
            <Drawer.Trigger
              handle={mailboxesDrawer}
              render={<Toolbar.Button aria-label="Mailboxes" shape="circle" />}
            >
              …
            </Drawer.Trigger>
          </Toolbar.Leading>
          <Toolbar.Title>…</Toolbar.Title>
          <Toolbar.Trailing>
            <Drawer.Trigger
              handle={inspectorDrawer}
              render={<Toolbar.Button aria-label="Info" shape="circle" />}
            >
              …
            </Drawer.Trigger>
          </Toolbar.Trailing>
        </Toolbar.Root>
      </Viewport.BlockStart>
      <Page.Root>
        <Viewport.Padding edge="block-start" />
        …
        <Viewport.Padding edge="block-end" />
      </Page.Root>
    </Header.Root>
  </Layout.Column>
  {/* An inspector, from the trailing edge. */}
  <Drawer.Root handle={inspectorDrawer} side="inline-end">
    <Drawer.SwipeArea />
    <Drawer.Popup>
      <Header.Root>
        <Viewport.BlockStart>
          <Toolbar.Root placement="block-start">
            <Toolbar.Leading />
            <Toolbar.Title>…</Toolbar.Title>
            <Toolbar.Trailing>
              <Drawer.Close render={<Toolbar.Button prominent />}>
                <Button.Label>Done</Button.Label>
              </Drawer.Close>
            </Toolbar.Trailing>
          </Toolbar.Root>
        </Viewport.BlockStart>
        <Page.Root>
          <Viewport.Padding edge="block-start" />
          …
          <Viewport.Padding edge="block-end" />
        </Page.Root>
      </Header.Root>
    </Drawer.Popup>
  </Drawer.Root>
</Layout.Root>`;

const adaptiveCode = `// A phone (compact) or a tablet (regular), by the window's width.
const isCompact = useSizeClass() === 'compact';
// Its trigger, in the content's bar (outside the drawer).
const mailboxesDrawer = useCreateDrawerHandle();

<Layout.Root>
  {/* A phone: a drawer; a tablet: a column. */}
  {isCompact ? (
    <Drawer.Root handle={mailboxesDrawer}>
      <Drawer.SwipeArea />
      <Drawer.Popup>
        <Header.Root>…</Header.Root>
      </Drawer.Popup>
    </Drawer.Root>
  ) : (
    <Layout.Column resizable defaultSize={320}>
      <Header.Root>…</Header.Root>
    </Layout.Column>
  )}
  <Layout.Column>
    <Header.Root>
      <Viewport.BlockStart>
        <Toolbar.Root placement="block-start">
          <Toolbar.Leading>
            {/* A phone only: the drawer's button. */}
            {isCompact ? (
              <Drawer.Trigger
                handle={mailboxesDrawer}
                render={<Toolbar.Button aria-label="Mailboxes" shape="circle" />}
              >
                …
              </Drawer.Trigger>
            ) : null}
          </Toolbar.Leading>
          …
        </Toolbar.Root>
      </Viewport.BlockStart>
      <Page.Root>…</Page.Root>
    </Header.Root>
  </Layout.Column>
</Layout.Root>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** The inspector's code's start: the handles linking the bar's buttons. */
const inspectorSetup = `const mailboxesDrawer = useCreateDrawerHandle();
const inspectorDrawer = useCreateDrawerHandle();`;

/** The adaptive view's code's start: its size class, its drawer's handle. */
const adaptiveSetup = `const isCompact = useSizeClass() === 'compact';
const mailboxesDrawer = useCreateDrawerHandle();`;

/** The adaptive view's content: a phone's layout, or a tablet's. */
const propOptionsAdaptiveContent = {
  layout: [undefined, 'phone', 'tablet'] as const,
};

/**
 * The mailboxes: on a tablet, a column (resizable) beside the selected
 * mailbox's page; on a phone, a drawer; unset, by the window's size class.
 */
const Adaptive: FunctionComponent = () => {
  const id = 'drawer-composition-adaptive';
  const [log, addLog] = useLog();
  const [selected, setSelected] = useState('inbox');
  // Its trigger, in the content's bar (outside the drawer).
  const mailboxesDrawer = codeLabel(
    useCreateDrawerHandle(),
    'mailboxesDrawer',
    'const mailboxesDrawer = useCreateDrawerHandle();',
  );
  const [externalContent, externalRoot, externalList, externalDetail] =
    useProvidedState(id);
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsAdaptiveContent,
    { external: externalContent, title: '[content]' },
  );
  const [controlRoot, propsRoot, stateRoot] = usePropControl(
    propOptionsGuideRoot,
    { external: externalRoot, title: 'Layout.Root' },
  );
  const [controlList, propsList, stateList, keyList] = usePropControl(
    useMemo(
      () => getPropOptionsGuideColumn('mailboxes', 320, true, addLog),
      [addLog],
    ),
    { external: externalList, title: 'Layout.Column (mailboxes)' },
  );
  const [controlDetail, propsDetail, stateDetail, keyDetail] = usePropControl(
    useMemo(
      () => getPropOptionsGuideColumn('mailbox', undefined, false, addLog),
      [addLog],
    ),
    { external: externalDetail, title: 'Layout.Column (mailbox)' },
  );
  const drawer = useDrawerControls(id, addLog, {
    isCloseInRow: true,
    isClosed: true,
    offset: 4,
  });
  const sizeClass = useSizeClass();
  // (Unset, by the window's size class.)
  const isCompact =
    content.layout === undefined
      ? sizeClass === 'compact'
      : content.layout === 'phone';

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'List.Checkmark': [],
            'List.Content': [],
            'List.Group': [],
            'List.Header': [],
            'List.Image': ['variant'],
            'List.Item': [],
            'List.Leading': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
            'List.Trailing': [],
            'Page.Root': [],
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
      isExpanded
      isInline
      id={id}
      log={log}
      setup={adaptiveSetup}
      stage={isCompact ? 'phone' : 'tablet'}
      title="A column, or a drawer"
      controls={[
        controlContent,
        controlRoot,
        controlList,
        controlDetail,
        ...drawer.controls,
        partControls,
      ]}
      state={[
        stateContent,
        stateRoot,
        stateList,
        stateDetail,
        ...drawer.state,
        partState,
      ]}
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Layout.Root {...propsRoot}>
          {isCompact ? (
            <Drawer.Root
              key={drawer.keyRoot}
              handle={mailboxesDrawer}
              {...drawer.propsRoot}
            >
              <Drawer.SwipeArea {...drawer.propsSwipeArea} />
              <Drawer.Popup {...drawer.propsPopup}>
                <Header.Root>
                  <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                    <Toolbar.Root
                      {...partProps['Toolbar.Root']}
                      placement="block-start"
                    >
                      <Toolbar.Leading {...partProps['Toolbar.Leading']} />
                      <Toolbar.Title {...partProps['Toolbar.Title']}>
                        <span>Mailboxes</span>
                      </Toolbar.Title>
                      <Toolbar.Trailing {...partProps['Toolbar.Trailing']} />
                    </Toolbar.Root>
                  </Viewport.BlockStart>
                  <Page.Root {...partProps['Page.Root']}>
                    <Viewport.Padding
                      {...partProps['Viewport.Padding']}
                      edge="block-start"
                    />
                    <List.Root {...partProps['List.Root']}>
                      {sidebarSections.map(([title, rows]) => (
                        <List.Section
                          key={title}
                          {...partProps['List.Section']}
                        >
                          <List.Header {...partProps['List.Header']}>
                            <List.Title {...partProps['List.Title']}>
                              {title}
                            </List.Title>
                          </List.Header>
                          <List.Group {...partProps['List.Group']}>
                            {rows.map(([value, rowTitle, icon]) => (
                              <List.Item
                                key={value}
                                {...partProps['List.Item']}
                              >
                                <List.Leading {...partProps['List.Leading']}>
                                  <List.Image
                                    {...partProps['List.Image']}
                                    variant="symbol"
                                  >
                                    <Symbol
                                      {...partProps.Symbol}
                                      icon={icon}
                                    />
                                  </List.Image>
                                </List.Leading>
                                <List.Content {...partProps['List.Content']}>
                                  {/* (Chosen: its drawer closes.) */}
                                  <List.Title
                                    {...partProps['List.Title']}
                                    render={
                                      <Drawer.Close {...drawer.propsClose} />
                                    }
                                    onClick={() => {
                                      addLog(`select: ${value}`);
                                      setSelected(value);
                                    }}
                                  >
                                    {rowTitle}
                                  </List.Title>
                                </List.Content>
                                <List.Trailing {...partProps['List.Trailing']}>
                                  {selected === value ? (
                                    <List.Checkmark
                                      {...partProps['List.Checkmark']}
                                    />
                                  ) : null}
                                </List.Trailing>
                              </List.Item>
                            ))}
                          </List.Group>
                        </List.Section>
                      ))}
                    </List.Root>
                    <Viewport.Padding
                      {...partProps['Viewport.Padding']}
                      edge="block-end"
                    />
                  </Page.Root>
                </Header.Root>
              </Drawer.Popup>
            </Drawer.Root>
          ) : (
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
                    <Toolbar.Leading {...partProps['Toolbar.Leading']} />
                    <Toolbar.Title {...partProps['Toolbar.Title']}>
                      <span>Mailboxes</span>
                    </Toolbar.Title>
                    <Toolbar.Trailing {...partProps['Toolbar.Trailing']} />
                  </Toolbar.Root>
                </Viewport.BlockStart>
                <Page.Root {...partProps['Page.Root']}>
                  <Viewport.Padding
                    {...partProps['Viewport.Padding']}
                    edge="block-start"
                  />
                  <List.Root {...partProps['List.Root']}>
                    {sidebarSections.map(([title, rows]) => (
                      <List.Section
                        key={title}
                        {...partProps['List.Section']}
                      >
                        <List.Header {...partProps['List.Header']}>
                          <List.Title {...partProps['List.Title']}>
                            {title}
                          </List.Title>
                        </List.Header>
                        <List.Group {...partProps['List.Group']}>
                          {rows.map(([value, rowTitle, icon]) => (
                            <List.Item
                              key={value}
                              {...partProps['List.Item']}
                            >
                              <List.Leading {...partProps['List.Leading']}>
                                <List.Image
                                  {...partProps['List.Image']}
                                  variant="symbol"
                                >
                                  <Symbol
                                    {...partProps.Symbol}
                                    icon={icon}
                                  />
                                </List.Image>
                              </List.Leading>
                              <List.Content {...partProps['List.Content']}>
                                <List.Title
                                  {...partProps['List.Title']}
                                  render={<button type="button" />}
                                  onClick={() => {
                                    addLog(`select: ${value}`);
                                    setSelected(value);
                                  }}
                                >
                                  {rowTitle}
                                </List.Title>
                              </List.Content>
                              <List.Trailing {...partProps['List.Trailing']}>
                                {selected === value ? (
                                  <List.Checkmark
                                    {...partProps['List.Checkmark']}
                                  />
                                ) : null}
                              </List.Trailing>
                            </List.Item>
                          ))}
                        </List.Group>
                      </List.Section>
                    ))}
                  </List.Root>
                  <Viewport.Padding
                    {...partProps['Viewport.Padding']}
                    edge="block-end"
                  />
                </Page.Root>
              </Header.Root>
            </Layout.Column>
          )}
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
                  <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                    {isCompact ? (
                      <Drawer.Trigger
                        aria-label="Mailboxes"
                        handle={mailboxesDrawer}
                        {...drawer.propsTrigger}
                      >
                        <Button.Icon {...partProps['Button.Icon']}>
                          <Symbol
                            {...partProps.Symbol}
                            icon={sfListBullet}
                          />
                        </Button.Icon>
                      </Drawer.Trigger>
                    ) : null}
                  </Toolbar.Leading>
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <span>{rowTitles[selected]}</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing {...partProps['Toolbar.Trailing']} />
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
          </Layout.Column>
        </Layout.Root>
      </Viewport.Content>
    </Component>
  );
};

/** A phone: the mailboxes from the leading edge, an inspector from the other. */
const Inspector: FunctionComponent = () => {
  const id = 'drawer-composition-inspector';
  const [log, addLog] = useLog();
  const [mailbox, setMailbox] = useState('inbox');
  // Their triggers, in the content's bar (outside the drawers).
  const mailboxesDrawer = codeLabel(
    useCreateDrawerHandle(),
    'mailboxesDrawer',
    'const mailboxesDrawer = useCreateDrawerHandle();',
  );
  const inspectorDrawer = codeLabel(
    useCreateDrawerHandle(),
    'inspectorDrawer',
    'const inspectorDrawer = useCreateDrawerHandle();',
  );
  const mailboxes = useDrawerControls(id, addLog, {
    isCloseInRow: true,
    isClosed: true,
    label: 'mailboxes',
  });
  const inspector = useDrawerControls(id, addLog, {
    isClosed: true,
    label: 'info',
    offset: 5,
    side: 'inline-end',
  });
  const [externalRoot, externalColumn] = useProvidedState(id).slice(10);
  const [controlRoot, propsRoot, stateRoot] = usePropControl(
    propOptionsGuideRoot,
    { external: externalRoot, title: 'Layout.Root' },
  );
  const [controlColumn, propsColumn, stateColumn, keyColumn] = usePropControl(
    useMemo(
      () => getPropOptionsGuideColumn('messages', undefined, false, addLog),
      [addLog],
    ),
    { external: externalColumn, title: 'Layout.Column' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'List.Checkmark': [],
            'List.Content': [],
            'List.Detail': [],
            'List.Group': [],
            'List.Image': ['variant'],
            'List.Item': [],
            'List.Leading': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
            'List.Trailing': [],
            'Page.Root': [],
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
      isInline
      id={id}
      log={log}
      setup={inspectorSetup}
      stage="phone"
      title="Drawers: mailboxes and an inspector"
      controls={[
        ...mailboxes.controls,
        ...inspector.controls,
        controlRoot,
        controlColumn,
        partControls,
      ]}
      state={[
        ...mailboxes.state,
        ...inspector.state,
        stateRoot,
        stateColumn,
        partState,
      ]}
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Layout.Root {...propsRoot}>
          <Drawer.Root
            key={mailboxes.keyRoot}
            handle={mailboxesDrawer}
            {...mailboxes.propsRoot}
          >
            <Drawer.SwipeArea {...mailboxes.propsSwipeArea} />
            <Drawer.Popup {...mailboxes.propsPopup}>
              <Header.Root>
                <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                  <Toolbar.Root
                    {...partProps['Toolbar.Root']}
                    placement="block-start"
                  >
                    <Toolbar.Leading {...partProps['Toolbar.Leading']} />
                    <Toolbar.Title {...partProps['Toolbar.Title']}>
                      <span>Mailboxes</span>
                    </Toolbar.Title>
                    <Toolbar.Trailing {...partProps['Toolbar.Trailing']} />
                  </Toolbar.Root>
                </Viewport.BlockStart>
                <Page.Root {...partProps['Page.Root']}>
                  <Viewport.Padding
                    {...partProps['Viewport.Padding']}
                    edge="block-start"
                  />
                  <List.Root {...partProps['List.Root']}>
                    {sidebarSections.map(([title, rows]) => (
                      <List.Section
                        key={title}
                        {...partProps['List.Section']}
                      >
                        <List.Group {...partProps['List.Group']}>
                          {rows.map(([value, rowTitle, icon]) => (
                            <List.Item
                              key={value}
                              {...partProps['List.Item']}
                            >
                              <List.Leading {...partProps['List.Leading']}>
                                <List.Image
                                  {...partProps['List.Image']}
                                  variant="symbol"
                                >
                                  <Symbol
                                    {...partProps.Symbol}
                                    icon={icon}
                                  />
                                </List.Image>
                              </List.Leading>
                              <List.Content {...partProps['List.Content']}>
                                {/* (Chosen: its drawer closes.) */}
                                <List.Title
                                  {...partProps['List.Title']}
                                  render={
                                    <Drawer.Close {...mailboxes.propsClose} />
                                  }
                                  onClick={() => {
                                    addLog(`mailbox: ${value}`);
                                    setMailbox(value);
                                  }}
                                >
                                  {rowTitle}
                                </List.Title>
                              </List.Content>
                              <List.Trailing {...partProps['List.Trailing']}>
                                {mailbox === value ? (
                                  <List.Checkmark
                                    {...partProps['List.Checkmark']}
                                  />
                                ) : null}
                              </List.Trailing>
                            </List.Item>
                          ))}
                        </List.Group>
                      </List.Section>
                    ))}
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
            key={keyColumn}
            {...propsColumn}
          >
            <Header.Root>
              <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                <Toolbar.Root
                  {...partProps['Toolbar.Root']}
                  placement="block-start"
                >
                  <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                    <Drawer.Trigger
                      aria-label="Mailboxes"
                      handle={mailboxesDrawer}
                      {...mailboxes.propsTrigger}
                    >
                      <Button.Icon {...partProps['Button.Icon']}>
                        <Symbol
                          {...partProps.Symbol}
                          icon={sfListBullet}
                        />
                      </Button.Icon>
                    </Drawer.Trigger>
                  </Toolbar.Leading>
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <span>{rowTitles[mailbox]}</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                    <Drawer.Trigger
                      aria-label="Info"
                      handle={inspectorDrawer}
                      {...inspector.propsTrigger}
                    >
                      <Button.Icon {...partProps['Button.Icon']}>
                        <Symbol
                          {...partProps.Symbol}
                          icon={sfICircle}
                        />
                      </Button.Icon>
                    </Drawer.Trigger>
                  </Toolbar.Trailing>
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
          </Layout.Column>
          <Drawer.Root
            key={inspector.keyRoot}
            handle={inspectorDrawer}
            {...inspector.propsRoot}
          >
            <Drawer.SwipeArea {...inspector.propsSwipeArea} />
            <Drawer.Popup {...inspector.propsPopup}>
              <Header.Root>
                <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                  <Toolbar.Root
                    {...partProps['Toolbar.Root']}
                    placement="block-start"
                  >
                    <Toolbar.Leading {...partProps['Toolbar.Leading']} />
                    <Toolbar.Title {...partProps['Toolbar.Title']}>
                      <span>Info</span>
                    </Toolbar.Title>
                    <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                      <Drawer.Close {...inspector.propsClose}>
                        <Button.Label {...partProps['Button.Label']}>
                          Done
                        </Button.Label>
                      </Drawer.Close>
                    </Toolbar.Trailing>
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
                          <List.Content {...partProps['List.Content']}>
                            <List.Title {...partProps['List.Title']}>
                              Mailbox
                            </List.Title>
                          </List.Content>
                          <List.Trailing {...partProps['List.Trailing']}>
                            <List.Detail {...partProps['List.Detail']}>
                              {rowTitles[mailbox]}
                            </List.Detail>
                          </List.Trailing>
                        </List.Item>
                        <List.Item {...partProps['List.Item']}>
                          <List.Content {...partProps['List.Content']}>
                            <List.Title {...partProps['List.Title']}>
                              Messages
                            </List.Title>
                          </List.Content>
                          <List.Trailing {...partProps['List.Trailing']}>
                            <List.Detail {...partProps['List.Detail']}>
                              {names.length}
                            </List.Detail>
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
        </Layout.Root>
      </Viewport.Content>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['a-column-or-a-drawer', 'A column, or a drawer'],
  ['an-inspector', 'An inspector'],
];

/** `/drawer/composition`: a layout's column as a drawer, two drawers. */
export const DrawerComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A drawer holds a page (or a <a href={publicUrl('sidebar')}>Sidebar</a>).
        It sits in a screen (a <a href={publicUrl('viewport')}>Viewport</a>’s
        content layer), with its popup above it.
      </li>
      <li>
        On a phone, it takes a <a href={publicUrl('layout')}>Layout</a>’s
        columns that don’t fit. The app renders either a column or a drawer, for
        example by the size class.
      </li>
    </ul>

    <Heading
      id="a-column-or-a-drawer"
      level={2}
    >
      A column, or a drawer
    </Heading>
    <ul>
      <li>
        It follows the window’s size class (
        <PartLink
          component="viewport"
          part="useSizeClass"
        />
        ; compact below 768px). On a tablet, the mailboxes are a{' '}
        <PartLink
          component="layout"
          part="Layout.Column"
        />
        . On a phone, they’re a{' '}
        <PartLink
          component="drawer"
          part="Drawer.Root"
        />
        , opened by a button in the page’s bar.
      </li>
      <li>
        The content is the same either way. On a phone, choosing a mailbox
        closes the drawer (its row’s title is a{' '}
        <PartLink
          component="drawer"
          part="Drawer.Close"
        />
        ). Resize the window, or choose a layout with the <code>layout</code>{' '}
        control.
      </li>
      <li>
        <strong>Library:</strong> the drawer (
        <PartLink
          component="drawer"
          part="Drawer.Root"
        />
        , with its swipe area, trigger and close button), the layout’s column (
        <PartLink
          component="layout"
          part="Layout.Column"
        />
        ), the window’s size class (<code>useSizeClass</code>) and the drawer’s
        handle.
      </li>
      <li>
        <strong>Demo:</strong> choosing a column or a drawer by the size class,
        the mailboxes, and the selected one.
      </li>
    </ul>
    <CodeView code={adaptiveCode} />
    <Adaptive />

    <Heading
      id="an-inspector"
      level={2}
    >
      An inspector
    </Heading>
    <ul>
      <li>
        A mail app on a phone, with a drawer at each edge: the mailboxes at the
        leading one, and an inspector (Info) at the trailing one. Each is swiped
        in from its edge (
        <PartLink
          component="drawer"
          part="Drawer.SwipeArea"
        />
        ), or opened by a button in the bar (
        <PartLink
          component="drawer"
          part="Drawer.Trigger"
        />
        , linked to its drawer by a handle).
      </li>
      <li>
        Both are uncontrolled, and their own parts close them (
        <PartLink
          component="drawer"
          part="Drawer.Close"
        />
        ): choosing a mailbox (its row’s title is the close button), or the
        inspector’s Done.
      </li>
      <li>
        <strong>Library:</strong> a drawer at each edge, each swiped in (
        <PartLink
          component="drawer"
          part="Drawer.SwipeArea"
        />
        ) or opened by a trigger linked by a handle, and closed by its own parts
        (
        <PartLink
          component="drawer"
          part="Drawer.Close"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> the mailboxes, the selected one, and the
        inspector’s content.
      </li>
    </ul>
    <CodeView code={inspectorCode} />
    <Inspector />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const drawerCompositionDemos = [Adaptive, Inspector];
