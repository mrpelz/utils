import { FunctionComponent } from 'react';

import { Contents, Heading, type Section } from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

const HIG = 'https://developer.apple.com/design/human-interface-guidelines';

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['primitive-collection', 'Primitive: Collection'],
  ['traits', 'Traits'],
  ['where-it-sits', 'Where it sits'],
];

/**
 * `/page-control/information-architecture`: where a page control sits,
 * after the HIG-composition guide (“Apple HIG Components — Composition,
 * Shared Traits & a Re-Slicing”).
 */
export const PageControlInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog:{' '}
        <a
          href={`${HIG}/page-controls`}
          rel="noreferrer"
          target="_blank"
        >
          Page controls
        </a>
        , under “Presentation”, which the guide finds misplaced: a content
        mechanic, not a presentation (
        <GuideLink to="section-3-categories">§3</GuideLink>).
      </li>
      <li>
        As a primitive (
        <GuideLink to="section-5">HIG composition guide</GuideLink>): a{' '}
        <em>Collection</em> projected as dots.
      </li>
    </ul>

    <Heading
      id="primitive-collection"
      level={2}
    >
      Primitive: Collection
    </Heading>
    <ul>
      <li>
        Collection: a set of items with a data shape and a projection (guide,{' '}
        <GuideLink to="primitive-collection">§5</GuideLink>).
      </li>
      <li>
        Parameters: shape (flat, sectioned, tree), projection (rows, grid,
        columns, breadcrumb, pages), selection (none, one, many), editability.
      </li>
      <li>
        A page control: a flat sequence, projected as dots, one selected (the{' '}
        <GuideLink to="section-5-mapping">mapping table</GuideLink>: “sequence ·
        single”). The pages themselves are the collection’s other projection, a
        page per screen.
      </li>
      <li>
        Its navigation move is <em>Step</em>: to a sibling at the same level (
        <GuideLink to="move-step">§7.2</GuideLink>), as swipe paging and
        next/previous commands are.
      </li>
      <li>
        Apple’s own clusters put it with tab bars, sidebars and segmented
        controls, under “switch between sibling sections” (
        <GuideLink to="section-3-clusters">§3</GuideLink>); the guide’s moves
        tell them apart: those <em>Switch</em> sections, a page control{' '}
        <em>Steps</em> through a sequence.
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
        The page control’s row of the guide’s trait matrix (
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
          <td>Sequence</td>
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
          <td>Content edge</td>
        </tr>
        <tr>
          <th>Layer</th>
          <td>Content</td>
        </tr>
        <tr>
          <th>Capacity</th>
          <td>~10</td>
        </tr>
      </tbody>
    </table>
    <ul>
      <li>
        Beyond the capacity: more than 7 pages show as a window of 8 dots, the
        outermost shrinking towards the pages beyond.
      </li>
      <li>
        The matrix places it in the content layer; in a toolbar (its glass
        variant), it sits in the functional layer’s bar instead.
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
        <strong>Layer:</strong> plain, at the edge of the content it pages (an
        onboarding’s screens); on glass, in the functional layer’s bars (guide{' '}
        <GuideLink to="layers">§2</GuideLink>), e.g. Weather’s toolbar.
      </li>
      <li>
        <strong>Containment:</strong> a Surface holds Regions and a Collection
        (the grammar, <GuideLink to="section-6-containment">§6</GuideLink>
        ): plain, the page control is beside the pages in their Surface; in a
        toolbar, in a Region, whose grammar lists commands, choices, text input
        and items, not a collection’s projection.
      </li>
      <li>
        <strong>Navigation:</strong> one move, Step; the content swipes the same
        way (swipe paging), the dots tell where in the sequence it is (
        <GuideLink to="section-7-2">§7.2</GuideLink>).
      </li>
    </ul>
  </>
);
