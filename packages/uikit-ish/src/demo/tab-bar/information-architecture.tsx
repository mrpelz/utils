import { FunctionComponent } from 'react';

import { GuideLink } from '../hig-guide/link.js';

const HIG = 'https://developer.apple.com/design/human-interface-guidelines';

/**
 * `/tab-bar/information-architecture`: where a tab bar sits, after the
 * HIG-composition guide (“Apple HIG Components — Composition, Shared
 * Traits & a Re-Slicing”).
 */
export const TabBarInformationArchitecture: FunctionComponent = () => (
  <>
    <p className="demo-lead">
      In Apple’s catalog,{' '}
      <a
        href={`${HIG}/tab-bars`}
        rel="noreferrer"
        target="_blank"
      >
        tab bars
      </a>{' '}
      are under “Navigation and search”. Re-sliced into primitives (after the{' '}
      <GuideLink to="section-5">HIG composition guide</GuideLink>), a tab bar is
      two of them: a <em>Region</em> at the window’s bottom edge, holding a
      navigating <em>Choice</em> of the app’s sections (
      <GuideLink to="section-5-mapping">§5, mapping</GuideLink>).
    </p>

    <h2>Primitives: Region + Choice</h2>
    <p>
      A Region is an edge-anchored strip of a surface hosting commands, choices
      or navigation; its parameters are the edge, capacity, collapse and scroll
      behavior, and ownership (guide,{' '}
      <GuideLink to="primitive-region">§5</GuideLink>). A tab bar is the bottom
      Region of an app’s window, its capacity about three to six tabs, owned by
      the app. Its collapse behavior is this library’s <code>collapsed</code>,
      which the app sets (e.g. while scrolling down).
    </p>
    <p>
      Its tabs are a Choice: one of a known set, all visible at once (guide,{' '}
      <GuideLink to="primitive-choice">§5</GuideLink>, which counts “tab bars’
      selection behavior” among the Choices). Unlike a toggle or a segmented
      control, choosing navigates: the content below is the chosen section’s.
    </p>

    <h2>Traits</h2>
    <p>
      The tab bar’s row of the guide’s trait matrix (
      <GuideLink to="trait-matrix">§4</GuideLink>):
    </p>
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
    <p>
      This library’s groups add a second Choice to the Region: search, in a
      group of its own beside the sections’ (as iOS 26’s), which the matrix’s
      row leaves out.
    </p>

    <h2>Where it sits</h2>
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

    <h2>Rules</h2>
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
    <p>
      The accessory (UIKit’s <code>bottomAccessory</code>, e.g. a mini player)
      isn’t covered by the guide.
    </p>
  </>
);
