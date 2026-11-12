import '../toolbar/style.css';

import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { FunctionComponent, useMemo, useState } from 'react';

import {
  Button,
  Header,
  List,
  Page,
  Segmented,
  Symbol,
  Toolbar,
  Viewport,
} from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { AddLog, useLog } from '../../tooling/frame/log.js';
import { usePartControls } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { sfEllipsis, sfLocationFill } from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';

/** A news app's sections: more than a phone's width holds. */
const newsSections = [
  'Top Stories',
  'World',
  'Business',
  'Technology',
  'Science',
  'Health',
  'Sports',
  'Entertainment',
] as const;

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const headerCode = `const [filter, setFilter] = useState('all');

<Header.Root>
  <Viewport.BlockStart>
    <Toolbar.Root placement="block-start">
      <Segmented.Root
        aria-label="Calls"
        value={filter}
        onValueChange={setFilter}
      >
        <Segmented.Item value="all">All</Segmented.Item>
        <Segmented.Item value="missed">Missed</Segmented.Item>
        <Segmented.Highlight />
      </Segmented.Root>
    </Toolbar.Root>
  </Viewport.BlockStart>
  <Page.Root>
    <Viewport.Padding edge="block-start" />
    <Header.LargeTitle>
      <span>Recents</span>
    </Header.LargeTitle>
    <List.Root>…</List.Root>
    <Viewport.Padding edge="block-end" />
  </Page.Root>
</Header.Root>`;

const toolbarCode = `<Viewport.BlockEnd>
  <Toolbar.Root>
    <Toolbar.Leading>
      <Toolbar.Button aria-label="Location" shape="circle">…</Toolbar.Button>
    </Toolbar.Leading>
    <Segmented.Root
      aria-label="Map style"
      defaultValue="explore"
    >
      <Segmented.Item value="explore">Explore</Segmented.Item>
      <Segmented.Item value="driving">Driving</Segmented.Item>
      <Segmented.Item value="transit">Transit</Segmented.Item>
      <Segmented.Highlight />
    </Segmented.Root>
    <Toolbar.Trailing>
      <Toolbar.Button aria-label="More" shape="circle">…</Toolbar.Button>
    </Toolbar.Trailing>
  </Toolbar.Root>
</Viewport.BlockEnd>`;
const overflowCode = `const newsSections = ['Top Stories', 'World', 'Business', 'Technology', …];
const [section, setSection] = useState(newsSections[0]);

<Viewport.BlockStart>
  <Toolbar.Root placement="block-start">
    {/* More items than fit: scrolled sideways, labels whole. */}
    <Segmented.Root
      aria-label="Section"
      overflow="scroll"
      value={section}
      onValueChange={setSection}
    >
      {newsSections.map((name) => (
        <Segmented.Item
          key={name}
          value={name}
        >
          {name}
        </Segmented.Item>
      ))}
      <Segmented.Highlight />
    </Segmented.Root>
  </Toolbar.Root>
</Viewport.BlockStart>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

// Recent calls (as Phone's): name, kind, missed.
const calls = [
  ['Kate Brown', 'mobile', false],
  ['Daniel Hughes', 'home', true],
  ['Anna Hall', 'mobile', true],
  ['John Doe', 'work', false],
  ['Hank Zimmer', 'mobile', false],
  ['David Turner', 'mobile', true],
] as const;

const logChange =
  (addLog: AddLog, set: (value: string) => void) =>
  (value: unknown, { reason }: BaseRadioGroup.ChangeEventDetails) => {
    addLog(`value change: ${String(value)}/${reason}`);
    set(String(value));
  };

/**
 * Recents (as Phone's): its large title in the page, its filter in the bar
 * in place of the title.
 */
const InHeader: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [filter, setFilter] = useState('all');

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Header.LargeTitle': [],
            'List.Content': [],
            'List.Detail': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': ['style'],
            'List.Trailing': [],
            'Page.Root': [],
            'Segmented.Highlight': [],
            'Segmented.Item': ['value'],
            'Segmented.Root': ['aria-label', 'onValueChange', 'value'],
            'Toolbar.Root': ['placement'],
            'Viewport.BlockStart': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('segmented-composition-header') },
  );

  return (
    <Component
      isInline
      controls={[partControls]}
      id="segmented-composition-header"
      log={log}
      stage="phone"
      state={[partState]}
      title="Segmented in a navigation bar"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Header.Root>
          <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
            <Toolbar.Root
              {...partProps['Toolbar.Root']}
              placement="block-start"
            >
              <Segmented.Root
                {...partProps['Segmented.Root']}
                aria-label="Calls"
                value={filter}
                onValueChange={logChange(addLog, setFilter)}
              >
                <Segmented.Item
                  {...partProps['Segmented.Item']}
                  value="all"
                >
                  All
                </Segmented.Item>
                <Segmented.Item
                  {...partProps['Segmented.Item']}
                  value="missed"
                >
                  Missed
                </Segmented.Item>
                <Segmented.Highlight {...partProps['Segmented.Highlight']} />
              </Segmented.Root>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root {...partProps['Page.Root']}>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-start"
            />
            <Header.LargeTitle {...partProps['Header.LargeTitle']}>
              <span>Recents</span>
            </Header.LargeTitle>
            <List.Root {...partProps['List.Root']}>
              <List.Section {...partProps['List.Section']}>
                <List.Group {...partProps['List.Group']}>
                  {calls
                    .filter((call) => filter === 'all' || call[2])
                    .map(([name, kind, isMissed], index) => (
                      <List.Item
                        key={index}
                        {...partProps['List.Item']}
                      >
                        <List.Content {...partProps['List.Content']}>
                          <List.Title
                            {...partProps['List.Title']}
                            style={
                              isMissed
                                ? { color: 'var(--color-ui-system-red)' }
                                : undefined
                            }
                          >
                            {name}
                          </List.Title>
                        </List.Content>
                        <List.Trailing {...partProps['List.Trailing']}>
                          <List.Detail {...partProps['List.Detail']}>
                            {kind}
                          </List.Detail>
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
      </Viewport.Content>
    </Component>
  );
};

/** A map's display mode, in a bottom toolbar. */
const InToolbar: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Segmented.Highlight': [],
            'Segmented.Item': ['value'],
            'Segmented.Root': ['aria-label', 'defaultValue', 'onValueChange'],
            'Toolbar.Button': ['aria-label', 'onClick', 'shape'],
            'Toolbar.Leading': [],
            'Toolbar.Root': [],
            'Toolbar.Trailing': [],
            'Viewport.BlockEnd': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('segmented-composition-toolbar') },
  );

  return (
    <Component
      isInline
      controls={[partControls]}
      id="segmented-composition-toolbar"
      log={log}
      stage="phone"
      state={[partState]}
      title="Segmented in a toolbar"
    >
      <Viewport.BlockEnd {...partProps['Viewport.BlockEnd']}>
        <Toolbar.Root {...partProps['Toolbar.Root']}>
          <Toolbar.Leading {...partProps['Toolbar.Leading']}>
            <Toolbar.Button
              {...partProps['Toolbar.Button']}
              aria-label="Location"
              shape="circle"
              onClick={() => addLog('Location clicked')}
            >
              <Button.Icon {...partProps['Button.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfLocationFill}
                />
              </Button.Icon>
            </Toolbar.Button>
          </Toolbar.Leading>
          <Segmented.Root
            {...partProps['Segmented.Root']}
            aria-label="Map style"
            defaultValue="explore"
            onValueChange={(
              value: unknown,
              { reason }: BaseRadioGroup.ChangeEventDetails,
            ) => addLog(`value change: ${String(value)}/${reason}`)}
          >
            <Segmented.Item
              {...partProps['Segmented.Item']}
              value="explore"
            >
              Explore
            </Segmented.Item>
            <Segmented.Item
              {...partProps['Segmented.Item']}
              value="driving"
            >
              Driving
            </Segmented.Item>
            <Segmented.Item
              {...partProps['Segmented.Item']}
              value="transit"
            >
              Transit
            </Segmented.Item>
            <Segmented.Highlight {...partProps['Segmented.Highlight']} />
          </Segmented.Root>
          <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
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
          </Toolbar.Trailing>
        </Toolbar.Root>
      </Viewport.BlockEnd>
    </Component>
  );
};

/** News sections: more than a phone's width, scrolled sideways. */
const Overflowing: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [section, setSection] = useState<string>(newsSections[0]);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'Segmented.Highlight': [],
            'Segmented.Item': ['value'],
            'Segmented.Root': [
              'aria-label',
              'onValueChange',
              'overflow',
              'value',
            ],
            'Toolbar.Root': ['placement'],
            'Viewport.BlockStart': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('segmented-composition-overflow') },
  );

  return (
    <Component
      isInline
      controls={[partControls]}
      id="segmented-composition-overflow"
      log={log}
      stage="phone"
      state={[partState]}
      title="Segmented, scrolled"
    >
      <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
        <Toolbar.Root
          {...partProps['Toolbar.Root']}
          placement="block-start"
        >
          <Segmented.Root
            {...partProps['Segmented.Root']}
            aria-label="Section"
            overflow="scroll"
            value={section}
            onValueChange={(
              value: unknown,
              { reason }: BaseRadioGroup.ChangeEventDetails,
            ) => {
              addLog(`value change: ${String(value)}/${reason}`);
              setSection(String(value));
            }}
          >
            {newsSections.map((name) => (
              <Segmented.Item
                key={name}
                {...partProps['Segmented.Item']}
                value={name}
              >
                {name}
              </Segmented.Item>
            ))}
            <Segmented.Highlight {...partProps['Segmented.Highlight']} />
          </Segmented.Root>
        </Toolbar.Root>
      </Viewport.BlockStart>
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Viewport.Padding
          {...partProps['Viewport.Padding']}
          edge="block-start"
        />
        <List.Root {...partProps['List.Root']}>
          <List.Section {...partProps['List.Section']}>
            <List.Group {...partProps['List.Group']}>
              {Array.from({ length: 12 }, (_, index) => (
                <List.Item
                  key={index}
                  {...partProps['List.Item']}
                >
                  <List.Content {...partProps['List.Content']}>
                    <List.Title {...partProps['List.Title']}>
                      {section}: story {index + 1}
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
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['in-a-navigation-bar', 'In a navigation bar'],
  ['in-a-toolbar', 'In a toolbar'],
  ['more-than-fit', 'More than fit'],
  ['in-forms', 'In forms'],
];

/** `/segmented/composition`: segmented controls in content and bars. */
export const SegmentedComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <Heading
      id="in-a-navigation-bar"
      level={2}
    >
      In a navigation bar
    </Heading>
    <ul>
      <li>
        In place of the title, it filters the page’s list (as in a phone app’s
        recent calls: All, Missed).
      </li>
      <li>
        It sits in the <a href={publicUrl('header')}>Header</a>’s bar, on its
        glass, with the page’s title as a large title below it (
        <PartLink
          component="header"
          part="Header.LargeTitle"
        />
        ) that scrolls with the page.
      </li>
      <li>
        The{' '}
        <PartLink
          component="header"
          part="Header.Root"
        />{' '}
        ties the bar to the large title. The control isn’t in the bar’s{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Title"
        />
        , so it stays as the large title scrolls under the bar.
      </li>
      <li>
        <strong>Library:</strong> the control in the header’s bar, on its glass,
        and the large title.
      </li>
      <li>
        <strong>Demo:</strong> the filter (the app’s state), and the rows it
        shows.
      </li>
    </ul>
    <CodeView code={headerCode} />
    <InHeader />

    <Heading
      id="in-a-toolbar"
      level={2}
    >
      In a toolbar
    </Heading>
    <ul>
      <li>
        It sits between a bottom <a href={publicUrl('toolbar')}>Toolbar</a>’s
        buttons and chooses how the content is shown (as in a maps app’s modes).
      </li>
      <li>
        The buttons act on the content, so the choice and the actions stay
        apart.
      </li>
      <li>
        <strong>Library:</strong> the control between the bottom{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Root"
        />
        ’s buttons.
      </li>
      <li>
        <strong>Demo:</strong> the modes, and the buttons’ actions (logged).
      </li>
    </ul>
    <CodeView code={toolbarCode} />
    <InToolbar />

    <Heading
      id="more-than-fit"
      level={2}
    >
      More than fit
    </Heading>
    <ul>
      <li>
        When there are more items than its width holds (for example a news app’s
        sections), they scroll sideways (<code>overflow</code>{' '}
        <code>scroll</code>), with their labels whole instead of truncated.
      </li>
      <li>
        Swipe them (or use a wheel) to scroll. Holding an item shows the lens,
        which can be dragged over the items and scrolls them near an end (like
        an <a href={publicUrl('edit-menu')}>Edit Menu</a>’s actions).
      </li>
      <li>
        Prefer fewer, shorter choices where they fit, because a segmented
        control’s choices are meant to be seen at once. When it scrolls, some
        are out of sight.
      </li>
      <li>
        <strong>Library:</strong> the scrolling, and the lens dragging over it (
        <PartLink
          component="segmented"
          part="Segmented.Root"
        >
          overflow
        </PartLink>
        ).
      </li>
      <li>
        <strong>Demo:</strong> the sections, and the stories the chosen one
        shows.
      </li>
    </ul>
    <CodeView code={overflowCode} />
    <Overflowing />

    <Heading
      id="in-forms"
      level={2}
    >
      In forms
    </Heading>
    <ul>
      <li>
        It’s a radio group with hidden radio inputs, so in a{' '}
        <a href={publicUrl('form')}>Form</a>, it submits under the root’s{' '}
        <code>name</code> (with the chosen item’s <code>value</code>), like
        native radio buttons.
      </li>
      <li>
        It can be <code>required</code>.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const segmentedCompositionDemos = [InHeader, InToolbar, Overflowing];
