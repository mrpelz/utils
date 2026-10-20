import { FunctionComponent } from 'react';

import { Contents, Heading, type Section } from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

const HIG = 'https://developer.apple.com/design/human-interface-guidelines';

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['a-surface', 'A Surface'],
  ['where-it-sits', 'Where it sits'],
  ['what-the-guide-doesnt-cover', 'What the guide doesn’t cover'],
];

/**
 * `/page/information-architecture`: where a page sits, after the
 * HIG-composition guide (“Apple HIG Components — Composition, Shared
 * Traits & a Re-Slicing”).
 */
export const PageInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog: no component; a screen’s content, laid out by its{' '}
        <a
          href={`${HIG}/layout`}
          rel="noreferrer"
          target="_blank"
        >
          Layout
        </a>{' '}
        page (and scrolling, by{' '}
        <a
          href={`${HIG}/scroll-views`}
          rel="noreferrer"
          target="_blank"
        >
          Scroll views
        </a>
        ).
      </li>
      <li>
        As primitives (
        <GuideLink to="section-5-mapping">HIG composition guide</GuideLink>): a
        Surface, holding Regions and a Collection.
      </li>
    </ul>

    <Heading
      id="a-surface"
      level={2}
    >
      A Surface
    </Heading>
    <ul>
      <li>
        Surface: a bounded plane that hosts content (guide,{' '}
        <GuideLink to="primitive-surface">§5</GuideLink>); a page is one, its
        scrolling its own (scroll views: a behavior of Surfaces and Collections,
        guide <GuideLink to="section-5-mapping">§5, the mapping</GuideLink>).
      </li>
      <li>
        It holds Regions and a Collection (guide,{' '}
        <GuideLink to="section-6-containment">§6</GuideLink>): its header, its
        lists.
      </li>
      <li>
        On the content layer, beneath glass (guide{' '}
        <GuideLink to="rule-g9">G9</GuideLink>, the{' '}
        <GuideLink to="layers">layers</GuideLink>): its background plain or
        grouped, not glass.
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
        <strong>A stack:</strong> one per level of the Drill move (guide{' '}
        <GuideLink to="move-drill">§7.2</GuideLink>), in a{' '}
        <a href="navigation">Navigation</a>.
      </li>
      <li>
        <strong>A split:</strong> one per column (guide{' '}
        <GuideLink to="shell-b">§7.4, shell B</GuideLink>), in a{' '}
        <a href="layout">Layout</a>.
      </li>
      <li>
        <strong>A tab:</strong> each tab’s root (guide{' '}
        <GuideLink to="shell-a">shell A</GuideLink>).
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
        The background’s choice by its content (grouped lists on the grouped
        background).
      </li>
      <li>
        Its content inset beside a floating column, its background running
        underneath.
      </li>
    </ul>
  </>
);
