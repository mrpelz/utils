import { FunctionComponent, ReactNode } from 'react';

import { Diagram, Heading, Mermaid, Table } from './parts.js';

const bold = (text: string) => <strong key="0">{text}</strong>;

/** §4 */
export const Section4: FunctionComponent = () => (
  <section>
    <Heading
      id="section-4"
      level={2}
    >
      4. A shared trait vocabulary
    </Heading>
    <p>
      Instead of nouns, describe each component by a small set of orthogonal
      traits. Every Apple component becomes a point in this space; components
      occupying the same point (or differing on one trait) are candidates for
      merging.
    </p>

    <Heading
      id="section-4-traits"
      level={3}
    >
      The traits
    </Heading>
    <Table
      id="traits"
      rows={[
        ['Trait', 'Question it answers', 'Values'],
        [
          bold('Intent'),
          'What does the person accomplish?',
          'Navigate · Act · Choose · Enter · Display · Report · Contain',
        ],
        [
          bold('Data shape'),
          'What structure is underneath?',
          'None · Scalar · Set · Sequence · Tree · Text · Media',
        ],
        [
          bold('Selection'),
          'How many things can be selected?',
          'None · One · Many · Range',
        ],
        [
          bold('Commitment'),
          'When does the change take effect?',
          'Immediate · On confirm · Reversible (undo)',
        ],
        [
          bold('Lifetime'),
          'How long does it stay?',
          'Persistent · Contextual (while relevant) · Transient (dismiss on outside) · Modal (blocks until resolved)',
        ],
        [
          bold('Modality scope'),
          'What does it block?',
          'Nothing · Element · View · Window · App · System',
        ],
        [
          bold('Anchor'),
          'What is it attached to?',
          'Window edge · Content element · Control · Pointer · Text selection · System surface · Space (visionOS)',
        ],
        [
          bold('Layer'),
          'Which plane does it occupy?',
          'Content · Functional (glass) · Overlay · System',
        ],
        [
          bold('Capacity'),
          'How many items before overflow?',
          '2 · ~3–6 · ~dozens · Unbounded',
        ],
        [
          bold('Overflow strategy'),
          'What happens past capacity?',
          'Truncate · “More” item · Scroll · Collapse into menu · Convert to another form',
        ],
        [
          bold('Adaptation'),
          'How does it morph across size/platform/input?',
          'Re-render (same concept) · Replace (different concept) · Unavailable',
        ],
        [
          bold('Ownership'),
          'Who draws it?',
          'App · System-with-app-content · System',
        ],
        [
          bold('Disclosure'),
          'When is it visible?',
          'Always · Progressive (expand) · On demand (summon)',
        ],
      ]}
    />

    <Heading
      id="trait-matrix"
      level={3}
    >
      Trait matrix (excerpt — the components most worth comparing)
    </Heading>
    <Table
      rows={[
        [
          'Component',
          'Intent',
          'Shape',
          'Sel.',
          'Lifetime',
          'Anchor',
          'Layer',
          'Capacity',
        ],
        [
          'Tab bar',
          'Navigate',
          'Set',
          'One',
          'Persistent',
          'Window edge',
          'Functional',
          '~3–6',
        ],
        [
          'Tab view (mac)',
          'Navigate',
          'Set',
          'One',
          'Persistent',
          'View edge',
          'Content',
          '~3–6',
        ],
        [
          'Sidebar',
          'Navigate',
          'Tree',
          'One/Many',
          'Persistent',
          'Window edge',
          'Functional',
          'Unbounded',
        ],
        [
          'Segmented control',
          'Choose / Navigate',
          'Set',
          'One/Many',
          'Persistent',
          'Inline',
          'Content/Functional',
          '~2–5',
        ],
        [
          'Page control',
          'Navigate',
          'Sequence',
          'One',
          'Persistent',
          'Content edge',
          'Content',
          '~10',
        ],
        [
          'Pop-up button',
          'Choose',
          'Set',
          'One',
          'On demand',
          'Control',
          'Overlay',
          'Dozens',
        ],
        [
          'Picker (wheel/menu)',
          'Choose',
          'Set/Sequence',
          'One',
          'Inline or on demand',
          'Control',
          'Content/Overlay',
          'Unbounded',
        ],
        [
          'Toggle',
          'Choose',
          'Scalar (bool)',
          'One of 2',
          'Persistent',
          'Inline',
          'Content',
          '2',
        ],
        [
          'Stepper',
          'Choose/Enter',
          'Ordered scalar',
          'One',
          'Persistent',
          'Inline',
          'Content',
          'Unbounded',
        ],
        [
          'Slider',
          'Enter',
          'Bounded scalar',
          'One/Range',
          'Persistent',
          'Inline',
          'Content',
          '∞ (continuous)',
        ],
        [
          'Gauge',
          'Report',
          'Bounded scalar',
          '—',
          'Persistent',
          'Inline',
          'Content',
          '∞',
        ],
        [
          'Progress indicator',
          'Report',
          'Bounded/unbounded scalar',
          '—',
          'Contextual',
          'Inline/Edge',
          'Content',
          '∞',
        ],
        [
          'Rating indicator',
          'Report (+Enter on mac)',
          'Ordered scalar',
          'One',
          'Persistent',
          'Inline',
          'Content',
          '~5',
        ],
        [
          'Menu',
          'Act/Choose',
          'Tree',
          '—',
          'Transient',
          'Control',
          'Overlay',
          'Dozens',
        ],
        [
          'Context menu',
          'Act',
          'Tree',
          '—',
          'Transient',
          'Content element / Pointer',
          'Overlay',
          'Dozens',
        ],
        [
          'Edit menu',
          'Act',
          'Set',
          '—',
          'Transient',
          'Text selection',
          'Overlay',
          '~6',
        ],
        [
          'Pull-down button',
          'Act',
          'Tree',
          '—',
          'Transient',
          'Control',
          'Overlay',
          'Dozens',
        ],
        [
          'Action sheet',
          'Act',
          'Set',
          '—',
          'Modal (soft)',
          'Control/Window',
          'Overlay',
          '~2–6',
        ],
        [
          'Activity view',
          'Act (system-supplied)',
          'Set',
          '—',
          'Modal (soft)',
          'Control',
          'Overlay',
          'Unbounded',
        ],
        [
          'Popover',
          'Contain',
          'Any',
          '—',
          'Transient',
          'Control/Element',
          'Overlay',
          '—',
        ],
        [
          'Sheet',
          'Contain',
          'Any',
          '—',
          'Modal (window)',
          'Window',
          'Overlay',
          '—',
        ],
        [
          'Alert',
          'Report + Act',
          'Set (buttons)',
          '—',
          'Modal (app)',
          'Window/App',
          'Overlay',
          '1–3',
        ],
        [
          'Panel (mac)',
          'Contain',
          'Any',
          '—',
          'Persistent, non-modal',
          'Window',
          'Overlay',
          '—',
        ],
        [
          'Ornament',
          'Contain',
          'Any',
          '—',
          'Persistent',
          'Window edge (space)',
          'Functional',
          '—',
        ],
        [
          'Toolbar',
          'Act/Navigate',
          'Set',
          '—',
          'Persistent',
          'Window edge',
          'Functional',
          '~3–8',
        ],
        [
          'Text field',
          'Enter',
          'Text',
          '—',
          'Persistent',
          'Inline',
          'Content',
          '—',
        ],
        [
          'Search field',
          'Enter → Navigate',
          'Text',
          '—',
          'Persistent/Contextual',
          'Region',
          'Functional',
          '—',
        ],
        [
          'Token field',
          'Enter',
          'Set of tokens',
          'Many',
          'Persistent',
          'Inline',
          'Content',
          'Unbounded',
        ],
        [
          'Combo box',
          'Enter + Choose',
          'Text ∪ Set',
          'One',
          'Persistent',
          'Inline',
          'Content',
          'Dozens',
        ],
        [
          'Lists and tables',
          'Display/Navigate',
          'Sequence/Set',
          'None/One/Many',
          'Persistent',
          'Content',
          'Content',
          'Unbounded',
        ],
        [
          'Outline view',
          'Display/Navigate',
          'Tree',
          'One/Many',
          'Persistent',
          'Content',
          'Content',
          'Unbounded',
        ],
        [
          'Column view',
          'Navigate',
          'Tree',
          'One per level',
          'Persistent',
          'Content',
          'Content',
          'Unbounded',
        ],
        [
          'Path control',
          'Navigate',
          'Tree (path)',
          'One',
          'Persistent',
          'Inline/Edge',
          'Content',
          '~depth',
        ],
        [
          'Widget',
          'Report (+Act)',
          'Any',
          '—',
          'Persistent',
          'System surface',
          'System',
          '—',
        ],
        [
          'Live Activity',
          'Report (+Act)',
          'Scalar/Sequence over time',
          '—',
          'Contextual',
          'System surface',
          'System',
          '—',
        ],
        [
          'Notification',
          'Report (+Act)',
          'Message',
          '—',
          'Transient → persistent list',
          'System surface',
          'System',
          '—',
        ],
      ]}
    />
    <p>
      Reading the matrix vertically reveals clusters: rows that differ in one
      cell are the same component wearing different clothes.
    </p>
  </section>
);

const primitivesDiagram = `flowchart TB
  subgraph Structure
    SURF[Surface]
    REG[Region]
  end
  subgraph Content
    COLL[Collection]
    ITEM[Item]
    VIEW[Viewer]
    GRP[Group]
  end
  subgraph Interaction
    CMD[Command]
    CSET[Command set]
    CHO[Choice]
    VAL[Value input]
    TXT[Text input]
  end
  subgraph Feedback
    IND[Indicator]
  end
  SURF --> REG
  SURF --> COLL
  SURF --> VIEW
  REG --> CMD
  REG --> CHO
  REG --> TXT
  COLL --> ITEM
  GRP --> ITEM
  ITEM --> CMD
  ITEM --> CHO
  ITEM --> VAL
  ITEM --> IND
  CMD -. summons .-> CSET
  CMD -. summons .-> SURF
  CSET -. renders as .-> SURF`;

/** One of the twelve primitives (anchored `primitive-…`). */
const Primitive: FunctionComponent<{
  absorbs: ReactNode;
  children: ReactNode;
  id: string;
  name: string;
  number: number;
  parameters?: ReactNode;
  parametersLabel?: string;
}> = ({
  absorbs,
  children,
  id,
  name,
  number,
  parameters = undefined,
  parametersLabel = 'Parameters',
}) => (
  <p id={`primitive-${id}`}>
    <strong>
      {String(number)}. {name}
    </strong>{' '}
    — {children}
    {parameters ? (
      <>
        <br />
        {parametersLabel}: {parameters}
      </>
    ) : null}
    <br />
    Absorbs: {absorbs}
  </p>
);

const surfaceFamily = `                    MODALITY SCOPE ──►
              none        element      window        app
           ┌───────────┬────────────┬─────────────┬───────────┐
 window    │ Panel     │            │ Sheet       │           │
 anchor    │ Window    │            │             │           │
           ├───────────┼────────────┼─────────────┼───────────┤
 control / │ Popover   │ Menu       │ Action sheet│           │
 element   │ (transient)│(transient)│ (compact)   │           │
           ├───────────┼────────────┼─────────────┼───────────┤
 centered  │           │            │             │ Alert     │
           ├───────────┼────────────┼─────────────┼───────────┤
 spatial   │ Ornament  │            │             │           │
           └───────────┴────────────┴─────────────┴───────────┘
 Empty cells are combinations Apple doesn't name — which is a design decision
 the re-slicing makes visible (e.g. a non-modal centered surface = a toast/HUD).`;

const choiceFamily = `              options visible at once? ──►
                   yes (inline)                 no (collapsed)
           ┌─────────────────────────────┬────────────────────────────┐
 N = 2     │ Toggle / checkbox           │  —                         │
 N ≤ ~5    │ Segmented control / radios  │ Pop-up button              │
 N large   │ Wheel picker / list         │ Pop-up / menu picker       │
 ordered   │ Stepper                     │ Picker (date/number)       │
 + free    │  —                          │ Combo box                  │
 entry     │                             │                            │
           └─────────────────────────────┴────────────────────────────┘`;

const indicatorContinuum = `  read-only                                                  editable
  ─────────────────────────────────────────────────────────────────────►
  Activity rings   Gauge   Progress   Rating (display)   Rating (mac, editable)   Slider
       │             │        │             │                    │                  │
       └─────────────┴────────┴──── same concept: a quantity on a scale ───────────┘
                                  only "editable?" changes`;

/** §5 */
export const Section5: FunctionComponent = () => (
  <section>
    <Heading
      id="section-5"
      level={2}
    >
      5. Proposal: re-slicing into primitives
    </Heading>
    <p>
      Collapse ~60 components into <strong>12 primitives</strong>. Each
      primitive is defined by what it <em>is</em>; Apple’s components become{' '}
      <em>configurations</em> (trait settings) of a primitive.
    </p>
    <Mermaid id="primitives-diagram">{primitivesDiagram}</Mermaid>

    <Heading
      id="section-5-primitives"
      level={3}
    >
      The primitives
    </Heading>
    <Primitive
      absorbs="Windows, Panels, Sheets, Popovers, Alerts (as host), Action sheets (as host), Ornaments, and the canvas of Widgets / Live Activities / Complications."
      id="surface"
      name="Surface"
      number={1}
      parameters={
        <>
          <em>anchor</em> (window · element · control · pointer · system host ·
          space), <em>modality scope</em>, <em>lifetime</em>,{' '}
          <em>size behavior</em>.
        </>
      }
    >
      a bounded plane that hosts content.
    </Primitive>
    <Primitive
      absorbs="Toolbars (incl. navigation bars), Tab bars (as a region), The menu bar, Status bars, the glass sidebar container, Ornaments placed on edges."
      id="region"
      name="Region"
      number={2}
      parameters={
        <>
          <em>edge</em>, <em>capacity</em>, <em>collapse/scroll behavior</em>,{' '}
          <em>ownership</em>.
        </>
      }
    >
      an edge-anchored strip of a surface that hosts commands, choices, or
      navigation.
    </Primitive>
    <Primitive
      absorbs="Lists and tables, Collections, Outline views, Column views, Sidebar content, Path controls (a collection projected as a breadcrumb of the current path), Page controls (a collection projected as dots), Scroll views (the scrolling behavior of any collection)."
      id="collection"
      name="Collection"
      number={3}
      parameters={
        <>
          <em>shape</em> (flat · sectioned · tree), <em>projection</em> (rows ·
          grid · columns · breadcrumb · pages), <em>selection</em> (none · one ·
          many), <em>editability</em> (reorder, delete).
        </>
      }
    >
      a set of items with a data shape and a projection.
    </Primitive>
    <Primitive
      absorbs="Labels, Lockups, table rows, collection cells, tab items, sidebar rows, menu items (an item in a command set)."
      id="item"
      name="Item"
      number={4}
      parametersLabel="Slots"
      parameters={
        <>
          <em>
            leading visual · title · subtitle · trailing accessory · badge ·
            inline control
          </em>
          .
        </>
      }
    >
      one entry in a collection or group with fixed slots.
    </Primitive>
    <Primitive
      absorbs="Text views, Image views, Web views, Charts."
      id="viewer"
      name="Viewer"
      number={5}
    >
      renders a single piece of media or document.
    </Primitive>
    <Primitive
      absorbs="Boxes, Disclosure controls, list sections, form groups."
      id="group"
      name="Group"
      number={6}
    >
      visually or semantically bundles items, optionally collapsible.
    </Primitive>
    <Primitive
      absorbs="Buttons, toolbar items, menu items, Home Screen quick action entries, App Shortcuts, Controls (Control Center), dock menu entries."
      id="command"
      name="Command"
      number={7}
    >
      one invocable action with a stable identity (name, symbol, shortcut,
      enablement, destructive flag).
    </Primitive>
    <Primitive
      absorbs="Menus, Context menus, Edit menus, Dock menus, Pull-down buttons, Action sheets, Activity views, Home Screen quick actions, the menu bar’s menus."
      id="command-set"
      name="Command set"
      number={8}
      parameters={
        <>
          <em>anchor</em> (menu bar · control · content element · text selection
          · app icon · share) and <em>render form</em> (menu · sheet list ·
          popover list · system share UI).
        </>
      }
    >
      an ordered, possibly nested set of commands, summoned from an anchor.
    </Primitive>
    <Primitive
      id="choice"
      name="Choice"
      number={9}
      absorbs={
        <>
          Toggles (N=2, inline), Segmented controls (N≤5, inline), Pop-up
          buttons (collapsed), Pickers (collapsed or wheel), Steppers (ordered,
          step-wise), Combo boxes (collapsed + free entry), radio groups and
          checkboxes, Tab bars’ <em>selection behavior</em>.
        </>
      }
      parameters={
        <>
          <em>N</em>, <em>cardinality</em>, <em>ordered?</em>,{' '}
          <em>visibility</em> (all options inline vs collapsed-on-demand),{' '}
          <em>free entry allowed?</em>
        </>
      }
    >
      select one or many from a known set.
    </Primitive>
    <Primitive
      absorbs="Sliders, Color wells, Image wells, date/time Pickers, Digit entry views, Steppers (numeric variant)."
      id="value-input"
      name="Value input"
      number={10}
      parameters={
        <>
          <em>value type</em> (number · range · color · image · date · digits),{' '}
          <em>precision</em>, <em>continuous vs discrete</em>.
        </>
      }
    >
      set a typed value that isn’t a pick from a set.
    </Primitive>
    <Primitive
      absorbs="Text fields, Search fields, Token fields, Combo boxes (text side), editable Text views, Virtual keyboards (as an input-method parameter, not a component)."
      id="text-input"
      name="Text input"
      number={11}
      parameters={
        <>
          <em>purpose</em> (generic · search · secure · one-time code),{' '}
          <em>tokenization</em>, <em>suggestions source</em>,{' '}
          <em>single vs multi-line</em>, <em>input method</em> (hardware ·
          virtual keyboard · dictation · scribble).
        </>
      }
    >
      free text with optional structure.
    </Primitive>
    <Primitive
      absorbs="Progress indicators, Gauges, Activity rings, Rating indicators, badges, and conceptually Sliders (an editable gauge)."
      id="indicator"
      name="Indicator"
      number={12}
      parameters={
        <>
          <em>bounded?</em>, <em>determinate?</em>, <em>series count</em> (1 ·
          many, e.g. rings), <em>discrete vs continuous</em>, <em>editable?</em>
        </>
      }
    >
      displays a quantity or state; becomes a Value input when made editable.
    </Primitive>

    <Heading
      id="section-5-mapping"
      level={3}
    >
      Mapping table: Apple → primitive + configuration
    </Heading>
    <Table
      rows={[
        ['Apple component', 'Primitive', 'Key configuration'],
        [
          'Tab bar',
          'Region + Choice',
          'bottom/top edge · N≈3–6 · single · navigates',
        ],
        [
          'Tab view',
          'Choice over Surfaces',
          'inline · N≈3–6 · single · navigates',
        ],
        [
          'Sidebar',
          'Region + Collection',
          'leading edge · tree · single/many · navigates',
        ],
        ['Segmented control', 'Choice', 'inline · N≤5 · single/many'],
        ['Page control', 'Collection (projection: dots)', 'sequence · single'],
        [
          'Path control',
          'Collection (projection: breadcrumb)',
          'tree path · single',
        ],
        ['Lists and tables', 'Collection', 'flat/sectioned · rows'],
        ['Collections', 'Collection', 'flat/sectioned · grid'],
        ['Outline view', 'Collection', 'tree · rows with disclosure'],
        ['Column view', 'Collection', 'tree · columns'],
        ['Scroll view', '(behavior of Surface/Collection)', '—'],
        ['Split view', 'Surface layout', '2–3 linked collections/viewers'],
        ['Toolbar', 'Region', 'top/bottom edge · commands + choices'],
        ['The menu bar', 'Region + Command sets', 'system-owned top edge'],
        ['Status bar', 'Region', 'system-owned · indicators only'],
        ['Ornament', 'Region/Surface', 'spatial anchor to window'],
        ['Button', 'Command', 'inline rendering'],
        [
          'Menu / Pull-down / Context / Edit / Dock menus',
          'Command set',
          'anchor = control · pointer · selection · Dock',
        ],
        ['Home Screen quick actions', 'Command set', 'anchor = app icon'],
        [
          'Action sheet',
          'Command set',
          'anchor = control · rendered as sheet (compact) / popover (regular)',
        ],
        [
          'Activity view',
          'Command set',
          'system-supplied commands · share anchor',
        ],
        ['Pop-up button', 'Choice', 'collapsed · single'],
        ['Picker', 'Choice or Value input', 'collapsed/wheel · single'],
        ['Toggle', 'Choice', 'N=2 · inline'],
        ['Stepper', 'Choice/Value input', 'ordered · discrete'],
        ['Combo box', 'Choice + Text input', 'free entry allowed'],
        [
          'Slider',
          'Value input (= editable Indicator)',
          'bounded · continuous',
        ],
        ['Color well / Image well', 'Value input', 'typed slot · drop target'],
        ['Digit entry view', 'Text input', 'purpose = code · fixed length'],
        [
          'Text field / Search field / Token field',
          'Text input',
          'purpose · tokenization',
        ],
        ['Virtual keyboard', '(input method of Text input)', '—'],
        [
          'Progress / Gauge / Activity rings / Rating',
          'Indicator',
          'bounded · determinate · series',
        ],
        ['Label / Lockup', 'Item', 'slot configurations'],
        ['Box / Disclosure control', 'Group', 'framed · collapsible'],
        ['Text / Image / Web views / Charts', 'Viewer', 'media type'],
        [
          'Sheet / Popover / Panel / Window',
          'Surface',
          'anchor · modality · lifetime',
        ],
        [
          'Alert',
          'Surface + Command set',
          'app-modal · 1–3 commands · message',
        ],
        [
          'Widget / Complication / Live Activity / Top Shelf',
          'Surface (system-hosted) + Viewer/Indicator',
          'host · refresh budget',
        ],
        [
          'Controls (Control Center) / App Shortcuts',
          'Command (system-hosted)',
          'host',
        ],
        [
          'Notification',
          'Surface (system-hosted) + Command set',
          'transient → list',
        ],
        [
          'Watch faces',
          'Region of system surface (slots for complications)',
          '—',
        ],
      ]}
    />
    <p>
      <strong>Result:</strong> ~60 nouns → 12 primitives × a handful of traits.
      Most of what Apple writes as separate pages becomes a sentence like{' '}
      <em>
        “a Command set anchored to a text selection, capacity ~6, rendered as a
        horizontal bar”
      </em>{' '}
      (= Edit menu).
    </p>

    <Heading
      id="surface-family"
      level={3}
    >
      The surface family as one parameter space
    </Heading>
    <Diagram>{surfaceFamily}</Diagram>

    <Heading
      id="choice-family"
      level={3}
    >
      The choice family as one parameter space
    </Heading>
    <Diagram>{choiceFamily}</Diagram>

    <Heading
      id="indicator-continuum"
      level={3}
    >
      The indicator ↔ input continuum
    </Heading>
    <Diagram>{indicatorContinuum}</Diagram>
  </section>
);
