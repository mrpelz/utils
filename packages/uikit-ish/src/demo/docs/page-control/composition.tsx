import './style.css';

import { FunctionComponent, useMemo, useState } from 'react';

import { PageControl } from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePartControls } from '../../tooling/frame/prop-control.js';
import { useLabelledRef } from '../../tooling/frame/render-code.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';

// The toolbar's code (as Weather's, see the toolbar's composition).
/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in a code sample, not interpolations */
const toolbarCode = `const cities = ['Berlin', 'Lisbon', 'Tokyo'];
const [page, setPage] = useState(0);

<Viewport.Content>…{/* the page */}</Viewport.Content>
<Viewport.BlockEnd>
  <Toolbar.Root>
    <Toolbar.Leading>…</Toolbar.Leading>
    <PageControl
      aria-label="Cities"
      count={cities.length}
      value={page}
      onValueChange={setPage}
    />
    <Toolbar.Trailing>…</Toolbar.Trailing>
  </Toolbar.Root>
</Viewport.BlockEnd>`;

const pagedCode = `const steps = [
  ['Welcome', 'Swipe through, or press the dots.'],
  ['Your pages', 'A page per screen, snapping into place.'],
  …
];
const [page, setPage] = useState(0);
const pagesRef = useRef<HTMLDivElement>(null);

<div
  ref={pagesRef}
  className="pages" // scroll-snap, a page per width
  onScroll={({ currentTarget }) =>
    setPage(
      Math.round(
        Math.abs(currentTarget.scrollLeft) / currentTarget.clientWidth,
      ),
    )
  }
>
  {steps.map(([title, text]) => (
    <section key={title}>…</section>
  ))}
</div>
<PageControl
  aria-label="Onboarding"
  count={steps.length}
  value={page}
  variant="plain"
  onValueChange={(next) =>
    pagesRef.current?.children[next]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    })
  }
/>`;

const tooltipCode = `<PageControl
  momentaryTooltip
  aria-label="Photos"
  count={24}
  format={(page, count) => \`Photo \${page + 1} of \${count}\`}
/>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** Onboarding steps, a page each (also the kitchen sink's). */
export const steps = [
  ['Welcome', 'Swipe through, or press the dots.'],
  ['Your pages', 'A page per screen, snapping into place.'],
  ['The dots', 'They follow the swipe, and move it.'],
  ['Done', 'The last page: nothing beyond it.'],
] as const;

/** Onboarding screens: a page per width, the dots below them. */
const OverPagedContent: FunctionComponent = () => {
  const id = 'page-control-composition-paged';
  const [log, addLog] = useLog();
  const [page, setPage] = useState(0);
  const pagesRef = useLabelledRef<HTMLDivElement>('pagesRef', 'HTMLDivElement');

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
      title="Page control over paged content"
    >
      <div className="page-control-demo-paged">
        <div
          ref={pagesRef}
          className="page-control-demo-pages"
          onScroll={({ currentTarget }) =>
            setPage(
              Math.round(
                Math.abs(currentTarget.scrollLeft) / currentTarget.clientWidth,
              ),
            )
          }
        >
          {steps.map(([title, text]) => (
            <section
              key={title}
              className="page-control-demo-page"
            >
              <h3>{title}</h3>
              <p>{text}</p>
            </section>
          ))}
        </div>
        <PageControl
          {...partProps.PageControl}
          aria-label="Onboarding"
          count={steps.length}
          value={page}
          variant="plain"
          onValueChange={(next: number, { reason }) => {
            addLog(`page: ${String(next)} (${reason})`);
            pagesRef.current?.children[next]?.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
              inline: 'start',
            });
          }}
        />
      </div>
    </Component>
  );
};

/** Many pages: the current one told in a tooltip while it's operated. */
const WithATooltip: FunctionComponent = () => {
  const id = 'page-control-composition-tooltip';
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            PageControl: [
              'aria-label',
              'count',
              'format',
              'momentaryTooltip',
              'onValueChange',
            ],
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
      title="Page control with a momentary tooltip"
    >
      <PageControl
        {...partProps.PageControl}
        momentaryTooltip
        aria-label="Photos"
        count={24}
        format={(page: number, count: number) =>
          `Photo ${String(page + 1)} of ${String(count)}`
        }
        onValueChange={(next: number) => addLog(`page: ${String(next)}`)}
      />
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['in-a-toolbar', 'In a toolbar'],
  ['over-paged-content', 'Over paged content'],
  ['with-a-momentary-tooltip', 'With a momentary tooltip'],
];

/** `/page-control/composition`: page controls with bars and pages. */
export const PageControlComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <Heading
      id="in-a-toolbar"
      level={2}
    >
      In a toolbar
    </Heading>
    <ul>
      <li>
        Its glass variant sits between a{' '}
        <a href={publicUrl('toolbar')}>Toolbar</a>’s capsules, as for a weather
        app’s cities, and takes the bar’s glass <code>context</code>.
      </li>
      <li>
        The app’s page controls it (<code>value</code>,{' '}
        <code>onValueChange</code>), and the content shows that page.
      </li>
      <li>
        To see it live, go to the toolbar’s{' '}
        <a
          href={publicUrl('toolbar/composition#controls-between-the-capsules')}
        >
          controls between the capsules
        </a>
        .
      </li>
    </ul>
    <CodeView code={toolbarCode} />

    <Heading
      id="over-paged-content"
      level={2}
    >
      Over paged content
    </Heading>
    <ul>
      <li>
        Its plain variant sits below pages that swipe, such as onboarding
        screens: a scroller that snaps one page per width.
      </li>
      <li>
        The scroller sets the page (<code>onScroll</code>). The dots scroll to
        their page (<code>onValueChange</code>) after a press, a drag or a key.
      </li>
      <li>
        The pages swipe on their own, because the dots are a small target.
      </li>
      <li>
        <strong>Library:</strong> the dots (
        <PartLink
          component="page-control"
          part="PageControl"
        />
        ), which can be pressed, dragged or keyed (<code>onValueChange</code>).
      </li>
      <li>
        <strong>Demo:</strong> the page (the app’s state), the snapping scroller
        that sets it, and scrolling to the page the dots pick.
      </li>
    </ul>
    <CodeView code={pagedCode} />
    <OverPagedContent />

    <Heading
      id="with-a-momentary-tooltip"
      level={2}
    >
      With a momentary tooltip
    </Heading>
    <ul>
      <li>
        With many pages (more than 7, so a window of 8 dots), the dots don’t
        tell which page this is. <code>momentaryTooltip</code> shows it above
        the dots while they’re hovered, pressed or focused by keyboard.
      </li>
      <li>
        <code>format</code> sets the wording (“Photo 3 of 24”), which is also
        its accessible value.
      </li>
      <li>
        <strong>Library:</strong> the momentary tooltip (
        <code>momentaryTooltip</code>) and its wording (<code>format</code>).
      </li>
      <li>
        <strong>Demo:</strong> the number of photos.
      </li>
    </ul>
    <CodeView code={tooltipCode} />
    <WithATooltip />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const pageControlCompositionDemos = [OverPagedContent, WithATooltip];
