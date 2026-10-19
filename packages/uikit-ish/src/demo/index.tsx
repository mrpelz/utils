import { FunctionComponent } from 'react';

import * as components from '../components/index.js';
import { useTouchActive } from '../styles.js';
import { ActionSheetDemo } from './action-sheet/main.js';
import {
  ActivityViewDemo,
  ActivityViewPopoverDemo,
} from './activity-view/main.js';
import { AlertDemo } from './alert/main.js';
import { AvatarDemo } from './avatar/main.js';
import { BadgeDemo } from './badge/main.js';
import { ButtonDemo, ButtonMatrixDemo } from './button/main.js';
import { CheckboxDemo, CheckboxRadioDemo } from './checkbox/main.js';
import { ColorPickerDemo } from './color-picker/main.js';
import { ContextualMenuDemo } from './contextual-menu/main.js';
import {
  DateAndTimePickerDemo,
  DatePickerDemo,
  DatePickerFooterDemo,
  DatePickerRangeDemo,
  TimePickerDemo,
} from './date-picker/main.js';
import { EditMenuDemo } from './edit-menu/main.js';
import { FormDemo } from './form/main.js';
import { HeaderDemo, HeaderTitleDemo } from './header/main.js';
import { LayoutCompactDemo, LayoutDemo } from './layout/main.js';
import {
  ListCollapsibleDemo,
  ListDemo,
  ListEditDeleteDemo,
  ListEditDemo,
  ListEditInsertDemo,
  ListEditSelectDemo,
  ListEditSelectSingleDemo,
  ListFormDemo,
  ListIndexDemo,
  ListMailDemo,
  ListPartsDemo,
  ListSegmentedDemo,
  ListSwipeDemo,
} from './list/main.js';
import {
  MenuDemo,
  MenuOpenDemo,
  MenuPopUpDemo,
  MenuRegularDemo,
  MenuTogglesDemo,
} from './menu/main.js';
import { NavigationDemo } from './navigation/main.js';
import { PageDemo } from './page/main.js';
import { PageControlDemo } from './page-control/main.js';
import { PopoverDemo } from './popover/main.js';
import { ProgressDemo } from './progress/main.js';
import { RollDemo } from './roll/main.js';
import { SegmentedDemo } from './segmented/main.js';
import { SheetDemo } from './sheet/main.js';
import {
  SidebarCompactDemo,
  SidebarDemo,
  SidebarEditingDemo,
} from './sidebar/main.js';
import { SliderDemo } from './slider/main.js';
import { StepperDemo } from './stepper/main.js';
import { SwitchDemo } from './switch/main.js';
import { SymbolDemo } from './symbol/main.js';
import {
  TabBarAccessoryDemo,
  TabBarContentDemo,
  TabBarDemo,
  TabBarMixedDemo,
  TabBarRegularDemo,
  TabBarScrollDemo,
  TabBarSearchDemo,
} from './tab-bar/main.js';
import { TextFieldDemo } from './text-field/main.js';
import {
  ToolbarDemo,
  ToolbarPageDotsDemo,
  ToolbarSymbolsDemo,
  ToolbarTextDemo,
} from './toolbar/main.js';
import { TooltipDemo } from './tooltip/main.js';
import {
  TypographyDemo,
  TypographyMatrixDemo,
  TypographySizesDemo,
} from './typography/main.js';
import { nameComponents } from './utils/code.js';
import { Component } from './utils/main.js';
import {
  ViewportAnchorsDemo,
  ViewportBarDemo,
  ViewportDemo,
} from './viewport/main.js';

// (Named for the code shown, see `renderCode`.)
nameComponents(components);

export const DemoIndex: FunctionComponent = () => {
  // Pressed states on touch (iOS Safari), as the library's `Styles` does.
  useTouchActive();

  return (
    <>
      <Component
        id="404"
        title="404"
      >
        <a href="404">404</a>
      </Component>
      <ViewportDemo />
      <ViewportBarDemo />
      <ViewportAnchorsDemo />
      <ListDemo />
      <ListPartsDemo />
      <ListCollapsibleDemo />
      <ListSwipeDemo />
      <ListEditDemo />
      <ListEditDeleteDemo />
      <ListEditInsertDemo />
      <ListEditSelectDemo />
      <ListEditSelectSingleDemo />
      <ListIndexDemo />
      <ListMailDemo />
      <ListSegmentedDemo />
      <ListFormDemo />
      <TypographyDemo />
      <TypographyMatrixDemo />
      <TypographySizesDemo />
      <ButtonDemo />
      <ButtonMatrixDemo />
      <SegmentedDemo />
      <SwitchDemo />
      <CheckboxDemo />
      <CheckboxRadioDemo />
      <SliderDemo />
      <StepperDemo />
      <TextFieldDemo />
      <FormDemo />
      <RollDemo />
      <DatePickerDemo />
      <DatePickerRangeDemo />
      <TimePickerDemo />
      <DateAndTimePickerDemo />
      <DatePickerFooterDemo />
      <TabBarDemo />
      <TabBarSearchDemo />
      <TabBarMixedDemo />
      <TabBarContentDemo />
      <TabBarAccessoryDemo />
      <TabBarScrollDemo />
      <TabBarRegularDemo />
      <ToolbarDemo />
      <ToolbarPageDotsDemo />
      <ToolbarSymbolsDemo />
      <ToolbarTextDemo />
      <HeaderDemo />
      <HeaderTitleDemo />
      <PageDemo />
      <LayoutDemo />
      <LayoutCompactDemo />
      <SidebarDemo />
      <SidebarCompactDemo />
      <SidebarEditingDemo />
      <NavigationDemo />
      <PageControlDemo />
      <BadgeDemo />
      <SymbolDemo />
      <AvatarDemo />
      <ProgressDemo />
      <PopoverDemo />
      <AlertDemo />
      <ActionSheetDemo />
      <TooltipDemo />
      <SheetDemo />
      <ColorPickerDemo />
      <ActivityViewDemo />
      <ActivityViewPopoverDemo />
      <MenuOpenDemo />
      <MenuDemo />
      <MenuRegularDemo />
      <MenuTogglesDemo />
      <MenuPopUpDemo />
      <ContextualMenuDemo />
      <EditMenuDemo />
    </>
  );
};
