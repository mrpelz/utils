/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { commonPropOptions, MappedProp } from '../frame/prop-control.js';

/** A placeholder photo (a gradient, a head and shoulders). */
export const photo = (hue: number) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 70"><defs><linearGradient id="g" x2="0" y2="1"><stop offset="0" stop-color="hsl(${String(hue)} 70% 75%)"/><stop offset="1" stop-color="hsl(${String(hue + 30)} 60% 45%)"/></linearGradient></defs><rect width="70" height="70" fill="url(#g)"/><circle cx="35" cy="28" r="13" fill="#fff" fill-opacity=".85"/><ellipse cx="35" cy="66" rx="24" ry="20" fill="#fff" fill-opacity=".85"/></svg>`,
  )}`;

export const propOptionsRoot = {
  ...commonPropOptions,
  size: [undefined, 50, 100] as const,
};

export const propOptionsImage = {
  src: [
    new MappedProp(photo(200), '[photo]'),
    undefined,
    new MappedProp('broken.png', '[broken: initials]'),
  ] as const,
};

export const propOptionsContent = {
  // Its fallback's content (the app's: e.g. a person's initials).
  initials: ['AK', 'S', 'GF'] as const,
  badge: [false, true] as const,
  // A group: 2 or 3 people in one circle.
  people: [1, 2, 3] as const,
};
