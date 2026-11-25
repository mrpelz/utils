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
        A slider is Base UI’s slider, drawn as a track, a fill and a glass knob.
        It adds a few parts of its own: ticks, symbols at its ends, and a value
        that never changes width. It knows nothing about the cards or lists that
        hold it. To learn how to use it, see its{' '}
        <a href={publicUrl('slider/parts')}>parts</a>.
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
        The value, the range, the keyboard, dragging and the hidden range inputs
        are all Base UI’s.
      </li>
      <li>
        <PartLink part="Slider.Root" /> adds a <code>tint</code> (
        <code>--uikit-slider-tint</code>). It also adds a context with its range
        and format. Base UI keeps those private, but the value part needs them.
      </li>
      <li>
        When you hold the slider on touch, the touch doesn’t scroll the page (
        <code>useTouchHold</code>, along the slider’s axis). The root carries{' '}
        <code>data-base-ui-swipe-ignore</code>, so dragging the slider doesn’t
        swipe a sheet or a drawer away.
      </li>
      <li>
        The control grows to fill the root, and is at least 120px wide. That
        way, it fits a list row between two symbols on a phone.
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
        Base UI ties the fill to the thumb’s center. When the thumb stays inside
        the track, its center never reaches the track’s ends.
      </li>
      <li>
        So <PartLink part="Slider.Indicator" /> computes its geometry from the
        value instead, through Base UI’s style function. That way, the fill
        spans the whole track at the maximum.
      </li>
      <li>
        <PartLink part="Slider.Thumb" /> is Base UI’s thumb. The knob is drawn
        by its <code>::after</code>. Only that pseudo-element scales into a
        glass lens while you drag (Base UI’s <code>data-dragging</code>). Base
        UI measures the thumb’s box to position it, so the box itself keeps its
        resting size.
      </li>
      <li>
        The thumb has a hidden input that takes focus and keys. Base UI places
        it <code>fixed</code>. The library places it <code>absolute</code> over
        the thumb instead. In a transformed ancestor, the fixed input took that
        ancestor’s size, and Safari on iOS painted an open card black (see{' '}
        <a href={publicUrl('ios-quirks#dishonorable-mentions')}>iOS Quirks</a>).
      </li>
      <li>The track doesn’t clip, because the thumb is inside it.</li>
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
        options.
      </li>
      <li>
        The value reserves the width of its widest possible value, so the slider
        never shifts as the value changes. The widest values are found from the
        extremes and one step off them. With tabular numerals, the width only
        depends on the sign and the digits.
      </li>
      <li>
        Those widest values are rendered as hidden copies in the same grid cell
        as the current value (<code>Reserve</code>). Layout finds the width in
        the actual font, and nothing is measured.
      </li>
      <li>
        Its <code>placement</code> puts the value before, after, above or below
        the other parts, or in a tooltip above each thumb.
      </li>
      <li>
        As a tooltip, the value tells the root through the context. Each thumb
        then draws its own value in a capsule with the tooltip’s surface style.
        That capsule shows always, or only while you hover or drag.
      </li>
      <li>
        <PartLink part="Slider.Label" /> is Base UI’s, and it’s placed the same
        way.
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
        <PartLink part="Slider.Symbol" /> marks an end. When you press it, it
        moves the thumb to that end.
      </li>
      <li>
        Base UI has no way to set an uncontrolled value from outside. So the
        symbol dispatches Home or End to the thumb’s input, and Base UI handles
        it as a key press. Afterwards, the input loses focus again, unless it
        already had it.
      </li>
      <li>
        <PartLink part="Slider.Ticks" /> draws a mark at every step between the
        ends. Each mark is placed by a custom property and hidden from assistive
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
        <strong>From Base UI:</strong> the value, and everything that changes
        it.
      </li>
      <li>
        <strong>From the library’s utilities:</strong> the touch hold, and the
        width reserve.
      </li>
      <li>
        <strong>From Glass and Tooltip:</strong> the knob’s lens, and the
        surface of the value’s capsule.
      </li>
      <li>
        <strong>Out:</strong> a{' '}
        <PartLink
          component="card"
          part="Card.Root"
        />{' '}
        styles a slider placed directly in it.{' '}
        <PartLink
          component="card"
          part="Card.Slider"
        />{' '}
        builds a slider that fills a card from these parts. Neither changes the
        slider’s code.
      </li>
    </ul>
  </>
);
