import { FunctionComponent } from 'react';

import {
  Contents,
  Heading,
  type Section,
} from '../../tooling/guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

const HIG = 'https://developer.apple.com/design/human-interface-guidelines';

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['primitive-command-set', 'Primitive: Command set'],
  ['where-it-sits', 'Where it sits'],
  ['what-the-guide-doesnt-cover', 'What the guide doesn’t cover'],
];

/**
 * `/activity-view/information-architecture`: where activity views sit,
 * after the HIG-composition guide (“Apple HIG Components — Composition,
 * Shared Traits & a Re-Slicing”).
 */
export const ActivityViewInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog:{' '}
        <a
          href={`${HIG}/activity-views`}
          rel="noreferrer"
          target="_blank"
        >
          Activity views
        </a>
        .
      </li>
      <li>
        As a primitive (
        <GuideLink to="section-5-mapping">HIG composition guide</GuideLink>): a{' '}
        <em>Command set</em> anchored to a Share control, rendered as the system
        share UI.
      </li>
    </ul>

    <Heading
      id="primitive-command-set"
      level={2}
    >
      Primitive: Command set
    </Heading>
    <ul>
      <li>
        Command set: an ordered set of commands, summoned from an anchor (guide,{' '}
        <GuideLink to="primitive-command-set">§5</GuideLink>); its render form
        here the share UI (people, actions), its anchor “share”.
      </li>
      <li>
        People as Items (an avatar, a name; guide{' '}
        <GuideLink to="primitive-item">§5</GuideLink>), actions as Commands.
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
        <strong>Its surface:</strong> the app’s <a href="sheet">Sheet</a>{' '}
        (iPhone) or <a href="popover">Popover</a> (iPad): window-modal, or
        transient at the Share button (guide{' '}
        <GuideLink to="modality-ladder">ladder</GuideLink>).
      </li>
      <li>
        <strong>Lifetime:</strong> until something is shared or it’s dismissed.
      </li>
    </ul>

    <Heading
      id="what-the-guide-doesnt-cover"
      level={2}
    >
      What the guide doesn’t cover
    </Heading>
    <ul>
      <li>Its parts’ metrics: rows of 78px items, 70px action circles.</li>
      <li>Apps (an app icon row) aren’t built: the system’s, not an app’s.</li>
    </ul>
  </>
);
