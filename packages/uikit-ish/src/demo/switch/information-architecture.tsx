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
 * `/switch/information-architecture`: where a switch sits, after the
 * HIG-composition guide (“Apple HIG Components — Composition, Shared
 * Traits & a Re-Slicing”).
 */
export const SwitchInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog: a{' '}
        <a
          href={`${HIG}/toggles`}
          rel="noreferrer"
          target="_blank"
        >
          toggle
        </a>
        , under “Selection and input”.
      </li>
      <li>
        As a primitive (
        <GuideLink to="section-5">HIG composition guide</GuideLink>): the
        smallest <em>Choice</em>, one of two options, both visible.
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
      <li>A toggle: N = 2, inline.</li>
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
            <strong>Toggle</strong> / checkbox
          </td>
          <td>—</td>
        </tr>
        <tr>
          <th>N ≤ ~5</th>
          <td>
            Segmented control (<a href="segmented">Segmented</a>) / radios
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
        This library’s checkbox is iOS’s selection circle (
        <a href="checkbox">Checkbox</a>): for selecting items, not settings.
      </li>
    </ul>

    <h2 id="traits">Traits</h2>
    <ul>
      <li>
        The toggle’s row of the guide’s trait matrix (
        <GuideLink to="trait-matrix">§4</GuideLink>).
      </li>
    </ul>
    <table>
      <tbody>
        <tr>
          <th>Intent</th>
          <td>Choose</td>
        </tr>
        <tr>
          <th>Data shape</th>
          <td>Scalar (boolean)</td>
        </tr>
        <tr>
          <th>Selection</th>
          <td>One of 2</td>
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
          <td>Content</td>
        </tr>
        <tr>
          <th>Capacity</th>
          <td>2</td>
        </tr>
      </tbody>
    </table>
    <ul>
      <li>
        Not in the matrix’s “one of 2”: <code>indeterminate</code>, a state
        between the two (e.g. while a change is saved).
      </li>
    </ul>

    <h2 id="where-it-sits">Where it sits</h2>
    <ul>
      <li>
        <strong>Layer:</strong> the content layer, scrolling with the page
        beneath the functional (glass) layer of bars (guide{' '}
        <GuideLink to="layers">§2</GuideLink>).
      </li>
      <li>
        <strong>Containment:</strong> an Item holds inline controls, a Choice
        among them; Items are in Groups, Groups in a Collection (
        <GuideLink to="section-6-containment">§6</GuideLink>). Here: a switch in
        a <a href="list">List</a> row’s trailing slot, rows in a section.
      </li>
      <li>
        <strong>Commit model:</strong> a form either applies each field at once
        (settings) or defers to a Done on its surface (create, edit), not both
        in one surface (<GuideLink to="commit-model">§8.2</GuideLink>). A switch
        takes effect at once: it belongs to the first kind.
      </li>
      <li>
        <strong>Progressive disclosure:</strong> the guide’s form example has a
        two-option Choice that reveals the item below it (a reminder’s date,{' '}
        <GuideLink to="section-8-2">§8.2</GuideLink>).
      </li>
    </ul>
  </>
);
