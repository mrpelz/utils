import { FunctionComponent } from 'react';

import { guideHref } from './link.js';
import { Diagram, Heading, Hig, Mermaid, Table } from './parts.js';

const bold = (text: string) => <strong key="0">{text}</strong>;

const containment = `Surface   ⊃ Region*, Collection | Viewer | Group*, (child Surface via summon)
Region    ⊃ Command*, Choice*, Text input (search), Item* (tabs)
Collection⊃ Group* ⊃ Item*
Item      ⊃ Viewer (thumbnail) · Indicator · Command · Choice · Value input
Command   ⇢ summons Command set | Surface
Command set ⇢ renders as Surface (menu, popover, sheet) depending on size class`;

const modalityLadder = `flowchart LR
  I[Inline<br/>change in place] --> T[Transient<br/>popover · menu]
  T --> NM[Non-modal surface<br/>panel · window · inspector]
  NM --> S[Window-modal<br/>sheet]
  S --> A[App-modal<br/>alert]
  A --> SYS[System<br/>notification]
  style I fill:#d9f2d9
  style A fill:#f9d6d5`;

/** §6 */
export const Section6: FunctionComponent = () => (
  <section>
    <Heading
      id="section-6"
      level={2}
    >
      6. Composition grammar
    </Heading>
    <p>
      With primitives defined, composition becomes a small grammar:{' '}
      <strong>what can contain what</strong>, and{' '}
      <strong>which rules hold everywhere</strong> rather than per component.
    </p>

    <Heading
      id="section-6-containment"
      level={3}
    >
      Containment
    </Heading>
    <Diagram>{containment}</Diagram>

    <Heading
      id="section-6-rules"
      level={3}
    >
      Universal rules (replacing per-component rules)
    </Heading>
    <Table
      rowIds={Array.from(
        { length: 9 },
        (_, index) => `rule-g${String(index + 1)}`,
      )}
      rows={[
        ['#', 'Rule', 'Replaces Apple rules'],
        [
          'G1',
          <>
            <strong>Navigation and action are separate intents</strong> and live
            in separate regions or separate halves of a region.
          </>,
          <a
            key="0"
            href={guideHref('rule-a1')}
          >
            A1
          </a>,
        ],
        [
          'G2',
          <>
            <strong>Navigation structure is stable.</strong> Items in a
            navigation Choice don’t appear/disappear with state; they disable
            with explanation at most.
          </>,
          <a
            key="0"
            href={guideHref('rule-a2')}
          >
            A2
          </a>,
        ],
        [
          'G3',
          <>
            <strong>One transient surface per anchor chain.</strong> Transient
            surfaces don’t spawn transient surfaces, except a Command set’s own
            submenus.
          </>,
          <a
            key="0"
            href={guideHref('rule-a4')}
          >
            A4
          </a>,
        ],
        [
          'G4',
          <>
            <strong>Adaptation re-renders, never re-conceives.</strong> A
            concept keeps identity across size classes: Command set → menu /
            sheet / popover; Section Choice → tab bar / sidebar / tab view;
            Split layout → stack.
          </>,
          'A3, A5, A6, A9, A12',
        ],
        [
          'G5',
          <>
            <strong>Use the lowest modality that works</strong> (see ladder
            below).
          </>,
          'A7, A8',
        ],
        [
          'G6',
          <>
            <strong>Every Command is defined once</strong> and projected into
            any number of hosts (menu bar, toolbar, context menu, shortcut,
            quick action, App Shortcut, Control).
          </>,
          <a
            key="0"
            href={guideHref('rule-a10')}
          >
            A10
          </a>,
        ],
        [
          'G7',
          <>
            <strong>
              Collections own selection; Regions act on selection.
            </strong>{' '}
            Toolbars and command sets read the current selection; they don’t
            hold their own.
          </>,
          '(implicit throughout)',
        ],
        [
          'G8',
          <>
            <strong>Status attaches to the narrowest scope it describes</strong>
            : item → view → window → app → system.
          </>,
          '(scattered in Status, Feedback, Loading)',
        ],
        [
          'G9',
          <>
            <strong>
              Glass is for Regions and transient Surfaces; content stays on the
              content layer.
            </strong>
          </>,
          <Hig
            key="0"
            page="materials"
          >
            Materials
          </Hig>,
        ],
      ]}
    />

    <Heading
      id="modality-ladder"
      level={3}
    >
      The modality ladder (G5)
    </Heading>
    <Mermaid>{modalityLadder}</Mermaid>
    <p>
      Climb only when the lower rung can’t carry the interaction. Each rung up
      costs context and attention.
    </p>

    <Heading
      id="status-by-scope"
      level={3}
    >
      Status by scope (G8)
    </Heading>
    <Table
      rows={[
        ['Scope', 'Indicator placement', 'Apple examples'],
        [
          'Item',
          'Inside the item’s trailing slot or badge',
          'row spinner, badge count on tab',
        ],
        [
          'View',
          'Top of content / in toolbar',
          'pull-to-refresh, inline progress',
        ],
        [
          'Window',
          'Window region (toolbar/status area)',
          'download progress in toolbar',
        ],
        ['App', 'App-level surface', 'app icon badge, Dock progress'],
        [
          'System',
          'System-hosted surface',
          'Live Activity, notification, status bar',
        ],
      ]}
    />
  </section>
);

const moves = `flowchart LR
  subgraph Section
    direction TB
    L0[Section root] -->|Drill| L1[Level 1] -->|Drill| L2[Detail]
    L2 <-->|Step| L2b[Sibling detail]
  end
  S1((Switch)) --> L0
  L1 -.->|Peek| P[Transient preview]
  L2 -.->|Detour| D[Modal task] -.->|return| L2
  J((Jump)) --> L2`;

const switcher = `flowchart TD
  Q1{How many top-level<br/>sections?} -->|2–5, stable| Q2{Primary device?}
  Q1 -->|6+ or user-defined| SB[Sidebar<br/>tree Collection in leading Region]
  Q2 -->|Phone| TB[Tab bar<br/>bottom Region]
  Q2 -->|Tablet| TBS[Tab bar convertible to sidebar]
  Q2 -->|Mac| SBM[Sidebar<br/>or toolbar segmented switch]
  Q2 -->|TV| TT[Top tab bar]
  Q2 -->|Vision| ORN[Tab bar as leading ornament]
  Q2 -->|Watch| VP[Vertical pages or a root list]
  Q1 -->|1| NONE[No switcher<br/>single stack + toolbar]`;

const shellA = `┌─────────────────────────────┐
│ ‹ Back      Title      ⋯  + │ ← Region (toolbar): Drill-back · Command set · Command
├─────────────────────────────┤
│  ┌───────────────────────┐  │
│  │ Item                › │  │ ← Collection (rows) — Drill
│  ├───────────────────────┤  │
│  │ Item                › │  │
│  ├───────────────────────┤  │
│  │ Item          [toggle]│  │ ← Item with inline Choice
│  └───────────────────────┘  │
│                             │
│  ╭─────────────────────╮ ╭─╮│
│  │ ◉ Home  ○ Lib  ○ You│ │🔍││ ← Region (tab bar): navigating Choice + search Jump
│  ╰─────────────────────╯ ╰─╯│
└─────────────────────────────┘`;

const shellB = `┌────────────┬──────────────────┬───────────────────────────────┐
│ 🔍 Search  │ Inbox        ⋯ ✎ │  Subject line           ↩ ⋯   │
│────────────│──────────────────│───────────────────────────────│
│ ▸ Inbox  12│ ▌Item (selected) │                               │
│   Drafts   │  Item            │  Viewer                       │
│   Sent     │  Item            │  (detail of selected item)    │
│ ▾ Folders  │  Item            │                               │
│   Work     │                  │                               │
│   Home     │                  │                               │
└────────────┴──────────────────┴───────────────────────────────┘
  Region +       Collection           Viewer + Region(commands
  tree Collection (Drill target)      acting on selection — G7)
  (Switch)`;

const shellC = `┌─────────────────────────────┐
│          Settings           │
├─────────────────────────────┤
│ ┌ Group ──────────────────┐ │
│ │ Item                  › │ │  Drill only. No Switch.
│ │ Item         [toggle]   │ │  Groups organize, sections
│ └─────────────────────────┘ │  replace tabs.
│ ┌ Group ──────────────────┐ │
│ │ Item                  › │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘`;

const shellD = `┌─ ● ● ●  Document.ext ─────────────── [ ⊞ ✎ ⤴ ] ─┐   ← Region: toolbar
│                                                  │
│                 Viewer (the document)            │   ← Switch = between windows,
│                                    ┌──────────┐  │      not tabs (or window tabs)
│                                    │ Inspector│  │   ← non-modal Surface (Peek)
│                                    │  panel   │  │
│                                    └──────────┘  │
└──────────────────────────────────────────────────┘
 + Region(system menu bar) carrying the full Command set (G6)`;

const shellE = `        ╭───╮
        │ ◉ │   ← Region rendered as ornament (leading): section Choice
        │ ○ │
        │ ○ │      ┌────────────────────────────────┐
        ╰───╯      │                                │
                   │        Surface (window)        │
                   │   Collection / Viewer          │
                   │                                │
                   └────────────────────────────────┘
                       ╭──────────────────────╮
                       │  ⏮  ⏯  ⏭   ⋯        │  ← Region rendered as ornament (bottom)
                       ╰──────────────────────╯`;

const shellF = ` ╭───────────╮      ╭───────────╮
 │  12:30    │      │  12:30    │
 │ ┌───────┐ │ ⇅    │ Item    › │   Root list or vertical pages;
 │ │Gauge ◔│ │      │ Item    › │   Step (crown) dominates over Drill.
 │ └───────┘ │      │ Item    › │   Toolbar-like commands in corners.
 ╰───────────╯      ╰───────────╯`;

const shellG = `┌────────────────────────────────────────────────────────┐
│        Home    Movies   [ TV Shows ]   Search          │ ← top Region: section Choice
├────────────────────────────────────────────────────────┤
│  Row title                                             │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ──►      │ ← Collections as shelves
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘          │
│  Row title                                             │
│  ┌──────┐ ┌══════┐ ┌──────┐ ┌──────┐ ──►               │   (focused Item)
│  └──────┘ └══════┘ └──────┘ └──────┘                   │
└────────────────────────────────────────────────────────┘`;

// (`Note` as an alias: `note` is a keyword of Mermaid's state diagrams.)
const navigationModel = `stateDiagram-v2
  state "Note" as NoteState
  [*] --> Notes
  Notes --> Collections: Switch
  Collections --> Map: Switch
  Map --> Activity: Switch
  Collections --> CollectionDetail: Drill
  CollectionDetail --> NoteState: Drill
  Notes --> NoteState: Drill
  NoteState --> NoteState: Step (next/prev)
  NoteState --> Attachment: Drill
  NoteState --> Compose: Detour
  Compose --> NoteState: return
  NoteState --> SharePeek: Detour (Command set: share)
  state "Search (Jump)" as Search
  Notes --> Search
  Search --> NoteState: Jump`;

const searchJump = `Text input (purpose: search, tokens: scopes/filters)
      │ produces
      ▼
Collection (results; shape mirrors the target collection)
      │ selection → Drill into the same detail Surface as normal navigation
      ▼
Detail (no separate "search result" detail view)`;

/** §7 */
export const Section7: FunctionComponent = () => (
  <section>
    <Heading
      id="section-7"
      level={2}
    >
      7. Composing an entire app navigation
    </Heading>
    <p>
      Navigation is where Apple’s per-platform vocabulary hurts most: the same
      information architecture needs to be described with different nouns on
      iPhone, iPad, Mac, Vision Pro, Watch, and TV. With primitives, you
      describe the IA <strong>once</strong> and let rendering adapt.
    </p>

    <Heading
      id="section-7-1"
      level={3}
    >
      7.1 Start from the information architecture, not components
    </Heading>
    <p>Answer these before choosing any rendering:</p>
    <ol>
      <li>
        <strong>Sections</strong> — How many top-level, peer areas? Are they
        stable, or user-defined (e.g. folders, playlists)?
      </li>
      <li>
        <strong>Depth</strong> — How deep is the hierarchy below each section?
        Is it uniform?
      </li>
      <li>
        <strong>Object types</strong> — What are the nouns? Which ones have
        their own detail view?
      </li>
      <li>
        <strong>Lateral moves</strong> — Do people flip between siblings (next
        photo, next day) more than they go up/down?
      </li>
      <li>
        <strong>Detours</strong> — Which tasks are self-contained (compose,
        edit, sign in) and should return to where people came from?
      </li>
      <li>
        <strong>Jumps</strong> — How do people reach deep items directly
        (search, links, recents)?
      </li>
      <li>
        <strong>Commands</strong> — Which actions apply globally, to a section,
        to a selection, to one item?
      </li>
    </ol>

    <Heading
      id="section-7-2"
      level={3}
    >
      7.2 Six navigation moves
    </Heading>
    <p>
      Every navigation design is a combination of these moves, each backed by a
      primitive:
    </p>
    <Table
      rowIds={[
        'move-switch',
        'move-drill',
        'move-step',
        'move-detour',
        'move-peek',
        'move-jump',
      ]}
      rows={[
        ['Move', 'Meaning', 'Primitive', 'Apple renderings'],
        [
          bold('Switch'),
          'change top-level section',
          'Choice (navigating) in a Region',
          'Tab bar · Sidebar top level · Tab view · top tab bar (tvOS)',
        ],
        [
          bold('Drill'),
          'go one level deeper',
          'Collection selection → next Surface/column',
          'Navigation stack push · next split-view column · next column in column view',
        ],
        [
          bold('Step'),
          'move to a sibling at same level',
          'Collection (sequence)',
          'Page control · swipe paging · next/previous commands',
        ],
        [
          bold('Detour'),
          'do a self-contained task and return',
          'Surface (modal)',
          'Sheet · full-screen cover · new window (Mac/visionOS)',
        ],
        [
          bold('Peek'),
          'see something without leaving',
          'Surface (transient)',
          'Popover · context-menu preview · inspector panel',
        ],
        [
          bold('Jump'),
          'reach anything directly',
          'Text input (search) → Collection, or link',
          'Search field · path control · deep link · App Shortcut',
        ],
      ]}
    />
    <Mermaid>{moves}</Mermaid>

    <Heading
      id="section-7-3"
      level={3}
    >
      7.3 Choosing the section switcher
    </Heading>
    <Mermaid>{switcher}</Mermaid>
    <p>
      The decision is really one Choice with N options; the tree just picks a
      rendering per host.
    </p>

    <Heading
      id="section-7-4"
      level={3}
    >
      7.4 Canonical app shells
    </Heading>
    <p>
      Each shell is a recipe of primitives. Apple’s samples cluster into these
      seven.
    </p>
    <Heading
      id="shell-a"
      level={4}
    >
      A. Tabbed stack (iPhone default)
    </Heading>
    <Diagram>{shellA}</Diagram>
    <p>
      Primitives: Region(top, commands) · Collection · Region(bottom, section
      Choice) · Text input(search) · each tab holds its own Drill stack.
    </p>
    <Heading
      id="shell-b"
      level={4}
    >
      B. Sidebar + split (iPad / Mac default)
    </Heading>
    <Diagram>{shellB}</Diagram>
    <p>
      Primitives: Surface laid out as split · Region(leading, tree Collection) ·
      Collection · Viewer. In compact width this{' '}
      <strong>collapses to shell A</strong> (G4) — the sidebar’s top level
      becomes tabs or a root list; columns become stack levels.
    </p>
    <Heading
      id="shell-c"
      level={4}
    >
      C. Single stack (utility apps, Settings-like)
    </Heading>
    <Diagram>{shellC}</Diagram>
    <Heading
      id="shell-d"
      level={4}
    >
      D. Document windows (Mac, also iPad/visionOS)
    </Heading>
    <Diagram>{shellD}</Diagram>
    <p>
      Navigation is mostly <em>between surfaces</em>, not within one.
    </p>
    <Heading
      id="shell-e"
      level={4}
    >
      E. Spatial (visionOS)
    </Heading>
    <Diagram>{shellE}</Diagram>
    <p>Same shell A/B — Regions just detach into space.</p>
    <Heading
      id="shell-f"
      level={4}
    >
      F. Glanceable (watchOS)
    </Heading>
    <Diagram>{shellF}</Diagram>
    <p>
      Also extends outward into Complications/Widgets (
      <a href={guideHref('section-8-4')}>§8.4</a>).
    </p>
    <Heading
      id="shell-g"
      level={4}
    >
      G. Focus-driven (tvOS)
    </Heading>
    <Diagram>{shellG}</Diagram>

    <Heading
      id="section-7-5"
      level={3}
    >
      7.5 Worked example: one IA, every shell
    </Heading>
    <p>
      <strong>App:</strong> a field-notes app. <strong>IA:</strong>
    </p>
    <ul>
      <li>
        Sections: <em>Notes</em>, <em>Collections</em> (user-defined),{' '}
        <em>Map</em>, <em>Activity</em>
      </li>
      <li>Depth: Collection → Note → Attachment</li>
      <li>Lateral: next/previous note within a collection</li>
      <li>Detours: new note, edit metadata, share</li>
      <li>Jump: search across notes; recents</li>
      <li>
        Commands: global (New note) · section (Sort, Filter) · selection (Move,
        Tag, Delete) · item (Pin, Share)
      </li>
    </ul>
    <p>
      <strong>Navigation model (platform-independent):</strong>
    </p>
    <Mermaid>{navigationModel}</Mermaid>
    <p>
      <strong>Rendering per host:</strong>
    </p>
    <Table
      rows={[
        ['Element of the IA', 'iPhone', 'iPad', 'Mac', 'visionOS', 'watchOS'],
        [
          'Section switch (4, one user-defined)',
          'Tab bar; Collections tab contains its own list',
          'Sidebar with fixed sections + expandable Collections',
          'Sidebar (same)',
          'Leading ornament + sidebar inside window',
          'Root list',
        ],
        [
          'Drill Collection → Note',
          'Stack push',
          'Next split column',
          'Next split column',
          'Next column / push',
          'Push',
        ],
        [
          'Step between notes',
          'Swipe / toolbar next-prev',
          'Toolbar next/prev + keyboard',
          'Menu bar commands + shortcuts',
          'Bottom ornament',
          'Crown',
        ],
        [
          'New note (global)',
          'Toolbar button → sheet',
          'Toolbar → sheet or new window',
          'Menu bar + toolbar → new window',
          'New window',
          'Dictation sheet',
        ],
        [
          'Selection commands',
          'Context menu + edit mode toolbar',
          'Context menu + toolbar',
          'Menu bar + context menu + toolbar',
          'Context menu + ornament',
          'Swipe actions',
        ],
        [
          'Share',
          'Command set → system share sheet',
          '→ popover',
          '→ popover/menu',
          '→ popover',
          '—',
        ],
        [
          'Search (Jump)',
          'Search beside tab bar',
          'Search in sidebar',
          'Search in toolbar',
          'Search in ornament/window',
          'Dictation',
        ],
        [
          'Activity badge',
          'Badge on tab item',
          'Badge on sidebar item',
          'Badge on sidebar + Dock',
          'Badge on ornament item',
          'Complication',
        ],
        [
          'Outside the app',
          'Widget, Live Activity (sync)',
          'Widget',
          'Widget, menu bar extra',
          'Widget',
          'Complication',
        ],
      ]}
    />
    <p>
      Same IA, same primitives, same rules; only the right-hand cells change. In
      Apple’s vocabulary this table would cite ~20 distinct components.
    </p>

    <Heading
      id="section-7-6"
      level={3}
    >
      7.6 Search as a navigation primitive
    </Heading>
    <p>
      Apple treats search as a field placed somewhere. Structurally it’s a{' '}
      <strong>Jump move</strong> composed of:
    </p>
    <Diagram>{searchJump}</Diagram>
    <p>
      Composition questions to answer once: Is search global or scoped to the
      current section? Do scopes become tokens (Token-field behavior) or a
      Choice (segmented scope bar)? Does search get its own Switch slot (iOS 26
      tab-bar-adjacent search) or live inside each section’s Region?
    </p>

    <Heading
      id="section-7-7"
      level={3}
    >
      7.7 Navigation anti-patterns the primitives make visible
    </Heading>
    <Table
      rows={[
        ['Anti-pattern', 'Rule violated'],
        ['“Add” or “Compose” as a tab', 'G1 — action in a navigation Choice'],
        [
          'Tabs that appear after sign-in',
          'G2 — unstable navigation structure',
        ],
        ['Popover opening another popover', 'G3'],
        [
          'Different section structure on iPad vs iPhone',
          'G4 — re-conceived instead of re-rendered',
        ],
        [
          'Confirm-alert for a reversible action',
          'G5 — modality too high; offer undo',
        ],
        [
          'Command reachable only via context menu',
          'G6 — command not projected into a primary host',
        ],
        ['Toolbar buttons with their own hidden selection state', 'G7'],
        [
          'Hamburger menu hiding 4 stable sections',
          'Section count fits a visible Choice; collapsed form chosen anyway',
        ],
        [
          'Separate “search results detail” screen',
          '7.6 — Jump should land in the canonical detail',
        ],
      ]}
    />
  </section>
);
