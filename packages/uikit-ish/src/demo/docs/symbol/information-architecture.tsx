import { FunctionComponent } from 'react';

import {
  Contents,
  Heading,
  type Section,
} from '../../tooling/guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

const HIG = 'https://developer.apple.com/design/human-interface-guidelines';

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['a-foundation', 'A foundation'],
  ['where-it-sits', 'Where it sits'],
  ['what-the-guide-doesnt-cover', 'What the guide doesn’t cover'],
];

/**
 * `/symbol/information-architecture`: where symbols sit, after the
 * HIG-composition guide (“Apple HIG Components — Composition, Shared
 * Traits & a Re-Slicing”).
 */
export const SymbolInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog:{' '}
        <a
          href={`${HIG}/sf-symbols`}
          rel="noreferrer"
          target="_blank"
        >
          SF Symbols
        </a>
        , a foundation, not a component.
      </li>
      <li>
        The guide (
        <GuideLink to="section-5-mapping">HIG composition guide</GuideLink>)
        maps no primitive to it: a symbol is what fills an Item’s or a Command’s
        visual slot.
      </li>
    </ul>

    <Heading
      id="a-foundation"
      level={2}
    >
      A foundation
    </Heading>
    <ul>
      <li>
        An Item’s leading visual (guide,{' '}
        <GuideLink to="primitive-item">§5</GuideLink>: a row’s image, a tab’s
        symbol).
      </li>
      <li>
        A Command’s look (<GuideLink to="primitive-command">§5</GuideLink>): a
        symbol-only button, named for assistive technology.
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
        <strong>Layer:</strong> its item’s; on glass (a bar’s button, a tab),
        blended with the glass’ content.
      </li>
      <li>
        <strong>Size and weight:</strong> its text’s: a text style around it
        (see <a href="typography">Typography</a>).
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
        The glyphs: <code>@bradleyhodges/sfsymbols</code>’ paths (SF Pro at
        20pt), its weight by stroking or thinning one weight’s outline.
      </li>
      <li>Symbol rendering modes (hierarchical, palette, multicolor): none.</li>
    </ul>
  </>
);
