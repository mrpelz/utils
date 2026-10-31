/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */

// The iPhones' and iPads' screens (portrait, CSS px, and their pixel ratio),
// for the Home Screen app's splash screens (`apple-touch-startup-image`):
// made by scripts/icons.js, linked from the demo's head (see
// scripts/demo-head.js). As pwa-asset-generator's (see iot-webinterface).

/** @type {readonly (readonly [number, number, number])[]} */
export const devices = [
  [1024, 1366, 2],
  [834, 1194, 2],
  [768, 1024, 2],
  [820, 1180, 2],
  [834, 1112, 2],
  [810, 1080, 2],
  [744, 1133, 2],
  [440, 956, 3],
  [402, 874, 3],
  [420, 912, 3],
  [430, 932, 3],
  [393, 852, 3],
  [390, 844, 3],
  [428, 926, 3],
  [375, 812, 3],
  [414, 896, 3],
  [414, 896, 2],
  [414, 736, 3],
  [375, 667, 2],
  [320, 568, 2],
];

/**
 * @typedef {{
 *   file: string,
 *   height: number,
 *   isDark: boolean,
 *   media: string,
 *   ratio: number,
 *   width: number,
 * }} Splash
 */

/**
 * Every splash screen: each device's, portrait and landscape, light and
 * dark (its CSS size, its file, its media query).
 *
 * @returns {Splash[]}
 */
export const splashes = () => {
  /** @type {Splash[]} */
  const result = [];
  for (const [portraitWidth, portraitHeight, ratio] of devices) {
    for (const orientation of ['portrait', 'landscape']) {
      const isPortrait = orientation === 'portrait';
      const width = isPortrait ? portraitWidth : portraitHeight;
      const height = isPortrait ? portraitHeight : portraitWidth;
      const size = `${width * ratio}-${height * ratio}`;
      const media = `(device-width: ${portraitWidth}px) and (device-height: ${portraitHeight}px) and (-webkit-device-pixel-ratio: ${ratio}) and (orientation: ${orientation})`;

      for (const isDark of [false, true]) {
        result.push({
          file: `apple-splash-${isDark ? 'dark-' : ''}${size}.png`,
          height,
          isDark,
          media: `${media} and (prefers-color-scheme: ${isDark ? 'dark' : 'light'})`,
          ratio,
          width,
        });
      }
    }
  }

  return result;
};
