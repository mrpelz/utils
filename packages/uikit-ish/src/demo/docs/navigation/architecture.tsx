import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/navigation/architecture`: how Navigation is built, and what flows into
// it.

const treeCode = `<div class="uikit-navigation-root" data-navigation-moving
     style="--uikit-navigation-progress: 0.4; --uikit-navigation-width: 402px; …">
  <div class="uikit-navigation-stack">
    <div class="uikit-navigation-frame" data-navigation-role="hidden" inert>…</div>
    <div class="uikit-navigation-frame" data-navigation-role="under" inert>…</div>
    <div class="uikit-navigation-frame" data-navigation-role="top">  <!-- popping -->
      <!-- its page, its header and bar with it -->
    </div>
  </div>
  <div class="uikit-navigation-swipe-area" />   <!-- the leading 20px -->
  <!-- a bar that stays: a Viewport.BlockStart in the root -->
</div>`;

const keysCode = String.raw`// Stack, in short: the app's keyed children are the stack; a change of
// keys is read as a push, a pop, or neither.
const keys = pages.map((page) => String(page.key));
useLayoutEffect(() => {
  if (isPrefix(previous.keys, keys)) push();        // a page added on top
  else if (isPrefix(keys, previous.keys)) pop();    // cut back, by one or more
  else rest();                                      // anything else: at once
}, [keys.join('\n')]);`;

const progressCode = `/* style.css, in short: one progress moves both pages; at rest, none
   of it applies, so nothing is transformed. */
[data-navigation-role='top'] {
  --uikit-navigation-x: calc(var(--uikit-navigation-progress) *
    var(--uikit-navigation-width) * var(--uikit-navigation-direction));
}
[data-navigation-role='under'] {                  /* 30% back, dimmed */
  --uikit-navigation-x: calc((1 - var(--uikit-navigation-progress)) * -0.3 *
    var(--uikit-navigation-width) * var(--uikit-navigation-direction));
}
[data-navigation-role='top'], [data-navigation-role='under'] {
  translate: var(--uikit-navigation-x) 0;
  & [data-navigation-shared] {                    /* stays put */
    translate: calc(var(--uikit-navigation-x) * -1) 0;
  }
}`;

const sections: readonly Section[] = [
  ['the-app-s-stack', 'The app’s stack'],
  ['one-progress', 'One progress'],
  ['swiping-back', 'Swiping back'],
  ['popping-again-mid-way', 'Popping again mid-way'],
  ['items-that-stay-put', 'Items that stay put'],
  ['pages-kept-and-dropped', 'Pages kept and dropped'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/navigation/architecture`: how it's built, and what flows into it. */
export const NavigationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A navigation moves between the pages of a stack that your app keeps. It
        has no router. Instead, it compares the keys of its children from one
        render to the next. Every push, pop and swipe is one number that moves
        both pages. To learn how to use it, see its{' '}
        <a href={publicUrl('navigation/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="the-app-s-stack"
      level={2}
    >
      The app’s stack
    </Heading>
    <ul>
      <li>
        <PartLink part="Navigation.Stack" /> takes your app’s pages as keyed
        children. When the keys get longer, that’s a push. When they get
        shorter, by one or more, that’s a pop. Any other change is shown at
        once.
      </li>
      <li>
        <PartLink part="Navigation.Page" /> is optional around a page. It can
        make the page <code>instant</code>, so it’s pushed and popped at once
        and can’t be swiped back.
      </li>
      <li>
        <PartLink part="Navigation.Root" /> holds the stack’s state: its keys,
        the current transition, and the swipe. The transition says which page is
        on top, which one is under it, and which are still leaving.
      </li>
      <li>
        The root calls <code>onBack</code> for your app to pop its stack, from{' '}
        <PartLink part="Navigation.Back" /> or from a swipe. The navigation
        never pops by itself.
      </li>
      <li>
        Each page sits in a frame with its own Viewport scope. So its bar’s edge
        effect and its paddings are its own, not those of a hidden page. The
        anchors of the outer scope count too.
      </li>
    </ul>
    <CodeView code={treeCode} />
    <CodeView code={keysCode} />

    <Heading
      id="one-progress"
      level={2}
    >
      One progress
    </Heading>
    <ul>
      <li>
        The root carries <code>--uikit-navigation-progress</code>, which runs
        from 0, the upper page shown, to 1, the page under it shown. It also
        carries its own width as a length.
      </li>
      <li>
        A push or a pop sets the progress at its start, then transitions it to
        its end over 350ms. The stylesheet moves the upper page by it. The page
        underneath moves 30% of the width behind it, and is dimmed.
      </li>
      <li>
        The progress is a registered, inherited number, so it can transition.
        Each frame’s children reset it, along with the values made from it. That
        way, a frame of a push doesn’t restyle every element on both pages (see{' '}
        <a href={publicUrl('ios-quirks#moving-values-and-memory')}>
          iOS Quirks
        </a>
        ).
      </li>
      <li>
        At rest, no transform applies, because a transform would isolate the
        glass’s blending on the page. The pages under the top one are hidden and
        inert.
      </li>
    </ul>
    <CodeView code={progressCode} />

    <Heading
      id="swiping-back"
      level={2}
    >
      Swiping back
    </Heading>
    <ul>
      <li>
        <PartLink part="Navigation.SwipeArea" /> is a strip at the leading edge,
        20px wide by default. It only renders while there’s a page to go back
        to, and not while a page is being pushed.
      </li>
      <li>
        The strip takes the pointer, whether it’s a touch or a mouse, and
        scrolls nothing. It carries Base UI’s swipe ignore, so a sheet around it
        isn’t swiped along.
      </li>
      <li>
        The swipe sets the progress directly: the distance moved, divided by the
        width, in the layout’s direction.
      </li>
      <li>
        When you release it past half, or faster than 0.3px per millisecond over
        the last 100ms, the swipe animates on to 1 and calls <code>onBack</code>
        . Otherwise it settles back.
      </li>
      <li>If your app doesn’t pop after all, the page comes back.</li>
    </ul>

    <Heading
      id="popping-again-mid-way"
      level={2}
    >
      Popping again mid-way
    </Heading>
    <ul>
      <li>
        If you pop again while a pop is still running, by a press or a swipe,
        the leaving page is handed over as departing. It animates its own
        progress on to 1 from where it was, above the others.
      </li>
      <li>
        The page it revealed starts leaving from where it had got to. So each
        pop runs its own transition, in a cascade.
      </li>
      <li>
        If you push back during a pop, or pop during a push, the transition
        reverses from where it is.
      </li>
    </ul>

    <Heading
      id="items-that-stay-put"
      level={2}
    >
      Items that stay put
    </Heading>
    <ul>
      <li>
        <PartLink part="Navigation.Persistent" /> marks an item in a page’s bar
        with an id.
      </li>
      <li>
        During a transition, items whose id is on both moving pages are shared.
        They move back by their page’s move, so they stay where they are. Only
        the upper page’s item shows and stays pressable. A back button slides in
        with the first page that has one, then stays put.
      </li>
      <li>
        <PartLink part="Navigation.Back" /> is a persistent item by default.
        It’s disabled on the root page.
      </li>
      <li>
        Shared items need the moving values that frames otherwise keep away from
        their pages. So the elements on the way to a shared item are marked to
        let those values through.
      </li>
      <li>
        A bar that always stays belongs in the root, outside the stack. Only its
        items take the pointer, so the moving bars under it still get their
        presses.
      </li>
    </ul>

    <Heading
      id="pages-kept-and-dropped"
      level={2}
    >
      Pages kept and dropped
    </Heading>
    <ul>
      <li>
        Pages under the top one stay mounted, so they keep their state and
        scroll positions.
      </li>
      <li>
        A page that’s popped or replaced lingers for a while. It isn’t painted
        at all, and it’s inert. Once the stack is at rest and the browser is
        idle, it unmounts. A large page is costly to unmount in the middle of a
        slide. Safari has no idle callback, so there it unmounts shortly after.
      </li>
      <li>
        If a lingering page is pushed again, it mounts fresh, instead of showing
        up as it was left.
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
        <strong>From the app:</strong> the stack, as keyed children, and its
        pops, through <code>onBack</code>.
      </li>
      <li>
        <strong>From Viewport:</strong> a scope for each page, and the sizes of
        its anchors on each frame.
      </li>
      <li>
        <strong>Out:</strong> the bars of its pages’{' '}
        <PartLink
          component="header"
          part="Header.Root"
        />
        s move with their pages. A{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Button"
        />{' '}
        can render a back button.
      </li>
    </ul>
  </>
);
