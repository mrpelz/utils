import {
  Component,
  createContext,
  type ReactNode,
  type RefObject,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { reducedMotionOf } from '../utils/main.js';
import { reflowDuration, reflowEasing } from './layout.js';
import type {
  GridItemLayoutChange,
  GridItemLayoutHandlers,
  GridSize,
} from './props.js';

// An item's tile getting to a new box (its size changed, e.g. expanded in
// place; its place in its area; opened above the page, closed): laid out
// there at once, drawn from its old box to its new one by its grid's
// reflow timing (an animation of its size, and of a translate added to
// its own). What's in it may lay itself out at its new size from the
// start: the size it's getting to is on it meanwhile
// (`--uikit-grid-tile-width`/`-height`, e.g. a card's frame, see Card).
// Not while its grid's editing (resized there as tiles are: outlined, then
// at once), nor with reduced motion.
//
// What's in it hears of it (`useGridItemLayout`): before the change
// reaches the DOM (a class's snapshot: before any of it, in React and
// Preact alike), and once it's there, its tile still drawn at its old box;
// e.g. for an animation library to move its own parts from where they
// were (in its tile: the tile's own move is the grid's).

/** What an item's tile is drawn by (see the top). */
type Shape = {
  area: string;
  editing: boolean;
  open: boolean;
  placement: string;
  size: GridSize;
};

/** A shape's key: what's compared to tell a change. */
const keyOf = ({ area, open, placement, size }: Shape) =>
  `${area}/${placement}/${size}/${String(open)}`;

/** The handlers what's in an item registered (see `useGridItemLayout`). */
type Registry = Set<RefObject<GridItemLayoutHandlers>>;

const GridItemLayoutContext = createContext<Registry | undefined>(undefined);

export const GridItemLayoutProvider = GridItemLayoutContext.Provider;

/**
 * Calls the handlers as its item's tile changes its box (see the top):
 * `onBeforeChange` before the change reaches the DOM, `onAfterChange`
 * once it's there, its tile still drawn at its old box. Neither while its
 * grid's editing nor with reduced motion (nothing moves then). Inside a
 * `Grid.Item` only; the latest handlers are called (no need to keep them
 * stable).
 */
export const useGridItemLayout = (handlers: GridItemLayoutHandlers): void => {
  const registry = useContext(GridItemLayoutContext);
  const latest = useRef(handlers);
  useLayoutEffect(() => {
    latest.current = handlers;
  });
  useLayoutEffect(() => {
    if (!registry) return undefined;
    registry.add(latest);
    return () => {
      registry.delete(latest);
    };
  }, [registry]);
};

type SnapshotProps = {
  children?: ReactNode;
  /** Called before a change of its shape reaches the DOM. */
  onChange: (previous: Shape, next: Shape) => void;
  shape: Shape;
};

/**
 * Its item's shape before a change reaches the DOM (`onChange`): a class's
 * snapshot, before any of its DOM changes (React's for all of a commit;
 * Preact's before its children's, so it's what its item renders first).
 */
export class ShapeSnapshot extends Component<SnapshotProps> {
  // (A snapshot's taken only with this, in React.)

  override componentDidUpdate(): void {
    // (Nothing: the item's layout effect takes it from there.)
  }

  override getSnapshotBeforeUpdate(previous: Readonly<SnapshotProps>): null {
    if (keyOf(previous.shape) !== keyOf(this.props.shape)) {
      this.props.onChange(previous.shape, this.props.shape);
    }
    return null;
  }

  override render(): ReactNode {
    return this.props.children;
  }
}

/** A reshape's animations' id (see `reshape`). */
const reshapeId = 'uikit-grid-reshape';

const px = (value: number) => `${String(value)}px`;

const sizeVariables = ['--uikit-grid-tile-width', '--uikit-grid-tile-height'];

/**
 * Animations started a frame after the next (held at their start until
 * then): from where they're first drawn, however long the change's own
 * task took (what's in the tile laying itself out, an app's measuring).
 * Not with the next: after a long task, its time is the one it was
 * scheduled for (in Chrome), far along already. Not those given up
 * meanwhile.
 */
export const startWithFrame = (...animations: readonly Animation[]): void => {
  for (const animation of animations) animation.pause();
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      // (Started now, not pending a frame: their time read at once, e.g.
      // by what follows the tile's, see `elapsed`.)
      const now = document.timeline.currentTime;
      for (const animation of animations) {
        if (animation.playState === 'paused') animation.startTime = now;
      }
    }),
  );
};

/**
 * A tile drawn from its old box (`from`) to the one it's laid out at now
 * (see the top), above what's around it meanwhile; what moved it before
 * (a reshape, its grid's reflow gliding it or its cell) given up, `from`
 * being where those drew it. Its box now, once that's stopped.
 */
const reshape = (
  body: HTMLElement,
  cell: HTMLElement,
  from: DOMRectReadOnly,
) => {
  for (const each of [body, cell]) {
    for (const animation of each.getAnimations()) animation.cancel();
  }
  const to = body.getBoundingClientRect();
  body.style.setProperty(sizeVariables[0] ?? '', px(to.width));
  body.style.setProperty(sizeVariables[1] ?? '', px(to.height));
  body.dataset.gridReshaping = '';
  cell.dataset.gridReshaping = '';
  const timing = {
    duration: reflowDuration,
    easing: reflowEasing,
    id: reshapeId,
  } as const;
  const sizing = body.animate(
    [
      { height: px(from.height), width: px(from.width) },
      { height: px(to.height), width: px(to.width) },
    ],
    timing,
  );
  // (Where its old size puts it, laid out where it is now (e.g. centered
  // in its area): moved from there to where it was.)
  const at = body.getBoundingClientRect();
  const moving = body.animate(
    [
      { translate: `${px(from.left - at.left)} ${px(from.top - at.top)}` },
      { translate: '0 0' },
    ],
    { ...timing, composite: 'add' },
  );
  startWithFrame(sizing, moving);
  return [to, sizing] as const;
};

/**
 * A tile reshaped no more (see `reshape`): its size gone; still marked as
 * its grid's reflow hears of that (a microtask, before this one), so it
 * records where it's settled without gliding it there (its place, laid
 * out at another size meanwhile, e.g. centered in its area, recorded off
 * it).
 */
const settle = (body: HTMLElement, cell: HTMLElement) => {
  for (const name of sizeVariables) body.style.removeProperty(name);
  queueMicrotask(() => {
    delete body.dataset.gridReshaping;
    delete cell.dataset.gridReshaping;
  });
};

/**
 * An item's tile reshaped (see the top): its snapshot's `onChange` and its
 * registry (for its `GridItemLayoutProvider`); `onSettled` called once
 * it's there (at once when it isn't drawn getting there). Call after what
 * places its tile (e.g. its overlay's), in the same component.
 */
export const useReshape = ({
  body,
  cell,
  onSettled,
}: {
  body: RefObject<HTMLElement | null>;
  cell: RefObject<HTMLElement | null>;
  onSettled: () => void;
}): readonly [
  onChange: (previous: Shape, next: Shape) => void,
  registry: Registry,
] => {
  const [registry] = useState<Registry>(() => new Set());
  // (A change on its way to the DOM: drawn getting there, or not.)
  const pending = useRef<
    false | { change: GridItemLayoutChange; from: DOMRectReadOnly } | undefined
  >(undefined);
  const latest = useRef(onSettled);
  useLayoutEffect(() => {
    latest.current = onSettled;
  });
  // (Shown for a frame: before that, what changes is it being set up (e.g.
  // its area joining it), not a change to show.)
  const isShown = useRef(false);
  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      isShown.current = true;
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const onChange = (previous: Shape, next: Shape) => {
    // (Read as it's called: before the change, see `ShapeSnapshot`.)
    const element = body.current;
    if (
      !element ||
      !isShown.current ||
      (previous.editing && next.editing) ||
      reducedMotionOf(element).matches
    ) {
      pending.current = false;
      return;
    }
    const from = element.getBoundingClientRect();
    const change: GridItemLayoutChange = {
      duration: reflowDuration,
      easing: reflowEasing,
      elapsed: () => 0,
      from,
      open: next.open,
      previousOpen: previous.open,
      previousSize: previous.size,
      size: next.size,
      to: from,
    };
    pending.current = { change, from };
    for (const handlers of registry) handlers.current.onBeforeChange?.(change);
  };

  // (Its change in the DOM: drawn from where it was, what's in it told.)
  const generation = useRef(0);
  useLayoutEffect(() => {
    const held = pending.current;
    pending.current = undefined;
    const element = body.current;
    const item = cell.current;
    if (held === undefined) return;
    if (!held || !element || !item) {
      latest.current();
      return;
    }
    generation.current += 1;
    const current = generation.current;
    const [to, sizing] = reshape(element, item, held.from);
    sizing.addEventListener('finish', () => {
      if (current !== generation.current) return;
      settle(element, item);
      latest.current();
    });
    sizing.addEventListener('cancel', () => {
      if (current === generation.current) settle(element, item);
    });
    const change = {
      ...held.change,
      elapsed: () => {
        const time = sizing.currentTime;
        return typeof time === 'number' ? time : reflowDuration;
      },
      to,
    };
    for (const handlers of registry) handlers.current.onAfterChange?.(change);
  });

  return [onChange, registry] as const;
};
