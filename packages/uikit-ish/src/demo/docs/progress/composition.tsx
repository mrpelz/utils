import '../toolbar/style.css';
import './style.css';

import { FunctionComponent, useEffect, useMemo, useState } from 'react';

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
import { usePartControls } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';

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
const listRowCode = `<List.Item>
  <List.Content>
    <List.Title>Software Update</List.Title>
  </List.Content>
  <List.Trailing>
    {/* In the row it's about, named. */}
    <List.Detail>
      <ActivityIndicator
        aria-label="Checking for Update"
        size="small"
      />
    </List.Detail>
  </List.Trailing>
</List.Item>`;

const pageCode = `<Header.Root>
  <Viewport.BlockStart>
    <Toolbar.Root placement="block-start">…</Toolbar.Root>
  </Viewport.BlockStart>
  <Page.Root>
    <Viewport.Padding edge="block-start" />
    {/* In the content, labeled by its children. */}
    <ActivityIndicator>Loading</ActivityIndicator>
    <Viewport.Padding edge="block-end" />
  </Page.Root>
</Header.Root>`;
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Label': [],
            'Button.Root': ['onClick', 'variant'],
            'Progress.Indicator': [],
            'Progress.Label': [],
            'Progress.Root': ['max', 'value'],
            'Progress.Track': [],
            'Progress.Value': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('progress-composition-count') },
  );

  return (
    <Component
      isCentered
      isInline
      baseUiId="progress"
      controls={[partControls]}
      id="progress-composition-count"
      log={log}
      state={[partState]}
      title="Progress counting items"
    >
      <div className="progress-demo-stage">
        <Progress.Root
          {...partProps['Progress.Root']}
          max={12}
          value={done}
        >
          <Progress.Label {...partProps['Progress.Label']}>
            Importing Photos
          </Progress.Label>
          <Progress.Value {...partProps['Progress.Value']}>
            {(formattedValue: string | null, value: number | null) =>
              `${String(value)} of 12`
            }
          </Progress.Value>
          <Progress.Track {...partProps['Progress.Track']}>
            <Progress.Indicator {...partProps['Progress.Indicator']} />
          </Progress.Track>
        </Progress.Root>
        <Button.Root
          {...partProps['Button.Root']}
          variant="bordered"
          onClick={() => {
            addLog('restart clicked');
            setDone(0);
          }}
        >
          <Button.Label {...partProps['Button.Label']}>Restart</Button.Label>
        </Button.Root>
      </div>
    </Component>
  );
};

/** Settings' update check: a row's spinner, while it searches. */
const InAListRow: FunctionComponent = () => {
  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          ActivityIndicator: ['aria-label', 'for', 'size'],
          'List.Content': [],
          'List.Detail': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': ['className'],
          'List.Section': [],
          'List.Title': [],
          'List.Trailing': [],
        }),
      [],
    ),
    { provided: useProvidedState('progress-composition-row') },
  );
  return (
    <Component
      isCentered
      isInline
      baseUiId="progress"
      controls={[partControls]}
      id="progress-composition-row"
      state={[partState]}
      title="Activity indicator in a list row"
    >
      <List.Root
        {...partProps['List.Root']}
        className="progress-demo-list"
      >
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>
                  Software Update
                </List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Detail {...partProps['List.Detail']}>
                  <ActivityIndicator
                    {...partProps.ActivityIndicator}
                    aria-label="Checking for Update"
                    size="small"
                  />
                </List.Detail>
              </List.Trailing>
            </List.Item>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** A page's content loading: its spinner, labeled, in its middle. */
const LoadingAPage: FunctionComponent = () => {
  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          ActivityIndicator: [],
          'Page.Root': [],
          'Toolbar.Root': ['placement'],
          'Toolbar.Title': [],
          'Viewport.BlockStart': [],
          'Viewport.Content': [],
          'Viewport.Padding': ['edge'],
        }),
      [],
    ),
    { provided: useProvidedState('progress-composition-page') },
  );
  return (
    <Component
      isInline
      baseUiId="progress"
      controls={[partControls]}
      id="progress-composition-page"
      stage="phone"
      state={[partState]}
      title="Activity indicator loading a page"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Header.Root>
          <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
            <Toolbar.Root
              {...partProps['Toolbar.Root']}
              placement="block-start"
            >
              <Toolbar.Title {...partProps['Toolbar.Title']}>
                <span>Mailboxes</span>
              </Toolbar.Title>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root {...partProps['Page.Root']}>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-start"
            />
            <div className="progress-demo-loading">
              <ActivityIndicator {...partProps.ActivityIndicator}>
                Loading
              </ActivityIndicator>
            </div>
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
        It counts items rather than a percentage: <code>max</code> is the count,
        and{' '}
        <PartLink
          component="progress"
          part="Progress.Value"
        />
        ’s function words the value (“5 of 12”).
      </li>
      <li>
        The app sets <code>value</code> as the work advances, and the fill grows
        to it.
      </li>
      <li>
        <strong>Library:</strong> the bar (
        <PartLink
          component="progress"
          part="Progress.Root"
        />
        , with its track, fill, label and value), and its value’s wording.
      </li>
      <li>
        <strong>Demo:</strong> advancing the count (the app’s state) as the
        “work” goes on.
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
        A status belongs to the narrowest scope it describes. For an item,
        that’s its row (a “row spinner”).
      </li>
      <li>
        A small activity indicator (<code>size</code>) sits in the{' '}
        <a href={publicUrl('list')}>List</a> row’s detail, with a name (
        <code>aria-label</code>).
      </li>
      <li>
        <strong>Library:</strong> the small{' '}
        <PartLink
          component="progress"
          part="ActivityIndicator"
        />{' '}
        (<code>size</code>) in the row’s detail.
      </li>
      <li>
        <strong>Demo:</strong> the rows, and which ones are loading.
      </li>
    </ul>
    <CodeView code={listRowCode} />
    <InAListRow />

    <Heading
      id="loading-a-page"
      level={2}
    >
      Loading a page
    </Heading>
    <ul>
      <li>
        A view’s status goes in its content: the bar stays, and the content
        shows the spinner while it loads.
      </li>
      <li>Its children label it (“Loading”).</li>
      <li>
        <strong>Library:</strong> the{' '}
        <PartLink
          component="progress"
          part="ActivityIndicator"
        />
        , labeled by its children.
      </li>
      <li>
        <strong>Demo:</strong> the page, and showing the spinner while it
        “loads”.
      </li>
    </ul>
    <CodeView code={pageCode} />
    <LoadingAPage />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const progressCompositionDemos = [
  CountingItems,
  InAListRow,
  LoadingAPage,
];
