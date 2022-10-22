import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { config as dotenvConfig } from 'dotenv';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { Configuration as WebpackConfiguration, DefinePlugin } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

import { version } from '../package.json';

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration & { progress?: boolean };
}

dotenvConfig({ path: '../../.env' });

const isDev = process.env.NODE_ENV === 'development';

const config: Configuration = {
  entry: path.resolve(__dirname, '../src/index.tsx'),
  target: ['web', 'es5'],
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: 'auto',
    filename: () => {
      return 'js/[name].js';
    },
    hotUpdateChunkFilename: 'hot/[id].[fullhash].hot-update.js',
    hotUpdateMainFilename: 'hot/[runtime].[fullhash].hot-update.json'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, '../src')
    },
    fallback: {
      fs: false
    }
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
        exclude: /(node_modules)\/(?!.*(@sentry|@njzy\/ps4-pkg-info|buffer))/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              rootMode: 'upward',
              cacheDirectory: true
            }
          }
        ],
        resolve: {
          fullySpecified: false
        }
      },
      {
        test: /\.(js|ts)x?$/,
        exclude:
          /(node_modules)\/(?!.*(@sentry|@njzy\/ps4-pkg-info|buffer|python-struct|react-lazy-load-image-component|axios|webdav|router|history|nanoid))/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              rootMode: 'upward',
              cacheDirectory: true
            }
          }
        ]
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          isDev
            ? 'style-loader'
            : {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: '../'
                }
              },
          'css-loader',
          // 'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name]-[hash:base64:6].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new DefinePlugin({
      _app_version: JSON.stringify(version)
    }),
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    !isDev &&
      new MiniCssExtractPlugin({
        filename: 'css/[name].css'
      }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: 'PS4RPS',
      favicon: path.resolve(__dirname, '../public/favicon.ico')
    })
  ].filter(Boolean) as any
};

export default config;
