import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/page-control/architecture`: how PageControl is built, and what flows
// into it.

const windowCode = `// The window of 8 dots (of more than 7 pages): moved from where it was
// only as far as needed to show the current page as a full dot.
const windowStart = (start, page, count) => {
  if (count <= 7) return 0;
  const last = count - 8;
  const clamped = clamp(start, 0, last);
  // Its first and last full dots: past its shrunken ends.
  const first = clamped > 0 ? clamped + 2 : 0;
  const end = clamped < last ? clamped + 8 - 3 : clamped + 8 - 1;
  if (page < first) return Math.max(page - 2, 0);
  if (page > end) return Math.min(page - 8 + 3, last);
  return clamped;
};

// A dot's size: 4 and 6 at a window end with more pages beyond it, else 8.`;

const sections: readonly Section[] = [
  ['a-slider-of-dots', 'A slider of dots'],
  ['the-window-of-dots', 'The window of dots'],
  ['pressing-scrubbing-and-keys', 'Pressing, scrubbing and keys'],
  ['its-glass-and-tooltip', 'Its glass and tooltip'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/page-control/architecture`: how it's built, and what flows into it. */
export const PageControlArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A page control is the library’s own, not Base UI’s: one element with the
        slider role, its value the current page, drawn as dots. Its state, its
        window of dots, its pressing, scrubbing and keys are all in one
        component. For using it, see its{' '}
        <a href={publicUrl('page-control/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="a-slider-of-dots"
      level={2}
    >
      A slider of dots
    </Heading>
    <ul>
      <li>
        <PartLink part="PageControl" /> renders a <code>div</code> with{' '}
        <code>role=&quot;slider&quot;</code>, focusable, its value from 1 to the
        page count and its value text from <code>format</code> (“3 of 8”).
        Assistive technology treats it as an adjustable control.
      </li>
      <li>
        It’s controlled by <code>value</code> or keeps its own state from{' '}
        <code>defaultValue</code>. Every change goes through one function that
        clamps the page, does nothing when disabled or unchanged, and reports
        the change to <code>onValueChange</code> with what caused it: a press, a
        drag or a key.
      </li>
      <li>
        The dots are spans, hidden from assistive technology, each in a slot
        with its size as an attribute; the current one is marked{' '}
        <code>data-current</code>.
      </li>
    </ul>

    <Heading
      id="the-window-of-dots"
      level={2}
    >
      The window of dots
    </Heading>
    <ul>
      <li>
        Up to seven pages, every page is a dot. With more, eight dots show at a
        time, and the outermost two at an end with more pages beyond it shrink,
        hinting at them.
      </li>
      <li>
        The window’s start is kept between renders and moves only when the
        current page would land on a shrunken dot. It’s derived during render,
        so it never lags a frame behind the value. The dots resize by their
        transition.
      </li>
    </ul>
    <CodeView code={windowCode} />

    <Heading
      id="pressing-scrubbing-and-keys"
      level={2}
    >
      Pressing, scrubbing and keys
    </Heading>
    <ul>
      <li>
        <strong>A press</strong> before or after the current dot, in reading
        order, goes to the previous or next page. It’s decided by the press’s
        position against the current dot’s center, and the layout’s direction.
      </li>
      <li>
        <strong>A drag</strong> captures the pointer and moves a page for every
        16px passed (a dot and its gap), once it has moved 4px. A drag’s click
        afterwards doesn’t page.
      </li>
      <li>
        <strong>Keys:</strong> the arrows step (left and right by direction),
        Home and End go to the ends.
      </li>
    </ul>

    <Heading
      id="its-glass-and-tooltip"
      level={2}
    >
      Its glass and tooltip
    </Heading>
    <ul>
      <li>
        The glass variant renders Glass’s background behind the dots, which are
        its content. Its context is the given one, or inherited from the glass
        it sits on (a toolbar’s), or automatic.
      </li>
      <li>
        With <code>momentaryTooltip</code>, a span above it shows the value text
        while it’s hovered, pressed or focused by keyboard. It isn’t a{' '}
        <a href={publicUrl('tooltip')}>Tooltip</a>: it reuses the tooltip’s
        surface class and is shown by the stylesheet, so it needs no portal or
        positioning.
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
        <strong>From Glass:</strong> the material, and the context inherited
        from the glass around it.
      </li>
      <li>
        <strong>From Tooltip:</strong> the surface style of its value text.
      </li>
      <li>
        <strong>From the app:</strong> the page count and, controlled, the
        current page, for example from a paging scroller.
      </li>
      <li>
        <strong>Out:</strong> only its value changes. It doesn’t scroll anything
        itself.
      </li>
    </ul>
  </>
);
