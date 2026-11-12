import { FunctionComponent } from 'react';

import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['pickers-in-a-list-group', 'Pickers in a list group'],
];

/** `/accordion/composition`: accordions in lists. */
export const AccordionComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />

    <Heading
      id="pickers-in-a-list-group"
      level={2}
    >
      Pickers in a list group
    </Heading>
    <ul>
      <li>
        Rows that open among a group’s rows, one at a time (for example an
        event’s Starts and Ends pickers), can’t use an Accordion. Its parts
        render elements, while a group’s rows must stay the group’s children.
      </li>
      <li>
        The list has its own version without elements:{' '}
        <PartLink
          component="list"
          part="List.AccordionRoot"
        />
        , with its{' '}
        <PartLink
          component="list"
          part="List.AccordionItem"
        />
        s, and the same props. A{' '}
        <PartLink
          component="date-picker"
          part="DatePicker.Root"
        />{' '}
        with a handle in an item opens and closes with it. See{' '}
        <a href={publicUrl('list/composition#rows-expanding-together')}>
          List: Rows expanding together
        </a>
        .
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const accordionCompositionDemos = [];
