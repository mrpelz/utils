import { FunctionComponent } from 'react';

import { Contents, Heading, type Section } from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

const HIG = 'https://developer.apple.com/design/human-interface-guidelines';

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['primitive-value-input', 'Primitive: Value input'],
  ['traits', 'Traits'],
  ['where-it-sits', 'Where it sits'],
];

/**
 * `/date-picker/information-architecture`: where a date picker sits, after
 * the HIG-composition guide (“Apple HIG Components — Composition, Shared
 * Traits & a Re-Slicing”).
 */
export const DatePickerInformationArchitecture: FunctionComponent = () => (
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
        (date pickers), under “Selection and input”.
      </li>
      <li>
        As a primitive (
        <GuideLink to="section-5">HIG composition guide</GuideLink>): a{' '}
        <em>Value input</em> of a date (or a time); compact, a collapsed picker.
      </li>
    </ul>

    <Heading
      id="primitive-value-input"
      level={2}
    >
      Primitive: Value input
    </Heading>
    <ul>
      <li>
        Value input: a typed value that isn’t a pick from a set (guide,{' '}
        <GuideLink to="primitive-value-input">§5</GuideLink>); it absorbs date
        and time pickers. Parameters: value type (here a date, or a range),
        precision (a day, a minute), continuous or discrete.
      </li>
      <li>
        The <GuideLink to="section-5-mapping">mapping table</GuideLink>: a
        picker is “Choice or Value input, collapsed/wheel · single”: compact,
        the date picker is collapsed; its time, a wheel (a{' '}
        <a href="roll">Roll</a>).
      </li>
      <li>
        The guide’s <GuideLink to="choice-family">choice family</GuideLink>{' '}
        (§5): an ordered value, collapsed, is a picker (date/number); inline, a{' '}
        <a href="stepper">Stepper</a>.
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
        Not in the matrix’s “one”: a <code>range</code>, two days (a start and
        an end) and those between.
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
        <strong>Layer:</strong> compact, its buttons in the content layer, its
        pickers in the overlay (a popover); inline, the content layer (guide{' '}
        <GuideLink to="layers">§2</GuideLink>).
      </li>
      <li>
        <strong>Containment:</strong> an Item holds inline controls, a Value
        input among them (the grammar,{' '}
        <GuideLink to="section-6-containment">§6</GuideLink>): the compact style
        at a <a href="list">List</a> row’s end; expanded below it.
      </li>
      <li>
        <strong>Commit model:</strong> a form either applies each field at once
        (settings) or defers to a Done on its surface (create, edit), not both
        in one surface (<GuideLink to="commit-model">§8.2</GuideLink>). Each
        pick is a change (<code>onValueChange</code>): applied, or kept for a
        Done, or submitted with its form by <code>name</code> (in a field).
      </li>
      <li>
        <strong>Progressive disclosure:</strong> the guide’s form example has a
        date revealed by a choice above it (a reminder’s date,{' '}
        <GuideLink to="section-8-2">§8.2</GuideLink>).
      </li>
    </ul>
  </>
);
