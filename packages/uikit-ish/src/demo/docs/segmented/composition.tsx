import '../toolbar/style.css';

import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { sfEllipsis } from '@bradleyhodges/sfsymbols/sfEllipsis';
import { sfLocationFill } from '@bradleyhodges/sfsymbols/sfLocationFill';
import { FunctionComponent, useState } from 'react';

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
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';
import { names } from '../viewport/content.js';
import { propOptionsContentAnchor } from './props.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const contentCode = `const [show, setShow] = useState('all');

<Viewport.Content>
  <Viewport.Padding edge="block-start" />
  <List.Root>…{/* all, or the favorites */}</List.Root>
  <Viewport.Padding edge="block-end" />
</Viewport.Content>
{/* A toolbar spacing the control, placed as its anchor is. */}
<Viewport.Anchor edge="block-start">
  <Toolbar.Root placement="block-start">
    <Segmented.Root
      aria-label="Show"
      value={show}
      onValueChange={setShow}
    >
      <Segmented.Item value="all">All</Segmented.Item>
      <Segmented.Item value="favorites">Favorites</Segmented.Item>
      <Segmented.Highlight />
    </Segmented.Root>
  </Toolbar.Root>
</Viewport.Anchor>`;

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
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

// Some of the contacts, as favorites.
const favorites = names.filter((_, index) => index % 4 === 0);

// Recent calls (as Phone's): name, kind, missed.
const calls = [
  ['Kate Bell', 'mobile', false],
  ['Daniel Higgins', 'home', true],
  ['Anna Haro', 'mobile', true],
  ['John Appleseed', 'work', false],
  ['Hank Zakroff', 'mobile', false],
  ['David Taylor', 'mobile', true],
] as const;

const logChange =
  (addLog: AddLog, set: (value: string) => void) =>
  (value: unknown, { reason }: BaseRadioGroup.ChangeEventDetails) => {
    addLog(`value change: ${String(value)}/${reason}`);
    set(String(value));
  };

/**
 * Contacts, all or the favorites, chosen on an anchor (the screen's top or
 * bottom edge) over the scrolling list.
 */
const ContentViews: FunctionComponent = () => {
  const id = 'segmented-composition-content';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsContentAnchor, {
    external,
    isOpen: true,
    title: 'Viewport.Anchor',
  });
  const [show, setShow] = useState('all');

  return (
    <Component
      isInline
      controls={[control]}
      id={id}
      log={log}
      stage="phone"
      state={[state]}
      title="Segmented switching content"
    >
      <>
        <Viewport.Content>
          <Viewport.Padding edge="block-start" />
          <List.Root>
            <List.Section>
              <List.Group>
                {(show === 'all' ? names : favorites).map((name) => (
                  <List.Item key={name}>
                    <List.Title>{name}</List.Title>
                  </List.Item>
                ))}
              </List.Group>
            </List.Section>
          </List.Root>
          <Viewport.Padding edge="block-end" />
        </Viewport.Content>
        <Viewport.Anchor {...props}>
          {/* A toolbar spacing the control, placed as its anchor is. */}
          <Toolbar.Root placement={props.edge}>
            <Segmented.Root
              aria-label="Show"
              value={show}
              onValueChange={logChange(addLog, setShow)}
            >
              <Segmented.Item value="all">All</Segmented.Item>
              <Segmented.Item value="favorites">Favorites</Segmented.Item>
              <Segmented.Highlight />
            </Segmented.Root>
          </Toolbar.Root>
        </Viewport.Anchor>
      </>
    </Component>
  );
};

/** Recents, filtered in the navigation bar. */
const InHeader: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [filter, setFilter] = useState('all');

  return (
    <Component
      isInline
      id="segmented-composition-header"
      log={log}
      stage="phone"
      title="Segmented in a navigation bar"
    >
      <Viewport.Content safeArea="none">
        <Header.Root>
          <Viewport.BlockStart>
            <Toolbar.Root placement="block-start">
              <Segmented.Root
                aria-label="Calls"
                value={filter}
                onValueChange={logChange(addLog, setFilter)}
              >
                <Segmented.Item value="all">All</Segmented.Item>
                <Segmented.Item value="missed">Missed</Segmented.Item>
                <Segmented.Highlight />
              </Segmented.Root>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root>
            <Viewport.Padding edge="block-start" />
            <List.Root>
              <List.Section>
                <List.Group>
                  {calls
                    .filter((call) => filter === 'all' || call[2])
                    .map(([name, kind, isMissed], index) => (
                      <List.Item key={index}>
                        <List.Title
                          style={
                            isMissed
                              ? { color: 'var(--color-ios-system-red)' }
                              : undefined
                          }
                        >
                          {name}
                        </List.Title>
                        <List.Detail>{kind}</List.Detail>
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

/** A map's display mode, in a bottom toolbar. */
const InToolbar: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      isInline
      id="segmented-composition-toolbar"
      log={log}
      stage="phone"
      title="Segmented in a toolbar"
    >
      <Viewport.BlockEnd>
        <Toolbar.Root>
          <Toolbar.Leading>
            <Toolbar.Button
              aria-label="Location"
              shape="circle"
              onClick={() => addLog('Location clicked')}
            >
              <Button.Icon>
                <Symbol icon={sfLocationFill} />
              </Button.Icon>
            </Toolbar.Button>
          </Toolbar.Leading>
          <Segmented.Root
            aria-label="Map style"
            defaultValue="explore"
            onValueChange={(
              value: unknown,
              { reason }: BaseRadioGroup.ChangeEventDetails,
            ) => addLog(`value change: ${String(value)}/${reason}`)}
          >
            <Segmented.Item value="explore">Explore</Segmented.Item>
            <Segmented.Item value="driving">Driving</Segmented.Item>
            <Segmented.Item value="transit">Transit</Segmented.Item>
            <Segmented.Highlight />
          </Segmented.Root>
          <Toolbar.Trailing>
            <Toolbar.Button
              aria-label="More"
              shape="circle"
              onClick={() => addLog('More clicked')}
            >
              <Button.Icon>
                <Symbol icon={sfEllipsis} />
              </Button.Icon>
            </Toolbar.Button>
          </Toolbar.Trailing>
        </Toolbar.Root>
      </Viewport.BlockEnd>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['switching-a-view-s-content', 'Switching a view’s content'],
  ['in-a-navigation-bar', 'In a navigation bar'],
  ['in-a-toolbar', 'In a toolbar'],
  ['in-forms', 'In forms'],
];

/** `/segmented/composition`: segmented controls in content and bars. */
export const SegmentedComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <Heading
      id="switching-a-view-s-content"
      level={2}
    >
      Switching a view’s content
    </Heading>
    <ul>
      <li>
        At the screen’s top or bottom edge, over the content it filters or
        rearranges (all contacts, or the favorites), staying as the list scrolls
        under it.
      </li>
      <li>
        A{' '}
        <PartLink
          component="viewport"
          part="Viewport.Anchor"
        />{' '}
        (<code>edge</code>), in the content layer’s place for a bar, a{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Root"
        />{' '}
        in it (its <code>placement</code> the anchor’s edge) spacing the control
        and giving it the bar’s look: no styles of the app’s.
      </li>
      <li>
        Guide <GuideLink to="section-3-clusters">§3</GuideLink>: segmented
        controls “when used to switch views”.
      </li>
      <li>
        The app holds the value (<code>value</code>, <code>onValueChange</code>)
        and renders the content for it.
      </li>
      <li>
        <strong>Library:</strong> the control (
        <PartLink
          component="segmented"
          part="Segmented.Root"
        />
        ), the anchor at the screen’s edge (
        <PartLink
          component="viewport"
          part="Viewport.Anchor"
        />
        ) and the toolbar giving it the bar’s look.
      </li>
      <li>
        <strong>Demo:</strong> the value (the app’s state) and the rows it
        shows.
      </li>
    </ul>
    <CodeView code={contentCode} />
    <ContentViews />

    <Heading
      id="in-a-navigation-bar"
      level={2}
    >
      In a navigation bar
    </Heading>
    <ul>
      <li>
        In place of the title, filtering the page’s list (Phone’s Recents: All,
        Missed).
      </li>
      <li>
        Inside the <a href="header">Header</a>’s bar, on its glass.
      </li>
      <li>
        <strong>Library:</strong> the control in the header’s bar, on its glass.
      </li>
      <li>
        <strong>Demo:</strong> the filter (the app’s state) and the rows it
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
        Between a bottom <a href="toolbar">Toolbar</a>’s buttons: choosing how
        the content is shown (Maps’ modes).
      </li>
      <li>
        The buttons act on the content (guide{' '}
        <GuideLink to="rule-g1">G1</GuideLink>: choice and actions stay apart).
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
        <strong>Demo:</strong> the modes and the buttons’ actions (logged).
      </li>
    </ul>
    <CodeView code={toolbarCode} />
    <InToolbar />

    <Heading
      id="in-forms"
      level={2}
    >
      In forms
    </Heading>
    <ul>
      <li>
        A radio group with hidden radio inputs: in a <a href="form">Form</a>,
        submitted by the root’s <code>name</code> (the chosen item’s{' '}
        <code>value</code>), as native radio buttons.
      </li>
      <li>
        Can be <code>required</code>.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const segmentedCompositionDemos = [ContentViews, InHeader, InToolbar];
