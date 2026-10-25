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
  ['primitives-region-choice', 'Primitives: Region + Choice'],
  ['traits', 'Traits'],
  ['where-it-sits', 'Where it sits'],
  ['rules', 'Rules'],
];

/**
 * `/tab-bar/information-architecture`: where a tab bar sits, after the
 * HIG-composition guide (“Apple HIG Components — Composition, Shared
 * Traits & a Re-Slicing”).
 */
export const TabBarInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog:{' '}
        <a
          href={`${HIG}/tab-bars`}
          rel="noreferrer"
          target="_blank"
        >
          tab bars
        </a>
        , under “Navigation and search”.
      </li>
      <li>
        As primitives (
        <GuideLink to="section-5">HIG composition guide</GuideLink>): a{' '}
        <em>Region</em> at the window’s bottom edge, holding a navigating{' '}
        <em>Choice</em> of the app’s sections (
        <GuideLink to="section-5-mapping">§5, mapping</GuideLink>).
      </li>
    </ul>

    <Heading
      id="primitives-region-choice"
      level={2}
    >
      Primitives: Region + Choice
    </Heading>
    <ul>
      <li>
        Region: an edge-anchored strip of a surface, hosting commands, choices
        or navigation (guide, <GuideLink to="primitive-region">§5</GuideLink>).
      </li>
      <li>
        Parameters: edge, capacity, collapse and scroll behavior, ownership.
      </li>
      <li>
        A tab bar: the bottom Region of an app’s window; about three to six
        tabs; owned by the app.
      </li>
      <li>
        Collapse: this library’s <code>collapsed</code>, set by the app (e.g.
        while scrolling down).
      </li>
    </ul>
    <ul>
      <li>
        Its tabs: a Choice, one of a known set, all visible (guide,{' '}
        <GuideLink to="primitive-choice">§5</GuideLink>: “tab bars’ selection
        behavior”).
      </li>
      <li>
        Unlike a toggle or a segmented control, choosing navigates: the content
        below is the chosen section’s.
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
        The tab bar’s row of the guide’s trait matrix (
        <GuideLink to="trait-matrix">§4</GuideLink>).
      </li>
    </ul>
    <table>
      <tbody>
        <tr>
          <th>Intent</th>
          <td>Navigate</td>
        </tr>
        <tr>
          <th>Data shape</th>
          <td>Set</td>
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
          <td>Window edge</td>
        </tr>
        <tr>
          <th>Layer</th>
          <td>Functional</td>
        </tr>
        <tr>
          <th>Capacity</th>
          <td>~3–6</td>
        </tr>
      </tbody>
    </table>
    <ul>
      <li>
        Not in the matrix’s row: a second Choice in the Region, search, in a
        group of its own beside the sections’ (iOS 26).
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
        <strong>Layer:</strong> the functional layer of Liquid Glass, floating
        over the content, which scrolls beneath it (guide{' '}
        <GuideLink to="layers">§2</GuideLink>); glass is for Regions, content
        stays on the content layer (<GuideLink to="rule-g9">G9</GuideLink>).
      </li>
      <li>
        <strong>Containment:</strong> a Surface holds Regions; a Region holds
        Commands, Choices, search and Items, its tabs (
        <GuideLink to="section-6-containment">§6</GuideLink>). Here: groups of
        tabs in the list, the accessory attached to it.
      </li>
      <li>
        <strong>Navigation move:</strong> a tab bar is the Switch move, changing
        the top-level section (<GuideLink to="move-switch">§7.2</GuideLink>); in
        the tabbed stack, the iPhone’s default shell, each tab holds its own
        Drill stack (<GuideLink to="shell-a">§7.4, shell A</GuideLink>).
      </li>
      <li>
        <strong>Choosing it:</strong> two to five stable sections on a phone
        make a bottom tab bar; on a tablet, it may turn into a sidebar; six or
        more, or user-defined ones, make a sidebar (
        <GuideLink to="section-7-3">§7.3</GuideLink>,{' '}
        <GuideLink to="rule-a3">A3</GuideLink>). The concept stays, only its
        rendering changes (<GuideLink to="rule-g4">G4</GuideLink>): here, the
        list’s <code>size</code> renders the iPad’s tab bar (
        <code>regular</code>), and the <a href="sidebar">Sidebar</a> is a
        component of its own.
      </li>
      <li>
        <strong>Search:</strong> beside the tab bar, as iOS 26’s (
        <GuideLink to="rule-a11">A11</GuideLink>): a Jump move with its own
        Switch slot (<GuideLink to="section-7-6">§7.6</GuideLink>).
      </li>
    </ul>

    <Heading
      id="rules"
      level={2}
    >
      Rules
    </Heading>
    <ul>
      <li>
        <strong>It navigates, never acts</strong> (
        <GuideLink to="rule-a1">A1</GuideLink>,{' '}
        <GuideLink to="rule-g1">G1</GuideLink>): no Add or Compose tab; actions
        go to a <a href="toolbar">Toolbar</a> (
        <GuideLink to="section-7-7">§7.7</GuideLink>).
      </li>
      <li>
        <strong>Its tabs are stable</strong> (
        <GuideLink to="rule-a2">A2</GuideLink>,{' '}
        <GuideLink to="rule-g2">G2</GuideLink>): they don’t appear or disappear
        with state (e.g. after signing in), they’re disabled with an explanation
        at most. Collapsing isn’t hiding: the bar minimizes as a whole, and
        expands again.
      </li>
      <li>
        <strong>Status goes on its tab</strong>: a section’s news as a badge on
        its tab item (<GuideLink to="section-7-5">§7.5</GuideLink>), the
        narrowest scope it describes (<GuideLink to="rule-g8">G8</GuideLink>).
      </li>
    </ul>
    <ul>
      <li>
        Not covered by the guide: the accessory (UIKit’s{' '}
        <code>bottomAccessory</code>, e.g. a mini player).
      </li>
    </ul>
  </>
);
