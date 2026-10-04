import { FunctionComponent, useContext } from 'react';

import { useColorScheme, useTouchActive } from '../styles.js';
import { ButtonDemo, ButtonMatrixDemo } from './button/main.js';
import {
  DateAndTimePickerDemo,
  DatePickerDemo,
  TimePickerDemo,
} from './date-picker/main.js';
import { EditMenuDemo } from './edit-menu/main.js';
import { HapticsDemo } from './haptics/main.js';
import {
  ListDemo,
  ListEditDemo,
  ListFormDemo,
  ListIndexDemo,
  ListMailDemo,
  ListPartsDemo,
  ListSegmentedDemo,
  ListSwipeDemo,
} from './list/main.js';
import { MenuDemo, MenuRegularDemo } from './menu/main.js';
import { RollDemo } from './roll/main.js';
import { SegmentedDemo } from './segmented/main.js';
import { SliderDemo } from './slider/main.js';
import { StepperDemo } from './stepper/main.js';
import { SwitchDemo } from './switch/main.js';
import {
  TabBarDemo,
  TabBarRegularDemo,
  TabBarSecondaryDemo,
} from './tab-bar/main.js';
import { TextFieldDemo } from './text-field/main.js';
import { TypographyDemo, TypographyMatrixDemo } from './typography/main.js';
import { OptionsContext, OptionsProvider } from './utils/options-context.js';
import { DemoStyles } from './utils/styles.js';
import { ViewportDemo } from './viewport/main.js';

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
      <ListPartsDemo />
      <ListSwipeDemo />
      <ListEditDemo />
      <ListIndexDemo />
      <ListMailDemo />
      <ListSegmentedDemo />
      <ListFormDemo />
      <TypographyDemo />
      <TypographyMatrixDemo />
      <ButtonDemo />
      <ButtonMatrixDemo />
      <SegmentedDemo />
      <SwitchDemo />
      <SliderDemo />
      <StepperDemo />
      <TextFieldDemo />
      <RollDemo />
      <DatePickerDemo />
      <TimePickerDemo />
      <DateAndTimePickerDemo />
      <TabBarDemo />
      <TabBarSecondaryDemo />
      <TabBarRegularDemo />
      <MenuDemo />
      <MenuRegularDemo />
      <EditMenuDemo />
      <HapticsDemo />
      <ViewportDemo />
    </OptionsProvider>
  );
};
