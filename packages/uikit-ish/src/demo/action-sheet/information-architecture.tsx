import { FunctionComponent } from 'react';

import { Contents, Heading, type Section } from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

const HIG = 'https://developer.apple.com/design/human-interface-guidelines';

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['primitive-command-set', 'Primitive: Command set'],
  ['modality', 'Modality'],
  ['where-it-sits', 'Where it sits'],
  ['what-the-guide-doesnt-cover', 'What the guide doesn’t cover'],
];

/**
 * `/action-sheet/information-architecture`: where action sheets sit, after
 * the HIG-composition guide (“Apple HIG Components — Composition, Shared
 * Traits & a Re-Slicing”).
 */
export const ActionSheetInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog:{' '}
        <a
          href={`${HIG}/action-sheets`}
          rel="noreferrer"
          target="_blank"
        >
          Action sheets
        </a>{' '}
        (under Presentation).
      </li>
      <li>
        As a primitive (
        <GuideLink to="section-5-mapping">HIG composition guide</GuideLink>): a{' '}
        <em>Command set</em>, anchored to a control, rendered as a sheet
        (compact) or a popover (regular).
      </li>
    </ul>

    <Heading
      id="primitive-command-set"
      level={2}
    >
      Primitive: Command set
    </Heading>
    <ul>
      <li>
        Command set: commands offered together (guide,{' '}
        <GuideLink to="primitive-command-set">§5</GuideLink>); its mapping:
        “anchor = control · rendered as sheet (compact) / popover (regular)”.
      </li>
      <li>
        A sibling of the menu (commands at a control); an action sheet’s are
        about the action just started, a destructive one first.
      </li>
      <li>
        Its host, a Surface: in the guide’s{' '}
        <GuideLink to="surface-family">surface family</GuideLink>, the
        control-anchored, window-modal cell (compact).
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
        the <GuideLink to="modality-ladder">ladder</GuideLink>): window-modal,
        above a transient popover or menu, below an app-modal alert; a press
        outside cancels it.
      </li>
      <li>
        One transient surface at a time (guide{' '}
        <GuideLink to="rule-g3">G3</GuideLink>): it replaces whatever was open
        at its control.
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
        <strong>Layer:</strong> the overlay layer, the page dimmed (guide{' '}
        <GuideLink to="layers">§2</GuideLink>).
      </li>
      <li>
        <strong>Its anchor:</strong> the control that started the action (a
        toolbar’s Delete, a row’s button); without one, the screen’s bottom.
      </li>
      <li>
        <strong>Adapting:</strong> a popover in a regular width (guide{' '}
        <GuideLink to="rule-a6">A6</GuideLink>,{' '}
        <GuideLink to="rule-g4">G4</GuideLink>): the same commands, re-rendered.
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
        Its placement (iOS 26: at its control, above it if there’s no room) and
        its actions’ kinds (secondary, destructive; no preferred one).
      </li>
      <li>
        Focus: moved into it, trapped, returned to its trigger (Base UI’s{' '}
        <code>Popover</code>, modal).
      </li>
    </ul>
  </>
);
