import { FunctionComponent } from 'react';

import { ActionSheetDemo } from './action-sheet/main.js';
import {
  ActivityViewDemo,
  ActivityViewPopoverDemo,
} from './activity-view/main.js';
import { AlertDemo } from './alert/main.js';
import { AvatarDemo } from './avatar/main.js';
import { BadgeDemo } from './badge/main.js';
import { ButtonDemo, ButtonMatrixDemo } from './button/main.js';
import { CheckboxComposition } from './checkbox/composition.js';
import { CheckboxInformationArchitecture } from './checkbox/information-architecture.js';
import { CheckboxDemo, CheckboxRadioDemo } from './checkbox/main.js';
import { CheckboxOverview } from './checkbox/overview.js';
import { CheckboxParts } from './checkbox/parts.js';
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
import { ListComposition } from './list/composition.js';
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
import { ListOverview } from './list/overview.js';
import { ListParts } from './list/parts.js';
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
import { SegmentedComposition } from './segmented/composition.js';
import { SegmentedInformationArchitecture } from './segmented/information-architecture.js';
import { SegmentedDemo } from './segmented/main.js';
import { SegmentedOverview } from './segmented/overview.js';
import { SegmentedParts } from './segmented/parts.js';
import { SheetDemo } from './sheet/main.js';
import {
  SidebarCompactDemo,
  SidebarDemo,
  SidebarEditingDemo,
} from './sidebar/main.js';
import { SliderComposition } from './slider/composition.js';
import { SliderInformationArchitecture } from './slider/information-architecture.js';
import { SliderDemo } from './slider/main.js';
import { SliderOverview } from './slider/overview.js';
import { SliderParts } from './slider/parts.js';
import { StepperDemo } from './stepper/main.js';
import { SwitchComposition } from './switch/composition.js';
import { SwitchInformationArchitecture } from './switch/information-architecture.js';
import { SwitchDemo } from './switch/main.js';
import { SwitchOverview } from './switch/overview.js';
import { SwitchParts } from './switch/parts.js';
import { SymbolDemo } from './symbol/main.js';
import { TabBarComposition } from './tab-bar/composition.js';
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
import { TabBarOverview } from './tab-bar/overview.js';
import { TabBarParts } from './tab-bar/parts.js';
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
import {
  ViewportAnchorsDemo,
  ViewportBarDemo,
  ViewportDemo,
} from './viewport/main.js';

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
    demos: [ViewportDemo, ViewportBarDemo, ViewportAnchorsDemo],
    id: 'viewport',
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
    demos: [ButtonDemo, ButtonMatrixDemo],
    framework7Id: 'button',
    higId: 'buttons',
    id: 'button',
    title: 'Button',
  },
  {
    baseUiId: 'radio',
    category: 'choices',
    demos: [SegmentedDemo],
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
    demos: [SwitchDemo],
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
    demos: [CheckboxDemo, CheckboxRadioDemo],
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
    demos: [SliderDemo],
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
    demos: [StepperDemo],
    framework7Id: 'stepper',
    higId: 'steppers',
    id: 'stepper',
    title: 'Stepper',
  },
  {
    baseUiId: 'field',
    category: 'choices',
    demos: [TextFieldDemo],
    framework7Id: 'inputs',
    higId: 'text-fields',
    id: 'text-field',
    title: 'Text field',
  },
  {
    baseUiId: 'form',
    category: 'choices',
    demos: [FormDemo],
    framework7Id: 'form',
    higId: 'entering-data',
    id: 'form',
    title: 'Form',
  },
  {
    category: 'choices',
    demos: [RollDemo],
    framework7Id: 'picker',
    higId: 'pickers',
    id: 'roll',
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
    ],
    framework7Id: 'calendar',
    higId: 'pickers',
    id: 'date-picker',
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
    ],
    framework7Id: 'toolbar-tabbar',
    higId: 'toolbars',
    id: 'toolbar',
    title: 'Toolbar',
  },
  {
    category: 'structure',
    demos: [HeaderDemo, HeaderTitleDemo],
    framework7Id: 'navbar',
    higId: 'toolbars',
    id: 'header',
    title: 'Header',
  },
  {
    category: 'structure',
    demos: [PageDemo],
    framework7Id: 'page',
    higId: 'layout',
    id: 'page',
    title: 'Page',
  },
  {
    category: 'structure',
    demos: [LayoutDemo, LayoutCompactDemo],
    higId: 'split-views',
    id: 'layout',
    title: 'Layout',
  },
  {
    category: 'structure',
    demos: [SidebarDemo, SidebarCompactDemo, SidebarEditingDemo],
    framework7Id: 'panel',
    higId: 'sidebars',
    id: 'sidebar',
    title: 'Sidebar',
  },
  {
    category: 'structure',
    demos: [NavigationDemo],
    framework7Id: 'view',
    higId: 'navigation-and-search',
    id: 'navigation',
    title: 'Navigation',
  },
  {
    category: 'structure',
    demos: [PageControlDemo],
    higId: 'page-controls',
    id: 'page-control',
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
    demos: [SheetDemo],
    framework7Id: 'sheet-modal',
    higId: 'sheets',
    id: 'sheet',
    title: 'Sheet',
  },
  {
    category: 'choices',
    demos: [ColorPickerDemo],
    framework7Id: 'color-picker',
    higId: 'color-wells',
    id: 'color-picker',
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
