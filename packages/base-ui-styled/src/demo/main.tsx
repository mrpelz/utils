import { FunctionComponent } from 'react';

import { useColorScheme, useTouchActive } from '../styles.js';
import { ActionSheetDemo } from './action-sheet/main.js';
import { ActivityViewDemo } from './activity-view/main.js';
import { AlertDemo } from './alert/main.js';
import { AvatarDemo } from './avatar/main.js';
import { BadgeDemo } from './badge/main.js';
import { ButtonDemo, ButtonMatrixDemo } from './button/main.js';
import { ColorPickerDemo } from './color-picker/main.js';
import { ContextualMenuDemo } from './contextual-menu/main.js';
import {
  DateAndTimePickerDemo,
  DatePickerDemo,
  TimePickerDemo,
} from './date-picker/main.js';
import { EditMenuDemo } from './edit-menu/main.js';
import { FormDemo } from './form/main.js';
import { HeaderDemo } from './header/main.js';
import { LayoutCompactDemo, LayoutDemo } from './layout/main.js';
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
import { MenuDemo, MenuOpenDemo, MenuRegularDemo } from './menu/main.js';
import { NavigationDemo } from './navigation/main.js';
import { PageDemo } from './page/main.js';
import { PageControlDemo } from './page-control/main.js';
import { PopoverDemo } from './popover/main.js';
import { ProgressDemo } from './progress/main.js';
import { RollDemo } from './roll/main.js';
import { SegmentedDemo } from './segmented/main.js';
import { SheetDemo } from './sheet/main.js';
import { SidebarCompactDemo, SidebarDemo } from './sidebar/main.js';
import { SliderDemo } from './slider/main.js';
import { StepperDemo } from './stepper/main.js';
import { SwitchDemo } from './switch/main.js';
import {
  TabBarDemo,
  TabBarRegularDemo,
  TabBarSecondaryDemo,
} from './tab-bar/main.js';
import { TextFieldDemo } from './text-field/main.js';
import {
  ToolbarDemo,
  ToolbarPageDotsDemo,
  ToolbarSymbolsDemo,
  ToolbarTextDemo,
} from './toolbar/main.js';
import { TooltipDemo } from './tooltip/main.js';
import { TypographyDemo, TypographyMatrixDemo } from './typography/main.js';
import { OptionsProvider, useOptions } from './utils/options-context.js';
import { DemoStyles } from './utils/styles.js';
import { ViewportDemo } from './viewport/main.js';

// The forced color scheme (demo option), as the library's `Styles` does.
const ColorScheme: FunctionComponent = () => {
  useColorScheme(useOptions().colorScheme);

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
      <FormDemo />
      <RollDemo />
      <DatePickerDemo />
      <TimePickerDemo />
      <DateAndTimePickerDemo />
      <TabBarDemo />
      <TabBarSecondaryDemo />
      <TabBarRegularDemo />
      <ToolbarDemo />
      <ToolbarPageDotsDemo />
      <ToolbarSymbolsDemo />
      <ToolbarTextDemo />
      <HeaderDemo />
      <PageDemo />
      <LayoutDemo />
      <LayoutCompactDemo />
      <SidebarDemo />
      <SidebarCompactDemo />
      <NavigationDemo />
      <PageControlDemo />
      <BadgeDemo />
      <AvatarDemo />
      <ProgressDemo />
      <PopoverDemo />
      <AlertDemo />
      <ActionSheetDemo />
      <TooltipDemo />
      <SheetDemo />
      <ColorPickerDemo />
      <ActivityViewDemo />
      <MenuOpenDemo />
      <MenuDemo />
      <MenuRegularDemo />
      <ContextualMenuDemo />
      <EditMenuDemo />
      <ViewportDemo />
    </OptionsProvider>
  );
};
