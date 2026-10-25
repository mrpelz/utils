import './style.css';

import { FunctionComponent, useState } from 'react';

import { PageControl } from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { useLabelledRef } from '../../tooling/frame/render-code.js';
import {
  Contents,
  Heading,
  type Section,
} from '../../tooling/guide/sections.js';

// The toolbar's code (as Weather's, see the toolbar's composition).
/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in a code sample, not interpolations */
const toolbarCode = `const [page, setPage] = useState(0);

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
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

const steps = [
  ['Welcome', 'Swipe through, or press the dots.'],
  ['Your pages', 'A page per screen, snapping into place.'],
  ['The dots', 'They follow the swipe, and move it.'],
  ['Done', 'The last page: nothing beyond it.'],
] as const;

/** Onboarding screens: a page per width, the dots below them. */
const OverPagedContent: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [page, setPage] = useState(0);
  const pagesRef = useLabelledRef<HTMLDivElement>('pagesRef');

  return (
    <Component
      isCentered
      isInline
      id="page-control-composition-paged"
      log={log}
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
  const [log, addLog] = useLog();

  return (
    <Component
      isCentered
      isInline
      id="page-control-composition-tooltip"
      log={log}
      title="Page control with a momentary tooltip"
    >
      <PageControl
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
        Its glass variant, between a <a href="toolbar">Toolbar</a>’s capsules
        (Weather’s cities): it takes the bar’s glass <code>context</code>.
      </li>
      <li>
        Controlled by the app’s page (<code>value</code>,{' '}
        <code>onValueChange</code>), which the content shows.
      </li>
      <li>
        Live: the toolbar’s{' '}
        <a href="toolbar/composition#controls-between-the-capsules">
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
        Its plain variant, below pages that swipe (a scroller snapping a page
        per width), e.g. onboarding screens.
      </li>
      <li>
        The scroller sets the page (<code>onScroll</code>); the dots scroll to
        theirs (<code>onValueChange</code>): a press, a drag or a key.
      </li>
      <li>The pages swipe themselves: the dots are a small target.</li>
    </ul>
    <OverPagedContent />

    <Heading
      id="with-a-momentary-tooltip"
      level={2}
    >
      With a momentary tooltip
    </Heading>
    <ul>
      <li>
        Many pages (more than 7: a window of 8 dots) don’t tell which page this
        is: <code>momentaryTooltip</code> shows it above the dots while they’re
        hovered, pressed or focused by keyboard.
      </li>
      <li>
        <code>format</code> words it (“Photo 3 of 24”), also its accessible
        value.
      </li>
    </ul>
    <WithATooltip />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const pageControlCompositionDemos = [OverPagedContent, WithATooltip];
