import { FunctionComponent } from 'preact';

import { AccordionDemo } from './accordion.js';
import { AvatarDemo } from './avatar.js';
import { ButtonDemo } from './button.js';
import { CheckboxDemo } from './checkbox.js';
import { CollapsibleDemo } from './collapsible.js';
import { StageBackgroundProvider } from './utils/main.js';
import { DemoStyles } from './utils/styles.js';

export const Demo: FunctionComponent = () => (
  <StageBackgroundProvider>
    <DemoStyles />

    <ButtonDemo />
    <AccordionDemo />
    <CollapsibleDemo />
    <AvatarDemo />
    <CheckboxDemo />
  </StageBackgroundProvider>
);
