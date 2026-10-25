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
 * `/stepper/information-architecture`: where a stepper sits, after the
 * HIG-composition guide (“Apple HIG Components — Composition, Shared
 * Traits & a Re-Slicing”).
 */
export const StepperInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog:{' '}
        <a
          href={`${HIG}/steppers`}
          rel="noreferrer"
          target="_blank"
        >
          Steppers
        </a>
        , under “Selection and input”.
      </li>
      <li>
        As a primitive (
        <GuideLink to="section-5">HIG composition guide</GuideLink>): an ordered{' '}
        <em>Choice</em>, stepped through; numeric, a <em>Value input</em>.
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
        <GuideLink to="primitive-choice">§5</GuideLink>); it absorbs steppers as{' '}
        <em>ordered, step-wise</em> choices.
      </li>
      <li>
        Value input: a typed value that isn’t a pick from a set (
        <GuideLink to="primitive-value-input">§5</GuideLink>); it absorbs
        steppers in their <em>numeric variant</em>.
      </li>
      <li>
        The <GuideLink to="section-5-mapping">mapping table</GuideLink>: a
        stepper is “Choice/Value input, ordered · discrete”. This library’s is
        numeric (Base UI’s number field): a value input, stepped.
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
            Wheel picker (<a href="roll">Roll</a>) / list
          </td>
          <td>Pop-up / menu picker</td>
        </tr>
        <tr>
          <th>ordered</th>
          <td>
            <strong>Stepper</strong>
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
        (§5): a stepper is the inline way to an ordered value, a picker the
        collapsed one.
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
        The stepper’s row of the guide’s trait matrix (
        <GuideLink to="trait-matrix">§4</GuideLink>).
      </li>
    </ul>
    <table>
      <tbody>
        <tr>
          <th>Intent</th>
          <td>Choose / Enter</td>
        </tr>
        <tr>
          <th>Data shape</th>
          <td>Ordered scalar</td>
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
          <td>Inline</td>
        </tr>
        <tr>
          <th>Layer</th>
          <td>Content</td>
        </tr>
        <tr>
          <th>Capacity</th>
          <td>Unbounded</td>
        </tr>
      </tbody>
    </table>
    <ul>
      <li>
        Unbounded, as the matrix has it, unless bounded by <code>min</code> and{' '}
        <code>max</code>; its halves disable at the bounds.
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
        <strong>Layer:</strong> the content layer, scrolling with the page
        beneath the functional (glass) layer of bars (guide{' '}
        <GuideLink to="layers">§2</GuideLink>).
      </li>
      <li>
        <strong>Containment:</strong> an Item holds inline controls, a Choice or
        a Value input among them (the grammar,{' '}
        <GuideLink to="section-6-containment">§6</GuideLink>). Here: a stepper
        in a <a href="list">List</a> row’s trailing slot, its value in the row’s
        detail.
      </li>
      <li>
        <strong>Commit model:</strong> a form either applies each field at once
        (settings) or defers to a Done on its surface (create, edit), not both
        in one surface (<GuideLink to="commit-model">§8.2</GuideLink>). A
        stepper fits either: each step a change (<code>onValueChange</code>), or
        submitted with its form by <code>name</code>.
      </li>
    </ul>
  </>
);
