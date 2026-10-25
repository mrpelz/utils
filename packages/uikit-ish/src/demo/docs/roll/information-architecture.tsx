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
  ['primitive-choice-or-value-input', 'Primitive: Choice, or Value input'],
  ['traits', 'Traits'],
  ['where-it-sits', 'Where it sits'],
];

/**
 * `/roll/information-architecture`: where a roll sits, after the
 * HIG-composition guide (“Apple HIG Components — Composition, Shared
 * Traits & a Re-Slicing”).
 */
export const RollInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog:{' '}
        <a
          href={`${HIG}/pickers`}
          rel="noreferrer"
          target="_blank"
        >
          Pickers
        </a>{' '}
        (its wheel style), under “Selection and input”.
      </li>
      <li>
        As a primitive (
        <GuideLink to="section-5">HIG composition guide</GuideLink>): a{' '}
        <em>Choice</em> of one from a large set; a date or a number’s parts, a{' '}
        <em>Value input</em>.
      </li>
    </ul>

    <Heading
      id="primitive-choice-or-value-input"
      level={2}
    >
      Primitive: Choice, or Value input
    </Heading>
    <ul>
      <li>
        Choice: one or many from a known set (guide,{' '}
        <GuideLink to="primitive-choice">§5</GuideLink>); it absorbs pickers,
        collapsed or wheel.
      </li>
      <li>
        Value input: a typed value that isn’t a pick from a set (
        <GuideLink to="primitive-value-input">§5</GuideLink>); it absorbs date
        and time pickers.
      </li>
      <li>
        The <GuideLink to="section-5-mapping">mapping table</GuideLink>: a
        picker is “Choice or Value input, collapsed/wheel · single”. A roll is
        the wheel; collapsed, it’s in a popover (see{' '}
        <a href="roll/composition#in-a-popover">Composition</a>).
      </li>
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
            Segmented control (<a href="segmented">Segmented</a>) / radios
          </td>
          <td>Pop-up button</td>
        </tr>
        <tr>
          <th>N large</th>
          <td>
            <strong>Wheel picker</strong> / list
          </td>
          <td>Pop-up / menu picker</td>
        </tr>
        <tr>
          <th>ordered</th>
          <td>
            Stepper (<a href="stepper">Stepper</a>)
          </td>
          <td>
            Picker (date/number: <a href="date-picker">Date picker</a>)
          </td>
        </tr>
      </tbody>
    </table>
    <ul>
      <li>
        The guide’s <GuideLink to="choice-family">choice family</GuideLink>{' '}
        (§5): a wheel picker shows a large set’s options around the selected
        one.
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
        The picker’s row of the guide’s trait matrix (
        <GuideLink to="trait-matrix">§4</GuideLink>), wheel and menu alike.
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
          <td>Set / Sequence</td>
        </tr>
        <tr>
          <th>Selection</th>
          <td>One</td>
        </tr>
        <tr>
          <th>Lifetime</th>
          <td>Persistent</td>
        </tr>
        <tr>
          <th>Anchor</th>
          <td>Inline or on demand</td>
        </tr>
        <tr>
          <th>Layer</th>
          <td>Content / Overlay</td>
        </tr>
        <tr>
          <th>Capacity</th>
          <td>Unbounded</td>
        </tr>
      </tbody>
    </table>
    <ul>
      <li>
        One per column: a roll of several columns selects one row in each (a
        time’s hours and minutes), the parts of one value.
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
        <strong>Layer:</strong> inline, the content layer (e.g. expanded below a{' '}
        <a href="list">List</a> row); on demand, the overlay, in a{' '}
        <a href="popover">Popover</a> (guide{' '}
        <GuideLink to="layers">§2</GuideLink>).
      </li>
      <li>
        <strong>Containment:</strong> an Item holds inline controls, a Choice
        among them (the grammar,{' '}
        <GuideLink to="section-6-containment">§6</GuideLink>): a row’s value in
        its detail, the roll below it.
      </li>
      <li>
        <strong>Commit model:</strong> a form either applies each field at once
        (settings) or defers to a Done on its surface (create, edit), not both
        in one surface (<GuideLink to="commit-model">§8.2</GuideLink>). A column
        commits once it settles (<code>onValueChange</code>), not while it
        turns: the app applies it, or keeps it for a Done.
      </li>
    </ul>
  </>
);
