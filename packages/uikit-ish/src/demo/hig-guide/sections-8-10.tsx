import { FunctionComponent } from 'react';

import { guideHref } from './link.js';
import { Diagram, Heading, Hig, Mermaid, Table } from './parts.js';
import { catalogPages, HigList } from './sections-1-3.js';

const commandRegistry = `flowchart LR
  REG[(Command registry<br/>name · symbol · shortcut ·<br/>scope · enablement · destructive)]
  REG --> MB[Menu bar<br/>complete, organized by scope]
  REG --> TB[Toolbar<br/>frequent, current context]
  REG --> CM[Context menu<br/>applies to pointed item]
  REG --> EM[Edit menu<br/>applies to text selection]
  REG --> KS[Keyboard shortcuts]
  REG --> QA[Home Screen quick actions<br/>entry points]
  REG --> AS[App Shortcuts / Siri<br/>headless]
  REG --> CC[Controls<br/>Control Center / Lock Screen]
  REG --> DM[Dock menu]`;

const form = `Surface (sheet for new · inline for edit)
└─ Group "Details"
   ├─ Item: Title ............ [ Text input ]
   ├─ Item: Category ......... [ Choice: collapsed, N=12 ]
   ├─ Item: Priority ......... [ Choice: inline, N=3 ]
   └─ Item: Reminder ......... [ Choice: N=2 ]  → reveals ▾
      └─ Item: Date .......... [ Value input: date ]       (progressive disclosure)
└─ Group "Appearance"
   ├─ Item: Color ............ [ Value input: color ]
   └─ Item: Cover ............ [ Value input: image ]
Region (top): Cancel · Done        ← commit model lives on the Surface, not the fields`;

const feedback = `flowchart TB
  E[Event / long task] --> Q{Scope?}
  Q -->|one item| I1[Indicator in Item slot · badge]
  Q -->|current view| I2[Inline progress · banner in content]
  Q -->|window/app| I3[Toolbar indicator · app badge]
  Q -->|outlives the app session| I4[Live Activity · notification]
  Q -->|needs decision now & irreversible| I5[Alert]`;

const projections = `App model ──► in-app shells (§7)
         └──► system projections: same data, same commands, smaller budgets
              Widget ≈ a tiny Surface showing a Collection/Indicator
              Live Activity ≈ an Indicator whose lifetime = the task
              Control ≈ one Command lifted out of the toolbar`;

/** §8 */
export const Section8: FunctionComponent = () => (
  <section>
    <Heading
      id="section-8"
      level={2}
    >
      8. Other whole-app compositions
    </Heading>

    <Heading
      id="section-8-1"
      level={3}
    >
      8.1 Command architecture
    </Heading>
    <p>
      Define commands once; project them into hosts by context. This single idea
      replaces the Menus/Context menus/Edit menus/Toolbars/Quick actions/App
      Shortcuts/Controls pages as a composition concern.
    </p>
    <Mermaid>{commandRegistry}</Mermaid>
    <Table
      rows={[
        ['Host', 'Selects commands by', 'Capacity'],
        ['Menu bar', 'All commands, grouped by scope', 'Unbounded'],
        [
          'Toolbar',
          'Frequency × current context',
          '~3–8, overflow into a Command set',
        ],
        ['Context menu', 'Applies to the pointed item', '~dozens, grouped'],
        ['Edit menu', 'Applies to text/selection', '~6, horizontal'],
        ['Keyboard', 'Frequency for experts', '—'],
        ['Quick actions', 'Entry points that start a flow', '~4'],
        ['App Shortcuts', 'Can run without UI or with minimal UI', '~10'],
        ['Controls', 'One-tap, stateful (toggle) or launch', '1 per control'],
      ]}
    />
    <p>
      Command <em>scopes</em> map onto navigation: <strong>global</strong>{' '}
      (app), <strong>section</strong>, <strong>view</strong>,{' '}
      <strong>selection</strong>, <strong>item</strong>. A command’s scope
      decides which hosts are eligible.
    </p>

    <Heading
      id="section-8-2"
      level={3}
    >
      8.2 Data entry &amp; editing
    </Heading>
    <p>
      Forms are Groups of Items whose trailing slot holds a Choice, Value input,
      or Text input.
    </p>
    <Diagram>{form}</Diagram>
    <p>Key composition decisions, independent of components:</p>
    <ul>
      <li id="commit-model">
        <strong>Commit model</strong> — immediate per-field (settings) vs
        deferred to a Surface-level Done (create/edit). Don’t mix within one
        Surface.
      </li>
      <li>
        <strong>Choice rendering</strong> follows the choice-family grid in{' '}
        <a href={guideHref('choice-family')}>§5</a> — pick by N and frequency,
        not by platform habit.
      </li>
      <li>
        <strong>Validation status</strong> attaches to the Item (
        <a href={guideHref('rule-g8')}>G8</a>), not an alert.
      </li>
    </ul>

    <Heading
      id="section-8-3"
      level={3}
    >
      8.3 Feedback &amp; status architecture
    </Heading>
    <Mermaid>{feedback}</Mermaid>
    <p>
      Apple splits this across Progress indicators, Gauges, Alerts,
      Notifications, Live Activities, Feedback, and Loading. Composed by scope,
      it’s one decision.
    </p>

    <Heading
      id="section-8-4"
      level={3}
    >
      8.4 System projections
    </Heading>
    <p>
      Widgets, Complications, Live Activities, Controls, Notifications, Top
      Shelf, Watch faces, and App Shortcuts are the app’s model{' '}
      <strong>projected onto surfaces the system owns</strong>. Treat them as
      reduced renderings of the same primitives, under a budget:
    </p>
    <Table
      rows={[
        ['Projection', 'Primitives allowed', 'Budget'],
        [
          'Widget',
          'Viewer · Indicator · Collection (small) · Command (limited)',
          'Size family · refresh schedule',
        ],
        [
          'Complication',
          'Indicator · short text · Viewer (glyph)',
          'Slot shape on watch face',
        ],
        [
          'Live Activity',
          'Indicator over time · Command (limited)',
          'Duration · compact/expanded forms',
        ],
        ['Control', 'One Command or one toggle Choice', 'One'],
        [
          'Notification',
          'Message Viewer · Command set (actions)',
          'Transient, then listed',
        ],
        ['Top Shelf', 'Collection (shelf)', 'Featured content'],
        ['App Shortcut', 'Command (headless)', 'Phrase + parameters'],
      ]}
    />
    <Diagram>{projections}</Diagram>
    <p>
      Design rule:{' '}
      <strong>
        every projection should deep-link into the canonical navigation location
      </strong>{' '}
      (a Jump, <a href={guideHref('section-7-2')}>§7.2</a>), never into a
      special-purpose screen.
    </p>
  </section>
);

/** §9 */
export const Section9: FunctionComponent = () => (
  <section>
    <Heading
      id="section-9"
      level={2}
    >
      9. Where Apple’s split is actually justified
    </Heading>
    <p>
      The re-slicing is a thinking tool, not a claim that Apple’s catalog is
      wrong everywhere. Some separations carry real weight:
    </p>
    <ul>
      <li>
        <strong>Input modality differs materially.</strong> Pointer hover,
        touch, focus engine (tvOS), gaze-and-pinch (visionOS), and Digital Crown
        change what “a Choice” can safely be. A wheel picker exists because a
        crown exists.
      </li>
      <li>
        <strong>Muscle memory is a feature.</strong> People know “the thing at
        the bottom of iPhone” and “the menu bar on Mac”. Naming those renderings
        separately helps designers respect platform expectations.
      </li>
      <li>
        <strong>Accessibility semantics.</strong> Assistive technologies
        announce roles (“tab, 2 of 4”, “pop-up button”, “adjustable”). The role
        taxonomy is closer to Apple’s nouns than to abstract primitives, so the
        primitive needs a role mapping per configuration.
      </li>
      <li>
        <strong>System ownership is a hard boundary.</strong> Widgets, Live
        Activities, and notifications run under system budgets and privacy
        constraints; the “same primitive, smaller budget” framing understates
        how different the constraints are.
      </li>
      <li>
        <strong>Some differences are behavioral, not visual.</strong> Action
        sheet vs alert is cosmetic in structure but differs in intent (choose a
        path vs acknowledge a problem); keeping intent explicit helps writers.
      </li>
    </ul>
    <p>
      The useful takeaway:{' '}
      <strong>
        design with primitives and traits; document and ship with Apple’s names
      </strong>{' '}
      so the platform-specific renderings stay recognizable.
    </p>
  </section>
);

/** §10 */
export const Section10: FunctionComponent = () => (
  <section>
    <Heading
      id="section-10"
      level={2}
    >
      10. Open questions
    </Heading>
    <ul>
      <li>
        Should <strong>Section switch</strong> be its own primitive rather than
        a navigating Choice? It has unique rules (G2 stability, persistence of
        per-section stacks) that ordinary Choices don’t.
      </li>
      <li>
        Is <strong>Scroll view</strong> a primitive (a behavior shared by
        Surfaces and Collections) or just a property? Liquid Glass makes scroll
        position drive Region behavior (bars shrinking), which argues for
        elevating it.
      </li>
      <li>
        Where do <strong>gestures</strong> live (swipe actions, pull to
        refresh)? They’re alternate anchors for Commands — possibly a trait of
        Command projection.
      </li>
      <li>
        Should <strong>Sidebar</strong> be split into “navigation sidebar”
        (Switch) and “content sidebar / inspector” (Peek)? Apple uses one word
        for both on Mac.
      </li>
      <li>
        Empty cells in the Surface grid (e.g. non-modal centered HUDs, toasts) —
        Apple avoids them; is that principle or omission?
      </li>
    </ul>
  </section>
);

/** The appendix: Apple's pages, by category. */
export const Appendix: FunctionComponent = () => (
  <section>
    <Heading
      id="section-appendix"
      level={2}
    >
      Appendix: link index
    </Heading>
    <p>
      <strong>Overview:</strong> <Hig page="components">Components</Hig>
    </p>
    <p>
      <strong>Content:</strong> <HigList pages={catalogPages.content} />
    </p>
    <p>
      <strong>Layout &amp; organization:</strong>{' '}
      <HigList pages={catalogPages.layout} />
    </p>
    <p>
      <strong>Menus &amp; actions:</strong>{' '}
      <HigList pages={catalogPages.menus} />
    </p>
    <p>
      <strong>Navigation &amp; search:</strong>{' '}
      <HigList pages={catalogPages.navigation} />
    </p>
    <p>
      <strong>Presentation:</strong>{' '}
      <HigList pages={catalogPages.presentation} />
    </p>
    <p>
      <strong>Selection &amp; input:</strong>{' '}
      <HigList pages={catalogPages.selection} />
    </p>
    <p>
      <strong>Status:</strong> <HigList pages={catalogPages.status} />
    </p>
    <p>
      <strong>System experiences:</strong>{' '}
      <HigList pages={catalogPages.system} />
    </p>
    <p>
      <strong>Supporting pages:</strong>{' '}
      <HigList pages={catalogPages.supporting} />
    </p>
  </section>
);
