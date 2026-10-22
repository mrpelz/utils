import { FunctionComponent } from 'react';

import { Contents, Heading, type Section } from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

const HIG = 'https://developer.apple.com/design/human-interface-guidelines';

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['primitive-surface', 'Primitive: Surface'],
  ['modality', 'Modality'],
  ['where-it-sits', 'Where it sits'],
  ['what-the-guide-doesnt-cover', 'What the guide doesn’t cover'],
];

/**
 * `/popover/information-architecture`: where popovers sit, after the
 * HIG-composition guide (“Apple HIG Components — Composition, Shared
 * Traits & a Re-Slicing”).
 */
export const PopoverInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog:{' '}
        <a
          href={`${HIG}/popovers`}
          rel="noreferrer"
          target="_blank"
        >
          Popovers
        </a>{' '}
        (under Presentation).
      </li>
      <li>
        As a primitive (
        <GuideLink to="section-5-mapping">HIG composition guide</GuideLink>): a{' '}
        <em>Surface</em>, anchored to a control, transient.
      </li>
    </ul>

    <Heading
      id="primitive-surface"
      level={2}
    >
      Primitive: Surface
    </Heading>
    <ul>
      <li>
        Surface: a bounded plane that hosts content; absorbs windows, panels,
        sheets, popovers (guide,{' '}
        <GuideLink to="primitive-surface">§5</GuideLink>).
      </li>
      <li>
        Its parameters here: anchored to a control (its arrow pointing at it),
        no modality scope (transient: a press outside dismisses it), living
        while it’s used, sized by its content.
      </li>
      <li>
        In the guide’s <GuideLink to="surface-family">surface family</GuideLink>
        : the control-anchored, non-modal cell; a menu beside it
        (element-modal), an action sheet (window-modal, compact).
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
        the <GuideLink to="modality-ladder">ladder</GuideLink>): transient, one
        rung above changing something in place, below a non-modal panel and a
        sheet.
      </li>
      <li>
        One transient surface at a time (guide{' '}
        <GuideLink to="rule-a4">A4</GuideLink>,{' '}
        <GuideLink to="rule-g3">G3</GuideLink>): never a popover from a popover;
        what it opens replaces it, or is a sheet.
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
        <strong>Layer:</strong> the overlay layer, above the content and the
        bars (guide <GuideLink to="layers">§2</GuideLink>).
      </li>
      <li>
        <strong>Its anchor:</strong> a control in the content (a list row’s
        button, a well) or in a bar (a toolbar’s button).
      </li>
      <li>
        <strong>Its own content:</strong> a Region at its top (a toolbar: its
        title, close), then a Collection, a Choice, a Value input.
      </li>
      <li>
        <strong>Adapting:</strong> in a compact width (iPhone), its content as a
        sheet (guide <GuideLink to="rule-a5">A5</GuideLink>,{' '}
        <GuideLink to="rule-g4">G4</GuideLink>): the app’s choice, by its size
        class.
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
        Its placement: its side of the control and its alignment, flipped where
        there’s no room; its arrow following.
      </li>
      <li>
        Focus: moved into it, returned to its trigger; trapped only when modal
        (Base UI’s <code>Popover</code>, a dialog).
      </li>
    </ul>
  </>
);
