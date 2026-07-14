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
    historyApiFallback: true,
    host: '::1',
    hot: true,
    liveReload: false,
  },
  optimization: {
    minimize: !webpackServe,
  },
  output: {
    assetModuleFilename: 'assets/[name][ext]',
    chunkFormat: false,
    publicPath: '/',
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

config.entry = [
  path.resolve(dirSrc, 'main.ts'),
  path.resolve(dirSrc, 'main.css'),
];

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
            configFile: path.resolve(dirBase, 'tsconfig.build.json'),
            transpileOnly: true,
          },
        },
      ],
    },
    {
      exclude: /node_modules/,
      include: path.resolve(dirSrc, 'workers'),
      test: /\.ts$/i,
      use: [
        {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(dirSrc, 'workers/tsconfig.build.json'),
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
  ];
}

config.plugins = [
  new HtmlWebpackPlugin({
    title: '@mrpelz/base-ui-styled',
  }),
  new MiniCssExtractPlugin(),
  new ForkTsCheckerWebpackPlugin(),
];

// @ts-ignore
/** @type {import('@mrpelz/boilerplate-dom/webpack.config.js').ConfigurationExtended} */
export default config;
