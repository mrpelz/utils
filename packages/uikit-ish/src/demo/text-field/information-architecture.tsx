import { FunctionComponent } from 'react';

import { Contents, Heading, type Section } from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

const HIG = 'https://developer.apple.com/design/human-interface-guidelines';

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['primitive-text-input', 'Primitive: Text input'],
  ['traits', 'Traits'],
  ['where-it-sits', 'Where it sits'],
  ['what-the-guide-doesnt-cover', 'What the guide doesn’t cover'],
];

/**
 * `/text-field/information-architecture`: where text fields sit, after the
 * HIG-composition guide (“Apple HIG Components — Composition, Shared
 * Traits & a Re-Slicing”).
 */
export const TextFieldInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog:{' '}
        <a
          href={`${HIG}/text-fields`}
          rel="noreferrer"
          target="_blank"
        >
          Text fields
        </a>{' '}
        and{' '}
        <a
          href={`${HIG}/search-fields`}
          rel="noreferrer"
          target="_blank"
        >
          Search fields
        </a>{' '}
        (under Selection and input).
      </li>
      <li>
        As a primitive (
        <GuideLink to="section-5-mapping">HIG composition guide</GuideLink>):{' '}
        <em>Text input</em>, free text with optional structure.
      </li>
    </ul>

    <Heading
      id="primitive-text-input"
      level={2}
    >
      Primitive: Text input
    </Heading>
    <ul>
      <li>
        Text input: absorbs text fields, search fields, token fields, editable
        text views (guide, <GuideLink to="primitive-text-input">§5</GuideLink>
        ).
      </li>
      <li>
        Its parameters here: the purpose (<code>type</code>: generic, search,
        secure, a one-time code’s <code>autoComplete</code>), the suggestions’
        source (a <code>datalist</code>, the app’s rows), single or multi-line
        (a <code>textarea</code>), the input method (iOS’s keyboard, by{' '}
        <code>type</code> and <code>inputMode</code>).
      </li>
      <li>
        Not a Choice: free entry, not a pick from a known set (guide,{' '}
        <GuideLink to="primitive-choice">§5</GuideLink>); a known set with free
        entry is a combo box.
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
        Shared with other inputs (guide, <GuideLink to="traits">§4</GuideLink>
        ): enablement (<code>disabled</code>), validity (its errors), a label.
      </li>
      <li>
        Status at the narrowest scope (guide{' '}
        <GuideLink to="rule-g8">G8</GuideLink>): an error at its field, not the
        form’s or the page’s.
      </li>
      <li>
        Inline feedback before modal (guide{' '}
        <GuideLink to="rule-g5">G5</GuideLink>, the{' '}
        <GuideLink to="modality-ladder">ladder</GuideLink>): an error below the
        field, not an alert.
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
        <strong>Forms:</strong> an Item’s inline control in a Group (guide,{' '}
        <GuideLink to="primitive-item">§5</GuideLink>,{' '}
        <GuideLink to="primitive-group">§5</GuideLink>): a list row in a
        section.
      </li>
      <li>
        <strong>Search:</strong> in a toolbar, a sidebar, or beside the tab bar
        (guide <GuideLink to="rule-a11">A11</GuideLink>), its results a
        Collection.
      </li>
      <li>
        <strong>Surfaces:</strong> an alert’s fields, a sheet’s form (see{' '}
        <a href="sheet/composition">Sheet</a>).
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
        The browser’s constraints (<code>required</code>, lengths, patterns,
        types) and when they’re checked (<code>validationMode</code>).
      </li>
      <li>
        Its layout: a row’s label and value, the clear button while editing
        (UIKit’s).
      </li>
    </ul>
  </>
);
