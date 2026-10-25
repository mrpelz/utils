/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- files are read one after another */

// Which test files to run for the changes since the last commit (`--changed`
// in run.js): those opening demos affected by them. A demo is affected if
// its own files changed, or it uses a changed component (or one importing
// a changed component, transitively). Changes to shared files (styles,
// utilities, glass, typography, the demo's frame, the test harness, the
// configuration) affect all of them; a changed test file runs itself.

import { execFileSync } from 'node:child_process';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const sourceFile = /\.tsx?$/u;
const componentFile = /^src\/components\/(?<name>[\w-]+)\.tsx?$/u;

/** Files whose changes affect every test (relative to the package). */
const shared = [
  /^src\/styles\.tsx$/u,
  /^src\/components\/(?:utils|glass|typography)\.tsx?$/u,
  /^src\/components\/index\.ts$/u,
  /^src\/demo\/(?:main\.tsx|utils\/)/u,
  /^scripts\/browser-tests\/(?:lib|run|changed)\.js$/u,
  /^(?:package\.json|tsconfig[^/]*\.json|webpack[^/]*|Makefile)$/u,
];

/**
 * The package's changed files (also untracked ones), relative to it.
 *
 * @param {string} packageDirectory
 * @returns {string[]}
 */
const changedFiles = (packageDirectory) => {
  const git = (/** @type {string[]} */ ...args) =>
    execFileSync('git', args, { cwd: packageDirectory, encoding: 'utf8' });
  const prefix = git('rev-parse', '--show-prefix').trim();

  return git('status', '--porcelain', '--untracked-files=all', '--', '.')
    .split('\n')
    .filter(Boolean)
    .flatMap((line) => line.slice(3).split(' -> '))
    .map((file) => file.replaceAll('"', ''))
    .map((file) =>
      file.startsWith(prefix) ? file.slice(prefix.length) : file,
    );
};

/**
 * Reads a file of the package (empty if there's none).
 *
 * @param {string} packageDirectory
 * @param {string} file
 * @returns {Promise<string>}
 */
const read = (packageDirectory, file) =>
  readFile(path.join(packageDirectory, file), 'utf8').catch(() => '');

/**
 * The changed components, and those importing them (transitively).
 *
 * @param {string} packageDirectory
 * @param {string[]} files
 * @returns {Promise<Set<string>>}
 */
const affectedComponents = async (packageDirectory, files) => {
  const names = await readdir(path.join(packageDirectory, 'src/components'));
  /** @type {Map<string, string[]>} */
  const imports = new Map();
  for (const file of names) {
    if (!sourceFile.test(file)) continue;
    const source = await read(packageDirectory, `src/components/${file}`);
    imports.set(
      file.replace(sourceFile, ''),
      Array.from(source.matchAll(/from '\.\/(?<module>[\w-]+)\.js'/gu)).map(
        ({ groups }) => groups?.module ?? '',
      ),
    );
  }

  const components = new Set(
    files.flatMap((file) => componentFile.exec(file)?.groups?.name ?? []),
  );
  for (let grown = true; grown;) {
    grown = false;
    for (const [name, dependencies] of imports) {
      if (
        components.has(name) ||
        dependencies.every((dependency) => !components.has(dependency))
      ) {
        continue;
      }

      components.add(name);
      grown = true;
    }
  }

  return components;
};

/**
 * The names the components export (as demos use them).
 *
 * @param {string} packageDirectory
 * @param {Set<string>} components
 * @returns {Promise<string[]>}
 */
const exportsOf = async (packageDirectory, components) => {
  const index = await read(packageDirectory, 'src/components/index.ts');

  return Array.from(
    index.matchAll(
      /export \{(?<names>[^}]*)\} from '\.\/(?<module>[\w-]+)\.js'/gu,
    ),
  )
    .filter(({ groups }) => components.has(groups?.module ?? ''))
    .flatMap(({ groups }) => (groups?.names ?? '').split(','))
    .map((name) => name.replace(/^\s*type\s+/u, '').trim())
    .filter(Boolean);
};

/**
 * The ids of the demos changed, or using any of `names`.
 *
 * @param {string} packageDirectory
 * @param {string[]} files
 * @param {string[]} names
 * @returns {Promise<Set<string>>}
 */
const affectedDemoIds = async (packageDirectory, files, names) => {
  const entries = await readdir(path.join(packageDirectory, 'src/demo/docs'), {
    withFileTypes: true,
  });
  /** @type {Set<string>} */
  const ids = new Set();

  for (const entry of entries) {
    const { name: demo } = entry;
    if (!entry.isDirectory() || demo === 'utils') continue;
    const sources = await Promise.all(
      ['main.tsx', 'props.tsx', 'props.ts'].map((file) =>
        read(packageDirectory, `src/demo/docs/${demo}/${file}`),
      ),
    );
    const source = sources.join('\n');
    const changed = files.some((file) =>
      file.startsWith(`src/demo/docs/${demo}/`),
    );
    const uses = names.some((name) =>
      new RegExp(String.raw`\b${name}\b`, 'u').test(source),
    );
    if (!changed && !uses) continue;

    for (const { groups } of source.matchAll(
      /\bid(?:=|: )["'](?<id>[\w-]+)["']/gu,
    )) {
      if (groups?.id) ids.add(groups.id);
    }
  }

  return ids;
};

/**
 * The test files (names) to run for the changes, or `undefined` for all.
 *
 * @param {string} packageDirectory
 * @param {string} testsDirectory
 * @param {string[]} [files] the changed files (default: git's)
 * @returns {Promise<Set<string> | undefined>}
 */
export const affectedTests = async (
  packageDirectory,
  testsDirectory,
  files = changedFiles(packageDirectory),
) => {
  if (files.some((file) => shared.some((pattern) => pattern.test(file)))) {
    return undefined;
  }

  const components = await affectedComponents(packageDirectory, files);
  const names = await exportsOf(packageDirectory, components);
  const ids = await affectedDemoIds(packageDirectory, files, names);

  // Test files changed themselves, or opening affected demos.
  /** @type {Set<string>} */
  const tests = new Set();
  for (const file of await readdir(testsDirectory)) {
    const source = await readFile(path.join(testsDirectory, file), 'utf8');
    const opened = Array.from(
      source.matchAll(/(?:page\.open\(|const \w+ = )'(?<id>[\w-]+)'/gu),
    ).map(({ groups }) => groups?.id ?? '');
    if (
      files.includes(`scripts/browser-tests/tests/${file}`) ||
      opened.some((id) => ids.has(id))
    ) {
      tests.add(file);
    }
  }

  return tests;
};
