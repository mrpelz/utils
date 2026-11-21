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
        A page control is the library’s own, not Base UI’s. It’s one element
        with the slider role, whose value is the current page, drawn as dots.
        Its state, its window of dots, and its handling of presses, scrubbing
        and keys all live in that one component. To learn how to use it, see its{' '}
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
        <PartLink part="PageControl" /> renders a focusable <code>div</code>{' '}
        with <code>role=&quot;slider&quot;</code>. Its value runs from 1 to the
        page count. Its value text comes from <code>format</code>, such as “3 of
        8”. Assistive technology treats it as an adjustable control.
      </li>
      <li>
        You can control it with <code>value</code>, or let it keep its own state
        from <code>defaultValue</code>.
      </li>
      <li>
        Every change goes through one function. That function clamps the page,
        and does nothing when the control is disabled or the page is unchanged.
        It reports the change to <code>onValueChange</code>, along with what
        caused it: a press, a drag or a key.
      </li>
      <li>
        The dots are spans, hidden from assistive technology. Each sits in a
        slot with its size as an attribute. The current dot is marked{' '}
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
        With up to seven pages, every page gets a dot. With more, eight dots
        show at a time. At an end with more pages beyond it, the outermost two
        dots shrink to hint at them.
      </li>
      <li>
        The window’s start is kept between renders. It only moves when the
        current page would land on a shrunken dot.
      </li>
      <li>
        The window is worked out during render, so it never lags a frame behind
        the value. The dots change size by a transition.
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
        order, goes to the previous or the next page. Where you press is
        compared to the current dot’s center, taking the layout’s direction into
        account.
      </li>
      <li>
        <strong>A drag</strong> captures the pointer once it has moved 4px.
        After that, it moves one page for every 16px, which is a dot and its
        gap. The click at the end of a drag doesn’t change the page.
      </li>
      <li>
        <strong>Keys:</strong> the arrow keys step through the pages, with left
        and right following the layout’s direction. Home and End go to the first
        and the last page.
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
        its content. Its context is the one you give. Otherwise, it inherits the
        context of the glass it sits on, such as a toolbar’s, or it’s automatic.
      </li>
      <li>
        With <code>momentaryTooltip</code>, a span above the control shows the
        value text while you hover it, press it, or focus it with the keyboard.
      </li>
      <li>
        That span isn’t a <a href={publicUrl('tooltip')}>Tooltip</a>. It reuses
        the tooltip’s surface class, and the stylesheet shows it. So it needs no
        portal and no positioning.
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
        <strong>From the app:</strong> the page count and, when controlled, the
        current page. That might come from a scroller that pages, for example.
      </li>
      <li>
        <strong>Out:</strong> only its value changes. It doesn’t scroll anything
        itself.
      </li>
    </ul>
  </>
);
