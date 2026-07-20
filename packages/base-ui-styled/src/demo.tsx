import { FunctionComponent } from 'preact';

import { AccordionDemo } from './demo/accordion.js';
import { ButtonDemo } from './demo/button.js';
import { CollapsibleDemo } from './demo/collapsible.js';
import { StageBackgroundProvider } from './demo/utils/main.js';

export const Demo: FunctionComponent = () => (
  <StageBackgroundProvider>
    <ButtonDemo />
    <AccordionDemo />
    <CollapsibleDemo />
  </StageBackgroundProvider>
);
