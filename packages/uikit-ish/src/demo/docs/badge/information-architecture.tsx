import { FunctionComponent } from 'react';

import {
  Contents,
  Heading,
  type Section,
} from '../../tooling/guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['primitive-indicator', 'Primitive: Indicator'],
  ['status-by-scope', 'Status by scope'],
  ['where-it-sits', 'Where it sits'],
  ['what-the-guide-doesnt-cover', 'What the guide doesn’t cover'],
];

/**
 * `/badge/information-architecture`: where badges sit, after the
 * HIG-composition guide (“Apple HIG Components — Composition, Shared
 * Traits & a Re-Slicing”).
 */
export const BadgeInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog: no page of its own (a tab’s, a toolbar item’s, an app
        icon’s <code>badgeValue</code>).
      </li>
      <li>
        As a primitive (
        <GuideLink to="section-5-mapping">HIG composition guide</GuideLink>):
        the smallest <em>Indicator</em>, a count on an Item.
      </li>
    </ul>

    <Heading
      id="primitive-indicator"
      level={2}
    >
      Primitive: Indicator
    </Heading>
    <ul>
      <li>
        Indicator: displays a quantity or state (guide,{' '}
        <GuideLink to="primitive-indicator">§5</GuideLink>, which names badges
        among what it absorbs).
      </li>
      <li>
        Its parameters here: unbounded (a count), determinate, one series,
        discrete, never editable; without a count, a state alone (new).
      </li>
    </ul>

    <Heading
      id="status-by-scope"
      level={2}
    >
      Status by scope
    </Heading>
    <ul>
      <li>
        Status attaches to the narrowest scope it describes (guide rule{' '}
        <GuideLink to="status-by-scope">G8</GuideLink>): a badge, to an item
        (“badge count on tab”), in its trailing slot or on its symbol.
      </li>
      <li>
        On a tab, it reports a section’s news, not a destination of its own (
        <GuideLink to="section-7-5">§7.5</GuideLink>, “activity badge”).
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
        <strong>Layer:</strong> its item’s: the content layer in a row, the
        functional (glass) layer on a bar’s button or tab (guide{' '}
        <GuideLink to="layers">§2</GuideLink>).
      </li>
      <li>
        <strong>Its item:</strong> a row (its trailing slot), a symbol (a tab’s,
        a button’s), an avatar.
      </li>
      <li>
        <strong>Lifetime:</strong> as long as what it counts is waiting; gone
        once seen.
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
        Its row in the trait matrix (none): an Indicator, attached to an item.
      </li>
      <li>A dot for a state without a count (e.g. an unread state).</li>
      <li>Its sizes: on an element (24px), Framework7’s on a symbol (16px).</li>
    </ul>
  </>
);
