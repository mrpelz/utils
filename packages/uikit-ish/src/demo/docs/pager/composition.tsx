import './style.css';

import { FunctionComponent, useMemo, useState } from 'react';

import {
  Page,
  PageControl,
  Pager,
  Stack,
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
import { steps } from './content.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in a code sample, not interpolations */
const dotsCode = `const [page, setPage] = useState(0);

<Viewport.Content>
  <Page.Root fill>
    <Pager.Root aria-label="Onboarding" value={page} onValueChange={setPage}>
      {steps.map(([title, text]) => (
        <Pager.Page key={title}>…</Pager.Page>
      ))}
    </Pager.Root>
  </Page.Root>
</Viewport.Content>
<Viewport.BlockEnd>
  <Toolbar.Root>
    <Toolbar.Spacer />
    <PageControl
      aria-label="Onboarding"
      count={steps.length}
      value={page}
      onValueChange={setPage}
    />
    <Toolbar.Spacer />
  </Toolbar.Root>
</Viewport.BlockEnd>`;

const inlineCode = `const [page, setPage] = useState(0);

<Stack align="center" spacing="medium">
  <div className="frame">{/* its size, its corners */}
    <Pager.Root aria-label="Onboarding" value={page} onValueChange={setPage}>
      …
    </Pager.Root>
  </div>
  <PageControl
    aria-label="Onboarding"
    count={steps.length}
    value={page}
    variant="plain"
    onValueChange={setPage}
  />
</Stack>`;

const verticalCode = `const [page, setPage] = useState(0);

<Viewport.Content>
  <Page.Root fill>
    <Pager.Root
      aria-label="Stories"
      orientation="vertical"
      value={page}
      onValueChange={setPage}
    >
      …
    </Pager.Root>
  </Page.Root>
</Viewport.Content>
<Viewport.Anchor edge="inline-end">
  <Toolbar.Root orientation="vertical">
    <Toolbar.Spacer />
    <PageControl
      aria-label="Stories"
      count={steps.length}
      orientation="vertical"
      value={page}
      onValueChange={setPage}
    />
  </Toolbar.Root>
</Viewport.Anchor>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** Onboarding, filling a phone: the dots in the toolbar at the bottom. */
const WithPageControlDots: FunctionComponent = () => {
  const id = 'pager-composition-dots';
  const [log, addLog] = useLog();
  const [page, setPage] = useState(0);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Page.Root': ['fill'],
            PageControl: ['aria-label', 'count', 'onValueChange', 'value'],
            'Pager.Page': [],
            'Pager.Root': ['aria-label', 'onValueChange', 'value'],
            'Toolbar.Root': [],
            'Viewport.BlockEnd': [],
            'Viewport.Content': [],
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
      controls={[partControls]}
      id={id}
      log={log}
      stage="phone"
      state={[partState]}
      title="Pager with page control dots"
    >
      <>
        <Viewport.Content {...partProps['Viewport.Content']}>
          <Page.Root
            {...partProps['Page.Root']}
            fill
          >
            <Pager.Root
              {...partProps['Pager.Root']}
              aria-label="Onboarding"
              className="pager-demo-fill"
              value={page}
              onValueChange={(next: number, { reason }) => {
                addLog(`pager: ${String(next)} (${reason})`);
                setPage(next);
              }}
            >
              {steps.map(([title, text]) => (
                <Pager.Page
                  key={title}
                  {...partProps['Pager.Page']}
                  className="pager-demo-page"
                >
                  <h3>{title}</h3>
                  <p>{text}</p>
                </Pager.Page>
              ))}
            </Pager.Root>
          </Page.Root>
        </Viewport.Content>
        <Viewport.BlockEnd {...partProps['Viewport.BlockEnd']}>
          <Toolbar.Root {...partProps['Toolbar.Root']}>
            <Toolbar.Spacer />
            <PageControl
              {...partProps.PageControl}
              aria-label="Onboarding"
              count={steps.length}
              value={page}
              onValueChange={(next: number, { reason }) => {
                addLog(`dots: ${String(next)} (${reason})`);
                setPage(next);
              }}
            />
            <Toolbar.Spacer />
          </Toolbar.Root>
        </Viewport.BlockEnd>
      </>
    </Component>
  );
};

/** Onboarding inside a page: a framed pager, plain dots below it. */
const InsideAPage: FunctionComponent = () => {
  const id = 'pager-composition-inline';
  const [log, addLog] = useLog();
  const [page, setPage] = useState(0);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            PageControl: [
              'aria-label',
              'count',
              'onValueChange',
              'value',
              'variant',
            ],
            'Pager.Page': [],
            'Pager.Root': ['aria-label', 'onValueChange', 'value'],
            Stack: ['align', 'spacing'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[partControls]}
      id={id}
      log={log}
      state={[partState]}
      title="Pager inside a page"
    >
      <Stack
        {...partProps.Stack}
        align="center"
        spacing="medium"
      >
        <div className="pager-demo-frame">
          <Pager.Root
            {...partProps['Pager.Root']}
            aria-label="Onboarding"
            value={page}
            onValueChange={(next: number, { reason }) => {
              addLog(`pager: ${String(next)} (${reason})`);
              setPage(next);
            }}
          >
            {steps.map(([title, text]) => (
              <Pager.Page
                key={title}
                {...partProps['Pager.Page']}
                className="pager-demo-page"
              >
                <h3>{title}</h3>
                <p>{text}</p>
              </Pager.Page>
            ))}
          </Pager.Root>
        </div>
        <PageControl
          {...partProps.PageControl}
          aria-label="Onboarding"
          count={steps.length}
          value={page}
          variant="plain"
          onValueChange={(next: number, { reason }) => {
            addLog(`dots: ${String(next)} (${reason})`);
            setPage(next);
          }}
        />
      </Stack>
    </Component>
  );
};

/** Stories, filling a phone, swiped up and down: the dots in a corner. */
const Vertical: FunctionComponent = () => {
  const id = 'pager-composition-vertical';
  const [log, addLog] = useLog();
  const [page, setPage] = useState(0);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Page.Root': ['fill'],
            PageControl: [
              'aria-label',
              'count',
              'onValueChange',
              'orientation',
              'value',
            ],
            'Pager.Page': [],
            'Pager.Root': [
              'aria-label',
              'onValueChange',
              'orientation',
              'value',
            ],
            'Toolbar.Root': ['orientation'],
            'Viewport.Anchor': ['edge'],
            'Viewport.Content': [],
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
      controls={[partControls]}
      id={id}
      log={log}
      stage="phone"
      state={[partState]}
      title="Vertical pager"
    >
      <>
        <Viewport.Content {...partProps['Viewport.Content']}>
          <Page.Root
            {...partProps['Page.Root']}
            fill
          >
            <Pager.Root
              {...partProps['Pager.Root']}
              aria-label="Stories"
              className="pager-demo-fill"
              orientation="vertical"
              value={page}
              onValueChange={(next: number, { reason }) => {
                addLog(`pager: ${String(next)} (${reason})`);
                setPage(next);
              }}
            >
              {steps.map(([title, text]) => (
                <Pager.Page
                  key={title}
                  {...partProps['Pager.Page']}
                  className="pager-demo-page"
                >
                  <h3>{title}</h3>
                  <p>{text}</p>
                </Pager.Page>
              ))}
            </Pager.Root>
          </Page.Root>
        </Viewport.Content>
        <Viewport.Anchor
          {...partProps['Viewport.Anchor']}
          edge="inline-end"
        >
          <Toolbar.Root
            {...partProps['Toolbar.Root']}
            orientation="vertical"
          >
            <Toolbar.Spacer />
            <PageControl
              {...partProps.PageControl}
              aria-label="Stories"
              count={steps.length}
              orientation="vertical"
              value={page}
              onValueChange={(next: number, { reason }) => {
                addLog(`dots: ${String(next)} (${reason})`);
                setPage(next);
              }}
            />
          </Toolbar.Root>
        </Viewport.Anchor>
      </>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['with-page-control-dots', 'With page control dots'],
  ['inside-a-page', 'Inside a page'],
  ['vertical', 'Vertical'],
];

/** `/pager/composition`: pagers with page controls, filling or framed. */
export const PagerComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <Heading
      id="with-page-control-dots"
      level={2}
    >
      With page control dots
    </Heading>
    <ul>
      <li>
        Onboarding that fills the screen, with a{' '}
        <a href={publicUrl('page-control')}>Page Control</a> between the{' '}
        <a href={publicUrl('toolbar')}>Toolbar</a>’s spacers at the bottom.
      </li>
      <li>
        Both share one page (<code>value</code>, <code>onValueChange</code>).
        The dots follow the swipe, and the pager scrolls to the page the dots
        pick after a press, a drag or a key.
      </li>
      <li>
        <strong>Library:</strong> the pages that snap (
        <PartLink
          component="pager"
          part="Pager.Root"
        />
        ,{' '}
        <PartLink
          component="pager"
          part="Pager.Page"
        />
        ), the dots (
        <PartLink
          component="page-control"
          part="PageControl"
        />
        ), the bar and the page that fills the screen (
        <PartLink
          component="page"
          part="Page.Root"
        />{' '}
        with <code>fill</code>).
      </li>
      <li>
        <strong>Demo:</strong> the page (the app’s state) and the steps.
      </li>
    </ul>
    <CodeView code={dotsCode} />
    <WithPageControlDots />

    <Heading
      id="inside-a-page"
      level={2}
    >
      Inside a page
    </Heading>
    <ul>
      <li>
        A pager in a frame among a page’s content, with plain dots below it in a{' '}
        <a href={publicUrl('stack')}>Stack</a>.
      </li>
      <li>
        It’s as wide as the frame, and as high as the frame lets it be. Swiping
        past its ends doesn’t scroll the page around it.
      </li>
      <li>
        <strong>Library:</strong> the pager, the plain dots (
        <code>variant=&quot;plain&quot;</code>) and the stack.
      </li>
      <li>
        <strong>Demo:</strong> the frame (its size, corners and background).
      </li>
    </ul>
    <CodeView code={inlineCode} />
    <InsideAPage />

    <Heading
      id="vertical"
      level={2}
    >
      Vertical
    </Heading>
    <ul>
      <li>
        Full-screen pages swiped up and down, such as stories, with a column of
        dots (<code>orientation=&quot;vertical&quot;</code> on both) in the
        bottom trailing corner.
      </li>
      <li>
        A vertical pager fills its container’s height, here a page that fills
        the screen.
      </li>
      <li>
        The dots sit at the bottom of a vertical{' '}
        <a href={publicUrl('toolbar')}>Toolbar</a>, below its spacer, in an
        anchor at the trailing edge. They’re spaced as a bottom bar’s trailing
        capsule.
      </li>
      <li>
        <strong>Library:</strong> the vertical pager, the column of dots, the
        vertical toolbar (
        <PartLink
          component="toolbar"
          part="Toolbar.Root"
        />{' '}
        with <code>orientation=&quot;vertical&quot;</code>), and the anchor at
        the trailing edge (
        <PartLink
          component="viewport"
          part="Viewport.Anchor"
        />{' '}
        with <code>edge=&quot;inline-end&quot;</code>), clear of the safe area.
      </li>
      <li>
        <strong>Demo:</strong> the stories.
      </li>
    </ul>
    <CodeView code={verticalCode} />
    <Vertical />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const pagerCompositionDemos = [
  WithPageControlDots,
  InsideAPage,
  Vertical,
];
