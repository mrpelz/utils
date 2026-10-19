// eslint-disable-next-line spaced-comment
/// <reference types="node" />

import prerender, { locationStub } from 'preact-iso/prerender';

import { Demo } from './demo/main.js';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line unicorn/no-global-object-property-assignment
global.CSS = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  escape: (_input: string) => '',
};

locationStub('/');

// eslint-disable-next-line no-console
console.log(await prerender(<Demo />));
