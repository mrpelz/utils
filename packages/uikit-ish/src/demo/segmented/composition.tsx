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
} from '../../components/index.js';
import { GuideLink } from '../hig-guide/link.js';
import { CodeView } from '../utils/code-view.js';
import { AddLog, useLog } from '../utils/log.js';
import { Component } from '../utils/main.js';
import { Contents, type Section } from '../utils/sections.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const contentCode = `const [period, setPeriod] = useState('day');

<Segmented.Root
  aria-label="Period"
  value={period}
  onValueChange={setPeriod}
>
  <Segmented.Item value="day">Day</Segmented.Item>
  <Segmented.Item value="week">Week</Segmented.Item>
  <Segmented.Item value="month">Month</Segmented.Item>
  <Segmented.Highlight />
</Segmented.Root>
<List.Root>…{/* the period's figures */}</List.Root>`;

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

const toolbarCode = `<Toolbar.Root>
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
</Toolbar.Root>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

// A period's figures (as Health's).
const figures: Record<string, readonly (readonly [string, string])[]> = {
  day: [
    ['Steps', '8,412'],
    ['Distance', '6.1 km'],
    ['Flights Climbed', '9'],
  ],
  month: [
    ['Steps', '7,215 a day'],
    ['Distance', '5.2 km a day'],
    ['Flights Climbed', '7 a day'],
  ],
  week: [
    ['Steps', '7,903 a day'],
    ['Distance', '5.7 km a day'],
    ['Flights Climbed', '8 a day'],
  ],
};

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

/** A period's figures, chosen above them. */
const ContentViews: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [period, setPeriod] = useState('day');

  return (
    <Component
      center
      inline
      id="segmented-composition-content"
      log={log}
      title="Segmented switching content"
    >
      <div className="segmented-demo-content">
        <Segmented.Root
          aria-label="Period"
          value={period}
          onValueChange={logChange(addLog, setPeriod)}
        >
          <Segmented.Item value="day">Day</Segmented.Item>
          <Segmented.Item value="week">Week</Segmented.Item>
          <Segmented.Item value="month">Month</Segmented.Item>
          <Segmented.Highlight />
        </Segmented.Root>
        <List.Root>
          <List.Section>
            <List.Group>
              {figures[period]?.map(([title, value]) => (
                <List.Item key={title}>
                  <List.Title>{title}</List.Title>
                  <List.Detail>{value}</List.Detail>
                </List.Item>
              ))}
            </List.Group>
          </List.Section>
        </List.Root>
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
      <Page.Root className="segmented-demo-screen">
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
    </Component>
  );
};

/** A map's display mode, in a bottom toolbar. */
const InToolbar: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      inline
      stretch
      id="segmented-composition-toolbar"
      log={log}
      title="Segmented in a toolbar"
    >
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
    <h2 id="switching-a-view-s-content">Switching a view’s content</h2>
    <ul>
      <li>
        Above the content it filters or rearranges, e.g. a chart’s period, its
        figures changing with it.
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

    <h2 id="in-a-navigation-bar">In a navigation bar</h2>
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

    <h2 id="in-a-toolbar">In a toolbar</h2>
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

    <h2 id="in-forms">In forms</h2>
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
