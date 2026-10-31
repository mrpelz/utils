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
  ['traits', 'Traits'],
  ['where-it-sits', 'Where it sits'],
  ['what-the-guide-doesnt-cover', 'What the guide doesn’t cover'],
];

/**
 * `/edit-menu/information-architecture`: where edit menus sit, after the
 * HIG-composition guide (“Apple HIG Components — Composition, Shared
 * Traits & a Re-Slicing”).
 */
export const EditMenuInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog:{' '}
        <a
          href={`${HIG}/edit-menus`}
          rel="noreferrer"
          target="_blank"
        >
          Edit menus
        </a>
        .
      </li>
      <li>
        As a primitive (
        <GuideLink to="section-5-mapping">HIG composition guide</GuideLink>): “a
        Command set anchored to a text selection, capacity ~6, rendered as a
        horizontal bar” (the guide’s own example).
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
        Command set: an ordered, possibly nested set of commands, summoned from
        an anchor (guide, <GuideLink to="primitive-command-set">§5</GuideLink>
        ); here a text selection (or an element), rendered as a horizontal bar.
      </li>
      <li>
        The <a href="menu">Menu</a>’s and the{' '}
        <a href="contextual-menu">Contextual menu</a>’s sibling; its overflow a
        submenu (the “more” button) rather than nesting.
      </li>
    </ul>

    <Heading
      id="traits"
      level={2}
    >
      Traits
    </Heading>
    <ul>
      <li>
        The edit menu’s row of the guide’s trait matrix (
        <GuideLink to="trait-matrix">§4</GuideLink>).
      </li>
    </ul>
    <table>
      <tbody>
        <tr>
          <th>Intent</th>
          <td>Act</td>
        </tr>
        <tr>
          <th>Data shape</th>
          <td>Set</td>
        </tr>
        <tr>
          <th>Selection</th>
          <td>—</td>
        </tr>
        <tr>
          <th>Lifetime</th>
          <td>Transient</td>
        </tr>
        <tr>
          <th>Anchor</th>
          <td>Text selection</td>
        </tr>
      </tbody>
    </table>
    <ul>
      <li>
        Beyond its capacity (~6), the actions scroll in the capsule, or go
        behind the “more” button.
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
        <strong>Layer:</strong> the overlay layer, on glass (guide{' '}
        <GuideLink to="layers">§2</GuideLink>), above the content it acts on.
      </li>
      <li>
        <strong>Modality:</strong> none: the page stays interactive; a press
        outside reaches it as the menu closes (guide{' '}
        <GuideLink to="modality-ladder">ladder</GuideLink>).
      </li>
    </ul>

    <Heading
      id="what-the-guide-doesnt-cover"
      level={2}
    >
      What the guide doesn’t cover
    </Heading>
    <ul>
      <li>Its metrics: 42px high, 14px labels.</li>
      <li>
        More actions in an iPad menu below the capsule (iOS pages the capsule).
      </li>
    </ul>
  </>
);
