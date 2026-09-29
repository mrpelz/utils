import { FunctionComponent } from 'preact';

import { AccordionDemo } from './accordion.js';
import { AvatarDemo } from './avatar.js';
import { ButtonDemo } from './button.js';
import { CheckboxDemo } from './checkbox.js';
import { CollapsibleDemo } from './collapsible.js';
import { OgButtonDemo } from './og-button.js';
import { SegmentedDemo } from './segmented.js';
import { SliderDemo } from './slider.js';
import { SwitchDemo } from './switch.js';
import { TabBarDemo, TabBarSecondaryDemo } from './tab-bar.js';
import { StageBackgroundProvider } from './utils/main.js';
import { DemoStyles } from './utils/styles.js';

export const Demo: FunctionComponent = () => (
  <StageBackgroundProvider>
    <DemoStyles />

    <ButtonDemo />
    <OgButtonDemo />
    <AccordionDemo />
    <CollapsibleDemo />
    <AvatarDemo />
    <CheckboxDemo />
    <SegmentedDemo />
    <SwitchDemo />
    <SliderDemo />
    <TabBarDemo />
    <TabBarSecondaryDemo />
  </StageBackgroundProvider>
);
