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
import webpack from 'webpack';

const { PUBLIC_PATH: publicPath = '/' } = process.env;

export const dirDemo = path.resolve(dirBase, 'demo/ssg');

// @ts-ignore
/** @type {import('@mrpelz/boilerplate-dom/webpack.config.js').ConfigurationExtended} */
const configDownstream = {
  devServer: undefined,
  optimization: {
    minimize: false,
  },
  output: {
    assetModuleFilename: 'assets/[name].[hash][ext]',
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
  target: 'node',
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
      test: /\.(?:png|jpe?g|gif)$/i,
      type: 'asset/resource',
    },
  ];
}

config.plugins = [
  // @ts-ignore
  new ForkTsCheckerWebpackPlugin(),
  // @ts-ignore
  new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
];

// @ts-ignore
/** @type {import('@mrpelz/boilerplate-dom/webpack.config.js').ConfigurationExtended} */
export default config;
