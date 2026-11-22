import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/island/architecture`: how Island is built, and what flows into it.

const treeCode = `<div class="uikit-viewport-anchor" data-edge="block-end"> <!-- touched through -->
  <div class="uikit-island" data-snap
       style="--uikit-island-max-height: 700px; --uikit-island-shown: 220px; …">
    <div class="uikit-island-scroller">       <!-- snaps, as tall as it may be -->
      <div class="uikit-island-spacer" aria-hidden="true">
        <span class="uikit-island-stop" />    <!-- one per stop, 1px high -->
        <span class="uikit-island-stop" />
      </div>
      <div class="uikit-island-panel uikit-glass-medium uikit-glass-panel">
        <div class="uikit-island-glass" aria-hidden="true" />
        <div class="uikit-island-header">…</div>     <!-- a block-start anchor -->
        <div class="uikit-island-content">           <!-- a scroller -->
          <div class="uikit-island-snap-group">…</div>
          <div class="uikit-island-snap-group">…</div>
        </div>
      </div>
    </div>
  </div>
</div>`;

const groupCode = `// SnapGroup, in short: its stop is how far down the panel it ends, as if
// the content weren't scrolled, measured whenever it or what's before it
// resizes. Followed by another group, the content margin is added.
const measure = () => {
  const top = panel.getBoundingClientRect().top;
  const end = element.getBoundingClientRect().bottom - top + content.scrollTop;
  const margin = isFollowedByGroup ? contentMargin : 0;
  report(value, Math.round(end + margin), isPinned);
};
new ResizeObserver(measure).observe(element); // and its earlier siblings,
                                              // the panel, header, content`;

const sections: readonly Section[] = [
  ['always-there', 'Always there'],
  ['snapping-natively', 'Snapping natively'],
  ['snap-groups', 'Snap groups'],
  ['touching-through-it', 'Touching through it'],
  ['corners-and-the-sliver', 'Corners and the sliver'],
  ['the-keyboard', 'The keyboard'],
  ['header-and-content', 'Header and content'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/island/architecture`: how it's built, and what flows into it. */
export const IslandArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        An island is a sheet’s glass capsule that’s always there, usually over a
        page’s content such as a map. It snaps natively between stops that its
        snap groups make. It uses the same scroller technique as a medium{' '}
        <a href={publicUrl('sheet')}>Sheet</a>. Much of its own code makes sure
        touches still reach the page around it. To learn how to use it, see its{' '}
        <a href={publicUrl('island/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="always-there"
      level={2}
    >
      Always there
    </Heading>
    <ul>
      <li>
        <PartLink part="Island.Root" /> isn’t a dialog. It has no portal,
        backdrop, focus trap or open state, and it can’t be closed.
      </li>
      <li>
        It lives in the page, usually in a bottom{' '}
        <PartLink
          component="viewport"
          part="Viewport.Anchor"
        />
        . The anchor’s size follows the island as it settles, and so does the
        content layer’s padding.
      </li>
      <li>
        The island’s box is what it shows. That’s as tall as its content, or,
        with snap groups, as tall as its current stop. It’s never taller than
        the room it may take.
      </li>
      <li>
        In a compact width, it spans the screen less 8px on each side. In a
        regular width, it’s a floating panel at the inline start. It sits 8px
        above the bottom, with the home indicator over its bottom margin.
      </li>
    </ul>
    <CodeView code={treeCode} />

    <Heading
      id="snapping-natively"
      level={2}
    >
      Snapping natively
    </Heading>
    <ul>
      <li>
        With snap groups, the root holds a scroller as tall as the island may
        get. The scroller is pinned to the island’s bottom and overflows it
        upward. Inside it are a spacer and the panel.
      </li>
      <li>
        Each stop is a 1px marker in the spacer, because iOS doesn’t snap to an
        area without a height. When the scroller is scrolled by a stop’s height,
        that much of the panel shows.
      </li>
      <li>
        The spacer is shorter than the scroller by the lowest stop. So the
        island is never scrolled below that stop, and never closed.
      </li>
      <li>
        The snapping, the mouse dragging, the hand-back from its content, and
        the rule that only the user chooses a stop all come from the sheet (
        <code>useSnap</code>, from Sheet’s <code>snap.ts</code>). Closing is
        turned off.
      </li>
      <li>
        A stop you swipe to is reported by <code>onSnapPointChange</code>, which
        can cancel it. When you control it with <code>snapPoint</code>, the
        island goes where your app says.
      </li>
      <li>
        While its content is scrolled away from its start, the stops of the
        content’s groups aren’t snapped to. If no stop below the top one counts
        then, the island is stranded. Its own pans are prevented outside its
        content, but the content still scrolls. On iOS, preventing a non-passive
        move is the only reliable way to stop the native pan.
      </li>
    </ul>

    <Heading
      id="snap-groups"
      level={2}
    >
      Snap groups
    </Heading>
    <ul>
      <li>
        Each <PartLink part="Island.SnapGroup" /> reports a stop by its{' '}
        <code>value</code>. The stop is how far down the panel the group ends,
        measured as if the content weren’t scrolled. As you swipe up, the island
        reveals its content group by group.
      </li>
      <li>
        An empty group in the content stops at the header alone, with its bar
        centered. That stop is measured from what shows in the header’s bars,
        not from their boxes.
      </li>
      <li>
        An empty group in the header, right after the grabber, is a sliver. It
        shows the grabber alone.
      </li>
      <li>
        Groups in the header, and empty groups, are pinned. They don’t scroll
        out with the content.
      </li>
    </ul>
    <CodeView code={groupCode} />

    <Heading
      id="touching-through-it"
      level={2}
    >
      Touching through it
    </Heading>
    <ul>
      <li>
        The island’s anchor lets touches through, except on the island itself.
      </li>
      <li>
        At rest, the scroller is clipped to the island’s box plus a little reach
        above it. So the page above the capsule gets its touches. The scroller
        itself can’t let touches through, because iOS doesn’t scroll a scroller
        that touches pass through.
      </li>
      <li>
        When the island moves, by a press, a wheel, a key, or a scroll away from
        its stop, it’s marked <code>data-moving</code>. Its reach then grows to
        the whole scroller, since it may grow. Once it’s back at a stop, it
        rests again.
      </li>
      <li>
        Only the clip’s reach changes, never the clip itself. On iOS, lifting a
        clip while it’s touched drops the touch’s pan.
      </li>
    </ul>

    <Heading
      id="corners-and-the-sliver"
      level={2}
    >
      Corners and the sliver
    </Heading>
    <ul>
      <li>
        The island’s corners are 42px. They get smaller when what shows is
        shorter than both corners together, down to a capsule half as tall. A
        scroll-driven animation on the scroller’s timeline does this, on a
        registered length.
      </li>
      <li>
        That length is inherited, because iOS doesn’t follow its animation where
        it’s read otherwise. So everything inside the island resets it, and only
        the panel, its rim and its content’s clip keep it. That way, a scroll
        doesn’t restyle everything in the island on every frame.
      </li>
      <li>
        With a sliver as the lowest stop, the capsule’s glass is a pill around
        the grabber. As you swipe up, the whole capsule’s glass fades in by how
        far you’ve gone toward the next stop. That progress is{' '}
        <code>--uikit-island-sliver</code>, read once a frame while the island
        scrolls.
      </li>
      <li>
        At rest, a sliver sits 18px from the screen’s bottom, so it stays clear
        of the home indicator. Without a bottom inset, it sits 8px from the
        bottom. The extra lift shrinks by the same progress, so at the next stop
        the island is 8px from the bottom, like every other stop. The lift moves
        the island without resizing it, so its anchor keeps its height.
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
        How tall the island may get is measured from its screen: the content
        layer beside its anchor, or else the window. It reaches up to 64px below
        the top. It stays at least 10px below the top inset and the bars there.
      </li>
      <li>
        When the keyboard pushes its anchor up, the keyboard’s height is taken
        off, unless the layer is already resized above the keyboard.
      </li>
      <li>
        The anchor follows the keyboard with a transition, but the island’s
        height and margin change at once. That would make the island’s top jump.
        So the island is moved back by the difference, and less and less as the
        anchor’s transition progresses. It reads that progress every frame, so
        it stays in step with the anchor.
      </li>
      <li>
        WebKit changes the island’s margin at once, instead of along with the
        anchor’s padding. That difference is included too.
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
        The island is a Viewport scope of its own, without the screen’s insets
        inside it.
      </li>
      <li>
        <PartLink part="Island.Header" /> registers as the bar at the top of
        that scope, with a soft edge effect, unless it only holds a grabber.
      </li>
      <li>
        <PartLink part="Island.Grabber" /> shows that the island can be swiped
        up. A mouse drags the island by the header and the grabber. A press on
        them goes to the next stop.
      </li>
      <li>
        <PartLink part="Island.Content" /> is a registered scroller. It’s the
        current scroller while it’s scrolled away from its start, and it keeps
        focused fields in view above the keyboard.
      </li>
      <li>
        The content scrolls only at the top stop, and fades out under the
        header. It clips itself to the capsule’s corners, because WebKit lets a
        composited scroller draw past a parent’s rounded clip.
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
        <strong>From Sheet:</strong> the snapping, its stops, and the hand-back
        from the content.
      </li>
      <li>
        <strong>From Viewport:</strong> the anchor, the keyboard’s height, the
        size class, the size of the bars at the top, a scope of its own, the
        scroller and the edge effects.
      </li>
      <li>
        <strong>From Glass:</strong> the capsule’s material and tone.
      </li>
      <li>
        <strong>Out:</strong> its size, to its anchor, which pads the page’s
        content clear of it.
      </li>
    </ul>
  </>
);
