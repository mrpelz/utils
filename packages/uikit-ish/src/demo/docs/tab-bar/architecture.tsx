import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/tab-bar/architecture` and its sub-page: how TabBar is built, and what
// flows into it.

const treeCode = `<div class="uikit-tab-bar-root">                    <!-- Base UI's tabs -->
  <div role="tablist" class="uikit-tab-bar-list" data-size="compact"
       data-glass-context="auto" style="anchor-name: --uikit-tab-bar-…">
    <div class="uikit-tab-bar-group">                  <!-- a glass capsule -->
      <!-- its glass layers -->
      <div class="uikit-tab-bar-tabs">                 <!-- scrolls, if too narrow -->
        <span class="uikit-tab-bar-indicator" />       <!-- its selection -->
        <button role="tab" class="uikit-tab-bar-tab" data-active>
          <span class="uikit-tab-bar-icon">…</span>
          <span class="uikit-tab-bar-label">…</span>
        </button>
        …
      </div>
    </div>
    …
    <span class="uikit-tab-bar-lens" aria-hidden="true" /> <!-- while pressed -->
  </div>
  <div class="uikit-tab-bar-accessory">…</div>          <!-- anchored to the list -->
</div>`;

const selectionCode = `// updateSelection, in short: each group places its own selection on its
// active tab; without one, it fades out in place. Appearing in a group,
// it's placed at once, so it never travels in from elsewhere.
const tab = tabsOf(group).find(isActive);
const hadActive = hadActiveTab.get(group) ?? false;
group.style.setProperty('--uikit-tab-bar-selection-opacity', tab ? '1' : '0');
if (tab) setSelection(group, tab.getBoundingClientRect(), { instant: !hadActive });`;

const sections: readonly Section[] = [
  ['base-ui-s-tabs', 'Base UI’s tabs'],
  ['groups-and-sizes', 'Groups and sizes'],
  ['a-selection-per-group', 'A selection per group'],
  ['collapsing', 'Collapsing'],
  ['the-accessory', 'The accessory'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/tab-bar/architecture`: how it's built, and what flows into it. */
export const TabBarArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A tab bar is Base UI’s tabs, laid out as glass capsules of tabs. Each
        capsule has its own selection. The bar also has a lens while you press a
        tab, a collapsed state, and an optional accessory. The lens has a page
        of its own:{' '}
        <a href={publicUrl('tab-bar/architecture/lens')}>The lens</a>. To learn
        how to use it, see its <a href={publicUrl('tab-bar/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="base-ui-s-tabs"
      level={2}
    >
      Base UI’s tabs
    </Heading>
    <ul>
      <li>
        <PartLink part="TabBar.Root" />, <PartLink part="TabBar.List" />,{' '}
        <PartLink part="TabBar.Tab" />, <PartLink part="TabBar.Indicator" /> and{' '}
        <PartLink part="TabBar.Panel" /> are Base UI’s. Base UI handles the
        value, the roles, and moving between tabs with the keyboard. The root
        also names an anchor for its accessory.
      </li>
      <li>
        A tab can take a secondary click, a right click or a held touch, the
        same way buttons can.
      </li>
      <li>
        The list carries Base UI’s swipe ignore, so dragging on it doesn’t swipe
        a sheet away. Its glass context, given or adaptive, is set on the list
        for its groups.
      </li>
    </ul>
    <CodeView code={treeCode} />

    <Heading
      id="groups-and-sizes"
      level={2}
    >
      Groups and sizes
    </Heading>
    <ul>
      <li>
        <PartLink part="TabBar.Group" /> is a glass capsule. Its glass layers
        come first, then a scroller with the selection and the tabs.
      </li>
      <li>
        A group that’s too narrow for its tabs scrolls, clipped to its shape.
        Otherwise it doesn’t clip, so a pressed group’s content can grow beyond
        it.
      </li>
      <li>
        The list’s <code>size</code> sets the metrics for every group, inherited
        as custom properties.
      </li>
      <li>
        In the compact size, the content is stacked, the tabs shrink to fit down
        to their content, and neighboring tabs overlap. In the regular size, the
        content is in a row, the tabs hug it, and labels grow when selected.
      </li>
      <li>
        Tabs with only a symbol are circles or capsules, depending on the size,
        unless a <code>shape</code> says otherwise.
      </li>
      <li>
        <PartLink part="TabBar.Label" /> holds a hidden copy of its text in the
        selected style, in the same grid cell. So selecting a tab doesn’t change
        its width. <PartLink part="TabBar.Icon" /> holds its symbol.
      </li>
      <li>
        Nothing isolates blending, because that would cut the glass blur off
        from what’s behind the bar. The glass, the selection and the tabs stack
        by document order instead.
      </li>
    </ul>

    <Heading
      id="a-selection-per-group"
      level={2}
    >
      A selection per group
    </Heading>
    <ul>
      <li>
        Each group places its own selection on its active tab, using custom
        properties for its position and size. So the selection scrolls along
        with the tabs.
      </li>
      <li>
        The selection never travels between groups. The group that loses the
        active tab fades its selection out in place. The group that gains it
        fades its selection in.
      </li>
      <li>
        A mutation observer watches for <code>data-active</code> changes and new
        tabs. A resize observer watches the sizes of the group and its tabs. The
        active tab is scrolled into view, smoothly when it changes.
      </li>
    </ul>
    <CodeView code={selectionCode} />

    <Heading
      id="collapsing"
      level={2}
    >
      Collapsing
    </Heading>
    <ul>
      <li>
        When <code>expanded</code> is <code>false</code>, the bar collapses: it
        gets lower, around the same center line.
      </li>
      <li>
        Only the groups and tabs marked <code>visibleWhenCollapsed</code>{' '}
        remain, which is your app’s choice (<code>collapsedSelection</code>{' '}
        helps with it). The rest collapse away.
      </li>
      <li>
        Each remaining group goes to its <code>collapsedPosition</code>. The
        groups are ordered between two spacers, which are the list’s
        pseudo-elements. Their tabs show their <code>collapsedContent</code>.
      </li>
      <li>
        The bar keeps its expanded width while collapsed. When it expands, the
        groups grow from where the collapsed tabs are, with their labels clipped
        meanwhile.
      </li>
      <li>
        That collapsed layout is held from the moment collapsing starts.
        Otherwise, a layout read in between would start the transitions from the
        wrong place.
      </li>
      <li>
        In a bar wider than its groups, the space between them is kept as a
        length while it collapses or expands. That’s because a margin can’t
        transition from or to <code>auto</code>.
      </li>
      <li>
        While it collapses or expands, every group’s selection follows its
        active tab on every frame, until all transitions have finished. Resize
        observers would lag a frame behind.
      </li>
    </ul>

    <Heading
      id="the-accessory"
      level={2}
    >
      The accessory
    </Heading>
    <ul>
      <li>
        <PartLink part="TabBar.Accessory" /> is a glass capsule next to the
        list, not inside it, so its content isn’t part of the tab list. CSS
        anchor positioning places it at the list, so it never changes the bar’s
        layout.
      </li>
      <li>
        When the bar is expanded, the accessory spans the groups, above them.
        When it’s collapsed, the accessory fills the space after the groups at
        the start, at a collapsed tab’s height. Custom properties place its box,
        again whenever the groups change.
      </li>
      <li>
        As the bar collapses or expands, the accessory morphs from where it was
        to where it will be, by how far the groups’ transitions have got. To
        find where it will be, the layout transitions are sought to just before
        their end and back again, in the same frame.
      </li>
      <li>
        When it only shows in one state (<code>visibleIn</code>), it stays at
        its place for that state, and fades in and out.
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
        <strong>From Base UI:</strong> the tabs’ value, roles and keyboard.
      </li>
      <li>
        <strong>From Glass:</strong> the capsules’ material, the context and the
        lens.
      </li>
      <li>
        <strong>From the library’s utilities:</strong> the drag, the lens’s
        delay, scrolling at the edges, and secondary clicks.
      </li>
      <li>
        <strong>Out:</strong> a{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockEnd"
        />{' '}
        usually holds it, and handles the safe area under it.
      </li>
    </ul>
  </>
);

const pressCode = `// press, in short: the lens moves to the pointer, clamped to the tabs in
// view, and the closest tab is the one it would choose. The pointer is
// read in the pressed group's unscaled layout, since that group grows.
const over = groupOf(tabs[closest(visible, clientX)]);
const { scale, x: originX } = growth(over);
const x = originX + (clientX - originX) / scale;   // in the unscaled layout
const tab = tabs[closest(visible, x)];
setLens(list, scaled(tab.getBoundingClientRect()), clamped(x)); // as grown
for (const group of getGroups(list)) pressGroup(group, group === groupOf(tab));`;

const lensSections: readonly Section[] = [
  ['pressed-held-or-dragged', 'Pressed, held or dragged'],
  ['following-the-pointer', 'Following the pointer'],
  ['the-group-grows', 'The group grows'],
  ['scrolling-near-the-ends', 'Scrolling near the ends'],
  ['released', 'Released'],
];

/** `/tab-bar/architecture/lens`: the lens, while a tab is pressed. */
export const TabBarLensArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={lensSections} />
    <ul className="demo-lead">
      <li>
        When you press a tab, the selection turns into a glass lens. The lens
        follows the pointer across groups, and chooses the closest tab when you
        let go. The lens belongs to the list, so it can move between groups, and
        it’s drawn above their glass. For the rest of the bar, see its{' '}
        <a href={publicUrl('tab-bar/architecture')}>main page</a>.
      </li>
    </ul>

    <Heading
      id="pressed-held-or-dragged"
      level={2}
    >
      Pressed, held or dragged
    </Heading>
    <ul>
      <li>
        The list tracks one pointer at a time (<code>usePointerDrag</code>).
        That can be any pointer, not only touch. It captures the pointer, and
        handles moves once a frame.
      </li>
      <li>
        The lens only shows after a moment or a move (<code>delayLens</code>),
        so a quick tap just selects its tab.
      </li>
      <li>
        When the lens shows, it’s placed and sized at the pointer without a
        transition, and then it follows the pointer without one. Only its
        opacity and scale animate.
      </li>
    </ul>

    <Heading
      id="following-the-pointer"
      level={2}
    >
      Following the pointer
    </Heading>
    <ul>
      <li>
        Each move finds the closest tab among those that are in view, enabled,
        and not hidden by collapsing. The lens is centered on the pointer, and
        takes the size of that tab. It’s clamped so its edges stay within the
        tabs in view.
      </li>
      <li>
        The lens is positioned by its center, so it stays under the pointer
        while its size changes between tab shapes. Its size and position are
        registered lengths, so they can transition, and the clamp made from them
        follows on every frame.
      </li>
      <li>
        The hidden selection of the closest tab’s group follows the lens. So
        when you let go, the selection settles from there.
      </li>
    </ul>
    <CodeView code={pressCode} />

    <Heading
      id="the-group-grows"
      level={2}
    >
      The group grows
    </Heading>
    <ul>
      <li>
        The group under the lens grows. Scaling the group itself would isolate
        the blending of its layers, and turn the glass gray. So its glass layers
        scale by themselves. Its tabs’ symbols and labels scale around the
        group’s center, which is set as each one’s transform origin. The tabs’
        boxes don’t change.
      </li>
      <li>
        The pointer is read back into the unscaled layout, and the lens is
        placed on the tab as the grown group shows it. The origins are set again
        while the group scrolls, since its center moves over its tabs.
      </li>
    </ul>

    <Heading
      id="scrolling-near-the-ends"
      level={2}
    >
      Scrolling near the ends
    </Heading>
    <ul>
      <li>Touches drag the lens, not the tabs.</li>
      <li>
        In a group too narrow for its tabs, holding the lens near an end scrolls
        the group on every frame, faster the closer you get (
        <code>edgeScrollDelta</code>). It scrolls within the tabs’ own layout,
        so their grown content doesn’t make the range wider.
      </li>
      <li>
        A wheel can also scroll a pressed group, which moves its tabs under the
        lens. So the closest tab is found again on every scroll.
      </li>
    </ul>

    <Heading
      id="released"
      level={2}
    >
      Released
    </Heading>
    <ul>
      <li>
        When you let go, the lens settles on the chosen tab as it fades out. The
        groups take their final state at once. The chosen tab’s group settles
        its selection from the lens. The other groups keep theirs hidden, so
        they only fade out.
      </li>
      <li>
        On the next frame, everything is checked again, in case the tab isn’t
        activated after all.
      </li>
      <li>
        The chosen tab is clicked, even when it’s already active. That way, the
        click reaches the tab and its group, for example to expand a collapsed
        bar.
      </li>
      <li>
        The browser may send its own click afterwards. WebKit does, despite the
        pointer capture. That click is swallowed, so it doesn’t arrive twice.
      </li>
      <li>
        When the press is cancelled, the lens fades out and nothing is chosen.
      </li>
    </ul>
  </>
);
