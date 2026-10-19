/* eslint-disable no-await-in-loop */
// eslint-disable-next-line spaced-comment
/// <reference types="node" />

import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { exit } from 'node:process';

import prerender, { locationStub } from 'preact-iso/prerender';

import { publicPath } from './demo/env.js';
import { Demo } from './demo/main.js';

const BODY = '<body></body>';

const demoDir = path.resolve(process.cwd(), 'demo');

const templatePath = path.join(demoDir, 'index.html');
if (!existsSync(templatePath)) {
  exit(1);
}

const template = await readFile(templatePath, { encoding: 'utf8' });
if (!template.includes(BODY)) {
  exit(1);
}

let links = new Set([publicPath]);
const handled = new Set<string>();

while (links.size > 0) {
  const link = Array.from(links).at(0);
  if (!link) break;
  if (handled.has(link)) continue;

  links.delete(link);
  handled.add(link);

  locationStub(link);

  const { html, links: discoveredLinks } = await prerender(<Demo />);
  if (!discoveredLinks) continue;

  const discoveredLinksWithoutFragments = new Set<string>();
  for (const discoveredLink of discoveredLinks) {
    const discoveredLinkWithoutFragment = discoveredLink.replace(/#.*/, '');
    if (!discoveredLinkWithoutFragment) continue;

    discoveredLinksWithoutFragments.add(discoveredLinkWithoutFragment);
  }

  links = links.union(discoveredLinksWithoutFragments.difference(handled));

  const linkDir = path.join(demoDir, link);
  // eslint-disable-next-line no-console
  console.log(link, linkDir);

  if (!existsSync(linkDir)) {
    await mkdir(linkDir, { recursive: true });
  }

  // eslint-disable-next-line unicorn/no-unsafe-string-replacement
  const templateContent = template.replace(BODY, `<body>${html}</body>`);

  await writeFile(path.join(linkDir, 'index.html'), templateContent, {
    encoding: 'utf8',
  });
}
