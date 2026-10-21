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
 * `/sheet/information-architecture`: where sheets sit, after the
 * HIG-composition guide (“Apple HIG Components — Composition, Shared
 * Traits & a Re-Slicing”).
 */
export const SheetInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog:{' '}
        <a
          href={`${HIG}/sheets`}
          rel="noreferrer"
          target="_blank"
        >
          Sheets
        </a>{' '}
        (under Presentation).
      </li>
      <li>
        As a primitive (
        <GuideLink to="section-5-mapping">HIG composition guide</GuideLink>): a{' '}
        <em>Surface</em>, window-modal, for a scoped task.
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
        Its parameters here: anchored to the window (from the bottom, or
        centered), modal over its parent, living until its task ends, sized by
        its detent (or a form sheet’s size).
      </li>
      <li>
        A sheet is for a focused, dismissable task that keeps its parent in view
        (guide <GuideLink to="rule-a8">A8</GuideLink>).
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
        above transient surfaces (a popover, a menu), below an app-modal alert.
      </li>
      <li>
        Climb only when a lower rung can’t carry the task: a few options for the
        page may do in a popover or a menu.
      </li>
      <li>
        One transient surface per anchor chain (guide{' '}
        <GuideLink to="rule-g3">G3</GuideLink>): a confirmation over the sheet
        is its own, then gone.
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
        <strong>Over a shell:</strong> any of them (guide,{' '}
        <GuideLink to="section-7-4">§7.4</GuideLink>), its parent dimmed; a
        Detour in navigation’s moves (guide,{' '}
        <GuideLink to="section-7">§7</GuideLink>): a task, then back where you
        were.
      </li>
      <li>
        <strong>Its own content:</strong> a Region at its top (a toolbar:
        Cancel, the title, Done), a Collection or a form; or a stack of its own.
      </li>
      <li>
        <strong>Adapting:</strong> from the bottom on a phone, a form sheet on a
        tablet; the same task (guide <GuideLink to="rule-g4">G4</GuideLink>).
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
        Its detents (medium, large) and its swipe to dismiss; confirming before
        discarding (UIKit’s <code>isModalInPresentation</code>).
      </li>
      <li>
        Focus: moved into it, trapped, returned to its trigger (Base UI’s{' '}
        <code>Drawer</code>, a dialog).
      </li>
    </ul>
  </>
);
