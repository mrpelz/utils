import { FunctionComponent } from 'react';

import { GuideLink } from '../hig-guide/link.js';
import { Contents, type Section } from '../utils/sections.js';

const HIG = 'https://developer.apple.com/design/human-interface-guidelines';

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['on-their-own-a-choice', 'On their own: a Choice'],
  ['in-lists-a-collection-s-selection', 'In lists: a Collection’s selection'],
  ['traits', 'Traits'],
];

/**
 * `/checkbox/information-architecture`: where selection circles sit, after
 * the HIG-composition guide (“Apple HIG Components — Composition, Shared
 * Traits & a Re-Slicing”).
 */
export const CheckboxInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <p className="demo-lead">
      Apple’s catalog has no iOS checkbox or radio button of its own: its{' '}
      <a
        href={`${HIG}/toggles`}
        rel="noreferrer"
        target="_blank"
      >
        toggles
      </a>{' '}
      page, under “Selection and input”, covers checkboxes and radio buttons
      under its macOS considerations. On iOS, selection circles mark the items
      selected in a list while editing. Re-sliced into primitives (after the{' '}
      <GuideLink to="section-5">HIG composition guide</GuideLink>), they’re two
      things, by where they are.
    </p>

    <h2 id="on-their-own-a-choice">On their own: a Choice</h2>
    <p>
      A Choice selects one or many from a known set (guide,{' '}
      <GuideLink to="primitive-choice">§5</GuideLink>, which lists “radio groups
      and checkboxes” among the Choices). A checkbox is the Choice of two,
      inline (ticked or not); radios the Choice of a few, inline, one at a time:
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
            Toggle (<a href="switch">Switch</a>) / <strong>checkbox</strong>
          </td>
          <td>—</td>
        </tr>
        <tr>
          <th>N ≤ ~5</th>
          <td>
            Segmented control (<a href="segmented">Segmented</a>) /{' '}
            <strong>radios</strong>
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
      For a setting that takes effect at once, iOS uses the toggle; for one of a
      few short options, the segmented control.
    </p>

    <h2 id="in-lists-a-collection-s-selection">
      In lists: a Collection’s selection
    </h2>
    <p>
      A Collection is a set of items with a data shape and a projection; one of
      its parameters is its selection: none, one or many (guide,{' '}
      <GuideLink to="primitive-collection">§5</GuideLink>). Selection circles
      before a list’s rows (<code>List.Checkbox</code>, <code>List.Radio</code>)
      render that selection: many with checkboxes (a parent selecting all), one
      with radios.
    </p>
    <ul>
      <li>
        <strong>The Collection owns the selection</strong>, Regions act on it (
        <GuideLink to="rule-g7">G7</GuideLink>): a toolbar’s Move or Delete
        reads the selected rows; it doesn’t keep a selection of its own.
      </li>
      <li>
        <strong>Selection commands</strong> on iPhone: a context menu, and the
        edit mode’s toolbar (guide <GuideLink to="section-7-5">§7.5</GuideLink>
        ).
      </li>
      <li>
        <strong>Containment:</strong> Items in Groups, Groups in a Collection (
        <GuideLink to="section-6-containment">§6</GuideLink>); here, a{' '}
        <code>RadioGroup</code> or <code>CheckboxGroup</code> renders the list’s
        group, its rows the Items.
      </li>
    </ul>

    <h2 id="traits">Traits</h2>
    <p>
      The guide’s trait matrix (<GuideLink to="trait-matrix">§4</GuideLink>) has
      no row for checkboxes or radios.
    </p>
  </>
);
