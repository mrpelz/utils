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
  ['a-region-of-commands', 'A Region of commands'],
  ['commands-and-command-sets', 'Commands and command sets'],
  ['where-it-sits', 'Where it sits'],
  ['what-the-guide-doesnt-cover', 'What the guide doesn’t cover'],
];

/**
 * `/toolbar/information-architecture`: where toolbars sit, after the
 * HIG-composition guide (“Apple HIG Components — Composition, Shared
 * Traits & a Re-Slicing”).
 */
export const ToolbarInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog:{' '}
        <a
          href={`${HIG}/toolbars`}
          rel="noreferrer"
          target="_blank"
        >
          Toolbars
        </a>{' '}
        (under Menus and actions), navigation bars included.
      </li>
      <li>
        As primitives (
        <GuideLink to="section-5-mapping">HIG composition guide</GuideLink>): a
        Region at the top or bottom edge, holding Commands (and Choices).
      </li>
    </ul>

    <Heading
      id="a-region-of-commands"
      level={2}
    >
      A Region of commands
    </Heading>
    <ul>
      <li>
        Region: an edge-anchored strip of a surface, hosting commands, choices
        or navigation (guide, <GuideLink to="primitive-region">§5</GuideLink>
        ); it absorbs toolbars, navigation bars included.
      </li>
      <li>
        Its parameters here: the edge (<code>placement</code>), capacity (the
        sides’ capsules), ownership (the view whose commands they are).
      </li>
      <li>
        Glass, above the content layer (guide{' '}
        <GuideLink to="rule-g9">G9</GuideLink>, the{' '}
        <GuideLink to="layers">layers</GuideLink>): capsules float over what
        scrolls beneath.
      </li>
      <li>
        Toolbars hold actions; tab bars navigate (guide{' '}
        <GuideLink to="rule-a1">A1</GuideLink>): switching sections is a{' '}
        <a href="tab-bar">Tab bar</a>’s.
      </li>
    </ul>

    <Heading
      id="commands-and-command-sets"
      level={2}
    >
      Commands and command sets
    </Heading>
    <ul>
      <li>
        Each button: a Command (guide,{' '}
        <GuideLink to="primitive-command">§5</GuideLink>), one invocable action
        with a name and a symbol.
      </li>
      <li>
        A capsule (
        <PartLink
          component="toolbar"
          part="Toolbar.Group"
        />
        ): a Command set (guide,{' '}
        <GuideLink to="primitive-command-set">§5</GuideLink>), commands that
        belong together.
      </li>
      <li>
        Commands are defined once and projected into several hosts (guide{' '}
        <GuideLink to="rule-g6">G6</GuideLink>): the toolbar is one host; a menu
        or a contextual menu may show the same command.
      </li>
      <li>
        Regions act on the selection, Collections own it (guide{' '}
        <GuideLink to="rule-g7">G7</GuideLink>): an edit-mode bar reads the
        list’s selection, holding none of its own (see{' '}
        <a href="toolbar/composition#edit-mode">Composition</a>).
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
        <strong>Shells:</strong> a navigation stack’s top bar (guide{' '}
        <GuideLink to="shell-a">§7.4, shell A</GuideLink>): back, the title, a
        command set (see <a href="header">Header</a>).
      </li>
      <li>
        <strong>Search:</strong> in a toolbar, a sidebar, or beside the tab bar
        (guide <GuideLink to="rule-a11">A11</GuideLink>; see{' '}
        <a href="toolbar/composition#a-search-field">Composition</a>).
      </li>
      <li>
        <strong>Controls:</strong> a Choice between the capsules (a segmented
        control), or a Collection’s projection (page dots).
      </li>
    </ul>

    <Heading
      id="what-the-guide-doesnt-cover"
      level={2}
    >
      What the guide doesn’t cover
    </Heading>
    <ul>
      <li>
        The keyboard: the bar as one tab stop, arrow keys between its commands
        (Base UI’s <code>toolbar</code>).
      </li>
      <li>
        A toolbar’s layout: sides sharing the free space, so a title stays
        centered; capsules’ sizes by edge.
      </li>
    </ul>
  </>
);
