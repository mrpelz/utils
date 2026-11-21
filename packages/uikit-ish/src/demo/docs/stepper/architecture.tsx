import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/stepper/architecture`: how Stepper is built, and what flows into it.

const treeCode = `<Stepper.Root>                 <!-- Base UI's number field: the value -->
  <Stepper.Group>              <!-- the capsule -->
    <Stepper.Decrement />      <!-- the leading half, "−" -->
    <Stepper.Input />          <!-- hidden: focus, keys, a spin button -->
    <Stepper.Increment />      <!-- the trailing half, "+" -->
  </Stepper.Group>
</Stepper.Root>`;

const focusCode = `// Stepper.Group, in short: pressed, no focus ring until a key.
onPointerDown={(event) => {
  event.currentTarget.dataset.pointerFocus = '';
}}
onKeyDown={(event) => {
  delete event.currentTarget.dataset.pointerFocus;
}}
onBlur={(event) => {
  // Focus leaving the group, not moving within it: forgotten.
  if (!event.currentTarget.contains(event.relatedTarget)) {
    delete event.currentTarget.dataset.pointerFocus;
  }
}}`;

const sections: readonly Section[] = [
  ['a-number-field-without-a-number', 'A number field without a number'],
  ['the-halves', 'The halves'],
  ['its-focus-ring', 'Its focus ring'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/stepper/architecture`: how it's built, and what flows into it. */
export const StepperArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A stepper is Base UI’s number field with its value hidden: two halves
        that step it, and an input nobody sees but keyboards and screen readers
        use. For using it, see its{' '}
        <a href={publicUrl('stepper/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="a-number-field-without-a-number"
      level={2}
    >
      A number field without a number
    </Heading>
    <ul>
      <li>
        <PartLink part="Stepper.Root" /> is Base UI’s number field root: the
        value, its limits and step, controlled or not. All other number field
        parts are Base UI’s as well; the library styles four of them.
      </li>
      <li>
        <PartLink part="Stepper.Input" /> is the field’s input, visually hidden
        inside the capsule. It takes focus, steps with the arrow keys, and is
        read as a spin button, so the value is there for assistive technology
        without being shown. Name it with an <code>aria-label</code>.
      </li>
      <li>
        A stepper shows no number by design. When an app shows the value, it
        does so itself, for example in a list row’s detail.
      </li>
    </ul>
    <CodeView code={treeCode} />

    <Heading
      id="the-halves"
      level={2}
    >
      The halves
    </Heading>
    <ul>
      <li>
        <PartLink part="Stepper.Decrement" /> and{' '}
        <PartLink part="Stepper.Increment" /> are Base UI’s buttons, which
        repeat while held and disable themselves at the limits. Without
        children, each draws its sign as SVG strokes.
      </li>
      <li>
        <PartLink part="Stepper.Group" /> is the capsule: two halves with a
        separator between them. Their size is a minimum, so larger text or your
        own content can widen them.
      </li>
    </ul>

    <Heading
      id="its-focus-ring"
      level={2}
    >
      Its focus ring
    </Heading>
    <ul>
      <li>
        A press on a half moves focus into the field. That shouldn’t show a
        keyboard focus ring, so the group marks itself{' '}
        <code>data-pointer-focus</code> on a pointer press and drops the mark on
        a key press or when focus leaves the group. Its ring, in the tint around
        the whole capsule, shows only without the mark.
      </li>
    </ul>
    <CodeView code={focusCode} />

    <Heading
      id="what-flows-in-and-out"
      level={2}
    >
      What flows in and out
    </Heading>
    <ul>
      <li>
        <strong>From Base UI:</strong> the value, stepping, holding to repeat,
        limits, the input and its form name.
      </li>
      <li>
        <strong>From the tokens:</strong> the fills, the separator and the
        signs’ colors, in both schemes.
      </li>
      <li>
        <strong>Out:</strong> nothing. In a form, a{' '}
        <PartLink
          component="form"
          part="Field"
        />{' '}
        around it gives it a name and a label.
      </li>
    </ul>
  </>
);
