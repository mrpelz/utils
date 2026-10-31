/* eslint-disable no-console */

// eslint-disable-next-line spaced-comment
/// <reference types="node" />

import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { exit } from 'node:process';

import prerender, { locationStub } from 'preact-iso/prerender';

import { publicPath } from './demo/tooling/env.js';
import { iconsLoaded } from './demo/tooling/icons.js';
import { Demo } from './demo/tooling/main.js';

const BODY = '<body></body>';

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
  const suffixedLocation = path.join(location, './');
  const prefixedLocation = path.join(publicPath, suffixedLocation);

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

const stripFragments = (links: Set<string>) => {
  const result = new Set<string>();

  for (const link of links) {
    const stripped = link.replace(/#.*/, '');
    result.add(stripped);
  }

  return result;
};

const walk = async (location: string) => {
  const links = await render(location);
  if (!links) return;

  const strippedLinks = stripFragments(links);

  await Promise.allSettled(Array.from(strippedLinks).map((link) => walk(link)));
};

await walk('.');

console.log(`✅ finished; prerendered ${handled.size} links`);
