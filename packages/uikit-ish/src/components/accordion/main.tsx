import './style.css';

import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import { ComponentProps, forwardRef } from 'react';

import { cn } from '../utils/main.js';

// Base UI's Accordion (collapsibles, one open at a time unless `multiple`),
// its panels opening and closing in place as a list's collapsible rows do
// (see `List.AccordionPanel`): their height and opacity transitioning
// (300ms). Its other parts are Base UI's, rendered by what they collapse
// and toggle (e.g. an item a `List.Section`, its trigger in a
// `List.Header`, its panel a `List.Group`).
//
// Deviations: none (Base UI's, styled).

/** Base UI's `Accordion.Panel`, its height and opacity transitioning. */
const Panel = forwardRef<
  HTMLDivElement,
  Omit<ComponentProps<typeof BaseAccordion.Panel>, 'ref'>
>(({ className, ...props }, ref) => (
  <BaseAccordion.Panel
    ref={ref}
    className={cn('uikit-accordion-panel', className)}
    data-accordion-part="panel"
    {...props}
  />
));

export const Accordion = {
  ...BaseAccordion,
  Panel,
};
