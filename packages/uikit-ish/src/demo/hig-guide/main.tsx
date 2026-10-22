import { useLocation } from 'preact-iso';
import { FunctionComponent, useEffect } from 'react';

import { guideHref } from './link.js';
import { Hig } from './parts.js';
import { Section1, Section2, Section3 } from './sections-1-3.js';
import { Section4, Section5 } from './sections-4-5.js';
import { Section6, Section7 } from './sections-6-7.js';
import { Appendix, Section8, Section9, Section10 } from './sections-8-10.js';

const contents: readonly (readonly [string, string])[] = [
  ['section-1', 'Apple’s catalog at a glance'],
  ['section-2', 'How Apple intends components to compose'],
  ['section-3', 'Where Apple’s slicing is legacy-driven'],
  ['section-4', 'A shared trait vocabulary'],
  ['section-5', 'Proposal: re-slicing into primitives'],
  ['section-6', 'Composition grammar'],
  ['section-7', 'Composing an entire app navigation'],
  ['section-8', 'Other whole-app compositions'],
  ['section-9', 'Where Apple’s split is actually justified'],
  ['section-10', 'Open questions'],
  ['section-appendix', 'Appendix: link index'],
];

// Whether the history navigated last (back, forward): the page goes back to
// where it was then, not to its anchor. A click (following a link) is a
// navigation of the app's own.
let popped = false;
if (typeof addEventListener === 'function') {
  addEventListener('popstate', () => {
    popped = true;
  });
  addEventListener(
    'click',
    () => {
      popped = false;
    },
    { capture: true },
  );
}

/**
 * As the history navigates back or forward, scrolls to where the page was:
 * the browser's own restoring comes too early (before the page is rendered
 * again) and falls back to the anchor, so the position is kept in the
 * history entry's state. (Links to its anchors scroll as any page's do: see
 * main.tsx.)
 */
const useScrollPosition = () => {
  const { url } = useLocation();

  useEffect(() => {
    const { guideScrollY } = (history.state ?? {}) as {
      guideScrollY?: number;
    };

    const timeout = setTimeout(() => {
      if (popped && guideScrollY !== undefined) {
        scrollTo(0, guideScrollY);
      }
    });

    // Kept as it changes (once a frame).
    let frame: number | undefined;
    const onScroll = () => {
      frame ??= requestAnimationFrame(() => {
        frame = undefined;
        history.replaceState(
          { ...(history.state as object | null), guideScrollY: scrollY },
          '',
        );
      });
    };
    addEventListener('scroll', onScroll, { passive: true });

    return () => {
      clearTimeout(timeout);
      if (frame !== undefined) cancelAnimationFrame(frame);
      removeEventListener('scroll', onScroll);
    };
  }, [url]);
};

/**
 * `/hig-guide`: “Apple HIG Components — Composition, Shared Traits & a
 * Re-Slicing”, the study the index's categories and the components'
 * information architecture pages are after; its sections, rules, primitives
 * and figures anchored (see link.tsx).
 */
export const HigGuidePage: FunctionComponent = () => {
  useScrollPosition();

  return (
    <div className="demo-page demo-prose">
      <nav className="demo-page-nav">
        <a href="./">uikit-ish</a> › Guide
      </nav>
      <h1 className="demo-page-title">
        Apple HIG Components — Composition, Shared Traits &amp; a Re-Slicing
      </h1>
      <p className="demo-lead">
        A meta-level study of the components in Apple’s Human Interface
        Guidelines: how Apple intends them to fit together, which traits they
        share underneath their platform-specific names, and how the catalog
        could be cut along different seams to remove duplication. Ends with how
        whole app navigation is composed from the resulting primitives.
      </p>
      <blockquote>
        <p>
          <strong>Source:</strong> <Hig page="components">HIG → Components</Hig>{' '}
          and the individual component pages linked throughout. Catalog reflects
          the Liquid Glass–era HIG (2025/26). Apple reorganizes pages
          occasionally (e.g. navigation bars are now covered under Toolbars), so
          treat category membership as a snapshot.
        </p>
        <p>
          <strong>Stance:</strong> Descriptive where it says “Apple”.
          Opinionated where it says “proposal”. No implementation detail — this
          is about concepts, not APIs.
        </p>
      </blockquote>

      <h2 id="contents">Contents</h2>
      <ol>
        {contents.map(([id, title]) => (
          <li key={id}>
            <a href={guideHref(id)}>{title}</a>
          </li>
        ))}
      </ol>

      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section6 />
      <Section7 />
      <Section8 />
      <Section9 />
      <Section10 />
      <Appendix />
    </div>
  );
};
