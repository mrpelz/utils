import { FunctionComponent, useContext } from 'react';

import { useColorScheme, useTouchActive } from '../styles.js';
import { ButtonDemo, ButtonMatrixDemo } from './button.js';
import { EditMenuDemo } from './edit-menu.js';
import {
  ListDemo,
  ListEditDemo,
  ListIndexDemo,
  ListMailDemo,
  ListSwipeDemo,
} from './list.js';
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
import { OptionsContext, OptionsProvider } from './utils/options-context.js';
import { DemoStyles } from './utils/styles.js';

// The forced color scheme (demo option), as the library's `Styles` does.
const ColorScheme: FunctionComponent = () => {
  useColorScheme(useContext(OptionsContext).colorScheme);

  return null;
};

export const Demo: FunctionComponent = () => {
  // Pressed states on touch (iOS Safari), as the library's `Styles` does.
  useTouchActive();

  return (
    <OptionsProvider>
      <DemoStyles />
      <ColorScheme />

      <ListDemo />
      <ListSwipeDemo />
      <ListEditDemo />
      <ListIndexDemo />
      <ListMailDemo />
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
    </OptionsProvider>
  );
};
