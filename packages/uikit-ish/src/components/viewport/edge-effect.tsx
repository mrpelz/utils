import {
  FunctionComponent,
  RefObject,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { usePortalContainer } from '../utils/main.js';
import {
  edgeElementsIn,
  holdsScroller,
  subscribeEdgeElements,
  subscribeScrollers,
} from './edge.js';
import { isIos27, ViewportInsetContext } from './ios27.js';
import { useEdgeEffectOf } from './padding.js';

// A scroller's scroll edge effects (its bars reaching them): one at each block edge where its scope's anchors have one
// (see `Anchor`'s `edgeEffect`), drawn by the scroller (`Page.Root`, a
// sheet's content, the content layer: within it, fixed at its edge, as the
// anchors are, beneath them), as tall as the tallest of them; one, however
// many anchors stack there; none while it holds another (e.g. the content
// layer a page: the page's alone). It shows as content scrolls under the bars
// (`--uikit-viewport-edge-progress`, 0 to 1: over the first `ramp` px past
// the start, the last before the end), reaching beyond them under what's
// stuck to them (`useViewportEdgeElement`, `--uikit-viewport-edge-extent`):
// measured as the scroller scrolls (a listener: a scroll-driven animation
// there ends the scroller's fling, in Chrome). Its tint (an anchor's
// `edgeTint`) shows at rest too. A hard one's backing, untinted, its
// scroller's own background (`--uikit-viewport-edge-backing`, read from it:
// matching the page, as its background changes), or, the scroller without
// one, the system background. On iOS 27, at the screen's top (see ios27.ts),
// the status bar's color instead: the page's background as it loaded (iOS
// reading it once), so the two bars meet; the page's background then
// another (e.g. another page shown), solid at rest too, as a tinted one
// (`data-edge-solid`), its line dividing the bars from the page.

type BlockEdge = 'block-start' | 'block-end';

/**
 * On a scroller: its start's progress (see `progressOf`), for its own
 * styles (its edge effect's on the effect).
 */
const startProgress = '--uikit-viewport-edge-start-progress';

/** How far content scrolls under the bars for the effect to show (px). */
const ramp = 16;

/**
 * How far content's scrolled under an edge's bars, 0 to 1 (see `ramp`); a
 * pixel's none (a page bouncing always scrolls by one, see Page).
 */
const progressOf = (scroller: Element, edge: BlockEdge) => {
  const range = scroller.scrollHeight - scroller.clientHeight;
  const under =
    edge === 'block-start' ? scroller.scrollTop : range - scroller.scrollTop;
  return Math.min(Math.max((under - 1) / ramp, 0), 1);
};

/**
 * Its progress (see `progressOf`), and how far beyond the bars the edge
 * elements stuck to them reach (px, from the bars' inner side, `line`):
 * measured as the scroller scrolls or resizes, and as they change.
 */
const useMeasure = (
  layer: RefObject<HTMLDivElement | null>,
  line: RefObject<HTMLDivElement | null>,
  scroller: RefObject<HTMLElement | null>,
  edge: BlockEdge,
) => {
  useLayoutEffect(() => {
    const { current: element } = scroller;
    if (!element) return undefined;
    let frame = 0;
    let written = '';

    const measure = () => {
      frame = 0;
      const progress = String(progressOf(element, edge));
      // (Also the scroller's, at its start: e.g. a sheet's content masked
      // under its header as far, see Sheet.)
      if (edge === 'block-start') {
        element.style.setProperty(startProgress, progress);
      }
      const { current: target } = layer;
      const lineRect = line.current?.getBoundingClientRect();
      if (!target || !lineRect) return;
      let extent = 0;
      for (const stuck of edgeElementsIn(element, edge)) {
        const box = stuck.getBoundingClientRect();
        if (edge === 'block-start' && box.top <= lineRect.top + 1) {
          extent = Math.max(extent, box.bottom - lineRect.top);
        }
        if (edge === 'block-end' && box.bottom >= lineRect.top - 1) {
          extent = Math.max(extent, lineRect.top - box.top);
        }
      }
      const value = `${String(Math.round(extent))}px`;
      if (`${progress} ${value}` === written) return;
      written = `${progress} ${value}`;
      target.style.setProperty('--uikit-viewport-edge-progress', progress);
      target.style.setProperty('--uikit-viewport-edge-extent', value);
    };
    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(measure);
    };

    measure();
    element.addEventListener('scroll', schedule, { passive: true });
    const observer = new ResizeObserver(schedule);
    observer.observe(element);
    const unsubscribe = subscribeEdgeElements(schedule);
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener('scroll', schedule);
      observer.disconnect();
      unsubscribe();
      if (edge === 'block-start') element.style.removeProperty(startProgress);
    };
  }, [edge, layer, line, scroller]);
};

/** A background color painting nothing (`transparent`, alpha 0). */
const isClear = (color: string) =>
  color === 'transparent' ||
  (color.startsWith('rgba(') && color.replaceAll(' ', '').endsWith(',0)'));

/** An element's background color (computed; painting nothing, empty). */
const backgroundOf = (element: Element) => {
  const color = getComputedStyle(element).backgroundColor;
  return isClear(color) ? '' : color;
};

/**
 * The background showing behind an element: its own, or else the nearest
 * ancestor's painting one (e.g. a content layer's, clear, in an app's
 * element with a background of its own); none, empty.
 */
const shownBackgroundOf = (element: Element) => {
  for (
    let node: Element | null = element;
    node !== null;
    node = node.parentElement
  ) {
    const color = backgroundOf(node);
    if (color !== '') return color;
  }
  return '';
};

/**
 * On iOS 27, the status bar's color (see above): the background shown
 * behind the first page at the screen's top (see `shownBackgroundOf`), read
 * as its bars first show (the scroller holding none: the page's, not the
 * content layer's).
 */
let statusBarColor: string | undefined;

/**
 * The scroller's own background (computed: its class's, its style's, its
 * color scheme's) on the layer, as `--uikit-viewport-edge-backing` (a hard
 * effect's backing, see style.css); none painted, none set. At the status
 * bar (`isUnderStatusBar`, see above), the status bar's color instead, and
 * the scroller's another, solid at rest (`data-edge-solid`). Read again as
 * the scroller's attributes change (its inline background, not its other
 * styles: written as it scrolls), a color scheme's set within the
 * document, or the system's color scheme or contrast changes.
 */
const useBacking = (
  layer: RefObject<HTMLDivElement | null>,
  scroller: RefObject<HTMLElement | null>,
  isHard: boolean,
  isUnderStatusBar: boolean,
) => {
  useLayoutEffect(() => {
    const { current: element } = scroller;
    if (element && isUnderStatusBar && !holdsScroller(element)) {
      statusBarColor ??= shownBackgroundOf(element);
    }
    const { current: target } = layer;
    if (!element || !target || !isHard) return undefined;
    let inline = '';
    let frame = 0;

    const read = () => {
      frame = 0;
      inline = element.style.background + element.style.backgroundColor;
      // (At the status bar: its color, against what's shown behind the
      // scroller, its own or an ancestor's; else the scroller's own.)
      const isPinned = isUnderStatusBar && statusBarColor !== undefined;
      const color = isPinned
        ? shownBackgroundOf(element)
        : backgroundOf(element);
      const backing = isPinned ? (statusBarColor ?? '') : color;
      if (backing === '') {
        target.style.removeProperty('--uikit-viewport-edge-backing');
      } else {
        target.style.setProperty('--uikit-viewport-edge-backing', backing);
      }
      target.toggleAttribute('data-edge-solid', backing !== color);
    };
    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(read);
    };

    read();
    const own = new MutationObserver((records) => {
      const isStyleOnly = records.every(
        ({ attributeName }) => attributeName === 'style',
      );
      if (
        isStyleOnly &&
        element.style.background + element.style.backgroundColor === inline
      ) {
        return;
      }
      schedule();
    });
    own.observe(element, { attributes: true });
    const schemes = new MutationObserver(schedule);
    schemes.observe(document.documentElement, {
      attributeFilter: ['data-color-scheme'],
      subtree: true,
    });
    const queries = [
      matchMedia('(prefers-color-scheme: dark)'),
      matchMedia('(prefers-contrast: more)'),
    ];
    for (const query of queries) query.addEventListener('change', schedule);
    return () => {
      cancelAnimationFrame(frame);
      own.disconnect();
      schemes.disconnect();
      for (const query of queries) {
        query.removeEventListener('change', schedule);
      }
      target.style.removeProperty('--uikit-viewport-edge-backing');
      delete target.dataset.edgeSolid;
    };
  }, [isHard, isUnderStatusBar, layer, scroller]);
};

const Layer: FunctionComponent<{
  edge: BlockEdge;
  scroller: RefObject<HTMLElement | null>;
}> = ({ edge, scroller }) => {
  const effect = useEdgeEffectOf(edge);
  const layer = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  // (At the screen's top, on iOS 27: as `Anchor` tells, see ios27.ts.)
  const isInset = useContext(ViewportInsetContext);
  const portalContainer = usePortalContainer(undefined);
  const isUnderStatusBar =
    edge === 'block-start' &&
    !isInset &&
    portalContainer === undefined &&
    isIos27();
  useMeasure(layer, line, scroller, edge);
  useBacking(layer, scroller, effect?.effect === 'hard', isUnderStatusBar);

  if (!effect) return null;

  return (
    <div
      ref={layer}
      aria-hidden="true"
      className="uikit-viewport-edge-effect"
      data-edge={edge}
      data-edge-effect={effect.effect}
      data-edge-tinted={effect.tint ? '' : undefined}
      data-keyboard={effect.keyboard}
      data-viewport-part="edge-effect"
      style={{
        '--uikit-viewport-edge-size': `${String(effect.size)}px`,
        '--uikit-viewport-edge-tint': effect.tint,
      }}
    >
      <div
        ref={line}
        className="uikit-viewport-edge-line"
      />
    </div>
  );
};

/**
 * A scroller's edge effects (see above): render it in the scroller,
 * given its element (internal; `Page.Root`'s, a sheet's content's, the
 * content layer's).
 */
export const EdgeEffects: FunctionComponent<{
  scroller: RefObject<HTMLElement | null>;
}> = ({ scroller }) => {
  const [isHolding, setHolding] = useState(false);

  useLayoutEffect(() => {
    const resolve = () => {
      const { current: element } = scroller;
      setHolding(element ? holdsScroller(element) : false);
    };
    resolve();
    return subscribeScrollers(resolve);
  }, [scroller]);

  if (isHolding) return null;

  return (
    <>
      <Layer
        edge="block-start"
        scroller={scroller}
      />
      <Layer
        edge="block-end"
        scroller={scroller}
      />
    </>
  );
};
