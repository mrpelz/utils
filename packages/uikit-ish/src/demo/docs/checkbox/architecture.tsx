import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/checkbox/architecture`: how Checkbox and Radio are built, and what
// flows into them.

const rootCode = `// Checkbox.Root, in short: Base UI's, its indicator by default.
<BaseCheckbox.Root
  {...props}
  data-checkbox-part="select-circle"
  className="uikit-checkbox-select-circle uikit-checkbox-edit-circle"
>
  {children ?? (
    <BaseCheckbox.Indicator>
      <Check />
      <Dash />
    </BaseCheckbox.Indicator>
  )}
</BaseCheckbox.Root>`;

const glyphCode = `/* Both glyphs are always there: the state shows one. */
.uikit-checkbox-select-circle {
  & [data-glyph='dash'],
  &[data-indeterminate] [data-glyph='check'] {
    display: none;
  }

  &[data-indeterminate] [data-glyph='dash'] {
    display: block;
  }
}`;

const sections: readonly Section[] = [
  ['base-ui-s-controls', 'Base UI’s controls'],
  ['one-circle-two-glyphs', 'One circle, two glyphs'],
  ['in-a-list', 'In a list'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/checkbox/architecture`: how it's built, and what flows into it. */
export const CheckboxArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Checkbox and Radio are Base UI’s controls. Each has a default indicator,
        and both share a stylesheet that draws a selection circle. To learn how
        to use them, see their <a href={publicUrl('checkbox/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="base-ui-s-controls"
      level={2}
    >
      Base UI’s controls
    </Heading>
    <ul>
      <li>
        <PartLink part="Checkbox.Root" /> and <PartLink part="Radio.Root" /> are
        Base UI’s. Each is a button with a hidden input for forms. Base UI
        handles the keyboard and sets the state as attributes (
        <code>data-checked</code>, <code>data-indeterminate</code>). Groups come
        from Base UI as they are.
      </li>
      <li>
        The library’s only code here is a default child. Without children, a
        root renders its indicator with the glyphs. Pass children to draw
        something else.
      </li>
    </ul>
    <CodeView code={rootCode} />

    <Heading
      id="one-circle-two-glyphs"
      level={2}
    >
      One circle, two glyphs
    </Heading>
    <ul>
      <li>
        Both roots carry the same classes and part attribute, so a radio and a
        checkbox look the same. Each is a circle with a border. When selected,
        it’s filled with the tint and shows a white checkmark.
      </li>
      <li>
        A checkbox’s indicator holds a checkmark and a dash, both drawn as SVG
        strokes in the current color. The stylesheet shows one of them by state:
        the dash while the checkbox is mixed, and the checkmark otherwise. A
        radio only has the checkmark.
      </li>
      <li>
        The circle is 22px. A pseudo-element gives it a 44px hit area around its
        center.
      </li>
    </ul>
    <CodeView code={glyphCode} />

    <Heading
      id="in-a-list"
      level={2}
    >
      In a list
    </Heading>
    <ul>
      <li>
        List’s own{' '}
        <PartLink
          component="list"
          part="List.Checkbox"
        />{' '}
        and{' '}
        <PartLink
          component="list"
          part="List.Radio"
        />{' '}
        render these roots. They add what rows need, such as sliding in while
        the list is editing.
      </li>
      <li>
        The roots carry two classes. <code>uikit-checkbox-edit-circle</code> is
        the bare circle: its size, its shape, and the size and weight of its
        glyph. A list’s edit buttons, which delete or insert a row, carry it
        too, so they’re the same circle.{' '}
        <code>uikit-checkbox-select-circle</code> adds the border, the selected
        fill and the hit area.
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
        <strong>From Base UI:</strong> the state, forms, the keyboard and
        groups.
      </li>
      <li>
        <strong>From the tokens:</strong> the tint, and the border’s gray.
      </li>
      <li>
        <strong>Out:</strong> the circle, to List’s edit buttons, and the
        checkmark glyph, to{' '}
        <PartLink
          component="list"
          part="List.Checkmark"
        />
        .
      </li>
    </ul>
  </>
);
