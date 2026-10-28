import { FunctionComponent } from 'react';

import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';

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
        Rows opening among a group’s rows, one at a time (e.g. an event’s Starts
        and Ends pickers) can’t be an Accordion: its parts render elements, a
        group’s rows must stay its children.
      </li>
      <li>
        The list’s own, without elements:{' '}
        <PartLink
          component="list"
          part="List.AccordionRoot"
        />{' '}
        (its{' '}
        <PartLink
          component="list"
          part="List.AccordionItem"
        />
        s), the same props; a{' '}
        <PartLink
          component="date-picker"
          part="DatePicker.Root"
        />{' '}
        with a handle in an item opening and closing with it. See{' '}
        <a href="list/composition#rows-expanding-together">
          List: Rows expanding together
        </a>
        .
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const accordionCompositionDemos = [];
