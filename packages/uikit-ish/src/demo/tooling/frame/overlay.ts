import { useEffect } from 'react';

// The prop controls' `[overlay]` (see usePropControl): a part overlaid, its
// box hatched over it (as the safe areas are, see shared/style.css), above
// its content (a `style` alone draws below it). Marked by its style (a
// custom property), drawn in a layer of the page's (over the stage, the
// box clipped to it and to its device's screen), following the part each
// frame while any is overlaid.

/** The mark: a custom property of the part's `style`. */
export const overlayProperty = '--demo-overlay';

const marked = `[style*="${overlayProperty}"]`;

/** Clipping what's within them: a device's screen, a stage. */
const clips = ['.demo-phone, .demo-tablet', '.demo-stage'];

let overlaid = 0;
let layer: HTMLElement | undefined;
let frame: number | undefined;

const draw = () => {
  frame = requestAnimationFrame(draw);
  if (!layer) return;

  const boxes: [number, number, number, number][] = [];
  for (const element of document.querySelectorAll(marked)) {
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
      draw();
    }

    return () => {
      overlaid -= 1;
      if (overlaid > 0) return;
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
      layer?.remove();
      layer = undefined;
    };
  }, [isEnabled]);
};
