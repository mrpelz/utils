import { FunctionComponent } from 'react';

import { PageControl } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { pageControlRows } from './docs.js';
import { propOptionsOverview } from './props.js';

/** The page control on its own, with a few of its props. */
const LiveView: FunctionComponent = () => {
  const id = 'page-control-overview';
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    propOptionsOverview,
    { external, isOpen: true, title: 'PageControl' },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      state={[state]}
      title="Page control"
    >
      <PageControl
        key={elementKey}
        {...props}
      />
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

/** `/page-control`: what a page control is for, and its props. */
export const PageControlOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>Dots for a row of pages, with the current one highlighted.</li>
      <li>It moves to the previous or next page, or scrubs across them.</li>
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
        For a flat sequence of pages of the same kind, swiped through one at a
        time, such as a weather app’s cities, an onboarding’s screens or a
        document’s pages.
      </li>
      <li>
        For a handful of pages (about ten at most). It shows where you are, not
        what’s on the pages.
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
        Sections of an app, each with its own content: use a{' '}
        <a href={publicUrl('tab-bar')}>Tab Bar</a>.
      </li>
      <li>
        Named views of the same content: use a{' '}
        <a href={publicUrl('segmented')}>Segmented</a> control.
      </li>
      <li>
        Many items, or items picked by name: use a{' '}
        <a href={publicUrl('list')}>List</a>.
      </li>
      <li>
        Going deeper into an item: use a{' '}
        <a href={publicUrl('navigation')}>Navigation</a>.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most page controls set.</li>
      <li>
        All its props are on the{' '}
        <a href={publicUrl('page-control/parts')}>Parts</a> page.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        [
          'PageControl',
          pickRows(
            pageControlRows,
            'count',
            'value',
            'onValueChange',
            'variant',
            'momentaryTooltip',
          ),
        ],
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
        It has the <code>slider</code> role, as an adjustable control. Its value
        is the current page, from 1 to <code>count</code>, read as “3 of 8” (
        <code>format</code>).
      </li>
      <li>
        It’s named “Page” unless given an <code>aria-label</code>. Name it for
        what its pages are (for example “Cities”).
      </li>
      <li>
        Tab focuses it. The arrow keys go to the previous or next page (Left and
        Right follow the reading direction), and Home and End go to the first
        and last.
      </li>
      <li>
        Its dots are small. It’s an indicator first, so the pages themselves
        should swipe too (see{' '}
        <a href={publicUrl('page-control/composition')}>Composition</a>).
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
        A press before or after the current dot goes to the previous or next
        page.
      </li>
      <li>Dragging along it scrubs, one page per dot passed.</li>
      <li>
        With more than 7 pages, 8 dots show at a time. The outer two shrink
        where there are more pages beyond, and the window moves as the current
        page gets close to them.
      </li>
      <li>
        With <code>momentaryTooltip</code>, the current page shows above it
        while it’s hovered, pressed or focused by keyboard.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const pageControlOverviewDemos = [LiveView];
