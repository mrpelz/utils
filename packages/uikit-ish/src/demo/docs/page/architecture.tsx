import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/page/architecture`: how Page is built, and what flows into it.

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const rootCode = `// Page.Root, in short: one element, registered as a scroller.
useScrollerRegistration(ref, !fill);
const glassMode = useGlassMode(ref, fill && glass === 'auto' ? 'live' : glass);

<div
  ref={ref}
  className="uikit-page-root"
  data-background={background}
  data-glass={glassMode}
  data-viewport-scroller={fill ? undefined : ''}
  data-viewport-focus-scroll={fill ? undefined : 'target'}
>
  {children}
  {fill ? null : <EdgeEffects scroller={ref} />}
</div>`;

const insetsCode = `.uikit-page-root {
  /* Clear of the insets at its ends; its content scrolls under the bars. */
  padding-block: var(--uikit-safe-area-inset-top, 0px)
    var(--uikit-safe-area-inset-bottom, 0px);
  /* In a column beside a floating one: inset by that column. */
  padding-inline-start: var(--uikit-layout-inset-start, 0);

  /* Its children: the insets handled, none left for them. */
  & > * {
    --uikit-safe-area-inset-top: 0px;
    --uikit-safe-area-inset-bottom: 0px;
  }
}`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

const sections: readonly Section[] = [
  ['one-scroller', 'One scroller'],
  ['insets-and-padding', 'Insets and padding'],
  ['registered-with-the-viewport', 'Registered with the viewport'],
  ['filled-not-scrolling', 'Filled, not scrolling'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/page/architecture`: how it's built, and what flows into it. */
export const PageArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A page is a single element: a scroll container on the page background.
        What makes it more than a <code>div</code> is how it ties into{' '}
        <a href={publicUrl('viewport')}>Viewport</a>. It registers as a
        scroller, draws its bars’ edge effects, keeps focused fields in view,
        and handles the safe area insets. To learn how to use it, see its{' '}
        <a href={publicUrl('page/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="one-scroller"
      level={2}
    >
      One scroller
    </Heading>
    <ul>
      <li>
        <PartLink part="Page.Root" /> fills its container and scrolls its
        content. The container can be a column, a page in a navigation stack, or
        the content layer. Its overscroll is contained, so a fling that reaches
        its end doesn’t move what’s around it.
      </li>
      <li>
        Its <code>background</code> sets <code>--uikit-glass-backdrop</code> to
        the grouped or the plain system background. Flat glass in the page is
        drawn over that color, so it matches without sampling anything.
      </li>
      <li>
        Glass resolves the page’s glass mode (<code>useGlassMode</code>). With{' '}
        <code>auto</code>, glass in the page is flat while the page can scroll.
        That’s measured again whenever the page or its content resizes.
      </li>
      <li>
        With <code>alwaysBounce</code>, the default, the page bounces even when
        its content fits. A hidden pseudo-element one pixel taller than the page
        gives it something to scroll. That keeps a drag on the page its own, so
        it doesn’t reach the document.
      </li>
    </ul>
    <CodeView code={rootCode} />

    <Heading
      id="insets-and-padding"
      level={2}
    >
      Insets and padding
    </Heading>
    <ul>
      <li>
        The page pads its ends by the safe area insets it inherits, and sets
        them to zero for its children. That way, each inset is handled once, by
        the page.
      </li>
      <li>
        The page’s content scrolls under the bars. The room under the bars comes
        from a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />{' '}
        in the content, not from the page.
      </li>
      <li>
        A header in the page is the exception. Its bar is anchored over the
        page, so the page hands the insets back to the header’s anchor.
      </li>
      <li>
        In a{' '}
        <PartLink
          component="layout"
          part="Layout.Column"
        />{' '}
        beside a floating column, Layout sets{' '}
        <code>--uikit-layout-inset-start</code>. The page pads its leading side
        by that amount. Its content stays clear of the floating column, while
        its background runs beneath it.
      </li>
    </ul>
    <CodeView code={insetsCode} />

    <Heading
      id="registered-with-the-viewport"
      level={2}
    >
      Registered with the viewport
    </Heading>
    <ul>
      <li>
        <strong>The current scroller.</strong> While it’s mounted, the page is
        registered with Viewport’s scrollers. Viewport tracks the registered
        scroller that fills the screen (
        <PartLink
          component="viewport"
          part="useCurrentScroller"
        />
        ), for example to scroll it to its top when you tap the status bar.
      </li>
      <li>
        <strong>Edge effects.</strong> The page renders <code>EdgeEffects</code>{' '}
        inside itself. At each end where a bar above it has an edge effect,
        there’s a fixed layer. It shows as content scrolls under the bar, driven
        by the page’s scroll position.
      </li>
      <li>
        <strong>Focus scroll.</strong> The page marks itself as a focus scroll
        target (<code>data-viewport-focus-scroll</code>). When you type into a
        text field in it, the page scrolls the field into view above the
        keyboard. No other scroller does.
      </li>
    </ul>

    <Heading
      id="filled-not-scrolling"
      level={2}
    >
      Filled, not scrolling
    </Heading>
    <ul>
      <li>
        With <code>fill</code>, the page isn’t a scroller. It isn’t registered,
        draws no edge effects and does no focus scroll. It clips its content and
        has no padding.
      </li>
      <li>
        A filled page passes the safe area insets on to its children. They fill
        the page and run under the bars, a map for example.
      </li>
      <li>
        Its glass mode defaults to live then, because <code>auto</code> only
        resolves for a scroller.
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
        <strong>From Viewport:</strong> the safe area insets as custom
        properties, the scroller registry, the edge effects and the focus
        scroll.
      </li>
      <li>
        <strong>From Layout:</strong> its leading inset beside a floating
        column.
      </li>
      <li>
        <strong>From Glass:</strong> its glass mode.
      </li>
      <li>
        <strong>Out:</strong> it’s the scroller for a{' '}
        <PartLink
          component="header"
          part="Header.Root"
        />
        , whose large title fades as it scrolls. It’s also the scroller for the
        pages of a{' '}
        <PartLink
          component="navigation"
          part="Navigation.Stack"
        />{' '}
        and for{' '}
        <PartLink
          component="layout"
          part="Layout.Column"
        />
        s. And it’s the current scroller that Viewport reports to your app.
      </li>
    </ul>
  </>
);
