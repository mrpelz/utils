import { FunctionComponent } from 'react';

import { GuideLink } from '../hig-guide/link.js';
import { Contents, type Section } from '../utils/sections.js';

const HIG = 'https://developer.apple.com/design/human-interface-guidelines';

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['primitive-choice', 'Primitive: Choice'],
  ['traits', 'Traits'],
  ['where-it-sits', 'Where it sits'],
];

/**
 * `/segmented/information-architecture`: where a segmented control sits,
 * after the HIG-composition guide (“Apple HIG Components — Composition,
 * Shared Traits & a Re-Slicing”).
 */
export const SegmentedInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog:{' '}
        <a
          href={`${HIG}/segmented-controls`}
          rel="noreferrer"
          target="_blank"
        >
          segmented controls
        </a>
        , under “Selection and input”.
      </li>
      <li>
        As a primitive (
        <GuideLink to="section-5">HIG composition guide</GuideLink>): a{' '}
        <em>Choice</em>, a few options, all visible (
        <GuideLink to="section-5-mapping">§5, mapping</GuideLink>: inline, N ≤
        5, single or many).
      </li>
    </ul>

    <h2 id="primitive-choice">Primitive: Choice</h2>
    <ul>
      <li>
        Choice: one or many from a known set (guide,{' '}
        <GuideLink to="primitive-choice">§5</GuideLink>).
      </li>
      <li>
        Parameters: number of options (N), cardinality, ordered or not, inline
        or collapsed, free entry or not.
      </li>
      <li>A segmented control: the inline Choice for a few options.</li>
    </ul>
    <table>
      <thead>
        <tr>
          <th />
          <th>Options visible at once</th>
          <th>Collapsed</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>N = 2</th>
          <td>
            Toggle (<a href="switch">Switch</a>) / checkbox
          </td>
          <td>—</td>
        </tr>
        <tr>
          <th>N ≤ ~5</th>
          <td>
            <strong>Segmented control</strong> / radios
          </td>
          <td>Pop-up button</td>
        </tr>
        <tr>
          <th>N large</th>
          <td>Wheel picker / list</td>
          <td>Pop-up / menu picker</td>
        </tr>
      </tbody>
    </table>
    <ul>
      <li>
        See the <GuideLink to="choice-family">choice family</GuideLink> (guide
        §5).
      </li>
      <li>
        Past about five options, or long ones: the same Choice, collapsed, a
        pop-up button (<a href="menu">Menu</a>) or a picker (
        <a href="roll">Roll</a>).
      </li>
    </ul>

    <h2 id="traits">Traits</h2>
    <ul>
      <li>
        The segmented control’s row of the guide’s trait matrix (
        <GuideLink to="trait-matrix">§4</GuideLink>).
      </li>
    </ul>
    <table>
      <tbody>
        <tr>
          <th>Intent</th>
          <td>Choose / Navigate</td>
        </tr>
        <tr>
          <th>Data shape</th>
          <td>Set</td>
        </tr>
        <tr>
          <th>Selection</th>
          <td>One / Many</td>
        </tr>
        <tr>
          <th>Lifetime</th>
          <td>Persistent</td>
        </tr>
        <tr>
          <th>Anchor</th>
          <td>Inline</td>
        </tr>
        <tr>
          <th>Layer</th>
          <td>Content / Functional</td>
        </tr>
        <tr>
          <th>Capacity</th>
          <td>~2–5</td>
        </tr>
      </tbody>
    </table>
    <ul>
      <li>
        This library’s chooses one (Base UI’s radio group); no counterpart for
        the matrix’s “many”.
      </li>
    </ul>

    <h2 id="where-it-sits">Where it sits</h2>
    <ul>
      <li>
        <strong>Two intents:</strong> Apple’s segmented controls are in two of
        the guide’s duplication clusters (
        <GuideLink to="section-3-clusters">§3</GuideLink>): “pick one of N” (a
        setting, a value), and “switch between sibling sections” when used to
        switch views. Choosing a view navigates; choosing a value doesn’t.
      </li>
      <li>
        <strong>Layer:</strong> in the content, on the content layer; in a
        navigation bar or toolbar, on the functional (glass) layer, a Choice
        inside a Region (<GuideLink to="layers">§2</GuideLink>,{' '}
        <GuideLink to="section-6-containment">§6</GuideLink>).
      </li>
      <li>
        <strong>Beside actions:</strong> in a toolbar, the Choice and the
        Commands (buttons) are separate intents, kept apart (
        <GuideLink to="rule-g1">G1</GuideLink>).
      </li>
      <li>
        <strong>As a section switcher:</strong> on the Mac, a toolbar’s
        segmented switch can take a tab bar’s place (
        <GuideLink to="section-7-3">§7.3</GuideLink>,{' '}
        <GuideLink to="rule-g4">G4</GuideLink>: the same Choice, rendered per
        host). On iPhone, top-level sections are a <a href="tab-bar">Tab bar</a>
        ’s.
      </li>
      <li>
        <strong>Search scopes:</strong> a search’s scopes can be a Choice (a
        segmented scope bar) rather than tokens (
        <GuideLink to="section-7-6">§7.6</GuideLink>).
      </li>
    </ul>
  </>
);
