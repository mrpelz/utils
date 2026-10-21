import { FunctionComponent } from 'react';

import { Contents, Heading, type Section } from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

const HIG = 'https://developer.apple.com/design/human-interface-guidelines';

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['not-a-component', 'Not a component'],
  ['the-commit-model', 'The commit model'],
  ['where-it-sits', 'Where it sits'],
];

/**
 * `/form/information-architecture`: where a form sits, after the
 * HIG-composition guide (“Apple HIG Components — Composition, Shared
 * Traits & a Re-Slicing”).
 */
export const FormInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s guidance:{' '}
        <a
          href={`${HIG}/entering-data`}
          rel="noreferrer"
          target="_blank"
        >
          Entering data
        </a>{' '}
        (a pattern); no form component: iOS lays forms out as lists (
        <a href="list">List</a>), their rows inputs.
      </li>
      <li>
        As the guide sees it (<GuideLink to="section-8-2">§8.2</GuideLink>):
        Groups of Items whose trailing slot holds a Choice, a Value input or a
        Text input, and a commit model.
      </li>
    </ul>

    <Heading
      id="not-a-component"
      level={2}
    >
      Not a component
    </Heading>
    <ul>
      <li>
        Forms are Groups of Items whose trailing slot holds a Choice, a Value
        input or a Text input (guide,{' '}
        <GuideLink to="section-8-2">§8.2</GuideLink>); Groups sit in a
        Collection (the grammar,{' '}
        <GuideLink to="section-6-containment">§6</GuideLink>).
      </li>
      <li>
        Here: a <a href="list">List</a> (the Collection), fieldsets its sections
        (Groups), fields its rows (Items).
      </li>
    </ul>

    <Heading
      id="the-commit-model"
      level={2}
    >
      The commit model
    </Heading>
    <ul>
      <li>
        A form either applies each field at once (settings) or defers to a Done
        on its surface (create, edit), not both in one surface (
        <GuideLink to="commit-model">§8.2</GuideLink>).
      </li>
      <li>
        This library’s <code>Form</code> is the second kind: values collected
        and submitted together; the first needs no form, each control’s change
        applied as it happens.
      </li>
      <li>
        Progressive disclosure: a choice reveals the fields below it (the
        guide’s reminder’s date, <GuideLink to="section-8-2">§8.2</GuideLink>
        ).
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
        <strong>Layer:</strong> the content layer, scrolling (guide{' '}
        <GuideLink to="layers">§2</GuideLink>); its Done in the functional
        layer’s bar.
      </li>
      <li>
        <strong>Surface:</strong> a page, or a modal one for a task (a{' '}
        <a href="sheet">Sheet</a>: Cancel and Done in its bar).
      </li>
    </ul>
  </>
);
