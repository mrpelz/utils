import { FunctionComponent } from 'react';

import { GuideLink } from '../hig-guide/link.js';

const HIG = 'https://developer.apple.com/design/human-interface-guidelines';

/**
 * `/segmented/information-architecture`: where a segmented control sits,
 * after the HIG-composition guide (“Apple HIG Components — Composition,
 * Shared Traits & a Re-Slicing”).
 */
export const SegmentedInformationArchitecture: FunctionComponent = () => (
  <>
    <p className="demo-lead">
      In Apple’s catalog,{' '}
      <a
        href={`${HIG}/segmented-controls`}
        rel="noreferrer"
        target="_blank"
      >
        segmented controls
      </a>{' '}
      are under “Selection and input”. Re-sliced into primitives (after the{' '}
      <GuideLink to="section-5">HIG composition guide</GuideLink>), a segmented
      control is a <em>Choice</em>: a few options, all visible at once (
      <GuideLink to="section-5-mapping">§5, mapping</GuideLink>: inline, N ≤ 5,
      single or many).
    </p>

    <h2>Primitive: Choice</h2>
    <p>
      A Choice selects one or many from a known set; its parameters are the
      number of options (N), the cardinality, whether they’re ordered, whether
      they’re all visible inline or collapsed, and whether free entry is allowed
      (guide, <GuideLink to="primitive-choice">§5</GuideLink>). The segmented
      control is the inline Choice for a few options:
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
    <p>
      (The <GuideLink to="choice-family">choice family</GuideLink>, guide §5.)
      Past about five options, or with long ones, the same Choice collapses: a
      pop-up button (<a href="menu">Menu</a>) or a picker (
      <a href="roll">Roll</a>).
    </p>

    <h2>Traits</h2>
    <p>
      The segmented control’s row of the guide’s trait matrix (
      <GuideLink to="trait-matrix">§4</GuideLink>):
    </p>
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
    <p>
      This library’s segmented control chooses one (it’s Base UI’s radio group);
      the matrix’s “many” has no counterpart here.
    </p>

    <h2>Where it sits</h2>
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
