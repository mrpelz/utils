import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/date-picker/architecture` and its sub-pages: how DatePicker is built,
// and what flows into it.

const treeCode = `<div class="uikit-date-picker-collapsed">          <!-- compact -->
  <button class="uikit-date-picker-collapsed-button">Nov 21, 2026</button>
  <button class="uikit-date-picker-collapsed-button">9:41 PM</button>
</div>
<input type="hidden" name="when" value="2026-11-21T21:41" /> <!-- Base UI's field control -->

<!-- in the popover (or inline, in place): -->
<div class="uikit-date-picker-panel">
  <div class="uikit-date-picker-header">                  <!-- title, arrows -->
  <div class="uikit-date-picker-body">
    <div class="uikit-date-picker-weekdays" aria-hidden="true">…</div>
    <div class="uikit-date-picker-pages">                  <!-- the months' strip -->
      <div class="uikit-date-picker-weeks" inert>…</div>   <!-- a neighbour -->
      <div class="uikit-date-picker-weeks" role="group">   <!-- the month -->
        <button class="uikit-date-picker-day" data-date="…" tabindex="0">21</button>
        …
      </div>
      …
    </div>
    <!-- a roll in their place, when shown -->
  </div>
  <div class="uikit-date-picker-separator" />
  <div class="uikit-date-picker-time-row">…</div>          <!-- the footer -->
</div>`;

const selectCode = `// select, in short: a day picked. A range: a new one, or its end (in
// either order; out of the start's reach, a new range). A date: the time
// of an earlier value kept.
if (props.range) {
  commitRange(
    !range || range.end || !reachable(date)
      ? { end: null, start: date }
      : between(range.start, date),
    details,
  );
  return;
}
const next = new Date(date);
if (single && !hasTime) next.setHours(single.getHours(), single.getMinutes(), 0, 0);`;

const sections: readonly Section[] = [
  ['styles-and-modes', 'Styles and modes'],
  ['the-calendar', 'The calendar'],
  ['picking-days-and-ranges', 'Picking days and ranges'],
  ['popovers', 'Popovers'],
  ['in-list-rows', 'In list rows'],
  ['forms', 'Forms'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/date-picker/architecture`: how it's built, and what flows into it. */
export const DatePickerArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A date picker picks a date, a time, both, or a range of dates. It shows
        collapsed buttons that open popovers, or the calendar in place. Its
        names, numerals, hour cycle and first weekday come from{' '}
        <code>Intl</code>. Two sub-systems have pages of their own. The{' '}
        <a href={publicUrl('date-picker/architecture/calendar-pager')}>
          Calendar pager
        </a>{' '}
        covers the strip of months. The{' '}
        <a href={publicUrl('date-picker/architecture/wheels')}>Wheels</a> page
        covers the month, year and time rolls. To learn how to use it, see its{' '}
        <a href={publicUrl('date-picker/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="styles-and-modes"
      level={2}
    >
      Styles and modes
    </Heading>
    <ul>
      <li>
        <PartLink part="DatePicker.Root" />
        ’s <code>mode</code> is a date, a time, or both. <code>range</code>{' '}
        picks two days instead.
      </li>
      <li>
        <code>pickerStyle</code> is <code>compact</code>, which shows collapsed
        buttons, or <code>inline</code>, which shows the calendar in place.
      </li>
      <li>
        The value is controlled or uncontrolled, as in Base UI. So is which
        picker is open, in the compact style. Dates are in local time.
      </li>
      <li>
        The collapsed buttons are{' '}
        <PartLink
          component="button"
          part="Button.Root"
        />
        s, capsules by default. They’re labelled with the date or the range (
        <code>formatRange</code>), and the time, in the locale’s medium and
        short styles.
      </li>
      <li>
        <PartLink part="DatePicker.Calendar" /> is the calendar alone, without
        the time, for apps that compose their own.
      </li>
    </ul>
    <CodeView code={treeCode} />

    <Heading
      id="the-calendar"
      level={2}
    >
      The calendar
    </Heading>
    <ul>
      <li>
        The days are a group of buttons with one tab stop, the focused day.
      </li>
      <li>
        The arrow keys move by a day or a week, mirrored in right-to-left
        layouts. Page Up and Page Down move by a month. Home and End go to the
        ends of the week. Disabled days are skipped. Focus follows once the day
        has rendered.
      </li>
      <li>
        Each week is filled with the neighboring months’ days, shown blank or
        grayed out (<code>showAdjacentMonths</code>). A press on one of those
        days shows its month. Today is marked as the current date.
      </li>
      <li>
        Your app can highlight a day with dots, a tinted date, or a tinted
        circle, each with its own tint. It can highlight weekdays too.
      </li>
      <li>
        The title shows the month that’s mostly in view as you scroll, and opens
        the month and year roll. The arrows are disabled at the limits.
      </li>
      <li>
        A footer is your app’s. It’s given the calendar’s state and actions.
      </li>
      <li>
        With a time, the default footer is a time row. Its button shows the time
        roll in place of the days.
      </li>
      <li>
        <PartLink part="DatePicker.CalendarRow" />,{' '}
        <PartLink part="DatePicker.CalendarButton" />,{' '}
        <PartLink part="DatePicker.CalendarTimeRow" /> and{' '}
        <PartLink part="DatePicker.CalendarMessage" /> are parts for the footer.
        A message is announced, as an alert when it’s an error.
      </li>
    </ul>

    <Heading
      id="picking-days-and-ranges"
      level={2}
    >
      Picking days and ranges
    </Heading>
    <ul>
      <li>Picking a day keeps the time of an earlier value.</li>
      <li>
        A range takes two presses, for its start and its end, in either order.
      </li>
      <li>
        While you pick a range’s end, only the days it can reach are enabled. A
        range can’t cross a disabled day, and those are found by walking up to
        ten years each way. It also can’t be a range that{' '}
        <code>isRangeDisabled</code> refuses. A day out of reach starts a new
        range.
      </li>
      <li>
        You can also drag a range, from the day you pressed to the day under the
        pointer. It shows as you drag, and is picked when you let go. The click
        that ends the drag is swallowed.
      </li>
      <li>
        When you hold the drag beyond the month’s days, it turns the month, and
        the range extends to the new month’s first or last day (see the{' '}
        <a href={publicUrl('date-picker/architecture/calendar-pager')}>
          Calendar pager
        </a>
        ).
      </li>
      <li>
        In a range, the ends are drawn on the tint, and the days between on the
        tint at 12%.
      </li>
    </ul>
    <CodeView code={selectCode} />

    <Heading
      id="popovers"
      level={2}
    >
      Popovers
    </Heading>
    <ul>
      <li>
        In the compact style, the buttons open a{' '}
        <a href={publicUrl('popover')}>Popover</a>.
      </li>
      <li>
        With a date, there’s one popover for both buttons. It’s anchored to the
        two buttons together, and opened by whichever you pressed. The time
        button opens the calendar with the time roll already in place of the
        days.
      </li>
      <li>
        A picker with only a time opens a popover with just the time roll. It
        focuses the popup, not the first column, because Chrome would scroll the
        column away from its selection.
      </li>
      <li>
        The popup clips its content to its corners by itself, not with{' '}
        <code>overflow</code>. Overflow would make the popup a scroll container,
        and clip its glow.
      </li>
      <li>
        Without <code>popover</code>, the buttons just toggle which picker is
        open, for your app to show it.
      </li>
    </ul>

    <Heading
      id="in-list-rows"
      level={2}
    >
      In list rows
    </Heading>
    <ul>
      <li>
        With a handle (<PartLink part="DatePicker.createHandle" />
        ), the picker publishes its calendar and time roll on the handle.
      </li>
      <li>
        <PartLink part="DatePicker.Expandable" /> then renders them in
        collapsible list rows after the picker’s row. Each row is open while
        it’s the open picker.
      </li>
      <li>
        In collapsible rows, a picker closes when the rows close. With a handle
        in an accordion item, the picker opens the item as it opens, and closes
        when another item opens.
      </li>
    </ul>

    <Heading
      id="forms"
      level={2}
    >
      Forms
    </Heading>
    <ul>
      <li>
        The picker’s value is a hidden Base UI field control. So it’s submitted
        by its <code>name</code>, or as a Base UI field’s value.
      </li>
      <li>
        A date is submitted as <code>YYYY-MM-DD</code>, and a time as{' '}
        <code>HH:MM</code>. Both together are joined by <code>T</code>. A range
        is submitted as an interval, but only once its end is picked.
      </li>
      <li>
        Without popovers, a disabled picker, or one in a disabled fieldset,
        closes its open picker.
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
        <strong>From the library:</strong> Popover, Roll, Button, and List’s
        collapsible rows.
      </li>
      <li>
        <strong>From Base UI:</strong> the field control.
      </li>
      <li>
        <strong>From the browser:</strong> <code>Intl</code>’s names, numerals,
        hour cycle and week info.
      </li>
      <li>
        <strong>Out:</strong> its value, to forms.
      </li>
    </ul>
  </>
);

const pagerCode = `// useMonthPager, in short: the strip only changes at rest. Settled on
// another month's page, it turns to it; the window of pages is re-centred
// only near its ends, so nothing moves under a scroll.
const settle = () => {
  if (strip.isHeld) return;                      // a finger, the mouse
  const at = Math.round(Math.abs(pages.scrollLeft) / widthOf(pages));
  if (!onPage(at)) return;
  const to = months[at];
  if (at === pageIn(months, month)) return;
  if (at < 4 || at > months.length - 1 - 4) setAnchor(to);
  onTurn(to, !isGoneTo(to));
};`;

const pagerSections: readonly Section[] = [
  ['a-strip-of-months', 'A strip of months'],
  ['changed-only-at-rest', 'Changed only at rest'],
  ['going-to-a-month', 'Going to a month'],
  ['the-mouse', 'The mouse'],
  ['heights-and-ranges', 'Heights and ranges'],
];

/** `/date-picker/architecture/calendar-pager`: the months' strip. */
export const DatePickerPagerArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={pagerSections} />
    <ul className="demo-lead">
      <li>
        The calendar’s months sit side by side in a strip that scrolls sideways.
        It snaps natively, one month per flick (<code>useMonthPager</code>, in{' '}
        <code>pager.ts</code>). For the rest of the picker, see its{' '}
        <a href={publicUrl('date-picker/architecture')}>main page</a>.
      </li>
    </ul>

    <Heading
      id="a-strip-of-months"
      level={2}
    >
      A strip of months
    </Heading>
    <ul>
      <li>
        The strip renders the shown month, with up to a year of months on either
        side, within the limits. Only the shown month is interactive. The others
        are inert, and hidden from assistive technology.
      </li>
      <li>
        The browser snaps the strip one page at a time, for a finger or a
        trackpad’s momentum.
      </li>
      <li>
        By default, swiping the days turns the month. In a range picker, it
        drags a range instead (<code>swipe</code>).
      </li>
      <li>
        A page’s width is read from its computed style, as a fractional,
        untransformed value. <code>clientWidth</code> rounds, and the error
        grows with each page. A bounding box is scaled while a popover scales
        in.
      </li>
    </ul>

    <Heading
      id="changed-only-at-rest"
      level={2}
    >
      Changed only at rest
    </Heading>
    <ul>
      <li>
        Nothing changes the strip while it scrolls, or while you hold it.
        Meanwhile, an intersection observer reports the month that’s mostly in
        view, for the title.
      </li>
      <li>
        The strip comes to rest on <code>scrollend</code>, or after 120ms
        without a scroll. If it’s settled on another month’s page, it turns to
        that month, and that month’s first selectable day becomes the focused
        one.
      </li>
      <li>
        The window of months is only centered again when the shown month is
        within four pages of its ends. So turning a month usually changes
        nothing except which page is live.
      </li>
      <li>
        When its width changes, for example when it’s laid out as a popover
        shows, the strip is put back on the shown month’s page.
      </li>
    </ul>
    <CodeView code={pagerCode} />

    <Heading
      id="going-to-a-month"
      level={2}
    >
      Going to a month
    </Heading>
    <ul>
      <li>
        You can go to a month by the arrows, the keyboard or the roll. If that
        month is outside the window, it stands in for the neighbor on its side,
        and is scrolled to smoothly. The title shows it at once.
      </li>
      <li>
        If the strip can’t scroll, for example because it’s hidden and has no
        width, the month turns anyway after 600ms. While a roll is shown, the
        month turns at once.
      </li>
    </ul>

    <Heading
      id="the-mouse"
      level={2}
    >
      The mouse
    </Heading>
    <ul>
      <li>
        A mouse drags the strip as a finger would, once it moves 8px sideways,
        with snapping turned off. A vertical move isn’t a drag.
      </li>
      <li>
        When you let go, the strip scrolls to the nearer page. With a flick
        faster than 0.4px per millisecond, it goes on to the next page. The
        click you let go with is swallowed.
      </li>
    </ul>

    <Heading
      id="heights-and-ranges"
      level={2}
    >
      Heights and ranges
    </Heading>
    <ul>
      <li>
        A month has four to six weeks. The strip takes the shown month’s height
        at once, and clips its neighbors.
      </li>
      <li>
        The body around it animates to its new height 200ms after the month
        settles. Resizing while a swipe was settling made it stutter.
      </li>
      <li>
        Under a roll, the strip keeps its height, and changes once the roll
        closes.
      </li>
      <li>
        You drag a range on the strip, not on the month, so a drag that turns
        the month carries on.
      </li>
      <li>
        When you hold the drag below or beyond the days, or on another month’s
        day, the month turns after 500ms, and then every 700ms. The range
        extends to the new month’s first or last day, within the limits and the
        start’s reach.
      </li>
    </ul>
  </>
);

const rollCode = `// TimeRoll, in short: by the locale's hour cycle, 24 hours or 12 with a
// day period, placed before or after them as the locale writes it. A time
// beyond the limits is moved to the nearest within them.
const { hourCycle, periodFirst, periods, twelve } = timeFormat(locale, cycle);
const set = (hour, minute, { event }) => {
  let next = at(hour, minute);
  if (min !== undefined && next < min) next = new Date(min);
  if (max !== undefined && next > max) next = new Date(max);
  onChange(next, { event, reason: 'time' });
};`;

const wheelSections: readonly Section[] = [
  ['rolls-in-the-days-place', 'Rolls in the days’ place'],
  ['the-month-and-year', 'The month and year'],
  ['the-time', 'The time'],
];

/** `/date-picker/architecture/wheels`: its month, year and time rolls. */
export const DatePickerWheelsArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={wheelSections} />
    <ul className="demo-lead">
      <li>
        The picker’s wheels are <a href={publicUrl('roll')}>Roll</a>s: one for
        the month and year, and one for the time. For the rest of the picker,
        see its <a href={publicUrl('date-picker/architecture')}>main page</a>.
      </li>
    </ul>

    <Heading
      id="rolls-in-the-days-place"
      level={2}
    >
      Rolls in the days’ place
    </Heading>
    <ul>
      <li>
        A roll shows over the weekdays and the days, keeping their size. The
        title’s button opens one, and the time row’s button opens the other.
        Pressing the same button again closes it.
      </li>
      <li>The arrows hide while the month and year roll shows.</li>
      <li>
        While a roll shows, the strip keeps its height, and the month turns at
        once instead of scrolling.
      </li>
    </ul>

    <Heading
      id="the-month-and-year"
      level={2}
    >
      The month and year
    </Heading>
    <ul>
      <li>
        This roll has two columns. The months take their names from{' '}
        <code>Intl</code>, and months outside the limits are disabled. The years
        are editable. A year you type or roll to is clamped to the limits.
      </li>
      <li>
        The years run within the limits, or a century either side of the year
        first shown. After that they’re fixed. If they moved with the selection,
        they’d shift under the roll.
      </li>
    </ul>

    <Heading
      id="the-time"
      level={2}
    >
      The time
    </Heading>
    <ul>
      <li>
        <PartLink part="DatePicker.TimeRoll" /> has editable hours and minutes,
        in the locale’s numerals.
      </li>
      <li>
        With a 12-hour cycle, it adds a column for the day period. That column
        sits before or after the hours, the way the locale writes the time.
      </li>
      <li>
        Hours, minutes and periods with no time inside the limits are disabled.
        A time beyond the limits is moved to the nearest one inside them, and
        the roll moves back.
      </li>
      <li>
        It’s also a part of its own. A compact time popover, an expandable list
        row, or your app can use it.
      </li>
    </ul>
    <CodeView code={rollCode} />
  </>
);
