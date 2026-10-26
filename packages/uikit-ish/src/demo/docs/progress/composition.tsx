import '../toolbar/style.css';
import './style.css';

import { FunctionComponent, useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Button,
  Header,
  List,
  Page,
  Progress,
  Toolbar,
  Viewport,
} from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const countCode = `// The photos imported so far, of 12.
const [done, setDone] = useState(0);

<Progress.Root max={12} value={done}>
  <Progress.Label>Importing Photos</Progress.Label>
  <Progress.Value>
    {(formattedValue, value) => \`\${value} of 12\`}
  </Progress.Value>
  <Progress.Track>
    <Progress.Indicator />
  </Progress.Track>
</Progress.Root>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** An import counting photos, advancing on its own (and restarted). */
const CountingItems: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (done >= 12) return undefined;
    const timeout = setTimeout(() => setDone(done + 1), 600);
    return () => clearTimeout(timeout);
  }, [done]);

  return (
    <Component
      isCentered
      isInline
      baseUiId="progress"
      id="progress-composition-count"
      log={log}
      title="Progress counting items"
    >
      <div className="progress-demo-stage">
        <Progress.Root
          max={12}
          value={done}
        >
          <Progress.Label>Importing Photos</Progress.Label>
          <Progress.Value>
            {(formattedValue: string | null, value: number | null) =>
              `${String(value)} of 12`
            }
          </Progress.Value>
          <Progress.Track>
            <Progress.Indicator />
          </Progress.Track>
        </Progress.Root>
        <Button.Root
          variant="bordered"
          onClick={() => {
            addLog('restart clicked');
            setDone(0);
          }}
        >
          <Button.Label>Restart</Button.Label>
        </Button.Root>
      </div>
    </Component>
  );
};

/** Settings' update check: a row's spinner, while it searches. */
const InAListRow: FunctionComponent = () => (
  <Component
    isCentered
    isInline
    baseUiId="progress"
    id="progress-composition-row"
    title="Activity indicator in a list row"
  >
    <List.Root className="progress-demo-list">
      <List.Section>
        <List.Group>
          <List.Item>
            <List.Title>Software Update</List.Title>
            <List.Detail>
              <ActivityIndicator
                aria-label="Checking for Update"
                size="small"
              />
            </List.Detail>
          </List.Item>
        </List.Group>
      </List.Section>
    </List.Root>
  </Component>
);

/** A page's content loading: its spinner, labeled, in its middle. */
const LoadingAPage: FunctionComponent = () => (
  <Component
    isInline
    baseUiId="progress"
    id="progress-composition-page"
    stage="phone"
    title="Activity indicator loading a page"
  >
    <Viewport.Content safeArea="none">
      <Header.Root>
        <Viewport.BlockStart>
          <Toolbar.Root placement="block-start">
            <Toolbar.Title>
              <span>Mailboxes</span>
            </Toolbar.Title>
          </Toolbar.Root>
        </Viewport.BlockStart>
        <Page.Root>
          <Viewport.Padding edge="block-start" />
          <div className="progress-demo-loading">
            <ActivityIndicator>Loading</ActivityIndicator>
          </div>
          <Viewport.Padding edge="block-end" />
        </Page.Root>
      </Header.Root>
    </Viewport.Content>
  </Component>
);

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['counting-items', 'Counting items'],
  ['in-a-list-row', 'In a list row'],
  ['loading-a-page', 'Loading a page'],
];

/** `/progress/composition`: progress where the work happens. */
export const ProgressComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />

    <Heading
      id="counting-items"
      level={2}
    >
      Counting items
    </Heading>
    <ul>
      <li>
        Of items, not a percentage: <code>max</code> the count, the value told
        by{' '}
        <PartLink
          component="progress"
          part="Progress.Value"
        />
        ’s function (“5 of 12”).
      </li>
      <li>
        The app sets <code>value</code> as the work advances; the fill grows to
        it.
      </li>
    </ul>
    <CodeView code={countCode} />
    <CountingItems />

    <Heading
      id="in-a-list-row"
      level={2}
    >
      In a list row
    </Heading>
    <ul>
      <li>
        Status attaches to the narrowest scope it describes (guide{' '}
        <GuideLink to="status-by-scope">G8</GuideLink>): an item’s, in its row
        (“row spinner”).
      </li>
      <li>
        A small activity indicator (<code>size</code>) in the{' '}
        <a href="list">List</a> row’s detail, named (<code>aria-label</code>).
      </li>
    </ul>
    <InAListRow />

    <Heading
      id="loading-a-page"
      level={2}
    >
      Loading a page
    </Heading>
    <ul>
      <li>
        A view’s status, in its content (guide{' '}
        <GuideLink to="status-by-scope">G8</GuideLink>): the bar stays, the
        content shows the spinner while it loads.
      </li>
      <li>Labeled by its children (“Loading”).</li>
    </ul>
    <LoadingAPage />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const progressCompositionDemos = [
  CountingItems,
  InAListRow,
  LoadingAPage,
];
