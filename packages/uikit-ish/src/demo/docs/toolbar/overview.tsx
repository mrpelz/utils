import { Fragment, FunctionComponent, useMemo } from 'react';

import {
  Button,
  List,
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
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import {
  sfChevronBackward,
  sfEllipsis,
  sfFolder,
  sfSquareAndArrowUp,
  sfSquareAndPencil,
} from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import { names } from '../viewport/content.js';
import {
  toolbarButtonRows,
  toolbarGroupRows,
  toolbarRootRows,
  toolbarTitleRows,
} from './docs.js';
import {
  propOptionsOverviewBottom,
  propOptionsOverviewRoot,
  propOptionsOverviewTop,
} from './props.js';

/**
 * A phone's screen: a list beneath a bar at the top (a navigation bar) and
 * one at the bottom, both with the root's props.
 */
const LiveView: FunctionComponent = () => {
  const id = 'toolbar-overview';
  const [log, addLog] = useLog();
  const [externalRoot, externalTop, externalBottom] = useProvidedState(id);
  const [controlRoot, propsRoot, stateRoot, elementKey] = usePropControl(
    propOptionsOverviewRoot,
    { external: externalRoot, isOpen: true, title: 'Toolbar.Root' },
  );
  const [controlTop, top, stateTop] = usePropControl(propOptionsOverviewTop, {
    external: externalTop,
    title: '[top bar]',
  });
  const [controlBottom, bottom, stateBottom] = usePropControl(
    propOptionsOverviewBottom,
    { external: externalBottom, title: '[bottom bar]' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'Toolbar.Button': ['aria-label', 'onClick', 'prominent', 'shape'],
            'Toolbar.Group': [],
            'Toolbar.Leading': [],
            'Toolbar.Subtitle': [],
            'Toolbar.Title': ['alignStart'],
            'Toolbar.Trailing': [],
            'Viewport.BlockEnd': [],
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
      controls={[controlRoot, controlTop, controlBottom, partControls]}
      id={id}
      log={log}
      stage="phone"
      state={[stateRoot, stateTop, stateBottom, partState]}
      title="Toolbar"
    >
      <Fragment key={elementKey}>
        <Viewport.Content {...partProps['Viewport.Content']}>
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
        </Viewport.Content>
        {top.shown ? (
          <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
            <Toolbar.Root
              placement="block-start"
              {...propsRoot}
            >
              {top.leading ? (
                <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                  <Toolbar.Button
                    {...partProps['Toolbar.Button']}
                    aria-label="Back"
                    shape="circle"
                    onClick={() => addLog('Back clicked')}
                  >
                    <Button.Icon {...partProps['Button.Icon']}>
                      <Symbol
                        {...partProps.Symbol}
                        icon={sfChevronBackward}
                      />
                    </Button.Icon>
                  </Toolbar.Button>
                </Toolbar.Leading>
              ) : null}
              <Toolbar.Title
                {...partProps['Toolbar.Title']}
                alignStart={top.alignStart}
              >
                <span>Contacts</span>
                {top.subtitle ? (
                  <Toolbar.Subtitle {...partProps['Toolbar.Subtitle']}>
                    {names.length} people
                  </Toolbar.Subtitle>
                ) : null}
              </Toolbar.Title>
              {top.trailing ? (
                <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                  <Toolbar.Group {...partProps['Toolbar.Group']}>
                    <Toolbar.Button
                      {...partProps['Toolbar.Button']}
                      aria-label="Share"
                      shape="circle"
                      onClick={() => addLog('Share clicked')}
                    >
                      <Button.Icon {...partProps['Button.Icon']}>
                        <Symbol
                          {...partProps.Symbol}
                          icon={sfSquareAndArrowUp}
                        />
                      </Button.Icon>
                    </Toolbar.Button>
                    <Toolbar.Button
                      {...partProps['Toolbar.Button']}
                      aria-label="More"
                      shape="circle"
                      onClick={() => addLog('More clicked')}
                    >
                      <Button.Icon {...partProps['Button.Icon']}>
                        <Symbol
                          {...partProps.Symbol}
                          icon={sfEllipsis}
                        />
                      </Button.Icon>
                    </Toolbar.Button>
                  </Toolbar.Group>
                </Toolbar.Trailing>
              ) : null}
            </Toolbar.Root>
          </Viewport.BlockStart>
        ) : null}
        {bottom.shown ? (
          <Viewport.BlockEnd {...partProps['Viewport.BlockEnd']}>
            <Toolbar.Root {...propsRoot}>
              <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                <Toolbar.Button
                  {...partProps['Toolbar.Button']}
                  aria-label="Folders"
                  shape="circle"
                  onClick={() => addLog('Folders clicked')}
                >
                  <Button.Icon {...partProps['Button.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfFolder}
                    />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Leading>
              {bottom.title ? (
                <Toolbar.Title {...partProps['Toolbar.Title']}>
                  <span>{names.length} Contacts</span>
                </Toolbar.Title>
              ) : null}
              <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                <Toolbar.Button
                  {...partProps['Toolbar.Button']}
                  aria-label="New contact"
                  prominent={bottom.prominent}
                  shape="circle"
                  onClick={() => addLog('New contact clicked')}
                >
                  <Button.Icon {...partProps['Button.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfSquareAndPencil}
                    />
                  </Button.Icon>
                </Toolbar.Button>
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Viewport.BlockEnd>
        ) : null}
      </Fragment>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['when-to-use-it', 'When to use it'],
  ['when-to-use-something-else', 'When to use something else'],
  ['key-props', 'Key props'],
  ['accessibility', 'Accessibility'],
  ['behavior', 'Behavior'],
];

/** `/toolbar`: what toolbars are for, and their props. */
export const ToolbarOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A bar of commands for the current view: glass capsules of buttons at its
        start and end, with a title or a control between them.
      </li>
      <li>
        It sits at the bottom of a screen, or at its top as a navigation bar (
        <code>placement=&quot;block-start&quot;</code>, as in a{' '}
        <a href={publicUrl('header')}>Header</a>).
      </li>
      <li>
        It’s built on Base UI’s Toolbar: one stop in the tab order, with the
        arrow keys moving between its buttons.
      </li>
    </ul>
    <LiveView />

    <Heading
      id="when-to-use-it"
      level={2}
    >
      When to use it
    </Heading>
    <ul>
      <li>
        For frequent commands on what a screen shows (compose, share, delete),
        at the bottom, in a{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockEnd"
        />{' '}
        (see <a href={publicUrl('viewport')}>Viewport</a>).
      </li>
      <li>
        For a navigation bar at the top, with back, the title and a page’s
        actions. It sits in a{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockStart"
        />
        , and a <a href={publicUrl('header')}>Header</a> ties it to its page, so
        it stays put while the page scrolls.
      </li>
      <li>
        For acting on a selection in edit mode (Select All, Move, Delete), or
        for holding a control between the capsules, such as a search field, page
        dots or a segmented control (see{' '}
        <a href={publicUrl('toolbar/composition')}>Composition</a>).
      </li>
    </ul>

    <Heading
      id="when-to-use-something-else"
      level={2}
    >
      When to use something else
    </Heading>
    <ul>
      <li>
        Moving between an app’s sections: use a{' '}
        <a href={publicUrl('tab-bar')}>Tab Bar</a>. A toolbar’s buttons act on
        the current view; tabs switch views.
      </li>
      <li>
        Many commands, or rarely used ones: use a{' '}
        <a href={publicUrl('menu')}>Menu</a> behind one button (for example
        More, <code>ellipsis</code>).
      </li>
      <li>
        Commands on one item, such as a row: use its swipe actions or a{' '}
        <a href={publicUrl('contextual-menu')}>Contextual Menu</a>. For a single
        action in the content, use a <a href={publicUrl('button')}>Button</a>.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most toolbars set, across the parts.</li>
      <li>
        All props of all parts are on the{' '}
        <a href={publicUrl('toolbar/parts')}>Parts</a> page.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        ['Toolbar.Root', pickRows(toolbarRootRows, 'placement', 'context')],
        ['Toolbar.Group', pickRows(toolbarGroupRows, 'prominent', 'tint')],
        [
          'Toolbar.Button',
          pickRows(toolbarButtonRows, 'prominent', 'shape', 'destructive'),
        ],
        ['Toolbar.Title', pickRows(toolbarTitleRows, 'alignStart')],
      ]}
    />

    <Heading
      id="accessibility"
      level={2}
    >
      Accessibility
    </Heading>
    <ul>
      <li>
        The bar is a <code>toolbar</code> (Base UI): one stop in the tab order.
        The arrow keys move focus between its buttons, also across capsules, and
        wrap at its ends (<code>loopFocus</code>).
      </li>
      <li>
        Disabled buttons stay focusable (<code>focusableWhenDisabled</code>) and
        are announced as disabled, so the bar’s commands can still be found.
      </li>
      <li>
        A button with only a symbol needs a name (<code>aria-label</code>, for
        example Share).
      </li>
      <li>
        The title is text, not a heading. A page’s heading is its large title
        (see <a href={publicUrl('header')}>Header</a>), or you can render one (
        <code>render=&#123;&lt;h1 /&gt;&#125;</code>).
      </li>
      <li>
        Pressed capsules scale (a glass lens), without a reduced-motion
        alternative.
      </li>
    </ul>

    <Heading
      id="behavior"
      level={2}
    >
      Behavior
    </Heading>
    <ul>
      <li>
        At the bottom (the default): 48px capsules with 36px buttons, 12px
        apart, padded 4px 16px 2px, above the bottom safe area inset (which its
        anchor keeps clear). At the top: 44px capsules, 10px apart, in a 54px
        bar.
      </li>
      <li>
        <PartLink
          component="toolbar"
          part="Toolbar.Leading"
        >
          Leading
        </PartLink>{' '}
        and{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Trailing"
        >
          Trailing
        </PartLink>{' '}
        share the free space equally, so what’s between them (a title) stays
        centered in the bar as long as they fit. A title aligned to the start
        takes the free space instead.
      </li>
      <li>
        A button on its own is a glass <a href={publicUrl('button')}>Button</a>{' '}
        (a circle, for a symbol). Several share a capsule (
        <PartLink
          component="toolbar"
          part="Toolbar.Group"
        >
          Group
        </PartLink>
        ), with their content blended into its glass.
      </li>
      <li>
        When pressed, a capsule of several buttons turns into a glass lens
        (scaled by 1.05), with the pressed button on the selection.
      </li>
      <li>
        Tinted (<code>prominent</code>, <code>tint</code>), the glass takes the
        tint, and its content turns white.
      </li>
      <li>
        Titles are in Body Emphasized, and truncate. With a subtitle below
        (12px, in the secondary label color), the title stays 17px.
      </li>
      <li>
        The bar has no position of its own. What it’s in places it: a viewport’s
        anchor, or a header.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const toolbarOverviewDemos = [LiveView];
