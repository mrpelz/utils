import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/text-field/architecture`: how TextField is built, and what flows into
// it.

const clearCode = `// TextField.Clear, in short: empties its field's control as typing would,
// its focus as it was.
onPointerDown={(event) => {
  event.preventDefault();               // the control keeps focus
  wasFocused = document.activeElement === controlOf(event.currentTarget);
}}
onMouseDown={(event) => event.preventDefault()} // iOS's emulated one too
onClick={(event) => {
  const control = controlOf(event.currentTarget);
  // The element's own value setter, then an input event: React's (and Base
  // UI's) change handlers run as they would for typing.
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')
    .set.call(control, '');
  control.dispatchEvent(new Event('input', { bubbles: true }));
  if (wasFocused && document.activeElement !== control) {
    control.focus({ preventScroll: true });
  }
}}`;

const rowCode = `// As a list row: the app renders the field as one.
<TextField.Root render={<List.Item />} name="email">
  <TextField.Label>Email</TextField.Label>
  <TextField.Control type="email" />
  <TextField.Clear />
  <TextField.Error />
</TextField.Root>`;

const sections: readonly Section[] = [
  ['base-ui-s-field', 'Base UI’s field'],
  ['in-a-row-or-standalone', 'In a row, or standalone'],
  ['the-clear-button', 'The clear button'],
  ['the-frame', 'The frame'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/text-field/architecture`: how it's built, and what flows into it. */
export const TextFieldArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A text field is Base UI’s field, styled, with two parts of its own: a
        clear button and a frame for search-style fields. For using it, see its{' '}
        <a href={publicUrl('text-field/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="base-ui-s-field"
      level={2}
    >
      Base UI’s field
    </Heading>
    <ul>
      <li>
        <PartLink part="TextField.Root" />, <PartLink part="TextField.Label" />,{' '}
        <PartLink part="TextField.Control" />,{' '}
        <PartLink part="TextField.Description" /> and{' '}
        <PartLink part="TextField.Error" /> are Base UI’s, each with a class and
        a part attribute. Validation, labelling, the error’s timing and the
        form’s name are Base UI’s.
      </li>
      <li>
        The control has no box of its own: its row or frame draws one. A
        textarea is the control’s <code>render</code>.
      </li>
    </ul>

    <Heading
      id="in-a-row-or-standalone"
      level={2}
    >
      In a row, or standalone
    </Heading>
    <ul>
      <li>
        The root has no default <code>render</code>. Rendered as a{' '}
        <PartLink
          component="list"
          part="List.Item"
        />
        , it’s a list row: List’s stylesheet makes the label the row’s title,
        the control the rest of the row, and the description and error lines
        below it. Without that, its parts stack.
      </li>
    </ul>
    <CodeView code={rowCode} />

    <Heading
      id="the-clear-button"
      level={2}
    >
      The clear button
    </Heading>
    <ul>
      <li>
        <PartLink part="TextField.Clear" /> finds its field’s control by part
        attribute, empties it through the element’s own value setter and
        dispatches an input event, so the app’s change handlers and Base UI see
        what typing would produce.
      </li>
      <li>
        It keeps the field’s focus as it was. It prevents its pointer down, and
        its mouse down (iOS emulates one after a tap, and that moved focus). If
        the field had focus and lost it anyway, it gets it back without
        scrolling; if it hadn’t, no keyboard appears.
      </li>
      <li>
        It shows while the field is filled, and by its <code>mode</code> while
        focused, while not, or always. That’s the stylesheet’s, from the field’s
        state attributes. It isn’t in the tab order.
      </li>
    </ul>
    <CodeView code={clearCode} />

    <Heading
      id="the-frame"
      level={2}
    >
      The frame
    </Heading>
    <ul>
      <li>
        <PartLink part="TextField.Frame" /> is a <code>&lt;label&gt;</code>{' '}
        around a symbol, the control and its buttons, so a press anywhere on it
        focuses the field. Its <code>variant</code> sets its look: a fill, a
        list row, a tab bar’s, a toolbar’s.
      </li>
      <li>
        It always holds Glass’s background, shown only in the glass looks, so
        changing the variant transitions its box and fades its glass rather than
        mounting anything.
      </li>
      <li>
        A text field matches <code>:focus-visible</code> however it’s focused,
        so the frame decides itself whether focus came from the keyboard (
        <code>isKeyboardFocus</code>: a key pressed last), marking itself{' '}
        <code>data-keyboard-focus</code> for its ring.
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
        <strong>From Base UI:</strong> the field’s state, validation and
        labelling.
      </li>
      <li>
        <strong>From List:</strong> its look as a row.
      </li>
      <li>
        <strong>From Glass:</strong> the frame’s glass looks.
      </li>
      <li>
        <strong>From Viewport:</strong> keeping a field in view above the
        keyboard, by the scroller around it.
      </li>
      <li>
        <strong>Out:</strong> nothing renders the frame for you. Apps put it
        where a search field goes; Sidebar’s stylesheet sizes it for a sidebar
        (through the frame’s custom properties), and its <code>variant</code>{' '}
        matches a tab bar’s or a toolbar’s look.
      </li>
    </ul>
  </>
);
