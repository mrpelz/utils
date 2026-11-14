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
import { AlertDemo } from './alert/main.js';
import { AlertOverview, alertOverviewDemos } from './alert/overview.js';
import { AlertParts, alertPartsDemos } from './alert/parts.js';
import {
  AvatarComposition,
  avatarCompositionDemos,
} from './avatar/composition.js';
import { AvatarDemo } from './avatar/main.js';
import { AvatarOverview, avatarOverviewDemos } from './avatar/overview.js';
import { AvatarParts, avatarPartsDemos } from './avatar/parts.js';
import {
  BadgeComposition,
  badgeCompositionDemos,
} from './badge/composition.js';
import { BadgeDemo } from './badge/main.js';
import { BadgeOverview, badgeOverviewDemos } from './badge/overview.js';
import { BadgeParts, badgePartsDemos } from './badge/parts.js';
import {
  ButtonComposition,
  buttonCompositionDemos,
} from './button/composition.js';
import { ButtonDemo, ButtonMatrixDemo } from './button/main.js';
import { ButtonOverview, buttonOverviewDemos } from './button/overview.js';
import { ButtonParts, buttonPartsDemos } from './button/parts.js';
import {
  CheckboxComposition,
  checkboxCompositionDemos,
} from './checkbox/composition.js';
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
import { DrawerControlledDemo } from './drawer/main.js';
import { DrawerOverview, drawerOverviewDemos } from './drawer/overview.js';
import { DrawerParts, drawerPartsDemos } from './drawer/parts.js';
import {
  EditMenuComposition,
  editMenuCompositionDemos,
} from './edit-menu/composition.js';
import { EditMenuDemo } from './edit-menu/main.js';
import {
  EditMenuOverview,
  editMenuOverviewDemos,
} from './edit-menu/overview.js';
import { EditMenuParts, editMenuPartsDemos } from './edit-menu/parts.js';
import { FormComposition, formCompositionDemos } from './form/composition.js';
import { FormDemo } from './form/main.js';
import { FormOverview, formOverviewDemos } from './form/overview.js';
import { FormParts, formPartsDemos } from './form/parts.js';
import { GridComposition, gridCompositionDemos } from './grid/composition.js';
import { GridDemo } from './grid/main.js';
import { GridOverview, gridOverviewDemos } from './grid/overview.js';
import { GridParts, gridPartsDemos } from './grid/parts.js';
import {
  HeaderComposition,
  headerCompositionDemos,
} from './header/composition.js';
import { HeaderDemo, HeaderTitleDemo } from './header/main.js';
import { HeaderOverview, headerOverviewDemos } from './header/overview.js';
import { HeaderParts, headerPartsDemos } from './header/parts.js';
import {
  IslandComposition,
  islandCompositionDemos,
} from './island/composition.js';
import { IslandDemo } from './island/main.js';
import { IslandOverview, islandOverviewDemos } from './island/overview.js';
import { IslandParts, islandPartsDemos } from './island/parts.js';
import {
  LayoutComposition,
  layoutCompositionDemos,
} from './layout/composition.js';
import { LayoutDemo } from './layout/main.js';
import { LayoutOverview, layoutOverviewDemos } from './layout/overview.js';
import { LayoutParts, layoutPartsDemos } from './layout/parts.js';
import { ListComposition, listCompositionDemos } from './list/composition.js';
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
import { NavigationDemo } from './navigation/main.js';
import {
  NavigationOverview,
  navigationOverviewDemos,
} from './navigation/overview.js';
import { NavigationParts, navigationPartsDemos } from './navigation/parts.js';
import { PageComposition, pageCompositionDemos } from './page/composition.js';
import { PageDemo } from './page/main.js';
import { PageOverview, pageOverviewDemos } from './page/overview.js';
import { PageParts, pagePartsDemos } from './page/parts.js';
import {
  PageControlComposition,
  pageControlCompositionDemos,
} from './page-control/composition.js';
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
import { PopoverDemo } from './popover/main.js';
import { PopoverOverview, popoverOverviewDemos } from './popover/overview.js';
import { PopoverParts, popoverPartsDemos } from './popover/parts.js';
import {
  ProgressComposition,
  progressCompositionDemos,
} from './progress/composition.js';
import { ProgressDemo } from './progress/main.js';
import {
  ProgressOverview,
  progressOverviewDemos,
} from './progress/overview.js';
import { ProgressParts, progressPartsDemos } from './progress/parts.js';
import { RollComposition, rollCompositionDemos } from './roll/composition.js';
import { RollDemo } from './roll/main.js';
import { RollOverview, rollOverviewDemos } from './roll/overview.js';
import { RollParts, rollPartsDemos } from './roll/parts.js';
import {
  SegmentedComposition,
  segmentedCompositionDemos,
} from './segmented/composition.js';
import { SegmentedDemo } from './segmented/main.js';
import {
  SegmentedOverview,
  segmentedOverviewDemos,
} from './segmented/overview.js';
import { SegmentedParts, segmentedPartsDemos } from './segmented/parts.js';
import {
  SettingsOverview,
  settingsOverviewDemos,
} from './settings/overview.js';
import { SettingsParts, settingsPartsDemos } from './settings/parts.js';
import {
  SheetComposition,
  sheetCompositionDemos,
} from './sheet/composition.js';
import { SheetDemo } from './sheet/main.js';
import { SheetOverview, sheetOverviewDemos } from './sheet/overview.js';
import { SheetParts, sheetPartsDemos } from './sheet/parts.js';
import {
  SidebarComposition,
  sidebarCompositionDemos,
} from './sidebar/composition.js';
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
import { SliderDemo } from './slider/main.js';
import { SliderOverview, sliderOverviewDemos } from './slider/overview.js';
import { SliderParts, sliderPartsDemos } from './slider/parts.js';
import {
  StepperComposition,
  stepperCompositionDemos,
} from './stepper/composition.js';
import { StepperDemo } from './stepper/main.js';
import { StepperOverview, stepperOverviewDemos } from './stepper/overview.js';
import { StepperParts, stepperPartsDemos } from './stepper/parts.js';
import {
  SwitchComposition,
  switchCompositionDemos,
} from './switch/composition.js';
import { SwitchDemo } from './switch/main.js';
import { SwitchOverview, switchOverviewDemos } from './switch/overview.js';
import { SwitchParts, switchPartsDemos } from './switch/parts.js';
import {
  SymbolComposition,
  symbolCompositionDemos,
} from './symbol/composition.js';
import { SymbolDemo } from './symbol/main.js';
import { SymbolOverview, symbolOverviewDemos } from './symbol/overview.js';
import { SymbolParts, symbolPartsDemos } from './symbol/parts.js';
import {
  TabBarComposition,
  tabBarCompositionDemos,
} from './tab-bar/composition.js';
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
import { TooltipDemo } from './tooltip/main.js';
import { TooltipOverview, tooltipOverviewDemos } from './tooltip/overview.js';
import { TooltipParts, tooltipPartsDemos } from './tooltip/parts.js';
import {
  TypographyComposition,
  typographyCompositionDemos,
} from './typography/composition.js';
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
  foundations: {
    description:
      'What the components follow and stand on: the settings for color, contrast, motion and text, and the app’s window as layers.',
    title: 'Foundations',
  },
  structure: {
    description:
      'The frame of an app: its columns, pages and bars, and moving between them.',
    title: 'Structure & Navigation',
  },
  presentation: {
    description:
      'Surfaces above the page, either transient or modal for a focused task.',
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
    title: 'Choices & Input',
  },
  status: {
    description: 'Showing a quantity or a state, where it applies.',
    title: 'Status',
  },
} as const;

export type Category = keyof typeof categories;

export type CatalogEntry = {
  /** How it combines with other components (`/:id/composition`). */
  Composition?: FunctionComponent;
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
  /** Its demo directory, and route (`/:id`). */
  id: string;
  /** One or two sentences, for the index. */
  summary?: string;
  title: string;
};

/** Every component's demos, in the order of the page of all demos. */
export const catalog: readonly CatalogEntry[] = [
  {
    category: 'foundations',
    demos: [...settingsOverviewDemos, ...settingsPartsDemos],
    id: 'settings',
    Overview: SettingsOverview,
    Parts: SettingsParts,
    summary:
      'The settings the components follow (color scheme, contrast, motion, transparency, text size). They’re the system’s, and a provider can override them for what’s inside it.',
    title: 'Settings',
  },
  {
    category: 'foundations',
    demos: [
      ViewportDemo,
      ViewportBarDemo,
      ViewportAnchorsDemo,
      ...viewportOverviewDemos,
      ...viewportPartsDemos,
      ...viewportCompositionDemos,
    ],
    id: 'viewport',
    Composition: ViewportComposition,
    Overview: ViewportOverview,
    Parts: ViewportParts,
    summary:
      'The app’s window as layers: a scrolling content layer, with bars floating at its edges, kept clear of the safe area insets and the keyboard.',
    title: 'Viewport',
  },
  {
    category: 'structure',
    demos: [
      GridDemo,
      ...gridOverviewDemos,
      ...gridPartsDemos,
      ...gridCompositionDemos,
    ],
    id: 'grid',
    Composition: GridComposition,
    Overview: GridOverview,
    Parts: GridParts,
    summary:
      'Tiles on square units, in the app’s order, each item spanning 1 to 3 columns and rows, like a home screen or a control center. Rearranged by dragging and resizing.',
    title: 'Grid',
  },
  {
    category: 'structure',
    demos: [
      LayoutDemo,
      ...layoutOverviewDemos,
      ...layoutPartsDemos,
      ...layoutCompositionDemos,
    ],
    id: 'layout',
    Composition: LayoutComposition,
    Overview: LayoutOverview,
    Parts: LayoutParts,
    summary:
      'Columns side by side (a sidebar, a list, a detail), sized, resizable or flexible, with one that can float.',
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
    id: 'sidebar',
    Composition: SidebarComposition,
    Overview: SidebarOverview,
    Parts: SidebarParts,
    summary:
      'An app’s sections in a floating glass panel at its leading edge, with a toolbar, a search field and a list. On a phone, it goes in a drawer.',
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
    Overview: DrawerOverview,
    Parts: DrawerParts,
    summary:
      'A column that comes over the content from an edge (for example a sidebar on a phone). It’s swiped in, or opened by a button.',
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
    id: 'tab-bar',
    Composition: TabBarComposition,
    Overview: TabBarOverview,
    Parts: TabBarParts,
    summary:
      'Switches between an app’s top-level sections: a glass bar of tabs at the bottom of the window, which can collapse to its active tab.',
    title: 'Tab Bar',
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
    id: 'navigation',
    Composition: NavigationComposition,
    Overview: NavigationOverview,
    Parts: NavigationParts,
    summary:
      'A stack of pages to drill into and back out of. Pages are pushed on top of each other, and popped by a back button or a swipe from the leading edge.',
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
    id: 'page',
    Composition: PageComposition,
    Overview: PageOverview,
    Parts: PageParts,
    summary:
      'What a screen shows: the scroll container for its content, filling its place, on the grouped or plain page background.',
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
    id: 'header',
    Composition: HeaderComposition,
    Overview: HeaderOverview,
    Parts: HeaderParts,
    summary:
      'A page’s header: a bar that stays at its top, and a large title that scrolls away beneath it as the bar’s own title fades in.',
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
    id: 'toolbar',
    Composition: ToolbarComposition,
    Overview: ToolbarOverview,
    Parts: ToolbarParts,
    summary:
      'A bar of commands for the current view, with glass capsules of buttons at its ends and a title or a control between them. It sits at the bottom, or at the top as a navigation bar.',
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
    id: 'collapsible',
    Composition: CollapsibleComposition,
    Overview: CollapsibleOverview,
    Parts: CollapsibleParts,
    summary:
      'Content that a trigger shows or hides, opening in place, such as a sidebar’s sections collapsing by their titles.',
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
    id: 'accordion',
    Composition: AccordionComposition,
    Overview: AccordionOverview,
    Parts: AccordionParts,
    summary:
      'Collapsibles of which one is open at a time, such as accounts, categories or steps, with the others out of the way.',
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
    id: 'page-control',
    Composition: PageControlComposition,
    Overview: PageControlOverview,
    Parts: PageControlParts,
    summary:
      'Dots for a row of pages, with the current one highlighted. A press next to it, or scrubbing across, goes to the previous or next page.',
    title: 'Page Control',
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
    id: 'sheet',
    Composition: SheetComposition,
    Overview: SheetOverview,
    Parts: SheetParts,
    summary:
      'A focused task above the page. On a phone, it comes from the bottom, large or medium; on a tablet, it’s a form sheet. Its buttons dismiss it, or a drag down.',
    title: 'Sheet',
  },
  {
    category: 'presentation',
    demos: [
      IslandDemo,
      ...islandOverviewDemos,
      ...islandPartsDemos,
      ...islandCompositionDemos,
    ],
    id: 'island',
    Composition: IslandComposition,
    Overview: IslandOverview,
    Parts: IslandParts,
    summary:
      'A sheet’s glass capsule that’s always there, above a page’s content such as a map. Swiped up, it reveals more, stop by stop.',
    title: 'Island',
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
    id: 'popover',
    Composition: PopoverComposition,
    Overview: PopoverOverview,
    Parts: PopoverParts,
    summary:
      'A transient view at the control that shows it, with its arrow pointing at that control, for a small task or a few settings. It’s for regular widths; compact ones use a sheet.',
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
    id: 'alert',
    Composition: AlertComposition,
    Overview: AlertOverview,
    Parts: AlertParts,
    summary:
      'Important information that needs a response now: a title, a message and its actions. It’s modal, with the page dimmed, so use it sparingly.',
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
    id: 'action-sheet',
    Composition: ActionSheetComposition,
    Overview: ActionSheetOverview,
    Parts: ActionSheetParts,
    summary:
      'Choices about an action someone just started, at its control, with a destructive one first. On a regular width, it’s a popover.',
    title: 'Action Sheet',
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
    Overview: TooltipOverview,
    Parts: TooltipParts,
    summary:
      'A short label at a control, on hover and keyboard focus (not on touch). Or held open, as a lasting label for an element.',
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
    id: 'list',
    Composition: ListComposition,
    Overview: ListOverview,
    Parts: ListParts,
    summary:
      'Rows of data in sections, with headers and footers, for settings, forms, inboxes and contacts. Rows can be pressed, swiped, reordered and selected.',
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
    id: 'typography',
    Composition: TypographyComposition,
    Overview: TypographyOverview,
    Parts: TypographyParts,
    summary:
      'Text in the text styles, from Large Title to Caption 2, emphasized or italic, in a label color, at a text size.',
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
    Overview: AvatarOverview,
    Parts: AvatarParts,
    summary:
      'A person: their photo in a circle, or their initials. Several people can share one circle, and a badge can sit on its corner.',
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
    id: 'symbol',
    Composition: SymbolComposition,
    Overview: SymbolOverview,
    Parts: SymbolParts,
    summary:
      'An icon sized, weighted and colored like the text around it, for a button, a tab or a row’s image. A badge can sit on it.',
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
    id: 'activity-view',
    Composition: ActivityViewComposition,
    Overview: ActivityViewOverview,
    Parts: ActivityViewParts,
    summary:
      'Sharing: what’s shared, people to share with, and actions, in rows. It goes in a sheet (compact) or a popover (regular).',
    title: 'Activity View',
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
    id: 'contextual-menu',
    Composition: ContextualMenuComposition,
    Overview: ContextualMenuOverview,
    Parts: ContextualMenuParts,
    summary:
      'Actions on a piece of content, summoned from it. The content lifts above the blurred page, or turns into a preview, with a menu below it.',
    title: 'Contextual Menu',
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
    id: 'menu',
    Composition: MenuComposition,
    Overview: MenuOverview,
    Parts: MenuParts,
    summary:
      'Actions and choices behind a control, in a glass popup at that control, compact or regular, with submenus, toggles and quick actions.',
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
    id: 'edit-menu',
    Composition: EditMenuComposition,
    Overview: EditMenuOverview,
    Parts: EditMenuParts,
    summary:
      'Actions on a selection, in a horizontal glass capsule above it. The app opens it, and more actions scroll or sit behind a chevron.',
    title: 'Edit Menu',
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
    id: 'button',
    Composition: ButtonComposition,
    Overview: ButtonOverview,
    Parts: ButtonParts,
    summary:
      'Performs an action at once, with a label, a symbol or both: borderless, on a fill or the tint, or glass above content.',
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
    id: 'form',
    Composition: FormComposition,
    Overview: FormOverview,
    Parts: FormParts,
    summary:
      'Fields filled in and submitted together, laid out as a list, with fieldsets as its sections and fields as its rows. They’re validated, and their values submitted by name.',
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
    id: 'date-picker',
    Composition: DatePickerComposition,
    Overview: DatePickerOverview,
    Parts: DatePickerParts,
    summary:
      'Picks a date, a time, both, or a range of dates: compact buttons that open a calendar in a popover, or the calendar in place.',
    title: 'Date Picker',
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
    id: 'color-picker',
    Composition: ColorPickerComposition,
    Overview: ColorPickerOverview,
    Parts: ColorPickerParts,
    summary:
      'Picks a color from a grid, a spectrum or sliders, with its opacity and saved colors. It opens from a color well, in a popover or a sheet.',
    title: 'Color Picker',
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
    id: 'roll',
    Composition: RollComposition,
    Overview: RollOverview,
    Parts: RollParts,
    summary:
      'A wheel of columns, each scrolled to select a row in the band across its center. It shows the parts of a value side by side, such as a time’s hours and minutes.',
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
    id: 'text-field',
    Composition: TextFieldComposition,
    Overview: TextFieldOverview,
    Parts: TextFieldParts,
    summary:
      'Free text, in a list row, on its own, or in a search capsule. It’s validated like the browser’s inputs, with its errors below it.',
    title: 'Text Field',
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
    id: 'segmented',
    Composition: SegmentedComposition,
    Overview: SegmentedOverview,
    Parts: SegmentedParts,
    summary:
      'Chooses one of a few options shown side by side, such as a chart’s period, or which of a list’s items to show.',
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
    id: 'slider',
    Composition: SliderComposition,
    Overview: SliderOverview,
    Parts: SliderParts,
    summary:
      'Sets a value between a minimum and a maximum (or a range, with two knobs) by dragging along a track, such as brightness or a playback position.',
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
    id: 'stepper',
    Composition: StepperComposition,
    Overview: StepperOverview,
    Parts: StepperParts,
    summary:
      'Steps a number up or down, one press at a time, with “−” and “+” in a capsule. The app shows the value, for example in its list row.',
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
    id: 'switch',
    Composition: SwitchComposition,
    Overview: SwitchOverview,
    Parts: SwitchParts,
    summary:
      'Turns one setting on or off, taking effect at once. In settings, it’s usually the trailing control of a list row.',
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
    id: 'checkbox',
    Composition: CheckboxComposition,
    Overview: CheckboxOverview,
    Parts: CheckboxParts,
    summary:
      'Selection circles: checkboxes for several items and radios for one, before a list’s rows or with labels.',
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
    id: 'progress',
    Composition: ProgressComposition,
    Overview: ProgressOverview,
    Parts: ProgressParts,
    summary:
      'Work going on: a labeled bar that fills as it advances and shows its value, or spinning spokes for work of unknown length.',
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
    Overview: BadgeOverview,
    Parts: BadgeParts,
    summary:
      'A count in a red capsule, or a dot, for something new waiting. It sits on a tab’s or a button’s symbol, an avatar’s corner, or in a row.',
    title: 'Badge',
  },
];

export const catalogEntry = (id: string): CatalogEntry | undefined =>
  catalog.find((entry) => entry.id === id);
