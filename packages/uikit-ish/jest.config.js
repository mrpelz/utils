// @ts-ignore
import configUpstream from '@mrpelz/boilerplate-preact/jest.config.js';
import { deepmerge } from 'deepmerge-ts';

/** @type {import('ts-jest').JestConfigWithTsJest} */
const configDownstream = {
  moduleNameMapper: {
    '^(\\./.+)\\.m?jsx?$': '$1',
    '^react$': 'preact/compat',
    '^react-dom$': 'preact/compat',
    '^react-dom/test-utils$': 'preact/test-utils',
    '^react/jsx-runtime$': 'preact/jsx-runtime',
  },
};

const config = deepmerge(configUpstream, configDownstream);

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default config;
