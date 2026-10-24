import { RefObject, useEffect } from 'react';

import {
  ColorScheme,
  colorSchemeAttribute,
} from '../../components/utils/main.js';

// A demo's color scheme setting is its stage's (`colorSchemeAttribute` on
// it, see Component); popups portaled out of it (into the body, Base UI's
// default container) follow it, too: each portal takes the scheme of the
// stage it's over (its content's center within the stage's box), as it's
// added, as a stage's scheme changes, and as the page scrolls or resizes.
// (The DOM doesn't tell which demo a portal is of, the page's layout does:
// a popup is shown at what opened it.)

/** The stages, by their element: their color schemes (forced, or none). */
const stages = new Map<HTMLElement, ColorScheme | undefined>();

/** The body's portals (Base UI's), their schemes set here. */
const portals = () =>
  document.querySelectorAll<HTMLElement>('body > [data-base-ui-portal]');

/** A portal's content's center (its first element shown). */
const centerOf = (portal: HTMLElement): [number, number] | undefined => {
  for (const element of portal.querySelectorAll('*')) {
    const { height, width, x, y } = element.getBoundingClientRect();
    if (width > 0 && height > 0) return [x + width / 2, y + height / 2];
  }

  return undefined;
};

const update = () => {
  for (const portal of portals()) {
    const center = centerOf(portal);
    let scheme: ColorScheme | undefined;

    if (center) {
      const [x, y] = center;
      for (const [stage, stageScheme] of stages) {
        const rect = stage.getBoundingClientRect();
        if (
          x >= rect.left &&
          x <= rect.right &&
          y >= rect.top &&
          y <= rect.bottom
        ) {
          scheme = stageScheme;
          break;
        }
      }
    }

    if (!scheme) {
      portal.removeAttribute(colorSchemeAttribute);
      continue;
    }

    portal.setAttribute(colorSchemeAttribute, scheme);
  }
};

// (Once a frame at most; a frame later still, as a popup is positioned
// after it's added.)
let frame: number | undefined;
const schedule = () => {
  frame ??= requestAnimationFrame(() => {
    frame = requestAnimationFrame(() => {
      frame = undefined;
      update();
    });
  });
};

let observer: MutationObserver | undefined;

const start = () => {
  observer = new MutationObserver(schedule);
  observer.observe(document.body, { childList: true });
  addEventListener('scroll', schedule, { capture: true, passive: true });
  addEventListener('resize', schedule, { passive: true });
};

const stop = () => {
  observer?.disconnect();
  observer = undefined;
  removeEventListener('scroll', schedule, { capture: true });
  removeEventListener('resize', schedule);
  for (const portal of portals()) {
    portal.removeAttribute(colorSchemeAttribute);
  }
};

/**
 * A stage's color scheme, for the body's portals over it (see above): kept
 * while the stage is mounted (and while any stage is, the portals are
 * watched).
 */
export const usePortalColorScheme = (
  stage: RefObject<HTMLElement | null>,
  scheme: ColorScheme | undefined,
): void => {
  useEffect(() => {
    const { current: element } = stage;
    if (!element) return undefined;

    if (stages.size === 0) start();
    stages.set(element, scheme);
    schedule();

    return () => {
      stages.delete(element);
      if (stages.size === 0) {
        stop();
      } else {
        schedule();
      }
    };
  }, [scheme, stage]);
};
