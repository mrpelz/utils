/* eslint-disable no-console */

// eslint-disable-next-line spaced-comment
/// <reference types="node" />

import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { exit } from 'node:process';

import prerender, { locationStub } from 'preact-iso/prerender';

import { ios27BlurPaths } from './demo/ios27-blur/variants.js';
import { publicPath } from './demo/tooling/env.js';
import { iconsLoaded } from './demo/tooling/icons.js';
import { Demo } from './demo/tooling/main.js';
import { publicUrl } from './demo/tooling/public-url.js';

const BODY = '<body></body>';
const KITCHEN_SINK_PATH = 'kitchen-sink';

const demoDir = path.resolve(process.cwd(), 'demo');

const templatePath = path.join(demoDir, 'template.html');
if (!existsSync(templatePath)) {
  exit(1);
}

const template = await readFile(templatePath, { encoding: 'utf8' });
if (!template.includes(BODY)) {
  exit(1);
}

// (Its icons first, see demo/tooling/icons.ts.)
await iconsLoaded;

const handled = new Set<string>();

const render = async (location: string) => {
  // Its path on the site (its output directory's, the output served at the
  // public path), and its URL (under the public path, as its links are).
  const suffixedLocation = path.join(location, './');
  const prefixedLocation = publicUrl(suffixedLocation);

  const outputDir = path.join(demoDir, '.', suffixedLocation);
  if (handled.has(outputDir)) return undefined;

  handled.add(outputDir);

  locationStub(prefixedLocation);
  const { html, links } = await prerender(<Demo />);

  console.log(
    `✅ prerendered "${suffixedLocation}" (prefixed: "${prefixedLocation}")\n  for "${outputDir}"\n  discovered ${links?.size ?? 0} link(s)`,
  );

  if (!existsSync(outputDir)) {
    await mkdir(outputDir, { recursive: true });
  }

  // eslint-disable-next-line unicorn/no-unsafe-string-replacement
  const output = template.replace(BODY, `<body>${html}</body>`);
  const outputPath = path.join(outputDir, 'index.html');

  await writeFile(outputPath, output, { encoding: 'utf8' });

  console.log(`💾 written "${outputPath}"`);

  return links;
};

// The site's own pages: its links under its public path (not another
// site's, nor this page's anchors, `#…`), without it and their fragments.
const ownPages = (links: Set<string>) => {
  const result = new Set<string>();

  for (const link of links) {
    if (!link.startsWith(publicPath)) continue;
    result.add(link.slice(publicPath.length).replace(/#.*/u, '') || '.');
  }

  return result;
};

// Pages failing to render (by location): reported, not lost, the build
// failing after the others are written.
const failures = new Map<string, unknown>();

const walk = async (location: string): Promise<void> => {
  let links: Set<string> | undefined;
  try {
    links = await render(location);
  } catch (error) {
    failures.set(location, error);
    console.error(`❌ failed to prerender "${location}"`, error);
    return;
  }
  if (!links) return;

  await Promise.all(Array.from(ownPages(links)).map((link) => walk(link)));
};

await walk('.');
await walk(KITCHEN_SINK_PATH);
// (The iOS 27 blur test page: its own, and each variant's, see
// demo/ios27-blur/main.tsx.)
await walk('ios27-blur');
await walk('ios27-status-bar');
await Promise.all(ios27BlurPaths.map((location) => walk(location)));

console.log(
  `✅ finished; prerendered ${handled.size - failures.size} of ${handled.size} links`,
);

if (failures.size > 0) {
  console.error(
    `❌ ${failures.size} failed: ${Array.from(failures.keys()).join(', ')}`,
  );
  exit(1);
}
