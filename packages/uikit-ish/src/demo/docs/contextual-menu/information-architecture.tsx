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
 * `/contextual-menu/information-architecture`: where contextual menus sit,
 * after the HIG-composition guide (“Apple HIG Components — Composition,
 * Shared Traits & a Re-Slicing”).
 */
export const ContextualMenuInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog:{' '}
        <a
          href={`${HIG}/context-menus`}
          rel="noreferrer"
          target="_blank"
        >
          Context menus
        </a>
        .
      </li>
      <li>
        As a primitive (
        <GuideLink to="section-5-mapping">HIG composition guide</GuideLink>): a{' '}
        <em>Command set</em> anchored to a content element, rendered as a menu.
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
        ); here the anchor a content element (or the pointer).
      </li>
      <li>
        A <a href="menu">Menu</a>’s sibling (anchored to a control), rendered
        the same; the content lifts, or is previewed, as it’s summoned.
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
        The context menu’s row of the guide’s trait matrix (
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
          <td>Tree</td>
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
          <td>Content element / Pointer</td>
        </tr>
        <tr>
          <th>Layer</th>
          <td>Overlay</td>
        </tr>
        <tr>
          <th>Capacity</th>
          <td>Dozens</td>
        </tr>
      </tbody>
    </table>

    <Heading
      id="where-it-sits"
      level={2}
    >
      Where it sits
    </Heading>
    <ul>
      <li>
        <strong>Layer:</strong> the overlay layer (guide{' '}
        <GuideLink to="layers">§2</GuideLink>), the content it acts on lifted
        into it, above the blurred page.
      </li>
      <li>
        <strong>Modality:</strong> transient, dismissed by a choice or a press
        outside (guide <GuideLink to="modality-ladder">ladder</GuideLink>).
      </li>
      <li>
        <strong>Discoverability:</strong> hidden until tried: shortcuts to what
        the content’s own screen offers, never the only way.
      </li>
    </ul>

    <Heading
      id="what-the-guide-doesnt-cover"
      level={2}
    >
      What the guide doesn’t cover
    </Heading>
    <ul>
      <li>The lift and the preview.</li>
      <li>
        Opening on a press as well as a held press (iOS: a held press only).
      </li>
    </ul>
  </>
);
