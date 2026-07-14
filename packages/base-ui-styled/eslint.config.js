import {
  config as configUpstream,
  configMeta,
  // @ts-ignore
} from '@mrpelz/boilerplate-preact/eslint.config.js';
import { deepmerge } from 'deepmerge-ts';
import react from 'eslint-plugin-react';

/** @type {import('eslint').Linter.Config} */
const configDownstream = {
  languageOptions: {
    parserOptions: react.configs.recommended.parserOptions,
  },
  plugins: {
    react,
  },
  rules: {
    ...react.configs.recommended.rules,
    '@typescript-eslint/naming-convention': 'off',
    'react/display-name': 'off',
    'react/function-component-definition': 'off',
    'react/jsx-curly-brace-presence': [
      'error',
      {
        children: 'never',
        propElementValues: 'always',
        props: 'never',
      },
    ],
    'react/jsx-filename-extension': 'off',
    'react/jsx-indent': 'off',
    'react/jsx-indent-props': ['error', 2],
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-sort-props': [
      'error',
      {
        callbacksLast: true,
        ignoreCase: true,
        multiline: 'last',
        noSortAlphabetically: false,
        reservedFirst: true,
        shorthandFirst: true,
      },
    ],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'sort-keys': 'off',
  },
  settings: {
    react: {
      version: '16.0',
    },
  },
};

/** @type {import('eslint').Linter.Config} */
export const config = deepmerge(configUpstream, configDownstream);
config.files = ['src/**/*.{js,jsx,ts,tsx}'];

if (config.rules?.['prettier/prettier']) {
  config.rules['prettier/prettier'] = [
    'error',
    {
      singleAttributePerLine: true,
      singleQuote: true,
    },
    {
      usePrettierrc: false,
    },
  ];
}

/** @type {import('eslint').Linter.Config[]} */
export default [configMeta, config];
