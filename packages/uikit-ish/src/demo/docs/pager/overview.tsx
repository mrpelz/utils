import './style.css';

import { FunctionComponent } from 'react';

import { Pager } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { pages } from './content.js';
import { pagerRootRows } from './docs.js';
import { propOptionsOverview } from './props.js';

/** Onboarding steps, swiped through: sideways, or up and down. */
const LiveView: FunctionComponent = () => {
  const id = 'pager-overview';
  const [external] = useProvidedState(id);
  const [control, props, state, key] = usePropControl(propOptionsOverview, {
    external,
    isOpen: true,
    title: 'Pager.Root',
  });

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      state={[state]}
      title="Pager"
    >
      <div className="pager-demo-frame">
        <Pager.Root
          key={key}
          aria-label="Onboarding"
          {...props}
        >
          {pages()}
        </Pager.Root>
      </div>
    </Component>
  );
};

const sections: readonly Section[] = [
  ['when-to-use-it', 'When to use it'],
  ['when-to-use-something-else', 'When to use something else'],
  ['key-props', 'Key props'],
  ['accessibility', 'Accessibility'],
  ['behavior', 'Behavior'],
];

/** `/pager`: what a pager is for, and its props. */
export const PagerOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Pages as large as the pager, side by side or one below another, swiped
        through one at a time.
      </li>
      <li>
        It snaps natively, so swiping feels like the platform’s. Its current
        page follows the swipe, ready for{' '}
        <a href={publicUrl('page-control')}>Page Control</a> dots.
      </li>
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
        For a few screens of the same kind, in an order: onboarding, a weather
        app’s cities, photos, full-screen stories (vertical).
      </li>
      <li>
        With a <a href={publicUrl('page-control')}>Page Control</a>, which shows
        where you are, and pages with a press or a drag.
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
        Going deeper into content, and back: use{' '}
        <a href={publicUrl('navigation')}>Navigation</a>.
      </li>
      <li>
        A panel that rises to a few heights: use a{' '}
        <a href={publicUrl('sheet')}>Sheet</a> with stops.
      </li>
      <li>
        Content that scrolls freely, not a page at a time: use{' '}
        <PartLink
          component="viewport"
          part="Viewport.Content"
        />{' '}
        or a scroller of your own.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most pagers set.</li>
      <li>
        All of its props are on the <a href={publicUrl('pager/parts')}>Parts</a>{' '}
        page.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        [
          'Pager.Root',
          pickRows(pagerRootRows, 'orientation', 'value', 'onValueChange'),
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
        It’s a region read as a carousel, named by its <code>aria-label</code>.
        Each page is a group read as a slide, named by its place (“2 of 5”).
      </li>
      <li>
        Pages out of view are inert, so focus and assistive technology stay on
        the current page. That changes once the pager comes to rest.
      </li>
      <li>
        Focused, the arrow keys scroll it a page at a time. Pair it with a{' '}
        <a href={publicUrl('page-control')}>Page Control</a> for a control that
        assistive technology can adjust.
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
        A fling moves one page, never more. On a computer, the mouse drags it
        too, and a trackpad swipes it.
      </li>
      <li>
        Its scrolls stay inside it: swiping past its first or last page doesn’t
        scroll the page around it.
      </li>
      <li>
        A page your app sets is scrolled to, or jumped to with motion reduced.
        While a finger holds it, or it’s still moving, it waits until it’s at
        rest.
      </li>
      <li>
        Resized or rotated, it stays on its page. In a right-to-left language, a
        horizontal pager starts at the right.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const pagerOverviewDemos = [LiveView];
