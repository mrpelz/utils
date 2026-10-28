import { FunctionComponent } from 'react';

import { Diagram, Heading, Hig, Mermaid, Table } from './parts.js';

/** HIG pages, linked, separated by “·”. */
export const HigList: FunctionComponent<{
  pages: readonly (readonly [string, string])[];
}> = ({ pages }) => (
  <>
    {pages.map(([label, page], index) => (
      <span key={page}>
        {index > 0 ? ' · ' : null}
        <Hig page={page}>{label}</Hig>
      </span>
    ))}
  </>
);

export const catalogPages = {
  content: [
    ['Charts', 'charts'],
    ['Image views', 'image-views'],
    ['Text views', 'text-views'],
    ['Web views', 'web-views'],
  ],
  layout: [
    ['Boxes', 'boxes'],
    ['Collections', 'collections'],
    ['Column views', 'column-views'],
    ['Disclosure controls', 'disclosure-controls'],
    ['Labels', 'labels'],
    ['Lists and tables', 'lists-and-tables'],
    ['Lockups', 'lockups'],
    ['Outline views', 'outline-views'],
    ['Split views', 'split-views'],
    ['Tab views', 'tab-views'],
  ],
  menus: [
    ['Activity views', 'activity-views'],
    ['Buttons', 'buttons'],
    ['Context menus', 'context-menus'],
    ['Dock menus', 'dock-menus'],
    ['Edit menus', 'edit-menus'],
    ['Home Screen quick actions', 'home-screen-quick-actions'],
    ['Menus', 'menus'],
    ['Ornaments', 'ornaments'],
    ['Pop-up buttons', 'pop-up-buttons'],
    ['Pull-down buttons', 'pull-down-buttons'],
    ['The menu bar', 'the-menu-bar'],
    ['Toolbars', 'toolbars'],
  ],
  navigation: [
    ['Path controls', 'path-controls'],
    ['Search fields', 'search-fields'],
    ['Sidebars', 'sidebars'],
    ['Tab bars', 'tab-bars'],
    ['Token fields', 'token-fields'],
  ],
  presentation: [
    ['Action sheets', 'action-sheets'],
    ['Alerts', 'alerts'],
    ['Page controls', 'page-controls'],
    ['Panels', 'panels'],
    ['Popovers', 'popovers'],
    ['Scroll views', 'scroll-views'],
    ['Sheets', 'sheets'],
    ['Windows', 'windows'],
  ],
  selection: [
    ['Color wells', 'color-wells'],
    ['Combo boxes', 'combo-boxes'],
    ['Digit entry views', 'digit-entry-views'],
    ['Image wells', 'image-wells'],
    ['Pickers', 'pickers'],
    ['Segmented controls', 'segmented-controls'],
    ['Sliders', 'sliders'],
    ['Steppers', 'steppers'],
    ['Text fields', 'text-fields'],
    ['Toggles', 'toggles'],
    ['Virtual keyboards', 'virtual-keyboards'],
  ],
  status: [
    ['Activity rings', 'activity-rings'],
    ['Gauges', 'gauges'],
    ['Progress indicators', 'progress-indicators'],
    ['Rating indicators', 'rating-indicators'],
  ],
  system: [
    ['App Shortcuts', 'app-shortcuts'],
    ['Complications', 'complications'],
    ['Controls', 'controls'],
    ['Live Activities', 'live-activities'],
    ['Notifications', 'notifications'],
    ['Status bars', 'status-bars'],
    ['Top Shelf', 'top-shelf'],
    ['Watch faces', 'watch-faces'],
    ['Widgets', 'widgets'],
  ],
  supporting: [
    ['Layout', 'layout'],
    ['Materials', 'materials'],
    ['Modality', 'modality'],
    ['Searching', 'searching'],
    ['Multitasking', 'multitasking'],
    ['Entering data', 'entering-data'],
    ['Feedback', 'feedback'],
    ['Loading', 'loading'],
  ],
} as const;

const catalogDiagram = `flowchart LR
  C[Components] --> A[Content]
  C --> B[Layout & organization]
  C --> M[Menus & actions]
  C --> N[Navigation & search]
  C --> P[Presentation]
  C --> S[Selection & input]
  C --> T[Status]
  C --> X[System experiences]

  A --> A1[Charts · Image views · Text views · Web views]
  B --> B1[Boxes · Collections · Column views · Disclosure controls · Labels · Lists & tables · Lockups · Outline views · Split views · Tab views]
  M --> M1[Activity views · Buttons · Context menus · Dock menus · Edit menus · Home Screen quick actions · Menus · Ornaments · Pop-up buttons · Pull-down buttons · The menu bar · Toolbars]
  N --> N1[Path controls · Search fields · Sidebars · Tab bars · Token fields]
  P --> P1[Action sheets · Alerts · Page controls · Panels · Popovers · Scroll views · Sheets · Windows]
  S --> S1[Color wells · Combo boxes · Digit entry views · Image wells · Pickers · Segmented controls · Sliders · Steppers · Text fields · Toggles · Virtual keyboards]
  T --> T1[Activity rings · Gauges · Progress indicators · Rating indicators]
  X --> X1[App Shortcuts · Complications · Controls · Live Activities · Notifications · Status bars · Top Shelf · Watch faces · Widgets]`;

/** §1 */
export const Section1: FunctionComponent = () => (
  <section>
    <Heading
      id="section-1"
      level={2}
    >
      1. Apple’s catalog at a glance
    </Heading>
    <p>
      Apple groups ~60 components into eight categories. The categories mix
      three different axes — <strong>what it is</strong> (Content),{' '}
      <strong>what it does</strong> (Menus and actions, Selection and input),
      and <strong>where it lives</strong> (System experiences) — which is the
      first hint that the taxonomy is organizational rather than structural.
    </p>
    <Mermaid id="catalog-diagram">{catalogDiagram}</Mermaid>
    <Table
      id="catalog"
      rows={[
        ['Category', 'Components (linked)'],
        [
          <strong key="0">Content</strong>,
          <HigList
            key="1"
            pages={catalogPages.content}
          />,
        ],
        [
          <strong key="0">Layout &amp; organization</strong>,
          <HigList
            key="1"
            pages={catalogPages.layout}
          />,
        ],
        [
          <strong key="0">Menus &amp; actions</strong>,
          <HigList
            key="1"
            pages={catalogPages.menus}
          />,
        ],
        [
          <strong key="0">Navigation &amp; search</strong>,
          <HigList
            key="1"
            pages={catalogPages.navigation}
          />,
        ],
        [
          <strong key="0">Presentation</strong>,
          <HigList
            key="1"
            pages={catalogPages.presentation}
          />,
        ],
        [
          <strong key="0">Selection &amp; input</strong>,
          <HigList
            key="1"
            pages={catalogPages.selection}
          />,
        ],
        [
          <strong key="0">Status</strong>,
          <HigList
            key="1"
            pages={catalogPages.status}
          />,
        ],
        [
          <strong key="0">System experiences</strong>,
          <HigList
            key="1"
            pages={catalogPages.system}
          />,
        ],
      ]}
    />
    <p>
      Related non-component pages that carry most of the actual composition
      logic: <HigList pages={catalogPages.supporting} />.
    </p>
  </section>
);

const layers = `┌──────────────────────────────────────────────────────────────┐
│  SYSTEM LAYER   status bar · menu bar · notifications ·      │  ← owned by the OS,
│                 widgets · Live Activities · complications    │    app only supplies content
├──────────────────────────────────────────────────────────────┤
│  OVERLAY LAYER  alerts · action sheets · popovers · menus ·  │  ← transient or modal,
│                 sheets · panels                              │    stacks above everything
├──────────────────────────────────────────────────────────────┤
│  FUNCTIONAL     toolbars · tab bars · sidebars · ornaments · │  ← Liquid Glass; floats
│  LAYER          search fields · buttons in bars              │    over content
├──────────────────────────────────────────────────────────────┤
│  CONTENT LAYER  lists & tables · collections · outline/      │  ← scrolls beneath the
│                 column views · text/image/web views · charts │    functional layer
├──────────────────────────────────────────────────────────────┤
│  STRUCTURE      windows → split views → tab views            │  ← defines the regions
└──────────────────────────────────────────────────────────────┘`;

const nesting = `flowchart TD
  W[Window] --> SV[Split view]
  W --> TB[Tab bar / Tab view]
  SV --> SB[Sidebar]
  SV --> CT[Content column]
  SV --> DT[Detail column]
  TB --> NS[Navigation stack per tab]
  NS --> TL[Toolbar / nav bar]
  NS --> CV[Content view: list · collection · text · chart]
  CV --> CELL[Rows / cells: label · lockup]
  CELL --> CTRL[Inline controls: toggle · button · stepper]
  CV -. long-press / right-click .-> CM[Context menu]
  TL -. tap .-> MN[Menu / pull-down / popover]
  TL -. task .-> SH[Sheet]
  SH -. destructive confirm .-> AL[Alert / action sheet]`;

/** §2 */
export const Section2: FunctionComponent = () => (
  <section>
    <Heading
      id="section-2"
      level={2}
    >
      2. How Apple intends components to compose
    </Heading>
    <p>
      Apple never publishes a single composition model. It’s spread across
      component pages as “use X instead of Y on platform Z” sentences.
      Reassembled, the implied model is a <strong>layered stack</strong>:
    </p>
    <Diagram id="layers">{layers}</Diagram>
    <p>
      The Liquid Glass redesign made the functional/content split explicit:
      glass is for navigation and controls floating above content, not for
      content itself (see <Hig page="materials">Materials</Hig>).
    </p>

    <Heading
      id="section-2-rules"
      level={3}
    >
      Apple’s implicit composition rules
    </Heading>
    <p>
      Collected from individual pages, these are the rules that actually govern
      how components combine:
    </p>
    <Table
      rowIds={Array.from(
        { length: 12 },
        (_, index) => `rule-a${String(index + 1)}`,
      )}
      rows={[
        ['#', 'Rule (paraphrased)', 'Where it lives'],
        [
          'A1',
          'Tab bars navigate; they never perform actions. Toolbars hold actions.',
          <Hig
            key="0"
            page="tab-bars"
          >
            Tab bars
          </Hig>,
        ],
        [
          'A2',
          'Don’t hide or disable tabs conditionally — navigation must look stable.',
          'Tab bars',
        ],
        [
          'A3',
          'A tab bar can turn into a sidebar on iPad for apps with many sections.',
          <>
            Tab bars, <Hig page="sidebars">Sidebars</Hig>
          </>,
        ],
        [
          'A4',
          'Never show a cascade of popovers. One transient surface at a time.',
          <Hig
            key="0"
            page="popovers"
          >
            Popovers
          </Hig>,
        ],
        [
          'A5',
          'In compact width, popovers become full-screen/sheet presentations.',
          'Popovers',
        ],
        [
          'A6',
          'Action sheets become popovers in regular width (iPad).',
          <Hig
            key="0"
            page="action-sheets"
          >
            Action sheets
          </Hig>,
        ],
        [
          'A7',
          'Alerts are a last resort; prefer inline feedback or undo.',
          <>
            <Hig page="alerts">Alerts</Hig>, <Hig page="modality">Modality</Hig>
          </>,
        ],
        [
          'A8',
          'Sheets are for focused, dismissable tasks that keep the parent context visible.',
          <Hig
            key="0"
            page="sheets"
          >
            Sheets
          </Hig>,
        ],
        [
          'A9',
          'Split views collapse into a navigation stack in compact width.',
          <Hig
            key="0"
            page="split-views"
          >
            Split views
          </Hig>,
        ],
        [
          'A10',
          'Every menu command should also exist in the Mac menu bar; context menus are shortcuts, not the only path.',
          <>
            <Hig page="the-menu-bar">The menu bar</Hig>,{' '}
            <Hig page="context-menus">Context menus</Hig>
          </>,
        ],
        [
          'A11',
          'Search sits in a toolbar, sidebar, or (iOS 26) alongside the tab bar.',
          <>
            <Hig page="search-fields">Search fields</Hig>,{' '}
            <Hig page="searching">Searching</Hig>
          </>,
        ],
        [
          'A12',
          'On macOS, tab views replace tab bars; on visionOS, ornaments replace bottom bars.',
          <>
            <Hig page="tab-views">Tab views</Hig>,{' '}
            <Hig page="ornaments">Ornaments</Hig>
          </>,
        ],
      ]}
    />
    <p>
      Notice that A3, A5, A6, A9, A12 are all{' '}
      <strong>the same rule in disguise</strong>:{' '}
      <em>
        a concept keeps its identity but changes its rendering with available
        space or platform.
      </em>{' '}
      Apple encodes each instance separately because each instance has its own
      named component.
    </p>

    <Heading
      id="section-2-nesting"
      level={3}
    >
      Apple’s canonical nesting (descriptive)
    </Heading>
    <Mermaid>{nesting}</Mermaid>
  </section>
);

const commandSets = ` Same "list of commands", eight names, distinguished only by WHERE it's summoned:

   menu bar ─────┐
   right-click ──┤
   text select ──┤
   button tap ───┼──►  [ Command set ]  ──► rendered as menu / sheet / popover
   Dock ─────────┤
   Home Screen ──┤
   share button ─┤
   destructive ──┘`;

/** §3 */
export const Section3: FunctionComponent = () => (
  <section>
    <Heading
      id="section-3"
      level={2}
    >
      3. Where Apple’s slicing is legacy-driven
    </Heading>
    <p>Most duplication comes from three sources:</p>
    <ol>
      <li>
        <strong>Platform-of-origin naming.</strong> A concept got named once on
        macOS (AppKit era) and again on iOS (UIKit era). Both names survived.{' '}
        <em>Tab views</em> vs <em>tab bars</em>, <em>pop-up buttons</em> vs{' '}
        <em>pickers</em>, <em>outline views</em> vs <em>disclosure lists</em>.
      </li>
      <li>
        <strong>Invocation-based naming.</strong> The same thing gets a
        different name depending on how it’s summoned. A menu summoned by
        right-click is a <em>context menu</em>, by a button a{' '}
        <em>pull-down button</em>, by text selection an <em>edit menu</em>, by
        the Dock a <em>dock menu</em>, by the Home Screen a{' '}
        <em>quick action</em>.
      </li>
      <li>
        <strong>Size-based naming.</strong> The same thing gets a different name
        depending on screen size: <em>action sheet</em> on iPhone is a{' '}
        <em>popover</em> on iPad.
      </li>
    </ol>

    <Heading
      id="section-3-clusters"
      level={3}
    >
      Duplication clusters
    </Heading>
    <Table
      rows={[
        [
          'Underlying concept',
          'Apple’s separate components',
          'What actually differs',
        ],
        [
          <strong key="0">Switch between sibling sections</strong>,
          'Tab bars · Tab views · Sidebars (top level) · Segmented controls (when used to switch views) · Page controls',
          'Position, capacity, platform',
        ],
        [
          <strong key="0">A list of commands</strong>,
          'Menus · The menu bar · Context menus · Edit menus · Dock menus · Pull-down buttons · Home Screen quick actions · Action sheets · Activity views',
          'Invocation anchor, size class, whether the list is app- or system-supplied',
        ],
        [
          <strong key="0">Pick one of N</strong>,
          'Pop-up buttons · Pickers · Segmented controls · Toggles (N=2) · Combo boxes · Steppers (ordered N)',
          'N, whether N is visible at once, whether free entry is allowed',
        ],
        [
          <strong key="0">Browse a collection</strong>,
          'Lists and tables · Collections · Outline views · Column views · Sidebars (as content) · Path controls',
          'Data shape (flat/tree), projection (rows/grid/columns/breadcrumb)',
        ],
        [
          <strong key="0">Secondary surface</strong>,
          'Sheets · Popovers · Alerts · Action sheets · Panels · Windows · Ornaments',
          'Anchor, modality, lifetime',
        ],
        [
          <strong key="0">Enter text</strong>,
          'Text fields · Search fields · Token fields · Combo boxes · Digit entry views · Text views (editable) · Virtual keyboards',
          'Purpose, tokenization, suggestions, length',
        ],
        [
          <strong key="0">Show a quantity</strong>,
          'Progress indicators · Gauges · Activity rings · Rating indicators · (Sliders, if interactive)',
          'Bounded?, determinate?, multi-value?, editable?',
        ],
        [
          <strong key="0">Hold a value slot</strong>,
          'Color wells · Image wells · (Date pickers)',
          'Value type only',
        ],
        [
          <strong key="0">Group &amp; reveal</strong>,
          'Boxes · Disclosure controls · (List sections) · Lockups · Labels',
          'Collapsible?, framed?',
        ],
        [
          <strong key="0">Edge chrome</strong>,
          'Toolbars · Tab bars · Status bars · The menu bar · Ornaments · Sidebars',
          'Edge, ownership (app vs OS)',
        ],
        [
          <strong key="0">App state outside the app</strong>,
          'Widgets · Complications · Live Activities · Controls · Notifications · Top Shelf · App Shortcuts · Watch faces',
          'Host surface, refresh model, interactivity budget',
        ],
      ]}
    />
    <Diagram>{commandSets}</Diagram>

    <Heading
      id="section-3-categories"
      level={3}
    >
      Category-level problems
    </Heading>
    <ul>
      <li>
        <strong>“Presentation” contains Scroll views and Page controls</strong>,
        which are content mechanics, not presentations — they’re there because
        they were once sibling classes.
      </li>
      <li>
        <strong>“Navigation &amp; search” contains Token fields</strong> (an
        input) but not Split views or Tab views (which are navigation).
      </li>
      <li>
        <strong>“Menus &amp; actions” contains Toolbars and Ornaments</strong>,
        which are regions that <em>hold</em> actions, mixed with the actions
        themselves.
      </li>
      <li>
        <strong>
          “Status” excludes badges, status bars, and Live Activities
        </strong>
        , which are all status displays.
      </li>
      <li>
        <strong>“System experiences” mixes surfaces</strong> (widgets, watch
        faces) <strong>with content types</strong> (notifications){' '}
        <strong>and OS chrome</strong> (status bars).
      </li>
    </ul>
  </section>
);
