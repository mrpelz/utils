import {
  FunctionComponent,
  RefObject,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import {
  edgeElementsIn,
  holdsScroller,
  subscribeEdgeElements,
  subscribeScrollers,
} from './edge.js';
import { useEdgeEffectOf } from './padding.js';

// A scroller's scroll edge effects (iOS 26's: a scroll view's, its bars
// reaching them): one at each block edge where its scope's anchors have one
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
// `edgeTint`) shows at rest too.

type BlockEdge = 'block-start' | 'block-end';

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
      const progress = String(progressOf(element, edge));
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
    };
  }, [edge, layer, line, scroller]);
};

const Layer: FunctionComponent<{
  edge: BlockEdge;
  scroller: RefObject<HTMLElement | null>;
}> = ({ edge, scroller }) => {
  const effect = useEdgeEffectOf(edge);
  const layer = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  useMeasure(layer, line, scroller, edge);

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
