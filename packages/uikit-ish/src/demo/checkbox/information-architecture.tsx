import { FunctionComponent } from 'react';

import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

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
    <ul className="demo-lead">
      <li>Apple’s catalog: no iOS checkbox or radio button.</li>
      <li>
        Its{' '}
        <a
          href={`${HIG}/toggles`}
          rel="noreferrer"
          target="_blank"
        >
          toggles
        </a>{' '}
        page (“Selection and input”) covers checkboxes and radio buttons for
        macOS.
      </li>
      <li>
        On iOS: selection circles mark the items selected in a list while
        editing.
      </li>
      <li>
        As primitives (
        <GuideLink to="section-5">HIG composition guide</GuideLink>): two
        things, by where they are.
      </li>
    </ul>

    <Heading
      id="on-their-own-a-choice"
      level={2}
    >
      On their own: a Choice
    </Heading>
    <ul>
      <li>
        Choice: one or many from a known set (guide,{' '}
        <GuideLink to="primitive-choice">§5</GuideLink>: “radio groups and
        checkboxes”).
      </li>
      <li>A checkbox: the Choice of two, inline (ticked or not).</li>
      <li>Radios: the Choice of a few, inline, one at a time.</li>
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
    <ul>
      <li>
        See the <GuideLink to="choice-family">choice family</GuideLink> (guide
        §5).
      </li>
      <li>
        iOS instead: a toggle for a setting that takes effect at once; a
        segmented control for one of a few short options.
      </li>
    </ul>

    <Heading
      id="in-lists-a-collection-s-selection"
      level={2}
    >
      In lists: a Collection’s selection
    </Heading>
    <ul>
      <li>
        Collection: a set of items with a data shape and a projection (guide,{' '}
        <GuideLink to="primitive-collection">§5</GuideLink>).
      </li>
      <li>One of its parameters: selection (none, one, many).</li>
      <li>
        Selection circles before a list’s rows (
        <PartLink
          component="list"
          part="List.Checkbox"
        />
        ,{' '}
        <PartLink
          component="list"
          part="List.Radio"
        />
        ) render it: many with checkboxes (a parent selecting all), one with
        radios.
      </li>
    </ul>
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
        <PartLink
          component="checkbox"
          part="RadioGroup"
        />{' '}
        or{' '}
        <PartLink
          component="checkbox"
          part="CheckboxGroup"
        />{' '}
        renders the list’s group, its rows the Items.
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
        No row in the guide’s trait matrix (
        <GuideLink to="trait-matrix">§4</GuideLink>) for checkboxes or radios.
      </li>
    </ul>
  </>
);
