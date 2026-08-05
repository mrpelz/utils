import { FunctionComponent } from 'preact';

import { AccordionDemo } from './demo/accordion.js';
import { AvatarDemo } from './demo/avatar.js';
import { ButtonDemo } from './demo/button.js';
import { CheckboxDemo } from './demo/checkbox.js';
import { CollapsibleDemo } from './demo/collapsible.js';
import { StageBackgroundProvider } from './demo-utils/main.js';

export const Demo: FunctionComponent = () => (
  <StageBackgroundProvider>
    <ButtonDemo />
    <AccordionDemo />
    <CollapsibleDemo />
    <AvatarDemo />
    <CheckboxDemo />
  </StageBackgroundProvider>
);
