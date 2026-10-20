import { FunctionComponent } from 'react';

import { Contents, Heading, type Section } from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

const HIG = 'https://developer.apple.com/design/human-interface-guidelines';

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['a-region-at-the-top', 'A Region at the top'],
  ['where-it-sits', 'Where it sits'],
  ['what-the-guide-doesnt-cover', 'What the guide doesn’t cover'],
];

/**
 * `/header/information-architecture`: where a page's header sits, after
 * the HIG-composition guide (“Apple HIG Components — Composition, Shared
 * Traits & a Re-Slicing”).
 */
export const HeaderInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog: navigation bars, now under{' '}
        <a
          href={`${HIG}/toolbars`}
          rel="noreferrer"
          target="_blank"
        >
          Toolbars
        </a>{' '}
        (a toolbar at the top of a view, with a large title).
      </li>
      <li>
        As primitives (
        <GuideLink to="section-5-mapping">HIG composition guide</GuideLink>): a
        Region at the top edge of a page’s Surface, holding its title and
        Commands.
      </li>
    </ul>

    <Heading
      id="a-region-at-the-top"
      level={2}
    >
      A Region at the top
    </Heading>
    <ul>
      <li>
        Region (guide, <GuideLink to="primitive-region">§5</GuideLink>), which
        absorbs toolbars, navigation bars included: its edge the page’s top, its
        scroll behavior the large title’s (collapsing into the bar).
      </li>
      <li>
        Its content: the way back (the Drill move’s way up, guide{' '}
        <GuideLink to="move-drill">§7.2</GuideLink>), the page’s title, its
        Command set.
      </li>
      <li>
        The guide asks whether scrolling is a primitive, as scroll position
        drives Regions (bars shrinking; guide{' '}
        <GuideLink to="section-10">§10</GuideLink>): here, the large title’s
        scroll timeline.
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
        <strong>Containment:</strong> a Surface holds Regions and a Collection
        (guide, <GuideLink to="section-6-containment">§6</GuideLink>): a page
        holds its header and its lists.
      </li>
      <li>
        <strong>Shells:</strong> every page of a stack (guide{' '}
        <GuideLink to="shell-a">§7.4, shell A</GuideLink>: back, the title,
        commands at the top).
      </li>
      <li>
        <strong>Search:</strong> below the title, with the page’s Region (guide{' '}
        <GuideLink to="rule-a11">A11</GuideLink>).
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
        The large title’s handover to the bar (fading out, the bar’s title
        fading in), and the scroll edge effect beneath the bar.
      </li>
      <li>
        A bar’s glass over the page’s own pictures (<code>adaptive</code>).
      </li>
    </ul>
  </>
);
