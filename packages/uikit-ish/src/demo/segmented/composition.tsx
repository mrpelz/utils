import '../toolbar/style.css';
import './style.css';

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
} from '../../components/index.js';
import { CodeView } from '../frame/code-view.js';
import { Component } from '../frame/component.js';
import { AddLog, useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';
import { names } from '../viewport/content.js';
import { propOptionsContentAnchor } from './props.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const contentCode = `const [show, setShow] = useState('all');

<Viewport.Content>
  <List.Root>…{/* all, or the favorites */}</List.Root>
</Viewport.Content>
{/* The anchor is the surface: its class gives it a background. */}
<Viewport.Anchor className="bar" edge="block-start">
  <div className="bar-content">
    <Segmented.Root
      aria-label="Show"
      value={show}
      onValueChange={setShow}
    >
      <Segmented.Item value="all">All</Segmented.Item>
      <Segmented.Item value="favorites">Favorites</Segmented.Item>
      <Segmented.Highlight />
    </Segmented.Root>
  </div>
</Viewport.Anchor>`;

const headerCode = `<Page.Root>
  <Header.Root>
    <Header.Bar>
      <Segmented.Root
        aria-label="Calls"
        value={filter}
        onValueChange={setFilter}
      >
        <Segmented.Item value="all">All</Segmented.Item>
        <Segmented.Item value="missed">Missed</Segmented.Item>
        <Segmented.Highlight />
      </Segmented.Root>
    </Header.Bar>
  </Header.Root>
  <List.Root>…</List.Root>
</Page.Root>`;

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
    open: true,
    title: 'Viewport.Anchor',
  });
  const [show, setShow] = useState('all');

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Segmented switching content"
    >
      <div className="demo-phone">
        <Viewport.Content>
          <List.Root className="segmented-demo-list">
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
        </Viewport.Content>
        <Viewport.Anchor
          className="segmented-demo-bar"
          {...props}
        >
          <div className="segmented-demo-control">
            <Segmented.Root
              aria-label="Show"
              value={show}
              onValueChange={logChange(addLog, setShow)}
            >
              <Segmented.Item value="all">All</Segmented.Item>
              <Segmented.Item value="favorites">Favorites</Segmented.Item>
              <Segmented.Highlight />
            </Segmented.Root>
          </div>
        </Viewport.Anchor>
      </div>
    </Component>
  );
};

/** Recents, filtered in the navigation bar. */
const InHeader: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [filter, setFilter] = useState('all');

  return (
    <Component
      center
      inline
      id="segmented-composition-header"
      log={log}
      title="Segmented in a navigation bar"
    >
      <div className="demo-phone">
        <Page.Root>
          <Header.Root>
            <Header.Bar>
              <Segmented.Root
                aria-label="Calls"
                value={filter}
                onValueChange={logChange(addLog, setFilter)}
              >
                <Segmented.Item value="all">All</Segmented.Item>
                <Segmented.Item value="missed">Missed</Segmented.Item>
                <Segmented.Highlight />
              </Segmented.Root>
            </Header.Bar>
          </Header.Root>
          <List.Root>
            <List.Section>
              <List.Group>
                {calls
                  .filter((call) => filter === 'all' || call[2])
                  .map(([name, kind, missed], index) => (
                    <List.Item key={index}>
                      <List.Title
                        style={
                          missed
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
        </Page.Root>
      </div>
    </Component>
  );
};

/** A map's display mode, in a bottom toolbar. */
const InToolbar: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      center
      inline
      id="segmented-composition-toolbar"
      log={log}
      title="Segmented in a toolbar"
    >
      <div className="demo-phone">
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
      </div>
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
        (<code>edge</code>), in the content layer’s place for a bar: the anchor
        is the surface, its class giving it a background.
      </li>
      <li>
        Guide <GuideLink to="section-3-clusters">§3</GuideLink>: segmented
        controls “when used to switch views”.
      </li>
      <li>
        The app holds the value (<code>value</code>, <code>onValueChange</code>)
        and renders the content for it.
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
