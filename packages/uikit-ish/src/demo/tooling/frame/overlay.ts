import { useEffect } from 'react';

// The prop controls' `[overlay]` (see usePropControl): a part overlaid, its
// box hatched over it (as the safe area insets are, see shared/style.css), above
// its content (a `style` alone draws below it). Marked by its style (a
// custom property), drawn in a layer of the page's (over the stage, the
// box clipped to it and to its device's screen), following the parts each
// frame while any is overlaid. The marked elements (however many: a part's
// style may land on several) are found once, then kept as their styles
// and the page change (a mutation observer), not looked for every frame.

/** The mark: a custom property of the part's `style`. */
export const overlayProperty = '--demo-overlay';

const marked = `[style*="${overlayProperty}"]`;

/** Clipping what's within them: a device's screen, a stage. */
const clips = ['.demo-phone, .demo-tablet', '.demo-stage'];

let overlaid = 0;
let layer: HTMLElement | undefined;
let frame: number | undefined;

/** The elements marked now (see `watch`). */
const marks = new Set<Element>();
let observer: MutationObserver | undefined;

/** An element's marked descendants (and itself), added. */
const addMarked = (node: Node) => {
  if (!(node instanceof Element)) return;
  if (node.matches(marked)) marks.add(node);
  for (const element of node.querySelectorAll(marked)) marks.add(element);
};

/**
 * Keeps `marks`: the page's marked elements at once, then as styles change
 * (marked, or not anymore) and elements are added. (Removed ones, dropped
 * as they're drawn: no longer connected.)
 */
const watch = () => {
  addMarked(document.documentElement);
  observer = new MutationObserver((records) => {
    for (const { addedNodes, target, type } of records) {
      if (type === 'childList') {
        for (const node of addedNodes) addMarked(node);
        continue;
      }
      // (Not the layer's own boxes, restyled every frame.)
      if (!(target instanceof Element) || target.parentElement === layer) {
        continue;
      }
      if (target.matches(marked)) marks.add(target);
      else marks.delete(target);
    }
  });
  observer.observe(document.documentElement, {
    attributeFilter: ['style'],
    attributes: true,
    childList: true,
    subtree: true,
  });
};

const unwatch = () => {
  observer?.disconnect();
  observer = undefined;
  marks.clear();
};

const draw = () => {
  frame = requestAnimationFrame(draw);
  if (!layer) return;

  const boxes: [number, number, number, number][] = [];
  for (const element of marks) {
    if (!element.isConnected) {
      marks.delete(element);
      continue;
    }
    let { bottom, left, right, top } = element.getBoundingClientRect();
    for (const clip of clips) {
      const container = element.closest(clip);
      if (!container) continue;
      const rect = container.getBoundingClientRect();
      left = Math.max(left, rect.left);
      top = Math.max(top, rect.top);
      right = Math.min(right, rect.right);
      bottom = Math.min(bottom, rect.bottom);
    }
    if (right > left && bottom > top) {
      boxes.push([left, top, right - left, bottom - top]);
    }
  }

  while (layer.children.length < boxes.length) {
    layer.append(document.createElement('div'));
  }
  for (const [index, child] of [...layer.children].entries()) {
    const box = boxes[index];
    const { style } = child as HTMLElement;
    style.display = box ? '' : 'none';
    if (!box) continue;
    const [x, y, width, height] = box;
    style.transform = `translate(${x}px, ${y}px)`;
    style.width = `${width}px`;
    style.height = `${height}px`;
  }
};

/** A part overlaid while mounted (and `enabled`): the layer drawn. */
export const useOverlay = (isEnabled: boolean): void => {
  useEffect(() => {
    if (!isEnabled) return undefined;

    overlaid += 1;
    if (overlaid === 1) {
      layer = document.createElement('div');
      layer.className = 'demo-overlay';
      document.body.append(layer);
      watch();
      draw();
    }

    return () => {
      overlaid -= 1;
      if (overlaid > 0) return;
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
      unwatch();
      layer?.remove();
      layer = undefined;
    };
  }, [isEnabled]);
};
