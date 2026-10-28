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
 * `/menu/information-architecture`: where menus sit, after the
 * HIG-composition guide (“Apple HIG Components — Composition, Shared
 * Traits & a Re-Slicing”).
 */
export const MenuInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog:{' '}
        <a
          href={`${HIG}/menus`}
          rel="noreferrer"
          target="_blank"
        >
          Menus
        </a>{' '}
        (and{' '}
        <a
          href={`${HIG}/pull-down-buttons`}
          rel="noreferrer"
          target="_blank"
        >
          Pull-down buttons
        </a>
        ,{' '}
        <a
          href={`${HIG}/pop-up-buttons`}
          rel="noreferrer"
          target="_blank"
        >
          Pop-up buttons
        </a>
        ).
      </li>
      <li>
        As a primitive (
        <GuideLink to="section-5-mapping">HIG composition guide</GuideLink>): a{' '}
        <em>Command set</em> anchored to a control, rendered as a menu.
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
        ); its parameters an anchor and a render form.
      </li>
      <li>
        A menu: anchored to a control, rendered as a menu (the mapping table:
        “Menu / Pull-down / Context / Edit / Dock menus”), nested by submenus.
      </li>
      <li>
        Its siblings: the <a href="contextual-menu">Contextual menu</a>{' '}
        (anchored to content), the <a href="edit-menu">Edit menu</a> (to a text
        selection), the <a href="action-sheet">Action sheet</a> (rendered as a
        sheet).
      </li>
      <li>
        A pop-up button’s menu is a Choice instead (one selected), collapsed
        behind its control (guide{' '}
        <GuideLink to="choice-family">choice family</GuideLink>).
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
        The menu’s row of the guide’s trait matrix (
        <GuideLink to="trait-matrix">§4</GuideLink>).
      </li>
    </ul>
    <table>
      <tbody>
        <tr>
          <th>Intent</th>
          <td>Act/Choose</td>
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
          <td>Control</td>
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
    <ul>
      <li>
        Tree: submenus; beyond dozens, a popup taller than the room for it
        scrolls.
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
        <strong>Layer:</strong> the overlay layer, above the content and the
        bars (guide <GuideLink to="layers">§2</GuideLink>), on glass.
      </li>
      <li>
        <strong>Modality:</strong> transient: dismissed by a choice, a press
        outside or Escape (guide{' '}
        <GuideLink to="modality-ladder">ladder</GuideLink>); the page doesn’t
        scroll while it’s open.
      </li>
      <li>
        <strong>Its anchor:</strong> a toolbar’s button, a row’s pop-up button,
        a back button (held).
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
        The iPhone’s and the iPad’s menus (Figma’s two), switched by the size
        class: where submenus open, the items’ size.
      </li>
      <li>Quick actions: a row of tiles at the top (Figma “Quick Actions”).</li>
      <li>
        Opening on touch down and choosing by dragging on to an item (iOS’).
      </li>
    </ul>
  </>
);
