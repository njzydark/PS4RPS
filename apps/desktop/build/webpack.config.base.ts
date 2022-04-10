import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import path from 'path';
import { Configuration, ContextReplacementPlugin } from 'webpack';

import pkg from '../package.json';

const config: Configuration = {
  target: 'electron-main',
  // @ts-ignore
  externals: [...Object.keys(pkg.dependencies || {}), { fsevents: "require('fsevents')" }],
  entry: {
    index: path.resolve(__dirname, '../src/index.ts'),
    preload: path.resolve(__dirname, '../src/preload.ts')
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist/main'),
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },
  node: {
    __dirname: false,
    __filename: false
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },
  stats: {
    hash: true,
    assets: false,
    modules: false,
    children: false
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false
        }
      },
      {
        test: /\.(js|ts)x?$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              rootMode: 'upward',
              cacheDirectory: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new ContextReplacementPlugin(/any-promise/),
    new CopyPlugin({
      patterns: [{ from: path.resolve(__dirname, '../assets'), to: path.resolve(__dirname, '../dist/assets') }]
    })
  ].filter(Boolean)
};

export default config;
