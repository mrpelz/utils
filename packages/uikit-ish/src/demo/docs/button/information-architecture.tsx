import { FunctionComponent } from 'react';

import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

const HIG = 'https://developer.apple.com/design/human-interface-guidelines';

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['primitive-command', 'Primitive: Command'],
  ['one-command-many-hosts', 'One command, many hosts'],
  ['where-it-sits', 'Where it sits'],
  ['what-the-guide-doesnt-cover', 'What the guide doesn’t cover'],
];

/**
 * `/button/information-architecture`: where buttons sit, after the
 * HIG-composition guide (“Apple HIG Components — Composition, Shared
 * Traits & a Re-Slicing”).
 */
export const ButtonInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog:{' '}
        <a
          href={`${HIG}/buttons`}
          rel="noreferrer"
          target="_blank"
        >
          Buttons
        </a>{' '}
        (under Menus and actions).
      </li>
      <li>
        As a primitive (
        <GuideLink to="section-5-mapping">HIG composition guide</GuideLink>): a{' '}
        <em>Command</em>, rendered inline.
      </li>
    </ul>

    <Heading
      id="primitive-command"
      level={2}
    >
      Primitive: Command
    </Heading>
    <ul>
      <li>
        Command: one invocable action with a stable identity: name, symbol,
        enablement, destructive flag (guide,{' '}
        <GuideLink to="primitive-command">§5</GuideLink>).
      </li>
      <li>
        Here: its name a{' '}
        <PartLink
          component="button"
          part="Button.Label"
        />{' '}
        (or <code>aria-label</code>), its symbol a{' '}
        <PartLink
          component="button"
          part="Button.Icon"
        />
        , its enablement <code>disabled</code> (or no <code>onClick</code>), its
        flag <code>destructive</code>.
      </li>
      <li>
        Its style is its prominence in a view, not its identity: the same
        command borderless in one place, prominent in another.
      </li>
    </ul>

    <Heading
      id="one-command-many-hosts"
      level={2}
    >
      One command, many hosts
    </Heading>
    <ul>
      <li>
        A command is defined once and projected into any number of hosts (guide{' '}
        <GuideLink to="rule-g6">G6</GuideLink>): a button in the page, a{' '}
        <a href="toolbar">Toolbar</a>’s, a <a href="menu">Menu</a>’s item, a{' '}
        <a href="contextual-menu">Contextual menu</a>’s.
      </li>
      <li>
        Several commands together are a Command set (guide,{' '}
        <GuideLink to="primitive-command-set">§5</GuideLink>): a toolbar’s
        capsule, a menu, an <a href="action-sheet">Action sheet</a>; a button is
        often its anchor.
      </li>
      <li>
        A destructive command confirmed: the lowest modality that works (guide{' '}
        <GuideLink to="rule-g5">G5</GuideLink>, the{' '}
        <GuideLink to="modality-ladder">ladder</GuideLink>): undo before an
        alert.
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
        <strong>In content:</strong> on the content layer, classic styles (
        <code>borderless</code>, <code>bordered</code>, prominent): a page’s, a
        sheet’s, a list row’s.
      </li>
      <li>
        <strong>Over content:</strong> glass, floating above it (guide{' '}
        <GuideLink to="rule-g9">G9</GuideLink>, the{' '}
        <GuideLink to="layers">layers</GuideLink>): a bar’s, or a control of its
        own over media.
      </li>
      <li>
        <strong>As an anchor:</strong> what a transient surface opens from (a
        menu, a popover), or what presents a sheet or an alert (a trigger’s{' '}
        <code>render</code>).
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
        Its look: styles, sizes, shapes (glass too); and its hit region
        (44×44px).
      </li>
      <li>
        Navigation through a button: going somewhere is a Drill (a row, a link),
        not a command (guide <GuideLink to="rule-g1">G1</GuideLink>).
      </li>
    </ul>
  </>
);
