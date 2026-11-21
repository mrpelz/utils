import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/action-sheet/architecture`: how ActionSheet is built, and what flows
// into it.

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const rootCode = `// ActionSheet.Root, in short: Base UI's popover, modal, remembering the
// trigger it opened from.
const [trigger, setTrigger] = useState(null);

<ActionSheetContext.Provider value={trigger}>
  <BasePopover.Root
    modal
    onOpenChange={(isOpen, { trigger }) => {
      if (isOpen) setTrigger(trigger ?? null);
    }}
    onOpenChangeComplete={(isOpen) => {
      if (!isOpen) setTrigger(null);
    }}
  />
</ActionSheetContext.Provider>`;

const positionCode = `// ActionSheet.Popup, in short: at its trigger, or its container's bottom.
const trigger = useContext(ActionSheetContext);
const bottom = useMemo(() => bottomAnchor(container), [container]);

<BasePopover.Positioner
  anchor={trigger ? undefined : bottom}   // a point above the bottom inset
  side={trigger ? 'bottom' : 'top'}
  collisionAvoidance={grow}               // grows rather than scrolls
  {...useCollision({})}                   // clear of the safe area, keyboard
/>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

const sections: readonly Section[] = [
  ['a-popover-that-looks-like-an-alert', 'A popover that looks like an alert'],
  ['where-it-appears', 'Where it appears'],
  ['the-parts', 'The parts'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/action-sheet/architecture`: how it's built, and what flows into it. */
export const ActionSheetArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        An action sheet is Base UI’s popover, made modal and drawn like an{' '}
        <a href={publicUrl('alert')}>Alert</a>’s panel. What the library adds is
        where it appears. It opens at the control that presented it, or at the
        bottom of its container when nothing did. To learn how to use it, see
        its <a href={publicUrl('action-sheet/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="a-popover-that-looks-like-an-alert"
      level={2}
    >
      A popover that looks like an alert
    </Heading>
    <ul>
      <li>
        It’s a popover rather than a dialog because it needs to be positioned.
        Base UI’s popover has a positioner that follows an anchor, flips and
        shifts. A dialog doesn’t have one.
      </li>
      <li>
        <PartLink part="ActionSheet.Root" /> makes the popover modal by default.
        The page behind it is dimmed and locked.
      </li>
      <li>
        Its parts carry an alert’s classes next to their own, such as{' '}
        <code>uikit-alert-panel</code>, <code>uikit-alert-header</code> and{' '}
        <code>uikit-alert-action</code>. It also imports the alert’s stylesheet.
        So the panel, title, description and actions look the same as an
        alert’s. Only the layout differs: the actions are always stacked.
      </li>
      <li>
        Like the alert’s popup, <PartLink part="ActionSheet.Popup" /> renders
        Base UI’s portal, backdrop, positioner and popup together. It uses the
        library’s portal container and the providers’ settings, and takes its
        color scheme from its glass.
      </li>
    </ul>

    <Heading
      id="where-it-appears"
      level={2}
    >
      Where it appears
    </Heading>
    <ul>
      <li>
        The root remembers which trigger opened the sheet, from Base UI’s open
        change details. It forgets the trigger once the sheet has closed. The
        popup reads it through a context.
      </li>
      <li>
        With a trigger, the popup sits below it, and flips above it when there’s
        no room.
      </li>
      <li>
        Without a trigger, for example when it’s opened by its <code>open</code>{' '}
        prop or a handle, the anchor is a virtual point at the bottom center of
        the container. That point sits just above the container’s bottom safe
        area inset, read from <code>--uikit-safe-area-inset-bottom</code>. The
        popup sits above it.
      </li>
      <li>
        When the sheet is taller than the room on its side, it grows over its
        anchor instead of scrolling (<code>useGrowAvoidance</code>). It stays
        inside its container, and clear of the safe area and the keyboard (
        <code>useCollision</code>).
      </li>
      <li>
        When it opens, focus goes to its first tabbable element without
        scrolling (<code>useInitialFocus</code>). When it’s opened by touch, the
        popup itself gets focus. Scrolling is avoided because Safari would
        scroll the content down before the popup is in place.
      </li>
    </ul>
    <CodeView code={rootCode} />
    <CodeView code={positionCode} />

    <Heading
      id="the-parts"
      level={2}
    >
      The parts
    </Heading>
    <ul>
      <li>
        <PartLink part="ActionSheet.Title" /> and{' '}
        <PartLink part="ActionSheet.Description" /> are Base UI’s, and they
        label the popup.
      </li>
      <li>
        <PartLink part="ActionSheet.Action" /> is Base UI’s close button, so
        every action closes the sheet.
      </li>
      <li>
        <PartLink part="ActionSheet.Header" /> and{' '}
        <PartLink part="ActionSheet.Actions" /> are plain elements.{' '}
        <PartLink part="ActionSheet.createHandle" /> wraps Base UI’s popover
        handle.
      </li>
    </ul>

    <Heading
      id="what-flows-in-and-out"
      level={2}
    >
      What flows in and out
    </Heading>
    <ul>
      <li>
        <strong>From Base UI:</strong> the popover itself, with opening,
        positioning, modality, focus, labels and the handle.
      </li>
      <li>
        <strong>From Alert:</strong> its look, through its classes and
        stylesheet.
      </li>
      <li>
        <strong>From Viewport:</strong> the portal container, the safe area
        insets and the keyboard’s height, which set its collision boundary.
      </li>
      <li>
        <strong>From Settings and Glass:</strong> the providers’ settings on the
        portal, and the panel’s color scheme.
      </li>
      <li>
        <strong>Out:</strong> nothing.
      </li>
    </ul>
  </>
);
