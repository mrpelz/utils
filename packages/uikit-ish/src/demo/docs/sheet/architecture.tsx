import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/sheet/architecture` and its sub-page: how Sheet is built, and what
// flows into it.

const treeCode = `<div class="uikit-sheet-portal">                   <!-- Base UI's drawer portal -->
  <div class="uikit-sheet-backdrop" />              <!-- the page dimmed -->
  <div class="uikit-sheet-viewport">                <!-- where it moves -->
    <div role="dialog" class="uikit-sheet-popup"
         data-detent="medium" data-compact data-snap="capsule">
      <div class="uikit-sheet-spacer" aria-hidden="true">…</div> <!-- snapping only -->
      <div class="uikit-sheet-panel uikit-glass-medium uikit-glass-panel">
        <div class="uikit-sheet-header">                 <!-- a block-start anchor -->
          <div class="uikit-sheet-grabber" aria-hidden="true" />
          …                                              <!-- e.g. a toolbar -->
        </div>
        <div class="uikit-sheet-content" data-viewport-scroller>…</div>
      </div>
    </div>
  </div>
</div>`;

const placementCode = `// usePlacement, in short: from the bottom when compact, or as a card;
// otherwise a form sheet, centered.
const isCompact = compact ?? useSizeClass() === 'compact';
const isCard = !isCompact && regular === 'card';
const isBottom = isCompact || isCard;
const isGlass = isBottom && detent === 'medium';  // else opaque`;

const sections: readonly Section[] = [
  ['base-ui-s-drawer', 'Base UI’s drawer'],
  ['where-it-appears', 'Where it appears'],
  ['sliding-and-swiping', 'Sliding and swiping'],
  ['the-keyboard', 'The keyboard'],
  ['header-and-content', 'Header and content'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/sheet/architecture`: how it's built, and what flows into it. */
export const SheetArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A sheet is Base UI’s drawer, which is a modal dialog with swipe
        gestures. It appears from the bottom or as a form sheet, and it’s opaque
        or glass. With snap groups, it snaps natively between stops, instead of
        using Base UI’s snap points. That has a page of its own:{' '}
        <a href={publicUrl('sheet/architecture/snapping')}>Snapping</a>. To
        learn how to use it, see its{' '}
        <a href={publicUrl('sheet/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="base-ui-s-drawer"
      level={2}
    >
      Base UI’s drawer
    </Heading>
    <ul>
      <li>
        Every part the library doesn’t wrap is Base UI’s. Base UI handles the
        dialog role, the focus trap, dismissing with Escape or a press outside,
        and the title and description. <PartLink part="Sheet.createHandle" /> is
        Base UI’s handle.
      </li>
      <li>
        <PartLink part="Sheet.Root" /> is Base UI’s drawer root. It adds{' '}
        <code>swipeDirection</code> <code>none</code>. Then the popup carries
        Base UI’s swipe ignore, and the sheet can’t be swiped away at all.
      </li>
      <li>
        With snap groups and no snap points of your own, the root snaps by the
        groups’ stops. The stops are named by the groups’ values.
      </li>
      <li>
        <PartLink part="Sheet.Trigger" /> is Base UI’s, with an optional{' '}
        <code>snapPoint</code>. That makes it a deep link, which opens the sheet
        at that stop. Otherwise, the sheet opens at its default stop each time.
      </li>
      <li>
        <PartLink part="Sheet.Popup" /> renders the portal, the backdrop, the
        viewport and the popup. The portal carries the settings of the place
        where the sheet was opened.
      </li>
      <li>
        The popup is a Viewport scope of its own. Inside it, the screen’s insets
        are zero. The exception is a large sheet’s bottom, so its content can
        scroll clear of the home indicator.
      </li>
    </ul>
    <CodeView code={treeCode} />

    <Heading
      id="where-it-appears"
      level={2}
    >
      Where it appears
    </Heading>
    <ul>
      <li>
        In a compact width, by the window’s size class or by{' '}
        <code>compact</code>, the sheet comes from the bottom. A large sheet is
        opaque, and starts 10px below the top. A medium sheet is a glass capsule
        8px from the edges, with the home indicator over its bottom margin.
      </li>
      <li>
        In a regular width, the sheet is a form sheet, opaque and centered. With{' '}
        <code>regular</code> set to <code>card</code>, it’s a card that comes
        from the bottom at the leading edge, like a regular{' '}
        <a href={publicUrl('island')}>Island</a>.
      </li>
      <li>
        An opaque sheet uses the elevated backgrounds, set as tokens for all its
        content. <code>background</code> set to <code>grouped</code> puts it on
        the grouped background, for grouped lists.
      </li>
      <li>A glass sheet’s color scheme follows the tone of its glass.</li>
      <li>The detent is your app’s. Dragging doesn’t change it.</li>
    </ul>
    <CodeView code={placementCode} />

    <Heading
      id="sliding-and-swiping"
      level={2}
    >
      Sliding and swiping
    </Heading>
    <ul>
      <li>
        The sheet slides in from below the screen’s bottom, and back out the
        same way. That takes 500ms, on a critically damped curve.
      </li>
      <li>
        While you swipe it, Base UI moves it with your finger by custom
        properties. Base UI closes it when you swipe far enough, or flick it.
        When you let go, it moves out as fast as you flicked it. Swiped another
        way, it leaves through that edge.
      </li>
      <li>
        Base UI only handles touch swipes. A mouse drags the sheet down by its
        header, but not by the header’s buttons. Past a third of its height, or
        with a flick, the sheet closes. Otherwise it goes back.
      </li>
    </ul>

    <Heading
      id="the-keyboard"
      level={2}
    >
      The keyboard
    </Heading>
    <ul>
      <li>
        The keyboard lifts the sheet the way it lifts the anchors. The sheet’s
        bottom sits on the keyboard, with that much less room above it, using
        the same transition. Its content’s bottom inset shrinks by what the
        keyboard covers.
      </li>
      <li>
        The lift and the room are the sheet’s own custom properties, copied from
        Viewport’s. While the sheet closes, they’re kept as they were.
        Otherwise, the keyboard hiding as focus leaves would make the sheet grow
        during its slide out.
      </li>
      <li>
        While the sheet is snapping, its scroller is resized once instead of
        every frame. Its top slides from where it was over 250ms, or not at all
        with reduced motion. That way, it moves together with the other layers.
      </li>
    </ul>

    <Heading
      id="header-and-content"
      level={2}
    >
      Header and content
    </Heading>
    <ul>
      <li>
        <PartLink part="Sheet.Header" /> registers as the bar at the top of the
        sheet’s scope, with a soft edge effect. That doesn’t apply when it only
        holds a <PartLink part="Sheet.Grabber" />. The content makes room under
        it with a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />
        .
      </li>
      <li>
        <PartLink part="Sheet.Content" /> is Base UI’s drawer content, so you
        can select its text with a mouse without swiping the sheet.
      </li>
      <li>
        The content is a registered scroller. It’s the current scroller while
        the sheet is open, and it keeps focused fields in view above the
        keyboard.
      </li>
      <li>
        Under the header, the content fades out by a mask. Its edge effects sit
        beside it, so the mask doesn’t affect them.
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
        <strong>From Base UI:</strong> the dialog, its swipes, and its snap
        points when your app gives them.
      </li>
      <li>
        <strong>From Viewport:</strong> the size class, the keyboard, a scope of
        its own, the bar at the top, the scroller and the edge effects.
      </li>
      <li>
        <strong>From Glass and Settings:</strong> a medium sheet’s material and
        tone, the portal’s settings, and reduced motion.
      </li>
      <li>
        <strong>Out:</strong> its snapping, to an{' '}
        <a href={publicUrl('island')}>Island</a>. An{' '}
        <a href={publicUrl('activity-view')}>Activity View</a> or a{' '}
        <a href={publicUrl('color-picker')}>Color Picker</a> can sit in a sheet.
      </li>
    </ul>
  </>
);

const snapCode = `<div class="uikit-sheet-popup" data-snap="capsule"> <!-- the scroller -->
  <div class="uikit-sheet-spacer">            <!-- as tall as the popup -->
    <span class="uikit-sheet-stop" />          <!-- 0: closed -->
    <span class="uikit-sheet-stop" style="margin-top: min(220px, 100cqh)" />
    <span class="uikit-sheet-stop" style="margin-top: min(480px, 100cqh)" />
  </div>
  <div class="uikit-sheet-panel">…</div>       <!-- as tall, scrolled up into view -->
</div>`;

const settleCode = `// useSnap, in short: nothing moves the scroll while it's scrolled; at
// rest, the stop is read. Only the user's scrolls choose a stop.
const settle = (event) => {
  const stops = positionsOf(element, options);   // capped by its range
  if (!isUsers) return scrollBackTo(stops[options.active]); // e.g. re-snapped
  const index = nearestStop(stops, element.scrollTop);
  if (index === -1) return options.canClose ? options.onClose(event) : back();
  if (index !== options.active) options.onSelect(index, event);
};`;

const snappingSections: readonly Section[] = [
  ['a-scroller-of-stops', 'A scroller of stops'],
  ['stops-from-snap-groups', 'Stops from snap groups'],
  ['choosing-a-stop', 'Choosing a stop'],
  ['the-content-scrolled', 'The content scrolled'],
  ['pulling-down-a-stop', 'Pulling down a stop'],
  ['mouse-and-resizes', 'Mouse and resizes'],
  ['shown-and-swiped-out', 'Shown and swiped out'],
];

/** `/sheet/architecture/snapping`: its snapping by snap groups (snap.ts). */
export const SheetSnappingArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={snappingSections} />
    <ul className="demo-lead">
      <li>
        With snap groups, a sheet snaps natively, using the browser’s scroll
        snapping instead of Base UI’s snap points. The same code, in{' '}
        <code>snap.ts</code>, also moves an{' '}
        <a href={publicUrl('island')}>Island</a>. For the rest of the sheet, see
        its <a href={publicUrl('sheet/architecture')}>main page</a>.
      </li>
    </ul>

    <Heading
      id="a-scroller-of-stops"
      level={2}
    >
      A scroller of stops
    </Heading>
    <ul>
      <li>
        While snapping, the popup itself is the scroller. It snaps mandatorily,
        and doesn’t bounce on its own.
      </li>
      <li>
        Inside the popup are a spacer as tall as the popup, and then the panel,
        which has the sheet’s look and is as tall too. When the popup is
        scrolled by a height, that much of the panel shows above the popup’s
        bottom.
      </li>
      <li>
        Each stop is a 1px marker in the spacer, because iOS doesn’t snap to an
        area without a height. There’s one more marker at 0, for closed.
      </li>
      <li>
        The markers are in the normal flow, not positioned, because Safari
        places positioned markers in a transformed container somewhere else.
        They’re keyed by position, so a stop that’s measured again is still the
        one snapped to.
      </li>
      <li>
        Every marker stays within the scroll range, and the top one sits exactly
        at its end, in whole pixels. Safari snaps to a marker past the end and
        holds on to it.
      </li>
      <li>
        The content only scrolls at the top stop. At its start, a pull down is
        handed back to the popup natively.
      </li>
    </ul>
    <CodeView code={snapCode} />

    <Heading
      id="stops-from-snap-groups"
      level={2}
    >
      Stops from snap groups
    </Heading>
    <ul>
      <li>
        Each <PartLink part="Sheet.SnapGroup" /> reports where it ends, from the
        panel’s top, as if the content weren’t scrolled. It adds the bottom
        inset that a large sheet keeps clear of. When another group follows, it
        adds the content margin too.
      </li>
      <li>
        A resize observer measures the group again whenever it, the popup, the
        panel, the content, or anything before it resizes.
      </li>
      <li>
        An empty group stops at the header alone, with its bars centered. That
        stop is measured from what shows in the bars. The last group holds the
        rest, so its stop is the whole sheet.
      </li>
      <li>
        The root sorts the reports by height into stops (
        <code>useGroupStops</code>, <code>stopsOf</code>). It names them by
        their values for <code>snapPoint</code>, <code>defaultSnapPoint</code>{' '}
        and <code>onSnapPointChange</code>, and passes them to the popup.
      </li>
    </ul>

    <Heading
      id="choosing-a-stop"
      level={2}
    >
      Choosing a stop
    </Heading>
    <ul>
      <li>
        Nothing moves the scroll while it’s scrolling. Once it comes to rest, on{' '}
        <code>scrollend</code> or after 150ms without a scroll, the nearest stop
        is read.
      </li>
      <li>
        If it’s nearer to 0 than to any stop, the sheet closes. That only
        happens from the lowest stop.
      </li>
      <li>
        Only your own scrolls choose a stop: a touch, or a wheel or a key in the
        last 300ms. Any other scroll, such as the browser snapping again as
        stops move, is brought back.
      </li>
      <li>
        A stop your app asks for is scrolled to smoothly. Snapping is turned off
        until the sheet gets there, because WebKit would snap to a different
        marker if the markers changed on the way. When the sheet opens, or its
        stops are measured again, it moves at once.
      </li>
    </ul>
    <CodeView code={settleCode} />

    <Heading
      id="the-content-scrolled"
      level={2}
    >
      The content scrolled
    </Heading>
    <ul>
      <li>
        While the content is scrolled away from its start, the stops of its
        groups aren’t snapped to. Only the top stop, the pinned stops and the
        current stop count. Their markers stay where they are, marked{' '}
        <code>data-ignored</code>, so nothing else changes.
      </li>
      <li>
        The content counts as scrolled once its scroll comes to rest, or as soon
        as the popup moves. It doesn’t count while the scroll crosses its start,
        because on iOS, changing a snap area in the middle of a scroll breaks
        the snapping. It only counts as back at its start once the popup moves.
      </li>
      <li>
        If no stop below the top one counts then, you swipe the sheet out from
        its top stop, as if that were the lowest. When your app asks for a lower
        stop, the content scrolls back to its start too.
      </li>
    </ul>

    <Heading
      id="pulling-down-a-stop"
      level={2}
    >
      Pulling down a stop
    </Heading>
    <ul>
      <li>
        At the top stop, you can pull the content down 50px past its start and
        let go. The sheet then steps down a stop, or closes from the lowest.
        This uses Safari’s bounce, where the scroll position goes negative,
        because iOS doesn’t hand a gesture on midway.
      </li>
      <li>
        The content is marked as pulled until it has bounced back, for at most a
        second. Hiding it at once would make it jump.
      </li>
      <li>
        A trackpad does the same. WebKit on iPadOS doesn’t hand a wheel on from
        the content’s start, and doesn’t bounce it either. So a wheel gesture
        that starts there and goes up 50px, with nothing scrolled, steps the
        sheet down. Where the browser does hand the wheel on, as Chrome does,
        the popup scrolls instead.
      </li>
    </ul>

    <Heading
      id="mouse-and-resizes"
      level={2}
    >
      Mouse and resizes
    </Heading>
    <ul>
      <li>
        A mouse has no native scroll here. So it drags the scroller by the
        handle, which is the header and the grabber but not their buttons.
        Snapping is turned off meanwhile.
      </li>
      <li>
        When you let go, the sheet goes to the nearest stop. With a flick, it
        goes to the next stop in that direction. A press without a drag goes to
        the next stop up, and from the top stop, to the lowest.
      </li>
      <li>
        When the sheet is resized, for example as the keyboard shows, its scroll
        range changes. It goes back to its stop at once, with snapping off until
        it’s at rest. Meanwhile it’s marked as resized, so this doesn’t change
        whether the content counts as scrolled.
      </li>
    </ul>

    <Heading
      id="shown-and-swiped-out"
      level={2}
    >
      Shown and swiped out
    </Heading>
    <ul>
      <li>
        The height of the current stop, which is how much shows, is a custom
        property.
      </li>
      <li>
        When the sheet opens, it slides in by that much. That’s an animation,
        not its transition, because the stop is only scrolled to after the first
        frame. When it closes, it slides out by that much, so a low stop doesn’t
        leave the screen in the first few frames.
      </li>
      <li>
        A medium sheet scrolled below its lowest stop moves out whole, with its
        corners and rim. Scroll-driven animations on its own scroll move the
        popup down and hold the panel up by the same amount. So the sheet
        follows your finger.
      </li>
      <li>
        Its corners follow what shows, by another scroll-driven animation. When
        what shows is shorter than both corners together, the sheet becomes a
        capsule half as tall.
      </li>
    </ul>
  </>
);
