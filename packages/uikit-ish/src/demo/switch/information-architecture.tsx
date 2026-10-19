import { FunctionComponent } from 'react';

import { GuideLink } from '../hig-guide/link.js';

const HIG = 'https://developer.apple.com/design/human-interface-guidelines';

/**
 * `/switch/information-architecture`: where a switch sits, after the
 * HIG-composition guide (“Apple HIG Components — Composition, Shared
 * Traits & a Re-Slicing”).
 */
export const SwitchInformationArchitecture: FunctionComponent = () => (
  <>
    <p className="demo-lead">
      In Apple’s catalog, the switch is a{' '}
      <a
        href={`${HIG}/toggles`}
        rel="noreferrer"
        target="_blank"
      >
        toggle
      </a>
      , under “Selection and input”. Re-sliced into primitives (after the{' '}
      <GuideLink to="section-5">HIG composition guide</GuideLink>), it’s the
      smallest <em>Choice</em>: one of two options, both visible at once.
    </p>

    <h2>Primitive: Choice</h2>
    <p>
      A Choice selects one or many from a known set; its parameters are the
      number of options (N), the cardinality, whether they’re ordered, whether
      they’re all visible inline or collapsed, and whether free entry is allowed
      (guide, <GuideLink to="primitive-choice">§5</GuideLink>). A toggle is the
      Choice with N = 2, inline:
    </p>
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
    <p>
      (The <GuideLink to="choice-family">choice family</GuideLink>, guide §5. In
      this library, the checkbox is iOS’s selection circle (
      <a href="checkbox">Checkbox</a>), for selecting items rather than
      settings.)
    </p>

    <h2>Traits</h2>
    <p>
      The toggle’s row of the guide’s trait matrix (
      <GuideLink to="trait-matrix">§4</GuideLink>):
    </p>
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
    <p>
      This switch also has <code>indeterminate</code>, a state between the two
      (e.g. while a change is saved), which the matrix’s “one of 2” leaves out.
    </p>

    <h2>Where it sits</h2>
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
