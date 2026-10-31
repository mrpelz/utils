import { FunctionComponent } from 'react';

import {
  AccordionComposition,
  accordionCompositionDemos,
} from './accordion/composition.js';
import { AccordionDemo } from './accordion/main.js';
import {
  AccordionOverview,
  accordionOverviewDemos,
} from './accordion/overview.js';
import { AccordionParts, accordionPartsDemos } from './accordion/parts.js';
import {
  ActionSheetComposition,
  actionSheetCompositionDemos,
} from './action-sheet/composition.js';
import { ActionSheetInformationArchitecture } from './action-sheet/information-architecture.js';
import { ActionSheetDemo } from './action-sheet/main.js';
import {
  ActionSheetOverview,
  actionSheetOverviewDemos,
} from './action-sheet/overview.js';
import {
  ActionSheetParts,
  actionSheetPartsDemos,
} from './action-sheet/parts.js';
import {
  ActivityViewComposition,
  activityViewCompositionDemos,
} from './activity-view/composition.js';
import { ActivityViewInformationArchitecture } from './activity-view/information-architecture.js';
import {
  ActivityViewDemo,
  ActivityViewPopoverDemo,
} from './activity-view/main.js';
import {
  ActivityViewOverview,
  activityViewOverviewDemos,
} from './activity-view/overview.js';
import {
  ActivityViewParts,
  activityViewPartsDemos,
} from './activity-view/parts.js';
import {
  AlertComposition,
  alertCompositionDemos,
} from './alert/composition.js';
import { AlertInformationArchitecture } from './alert/information-architecture.js';
import { AlertDemo } from './alert/main.js';
import { AlertOverview, alertOverviewDemos } from './alert/overview.js';
import { AlertParts, alertPartsDemos } from './alert/parts.js';
import {
  AvatarComposition,
  avatarCompositionDemos,
} from './avatar/composition.js';
import { AvatarInformationArchitecture } from './avatar/information-architecture.js';
import { AvatarDemo } from './avatar/main.js';
import { AvatarOverview, avatarOverviewDemos } from './avatar/overview.js';
import { AvatarParts, avatarPartsDemos } from './avatar/parts.js';
import {
  BadgeComposition,
  badgeCompositionDemos,
} from './badge/composition.js';
import { BadgeInformationArchitecture } from './badge/information-architecture.js';
import { BadgeDemo } from './badge/main.js';
import { BadgeOverview, badgeOverviewDemos } from './badge/overview.js';
import { BadgeParts, badgePartsDemos } from './badge/parts.js';
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
  CollapsibleComposition,
  collapsibleCompositionDemos,
} from './collapsible/composition.js';
import { CollapsibleDemo } from './collapsible/main.js';
import {
  CollapsibleOverview,
  collapsibleOverviewDemos,
} from './collapsible/overview.js';
import {
  CollapsibleParts,
  collapsiblePartsDemos,
} from './collapsible/parts.js';
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
import {
  ContextualMenuComposition,
  contextualMenuCompositionDemos,
} from './contextual-menu/composition.js';
import { ContextualMenuInformationArchitecture } from './contextual-menu/information-architecture.js';
import { ContextualMenuDemo } from './contextual-menu/main.js';
import {
  ContextualMenuOverview,
  contextualMenuOverviewDemos,
} from './contextual-menu/overview.js';
import {
  ContextualMenuParts,
  contextualMenuPartsDemos,
} from './contextual-menu/parts.js';
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
import {
  DrawerComposition,
  drawerCompositionDemos,
} from './drawer/composition.js';
import { DrawerInformationArchitecture } from './drawer/information-architecture.js';
import { DrawerControlledDemo } from './drawer/main.js';
import { DrawerOverview, drawerOverviewDemos } from './drawer/overview.js';
import { DrawerParts, drawerPartsDemos } from './drawer/parts.js';
import {
  EditMenuComposition,
  editMenuCompositionDemos,
} from './edit-menu/composition.js';
import { EditMenuInformationArchitecture } from './edit-menu/information-architecture.js';
import { EditMenuDemo } from './edit-menu/main.js';
import {
  EditMenuOverview,
  editMenuOverviewDemos,
} from './edit-menu/overview.js';
import { EditMenuParts, editMenuPartsDemos } from './edit-menu/parts.js';
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
import { LayoutDemo } from './layout/main.js';
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
import { MenuComposition, menuCompositionDemos } from './menu/composition.js';
import { MenuInformationArchitecture } from './menu/information-architecture.js';
import {
  MenuDemo,
  MenuOpenDemo,
  MenuPopUpDemo,
  MenuRegularDemo,
  MenuTogglesDemo,
} from './menu/main.js';
import { MenuOverview, menuOverviewDemos } from './menu/overview.js';
import { MenuParts, menuPartsDemos } from './menu/parts.js';
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
import {
  PopoverComposition,
  popoverCompositionDemos,
} from './popover/composition.js';
import { PopoverInformationArchitecture } from './popover/information-architecture.js';
import { PopoverDemo } from './popover/main.js';
import { PopoverOverview, popoverOverviewDemos } from './popover/overview.js';
import { PopoverParts, popoverPartsDemos } from './popover/parts.js';
import {
  ProgressComposition,
  progressCompositionDemos,
} from './progress/composition.js';
import { ProgressInformationArchitecture } from './progress/information-architecture.js';
import { ProgressDemo } from './progress/main.js';
import {
  ProgressOverview,
  progressOverviewDemos,
} from './progress/overview.js';
import { ProgressParts, progressPartsDemos } from './progress/parts.js';
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
import {
  SymbolComposition,
  symbolCompositionDemos,
} from './symbol/composition.js';
import { SymbolInformationArchitecture } from './symbol/information-architecture.js';
import { SymbolDemo } from './symbol/main.js';
import { SymbolOverview, symbolOverviewDemos } from './symbol/overview.js';
import { SymbolParts, symbolPartsDemos } from './symbol/parts.js';
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
import {
  TooltipComposition,
  tooltipCompositionDemos,
} from './tooltip/composition.js';
import { TooltipInformationArchitecture } from './tooltip/information-architecture.js';
import { TooltipDemo } from './tooltip/main.js';
import { TooltipOverview, tooltipOverviewDemos } from './tooltip/overview.js';
import { TooltipParts, tooltipPartsDemos } from './tooltip/parts.js';
import {
  TypographyComposition,
  typographyCompositionDemos,
} from './typography/composition.js';
import { TypographyInformationArchitecture } from './typography/information-architecture.js';
import {
  TypographyDemo,
  TypographyMatrixDemo,
  TypographySizesDemo,
} from './typography/main.js';
import {
  TypographyOverview,
  typographyOverviewDemos,
} from './typography/overview.js';
import { TypographyParts, typographyPartsDemos } from './typography/parts.js';
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
  presentation: {
    description:
      'Surfaces above the page: transient, or modal for a focused task.',
    title: 'Presentation',
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
    category: 'structure',
    demos: [
      LayoutDemo,
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
      'Columns side by side (a sidebar, a list, a detail): sized, resizable or flexible, one floating.',
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
    baseUiId: 'drawer',
    category: 'structure',
    demos: [
      DrawerControlledDemo,
      ...drawerOverviewDemos,
      ...drawerPartsDemos,
      ...drawerCompositionDemos,
    ],
    framework7Id: 'panel',
    id: 'drawer',
    Composition: DrawerComposition,
    InformationArchitecture: DrawerInformationArchitecture,
    Overview: DrawerOverview,
    Parts: DrawerParts,
    summary:
      'A column over the content from an edge (e.g. a sidebar on a phone): swiped in, or opened by a button.',
    title: 'Drawer',
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
    baseUiId: 'collapsible',
    category: 'structure',
    demos: [
      CollapsibleDemo,
      ...collapsibleOverviewDemos,
      ...collapsiblePartsDemos,
      ...collapsibleCompositionDemos,
    ],
    higId: 'disclosure-controls',
    id: 'collapsible',
    Composition: CollapsibleComposition,
    Overview: CollapsibleOverview,
    Parts: CollapsibleParts,
    summary:
      'Content shown or hidden by a trigger, opening in place: a sidebar’s sections collapsing by their titles.',
    title: 'Collapsible',
  },
  {
    baseUiId: 'accordion',
    category: 'structure',
    demos: [
      AccordionDemo,
      ...accordionOverviewDemos,
      ...accordionPartsDemos,
      ...accordionCompositionDemos,
    ],
    higId: 'disclosure-controls',
    id: 'accordion',
    Composition: AccordionComposition,
    Overview: AccordionOverview,
    Parts: AccordionParts,
    summary:
      'Collapsibles of which one is open at a time: accounts, categories, or steps, the others out of the way.',
    title: 'Accordion',
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
    baseUiId: 'popover',
    category: 'presentation',
    demos: [
      PopoverDemo,
      ...popoverOverviewDemos,
      ...popoverPartsDemos,
      ...popoverCompositionDemos,
    ],
    framework7Id: 'popover',
    higId: 'popovers',
    id: 'popover',
    Composition: PopoverComposition,
    InformationArchitecture: PopoverInformationArchitecture,
    Overview: PopoverOverview,
    Parts: PopoverParts,
    summary:
      'A transient view at the control that shows it, its arrow pointing at it: a small task or a few settings, in a regular width (a sheet in a compact one).',
    title: 'Popover',
  },
  {
    baseUiId: 'alert-dialog',
    category: 'presentation',
    demos: [
      AlertDemo,
      ...alertOverviewDemos,
      ...alertPartsDemos,
      ...alertCompositionDemos,
    ],
    framework7Id: 'dialog',
    higId: 'alerts',
    id: 'alert',
    Composition: AlertComposition,
    InformationArchitecture: AlertInformationArchitecture,
    Overview: AlertOverview,
    Parts: AlertParts,
    summary:
      'Important information that needs a response now: a title, a message, its actions; modal, the page dimmed. Sparingly.',
    title: 'Alert',
  },
  {
    baseUiId: 'popover',
    category: 'presentation',
    demos: [
      ActionSheetDemo,
      ...actionSheetOverviewDemos,
      ...actionSheetPartsDemos,
      ...actionSheetCompositionDemos,
    ],
    framework7Id: 'action-sheet',
    higId: 'action-sheets',
    id: 'action-sheet',
    Composition: ActionSheetComposition,
    InformationArchitecture: ActionSheetInformationArchitecture,
    Overview: ActionSheetOverview,
    Parts: ActionSheetParts,
    summary:
      'Choices about an action the person just started, at its control: a destructive one first; a popover in a regular width.',
    title: 'Action sheet',
  },
  {
    baseUiId: 'tooltip',
    category: 'presentation',
    demos: [
      TooltipDemo,
      ...tooltipOverviewDemos,
      ...tooltipPartsDemos,
      ...tooltipCompositionDemos,
    ],
    framework7Id: 'tooltip',
    id: 'tooltip',
    Composition: TooltipComposition,
    InformationArchitecture: TooltipInformationArchitecture,
    Overview: TooltipOverview,
    Parts: TooltipParts,
    summary:
      'A short label at a control, on hover and keyboard focus (not on touch); or held open, labeling an element for good.',
    title: 'Tooltip',
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
    demos: [
      TypographyDemo,
      TypographyMatrixDemo,
      TypographySizesDemo,
      ...typographyOverviewDemos,
      ...typographyPartsDemos,
      ...typographyCompositionDemos,
    ],
    higId: 'typography',
    id: 'typography',
    Composition: TypographyComposition,
    InformationArchitecture: TypographyInformationArchitecture,
    Overview: TypographyOverview,
    Parts: TypographyParts,
    summary:
      'Text in the text styles, Large Title to Caption 2: emphasized or italic, in a label color, at a text size.',
    title: 'Typography',
  },
  {
    baseUiId: 'avatar',
    category: 'content',
    demos: [
      AvatarDemo,
      ...avatarOverviewDemos,
      ...avatarPartsDemos,
      ...avatarCompositionDemos,
    ],
    id: 'avatar',
    Composition: AvatarComposition,
    InformationArchitecture: AvatarInformationArchitecture,
    Overview: AvatarOverview,
    Parts: AvatarParts,
    summary:
      'A person: their photo in a circle, or their initials; several people in one circle; a badge on its corner.',
    title: 'Avatar',
  },
  {
    category: 'content',
    demos: [
      SymbolDemo,
      ...symbolOverviewDemos,
      ...symbolPartsDemos,
      ...symbolCompositionDemos,
    ],
    framework7Id: 'icon',
    higId: 'sf-symbols',
    id: 'symbol',
    Composition: SymbolComposition,
    InformationArchitecture: SymbolInformationArchitecture,
    Overview: SymbolOverview,
    Parts: SymbolParts,
    summary:
      'An icon sized, weighted and colored as the text around it: a button’s, a tab’s, a row’s image; a badge on it.',
    title: 'Symbol',
  },
  {
    category: 'actions',
    demos: [
      ActivityViewDemo,
      ActivityViewPopoverDemo,
      ...activityViewOverviewDemos,
      ...activityViewPartsDemos,
      ...activityViewCompositionDemos,
    ],
    higId: 'activity-views',
    id: 'activity-view',
    Composition: ActivityViewComposition,
    InformationArchitecture: ActivityViewInformationArchitecture,
    Overview: ActivityViewOverview,
    Parts: ActivityViewParts,
    summary:
      'Sharing: what’s shared, people to share with and actions, in rows; in a sheet (compact) or a popover (regular).',
    title: 'Activity view',
  },
  {
    baseUiId: 'menu',
    category: 'actions',
    demos: [
      ContextualMenuDemo,
      ...contextualMenuOverviewDemos,
      ...contextualMenuPartsDemos,
      ...contextualMenuCompositionDemos,
    ],
    higId: 'context-menus',
    id: 'contextual-menu',
    Composition: ContextualMenuComposition,
    InformationArchitecture: ContextualMenuInformationArchitecture,
    Overview: ContextualMenuOverview,
    Parts: ContextualMenuParts,
    summary:
      'Actions on a piece of content, summoned from it: the content lifts above the blurred page, or turns into a preview, a menu below it.',
    title: 'Contextual menu',
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
      ...menuOverviewDemos,
      ...menuPartsDemos,
      ...menuCompositionDemos,
    ],
    higId: 'menus',
    id: 'menu',
    Composition: MenuComposition,
    InformationArchitecture: MenuInformationArchitecture,
    Overview: MenuOverview,
    Parts: MenuParts,
    summary:
      'Actions and choices behind a control, in a glass popup at it: compact or regular, with submenus, toggles and quick actions.',
    title: 'Menu',
  },
  {
    baseUiId: 'menu',
    category: 'actions',
    demos: [
      EditMenuDemo,
      ...editMenuOverviewDemos,
      ...editMenuPartsDemos,
      ...editMenuCompositionDemos,
    ],
    higId: 'edit-menus',
    id: 'edit-menu',
    Composition: EditMenuComposition,
    InformationArchitecture: EditMenuInformationArchitecture,
    Overview: EditMenuOverview,
    Parts: EditMenuParts,
    summary:
      'Actions on a selection in a horizontal glass capsule above it: opened by the app, more actions scrolling or behind a chevron.',
    title: 'Edit menu',
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
      'Performs an action at once: a label, a symbol or both, borderless, on a fill or the tint, or glass over content.',
    title: 'Button',
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
      'Fields filled in and submitted together, laid out as a list: its sections fieldsets, its rows fields; validated, their values by name.',
    title: 'Form',
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
      'Selection circles: checkboxes for several, radios for one, before a list’s rows or with labels.',
    title: 'Checkbox',
  },
  {
    baseUiId: 'progress',
    category: 'status',
    demos: [
      ProgressDemo,
      ...progressOverviewDemos,
      ...progressPartsDemos,
      ...progressCompositionDemos,
    ],
    framework7Id: 'progressbar',
    higId: 'progress-indicators',
    id: 'progress',
    Composition: ProgressComposition,
    InformationArchitecture: ProgressInformationArchitecture,
    Overview: ProgressOverview,
    Parts: ProgressParts,
    summary:
      'Work going on: a bar filling as it advances, labeled, its value shown; or, of unknown length, spinning spokes.',
    title: 'Progress',
  },
  {
    category: 'status',
    demos: [
      BadgeDemo,
      ...badgeOverviewDemos,
      ...badgePartsDemos,
      ...badgeCompositionDemos,
    ],
    framework7Id: 'badge',
    id: 'badge',
    Composition: BadgeComposition,
    InformationArchitecture: BadgeInformationArchitecture,
    Overview: BadgeOverview,
    Parts: BadgeParts,
    summary:
      'A count in a red capsule, or a dot: something new waiting, on a tab’s or a button’s symbol, an avatar’s corner, or in a row.',
    title: 'Badge',
  },
];

export const catalogEntry = (id: string): CatalogEntry | undefined =>
  catalog.find((entry) => entry.id === id);
