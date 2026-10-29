/* eslint-disable no-console */
/* eslint-disable no-await-in-loop -- one page, rendered one at a time */

// Makes the demo's icons from its one source (src/demo/assets/icon.svg), in
// headless Chrome (see browser-tests/lib.js): the Apple touch icon, the
// favicons (rounded), the web app manifest's icons (maskable, the source's
// content within the safe zone), and the Home Screen app's splash screens
// (light and dark, see icons-devices.js). Run after changing the source:
// make -s transform_icons

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { launchBrowser, sleep } from './browser-tests/lib.js';
import { splashes } from './icons-devices.js';

const assets = path.resolve(import.meta.dirname, '../src/demo/assets');
const output = path.join(assets, 'icons');

// The corners platforms round icons to (iOS', of their size; as CSS, a
// circular approximation of its continuous curve).
const corners = 0.2237;

// Splash screens: the icon this much of the screen's shorter side, on the
// system background.
const splashIcon = 0.25;
const backgrounds = { dark: '#000000', light: '#FFFFFF' };

const source = await readFile(path.join(assets, 'icon.svg'), 'utf8');
const content = source.replaceAll(/^<svg[^>]*>|<\/svg>\s*$/gu, '');

// The source, rounded (the favicon's).
const rounded = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <!-- Made by scripts/icons.js from icon.svg: rounded. -->
  <defs>
    <clipPath id="corners">
      <rect width="1024" height="1024" rx="${Math.round(1024 * corners)}" />
    </clipPath>
  </defs>
  <g clip-path="url(#corners)">${content}</g>
</svg>
`;

await mkdir(output, { recursive: true });
await writeFile(path.join(assets, 'icon-rounded.svg'), rounded);

const browser = await launchBrowser();

/**
 * Renders a page's body (CSS px, at a pixel ratio) to a PNG.
 *
 * @param {string} file
 * @param {string} body
 * @param {{ height: number, ratio?: number, width: number }} size
 */
const render = async (file, body, { height, ratio = 1, width }) => {
  await browser.send('Emulation.setDeviceMetricsOverride', {
    deviceScaleFactor: ratio,
    height,
    mobile: false,
    width,
  });
  await browser.send('Runtime.evaluate', {
    expression: `document.documentElement.innerHTML = ${JSON.stringify(
      `<head><style>html, body { width: 100%; height: 100%; margin: 0; } body { display: grid; place-items: center; } svg { display: block; width: 100%; height: 100%; }</style></head><body>${body}</body>`,
    )}`,
  });
  await sleep(100);
  const { data } = await browser.send('Page.captureScreenshot', {
    format: 'png',
  });
  await writeFile(path.join(output, file), Buffer.from(data, 'base64'));
  console.log(`💾 ${file}`);
};

// Transparent where it isn't drawn (the rounded ones' corners).
await browser.send('Emulation.setDefaultBackgroundColorOverride', {
  color: { a: 0, b: 0, g: 0, r: 0 },
});

// Full bleed (platforms round them).
for (const [file, size] of /** @type {const} */ ([
  ['apple-icon-180.png', 180],
  ['manifest-icon-192.maskable.png', 192],
  ['manifest-icon-512.maskable.png', 512],
])) {
  await render(file, source, { height: size, width: size });
}

await render('favicon-196.png', rounded, { height: 196, width: 196 });

for (const { file, height, isDark, ratio, width } of splashes()) {
  const size = Math.round(Math.min(width, height) * splashIcon);
  await render(
    file,
    `<div style="position: fixed; inset: 0; display: grid; place-items: center; background: ${
      isDark ? backgrounds.dark : backgrounds.light
    }"><div style="width: ${size}px; height: ${size}px">${rounded}</div></div>`,
    { height, ratio, width },
  );
}

await browser.close();
