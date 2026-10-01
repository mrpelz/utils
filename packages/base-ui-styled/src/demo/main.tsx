import { FunctionComponent } from 'react';

import { ButtonDemo, ButtonMatrixDemo } from './button.js';
import { EditMenuDemo } from './edit-menu.js';
import { ListDemo, ListIndexDemo } from './list.js';
import { MenuDemo, MenuRegularDemo } from './menu.js';
import { SegmentedDemo } from './segmented.js';
import { SliderDemo } from './slider.js';
import { SwitchDemo } from './switch.js';
import {
  TabBarDemo,
  TabBarRegularDemo,
  TabBarSecondaryDemo,
} from './tab-bar.js';
import { TypographyDemo, TypographyMatrixDemo } from './typography.js';
import { OptionsProvider, StageBackgroundProvider } from './utils/main.js';
import { DemoStyles } from './utils/styles.js';

export const Demo: FunctionComponent = () => (
  <OptionsProvider>
    <StageBackgroundProvider>
      <DemoStyles />

      <ListDemo />
      <ListIndexDemo />
      <TypographyDemo />
      <TypographyMatrixDemo />
      <ButtonDemo />
      <ButtonMatrixDemo />
      <SegmentedDemo />
      <SwitchDemo />
      <SliderDemo />
      <TabBarDemo />
      <TabBarSecondaryDemo />
      <TabBarRegularDemo />
      <MenuDemo />
      <MenuRegularDemo />
      <EditMenuDemo />
    </StageBackgroundProvider>
  </OptionsProvider>
);
