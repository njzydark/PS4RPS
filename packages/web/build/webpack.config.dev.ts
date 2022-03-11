import { MiniReactRefreshWebpackPlugin } from '@njzy/mini-react-refresh-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import merge from 'webpack-merge';

import baseConfig from './webpack.config.base';

const config = merge(baseConfig, {
  mode: 'development',
  devtool: 'source-map',
  watchOptions: {
    aggregateTimeout: 600
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.[jt]sx?$/,
  //       exclude: /node_modules/,
  //       use: [
  //         {
  //           loader: require.resolve('babel-loader'),
  //           options: {
  //             rootMode: 'upward',
  //             plugins: [require.resolve('react-refresh/babel')]
  //           }
  //         }
  //       ]
  //     }
  //   ]
  // },
  devServer: {
    port: process.env.RENDERER_DEV_PORT,
    hot: true,
    compress: true,
    historyApiFallback: true
  },
  plugins: [
    new MiniReactRefreshWebpackPlugin({
      babelLoaderOptions: {
        rootMode: 'upward'
      }
    })
    // new ReactRefreshWebpackPlugin()
  ]
});

export default config;
