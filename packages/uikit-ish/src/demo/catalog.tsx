import { FunctionComponent } from 'react';

import { ActionSheetDemo } from './action-sheet/main.js';
import {
  ActivityViewDemo,
  ActivityViewPopoverDemo,
} from './activity-view/main.js';
import { AlertDemo } from './alert/main.js';
import { AvatarDemo } from './avatar/main.js';
import { BadgeDemo } from './badge/main.js';
import {
  ButtonComposition,
  buttonCompositionDemos,
} from './button/composition.js';
import { ButtonInformationArchitecture } from './button/information-architecture.js';
import { ButtonDemo, ButtonMatrixDemo } from './button/main.js';
import { ButtonOverview, buttonOverviewDemos } from './button/overview.js';
import { ButtonParts, buttonPartsDemos } from './button/parts.js';
import {
  CheckboxComposition,
  checkboxCompositionDemos,
} from './checkbox/composition.js';
import { CheckboxInformationArchitecture } from './checkbox/information-architecture.js';
import { CheckboxDemo, CheckboxRadioDemo } from './checkbox/main.js';
import {
  CheckboxOverview,
  checkboxOverviewDemos,
} from './checkbox/overview.js';
import { CheckboxParts, checkboxPartsDemos } from './checkbox/parts.js';
import {
  ColorPickerComposition,
  colorPickerCompositionDemos,
} from './color-picker/composition.js';
import { ColorPickerInformationArchitecture } from './color-picker/information-architecture.js';
import { ColorPickerDemo } from './color-picker/main.js';
import {
  ColorPickerOverview,
  colorPickerOverviewDemos,
} from './color-picker/overview.js';
import {
  ColorPickerParts,
  colorPickerPartsDemos,
} from './color-picker/parts.js';
import { ContextualMenuDemo } from './contextual-menu/main.js';
import {
  DatePickerComposition,
  datePickerCompositionDemos,
} from './date-picker/composition.js';
import { DatePickerInformationArchitecture } from './date-picker/information-architecture.js';
import {
  DateAndTimePickerDemo,
  DatePickerDemo,
  DatePickerFooterDemo,
  DatePickerRangeDemo,
  TimePickerDemo,
} from './date-picker/main.js';
import {
  DatePickerOverview,
  datePickerOverviewDemos,
} from './date-picker/overview.js';
import { DatePickerParts, datePickerPartsDemos } from './date-picker/parts.js';
import { EditMenuDemo } from './edit-menu/main.js';
import { FormComposition, formCompositionDemos } from './form/composition.js';
import { FormInformationArchitecture } from './form/information-architecture.js';
import { FormDemo } from './form/main.js';
import { FormOverview, formOverviewDemos } from './form/overview.js';
import { FormParts, formPartsDemos } from './form/parts.js';
import {
  HeaderComposition,
  headerCompositionDemos,
} from './header/composition.js';
import { HeaderInformationArchitecture } from './header/information-architecture.js';
import { HeaderDemo, HeaderTitleDemo } from './header/main.js';
import { HeaderOverview, headerOverviewDemos } from './header/overview.js';
import { HeaderParts, headerPartsDemos } from './header/parts.js';
import {
  LayoutComposition,
  layoutCompositionDemos,
} from './layout/composition.js';
import { LayoutInformationArchitecture } from './layout/information-architecture.js';
import { LayoutCompactDemo, LayoutDemo } from './layout/main.js';
import { LayoutOverview, layoutOverviewDemos } from './layout/overview.js';
import { LayoutParts, layoutPartsDemos } from './layout/parts.js';
import { ListComposition, listCompositionDemos } from './list/composition.js';
import { ListInformationArchitecture } from './list/information-architecture.js';
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
import { ListOverview, listOverviewDemos } from './list/overview.js';
import { ListParts, listPartsDemos } from './list/parts.js';
import {
  MenuDemo,
  MenuOpenDemo,
  MenuPopUpDemo,
  MenuRegularDemo,
  MenuTogglesDemo,
} from './menu/main.js';
import {
  NavigationComposition,
  navigationCompositionDemos,
} from './navigation/composition.js';
import { NavigationInformationArchitecture } from './navigation/information-architecture.js';
import { NavigationDemo } from './navigation/main.js';
import {
  NavigationOverview,
  navigationOverviewDemos,
} from './navigation/overview.js';
import { NavigationParts, navigationPartsDemos } from './navigation/parts.js';
import { PageComposition, pageCompositionDemos } from './page/composition.js';
import { PageInformationArchitecture } from './page/information-architecture.js';
import { PageDemo } from './page/main.js';
import { PageOverview, pageOverviewDemos } from './page/overview.js';
import { PageParts, pagePartsDemos } from './page/parts.js';
import {
  PageControlComposition,
  pageControlCompositionDemos,
} from './page-control/composition.js';
import { PageControlInformationArchitecture } from './page-control/information-architecture.js';
import { PageControlDemo } from './page-control/main.js';
import {
  PageControlOverview,
  pageControlOverviewDemos,
} from './page-control/overview.js';
import {
  PageControlParts,
  pageControlPartsDemos,
} from './page-control/parts.js';
import { PopoverDemo } from './popover/main.js';
import { ProgressDemo } from './progress/main.js';
import { RollComposition, rollCompositionDemos } from './roll/composition.js';
import { RollInformationArchitecture } from './roll/information-architecture.js';
import { RollDemo } from './roll/main.js';
import { RollOverview, rollOverviewDemos } from './roll/overview.js';
import { RollParts, rollPartsDemos } from './roll/parts.js';
import {
  SegmentedComposition,
  segmentedCompositionDemos,
} from './segmented/composition.js';
import { SegmentedInformationArchitecture } from './segmented/information-architecture.js';
import { SegmentedDemo } from './segmented/main.js';
import {
  SegmentedOverview,
  segmentedOverviewDemos,
} from './segmented/overview.js';
import { SegmentedParts, segmentedPartsDemos } from './segmented/parts.js';
import {
  SheetComposition,
  sheetCompositionDemos,
} from './sheet/composition.js';
import { SheetInformationArchitecture } from './sheet/information-architecture.js';
import { SheetDemo } from './sheet/main.js';
import { SheetOverview, sheetOverviewDemos } from './sheet/overview.js';
import { SheetParts, sheetPartsDemos } from './sheet/parts.js';
import {
  SidebarComposition,
  sidebarCompositionDemos,
} from './sidebar/composition.js';
import { SidebarInformationArchitecture } from './sidebar/information-architecture.js';
import {
  SidebarCompactDemo,
  SidebarDemo,
  SidebarEditingDemo,
} from './sidebar/main.js';
import { SidebarOverview, sidebarOverviewDemos } from './sidebar/overview.js';
import { SidebarParts, sidebarPartsDemos } from './sidebar/parts.js';
import {
  SliderComposition,
  sliderCompositionDemos,
} from './slider/composition.js';
import { SliderInformationArchitecture } from './slider/information-architecture.js';
import { SliderDemo } from './slider/main.js';
import { SliderOverview, sliderOverviewDemos } from './slider/overview.js';
import { SliderParts, sliderPartsDemos } from './slider/parts.js';
import {
  StepperComposition,
  stepperCompositionDemos,
} from './stepper/composition.js';
import { StepperInformationArchitecture } from './stepper/information-architecture.js';
import { StepperDemo } from './stepper/main.js';
import { StepperOverview, stepperOverviewDemos } from './stepper/overview.js';
import { StepperParts, stepperPartsDemos } from './stepper/parts.js';
import {
  SwitchComposition,
  switchCompositionDemos,
} from './switch/composition.js';
import { SwitchInformationArchitecture } from './switch/information-architecture.js';
import { SwitchDemo } from './switch/main.js';
import { SwitchOverview, switchOverviewDemos } from './switch/overview.js';
import { SwitchParts, switchPartsDemos } from './switch/parts.js';
import { SymbolDemo } from './symbol/main.js';
import {
  TabBarComposition,
  tabBarCompositionDemos,
} from './tab-bar/composition.js';
import { TabBarInformationArchitecture } from './tab-bar/information-architecture.js';
import {
  TabBarAccessoryDemo,
  TabBarContentDemo,
  TabBarDemo,
  TabBarMixedDemo,
  TabBarRegularDemo,
  TabBarScrollDemo,
  TabBarSearchDemo,
} from './tab-bar/main.js';
import { TabBarOverview, tabBarOverviewDemos } from './tab-bar/overview.js';
import { TabBarParts, tabBarPartsDemos } from './tab-bar/parts.js';
import {
  TextFieldComposition,
  textFieldCompositionDemos,
} from './text-field/composition.js';
import { TextFieldInformationArchitecture } from './text-field/information-architecture.js';
import { TextFieldDemo } from './text-field/main.js';
import {
  TextFieldOverview,
  textFieldOverviewDemos,
} from './text-field/overview.js';
import { TextFieldParts, textFieldPartsDemos } from './text-field/parts.js';
import {
  ToolbarComposition,
  toolbarCompositionDemos,
} from './toolbar/composition.js';
import { ToolbarInformationArchitecture } from './toolbar/information-architecture.js';
import {
  ToolbarDemo,
  ToolbarPageDotsDemo,
  ToolbarSymbolsDemo,
  ToolbarTextDemo,
} from './toolbar/main.js';
import { ToolbarOverview, toolbarOverviewDemos } from './toolbar/overview.js';
import { ToolbarParts, toolbarPartsDemos } from './toolbar/parts.js';
import { TooltipDemo } from './tooltip/main.js';
import {
  TypographyDemo,
  TypographyMatrixDemo,
  TypographySizesDemo,
} from './typography/main.js';
import {
  ViewportComposition,
  viewportCompositionDemos,
} from './viewport/composition.js';
import { ViewportInformationArchitecture } from './viewport/information-architecture.js';
import {
  ViewportAnchorsDemo,
  ViewportBarDemo,
  ViewportDemo,
} from './viewport/main.js';
import {
  ViewportOverview,
  viewportOverviewDemos,
} from './viewport/overview.js';
import { ViewportParts, viewportPartsDemos } from './viewport/parts.js';

/**
 * The index's groups: by what a component is for, after a re-slicing of
 * Apple's HIG components into primitives (regions and surfaces that
 * structure an app, collections and items of content, commands, choices
 * and values, indicators, overlay surfaces), not by Apple's own categories.
 */
export const categories = {
  structure: {
    description:
      'The frame of an app: its columns, pages and bars, and moving between them.',
    title: 'Structure & navigation',
  },
  content: {
    description: 'What pages show: rows of items, text, symbols, people.',
    title: 'Content',
  },
  actions: {
    description: 'Things to do: single commands, and sets of them.',
    title: 'Actions',
  },
  choices: {
    description: 'Picking from options, setting values, entering text.',
    title: 'Choices & input',
  },
  status: {
    description: 'Showing a quantity or a state, at the scope it describes.',
    title: 'Status',
  },
  presentation: {
    description:
      'Surfaces above the page: transient, or modal for a focused task.',
    title: 'Presentation',
  },
} as const;

export type Category = keyof typeof categories;

export type CatalogEntry = {
  /** How it combines with other components (`/:id/composition`). */
  Composition?: FunctionComponent;
  /**
   * Where it sits in Apple's information architecture, after the
   * HIG-composition guide (`/:id/information-architecture`).
   */
  InformationArchitecture?: FunctionComponent;
  /** Introduction, use and props (`/:id`). */
  Overview?: FunctionComponent;
  /** Its parts, one by one (`/:id/parts`). */
  Parts?: FunctionComponent;
  /** The Base UI component it's built on (base-ui.com/react/components/…). */
  baseUiId?: string;
  category: Category;
  /** Its comprehensive demos (`/:id/all`, and `/all`). */
  demos: readonly FunctionComponent[];
  /** Framework7's React component (framework7.io/react/….html). */
  framework7Id?: string;
  /** Apple's HIG page (developer.apple.com/design/human-interface-guidelines/…). */
  higId?: string;
  /** Its demo directory, and route (`/:id`). */
  id: string;
  /** One or two sentences, for the index. */
  summary?: string;
  title: string;
};

/** Every component's demos, in the order of the page of all demos. */
export const catalog: readonly CatalogEntry[] = [
  {
    category: 'structure',
    demos: [
      ViewportDemo,
      ViewportBarDemo,
      ViewportAnchorsDemo,
      ...viewportOverviewDemos,
      ...viewportPartsDemos,
      ...viewportCompositionDemos,
    ],
    higId: 'layout',
    id: 'viewport',
    Composition: ViewportComposition,
    InformationArchitecture: ViewportInformationArchitecture,
    Overview: ViewportOverview,
    Parts: ViewportParts,
    summary:
      'The app’s window as layers: a scrolling content layer, bars floating at its edges, kept clear of the safe areas and the keyboard.',
    title: 'Viewport',
  },
  {
    category: 'content',
    demos: [
      ListDemo,
      ListPartsDemo,
      ListCollapsibleDemo,
      ListSwipeDemo,
      ListEditDemo,
      ListEditDeleteDemo,
      ListEditInsertDemo,
      ListEditSelectDemo,
      ListEditSelectSingleDemo,
      ListIndexDemo,
      ListMailDemo,
      ListSegmentedDemo,
      ListFormDemo,
      ...listOverviewDemos,
      ...listPartsDemos,
      ...listCompositionDemos,
    ],
    framework7Id: 'list-view',
    higId: 'lists-and-tables',
    id: 'list',
    Composition: ListComposition,
    InformationArchitecture: ListInformationArchitecture,
    Overview: ListOverview,
    Parts: ListParts,
    summary:
      'Rows of data in sections, with headers and footers: settings, forms, inboxes, contacts; pressed, swiped, reordered and selected.',
    title: 'List',
  },
  {
    category: 'content',
    demos: [TypographyDemo, TypographyMatrixDemo, TypographySizesDemo],
    higId: 'typography',
    id: 'typography',
    title: 'Typography',
  },
  {
    baseUiId: 'button',
    category: 'actions',
    demos: [
      ButtonDemo,
      ButtonMatrixDemo,
      ...buttonOverviewDemos,
      ...buttonPartsDemos,
      ...buttonCompositionDemos,
    ],
    framework7Id: 'button',
    higId: 'buttons',
    id: 'button',
    Composition: ButtonComposition,
    InformationArchitecture: ButtonInformationArchitecture,
    Overview: ButtonOverview,
    Parts: ButtonParts,
    summary:
      'Performs an action at once: a label, a symbol or both, borderless, on a fill or the tint, or Liquid Glass over content.',
    title: 'Button',
  },
  {
    baseUiId: 'radio',
    category: 'choices',
    demos: [
      SegmentedDemo,
      ...segmentedOverviewDemos,
      ...segmentedPartsDemos,
      ...segmentedCompositionDemos,
    ],
    framework7Id: 'segmented',
    higId: 'segmented-controls',
    id: 'segmented',
    Composition: SegmentedComposition,
    InformationArchitecture: SegmentedInformationArchitecture,
    Overview: SegmentedOverview,
    Parts: SegmentedParts,
    summary:
      'Chooses one of a few options shown side by side, e.g. a chart’s period, or which of a list’s items to show.',
    title: 'Segmented',
  },
  {
    baseUiId: 'switch',
    category: 'choices',
    demos: [
      SwitchDemo,
      ...switchOverviewDemos,
      ...switchPartsDemos,
      ...switchCompositionDemos,
    ],
    framework7Id: 'toggle',
    higId: 'toggles',
    id: 'switch',
    Composition: SwitchComposition,
    InformationArchitecture: SwitchInformationArchitecture,
    Overview: SwitchOverview,
    Parts: SwitchParts,
    summary:
      'Turns one setting on or off, taking effect at once: for settings, usually as the trailing control of a list row.',
    title: 'Switch',
  },
  {
    baseUiId: 'checkbox',
    category: 'choices',
    demos: [
      CheckboxDemo,
      CheckboxRadioDemo,
      ...checkboxOverviewDemos,
      ...checkboxPartsDemos,
      ...checkboxCompositionDemos,
    ],
    framework7Id: 'checkbox',
    higId: 'toggles',
    id: 'checkbox',
    Composition: CheckboxComposition,
    InformationArchitecture: CheckboxInformationArchitecture,
    Overview: CheckboxOverview,
    Parts: CheckboxParts,
    summary:
      'Selection circles, as iOS selects items: checkboxes for several, radios for one, before a list’s rows or with labels.',
    title: 'Checkbox',
  },
  {
    baseUiId: 'slider',
    category: 'choices',
    demos: [
      SliderDemo,
      ...sliderOverviewDemos,
      ...sliderPartsDemos,
      ...sliderCompositionDemos,
    ],
    framework7Id: 'range-slider',
    higId: 'sliders',
    id: 'slider',
    Composition: SliderComposition,
    InformationArchitecture: SliderInformationArchitecture,
    Overview: SliderOverview,
    Parts: SliderParts,
    summary:
      'Sets a value between a minimum and a maximum (or a range, with two knobs) by dragging along a track, e.g. brightness or a playback position.',
    title: 'Slider',
  },
  {
    baseUiId: 'number-field',
    category: 'choices',
    demos: [
      StepperDemo,
      ...stepperOverviewDemos,
      ...stepperPartsDemos,
      ...stepperCompositionDemos,
    ],
    framework7Id: 'stepper',
    higId: 'steppers',
    id: 'stepper',
    Composition: StepperComposition,
    InformationArchitecture: StepperInformationArchitecture,
    Overview: StepperOverview,
    Parts: StepperParts,
    summary:
      'Steps a number up or down, a press at a time, with “−” and “+” in a capsule; the app shows the value, e.g. in its list row.',
    title: 'Stepper',
  },
  {
    baseUiId: 'field',
    category: 'choices',
    demos: [
      TextFieldDemo,
      ...textFieldOverviewDemos,
      ...textFieldPartsDemos,
      ...textFieldCompositionDemos,
    ],
    framework7Id: 'inputs',
    higId: 'text-fields',
    id: 'text-field',
    Composition: TextFieldComposition,
    InformationArchitecture: TextFieldInformationArchitecture,
    Overview: TextFieldOverview,
    Parts: TextFieldParts,
    summary:
      'Free text in a list row, on its own or in a search capsule: validated as the browser’s inputs are, its errors below it.',
    title: 'Text field',
  },
  {
    baseUiId: 'form',
    category: 'choices',
    demos: [
      FormDemo,
      ...formOverviewDemos,
      ...formPartsDemos,
      ...formCompositionDemos,
    ],
    framework7Id: 'form',
    higId: 'entering-data',
    id: 'form',
    Composition: FormComposition,
    InformationArchitecture: FormInformationArchitecture,
    Overview: FormOverview,
    Parts: FormParts,
    summary:
      'Fields filled in and submitted together, as iOS lays them out: a list, its sections fieldsets, its rows fields; validated, their values by name.',
    title: 'Form',
  },
  {
    category: 'choices',
    demos: [
      RollDemo,
      ...rollOverviewDemos,
      ...rollPartsDemos,
      ...rollCompositionDemos,
    ],
    framework7Id: 'picker',
    higId: 'pickers',
    id: 'roll',
    Composition: RollComposition,
    InformationArchitecture: RollInformationArchitecture,
    Overview: RollOverview,
    Parts: RollParts,
    summary:
      'A wheel of columns, each scrolled to select a row in the band across its center: the parts of a value side by side, e.g. a time’s hours and minutes.',
    title: 'Roll',
  },
  {
    baseUiId: 'popover',
    category: 'choices',
    demos: [
      DatePickerDemo,
      DatePickerRangeDemo,
      TimePickerDemo,
      DateAndTimePickerDemo,
      DatePickerFooterDemo,
      ...datePickerOverviewDemos,
      ...datePickerPartsDemos,
      ...datePickerCompositionDemos,
    ],
    framework7Id: 'calendar',
    higId: 'pickers',
    id: 'date-picker',
    Composition: DatePickerComposition,
    InformationArchitecture: DatePickerInformationArchitecture,
    Overview: DatePickerOverview,
    Parts: DatePickerParts,
    summary:
      'Picks a date, a time or both, or a range of dates: compact buttons opening a calendar in a popover, or the calendar in place.',
    title: 'Date picker',
  },
  {
    baseUiId: 'tabs',
    category: 'structure',
    demos: [
      TabBarDemo,
      TabBarSearchDemo,
      TabBarMixedDemo,
      TabBarContentDemo,
      TabBarAccessoryDemo,
      TabBarScrollDemo,
      TabBarRegularDemo,
      ...tabBarOverviewDemos,
      ...tabBarPartsDemos,
      ...tabBarCompositionDemos,
    ],
    framework7Id: 'toolbar-tabbar',
    higId: 'tab-bars',
    id: 'tab-bar',
    Composition: TabBarComposition,
    InformationArchitecture: TabBarInformationArchitecture,
    Overview: TabBarOverview,
    Parts: TabBarParts,
    summary:
      'Switches between an app’s top-level sections: a glass bar of tabs at the bottom of the window, which can collapse to its active tab.',
    title: 'Tab bar',
  },
  {
    baseUiId: 'toolbar',
    category: 'structure',
    demos: [
      ToolbarDemo,
      ToolbarPageDotsDemo,
      ToolbarSymbolsDemo,
      ToolbarTextDemo,
      ...toolbarOverviewDemos,
      ...toolbarPartsDemos,
      ...toolbarCompositionDemos,
    ],
    framework7Id: 'toolbar-tabbar',
    higId: 'toolbars',
    id: 'toolbar',
    Composition: ToolbarComposition,
    InformationArchitecture: ToolbarInformationArchitecture,
    Overview: ToolbarOverview,
    Parts: ToolbarParts,
    summary:
      'A bar of commands for the current view: glass capsules of buttons at its ends, a title or a control between them; at the bottom, or at the top as a navigation bar.',
    title: 'Toolbar',
  },
  {
    category: 'structure',
    demos: [
      HeaderDemo,
      HeaderTitleDemo,
      ...headerOverviewDemos,
      ...headerPartsDemos,
      ...headerCompositionDemos,
    ],
    framework7Id: 'navbar',
    higId: 'toolbars',
    id: 'header',
    Composition: HeaderComposition,
    InformationArchitecture: HeaderInformationArchitecture,
    Overview: HeaderOverview,
    Parts: HeaderParts,
    summary:
      'A page’s header: a bar sticking to its top, a large title scrolling away beneath it as the bar’s own title fades in.',
    title: 'Header',
  },
  {
    category: 'structure',
    demos: [
      PageDemo,
      ...pageOverviewDemos,
      ...pagePartsDemos,
      ...pageCompositionDemos,
    ],
    framework7Id: 'page',
    higId: 'layout',
    id: 'page',
    Composition: PageComposition,
    InformationArchitecture: PageInformationArchitecture,
    Overview: PageOverview,
    Parts: PageParts,
    summary:
      'What a screen shows: its content’s scroll container, filling its place, on the grouped or plain page background.',
    title: 'Page',
  },
  {
    category: 'structure',
    demos: [
      LayoutDemo,
      LayoutCompactDemo,
      ...layoutOverviewDemos,
      ...layoutPartsDemos,
      ...layoutCompositionDemos,
    ],
    higId: 'split-views',
    id: 'layout',
    Composition: LayoutComposition,
    InformationArchitecture: LayoutInformationArchitecture,
    Overview: LayoutOverview,
    Parts: LayoutParts,
    summary:
      'Columns side by side (a sidebar, a list, a detail): sized, resizable or flexible, one floating; drawers on a phone.',
    title: 'Layout',
  },
  {
    category: 'structure',
    demos: [
      SidebarDemo,
      SidebarCompactDemo,
      SidebarEditingDemo,
      ...sidebarOverviewDemos,
      ...sidebarPartsDemos,
      ...sidebarCompositionDemos,
    ],
    framework7Id: 'panel',
    higId: 'sidebars',
    id: 'sidebar',
    Composition: SidebarComposition,
    InformationArchitecture: SidebarInformationArchitecture,
    Overview: SidebarOverview,
    Parts: SidebarParts,
    summary:
      'An app’s sections in a floating glass panel at its leading edge: a toolbar, a search field and a list; a drawer on a phone.',
    title: 'Sidebar',
  },
  {
    category: 'structure',
    demos: [
      NavigationDemo,
      ...navigationOverviewDemos,
      ...navigationPartsDemos,
      ...navigationCompositionDemos,
    ],
    framework7Id: 'view',
    higId: 'navigation-and-search',
    id: 'navigation',
    Composition: NavigationComposition,
    InformationArchitecture: NavigationInformationArchitecture,
    Overview: NavigationOverview,
    Parts: NavigationParts,
    summary:
      'A stack of pages, drilled into and back out of: pushed over each other, popped by a back button or a swipe from the leading edge.',
    title: 'Navigation',
  },
  {
    category: 'structure',
    demos: [
      PageControlDemo,
      ...pageControlOverviewDemos,
      ...pageControlPartsDemos,
      ...pageControlCompositionDemos,
    ],
    higId: 'page-controls',
    id: 'page-control',
    Composition: PageControlComposition,
    InformationArchitecture: PageControlInformationArchitecture,
    Overview: PageControlOverview,
    Parts: PageControlParts,
    summary:
      'Dots for a row of pages, the current one highlighted: pressed beside it, or scrubbed across, it steps to the previous or next page.',
    title: 'Page control',
  },
  {
    category: 'status',
    demos: [BadgeDemo],
    framework7Id: 'badge',
    id: 'badge',
    title: 'Badge',
  },
  {
    category: 'content',
    demos: [SymbolDemo],
    framework7Id: 'icon',
    higId: 'sf-symbols',
    id: 'symbol',
    title: 'Symbol',
  },
  {
    baseUiId: 'avatar',
    category: 'content',
    demos: [AvatarDemo],
    id: 'avatar',
    title: 'Avatar',
  },
  {
    baseUiId: 'progress',
    category: 'status',
    demos: [ProgressDemo],
    framework7Id: 'progressbar',
    higId: 'progress-indicators',
    id: 'progress',
    title: 'Progress',
  },
  {
    baseUiId: 'popover',
    category: 'presentation',
    demos: [PopoverDemo],
    framework7Id: 'popover',
    higId: 'popovers',
    id: 'popover',
    title: 'Popover',
  },
  {
    baseUiId: 'alert-dialog',
    category: 'presentation',
    demos: [AlertDemo],
    framework7Id: 'dialog',
    higId: 'alerts',
    id: 'alert',
    title: 'Alert',
  },
  {
    baseUiId: 'dialog',
    category: 'presentation',
    demos: [ActionSheetDemo],
    framework7Id: 'action-sheet',
    higId: 'action-sheets',
    id: 'action-sheet',
    title: 'Action sheet',
  },
  {
    baseUiId: 'tooltip',
    category: 'presentation',
    demos: [TooltipDemo],
    framework7Id: 'tooltip',
    id: 'tooltip',
    title: 'Tooltip',
  },
  {
    baseUiId: 'dialog',
    category: 'presentation',
    demos: [
      SheetDemo,
      ...sheetOverviewDemos,
      ...sheetPartsDemos,
      ...sheetCompositionDemos,
    ],
    framework7Id: 'sheet-modal',
    higId: 'sheets',
    id: 'sheet',
    Composition: SheetComposition,
    InformationArchitecture: SheetInformationArchitecture,
    Overview: SheetOverview,
    Parts: SheetParts,
    summary:
      'A focused task over the page: from the bottom on a phone, large or medium, a form sheet on a tablet; dismissed by its buttons or dragged down.',
    title: 'Sheet',
  },
  {
    category: 'choices',
    demos: [
      ColorPickerDemo,
      ...colorPickerOverviewDemos,
      ...colorPickerPartsDemos,
      ...colorPickerCompositionDemos,
    ],
    framework7Id: 'color-picker',
    higId: 'color-wells',
    id: 'color-picker',
    Composition: ColorPickerComposition,
    InformationArchitecture: ColorPickerInformationArchitecture,
    Overview: ColorPickerOverview,
    Parts: ColorPickerParts,
    summary:
      'Picks a color from a grid, a spectrum or sliders, with its opacity and saved colors; opened from a color well, in a popover or a sheet.',
    title: 'Color picker',
  },
  {
    category: 'actions',
    demos: [ActivityViewDemo, ActivityViewPopoverDemo],
    higId: 'activity-views',
    id: 'activity-view',
    title: 'Activity view',
  },
  {
    baseUiId: 'menu',
    category: 'actions',
    demos: [
      MenuOpenDemo,
      MenuDemo,
      MenuRegularDemo,
      MenuTogglesDemo,
      MenuPopUpDemo,
    ],
    higId: 'menus',
    id: 'menu',
    title: 'Menu',
  },
  {
    baseUiId: 'menu',
    category: 'actions',
    demos: [ContextualMenuDemo],
    higId: 'context-menus',
    id: 'contextual-menu',
    title: 'Contextual menu',
  },
  {
    baseUiId: 'menu',
    category: 'actions',
    demos: [EditMenuDemo],
    higId: 'edit-menus',
    id: 'edit-menu',
    title: 'Edit menu',
  },
];

export const catalogEntry = (id: string): CatalogEntry | undefined =>
  catalog.find((entry) => entry.id === id);
