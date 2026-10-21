import { FunctionComponent } from 'react';

import { Contents, Heading, type Section } from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

const HIG = 'https://developer.apple.com/design/human-interface-guidelines';

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['drilling-in', 'Drilling in'],
  ['where-it-sits', 'Where it sits'],
  ['compact-and-regular', 'Compact and regular'],
  ['what-the-guide-doesnt-cover', 'What the guide doesn’t cover'],
];

/**
 * `/navigation/information-architecture`: where a navigation stack sits,
 * after the HIG-composition guide (“Apple HIG Components — Composition,
 * Shared Traits & a Re-Slicing”).
 */
export const NavigationInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog: no component of its own; its{' '}
        <a
          href={`${HIG}/navigation-and-search`}
          rel="noreferrer"
          target="_blank"
        >
          Navigation and search
        </a>{' '}
        pattern (hierarchical navigation), rendered by navigation bars (
        <a href="toolbar">Toolbar</a>, <a href="header">Header</a>).
      </li>
      <li>
        As the guide’s moves (
        <GuideLink to="section-7-2">HIG composition guide</GuideLink>): the
        Drill move’s stack, Back its way up.
      </li>
    </ul>

    <Heading
      id="drilling-in"
      level={2}
    >
      Drilling in
    </Heading>
    <ul>
      <li>
        Drill: going one level deeper, a Collection’s selection opening the next
        Surface (guide, <GuideLink to="move-drill">§7.2</GuideLink>); on iPhone,
        a navigation stack’s push.
      </li>
      <li>
        Each page: a Surface with a Region at its top (the bar: back, the title,
        its commands) and its Collection (rows drilling further).
      </li>
      <li>
        Not for detours (a self-contained task returning where it started, guide{' '}
        <GuideLink to="move-detour">Detour</GuideLink>): those are modal (a{' '}
        <a href="sheet">Sheet</a>).
      </li>
    </ul>

    <Heading
      id="where-it-sits"
      level={2}
    >
      Where it sits
    </Heading>
    <ul>
      <li>
        <strong>A tabbed stack</strong> (guide{' '}
        <GuideLink to="shell-a">§7.4, shell A</GuideLink>): each tab holds its
        own Drill stack (see{' '}
        <a href="navigation/composition#a-stack-per-tab">Composition</a>).
      </li>
      <li>
        <strong>Sidebar and split</strong> (guide{' '}
        <GuideLink to="shell-b">shell B</GuideLink>): the stack in the content
        column, the sidebar switching sections.
      </li>
      <li>
        <strong>A single stack</strong> (guide{' '}
        <GuideLink to="shell-c">shell C</GuideLink>): Settings-like utilities,
        no section switcher.
      </li>
    </ul>

    <Heading
      id="compact-and-regular"
      level={2}
    >
      Compact and regular
    </Heading>
    <ul>
      <li>
        The guide: a sidebar and split collapse to shell A in compact width, the
        sidebar’s top level becoming a root list (or tabs), columns stack
        levels; the same sections and stacks, re-rendered, not re-conceived
        (guide <GuideLink to="rule-g4">G4</GuideLink>).
      </li>
      <li>
        Here, the app decides by the width (see{' '}
        <a href="navigation/composition#compact-or-regular">Composition</a>),
        the state (the section, its stack) kept across.
      </li>
    </ul>

    <Heading
      id="what-the-guide-doesnt-cover"
      level={2}
    >
      What the guide doesn’t cover
    </Heading>
    <ul>
      <li>
        The transition’s mechanics: pushed and popped by the stack’s keys, each
        page with its bar, swiping back from the leading edge.
      </li>
      <li>
        Keeping pages under the top one alive (their state, their scroll
        positions), and what’s exposed to assistive technology meanwhile (the
        top page only).
      </li>
    </ul>
  </>
);
