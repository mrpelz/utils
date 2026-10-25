import { FunctionComponent } from 'react';

import {
  Contents,
  Heading,
  type Section,
} from '../../tooling/guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['an-item-s-visual', 'An item’s visual'],
  ['where-it-sits', 'Where it sits'],
  ['what-the-guide-doesnt-cover', 'What the guide doesn’t cover'],
];

/**
 * `/avatar/information-architecture`: where avatars sit, after the
 * HIG-composition guide (“Apple HIG Components — Composition, Shared
 * Traits & a Re-Slicing”).
 */
export const AvatarInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog: no page of its own (Figma “Activity Views”’ contacts;
        Contacts’, Messages’ pictures).
      </li>
      <li>
        The guide (
        <GuideLink to="section-5-mapping">HIG composition guide</GuideLink>)
        maps no primitive to it: it’s what fills an Item’s visual slot when the
        item is a person.
      </li>
    </ul>

    <Heading
      id="an-item-s-visual"
      level={2}
    >
      An item’s visual
    </Heading>
    <ul>
      <li>
        An Item’s leading visual (guide,{' '}
        <GuideLink to="primitive-item">§5</GuideLink>): a contact’s row, a
        message’s sender, a share target.
      </li>
      <li>
        Several people as one item (a group conversation): one visual for all.
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
        <strong>Layer:</strong> the content layer, in its item.
      </li>
      <li>
        <strong>Status on it:</strong> a badge on its corner, the item’s scope
        (guide rule <GuideLink to="status-by-scope">G8</GuideLink>).
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
        The fallback’s look (iOS contacts’ gray, the initials): Figma has photos
        only.
      </li>
      <li>A third person in a group (Figma: two).</li>
    </ul>
  </>
);
