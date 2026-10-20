import { FunctionComponent } from 'react';

import { Contents, Heading, type Section } from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

const HIG = 'https://developer.apple.com/design/human-interface-guidelines';

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['the-window-as-layers', 'The window as layers'],
  ['anchors-as-regions', 'Anchors as Regions'],
  ['where-it-sits', 'Where it sits'],
  ['what-the-guide-doesnt-cover', 'What the guide doesn’t cover'],
];

/**
 * `/viewport/information-architecture`: where the viewport sits, after
 * the HIG-composition guide (“Apple HIG Components — Composition, Shared
 * Traits & a Re-Slicing”).
 */
export const ViewportInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog: no viewport component. Its{' '}
        <a
          href={`${HIG}/layout`}
          rel="noreferrer"
          target="_blank"
        >
          Layout
        </a>{' '}
        page (“Guides and safe areas”) and its{' '}
        <a
          href={`${HIG}/virtual-keyboards`}
          rel="noreferrer"
          target="_blank"
        >
          Virtual keyboards
        </a>{' '}
        page cover what it keeps clear.
      </li>
      <li>
        As primitives (
        <GuideLink to="section-5">HIG composition guide</GuideLink>
        ): the app’s window (a Surface) as layers, its content layer and the
        Regions at its edges.
      </li>
    </ul>

    <Heading
      id="the-window-as-layers"
      level={2}
    >
      The window as layers
    </Heading>
    <ul>
      <li>
        The guide’s layers (<GuideLink to="layers">§2</GuideLink>): content
        beneath, glass above it.
      </li>
      <li>
        <code>Viewport.Content</code>: the content layer, scrolling.
      </li>
      <li>
        Anchors: where glass bars float, above it (guide{' '}
        <GuideLink to="rule-g9">G9</GuideLink>: glass is for Regions and
        transient Surfaces; content stays on the content layer).
      </li>
    </ul>

    <Heading
      id="anchors-as-regions"
      level={2}
    >
      Anchors as Regions
    </Heading>
    <ul>
      <li>
        Region: an edge-anchored strip of a surface, hosting commands, choices
        or navigation (guide, <GuideLink to="primitive-region">§5</GuideLink>
        ).
      </li>
      <li>
        Its parameters: the edge (<code>edge</code>), capacity, collapse and
        scroll behavior, ownership.
      </li>
      <li>
        An anchor places a Region (a tab bar, a toolbar) at its edge; what fills
        it decides the rest (e.g. a tab bar’s <code>collapsed</code>, set by the
        app from <code>useScrollDirection</code>).
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
        <strong>Containment:</strong> a Surface holds Regions and a Collection
        (guide, <GuideLink to="section-6-containment">§6</GuideLink>): the
        window holds the anchors and the content layer, which holds the pages.
      </li>
      <li>
        <strong>Shells:</strong> a tab bar app (guide{' '}
        <GuideLink to="shell-a">§7.4, shell A</GuideLink>): sections’ pages in
        the content layer, the tab bar at the bottom.
      </li>
      <li>
        <strong>Scrolling:</strong> the guide asks whether scrolling is a
        primitive, as scroll position drives Regions’ behavior (bars shrinking;
        guide <GuideLink to="section-10">§10</GuideLink>, open questions): here,
        the provider’s scroll tracking, for the app to act on.
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
        The visual viewport and the on-screen keyboard’s effect on layout (the
        guide has the keyboard only as a text input’s input method,{' '}
        <GuideLink to="primitive-text-input">§5</GuideLink>): bars pushed up or
        covered, the content resized or overlaid.
      </li>
      <li>The safe area insets kept clear.</li>
    </ul>
  </>
);
