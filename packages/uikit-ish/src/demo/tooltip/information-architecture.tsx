import { FunctionComponent } from 'react';

import { Contents, Heading, type Section } from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['primitive-surface', 'Primitive: Surface'],
  ['modality', 'Modality'],
  ['where-it-sits', 'Where it sits'],
  ['what-the-guide-doesnt-cover', 'What the guide doesn’t cover'],
];

/**
 * `/tooltip/information-architecture`: where tooltips sit, after the
 * HIG-composition guide (“Apple HIG Components — Composition, Shared
 * Traits & a Re-Slicing”).
 */
export const TooltipInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog: none on iOS (macOS’s help tags; on iPadOS, a pointer’s
        labels).
      </li>
      <li>
        As a primitive (
        <GuideLink to="section-5-mapping">HIG composition guide</GuideLink>):
        the smallest <em>Surface</em>, anchored to a control or the pointer,
        transient, hosting a label.
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
        Surface: a bounded plane that hosts content (guide,{' '}
        <GuideLink to="primitive-surface">§5</GuideLink>); its anchor here a
        control (or the pointer: <code>trackCursorAxis</code>), no modality,
        living while hovered or focused.
      </li>
      <li>
        Its content an Item’s label, never a command: nothing in it can be
        pressed.
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
        Below the modality ladder’s first rung (guide{' '}
        <GuideLink to="modality-ladder">ladder</GuideLink>): it takes no
        attention, blocks nothing, needs no dismissal.
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
        <strong>Its anchor:</strong> a symbol-only Command (a toolbar’s button),
        or, held open, any element (a slider’s thumb).
      </li>
      <li>
        <strong>Adapting:</strong> for a pointer only; on touch, what it says
        must be found otherwise.
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
        Its delays (300ms here; a provider’s, then at once between tooltips).
      </li>
      <li>Its look: iOS 26’s glass, as a capsule (no Figma).</li>
    </ul>
  </>
);
