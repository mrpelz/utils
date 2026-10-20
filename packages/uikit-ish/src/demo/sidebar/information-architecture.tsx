import { FunctionComponent } from 'react';

import { Contents, Heading, type Section } from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

const HIG = 'https://developer.apple.com/design/human-interface-guidelines';

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['a-region-holding-a-collection', 'A Region holding a Collection'],
  ['switching-sections', 'Switching sections'],
  ['compact-and-regular', 'Compact and regular'],
  ['what-the-guide-doesnt-cover', 'What the guide doesn’t cover'],
];

/**
 * `/sidebar/information-architecture`: where a sidebar sits, after the
 * HIG-composition guide (“Apple HIG Components — Composition, Shared
 * Traits & a Re-Slicing”).
 */
export const SidebarInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog:{' '}
        <a
          href={`${HIG}/sidebars`}
          rel="noreferrer"
          target="_blank"
        >
          Sidebars
        </a>{' '}
        (under Navigation and search).
      </li>
      <li>
        As primitives (
        <GuideLink to="section-5-mapping">HIG composition guide</GuideLink>): a
        Region at the leading edge holding a Collection, its rows switching
        sections.
      </li>
    </ul>

    <Heading
      id="a-region-holding-a-collection"
      level={2}
    >
      A Region holding a Collection
    </Heading>
    <ul>
      <li>
        The panel: a Region (guide,{' '}
        <GuideLink to="primitive-region">§5</GuideLink>), which absorbs the
        glass sidebar container; at the leading edge, its capacity a list’s.
      </li>
      <li>
        Its list: a Collection (guide,{' '}
        <GuideLink to="primitive-collection">§5</GuideLink>), a tree of rows
        (nested rows, collapsible sections), selecting one at a time.
      </li>
      <li>
        The selection is the list’s; the content reads it (guide{' '}
        <GuideLink to="rule-g7">G7</GuideLink>).
      </li>
    </ul>

    <Heading
      id="switching-sections"
      level={2}
    >
      Switching sections
    </Heading>
    <ul>
      <li>
        Switch: changing the top-level section (guide,{' '}
        <GuideLink to="move-switch">§7.2</GuideLink>), a sidebar’s top level as
        a tab bar’s tabs.
      </li>
      <li>
        Many sections, or user-defined ones (folders, playlists), on a large
        screen: a sidebar rather than a tab bar (guide,{' '}
        <GuideLink to="section-7-3">§7.3</GuideLink>, choosing the switcher).
      </li>
      <li>
        <strong>Sidebar and split</strong> (guide{' '}
        <GuideLink to="shell-b">§7.4, shell B</GuideLink>): the sidebar, its
        section’s content beside it (a list, a detail; a{' '}
        <a href="navigation">Navigation</a>).
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
        The guide: in compact width, shell B collapses to shell A, the sidebar’s
        top level becoming tabs or a root list; the same sections, re-rendered,
        not re-conceived (guide <GuideLink to="rule-g4">G4</GuideLink>).
      </li>
      <li>
        Here, also a drawer (Framework7’s panels; iOS has none): the sidebar
        kept, swiped in (see{' '}
        <a href="sidebar/composition#floating-or-a-drawer">Composition</a>).
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
        The panel’s own toolbar (Edit, new items) and search field: a Command
        set and a Text input inside the Region, above its Collection.
      </li>
      <li>
        Floating over the content (iPadOS 26), which runs underneath it, kept
        clear of it.
      </li>
    </ul>
  </>
);
