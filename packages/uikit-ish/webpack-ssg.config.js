import path from 'node:path';

import {
  dirBase,
  dirSrc,
  // @ts-ignore
} from '@mrpelz/boilerplate-dom/webpack.config.js';
// @ts-ignore
import configUpstream from '@mrpelz/boilerplate-preact/webpack.config.js';
import { deepmerge } from 'deepmerge-ts';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import {
  ModifySourcePlugin,
  ReplaceOperation,
} from 'modify-source-webpack-plugin';
import webpack from 'webpack';

const { PUBLIC_PATH: publicPath = '/' } = process.env;

export const dirDemo = path.resolve(dirBase, 'demo/__ssg__');

// @ts-ignore
/** @type {import('@mrpelz/boilerplate-dom/webpack.config.js').ConfigurationExtended} */
const configDownstream = {
  devServer: undefined,
  experiments: {
    outputModule: true,
  },
  externalsPresets: {
    node: true,
  },
  externalsType: 'module',
  node: {
    __dirname: false,
    __filename: false,
  },
  optimization: {
    minimize: false,
  },
  output: {
    assetModuleFilename: 'assets/[name].[hash][ext]',
    chunkFilename: '[name].js',
    chunkFormat: 'module',
    chunkLoading: 'import',
    filename: 'main.js',
    library: {
      type: 'module',
    },
    module: true,
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

config.entry = path.resolve(dirSrc, 'demo-ssg.tsx');

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
            configFile: path.resolve(dirBase, 'tsconfig.demo-ssg.json'),
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
      generator: {
        emit: false,
      },
      test: /\.css$/i,
      type: 'asset/resource',
    },
    {
      generator: {
        emit: false,
      },
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
        test: new RegExp(`^${path.resolve(dirSrc, 'demo/env.ts')}$`),
      },
    ],
  }),
  // Client-only, never imported while prerendering (from effects): Monaco
  // (src/demo/frame/code-view.tsx) and Mermaid (src/demo/hig-guide/parts.tsx),
  // left out entirely.
  // @ts-ignore
  new webpack.IgnorePlugin({
    resourceRegExp: /^(?:mermaid|monaco-editor\/.*)$/u,
  }),
  // @ts-ignore
  new ForkTsCheckerWebpackPlugin(),
];

// @ts-ignore
/** @type {import('@mrpelz/boilerplate-dom/webpack.config.js').ConfigurationExtended} */
export default config;
