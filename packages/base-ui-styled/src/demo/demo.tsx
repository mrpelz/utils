import { FunctionComponent } from 'preact';

import { AccordionDemo } from './accordion.js';
import { ButtonDemo } from './button.js';
import { CollapsibleDemo } from './collapsible.js';

export const Demo: FunctionComponent = () => (
  <>
    <ButtonDemo />
    <AccordionDemo />
    <CollapsibleDemo />
  </>
);
