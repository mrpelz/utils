import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/slider/architecture`: how Slider is built, and what flows into it.

const indicatorCode = `// Slider.Indicator, in short: its geometry from the value, not the thumb.
<BaseSlider.Indicator
  style={({ min, max, orientation, values }) => {
    const start = values.length > 1 ? toPercent(values[0], min, max) : 0;
    const end = toPercent(values.at(-1), min, max);
    return orientation === 'vertical'
      ? { bottom: \`\${start}%\`, height: \`\${end - start}%\` }
      : { insetInlineStart: \`\${start}%\`, width: \`\${end - start}%\` };
  }}
/>`;

const symbolCode = `// Slider.Symbol, in short: pressed, the thumb goes to its end, by
// dispatching Home or End to the thumb's input (Base UI's own handling:
// limits, change and commit callbacks).
const input = edge === 'min' ? inputs[0] : inputs.at(-1);
const isFocused = document.activeElement === input;
input.dispatchEvent(
  new KeyboardEvent('keydown', { bubbles: true, key: edge === 'min' ? 'Home' : 'End' }),
);
if (!isFocused) input.blur(); // Base UI focuses it, as for a key`;

const sections: readonly Section[] = [
  ['base-ui-s-slider', 'Base UI’s slider'],
  ['the-fill-and-the-knob', 'The fill and the knob'],
  ['the-value', 'The value'],
  ['symbols-and-ticks', 'Symbols and ticks'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/slider/architecture`: how it's built, and what flows into it. */
export const SliderArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A slider is Base UI’s, drawn as a track, a fill and a glass knob, with a
        few parts of its own: ticks, symbols at its ends, and a value that never
        changes width. It knows nothing about cards or lists that hold it. For
        using it, see its <a href={publicUrl('slider/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="base-ui-s-slider"
      level={2}
    >
      Base UI’s slider
    </Heading>
    <ul>
      <li>
        Its value, its range, keyboard handling, dragging and its hidden range
        inputs are Base UI’s. <PartLink part="Slider.Root" /> adds a{' '}
        <code>tint</code> (<code>--uikit-slider-tint</code>) and a context with
        its range and format, which Base UI keeps private but the value part
        needs.
      </li>
      <li>
        Held on touch, its touch doesn’t scroll the page (
        <code>useTouchHold</code>, along its orientation’s axis). The root
        carries <code>data-base-ui-swipe-ignore</code>, so dragging it doesn’t
        swipe a sheet or drawer away.
      </li>
      <li>
        The control grows to fill the root, at least 120px, so it fits a list
        row between symbols on a phone.
      </li>
    </ul>

    <Heading
      id="the-fill-and-the-knob"
      level={2}
    >
      The fill and the knob
    </Heading>
    <ul>
      <li>
        Base UI ties the fill to the thumb’s center, which never reaches the
        track’s ends when the thumb stays inside them.{' '}
        <PartLink part="Slider.Indicator" /> computes its geometry from the
        value instead, through Base UI’s style function, so the fill spans the
        whole track at the maximum.
      </li>
      <li>
        <PartLink part="Slider.Thumb" /> is Base UI’s thumb. The knob is drawn
        by its <code>::after</code>, which alone scales into a glass lens while
        dragging (Base UI’s <code>data-dragging</code>): Base UI measures the
        thumb’s box to position it, so that box keeps its resting size.
      </li>
      <li>
        The thumb’s hidden input, which takes focus and keys, is placed{' '}
        <code>absolute</code> over the thumb rather than Base UI’s{' '}
        <code>fixed</code>, which in a transformed ancestor took that ancestor’s
        size and made Safari on iOS paint an open card black (see{' '}
        <a href={publicUrl('ios-quirks#dishonorable-mentions')}>iOS Quirks</a>
        ). The track doesn’t clip, since the thumb is inside it.
      </li>
    </ul>
    <CodeView code={indicatorCode} />

    <Heading
      id="the-value"
      level={2}
    >
      The value
    </Heading>
    <ul>
      <li>
        <PartLink part="Slider.Value" /> is Base UI’s, formatted by the root’s
        options. It reserves the width of its widest value, found from the
        extremes and a step off them (tabular numerals make width depend only on
        the sign and digits), so the slider never shifts as it changes. The
        widest values are rendered as hidden copies in the same grid cell as the
        current one (<code>Reserve</code>), so layout finds the width in the
        actual font, with nothing measured.
      </li>
      <li>
        Its <code>placement</code> puts it before, after, above or below the
        other parts, or in a tooltip above each thumb. As a tooltip, it tells
        the root through the context, and each thumb draws its own value in a
        capsule with the tooltip’s surface style: always, or momentarily while
        it’s hovered or dragged.
      </li>
      <li>
        <PartLink part="Slider.Label" /> is Base UI’s, placed the same way.
      </li>
    </ul>

    <Heading
      id="symbols-and-ticks"
      level={2}
    >
      Symbols and ticks
    </Heading>
    <ul>
      <li>
        <PartLink part="Slider.Symbol" /> marks an end. Pressed, it moves the
        thumb there. Base UI has no way to set an uncontrolled value from
        outside, so it dispatches Home or End to the thumb’s input, and Base UI
        handles it as a key press. The input is blurred again unless it had
        focus already.
      </li>
      <li>
        <PartLink part="Slider.Ticks" /> draws a mark at every step between the
        ends, each placed by a custom property, hidden from assistive
        technology.
      </li>
    </ul>
    <CodeView code={symbolCode} />

    <Heading
      id="what-flows-in-and-out"
      level={2}
    >
      What flows in and out
    </Heading>
    <ul>
      <li>
        <strong>From Base UI:</strong> the value and everything that changes it.
      </li>
      <li>
        <strong>From the library’s utilities:</strong> the touch hold, the width
        reserve.
      </li>
      <li>
        <strong>From Glass and Tooltip:</strong> the knob’s lens, and the value
        capsule’s surface.
      </li>
      <li>
        <strong>Out:</strong> a{' '}
        <PartLink
          component="card"
          part="Card.Root"
        />{' '}
        styles a slider placed directly in it, and{' '}
        <PartLink
          component="control-cards"
          part="ControlCards.SliderFill"
        />{' '}
        builds a card-filling slider from these parts. Neither changes the
        slider’s code.
      </li>
    </ul>
  </>
);
