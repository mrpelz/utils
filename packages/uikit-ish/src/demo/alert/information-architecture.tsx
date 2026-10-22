import { FunctionComponent } from 'react';

import { Contents, Heading, type Section } from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

const HIG = 'https://developer.apple.com/design/human-interface-guidelines';

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['primitives-surface-and-command-set', 'Primitives: Surface and Command set'],
  ['modality', 'Modality'],
  ['where-it-sits', 'Where it sits'],
  ['what-the-guide-doesnt-cover', 'What the guide doesn’t cover'],
];

/**
 * `/alert/information-architecture`: where alerts sit, after the
 * HIG-composition guide (“Apple HIG Components — Composition, Shared
 * Traits & a Re-Slicing”).
 */
export const AlertInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog:{' '}
        <a
          href={`${HIG}/alerts`}
          rel="noreferrer"
          target="_blank"
        >
          Alerts
        </a>{' '}
        (under Presentation).
      </li>
      <li>
        As primitives (
        <GuideLink to="section-5-mapping">HIG composition guide</GuideLink>): a{' '}
        <em>Surface</em> hosting a <em>Command set</em>, app-modal.
      </li>
    </ul>

    <Heading
      id="primitives-surface-and-command-set"
      level={2}
    >
      Primitives: Surface and Command set
    </Heading>
    <ul>
      <li>
        Surface: a bounded plane that hosts content (guide,{' '}
        <GuideLink to="primitive-surface">§5</GuideLink>); here centered, not
        anchored to a control, app-modal, living until it’s answered.
      </li>
      <li>
        Its actions a Command set (
        <GuideLink to="primitive-command-set">§5</GuideLink>): one to three
        commands, and a message (the guide’s mapping: “app-modal · 1–3 commands
        · message”).
      </li>
      <li>
        In the guide’s <GuideLink to="surface-family">surface family</GuideLink>
        : the only centered, app-modal cell.
      </li>
    </ul>

    <Heading
      id="modality"
      level={2}
    >
      Modality
    </Heading>
    <ul>
      <li>
        On the modality ladder (guide <GuideLink to="rule-g5">G5</GuideLink>,
        the <GuideLink to="modality-ladder">ladder</GuideLink>): app-modal, the
        top rung but the system’s; each rung up costs context and attention.
      </li>
      <li>
        A last resort (guide <GuideLink to="rule-a7">A7</GuideLink>): prefer
        inline feedback, or undo; confirm only what can’t be undone.
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
        <strong>Layer:</strong> the overlay layer, above everything, the page
        dimmed (guide <GuideLink to="layers">§2</GuideLink>).
      </li>
      <li>
        <strong>Its own content:</strong> a title and a message, text fields (a
        Text input or two), its commands.
      </li>
      <li>
        <strong>Adapting:</strong> the same in every size class.
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
        Its actions’ kinds (secondary, primary, destructive) and their layout:
        side by side, stacked from three.
      </li>
      <li>
        Focus: moved into it, trapped, returned to its trigger (Base UI’s{' '}
        <code>AlertDialog</code>).
      </li>
    </ul>
  </>
);
