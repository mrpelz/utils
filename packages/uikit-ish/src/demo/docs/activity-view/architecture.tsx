import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/activity-view/architecture`: how ActivityView is built, and what flows
// into it.

const itemCode = `// ActivityView.Person (and .Action), in short: a list item holding a
// button, so a row of them is a list for assistive technology.
<div role="listitem" className="uikit-activity-view-list-item">
  <button type="button" className="uikit-activity-view-item" {...props} />
</div>

// Its rows: a list, scrolling sideways, centered when it fits.
.uikit-activity-view-row {
  overflow: auto hidden;
  justify-content: safe center;
  overscroll-behavior-inline: contain;
}`;

const sections: readonly Section[] = [
  ['parts-without-a-container', 'Parts without a container'],
  ['rows-of-people-and-actions', 'Rows of people and actions'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/activity-view/architecture`: how it's built, and what flows into it. */
export const ActivityViewArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        An activity view has no root and no state: it’s a set of parts that go
        into the app’s own sheet or popover. For using it, see its{' '}
        <a href={publicUrl('activity-view/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="parts-without-a-container"
      level={2}
    >
      Parts without a container
    </Heading>
    <ul className="demo-tree">
      <li className="demo-tree-context">
        <PartLink
          component="sheet"
          part="Sheet.Popup"
        />{' '}
        <span>or</span>{' '}
        <PartLink
          component="popover"
          part="Popover.Popup"
        />
        <ul>
          <li>
            <PartLink
              component="sheet"
              part="Sheet.Header"
            />{' '}
            <span>(stays put)</span>
            <ul>
              <li>
                <PartLink part="ActivityView.Header" />
              </li>
            </ul>
          </li>
          <li>
            <span>its content (scrolls)</span>
            <ul>
              <li>
                <PartLink part="ActivityView.People" />,{' '}
                <PartLink part="ActivityView.Separator" />,{' '}
                <PartLink part="ActivityView.Actions" />
              </li>
              <li>
                <PartLink
                  component="list"
                  part="List.Root"
                />{' '}
                <span>(more actions)</span>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
    <ul>
      <li>
        Opening, closing, dragging and the choice of sheet or popover belong to
        those components. The activity view only draws what’s in them: its
        header stays in the container’s header, and the rest scrolls in its
        content, under the header’s edge effect.
      </li>
      <li>
        Every part is a plain element with a class and a part attribute: header,
        thumbnail, heading, title, subtitle and message. Layout is the
        stylesheet’s.
      </li>
      <li>
        Further actions are a regular{' '}
        <PartLink
          component="list"
          part="List.Root"
        />
        , and a group is an{' '}
        <PartLink
          component="avatar"
          part="Avatar.Group"
        />
        . The activity view doesn’t wrap them.
      </li>
    </ul>

    <Heading
      id="rows-of-people-and-actions"
      level={2}
    >
      Rows of people and actions
    </Heading>
    <ul>
      <li>
        <PartLink part="ActivityView.People" /> and{' '}
        <PartLink part="ActivityView.Actions" /> are lists (
        <code>role=&quot;list&quot;</code>) that scroll sideways. Each{' '}
        <PartLink part="ActivityView.Person" /> and{' '}
        <PartLink part="ActivityView.Action" /> renders a list item holding a
        button, so each is one press target and one list entry.
      </li>
      <li>
        A row that fits is centered, one that doesn’t starts at its leading
        edge: <code>justify-content: safe center</code> does both, with nothing
        measured. Its sideways overscroll is contained, so a fling doesn’t move
        the sheet.
      </li>
      <li>
        An action’s <PartLink part="ActivityView.ActionSymbol" /> is hidden from
        assistive technology; its label names the button.
      </li>
    </ul>
    <CodeView code={itemCode} />

    <Heading
      id="what-flows-in-and-out"
      level={2}
    >
      What flows in and out
    </Heading>
    <ul>
      <li>
        <strong>From its container:</strong> everything that moves: a{' '}
        <PartLink
          component="sheet"
          part="Sheet.Root"
        />{' '}
        when compact, a{' '}
        <PartLink
          component="popover"
          part="Popover.Root"
        />{' '}
        in a regular width, as the app decides. Its glass and color scheme too.
      </li>
      <li>
        <strong>From Avatar, Symbol and List:</strong> the people’s pictures,
        the actions’ symbols, and the further actions.
      </li>
      <li>
        <strong>Out:</strong> nothing.
      </li>
    </ul>
  </>
);
