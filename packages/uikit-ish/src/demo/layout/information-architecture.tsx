import { FunctionComponent } from 'react';

import { Contents, Heading, type Section } from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

const HIG = 'https://developer.apple.com/design/human-interface-guidelines';

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['a-surface-laid-out-as-a-split', 'A Surface laid out as a split'],
  ['compact-and-regular', 'Compact and regular'],
  ['what-the-guide-doesnt-cover', 'What the guide doesn’t cover'],
];

/**
 * `/layout/information-architecture`: where a layout sits, after the
 * HIG-composition guide (“Apple HIG Components — Composition, Shared
 * Traits & a Re-Slicing”).
 */
export const LayoutInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog:{' '}
        <a
          href={`${HIG}/split-views`}
          rel="noreferrer"
          target="_blank"
        >
          Split views
        </a>{' '}
        (under Layout and organization).
      </li>
      <li>
        As primitives (
        <GuideLink to="section-5-mapping">HIG composition guide</GuideLink>): a
        Surface’s layout, of two or three linked Collections and Viewers.
      </li>
    </ul>

    <Heading
      id="a-surface-laid-out-as-a-split"
      level={2}
    >
      A Surface laid out as a split
    </Heading>
    <ul>
      <li>
        Split view: a Surface layout of 2–3 linked collections and viewers
        (guide, <GuideLink to="section-5-mapping">§5, the mapping</GuideLink>):
        here, its columns.
      </li>
      <li>
        <strong>Sidebar and split</strong> (guide{' '}
        <GuideLink to="shell-b">§7.4, shell B</GuideLink>): a Region at the
        leading edge (a tree Collection), a Collection, a Viewer.
      </li>
      <li>
        Drill, across columns: a Collection’s selection opening the next column
        (guide, <GuideLink to="move-drill">§7.2</GuideLink>), not a pushed page.
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
        The guide: in compact width, shell B collapses to shell A, columns
        becoming stack levels; the same structure, re-rendered (guide{' '}
        <GuideLink to="rule-g4">G4</GuideLink>; see{' '}
        <a href="navigation/composition#compact-or-regular">Navigation</a>).
      </li>
      <li>
        Here, also drawers (Framework7’s panels; iOS has none): a column kept,
        swiped in from its edge.
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
        Columns’ sizes (fixed, flexible, resizable by the user; iPadOS: chosen
        by the system).
      </li>
      <li>
        A floating column (iPadOS 26’s sidebar), the others running underneath
        it, and a background of the app’s behind them all.
      </li>
    </ul>
  </>
);
