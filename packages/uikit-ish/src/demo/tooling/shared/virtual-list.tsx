import {
  FunctionComponent,
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

type Slots = {
  /** Each slot's height, as last measured while its demo was mounted. */
  heights: readonly (number | undefined)[];
  /** Whether each slot is near the screen (its demo mounted). */
  near: readonly boolean[];
};

const same = (a: Slots, b: Slots) =>
  a.near.length === b.near.length &&
  a.near.every(
    (isNear, index) =>
      isNear === b.near[index] && a.heights[index] === b.heights[index],
  );

/**
 * A page of demos, each rendered only while near the screen (a screen above
 * or below it): every demo is at least a screen high, so a few are mounted
 * at a time. Away, a slot keeps the demo's height (as last measured; a
 * screen until then), so scrolling and snapping don't jump.
 *
 * Which are near is read from the slots' boxes after every render (and on
 * scroll and resize, once a frame): a demo rendering nothing (another than
 * the URL's `#id=`) collapses its slot, bringing the next ones near in the
 * same frame, until the one shown fills the screen.
 */
export const VirtualList: FunctionComponent<{
  /**
   * Its slots away from the screen are snap points, as the demos they stand
   * for (none for raw demos, without a frame snapping).
   */
  isSnapPoint: boolean;
  items: readonly ReactNode[];
}> = ({ items, isSnapPoint }) => {
  const elements = useRef<(HTMLDivElement | null)[]>([]);
  const [slots, setSlots] = useState<Slots>({ heights: [], near: [] });

  const update = useCallback(() => {
    const { innerHeight } = window;
    setSlots((current) => {
      const heights = [...current.heights];
      const near = elements.current.map((element, index) => {
        if (!element) return false;
        const { bottom, height, top } = element.getBoundingClientRect();
        // (Mounted: its height, kept for when it's away.)
        if (current.near[index]) heights[index] = height;
        return bottom >= -innerHeight && top <= 2 * innerHeight;
      });
      const next = { heights, near };
      return same(current, next) ? current : next;
    });
  }, []);

  // After every render (a collapsed slot brings the next ones near).
  useLayoutEffect(update);

  useEffect(() => {
    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
    };
  }, [update]);

  return items.map((item, index) => {
    const isMounted = slots.near[index] ?? false;
    const height = slots.heights[index];

    // Its state as attributes: away (not mounted; e.g. for tests, waiting
    // until none is), a snap point while away (not collapsed).
    return (
      <div
        key={index}
        ref={(element) => {
          elements.current[index] = element;
        }}
        className="demo-virtual-slot"
        data-away={isMounted ? undefined : ''}
        data-snap={isSnapPoint && !isMounted && height !== 0 ? '' : undefined}
        style={isMounted ? undefined : { height: height ?? '100svh' }}
      >
        {isMounted ? item : null}
      </div>
    );
  });
};
