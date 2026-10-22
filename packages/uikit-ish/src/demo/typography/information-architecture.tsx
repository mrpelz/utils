import { FunctionComponent } from 'react';

import { Contents, Heading, type Section } from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

const HIG = 'https://developer.apple.com/design/human-interface-guidelines';

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['a-foundation', 'A foundation'],
  ['where-it-sits', 'Where it sits'],
  ['what-the-guide-doesnt-cover', 'What the guide doesn’t cover'],
];

/**
 * `/typography/information-architecture`: where the text styles sit, after
 * the HIG-composition guide (“Apple HIG Components — Composition, Shared
 * Traits & a Re-Slicing”).
 */
export const TypographyInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog:{' '}
        <a
          href={`${HIG}/typography`}
          rel="noreferrer"
          target="_blank"
        >
          Typography
        </a>
        , a foundation, not a component.
      </li>
      <li>
        The guide (
        <GuideLink to="section-5-mapping">HIG composition guide</GuideLink>)
        maps no primitive to it: text styles are what its primitives’ text is
        set in.
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
        Every primitive’s text is in a text style: an Item’s slots (title,
        subtitle; guide, <GuideLink to="primitive-item">§5</GuideLink>), a
        Region’s title, a Surface’s.
      </li>
      <li>
        Text of its own (an article) is a Viewer’s content (
        <GuideLink to="primitive-viewer">§5</GuideLink>: text views).
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
        <strong>Layer:</strong> any; on glass (a bar’s title), its weight and
        color are the bar’s (vibrant content).
      </li>
      <li>
        <strong>Dynamic Type:</strong> a size set around a part of the page, its
        components’ text following it.
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
        The styles’ values: Figma “Typography” (“Text styles”, “Dynamic Type”,
        “Dynamic Type – Accessibility Sizes”).
      </li>
      <li>
        Accessibility sizes without tracking (Figma gives none), and Figma’s odd
        values kept (Title 2 at AX2 as Title 1).
      </li>
    </ul>
  </>
);
