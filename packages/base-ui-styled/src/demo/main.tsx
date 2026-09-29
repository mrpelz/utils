import { FunctionComponent } from 'react';

import { ButtonDemo, ButtonMatrixDemo } from './button.js';
import { SegmentedDemo } from './segmented.js';
import { SliderDemo } from './slider.js';
import { SwitchDemo } from './switch.js';
import { TabBarDemo, TabBarSecondaryDemo } from './tab-bar.js';
import { OptionsProvider, StageBackgroundProvider } from './utils/main.js';
import { DemoStyles } from './utils/styles.js';

export const Demo: FunctionComponent = () => (
  <OptionsProvider>
    <StageBackgroundProvider>
      <DemoStyles />

      <ButtonDemo />
      <ButtonMatrixDemo />
      <SegmentedDemo />
      <SwitchDemo />
      <SliderDemo />
      <TabBarDemo />
      <TabBarSecondaryDemo />
    </StageBackgroundProvider>
  </OptionsProvider>
);
