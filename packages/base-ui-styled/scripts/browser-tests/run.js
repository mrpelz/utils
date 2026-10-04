/* eslint-disable no-await-in-loop -- tests run sequentially by design */

// Runs the headless browser tests against a fresh development build of the
// demo.
//
// Usage: node scripts/browser-tests/run.js [filter] [--changed]
//   [--screenshots <dir>]
// - filter: only run tests whose name contains this string
// - --changed: only run the test files affected by the changes since the
//   last commit (see changed.js)
// - --screenshots: save screenshots taken by tests to this directory
// Set CHROME to the Chrome executable if it is not found automatically.

import { mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { affectedTests } from './changed.js';
import { buildDemo, launchBrowser, Page, serve } from './lib.js';

const directory = path.dirname(fileURLToPath(import.meta.url));
const packageDirectory = path.resolve(directory, '../..');

const argv = process.argv.slice(2);
const screenshotsIndex = argv.indexOf('--screenshots');
const screenshotDirectory =
  screenshotsIndex === -1
    ? undefined
    : path.resolve(argv.splice(screenshotsIndex, 2)[1] ?? 'screenshots');
const changedIndex = argv.indexOf('--changed');
if (changedIndex !== -1) argv.splice(changedIndex, 1);
const [filter = ''] = argv;

if (screenshotDirectory) await mkdir(screenshotDirectory, { recursive: true });

/** @type {import('./lib.js').Test[]} */
const tests = [];
const testsDirectory = path.join(directory, 'tests');
const affected =
  changedIndex === -1
    ? undefined
    : await affectedTests(packageDirectory, testsDirectory);
if (affected) {
  process.stdout.write(
    `Changed: ${[...affected].toSorted().join(', ') || 'no tests'}\n`,
  );
}
const allFiles = await readdir(testsDirectory);
const files = allFiles.filter((file) => !affected || affected.has(file));
for (const file of files.toSorted()) {
  /** @type {{ tests: import('./lib.js').Test[] }} */
  const module = await import(path.join(directory, 'tests', file));
  tests.push(...module.tests.filter(({ name }) => name.includes(filter)));
}

const outputPath = await buildDemo(packageDirectory);
const server = await serve(outputPath);
const browser = await launchBrowser();
await browser.send('Page.enable');

let failures = 0;

for (const test of tests) {
  try {
    await test.run(new Page(browser, server.url, screenshotDirectory));
    process.stdout.write(`✓ ${test.name}\n`);
  } catch (error) {
    failures += 1;
    process.stdout.write(
      `✗ ${test.name}\n  ${error instanceof Error ? error.message : String(error)}\n`,
    );
  }
}

await browser.close();
await server.close();
await rm(outputPath, { force: true, recursive: true });

process.stdout.write(`\n${tests.length - failures}/${tests.length} passed\n`);
process.exitCode = failures ? 1 : 0;
