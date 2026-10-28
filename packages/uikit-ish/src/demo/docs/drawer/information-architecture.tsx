import { FunctionComponent } from 'react';

import {
  Contents,
  Heading,
  type Section,
} from '../../tooling/guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['a-region-kept-at-an-edge', 'A Region kept at an edge'],
  ['what-the-guide-doesnt-cover', 'What the guide doesn’t cover'],
];

/**
 * `/drawer/information-architecture`: where a drawer sits, after the
 * HIG-composition guide (“Apple HIG Components — Composition, Shared
 * Traits & a Re-Slicing”).
 */
export const DrawerInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog: none (iOS has no drawers; Framework7’s panels, Base
        UI’s <code>Drawer</code>).
      </li>
      <li>
        As primitives: a split’s Region or Viewer (see{' '}
        <a href="layout/information-architecture">Layout</a>), kept at an edge
        of a compact screen.
      </li>
    </ul>

    <Heading
      id="a-region-kept-at-an-edge"
      level={2}
    >
      A Region kept at an edge
    </Heading>
    <ul>
      <li>
        The guide: in compact width, shell B (sidebar and split) collapses to
        shell A, columns becoming stack levels (guide{' '}
        <GuideLink to="rule-g4">G4</GuideLink>; see{' '}
        <a href="navigation/composition#compact-or-regular">Navigation</a>).
      </li>
      <li>
        A drawer keeps a column instead, over the content from its edge: the
        same structure, re-rendered otherwise (the app’s choice, see{' '}
        <a href="drawer/composition">Composition</a>).
      </li>
    </ul>

    <Heading
      id="what-the-guide-doesnt-cover"
      level={2}
    >
      What the guide doesn’t cover
    </Heading>
    <ul>
      <li>Drawers at all: neither iOS nor the guide has them.</li>
      <li>
        Swiping one in from an edge: its own gesture, beside the system’s (and a
        stack’s swipe back, from the same leading edge).
      </li>
    </ul>
  </>
);
