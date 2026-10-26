import { findPackageJSON } from 'node:module';
import path from 'node:path';

import {
  dirBase,
  dirSrc,
  webpackServe,
  // @ts-ignore
} from '@mrpelz/boilerplate-dom/webpack.config.js';
// @ts-ignore
import configUpstream from '@mrpelz/boilerplate-preact/webpack.config.js';
import { deepmerge } from 'deepmerge-ts';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import {
  ModifySourcePlugin,
  ReplaceOperation,
} from 'modify-source-webpack-plugin';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

const { PUBLIC_PATH: publicPath = '/' } = process.env;

export const dirDemo = path.resolve(dirBase, 'demo');

// @ts-ignore
/** @type {import('@mrpelz/boilerplate-dom/webpack.config.js').ConfigurationExtended} */
const configDownstream = {
  devServer: {
    allowedHosts: 'all',
    client: {
      overlay: false,
      reconnect: true,
      webSocketURL: 'auto://0.0.0.0:0/ws',
    },
    historyApiFallback: { index: `${publicPath}index.html` },
    host: '::1',
    hot: webpackServe,
    liveReload: false,
    static: {
      directory: dirDemo,
      publicPath,
    },
  },
  optimization: {
    minimize: !webpackServe,
  },
  output: {
    assetModuleFilename: 'assets/[name][ext]',
    path: dirDemo,
    publicPath,
  },
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime',
    },
    conditionNames: ['import'],
  },
};

// @ts-ignore
/** @type {import('@mrpelz/boilerplate-dom/webpack.config.js').ConfigurationExtended} */
const config = deepmerge(configUpstream, configDownstream);

config.entry = path.resolve(dirSrc, 'demo.tsx');

if (config.module) {
  config.module.rules = [
    {
      exclude: /node_modules/,
      include: dirSrc,
      test: /\.tsx?$/i,
      use: [
        {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(dirBase, 'tsconfig.demo.json'),
            transpileOnly: true,
          },
        },
      ],
    },
    {
      enforce: 'pre',
      exclude: /node_modules/,
      test: /\.js$/i,
      use: ['source-map-loader'],
    },
    {
      test: /\.css$/i,
      use: [MiniCssExtractPlugin.loader, 'css-loader'],
    },
    {
      // (Also Monaco's icon font, see MonacoWebpackPlugin.)
      test: /\.(?:png|jpe?g|gif|ttf)$/i,
      type: 'asset/resource',
    },
  ];
}

config.plugins = [
  // @ts-ignore
  new ModifySourcePlugin({
    rules: [
      {
        operations: [
          new ReplaceOperation(
            'once',
            // eslint-disable-next-line unicorn/prefer-string-raw
            String.raw`/** {publicPath} */ '<publicPath>'`,
            `'${publicPath}'`,
          ),
        ],
        test: new RegExp(`^${path.resolve(dirSrc, 'demo/tooling/env.ts')}$`),
      },
    ],
  }),
  // @ts-ignore
  new HtmlWebpackPlugin({
    base: publicPath,
    // The page under the device's safe areas (the notch, the home
    // indicator): their insets in `env(safe-area-inset-*)`, kept clear by
    // the library (see styles.css) and the guide's layout.
    meta: {
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
    },
    title: '@mrpelz/uikit-ish',
  }),
  // @ts-ignore
  new MiniCssExtractPlugin(),
  // Monaco (see src/demo/tooling/frame/code-view.tsx): its editor and worker, with
  // the TypeScript (and JSX) tokenizer only, as code is only shown.
  // @ts-ignore
  new MonacoWebpackPlugin({
    customLanguages: [
      {
        entry: 'vs/languages/definitions/typescript/register',
        label: 'typescript',
      },
    ],
    languages: [],
    // (Its package, its files hidden by its exports: found by its package.json.)
    monacoEditorPath: path.dirname(
      findPackageJSON('monaco-editor', import.meta.url) ?? '',
    ),
  }),
  // @ts-ignore
  new ForkTsCheckerWebpackPlugin(),
];

// @ts-ignore
/** @type {import('@mrpelz/boilerplate-dom/webpack.config.js').ConfigurationExtended} */
export default config;
